/**
 * Measure architecture debt metrics for ADR-0008 ratchets.
 * Walks src/ for .js and .ts files, plus manifest.base.json.
 *
 * Usage:
 *   node scripts/measure-ratchets.mjs            # print JSON
 *   node scripts/measure-ratchets.mjs --write     # write tests/structure/ratchets.baseline.json
 *
 * Importable: import { measureRatchets } from '../scripts/measure-ratchets.mjs'
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SRC_EXT = /\.(js|ts)$/;
const SEI_SELECTOR_RE =
    /#(divInfra|tblProcessos|frmEditor|ifrVisualizacao|divArvore|divRecebidos|divComandos|infraMenu)|ancoraArvore|infraTable|barraBotoesSEI|infra-editor/;

function walkSourceFiles(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            walkSourceFiles(full, out);
        } else if (SRC_EXT.test(ent.name)) {
            out.push(full);
        }
    }
    return out;
}

function countMatches(text, re) {
    const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`;
    const global = new RegExp(re.source, flags);
    return [...text.matchAll(global)].length;
}

function lineCount(text) {
    if (text.length === 0) return 0;
    const n = text.split(/\r?\n/).length;
    // trailing newline does not add an extra empty "logical" line for our purpose
    return text.endsWith('\n') ? n - 1 || 1 : n;
}

function hasFeatureContract(source) {
    return (
        /\bid\s*:/.test(source) &&
        /\bapi\s*:/.test(source) &&
        (/\binstall\s*:/.test(source) || /\binstall\s*\(/.test(source))
    );
}

function featureDirs() {
    const featuresRoot = path.join(root, 'src/features');
    return fs
        .readdirSync(featuresRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort();
}

function largestContentScriptBlock() {
    const manifestPath = path.join(root, 'manifest.base.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const blocks = manifest.content_scripts || [];
    let max = 0;
    for (const block of blocks) {
        const len = Array.isArray(block.js) ? block.js.length : 0;
        if (len > max) max = len;
    }
    return max;
}

export function measureRatchets() {
    const files = walkSourceFiles(path.join(root, 'src'));
    const rel = (abs) => path.relative(root, abs).split(path.sep).join('/');

    let filesWithGetSeiPro = 0;
    let seiProDotRefs = 0;
    let filesWithJquery = 0;
    let jqueryUsages = 0;
    let filesWithConsole = 0;
    let consoleUsages = 0;
    let filesOver500 = 0;
    let aliasGlobal = 0;
    let filesWithControladorOutside = 0;
    let filesWithVersionBranch = 0;
    let filesWithSeiSelectorsOutside = 0;
    let innerHTMLWrites = 0;
    let insertAdjacentHTML = 0;
    let jqueryHtml = 0;
    let tsNocheck = 0;

    const getSeiProRe = /getSeiPro\s*\(/;
    const seiProDotRe = /SeiPro\./;
    const jqueryRe = /\$\(/;
    const consoleRe = /\bconsole\.(log|warn|error|info|debug)\b/;
    const aliasGlobalRe = /aliasGlobal\s*\(/;
    const controladorRe = /controlador\.php/;
    const versionBranchRe = /\bisNewSEI\b|\bisSEI_5\b/;
    const innerHTMLRe = /\.innerHTML\s*=/;
    const insertAdjacentHTMLRe = /\.insertAdjacentHTML\s*\(/;
    const jqueryHtmlRe = /\.html\s*\(/;
    const tsNocheckRe = /@ts-nocheck/;

    for (const file of files) {
        const text = fs.readFileSync(file, 'utf8');
        const r = rel(file);
        const underSei = r.startsWith('src/sei/');

        const getSeiProCount = countMatches(text, getSeiProRe);
        if (getSeiProCount > 0) filesWithGetSeiPro += 1;

        seiProDotRefs += countMatches(text, seiProDotRe);

        const jqCount = countMatches(text, jqueryRe);
        if (jqCount > 0) {
            filesWithJquery += 1;
            jqueryUsages += jqCount;
        }

        const consoleCount = countMatches(text, consoleRe);
        if (consoleCount > 0) {
            filesWithConsole += 1;
            consoleUsages += consoleCount;
        }

        if (lineCount(text) > 500) filesOver500 += 1;

        aliasGlobal += countMatches(text, aliasGlobalRe);

        if (!underSei && controladorRe.test(text)) {
            filesWithControladorOutside += 1;
        }

        if (versionBranchRe.test(text)) {
            filesWithVersionBranch += 1;
        }

        if (!underSei && SEI_SELECTOR_RE.test(text)) {
            filesWithSeiSelectorsOutside += 1;
        }

        innerHTMLWrites += countMatches(text, innerHTMLRe);
        insertAdjacentHTML += countMatches(text, insertAdjacentHTMLRe);
        jqueryHtml += countMatches(text, jqueryHtmlRe);
        tsNocheck += countMatches(text, tsNocheckRe);
    }

    // ADR-0004: contract lives in feature.ts (not index.ts).
    let featuresOutsideContract = 0;
    for (const name of featureDirs()) {
        const featurePath = path.join(root, 'src/features', name, 'feature.ts');
        if (!fs.existsSync(featurePath)) {
            featuresOutsideContract += 1;
            continue;
        }
        const src = fs.readFileSync(featurePath, 'utf8');
        if (!hasFeatureContract(src)) featuresOutsideContract += 1;
    }

    const seiProCssPath = path.join(root, 'src/css/sei-pro.css');
    const seiProCssLines = fs.existsSync(seiProCssPath)
        ? lineCount(fs.readFileSync(seiProCssPath, 'utf8'))
        : 0;

    return {
        filesWithGetSeiPro,
        seiProDotRefs,
        filesWithJquery,
        jqueryUsages,
        filesWithConsole,
        consoleUsages,
        filesOver500,
        aliasGlobal,
        filesWithControladorOutside,
        filesWithVersionBranch,
        filesWithSeiSelectorsOutside,
        featuresOutsideContract,
        largestContentScriptBlock: largestContentScriptBlock(),
        innerHTMLWrites,
        insertAdjacentHTML,
        jqueryHtml,
        tsNocheck,
        // Phase 5.6 — carve feature CSS out of the monolithic sheet until this hits 0.
        seiProCssLines
    };
}

function main() {
    const metrics = measureRatchets();
    const json = `${JSON.stringify(metrics, null, 2)}\n`;
    if (process.argv.includes('--write')) {
        const out = path.join(root, 'tests/structure/ratchets.baseline.json');
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, json, 'utf8');
        console.log(`Wrote ${path.relative(root, out)}`);
    }
    process.stdout.write(json);
}

const isMain =
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
    main();
}
