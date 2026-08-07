/**
 * One-shot: split src/features/sei-functions/body.js into cluster modules.
 * Usage: node scripts/split-sei-functions-body.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const featureDir = join(root, 'src/features/sei-functions');
const bodyPath = join(featureDir, 'body.js');

const CLUSTERS = [
    { file: 'page-helpers.js', start: 109, end: 479, title: 'page / iframe helpers' },
    { file: 'tables-filesystem.js', start: 480, end: 780, title: 'tables + filesystem' },
    { file: 'layout-dialogs.js', start: 781, end: 1394, title: 'layout, chosen, dialogs, early ajax' },
    { file: 'interessados-forms.js', start: 1395, end: 1745, title: 'interessados, forms, compare docs' },
    { file: 'marcadores-arvore.js', start: 1746, end: 2288, title: 'marcadores, atribuicao, arvore updates' },
    { file: 'media-viewers.js', start: 2289, end: 2787, title: 'image / zip / video viewers' },
    { file: 'wait-load-home.js', start: 2788, end: 3524, title: 'wait/load + home dados procedimentos' },
    { file: 'tags-menus.js', start: 3525, end: 4354, title: 'tags, etiquetas, flash menus' },
    { file: 'host-clipboard-dialogs.js', start: 4355, end: 4871, title: 'host limits, clipboard, dialog boxes' },
    { file: 'notifications-process.js', start: 4872, end: 6120, title: 'notifications, signature, process model' },
    { file: 'batch-capa.js', start: 6121, end: 7560, title: 'batch actions + capa' },
    { file: 'editor-native-url.js', start: 7561, end: 7791, title: 'native editor URL patching' },
    { file: 'session-history-tables.js', start: 7792, end: 8253, title: 'session, history, tables UI' },
    { file: 'image-docs.js', start: 8254, end: 8943, title: 'image resizer, Google Docs, DocsToSEI' },
    { file: 'editor-captcha.js', start: 8944, end: 9917, title: 'editor dialogs, captcha, checksum' },
    { file: 'visualizacao-toolbar.js', start: 9918, end: 10532, title: 'visualizacao defaults + toolbar icons' },
    { file: 'slim-ui-chrome.js', start: 10533, end: 11089, title: 'slim UI, unidade, dark mode, icons' },
    { file: 'wizards-menu.js', start: 11090, end: 11653, title: 'new doc/proc wizards + SEI menu chrome' },
    { file: 'boot.js', start: 11654, end: 999999, title: 'boot / load scripts' }
];

const SHARED_IMPORTS = {
    extractEditorMontarUrl: "import {\n    extractEditorMontarUrl,\n    isValidEditorMontarUrl,\n    editorWindowNeedsNavigate,\n    getUrlDocumentoId,\n    repairEditorMontarUrl\n} from '../../shared/sei-editor-url.js';",
    sha256Hex: "import { sha256Hex } from '../../core/crypto.js';",
    createQrCodePlaceholder: "import {\n    createQrCodePlaceholder,\n    hydrateQrCodePlaceholders,\n    renderQrCode\n} from '../../shared/qr-code.js';",
    getName: "import { getName, getNameGenre } from '../../shared/nomenclatura.js';",
    refreshSeiPageSelectors: "import { refreshSeiPageSelectors } from './state.js';"
};

const SHARED_SYMBOLS = [
    'extractEditorMontarUrl',
    'isValidEditorMontarUrl',
    'editorWindowNeedsNavigate',
    'getUrlDocumentoId',
    'repairEditorMontarUrl',
    'sha256Hex',
    'createQrCodePlaceholder',
    'hydrateQrCodePlaceholders',
    'renderQrCode',
    'getName',
    'getNameGenre',
    'refreshSeiPageSelectors'
];

const BRIDGE_EXPORTS = [
    'atividadesApi',
    'callAtividades',
    'getAtividadesServer',
    'checkCapacidade',
    'checkPerfilNivelAdm',
    'atividadeCommand',
    'atividadesState',
    'checkPageAtividadesVisualizacao',
    'checkUnidadeFuncBeta',
    'setParamEditorAtiv',
    'extractDataDocument',
    'getConfigServerDoc',
    'getConfigServer',
    'dialogDebugScreen',
    'updateCountKanbanBoard',
    'getKanbanUserPriority',
    'getHtmlKanbanUserPriority',
    'signCancelDocumento'
];

function extractExportName(line) {
    const fn = line.match(/^export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);
    if (fn) return fn[1];
    const c = line.match(/^export\s+const\s+([A-Za-z_$][\w$]*)\s*=/);
    if (c) return c[1];
    const l = line.match(/^export\s+let\s+([A-Za-z_$][\w$]*)\s*=/);
    if (l) return l[1];
    const v = line.match(/^export\s+var\s+([A-Za-z_$][\w$]*)\s*=/);
    if (v) return v[1];
    const cl = line.match(/^export\s+class\s+([A-Za-z_$][\w$]*)/);
    if (cl) return cl[1];
    return null;
}

/** Strip strings/comments; return identifier tokens with positions. */
function tokenizeIdentifiers(source) {
    const ids = [];
    let i = 0;
    const n = source.length;
    while (i < n) {
        const ch = source[i];
        const next = source[i + 1];

        // line comment
        if (ch === '/' && next === '/') {
            i += 2;
            while (i < n && source[i] !== '\n') i++;
            continue;
        }
        // block comment
        if (ch === '/' && next === '*') {
            i += 2;
            while (i < n - 1 && !(source[i] === '*' && source[i + 1] === '/')) i++;
            i += 2;
            continue;
        }
        // string '
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < n) {
                if (source[i] === '\\') { i += 2; continue; }
                if (quote === '`' && source[i] === '$' && source[i + 1] === '{') {
                    // skip template expression naively until }
                    i += 2;
                    let depth = 1;
                    while (i < n && depth > 0) {
                        if (source[i] === '{') depth++;
                        else if (source[i] === '}') depth--;
                        // nested strings inside ${} — recurse-ish skip
                        if (depth > 0 && (source[i] === '"' || source[i] === "'" || source[i] === '`')) {
                            const q2 = source[i++];
                            while (i < n) {
                                if (source[i] === '\\') { i += 2; continue; }
                                if (source[i] === q2) { i++; break; }
                                i++;
                            }
                            continue;
                        }
                        if (depth > 0) i++;
                    }
                    continue;
                }
                if (source[i] === quote) { i++; break; }
                i++;
            }
            continue;
        }
        // regex (heuristic: after = ( [ , ; ! & | ? : { } return)
        if (ch === '/' && next !== '/' && next !== '*') {
            // treat as division if previous non-ws is identifier/number/)
            let j = i - 1;
            while (j >= 0 && /\s/.test(source[j])) j--;
            const prev = j >= 0 ? source[j] : '';
            const canBeRegex = j < 0 || /[=([{,;!&|?:{}~%^<>+\-*]/.test(prev) ||
                source.slice(Math.max(0, j - 5), j + 1).match(/\b(return|typeof|case|throw|new|in|of|void)\s*$/);
            if (canBeRegex) {
                i++;
                while (i < n) {
                    if (source[i] === '\\') { i += 2; continue; }
                    if (source[i] === '[') {
                        i++;
                        while (i < n && source[i] !== ']') {
                            if (source[i] === '\\') i++;
                            i++;
                        }
                        i++;
                        continue;
                    }
                    if (source[i] === '/') { i++; break; }
                    if (source[i] === '\n') break;
                    i++;
                }
                while (i < n && /[gimsuy]/.test(source[i])) i++;
                continue;
            }
        }

        if (/[A-Za-z_$]/.test(ch)) {
            let k = i + 1;
            while (k < n && /[\w$]/.test(source[k])) k++;
            // skip if property access: previous non-ws is .
            let j = i - 1;
            while (j >= 0 && /\s/.test(source[j])) j--;
            const isProp = j >= 0 && source[j] === '.';
            if (!isProp) {
                ids.push({ name: source.slice(i, k), index: i });
            }
            i = k;
            continue;
        }
        i++;
    }
    return ids;
}

function localDefinitions(source) {
    const defs = new Set();
    const patterns = [
        /\bfunction\s+([A-Za-z_$][\w$]*)/g,
        /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g,
        /\bclass\s+([A-Za-z_$][\w$]*)/g,
        /\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
        /\bexport\s+const\s+([A-Za-z_$][\w$]*)\s*=/g
    ];
    for (const re of patterns) {
        let m;
        while ((m = re.exec(source))) defs.add(m[1]);
    }
    return defs;
}

function findUsedExternals(source, allExportNames, localNames) {
    const used = new Set();
    for (const { name } of tokenizeIdentifiers(source)) {
        if (allExportNames.has(name) && !localNames.has(name)) used.add(name);
    }
    return used;
}

function findUsedShared(source) {
    const used = new Set();
    for (const { name } of tokenizeIdentifiers(source)) {
        if (SHARED_SYMBOLS.includes(name)) used.add(name);
    }
    return used;
}

function findUsedBridge(source) {
    const used = new Set();
    for (const { name } of tokenizeIdentifiers(source)) {
        if (BRIDGE_EXPORTS.includes(name)) used.add(name);
    }
    return used;
}

function sharedImportBlock(usedShared) {
    const blocks = [];
    if ([...usedShared].some((n) => n.startsWith('extract') || n.startsWith('isValid') || n.startsWith('editorWindow') || n.startsWith('getUrlDocumento') || n.startsWith('repairEditor'))) {
        blocks.push(SHARED_IMPORTS.extractEditorMontarUrl);
    }
    if (usedShared.has('sha256Hex')) blocks.push(SHARED_IMPORTS.sha256Hex);
    if ([...usedShared].some((n) => n.includes('QrCode') || n.includes('qr'))) {
        // createQrCodePlaceholder / hydrate / render
        if (usedShared.has('createQrCodePlaceholder') || usedShared.has('hydrateQrCodePlaceholders') || usedShared.has('renderQrCode')) {
            blocks.push(SHARED_IMPORTS.createQrCodePlaceholder);
        }
    }
    if (usedShared.has('getName') || usedShared.has('getNameGenre')) {
        blocks.push(SHARED_IMPORTS.getName);
    }
    if (usedShared.has('refreshSeiPageSelectors')) {
        blocks.push(SHARED_IMPORTS.refreshSeiPageSelectors);
    }
    return blocks;
}

if (!existsSync(bodyPath)) {
    console.error('body.js not found — already split?');
    process.exit(1);
}

const body = readFileSync(bodyPath, 'utf8');
const lines = body.split('\n');

// Bridge: lines 26-75 (1-indexed) — export the private helpers
const bridgeLines = lines.slice(25, 75).map((line) => {
    // promote function decls to export
    if (/^function\s+/.test(line)) return 'export ' + line;
    return line;
});
const bridgeSource = `/**
 * Cross-feature Atividades bridge — only talks to SeiPro.features.atividades.api.
 */
${bridgeLines.join('\n')}
`;
writeFileSync(join(featureDir, 'atividades-bridge.js'), bridgeSource, 'utf8');

// Collect exports per cluster
const exportOwner = new Map(); // name -> file
const clusterSources = [];

for (const cluster of CLUSTERS) {
    const startIdx = cluster.start - 1;
    const endIdx = Math.min(cluster.end, lines.length);
    const chunkLines = lines.slice(startIdx, endIdx);
    const chunk = chunkLines.join('\n');
    const exports = [];
    for (const line of chunkLines) {
        const name = extractExportName(line.trimStart ? line : line);
        // also check without trim for export at col 0
        const n = extractExportName(line) || extractExportName(line.trim());
        if (n) {
            exports.push(n);
            if (exportOwner.has(n)) {
                console.warn(`duplicate export ${n} in ${cluster.file} (also ${exportOwner.get(n)})`);
            }
            exportOwner.set(n, cluster.file);
        }
    }
    clusterSources.push({ ...cluster, chunk, exports });
}

const allExportNames = new Set(exportOwner.keys());
console.log(`Collected ${allExportNames.size} exports across ${CLUSTERS.length} clusters`);

// Generate cluster files
for (const cluster of clusterSources) {
    const localNames = localDefinitions(cluster.chunk);
    const usedExternals = findUsedExternals(cluster.chunk, allExportNames, localNames);
    // remove self exports from externals
    for (const e of cluster.exports) usedExternals.delete(e);

    const usedShared = findUsedShared(cluster.chunk);
    const usedBridge = findUsedBridge(cluster.chunk);

    const importLines = [];
    importLines.push(...sharedImportBlock(usedShared));

    if (usedBridge.size) {
        const names = [...usedBridge].sort();
        importLines.push(`import {\n    ${names.join(',\n    ')}\n} from './atividades-bridge.js';`);
    }

    if (usedExternals.size) {
        const names = [...usedExternals].sort();
        // chunk imports to keep lines reasonable
        const CHUNK = 40;
        for (let i = 0; i < names.length; i += CHUNK) {
            const part = names.slice(i, i + CHUNK);
            importLines.push(`import {\n    ${part.join(',\n    ')}\n} from './modules.js';`);
        }
    }

    const header = `/**
 * Sei Functions Pro — ${cluster.title}.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
${importLines.join('\n\n')}
`;

    let bodyChunk = cluster.chunk;
    // boot keeps loadScriptPro() side-effect; ensure file ends with newline
    if (!bodyChunk.endsWith('\n')) bodyChunk += '\n';

    writeFileSync(join(featureDir, cluster.file), header + '\n' + bodyChunk, 'utf8');
    console.log(`wrote ${cluster.file} (${cluster.exports.length} exports, ${usedExternals.size} cross-imports, ${usedBridge.size} bridge)`);
}

// modules.js barrel
const barrel = `/**
 * Sei Functions Pro — barrel de clusters (live bindings para deps cruzadas).
 */
${CLUSTERS.map((c) => `export * from './${c.file}';`).join('\n')}
export * from './atividades-bridge.js';
`;
writeFileSync(join(featureDir, 'modules.js'), barrel, 'utf8');

console.log('wrote modules.js');
console.log('Done. Next: wire index/legacy-api, delete body.js, update tests.');
