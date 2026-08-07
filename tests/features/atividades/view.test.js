// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { installAtividadesView } from '../../../src/features/atividades/view.ts';

describe('atividades/view', () => {
  let root;

  beforeEach(() => {
    globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__ = true;
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
    delete globalThis.getPanelAtiv;
    delete globalThis.updateAtividade_;
    delete globalThis.changePanelHome;
    delete globalThis.toggleTablePro;
    delete globalThis.getPanelAtividades_;
    delete globalThis.removeConfigRow;
    delete globalThis.actionsAtividade;
    delete globalThis.openDialogDoc;
    delete globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__;
  });

  it('installAtividadesView delegates named chrome acts once', () => {
    const getPanelAtiv = vi.fn();
    const updateAtividade_ = vi.fn();
    const changePanelHome = vi.fn();
    globalThis.getPanelAtiv = getPanelAtiv;
    globalThis.updateAtividade_ = updateAtividade_;
    globalThis.changePanelHome = changePanelHome;

    installAtividadesView(root);
    installAtividadesView(root);

    root.innerHTML = `
      <button data-act="atividades-panel-view" data-value="Tabela"></button>
      <a data-act="atividades-update"></a>
      <a data-act="atividades-panel-home" data-value="Configuracao"></a>
    `;

    root.querySelector('[data-act="atividades-panel-view"]').click();
    root.querySelector('[data-act="atividades-update"]').click();
    root.querySelector('[data-act="atividades-panel-home"]').click();

    expect(getPanelAtiv).toHaveBeenCalledOnce();
    expect(updateAtividade_).toHaveBeenCalledOnce();
    expect(changePanelHome).toHaveBeenCalledOnce();
  });

  it('handles panel show/hide chrome', () => {
    const toggleTablePro = vi.fn();
    const getPanelAtividades_ = vi.fn();
    globalThis.toggleTablePro = toggleTablePro;
    globalThis.getPanelAtividades_ = getPanelAtividades_;

    installAtividadesView(root);
    root.innerHTML = `
      <a data-act="atividades-panel-show"></a>
      <a data-act="atividades-panel-hide"></a>
    `;

    root.querySelector('[data-act="atividades-panel-show"]').click();
    expect(toggleTablePro).toHaveBeenCalledWith('#atividadesProDiv', 'show');
    expect(getPanelAtividades_).toHaveBeenCalledOnce();

    root.querySelector('[data-act="atividades-panel-hide"]').click();
    expect(toggleTablePro).toHaveBeenCalledWith('#atividadesProDiv', 'hide');
  });

  it('dispatches generic atividades-call with data-fn and data-id', () => {
    const removeConfigRow = vi.fn();
    const actionsAtividade = vi.fn();
    globalThis.removeConfigRow = removeConfigRow;
    globalThis.actionsAtividade = actionsAtividade;

    installAtividadesView(root);
    root.innerHTML = `
      <button data-act="atividades-call" data-fn="removeConfigRow"></button>
      <a data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="42" data-arg="action"></a>
    `;

    root.querySelector('[data-fn="removeConfigRow"]').click();
    root.querySelector('[data-fn="actionsAtividade"]').click();

    expect(removeConfigRow).toHaveBeenCalledOnce();
    expect(removeConfigRow.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
    expect(actionsAtividade).toHaveBeenCalledWith(42, 'action');
  });

  it('dispatches dialog-doc act', () => {
    const openDialogDoc = vi.fn();
    globalThis.openDialogDoc = openDialogDoc;
    installAtividadesView(root);
    root.innerHTML = `
      <a data-act="atividades-dialog-doc"
         data-title="Doc (123)"
         data-id-procedimento="9"
         data-id-documento="8"></a>
    `;
    root.querySelector('[data-act="atividades-dialog-doc"]').click();
    expect(openDialogDoc).toHaveBeenCalledWith({
      title: 'Doc (123)',
      id_procedimento: '9',
      id_documento: '8'
    });
  });

  it('applies data-input-filter and data-on blur/input without firing click-only acts', () => {
    const checkInputEmail = vi.fn();
    const getPanelAtiv = vi.fn();
    globalThis.checkInputEmail = checkInputEmail;
    globalThis.getPanelAtiv = getPanelAtiv;

    installAtividadesView(root);
    root.innerHTML = `
      <input id="email" data-act="atividades-call" data-fn="checkInputEmail" data-on="blur" />
      <input id="digits" data-input-filter="digits" value="12a3b" />
      <button data-act="atividades-panel-view"></button>
    `;

    const email = root.querySelector('#email');
    email.focus();
    email.blur();
    expect(checkInputEmail).toHaveBeenCalledOnce();

    const digits = root.querySelector('#digits');
    digits.value = '12a3b';
    digits.dispatchEvent(new Event('input', { bubbles: true }));
    expect(digits.value).toBe('123');

    // focusout on a click-only chrome act must not dispatch it
    const btn = root.querySelector('[data-act="atividades-panel-view"]');
    btn.focus();
    btn.blur();
    expect(getPanelAtiv).not.toHaveBeenCalled();
  });

  it('delegates data-tip to infraTooltipMostrar/Ocultar (decoded attribute value)', () => {
    const infraTooltipMostrar = vi.fn();
    const infraTooltipOcultar = vi.fn();
    globalThis.infraTooltipMostrar = infraTooltipMostrar;
    globalThis.infraTooltipOcultar = infraTooltipOcultar;

    installAtividadesView(root);
    root.innerHTML = `<a id="tip" data-tip="Homologa&ccedil;&atilde;o">x</a>`;
    const el = root.querySelector('#tip');

    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(infraTooltipMostrar).toHaveBeenCalledOnce();
    expect(infraTooltipMostrar.mock.calls[0][0]).toBe('Homologação');

    el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    expect(infraTooltipOcultar).toHaveBeenCalledOnce();

    delete globalThis.infraTooltipMostrar;
    delete globalThis.infraTooltipOcultar;
  });

  it('passes optional data-tip-title as second arg to infraTooltipMostrar', () => {
    const infraTooltipMostrar = vi.fn();
    globalThis.infraTooltipMostrar = infraTooltipMostrar;

    installAtividadesView(root);
    root.innerHTML = `<div id="tip" data-tip="body html" data-tip-title="Title 10%"></div>`;
    root.querySelector('#tip').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(infraTooltipMostrar).toHaveBeenCalledWith('body html', 'Title 10%');
    delete globalThis.infraTooltipMostrar;
  });
});
