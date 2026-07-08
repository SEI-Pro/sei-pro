/******************************************************************************
 SEI Pro PRF Dev: process notification message adapter for background service worker.

 Mantém a compatibilidade das ações legadas `syncNotificacaoProcessos` e
 `syncNotificacaoProcessosConfig`, mas isola estado, badge e notifications para
 reduzir o monólito de `background.js` de forma incremental.
*******************************************************************************/

(function (global) {
    'use strict';

    const SEI_PRO_PROCESS_NOTIFICATIONS_KEY = 'seiProProcessNotifications';
    const SEI_PRO_PROCESS_NOTIFICATION_ID = 'sei-pro-new-process';

    function getProcessNotificationState(browserApi, callback) {
        browserApi.storage.local.get(SEI_PRO_PROCESS_NOTIFICATIONS_KEY, function(items) {
            var state = items && items[SEI_PRO_PROCESS_NOTIFICATIONS_KEY];
            if (!state || typeof state !== 'object') state = {};
            callback(state);
        });
    }

    function setProcessNotificationState(browserApi, state, callback) {
        var payload = {};
        payload[SEI_PRO_PROCESS_NOTIFICATIONS_KEY] = state || {};
        browserApi.storage.local.set(payload, function() {
            if (typeof callback === 'function') callback();
        });
    }

    function clearProcessNotificationBadge(browserApi) {
        if (browserApi.action && typeof browserApi.action.setBadgeText === 'function') {
            browserApi.action.setBadgeText({ text: '' });
        }
    }

    function setProcessNotificationBadge(browserApi, count) {
        if (!browserApi.action || typeof browserApi.action.setBadgeText !== 'function') return;

        var text = '';
        if (count > 0) {
            text = count > 99 ? '99+' : String(count);
            if (typeof browserApi.action.setBadgeBackgroundColor === 'function') {
                browserApi.action.setBadgeBackgroundColor({ color: '#b3261e' });
            }
        }
        browserApi.action.setBadgeText({ text: text });
    }

    function createProcessNotification(browserApi, diffCount, totalCount, label) {
        if (!browserApi.notifications || typeof browserApi.notifications.create !== 'function') return;

        var title = diffCount > 1 ? diffCount + ' novos processos' : 'Novo processo';
        var message = totalCount > 1
            ? 'Agora existem ' + totalCount + ' processos não visualizados' + (label ? ' em ' + label : '') + '.'
            : 'Existe 1 processo não visualizado' + (label ? ' em ' + label : '') + '.';

        browserApi.notifications.create(SEI_PRO_PROCESS_NOTIFICATION_ID + '-' + Date.now(), {
            type: 'basic',
            iconUrl: browserApi.runtime.getURL('icons/icon-128.png'),
            title: title,
            message: message
        });
    }

    function syncProcessNotificationState(message, sendResponse, browserApi) {
        var key = message && message.key ? message.key : '';
        var enabled = !!(message && message.enabled);
        var count = Math.max(0, parseInt(message && message.count, 10) || 0);
        var label = message && message.label ? String(message.label) : '';

        if (!key) {
            clearProcessNotificationBadge(browserApi);
            sendResponse({ ok: false });
            return;
        }

        getProcessNotificationState(browserApi, function(state) {
            var previous = state[key];
            var previousCount = previous && typeof previous.count === 'number' ? previous.count : null;

            state[key] = {
                count: count,
                label: label,
                enabled: enabled,
                updatedAt: new Date().toISOString()
            };

            setProcessNotificationState(browserApi, state, function() {
                if (!enabled) {
                    clearProcessNotificationBadge(browserApi);
                    sendResponse({ ok: true, notified: false });
                    return;
                }

                setProcessNotificationBadge(browserApi, count);

                var diffCount = previousCount === null ? 0 : count - previousCount;
                if (diffCount > 0) {
                    createProcessNotification(browserApi, diffCount, count, label);
                    sendResponse({ ok: true, notified: true });
                    return;
                }

                sendResponse({ ok: true, notified: false });
            });
        });
    }

    function syncProcessNotificationConfig(message, sendResponse, browserApi) {
        if (message && message.enabled === false) {
            clearProcessNotificationBadge(browserApi);
        }
        sendResponse({ ok: true });
    }

    function handleProcessNotificationMessage(action, message, sendResponse, browserApi) {
        if (action === 'syncNotificacaoProcessos') {
            syncProcessNotificationState(message, sendResponse, browserApi);
            return true;
        }

        if (action === 'syncNotificacaoProcessosConfig') {
            syncProcessNotificationConfig(message, sendResponse, browserApi);
            return false;
        }

        return null;
    }

    global.SeiProBackgroundProcessNotification = {
        clearProcessNotificationBadge: clearProcessNotificationBadge,
        handleProcessNotificationMessage: handleProcessNotificationMessage,
        setProcessNotificationBadge: setProcessNotificationBadge
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
