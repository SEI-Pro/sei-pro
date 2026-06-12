/**
 * moment-global-shim.js
 *
 * Correção para Chrome MV3 content scripts:
 * O moment.js usa padrão UMD. No isolated world do Chrome MV3, a detecção
 * `typeof exports === 'object'` pode ser verdadeira, fazendo o moment exportar
 * via module.exports em vez de definir window.moment. O plugin
 * moment-duration-format busca em `this.moment` (= window.moment) e falha.
 *
 * Esta shim garante que window.moment sempre esteja disponível.
 */
(function () {
  'use strict';
  if (typeof window.moment === 'undefined') {
    // Tenta recuperar de todas as formas possíveis
    if (typeof moment !== 'undefined') {
      window.moment = moment;
    } else if (typeof globalThis !== 'undefined' && globalThis.moment) {
      window.moment = globalThis.moment;
    } else if (typeof self !== 'undefined' && self.moment) {
      window.moment = self.moment;
    }
  }
}());
