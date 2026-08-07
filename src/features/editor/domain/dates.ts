// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Editor date formatting (pure). */
export function formatEditorDate(value, dateStyle = 'long') {
    let date = value instanceof Date ? value : new Date(value);
    const dateOnly = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) date = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle }).format(date);
}
