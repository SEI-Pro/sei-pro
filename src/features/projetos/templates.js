/**
 * Projetos — HTML templates (no jQuery, no inline handlers).
 */
import { el } from '../../dom/index.js';
import { formatDisplay } from './domain/datas.js';
import { baselineDeviation } from './domain/progress.js';

export function panelShellHtml() {
    return (
        '<div class="panelHomePro seipro-projetos" id="projetosGantt" style="display:inline-block;width:100%;">' +
        '  <div class="infraBarraLocalizacao titlePanelHome seipro-projetos__title">' +
        '    <i class="fa fa-tasks azulColor" style="margin:0 5px;font-size:1.1em;"></i> Projetos' +
        '    <button type="button" class="newLink seipro-projetos__toggle" data-act="toggle-panel" title="Recolher/mostrar" aria-label="Recolher painel">' +
        '      <i class="fas fa-minus-square cinzaColor"></i>' +
        '    </button>' +
        '  </div>' +
        '  <div id="projetosGanttDiv" class="seipro-projetos__body" style="width:100%;display:inline-table;">' +
        '    <div class="seipro-projetos__toolbar" id="projetosProActions">' +
        '      <button type="button" class="newLink" data-act="add-projeto" title="Adicionar projeto"><i class="fas fa-plus"></i></button>' +
        '      <button type="button" class="newLink" data-act="open-filter" title="Relatorio filtrado"><i class="fas fa-filter"></i></button>' +
        '      <button type="button" class="newLink" data-act="open-portfolio" title="Visao de portfolio"><i class="fas fa-th-large"></i></button>' +
        '      <button type="button" class="newLink" data-act="open-responsavel" title="Por responsavel"><i class="fas fa-users"></i></button>' +
        '      <button type="button" class="newLink" data-act="toggle-arquivados" title="Mostrar arquivados"><i class="fas fa-archive"></i></button>' +
        '      <button type="button" class="newLink" data-act="export-json" title="Exportar JSON"><i class="fas fa-file-export"></i></button>' +
        '      <button type="button" class="newLink" data-act="import-json" title="Importar JSON"><i class="fas fa-file-import"></i></button>' +
        '      <button type="button" class="newLink" data-act="refresh" title="Atualizar"><i class="fas fa-sync-alt"></i></button>' +
        '      <label class="seipro-projetos__tipo-label">Tipo ' +
        '        <select id="selectTipoProjetoPro" class="infraText seipro-projetos__tipo" data-act="filter-tipo"></select>' +
        '      </label>' +
        '    </div>' +
        '    <div id="projetosAlerts" class="seipro-projetos__alerts" aria-live="polite"></div>' +
        '    <div id="projetosTabs" class="seipro-projetos__tabs"></div>' +
        '  </div>' +
        '</div>'
    );
}

export function emptyStateHtml() {
    return (
        '<div class="seipro-projetos__empty">' +
        '  <p>Nenhum projeto ainda. Clique em <strong>+</strong> para criar, ou use os dados de demonstracao.</p>' +
        '  <button type="button" class="newLink" data-act="seed-demo">Carregar demonstracao</button>' +
        '</div>'
    );
}

export function projetoFormHtml(projeto = {}, tipos = []) {
    const opts = ['<option value="">—</option>']
        .concat(tipos.map((t) => {
            const sel = Number(projeto.id_tipo_projeto) === Number(t.id_tipo_projeto) ? ' selected' : '';
            return '<option value="' + t.id_tipo_projeto + '"' + sel + '>' + escapeHtml(t.nome_tipo_projeto) + '</option>';
        }));
    return (
        '<form class="seipro-projetos-form seiProForm" data-form="projeto">' +
        '  <input type="hidden" name="id_projeto" value="' + (projeto.id_projeto || 0) + '">' +
        '  <table style="width:100%;font-size:10pt;">' +
        '    <tr><td class="label"><label>Nome</label></td>' +
        '        <td class="required"><input class="infraText" name="nome_projeto" required value="' + escapeAttr(projeto.nome_projeto || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Tipo</label></td>' +
        '        <td><select class="infraText" name="id_tipo_projeto">' + opts.join('') + '</select></td></tr>' +
        '    <tr><td class="label"><label>Processo SEI</label></td>' +
        '        <td><input class="infraText" name="processo_sei" value="' + escapeAttr(projeto.processo_sei || '') + '"></td></tr>' +
        '  </table>' +
        '</form>'
    );
}

export function etapaFormHtml(etapa = {}, projeto = {}) {
    const deps = (projeto.etapas || [])
        .filter((e) => e.id_etapa !== etapa.id_etapa)
        .map((e) => {
            const sel = Number(etapa.id_dependencia) === Number(e.id_etapa) ? ' selected' : '';
            return '<option value="' + e.id_etapa + '"' + sel + '>' + escapeHtml(e.nome_etapa) + '</option>';
        });
    return (
        '<form class="seipro-projetos-form seiProForm" data-form="etapa">' +
        '  <input type="hidden" name="id_projeto" value="' + (projeto.id_projeto || 0) + '">' +
        '  <input type="hidden" name="id_etapa" value="' + (etapa.id_etapa || 0) + '">' +
        '  <table style="width:100%;font-size:10pt;">' +
        '    <tr><td class="label"><label>Nome</label></td>' +
        '        <td class="required"><input class="infraText" name="nome_etapa" required value="' + escapeAttr(etapa.nome_etapa || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Inicio programado</label></td>' +
        '        <td class="required"><input type="datetime-local" name="data_inicio_programado" required></td></tr>' +
        '    <tr><td class="label"><label>Fim programado</label></td>' +
        '        <td class="required"><input type="datetime-local" name="data_fim_programado" required></td></tr>' +
        '    <tr><td class="label"><label>Predecessora (FS)</label></td>' +
        '        <td><select class="infraText" name="id_dependencia"><option value="">—</option>' + deps.join('') + '</select></td></tr>' +
        '    <tr><td class="label"><label>Macroetapa</label></td>' +
        '        <td><input class="infraText" name="macroetapa" value="' + escapeAttr(etapa.macroetapa || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Responsavel</label></td>' +
        '        <td><input class="infraText" name="responsavel" value="' + escapeAttr(etapa.responsavel || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Grupo</label></td>' +
        '        <td><input class="infraText" name="grupo" value="' + escapeAttr(etapa.grupo || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Etiquetas</label></td>' +
        '        <td><input class="infraText" name="etiqueta" id="proj_etiqueta" value="' + escapeAttr(etapa.etiqueta || '') + '"></td></tr>' +
        '    <tr><td class="label"><label>Calendario</label></td>' +
        '        <td><select class="infraText" name="calendario">' +
        '              <option value="corrido"' + (etapa.calendario !== 'util' ? ' selected' : '') + '>Dias corridos</option>' +
        '              <option value="util"' + (etapa.calendario === 'util' ? ' selected' : '') + '>Dias uteis (feriados BR)</option>' +
        '            </select></td></tr>' +
        '    <tr><td class="label"><label>Marco</label></td>' +
        '        <td><label><input type="checkbox" name="marco" value="1"' + (etapa.marco ? ' checked' : '') + '> Entrega / prazo legal</label></td></tr>' +
        '    <tr><td class="label"><label>Progresso %</label></td>' +
        '        <td><input type="number" min="0" max="100" class="infraText" name="progresso_execucao" value="' + (etapa.progresso_execucao || 0) + '"></td></tr>' +
        '    <tr><td class="label"><label>Observacoes</label></td>' +
        '        <td><textarea class="infraText" name="observacoes" rows="3">' + escapeHtml(etapa.observacoes || '') + '</textarea></td></tr>' +
        '  </table>' +
        '</form>'
    );
}

export function popupDetailsHtml(etapa, meta = {}) {
    const dev = baselineDeviation(etapa);
    const rows = [
        ['Responsavel', etapa.responsavel || '—'],
        ['Macroetapa', etapa.macroetapa || '—'],
        ['Programado', formatDisplay(etapa.data_inicio_programado, true) + ' → ' + formatDisplay(etapa.data_fim_programado, true)],
        ['Progresso', (meta.progress != null ? meta.progress : etapa.progresso_execucao) + '%'],
        ['Folga', meta.folga != null ? meta.folga + ' dia(s)' : (etapa.folga != null ? etapa.folga + ' dia(s)' : '—')],
        ['Critico', (meta.critico || etapa.critico) ? 'Sim' : 'Nao'],
        ['Desvio', dev.days == null ? '—' : (dev.days + ' dia(s)')]
    ];
    return '<table class="seipro-projetos-popup">' + rows.map((r) =>
        '<tr><th>' + r[0] + '</th><td>' + escapeHtml(String(r[1])) + '</td></tr>'
    ).join('') + '</table>';
}

export function a11yTableHtml(etapas) {
    const head = '<thead><tr><th>Etapa</th><th>Inicio</th><th>Fim</th><th>%</th><th>Responsavel</th><th>Critico</th></tr></thead>';
    const body = (etapas || []).map((e) =>
        '<tr>' +
        '<td>' + escapeHtml(e.nome_etapa) + '</td>' +
        '<td>' + escapeHtml(formatDisplay(e.data_inicio_programado)) + '</td>' +
        '<td>' + escapeHtml(formatDisplay(e.data_fim_programado)) + '</td>' +
        '<td>' + (e.progresso_execucao || 0) + '</td>' +
        '<td>' + escapeHtml(e.responsavel || '') + '</td>' +
        '<td>' + (e.critico ? 'Sim' : '') + '</td>' +
        '</tr>'
    ).join('');
    return '<table class="seipro-projetos-a11y infraTable">' + head + '<tbody>' + body + '</tbody></table>';
}

export function shareTableHtml(shares = []) {
    const rows = (shares || []).map((s, i) =>
        '<tr data-index="' + i + '">' +
        '<td contenteditable="true" data-field="usuario">' + escapeHtml(s.usuario || '') + '</td>' +
        '<td contenteditable="true" data-field="permissao">' + escapeHtml(s.permissao || 'leitura') + '</td>' +
        '<td><button type="button" class="newLink" data-act="share-remove" data-index="' + i + '"><i class="fas fa-trash"></i></button></td>' +
        '</tr>'
    ).join('');
    return (
        '<div class="seipro-projetos-share">' +
        '  <table class="infraTable" id="seiproProjetosShareTable"><thead><tr><th>Usuario</th><th>Permissao</th><th></th></tr></thead>' +
        '  <tbody>' + rows + '</tbody></table>' +
        '  <button type="button" class="newLink" data-act="share-add"><i class="fas fa-plus"></i> Adicionar</button>' +
        '</div>'
    );
}

export function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
}

export function elFromHtml(html) {
    const wrap = el('div', { html });
    return wrap.firstElementChild || wrap;
}
