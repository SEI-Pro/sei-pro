/**
 * Uma árvore do SEI falsa com o comportamento que importa para a fila de pastas, medido ao vivo no SEI SP 4.1.5:
 *  - cada pasta tem o "+" (`ancjoinPASTAn`), o nome (`anchorPASTAn`) e o `div` dos filhos (`divPASTAn`) com o nó "Aguarde...";
 *  - clicar no "+" abre/fecha (`display` do `div`, `plus.gif`/`minus.gif`); a primeira abertura posta o formulário no
 *    `#ifrPasta` (UM só por quadro): um segundo pedido antes da resposta CANCELA o primeiro (a pasta fica "Aguarde...");
 *  - a resposta troca o "Aguarde..." pelos nós dos documentos; reabrir uma pasta já carregada não faz pedido nenhum.
 * O simulador conta pedidos, pedidos simultâneos e quando cada um começou e terminou.
 */
import { DOMParser } from "linkedom";

export interface ConfigPasta {
  /** Documentos que ela traz: [id, rótulo, ícone]. */
  docs?: Array<[string, string, string?]>;
  /** Resposta: "ok" (padrão), "mudo" (nunca responde), "erro", "vazia". */
  resposta?: "ok" | "mudo" | "erro" | "vazia";
  latenciaMs?: number;
  /** Pastas que aparecem dentro dela quando carrega (subpastas descobertas). */
  subpastas?: number[];
  /** Já nasce carregada e aberta (como a última pasta, que o SEI abre sozinho). */
  carregada?: boolean;
  nome?: string;
}

export interface Pedido {
  pasta: string;
  inicio: number;
  fim?: number;
  cancelado?: boolean;
}

export interface ArvoreFalsa {
  doc: Document;
  pedidos: Pedido[];
  /** Quantos pedidos simultâneos houve no máximo. */
  maxSimultaneos: () => number;
  /** Pedidos feitos com outro ainda sem resposta (cada um cancela o anterior no SEI real). */
  atropelos: () => number;
  /** Cliques no "+" por pasta (abrir e fechar). */
  cliques: string[];
  carregada(id: string): boolean;
  /** Clique "do usuário" (sem passar pela fila). */
  clicar(id: string): void;
  /** Troca o nome do nó para simular erro. */
  config: Map<string, ConfigPasta>;
}

const URL_BASE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=900";

export function montarArvoreFalsa(pastas: Record<number, ConfigPasta>, opcoes: { latenciaMs?: number } = {}): ArvoreFalsa {
  const config = new Map<string, ConfigPasta>();
  for (const [n, c] of Object.entries(pastas)) config.set(`PASTA${n}`, c);
  // Subpastas só existem no DOM quando a mãe carrega; as que são listadas como filhas não entram no topo.
  const filhas = new Set<number>();
  for (const c of config.values()) for (const s of c.subpastas ?? []) filhas.add(s);
  const doc = new DOMParser().parseFromString(
    "<html><body><form id='frmArvore'><div id='divArvore'></div><iframe id='ifrPasta'></iframe></form></body></html>",
    "text/html",
  ) as unknown as Document;
  (doc as unknown as { location: unknown }).location ??= { href: URL_BASE };
  const raiz = doc.getElementById("divArvore") as HTMLElement;
  const pedidos: Pedido[] = [];
  const cliques: string[] = [];
  const carregadas = new Set<string>();
  const aguardando = new Map<string, Pedido>();
  let atropelos = 0;
  let maxSim = 0;
  const relogio = 0;
  const T0 = Date.now();

  const el = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
    texto?: string,
  ): HTMLElementTagNameMap[K] => {
    const e = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (texto !== undefined) e.textContent = texto;
    return e;
  };

  const docsDaPasta = (id: string): Node[] => {
    const nos: Node[] = [];
    for (const [did, rotulo, icone] of config.get(id)?.docs ?? []) {
      nos.push(el("img", { id: `icon${did}`, src: icone ?? "svg/documento_interno.svg" }));
      const a = el("a", { id: `anchor${did}`, href: "about:blank" });
      a.append(el("span", { id: `span${did}` }, rotulo));
      nos.push(a, el("span"));
    }
    return nos;
  };

  const criarPasta = (n: number, pai: Element): void => {
    const id = `PASTA${n}`;
    const c = config.get(id) ?? {};
    const jaCarregada = !!c.carregada;
    const mais = el("a", { id: `ancjoin${id}`, href: "javascript:void(0);" });
    mais.append(el("img", { id: `join${id}`, src: jaCarregada ? "minus.gif" : "plus.gif" }));
    const nome = el("a", { id: `anchor${id}`, href: `javascript:abrirFecharPasta('${id}');`, class: "infraArvoreNo" });
    nome.append(el("span", { id: `span${id}` }, c.nome ?? String(n)));
    const div = el("div", { id: `div${id}`, style: `display: ${jaCarregada ? "block" : "none"};` });
    if (jaCarregada) {
      for (const no of docsDaPasta(id)) div.append(no);
      carregadas.add(id);
    } else {
      div.append(el("a", { id: `anchorImgAGUARDE${n}` }), el("a", { id: `anchorAGUARDE${n}` }));
      div.querySelector(`#anchorAGUARDE${n}`)?.append(el("span", { id: `spanAGUARDE${n}` }, "Aguarde..."));
    }
    pai.append(mais, nome, el("span"), div);
  };

  for (const n of Object.keys(pastas).map(Number)) if (!filhas.has(n)) criarPasta(n, raiz);

  const preencher = (id: string): void => {
    const c = config.get(id) ?? {};
    const div = doc.getElementById(`div${id}`) as HTMLElement;
    const n = id.replace("PASTA", "");
    const aguarde = doc.getElementById(`spanAGUARDE${n}`);
    if (c.resposta === "erro") {
      if (aguarde) aguarde.textContent = "Erro carregando protocolos.";
      return;
    }
    if (c.resposta === "vazia") {
      if (aguarde) aguarde.textContent = "Nenhum protocolo encontrado.";
      return;
    }
    div.replaceChildren(...docsDaPasta(id));
    for (const s of c.subpastas ?? []) criarPasta(s, div);
    carregadas.add(id);
  };

  const abrirFechar = (id: string): void => {
    const div = doc.getElementById(`div${id}`) as HTMLElement;
    const join = doc.getElementById(`join${id}`) as HTMLElement;
    const abrindo = div.style.display === "none";
    div.style.display = abrindo ? "block" : "none";
    join.setAttribute("src", abrindo ? "minus.gif" : "plus.gif");
    // processarFechamento do SEI: volta a mensagem "Aguarde..." do nó (apaga o erro de uma tentativa anterior).
    if (!abrindo) {
      const aguardeFecha = doc.getElementById(`spanAGUARDE${id.replace("PASTA", "")}`);
      if (aguardeFecha) aguardeFecha.textContent = "Aguarde...";
    }
    if (!abrindo || carregadas.has(id)) return;
    // Primeira abertura: posta no #ifrPasta. Um pedido anterior sem resposta é cancelado.
    for (const [outro, p] of aguardando) {
      p.cancelado = true;
      atropelos += 1;
      aguardando.delete(outro);
    }
    const p: Pedido = { pasta: id, inicio: Date.now() - T0 + relogio };
    pedidos.push(p);
    aguardando.set(id, p);
    maxSim = Math.max(maxSim, pedidos.filter((x) => !x.cancelado && x.fim === undefined).length);
    const c = config.get(id) ?? {};
    if (c.resposta === "mudo") return;
    setTimeout(
      () => {
        if (p.cancelado || aguardando.get(id) !== p) return;
        aguardando.delete(id);
        p.fim = Date.now() - T0 + relogio;
        preencher(id);
      },
      c.latenciaMs ?? opcoes.latenciaMs ?? 10,
    );
  };

  // O SEI põe o ouvinte no "+" de cada pasta; delegação no documento dá no mesmo, inclusive para as pastas que chegam depois.
  doc.addEventListener("click", (ev) => {
    const alvo = (ev.target as Element).closest?.('a[id^="ancjoinPASTA"]');
    if (!alvo) return;
    const id = alvo.id.replace("ancjoin", "");
    cliques.push(id);
    abrirFechar(id);
  });

  return {
    doc,
    pedidos,
    cliques,
    config,
    maxSimultaneos: () => maxSim,
    atropelos: () => atropelos,
    carregada: (id) => carregadas.has(id),
    clicar: (id) => (doc.getElementById(`ancjoin${id}`) as HTMLElement).click(),
  };
}
