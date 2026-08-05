export function htmlToMarkdown(html, { parseHtml } = {}) {
    let source = String(html || '');
    if (parseHtml) {
        const parsed = parseHtml(source);
        if (typeof parsed === 'string') source = parsed;
        else if (parsed && parsed.body) source = parsed.body.innerHTML;
        else if (parsed && parsed.documentElement) source = parsed.documentElement.innerHTML;
    }

    source = source
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    source = convertSeiNumberedParagraphs(source);
    source = convertTables(source);
    source = convertLists(source);
    source = source.replace(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, function (_, level, text) {
        return `\n${'#'.repeat(Number(level))} ${inlineText(text)}\n`;
    });
    source = source.replace(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
        function (_, quote, href, text) {
            return `[${inlineText(text)}](${decodeEntities(href.trim())})`;
        });
    source = source
        .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
        .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
        .replace(/<div\b[^>]*>([\s\S]*?)<\/div>/gi, '\n$1\n')
        .replace(/<[^>]+>/g, '');

    return decodeEntities(source)
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function convertSeiNumberedParagraphs(html) {
    const counters = {
        item: [0, 0, 0, 0],
        paragraph: [0, 0, 0, 0],
        roman: 0,
        letter: 0
    };
    return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, function (match, attributes, body) {
        const classMatch = /\bclass\s*=\s*(["'])(.*?)\1/i.exec(attributes);
        if (!classMatch) return match;
        const className = classMatch[2];
        const itemMatch = /\bItem_Nivel([1-4])\b/.exec(className);
        const paragraphMatch = /\bParagrafo_Numerado_Nivel([1-4])\b/.exec(className);
        let prefix;

        if (itemMatch || paragraphMatch) {
            const level = Number((itemMatch || paragraphMatch)[1]);
            const values = itemMatch ? counters.item : counters.paragraph;
            values[level - 1]++;
            values.fill(0, level);
            prefix = `${values.slice(0, level).join('.')}.`;
        } else if (/\bItem_Inciso_Romano\b/.test(className)) {
            counters.roman++;
            counters.letter = 0;
            prefix = `${toRoman(counters.roman)} -`;
        } else if (/\bItem_Alinea_Letra\b/.test(className)) {
            counters.letter++;
            prefix = `${toLetters(counters.letter)})`;
        } else {
            return match;
        }
        return `\n${prefix} ${body}\n`;
    });
}

function convertTables(html) {
    return html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, function (_, tableBody) {
        const rows = [];
        tableBody.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, function (rowMatch, rowBody) {
            const cells = [];
            rowBody.replace(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi, function (cellMatch, tag, cell) {
                cells.push(cell.trim());
                return cellMatch;
            });
            if (cells.length) rows.push(cells);
            return rowMatch;
        });
        if (!rows.length) return '';

        const width = Math.max(...rows.map(function (row) { return row.length; }));
        const keep = [];
        for (let column = 0; column < width; column++) {
            const hasContent = rows.some(function (row) {
                return plainText(row[column] || '').trim() !== '';
            });
            if (hasContent) keep.push(column);
        }
        if (!keep.length) return '';

        const markdownRows = rows.map(function (row) {
            const cells = keep.map(function (column) {
                return inlineText(row[column] || '').replace(/\|/g, '\\|');
            });
            return `| ${cells.join(' | ')} |`;
        });
        const separator = `| ${keep.map(function () { return '---'; }).join(' | ')} |`;
        markdownRows.splice(1, 0, separator);
        return `\n${markdownRows.join('\n')}\n`;
    });
}

function convertLists(html) {
    let output = html;
    let previous;
    do {
        previous = output;
        output = output.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, function (_, type, body) {
            let index = 0;
            const items = [];
            body.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, function (itemMatch, item) {
                index++;
                const marker = type.toLowerCase() === 'ol' ? `${index}.` : '-';
                items.push(`${marker} ${inlineText(item)}`);
                return itemMatch;
            });
            return items.length ? `\n${items.join('\n')}\n` : '';
        });
    } while (output !== previous);
    return output;
}

function inlineText(value) {
    return decodeEntities(String(value || '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
        .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
        .replace(/<[^>]+>/g, ''))
        .replace(/\s+/g, ' ')
        .trim();
}

function plainText(value) {
    return decodeEntities(String(value || '').replace(/<[^>]+>/g, ''))
        .replace(/\s+/g, ' ');
}

function toRoman(value) {
    const symbols = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let number = value;
    let output = '';
    symbols.forEach(function ([amount, symbol]) {
        while (number >= amount) {
            output += symbol;
            number -= amount;
        }
    });
    return output;
}

function toLetters(value) {
    let number = value;
    let output = '';
    while (number > 0) {
        number--;
        output = String.fromCharCode(97 + (number % 26)) + output;
        number = Math.floor(number / 26);
    }
    return output;
}

function decodeEntities(value) {
    const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' '
    };
    return String(value).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, function (entity, code) {
        if (code[0] === '#') {
            const radix = code[1].toLowerCase() === 'x' ? 16 : 10;
            const number = parseInt(code.slice(radix === 16 ? 2 : 1), radix);
            return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
        }
        return Object.prototype.hasOwnProperty.call(named, code.toLowerCase())
            ? named[code.toLowerCase()]
            : entity;
    });
}
