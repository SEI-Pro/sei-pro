import { describe, expect, it } from 'vitest';
import {
    createReviewMetadata,
    formatReviewTime
} from '../../../../src/features/editor/domain/review.ts';

describe('review authorship metadata', () => {
    it('formats the legacy display time', () => {
        const date = new Date(2026, 6, 29, 17, 42, 30);
        expect(formatReviewTime(date)).toBe('29/07/2026 17:42');
    });

    it('provides semantic and legacy attributes for review marks', () => {
        const date = new Date('2026-07-29T20:42:30.000Z');
        const metadata = createReviewMetadata('  Taylor Reviewer  ', date);

        expect(metadata).toEqual({
            author: 'Taylor Reviewer',
            time: '2026-07-29T20:42:30.000Z',
            legacyDate: formatReviewTime(date),
            attributes: {
                'data-author': 'Taylor Reviewer',
                'data-time': '2026-07-29T20:42:30.000Z',
                'data-user-review': 'Taylor Reviewer',
                'data-date-review': formatReviewTime(date)
            }
        });
    });

    it('rejects an invalid review time', () => {
        expect(() => createReviewMetadata('Reviewer', 'not-a-date')).toThrow('valid date');
    });
});
