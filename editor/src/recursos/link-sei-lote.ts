import { h } from "@comum/ui/dom";
import type { Editor } from "../adaptador/tipos";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { botaoTexto, caixa, dica, formulario } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Converter em lote os numeros SEI do documento em links (porte de `link-sei-lote.js`).
 *
 * Varre o corpo do documento atras de numeros de documento e de processo do SEI escritos como texto, mostra uma
 * previa (todos marcados, menos o do proprio processo) e converte cada marcado no link do SEI, o que a ferramenta
 * nativa "Inserir um Link para processo ou documento do SEI!" faz um numero por vez.
 *
 * COMO O PADRAO E DESCOBERTO: o numero de documento nao tem tamanho unico (8 digitos no MJ, 7 em outros orgaos), entao
 * os comprimentos saem dos documentos do PROPRIO processo (`dadosProcessoPro.listDocumentos[].nr_sei`); sem documento
 * nenhum valem 7 e 8. O numero de processo vale por dois moldes: o do PROPRIO processo (cada bloco de digitos vira
 * `\d{n}`, a pontuacao fica literal) e digitos/pontuacao terminando em `/ano-DV`. A previa e obrigatoria porque "8
 * digitos isolados" tambem casa CEP, numero de processo antigo e afins.
 *
 * CK5 x CK4: no CK5 o link e um elemento do model chamado `SEILink` (atributos `id` = `lnkSei<IdProtocolo>` e `text`),
 * entao numero que ja virou link nao aparece na varredura (so texto e percorrido). A conversao NAO passa pelo comando
 * `adicionarLinkProtocoloSei` (o plugin do SEI so enxerga selecao feita pelo usuario): chama o MESMO endpoint do botao
 * nativo (`INFRA_EDITOR_CONFIG.sei.urlBuscarProtocoloSei`) e monta o `SEILink` direto no model. No CK4 nao ha comando,
 * so o dialogo `linkseiDialog`, que o SEI Pro ja teleguia (`insertProtocoloOnBox`): o lote seleciona cada numero e
 * abre o dialogo, um por vez.
 *
 * DUAS ARMADILHAS: (1) a conversao muda o texto e desloca os offsets seguintes, entao o lote roda de TRAS PARA A
 * FRENTE dentro de cada no; (2) no CK4 o SEI avisa numero inexistente com `alert()` nativo, que travaria a fila, entao
 * durante o lote o `alert` e desviado para uma lista (e devolvido no `finally`).
 */

/** Teto de seguranca: cada numero e uma ida ao servidor. */
export const LOTE_TETO = 300;

/** Esperas do lote (ms). Exportado e mutavel so para os testes nao esperarem de verdade. */
export const tempos = {
  /** Pausa entre conversoes, para nao enfileirar requisicoes no SEI. */
  pausa: 500,
  /** Folga para a ultima conversao assentar antes da conferencia. */
  assentar: 900,
  /** Intervalo de espia do dialogo do CK4. */
  espia: 150,
  /** Limite de espera do dialogo do CK4. */
  limiteDialogo: 8000,
};

/** Digitos e pontuacao terminando em /ano-DV: 50300.018905/2018-67, 018.00002137/2023-41, 3533908.4438.00000132/2025-57. */
export const PROCESSO_ANO_DV = "\\d[\\d.\\-]{3,}\\d\\/(?:19|20)\\d{2}-\\d{2}";
/** Exemplo para as mensagens quando o numero do processo atual nao esta a mao. */
const EXEMPLO_NUP = "00000.000000/0000-00";

const TITULO = "Converter números SEI em links";

export type TipoNumero = "documento" | "processo";

/** Um numero achado num trecho de texto. */
export interface Achado {
  numero: string;
  tipo: TipoNumero;
  /** E o numero do proprio processo (vem desmarcado na previa). */
  proprio: boolean;
  inicio: number;
  fim: number;
}

export interface Padroes {
  tamanhos: number[];
  processoAtual: string;
  exemploProcesso: string;
  documento: RegExp;
  processo: RegExp;
}

/** Dados do processo em que o documento esta (so o que este recurso le). */
interface DadosDoProcesso {
  propProcesso?: { txtProtocoloExibir?: string; hdnProtocoloFormatado?: string; hdnIdProcedimento?: string | number };
  listDocumentos?: Array<{ nr_sei?: string | number } | null | undefined>;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  dadosProcessoPro?: DadosDoProcesso;
  sessionStorageRestorePro?(chave: string): DadosDoProcesso[] | null | undefined;
  INFRA_EDITOR_CONFIG?: { sei?: { urlBuscarProtocoloSei?: string } };
  CKEDITOR?: Ck4Global;
  alert?: (msg?: unknown) => void;
}

// ---------- superficies do CKEditor que o recurso toca (sem tipos no SEI) ----------

interface Ck4Global {
  dom?: { range: new (doc: unknown) => Ck4Range; text: new (no: Node) => unknown };
  dialog?: { getCurrent(): { hide(): void } | null | undefined };
}
interface Ck4Range {
  setStart(no: unknown, offset: number): void;
  setEnd(no: unknown, offset: number): void;
}
interface Ck4Instancia {
  document?: unknown;
  focus(): void;
  getSelection(): { selectRanges(ranges: unknown[]): void } | null;
  execCommand(comando: string): void;
}

interface Ck5Item {
  is?(tipo: string): boolean;
  textNode?: { parent: unknown };
  startOffset?: number;
  data?: string;
}
interface Ck5Writer {
  createPositionAt(pai: unknown, offset: number): unknown;
  createRange(a: unknown, b: unknown): unknown;
  createElement(nome: string, atributos: Record<string, string>): unknown;
  remove(intervalo: unknown): void;
  insert(el: unknown, posicao: unknown): void;
}
interface Ck5Editor {
  model: {
    change(fn: (w: Ck5Writer) => void): void;
    document: { getRootNames(): Iterable<string>; getRoot(nome: string): unknown };
    createRangeIn(raiz: unknown): { getItems(): Iterator<Ck5Item> };
  };
  ui?: { getEditableElement?(nome: string): HTMLElement | null | undefined };
}

// ---------- ocorrencias (achado + onde esta no editor) ----------

/** Ocorrencia coletada: o numero, o trecho em volta e o lugar no editor (CK5: `pai`; CK4: `inst` e `no`). */
export interface Ocorrencia extends Achado {
  trecho: string;
  pai?: unknown;
  inst?: Editor;
  no?: Text;
}

interface Falha {
  numero: string;
  motivo: string;
}
export interface Resumo {
  total: number;
  falhas: Falha[];
  /** Ocorrencias escolhidas que continuam como texto (a lista de falhas tem um item por numero no CK4). */
  semLink: number;
}

interface Protocolo {
  idProtocolo?: string;
  formatado?: string;
  identificacao?: string;
  erro?: string;
}

// ---------- funcoes puras (testadas diretamente) ----------

/** 50300.018905/2018-67 => `\d{5}\.\d{6}/\d{4}-\d{2}` (cada bloco de digitos vira `\d{n}`, a pontuacao e escapada). */
export function moldeProcesso(numero: string): string {
  return String(numero).replace(/\d+|\D/g, (t) => (/\d/.test(t) ? `\\d{${t.length}}` : t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")));
}

/** `\b` entre dois digitos nao existe, entao `\d{8}` nao casa dentro de 123456789. */
export function regexNumeroSei(tamanhos: number[]): RegExp {
  return new RegExp(`\\b(${tamanhos.map((t) => `\\d{${t}}`).join("|")})\\b`, "g");
}

/**
 * Sem `\b`: o molde pode comecar ou terminar em letra ou pontuacao. As bordas impedem casar o pedaco final de um numero
 * maior (x108000.012345/2024-11 nao vira 012345/2024-11).
 */
export function regexProcessoSei(moldes: string[]): RegExp {
  return new RegExp(`(?<![\\w./]|\\d-)(?:${moldes.join("|")})(?![\\w]|[./-]\\d)`, "g");
}

/**
 * Numeros de documento e de processo de um trecho de texto, na ordem em que aparecem. Numero de documento que cai DENTRO de
 * um numero de processo fica de fora (formato de processo com bloco de 7 ou 8 digitos).
 */
export function acharNumeros(texto: string, padroes: Padroes): Achado[] {
  const achados: Achado[] = [];
  padroes.processo.lastIndex = 0;
  for (let m = padroes.processo.exec(texto); m !== null; m = padroes.processo.exec(texto)) {
    achados.push({ numero: m[0], tipo: "processo", proprio: m[0] === padroes.processoAtual, inicio: m.index, fim: m.index + m[0].length });
  }
  const processos = achados.slice();
  padroes.documento.lastIndex = 0;
  for (let m = padroes.documento.exec(texto); m !== null; m = padroes.documento.exec(texto)) {
    const ini = m.index;
    const fim = ini + m[0].length;
    if (!processos.some((p) => ini < p.fim && fim > p.inicio)) {
      achados.push({ numero: m[0], tipo: "documento", proprio: false, inicio: ini, fim });
    }
  }
  return achados.sort((a, b) => a.inicio - b.inicio);
}

export function contarPorNumero(lista: ReadonlyArray<{ numero: string }>): Record<string, number> {
  const conta: Record<string, number> = {};
  for (const oc of lista) conta[oc.numero] = (conta[oc.numero] ?? 0) + 1;
  return conta;
}

/** O numero com ate 40 caracteres de cada lado, entre aspas angulares. */
export function trechoEmVolta(texto: string, inicio: number, fim: number): string {
  const antes = texto.slice(Math.max(0, inicio - 40), inicio).replace(/\s+/g, " ");
  const depois = texto.slice(fim, fim + 40).replace(/\s+/g, " ");
  return `${inicio > 40 ? "..." : ""}${antes}‹${texto.slice(inicio, fim)}›${depois}${fim + 40 < texto.length ? "..." : ""}`;
}

/**
 * De tras para a frente DENTRO DE CADA no/paragrafo: converter muda o texto e deslocaria os offsets das ocorrencias
 * seguintes do mesmo no. Entre nos diferentes a ordem nao importa.
 */
export function ordenarFila<T extends { pai?: unknown; no?: unknown; inicio: number }>(escolhidas: T[]): T[] {
  // a chave de cada no sai da ordem de aparicao na entrada (e nao da ordem em que o sort compara)
  const ordemDoNo: unknown[] = [];
  const chaveDoNo = (oc: T): number => {
    const alvo = oc.pai ?? oc.no;
    let i = ordemDoNo.indexOf(alvo);
    if (i === -1) {
      ordemDoNo.push(alvo);
      i = ordemDoNo.length - 1;
    }
    return i;
  };
  const comChave = escolhidas.map((oc) => ({ oc, chave: chaveDoNo(oc) }));
  return comChave.sort((a, b) => (a.chave !== b.chave ? a.chave - b.chave : b.oc.inicio - a.oc.inicio)).map((x) => x.oc);
}

const rotuloNumero = (n: number): string => (n === 1 ? "número" : "números");

/** Checkbox marcado: a propriedade no navegador; o atributo onde a propriedade nao existe (ambientes de teste). */
function estaMarcado(el: HTMLInputElement): boolean {
  return typeof el.checked === "boolean" ? el.checked : el.hasAttribute("checked");
}
function marcar(el: HTMLInputElement, valor: boolean): void {
  el.checked = valor;
  if (valor) el.setAttribute("checked", "checked");
  else el.removeAttribute("checked");
}

const esperar = (ms: number): Promise<void> => new Promise((ok) => setTimeout(ok, ms));
const curto = (e: unknown, n: number): string => String(e).slice(0, n);

export const recurso: Recurso = {
  id: "link-sei-lote",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const ck5 = (): boolean => A.versao === 5;
    let emAndamento = false;

    // ---------------- deteccao do padrao ----------------

    const busca = (): string => c.win.location?.search ?? "";

    /**
     * Dados do processo em que o documento esta. Na janela do editor o `dadosProcessoPro` pode ainda estar vazio (SEI 5, na
     * primeira abertura logo depois de criar o documento): vale a copia da sessao, achada pelo `id_procedimento` da URL.
     */
    function dadosDoProcesso(): DadosDoProcesso {
      const local = w.dadosProcessoPro ?? {};
      if (local.propProcesso) return local;
      try {
        const id = new URLSearchParams(busca()).get("id_procedimento");
        const sessao = typeof w.sessionStorageRestorePro === "function" ? w.sessionStorageRestorePro("dadosSessionProcessoPro") : null;
        if (id && Array.isArray(sessao)) {
          for (const s of sessao) if (s?.propProcesso && String(s.propProcesso.hdnIdProcedimento) === id) return s;
        }
      } catch {
        // sem sessao: vale o que ha
      }
      return local;
    }

    function comprimentosNumeroSei(): number[] {
      const tamanhos: number[] = [];
      const lista = dadosDoProcesso().listDocumentos;
      for (const d of Array.isArray(lista) ? lista : []) {
        const n = String(d?.nr_sei ?? "").replace(/\D/g, "");
        if (n.length >= 5 && n.length <= 12 && !tamanhos.includes(n.length)) tamanhos.push(n.length);
      }
      if (!tamanhos.length) return [7, 8];
      return tamanhos.sort((a, b) => a - b);
    }

    function processoAtual(): string {
      const prop = dadosDoProcesso().propProcesso;
      return prop ? String(prop.txtProtocoloExibir || prop.hdnProtocoloFormatado || "").trim() : "";
    }

    function padroesLinkSei(): Padroes {
      const atual = processoAtual();
      const moldes = [PROCESSO_ANO_DV];
      if (atual.replace(/\D/g, "").length >= 8) moldes.unshift(moldeProcesso(atual));
      const tamanhos = comprimentosNumeroSei();
      return {
        tamanhos,
        processoAtual: atual,
        exemploProcesso: atual || EXEMPLO_NUP,
        documento: regexNumeroSei(tamanhos),
        processo: regexProcessoSei(moldes),
      };
    }

    const comTrecho = (texto: string, padroes: Padroes): Array<Achado & { trecho: string }> =>
      acharNumeros(texto, padroes).map((a) => ({ ...a, trecho: trechoEmVolta(texto, a.inicio, a.fim) }));

    // ---------------- coleta: CK5 (model) e CK4 (DOM do corpo) ----------------

    /** Raizes editaveis do CK5: fora as somente leitura (cabecalho, titulo), por `rootsAttributes` ou pela classe do DOM. */
    function raizesEditaveisCk5(editor: Ck5Editor): string[] {
      let nomes: string[] = [];
      try {
        nomes = Array.from(editor.model.document.getRootNames());
      } catch {
        return [];
      }
      const attrs = (c.win as unknown as { INFRA_EDITOR_CONFIG?: { rootsAttributes?: Record<string, { somenteLeitura?: boolean }> } })
        .INFRA_EDITOR_CONFIG?.rootsAttributes;
      return nomes.filter((n) => {
        if (n === "$graveyard" || attrs?.[n]?.somenteLeitura) return false;
        let el: Element | null | undefined = null;
        try {
          el = editor.ui?.getEditableElement?.(n);
        } catch {
          el = null;
        }
        el ??= c.doc.getElementById(n);
        // Sem elemento no DOM: mantem (o CK5 recusa escrita em raiz somente leitura de qualquer forma).
        return !el?.classList.contains("ck-read-only");
      });
    }

    function coletarCk5(editor: Ck5Editor, padroes: Padroes): Ocorrencia[] {
      const achados: Ocorrencia[] = [];
      for (const nome of raizesEditaveisCk5(editor)) {
        const raiz = editor.model.document.getRoot(nome);
        if (!raiz) continue;
        const itens = editor.model.createRangeIn(raiz).getItems();
        for (let it = itens.next(); !it.done; it = itens.next()) {
          const item = it.value;
          if (!item.is?.("$textProxy")) continue;
          const pai = item.textNode?.parent;
          const base = item.startOffset ?? 0;
          for (const a of comTrecho(String(item.data ?? ""), padroes)) {
            achados.push({ ...a, pai, inicio: base + a.inicio, fim: base + a.fim });
          }
        }
      }
      return achados;
    }

    /**
     * No CK4 cada secao do documento e uma instancia propria do editor (o despacho do SEI SP tem uma secao editavel
     * "Processo n. / Interessado" antes da do texto). Varre todas as secoes editaveis, como no CK5.
     */
    function instanciasEditaveisCk4(editor: Editor): Editor[] {
      const lista = A.getAllInstances().filter((i) => !A.somenteLeitura(i) && !!A.getBodyContainer(i));
      if (lista.length) return lista;
      return A.somenteLeitura(editor) ? [] : [editor];
    }

    /** Textos do corpo, fora de qualquer link (ancora do SEI ou qualquer `<a>`), sem entrar em script/estilo. */
    function textosForaDeLinks(raiz: Node, saida: Text[]): void {
      for (const filho of Array.from(raiz.childNodes)) {
        if (filho.nodeType === 3) saida.push(filho as Text);
        else if (filho.nodeType === 1) {
          const tag = (filho as Element).tagName.toLowerCase();
          if (tag !== "a" && tag !== "script" && tag !== "style") textosForaDeLinks(filho, saida);
        }
      }
    }

    function coletarCk4(editor: Editor, padroes: Padroes): Ocorrencia[] {
      const achados: Ocorrencia[] = [];
      for (const inst of instanciasEditaveisCk4(editor)) {
        const corpo = A.getBodyContainer(inst);
        if (!corpo?.ownerDocument) continue;
        const nos: Text[] = [];
        textosForaDeLinks(corpo, nos);
        for (const no of nos) {
          for (const a of comTrecho(no.nodeValue ?? "", padroes)) achados.push({ ...a, inst, no });
        }
      }
      return achados;
    }

    const coletar = (editor: Editor, padroes: Padroes): Ocorrencia[] =>
      ck5() ? coletarCk5(editor as unknown as Ck5Editor, padroes) : coletarCk4(editor, padroes);

    /** Nao ha onde escrever: toda raiz (CK5) ou instancia (CK4) e somente leitura. */
    function semOndeEscrever(editor: Editor): boolean {
      return ck5() ? raizesEditaveisCk5(editor as unknown as Ck5Editor).length === 0 : instanciasEditaveisCk4(editor).length === 0;
    }

    // ---------------- resolucao do numero no SEI (CK5) ----------------

    /**
     * O mesmo POST que o botao nativo dispara. A resposta vem em XML iso-8859-1:
     * `<complementos><complemento nome="IdProtocolo">40051048</complemento>
     *  <complemento nome="ProtocoloFormatado">35276038</complemento><complemento nome="Identificacao">Anexo</complemento></complementos>`
     * ou `<erros><erro descricao="Protocolo nao encontrado."></erro></erros>`.
     */
    async function buscarProtocolo(numero: string): Promise<Protocolo> {
      const url = w.INFRA_EDITOR_CONFIG?.sei?.urlBuscarProtocoloSei;
      if (!url) return { erro: "O SEI não expôs o endereço de consulta de protocolo" };
      try {
        const q = new URLSearchParams(busca());
        const corpo = `idProtocoloDigitado=${encodeURIComponent(numero)}&idProcedimento=${encodeURIComponent(q.get("id_procedimento") ?? "")}&idDocumento=${encodeURIComponent(q.get("id_documento") ?? "")}`;
        const enviar = c.fetch ?? c.win.fetch.bind(c.win);
        const res = await enviar(new URL(url, c.win.location.href).href, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: corpo,
        });
        // iso-8859-1: sem isto o acento da mensagem de erro do SEI vira lixo.
        const xml = new TextDecoder("iso-8859-1").decode(await res.arrayBuffer());
        const doc = new (c.win as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(xml, "text/xml");
        const erro = doc.querySelector("erro");
        if (erro) return { erro: erro.getAttribute("descricao") || "Protocolo não encontrado." };
        const valores: Record<string, string> = {};
        for (const comp of Array.from(doc.querySelectorAll("complemento")))
          valores[comp.getAttribute("nome") ?? ""] = comp.textContent ?? "";
        if (!valores.IdProtocolo) return { erro: "Resposta do SEI sem o identificador do protocolo" };
        return {
          idProtocolo: valores.IdProtocolo,
          formatado: valores.ProtocoloFormatado || numero,
          identificacao: valores.Identificacao || "",
        };
      } catch (e) {
        return { erro: `Falha ao consultar o SEI: ${curto(e, 80)}` };
      }
    }

    // ---------------- conversao de uma ocorrencia ----------------

    async function converterCk5(editor: Ck5Editor, oc: Ocorrencia): Promise<Protocolo> {
      const dados = await buscarProtocolo(oc.numero);
      if (dados.erro) return dados;
      editor.model.change((writer) => {
        const faixa = writer.createRange(writer.createPositionAt(oc.pai, oc.inicio), writer.createPositionAt(oc.pai, oc.fim));
        const elo = writer.createElement("SEILink", { id: `lnkSei${dados.idProtocolo}`, text: dados.formatado ?? oc.numero });
        writer.remove(faixa);
        writer.insert(elo, writer.createPositionAt(oc.pai, oc.inicio));
      });
      return dados;
    }

    function converterCk4(editor: Editor, oc: Ocorrencia): void {
      // A secao em que o numero esta: o dialogo insere o link na instancia que o abriu.
      const ed = (oc.inst ?? editor) as unknown as Ck4Instancia;
      const dom = w.CKEDITOR?.dom;
      if (!dom || !oc.no) throw new Error("CKEditor 4 indisponível");
      ed.focus();
      const range = new dom.range(ed.document);
      const no = new dom.text(oc.no);
      range.setStart(no, oc.inicio);
      range.setEnd(no, oc.fim);
      ed.getSelection()?.selectRanges([range]);
      // `insertProtocoloOnBox` (chamado no onShow do dialogo) le a selecao, preenche o campo Protocolo e confirma sozinho.
      A.execCommand(oc.inst ?? editor, "linkseiDialog");
    }

    /** Espera o dialogo do CK4 fechar (o SEI consulta o protocolo no servidor); passado o limite, fecha. */
    async function esperarDialogoFechar(): Promise<void> {
      const fim = Date.now() + tempos.limiteDialogo;
      const atual = () => {
        try {
          return w.CKEDITOR?.dialog?.getCurrent() ?? null;
        } catch {
          return null;
        }
      };
      while (atual() && Date.now() <= fim) await esperar(tempos.espia);
      try {
        atual()?.hide();
      } catch {
        // dialogo ja foi
      }
    }

    /** O SEI avisa "Protocolo nao encontrado." com `alert()` nativo; num lote de dezenas travaria a fila. Recolhe as mensagens. */
    async function comAlertaRecolhido<T>(fn: () => Promise<T>): Promise<{ resultado: T; avisos: string[] }> {
      const original = w.alert;
      const recolhidas: string[] = [];
      w.alert = (msg?: unknown) => {
        recolhidas.push(String(msg));
      };
      try {
        return { resultado: await fn(), avisos: recolhidas };
      } finally {
        w.alert = original;
      }
    }

    // ---------------- execucao do lote ----------------

    /** Quem ainda esta como TEXTO no documento nao virou link (vale para os dois editores; pega o que falhou sem avisar). */
    function montarResumo(
      editor: Editor,
      fila: Ocorrencia[],
      falhas: Falha[],
      avisos: string[],
      ignoradas: Record<string, number>,
    ): Resumo {
      const sobra = contarPorNumero(coletar(editor, padroesLinkSei()));
      for (const n of Object.keys(ignoradas)) {
        if (sobra[n]) sobra[n] = Math.max(0, sobra[n] - (ignoradas[n] ?? 0));
      }
      const jaListado = new Set(falhas.map((f) => f.numero));
      const motivoPadrao = avisos.length ? String(avisos[0]).replace(/\s+/g, " ").trim() : "O SEI não converteu este número";
      let semLink = 0;
      for (const oc of fila) {
        if ((sobra[oc.numero] ?? 0) > 0) {
          sobra[oc.numero] = (sobra[oc.numero] ?? 0) - 1;
          semLink++;
          if (!jaListado.has(oc.numero)) {
            falhas.push({ numero: oc.numero, motivo: motivoPadrao });
            jaListado.add(oc.numero);
          }
        }
      }
      return { total: fila.length, falhas, semLink };
    }

    /** `ignoradas`: quantas ocorrencias de cada numero ficaram de fora (desmarcadas ou alem do teto); seguem como texto e nao sao falha. */
    async function executarLote(editor: Editor, escolhidas: Ocorrencia[], ignoradas: Record<string, number>): Promise<Resumo> {
      const fila = ordenarFila(escolhidas);
      const falhas: Falha[] = [];
      const rodar = async (): Promise<void> => {
        for (const oc of fila) {
          if (ck5()) {
            const r = await converterCk5(editor as unknown as Ck5Editor, oc);
            if (r.erro) falhas.push({ numero: oc.numero, motivo: r.erro });
          } else {
            // CK4: o dialogo nativo faz a consulta e a insercao; o motivo de cada falha nao vem separado por numero,
            // entao quem nao virou link e descoberto na conferencia do fim.
            try {
              converterCk4(editor, oc);
              await esperarDialogoFechar();
            } catch (e) {
              falhas.push({ numero: oc.numero, motivo: curto(e, 90) });
            }
          }
          await esperar(tempos.pausa);
        }
      };
      try {
        const saida = await comAlertaRecolhido(rodar);
        await esperar(tempos.assentar);
        return montarResumo(editor, fila, falhas, saida.avisos, ignoradas);
      } catch (e) {
        return montarResumo(editor, fila, falhas.concat([{ numero: "-", motivo: curto(e, 90) }]), [], ignoradas);
      }
    }

    // ---------------- previa e resumo ----------------

    /** "3 de documento (8 digitos, ...) e 2 de processo" */
    function descreverAchados(achados: Ocorrencia[], padroes: Padroes): Array<Node | string> {
      let docs = 0;
      let procs = 0;
      for (const oc of achados) if (oc.tipo === "processo") procs++;
      docs = achados.length - procs;
      const partes: Array<Node | string> = [];
      if (docs) {
        partes.push(
          h("strong", {}, String(docs)),
          ` de documento (${padroes.tamanhos.join(" ou ")} dígitos, como os documentos deste processo)`,
        );
      }
      if (procs) {
        if (partes.length) partes.push(" e ");
        partes.push(h("strong", {}, String(procs)), " de processo");
      }
      return partes;
    }

    function mostrarResumo(resumo: Resumo): void {
      const ok = resumo.total - resumo.semLink;
      const convertidos = (n: number) => `${n} ${n === 1 ? "número convertido" : "números convertidos"}`;
      if (!resumo.falhas.length) {
        avisar(`${convertidos(ok)} em link.`);
        return;
      }
      const lista = h(
        "div",
        { class: "spro-resultados", id: "linkSeiLoteFalhas" },
        ...resumo.falhas.map((f) =>
          h(
            "div",
            { class: "spro-resultado" },
            h(
              "div",
              { class: "spro-resultado-topo" },
              h("div", { class: "spro-resultado-titulo" }, f.numero, h("span", { class: "spro-selo aviso" }, f.motivo)),
            ),
          ),
        ),
      );
      abrirDialogo(c.doc, {
        titulo: TITULO,
        largura: 560,
        conteudo: formulario(
          h(
            "div",
            { id: "linkSeiLoteResumo" },
            dica(`${ok} de ${resumo.total} ${resumo.total === 1 ? "número convertido" : "números convertidos"}.`),
          ),
          h("p", { class: "spro-subtitulo" }, "Ficaram sem link"),
          lista,
        ),
      });
    }

    function abrirPrevia(
      editor: Editor,
      achados: Ocorrencia[],
      padroes: Padroes,
      contagem: Record<string, number>,
      cortadas: number,
    ): void {
      const temProprio = achados.some((oc) => oc.proprio);
      const itens = achados.map((oc, i) =>
        caixa(
          { class: "linkSeiLoteItem", "data-i": String(i), ...(oc.proprio ? {} : { checked: "checked" }) },
          h(
            "span",
            { class: "spro-item-corpo" },
            h("b", {}, oc.numero),
            h("small", {}, oc.proprio ? "este processo" : oc.tipo),
            h("span", { class: "spro-trecho" }, oc.trecho),
          ),
        ),
      );
      const lista = h("div", { class: "spro-checklist", id: "linkSeiLoteLista" }, ...itens);
      const entradas = (): HTMLInputElement[] => Array.from(lista.querySelectorAll<HTMLInputElement>("input.linkSeiLoteItem"));

      const contador = h("span", { id: "linkSeiLoteContagem", class: "spro-dica" });
      const atualizarContagem = () => {
        const n = entradas().filter(estaMarcado).length;
        contador.textContent = `${n} de ${achados.length} marcados`;
      };
      lista.addEventListener("change", atualizarContagem);
      atualizarContagem();

      const todos = botaoTexto(
        "Marcar todos",
        () => {
          for (const e of entradas()) marcar(e, true);
          atualizarContagem();
        },
        { id: "linkSeiLoteTodos" },
      );
      const nenhum = botaoTexto(
        "Desmarcar todos",
        () => {
          for (const e of entradas()) marcar(e, false);
          atualizarContagem();
        },
        { id: "linkSeiLoteNenhum" },
      );

      const converter = h("button", { type: "button", class: "spro-botao primario", id: "linkSeiLoteConverter" }, "Converter");
      const caixaDeDialogo = formulario(
        dica(
          "Encontrei ",
          h("strong", {}, String(achados.length)),
          ` ${rotuloNumero(achados.length)} neste texto: `,
          ...descreverAchados(achados, padroes),
          ".",
        ),
        dica(
          `Desmarque o que não for documento ou processo do SEI.${temProprio ? " O número deste próprio processo vem desmarcado." : ""} Cada número marcado é uma consulta ao servidor.`,
        ),
        cortadas > 0
          ? dica(`Foram listadas as primeiras ${LOTE_TETO} ocorrências; converta e abra de novo para tratar as ${cortadas} restantes.`)
          : null,
        h("div", { class: "spro-barra" }, h("div", { class: "spro-linha" }, todos, nenhum), contador),
        lista,
        h("div", { class: "spro-barra fim" }, converter),
      );
      caixaDeDialogo.id = "linkSeiLoteBox";

      const dialogo = abrirDialogo(c.doc, { titulo: TITULO, largura: 620, conteudo: caixaDeDialogo });

      converter.addEventListener("click", () => {
        const escolhidas = entradas()
          .filter(estaMarcado)
          .map((e) => achados[Number.parseInt(e.getAttribute("data-i") ?? "", 10)])
          .filter((oc): oc is Ocorrencia => !!oc);
        dialogo.fechar();
        if (!escolhidas.length) return;
        const porEscolha = contarPorNumero(escolhidas);
        const ignoradas: Record<string, number> = {};
        for (const n of Object.keys(contagem)) ignoradas[n] = (contagem[n] ?? 0) - (porEscolha[n] ?? 0);
        emAndamento = true;
        avisar(`Convertendo ${escolhidas.length} ${rotuloNumero(escolhidas.length)}...`);
        void executarLote(editor, escolhidas, ignoradas)
          .then(mostrarResumo)
          .catch((e) => avisar(`Não foi possível converter: ${curto(e, 90)}`))
          .finally(() => {
            emAndamento = false;
          });
      });
    }

    // ---------------- ponto de entrada ----------------

    function converterNumerosSeiEmLotePro(this_: Element | null): void {
      const editor = A.getInstance(this_);
      if (!editor) return;
      if (emAndamento) {
        avisar("Já há uma conversão em andamento. Aguarde o fim para iniciar outra.");
        return;
      }
      if (semOndeEscrever(editor)) {
        A.recusarEscrita();
        return;
      }
      const padroes = padroesLinkSei();
      let achados = coletar(editor, padroes);
      if (!achados.length) {
        avisar(
          `Nenhum número de documento (${padroes.tamanhos.join(" ou ")} dígitos) ou de processo (como ${padroes.exemploProcesso}) foi encontrado no texto. Os que já são link não entram na conta.`,
        );
        return;
      }
      const contagem = contarPorNumero(achados);
      const cortadas = Math.max(0, achados.length - LOTE_TETO);
      if (cortadas) achados = achados.slice(0, LOTE_TETO);
      abrirPrevia(editor, achados, padroes, contagem, cortadas);
    }

    return { converterNumerosSeiEmLotePro };
  },
};
