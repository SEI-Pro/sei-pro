# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## Tabela com colunas em %

Sabe aquela tabela que fica perfeita na tela, mas sai **cortada no PDF**? Ou que tem uma coluna de "Nº" enorme e a de "Descrição" espremida? Ou que veio colada do Word com fontes, cores e bordas que brigam com o resto do documento?

O botão **Tabela com colunas em %** resolve isso numa janela só. Com ele você:

* cria uma tabela já com a **largura certa de cada coluna**;
* ajusta uma tabela que já existe, inclusive uma **colada de outro editor**;
* escolhe a **posição** da tabela na página (esquerda, centro ou direita);
* aplica um **tema do SEI** ou cria o seu, com **cores** e **bordas** à sua escolha;
* define o **tamanho e o alinhamento do texto** das células, usando os estilos do seu órgão.

As larguras ficam em **porcentagem**: a tabela ocupa uma fração da largura do texto, e cada coluna, uma fração da tabela. Por isso a tabela sai igual **na tela, na impressão e no "Gerar PDF"**.

> Esta função é do **SEI 5** (editor novo). No SEI 4 o botão não aparece.

---

### Onde fica o botão

Na barra do editor, ao lado de **Tabela rápida** e de **Adicionar estilo à tabela**, procure o ícone de **colunas** com o nome **Tabela com colunas em %** (aparece ao parar o mouse em cima).

O que a janela faz depende de **onde está o cursor** quando você clica:

| Cursor | O que acontece |
| ------ | -------------- |
| No texto, fora de tabela | A janela abre para **criar** uma tabela nesse ponto |
| Dentro de uma tabela | A janela abre para **ajustar** essa tabela |

---

### Primeiro passo a passo: criar uma tabela

Vamos criar uma tabela de 3 colunas (Nº, Descrição e Valor), com a coluna de descrição bem larga.

1. Clique no ponto do documento onde a tabela deve entrar;
2. Clique no botão **Tabela com colunas em %**;
3. Na aba **Tamanho e colunas**:
   * em **Linhas**, digite `5`; em **Colunas**, digite `3`;
   * em **Largura**, deixe `100` (de margem a margem);
   * em **Colunas (% da tabela)**, digite `10`, `70` e `20`. Se preferir, **arraste as divisórias** da barra colorida;
4. Na aba **Tema**, clique na miniatura do tema que preferir;
5. Na aba **Texto**, deixe marcado **Primeira linha como cabeçalho** e escolha o **tamanho** e o **alinhamento** do texto;
6. Clique em **Inserir tabela**.

Pronto: a tabela entra no documento com as larguras escolhidas. **Ctrl+Z** desfaz tudo de uma vez, se não gostar.

---

### Ajustar uma tabela que já existe

1. Clique **dentro** de qualquer célula da tabela;
2. Clique no botão **Tabela com colunas em %**;
3. A janela abre com o que a tabela já tem: larguras, tema, cabeçalho e posição. Mude só o que quiser;
4. Clique em **Aplicar**.

O número de linhas e colunas não muda por aqui. Para incluir ou excluir colunas e linhas, use a barra de tabela do próprio editor e depois volte ao botão para acertar as larguras.

#### Tabela colada do Word, Excel ou Google Docs

Tabela colada costuma trazer "lixo": fonte própria, tamanhos fixos em pixels, cores e bordas que não somem. Ao ajustar uma tabela, o topo da janela mostra uma faixa amarela com a opção **Limpar a formatação antes de aplicar** e quantos itens de formatação foram encontrados. Na primeira vez que a tabela passa pela janela, se houver o que tirar, a opção já vem marcada.

* **Sai:** fontes, tamanhos e cores do texto colado, bordas, fundos, espaçamentos, larguras fixas e alinhamentos das células.
* **Fica:** o texto, **negrito**, *itálico*, sublinhado, links, células mescladas, o cabeçalho e a posição da tabela.

Depois da limpeza, o tema, as bordas e o texto que você escolher são aplicados sobre a tabela limpa, sem briga de formatação.

---

### As abas da janela, uma a uma

#### Aba "Tamanho e colunas"

* **Linhas e Colunas**: só na tabela nova.
* **Largura da tabela**: em % da largura do texto. `100` vai de margem a margem; `60` deixa a tabela mais estreita.
* **Posição**: **Esquerda**, **Centralizada** ou **Direita**. Só faz diferença com largura **menor que 100%**.
* **Colunas (% da tabela)**: digite a porcentagem de cada coluna ou arraste as divisórias da barra. A soma é sempre 100%: quando uma coluna cresce, a vizinha diminui. **Colunas iguais** divide tudo por igual.

> **Por que a janela não deixa uma coluna ficar fininha?** Cada coluna tem um mínimo para caber na impressão. Abaixo disso, o texto seria cortado no PDF. Quando há colunas demais para a largura escolhida, a janela avisa e sugere aumentar a largura ou usar a página em paisagem.

#### Aba "Tema"

* **Tema do SEI**: as miniaturas mostram os temas do seu órgão como eles realmente aparecem. **Sem tema** deixa a tabela só com bordas.
* **Temas zebrados** (linhas alternadas): se a 1ª célula de uma linha estiver **mesclada** com as de baixo, todas essas linhas ficam com a **mesma cor**, e a cor só troca no grupo seguinte. Assim os grupos ficam fáceis de ler.

  | Item | Etapa | Prazo |
  | ---- | ----- | ----- |
  | **Contratação** (mesclada em 2 linhas) | Pesquisa de preços | 10 dias |
  | ↳ mesma cor | Termo de referência | 15 dias |
  | **Execução** (troca a cor) | Entrega | 30 dias |

* **Personalizar cores e bordas**: gostou de um tema, mas quer outra cor? Marque esta opção. A janela parte do tema escolhido e libera:
  * **Cor do cabeçalho** (com fundo escuro, o texto do cabeçalho fica branco sozinho);
  * **Cor das listras** (ou **Sem listras**);
  * **Listra começa na 1ª linha do corpo**: troca qual linha recebe a cor;
  * **1ª coluna como cabeçalho**: pinta a primeira coluna como o cabeçalho;
  * as **bordas**, na aba **Bordas**.

  A prévia logo abaixo mostra o resultado na hora. Desmarcar a opção tira as cores personalizadas.

#### Aba "Bordas"

Funciona como no Word: você escolhe **quais linhas** aparecem e **como** elas são.

1. Marque **Desenhar bordas**;
2. Escolha uma borda **pronta**: **Todas**, **Externas**, **Internas** ou **Nenhuma**. Ou clique nas linhas do quadro para ligar e desligar cada uma (em cima, embaixo, laterais, horizontais e verticais internas);
3. Escolha a **Linha** (contínua, tracejada, pontilhada ou dupla), a **Espessura** (em pt) e a **cor**.

Se você selecionou **várias células** antes de abrir a janela, aparece **Aplicar em**: escolha entre as células selecionadas e **Toda a tabela**. É assim que se faz, por exemplo, uma linha mais grossa só embaixo do cabeçalho.

> **Bordas e temas do SEI:** os temas do SEI desenham as próprias bordas, e elas não podem ser trocadas. Para mudar as bordas de um tema, marque **Personalizar cores e bordas** na aba **Tema**, ou escolha **Sem tema**.

> **Por que isso importa no PDF?** O "Gerar PDF" do SEI às vezes mostra só a borda de fora da tabela. As bordas desenhadas aqui ficam gravadas em cada célula, para aparecerem no PDF como na tela.

#### Aba "Texto"

* **Primeira linha como cabeçalho**: destaca a 1ª linha e a **repete no topo de cada página** quando a tabela é longa.
* **Tamanho** e **Alinhamento**: em vez de escolher um estilo pelo nome, escolha o tamanho (menor, padrão, maior) e o alinhamento (esquerda, centro, direita). A janela usa o estilo de tabela do seu órgão que corresponde à escolha.
* **Cabeçalho centralizado**: o cabeçalho usa o mesmo tamanho, centralizado.
* Na tabela que já existe, marque **Alterar o texto das células** para mexer no texto. Sem isso, o texto fica como está.

---

### Receitas rápidas

| Quero… | Faça assim |
| ------ | ---------- |
| Uma coluna "Nº" estreita e a descrição larga | Aba **Tamanho e colunas** → colunas `10` / `70` / `20` |
| Uma tabela menor, centralizada | Largura `60` → Posição **Centralizada** |
| Consertar tabela colada do Word | Cursor na tabela → botão → deixe **Limpar a formatação** marcado → **Aplicar** |
| O tema do SEI, mas com cabeçalho azul | Aba **Tema** → clique no tema → **Personalizar cores e bordas** → cabeçalho **Azul escuro** |
| Só a linha de baixo e a de cima, estilo acadêmico | **Sem tema** → aba **Bordas** → desligue tudo e ligue **superior** e **inferior** |
| Uma borda mais grossa embaixo do cabeçalho | Selecione as células do cabeçalho → botão → **Bordas** → **Aplicar em** células selecionadas → ligue só a de baixo, espessura `1,5` |
| Linhas agrupadas com a mesma cor | Mescle a 1ª coluna das linhas do grupo → escolha um tema **zebrado** |
| Tabela que não corta no PDF | Mantenha as larguras em % (a janela já garante o mínimo de cada coluna) |

---

### Dúvidas comuns

**Errei. Como volto atrás?**
Aperte **Ctrl+Z** uma vez: tudo o que a janela aplicou é desfeito de uma vez.

**Arrastei a borda da coluna no editor e as % mudaram. Tem problema?**
Não. Abra a janela de novo para ver e acertar os valores.

**Mesclei células depois de aplicar o tema zebrado. As cores ficaram erradas?**
Não. A pintura por grupo se refaz sozinha quando você mescla, divide ou insere linhas.

**A tabela aparece igual para quem não tem o SEI Pro?**
Sim. Tudo é gravado no próprio documento, com os recursos do editor do SEI.

**A opção de limpar não apareceu.**
Ela só aparece ao ajustar uma tabela que já existe. Na tabela nova não há o que limpar. Se a faixa disser "nenhuma formatação extra encontrada", a tabela já está limpa.

---

### Bom saber

* Nada é salvo sem você: a janela muda só o que está no editor aberto. **Revise e salve** o documento.
* Cabeçalho, título e rodapé do tipo de documento não são editáveis, e a janela avisa.
* O tamanho e o alinhamento do texto dependem dos estilos de tabela que o seu órgão cadastrou para aquela parte do documento.
* Para estilos prontos com outras cores, veja também [Adicionar estilo à tabela](../pages/ESTILOTABELA.md). Para criar uma tabela simples em dois cliques, veja [Tabela rápida](../pages/TABELARAPIDA.md).

### Como ativar

O botão aparece sempre na barra do editor do **SEI 5** quando o SEI Pro está instalado.

> Função contribuída pelo IPPLAM (Maringá/PR). Veja os [Créditos](../CREDITOS.md).

## Próximo item

> [Alinhar o texto à esquerda, ao centro, à direita ou justificado](../pages/ALINHARTEXTO.md)
