// Página de opções da extensão — comportamento da seção "Processos Monitorados".
//
// Owns the dependency between the master switch (gerenciarmonitorados) and the
// sub-option "Mover Processos Monitorados para cima do Controle" (row
// #monitoradosPro_beforeControl / switch #itemConfigGeral_monitoradosacimacontrole):
// quando o master está desligado, a sub-opção é escondida e desmarcada.
//
// Vanilla, mundo isolado, sem jQuery. Carregado por html/options.html ao lado do
// options.js genérico (que cuida do load/save de TODOS os switches).
//
// Corrige uma sobra da renomeação favoritos→monitorados: o options.js dirigia
// esta dependência com os nomes ANTIGOS (#favoritesPro_beforeControl /
// favoritosacimacontrole / config 'gerenciarfavoritos'), que não existem mais —
// então a dependência estava morta. Este módulo a restaura com os nomes corretos.

const MASTER_ID = 'itemConfigGeral_gerenciarmonitorados';
const SUB_ID = 'itemConfigGeral_monitoradosacimacontrole';
const ROW_ID = 'monitoradosPro_beforeControl';
const CONFIG_KEY = 'gerenciarmonitorados';

// Aplica a dependência: master ligado → mostra a linha; desligado → esconde e
// desmarca a sub-opção.
function applyDependency(masterOn) {
    const row = document.getElementById(ROW_ID);
    const sub = document.getElementById(SUB_ID);
    if (row) row.style.display = masterOn ? '' : 'none';
    if (!masterOn && sub) sub.checked = false;
}

// Lê o estado persistido com a MESMA semântica do options.js: o valor fica em
// dataValues → [*].configGeral | [0] (array de { name, value }). Default-enabled:
// visível a menos que o valor seja explicitamente false (ausente/null = ligado).
function readStoredEnabled() {
    return new Promise((resolve) => {
        try {
            chrome.storage.sync.get({ dataValues: '' }, (items) => {
                let enabled = true;
                try {
                    const parsed = items.dataValues ? JSON.parse(items.dataValues) : [];
                    const list = Array.isArray(parsed)
                        ? (parsed.map((e) => e && e.configGeral).find(Boolean) || [])
                        : [];
                    const found = list.find((v) => v && v.name === CONFIG_KEY);
                    if (found && found.value === false) enabled = false;
                } catch (e) { /* storage malformado → mantém default ligado */ }
                resolve(enabled);
            });
        } catch (e) { resolve(true); }
    });
}

function init() {
    const master = document.getElementById(MASTER_ID);
    if (!master) return; // seção não está nesta página

    // Toggle ao vivo do usuário.
    master.addEventListener('change', () => applyDependency(master.checked));

    // Estado inicial: lê o storage (mesma fonte que o options.js usa para marcar
    // o switch), independente da ordem de carga dos dois scripts.
    readStoredEnabled().then((enabled) => applyDependency(enabled));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
