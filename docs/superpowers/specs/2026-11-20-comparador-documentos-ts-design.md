# Comparador de Documentos em TS: desenho

Data: 2026-11-20. Status: aguardando aprovação.

## Intenção e porquê

Refazer o Comparador de Documentos na stack TS das últimas refatorações (Documentos em Lote, Ações em Lote, Projetos, Demandas): pacote próprio, `@comum`/`@nucleo`, modal em iframe com o design novo, sem jQuery e sem `innerHTML` cru.

O resultado do legado é satisfatório. O que incomoda é a **velocidade**: a comparação pesa na máquina do cliente. Então o resultado visual e o comportamento ficam iguais, e o ganho é de desempenho.

## Como é hoje (legado)

Tudo em `dist/js/sei-functions-pro.js`: `initDialogCompareDocs`, `openDialogCompareDocs`, `getCompareDocs`, `invertCompareDoc`, `getNewDocCompareDocs`, `getContentDocSEI`; o botão vem de `insertIconCompareDocs` (`#iconCompareDocs`), ligado pela opção `comparardocumentos`.

- A = documento selecionado na árvore (lido do DOM da árvore); B = escolhido num `select` com `chosen`.
- Diff por `htmldiff` (tnwinc, em `dist/js/lib/diff2html.min.js`) sobre o HTML inteiro; `<del>` vermelho riscado, `<ins>` azul sublinhado.
- Resultado num iframe; remove imagens repetidas e `onclick`.
- Ações: Inverter (A/B para B/A), Baixar (HTML), Criar Novo Documento (escolhe o tipo e cria no processo com o diff como conteúdo).

### Causas da lentidão

1. `htmldiff` tem custo quadrático no pior caso, roda na thread principal (a página trava) e recebe o HTML todo, com `<head>` e estilos.
2. O B exige três requisições em série (`procedimento_trabalhar`, árvore, `documento_visualizar`) só para achar uma URL.
3. O A passa por `decodeHtml` e jQuery `.html()` sobre strings grandes, e o pós-processo percorre imagens e `onclick` com jQuery.

## Metas

- Comparar em uma fração do tempo atual nos mesmos dois documentos, sem travar a página.
- Resultado visual equivalente ao legado (cores, estrutura, tabelas, numeração).
- Mesmos recursos: inverter, baixar, criar novo documento.
- Mesma opção (`comparardocumentos`) e mesmo botão na barra do processo.
- Funcionar no SEI 4 (SP) e no SEI 5 (ANTAQ), em Chrome e Firefox.

## Não-metas

- Mudar o que o comparador mostra ou aceitar PDF/anexo (continuam fora, só documentos gerados no SEI do mesmo processo).
- Comparar mais de dois documentos ou documentos de processos diferentes.
- Diff semântico (movimento de parágrafos, sinônimos).

## Antimetas (falha mesmo que "funcione")

- Resultado que perde tabela, numeração ou imagem em relação ao legado.
- Janela travada durante o cálculo.
- Enviar o conteúdo dos documentos para fora do computador (hoje não sai e continua assim).
- `innerHTML` cru ou HTML do SEI inserido sem sanitizar.

## Restrições

- Padrão do repositório: pacote com `build.mjs` (esbuild, JS em ASCII com acentos `\uXXXX`), `biome`, `tsc`, `tests/verificar.ts` com linkedom, `@comum/*` e `@nucleo/*`.
- Firefox: o relé no background para app em iframe (já existente) e o portão de DOM seguro (sem inserção crua).
- Memória do projeto: modal sem botão Cancelar (X/Esc fecham); todo release atualiza `HISTORICO.md`.
- O legado só é removido depois da validação ao vivo.

## Abordagens consideradas

1. **Mesmo `htmldiff` no pacote TS.** Remove o jQuery, mas o custo quadrático e a thread principal ficam. Descartada: não resolve a causa.
2. **Diff em duas fases em Web Worker (escolhida).** Fase 1 compara blocos por hash; fase 2 faz diff de palavras só nos blocos que mudaram. Ataca as causas 1 a 3 e preserva a estrutura.
3. **Biblioteca pronta (`diff-match-patch`).** Boa para texto, perde a estrutura HTML; reconstruí-la custa tanto quanto o algoritmo próprio e adiciona dependência. Descartada.

Escolha do Pedro: opção 2. Plano B se o Worker não servir no Firefox: o mesmo algoritmo em fatias na thread principal, com progresso visível.

## Desenho (opção 2)

### Estrutura

Pacote `comparador-documentos/`, no molde do `documentos-lote/`:

- `src/pagina/` content script (mundo isolado, janela de topo): marca o botão, respeita a opção `comparardocumentos`, abre o modal em iframe pelo `criarControleModal`; tratadores respondem ao app (documento A, lista de documentos, conteúdo do B, criar documento, fechar/minimizar).
- `src/app/` app do iframe (`html/comparador-documentos.html`): A (somente leitura), B (combobox com busca), Inverter, resultado, Baixar, Criar Novo Documento.
- `src/modelo/` sem DOM do SEI: normalização do documento, blocos, hash, diff, montagem do resultado; é o que o Worker executa.
- `src/sei/` leitura do conteúdo e criação de documento sobre o `Sei` do `@nucleo`, reaproveitando o que o Documentos em Lote já tem para criar.
- `estatico/` HTML e CSS do app; o CSS compõe `base.css` do `@comum` mais o próprio.

### Algoritmo

1. **Normalizar**: pegar só o corpo do documento, descartar `<head>`, estilos, scripts e atributos irrelevantes; decodificar entidades uma vez; imagens repetidas descartadas aqui, e não depois (equivale ao que o legado faz no pós-processo).
2. **Blocos**: dividir por elementos de bloco (parágrafo, item, célula/linha de tabela, título). Cada bloco ganha um hash do texto normalizado e fica com seu HTML original.
3. **Fase 1**: alinhar as duas listas de blocos por hash (LCS sobre hashes com poda de prefixo/sufixo iguais, quase linear no caso comum). Blocos iguais passam direto.
4. **Fase 2**: nos trechos que mudaram, parear blocos parecidos e fazer diff de palavras (tokens) só ali; blocos sem par viram `<ins>` ou `<del>` inteiros.
5. **Montar** o HTML com os mesmos estilos de `<del>` e `<ins>` do legado e sanitizar antes de inserir no iframe (sem `onclick`).
6. **Worker**: passos 1 a 5 em Web Worker (bundle próprio gerado pelo build, ASCII); a página só envia os dois HTMLs e recebe o resultado, com mensagem de progresso. Falha do Worker cai no plano B (fatias na thread principal).

### Leitura dos documentos

- A: lido da árvore, como hoje, só que uma vez e sem passar por jQuery.
- B: URL de `documento_visualizar` montada direto a partir de `id_procedimento` e `id_documento`, sem a árvore; se o SEI recusar (variações SEI 4 e 5), cai na descoberta atual pela árvore. A lista de documentos carrega ao abrir, em paralelo com a leitura do A.
- B já pode ser pré-carregado quando escolhido; inverter reusa os dois conteúdos sem nova requisição.

### Interface

Modal em iframe no design novo (`modalIframe`), com A fixo no topo, combobox de B, Inverter, resultado com altura redimensionável (`alturaRedimensionavel`) e ações no rodapé. Estado de carregando e mensagens de erro no padrão dos outros módulos. Sem Cancelar: X e Esc fecham. Mensagem quando não há documento selecionado, igual à do legado.

### Medição

Instrumentar o tempo de cada fase (busca do B, normalização, fase 1, fase 2, montagem) e comparar legado e novo nos mesmos dois documentos (um curto, um longo com tabelas). Critério de sucesso: o novo é claramente mais rápido nos dois e não trava a página (checado por tarefas longas na thread principal).

## Testes e validação

- `tests/verificar.ts`: unidade do diff (blocos iguais, inserção, remoção, edição dentro do bloco, tabelas, inversão A/B, documento vazio, documentos grandes), sanitização e montagem; paridade de saída com o legado em amostras fixas.
- Chrome for Testing: SEI SP (SEI 4) e SEI ANTAQ (SEI 5), em validação ao vivo: abrir, comparar, inverter, baixar, criar documento, com tempos medidos. Login de teste do SEI SP conforme memória; ANTAQ pelo perfil de teste.
- Firefox: lint e portão de DOM seguro limpos; app em iframe pelo relé.

## Entrega

Release com `HISTORICO.md` atualizado; remoção do legado do `sei-functions-pro.js` (funções do comparador e o `htmldiff` de `lib/diff2html.min.js` se mais ninguém usar), manifests e o ponto de entrada em `sei-pro-visualizacao.js` (`insertIconCompareDocs`) ajustados; `pages/COMPARARDOCUMENTOS.md` revisada.

## Fica para o construtor

- Lista exata de elementos que contam como bloco e o limiar de "parecido" na fase 2 (calibrar com documentos reais).
- Detalhes do relé do Firefox para o Worker e do caminho de reserva.
- Formato exato do nome do arquivo baixado: manter o do legado (`Comparativo A - B (NAMESPACE)`).
- Decidir, após a medição, se o pré-carregamento do B vale a requisição extra quando o usuário só quer olhar a lista.
