# Mapa de capacidades (inventário + gaps)

Insumo canônico de produto (ADR-0007 / constituição): este arquivo é o **home** do
inventário de capacidades de usuário e do registro priorizado de gaps (P1–P4).
**Não substitui** a documentação de usuário em `pages/`.

Fontes de evidência: `pages/`, `docs/mapping-funcoes-configuracoes/`, schema de
configuração e descritores `src/features/*/feature.ts`.

Spec Kit: `specs/003-capability-inventory-gaps/`. Capacidades novas com gaps **P1**
abertos exigem portão suave — ver [soft-gate](../specs/003-capability-inventory-gaps/contracts/soft-gate-new-capability.md).

Para abrir um Spec Kit de consolidação: escolha um `gap.id` aberto abaixo como ponto
de partida (nome/fronteira vêm da entrada de inventário relacionada).

Âncoras YAML abaixo (payload JSON-compatible) são a fonte para gates C0–C10
(prosa das tabelas Inventory / Residuals / Gap register deve bater 1:1 com as âncoras).

---

## Inventory

Capacidades no vocabulário do usuário (uma linha por capacidade). Detalhe completo nas âncoras.

| id | Nome | Maturidade | Toggle | pages/ |
| --- | --- | --- | --- | --- |
| `acoes-capa` | Ações na capa e documentos | wired | null_justified | `ACOESEMLOTE.md`, `CERTIDAOSIGILO.md`, `DOCUMENTOSEMLOTE.md` (+4) |
| `ai` | Ferramentas de IA | declared | null_justified | `FERRAMENTASIA.md` |
| `anotacao-controle` | Anotações no controle | exclusive | own (`mostraranotacaocontrole`) | `NOTAARVORE.md`, `NOTARODAPE.md` |
| `arvore` | Árvore do processo | exclusive | null_justified | `RESIZEARVORE.md`, `DIVIDIRLINHASARVORE.md`, `NUMERARDOCSARVORE.md` (+2) |
| `arvore-info` | Informações na árvore | exclusive | own (`infoarvore`) | `INFOARVORE.md`, `DADOSPROCESSO.md` |
| `atividades-afastamentos` | Afastamentos | wired | null_justified | _undocumented_ |
| `atividades-avaliacoes` | Avaliações de atividades | wired | null_justified | _undocumented_ |
| `atividades-config` | Administração de configuração de atividades | wired | shared (`gerenciaratividades`) | _undocumented_ |
| `atividades-registro` | Registro diário de atividades | wired | null_justified | _undocumented_ |
| `chrome-ui` | Ajustes de interface do SEI | wired | own (`menususpenso`) | `TITULOPAGINA.md`, `VALDEFAULT.md`, `SIGILODOC.md` (+3) |
| `controlar-prazos` | Gerenciar prazos | exclusive | own (`gerenciarprazos`) | `PRAZOS.md` |
| `cores-marcadores` | Cores de marcadores | wired | own (`coresmarcadores`) | `CORESMARCADORES.md` |
| `dialogs-host` | Formulários e diálogos auxiliares | wired | null_justified | `BASEDADOS.md` |
| `docs-lote` | Documentos e ações em lote | exclusive | own (`acoesemlote`) | `ACOESEMLOTE.md`, `DOCUMENTOSEMLOTE.md`, `COMPARARDOCUMENTOS.md` |
| `editor` | Editor de documentos | exclusive | null_justified | `ESTILOAVANCADO.md`, `TABELARAPIDA.md`, `COPIARFORMATACAO.md` (+1) |
| `editor-captcha` | Atalhos e produtividade no editor | wired | null_justified | `TECLASATALHO.md`, `SALVAMENTOAUTOMATICO.md`, `DITADO.md` (+3) |
| `external-config` | Configuração externa / desativar funções | exclusive | null_justified | `DESATIVARFUNCOES.md` |
| `historico-processos` | Histórico de processos | wired | own (`historicoproc`) | `HISTORICOPROC.md`, `HISTORICO.md` |
| `interessados-forms` | Formulários de interessados | wired | null_justified | _undocumented_ |
| `legis` | Estilo e links de legística | declared | null_justified | `LEGISTICA.md`, `LINKLEGIS.md` |
| `lista-agrupamento` | Agrupar lista de processos | exclusive | own (`agruparlista`) | `AGRUPAR.md` |
| `lista-processos` | Lista de processos | exclusive | null_justified | `LISTAPROCESSOS.md`, `REMOVEPAGINACAO.md`, `REMOVERPAGINACAO.md` (+4) |
| `login` | Preencher login automaticamente | exclusive | own (`autopreenchersenha`) | `AUTOPREENCHERSENHA.md` |
| `menus-rapidos` | Menus rápidos | wired | own (`menurapido`) | `MENURAPIDO.md`, `MENUSUSPENSO.md` |
| `midia-documentos` | Mídia em documentos | wired | own (`editarimagens`) | `EDITARIMAGENS.md`, `QUALIDADEIMAGENS.md`, `PLAYVIDEO.md` (+2) |
| `monitorados` | Processos monitorados / favoritos | exclusive | own (`gerenciarmonitorados`) | `FAVORITOS.md` |
| `nao-lido` | Marcar processo como não lido | exclusive | own (`marcar_naolido`) | `NAOLIDO.md` |
| `notificacoes-processo` | Notificações de processo | wired | shared (`notificacaonovoprocesso`) | `LISTAPROCESSOS.md` |
| `prescricoes` | Gerenciar prescrições | declared | shared (`gerenciarprescricoes`) | _undocumented_ |
| `projetos` | Projetos | declared | own (`gerenciarprojetos`) | `PROJETOS.md`, `PROJETOSEDIT.md`, `PROJETOSIMPORT.md` (+1) |
| `quick-filter` | Filtro rápido na lista | declared | shared (`filtrarpaginapelapesquisarapida`) | `LISTAPROCESSOS.md` |
| `quick-highlight` | Destaque rápido na lista | exclusive | shared (`filtrarpaginapelapesquisarapida`) | `LISTAPROCESSOS.md` |
| `tabelas-arquivos` | Tabelas e ordenação | wired | own (`ordernartabela`) | `ORDENARTABELA.md`, `ESTILOTABELA.md` |
| `todas-paginas` | Comportamentos em todas as páginas | declared | null_justified | _undocumented_ |
| `url-amigavel` | URLs e links amigáveis | wired | own (`urlamigavel`) | `URLAMIGAVEL.md`, `ABRIRLINKS.md`, `LINKPERMANENTE.md` |
| `visualizacao` | Leitura e visualização de documentos | exclusive | null_justified | `PARAGRAFOSNUMERADOS.md`, `AUMENTARFONTE.md`, `SUMARIO.md` (+13) |


### Residuals & non-capabilities

| id | kind | Nome | Condição / notas |
| --- | --- | --- | --- |
| `atividades` | residual | Atividades (núcleo residual) | Esvaziar wrappers/boot após migrar call-sites para atividades-* .api |
| `sei-runtime` | non-capability | Runtime transversal SEI (não-capacidade) | src/shared/sei-runtime — não receber comportamento novo de capacidade |


---

## Gap register

Ordenação: P1 → P4. Soft gate (capacidade **nova**) lê apenas gaps `open` + **P1**.

| P | id | tipo | Impacto |
| --- | --- | --- | --- |
| P1 | `gap-atividades-shared-key` | key_ownership | Ligar/desligar atividades não separa config, afastamentos, avaliações e registro. |
| P1 | `gap-prescricoes-schema-owner` | key_ownership | Schema aponta gerenciarprescricoes para atividades enquanto o descritor prescricoes reivindica a chave. |
| P2 | `gap-atividades-residual` | residual | Núcleo residual atividades ainda orquestra comportamento das subcapacidades. |
| P2 | `gap-strangler-shared-keys` | key_ownership | Chaves compartilhadas no strangler impedem ownership 1:1 até extração. |
| P2 | `gap-telemetry-folder` | source_inconsistency | Chave bugReportOptIn referencia feature telemetry sem pasta/descritor. |
| P2 | `gap-transitional-ownership` | residual | Clusters pós-sei-functions ainda com ownership transitório (chrome-ui, acoes-capa, editor-captcha). |
| P3 | `gap-atividades-pages` | documentation | Usuário não encontra doc dedicada para config/afastamentos/avaliações/registro de atividades. |
| P4 | `gap-orphan-pages` | documentation | Páginas de usuário sem vínculo explícito a uma capacidade (fechado enquanto C5 estiver verde). |
| P4 | `gap-null-configkey-glue` | key_ownership | Várias capacidades usam configKey null por glue multi-contexto; ownership de toggle ainda implícito. |


---

## Exceptions

Exceções executáveis espelham `scripts/lib/capability-coverage-allowlists.mjs` e ligam-se a gaps (ou justificativa). Ver âncora `exceptions`.

---

## Machine anchors

```yaml
# capabilities-map:inventory
{
  "entries": [
    {
      "id": "acoes-capa",
      "kind": "capability",
      "name": "Ações na capa e documentos",
      "summary": "Agrupa ações de capa, certidão, sigilo e documentos relacionados.",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/ACOESEMLOTE.md",
        "pages/CERTIDAOSIGILO.md",
        "pages/DOCUMENTOSEMLOTE.md",
        "pages/INSERIRDOC.md",
        "pages/DUPLICARDOC.md",
        "pages/COPIARDOC.md",
        "pages/UPLOADDOCS.md"
      ],
      "undocumented": false,
      "descriptorId": "acoes-capa",
      "notes": ""
    },
    {
      "id": "ai",
      "kind": "capability",
      "name": "Ferramentas de IA",
      "summary": "Oferece ferramentas de IA no fluxo de trabalho do usuário.",
      "maturity": "declared",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/FERRAMENTASIA.md"
      ],
      "undocumented": false,
      "descriptorId": "ai",
      "notes": ""
    },
    {
      "id": "anotacao-controle",
      "kind": "capability",
      "name": "Anotações no controle",
      "summary": "Mostra e edita anotações no controle de processos.",
      "maturity": "exclusive",
      "configKey": "mostraranotacaocontrole",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/NOTAARVORE.md",
        "pages/NOTARODAPE.md"
      ],
      "undocumented": false,
      "descriptorId": "anotacao-controle",
      "notes": ""
    },
    {
      "id": "arvore",
      "kind": "capability",
      "name": "Árvore do processo",
      "summary": "Ajusta árvore (resize, numeração, upload, ícones).",
      "maturity": "exclusive",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/RESIZEARVORE.md",
        "pages/DIVIDIRLINHASARVORE.md",
        "pages/NUMERARDOCSARVORE.md",
        "pages/UPLOADDOCS.md",
        "pages/MOVERICONE.md"
      ],
      "undocumented": false,
      "descriptorId": "arvore",
      "notes": ""
    },
    {
      "id": "arvore-info",
      "kind": "capability",
      "name": "Informações na árvore",
      "summary": "Exibe informações auxiliares junto à árvore do processo.",
      "maturity": "exclusive",
      "configKey": "infoarvore",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/INFOARVORE.md",
        "pages/DADOSPROCESSO.md"
      ],
      "undocumented": false,
      "descriptorId": "arvore-info",
      "notes": ""
    },
    {
      "id": "atividades",
      "kind": "residual",
      "name": "Atividades (núcleo residual)",
      "summary": "Núcleo residual de orquestração até o strangler esvaziar.",
      "maturity": "wired",
      "configKey": "gerenciaratividades",
      "configKeyMode": "shared",
      "sharedWith": [
        "atividades-config"
      ],
      "pages": [],
      "undocumented": true,
      "descriptorId": "atividades",
      "notes": "Esvaziar wrappers/boot após migrar call-sites para atividades-* .api"
    },
    {
      "id": "atividades-afastamentos",
      "kind": "capability",
      "name": "Afastamentos",
      "summary": "Registra e gerencia afastamentos.",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": "atividades-afastamentos",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "atividades-avaliacoes",
      "kind": "capability",
      "name": "Avaliações de atividades",
      "summary": "Avalia entregas e recursos de planos de atividades.",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": "atividades-avaliacoes",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "atividades-config",
      "kind": "capability",
      "name": "Administração de configuração de atividades",
      "summary": "Administra planos, programas, unidades e perfis de atividades.",
      "maturity": "wired",
      "configKey": "gerenciaratividades",
      "configKeyMode": "shared",
      "sharedWith": [
        "atividades"
      ],
      "pages": [],
      "undocumented": true,
      "descriptorId": "atividades-config",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "atividades-registro",
      "kind": "capability",
      "name": "Registro diário de atividades",
      "summary": "Registra o trabalho diário e formulários de atividade.",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": "atividades-registro",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "chrome-ui",
      "kind": "capability",
      "name": "Ajustes de interface do SEI",
      "summary": "Ajusta chrome da interface (título, menus, defaults de novo documento).",
      "maturity": "wired",
      "configKey": "menususpenso",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/TITULOPAGINA.md",
        "pages/VALDEFAULT.md",
        "pages/SIGILODOC.md",
        "pages/DESATIVARFUNCOES.md",
        "pages/MOVERICONE.md",
        "pages/CONTADORPROCESSOICONE.md"
      ],
      "undocumented": false,
      "descriptorId": "chrome-ui",
      "notes": ""
    },
    {
      "id": "controlar-prazos",
      "kind": "capability",
      "name": "Gerenciar prazos",
      "summary": "Permite gravar e acompanhar prazos de processos na unidade.",
      "maturity": "exclusive",
      "configKey": "gerenciarprazos",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/PRAZOS.md"
      ],
      "undocumented": false,
      "descriptorId": "controlar-prazos",
      "notes": ""
    },
    {
      "id": "cores-marcadores",
      "kind": "capability",
      "name": "Cores de marcadores",
      "summary": "Permite personalizar cores dos marcadores.",
      "maturity": "wired",
      "configKey": "coresmarcadores",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/CORESMARCADORES.md"
      ],
      "undocumented": false,
      "descriptorId": "cores-marcadores",
      "notes": ""
    },
    {
      "id": "dialogs-host",
      "kind": "capability",
      "name": "Formulários e diálogos auxiliares",
      "summary": "Hospeda formulários e diálogos auxiliares (ex.: base de dados).",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/BASEDADOS.md"
      ],
      "undocumented": false,
      "descriptorId": "dialogs-host",
      "notes": ""
    },
    {
      "id": "docs-lote",
      "kind": "capability",
      "name": "Documentos e ações em lote",
      "summary": "Executa ações e comparações sobre vários documentos de uma vez.",
      "maturity": "exclusive",
      "configKey": "acoesemlote",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/ACOESEMLOTE.md",
        "pages/DOCUMENTOSEMLOTE.md",
        "pages/COMPARARDOCUMENTOS.md"
      ],
      "undocumented": false,
      "descriptorId": "docs-lote",
      "notes": ""
    },
    {
      "id": "editor",
      "kind": "capability",
      "name": "Editor de documentos",
      "summary": "Comportamentos base do editor de documentos.",
      "maturity": "exclusive",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/ESTILOAVANCADO.md",
        "pages/TABELARAPIDA.md",
        "pages/COPIARFORMATACAO.md",
        "pages/EQUACOES.md"
      ],
      "undocumented": false,
      "descriptorId": "editor",
      "notes": ""
    },
    {
      "id": "editor-captcha",
      "kind": "capability",
      "name": "Atalhos e produtividade no editor",
      "summary": "Atalhos, ditado, salvamento e produtividade no editor (ownership transitório).",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/TECLASATALHO.md",
        "pages/SALVAMENTOAUTOMATICO.md",
        "pages/DITADO.md",
        "pages/ESCRITAINTERATIVA.md",
        "pages/SUBSTITUIRSELECAO.md",
        "pages/REVISARDOC.md"
      ],
      "undocumented": false,
      "descriptorId": "editor-captcha",
      "notes": ""
    },
    {
      "id": "external-config",
      "kind": "capability",
      "name": "Configuração externa / desativar funções",
      "summary": "Aplica configuração externa e desativação seletiva de funções.",
      "maturity": "exclusive",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/DESATIVARFUNCOES.md"
      ],
      "undocumented": false,
      "descriptorId": "external-config",
      "notes": ""
    },
    {
      "id": "historico-processos",
      "kind": "capability",
      "name": "Histórico de processos",
      "summary": "Registra e sincroniza histórico de processos visitados.",
      "maturity": "wired",
      "configKey": "historicoproc",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/HISTORICOPROC.md",
        "pages/HISTORICO.md"
      ],
      "undocumented": false,
      "descriptorId": "historico-processos",
      "notes": ""
    },
    {
      "id": "interessados-forms",
      "kind": "capability",
      "name": "Formulários de interessados",
      "summary": "Auxilia formulários de interessados.",
      "maturity": "wired",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": "interessados-forms",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "legis",
      "kind": "capability",
      "name": "Estilo e links de legística",
      "summary": "Aplica estilo e links de legística.",
      "maturity": "declared",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/LEGISTICA.md",
        "pages/LINKLEGIS.md"
      ],
      "undocumented": false,
      "descriptorId": "legis",
      "notes": ""
    },
    {
      "id": "lista-agrupamento",
      "kind": "capability",
      "name": "Agrupar lista de processos",
      "summary": "Permite agrupar a lista de processos.",
      "maturity": "exclusive",
      "configKey": "agruparlista",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/AGRUPAR.md"
      ],
      "undocumented": false,
      "descriptorId": "lista-agrupamento",
      "notes": ""
    },
    {
      "id": "lista-processos",
      "kind": "capability",
      "name": "Lista de processos",
      "summary": "Melhora a lista de processos (paginação, rolagem, filtros, nomes).",
      "maturity": "exclusive",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/LISTAPROCESSOS.md",
        "pages/REMOVEPAGINACAO.md",
        "pages/REMOVERPAGINACAO.md",
        "pages/ROLAGEMINFINITA.md",
        "pages/ESPECIFICACAOPROCESSO.md",
        "pages/NOMESUSUARIOS.md",
        "pages/CONTADORPROCESSOICONE.md"
      ],
      "undocumented": false,
      "descriptorId": "lista-processos",
      "notes": ""
    },
    {
      "id": "login",
      "kind": "capability",
      "name": "Preencher login automaticamente",
      "summary": "Preenche usuário e senha na tela de login quando autorizado.",
      "maturity": "exclusive",
      "configKey": "autopreenchersenha",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/AUTOPREENCHERSENHA.md"
      ],
      "undocumented": false,
      "descriptorId": "login",
      "notes": ""
    },
    {
      "id": "menus-rapidos",
      "kind": "capability",
      "name": "Menus rápidos",
      "summary": "Oferece menus e atalhos rápidos para ações frequentes no SEI.",
      "maturity": "wired",
      "configKey": "menurapido",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/MENURAPIDO.md",
        "pages/MENUSUSPENSO.md"
      ],
      "undocumented": false,
      "descriptorId": "menus-rapidos",
      "notes": ""
    },
    {
      "id": "midia-documentos",
      "kind": "capability",
      "name": "Mídia em documentos",
      "summary": "Melhora edição, qualidade e reprodução de mídia em documentos.",
      "maturity": "wired",
      "configKey": "editarimagens",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/EDITARIMAGENS.md",
        "pages/QUALIDADEIMAGENS.md",
        "pages/PLAYVIDEO.md",
        "pages/REDIMENSIONAIMG.md",
        "pages/DOCSNAOASSINADOS.md"
      ],
      "undocumented": false,
      "descriptorId": "midia-documentos",
      "notes": ""
    },
    {
      "id": "monitorados",
      "kind": "capability",
      "name": "Processos monitorados / favoritos",
      "summary": "Destaca e gerencia processos monitorados.",
      "maturity": "exclusive",
      "configKey": "gerenciarmonitorados",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/FAVORITOS.md"
      ],
      "undocumented": false,
      "descriptorId": "monitorados",
      "notes": ""
    },
    {
      "id": "nao-lido",
      "kind": "capability",
      "name": "Marcar processo como não lido",
      "summary": "Permite marcar processos como não lidos.",
      "maturity": "exclusive",
      "configKey": "marcar_naolido",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/NAOLIDO.md"
      ],
      "undocumented": false,
      "descriptorId": "nao-lido",
      "notes": ""
    },
    {
      "id": "notificacoes-processo",
      "kind": "capability",
      "name": "Notificações de processo",
      "summary": "Notifica sobre novos processos e seleção inteligente.",
      "maturity": "wired",
      "configKey": "notificacaonovoprocesso",
      "configKeyMode": "shared",
      "sharedWith": [
        "lista-processos"
      ],
      "pages": [
        "pages/LISTAPROCESSOS.md"
      ],
      "undocumented": false,
      "descriptorId": "notificacoes-processo",
      "notes": ""
    },
    {
      "id": "prescricoes",
      "kind": "capability",
      "name": "Gerenciar prescrições",
      "summary": "Gerencia prescrições vinculadas a atividades.",
      "maturity": "declared",
      "configKey": "gerenciarprescricoes",
      "configKeyMode": "shared",
      "sharedWith": [
        "atividades"
      ],
      "pages": [],
      "undocumented": true,
      "descriptorId": "prescricoes",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "projetos",
      "kind": "capability",
      "name": "Projetos",
      "summary": "Gerencia projetos e compartilhamento associados ao SEI Pro.",
      "maturity": "declared",
      "configKey": "gerenciarprojetos",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/PROJETOS.md",
        "pages/PROJETOSEDIT.md",
        "pages/PROJETOSIMPORT.md",
        "pages/PROJETOSSHARE.md"
      ],
      "undocumented": false,
      "descriptorId": "projetos",
      "notes": ""
    },
    {
      "id": "quick-filter",
      "kind": "capability",
      "name": "Filtro rápido na lista",
      "summary": "Filtra a página pela pesquisa rápida.",
      "maturity": "declared",
      "configKey": "filtrarpaginapelapesquisarapida",
      "configKeyMode": "shared",
      "sharedWith": [
        "lista-processos",
        "quick-highlight"
      ],
      "pages": [
        "pages/LISTAPROCESSOS.md"
      ],
      "undocumented": false,
      "descriptorId": "quick-filter",
      "notes": ""
    },
    {
      "id": "quick-highlight",
      "kind": "capability",
      "name": "Destaque rápido na lista",
      "summary": "Destaca resultados do filtro rápido.",
      "maturity": "exclusive",
      "configKey": "filtrarpaginapelapesquisarapida",
      "configKeyMode": "shared",
      "sharedWith": [
        "lista-processos",
        "quick-filter"
      ],
      "pages": [
        "pages/LISTAPROCESSOS.md"
      ],
      "undocumented": false,
      "descriptorId": "quick-highlight",
      "notes": ""
    },
    {
      "id": "tabelas-arquivos",
      "kind": "capability",
      "name": "Tabelas e ordenação",
      "summary": "Ordena e estiliza tabelas de arquivos/processos.",
      "maturity": "wired",
      "configKey": "ordernartabela",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/ORDENARTABELA.md",
        "pages/ESTILOTABELA.md"
      ],
      "undocumented": false,
      "descriptorId": "tabelas-arquivos",
      "notes": ""
    },
    {
      "id": "todas-paginas",
      "kind": "capability",
      "name": "Comportamentos em todas as páginas",
      "summary": "Comportamentos transversais instalados em todas as páginas.",
      "maturity": "declared",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": "todas-paginas",
      "notes": "Sem página dedicada em pages/; gap de documentação"
    },
    {
      "id": "url-amigavel",
      "kind": "capability",
      "name": "URLs e links amigáveis",
      "summary": "Torna links e URLs mais legíveis e editáveis.",
      "maturity": "wired",
      "configKey": "urlamigavel",
      "configKeyMode": "own",
      "sharedWith": [],
      "pages": [
        "pages/URLAMIGAVEL.md",
        "pages/ABRIRLINKS.md",
        "pages/LINKPERMANENTE.md"
      ],
      "undocumented": false,
      "descriptorId": "url-amigavel",
      "notes": ""
    },
    {
      "id": "visualizacao",
      "kind": "capability",
      "name": "Leitura e visualização de documentos",
      "summary": "Melhora leitura, sumário, tipografia e utilitários na visualização.",
      "maturity": "exclusive",
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [
        "pages/PARAGRAFOSNUMERADOS.md",
        "pages/AUMENTARFONTE.md",
        "pages/SUMARIO.md",
        "pages/QUEBRAPAGINA.md",
        "pages/HASHCODE.md",
        "pages/DOCPUBLICO.md",
        "pages/QRCODE.md",
        "pages/MARCAMINUTA.md",
        "pages/REFDOCUMENTOS.md",
        "pages/REFERENCIAINTERNA.md",
        "pages/ESTILOAVANCADO.md",
        "pages/ALINHARTEXTO.md",
        "pages/LETRAMAIUSC.md",
        "pages/COPIARFORMATACAO.md",
        "pages/EQUACOES.md",
        "pages/SEISHEETS.md"
      ],
      "undocumented": false,
      "descriptorId": "visualizacao",
      "notes": ""
    },
    {
      "id": "sei-runtime",
      "kind": "non-capability",
      "name": "Runtime transversal SEI (não-capacidade)",
      "summary": "Infra compartilhada instalada pela raiz; não é capacidade ligável pelo usuário.",
      "maturity": null,
      "configKey": null,
      "configKeyMode": "null_justified",
      "sharedWith": [],
      "pages": [],
      "undocumented": true,
      "descriptorId": null,
      "notes": "src/shared/sei-runtime — não receber comportamento novo de capacidade"
    }
  ]
}
```


```yaml
# capabilities-map:gaps
{
  "gaps": [
    {
      "id": "gap-atividades-pages",
      "type": "documentation",
      "priority": "P3",
      "impact": "Usuário não encontra doc dedicada para config/afastamentos/avaliações/registro de atividades.",
      "evidence": [
        "atividades-config",
        "atividades-afastamentos",
        "atividades-avaliacoes",
        "atividades-registro"
      ],
      "relatedCapabilityIds": [
        "atividades-config",
        "atividades-afastamentos",
        "atividades-avaliacoes",
        "atividades-registro"
      ],
      "suggestedNextSpec": "atividades-user-docs",
      "status": "open"
    },
    {
      "id": "gap-atividades-shared-key",
      "type": "key_ownership",
      "priority": "P1",
      "impact": "Ligar/desligar atividades não separa config, afastamentos, avaliações e registro.",
      "evidence": [
        "gerenciaratividades",
        "configKey null on splits"
      ],
      "relatedCapabilityIds": [
        "atividades",
        "atividades-config",
        "atividades-afastamentos",
        "atividades-avaliacoes",
        "atividades-registro"
      ],
      "suggestedNextSpec": "atividades-config-keys",
      "status": "open"
    },
    {
      "id": "gap-prescricoes-schema-owner",
      "type": "key_ownership",
      "priority": "P1",
      "impact": "Schema aponta gerenciarprescricoes para atividades enquanto o descritor prescricoes reivindica a chave.",
      "evidence": [
        "gerenciarprescricoes",
        "schema feature atividades",
        "descriptor prescricoes"
      ],
      "relatedCapabilityIds": [
        "atividades",
        "prescricoes"
      ],
      "suggestedNextSpec": "prescricoes-schema-align",
      "status": "open"
    },
    {
      "id": "gap-telemetry-folder",
      "type": "source_inconsistency",
      "priority": "P2",
      "impact": "Chave bugReportOptIn referencia feature telemetry sem pasta/descritor.",
      "evidence": [
        "bugReportOptIn",
        "telemetry"
      ],
      "relatedCapabilityIds": [],
      "suggestedNextSpec": "telemetry-feature",
      "status": "open"
    },
    {
      "id": "gap-transitional-ownership",
      "type": "residual",
      "priority": "P2",
      "impact": "Clusters pós-sei-functions ainda com ownership transitório (chrome-ui, acoes-capa, editor-captcha).",
      "evidence": [
        "chrome-ui",
        "acoes-capa",
        "editor-captcha"
      ],
      "relatedCapabilityIds": [
        "chrome-ui",
        "acoes-capa",
        "editor-captcha"
      ],
      "suggestedNextSpec": "split-transitional-owners",
      "status": "open"
    },
    {
      "id": "gap-strangler-shared-keys",
      "type": "key_ownership",
      "priority": "P2",
      "impact": "Chaves compartilhadas no strangler impedem ownership 1:1 até extração.",
      "evidence": [
        "gerenciaratividades",
        "gerenciarprescricoes",
        "filtrarpaginapelapesquisarapida",
        "notificacaonovoprocesso"
      ],
      "relatedCapabilityIds": [
        "atividades",
        "atividades-config",
        "prescricoes",
        "lista-processos",
        "quick-filter",
        "quick-highlight",
        "notificacoes-processo"
      ],
      "suggestedNextSpec": "unshare-config-keys",
      "status": "open"
    },
    {
      "id": "gap-atividades-residual",
      "type": "residual",
      "priority": "P2",
      "impact": "Núcleo residual atividades ainda orquestra comportamento das subcapacidades.",
      "evidence": [
        "src/features/atividades"
      ],
      "relatedCapabilityIds": [
        "atividades"
      ],
      "suggestedNextSpec": "esvaziar-atividades-residual",
      "status": "open"
    },
    {
      "id": "gap-orphan-pages",
      "type": "documentation",
      "priority": "P4",
      "impact": "Páginas de usuário ainda sem vínculo explícito a uma capacidade no inventário.",
      "evidence": [],
      "relatedCapabilityIds": [],
      "suggestedNextSpec": null,
      "status": "closed"
    },
    {
      "id": "gap-null-configkey-glue",
      "type": "key_ownership",
      "priority": "P4",
      "impact": "Várias capacidades usam configKey null por glue multi-contexto; ownership de toggle ainda implícito.",
      "evidence": [
        "ai",
        "arvore",
        "editor",
        "external-config",
        "legis",
        "lista-processos",
        "acoes-capa",
        "dialogs-host",
        "editor-captcha",
        "interessados-forms",
        "todas-paginas",
        "visualizacao"
      ],
      "relatedCapabilityIds": [
        "ai",
        "arvore",
        "editor",
        "external-config",
        "legis",
        "lista-processos",
        "acoes-capa",
        "dialogs-host",
        "editor-captcha",
        "interessados-forms",
        "todas-paginas",
        "visualizacao"
      ],
      "suggestedNextSpec": null,
      "status": "open"
    }
  ]
}
```


```yaml
# capabilities-map:exceptions
{
  "exceptions": [
    {
      "kind": "schema_feature_without_descriptor",
      "keyOrFeatureId": "telemetry",
      "owners": [],
      "gapId": "gap-telemetry-folder",
      "justification": "bugReportOptIn ainda sem feature foldered"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "acoes-capa",
      "owners": [
        "acoes-capa"
      ],
      "gapId": "gap-transitional-ownership",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "ai",
      "owners": [
        "ai"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "arvore",
      "owners": [
        "arvore"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "atividades-afastamentos",
      "owners": [
        "atividades-afastamentos"
      ],
      "gapId": "gap-atividades-shared-key",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "atividades-avaliacoes",
      "owners": [
        "atividades-avaliacoes"
      ],
      "gapId": "gap-atividades-shared-key",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "atividades-registro",
      "owners": [
        "atividades-registro"
      ],
      "gapId": "gap-atividades-shared-key",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "dialogs-host",
      "owners": [
        "dialogs-host"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "editor",
      "owners": [
        "editor"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "editor-captcha",
      "owners": [
        "editor-captcha"
      ],
      "gapId": "gap-transitional-ownership",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "external-config",
      "owners": [
        "external-config"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "interessados-forms",
      "owners": [
        "interessados-forms"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "legis",
      "owners": [
        "legis"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "lista-processos",
      "owners": [
        "lista-processos"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "todas-paginas",
      "owners": [
        "todas-paginas"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "null_config_key",
      "keyOrFeatureId": "visualizacao",
      "owners": [
        "visualizacao"
      ],
      "gapId": "gap-null-configkey-glue",
      "justification": "configKey null allowlisted during strangler / multi-context glue"
    },
    {
      "kind": "shared_config_key",
      "keyOrFeatureId": "gerenciaratividades",
      "owners": [
        "atividades",
        "atividades-config"
      ],
      "gapId": "gap-strangler-shared-keys",
      "justification": "shared during strangler; see CONFIG_KEY_FEATURE_OWNER_OVERRIDES"
    },
    {
      "kind": "shared_config_key",
      "keyOrFeatureId": "gerenciarprescricoes",
      "owners": [
        "atividades",
        "prescricoes"
      ],
      "gapId": "gap-prescricoes-schema-owner",
      "justification": "shared during strangler; see CONFIG_KEY_FEATURE_OWNER_OVERRIDES"
    },
    {
      "kind": "shared_config_key",
      "keyOrFeatureId": "filtrarpaginapelapesquisarapida",
      "owners": [
        "lista-processos",
        "quick-filter",
        "quick-highlight"
      ],
      "gapId": "gap-strangler-shared-keys",
      "justification": "shared during strangler; see CONFIG_KEY_FEATURE_OWNER_OVERRIDES"
    },
    {
      "kind": "shared_config_key",
      "keyOrFeatureId": "notificacaonovoprocesso",
      "owners": [
        "lista-processos",
        "notificacoes-processo"
      ],
      "gapId": "gap-strangler-shared-keys",
      "justification": "shared during strangler; see CONFIG_KEY_FEATURE_OWNER_OVERRIDES"
    }
  ]
}
```

