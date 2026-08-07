/**
 * Gera vendor/<lib>/VERSION.txt para as libs resgatadas de dist/ (ADR-0011).
 *
 * Versão marcada como `desconhecida` é honesta: o arquivo veio de dist/ commitado,
 * sem registro de origem. Confirme antes de atualizar a lib — não adivinhe.
 *
 * Execução única. Rodar de novo não sobrescreve VERSION.txt existente.
 */
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const UNKNOWN = 'desconhecida';

/** version verificada lendo o cabeçalho/conteúdo do próprio arquivo. */
const LIBS = [
    ['jquery', 'jQuery', '3.7.1', 'MIT', 'Carregado em quase todo bloco do manifest. Saída em curso (ADR-0003); ver src/features/editor/lib/domq.js.'],
    ['jquery-ui', 'jQuery UI', '1.14.1', 'MIT', 'CSS + images/ (ui-icons_*) são referenciados relativamente pelo CSS. Substituição gradual por src/shared/ui/.'],
    ['moment', 'Moment.js', '2.30.1', 'MIT', 'Inclui moment-duration-format e moment-weekday-calc. Datas novas usam src/core/datas.js.'],
    ['chart', 'Chart.js', '4.4.7', 'MIT', 'Gráficos de atividades e relatórios.'],
    ['chosen', 'Chosen', '1.8.2', 'MIT', 'Selects com busca. Substituível por src/shared/ui/.'],
    ['jszip', 'JSZip', '3.10.1', 'MIT / GPLv3', 'Inclui jszip-utils. Exportação de documentos em lote.'],
    ['papaparse', 'Papa Parse', '5.5.2', 'MIT', 'Parsing de CSV (importação de projetos, planilhas).'],
    ['dompurify', 'DOMPurify', '3.2.5', 'Apache-2.0 / MPL-2.0', 'Sanitização obrigatória de todo HTML de origem externa.'],
    ['jquery-tablesorter', 'TableSorter (fork de Rob Garrison)', '2.31.3', 'MIT', 'Fork, não o tablesorter original.'],
    ['ckeditor', 'CKEditor 4', UNKNOWN, 'GPL / LGPL / MPL (verificar)', 'Roda no mundo MAIN — pertence à página do SEI. Inclui plugin tableselection.\ntableselection.plugin.css → dist/js/lib/ckeditor/tableselection.css\ntableselection.content.css → dist/css/tableselection.css (conteúdo difere)'],
    ['modallink', 'modalLink', '1.1.0', UNKNOWN, 'PATCHED LOCALMENTE: namespace isolado para não colidir com o dialog do jQuery UI.\nNÃO substituir por upstream sem reaplicar o patch.'],
    ['jkanban', 'jKanban', UNKNOWN, 'MIT', 'Board Kanban. Depende de dragula.'],
    ['jmespath', 'JMESPath', UNKNOWN, 'Apache-2.0', 'Consultas na configuração JSON.'],
    ['crypto-js', 'CryptoJS', UNKNOWN, 'MIT', 'Hash/criptografia em fluxos legados.'],
    ['diff2html', 'diff2html', UNKNOWN, 'MIT', 'Comparação de documentos.'],
    ['jschardet', 'jschardet', UNKNOWN, 'LGPL', 'Detecção de encoding em upload de arquivos.'],
    ['favico', 'Favico.js', '0.3.10', 'MIT', 'Contador no favicon.'],
    ['jquery-maskedinput', 'jQuery Masked Input', UNKNOWN, 'MIT', 'Máscaras de formulário.'],
    ['jquery-table-edit', 'jQuery Table Edit', UNKNOWN, UNKNOWN, 'Edição inline de tabelas.'],
    ['jquery-tagsinput', 'jQuery Tags Input (revisited)', UNKNOWN, 'MIT', 'Substituível por src/shared/ui/tags-input.js.'],
    ['jquery-toolbar', 'jQuery Toolbar', UNKNOWN, 'MIT', 'Toolbars flutuantes.'],
    ['jquery-visible', 'jQuery Visible', UNKNOWN, 'MIT', 'Detecção de visibilidade em viewport.'],
    ['fontawesome', 'Font Awesome Pro (subset)', UNKNOWN, 'Font Awesome Pro (licença comercial)', 'SUBSET: apenas as famílias e glifos usados pela extensão.\nwebfonts/ → dist/webfonts/pro/. Não substituir pelo pacote completo.'],
    // Já viviam em vendor/, mas sem VERSION.txt.
    ['mammoth', 'Mammoth.js (browser)', UNKNOWN, 'BSD-2-Clause', 'Conversão de .docx para HTML no upload de documentos.'],
    ['qrcode', 'qrcode.js', UNKNOWN, 'MIT', 'Geração de QR Code. Substituiu o antigo jquery.qrcode.']
];

let written = 0;
let kept = 0;

for (const [dir, name, version, license, notes] of LIBS) {
    const file = path.join(root, 'vendor', dir, 'VERSION.txt');
    if (!existsSync(path.dirname(file))) {
        console.warn(`aviso: vendor/${dir}/ não existe — pulando`);
        continue;
    }
    if (existsSync(file)) { kept++; continue; }

    const unknownNote = (version === UNKNOWN || license === UNKNOWN)
        ? '\nATENÇÃO: campo marcado como "desconhecida" não foi determinável a partir do\nconteúdo do arquivo. Confirme na origem antes de atualizar esta lib — não presuma.\n'
        : '';

    writeFileSync(file, [
        `${name} ${version}`,
        `Licença: ${license}`,
        '',
        'Resgatado de dist/js/lib em 2026-08-07 (ADR-0011): o arquivo existia apenas em',
        'dist/ commitado, sem fonte no repositório. Mapeamento fonte → dist em',
        'scripts/asset-manifest.mjs.',
        unknownNote,
        notes,
        ''
    ].join('\n'), 'utf8');
    written++;
}

console.log(`VERSION.txt criados: ${written} | preservados: ${kept}`);
