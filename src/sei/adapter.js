import { getSeiPro } from '../core/global.js';

export function installAdapter() {
    function flags() {
        if (getSeiPro().state && typeof getSeiPro().state.isNewSEI !== 'undefined') {
            return {
                isNewSEI: !!getSeiPro().state.isNewSEI,
                isSEI_5: !!getSeiPro().state.isSEI_5,
                version: getSeiPro().state.version || getSeiPro().sei.version.getSeiVersionPro()
            };
        }
        return getSeiPro().sei.version.resolveVersionFlags();
    }

    function selectors(isNewSEI, version) {
        const isAtLeast = getSeiPro().sei.version.isAtLeast;
        const isSEI_5 = !!(isNewSEI && version && isAtLeast(version, '5'));
        const mainMenu = isNewSEI ? '#infraMenu' : '#main-menu';
        const ifrVisualizacao_ = isNewSEI && version && isAtLeast(version, '4.1.0')
            ? 'ifrConteudoVisualizacao'
            : 'ifrVisualizacao';
        const ifrArvoreHtml_ = isNewSEI && version && isAtLeast(version, '4.1.0')
            ? 'ifrVisualizacao'
            : 'ifrArvoreHtml';

        return {
            divInformacao: isNewSEI ? '#divArvoreInformacao' : '#divInformacao',
            mainMenu,
            idMenu: isNewSEI ? '#divInfraSidebarMenu ' + mainMenu : '#divInfraAreaTelaE ' + mainMenu,
            ancoraArvoreDownload: isNewSEI ? 'a.ancoraVisualizacaoArvore' : 'a.ancoraArvoreDownload',
            infraBarraComandos: isNewSEI ? '.barraBotoesSEI' : '.infraBarraComandos',
            infraBarraS: isNewSEI ? '#divInfraBarraSistemaPadraoE' : '#divInfraBarraSistemaE',
            nameDocInterno: isNewSEI ? 'documento_interno.svg' : 'sei_documento_interno.gif',
            divComandos: isNewSEI && version && isAtLeast(version, '4.1.0')
                ? '#divBotoesControleProcessos'
                : '#divComandos',
            ifrVisualizacao_,
            $ifrVisualizacao: '#' + ifrVisualizacao_,
            ifrArvoreHtml_,
            $ifrArvoreHtml: '#' + ifrArvoreHtml_,
            frmEditor: isSEI_5 ? '.infra-editor__editor-completo' : '#frmEditor',
            infraBarraSistemaD: isNewSEI ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD'
        };
    }

    function applyToState() {
        const f = flags();
        const sel = selectors(f.isNewSEI, f.version);
        getSeiPro().state.isNewSEI = f.isNewSEI;
        getSeiPro().state.isSEI_5 = f.isSEI_5;
        getSeiPro().state.version = f.version;
        Object.keys(sel).forEach(function (key) {
            getSeiPro().state[key] = sel[key];
        });
        getSeiPro().aliasState('isNewSEI', f.isNewSEI);
        getSeiPro().aliasState('isSEI_5', f.isSEI_5);
        Object.keys(sel).forEach(function (key) {
            getSeiPro().aliasState(key, sel[key]);
        });
        return sel;
    }

    function isNewSEI() {
        return !!flags().isNewSEI;
    }

    function isSEI5() {
        const f = flags();
        return getSeiPro().sei.version.isSEI5(f.isNewSEI, f.version);
    }

    function atLeast(target) {
        return getSeiPro().sei.version.isAtLeast(flags().version, target);
    }

    function pick(novo, legado) {
        return isNewSEI() ? novo : legado;
    }

    const adapter = {
        flags,
        selectors,
        applyToState,
        isNewSEI,
        isSEI5,
        atLeast,
        pick,
        divInformacao: function () { return selectors(flags().isNewSEI, flags().version).divInformacao; },
        mainMenu: function () { return selectors(flags().isNewSEI, flags().version).mainMenu; },
        frmEditor: function () { return selectors(flags().isNewSEI, flags().version).frmEditor; }
    };

    getSeiPro().sei.adapter = adapter;
    return adapter;
}
