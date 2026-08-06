#!/usr/bin/env node
/**
 * Engineering loop map generator.
 *
 * Generates docs/mapping-funcoes-configuracoes/{opcoes_funcoes.csv,funcoes.csv}
 * and docs/engineering-loop-map.md from the current src/ tree.
 *
 * This is intentionally dependency-free and conservative: it is a static map to
 * guide the AI loop, not a compiler. Dynamic calls/callbacks still require human
 * or agent review.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const docsDir = path.join(root, 'docs');
const mappingDir = path.join(docsDir, 'mapping-funcoes-configuracoes');
const srcDir = path.join(root, 'src');
const optionsHtml = path.join(root, 'src/options/options.html');

function walk(dir, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
    }
    return out.sort();
}

function rel(file) {
    return path.relative(root, file).split(path.sep).join('/');
}

function csvEscape(value) {
    const text = String(value ?? '');
    if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
    return text;
}

function toCsv(rows) {
    return rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n';
}

function lineOf(text, index) {
    return text.slice(0, index).split('\n').length;
}

function classify(fileRel) {
    const parts = fileRel.split('/');
    if (parts[0] !== 'src') return { camada: 'unknown', feature: '' };
    if (parts[1] === 'features') return { camada: 'feature', feature: parts[2] || '' };
    if (parts[1] === 'shared' && parts[2] === 'legacy') return { camada: 'shared-legacy', feature: '' };
    if (parts[1] === 'shared') return { camada: 'shared', feature: parts[2] || '' };
    if (parts[1] === 'bootstrap') return { camada: 'bootstrap', feature: '' };
    if (parts[1] === 'core') return { camada: 'core', feature: '' };
    if (parts[1] === 'platform') return { camada: 'platform', feature: '' };
    if (parts[1] === 'sei') return { camada: 'sei', feature: '' };
    if (parts[1] === 'entries') return { camada: 'entry', feature: path.basename(fileRel, '.js') };
    if (parts[1] === 'background') return { camada: 'background', feature: '' };
    if (parts[1] === 'options') return { camada: 'options', feature: '' };
    return { camada: parts[1] || 'unknown', feature: '' };
}

function modernity(camada, source = '') {
    if (!['core', 'platform', 'sei', 'entry', 'feature', 'shared', 'options'].includes(camada)) {
        return 'legado';
    }
    // Feature slices that still emit MAIN-world inline handlers or jQuery ajax
    // wire are transitional — do not over-count as fully modern.
    if (camada === 'feature' && source) {
        if (
            /\bonclick\s*=|\bonchange\s*=/.test(source)
            || /\$\.ajax\s*\(/.test(source)
            || /\$\s*\(/.test(source)
        ) {
            return 'legado';
        }
    }
    return 'moderno';
}

function extractOptions() {
    const html = existsSync(optionsHtml) ? readFileSync(optionsHtml, 'utf8') : '';
    const matches = [...html.matchAll(/data-name="([a-zA-Z0-9_:-]+)"/g)];
    const seen = new Map();
    for (const m of matches) {
        const key = m[1];
        if (!key || seen.has(key)) continue;
        const start = Math.max(0, m.index - 800);
        const end = Math.min(html.length, m.index + 800);
        const ctx = html.slice(start, end);
        const labelMatch = ctx.match(/<span[^>]*class="slider-label"[^>]*>([\s\S]*?)<\/span>/i)
            || ctx.match(/<label[^>]*>([\s\S]*?)<\/label>/i)
            || ctx.match(/title="([^"]+)"/i);
        const label = labelMatch
            ? labelMatch[1].replace(/<[^>]+>/g, ' ').replace(/&ccedil;/g, 'ç').replace(/&otilde;/g, 'õ').replace(/&atilde;/g, 'ã').replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
            : key;
        seen.set(key, label || key);
    }
    return [...seen.entries()].map(([opcao, label]) => ({ opcao, label })).sort((a, b) => a.opcao.localeCompare(b.opcao));
}

const functionPatterns = [
    /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\s*)?\(?[^;=]*?\)?\s*=>/g,
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\s*\(/g,
    /^\s*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/gm
];

const reservedMethodNames = new Set(['if', 'for', 'while', 'switch', 'catch', 'function']);

function extractFunctions(file, optionKeys) {
    const text = readFileSync(file, 'utf8');
    const fileRel = rel(file);
    const { camada, feature } = classify(fileRel);
    const hits = [];
    for (const pattern of functionPatterns) {
        pattern.lastIndex = 0;
        for (const m of text.matchAll(pattern)) {
            const name = m[1];
            if (!name || reservedMethodNames.has(name)) continue;
            hits.push({ name, index: m.index });
        }
    }
    const dedup = new Map();
    for (const hit of hits) {
        const key = `${hit.name}:${hit.index}`;
        dedup.set(key, hit);
    }
    const ordered = [...dedup.values()].sort((a, b) => a.index - b.index);
    return ordered.map((hit, i) => {
        const next = ordered[i + 1]?.index ?? text.length;
        const body = text.slice(hit.index, next);
        const direct = optionKeys.filter((key) => new RegExp(`['\"]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`).test(body));
        const calls = [...body.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g)]
            .map((m) => m[1])
            .filter((name) => !reservedMethodNames.has(name) && name !== hit.name);
        return {
            id: `${fileRel}:${lineOf(text, hit.index)}:${hit.name}`,
            arquivo: fileRel,
            linha: lineOf(text, hit.index),
            funcao: hit.name,
            camada,
            feature,
            moderno_ou_legado: modernity(camada, text),
            opcoes_diretas: [...new Set(direct)].sort(),
            opcoes_mapeadas: [],
            compartilhada: 'não',
            chamadas_detectadas_qtd: new Set(calls).size,
            chamadas: [...new Set(calls)].sort()
        };
    });
}

function propagate(functions) {
    const byName = new Map();
    for (const fn of functions) {
        if (!byName.has(fn.funcao)) byName.set(fn.funcao, []);
        byName.get(fn.funcao).push(fn);
    }
    for (const fn of functions) {
        const mapped = new Set(fn.opcoes_diretas);
        for (const call of fn.chamadas) {
            for (const callee of byName.get(call) || []) {
                for (const opt of callee.opcoes_diretas) mapped.add(opt);
                for (const call2 of callee.chamadas) {
                    for (const callee2 of byName.get(call2) || []) {
                        for (const opt of callee2.opcoes_diretas) mapped.add(opt);
                    }
                }
            }
        }
        fn.opcoes_mapeadas = [...mapped].sort();
        fn.compartilhada = fn.opcoes_mapeadas.length > 1 ? 'sim' : 'não';
    }
}

function buildOutputs() {
    const options = extractOptions();
    const optionKeys = options.map((o) => o.opcao);
    const jsFiles = walk(srcDir);
    const functions = jsFiles.flatMap((file) => extractFunctions(file, optionKeys));
    propagate(functions);

    const optionsByKey = new Map(options.map((o) => [o.opcao, { ...o, direct: [], indirect: [], all: [] }]));
    for (const fn of functions) {
        for (const opt of fn.opcoes_diretas) optionsByKey.get(opt)?.direct.push(fn);
        for (const opt of fn.opcoes_mapeadas) {
            const bucket = optionsByKey.get(opt);
            if (!bucket) continue;
            bucket.all.push(fn);
            if (!fn.opcoes_diretas.includes(opt)) bucket.indirect.push(fn);
        }
    }

    const funcoesRows = [[
        'id', 'arquivo', 'linha', 'funcao', 'camada', 'feature', 'moderno_ou_legado',
        'opcoes_diretas', 'opcoes_mapeadas', 'compartilhada', 'chamadas_detectadas_qtd'
    ]];
    for (const fn of functions.sort((a, b) => a.arquivo.localeCompare(b.arquivo) || a.linha - b.linha || a.funcao.localeCompare(b.funcao))) {
        funcoesRows.push([
            fn.id,
            fn.arquivo,
            fn.linha,
            fn.funcao,
            fn.camada,
            fn.feature,
            fn.moderno_ou_legado,
            fn.opcoes_diretas.join(';'),
            fn.opcoes_mapeadas.join(';'),
            fn.compartilhada,
            fn.chamadas_detectadas_qtd
        ]);
    }

    const opcoesRows = [[
        'opcao', 'label', 'contextos', 'diretas', 'indiretas', 'total', 'modernas', 'legadas', 'arquivos', 'funcoes'
    ]];
    for (const opt of [...optionsByKey.values()].sort((a, b) => a.opcao.localeCompare(b.opcao))) {
        const all = [...new Map(opt.all.map((fn) => [fn.id, fn])).values()].sort((a, b) => a.arquivo.localeCompare(b.arquivo) || a.linha - b.linha);
        const directIds = new Set(opt.direct.map((fn) => fn.id));
        const indirect = all.filter((fn) => !directIds.has(fn.id));
        const modern = all.filter((fn) => fn.moderno_ou_legado === 'moderno').length;
        const legacy = all.filter((fn) => fn.moderno_ou_legado === 'legado').length;
        const contexts = [...new Set(all.map((fn) => fn.camada).filter(Boolean))].sort().join(';');
        const arquivos = [...new Set(all.map((fn) => fn.arquivo))].sort().join(';');
        const funcoes = all.map((fn) => `${fn.arquivo}:${fn.linha}:${fn.funcao}`).join(';');
        opcoesRows.push([opt.opcao, opt.label, contexts, opt.direct.length, indirect.length, all.length, modern, legacy, arquivos, funcoes]);
    }

    const shared = functions.filter((fn) => fn.opcoes_mapeadas.length > 1)
        .sort((a, b) => b.opcoes_mapeadas.length - a.opcoes_mapeadas.length || a.funcao.localeCompare(b.funcao))
        .slice(0, 30);
    const byLayer = new Map();
    for (const fn of functions) byLayer.set(fn.camada, (byLayer.get(fn.camada) || 0) + 1);
    const byLayerRows = [...byLayer.entries()].sort((a, b) => b[1] - a[1]);
    const md = `# Mapa opção ↔ função — Engineering Loop\n\n` +
        `> Gerado por \`node scripts/engineering-loop-map.mjs\`. A saída é determinística para permitir \`--check\`.\n\n` +
        `## Metodologia\n\n` +
        `- Analisa \`src/**/*.js\` e ignora \`dist/\`, \`node_modules\` e artefatos gerados.\n` +
        `- Extrai funções por padrões estáticos de declaração/atribuição comuns.\n` +
        `- Lê opções/configurações de \`src/options/options.html\` via \`data-name\`.\n` +
        `- Associa uma opção diretamente quando a função contém a chave como string literal.\n` +
        `- Propaga associações por chamadas detectadas até profundidade 2.\n` +
        `- Classifica os arquivos por camada: \`core\`, \`platform\`, \`sei\`, \`feature\`, \`entry\`, \`shared-legacy\`, \`bootstrap\`, etc.\n\n` +
        `Limitação: análise estática aproximada; callbacks, chamadas dinâmicas e strings montadas em runtime exigem revisão manual. O mapa orienta a escolha de fatias, mas não substitui leitura de código.\n\n` +
        `## Resumo\n\n` +
        `- Arquivos JS analisados: **${jsFiles.length}**.\n` +
        `- Funções extraídas: **${functions.length}**.\n` +
        `- Opções/configurações encontradas: **${options.length}**.\n` +
        `- Funções compartilhadas por mais de uma opção: **${functions.filter((fn) => fn.opcoes_mapeadas.length > 1).length}**.\n` +
        `- Funções sem vínculo estático com opções: **${functions.filter((fn) => fn.opcoes_mapeadas.length === 0).length}**.\n\n` +
        `## Funções por camada\n\n` +
        `| Camada | Funções |\n|---|---:|\n` +
        byLayerRows.map(([layer, count]) => `| \`${layer}\` | ${count} |`).join('\n') +
        `\n\n## Funções compartilhadas mais relevantes\n\n` +
        `| Função | Arquivo:linha | Camada | Qtde opções | Opções |\n|---|---|---|---:|---|\n` +
        shared.map((fn) => `| \`${fn.funcao}\` | \`${fn.arquivo}:${fn.linha}\` | \`${fn.camada}\` | ${fn.opcoes_mapeadas.length} | ${fn.opcoes_mapeadas.slice(0, 12).map((o) => `\`${o}\``).join(', ')}${fn.opcoes_mapeadas.length > 12 ? ' ...' : ''} |`).join('\n') +
        `\n\n## Artefatos gerados\n\n` +
        `- \`docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv\`\n` +
        `- \`docs/mapping-funcoes-configuracoes/funcoes.csv\`\n\n` +
        `## Como o loop deve usar este mapa\n\n` +
        `1. Use o mapa para identificar opções/camadas com maior acoplamento.\n` +
        `2. Confirme a fatia no código e no \`DEVELOPMENT.md\` antes de editar.\n` +
        `3. Prefira fatias pequenas: uma função pura, um adapter, um alias global, um entry ou um ponto de bootstrap por vez.\n` +
        `4. Não migre cegamente por contagem de funções; priorize as dívidas explícitas do \`DEVELOPMENT.md\`, especialmente dependências de feature dentro de \`core/stack.js\`.\n`;

    return {
        [path.join(mappingDir, 'funcoes.csv')]: toCsv(funcoesRows),
        [path.join(mappingDir, 'opcoes_funcoes.csv')]: toCsv(opcoesRows),
        [path.join(docsDir, 'engineering-loop-map.md')]: md
    };
}

function main() {
    const outputs = buildOutputs();
    if (!existsSync(mappingDir)) mkdirSync(mappingDir, { recursive: true });
    const changed = [];
    for (const [file, content] of Object.entries(outputs)) {
        const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
        if (current !== content) changed.push(file);
        if (!check) writeFileSync(file, content);
    }
    if (check && changed.length) {
        console.error('engineering-loop-map: generated outputs are stale:');
        for (const file of changed) console.error(' - ' + rel(file));
        process.exit(1);
    }
    if (check) console.log('engineering-loop-map: generated outputs are up to date');
    else console.log('engineering-loop-map: generated ' + Object.keys(outputs).map((f) => rel(f)).join(', '));
}

main();
