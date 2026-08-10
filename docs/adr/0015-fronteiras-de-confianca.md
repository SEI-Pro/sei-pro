# ADR-0015 — Fronteiras de confiança explícitas; todo dado do SEI é não confiável

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0002, ADR-0003, ADR-0008, ADR-0009

## Contexto

A extensão roda dentro de um sistema que tramita processos administrativos de um órgão de
segurança pública. O dado que ela manipula inclui nome, CPF, número de processo, documento
sigiloso e conteúdo de investigação. Mesmo assim, o projeto nunca registrou onde estão suas
fronteiras de confiança. A medição de 2026-08-07 mostra o efeito:

**Permissão curinga anula a lista de permissões.** `manifest.base.json` enumera os provedores
de LLM em `optional_host_permissions` (`api.openai.com`, `api.anthropic.com`,
`generativelanguage.googleapis.com`, `api.moonshot.ai`, `localhost`) — e em seguida inclui
**`https://*/*`**. O curinga torna a enumeração decorativa: uma vez concedido, a extensão
alcança qualquer origem HTTPS da web.

**Padrões inválidos no manifesto.** A versão anterior tentava restringir os 141 recursos de
`web_accessible_resources` por caminho e query (`*://*.br/...php?acao=*`). O Chrome não aceita
query em match patterns e, para recursos acessíveis à web, aceita apenas o padrão de origem
com caminho final `/*`; por isso a extensão nem sequer carregava. A correção separa as
responsabilidades: WAR usa uma allowlist de origens conhecidas e os filtros por `acao` ficam
em `include_globs`/`exclude_globs` dos content scripts. Os curingas de host no nível de TLD
(`*.br`, `*.org`) também não são suportados pelo Chrome; os match patterns usam host curinga
com caminho e deixam a seleção de domínio para os globs.

**Sanitização praticamente ausente.** Há **110** escritas em `innerHTML` e **405** chamadas
a `.html()` do jQuery em `src/`, contra **1** único uso de `DOMPurify.sanitize`. O HTML vem do
DOM do SEI, isto é, de conteúdo que outros usuários inseriram.

**Telemetria envia log cru para terceiro, por padrão.** `script.google.com` e
`script.googleusercontent.com` estão em `host_permissions` **obrigatório** (não opcional).
`src/platform/report.js` coleta o console da página e envia o texto integral; não há nenhuma
função de anonimização, redação ou máscara no arquivo. Log de página do SEI contém número de
processo e nome de parte.

**Credencial em armazenamento sincronizado.** Os campos de credencial de base
(`API_KEY`, `KEY_USER`, `CLIENT_ID`, `spreadsheetId`) entram em `dataValues`
(`src/options/domain.js`), que `src/options/io.js` persiste em **`chrome.storage.sync`** —
replicado para a conta Google do usuário. As chaves de LLM, por contraste, já estão
corretamente em `storage.local` (`src/background/llm-handler.js`).

**`eval` no mundo da página.** `src/features/arvore-info/dom/confirm.js` executa
`winObj.eval(...)` para sobrescrever `window.confirm`.

Nada disso é malícia: é ausência de fronteira declarada. Sem a fronteira, cada feature decide
sozinha, e a decisão mais permissiva prevalece.

## Decisão

**Três fronteiras de confiança são declaradas e verificadas por máquina.**

### Fronteira 1 — Dado do SEI é entrada não confiável

DOM, URL, `document.title`, resposta de `fetch` ao SEI: tudo é entrada hostil, tratada na
fronteira do ACL (ADR-0003), nunca no meio da feature.

- **Proibido** construir HTML por concatenação com dado do SEI. Texto vai por `textContent`;
  estrutura vai por API de DOM ou `<template>`.
- Quando HTML do SEI precisa ser reexibido (só o editor e a visualização precisam), passa
  obrigatoriamente por `DOMPurify.sanitize` num único ponto do ACL, não no call-site.
- Parser do ACL valida e **rejeita**; não presume forma. Retorno tipado (ADR-0014).

### Fronteira 2 — Menor privilégio no manifest

- **`https://*/*` é removido de `optional_host_permissions`.** Provedor de LLM próprio
  (institucional ou local) passa a ser autorizado por `chrome.permissions.request` para a
  **origem exata** que o usuário digitou, em tempo de execução.
- `web_accessible_resources` restrito ao mínimo realmente carregado pela página e a uma
  allowlist explícita de origens (`sei.prf.gov.br`, domínios institucionais conhecidos e os
  endpoints ANS legados). Como o Chrome exige `/*` nesse campo, a granularidade de caminho e
  query fica nos `matches`/`include_globs` dos content scripts — nunca em WAR. Uma origem nova
  exige ADR; `use_dynamic_url` continua disponível quando aplicável.
- Toda permissão nova exige ADR, com justificativa que sobreviva à revisão da Chrome Web
  Store: qual feature, qual origem, por quê o escopo não pode ser menor.
- **Nenhum `eval`, em nenhum mundo**, inclusive MAIN. Sobrescrever API da página se faz por
  `Object.defineProperty` a partir de script injetado, que é o que o próprio
  `confirm.js` já tenta primeiro.

### Fronteira 3 — Nada sai da máquina sem consentimento explícito

- **Segredo nunca em `storage.sync`.** Credencial vive em `storage.local`. A migração de
  `dataValues` move os campos de credencial e mantém em `sync` apenas preferência não
  sensível.
- **Content script não fala com rede externa.** Quem fala é o service worker — como
  `llm-handler.js` já faz. Isso mantém segredo e resposta fora do mundo da página, onde
  qualquer script do SEI poderia lê-los.
- **Telemetria é opt-in e nunca carrega conteúdo de página.** `script.google.com` sai de
  `host_permissions` obrigatório para `optional_host_permissions`. Antes do envio, o log
  passa por redação de padrões de identificação (número de processo, CPF, CNPJ, e-mail,
  nome de usuário). O usuário vê o que será enviado antes de enviar.
- **Conteúdo de processo só vai para LLM externo por ação deliberada**, com o destino
  nomeado na interface no momento do envio. A configuração (ADR-0009) inclui chave que
  permite à instituição **desabilitar provedores externos**, restringindo a extensão a
  provedor local ou institucional.

## Consequências

**Ganhamos:** a superfície declarada passa a corresponder à necessidade real, o que reduz
tanto o risco quanto o atrito na revisão da Chrome Web Store; o dado sensível para de sair
por canais que ninguém escolheu (log de telemetria, `storage.sync`); e XSS via conteúdo de
processo deixa de depender de cada autor de feature lembrar de sanitizar.

**Pagamos:** o provedor de LLM customizado passa a exigir um fluxo de permissão em tempo de
execução, que é mais código e mais um passo para o usuário. A telemetria opt-in vai receber
menos relatórios — o que piora o diagnóstico de bugs em campo, e é um custo real que se
aceita. A migração de `dataValues` de `sync` para `local` faz o usuário reconfigurar
credenciais em máquinas secundárias, porque elas deixam de ser replicadas — comportamento
correto, percebido como regressão. E restringir `web_accessible_resources` pode quebrar
carregamento sob demanda que hoje funciona por acidente do escopo largo.

**Fica proibido:** `innerHTML`/`.html()` com string derivada de dado do SEI; `eval` em
qualquer mundo; permissão curinga de host; segredo em `storage.sync`; envio de conteúdo de
página em telemetria; `fetch` a origem externa a partir de content script.

## Verificação

- `tests/structure/manifest-permissions.test.js`:
  - `optional_host_permissions` não contém `https://*/*` nem outro curinga de host;
  - `permissions` e `host_permissions` casam com uma allowlist versionada — crescer exige
    editar a allowlist, o que aparece no diff e exige ADR;
  - `matches`/`exclude_matches` de content scripts não contêm query ou fragmento;
  - não há wildcard de host diretamente no TLD (`*.br`, `*.org`);
  - queries de ações aparecem somente em `include_globs`/`exclude_globs`;
  - `web_accessible_resources.matches` termina em `/*` e é igual à allowlist versionada de
    origens.
- `tests/structure/no-eval.test.js` — nenhuma ocorrência de `eval(` ou `new Function(` em
  `src/`, exceto em comentário que documente a remoção.
- `tests/structure/secrets-storage.test.js` — nenhuma chave da lista de segredos
  (`API_KEY`, `KEY_USER`, `CLIENT_ID`, `spreadsheetId`, `apiKey`, `key`) é escrita em
  `storage.sync`.
- `tests/structure/telemetry-scrub.test.js` — `report.js` aplica a função de redação antes de
  montar o payload, e o payload não inclui HTML nem `document` da página.
- **Ratchet de injeção de HTML** (ADR-0008): contagem de `innerHTML =`, `insertAdjacentHTML`
  e `.html(` em `src/` fora do ACL, monotonicamente decrescente. Linha de base 2026-08-07:
  110 + 8 + 405.
- **Ratchet de `fetch` em content script**: decrescente.

## Alternativas consideradas

**Confiar no DOM do SEI, por ser sistema interno atrás de autenticação** — rejeitada. O
conteúdo do processo é escrito por usuários, incluindo anexos e texto de origem externa; a
autenticação protege o acesso ao sistema, não a integridade do que trafega nele. E o mesmo
DOM é servido por dezenas de instâncias de órgãos diferentes, com versões e customizações que
o projeto não controla (ADR-0003).

**Sanitizar no call-site, onde o HTML é usado** — rejeitada: são 515 pontos e cada novo
autor de feature precisaria lembrar. Sanitização é propriedade da fronteira, não do consumo;
é isso que torna a regra verificável por máquina.

**Manter `https://*/*` por conveniência do provedor customizado** — rejeitada. É a permissão
mais ampla que a extensão poderia pedir, para atender um caso de uso minoritário, e é o item
com maior probabilidade de travar ou atrasar a revisão da Chrome Web Store.

**Bloquear LLM externo por completo** — rejeitada: features de IA já existem e são usadas. A
decisão correta é tornar o fluxo explícito e deixar a instituição capaz de desativá-lo por
configuração, não decidir pelo órgão dentro do código.
