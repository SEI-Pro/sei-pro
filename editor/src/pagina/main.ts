/**
 * Bundle do MUNDO DA PAGINA do editor (`js/editor/pagina.js`). Injetado por `init_editor.js`; so aqui
 * existem `CKEDITOR.instances` (CK4) e `ckeditorInstance`/`INFRA_EDITOR_CONFIG` (CK5). Instala os
 * globais dos recursos de imediato (o monolito os chama pelo nome) e inicia os recursos quando o editor
 * estiver pronto.
 */
import { criarAdaptador } from "../adaptador";
import { ATRIBUTO_BASE } from "../contrato";
import { checkOpcao, verifyOpcao } from "../opcoes";
import { RECURSOS } from "../recursos/indice";
import { iniciarRecursos, instalarRecursos } from "../recursos/instalar";
import type { Contexto } from "../recursos/tipos";
import { avisarEditor } from "../ui"; // importar entrega o CSS base ao dialogo
import { abrirHtml, type DefLegado, ligar } from "../ui/legado";

const marca = "__seiProEditorTs";
const janela = window as unknown as Record<string, unknown>;

if (!janela[marca]) {
  janela[marca] = true;
  // ponte para os modulos legados: `SeiProEditorAdapter.openDialog` delega aqui (moldura e kit novos)
  janela.SeiProUi = { abrirHtml: (def: DefLegado) => abrirHtml(window, document, def), ligar };
  const adaptador = criarAdaptador(window);
  adaptador.aoRecusarEscrita(() => avisarEditor(document, "Esta se\u00E7\u00E3o do documento \u00E9 somente leitura."));
  const c: Contexto = {
    adaptador,
    doc: document,
    win: window,
    base: document.currentScript?.getAttribute(ATRIBUTO_BASE) ?? "",
    checkOpcao: (n) => checkOpcao(n),
    verifyOpcao: (n) => verifyOpcao(n),
  };
  for (const f of instalarRecursos(window, RECURSOS, c).falhas) console.warn(`[SEIPro] recurso ${f.id} nao instalado:`, f.erro);
  adaptador
    .waitReady(20000)
    .then(() => {
      for (const f of iniciarRecursos(RECURSOS, c)) console.warn(`[SEIPro] recurso ${f.id} falhou ao iniciar:`, f.erro);
    })
    .catch((e) => console.warn("[SEIPro] editor nao detectado:", e));
}
