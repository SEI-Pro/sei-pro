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

    const overlay = document.createElement('div');
    overlay.className = 'seipro-modal ' + className;
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML =
        '<div class="dialogBoxDiv seipro-modal-box" role="dialog" aria-modal="true" style="background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:' + width + 'px;">'
        + '<div class="seipro-modal-head" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;">'
        + '<span class="seipro-modal-title">' + title + '</span>'
        + '<i class="fas fa-times" data-modal-close style="cursor:pointer;color:#888;"></i></div>'
        + '<div class="seipro-modal-body" style="padding:14px;"></div>'
        + '<div class="seipro-modal-buttons" style="display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;"></div>'
        + '</div>';

    const body = overlay.querySelector('.seipro-modal-body');
    if (typeof content === 'string') body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);

    const ref = { el: overlay, body, close };
    let onKey;

    function close() {
        document.removeEventListener('keydown', onKey, true);
        if (typeof onClose === 'function') { try { onClose(ref); } catch (e) { /* noop */ } }
        overlay.remove();
    }

    onKey = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(); } };
    document.addEventListener('keydown', onKey, true);

    overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.closest('[data-modal-close]')) close();
    });

    const btnRow = overlay.querySelector('.seipro-modal-buttons');
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
    return ref;
}
