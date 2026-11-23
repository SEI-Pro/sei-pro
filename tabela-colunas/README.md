# Tabela com colunas em %

Contribuição do IPPLAM (Instituto de Pesquisa e Planejamento Urbano de Maringá, Município de Maringá/PR),
por Bruno Albuquerque. Ver [CREDITOS.md](../CREDITOS.md). Manual do usuário: [pages/TABELACOLUNAS.md](../pages/TABELACOLUNAS.md).

Botão **Tabela com colunas em %** na barra do editor do SEI 5 (CKEditor 5), ao lado de "Tabela Rápida" e
"Adicionar estilo à tabela".

- Fora de tabela: cria uma tabela no lugar do cursor (linhas, colunas, largura).
- Com o cursor numa tabela: ajusta a largura dela e de cada coluna, o tema, o cabeçalho e o estilo do texto.

As larguras ficam em % (tabela em % da largura do texto; colunas em % da tabela, somando 100), gravadas
pelo comando `resizeColumnWidths` do próprio editor: sai `<table style="width:X%">` com `<colgroup>`, que a
folha do SEI trata com `table-layout: fixed`. Os temas são os do SEI (`infra-doc-tabela__*`, comando
`temaTabela`). Tudo num só `model.change`: um Ctrl+Z desfaz.

Posição na página (esquerda, centralizada, direita), na aba "Tamanho e colunas": grava o `tableAlignment`
do CK5, o mesmo do botão "Propriedades da tabela" do SEI. Centralizada é o padrão do editor (sem atributo).
No CK5 novo, esquerda e direita vão como `blockLeft`/`blockRight` (margem: o texto segue abaixo, como no
Word). O antigo só tem `left`/`right`, que flutuam, e o texto de fora corre ao lado da tabela; o diálogo
avisa. Qual dos dois o editor tem é descoberto convertendo uma tabela de teste fora do documento
(`temPosicaoEmBloco`). Só aparece com largura abaixo de 100%. A limpeza não tira a posição.

Texto das células por **modelo**: tamanho (menor, padrão, maior) × alinhamento (esquerda, centralizado,
direita), montado com os estilos `Tabela_*` que a seção aceita. Tamanho e alinhamento vêm do CSS do SEI
(`infra.estilo.css`) e, sem ele, do nome (`Tabela_Texto_Alinhado_Direita_10pt` → 10 pt, direita). O
cabeçalho usa o centralizado do mesmo tamanho (11 pt → `Tabela_Texto_Centralizado`). Ver `src/estilos.ts`.

Zebra pela 1ª coluna (`src/zebra.ts`): os temas zebrados do SEI pintam por `tr:nth-child`, sem saber de
mesclagem. Quando a 1ª célula de uma linha desce por várias linhas (rowspan), essas linhas formam um grupo
com a mesma cor, e o grupo seguinte troca. A cor vai em cada `<td>` como `tableCellBackgroundColor` com
`!important` (a folha do tema força `transparent !important`): `#e5e5e5` ou `#ffffff`, com a paridade de
cada tema. Um post-fixer do model mantém isso em qualquer mudança da tabela (mesclar, dividir, botão de
tema do SEI) e tira as marcas quando não há mais mesclagem na 1ª coluna ou o tema deixa de ser zebrado.
Sem mesclagem, a tabela fica sem cor inline.

Limpeza (`sujeiraDaTabela` em `src/editor.ts`): tira a formatação de tabela colada antes de aplicar o
resto. Sai o HTML colado guardado pelo GHS (`html*`: estilos, classes, `border`, `cellpadding`…), as
propriedades de tabela e célula do CK5 (bordas, fundo, espaçamento, largura e altura, alinhamento nas células), o
alinhamento, recuo e entrelinha dos parágrafos e a fonte, tamanho e cores do texto. Ficam o texto,
negrito/itálico/sublinhado, links, mesclagens, cabeçalho, tema e o estilo do SEI. Vem ligada na 1ª vez
(tabela sem o `word-wrap` que esta ferramenta grava) quando há o que tirar.

Bordas (`src/bordas.ts`): desenhadas como no Word, na tabela inteira ou nas células selecionadas.
Prontas (todas, externas, internas, nenhuma) ou clicando nas linhas do quadro; linha contínua, tracejada,
pontilhada ou dupla; espessura em pt e cor. Gravadas em cada célula (`tableCellBorder*`) porque a folha do
SEI desenha a grade com `:is(...)`, que o "Gerar PDF" (wkhtmltopdf 0.12.6) descarta: sem isso o PDF sai
só com a borda externa cinza. Como a borda é colada, a vizinha de fora recebe o lado encostado. Com a
tabela inteira, a borda da própria tabela vira `none`. Não vale com tema do SEI (o tema força as dele com
`!important`). Tabela nova sem tema já sai com todas as bordas, 1 pt preta.

Tema personalizado (`src/personalizar.ts`): na aba Tema, "Personalizar cores e bordas" parte do tema
escolhido (ou do zero) e grava o visual célula a célula: fundo do cabeçalho (com texto branco se o fundo
for escuro), listras pela 1ª coluna, 1ª coluna como cabeçalho e as bordas da aba Bordas. A tabela sai
sem a classe do tema, porque as regras `!important` dele venceriam as cores e as bordas. O CK5 grava a
borda em atalho e perde um `!important` ali ao reabrir. As listras vão como `rgb(r,g,b)` sem espaços (a
marca desta ferramenta): o post-fixer refaz a zebra depois de mesclar ou inserir linhas, e o diálogo
reconhece a personalização ao reabrir. Desmarcar tira essas cores.

As miniaturas de tema usam a classe real do SEI. A tabela abre o próprio empilhamento (`z-index:0`),
porque a pintura do tema é `td:before` em `z-index:-1`.

Para não cortar na impressão:
- colunas nunca abaixo de 30 pt (a célula do SEI tem `min-width: 2em` + `padding`), com aviso quando há
  colunas demais para a largura;
- tira largura em px e `white-space: nowrap` das células;
- grava `word-wrap: break-word` na tabela, nome que o gerador de PDF do SEI (wkhtmltopdf) entende.

## Comandos

```
npm install
npm run build       # testes + dist/js/modules/editor/tabela-colunas.js
npm run tipos
```

O bundle é carregado pelo `SeiProEditorAdapter` (lista `MODULES` em `dist/js/sei-pro-editor-adapter.js`);
o botão e o clique estão em `dist/js/sei-pro-editor.js` (`getTabelaColunasButtom`).
