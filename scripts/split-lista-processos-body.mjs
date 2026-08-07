/**
 * One-shot: split src/features/lista-processos/body.js into cluster modules.
 * Usage: node scripts/split-lista-processos-body.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const featureDir = join(root, 'src/features/lista-processos');
const bodyPath = join(featureDir, 'body.js');

const CLUSTERS = [
    { file: 'runtime-maps.js', start: 61, end: 97, title: 'processo maps + client load helpers' },
    { file: 'grouping-select.js', start: 99, end: 883, title: 'agrupamento, select-all, tags' },
    {
        file: 'home-filters.js',
        start: 884,
        end: 1246,
        title: 'home + assignment filters',
        prepend: { start: 39, end: 49 }
    },
    { file: 'pagination-tabs.js', start: 1247, end: 1567, title: 'pagination, new tab, type change' },
    { file: 'panels-csv.js', start: 1568, end: 1773, title: 'panels, sheets, CSV' },
    { file: 'table-sorter-home.js', start: 1774, end: 2153, title: 'tablesorter + chrome observers' },
    {
        file: 'panel-kanban-chrome.js',
        start: 2154,
        end: 2236,
        title: 'panel/kanban chrome + initAddKanban',
        prepend: { start: 27, end: 31, exportFn: 'loadKanbanStylePro' }
    },
    // 2237–2244: re-export from kanban-home.js — keep kanban-home as source of truth
    { file: 'marcadores-distrib.js', start: 2246, end: 2625, title: 'marcadores, acompanhamento, distribuição' },
    { file: 'upload-home.js', start: 2627, end: 2840, title: 'upload files in process' },
    { file: 'boot.js', start: 2842, end: 999999, title: 'initSeiPro boot' }
];

const EXISTING_CLUSTER_FILES = ['kanban-home.js', 'atividades-bridge.js'];

const SHARED_IMPORTS = {
    createFileQueue: "import { createFileQueue } from '../../shared/ui/file-queue.js';",
    createSortable: "import { createSortable } from '../../shared/ui/sortable.js';",
    arvoreTemplates: "import { uploadPreviewHomeHtml, dropzoneInfoHoverHtml } from '../arvore/templates.js';",
    resolveDropzoneIcon: "import { resolveDropzoneIcon } from '../arvore/domain.js';",
    templates: "import * as templates from './templates.js';"
};

const SHARED_SYMBOLS = [
    'createFileQueue',
    'createSortable',
    'uploadPreviewHomeHtml',
    'dropzoneInfoHoverHtml',
    'resolveDropzoneIcon',
    'templates'
];

const BRIDGE_EXPORTS = ['atividadesApi', 'callAtividades'];

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
    if (usedShared.has('templates')) blocks.push(SHARED_IMPORTS.templates);
    if (usedShared.has('createFileQueue')) blocks.push(SHARED_IMPORTS.createFileQueue);
    if (usedShared.has('createSortable')) blocks.push(SHARED_IMPORTS.createSortable);
    if (usedShared.has('uploadPreviewHomeHtml') || usedShared.has('dropzoneInfoHoverHtml')) {
        blocks.push(SHARED_IMPORTS.arvoreTemplates);
    }
    if (usedShared.has('resolveDropzoneIcon')) blocks.push(SHARED_IMPORTS.resolveDropzoneIcon);
    return blocks;
}

function sliceLines(lines, start, end) {
    const startIdx = start - 1;
    const endIdx = Math.min(end, lines.length);
    return lines.slice(startIdx, endIdx);
}

function promoteExportFn(chunkLines, fnName) {
    return chunkLines.map((line) => {
        if (new RegExp(`^function\\s+${fnName}\\b`).test(line)) {
            return 'export ' + line;
        }
        return line;
    });
}

if (!existsSync(bodyPath)) {
    console.error('body.js not found — already split?');
    process.exit(1);
}

const body = readFileSync(bodyPath, 'utf8');
const lines = body.split('\n');

// Collect exports from existing clusters (kanban-home, atividades-bridge)
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

    if (cluster.prepend) {
        let prependLines = sliceLines(lines, cluster.prepend.start, cluster.prepend.end);
        if (cluster.prepend.exportFn) {
            prependLines = promoteExportFn(prependLines, cluster.prepend.exportFn);
        }
        chunkLines = [...prependLines, '', ...chunkLines];
    }

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
    clusterSources.push({ ...cluster, chunk, exports });
}

const allExportNames = new Set(exportOwner.keys());
console.log(`Collected ${allExportNames.size} exports across ${CLUSTERS.length} new clusters + existing`);

for (const cluster of clusterSources) {
    const localNames = localDefinitions(cluster.chunk);
    const usedExternals = findUsedExternals(cluster.chunk, allExportNames, localNames);
    for (const e of cluster.exports) usedExternals.delete(e);

    const usedShared = findUsedShared(cluster.chunk);
    const usedBridge = findUsedBridge(cluster.chunk);
    // Bridge symbols are also re-exported from modules.js — import once from bridge.
    for (const name of usedBridge) usedExternals.delete(name);

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

    const header = `/**
 * Lista de processos — ${cluster.title}.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
${importLines.join('\n\n')}
`;

    let bodyChunk = cluster.chunk;
    if (!bodyChunk.endsWith('\n')) bodyChunk += '\n';

    writeFileSync(join(featureDir, cluster.file), header + '\n' + bodyChunk, 'utf8');
    console.log(`wrote ${cluster.file} (${cluster.exports.length} exports, ${usedExternals.size} cross-imports, ${usedBridge.size} bridge, ${usedShared.size} shared)`);
}

const barrel = `/**
 * Lista de processos — barrel de clusters (live bindings para deps cruzadas).
 */
${CLUSTERS.map((c) => `export * from './${c.file}';`).join('\n')}
export * from './kanban-home.js';
export * from './atividades-bridge.js';
`;
writeFileSync(join(featureDir, 'modules.js'), barrel, 'utf8');

console.log('wrote modules.js');
console.log('Done. Next: wire index/legacy-api, update kanban-home imports, delete body.js, update tests.');
