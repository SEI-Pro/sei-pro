// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { bindParentAtividadesActions } from '../../../src/features/arvore/view.ts';

describe('arvore/bindParentAtividadesActions', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('delegates parent-atividades clicks to callParentAtividades', () => {
    const callParentAtividades = vi.fn();
    bindParentAtividadesActions({ root, callParentAtividades });
    root.innerHTML = `
      <a href="#" data-seipro-arvore-action="parent-atividades" data-fn="actionsAtividade" data-id="42">open</a>
    `;
    root.querySelector('a').click();
    expect(callParentAtividades).toHaveBeenCalledWith('actionsAtividade', 42);
  });
});
