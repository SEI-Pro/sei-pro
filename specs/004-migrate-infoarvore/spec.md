# Feature Specification: Migrar Informações Adicionais na Árvore

**Feature Branch**: `004-migrate-infoarvore`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "Vamos migrar para a nova arquitetura, e migrar que eu falo já é entrar dentro dessas definições que a gente fez de novos códigos criados, né? Toda a parte relacionada com a opção da configuração 'Informações adicionais na árvore do processo'. E aí a gente vai migrar tudo para a arquitetura nova. Vamos aproveitar e verificar se tem alguma forma melhor de fazer o que já está implementado, usando os elementos do HTML ou da DOM melhores. E, se for preciso reescrever o spec, pode reescrever. E se você achar que isso tem que ser dividido em specs, em mais specs, você me avisa que eu faço mais specs. Essa parte de informações que aparece ali na barra onde tem a árvore de processos, nesse momento tá funcional. Então, eu não vejo nada que precise ser corrigido, além do que vai ser mudado agora, né. E aí lembra, a gente tem que passar pra nova arquitetura. Então, tem que isolar tudo pro novo código, HTML, CSS..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver informações do processo junto à árvore (Priority: P1)

Um servidor que está visualizando um processo no SEI liga a opção **Informações adicionais na árvore do processo**. Ao abrir a árvore do processo, ele vê, na mesma área da árvore, um painel com informações auxiliares do processo (atribuição, marcador, especificação, tipo de procedimento, nível de acesso, interessados, assuntos, observações e demais seções já disponíveis hoje nessa capacidade), sem precisar abrir outras telas só para consultar esses dados.

**Why this priority**: É o valor central da capacidade; sem o painel legível e confiável, a migração não entrega o produto.

**Independent Test**: Com a opção ligada, abrir um processo com dados preenchidos e confirmar que o painel aparece junto à árvore com as seções esperadas; com a opção desligada, confirmar que o painel não aparece.

**Acceptance Scenarios**:

1. **Given** a opção está ligada e o usuário abre a visualização de um processo, **When** a árvore do processo carrega, **Then** o painel de informações adicionais monta na área da árvore e exibe as seções habilitadas para aquele usuário.
2. **Given** a opção está desligada, **When** o usuário abre a árvore do mesmo processo, **Then** o painel de informações adicionais não é apresentado.
3. **Given** o painel já está montado e a árvore recebe novos nós ou atualizações de conteúdo, **When** a árvore muda, **Then** o painel permanece utilizável e as informações exibidas continuam coerentes com o processo atual (sem painel duplicado nem estado “travado” de carregamento permanente).

---

### User Story 2 - Personalizar quais informações aparecem (Priority: P1)

O usuário personaliza quais blocos de informação deseja ver no painel (via o fluxo já conhecido de personalização do menu/painel). Após salvar a escolha, só as seções selecionadas aparecem; as demais ficam ocultas até nova personalização.

**Why this priority**: A documentação de produto e o uso atual dependem dessa personalização; perder isso seria regressão funcional.

**Independent Test**: Alterar a seleção de seções, recarregar a árvore e verificar que apenas as seções escolhidas aparecem.

**Acceptance Scenarios**:

1. **Given** o usuário selecionou um subconjunto de seções, **When** a árvore carrega, **Then** somente as seções selecionadas são mostradas no painel.
2. **Given** o usuário restaura a seleção padrão (todas as seções aplicáveis), **When** a árvore carrega, **Then** as seções padrão voltam a aparecer.
3. **Given** uma seção depende de dado indisponível no processo, **When** o painel tenta preenchê-la, **Then** a seção permanece visível (se habilitada) com estado claro de indisponível/vazio/falha, sem derrubar o restante do painel.

---

### User Story 3 - Consultar e, quando aplicável, atualizar dados no próprio painel (Priority: P2)

Onde a capacidade já permite hoje interação no painel (por exemplo editar atribuição, marcador, acompanhamento ou anotação inline), o usuário continua podendo realizar essas ações a partir do painel, com feedback de carregamento, sucesso e falha, sem regressão em relação ao comportamento atual.

**Why this priority**: Parte do valor diário está na edição inline; a migração deve preservar esses fluxos, sem expandir escopo para capacidades de produto distintas.

**Independent Test**: Em um processo onde a ação já é possível hoje, executar a ação pelo painel e confirmar o mesmo resultado de negócio (dado atualizado e painel coerente após a ação).

**Acceptance Scenarios**:

1. **Given** uma seção editável está habilitada e o dado está disponível, **When** o usuário inicia a edição pelo painel, **Then** vê um formulário ou editor adequado na própria seção, com opção de cancelar sem perder o estado anterior.
2. **Given** o usuário confirma uma alteração válida, **When** a operação conclui com sucesso, **Then** o painel reflete o novo valor sem exigir recarregar a página inteira do SEI.
3. **Given** a operação falha (rede, permissão ou formulário indisponível), **When** o erro ocorre, **Then** o usuário vê indicação de falha na seção afetada e o restante do painel continua utilizável.

---

### User Story 4 - Capacidade isolada na arquitetura moderna, com HTML/DOM e estilos próprios (Priority: P1)

Quem mantém a extensão entrega esta capacidade já alinhada às regras de código novo do projeto: instalação exclusiva da capacidade moderna, sem acoplamento a caminho legado, markup e estilos isolados da capacidade, e uso de elementos HTML/DOM adequados (semântica, foco, teclado, formulários nativos quando couber) em vez de padrões frágeis herdados do porte antigo.

**Why this priority**: O pedido explícito é migrar de verdade — não só manter um rótulo de maturidade — isolando apresentação e comportamento no código novo e melhorando o DOM onde fizer sentido, sem corrigir bugs de produto inexistentes.

**Independent Test**: Revisar a entrega da capacidade e confirmar: a opção de configuração desta capacidade continua sendo a chave de produto; comportamento observável preservado; capacidade instalada de forma exclusiva; estilos e markup novos isolados; sem dependência de caminho legado; UI nova/alterada usa elementos nativos adequados.

**Acceptance Scenarios**:

1. **Given** a capacidade está entregue, **When** a extensão carrega no contexto da árvore, **Then** o painel é instalado somente pela capacidade moderna correspondente à opção **Informações adicionais na árvore do processo**, sem caminho paralelo legado para o mesmo comportamento.
2. **Given** a capacidade precisa de leitura de página do SEI, envio de formulário ou utilitário compartilhado, **When** a entrega é concluída, **Then** todo o fecho necessário está na arquitetura moderna (capacidade exclusive ou infraestrutura moderna permitida), sem importar ou invocar legado.
3. **Given** a UI do painel é montada ou atualizada, **When** se inspeciona markup e estilos, **Then** elementos interativos usam controles nativos adequados, conteúdo estruturado tem semântica coerente, não há handlers inline novos, e os estilos da capacidade estão isolados no código novo da capacidade, sem depender de estilos legados compartilhados como fonte de verdade.
4. **Given** uma seção falha ao carregar ou ao salvar, **When** o erro ocorre, **Then** a falha fica contida na seção/capacidade e não derruba o restante da extensão no contexto da árvore.

---

### Edge Cases

- Processo sem interessados, assuntos, marcador, atribuição ou observação: seções habilitadas mostram estado vazio explícito, não parecem “quebradas”.
- Links/ações de toolbar do SEI ausentes (versão diferente, permissão ou layout): seções afetadas degradam com mensagem de indisponível; demais seções seguem.
- Árvore lenta ou iframe ainda vazio: o painel não aborta em silêncio eterno; ou monta quando a árvore fica pronta, ou comunica indisponibilidade sem travar a navegação no processo.
- Personalização de seções ausente ou inválida: cai no padrão “todas as seções aplicáveis”.
- Caracteres especiais / acentuação vindos do SEI: textos exibidos permanecem legíveis (sem mojibake residual na experiência do usuário).
- Usuário cancela edição inline a meio caminho: a seção volta ao conteúdo anterior sem alterar o processo.
- Opção desligada no meio da sessão (se a configuração puder mudar): comportamento coerente na próxima carga relevante do contexto — sem painel “fantasma”.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A extensão MUST oferecer a capacidade de usuário **Informações adicionais na árvore do processo**, controlada pela chave de configuração já existente dessa capacidade, com descrição orientada ao usuário (sem falar de arquivo ou implementação).
- **FR-002**: Com a capacidade ligada, o sistema MUST exibir junto à árvore do processo um painel com as informações auxiliares já disponíveis hoje nessa capacidade (incluindo, no mínimo: atribuição, marcador, especificação, tipo de procedimento, nível de acesso, interessados, assuntos e observações), preservando o valor de produto atual.
- **FR-003**: Com a capacidade desligada, o sistema MUST NOT apresentar o painel de informações adicionais.
- **FR-004**: O usuário MUST poder personalizar quais seções do painel são exibidas, e a escolha MUST ser respeitada nas cargas seguintes da árvore.
- **FR-005**: Cada seção MUST degradar de forma isolada quando o dado ou a ação correspondente não estiver disponível, sem impedir as demais seções.
- **FR-006**: Onde a capacidade já permite edição ou ação inline, o sistema MUST preservar esses fluxos com estados de carregamento, sucesso, cancelamento e falha compreensíveis.
- **FR-007**: A migração MUST preservar o comportamento observável atual da capacidade; não há correção de defeito de produto neste escopo além do necessário para isolar e reestruturar na arquitetura moderna.
- **FR-008**: A capacidade MUST ser entregue isolada no código novo da arquitetura moderna: instalada de forma exclusiva no contexto adequado, sem caminho legado paralelo para o mesmo comportamento e sem acoplamento a código que não seja capacidade moderna exclusive ou infraestrutura moderna permitida pelas regras do projeto.
- **FR-009**: Markup e estilos desta capacidade MUST ficar isolados no código novo da capacidade; estilos legados compartilhados NÃO MUST permanecer como fonte de verdade visual desta capacidade após a entrega.
- **FR-010**: Ao montar ou atualizar a interface do painel, o sistema MUST preferir elementos HTML nativos e padrões de DOM adequados à tarefa (botões, listas, labels, foco/teclado, formulários nativos quando couber), sem handlers inline novos e sem markup genérico improvisado quando o elemento nativo basta.
- **FR-011**: Dados obtidos do SEI (DOM, formulários, respostas) MUST ser tratados como entrada não confiável na fronteira da capacidade; conteúdo exibido ao usuário MUST NOT ser montado por concatenação insegura de HTML derivado do SEI.
- **FR-012**: Falha desta capacidade MUST NOT derrubar o restante do contexto da árvore ou da extensão.
- **FR-013**: A entrega MUST permanecer verificável: testes automatizados cobrem regras puras e contratos relevantes da capacidade; smoke manual no SEI real é portão quando a fatia toca a UI do painel.

### Key Entities

- **Capacidade Informações na Árvore**: Unidade de produto ligada à opção de configuração correspondente; agrupa painel, seções e ações inline dessa opção.
- **Painel de Informações**: Superfície junto à árvore que apresenta seções configuráveis sobre o processo atual.
- **Seção do Painel**: Bloco nomeado (ex.: atribuição, marcador, interessados) com estado próprio (carregando, pronto, vazio, indisponível, falha) e, quando aplicável, modo de edição.
- **Preferência de Seções Visíveis**: Escolha do usuário sobre quais seções mostrar; aplicada na montagem do painel.
- **Processo em Visualização**: Contexto do SEI cuja árvore está aberta; fonte dos dados exibidos/editados no painel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação com a opção ligada, 100% dos processos de amostra com dados preenchidos exibem o painel junto à árvore com as seções habilitadas preenchidas ou com estado vazio/indisponível explícito (nunca painel ausente sem motivo).
- **SC-002**: Com a opção desligada, 100% das aberturas de árvore na amostra não mostram o painel.
- **SC-003**: Após personalizar seções, na recarga seguinte da árvore 100% das seções não selecionadas permanecem ocultas e 100% das selecionadas aparecem (ou degradam com estado explícito).
- **SC-004**: Em fluxos inline já existentes hoje (amostra das ações suportadas), o usuário conclui consulta ou atualização sem regressão de resultado de negócio em relação ao comportamento atual.
- **SC-005**: Em revisão de entrega, 0 caminhos legados paralelos ou acoplamentos proibidos permanecem para esta capacidade; a capacidade conta como migrada de verdade (instalação exclusiva + isolamento de markup/estilos + conformidade com as regras de código novo do projeto).
- **SC-006**: Em inspeção da UI entregue, 100% dos controles interativos novos/alterados do painel usam elemento nativo adequado (ou primitivo moderno compartilhado), sem handlers inline novos.
- **SC-007**: Em falha induzida de uma seção (dado/ação indisponível), as demais seções do painel e o restante da árvore continuam utilizáveis em 100% dos casos de teste de isolamento.
- **SC-008**: Smoke manual no SEI real (versões cobertas pelo projeto) confirma painel utilizável em no máximo uma sessão de verificação planejada por fatia que toque UI, sem bloqueio silencioso permanente da montagem.

## Assumptions

- O comportamento funcional atual do painel (ligado à opção **Informações adicionais na árvore do processo**) é a referência de aceitação: a migração não amplia nem reduz propositalmente o conjunto de seções/ações já oferecidas por essa opção.
- A capacidade alvo de produto desta especificação é a documentada em `INFOARVORE.md` / chave de configuração dessa opção — não a inserção de dados do processo no editor (`DADOSPROCESSO.md`) nem outras opções da árvore (redimensionar, numerar documentos, dividir linhas, etc.).
- A seção de anotação que hoje aparece no mesmo painel quando esta opção está ativa faz parte do comportamento observável a preservar nesta migração; se o produto quiser tratar anotação na árvore como capacidade/configuração independente de ponta a ponta, isso deve ser uma especificação separada.
- Melhorias de HTML/DOM são no sentido de robustez, acessibilidade e alinhamento à arquitetura moderna, sem redesign visual amplo nem novos requisitos de negócio.
- Regras transversais de código novo sem legado do projeto aplicam-se a esta entrega.
- Smoke no SEI real usa o navegador integrado quando necessário para inspecionar DOM; artefatos de página do SEI não são versionados.

## Out of Scope

- Correção de bugs de produto relatados como falhas atuais do painel (o painel está considerado funcional).
- Migração da capacidade de **inserir dados do processo no editor** e campos dinâmicos (`DADOSPROCESSO.md`).
- Migração isolada de outras opções da árvore (redimensionar, numerar, duas linhas, menus rápidos, etc.), salvo o estritamente necessário como fecho de dependência para esta capacidade.
- Redesign visual completo do painel ou novas seções de informação além das já existentes.
- Mudança da chave de configuração ou do rótulo de produto da opção, salvo se indispensável para cumprir o schema único já adotado.
