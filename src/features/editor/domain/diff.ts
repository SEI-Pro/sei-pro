// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
function tokenize(value) {
    return String(value || '').match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
}

function comparable(token) {
    return token.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

export function semanticDiff(before = '', after = '', { maxTokens = 1800 } = {}) {
    const left = tokenize(before).slice(0, maxTokens);
    const right = tokenize(after).slice(0, maxTokens);
    const rows = left.length + 1;
    const columns = right.length + 1;
    const matrix = Array.from({ length: rows }, () => new Uint16Array(columns));

    for (let i = left.length - 1; i >= 0; i--) {
        for (let j = right.length - 1; j >= 0; j--) {
            matrix[i][j] = comparable(left[i]) === comparable(right[j])
                ? matrix[i + 1][j + 1] + 1
                : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
        }
    }

    const parts = [];
    const push = (type, token) => {
        const last = parts[parts.length - 1];
        if (last?.type === type) last.tokens.push(token);
        else parts.push({ type, tokens: [token] });
    };
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (comparable(left[i]) === comparable(right[j])) {
            push('equal', right[j]);
            i++;
            j++;
        } else if (matrix[i + 1][j] >= matrix[i][j + 1]) {
            push('remove', left[i++]);
        } else {
            push('add', right[j++]);
        }
    }
    while (i < left.length) push('remove', left[i++]);
    while (j < right.length) push('add', right[j++]);

    const output = parts.map((part) => ({
        type: part.type,
        text: joinTokens(part.tokens)
    }));
    return {
        parts: output,
        added: output.filter((part) => part.type === 'add').reduce((sum, part) => sum + tokenize(part.text).length, 0),
        removed: output.filter((part) => part.type === 'remove').reduce((sum, part) => sum + tokenize(part.text).length, 0),
        truncated: left.length >= maxTokens || right.length >= maxTokens
    };
}

function joinTokens(tokens) {
    return tokens.reduce((text, token) => {
        if (!text) return token;
        return /^[,.;:!?%)\]}]$/u.test(token) ? `${text}${token}` : `${text} ${token}`;
    }, '');
}
