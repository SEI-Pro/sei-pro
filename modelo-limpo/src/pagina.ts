/**
 * Mundo da PÁGINA do editor (`js/modelo-limpo-pagina.js`). Só existe porque a instância do CKEditor 5 não
 * é visível do mundo isolado. Faz uma coisa: troca o conteúdo das seções pedidas pelo HTML já limpo, numa
 * operação que o Ctrl+Z desfaz, sem salvar. Quem salva é o usuário.
 *
 * Fala com o content script por `postMessage`, com o token que ele pôs no `data-token` desta tag.
 */

interface Ck5Raiz {
  rootName: string;
  isAttached(): boolean;
}

interface Ck5 {
  state: string;
  model: { document: { roots: Iterable<Ck5Raiz> } };
  data: { set(v: Record<string, string>, op?: { batchType?: { isUndoable?: boolean } }): void };
}

declare global {
  interface Window {
    INFRA_EDITOR_CONFIG?: { rootsAttributes?: Record<string, { somenteLeitura?: boolean }> };
    insertAutomaticMinutaWatermark?: () => void;
  }
}

const MARCA = 'seipro-modelo-limpo';
const token = (document.currentScript as HTMLScriptElement | null)?.dataset.token ?? '';

function ck5(): Ck5 | null {
  const el = document.querySelector('.ck-editor__editable_inline') as (Element & { ckeditorInstance?: Ck5 }) | null;
  const ed = el?.ckeditorInstance;
  return ed && ed.state === 'ready' ? ed : null;
}

/** O editor monta depois da página: espera até 30 s. */
async function esperarEditor(): Promise<Ck5> {
  for (let i = 0; i < 150; i++) {
    const ed = ck5();
    if (ed) return ed;
    await new Promise((ok) => setTimeout(ok, 200));
  }
  throw new Error('O editor não terminou de abrir.');
}

async function aplicar(secoes: Record<string, string>): Promise<string[]> {
  const ed = await esperarEditor();
  const attrs = window.INFRA_EDITOR_CONFIG?.rootsAttributes ?? {};
  const raizes = new Set([...ed.model.document.roots].filter((r) => r.isAttached()).map((r) => r.rootName));
  const alvo: Record<string, string> = {};
  for (const [raiz, html] of Object.entries(secoes)) {
    if (raizes.has(raiz) && !attrs[raiz]?.somenteLeitura) alvo[raiz] = html;
  }
  if (!Object.keys(alvo).length) throw new Error('Nenhuma seção editável encontrada no editor.');
  ed.data.set(alvo, { batchType: { isUndoable: true } });
  // A marca d'água MINUTA saiu na limpeza (ela se duplicava a cada cópia); o SEI Pro a repõe uma vez.
  try {
    window.insertAutomaticMinutaWatermark?.();
  } catch {
    /* recurso do editor legado ausente ou desligado */
  }
  return Object.keys(alvo);
}

window.addEventListener('message', async (ev: MessageEvent) => {
  if (ev.source !== window) return;
  const m = ev.data as { __marca?: string; token?: string; op?: string; secoes?: Record<string, string> };
  if (m?.__marca !== MARCA || m.token !== token || m.op !== 'aplicar' || !m.secoes) return;
  let resposta: { ok: boolean; raizes?: string[]; erro?: string };
  try {
    resposta = { ok: true, raizes: await aplicar(m.secoes) };
  } catch (e) {
    resposta = { ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
  window.postMessage({ __marca: MARCA, token, op: 'resposta', resposta }, '*');
});

export {};
