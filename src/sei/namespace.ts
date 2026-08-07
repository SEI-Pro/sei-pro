/**
 * Narrow helpers for the SEI ACL — avoid repeating `getSeiPro().sei!` casts.
 */
import { getSeiPro } from '../core/global.js';
import type { SeiProNamespace, SeiProSeiVersion } from '../types/seipro.js';

export type SeiBag = SeiProNamespace['sei'];

export function seiNamespace(): SeiBag {
    const root = getSeiPro();
    if (!root || !root.sei) {
        throw new Error('SeiPro.sei is not installed');
    }
    return root.sei;
}

export function seiVersion(): SeiProSeiVersion {
    const version = seiNamespace().version;
    if (!version) {
        throw new Error('SeiPro.sei.version is not installed');
    }
    return version;
}
