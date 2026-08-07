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
| 0.6 | `tsc --noEmit` no CI, junto de `npm ci` e `npm test` | **pré-requisito técnico da fatia 0.7** |
| 0.7 | Renomear `.js` → `.ts` em toda a base bundlada, `@ts-nocheck` nos 368 que não passam (ADR-0014) | `dist/` idêntico ao anterior exceto comentários de caminho; ratchet de `@ts-nocheck` criado em 368 |
| 0.8 | `.d.ts` de `SeiPro` e globais de vendor completados; remover `@ts-nocheck` dos 41 arquivos já limpos | ratchet cai de 368 para ~327 sem tipar nada à mão |

**Riscos.** Fatia 0.3 vai revelar mais violações que o esperado; a allowlist inicial pode
ficar grande — aceitável, desde que cada entrada tenha motivo e o número só desça.

Fatia 0.7 é a maior em número de arquivos e a menor em risco: não toca import nenhum (esbuild,
vitest e `tsc` resolvem `./x.js` para `x.ts` — verificado nos três), não muda comportamento, e
tem portão objetivo — `dist/` byte a byte igual, salvo os comentários de caminho que o esbuild
injeta. O risco real é de coordenação: ela conflita com qualquer branch aberta, então precisa
ser combinada e feita com a árvore limpa. **Não emendar nenhuma outra mudança nesse commit.**

**Ratchets que passam a existir:** os 13 originais, mais `@ts-nocheck` (368), `any` explícito
e `@ts-ignore`.

---

## Fase S — Segurança: reduções imediatas

**ADR:** [0015](./adr/0015-fronteiras-de-confianca.md)
**Por que aqui:** são as fatias mais baratas do plano com o maior efeito sobre risco real e
sobre a revisão da Chrome Web Store. Nenhuma depende das fases seguintes. Rodam em paralelo à
fase 1; ficam antes dela na lista porque não há motivo para adiar.

| # | Fatia | Pronto quando |
|---|---|---|
| S.1 | Remover `https://*/*` de `optional_host_permissions`; provedor customizado passa a pedir permissão em runtime para a origem digitada | `manifest-permissions.test.js` rejeita curinga de host |
| S.2 | Restringir `matches` de `web_accessible_resources` aos padrões do SEI e podar os 141 recursos ao que a página realmente carrega | `matches` de WAR ⊆ `matches` de content script |
| S.3 | Remover o `eval` de `arvore-info/dom/confirm.js` (o `defineProperty` já é a via primária) | `no-eval.test.js` verde |
| S.4 | Mover campos de credencial de `dataValues` de `storage.sync` para `storage.local`, com migração (coordenar com a fatia 2.5) | `secrets-storage.test.js` verde |
| S.5 | Redação de PII em `report.js` + telemetria opt-in; `script.google.com` sai de `host_permissions` obrigatório | `telemetry-scrub.test.js` verde; usuário vê o payload antes de enviar |
| S.6 | Ratchet de injeção de HTML criado (110 `innerHTML` + 8 `insertAdjacentHTML` + 405 `.html(`) | baseline travado; sanitização centralizada entra na fase 1 |
| S.7 | Aviso no envio para LLM externo: provedor nomeado na interface, no momento da ação | usuário sabe para onde o conteúdo do processo está indo, antes de ir |
| S.8 | Chave `llmProvedoresExternos` no schema (ADR-0009), **padrão aberto com aviso**; instituição pode restringir a provedor local | opções expõe a chave; desligada, a extensão só aceita provedor local |

**Portão de saída:** manifest sem permissão curinga, sem `eval`, sem segredo em `sync` e sem
conteúdo de página saindo por telemetria. Smoke manual dos fluxos de IA e de envio de bug.

**Riscos.** S.1 e S.2 podem quebrar comportamento que hoje funciona por acidente do escopo
largo — o carregamento sob demanda via `$.getScript` é o candidato mais provável, e exige
smoke. S.4 faz o usuário reconfigurar credenciais em máquinas secundárias: é a correção
certa, percebida como regressão, e precisa de aviso na release. S.5 reduz o volume de
relatórios de bug recebidos, e isso é um custo aceito conscientemente. S.7 e S.8 são a decisão
consciente de manter provedores externos **abertos por padrão**, com aviso: o risco de
conteúdo de processo sair para terceiro passa a ser escolha informada do usuário, não efeito
colateral — e a instituição pode fechar por configuração quando quiser.

**Ratchets que passam a existir:** injeção de HTML, `fetch` em content script.

---

## Fase 1 — Anti-Corruption Layer do SEI

**ADR:** [0003](./adr/0003-anti-corruption-layer-sei.md)
**Por que agora:** maior alavancagem do projeto. Converte "o SEI atualizou e algo quebrou"
de caçada em 42 arquivos para correção em uma pasta, com teste que reproduz a quebra.

| # | Fatia | Pronto quando |
|---|---|---|
| 1.1 | `src/sei/selectors.js`: mover os 16 seletores de `adapter.js` e nomeá-los por intenção | `adapter.js` só compõe; nenhum seletor literal nele |
| 1.2 | `src/sei/pages.js`: identificação de contexto/página a partir da URL, a partir dos `matches` do manifest | snapshot de contexto por URL (insumo da fase 3) |
| 1.3 | `tests/fixtures/`: esqueletos estruturais do SEI 4.x e 5.x por página, pelo protocolo de `DEVELOPMENT.md` | `fixtures-sem-pii.test.js` verde; cada fixture com `.meta.json` de procedência |
| 1.4 | `src/sei/parse/lista.js` + testes contra fixture | parser devolve dados; zero DOM/jQuery no retorno |
| 1.5 | `src/sei/parse/arvore.js` + testes | idem |
| 1.6 | `src/sei/parse/documento.js` + testes | idem |
| 1.7 | Migrar consumidores da lista e da árvore para `sei.selectors` / `sei.parse` | ratchet de seletores fora do ACL cai |
| 1.8 | Substituir `isNewSEI`/`isSEI_5` por capabilities (`sei.supports.*`) nos consumidores migrados | ratchet de ramificação de versão cai |
| 1.9 | `sei-acl.test.js` promovido de allowlist a regra dura por contexto concluído | contexto migrado não aceita seletor novo fora do ACL |

**Portão de saída:** para pelo menos os contextos lista e árvore, nenhum seletor, URL
`controlador.php` ou ramificação de versão fora de `src/sei/`. Smoke manual nos dois.

**Riscos.** As fixtures são o ponto de contato com dado sensível real: o protocolo de
`DEVELOPMENT.md` as torna esqueletos estruturais com conteúdo sintético, e
`fixtures-sem-pii.test.js` é a rede de segurança — mas a captura em produção só se justifica
quando a estrutura não existir em instância sintética ou de homologação. A recaptura é
disparada pela declaração de suporte a uma versão nova do SEI, não por calendário.
Fatia 1.8 é a mais delicada: transformar `isNewSEI ? a : b` em
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

**Remoção dos `@ts-nocheck`** ([ADR-0014](./adr/0014-typescript-para-codigo-novo.md)): depois
da renomeação (fatia 0.7), cada arquivo tocado por qualquer motivo perde o marcador no mesmo
commit e entra no `strict`. Ordem de mutirão, quando houver folga: `src/types` → ports de
`platform` → descritor e schema → fronteira do ACL → `core` e `shared` → features.
`atividades` e `sei-functions` ficam por último apesar de concentrarem 52% dos erros: a fase
5 vai reescrevê-los, e tipar antes é pagar duas vezes. **A medida oficial é o ratchet de
`@ts-nocheck`**, não a contagem de erros.

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

**Ambiente de build sem Node no sistema operacional** (2026-08-07). `Dockerfile` +
`compose.yaml` com Node fixado em 22.23.1 (mesma versão em `.nvmrc` e em `engines`).
`docker compose run --rm verify` roda typecheck, build, testes e auditoria de `dist/`
— validado ponta a ponta. O `node_modules` fica num volume nomeado, porque esbuild e jsdom
trazem binários por plataforma e o do host não serve ao container.

**TypeScript instalado e verificação ligada** (2026-08-07). `tsconfig.json` com `strict` e
`noEmit`, `npm run typecheck`, e `src/types/` com as declarações de `SeiPro` e dos globais de
vendor. A renomeação da base é a fatia 0.7.

**Scripts `engineering-loop-*` removidos** (2026-08-07), com os `npm scripts` e as
referências em `DEVELOPMENT.md` e `src/background/README.md`. Liam um board que nunca
existiu; este plano ocupa o lugar deles.

**Protocolo e ferramenta de fixtures** (2026-08-07). Como a única fonte de captura é
produção, a esqueletização deixou de ser recomendação e virou infraestrutura, pronta **antes**
da primeira captura: `scripts/skeletonize-fixture.mjs` preserva estrutura e seletores
(mascarando dígitos em `id`/`name`, mantendo `acao=`) e descarta todo conteúdo; recusa entrada
dentro do repositório, destino fora de `tests/fixtures/` e procedência incompleta. Coberto por
`skeletonize-fixture.test.js` (25 casos com PII realista) e `fixtures-sem-pii.test.js`, com
hook de pre-commit via `npm run hooks:install`.

---

## Decisões resolvidas

Respondidas em 2026-08-07.

1. **Distribuição.** Instalar sem Node **não** é requisito da PRF. A alternativa adotada é
   build em container, para não exigir Node instalado no sistema — feito, ver acima.
2. **`scripts/engineering-loop-*.mjs`.** Removidos.
3. **Fronteiras de `atividades`.** A divisão proposta (configuração, afastamentos,
   avaliações, registro) foi **validada**. A fatia 5.3 pode partir dela.
4. **Recaptura de fixtures.** Protocolo em `DEVELOPMENT.md`, com ferramenta e travas
   implementadas — ver "Concluído". Recaptura disparada pela **declaração de suporte a versão
   nova do SEI**, não por calendário.
5. **Postura de segurança.** [ADR-0015](./adr/0015-fronteiras-de-confianca.md) declara três
   fronteiras de confiança; a execução é a fase S.
6. **Instância para captura.** Só existe **produção**. O protocolo foi endurecido em função
   disso: captura fora da árvore do repositório, esqueletização obrigatória por ferramenta
   (não à mão), hook de pre-commit, e revisão humana do esqueleto antes de comitar.
7. **Provedores de LLM externos.** **Abertos por padrão, com aviso** nomeando o provedor no
   momento do envio (fatias S.7 e S.8). A instituição pode restringir a provedor local por
   configuração.

## Decisões abertas

Nenhuma. As próximas surgem na execução da fase 0.
