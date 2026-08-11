# Feature Specification: Inventário e Gaps de Capacidades

**Feature Branch**: `003-capability-inventory-gaps`

**Created**: 2026-08-10

**Status**: Implemented

**Input**: User description: "inventário e gaps de capacidades"

## Clarifications

### Session 2026-08-10

- Q: Should the capability inventory replace `docs/capabilities-map.md`, become that file’s expanded form, or live as a separate product artifact that the map only summarizes? → A: Expand `capabilities-map.md` into the full inventory + prioritized gaps (canonical home stays that map) (Option B)
- Q: When the gap register still has high-priority consolidation items open, how hard should the “consolidate before new capabilities” rule block brand-new user capabilities? → A: Soft gate — new capabilities allowed only with explicit Spec Kit justification naming open high-priority gaps deferred (Option B)
- Q: How should gap priority be expressed so maintainers can order the “next consolidations” list consistently? → A: Fixed levels P1–P4 (P1 highest): P1 blocks honest inventory/frontier or user toggle clarity; P2 ownership/maturity consolidation; P3 documentation coverage; P4 tidy-up / naming consistency (Option A)
- Q: When is a capability’s maturity counted as a gap in the register (versus merely recorded as current state on the inventory entry)? → A: Always record maturity on the entry; raise a maturity gap only if not `exclusive` plus at least one of: parallel legacy path still active, unjustified shared/`null` config key, or residual/aggregator still owning behavior (Option C)
- Q: How strictly should the objective check that the inventory stays aligned with canonical sources (pages, descriptors, config keys) be enforced? → A: Hard fail verify/CI on coverage/divergence checks; human prose in the map must stay consistent with those checks (Option B)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inventário completo e legível das capacidades (Priority: P1)

Um mantenedor ou contribuinte precisa ver, em um único lugar de produto — o mapa de capacidades expandido (`docs/capabilities-map.md`) —, todas as capacidades que o usuário final reconhece (ou deveria reconhecer) na extensão — com nome no vocabulário do usuário, descrição em uma frase, se dá para ligar/desligar, e de onde veio a evidência (documentação de usuário, chave de configuração, descritor de feature).

**Why this priority**: Sem inventário fechado, a consolidação via Spec Kit e a priorização de migração/recorte ficam no escuro; a constituição exige que feature corresponda a capacidade reconhecível, e o mapa atual ainda mistura estado parcial e lacunas sem inventário exaustivo.

**Independent Test**: Abrir `docs/capabilities-map.md` expandido e, para uma amostra de capacidades conhecidas (ex.: prazos, menus rápidos, uma capacidade de atividades), confirmar presença com nome de usuário, descrição em uma frase e ligação às fontes canônicas; confirmar que não há capacidade “só de arquivo legado” ou “só de página do SEI” sem capacidade de usuário.

**Acceptance Scenarios**:

1. **Given** as fontes canônicas de produto (documentação de usuário em `pages/`, mapeamento função↔opção, chaves de configuração e descritores de feature), **When** o inventário é produzido, **Then** cada capacidade listada tem nome no vocabulário do usuário, descrição em uma frase sem falar de arquivo/página/implementação, e referência às evidências usadas.
2. **Given** o inventário, **When** alguém procura uma capacidade documentada em `pages/` ou reivindicada por um descritor, **Then** ela aparece exatamente uma vez como capacidade (ou está marcada de forma explícita como agrupamento transitório / residual, nunca silenciosa).
3. **Given** uma pasta ou cluster legado que não passa no teste de fronteira (capacidade reconhecível + ligar/desligar), **When** o inventário é lido, **Then** o item aparece como gap ou como residual a dividir/dissolver — não como capacidade concluída.

---

### User Story 2 - Registro priorizado de gaps (Priority: P1)

O mesmo mantenedor precisa de uma lista priorizada do que falta ou está inconsistente: documentação de usuário ausente, chave de configuração compartilhada ou órfã, ownership transitório, maturidade incompleta, páginas sem feature, features sem página (sem `undocumented` explícito), e qualquer outra divergência entre as fontes canônicas.

**Why this priority**: A direção de produto manda consolidar e fechar migração antes de expandir escopo; gaps sem prioridade não geram Spec Kit acionável.

**Independent Test**: Usar só o registro de gaps (sem inspecionar o código) e obter, para cada item, tipo de gap, evidência, impacto e prioridade relativa; escolher o de maior prioridade e saber qual seria a próxima especificação Spec Kit sugerida.

**Acceptance Scenarios**:

1. **Given** o inventário e as fontes canônicas, **When** o registro de gaps é gerado, **Then** cada gap tem tipo (cobertura documentação, chave/ownership, maturidade condicionada, residual a dividir/dissolver, inconsistência entre fontes), evidência objetiva e prioridade P1–P4; maturidade aparece como gap só quando a capacidade não é `exclusive` e há caminho legado paralelo, chave compartilhada/`null` sem fim justificado, ou residual ainda dono do comportamento.
2. **Given** lacunas já conhecidas (ex.: capacidades de atividades sem página dedicada; chaves compartilhadas no strangler; schema apontando feature inexistente; ownership transitório pós-dissolução de agregadores), **When** o registro é revisado, **Then** essas lacunas aparecem explicitamente — não “desaparecem” por omissão.
3. **Given** o registro priorizado, **When** um planejador decide a próxima fatia de consolidação, **Then** consegue justificar a escolha com a prioridade e o impacto registrados, sem reabrir o inventário do zero.

---

### User Story 3 - Inventário como base para Spec Kit e revisão (Priority: P2)

Quem abre uma especificação Spec Kit (capacidade nova ou revisão material) ou revisa um PR que toca fronteira de capacidade usa o inventário/gaps como fonte de verdade de produto: não inventa nome de feature por arquivo legado nem ignora um gap já catalogado sem justificativa.

**Why this priority**: Fecha o ciclo constituição → inventário → Spec Kit; evita regressão de nomenclatura e de escopo.

**Independent Test**: Simular o início de uma especificação de consolidação ou de capacidade tocada e verificar que o nome, a fronteira e o gap de partida vêm do inventário/registro — não de pasta legada.

**Acceptance Scenarios**:

1. **Given** uma demanda de revisão ou migração de capacidade existente, **When** a especificação Spec Kit é aberta, **Then** o nome e a fronteira partem de uma entrada do inventário (ou de um gap tipificado), nunca do nome de arquivo legado ou de página do SEI isolada.
2. **Given** uma proposta de capacidade **nova** enquanto ainda existem gaps de consolidação **P1** abertos, **When** o inventário e a direção de produto são consultados, **Then** a especificação Spec Kit MUST incluir justificativa explícita nomeando esses gaps P1 adiados e por que o trabalho novo ainda prevalece; sem essa justificativa a expansão não segue. Se a nova capacidade seguir, ela nasce no formato do inventário (nome de usuário, frase, ligar/desligar).
3. **Given** um PR que altera fronteira, chave ou documentação de capacidade, **When** a revisão ocorre, **Then** o revisor consegue checar se o inventário/registro de gaps permanece coerente ou se a mudança exige atualização do inventário no mesmo ciclo de trabalho; divergência coberta pela verificação objetiva falha o verify/CI até o mapa e as fontes alinharem.

---

### Edge Cases

- O que acontece se a mesma capacidade aparente tiver nomes diferentes em `pages/`, no schema e no descritor? O inventário MUST unificar sob o vocabulário do usuário e registrar a divergência de nomenclatura como gap (não criar três capacidades).
- O que acontece se uma chave de configuração for compartilhada de propósito durante strangler? O inventário MUST listar o compartilhamento como exceção explícita (gap de ownership/maturidade), nunca como cobertura “ok”.
- O que acontece se existir documentação em `pages/` sem comportamento correspondente, ou comportamento sem página e sem marcação `undocumented`? Ambos MUST aparecer como gaps de cobertura.
- O que acontece se um residual/orquestrador ainda existir após splits? MUST constar como residual com condição de esvaziamento, não como capacidade de usuário concluída.
- Como tratar infra transversal que não é capacidade (runtime compartilhado, login de host, etc.)? MUST ficar fora do inventário de capacidades de usuário ou em seção separada “não-capacidade”, para não inflar o mapa de produto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O projeto MUST manter um inventário de capacidades de usuário em `docs/capabilities-map.md` (mapa expandido: inventário completo + registro priorizado de gaps; o mapa parcial atual é o precursor a promover), cobrindo o conjunto atual da extensão, derivado das fontes canônicas (`pages/`, mapeamento função↔opção, schema de configuração e descritores de feature), sem usar nome de arquivo legado ou página do SEI como nome primário da capacidade.
- **FR-002**: Cada entrada de capacidade no inventário MUST incluir: identificador estável, nome no vocabulário do usuário, descrição em uma frase (sem implementação), indicação de ligar/desligar (chave própria, chave compartilhada explícita, ou `null` justificado), maturidade declarada da instalação (`declared` / `wired` / `exclusive` ou equivalente de produto), e referências às evidências (páginas, chaves, descritor).
- **FR-003**: O inventário MUST distinguir capacidades concluídas no teste de fronteira (reconhecível + ligar/desligar) de residuals, agrupamentos transitórios e itens “não-capacidade”.
- **FR-004**: O projeto MUST manter um registro de gaps derivado do inventário **no mesmo artefato canônico** (`docs/capabilities-map.md`, seção ou bloco irmão claramente ligado), tipificando pelo menos: documentação de usuário ausente ou órfã; chave órfã, compartilhada ou com ownership inconsistente; maturidade incompleta **quando elegível** (ver FR-013); residual a dividir ou dissolver; inconsistência entre fontes canônicas.
- **FR-005**: Cada gap MUST ter prioridade em escala fixa **P1–P4** (P1 = mais alta) e impacto descrito em linguagem de produto (o que o usuário ou o mantenedor deixa de poder decidir/verificar). Significado canônico: **P1** — impede inventário/fronteira honestos ou clareza de ligar/desligar para o usuário; **P2** — consolidação de ownership ou maturidade; **P3** — cobertura de documentação de usuário; **P4** — tidy-up / consistência de nomenclatura. Dentro do mesmo nível, a ordem relativa MAY ser refinada, mas o nível MUST estar presente.
- **FR-006**: Lacunas já conhecidas no mapa de capacidades atual (atividades sem páginas dedicadas; chaves compartilhadas no strangler; apontamentos de schema para feature inexistente; ownership transitório pós-dissolução de agregadores; telemetria sem pasta de feature) MUST ser incorporadas ao registro — nenhuma omitida sem justificativa explícita de “não é gap”.
- **FR-007**: O inventário e o registro de gaps MUST ser a referência de produto para Spec Kit ao revisar capacidade existente ou ao propor capacidade nova. Capacidade **nova** enquanto gaps de consolidação **P1** permanecerem abertos MUST passar por **portão suave**: a especificação Spec Kit MUST justificar explicitamente, nomeando os gaps **P1** adiados e o motivo de o trabalho novo prevalecer; bypass sem justificativa NÃO é permitido. NÃO há bloqueio absoluto até zerar gaps P1. Gaps P2–P4 NÃO disparam sozinhos o portão suave (podem ser citados na justificativa se relevantes).
- **FR-008**: Qualquer atualização material de fronteira, chave, descritor ou página de capacidade MUST atualizar o inventário e/ou o registro de gaps no mesmo ciclo de trabalho, de modo que o artefato não fique silenciosamente defasado.
- **FR-009**: MUST existir verificação objetiva de que o inventário não diverge das fontes canônicas nas dimensões cobertas (cobertura páginas↔descritores↔chaves, exceções explícitas de chave compartilhada, ausência de capacidade “fantasma” só por pasta). Essa verificação MUST **falhar de forma bloqueante** no caminho normal de verify/CI quando houver divergência; a prosa humana em `docs/capabilities-map.md` MUST permanecer consistente com o que a verificação afirma (mapa editado por humanos, mas não pode contradizer o portão).
- **FR-010**: Capacidade nova MUST nascer já no formato do inventário; é proibido adicionar comportamento a residual/agregador legado em vez de capacidade nomeada.
- **FR-011**: O inventário em `docs/capabilities-map.md` MUST NOT substituir a documentação de usuário em `pages/`; `pages/` permanece a prosa voltada ao usuário final, e o mapa expandido a visão de produto/manutenção. MUST NOT criar inventário paralelo fora desse home canônico (resumo separado ou cópia sob `specs/` não substitui o mapa).
- **FR-012**: O registro de gaps desta feature MUST identificar e priorizar gaps; o fechamento completo de cada gap (migração para `exclusive`, split de chave, nova página de usuário, etc.) MAY ser especificado em Spec Kits seguintes — exceto correções documentais mínimas necessárias para o próprio inventário fechar com honestidade.
- **FR-013**: Maturidade (`declared` / `wired` / `exclusive`) MUST sempre constar na entrada do inventário. Um gap de tipo maturidade MUST ser aberto somente se a capacidade **não** está `exclusive` **e** pelo menos uma destas condições for verdadeira: (1) caminho legado paralelo ainda ativo para o comportamento; (2) chave de configuração compartilhada ou `null` sem estado-fim justificado no inventário; (3) residual/agregador ainda é dono do comportamento da capacidade. Capacidade `wired`/`declared` sem essas condições MUST NOT gerar gap de maturidade só por não ser `exclusive`.

### Key Entities

- **Capacidade**: Unidade de valor que o usuário reconhece e, em regra, liga/desliga; nome e fronteira no vocabulário do usuário.
- **Entrada de inventário**: Registro de uma capacidade (ou residual/não-capacidade rotulado) com evidências e estado de maturidade/ownership.
- **Gap de capacidade**: Divergência ou ausência entre o estado desejado (fronteira ADR-0007 + consolidação) e o estado atual evidenciado nas fontes canônicas; sempre classificado em **P1–P4** conforme FR-005.
- **Fonte canônica**: `pages/`, CSVs de mapeamento função↔opção, schema de configuração e descritores de feature. O **inventário vigente** é `docs/capabilities-map.md` (mapa expandido), não um artefato paralelo.
- **Exceção explícita**: Compartilhamento de chave ou `undocumented`/`configKey: null` justificado — visível no inventário, nunca implícito.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das páginas de usuário em `pages/` e 100% dos descritores de feature vigentes aparecem no inventário (como capacidade, residual rotulado, ou gap de cobertura) — zero omissão silenciosa; falha de cobertura quebra verify/CI.
- **SC-002**: 100% das chaves de configuração do schema estão ligadas a exatamente uma reivindicação de capacidade no inventário, ou listadas como exceção explícita / gap tipificado (órfã, compartilhada, ownership inconsistente); divergência quebra verify/CI.
- **SC-003**: O registro de gaps lista, no mínimo, todas as lacunas já admitidas no mapa de capacidades vigente, cada uma com tipo e prioridade **P1–P4** — verificável por checklist de inclusão.
- **SC-004**: Um mantenedor consegue, em até 15 minutos, responder “quais são as 5 próximas consolidações de capacidade mais importantes e por quê?” usando só o registro priorizado (ordenação por P1→P4, depois ordem relativa no nível).
- **SC-005**: Em revisão amostral de 10 capacidades, ≥90% têm descrição em uma frase compreensível por alguém que não conhece o código, sem mencionar arquivo, pasta ou página técnica do SEI como definição da capacidade.
- **SC-006**: Após a entrega, abrir Spec Kit de consolidação ou de capacidade tocada usa o inventário/gaps como ponto de partida em 100% dos casos de fronteira de capacidade (checável na especificação ou no PR).

## Assumptions

- Esta feature é de **produto e governança** (inventário + gaps + verificação de coerência), não de entrega de comportamento novo no SEI para o usuário final.
- `docs/capabilities-map.md` é o home canônico: esta feature **expande** o mapa parcial atual até inventário completo + gaps priorizados (não cria inventário paralelo nem arquiva o mapa em favor de outro doc). A verificação de cobertura/divergência é portão bloqueante de verify/CI; o teste de cobertura existente é ponto de partida a estender, não substituto do inventário.
- Fechar migrações (`exclusive`), criar chaves próprias para `atividades-*`, escrever páginas novas de usuário e dissolver residuals são **trabalhos seguintes** alimentados por este registro — salvo ajustes documentais mínimos para honestidade do inventário.
- A consolidação priorizada pelos gaps **precede** expansão de escopo com capacidades novas, via **portão suave** sobre gaps **P1**: justificativa explícita no Spec Kit da capacidade nova (gaps P1 nomeados + motivo), não bloqueio absoluto até fechar todos os P1.
- “Usuário” do inventário é mantenedor/contribuinte/planejador Spec Kit; o usuário final continua sendo servido por `pages/` e pela UI de opções.
- Capacidade não-`exclusive` sem caminho legado paralelo, sem chave compartilhada/`null` injustificada e sem residual dono do comportamento: maturidade fica só como estado na entrada — não como gap automático.
- Infraestrutura moderna compartilhada e runtime transversal não-capacidade ficam fora do inventário de capacidades ou em seção “não-capacidade”, para não competir com o mapa de produto.
