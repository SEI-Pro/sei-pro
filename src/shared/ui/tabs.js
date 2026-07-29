/**
 * Accessible tabs primitive (replaces jQuery UI $.tabs).
 *
 * API: const t = createTabs(root, { onChange }); t.select(id); t.destroy();
 * Expects markup:
 *   <div class="seipro-tabs">
 *     <div role="tablist">...</div>
 *     <div role="tabpanel" id="panel-1">...</div>
 *   </div>
 * Or builds from items: createTabs(root, { items: [{ id, label, content }] })
 */
export function createTabs(root, opts = {}) {
    if (!root) throw new Error('createTabs: root required');
    const o = Object.assign({ onChange: null, selected: null }, opts);

    let tablist = root.querySelector('[role="tablist"]');
    const panels = [];

    if (Array.isArray(o.items) && o.items.length) {
        root.innerHTML = '';
        root.classList.add('seipro-tabs');
        tablist = document.createElement('div');
        tablist.setAttribute('role', 'tablist');
        tablist.className = 'seipro-tabs__list';
        root.appendChild(tablist);
        o.items.forEach((item, i) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.setAttribute('role', 'tab');
            tab.id = 'seipro-tab-' + item.id;
            tab.setAttribute('aria-controls', 'seipro-panel-' + item.id);
            tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            tab.tabIndex = i === 0 ? 0 : -1;
            tab.className = 'seipro-tabs__tab';
            tab.textContent = item.label;
            tab.dataset.tabId = String(item.id);
            tablist.appendChild(tab);

            const panel = document.createElement('div');
            panel.setAttribute('role', 'tabpanel');
            panel.id = 'seipro-panel-' + item.id;
            panel.setAttribute('aria-labelledby', tab.id);
            panel.className = 'seipro-tabs__panel';
            panel.hidden = i !== 0;
            if (typeof item.content === 'string') panel.innerHTML = item.content;
            else if (item.content instanceof Node) panel.appendChild(item.content);
            root.appendChild(panel);
            panels.push(panel);
        });
    } else {
        root.classList.add('seipro-tabs');
        if (!tablist) {
            tablist = document.createElement('div');
            tablist.setAttribute('role', 'tablist');
            tablist.className = 'seipro-tabs__list';
            root.insertBefore(tablist, root.firstChild);
        }
        root.querySelectorAll('[role="tabpanel"]').forEach((p) => panels.push(p));
    }

    const tabs = () => [...tablist.querySelectorAll('[role="tab"]')];

    function select(id) {
        const idStr = String(id);
        tabs().forEach((tab) => {
            const on = tab.dataset.tabId === idStr || tab.getAttribute('aria-controls') === 'seipro-panel-' + idStr;
            tab.setAttribute('aria-selected', on ? 'true' : 'false');
            tab.tabIndex = on ? 0 : -1;
            const panel = document.getElementById(tab.getAttribute('aria-controls'));
            if (panel) panel.hidden = !on;
        });
        if (typeof o.onChange === 'function') o.onChange(idStr);
    }

    function onKey(ev) {
        const list = tabs();
        const i = list.indexOf(ev.target);
        if (i < 0) return;
        let next = i;
        if (ev.key === 'ArrowRight') next = (i + 1) % list.length;
        else if (ev.key === 'ArrowLeft') next = (i - 1 + list.length) % list.length;
        else if (ev.key === 'Home') next = 0;
        else if (ev.key === 'End') next = list.length - 1;
        else return;
        ev.preventDefault();
        list[next].focus();
        select(list[next].dataset.tabId);
    }

    function onClick(ev) {
        const tab = ev.target.closest('[role="tab"]');
        if (!tab || !tablist.contains(tab)) return;
        select(tab.dataset.tabId);
    }

    tablist.addEventListener('click', onClick);
    tablist.addEventListener('keydown', onKey);

    const initial = o.selected || (tabs()[0] && tabs()[0].dataset.tabId);
    if (initial) select(initial);

    return {
        select,
        selected: () => {
            const t = tabs().find((x) => x.getAttribute('aria-selected') === 'true');
            return t ? t.dataset.tabId : null;
        },
        destroy() {
            tablist.removeEventListener('click', onClick);
            tablist.removeEventListener('keydown', onKey);
        }
    };
}
