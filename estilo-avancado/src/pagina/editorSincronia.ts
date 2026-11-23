/**
 * O visual novo da barra do editor (`seiSlim_editor`, o botao "Ativar estilo avancado" do editor) acompanha o
 * Estilo Avancado: ligou o estilo, liga o editor; desligou, desliga. So age quando o estado do estilo MUDA em relacao
 * ao ultimo sincronizado (`spro_editor_sincronia`): quem mexe no botao do editor entre uma mudanca e outra do estilo
 * nao e desfeito a cada carregamento. Na primeira execucao com o estilo desligado so registra o estado (nao apaga
 * uma escolha antiga do usuario).
 */
interface Armazem {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

const CHAVE_EDITOR = "seiSlim_editor";
const CHAVE_SINCRONIA = "spro_editor_sincronia";

export function sincronizarEditorComEstilo(storage: Armazem, ativo: boolean): void {
  try {
    const estado = ativo ? "1" : "0";
    const ultimo = storage.getItem(CHAVE_SINCRONIA);
    if (ultimo === estado) return;
    storage.setItem(CHAVE_SINCRONIA, estado);
    if (ativo) storage.setItem(CHAVE_EDITOR, "true");
    else if (ultimo !== null) storage.removeItem(CHAVE_EDITOR);
  } catch {
    // storage bloqueado: o editor fica como estava
  }
}
