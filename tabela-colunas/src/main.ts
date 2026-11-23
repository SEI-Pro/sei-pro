/**
 * SEI Pro - Editor / Feature: Tabela com colunas em % (tabela-colunas)
 *
 * Botão `.getTabelaColunasButtom` da barra do editor (só no SEI 5 / CKEditor 5). Com o cursor numa
 * tabela, ajusta essa tabela; fora de tabela, cria uma nova no lugar do cursor. Ver editor.ts.
 *
 * Roda no mundo da página: carregado pelo SeiProEditorAdapter (lista MODULES), antes do monólito
 * sei-pro-editor.js, que liga o clique do botão a `window.getTabelaColunasButtom`.
 */

import { type Estado, montarDialogo, novoEstado } from './dialogo';
import { classificar, lerCssEstilos } from './estilos';
import { vigiarBotao } from './icone';
import {
  aplicar,
  celulasSelecionadas,
  cssDosEstilos,
  type Editor,
  ehCk5,
  estilosDeTabela,
  lerTabela,
  podeInserir,
  raizDaSelecao,
  raizSomenteLeitura,
  registrarZebra,
  tabelaDaSelecao,
  temas,
  temRedimensionamento,
  temPosicao,
  temPosicaoEmBloco,
} from './editor';

interface Adapter {
  getInstance(ref?: unknown): Editor;
  openDialog(def: {
    id: string;
    title: string;
    html: string;
    width?: number | string;
    height?: number | string;
    onOpen?: (box: { 0: HTMLElement; dialog(cmd: string): void }) => void;
    buttons?: Array<{ text: string; primary?: boolean; click: (box: { dialog(cmd: string): void }) => void }>;
  }): unknown;
  registerFeature?(def: { id: string }): void;
}

declare global {
  interface Window {
    SeiProEditorAdapter?: Adapter;
    getTabelaColunasButtom?: (botao?: Element) => void;
    alertaBoxPro?: (tipo: string, icone: string, texto: string) => void;
  }
}

const TITULO = 'Tabela com colunas em %';

function avisar(texto: string): void {
  if (typeof window.alertaBoxPro === 'function') window.alertaBoxPro('Error', 'exclamation-triangle', texto);
  else window.alert(texto);
}

export function abrir(botao?: Element): void {
  const adapter = window.SeiProEditorAdapter;
  const editor = adapter?.getInstance(botao);
  if (!adapter || !editor || !ehCk5(editor)) {
    avisar('Esta ferramenta funciona no editor do SEI 5.');
    return;
  }
  registrarZebra(editor);
  if (!temRedimensionamento(editor)) {
    avisar('O editor deste SEI não tem o redimensionamento de colunas habilitado.');
    return;
  }

  const tabela = tabelaDaSelecao(editor);
  const raiz = raizDaSelecao(editor);
  if (tabela) {
    if (raizSomenteLeitura(editor, tabela.root?.rootName)) {
      avisar('Esta parte do documento não pode ser editada.');
      return;
    }
  } else if (!podeInserir(editor)) {
    avisar('Clique no texto do documento, no lugar onde a tabela deve entrar, ou dentro da tabela que deseja ajustar.');
    return;
  }

  const estilos = classificar(estilosDeTabela(editor, tabela?.root?.rootName ?? raiz), lerCssEstilos(cssDosEstilos(editor)));
  const listaTemas = temas(editor);
  const leitura = tabela ? lerTabela(editor, tabela) : undefined;
  const inicial: Estado = leitura ? novoEstado(leitura) : novoEstado(undefined, { temaPadrao: listaTemas[0]?.classeCss ?? '' });
  // As células selecionadas agora: ao aplicar, a seleção já pode ter mudado.
  const selecionadas = tabela ? celulasSelecionadas(editor, tabela) : [];

  let ler: (() => Estado) | undefined;
  adapter.openDialog({
    id: 'dialogTabelaColunasPro',
    title: tabela ? `${TITULO}: ajustar tabela` : `${TITULO}: nova tabela`,
    html: '',
    width: 680,
    onOpen: (box) => {
      const d = montarDialogo(document, inicial, {
        temas: listaTemas,
        estilos,
        existe: !!tabela,
        sujeira: leitura?.sujeira,
        selecionadas: selecionadas.length,
        posicao: temPosicao(editor),
        posicaoFlutua: temPosicao(editor) && !temPosicaoEmBloco(editor),
      });
      ler = d.ler;
      box[0].append(d.raiz);
    },
    buttons: [
      {
        text: tabela ? 'Aplicar' : 'Inserir tabela',
        primary: true,
        click: (box) => {
          const escolha = ler?.();
          if (!escolha) return;
          try {
            const feita = aplicar(editor, tabela, escolha, selecionadas);
            if (!feita) {
              avisar('Não foi possível inserir a tabela neste ponto do documento.');
              return;
            }
          } catch (e) {
            console.error('[SEIPro/tabela-colunas]', e);
            avisar('Não foi possível aplicar as larguras. Detalhes no console do navegador.');
            return;
          }
          try {
            box.dialog('close');
          } catch {
            /* diálogo já fechado */
          }
          try {
            editor.editing.view.focus();
          } catch {
            /* foco é cortesia */
          }
        },
      },
      {
        text: 'Cancelar',
        click: (box) => {
          try {
            box.dialog('close');
          } catch {
            /* diálogo já fechado */
          }
        },
      },
    ],
  });
}

/** Liga a zebra pela 1ª coluna em todo editor CK5 da página (o SEI pode criar o editor depois). */
function vigiarEditores(doc: Document): void {
  const ligar = () => {
    for (const el of Array.from(doc.querySelectorAll('.ck-editor__editable'))) {
      const ed = (el as HTMLElement & { ckeditorInstance?: Editor }).ckeditorInstance;
      if (ed) registrarZebra(ed);
    }
  };
  ligar();
  let agendado = false;
  const obs = new MutationObserver(() => {
    if (agendado) return;
    agendado = true;
    setTimeout(() => {
      agendado = false;
      ligar();
    }, 300);
  });
  obs.observe(doc.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 60000);
}

window.getTabelaColunasButtom = abrir;
window.SeiProEditorAdapter?.registerFeature?.({ id: 'tabela-colunas' });
vigiarBotao(document);
vigiarEditores(document);
