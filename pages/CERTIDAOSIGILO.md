# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Certidão Sigilo](../img/icon-certidaosigilo.png) Gerar Certidão de Documento Oficial com Sigilo

Quando um documento tem **partes protegidas por sigilo** — dados pessoais, informações comerciais —, a Lei de Acesso à Informação garante o acesso ao restante do conteúdo por meio de **certidão, extrato ou cópia com a parte sigilosa ocultada**. Esta função gera essa certidão no próprio SEI, com um clique.

> ![Tela Certidão com sigilo](../img/tela-certidaosigilo.gif)

A [Lei nº 12.527, de 18 de novembro de 2011](http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm), estabelece no art. 7º, § 2º:

> Quando não for autorizado acesso integral à informação, por ser ela parcialmente sigilosa, é assegurado o acesso à parte não sigilosa por meio de certidão, extrato ou cópia com ocultação da parte sob sigilo.

### Como usar

1. Na árvore do processo, clique no documento original — ele precisa ser **gerado no SEI** e estar **assinado**;
2. Na barra de botões do documento, clique em **Gerar Certidão de Documento Oficial com Sigilo**;
3. O SEI Pro cria um novo documento — a certidão — com uma **cópia fiel do conteúdo** do original;
4. No editor, selecione os trechos sigilosos e use o botão de **tarja** da barra do editor para ocultá-los (veja [Marcas de sigilo e tarjas](../pages/SIGILODOC.md));
5. Salve e assine a certidão.

Ao assinar, o servidor atesta com fé pública que a certidão é cópia fiel do original, com a ocultação **apenas** das informações protegidas por lei. A certidão passa a existir ao lado do documento integral, que continua restrito.

### Configuração

Nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Árvore e Visualização de Documentos**:

| Opção | Para que serve |
| ----- | -------------- |
| **Gerar Certidão de Documento Oficial com Sigilo** | Liga ou desliga o botão. Vem **ligada** de fábrica |
| **Nome do tipo de documento do SEI da Certidão** | O tipo de documento que será usado para criar a certidão — por exemplo, *Certidão*. Deve ser um tipo que exista no SEI do seu órgão |

### Bom saber

* A cópia do conteúdo original dentro da certidão fica **bloqueada para edição**: o servidor que certifica só consegue **acrescentar tarjas**, e não alterar o texto.
* O botão só aparece em documentos **gerados no SEI e assinados**.
* Nas tarjas, o texto ocultado é **substituído** — ele não fica escondido por baixo, e não pode ser recuperado a partir da certidão.
* Para tarjar arquivos PDF (documentos externos), use [Tarjar PDF, nas Ferramentas de PDF](../pages/FERRAMENTASPDF.md).

## Próximo item

> [Abrir em nova aba e baixar documento em Word ou HTML](../pages/BAIXARDOCUMENTO.md)
