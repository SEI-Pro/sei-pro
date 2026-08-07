/**
 * Lista de processos — processo maps + client load helpers.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */


export let objProcessosUnidadePro = false;
export let arrayProcessosUnidadePro = false;
try {
    if (typeof getProcessoUnidadePro !== 'undefined') {
        objProcessosUnidadePro = getProcessoUnidadePro(false, true);
        arrayProcessosUnidadePro = getProcessoUnidadePro();
    }
} catch (e) {
    objProcessosUnidadePro = false;
    arrayProcessosUnidadePro = false;
}

export function setTimeTest() {
    ++totalSecondsTest;
    var hours = Math.floor((totalSecondsTest % (60 * 60 * 24)) / (3600));
    var minutes = Math.floor((totalSecondsTest % (60 * 60)) / 60);
    var seconds = Math.floor(totalSecondsTest % 60);
    totalSecondsTestText = pad(hours,2)+':'+pad(minutes,2)+':'+pad(seconds,2);
}
// On load, called to load the auth2 library and API client library.
export function handleClientLoadPro(TimeOut = 3000) {
    if (TimeOut <= 0) { return; }
    if ((typeof spreadsheetIdFormularios_Pro !== 'undefined' || typeof spreadsheetIdSyncProcessos_Pro !== 'undefined') && typeof gapi !== 'undefined' && typeof initClientPro !== 'undefined') { 
        gapi.load('client:auth2', initClientPro);
    } else if (
            (typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro === false) ||
            (typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro === false)
        ) {
        console.log('notConfig handleClientLoadPro'); 
        return;
    } else {
        setTimeout(function(){
            handleClientLoadPro(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload handleClientLoadPro'); 
        }, 500);
    }
}
