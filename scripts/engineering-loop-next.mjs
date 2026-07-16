#!/usr/bin/env node
/**
 * Suggest the next engineering-loop slice from the board + epic queue.
 *
 * Usage:
 *   node scripts/engineering-loop-next.mjs
 *   node scripts/engineering-loop-next.mjs --check-board
 *
 * --check-board exits non-zero if the board violates active-program rules
 * (e.g. CSS micro-hook pending while epic P1–P5 work is open — warning only
 * for legacy A1 rows already in flight).
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const boardPath = path.join(root, 'docs/engineering-loop-board.md');
const checkBoard = process.argv.includes('--check-board');

const EPIC_ORDER = [
    'E-controlar-prazos-close',
    'E-docs-lote-close',
    'E-nao-lido-close',
    'E-anotacao-controle-close',
    'E-lista-favoritos',
    'E-lista-agrupamento',
    'E-arvore-dropzone',
    'E-arvore-menus',
    'E-editor-toolbar',
    'E-functions-datas',
    'E-entry-lista'
];

const STEP_ORDER = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

function readBoard() {
    if (!existsSync(boardPath)) {
        console.error('Board not found:', boardPath);
        process.exit(1);
    }
    return readFileSync(boardPath, 'utf8');
}

/** Parse markdown tables that look like board rows (pipe-separated). */
function parseTables(md) {
    const rows = [];
    for (const line of md.split('\n')) {
        if (!line.startsWith('|')) continue;
        if (/^\|\s*-/.test(line)) continue;
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (cells.length < 6) continue;
        if (cells[0] === 'ID' || cells[0] === 'Ordem' || cells[0] === 'Épico') continue;
        rows.push(cells);
    }
    return rows;
}

function isCssMicroSlice(fatia, feature) {
    const text = `${fatia} ${feature}`.toLowerCase();
    return (
        text.includes('css prefixado') ||
        text.includes('adicionar hook prefixado') ||
        text.includes('hook prefixado') ||
        (text.includes('seipro-') && text.includes('hook') && !text.includes('lote'))
    );
}

function main() {
    const md = readBoard();
    const rows = parseTables(md);

    // Epic queue table: | Épico | Prioridade | Contexto | Passo atual | Estado | Próxima fatia | ...
    // Board table: | ID | Prioridade | Tipo | Contexto | Feature | Fatia | Estado | ...

    const epicQueue = [];
    const boardItems = [];

    for (const cells of rows) {
        // Heuristic: epic queue rows start with E-
        if (/^E-/.test(cells[0]) && cells.length >= 5 && !/^E2-/.test(cells[0]) && !/^A1-/.test(cells[0]) && !/^L0-/.test(cells[0])) {
            // Could be epic id in first column of epic queue
            epicQueue.push({
                epic: cells[0],
                priority: cells[1],
                context: cells[2],
                step: cells[3],
                state: cells[4],
                nextSlice: cells[5] || '',
                raw: cells
            });
            continue;
        }
        if (/^(A1-|E2-|L0-)/.test(cells[0]) && cells.length >= 7) {
            boardItems.push({
                id: cells[0],
                priority: Number(cells[1]) || 0,
                type: cells[2],
                context: cells[3],
                feature: cells[4],
                fatia: cells[5],
                state: cells[6],
                raw: cells
            });
        }
    }

    const failed = boardItems
        .filter((r) => r.state === 'review_failed_needs_fix')
        .sort((a, b) => a.priority - b.priority);

    const pendingReview = boardItems.filter((r) => r.state === 'migrated_pending_review');

    const pendingMigration = boardItems
        .filter((r) => r.state === 'pending_migration')
        .sort((a, b) => a.priority - b.priority);

    const openEpicSteps = epicQueue.filter((e) =>
        ['pending_migration', 'migration_in_progress', 'migrated_pending_review', 'review_failed_needs_fix'].includes(e.state)
        || (e.state === 'active' || e.state === 'in_progress')
    );

    const hasOpenP1toP5 = epicQueue.some((e) => {
        const step = (e.step || '').toUpperCase();
        const open = !['review_passed', 'done', 'completed', 'blocked'].includes((e.state || '').toLowerCase());
        return open && /^P[1-5]$/.test(step);
    });

    // Also treat epics that are pending and step <= P5 as open decomposition work
    const decompositionOpen = epicQueue.some((e) => {
        const step = (e.step || '').toUpperCase();
        const st = (e.state || '').toLowerCase();
        if (['review_passed', 'done', 'completed'].includes(st)) return false;
        if (st === 'blocked') return false;
        const idx = STEP_ORDER.indexOf(step);
        return idx >= 1 && idx <= 5; // P1–P5
    }) || pendingMigration.some((r) => /P[1-5]/i.test(r.fatia) || /P[1-5]/i.test(r.feature));

    let suggestion = null;
    let reason = '';

    if (failed.length) {
        suggestion = failed[0];
        reason = 'Fix oldest review_failed_needs_fix';
    } else if (pendingMigration.length) {
        // Prefer non-CSS pending_migration
        const nonCss = pendingMigration.filter((r) => !isCssMicroSlice(r.fatia, r.feature));
        suggestion = nonCss[0] || pendingMigration[0];
        reason = nonCss.length
            ? 'Highest-priority pending_migration (Epic queue / seeded slice)'
            : 'Pending migration exists but only CSS-like — check ban policy';
    } else {
        // Walk epic order from epic queue section.
        // review_passed only completes an epic at P7; earlier steps mean "continue ladder".
        for (const epicId of EPIC_ORDER) {
            const eq = epicQueue.find((e) => e.epic === epicId);
            if (!eq) continue;
            const st = (eq.state || '').toLowerCase();
            const step = (eq.step || '').toUpperCase();
            if (['done', 'completed'].includes(st)) continue;
            if (st === 'blocked') continue;
            if (st === 'review_passed' && step === 'P7') continue;
            suggestion = {
                id: `(next for ${epicId})`,
                epic: epicId,
                step: eq.step,
                state: eq.state,
                fatia: eq.nextSlice || `Advance ${epicId} to next step after ${eq.step}`,
                feature: epicId,
                type: 'epic'
            };
            reason = st === 'review_passed'
                ? `Continue epic ${epicId}: ${step} done — seed/implement next ladder step`
                : `Continue active epic ${epicId} at ${eq.step}`;
            break;
        }
    }

    const cssPending = pendingReview.filter((r) => isCssMicroSlice(r.fatia, r.feature));
    const warnings = [];

    if (decompositionOpen && cssPending.length) {
        warnings.push(
            `WARN: ${cssPending.length} CSS micro-slice(s) still pending review while epic P1–P5 work is programmed. Finish/reject them, then follow Epic queue — do not start new CSS micro-hooks.`
        );
    }

    if (!suggestion) {
        warnings.push('No automatic slice found. Mark blocked or seed a pending_migration in the Epic queue.');
    }

    // Output
    console.log('# engineering-loop-next\n');
    console.log('## Suggestion');
    if (suggestion) {
        console.log(`- reason: ${reason}`);
        console.log(`- id: ${suggestion.id}`);
        if (suggestion.epic) console.log(`- epic: ${suggestion.epic}`);
        if (suggestion.step) console.log(`- step: ${suggestion.step}`);
        console.log(`- state: ${suggestion.state || 'n/a'}`);
        console.log(`- slice: ${suggestion.fatia}`);
        if (suggestion.feature) console.log(`- feature: ${suggestion.feature}`);
    } else {
        console.log('- (none)');
    }

    console.log('\n## Queue snapshot');
    console.log(`- review_failed_needs_fix: ${failed.length}`);
    console.log(`- migrated_pending_review: ${pendingReview.length}`);
    console.log(`- pending_migration: ${pendingMigration.length}`);
    console.log(`- epic queue rows parsed: ${epicQueue.length}`);
    console.log(`- decomposition (P1–P5) open: ${decompositionOpen || hasOpenP1toP5 ? 'yes' : 'no'}`);

    if (warnings.length) {
        console.log('\n## Warnings');
        for (const w of warnings) console.log(`- ${w}`);
    }

    console.log('\n## Policy reminder');
    console.log('- Ban: CSS micro-hooks while epic P1–P5 work remains.');
    console.log('- Prefer medium slices with new Vitest coverage (P1+).');
    console.log('- See docs/engineering-loop.md');

    if (checkBoard) {
        // Soft check: fail only on hard inconsistencies
        const activeCssNew = pendingMigration.filter((r) => isCssMicroSlice(r.fatia, r.feature));
        if ((decompositionOpen || hasOpenP1toP5) && activeCssNew.length) {
            console.error('\nCHECK FAILED: pending_migration CSS micro-slices while epic decomposition is open.');
            process.exit(2);
        }
        // Warn-only for CSS still in migrated_pending_review (legacy A1 drain)
        process.exit(0);
    }
}

main();
