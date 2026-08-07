# ADR-0009 — Configuração declarada num schema único, fonte de verdade compartilhada

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0004, ADR-0005, ADR-0007

## Contexto

A configuração é o mecanismo de feature flag do produto: cada capacidade é ligada e
desligada por uma chave, lida por `verifyConfigValue` / `checkConfigValue` /
`getConfigValue`. Medido em 2026-08-07:

| Métrica | Valor |
|---|---|
| Chamadas a `verifyConfigValue` | 177 |
| Chamadas a `checkConfigValue` | 105 |
| Chamadas a `getConfigValue` | 45 |
| **Total de pontos de leitura** | **327** |
| Chaves distintas usadas como literal de string | **79** |
| Chaves com default declarado (`shared/config-defaults.js`) | **7** |
| Opções catalogadas em `docs/mapping-funcoes-configuracoes/opcoes_funcoes.csv` | ~72 |

As chaves são *stringly typed*: `'autopreenchersenha'`, `'filtrarpaginapelapesquisarapida'`,
`'mostraranotacaocontrole'`. Não existe declaração central das 79 chaves, do tipo de cada
uma, do default, nem de qual feature a consome. Um erro de digitação numa das 327 leituras
faz a feature ficar desligada silenciosamente — `verifyConfigValue` de chave inexistente é
falsy, indistinguível de "usuário desligou".

O risco não é hipotético; está documentado no próprio código. `shared/config-defaults.js`
avisa que uma divergência entre a lista de defaults e a página de options faz a interface
mostrar "ligado" enquanto o content script trata como desligado. Esse arquivo cobre 7 das
79 chaves; para as outras 72 não há nada que garanta a coerência. E o contador não fecha:
79 chaves usadas no código contra ~72 catalogadas no CSV.

Há ainda o armazenamento. A configuração vive em `chrome.storage.sync` e é cacheada em
`localStorage` como JSON em `configBasePro`, sem versão nem migração. Renomear ou mudar o
tipo de uma chave hoje quebra silenciosamente a instalação de quem já tem o valor antigo
salvo — e não há como saber que formato um usuário tem.

## Decisão

**Todas as chaves de configuração são declaradas num schema único, e o schema é a fonte de
verdade para o código, para a página de options e para a documentação.**

```js
// src/config/schema.js
export const CONFIG_SCHEMA = {
    autopreenchersenha: {
        type: 'boolean',
        default: true,
        feature: 'login',              // cruzado com o descritor de ADR-0004
        label: 'Autopreencher senha',  // exibido na página de options
        page: 'AUTOPREENCHERSENHA.md'  // documentação em pages/
    },
    // …
};
```

Regras operacionais:

- Leitura de configuração é feita por chave **do schema**, não por literal solto. Em código
  novo, via `deps.config` injetado (ADR-0005).
- Ler chave que não está no schema é **erro em desenvolvimento** e default seguro em
  produção — nunca falsy silencioso. Isso é o que transforma erro de digitação de bug
  invisível em falha imediata.
- A página de options **gera** sua lista a partir do schema cruzado com os descritores de
  feature. `shared/config-defaults.js` deixa de existir; o default mora no schema.
- Cada entrada aponta para a feature que a consome (ADR-0007) e para sua página em `pages/`.
  Chave sem feature, ou feature sem chave, é falha de teste.

**Storage versionado.** O objeto persistido carrega uma versão de schema, e `src/config/`
tem migrações ordenadas aplicadas na leitura. Renomear chave passa a ser uma migração, não
uma quebra silenciosa. A mesma regra vale para qualquer dado persistido pela extensão
(monitorados, projetos, perfis de IA): estrutura persistida tem versão e migração.

## Consequências

**Ganhamos:** o inventário de flags do produto passa a existir em um lugar; erro de
digitação em chave vira falha imediata em vez de feature silenciosamente morta;
impossibilidade estrutural de a página de options divergir do que o código lê — que é o
risco que o próprio código já documentava; renomear ou mudar tipo de chave passa a ser
operação segura; base para auditar quais capacidades existem, ligada aos ~80 arquivos de
`pages/`.

**Pagamos:** o inventário inicial das 79 chaves é trabalho manual e chato, e precisa
conferir contra o CSV de mapeamento para resolver a discrepância de ~7 chaves. Migrações
de storage também são código que nunca pode ser apagado.

**Fica proibido:** literal de chave de configuração fora do schema; chave nova sem entrada
no schema; alterar nome ou tipo de chave persistida sem migração; ler configuração
diretamente de `localStorage` fora de `src/config/`.

## Verificação

- `tests/structure/config-schema.test.js` — toda chave literal usada em `src/` existe no
  schema; toda chave do schema tem `type`, `default`, `feature` e `label`; toda `feature`
  citada existe como descritor (ADR-0004).
- `tests/structure/capability-coverage.test.js` (ADR-0007) — schema, descritores de feature
  e `pages/` fecham entre si.
- `tests/config/migrations.test.js` — cada versão de schema migra para a seguinte; um
  objeto na versão mais antiga suportada chega íntegro à atual.
- Ratchet de leituras de configuração por literal fora de `src/config/`, baseline 327,
  decrescente (ADR-0008).

## Alternativas consideradas

**Manter as chaves como estão e apenas ampliar `config-defaults.js`** — cobre o default e
deixa de fora tipo, dono, rótulo e validação de existência, que são a maior parte do valor.
Continua sem detectar erro de digitação.

**Sistema de feature flag remoto** — a extensão é distribuída pela Chrome Web Store e roda
em rede restrita de órgão público; dependência remota para decidir se uma feature liga
adiciona ponto de falha e superfície de privacidade sem benefício claro.

**Enum ou constantes em vez de schema** — resolve o erro de digitação e não resolve default,
tipo, geração da página de options, nem a ligação com feature. O schema é superconjunto.
