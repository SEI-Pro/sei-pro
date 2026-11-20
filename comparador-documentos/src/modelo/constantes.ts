/** Evento disparado no documento do SEI para abrir a janela do Comparador de Documentos. */
export const EVENTO_ABRIR = "spro-comparador-abrir";
/** Atributo posto no <html> pelo content script, para o resto do SEI Pro saber que ele está ativo. */
export const ATRIBUTO_ATIVO = "data-seipro-comparador";
/** Canal de mensagens entre a página do SEI e o iframe da janela. */
export const CANAL_COMPARADOR = "seipro-comparador";
/** Opção do legado (Configurações > Geral) que liga o comparador. */
export const OPCAO_LEGADA = "comparardocumentos";

/** Estilo do texto retirado (<del>) e do acrescentado (<ins>): os mesmos do legado. */
export const COR_REMOVIDO = "background-color: #FFF0F5;color: #FF0000;";
export const COR_ACRESCENTADO = "background-color: #F0F8FF;color: #0000FF;";

/** Cabeçalho do HTML baixado (o do legado). */
export const DOCTYPE_DOWNLOAD = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
