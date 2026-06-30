/**
 * Tags input vanilla — primitivo compartilhado (src/shared/ui/).
 *
 * Substitui jquery.tagsinput-revisited. Transforma um <input> num widget de
 * etiquetas: pills + input interno, autocomplete, limite, unicidade, remoção por
 * backspace. O <input> original guarda os tags juntados pelo delimitador (a fonte
 * da verdade que o resto do código continua lendo).
 *
 * Genérico e reusável (etiquetas de monitorados/favoritos/projetos). A lógica de
 * negócio (cores via getHtmlEtiqueta, persistência via saveFollowEtiqueta, sugestões
 * via sugestEtiquetaPro) entra por callbacks/opções — o primitivo não a conhece.
 *
 * API: const t = createTagsInput(inputEl, opts); t.getTags(); t.add(x); t.destroy();
 */
export function createTagsInput(input, opts = {}) {
    const o = Object.assign({
        delimiter: ';', placeholder: 'Adicionar', minChars: 1, maxChars: 100,
        limit: 0, unique: true, removeWithBackspace: true,
        source: [],            // array de sugestões ou função () => array
        renderLabel: null,     // (tag) => HTML do conteúdo da pill (sem o x)
        onAdd: null, onRemove: null, onChange: null
    }, opts);

    // doc: permite montar o widget dentro de outro documento (ex.: iframe same-origin).
    const doc = o.doc || (input.ownerDocument) || document;
    const dropRoot = o.dropdownRoot || doc.body;

    let tags = String(input.value || '').split(o.delimiter).map((t) => t.trim()).filter(Boolean);

    const wrap = doc.createElement('div');
    wrap.className = 'seipro-tagsinput';
    wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;align-items:center;border:1px solid #ccc;border-radius:4px;padding:3px;min-height:28px;';
    const inner = doc.createElement('input');
    inner.type = 'text';
    inner.placeholder = o.placeholder;
    inner.className = 'seipro-tagsinput-entry';
    inner.style.cssText = 'border:0;outline:0;flex:1;min-width:80px;font-size:inherit;background:transparent;';

    input.style.display = 'none';
    input.insertAdjacentElement('afterend', wrap);

    const dropdown = doc.createElement('div');
    dropdown.className = 'seipro-tagsinput-suggest';
    dropdown.style.cssText = 'position:absolute;z-index:100001;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:160px;overflow:auto;display:none;font-size:11px;';
    dropRoot.appendChild(dropdown);

    function sync() {
        input.value = tags.join(o.delimiter);
        if (typeof o.onChange === 'function') o.onChange(tags.slice(), input);
    }
    function pill(tag) {
        const el = doc.createElement('span');
        el.className = 'tag seipro-tag';
        el.style.cssText = 'display:inline-flex;align-items:center;gap:3px;background:#eef;border-radius:3px;padding:1px 6px;';
        el.innerHTML = (typeof o.renderLabel === 'function' ? o.renderLabel(tag) : escapeText(tag));
        const x = doc.createElement('i');
        x.className = 'fas fa-times seipro-tag-remove';
        x.style.cssText = 'cursor:pointer;font-size:.8em;opacity:.7;';
        x.addEventListener('click', () => remove(tag));
        el.appendChild(x);
        el.dataset.tag = tag;
        return el;
    }
    function render() {
        wrap.querySelectorAll('.seipro-tag').forEach((n) => n.remove());
        tags.forEach((t) => wrap.insertBefore(pill(t), inner));
    }

    function add(raw) {
        const tag = String(raw || '').trim();
        if (tag.length < o.minChars || tag.length > o.maxChars) return false;
        if (o.unique && tags.indexOf(tag) !== -1) return false;
        if (o.limit > 0 && tags.length >= o.limit) return false;
        tags.push(tag);
        render(); sync();
        if (typeof o.onAdd === 'function') o.onAdd(tag, tags.slice());
        return true;
    }
    function remove(tag) {
        const i = tags.indexOf(tag);
        if (i === -1) return;
        tags.splice(i, 1);
        render(); sync();
        if (typeof o.onRemove === 'function') o.onRemove(tag, tags.slice());
    }

    function sources() { return (typeof o.source === 'function' ? o.source() : o.source) || []; }
    function hideSuggest() { dropdown.style.display = 'none'; dropdown.innerHTML = ''; }
    function showSuggest() {
        const q = inner.value.trim().toLowerCase();
        if (!q) return hideSuggest();
        const matches = sources().filter((s) => String(s).toLowerCase().indexOf(q) !== -1 && tags.indexOf(String(s)) === -1).slice(0, 8);
        if (!matches.length) return hideSuggest();
        dropdown.innerHTML = '';
        matches.forEach((m) => {
            const item = doc.createElement('div');
            item.textContent = m;
            item.style.cssText = 'padding:4px 8px;cursor:pointer;';
            item.addEventListener('mousedown', (e) => { e.preventDefault(); add(m); inner.value = ''; hideSuggest(); });
            dropdown.appendChild(item);
        });
        const r = inner.getBoundingClientRect();
        dropdown.style.left = (r.left + (doc.defaultView ? doc.defaultView.scrollX : 0)) + 'px';
        dropdown.style.top = (r.bottom + (doc.defaultView ? doc.defaultView.scrollY : 0)) + 'px';
        dropdown.style.minWidth = r.width + 'px';
        dropdown.style.display = 'block';
    }

    inner.addEventListener('input', showSuggest);
    inner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === o.delimiter) {
            e.preventDefault();
            if (inner.value.trim()) { add(inner.value); inner.value = ''; hideSuggest(); }
        } else if (e.key === 'Backspace' && inner.value === '' && o.removeWithBackspace && tags.length) {
            remove(tags[tags.length - 1]);
        }
    });
    inner.addEventListener('blur', () => { setTimeout(hideSuggest, 150); if (inner.value.trim()) { add(inner.value); inner.value = ''; } });
    wrap.addEventListener('click', () => inner.focus());
    wrap.appendChild(inner);
    render();

    return {
        getTags: () => tags.slice(),
        add,
        remove,
        destroy() { hideSuggest(); dropdown.remove(); wrap.remove(); input.style.display = ''; }
    };
}

function escapeText(s) {
    return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
