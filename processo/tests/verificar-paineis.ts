/**
 * Painéis abaixo da árvore, sobre a árvore real do SEI SP (fixture do núcleo) montada no linkedom.
 * O linkedom não simula <dialog> modal nem a fase de captura: os modais se provam ao vivo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaMemoria } from "@comum/armazenamento/area";
import { lerArvore } from "@nucleo/dominio/arvore";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { chaveCache } from "../src/modelo/constantes";
import { LojaProcesso } from "../src/modelo/loja";
import { paineisHabilitados } from "../src/modelo/paineis";
import type { NomeFatia } from "../src/modelo/tipos";
import { aguardarArvore, fatiasNecessarias, manterMontagem, montarPaineis } from "../src/pagina/arvore";
import { type ContextoProcesso, criarContexto } from "../src/pagina/contexto";
import { criarLeituras, type Leituras } from "../src/pagina/leituras";
import type { Operacoes } from "../src/pagina/operacoes";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HTML_ARVORE = readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41/arvore.html"), "utf8").replace(
  /^<!-- url: .*? -->\n/,
  "",
);
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const armazenamento = (inicial: Record<string, string> = {}) => {
  const m = new Map(Object.entries(inicial));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

const semOp = new Proxy({}, { get: () => () => Promise.reject(new Error("operacao nao esperada")) }) as Operacoes;

interface Cenario {
  doc: Document;
  ctx: ContextoProcesso;
  loja: LojaProcesso;
  area: ReturnType<typeof areaMemoria>;
  leituras: Leituras;
  st: ReturnType<typeof armazenamento>;
}

function cenario(
  o: {
    cache?: Record<string, unknown>;
    leituras?: Leituras;
    sigiloso?: boolean;
    selecao?: string[] | null;
    html?: string;
    st?: Record<string, string>;
  } = {},
): Cenario {
  const doc = instalarDom(o.html ?? HTML_ARVORE);
  let arv = lerArvore(paginaDe(doc, URL_ARVORE));
  if (o.sigiloso) arv = { ...arv, nivel: "sigiloso" };
  const escopo = "treinamento.sei.sp.gov.br|usuario.teste";
  const area = areaMemoria(o.cache ? { [chaveCache(escopo, arv.idProcedimento)]: { em: 1, fatias: o.cache } } : {});
  const loja = new LojaProcesso(area, escopo, arv.idProcedimento, { sigiloso: Boolean(o.sigiloso), esperar: async () => {} });
  const st = armazenamento(o.st);
  const leituras: Leituras = o.leituras ?? {};
  const ctx = criarContexto({
    doc,
    topo: doc,
    arv,
    loja,
    host: "treinamento.sei.sp.gov.br",
    login: "usuario.teste",
    unidade: { id: "110000001", sigla: "TESTE" },
    habilitados: paineisHabilitados(
      o.selecao === undefined
        ? [
            ...[
              "Anotações",
              "Marcador",
              "Acompanhamento Especial",
              "Tipo de Procedimento",
              "Assuntos",
              "Interessados",
              "Atribuição",
              "Nível de Acesso",
              "Observações",
              "Bloco Interno",
            ],
          ]
        : o.selecao,
    ),
    armazenamento: st,
    consultasDesativadas: false,
    reaberturaProgramada: false,
    usaTrancado: true,
    agora: () => new Date(2026, 9, 24, 10, 0),
    op: semOp,
    recarregar: (n: NomeFatia) => {
      const b = leituras[n];
      if (b) void loja.carregar(n, b);
    },
  });
  return { doc, ctx, loja, area, leituras, st };
}

const painel = (doc: Document, tipo: string) => doc.querySelector<HTMLElement>(`[data-spro-painel="${tipo}"]`);
const corpoTexto = (doc: Document, tipo: string) =>
  painel(doc, tipo)?.querySelector(".spro-p-corpo")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
const meta = {
  disponivel: true,
  valor: {
    tipo: "Tipo X",
    especificacao: "Compra de canetas",
    assuntos: ["Assunto A"],
    interessados: ["Maria Souza (CPF 1)"],
    observacoes: "uma obs",
    observacoesOutras: [{ unidade: "OUTRA", observacao: "obs dela" }],
    editavel: true,
    nivel: "publico",
  },
};

export async function verificarPaineis(): Promise<void> {
  secao("paineis: posicao e ordem (as do legado)");
  {
    const c = cenario();
    const m = montarPaineis(c.ctx);
    const frm = c.doc.getElementById("frmArvore");
    const ordem = [...c.doc.querySelectorAll("[data-spro-painel]")].map((e) => e.getAttribute("data-spro-painel"));
    checar("todos os 11 paineis, uma vez cada", ordem.length === 11 && new Set(ordem).size === 11, ordem);
    checar(
      "ordem final: atribuicao, bloco, marcador, acomp., descricao, tipo, nivel, interessados, assuntos, obs",
      m.raiz.querySelectorAll("[data-spro-painel]").length === 10 &&
        [...m.raiz.querySelectorAll("[data-spro-painel]")].map((e) => e.getAttribute("data-spro-painel")).join() ===
          "responsaveis,bloco_interno,marcador,acompanhamento_especial,descricao,tipo_procedimento,nivel_acesso,interessados,assuntos,observacoes",
    );
    checar(
      "Anotacoes logo depois do Consultar Andamento",
      c.doc.getElementById("divConsultarAndamento")?.nextElementSibling?.querySelector('[data-spro-painel="anotacoes"]') !== null,
    );
    checar(
      "o espaco das Atividades fica antes dos Relacionados",
      c.doc.getElementById("divRelacionados")?.previousElementSibling?.getAttribute("data-spro-slot") === "atividades",
    );
    checar("os demais ficam no fim do formulario da arvore", frm?.lastElementChild === m.raiz);
    checar("nenhum painel depende do menu rapido: monta sem nenhuma opcao do menu", ordem.length === 11);
    m.desmontar();
    checar("desmontar tira tudo", c.doc.querySelectorAll("[data-spro-processo-raiz], [data-spro-slot]").length === 0);
  }

  secao("paineis: esqueleto, dado, vazio");
  {
    let solta: (v: unknown) => void = () => {};
    const c = cenario({ leituras: { marcador: () => new Promise((r) => (solta = r)) } });
    montarPaineis(c.ctx);
    void c.loja.carregar("marcador", c.leituras.marcador as () => Promise<unknown>);
    await tique();
    checar(
      "sem cache: esqueleto enquanto carrega",
      painel(c.doc, "marcador")?.querySelector(".spro-p-esqueleto") !== null &&
        painel(c.doc, "marcador")?.getAttribute("data-estado") === "carregando",
    );
    solta({ itens: [], editavel: true });
    await tique(20);
    checar(
      "processo sem marcador: estado vazio, nao erro",
      corpoTexto(c.doc, "marcador") === "Sem marcador." && painel(c.doc, "marcador")?.querySelector(".spro-p-erro") === null,
    );
    checar(
      "so o painel afetado mudou: acompanhamento segue esperando",
      painel(c.doc, "acompanhamento_especial")?.getAttribute("data-estado") === "carregando",
    );

    const c2 = cenario();
    montarPaineis(c2.ctx);
    void c2.loja.carregar("anotacao", async () => ({ disponivel: true, valor: null }));
    void c2.loja.carregar("acompanhamento", async () => ({ disponivel: true, valor: null }));
    await tique(20);
    checar(
      "sem anotacao: vazio com “Adicionar anotacao”",
      /Sem anotação\./.test(corpoTexto(c2.doc, "anotacoes")) && /Adicionar anotação/.test(corpoTexto(c2.doc, "anotacoes")),
    );
    checar("sem acompanhamento: vazio", corpoTexto(c2.doc, "acompanhamento_especial") === "Sem acompanhamento especial.");

    const c3 = cenario();
    montarPaineis(c3.ctx);
    void c3.loja.carregar("dadosProcesso", async () => meta);
    await tique(20);
    checar(
      "descricao, tipo, interessados, assuntos e observacoes saem do mesmo dado",
      corpoTexto(c3.doc, "descricao") === "Compra de canetas" &&
        corpoTexto(c3.doc, "tipo_procedimento") === "Tipo X" &&
        /Maria Souza/.test(corpoTexto(c3.doc, "interessados")) &&
        corpoTexto(c3.doc, "assuntos") === "Assunto A" &&
        /OUTRA: obs dela/.test(corpoTexto(c3.doc, "observacoes")),
      corpoTexto(c3.doc, "observacoes"),
    );
    checar(
      "interessado em partes copiaveis (nome e CPF)",
      painel(c3.doc, "interessados")?.querySelectorAll(".spro-p-copiavel").length === 2,
    );
    checar(
      "tem os botoes de editar quando o processo esta aberto na unidade",
      painel(c3.doc, "descricao")?.querySelectorAll(".spro-p-acao").length === 3,
    );
  }

  secao("paineis: Tipo e Nivel aparecem sem rede, da propria arvore");
  {
    const c = cenario();
    montarPaineis(c.ctx);
    checar(
      "tipo da arvore, sem esperar o formulario",
      corpoTexto(c.doc, "tipo_procedimento").length > 0 && painel(c.doc, "tipo_procedimento")?.querySelector(".spro-p-esqueleto") === null,
      corpoTexto(c.doc, "tipo_procedimento"),
    );
    checar("nivel da arvore", /Restrito|Público|Sigiloso/.test(corpoTexto(c.doc, "nivel_acesso")), corpoTexto(c.doc, "nivel_acesso"));
    checar(
      "sem dado do formulario nao ha botao de editar",
      painel(c.doc, "tipo_procedimento")?.querySelectorAll(".spro-p-acao").length === 0,
    );
  }

  secao("paineis: cache pinta na hora (desatualizado) e a rede confirma");
  {
    let solta: (v: unknown) => void = () => {};
    const cache = { dadosProcesso: { dado: meta, em: 5 } };
    const c = cenario({ cache });
    montarPaineis(c.ctx);
    const antes = Date.now();
    const p = c.loja.carregar("dadosProcesso", () => new Promise((r) => (solta = r)));
    await tique(20);
    checar(
      "pinta o cache antes da rede",
      corpoTexto(c.doc, "descricao") === "Compra de canetas" &&
        painel(c.doc, "descricao")?.getAttribute("data-estado") === "desatualizado" &&
        Date.now() - antes < 300,
    );
    solta({ ...meta, valor: { ...meta.valor, especificacao: "Compra de lapis" } });
    await p;
    checar(
      "a rede troca o valor e confirma",
      corpoTexto(c.doc, "descricao") === "Compra de lapis" && painel(c.doc, "descricao")?.getAttribute("data-estado") === "pronto",
    );
  }

  secao("paineis: erro com “Tentar de novo”, sem spinner eterno");
  {
    let falhar = true;
    const leituras: Leituras = {
      marcador: async () => {
        if (falhar) throw new Error("A sessão do SEI expirou.");
        return { itens: [{ id: "1", nome: "Urgente", texto: "", icone: "", usuario: "", data: "" }], editavel: true };
      },
    };
    const c = cenario({ leituras });
    montarPaineis(c.ctx);
    await c.loja.carregar("marcador", leituras.marcador as () => Promise<unknown>);
    const botao = painel(c.doc, "marcador")?.querySelector<HTMLButtonElement>(".spro-p-erro .spro-p-link");
    checar(
      "a leitura falhou: erro visivel com a mensagem e botao",
      /sessão do SEI expirou/.test(corpoTexto(c.doc, "marcador")) &&
        botao?.textContent === "Tentar de novo" &&
        painel(c.doc, "marcador")?.querySelector(".spro-p-esqueleto") === null &&
        painel(c.doc, "marcador")?.getAttribute("data-estado") === "erro",
    );
    checar("os outros paineis nao foram afetados", painel(c.doc, "acompanhamento_especial")?.getAttribute("data-estado") === "carregando");
    falhar = false;
    if (botao) disparar(botao, "click");
    await tique(30);
    checar(
      "Tentar de novo refaz a leitura e o painel aparece",
      /Urgente/.test(corpoTexto(c.doc, "marcador")) && painel(c.doc, "marcador")?.getAttribute("data-estado") === "pronto",
      corpoTexto(c.doc, "marcador"),
    );

    // Com dado anterior, o erro de atualizacao nao apaga o que ja esta na tela.
    const c2 = cenario({ cache: { dadosProcesso: { dado: meta, em: 5 } } });
    montarPaineis(c2.ctx);
    await c2.loja.carregar("dadosProcesso", async () => {
      throw new Error("fora do ar");
    });
    checar(
      "erro ao atualizar mantem o dado e oferece nova tentativa",
      corpoTexto(c2.doc, "descricao").includes("Compra de canetas") && /Não foi possível atualizar/.test(corpoTexto(c2.doc, "descricao")),
      corpoTexto(c2.doc, "descricao"),
    );
  }

  secao("paineis: anotacao oculta quando a barra nao a oferece; consultas desativadas");
  {
    const c = cenario();
    montarPaineis(c.ctx);
    await c.loja.carregar("anotacao", async () => ({ disponivel: false, motivo: "acao" }));
    checar("processo fechado na unidade: o painel de anotacoes some (como no legado)", painel(c.doc, "anotacoes")?.hidden === true);
    await c.loja.carregar("acompanhamento", async () => ({ disponivel: false, motivo: "acao" }));
    checar(
      "acompanhamento indisponivel: nota, nao erro",
      /não está disponível/.test(corpoTexto(c.doc, "acompanhamento_especial")) &&
        painel(c.doc, "acompanhamento_especial")?.querySelector(".spro-p-erro") === null,
    );
    await c.loja.carregar("dadosProcesso", async () => ({ disponivel: false, motivo: "consultas" }));
    checar(
      "consultas adicionais desativadas: nota nos paineis que dependem do formulario",
      /desativadas nas opções/.test(corpoTexto(c.doc, "interessados")),
    );
  }

  secao("paineis: anotacao com prioridade, checklist e data");
  {
    const c = cenario();
    montarPaineis(c.ctx);
    await c.loja.carregar("anotacao", async () => ({
      disponivel: true,
      valor: { texto: "Aguardando parecer 01/10/2026\n[ ] minuta\n[X] revisao", prioridade: true },
    }));
    const p = painel(c.doc, "anotacoes");
    checar("post-it com prioridade", p?.querySelector(".spro-p-post-it.prioridade") !== null);
    checar(
      "checklist com caixas marcadas e desmarcadas",
      p?.querySelectorAll('.spro-p-nota-linha.item input[type="checkbox"]').length === 2 &&
        p?.querySelectorAll(".spro-p-nota-linha.item.feito").length === 1,
    );
    checar(
      "chip da data (passada = vencido)",
      p?.querySelector(".spro-p-chip.vencido") !== null && /01\/10\/2026/.test(p?.textContent ?? ""),
    );
    checar("acoes: prioridade, editar e remover", p?.querySelectorAll(".spro-p-acoes .spro-p-acao").length === 3);
  }

  secao("paineis: marcador com icone, prazo e texto");
  {
    const c = cenario();
    montarPaineis(c.ctx);
    await c.loja.carregar("marcador", async () => ({
      itens: [
        {
          id: "883",
          nome: "Para assinatura",
          texto: "Ate 20/10/2026 18:00\nver com a chefia",
          icone: "svg/marcador_verde.svg?18",
          usuario: "x",
          data: "x",
        },
      ],
      editavel: true,
    }));
    const p = painel(c.doc, "marcador");
    checar(
      "nome, icone e texto",
      /Para assinatura/.test(corpoTexto(c.doc, "marcador")) &&
        /ver com a chefia/.test(corpoTexto(c.doc, "marcador")) &&
        p?.querySelector("img.spro-p-marcador-icone")?.getAttribute("src") === "svg/marcador_verde.svg?18",
    );
    checar(
      "prazo vencido em destaque",
      p?.querySelector(".spro-p-chip.vencido") !== null && /até 20\/10\/2026/.test(corpoTexto(c.doc, "marcador")),
      corpoTexto(c.doc, "marcador"),
    );
    checar(
      "adicionar no cabecalho; editar e remover por item",
      p?.querySelectorAll("header .spro-p-acao").length === 1 && p?.querySelectorAll(".spro-p-acoes-linha .spro-p-acao").length === 2,
    );
  }

  secao("paineis: atribuicao vem da arvore, sem rede");
  {
    const c = cenario({ leituras: {} });
    montarPaineis(c.ctx);
    const l = criarLeituras({ http: {} as never, arv: c.ctx.arv, loja: c.loja, unidadeSigla: "TESTE", consultasDesativadas: false });
    await c.loja.carregar("atribuicao", l.atribuicao as () => Promise<unknown>);
    checar(
      "mostra a mensagem da arvore com o chip “nao atribuido”",
      /Processo aberto/.test(corpoTexto(c.doc, "responsaveis")) &&
        c.doc.querySelector('[data-spro-painel="responsaveis"] .spro-p-chip.aviso') !== null,
      corpoTexto(c.doc, "responsaveis"),
    );
    checar(
      "botao de editar na linha da minha unidade",
      painel(c.doc, "responsaveis")?.querySelectorAll(".spro-p-linha .spro-p-acao").length === 1,
    );
  }

  secao("paineis: Bloco Interno so com historico em cache (30 min), senao link discreto");
  {
    const c = cenario();
    montarPaineis(c.ctx);
    await c.loja.carregar("blocoInterno", async () => ({ descricao: null, coletadoEm: 0 }));
    const link = painel(c.doc, "bloco_interno")?.querySelector<HTMLButtonElement>(".spro-p-link.discreto");
    checar(
      "sem historico: so o link “Carregar do historico”",
      link?.textContent === "Carregar do histórico" && !/Nenhum bloco/.test(corpoTexto(c.doc, "bloco_interno")),
    );
    if (link) disparar(link, "click");
    await tique(10);
    checar(
      "gancho inerte ate a Etapa 3: avisa que ainda nao esta disponivel",
      painel(c.doc, "bloco_interno")?.querySelector<HTMLElement>(".spro-p-nota")?.hidden === false,
    );

    let pediu = 0;
    const c2 = cenario();
    c2.ctx.aoPedirHistorico = async () => {
      pediu += 1;
      return true;
    };
    montarPaineis(c2.ctx);
    await c2.loja.carregar("blocoInterno", async () => ({ descricao: null, coletadoEm: 0 }));
    const l2 = painel(c2.doc, "bloco_interno")?.querySelector<HTMLButtonElement>(".spro-p-link.discreto");
    if (l2) disparar(l2, "click");
    await tique(10);
    checar("o gancho aoPedirHistorico e chamado ao clicar", pediu === 1);

    // Etapa 3: quem coletar grava a fatia e o painel redesenha sozinho.
    c2.loja.definir("blocoInterno", {
      estado: "pronto",
      dado: { descricao: "Processo inserido no bloco interno 5 (Bloco A)", coletadoEm: c2.ctx.agora().getTime() - 60_000 },
      em: 1,
    });
    checar("historico em cache (1 min): mostra o bloco", /bloco interno 5/.test(corpoTexto(c2.doc, "bloco_interno")));
    c2.loja.definir("blocoInterno", {
      estado: "pronto",
      dado: { descricao: "x", coletadoEm: c2.ctx.agora().getTime() - 31 * 60_000 },
      em: 1,
    });
    checar("passou de 30 min: volta ao link", painel(c2.doc, "bloco_interno")?.querySelector(".spro-p-link.discreto") !== null);
    c2.loja.definir("blocoInterno", { estado: "pronto", dado: { descricao: null, coletadoEm: c2.ctx.agora().getTime() }, em: 1 });
    checar("coletado e sem bloco: “Nenhum bloco localizado”", /Nenhum bloco localizado/.test(corpoTexto(c2.doc, "bloco_interno")));
  }

  secao("paineis: aberto/recolhido persiste na mesma chave do legado");
  {
    const c = cenario({ st: { optionsPro: JSON.stringify({ panelDadosArvorePro_assuntos: "hide" }) } });
    montarPaineis(c.ctx);
    checar(
      "chave do legado: assuntos nasce recolhido",
      painel(c.doc, "assuntos")?.hasAttribute("data-recolhido") === true &&
        painel(c.doc, "marcador")?.hasAttribute("data-recolhido") === false,
    );
    const alt = painel(c.doc, "marcador")?.querySelector<HTMLButtonElement>(".spro-p-alternar");
    if (alt) disparar(alt, "click");
    checar(
      "recolher grava panelDadosArvorePro_marcador = hide, preservando as outras chaves",
      JSON.parse(c.st.m.get("optionsPro") ?? "{}").panelDadosArvorePro_marcador === "hide" &&
        JSON.parse(c.st.m.get("optionsPro") ?? "{}").panelDadosArvorePro_assuntos === "hide",
    );
    if (alt) disparar(alt, "click");
    checar(
      "expandir grava visible",
      JSON.parse(c.st.m.get("optionsPro") ?? "{}").panelDadosArvorePro_marcador === "visible" &&
        painel(c.doc, "marcador")?.querySelector<HTMLElement>(".spro-p-corpo")?.hidden === false,
    );
  }

  secao("paineis: personalizacao do menu (so o escolhido + especificacao)");
  {
    const c = cenario({ selecao: ["Marcador"] });
    montarPaineis(c.ctx);
    const tipos = [...c.doc.querySelectorAll("[data-spro-painel]")].map((e) => e.getAttribute("data-spro-painel")).sort();
    checar("so marcador e descricao", tipos.join() === "descricao,marcador", tipos);
    checar(
      "so carrega as fatias necessarias",
      fatiasNecessarias(c.ctx).sort().join() === "dadosProcesso,marcador",
      fatiasNecessarias(c.ctx),
    );
  }

  secao("paineis: tema segue o do SEI, nao o do sistema");
  {
    const claro = cenario();
    montarPaineis(claro.ctx);
    checar("pagina clara: raiz sem data-tema", !claro.doc.querySelector("[data-spro-processo-raiz]")?.hasAttribute("data-tema"));
    const escuro = cenario({ html: HTML_ARVORE.replace(/<body /, '<body class="dark-mode" ') });
    montarPaineis(escuro.ctx);
    checar(
      "corpo com dark-mode (legado pintou): raiz escura",
      escuro.doc.querySelector("[data-spro-processo-raiz]")?.getAttribute("data-tema") === "escuro",
    );
    const so = cenario({
      html: HTML_ARVORE.replace(/<html /, '<html data-spro-tema="claro" ').replace(/<body /, '<body class="dark-mode" '),
    });
    montarPaineis(so.ctx);
    checar("Estilo Avancado claro manda sobre o dark-mode", !so.doc.querySelector("[data-spro-processo-raiz]")?.hasAttribute("data-tema"));
  }

  secao("paineis: sigiloso nao mostra nem guarda especificacao, interessados, assuntos, observacoes");
  {
    const c = cenario({ sigiloso: true });
    montarPaineis(c.ctx);
    const tipos = [...c.doc.querySelectorAll("[data-spro-painel]")].map((e) => e.getAttribute("data-spro-painel"));
    checar(
      "sem descricao, interessados, assuntos, observacoes e bloco",
      !["descricao", "interessados", "assuntos", "observacoes", "bloco_interno"].some((t) => tipos.includes(t)),
      tipos,
    );
    checar(
      "tipo, nivel, atribuicao, marcador, anotacao e acompanhamento aparecem",
      ["tipo_procedimento", "nivel_acesso", "responsaveis", "marcador", "anotacoes", "acompanhamento_especial"].every((t) =>
        tipos.includes(t),
      ),
      tipos,
    );
    checar("nao consulta o formulario do processo", !fatiasNecessarias(c.ctx).includes("dadosProcesso"));
    await c.loja.carregar("marcador", async () => ({
      itens: [{ id: "1", nome: "Sigilo", texto: "", icone: "", usuario: "", data: "" }],
      editavel: true,
    }));
    await tique(10);
    const chaves = await c.area.chaves?.();
    checar("nada vai para o cache", !(chaves ?? []).some((k) => k.startsWith("processo/")), chaves);
    checar("sem botao de editar nivel", painel(c.doc, "nivel_acesso")?.querySelectorAll(".spro-p-acao").length === 0);
  }

  secao("paineis: a arvore se refaz no meio — remonta sozinho, sem duplicar");
  {
    let aviso: (() => void) | null = null;
    class FalsoObservador {
      constructor(cb: () => void) {
        aviso = cb;
      }
      observe() {}
      disconnect() {}
    }
    const c = cenario();
    const m = manterMontagem(c.ctx, undefined, { Observador: FalsoObservador as unknown as typeof MutationObserver });
    void c.loja.carregar("dadosProcesso", async () => meta);
    await tique(10);
    const primeira = m.atual().raiz;
    primeira.remove();
    c.doc.querySelector("[data-spro-processo-raiz].anotacoes")?.remove();
    (aviso as (() => void) | null)?.();
    await tique(80);
    const raizes = c.doc.querySelectorAll("[data-spro-processo-raiz]");
    checar("duas raizes (fim e anotacoes), nenhuma duplicada", raizes.length === 2, raizes.length);
    checar("o conteudo volta sem esperar nova leitura", corpoTexto(c.doc, "descricao") === "Compra de canetas");
    (aviso as (() => void) | null)?.();
    await tique(60);
    checar("sem remocao nada e refeito", c.doc.querySelectorAll("[data-spro-processo-raiz]").length === 2);
    m.parar();
  }

  secao("leituras: mensagens para gente, consultas desativadas, fallback do marcador");
  {
    const c = cenario();
    const paginaRuim = {
      url: "https://treinamento.sei.sp.gov.br/sei/controlador.php?x=1",
      status: 200,
      html: "<html><body><h1>Erro</h1></body></html>",
      doc: new DOMParser().parseFromString("<html><body><h1>Erro</h1></body></html>", "text/html") as unknown as Document,
    };
    const chamadas: string[] = [];
    const http = {
      base: new URL("https://treinamento.sei.sp.gov.br/sei/"),
      obter: async (u: string) => {
        chamadas.push(u);
        return paginaRuim;
      },
      enviar: async () => paginaRuim,
      absoluta: (u: string) => u,
      baixar: async () => {
        throw new Error("x");
      },
    };
    const l = criarLeituras({ http: http as never, arv: c.ctx.arv, loja: c.loja, unidadeSigla: "TESTE", consultasDesativadas: false });
    let msg = "";
    try {
      await (l.anotacao as () => Promise<unknown>)();
    } catch (e) {
      msg = (e as Error).message;
    }
    checar("tela que nao e o formulario: mensagem sem seletor nem codigo", /inesperada/.test(msg) && !/#frm/.test(msg), msg);

    const sem = criarLeituras({ http: http as never, arv: c.ctx.arv, loja: c.loja, unidadeSigla: "TESTE", consultasDesativadas: true });
    const antes = chamadas.length;
    const d = (await (sem.dadosProcesso as () => Promise<{ disponivel: boolean; motivo?: string }>)()) as {
      disponivel: boolean;
      motivo?: string;
    };
    const m = (await (sem.marcador as () => Promise<{ itens: unknown[]; editavel: boolean }>)()) as { itens: unknown[]; editavel: boolean };
    checar(
      "consultas desativadas: nenhuma requisicao e motivo claro",
      chamadas.length === antes && d.disponivel === false && d.motivo === "consultas",
    );
    checar("marcador sem a tela de marcadores: lista da propria arvore, nao editavel", m.editavel === false && Array.isArray(m.itens));
    const a = (await (sem.atribuicao as () => Promise<{ linhas: unknown[]; editavel: boolean }>)()) as {
      linhas: unknown[];
      editavel: boolean;
    };
    checar("atribuicao nunca usa rede", chamadas.length === antes && a.linhas.length > 0);
  }

  secao("arvore: espera por MutationObserver / relogio com prazo");
  {
    const doc = instalarDom("<html><body><div id='x'></div></body></html>");
    const antes = Date.now();
    const sem = await aguardarArvore(doc, 300);
    checar("arvore que nunca vem: null no prazo, sem pendurar", sem === null && Date.now() - antes < 1500);
    const doc2 = instalarDom(HTML_ARVORE.replace('<form id="frmArvore"', '<form id="frmTarde"'));
    const espera = aguardarArvore(doc2, 3000);
    await tique(50);
    doc2.getElementById("frmTarde")?.setAttribute("id", "frmArvore");
    const arv = await espera;
    checar("arvore que chega depois e lida", arv?.idProcedimento === "148265");
  }
}
