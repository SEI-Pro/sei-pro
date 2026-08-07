// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Modal vanilla compartilhado — primitivo de UI da nova arquitetura.
 *
 * Substitui o jQuery UI dialog (resetDialogBoxPro/$.dialog) por um modal sem
 * dependências. Pensado para ser consumido por QUALQUER feature já migrada
 * (monitorados é o primeiro: mapas + datas). As features ainda legadas seguem
 * no jQuery UI dialog até migrarem — duplicação temporária e esperada.
 *
 * API:
 *   const ref = openModal({ title, content, width, buttons, onOpen, onClose });
 *   - content: string (HTML) | Node
 *   - buttons: [{ text, class?, onClick(ref) }]  (default: [Fechar])
 *   - onOpen(ref) roda após o body estar no DOM (ex.: montar um mapa em #mapid)
 *   - ref = { el, body, close() }
 *
 * Fecha por: botão X, clique no overlay, tecla ESC, ou ref.close().
 */
export function openModal({ title = '', content = '', width = 600, buttons, onOpen, onClose, className = '' } = {}) {
    document.querySelectorAll('.seipro-modal').forEach((m) => m.remove());

    const previouslyFocused = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'seipro-modal ' + className;
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.className = 'dialogBoxDiv seipro-modal-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.style.cssText = 'background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:' + width + 'px;';

    const head = document.createElement('div');
    head.className = 'seipro-modal-head';
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;';
    const titleElement = document.createElement('span');
    titleElement.className = 'seipro-modal-title';
    titleElement.id = `seipro-modal-title-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    titleElement.textContent = title;
    box.setAttribute('aria-labelledby', titleElement.id);
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'seipro-modal-close';
    closeButton.setAttribute('data-modal-close', '');
    closeButton.setAttribute('aria-label', 'Fechar');
    closeButton.style.cssText = 'cursor:pointer;color:#888;border:0;background:transparent;padding:4px;';
    closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    head.append(titleElement, closeButton);

    const body = document.createElement('div');
    body.className = 'seipro-modal-body';
    body.style.cssText = 'padding:14px;';
    const btnRow = document.createElement('div');
    btnRow.className = 'seipro-modal-buttons';
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;';
    box.append(head, body, btnRow);
    overlay.appendChild(box);

    if (typeof content === 'string') body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);

    const ref = { el: overlay, body, close };
    let onKey;
    let closed = false;

    function close() {
        if (closed) return;
        closed = true;
        document.removeEventListener('keydown', onKey, true);
        if (typeof onClose === 'function') { try { onClose(ref); } catch (e) { /* noop */ } }
        overlay.remove();
        if (previouslyFocused && typeof previouslyFocused.focus === 'function' && previouslyFocused.isConnected) {
            previouslyFocused.focus();
        }
    }

    function focusableElements() {
        return Array.from(box.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
    }

    onKey = (ev) => {
        if (ev.key === 'Escape') {
            ev.stopPropagation();
            close();
            return;
        }
        if (ev.key !== 'Tab') return;
        const focusable = focusableElements();
        if (!focusable.length) {
            ev.preventDefault();
            box.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
            ev.preventDefault();
            last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
            ev.preventDefault();
            first.focus();
        }
    };
    document.addEventListener('keydown', onKey, true);

    overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.closest('[data-modal-close]')) close();
    });

    (buttons || [{ text: 'Fechar', onClick: (r) => r.close() }]).forEach((b) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'newLink ' + (b.class || '');
        btn.textContent = b.text;
        btn.style.cssText = 'cursor:pointer;padding:4px 12px;';
        btn.addEventListener('click', () => b.onClick(ref));
        btnRow.appendChild(btn);
    });

    document.body.appendChild(overlay);
    if (typeof onOpen === 'function') onOpen(ref);
    const initialFocus = body.querySelector(
        '[autofocus], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]'
    ) || focusableElements()[0];
    if (document.activeElement === previouslyFocused) {
        if (initialFocus) initialFocus.focus();
        else {
            box.tabIndex = -1;
            box.focus();
        }
    }
    return ref;
}
