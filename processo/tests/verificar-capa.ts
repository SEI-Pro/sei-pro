/**
 * Capa do processo: QR code (formato, correção de erro, estrutura), cards da árvore (fixtures 4.1 e uma árvore sintética no
 * formato do SEI 5), cards do histórico (sem cache, com cache, vencido), alerta de parado, resumo (e sigiloso), vista, e o
 * controle (desenha uma vez, não redesenha em loop, reage a onChanged, pede ao quadro da árvore). O quadro da árvore é
 * a fixture real do núcleo; a ponte e o cache são falsos. O que depende de iframe de verdade se prova ao vivo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaMemoria } from "@comum/armazenamento/area";
import { type Arvore, lerArvore } from "@nucleo/dominio/arvore";
import { type Andamento, lerHistorico } from "@nucleo/dominio/historico";
import { calcularPassagens, type Passagem } from "@nucleo/dominio/passagens";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { cartaoDaCapa } from "../../agente-ia/src/fluxos/cartao";
import { mostrarCartaoNaCapa } from "../../agente-ia/src/ponte/capa";
import { fixture } from "../../sei-nucleo/tests/util";
import { desenharQr } from "../src/capa/capa";
import { cardsDaArvore, cardsDoHistorico, contagemDaArvore, contarPastas } from "../src/capa/cards";
import { type DepsCapa, type FonteDeCache, montarCapa, type PonteDaArvore, processoSelecionado } from "../src/capa/controle";
import { diasDesde, diasParado, estaParado, limiteDeParado, passagemNaUnidade, recebimentoDoLegado } from "../src/capa/parado";
import { criarFonteDeCache, lerColeta, textoDaColeta } from "../src/capa/ponte";
import { gerarQr, internosDoQr } from "../src/capa/qr";
import { resumoDoProcesso, situacaoEmUmaLinha } from "../src/capa/resumo";
import { type EstadoColeta, type FatiasLidas, montarVista } from "../src/capa/vista";
import {
  ATRIBUTO_COLETA,
  chaveCache,
  chaveHistorico,
  EVENTO_CAPA_CALCULAR,
  EVENTO_CAPA_CANCELAR,
  EVENTO_CAPA_PEDIR,
  LIMITE_PARADO_PADRAO,
} from "../src/modelo/constantes";
import type { DadoProcesso, HistoricoGuardado } from "../src/modelo/dados";
import { LojaProcesso } from "../src/modelo/loja";
import type { ContextoProcesso } from "../src/pagina/contexto";
import { ligarPonteDaCapa } from "../src/pagina/ponteCapa";
import { checar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";
const ESCOPO = "treinamento.sei.sp.gov.br|usuario.teste";
const AGORA = new Date(2026, 9, 24, 10, 0);

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const htmlDaArvore = (nome: string): string =>
  readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41", nome), "utf8").replace(/^<!-- url: .*? -->\n/, "");

function andamentosReais(): Andamento[] {
  instalarDom();
  return [...lerHistorico(fixture("sei41/historico_completo_p0.html")), ...lerHistorico(fixture("sei41/historico_completo_p1.html"))];
}

/** Árvore no formato dos nós do SEI (o 5 usa os mesmos `infraArvoreNo`): processo, pastas, documentos e sinais. */
function arvoreSintetica(
  docs: Array<{ id: string; nome: string; icone: string; pasta?: string; src?: string; sinais?: string[] }>,
  o: { sigiloso?: boolean; pastas?: string[] } = {},
): string {
  const linhas: string[] = [];
  const lnk = (extra: string) => `controlador.php?acao=arvore_visualizar&id_procedimento=900${extra}&infra_hash=0`;
  linhas.push(
    `Nos[0] = new infraArvoreNo("PROCESSO","900",null,"${lnk("")}","ifrVisualizacao","50300.000001/2026-01","Processo sintetico","svg/processo.svg?18","svg/processo.svg?18","svg/processo.svg?18",true,true,null,null,null,"50300.000001/2026-01");`,
  );
  linhas.push("Nos[0].acoes = '';");
  let n = 1;
  for (const p of o.pastas ?? [])
    linhas.push(
      `Nos[${n++}] = new infraArvoreNo("PASTA","${p}","900","javascript:abrirFecharPasta('${p}');",null,"Pasta","Pasta (1)",null,"a.svg","b.svg",false,true,null,null,null);`,
    );
  for (const d of docs) {
    linhas.push(
      `Nos[${n}] = new infraArvoreNo("DOCUMENTO","${d.id}",${d.pasta ? `"${d.pasta}"` : '"900"'},"${lnk(`&id_documento=${d.id}`)}","ifrConteudoVisualizacao","${d.nome} (00${d.id})","${d.nome} (00${d.id})","svg/${d.icone}.svg?18","svg/${d.icone}.svg?18","svg/${d.icone}.svg?18",true,true,null,null,"noVisitado","00${d.id}");`,
    );
    linhas.push(`Nos[${n}].src = '${d.src ?? "controlador.php?acao=documento_visualizar&id_documento=" + d.id}';`);
    n++;
  }
  let k = 0;
  if (o.sigiloso)
    linhas.push(
      `NosAcoes[${k++}] = new infraArvoreAcao("NIVEL_ACESSO","NA900","900","javascript:alert('Acesso Sigiloso');",null,"Acesso Sigiloso","svg/processo_sigiloso.svg?18",true);`,
    );
  for (const d of docs)
    for (const s of d.sinais ?? []) {
      if (s === "assinado")
        linhas.push(
          `NosAcoes[${k++}] = new infraArvoreAcao("ASSINATURA","A${d.id}","${d.id}","javascript:alert('Assinado por');",null,"Assinado por:\\nUsuario\\nCargo\\nUNID","svg/assinatura1.svg?18",true);`,
        );
      if (s === "sigiloso")
        linhas.push(
          `NosAcoes[${k++}] = new infraArvoreAcao("NIVEL_ACESSO","NA${d.id}","${d.id}","javascript:alert('Acesso Sigiloso');",null,"Acesso Sigiloso","svg/documento_sigiloso.svg?18",true);`,
        );
      if (s === "restrito")
        linhas.push(
          `NosAcoes[${k++}] = new infraArvoreAcao("NIVEL_ACESSO","NA${d.id}","${d.id}","javascript:alert('Acesso Restrito\\\\nHipotese');",null,"Acesso Restrito\\nHipotese","svg/documento_restrito.svg?18",true);`,
        );
      if (s === "ug")
        linhas.push(`NosAcoes[${k++}] = new infraArvoreAcao("UNIDADE_GERADORA","UG${d.id}","${d.id}","#",null,"Unidade","",true,"UNID");`);
    }
  return `<html><body><form id="frmArvore"><div id="divArvore"><span id="span900" class="infraArvoreNoSelecionado">No</span></div></form><script>${linhas.join("\n")}</script></body></html>`;
}

function arvoreDe(html: string, selecionado = true): { doc: Document; arv: Arvore } {
  const doc = new DOMParser().parseFromString(html, "text/html") as unknown as Document;
  const arv = lerArvore(paginaDe(doc, URL_ARVORE));
  // A árvore estática do SEI não traz o <span> do nó (ele nasce do script): o teste o põe, como a tela do usuário.
  const span = doc.createElement("span");
  span.id = `span${arv.idProcedimento}`;
  if (selecionado) span.className = "infraArvoreNoSelecionado";
  (doc.getElementById("frmArvore") ?? doc.body).append(span);
  return { doc, arv };
}

const iso = (s: string): Date => new Date(`${s}Z`);

function passagem(o: Partial<Passagem> & { unidade: string; de: string; ate?: string | null }): Passagem {
  const recebido = iso(o.de);
  const remetido = o.ate ? iso(o.ate) : null;
  const fimMs = remetido ? remetido.getTime() : iso("2026-10-24T10:00:00").getTime();
  const { de: _d, ate: _a, ...resto } = o;
  return {
    chave: o.unidade.toLowerCase(),
    recebido,
    remetido,
    emCurso: remetido === null,
    duracaoMs: Math.max(0, fimMs - recebido.getTime()),
    inicio: "recebido",
    fim: remetido ? "remessa" : null,
    destinos: [],
    documentos: [],
    assinaturas: [],
    ...resto,
  };
}

const texto = (el: Element | null | undefined): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

// --- Cenário do controle ---------------------------------------------------------------------------------------------

interface Falsos {
  pedidos: string[];
  copias: string[];
  avisos: string[];
  coleta: EstadoColeta | "pronto";
  ouvintesColeta: Array<() => void>;
  ouvintesCache: Array<() => void>;
  ouvintesArvore: Array<() => void>;
  fatias: FatiasLidas;
  historico: HistoricoGuardado | null;
  arvoreDoc: Document;
  cacheLeituras: number;
}

interface Cenario {
  capaDoc: Document;
  falsos: Falsos;
  deps: DepsCapa;
  /** Avisa que o cache mudou (o `chrome.storage.onChanged`). */
  mudarCache(): void;
}

function cenario(
  o: {
    html?: string;
    sigiloso?: boolean;
    fatias?: FatiasLidas;
    historico?: HistoricoGuardado | null;
    selecionado?: boolean;
    limite?: number;
    st?: Record<string, string>;
    agora?: Date;
    esperaMs?: number;
  } = {},
): Cenario {
  const { doc: arvoreDoc } = arvoreDe(o.html ?? htmlDaArvore("arvore_completa.html"), o.selecionado ?? true);
  const capaDoc = instalarDom(
    '<html><body><div id="divArvoreHtml" class="d-flex w-100"><div id="divArvoreInformacao" style="display:block">Processo aberto somente na unidade <a class="ancoraSigla" id="x1">TESTE</a>.<br></div></div></body></html>',
  );
  const f: Falsos = {
    pedidos: [],
    copias: [],
    avisos: [],
    coleta: { fase: "parada" },
    ouvintesColeta: [],
    ouvintesCache: [],
    ouvintesArvore: [],
    fatias: o.fatias ?? {},
    historico: o.historico ?? null,
    arvoreDoc,
    cacheLeituras: 0,
  };
  const ponte: PonteDaArvore = {
    documento: () => f.arvoreDoc,
    pedirFatias: () => void f.pedidos.push("pedir"),
    calcular: () => void f.pedidos.push("calcular"),
    cancelar: () => void f.pedidos.push("cancelar"),
    abrirHistorico: () => void f.pedidos.push("gantt"),
    coleta: () => f.coleta,
    aoMudarColeta: (cb) => {
      f.ouvintesColeta.push(cb);
      return () => void f.ouvintesColeta.splice(f.ouvintesColeta.indexOf(cb), 1);
    },
    aoRecarregarArvore: (cb) => {
      f.ouvintesArvore.push(cb);
      return () => void f.ouvintesArvore.splice(f.ouvintesArvore.indexOf(cb), 1);
    },
  };
  const fonte: FonteDeCache = {
    fatias: async () => {
      f.cacheLeituras++;
      return f.fatias;
    },
    historico: async () => f.historico,
    aoMudar: (cb) => {
      f.ouvintesCache.push(cb);
      return () => void f.ouvintesCache.splice(f.ouvintesCache.indexOf(cb), 1);
    },
  };
  const st = new Map(Object.entries(o.st ?? {}));
  const deps: DepsCapa = {
    doc: capaDoc,
    ponte,
    cache: () => fonte,
    agora: () => o.agora ?? AGORA,
    unidade: "TESTE",
    limite: o.limite ?? LIMITE_PARADO_PADRAO,
    armazenamento: { getItem: (k) => st.get(k) ?? null },
    linkPermanente: (id) => `https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=${id}`,
    copiar: async (t) => {
      f.copias.push(t);
      return true;
    },
    avisar: (t) => void f.avisos.push(t),
    escuro: () => false,
    aoMudarTema: () => () => {},
    prazoMs: 300,
    esperaMs: o.esperaMs ?? 60,
  };
  return {
    capaDoc,
    falsos: f,
    deps,
    mudarCache: () => {
      for (const cb of [...f.ouvintesCache]) cb();
    },
  };
}

const dadosProcesso: DadoProcesso = {
  disponivel: true,
  valor: {
    tipo: "Compras: aquisicao",
    especificacao: "Compra de canetas (URGENTE)",
    assuntos: ["004.01 - Material de consumo"],
    interessados: ["Maria Souza", "Joao Lima"],
    observacoes: "pedido do nucleo",
    observacoesOutras: [{ unidade: "OUTRA", observacao: "obs dela" }],
    editavel: true,
    nivel: "restrito",
    hipotese: "Informacao pessoal (Art. 31 da Lei 12.527/2011)",
    autuacao: "10/07/2025",
  },
};

export async function verificarCapa(): Promise<void> {
  // ===== QR =====
  secao("qr: formato, correcao de erro e estrutura");
  {
    const tabela = [
      "101010000010010",
      "101000100100101",
      "101111001111100",
      "101101101001011",
      "100010111111001",
      "100000011001110",
      "100111110010111",
      "100101010100000",
    ];
    checar(
      "informacao de formato (nivel M) das 8 mascaras confere com a tabela da norma",
      tabela.every((bits, m) => internosDoQr.bchFormato(m).toString(2).padStart(15, "0") === bits),
      tabela.map((_, m) => internosDoQr.bchFormato(m).toString(2).padStart(15, "0")),
    );
    checar(
      "informacao de versao 7 confere com a tabela (000111110010010100)",
      internosDoQr.bchVersao(7).toString(2).padStart(18, "0") === "000111110010010100",
    );
    checar(
      "informacao de versao 10 confere com a tabela (001010010011010011)",
      internosDoQr.bchVersao(10).toString(2).padStart(18, "0") === "001010010011010011",
    );

    const url = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=148265";
    const bytes = new TextEncoder().encode(url);
    const v = internosDoQr.versaoDe(url);
    checar("url de 104 bytes cabe na versao 6 (41 modulos)", bytes.length === 104 && v === 6 && gerarQr(url)?.length === 41, {
      n: bytes.length,
      v,
    });
    checar("texto que nao cabe devolve null", gerarQr("x".repeat(300)) === null);
    checar("endereco curto: versao 1 (21 modulos)", gerarQr("abc")?.length === 21);

    // Cada bloco (dados + correcao) e multiplo do gerador: o polinomio vale zero em alfa^0 .. alfa^(ec-1).
    for (const teste of [
      "abc",
      url,
      "https://sei.exemplo.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=1&x=" + "y".repeat(110),
    ]) {
      const vers = internosDoQr.versaoDe(teste);
      const cw = internosDoQr.codewords(new TextEncoder().encode(teste), vers);
      const { blocos, ec } = internosDoQr.blocos[vers - 1] as (typeof internosDoQr.blocos)[number];
      const lista = blocos.flatMap(([qtd, tam]) => Array.from({ length: qtd }, () => tam));
      const maior = Math.max(...lista);
      const dados = lista.map(() => [] as number[]);
      const ecs = lista.map(() => [] as number[]);
      let p = 0;
      for (let i = 0; i < maior; i++)
        lista.forEach((tam, b) => {
          if (i < tam) dados[b]!.push(cw[p++] ?? 0);
        });
      for (let i = 0; i < ec; i++)
        lista.forEach((_, b) => {
          ecs[b]!.push(cw[p++] ?? 0);
        });
      // Avalia a palavra de codigo em x = alfa^i (Horner); o resultado deve ser 0.
      const mul = (a: number, b: number): number => {
        let r = 0;
        let x = a;
        let y = b;
        while (y) {
          if (y & 1) r ^= x;
          x <<= 1;
          if (x & 0x100) x ^= 0x11d;
          y >>= 1;
        }
        return r;
      };
      let ok = p === cw.length;
      for (let b = 0; b < lista.length && ok; b++) {
        const palavra = [...(dados[b] as number[]), ...(ecs[b] as number[])];
        for (let i = 0; i < ec && ok; i++) {
          const alfa = internosDoQr.expoente(i);
          let acc = 0;
          for (const c of palavra) acc = mul(acc, alfa) ^ c;
          if (acc !== 0) ok = false;
        }
      }
      checar(`bytes de correcao (Reed-Solomon) validos: versao ${vers}, ${lista.length} bloco(s)`, ok);
    }

    // Estrutura: localizadores, sincronismo, modulo escuro e informacao de formato igual nas duas copias.
    const m = gerarQr(url) as boolean[][];
    const n = m.length;
    const loc = (r0: number, c0: number) =>
      [0, 6].every((d) => Array.from({ length: 7 }, (_, i) => m[r0 + d]![c0 + i] && m[r0 + i]![c0 + d]).every(Boolean)) &&
      m[r0 + 3]![c0 + 3] === true &&
      m[r0 + 1]![c0 + 1] === false &&
      m[r0 + 5]![c0 + 5] === false;
    checar("tres localizadores nos cantos", loc(0, 0) && loc(0, n - 7) && loc(n - 7, 0));
    checar("separadores claros ao redor dos localizadores", Array.from({ length: 8 }, (_, i) => !m[7]![i] && !m[i]![7]).every(Boolean));
    checar(
      "linha e coluna de sincronismo alternam",
      Array.from({ length: n - 16 }, (_, i) => m[6]![8 + i] === (i % 2 === 0) && m[8 + i]![6] === (i % 2 === 0)).every(Boolean),
    );
    checar("modulo escuro fixo", m[n - 8]![8] === true);
    const bitsA: number[] = [];
    const bitsB: number[] = [];
    for (let i = 0; i < 15; i++) {
      const rA = i < 6 ? i : i < 8 ? i + 1 : n - 15 + i;
      bitsA.push(m[rA]![8] ? 1 : 0);
      const cB = i < 8 ? n - i - 1 : i < 9 ? 15 - i - 1 + 1 : 15 - i - 1;
      bitsB.push(m[8]![cB] ? 1 : 0);
    }
    const lido = bitsA.reduceRight((a, b) => (a << 1) | b, 0);
    const mascaraLida = Array.from({ length: 8 }, (_, k) => k).find((k) => internosDoQr.bchFormato(k) === lido);
    checar(
      "informacao de formato lida da matriz: nivel M e uma mascara valida, igual nas duas copias",
      mascaraLida !== undefined && bitsA.join("") === bitsB.join(""),
      { lido: lido.toString(2) },
    );
    const todas = internosDoQr.porMascara(url);
    checar(
      "a matriz escolhida e uma das 8 mascaras",
      todas.some((mm) => JSON.stringify(mm) === JSON.stringify(m)),
    );
    checar("o QR e deterministico", JSON.stringify(gerarQr(url)) === JSON.stringify(m));
    checar("acentos: texto em UTF-8 (16 bytes: versao 2, 25 modulos)", gerarQr("Aponte a câmera")?.length === 25);

    const doc = instalarDom();
    const svg = desenharQr(doc, url);
    checar(
      "SVG com role=img, rotulo e um unico path",
      svg?.getAttribute("role") === "img" && !!svg.getAttribute("aria-label") && svg.querySelectorAll("path").length === 1,
      svg?.outerHTML.slice(0, 120),
    );
    checar(
      "SVG: viewBox com a zona de silencio de 4 modulos e fundo branco",
      svg?.getAttribute("viewBox") === `0 0 ${n + 8} ${n + 8}` && svg?.querySelector("rect")?.getAttribute("fill") === "#ffffff",
    );
    checar("QR grande demais nao desenha nada", desenharQr(doc, "x".repeat(400)) === null);
  }

  // ===== Cards da arvore =====
  secao("cards da arvore: fixtures do SEI 4.1 e arvore no formato do SEI 5");
  {
    const completa = arvoreDe(htmlDaArvore("arvore_completa.html")).arv;
    const c = contagemDaArvore(completa);
    const cartoes = cardsDaArvore(completa);
    const por = (id: string) => cartoes.find((x) => x.id === id);
    checar("arvore completa (4.1): total de documentos = os do lerArvore", c.total === completa.documentos.length && c.total === 43, c);
    checar("internos + externos = total", c.internos + c.externos === c.total && c.internos > 0 && c.externos > 0, c);
    checar("card de documentos mostra o total", por("documentos")?.valor === "43");
    checar("card internos e externos", por("internosExternos")?.valor === `${c.internos} / ${c.externos}`);
    checar(
      "card assinados: N de total com percentual",
      por("assinados")?.valor === `${c.assinados} de ${c.total}` && /%/.test(por("assinados")?.detalhe ?? ""),
      por("assinados"),
    );
    checar(
      "card cancelados conta os cancelados",
      por("cancelados")?.valor === String(completa.documentos.filter((d) => d.cancelado).length),
    );
    checar("card de pastas conta os nos PASTA", por("pastas")?.valor === "3" && contarPastas(completa) === 3);
    checar(
      "todos os cards da arvore sao 'pronto' e de origem arvore",
      cartoes.length === 6 && cartoes.every((x) => x.estado === "pronto" && x.origem === "arvore"),
    );
    checar("com as pastas carregadas nao ha aviso de pasta fechada", por("documentos")?.detalhe === undefined);

    const fechada = arvoreDe(htmlDaArvore("arvore.html")).arv;
    const cf = cardsDaArvore(fechada);
    checar(
      "arvore com pastas fechadas (4.1): conta so o que a pagina traz",
      contagemDaArvore(fechada).total === fechada.documentos.length && fechada.documentos.length === 4,
    );
    checar(
      "pastas fechadas: o card avisa que nao foram contadas",
      /pastas? fechadas? n/.test(cf.find((x) => x.id === "documentos")?.detalhe ?? ""),
      cf.find((x) => x.id === "documentos"),
    );
    checar("pastas fechadas: card de pastas = 3", cf.find((x) => x.id === "pastas")?.valor === "3");

    // SEI 5 (sintetica): internos, externos (PDF e zip), cancelado, restrito e sigiloso, assinado, sem pastas.
    const sei5 = arvoreDe(
      arvoreSintetica([
        { id: "1", nome: "Despacho", icone: "documento_interno", sinais: ["assinado", "ug"] },
        { id: "2", nome: "Oficio", icone: "documento_interno", sinais: ["restrito"] },
        { id: "3", nome: "Nota", icone: "documento_interno", sinais: ["sigiloso", "assinado"] },
        { id: "4", nome: "Anexo", icone: "documento_pdf", src: "controlador.php?acao=documento_download_anexo&id_documento=4" },
        { id: "5", nome: "Planilha", icone: "documento_zip", src: "controlador.php?acao=documento_download_anexo&id_documento=5" },
        { id: "6", nome: "Cancelado", icone: "documento_cancelado" },
      ]),
    ).arv;
    const c5 = contagemDaArvore(sei5);
    const k5 = cardsDaArvore(sei5);
    checar(
      "SEI 5 (sintetico): 6 documentos, 4 internos? (cancelado conta como interno) e 2 externos",
      c5.total === 6 && c5.externos === 2 && c5.internos === 4,
      c5,
    );
    checar("SEI 5: 2 assinados e 1 cancelado", c5.assinados === 2 && c5.cancelados === 1, c5);
    checar(
      "SEI 5: 1 sigiloso e detalhe com 1 restrito",
      k5.find((x) => x.id === "sigilosos")?.valor === "1" && k5.find((x) => x.id === "sigilosos")?.detalhe === "1 restrito",
      k5.find((x) => x.id === "sigilosos"),
    );
    checar(
      "SEI 5: sem pastas, 0 e sem aviso",
      k5.find((x) => x.id === "pastas")?.valor === "0" && k5.find((x) => x.id === "documentos")?.detalhe === undefined,
    );
    const vazio = cardsDaArvore(arvoreDe(arvoreSintetica([])).arv);
    checar(
      "processo sem documentos: zeros, sem percentual nem erro",
      vazio.find((x) => x.id === "documentos")?.valor === "0" &&
        vazio.find((x) => x.id === "assinados")?.valor === "0 de 0" &&
        vazio.find((x) => x.id === "assinados")?.detalhe === undefined,
    );
  }

  // ===== Cards do historico e parado =====
  secao("cards do historico: sem cache, com cache, parado");
  const andamentos = andamentosReais();
  const passagens = calcularPassagens(andamentos, AGORA);
  {
    const sem = cardsDoHistorico({ passagens: null, unidade: "TESTE", parado: null, alerta: false, limite: 15 });
    checar(
      "sem historico: quatro cards pendentes (tracejados)",
      sem.length === 4 && sem.every((c) => c.estado === "pendente" && c.origem === "historico" && c.valor === "—"),
      sem.map((c) => c.id),
    );
    checar(
      "os pendentes sao unidades, tramitacoes, tempo total e na unidade atual",
      sem.map((c) => c.id).join() === "unidades,tramitacoes,tempoTotal,naUnidade",
    );

    const naTeste = passagemNaUnidade(passagens, "TESTE");
    const parado = diasParado({ passagens, sigla: "TESTE", recebidoEm: null }, AGORA);
    const com = cardsDoHistorico({ passagens, unidade: "TESTE", parado, alerta: false, limite: 15 });
    const por = (id: string) => com.find((c) => c.id === id);
    checar(
      "com historico: os cards ficam prontos",
      com.slice(0, 4).every((c) => c.estado === "pronto"),
    );
    checar(
      "unidades por onde passou = raias distintas",
      por("unidades")?.valor === String(new Set(passagens.map((p) => p.chave)).size),
      por("unidades"),
    );
    checar(
      "tramitacoes = passagens encerradas por remessa ou mantidas abertas",
      por("tramitacoes")?.valor === String(passagens.filter((p) => p.fim === "remessa" || p.mantidoAberto).length),
    );
    checar(
      "tempo total tem duracao e a data de inicio",
      /\d/.test(por("tempoTotal")?.valor ?? "") && /^desde \d{2}\/\d{2}\/\d{4}$/.test(por("tempoTotal")?.detalhe ?? ""),
      por("tempoTotal"),
    );
    checar(
      "na unidade atual: a passagem em curso da TESTE",
      !!naTeste && por("naUnidade")?.valor !== "—" && /^desde /.test(por("naUnidade")?.detalhe ?? ""),
      por("naUnidade"),
    );
    checar(
      "o processo foi gerado por alguem: card 'Gerado por' quando o historico diz",
      por("geradoPor") === undefined || /\S/.test(por("geradoPor")?.valor ?? ""),
      por("geradoPor"),
    );

    const fora = cardsDoHistorico({ passagens, unidade: "NAOEXISTE", parado: null, alerta: false, limite: 15 }).find(
      (c) => c.id === "naUnidade",
    );
    checar(
      "unidade sem passagem em curso: traco e aviso de que o processo nao esta aqui",
      fora?.valor === "—" && /não está aberto/.test(fora.detalhe ?? ""),
      fora,
    );

    // Parado
    checar(
      "dias desde o recebimento: inteiros, no relogio do SEI",
      diasDesde(iso("2026-10-14T09:00:00"), AGORA) === 10 && diasDesde(iso("2026-10-24T09:59:00"), AGORA) === 0,
    );
    checar("data no futuro nao da dias negativos", diasDesde(iso("2026-12-01T00:00:00"), AGORA) === 0);
    const ps = [passagem({ unidade: "TESTE", de: "2026-09-20T08:00:00" })];
    const p = diasParado({ passagens: ps, sigla: "TESTE", recebidoEm: iso("2026-01-01T00:00:00") }, AGORA);
    checar("historico vale mais que a data do legado", p?.origem === "historico" && p.dias === 34, p);
    const l = diasParado({ passagens: null, sigla: "TESTE", recebidoEm: iso("2026-10-01T00:00:00") }, AGORA);
    checar("sem historico: a data de recebimento do legado", l?.origem === "recebimento" && l.dias === 23, l);
    checar("sem nada: nao se sabe", diasParado({ passagens: null, sigla: "TESTE", recebidoEm: null }, AGORA) === null);
    checar(
      "historico sem passagem na unidade cai para o legado",
      diasParado(
        { passagens: [passagem({ unidade: "OUTRA", de: "2026-10-01T00:00:00" })], sigla: "TESTE", recebidoEm: iso("2026-10-20T00:00:00") },
        AGORA,
      )?.origem === "recebimento",
    );
    checar(
      "passou do limite: so acima (15 nao alerta, 16 alerta)",
      !estaParado({ dias: 15, desde: AGORA, origem: "historico" }, 15) && estaParado({ dias: 16, desde: AGORA, origem: "historico" }, 15),
    );
    checar("limite 0 desliga o alerta", !estaParado({ dias: 400, desde: AGORA, origem: "historico" }, 0) && !estaParado(null, 15));
    checar(
      "limite: ausente = 15, 0 = desligado, texto numerico, invalido = 15",
      limiteDeParado(undefined) === 15 &&
        limiteDeParado(0) === 0 &&
        limiteDeParado("7") === 7 &&
        limiteDeParado("abc") === 15 &&
        limiteDeParado(-3) === 15 &&
        limiteDeParado("") === 15 &&
        limiteDeParado(12.9) === 12,
    );

    const alerta = cardsDoHistorico({ passagens: ps, unidade: "TESTE", parado: p, alerta: true, limite: 15 }).find(
      (c) => c.id === "naUnidade",
    );
    checar(
      "alerta de parado destaca o card 'Na unidade atual'",
      alerta?.alerta === true && /parado há 34 dias \(limite: 15\)/.test(alerta.detalhe ?? ""),
      alerta,
    );
    const semAlerta = cardsDoHistorico({ passagens: ps, unidade: "TESTE", parado: p, alerta: false, limite: 15 }).find(
      (c) => c.id === "naUnidade",
    );
    checar("sem alerta o card nao e destacado", semAlerta?.alerta === undefined);

    const guardado = {
      getItem: (k: string) =>
        k === "configDataRecebimentoPro"
          ? JSON.stringify([
              { id_procedimento: 7, datahora: "05/10/2026 14:30", unidade: "TESTE" },
              { id_procedimento: "148265", datahora: "20/10/2026 09:15" },
            ])
          : null,
    };
    const rec = recebimentoDoLegado(guardado, "148265");
    checar(
      "legado: le datahora da entrada do processo (so leitura)",
      rec?.toISOString() === "2026-10-20T09:15:00.000Z",
      rec?.toISOString(),
    );
    const formatoReal = {
      getItem: () =>
        JSON.stringify([
          { id_procedimento: "110895", datahora: "2025-02-24 13:28:00", unidade: "TESTE", descricao: "Processo recebido na unidade" },
        ]),
    };
    checar(
      "legado: o formato real do SEI Pro (aaaa-mm-dd hh:mm:ss, medido ao vivo)",
      recebimentoDoLegado(formatoReal, "110895")?.toISOString() === "2025-02-24T13:28:00.000Z",
      recebimentoDoLegado(formatoReal, "110895")?.toISOString(),
    );
    checar("legado: id numerico tambem casa", recebimentoDoLegado(guardado, "7")?.toISOString() === "2026-10-05T14:30:00.000Z");
    checar(
      "legado: processo ausente, lixo e storage quebrado dao null",
      recebimentoDoLegado(guardado, "999") === null &&
        recebimentoDoLegado({ getItem: () => "{nao e json" }, "1") === null &&
        recebimentoDoLegado(
          {
            getItem: () => {
              throw new Error("x");
            },
          },
          "1",
        ) === null &&
        recebimentoDoLegado({ getItem: () => null }, "1") === null,
    );
  }

  // ===== Resumo =====
  secao("resumo do processo");
  {
    const r = resumoDoProcesso({
      protocolo: "99906.713-630.000032/2025-82",
      sigiloso: false,
      tipo: "Compras",
      interessados: ["Maria Souza", "Joao Lima"],
      situacao: "Processo aberto somente na unidade TESTE.",
      unidade: "TESTE",
      diasNaUnidade: 12,
      documentos: { total: 43, internos: 30, externos: 13, assinados: 20, cancelados: 1 },
    });
    checar(
      "resumo completo",
      r ===
        [
          "Processo 99906.713-630.000032/2025-82",
          "Tipo: Compras",
          "Interessados: Maria Souza; Joao Lima",
          "Situação: Processo aberto somente na unidade TESTE",
          "Unidade atual: TESTE (12 dias na unidade)",
          "Documentos: 43 (30 internos, 13 externos; 20 assinados; 1 cancelado)",
        ].join("\n"),
      r,
    );
    checar(
      "resumo sem historico nem data: sem a parte dos dias",
      !/dias? na unidade/.test(resumoDoProcesso({ protocolo: "1", sigiloso: false, unidade: "TESTE", diasNaUnidade: null })),
    );
    checar(
      "um interessado e um dia usam o singular",
      /Interessado: A\n/.test(
        resumoDoProcesso({ protocolo: "1", sigiloso: false, interessados: ["A"], unidade: "T", diasNaUnidade: 1 }) + "\n",
      ) && /\(1 dia na unidade\)/.test(resumoDoProcesso({ protocolo: "1", sigiloso: false, unidade: "T", diasNaUnidade: 1 })),
    );
    checar(
      "situacao com varias unidades (uma por linha no SEI) sai numa linha so",
      situacaoEmUmaLinha("Processo aberto nas unidades:\nCC-CJ-NAA\nTESTE\nTESTE_1_1\n") ===
        "Processo aberto nas unidades: CC-CJ-NAA, TESTE, TESTE_1_1" &&
        situacaoEmUmaLinha("Processo aberto somente na unidade TESTE.") === "Processo aberto somente na unidade TESTE" &&
        situacaoEmUmaLinha(undefined) === "",
    );
    checar(
      "sigiloso: so o numero",
      resumoDoProcesso({
        protocolo: "99906.1/2026-1",
        sigiloso: true,
        tipo: "Secreto",
        interessados: ["Fulano"],
        documentos: { total: 1, internos: 1, externos: 0, assinados: 0, cancelados: 0 },
      }) === "99906.1/2026-1",
    );
  }

  // ===== Vista =====
  secao("vista: o que a capa mostra");
  {
    const { arv } = arvoreDe(htmlDaArvore("arvore_completa.html"));
    const base = {
      arv,
      fatias: {},
      passagens: null,
      unidade: "TESTE",
      agora: AGORA,
      limite: 15,
      recebidoEm: null,
      coleta: { fase: "parada" } as EstadoColeta,
      espera: "aguardando" as const,
      linkPermanente: "https://x/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=148265",
    };
    const sem = montarVista(base);
    checar(
      "sem cache: cards da arvore + 4 pendentes, dados 'carregando'",
      sem.cards.length === 10 && sem.cards.filter((c) => c.estado === "pendente").length === 4 && sem.dados === "carregando",
      { n: sem.cards.length, dados: sem.dados },
    );
    checar(
      "sem cache: tipo e nivel vem da arvore (restrito com hipotese)",
      sem.tipo === arv.tipo && /^Restrito: /.test(sem.nivel.rotulo),
      sem.nivel,
    );
    checar(
      "sem cache: marcadores vem da propria arvore (nome e texto)",
      sem.marcadores.length === arv.marcadores.length && sem.marcadores.length > 0,
      sem.marcadores,
    );
    checar("desistiu: dados 'indisponivel'", montarVista({ ...base, espera: "desistiu" }).dados === "indisponivel");
    const com = montarVista({
      ...base,
      fatias: {
        dadosProcesso,
        atribuicao: {
          usuario: null,
          unidadeAberta: true,
          texto: "Processo aberto somente na unidade TESTE.",
          linhas: [],
          editavel: true,
        } as never,
        blocoInterno: { descricao: "Bloco 12", coletadoEm: 1 },
      },
    });
    checar(
      "com cache: autuacao, especificacao, assuntos, interessados",
      com.autuacao === "10/07/2025" &&
        com.especificacao === "Compra de canetas (URGENTE)" &&
        com.assuntos.length === 1 &&
        com.interessados.length === 2 &&
        com.dados === "pronto",
    );
    checar("especificacao URGENTE vira a marca", com.urgente === true);
    checar("nivel do formulario com hipotese legal", com.nivel.rotulo === "Restrito: Informacao pessoal (Art. 31 da Lei 12.527/2011)");
    checar(
      "observacoes: da unidade e das outras (sem etiquetas)",
      com.observacoes.length === 2 && com.observacoes[0]?.unidade === "TESTE" && com.observacoes[1]?.unidade === "OUTRA",
      com.observacoes,
    );
    checar("bloco interno aparece quando o historico o trouxe", com.blocoInterno === "Bloco 12");
    checar("resumo leva a frase do SEI como situacao", com.resumo.situacao === "Processo aberto somente na unidade TESTE.");
    checar(
      "consultas desativadas: nota propria",
      montarVista({ ...base, fatias: { dadosProcesso: { disponivel: false, motivo: "consultas" } } }).dados === "consultas",
    );
    checar(
      "processo fechado na unidade: nota propria",
      montarVista({ ...base, fatias: { dadosProcesso: { disponivel: false, motivo: "acao" } } }).dados === "fechado",
    );
    const comMarcador = montarVista({
      ...base,
      fatias: {
        marcador: {
          editavel: true,
          itens: [{ id: "1", nome: "Urgente", texto: "Ate 25/10/2026 23:59\nresponder", icone: "svg/m.svg", usuario: "u", data: "d" }],
        },
      },
    });
    checar(
      "marcador do cache: icone, texto e prazo com situacao",
      comMarcador.marcadores[0]?.icone === "svg/m.svg" &&
        comMarcador.marcadores[0]?.texto === "responder" &&
        /^até 25\/10\/2026 · amanhã$/.test(comMarcador.marcadores[0]?.prazo?.rotulo ?? ""),
      comMarcador.marcadores[0],
    );

    const sig = arvoreDe(arvoreSintetica([{ id: "1", nome: "Doc", icone: "documento_interno" }], { sigiloso: true })).arv;
    const vs = montarVista({
      ...base,
      arv: sig,
      fatias: {
        dadosProcesso,
        marcador: { editavel: true, itens: [{ id: "1", nome: "X", texto: "", icone: "", usuario: "", data: "" }] },
        blocoInterno: { descricao: "B", coletadoEm: 1 },
      },
      passagens,
    });
    checar(
      "sigiloso: so cards da arvore (sem historico nem pendentes)",
      vs.sigiloso && vs.cards.every((c) => c.origem === "arvore") && vs.cards.length === 6,
      vs.cards.map((c) => c.id),
    );
    checar(
      "sigiloso: nada de especificacao, assuntos, interessados, observacoes, marcador, bloco",
      vs.especificacao === undefined &&
        vs.assuntos.length === 0 &&
        vs.interessados.length === 0 &&
        vs.observacoes.length === 0 &&
        vs.marcadores.length === 0 &&
        vs.blocoInterno === undefined &&
        vs.autuacao === undefined,
    );
    checar("sigiloso: nivel Sigiloso e sem alerta de parado", vs.nivel.rotulo === "Sigiloso" && vs.alerta === false && vs.parado === null);
    checar("sigiloso: resumo e so o numero", resumoDoProcesso(vs.resumo) === sig.protocolo);
  }

  // ===== Ponte: coleta e cache =====
  secao("ponte: estado da coleta e cache");
  {
    checar(
      "coleta: ausente = parada; coletando com progresso; erro com mensagem; pronto",
      JSON.stringify(lerColeta(null)) === '{"fase":"parada"}' &&
        JSON.stringify(lerColeta("coletando:7/34")) === '{"fase":"coletando","feito":7,"total":34}' &&
        JSON.stringify(lerColeta("erro:Sem conexao")) === '{"fase":"erro","mensagem":"Sem conexao"}' &&
        lerColeta("pronto") === "pronto" &&
        JSON.stringify(lerColeta("lixo")) === '{"fase":"parada"}',
    );
    checar(
      "coleta: texto <-> estado",
      textoDaColeta({ fase: "coletando", feito: 3, total: 9 }) === "coletando:3/9" &&
        textoDaColeta({ fase: "parada" }) === null &&
        textoDaColeta("pronto") === "pronto" &&
        textoDaColeta({ fase: "erro", mensagem: "x" }) === "erro:x",
    );
    const area = areaMemoria();
    const fonte = criarFonteDeCache(area, ESCOPO, "148265");
    const vistas: number[] = [];
    const sair = fonte.aoMudar(() => vistas.push(1));
    checar("cache vazio: sem fatias e sem historico", Object.keys(await fonte.fatias()).length === 0 && (await fonte.historico()) === null);
    await area.gravar({
      [chaveCache(ESCOPO, "148265")]: {
        em: 1,
        fatias: {
          dadosProcesso: { dado: dadosProcesso, em: 1 },
          marcador: { dado: { itens: [], editavel: false }, em: 1 },
          anotacao: { dado: 1, em: 1 },
        },
      },
    });
    checar("onChanged da chave do processo avisa", vistas.length === 1);
    const f = await fonte.fatias();
    checar(
      "le dadosProcesso e marcador do cache e ignora o que a capa nao usa",
      !!f.dadosProcesso && !!f.marcador && Object.keys(f).length === 2,
      Object.keys(f),
    );
    await area.gravar({ [chaveCache(ESCOPO, "OUTRO")]: { em: 1, fatias: {} }, qualquer: 1 });
    checar("onChanged de outra chave nao avisa", vistas.length === 1);
    const hist: HistoricoGuardado = { coletadoEm: AGORA.getTime(), hash: "h", total: andamentos.length, andamentos };
    await area.gravar({ [chaveHistorico(ESCOPO, "148265")]: hist });
    checar(
      "onChanged da chave do historico avisa e o historico volta",
      vistas.length === 2 && (await fonte.historico())?.total === andamentos.length,
    );
    sair();
    await area.gravar({ [chaveHistorico(ESCOPO, "148265")]: { ...hist, hash: "z" } });
    checar("depois de sair, nao avisa mais", vistas.length === 2);
  }

  // ===== Cor do tema =====
  secao("controle: destaque segue a cor do tema do SEI");
  {
    const c = cenario();
    c.deps.corTema = () => "#12804c";
    const capa = await montarCapa(c.deps);
    const raiz = c.capaDoc.getElementById("capaProcessoPro");
    checar(
      "com cor do tema: data-cor-sei e --spro-cor-sei na raiz",
      raiz?.hasAttribute("data-cor-sei") === true && raiz.style.getPropertyValue("--spro-cor-sei") === "#12804c",
    );
    capa?.destruir();
  }

  // ===== Controle =====
  secao("controle: desenha uma vez, nao se redesenha em loop");
  {
    const c = cenario();
    const capa = await montarCapa(c.deps);
    checar("monta a capa", !!capa);
    const doc = c.capaDoc;
    const raiz = doc.getElementById("capaProcessoPro");
    checar(
      "a raiz mantem o id capaProcessoPro (o Agente de IA a procura) e e o primeiro filho do #divArvoreHtml",
      raiz?.getAttribute("data-spro-capa") === "1" && doc.getElementById("divArvoreHtml")?.firstElementChild === raiz,
    );
    checar(
      "sem cor do tema do SEI: sem data-cor-sei (fica o azul padrao)",
      !raiz?.hasAttribute("data-cor-sei") && !raiz?.style.getPropertyValue("--spro-cor-sei"),
    );
    checar("tira a classe d-flex do contenedor (espremia a capa)", !doc.getElementById("divArvoreHtml")?.classList.contains("d-flex"));
    const cartoes = [...doc.querySelectorAll(".spro-c-card")];
    checar(
      "faixa: 6 cards da arvore + 4 pendentes",
      cartoes.length === 10 && doc.querySelectorAll(".spro-c-card.pendente").length === 4,
      cartoes.length,
    );
    checar("card de documentos mostra 43", texto(doc.querySelector('[data-id="documentos"]')).includes("43"));
    checar(
      "cards pendentes sao botoes 'Calcular'",
      [...doc.querySelectorAll("button.spro-c-card.pendente")].every((b) => /Calcular$/.test(texto(b))),
    );
    checar(
      "aviso do SEI vai para o lado, sem ids repetidos, e o original some",
      /Processo aberto somente na unidade TESTE/.test(texto(doc.querySelector(".spro-c-info"))) &&
        !doc.querySelector(".spro-c-info [id]") &&
        (doc.getElementById("divArvoreInformacao") as HTMLElement).style.display === "none",
    );
    checar(
      "QR code no lado, com o link permanente",
      !!doc.querySelector(".spro-c-qr svg") && /Aponte a câmera/.test(texto(doc.querySelector(".spro-c-qr"))),
    );
    checar(
      "acessibilidade: a faixa e uma lista; cada card e um item (o card pendente e um botao DENTRO do item, nao o proprio item)",
      doc.querySelector(".spro-c-faixa")?.getAttribute("role") === "list" &&
        doc.querySelectorAll('.spro-c-faixa > [role="listitem"]').length === 10 &&
        [...doc.querySelectorAll("button.spro-c-card.pendente")].every(
          (b) => b.getAttribute("role") === null && b.parentElement?.getAttribute("role") === "listitem",
        ) &&
        !doc.querySelector(".spro-c-faixa .spro-c-faixa-acoes"),
    );
    checar("pede as fatias ao quadro da arvore uma vez", c.falsos.pedidos.filter((p) => p === "pedir").length === 1);
    checar(
      "sem dados ainda: os campos mostram esqueleto, nao erro",
      !!doc.querySelector('[data-campo="dados"] .spro-c-esqueleto') && !doc.querySelector(".spro-c-erro"),
    );
    checar(
      "os campos fixos ja aparecem: processo, tipo, nivel, marcador",
      ["processo", "tipo", "nivel", "marcador"].every((id) => !!doc.querySelector(`[data-campo="${id}"]`)),
    );
    checar(
      "barra: link do historico e copiar resumo",
      !!doc.querySelector('[data-acao="historico"]') && !!doc.querySelector('[data-acao="resumo"]'),
    );

    const antes = capa!.desenhos();
    for (let i = 0; i < 20; i++) capa!.atualizar();
    for (let i = 0; i < 5; i++) c.mudarCache();
    await tique(40);
    checar("20 atualizacoes e 5 avisos de cache SEM mudanca nao redesenham nada", capa!.desenhos() === antes, {
      antes,
      depois: capa!.desenhos(),
    });
    capa!.destruir();
  }

  secao("controle: reage a onChanged, enriquece com o cache e preserva o que outros poem na raiz");
  {
    const c = cenario();
    const capa = (await montarCapa(c.deps))!;
    const doc = c.capaDoc;
    // O Agente de IA poe o cartao de sugestao como primeiro filho da raiz (capa.ts do agente-ia).
    const cartao = doc.createElement("div");
    cartao.id = "spro-cartao-fluxo";
    doc.getElementById("capaProcessoPro")!.prepend(cartao);
    c.falsos.fatias = {
      dadosProcesso,
      marcador: {
        editavel: true,
        itens: [{ id: "1", nome: "Urgente", texto: "Ate 25/10/2026 23:59", icone: "svg/m.svg", usuario: "", data: "" }],
      },
    };
    c.mudarCache();
    await tique(40);
    checar(
      "o cache chegou: campos preenchidos",
      texto(doc.querySelector('[data-campo="especificacao"]')).includes("Compra de canetas") &&
        texto(doc.querySelector('[data-campo="autuacao"]')).includes("10/07/2025") &&
        texto(doc.querySelector('[data-campo="interessados"]')).includes("Maria Souza"),
      texto(doc.querySelector(".spro-c-campos")),
    );
    checar("URGENTE em destaque", !!doc.querySelector('[data-campo="especificacao"] .spro-c-urgente'));
    checar(
      "nivel restrito com a hipotese legal",
      texto(doc.querySelector('[data-campo="nivel"]')).includes("Restrito: Informacao pessoal"),
    );
    checar(
      "marcador com icone e prazo",
      !!doc.querySelector('[data-campo="marcador"] img[src="svg/m.svg"]') &&
        /até 25\/10\/2026/.test(texto(doc.querySelector('[data-campo="marcador"]'))),
    );
    checar(
      "observacoes da unidade e das outras",
      texto(doc.querySelector('[data-campo="observacoes"]')).includes("TESTE: pedido do nucleo") &&
        texto(doc.querySelector('[data-campo="observacoes"]')).includes("OUTRA: obs dela"),
    );
    checar("o esqueleto saiu", !doc.querySelector('[data-campo="dados"]'));
    checar(
      "o cartao que o Agente poe na raiz sobrevive ao redesenho",
      doc.getElementById("capaProcessoPro")!.firstElementChild === cartao && !!doc.getElementById("spro-cartao-fluxo"),
    );
    checar("so UMA raiz #capaProcessoPro", doc.querySelectorAll("#capaProcessoPro").length === 1);
    capa.destruir();
  }

  secao("controle: sem resposta do quadro da arvore vira erro com nova tentativa");
  {
    const c = cenario({ esperaMs: 30 });
    const capa = (await montarCapa(c.deps))!;
    await tique(80);
    const erro = c.capaDoc.querySelector('[data-campo="dados"] .spro-c-erro');
    checar(
      "depois do prazo: 'Nao foi possivel carregar' e botao Tentar de novo (nunca spinner eterno)",
      !!erro && /Tentar de novo/.test(texto(erro)),
      texto(c.capaDoc.querySelector(".spro-c-campos")),
    );
    const antes = c.falsos.pedidos.filter((p) => p === "pedir").length;
    (erro!.querySelector("button") as HTMLButtonElement).click();
    await tique(10);
    checar(
      "Tentar de novo pede as fatias de novo e volta ao esqueleto",
      c.falsos.pedidos.filter((p) => p === "pedir").length === antes + 1 &&
        !!c.capaDoc.querySelector('[data-campo="dados"] .spro-c-esqueleto'),
    );
    c.falsos.fatias = { dadosProcesso };
    c.mudarCache();
    await tique(40);
    checar("quando a resposta chega, os campos aparecem", texto(c.capaDoc.querySelector(".spro-c-campos")).includes("Compra de canetas"));
    capa.destruir();
  }

  secao("controle: cards do historico (Calcular, progresso, erro, cache valido e vencido)");
  {
    const c = cenario();
    const capa = (await montarCapa(c.deps))!;
    const doc = c.capaDoc;
    const botao = doc.querySelector<HTMLButtonElement>('button.spro-c-card.pendente[data-id="tempoTotal"]')!;
    botao.click();
    checar("clicar em Calcular pede a coleta ao quadro da arvore (nao coleta aqui)", c.falsos.pedidos.includes("calcular"));
    c.falsos.coleta = { fase: "coletando", feito: 3, total: 34 };
    for (const cb of c.falsos.ouvintesColeta) cb();
    await tique(20);
    const ocupado = doc.querySelector('[data-id="naUnidade"]')!;
    checar(
      "durante a coleta: 'Calculando... pagina 3 de 34' e aria-busy",
      /Calculando\.\.\. página 3 de 34/.test(texto(ocupado)) && ocupado.getAttribute("aria-busy") === "true",
      texto(ocupado),
    );
    checar("durante a coleta: botao de cancelar o calculo", /Cancelar o cálculo/.test(texto(doc.querySelector(".spro-c-faixa-acoes"))));
    const nCalc = c.falsos.pedidos.filter((p) => p === "calcular").length;
    (ocupado as HTMLButtonElement).click();
    checar("clicar de novo durante a coleta nao dispara outra", c.falsos.pedidos.filter((p) => p === "calcular").length === nCalc);
    (doc.querySelector(".spro-c-faixa-acoes button") as HTMLButtonElement).click();
    checar("cancelar pede o cancelamento ao quadro da arvore", c.falsos.pedidos.includes("cancelar"));

    c.falsos.coleta = { fase: "erro", mensagem: "Sem conexao com o SEI." };
    for (const cb of c.falsos.ouvintesColeta) cb();
    await tique(20);
    checar(
      "erro da coleta: a mensagem e 'Tentar de novo' no card",
      /Sem conexao com o SEI\. Tentar de novo/.test(texto(doc.querySelector('[data-id="unidades"]'))),
      texto(doc.querySelector('[data-id="unidades"]')),
    );

    // Coleta pronta: o historico entra no cache e os cards ficam calculados
    c.falsos.historico = { coletadoEm: AGORA.getTime() - 5 * 60_000, hash: "h", total: andamentos.length, andamentos };
    c.falsos.coleta = "pronto";
    for (const cb of c.falsos.ouvintesColeta) cb();
    await tique(40);
    checar(
      "historico no cache (5 min): os 4 cards ficam calculados, nao tracejados",
      doc.querySelectorAll(".spro-c-card.pendente").length === 0 &&
        /\d/.test(texto(doc.querySelector('[data-id="tempoTotal"]'))) &&
        !/Calcular/.test(texto(doc.querySelector(".spro-c-faixa"))),
      texto(doc.querySelector(".spro-c-faixa")),
    );
    checar(
      "cards do historico: unidades e tramitacoes preenchidos",
      Number(texto(doc.querySelector('[data-id="unidades"] .spro-c-valor'))) > 1 &&
        Number(texto(doc.querySelector('[data-id="tramitacoes"] .spro-c-valor'))) > 0,
    );
    capa.destruir();

    const velho = cenario({ historico: { coletadoEm: AGORA.getTime() - 31 * 60_000, hash: "h", total: andamentos.length, andamentos } });
    const cv = (await montarCapa(velho.deps))!;
    checar("historico com mais de 30 min volta ao estado 'Calcular'", velho.capaDoc.querySelectorAll(".spro-c-card.pendente").length === 4);
    cv.destruir();

    const valido = cenario({ historico: { coletadoEm: AGORA.getTime() - 29 * 60_000, hash: "h", total: andamentos.length, andamentos } });
    const cvv = (await montarCapa(valido.deps))!;
    checar(
      "historico com 29 min aparece calculado ja na abertura (sem clicar)",
      valido.capaDoc.querySelectorAll(".spro-c-card.pendente").length === 0 && !valido.falsos.pedidos.includes("calcular"),
    );
    cvv.destruir();
  }

  secao("controle: alerta de processo parado");
  {
    const ps: Andamento[] = andamentos;
    const parado = passagemNaUnidade(calcularPassagens(ps, AGORA), "TESTE");
    const dias = parado ? diasDesde(parado.recebido, AGORA) : 0;
    const base = { historico: { coletadoEm: AGORA.getTime() - 60_000, hash: "h", total: ps.length, andamentos: ps } as HistoricoGuardado };
    const a = cenario({ ...base, limite: Math.max(0, dias - 1) || 1 });
    const ca = (await montarCapa(a.deps))!;
    checar(
      `na unidade ha ${dias} dias: com limite abaixo, o card 'Na unidade atual' fica em alerta`,
      dias > 1 &&
        !!a.capaDoc.querySelector('[data-id="naUnidade"].alerta') &&
        /parado há/.test(texto(a.capaDoc.querySelector('[data-id="naUnidade"]'))),
      texto(a.capaDoc.querySelector('[data-id="naUnidade"]')),
    );
    ca.destruir();
    const b = cenario({ ...base, limite: dias + 5 });
    const cb2 = (await montarCapa(b.deps))!;
    checar("com limite acima dos dias: sem alerta", !b.capaDoc.querySelector(".spro-c-card.alerta"));
    cb2.destruir();
    const z = cenario({ ...base, limite: 0 });
    const cz = (await montarCapa(z.deps))!;
    checar("limite 0: alerta desligado", !z.capaDoc.querySelector(".spro-c-card.alerta"));
    cz.destruir();
    // Sem o historico: a data de recebimento do legado
    const l = cenario({
      limite: 15,
      st: { configDataRecebimentoPro: JSON.stringify([{ id_procedimento: "148265", datahora: "01/10/2026 08:00" }]) },
    });
    const cl = (await montarCapa(l.deps))!;
    const cardLegado = l.capaDoc.querySelector('[data-id="naUnidade"]');
    checar(
      "sem historico, a data do legado ja da o 'Na unidade atual' (23 dias), em alerta, sem clicar em Calcular",
      !!cardLegado &&
        !cardLegado.classList.contains("pendente") &&
        cardLegado.classList.contains("alerta") &&
        /23 d/.test(texto(cardLegado)) &&
        /parado h\u00E1 23 dias \(limite: 15\)/.test(texto(cardLegado)),
      texto(cardLegado),
    );
    checar("os outros tres cards do historico seguem tracejados", l.capaDoc.querySelectorAll(".spro-c-card.pendente").length === 3);
    cl.destruir();
    const l2 = cenario({
      limite: 30,
      st: { configDataRecebimentoPro: JSON.stringify([{ id_procedimento: "148265", datahora: "01/10/2026 08:00" }]) },
    });
    const cl2 = (await montarCapa(l2.deps))!;
    const c2 = l2.capaDoc.querySelector('[data-id="naUnidade"]');
    checar(
      "data do legado abaixo do limite: card pronto sem alerta",
      !!c2 && !c2.classList.contains("alerta") && /desde 01\/10\/2026/.test(texto(c2)),
      texto(c2),
    );
    cl2.destruir();
  }

  secao("controle: copiar resumo, copiar valores, abrir o historico");
  {
    const c = cenario({ fatias: { dadosProcesso } });
    const capa = (await montarCapa(c.deps))!;
    const doc = c.capaDoc;
    (doc.querySelector('[data-acao="resumo"]') as HTMLButtonElement).click();
    await tique(10);
    const r = c.falsos.copias.at(-1) ?? "";
    checar(
      "copiar resumo: numero, tipo, interessados, unidade e documentos",
      /^Processo 99906\.713-630\.000032\/2025-82\nTipo: Compras: aquisicao\nInteressados: Maria Souza; Joao Lima\n/.test(r) &&
        /Unidade atual: TESTE/.test(r) &&
        /Documentos: 43 \(/.test(r),
      r,
    );
    checar("copiar resumo avisa", c.falsos.avisos.at(-1) === "Resumo copiado.");
    (doc.querySelector('[data-acao="historico"]') as HTMLButtonElement).click();
    checar("o link do historico abre o Gantt pelo quadro da arvore", c.falsos.pedidos.includes("gantt"));
    (doc.querySelector('[data-campo="tipo"] .spro-c-copiavel') as HTMLButtonElement).click();
    await tique(10);
    checar(
      "clicar num valor o copia (como o legado)",
      c.falsos.copias.at(-1) === "Compras: aquisicao" && c.falsos.avisos.at(-1) === "Copiado.",
    );
    (doc.querySelector('[data-campo="processo"] .spro-c-icone-botao') as HTMLButtonElement).click();
    await tique(10);
    checar(
      "copiar o link do processo: o link permanente",
      /acao=procedimento_trabalhar&id_procedimento=148265$/.test(c.falsos.copias.at(-1) ?? ""),
    );
    capa.destruir();
  }

  secao("controle: processo sigiloso");
  {
    const c = cenario({
      html: arvoreSintetica([{ id: "1", nome: "Doc", icone: "documento_interno" }], { sigiloso: true }),
      fatias: { dadosProcesso },
    });
    const capa = (await montarCapa(c.deps))!;
    const doc = c.capaDoc;
    checar("sigiloso: nao pede fatias ao quadro da arvore", !c.falsos.pedidos.includes("pedir"));
    checar(
      "sigiloso: so os cards da arvore",
      doc.querySelectorAll(".spro-c-card").length === 6 && doc.querySelectorAll(".spro-c-card.pendente").length === 0,
    );
    checar(
      "sigiloso: so processo, tipo e nivel",
      [...doc.querySelectorAll(".spro-c-campo")].map((e) => e.getAttribute("data-campo")).join() === "processo,tipo,nivel",
      [...doc.querySelectorAll(".spro-c-campo")].map((e) => e.getAttribute("data-campo")).join(),
    );
    checar(
      "sigiloso: nada do cache aparece (mesmo que exista)",
      !/Compra de canetas|Maria Souza/.test(texto(doc.querySelector(".spro-c-raiz"))),
    );
    checar("sigiloso: sem link do historico", !doc.querySelector('[data-acao="historico"]') && !!doc.querySelector('[data-acao="resumo"]'));
    checar("sigiloso: nivel 'Sigiloso'", texto(doc.querySelector('[data-campo="nivel"]')).includes("Sigiloso"));
    (doc.querySelector('[data-acao="resumo"]') as HTMLButtonElement).click();
    await tique(10);
    checar("sigiloso: copiar resumo copia so o numero", c.falsos.copias.at(-1) === "50300.000001/2026-01", c.falsos.copias);
    capa.destruir();
  }

  secao("controle: so desenha com o no do processo selecionado");
  {
    const c = cenario({ selecionado: false });
    checar("processoSelecionado: falso sem a classe, verdadeiro com ela", !processoSelecionado(c.falsos.arvoreDoc, "148265"));
    const sem = await montarCapa(c.deps);
    checar("sem selecao no prazo: nao desenha nada", sem === null && !c.capaDoc.getElementById("capaProcessoPro"));
    const d = cenario({ selecionado: false });
    const promessa = montarCapa({ ...d.deps, prazoMs: 2000 });
    await tique(60);
    d.falsos.arvoreDoc.getElementById("span148265")!.className = "infraArvoreNoSelecionado";
    const capa = await promessa;
    checar("selecionou o no depois: a capa aparece", !!capa && !!d.capaDoc.getElementById("capaProcessoPro"));
    capa?.destruir();
    const e = cenario();
    e.capaDoc.getElementById("divArvoreHtml")!.remove();
    checar("sem #divArvoreHtml (nao e a capa): nao faz nada", (await montarCapa(e.deps)) === null);
    const legado = cenario();
    const velha = legado.capaDoc.createElement("div");
    velha.id = "capaProcessoPro";
    legado.capaDoc.getElementById("divArvoreHtml")!.prepend(velha);
    const cl = (await montarCapa(legado.deps))!;
    checar(
      "a capa antiga do legado, se ja desenhou, e trocada (uma so)",
      legado.capaDoc.querySelectorAll("#capaProcessoPro").length === 1 &&
        legado.capaDoc.getElementById("capaProcessoPro")?.getAttribute("data-spro-capa") === "1",
    );
    cl.destruir();
  }

  secao("compatibilidade com o Agente de IA (agente-ia/src/ponte/capa.ts)");
  {
    const c = cenario({ fatias: { dadosProcesso } });
    const capa = (await montarCapa(c.deps))!;
    const doc = c.capaDoc;
    const sugestao = cartaoDaCapa({
      fluxo: "Fiscaliza\u00E7\u00E3o PAF",
      etapa: "Extrato de Publica\u00E7\u00E3o-DOU",
      etapaAnterior: "Delibera\u00E7\u00E3o PAS",
      anterior: { numero: "3020313", titulo: "Delibera\u00E7\u00E3o PAS 56", assinado: true },
      cumpridas: [{ etapa: "Auto de Infra\u00E7\u00E3o", numero: "2994836", titulo: "Auto de Infra\u00E7\u00E3o 12" }],
    });
    const acoes = { abrirAgente: () => {}, ignorar: () => {} };
    const desenhou = mostrarCartaoNaCapa(doc, sugestao, acoes);
    checar(
      "o Agente acha a nossa #capaProcessoPro e poe o cartao nela",
      desenhou === true && !!doc.querySelector("#capaProcessoPro > #spro-cartao-fluxo"),
    );
    checar(
      "o cartao entra como primeiro filho da raiz (acima da faixa de cards)",
      doc.getElementById("capaProcessoPro")?.firstElementChild?.id === "spro-cartao-fluxo",
    );
    c.falsos.fatias = {};
    c.falsos.coleta = { fase: "coletando", feito: 1, total: 2 };
    for (const cb of c.falsos.ouvintesColeta) cb();
    await tique(30);
    c.falsos.fatias = { dadosProcesso };
    c.mudarCache();
    await tique(30);
    checar("nossos redesenhos (coleta, cache) nao apagam o cartao do Agente", doc.querySelectorAll("#spro-cartao-fluxo").length === 1);
    mostrarCartaoNaCapa(doc, sugestao, acoes);
    mostrarCartaoNaCapa(doc, sugestao, acoes);
    checar("o Agente repinta a cada 2 s sem duplicar", doc.querySelectorAll("#spro-cartao-fluxo").length === 1);
    mostrarCartaoNaCapa(doc, null, acoes);
    checar(
      "e o remove quando a sugestao some, sem tocar na capa",
      doc.querySelectorAll("#spro-cartao-fluxo").length === 0 &&
        !!doc.querySelector(".spro-c-faixa") &&
        !!doc.querySelector(".spro-c-campos"),
    );
    capa.destruir();
  }

  secao("controle: o SEI reescreve o quadro depois de nos (medido no sigiloso) e a capa volta sem laco");
  {
    const vigia: { cb: ((m: Array<{ target: Node }>) => void) | null } = { cb: null };
    class FalsoObservador {
      constructor(cb: (m: Array<{ target: Node }>) => void) {
        vigia.cb = cb;
      }
      observe() {}
      disconnect() {}
    }
    const c = cenario({ fatias: { dadosProcesso } });
    const capa = (await montarCapa({ ...c.deps, Observador: FalsoObservador as unknown as typeof MutationObserver }))!;
    const doc = c.capaDoc;
    const alvo = doc.getElementById("divArvoreHtml")!;
    checar("a capa esta no lugar", doc.getElementById("capaProcessoPro")?.parentElement === alvo);
    // O SEI refaz o conteudo do quadro: a capa sai e o aviso volta, novo e visivel.
    const novoAviso = doc.createElement("div");
    novoAviso.id = "divArvoreInformacao";
    novoAviso.append("Processo aberto com os usuarios: usuario01 / PCSP-CG");
    alvo.replaceChildren(novoAviso);
    checar("o quadro foi reescrito: a capa saiu", !doc.getElementById("capaProcessoPro"));
    vigia.cb?.([{ target: alvo }]);
    checar(
      "o vigia a poe de volta no mesmo quadro (a mesma capa, com os dados)",
      doc.getElementById("capaProcessoPro")?.parentElement === alvo &&
        /Compra de canetas/.test(texto(doc.getElementById("capaProcessoPro"))),
    );
    checar(
      "o aviso novo do SEI e copiado para o lado e escondido",
      /usuario01/.test(texto(doc.querySelector(".spro-c-info"))) &&
        (novoAviso as HTMLElement).style.display === "none" &&
        !doc.querySelector(".spro-c-info [id]"),
    );
    const n = capa.desenhos();
    vigia.cb?.([{ target: alvo }]);
    vigia.cb?.([{ target: alvo }]);
    checar(
      "sem nova remocao o vigia nao faz nada (nenhum redesenho, uma raiz so)",
      capa.desenhos() === n && doc.querySelectorAll("#capaProcessoPro").length === 1,
    );
    vigia.cb?.([{ target: doc.querySelector(".spro-c-faixa") as Node }]);
    checar("mudancas por dentro da propria capa sao ignoradas", doc.querySelectorAll("#capaProcessoPro").length === 1);
    // O SEI troca o proprio #divArvoreHtml
    const outro = doc.createElement("div");
    outro.id = "divArvoreHtml";
    alvo.replaceWith(outro);
    vigia.cb?.([{ target: doc.body as Node }]);
    checar("se o proprio #divArvoreHtml e trocado, a capa vai para o novo", doc.getElementById("capaProcessoPro")?.parentElement === outro);
    capa.destruir();
  }

  secao("controle: destruir solta os ouvintes");
  {
    const c = cenario();
    const capa = (await montarCapa(c.deps))!;
    checar(
      "ouvintes registrados",
      c.falsos.ouvintesCache.length === 1 && c.falsos.ouvintesColeta.length === 1 && c.falsos.ouvintesArvore.length === 1,
    );
    capa.destruir();
    checar(
      "destruir remove todos",
      c.falsos.ouvintesCache.length === 0 && c.falsos.ouvintesColeta.length === 0 && c.falsos.ouvintesArvore.length === 0,
    );
    const n = capa.desenhos();
    c.falsos.fatias = { dadosProcesso };
    c.mudarCache();
    await tique(30);
    checar("depois de destruir nao redesenha", capa.desenhos() === n);
  }

  // ===== Lado da arvore da ponte =====
  secao("ponte do quadro da arvore: pedir fatias, calcular, cancelar");
  {
    const { doc, arv } = arvoreDe(htmlDaArvore("arvore_completa.html"));
    const area = areaMemoria();
    const loja = new LojaProcesso(area, ESCOPO, arv.idProcedimento, { esperar: async () => {} });
    const carregadas: string[] = [];
    let soltar: (() => void) | null = null;
    const andamentosFake = andamentos;
    const ctx = {
      sigiloso: false,
      loja,
      unidade: { id: "1", sigla: "TESTE" },
      agora: () => AGORA,
      recarregar: (n: string) => void carregadas.push(n),
      coletarHistorico: (o: { sinal?: AbortSignal; aoProgresso?: (f: number, t: number) => void }) =>
        new Promise((ok, no) => {
          o.aoProgresso?.(1, 2);
          soltar = () => ok({ andamentos: andamentosFake, total: andamentosFake.length, hash: "h", completo: true });
          o.sinal?.addEventListener("abort", () => no(Object.assign(new Error("cancelado"), { codigo: "CANCELADO" })));
        }),
    } as unknown as ContextoProcesso;
    const sair = ligarPonteDaCapa(doc, async () => ctx);
    const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
    const disparo = (n: string) => doc.dispatchEvent(new Ev(n));
    const attr = () => doc.documentElement.getAttribute(ATRIBUTO_COLETA);

    disparo(EVENTO_CAPA_PEDIR);
    await tique(10);
    checar("pedir: carrega dadosProcesso e marcador", carregadas.join() === "dadosProcesso,marcador", carregadas);
    loja.definir("dadosProcesso", { estado: "pronto", dado: dadosProcesso, em: 1 });
    carregadas.length = 0;
    disparo(EVENTO_CAPA_PEDIR);
    await tique(10);
    checar("pedir: nao recarrega a fatia que ja esta pronta", carregadas.join() === "marcador", carregadas);

    disparo(EVENTO_CAPA_CALCULAR);
    await tique(10);
    checar("calcular: o atributo mostra o progresso da coleta", attr() === "coletando:1/2", attr());
    disparo(EVENTO_CAPA_CALCULAR);
    checar("calcular de novo durante a coleta nao inicia outra", attr() === "coletando:1/2");
    (soltar as unknown as () => void)();
    await tique(30);
    checar(
      "coleta concluida: atributo 'pronto' e historico no cache",
      attr() === "pronto" && (await loja.lerHistorico())?.total === andamentos.length,
      attr(),
    );

    // Cancelar
    const hist2 = new LojaProcesso(areaMemoria(), ESCOPO, "outro", { esperar: async () => {} });
    const ctx2 = { ...ctx, loja: hist2 } as unknown as ContextoProcesso;
    const sair2 = ligarPonteDaCapa(doc, async () => ctx2);
    sair();
    doc.documentElement.removeAttribute(ATRIBUTO_COLETA);
    disparo(EVENTO_CAPA_CALCULAR);
    await tique(10);
    disparo(EVENTO_CAPA_CANCELAR);
    await tique(30);
    checar("cancelar: para a coleta e limpa o atributo (nada gravado)", attr() === null && (await hist2.lerHistorico()) === null, attr());

    // Erro
    const sair3 = ligarPonteDaCapa(
      doc,
      async () =>
        ({
          ...ctx2,
          coletarHistorico: () => Promise.reject(Object.assign(new Error("x"), { codigo: "SEI_REDE" })),
        }) as unknown as ContextoProcesso,
    );
    sair2();
    disparo(EVENTO_CAPA_CALCULAR);
    await tique(30);
    checar(
      "falha da coleta: 'erro:' com a mensagem para o usuario (nunca spinner)",
      /^erro:Sem conexão com o SEI\.$/.test(attr() ?? ""),
      attr(),
    );
    disparo(EVENTO_CAPA_CALCULAR);
    await tique(30);
    checar("depois do erro, calcular tenta de novo", /^erro:/.test(attr() ?? ""));
    sair3();

    // Sigiloso
    const sigCtx = { ...ctx, sigiloso: true } as unknown as ContextoProcesso;
    const sair4 = ligarPonteDaCapa(doc, async () => sigCtx);
    carregadas.length = 0;
    disparo(EVENTO_CAPA_PEDIR);
    await tique(10);
    checar("sigiloso: pedir nao carrega nada", carregadas.length === 0);
    doc.documentElement.removeAttribute(ATRIBUTO_COLETA);
    disparo(EVENTO_CAPA_CALCULAR);
    await tique(30);
    checar("sigiloso: calcular nao coleta (erro avisado)", /^erro:/.test(attr() ?? ""), attr());
    sair4();
    disparo(EVENTO_CAPA_PEDIR);
    await tique(10);
    checar("depois de soltar, o ouvinte nao responde", carregadas.length === 0);
  }
}
