// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
function pad(value) {
    return String(value).padStart(2, '0');
}

export function formatReviewTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return [
        `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
        `${pad(date.getHours())}:${pad(date.getMinutes())}`
    ].join(' ');
}

export function createReviewMetadata(author = '', value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new TypeError('Review time must be a valid date');
    }
    const normalizedAuthor = String(author || '').trim();
    return {
        author: normalizedAuthor,
        time: date.toISOString(),
        legacyDate: formatReviewTime(date),
        attributes: {
            'data-author': normalizedAuthor,
            'data-time': date.toISOString(),
            'data-user-review': normalizedAuthor,
            'data-date-review': formatReviewTime(date)
        }
    };
}

export function reviewMatchesBulkMode(review = {}, mode = '', currentAuthor = '') {
    if (mode === 'acceptAll' || mode === 'rejectAll') return true;
    if (mode !== 'acceptMine') return false;
    return String(review.author || review.userReview || '').trim()
        === String(currentAuthor || '').trim();
}
