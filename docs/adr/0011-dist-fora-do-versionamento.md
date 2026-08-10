# ADR-0011 — `dist/` fora do controle de versão

- **Status:** Aceito — **implementado em 2026-08-07**
- **Data:** 2026-08-07
- **Relacionados:** ADR-0004, ADR-0008

## Contexto

`DEVELOPMENT.md` afirma que `src/` é a fonte única da verdade e que `dist/` contém apenas
saída gerada, jamais editada à mão. Medido em 2026-08-07, `dist/` tem **207 arquivos
versionados** e 9,7 MB em disco. Não há nada que garanta a afirmação.

Pior: a afirmação é falsa hoje. Cerca de 152 arquivos em `dist/` **não são produzidos** por
`scripts/build.mjs` e só existem porque foram commitados:

- `dist/js/lib/` — 28 arquivos, 3,3 MB (jQuery 3.7.1, CKEditor, moment, Chart.js, plugins).
  Apenas 3 vêm de `vendor/` pelo build; os outros 25 não têm fonte no repositório.
- `dist/css/` — 708 KB, incluindo `sei-pro.css` com 120 KB. **Não existe `src/css/`.**
  Esses estilos não têm fonte: `dist/` é a fonte.
- `dist/icons/` (656 KB), `dist/webfonts/pro/` (84 KB), `dist/config_hosts.json`.
- `dist/background.js` — duplicata obsoleta de abril de 2025, versionada, enquanto o
  manifest carrega `js/background.js`.

Consequências práticas: todo build polui o diff com centenas de arquivos gerados, o que
esconde a mudança real na revisão; `git blame` em arquivo de `dist/` não diz nada; e é
impossível distinguir artefato gerado de asset sem fonte, que é justamente a informação de
que se precisa para saber o que pode ser regenerado.

**O risco não era teórico.** No dia da escrita deste ADR, a árvore de trabalho estava com
**exatamente esses 137 arquivos deletados** — alguém havia limpado `dist/` e o build não os
regenerou, porque não havia fonte. A extensão local estava sem `sei-pro.css` e 4 testes
falhavam. Os arquivos existiam apenas no histórico do git. É o modo de falha que este ADR
elimina, observado acontecendo.

## Decisão

`dist/` sai do controle de versão. Antes disso, o que hoje só existe em `dist/` é resgatado
para uma fonte real, em três movimentos, nesta ordem:

**1. Resgatar os assets sem fonte.**

- Os 25 arquivos de `dist/js/lib/` sem origem migram para `vendor/<lib>/` com
  `VERSION.txt`, seguindo o padrão que `vendor/frappe-gantt/` já usa corretamente, e passam
  a ser copiados pelo build.
- Os CSS de `dist/css/` migram para `src/css/`, com `sei-pro.css` (120 KB) fatiado por
  feature na medida em que as features migrarem (ADR-0007). Enquanto não for fatiado, vira
  um arquivo em `src/css/` copiado verbatim — mesmo tratamento dos 24 JS legados.
- Ícones e webfonts migram para `assets/`, copiados pelo build.

**2. Remover o que é lixo.** `dist/background.js` obsoleto e qualquer artefato sem
correspondência no build.

**3. Só então** adicionar `dist/` ao `.gitignore` e removê-lo do índice. A partir daí,
`npm run build` reconstrói tudo do zero, e isso é verificado em CI.

Para a distribuição, `scripts/package-extension.sh` continua gerando o `dist.zip`
(já ignorado corretamente). Se houver necessidade de um artefato versionado para
publicação ou auditoria, ele passa a ser um release do GitHub gerado pelo CI, não um
diretório no branch principal.

## Consequências

**Ganhamos:** a afirmação "`src/` é a fonte da verdade" passa a ser verdade verificável, em
vez de convenção; diffs de revisão contendo só a mudança real; impossibilidade de asset
existir sem fonte, que é a falha estrutural mais séria do arranjo atual — hoje, apagar
`dist/` perde 120 KB de CSS irrecuperável; pré-requisito para o manifest gerado (ADR-0004),
que exige `dist/` totalmente reprodutível.

**Pagamos:** quem clona precisa rodar `npm install && npm run build` antes de carregar a
extensão — hoje dá para carregar `dist/` direto do clone. É um passo a mais no onboarding,
e some a possibilidade de instalar a partir do repositório sem Node. Se essa instalação
direta for um requisito real de distribuição na PRF, esta decisão precisa ser reavaliada
ou resolvida por release publicado.

**Fica proibido:** editar `dist/` como fonte; adicionar asset que não tenha fonte em `src/`,
`vendor/` ou `assets/`; commitar `dist/` depois da remoção.

## Verificação

- `tests/structure/dist-reproducible.test.js` — (a) toda fonte declarada no
  `asset-manifest` existe; (b) todo arquivo exigido pelo navegador
  (`content_scripts`, `icons`, service worker, popup) existe em `dist/` após o build;
  (c) nenhum `web_accessible_resource` é referência morta, com allowlist de opcionais
  exigindo motivo; (d) nenhum asset servido de fonte fora de `vendor/`, `src/` ou `assets/`;
  (e) todo arquivo em `dist/` ∈ `listDeclaredDistOutputs` (`scripts/dist-pipeline.mjs`).
- `tests/structure/dist-clean-tree.test.js` — build oficial remove órfãos (FR-004a).
- `tests/structure/dist-bit-identical.test.js` — duas builds limpas bit-idênticas (FR-004b).
- `scripts/audit-dist-sources.mjs` — exit 1 se houver undeclared files (CI / `npm run verify`).
- Official `npm run build` wipes `dist/` (or `SEI_PRO_DIST_DIR`) before writing.
- CI (ADR-0008) roda `npm run build` a partir de árvore limpa + `npm run audit:dist`.
- `tests/structure/no-dist-in-git.test.js` — `git ls-files dist` vazio.

Greenfield Spec Kit: `specs/001-build-generated-dist/` (pipeline rediscovery).

## Implementação (2026-08-07)

Executado em quatro passos, na ordem que o ADR exige:

1. **Restauração.** Os 137 arquivos deletados foram recuperados do git antes de qualquer
   movimento.
2. **Inventário automatizado.** `scripts/audit-dist-sources.mjs` cruza os arquivos presentes
   em `dist/` com as saídas declaradas pelo build e lista os órfãos. Resultado: 207
   arquivos, 70 produzidos pelo build, **137 sem fonte (3,6 MB)**.
3. **Resgate.** `scripts/rescue-dist-assets.mjs` moveu 135 arquivos com `git mv`
   (preservando histórico) e removeu 2 obsoletos (`dist/background.js`, duplicata de
   abr/2025 sem referência; `dist/jsconfig.json`). Destinos: 27 libs em `vendor/<lib>/`
   (23 diretórios novos, todos com `VERSION.txt`), `sei-pro.css` e `sei-slim.css` em
   `src/css/`, ícones e `config_hosts.json` em `assets/`, webfonts em
   `vendor/fontawesome/webfonts/`.
4. **Remoção do git** após verificação (abaixo).

O mapeamento fonte → dist ficou em **`scripts/asset-manifest.mjs`**, consumido pelo build,
pelo resgate e pelos testes — uma fonte de verdade, no espírito do ADR-0004.

**Verificação executada:** `rm -rf dist && npm run build` reproduz 205 arquivos; um clone
limpo (apenas arquivos versionados) mais `npm run build` produz uma árvore `dist/`
**byte-idêntica** (`diff -rq` vazio); suíte completa verde (939 testes, 185 arquivos).

**Achado colateral.** A fitness function nova encontrou 6 referências mortas no
`web_accessible_resources`: cinco imagens do Leaflet (`marker-icon.png`, `layers.png`, …)
que nunca existiram neste repositório — resquício do fork original — foram removidas do
manifest; e `js/sei-pro-config-local.js`, que é opcional por design
(`src/bootstrap/init.js:48-65` carrega e avisa sem falhar), ficou registrado na allowlist
com o motivo.

Dois itens seguem abertos, por decisão e não por esquecimento: `sei-pro.css` continua um
arquivo único de 120 KB, a fatiar por feature junto da migração
([ADR-0007](./0007-fronteira-de-feature-por-capacidade.md)); e vários `VERSION.txt` têm
versão `desconhecida`, porque o arquivo veio de `dist/` sem registro de origem — marcado
explicitamente para não ser atualizado por adivinhação.

## Alternativas consideradas

**Manter `dist/` versionado** — é o estado atual. Custo permanente em revisão e, mais grave,
mantém assets sem fonte, o que contradiz a premissa central de `DEVELOPMENT.md`.

**Versionar `dist/` num branch separado** (`gh-pages`) — resolve a poluição do diff sem
resolver os assets sem fonte, que é o problema real.

**Resgatar os assets e continuar versionando `dist/`** — meio caminho defensável: mata a
falha estrutural e preserva a instalação direta do clone. Fica registrado como o recuo
aceitável caso o custo de onboarding pese mais que o do diff.
