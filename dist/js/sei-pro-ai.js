const loadSEIProAI = true;
const consentAI = `<table role="presentation" cellspacing="0" border="0" style="width:100%;float:none;" align="left">
                    <tbody>
                        <tr>
                            <td role="presentation" class="cke_dialog_ui_vbox_child">
                                <div id="cke_382_uiElement" class="cke_dialog_ui_text editorTextDisclaimer">
                                    <p>1. N\u00E3o utilize o ChatGPT para contextos complexos, envolvendo informa\u00E7\u00F5es sigilosas, restritas ou que possa impactar decis\u00F5es cr\u00EDticas.</p>
                                    <p>2. \u00C9 importante sempre uma verifica\u00E7\u00E3o humana das respostas geradas automaticamente.</p>
                                    <p>3. A assinatura de documentos gerados com o aux\u00EDlio de IA s\u00E3o de inteira resposabilidade do signat\u00E1rio.</p>
                                    <p>4. A ferramenta foi alimentada com diferentes conte\u00FAdos da Internet. Quando o contexto n\u00E3o s\u00E3o bem definidos, as respostas poder\u00E3o n\u00E3o ser \u00FAteis e poder\u00E3o levar a tomada de decis\u00E3o equivocada.</p>
                                    <p>5. Fique atento \u00E0s suas limita\u00E7\u00F5es para n\u00E3o incorrer em situa\u00E7\u00F5es de erro, quebra de seguran\u00E7a ou quest\u00F5es legais.</p>
                                    <p>6. Antes de utilizar a ferramenta, verifique a adequa\u00E7\u00E3o do ChatGPT ao ato normativo sobre o uso seguro de computa\u00E7\u00E3o em nuvem do seu \u00F3rg\u00E3o.</p>
                                </div> 
                            </td>
                        </tr>
                        <tr>
                            <td role="presentation" class="cke_dialog_ui_vbox_child">
                                <span id="cke_383_uiElement" class="cke_dialog_ui_checkbox">
                                    <input class="cke_dialog_ui_checkbox_input" type="checkbox" aria-labelledby="cke_381_label" id="ciente_disclaimer">
                                    <label id="cke_381_label" for="ciente_disclaimer">Estou ciente e entendo os riscos</label>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                    </table>`;
const disclaimerAI = `<div id="openAI_info" style="white-space: break-spaces;color: #616161;">
                        <div class="alertaAttencionPro dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
                            <i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Aproveite todo o potencial da intelig\u00EAncia artificial do <a href="https://chat.openai.com/chat" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">ChatGPT</a> diretamente no editor de documentos do SEI. <br><br><span style="margin-left: 20px;"></span>Siga o passo-a-passo abaixo para cadastrar suas credenciais de acesso:<br><br>
                        </div>
                        <div class="alertaAttencionPro dialogBoxDiv" style="margin-left:20px;font-size: 11pt;line-height: 12pt;color: #616161;">
                            1. Acesse o site do OpenAI (<a href="https://beta.openai.com/" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://beta.openai.com/</a>) e clique em "Sign Up" no canto superior direito da tela.<br><br>
                            2. Preencha o formul\u00E1rio de cadastro com seus dados pessoais e crie uma senha. <br><span style="margin-left: 17px;"></span>\u00C9 poss\u00EDvel logar com sua conta Google ou Microsoft.<br><br>
                            3. Verifique seu e-mail e clique no link de confirma\u00E7\u00E3o enviado pela OpenAI.<br><br>
                            4. Verifique seu celular e adicione o c\u00F3digo de verifica\u00E7\u00E3o enviado por SMS.<br><br>
                            5. Fa\u00E7a login na sua conta OpenAI.<br><br>
                            6. Clique em "<i class="fas fa-bolt verdeColor"></i> Upgrade" no menu do lado direito da tela ou acesse o endere\u00E7o <a href="https://beta.openai.com/account/billing/overview" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://beta.openai.com/account/billing/overview</a>.<br><br>
                            7. Selecione a op\u00E7\u00E3o "USER > Create API Key".<br><br>
                            8. Clique em "Create new secret key" para gerar sua chave de API.<br><br>
                            9. Ser\u00E1 adicionado um cr\u00E9dito promocional de $18, para utiliza\u00E7\u00E3o em at\u00E9 4 (quatro) meses. <br><span style="margin-left: 17px;"></span>Caso deseje prosseguir ap\u00F3s isso, adicione suas informa\u00E7\u00F5es de pagamento no menu "Billing". <br><span style="margin-left: 17px;"></span>Consulte condi\u00E7\u00F5es de precifica\u00E7\u00E3o da plataforma em: <a href="https://openai.com/api/pricing/" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://openai.com/api/pricing/</a><br><br>
                            10. Copie sua chave secreta de API, pois ela ser\u00E1 necess\u00E1ria para fazer chamadas \u00E0 API. Cole-a no campo abaixo:<br><br>
                        </div>
                        <table role="presentation" class="cke_dialog_ui_hbox">
                        <tbody>
                            <tr class="cke_dialog_ui_hbox">
                                <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px">
                                    <input tabindex="3" placeholder="Insira o valor para a chave secreta" class="cke_dialog_ui_input_text" id="cke_inputSecretKey_textInput" type="password" aria-labelledby="cke_inputSecretKey_label">
                                </td>
                                <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">
                                    <a style="user-select: none;" onclick="saveTokenOpenAI(this)" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="openAI_label" id="openAI_uiElement">
                                        <span id="openAI_label" class="cke_dialog_ui_button">Salvar</span>
                                    </a>
                                    <i id="openAI_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        <div id="openAI_alert" style="white-space: break-spaces;margin-top: 10px;font-style: italic; color: #616161;" class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i>${NAMESPACE_SPRO} n\u00E3o fomenta ou recebe financiamento para a utiliza\u00E7\u00E3o dos produtos da OpenAI. Recomenda-se o seu uso meramente did\u00E1tico.</div>
                    </div>`;
var modelsOpenAI = (typeof localStorageRestorePro('modelsOpenAI') !== 'undefined' && localStorageRestorePro('modelsOpenAI') !== null) 
                ? localStorageRestorePro('modelsOpenAI')
                : [
                    ['gpt-4'],
                    ['gpt-4-1106-preview'],
                    ['gpt-4-vision-preview'],
                    ['gpt-4-32k'],
                    ['gpt-4-0613'],
                    ['gpt-4-32k-0613'],
                    ['gpt-3.5-turbo-1106'],
                    ['gpt-3.5-turbo'],
                    ['gpt-3.5-turbo-16k'],
                    ['gpt-3.5-turbo-instruct'],
                ];
function updateModelsOpenAI() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.openai.com/v1/models");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+perfilOpenAI.KEY_USER);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let open_ai_models = xhr.responseText;
                open_ai_models = JSON.parse(open_ai_models);
                open_ai_models = jmespath.search(open_ai_models.data,"[?owned_by!='openai-internal'] | [?owned_by!='openai-dev'] | [?owned_by!='system'] | [*].id");
                open_ai_models = open_ai_models.map(function(v){ return [v]});
                // console.log(open_ai_models);
            if (typeof open_ai_models !== 'undefined' && open_ai_models !== null && open_ai_models.length) {
                modelsOpenAI = open_ai_models;
                localStorageStorePro('modelsOpenAI', open_ai_models);
            }
        }
    };
    xhr.send();
}
function copyResponseAI(this_) {
    let _this = $(this_);
    let id_response = _this.data('response');
    copyTextWithBR($('#responseBot_'+id_response));
}
function getAIActions(this_) {
    let _this = $(this_);
    let _parent = _this.closest('.ui-dialog');
    let selectPrompt = _parent.find('#promptAISelect');
    let selectPromptVal = selectPrompt.val();
    let selectPromptText = selectPrompt.find('option:selected').text();
    let selectDocAi = _parent.find('#docAISelect');
    let selectDocAiOption = selectDocAi.find('option:selected');
    let selectDocAiText = selectDocAiOption.text();
    let btnSendAI = _parent.find('#btnSendAI');
    let container = _parent.find('#response_ai');
    let protocolo = selectDocAiOption.data('id_documento');
        protocolo = typeof protocolo !== 'undefined' ? protocolo : false;
    if (protocolo && typeof dataDocs !== 'undefined' && dataDocs.length && btnSendAI.find('i').hasClass('fa-paper-plane')) {
        let selectedDoc = dataDocs.find((doc) => doc.id_documento.toString() === protocolo.toString());
            btnSendAI.removeClass('newLink_confirm').find('i').attr('class','fas fa-spin fa-spinner');
        if (typeof selectedDoc.src !== 'undefined') {
            $.get(selectedDoc.src).done((contentDoc) => {
                let open_ai_response;
                let perfilOpenAI = localStorageRestorePro('configBasePro_openai');
                    perfilOpenAI = (typeof perfilOpenAI !== 'undefined' && perfilOpenAI !== null) ? perfilOpenAI : false;
                let content_text = contentDoc.substring(contentDoc.indexOf('<body>'), contentDoc.lastIndexOf('</body>'))
                    content_text = typeof content_text !== 'undefined' && content_text != '' ? $(content_text).text() : false;
                let prompt_text = content_text && selectPromptVal == 'resumo' ? JSON.stringify(`Resuma o seguinte texto "${content_text}"`) : false;
                    prompt_text = content_text && selectPromptVal == 'topico' ? JSON.stringify(`Crie uma estrutura de t\u00F3picos sobre o seguinte texto "${content_text}"`) : prompt_text;
                    prompt_text = content_text && selectPromptVal == 'palavras_chave' ? JSON.stringify(`Extraia as palavras-chave do seguinte texto "${content_text}"`) : prompt_text;
                let response_user = `<div class="response_user">${selectPromptText} "${selectDocAiText}"</div>`;
                    container.find('.welcome').remove();
                    container.append(response_user);
                    container[0].scrollTop = container[0].scrollHeight;

                if (prompt_text) {
                    openai_post();
            
                    async function openai_post() {
                        var url = perfilOpenAI.URL_API;
                        let getModelOpenAI = getOptionsPro('setModelOpenAI') ? getOptionsPro('setModelOpenAI') : 'gpt-4';
                        let getTemperatureOpenAI = getOptionsPro('setTemperatureOpenAI') ? getOptionsPro('setTemperatureOpenAI') : '0.4';
                        let getMaxTokensOpenAI = getOptionsPro('setMaxTokensOpenAI') ? getOptionsPro('setMaxTokensOpenAI') : '640';
                        let getTopPOpenAI = getOptionsPro('setTopPOpenAI') ? getOptionsPro('setTopPOpenAI') : '1';
                        let getFrequencyPenaltyOpenAI = getOptionsPro('setFrequencyPenaltyOpenAI') ? getOptionsPro('setFrequencyPenaltyOpenAI') : '0';
                        let getPresencePenaltyOpenAI = getOptionsPro('setPresencePenaltyOpenAI') ? getOptionsPro('setPresencePenaltyOpenAI') : '0';
                        var data = `{
                                    "model": "${getModelOpenAI}",
                                    "messages": [{"role": "user", "content": ${prompt_text}}],
                                    "temperature": ${getTemperatureOpenAI},
                                    "max_tokens": ${getMaxTokensOpenAI},
                                    "top_p": ${getTopPOpenAI},
                                    "frequency_penalty": ${getFrequencyPenaltyOpenAI},
                                    "presence_penalty": ${getPresencePenaltyOpenAI}
                                }`;
                        let respost_id = randomString(8);
                        let response_bot = `<div id="responseBot_${respost_id}" class="response_bot loading"><div class="loadingio-spinner-pulse"><div class="ldio"><div></div><div></div><div></div></div></div></div>`;
                            container.append(response_bot);
                            container[0].scrollTop = container[0].scrollHeight;
            
                        let responseBox = _parent.find('#responseBot_'+respost_id);
                        
                        var xhr = new XMLHttpRequest();
                            xhr.open("POST", url);
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.setRequestHeader("Authorization", "Bearer "+perfilOpenAI.KEY_USER);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    // console.log(xhr.status);
                                    // console.log(xhr.responseText);
            
                                    open_ai_response = xhr.responseText;
                                    open_ai_response = JSON.parse(open_ai_response);
                                    
                                    let responseText = open_ai_response.choices[0].message.content;
                                        responseText = responseText.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                        btnSendAI.addClass('newLink_confirm').find('i').attr('class','fas fa-paper-plane');
                                        $('#responseBot_'+respost_id).removeClass('loading');
                                        // type code
                                        var i = 0, isTag, text;
                                        (function type() {
                                            var responseBox = $('#responseBot_'+respost_id);
                                                text = responseText.slice(0, ++i);
                                            if (text === responseText) {
                                                let copyResponse = `<div class="copy_response" data-response="${respost_id}" onclick="copyResponseAI(this)" onmouseover="return infraTooltipMostrar('Clique para copiar');" onmouseout="return infraTooltipOcultar();"><a class="newLink"><i class="far fa-copy cinzaColor"></i></a></div>`;
                                                responseBox.prepend(copyResponse).find('.blinker').remove();
                                                return;
                                            }
                                                responseBox.html(text + '<span class="blinker">&#32;</span>');
                                                container[0].scrollTop = container[0].scrollHeight;
                                            var char = text.slice(-1);
                                            if (char === "<") isTag = true;
                                            if (char === ">") isTag = false;
                                            if (isTag) return type();
                                            setTimeout(type, 10);
                                        })();
            
                                } else if (xhr.status >= 400) {
                                    // console.log(xhr.status);
                                    // console.log(xhr.responseText);
                                    // console.log(JSON.parse(xhr.responseText));
                                    open_ai_response = JSON.parse(xhr.responseText);
                                    open_ai_response = typeof open_ai_response !== 'undefined' && open_ai_response !== null ? open_ai_response.error.message : 'Erro inesperado';
                                    console.log(open_ai_response);
                                    responseBox.removeClass('loading').text(open_ai_response);
                                    container[0].scrollTop = container[0].scrollHeight;
                                    btnSendAI.addClass('newLink_confirm').find('i').attr('class','fas fa-paper-plane');
                                }
                            };
                        xhr.send(data);
                    } 
                }
            });
        }
    }
}
function loadBoxAIActions() {
    if (restrictConfigValue('ferramentasia')) {
        perfilOpenAI = localStorageRestorePro('configBasePro_openai');
        perfilOpenAI = (typeof perfilOpenAI !== 'undefined' && perfilOpenAI !== null) ? perfilOpenAI : false;
        if (perfilOpenAI) {
            if (!getOptionsPro('consentimentoIA')) {
                    boxAIConcent();
            } else {
                boxAIActions();
            }
        } else {
            boxAIStoreToken();
        }
    }
}
function boxAIStoreToken() {
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(disclaimerAI)
        .dialog({
            title: 'Intelig\u00EAncia artificial (ChatGPT): Cadastro de Token',
            width: 850,
            open: function() {
                $('#openAI_info').css('white-space','initial');
                $('#openAI_uiElement').addClass('newLink newLink_confirm').find('#openAI_label').css('color','#fff');
                $('#cke_inputSecretKey_textInput').css('width','600px').focus();
                setTimeout(() => { centralizeDialogBox(dialogBoxPro) });
            }
        });
}
function boxAIConcent() {
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(consentAI)
        .dialog({
            title: 'Intelig\u00EAncia artificial (ChatGPT): Consentimento',
            width: 980,
            buttons: [{
                text: 'OK',
                class: 'confirm',
                click: function(event) { 
                    if($('#ciente_disclaimer').is(':checked')) {
                        setOptionsPro('consentimentoIA', true);
                        resetDialogBoxPro('dialogBoxPro');
                        setTimeout(() => {
                            boxAIActions();
                        }, 1000);
                    } else {
                        alert('\u00C9 necess\u00E1rio consentimento antes de prosseguir!');
                    }
                }
            }]
        });
}
function configAI() {
    let getModelOpenAI = getOptionsPro('setModelOpenAI') ? getOptionsPro('setModelOpenAI') : 'gpt-4';
    let getTemperatureOpenAI = getOptionsPro('setTemperatureOpenAI') ? getOptionsPro('setTemperatureOpenAI') : '0.4';
    let getMaxTokensOpenAI = getOptionsPro('setMaxTokensOpenAI') ? getOptionsPro('setMaxTokensOpenAI') : '640';
    let getTopPOpenAI = getOptionsPro('setTopPOpenAI') ? getOptionsPro('setTopPOpenAI') : '1';
    let getFrequencyPenaltyOpenAI = getOptionsPro('setFrequencyPenaltyOpenAI') ? getOptionsPro('setFrequencyPenaltyOpenAI') : '0';
    let getPresencePenaltyOpenAI = getOptionsPro('setPresencePenaltyOpenAI') ? getOptionsPro('setPresencePenaltyOpenAI') : '0';
    var optionsModels = $.map(modelsOpenAI, function(v){
            let model = v[0];
            let selected = (!getModelOpenAI && model == 'gpt-4') || getModelOpenAI == model ? 'selected' : '';
            return `<option ${selected} value="${model}">${model}</option>`;
        });
    var htmlBox =   `<table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="text-align: left;height: 40px;width: 20%;" class="label">
                                <label for="docLoteSelect">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('O modelo que ir\u00E1 gerar a conclus\u00E3o. Alguns modelos s\u00E3o adequados para tarefas de linguagem natural, outros s\u00E3o especializados em c\u00F3digo.');" onmouseout="return infraTooltipOcultar();"></i>
                                    Modelo:
                                </label>
                             </td>
                            <td style="width: 30%;">
                                <select id="configAI_model" style="width: 90%;margin: 0 !important;">${optionsModels}</select>
                            </td>
                            <td style="text-align: left;height: 40px;width: 20%;" class="label">
                                <label for="configAI_temperature">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('Controla a aleatoriedade: a redu\u00E7\u00E3o resulta em conclus\u00F5es menos aleat\u00F3rias. \u00C0 medida que a temperatura se aproxima de zero, o modelo se tornar\u00E1 determin\u00EDstico e repetitivo.');" onmouseout="return infraTooltipOcultar();"></i>
                                    Temperatura:
                                </label>
                             </td>
                            <td style="width: 30%;">
                                <input type="number" value="${getTemperatureOpenAI}" id="configAI_temperature" style="width: 80%;" min="0" max="2" step=".1">
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;height: 40px;" class="label">
                                <label for="configAI_max_tokens">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('O n\u00FAmero m\u00E1ximo de tokens a serem gerados e compartilhados entre o prompt e a conclus\u00E3o. O limite exato varia de acordo com o modelo. (Um token tem aproximadamente 4 caracteres para texto em ingl\u00EAs padr\u00E3o)');" onmouseout="return infraTooltipOcultar();"></i>
                                    Comprimento m\u00E1ximo:
                                </label>
                             </td>
                            <td>
                                <input type="number" value="${getMaxTokensOpenAI}" id="configAI_max_tokens" style="width: 80%;" min="1" max="4095" step="1">
                            </td>
                            <td style="text-align: left;height: 40px;" class="label">
                                <label for="configAI_top_p">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('Controla a diversidade por meio de amostragem nuclear: 0,5 significa que metade de todas as op\u00E7\u00F5es ponderadas por verossimilhan\u00E7a s\u00E3o consideradas.');" onmouseout="return infraTooltipOcultar();"></i>
                                    Parte superior P:
                                </label>
                             </td>
                            <td>
                                <input type="number" value="${getTopPOpenAI}" id="configAI_top_p" style="width: 80%;" min="0" max="1" step=".1">
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;height: 40px;" class="label">
                                <label for="configAI_frequency_penalty">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('Quanto penalizar novos tokens com base na frequ\u00EAncia existente no texto at\u00E9 o momento. Diminuir a probabilidade far\u00E1 o modelo repetir a mesma linha literalmente.');" onmouseout="return infraTooltipOcultar();"></i>
                                    Penalidade de Frequ\u00EAncia:
                                </label>
                             </td>
                            <td>
                                <input type="number" value="${getFrequencyPenaltyOpenAI}" id="configAI_frequency_penalty" style="width: 80%;" min="0" max="2" step=".1">
                            </td>
                            <td style="text-align: left;height: 40px;" class="label">
                                <label for="configAI_presence_penalty">
                                    <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" onmouseover="return infraTooltipMostrar('Quanto penalizar novos tokens com base no fato de eles aparecerem no texto at\u00E9 o momento. Aumenta a probabilidade far\u00E1 o modelo falar sobre novos t\u00F3picos.');" onmouseout="return infraTooltipOcultar();"></i>
                                    Penalidade de Presen\u00E7a:
                                </label>
                             </td>
                            <td>
                                <input type="number" value="${getPresencePenaltyOpenAI}" id="configAI_presence_penalty" style="width: 80%;" min="0" max="2" step=".1">
                            </td>
                        </tr>
                    </table>`;
    resetDialogBoxPro('alertBoxPro');
    alertBoxPro = $('#alertaBoxPro')
        .html(`<div class="alertBoxDiv" style="max-height: 500px;"> ${htmlBox}</span>`)
        .dialog({
            width: 700,
            title: 'Intelig\u00EAncia artificial (ChatGPT): Configura\u00E7\u00F5es Gerais',
            buttons: [{
                text: "Resetar configura\u00E7\u00F5es",
                click: function() {
                    setOptionsPro('setModelOpenAI', 'gpt-4');
                    setOptionsPro('setTemperatureOpenAI', '0.4');
                    setOptionsPro('setMaxTokensOpenAI', '640');
                    setOptionsPro('setTopPOpenAI', '1');
                    setOptionsPro('setFrequencyPenaltyOpenAI', '0');
                    setOptionsPro('setPresencePenaltyOpenAI', '0');
                    resetDialogBoxPro('alertBoxPro');
                }
            },{
                text: "Salvar",
                class: 'ui-state-active',
                click: function() {
                    setOptionsPro('setModelOpenAI', $('#configAI_model').val());
                    setOptionsPro('setTemperatureOpenAI', $('#configAI_temperature').val());
                    setOptionsPro('setMaxTokensOpenAI', $('#configAI_max_tokens').val());
                    setOptionsPro('setTopPOpenAI', $('#configAI_top_p').val());
                    setOptionsPro('setFrequencyPenaltyOpenAI', $('#configAI_frequency_penalty').val());
                    setOptionsPro('setPresencePenaltyOpenAI', $('#configAI_presence_penalty').val());
                    resetDialogBoxPro('alertBoxPro');
                }
            }]
    });
}
function boxAIActions() {
    var htmlBox =   `<div id="response_ai" style="overflow-y: auto;height: 330px;">
                        <div class="welcome">
                            <div class="icon_ia"><i class="far fa-robot cinzaColor"></i></div>
                            Como posso ajud\u00E1-lo hoje?
                        </div>
                    </div>
                    <div id="boxAIActions">
                        <div class="input_prompt">
                            <select id="promptAISelect" class="prompt_type" style="width: 250px;">
                                <option value="resumo">Resuma o seguinte documento:</option>
                                <option value="topico">Crie uma estrutura de t\u00F3picos sobre o seguinte documento:</option>
                                <option value="palavras_chave">Extraia as palavras-chave do seguinte documento:</option>
                            </select>
                            <select id="docAISelect" class="prompt_doc" style="width: 300px;">
                                <option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option>
                            </select>
                            <a class="newLink" id="btnConfigAI" onclick="configAI(this)" style="margin-top: 3px;" onmouseover="return infraTooltipMostrar('Configura\u00E7\u00F5es Gerais');" onmouseout="return infraTooltipOcultar();"><i class="far fa-cog"></i></a>
                            <a class="newLink" id="btnSendAI" onclick="getAIActions(this)" style="float: right;margin-top: 3px;padding-right: 15px;"><i class="fas fa-paper-plane"></i> Enviar</a>
                        </div>
                    </div>`;
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxAI">'+htmlBox+'</div>')
        .dialog({
            title: 'Analisar texto de intelig\u00EAncia artificial (ChatGPT)',
            width: 980,
            height: 450,
            open: function() { 
                updateModelsOpenAI();
                $('#dialogBoxPro').css('position','relative');
                initChosenReplace('box_init', this, true);
                $('#docAISelect_chosen').addClass('chosenLoading');
                $('#response_ai').css('height','calc('+$('#dialogBoxPro').css('height')+' - 70px)');
                getDocsArvore(
                    $('#docAISelect'), 
                    function(select, optionBlank, disableId) {
                        getDocsArvore_fillSelect(select, optionBlank, disableId, false);
                    }, 
                    function() {
                        $("#btnSendAI").addClass('newLink_confirm');
                    }
                );
            },
            close: function() { 
                $('#boxAIActions').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
}
function saveTokenOpenAI(this_) {
    let _this = $(this_);
    let _parent = _this.closest('#openAI_info');
    var token = _parent.find('#cke_inputSecretKey_textInput').val();
        $('#openAI_load').show();
        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }

        var href = window.location.href+'#&acao_pro=set_database&mode=insert&base=openai&token='+token+'&url=https%3A%2F%2Fapi.openai.com%2Fv1%2Fchat%2Fcompletions';
        $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', function(){
            var htmlSucess =    '<div class="alertaAttencionPro dialogBoxDiv" style="font-size: 11pt;line-height: 15pt;color: #616161;">'+
                                '   <i class="fas fa-check-circle verdeColor" style="margin-right: 5px;"></i> '+
                                '   Credenciais carregadas com sucesso! Recarregue a p\u00E1gina.'+
                                '   <a style="user-select: none; margin-left:20px;" onclick="window.location.reload()" title="Recarregar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="openAI_label" id="openAI_uiElement">'+
                                '       <span id="openAI_label" class="cke_dialog_ui_button">Recarregar</span>'+
                                '   </a>';
                                '   </div>'+
            $('#openAI_info').html(htmlSucess);
            if ($('#ifrArvore').length) $('#openAI_uiElement').addClass('newLink newLink_confirm').find('#openAI_label').css('color','#fff');
        });
}