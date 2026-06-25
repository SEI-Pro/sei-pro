/**
 * Utilitário de desmantelamento: remove funções nomeadas top-level de um arquivo
 * legado, por BALANCEAMENTO DE CHAVES (não regex de "}" col0 — ver memória
 * feedback_carving_brace_balance). Substitui cada função por um comentário de
 * migração e valida a sintaxe ao final.
 *
 * Uso:
 *   node scripts/_carve.mjs dist/js/sei-functions-pro.js core/helpers.js nomeA nomeB ...
 * (2º arg = módulo destino, só para o texto do comentário)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const [file, dest, ...names] = process.argv.slice(2);
if (!file || !dest || names.length === 0) {
    console.error('uso: node scripts/_carve.mjs <arquivo> <modulo-dest> <fn1> [fn2...]');
    process.exit(1);
}

let src = readFileSync(file, 'utf8');

function removeFunction(code, name) {
    const sigRe = new RegExp('(^|\\n)function ' + name + '\\s*\\(', 'g');
    const m = sigRe.exec(code);
    if (!m) return { code, ok: false };
    const start = m.index + (m[1] ? 1 : 0); // início de "function"
    const braceOpen = code.indexOf('{', sigRe.lastIndex - 1);
    if (braceOpen === -1) return { code, ok: false };
    let depth = 0, i = braceOpen;
    for (; i < code.length; i++) {
        const ch = code[i];
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    // consome um ';' e a quebra de linha imediatos, se houver
    if (code[i] === ';') i++;
    if (code[i] === '\n') i++;
    const replacement = '// [migrado para ' + dest + '] ' + name + '\n';
    return { code: code.slice(0, start) + replacement + code.slice(i), ok: true };
}

const failed = [];
for (const name of names) {
    const r = removeFunction(src, name);
    if (!r.ok) { failed.push(name); continue; }
    src = r.code;
}
writeFileSync(file, src);

if (failed.length) { console.error('NÃO REMOVIDAS:', failed.join(', ')); process.exit(2); }

execSync('node --check ' + file, { stdio: 'inherit' });
console.log('carve OK:', names.join(', '));
