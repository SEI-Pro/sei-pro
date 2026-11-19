/**
 * Content script isolado (`js/init_modelo_limpo.js`), em todos os frames do SEI. Age em duas telas:
 * "Gerar Documento" (o botão) e o editor CK5 (a limpeza, só se houver pedido). A opção `modelolimpo`
 * vem do `dataValues` da página de opções, desligada por padrão.
 */

import { opcaoLegadaMarcada } from '../../sei-comum/src/opcoes/legadas';
import { ehTelaEditor, limparSeHouverPedido } from './editor';
import { ehTelaGerar, montarBotoes, seiAntesDo5 } from './gerar';

function versaoSei(): string | null {
  try {
    return sessionStorage.getItem('versaoSei');
  } catch {
    return null;
  }
}

const OPCAO = 'modelolimpo';

async function ligada(): Promise<boolean> {
  try {
    const itens = await chrome.storage.sync.get('dataValues');
    return opcaoLegadaMarcada(itens.dataValues, OPCAO);
  } catch {
    return false;
  }
}

async function iniciar() {
  const gerar = ehTelaGerar(document) && !seiAntesDo5(versaoSei());
  const editor = !gerar && ehTelaEditor(document);
  if (!gerar && !editor) return;
  if (!(await ligada())) return;
  if (gerar) {
    let desmontar = montarBotoes(document);
    chrome.storage.onChanged.addListener((mudancas, area) => {
      if (area !== 'sync' || !('dataValues' in mudancas)) return;
      const agora = opcaoLegadaMarcada(mudancas.dataValues!.newValue, OPCAO);
      if (!agora) desmontar();
      else if (!document.querySelector('[data-spro-modelo-limpo]')) desmontar = montarBotoes(document);
    });
    return;
  }
  await limparSeHouverPedido(document);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void iniciar(), { once: true });
else void iniciar();
