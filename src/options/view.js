/**
 * Options page — view / orchestration (vanilla).
 *
 * Replaces the jQuery + jQuery UI + jmespath options.js. Tabs and alerts are
 * implemented without jQuery UI (uses shared openModal). Feature-specific
 * plugs (e.g. monitorados/options.js) remain separate bundles.
 */
import { openModal } from '../shared/ui/modal.js';
import {
    buildDataValuesPayload,
    classifyProfileDraft,
    computeDependentVisibility,
    inferConexaoTipo,
    isDefaultEnabledConfigOption,
    normalizeOptionsSearchText,
    parseDataValues,
    parseNewDocSigilo,
    pickConfigGeral,
    pickProfiles,
    resolveConfigFieldValue,
    resolveSwitchChecked,
    rowMatchesSearch,
    serializeDataValues
} from './domain.js';
import {
    clearDataValues,
    downloadJsonFile,
    getExtensionManifest,
    loadDataValues,
    readTextFile,
    saveDataValues,
    syncProcessNotificationOption
} from './io.js';

const TAB_PANEL_IDS = [
    'options-process-control',
    'options-editor-text',
    'options-tree-view',
    'options-database',
    'options-complements'
];

const GENERAL_PANEL_IDS = [
    'options-process-control',
    'options-editor-text',
    'options-tree-view'
];

const searchState = {
    rafId: 0,
    tabsActive: 0,
    tabsSearchMode: false
};

function $(sel, root) {
    return (root || document).querySelector(sel);
}

function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
}

function show(el, on) {
    if (!el) return;
    el.style.display = on ? '' : 'none';
}

function closest(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
}

function alertaBoxPro(status, icon, text) {
    openModal({
        title: '',
        width: 420,
        content: '<strong class="alerta' + status + 'Pro alertaBoxPro" style="font-size:12pt;padding:15px 5px 0;display:block;">'
            + '<i class="fas fa-' + icon + '"></i> ' + text + '</strong>',
        buttons: [{
            text: 'OK',
            onClick: (ref) => {
                ref.close();
                location.reload();
            }
        }],
        onClose: () => { location.reload(); }
    });
}

function closeOptionsView(goHome) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                source: 'SEI_PRO_OPTIONS',
                action: 'close-options',
                goHome: goHome === true
            }, '*');
            return true;
        }
    } catch (error) {
        console.warn('Could not notify options close:', error);
    }
    try {
        window.close();
        return true;
    } catch (error) {
        console.warn('Could not close options window:', error);
    }
    return false;
}

function getGeneralPanels() {
    return GENERAL_PANEL_IDS.map((id) => document.getElementById(id)).filter(Boolean);
}

function readSwitchMap() {
    const map = {};
    $all('input[name="onoffswitch"][data-name]').forEach((input) => {
        map[input.getAttribute('data-name')] = !!input.checked;
    });
    return map;
}

function applyDependentVisibility() {
    const vis = computeDependentVisibility(readSwitchMap());
    show(document.getElementById('newdocDefault_table'), vis.newdocDefault_table);
    show(document.getElementById('uploadDoc_sortBefore'), vis.uploadDoc_sortBefore);
    show(document.getElementById('getDocCertidao_docName'), vis.getDocCertidao_docName);
    show(document.getElementById('newDoc_sigilo'), vis.newDoc_sigilo);

    if (vis.clearNewDocSigilo) {
        const sel = document.getElementById('itemConfigGeral_newdocsigilo');
        if (sel) {
            sel.innerHTML = '<option value=""></option>';
            sel.value = '';
        }
    }
    if (vis.uncheckSortBeforeUpload) {
        const sort = document.getElementById('itemConfigGeral_sortbeforeupload');
        if (sort) sort.checked = false;
    }
}

function setIconTone(input, on) {
    const row = closest(input, 'tr');
    if (!row) return;
    const icon = row.querySelector('.iconPopup');
    if (!icon) return;
    if (on) {
        icon.classList.add('azulColor');
        icon.classList.remove('cinzaColor');
    } else {
        icon.classList.remove('azulColor');
        icon.classList.add('cinzaColor');
    }
}

function collectConfigGeral() {
    const items = [];
    const panels = getGeneralPanels();
    const complements = document.getElementById('options-complements');
    const roots = complements ? panels.concat([complements]) : panels;

    roots.forEach((root) => {
        $all('input[name="onoffswitch"][data-name]', root).forEach((input) => {
            const checked = !!input.checked;
            setIconTone(input, checked);
            items.push({ name: input.getAttribute('data-name'), value: checked });
        });
        $all('input[type="text"][data-name]', root).forEach((input) => {
            if (input.value !== '') items.push({ name: input.getAttribute('data-name'), value: input.value });
        });
        $all('input[type="number"][data-name]', root).forEach((input) => {
            if (input.value !== '') {
                items.push({ name: input.getAttribute('data-name'), value: parseInt(input.value, 10) });
            }
        });
        $all('select[data-name]', root).forEach((input) => {
            if (input.value !== '') items.push({ name: input.getAttribute('data-name'), value: input.value });
        });
    });

    applyDependentVisibility();
    return items;
}

function collectProfiles() {
    const profiles = [];
    let incomplete = 0;
    $all('.options-table').forEach((table) => {
        const input = {};
        $all('.input-config-pro', table).forEach((field) => {
            field.classList.remove('inputError');
            const name = field.getAttribute('data-name-input');
            if (name) input[name] = field.value;
        });

        const draft = classifyProfileDraft(input);
        if (draft.status === 'blank') {
            // Empty default row — profiles are optional; skip without blocking save.
            return;
        }
        if (draft.status === 'incomplete') {
            // Legacy behavior: highlight, skip the incomplete profile, still save configGeral.
            incomplete++;
            draft.missingRequired.forEach((name) => {
                const field = table.querySelector('.input-config-pro[data-name-input="' + name + '"]');
                if (field) field.classList.add('inputError');
            });
            return;
        }
        profiles.push(input);
    });
    return { profiles, incomplete };
}

async function saveOptions(reload) {
    // Database profiles are optional. Blank/incomplete rows are skipped; general
    // switches always save (same contract as the pre-migration options.js).
    const { profiles } = collectProfiles();
    const configGeral = collectConfigGeral();
    const payload = buildDataValuesPayload(profiles, configGeral);
    const serialized = serializeDataValues(payload);
    try {
        await saveDataValues(serialized);
        const notif = document.getElementById('itemConfigGeral_notificacaonovoprocesso');
        syncProcessNotificationOption(notif ? notif.checked : false);
        if (reload === true) {
            if (!closeOptionsView(true)) {
                alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es salvas com sucesso!');
            }
        } else {
            downloadJsonFile('config.json', serialized);
            location.reload();
        }
    } catch (error) {
        console.warn('options: save failed', error);
        alertaBoxPro('Error', 'exclamation-triangle', 'N\u00e3o foi poss\u00edvel salvar as configura\u00e7\u00f5es.');
    }
}

async function removeOptions() {
    try {
        await clearDataValues();
        alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es removidas com sucesso!');
    } catch (error) {
        alertaBoxPro('Error', 'exclamation-triangle', 'N\u00e3o foi poss\u00edvel remover as configura\u00e7\u00f5es.');
    }
}

async function loadFile() {
    const input = document.getElementById('selectFiles');
    const files = input && input.files;
    if (!files || files.length <= 0) return;
    try {
        const text = await readTextFile(files.item(0));
        const parsed = JSON.parse(text);
        await saveDataValues(serializeDataValues(Array.isArray(parsed) ? parsed : []));
        alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es carregadas com sucesso!');
    } catch (error) {
        console.warn('options: import failed', error);
        alertaBoxPro('Error', 'exclamation-triangle', 'Arquivo de configura\u00e7\u00e3o inv\u00e1lido.');
    }
}

function changeConexaoTipo(selectEl) {
    const table = closest(selectEl, 'table');
    if (!table) return;
    const mode = selectEl.value;
    const sheets = $all('tr.sheets', table);
    const api = $all('tr.api', table);
    const clientid = $all('tr.clientid', table);
    const keyuser = $all('tr.api.keyuser', table);

    if (mode === 'sheets') {
        sheets.forEach((tr) => { tr.style.display = ''; });
        api.forEach((tr) => {
            tr.style.display = 'none';
            $all('input', tr).forEach((i) => { i.value = ''; });
        });
    } else if (mode === 'api') {
        sheets.forEach((tr) => {
            tr.style.display = 'none';
            $all('input', tr).forEach((i) => { i.value = ''; });
        });
        api.forEach((tr) => { tr.style.display = ''; });
    } else if (mode === 'googleapi') {
        sheets.forEach((tr) => {
            if (!tr.classList.contains('clientid')) {
                tr.style.display = 'none';
                $all('input', tr).forEach((i) => { i.value = ''; });
            }
        });
        api.forEach((tr) => { tr.style.display = ''; });
        clientid.forEach((tr) => { tr.style.display = ''; });
        keyuser.forEach((tr) => { tr.style.display = 'none'; });
    }
}

function passReveal(btn) {
    const td = closest(btn, 'td');
    if (!td) return;
    const showInput = td.querySelector('input[type="text"].passReveal');
    const passInput = td.querySelector('input[type="password"].passReveal');
    if (!showInput || !passInput) return;
    const showing = window.getComputedStyle(showInput).display !== 'none';
    const from = showing ? showInput : passInput;
    const to = showing ? passInput : showInput;
    from.style.display = 'none';
    to.value = from.value;
    to.style.display = '';
    btn.className = showing
        ? 'option-ref passRevealBtn fas fa-eye'
        : 'option-ref passRevealBtn fas fa-eye-slash';
}

function passUpdate(input) {
    const td = closest(input, 'td');
    if (!td) return;
    const showInput = td.querySelector('input[type="text"].passReveal');
    const passInput = td.querySelector('input[type="password"].passReveal');
    if (!showInput || !passInput) return;
    if (input.type === 'text') passInput.value = showInput.value;
    else if (input.type === 'password') showInput.value = passInput.value;
}

function actionRemoveProfile(idTable) {
    const up = document.getElementById('sca-upProfile-' + idTable);
    const down = document.getElementById('sca-downProfile-' + idTable);
    const remove = document.getElementById('sca-removeProfile-' + idTable);
    const table = document.getElementById('options-table-' + idTable);

    if (up) {
        up.style.display = '';
        up.onclick = () => {
            if (!table) return;
            const prev = table.previousElementSibling;
            if (prev) table.parentNode.insertBefore(table, prev);
        };
    }
    if (down) {
        down.style.display = '';
        down.onclick = () => {
            if (!table) return;
            const next = table.nextElementSibling;
            if (next) table.parentNode.insertBefore(next, table);
        };
    }
    if (remove) {
        remove.style.display = '';
        remove.onclick = () => {
            if (!table) return;
            if ($all('.removeProfile').length > 1) {
                table.remove();
                applyOptionsSearchFilter();
            } else {
                $all('.input-config-pro', table).forEach((i) => { i.value = ''; });
                removeOptions();
                applyOptionsSearchFilter();
            }
        };
    }
}

function addActionsProfile() {
    $all('.sca-conexaoTipo').forEach((sel) => {
        sel.onchange = () => changeConexaoTipo(sel);
    });
    $all('.passRevealBtn').forEach((btn) => {
        btn.onclick = () => passReveal(btn);
    });
    $all('.passReveal').forEach((input) => {
        input.oninput = () => passUpdate(input);
    });
}

function addProfile() {
    const template = document.getElementById('options-table-0');
    const host = document.getElementById('options-profile');
    if (!template || !host) return;
    const idTable = $all('.options-table').length;
    const clone = template.cloneNode(true);
    clone.id = 'options-table-' + idTable;
    $all('.input-config-pro', clone).forEach((i) => { i.value = ''; });
    $all('.option-ref', clone).forEach((el) => {
        if (el.id) el.id = el.id.replace('-0', '-' + idTable);
    });
    host.appendChild(clone);
    actionRemoveProfile(idTable);
    addActionsProfile();
    applyOptionsSearchFilter();
}

function fillProfileTable(table, profile) {
    Object.keys(profile).forEach((key) => {
        const field = table.querySelector('.input-config-pro[data-name-input="' + key + '"]');
        if (field) field.value = profile[key] == null ? '' : profile[key];
    });
    const conexao = table.querySelector('.sca-conexaoTipo');
    if (!conexao) return;
    if (profile.spreadsheetId) {
        conexao.value = 'sheets';
    } else {
        conexao.value = inferConexaoTipo(profile);
    }
    changeConexaoTipo(conexao);
}

function applyConfigGeralToUi(configGeral) {
    $all('input[name="onoffswitch"][data-name]').forEach((input) => {
        const name = input.getAttribute('data-name');
        if (isDefaultEnabledConfigOption(name)) {
            input.checked = true;
            setIconTone(input, true);
        }
    });

    $all('input[name="onoffswitch"][data-name]').forEach((input) => {
        const name = input.getAttribute('data-name');
        const checked = resolveSwitchChecked(configGeral, name);
        // Only override when an entry exists or default-enabled applies.
        const entryExists = Array.isArray(configGeral)
            && configGeral.some((v) => v && v.name === name);
        if (entryExists || isDefaultEnabledConfigOption(name)) {
            input.checked = checked;
            setIconTone(input, checked);
        }
    });

    const textKeys = [
        'newdocname', 'certidaosigilo_nomedoc', 'newdocobs', 'newdocespec',
        'newdocformat', 'citacaodoc', 'combinacaoteclas', 'salvamentoautomatico',
        'qualidadeimagens'
    ];
    textKeys.forEach((name) => {
        const value = resolveConfigFieldValue(configGeral, name);
        if (value === null) return;
        const el = document.getElementById('itemConfigGeral_' + name);
        if (!el) return;
        el.value = value;
        setIconTone(el, true);
    });

    const sigiloRaw = resolveConfigFieldValue(configGeral, 'newdocsigilo');
    const sigilo = parseNewDocSigilo(sigiloRaw == null ? '' : String(sigiloRaw));
    if (sigilo) {
        const sel = document.getElementById('itemConfigGeral_newdocsigilo');
        if (sel) {
            const opt = document.createElement('option');
            opt.value = sigilo.id;
            opt.selected = true;
            opt.textContent = sigilo.label;
            sel.appendChild(opt);
            sel.value = sigilo.id;
        }
    }

    applyDependentVisibility();
}

async function restoreOptions() {
    const raw = await loadDataValues();
    const dataValues = parseDataValues(raw);
    const profiles = pickProfiles(dataValues);
    const configGeral = pickConfigGeral(dataValues);

    for (let i = 0; i < profiles.length; i++) {
        if (i > 0) addProfile();
        else actionRemoveProfile(i);
    }

    profiles.forEach((profile, index) => {
        const table = document.getElementById('options-table-' + index);
        if (table) fillProfileTable(table, profile);
    });

    if (profiles.length === 0) {
        setTimeout(() => {
            $all('.sca-conexaoTipo').forEach((sel) => changeConexaoTipo(sel));
        }, 500);
    }

    applyConfigGeralToUi(configGeral);
    addActionsProfile();
    applyOptionsSearchFilter();
}

/* ---------- vanilla tabs (replaces jQuery UI tabs) ---------- */

function initTabs() {
    const root = document.getElementById('options-tabs');
    if (!root) return;
    const links = $all(':scope > ul > li > a', root);
    const panels = TAB_PANEL_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    function activate(index) {
        searchState.tabsActive = index;
        links.forEach((a, i) => {
            const li = a.parentElement;
            if (li) li.classList.toggle('seipro-options-tab-active', i === index);
            a.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        panels.forEach((panel, i) => {
            show(panel, i === index);
        });
    }

    links.forEach((a, index) => {
        a.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (root.classList.contains('options-search-mode')) return;
            activate(index);
        });
    });

    root.classList.add('seipro-options-tabs');
    activate(typeof searchState.tabsActive === 'number' ? searchState.tabsActive : 0);
}

function setOptionsTabsSearchMode(enable) {
    const tabs = document.getElementById('options-tabs');
    if (!tabs) return;

    if (enable) {
        if (!tabs.classList.contains('options-search-mode')) {
            tabs.classList.add('options-search-mode');
            const ul = tabs.querySelector(':scope > ul');
            if (ul) ul.style.display = 'none';
            TAB_PANEL_IDS.forEach((id) => show(document.getElementById(id), true));
        }
        searchState.tabsSearchMode = true;
    } else if (tabs.classList.contains('options-search-mode')) {
        tabs.classList.remove('options-search-mode');
        const ul = tabs.querySelector(':scope > ul');
        if (ul) ul.style.display = '';
        searchState.tabsSearchMode = false;
        initTabs();
    }
}

function rebuildOptionsFunctionTabs() {
    const accordion = document.getElementById('accordion');
    if (!accordion) return;
    const tabMap = [
        'options-process-control',
        'options-editor-text',
        'options-tree-view'
    ];
    const headings = Array.from(accordion.children).filter((el) => el.tagName === 'H3');
    headings.forEach((h3, index) => {
        const targetId = tabMap[index];
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target || target.innerHTML.trim() !== '') return;
        let pane = h3.nextElementSibling;
        while (pane && pane.tagName !== 'DIV') pane = pane.nextElementSibling;
        if (!pane) return;
        while (pane.firstChild) target.appendChild(pane.firstChild);
    });
}

function clearOptionsSearchFilterClasses() {
    $all('.options-search-hidden').forEach((el) => el.classList.remove('options-search-hidden'));
    $all('.options-search-match').forEach((el) => el.classList.remove('options-search-match'));
}

function applyOptionsSearchFilter() {
    const input = document.getElementById('options-search-input');
    const query = normalizeOptionsSearchText(input ? input.value : '');
    const hasQuery = query !== '';
    const empty = document.getElementById('options-search-empty');
    let visibleMatches = 0;
    const tabMatches = [false, false, false, false, false];

    clearOptionsSearchFilterClasses();
    setOptionsTabsSearchMode(hasQuery);

    if (!hasQuery) {
        show(empty, false);
        return;
    }

    const tabDefinitions = [
        { selector: '#options-process-control table.tableZebra', index: 0 },
        { selector: '#options-editor-text table.tableZebra', index: 1 },
        { selector: '#options-tree-view table.tableZebra', index: 2 },
        { selector: '#options-profile .options-table', index: 3 },
        { selector: '#options-complements table.tableZebra', index: 4 }
    ];

    tabDefinitions.forEach((definition) => {
        $all(definition.selector).forEach((table) => {
            let tableHasMatch = false;
            $all('tr', table).forEach((row) => {
                if (row.id === 'footer') return;
                if (row.offsetParent === null && !row.classList.contains('options-search-hidden')) {
                    // Skip rows already hidden by feature CSS (e.g. .lab), except we still
                    // evaluate text for search when search-mode forces panels visible.
                }
                const match = rowMatchesSearch(row.textContent || '', query);
                if (match) {
                    tableHasMatch = true;
                    visibleMatches++;
                    row.classList.remove('options-search-hidden');
                    row.classList.add('options-search-match');
                } else {
                    row.classList.add('options-search-hidden');
                    row.classList.remove('options-search-match');
                }
            });
            if (tableHasMatch) {
                tabMatches[definition.index] = true;
                table.classList.remove('options-search-hidden');
            } else {
                table.classList.add('options-search-hidden');
            }
        });
    });

    show(empty, visibleMatches === 0);
}

function scheduleOptionsSearchFilter() {
    if (searchState.rafId) window.cancelAnimationFrame(searchState.rafId);
    searchState.rafId = window.requestAnimationFrame(() => {
        searchState.rafId = 0;
        applyOptionsSearchFilter();
    });
}

function setNamePage() {
    const manifest = getExtensionManifest();
    if (!manifest) return;
    const name = manifest.short_name || '';
    const icon = manifest.icons && manifest.icons['32'] ? manifest.icons['32'] : '';
    const urlPages = 'https://sei-pro.github.io/sei-pro';
    $all('.title .name-space').forEach((el) => { el.textContent = name; });
    $all('.icon-space').forEach((el) => {
        if (icon) el.setAttribute('src', '../' + icon);
    });
    $all('a.manual').forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (href.indexOf('http') !== 0) a.setAttribute('href', urlPages + href);
    });
    if (name === 'SEI Pro PRF Dev') document.body.classList.add('SEIPro_lab');
    else if (name === 'ANTAQ Pro' || name === 'ANTT Pro') document.body.classList.add('ANTAQ_Pro');
}

function bindEvents() {
    const importBtn = document.getElementById('import');
    const exportBtn = document.getElementById('export');
    const fileInput = document.getElementById('selectFiles');
    const newBtn = document.getElementById('new');
    const searchInput = document.getElementById('options-search-input');
    const searchClear = document.getElementById('options-search-clear');

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            if (fileInput) fileInput.click();
        });
    }
    if (exportBtn) exportBtn.addEventListener('click', () => { saveOptions(false); });
    if (fileInput) fileInput.addEventListener('change', () => { loadFile(); });
    if (newBtn) newBtn.addEventListener('click', () => addProfile());

    $all('.save').forEach((btn) => {
        btn.addEventListener('click', () => { saveOptions(true); });
    });

    document.addEventListener('change', (ev) => {
        const t = ev.target;
        if (t && t.matches && t.matches('input[name="onoffswitch"]')) {
            collectConfigGeral();
        }
    });

    document.addEventListener('keyup', (ev) => {
        const t = ev.target;
        if (!t || !t.matches) return;
        if (!t.matches('#options-process-control input[type="text"], #options-editor-text input[type="text"], #options-tree-view input[type="text"], #options-functions input[type="text"]')) {
            return;
        }
        setIconTone(t, t.value !== '');
    });

    if (searchInput) {
        searchInput.addEventListener('input', scheduleOptionsSearchFilter);
        searchInput.addEventListener('search', scheduleOptionsSearchFilter);
    }
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                scheduleOptionsSearchFilter();
                searchInput.focus();
            }
        });
    }
}

export async function installOptionsPage() {
    bindEvents();
    rebuildOptionsFunctionTabs();
    initTabs();
    setNamePage();
    await restoreOptions();
    applyOptionsSearchFilter();
}
