/** Raiz de composição do contexto OPTIONS — ADR-0002/0005. */
import { installOptionsPage } from '../options/view.js';

export async function bootOptionsContext() {
    return installOptionsPage();
}

export function startOptionsContext() {
    const run = () => {
        bootOptionsContext().catch((error) => {
            console.error('options: failed to boot', error);
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
}

startOptionsContext();
