export function parseSseBlock(block) {
    if (typeof block !== 'string') return null;

    const event = {};
    const data = [];
    block.split(/\r\n|\r|\n/).forEach(function (line) {
        if (!line || line.startsWith(':')) return;
        const separator = line.indexOf(':');
        const field = separator === -1 ? line : line.slice(0, separator);
        let value = separator === -1 ? '' : line.slice(separator + 1);
        if (value.startsWith(' ')) value = value.slice(1);

        if (field === 'data') data.push(value);
        else if (field === 'event') event.event = value;
        else if (field === 'id') event.id = value;
        else if (field === 'retry' && /^\d+$/.test(value)) event.retry = Number(value);
    });

    if (!data.length && !Object.keys(event).length) return null;
    event.data = data.join('\n');
    if (event.data === '[DONE]') event.done = true;
    return event;
}

export function createSseParser() {
    let buffer = '';

    function drain(complete) {
        const events = [];
        let match;
        while ((match = /(?:\r\n|\r|\n){2}/.exec(buffer))) {
            const block = buffer.slice(0, match.index);
            buffer = buffer.slice(match.index + match[0].length);
            const event = parseSseBlock(block);
            if (event) events.push(event);
        }
        if (complete && buffer.trim()) {
            const event = parseSseBlock(buffer);
            if (event) events.push(event);
            buffer = '';
        }
        return events;
    }

    return {
        push(chunk) {
            if (chunk == null || chunk === '') return [];
            buffer += String(chunk);
            return drain(false);
        },
        flush() {
            return drain(true);
        }
    };
}
