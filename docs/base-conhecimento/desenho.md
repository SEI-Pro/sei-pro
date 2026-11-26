# Base de Conhecimento em árvore — desenho

> Documento de desenho da função, implementada em [`base-conhecimento/`](../../base-conhecimento/). Mantido para registrar as decisões (contrato do envelope, telas, UX e limites).

## Objetivo

Dar à **Base de Conhecimento** do SEI uma navegação por **pastas hierárquicas**,
no espírito de Confluence/ClickUp, sem mexer no dado nativo do SEI:

- a "página" continua sendo o item nativo da Base de Conhecimento (com seu
  template, anexos e versões);
- o SEI Pro acrescenta **apenas a organização** (pastas + vínculo item→pasta).

## Decisões já fechadas

1. **Fonte da hierarquia — Opção A**: árvore própria do SEI Pro, guardada num
   **Texto Padrão da unidade** (mesmo motor de sincronia de Projetos/Demandas).
2. **Abrangência**: a árvore organiza **só os itens da unidade**
   (`base_conhecimento_listar`). A busca global continua na tela nativa.
3. **Escopo de escrita**: a nova UI **só cria/renomeia/move/exclui pastas** e
   **associa/desassocia itens**. Criar, editar, publicar e excluir **itens**
   continua nas telas nativas do SEI.
4. **Compartilhada pela unidade** (não pessoal).

## Telas onde o módulo injeta

| Tela | `acao=` | O que ganha |
|---|---|---|
| Lista da unidade | `base_conhecimento_listar` | Árvore + área da pasta (a tela principal do módulo) |
| Busca | `base_conhecimento_pesquisar` | Atalho/entrada para a árvore; busca global continua nativa |
| Item | `base_conhecimento_visualizar` | **Não injeta** (é a página nativa do item) |
| Cadastro | `base_conhecimento_cadastrar` | Faixa “Será organizado em: …” + **Não organizar** (só quando há pasta selecionada) |

## Wireframe

A visão em pastas **preserva a tela nativa** (barra de comandos e a tabela
`infraTable` com ordenação/filtros) e acrescenta dois pedaços: o **painel de
pastas** (mesmo visual do menu lateral do SEI) e uma **coluna "Pasta"** na
tabela. Botão `[Pastas]` alterna para a lista sem agrupamento.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [gov.br azul] SEI   Unidade: Sinst  [Pesquisa rápida]      usuário  [sair]  │
├───────────────┬────────────────────────────────────────────────────────────┤
│ menu do SEI   │ Base de Conhecimento Sinst                                 │
│ (nativo,      │ [Nova][Imprimir][Liberar][Cancelar Liberação][Excluir][Fechar][Pastas] │
│  intacto)     ├─────────────┬──────────────────────────────────────────────┤
│               │ PASTAS      │ Lista de Procedimentos (1 registro):          │
│               │ + nova pasta│ ┌──┬──────┬──────────┬─────────────┬───────┐ │
│               │ 📖 Fiscaliz.│ │☑ │Pasta │Descrição │Usuário Ger. │Ações  │ │
│               │   ▸ Notas T.│ │☑ │Fisc.›│COMO FAZER│rlamaral     │…      │ │
│               │   ▸ Pareceres│└──┴──────┴──────────┴─────────────┴───────┘ │
│               │ 📖 Talentos │   (as linhas fora da pasta selecionada        │
│               │ 📄 Sem pasta│    aparecem esmaecidas)                       │
└───────────────┴─────────────┴──────────────────────────────────────────────┘
```

Legenda de interação:

- **Clicar numa pasta** → filtra a tabela nativa pelos itens dela; a coluna
  "Pasta" mostra o caminho de cada item; os itens de outras pastas aparecem
  esmaecidos (ou ocultos, conforme a opção).
- **Arrastar uma linha da tabela** (ou da seção "Sem pasta") para uma pasta →
  associa/move.
- **Menu de contexto da pasta** (botão direito) → Renomear, Nova subpasta,
  Excluir (os itens voltam para "Sem pasta"), Mover.
- **"Sem pasta"** sempre lista o que não está organizado (nada some).
- **Buscar** filtra a árvore e a tabela pelo título.
- Vínculo para item que **deixou de existir** aparece riscado com "esquecer".
- A tabela, a ordenação, os filtros e os botões nativos continuam funcionando.

## Fluxos

### Leitura (ao abrir `base_conhecimento_listar`)
1. Lê todos os itens da unidade (com paginação) pela sessão do usuário.
2. Lê a árvore do Texto Padrão da unidade.
3. Mescla: itens da árvore que existem → mostram título real e estado atual;
   itens sem pasta → seção "Sem pasta"; vínculos órfãos → marcados como removidos.

### Organizar pastas (única escrita)
- Criar/renomear/mover/excluir pasta ou associar item → grava o **envelope da
  árvore** no Texto Padrão da unidade, com o motor de sincronia (consentimento
  "Entendi" na primeira vez, mesclagem por entidade, cópias diárias).
- **Nunca** grava no item da Base de Conhecimento do SEI.

### Conflito entre colegas
- Duas pessoas editando: vence a gravação mais recente **por entidade** (pasta ou
  vínculo), como nos outros módulos; o motor relê antes de gravar.

## Contrato de dados (envelope no Texto Padrão)

Nome do texto na unidade: **`[_SEIPRO_BC_UNIDADE]`** (segue o padrão
`[_SEIPRO_FAV_…]`, `[_SEIPRO_DEM_…]`, `[_SEIPRO_PRJ_UNIDADE]`).

```ts
/** Contrato do codec: `formato`/`versao` no topo (é o que `versaoMaisNova` lê). */
interface Envelope {
  formato: "seipro-base-conhecimento";
  versao: 1;                       // sobe só com mudança incompatível
  host: string;                    // host do SEI (o texto não vale em outro SEI)
  unidade: string;                 // id da unidade dona da árvore
  entidades: { p: Pasta[]; v: Vinculo[] };
}

interface Pasta {
  id: string;                      // 10 hexadecimais aleatórios
  nome: string;                    // 1..80 caracteres (aparados)
  pai: string | null;              // id da pasta pai; null = raiz
  ordem: string;                   // índice fracionário (ordenação manual)
  atualizadoEm: number;            // carimbo da última alteração (ms)
  dispositivo: string;             // desempate na mesclagem
  removidoEm?: number;             // lápide (exclusão)
}

interface Vinculo {
  id: string;                      // = id_base_conhecimento_agrupador
  titulo: string;                  // rótulo em cache (atualizado pela lista real)
  pasta: string | null;            // id da pasta; null = sem pasta
  ordem: string;                   // índice fracionário dentro da pasta
  atualizadoEm: number;
  dispositivo: string;
  removidoEm?: number;
}
```

Exemplo:

```json
{
  "formato": "seipro-base-conhecimento",
  "versao": 1,
  "host": "sei.exemplo.gov.br",
  "unidade": "110000108",
  "entidades": {
    "p": [
      { "id": "a1b2c3d4e5", "nome": "Fiscalização", "pai": null, "ordem": "a0", "atualizadoEm": 1, "dispositivo": "notebook" },
      { "id": "f6e5d4c3b2", "nome": "Notas Técnicas", "pai": "a1b2c3d4e5", "ordem": "a0", "atualizadoEm": 2, "dispositivo": "notebook" }
    ],
    "v": [
      { "id": "40", "titulo": "COMO FAZER UMA NOTA TÉCNICA", "pasta": "f6e5d4c3b2", "ordem": "a0", "atualizadoEm": 3, "dispositivo": "notebook" }
    ]
  }
}
```

Regras que o código garante:

- **Referência estável**: usar o `agrupador` como id do vínculo, nunca o id da
  versão (`id_base_conhecimento` muda a cada nova versão).
- **Nada some**: excluir pasta (e as subpastas, na mesma operação) nunca exclui
  item do SEI; os vínculos de toda a subárvore voltam a `pasta: null` ("Sem pasta").
- **Título é cache**: ao ler a lista, o `titulo` do vínculo é atualizado com o
  título real; vínculo para pasta removida volta a `pasta: null`.
- **Integridade do `pai` na exibição**: a mesclagem por entidade pode deixar um
  filho apontando para uma pasta apagada em outro computador; a exibição o põe
  na raiz em vez de recusar o envelope inteiro (não perder dados).
- **Limite de tamanho**: o Texto Padrão tem teto (~100 KB); o motor avisa em 80
  KB e recusa acima de 100 KB. Estimativa: ~80 bytes por vínculo e ~60 por pasta.
- **Migração**: `formato`/`versao` permitem converter envelopes antigos; versão
  mais nova é preservada e nunca sobrescrita.

## UX das Fases A/B (24/11/2026)

- **Árvore de documentação**: cada pasta com conteúdo tem chevron (`▸`/`▾`) com `aria-expanded`; as pastas começam **recolhidas**. Os documentos aparecem dentro da pasta expandida e o nome é link para a tela nativa (`visualizar`, nova aba). Ao abrir (e ao ordenar a tabela) **nenhuma pasta fica selecionada**: a tabela mostra todos os itens. A contagem de documentos aparece entre parênteses ("Fiscalização (3)"), para não se confundir com numeração.
- **Busca**: o campo "Buscar…" do painel filtra pastas e documentos pela árvore, inclusive pastas que contêm um documento com o termo; a busca nativa do SEI segue filtrando só a tabela.
- **Nova pasta** cria **filha da pasta selecionada**; o pai é expandido e a nova pasta é selecionada (comportamento de IDE).
- **Arrastar-e-soltar** de documentos e pastas: alvos são as linhas de pasta e "Sem pasta" (documento → sem pasta; pasta → raiz). Toda soltura pede confirmação e a de pasta diz "Você está movendo a PASTA … (com subpastas e itens)". Pasta em descendente própria é recusada com aviso. O menu "Mover para…" continua como alternativa por teclado.
- **Diálogos no padrão do SEI** (Shadow DOM): nomear/renomear, confirmar e escolher pasta; `role="dialog"`, `aria-modal`, foco preso, Escape cancela.
- **Aviso no padrão do SEI**: barra azul `#155f9b` (cabeçalho do SEI; AA com texto branco), `role="status"`/`aria-live`, fecha sozinha e tem botão de fechar.
- **Sem `window.prompt`/`confirm`** em nenhum fluxo.

## Privacidade

- O envelope guarda apenas **ids + títulos** e a estrutura de pastas — nenhum
  conteúdo, anexo ou dado de processo.
- O Texto Padrão da unidade é visível a quem tem acesso a ele no SEI; é o mesmo
  requisito já usado por Projetos/Demandas, com o mesmo consentimento "Entendi".
- Nada vai para servidor do SEI Pro nem para o Agente de IA.

## Fidelidade visual (lição do mockup)

- **Não reusar a classe `.infraSidebarMenu` do SEI como está**: ela pinta links
  e ícones de claro (`#e7e7e7`), feitos para o fundo escuro do menu. O painel
  de pastas vive sobre fundo branco — usar Shadow DOM no módulo real evita a
  briga de especificidade (no mockup foi preciso `!important`).
- Cores do painel (sobre fundo branco): texto `#212529` (15,4:1), pasta ativa
  `#155f9b` sobre `#e7f0f8` (5,8:1), contadores/notas `#5c636a` a `#6c757d`
  (≥4,7:1) — tudo acima de WCAG AA.
- Ícones do menu do SEI são SVGs com `fill` claro: no painel claro, aplicar
  `filter: brightness(0)` (ou usar ícones próprios escuros).

## Estrutura do pacote (proposta)

```
base-conhecimento/
  src/
    nucleo/      lerLista(), lerItem()  (usa sei-nucleo)
    arvore/      modelo, merge, ordenação, validação
    sincronia/   envelope + adaptador do motor (sei-comum)
    ui/          painel de pastas (estilo do menu do SEI), coluna "Pasta",
                 menus de contexto e arrastar-e-soltar (Shadow DOM)
    content.ts   ponto de entrada do content script
  tests/
  build.mjs
  package.json
```

## Riscos e validações pendentes

1. **Paginação** de `base_conhecimento_listar` em unidades grandes (precisa de
   fixture com paginação para validar).
2. **Estabilidade do `agrupador`** entre versões e entre unidades — validar ao
   vivo.
3. **Itens compartilhados de outras unidades** (aparecem só na busca global) —
   fora do escopo da árvore.
4. **Permissão de escrita no Texto Padrão** — se o usuário não puder alterar,
   a árvore fica em modo leitura ("Indisponível nesta unidade").

## Criar em contexto (25/11/2026)

O **Nova** nativo do SEI cria o item no nível dele; o SEI Pro só o organiza na volta.
O sinal ao vivo é a URL `base_conhecimento_listar&acao_origem=base_conhecimento_cadastrar&id_base_conhecimento=<id>&resultado=1`.

1. **Criar em contexto, nunca às cegas.** Só há intenção quando uma pasta está selecionada ao clicar em **Nova**. "Sem pasta"/nada selecionado = comportamento atual (raiz).
2. **Mostrar o destino antes.** Na tela de cadastro, faixa no visual do SEI: “Será organizado em: `{caminho}`” com **Não organizar** (limpa a intenção; nada é gravado).
3. **Nunca silencioso.** Ao voltar, um aviso diz onde o documento ficou — ou o que impediu a organização.
4. **Desfazer.** O aviso de sucesso tem **Desfazer**, que devolve o item a "Sem pasta".
5. **Intenção de uso único, com prazo e por aba.** Vale uma vez, expira em 10 min (`spro_bc_nova_pasta` na `sessionStorage` da aba — duas abas do SEI não compartilham nem limpam a intenção uma da outra) e é limpa ao aplicar, cancelar, voltar sem o sinal, host/unidade diferente ou pasta removida.
6. **Nunca sobrescrever organização existente.** Item com vínculo vivo em outra pasta: intenção descartada, sem aviso e sem gravação.
7. **Consentimento e permissão (decisão A).** Sem o "Entendi" ou em modo leitura, não organiza: fica em "Sem pasta" e o aviso oferece **Entendi e organizar** (pergunta o "Entendi" e associa); recusar limpa a intenção. Leitura estrita não oferece a ação.
8. **Concorrência segura.** A associação usa `repo.moverVinculo` (upsert com carimbo); a mesclagem do motor segue intacta.
9. **Só no fluxo de criação.** Nada em edição ou "Nova versão" (o vínculo é pelo `agrupador`, estável entre versões).
10. **Acessibilidade.** Faixa e aviso com contraste AA, ação por teclado (44 px, foco visível), `role=status`/`aria-live` no aviso; sem `window.prompt`/`confirm`.

## Numeração (25/11/2026)

- **Formato posicional:** `1.`, `1.1`, `1.1.1` — posição dos irmãos na árvore exibida, recalculada na exibição. Mover ou inserir pasta renumera os irmãos; nada é gravado.
- **Preferência:** `spro_bc_numerar` em `chrome.storage.local` (`"sim"`/`"nao"`), **padrão desligada**, por navegador — só apresentação, nunca entra no Texto Padrão.
- **Onde aparece (ligada):** árvore, coluna "Pasta", diálogo "Mover para…", avisos e faixa do cadastro. "Sem pasta" nunca é numerado.
- **Ao vivo:** trocar a preferência remonta o módulo (a árvore volta ao estado padrão de recolhidas/seleção).
- **Onde configurar:** interruptor **Numerar pastas** no próprio painel Pastas e, também, na aba **Conhecimento** do painel lateral (`html/base-conhecimento.html`), que só aparece quando `js/init_base_conhecimento.js` está no manifest (padrão `temX` do shell).
