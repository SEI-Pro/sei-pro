#!/usr/bin/env node
/**
 * One-shot codemod: replace common inline onclick/onchange in atividades/*
 * with data-act="atividades-call" (+ data-fn / data-scope / data-arg / data-id).
 *
 * Re-run is mostly idempotent for already-migrated attrs.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/features/atividades/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));

let total = 0;

function transform(src) {
    let out = src;
    let n = 0;

    const bump = (before, after) => {
        if (before !== after) {
            // count approximate replacements via length delta of matches
            const b = (before.match(/on(?:click|change)="/g) || []).length;
            const a = (after.match(/on(?:click|change)="/g) || []).length;
            n += Math.max(0, b - a);
        }
        return after;
    };

    // parent.fn(this, 'lit')
    out = bump(out, out.replace(
        /\bon(click|change)="parent\.([A-Za-z_$][\w$]*)\(this,\s*'([^']*)'\)"/g,
        'data-act="atividades-call" data-fn="$2" data-scope="parent" data-arg="$3"'
    ));
    out = bump(out, out.replace(
        /\bon(click|change)="parent\.([A-Za-z_$][\w$]*)\(this,\s*\\'([^']*)\\'\)"/g,
        'data-act="atividades-call" data-fn="$2" data-scope="parent" data-arg="$3"'
    ));

    // parent.fn(this)
    out = bump(out, out.replace(
        /\bon(click|change)="parent\.([A-Za-z_$][\w$]*)\(this\)"/g,
        'data-act="atividades-call" data-fn="$2" data-scope="parent"'
    ));

    // parent.fn(' + expr + ')  or parent.fn(' + expr + ', 'action')
    out = bump(out, out.replace(
        /\bonclick="parent\.([A-Za-z_$][\w$]*)\(' \+ ([^']+?) \+ '(?:,\s*'([^']*)')?\)"/g,
        (_, fn, expr, arg) => arg
            ? `data-act="atividades-call" data-fn="${fn}" data-scope="parent" data-pass-el="0" data-id="' + ${expr} + '" data-arg="${arg}"`
            : `data-act="atividades-call" data-fn="${fn}" data-scope="parent" data-pass-el="0" data-id="' + ${expr} + '"`
    ));

    // fn(this, 'lit') / fn(this,'lit')
    out = bump(out, out.replace(
        /\bon(click|change)="([A-Za-z_$][\w$]*)\(this,\s*'([^']*)'\)"/g,
        'data-act="atividades-call" data-fn="$2" data-arg="$3"'
    ));
    out = bump(out, out.replace(
        /\bon(click|change)="([A-Za-z_$][\w$]*)\(this,\s*\\'([^']*)\\'\)"/g,
        'data-act="atividades-call" data-fn="$2" data-arg="$3"'
    ));

    // fn(this); optional trailing semicolon
    out = bump(out, out.replace(
        /\bon(click|change)="([A-Za-z_$][\w$]*)\(this\);?"/g,
        'data-act="atividades-call" data-fn="$2"'
    ));

    // fn() no args
    out = bump(out, out.replace(
        /\bonclick="([A-Za-z_$][\w$]*)\(\)"/g,
        'data-act="atividades-call" data-fn="$1" data-pass-el="0"'
    ));

    // fn(' + expr + ')  — id only
    out = bump(out, out.replace(
        /\bonclick="([A-Za-z_$][\w$]*)\(' \+ ([^']+?) \+ '\)"/g,
        'data-act="atividades-call" data-fn="$1" data-pass-el="0" data-id="\' + $2 + \'"'
    ));

    // fn(this, ' + expr + ')
    out = bump(out, out.replace(
        /\bonclick="([A-Za-z_$][\w$]*)\(this,\s*' \+ ([^']+?) \+ '\)"/g,
        'data-act="atividades-call" data-fn="$1" data-id="\' + $2 + \'"'
    ));

    // showFollowEtiqueta(this, 'show', 'ativ'|'tipo_ativ')
    out = bump(out, out.replace(
        /\bonclick="showFollowEtiqueta\(this,\s*\\?'show\\?',\s*\\?'([^']+)\\?'\)"/g,
        'data-act="atividades-call" data-fn="showFollowEtiqueta" data-arg="show" data-arg2="$1"'
    ));

    // ganttX.hide_popup()
    out = bump(out, out.replace(
        /\bonclick="gantt(Afastamentos|Atividades|Recorrencias)\.hide_popup\(\)"/g,
        'data-act="atividades-gantt-hide-popup" data-gantt="gantt$1"'
    ));

    // jquery dismiss / tablesorter cancel
    out = bump(out, out.replace(
        /\bonclick="\$\(this\)\.closest\(\\?'div\\?'\)\.remove\(\)"/g,
        'data-act="atividades-dismiss-alert"'
    ));
    out = bump(out, out.replace(
        /\bonclick="\$\(this\)\.closest\(\\?'table\\?'\)\.trigger\(\\?'updateAll\\?'\);\$\(this\)\.remove\(\);?"/g,
        'data-act="atividades-tablesorter-cancel"'
    ));

    // togglePainelPro('profileProDiv','hide|show')
    out = bump(out, out.replace(
        /\bonclick="togglePainelPro\('([^']+)','([^']+)'\)"/g,
        'data-act="atividades-toggle-painel" data-target="$1" data-mode="$2"'
    ));

    // Composites — change then save
    out = bump(out, out.replace(
        /\bonchange="changeViewStatesAtiv\(this\);saveConfigPersonalUser\(this\);(?:getConfigProgramas\(this\);)?"/g,
        'data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeViewStatesAtiv\(this\);saveConfigPersonalUser\(this\);getConfigProgramas\(this\);"/g,
        'data-act="atividades-composite" data-chain="changeViewStatesAtiv|saveConfigPersonalUser|getConfigProgramas"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changePanelSortPro\(this\);saveConfigPersonalUser\(this\);?"/g,
        'data-act="atividades-composite" data-chain="changePanelSortPro|saveConfigPersonalUser"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changePanelSortColumnsPro\(this\);saveConfigPersonalUser\(this\);?"/g,
        'data-act="atividades-composite" data-chain="changePanelSortColumnsPro|saveConfigPersonalUser"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeDatesAfast\(this\);\s*updateOptionSelectMotivo\(this\)"/g,
        'data-act="atividades-composite" data-chain="changeDatesAfast|updateOptionSelectMotivo"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeConfigItemCell\(this\);\s*changeAtivChecklistInput\(this\);?"/g,
        'data-act="atividades-composite" data-chain="changeConfigItemCell|changeAtivChecklistInput"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeAtivSelect\(this\);repairTemposDemandaQuick\(\);?"/g,
        'data-act="atividades-composite" data-chain="changeAtivSelect|repairTemposDemandaQuick"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeAtivSelect\(this\);updateAtivSelectUser\(this\);?"/g,
        'data-act="atividades-composite" data-chain="changeAtivSelect|updateAtivSelectUser"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeAtivSelect\(this\);updateAtivTempoPactuado\(this\);?"/g,
        'data-act="atividades-composite" data-chain="changeAtivSelect|updateAtivTempoPactuado"'
    ));
    out = bump(out, out.replace(
        /\bonchange="changeAtivSelect\(this\);checkTempoProdutividade\(\$\(this\)\);?"/g,
        'data-act="atividades-composite" data-chain="changeAtivSelect|checkTempoProdutividade"'
    ));
    out = bump(out, out.replace(
        /\bonchange="checkSigleInputDateAtiv\(this\);\s*updateRecalculaPrazo\(this\);?"/g,
        'data-act="atividades-composite" data-chain="checkSigleInputDateAtiv|updateRecalculaPrazo"'
    ));
    out = bump(out, out.replace(
        /\bonchange="repairTemposDemandaQuick\(\);?"/g,
        'data-act="atividades-call" data-fn="repairTemposDemandaQuick" data-pass-el="0"'
    ));

    // parent.openBoxIconsFA('a','b','c')
    out = bump(out, out.replace(
        /\bonclick="parent\.openBoxIconsFA\(\\?'([^']+)\\?',\s*\\?'([^']+)\\?',\s*\\?'([^']+)\\?'\)"/g,
        'data-act="atividades-open-box-icons" data-scope="parent" data-arg="$1" data-arg2="$2" data-arg3="$3"'
    ));

    // openDialogDoc({title: '...', id_procedimento: '...', id_documento: '...'})
    // Keep as specialized when built from concatenated unicode — handle common template form:
    out = bump(out, out.replace(
        /\bonclick="openDialogDoc\(\{title:\s*\\?'[^']*\\?'\s*\+\s*unicodeToChar\(([^)]+)\)\s*\+\s*\\?'[^']*\\?'\s*\+\s*([^+\)]+)\s*\+\s*\\?'[^']*\\?',\s*id_procedimento:\s*\\?'[^']*\\?'\s*\+\s*([^+\)]+)\s*\+\s*\\?'[^']*\\?',\s*id_documento:\s*\\?'[^']*\\?'\s*\+\s*([^+\)]+)\s*\+\s*\\?'[^']*\\?'\}\)"/g,
        (m) => m // leave complex; handled below with broader replace
    ));

    return { out, n };
}

for (const file of files) {
    if (file === 'view.js' || file === 'domain.js' || file === 'io.js' || file === 'templates.js'
        || file === 'modules.js' || file === 'legacy-api.js' || file === 'index.js'
        || file === 'compat.js' || file === 'state.js' || file === 'runtime.js' || file === 'server.js') {
        continue;
    }
    const path = join(dir, file);
    const src = readFileSync(path, 'utf8');
    const { out, n } = transform(src);
    if (out !== src) {
        writeFileSync(path, out);
        console.log(`${file}: ~${n} handlers migrated`);
        total += n;
    } else {
        console.log(`${file}: no changes`);
    }
}

console.log(`done. ~${total} handlers touched`);
