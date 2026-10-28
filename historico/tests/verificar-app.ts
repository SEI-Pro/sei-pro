import { type Area, areaMemoria } from "@comum/armazenamento/area";
import { gerarCsv } from "@comum/csv";
import { type AbrirModal, AppHistorico, type DepsApp, type FavoritosDoApp } from "../src/app/app";
import { chaveEscopo } from "../src/modelo/constantes";
import { linhasCsv } from "../src/modelo/csv";
import type { ContextoHistorico, MetaHistorico, Visita } from "../src/modelo/tipos";
import { gravarPreferencias, lerPreferencias } from "../src/preferencias";
import { RepositorioHistorico } from "../src/repositorio";
import { botao, checar, disparar, escolherCombo, instalarDom, itemDoMenu, opcoesDoCombo, secao, tique } from "./util";

const MIN = 60_000;
const DIA = 86_400_000;
const AGORA = new Date(2026, 9, 2, 15, 0).getTime();
const MENU = "Mais ações do histórico";

const CTX: ContextoHistorico = {
  host: "sei.antaq.gov.br",
  login: "pedro.soares",
  nome: "Pedro Soares",
  unidade: { id: "110000001", sigla: "GPF", nome: "Gerência de Fiscalização" },
  versao: "4.1.5",
  temaEscuro: false,
  favoritosAtivo: false,
  lateralDisponivel: true,
};

const visita = (x: Partial<Visita> & { id: string }): Visita => ({
  protocolo: `50300.00000${x.id}/2026-0${x.id}`,
  unidades: [{ id: "u1", sigla: "GPF" }],
  primeira: AGORA - 60 * DIA,
  ultima: AGORA - 10 * MIN,
  vezes: 1,
  ...x,
});

// Recentes: 1 (há 10 min), 2 (há 2 h), 3 (ontem), 4 (3 dias), 5 (40 dias). Mais visitados: 4, 1, 2, 3, 5.
const CINCO: Visita[] = [
  visita({ id: "1", tipo: "Contrato", especificacao: "Porto de Santos", ultima: AGORA - 10 * MIN, vezes: 3 }),
  visita({ id: "2", tipo: "Licitação", especificacao: "Pregão eletrônico", ultima: AGORA - 120 * MIN }),
  visita({ id: "3", tipo: "Contrato", especificacao: "Dragagem do canal", ultima: AGORA - DIA }),
  visita({ id: "4", tipo: "Fiscalização", especificacao: "Auto de infração", ultima: AGORA - 3 * DIA, vezes: 5, nivel: "restrito" }),
  visita({ id: "5", tipo: "Licitação", especificacao: "Concorrência", ultima: AGORA - 40 * DIA }),
];

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
function tecla(el: Element, key: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  el.dispatchEvent(ev);
}

/** Clique com Ctrl (abrir em outra aba). */
function cliqueCtrl(el: Element): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("click", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "ctrlKey", { value: true });
  el.dispatchEvent(ev);
}

/** Marca uma opção (rádio ou caixa) como o navegador faz: o linkedom não reflete o atributo. */
function marcar(el: Element | null | undefined): void {
  if (!el) throw new Error("campo não encontrado");
  (el as HTMLInputElement).checked = true;
  disparar(el, "change");
}

/** Avisos do console durante `fazer` (sem sujar a saída das provas). */
async function avisosDoConsole(fazer: () => Promise<unknown>): Promise<string[]> {
  const original = console.warn;
  const avisos: string[] = [];
  console.warn = (...a: unknown[]) => {
    avisos.push(a.map(String).join(" "));
  };
  try {
    await fazer();
  } finally {
    console.warn = original;
  }
  return avisos;
}

/** `falharNa`: a n-ésima chamada de favoritar rejeita; `idsFalham`: a leitura dos ids rejeita. */
function favoritosFalsos(inicial: string[], o: { falharNa?: number; idsFalham?: boolean } = {}) {
  const ids = new Set(inicial);
  const ouvintes = new Set<() => void>();
  const log: string[] = [];
  let chamadas = 0;
  const mudou = () => {
    for (const o of [...ouvintes]) o();
  };
  const f: FavoritosDoApp = {
    ids: async () => {
      if (o.idsFalham) throw new Error("monitorados ilegíveis");
      return new Set(ids);
    },
    favoritar: async (v) => {
      chamadas += 1;
      if (chamadas === o.falharNa) throw new Error("Lista cheia");
      ids.add(v.id);
      log.push(`fav:${v.id}`);
      mudou();
      return {
        lista: "GPF",
        desfazer: async () => {
          ids.delete(v.id);
          log.push(`desfaz:${v.id}`);
          mudou();
        },
      };
    },
    tirar: async (id) => {
      if (!ids.has(id)) return null;
      ids.delete(id);
      log.push(`tirar:${id}`);
      mudou();
      return {
        desfazer: async () => {
          ids.add(id);
          log.push(`volta:${id}`);
          mudou();
        },
      };
    },
    aoMudar: (cb) => {
      ouvintes.add(cb);
      return () => {
        ouvintes.delete(cb);
      };
    },
  };
  return { f, ids, log, ouvintes: () => ouvintes.size };
}

interface OpcoesMontar {
  visitas?: Visita[];
  meta?: Partial<MetaHistorico>;
  lateral?: boolean;
  html?: string;
  /** Outro contexto (o painel com o histórico desligado monta com host e login vazios). */
  ctx?: ContextoHistorico;
}

async function montar(extra: Partial<DepsApp> = {}, o: OpcoesMontar = {}) {
  const doc = instalarDom(o.html ?? '<html><body><div id="app"></div></body></html>');
  // A área conta os ouvintes ligados: destruir tem de desligar todos os do app.
  const base = areaMemoria();
  let ouvintes = 0;
  const area: Area = {
    ...base,
    aoMudar(cb) {
      ouvintes += 1;
      const parar = base.aoMudar(cb);
      let ligado = true;
      return () => {
        if (ligado) ouvintes -= 1;
        ligado = false;
        parar();
      };
    },
  };
  const ctx = o.ctx ?? CTX;
  const repo = new RepositorioHistorico(area, chaveEscopo(ctx.host, ctx.login));
  await repo.importar(o.visitas ?? CINCO);
  if (o.meta) await repo.gravarMeta(o.meta);
  const chamadas: Array<[string, unknown]> = [];
  const modais: Array<{ titulo: string; conteudo: HTMLElement; fechado: boolean }> = [];
  const baixados: Array<{ nome: string; conteudo: string; tipo: string }> = [];
  const copiados: string[] = [];
  const confirmados: Array<[string, string | undefined]> = [];
  const t = { resposta: true, rejeitar: new Set<string>(), respostas: new Map<string, unknown>(), fechou: 0, opcoes: 0, lateral: 0 };
  const abrirModal: AbrirModal = (m) => {
    const reg = { titulo: m.titulo, conteudo: m.conteudo, fechado: false };
    modais.push(reg);
    doc.body.append(m.conteudo);
    return {
      fechar: () => {
        if (reg.fechado) return;
        reg.fechado = true;
        m.conteudo.remove();
        m.aoFechar?.();
      },
    };
  };
  const deps: DepsApp = {
    modo: "modal",
    ctx,
    area,
    repo,
    rpc: {
      chamar: (async (op: string, args?: unknown) => {
        chamadas.push([op, args]);
        if (t.rejeitar.has(op)) throw new Error(`Falhou: ${op}`);
        return t.respostas.has(op) ? t.respostas.get(op) : true;
      }) as DepsApp["rpc"]["chamar"],
    },
    favoritos: null,
    historicoLigado: async () => true,
    abrirModal,
    confirmar: async (texto, rotuloOk) => {
      confirmados.push([texto, rotuloOk]);
      return t.resposta;
    },
    baixar: (nome, conteudo, tipo) => void baixados.push({ nome, conteudo, tipo }),
    copiar: async (texto) => void copiados.push(texto),
    agora: () => AGORA,
    fechar: () => {
      t.fechou += 1;
    },
    abrirLateral: o.lateral
      ? () => {
          t.lateral += 1;
        }
      : undefined,
    abrirOpcoes: () => {
      t.opcoes += 1;
    },
    ...extra,
  };
  const raiz = doc.getElementById("app")!;
  return {
    doc,
    raiz,
    area,
    repo,
    chamadas,
    modais,
    baixados,
    copiados,
    confirmados,
    t,
    ouvintes: () => ouvintes,
    app: new AppHistorico(raiz, deps),
  };
}

const ids = (raiz: ParentNode): string => [...raiz.querySelectorAll("li.spro-lista-item")].map((li) => li.getAttribute("data-id")).join();
const noRepo = async (repo: RepositorioHistorico): Promise<string> =>
  (await repo.listar())
    .map((v) => v.id)
    .sort()
    .join();
const caixa = (raiz: ParentNode, id: string) => raiz.querySelector(`li[data-id="${id}"] input.spro-lista-sel`);
const qtdLote = (raiz: ParentNode): string | null => {
  const lugar = raiz.querySelector<HTMLElement>(".spro-lista-lote-lugar");
  return lugar && !lugar.hidden ? (lugar.querySelector(".spro-lista-lote strong")?.textContent ?? null) : null;
};
const textoAviso = (doc: Document): string => doc.body.querySelector(".spro-aviso")?.textContent ?? "";

export async function verificarApp(): Promise<void> {
  secao("historico app: foco inicial");
  // O linkedom nao implementa foco: a prova espia o focus() da busca (como a do atalho "/").
  const espiar = (raiz: HTMLElement) => {
    const busca = raiz.querySelector<HTMLInputElement>('input[aria-label="Buscar no histórico"]')!;
    const chamadas: unknown[] = [];
    busca.focus = (o?: unknown) => {
      chamadas.push(o);
    };
    return chamadas;
  };
  const foco = await montar({ focarBusca: true });
  const focoChamadas = espiar(foco.raiz);
  await foco.app.iniciar();
  checar(
    "modal (focarBusca): foca a busca sem rolar a pagina",
    focoChamadas.length === 1 && (focoChamadas[0] as { preventScroll?: boolean })?.preventScroll === true,
    focoChamadas,
  );
  const semFoco = await montar({}, { lateral: true });
  const semFocoChamadas = espiar(semFoco.raiz);
  await semFoco.app.iniciar();
  checar("lateral: o painel nao rouba o foco", semFocoChamadas.length === 0);
  secao("historico app: montagem (modal e lateral)");
  const a = await montar({}, { lateral: true });
  await a.app.iniciar();
  checar("iniciar desenha as 5 visitas, mais recente primeiro", ids(a.raiz) === "1,2,3,4,5", ids(a.raiz));
  const topo = a.raiz.querySelector("header.spro-lista-topo");
  checar("modal: titulo Historico", topo?.querySelector(".spro-lista-titulo h1")?.textContent === "Histórico");
  checar(
    "modal: total de processos no cabecalho",
    topo?.querySelector(".spro-lista-total")?.textContent === "5 processos",
    topo?.querySelector(".spro-lista-total")?.textContent,
  );
  botao(topo!, "Fechar")?.click();
  checar("modal: X chama fechar", a.t.fechou === 1);
  botao(topo!, "Abrir na barra lateral")?.click();
  checar("modal: 'Abrir na barra lateral' com abrirLateral", a.t.lateral === 1);
  checar("menu de mais acoes no cabecalho", !!topo?.querySelector(`button[aria-haspopup="menu"][aria-label="${MENU}"]`));

  secao("historico app: busca");
  const busca = a.raiz.querySelector<HTMLInputElement>('input[aria-label="Buscar no histórico"]')!;
  checar("campo de busca existe", !!busca);
  checar(
    "placeholder da busca",
    busca.getAttribute("placeholder") === "Buscar número, tipo, especificação, interessado ou assunto",
    busca.getAttribute("placeholder"),
  );
  checar("atalho anunciado", busca.getAttribute("aria-keyshortcuts") === "/");
  busca.value = "dragagem";
  disparar(busca, "input");
  await tique(40);
  checar("espera antes de filtrar", ids(a.raiz) === "1,2,3,4,5");
  await tique(200);
  checar("a busca filtra depois da espera", ids(a.raiz) === "3", ids(a.raiz));
  busca.value = "000004";
  disparar(busca, "input");
  await tique(200);
  checar("busca pelo numero", ids(a.raiz) === "4", ids(a.raiz));
  tecla(busca, "Escape");
  await tique(10);
  checar("Esc limpa a busca", busca.value === "" && ids(a.raiz) === "1,2,3,4,5", { valor: busca.value, ids: ids(a.raiz) });
  let focou = 0;
  busca.focus = () => {
    focou += 1;
  };
  tecla(a.doc.body, "/");
  checar("'/' no documento foca a busca", focou === 1);
  tecla(busca, "/");
  checar("'/' dentro de um campo nao rouba o foco", focou === 1);

  secao("historico app: seletores e vazio com filtro");
  escolherCombo(a.raiz, "Tipo", "Contrato");
  checar("filtrar por Tipo reduz a lista", ids(a.raiz) === "1,3", ids(a.raiz));
  escolherCombo(a.raiz, "Tipo", "Contrato");
  escolherCombo(a.raiz, "Tipo", "Fiscalização");
  escolherCombo(a.raiz, "Período", "hoje");
  const corpo = a.raiz.querySelector(".spro-lista-corpo")!;
  checar("filtro que zera: 'Nada com esses filtros.'", (corpo.textContent ?? "").includes("Nada com esses filtros."), corpo.textContent);
  checar("sem nenhuma linha", ids(a.raiz) === "");
  botao(corpo, "Limpar filtros")!.click();
  checar("'Limpar filtros' volta tudo", ids(a.raiz) === "1,2,3,4,5", ids(a.raiz));

  secao("historico app: abrir processo");
  a.t.fechou = 0;
  (a.raiz.querySelector('li[data-id="2"] .spro-lista-protocolo') as HTMLElement).click();
  await tique();
  const ultima = a.chamadas.at(-1);
  checar(
    "clique no numero pede abrirProcesso na propria aba",
    ultima?.[0] === "abrirProcesso" &&
      JSON.stringify(ultima[1]) === JSON.stringify({ id: "2", protocolo: "50300.000002/2026-02", novaAba: false }),
    ultima,
  );
  checar("no modal, fecha depois de abrir", a.t.fechou === 1);
  cliqueCtrl(a.raiz.querySelector('li[data-id="3"] .spro-lista-protocolo')!);
  await tique();
  checar(
    "Ctrl+clique abre em outra aba",
    JSON.stringify(a.chamadas.at(-1)?.[1]) === JSON.stringify({ id: "3", protocolo: "50300.000003/2026-03", novaAba: true }),
  );
  checar("Ctrl+clique nao fecha o modal", a.t.fechou === 1);
  secao("historico app: botoes de abrir em nova aba e copiar ao lado do numero");
  const linhasDoNumero = [...a.raiz.querySelectorAll("li.spro-lista-item")];
  checar(
    "cada linha tem um 'abrir em nova aba' e um 'copiar', depois do numero",
    linhasDoNumero.length === 5 &&
      linhasDoNumero.every(
        (li) =>
          li.querySelectorAll(".spro-nova-guia").length === 1 &&
          li.querySelectorAll(".spro-copiar-num").length === 1 &&
          li.querySelector(".spro-nova-guia")?.previousElementSibling === li.querySelector(".spro-lista-protocolo") &&
          li.querySelector(".spro-copiar-num")?.previousElementSibling === li.querySelector(".spro-nova-guia"),
      ),
  );
  const fechouAntes = a.t.fechou;
  const nChamadas = a.chamadas.length;
  const li2 = a.raiz.querySelector('li[data-id="2"]')!;
  (li2.querySelector(".spro-nova-guia") as HTMLElement).click();
  await tique();
  checar(
    "nova aba: pede abrirProcesso com novaAba=true",
    a.chamadas.length === nChamadas + 1 &&
      JSON.stringify(a.chamadas.at(-1)) ===
        JSON.stringify(["abrirProcesso", { id: "2", protocolo: "50300.000002/2026-02", novaAba: true }]),
    a.chamadas.at(-1),
  );
  checar("nova aba: nao fecha o modal", a.t.fechou === fechouAntes);
  const nCopias = a.copiados.length;
  (li2.querySelector(".spro-copiar-num") as HTMLElement).click();
  await tique();
  checar(
    "copiar: copia o numero formatado da linha",
    a.copiados.length === nCopias + 1 && a.copiados.at(-1) === "50300.000002/2026-02",
    a.copiados,
  );
  checar("copiar: nao abre o processo nem fecha o modal", a.chamadas.length === nChamadas + 1 && a.t.fechou === fechouAntes);
  checar("copiar: feedback no botao", li2.querySelector(".spro-copiar-num")?.classList.contains("spro-copiado") === true);
  checar("botoes nao marcam a selecao da linha", !li2.classList.contains("spro-lista-item-selecionado"));

  a.t.rejeitar.add("abrirProcesso");
  (a.raiz.querySelector('li[data-id="1"] .spro-lista-protocolo') as HTMLElement).click();
  await tique();
  checar("falha ao abrir: avisa e o modal fica", textoAviso(a.doc).includes("Falhou: abrirProcesso") && a.t.fechou === 1);
  a.t.rejeitar.clear();

  secao("historico app: modo lateral");
  const lat = await montar({ modo: "lateral", fechar: undefined });
  await lat.app.iniciar();
  checar("lateral: desenha as 5", ids(lat.raiz) === "1,2,3,4,5");
  checar("lateral: sem titulo", !lat.raiz.querySelector("h1, h2, .spro-lista-titulo"));
  checar("lateral: sem X", !botao(lat.raiz, "Fechar"));
  checar("sem abrirLateral, sem o botao", !botao(lat.raiz, "Abrir na barra lateral"));

  (lat.raiz.querySelector('li[data-id="1"] .spro-lista-protocolo') as HTMLElement).click();
  await tique();
  checar("lateral: abre e nao chama fechar", lat.chamadas.at(-1)?.[0] === "abrirProcesso" && lat.t.fechou === 0);

  secao("historico app: '/' com o app dentro do proprio dialogo (modo modal)");
  const dl = await montar(
    {},
    {
      html: '<html><body><dialog open><div id="app"></div></dialog><dialog open id="outro"><button id="b">x</button></dialog></body></html>',
    },
  );
  await dl.app.iniciar();
  const buscaDl = dl.raiz.querySelector<HTMLInputElement>("input.spro-lista-busca")!;
  let focouDl = 0;
  buscaDl.focus = () => {
    focouDl += 1;
  };
  tecla(dl.raiz.querySelector("li .spro-lista-protocolo")!, "/");
  checar("'/' dentro do dialogo do proprio app foca a busca", focouDl === 1);
  tecla(dl.doc.getElementById("b")!, "/");
  checar("'/' num outro dialogo (aberto por cima) nao foca", focouDl === 1);

  secao("historico app: lote so com os visiveis");
  const c = await montar();
  await c.app.iniciar();
  checar("sem selecao, sem barra de lote", qtdLote(c.raiz) === null);
  marcar(caixa(c.raiz, "1"));
  marcar(caixa(c.raiz, "2"));
  marcar(caixa(c.raiz, "3"));
  checar("3 selecionados", qtdLote(c.raiz) === "3 selecionados", qtdLote(c.raiz));
  checar("linha marcada", !!c.raiz.querySelector('li[data-id="2"].spro-lista-item-selecionado'));
  escolherCombo(c.raiz, "Tipo", "Licitação");
  checar("filtro deixa 2 e 5 a vista", ids(c.raiz) === "2,5", ids(c.raiz));
  checar("a selecao so conta o visivel", qtdLote(c.raiz) === "1 selecionado", qtdLote(c.raiz));
  c.t.resposta = false;
  botao(c.raiz, "Remover do histórico")!.click();
  await tique(60);
  checar("recusar a confirmacao nao remove", (await noRepo(c.repo)) === "1,2,3,4,5");
  c.t.resposta = true;
  botao(c.raiz, "Remover do histórico")!.click();
  await tique(60);
  checar(
    "confirma com o texto e o rotulo",
    c.confirmados.at(-1)?.[0] === "Remover 1 processo do histórico?" && c.confirmados.at(-1)?.[1] === "Remover",
    c.confirmados,
  );
  checar("remove so o visivel; os escondidos continuam", (await noRepo(c.repo)) === "1,3,4,5", await noRepo(c.repo));
  checar("aviso com Desfazer", textoAviso(c.doc).includes("Removido do histórico") && !!botao(c.doc.body, "Desfazer"));
  botao(c.raiz.querySelector(".spro-lista-ativos")!, "Tirar o filtro Licitação")!.click();
  checar("sem filtro, os escondidos nao voltam selecionados", qtdLote(c.raiz) === null && ids(c.raiz) === "1,3,4,5", qtdLote(c.raiz));

  secao("historico app: lote, outras acoes");
  const e = await montar();
  await e.app.iniciar();
  marcar(caixa(e.raiz, "1"));
  marcar(caixa(e.raiz, "3"));
  botao(e.raiz, "Copiar números")!.click();
  await tique();
  checar("copia os numeros, um por linha", e.copiados[0] === "50300.000001/2026-01\n50300.000003/2026-03", e.copiados);
  botao(e.raiz, "Exportar CSV")!.click();
  const csv = e.baixados[0];
  checar("CSV com nome e data", csv?.nome === "historico-seipro-2026-10-02.csv", csv?.nome);
  checar("CSV so dos selecionados", csv?.conteudo === gerarCsv(linhasCsv([CINCO[0]!, CINCO[2]!])));
  checar("sem Monitorados, lote sem 'Monitorar'", !botao(e.raiz, "Monitorar"));
  checar("sem Monitorados, sem estrela", !e.raiz.querySelector(".spro-lista-estrela"));
  checar("sem Monitorados, sem situacao de monitorados", !opcoesDoCombo(e.raiz, "Situação").includes("favoritos"));
  botao(e.raiz, "Limpar seleção")!.click();
  checar("'Limpar seleção' esconde a barra", qtdLote(e.raiz) === null);
  const todos = () => e.raiz.querySelector<HTMLElement>('[role="checkbox"][aria-label="Selecionar todos os visíveis"]');
  checar("caixa 'Selecionar todos os visiveis' no topo da lista", todos()?.getAttribute("aria-checked") === "false");
  todos()!.click();
  checar("seleciona todos os visiveis", qtdLote(e.raiz) === "5 selecionados" && todos()?.getAttribute("aria-checked") === "true");
  todos()!.click();
  checar("de novo desmarca", qtdLote(e.raiz) === null);
  marcar(caixa(e.raiz, "4"));
  checar("parcial fica misto", todos()?.getAttribute("aria-checked") === "mixed");

  secao("historico app: menu - pausar e retomar");
  const p = await montar();
  await p.app.iniciar();
  const faixaTexto = () => p.raiz.querySelector(".spro-lista-faixas")?.textContent ?? "";
  checar("sem faixa de pausa por padrao", !faixaTexto().includes("pausado"));
  checar("menu tem 'Pausar o registro'", itemDoMenu(p.raiz, MENU, "Pausar o registro"));
  await tique(60);
  checar("pausar grava registrar: false", (await lerPreferencias(p.area)).registrar === false);
  checar("faixa 'O registro está pausado'", faixaTexto().includes("O registro está pausado: nada novo entra no histórico."), faixaTexto());
  botao(p.raiz.querySelector(".spro-lista-faixas")!, "Retomar")!.click();
  await tique(60);
  checar("'Retomar' volta registrar: true e a faixa some", (await lerPreferencias(p.area)).registrar === true && !faixaTexto());
  itemDoMenu(p.raiz, MENU, "Pausar o registro");
  await tique(60);
  checar("pausado, o menu oferece 'Retomar o registro'", itemDoMenu(p.raiz, MENU, "Retomar o registro"));
  await tique(60);
  checar("retomar pelo menu", (await lerPreferencias(p.area)).registrar === true);
  itemDoMenu(p.raiz, MENU, "Opções do SEI Pro");
  checar("'Opções do SEI Pro' abre as opcoes", p.t.opcoes === 1);
  itemDoMenu(p.raiz, MENU, "Exportar CSV");
  checar(
    "menu 'Exportar CSV' baixa o filtrado inteiro",
    p.baixados[0]?.conteudo === gerarCsv(linhasCsv(CINCO)) && p.baixados[0]?.tipo.startsWith("text/csv"),
  );

  secao("historico app: menu - limite");
  const muitas = Array.from({ length: 600 }, (_, i) => visita({ id: `m${i}`, protocolo: `${i}/2026`, ultima: AGORA - i * MIN }));
  const l = await montar({}, { visitas: muitas });
  await l.app.iniciar();
  checar("600 no cabecalho", l.raiz.querySelector(".spro-lista-total")?.textContent === "600 processos");
  checar("menu tem 'Limite de processos…'", itemDoMenu(l.raiz, MENU, "Limite de processos…"));
  await tique(20);
  const dLim = l.modais.at(-1)!;
  checar("abre o dialogo do limite", dLim?.titulo === "Limite de processos", dLim?.titulo);
  const tLim = () => dLim.conteudo.textContent ?? "";
  checar("mostra o total", tLim().includes("Hoje há 600 processos no histórico."), tLim());
  checar(
    "opcoes 500, 1.000, 2.000 e 5.000",
    ["500", "1000", "2000", "5000"].every((v) => !!dLim.conteudo.querySelector(`input[value="${v}"]`)),
  );
  checar("rotulo com milhar", tLim().includes("1.000") && tLim().includes("5.000"));
  checar("com o limite atual (1.000), ninguem sai", !tLim().includes("vão sair"));
  marcar(dLim.conteudo.querySelector('input[value="500"]'));
  checar("500 avisa quantos saem", tLim().includes("100 processos mais antigos vão sair."), tLim());
  botao(dLim.conteudo, "Salvar")!.click();
  await tique(80);
  checar("salvar grava o limite", (await lerPreferencias(l.area)).limite === 500);
  checar("e poda para 500", (await l.repo.contar()) === 500, await l.repo.contar());
  checar("saem os mais antigos", !(await l.repo.obter("m599")) && !!(await l.repo.obter("m0")));
  checar("o dialogo fecha", dLim.fechado);

  secao("historico app: menu - apagar por periodo");
  const ap = await montar();
  await ap.app.iniciar();
  checar("menu tem 'Apagar histórico…'", itemDoMenu(ap.raiz, MENU, "Apagar histórico…"));
  await tique(20);
  let dAp = ap.modais.at(-1)!;
  checar("abre o dialogo de apagar", dAp?.titulo === "Apagar histórico", dAp?.titulo);
  const tAp = dAp.conteudo.textContent ?? "";
  checar(
    "as 5 opcoes",
    ["Da última hora", "De hoje", "Dos últimos 7 dias", "Dos últimos 30 dias", "Tudo"].every((r) => tAp.includes(r)),
    tAp,
  );
  checar(
    "explica a regra do processo inteiro",
    tAp.includes(
      "Sai o processo inteiro se a última visita dele caiu no período (um processo visto há 20 dias e de novo hoje sai em “De hoje”).",
    ),
  );
  checar("botao Apagar e perigo", !!botao(dAp.conteudo, "Apagar")?.classList.contains("perigo"));
  botao(dAp.conteudo, "Cancelar")!.click();
  checar("cancelar fecha sem apagar", dAp.fechado && (await noRepo(ap.repo)) === "1,2,3,4,5");
  itemDoMenu(ap.raiz, MENU, "Apagar histórico…");
  await tique(20);
  dAp = ap.modais.at(-1)!;
  marcar(dAp.conteudo.querySelector('input[value="hoje"]'));
  botao(dAp.conteudo, "Apagar")!.click();
  await tique(80);
  checar("'De hoje' apaga so as de hoje", (await noRepo(ap.repo)) === "3,4,5", await noRepo(ap.repo));
  checar("a lista acompanha", ids(ap.raiz) === "3,4,5", ids(ap.raiz));
  checar("nao mexe no legado fora do 'Tudo'", !ap.chamadas.some(([op]) => op === "apagarLegado"));
  itemDoMenu(ap.raiz, MENU, "Apagar histórico…");
  await tique(20);
  dAp = ap.modais.at(-1)!;
  marcar(dAp.conteudo.querySelector('input[value="tudo"]'));
  botao(dAp.conteudo, "Apagar")!.click();
  await tique(80);
  checar("'Tudo' apaga todas", (await noRepo(ap.repo)) === "");
  checar(
    "e pede para apagar o legado",
    ap.chamadas.some(([op]) => op === "apagarLegado"),
  );
  checar("legado apagado: sem pendencia na meta", (await ap.repo.meta()).apagarLegado === undefined);
  checar("aviso 'Histórico apagado'", textoAviso(ap.doc).includes("Histórico apagado"));
  checar(
    "vazio sem filtro",
    (ap.raiz.querySelector(".spro-lista-vazio")?.textContent ?? "").includes("Nenhum processo visitado ainda.") &&
      (ap.raiz.querySelector(".spro-lista-vazio")?.textContent ?? "").includes("Abra um processo no SEI e ele aparece aqui."),
  );
  checar("cabecalho com 0 processos", ap.raiz.querySelector(".spro-lista-total")?.textContent === "0 processos");
  const ap2 = await montar();
  ap2.t.rejeitar.add("apagarLegado");
  await ap2.app.iniciar();
  itemDoMenu(ap2.raiz, MENU, "Apagar histórico…");
  await tique(20);
  marcar(ap2.modais.at(-1)!.conteudo.querySelector('input[value="tudo"]'));
  botao(ap2.modais.at(-1)!.conteudo, "Apagar")!.click();
  await tique(80);
  checar("RPC do legado falhou: fica pendente na meta", (await noRepo(ap2.repo)) === "" && (await ap2.repo.meta()).apagarLegado === true);
  checar("e o aviso e o de sucesso", textoAviso(ap2.doc).includes("Histórico apagado") && !textoAviso(ap2.doc).includes("antigo"));
  const ap3 = await montar();
  ap3.t.rejeitar.add("apagarLegado");
  ap3.repo.gravarMeta = async () => {
    throw new Error("cota cheia");
  };
  await ap3.app.iniciar();
  itemDoMenu(ap3.raiz, MENU, "Apagar histórico…");
  await tique(20);
  marcar(ap3.modais.at(-1)!.conteudo.querySelector('input[value="tudo"]'));
  const avisosAp3 = await avisosDoConsole(async () => {
    botao(ap3.modais.at(-1)!.conteudo, "Apagar")!.click();
    await tique(80);
  });
  checar(
    "RPC e meta falharam: o aviso diz que o antigo ficou",
    textoAviso(ap3.doc).includes("Histórico apagado, mas o histórico antigo do SEI não foi apagado."),
    textoAviso(ap3.doc),
  );
  checar(
    "e registra no console",
    avisosAp3.some((a) => a.includes("cota cheia")),
    avisosAp3,
  );

  secao("historico app: 'Tudo' sem nada para apagar nao diz 'apagado'");
  const nada = await montar({}, { visitas: [] });
  nada.t.respostas.set("apagarLegado", false);
  await nada.app.iniciar();
  itemDoMenu(nada.raiz, MENU, "Apagar histórico…");
  await tique(20);
  marcar(nada.modais.at(-1)!.conteudo.querySelector('input[value="tudo"]'));
  botao(nada.modais.at(-1)!.conteudo, "Apagar")!.click();
  await tique(80);
  checar("0 removidos e legado ausente: 'Nada para apagar.'", textoAviso(nada.doc) === "Nada para apagar.", textoAviso(nada.doc));
  const soLegado = await montar({}, { visitas: [] });
  await soLegado.app.iniciar();
  itemDoMenu(soLegado.raiz, MENU, "Apagar histórico…");
  await tique(20);
  marcar(soLegado.modais.at(-1)!.conteudo.querySelector('input[value="tudo"]'));
  botao(soLegado.modais.at(-1)!.conteudo, "Apagar")!.click();
  await tique(80);
  checar("0 removidos mas o legado saiu: 'Histórico apagado'", textoAviso(soLegado.doc) === "Histórico apagado", textoAviso(soLegado.doc));
  const pend = await montar({}, { visitas: [] });
  pend.t.rejeitar.add("apagarLegado");
  await pend.app.iniciar();
  itemDoMenu(pend.raiz, MENU, "Apagar histórico…");
  await tique(20);
  marcar(pend.modais.at(-1)!.conteudo.querySelector('input[value="tudo"]'));
  botao(pend.modais.at(-1)!.conteudo, "Apagar")!.click();
  await tique(80);
  checar(
    "0 removidos e sem a aba: diz que o antigo sai depois, sem 'apagado'",
    (await pend.repo.meta()).apagarLegado === true &&
      textoAviso(pend.doc) === "O histórico antigo do SEI será apagado na próxima vez que você abrir o SEI.",
    textoAviso(pend.doc),
  );

  secao("historico app: faixa de migracao");
  const mg = await montar({}, { meta: { migrados: 7 } });
  await mg.app.iniciar();
  const faixaMg = () => mg.raiz.querySelector(".spro-lista-faixas")?.textContent ?? "";
  checar("mostra quantos vieram", faixaMg().includes("Histórico antigo trazido para cá: 7 processos"), faixaMg());
  botao(mg.raiz.querySelector(".spro-lista-faixas")!, "Entendi")!.click();
  await tique(60);
  checar("'Entendi' grava avisoMigracao e some", (await mg.repo.meta()).avisoMigracao === true && !faixaMg());
  const mg2 = await montar({}, { meta: { migrados: 7, avisoMigracao: true } });
  await mg2.app.iniciar();
  checar("ja visto, sem faixa", !(mg2.raiz.querySelector(".spro-lista-faixas")?.textContent ?? ""));

  secao("historico app: desligado nas opcoes");
  const ds = await montar({ historicoLigado: async () => false });
  await ds.app.iniciar();
  const tDs = ds.raiz.querySelector(".spro-lista-corpo")?.textContent ?? "";
  checar("explica que esta desligado", tDs.includes("O histórico está desligado nas opções do SEI Pro."), tDs);
  checar("sem lista", ids(ds.raiz) === "" && !ds.raiz.querySelector("ul.spro-lista"));
  checar("sem busca nem seletores", !!ds.raiz.querySelector<HTMLElement>(".spro-lista-ferramentas")?.hidden);
  botao(ds.raiz, "Abrir opções")!.click();
  checar("'Abrir opções' chama abrirOpcoes", ds.t.opcoes === 1);
  await ds.repo.registrarVisita({ id: "9", protocolo: "9/2026" }, AGORA);
  await tique(60);
  checar("desligado nao reage ao storage", ids(ds.raiz) === "");
  checar("desligado com o SEI e o login conhecidos (modal): ainda oferece apagar", itemDoMenu(ds.raiz, MENU, "Apagar histórico…"));

  secao("historico app: painel lateral com o historico desligado (sem contexto)");
  const VAZIO: ContextoHistorico = { ...CTX, host: "", login: "", nome: "", unidade: null, versao: "" };
  const dl0 = await montar(
    {
      modo: "lateral",
      historicoLigado: async () => false,
      rpc: { chamar: (() => Promise.reject(new Error("O histórico está desligado."))) as DepsApp["rpc"]["chamar"] },
    },
    { ctx: VAZIO, visitas: [] },
  );
  await dl0.app.iniciar();
  checar("escopo vazio ('|'): o menu nao oferece 'Apagar histórico…'", !itemDoMenu(dl0.raiz, MENU, "Apagar histórico…"));
  checar("so 'Opções do SEI Pro'", itemDoMenu(dl0.raiz, MENU, "Opções do SEI Pro") && dl0.t.opcoes === 1);
  // Defesa: mesmo chamado por fora do menu, nada é gravado nem dito "apagado".
  const avisosDl0 = await avisosDoConsole(async () => {
    await (dl0.app as unknown as { apagar(p: string): Promise<void> }).apagar("tudo");
    await tique(20);
  });
  checar("nenhuma meta com escopo invalido", Object.keys(await dl0.area.obter(null)).length === 0, await dl0.area.obter(null));
  checar("e o aviso e 'Nada para apagar.'", textoAviso(dl0.doc) === "Nada para apagar.", [textoAviso(dl0.doc), avisosDl0]);

  secao("historico app: ao vivo");
  const av = await montar();
  await av.app.iniciar();
  await av.repo.registrarVisita(
    { id: "9", protocolo: "50300.000009/2026-09", tipo: "Ofício", unidade: { id: "u1", sigla: "GPF" } },
    AGORA + MIN,
  );
  await tique(60);
  checar("visita gravada por outra aba aparece no topo", ids(av.raiz).startsWith("9,"), ids(av.raiz));
  checar("o total acompanha", av.raiz.querySelector(".spro-lista-total")?.textContent === "6 processos");
  await gravarPreferencias(av.area, { ordem: "protocolo", agruparPorDia: false });
  await tique(60);
  checar("preferencia mudada em outro lugar reordena", ids(av.raiz) === "1,2,3,4,5,9", ids(av.raiz));

  secao("historico app: agrupar e ordem");
  const g = await montar();
  await g.app.iniciar();
  const grupos = () => [...g.raiz.querySelectorAll(".spro-lista-grupo")].map((x) => x.textContent ?? "");
  checar("recentes e agrupado: cabecalhos por dia", grupos().length === 4 && grupos()[0] === "Hoje · 2", grupos());
  escolherCombo(g.raiz, "Ordem", "visitados");
  await tique(60);
  checar("'Mais visitados' grava a preferencia", (await lerPreferencias(g.area)).ordem === "visitados");
  checar("e some com os cabecalhos", grupos().length === 0, grupos());
  checar("na ordem de visitas", ids(g.raiz) === "4,1,2,3,5", ids(g.raiz));
  escolherCombo(g.raiz, "Ordem", "recentes");
  await tique(60);
  checar("de volta a recentes, agrupado", grupos().length === 4);
  botao(g.raiz, "Agrupar por dia")!.click();
  await tique(60);
  checar("desligar 'Agrupar' grava e tira os cabecalhos", (await lerPreferencias(g.area)).agruparPorDia === false && grupos().length === 0);

  secao("historico app: remover pela linha e desfazer");
  const rm = await montar();
  await rm.app.iniciar();
  const antes = await rm.repo.obter("3");
  checar(
    "menu da linha tem 'Remover do histórico'",
    itemDoMenu(rm.raiz.querySelector('li[data-id="3"]')!, "Mais ações para 50300.000003/2026-03", "Remover do histórico"),
  );
  await tique(60);
  checar("remove sem perguntar", (await noRepo(rm.repo)) === "1,2,4,5" && ids(rm.raiz) === "1,2,4,5" && !rm.confirmados.length);
  checar("aviso 'Removido do histórico'", textoAviso(rm.doc).includes("Removido do histórico"));
  botao(rm.doc.body, "Desfazer")!.click();
  await tique(60);
  checar(
    "Desfazer regrava a visita igual",
    JSON.stringify(await rm.repo.obter("3")) === JSON.stringify(antes) && ids(rm.raiz) === "1,2,3,4,5",
  );
  itemDoMenu(rm.raiz.querySelector('li[data-id="1"]')!, "Mais ações para 50300.000001/2026-01", "Copiar número");
  await tique();
  checar("'Copiar número' da linha", rm.copiados.at(-1) === "50300.000001/2026-01");

  secao("historico app: no modal (app dentro do <dialog> aberto), o aviso mora no dialogo");
  // Com showModal(), o que fica fora do diálogo é inerte: no body, o "Desfazer" não receberia o clique.
  const rmd = await montar({}, { html: '<html><body><dialog open class="hist-modal"><div id="app"></div></dialog></body></html>' });
  await rmd.app.iniciar();
  const antesD = await rmd.repo.obter("2");
  itemDoMenu(rmd.raiz.querySelector('li[data-id="2"]')!, "Mais ações para 50300.000002/2026-02", "Remover do histórico");
  await tique(60);
  const dlgModal = rmd.doc.querySelector("dialog.hist-modal")!;
  const avisoD = rmd.doc.querySelector(".spro-aviso");
  checar("aviso dentro do dialogo do app, nao no body", !!avisoD && dlgModal.contains(avisoD) && avisoD.parentElement !== rmd.doc.body);
  botao(dlgModal, "Desfazer")!.click();
  await tique(60);
  checar("o Desfazer de dentro do dialogo devolve a visita", JSON.stringify(await rmd.repo.obter("2")) === JSON.stringify(antesD));

  secao("historico app: com Monitorados");
  const fv = favoritosFalsos(["1"]);
  const f = await montar({ favoritos: fv.f });
  await f.app.iniciar();
  const estrela = (id: string) => f.raiz.querySelector(`li[data-id="${id}"] .spro-lista-estrela`);
  checar(
    "estrela nas linhas, cheia no monitorado",
    estrela("1")?.getAttribute("aria-pressed") === "true" && estrela("2")?.getAttribute("aria-pressed") === "false",
  );
  checar("situacao 'Nos monitorados' no seletor", opcoesDoCombo(f.raiz, "Situação").includes("favoritos"));
  (estrela("2") as HTMLElement).click();
  await tique(60);
  checar("estrela favorita", fv.log.join() === "fav:2" && estrela("2")?.getAttribute("aria-pressed") === "true", fv.log);
  checar("aviso 'Monitorado em GPF'", textoAviso(f.doc).includes("Monitorado em GPF"));
  botao(f.doc.body, "Desfazer")!.click();
  await tique(60);
  checar("Desfazer tira de novo", fv.log.at(-1) === "desfaz:2" && estrela("2")?.getAttribute("aria-pressed") === "false");
  (estrela("1") as HTMLElement).click();
  await tique(60);
  checar("estrela cheia tira dos monitorados", fv.log.at(-1) === "tirar:1" && textoAviso(f.doc).includes("Tirado dos monitorados"));
  botao(f.doc.body, "Desfazer")!.click();
  await tique(60);
  checar("Desfazer devolve", fv.log.at(-1) === "volta:1" && estrela("1")?.getAttribute("aria-pressed") === "true");
  marcar(caixa(f.raiz, "1"));
  checar("so monitorados selecionados: lote sem 'Monitorar'", !botao(f.raiz, "Monitorar"));
  marcar(caixa(f.raiz, "2"));
  marcar(caixa(f.raiz, "3"));
  botao(f.raiz, "Monitorar")!.click();
  await tique(60);
  checar("lote favorita so os que nao sao", fv.log.slice(-2).join() === "fav:2,fav:3", fv.log);
  checar("aviso do lote", textoAviso(f.doc).includes("2 processos monitorados em GPF"), textoAviso(f.doc));
  checar(
    "menu da linha oferece 'Tirar dos monitorados'",
    itemDoMenu(f.raiz.querySelector('li[data-id="2"]')!, "Mais ações para 50300.000002/2026-02", "Tirar dos monitorados"),
  );
  await tique(60);
  checar("e tira", fv.log.at(-1) === "tirar:2");

  secao("historico app: monitorar em lote com falha no meio");
  const fp = favoritosFalsos([], { falharNa: 2 });
  const fl = await montar({ favoritos: fp.f });
  await fl.app.iniciar();
  marcar(caixa(fl.raiz, "1"));
  marcar(caixa(fl.raiz, "2"));
  marcar(caixa(fl.raiz, "3"));
  botao(fl.raiz, "Monitorar")!.click();
  await tique(60);
  const tFl = textoAviso(fl.doc);
  checar("um aviso so, com '1 de 3' e a falha", tFl.includes("1 de 3 monitorados em GPF.") && tFl.includes("Lista cheia"), tFl);
  checar("para no primeiro erro", fp.log.join() === "fav:1", fp.log);
  botao(fl.doc.body, "Desfazer")!.click();
  await tique(60);
  checar("Desfazer desfaz o que foi feito", fp.log.join() === "fav:1,desfaz:1", fp.log);
  const fz = favoritosFalsos([], { falharNa: 1 });
  const fz0 = await montar({ favoritos: fz.f });
  await fz0.app.iniciar();
  marcar(caixa(fz0.raiz, "1"));
  marcar(caixa(fz0.raiz, "2"));
  botao(fz0.raiz, "Monitorar")!.click();
  await tique(60);
  checar(
    "nada feito: so o erro, sem Desfazer",
    textoAviso(fz0.doc).includes("Lista cheia") && !textoAviso(fz0.doc).includes("monitorados") && !botao(fz0.doc.body, "Desfazer"),
    textoAviso(fz0.doc),
  );

  secao("historico app: monitorados ilegiveis");
  const fi = favoritosFalsos(["1"], { idsFalham: true });
  const fil = await montar({ favoritos: fi.f });
  const avisosFi = await avisosDoConsole(() => fil.app.iniciar());
  checar("a lista aparece mesmo assim, sem estrela", ids(fil.raiz) === "1,2,3,4,5" && !fil.raiz.querySelector(".spro-lista-estrela"));
  checar(
    "e registra no console",
    avisosFi.some((a) => a.includes("monitorados ilegíveis")),
    avisosFi,
  );

  secao("historico app: selecao so com as linhas desenhadas");
  const longas = Array.from({ length: 250 }, (_, i) =>
    visita({ id: `h${i}`, protocolo: `${i}/2026`, tipo: i < 230 ? "Contrato" : "Ofício", ultima: AGORA - i * MIN }),
  );
  const sd = await montar({}, { visitas: longas });
  await sd.app.iniciar();
  const linhas = () => sd.raiz.querySelectorAll("li.spro-lista-item").length;
  checar("desenha 200 de 250", linhas() === 200);
  botao(sd.raiz, "Mostrar mais 50")!.click();
  checar("'Mostrar mais' desenha as 250", linhas() === 250);
  sd.raiz.querySelector<HTMLElement>('[role="checkbox"][aria-label="Selecionar todos os visíveis"]')!.click();
  checar("seleciona as 250 desenhadas", qtdLote(sd.raiz) === "250 selecionados", qtdLote(sd.raiz));
  escolherCombo(sd.raiz, "Tipo", "Contrato");
  checar("filtro novo: 230 filtradas, 200 desenhadas", linhas() === 200);
  checar("a selecao fica so nas desenhadas", qtdLote(sd.raiz) === "200 selecionados", qtdLote(sd.raiz));
  botao(sd.raiz, "Remover do histórico")!.click();
  await tique(80);
  checar("confirma 200", sd.confirmados.at(-1)?.[0] === "Remover 200 processos do histórico?", sd.confirmados.at(-1));
  checar(
    "remove so as desenhadas e selecionadas",
    (await sd.repo.contar()) === 50 && !(await sd.repo.obter("h199")) && !!(await sd.repo.obter("h200")) && !!(await sd.repo.obter("h229")),
    await sd.repo.contar(),
  );

  secao("historico app: destruir");
  const fd = favoritosFalsos([]);
  const dz = await montar({ favoritos: fd.f });
  checar("antes de iniciar, nenhum ouvinte", dz.ouvintes() === 0 && fd.ouvintes() === 0);
  await dz.app.iniciar();
  checar("iniciado: visitas e preferencias na area, e os monitorados", dz.ouvintes() === 2 && fd.ouvintes() === 1, {
    area: dz.ouvintes(),
    fav: fd.ouvintes(),
  });
  const buscaDz = dz.raiz.querySelector<HTMLInputElement>("input.spro-lista-busca")!;
  let focouDz = 0;
  buscaDz.focus = () => {
    focouDz += 1;
  };
  tecla(dz.doc.body, "/");
  checar("vivo, '/' foca a busca", focouDz === 1);
  dz.app.destruir();
  checar("destruido: nenhum ouvinte do app na area", dz.ouvintes() === 0, dz.ouvintes());
  checar("nem nos monitorados", fd.ouvintes() === 0, fd.ouvintes());
  tecla(dz.doc.body, "/");
  checar("destruido, '/' nao foca mais a busca", focouDz === 1);
  await dz.repo.registrarVisita({ id: "8", protocolo: "8/2026" }, AGORA + MIN);
  await tique(60);
  checar("destruido nao reage mais ao storage", !ids(dz.raiz).includes("8"));
}
