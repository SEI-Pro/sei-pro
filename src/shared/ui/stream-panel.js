/**
 * Create a dependency-free panel for displaying streamed AI output.
 */
export function createStreamPanel({
    title = 'Resposta da IA',
    onAccept,
    onDiscard,
    onStop,
    onRetry
} = {}) {
    const panel = document.createElement('section');
    panel.className = 'seipro-stream-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');

    const header = document.createElement('header');
    header.className = 'seipro-stream-header';

    const heading = document.createElement('h2');
    heading.className = 'seipro-stream-title';
    heading.textContent = title;
    heading.id = `seipro-stream-title-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    panel.setAttribute('aria-labelledby', heading.id);

    const status = document.createElement('span');
    status.className = 'seipro-stream-status';
    status.setAttribute('aria-live', 'polite');

    const output = document.createElement('pre');
    output.className = 'seipro-stream-output';
    output.setAttribute('aria-live', 'polite');

    const tools = document.createElement('ul');
    tools.className = 'seipro-stream-tools';
    tools.hidden = true;

    const actions = document.createElement('footer');
    actions.className = 'seipro-stream-actions';

    const stopButton = createButton('Parar', 'seipro-stream-stop');
    const retryButton = createButton('Tentar novamente', 'seipro-stream-retry');
    const discardButton = createButton('Descartar', 'seipro-stream-discard');
    const acceptButton = createButton('Aceitar', 'seipro-stream-accept');

    header.append(heading, status);
    actions.append(stopButton, retryButton, discardButton, acceptButton);
    panel.append(header, output, tools, actions);

    const api = {
        el: panel,
        appendDelta(text) {
            output.textContent += String(text == null ? '' : text);
            output.scrollTop = output.scrollHeight;
            return api;
        },
        setText(text) {
            output.textContent = String(text == null ? '' : text);
            output.scrollTop = output.scrollHeight;
            return api;
        },
        setStatus(message) {
            status.textContent = String(message == null ? '' : message);
            return api;
        },
        setTools(list) {
            tools.replaceChildren();
            const items = Array.isArray(list) ? list : [];
            items.forEach(function (tool) {
                const item = document.createElement('li');
                item.className = 'seipro-stream-tool';
                item.textContent = typeof tool === 'string'
                    ? tool
                    : String((tool && (tool.label || tool.name || tool.id)) || 'Ferramenta');
                tools.appendChild(item);
            });
            tools.hidden = items.length === 0;
            return api;
        },
        open() {
            if (!panel.isConnected) document.body.appendChild(panel);
            return api;
        },
        close() {
            panel.remove();
            return api;
        },
        getText() {
            return output.textContent;
        },
        setRunning(running) {
            stopButton.disabled = !running;
            retryButton.disabled = running;
            acceptButton.disabled = running;
            return api;
        }
    };

    stopButton.addEventListener('click', function () {
        if (typeof onStop === 'function') onStop(api);
    });
    retryButton.addEventListener('click', function () {
        if (typeof onRetry === 'function') onRetry(api);
    });
    discardButton.addEventListener('click', function () {
        if (typeof onDiscard === 'function') onDiscard(api);
        api.close();
    });
    acceptButton.addEventListener('click', function () {
        if (typeof onAccept === 'function') onAccept(api.getText(), api);
    });

    return api;
}

function createButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `seipro-stream-button ${className}`;
    button.textContent = label;
    return button;
}
