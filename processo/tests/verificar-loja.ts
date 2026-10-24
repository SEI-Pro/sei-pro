import { type Area, areaMemoria } from "@comum/armazenamento/area";
import { chaveCache } from "../src/modelo/constantes";
import { LojaProcesso } from "../src/modelo/loja";
import type { Fatia } from "../src/modelo/tipos";
import { checar, secao } from "./util";

const ESCOPO = "sei.exemplo.gov.br|fulano";
const sem = async () => {};
const deps = (extra: Record<string, unknown> = {}) => ({ agora: () => 1000, esperar: sem, ...extra });

export async function verificarLoja(): Promise<void> {
  secao("loja: carregar");
  {
    const loja = new LojaProcesso(areaMemoria(), ESCOPO, "10", deps());
    checar("fatia nunca carregada esta carregando", loja.ler("anotacao").estado === "carregando");
    const avisos: string[] = [];
    loja.aoMudar((n) => avisos.push(`${n}:${loja.ler(n).estado}`));
    await loja.carregar("anotacao", async () => ({ texto: "oi", prioridade: false }));
    const f = loja.ler<{ texto: string }>("anotacao");
    checar("carregar vira pronto", f.estado === "pronto" && f.dado?.texto === "oi" && f.em === 1000, f);
    checar("avisa carregando e pronto", avisos.join(",") === "anotacao:carregando,anotacao:pronto", avisos);
    checar("outra fatia nao e afetada", loja.ler("marcador").estado === "carregando" && !loja.ler("marcador").dado);
  }

  secao("loja: falha");
  {
    const loja = new LojaProcesso(areaMemoria(), ESCOPO, "10", deps());
    let chamadas = 0;
    await loja.carregar("marcador", async () => {
      chamadas++;
      throw new Error("sessao expirou");
    });
    const f = loja.ler("marcador");
    checar("carregar com falha tenta de novo e vira erro", chamadas === 2 && f.estado === "erro" && f.erro === "sessao expirou", { chamadas, f });
    let n = 0;
    await loja.carregar("marcador", async () => {
      n++;
      if (n === 1) throw new Error("falha passageira");
      return ["a"];
    });
    checar("segunda tentativa que da certo vira pronto", loja.ler("marcador").estado === "pronto" && n === 2);
    let outras = 0;
    await loja.carregar("anotacao", async () => { outras++; throw "texto"; }, { tentativas: 3 });
    checar("tentativas configuravel e erro nao-Error", outras === 3 && loja.ler("anotacao").erro === "texto", loja.ler("anotacao"));
  }

  secao("loja: cache");
  {
    const area = areaMemoria();
    const a = new LojaProcesso(area, ESCOPO, "10", deps());
    await a.carregar("anotacao", async () => ({ texto: "guardado" }));
    await a.carregar("atribuicao", async () => ({ usuario: "fulano" }));
    const bruto = (await area.obter(chaveCache(ESCOPO, "10")))[chaveCache(ESCOPO, "10")] as { fatias: Record<string, { dado: unknown }> } | undefined;
    checar("grava as fatias prontas numa chave por processo", !!bruto && Object.keys(bruto.fatias).sort().join() === "anotacao,atribuicao", bruto);

    const b = new LojaProcesso(area, ESCOPO, "10", deps({ agora: () => 5000 }));
    const vistos: Array<Fatia<unknown>> = [];
    let liberar!: (v: unknown) => void;
    const p = b.carregar("anotacao", () => {
      vistos.push(b.ler("anotacao"));
      return new Promise((r) => { liberar = r; });
    });
    await new Promise((r) => setTimeout(r, 5));
    checar(
      "cache pinta desatualizado antes de buscar",
      vistos[0]?.estado === "desatualizado" && (vistos[0].dado as { texto: string }).texto === "guardado" && vistos[0].em === 1000,
      vistos[0],
    );
    liberar({ texto: "novo" });
    await p;
    checar("depois da busca vira pronto com o dado novo", b.ler("anotacao").estado === "pronto" && (b.ler("anotacao").dado as { texto: string }).texto === "novo");

    const c = new LojaProcesso(area, ESCOPO, "10", deps());
    await c.carregar("anotacao", async () => { throw new Error("rede"); });
    const fc = c.ler("anotacao");
    checar("erro mantem o dado antigo do cache", fc.estado === "erro" && (fc.dado as { texto: string }).texto === "novo", fc);

    const outro = new LojaProcesso(area, ESCOPO, "11", deps());
    await outro.carregar("anotacao", async () => 1);
    checar("outro processo nao ve o cache de 10", outro.ler("anotacao").dado === 1);
  }

  secao("loja: cota cheia");
  {
    const base = areaMemoria();
    const cheia: Area = { ...base, gravar: async () => { throw new Error("QUOTA_BYTES quota exceeded"); } };
    const loja = new LojaProcesso(cheia, ESCOPO, "10", deps());
    let erro: unknown = null;
    try {
      await loja.carregar("anotacao", async () => ({ texto: "x" }));
      await loja.carregar("marcador", async () => ["m"]);
    } catch (e) { erro = e; }
    checar("cota cheia nao quebra", erro === null && loja.ler("anotacao").estado === "pronto" && loja.ler("marcador").estado === "pronto", erro);
    const area2 = areaMemoria();
    const loja2 = new LojaProcesso({ ...area2, obter: async () => { throw new Error("storage indisponivel"); } }, ESCOPO, "10", deps());
    await loja2.carregar("anotacao", async () => 7);
    checar("leitura do cache que falha tambem nao quebra", loja2.ler("anotacao").dado === 7);
  }

  secao("loja: fila");
  {
    const loja = new LojaProcesso(areaMemoria(), ESCOPO, "10", deps());
    const ordem: string[] = [];
    let ativas = 0;
    let max = 0;
    const tarefa = (nome: string, ms: number, falha = false) => () => {
      ativas++;
      max = Math.max(max, ativas);
      ordem.push(`ini ${nome}`);
      return new Promise<string>((res, rej) =>
        setTimeout(() => {
          ativas--;
          ordem.push(`fim ${nome}`);
          falha ? rej(new Error(nome)) : res(nome);
        }, ms),
      );
    };
    const r = await Promise.allSettled([loja.enfileirar(tarefa("a", 20)), loja.enfileirar(tarefa("b", 1, true)), loja.enfileirar(tarefa("c", 1))]);
    checar("fila serializa gravacoes", max === 1 && ordem.join() === "ini a,fim a,ini b,fim b,ini c,fim c", ordem);
    checar(
      "falha de uma nao trava as seguintes e propaga a quem pediu",
      r[0].status === "fulfilled" && r[1].status === "rejected" && r[2].status === "fulfilled",
      r.map((x) => x.status),
    );
  }

  secao("loja: sigiloso");
  {
    const area = areaMemoria();
    const loja = new LojaProcesso(area, ESCOPO, "10", deps({ sigiloso: true }));
    await loja.carregar("anotacao", async () => ({ texto: "segredo" }));
    checar("sigiloso nao grava cache", loja.ler("anotacao").estado === "pronto" && (await area.chaves!()).length === 0);
    const l2 = new LojaProcesso(area, ESCOPO, "12", deps());
    await l2.carregar("anotacao", async () => 1);
    checar("o cache de um processo ainda sem sigilo grava", (await area.chaves!()).length === 1);
    l2.sigiloso = true;
    await area.remover(chaveCache(ESCOPO, "12"));
    await l2.carregar("marcador", async () => 2);
    checar("marcar sigiloso depois tambem barra a gravacao", (await area.chaves!()).length === 0);
    const sem = new LojaProcesso(area, "|", "13", deps());
    await sem.carregar("anotacao", async () => 1);
    checar("escopo sem login nao grava", (await area.chaves!()).length === 0);
  }

  secao("loja: tetos do cache");
  {
    const area = areaMemoria();
    let t = 0;
    for (let i = 0; i < 205; i++) {
      const loja = new LojaProcesso(area, ESCOPO, String(i), { agora: () => ++t, esperar: sem });
      await loja.carregar("anotacao", async () => ({ i }));
    }
    const chaves = (await area.chaves!()).filter((k) => k.startsWith("processo/"));
    checar("poda os mais antigos acima de 200 processos", chaves.length <= 200 && chaves.includes(chaveCache(ESCOPO, "204")) && !chaves.includes(chaveCache(ESCOPO, "0")), chaves.length);

    const area2 = areaMemoria();
    const grande = new LojaProcesso(area2, ESCOPO, "1", deps());
    await grande.carregar("dadosProcesso", async () => ({ texto: "x".repeat(200_000) }));
    checar("entrada acima do teto fica so na memoria", (await area2.chaves!()).length === 0 && grande.ler("dadosProcesso").estado === "pronto");
  }
}
