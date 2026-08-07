// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Orquestração testável da superfície de editores CKEditor.
 * A fachada legada continua responsável por adaptar os globais e efeitos
 * específicos do editor, enquanto este módulo controla a iteração/eventos.
 */
export function collectEditorText(instances = {}, {
    extractNumber = false,
    readHtml = (instance) => instance.getData(),
    readText = (html) => String(html).replace(/<[^>]*>/g, ''),
    extractNumbered = (html) => html
} = {}) {
    let text = '';
    for (const id in instances) {
        const html = readHtml(instances[id], id);
        text += extractNumber ? extractNumbered(html, id) : readText(html, id);
    }
    return text;
}

export function bindEditorFocus(instances = {}, onFocus = () => {}) {
    for (const id in instances) {
        instances[id].on('focus', onFocus);
    }
    return Object.keys(instances).length;
}
