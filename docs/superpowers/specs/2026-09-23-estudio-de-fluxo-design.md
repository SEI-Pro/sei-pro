# Estúdio de Fluxo — especificação de desenho

Data: 23/09/2026 · Status: aprovado em conversa com o autor (todas as decisões desta seção 2).

## 1. Objetivo

Deixar a **unidade mapear o próprio rito processual** e, a partir desse mapa, o SEI Pro passa a:

1. dizer **em que etapa** cada processo está;
2. **sugerir a próxima providência**, com um cartão que o usuário aceita, adia ou recusa;
3. preparar a minuta do documento seguinte (isso sim com IA, e só depois do clique).

A origem é um pedido de usuário (Tavares, SOG/ANTAQ, 23/09/2026): sugestões proativas a partir
de precedentes operacionais e do tipo processual. O exemplo dele — "a Nota Técnica aponta
pendências e não há ofício posterior; em casos semelhantes você expede ofício" — vira, aqui,
consequência de um fluxo mapeado.

O próprio autor corrigiu o exemplo na conversa, e a correção é a justificativa central do
desenho: **NT normalmente é seguida de Despacho de aprovação**, não de ofício; e há outro rito,
"Ofício-MINUTA assinado → Ofício expedido". Rito não se adivinha por semelhança textual: ele se
escreve, ou se extrai de um processo real que um humano apontou como exemplar.

## 2. Decisões tomadas (todas aprovadas em conversa)

| Tema | Decisão |
|---|---|
| Detecção | **100% local**, no navegador, sobre a árvore do processo. Nenhum conteúdo sai sem clique do usuário. |
| Papel da LLM | Não decide rito. Entra em dois momentos: **propor um fluxo a partir de processos modelo** (metadados) e **redigir a minuta** quando o usuário aceita a sugestão. |
| Gatilho | Só o **processo aberto na tela**, e só quando o painel do agente está aberto (ver 6.1). Sem varredura de caixa. |
| Onde aparece | Cartão no painel do agente **+ aviso discreto** (ponto) no ícone do agente na barra do SEI. |
| Onde se edita | **Aba em tela cheia** (`html/fluxos.html`), com botão próprio na barra do SEI ao lado do Agente de IA. Não é uma segunda sidebar: o Chrome mostra um painel lateral por vez, e o estúdio precisa de largura. |
| Autonomia do estúdio | **Funcionalidade à parte**, com opção própria. Funciona **sem chave de IA** (mapeamento manual); com chave, ganha o "aprender de processo modelo". |
| Padrões avulsos | Não existem. Tudo é fluxo — um conceito só. |
| BPMN | Formato de **saída e importação** (XML BPMN 2.0 + diagrama), não editor de canvas. Fase 2. |
| Compartilhamento | Pasta do GitHub, igual às coleções de skills. Fase 2. |

## 3. Modelo de dados

```ts
interface Fluxo {
  id: string;
  nome: string;                    // "Contrato de transição"
  descricao?: string;
  ativo: boolean;
  /** Quando este fluxo se aplica a um processo. */
  aplicaSe: {
    tipoProcessoContem?: string[]; // casa o tipo da árvore, sem acento e sem caixa
    marcador?: string[];
    unidade?: string[];            // só nestas unidades
  };
  etapas: Etapa[];
  /** Processos usados como modelo, para auditoria do que foi inferido. */
  modelos?: Array<{ protocolo: string; quando: number }>;
  origem: "manual" | "inferido" | "colecao";
  atualizadoEm: number;
}

interface Etapa {
  id: string;
  nome: string;                    // "Despacho de aprovação"
  /** Documento que caracteriza a etapa, como aparece na ÁRVORE. */
  documento: { tituloContem: string[]; assinado?: boolean; daMinhaUnidade?: boolean };
  obrigatoria: boolean;            // etapa opcional não gera sugestão de falta
  /** Dias após a etapa anterior para considerar atrasada (0 = sem prazo). */
  prazoDias?: number;
  /** O que o agente faz quando o usuário aceita a sugestão. */
  acao?: {
    titulo: string;                // "Preparar despacho de aprovação"
    pedido: string;                // texto enviado ao agente, pode citar /skill
  };
  /** Desvio simples: se a etapa anterior casar isto, pula para outra etapa. */
  condicao?: { seDocumentoContem: string; entaoIrPara: string /* id de etapa */ };
}
```

Guardado em `chrome.storage.local`, chave `agenteIA_fluxos` (nome mantido por coerência com as
demais chaves do agente, ainda que o estúdio seja funcionalidade à parte).

Estado por processo (o que o usuário já ignorou) em `agenteIA_fluxosIgnorados`:
`{ [protocolo]: { etapaId: string; quando: number }[] }`.

## 4. Como o fluxo vira sugestão

Algoritmo, todo local e determinístico:

1. **Escolher o fluxo**: o primeiro fluxo ativo cujo `aplicaSe` casa com o processo aberto.
2. **Posicionar**: percorrer as etapas na ordem; uma etapa está *cumprida* quando existe na
   árvore um documento que casa `documento` (título, assinatura, unidade). A **ordem da árvore
   é cronológica**, então "veio depois" é posição, sem precisar de data.
3. **Achar a lacuna**: a primeira etapa obrigatória não cumprida **cuja anterior está cumprida**.
   Só essa gera sugestão (uma por processo).
4. **Filtrar ruído**: se o usuário ignorou aquela etapa naquele processo, não mostra.
5. **Montar o cartão** com: o que foi encontrado (documento da etapa anterior), o que falta, e as
   quatro ações — **Preparar** (executa `acao.pedido` no agente), **Ver detalhes** (mostra as
   etapas cumpridas e a que falta), **Ignorar neste processo**, **Não sugerir este fluxo**.

Texto do cartão sempre no **condicional** e sobre estrutura, nunca sobre conteúdo:
*"A Nota Técnica 0123456 está assinada e não há Despacho posterior. O fluxo 'Contrato de
transição' prevê Despacho de aprovação nesta etapa."* Se a etapa depende de conteúdo (a NT
concluiu por pendências?), isso é verificado **depois** do clique, ao preparar a minuta — e o
agente avisa quando o conteúdo não confirma a premissa.

## 5. Aprender de processos modelo (com IA)

Entrada: um ou mais números de processo que **já percorreram o fluxo inteiro**.

1. O estúdio lê, por processo, **só metadados**: títulos dos documentos na ordem da árvore,
   unidade geradora, se está assinado, e o histórico (andamentos com data e unidade).
2. Uma chamada ao modelo com esses metadados pede: separar **etapa do rito** de **documento
   acessório** (anexo, comprovante, e-mail, despacho de mero encaminhamento), nomear as fases e
   devolver a sequência em JSON no formato de `Etapa`.
3. Com dois ou mais modelos, o estúdio mostra **o que é comum e o que divergiu**
   ("em 2 de 3 veio Despacho antes do Ofício").
4. O resultado entra como proposta `origem: "inferido"`, com os processos citados, **para o
   usuário editar e salvar**. Nada vira fluxo ativo sem confirmação.

Custo: uma chamada por rodada, com metadados (não com o conteúdo dos documentos).

## 6. Arquitetura

```
sei-nucleo/                 já existe: árvore, histórico, documento
agente-ia/
  src/fluxos/               NOVO — modelo, avaliação (local), inferência (LLM)
    modelo.ts                 tipos + storage + validação
    avaliar.ts                fluxo × árvore → { etapaAtual, lacuna, cumpridas }
    inferir.ts                metadados dos modelos → proposta de fluxo (prompt + parse)
  src/estudio/              NOVO — a página em tela cheia
    main.ts                   lista de fluxos, editor de etapas, importar modelo
  src/painel/main.ts        cartão de sugestão no painel
  src/ponte/                op nova: "fluxo.avaliar" (roda no content script, local)
dist/html/fluxos.html       NOVA página (tela cheia)
dist/js/estudio/            bundle da página
dist/icons/menu/fluxos.svg  ícone do botão na barra do SEI
```

### 6.1 Onde cada coisa roda

- **Avaliação** (`avaliar.ts`): no **content script**, que já tem a sessão. Só é disparada
  quando o painel do agente está aberto (`CHAVE_ABERTURA`, que a ponte já mantém) — com 220 mil
  instalações, carga por processo aberto para quem não usa o agente seria desnecessária no SEI
  do órgão.

  **REVISÃO de 23/09/2026 (decisão do autor, depois do teste em produção).** O desenho original
  dizia que a avaliação leria a árvore JÁ RENDERIZADA na tela, sem requisição nenhuma. Não
  funciona: o SEI só carrega o conteúdo de uma pasta quando o usuário a abre. Num Procedimento
  de Fiscalização real da ANTAQ (50300.014788/2023-20), com seis pastas, a árvore recém-carregada
  tem **16 dos 111 nós** — e o fluxo não sugeria nada, em silêncio. Como a ferramenta não cumpre
  o papel dela lendo o processo pela metade, a regra foi flexibilizada: a operação
  `fluxo.avaliar` **busca a árvore completa** (`sei.arvore`, com `abrir_pastas=1`).

  O que continua limitando a carga: só com o painel aberto; só quando há processo na tela **e** a
  unidade tem fluxo ligado; e o cache de 30 s por processo do `sei-nucleo`, então reabrir o mesmo
  processo não vira outra requisição.

  Custo medido no SEI 5 de produção da ANTAQ, contando as chamadas a `controlador.php` da aba:
  **2 requisições** na primeira vez que um processo é avaliado (`localizar` + `abrirArvore`), **0**
  nas três avaliações seguintes dentro dos 30 s, e **0** com o fluxo desligado.
- **Cartão**: no painel, alimentado pela ponte.
- **Ponto no ícone**: no content script, na barra do SEI (mesmo lugar do ícone do agente).
- **Estúdio**: página própria, conversa com a aba do SEI pela mesma ponte (para ler processos
  modelo) e com o provedor de IA pelo mesmo `criarProvedor`.

## 7. Integração com o que já existe

| Peça | Papel no fluxo |
|---|---|
| **Skills** | O `acao.pedido` cita `/skill`, então a minuta sai no padrão da unidade. |
| **Regras da unidade** | Continuam valendo: se a regra bloqueia criar Ofício, a sugestão pode aparecer, mas a execução é barrada com a mensagem da regra. |
| **Memória** | Fatos aprendidos continuam entrando no prompt da minuta. |
| **Rotinas** | Uma rotina pode perguntar "quais processos estão com etapa atrasada?" (fase 3). |
| **Teto de gasto** | Vale para inferir fluxo e preparar minuta; a avaliação local não gasta nada. |
| **Desfazer** | A minuta criada pela sugestão é `documento_criar`: já tem desfazer. |

## 8. Sem chave de IA

O estúdio abre, mapeia, edita, importa e exporta fluxos, e as sugestões aparecem normalmente —
tudo isso é local. Sem chave, o botão **Preparar** explica que a minuta precisa do agente
configurado, e o botão "aprender de processo modelo" fica desabilitado com a mesma explicação.

## 9. Fases

**Fase 1 (esta especificação, para implementar agora)**
- modelo de dados + storage + validação;
- avaliação local (fluxo × árvore) com testes;
- estúdio em tela cheia: lista, editor de etapas, ativar/desativar, excluir;
- aprender de processo modelo (1 ou N processos);
- cartão de sugestão no painel + ponto no ícone;
- opção própria nas configurações do SEI Pro e página de documentação.

**Fase 2** — diagrama visual, exportar/importar BPMN 2.0, coleção de fluxos por pasta do GitHub.

**Fase 3** — "onde estou no fluxo" na tela do processo, prazos por etapa, rotina de atrasados.

## 10. Testes

- **Unidade** (`npm run verificar`): avaliação de fluxo (etapa cumprida, lacuna, desvio,
  ignorados, fluxo que não se aplica), validação do modelo, parse da inferência (JSON malformado,
  etapa sem documento, alucinação de campo).
- **Evals** (`npm run evals`): um caso novo — dado o JSON de metadados de um processo modelo, a
  proposta precisa conter as etapas do rito e **não** conter os anexos.
- **E2E** (harness Chrome for Testing): mapear fluxo à mão no estúdio, abrir um processo que casa,
  ver o cartão, clicar em Preparar e chegar ao cartão de aprovação do documento.

## 11. Riscos e limites (a dizer ao usuário, não a esconder)

- **Um processo modelo generaliza mal.** A tela precisa incentivar dois ou três, e mostrar
  divergências.
- **Precedente não é norma.** O fluxo inferido é uma leitura do que foi feito, não do que deveria
  ser feito; por isso nada entra sem revisão humana e cada etapa guarda de onde veio.
- **Títulos variam entre órgãos.** O casamento é por título da árvore, sem acento e sem caixa, com
  lista de variações por etapa ("Nota Técnica", "NT").
- **Processo sigiloso**: fora, como em todo o resto do agente.
- **Ruído**: uma sugestão por processo; ignorar persiste; três recusas do mesmo fluxo fazem o
  agente perguntar se deve desativá-lo.
