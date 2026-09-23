/**
 * Motor único de formulário do SEI.
 *
 * Toda escrita no SEI é, no fundo, o mesmo gesto: abrir a tela, pegar o
 * formulário (cujo `action` já traz o `infra_hash` certo), mudar alguns campos
 * e enviar. O legado repetia esse gesto em dezenas de variações (hdn*, txt*,
 * sel*, rdo*, lupas `id±texto¥`, iframe oculto clicando em Salvar). Aqui ele
 * existe uma vez, e cada operação de domínio só declara O QUE muda.
 *
 * O formulário é coletado como um navegador faria no submit (controles
 * "bem-sucedidos" do HTML): desabilitados ficam fora, radio e checkbox só
 * entram marcados, select sem opção marcada envia a primeira.
 *
 * LUPAS. O SEI guarda listas (assuntos, interessados, destinatários, unidades)
 * num `<select>` visível e serializa no `hdn` correspondente quando a página
 * carrega (`new infraLupaSelect('selAssuntos','hdnAssuntos',...)`). O HTML
 * servido vem com o `hdn` VAZIO — quem preenche é o JavaScript. Por isso o
 * motor lê os pares declarados nos scripts da própria página e refaz essa
 * serialização: sem isso, alterar um processo apagaria os assuntos dele.
 *
 * Substitui no legado: `extractFormParams`, `prepareFormData`,
 * `preencherHiddenLupasFormPro`, `docsLote_formNewDoc`, `updateDadosArvore*`
 * (o motor do iframe oculto) e as montagens de POST de `procLote`/`docsLote`.
 */

import { textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Http, OpcoesHttp, Pagina } from "../sessao/http";

export interface Opcao {
  valor: string;
  texto: string;
  selecionada: boolean;
}

export interface ItemLupa {
  id: string;
  texto: string;
}

/** Separadores da serialização `infraLupaSelect` (infra_js/InfraLupas.js). */
export const LUPA_ITEM = "\u00A5"; // ¥
export const LUPA_CAMPO = "\u00B1"; // ±

export function serializarLupa(itens: ItemLupa[]): string {
  return itens.map((i) => `${i.id}${LUPA_CAMPO}${i.texto}`).join(LUPA_ITEM);
}

export function lerLupa(valor: string): ItemLupa[] {
  if (!valor) return [];
  return valor.split(LUPA_ITEM).map((par) => {
    const [id, ...resto] = par.split(LUPA_CAMPO);
    return { id, texto: resto.join(LUPA_CAMPO) };
  });
}

/** Pares `select → hidden` declarados por `new infraLupaSelect('sel','hdn', ...)`. */
export function paresDeLupa(html: string): Array<[string, string]> {
  const pares: Array<[string, string]> = [];
  for (const m of html.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g)) {
    pares.push([m[1], m[2]]);
  }
  return pares;
}

export interface OpcoesEnvio extends OpcoesHttp {
  /** Nome do botão de submit a incluir no POST (o SEI às vezes o exige). */
  botao?: string;
  /** Prova de sucesso. Sem ela o envio não é considerado bem-sucedido. */
  sucesso?: (p: Pagina) => boolean;
  /** Descrição da operação, usada na mensagem de erro. */
  operacao?: string;
}

/** Sucesso quando a URL final contém o trecho (ex.: `acao_origem=documento_gerar`). */
export const urlContem = (trecho: string) => (p: Pagina) => p.url.includes(trecho);

interface Campo {
  nome: string;
  valor: string;
}

export class Formulario {
  readonly id: string;
  readonly action: string;
  private campos: Campo[];
  private readonly elemento: HTMLFormElement;

  private constructor(
    private readonly http: Http | null,
    readonly pagina: Pagina,
    form: HTMLFormElement,
  ) {
    this.elemento = form;
    this.id = form.id;
    this.action = (form.getAttribute("action") ?? "").replace(/&amp;/g, "&");
    this.campos = coletar(form);
    this.sincronizarLupas();
  }

  /** Abre a tela e localiza o formulário. */
  static async abrir(http: Http, url: string, seletor: string, op?: OpcoesHttp): Promise<Formulario> {
    const pagina = await http.obter(url, op);
    return Formulario.de(pagina, seletor, http);
  }

  /** Localiza o formulário numa página já obtida. `seletor` aceita lista separada por vírgula. */
  static de(pagina: Pagina, seletor: string, http: Http | null = null): Formulario {
    const form = pagina.doc.querySelector<HTMLFormElement>(seletor);
    if (!form) {
      throw new ErroSei(
        "SEI_VERSAO_NAO_SUPORTADA",
        `A tela do SEI n\u00E3o tem o formul\u00E1rio esperado (${seletor}).`,
        textoDe(pagina.doc.querySelector("title")),
      );
    }
    return new Formulario(http, pagina, form);
  }

  /** Pares na ordem em que irão no POST. */
  pares(): Array<[string, string]> {
    return this.campos.map((c) => [c.nome, c.valor]);
  }

  valor(nome: string): string | undefined {
    return this.campos.find((c) => c.nome === nome)?.valor;
  }

  tem(nome: string): boolean {
    return this.elemento.querySelector(`[name="${nome}"]`) !== null || this.campos.some((c) => c.nome === nome);
  }

  /** Opções de um select do formulário. */
  opcoes(nome: string): Opcao[] {
    const sel = this.elemento.querySelector<HTMLSelectElement>(`select[name="${nome}"], select#${cssId(nome)}`);
    if (!sel) return [];
    return [...sel.querySelectorAll("option")].map((o) => ({
      valor: o.getAttribute("value") ?? textoDe(o),
      texto: textoDe(o),
      selecionada: o.hasAttribute("selected"),
    }));
  }

  /**
   * Define valores. `null` remove o campo (checkbox desmarcado, campo omitido).
   * Para radio, basta o nome do grupo e o valor escolhido.
   */
  definir(valores: Record<string, string | null | undefined>): this {
    for (const [nome, valor] of Object.entries(valores)) {
      if (valor === undefined) continue;
      if (valor === null) {
        this.campos = this.campos.filter((c) => c.nome !== nome);
        continue;
      }
      const existente = this.campos.find((c) => c.nome === nome);
      if (existente) existente.valor = valor;
      else this.campos.push({ nome, valor });
    }
    return this;
  }

  /**
   * Escolhe a opção de um select pelo valor OU pelo texto (sem acento/caixa).
   * Falha com a lista de opções válidas, para quem chamou poder corrigir.
   */
  escolher(nome: string, valorOuTexto: string): Opcao {
    const ops = this.opcoes(nome);
    const alvo = normalizar(valorOuTexto);
    const achada =
      ops.find((o) => o.valor === valorOuTexto) ??
      ops.find((o) => normalizar(o.texto) === alvo) ??
      unica(ops.filter((o) => normalizar(o.texto).includes(alvo)));
    if (!achada) {
      throw new ErroSei(
        "ARGUMENTO_INVALIDO",
        `"${valorOuTexto}" n\u00E3o \u00E9 uma op\u00E7\u00E3o de ${nome}.`,
        ops.slice(0, 40).map((o) => o.texto).join(" | "),
      );
    }
    this.definir({ [nome]: achada.valor });
    return achada;
  }

  /**
   * Linhas de uma tabela do formulário (as telas de seleção do SEI: documentos
   * para incluir em bloco, itens marcáveis). Leitura: quem decide o que marcar
   * é quem chama, com `definir`.
   */
  linhas(seletorTabela: string): Element[] {
    return [...this.elemento.querySelectorAll(`${seletorTabela} tr`)].filter((tr) => tr.querySelector("input[type=checkbox]"));
  }

  /** Itens atuais de uma lupa (pelo select visível). */
  itensLupa(select: string): ItemLupa[] {
    const hdn = this.hiddenDaLupa(select);
    return hdn ? lerLupa(this.valor(hdn) ?? "") : [];
  }

  /** Substitui os itens de uma lupa: atualiza o `hdn` e o `select` enviado. */
  definirLupa(select: string, itens: ItemLupa[]): this {
    const hdn = this.hiddenDaLupa(select);
    if (!hdn) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `A lupa ${select} n\u00E3o existe nesta tela.`);
    this.definir({ [hdn]: serializarLupa(itens) });
    // O select de lupa vai no POST com as opções marcadas; o SEI lê o hdn, mas
    // reenviar coerente evita divergência se alguma versão ler o select.
    this.campos = this.campos.filter((c) => c.nome !== select && c.nome !== `${select}[]`);
    return this;
  }

  async enviar(op: OpcoesEnvio = {}): Promise<Pagina> {
    if (!this.http) throw new ErroSei("SEI_RESPOSTA_INESPERADA", "Formul\u00E1rio sem transporte HTTP.");
    if (!this.action) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `O formul\u00E1rio ${this.id} n\u00E3o tem action.`);
    const pares = this.pares();
    if (op.botao) pares.push(this.botaoDeEnvio(op.botao));
    const resposta = await this.http.enviar(this.action, pares, op);
    if (op.sucesso && !op.sucesso(resposta)) {
      throw new ErroSei(
        "SEI_RESPOSTA_INESPERADA",
        `O SEI n\u00E3o confirmou ${op.operacao ?? "a opera\u00E7\u00E3o"}.`,
        `${textoDe(resposta.doc.querySelector("title"))} \u2014 ${resposta.url.replace(/infra_hash=\w+/, "infra_hash=\u2026")}`,
      );
    }
    return resposta;
  }

  /**
   * O botão pedido. Se esta tela do SEI usa outro nome (a mesma tela "grava"
   * com `sbmCadastrar...` e "altera" com `sbmAlterar...`, e os nomes mudam
   * entre versões), vale o único `sbm*` do formulário — sem ele o SEI apenas
   * redesenha a tela e nada é gravado.
   */
  private botaoDeEnvio(nome: string): [string, string] {
    const b =
      this.elemento.querySelector(`[name="${nome}"]`) ??
      unica([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);
    return b ? [b.getAttribute("name") ?? nome, b.getAttribute("value") ?? textoDe(b) ?? nome] : [nome, nome];
  }

  private hiddenDaLupa(select: string): string | null {
    const par = paresDeLupa(this.pagina.html).find(([s]) => s === select);
    return par ? par[1] : null;
  }

  /** Refaz a serialização que o `infraLupaSelect` faria ao carregar a página. */
  private sincronizarLupas(): void {
    for (const [sel, hdn] of paresDeLupa(this.pagina.html)) {
      const select = this.elemento.querySelector(`select#${cssId(sel)}`);
      if (!select) continue;
      const itens = [...select.querySelectorAll("option")].map((o) => ({
        id: o.getAttribute("value") ?? "",
        texto: textoDe(o),
      }));
      if (!(this.valor(hdn) ?? "")) this.definir({ [hdn]: serializarLupa(itens) });
      // O select da lupa não é "valor" de formulário: o SEI serializa no hdn.
      this.campos = this.campos.filter((c) => c.nome !== sel && c.nome !== `${sel}[]`);
    }
  }
}

function coletar(form: HTMLFormElement): Campo[] {
  const campos: Campo[] = [];
  for (const el of form.querySelectorAll("input, select, textarea")) {
    const nome = el.getAttribute("name");
    if (!nome || el.hasAttribute("disabled")) continue;
    const tag = el.tagName.toLowerCase();
    if (tag === "input") {
      const tipo = (el.getAttribute("type") ?? "text").toLowerCase();
      if (["submit", "button", "image", "reset", "file"].includes(tipo)) continue;
      if ((tipo === "checkbox" || tipo === "radio") && !el.hasAttribute("checked")) continue;
      campos.push({ nome, valor: el.getAttribute("value") ?? (tipo === "checkbox" || tipo === "radio" ? "on" : "") });
    } else if (tag === "textarea") {
      campos.push({ nome, valor: el.textContent ?? "" });
    } else {
      const ops = [...el.querySelectorAll("option")];
      const marcadas = ops.filter((o) => o.hasAttribute("selected"));
      const multiplo = el.hasAttribute("multiple");
      const escolhidas = marcadas.length ? marcadas : !multiplo && ops.length ? [ops[0]] : [];
      for (const o of escolhidas) campos.push({ nome, valor: o.getAttribute("value") ?? textoDe(o) });
    }
  }
  return campos;
}

/** Sem acento, sem caixa, espaços únicos. */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escolhe um item de uma lista (id exato, nome exato ou um único nome que
 * contém o texto) — o mesmo que `escolher()` faz num `<select>`, para as
 * listas que não vêm num select (hipóteses legais por AJAX, tipos, textos
 * padrão). Erra dizendo quais eram as opções.
 */
export function escolherItem<T extends { id: string; texto: string }>(itens: T[], ref: string, oque: string): T {
  const alvo = normalizar(ref);
  const achado =
    itens.find((i) => i.id === ref) ??
    itens.find((i) => normalizar(i.texto) === alvo) ??
    unica(itens.filter((i) => normalizar(i.texto).includes(alvo)));
  if (!achado) throw new ErroSei("ARGUMENTO_INVALIDO", `${oque} "${ref}" n\u00E3o encontrado(a) ou amb\u00EDguo(a).`, itens.slice(0, 40).map((i) => i.texto).join(" | "));
  return achado;
}

function unica<T>(lista: T[]): T | undefined {
  return lista.length === 1 ? lista[0] : undefined;
}

function cssId(id: string): string {
  return id.replace(/([^\w-])/g, "\\$1");
}
