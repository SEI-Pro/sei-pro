# CHROME v1.7.0 — Reversionamento SemVer (2026-06-12)

**Base de versionamento:** `1.6.11` → `1.7.0` (SemVer 2.0.0)
**Código:** idêntico ao pacote anteriormente rotulado `9.0.12` — esta entrada registra exclusivamente a renumeração do pacote; nenhuma linha de código foi alterada.
**Justificativa SemVer:** a partir da base `1.6.11`, as alterações acumuladas incluem novas funcionalidades retrocompatíveis (botão "Voltar ao Topo" — `initBtnVoltarTopo` — e botão "Atualizar lista" nas Ações em lote) → incremento de MINOR com PATCH zerado. As correções (downloads em lote, ícones do modo slim, seletores SEI 4.1.5, refactor do fluxo de render) são PATCH, absorvidas pelo incremento MINOR. Sem quebras de compatibilidade (MAJOR inalterado).
**Rastreabilidade:** os marcadores internos `[FIX v9.0.x]` / `[REFACTOR v9.0.x]` nos comentários do código referem-se ao histórico interno de patches e foram mantidos intencionalmente para auditoria; não representam a versão do pacote.
**Paridade entre navegadores:** Chrome v1.7.0 (MV3) e Firefox v1.7.0 (MV2) compartilham o mesmo código-fonte; as únicas diferenças são as adaptações de plataforma documentadas na entrada FIREFOX v1.7.0.
**Manifest:** MV3 (Chrome)

> **ATENÇÃO — efeito colateral de downgrade numérico:** `1.7.0 < 9.0.12` na comparação de versões do Chrome. Em instalações onde o pacote `9.0.12` já esteja carregado COMO EXTENSÃO INSTALADA (CRX/política corporativa), o Chrome NÃO aplicará `1.7.0` como atualização automática — será necessário remover e reinstalar. Para carregamento descompactado ("Load unpacked", modo desenvolvedor), não há impacto.

---

# SEI Pro — Patches e Correções de Bugs
**Versão:** 1.0.0-patched  
**Base:** sei-pro-master (GitHub, kernel SEI 4.1.5)  
**Data:** 2025-05-15  
**Pacotes gerados:** `sei-pro-patched-CHROME.zip` (MV3) · `sei-pro-patched-FIREFOX.zip` (MV2)

---

## Arquivos modificados

### `manifest.json` *(Chrome MV3 e Firefox MV2)*
- **S-06** Remove `*://*/controlador.php*` de `host_permissions` (wildcard desnecessário)
- **S-10** Remove permissão `storage` não utilizada
- Adiciona `js/moment-global-shim.js` entre `moment.min.js` e `moment-duration-format.min.js` em todos os `content_scripts`
- `web_accessible_resources.matches` alterado para `"<all_urls>"` (Chrome MV3 rejeita wildcards de URL nesse campo)

---

### `background.js`
- **CSP-FIX** Adiciona listener `chrome.runtime.onMessage` para requisições `FETCH_EXTERNAL`
  - Proxy seguro para `seipro.app` e `sei-pro.github.io` (whitelist de domínios)
  - Necessário porque o CSP do SEI (`default-src 'self'`) bloqueia conexões externas feitas por content scripts
  - O background service worker tem origem própria e não é sujeito ao CSP da página

---

### `js/init_all.js`
- **DIALOG-FIX** Garante que `jquery-ui.min.js` seja carregado no contexto da página do frame principal *antes* de `sei-functions-pro.js`
  - `$.getScript()` injeta código no contexto da PAGE (via `<script>` tag), não no isolated world
  - O jQuery da SEI no frame `procedimento_trabalhar` não tem jQuery UI → `.dialog()` falhava
  - Solução: verifica `$.fn.dialog`; se ausente, carrega `jquery-ui.min.js` da extensão no callback antes de `sei-functions-pro.js`

---

### `js/init_arvore.js`
- **DIALOG-FIX / RESIZABLE-FIX** Garante carregamento sequencial de dependências no contexto do `ifrArvore`
  1. Verifica `document.head` antes de qualquer `$.getScript()` (evita `appendChild on null`)
  2. Carrega `jquery-ui.min.js` *antes* de `sei-functions-pro.js` e `sei-pro-arvore.js`
  3. Carrega `jquery.tablesorter.combined.min.js` para as tabelas do Ações em Lote
  4. Carrega `moment.min.js` → `moment-weekday-calc.js` → `moment-duration-format.min.js` em sequência via callbacks (usa `window.moment` para verificar, não `typeof moment`)
- **isSEI_5-FIX** Serializa carregamento: `sei-pro-arvore.js` agora carrega somente no callback de `sei-functions-pro.js`

---

### `js/sei-functions-pro.js`
- **AÇÕES-EM-LOTE-FIX #1** `getListDocumentosArvore()`: seletor `#divArvore a[target]` com 4 níveis de fallback para SEI 4.1.5 (iframe renomeado)
- **AÇÕES-EM-LOTE-FIX #2** `appendIconBatchActions()`: loop `setTimeout` limitado a 20 tentativas (~30s) + fallback de seletor
- **AÇÕES-EM-LOTE-FIX #3** `getAllLinksFolder()`: 3 seletores adicionais de fallback
- **S-01** XSS: `innerHTML` → DOM API (`createElement`/`textContent`) em `getDocumentosActions()`
- **S-02** Validação de IDs com `/^\d+$/` antes de construção de URLs
- **S-03** `window.open` → `noopener,noreferrer`
- **S-04** Listener `keydown` → `AbortController` (sem acúmulo de listeners)
- **S-05** `nivelAcesso` restrito a whitelist
- **S-07** `MutationObserver.disconnect()` após inserção bem-sucedida do botão
- **S-08** ReDoS: regex `{10,}` → `{10,20}`
- **S-09** Token CSRF movido para header `X-CSRF-Token` (não mais em query string)
- **S-11** `doc.id` removido de `console.error`
- **S-12** Abort se token CSRF nulo em operações de escrita
- **S-13** Reload de `ifrArvore.src` movido para após conclusão do loop
- **RESIZABLE-GUARD** `loadResizeIframeArvoreNewSEI()`: guard `typeof $.fn.resizable !== 'function'` dentro do setTimeout

---

### `js/sei-pro-arvore.js`
- **isSEI_5-FIX** Linha 12: `const anchorDoc = isSEI_5 ? ...` → `const anchorDoc = (typeof isSEI_5 !== 'undefined' && isSEI_5) ? ...`
  - Evita `ReferenceError: isSEI_5 is not defined` quando `sei-pro-arvore.js` executa antes de `sei-functions-pro.js` terminar

---

### `js/sei-pro-atividades.js`
- **CSP-FIX** `getServersPro()`: `$.ajax({ url: 'https://seipro.app/servers/' })` substituído por `chrome.runtime.sendMessage({ type: 'FETCH_EXTERNAL', url: '...' })`
  - Requisição delegada ao background service worker que não está sujeito ao CSP da página SEI
- **SYNTAX-FIX** Removido `}` extra introduzido na refatoração do `$.ajax → _handleServersResult`

---

### `js/moment-global-shim.js` *(arquivo novo)*
- Criado para garantir que `window.moment` esteja definido antes de `moment-duration-format.min.js` carregar
- Necessário porque no Chrome MV3 o UMD do moment pode exportar via `module.exports` em vez de `window.moment`

---

### `js/lib/moment-duration-format.min.js`
- **MOMENT-FIX-1** IIFE final `}(this)` → `}(this || self || window || globalThis || {})` (fallback robusto de global)
- **MOMENT-FIX-2** `throw "Moment Duration Format cannot find Moment.js"` → `return` (falha silenciosa em vez de crash)
  - O plugin não inicializa se `moment` não for encontrado, em vez de lançar exceção e quebrar a página

---

## Sumário de segurança (13 patches)

| ID | Severidade | Descrição |
|----|-----------|-----------|
| S-01 | 🔴 Crítica | XSS via `innerHTML` corrigido com DOM API |
| S-02 | 🟠 Alta | Validação `/^\d+$/` em IDs antes de URLs |
| S-03 | 🟠 Alta | `window.open` com `noopener,noreferrer` |
| S-04 | 🟠 Alta | AbortController em listeners `keydown` |
| S-05 | 🟡 Média | `nivelAcesso` em whitelist |
| S-06 | 🟡 Média | Wildcard de host desnecessário removido |
| S-07 | 🟡 Média | MutationObserver desconectado após uso |
| S-08 | 🟡 Média | Proteção contra ReDoS em regex |
| S-09 | 🟡 Média | CSRF token em header (não query string) |
| S-10 | 🟡 Média | Permissão `storage` desnecessária removida |
| S-11 | 🔵 Baixa | `doc.id` removido de logs de erro |
| S-12 | 🔵 Baixa | Abort em operações de escrita sem CSRF |
| S-13 | 🔵 Baixa | Reload do `ifrArvore` após conclusão do loop |
