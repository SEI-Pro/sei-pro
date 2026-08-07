/**
 * Gera THIRD_PARTY_NOTICES.md a partir de vendor/<lib>/VERSION.txt.
 *
 * O README linka esse arquivo e ele não existia. Gerar em vez de manter à mão evita
 * a divergência clássica entre libs realmente embarcadas e libs documentadas.
 *
 *   node scripts/write-third-party-notices.mjs            # escreve
 *   node scripts/write-third-party-notices.mjs --check    # falha se estiver desatualizado
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FILE_PAIRS, ASSET_DIRS } from './asset-manifest.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'THIRD_PARTY_NOTICES.md');
const check = process.argv.includes('--check');

/** Arquivos que cada lib entrega na extensão, conforme o asset-manifest. */
function shippedBy(dir) {
    const prefix = `vendor/${dir}/`;
    const files = ALL_FILE_PAIRS
        .filter(({ src }) => src.startsWith(prefix))
        .map(({ out }) => out.replace(/^dist\//, ''));
    for (const { src, out } of ASSET_DIRS) {
        if (src.startsWith(prefix)) files.push(out.replace(/^dist\//, '') + '/');
    }
    return files;
}

const libs = readdirSync(path.join(root, 'vendor'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .map((dir) => {
        const versionFile = path.join(root, 'vendor', dir, 'VERSION.txt');
        if (!existsSync(versionFile)) return { dir, missing: true };
        const lines = readFileSync(versionFile, 'utf8').split('\n');
        const title = (lines[0] || dir).trim();
        const licenseLine = lines.find((l) => l.startsWith('Licença:')) || '';
        const license = licenseLine.replace('Licença:', '').trim() || 'não informada';
        const patched = /PATCHED LOCALMENTE/i.test(lines.join('\n'));
        const subset = /SUBSET/i.test(lines.join('\n'));
        return { dir, title, license, patched, subset, shipped: shippedBy(dir) };
    });

const missing = libs.filter((l) => l.missing);

const body = [
    '# Third-Party Notices',
    '',
    '**Arquivo gerado.** Não editar à mão — rode `node scripts/write-third-party-notices.mjs`.',
    'A fonte é `vendor/<lib>/VERSION.txt`; o que cada lib entrega vem de',
    '`scripts/asset-manifest.mjs`.',
    '',
    'O SEI Pro PRF é distribuído sob [AGPL-3.0](./LICENSE.txt) e embarca as bibliotecas',
    'de terceiros abaixo, em `vendor/`, copiadas para `dist/` no build.',
    '',
    `Total: **${libs.length - missing.length}** bibliotecas.`,
    '',
    '> Versão ou licença marcada como `desconhecida` significa que o arquivo foi resgatado de',
    '> `dist/` sem registro de origem (ver [ADR-0011](./docs/adr/0011-dist-fora-do-versionamento.md)).',
    '> Confirme antes de atualizar a biblioteca — não presuma.',
    '',
    '| Biblioteca | Licença | Observações | Entregue como |',
    '|---|---|---|---|',
    ...libs
        .filter((l) => !l.missing)
        .map((l) => {
            const notes = [
                l.patched ? '**patch local** — reaplicar ao atualizar' : '',
                l.subset ? 'subset (só o que é usado)' : ''
            ].filter(Boolean).join('; ') || '—';
            const shipped = l.shipped.length
                ? l.shipped.map((f) => '`' + f + '`').join('<br>')
                : '—';
            return `| ${l.title} | ${l.license} | ${notes} | ${shipped} |`;
        }),
    '',
    '## Fontes de dados públicos',
    '',
    'A extensão consulta serviços do SEI da instituição e, quando o usuário configura',
    'perfis BYOK, provedores de IA de terceiros (OpenAI, Anthropic, Google, Moonshot,',
    'Ollama ou endpoint compatível). Chaves são armazenadas localmente e não são',
    'sincronizadas. Ver [Política de Privacidade](./PRIVACY_POLICY.md).',
    ''
].join('\n');

if (missing.length) {
    console.warn('vendor/ sem VERSION.txt: ' + missing.map((l) => l.dir).join(', '));
}

if (check) {
    const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
    if (current !== body) {
        console.error('THIRD_PARTY_NOTICES.md desatualizado — rode o script sem --check.');
        process.exit(1);
    }
    console.log('THIRD_PARTY_NOTICES.md atualizado.');
} else {
    writeFileSync(outFile, body, 'utf8');
    console.log(`THIRD_PARTY_NOTICES.md gerado — ${libs.length - missing.length} bibliotecas.`);
}
