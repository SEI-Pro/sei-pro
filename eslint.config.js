/**
 * Flat ESLint for modern layers. Legacy verbatim scripts stay ignored (ADR-0008 / Phase 0).
 *
 * Clean-typed ACL modules (no @ts-nocheck) are ignored until typescript-eslint supports
 * TypeScript 7 — espree cannot parse `type` / `as const` / annotations. tsc --noEmit
 * remains the gate for those files (ADR-0014).
 */
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

/** Verbatim copies from scripts/build.mjs — not linted until decomposed. */
const legacyFiles = [
    'src/features/todas-paginas/sei-pro-all.js',
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
    'src/shared/legacy/**',
    'src/bootstrap/init.js',
    'src/bootstrap/init_all.js',
    'src/bootstrap/init_arvore.js',
    'src/bootstrap/init_db.js',
    'src/bootstrap/init_visualizacao.js',
    'src/bootstrap/init_visualizacao_html.js',
    'src/bootstrap/init-flags.js',
    'src/bootstrap/getscript-isolated.js',
    'src/bootstrap/editor-loader.js',
    'src/platform/inline-stubs-main.js',
    'src/shared/qr-code-main.js',
    'src/background/storage-handler.js',
    'src/background/fetch-handler.js',
    'src/background/bug-report-handler.js',
    'src/background/process-notification-handler.js',
    'src/background/install-handler.js',
    'src/background/router.js'
];

/** Typed without @ts-nocheck — wait for typescript-eslint + TS 7. */
const typedAclPendingEslint = [
    'src/sei/selectors.ts',
    'src/sei/pages.ts',
    'src/sei/supports.ts',
    'src/sei/namespace.ts',
    'src/sei/parse/**/*.ts',
    'src/shared/config-defaults.ts',
    'src/entries/lista-context.ts'
];

export default [
    {
        ignores: [
            'dist/**',
            'vendor/**',
            'node_modules/**',
            'tests/**',
            'scripts/**',
            '**/*.d.ts',
            ...legacyFiles,
            ...typedAclPendingEslint
        ]
    },
    {
        files: [
            'src/core/**/*.{js,ts}',
            'src/platform/**/*.{js,ts}',
            'src/sei/**/*.{js,ts}',
            'src/app/**/*.{js,ts}',
            'src/entries/**/*.{js,ts}',
            'src/types/**/*.{js,ts}',
            'src/dom/**/*.{js,ts}',
            'src/content/**/*.{js,ts}',
            'src/background/**/*.{js,ts}',
            'src/shared/**/*.{js,ts}'
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                chrome: 'readonly',
                browser: 'readonly',
                window: 'readonly',
                document: 'readonly',
                DOMParser: 'readonly',
                XMLSerializer: 'readonly',
                XMLHttpRequest: 'readonly',
                Event: 'readonly',
                Image: 'readonly',
                Node: 'readonly',
                NodeFilter: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                Blob: 'readonly',
                File: 'readonly',
                FileReader: 'readonly',
                FormData: 'readonly',
                Headers: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                AbortController: 'readonly',
                AbortSignal: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                queueMicrotask: 'readonly',
                structuredClone: 'readonly',
                crypto: 'readonly',
                btoa: 'readonly',
                atob: 'readonly',
                TextEncoder: 'readonly',
                TextDecoder: 'readonly',
                Uint8Array: 'readonly',
                ArrayBuffer: 'readonly',
                Promise: 'readonly',
                Map: 'readonly',
                Set: 'readonly',
                WeakMap: 'readonly',
                WeakSet: 'readonly',
                Symbol: 'readonly',
                Proxy: 'readonly',
                Reflect: 'readonly',
                JSON: 'readonly',
                Math: 'readonly',
                Date: 'readonly',
                RegExp: 'readonly',
                Error: 'readonly',
                TypeError: 'readonly',
                RangeError: 'readonly',
                Infinity: 'readonly',
                NaN: 'readonly',
                isNaN: 'readonly',
                parseInt: 'readonly',
                parseFloat: 'readonly',
                encodeURIComponent: 'readonly',
                decodeURIComponent: 'readonly',
                Intl: 'readonly',
                performance: 'readonly',
                self: 'readonly',
                globalThis: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'readonly',
                NodeJS: 'readonly',
                SeiPro: 'readonly',
                $: 'readonly',
                jQuery: 'readonly',
                jmespath: 'readonly',
                moment: 'readonly',
                DOMPurify: 'readonly',
                CryptoJS: 'readonly'
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off'
        },
        rules: {
            // Phase 0: parse + light hygiene only; tighten as @ts-nocheck debt falls.
            ...Object.fromEntries(
                Object.keys(js.configs.recommended.rules || {}).map((name) => [name, 'off'])
            ),
            'no-undef': 'error',
            'no-unreachable': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'valid-typeof': 'error'
        }
    },
    prettier
];
