// docs-lote / templates — fábricas de HTML do wizard (markup puro: recebe dados,
// devolve string). Sem jQuery, sem io, sem chrome.*. A view consome estes templates
// e cuida do DOM/eventos.
//
// Nota de transição: o markup preserva as classes GLOBAIS compartilhadas do SEI Pro
// (seiProForm, tableInfo, tituloControle, onoffswitch, dialogBoxDiv, #dialogBoxDocLote…)
// e os estilos inline herdados do legado — renomeá-los para `.seipro-*` quebraria a
// infra de diálogo compartilhada com sei-functions-pro. Classes próprias desta feature
// usam o prefixo `.seipro-`.

const wrap = (inner) => `<div id="dialogBoxDocLote" class="dialogBoxDiv seipro-doclote-dialog">${inner}</div>`;

// 1/6 — seleção do documento modelo / texto padrão. `credito` é o trecho opcional
// (creditação) que a view injeta conforme restrictConfigValue.
export function selecaoDocBox(credito = '') {
    return wrap(`<table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: top;text-align: left;height: 40px;" class="label">
                            <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em lote:</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="required">
                            <select id="docLoteSelect" class="seipro-doclote-model-select"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: bottom;text-align: left;height: 40px;" class="label">
                            <label for="textoPadraoSelect"><i class="iconPopup iconSwitch fas fa-keyboard cinzaColor"></i> ou Selecione do Texto Padrão da Unidade:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select id="textoPadraoSelect" class="seipro-doclote-template-select"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>
                        </td>
                    </tr>
                </table>
                ${credito}`);
}

export const creditoTcgontijo = '<div style="margin: 10px 0;font-size: 8pt;color: #888;">Código-fonte gentilmente cedido por <a href="https://github.com/tcgontijo" target="_blank" style="color: #00c;">tcgontijo</a> | PluriDocs SEI!<div>';

// 2/6, 4/6, 5/6 — caixas com texto curto.
export const analiseDocModeloBox = () => wrap(`<p>Análise do documento modelo:</p>`);
export const analiseCsvBox = () => wrap(`<p>Análise da base de dados:</p>`);
export const cruzamentoDadosBox = () => wrap(`<p>Segue abaixo o relacionamento entre cabeçalhos da base de dados e os campos dinâmicos do documento modelo:</p>`);

// 3/6 — upload do CSV.
export function selecaoBaseDadosBox() {
    return wrap(`<table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: top;text-align: left;height: 40px;" class="label">
                            <label for="inputBD"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Selecione um arquivo no formato CSV para servir como base de dados para a geração de documentos em lote:</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="required">
                            <input id="inputBD" type="file" accept=".csv, text/csv"></input>
                        </td>
                    </tr>
                </table>`);
}

// 6/6 — loader de execução.
export function loaderBox() {
    return wrap(`<div style="margin-top: 35px;" id="preparingProgressCircular">
                        <div style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>
                    </div>
                    <div id="progress">
                        <p style="text-align:center" id="preparingProgress">Preparando ambiente</p>
                    </div>`);
}

export function erroBox(textError = '') {
    return wrap(`<div>
                        <p><i class="fas fa-exclamation-triangle vermelhoColor"></i> Eita! Algo deu errado na replicação de documentos 😔</p>
                        <br>
                        <p>Verifique as configurações selecionadas e tente novamente.</p>
                        <p>${textError}</p>
                    </div>`);
}

// Painel de cruzamento de dados (5/6) — markup grande. Recebe os dados já calculados
// pela view (cabeçalhos, modelo, linhas da tabela e os <option> dos selects).
export function dataCrossingPanel({ csvFileName, modeloNome, tbody, selectData, isNewSEI, selectTiposProcessos }) {
    const blocoNomeDoc = !isNewSEI
        ? `
            <tr>
                <td colspan="2">
                    <p style="font-size: 1.2em;"><i class='fas fa-file-alt cinzaColor'></i> Nome do documento na árvore de processos <a class="newLink" style="font-size: 0.8em;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Alguns documentos possuem a propriedade <b>Número</b> que quando preenchida exibe o valor na árvore de processos logo após o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato = Número)')"><i class="fas fa-info-circle azulColor"></i></a></p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <select id="nomesDoc">${selectData}</select>
                </td>
            </tr>
            <tr>
                <td style="width: 50px;">
                    <div class="seipro-doclote-force-names" style="margin: 10px 0; font-size: 9pt;transform: scale(0.9);">
                        <div class="onoffswitch" style="float: left;margin-right: 1em;">
                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="checkForceNames" data-type="setdate" tabindex="0">
                        <label class="onoff-switch-label" for="checkForceNames"></label>
                    </div>
                </td>
                <td>
                    <label for="checkForceNames">Forçar atribuição de nomes na Árvore (Pode gerar erros 💀)</label>
                </td>
            </tr>
            `
        : `
            <tr>
                <td>
                    <div style="margin: 10px 0;display: inline-block;">
                    <p style="font-size: 1.2em;">Nome do documento na árvore de processos <a class="newLink" style="font-size: 0.8em;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Somente alguns tipos de documentos suportam a propriedade <b>Número</b> que quando preenchida exibe o valor na árvore de processos logo após o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato = Número)')"><i class="fas fa-info-circle colorAzul"></i></a></p>
                </td>
            </tr>
            <tr>
                <td>
                    <select id="nomesDoc">${selectData}</select>
                </td>
            </tr>
            `;

    return `
            <div id="divTableDataCrossing">
                <div class="seipro-doclote-crossing-scroll" style="max-height: 300px;overflow-y: auto;">
                    <table id="tableDataCrossing" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                        <thead>
                            <th class="tituloControle" style="width: 47%;">${csvFileName}</th>
                            <th class="tituloControle"></th>
                            <th class="tituloControle" style="width: 47%;">${modeloNome}</th>
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>
                </div>
                <hr style="all:revert;border: 1px solid #dcdcdc;margin: 10px 0;">
                <table style="font-size: 9pt !important;width: 100%;">
                    <tbody>
                        ${blocoNomeDoc}
                    </tbody>
                </table>
                <hr style="all:revert;border: 1px solid #dcdcdc;margin: 10px 0;">
                <table style="font-size: 9pt !important;width: 100%;">
                    <tbody>
                        <tr>
                            <td style="width: 50px;">
                                <div style="margin: 10px 0;font-size: 9pt;display: inline-block;transform: scale(0.9);float: left;">
                                    <div class="onoffswitch" style="float: left;margin-right: 1em;margin-left: 0;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="newProcs" data-type="setdate" tabindex="0">
                                        <label class="onoff-switch-label" for="newProcs"></label>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <label for="newProcs">Criar cada documento em um novo processo</label>
                            </td>
                        </tr>
                        <tr style="display:none" class="seipro-doclote-process-type-fields">
                            <td colspan="2">
                                <p style="font-size: 1.2em;"><i class="fas fa-folder-open cinzaColor"></i> Tipo de Processo:</p>
                                <select id="tipoProcessoSelect"><option value="">Selecione um tipo de documento</option>${selectTiposProcessos}</select>
                            </td>
                        </tr>
                        <tr style="display:none" class="seipro-doclote-process-type-fields">
                            <td colspan="2">
                                <p style="font-size: 1.2em;"><i class="fas fa-comment-dots cinzaColor"></i> Especificação do processo: (Disponível campos dinâmicos da planilha)</p>
                                <input type="text" class="infraText" id="txtEspecificacaoProcesso" style="width: 480px;padding: 0.8em;" placeholder="Ex: Certificado de ##nome_aluno##">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `;
}

// Barra de ações da tabela de resultado. Botões usam classes `.seipro-*` (delegação),
// não onclick inline.
export const resultFilterBar = `<div class="btn-group seipro-doclote-result-actions" role="group" style="margin: 10px 0;">
                                            <button type="button" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light seipro-doclote-download">
                                                <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                                                <span class="text">Baixar</span>
                                            </button>
                                            <button type="button" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light seipro-doclote-copy">
                                                <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                                                <span class="text">Copiar</span>
                                            </button>
                                        </div>`;

// Tabela final de documentos gerados. `theadRows`/`tbodyRows` já montados pela view.
export function resultTable(theadRows, tbodyRows) {
    return `
                            <div class="seipro-doclote-result-scroll" style="max-height: 350px;max-width: 850px;overflow: auto;">
                                <table id="tableDataResult" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                                    <thead>
                                        ${theadRows}
                                    </thead>
                                    <tbody>
                                        ${tbodyRows}
                                    </tbody>
                                </table>
                            </div>
                            `;
}
