import { AppComparador, type DepsApp } from "@cd/app/app";
import { criarComparador } from "@cd/app/trabalhador";
import { DOCTYPE_DOWNLOAD } from "@cd/modelo/constantes";
import { DOMParser } from "linkedom";
import { botao, checar, combo, escolherCombo, igual, instalarDom, secao, tique } from "./util";

const html = (...paragrafos: string[]): string => `<html><body>${paragrafos.map((p) => `<p>${p}</p>`).join("")}</body></html>`;
const DOCS: Record<string, string> = {
  "1": html("O contrato vale por doze meses.", "Cláusula segunda igual."),
  "2": html("O contrato vale por vinte e quatro meses.", "Cláusula segunda igual."),
  "3": html("O contrato vale por doze meses.", "Cláusula segunda igual."),
};

interface Roteiro {
  idA?: string | null;
  aLegivel?: boolean;
  falharConteudo?: string;
  tipos?: Array<{ id: string; nome: string }>;
}

function montar(r: Roteiro = {}) {
  instalarDom();
  const raiz = document.createElement("div");
  document.body.append(raiz);
  const reg = {
    chamadas: [] as Array<{ op: string; args: unknown; prazo?: number }>,
    fechou: 0,
    baixados: [] as Array<[string, string, string]>,
    modais: [] as string[],
    fecharModal: 0,
  };
  const idA = r.idA === undefined ? "1" : r.idA;
  const rpc: DepsApp["rpc"] = {
    chamar: (async (op: string, args?: unknown, prazo?: number) => {
      reg.chamadas.push({ op, args, prazo });
      await tique(0);
      if (op === "contexto") return { ok: true, idA, tituloA: idA ? `Doc ${idA}` : "", host: "sei.x" };
      if (op === "candidatos")
        return {
          ok: true,
          aLegivel: r.aLegivel ?? idA !== null,
          candidatos: [
            { id: "2", numero: "0002", titulo: "Doc 2" },
            { id: "3", numero: "0003", titulo: "Doc 3" },
          ],
        };
      if (op === "conteudo") {
        const id = (args as { id: string }).id;
        if (id === r.falharConteudo) return { ok: false, erro: "Sessão expirada." };
        return { ok: true, html: DOCS[id] };
      }
      if (op === "tipos") return { ok: true, tipos: r.tipos ?? [{ id: "12", nome: "Despacho" }] };
      if (op === "criar") return { ok: true, numero: "0099" };
      return { ok: true };
    }) as never,
  };
  const deps: DepsApp = {
    rpc,
    comparador: criarComparador("x.js", () => {
      throw new Error("sem worker nas provas");
    }),
    fechar: () => reg.fechou++,
    abrirModal: ({ titulo, conteudo, aoFechar }) => {
      reg.modais.push(titulo);
      const caixa = document.createElement("div");
      caixa.className = "modal-falso";
      caixa.append(conteudo);
      document.body.append(caixa);
      return {
        fechar: () => {
          reg.fecharModal++;
          caixa.remove();
          aoFechar?.();
        },
      };
    },
    baixar: (nome, conteudo, tipo) => reg.baixados.push([nome, conteudo, tipo]),
    parser: new DOMParser() as unknown as globalThis.DOMParser,
    produto: "SEI Pro",
  };
  const app = new AppComparador(raiz, deps);
  return { app, raiz, reg };
}

const srcdoc = (raiz: HTMLElement): string => raiz.querySelector("iframe.cmp-resultado")?.getAttribute("srcdoc") ?? "";
const conteudos = (reg: ReturnType<typeof montar>["reg"]): number => reg.chamadas.filter((c) => c.op === "conteudo").length;

export async function verificarApp(): Promise<void> {
  secao("app: abertura e comparacao");
  {
    const { app, raiz, reg } = montar();
    await app.iniciar();
    checar("mostra o A", /Doc 1/.test(raiz.querySelector(".cmp-a")?.textContent ?? ""), raiz.querySelector(".cmp-a")?.textContent);
    checar("seletor de B existe e habilitado", !!combo(raiz, "Documento B") && !combo(raiz, "Documento B")!.disabled, "");
    checar(
      "A e a lista foram pedidos juntos, A ja lido antes do B",
      reg.chamadas
        .map((c) => c.op)
        .slice(0, 4)
        .includes("conteudo"),
      reg.chamadas.map((c) => c.op),
    );
    escolherCombo(raiz, "Documento B", "2");
    await tique(30);
    const lentas = reg.chamadas.filter((c) => ["candidatos", "conteudo"].includes(c.op));
    checar(
      "leituras do SEI (lista e conteudo) com prazo de 60 s, nao os 15 s padrao",
      lentas.length >= 2 && lentas.every((c) => (c.prazo ?? 0) >= 60_000),
      lentas.map((c) => `${c.op}:${c.prazo}`),
    );
    const s = srcdoc(raiz);
    checar("B escolhido gera resultado com ins e del", /<ins/.test(s) && /<del/.test(s), s);
    checar("iframe do resultado e sandbox sem scripts", raiz.querySelector("iframe.cmp-resultado")?.getAttribute("sandbox") === "", "");
    app.destruir();
  }

  secao("app: iguais, inverter e cache");
  {
    const { app, raiz } = montar();
    await app.iniciar();
    escolherCombo(raiz, "Documento B", "3");
    await tique(30);
    checar("documentos iguais: mensagem", /Os dois documentos são iguais\./.test(raiz.textContent ?? ""), raiz.textContent);
    checar(
      "documentos iguais: sem iframe e Baixar desabilitado",
      !raiz.querySelector("iframe.cmp-resultado") && botao(raiz, "Baixar")!.disabled,
      "",
    );
    app.destruir();
  }
  {
    const { app, raiz, reg } = montar();
    await app.iniciar();
    escolherCombo(raiz, "Documento B", "2");
    await tique(30);
    const antesDeInverter = conteudos(reg);
    const normal = srcdoc(raiz);
    botao(raiz, "Inverter (A/B → B/A)")!.click();
    await tique(30);
    igual("inverter nao refaz pedido de conteudo", conteudos(reg), antesDeInverter);
    const invertido = srcdoc(raiz);
    checar(
      "inverter troca o que e ins e o que e del",
      normal !== invertido && /<ins[^>]*>[^<]*vinte/.test(normal) && /<del[^>]*>[^<]*vinte/.test(invertido),
      { normal, invertido },
    );
    igual("aria-pressed do inverter", botao(raiz, "Inverter (A/B → B/A)")!.getAttribute("aria-pressed"), "true");
    app.destruir();
  }

  secao("app: sem A, erro e A ilegivel");
  {
    const { app, raiz } = montar({ idA: null });
    await app.iniciar();
    checar("sem A: aviso", /Nenhum documento selecionado na árvore do processo/.test(raiz.textContent ?? ""), raiz.textContent);
    checar("sem A: seletor de B desabilitado", combo(raiz, "Documento B")?.disabled === true, "");
    app.destruir();
  }
  {
    const { app, raiz } = montar({ aLegivel: false });
    await app.iniciar();
    checar("A anexo/cancelado: aviso proprio", /não pode ser comparado/.test(raiz.textContent ?? ""), raiz.textContent);
    app.destruir();
  }
  {
    const { app, raiz, reg } = montar({ falharConteudo: "2" });
    await app.iniciar();
    escolherCombo(raiz, "Documento B", "2");
    await tique(30);
    checar(
      "erro de conteudo: mensagem na area do resultado",
      /Sessão expirada\./.test(raiz.querySelector(".cmp-corpo")?.textContent ?? ""),
      raiz.textContent,
    );
    igual("erro de conteudo: modal segue aberto", reg.fechou, 0);
    escolherCombo(raiz, "Documento B", "3");
    await tique(30);
    checar("depois do erro, outro B funciona", /Os dois documentos são iguais\./.test(raiz.textContent ?? ""), raiz.textContent);
    app.destruir();
  }

  secao("app: baixar e criar");
  {
    const { app, raiz, reg } = montar();
    await app.iniciar();
    escolherCombo(raiz, "Documento B", "2");
    await tique(30);
    botao(raiz, "Baixar")!.click();
    const [nome, conteudo, tipo] = reg.baixados[0] ?? ["", "", ""];
    igual("nome do arquivo", nome, "Comparativo Doc 1 - Doc 2 (SEI Pro).html");
    checar("BOM e doctype do legado", conteudo.startsWith(`﻿${DOCTYPE_DOWNLOAD}`) && /<ins/.test(conteudo), conteudo.slice(0, 120));
    igual("tipo MIME", tipo, "text/html;charset=utf-8");

    botao(raiz, "Criar Novo Documento")!.click();
    await tique(30);
    const caixa = document.querySelector(".modal-falso")!;
    const criar = botao(caixa, "Criar")!;
    checar("criar sem tipo escolhido: botao desabilitado", criar.disabled === true, "");
    escolherCombo(caixa, "Tipo do documento", "12");
    checar("com tipo: habilitado", criar.disabled === false, "");
    criar.click();
    await tique(30);
    const pedidos = reg.chamadas.filter((c) => c.op === "criar");
    igual("criar chamado uma vez", pedidos.length, 1);
    const a = pedidos[0]!.args as { tipoId: string; idB: string; html: string };
    checar("criar leva tipo, B e o html do resultado", a.tipoId === "12" && a.idB === "2" && /<ins/.test(a.html), a);
    checar(
      "depois de criar: aviso com o numero e modal fechado",
      /0099/.test(raiz.textContent ?? "") && reg.fecharModal === 1,
      raiz.textContent,
    );
    app.destruir();
  }

  secao("app: fechar");
  {
    const { app, raiz, reg } = montar();
    await app.iniciar();
    botao(raiz, "Fechar")!.click();
    igual("X fecha", reg.fechou, 1);
    checar("nao existe botao Cancelar", !botao(raiz, "Cancelar"), "");
    app.destruir();
  }
}
