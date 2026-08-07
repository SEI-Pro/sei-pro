// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
export const SEI_STYLES = Object.freeze({
    paragrafoNivel1: 'Paragrafo_Numerado_Nivel1',
    paragrafoNivel2: 'Paragrafo_Numerado_Nivel2',
    paragrafoNivel3: 'Paragrafo_Numerado_Nivel3',
    paragrafoNivel4: 'Paragrafo_Numerado_Nivel4',
    itemNivel1: 'Item_Nivel1',
    itemNivel2: 'Item_Nivel2',
    itemNivel3: 'Item_Nivel3',
    itemNivel4: 'Item_Nivel4',
    itemAlineaLetra: 'Item_Alinea_Letra',
    itemIncisoRomano: 'Item_Inciso_Romano',
    titulo: 'Titulo',
    subtitulo: 'Subtitulo',
    textoJustificado: 'Texto_Justificado',
    textoCentralizado: 'Texto_Centralizado',
    citacao: 'Citacao',
    ementa: 'Ementa',
    assinatura: 'Assinatura'
});

const allowedClasses = new Set(Object.values(SEI_STYLES));

export function isAllowedSeiClass(className) {
    return typeof className === 'string' && allowedClasses.has(className.trim());
}

export function listSeiStyles() {
    return Object.values(SEI_STYLES);
}
