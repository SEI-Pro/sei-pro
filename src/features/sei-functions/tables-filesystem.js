/**
 * Sei Functions Pro — tables + filesystem.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    confirmaFraseBoxPro,
    resetDialogBoxPro
} from './modules.js';

export function dragColumnTable(elemTable) {
    var local = {};
        local.containment = 'parent';
        local.revert = true;
        elemTable.find('thead th').not('.sorter-false').draggable(local);
        elemTable.find('thead th').not('.sorter-false').droppable({
            drop: dropZone
        });
    function dropZone(myEvent, myUI ) {
        var head = {};

        head.dragIndex = myUI.draggable.index();
        head.dropIndex = $(this).index();
        head.rows = $(this).closest('thead').find('tr');
        head.cellIndex = head.rows.find('th').length-1;
        head.rows.each(processTableHeaderRows);

        function processTableHeaderRows(index, element) {
            var row = {}

            row.tr = $(element);
            row.drag = row.tr.find('th:eq(' + head.dragIndex + ')');
            row.drop = row.tr.find('th:eq(' + head.dropIndex + ')');
            if (head.dropIndex === head.cellIndex) {
                row.drag.detach().insertAfter(row.drop);
            } else {
                row.drag.detach().insertBefore(row.drop);
            }
        }
        // Same thing here for td instead of th
        $(this).closest('table').find('tbody > tr').each(processRows);
        function processRows(index, element) {
            var row = {};

            row.tr = $(element);
            row.drag = row.tr.find('td:eq(' + head.dragIndex + ')');
            row.drop = row.tr.find('td:eq(' + head.dropIndex + ')');
            if (head.dropIndex === head.cellIndex) {
                row.drag.detach().insertAfter(row.drop);
            } else {
                row.drag.detach().insertBefore(row.drop);
            }
        }
        setOptionsPro('panelAtividadesViewTableSort', getColumnsSortable(elemTable));
        setTimeout(function(){ 
            repareStickColumnsSortable(elemTable, true);
        }, 500);
    }
    repareStickColumnsSortable(elemTable);
    setTimeout(function(){ 
        if (elemTable.find('thead tr').is(':hidden')) {
            repareStickColumnsSortable(elemTable, true);
        }
    }, 500);
}
export function repareStickColumnsSortable(elemTable, refresh = false) {
    elemTable.find('thead tr.headerStick').remove();
    var headerStick = elemTable.find('thead tr.tableHeader').clone(true, true).addClass('headerStick').hide();
    elemTable.find('thead').prepend(headerStick);
    elemTable.find('thead tr.headerStick th').not('.sorter-false').removeAttr('style').removeClass('ui-draggable-dragging').find('.fa-arrows-alt-h').remove();


    var tableHeader = elemTable.find('thead tr.tableHeader').not('.headerStick');
        tableHeader.show().find('.fa-arrows-alt-h').remove();
        tableHeader.find('th.tablesorter-header').not('.sorter-false').find('.tablesorter-header-inner').append('<i class="fas fa-arrows-alt-h" style="float: right;right: 20px;position: absolute;"></i>');
    var headerStick = elemTable.find('thead tr.headerStick');

    $('#tabelaAtivPanel').unbind('scroll').scroll(function() {
        if (typeof $(this).offset() !== 'undefined' && $(this).offset() !== null && typeof headerStick.offset() !== 'undefined' && headerStick.offset() !== null) {
            var wrapperTop = $(this).offset().top-25;
            var headerTop = headerStick.offset().top;
            setTimeout(function(){ 
                if ( headerTop < wrapperTop || headerTop == 0) {
                    tableHeader.hide();
                    headerStick.show();
                } else {
                    headerStick.hide();
                    tableHeader.show();
                }
            }, 100);
        }
    });
    if (refresh) {
        setTimeout(function(){ 
            // $('#tabelaAtivPanel').trigger('scroll');
        }, 100);
    }
}
export function getColumnsSortable(elemTable) {
    var arrayColumns = elemTable.find('thead tr.tableHeader').not('.headerStick').find('th.tituloControle').not('.sorter-false').map(function(v){
        return $(this).data('filter-type');
    }).get();
    return arrayColumns;
}
export function initFileSystem() {
    // Allow for vendor prefixes.
    window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;
    // Create a variable that will store a reference to the FileSystem.
    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        setFileSystem();
    } else {
        console.log('Desculpe! Seu navegador n\u00E3o possui suporte ao sistema de arquivos local (FileSystem API)');
    }
}
// A simple error handler to be used throughout this demo.
export function errorHandler(error) {
    console.log(error);
}
export function errorHandlerFileSystemOptional(error) {
    if (!error || error.name === 'NotFoundError' || error.code === 8) return;
    console.log(error);
}
// Request a FileSystem and set the filesystem variable.
export function setFileSystem() {
    var quota = 1024 * 1024 * 5;
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(function() {
            window.requestFileSystem(window.PERSISTENT, quota, function(fs) {
                filesystem = fs;
                fileSystemListFiles();
            }, errorHandler);
        });
    } else {
        window.requestFileSystem(window.PERSISTENT, quota, function(fs) {
            filesystem = fs;
            fileSystemListFiles();
        }, errorHandler);
    }
}
  
export function fileSystemLoadFile(filename) {
    filesystem.root.getFile(filename, {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                // Update the form fields.
                var return_this = (typeof this.result !== 'undefined') ? this.result : false;
                    return_this = (return_this && isJson(JSON.parse(this.result))) ? JSON.parse(this.result) : [];
                // console.log(filename, return_this);
                fileSystemContentPro = return_this;
            };
            reader.readAsText(file);
        }, errorHandler);

    }, errorHandlerFileSystemOptional);
}
export function fileSystemListFiles() {
    var dirReader = filesystem.root.createReader();
    var entries = [];
    var fetchEntries = function() {
        dirReader.readEntries(function(results) {
            if (!results.length) {
                fileSystemPro = entries.sort().reverse();
            } else {
                entries = entries.concat(results);
                fetchEntries();
            }
        }, errorHandler);
    };
    fetchEntries();
}
// Save a file in the FileSystem.
export function fileSystemSaveFile(filename, content) {
    filesystem.root.getFile(filename, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                // Update the file browser.
                fileSystemListFiles();
                // console.log('File saved');
            };
            fileWriter.onerror = function(e) {
                console.log('Write error: ' + e.toString());
                console.log('Ocorreu um erro e n\u00E3o foi poss\u00EDvel salvar seu arquivo');
            };
            var contentBlob = new Blob([content], {type: 'text/plain'});
            fileWriter.write(contentBlob);
        }, errorHandler);
    }, errorHandler);
}
export function fileSystemDeleteFile(filename) {
    filesystem.root.getFile(filename, {create: false}, function(fileEntry) {
        fileEntry.remove(function(e) {
            // Update the file browser.
            fileSystemListFiles();
            // console.log('File deleted!');
        }, errorHandlerFileSystemOptional);
    }, errorHandlerFileSystemOptional);
}
export function fileSystemUpdateFile(filename, content) {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) {
            filesystem.root.getFile(filename, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    var contentBlob = new Blob([content], {type: 'text/plain'});
                    fileWriter.onerror = function(e) {
                        console.log('Write error: ' + e.toString());
                        console.log('Ocorreu um erro e não foi possível salvar seu arquivo');
                    };
                    fileWriter.onwriteend = function() {
                        if (!fileWriter._truncated) {
                            fileWriter._truncated = true;
                            fileWriter.seek(0);
                            fileWriter.write(contentBlob);
                            return;
                        }
                        fileSystemListFiles();
                        fileSystemLoadFile(filename);
                    };
                    fileWriter.truncate(0);
                }, errorHandlerFileSystemOptional);
            }, errorHandlerFileSystemOptional);
        }
    }, 100);
}
export function getLocalFilePro() {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) { 
            fileSystemLoadFile('configPro.json'); 
            setTimeout(function(){ 
                // console.log(fileSystemPro, fileSystemContentPro);
            }, 100);
        }
    }, 10);
}
export function setLocalFilePro(content) {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) { 
            fileSystemUpdateFile('configPro.json', JSON.stringify(content)); 
            // console.log('setLocalFilePro', content);
        }
    }, 10);
    setTimeout(function(){ 
        getLocalFilePro();
    }, 500);
}
export function initDownloadLocalFilePro(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if ((typeof fileSystemContentPro !== 'undefined' && fileSystemContentPro) || (typeof localStorageRestorePro('configDataMonitoradosPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataMonitoradosPro'))) ) { 
        downloadLocalFilePro(this_);
    } else {
        $(this_).find('i').attr('class','fas fa-spinner fa-spin cinzaColor');
        if (TimeOut == 9000) fileSystemLoadFile('configPro.json');
        setTimeout(function(){ 
            initDownloadLocalFilePro(this_, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDownloadLocalFilePro'); 
        }, 500);
    }
}
export function downloadLocalFilePro(this_) {
    var _this = $(this_);
    var configPro = JSON.stringify(localStorageRestorePro('configDataMonitoradosPro'));
    var nameFile = 'configPro';

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", configPro]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile+'_'+moment().format('YYYYMMDD_HH:mm:ss')+'.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    _this.find('i').attr('class','fas fa-thumbs-up azulColor');
    setTimeout(function(){ 
        _this.find('i').attr('class','fas fa-download azulColor');
    }, 1000);
}
export function initLoadLocalFilePro() {
    $('#selectLocalFilesPro[type=file]').trigger('click');
}
export function loadLocalFilePro() {
    confirmaFraseBoxPro('Esta a\u00E7\u00E3o ir\u00E1 substituir todos os dados de processos monitorados. Tem certeza que deseja prosseguir?', 'SIM', 
        function(){
            var files = document.getElementById('selectLocalFilesPro').files;
            if (files.length <= 0) { return false; }
            
            var fr = new FileReader();
            fr.onload = function(e) { 
                var result = JSON.parse(e.target.result); 
                    result.datetime = moment().format('YYYY-MM-DD HH:mm:ss');

                    setLocalFilePro(result);
                    localStorageStorePro('configDataMonitoradosPro', result);
                    setPanelMonitorados('refresh');
                    resetDialogBoxPro('dialogBoxPro');
                setTimeout(function(){ 
                        alertaBoxPro('Sucess', 'check-circle', 'Configura\u00E7\u00F5es carregadas com sucesso!');
                        console.log('loadLocalFilePro', result.datetime, result, getStoreMonitoradoPro());
                }, 500);
            }
            fr.readAsText(files.item(0));
    });
}
// htmlIconMonitorados REESCRITO em vanilla ESM: src/features/monitorados/icon.js
// (data-act delegado no lugar do onclick inline). Global via aliasGlobal no bundle.
