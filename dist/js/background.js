/******************************************************************************
 SEI Pro PRF Dev: background service worker.
 Abre a página de boas-vindas na instalação e o histórico de mudanças
 nas atualizações (exceto se o usuário desativou a notificação).
*******************************************************************************/

const isChrome = (typeof browser === 'undefined');
if (isChrome) { var browser = chrome; }
const SEI_PRO_PROCESS_NOTIFICATIONS_KEY = 'seiProProcessNotifications';
const SEI_PRO_PROCESS_NOTIFICATION_ID = 'sei-pro-new-process';

if (typeof importScripts === 'function') {
    importScripts('storage-handler.js', 'fetch-handler.js', 'bug-report-handler.js');
}

function handleInstalled(details) {
    if (details.reason === 'install') {
        browser.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/' });
        browser.storage.local.set({ InstallOrUpdate: true });
    } else if (details.reason === 'update') {
        browser.storage.local.get('CheckTypes', function(item) {
            browser.storage.local.set({ InstallOrUpdate: true });
            if (!item.CheckTypes || item.CheckTypes.indexOf('hidemsgupdate') === -1) {
                // browser.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/pages/HISTORICO.html' });
            }
        });
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);

function getProcessNotificationState(callback) {
    browser.storage.local.get(SEI_PRO_PROCESS_NOTIFICATIONS_KEY, function(items) {
        var state = items && items[SEI_PRO_PROCESS_NOTIFICATIONS_KEY];
        if (!state || typeof state !== 'object') state = {};
        callback(state);
    });
}

function setProcessNotificationState(state, callback) {
    var payload = {};
    payload[SEI_PRO_PROCESS_NOTIFICATIONS_KEY] = state || {};
    browser.storage.local.set(payload, function() {
        if (typeof callback === 'function') callback();
    });
}

function clearProcessNotificationBadge() {
    if (browser.action && typeof browser.action.setBadgeText === 'function') {
        browser.action.setBadgeText({ text: '' });
    }
}

function setProcessNotificationBadge(count) {
    if (!browser.action || typeof browser.action.setBadgeText !== 'function') return;

    var text = '';
    if (count > 0) {
        text = count > 99 ? '99+' : String(count);
        if (typeof browser.action.setBadgeBackgroundColor === 'function') {
            browser.action.setBadgeBackgroundColor({ color: '#b3261e' });
        }
    }
    browser.action.setBadgeText({ text: text });
}

function createProcessNotification(diffCount, totalCount, label) {
    if (!browser.notifications || typeof browser.notifications.create !== 'function') return;

    var title = diffCount > 1 ? diffCount + ' novos processos' : 'Novo processo';
    var message = totalCount > 1
        ? 'Agora existem ' + totalCount + ' processos não visualizados' + (label ? ' em ' + label : '') + '.'
        : 'Existe 1 processo não visualizado' + (label ? ' em ' + label : '') + '.';

    browser.notifications.create(SEI_PRO_PROCESS_NOTIFICATION_ID + '-' + Date.now(), {
        type: 'basic',
        iconUrl: browser.runtime.getURL('icons/icon-128.png'),
        title: title,
        message: message
    });
}

function syncProcessNotificationState(message, sendResponse) {
    var key = message && message.key ? message.key : '';
    var enabled = !!(message && message.enabled);
    var count = Math.max(0, parseInt(message && message.count, 10) || 0);
    var label = message && message.label ? String(message.label) : '';

    if (!key) {
        clearProcessNotificationBadge();
        sendResponse({ ok: false });
        return;
    }

    getProcessNotificationState(function(state) {
        var previous = state[key];
        var previousCount = previous && typeof previous.count === 'number' ? previous.count : null;

        state[key] = {
            count: count,
            label: label,
            enabled: enabled,
            updatedAt: new Date().toISOString()
        };

        setProcessNotificationState(state, function() {
            if (!enabled) {
                clearProcessNotificationBadge();
                sendResponse({ ok: true, notified: false });
                return;
            }

            setProcessNotificationBadge(count);

            var diffCount = previousCount === null ? 0 : count - previousCount;
            if (diffCount > 0) {
                createProcessNotification(diffCount, count, label);
                sendResponse({ ok: true, notified: true });
                return;
            }

            sendResponse({ ok: true, notified: false });
        });
    });
}

function syncProcessNotificationConfig(message, sendResponse) {
    if (message && message.enabled === false) {
        clearProcessNotificationBadge();
    }
    sendResponse({ ok: true });
}

// Recebe requisições de envio de relatório de bug dos content scripts
// e faz o fetch a partir do service worker (sem restrições de CORS).
// Preferimos POST para evitar estourar o tamanho da URL quando há logs.
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var action = message && message.action ? message.action : '';

    if (action === 'syncNotificacaoProcessos') {
        syncProcessNotificationState(message, sendResponse);
        return true;
    }

    if (action === 'syncNotificacaoProcessosConfig') {
        syncProcessNotificationConfig(message, sendResponse);
        return false;
    }

    if (action === 'fetch') {
        if (!globalThis.SeiProBackgroundFetch || typeof globalThis.SeiProBackgroundFetch.handleFetchMessage !== 'function') {
            sendResponse({ ok: false, error: 'Fetch handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundFetch.handleFetchMessage(message, sender, sendResponse, browser);
    }

    if (action === 'storageGet' || action === 'storageSet' || action === 'storageRemove') {
        if (!globalThis.SeiProBackgroundStorage || typeof globalThis.SeiProBackgroundStorage.handleStorageMessage !== 'function') {
            sendResponse({ ok: false, error: 'Storage handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundStorage.handleStorageMessage(action, message, sendResponse, browser);
    }

    if (action === 'enviarRelatorioBug') {
        if (!globalThis.SeiProBackgroundBugReport || typeof globalThis.SeiProBackgroundBugReport.handleBugReportMessage !== 'function') {
            sendResponse({ ok: false, erro: 'Bug report handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundBugReport.handleBugReportMessage(message, sender, sendResponse);
    }
});
