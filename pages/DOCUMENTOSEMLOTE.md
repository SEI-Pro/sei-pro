# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Ações em Lote](../img/icon-acoeslote.png) Documentos em Lote

Essa ferramenta adiciona ao SEI a funcionalidade de inserção de documentos em lote em um processo utilizando um arquivo .CSV como base de dados.

> ![Tela Estilo de Tabelas](../img/tela-documentoslote.gif) 

Antes de utilizar a extensão propriamente dita, serão necessárias duas preparações prévias, a saber:

No mesmo processo onde ocorrerão as replicações, deverá haver um documento modelo contendo campos dinâmicos seguinte padrão:

`##nome_do_campo##`

1. Utilizando um editor como: MS Excel, Libre Calc, Google Planilhas, produza uma planilha contendo a base de dados onde a extensão buscará os dados para publicação. 

> Os nomes dos cabeçalhos da planilha deverão coincidir exatamente com os nomes inseridos nos campos dinâmicos correspondentes no documento modelo do SEI. 
> 
> A planilha deverá ser salva no formato .CSV

2. Uma vez realizados os preparativos iniciais, basta clicar no ícone da ferramenta (), localizado na barra de ícone da tela inicial do processo;

3. Selecione o documento modelo previamente preparado para ser replicado;

4. Na próxima janela será mostrada a análise do documento modelo identificando os campos dinâmicos detectados. Caso esteja conforme esperado clique em “OK”;

> Selecione planilha no formato `.CSV` previamente preparada para ser a base de dados da replicação;

5. Na próxima janela será mostrada a análise da planilha de base identificando os cabeçalhos detectados e a quantidade de registros. Caso esteja conforme esperado, clique em “OK”;

6. Na próxima tela verifique o cruzamento de dados entre Base de Dados X Documento Modelo. 

> É também possível selecionar quais nomes os documentos receberão na árvore de processo, caso o tipo de documento a ser replicado exija a inserção de um nome através do campo “Número”, presente no formulário de inserção de novo documento.
> 
> Existe uma tratativa de caracteres especiais (letras acentuadas, símbolos, etc.) na escolha no nome dos documentos na árvore, uma vez que a codificação adotada pelo SEI não é um padrão seguido mundialmente na Web. 
> 
> Para tanto, ao serem detectados caracteres deste tipo nos nomes, será apresentado uma mensagem ao usuário informando esta condição e requerendo sua autorização para proceder.

7. Ao confirmar a tela anterior, e não houverem erros no procedimento, será aberta uma janela que indicará o progresso da replicação. 

8. Finalizado o procedimento, a tela será atualizada e os novos documentos aparecerão na árvore. 

## Próximo item

> [Inserir ...](../pages/PAGE.md)
