// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Open a small dependency-free image cropper.
 *
 * The save callback receives `(dataUrl, details)`, where details contains the
 * crop rectangle, rotation, output dimensions, quality, and MIME type.
 */
export function openImageCrop({ src, onSave, onCancel } = {}) {
    if (!src) throw new TypeError('Image source is required');

    const overlay = document.createElement('div');
    overlay.className = 'seipro-crop-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);';

    const dialog = document.createElement('section');
    dialog.className = 'seipro-crop-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Crop image');
    dialog.style.cssText = 'width:min(900px,95vw);max-height:95vh;overflow:auto;padding:16px;border-radius:8px;background:#fff;';

    const canvas = document.createElement('canvas');
    canvas.className = 'seipro-crop-canvas';
    canvas.style.cssText = 'display:block;max-width:100%;max-height:55vh;margin:0 auto 12px;background:#eee;';

    const controls = document.createElement('div');
    controls.className = 'seipro-crop-controls';
    controls.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;';

    const x = numberControl('X', 'seipro-crop-x', 0, 0);
    const y = numberControl('Y', 'seipro-crop-y', 0, 0);
    const cropWidth = numberControl('Crop width', 'seipro-crop-width', 1, 1);
    const cropHeight = numberControl('Crop height', 'seipro-crop-height', 1, 1);
    const outputWidth = numberControl('Output width', 'seipro-crop-output-width', 1, 1);
    const outputHeight = numberControl('Output height', 'seipro-crop-output-height', 1, 1);
    const rotation = numberControl('Rotation', 'seipro-crop-rotation', 0, -180, 180);
    const quality = numberControl('Quality', 'seipro-crop-quality', 0.9, 0.1, 1, 0.05);
    const format = selectControl('Format', 'seipro-crop-format', [
        ['image/jpeg', 'JPEG'],
        ['image/png', 'PNG'],
        ['image/webp', 'WebP']
    ]);

    [
        x, y, cropWidth, cropHeight, outputWidth,
        outputHeight, rotation, quality, format
    ].forEach(function (control) {
        controls.appendChild(control.label);
    });

    const status = document.createElement('p');
    status.className = 'seipro-crop-status';
    status.setAttribute('aria-live', 'polite');

    const actions = document.createElement('div');
    actions.className = 'seipro-crop-actions';
    actions.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:12px;';

    const cancelButton = button('Cancel', 'seipro-crop-cancel');
    const saveButton = button('Save', 'seipro-crop-save');
    saveButton.disabled = true;
    actions.append(cancelButton, saveButton);

    dialog.append(canvas, controls, status, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const image = new Image();
    let loaded = false;

    function values() {
        const sourceWidth = image.naturalWidth || image.width;
        const sourceHeight = image.naturalHeight || image.height;
        const sx = clamp(numberValue(x.input), 0, Math.max(0, sourceWidth - 1));
        const sy = clamp(numberValue(y.input), 0, Math.max(0, sourceHeight - 1));
        const sw = clamp(numberValue(cropWidth.input), 1, Math.max(1, sourceWidth - sx));
        const sh = clamp(numberValue(cropHeight.input), 1, Math.max(1, sourceHeight - sy));
        return {
            x: sx,
            y: sy,
            width: sw,
            height: sh,
            outputWidth: Math.max(1, Math.round(numberValue(outputWidth.input))),
            outputHeight: Math.max(1, Math.round(numberValue(outputHeight.input))),
            rotation: numberValue(rotation.input),
            quality: clamp(numberValue(quality.input), 0.1, 1),
            type: format.input.value
        };
    }

    function render() {
        if (!loaded) return;
        const options = values();
        canvas.width = options.outputWidth;
        canvas.height = options.outputHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            status.textContent = 'Canvas is unavailable.';
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(options.rotation * Math.PI / 180);

        const radians = Math.abs(options.rotation * Math.PI / 180);
        const boundsWidth = Math.abs(options.width * Math.cos(radians))
            + Math.abs(options.height * Math.sin(radians));
        const boundsHeight = Math.abs(options.width * Math.sin(radians))
            + Math.abs(options.height * Math.cos(radians));
        const scale = Math.min(canvas.width / boundsWidth, canvas.height / boundsHeight);

        context.drawImage(
            image,
            options.x,
            options.y,
            options.width,
            options.height,
            -options.width * scale / 2,
            -options.height * scale / 2,
            options.width * scale,
            options.height * scale
        );
        context.restore();
        status.textContent = `${options.outputWidth} × ${options.outputHeight}`;
    }

    function close() {
        overlay.remove();
    }

    function cancel() {
        if (typeof onCancel === 'function') onCancel(api);
        close();
    }

    function save() {
        if (!loaded) return null;
        render();
        try {
            const options = values();
            const dataUrl = canvas.toDataURL(options.type, options.quality);
            if (typeof onSave === 'function') onSave(dataUrl, options);
            close();
            return dataUrl;
        } catch (error) {
            status.textContent = `Unable to export image: ${error.message}`;
            return null;
        }
    }

    const api = { el: overlay, canvas, close, save, render };

    controls.addEventListener('input', render);
    cancelButton.addEventListener('click', cancel);
    saveButton.addEventListener('click', save);
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) cancel();
    });

    image.addEventListener('load', function () {
        loaded = true;
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        cropWidth.input.value = String(width);
        cropHeight.input.value = String(height);
        outputWidth.input.value = String(width);
        outputHeight.input.value = String(height);
        x.input.max = String(Math.max(0, width - 1));
        y.input.max = String(Math.max(0, height - 1));
        cropWidth.input.max = String(width);
        cropHeight.input.max = String(height);
        saveButton.disabled = false;
        render();
    });
    image.addEventListener('error', function () {
        status.textContent = 'Unable to load image.';
    });
    if (/^https?:/i.test(src)) image.crossOrigin = 'anonymous';
    image.src = src;

    return api;
}

function numberControl(text, className, value, min, max, step = 1) {
    const label = document.createElement('label');
    label.className = `seipro-crop-field ${className}-field`;
    label.textContent = text;

    const input = document.createElement('input');
    input.className = className;
    input.type = 'number';
    input.value = String(value);
    input.min = String(min);
    if (max != null) input.max = String(max);
    input.step = String(step);
    label.appendChild(input);
    return { label, input };
}

function selectControl(text, className, options) {
    const label = document.createElement('label');
    label.className = `seipro-crop-field ${className}-field`;
    label.textContent = text;

    const input = document.createElement('select');
    input.className = className;
    options.forEach(function ([value, labelText]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = labelText;
        input.appendChild(option);
    });
    label.appendChild(input);
    return { label, input };
}

function button(text, className) {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `seipro-crop-button ${className}`;
    element.textContent = text;
    return element;
}

function numberValue(input) {
    const value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
