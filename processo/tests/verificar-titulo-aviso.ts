/**
 * Título da aba e aviso de documentos não assinados (etapa 7). O linkedom não simula <dialog> modal: `fingirDialogos`
 * dá o mínimo (open/close), e o que depende do navegador de verdade (clique na árvore do SEI) se prova ao vivo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaMemoria } from "@comum/armazenamento/area";
import { lerArvore } from "@nucleo/dominio/arvore";
import type { Andamento } from "@nucleo/dominio/historico";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { pastasFechadas } from "../src/capa/cards";
import { LojaProcesso } from "../src/modelo/loja";
import { documentosDaArvore, montarAviso } from "../src/pagina/aviso/aviso";
import { ehEnviarProcesso } from "../src/pagina/aviso/ligar";
import { comDatas, datasDeGeracao, pendentesDaUnidade } from "../src/pagina/aviso/modelo";
import { ehTopoDoProcesso, marcarTituloEAviso } from "../src/pagina/marca";
import { ligarTitulo, montarTitulo } from "../src/pagina/titulo";
import { fingirDialogos } from "./dialogo";
import { checar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const fixture = (arquivo: string) =>
  readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41", arquivo), "utf8").replace(/^<!-- url: .*? -->\n/, "");
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";
definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const novoDoc = (html: string): Document => new DOMParser().parseFromString(html, "text/html") as unknown as Document;

const dadosProcesso = (especificacao: string) => ({
  disponivel: true,
  valor: {
    tipo: "T",
    especificacao,
    assuntos: [],
    interessados: [],
    observacoes: "",
    observacoesOutras: [],
    editavel: true,
    nivel: "publico",
  },
});

export async function verificarTituloEAviso(): Promise<void> {
  secao("titulo: formato do legado");
  checar(
    "com especificacao",
    montarTitulo("Compra de canetas", "99906.713-630.000032/2025-82") === "Compra de canetas | SEI - Processo 99906.713-630.000032/2025-82",
  );
  checar("espacos repetidos e quebras viram um espaco", montarTitulo("  A   B\nC ", "1") === "A B C | SEI - Processo 1");
  checar(
    "sem especificacao: sem a barra sobrando",
    montarTitulo("", "1") === "SEI - Processo 1" && montarTitulo("   ", "1") === "SEI - Processo 1",
  );
  checar("marcas (URGENTE) entram como no legado", montarTitulo("Contrato (URGENTE)", "1") === "Contrato (URGENTE) | SEI - Processo 1");

  secao("titulo: a partir da loja, sem iframe oculto");
  {
    const topo = instalarDom("<html><head><title>SEI</title></head><body></body></html>");
    const escopo = "treinamento.sei.sp.gov.br|usuario.teste";
    const area = areaMemoria({});
    const loja = new LojaProcesso(area, escopo, "148265", { esperar: async () => {} });
    const parar = ligarTitulo({ topo, loja, protocolo: "99906.713-630.000032/2025-82", sigiloso: false, consultasDesativadas: false });
    checar("sem dado, o titulo do SEI fica como esta", topo.title === "SEI");
    loja.definir("dadosProcesso", { estado: "carregando", em: 1 });
    checar("carregando: continua", topo.title === "SEI");
    loja.definir("dadosProcesso", { estado: "desatualizado", dado: dadosProcesso("Do cache"), em: 1 });
    checar("cache pinta o titulo na hora", topo.title === "Do cache | SEI - Processo 99906.713-630.000032/2025-82", topo.title);
    loja.definir("dadosProcesso", { estado: "pronto", dado: dadosProcesso("Da rede"), em: 2 });
    checar("a rede confirma e troca", topo.title === "Da rede | SEI - Processo 99906.713-630.000032/2025-82", topo.title);
    loja.definir("dadosProcesso", { estado: "erro", dado: dadosProcesso("Da rede"), erro: "x", em: 3 });
    checar("erro ao atualizar mantem o dado", topo.title === "Da rede | SEI - Processo 99906.713-630.000032/2025-82");
    loja.definir("dadosProcesso", { estado: "pronto", dado: { disponivel: false, motivo: "acao" }, em: 4 });
    checar("leitura indisponivel nao mexe no titulo", topo.title === "Da rede | SEI - Processo 99906.713-630.000032/2025-82");
    loja.definir("anotacao", { estado: "pronto", dado: { disponivel: true, valor: null }, em: 5 });
    checar("outra fatia nao refaz o titulo", topo.title.startsWith("Da rede"));
    parar();
    loja.definir("dadosProcesso", { estado: "pronto", dado: dadosProcesso("Depois de parar"), em: 6 });
    checar("desligado, nao muda mais", topo.title.startsWith("Da rede"));
  }
  {
    const topo = instalarDom("<html><head><title>SEI</title></head><body></body></html>");
    const loja = new LojaProcesso(areaMemoria({}), "h|u", "1", { sigiloso: true, esperar: async () => {} });
    ligarTitulo({ topo, loja, protocolo: "034.00000265/2026-31", sigiloso: true, consultasDesativadas: false });
    loja.definir("dadosProcesso", { estado: "pronto", dado: dadosProcesso("Segredo"), em: 1 });
    checar("sigiloso: a especificacao nunca vai para o titulo", topo.title === "SEI");
    const loja2 = new LojaProcesso(areaMemoria({}), "h|u", "1", { esperar: async () => {} });
    ligarTitulo({ topo, loja: loja2, protocolo: "1", sigiloso: false, consultasDesativadas: true });
    loja2.definir("dadosProcesso", { estado: "pronto", dado: dadosProcesso("X"), em: 1 });
    checar("disablequery: o titulo do SEI fica como esta", topo.title === "SEI");
  }

  secao("cessao: atributos na janela de topo");
  {
    const doc = instalarDom("<html><head></head><body></body></html>");
    marcarTituloEAviso(doc);
    checar(
      "titulo e aviso cedem por atributos proprios",
      doc.documentElement.hasAttribute("data-seipro-processo-titulo") && doc.documentElement.hasAttribute("data-seipro-processo-aviso"),
    );
    const topoJ = { location: { search: "?acao=procedimento_trabalhar&id_procedimento=1" } } as unknown as Window;
    (topoJ as { top: Window }).top = topoJ;
    checar("a janela de topo do processo", ehTopoDoProcesso(topoJ));
    const quadro = { location: { search: "?acao=procedimento_enviar&acao_origem=x&id_procedimento=1" }, top: topoJ } as unknown as Window;
    checar("o quadro do Enviar Processo", ehEnviarProcesso(quadro));
    const outro = { location: { search: "?acao=procedimento_enviar_x" }, top: topoJ } as unknown as Window;
    checar("so a acao exata", !ehEnviarProcesso(outro) && !ehEnviarProcesso(topoJ));
  }

  secao("aviso: modelo (arvore real do SEI SP)");
  const arvDoc = novoDoc(fixture("arvore_completa.html"));
  const arv = lerArvore(paginaDe(arvDoc, URL_ARVORE));
  const pend = pendentesDaUnidade(arv.documentos, "TESTE");
  checar(
    "pendentes da unidade TESTE: so editor, sem assinatura, nao cancelado",
    pend.length > 10 && pend.every((p) => arv.documentos.find((d) => d.id === p.id)?.assinado === false),
    pend.length,
  );
  checar(
    "o mesmo conjunto do chip Nao assinados do filtro",
    pend.length ===
      arv.documentos.filter((d) => d.formato === "interno" && !d.assinado && !d.cancelado && d.unidadeGeradora === "TESTE").length,
  );
  checar("outra unidade: nada pendente (a geradora e TESTE)", pendentesDaUnidade(arv.documentos, "OUTRA").length === 0);
  checar("sigla sem caixa", pendentesDaUnidade(arv.documentos, "teste").length === pend.length);
  const sem = arv.documentos.map((d) => ({ ...d, unidadeGeradora: undefined }));
  checar("sem unidade geradora na arvore (SEI 3.x): vale o documento", pendentesDaUnidade(sem, "QUALQUER").length >= pend.length);
  {
    // formato do SEI 5 (a unidade geradora vem em UNIDADE_GERADORA; cancelado e externo nao contam; circular conta)
    const doc = (id: string, o: Partial<(typeof arv.documentos)[number]>) =>
      ({
        ...arv.documentos[0],
        id,
        numero: `00${id}`,
        titulo: `Doc ${id}`,
        assinado: false,
        cancelado: false,
        externo: false,
        formato: "interno",
        unidadeGeradora: "TESTE",
        ...o,
      }) as (typeof arv.documentos)[number];
    const lista = [
      doc("1", {}),
      doc("2", { unidadeGeradora: "OUTRA" }),
      doc("3", { cancelado: true }),
      doc("4", { assinado: true }),
      doc("5", { externo: true, formato: "pdf" }),
      doc("6", { externo: true, formato: "circular" }),
      doc("7", { unidadeGeradora: "teste" }),
    ];
    checar(
      "so o do editor da unidade, nao assinado e nao cancelado (circular entra; sigla sem caixa)",
      pendentesDaUnidade(lista, "TESTE")
        .map((x) => x.id)
        .join() === "1,6,7",
      pendentesDaUnidade(lista, "TESTE").map((x) => x.id),
    );
  }
  const andamentos: Andamento[] = [
    {
      data: "10/10/2026 09:00",
      unidade: "TESTE",
      usuario: "u",
      descricao: `Gerado documento Despacho (${pend[0]?.numero})`,
      nrSei: pend[0]?.numero,
    },
    {
      data: "09/10/2026 08:00",
      unidade: "TESTE",
      usuario: "u",
      descricao: `Gerado documento Despacho (${pend[0]?.numero})`,
      nrSei: pend[0]?.numero,
    },
    { data: "08/10/2026 08:00", unidade: "TESTE", usuario: "u", descricao: "Processo recebido na unidade" },
  ];
  const datas = datasDeGeracao(andamentos);
  checar("data de geracao: o andamento mais antigo", datas.get(pend[0]?.numero ?? "") === "09/10/2026" && datas.size === 1);
  checar("comDatas so poe a data onde ha", comDatas(pend, datas)[0]?.data === "09/10/2026" && comDatas(pend, datas)[1]?.data === undefined);
  checar(
    "sem historico: sem datas",
    comDatas(pend, null).every((p) => p.data === undefined),
  );

  secao("aviso: banner e dialogo");
  const montar = (
    o: {
      unidade?: string;
      quadro?: Document | null;
      arvore?: ReturnType<typeof lerArvore> | null;
      datas?: Map<string, string> | null;
      html?: string;
    } = {},
  ) => {
    const doc = instalarDom(o.html ?? fixture("p_procedimento_enviar.html"));
    const restaurar = fingirDialogos(doc);
    let leu = 0;
    const pedidosDeRede: string[] = [];
    (globalThis as { fetch?: unknown }).fetch = (u: unknown) => {
      pedidosDeRede.push(String(u));
      return Promise.reject(new Error("rede nao esperada"));
    };
    const aviso = montarAviso({
      doc,
      topo: doc,
      quadroDaArvore: () => (o.quadro === undefined ? arvDoc : o.quadro),
      lerArvore: () => (o.arvore === undefined ? arv : o.arvore),
      unidade: o.unidade ?? "TESTE",
      datas: async () => {
        leu += 1;
        return o.datas === undefined ? null : o.datas;
      },
    });
    return { doc, aviso, restaurar, lidos: () => leu, rede: pedidosDeRede };
  };
  {
    const c = montar();
    const banner = c.doc.getElementById("spro-na-nao-assinados");
    checar("o banner entra na barra de localizacao", banner?.parentElement?.id === "divInfraBarraLocalizacao");
    checar(
      "pendentes: classe, texto e Detalhes",
      banner?.classList.contains("pendente") === true &&
        /Existem documentos não assinados na unidade TESTE/.test(banner.textContent ?? "") &&
        /Detalhes/.test(banner.textContent ?? ""),
    );
    const dlg = c.doc.querySelector("dialog.spro-dialogo");
    checar(
      "abre o dialogo sozinho (como o legado), sem Cancelar",
      dlg?.hasAttribute("open") === true && ![...dlg.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    checar(
      "o dialogo lista os pendentes",
      dlg?.querySelectorAll("li.spro-p-linha-modal").length === pend.length,
      dlg?.querySelectorAll("li").length,
    );
    checar(
      "lista com aria-label e botoes com aria-label",
      dlg?.querySelector("ul")?.getAttribute("aria-label") === "Documentos não assinados" &&
        /Selecionar na árvore: /.test(dlg?.querySelector("li button")?.getAttribute("aria-label") ?? ""),
    );
    checar(
      "nenhum title (so aria-label)",
      banner?.querySelector("[title]") === null && dlg?.querySelector("[title]") === null && !dlg?.hasAttribute("title"),
    );
    checar("sem rede nenhuma", c.rede.length === 0);
    // fechar e reabrir por Detalhes
    (dlg as HTMLDialogElement).close();
    checar("fechou", c.doc.querySelector("dialog.spro-dialogo") === null);
    const detalhes = [...(banner?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "Detalhes") as HTMLButtonElement;
    detalhes.click();
    checar("Detalhes reabre", c.doc.querySelector("dialog.spro-dialogo")?.hasAttribute("open") === true);
    await tique(10);
    c.restaurar();
  }
  {
    const c = montar({ datas: datasDeGeracao(andamentos) });
    await tique(10);
    const datasNaTela = [...c.doc.querySelectorAll(".spro-na-data")].map((e) => e.textContent);
    checar("com historico em cache: a data aparece depois, sem atrasar a lista", datasNaTela.join() === "09/10/2026", datasNaTela);
    c.restaurar();
  }
  {
    const c = montar({ unidade: "OUTRA" });
    const banner = c.doc.getElementById("spro-na-nao-assinados");
    checar(
      "tudo assinado na unidade: verde, sem dialogo",
      banner?.classList.contains("ok") === true &&
        /Todos os documentos foram assinados na unidade OUTRA/.test(banner.textContent ?? "") &&
        c.doc.querySelector("dialog") === null,
    );
    c.restaurar();
  }
  {
    const c = montar({ quadro: null });
    const banner = c.doc.getElementById("spro-na-nao-assinados");
    checar(
      "arvore inacessivel: aviso de falha com Tentar de novo",
      banner?.classList.contains("falha") === true && /Tentar de novo/.test(banner.textContent ?? ""),
    );
    c.restaurar();
  }
  {
    const c = montar();
    const outra = montarAviso({
      doc: c.doc,
      topo: c.doc,
      quadroDaArvore: () => arvDoc,
      lerArvore: () => arv,
      unidade: "TESTE",
      datas: async () => null,
    });
    checar(
      "montar de novo no mesmo quadro nao duplica (duas copias da extensao)",
      outra === null && c.doc.querySelectorAll("#spro-na-nao-assinados").length === 1,
    );
    c.restaurar();
  }
  {
    const c = montar({ html: "<html><body><form id='frmAtividadeListar'></form></body></html>" });
    checar(
      "sem a barra de localizacao: entra antes do formulario",
      c.doc.getElementById("spro-na-nao-assinados")?.nextElementSibling?.id === "frmAtividadeListar",
    );
    c.restaurar();
  }
  {
    const c = montar({ html: "<html><body><p>outra tela</p></body></html>" });
    checar("tela sem o formulario do Enviar: nao monta", c.aviso === null);
    c.restaurar();
  }
  secao("aviso: pastas fechadas e Verificar pastas");
  {
    const arvFechadas = novoDoc(fixture("arvore.html"));
    const arv2 = lerArvore(paginaDe(arvFechadas, URL_ARVORE));
    const pendCom = pendentesDaUnidade(arv2.documentos, "TESTE");
    checar("fixture com 2 pastas fechadas e 3 pendentes", pastasFechadas(arv2).length === 2 && pendCom.length === 3, [
      pastasFechadas(arv2),
      pendCom.length,
    ]);
    const montarFechadas = (unidade: string, abrirPasta: (q: Document, id: string) => Promise<boolean>) => {
      const doc = instalarDom(fixture("p_procedimento_enviar.html"));
      const restaurar = fingirDialogos(doc);
      const quadro = novoDoc(fixture("arvore.html"));
      const aviso = montarAviso({
        doc,
        topo: doc,
        quadroDaArvore: () => quadro,
        lerArvore: () => arv2,
        unidade,
        datas: async () => null,
        abrirPasta,
      });
      return { doc, quadro, aviso, restaurar, banner: () => doc.getElementById("spro-na-nao-assinados") };
    };
    // Um nó novo na pasta aberta, como o SEI insere (a arvore real so tem os nos em script, aqui o DOM e montado a mao).
    const inserirDocumento = (quadro: Document, pasta: string, id: string, numero: string, unidadeGeradora: string, assinado = false) => {
      let raiz = quadro.getElementById("divArvore");
      if (!raiz) {
        raiz = quadro.createElement("div");
        raiz.id = "divArvore";
        quadro.body.append(raiz);
      }
      let div = quadro.getElementById(`div${pasta}`);
      if (!div) {
        div = quadro.createElement("div");
        div.id = `div${pasta}`;
        raiz.append(div);
      }
      const no = quadro.createElement("a");
      no.id = `anchor${id}`;
      no.setAttribute("href", "about:blank");
      const rotulo = quadro.createElement("span");
      rotulo.id = `span${id}`;
      rotulo.textContent = `Despacho X (${numero})`;
      no.append(rotulo);
      const icone = quadro.createElement("img");
      icone.id = `icon${id}`;
      icone.setAttribute("src", "imagens/documento_interno.svg");
      const ug = quadro.createElement("a");
      ug.id = `anchorUG${id}`;
      ug.textContent = unidadeGeradora;
      div.append(icone, no, ug);
      if (assinado) {
        const a = quadro.createElement("a");
        a.id = `anchorA${id}`;
        div.append(a);
      }
    };
    {
      const pedidas: string[] = [];
      const c = montarFechadas("OUTRA", async (q, id) => {
        pedidas.push(id);
        inserirDocumento(q, id, `9${pedidas.length}`, `099900${pedidas.length}`, "OUTRA", true);
        return true;
      });
      const t = c.banner()?.textContent ?? "";
      checar(
        "sem pendentes mas com pastas fechadas: nao diz que esta tudo assinado",
        c.banner()?.classList.contains("falha") === true &&
          !/Todos os documentos/.test(t) &&
          /2 pastas fechadas ainda n\u00E3o foram verificadas/.test(t),
        t,
      );
      const botao = [...(c.banner()?.querySelectorAll("button") ?? [])].find(
        (b) => b.textContent === "Verificar pastas",
      ) as HTMLButtonElement;
      checar("oferece Verificar pastas", !!botao);
      botao.click();
      await tique(30);
      checar("abre as pastas fechadas, uma de cada vez, em ordem", pedidas.join() === "PASTA1,PASTA2", pedidas);
      const t2 = c.banner()?.textContent ?? "";
      checar(
        "depois: tudo verificado (as pastas ja tem documento), verde",
        c.banner()?.classList.contains("ok") === true && /Todos os documentos foram assinados na unidade OUTRA/.test(t2),
        t2,
      );
      c.restaurar();
    }
    {
      const c = montarFechadas("TESTE", async (q, id) => {
        inserirDocumento(q, id, id === "PASTA1" ? "801" : "802", id === "PASTA1" ? "0998001" : "0998002", "TESTE");
        return true;
      });
      const dlg = c.doc.querySelector("dialog.spro-dialogo");
      checar(
        "com pendentes e pastas fechadas: o dialogo avisa e oferece Verificar pastas",
        /2 pastas fechadas n\u00E3o foram verificadas/.test(dlg?.textContent ?? "") &&
          !![...(dlg?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "Verificar pastas"),
      );
      checar("tres pendentes antes", dlg?.querySelectorAll("li").length === 3, dlg?.querySelectorAll("li").length);
      ([...(dlg?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "Verificar pastas") as HTMLButtonElement).click();
      await tique(30);
      const dlg2 = c.doc.querySelector("dialog.spro-dialogo");
      checar(
        "depois de verificar as pastas o dialogo reabre com os 5 pendentes",
        dlg2?.querySelectorAll("li").length === 5,
        dlg2?.querySelectorAll("li").length,
      );
      checar(
        "e nao ha mais pastas fechadas no aviso",
        !/pastas? fechadas?/.test(c.doc.getElementById("spro-na-nao-assinados")?.textContent ?? "") &&
          !/pastas? fechadas? n/.test(dlg2?.textContent ?? ""),
      );
      c.restaurar();
    }
    {
      // Documento que o SEI inseriu no DOM (pasta aberta pelo usuario antes) entra na conta, assinado ou nao.
      const c = montarFechadas("TESTE", async () => true);
      c.restaurar();
      const quadro = novoDoc(fixture("arvore.html"));
      inserirDocumento(quadro, "PASTA1", "701", "0997001", "TESTE");
      inserirDocumento(quadro, "PASTA1", "702", "0997002", "TESTE", true);
      inserirDocumento(quadro, "PASTA1", "703", "0997003", "OUTRA");
      const docs = documentosDaArvore(quadro, arv2);
      checar("documentos do DOM entram alem dos do modelo", docs.length === arv2.documentos.length + 3, docs.length);
      const p = pendentesDaUnidade(docs, "TESTE").map((x) => x.numero);
      checar("assinado e de outra unidade nao pendem", p.includes("0997001") && !p.includes("0997002") && !p.includes("0997003"), p);
      checar(
        "a pasta que ganhou documento deixa de ser fechada",
        !pastasFechadas({ pagina: arv2.pagina, documentos: docs }).includes("PASTA1") &&
          pastasFechadas({ pagina: arv2.pagina, documentos: docs }).includes("PASTA2"),
      );
    }
  }
}
