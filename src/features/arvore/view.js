/**
 * Instala a borda de eventos nativos do upload da árvore.
 * A implementação recebe as dependências para permanecer testável sem a página do SEI.
 */

export function bindArvoreToolbarProcess({ element, $, onAction }) {
    return element.toolbar({
        content: '#toolbar-options-proc',
        position: 'bottom',
        adjustment: 5,
        style: 'menu'
    }).on('toolbarItemClick', function (event, triggerButton) {
        onAction($(this), triggerButton);
    });
}

export function bindUploadArvoreNativeDragEvents({
    root,
    $,
    hasUploadFiles,
    openModalDropzone,
    cancelUpload,
    getDropzone
}) {
    const documentRoot = $(root);
    documentRoot
        .off('.uploadArvorePro')
        .on('dragenter.uploadArvorePro dragover.uploadArvorePro', (event) => {
            const originalEvent = event.originalEvent;
            const dataTransfer = originalEvent ? originalEvent.dataTransfer : null;
            if (!hasUploadFiles(dataTransfer)) return;
            event.preventDefault();
            openModalDropzone();
        })
        .on('dragleave.uploadArvorePro', (event) => {
            const originalEvent = event.originalEvent;
            if (
                originalEvent &&
                originalEvent.clientX <= 0 &&
                originalEvent.clientY <= 0
            ) {
                cancelUpload();
            }
        })
        .on('drop.uploadArvorePro', (event) => {
            const originalEvent = event.originalEvent;
            const dataTransfer = originalEvent ? originalEvent.dataTransfer : null;
            if (!hasUploadFiles(dataTransfer)) return;
            event.preventDefault();
            cancelUpload();
            const dropzone = getDropzone();
            if (dropzone && typeof dropzone.handleFiles === 'function') {
                dropzone.handleFiles(Array.from(dataTransfer.files));
            }
        });
}
