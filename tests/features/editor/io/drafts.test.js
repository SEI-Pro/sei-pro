import { describe, expect, it } from 'vitest';
import {
    createDraftRepository,
    normalizeDraftContext
} from '../../../../src/features/editor/io/drafts.ts';

function createMemoryAdapter() {
    const records = new Map();
    return {
        async put(record) {
            records.set(record.id, structuredClone(record));
        },
        async get(id) {
            return records.has(id) ? structuredClone(records.get(id)) : undefined;
        },
        async getAllByContext(contextKey) {
            return Array.from(records.values())
                .filter((record) => record.contextKey === contextKey)
                .map((record) => structuredClone(record));
        },
        async delete(id) {
            records.delete(id);
        }
    };
}

describe('editor draft repository', () => {
    it('normalizes the process and document key', () => {
        expect(normalizeDraftContext({ processId: 12, documentId: ' 34 ' })).toEqual({
            processId: '12',
            documentId: '34',
            contextKey: '12:34'
        });
        expect(() => normalizeDraftContext({ processId: '12' })).toThrow('processId and documentId');
    });

    it('saves, lists, and loads snapshots only from the requested document', async () => {
        const dates = [
            new Date('2026-07-29T12:00:00.000Z'),
            new Date('2026-07-29T12:01:00.000Z'),
            new Date('2026-07-29T12:02:00.000Z')
        ];
        const repository = createDraftRepository({
            adapter: createMemoryAdapter(),
            now: () => dates.shift(),
            createId: (() => {
                let id = 0;
                return () => `draft-${++id}`;
            })()
        });

        await repository.saveDraft({
            processId: 'process-1',
            documentId: 'document-1',
            editors: { editorA: '<p>First</p>' }
        });
        const latest = await repository.saveDraft({
            processId: 'process-1',
            documentId: 'document-1',
            editors: { editorA: '<p>Second</p>' }
        });
        await repository.saveDraft({
            processId: 'process-1',
            documentId: 'document-2',
            editors: { editorB: '<p>Other document</p>' }
        });

        const drafts = await repository.listDrafts({
            processId: 'process-1',
            documentId: 'document-1'
        });
        expect(drafts).toHaveLength(2);
        expect(drafts.map((draft) => draft.editors.editorA)).toEqual([
            '<p>Second</p>',
            '<p>First</p>'
        ]);
        await expect(repository.loadDraft({
            processId: 'process-1',
            documentId: 'document-1'
        })).resolves.toEqual(latest);
    });

    it('deletes one snapshot or all snapshots for a document', async () => {
        const repository = createDraftRepository({
            adapter: createMemoryAdapter(),
            now: () => new Date('2026-07-29T12:00:00.000Z'),
            createId: (() => {
                let id = 0;
                return () => String(++id);
            })()
        });
        const first = await repository.saveDraft({
            processId: 'p',
            documentId: 'd',
            editors: { one: 'first' }
        });
        await repository.saveDraft({
            processId: 'p',
            documentId: 'd',
            editors: { one: 'second' }
        });

        await expect(repository.deleteDraft({
            processId: 'p',
            documentId: 'd',
            draftId: first.id
        })).resolves.toBe(true);
        expect(await repository.listDrafts({ processId: 'p', documentId: 'd' })).toHaveLength(1);
        await expect(repository.deleteDraft({ processId: 'p', documentId: 'd' })).resolves.toBe(1);
        expect(await repository.listDrafts({ processId: 'p', documentId: 'd' })).toEqual([]);
    });

    it('retains only the configured number of recent snapshots', async () => {
        let minute = 0;
        const repository = createDraftRepository({
            adapter: createMemoryAdapter(),
            maxSnapshots: 2,
            now: () => new Date(`2026-07-29T12:0${minute++}:00.000Z`),
            createId: () => String(minute)
        });

        for (const content of ['one', 'two', 'three']) {
            await repository.saveDraft({
                processId: 'p',
                documentId: 'd',
                editors: { editor: content }
            });
        }

        expect((await repository.listDrafts({ processId: 'p', documentId: 'd' }))
            .map((draft) => draft.editors.editor)).toEqual(['three', 'two']);
    });
});
