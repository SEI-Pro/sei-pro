# Plano de implementação da arquitetura

Sequência de execução dos ADRs em [`docs/adr/`](./adr/README.md). Os ADRs dizem **o quê** e
**por quê**; este plano diz **em que ordem** e **quando cada coisa está pronta**.

| Documento | Papel |
|---|---|
| [`docs/adr/`](./adr/README.md) | decisões, com motivo e verificação exigida |
| [`docs/architecture.md`](./architecture.md) | estado medido, atualizado a cada fase |
| **este arquivo** | ordem, fatias, portões e riscos |
| [`DEVELOPMENT.md`](../DEVELOPMENT.md) | como fazer o trabalho de uma fatia |

---

## Princípio de sequenciamento

A ordem **não** é por facilidade nem por tamanho da dívida. É por três critérios, nesta
precedência:

1. **O que impede regressão vem primeiro.** Sem portão automatizado, todo ganho posterior
   apodrece — foi o que aconteceu com as regras em prosa. Fase 0 é pré-requisito de tudo.
2. **O que desbloqueia o resto vem antes do que só melhora.** O schema de configuração
   desbloqueia os descritores de feature, que desbloqueiam o manifest gerado.
3. **O que reduz custo de manutenção externa vem antes do custo interno.** Uma quebra do SEI
   é urgente, imprevisível e fora do nosso controle; um arquivo de 5458 linhas é caro mas
   previsível e nosso.

Por isso o Anti-Corruption Layer (ADR-0003) vem antes da refronteirização (ADR-0007), mesmo
`atividades` sendo a dívida mais visível.

## Regras de execução

Valem para toda fatia, em qualquer fase:

- **Uma fatia = um commit que passa no CI.** A extensão funciona ao fim de cada fatia. Nada
  de branch de refatoração longa.
- **Teste antes do corte.** Ao fatiar código sem teste, primeiro cubra o comportamento
  atual, depois mova. Nunca o contrário.
- **Ratchet no mesmo commit.** Melhorou uma métrica? Baixe o baseline junto (ADR-0008).
- **Smoke manual é portão de ambiente.** Toda fatia que toque UI exige o roteiro de
  [`SMOKE_TEST.md`](../SMOKE_TEST.md) no SEI real. Vitest não reproduz DOM nem autenticação
  do SEI.
- **Fatia só fecha com o ADR refletido.** Se a execução contradisser o ADR, o ADR muda por
  um novo ADR — não por exceção silenciosa no código.

---

## Fase 0 — Fundação: o portão

**ADR:** [0008](./adr/0008-fitness-functions-e-ratchets.md)
**Por que primeiro:** sem isto, as fases 1 a 5 regridem sem ninguém notar. É o que separa
este plano da tentativa anterior.

| # | Fatia | Pronto quando |
|---|---|---|
| 0.1 | `.github/workflows/ci.yml`: `npm ci`, `npm run build`, `npm test` em push e PR | CI verde e obrigatório para merge |
| 0.2 | `tests/structure/ratchets.baseline.json` com os 13 baselines medidos + `ratchets.test.js` | métrica que sobe quebra o build; que desce sem atualizar baseline também |
| 0.3 | Fitness functions de camada: `layering.test.js`, `purity.test.js`, `platform-boundary.test.js` | violações atuais na allowlist explícita, com ADR ou TODO |
| 0.4 | ESLint + Prettier no escopo moderno (`src/core`, `src/platform`, `src/sei`, features migradas); legados verbatim em `.eslintignore` | `npm run lint` no CI |
| 0.5 | `no-silent-catch.test.js` (ADR-0006) | `catch` sem log/report/rethrow quebra ou está no baseline |
| 0.6 | Decidir o destino de `scripts/engineering-loop-*.mjs` | `loop:next` funciona lendo este plano, **ou** os scripts e os `npm scripts` são removidos |

**Riscos.** Fatia 0.3 vai revelar mais violações que o esperado; a allowlist inicial pode
ficar grande — aceitável, desde que cada entrada tenha motivo e o número só desça.
Fatia 0.6 existe porque `npm run loop:next` está quebrado hoje (lê
`docs/engineering-loop-board.md`, que não existe): decidir, não deixar apodrecer.

**Ratchets que passam a existir:** todos os 13.

---

## Fase 1 — Anti-Corruption Layer do SEI

**ADR:** [0003](./adr/0003-anti-corruption-layer-sei.md)
**Por que agora:** maior alavancagem do projeto. Converte "o SEI atualizou e algo quebrou"
de caçada em 42 arquivos para correção em uma pasta, com teste que reproduz a quebra.

| # | Fatia | Pronto quando |
|---|---|---|
| 1.1 | `src/sei/selectors.js`: mover os 16 seletores de `adapter.js` e nomeá-los por intenção | `adapter.js` só compõe; nenhum seletor literal nele |
| 1.2 | `src/sei/pages.js`: identificação de contexto/página a partir da URL, a partir dos `matches` do manifest | snapshot de contexto por URL (insumo da fase 3) |
| 1.3 | `src/sei/fixtures/`: HTML real anonimizado do SEI 4.x e 5.x, por página | fixture por contexto, sem dado de processo, pessoa ou credencial |
| 1.4 | `src/sei/parse/lista.js` + testes contra fixture | parser devolve dados; zero DOM/jQuery no retorno |
| 1.5 | `src/sei/parse/arvore.js` + testes | idem |
| 1.6 | `src/sei/parse/documento.js` + testes | idem |
| 1.7 | Migrar consumidores da lista e da árvore para `sei.selectors` / `sei.parse` | ratchet de seletores fora do ACL cai |
| 1.8 | Substituir `isNewSEI`/`isSEI_5` por capabilities (`sei.supports.*`) nos consumidores migrados | ratchet de ramificação de versão cai |
| 1.9 | `sei-acl.test.js` promovido de allowlist a regra dura por contexto concluído | contexto migrado não aceita seletor novo fora do ACL |

**Portão de saída:** para pelo menos os contextos lista e árvore, nenhum seletor, URL
`controlador.php` ou ramificação de versão fora de `src/sei/`. Smoke manual nos dois.

**Riscos.** As fixtures precisam de captura manual em instância real e envelhecem; sem
recaptura periódica dão falsa confiança. Anonimização é obrigatória e não pode ser
automatizada às cegas. Fatia 1.8 é a mais delicada: transformar `isNewSEI ? a : b` em
capability exige entender **por que** cada ramo existe, e há 228 ocorrências — não fazer em
lote mecânico.

**Ratchets que caem:** seletores (36), `controlador.php` (37), `acao=` (59), versão (42),
e indiretamente jQuery (91).

---

## Fase 2 — Schema de configuração

**ADR:** [0009](./adr/0009-configuracao-como-schema-unico.md)
**Por que aqui:** pré-requisito dos descritores de feature (fase 3), e barato comparado ao
que desbloqueia.

| # | Fatia | Pronto quando |
|---|---|---|
| 2.1 | Inventariar as 79 chaves usadas no código contra as ~72 do CSV de mapeamento | discrepância resolvida e explicada |
| 2.2 | `src/config/schema.js` com `type`, `default`, `feature`, `label`, `page` por chave | `config-schema.test.js` verde |
| 2.3 | Leitura de chave fora do schema = erro em dev, default seguro em produção | erro de digitação deixa de ser feature silenciosamente morta |
| 2.4 | Página de options gera a lista a partir do schema; `shared/config-defaults.js` removido | impossível a UI divergir do que o código lê |
| 2.5 | Versionar o objeto persistido + migrações em `src/config/migrations/` | `migrations.test.js`: objeto na versão mais antiga chega íntegro à atual |
| 2.6 | Estender versionamento a monitorados, projetos e perfis de IA | toda estrutura persistida tem versão |

**Portão de saída:** as 79 chaves declaradas; options derivada do schema; migração
funcionando. Smoke manual da página de options e de dois fluxos que leem config.

**Riscos.** Fatia 2.1 é trabalho manual chato e é onde erros passam. Fatia 2.5 mexe em dado
de usuário já instalado: exige teste com objeto real capturado antes de qualquer mudança de
formato, e migração de storage nunca pode ser apagada depois.

**Ratchets que caem:** leituras de config por literal (327).

---

## Fase 3 — Descritores, registry e manifest gerado

**ADR:** [0004](./adr/0004-features-autodescritivas-manifest-gerado.md)
**Por que aqui:** mata a divergência entre fontes de verdade e os blocos de 40 scripts.
Depende da fase 2 (`configKey`) e da fatia 1.2 (`matches`).

| # | Fatia | Pronto quando |
|---|---|---|
| 3.1 | `feature.js` nas 9 features já conformes | `feature-descriptor.test.js` cobre 9 de 22 |
| 3.2 | `feature.js` nas 13 restantes, uma por vez, normalizando a publicação | 22 de 22; ratchet de conformidade zerado |
| 3.3 | Registry montado por varredura; `contexts.js` e `register-pilot-features.js` deixam de ser listas à mão | adicionar feature não toca arquivo central |
| 3.4 | `manifest-contexts.test.js` estabilizado: snapshot de `matches` e ordem de scripts dos 11 blocos | pré-requisito da geração — **não pular** |
| 3.5 | Gerador de manifest a partir do registry, com `--check` no CI | manifest commitado idêntico ao gerado |
| 3.6 | Enxugar bloco por bloco, um contexto por vez, do menor para o maior | ratchet do maior bloco cai de 40 |
| 3.7 | `build.mjs` deriva as entradas dos contextos | adicionar feature não toca o build |

**Portão de saída:** manifest gerado e verificado; nenhum bloco com dezenas de scripts.
Smoke manual em **todos** os contextos — é a fase de maior risco de quebra silenciosa.

**Riscos.** O mais sério do plano: **erro em `matches` não quebra teste, quebra
silenciosamente para o usuário** — a extensão não carrega e nada acusa. Por isso a fatia 3.4
é obrigatória antes da 3.5, e a 3.6 vai um contexto por vez com smoke a cada passo.

**Ratchets que caem:** conformidade de feature (13), maior bloco (40).

---

## Fase 4 — Raízes de composição, injeção e isolamento de falha

**ADR:** [0005](./adr/0005-raiz-de-composicao-e-injecao-explicita.md),
[0006](./adr/0006-isolamento-de-falha-por-feature.md)
**Por que depois de 3:** os contextos já estão declarados e enxutos; agora cada um ganha
uma raiz que constrói dependências de verdade.

| # | Fatia | Pronto quando |
|---|---|---|
| 4.1 | Ports de `src/platform/` viram factories `createX` com fake em `tests/fakes/` | `ports.test.js` verde |
| 4.2 | Limite de falha + `cleanup` no boot | `boot.test.js`: feature que lança não impede as seguintes; `failed` nomeia o id |
| 4.3 | Feature caída aparece como indisponível na UI | falha visível, nunca silenciosa |
| 4.4 | Raiz de composição dos contextos `login` e `db` (já são bundles finos) | `getSeiPro()` sai desses contextos |
| 4.5 | Raízes de `lista`, `arvore`, `editor`, `visualizacao`, um contexto por vez | ratchet de `getSeiPro()` cai a cada contexto |
| 4.6 | `SeiPro` publicado só na raiz; `publishGlobal` substitui `aliasGlobal` no núcleo (ADR-0012) | `globals.test.js` verde; violações caem de 186 para 50 |
| 4.7 | Logger injetado substitui `console.*` nos contextos migrados | ratchet de `console.*` cai de 492 |
| 4.8 | Remover `platform/bus.js` e o emissor único (ADR-0013) | `no-bus.test.js` verde |
| 4.9 | Dissolver `core-stack.bundle.js` conforme os contextos ganham raiz | some quando o último bloco legado morrer |

**Portão de saída:** todo contexto com raiz própria; `getSeiPro()` só em `legacy-api`.
Smoke manual por contexto.

**Riscos.** O risco central é o que travou a migração anterior: os dois mecanismos coexistem
e o mais fácil (global) ganha. Mitigação é o ratchet, não a boa vontade. Fatia 4.6 toca 136
call-sites — mecânica, mas grande; fazer por pasta, com CI a cada passo.

**Ratchets que caem:** `getSeiPro()` (50), `SeiPro.` (338), `aliasGlobal` (50),
`console.*` (492).

---

## Fase 5 — Refronteirização por capacidade

**ADR:** [0007](./adr/0007-fronteira-de-feature-por-capacidade.md)
**Por que por último:** é o trabalho mais arriscado e o que mais se beneficia de tudo
acima — schema para as `configKey`, descritores para as novas fronteiras, injeção para
testar, e ratchets para não regredir.

| # | Fatia | Pronto quando |
|---|---|---|
| 5.1 | Mapear capacidades reais usando `pages/` (~80 arquivos) e os CSVs de `docs/mapping-funcoes-configuracoes/` | lista de features-alvo nomeadas no vocabulário do usuário |
| 5.2 | Cobrir com teste o domínio de `atividades/config-options.js` (5458 linhas) **antes** de mover | teste caracteriza o comportamento atual |
| 5.3 | Extrair a administração de configuração de `atividades` como feature própria | descritor + `configKey` + testes; smoke |
| 5.4 | Extrair afastamentos, avaliações e registro de atividades, uma por vez | idem, uma fatia cada |
| 5.5 | Dissolver `sei-functions`: cada cluster vira feature nomeada por capacidade | a pasta **deixa de existir**, não é renomeada |
| 5.6 | Fatiar `src/css/sei-pro.css` (120 KB) em `src/features/<x>/style.css` | ratchet de linhas do arquivo cai até zerar |
| 5.7 | `capability-coverage.test.js`: schema, descritores e `pages/` fecham entre si | toda `configKey` tem uma e só uma feature |

**Portão de saída:** nenhuma pasta de feature que falhe no teste de fronteira do ADR-0007.
Smoke manual amplo.

**Riscos.** O maior do plano em impacto de produto: 25 mil linhas em `atividades`, com os 4
maiores arquivos sem nenhum teste. A fatia 5.2 é obrigatória e não é negociável — mover
antes de cobrir é como a dívida foi criada. `sei-functions` inclui captcha do editor e
notificações de processo: comportamento sensível, difícil de smoke-testar.

**Ratchets que caem:** arquivos acima de 500 linhas (42), linhas de `sei-functions`.

---

## Contínuo — em paralelo a qualquer fase

**Tipagem gradual** ([ADR-0010](./adr/0010-tipagem-gradual-jsdoc-checkjs.md)): `tsconfig.json`
com `checkJs`, `tsc --noEmit` no CI, escopo expandido na ordem ports → descritor e schema →
fronteira do ACL → `src/core`. Legados verbatim em `exclude`, com ratchet decrescente. Não
introduzir `.ts`; não tocar o pipeline do esbuild.

**Manutenção dos ADRs** ([ADR-0001](./adr/0001-adotar-adrs.md)): decisão nova é ADR novo;
reversão é ADR que substitui. Atualizar a tabela de estado medido de
[`architecture.md`](./architecture.md) ao fechar cada fase.

---

## Concluído

**[ADR-0011](./adr/0011-dist-fora-do-versionamento.md) — `dist/` fora do versionamento**
(2026-08-07). Os 137 assets que existiam apenas em `dist/` commitado — incluindo
`sei-pro.css`, 120 KB sem fonte — foram resgatados para `vendor/` (27 libs, 23 diretórios
novos com `VERSION.txt`), `src/css/` e `assets/`. Mapeamento único em
`scripts/asset-manifest.mjs`. `dist/` saiu do git e é reproduzível byte a byte a partir de
clone limpo, travado por `dist-reproducible.test.js` e `no-dist-in-git.test.js`.

---

## Decisões abertas

Precisam de resposta humana; nenhuma bloqueia a fase 0.

1. **Distribuição.** Instalar a extensão a partir do clone sem Node deixou de ser possível
   (ADR-0011). Se isso for requisito na PRF, a saída é release publicado pelo CI —
   decidir na fase 0, junto do workflow.
2. **`scripts/engineering-loop-*.mjs`.** `loop:next` está quebrado (lê um board inexistente).
   Apontar para este plano ou remover (fatia 0.6).
3. **Fronteiras de `atividades`.** A divisão proposta (configuração, afastamentos,
   avaliações, registro) é hipótese minha a partir dos nomes de arquivo. Precisa de
   validação de quem conhece o uso real antes da fatia 5.3.
4. **Recaptura de fixtures do SEI.** Quem captura, com que periodicidade, e de qual
   instância — sem isso as fixtures da fase 1 envelhecem e dão falsa confiança.
5. **Postura de segurança.** `optional_host_permissions` inclui `https://*/*` e as chaves
   BYOK ficam em `chrome.storage.local`. Merece ADR próprio sobre fronteiras de confiança,
   que é o que a revisão da Chrome Web Store cobra.
