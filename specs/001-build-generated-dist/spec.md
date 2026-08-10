# Feature Specification: Pasta `dist` Gerada pelo Build

**Feature Branch**: `001-build-generated-dist`

**Created**: 2026-08-10

**Status**: Implemented

**Input**: User description: "toda a pasta dist tem que ser gerada pelo build"

## Clarifications

### Session 2026-08-10

- Q: After a successful official build, must `dist` contain only files produced by that build (no leftovers from earlier runs), or is it enough that every required output exists even if extra old files remain? → A: Clean build — `dist` contains only files produced by that build (no stale leftovers)
- Q: For two successful official builds from the same committed sources, what must match between the resulting `dist` trees? → A: Bit-identical — `dist` trees must match byte-for-byte across clean builds from the same commit
- Q: Given this invariant is already largely in place, what should this feature’s delivery scope be? → A: Full rediscovery — re-specify and rebuild the dist pipeline as if greenfield
- Q: Should producing a packaged distribution artifact (for example a zip or CI release built from `dist`) be in scope for this feature, or only the reproducible `dist` folder itself? → A: `dist` only — rebuild generation + verification; packaging remains out of delivery scope (constraint only if/when packaging exists)
- Q: During the greenfield rebuild of the `dist` pipeline, must the extension stay loadable after every delivery slice, or is a temporary break until final cutover acceptable? → A: Incremental — after every delivery slice, official build produces a loadable `dist`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clone limpo produz extensão completa (Priority: P1)

Um contribuinte clona o repositório sem nenhum artefato local de saída, executa a instalação de dependências e o comando de build oficial, e obtém uma pasta `dist` completa e utilizável para carregar a extensão no navegador.

**Why this priority**: Sem isso, a extensão não pode ser instalada a partir do código-fonte e qualquer arquivo que existisse só em `dist` é perdido ao limpar a pasta — falha estrutural já observada no projeto.

**Independent Test**: Em um clone (ou árvore) sem `dist`, rodar o build oficial e carregar a pasta gerada como extensão unpacked; a extensão inicia e os recursos exigidos pelo manifesto estão presentes.

**Acceptance Scenarios**:

1. **Given** um clone limpo sem pasta `dist`, **When** o contribuinte executa o build oficial, **Then** a pasta `dist` é criada com todos os arquivos necessários para carregar a extensão.
2. **Given** a pasta `dist` foi apagada por completo, **When** o build oficial é executado novamente, **Then** a pasta é recriada integralmente a partir de fontes versionadas (nada essencial fica irrecuperável).
3. **Given** um clone limpo, **When** o contribuinte tenta carregar a extensão sem ter rodado o build, **Then** não há expectativa de pasta `dist` pronta no repositório — o onboarding documenta build como passo obrigatório.
4. **Given** uma `dist` anterior com arquivos órfãos (saídas de fontes já removidas), **When** o build oficial conclui com sucesso, **Then** esses órfãos não permanecem — a árvore resultante contém somente arquivos produzidos por aquele build.
5. **Given** o mesmo commit e duas execuções limpas do build oficial, **When** se comparam as pastas `dist` geradas, **Then** elas são idênticas byte a byte.

---

### User Story 2 - Nenhum arquivo de `dist` é fonte editável (Priority: P1)

Quem mantém o projeto nunca edita nem versiona arquivos dentro de `dist`. Qualquer mudança de comportamento, estilo, ícone, biblioteca ou manifesto parte de fonte versionada fora de `dist` e só aparece em `dist` após o build.

**Why this priority**: Editar `dist` como fonte impede reprodução, polui revisões e mascara a ausência de origem real dos assets.

**Independent Test**: Verificar que o controle de versão não rastreia caminhos sob `dist/` e que a orientação oficial proíbe edição manual dessa pasta.

**Acceptance Scenarios**:

1. **Given** o repositório na linha principal, **When** se lista arquivos versionados sob `dist/`, **Then** a lista está vazia.
2. **Given** um asset ou script novo necessário na extensão empacotada, **When** ele é adicionado ao projeto, **Then** a origem fica em área de fonte versionada e o build passa a produzi-lo em `dist` — nunca o contrário.
3. **Given** uma revisão de código, **When** a mudança afeta só o resultado empacotado, **Then** o diff mostra a alteração na fonte (e, se aplicável, no mapeamento fonte→saída), não centenas de artefatos gerados.

---

### User Story 3 - CI e contribuinte detectam regressão de reprodução (Priority: P2)

O portão de qualidade falha se o build deixar de produzir algum arquivo exigido, se surgir arquivo em `dist` sem origem declarada, ou se alguém tentar versionar `dist` de novo.

**Why this priority**: A regra só permanece verdadeira se for verificável de forma contínua; sem portão, o estado correto regride sem aviso.

**Independent Test**: Introduzir deliberadamente (em ambiente de teste) um asset só em `dist`, ou omitir uma saída do build, e observar que a verificação automatizada falha; remover o desvio e observar que passa.

**Acceptance Scenarios**:

1. **Given** o pipeline de verificação do projeto, **When** um arquivo exigido pelo manifesto não existe em `dist` após o build, **Then** a verificação falha com sinal claro.
2. **Given** um arquivo presente em `dist` que o build não declara como saída, **When** a auditoria de fontes roda, **Then** o arquivo é reportado como sem fonte e a verificação falha (ou equivalente acordado no portão).
3. **Given** tentativa de versionar caminhos sob `dist/`, **When** o teste de ausência de `dist` no controle de versão roda, **Then** a verificação falha.
4. **Given** arquivos remanescentes de um build anterior que o build atual não produz mais, **When** o portão de verificação roda após o build oficial, **Then** a verificação falha até que `dist` contenha apenas saídas do build atual.
5. **Given** duas builds oficiais limpas do mesmo commit com `dist` divergentes byte a byte, **When** a verificação de reprodutibilidade roda, **Then** ela falha.

---

### Edge Cases

- O que acontece se alguém apagar `dist` no meio do desenvolvimento? O build oficial deve recriá-la por completo; nenhum asset crítico pode existir só ali.
- O que acontece se fontes forem removidas mas a pasta `dist` antiga permanecer? O build oficial MUST eliminar ou substituir a árvore de modo que, ao concluir, não restem arquivos que aquele build não produziu.
- Como tratar recursos opcionais referenciados pelo manifesto (ex.: config local)? Podem permanecer ausentes por design, desde que estejam documentados como opcionais com motivo, e não contem como “órfãos sem fonte”.
- O que acontece se uma biblioteca em `vendor/` não tiver versão conhecida? Continua versionada com marcação explícita de origem desconhecida; não se inventa versão só para “fechar” o inventário.
- Empacotamento para distribuição (`dist.zip` ou release): fora do escopo de entrega desta feature; se/quando existir, MUST partir da mesma pasta `dist` gerada pelo build, nunca de cópia manual divergente.
- Ferramentas de watch/dev: podem regenerar partes de `dist` durante a sessão; ao final de um build oficial completo, a árvore MUST ser limpa no sentido de conter somente saídas daquele build (igual expectativa do portão de verificação).
- Duas builds oficiais limpas a partir do mesmo commit MUST produzir árvores `dist` idênticas byte a byte; qualquer divergência (timestamp embutido, caminho absoluto, ordem não determinística) é defeito a eliminar, não exceção a documentar.
- Durante a redescoberta greenfield, uma fatia que deixe o build oficial sem produzir `dist` carregável é rejeitada — não há fase intermediária “quebrada de propósito”.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toda a pasta `dist` MUST ser produzida exclusivamente pelo build oficial a partir de fontes versionadas do repositório.
- **FR-002**: O repositório MUST NOT versionar nenhum arquivo sob `dist/`.
- **FR-003**: Após execução do build oficial em árvore com apenas arquivos versionados e dependências instaladas, a pasta `dist` resultante MUST conter todos os arquivos necessários para carregar a extensão conforme o manifesto gerado.
- **FR-004**: Todo arquivo presente em `dist` após o build oficial MUST ter origem rastreável em área de fonte versionada (código-fonte do produto, vendor com registro de origem, ou assets estáticos versionados), via mapeamento explícito fonte→saída ou regra de geração documentada do build.
- **FR-004a**: Ao concluir com sucesso, o build oficial MUST deixar `dist` contendo somente arquivos produzidos por aquela execução — sem resíduos de builds anteriores, fontes removidas ou cópias manuais.
- **FR-004b**: Duas execuções limpas do build oficial a partir do mesmo conjunto de fontes versionadas (mesmo commit) MUST produzir pastas `dist` idênticas byte a byte.
- **FR-005**: É proibido adicionar, editar ou corrigir comportamento editando arquivos diretamente em `dist`; correções MUST ocorrer na fonte e serem regeneradas.
- **FR-006**: O onboarding e a documentação operacional MUST indicar que clonar o repositório não traz `dist` pronta e que o build é passo obrigatório antes de carregar a extensão.
- **FR-007**: A verificação automatizada do projeto MUST falhar se: (a) `dist` voltar a ser versionada; (b) faltar arquivo exigido pelo manifesto após o build; (c) existir em `dist` qualquer arquivo que o build oficial atual não produziu (exceto opcionais documentados ausentes por design); (d) duas builds limpas do mesmo commit não forem idênticas byte a byte.
- **FR-008**: Se existir empacotamento (zip/release), o artefato MUST ser derivado da `dist` gerada pelo build oficial, nunca de conteúdo paralelo mantido à mão. A construção de um novo pipeline de empacotamento/release **não** faz parte da entrega desta feature.
- **FR-009**: O trabalho de entrega MUST tratar o pipeline de geração de `dist` como redescoberta greenfield — reespecificar e reconstruir até satisfazer FR-001–FR-008 e os critérios de sucesso — sem aceitar “já implementado no legado” como critério de pronto.
- **FR-010**: Cada fatia de entrega MUST terminar com o build oficial produzindo uma `dist` carregável como extensão unpacked; janela quebrada até um cutover final é proibida.

### Key Entities

- **Fonte versionada**: qualquer arquivo sob controle de versão que o build consome (código do produto, bibliotecas de terceiros com registro de origem, assets estáticos).
- **Saída de build (`dist`)**: árvore completa da extensão pronta para carregar/empacotar; efêmera e regenerável.
- **Mapeamento fonte→saída**: registro canônico de quais fontes produzem quais caminhos em `dist`.
- **Recurso opcional documentado**: caminho referenciado que pode ausentar-se por design, com motivo explícito, sem contar como falha de reprodução.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos clones limpos testados, um único ciclo “instalar dependências + build oficial” produz `dist` carregável como extensão unpacked sem copiar arquivos manuais.
- **SC-002**: Após o build oficial (inclusive partindo de uma `dist` suja com arquivos órfãos), a árvore resultante contém 0 arquivos sem origem no mapeamento/regras do build e 0 resíduos que aquele build não produziu (auditoria de “sem fonte” / sobras = 0).
- **SC-002a**: Em 100% das comparações entre duas builds oficiais limpas do mesmo commit, a diferença entre as árvores `dist` é vazia (identidade byte a byte).
- **SC-003**: Na linha principal do repositório, zero caminhos sob `dist/` estão sob controle de versão.
- **SC-004**: Em 100% dos casos de teste de regressão, o portão de verificação automatizada falha quando se introduz um arquivo em `dist` sem origem ou se omite uma saída exigida pelo manifesto.
- **SC-005**: Revisões de mudança de asset/comportamento empacotado não incluem diffs sob `dist/` — o revisor vê apenas fonte e, se necessário, mapeamento.
- **SC-006**: Um contribuinte novo consegue, seguindo só a documentação oficial, obter `dist` utilizável na primeira tentativa em menos de 15 minutos em máquina com o runtime suportado (excluindo tempo de download de dependências em rede lenta).
- **SC-007**: O plano de entrega e a definição de pronto desta feature consideram o pipeline de `dist` reconstruído e validado contra a especificação completa; conformidade parcial herdada do estado anterior não conta como conclusão.
- **SC-008**: Em 100% das fatias de entrega mescláveis, o build oficial ao final da fatia produz `dist` carregável (extensão unpacked inicia); zero fatias encerram com `dist` inutilizável de propósito.

## Assumptions

- O escopo de entrega desta feature é **redescoberta completa (greenfield)**: o pipeline que produz `dist` é reespecificado e reconstruído do zero contra esta especificação, sem tratar o arranjo atual como baseline a preservar. Artefatos e decisões anteriores (incluindo ADR-0011 e scripts existentes) podem informar o desenho, mas não limitam nem “fecham” o trabalho por já estarem parcialmente implementados.
- A redescoberta MUST ser entregue em fatias incrementais: cada fatia termina com `dist` carregável (FR-010), alinhada à regra de migração honesta do projeto — greenfield de desenho, não big-bang de indisponibilidade.
- A entrega desta feature cobre geração + verificação da pasta `dist` (árvore limpa, bit-idêntica, não versionada). Empacotamento zip/release fica fora do escopo de entrega; FR-008 vale apenas como restrição se/quando o empacotamento existir.
- A invariante de negócio permanece alinhada à constituição (Princípio IV): `dist` fora do versionamento, gerada só pelo build, limpa ao concluir e reproduzível byte a byte a partir do mesmo commit.
- O público principal desta feature são contribuidores, revisores e o pipeline de qualidade — não o usuário final do SEI; o valor de produto é extensão instalável e evolutiva sem perda silenciosa de assets.
- Fatiamento futuro de CSS monolítico e preenchimento de versões `desconhecida` em vendor são trabalhos relacionados de migração/licenciamento, não bloqueadores desta invariante, desde que a origem do arquivo continue versionada e copiada pelo build.
- Instalação direta da extensão a partir do clone sem Node permanece fora de escopo; distribuição sem build local, se necessária, será via artefato de release gerado pelo CI (trabalho futuro), não via `dist` versionada.
- Recursos opcionais com allowlist motivada são aceitos e não violam FR-004/FR-007.
- Para FR-003, o proxy aceito de “árvore com apenas arquivos versionados” é um checkout normal + `rm -rf dist` (e dependências instaladas); clone literal em diretório vazio não é exigido em todo teste local.
- Empacotamento existente (`scripts/package-extension.sh`), se usado, MUST consumir a `dist` do build oficial (FR-008); reconstruir pipeline de release continua fora do escopo de entrega.
- Identidade byte a byte (FR-004b / SC-002a) pode fechar após o MVP de árvore limpa e carregável (FR-004a), desde que entre na mesma feature antes do Status `Implemented`.
