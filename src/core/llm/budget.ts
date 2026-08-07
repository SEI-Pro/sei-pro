// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
export function estimateTokens(text) {
    if (text == null || text === '') return 0;
    return Math.ceil(String(text).length / 4);
}

export function trimContext(chunks, { maxTokens, preferIds = [] } = {}) {
    if (!Array.isArray(chunks)) throw new TypeError('Chunks must be an array');
    if (!Number.isFinite(maxTokens) || maxTokens < 0) {
        throw new TypeError('maxTokens must be a non-negative number');
    }

    const preferred = new Set(preferIds.map(String));
    const ranked = chunks.map(function (chunk, index) {
        return { chunk, index };
    }).sort(function (left, right) {
        const leftPreferred = preferred.has(String(left.chunk.id));
        const rightPreferred = preferred.has(String(right.chunk.id));
        if (leftPreferred !== rightPreferred) return leftPreferred ? -1 : 1;

        if (leftPreferred) {
            const leftRank = preferIds.map(String).indexOf(String(left.chunk.id));
            const rightRank = preferIds.map(String).indexOf(String(right.chunk.id));
            if (leftRank !== rightRank) return leftRank - rightRank;
        }

        const leftDate = dateValue(left.chunk.date);
        const rightDate = dateValue(right.chunk.date);
        if (leftDate !== rightDate) return rightDate - leftDate;
        return right.index - left.index;
    });

    let usedTokens = 0;
    const kept = [];
    ranked.forEach(function ({ chunk }) {
        const tokens = estimateTokens(chunk && chunk.text);
        if (usedTokens + tokens <= maxTokens) {
            kept.push(chunk);
            usedTokens += tokens;
        }
    });
    return kept;
}

function dateValue(date) {
    if (date == null || date === '') return 0;
    const value = date instanceof Date ? date.getTime() : Date.parse(date);
    return Number.isFinite(value) ? value : 0;
}
