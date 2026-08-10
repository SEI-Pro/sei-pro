import { describe, expect, it } from 'vitest';
import { format2DecimalDomain } from '../../../src/shared/sei-runtime/domain.ts';

describe('sei-functions domain', () => {
  it('formats decimals like the legacy helper', () => {
    expect(format2DecimalDomain(1)).toBe('1.00');
    expect(format2DecimalDomain('2.5')).toBe('2.50');
    expect(format2DecimalDomain('x')).toBe('0.00');
  });
});
