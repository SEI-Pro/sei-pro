// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { q } from '../../../../src/features/editor/lib/domq.ts';
import { state } from '../../../../src/features/editor/state.ts';
import { getImagemBgOnEditor } from '../../../../src/features/editor/view/dialogs/images-editor.ts';

describe('page background dialog', () => {
    afterEach(() => {
        document.body.replaceChildren();
        state.iframeEditor = q(document);
    });

    it('handles a document with no background image', () => {
        document.body.innerHTML = '<div id="imgBgPreview"></div>';
        state.iframeEditor = q(document);

        expect(getImagemBgOnEditor()).toBe(false);
        expect(document.querySelector('#imgBgPreview').style.backgroundImage).toBe('none');
    });
});
