# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Exportar em planilha](../img/icon-listaprocessos.png) Exportar informações de processos em planilha CSV

Baixa a lista da tela **Controle de Processos** numa planilha (arquivo `.csv`), que abre no Excel, no LibreOffice Calc ou no Google Planilhas. Serve para montar relatórios, conferir o acervo da unidade ou cruzar informações sem copiar processo por processo.

> ![Tela Exportar informações em planilha CSV](../img/tela-listaprocessos.gif)

### Como usar

1. Na tela **Controle de Processos**, marque os processos que deseja exportar. **Se nenhum estiver marcado, todos os processos da tela são exportados**;
2. Clique no ícone ![Exportar](../img/icon-listaprocessos.png) ao lado da caixa **Agrupar processos...**;
3. O arquivo é baixado para o computador.

### O que vem na planilha

| Coluna | Conteúdo |
| ------ | -------- |
| ID | Código interno do processo no SEI |
| Protocolo | Número do processo |
| Link_Permanente | Endereço do processo, sem a chave de acesso temporária — pode ser compartilhado |
| Atribuicao | Pessoa a quem o processo está atribuído |
| Etiqueta / Etiqueta_Descricao | Marcador e o texto do marcador |
| Anotacao / Anotacao_Responsavel | Anotação da unidade e quem a escreveu |
| Ponto_Controle | Ponto de controle |
| Especificacao | Especificação do processo |
| Tipo | Tipo de processo |
| Data_Autuacao / Data_Recebimento / Data_Envio | Datas do processo, com a respectiva descrição |
| Unidade_Envio | Unidade que enviou o processo |
| Documento_Incluido | Avisa quando um documento novo foi incluído ou assinado |
| Observacoes | Observações da unidade |
| Acompanhamento_Especial | Grupo de acompanhamento especial |

### Como ativar

O ícone de exportação faz parte do [agrupamento de processos](../pages/AGRUPAR.md): ele aparece quando a opção **Agrupar lista de processos por marcadores, tipo, responsável ou ponto de controle** está ligada nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md) (ela vem ligada de fábrica).

### Bom saber

* São exportados os processos **recebidos** e, se a tabela estiver visível, os **gerados**.
* Com a paginação do SEI ligada, só a página atual entra na planilha. Para exportar a unidade inteira, ligue [Remover paginação de processos](../pages/REMOVEPAGINACAO.md).
* As datas de recebimento, envio e autuação são as mesmas usadas pelo agrupamento. Se ainda não tiverem sido consultadas, algumas colunas podem sair em branco; escolha um agrupamento por data antes de exportar.
* No SEI 4.1 e no SEI 5, o grupo da coluna **Acompanhamento_Especial** vem da lista **Acompanhamento Especial** da sua unidade. O SEI Pro relê essa lista ao abrir a tela quando a última leitura tem mais de 24 horas ou foi feita em outra unidade, e também sempre que você agrupa por acompanhamento especial. Enquanto a lista não chega, grupos lidos em outra unidade não aparecem. Processo acompanhado sem grupo sai sem valor nessa coluna.
* O arquivo separa as colunas com ponto e vírgula (`;`). Por isso esse caractere é retirado dos textos exportados (marcadores, anotações, especificação, observações, grupo de acompanhamento etc.), para nenhuma linha ficar com as colunas deslocadas.
* Se os acentos aparecerem trocados no Excel, abra o arquivo pela opção **Dados › De Texto/CSV** e escolha a codificação **UTF-8**.

## Próximo item

> [Remover paginação de processos](../pages/REMOVEPAGINACAO.md)
