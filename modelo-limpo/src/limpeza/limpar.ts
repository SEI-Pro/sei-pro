/**
 * Limpeza do HTML de uma seção do editor copiada de um modelo.
 *
 * Entra o HTML bruto que o SEI copiou do modelo (com `<style>` e classes do Google Docs, restos do CK4, a
 * marca d'água do SEI Pro) e sai HTML que o CKEditor 5 entende sem perder nada visível: parágrafos com UMA
 * classe permitida na seção, negrito/itálico/sublinhado em `<strong>`/`<em>`/`<u>`, tabelas, imagens, links
 * do SEI. Função pura: não fala com o SEI nem com a página.
 *
 * Ordem das passagens (cada uma depende da anterior):
 *   1. ler as folhas `<style>` e guardar as propriedades de cada elemento, antes de tirar classes;
 *   2. remover o que não é conteúdo (style, script, marca d'água, comentários…);
 *   3. inline: span/font/b/i viram strong/em/u ou somem;
 *   4. listas: `<ol>` vira parágrafos de dispositivo (ou número escrito) e `<ul>` fica lista;
 *   5. blocos: p/h1-h6/div/blockquote viram `<p class="UmaClassePermitida">`;
 *   6. atributos: só os da lista branca de cada tag; tag desconhecida é desembrulhada.
 */

import { classeMaisProxima, tracosDoNome, type Alinhamento, type Tracos } from './classes';
import { emPontos, italico, lerDeclaracoes, lerFolha, negrito, sublinhado, tipoNumeracao, type FolhaModelo, type Propriedades, type TipoNumeracao } from './css';

export interface OpcoesLimpeza {
  /** Classes de parágrafo que a seção aceita (`SecaoEditor.estilos[].classe`). */
  estilos: string[];
  /** Estilo que o SEI dá a um parágrafo novo na seção. */
  estiloPadrao?: string;
  /**
   * Texto das folhas `<style>` das OUTRAS seções do documento. Na página, o `<style>` que o Google Docs
   * deixou no Corpo vale também para os Anexos; sem ele, as classes `c8` dos Anexos não diriam nada.
   */
  folhasDoDocumento?: string[];
  /**
   * Mantém no parágrafo o espaço antes/depois e a entrelinha do modelo, e o alinhamento/recuo que nenhuma
   * classe permitida reproduz. Ligado por padrão; `false` deixa só a classe do órgão.
   */
  preservarEspacamento?: boolean;
  /** Fábrica de documento: `DOMParser` no navegador, linkedom nos testes. */
  criarDocumento?: (html: string) => Document;
}

export interface RelatorioLimpeza {
  folhasRemovidas: number;
  classesTrocadas: number;
  negritosRecuperados: number;
  titulosConvertidos: number;
  listasConvertidas: number;
  listasComNumeroEscrito: number;
  marcaDaguaRemovida: boolean;
}

export interface ResultadoLimpeza {
  html: string;
  relatorio: RelatorioLimpeza;
}

const REMOVER = 'style, script, meta, link, title, head, noscript, iframe, object, embed, form, input, button, select, textarea, template, svg, math, canvas, video, audio';
const BLOCOS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'BLOCKQUOTE', 'CENTER', 'ADDRESS', 'PRE']);
const INLINE = new Set(['SPAN', 'FONT', 'B', 'I', 'STRONG', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'INS', 'SUB', 'SUP', 'MARK', 'SMALL', 'BIG']);
const MANTER = new Set(['P', 'BR', 'STRONG', 'EM', 'U', 'S', 'SUB', 'SUP', 'A', 'IMG', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TD', 'TH', 'CAPTION', 'COLGROUP', 'COL', 'UL', 'LI', 'HR']);
/** Classe com cara de estilo do SEI: `Palavra_Palavra`, começando por maiúscula. */
const CLASSE_SEI = /^[A-Z][A-Za-z]*(_[A-Za-z0-9]+)+$/;
/** Espaço inseparável. Constante, não regex: o esbuild escreve o caractere cru dentro de regex literal. */
const NBSP = String.fromCharCode(160);
const RECUO_MINIMO_PT = 5;
/** Recuo esquerdo a partir do qual o parágrafo é deslocado de propósito (ementa, autoria, fecho). */
const MARGEM_MINIMA_PT = 50;

/** Texto de todos os `<style>` de um HTML de seção, para passar às outras seções em `folhasDoDocumento`. */
export function folhasDaSecao(html: string, criar: (html: string) => Document = documentoPadrao): string[] {
  const doc = criar(`<!doctype html><html><head></head><body>${html}</body></html>`);
  return [...doc.body.querySelectorAll('style')].filter((s) => s.getAttribute('data-style') !== 'seipro-watermark').map((s) => s.textContent ?? '');
}

function documentoPadrao(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

export function limparSecao(html: string, op: OpcoesLimpeza): ResultadoLimpeza {
  const criar = op.criarDocumento ?? documentoPadrao;
  const doc = criar(`<!doctype html><html><head></head><body>${html}</body></html>`);
  const raiz = doc.body;
  const permitidas = op.estilos.filter(Boolean);
  const aceita = (c: string) => permitidas.includes(c) || c === op.estiloPadrao;
  const relatorio: RelatorioLimpeza = {
    folhasRemovidas: 0,
    classesTrocadas: 0,
    negritosRecuperados: 0,
    titulosConvertidos: 0,
    listasConvertidas: 0,
    listasComNumeroEscrito: 0,
    marcaDaguaRemovida: false,
  };

  // 1. Folhas e propriedades de cada elemento, enquanto as classes ainda estão lá.
  const folhas = [...raiz.querySelectorAll('style')];
  const folha = lerFolha([...(op.folhasDoDocumento ?? []), ...folhas.map((s) => s.textContent ?? '')]);
  relatorio.folhasRemovidas = folhas.filter((s) => s.getAttribute('data-style') !== 'seipro-watermark').length;
  const props = new Map<Element, Propriedades>();
  for (const el of raiz.querySelectorAll('*')) props.set(el, propriedades(el, folha));
  const de = (el: Element) => props.get(el) ?? {};

  // 2. Marca d'água do SEI Pro (o parágrafo inteiro) e o que não é conteúdo.
  for (const ancora of [...raiz.querySelectorAll('.minutaAncora, style[data-style="seipro-watermark"]')]) {
    relatorio.marcaDaguaRemovida = true;
    const p = ancora.parentElement;
    ancora.remove();
    if (p && p !== raiz && p.tagName === 'P' && !p.textContent?.replaceAll(NBSP, '').trim() && !p.querySelector('img')) p.remove();
  }
  for (const el of [...raiz.querySelectorAll(REMOVER)]) el.remove();
  removerComentarios(raiz);

  // 3. Inline, de dentro para fora.
  for (const el of [...raiz.querySelectorAll('*')].reverse()) {
    const tag = el.tagName.toUpperCase();
    if (tag.includes(':')) {
      desembrulhar(el); // <o:p> e afins do Word
      continue;
    }
    if (!INLINE.has(tag)) continue;
    const p = de(el);
    const bold = tag === 'B' || tag === 'STRONG' ? negrito(p) !== false : negrito(p) === true;
    const ital = tag === 'I' || tag === 'EM' ? italico(p) !== false : italico(p) === true;
    const sub = tag === 'U' || tag === 'INS' ? sublinhado(p) !== false : sublinhado(p) === true;
    const risc = tag === 'S' || tag === 'STRIKE' || tag === 'DEL';
    if (tag === 'SUB' || tag === 'SUP') {
      limparAtributos(el);
      continue;
    }
    let conteudo: Node[] = [...el.childNodes];
    const envolver = (nome: string) => {
      const novo = doc.createElement(nome);
      for (const n of conteudo) novo.append(n);
      conteudo = [novo];
    };
    if (risc) envolver('s');
    if (sub) envolver('u');
    if (ital) envolver('em');
    if (bold) {
      envolver('strong');
      if (tag === 'SPAN' || tag === 'FONT') relatorio.negritosRecuperados++;
    }
    el.replaceWith(...conteudo);
  }

  // 4. Listas (em ordem de documento, com os contadores dos estilos de dispositivo).
  // `original` simula a numeração que o modelo mostrava; `contadores`, a que o resultado vai mostrar.
  const original = novosContadores();
  const contadores = novosContadores();
  for (const el of [...raiz.querySelectorAll('p, ol, ul')]) {
    if (!raiz.contains(el)) continue;
    if (el.tagName === 'P') {
      const classe = primeiraClasseSei(el);
      contar(original, classe);
      if (!classe || !ehDispositivo(classe)) continue;
      if (aceita(classe)) {
        contar(contadores, classe);
      } else {
        // Seção não aceita o estilo: o número que o CSS desenhava vira texto, senão some.
        const texto = numeroDoDispositivo(original, classe);
        if (texto) el.prepend(doc.createTextNode(texto));
      }
      continue;
    }
    if (el.parentElement?.closest('ol, ul')) continue; // aninhada: tratada pela de fora
    converterLista(el, 0);
  }

  // 5. Blocos.
  for (const el of [...raiz.querySelectorAll([...BLOCOS].map((t) => t.toLowerCase()).join(', '))].reverse()) {
    if (!raiz.contains(el)) continue;
    const tag = el.tagName.toUpperCase();
    if (el.getAttribute('data-spro-pronto') !== null) {
      el.removeAttribute('data-spro-pronto');
      continue;
    }
    if ((tag === 'DIV' || tag === 'CENTER' || tag === 'BLOCKQUOTE') && el.querySelector('p, table, ul, ol, h1, h2, h3, h4, h5, h6, div')) {
      desembrulhar(el);
      continue;
    }
    if (/^H[1-6]$/.test(tag)) relatorio.titulosConvertidos++;
    el.replaceWith(paragrafo(el, de(el), tag));
  }

  // 6. Atributos e tags fora da lista.
  for (const el of [...raiz.querySelectorAll('*')].reverse()) {
    const tag = el.tagName.toUpperCase();
    if (!MANTER.has(tag)) {
      desembrulhar(el);
      continue;
    }
    if (tag === 'P') {
      const classe = el.getAttribute('class');
      if (classe && !aceita(classe) && permitidas.length) {
        if (op.estiloPadrao) el.setAttribute('class', op.estiloPadrao);
        else el.removeAttribute('class');
      }
      continue;
    }
    if (tag === 'A') {
      if (!limparLink(el)) desembrulhar(el);
      continue;
    }
    if (tag === 'IMG') {
      if (!limparImagem(el, de(el))) el.remove();
      continue;
    }
    if (tag === 'TD' || tag === 'TH') {
      limparCelula(el, de(el));
      continue;
    }
    if (tag === 'TABLE') {
      limparTabela(el);
      continue;
    }
    if (tag === 'COL') {
      const largura = el.getAttribute('width');
      limparAtributos(el);
      if (largura) el.setAttribute('width', largura);
      continue;
    }
    limparAtributos(el);
  }

  // O navegador serializa o espaço inseparável como `&nbsp;` (como o SEI grava); o linkedom, como `&#160;`.
  return { html: raiz.innerHTML.replace(/&#160;/g, '&nbsp;').replaceAll(NBSP, '&nbsp;').trim(), relatorio };

  // ---------------------------------------------------------------------------------------------

  function paragrafo(el: Element, p: Propriedades, tag: string): Element {
    const novo = doc.createElement('p');
    const naTabela = !!el.closest('td, th');
    const sei = primeiraClasseSei(el);
    let classe: string | undefined;
    let negritoDaClasse = false;
    let maiusculasDaClasse = false;
    const titulo = /^H[1-6]$/.test(tag);

    if (sei && aceita(sei)) {
      classe = sei;
    } else {
      const tracos: Tracos = sei ? tracosDoNome(sei) : tracosDasPropriedades(p, naTabela, tag);
      if (sei) {
        if (!tracos.alinhamento && op.estiloPadrao) tracos.alinhamento = tracosDoNome(op.estiloPadrao).alinhamento;
        negritoDaClasse = tracos.extras.has('negrito');
        maiusculasDaClasse = tracos.extras.has('maiusculas');
      }
      classe = classeMaisProxima(tracos, permitidas) ?? op.estiloPadrao ?? (permitidas.length ? undefined : sei);
      if (classe && sei !== classe) relatorio.classesTrocadas++;
      // O que a classe de origem fazia e a escolhida não faz vai para o texto.
      if (classe) {
        const escolhida = tracosDoNome(classe).extras;
        if (escolhida.has('negrito')) negritoDaClasse = false;
        if (escolhida.has('maiusculas')) maiusculasDaClasse = false;
      }
    }
    if (classe) novo.setAttribute('class', classe);

    const estilo = estiloInline(p, classe, naTabela, tracosDasPropriedades(p, naTabela, tag), true);
    if (estilo) novo.setAttribute('style', estilo);

    for (const n of [...el.childNodes]) novo.append(n);
    // Título sem regra no modelo: o navegador desenhava h1-h3 em negrito.
    const tituloNegritoPadrao = /^H[1-3]$/.test(tag) && !folha.elementos.has(tag.toLowerCase()) && negrito(p) !== false;
    const blocoNegrito = negrito(p) === true || (titulo && tituloNegritoPadrao);
    if ((blocoNegrito || negritoDaClasse) && temTexto(novo) && !todoEmNegrito(novo)) {
      const forte = doc.createElement('strong');
      for (const n of [...novo.childNodes]) forte.append(n);
      novo.append(forte);
    }
    if (p['text-transform']?.toLowerCase() === 'uppercase' || maiusculasDaClasse) {
      if (!classe || !tracosDoNome(classe).extras.has('maiusculas')) maiusculas(novo);
    }
    return novo;
  }

  /**
   * O que a classe escolhida não reproduz e precisa ir no próprio parágrafo:
   *   - recuo esquerdo grande (ementa, autoria), como o tipo de documento do órgão já faz;
   *   - com `preservarEspacamento`: espaço antes/depois e entrelinha do modelo, e alinhamento/recuo da 1ª
   *     linha quando nenhuma classe permitida os tem (`comAlinhamento`; itens de lista não usam).
   */
  function estiloInline(p: Propriedades, classe: string | undefined, naTabela: boolean, origem: Tracos, comAlinhamento: boolean): string {
    const d: string[] = [];
    const daClasse = classe ? tracosDoNome(classe) : undefined;
    const margem = emPontos(p['margin-left']);
    if (!naTabela && margem >= MARGEM_MINIMA_PT && !daClasse?.extras.has('citacao')) d.push(`margin-left: ${p['margin-left']}`);
    if (op.preservarEspacamento === false) return d.length ? `${d.join('; ')};` : '';
    if (comAlinhamento && origem.alinhamento && daClasse?.alinhamento !== origem.alinhamento) d.push(`text-align: ${origem.alinhamento}`);
    if (comAlinhamento && origem.recuo && !daClasse?.recuo) d.push(`text-indent: ${p['text-indent']}`);
    const antes = espaco(p['padding-top'], p['margin-top']);
    if (antes) d.push(`margin-top: ${antes}`);
    const depois = espaco(p['padding-bottom'], p['margin-bottom']);
    if (depois) d.push(`margin-bottom: ${depois}`);
    const entrelinha = p['line-height']?.trim();
    if (entrelinha && entrelinha !== 'normal' && !entrelinhaNormal(entrelinha)) d.push(`line-height: ${entrelinha}`);
    return d.length ? `${d.join('; ')};` : '';
  }

  function converterLista(lista: Element, nivel: number) {
    const tipo = tipoDaLista(lista);
    const itens = [...lista.children].filter((c) => c.tagName === 'LI');
    if (tipo.tipo === 'disc') {
      const ul = doc.createElement('ul');
      const sublistas: Element[] = [];
      for (const li of itens) {
        const novoLi = doc.createElement('li');
        for (const n of conteudoDoItem(li)) novoLi.append(n);
        ul.append(novoLi);
        for (const sub of sublistasDe(li)) {
          novoLi.append(sub);
          sublistas.push(sub);
        }
      }
      lista.replaceWith(ul);
      for (const sub of sublistas) converterLista(sub, nivel + 1);
      relatorio.listasConvertidas++;
      return;
    }
    const inicio = Number.parseInt(lista.getAttribute('start') ?? '1', 10) || 1;
    const nivelLista = nivelDaLista(lista) ?? nivel;
    const classeDispositivo = dispositivo(tipo.tipo, nivelLista);
    const usarClasse = !!classeDispositivo && aceita(classeDispositivo) && numeracaoBate(contadores, classeDispositivo, inicio);
    const classeTexto = classeMaisProxima({ tabela: !!lista.closest('td, th'), alinhamento: 'justify', recuo: true, extras: new Set() }, permitidas) ?? op.estiloPadrao;
    const saida: Node[] = [];
    const sublistas: Element[] = [];
    itens.forEach((li, i) => {
      const p = doc.createElement('p');
      p.setAttribute('data-spro-pronto', '');
      const conteudo = conteudoDoItem(li);
      if (usarClasse && classeDispositivo) {
        p.setAttribute('class', classeDispositivo);
        contar(contadores, classeDispositivo);
      } else {
        if (classeTexto) p.setAttribute('class', classeTexto);
        p.append(doc.createTextNode(numero(inicio + i, tipo.tipo) + sufixo(tipo)));
      }
      const estiloItem = estiloInline(de(li), p.getAttribute('class') ?? undefined, !!lista.closest('td, th'), tracosDasPropriedades({}, false, 'LI'), false);
      if (estiloItem) p.setAttribute('style', estiloItem);
      if (negrito(de(li)) === true && conteudo.length) {
        const forte = doc.createElement('strong');
        for (const n of conteudo) forte.append(n);
        p.append(forte);
      } else {
        for (const n of conteudo) p.append(n);
      }
      saida.push(p);
      // Sublista vem logo depois do item, já fora dele, e é convertida em seguida.
      for (const sub of sublistasDe(li)) {
        saida.push(sub);
        sublistas.push(sub);
      }
    });
    lista.replaceWith(...saida);
    for (const sub of sublistas) converterLista(sub, nivelLista + 1);
    relatorio.listasConvertidas++;
    if (!usarClasse) relatorio.listasComNumeroEscrito++;
  }

  /** Conteúdo inline de um `<li>`: parágrafos internos viram texto separado por `<br>`; sublistas ficam de fora. */
  function conteudoDoItem(li: Element): Node[] {
    const saida: Node[] = [];
    for (const n of [...li.childNodes]) {
      if (n.nodeType === 1 && /^(OL|UL)$/.test((n as Element).tagName)) continue;
      if (n.nodeType === 1 && BLOCOS.has((n as Element).tagName)) {
        if (saida.some((x) => x.nodeType === 1 || x.textContent?.trim())) saida.push(doc.createElement('br'));
        for (const m of [...n.childNodes]) saida.push(m);
        continue;
      }
      saida.push(n);
    }
    return saida;
  }

  function tipoDaLista(lista: Element): { tipo: TipoNumeracao; sufixo?: string } {
    for (const c of [...lista.classList]) {
      const n = folha.listas.get(c);
      if (n) return n;
    }
    const porAtributo = tipoNumeracao(lista.getAttribute('type'));
    if (porAtributo) return { tipo: porAtributo };
    const porEstilo = tipoNumeracao(lerDeclaracoes(lista.getAttribute('style') ?? '')['list-style-type'] ?? de(lista)['list-style-type']);
    if (porEstilo) return { tipo: porEstilo };
    return { tipo: lista.tagName === 'UL' ? 'disc' : 'decimal' };
  }
}

// -----------------------------------------------------------------------------------------------
// Propriedades e traços

function propriedades(el: Element, folha: FolhaModelo): Propriedades {
  const tag = el.tagName.toLowerCase();
  let p: Propriedades = { ...folha.elementos.get(tag) };
  for (const c of [...el.classList]) {
    const daClasse = folha.classes.get(c);
    if (daClasse) p = { ...p, ...daClasse };
  }
  const inline = el.getAttribute('style');
  if (inline) p = { ...p, ...lerDeclaracoes(inline) };
  const align = el.getAttribute('align');
  if (align && !p['text-align']) p['text-align'] = align;
  return p;
}

function tracosDasPropriedades(p: Propriedades, naTabela: boolean, tag: string): Tracos {
  const bruto = p['text-align']?.toLowerCase();
  const mapa: Record<string, Alinhamento> = { justify: 'justify', center: 'center', middle: 'center', left: 'left', start: 'left', right: 'right', end: 'right' };
  let alinhamento: Alinhamento | undefined = bruto ? mapa[bruto] : undefined;
  if (!alinhamento && (tag === 'CENTER' || /^H[1-3]$/.test(tag))) alinhamento = tag === 'CENTER' ? 'center' : undefined;
  return { tabela: naTabela, alinhamento, recuo: emPontos(p['text-indent']) >= RECUO_MINIMO_PT, extras: new Set() };
}

/**
 * Espaço vertical do parágrafo: o Google Docs usa `padding`, o Word e o SEI usam `margin`. Um valor só sai
 * como veio (idempotente); os dois juntos são somados em pontos. Zero não sai.
 */
function espaco(padding: string | undefined, margem: string | undefined): string | undefined {
  const valores = [padding, margem].filter((v): v is string => !!v && emPontos(v) > 0);
  if (!valores.length) return undefined;
  if (valores.length === 1) return valores[0].trim();
  return `${Math.round(valores.reduce((s, v) => s + emPontos(v), 0) * 10) / 10}pt`;
}

/** Entrelinha que o navegador já usa para Arial (`normal` ≈ 1,15): não vale a pena gravar. */
function entrelinhaNormal(v: string): boolean {
  const n = Number(v);
  return Number.isFinite(n) && Math.abs(n - 1.15) < 0.051;
}

function sublistasDe(li: Element): Element[] {
  return [...li.children].filter((c) => c.tagName === 'OL' || c.tagName === 'UL');
}

function ehDispositivo(classe: string): boolean {
  return /^(Item_Inciso_Romano|Item_Alinea_Letra|Item_Nivel\d|Paragrafo_Numerado_Nivel\d)$/.test(classe);
}

/** O número que o CSS do SEI desenhava antes do parágrafo, com os contadores já incrementados por ele. */
function numeroDoDispositivo(c: Contadores, classe: string): string | undefined {
  if (classe === 'Item_Inciso_Romano') return `${romano(c.romano)} - `;
  if (classe === 'Item_Alinea_Letra') return `${letra(c.letra)}) `;
  const m = /^(Paragrafo_Numerado|Item)_Nivel(\d)$/.exec(classe);
  if (!m) return undefined;
  const vetor = m[1] === 'Item' ? c.item : c.paragrafo;
  return `${vetor.slice(0, Number(m[2])).join('.')}. `;
}

function primeiraClasseSei(el: Element): string | undefined {
  return [...el.classList].find((c) => CLASSE_SEI.test(c));
}

// -----------------------------------------------------------------------------------------------
// Contadores dos estilos de dispositivo (mesmas regras do CSS do SEI: Item_Inciso_Romano zera as alíneas,
// os níveis zeram incisos e alíneas). Servem para só usar a classe quando a numeração que ela vai mostrar
// é a mesma da lista original.

interface Contadores {
  romano: number;
  letra: number;
  paragrafo: number[];
  item: number[];
}

function novosContadores(): Contadores {
  return { romano: 0, letra: 0, paragrafo: [0, 0, 0, 0], item: [0, 0, 0, 0] };
}

function contar(c: Contadores, classe: string | undefined) {
  if (!classe) return;
  if (classe === 'Item_Inciso_Romano') {
    c.romano++;
    c.letra = 0;
  } else if (classe === 'Item_Inciso_Romano_Reset') {
    c.romano = 0;
    c.letra = 0;
  } else if (classe === 'Item_Alinea_Letra') {
    c.letra++;
  } else if (classe === 'Item_Alinea_Reset') {
    c.letra = 0;
  } else {
    const m = /^(Paragrafo_Numerado|Item)_Nivel(\d)$/.exec(classe);
    if (!m) return;
    const vetor = m[1] === 'Item' ? c.item : c.paragrafo;
    const n = Number(m[2]) - 1;
    vetor[n]++;
    for (let i = n + 1; i < vetor.length; i++) vetor[i] = 0;
    c.romano = 0;
    c.letra = 0;
  }
}

function numeracaoBate(c: Contadores, classe: string, inicio: number): boolean {
  if (classe === 'Item_Inciso_Romano') return c.romano + 1 === inicio;
  if (classe === 'Item_Alinea_Letra') return c.letra + 1 === inicio;
  if (classe === 'Paragrafo_Numerado_Nivel1') return c.paragrafo[0] + 1 === inicio;
  return false;
}

/** Classe de dispositivo para o tipo de numeração. Decimal só no primeiro nível: abaixo, o SEI mostra "1.2.", não "1)". */
function dispositivo(tipo: TipoNumeracao, nivel: number): string | undefined {
  if (tipo === 'lower-latin' || tipo === 'upper-latin') return 'Item_Alinea_Letra';
  if (tipo === 'lower-roman' || tipo === 'upper-roman') return 'Item_Inciso_Romano';
  if (tipo === 'decimal' && nivel === 0) return 'Paragrafo_Numerado_Nivel1';
  return undefined;
}

function nivelDaLista(lista: Element): number | undefined {
  for (const c of [...lista.classList]) {
    const m = /^lst-kix_[\w]+-(\d+)$/.exec(c);
    if (m) return Number(m[1]);
  }
  return undefined;
}

// -----------------------------------------------------------------------------------------------
// Números escritos

export function numero(n: number, tipo: TipoNumeracao): string {
  if (tipo === 'lower-roman') return romano(n).toLowerCase();
  if (tipo === 'upper-roman') return romano(n);
  if (tipo === 'lower-latin') return letra(n);
  if (tipo === 'upper-latin') return letra(n).toUpperCase();
  return String(n);
}

function sufixo(t: { tipo: TipoNumeracao; sufixo?: string }): string {
  if (t.sufixo && t.sufixo.trim()) return t.sufixo.endsWith(' ') ? t.sufixo.replace(/\s+$/, ' ') : `${t.sufixo} `;
  if (t.tipo === 'lower-roman' || t.tipo === 'upper-roman') return ' - ';
  if (t.tipo === 'lower-latin' || t.tipo === 'upper-latin') return ') ';
  return '. ';
}

function romano(n: number): string {
  const tabela: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let s = '';
  let resto = n;
  for (const [v, l] of tabela) {
    while (resto >= v) {
      s += l;
      resto -= v;
    }
  }
  return s;
}

function letra(n: number): string {
  let s = '';
  let resto = n;
  while (resto > 0) {
    resto--;
    s = String.fromCharCode(97 + (resto % 26)) + s;
    resto = Math.floor(resto / 26);
  }
  return s;
}

// -----------------------------------------------------------------------------------------------
// Utilidades de DOM

function desembrulhar(el: Element) {
  el.replaceWith(...el.childNodes);
}

function limparAtributos(el: Element) {
  for (const a of [...el.attributes]) el.removeAttribute(a.name);
}

function removerComentarios(no: Node) {
  for (const n of [...no.childNodes]) {
    if (n.nodeType === 8) n.parentNode?.removeChild(n);
    else if (n.nodeType === 1) removerComentarios(n);
  }
}

function temTexto(el: Element): boolean {
  return !!el.textContent?.replaceAll(NBSP, ' ').trim();
}

/** Todo o texto do parágrafo já está dentro de `<strong>`? */
function todoEmNegrito(el: Element): boolean {
  const semForte = (n: Node): boolean => {
    if (n.nodeType === 3) return !!n.textContent?.replaceAll(NBSP, ' ').trim();
    if (n.nodeType !== 1) return false;
    if ((n as Element).tagName === 'STRONG') return false;
    return [...n.childNodes].some(semForte);
  };
  return ![...el.childNodes].some(semForte);
}

function maiusculas(no: Node) {
  for (const n of [...no.childNodes]) {
    if (n.nodeType === 3) n.textContent = (n.textContent ?? '').toLocaleUpperCase('pt-BR');
    else if (n.nodeType === 1) maiusculas(n);
  }
}

function limparLink(a: Element): boolean {
  const href = a.getAttribute('href') ?? '';
  const classe = a.classList.contains('ancoraSei') ? 'ancoraSei' : '';
  const id = a.getAttribute('id') ?? '';
  limparAtributos(a);
  let destino = href.trim();
  // Link do Google Docs passa por um redirecionador: fica o endereço real.
  const google = /^https?:\/\/(?:www\.)?google\.com\/url\?(?:.*&)?q=([^&]+)/i.exec(destino);
  if (google) {
    try {
      destino = decodeURIComponent(google[1]);
    } catch {
      /* fica o original */
    }
  }
  const valido = /^(https?:|mailto:)/i.test(destino);
  if (valido) a.setAttribute('href', destino);
  if (classe) a.setAttribute('class', classe);
  if (classe && /^lnkSei\d+$/.test(id)) a.setAttribute('id', id);
  return valido || !!classe;
}

function limparImagem(img: Element, p: Propriedades): boolean {
  const src = img.getAttribute('src') ?? '';
  const alt = img.getAttribute('alt');
  const estilo = lerDeclaracoesLivres(img.getAttribute('style') ?? '');
  const largura = img.getAttribute('width') ?? px(estilo.width);
  const altura = img.getAttribute('height') ?? px(estilo.height);
  limparAtributos(img);
  void p;
  if (!/^(data:image\/|https?:)/i.test(src)) return false;
  img.setAttribute('src', src);
  if (alt) img.setAttribute('alt', alt);
  if (largura) img.setAttribute('width', largura);
  if (altura) img.setAttribute('height', altura);
  return true;
}

function limparCelula(td: Element, p: Propriedades) {
  const colspan = td.getAttribute('colspan');
  const rowspan = td.getAttribute('rowspan');
  const temBorda = borda(p);
  limparAtributos(td);
  if (colspan && colspan !== '1') td.setAttribute('colspan', colspan);
  if (rowspan && rowspan !== '1') td.setAttribute('rowspan', rowspan);
  if (temBorda) td.setAttribute('style', 'border: 1px solid #000000;');
}

function limparTabela(t: Element) {
  const manter = ['border', 'cellpadding', 'cellspacing', 'width', 'align'];
  const valores = manter.map((n) => [n, t.getAttribute(n)] as const);
  limparAtributos(t);
  for (const [n, v] of valores) if (v !== null) t.setAttribute(n, v);
}

function borda(p: Propriedades): boolean {
  if (p.border) return !/^(none|0(\w+)?|hidden)\b/i.test(p.border.trim());
  const larguras = ['border-width', 'border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width'].map((k) => p[k]).filter(Boolean);
  const estilo = (p['border-style'] ?? p['border-top-style'] ?? 'solid').toLowerCase();
  return estilo !== 'none' && larguras.some((l) => emPontos(l) > 0);
}

function lerDeclaracoesLivres(texto: string): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const parte of texto.split(';')) {
    const i = parte.indexOf(':');
    if (i > 0) saida[parte.slice(0, i).trim().toLowerCase()] = parte.slice(i + 1).trim();
  }
  return saida;
}

function px(valor: string | undefined): string | null {
  if (!valor) return null;
  const m = /^([\d.]+)px$/i.exec(valor.trim());
  return m ? String(Math.round(Number.parseFloat(m[1]))) : null;
}
