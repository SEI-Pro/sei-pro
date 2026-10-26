import { h, icone } from '../../../sei-comum/src/ui/dom';

/** Copia o texto para a area de transferencia: API assincrona e, sem ela, textarea temporaria + execCommand. */
export async function copiarTexto(doc: Document, texto: string): Promise<boolean> {
  const nav = doc.defaultView?.navigator?.clipboard ? doc.defaultView.navigator : globalThis.navigator;
  try {
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // cai no caminho antigo
  }
  try {
    const t = h('textarea', { readonly: true, 'aria-hidden': 'true', style: 'position:fixed;top:0;left:-9999px;opacity:0' });
    t.value = texto;
    doc.body.append(t);
    t.select();
    const ok = doc.execCommand('copy');
    t.remove();
    return ok;
  } catch {
    return false;
  }
}

const MS_FEEDBACK = 1500;

/**
 * Botao "Copiar numero do processo" da coluna do numero: mesmo estilo do "abrir em nova guia"
 * (aparece no hover da linha e no foco). Nao propaga o clique (nem o Enter/Espaco) para a linha.
 */
export function botaoCopiarNumero(protocolo: string, copiar: (texto: string) => Promise<boolean>): HTMLElement {
  const rotulo = 'Copiar número do processo';
  const aviso = h('span', { class: 'spro-sr', role: 'status', 'aria-live': 'polite' });
  const botao = h('button', { type: 'button', class: 'spro-copiar-num', 'aria-label': rotulo }, icone('copiar', 14), aviso);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const desenhar = (copiado: boolean) => {
    botao.classList.toggle('spro-copiado', copiado);
    botao.querySelector('svg')?.replaceWith(icone(copiado ? 'check' : 'copiar', 14));
  };
  botao.addEventListener('keydown', (ev) => ev.stopPropagation());
  botao.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    void copiar(protocolo).then((ok) => {
      aviso.textContent = ok ? 'Número copiado' : 'Não foi possível copiar';
      if (!ok) return;
      desenhar(true);
      clearTimeout(timer);
      timer = setTimeout(() => { desenhar(false); aviso.textContent = ''; }, MS_FEEDBACK);
    });
  });
  return botao;
}
