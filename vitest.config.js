import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src')
        }
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js']
    }
});
