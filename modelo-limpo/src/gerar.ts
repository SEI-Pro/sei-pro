/**
 * Tela "Gerar Documento" (`acao=documento_gerar`): o botão "Salvar com modelo limpo" ao lado de cada
 * "Salvar" do SEI. Aparece só com "Documento Modelo" marcado. Deixa o pedido para o editor e aciona o
 * "Salvar" do próprio SEI, que valida a tela e grava como sempre (tipo, nível de acesso, interessados).
 *
 * O botão fica na barra, não no quadro "Texto Inicial": ali o SEI posiciona tudo em coordenadas absolutas
 * e qualquer elemento a mais sobrepõe os campos.
 */

import { h } from '../../sei-comum/src/ui/dom';
import { CHAVE_PEDIDO, type Pedido } from './pedido';

const ROTULO = 'Salvar com modelo limpo';
const DICA =
  'Gera o documento a partir do modelo e, ao abrir o editor, limpa a formatação herdada (estilos do Google Docs ou do editor antigo), mantendo negritos, títulos, tabelas e os estilos do órgão. Nada é salvo sem você revisar.';

export function ehTelaGerar(doc: Document): boolean {
  return !!doc.getElementById('frmDocumentoCadastro') && !!doc.getElementById('optProtocoloDocumentoTextoBase') && !!doc.querySelector('button[name="btnSalvar"]');
}

/**
 * A limpeza só acontece no editor do SEI 5 (CK5). O legado guarda a versão em `sessionStorage.versaoSei`;
 * sem ela, o botão aparece (no SEI 4 o pedido só venceria sem uso).
 */
export function seiAntesDo5(versao: string | null | undefined): boolean {
  const maior = Number.parseInt((versao ?? '').split('.')[0] ?? '', 10);
  return Number.isFinite(maior) && maior > 0 && maior < 5;
}

export function montarBotoes(doc: Document): () => void {
  const opcaoModelo = doc.getElementById('optProtocoloDocumentoTextoBase') as HTMLInputElement;
  const campoModelo = doc.getElementById('txtProtocoloDocumentoTextoBase') as HTMLInputElement | null;
  const salvar = [...doc.querySelectorAll<HTMLButtonElement>('button[name="btnSalvar"]')];
  const botoes = salvar.map((original) => {
    const b = h('button', { type: 'button', class: 'infraButton', title: DICA, 'data-spro-modelo-limpo': '', onclick: () => acionar(original) }, ROTULO);
    b.style.marginLeft = '0.4em';
    original.after(b);
    return b;
  });

  const atualizar = () => {
    for (const b of botoes) b.style.display = opcaoModelo.checked ? '' : 'none';
  };
  // O SEI troca o texto inicial por onclick nos rádios; acompanhar o clique e a tecla basta.
  const aoMudar = (ev: Event) => {
    if ((ev.target as Element | null)?.getAttribute?.('name') === 'rdoTextoInicial') atualizar();
  };
  doc.addEventListener('click', aoMudar, true);
  doc.addEventListener('change', aoMudar, true);
  atualizar();

  async function acionar(original: HTMLButtonElement) {
    const modelo = campoModelo?.value.trim() ?? '';
    if (!opcaoModelo.checked || !modelo) {
      window.alert('Informe o número SEI do Documento Modelo.');
      campoModelo?.focus();
      return;
    }
    if ((doc.getElementById('optSigiloso') as HTMLInputElement | null)?.checked) {
      window.alert('Documento sigiloso: use o Salvar do SEI. A limpeza não atua em sigilosos.');
      return;
    }
    const idProcedimento = (doc.getElementById('hdnIdProcedimento') as HTMLInputElement | null)?.value ?? '';
    if (!idProcedimento) {
      window.alert('Não foi possível identificar o processo nesta tela. Use o Salvar do SEI.');
      return;
    }
    const pedido: Pedido = { idProcedimento, modelo, criadoEm: Date.now() };
    await chrome.storage.local.set({ [CHAVE_PEDIDO]: pedido });
    // Validação do SEI recusou (campo obrigatório, por exemplo) e a tela ficou: o pedido não pode sobrar
    // para um documento gerado depois sem o botão.
    let saiu = false;
    const sair = () => {
      saiu = true;
    };
    window.addEventListener('beforeunload', sair, { once: true });
    window.addEventListener('pagehide', sair, { once: true });
    original.click();
    setTimeout(() => {
      if (!saiu) void chrome.storage.local.remove(CHAVE_PEDIDO);
    }, 10_000);
  }

  return () => {
    doc.removeEventListener('click', aoMudar, true);
    doc.removeEventListener('change', aoMudar, true);
    for (const b of botoes) b.remove();
  };
}
