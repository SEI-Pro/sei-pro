/**
 * A primeira pintura. O SEI entrega a tabela pronta no HTML, então o jeito de NÃO piscar é nunca pintar a nativa:
 * no `document_start` (antes do corpo existir) marcamos o `<html>` e injetamos um CSS que esconde as tabelas
 * nativas e desenha um esqueleto no lugar (só CSS, em pseudo-elemento: não há DOM para inserir tão cedo).
 * Quando a grade está montada, `marcarPronta` apaga o esqueleto. Qualquer falha ou demora devolve a nativa.
 */
export const ATRIBUTO = 'data-spro-grade';
export const PRONTA = 'data-spro-grade-pronta';
export const ESCURO = 'data-spro-grade-escuro';
export const CHAVE_DICA = 'spro_grade';
export const ID_ESTILO = 'spro-grade-pre';

/** O prazo, depois do DOMContentLoaded, para a grade aparecer antes de devolvermos a tela nativa. */
export const PRAZO_MS = 1500;
/** Teto absoluto desde o `document_start` (rede lenta: o DOMContentLoaded pode demorar). */
export const TETO_MS = 10_000;

export const TABELAS_NATIVAS = '#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado';

export function cssPrimeiraPintura(): string {
  const tabelas = TABELAS_NATIVAS.split(', ').map((t) => `html[${ATRIBUTO}] ${t}`).join(',\n');
  const esqueleto = `html[${ATRIBUTO}]:not([${PRONTA}]) #divTabelaProcesso::before,
html[${ATRIBUTO}]:not([${PRONTA}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before`;
  // Controles da visao antiga (links nativos "Ver por...", seletores e Tabela/Quadro do legado): a grade os substitui.
  const antigos = ['#divFiltro', '#newFiltro', '#processosProActions', '#processosKanban'].map((t) => `html[${ATRIBUTO}] ${t}`).join(',\n');
  return `${tabelas} { display: none !important; }
/* Com a grade pronta, o container nativo das tabelas (min-height: 200px) so deixaria um vazio entre a grade e o painel de baixo. */
html[${ATRIBUTO}][${PRONTA}] #divTabelaProcesso { display: none !important; }
${antigos} { display: none !important; }
html[${ATRIBUTO}] #divRecebidosAreaPaginacaoSuperior, html[${ATRIBUTO}] #divRecebidosAreaPaginacaoInferior,
html[${ATRIBUTO}] #divGeradosAreaPaginacaoSuperior, html[${ATRIBUTO}] #divGeradosAreaPaginacaoInferior { display: none !important; }
${esqueleto} {
  content: "";
  display: block;
  flex: 0 0 100%;
  box-sizing: border-box;
  width: 100%;
  height: 392px;
  margin: 6px 0;
  border-radius: 10px;
  --spro-sk: #e6e9ee;
  --spro-sk-2: #f3f4f7;
  background:
    linear-gradient(var(--spro-sk), var(--spro-sk)) 0 0 / 38% 36px no-repeat,
    linear-gradient(var(--spro-sk-2), var(--spro-sk-2)) 100% 0 / 56% 36px no-repeat,
    linear-gradient(var(--spro-sk-2), var(--spro-sk-2)) 0 52px / 100% 34px no-repeat,
    repeating-linear-gradient(to bottom, var(--spro-sk) 0 20px, transparent 20px 44px) 0 100px / 100% 352px no-repeat;
  animation: spro-grade-pulso 1.3s ease-in-out infinite;
}
html[${ATRIBUTO}][${ESCURO}]:not([${PRONTA}]) #divTabelaProcesso::before,
html[${ATRIBUTO}][${ESCURO}]:not([${PRONTA}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { --spro-sk: #2c333b; --spro-sk-2: #232a31; }
@keyframes spro-grade-pulso { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  html[${ATRIBUTO}]:not([${PRONTA}]) #divTabelaProcesso::before,
  html[${ATRIBUTO}]:not([${PRONTA}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { animation: none; }
}`;
}

/** Bandeira síncrona (localStorage da origem do SEI): é só dica para a primeira pintura. */
export function lerDica(armazenamento: Pick<Storage, 'getItem'>): boolean {
  try {
    return armazenamento.getItem(CHAVE_DICA) === '1';
  } catch {
    return false;
  }
}

export function gravarDica(armazenamento: Pick<Storage, 'setItem' | 'removeItem'>, ligada: boolean): void {
  try {
    if (ligada) armazenamento.setItem(CHAVE_DICA, '1');
    else armazenamento.removeItem(CHAVE_DICA);
  } catch {
    /* sem storage: só perde a pré-pintura na próxima abertura */
  }
}

/** Marca o `<html>` e injeta o CSS. Idempotente. */
export function ativarCedo(doc: Document, escuro: boolean): void {
  const raiz = doc.documentElement;
  raiz.setAttribute(ATRIBUTO, '1');
  raiz.removeAttribute(PRONTA);
  if (escuro) raiz.setAttribute(ESCURO, '1');
  else raiz.removeAttribute(ESCURO);
  if (!doc.getElementById(ID_ESTILO)) {
    const estilo = doc.createElement('style');
    estilo.id = ID_ESTILO;
    estilo.textContent = cssPrimeiraPintura();
    (doc.head ?? raiz).append(estilo);
  }
}

/** Devolve a tela nativa (e o legado, que só some enquanto o atributo existe). */
export function desativar(doc: Document): void {
  const raiz = doc.documentElement;
  raiz.removeAttribute(ATRIBUTO);
  raiz.removeAttribute(PRONTA);
  raiz.removeAttribute(ESCURO);
  doc.getElementById(ID_ESTILO)?.remove();
}

export const estaAtiva = (doc: Document): boolean => doc.documentElement.hasAttribute(ATRIBUTO);

export function marcarPronta(doc: Document): void {
  doc.documentElement.setAttribute(PRONTA, '1');
}

export interface Relogio {
  setTimeout(f: () => void, ms: number): unknown;
  clearTimeout(id: unknown): void;
}

/**
 * Vigia: se a grade não ficar pronta a tempo, `aoFalhar` devolve a nativa. Dois prazos: PRAZO_MS depois do
 * DOMContentLoaded (`iniciarContagem`) e TETO_MS desde já. Chame `pronta()` ao montar.
 */
export function vigiar(aoFalhar: (motivo: string) => void, relogio: Relogio = { setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: (id) => clearTimeout(id as ReturnType<typeof setTimeout>) }) {
  let fim = false;
  let aposDom: unknown;
  const disparar = (motivo: string) => {
    if (fim) return;
    fim = true;
    relogio.clearTimeout(teto);
    relogio.clearTimeout(aposDom);
    aoFalhar(motivo);
  };
  const teto = relogio.setTimeout(() => disparar('teto'), TETO_MS);
  return {
    iniciarContagem() {
      if (!fim) aposDom = relogio.setTimeout(() => disparar('prazo'), PRAZO_MS);
    },
    pronta() {
      fim = true;
      relogio.clearTimeout(teto);
      relogio.clearTimeout(aposDom);
    },
    falhou: (motivo: string) => disparar(motivo),
    encerrada: () => fim,
  };
}
