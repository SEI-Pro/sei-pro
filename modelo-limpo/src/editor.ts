/**
 * Editor do documento recém-gerado (`acao=editor_montar`, CK5). Se a tela "Gerar Documento" deixou um pedido
 * para este processo, limpa cada seção editável a partir do HTML que o SEI copiou e põe o resultado no
 * editor, sem salvar. Sem pedido, o editor fica como o SEI entregou.
 */

import { h } from '../../sei-comum/src/ui/dom';
import { CHAVE_PEDIDO, pedidoValido, type Pedido } from './pedido';
import { prepararLimpeza, scriptDaConfiguracao, somar } from './preparar';

const MARCA = 'seipro-modelo-limpo';

export function ehTelaEditor(doc: Document): boolean {
  return /[?&]acao=editor_montar\b/.test(doc.location?.href ?? '') && !!scriptDaConfiguracao(doc);
}

export async function limparSeHouverPedido(doc: Document): Promise<void> {
  const texto = scriptDaConfiguracao(doc);
  if (!texto) return;
  const itens = await chrome.storage.local.get(CHAVE_PEDIDO);
  const pedido = itens[CHAVE_PEDIDO] as Pedido | undefined;
  if (!pedido) return;
  let preparo: ReturnType<typeof prepararLimpeza>;
  try {
    preparo = prepararLimpeza(texto, doc.location.href);
  } catch (e) {
    aviso(doc, 'erro', `Não foi possível ler o editor para limpar o modelo: ${e instanceof Error ? e.message : String(e)}`);
    return;
  }
  if (!pedidoValido(pedido, preparo.idProcedimento, Date.now())) return;
  // Uso único: consumido antes de qualquer escrita, para não limpar um segundo documento.
  await chrome.storage.local.remove(CHAVE_PEDIDO);
  if (!preparo.secoes.length) {
    aviso(doc, 'erro', 'Nenhuma seção editável neste documento: nada foi limpo.');
    return;
  }
  const secoes = Object.fromEntries(preparo.secoes.map((s) => [s.raiz, s.html]));
  const resposta = await enviarParaPagina(doc, secoes);
  if (!resposta.ok) {
    aviso(doc, 'erro', `O modelo não foi limpo: ${resposta.erro ?? 'erro desconhecido'}. O documento está como o SEI copiou.`);
    return;
  }
  const r = somar(preparo.secoes.filter((s) => resposta.raizes?.includes(s.raiz)));
  const partes = [
    r.folhasRemovidas ? `${r.folhasRemovidas} folha(s) de estilo externa(s) removida(s)` : '',
    r.classesTrocadas ? `${r.classesTrocadas} parágrafo(s) com estilo do órgão` : '',
    r.negritosRecuperados ? `${r.negritosRecuperados} negrito(s) recuperado(s)` : '',
    r.titulosConvertidos ? `${r.titulosConvertidos} título(s) convertido(s)` : '',
    r.listasComNumeroEscrito ? `${r.listasComNumeroEscrito} lista(s) com número escrito no texto` : '',
  ].filter(Boolean);
  aviso(
    doc,
    'ok',
    `Modelo ${pedido.modelo} limpo${partes.length ? `: ${partes.join(', ')}` : ''}. Revise e salve. Ctrl+Z desfaz a limpeza.`,
  );
}

function enviarParaPagina(doc: Document, secoes: Record<string, string>): Promise<{ ok: boolean; raizes?: string[]; erro?: string }> {
  const token = crypto.randomUUID();
  return new Promise((resolver) => {
    const limite = setTimeout(() => terminar({ ok: false, erro: 'o editor não respondeu' }), 40_000);
    function terminar(r: { ok: boolean; raizes?: string[]; erro?: string }) {
      clearTimeout(limite);
      window.removeEventListener('message', ouvir);
      resolver(r);
    }
    function ouvir(ev: MessageEvent) {
      const m = ev.data as { __marca?: string; token?: string; op?: string; resposta?: { ok: boolean; raizes?: string[]; erro?: string } };
      if (ev.source !== window || m?.__marca !== MARCA || m.token !== token || m.op !== 'resposta' || !m.resposta) return;
      terminar(m.resposta);
    }
    window.addEventListener('message', ouvir);
    const s = doc.createElement('script');
    s.src = chrome.runtime.getURL('js/modelo-limpo-pagina.js');
    s.dataset.token = token;
    s.onload = () => {
      s.remove();
      window.postMessage({ __marca: MARCA, token, op: 'aplicar', secoes }, '*');
    };
    s.onerror = () => terminar({ ok: false, erro: 'não foi possível carregar o script do editor' });
    (doc.head ?? doc.documentElement).append(s);
  });
}

function aviso(doc: Document, tipo: 'ok' | 'erro', texto: string) {
  doc.querySelector('[data-spro-modelo-limpo-aviso]')?.remove();
  const fechar = h('button', { type: 'button', 'aria-label': 'Fechar', title: 'Fechar', onclick: () => caixa.remove() }, '×');
  Object.assign(fechar.style, { border: '0', background: 'transparent', color: 'inherit', fontSize: '18px', lineHeight: '1', cursor: 'pointer', marginLeft: '12px' });
  const caixa = h('div', { role: tipo === 'erro' ? 'alert' : 'status', 'data-spro-modelo-limpo-aviso': '' }, h('span', {}, texto), fechar);
  Object.assign(caixa.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: '100000',
    maxWidth: 'min(520px, calc(100vw - 32px))',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: '6px',
    font: '14px/1.4 Arial, sans-serif',
    color: '#fff',
    background: tipo === 'erro' ? '#a4262c' : '#1f6e43',
    boxShadow: '0 4px 16px rgba(0,0,0,.3)',
  });
  doc.body.append(caixa);
  if (tipo === 'ok') setTimeout(() => caixa.remove(), 20_000);
}
