// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createStreamPanel } from '../../src/shared/ui/stream-panel.ts';

afterEach(() => {
  document.body.replaceChildren();
});

describe('createStreamPanel', () => {
  it('streams text, status, and tools into a vanilla panel', () => {
    const panel = createStreamPanel({ title: 'Draft' });

    panel.open()
      .appendDelta('Hello')
      .appendDelta(' world')
      .setStatus('Complete')
      .setTools([{ name: 'lookup_process' }]);

    expect(panel.getText()).toBe('Hello world');
    expect(document.querySelector('.seipro-stream-title').textContent).toBe('Draft');
    expect(document.querySelector('.seipro-stream-status').textContent).toBe('Complete');
    expect(document.querySelector('.seipro-stream-tool').textContent).toBe('lookup_process');
  });

  it('invokes lifecycle callbacks with the current output', () => {
    const onAccept = vi.fn();
    const onDiscard = vi.fn();
    const onStop = vi.fn();
    const onRetry = vi.fn();
    const panel = createStreamPanel({ onAccept, onDiscard, onStop, onRetry });
    panel.open().appendDelta('Result');

    panel.el.querySelector('.seipro-stream-stop').click();
    panel.el.querySelector('.seipro-stream-retry').click();
    panel.el.querySelector('.seipro-stream-accept').click();
    panel.el.querySelector('.seipro-stream-discard').click();

    expect(onStop).toHaveBeenCalledWith(panel);
    expect(onRetry).toHaveBeenCalledWith(panel);
    expect(onAccept).toHaveBeenCalledWith('Result', panel);
    expect(onDiscard).toHaveBeenCalledWith(panel);
    expect(panel.el.isConnected).toBe(false);
  });
});
