import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relativePath) => readFileSync(join(rootDir, relativePath), 'utf8');

describe('native SHA-256 migration', () => {
    it('keeps SHA-256 in Web Crypto and leaves only the legacy MD5 in CryptoJS', () => {
        const crypto = read('src/core/crypto.js');
        const body = read('src/features/sei-functions/body.js');

        expect(crypto).toContain("subtle.digest('SHA-256'");
        expect(body).toContain("import { sha256Hex } from '../../core/crypto.js'");
        expect(body.match(/await sha256Hex\(/g)).toHaveLength(2);
        expect(body).not.toContain('CryptoJS.SHA256');
        expect(body.match(/CryptoJS\.MD5\(/g)).toHaveLength(2);
    });
});
