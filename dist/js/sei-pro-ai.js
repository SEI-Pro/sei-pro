$.getScript(URL_SPRO+"js/lib/pdfjs.js");
$.getScript(URL_SPRO+"js/lib/pdf.worker.min.js");
$.getScript(URL_SPRO+"js/lib/tesseract.min.js");

// ÍCONE DA PLATAFORMA CHATGPT (OPENAI)
const iconChatGPT = URL_SPRO + 'icons/menu/chatgpt.svg';

// ÍCONE DA PLATAFORMA GEMINI (GOOGLE)
const iconGemini = URL_SPRO + 'icons/menu/gemini.svg';

// DEFINE A API SPEECHSYNTHESIS DO NAVEGADOR
const synth = window.speechSynthesis;

// FLAG DE CONTROLE DE CARREGAMENTO DO MÓDULO
const loadSEIProAI = true;

// FLAG PARA SALVAR A POSIÇÃO DO CURSOR DO USUÁRIO, PARA INSERIR TEXTO EM #promptAIPersonal
let savedRange = null;

// VARIÁVEL GLOBAL DE CONFIRAÇÕES DAS CREDENCIAIS DE ACESSO À API DA OPENAI
let perfilOpenAI = localStorageRestorePro('configBasePro_openai') ?? false;
    if (perfilOpenAI && typeof perfilOpenAI === "object" && perfilOpenAI.URL_API) {
        perfilOpenAI.URL_API = perfilOpenAI.URL_API
            .replace("v1/chat/completions", "")   // Remove o final
            .replace(/\/+$/, "/");                // Garante que termina com uma só barra
    }

// VARIÁVEL GLOBAL DE CONFIGURAÇÕES DAS CREDENCIAIS DE ACESSO À API DA Gemini
const perfilGemini = localStorageRestorePro('configBasePro_gemini') ?? false;

// VARIÁVEL GLOBAL DE CONFIGURAÇÃO PARA DEFINIR A PLATAFORMA ATUAL DE IA 
let currentPlataform = getOptionsPro('plataformAI_current');
    currentPlataform = !!perfilOpenAI && !perfilGemini ? 'openai' : currentPlataform;
    currentPlataform = !!perfilGemini && !perfilOpenAI ? 'gemini' : currentPlataform;

// VARIÁVEL GLOBAL DE SELEÇÃO DE PERFIL DE CREDENCIAIS DE ACESSO
let perfilPlataform = currentPlataform == 'openai' ? perfilOpenAI : perfilGemini;
    

// MODELOS DISPONÍVEIS DA GEMINI ARMAZENADOS NA MÁQUINA OU PADRÕES PRÉ-DEFINIDOS
let modelsGemini =  (typeof localStorageRestorePro('modelsGemini') !== 'undefined' && localStorageRestorePro('modelsGemini') !== null)
    ? localStorageRestorePro('modelsGemini')
    : [
        ['gemini-pro'],
        ['gemini-pro-vision'], // para entrada com imagem
        ['gemini-2.0-flash-latest'] // caso tenha acesso via Google AI Studio
    ];

// MODELOS DISPONÍVEIS NA API DA OPENAI ARMAZENADOS NA MÁQUINA OU PADRÕES PRÉ-DEFINIDOS
let modelsOpenAI = (typeof localStorageRestorePro('modelsOpenAI') !== 'undefined' && localStorageRestorePro('modelsOpenAI') !== null)
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

let getModelAI = currentPlataform == 'openai' ? getOptionsPro('setModelOpenAI') || 'gpt-4' :  getOptionsPro('setModelGemini') || 'gemini-2.0-flash';

// HISTÓRICO DE CONVERSA COM O MODELO 
const defaultSystemInstruction = `Voc\u00EA \u00E9 um agente que analisa processos administrativos em um \u00F3rg\u00E3o p\u00FAblico (${capitalizeFirstLetter(nomeInstituicao)}), elabora pareceres e auxilia na reda\u00E7\u00E3o de documentos oficiais.`;
const conversationSystem = () => {
    return currentPlataform == 'openai' 
    ? [{ role: 'system', content: defaultSystemInstruction }]
    : [{ role: "model", parts: [{ text: defaultSystemInstruction }] }];
}
let conversationHistory = conversationSystem();
let sendConversationHistory = false;

// FUNÇÃO PARA MODULAR O OBJETO DE INTERAÇÃO DO CHAT, A DEPENDER DA PLATAFORMA
const buildMessage = (role, text) => {
    return currentPlataform === 'openai'
        ? { role, content: text }
        : { role: role === 'assistant' ? 'model' : role, parts: [{ text }] };
}

// FUNÇÃO PARA ADICIONAR A RESPOSTA DO CHAT NO HISTÓRICO DA CONVERSA
const addAssistantReply = (text) => {
    const role = currentPlataform === 'openai' ? 'assistant' : 'model';
    const msg = buildMessage(role, text);
    conversationHistory.push(msg);
}

let stopType = getOptionsPro('setTypingAI') == '' ? true : false;

// HTML SANITIZADO COM AVISO DE USO RESPONSÁVEL
const consentAI = sanitizeHTML(`<table role="presentation" cellspacing="0" border="0" style="width:100%;float:none;" align="left">
    <tbody>
        <tr>
            <td role="presentation" class="cke_dialog_ui_vbox_child">
                <div id="cke_382_uiElement" class="cke_dialog_ui_text editorTextDisclaimer">
                    <p>1. N\u00E3o utilize intelig\u00EAncia artificial para contextos complexos, envolvendo informa\u00E7\u00F5es sigilosas, restritas ou que possa impactar decis\u00F5es cr\u00EDticas.</p>
                    <p>2. \u00C9 importante sempre uma verifica\u00E7\u00E3o humana das respostas geradas automaticamente.</p>
                    <p>3. A assinatura de documentos gerados com o aux\u00EDlio de IA s\u00E3o de inteira resposabilidade do signat\u00E1rio.</p>
                    <p>4. A ferramenta foi alimentada com diferentes conte\u00FAdos da Internet. Quando o contexto n\u00E3o s\u00E3o bem definidos, as respostas poder\u00E3o n\u00E3o ser \u00FAteis e poder\u00E3o levar a tomada de decis\u00E3o equivocada.</p>
                    <p>5. Fique atento \u00E0s suas limita\u00E7\u00F5es para n\u00E3o incorrer em situa\u00E7\u00F5es de erro, quebra de seguran\u00E7a ou quest\u00F5es legais.</p>
                    <p>6. Antes de utilizar a ferramenta, verifique a adequa\u00E7\u00E3o da intelig\u00EAncia artificial ao ato normativo sobre o uso seguro de computa\u00E7\u00E3o em nuvem do seu \u00F3rg\u00E3o.</p>
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
</table>`);

// HTML SANITIZADO COM INSTRUÇÕES DE USO DA API OPENAI
const disclaimerOpenAI = sanitizeHTML(`<div id="plataformAI_info" style="white-space: break-spaces;color: #616161;">
    <div class="alertaAttencionPro dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
        <i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Aproveite todo o potencial da intelig\u00EAncia artificial do <a href="https://chat.openai.com/chat" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">ChatGPT</a> diretamente no editor de documentos do SEI. <br><br><span style="margin-left: 20px;"></span>Siga o passo-a-passo abaixo para cadastrar suas credenciais de acesso:<br><br>
    </div>
    <div class="alertaAttencionPro dialogBoxDiv" style="margin-left:20px;font-size: 11pt;line-height: 12pt;color: #616161;">
        1. Acesse o site da OpenAI (<a href="https://platform.openai.com/" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://platform.openai.com/</a>) e clique em "Sign Up" no canto superior direito da tela.<br><br>
        2. Preencha o formul\u00E1rio de cadastro com seus dados pessoais e crie uma senha.<br>
        Tamb\u00E9m \u00E9 poss\u00EDvel logar com sua conta Google ou Microsoft.<br><br>
        3. Verifique seu e-mail e clique no link de confirma\u00E7\u00E3o enviado pela OpenAI.<br><br>
        4. Insira seu n\u00FAmero de celular para receber um c\u00F3digo de verifica\u00E7\u00E3o por SMS e adicione-o quando solicitado.<br><br>
        5. Ap\u00F3s verificar seu celular, fa\u00E7a login na sua conta OpenAI.<br><br>
        6. Acesse a se\u00E7\u00E3o de "API Keys" no seu painel de controle. Voc\u00EA pode encontr\u00E1-la atrav\u00E9s do menu de navega\u00E7\u00E3o na esquerda.<br><br>
        7. Clique em "Create new secret key" para gerar sua chave de API.<br><br>
        8. Guarde sua chave secreta de API em um local seguro, pois ela s\u00F3 ser\u00E1 exibida uma vez.<br><br>
        9. Para come\u00E7ar a usar sua chave, adicione suas informa\u00E7\u00F5es de pagamento em "Billing" se necess\u00E1rio.<br>
        Consulte as condi\u00E7\u00F5es de precifica\u00E7\u00E3o da plataforma em: <a href="https://platform.openai.com/" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://openai.com/pricing</a><br><br>
        10. Cole-a no campo abaixo:<br><br>
    </div>
    <table role="presentation" class="cke_dialog_ui_hbox">
        <tbody>
            <tr class="cke_dialog_ui_hbox">
                <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px">
                    <input tabindex="3" style="font-size: 1.2em;" placeholder="Insira o valor para a chave secreta" class="cke_dialog_ui_input_text" id="cke_inputSecretKey_textInput" type="password" aria-labelledby="cke_inputSecretKey_label">
                </td>
                <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">
                    <a style="user-select: none;" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel openai_token" role="button" aria-labelledby="plataformAI_label" id="plataformAI_uiElement">
                        <span id="plataformAI_label" class="cke_dialog_ui_button">Salvar</span>
                    </a>
                    <i id="plataformAI_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="plataformAI_alert" style="white-space: break-spaces;margin-top: 10px;font-style: italic; color: #616161;" class="alertaAttencionPro dialogBoxDiv">
        <i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i>${NAMESPACE_SPRO} n\u00E3o fomenta ou recebe financiamento para a utiliza\u00E7\u00E3o dos produtos da OpenAI. Recomenda-se o seu uso meramente did\u00E1tico
    </div>
</div>`);

// HTML SANITIZADO COM INSTRUÇÕES DE USO DA API OPENAI
const disclaimerGemini = sanitizeHTML(`<div id="plataformAI_info" style="white-space: break-spaces;color: #616161;">
    <div class="alertaAttencionPro dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
        <i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Aproveite todo o potencial da intelig\u00EAncia artificial do <a href="https://gemini.google.com/app" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">Gemini</a> diretamente no editor de documentos do SEI. <br><br><span style="margin-left: 20px;"></span>Siga o passo-a-passo abaixo para cadastrar suas credenciais de acesso:<br><br>
    </div>
    <div class="alertaAttencionPro dialogBoxDiv" style="margin-left:20px;font-size: 11pt;line-height: 12pt;color: #616161;">
        1. Acesse o Google AI Studio<br>
        Entre no site <a href="https://aistudio.google.com/app/apikey" class="linkDialog" style="font-style: italic;font-size: 11pt;" target="_blank">https://aistudio.google.com/app/apikey</a>. <br>
        Caso voc\u00EA n\u00E3o possua uma conta, fa\u00E7a seu cadastro utilizando sua conta Google.<br><br>

        2. Crie uma chave de API (Get API Key).<br><br>

        3. Concorde com os termos de uso, clique em "Aceito".<br><br>

        4. Clique no bot\u00E3o superior esquedo "+ Criar chave de API".<br><br>

        5. Na caixa de di\u00E1logo aberta, clique no bot\u00E3o "Copiar".<br><br>

        6. Guarde sua chave de API com seguran\u00E7a<br>
        Copie a chave gerada e armazene-a em local seguro, pois ela ser\u00E1 exibida apenas neste momento.<br>
        \u00C9 importante n\u00E3o compartilhar essa chave publicamente.<br><br>

        10. Cole a chave de API no campo abaixo:<br><br>
    </div>
    <table role="presentation" class="cke_dialog_ui_hbox">
        <tbody>
            <tr class="cke_dialog_ui_hbox">
                <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px">
                    <input tabindex="3" style="font-size: 1.2em;" placeholder="Insira o valor para a chave secreta" class="cke_dialog_ui_input_text" id="cke_inputSecretKey_textInput" type="password" aria-labelledby="cke_inputSecretKey_label">
                </td>
                <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">
                    <a style="user-select: none;" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel gemini_token" role="button" aria-labelledby="plataformAI_label" id="plataformAI_uiElement">
                        <span id="plataformAI_label" class="cke_dialog_ui_button">Salvar</span>
                    </a>
                    <i id="plataformAI_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="plataformAI_alert" style="white-space: break-spaces;margin-top: 10px;font-style: italic; color: #616161;" class="alertaAttencionPro dialogBoxDiv">
        <i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i>${NAMESPACE_SPRO} n\u00E3o fomenta ou recebe financiamento para a utiliza\u00E7\u00E3o dos produtos da Google. Recomenda-se o seu uso meramente did\u00E1tico
    </div>
</div>`);

// FUNÇÃO PARA COPIAR O TEXTO GERADO PELA IA
const copyResponseAI = (this_) => {
    const _this = $(this_);
    const id_response = _this.data('response');
    copyTextWithBR($(`#responseBot_${id_response} .response_bot_content`));
};

// FUNÇÃO PARA CRIAR DOCUMENTO SEI A PARTIR DO TEXTO GERADO PELA IA
const createDocResponseAI = (this_) => {
    const _this = $(this_);
    const id_response = _this.data('response');
    const tiposDocumentos = typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.tiposDocumentos !== 'undefined' && dadosProcessoPro.tiposDocumentos.length ? $.map(dadosProcessoPro.tiposDocumentos, function(v){ return '<option value="'+v.id+'">'+v.name+'</option>' }).join('') : false;
    const htmlResponse = $(`#responseBot_${id_response} .response_bot_content`).html();
    const $htmlResponse = $(`<div>${htmlResponse}</div>`);
    const contentDocument = $htmlResponse.find('p').addClass('Texto_Justificado_Recuo_Primeira_Linha').end().html();

    if (tiposDocumentos) {

        const htmlBox = `
                <div class="dialogBoxDiv seiProForm">
                    <div style="font-size: 10pt;margin: 1em;">
                        Selecione o tipo de documento
                    </div>
                    <div class="dialogBoxDiv seiProForm">
                        <select id="docTipoSelect"><option value="">&nbsp;</option>${tiposDocumentos}</select>
                    </div>
                </div>
            `;
    
            resetDialogBoxPro('alertBoxPro');
            const sanitizedHTML = sanitizeHTML(htmlBox);
        
            alertBoxPro = $('#alertaBoxPro')
                .html(`<div class="alertBoxDiv" style="max-height: 500px;">${sanitizedHTML}</div>`)
                .dialog({
                    width: 450,
                    title: 'Criar documento SEI',
                    open: function(){
                        initChosenReplace('box_init', this, true);
                        $('#docTipoSelect').trigger('chosen:updated').trigger('chosen:activate');

                        $(document).off('keypress', '#docTipoSelect_chosen').on('keypress', '#docTipoSelect_chosen', function(event) {
                            if (event.which == 13) $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click')
                        });
                    },
                    buttons: [{
                        text: "Criar",
                        class: 'confirm ui-state-active',
                        click: async function() {
                            loadingButtonConfirm(true);
                            const id_tipo_documento = $('#docTipoSelect').val();
                            const nomeDocAutomatico = $('#docTipoSelect option:selected').text();
                            let id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
                                id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
                                sessionStorageStorePro('dadosDocAutomatico',contentDocument);
                                sessionStorageStorePro('nomeDocAutomatico',nomeDocAutomatico);
                                setNewDoc(id_procedimento, id_tipo_documento, true, false);

                                resetDialogBoxPro('alertBoxPro');
                                alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Gerando documento');

                        }
                    }]
                });
    } else {
        _this.find('i').attr('class', 'far fa-times-circle vermelhoColor');
    }
};

// FUNÇÃO PARA ADICIONAR O TEXTO GERADO PELA IA NO DOCUMENTO ABERTO
const addDocResponseAI = (this_) => {
    const _this = $(this_);
    const id_response = _this.data('response');
    const htmlResponse = $(`#responseBot_${id_response} .response_bot_content`).html();
    if (frmEditor.length) {
        const pElement = $(oEditor.getSelection().getStartElement().$).closest('p');
        const pClass = oEditor ? pElement.attr('class') : 'Texto_Alinhado_Esquerda';
        const $htmlResponse = $(`<div>${htmlResponse}</div>`);
        const responseStyled = $htmlResponse.find('p').addClass(pClass).end().html();
        if (pElement.length) {
            oEditor.focus();
            oEditor.fire('saveSnapshot');
            iframeEditor.find(pElement).after(responseStyled);
            oEditor.fire('saveSnapshot');
        }
    }
};

// FUNÇÃO PARA ARMAZENAR O TEXTO EXTRAÍDO DO PROCESSO NA SESSÃO DO USUÁRIO
const getSessionTextProcesso = (num_processo_format) => {
    const num_processo = onlyNumber(num_processo_format);
    if (sessionStorage.getItem(`fulltext_${num_processo}`)) {
        return sessionStorage.getItem(`fulltext_${num_processo}`);
    } else {
        return false;
    }
}

// FUNÇÃO PARA OBTER O CONTEÚDO DE TODO O PROCESSO
    // OBTÉM O URL DO FORMULÁRIO DE GERAR PDF DO PROCESSO
    const getUrlFormPDF = async (data_protocolo) => {
        if (data_protocolo.num_processo == getNumProcesso() && !frmEditor.length) {
            return jmespath.search(linksArvore,"[?name==`Gerar Arquivo PDF do Processo`] | [0].url");
        } else {
            const htmlArvore = await getHtmlArvore(data_protocolo.id_procedimento);
            const match = htmlArvore.match(/href="(controlador\.php\?acao=procedimento_gerar_pdf[^"]*)"/);
            const linkPDF = match ? match[1] : false;
            return linkPDF;
        }
    };

    // OBTÉM O HTML DA ÁRVORE DO PROCESSO
    const getHtmlArvore = async (id_procedimento = false, id_documento = false, num_processo = false) => {
        const urlProcesso = id_documento 
            ? `${url_host}?acao=procedimento_trabalhar&id_procedimento=${id_procedimento}&id_documento=${id_documento}`
            : `${url_host}?acao=procedimento_trabalhar&id_procedimento=${id_procedimento}`;
        const htmlProc = !id_procedimento ? await getContentProcSEIByProtocolo(num_processo) : await $.ajax({ url: urlProcesso });
        const $htmlProc = $(htmlProc);
        const urlArvore = $htmlProc.find("#ifrArvore").attr('src');
        const htmlArvore = await $.ajax({ url: urlArvore });
        const matchExpandirPastas = htmlArvore.match(/https?:\/\/[^"]*abrir_pastas=1[^"]*|controlador\.php\?[^"]*abrir_pastas=1[^"]*/g);
        const urlBtnExpandirPastas = matchExpandirPastas ? matchExpandirPastas[0] : false;
        const htmlArvoreFull = urlBtnExpandirPastas ? await $.ajax({ url: urlBtnExpandirPastas }) : htmlArvore;
        return htmlArvoreFull;
    };

    // ADICIONA LINKS DA ÁRVORE NA VARIÁVEL GLOBAL DATADOCS
    const appendDocAISelect = async (id_procedimento = false, num_processo = false) => {
        try {
            const htmlArvore = await getHtmlArvore(id_procedimento, false, num_processo);
            const docAISelect = $('#docAISelect');
            const displayNumProcesso = num_processo ? num_processo : getNumProcesso();
            const htmlTextSelect = frmEditor.length 
                ? `
                <option value="Texto selecionado" data-id_documento="text_selected" data-num_processo="${displayNumProcesso}" data-id_procedimento="">Texto selecionado</option>
                <option value="Todo o documento" data-id_documento="text_doc" data-num_processo="${displayNumProcesso}" data-id_procedimento="">Todo o documento</option>
                ` 
                : '';

            if (!htmlArvore) {
                console.error('Erro: HTML vazio retornado de urlArvore', urlArvore);
                return false;
            }

            if (!id_procedimento) {
                const match_id_procedimento = htmlArvore.match(/Nos\[0\] = new infraArvoreNo\("PROCESSO","(\d+)"/);
                if (match_id_procedimento) {
                    id_procedimento = match_id_procedimento[1];
                }
            }

            dataDocs = setDataDocs(htmlArvore, id_procedimento);

            getDocsArvore_fillSelect(docAISelect, false, false, false, true);

            $("#btnSendAI").addClass('newLink_confirm');

            docAISelect
                .prepend(`
                    <option value="outro_processo">Pesquisar em outro processo...</option>
                    <option value="Todo o processo (${displayNumProcesso})" data-id_documento="all" data-num_processo="${displayNumProcesso}" data-id_procedimento="${id_procedimento}">Todo o processo (${displayNumProcesso})</option>
                    ${htmlTextSelect}
                `)
                .trigger('chosen:updated');

            $('.suggestions').fadeIn();
            getHistoryDialog('check');

            if (frmEditor.length) $('#docAISelect_chosen').addClass('prompt_editor_sei');

                $('#promptAISelect').val(getOptionsPro('currentPromptAISelect') ?? 'resume').trigger('chosen:updated').trigger('change');
                
            return true;
        } catch (err) {
            console.error('Erro ao obter link do processo:', err);
            return false;
        }
    };

    // OBTÉM O LINK DE DOCUMENTO COM ERROS TRATADOS
    const getLinkDoc = async (data_protocolo) => {
        try {
            const htmlArvore = await getHtmlArvore(data_protocolo.id_procedimento, data_protocolo.id_documento);
            if (!htmlArvore) {
                console.error('Erro: HTML vazio retornado de urlArvore', urlArvore);
                appendBotMessageError(`Erro: HTML vazio retornado de urlArvore`);
                return false;
            }

            const linkDocs = setDataDocs(htmlArvore, data_protocolo.id_procedimento);
            if (!Array.isArray(linkDocs) || linkDocs.length === 0) {
                console.error('Erro: Nenhum link de documento encontrado em linkDocs.');
                appendBotMessageError(`Erro: Nenhum link de documento encontrado.`);
                return false;
            }

            const selectedDoc = jmespath.search(linkDocs, `[?id_documento=="${data_protocolo.id_documento}"] || [0]`) ?? false;

            return selectedDoc || false;
        } catch (err) {
            console.error('Erro ao obter link do documento:', err);
            appendBotMessageError(`Erro ao obter link do documento: ${JSON.stringify(err)}`);
            return false;
        }
    };

    // OBTÉM O URL DO FORMULÁRIO DE GERAR PDF DO PROCESSO
    const getParamUrlFormPDF = async (data_protocolo) => {
        try {
            const urlFormPDF = await getUrlFormPDF(data_protocolo);
            const htmlDoc = await $.ajax({ url: urlFormPDF });
            if (!htmlDoc) {
                console.error('Erro: HTML vazio retornado de urlProcesso', urlProcesso);
                appendBotMessageError(`Erro: HTML vazio retornado ao pesquisar o documento`);
                return false;
            }
            const $htmlDoc = $(htmlDoc);
            const form = $htmlDoc.find('#frmProcedimentoPdf');
            const hrefForm = form.attr('action');
            let param = {};
                form.find("input[type=hidden]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                form.find("input[type=radio]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('rdo') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                form.find("input[type=checkbox]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('chk') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
            param.hdnFlagGerar = 1;
            if (isNewSEI) param.rdoTipo = "T";

            return {action: hrefForm, param: param};
        } catch (err) {
            console.error('Erro ao obter conte\u00FAdo integral do processo:', err);
            appendBotMessageError(`Erro ao obter conte\u00FAdo integral do processo: ${JSON.stringify(err)}`);
            return false;
        }
    };
    // OBTEM O URL PARA BAIXAR O PDF 
    const getUrlDownloadPDF = async (data) => {
        try {
            var xhr = new XMLHttpRequest();
            var htmlDoc = await $.ajax({
                method: 'POST',
                data: data.param,
                url: data.action,
                xhr: function() {
                    return xhr;
                },
            });
            if (!htmlDoc) {
                console.error('Erro: HTML vazio ao baixar o conte\u00FAdo integral do processo', data.action);
                appendBotMessageError(`'Erro: HTML vazio ao baixar o conte\u00FAdo integral do processo`);
                return false;
            }
            const regex = isNewSEI 
            ? /['"]([^'"]*acao=exibir_arquivo[^'"]*)['"]/
            : /window\.open\(['"]([^'"]+)['"]\)/;
            const match = htmlDoc.match(regex);
            
            if (match)
                return match[1];
            else
                return false;
        } catch (err) {
            console.error('Erro ao baixar o conte\u00FAdo integral do processo:', err);
            appendBotMessageError(`Erro ao baixar o conte\u00FAdo integral do processo: ${JSON.stringify(err)}`);
            return false;
        }
    };
    // CONVERTE O PDF EM TEXTO PURO
    const getContentPDF = async (urlPDF) => {
        try {
            const contentDoc = await $.get({
                url: urlPDF,
                method: 'GET',
                xhrFields: {
                    responseType: 'arraybuffer'
                }
            });
            if (!contentDoc) {
                console.error('Erro: Falha ao processar o texto do documento', urlPDF);
                appendBotMessageError(`Erro: Falha ao processar o texto do documento`);
                return false;
            }
            const pdfData = new Uint8Array(contentDoc);

            const getText = await pdfjsLib.getDocument({ data: pdfData }).promise.then(async (pdfDoc) => {
                let content_text = '';
                let emptyPages = 0;
                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                    const page = await pdfDoc.getPage(pageNum);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str).join(' ');

                    if (!strings.trim()) {
                        emptyPages++;
                    }
                    
                    content_text += strings + '\n\n';
                }

                // Se todas ou quase todas as páginas estão vazias, provavelmente é digitalizado sem OCR
                const isScannedWithoutOCR = emptyPages === pdfDoc.numPages;

                if (isScannedWithoutOCR) {
                    const content_text_ocr = extractTextFromScannedPDF(urlPDF);
                    return content_text_ocr;
                } else {
                    return content_text;
                }
            });
            return getText;
        } catch (err) {
            console.error('Erro ao obter link do documento:', err);
            appendBotMessageError(`Erro ao obter link do documento: ${JSON.stringify(err)}`);
            return false;
        }
    };
    // OBTÉM O CONTEÚDO DE UM DOCUMENTO DIGITALIZADO E NÃO OCERIZADO EM TEXTO 
    const extractTextFromScannedPDF = async (urlPDF) => {
        try {
            const pdfData = await $.get({
                url: urlPDF,
                method: 'GET',
                xhrFields: {
                    responseType: 'arraybuffer'
                }
            });
    
            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            let finalText = '';
    
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
    
                // DEFINE RESOLUÇÃO DO CANVAS (AUMENTA A QUALIDADE PARA MELHOR OCR)
                const viewport = page.getViewport({ scale: 2.0 });
    
                // CRIA UM CANVAS PARA RENDERIZAR A PÁGINA
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
    
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
    
                await page.render(renderContext).promise;
    
                // CONVERTE O CANVAS EM DATA URL (IMAGEM BASE64)
                const dataURL = canvas.toDataURL('image/png');
    
                // EXTRAI TEXTO COM TESSERACT.JS
                const { data: { text } } = await Tesseract.recognize(dataURL, 'por', {
                    logger: m => console.log(`[OCR p\u00E1gina ${pageNum}]`, m)
                });
    
                finalText += `\n\n[P\u00E1gina ${pageNum}]\n${text}`;
            }
    
            return finalText;
    
        } catch (err) {
            console.error('Erro ao processar PDF com OCR:', err);
            appendBotMessageError(`Erro ao processar PDF com OCR: ${err.message}`);
            return false;
        }
    };

    // OBTEM O CONTEÚDO DE UM LINK DE DOCUMENTO
    const getSelectedDoc = async (data_protocolo) => {
        let selectedDoc = dataDocs.find(doc => doc.id_documento.toString() === data_protocolo.id_documento.toString());
            selectedDoc = !selectedDoc ? await getLinkDoc(data_protocolo) : selectedDoc;
        return selectedDoc;
    };

    // OBTEM O CONTEÚDO DE UM LINK DE DOCUMENTO
    const getContentDoc = async (selectedDoc, respost_id, data_protocolo) => {
        
        // SE O DOCUMENTO NÃO É DO PROCESSO ATUAL, BUSCA NO PROCESSO DE ORIGEM
        selectedDoc = !selectedDoc ? await getLinkDoc(data_protocolo) : selectedDoc;

        loadResponseBoxHTML(respost_id, 'Consultando documento...');
        if (selectedDoc.externo) {
            return await getContentPDF(selectedDoc.src);
        } else {    
            const contentDoc = await $.ajax({
                url: selectedDoc.src,
                method: 'GET',
                xhrFields: {
                    responseType: 'text'
                }
            });

            let content_text = contentDoc.substring(contentDoc.indexOf('<body>'), contentDoc.lastIndexOf('</body>'));
                content_text = content_text ? $(content_text).text() : false;
                content_text = content_text ? content_text.replace(/p\.[^{]+?\{[^}]+?\}\s*/g, '') : false;
            return content_text;
        }
    };

    // FUNÇÃO PARA EXTRAIR O TEXTO PURO DE TODO PROCESSO, PASSO A PASSO
    const getAllTextProcesso = async (data_protocolo, respost_id) => {
        loadResponseBoxHTML(respost_id, 'Obtendo link do processo...');
        const paramUrlFormPDF = await getParamUrlFormPDF(data_protocolo);
        loadResponseBoxHTML(respost_id, 'Baixando documentos do processo...');
        const urlDownloadPDF = await getUrlDownloadPDF(paramUrlFormPDF);
        loadResponseBoxHTML(respost_id, 'Compilando texto do processo...');
        const contentPDF = await getContentPDF(urlDownloadPDF);
        return contentPDF;
    };

    const makeFooterPrompt = async (data_protocolo, respost_id) => {
        const input_prompt = $('#promptAIPersonal');
        let prompt_footer = '';
        if (data_protocolo.type == 'personalizado' && !data_protocolo.send) {
            const elements = input_prompt.find('.prompt_ref_doc');
            for (const v of elements) {
                const data_input = $(v).data();
                const prompt_f = await getFooterPrompt(data_input, respost_id);
                prompt_footer += `
                ${prompt_f}
                `;
            }
        } else {
            prompt_footer = await getFooterPrompt(data_protocolo, respost_id);
        }
        return prompt_footer;
    };


    const getFooterPrompt = async (data_protocolo, respost_id) => {
        const num_processo = data_protocolo.num_processo;
        let prompt_footer = '';
        if (data_protocolo.id_documento == 'all') {
            const contet_text_session = getSessionTextProcesso(num_processo);
            const content_doc = contet_text_session ? contet_text_session : await getAllTextProcesso(data_protocolo, respost_id);
            const name_doc = `Processo SEI n\u00BA ${num_processo}:`;

            if (!contet_text_session) sessionStorage.setItem(`fulltext_${onlyNumber(num_processo)}`,content_doc);
            
            prompt_footer = `
                ${name_doc}

                ${content_doc}`;
        } else if (data_protocolo.id_documento == 'text_selected') {

            const content_doc = extrairTextoComNumeracao(getSelectedHtmlFromCKEditor());

            if (content_doc == '' || !content_doc) { 
                appendBotMessageError(`Nenhum texto selecionado`);
                return false;
            }
            
            prompt_footer = `
                Texto selecionado: 

                ${content_doc}`;
        } else if (data_protocolo.id_documento == 'text_doc') {

            const content_doc = getAllTextEditor(true);

            if (content_doc == '' || !content_doc) { 
                appendBotMessageError(`Nenhum texto encontrado`);
                return false;
            }
            
            prompt_footer = `
                Todo o documento: 

                ${content_doc}`;
        } else {
            loadResponseBoxHTML(respost_id, 'Obtendo link do processo...');
            const selectedDoc = await getSelectedDoc(data_protocolo);
            loadResponseBoxHTML(respost_id, 'Baixando documento do processo...');
            const content_doc = await getContentDoc(selectedDoc, respost_id, data_protocolo);
            const name_doc = `Documento SEI ${selectedDoc.nome}:`;

            prompt_footer = `
                ${name_doc}

                ${content_doc}`;
        }
        return prompt_footer;
    };

// FUNÇÃO PARA OBTER A RESPOSTA DA PLATAFORMA DE IA
    // FUNÇÃO PARA PREPARAR A CAIXA DE DIÁLOGO E O PROMPT
    const initAI = async (this_, set_protocolo = false) => {
        const respost_id = randomString(8);
        const _this = $(this_);
        const _parent = _this.closest('.ui-dialog');
        const container = _parent.find('#response_ai');
        const btnSendAI = _parent.find('#btnSendAI');
        const num_processo = getNumProcesso();
        var prompt_text = '';

        const selectDocAi = _parent.find('#docAISelect');
        const selectDocAiOption = selectDocAi.find('option:selected');
        let data_protocolo = selectDocAiOption.data() ?? false;
            data_protocolo = set_protocolo ? set_protocolo : data_protocolo;

        const selectPrompt = _parent.find('#promptAISelect');
        const inputPrompt = _parent.find('#promptAIPersonal').text();
        const selectPromptVal = selectPrompt.val();
        let selectPromptText = selectPromptVal === 'personalizado' ? inputPrompt : selectPrompt.find('option:selected').text();
            selectPromptText = set_protocolo ? _this.text().trim() : selectPromptText;
        let selectDocAiText = selectDocAiOption.text();
            selectDocAiText = set_protocolo && set_protocolo.id_documento == 'all' ? `"Todo o processo"` : `"${selectDocAiText}"`;
            selectDocAiText = selectPromptVal === 'personalizado' ? '' : selectDocAiText;
        let type = selectPromptVal ?? false;
            type = set_protocolo ? set_protocolo.type : type;

        if (selectPromptVal === 'personalizado') data_protocolo.type = 'personalizado';

        // GERA CAIXA DE DIÁLOGO DO USUÁRIO
        const response_user = sanitizeHTML(`<div class="response_user">${selectPromptText} ${selectDocAiText}</div>`);
            // container.find('.welcome').remove();
            container.append(response_user);
            container[0].scrollTop = container[0].scrollHeight;
            getHistoryDialog('push',response_user);

        // ADICIONA LOAD NO BOTÃO DE ENVIO
        btnSendAI.removeClass('newLink_confirm').find('i').attr('class','fas fa-spin fa-spinner');

        const prompt_footer = await makeFooterPrompt(data_protocolo, respost_id);

            prompt_text = type == 'resume' 
                ? `
                    O texto abaixo \u00E9 um processo administrativo.
                    Resuma seu conte\u00FAdo${data_protocolo.id_documento == 'all' ? ', detalhadamente' : ''}.

                    ${prompt_footer}
                `
                : prompt_text;
            
            prompt_text = type == 'dados_sensiveis' 
                ? `
                    Encontre dados sens\u00EDveis no processo abaixo, de acordo com a LGPD. 
                    Dados de empresas, como nome, raz\u00E3o socual, endere\u00E7o, CNPJ e s\u00F3cios n\u00E3o s\u00E3o protegidos pela LGPD.
                    Caso n\u00E3o encontre, apenas diga: N\u00E3o foram encontrados dados sens\u00EDveis no processo "${num_processo}"
                    Caso encontre, cite o nome do documento e depois liste os dados sens\u00EDveis encontrados, objetivamente.

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'sugira_encaminhamento' 
                ? `
                    O texto abaixo \u00E9 um processo administrativo.
                    Sugira um encaminhamento baseado no atual est\u00E1gio do processo.

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'palavras_chave' 
                ? `
                    Extraia as palavras-chave do seguinte texto:

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'topico' 
                ? `
                    Crie uma estrutura de t\u00F3picos sobre o seguinte texto: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'linguagem_simples' 
                ? `
                    Reformule em linguagem simples o seguinte texto: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'base_legal' 
                ? `
                    Descubra a base legal do tema abaixo: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'traduza' 
                ? `
                    Traduza para o portugu\u00EAs o texto abaixo: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'analise_critica' 
                ? `
                    Fa\u00E7a uma an\u00E1lise cr\u00EDtica sobre o tema abaixo: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'converte_ata' 
                ? `
                    Converta em uma ata de reuni\u00E3o o texto abaixo: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'reescreva' 
                ? `
                    Reescreva o texto a seguir, mantendo o sentido original: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'amplie' 
                ? `
                    Reescreva e amplie o texto a seguir, em voz ativa, com corre\u00E7\u00F5es gramaticais, citando as fontes e adicinando coes\u00E3o \u00E0s ora\u00E7\u00F5es: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'erros_gramaticais' 
                ? `
                    Encontre os erros gramaticais no texto abaixo, citando o trecho com erro e sua sugest\u00E3o de corre\u00E7\u00E3o: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'crie_parecer' 
                ? `
                    O texto abaixo \u00E9 um processo administrativo.
                    Crie um Parecer t\u00E9cnico detalhado, cite fontes e legisla\u00E7\u00E3o, traga argumentos a favor e contr\u00E1rios sobre o tema abaixo: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'discorra' 
                ? `
                    O texto abaixo \u00E9 um processo administrativo.
                    Discorra sobre o tema abaixo, pesquisando na internet se poss\u00EDvel, citando fontes e base legal: 

                    ${prompt_footer}
                ` 
                : prompt_text;

            prompt_text = type == 'personalizado' 
                ? `
                    ${inputPrompt}

                    ${prompt_footer}
                ` 
                : prompt_text;

        getResponseAI(prompt_text, respost_id);
    };

    // OBTEM RESPOSTA DA PLATAFORMA DE IA
    const getResponseAI = async (prompt_text, respost_id = randomString(8)) => {
        const container = $('#response_ai');
        const iconChat = currentPlataform == 'openai' ? iconChatGPT : iconGemini;
        const htmlIconChat = `<img src="${iconChat}" style="width: 30px;border-radius: 5px;position: absolute;top: -3px;left: -50px;">`;
        const responseText = await sendAI(prompt_text, respost_id);
        const responseBox = $(`#responseBot_${respost_id}`);
        const btnSendAI = $('#btnSendAI');
        const htmlAddDoc = frmEditor.length 
        ? `
            <div class="add_doc_response_ai" data-tooltip="Adicionar texto no documento" data-response="${respost_id}">
                <a class="newLink"><i class="far fa-share-all fa-rotate-90"></i></a>
            </div>
            `
        : '';
        const htmlCreatDoc = !frmEditor.length 
        ? `
            <div class="create_doc_response_ai" data-tooltip="Criar documento SEI" data-response="${respost_id}">
                <a class="newLink"><i class="far fa-file-check"></i></a>
            </div>
            `
        : '';
        const actionsResponse = `
            ${htmlIconChat}
            <div class="copy_response_ai" data-tooltip="Copiar texto" data-response="${respost_id}">
                <a class="newLink"><i class="far fa-copy"></i></a>
            </div>
            <div class="speech_response_ai" data-tooltip="Ouvir em voz alta" data-response="${respost_id}">
                <a class="newLink"><i class="far fa-volume-down"></i></a>
            </div>
            ${htmlAddDoc}
            ${htmlCreatDoc}
            `;

            responseBox.removeClass('loading');
            btnSendAI.addClass('newLink_confirm').find('i').attr('class','fas fa-paper-plane');
            botProIdea();

        // ANIMAÇÃO DE TEXTO DIGITANDO
        let i = 0, isTag = false, text;
        (function type() {
            text = responseText.slice(0, ++i);
            if (i > 2000) stopType = true;
            if (text === responseText || stopType) {
                responseBox.html(sanitizeHTML(`${actionsResponse}<span class='response_bot_content'>${markdownToHTML(stopType ? responseText : text)}</span>`));
                scrollToElement(container, responseBox);
                initFunctionsChat();
                getHistoryDialog('push',responseBox[0].outerHTML);
                return;
            }
            responseBox.html(sanitizeHTML(markdownToHTML(`${htmlIconChat}<span class='response_bot_content'>${text}</span><span class="blinker">&#32;</span>`)));

            container[0].scrollTop = container[0].scrollHeight;
            const char = text.slice(-1);
            if (char === "<") isTag = true;
            if (char === ">") isTag = false;
            if (isTag) return type();
            setTimeout(type, 10);
        })();
    };

    // GERA DIÁLOGO DE ANÁLISE DO BOT
    const loadResponseBoxHTML = (respost_id, preload) => {
        const container = $('#response_ai');    
        const iconChat = currentPlataform == 'openai' ? iconChatGPT : iconGemini;
        const htmlIconChat = `<img src="${iconChat}" style="width: 30px;border-radius: 5px;position: absolute;top: -3px;left: -50px;">`;
        const htmlResponseBox = `
            <div id="responseBot_${respost_id}" class="response_bot response_${currentPlataform} loading" data-preload="${preload}">
                ${htmlIconChat}
                <div class="loadingio-spinner-pulse">
                    <div class="ldio">
                        <div></div><div></div><div></div>
                    </div>
                </div>
            </div>`;
    
        container.find(`#responseBot_${respost_id}`).remove().end().append(sanitizeHTML(htmlResponseBox));
        container[0].scrollTop = container[0].scrollHeight;
    };

    // ENVIA REQUISIÇÃO A PLATAFORMA DE IA
    const sendAI = async (prompt_text, respost_id) => {
        const model = currentPlataform == 'openai'
            ? getOptionsPro('setModelOpenAI') || 'gpt-4'
            : getOptionsPro('setModelGemini') || 'gemini-2.0-flash';

        const beta = getOptionsPro('setBetaModelsAI') == 'checked' ? 'beta' : '';
    
        const url = currentPlataform == 'openai'
            ? perfilPlataform.URL_API + `v1/chat/completions`
            : perfilPlataform.URL_API + `v1${beta}/models/${model}:generateContent?key=${perfilPlataform.KEY_USER}`;
    
        const data = getDataBodyAI(JSON.stringify(prompt_text));
        const container = $('#response_ai');
        
        loadResponseBoxHTML(respost_id, 'Obtendo resposta...');

        const responseBox = $(`#responseBot_${respost_id}`);
    
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (currentPlataform == 'openai') {
                xhr.setRequestHeader('Authorization', `Bearer ${perfilPlataform.KEY_USER}`);
            }
    
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            let responseText = JSON.parse(xhr.responseText);
                                responseText = currentPlataform == 'openai'
                                    ? responseText.choices[0].message.content
                                    : responseText.candidates[0].content.parts[0].text;
                                responseText = checkDownloadResponse(responseText);
                                responseText = responseText.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
                                responseText = `<p>${responseText}</p>`;
                            
                            resolve(responseText);
                        } catch (e) {
                            appendBotMessageError(`Erro ao processar a resposta da IA: ${JSON.stringify(e)}`);
                            reject('Erro ao processar a resposta da IA');
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            const errorMsg = error?.error?.message ?? 'Erro inesperado';
                            responseBox.removeClass('loading').text(errorMsg);
                            container[0].scrollTop = container[0].scrollHeight;
                            console.error(errorMsg);
                            appendBotMessageError(`Erro ao enviar sua mensagem: ${errorMsg}`);
                            reject(errorMsg);
                        } catch (e) {
                            appendBotMessageError(`Erro inesperado: ${JSON.stringify(e)}`);
                            reject('Erro inesperado');
                        }
                    }
                }
            };
            xhr.send(data);
        });
    };

    // ADICIONA DIÁLOGO DO CHAT EM ARRAY NA SESSÃO DO USUÁRIO, PARA SER RECUPERADO POSTERIORMENTE NO HISTÓRICO
    const getHistoryDialog = (mode = 'push', html = '') => {
        const historyDialogAI = sessionStorage.getItem('historyDialogAI') ?? false;
        let historyDialogArray = historyDialogAI ? JSON.parse(historyDialogAI) : [];
        if (mode == 'push') {
            historyDialogArray.push(html);
            sessionStorage.setItem('historyDialogAI', JSON.stringify(historyDialogArray));
        } else if (mode == 'restore') {
            $('#response_ai .response_user, #response_ai .response_bot').remove();
            $('#historyDialogAI').after(sanitizeHTML(historyDialogArray.join(''))).remove();
            initFunctionsChat();
        } else if (mode == 'check' && historyDialogArray.length) {
            $('.suggestions').after(`<div id="historyDialogAI"><i class="fas fa-history" style="color: #666;"></i> Ver Hist\u00F3rico</div>`);
        }
    };

    // FUNÇÕES GERAIS APÓS A RESPOSTA DA PLATAFORMA
    const initFunctionsChat = () => {
        
        // DELEGAÇÃO DE EVENTO PARA COPIAR RESPOSTAS
        $(document).off('click', '.add_doc_response_ai').on('click', '.add_doc_response_ai', function(event) {
            event.preventDefault();
            addDocResponseAI(this);
        });
        // DELEGAÇÃO DE EVENTO PARA COPIAR RESPOSTAS
        $(document).off('click', '.create_doc_response_ai').on('click', '.create_doc_response_ai', function(event) {
            event.preventDefault();
            createDocResponseAI(this);
        });
        
        // DELEGAÇÃO DE EVENTO PARA COPIAR RESPOSTAS
        $(document).off('click', '.copy_response_ai').on('click', '.copy_response_ai', function(event) {
            event.preventDefault();
            copyResponseAI(this);
        });

        // DELEGAÇÃO DE EVENTO PARA LER RESPOSTA EM VOZ ALTA
        $(document).off('dblclick', '.copy_response_ai').on('dblclick', '.copy_response_ai', function(event) {
            event.preventDefault();
            // CANCELA A LEITURA EM VOZ ALTA
            synth.cancel();
        });

        // DELEGAÇÃO DE EVENTO PARA LER RESPOSTA EM VOZ ALTA
        $(document).off('click', '.speech_response_ai').on('click', '.speech_response_ai', function(event) {
            event.preventDefault();
            const _this = $(this);
            
            // SELECIONA O TEXTO A SER LIDO
            const text_speech = _this.closest('.response_bot').text().trim();

            if (synth.speaking) {
                // EVITA SOBREPOSIÇÃO DE VOZES
                synth.cancel();
            } else {
                let utterance = new SpeechSynthesisUtterance(text_speech);
                    utterance.lang = 'pt-BR'; // Define o idioma para português do Brasil
                    utterance.rate = 1.2;       // Velocidade da fala (1 é normal)
                    utterance.pitch = 0.8;      // Tom da fala (1 é normal)

                // EVENTOS
                utterance.onstart = () => {
                    _this.find('i').attr('class', 'far fa-volume-up azulColor');
                };

                utterance.onend = () => {
                    _this.find('i').attr('class', 'far fa-volume-down');
                };
                
                utterance.onerror = (e) => {
                    if (e.error == 'interrupted') 
                        _this.find('i').attr('class', 'far fa-stop-circle laranjaColor');
                    else
                        _this.find('i').attr('class', 'far fa-times-circle vermelhoColor');
                    console.error("Erro na fala:", e);
                };
        
                synth.speak(utterance);
            }
        });
    };
    
    const checkDownloadResponse = (responseText) => {
        const dateTime = moment().format('YYYY-MM-DD-HH-mm-ss');
    
        // EXPRESSÕES REGULARES PARA CADA FORMATO SUPORTADO
        const formats = [
            { ext: 'csv', mime: 'text/csv;charset=utf-8', regex: /```csv\s*([\s\S]*?)\s*```/i },
            { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', regex: /```(?:excel|xlsx)\s*([\s\S]*?)\s*```/i },
            { ext: 'json', mime: 'application/json;charset=utf-8', regex: /```json\s*([\s\S]*?)\s*```/i },
            { ext: 'tsv', mime: 'text/tab-separated-values;charset=utf-8', regex: /```tsv\s*([\s\S]*?)\s*```/i },
            { ext: 'yaml', mime: 'application/x-yaml;charset=utf-8', regex: /```(?:yaml|yml)\s*([\s\S]*?)\s*```/i },
            { ext: 'xml', mime: 'application/xml;charset=utf-8', regex: /```xml\s*([\s\S]*?)\s*```/i },
            // CASO PDF BASE64 ENCAPSULADO (extra para IA que retorna arquivos PDF codificados)
            { ext: 'pdf', mime: 'application/pdf', regex: /```pdf\s*base64\s*([\s\S]*?)\s*```/i, rawBase64: true },
        ];
    
        for (const { ext, mime, regex, rawBase64 } of formats) {
            const match = regex.exec(responseText);
            if (match) {
                const rawContent = match[1];
                const content = rawBase64 ? rawContent : btoa(unescape(encodeURIComponent(rawContent)));
                const dataUrl = `data:${mime};base64,${content}`;
                const filename = `arquivoAI_SEIPro_${dateTime}.${ext}`;
    
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
    
                return `Arquivo ${ext.toUpperCase()} baixado (${filename}). Verifique sua pasta de downloads.`;
            }
        }
    
        // CASO NÃO SEJA NENHUM DOS FORMATOS
        return responseText;
    };

    // FUNÇÃO PARA GERAR MENSAGEM DE ERRO NO CHAT
    const appendBotMessageError = (error_text) => {
        const container = $('#response_ai');
        const respost_id = randomString(8);
        const iconChat = currentPlataform == 'openai' ? iconChatGPT : iconGemini;
        const htmlIconChat = `<img src="${iconChat}" style="width: 30px;border-radius: 5px;position: absolute;top: -3px;left: -50px;">`;
        const response_bot = `
            <div id="responseBot_${respost_id}" class="response_bot response_${currentPlataform} loading">
                ${htmlIconChat}
                <span class='response_bot_content'> 
                    <p>${error_text}</p>
                </span>
            </div>`;
            container.append(sanitizeHTML(response_bot));
            container[0].scrollTop = container[0].scrollHeight;
    };

    // COMPILA OBJETO DATA PARA ENVIO NO CORPO DA REQUISIÇÃO DA PLATAFORMA 
    const getDataBodyAI = (prompt_text) => {
        const advancedConfigs = getOptionsPro('setAdvancedConfigs') == 'checked' ? true : false;
        const model = currentPlataform == 'openai' ? getOptionsPro('setModelOpenAI') || 'gpt-4' :  getOptionsPro('setModelGemini') || 'gemini-2.0-flash';
        const temperature = getOptionsPro('setTemperatureAI') || '0.4';
        const maxTokens = getOptionsPro('setMaxTokenAI') || '6400';
        const topP = getOptionsPro('setTopPAI') || '1';
        const frequencyPenalty = getOptionsPro('setFrequencyPenaltyAI') || '0';
        const presencePenalty = getOptionsPro('setPresencePenaltyAI') || '0';
        const contentSystemInstruction = getOptionsPro('setSystemInstructionAI') || defaultSystemInstruction;
        
        const systemInstruction = currentPlataform == 'openai'
            ? { role: 'system', content: contentSystemInstruction }
            : { role: 'user', parts: [{ text: contentSystemInstruction }] };
    
        const contentMessage = currentPlataform == 'openai'
            ? [systemInstruction, { role: 'user', content: JSON.parse(prompt_text) }]
            : [systemInstruction, { role: 'user', parts: [{ text: JSON.parse(prompt_text) }] }];

        let message = sendConversationHistory
            ? conversationHistory
            : contentMessage;

        const dataAdvanced = currentPlataform == 'openai' 
            ? JSON.stringify({
                model,
                messages: message,
                temperature: parseFloat(temperature),
                max_tokens: parseInt(maxTokens),
                top_p: parseFloat(topP),
                frequency_penalty: parseFloat(frequencyPenalty),
                presence_penalty: parseFloat(presencePenalty)
            })
            : JSON.stringify({
                contents: message,
                generationConfig: {
                    temperature: parseFloat(temperature),
                    topP: parseFloat(topP),
                    frequencyPenalty: parseFloat(frequencyPenalty),
                    presencePenalty: parseFloat(presencePenalty),
                    maxOutputTokens: parseInt(maxTokens)
                }
            });

        const dataSimply = currentPlataform == 'openai' 
            ? JSON.stringify({
                model,
                messages: message
            })
            : JSON.stringify({
                contents: message
            });
        return advancedConfigs ? dataAdvanced : dataSimply;
    }

    // função para substituir campos dinâmicos em valores relativos ao processo
    const replaceDynamicFieldsPrompt = () => {
        const inputPrompt = $('#promptAIPersonal');
        const arrayTags = uniqPro(getHashTagsPro(inputPrompt.text().replace(/\u00A0/gm, " ")));
        let dadosTags = [];
        let count = 0;

        const tagProcValue = (value) => {
            const hash_doc = randomString(8);
            return (value == 'processo') 
                ?
            `<span class="prompt_ref_doc doc_${hash_doc}" data-id_documento="all" data-id_procedimento="${getIdProcedimento()}" data-num_processo="${getNumProcesso()}" contenteditable="false">Todo o processo (${getNumProcesso()})</span>` : false;
        };

        const tagDocValue = (value) => {
            let return_ = value;
            const hash_doc = randomString(8);
            let docValue = '';
            let docs = dadosProcessoPro.listDocumentos;
                docs = typeof docs === 'undefined' ? dadosProcessoPro.listDocumentosAssinados : docs;
            let i = parseInt(value.replace(/[^0-9\.]+/g, ''));
                i = (value.indexOf('-') !== -1) ? (i*-1) : i;
                i = i-1;

            if (value.indexOf('+') !== -1 || value.indexOf('-') !== -1) {
                let indexDoc = 0;
                let indexCurrent = false;
                $.each(docs, function(i, v) { 
                    if (v.id_protocolo == getParamsUrlPro(window.location.href).id_documento) { 
                        indexCurrent = i;
                        return indexDoc; 
                    } indexDoc++; 
                });
                let iDoc = indexDoc+(i+1);
                    iDoc = (docs.length <= iDoc) ? (docs.length-1) : iDoc;
                    iDoc = (value.indexOf('-') !== -1 && value.split('-')[1] == 'ultimo') ? (docs.length-1) : iDoc;
                    iDoc = (value.indexOf('-') !== -1 && value.split('-')[1] == 'atual') ? indexCurrent : iDoc;
                docValue = docs[iDoc];
            } else if (hasNumber(value)) {
                docValue = docs[i];
            }
            return_ = `<span class="prompt_ref_doc doc_${hash_doc}" data-num_processo="${docValue.num_processo ?? false}" data-nr_sei="${docValue.nr_sei ?? false}" data-id_procedimento="${docValue.id_protocolo ?? false}" data-id_documento="${docValue.id_documento ?? false}" contenteditable="false">${docValue.nome_documento ?? docValue.documento } (${docValue.nr_sei})</span>`;
            return return_;
        };

        $.each(arrayTags, function (i, value) {
            const _value = value;
            const underline = (value.indexOf('_') !== -1 && $.inArray(_value, dadosTags) === -1) ? '_'+value.split('_')[1] : '';
                value = (value.indexOf('_') !== -1) ? value.split('_')[0] : value;
                value = ($.inArray(_value, dadosTags) !== -1) ? _value : value;
            const hashTag = (value.indexOf('+') !== -1) ? '#'+(value.replace('+', '\\+')) : '#'+value;
            let fieldSpan = tagProcValue(value) ? tagProcValue(value) : value;
                fieldSpan = (value.indexOf('+') !== -1 || value.indexOf('-') !== -1 || (hasNumber(value) && $.inArray(_value, dadosTags) === -1) ) ? tagDocValue(value): fieldSpan;
                fieldSpan = fieldSpan+'&nbsp;';
            
            inputPrompt.html(inputPrompt.html().replace(new RegExp(hashTag+underline, "i"), function(){ count++; return fieldSpan }));
        });
    };

// CAIXAS DE DIÁLOGO
    // FUNÇÃO PARA ABRIR AÇÕES DA IA
    const loadBoxAIActions = () => {
        if (restrictConfigValue('ferramentasia')) {
            if (perfilOpenAI || perfilGemini) {
                if (!getOptionsPro('consentimentoIA')) {
                    boxAIConcent();
                } else {
                    boxAIActions();
                }
            } else {
                // boxAIStoreToken();
                boxSelectPlataformAI();
            }
        }
    };

    // FUNÇÃO PARA EXIBIR SELEÇÃO DE PLATAFORMA DE IA
    const boxSelectPlataformAI = () => {

        const htmlBox = sanitizeHTML(`<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <i class="fas fa-info-circle azulColor" style="margin-right: 5px;"></i> Selecione a <b>Plataformas de Intelig\u00EAncia Artificial</b> de sua prefer\u00EAncia<br><br>
            <table role="presentation" class="cke_dialog_ui_hbox" style="width: 100%;">
                <tbody>
                    <tr class="cke_dialog_ui_hbox">
                        <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:10px 0; text-align:center;">
                            <a style="user-select: none;padding: 0.6em 1em !important;font-size: 1em;" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_ok newLink newLink_confirm" role="button" id="selectPlataformAI_openai">
                                <img src="${iconChatGPT}" style="width: 30px;vertical-align: middle;margin: 0 10px 0 0;background-color: #fff;border-radius: 5px;"><span id="selectPlataformAI_openai_label" style="color:#fff" class="cke_dialog_ui_button">ChatGPT (OpenAI)</span>
                            </a>
                        </td>
                        <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:10px 0; text-align:center;">
                            <a style="user-select: none;padding: 0.6em 1em !important;font-size: 1em;" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_ok newLink newLink_confirm" role="button" id="selectPlataformAI_gemini">
                                <img src="${iconGemini}" style="width: 30px;vertical-align: middle;margin: 0 10px 0 0;background-color: #fff;border-radius: 5px;"><span id="selectPlataformAI_gemini_label" style="color:#fff" class="cke_dialog_ui_button">Gemini (Google)</span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`);

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title: 'Sele\u00E7\u00E3o de Plataformas de Intelig\u00EAncia Artificial',
                width: 850,
                open: () => {

                    // DELEGAÇÃO DE EVENTOS PARA ELEMENTOS DINÂMICOS
                    $(document).off('click', '#selectPlataformAI_gemini').on('click', '#selectPlataformAI_gemini', (event) => {
                        event.preventDefault();
                        boxAIStoreToken('gemini');
                    });

                    $(document).off('click', '#selectPlataformAI_openai').on('click', '#selectPlataformAI_openai', (event) => {
                        event.preventDefault();
                        boxAIStoreToken('openai');
                    });
                    setTimeout(() => { centralizeDialogBox(dialogBoxPro); });
                }
            });
    };

    // FUNÇÃO PARA EXIBIR BOX DE TOKEN DA IA
    const boxAIStoreToken = (plataform = 'openai') => {
        const disclaimerHtml = plataform == 'gemini' ? disclaimerGemini : disclaimerOpenAI;

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(disclaimerHtml)
            .dialog({
                title: 'Intelig\u00EAncia artificial: Cadastro de Token',
                width: 850,
                open: () => {

                    // DELEGAÇÃO DE EVENTOS PARA ELEMENTOS DINÂMICOS
                    $(document).off('click', '#plataformAI_uiElement').on('click', '#plataformAI_uiElement', (event) => {
                        event.preventDefault();
                        saveTokenOpenAI(event.currentTarget);
                    });

                    $('#plataformAI_info').css('white-space','initial');
                    $('#plataformAI_uiElement').addClass('newLink newLink_confirm').find('#plataformAI_label').css({'color':'#fff', 'padding':'5px 10px'});
                    $('#cke_inputSecretKey_textInput').css('width','600px').focus();
                    setTimeout(() => { centralizeDialogBox(dialogBoxPro); });
                }
            });
    };

    // ABRE A CAIXA DE DIÁLOGO DE CONSENTIMENTO PARA USO DE IA
    const boxAIConcent = () => {
        resetDialogBoxPro('dialogBoxPro');

        const sanitizedConsent = sanitizeHTML(consentAI);

        dialogBoxPro = $('#dialogBoxPro')
            .html(sanitizedConsent)
            .dialog({
                title: 'Intelig\u00EAncia artificial: Consentimento',
                width: 980,
                buttons: [{
                    text: 'OK',
                    class: 'confirm',
                    click: (event) => {
                        if ($('#ciente_disclaimer').is(':checked')) {
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
    };

    // Adiciona animação de ideia do botpro 
    const botProIdea = () => {
        adicionarVideoWebM({webmSrc: URL_SPRO+'icons/menu/botpro_idea.webm', largura: 200, id: 'botPro', alvo: '.icon_ia' });
        setTimeout(() => {
            adicionarVideoWebM({webmSrc: URL_SPRO+'icons/menu/botpro.webm', largura: 200, id: 'botPro', alvo: '.icon_ia' });
        }, 4500);
    }

    // ABRE A CAIXA DE CONFIGURAÇÕES DO MODELO DE IA
    const configAI = () => {
        const getTemperatureAI = getOptionsPro('setTemperatureAI') || '0.4';
        const getMaxTokensAI = getOptionsPro('setMaxTokenAI') || '6400';
        const getTopPAI = getOptionsPro('setTopPAI') || '1';
        const getFrequencyPenaltyAI = getOptionsPro('setFrequencyPenaltyAI') || '0';
        const getPresencePenaltyAI = getOptionsPro('setPresencePenaltyAI') || '0';
        const getTypingAI = getOptionsPro('setTypingAI');
        const getBetaModels = getOptionsPro('setBetaModelsAI');
        const getAdvancedConfigs = getOptionsPro('setAdvancedConfigs');
        const getSystemInstructionAI = getOptionsPro('setSystemInstructionAI') || defaultSystemInstruction;

        const htmlBox = `
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td class="label">
                        <label for="configAI_typing_box">
                            Anima\u00E7\u00E3o de<br> texto digitando
                        </label>
                    </td>
                    <td>
                        <div class="onoffswitch" style="display: inline-block;transform: scale(0.7);">
                            <input id="configAI_typing_box" type="checkbox" name="onoffswitch" class="resume_doc onoffswitch-checkbox" ${getTypingAI}>
                            <label class="onoff-switch-label" for="configAI_typing_box"></label>
                        </div>
                    </td>
                    <td class="label">
                        <label for="configAI_betamodels">
                            Listar modelos beta
                        </label>
                    </td>
                    <td>
                        <div class="onoffswitch" style="display: inline-block;transform: scale(0.7);">
                            <input id="configAI_betamodels" type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" ${getBetaModels}>
                            <label class="onoff-switch-label" for="configAI_betamodels"></label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left;height: 40px;width: 20%;" class="label">
                        <label for="docLoteSelect">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="O modelo que ir\u00E1 gerar a conclus\u00E3o. Alguns modelos s\u00E3o adequados para tarefas de linguagem natural, outros s\u00E3o especializados em c\u00F3digo."></i>
                            Modelo:
                        </label>
                    </td>
                    <td style="width: 30%;">
                        <select id="configAI_model" style="width: 90%;margin: 0 !important;">${optionsModels()}</select>
                    </td>
                    <td style="text-align: left;height: 40px;width: 20%;" class="label">
                        <label for="configAI_advancedconfigs">
                            Configura\u00E7\u00F5es avan\u00E7adas
                        </label>
                    </td>
                    <td style="width: 30%;">
                        <div class="onoffswitch" style="display: inline-block;transform: scale(0.7);">
                            <input id="configAI_advancedconfigs" type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" ${getAdvancedConfigs}>
                            <label class="onoff-switch-label" for="configAI_advancedconfigs"></label>
                        </div>
                    </td>
                </tr>
                <tr class="configAI_advancedconfigs" ${getAdvancedConfigs == 'checked' ? '' : 'style="display:none;"'}>
                    <td class="label">
                        <label for="configAI_system_instruction">
                            Instru\u00E7\u00E3o do sistema:
                        </label>
                    </td>
                    <td colspan="3">
                        <textarea id="configAI_system_instruction" style="width: 93%;" rows="3">${getSystemInstructionAI}</textarea>
                    </td>
                </tr>
                <tr class="configAI_advancedconfigs" ${getAdvancedConfigs == 'checked' ? '' : 'style="display:none;"'}>
                    <td style="text-align: left;height: 40px;width: 20%;" class="label">
                        <label for="configAI_temperature">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="Controla a aleatoriedade: a redu\u00E7\u00E3o resulta em conclus\u00F5es menos aleat\u00F3rias. \u00C0 medida que a temperatura se aproxima de zero, o modelo se tornar\u00E1 determin\u00EDstico e repetitivo."></i>
                            Temperatura:
                        </label>
                    </td>
                    <td style="width: 30%;">
                        <input type="number" value="${getTemperatureAI}" id="configAI_temperature" style="width: 80%;" min="0" max="2" step=".1">
                    </td>
                    <td style="text-align: left;height: 40px;width: 20%;" class="label">
                        <label for="configAI_max_tokens">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="O n\u00FAmero m\u00E1ximo de tokens a serem gerados e compartilhados entre o prompt e a conclus\u00E3o. O limite exato varia de acordo com o modelo. (Um token tem aproximadamente 4 caracteres para texto em ingl\u00EAs padr\u00E3o)"></i>
                            Comprimento m\u00E1ximo:
                        </label>
                    </td>
                    <td style="width: 30%;">
                        <input type="number" value="${getMaxTokensAI}" id="configAI_max_tokens" style="width: 80%;" min="1" max="4095" step="1">
                    </td>
                </tr>
                <tr class="configAI_advancedconfigs" ${getAdvancedConfigs == 'checked' ? '' : 'style="display:none;"'}>
                    <td class="label">
                        <label for="configAI_top_p">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="Controla a diversidade por meio de amostragem nuclear: 0,5 significa que metade de todas as op\u00E7\u00F5es ponderadas por verossimilhan\u00E7a s\u00E3o consideradas."></i>
                            Parte superior P:
                        </label>
                    </td>
                    <td>
                        <input type="number" value="${getTopPAI}" id="configAI_top_p" style="width: 80%;" min="0" max="1" step=".1">
                    </td>
                    <td class="label">
                        <label for="configAI_frequency_penalty">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="Quanto penalizar novos tokens com base na frequ\u00EAncia existente no texto at\u00E9 o momento. Diminuir a probabilidade far\u00E1 o modelo repetir a mesma linha literalmente."></i>
                            Penalidade de Frequ\u00EAncia:
                        </label>
                    </td>
                    <td>
                        <input type="number" value="${getFrequencyPenaltyAI}" id="configAI_frequency_penalty" style="width: 80%;" min="0" max="2" step=".1">
                    </td>
                </tr>
                <tr class="configAI_advancedconfigs" ${getAdvancedConfigs == 'checked' ? '' : 'style="display:none;"'}>
                    <td class="label">
                        <label for="configAI_presence_penalty">
                            <i class="iconPopup iconSwitch fas fa-info-circle cinzaColor" style="float: right;" 
                            data-tooltip="Quanto penalizar novos tokens com base no fato de eles aparecerem no texto at\u00E9 o momento. Aumenta a probabilidade far\u00E1 o modelo falar sobre novos t\u00F3picos."></i>
                            Penalidade de Presen\u00E7a:
                        </label>
                    </td>
                    <td>
                        <input type="number" value="${getPresencePenaltyAI}" id="configAI_presence_penalty" style="width: 80%;" min="0" max="2" step=".1">
                    </td>
                </tr>
            </table>`;

        resetDialogBoxPro('alertBoxPro');
        const sanitizedHTML = sanitizeHTML(htmlBox);

        alertBoxPro = $('#alertaBoxPro')
            .html(`<div class="alertBoxDiv" style="max-height: 500px;">${sanitizedHTML}</div>`)
            .dialog({
                width: 700,
                title: 'Intelig\u00EAncia artificial: Configura\u00E7\u00F5es Gerais '+(currentPlataform == 'openai' ? '(ChatGPT)' : '(Gemini)'),
                open: function () {
                    
                    // DELEGAÇÃO DE EVENTO ONCLICK PARA SELETOR DE CONFIGURAÇÕES AVANÇADAS
                    $(document).off('change', '#configAI_advancedconfigs').on('change', '#configAI_advancedconfigs', function(event) {
                        event.preventDefault();
                        if ($(this).is(':checked')) {
                            $('.configAI_advancedconfigs').show();
                        } else {
                            $('.configAI_advancedconfigs').hide();
                        }
                    }); 

                },
                buttons: [{
                    text: 'Resetar configura\u00E7\u00F5es',
                    click: () => {
                        if (currentPlataform == 'openai')
                            setOptionsPro('setModelOpenAI', 'gpt-4');
                        else 
                            setOptionsPro('setModelGemini', 'gemini-2.0-flash');

                        setOptionsPro('setTemperatureAI', '0.4');
                        setOptionsPro('setMaxTokenAI', '640');
                        setOptionsPro('setTopPAI', '1');
                        setOptionsPro('setFrequencyPenaltyAI', '0');
                        setOptionsPro('setPresencePenaltyAI', '0');
                        setOptionsPro('setTypingAI', 'checked');
                        setOptionsPro('setBetaModelsAI', '');
                        setOptionsPro('setAdvancedConfigs', '');
                        setOptionsPro('setSystemInstructionAI', defaultSystemInstruction);
                        resetDialogBoxPro('alertBoxPro');
                        stopType = false;
                    }
                }, {
                    text: 'Apagar chave de API',
                    click: () => {
                        confirmaBoxPro('Tem certeza que deseja apagar chave de API?', function(){
                            saveTokenOpenAI(this, 'remove', currentPlataform);
                            localStorageRemovePro('configBasePro_'+currentPlataform);
                        }, 'Apagar');
                    }
                }, {
                    text: 'Salvar',
                    class: 'ui-state-active',
                    click: () => {
                        if (currentPlataform == 'openai')
                            setOptionsPro('setModelOpenAI', $('#configAI_model').val());
                        else
                            setOptionsPro('setModelGemini', $('#configAI_model').val());

                        setOptionsPro('setTemperatureAI', $('#configAI_temperature').val());
                        setOptionsPro('setMaxTokenAI', $('#configAI_max_tokens').val());
                        setOptionsPro('setTopPAI', $('#configAI_top_p').val());
                        setOptionsPro('setFrequencyPenaltyAI', $('#configAI_frequency_penalty').val());
                        setOptionsPro('setPresencePenaltyAI', $('#configAI_presence_penalty').val());
                        setOptionsPro('setTypingAI', $('#configAI_typing_box').is(':checked') ? 'checked' : '');
                        setOptionsPro('setBetaModelsAI', $('#configAI_betamodels').is(':checked') ? 'checked' : '');
                        setOptionsPro('setAdvancedConfigs', $('#configAI_advancedconfigs').is(':checked') ? 'checked' : '');
                        setOptionsPro('setSystemInstructionAI', $('#configAI_system_instruction').val());
                        stopType = $('#configAI_typing_box').is(':checked') ? false : true;
                        resetDialogBoxPro('alertBoxPro');
                        updateModelsAI();
                    }
                }]
            });
    };

    // FUNÇÃO PRINCIPAL PARA AS AÇÕES DA CAIXA DE IA
    const boxAIActions = () => {

        const bodyHeight = $('body').height();

        // ÍCONE PARA A PLATAFORMA DE IA PRINCIPAL
        const iconMainPlataform = getOptionsPro('plataformAI_current') == 'gemini' ? iconGemini : iconChatGPT;
        
        // ÍCONE PARA A PLATAFORMA DE IA SECUNDÁRIA
        const iconSecondaryPlataform = getOptionsPro('plataformAI_current') == 'gemini' ? iconChatGPT : iconGemini;

        // BOTÃO PARA TROCA DE PLATAFORMAS
        const btnChangePlataform = perfilOpenAI && perfilGemini
            ? `<a class="newLink" id="btnChangeSelectedAI" data-tooltip="Alterar plataforma ativa" style="position: absolute;right: 205px;top: 15px;"><i class="fas fa-exchange-alt"></i></a>`
            : '';

        // CONTEÚDO DO BOTÃO DE SELEÇÃO DE PLATAFORMA PRINCIPAL
        const btnMainPlataform = `<a class="newLink" id="btnMainPlataform" style="position: absolute;right: 150px;top: 10px;background-color: #fff;border-radius: 5px;padding: 0 20px 0 5px;">
                                        <img src="${iconMainPlataform}" style="width: 30px;background-color: #fff;border-radius: 5px;">
                                        <i class="fas fa-circle animate-flicker fa-xs verdeColor" style="position: absolute; right: 0px; top: 5px; transform: scale(0.6);"></i>
                                    </a>`;
        // CONTEÚDO DO BOTÃO DE SELEÇÃO DE PLATAFORMA SECUNDÁRIA
        const btnSecondPlataform = `<a class="newLink" id="btnSecondPlataform" ${!btnChangePlataform ? `data-tooltip="Configurar plataforma alternativa"` : ''} data-plataform="${getOptionsPro('plataformAI_current') == 'gemini' ? 'openai' : 'gemini'}" style="position: absolute;right: 240px;top: 10px;background-color: #fff;border-radius: 5px;padding: 0 5px; opacity: ${btnChangePlataform ? 1 : 0.5};">
                                        <img src="${iconSecondaryPlataform}" style="width: 30px;background-color: #fff;border-radius: 5px;">
                                    </a>`;
        // CONTEÚDO HTML QUE SERÁ INSERIDO
        const htmlBox = `
            <div id="response_ai" style="overflow-y: auto; calc(${bodyHeight-300}px - 110px)">
                <div class="welcome">
                    <div class="icon_ia"></div>
                    Ol\u00E1! Como posso ajud\u00E1-lo hoje?
                </div>
                <div class="suggestions" style="display:none;">
                    <div class="suggestion_actions" data-type="resume" data-send="true" data-id_documento="all" data-id_procedimento="${getIdProcedimento()}" data-num_processo="${getNumProcesso()}">
                        <i class="fas fa-magic azulColor" style="margin-bottom: 1em; display:block;"></i> Resumir todo o processo
                    </div>
                    <div class="suggestion_actions" data-type="sugira_encaminhamento" data-id_documento="all" data-send="true" data-id_procedimento="${getIdProcedimento()}" data-num_processo="${getNumProcesso()}">
                        <i class="fas fa-magic azulColor" style="margin-bottom: 1em; display:block;"></i> Sugerir um encaminhamento
                    </div>
                    ${
                        frmEditor.length ? `
                        <div class="suggestion_actions" data-type="erros_gramaticais" data-send="true" data-id_documento="text_doc" data-id_procedimento="${getIdProcedimento()}" data-num_processo="${getNumProcesso()}">
                            <i class="fas fa-magic azulColor" style="margin-bottom: 1em; display:block;"></i> Localizar erros gramaticais
                        </div>
                        ` : ``
                    }
                    <div class="suggestion_actions" data-type="dados_sensiveis" data-send="true" data-id_documento="all" data-id_procedimento="${getIdProcedimento()}" data-num_processo="${getNumProcesso()}">
                        <i class="fas fa-magic azulColor" style="margin-bottom: 1em; display:block;"></i> Encontrar dados sens\u00EDveis (LGPD)
                    </div>
                </div>
            </div>
            <div id="boxAIActions">
                <div class="input_prompt">
                    <select id="promptAISelect" class="prompt_type" style="width: 250px;">
                        <option value="personalizado">(...) Fa\u00E7a seu pr\u00F3prio prompt...</option>
                        <option value="resume">Resuma:</option>
                        <option value="dados_sensiveis">Encontre dados sens\u00EDveis, de acordo com a LGPD</option>
                        <option value="discorra">Discorra sobre:</option>
                        <option value="erros_gramaticais">Encontre erros gramaticais:</option>
                        <option value="amplie">Amplie o conte\u00FAdo</option>
                        <option value="linguagem_simples">Reformule em linguagem simples</option>
                        <option value="sugira_encaminhamento">Sugira um encaminhamento:</option>
                        <option value="crie_parecer">Crie um parecer t\u00E9cnico</option>
                        <option value="base_legal">Descubra a base legal do tema</option>
                        <option value="analise_critica">Fa\u00E7a uma an\u00E1lise cr\u00EDtica sobre o tema</option>
                        <option value="palavras_chave">Extraia as palavras-chave:</option>
                        <option value="traduza">Traduza para o portugu\u00EAs</option>
                        <option value="topico">Crie uma estrutura de t\u00F3picos:</option>
                        <option value="converte_ata">Converta em uma ata de reuni\u00E3o</option>
                    </select>
                    <a class="newLink" id="btnReturnSelectPromptAI" style="margin-top: 3px; display:none;"><i class="fas fa-chevron-left"></i></a>
                    <div id="promptAIPersonal" style="display:none;"></div>
                    <div id="favoritePromptAI" style="display:none;"><i class="far fa-star azulColor"></i></div>
                    <select id="docAISelect" class="prompt_doc" style="width: 300px;">
                        <option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados...</option>
                    </select>
                    <a class="newLink" id="btnConfigAI" data-tooltip="Configura\u00E7\u00F5es Gerais" style="margin-top: 3px;"><i class="fas fa-cog"></i></a>
                    ${btnMainPlataform}
                    ${btnChangePlataform}
                    ${btnSecondPlataform}
                    <a class="newLink" id="btnSendAI" style="float: right;padding: 8px 15px 7px 5px;"><i class="fas fa-paper-plane"></i> Enviar <sup style="opacity: 0.7;">(${navigator.platform.startsWith('Mac') ? '\u2318' : 'Ctr'} \u23CE)</sup></a>
                </div>
            </div>`;

        resetDialogBoxPro('dialogBoxPro');
        const sanitizedHtml = sanitizeHTML(htmlBox);
        
        dialogBoxPro = $('#dialogBoxPro')
            .html(`<div class="dialogBoxAI">${sanitizedHtml}</div>`)
            .dialog({
                title: 'Analisar texto por intelig\u00EAncia artificial '+(currentPlataform == 'openai' ? '(ChatGPT)' : '(Gemini)'),
                width: 980,
                height: bodyHeight-200,
                resizable: true,
                resize: function(event, ui) {
                    resizeBoxAIActions();
                },
                open: function() {

                    // DELEGAÇÃO DE EVENTOS PARA TOOLTIP (MOUSEOVER E MOUSEOUT)
                    $(document).on('mouseover', '[data-tooltip]', function () {
                        const msg = $(this).data('tooltip');
                        if (typeof infraTooltipMostrar === 'function') infraTooltipMostrar(msg, this);
                    });

                    $(document).on('mouseout', '[data-tooltip]', function () {
                        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
                    });

                    // DELEGAÇÃO DE EVENTOS PARA ONCLICK E AFINS
                    $(document).off('click', '#btnConfigAI').on('click', '#btnConfigAI', function(event) {
                        event.preventDefault();
                        configAI(this);
                        $('#configAI_model').html(sanitizeHTML(optionsModels()));
                    });

                    $(document).off('click', '.suggestion_actions').on('click', '.suggestion_actions', function(event) {
                        event.preventDefault();
                        if ($(this).data('send')) {
                            initAI(this, $(this).data());
                        } else {
                            const indexFav = $(this).data('index');
                            const favoriteArray = JSON.parse(localStorageRestorePro('favoritePromptAI')) ?? [];
                            const favoriteHtml = favoriteArray[indexFav] ?? false;
                            if (favoriteHtml) {
                                $('#promptAISelect').val('personalizado').trigger('change');
                                $('#promptAIPersonal').html(favoriteHtml).focus().trigger('change');
                                replaceDynamicFieldsPrompt();
                            }
                        }
                    });
                
                    $(document).off('click', '#btnSendAI').on('click', '#btnSendAI', function(event) {
                        event.preventDefault();
                        initAI(this);
                    });
                
                    $(document).off('click', '#btnCancelResumeDocs').on('click', '#btnCancelResumeDocs', function(event) {
                        event.preventDefault();
                        cancelLoopGetAIAction();
                    });

                    $(document).off('click', '#btnReturnSelectPromptAI').on('click', '#btnReturnSelectPromptAI', function(event) {
                        event.preventDefault();
                        $('#promptAISelect_chosen, #docAISelect_chosen').show();
                        $('#btnReturnSelectPromptAI').hide();
                        $('#promptAIPersonal').hide();
                        $('#favoritePromptAI').hide();
                        $('#promptAISelect').val('resume').trigger('chosen:updated').trigger('change');
                        $('#boxAIActions').removeAttr('style');
                        $('#docAISelect_chosen').removeClass('prompt_personal').css('width',300);
                        $('#docAISelect').find('option[value="add_documento"]').remove().end().find(`option:eq(${frmEditor.length ? 4 : 3})`).prop('selected', true).end().trigger('chosen:updated');
                        resizeBoxAIActions();
                    });
                
                    $(document).off('click', '#btnChangeSelectedAI').on('click', '#btnChangeSelectedAI', function(event) {
                        event.preventDefault();
                        if (getOptionsPro('plataformAI_current') == 'gemini') {
                            currentPlataform = 'openai';
                            perfilPlataform = perfilOpenAI;
                            getModelAI = getOptionsPro('setModelOpenAI') || 'gpt-4';
                            $('#btnSecondPlataform').attr('data-plataform', 'gemini').find('img').attr('src', iconGemini);
                            $('#btnMainPlataform').find('img').attr('src', iconChatGPT);
                            setOptionsPro('plataformAI_current', 'openai');
                        } else {
                            currentPlataform = 'gemini';
                            perfilPlataform = perfilGemini;
                            getModelAI = getOptionsPro('setModelGemini') || 'gemini-2.0-flash';
                            $('#btnSecondPlataform').attr('data-plataform', 'openai').find('img').attr('src', iconChatGPT);
                            $('#btnMainPlataform').find('img').attr('src', iconGemini);
                            setOptionsPro('plataformAI_current', 'gemini');
                        }
                        conversationHistory = conversationSystem();
                        updateModelsAI();
                        $('#configAI_model').html(sanitizeHTML(optionsModels()));
                        dialogBoxPro.dialog('option', 'title', 'Analisar texto por intelig\u00EAncia artificial '+(currentPlataform == 'openai' ? '(ChatGPT)' : '(Gemini)'));
                    });
                
                    $(document).off('click', '#btnSecondPlataform').on('click', '#btnSecondPlataform', function(event) {
                        event.preventDefault();
                        const plataform = $(this).attr('data-plataform');
                        if (!btnChangePlataform) boxAIStoreToken(plataform);
                    });
                
                    $(document).on('change', '#promptAISelect', function() {
                        const _this = $(this);
                        const _value = _this.val();
                        if (_value == 'personalizado') {
                            $('#promptAISelect, #promptAISelect_chosen').hide();
                            $('#btnReturnSelectPromptAI').show();
                            $('#favoritePromptAI').show();
                            $('#promptAIPersonal').prop('contenteditable',true).show().focus();
                            $('#docAISelect').find('option[value="add_documento"]').remove().end().prepend(`<option value="add_documento">Selecione um documento para adicionar no prompt...</option>`).val('add_documento').trigger('chosen:updated');
                            $('#docAISelect_chosen').addClass('prompt_personal').css('width', 500);
                            resizeBoxAIActions();

                            $(document).off('change', '#docAISelect').on('change', '#docAISelect', function(event) {
                                if ($(this).val() == 'outro_processo') {
                                    boxAISearchProcesso();
                                } else {
                                    if ($('#promptAIPersonal').is(':visible')) {
                                        const hash_doc = randomString(8);
                                        const docSelected = $(this).find('option:selected');
                                        const data = docSelected.data() ?? false;
                                        const nomeDoc = docSelected.text().trim() ?? false;
                                        if (nomeDoc) {
                                            insertTextAtCursor(`<span class="prompt_ref_doc doc_${hash_doc}" data-nr_sei="${data.nr_sei ?? false}" data-num_processo="${data.num_processo ?? false}" data-id_procedimento="${data.id_procedimento ?? false}" data-id_documento="${data.id_documento ?? false}" contenteditable="false">${nomeDoc}</span>`);
                                            $(this).val('add_documento').trigger('chosen:updated');
                                        }
                                    }
                                }
                            });
                        }
                        setOptionsPro('currentPromptAISelect', _value);
                    });

                    $(document).off('click', '#favoritePromptAI').on('click', '#favoritePromptAI', function(event) {
                        if (!checkFavoriteExists()) {
                            saveFavoritePrompt();
                            $(this).find('i').attr('class','fas fa-star azulColor');
                        }
                    });

                    $(document).off('click', '#historyDialogAI').on('click', '#historyDialogAI', function(event) {
                        getHistoryDialog('restore');
                    });

                    $(document).off('keyup change mouseup keydown', '#promptAIPersonal').on('keyup change mouseup keydown', '#promptAIPersonal', function(event) {

                        // REDIMENSIONA A CAIXA DE DIÁLOGO
                        resizeBoxAIActions();
                        // SALVA O CONTEÚO DO ELEMENTO NA MEMÓRIA DO NAVEGADOR
                        localStorageStorePro('promptAIPersonal', $(this).html());
                        // SALVA A POSIÇÃO DO CURSOR QUANDO O USUÁRIO DIGITA OU CLICA NO EDITOR
                        saveCursorPosition();
                        // ATUALIZA O ÍCONE DE FAVORITO
                        $('#favoritePromptAI').find('i').attr('class', (checkFavoriteExists() ? 'fas' : 'far') + ' fa-star azulColor');

                        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                            initAI(this);
                            return; // Evita executar o restante desnecessariamente após envio
                        }

                    });

                    // TAMBÉM SALVA A POSIÇÃO DO CURSOR ANTES DO SELECT GANHAR FOCO
                    $(document).on('mousedown', '#docAISelect', function () {
                        saveCursorPosition(); // ISSO É O QUE FAZ FUNCIONAR DE VERDADE
                    });

                    $('#promptAIPersonal').html(localStorageRestorePro('promptAIPersonal') || '');

                    updateModelsAI();

                    addFavoriteSuggestion();

                    $('#dialogBoxPro').css('position', 'relative');

                    initChosenReplace('box_init', this, true);
                    
                    $('#response_ai').css('height', `calc(${$('#dialogBoxPro').css('height')} - 70px)`);

                    appendDocAISelect(getIdProcedimento());

                    adicionarVideoWebM({
                        webmSrc: URL_SPRO+'icons/menu/botpro.webm',
                        largura: 200,
                        id: 'botPro',
                        alvo: '.icon_ia'
                      });
                },
                close: function() {
                    $('#boxAIActions').remove();
                    resetDialogBoxPro('dialogBoxPro');
                    
                    // CANCELA A LEITURA EM VOZ ALTA
                    synth.cancel();
                }
            });
    };

    // FUNÇÃO JQUERY PARA CRIAR E INSERIR UM VÍDEO WEBM NO DOM DINAMICAMENTE\
    const adicionarVideoWebM = ({ webmSrc, largura = 600, id = 'videoDinamico', alvo = 'body' }) => {
        const $video = $('<video>', {
            id,
            muted: true,
            loop: false,
            autoplay: true,
            css: {
            width: `${largura}px`,
            border: 'none',
            borderRadius: '10px',
            display: 'block'
            }
        });

        $('<source>', { src: webmSrc, type: 'video/webm' }).appendTo($video);
        $(alvo).html('');
        $video
            .on('mouseenter', () => $video.get(0).play())
            .appendTo(alvo); // 'body' ou seletor de destino
    }

    const boxAISearchProcesso = () => {
        const htmlBox = `
                <div class="dialogBoxDiv seiProForm">
                    <div style="font-size: 10pt;margin: 1em;">
                        Digite o n\u00FAmero do processo
                    </div>
                    <input id="dialogBoxProcessoAI" type="text" style="font-size: 10pt; width: 80%;">
                </div>
            `;

        resetDialogBoxPro('alertBoxPro');
        const sanitizedHTML = sanitizeHTML(htmlBox);
    
        alertBoxPro = $('#alertaBoxPro')
            .html(`<div class="alertBoxDiv" style="max-height: 500px;">${sanitizedHTML}</div>`)
            .dialog({
                width: 450,
                title: 'Pesquisar documentos em processo',
                open: function(){

                    appendAutocompleteProc(this, $('#dialogBoxProcessoAI'));

                    $(document).off('keypress', '#dialogBoxProcessoAI').on('keypress', '#dialogBoxProcessoAI', function(event) {
                        if (event.which == 13) $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click')
                    });
                },
                close: function(){
                    $('#docAISelect').val('add_documento').trigger('chosen:updated');
                },
                buttons: [{
                    text: "Pesquisar",
                    class: 'confirm ui-state-active',
                    click: async function() {
                        loadingButtonConfirm(true);
                        $('#docAISelect').html('');
                        const appendDOc = await appendDocAISelect(false, $('#dialogBoxProcessoAI').val());
                        if (appendDOc) {
                            resetDialogBoxPro('alertBoxPro');
                            $('#docAISelect').focus().trigger('chosen:open');
                        }
                    }
                }]
            });
    };
    // VERIFICA SE O PROMPT JÁ EXISTE NO ARRAY DE FAVORITOS DA MEMÓRIA
    const addFavoriteSuggestion = () => {
        const favoriteArray = JSON.parse(localStorageRestorePro('favoritePromptAI')) ?? [];
        
        $('.suggestions').find('.suggestion_actions[data-type="personalizado"]').remove();

        if (favoriteArray.length) {
            const htmlFav = $.map(favoriteArray, function(v, i){
                const htmlToText = extractHTMLWithBRandSpanFromString(v);
                return `
                    <div data-send="false" data-index="${i}" data-type="personalizado" class="suggestion_actions">
                        <i data-index="${i}" style="position: absolute;right: 0;top: 0;z-index: 99;padding: 1em;" class="suggestion_actions_remove far fa-trash cinzaColor"></i>
                        <i style="margin-bottom: 1em;text-align: center;display: block;" class="fas fa-star cinzaColor"></i> ${htmlToText}
                    </div>`;
            }).join();
            $('.suggestions').append(normalizeHTML(htmlFav));
        }

        $(document).off('click', '.suggestion_actions_remove').on('click', '.suggestion_actions_remove', function(event) {
            removeFavoritePromptByIndex($(this).data('index'));
            addFavoriteSuggestion();
        });
    };

    function extractHTMLWithBRandSpanFromString(inputHtml) {
        // Cria um contêiner jQuery com o HTML fornecido
        const container = $('<div>').html(inputHtml);
      
        // Substitui <br> por marcador
        container.find('br').replaceWith('[[BR]]');
      
        // Insere marcador antes de cada <div>
        container.find('div').before('[[BR]]');
      
        // Substitui <div> por seu conteúdo
        container.find('div').each(function () {
          $(this).replaceWith($(this).contents());
        });
      
        // Extrai o HTML processado
        let html = container.html();
      
        // Limpeza e conversão final
        return html.replace(/\u00a0/g, ' ')            // Substitui &nbsp; por espaço comum
                   .replace(/\s{2,}/g, ' ')            // Remove espaços duplicados
                   .replace(/\[\[BR\]\]/g, '<br>')     // Converte marcador em <br>
                   .trim();
      }

    // VERIFICA SE O PROMPT JÁ EXISTE NO ARRAY DE FAVORITOS DA MEMÓRIA
    const checkFavoriteExists = () => {
        const prompt = $('#promptAIPersonal').html();
        const normalizedPrompt = normalizeHTML(prompt);

        let favoriteArray = JSON.parse(localStorageRestorePro('favoritePromptAI')) ?? [];

        // NORMALIZA TODOS OS ITENS DO ARRAY PARA COMPARAÇÃO
        return favoriteArray.some(item => normalizeHTML(item) === normalizedPrompt);
    };

    const saveFavoritePrompt = () => {
        const prompt = $('#promptAIPersonal').html();
        let favoriteArray = JSON.parse(localStorageRestorePro('favoritePromptAI')) ?? [];
        
            favoriteArray.push(prompt); // ARMAZENA O ORIGINAL, NÃO O NORMALIZADO
            localStorageStorePro('favoritePromptAI', JSON.stringify(favoriteArray));
            addFavoriteSuggestion();
    };

    function removeFavoritePromptByIndex(index) {
        let favoriteArray = JSON.parse(localStorageRestorePro('favoritePromptAI')) ?? [];
    
        if (index >= 0 && index < favoriteArray.length) {
            favoriteArray.splice(index, 1); // REMOVE 1 ITEM A PARTIR DO ÍNDICE
            localStorageStorePro('favoritePromptAI', JSON.stringify(favoriteArray));
        } else {
            console.warn('Índice inválido:', index);
        }
    }

    // VERIFICA SE O RANGE ESTÁ DENTRO DO ELEMENTO
    const isRangeInsideEditable = (range) => {
        const container = range.commonAncestorContainer;
        return $(container).closest('#promptAIPersonal').length > 0;
    }

    // SALVA A POSIÇÃO DO CURSOR MANUALMENTE
    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (isRangeInsideEditable(range)) {
                savedRange = range.cloneRange();
            }
        }
    }

    const insertTextAtCursor = (html) => {
        const $editableDiv = $('#promptAIPersonal');
        $editableDiv.focus();
    
        const selection = window.getSelection();
        selection.removeAllRanges();
    
        if (savedRange && isRangeInsideEditable(savedRange)) {
            selection.addRange(savedRange);
    
            // CRIA TEMPORARIAMENTE UM ELEMENTO COM O HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const elementToInsert = tempDiv.firstChild; // Primeiro filho (nosso <span>)
    
            const range = selection.getRangeAt(0);
            range.deleteContents(); // REMOVE QUALQUER SELEÇÃO EXISTENTE
            range.insertNode(elementToInsert);
    
            // CRIA UM NOVO RANGE DEPOIS DO ELEMENTO INSERIDO
            const newRange = document.createRange();
            newRange.setStartAfter(elementToInsert);
            newRange.setEndAfter(elementToInsert);
    
            // ATUALIZA A SELEÇÃO PARA O NOVO RANGE
            selection.removeAllRanges();
            selection.addRange(newRange);
    
            // ATUALIZA O savedRange PARA CONTINUAR A INSERIR APÓS
            savedRange = newRange.cloneRange();

            setTimeout(() => {
                $editableDiv.focus();
                moveCursorAtElement(elementToInsert);
            }, 100);
        } else {
            // Se não houver savedRange, insere no final
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const elementToInsert = tempDiv.firstChild;
            $editableDiv.append(elementToInsert);

            setTimeout(() => {
                $editableDiv.focus();
                moveCursorAtElement(elementToInsert);
            }, 100);
        }
    }

    const moveCursorAtElement = (elemDoc) => {
        // Cria uma Range e posiciona o cursor depois do span
        const range = document.createRange();
        range.setStartAfter(elemDoc);
        range.collapse(true); // Colapsa para um ponto só (não seleção)

        // Seleciona o Range
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    // ABRE A CAIXA DE CONFIGURAÇÕES DO MODELO DE IA
    let optionsModels = () => {
        const selectModelAI = getOptionsPro(currentPlataform == 'openai' ? 'setModelOpenAI' : 'setModelGemini')
        const listModels = currentPlataform == 'openai' ? modelsOpenAI : modelsGemini;
        return $.map(listModels, ([model]) => {
            const selected = selectModelAI === model ? 'selected' : '';
            return `<option ${selected} value="${model}">${model}</option>`;
        }).join('');
    };

    const resizeBoxAIActions = () => {
        const heightPromptBox = $('#promptAIPersonal').outerHeight(true);
        const heightDialogBox = dialogBoxPro.outerHeight(true);
        
        if ($('#promptAIPersonal').is(':visible')) {
            $('#boxAIActions').css('height', heightPromptBox + 70);
            $('#response_ai').css('height', heightDialogBox - heightPromptBox - 110);
        } else {
            $('#response_ai').css('height', heightDialogBox - 70);
        }
    };

// FUNÇÃO PARA ATUALIZAR A LISTA DE MODELOS DISPONÍVEIS NA API
const updateModelsAI = () => {
    const beta = getOptionsPro('setBetaModelsAI') == 'checked' ? 'beta' : '';
    const url = currentPlataform == 'openai' ? perfilPlataform.URL_API+`v1/models` :  perfilPlataform.URL_API+`v1${beta}/models?key=${perfilPlataform.KEY_USER}`;    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (currentPlataform == 'openai') xhr.setRequestHeader("Authorization", `Bearer ${perfilPlataform.KEY_USER}`);
    xhr.onreadystatechange = () => {
        if (xhr.status === 200 && (xhr.readyState === 4 || xhr.readyState == 3)) {
            let responseAiModels = tryParseJsonObject(xhr.responseText);

            if (responseAiModels) {
                responseAiModels = currentPlataform == 'openai' 
                    ? jmespath.search(responseAiModels.data, `[?owned_by!='openai-internal'] ${beta == '' ? `| [?owned_by!='openai-dev']` : ''} | [*].id`)
                    : jmespath.search(responseAiModels.models, "[*].name");
                responseAiModels = currentPlataform == 'openai' 
                    ? responseAiModels.map(model => [model])
                    : responseAiModels.map(model => [model.replace("models/", "")]);

                if (currentPlataform == 'openai') {
                    modelsOpenAI = responseAiModels;
                    localStorageStorePro('modelsOpenAI', responseAiModels);
                } else {
                    modelsGemini = responseAiModels;
                    localStorageStorePro('modelsGemini', responseAiModels);
                }
            }
        } else if (xhr.status !== 200 && xhr.readyState === 2) {
            console.error("Erro ao buscar modelos:", xhr.readyState, xhr.status, xhr.responseText);
        }
    };
    xhr.send();
};

// FUNÇÃO PARA SALVAR O TOKEN DO OPENAI
const saveTokenOpenAI = (this_, mode = 'insert', plataform = false) => {
    const _this = $(this_);
    const _parent = _this.closest('#plataformAI_info');
    const token = _parent.find('#cke_inputSecretKey_textInput').val();
    const type_plataform = plataform ? plataform : $('#plataformAI_uiElement').hasClass('gemini_token') ? 'gemini' : 'openai';
    const url_plataform = type_plataform == 'gemini' ?  'https%3A%2F%2Fgenerativelanguage.googleapis.com%2F' : 'https%3A%2F%2Fapi.openai.com%2F'

    $('#plataformAI_load').show();
    if ($('#frmCheckerProcessoPro').length === 0) {
        getCheckerProcessoPro();
    }

    const href = mode == 'insert' 
        ? `${window.location.href}#&acao_pro=set_database&mode=insert&base=${type_plataform}&token=${token}&url=${url_plataform}`
        : `${window.location.href}#&acao_pro=set_database&mode=remove&base=${type_plataform}&token=x&url=x`;

    $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', () => {
        const htmlSucess = `
            <div class="alertaAttencionPro dialogBoxDiv" style="font-size: 11pt; line-height: 15pt; color: #616161;">
                <i class="fas fa-check-circle verdeColor" style="margin-right: 5px;"></i>
                Credenciais carregadas com sucesso! Recarregue a p\u00E1gina.
                <a style="user-select: none; margin-left: 20px;" onclick="window.location.reload()" title="Recarregar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="plataformAI_label" id="plataformAI_uiElement">
                    <span id="plataformAI_label" class="cke_dialog_ui_button">Recarregar</span>
                </a>
            </div>`;
        $('#plataformAI_info').html(htmlSucess);
        if ($('#ifrArvore').length) {
            $('#plataformAI_uiElement').addClass('newLink newLink_confirm').find('#plataformAI_label').css('color', '#fff');
        }
        if (mode == 'remove' ) {
            resetDialogBoxPro('dialogBoxPro');
            resetDialogBoxPro('alertBoxPro');
            removeOptionsPro('plataformAI_current');
        } else {
            setOptionsPro('plataformAI_current', type_plataform);
        }
    });
};