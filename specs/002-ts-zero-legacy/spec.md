# Feature Specification: Código Novo Sem Legado (TypeScript na Arquitetura Moderna)

**Feature Branch**: `002-ts-zero-legacy`

**Created**: 2026-08-10

**Status**: Implemented

**Input**: User description: "todo codigo a partir de agora, novo ou migração ou correção, deve ser em TS. além disso deve está ja dentro da nova aquitetura, com as melhor praticas e utilizando os melhores elementos da dom e do html possiveis. deve tambem nao deixar e nao estar conectado a nenhuma parte legada, deve criar tudo o que precisa dentro da nova arquitetura. nao deve de forma alguma depender ou se ligar a qualquer arquivo legado, mesmo que seja necessário migrar outros elementos para que isso possa ocorrer" + adendo: "se for necessário o agente deve pedir acesso ao SEI no navegador integrado para conhecer o html e dom da pagina para melhor desenvolvimento"

## Clarifications

### Session 2026-08-10

- Q: When a delivery changes a capability that still has a parallel legacy path, what outcome is required for that capability? → A: Any touch requires migrating the full dependency closure to exclusive before merge (Option D)
- Q: What counts as a forbidden link to legacy for the zero-coupling rule? → A: Anything not installed as an exclusive modern capability counts as legacy (Option B)
- Q: How must the quality gate enforce this policy on every delivery? → A: Both mandatory: automated checks and human policy review before merge (Option C)
- Q: What may the agent keep from a SEI page inspection in the integrated browser? → A: Ephemeral only — inspect in browser; do not save HTML/screenshots anywhere (Option A)
- Q: Which kinds of repository changes trigger this full exclusive-closure policy? → A: Any change to product runtime behavior/code (features, shared/core/sei/platform used by the extension); docs-only excluded (Option B)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mudança entrega só código tipado na arquitetura moderna (Priority: P1)

Um contribuinte precisa adicionar comportamento novo, migrar uma capacidade existente ou corrigir um defeito. Ele entrega a mudança somente em TypeScript, já estruturada na arquitetura moderna do projeto (fronteiras por capacidade e por contexto de execução), sem acoplar a arquivos ou caminhos legados.

**Why this priority**: Sem isso, cada correção e cada feature reforçam a convivência das duas arquiteturas e atrasam o fim da transição.

**Independent Test**: Revisar um PR (ou fatia) de feature nova, migração ou correção e verificar que todo o código do fecho tocado está tipado, instalado como capacidade moderna **exclusive**, e não importa nem invoca nada que não seja capacidade **exclusive** (ou infraestrutura moderna compartilhada permitida).

**Acceptance Scenarios**:

1. **Given** uma demanda de capacidade nova, **When** a mudança é entregue (merge), **Then** o fecho está em TypeScript, instalado como capacidade **exclusive**, e não referencia nada que não seja **exclusive**/infraestrutura moderna permitida.
2. **Given** uma migração de comportamento ainda no legado, **When** a fatia é concluída no merge, **Then** o fecho migrado vive como capacidade **exclusive** em TypeScript e não depende de qualquer caminho que não seja **exclusive**.
3. **Given** uma correção de defeito cujo comportamento ainda reside no legado, **When** a correção é entregue (merge), **Then** o fecho completo de dependências da mudança foi migrado para a arquitetura moderna em TypeScript com maturidade **exclusive** — sem caminho legado paralelo restante para esse fecho, e sem remendo só no arquivo legado.
4. **Given** a mudança precisa de utilitário, UI, parsing ou contrato que hoje só existe no legado, **When** a entrega é planejada até o merge, **Then** todo o fecho de dependências necessário também é migrado para a arquitetura moderna com maturidade **exclusive** (na mesma fatia ou em fatias pré-requisito anteriores ao merge), de modo que nada do fecho tocado permaneça ligado ao legado.

---

### User Story 2 - Interface usa HTML/DOM semântico e acessível (Priority: P1)

Quando a mudança inclui interface (inserção ou alteração de elementos na página do SEI ou na página de opções), o contribuinte usa elementos HTML nativos e padrões de DOM adequados à tarefa (semântica, foco, teclado, formulários nativos quando couber), alinhados às melhores práticas do projeto — sem handlers inline novos e sem padrões obsoletos que o legado ainda usa.

**Why this priority**: A extensão opera sobre páginas reais do SEI; DOM frágil ou não semântico gera regressão, inacessibilidade e acoplamento acidental ao legado.

**Independent Test**: Em uma mudança com UI, inspecionar os elementos introduzidos ou alterados e confirmar uso de elementos semânticos/nativos apropriados e ausência de padrões proibidos (ex.: handlers inline novos).

**Acceptance Scenarios**:

1. **Given** uma mudança que adiciona controle interativo, **When** a UI é entregue, **Then** usa elemento nativo adequado (botão, link, campo de formulário, etc.) com comportamento de teclado e foco coerentes, em vez de elementos genéricos com papel improvisado quando o nativo basta.
2. **Given** uma mudança que exibe conteúdo estruturado, **When** a marcação é entregue, **Then** a hierarquia e os papéis semânticos refletem o significado (listas, headings, labels associados), sem markup só cosmético que ocupe o lugar da semântica.
3. **Given** a arquitetura moderna já define padrões de UI compartilhada, **When** a feature precisa de primitiva equivalente, **Then** reutiliza ou estende o primitivo moderno — não copia o padrão legado de manipulação de DOM.

---

### User Story 3 - Portão impede regressão para o legado (Priority: P1)

Quem revisa ou o portão de qualidade rejeita entregas que introduzam código não tipado na área de mudança, que liguem código novo/migrado/corrigido a arquivos legados, ou que deixem comportamento novo apenas no caminho legado.

**Why this priority**: A regra só permanece verdadeira se for verificável; sem portão, atalhos “só desta vez” voltam.

**Independent Test**: Simular (em ambiente de verificação) um PR que acopla o fecho a algo não-**exclusive**, ou que corrige só o legado em linguagem não tipada, e observar falha clara na verificação automatizada e/ou na revisão humana obrigatória; remover o desvio e observar que ambas as partes do portão passam.

**Acceptance Scenarios**:

1. **Given** uma mudança sob esta política, **When** o código entregue está em linguagem não tipada ou fora da arquitetura moderna, **Then** a verificação falha com motivo acionável.
2. **Given** código na arquitetura moderna do fecho tocado, **When** ele importa, chama ou se acopla a qualquer coisa que **não** esteja instalada como capacidade moderna **exclusive** (nem seja infraestrutura moderna compartilhada permitida), **Then** a verificação falha.
3. **Given** uma correção ou feature que só altera o caminho legado sem trazer o comportamento para a arquitetura moderna, **When** a verificação de política roda, **Then** a entrega é rejeitada.
4. **Given** uma fatia que migrou o fecho completo para **exclusive** tipado e passou nas checagens automatizadas, **When** a revisão humana de política ainda não ocorreu ou rejeita a entrega, **Then** o merge permanece bloqueado até a revisão humana aprovar.
5. **Given** uma fatia com fecho **exclusive** tipado, checagens automatizadas verdes e revisão humana de política aprovada, **When** o portão completo avalia, **Then** a política passa.

---

### User Story 4 - Fatia permanece utilizável mesmo com migração ampliada (Priority: P2)

O contribuinte pode precisar migrar mais do que o pedido original (dependências legadas no caminho crítico). Mesmo assim, ao fim de cada fatia entregue, a extensão continua utilizável para o usuário final.

**Why this priority**: A política proíbe atalho via legado; sem preservar usabilidade, fatias grandes quebram o produto e a migração honestamente incremental.

**Independent Test**: Após uma fatia que migrou pré-requisitos extras para evitar acoplamento legado, carregar a extensão e confirmar que fluxos críticos cobertos pela fatia (e o restante não tocado) seguem operacionais.

**Acceptance Scenarios**:

1. **Given** a correção exige migrar um módulo auxiliar legado antes, **When** a sequência de fatias conclui no merge, **Then** o fecho completo está **exclusive** na arquitetura moderna, a extensão permanece carregável e os fluxos afetados não dependem de caminho legado paralelo.
2. **Given** não é possível completar todo o fecho numa única fatia sem risco inaceitável, **When** o trabalho é fatiado, **Then** fatias intermediárias só avançam migração de pré-requisitos na arquitetura moderna (sem ligar código novo ao legado) e o **merge da mudança solicitada só ocorre** quando o fecho completo estiver **exclusive**.

---

### User Story 5 - Agente inspeciona o SEI real quando o DOM importa (Priority: P2)

Um agente de desenvolvimento (assistente automatizado no fluxo do projeto) que precisa compreender o HTML/DOM real de uma página do SEI para entregar UI ou comportamento alinhado à página **pede acesso** ao SEI no navegador integrado ao ambiente de desenvolvimento, em vez de inventar a estrutura da página ou copiar padrões frágeis do legado.

**Why this priority**: A qualidade de HTML/DOM semântico (User Story 2) depende do SEI real; chute sobre a página gera seletores errados, markup inadequado e retrabalho.

**Independent Test**: Em uma tarefa que toca UI ou estrutura de página do SEI e em que o agente não tem evidência suficiente do DOM atual, verificar que o agente solicita explicitamente acesso/navegação ao SEI no navegador integrado antes de fechar a entrega — ou documenta por que a inspeção não foi necessária (evidência já suficiente).

**Acceptance Scenarios**:

1. **Given** a tarefa exige inserir ou alterar UI numa página do SEI e o agente não tem evidência atual do HTML/DOM dessa página, **When** o agente avança o desenvolvimento, **Then** ele pede ao humano acesso ao SEI via navegador integrado (ou confirma sessão já autorizada) e inspeciona a página antes de decidir markup/seletores/comportamento de DOM.
2. **Given** o humano concede acesso e a página do SEI está disponível no navegador integrado, **When** o agente inspeciona, **Then** usa o HTML/DOM observado (e o ACL/conhecimento moderno do projeto) para moldar a solução — sem acoplar a arquivos legados.
3. **Given** a tarefa é puramente interna (sem UI de página do SEI) ou já existe evidência suficiente e atual do DOM necessário, **When** o agente trabalha, **Then** não é obrigatório abrir o SEI; a dispensa fica implícita pelo escopo ou é registrada de forma breve quando houver dúvida.
4. **Given** o acesso ao SEI não pode ser concedido no momento, **When** a inspeção seria necessária, **Then** o agente não inventa a estrutura da página: sinaliza o bloqueio, descreve o que precisa ver e só entrega trechos que não dependam de chute sobre o DOM — ou aguarda o acesso.
5. **Given** o agente obteve acesso e inspecionou a página no navegador integrado, **When** a sessão de inspeção termina, **Then** nenhum HTML, captura de tela ou conteúdo de página do SEI foi salvo fora da inspeção efêmera (nem no repositório, nem como artefato persistido da tarefa).

---

### Edge Cases

- O que acontece se o defeito está só num arquivo legado e “o mínimo” parece ser editar uma linha lá? A política exige migrar o **fecho completo de dependências** para a arquitetura moderna em TypeScript com maturidade **exclusive** antes do merge; edição isolada no legado não satisfaz.
- O que acontece se a correção urgente parece incompatível com migrar o fecho completo? Não há exceção silenciosa: o merge da correção/feature só ocorre quando o fecho estiver **exclusive**; o trabalho pode ser decomposto em fatias pré-requisito, documentando o risco de atraso — sem contornar a regra nem manter dual-path no merge.
- Se o fecho a migrar não tem testes: MUST cobrir o comportamento atual antes de mover (constituição V — characterization tests); fatia sem essa cobertura não mergeia.
- Como tratar código de terceiros (bibliotecas vendor)? Não é “legado do projeto”; permanece fora do escopo desta política de desacoplamento interno, desde que o código *do projeto* que o consome esteja na arquitetura moderna tipada.
- Como tratar testes, scripts de build e documentação? Mudanças **somente de prosa/markdown/documentação** estão fora do fecho **exclusive**. Código de produto (runtime da extensão: capacidades e infraestrutura moderna usada pela extensão) está no escopo integral. Testes e scripts/ferramentas do repositório, quando criados ou materialmente alterados, seguem tipagem e não-acoplamento a superfície não-**exclusive**, sem exigir por si só maturidade **exclusive** de uma capacidade de produto — salvo quando a mudança de teste/tooling acompanha alteração de runtime de produto, caso em que o fecho de produto aplica-se por completo.
- O que acontece se dois caminhos (legado e moderno) ainda existem para a capacidade tocada? Antes do merge, o fecho tocado MUST estar **exclusive**: caminho legado paralelo desse fecho removido ou desativado; dual-path (**wired**) NÃO satisfaz a política para o escopo tocado.
- Como tratar `@ts-nocheck` ou tipagem falsa? Código entregue sob esta política MUST ser TypeScript verificável de fato; marcar dívida nova de tipagem para “passar” não satisfaz.
- O que acontece se o agente “acha que lembra” o DOM do SEI? Memória ou cópia de conversas anteriores NÃO substitui inspeção quando a tarefa depende da estrutura atual da página; na dúvida, pedir acesso e inspecionar.
- O que acontece se o login no SEI ou a rede institucional bloqueia o navegador integrado? O agente trata como bloqueio (cenário 4 da User Story 5): não chuta o DOM; pede desbloqueio. Evidência alternativa persistida (HTML exportado/captura guardada) NÃO é permitida como substituto — a inspeção é efêmera no navegador integrado, ou o trabalho que depende do DOM aguarda o acesso.
- A inspeção do SEI autoriza copiar jQuery/handlers do legado observados na página? Não. Observar o DOM da página do SEI serve para encaixe correto na página hospedeira; a implementação continua na arquitetura moderna, tipada e desacoplada do legado.
- Pode o agente gravar HTML ou screenshots do SEI para “lembrar depois”? Não. A inspeção é **somente efêmera** no navegador integrado; MUST NOT salvar HTML, screenshots ou conteúdo de página do SEI em repositório, tickets, fixtures ou outros artefatos persistidos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Todo código de produto entregue a partir desta política (capacidade nova, migração ou correção) MUST ser escrito em TypeScript verificável.
- **FR-002**: Esse código MUST residir e se integrar na arquitetura moderna do projeto (fronteira por capacidade, composição por contexto de execução, direção de dependência da arquitetura moderna).
- **FR-003**: Código do fecho tocado MUST NOT importar, invocar, estender nem acoplar-se a qualquer coisa que **não** esteja instalada como capacidade moderna **exclusive** (exceto infraestrutura moderna compartilhada permitida). A definição operacional dessa superfície é FR-014.
- **FR-004**: Se o comportamento desejado depender de algo que hoje só existe no legado, a entrega MUST aplicar a regra de fecho completo e maturidade **exclusive** definida em FR-013 antes do merge — nunca “ligar no legado para desbloquear” nem deixar dual-path no escopo tocado.
- **FR-005**: Correções MUST NOT ser aplicadas somente no caminho legado; qualquer toque material exige fecho **exclusive** no caminho moderno tipado. O legado não recebe comportamento novo nem remendo que perpetue dependência.
- **FR-006**: Mudanças de interface MUST preferir elementos HTML/DOM nativos e semânticos adequados à tarefa, com práticas de acessibilidade básicas (nome acessível, foco, teclado) e MUST NOT introduzir handlers inline nem padrões de DOM obsoletos típicos do legado.
- **FR-007**: Quando existir primitiva de UI ou utilitário equivalente na arquitetura moderna, a mudança MUST reutilizá-lo ou estendê-lo; MUST NOT reintroduzir o equivalente legado.
- **FR-008**: O portão de qualidade MUST rejeitar entregas que violem FR-001–FR-007 e FR-013–FR-017. O portão MUST ser **duplo e obrigatório** antes do merge: (1) verificação automatizada e (2) revisão humana de política. Falha em qualquer um dos dois bloqueia o merge.
- **FR-009**: Cada fatia entregue sob esta política MUST deixar a extensão utilizável (carregável e operacional nos fluxos não propositalmente descontinuados).
- **FR-010**: É proibido declarar conformidade só por renomear arquivo, envolver legado sem migrar, ou tipar superficialmente código que continua acoplado ao legado.
- **FR-011**: Quando um agente de desenvolvimento precisar conhecer o HTML/DOM atual de uma página do SEI para entregar mudança de interface ou comportamento acoplado à página, ele MUST pedir acesso ao SEI no navegador integrado ao ambiente de desenvolvimento e inspecionar a página antes de fechar decisões de markup/DOM — MUST NOT inventar a estrutura da página.
- **FR-012**: A inspeção no navegador integrado MUST complementar (não substituir) as regras FR-001–FR-007: evidência do SEI real alimenta o desenho moderno; MUST NOT justificar acoplamento a superfície legada.
- **FR-013**: Qualquer toque material em **código/comportamento de runtime de produto** (capacidade nova, migração ou correção em capacidades ou em infraestrutura moderna usada pela extensão) MUST migrar o fecho completo de dependências para maturidade **exclusive** antes do merge; dual-path (**wired**) no fecho tocado NÃO é aceito como resultado da entrega.
- **FR-014**: A definição operacional de legado nesta política é: **não instalado como capacidade moderna exclusive**. Capacidades `declared`/`wired`, auto-boot legado, globals e caminhos paralelos contam como legado e são acoplamento proibido para o fecho tocado.
- **FR-015**: A verificação automatizada MUST cobrir, no mínimo, tipagem verificável do fecho e ausência de acoplamento a superfície não-**exclusive**. A revisão humana MUST cobrir, no mínimo, maturidade **exclusive** do fecho, qualidade HTML/DOM quando houver UI, e honestidade do fecho de dependências.
- **FR-016**: A inspeção do SEI no navegador integrado MUST ser **somente efêmera**: o agente MUST NOT salvar HTML, screenshots ou conteúdo de página do SEI em repositório, fixtures, tickets ou outros artefatos persistidos.
- **FR-017**: Esta política (fecho **exclusive** + portão duplo) MUST aplicar-se a mudanças de runtime de produto; mudanças **somente de documentação/prosa** estão fora. Testes e tooling MUST permanecer tipados e sem acoplamento a superfície não-**exclusive** quando alterados, sem sozinhos obrigar exclusive de capacidade — a menos que acompanhem mudança de runtime de produto.

### Key Entities

- **Arquitetura moderna**: Conjunto de fronteiras e convenções vigentes (capacidade, contexto de execução, camadas permitidas) onde código novo deve viver.
- **Superfície legada**: Tudo que **não** está instalado como capacidade moderna **exclusive** (incluindo `declared`/`wired`, auto-boot, globals e caminhos paralelos). Existe para ser esvaziado, não para receber acoplamento do fecho tocado. A única exceção de consumo permitida no fecho é infraestrutura moderna compartilhada explicitamente permitida (fora do modelo de maturidade de feature).
- **Fatia de entrega**: Unidade de mudança que passa no portão de qualidade e mantém a extensão utilizável ao final.
- **Pré-requisito de migração**: Elemento ainda legado que precisa ser criado/migrado na arquitetura moderna para fechar o fecho de dependências até **exclusive**.
- **Fecho de dependências**: Conjunto fechado de elementos necessários para o comportamento tocado (o próprio comportamento e tudo de que ele depende) que MUST estar **exclusive** na arquitetura moderna antes do merge.
- **Caminho moderno de UI**: Uso de HTML/DOM semântico e primitivas compartilhadas modernas, em oposição a manipulação legada.
- **Inspeção do SEI no navegador integrado**: Acesso autorizado à página real do SEI dentro do navegador do ambiente de desenvolvimento, para obter HTML/DOM atual como evidência **efêmera** de implementação (sem persistir conteúdo da página).
- **Portão duplo**: Conjunto obrigatório de (1) verificação automatizada e (2) revisão humana de política; ambos MUST passar antes do merge.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das entregas de código de produto (nova capacidade, migração ou correção) após a vigência desta política passam no portão **duplo** (automatizado + revisão humana) com fecho **exclusive**, sem acoplamento a qualquer coisa não-**exclusive**, e sem código de produto novo em linguagem não tipada.
- **SC-007**: Zero merges sob a política com apenas um dos lados do portão (só CI ou só revisão humana) no período de medição após vigência.
- **SC-002**: Em amostragem de revisão (mínimo 10 fatias consecutivas sob a política), 100% das mudanças com UI usam elementos nativos/semânticos adequados e zero handlers inline novos.
- **SC-003**: Zero incidentes de “correção só no legado” ou de merge com fecho ainda em dual-path (**wired**) aceitos no período de medição após vigência — toda correção/feature amostrada aterra com fecho **exclusive** tipado.
- **SC-004**: Quando uma fatia amplia escopo por pré-requisitos de migração, 100% dessas fatias ainda resultam em extensão carregável e fluxos críticos cobertos pela fatia operacionais no smoke acordado.
- **SC-005**: Contribuidores conseguem explicar, em uma frase por PR, qual pré-requisito legado foi migrado (se houve) para evitar acoplamento — e revisores rejeitam PRs sem essa clareza quando o escopo cresceu.
- **SC-006**: Em amostragem de tarefas de agente que tocam UI/DOM de página do SEI (mínimo 5), ≥90% pedem ou usam inspeção no navegador integrado quando a evidência do DOM atual era necessária — e 0% fecham a entrega inventando a estrutura da página sob bloqueio de acesso.
- **SC-008**: 0% das tarefas amostradas de inspeção SEI persistem HTML, screenshots ou conteúdo de página do SEI em artefatos versionados ou anexos duráveis.

## Assumptions

- “A partir de agora” aplica-se a todo trabalho novo de **runtime de produto** após a vigência desta especificação; dívida legada intocada pode permanecer até ser migrada, mas qualquer toque material em comportamento/código de runtime cai sob a política. Operacionalmente, “toque material” é qualquer caminho de runtime sob `src/`, `manifest.base.json` ou `assets/` presente no diff da entrega; documentação/prosa pura não dispara o fecho **exclusive**.
- O conjunto a migrar por correção/feature é o **fecho completo de dependências** do comportamento tocado até maturidade **exclusive** antes do merge — não necessariamente toda a extensão, mas também não basta “só o arquivo novo sem importar legado” se dependências do fecho permanecerem dual-path.
- A constituição do projeto (migração honesta, TypeScript para código novo, legado sem comportamento novo) permanece válida; esta feature **endurece** a regra: qualquer toque exige fecho **exclusive** tipado e proíbe ligação ao legado, mesmo que aumente o escopo até o merge.
- “Melhores elementos de DOM/HTML” significa preferência por semântica nativa e acessibilidade básica, alinhada às práticas já documentadas do projeto (sem handlers inline novos; UI compartilhada moderna quando existir).
- Bibliotecas de terceiros versionadas como vendor não contam como superfície legada interna.
- Verificação automatizada e revisão humana de política são **ambas obrigatórias** no merge; nenhuma substitui a outra. O detalhe de ferramentas/checklist fica para o plano.
- A medição dos critérios percentuais começa no primeiro PR de runtime aprovado após a ativação da proteção do branch padrão; o responsável pela manutenção do repositório registra a amostra e os incidentes.
- Empacotamento, marca e canais de distribuição da extensão estão fora do escopo desta feature.
- “Agente” significa assistente automatizado que implementa ou migra código neste repositório; a obrigação de pedir acesso aplica-se quando a inspeção do SEI é necessária para qualidade da entrega, não em toda tarefa.
- Credenciais, sessão e autorização de acesso ao SEI permanecem sob controle do humano; o agente pede acesso e inspeciona apenas o que for concedido.
- Evidência alternativa persistida (HTML exportado, captura guardada em arquivo/ticket) **não** substitui a inspeção efêmera: se o navegador integrado estiver indisponível, o trabalho que depende do DOM atual aguarda o acesso.
- “Infraestrutura moderna compartilhada permitida” (ex.: núcleo tipado compartilhado, ACL SEI, ports de plataforma já na arquitetura moderna) não conta como capacidade de feature **exclusive**, mas também não conta como legado — desde que ela própria não dependa de superfície não-**exclusive**. O detalhamento do inventário fica para o plano.
