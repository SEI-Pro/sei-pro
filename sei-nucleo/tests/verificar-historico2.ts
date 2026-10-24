/**
 * Leitor de andamentos (coleta com cache, sessao do SEI) e passagens por unidade.
 *
 * As fixtures `historico_completo_*` sao paginas reais do SEI SP de treinamento (4.1.5), com login, nomes e hashes
 * trocados: `p0`/`p1` sao as duas paginas do historico completo de um processo com 150 andamentos (remessa multipla,
 * reabertura, conclusao), `siglas` e um processo de 60 andamentos em que a mesma sigla aparece com dois nomes.
 */

import { coletarHistorico, coletarHistoricoDaArvore, acrescentarAoCache, andamentosDoLink, lerHistorico, type Andamento, type CacheHistorico } from "../src/dominio/historico";
import { definirArmazemPendenciaHistorico, type ArmazemPendencia } from "../src/dominio/historicoSessao";
import { calcularPassagens, dataISODe, isoDoRelogio, relogioDe, relogioDoISO, ROTULOS, type Passagem } from "../src/dominio/passagens";
import { lerArvore } from "../src/dominio/arvore";
import type { Sei } from "../src/sei";
import type { Http, Pagina } from "../src/sessao/http";
import { checar, fixture, lanca, paginaSintetica, secao } from "./util";

const BASE = new URL("https://treinamento.sei.sp.gov.br/sei/");
const LINK = "controlador.php?acao=procedimento_consultar_historico&acao_origem=arvore_visualizar&id_procedimento=190&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000001&infra_hash=0";

interface Sessao {
  tipo: string;
  pagina: string;
}

/** Um SEI que guarda na sessao o tipo e a pagina do ultimo POST, como o real. */
function seiFalso(paginas: Record<string, Pagina>, inicial: Sessao = { tipo: "R", pagina: "0" }, falhar?: (tipo: string, pagina: string) => boolean) {
  const estado: Sessao = { ...inicial };
  const reqs: string[] = [];
  const entregar = (): Pagina => {
    const p = paginas[`${estado.tipo}/${estado.pagina}`];
    if (!p) throw new Error(`pagina nao prevista no teste: ${estado.tipo}/${estado.pagina}`);
    return p;
  };
  const http: Http = {
    base: BASE,
    absoluta: (u) => new URL(u, BASE).href,
    async obter(_url, op) {
      reqs.push(`GET ${estado.tipo}/${estado.pagina}`);
      await Promise.resolve();
      if (op?.sinal?.aborted) throw new DOMException("cancelado", "AbortError");
      return entregar();
    },
    async enviar(_url, campos, op) {
      const c = new Map(campos);
      const tipo = c.get("hdnTipoHistorico") ?? "?";
      const pagina = c.get("hdnInfraPaginaAtual") ?? "?";
      reqs.push(`POST ${tipo}/${pagina}`);
      await Promise.resolve();
      if (op?.sinal?.aborted) throw new DOMException("cancelado", "AbortError");
      if (falhar?.(tipo, pagina)) throw new Error("falha de rede simulada");
      estado.tipo = tipo;
      estado.pagina = pagina;
      return entregar();
    },
    async baixar() {
      throw new Error("baixar nao esperado");
    },
  };
  return { sei: { http } as unknown as Sei, estado, reqs };
}

const R0 = fixture("sei41/historico.html");
const P0 = fixture("sei41/historico_completo_p0.html");
const P1 = fixture("sei41/historico_completo_p1.html");
const PAGINAS = { "R/0": R0, "P/0": P0, "P/1": P1 };

/** Pagina do historico montada: `linhas` andamentos de `total`, a partir de `de`, com ou sem select de paginas. */
function paginaHistorico(tipo: string, indice: number, total: number, porPagina: number, hash = "h".repeat(32), comSelect = false): Pagina {
  const de = indice * porPagina;
  const ate = Math.min(total, de + porPagina);
  const paginas = Math.ceil(total / porPagina);
  let linhas = "";
  for (let i = de; i < ate; i += 1) {
    const dia = String(1 + (i % 28)).padStart(2, "0");
    linhas += `<tr class="andamentoConcluido"><td>${dia}/03/2024 10:${String(i % 60).padStart(2, "0")}</td><td><a title="Unidade ${i}">U${i}</a></td><td><a title="Fulano">fulano</a></td><td>Atualiza\u00E7\u00E3o ${i}</td></tr>`;
  }
  const caption = total > porPagina ? `Lista de Andamentos (${total} registros - ${de + 1} a ${ate}):` : `Lista de Andamentos (${total} registros):`;
  const proxima = indice < paginas - 1 ? '<a id="lnkInfraProximaPaginaSuperior" href="#">+</a>' : "";
  const select = comSelect && paginas > 2 ? `<select id="selInfraPaginacaoSuperior">${Array.from({ length: paginas }, (_, k) => `<option value="${k}"${k === indice ? " selected" : ""}>${k + 1}</option>`).join("")}</select>` : "";
  return paginaSintetica(
    `<form id="frmProcedimentoHistorico" method="post" action="controlador.php?acao=procedimento_consultar_historico&infra_hash=0"><div class="infraAreaPaginacao">${select}${proxima}</div><table id="tblHistorico"><caption>${caption}</caption><tr><th>Data</th><th>Unidade</th><th>Usuario</th><th>Descri\u00E7\u00E3o</th></tr>${linhas}</table><input type="hidden" id="hdnInfraPaginaAtual" name="hdnInfraPaginaAtual" value="${indice}"/><input type="hidden" id="hdnInfraHashCriterios" name="hdnInfraHashCriterios" value="${hash}"/><input type="hidden" id="hdnTipoHistorico" name="hdnTipoHistorico" value="${tipo}"/></form>`,
    `https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_consultar_historico&infra_hash=0`,
  );
}

function armazemFalso(inicial?: string): ArmazemPendencia & { valor: string | null } {
  const a = {
    valor: inicial ?? (null as string | null),
    getItem: () => a.valor,
    setItem: (_c: string, v: string) => {
      a.valor = v;
    },
    removeItem: () => {
      a.valor = null;
    },
  };
  return a;
}

const and = (data: string, unidade: string, usuario: string, descricao: string, extra: Partial<Andamento> = {}): Andamento => ({
  data,
  dataISO: dataISODe(data),
  unidade,
  usuario,
  descricao,
  ...extra,
});

const iso = (d: Date | null) => (d ? isoDoRelogio(d).slice(0, 16) : "curso");
const resumo = (p: Passagem) => `${p.unidade} ${iso(p.recebido)} > ${iso(p.remetido)} ${p.fim ?? "-"}${p.destinos.length ? ` [${p.destinos.join(",")}]` : ""}${p.pendenteRecebimento ? " pendente" : ""}`;
const AGORA = new Date(2026, 9, 24, 12, 0);

const todosDaTela = () => [...lerHistorico(P0), ...lerHistorico(P1)];

export async function verificarHistorico2(): Promise<void> {
  // --- leitura -------------------------------------------------------------------------------------------------
  secao("Andamento: data ISO, documento e unidade citada (paginas reais)");
  const p0 = lerHistorico(P0);
  const p1 = lerHistorico(P1);
  checar("pagina 0 traz 100 e a 1 traz 50", p0.length === 100 && p1.length === 50, [p0.length, p1.length]);
  checar("dataISO sem fuso", p0[0].dataISO === "2023-06-17T11:42:00" && p0[0].data === "17/06/2023 11:42", p0[0]);
  checar("usuarioNome do title", p0[0].usuarioNome === "Usu\u00E1rio 01", p0[0].usuarioNome);
  const comDoc = [...p0, ...p1].find((a) => a.nrSei && a.idDocumento);
  checar("nrSei e idDocumento do ancoraHistoricoProcesso", /^\d+$/.test(comDoc?.nrSei ?? "") && /^\d+$/.test(comDoc?.idDocumento ?? ""), comDoc);
  const excluido = [...p0, ...p1].find((a) => a.nrSei && !a.idDocumento);
  checar("documento excluido: nrSei sem idDocumento", Boolean(excluido), excluido);
  const remetido = p0.find((a) => a.descricao.startsWith("Processo remetido pela unidade"));
  checar("remetido: unidade citada com sigla e nome", Boolean(remetido?.unidadeCitada) && Boolean(remetido?.unidadeCitadaNome), remetido);
  checar("recebido nao tem unidade citada", p0.filter((a) => a.descricao === "Processo recebido na unidade").every((a) => !a.unidadeCitada));
  const anexado = lerHistorico(fixture("sei41/historico.html")).find((a) => a.descricao.includes("anexado"));
  checar("processo anexado: link de processo nao vira nrSei", anexado !== undefined && anexado.nrSei === undefined, anexado);
  checar("andamentoAberto vira aberto: so as unidades amarelas da tela", [...new Set(todosDaTela().filter((a) => a.aberto).map((a) => a.unidade))].sort().join() === "CC-CJ-NAA,CC-CPE-NE,TESTE,TESTE_1_1", todosDaTela().filter((a) => a.aberto).map((a) => a.unidade));
  checar("data fora do formato: dataISO ausente", dataISODe("ontem") === "" && dataISODe("05/01/2024 9:07") === "2024-01-05T09:07:00");

  // --- coleta ----------------------------------------------------------------------------------------------------
  secao("coletarHistorico: percorre, informa progresso e devolve a sessao ao estado de antes");
  {
    const { sei, estado, reqs } = seiFalso(PAGINAS);
    const progresso: string[] = [];
    const r = await coletarHistorico(sei, LINK, { aoProgresso: (f, t) => progresso.push(`${f}/${t}`) });
    checar("150 andamentos, total 150, completo", r.andamentos.length === 150 && r.total === 150 && r.completo, [r.andamentos.length, r.total, r.completo]);
    checar("hash dos criterios do completo", r.hash === "c3dd9311320bed76a74c0b9bb13095dc", r.hash);
    checar("progresso 1/2 e 2/2", progresso.join(" ") === "1/2 2/2", progresso);
    checar("pedidos: GET sem exclusao, GET dentro dela, P0, P1 e o POST que restaura", reqs.join(" | ") === "GET R/0 | GET R/0 | POST P/0 | POST P/1 | POST R/0", reqs);
    checar("sessao do SEI de volta em R/0", estado.tipo === "R" && estado.pagina === "0", estado);
    checar("ordem do SEI (mais recente primeiro)", r.andamentos[0].dataISO === "2023-06-17T11:42:00" && r.andamentos[149].dataISO !== undefined);
  }
  {
    const { sei, estado, reqs } = seiFalso(PAGINAS, { tipo: "P", pagina: "0" });
    await coletarHistorico(sei, LINK);
    checar("sessao ja em P/0: nao repete o P0; restaura P/0 depois do P1", reqs.join(" | ") === "GET P/0 | GET P/0 | POST P/1 | POST P/0" && estado.tipo === "P" && estado.pagina === "0", reqs);
  }
  {
    const { sei, estado, reqs } = seiFalso(PAGINAS, { tipo: "P", pagina: "1" });
    await coletarHistorico(sei, LINK);
    checar("sessao em P/1 (o usuario estava na ultima pagina): volta para P/1", estado.tipo === "P" && estado.pagina === "1" && reqs[reqs.length - 1] === "POST P/1", reqs);
  }

  secao("coletarHistorico: cache incremental");
  const completo = await coletarHistorico(seiFalso(PAGINAS).sei, LINK);
  const cache: CacheHistorico = { hash: completo.hash, total: completo.total, andamentos: completo.andamentos };
  {
    const { sei, reqs } = seiFalso(PAGINAS);
    const r = await coletarHistorico(sei, LINK, { cache });
    checar("cache igual: so a 1a pagina, mesmo resultado", r.aproveitouCache && JSON.stringify(r.andamentos) === JSON.stringify(completo.andamentos) && reqs.join("|") === "GET R/0|GET R/0|POST P/0|POST R/0", reqs);
  }
  {
    const { sei, reqs } = seiFalso(PAGINAS);
    const velho: CacheHistorico = { hash: completo.hash, total: completo.total - 3, andamentos: completo.andamentos.slice(3) };
    const r = await coletarHistorico(sei, LINK, { cache: velho });
    checar("historico cresceu 3: junta os 3 novos ao cache", r.aproveitouCache && r.andamentos.length === 150 && JSON.stringify(r.andamentos) === JSON.stringify(completo.andamentos), [r.aproveitouCache, r.andamentos.length]);
    checar("... sem buscar a 2a pagina", !reqs.includes("POST P/1"), reqs);
  }
  {
    const { sei } = seiFalso(PAGINAS);
    const outroHash = await coletarHistorico(sei, LINK, { cache: { ...cache, hash: "0".repeat(32) } });
    checar("hash diferente: coleta tudo", !outroHash.aproveitouCache && outroHash.andamentos.length === 150);
    const adulterado: CacheHistorico = { ...cache, andamentos: cache.andamentos.map((a, i) => (i === 4 ? { ...a, descricao: `${a.descricao} x` } : a)) };
    const r2 = await coletarHistorico(seiFalso(PAGINAS).sei, LINK, { cache: adulterado });
    checar("um dos 10 mais recentes mudou: coleta tudo", !r2.aproveitouCache && r2.andamentos.length === 150);
    const curto: CacheHistorico = { ...cache, total: 149 };
    const r3 = await coletarHistorico(seiFalso(PAGINAS).sei, LINK, { cache: curto });
    checar("total gravado diferente do que o cache tem: nao serve", !r3.aproveitouCache);
    const maior: CacheHistorico = { ...cache, total: 151, andamentos: [...cache.andamentos, cache.andamentos[0]] };
    const r4 = await coletarHistorico(seiFalso(PAGINAS).sei, LINK, { cache: maior });
    checar("historico encolheu (cache maior que o atual): nao serve", !r4.aproveitouCache && r4.andamentos.length === 150);
  }
  checar("acrescentarAoCache sem cache: null", acrescentarAoCache(null, "h", 3, p0) === null);

  secao("coletarHistorico: uma coleta por vez por processo");
  {
    const { sei, reqs } = seiFalso(PAGINAS);
    const tardio: string[] = [];
    const a = coletarHistorico(sei, LINK);
    await Promise.resolve();
    const b = coletarHistorico(sei, LINK, { aoProgresso: (f, t) => tardio.push(`${f}/${t}`) });
    const [ra, rb] = await Promise.all([a, b]);
    checar("dois chamadores, uma coleta (mesmo resultado)", ra === rb && reqs.filter((r) => r.startsWith("POST P")).length === 2, reqs);
    checar("quem chega durante a coleta tambem recebe o progresso", tardio.includes("2/2"), tardio);
    const depois = await coletarHistorico(sei, LINK);
    checar("terminada a coleta, a proxima comeca outra", depois !== ra);
  }
  {
    const { sei, estado } = seiFalso(PAGINAS);
    const ac = new AbortController();
    const cancelada = coletarHistorico(sei, LINK, { sinal: ac.signal });
    const outra = coletarHistorico(sei, LINK);
    ac.abort();
    const e = await lanca(() => cancelada);
    const r = await outra;
    checar("um chamador cancela e sai na hora (CANCELADO)", e?.codigo === "CANCELADO", e);
    checar("o outro ainda quer: a coleta segue e termina", r.andamentos.length === 150 && estado.tipo === "R");
  }

  secao("coletarHistorico: cancelamento, falha e resposta errada devolvem a sessao");
  {
    const { sei, estado, reqs } = seiFalso(PAGINAS);
    const ac = new AbortController();
    const e = await lanca(() => coletarHistorico(sei, LINK, { sinal: ac.signal, aoProgresso: (f) => f >= 1 && ac.abort() }));
    checar("cancelar no meio: CANCELADO", e?.codigo === "CANCELADO", e);
    checar("... e a sessao volta a R/0 (o restauro nao e cancelado)", estado.tipo === "R" && estado.pagina === "0" && reqs[reqs.length - 1] === "POST R/0", [estado, reqs]);
    const ja = new AbortController();
    ja.abort();
    const { sei: sei2, reqs: reqs2 } = seiFalso(PAGINAS);
    const e2 = await lanca(() => coletarHistorico(sei2, LINK, { sinal: ja.signal }));
    checar("sinal ja cancelado: nenhum pedido", e2?.codigo === "CANCELADO" && reqs2.length === 0, reqs2);
  }
  {
    const { sei, estado } = seiFalso(PAGINAS, { tipo: "R", pagina: "0" }, (t, p) => t === "P" && p === "1");
    const e = await lanca(() => coletarHistorico(sei, LINK));
    checar("falha de rede na 2a pagina: SEI_REDE", e?.codigo === "SEI_REDE", e);
    checar("... e a sessao volta a R/0", estado.tipo === "R" && estado.pagina === "0", estado);
  }
  {
    const { sei, reqs } = seiFalso({ "R/0": paginaSintetica("<p>Sua sessao expirou</p>") });
    const e = await lanca(() => coletarHistorico(sei, LINK));
    checar("resposta que nao e o historico: erro tipado, sem POST", e?.codigo === "SEI_VERSAO_NAO_SUPORTADA" && reqs.every((r) => r.startsWith("GET")), [e?.codigo, reqs]);
  }
  {
    const arv = lerArvore(fixture("sei41/arvore.html"));
    const e = await lanca(() => coletarHistoricoDaArvore(seiFalso(PAGINAS).sei, { ...arv, nivel: "sigiloso" }));
    checar("processo sigiloso: SEI_SIGILOSO, sem coletar", e?.codigo === "SEI_SIGILOSO", e?.codigo);
  }

  secao("coletarHistorico: pendencia de restauro (coleta anterior que morreu no meio)");
  {
    const armazem = armazemFalso();
    definirArmazemPendenciaHistorico(armazem);
    const { sei, estado } = seiFalso(PAGINAS);
    await coletarHistorico(sei, LINK);
    checar("coleta normal nao deixa pendencia", armazem.valor === null, armazem.valor);

    // A aba morreu depois de gravar a pendencia e antes de restaurar: a sessao ficou em P/1.
    armazem.valor = JSON.stringify({ host: BASE.host, tipo: "R", pagina: "0", em: Date.now() });
    estado.tipo = "P";
    estado.pagina = "1";
    await coletarHistorico(sei, LINK);
    checar("restaura o estado da pendencia antes de ler o 'original'", estado.tipo === "R" && estado.pagina === "0" && armazem.valor === null, [estado, armazem.valor]);

    armazem.valor = JSON.stringify({ host: BASE.host, tipo: "R", pagina: "0", em: Date.now() - 3_600_000 });
    estado.tipo = "P";
    estado.pagina = "1";
    await coletarHistorico(sei, LINK);
    checar("pendencia velha (1 h) e ignorada: o usuario pode ter escolhido outro estado", estado.tipo === "P" && estado.pagina === "1", estado);

    armazem.valor = JSON.stringify({ host: "outro.sei.gov.br", tipo: "T", pagina: "0", em: Date.now() });
    const { sei: sei3, reqs: reqs3 } = seiFalso(PAGINAS);
    await coletarHistorico(sei3, LINK);
    checar("pendencia de outro SEI e ignorada (nenhum POST a mais)", reqs3.join(" | ") === "GET R/0 | GET R/0 | POST P/0 | POST P/1 | POST R/0", reqs3);
    definirArmazemPendenciaHistorico(undefined);
  }

  secao("coletarHistorico: paginas sem select (so link de proxima) e com select");
  {
    const montar = (total: number, porPagina: number, select: boolean) => {
      const paginas: Record<string, Pagina> = { "R/0": R0 };
      for (let i = 0; i * porPagina < total; i += 1) paginas[`P/${i}`] = paginaHistorico("P", i, total, porPagina, "a".repeat(32), select);
      return paginas;
    };
    const dois = await coletarHistorico(seiFalso(montar(150, 100, false)).sei, LINK);
    checar("2 paginas, so link de proxima (sem select)", dois.andamentos.length === 150 && dois.completo, dois.andamentos.length);
    const prog: string[] = [];
    const tres = await coletarHistorico(seiFalso(montar(250, 100, true)).sei, LINK, { aoProgresso: (f, t) => prog.push(`${f}/${t}`) });
    checar("3 paginas com select: 250 e progresso 1/3 2/3 3/3", tres.andamentos.length === 250 && prog.join(" ") === "1/3 2/3 3/3", [tres.andamentos.length, prog]);
    const limitado = await coletarHistorico(seiFalso(montar(250, 100, true)).sei, LINK, { limite: 150 });
    checar("limite: para ao chegar e diz que nao e completo", limitado.andamentos.length === 200 && !limitado.completo && limitado.total === 250, [limitado.andamentos.length, limitado.completo]);
    const unica = await coletarHistorico(seiFalso(montar(30, 100, false)).sei, LINK);
    checar("pagina unica: 30 andamentos, sem proxima", unica.andamentos.length === 30 && unica.completo);
    const vazio = await coletarHistorico(seiFalso({ "R/0": R0, "P/0": paginaHistorico("P", 0, 0, 100) }).sei, LINK);
    checar("historico vazio: 0 andamentos, completo", vazio.andamentos.length === 0 && vazio.completo, vazio);
  }

  secao("andamentosDoLink: compativel com o que ja existia");
  {
    const { sei, reqs, estado } = seiFalso(PAGINAS);
    const r = await andamentosDoLink(sei, LINK, { tipo: "resumido", limite: 500 });
    checar("resumido com a sessao em R/0: um GET, nenhum POST", reqs.join("|") === "GET R/0" && r.andamentos.length === lerHistorico(R0).length && estado.tipo === "R", reqs);
  }
  {
    const { sei, estado, reqs } = seiFalso(PAGINAS);
    const r = await andamentosDoLink(sei, LINK, { tipo: "completo", limite: 120 });
    checar("completo com limite: devolve ate o limite", r.andamentos.length === 120 && r.total === 150, [r.andamentos.length, r.total]);
    checar("... e agora tambem devolve a sessao (antes deixava em P)", estado.tipo === "R" && estado.pagina === "0" && reqs[reqs.length - 1] === "POST R/0", [estado, reqs]);
  }
  {
    const { sei, estado } = seiFalso(PAGINAS, { tipo: "P", pagina: "1" });
    const r = await andamentosDoLink(sei, LINK, { tipo: "resumido" });
    checar("resumido com a sessao em P/1: pede R/0 e devolve P/1", r.andamentos.length === lerHistorico(R0).length && estado.tipo === "P" && estado.pagina === "1", estado);
  }

  // --- passagens ------------------------------------------------------------------------------------------------
  secao("calcularPassagens: processo real (150 andamentos, remessa multipla, reabertura, conclusao)");
  const todos = [...p0, ...p1];
  const ps = calcularPassagens(todos, AGORA);
  const esperado = [
    "TESTE 2023-04-17T14:54 > 2023-04-17T14:55 remessa [SSP-CG]",
    "SSP-CG 2023-04-17T15:49 > 2023-04-18T12:04 remessa [DETRAN-PRE]",
    "SSP-CG 2023-04-20T11:11 > 2023-04-20T11:34 remessa [DETRAN-PRE,TESTE]",
    "SSP-CG 2023-04-25T11:21 > 2023-04-25T12:13 conclusao",
    "DETRAN-PRE 2023-04-27T10:45 > 2023-05-04T15:39 remessa [TESTE,DETRAN-VICEPRE,TESTE_1_1]",
    "SFP-CG 2023-05-04T16:16 > 2023-05-04T16:18 remessa [CC-CPE-NE]",
    "CC-CPE-NE 2023-05-04T16:18 > curso - pendente",
    "FDE-CG 2023-05-04T16:34 > 2023-05-11T09:46 remessa [CC-CJ-NAA,SEDUC-CG]",
    "SDUH-CG 2023-05-04T16:35 > 2023-06-05T16:24 remessa [FDE-CG]",
    "SCEC-CG 2023-05-04T16:43 > 2023-05-08T07:44 conclusao",
    "DETRAN-VICEPRE 2023-05-04T16:46 > 2023-05-04T16:46 remessa [DETRAN-PRE]",
    "TESTE 2023-05-04T16:56 > curso -",
    "SEDUC-CG 2023-05-04T17:38 > 2023-05-05T14:40 conclusao",
    "TESTE_1_1 2023-05-04T18:12 > curso -",
    "SSP-CG 2023-05-04T18:38 > 2023-05-04T18:38 conclusao",
    "SSP-CG 2023-05-04T20:53 > 2023-05-05T18:00 conclusao",
    "DETRAN-PRE 2023-05-05T09:33 > 2023-05-05T10:49 conclusao",
    "CC-CJ-NAA 2023-05-11T09:46 > curso - pendente",
    "SEDUC-CG 2023-05-11T09:47 > 2023-06-17T11:42 conclusao",
    "FDE-CG 2023-06-08T23:17 > 2023-06-11T19:41 conclusao",
  ];
  checar("20 passagens, na ordem de entrada", ps.length === esperado.length, ps.map(resumo));
  esperado.forEach((e, i) => checar(`passagem ${i + 1}: ${e}`, ps[i] !== undefined && resumo(ps[i]) === e, ps[i] ? resumo(ps[i]) : "ausente"));
  checar("SEDUC-CG e FDE-CG tem o mesmo nome (Chefia de Gabinete) e passagens separadas", ps.filter((p) => p.unidade === "FDE-CG").length === 2 && ps.filter((p) => p.unidade === "SEDUC-CG").length === 2);
  checar("raia = sigla (a mesma sigla com 2 nomes em tempos diferentes continua uma raia)", new Set(ps.filter((p) => p.unidade === "SSP-CG").map((p) => p.chave)).size === 1, ps.filter((p) => p.unidade === "SSP-CG").map((p) => p.chave));
  checar("em curso: 2 abertas (TESTE e TESTE_1_1) + 2 pendentes de recebimento", ps.filter((p) => p.emCurso).length === 4 && ps.filter((p) => p.pendenteRecebimento).length === 2);
  checar(
    "o que esta em curso e o que o SEI marca como aberto (linhas amarelas): mesmas unidades",
    JSON.stringify([...new Set(ps.filter((p) => p.emCurso).map((p) => p.unidade))].sort()) === JSON.stringify([...new Set(todos.filter((a) => a.aberto).map((a) => a.unidade))].sort()),
    [ps.filter((p) => p.emCurso).map((p) => p.unidade), todos.filter((a) => a.aberto).map((a) => a.unidade)],
  );
  checar("duracao da passagem em curso vai ate agora (relogio, sem fuso)", ps[11].duracaoMs === Date.UTC(2026, 9, 24, 12, 0) - Date.UTC(2023, 4, 4, 16, 56), ps[11].duracaoMs);
  checar("quem recebeu e quem enviou", ps[1].usuarioRecebeu === "usuario08" && ps[1].usuarioEnviou === "ocre" && ps[1].origem === "TESTE" && ps[1].chegouEm !== undefined && iso(ps[1].chegouEm ?? null) === "2023-04-17T14:55", [ps[1].usuarioRecebeu, ps[1].usuarioEnviou, ps[1].origem]);
  checar("nome do usuario junto do login", ps[1].usuarioRecebeuNome === "Usu\u00E1rio 08", ps[1].usuarioRecebeuNome);
  checar("remessa multipla: destinos na ordem do envio, sem as linhas de outro envio", ps[4].destinos.length === 3 && !ps[4].destinos.includes("FDE-CG"), ps[4].destinos);
  const docsTotal = ps.reduce((n, p) => n + p.documentos.length, 0);
  const geradosNoHistorico = todos.filter((a) => a.descricao.startsWith(ROTULOS.documentoGerado)).length;
  const assinTotal = ps.reduce((n, p) => n + p.assinaturas.length, 0);
  const assinNoHistorico = todos.filter((a) => a.descricao.startsWith(ROTULOS.documentoAssinado)).length;
  checar("todo 'Gerado documento' cai numa passagem", docsTotal === geradosNoHistorico && geradosNoHistorico > 10, [docsTotal, geradosNoHistorico]);
  checar(
    "'Assinado Documento' cai numa passagem, salvo o de unidade que nunca teve o processo (FDE-NP e FAPESP-Unidade01 assinaram de fora)",
    assinTotal === assinNoHistorico - 2 && assinNoHistorico > 10,
    [assinTotal, assinNoHistorico],
  );
  const doc = ps.flatMap((p) => p.documentos).find((d) => d.idDocumento);
  checar("documento da passagem: nrSei, idDocumento e titulo sem o rotulo", Boolean(doc?.nrSei) && Boolean(doc?.idDocumento) && /^\d+/.test(doc?.titulo ?? ""), doc);
  const trocadas = calcularPassagens([...p1, ...p0], AGORA).map(resumo);
  checar("paginas em outra ordem: mesmo resultado (datas diferentes valem pela data; so o mesmo minuto vale pela posicao)", JSON.stringify(trocadas) === JSON.stringify(esperado), trocadas);

  secao("calcularPassagens: unidade que remeteu mantendo o processo aberto (o SEI marca a linha como aberta)");
  {
    const h = [
      and("11/03/2024 09:00", "BBB", "u", ROTULOS.recebido, { aberto: true }),
      and("10/03/2024 12:00", "BBB", "u", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 09:00", "AAA", "u", "Processo p\u00FAblico gerado", { aberto: true }),
    ];
    const r = calcularPassagens(h, AGORA);
    const a = r.find((p) => p.unidade === "AAA");
    checar("AAA segue em curso: remetido nulo, mantidoAberto, com a data e o destino da remessa", a?.emCurso === true && a.remetido === null && a.fim === null && a.mantidoAberto === true && iso(a.enviouEm ?? null) === "2024-03-10T12:00" && a.destinos.join() === "BBB", a);
    checar("sem a marca do SEI, a mesma remessa fecha a passagem", calcularPassagens(h.map((x) => ({ ...x, aberto: undefined })), AGORA)[0].fim === "remessa");
  }

  secao("calcularPassagens: a mesma sigla com dois nomes (processo real)");
  {
    const siglas = lerHistorico(fixture("sei41/historico_completo_siglas.html"));
    const nomes = new Set(siglas.filter((a) => a.unidade === "CGE-CG").map((a) => a.unidadeNome));
    const passagens = calcularPassagens(siglas, AGORA);
    checar("a fixture tem CGE-CG com mais de um nome", nomes.size > 1, [...nomes]);
    const cge = passagens.filter((p) => p.unidade === "CGE-CG");
    checar("passagens de CGE-CG fecham mesmo com o nome diferente na remessa", cge.length > 0 && cge.every((p) => p.remetido !== null || p.emCurso), cge.map(resumo));
    checar("raia unica por sigla quando as passagens nao se sobrepoem", new Set(cge.map((p) => p.chave)).size === 1);
  }

  secao("calcularPassagens: casos montados");
  checar("historico vazio: nenhuma passagem", calcularPassagens([], AGORA).length === 0);
  checar("andamentos sem data reconhecida: ignorados", calcularPassagens([and("?", "A", "u", ROTULOS.recebido, { dataISO: "" })], AGORA).length === 0);
  {
    const ps1 = calcularPassagens([and("10/03/2024 09:00", "ABC", "joana", "Processo p\u00FAblico gerado")], AGORA);
    checar("so gerado: uma passagem em curso, aberta pela geracao", ps1.length === 1 && ps1[0].emCurso && ps1[0].inicio === "gerado" && ps1[0].usuarioRecebeu === "joana", ps1);
    const restrito = calcularPassagens([and("10/03/2024 09:00", "ABC", "joana", "Processo restrito gerado, Informa\u00E7\u00E3o Pessoal (Art. 31 da Lei 12.527/2011)")], AGORA);
    checar("restrito gerado (com a hipotese no texto) tambem abre", restrito.length === 1 && restrito[0].inicio === "gerado");
  }
  {
    const h = [
      and("20/03/2024 16:00", "AAA", "ana", ROTULOS.conclusao),
      and("20/03/2024 15:00", "AAA", "ana", ROTULOS.reabertura),
      and("12/03/2024 11:00", "AAA", "ana", ROTULOS.conclusao),
      and("10/03/2024 09:30", "AAA", "ana", ROTULOS.recebido),
      and("10/03/2024 09:29", "AAA", "bia", `${ROTULOS.remetidoPrefixo} BBB`, { unidadeCitada: "BBB" }),
      and("10/03/2024 09:00", "BBB", "bia", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    checar("reabertura abre uma nova passagem na mesma unidade", r.map(resumo).join(" ; ") === "BBB 2024-03-10T09:00 > 2024-03-10T09:29 remessa [AAA] ; AAA 2024-03-10T09:30 > 2024-03-12T11:00 conclusao ; AAA 2024-03-20T15:00 > 2024-03-20T16:00 conclusao", r.map(resumo));
    checar("a reabertura guarda quem reabriu", r[2].inicio === "reabertura" && r[2].usuarioRecebeu === "ana");
    checar("conclusao guarda quem concluiu", r[1].fim === "conclusao" && r[1].usuarioEnviou === "ana" && r[1].destinos.length === 0);
  }
  {
    const h = [
      and("10/03/2024 10:01", "CCC", "bia", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 09:59", "DDD", "bia", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 09:59", "BBB", "bia", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 09:00", "AAA", "ana", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    checar("remessa para varias unidades (cruzando o minuto): AAA fecha na 1a linha e junta os 3 destinos", r[0].unidade === "AAA" && iso(r[0].remetido) === "2024-03-10T09:59" && [...r[0].destinos].sort().join(",") === "BBB,CCC,DDD", r[0].destinos);
    checar("cada destino vira passagem pendente (ainda nao recebeu)", r.slice(1).every((p) => p.pendenteRecebimento && p.emCurso && p.origem === "AAA") && r.length === 4, r.map(resumo));
    const longe = calcularPassagens([and("10/03/2024 12:00", "EEE", "bia", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }), ...h], AGORA);
    checar("linha que cita AAA horas depois nao entra nos destinos da 1a remessa", longe[0].destinos.length === 3 && !longe[0].destinos.includes("EEE"), longe[0].destinos);
  }
  {
    const h = [
      and("12/03/2024 08:00", "GAB", "u", ROTULOS.conclusao, { unidadeNome: "Gabinete B" }),
      and("11/03/2024 15:00", "FIM", "u", `${ROTULOS.remetidoPrefixo} GAB`, { unidadeCitada: "GAB", unidadeCitadaNome: "Gabinete A" }),
      and("10/03/2024 11:00", "GAB", "u", ROTULOS.recebido, { unidadeNome: "Gabinete B" }),
      and("10/03/2024 10:00", "GAB", "u", ROTULOS.recebido, { unidadeNome: "Gabinete A" }),
      and("10/03/2024 09:00", "ORI", "u", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    const a = r.find((p) => p.unidadeNome === "Gabinete A");
    const b = r.find((p) => p.unidadeNome === "Gabinete B");
    checar("duas unidades de mesma sigla abertas juntas: a remessa fecha a do nome citado", a?.fim === "remessa" && iso(a.remetido) === "2024-03-11T15:00", a && resumo(a));
    checar("... e a conclusao e da outra (o nome da linha desempata)", b?.fim === "conclusao" && iso(b.remetido) === "2024-03-12T08:00", b && resumo(b));
    checar("raias separadas por nome so quando se sobrepoem", a?.chave === "gab|gabinete a" && b?.chave === "gab|gabinete b", [a?.chave, b?.chave]);
  }
  {
    const h = [
      and("11/03/2024 15:00", "FIM", "u", `${ROTULOS.remetidoPrefixo} UNI`, { unidadeCitada: "UNI", unidadeCitadaNome: "Nome Novo" }),
      and("10/03/2024 11:00", "UNI", "u", ROTULOS.recebido, { unidadeNome: "Nome Velho" }),
    ];
    const r = calcularPassagens(h, AGORA);
    const uni = r.find((p) => p.unidade === "UNI");
    checar("unidade que mudou de nome no meio: a remessa fecha a passagem dela", uni?.fim === "remessa", uni && resumo(uni));
  }
  {
    // Mesmo minuto: o SEI grava o "recebido" da unidade DEPOIS (id maior) da remessa que ela mesma faz (medido: DETRAN-VICEPRE).
    // A lista vem do mais recente ao mais antigo, entao o "recebido" aparece ANTES da remessa na lista.
    const h = [
      and("10/03/2024 10:00", "BBB", "u", ROTULOS.recebido),
      and("10/03/2024 10:00", "AAA", "u", `${ROTULOS.remetidoPrefixo} BBB`, { unidadeCitada: "BBB" }),
      and("10/03/2024 09:00", "BBB", "u", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 08:00", "AAA", "u", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    const bbb = r.find((p) => p.unidade === "BBB");
    checar("recebido e remessa de volta no mesmo minuto: a passagem abre e fecha (0 min)", bbb?.fim === "remessa" && iso(bbb.recebido) === "2024-03-10T10:00" && iso(bbb.remetido) === "2024-03-10T10:00", bbb && resumo(bbb));
    checar("... e a unidade que recebe de volta fica com chegada (nao vira pendente falsa)", r.filter((p) => p.pendenteRecebimento).map((p) => p.unidade).join() === "AAA", r.map(resumo));
    // Remessa e recebimento no mesmo minuto: a chegada precisa estar registrada antes do recebido.
    const mesmo = calcularPassagens(
      [and("10/03/2024 10:00", "BBB", "u", ROTULOS.recebido), and("10/03/2024 10:00", "BBB", "u", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }), and("10/03/2024 09:00", "AAA", "u", "Processo p\u00FAblico gerado")],
      AGORA,
    );
    checar("remessa e recebido no mesmo minuto: sem passagem pendente de sobra", mesmo.length === 2 && mesmo.every((p) => !p.pendenteRecebimento) && mesmo[1].origem === "AAA", mesmo.map(resumo));
    // Conclusao e reabertura no mesmo minuto (medido: TESTE 22/09/2026 03:08): na ordem da lista, duas passagens.
    const reabre = calcularPassagens(
      [and("10/03/2024 10:00", "AAA", "u", ROTULOS.reabertura), and("10/03/2024 10:00", "AAA", "u", ROTULOS.conclusao), and("10/03/2024 09:00", "AAA", "u", "Processo p\u00FAblico gerado")],
      AGORA,
    );
    checar("conclusao e reabertura no mesmo minuto: duas passagens, a 2a em curso", reabre.length === 2 && reabre[0].fim === "conclusao" && reabre[1].emCurso && reabre[1].inicio === "reabertura", reabre.map(resumo));
  }
  {
    const h = [
      and("10/03/2024 12:00", "AAA", "u", `${ROTULOS.remetidoPrefixo} BBB`, { unidadeCitada: "BBB" }),
      and("10/03/2024 11:00", "BBB", "u", ROTULOS.recebido),
      and("10/03/2024 11:00", "BBB", "u", ROTULOS.recebido),
      and("10/03/2024 08:00", "BBB", "u", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    checar("'recebido' repetido enquanto a unidade ja esta com o processo: vale a entrada mais antiga", r.filter((p) => p.unidade === "BBB").length === 1, r.map(resumo));
  }
  {
    const h = [
      and("10/03/2024 11:00", "AAA", "ana", "Assinado Documento 0000999 (Despacho) por ana", { nrSei: "0000999" }),
      and("10/03/2024 10:30", "AAA", "ana", "Gerado documento p\u00FAblico 0000999 (Despacho)", { nrSei: "0000999", idDocumento: "55" }),
      and("10/03/2024 10:10", "BBB", "bia", "Gerado documento p\u00FAblico 0000500 (Of\u00EDcio)", { nrSei: "0000500" }),
      and("10/03/2024 10:00", "BBB", "bia", `${ROTULOS.recebido}`),
      and("10/03/2024 09:30", "AAA", "ana", "Gerado documento p\u00FAblico 0000111 (Nota)", { nrSei: "0000111" }),
      and("10/03/2024 09:20", "BBB", "ana", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("10/03/2024 09:00", "AAA", "ana", "Processo p\u00FAblico gerado"),
    ];
    const r = calcularPassagens(h, AGORA);
    const aaa = r.find((p) => p.unidade === "AAA");
    const bbb = r.find((p) => p.unidade === "BBB" && !p.pendenteRecebimento);
    checar("documento gerado antes da remessa fica na passagem da unidade", aaa?.documentos.map((d) => d.nrSei).join() === "0000111" || aaa?.documentos.some((d) => d.nrSei === "0000111") === true, aaa?.documentos);
    checar("documento da outra unidade fica na passagem dela", bbb?.documentos.map((d) => d.nrSei).join() === "0000500", bbb?.documentos);
    checar("documento gerado depois da remessa (unidade seguiu com o processo aberto) vai para a passagem mais recente dela", aaa?.documentos.some((d) => d.nrSei === "0000999" && d.idDocumento === "55") === true, aaa?.documentos);
    checar("assinatura: por passagem, separada dos gerados", aaa?.assinaturas.length === 1 && aaa.assinaturas[0].nrSei === "0000999" && aaa.assinaturas[0].titulo.startsWith("0000999") , aaa?.assinaturas);
    checar("documento de unidade sem passagem e descartado, sem erro", calcularPassagens([and("10/03/2024 10:30", "ZZZ", "z", "Gerado documento p\u00FAblico 1 (X)", { nrSei: "1" })], AGORA).length === 0);
  }

  secao("calcularPassagens: datas ISO e fuso (sem conversao)");
  {
    checar("dataISODe", dataISODe("05/01/2024 23:59") === "2024-01-05T23:59:00");
    checar("relogioDoISO e o relogio escrito como UTC", relogioDoISO("2024-01-05T23:59:00")?.toISOString() === "2024-01-05T23:59:00.000Z");
    checar("relogioDoISO recusa lixo", relogioDoISO("2024-13-45") === null && relogioDoISO("") === null);
    // Em Sao Paulo o horario de verao de 2018 comecou em 04/11 (00:00 virou 01:00): 03/11 12:00 a 05/11 12:00 sao 48 h no relogio.
    const h = [
      and("05/11/2018 12:00", "BBB", "u", `${ROTULOS.remetidoPrefixo} AAA`, { unidadeCitada: "AAA" }),
      and("03/11/2018 12:00", "AAA", "u", "Processo p\u00FAblico gerado"),
    ];
    const tzOriginal = process.env.TZ;
    const resultados: string[] = [];
    for (const tz of ["America/Sao_Paulo", "Asia/Tokyo", "UTC", "Pacific/Auckland"]) {
      process.env.TZ = tz;
      const agora = new Date(2018, 10, 6, 8, 30); // relogio local: 06/11/2018 08:30
      const r = calcularPassagens(h, agora);
      resultados.push(`${tz}: ${r[0].duracaoMs / 3_600_000} h; pendente ${r[1].duracaoMs / 60_000} min; recebido ${isoDoRelogio(r[0].recebido)}; agora ${isoDoRelogio(relogioDe(agora))}`);
    }
    process.env.TZ = tzOriginal;
    const ok = resultados.every((s) => s.includes(": 48 h; pendente 1230 min; recebido 2018-11-03T12:00:00; agora 2018-11-06T08:30:00"));
    checar("48 h entre as duas datas e a espera pendente medida do relogio, em qualquer fuso do computador", ok, resultados);
    checar("isoDoRelogio devolve o relogio, sem Z", isoDoRelogio(new Date(Date.UTC(2024, 0, 5, 7, 8, 9))) === "2024-01-05T07:08:09");
  }
}
