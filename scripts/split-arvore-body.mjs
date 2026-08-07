/**
 * One-shot: split src/features/arvore/body.js into cluster modules.
 * Usage: node scripts/split-arvore-body.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const featureDir = join(root, 'src/features/arvore');
const bodyPath = join(featureDir, 'body.js');

const CLUSTERS = [
    { file: 'menu-panel.js', start: 40, end: 75, title: 'menu adapters + panel selection' },
    { file: 'toolbar-docs.js', start: 77, end: 581, title: 'toolbar CSS, docs menu, links' },
    { file: 'doc-actions.js', start: 582, end: 1066, title: 'tree actions, duplicate, loading' },
    // 1067–1095: re-export sticknote-view — keep sticknote-view.js as source of truth
    { file: 'interessados-arvore.js', start: 1097, end: 1208, title: 'interessados panel' },
    { file: 'atividades-arvore.js', start: 1209, end: 1316, title: 'atividades panel/filter in tree' },
    { file: 'tree-chrome.js', start: 1317, end: 1516, title: 'duas linhas, style, numeric, chrome' },
    {
        file: 'boot.js',
        start: 1517,
        end: 999999,
        title: 'initSeiProArvore boot',
        bootSideEffects: true
    }
];

const EXISTING_CLUSTER_FILES = ['sticknote-view.js', 'upload.js', 'atividades-bridge.js'];

const SHARED_IMPORTS = {
    resolveMenuCatalogs: "import { resolveMenuCatalogs } from './domain.js';",
    domainGetLinksInText: "import { getLinksInText as domainGetLinksInText } from './domain.js';",
    buildArvoreInitSignature: "import { buildArvoreInitSignature } from './domain.js';",
    readArvoreMenuConfigIO: "import { readArvoreMenuConfig as readArvoreMenuConfigIO } from './io.js';",
    bindArvoreToolbarProcess: "import { bindArvoreToolbarProcess } from './view.js';",
    bindParentAtividadesActions: "import { bindParentAtividadesActions } from './view.js';",
    templates: "import * as templates from './templates.js';",
    openModalDropzone: "import { openModalDropzone } from './upload.js';",
    initUploadArvore: "import { initUploadArvore } from './upload.js';",
    editorUrl: "import {\n    extractEditorMontarUrl,\n    isValidEditorMontarUrl,\n    linkMatchesDocumentoId\n} from '../../shared/sei-editor-url.js';",
    installArvoreState: "import { installArvoreState } from './state.js';"
};

const SHARED_SYMBOLS = [
    'resolveMenuCatalogs',
    'domainGetLinksInText',
    'buildArvoreInitSignature',
    'readArvoreMenuConfigIO',
    'bindArvoreToolbarProcess',
    'bindParentAtividadesActions',
    'templates',
    'openModalDropzone',
    'initUploadArvore',
    'extractEditorMontarUrl',
    'isValidEditorMontarUrl',
    'linkMatchesDocumentoId',
    'installArvoreState'
];

const BRIDGE_EXPORTS = ['atividadesApiParent', 'atividadesStateParent', 'callParentAtividades'];

const EDITOR_URL_SYMBOLS = ['extractEditorMontarUrl', 'isValidEditorMontarUrl', 'linkMatchesDocumentoId'];

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

        if (ch === '/' && next === '/') {
            i += 2;
            while (i < n && source[i] !== '\n') i++;
            continue;
        }
        if (ch === '/' && next === '*') {
            i += 2;
            while (i < n - 1 && !(source[i] === '*' && source[i + 1] === '/')) i++;
            i += 2;
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < n) {
                if (source[i] === '\\') { i += 2; continue; }
                if (quote === '`' && source[i] === '$' && source[i + 1] === '{') {
                    i += 2;
                    let depth = 1;
                    while (i < n && depth > 0) {
                        if (source[i] === '{') depth++;
                        else if (source[i] === '}') depth--;
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
        if (ch === '/' && next !== '/' && next !== '*') {
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
        /\bexport\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g
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
    const domainNames = [];
    if (usedShared.has('resolveMenuCatalogs')) domainNames.push('resolveMenuCatalogs');
    if (usedShared.has('buildArvoreInitSignature')) domainNames.push('buildArvoreInitSignature');
    if (domainNames.length) {
        blocks.push(`import {\n    ${domainNames.join(',\n    ')}\n} from './domain.js';`);
    }
    if (usedShared.has('domainGetLinksInText')) blocks.push(SHARED_IMPORTS.domainGetLinksInText);
    if (usedShared.has('readArvoreMenuConfigIO')) blocks.push(SHARED_IMPORTS.readArvoreMenuConfigIO);

    const viewNames = [];
    if (usedShared.has('bindArvoreToolbarProcess')) viewNames.push('bindArvoreToolbarProcess');
    if (usedShared.has('bindParentAtividadesActions')) viewNames.push('bindParentAtividadesActions');
    if (viewNames.length) {
        blocks.push(`import {\n    ${viewNames.join(',\n    ')}\n} from './view.js';`);
    }

    if (usedShared.has('templates')) blocks.push(SHARED_IMPORTS.templates);

    const uploadNames = [];
    if (usedShared.has('openModalDropzone')) uploadNames.push('openModalDropzone');
    if (usedShared.has('initUploadArvore')) uploadNames.push('initUploadArvore');
    if (uploadNames.length) {
        blocks.push(`import {\n    ${uploadNames.join(',\n    ')}\n} from './upload.js';`);
    }

    if (EDITOR_URL_SYMBOLS.some((n) => usedShared.has(n))) {
        const names = EDITOR_URL_SYMBOLS.filter((n) => usedShared.has(n));
        blocks.push(`import {\n    ${names.join(',\n    ')}\n} from '../../shared/sei-editor-url.js';`);
    }

    if (usedShared.has('installArvoreState')) blocks.push(SHARED_IMPORTS.installArvoreState);
    return blocks;
}

function sliceLines(lines, start, end) {
    const startIdx = start - 1;
    const endIdx = Math.min(end, lines.length);
    return lines.slice(startIdx, endIdx);
}

if (!existsSync(bodyPath)) {
    console.error('body.js not found — already split?');
    process.exit(1);
}

const body = readFileSync(bodyPath, 'utf8');
const lines = body.split('\n');

const exportOwner = new Map();
for (const file of EXISTING_CLUSTER_FILES) {
    const path = join(featureDir, file);
    if (!existsSync(path)) continue;
    const src = readFileSync(path, 'utf8');
    for (const line of src.split('\n')) {
        const n = extractExportName(line) || extractExportName(line.trim());
        if (n) exportOwner.set(n, file);
    }
}

const clusterSources = [];

for (const cluster of CLUSTERS) {
    let chunkLines = sliceLines(lines, cluster.start, cluster.end);
    const chunk = chunkLines.join('\n');
    const exports = [];
    for (const line of chunkLines) {
        const n = extractExportName(line) || extractExportName(line.trim());
        if (n) {
            exports.push(n);
            if (exportOwner.has(n)) {
                console.warn(`duplicate export ${n} in ${cluster.file} (also ${exportOwner.get(n)})`);
            }
            exportOwner.set(n, cluster.file);
        }
    }
    clusterSources.push({ ...cluster, chunk, chunkLines, exports });
}

const allExportNames = new Set(exportOwner.keys());
console.log(`Collected ${allExportNames.size} exports across ${CLUSTERS.length} new clusters + existing`);

for (const cluster of clusterSources) {
    const localNames = localDefinitions(cluster.chunk);
    const usedExternals = findUsedExternals(cluster.chunk, allExportNames, localNames);
    for (const e of cluster.exports) usedExternals.delete(e);

    const usedShared = findUsedShared(cluster.chunk);
    const usedBridge = findUsedBridge(cluster.chunk);
    for (const name of usedBridge) usedExternals.delete(name);
    // Shared imports (domain/io/view/upload/…) win over modules re-exports of the same name.
    for (const name of usedShared) usedExternals.delete(name);

    // menu-panel assigns selectedItensPanelArvore at load — ensure state exists first
    if (cluster.file === 'menu-panel.js') {
        usedShared.add('installArvoreState');
    }

    // boot must re-bind parent atividades actions once on load
    if (cluster.bootSideEffects) {
        usedShared.add('bindParentAtividadesActions');
        usedBridge.add('callParentAtividades');
    }

    const importLines = [];
    importLines.push(...sharedImportBlock(usedShared));

    if (usedBridge.size) {
        const names = [...usedBridge].sort();
        importLines.push(`import {\n    ${names.join(',\n    ')}\n} from './atividades-bridge.js';`);
    }

    if (usedExternals.size) {
        const names = [...usedExternals].sort();
        const CHUNK = 40;
        for (let i = 0; i < names.length; i += CHUNK) {
            const part = names.slice(i, i + CHUNK);
            importLines.push(`import {\n    ${part.join(',\n    ')}\n} from './modules.js';`);
        }
    }

    const sideEffectLines = [];
    if (cluster.file === 'menu-panel.js') {
        sideEffectLines.push('installArvoreState();');
    }
    if (cluster.bootSideEffects) {
        sideEffectLines.push('bindParentAtividadesActions({ callParentAtividades });');
    }

    const header = `/**
 * Árvore — ${cluster.title}.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
${importLines.join('\n\n')}
${sideEffectLines.length ? '\n' + sideEffectLines.join('\n') + '\n' : ''}
`;

    let bodyChunk = cluster.chunk;
    if (!bodyChunk.endsWith('\n')) bodyChunk += '\n';

    writeFileSync(join(featureDir, cluster.file), header + '\n' + bodyChunk, 'utf8');
    console.log(`wrote ${cluster.file} (${cluster.exports.length} exports, ${usedExternals.size} cross-imports, ${usedBridge.size} bridge, ${usedShared.size} shared)`);
}

const barrel = `/**
 * Árvore — barrel de clusters (live bindings para deps cruzadas).
 */
${CLUSTERS.map((c) => `export * from './${c.file}';`).join('\n')}
export * from './sticknote-view.js';
export * from './upload.js';
export * from './atividades-bridge.js';
`;
writeFileSync(join(featureDir, 'modules.js'), barrel, 'utf8');

console.log('wrote modules.js');
console.log('Done. Next: wire index/legacy-api, delete body.js, update tests.');
