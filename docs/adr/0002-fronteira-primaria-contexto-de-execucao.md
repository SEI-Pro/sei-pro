# ADR-0002 — A fronteira arquitetural primária é o contexto de execução, não a camada

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0003, ADR-0004, ADR-0005

## Contexto

Não existe arquitetura de referência canônica para extensões de navegador. O que existe
são convenções de layout de projeto (WXT, Plasmo, CRXJS) e o modelo de processos do
Manifest V3 — e é o MV3, não a convenção de pastas, que impõe as restrições reais:

- O **service worker** não tem DOM, não tem `window`, e é encerrado a qualquer momento.
  Nenhum estado em memória sobrevive entre invocações.
- O **content script isolado** tem DOM, mas não vê as variáveis JavaScript da página.
- O **mundo MAIN** vê a página (necessário para o CKEditor 4, que pertence ao SEI), mas
  não recebe `chrome.*` privilegiado.
- A **página de options** é uma página de extensão normal, com acesso pleno a `chrome.*`.
- A comunicação entre esses contextos é **obrigatoriamente serializável**. Não há
  chamada de função direta atravessando a fronteira.

Ou seja: dois módulos na mesma "camada de domínio" podem ter capacidades completamente
diferentes por rodarem em contextos diferentes, e um módulo não pode ser movido de
contexto sem reescrita. Isso torna o contexto de execução uma fronteira mais dura que a
camada.

A documentação anterior organizava o pensamento primeiro por camada
(`features → shared → core | sei | platform`) e tratava contexto como uma lista de
strings (`src/app/contexts.js`, 2 contextos declarados). Consequência medida: o
`manifest.base.json` tem 11 blocos de content script, dois deles injetando 40 arquivos
cada, e a real definição de "o que roda onde" vive na ordem de carregamento do manifest,
não no código.

## Decisão

A arquitetura é descrita em duas dimensões, nesta ordem de precedência:

**1. Contexto de execução (fronteira dura).** Cada contexto tem uma raiz de composição
própria em `src/entries/` (ADR-0005), um conjunto declarado de features (ADR-0004), e um
contrato serializável nas bordas. Contextos reconhecidos: `service-worker`,
`lista`, `arvore`, `editor`, `visualizacao`, `login`, `db`, `options`, `main-world`.

**2. Camada (fronteira macia), dentro de cada contexto.** Ports & Adapters:

| Camada | Pasta | Regra |
|---|---|---|
| Domínio puro | `src/core/`, `features/*/domain*` | Sem DOM, `window`, `chrome.*`, jQuery, `localStorage`. Testável em Node puro |
| Ports | `src/platform/` | Interface + adapter real + adapter fake. Único lugar com `chrome.*` |
| Anti-corruption | `src/sei/` | Único lugar que conhece DOM, seletores e URLs do SEI (ADR-0003) |
| Aplicação | `features/*/index.js`, `features/*/application` | Orquestra domínio + ports |
| UI | `features/*/view*`, `src/shared/ui/` | DOM vanilla, eventos delegados, CSS `.seipro-*` |
| Composição | `src/entries/`, `src/app/` | Constrói adapters concretos e instala features |

Direção de dependência: `entries → features → shared → core | sei | platform`. Nunca o
inverso, com a única exceção das raízes de composição, que por definição conhecem tudo.

Regra operacional derivada: **código não atravessa contexto por import.** Se dois
contextos precisam da mesma lógica, ela desce para `core/` (puro) ou `platform/` (port).
Se precisam conversar, é via mensagem serializável.

## Consequências

**Ganhamos:** a pergunta "posso usar `chrome.storage` aqui?" passa a ter resposta
mecânica (qual contexto? qual camada?); o tamanho do bundle por contexto fica visível e
controlável; a fronteira serializável fica explícita em vez de emergir de acidente.

**Pagamos:** duplicação aparente entre contextos que resolvem problemas parecidos
(a alternativa — compartilhar por global — é o arranjo atual, que produziu ~338
referências a `SeiPro.` e ordem de carregamento como contrato implícito). Também
pagamos a migração dos blocos de manifest largos, coberta por ADR-0004.

**Fica proibido:** importar de um contexto para outro; assumir estado em memória
persistente no service worker; adicionar `world: "MAIN"` novo fora da ponte
documentada do CKEditor.

## Verificação

- `tests/structure/layering.test.js` — grafo de imports: nenhum arquivo em `core/`,
  `shared/`, `platform/` ou `sei/` importa de `features/`; nenhuma feature importa
  internals de outra feature (ADR-0004 cobre o contrato público).
- `tests/structure/purity.test.js` — nenhum arquivo em `src/core/` ou em `domain*`
  referencia `chrome.`, `localStorage`, `window.` ou `document.`.
- `tests/structure/platform-boundary.test.js` — `chrome.*` só aparece em
  `src/platform/`, `src/background/` e `src/options/`.
- Ratchet do número de arquivos `domain*` com DOM (baseline 4, ver ADR-0008): hoje
  `src/features/editor/domain/{checklist,citations,html-text,process-fields}.js`.

## Alternativas consideradas

**Adotar WXT ou Plasmo, que impõem layout por contexto** — rejeitado enquanto o legado é
majoritário, por continuidade com a decisão que reverteu Vite + CRXJS: frameworks de
extensão assumem controle do bundling e do manifest, e os 24 arquivos legados copiados
verbatim dependem de ordem de carregamento e de ~1300 globais compartilhados. Reavaliar
quando o manifest gerado (ADR-0004) estiver estável.

**Camada como fronteira primária, contexto como detalhe de empacotamento** — é o
arranjo anterior. Falha porque a camada não descreve capacidade: `platform/storage.js`
e `core/datas.js` estão em camadas diferentes mas o que determina se funcionam é o
contexto onde foram injetados.

**Monólito único injetado em todas as páginas** — é efetivamente o bloco 1 do manifest
hoje (28 arquivos em `*.br/sei/*`). Custa performance em toda página do SEI e torna
impossível raciocinar sobre superfície de falha.
