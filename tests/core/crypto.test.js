import { describe, expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import { sha256Hex } from '../../src/core/crypto.ts';

describe('Web Crypto helpers', () => {
    it('calculates the standard SHA-256 test vector from text', async () => {
        await expect(sha256Hex('abc', webcrypto)).resolves.toBe(
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
        );
    });

    it('accepts ArrayBuffer views and Blob/File-like inputs', async () => {
        const bytes = new TextEncoder().encode('sei-pro');
        const expected = await sha256Hex(bytes, webcrypto);
        expect(await sha256Hex(bytes.buffer, webcrypto)).toBe(expected);
        expect(await sha256Hex(new Blob([bytes]), webcrypto)).toBe(expected);
    });

    it('fails explicitly when Web Crypto is unavailable', async () => {
        await expect(sha256Hex('abc', {})).rejects.toThrow('Web Crypto SHA-256 is unavailable');
    });
});

