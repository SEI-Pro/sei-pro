import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { editorCaptchaFeature, installEditorCaptcha } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'editor-captcha',
    maturity: 'wired',
    contexts: ['documento', 'editor'],
    configKey: null,
    install: installEditorCaptcha,
    api: editorCaptchaFeature.api
};

export default descriptor;

