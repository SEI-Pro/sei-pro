/**
 * O conteúdo da coluna "Prazos" do Controle de Processos. O esqueleto (th/td `.prazoBoxDisplay`,
 * tablesorter, agrupamento) continua do legado: aqui só se preenche a célula e se atende ao clique.
 * O contrato com o legado é o DOM de `getDatesPreview`: `.dateboxDisplay[data-time-sorter]` (o
 * tablesorter e o "agrupar por prazo" leem essa data) e as classes `infraTrAtrasada`/`infraTrAlerta`
 * na linha.
 */
import { icone, type NomeIcone } from '../../../sei-comum/src/ui/dom';
import { type DataISO } from '../../../sei-comum/src/datas/dias';
import { resumir } from '../modelo/situacao';
import type { Situacao } from '../modelo/tipos';
import { TABELAS } from './linha';
import type { ServicoPrazos } from './servico';

const SELETOR_CELULA = 'td.prazoBoxDisplay';
const ATRASO = 40;

const MARCA: Record<Situacao, { classe: string; icone: NomeIcone }> = {
  noPrazo: { classe: 'date_noprazo', icone: 'relogio' },
  hoje: { classe: 'date_hoje', icone: 'alerta' },
  atrasado: { classe: 'date_atrasado', icone: 'alerta' },
  desde: { classe: 'date_vencido', icone: 'historico' },
  concluido: { classe: 'date_entregue', icone: 'check' },
};

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, classe: string, texto?: string): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

/** Linhas do Controle de Processos que têm a célula da coluna. */
function linhas(doc: Document): Element[] {
  return [...doc.querySelectorAll(TABELAS)].flatMap((t) => [...t.querySelectorAll('tr[id^="P"]')]).filter((tr) => tr.querySelector(SELETOR_CELULA));
}

function sincronizarCartao(doc: Document, id: string, celula: HTMLElement): void {
  const destino = doc.querySelector(`#processosKanban .kanban-item[data-eid="${id}"] [data-type="prazo"]`);
  if (!destino) return;
  const chave = celula.getAttribute('data-spro-prazo') ?? '';
  if (destino.getAttribute('data-spro-prazo') !== chave) {
    destino.setAttribute('data-spro-prazo', chave);
    destino.replaceChildren(...[...celula.childNodes].map((n) => n.cloneNode(true)));
  }
}

export function desenharCelula(doc: Document, tr: Element, servico: ServicoPrazos, hoje: DataISO): void {
  const celula = tr.querySelector(SELETOR_CELULA) as HTMLElement | null;
  if (!celula) return;
  const id = tr.id.replace(/^P/, '');
  const prazo = servico.ler(id);
  if (!prazo) {
    const sem = tr.querySelector('input[type=checkbox]')?.hasAttribute('disabled');
    const chave = sem ? 'vazio-bloqueado' : 'vazio';
    if (celula.getAttribute('data-spro-prazo') !== chave) {
      celula.setAttribute('data-spro-prazo', chave);
      celula.replaceChildren();
      if (!sem) {
        const a = el(doc, 'a', 'addControlePrazo spro-prazo-vazio');
        a.setAttribute('role', 'button');
        a.setAttribute('tabindex', '0');
        const i = icone('relogio', 14, doc);
        i.classList.add('spro-prazo-icone');
        a.append(i, doc.createTextNode(' Adicionar prazo'));
        celula.append(a);
      }
    }
    tr.classList.remove('infraTrAtrasada', 'infraTrAlerta');
    sincronizarCartao(doc, id, celula);
    return;
  }
  const r = resumir(prazo, hoje);
  const chave = `${r.sorter}|${r.texto}|${r.dica}|${prazo.origem}`;
  if (celula.getAttribute('data-spro-prazo') !== chave) {
    celula.setAttribute('data-spro-prazo', chave);
    const marca = MARCA[r.situacao];
    const caixa = el(doc, 'span', `dateboxDisplay spro-prazo spro-prazo-${r.situacao} tagTableText_${marca.classe}`);
    caixa.setAttribute('data-time-sorter', r.sorter);
    caixa.setAttribute('data-duesetdate', String(!!prazo.vencimento));
    caixa.setAttribute('data-nametag', r.situacao);
    caixa.setAttribute('role', 'button');
    caixa.setAttribute('tabindex', '0');
    caixa.title = r.dica;
    const i = icone(marca.icone, 14, doc);
    i.classList.add('spro-prazo-icone');
    caixa.append(i, doc.createTextNode(` ${r.texto}`));
    celula.replaceChildren(caixa);
  }
  tr.classList.toggle('infraTrAtrasada', r.situacao === 'atrasado');
  tr.classList.toggle('infraTrAlerta', r.situacao === 'hoje');
  sincronizarCartao(doc, id, celula);
}

export function iniciarCelulas(doc: Document, servico: ServicoPrazos, hoje: () => DataISO, abrir: (ids: string[]) => void) {
  const janela = doc.defaultView;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let observador: MutationObserver | undefined;
  let ligado = false;

  const toca = (no: Node) => {
    if (no.nodeType !== 1) return false;
    const e = no as Element;
    return e.matches?.('tr, td, th, table, tbody') || !!e.querySelector?.(`tr, ${SELETOR_CELULA}`);
  };

  function desenhar() {
    timer = undefined;
    if (!ligado) return;
    observador?.disconnect();
    const dia = hoje();
    for (const tr of linhas(doc)) desenharCelula(doc, tr, servico, dia);
    observar();
  }
  function agendar() {
    if (!ligado || timer !== undefined) return;
    timer = setTimeout(desenhar, ATRASO);
  }
  function observar() {
    if (!janela || !doc.body) return;
    observador ??= new janela.MutationObserver((rs) => {
      if (rs.some((m) => [...m.addedNodes].some(toca) || [...m.removedNodes].some(toca))) agendar();
    });
    observador.observe(doc.body, { childList: true, subtree: true });
  }
  function aoClicar(ev: Event) {
    const alvo = ev.target as Element | null;
    const celula = alvo?.closest?.(SELETOR_CELULA);
    if (celula?.closest(TABELAS)) {
      const tr = celula.closest('tr[id^="P"]');
      if (!tr) return;
      // Em captura e parando aqui: o link "Adicionar prazo" que o legado deixou (com onclick) não abre outro modal.
      ev.preventDefault();
      ev.stopPropagation();
      abrir([tr.id.replace(/^P/, '')]);
      return;
    }
    const item = alvo?.closest?.('#processosKanban .kanban-item');
    if (item && alvo?.closest?.('[data-type="prazo"] .addControlePrazo, [data-type="prazo"] .dateboxDisplay')) {
      const id = item.getAttribute('data-eid');
      if (!id) return;
      ev.preventDefault();
      ev.stopPropagation();
      abrir([id]);
    }
  }
  function aoTeclar(ev: Event) {
    const k = (ev as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') aoClicar(ev);
  }
  const retirar = servico.aoMudar(agendar);

  return {
    ligar() {
      if (ligado) return;
      ligado = true;
      doc.addEventListener('click', aoClicar, true);
      doc.addEventListener('keydown', aoTeclar, true);
      desenhar();
    },
    desligar() {
      ligado = false;
      clearTimeout(timer);
      timer = undefined;
      observador?.disconnect();
      doc.removeEventListener('click', aoClicar, true);
      doc.removeEventListener('keydown', aoTeclar, true);
      for (const celula of doc.querySelectorAll(`${SELETOR_CELULA}[data-spro-prazo], #processosKanban [data-type="prazo"][data-spro-prazo]`)) {
        celula.removeAttribute('data-spro-prazo');
        celula.replaceChildren();
      }
    },
    redesenhar: desenhar,
    encerrar() {
      this.desligar();
      retirar();
    },
  };
}
