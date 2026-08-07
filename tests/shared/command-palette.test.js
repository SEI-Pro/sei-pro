// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCommandPalette } from '../../src/shared/ui/command-palette.ts';

const palettes = [];

afterEach(() => {
  palettes.splice(0).forEach((palette) => palette.destroy());
  document.body.replaceChildren();
});

function palette(options) {
  const instance = createCommandPalette(options);
  palettes.push(instance);
  return instance;
}

describe('createCommandPalette', () => {
  it('opens with Ctrl+K and filters labels and keywords', () => {
    const instance = palette({
      commands: [
        { id: 'summarize', label: 'Summarize document', keywords: ['AI'], run() {} },
        { id: 'copy', label: 'Copy number', run() {} }
      ]
    });

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    }));

    expect(instance.el.isConnected).toBe(true);
    expect(instance.el.hidden).toBe(false);
    expect(instance.filter('ai').map((command) => command.id)).toEqual(['summarize']);
    expect(instance.el.querySelectorAll('.seipro-palette-command')).toHaveLength(1);
  });

  it('runs the selected command and closes', () => {
    const run = vi.fn();
    const instance = palette({
      commands: [{ id: 'draft', label: 'Draft response', run }]
    });

    instance.open();
    instance.el.querySelector('.seipro-palette-command').click();

    expect(run).toHaveBeenCalledOnce();
    expect(instance.el.hidden).toBe(true);
  });
});
