import * as editorCaptcha from './editor-captcha.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const editorCaptchaFeature = defineLegacyFeature({ id: 'editor-captcha', nsKey: 'editorCaptcha', modules: [editorCaptcha] });
export const installEditorCaptcha = editorCaptchaFeature.install;
