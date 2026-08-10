/**
 * Resolve touched paths for policy gate (git diff or POLICY_TOUCHED_PATHS).
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { REPO_ROOT } from '../lib/scan-feature-descriptors.mjs';

export class TouchedPathsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TouchedPathsError';
    }
}

function tryGit(args, root) {
    try {
        return execFileSync('git', args, {
            cwd: root,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
    } catch {
        return '';
    }
}

function resolveMergeBase(root) {
    const explicit = process.env.POLICY_MERGE_BASE || process.env.POLICY_BASE_SHA;
    if (explicit) {
        const verified = tryGit(['rev-parse', '--verify', `${explicit}^{commit}`], root);
        if (verified) return verified;
        if (process.env.CI === 'true') {
            throw new TouchedPathsError(`configured policy merge base is not available: ${explicit}`);
        }
    }

    const candidates = [
        'origin/master',
        'master',
        'origin/main',
        'main'
    ];
    for (const candidate of candidates) {
        const base = tryGit(['merge-base', 'HEAD', candidate], root);
        if (base) return base;
    }

    // A local checkout without a remote can still validate staged/unstaged work.
    // CI must never silently downgrade an unresolved committed diff to docs-only.
    if (process.env.CI === 'true') {
        throw new TouchedPathsError(
            'unable to resolve policy merge base in CI; fetch the base branch or set POLICY_MERGE_BASE'
        );
    }
    return 'HEAD';
}

/**
 * @param {string} [root]
 * @returns {string[]} repo-relative posix paths
 */
export function resolveTouchedPaths(root = REPO_ROOT) {
    const env = process.env.POLICY_TOUCHED_PATHS;
    if (env && env.trim()) {
        return env
            .split(/[,:\n]/)
            .map((s) => s.trim().replace(/\\/g, '/'))
            .filter(Boolean);
    }

    try {
        const base = resolveMergeBase(root);

        const args =
            base === 'HEAD'
                ? ['diff', '--name-only', 'HEAD']
                : ['diff', '--name-only', `${base}...HEAD`];

        // Also include unstaged/staged local changes for local runs
        const committed = execFileSync('git', args, {
            cwd: root,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        });
        let dirty = '';
        try {
            dirty = execFileSync('git', ['diff', '--name-only'], {
                cwd: root,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            dirty +=
                '\n' +
                execFileSync('git', ['diff', '--name-only', '--cached'], {
                    cwd: root,
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'ignore']
                });
        } catch {
            /* ignore */
        }

        const set = new Set();
        for (const line of `${committed}\n${dirty}`.split('\n')) {
            const p = line.trim().replace(/\\/g, '/');
            if (p) set.add(p);
        }

        // Untracked files (important for local slices before first commit)
        try {
            const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
                cwd: root,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore']
            });
            for (const line of untracked.split('\n')) {
                const p = line.trim().replace(/\\/g, '/');
                if (p) set.add(p);
            }
        } catch {
            /* ignore */
        }

        return [...set].sort();
    } catch (err) {
        if (err instanceof TouchedPathsError) throw err;
        throw new TouchedPathsError(`failed to resolve touched paths: ${err.message}`);
    }
}

/**
 * @param {string} rel
 * @param {string} [root]
 */
export function absFromRel(rel, root = REPO_ROOT) {
    return path.join(root, rel);
}
