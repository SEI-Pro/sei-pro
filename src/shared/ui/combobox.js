/**
 * Accessible combobox / searchable select (replaces chosen.jquery).
 *
 * API: const c = createCombobox(selectEl, { placeholder }); c.getValue(); c.destroy();
 * Enhances an existing <select>; keeps the original select as source of truth.
 */
export function createCombobox(select, opts = {}) {
    if (!select || select.tagName !== 'SELECT') throw new Error('createCombobox: <select> required');
    const o = Object.assign({
        placeholder: 'Buscar…',
        allowClear: true
    }, opts);

    select.classList.add('seipro-combobox-source');
    select.style.position = 'absolute';
    select.style.opacity = '0';
    select.style.pointerEvents = 'none';
    select.style.width = '1px';
    select.style.height = '1px';

    const wrap = document.createElement('div');
    wrap.className = 'seipro-combobox';
    wrap.style.cssText = 'position:relative;display:inline-block;min-width:160px;width:100%;';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'seipro-combobox__toggle infraText';
    btn.style.cssText = 'width:100%;text-align:left;padding:4px 8px;cursor:pointer;';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.className = 'seipro-combobox__panel';
    panel.hidden = true;
    panel.style.cssText = 'position:absolute;z-index:100002;left:0;right:0;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:220px;overflow:auto;';

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'seipro-combobox__search infraText';
    search.placeholder = o.placeholder;
    search.style.cssText = 'width:calc(100% - 12px);margin:6px;padding:4px 6px;';

    const list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    list.className = 'seipro-combobox__list';
    list.style.cssText = 'list-style:none;margin:0;padding:0;';

    panel.appendChild(search);
    panel.appendChild(list);
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    wrap.appendChild(btn);
    wrap.appendChild(panel);

    function options() {
        return [...select.options].map((opt) => ({
            value: opt.value,
            label: opt.textContent,
            disabled: opt.disabled
        }));
    }

    function syncLabel() {
        const opt = select.selectedOptions[0];
        btn.textContent = opt && opt.value !== '' ? opt.textContent : (o.placeholder || '—');
    }

    function render(filter = '') {
        const q = filter.trim().toLowerCase();
        list.innerHTML = '';
        options().forEach((opt) => {
            if (q && !opt.label.toLowerCase().includes(q) && !String(opt.value).toLowerCase().includes(q)) return;
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.dataset.value = opt.value;
            li.textContent = opt.label || '\u00A0';
            li.style.cssText = 'padding:6px 10px;cursor:pointer;';
            if (opt.value === select.value) {
                li.setAttribute('aria-selected', 'true');
                li.style.background = '#eef';
            }
            if (opt.disabled) {
                li.style.opacity = '.5';
                li.style.pointerEvents = 'none';
            }
            li.addEventListener('click', () => {
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                syncLabel();
                close();
            });
            list.appendChild(li);
        });
    }

    function open() {
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        search.value = '';
        render();
        search.focus();
    }

    function close() {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
    }

    function onDoc(ev) {
        if (!wrap.contains(ev.target)) close();
    }

    btn.addEventListener('click', () => {
        if (panel.hidden) open();
        else close();
    });
    search.addEventListener('input', () => render(search.value));
    document.addEventListener('click', onDoc, true);
    syncLabel();

    return {
        getValue: () => select.value,
        setValue(v) {
            select.value = v;
            syncLabel();
        },
        refresh() {
            syncLabel();
            if (!panel.hidden) render(search.value);
        },
        destroy() {
            document.removeEventListener('click', onDoc, true);
            wrap.parentNode.insertBefore(select, wrap);
            select.style.cssText = '';
            select.classList.remove('seipro-combobox-source');
            wrap.remove();
        }
    };
}
