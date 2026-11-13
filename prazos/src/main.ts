/**
 * Content script isolado: o prazo do Controle de Processos. Só age em `procedimento_controlar` e com a
 * opção "Controlar Prazos" (`gerenciarprazos`, ligada por padrão) marcada, ao vivo.
 *
 * Ponte com o legado (que roda no mundo da página): o módulo marca `<html data-spro-prazos="1">`; com a marca,
 * `setControlePrazo` deixa as células vazias e `addControlePrazo` delega por `spro-prazos-abrir`
 * (`data-spro-prazos-alvo` = id da linha, ou vazio para as linhas marcadas). Só strings atravessam o
 * limite dos mundos. Sem a marca (oficial, Firefox) o legado age como sempre.
 */
import { hojeISO } from '../../sei-comum/src/datas/dias';
import { conjuntoDeFeriados } from '../../sei-comum/src/datas/feriados';
import { opcaoLegadaLigada } from '../../sei-comum/src/opcoes/legadas';
import { temaEscuroLegado } from '../../sei-comum/src/pagina/tema';
import cssBase from '../../sei-comum/src/ui/base.css';
import { definirMarcador } from '../../sei-nucleo/src/dominio/acoesProcesso';
import { Sei } from '../../sei-nucleo/src/sei';
import { paginaDe } from '../../sei-nucleo/src/sessao/pagina';
import { iniciarCelulas } from './pagina/celulas';
import { idsSelecionados, protocoloDaLinha } from './pagina/linha';
import { carregarMarcadores } from './pagina/marcadores';
import { abrirModal } from './pagina/modal';
import { ServicoPrazos } from './pagina/servico';
import cssModal from './modal.css';
import css from './style.css';

const OPCAO = 'gerenciarprazos';
const MARCA = 'data-spro-prazos';
const ALVO = 'data-spro-prazos-alvo';

function montar() {
  if (new URL(location.href).searchParams.get('acao') !== 'procedimento_controlar') return;
  const raiz = document.documentElement;
  const sei = new Sei(location.href, () => paginaDe(document, location.href));
  const servico = new ServicoPrazos({
    doc: document,
    url: location.href,
    http: sei.http,
    hoje: () => hojeISO(),
    feriados: (hoje) => conjuntoDeFeriados(Array.from({ length: 4 }, (_, i) => Number(hoje.slice(0, 4)) + i)),
    escreverMarcador: async (protocolo, marcador, texto) => {
      await definirMarcador(sei, protocolo, { marcador, texto }, { aplicar: true });
    },
  });

  function abrir(alvos: string[]) {
    const ids = alvos.length ? alvos : idsSelecionados(document);
    const um = ids.length === 1 ? ids[0]! : null;
    const tr = um ? document.querySelector(`tr#P${um}`) : null;
    abrirModal(document, ids, servico, () => hojeISO(), {
      css: `${cssBase}\n${cssModal}`,
      escuro: !!document.body?.classList.contains('dark-mode') || temaEscuroLegado(localStorage),
      titulo: um ? `Prazo do processo ${tr ? protocoloDaLinha(tr) : um}` : ids.length ? `Prazo em ${ids.length} processos` : 'Prazo em processos',
      marcadores: ids.length ? () => carregarMarcadores(sei.http, document, location.href, ids[0]!) : undefined,
      inicial: um ? { prazo: servico.ler(um), marcador: servico.marcadorDoPrazo(um) } : undefined,
      // O legado desmarcava as linhas depois de gravar; o clique real atualiza a seleção interna do SEI.
      aoConcluir: (feitos) => {
        for (const id of feitos) {
          for (const caixa of document.querySelectorAll<HTMLInputElement>(`tr#P${id} input[type=checkbox]`)) {
            if (caixa.checked) caixa.click();
          }
        }
      },
    });
  }

  const celulas = iniciarCelulas(document, servico, () => hojeISO(), abrir);
  let estilo: HTMLStyleElement | null = null;
  let ligado = false;

  function configurar(ligar: boolean) {
    if (ligar === ligado) return;
    ligado = ligar;
    if (ligar) {
      estilo = document.createElement('style');
      estilo.textContent = css;
      document.head.append(estilo);
      raiz.setAttribute(MARCA, '1');
      celulas.ligar();
    } else {
      celulas.desligar();
      raiz.removeAttribute(MARCA);
      estilo?.remove();
      estilo = null;
      // O legado volta a preencher a coluna.
      document.dispatchEvent(new CustomEvent('spro-prazos-desligado'));
    }
  }

  document.addEventListener('spro-prazos-abrir', () => {
    if (!ligado) return;
    const alvo = raiz.getAttribute(ALVO) ?? '';
    raiz.removeAttribute(ALVO);
    abrir(alvo ? [alvo] : []);
  });
  // O legado reconstrói a tabela (tablesorter) depois que o prazo muda.
  servico.aoMudar(() => document.dispatchEvent(new CustomEvent('spro-prazos-alterado')));

  let mudou = false;
  chrome.storage.onChanged.addListener((mudancas, area) => {
    if (area !== 'sync' || !('dataValues' in mudancas)) return;
    mudou = true;
    configurar(opcaoLegadaLigada(mudancas.dataValues!.newValue, OPCAO));
  });
  chrome.storage.sync
    .get('dataValues')
    .then((itens) => {
      if (!mudou) configurar(opcaoLegadaLigada(itens.dataValues, OPCAO));
    })
    .catch(() => { /* sem preferência legível: o legado segue cuidando do prazo */ });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar, { once: true });
else montar();
