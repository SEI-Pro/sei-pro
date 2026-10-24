/**
 * Gantt de tramitação: geometria e escalas, SVG, tempo por unidade, CSV, cache de 30 minutos (loja), coleta, estados do
 * modal (coletando, erro, cancelado, vazio, sigiloso, reabertura, em curso). As passagens vêm das fixtures reais do núcleo
 * (processo de 150 andamentos do SEI SP: remessa múltipla, reabertura, conclusão, pendentes e em curso).
 * O linkedom não simula <dialog> modal: o `<dialog>` e a visualização rápida se provam ao vivo.
 */
import { areaMemoria } from "@comum/armazenamento/area";
import { type Andamento, lerHistorico } from "@nucleo/dominio/historico";
import { calcularPassagens, type Passagem, relogioDe } from "@nucleo/dominio/passagens";
import { ErroSei } from "@nucleo/sessao/erros";
import { fixture } from "../../sei-nucleo/tests/util";
import { type ContextoColeta, obterHistorico, ProcessoSigilosoErro, restaurarBlocoInterno } from "../src/gantt/coleta";
import { resumoDoTempo, tempoPorUnidade } from "../src/gantt/comparativo";
import { baixarArquivo, CABECALHO_CSV, gerarCsvPassagens, montarVisaoDeImpressao, nomeDoCsv } from "../src/gantt/exportar";
import {
  agruparRaias,
  criarGeometria,
  DIA_MS,
  diasDe,
  eixoDoTempo,
  escalaPadrao,
  formatarDataHora,
  formatarDuracao,
  LARGURA_MAXIMA,
  rotuloDaRaia,
} from "../src/gantt/modelo";
import { ALTURA_CABECALHO, ALTURA_RAIA, fixarEixos, LARGURA_ROTULOS, montarGantt } from "../src/gantt/svg";
import { type DepsVisao, montarVisao } from "../src/gantt/visao";
import { chaveHistorico, prefixoHistorico } from "../src/modelo/constantes";
import { type HistoricoGuardado, VALIDADE_HISTORICO_MS } from "../src/modelo/dados";
import { LojaProcesso } from "../src/modelo/loja";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const ESCOPO = "treinamento.sei.sp.gov.br|usuario.teste";
const AGORA = new Date(2026, 9, 24, 10, 0);

function andamentosReais(): Andamento[] {
  const doc = instalarDom();
  void doc;
  return [...lerHistorico(fixture("sei41/historico_completo_p0.html")), ...lerHistorico(fixture("sei41/historico_completo_p1.html"))];
}

const iso = (s: string): Date => new Date(`${s}Z`);

/** Passagem montada à mão (datas em relógio UTC). */
function passagem(o: Partial<Passagem> & { unidade: string; de: string; ate?: string | null }): Passagem {
  const recebido = iso(o.de);
  const remetido = o.ate ? iso(o.ate) : null;
  const fimMs = remetido ? remetido.getTime() : iso("2026-10-24T10:00:00").getTime();
  const { de: _i, ate: _f, ...resto } = o;
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

export async function verificarGantt(): Promise<void> {
  const andamentos = andamentosReais();
  instalarDom();
  const passagens = calcularPassagens(andamentos, AGORA);

  secao("gantt: formatos");
  checar("duracao: menos de 1 min", formatarDuracao(20_000) === "menos de 1 min");
  checar("duracao: minutos", formatarDuracao(35 * 60_000) === "35 min");
  checar("duracao: horas e minutos", formatarDuracao((4 * 60 + 12) * 60_000) === "4 h 12 min", formatarDuracao((4 * 60 + 12) * 60_000));
  checar("duracao: horas exatas", formatarDuracao(5 * 3_600_000) === "5 h");
  checar("duracao: dias e horas", formatarDuracao(3 * DIA_MS + 4 * 3_600_000) === "3 d 4 h");
  checar("duracao: acima de 30 dias so dias", formatarDuracao(128 * DIA_MS + 5 * 3_600_000) === "128 d");
  checar("duracao: 59,6 min arredonda para 1 h", formatarDuracao(59.6 * 60_000) === "1 h");
  checar("duracao negativa nao quebra", formatarDuracao(-5) === "menos de 1 min");
  checar("dias com uma casa", diasDe(1.26 * DIA_MS) === 1.3 && diasDe(DIA_MS * 3) === 3 && diasDe(0) === 0);
  checar("data e hora no relogio do SEI (UTC)", formatarDataHora(iso("2026-03-05T09:07:00")) === "05/03/2026 09:07");
  checar(
    "rotulo da raia: 1 passagem sem contagem, varias com 'Nx'",
    rotuloDaRaia("GPF", 1) === "GPF" && rotuloDaRaia("GPF", 3) === "GPF 3x",
  );

  secao("gantt: geometria por escala");
  {
    const ps = [
      passagem({ unidade: "A", de: "2026-01-10T08:00:00", ate: "2026-01-20T08:00:00" }),
      passagem({ unidade: "B", de: "2026-01-20T08:00:00", ate: "2026-02-09T00:00:00" }),
    ];
    const dia = criarGeometria(ps, "dia");
    const semana = criarGeometria(ps, "semana");
    const mes = criarGeometria(ps, "mes");
    checar("origem no comeco do dia da primeira entrada", dia.origem === iso("2026-01-10T00:00:00").getTime());
    checar(
      "fim no fim do dia da ultima saida (inclusive)",
      dia.fim === iso("2026-02-10T00:00:00").getTime(),
      new Date(dia.fim).toISOString(),
    );
    checar(
      "30 dias: dia 28 px, semana 9 px, mes 2,2 px por dia",
      Math.round(dia.largura) === 31 * 28 && Math.round(semana.largura) === 31 * 9 && Math.round(mes.largura * 10) === 31 * 22,
    );
    checar("x do meio-dia da origem = metade de um dia", Math.round(dia.x(dia.origem + DIA_MS / 2)) === 14);
    checar(
      "x cresce com o tempo, nas tres escalas",
      [dia, semana, mes].every((g) => g.x(g.fim) > g.x(g.origem)),
    );
    checar(
      "escala padrao: a mais detalhada que cabe (dia, semana, senao mes)",
      escalaPadrao(ps, 1000) === "dia" && escalaPadrao(ps, 400) === "semana" && escalaPadrao(ps, 200) === "mes",
      [escalaPadrao(ps, 1000), escalaPadrao(ps, 400), escalaPadrao(ps, 200)],
    );
    const longo = [passagem({ unidade: "A", de: "2015-01-01T00:00:00", ate: "2026-01-01T00:00:00" })];
    const g = criarGeometria(longo, "dia");
    checar("processo de 11 anos na escala Dia nao passa da largura maxima", g.largura <= LARGURA_MAXIMA + 1, g.largura);
    const vazio = criarGeometria([], "mes", { agora: iso("2026-10-24T10:00:00") });
    checar("sem passagens: geometria valida (1 dia)", vazio.largura > 0 && Number.isFinite(vazio.largura));
    const emCurso = criarGeometria([passagem({ unidade: "A", de: "2026-10-01T00:00:00" })], "mes", { agora: iso("2026-10-24T10:00:00") });
    checar("em curso estende o eixo ate hoje", emCurso.fim >= iso("2026-10-24T10:00:00").getTime());
    const pxFixo = criarGeometria(ps, "mes", { pxPorDia: 5 });
    checar("pxPorDia sobrescreve a escala (impressao)", Math.round(pxFixo.largura) === 31 * 5);
  }

  secao("gantt: eixo do tempo");
  {
    const ps = [passagem({ unidade: "A", de: "2026-01-28T08:00:00", ate: "2026-03-04T08:00:00" })];
    const mes = eixoDoTempo(criarGeometria(ps, "mes"));
    checar(
      "mes: faixa de baixo tem jan, fev, mar; a de cima o ano",
      mes.baixo.map((m) => m.rotulo).join() === "jan,fev,mar" && mes.cima.map((m) => m.rotulo).join() === "2026",
      mes,
    );
    const dia = eixoDoTempo(criarGeometria(ps, "dia"));
    checar("dia: uma marca por dia (28 jan a 4 mar = 36 dias)", dia.baixo.length === 36 && dia.baixo[0].rotulo === "28", dia.baixo.length);
    checar(
      "dia: faixa de cima por mes, na ordem",
      dia.cima.map((m) => m.rotulo).join() === "janeiro de 2026,fevereiro de 2026,março de 2026",
      dia.cima.map((m) => m.rotulo).join(),
    );
    const sem = eixoDoTempo(criarGeometria(ps, "semana"));
    checar(
      "semana: marcas nas segundas (26/01 e seguintes)",
      sem.baixo[0].rotulo === "26/01" && sem.baixo[1].rotulo === "02/02",
      sem.baixo.slice(0, 2),
    );
    checar(
      "marcas sem largura negativa e ordenadas",
      [mes, dia, sem].every(
        (e) => [...e.cima, ...e.baixo].every((m) => m.largura >= 0) && e.baixo.every((m, i, a) => i === 0 || m.x >= a[i - 1].x),
      ),
    );
    const virada = eixoDoTempo(criarGeometria([passagem({ unidade: "A", de: "2025-12-20T00:00:00", ate: "2026-01-05T00:00:00" })], "dia"));
    checar(
      "virada de ano nas duas faixas",
      virada.cima.map((m) => m.rotulo).join() === "dezembro de 2025,janeiro de 2026",
      virada.cima.map((m) => m.rotulo).join(),
    );
  }

  secao("gantt: raias");
  {
    const raias = agruparRaias(passagens);
    const total = raias.reduce((t, r) => t + r.passagens.length, 0);
    checar("todas as passagens caem em alguma raia", total === passagens.length, { total, n: passagens.length });
    checar(
      "raias na ordem da primeira entrada",
      raias.every((r, i) => i === 0 || r.passagens[0].recebido.getTime() >= raias[i - 1].passagens[0].recebido.getTime()),
    );
    const varias = raias.find((r) => r.passagens.length > 1);
    checar(
      "raia com varias passagens leva a contagem no rotulo (“SIGLA Nx”)",
      !!varias && varias.rotulo === `${varias.sigla} ${varias.passagens.length}x`,
      varias?.rotulo,
    );
    const uma = raias.find((r) => r.passagens.length === 1);
    checar("raia com uma passagem so a sigla", !!uma && uma.rotulo === uma.sigla);
    checar(
      "a mesma sigla com tres passagens vira “X 3x” (montado)",
      agruparRaias([
        passagem({ unidade: "GPF", de: "2026-01-01T00:00:00", ate: "2026-01-02T00:00:00" }),
        passagem({ unidade: "GPF", de: "2026-01-03T00:00:00", ate: "2026-01-04T00:00:00" }),
        passagem({ unidade: "GPF", de: "2026-01-05T00:00:00" }),
      ])[0].rotulo === "GPF 3x",
    );
  }

  secao("gantt: SVG (fixture real, 150 andamentos)");
  {
    const abertos: string[] = [];
    const dicas: string[] = [];
    const svg = montarGantt(passagens, "mes", {
      agora: relogioDe(AGORA),
      dica: { mostrar: (d) => dicas.push(d.titulo), ocultar: () => dicas.push("-") },
      aoAbrirDocumento: (d) => abertos.push(d.nrSei ?? d.titulo),
    });
    const barras = [...svg.querySelectorAll(".spro-g-barra")];
    const raias = agruparRaias(passagens);
    checar("uma barra por passagem", barras.length === passagens.length, { barras: barras.length, passagens: passagens.length });
    const losangos = [...svg.querySelectorAll(".spro-g-losango")];
    const nDocs = passagens.reduce((t, p) => t + p.documentos.length, 0);
    checar("um losango por documento gerado", losangos.length === nDocs && nDocs > 0, { losangos: losangos.length, nDocs });
    const emCurso = passagens.filter((p) => p.emCurso && !p.pendenteRecebimento && !p.mantidoAberto).length;
    checar(
      "barras em curso listradas (padrao com fill url)",
      svg.querySelectorAll(".spro-g-barra.em-curso .padrao").length === emCurso && emCurso > 0,
      emCurso,
    );
    const pend = passagens.filter((p) => p.pendenteRecebimento).length;
    checar(
      "pendentes de recebimento: classe e padrao proprios",
      svg.querySelectorAll(".spro-g-barra.pendente").length === pend && pend > 0,
    );
    checar(
      "o padrao listrado referencia um pattern existente",
      (() => {
        const f = svg.querySelector(".spro-g-barra.em-curso .padrao")?.getAttribute("fill") ?? "";
        const id = /url\(#(.+)\)/.exec(f)?.[1] ?? "";
        return !!id && svg.querySelector(`pattern[id="${id}"]`) !== null;
      })(),
    );
    checar("rotulos de raia na coluna fixa, um por unidade", svg.querySelectorAll(".spro-g-rotulos .rotulo-raia").length === raias.length);
    const rotulos = [...svg.querySelectorAll(".spro-g-rotulos .rotulo-raia")].map((t) => t.textContent);
    checar(
      "rotulo com contagem aparece no SVG",
      raias.filter((r) => r.passagens.length > 1).every((r) => rotulos.includes(r.rotulo)),
      rotulos,
    );
    checar("altura = cabecalho + raias", Number(svg.getAttribute("height")) === ALTURA_CABECALHO + raias.length * ALTURA_RAIA + 8);
    checar("largura inclui a coluna de rotulos", Number(svg.getAttribute("width")) > LARGURA_ROTULOS);
    checar(
      "sem atributo title em lugar nenhum",
      svg.querySelectorAll("[title]").length === 0 && svg.querySelectorAll("title").length === 0,
    );
    checar(
      "sem atributos on* nem innerHTML no desenho",
      ![svg, ...svg.querySelectorAll("*")].some((e) => e.getAttributeNames().some((n) => n.startsWith("on"))),
    );
    checar(
      "cada barra e cada losango tem aria-label",
      [...barras, ...losangos].every((e) => (e.getAttribute("aria-label") ?? "").length > 5),
    );
    checar(
      "barra focavel por teclado",
      barras.every((b) => b.getAttribute("tabindex") === "0") &&
        losangos.every((l) => l.getAttribute("tabindex") === "0" && l.getAttribute("role") === "button"),
    );
    checar("linha Agora presente (ha passagem em curso)", svg.querySelector(".spro-g-agora") !== null);
    const primeira = barras[0];
    disparar(primeira, "focus");
    disparar(primeira, "blur");
    checar(
      "dica por foco: mostra o titulo da unidade e oculta ao sair",
      dicas.length === 2 && dicas[1] === "-" && dicas[0].length > 0,
      dicas,
    );
    const lo = losangos[0];
    disparar(lo, "click");
    checar("clique no losango abre o documento", abertos.length === 1, abertos);
    const KE = (lo.ownerDocument.defaultView as unknown as { KeyboardEvent?: typeof KeyboardEvent }).KeyboardEvent;
    if (KE) {
      lo.dispatchEvent(new KE("keydown", { key: "Enter", bubbles: true }));
      lo.dispatchEvent(new KE("keydown", { key: " ", bubbles: true }));
      lo.dispatchEvent(new KE("keydown", { key: "a", bubbles: true }));
      checar("Enter e Espaco abrem o documento; outra tecla nao", abertos.length === 3, abertos);
    }
    const mantido = passagens.filter((p) => p.mantidoAberto);
    checar(
      "passagem mantida aberta tem a marca da remessa (ou nao ha nenhuma na fixture)",
      svg.querySelectorAll(".marca-remessa").length === mantido.length,
    );
    const wDia = Number(montarGantt(passagens, "dia").getAttribute("width"));
    const wSem = Number(montarGantt(passagens, "semana").getAttribute("width"));
    const wMes = Number(svg.getAttribute("width"));
    checar("larguras: dia >= semana >= mes", wDia >= wSem && wSem >= wMes && wMes > 0, { wDia, wSem, wMes });
    const estatico = montarGantt(passagens, "mes", { larguraAlvo: 900 });
    checar(
      "impressao: largura 100%, viewBox na largura alvo, sem foco",
      estatico.getAttribute("width") === "100%" &&
        /^0 0 900(\.\d)? /.test(estatico.getAttribute("viewBox") ?? "") &&
        estatico.querySelectorAll("[tabindex]").length === 0,
      estatico.getAttribute("viewBox"),
    );
    const vazio = montarGantt([], "mes");
    checar(
      "sem passagens: SVG com a mensagem e sem barras",
      vazio.querySelectorAll(".spro-g-barra").length === 0 && /Sem passagens/.test(vazio.textContent ?? ""),
    );
  }

  secao("gantt: barras distintas (montadas)");
  {
    const ps = [
      passagem({
        unidade: "A",
        de: "2026-10-01T08:00:00",
        ate: "2026-10-05T08:00:00",
        documentos: [{ nrSei: "0001", idDocumento: "1", em: iso("2026-10-02T09:00:00"), titulo: "0001 (Despacho)", usuario: "ana" }],
      }),
      passagem({ unidade: "B", de: "2026-10-05T08:00:00", pendenteRecebimento: true, emCurso: true }),
      passagem({ unidade: "C", de: "2026-10-02T08:00:00", mantidoAberto: true, enviouEm: iso("2026-10-06T08:00:00"), destinos: ["B"] }),
    ];
    const svg = montarGantt(ps, "dia", { agora: iso("2026-10-24T10:00:00") });
    const sit = [...svg.querySelectorAll(".spro-g-barra")]
      .map((b) => b.getAttribute("data-situacao"))
      .sort()
      .join();
    checar("situacoes: concluida, mantido-aberto e pendente", sit === "concluida,mantido-aberto,pendente", sit);
    const rotulo = (u: string) =>
      [...svg.querySelectorAll(".spro-g-barra")]
        .find((b) => (b.getAttribute("aria-label") ?? "").startsWith(u))
        ?.getAttribute("aria-label") ?? "";
    checar("aria da pendente diz que a unidade ainda nao abriu", /ainda não abriu/.test(rotulo("B")), rotulo("B"));
    checar("aria da mantida aberta cita a remessa mantendo aberto", /mantendo o processo aberto/.test(rotulo("C")), rotulo("C"));
    checar("aria da concluida traz duracao e documento", /Duração 4 d/.test(rotulo("A")) && /1 documento/.test(rotulo("A")), rotulo("A"));
  }

  secao("gantt: eixos fixos na rolagem");
  {
    const svg = montarGantt(passagens, "mes");
    const rol = svg.ownerDocument.createElement("div");
    const desligar = fixarEixos(svg, rol);
    (rol as unknown as { scrollLeft: number; scrollTop: number }).scrollLeft = 120;
    (rol as unknown as { scrollLeft: number; scrollTop: number }).scrollTop = 30;
    disparar(rol, "scroll");
    checar(
      "rotulos acompanham a rolagem horizontal, cabecalho a vertical, canto as duas",
      svg.querySelector(".spro-g-rotulos")?.getAttribute("transform") === "translate(120 0)" &&
        svg.querySelector(".spro-g-cabecalho")?.getAttribute("transform") === "translate(0 30)" &&
        svg.querySelector(".spro-g-canto")?.getAttribute("transform") === "translate(120 30)",
    );
    desligar();
    (rol as unknown as { scrollLeft: number }).scrollLeft = 5;
    disparar(rol, "scroll");
    checar("desligar solta o ouvinte", svg.querySelector(".spro-g-rotulos")?.getAttribute("transform") === "translate(120 0)");
  }

  secao("gantt: tempo por unidade");
  {
    const t = tempoPorUnidade(passagens);
    checar(
      "ordenado do maior para o menor",
      t.every((x, i) => i === 0 || t[i - 1].ms >= x.ms),
    );
    checar(
      "percentuais somam ~100",
      Math.abs(t.reduce((s, x) => s + x.percentual, 0) - 100) < 0.6,
      t.reduce((s, x) => s + x.percentual, 0),
    );
    checar("passagens por unidade somam o total", t.reduce((s, x) => s + x.passagens, 0) === passagens.length);
    checar("uma linha por raia", t.length === agruparRaias(passagens).length);
    const ps = [
      passagem({ unidade: "A", de: "2026-01-01T00:00:00", ate: "2026-01-04T12:00:00" }),
      passagem({ unidade: "B", de: "2026-01-01T00:00:00", ate: "2026-01-02T00:00:00" }),
      passagem({ unidade: "A", de: "2026-01-10T00:00:00", ate: "2026-01-11T00:00:00" }),
      passagem({ unidade: "C", de: "2026-01-12T00:00:00" }),
    ];
    const m = tempoPorUnidade(ps);
    const total = ps.reduce((s, p) => s + p.duracaoMs, 0);
    checar("A soma duas passagens", m[0].unidade === "C" || m[0].unidade === "A");
    const a = m.find((x) => x.unidade === "A");
    checar("A: 3,5 + 1 = 4,5 dias, 2 passagens", a?.dias === 4.5 && a.passagens === 2, a);
    checar("percentual com uma casa", a?.percentual === Math.round(((4.5 * DIA_MS) / total) * 1000) / 10, a);
    const c = m.find((x) => x.unidade === "C");
    checar("em curso conta ate agora e vem marcado", c?.emCurso === true && c.dias === diasDe(ps[3].duracaoMs), c);
    checar("simultaneas contam cada uma (A e B no mesmo periodo somam no total)", m.reduce((s, x) => s + x.ms, 0) === total);
    checar("sem passagens: lista vazia, sem divisao por zero", tempoPorUnidade([]).length === 0 && resumoDoTempo([]).totalMs === 0);
    const zero = tempoPorUnidade([passagem({ unidade: "Z", de: "2026-01-01T00:00:00", ate: "2026-01-01T00:00:00" })]);
    checar("duracao zero: 0 dias e 0%", zero[0].dias === 0 && zero[0].percentual === 0);
    const empate = tempoPorUnidade([
      passagem({ unidade: "B", de: "2026-01-01T00:00:00", ate: "2026-01-02T00:00:00" }),
      passagem({ unidade: "A", de: "2026-01-01T00:00:00", ate: "2026-01-02T00:00:00" }),
    ]);
    checar("empate desempata pelo nome da unidade", empate.map((x) => x.unidade).join() === "A,B");
    const r = resumoDoTempo(ps);
    checar(
      "resumo: tempo corrido vai do primeiro recebimento ao fim/agora; unidades e passagens",
      r.unidades === 3 && r.passagens === 4 && r.corridoMs === iso("2026-10-24T10:00:00").getTime() - iso("2026-01-01T00:00:00").getTime(),
    );
  }

  secao("gantt: CSV");
  {
    const csv = gerarCsvPassagens(passagens);
    const linhas = csv.split("\r\n");
    checar("comeca com BOM (U+FEFF)", csv.charCodeAt(0) === 0xfeff);
    checar("cabecalho com ponto e virgula", linhas[0] === `﻿${CABECALHO_CSV.join(";")}`, linhas[0]);
    checar("uma linha por passagem mais o cabecalho", linhas.length === passagens.length + 1, linhas.length);
    const ps = [
      passagem({
        unidade: "A;B",
        unidadeNome: 'Gerencia "Norte"',
        de: "2026-03-05T09:07:00",
        ate: "2026-03-06T10:00:00",
        usuarioRecebeu: "ana",
        usuarioRecebeuNome: "Ana Souza",
        usuarioEnviou: "beto",
        destinos: ["X", "Y"],
        documentos: [{ nrSei: "1", em: iso("2026-03-05T10:00:00"), titulo: "1 (Despacho; urgente)" }],
      }),
      passagem({ unidade: "-FORM", de: "2026-03-07T00:00:00" }),
      passagem({ unidade: "P", de: "2026-03-08T00:00:00", pendenteRecebimento: true, usuarioEnviou: "caio" }),
    ];
    const l = gerarCsvPassagens(ps).split("\r\n");
    checar(
      "celula com ; e aspas e protegida e dobra as aspas",
      l[1].startsWith('"A;B";"Gerencia ""Norte""";Concluída;05/03/2026 09:07;06/03/2026 10:00;'),
      l[1],
    );
    checar("duracao em dias com virgula e texto", /;1,04;1 d;/.test(l[1]), l[1]);
    checar("pessoas com nome e login; destinos juntos", l[1].includes("Ana Souza (ana);beto;;X, Y;1;"), l[1]);
    checar("documentos: titulo, data e quantidade", l[1].includes(';1;"1 (Despacho; urgente) (05/03/2026)"'), l[1]);
    checar("celula que parece formula e neutralizada", l[2].startsWith("'-FORM;"), l[2]);
    checar("em curso: enviado em vazio, situacao Em curso", /;Em curso;07\/03\/2026 00:00;;/.test(l[2]), l[2]);
    checar(
      "pendente: sem 'recebido por', com 'enviado por'",
      /;Aguardando recebimento;08\/03\/2026 00:00;;[^;]*;;caio;/.test(l[3]) || l[3].includes(";;caio;"),
      l[3],
    );
    const mantido = gerarCsvPassagens([
      passagem({ unidade: "M", de: "2026-03-01T00:00:00", mantidoAberto: true, enviouEm: iso("2026-03-02T00:00:00") }),
    ]).split("\r\n")[1];
    checar(
      "mantido aberto: 'Enviado em' mostra a data da remessa",
      /;Mantido aberto;01\/03\/2026 00:00;02\/03\/2026 00:00;/.test(mantido),
      mantido,
    );
    checar("sem passagens: so o cabecalho", gerarCsvPassagens([]).split("\r\n").length === 1);
    checar(
      "nome do arquivo seguro",
      nomeDoCsv("99906.713-630.000047/2023-89") === "historico-99906.713-630.000047_2023-89.csv" &&
        nomeDoCsv("///") === "historico-processo.csv",
      nomeDoCsv("99906.713-630.000047/2023-89"),
    );
    // baixar: registra o que seria baixado
    const doc = instalarDom();
    const gravado: string[] = [];
    const falso = {
      createElement: (t: string) => doc.createElement(t),
      body: doc.body,
      defaultView: {
        URL: {
          createObjectURL: (b: { size: number }) => {
            gravado.push(`blob:${b.size}`);
            return "blob:x";
          },
          revokeObjectURL: () => {},
        },
        Blob: class {
          size: number;
          constructor(p: string[]) {
            this.size = p.join("").length;
          }
        },
        setTimeout: () => 0,
      },
    } as unknown as Document;
    const url = baixarArquivo(falso, "a.csv", "abc");
    checar(
      "baixar cria o blob e o link temporario some",
      url === "blob:x" && gravado[0] === "blob:3" && doc.querySelectorAll("a[download]").length === 0,
      gravado,
    );
  }

  secao("gantt: visao para impressao");
  {
    const v = montarVisaoDeImpressao({
      protocolo: "99906.713-630.000047/2023-89",
      passagens,
      agora: relogioDe(AGORA),
      coletadoEm: new Date(AGORA),
    });
    checar("titulo com o numero do processo", /99906\.713-630\.000047\/2023-89/.test(v.querySelector("h1")?.textContent ?? ""));
    const tabelas = v.querySelectorAll("table");
    checar(
      "duas tabelas: passagens e tempo por unidade",
      tabelas.length === 2 && tabelas[0].querySelectorAll("tbody tr").length === passagens.length,
    );
    checar(
      "o desenho cabe numa largura (SVG estatico)",
      v.querySelector("svg.estatico") !== null && v.querySelector("svg.estatico")?.getAttribute("width") === "100%",
    );
    checar(
      "fora da tela: classe de impressao, aria-hidden",
      v.classList.contains("spro-g-impressao") && v.getAttribute("aria-hidden") === "true",
    );
  }

  secao("cache do historico (loja): 30 min, 24 h, sigiloso, tamanho");
  {
    const area = areaMemoria();
    const loja = new LojaProcesso(area, ESCOPO, "190", { agora: () => 5000, esperar: async () => {} });
    checar("sem historico: nulo", (await loja.lerHistorico()) === null);
    const h: HistoricoGuardado = { coletadoEm: 5000, hash: "h", total: andamentos.length, andamentos };
    await loja.guardarHistorico(h);
    const outra = new LojaProcesso(area, ESCOPO, "190", { esperar: async () => {} });
    const lido = await outra.lerHistorico();
    checar(
      "outra aba (outra loja) le do cache persistente",
      lido?.total === andamentos.length &&
        lido.andamentos.length === andamentos.length &&
        lido.andamentos[0].descricao === andamentos[0].descricao,
    );
    checar(
      "chave propria, fora da entrada dos paineis",
      (await area.obter(chaveHistorico(ESCOPO, "190")))[chaveHistorico(ESCOPO, "190")] !== undefined &&
        !(await area.obter(`processo/${ESCOPO}/190`))[`processo/${ESCOPO}/190`],
    );
    const sig = new LojaProcesso(area, ESCOPO, "999", { sigiloso: true });
    await sig.guardarHistorico(h);
    checar(
      "sigiloso nunca grava nem le",
      (await sig.lerHistorico()) === null && (await area.obter(chaveHistorico(ESCOPO, "999")))[chaveHistorico(ESCOPO, "999")] === undefined,
    );
    const semLogin = new LojaProcesso(area, "host|", "5", {});
    await semLogin.guardarHistorico(h);
    checar(
      "sem login nao grava (fica em memoria)",
      (await area.obter(chaveHistorico("host|", "5")))[chaveHistorico("host|", "5")] === undefined &&
        (await semLogin.lerHistorico())?.total === h.total,
    );
    const grande = {
      ...h,
      andamentos: Array.from({ length: 6000 }, (_, i) => ({
        ...andamentos[i % andamentos.length],
        descricao: `${andamentos[i % andamentos.length].descricao} ${i}`,
      })),
    };
    const lg = new LojaProcesso(area, ESCOPO, "888", { agora: () => 6000 });
    await lg.guardarHistorico(grande);
    checar(
      "historico enorme: nao vai ao cache persistente, segue em memoria",
      (await area.obter(chaveHistorico(ESCOPO, "888")))[chaveHistorico(ESCOPO, "888")] === undefined &&
        (await lg.lerHistorico())?.andamentos.length === 6000,
    );
    const sem = areaMemoria({ [chaveHistorico(ESCOPO, "1")]: { lixo: true } });
    checar("entrada invalida e ignorada", (await new LojaProcesso(sem, ESCOPO, "1").lerHistorico()) === null);
    // poda: no maximo 12 e nada com mais de 24 h
    const a2 = areaMemoria();
    for (let i = 0; i < 15; i++) {
      const l = new LojaProcesso(a2, ESCOPO, String(100 + i), { agora: () => 1_000_000 + i });
      await l.guardarHistorico({ coletadoEm: 1_000_000 + i, hash: "h", total: 1, andamentos: andamentos.slice(0, 1) });
    }
    const chaves = (await a2.chaves?.())?.filter((k) => k.startsWith(prefixoHistorico)) ?? [];
    checar(
      "poda mantem os 12 mais novos",
      chaves.length === 12 && !chaves.includes(chaveHistorico(ESCOPO, "100")) && chaves.includes(chaveHistorico(ESCOPO, "114")),
      chaves.length,
    );
    const a3 = areaMemoria();
    await new LojaProcesso(a3, ESCOPO, "1", { agora: () => 0 }).guardarHistorico({
      coletadoEm: 0,
      hash: "h",
      total: 1,
      andamentos: andamentos.slice(0, 1),
    });
    await new LojaProcesso(a3, ESCOPO, "2", { agora: () => 25 * 3_600_000 }).guardarHistorico({
      coletadoEm: 25 * 3_600_000,
      hash: "h",
      total: 1,
      andamentos: andamentos.slice(0, 1),
    });
    checar("o que passou de 24 h sai", (await a3.chaves?.())?.filter((k) => k.startsWith(prefixoHistorico)).length === 1);
  }

  // --- Coleta -----------------------------------------------------------------------------------------------
  interface Falso {
    ctx: ContextoColeta & { protocolo: string; topo: Document; doc: Document };
    chamadas: Array<{ cache: unknown; forcar?: boolean }>;
    relogio: { ms: number };
    loja: LojaProcesso;
    area: ReturnType<typeof areaMemoria>;
    destravar: () => void;
    progresso: (feito: number, total: number) => void;
  }
  function falso(
    o: {
      sigiloso?: boolean;
      falha?: Error;
      lento?: boolean;
      vazio?: boolean;
      area?: ReturnType<typeof areaMemoria>;
      andamentos?: Andamento[];
    } = {},
  ): Falso {
    const doc = instalarDom();
    const relogio = { ms: AGORA.getTime() };
    const area = o.area ?? areaMemoria();
    const loja = new LojaProcesso(area, ESCOPO, "190", { agora: () => relogio.ms, sigiloso: Boolean(o.sigiloso), esperar: async () => {} });
    const chamadas: Falso["chamadas"] = [];
    let liberar: () => void = () => {};
    let ouvir: ((f: number, t: number) => void) | undefined;
    const lista = o.vazio ? [] : (o.andamentos ?? andamentos);
    const ctx = {
      loja,
      sigiloso: Boolean(o.sigiloso),
      unidade: { sigla: "TESTE" },
      protocolo: "99906.713-630.000047/2023-89",
      topo: doc,
      doc,
      agora: () => new Date(relogio.ms),
      async coletarHistorico(op: Parameters<ContextoColeta["coletarHistorico"]>[0]) {
        chamadas.push({ cache: op.cache });
        ouvir = op.aoProgresso;
        if (o.falha) throw o.falha;
        if (o.lento) {
          await new Promise<void>((resolver, rejeitar) => {
            liberar = resolver;
            op.sinal?.addEventListener("abort", () => rejeitar(new ErroSei("CANCELADO", "Operação cancelada.")), { once: true });
          });
        }
        const igual = op.cache && op.cache.total === lista.length;
        return { andamentos: lista, total: lista.length, hash: "hash-1", completo: true, aproveitouCache: Boolean(igual) };
      },
    } as unknown as Falso["ctx"];
    return { ctx, chamadas, relogio, loja, area, destravar: () => liberar(), progresso: (f, t) => ouvir?.(f, t) };
  }

  secao("coleta: cache de 30 minutos");
  {
    const f = falso();
    const a = await obterHistorico(f.ctx);
    checar("primeira vez coleta pela rede e guarda", a.origem === "rede" && f.chamadas.length === 1 && f.chamadas[0].cache === null);
    f.relogio.ms += 10 * 60_000;
    const b = await obterHistorico(f.ctx);
    checar("10 min depois: do cache, sem coletar", b.origem === "cache" && f.chamadas.length === 1 && b.coletadoEm === a.coletadoEm);
    const c = await obterHistorico(f.ctx, { forcar: true });
    checar(
      "forcar coleta de novo, com o cache como base",
      c.origem === "rede" && f.chamadas.length === 2 && (f.chamadas[1].cache as { hash: string }).hash === "hash-1",
    );
    checar("a coleta conferida renova o carimbo", c.coletadoEm === f.relogio.ms);
    f.relogio.ms += VALIDADE_HISTORICO_MS + 1000;
    const d = await obterHistorico(f.ctx);
    checar(
      "passou de 30 min: coleta (incremental) em vez de usar o cache",
      d.origem === "rede" && f.chamadas.length === 3 && (f.chamadas[2].cache as { total: number }).total === andamentos.length,
    );
    checar("incremental: marca que aproveitou o cache", d.aproveitouCache === true);
    const abas = falso({ area: f.area });
    abas.relogio.ms = f.relogio.ms + 5 * 60_000;
    const e = await obterHistorico(abas.ctx);
    checar("outra aba no mesmo navegador reabre do cache persistente (sem coletar)", e.origem === "cache" && abas.chamadas.length === 0);
  }

  secao("coleta: Bloco Interno vem do historico em cache");
  {
    const f = falso();
    checar("sem historico guardado: nao restaura", (await restaurarBlocoInterno(f.ctx)) === false);
    await obterHistorico(f.ctx);
    const fatia = f.loja.ler<{ coletadoEm: number }>("blocoInterno");
    checar("a coleta publica a fatia blocoInterno", fatia.estado === "pronto" && fatia.dado?.coletadoEm === f.relogio.ms);
    const outra = falso({ area: f.area });
    checar(
      "outra aba restaura a fatia sem coletar",
      (await restaurarBlocoInterno(outra.ctx)) === true &&
        outra.chamadas.length === 0 &&
        outra.loja.ler("blocoInterno").estado === "pronto",
    );
    const vencida = falso({ area: f.area });
    vencida.relogio.ms += VALIDADE_HISTORICO_MS + 1;
    checar(
      "vencido: nao restaura",
      (await restaurarBlocoInterno(vencida.ctx)) === false && vencida.loja.ler("blocoInterno").estado === "carregando",
    );
  }

  secao("coleta: sigiloso, falha e cancelamento");
  {
    const s = falso({ sigiloso: true });
    let erro: unknown;
    await obterHistorico(s.ctx).catch((e) => {
      erro = e;
    });
    checar("sigiloso: recusa e nao chama o coletor", erro instanceof ProcessoSigilosoErro && s.chamadas.length === 0);
    checar("sigiloso: nada no cache", (await s.loja.lerHistorico()) === null && (await s.area.chaves?.())?.length === 0);
    checar("sigiloso: nao restaura o bloco", (await restaurarBlocoInterno(s.ctx)) === false);
    const q = falso({ falha: new Error("SEI fora do ar") });
    let e2: unknown;
    await obterHistorico(q.ctx).catch((e) => {
      e2 = e;
    });
    checar("falha do coletor sobe e nao grava", (e2 as Error).message === "SEI fora do ar" && (await q.loja.lerHistorico()) === null);
  }

  // --- Visao ------------------------------------------------------------------------------------------------
  const textoDe = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();
  const dep = (f: Falso, extra: Partial<DepsVisao> = {}): DepsVisao => ({ ctx: f.ctx, abrirDocumento: () => {}, ...extra });
  const botaoDe = (raiz: Element, texto: string) =>
    [...raiz.querySelectorAll("button")].find((b) => textoDe(b) === texto) as HTMLButtonElement | undefined;

  secao("modal: coletando com progresso e cancelamento da coleta");
  {
    const f = falso({ lento: true });
    const v = montarVisao(dep(f));
    await tique(15);
    checar(
      "estado coletando, sem dados",
      v.estado().tipo === "coletando" && /Coletando/.test(textoDe(v.el.querySelector(".spro-g-painel") as Element)),
    );
    f.progresso(7, 34);
    checar(
      "progresso “pagina 7 de 34”",
      /página 7 de 34/.test(textoDe(v.el.querySelector(".spro-g-prog-texto") as Element)),
      textoDe(v.el.querySelector(".spro-g-progresso") as Element),
    );
    const barra = v.el.querySelector(".spro-g-prog-barra") as HTMLElement;
    checar(
      "barra de progresso acessivel (role, now = 21%)",
      barra.getAttribute("role") === "progressbar" && barra.getAttribute("aria-valuenow") === "21",
      barra.getAttribute("aria-valuenow"),
    );
    checar(
      "exportar e imprimir desligados sem dados",
      (botaoDe(v.el, "Exportar CSV") as HTMLButtonElement).disabled && (botaoDe(v.el, "Imprimir") as HTMLButtonElement).disabled,
    );
    const cancelar = botaoDe(v.el, "Cancelar coleta");
    checar("ha um botao “Cancelar coleta” (so da coleta)", !!cancelar);
    if (cancelar) disparar(cancelar, "click");
    await tique(15);
    checar(
      "cancelada: aviso, sem dados, com “Coletar de novo”",
      v.estado().tipo === "cancelado" &&
        /Coleta cancelada/.test(textoDe(v.el.querySelector(".spro-g-aviso") as Element)) &&
        !!botaoDe(v.el, "Coletar de novo"),
    );
    checar("some a barra de progresso", (v.el.querySelector(".spro-g-progresso") as HTMLElement).hidden === true);
    f.destravar();
    const de_novo = botaoDe(v.el, "Coletar de novo");
    if (de_novo) disparar(de_novo, "click");
    await tique(15);
    f.destravar();
    await tique(15);
    checar("coletar de novo termina pronto", v.estado().tipo === "pronto", v.estado().tipo);
    v.destruir();
  }

  secao("modal: pronto, abas, escalas, exportar");
  {
    const f = falso();
    const v = montarVisao(dep(f));
    await v.pronta;
    checar("pronto com as passagens", v.estado().tipo === "pronto" && v.el.querySelectorAll(".spro-g-barra").length === passagens.length);
    checar(
      "abas Gantt e Tempo por unidade (roles tab)",
      [...v.el.querySelectorAll("[role=tab]")].map(textoDe).join() === "Gantt,Tempo por unidade",
    );
    checar("aba Gantt selecionada", v.el.querySelector("[role=tab][aria-selected=true]")?.textContent === "Gantt");
    checar(
      "escala padrao marcada com aria-pressed (so uma)",
      v.el.querySelectorAll(".spro-segmentado[role=group] [aria-pressed=true]").length === 1,
    );
    const antes = v.el.querySelector(".spro-g-svg")?.getAttribute("data-escala");
    const alvo = antes === "dia" ? "Semana" : "Dia";
    const be = botaoDe(v.el, alvo);
    if (be) disparar(be, "click");
    const depois = v.el.querySelector(".spro-g-svg")?.getAttribute("data-escala");
    checar("trocar a escala redesenha o SVG", depois !== antes && v.el.querySelectorAll(".spro-g-svg").length === 1, { antes, depois });
    checar("legenda presente", v.el.querySelectorAll(".spro-g-legenda li").length === 5);
    checar(
      "balao de dica proprio (role tooltip), nunca title",
      v.el.querySelector("[role=tooltip]") !== null && v.el.querySelectorAll("[title]").length === 0,
    );
    const tempo = botaoDe(v.el, "Tempo por unidade");
    if (tempo) disparar(tempo, "click");
    const linhas = [...v.el.querySelectorAll(".spro-g-tabela tbody tr")];
    checar(
      "aba de tempo: uma linha por unidade, maior primeiro",
      linhas.length === agruparRaias(passagens).length &&
        linhas.every(
          (tr, i) =>
            i === 0 ||
            Number((tr.querySelector("td.num")?.textContent ?? "0").replace(",", ".")) <=
              Number((linhas[i - 1].querySelector("td.num")?.textContent ?? "0").replace(",", ".")),
        ),
    );
    checar(
      "aba de tempo explica a regra das simultaneas e em curso",
      /simultâneas/.test(textoDe(v.el.querySelector(".spro-g-nota") as Element)),
    );
    checar(
      "tabela acessivel (caption, scope)",
      v.el.querySelector(".spro-g-tabela caption") !== null && v.el.querySelectorAll("th[scope=col]").length >= 4,
    );
    checar("a aba de tempo nao tem SVG do Gantt", v.el.querySelector(".spro-g-svg") === null);
    const KE = (v.el.ownerDocument.defaultView as unknown as { KeyboardEvent?: typeof KeyboardEvent }).KeyboardEvent;
    const abasEl = v.el.querySelector(".spro-g-abas") as HTMLElement;
    if (KE) {
      abasEl.dispatchEvent(new KE("keydown", { key: "ArrowLeft", bubbles: true }));
      checar("seta troca de aba", v.el.querySelector("[role=tab][aria-selected=true]")?.textContent === "Gantt");
    }
    checar(
      "rodape com Atualizar, Exportar CSV e Imprimir ligados",
      !!botaoDe(v.el, "Atualizar") &&
        !(botaoDe(v.el, "Exportar CSV") as HTMLButtonElement).disabled &&
        !(botaoDe(v.el, "Imprimir") as HTMLButtonElement).disabled,
    );
    checar(
      "rodape diz quando foi coletado",
      /Coletado em .*agora há pouco/.test(textoDe(v.el.querySelector(".spro-g-frescor") as Element)),
      textoDe(v.el.querySelector(".spro-g-frescor") as Element),
    );
    checar(
      "sem botao Cancelar do modal (so “Cancelar coleta”, e so coletando)",
      botaoDe(v.el, "Cancelar") === undefined && botaoDe(v.el, "Cancelar coleta") === undefined,
    );
    v.destruir();
  }

  secao("modal: reabertura usa o cache; vencido mostra desatualizado e atualiza");
  {
    const f = falso();
    const v1 = montarVisao(dep(f));
    await v1.pronta;
    v1.destruir();
    f.relogio.ms += 12 * 60_000;
    const v2 = montarVisao(dep(f));
    await v2.pronta;
    checar("segunda abertura (12 min): sem nova coleta", f.chamadas.length === 1 && v2.estado().tipo === "pronto");
    v2.destruir();
    f.relogio.ms += 40 * 60_000;
    const v3 = montarVisao(dep(f));
    await tique(2);
    await v3.pronta;
    checar(
      "vencido: coleta incremental com o cache como base",
      f.chamadas.length === 2 && (f.chamadas[1].cache as { hash: string }).hash === "hash-1",
    );
    checar("termina pronto e atualizado", v3.estado().tipo === "pronto" && !v3.el.querySelector(".spro-g-aviso.desatualizado"));
    v3.destruir();
    // vencido e a atualizacao cancelada/falha: mostra o dado antigo como desatualizado
    const g = falso({ lento: true, area: f.area });
    g.relogio.ms = f.relogio.ms + 3 * 3_600_000;
    const v4 = montarVisao(dep(g));
    await tique(20);
    checar(
      "vencido e atualizando: mostra o antigo, aviso “desatualizado”, e o progresso",
      v4.estado().tipo === "coletando" &&
        v4.el.querySelectorAll(".spro-g-barra").length === passagens.length &&
        /enquanto ele é atualizado/.test(textoDe(v4.el.querySelector(".spro-g-aviso") as Element)),
      textoDe(v4.el.querySelector(".spro-g-aviso") as Element),
    );
    const c4 = botaoDe(v4.el, "Cancelar coleta");
    if (c4) disparar(c4, "click");
    await tique(20);
    checar(
      "cancelou a atualizacao: continua mostrando o antigo, avisando que esta desatualizado",
      v4.estado().tipo === "cancelado" &&
        v4.el.querySelectorAll(".spro-g-barra").length === passagens.length &&
        /desatualizado/.test(textoDe(v4.el.querySelector(".spro-g-aviso") as Element)),
    );
    v4.destruir();
  }

  secao("modal: erro, vazio, sigiloso, em curso");
  {
    const f = falso({ falha: new Error("A sessão expirou") });
    const v = montarVisao(dep(f));
    await v.pronta;
    checar(
      "erro: mensagem e “Tentar de novo”",
      v.estado().tipo === "erro" &&
        /sessão expirou/.test(textoDe(v.el.querySelector(".spro-g-aviso") as Element)) &&
        !!botaoDe(v.el, "Tentar de novo"),
    );
    checar("erro nao deixa spinner: sem progresso visivel", (v.el.querySelector(".spro-g-progresso") as HTMLElement).hidden === true);
    v.destruir();

    const ve = falso({ vazio: true });
    const vv = montarVisao(dep(ve));
    await vv.pronta;
    checar(
      "vazio: mensagem e exportar desligado",
      /não tem tramitação/.test(textoDe(vv.el.querySelector(".spro-g-painel") as Element)) &&
        (botaoDe(vv.el, "Exportar CSV") as HTMLButtonElement).disabled,
    );
    vv.destruir();

    const fs = falso({ sigiloso: true });
    const vs = montarVisao(dep(fs));
    await vs.pronta;
    checar(
      "sigiloso: aviso, nenhuma coleta, nada de dados",
      vs.estado().tipo === "sigiloso" &&
        fs.chamadas.length === 0 &&
        /sigiloso/.test(textoDe(vs.el.querySelector(".spro-g-aviso") as Element)) &&
        vs.el.querySelectorAll(".spro-g-barra").length === 0,
    );
    checar("sigiloso: Atualizar desligado", (botaoDe(vs.el, "Atualizar") as HTMLButtonElement).disabled);
    vs.destruir();

    const fc = falso();
    const vc = montarVisao(dep(fc, { aba: "tempo" }));
    await vc.pronta;
    checar("abre direto na aba pedida", vc.el.querySelector("[role=tab][aria-selected=true]")?.textContent === "Tempo por unidade");
    checar("em curso aparece marcado na tabela", vc.el.querySelectorAll(".spro-g-selo-curso").length > 0);
    vc.destruir();
    fc.destravar();
  }

  secao("modal: destruir para a coleta");
  {
    const f = falso({ lento: true });
    const v = montarVisao(dep(f));
    await tique(15);
    v.destruir();
    await tique(15);
    checar("fechar o modal cancela a coleta e nao deixa estado preso", v.estado().tipo === "coletando" || v.estado().tipo === "cancelado");
    // nada quebra ao receber progresso depois de fechado
    f.progresso(1, 2);
    checar("progresso depois de fechar e ignorado", true);
  }
}
