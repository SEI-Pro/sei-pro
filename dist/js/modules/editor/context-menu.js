/**
 * SEI Pro - Editor / Feature: Menu de contexto (botao direito) do editor
 *
 * Entrada: initContextMenuPro() -- chamado no boot (initFunctions/tryRun do
 * monolito). Monta os itens customizados do menu de contexto do editor:
 *   - Bloquear Edicao        (menuBlockEdition)  -> em <p> com selecao
 *   - Adicionar Estilo       (tableSorterPro)    -> dentro de <tr>
 *   - Duplicar Tabela        (tableSorterPro)    -> dentro de <tr>
 *   - Classificar A -> Z     (tableSorterPro)    -> dentro de <tr>
 *   - Classificar Z -> A     (tableSorterPro)    -> dentro de <tr>
 *   - Copiar formatacao      (menuCopyStyle)     -> modulo copy-style.js
 *   - Inteligencia artificial(menuPlataformAI)   -> permanece no monolito (AI)
 *   - Formatar/Editar Imagem (editImgPro)        -> permanece no monolito (img)
 *
 * PORTADO de CK4 para CK5:
 *  - A versao antiga usava editor.contextMenu.addListener + addMenuItem +
 *    addMenuGroup + addCommand (tudo CK4, ausente no CK5) e manipulava o DOM
 *    dentro do iframe (getSelection().getStartElement().$, getAscendant,
 *    getElementsByTag, getIndex). Nada disso existe no CK5.
 *  - Agora cada menu roteia por SeiProEditorAdapter.addContextMenu(ed, builder),
 *    onde builder(targetEl) -> [{label, action}] (ou [] para o menu nativo).
 *    O alvo (targetEl) eh o elemento DOM clicado, valido tanto no iframe do
 *    CK4 quanto no editable inline do CK5.
 *  - As acoes (ordenar tabela, clonar tabela, bloquear edicao) sao
 *    reimplementadas com DOM puro + SeiProEditorAdapter.withEdit (agrupa o
 *    passo de edicao no undo).
 *
 * Helpers/funcoes que PERMANECEM no monolito (compartilhados ou de outra
 * feature) e sao apenas referenciados por nome em tempo de clique/boot:
 *  - menuCopyStyle  (modulo copy-style.js)
 *  - menuPlataformAI(const top-level do bloco de IA; usa editor.openDialog)
 *  - editImgPro     (feature de edicao de imagem; tambem chamado por
 *                    setCKEDITOR_SEIPRO)
 *  - openDialogSyleTable (modulo table-styles.js; dialogo jQuery UI que
 *                    substitui o antigo openDialog('TabelaSEI'))
 *  - hasSelection, restrictConfigValue, checkConfigValue (helpers globais)
 *
 * Acentos escritos normalmente (a pipeline escapa para \uXXXX). Ver README.md.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Helpers internos (privados do modulo)
    // ----------------------------------------------------------------

    // true se ha selecao nao-colapsada. Usa o helper compartilhado do monolito
    // quando presente; senao cai num teste via Selection do adapter.
    function hasSelectionSafe(editor) {
        if (typeof window.hasSelection === 'function') {
            try { return hasSelection(editor); } catch (e) { /* fallback abaixo */ }
        }
        var txt = SeiProEditorAdapter.getSelectedText(editor);
        return !!(txt && txt.length);
    }

    // closest tolerante (alguns alvos de contextmenu podem ser nos de texto).
    function closestEl(targetEl, selector) {
        if (!targetEl) return null;
        var el = (targetEl.nodeType === 1) ? targetEl : targetEl.parentElement;
        return (el && el.closest) ? el.closest(selector) : null;
    }

    // Abre o dialogo "Adicionar Estilo" da tabela. No CK4 era
    // editor.openDialog('TabelaSEI'); no contrato atual o dialogo eh jQuery UI
    // exposto pelo modulo table-styles.js como openDialogSyleTable(editor).
    function abrirDialogoEstiloTabela(editor) {
        if (typeof window.openDialogSyleTable === 'function') {
            openDialogSyleTable(editor);
        } else if (typeof window.getSyleSelectedTable === 'function') {
            // Fallback: aciona o fluxo pelo botao da toolbar (resolve o editor).
            getSyleSelectedTable();
        }
    }

    // Duplica a tabela que contem a selecao atual (insere uma copia logo apos,
    // separada por um paragrafo). Espelha o antigo cloneTablePro do CK4 com DOM.
    function duplicarTabela(editor, targetEl) {
        var table = closestEl(targetEl, 'table');
        if (!table && window.$) {
            var el = SeiProEditorAdapter.getSelectionElement(editor);
            if (el) { var $t = $(el).closest('table'); table = $t.length ? $t[0] : null; }
        }
        if (!table) return;
        var htmlTable = table.outerHTML;
        var newLine = '<p class="Texto_Justificado_Recuo_Primeira_Linha"><br></p>';
        SeiProEditorAdapter.withEdit(editor, function () {
            // CK5 reconcilia o DOM do editable; para a copia persistir,
            // inserimos via pipeline do adapter logo apos a tabela alvo.
            if (SeiProEditorAdapter.version === 5) {
                SeiProEditorAdapter.insertHtmlBefore(editor, table.nextSibling || table, newLine + htmlTable);
            } else if (window.$) {
                $(table).after(newLine + htmlTable);
            }
        });
    }

    // Ordena as linhas (<tr>) do <tbody> da tabela alvo pela coluna da celula
    // clicada. order: 'asc' | 'desc'. Espelha o antigo tablesort do CK4 com DOM.
    function ordenarTabela(editor, targetEl, order) {
        var cell = closestEl(targetEl, 'td,th');
        var table = closestEl(targetEl, 'table');
        if (!cell || !table) {
            // Fallback pela selecao.
            var selEl = SeiProEditorAdapter.getSelectionElement(editor);
            if (selEl && selEl.closest) {
                cell = cell || selEl.closest('td,th');
                table = table || selEl.closest('table');
            }
        }
        if (!cell || !table) return;

        // Indice da coluna = posicao da celula entre seus irmaos.
        var columnNr = 0;
        var sib = cell;
        while ((sib = sib.previousElementSibling) !== null) { columnNr++; }

        var tbody = table.querySelector('tbody') || table;

        SeiProEditorAdapter.withEdit(editor, function () {
            var rows = [];
            var children = tbody.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1) rows.push(children[i]); // ignora text nodes
            }

            rows.sort(function (a, b) {
                var aCell = a.childNodes[cellIndexFor(a, columnNr)];
                var bCell = b.childNodes[cellIndexFor(b, columnNr)];
                var aText = aCell ? (aCell.innerText || aCell.textContent || '').trim() : '';
                var bText = bCell ? (bCell.innerText || bCell.textContent || '').trim() : '';
                if (!aText || aText.length === 0) {
                    if (!bText || bText.length === 0) return 0;
                    return 1;
                }
                if (!bText || bText.length === 0) return -1;
                if (order === 'desc') return bText.localeCompare(aText, undefined, { numeric: true });
                return aText.localeCompare(bText, undefined, { numeric: true });
            });

            for (var j = 0; j < rows.length; j++) {
                tbody.appendChild(rows[j]); // reanexar reordena in place
            }
        });
    }

    // O original indexava childNodes diretamente (column_nr era getIndex()
    // sobre os filhos do <tr>, contando so elementos via getStartElement). Aqui
    // mapeamos o indice de coluna (somente elementos) para o indice real em
    // childNodes (que pode conter text nodes de whitespace).
    function cellIndexFor(row, columnNr) {
        var seen = -1;
        for (var i = 0; i < row.childNodes.length; i++) {
            if (row.childNodes[i].nodeType === 1) {
                seen++;
                if (seen === columnNr) return i;
            }
        }
        return 0;
    }

    // Alterna contenteditable=false a partir do <p> da selecao ate (incluindo)
    // o <p> onde termina a selecao. Espelha o command 'blockedition' do CK4
    // (setNextElem recursivo sobre element.next()). Em CK5 a manipulacao direta
    // do atributo no editable nao eh confiavel (o model reconcilia), entao
    // emitimos um aviso de feature parcial nessa versao.
    function bloquearEdicao(editor, targetEl) {
        if (SeiProEditorAdapter.version === 5) {
            if (typeof window.alertaBoxPro === 'function') {
                alertaBoxPro('Info', 'info-circle', 'Bloquear Edi\u00E7\u00E3o ainda n\u00E3o est\u00E1 dispon\u00EDvel no editor do SEI 5.');
            }
            return;
        }
        var startP = closestEl(targetEl, 'p');
        if (!startP && window.$) {
            var el = SeiProEditorAdapter.getSelectionElement(editor);
            if (el) { var $p = $(el).closest('p'); startP = $p.length ? $p[0] : null; }
        }
        if (!startP) return;

        // Delimita pelo paragrafo onde a selecao termina (focusNode).
        var endP = startP;
        try {
            var body = SeiProEditorAdapter.getBodyContainer(editor);
            var win = body && body.ownerDocument ? body.ownerDocument.defaultView : window;
            var sel = win && win.getSelection ? win.getSelection() : null;
            if (sel && sel.focusNode) {
                var fn = sel.focusNode.nodeType === 1 ? sel.focusNode : sel.focusNode.parentElement;
                var $fp = fn && fn.closest ? fn.closest('p') : null;
                if ($fp) endP = $fp;
            }
        } catch (e) { /* usa startP */ }

        SeiProEditorAdapter.withEdit(editor, function () {
            var p = startP;
            var guard = 0;
            while (p && guard < 5000) {
                var locked = p.getAttribute('contenteditable') === 'false';
                p.setAttribute('contenteditable', locked ? 'true' : 'false');
                if (p === endP) break;
                p = p.nextElementSibling;
                guard++;
            }
        });
    }

    // ----------------------------------------------------------------
    // Funcoes GLOBAIS (mesmos nomes do monolito)
    // ----------------------------------------------------------------

    // Menu de contexto "Bloquear Edicao". Aparece quando o alvo esta dentro de
    // um <p> e ha selecao. No CK4 era contextMenu/addMenuItem/addCommand.
    window.menuBlockEdition = function (editor) {
        if (!editor) return;
        SeiProEditorAdapter.addContextMenu(editor, function (targetEl) {
            if (closestEl(targetEl, 'p') && hasSelectionSafe(editor)) {
                return [{
                    label: 'Bloquear Edi\u00E7\u00E3o',
                    action: function () { bloquearEdicao(editor, targetEl); }
                }];
            }
            return [];
        });
    };

    // Menu de contexto da tabela (estilo, duplicar, classificar A->Z / Z->A).
    // Aparece quando o alvo esta dentro de um <tr>. No CK4 eram 4 listeners +
    // addMenuItem/addCommand; aqui um unico builder retorna todos os itens.
    window.tableSorterPro = function (editor) {
        if (!editor) return;
        SeiProEditorAdapter.addContextMenu(editor, function (targetEl) {
            if (!closestEl(targetEl, 'tr')) return [];
            return [
                {
                    label: 'Adicionar Estilo',
                    action: function () { abrirDialogoEstiloTabela(editor); }
                },
                {
                    label: 'Duplicar Tabela',
                    action: function () { duplicarTabela(editor, targetEl); }
                },
                {
                    label: 'Classificar A \u2192 Z',
                    action: function () { ordenarTabela(editor, targetEl, 'asc'); }
                },
                {
                    label: 'Classificar Z \u2192 A',
                    action: function () { ordenarTabela(editor, targetEl, 'desc'); }
                }
            ];
        });
    };

    // Entrada da feature. Roda no boot. Resolve a instancia via adapter e
    // registra todos os menus de contexto. addContextMenu eh idempotente
    // (marca o body container), entao repetir nao duplica handlers.
    //
    // Observacao: menuCopyStyle vive em copy-style.js; menuPlataformAI e
    // editImgPro permanecem no monolito (IA / edicao de imagem). Chamamos cada
    // um por nome QUANDO existir, preservando o gating de config do original.
    window.initContextMenuPro = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        tableSorterPro(editor);
        if (typeof window.menuCopyStyle === 'function') menuCopyStyle(editor);
        menuBlockEdition(editor);

        var temFerramentasIA = (typeof window.restrictConfigValue === 'function')
            ? restrictConfigValue('ferramentasia') : false;
        if (temFerramentasIA && typeof window.menuPlataformAI === 'function') {
            menuPlataformAI(editor);
        }

        var editarImagens = (typeof window.checkConfigValue === 'function')
            ? checkConfigValue('editarimagens') : false;
        if (editarImagens && typeof window.editImgPro === 'function') {
            editImgPro(editor);
        }
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'context-menu' });
    }
})();
