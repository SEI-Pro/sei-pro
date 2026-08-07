// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@src/features/ai/io/profiles.ts', () => ({
    getAiSettings: vi.fn(),
    listProfiles: vi.fn(),
    saveAiSettings: vi.fn()
}));

vi.mock('@src/features/ai/view/dialogs.ts', () => ({
    confirmRestrictedDocument: vi.fn(),
    openProfileDialog: vi.fn(),
    openPromptDialog: vi.fn(),
    showAiError: vi.fn()
}));

import { loadBoxAIActions, startGeneration } from '@src/features/ai/controller.ts';
import { getAiSettings, listProfiles } from '@src/features/ai/io/profiles.ts';
import { showAiError } from '@src/features/ai/view/dialogs.ts';

const TRANSPORT_ERROR = new Error('SEI Pro editor bridge unavailable (isolated loader did not respond)');

beforeEach(() => {
    vi.clearAllMocks();
});

describe('AI controller transport failures', () => {
    it('surfaces a dialog instead of an unhandled rejection when profiles cannot load', async () => {
        listProfiles.mockRejectedValue(TRANSPORT_ERROR);
        getAiSettings.mockRejectedValue(TRANSPORT_ERROR);

        const result = await loadBoxAIActions();

        expect(result.error).toBe(TRANSPORT_ERROR);
        expect(showAiError).toHaveBeenCalledTimes(1);
        expect(showAiError).toHaveBeenCalledWith(TRANSPORT_ERROR);
    });

    it('surfaces a dialog when settings cannot load before generation', async () => {
        getAiSettings.mockRejectedValue(TRANSPORT_ERROR);

        const result = await startGeneration({ profile: { id: 'p1', model: 'm' }, prompt: 'draft' });

        expect(result.error).toBe(TRANSPORT_ERROR);
        expect(showAiError).toHaveBeenCalledWith(TRANSPORT_ERROR);
    });
});
