// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    legacyProfileToLlmProfile,
    listProfiles,
    redactLegacyAiCredentials
} from '../../../../src/features/ai/io/profiles.ts';

describe('AI profile legacy migration', () => {
    beforeEach(() => {
        localStorage.clear();
        delete window.SeiPro;
        delete window.chrome;
    });

    it('maps a legacy OpenAI database profile to the local LLM shape', () => {
        expect(legacyProfileToLlmProfile({
            baseTipo: 'openai',
            baseName: 'Legacy OpenAI',
            URL_API: 'https://api.openai.com/',
            KEY_USER: 'secret'
        }, 2)).toEqual({
            id: 'llm-legacy-openai-2',
            providerId: 'openai',
            label: 'Legacy OpenAI',
            baseUrl: 'https://api.openai.com',
            model: 'gpt-4.1-mini',
            key: 'secret',
            trusted: false
        });
    });

    it('redacts only credentials from legacy AI entries', () => {
        const original = [
            { baseTipo: 'openai', URL_API: 'https://api.openai.com', KEY_USER: 'secret', model: 'gpt' },
            { baseTipo: 'atividades', URL_API: 'https://internal.example', KEY_USER: 'activity-secret' }
        ];

        expect(redactLegacyAiCredentials(original)).toEqual({
            changed: true,
            dataValues: [
                { baseTipo: 'openai', URL_API: 'https://api.openai.com', model: 'gpt' },
                { baseTipo: 'atividades', URL_API: 'https://internal.example', KEY_USER: 'activity-secret' }
            ]
        });
    });

    it('migrates legacy sync profiles once and returns safe profiles', async () => {
        const local = {};
        const storedProfiles = [];
        const sync = {
            dataValues: JSON.stringify([{
                baseTipo: 'openai',
                baseName: 'OpenAI antiga',
                URL_API: 'https://api.openai.com',
                KEY_USER: 'secret'
            }, {
                baseTipo: 'atividades',
                URL_API: 'https://internal.example',
                KEY_USER: 'activity-secret'
            }])
        };
        window.SeiPro = {
            core: {
                storage: {
                    getLocal: async (defaults) => ({ ...defaults, ...local }),
                    setLocal: async (items) => Object.assign(local, items),
                    getSync: async (defaults) => ({ ...defaults, ...sync }),
                    setSync: async (items) => Object.assign(sync, items)
                },
                messaging: {
                    sendMessage: async (message) => {
                        if (message.action === 'llmProfilesList') {
                            return {
                                ok: true,
                                profiles: storedProfiles.map((profile) => ({
                                    ...profile,
                                    key: undefined,
                                    hasKey: Boolean(profile.key)
                                }))
                            };
                        }
                        if (message.action === 'llmSaveProfile') {
                            storedProfiles.push(message.profile);
                            return { ok: true, profile: message.profile };
                        }
                        throw new Error(`Unexpected action: ${message.action}`);
                    }
                }
            }
        };

        const first = await listProfiles();
        const second = await listProfiles();

        expect(first).toHaveLength(1);
        expect(first[0]).toMatchObject({
            providerId: 'openai',
            label: 'OpenAI antiga',
            hasKey: true
        });
        expect(second).toHaveLength(1);
        expect(storedProfiles).toHaveLength(1);
        expect(local.llmProfilesLegacyMigrationVersion).toBe(2);
        const cleanedSyncValues = JSON.parse(sync.dataValues);
        expect(cleanedSyncValues[0]).not.toHaveProperty('KEY_USER');
        expect(cleanedSyncValues[1]).toEqual({
            baseTipo: 'atividades',
            URL_API: 'https://internal.example',
            KEY_USER: 'activity-secret'
        });
    });

    it('skips the legacy sync read in the page-injected editor runtime', async () => {
        window.chrome = { runtime: { id: 'seipro-page-inject' } };
        const getSync = vi.fn();
        const setLocal = vi.fn();
        window.SeiPro = {
            core: {
                storage: {
                    getLocal: async () => ({}),
                    setLocal,
                    getSync
                },
                messaging: {
                    sendMessage: async (message) => {
                        if (message.action === 'llmProfilesList') return { ok: true, profiles: [] };
                        throw new Error(`Unexpected action: ${message.action}`);
                    }
                }
            }
        };

        const profiles = await listProfiles();

        // The MAIN→isolated bridge never proxies the legacy sync blob, so
        // migration defers to isolated contexts instead of failing the editor.
        expect(profiles).toEqual([]);
        expect(getSync).not.toHaveBeenCalled();
        expect(setLocal).not.toHaveBeenCalled();
    });
});
