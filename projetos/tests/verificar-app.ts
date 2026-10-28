import { areaMemoria } from "@comum/armazenamento/area";
import { emissorDeAvisoPelaPagina } from "@comum/painel/aviso";
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import { type AbrirModal, criarAbrirModal } from "@comum/ui/dialogo";
import { AppProjetos } from "../src/app/app";
import type { ParametrosImpressao } from "../src/app/impressao";
import { gravarPreferencias, lerPreferencias } from "../src/app/preferencias";
import type { ProvedorSincronia } from "../src/app/sincronia";
import type { LinhaEtapa } from "../src/gantt/linhas";
import type { DataISO } from "../src/modelo/tipos";
import { ErroValidacao } from "../src/modelo/validacao";
import type { ContextoProjetos } from "../src/ponte/tipos";
import { digitar, escolherCombo, itemDoMenu, itensDoMenu, marcar, tecla, telaDoApp, texto } from "./apoioApp";
import { ESCOPO_EU, ESCOPO_UN, novoRepo } from "./apoioRepositorio";
import { HOSTIL } from "./cenarioGantt";
import { HOJE } from "./fabrica";
import { ganttFalso } from "./ganttFalso";
import { botao, checar, disparar, secao, tique } from "./util";

const CTX: ContextoProjetos = {
  host: "sei.x.gov.br",
  login: "ana",
  nome: "Ana Lima",
  unidade: { id: "110", sigla: "TESTE", nome: "Unidade de Teste" },
  versao: "4.1.5",
  temaEscuro: false,
  atividades: false,
};
const AGORA = new Date(2026, 9, 6, 15).getTime();

/** Aviso que o app mandou para a página do SEI (modo embutido): `responder` é o clique do usuário lá. */
export interface AvisoNaPagina {
  texto?: string;
  acao?: string;
  acoes?: string[];
  ms?: number;
  responder(r: boolean | number): void;
}

export async function montar(
  o: {
    vazio?: boolean;
    /** Como no painel embutido: <dialog> de verdade, sobreposição e aviso pela página (desligar com `definirEmissorDeAviso(null)`). */
    embutido?: boolean;
    falharGantt?: boolean;
    sincronia?: ProvedorSincronia;
    hoje?: () => DataISO;
    conferirDiaMs?: number;
    semIniciar?: boolean;
    largura?: () => number;
  } = {},
) {
  const doc = telaDoApp();
  const area = areaMemoria();
  const { repo: un } = novoRepo(ESCOPO_UN, area, "u");
  const { repo: eu } = novoRepo(ESCOPO_EU, area, "e");
  const ids = { p: "", f: "", a: "", b: "", q: "" };
  if (!o.vazio) {
    const p = await un.criarProjeto({ nome: HOSTIL, processo: { protocolo: "50300.001234/2026-11", idProcedimento: "77" } });
    const f = await un.criarFase(p.id, "Instrução");
    const a = await un.criarEtapa({ projeto: p.id, nome: "Nota técnica", fase: f.id, inicio: "2026-09-01", fim: "2026-10-02" });
    const b = await un.criarEtapa({
      projeto: p.id,
      nome: "Análise",
      fase: f.id,
      inicio: "2026-10-05",
      fim: "2026-10-09",
      dependeDe: [a.id],
    });
    const q = await eu.criarProjeto({ nome: "Plano 2027" });
    Object.assign(ids, { p: p.id, f: f.id, a: a.id, b: b.id, q: q.id });
  }
  const chamadas: Array<[string, unknown]> = [];
  const naPagina: AvisoNaPagina[] = [];
  const rpc = {
    chamar: async <T>(op: string, args?: unknown): Promise<T> => {
      chamadas.push([op, args]);
      if (op === "processosDaCaixa" || op === "usuariosDaUnidade") return [] as T;
      if (op === "aviso")
        return new Promise<T>((r) => naPagina.push({ ...(args as Omit<AvisoNaPagina, "responder">), responder: (x) => r(x as T) }));
      return true as T;
    },
  };
  const modais: string[] = [];
  let abrirModal: AbrirModal = (m) => {
    modais.push(m.titulo);
    doc.body.append(m.conteudo);
    return {
      fechar: () => {
        m.conteudo.remove();
        m.aoFechar?.();
      },
    };
  };
  if (o.embutido) {
    const sobrepor = sobreposicaoNoApp(rpc, { minimo: () => undefined }, { doc, espera: 10 });
    abrirModal = criarAbrirModal({ aoAbrir: sobrepor.abrir, aoFechar: sobrepor.fechar });
    definirEmissorDeAviso(emissorDeAvisoPelaPagina(rpc, doc));
  }
  const t = {
    confirmar: true,
    confirmacoes: [] as string[],
    baixados: [] as Array<{ nome: string; conteudo: string }>,
    impressos: [] as ParametrosImpressao[],
  };
  const g = ganttFalso({ falhar: o.falharGantt });
  const app = new AppProjetos({
    raiz: doc.getElementById("app")!,
    ctx: CTX,
    area,
    repos: { unidade: un, eu },
    rpc,
    abrirModal,
    confirmar: async (texto) => {
      t.confirmacoes.push(texto);
      return t.confirmar;
    },
    baixar: (nome, conteudo) => void t.baixados.push({ nome, conteudo }),
    hoje: o.hoje ?? (() => HOJE),
    agora: () => AGORA,
    imprimir: (p) => void t.impressos.push(p),
    montarGantt: g.montar,
    sincronia: o.sincronia,
    largura: o.largura ?? (() => 1000),
    conferirDiaMs: o.conferirDiaMs,
  });
  if (!o.semIniciar) await app.iniciar();
  const raiz = doc.getElementById("app")!;
  return { doc, raiz, area, un, eu, ids, app, chamadas, modais, t, g, naPagina };
}

export type Montado = Awaited<ReturnType<typeof montar>>;

export const aviso = (doc: Document) => doc.querySelector(".spro-aviso");
export const textoDoAviso = (doc: Document) => texto(aviso(doc)?.querySelector("span"));
export const abrirAba = (m: Montado, id: string) => (m.raiz.querySelector(`[role='tab'][data-aba='${id}']`) as HTMLElement | null)?.click();
export const clicarLinha = (m: Montado, id: string) => (m.raiz.querySelector(`.prj-lin[data-id='${id}']`) as HTMLElement | null)?.click();
export const balao = (m: Montado) => m.doc.querySelector<HTMLElement>(".prj-balao");
export const formProjeto = (m: Montado) => m.doc.querySelector<HTMLElement>(".prj-form-projeto");
const fecharFormProjeto = (m: Montado) => botao(formProjeto(m) ?? m.doc.createElement("div"), "Cancelar")?.click();
export const etapasDoGantt = (m: Montado) => (m.g.a.linhas.at(-1) ?? []).filter((l): l is LinhaEtapa => l.tipo === "etapa");

export async function verificarApp(): Promise<void> {
  secao("app: primeiro uso");
  const v = await montar({ vazio: true });
  checar(
    "sem projetos: o vazio e o menu, sem abas",
    !!v.raiz.querySelector(".prj-vazio") &&
      !v.raiz.querySelector("[role='tab']") &&
      !!v.raiz.querySelector("button[aria-label='Ajustes dos projetos']"),
  );
  botao(v.raiz, "Criar projeto")!.click();
  const form = () => v.doc.querySelector(".prj-form-projeto") as HTMLElement;
  digitar(form().querySelector("input[name='nome']"), "Pregão");
  botao(form(), "Criar projeto")!.click();
  await tique(80);
  checar(
    "cria e abre o projeto novo",
    texto(v.raiz.querySelector("[role='tab'][aria-selected='true']")).startsWith("Pregão") && !!v.raiz.querySelector(".prj-vista"),
  );
  botao(v.raiz, "Novo projeto")!.click();
  botao(form(), "De um modelo")!.click();
  digitar(form().querySelector("input[name='nome']"), "Revisão");
  digitar(form().querySelector("input[name='comeca']"), "2026-08-03");
  botao(form(), "Criar projeto")!.click();
  await tique(80);
  const aberto = (await v.un.dados()).projetos.find((p) => p.nome === "Revisão");
  checar(
    "de um modelo: 9 etapas em 3 fases",
    (await v.un.dados()).etapas.filter((e) => e.projeto === aberto?.id).length === 9 && v.app.aberto === aberto?.id,
  );
  v.app.destruir();

  secao("app: abas, cabecalho e vista do projeto");
  const a = await montar();
  const abas = [...a.raiz.querySelectorAll("[role='tab']")].map((x) => texto(x));
  checar(
    "Todos e os dois escopos juntos",
    abas.length === 3 && abas[0] === "Todos2" && abas.some((x) => x.startsWith(HOSTIL)) && abas.some((x) => x.startsWith("Plano 2027")),
  );
  checar(
    "comeca no Todos (portfolio)",
    a.app.aberto === "todos" && texto(a.raiz.querySelector(".prj-meta")).startsWith("2 projetos ativos"),
  );
  (a.raiz.querySelector(`[role='tab'][data-aba='${a.ids.p}']`) as HTMLElement).click();
  await tique();
  checar(
    "abre o projeto e lembra por unidade",
    a.app.aberto === a.ids.p && (await lerPreferencias(a.area)).abertos["sei.x.gov.br|ana|u:110"] === a.ids.p,
  );
  checar("cabecalho: processo, escopo e contagem", texto(a.raiz.querySelector(".prj-meta")).includes("0 de 2 etapas concluídas"));
  (a.raiz.querySelector(".prj-processo") as HTMLElement).click();
  checar(
    "o link do processo pede a aba",
    JSON.stringify(a.chamadas.at(-1)) ===
      JSON.stringify(["abrirProcesso", { id: "77", protocolo: "50300.001234/2026-11", novaAba: false }]),
  );
  const linhas = a.g.a.linhas.at(-1) ?? [];
  checar(
    "lista e Gantt com as mesmas linhas",
    a.raiz.querySelectorAll(".prj-lin:not(.prj-lin-nova)").length === linhas.length && linhas.length === 3,
  );

  secao("app: concluir com 1 clique, informar documento e desfazer");
  (a.raiz.querySelector(`.prj-lin[data-id='${a.ids.a}']`) as HTMLElement).click();
  checar("balao abre", !!a.doc.querySelector(".prj-balao"));
  botao(a.doc.querySelector(".prj-balao")!, "Concluir etapa")!.click();
  await tique(80);
  checar("concluida com a data de hoje", (await a.un.obterEtapa(a.ids.a))?.concluidaEm === HOJE);
  const t1 = aviso(a.doc);
  checar(
    "aviso da tela 2 com as duas acoes",
    texto(t1?.querySelector("span")) === "“Nota técnica” concluída hoje (06/10)." &&
      !!botao(t1!, "Informar documento") &&
      !!botao(t1!, "Desfazer"),
  );
  botao(t1!, "Informar documento")!.click();
  await tique();
  const fd = a.doc.querySelector(".prj-form-documento") as HTMLElement;
  digitar(fd.querySelector("input[name='documento']"), "1240001");
  digitar(fd.querySelector("input[name='concluida']"), "2026-10-05");
  botao(fd, "Salvar")!.click();
  await tique(80);
  const conc = await a.un.obterEtapa(a.ids.a);
  checar("documento e data informados", conc?.documento?.numero === "1240001" && conc.concluidaEm === "2026-10-05");
  (a.raiz.querySelector(`.prj-lin[data-id='${a.ids.b}']`) as HTMLElement).click();
  botao(a.doc.querySelector(".prj-balao")!, "Concluir etapa")!.click();
  await tique(80);
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar("desfazer reabre", (await a.un.obterEtapa(a.ids.b))?.concluidaEm === undefined);

  secao("app: adicionar etapa pela ultima linha");
  const campoNovo = () => a.raiz.querySelector<HTMLInputElement>(".prj-lin-nova input");
  const longo = "x".repeat(201);
  campoNovo()!.value = longo;
  tecla(campoNovo()!, "Enter");
  await tique(80);
  checar(
    "nome recusado pelo repositorio: o texto fica no campo e o aviso explica",
    campoNovo()?.value === longo && textoDoAviso(a.doc) === "O nome pode ter até 200 caracteres.",
    campoNovo()?.value.length,
  );
  const nova = campoNovo()!;
  nova.value = "Parecer";
  tecla(nova, "Enter");
  await tique(80);
  const criada = (await a.un.dados()).etapas.find((e) => e.nome === "Parecer");
  checar("cria depois da ultima etapa com 5 dias uteis", criada?.inicio === "2026-10-13" && criada.fim === "2026-10-19", criada);
  checar("aceita: o campo fica vazio para a proxima", campoNovo()?.value === "");

  secao("app: arrastar no Gantt");
  const op = a.g.opcoes()!;
  checar(
    "recusa antes de gravar: dependente antes da predecessora",
    op.validar?.([{ id: a.ids.b, inicio: "2026-08-01", fim: "2026-08-05" }]) ===
      "“Análise” não pode começar antes de “Nota técnica”, da qual depende.",
  );
  op.aoMudarDatas?.([{ id: a.ids.a, inicio: "2026-09-08", fim: "2026-10-09" }]);
  await tique(80);
  checar("grava e leva a dependente junto (mover dependentes)", (await a.un.obterEtapa(a.ids.b))?.inicio === "2026-10-12");

  secao("app: filtro e alertas");
  a.raiz.querySelector<HTMLButtonElement>(".prj-filtro")!.click();
  botao(a.doc.querySelector(".prj-filtro-pop")!, "Concluídas")!.click();
  await tique();
  checar(
    "filtro tira as concluidas e o popover segue aberto",
    !a.raiz.querySelector(`.prj-lin[data-id='${a.ids.a}']`) &&
      !!a.doc.querySelector(".prj-filtro-pop") &&
      texto(a.raiz.querySelector(".prj-filtro")) === "Filtro · 1",
  );
  checar("filtro gravado nas preferencias", (await lerPreferencias(a.area)).filtro.mostrarConcluidas === false);
  a.app.aplicarAlerta("semana");
  await tique();
  checar(
    "pilula 'vence nesta semana': Todos filtrado (nenhum vence)",
    a.app.aberto === "todos" && texto(a.raiz.querySelector(".prj-nada p")) === "Nenhum projeto com etapas nesse filtro.",
  );
  botao(a.raiz.querySelector(".prj-nada")!, "Limpar filtro")!.click();
  await a.un.criarEtapa({ projeto: a.ids.p, nome: "Atrasada", inicio: "2026-09-01", fim: "2026-09-30" });
  await tique(80);
  a.app.aplicarAlerta("atrasadas");
  await tique();
  checar(
    "pilula 'atrasadas': um projeto so, abre ele filtrado",
    a.app.aberto === a.ids.p &&
      (a.g.a.linhas.at(-1) ?? [])
        .filter((l) => l.tipo === "etapa")
        .map((l) => (l as LinhaEtapa).etapa.nome)
        .join() === "Atrasada",
  );

  await tique();
  const gravadas = await lerPreferencias(a.area);
  checar(
    "varias preferencias seguidas, todas gravadas (fila)",
    gravadas.filtro.situacoes.join() === "atrasadas" && gravadas.abertos["sei.x.gov.br|ana|u:110"] === a.ids.p,
  );

  secao("app: menu ajustes, CSV e impressao");
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Mostrar lista de etapas");
  await tique();
  checar("esconder a lista", !a.raiz.querySelector(".prj-lista") && (await lerPreferencias(a.area)).mostrarLista === false);
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Exportar planilha (CSV)");
  // A planilha espera a leitura da memória do sigilo (revisão final da P4, item 5).
  await tique();
  checar(
    "baixa o CSV da aba aberta com o filtro",
    a.t.baixados[0]?.nome.startsWith("projeto-img-src-x-onerror") === true &&
      a.t.baixados[0]?.conteudo.includes("Atrasada") &&
      !a.t.baixados[0]?.conteudo.includes("Parecer"),
  );
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Imprimir / salvar PDF");
  checar(
    "imprimir manda os parametros da aba",
    a.t.impressos[0]?.projeto === a.ids.p && a.t.impressos[0]?.escala === "Semana" && a.t.impressos[0]?.unidade === "110",
  );

  secao("app: excluir etapa e projeto com desfazer");
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Mostrar lista de etapas");
  await tique();
  const linhaAt = [...a.raiz.querySelectorAll<HTMLElement>(".prj-lin-etapa")].find((l) => texto(l) === "Atrasada")!;
  linhaAt.click();
  itemDoMenu(a.doc.querySelector(".prj-balao")!, "Mais ações da etapa", "Excluir");
  await tique(80);
  checar("etapa excluida com aviso", texto(aviso(a.doc)?.querySelector("span")) === "Etapa “Atrasada” excluída.");
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar(
    "desfazer devolve a etapa",
    (await a.un.dados()).etapas.some((e) => e.nome === "Atrasada"),
  );
  botao(a.raiz, "Editar projeto")!.click();
  itemDoMenu(a.doc.querySelector(".prj-form-projeto")!, "Mais ações do projeto", "Excluir");
  await tique(80);
  checar(
    "confirma antes de excluir o projeto",
    a.t.confirmacoes.at(-1)?.startsWith(`Excluir o projeto “${HOSTIL}” e `) === true && !(await a.un.obterProjeto(a.ids.p)),
  );
  botao(aviso(a.doc)!, "Desfazer")!.click();
  await tique(80);
  checar("desfazer devolve o projeto", !!(await a.un.obterProjeto(a.ids.p)));

  secao("app: mudar quem ve e arquivar");
  a.app.focarProjeto(a.ids.p, a.ids.b);
  checar(
    "abrir no painel: projeto e balao da etapa",
    a.app.aberto === a.ids.p && texto(a.doc.querySelector(".prj-balao h3")) === "Análise",
  );
  a.app.focarProjeto(a.ids.q);
  await tique();
  botao(a.raiz, "Editar projeto")!.click();
  marcar(a.doc.querySelector(".prj-form-projeto input[value='unidade']"));
  botao(a.doc.querySelector(".prj-form-projeto")!, "Salvar")!.click();
  await tique(80);
  checar(
    "Só eu → Toda a unidade, com confirmacao",
    a.t.confirmacoes.at(-1)?.includes("toda a unidade (TESTE)") === true &&
      !!(await a.un.obterProjeto(a.ids.q)) &&
      !(await a.eu.obterProjeto(a.ids.q)),
  );
  botao(a.raiz, "Editar projeto")!.click();
  itemDoMenu(a.doc.querySelector(".prj-form-projeto")!, "Mais ações do projeto", "Arquivar");
  await tique(80);
  checar(
    "arquivado sai das abas e volta ao Todos",
    a.app.aberto === "todos" && ![...a.raiz.querySelectorAll("[role='tab']")].some((x) => texto(x).startsWith("Plano 2027")),
  );
  itemDoMenu(a.raiz, "Ajustes dos projetos", "Projetos arquivados");
  botao(a.doc.querySelector(".prj-arquivados")!, "Reativar")!.click();
  await tique(80);
  checar(
    "reativar pelos arquivados",
    [...a.raiz.querySelectorAll("[role='tab']")].some((x) => texto(x).startsWith("Plano 2027")),
  );
  checar("nome hostil em abas, cabecalho, avisos e dialogos: nunca vira elemento", !a.doc.querySelector("img"));
  a.app.destruir();

  secao("app: falha da Frappe e sincronia");
  let avisarSinc: () => void = () => undefined;
  let estado = { rotulo: "pendente", dica: "Falta enviar", tom: "pendente" as const };
  const s = await montar({
    falharGantt: true,
    sincronia: {
      estado: () => estado,
      aoMudar: (cb) => {
        avisarSinc = cb;
        return () => undefined;
      },
    },
  });
  await tique();
  checar(
    "sem Gantt: cai para a lista com aviso",
    !!s.raiz.querySelector(".prj-tabela") &&
      texto(aviso(s.doc)?.querySelector("span")) === "O Gantt não abriu neste navegador; mostrando a lista.",
  );
  checar("estado do provedor ao lado das abas", texto(s.raiz.querySelector(".prj-sinc")) === "pendente");
  estado = { rotulo: "sincronizado", dica: "ok", tom: "pendente" };
  avisarSinc();
  checar("redesenha quando o estado muda", texto(s.raiz.querySelector(".prj-sinc")) === "sincronizado");
  checar("nome hostil nunca vira elemento", !s.raiz.querySelector("img") && !s.doc.querySelector("img"));
  const montagensNaFalha = s.g.a.montagens;
  aviso(s.doc)?.remove();
  abrirAba(s, s.ids.p);
  await s.un.criarEtapa({ projeto: s.ids.p, nome: "Depois da falha", inicio: "2026-10-13", fim: "2026-10-14" });
  await tique(80);
  s.app.aoRedimensionar();
  await tique();
  checar(
    "depois da falha nada remonta a Frappe: abas, gravacoes e redesenhos ficam na lista",
    s.g.a.montagens === montagensNaFalha && s.raiz.querySelectorAll(".prj-tabela tr.prj-tab-linha").length === 3 && !aviso(s.doc),
    s.g.a.montagens,
  );
  botao(s.raiz, "Gantt")!.click();
  await tique();
  checar(
    "escolher Gantt de novo tenta uma vez e volta para a lista com o aviso",
    s.g.a.montagens === montagensNaFalha + 1 &&
      !!s.raiz.querySelector(".prj-tabela") &&
      textoDoAviso(s.doc) === "O Gantt não abriu neste navegador; mostrando a lista.",
    s.g.a.montagens,
  );
  s.app.destruir();

  secao("app: sem provedor de sincronia e menu do P3");
  const z = await montar();
  checar(
    "sem provedor: 'neste navegador', com a dica",
    texto(z.raiz.querySelector(".prj-sinc")) === "neste navegador" &&
      z.raiz.querySelector(".prj-sinc")?.getAttribute("title") === "Os projetos ficam guardados neste navegador.",
  );
  const itens = itensDoMenu(z.raiz, "Ajustes dos projetos");
  checar(
    "menu ajustes sem itens do P4 nem 'arquivados' vazio",
    itens.join("|") ===
      "Mostrar lista de etapas|Mover dependentes ao arrastar|Ordenar etapas|Exportar planilha (CSV)|Imprimir / salvar PDF",
    itens,
  );
  z.app.destruir();

  secao("app: vista reaproveitada, Lista com as fases abertas e virada do dia");
  let dia: DataISO = HOJE;
  const r = await montar({ hoje: () => dia, conferirDiaMs: 20 });
  abrirAba(r, r.ids.p);
  await tique();
  const m1 = r.g.a.montagens;
  await r.un.editarEtapa(r.ids.a, { nome: "Nota técnica revista" }, HOJE);
  await tique(80);
  checar(
    "gravacao redesenha sem remontar a Frappe",
    r.g.a.montagens === m1 && etapasDoGantt(r).some((l) => l.etapa.nome === "Nota técnica revista"),
  );
  (r.raiz.querySelector(".prj-lin-fase") as HTMLElement | null)?.click();
  await tique();
  checar("fase recolhida sai do Gantt", etapasDoGantt(r).length === 0 && r.g.a.montagens === m1);
  botao(r.raiz, "Lista")!.click();
  await tique();
  checar(
    "vista Lista mostra as etapas da fase recolhida",
    r.raiz.querySelectorAll(".prj-tabela tr.prj-tab-linha").length === 2 && !!r.raiz.querySelector(`tr[data-id='${r.ids.b}']`),
  );
  botao(r.raiz, "Gantt")!.click();
  await tique();
  const m2 = r.g.a.montagens;
  const destruidos = r.g.a.destruidos;
  dia = "2026-10-07";
  await tique(100);
  checar(
    "virada do dia: destroi e remonta a Frappe com o dia novo",
    r.g.a.montagens === m2 + 1 && r.g.a.destruidos === destruidos + 1 && r.g.opcoes()?.hoje === "2026-10-07",
    { montagens: r.g.a.montagens, m2 },
  );
  const m3 = r.g.a.montagens;
  await tique(60);
  checar("sem outra virada, nao remonta de novo", r.g.a.montagens === m3);
  r.app.destruir();

  secao("app: arrastar recusa so o que o repositorio recusaria");
  const d = await montar();
  abrirAba(d, d.ids.p);
  const minuta = await d.un.criarEtapa({
    projeto: d.ids.p,
    nome: "Minuta",
    inicio: "2026-10-01",
    fim: "2026-10-02",
    dependeDe: [d.ids.b],
  });
  await tique(80);
  const opd = d.g.opcoes()!;
  checar(
    "violacao que ja existia nao trava o arraste (violacoesNovas)",
    opd.validar?.([{ id: minuta.id, inicio: "2026-10-02", fim: "2026-10-05" }]) === null,
  );
  checar(
    "data fora de 2000 a 2100 e recusada antes de gravar",
    opd.validar?.([{ id: d.ids.a, inicio: "1999-12-01", fim: "1999-12-03" }]) === "“Nota técnica” só pode ter datas entre 2000 e 2100.",
  );
  const solta = await d.un.criarEtapa({ projeto: d.ids.p, nome: "Revisão", inicio: "2026-10-13", fim: "2026-10-14" });
  const publicacao = await d.un.criarEtapa({
    projeto: d.ids.p,
    nome: "Publicação",
    fase: d.ids.f,
    inicio: "2026-10-15",
    fim: "2026-10-16",
    dependeDe: [solta.id],
  });
  await tique(80);
  (d.raiz.querySelector(".prj-lin-fase") as HTMLElement | null)?.click();
  await tique();
  const mover = [{ id: solta.id, inicio: "2026-10-20", fim: "2026-10-21" }];
  checar(
    "dependente escondida (fase recolhida) entra na conta: aceita",
    !etapasDoGantt(d).some((l) => l.id === publicacao.id) && opd.validar?.(mover) === null,
  );
  opd.aoMudarDatas?.(mover);
  await tique(80);
  checar("e anda junto ao gravar", (await d.un.obterEtapa(publicacao.id))?.inicio === "2026-10-22");
  const moverDatas = d.un.moverDatas.bind(d.un);
  d.un.moverDatas = async () => {
    throw new ErroValidacao(["Não foi possível gravar agora."]);
  };
  const antesDaFalha = { linhas: d.g.a.linhas.length, montagens: d.g.a.montagens };
  opd.aoMudarDatas?.([{ id: solta.id, inicio: "2026-10-27", fim: "2026-10-28" }]);
  await tique(80);
  checar(
    "gravar falhou: aviso e o Gantt volta as datas gravadas (atualizar, sem remontar)",
    textoDoAviso(d.doc) === "Não foi possível gravar agora." &&
      d.g.a.linhas.length === antesDaFalha.linhas + 1 &&
      d.g.a.montagens === antesDaFalha.montagens &&
      etapasDoGantt(d).find((l) => l.id === solta.id)?.etapa.inicio === "2026-10-20",
  );
  d.un.moverDatas = moverDatas;
  d.app.destruir();

  secao("app: dialogo da etapa apaga o que foi tirado");
  const e = await montar();
  const tudo = await e.un.criarEtapa({
    projeto: e.ids.p,
    nome: "Com tudo",
    inicio: "2026-10-13",
    fim: "2026-10-16",
    responsavel: { nome: "Carla Dias" },
    processo: { protocolo: "50300.000777/2026-01" },
    documento: { numero: "1234567" },
    observacoes: "anotar",
  });
  abrirAba(e, e.ids.p);
  await tique(80);
  const editar = async (id: string) => {
    clicarLinha(e, id);
    botao(balao(e) ?? e.doc.body, "Editar")?.click();
    await tique();
    return e.doc.querySelector<HTMLElement>(".prj-form-etapa");
  };
  const fe = await editar(tudo.id);
  escolherCombo(fe!, "Responsável", "");
  escolherCombo(fe!, "Processo da etapa", "");
  digitar(fe!.querySelector("input[name='documento']"), "");
  digitar(fe!.querySelector("textarea"), "");
  botao(fe!, "Salvar")!.click();
  await tique(80);
  const limpa = await e.un.obterEtapa(tudo.id);
  checar(
    "tirar responsavel, processo, documento e observacoes grava sem eles",
    !!limpa &&
      limpa.nome === "Com tudo" &&
      !limpa.responsavel &&
      !limpa.processo &&
      !limpa.documento &&
      !limpa.observacoes &&
      !e.doc.querySelector(".prj-form-etapa"),
    limpa,
  );
  const etapaA = (await e.un.obterEtapa(e.ids.a))!;
  await e.un.etapas.gravar(etapaA.id, { ...etapaA, fase: "fase-morta" });
  await tique(80);
  botao((await editar(e.ids.a))!, "Salvar")!.click();
  await tique(80);
  checar("fase removida: a tela mostra sem fase e salvar grava sem ela", (await e.un.obterEtapa(e.ids.a))?.fase === undefined);
  await e.un.removerEtapa(e.ids.a);
  await tique(80);
  botao((await editar(e.ids.b))!, "Salvar")!.click();
  await tique(80);
  await e.un.restaurarEtapa(e.ids.a);
  checar(
    "dependencia de etapa excluida sobrevive a salvar (volta a valer ao restaurar)",
    (await e.un.obterEtapa(e.ids.b))?.dependeDe.join() === e.ids.a,
  );
  await tique(80);
  botao((await editar(tudo.id))!, "Excluir")!.click();
  await tique(80);
  checar(
    "excluir pelo dialogo: fecha e avisa com Desfazer",
    !e.doc.querySelector(".prj-form-etapa") && textoDoAviso(e.doc) === "Etapa “Com tudo” excluída." && !(await e.un.obterEtapa(tudo.id)),
  );
  botao(aviso(e.doc)!, "Desfazer")!.click();
  await tique(80);
  checar("e o Desfazer devolve a etapa", !!(await e.un.obterEtapa(tudo.id)));
  e.app.destruir();

  secao("app: concluir nunca conclui de novo");
  const k = await montar();
  abrirAba(k, k.ids.p);
  await tique();
  clicarLinha(k, k.ids.b);
  await k.un.concluirEtapa(k.ids.b, "2026-10-01");
  checar(
    "o balao aberto antes ainda oferece Concluir (a prova nao passa no vazio)",
    !!botao(balao(k) ?? k.doc.createElement("div"), "Concluir etapa"),
  );
  botao(balao(k) ?? k.doc.body, "Concluir etapa")?.click();
  await tique(80);
  checar(
    "ja concluida em outro lugar: a data fica e nao ha aviso",
    (await k.un.obterEtapa(k.ids.b))?.concluidaEm === "2026-10-01" && !aviso(k.doc),
  );
  clicarLinha(k, k.ids.a);
  checar("balao da etapa A com Concluir", !!botao(balao(k) ?? k.doc.createElement("div"), "Concluir etapa"));
  botao(balao(k) ?? k.doc.body, "Concluir etapa")?.click();
  await tique(80);
  await k.un.concluirEtapa(k.ids.a, "2026-10-02");
  checar("o aviso da conclusao com Desfazer", !!botao(aviso(k.doc) ?? k.doc.createElement("div"), "Desfazer"));
  botao(aviso(k.doc) ?? k.doc.body, "Desfazer")?.click();
  await tique(80);
  checar("Desfazer nao reabre a conclusao que ja nao e a de hoje", (await k.un.obterEtapa(k.ids.a))?.concluidaEm === "2026-10-02");
  const revisao = await k.un.criarEtapa({ projeto: k.ids.p, nome: "Revisão", inicio: "2026-10-13", fim: "2026-10-14" });
  await tique(80);
  clicarLinha(k, revisao.id);
  checar("balao da Revisao com Concluir", !!botao(balao(k) ?? k.doc.createElement("div"), "Concluir etapa"));
  botao(balao(k) ?? k.doc.body, "Concluir etapa")?.click();
  await tique(80);
  await k.un.reabrirEtapa(revisao.id);
  checar("o aviso da conclusao com Informar documento", !!botao(aviso(k.doc) ?? k.doc.createElement("div"), "Informar documento"));
  botao(aviso(k.doc) ?? k.doc.body, "Informar documento")?.click();
  await tique(80);
  checar(
    "informar documento de etapa ja reaberta: nao abre nem conclui de novo",
    !k.doc.querySelector(".prj-form-documento") &&
      (await k.un.obterEtapa(revisao.id))?.concluidaEm === undefined &&
      textoDoAviso(k.doc) === "“Revisão” não está mais concluída.",
  );
  k.app.destruir();

  secao("app: excluir, arquivar, duplicar e salvar como modelo");
  const x = await montar();
  abrirAba(x, x.ids.p);
  await tique();
  x.t.confirmar = false;
  botao(x.raiz, "Editar projeto")!.click();
  itemDoMenu(formProjeto(x)!, "Mais ações do projeto", "Excluir");
  await tique(80);
  checar("desistir de excluir: o projeto fica e o dialogo segue aberto", !!(await x.un.obterProjeto(x.ids.p)) && !!formProjeto(x));
  fecharFormProjeto(x);
  x.t.confirmar = true;
  x.app.focarProjeto(x.ids.q);
  await tique();
  botao(x.raiz, "Editar projeto")!.click();
  itemDoMenu(formProjeto(x)!, "Mais ações do projeto", "Arquivar");
  await tique(80);
  checar(
    "arquivar avisa com Desfazer",
    textoDoAviso(x.doc) === "Projeto “Plano 2027” arquivado." && !!botao(aviso(x.doc)!, "Desfazer") && !formProjeto(x),
  );
  x.t.confirmar = false;
  itemDoMenu(x.raiz, "Ajustes dos projetos", "Projetos arquivados");
  const arquivados = () => x.doc.querySelector<HTMLElement>(".prj-arquivados");
  botao(arquivados() ?? x.doc.body, "Excluir")?.click();
  await tique(80);
  checar(
    "excluir dos arquivados pede confirmacao; desistir deixa na lista",
    x.t.confirmacoes.at(-1) === "Excluir o projeto “Plano 2027”?" &&
      !!(await x.eu.obterProjeto(x.ids.q)) &&
      texto(arquivados()).includes("Plano 2027"),
  );
  x.t.confirmar = true;
  botao(arquivados() ?? x.doc.body, "Excluir")?.click();
  await tique(80);
  checar(
    "confirmado: exclui, sai da lista e oferece Desfazer",
    !(await x.eu.obterProjeto(x.ids.q)) &&
      texto(arquivados()) === "Nenhum projeto arquivado." &&
      textoDoAviso(x.doc) === "Projeto “Plano 2027” excluído.",
  );
  botao(aviso(x.doc) ?? x.doc.body, "Desfazer")?.click();
  await tique(80);
  checar("Desfazer devolve o projeto, ainda arquivado", (await x.eu.obterProjeto(x.ids.q))?.arquivadoEm !== undefined);
  x.app.focarProjeto(x.ids.p);
  await tique();
  botao(x.raiz, "Editar projeto")!.click();
  itemDoMenu(formProjeto(x)!, "Mais ações do projeto", "Duplicar");
  await tique(80);
  const copia = (await x.un.dados()).projetos.find((p) => p.nome === `Cópia de ${HOSTIL}`);
  checar(
    "duplicar cria a copia com as etapas e abre",
    !!copia && x.app.aberto === copia.id && (await x.un.dados()).etapas.filter((y) => y.projeto === copia.id).length === 2,
  );
  botao(x.raiz, "Editar projeto")!.click();
  itemDoMenu(formProjeto(x)!, "Mais ações do projeto", "Salvar como modelo…");
  digitar(x.doc.querySelector(".prj-form-modelo input"), "Meu modelo");
  botao(x.doc.querySelector(".prj-form-modelo")!, "Salvar modelo")!.click();
  await tique(80);
  checar(
    "salvar como modelo grava e avisa",
    (await x.un.dados()).modelos.some((m) => m.nome === "Meu modelo") && textoDoAviso(x.doc) === "Modelo “Meu modelo” salvo.",
  );
  fecharFormProjeto(x);

  secao("app: Quem vê (Toda a unidade → Só eu) com aviso do impacto");
  x.app.focarProjeto(x.ids.p);
  await tique();
  botao(x.raiz, "Editar projeto")!.click();
  digitar(formProjeto(x)!.querySelector("input[name='nome']"), "Renomeado");
  marcar(formProjeto(x)!.querySelector("input[value='eu']"));
  x.t.confirmar = false;
  botao(formProjeto(x)!, "Salvar")!.click();
  await tique(80);
  checar(
    "desistir: nada grava e o dialogo fica aberto",
    x.t.confirmacoes.at(-1) ===
      "“Renomeado” vai sair de “Toda a unidade” e ficar só para você, nesta unidade: quem usa o SEI Pro na TESTE deixa de ver." &&
      (await x.un.obterProjeto(x.ids.p))?.nome === HOSTIL &&
      !!formProjeto(x),
    x.t.confirmacoes.at(-1),
  );
  x.t.confirmar = true;
  botao(formProjeto(x) ?? x.doc.body, "Salvar")?.click();
  await tique(80);
  checar(
    "confirmado: renomeia, leva fases e etapas para Só eu e segue aberto",
    (await x.eu.obterProjeto(x.ids.p))?.nome === "Renomeado" &&
      (await x.eu.dados()).etapas.filter((y) => y.projeto === x.ids.p).length === 2 &&
      !(await x.un.obterProjeto(x.ids.p)) &&
      x.app.aberto === x.ids.p,
  );
  x.app.destruir();

  secao("app: abrir no painel, escala so leitura e preferencias de outras abas");
  const f = await montar();
  abrirAba(f, f.ids.p);
  await tique();
  (f.raiz.querySelector(".prj-lin-fase") as HTMLElement | null)?.click();
  itemDoMenu(f.raiz, "Ajustes dos projetos", "Mostrar lista de etapas");
  await tique();
  f.app.focarProjeto(f.ids.p, f.ids.b);
  checar(
    "etapa em fase recolhida e sem a lista: abre a fase e o balao",
    etapasDoGantt(f).some((l) => l.id === f.ids.b) && texto(f.doc.querySelector(".prj-balao h3")) === "Análise",
  );
  botao(f.raiz, "Mês")!.click();
  await tique();
  checar(
    "Mes: aviso de so leitura e escala lembrada no projeto",
    textoDoAviso(f.doc) === "Nesta escala as datas ficam só para leitura: arraste em Dia ou Semana." &&
      (await lerPreferencias(f.area)).escalas[f.ids.p] === "Mês",
  );
  await gravarPreferencias(f.area, { abertos: { "sei.x.gov.br|ana|u:999": "outro" }, recolhido: true });
  abrirAba(f, "todos");
  await tique();
  const pf = await lerPreferencias(f.area);
  checar(
    "outra unidade (outra aba) e o 'recolhido' do content script nao se perdem",
    pf.abertos["sei.x.gov.br|ana|u:999"] === "outro" &&
      pf.abertos["sei.x.gov.br|ana|u:110"] === "todos" &&
      pf.recolhido &&
      pf.escalas[f.ids.p] === "Mês",
    pf,
  );
  checar("o botao Lista esta na tela", !!botao(f.raiz, "Lista"));
  botao(f.raiz, "Lista")?.click();
  await tique();
  checar("a vista Lista ficou (a pilula volta ao Gantt a partir dela)", !!botao(f.raiz, "Lista")?.matches("[aria-pressed='true']"));
  f.app.aplicarAlerta("atrasadas");
  await tique();
  checar(
    "pilula vista da Lista: volta ao Gantt na tela e no que fica gravado",
    !!botao(f.raiz, "Gantt")?.matches("[aria-pressed='true']") && (await lerPreferencias(f.area)).vista === "gantt",
  );
  f.app.destruir();

  secao("app: redimensionar nao fecha o balao nem o filtro");
  let larguraDaJanela = 1000;
  const rz = await montar({ largura: () => larguraDaJanela });
  abrirAba(rz, rz.ids.p);
  await tique();
  const abaDoProjeto = () => rz.raiz.querySelector(`[role='tab'][data-aba='${rz.ids.p}']`);
  const abaAntes = abaDoProjeto();
  clicarLinha(rz, rz.ids.a);
  rz.app.aoRedimensionar();
  await tique();
  checar("mesma largura: o balao segue aberto e as abas nao sao refeitas", !!balao(rz) && !!abaAntes && abaDoProjeto() === abaAntes);
  botao(balao(rz) ?? rz.doc.body, "Fechar")?.click();
  rz.raiz.querySelector<HTMLButtonElement>(".prj-filtro")?.click();
  rz.app.aoRedimensionar();
  await tique();
  checar("mesma largura: o popover do filtro segue aberto", !!rz.doc.querySelector(".prj-filtro-pop"));
  rz.raiz.querySelector<HTMLButtonElement>(".prj-filtro")?.click();
  clicarLinha(rz, rz.ids.a);
  const cabecalhoAntes = rz.raiz.querySelector(".prj-cab");
  larguraDaJanela = 500;
  rz.app.aoRedimensionar();
  await tique();
  checar(
    "largura que muda quantas abas cabem: refaz so as abas, o balao fica",
    !!rz.raiz.querySelector(".prj-aba-mais") &&
      texto(balao(rz)?.querySelector("h3")) === "Nota técnica" &&
      rz.raiz.querySelector(".prj-cab") === cabecalhoAntes,
  );
  rz.app.destruir();

  secao("app: fechado antes de terminar de abrir");
  const w = await montar({ semIniciar: true });
  const abrindo = w.app.iniciar();
  w.app.destruir();
  await abrindo;
  await w.un.criarEtapa({ projeto: w.ids.p, nome: "Depois de fechar", inicio: "2026-10-13", fim: "2026-10-14" });
  await tique(80);
  checar("nada desenha nem fica ouvindo", !w.raiz.firstChild && w.g.a.montagens === 0);
}

export async function verificarAlturaDaListaDoProjeto(): Promise<void> {
  secao("app: vista Lista com altura limitada e alca (painel embutido)");
  const r = await montar();
  abrirAba(r, r.ids.p);
  await tique();
  botao(r.raiz, "Lista")!.click();
  await tique();
  const rolagem = r.raiz.querySelector<HTMLElement>(".prj-tabela-rolagem");
  const alca = r.raiz.querySelector<HTMLElement>(".prj-tabela-lugar > .spro-altura-alca");
  checar(
    "a tabela de etapas rola por dentro, com 520 px de altura maxima",
    !!rolagem?.classList.contains("spro-altura-rolagem") &&
      rolagem.style.getPropertyValue("--spro-altura-max") === "520px" &&
      !!rolagem.querySelector(".prj-tabela"),
  );
  checar(
    "a alca esta no fim, acessivel",
    !!alca && rolagem?.nextElementSibling === alca && alca.getAttribute("role") === "separator" && alca.getAttribute("tabindex") === "0",
  );
  disparar(alca!, "dblclick");
  await tique();
  checar(
    "duplo clique ajusta ao conteudo e grava (uma preferencia para as duas listas)",
    rolagem?.getAttribute("data-altura") === "auto" &&
      JSON.stringify((await r.area.obter("spro_altura:projetos-lista"))["spro_altura:projetos-lista"]) ===
        JSON.stringify({ auto: true, px: null }),
  );
  // A lista de projetos do "Todos" usa a mesma escolha.
  abrirAba(r, "todos");
  await tique();
  checar(
    "a lista de projetos do Todos tambem, com o modo escolhido",
    r.raiz.querySelector(".prj-tabela-rolagem")?.getAttribute("data-altura") === "auto" &&
      !!r.raiz.querySelector(".prj-tabela-lugar > .spro-altura-alca"),
  );
  r.app.destruir();
}
