# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Enviar documentos](../img/icon-uploaddocs.png) Enviar múltiplos documentos externos

Para juntar um PDF a um processo, o SEI pede um formulário por arquivo. Com o SEI Pro, basta **arrastar os arquivos para a árvore do processo**: eles são enviados de uma vez, com o tipo, a data e o nome já preenchidos a partir do próprio arquivo.

> ![Tela Enviar documentos](../img/tela-uploaddocs.gif)

### Como usar

1. Abra o processo;
2. **Arraste um ou vários arquivos** do computador para cima da árvore de documentos;
3. Acompanhe o envio: cada arquivo mostra uma barra de progresso e, ao final, o número SEI gerado;
4. A árvore é atualizada com os novos documentos.

### Como os campos são preenchidos

| Campo do SEI | De onde vem |
| ------------ | ----------- |
| **Tipo do documento** | Do início do nome do arquivo, quando ele coincide com um tipo aceito pelo SEI. Se não coincidir, vale o tipo padrão configurado; se não houver, **Anexo**. Se o seu órgão também não tiver o tipo Anexo, o SEI Pro **pergunta qual tipo usar** para aquele arquivo |
| **Número / Nome na árvore** | O restante do nome do arquivo |
| **Data do documento** | A data da última modificação do arquivo; se não houver, a data de hoje |
| **Formato** | **Nato-digital**, ou o formato configurado nos valores padronizados |
| **Nível de acesso** | **Público**, ou o nível e a hipótese legal configurados nos valores padronizados |

Exemplos:

| Nome do arquivo | Tipo | Nome na árvore |
| --------------- | ---- | -------------- |
| `Relatório de Gestão.pdf` | Relatório | de Gestão |
| `Ofício 32-2026.pdf` | Ofício | 32-2026 |
| `Captura de Tela.png` | Anexo | Captura de Tela |

Os valores usados quando o arquivo não informa nada são definidos em [Valores padronizados ao criar documentos](../pages/VALDEFAULT.md).

### Quando o tipo não é identificado

Se o nome do arquivo não começa com um tipo de documento, não há tipo padrão configurado e o órgão não usa o tipo **Anexo**, o envio daquele arquivo **pausa** e abre a caixa **Tipo do documento**:

* escolha o tipo na lista e clique em **Enviar** — o arquivo entra com o tipo escolhido e o envio segue com os próximos arquivos;
* ou clique em **Cancelar envio** (ou feche a caixa) — aquele arquivo **não é enviado** e sai da lista; os demais continuam.

Na ferramenta **Enviar documentos em processos**, a escolha feita para um arquivo vale para ele em todos os processos marcados.

Para não precisar escolher, comece o nome do arquivo pelo tipo desejado (por exemplo, `Laudo da vistoria.pdf`) ou preencha o **Nome padrão do documento externo na árvore**, em [Valores padronizados](../pages/VALDEFAULT.md), com o nome de um tipo do seu órgão.

### Conferir e ordenar antes de enviar

Por padrão, o envio começa assim que você solta os arquivos. Se preferir **revisar a lista e escolher a ordem** em que os documentos entram na árvore:

1. Nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), ligue **Ordenar documentos na árvore antes de enviar (Não enviar automaticamente)** — ela aparece logo abaixo da opção desta função;
2. Solte os arquivos na árvore;
3. Arraste os itens da lista para a ordem desejada e confirme o envio.

> ![Tela Ordenar antes de enviar](../img/tela-uploaddocs2.gif)

### O mesmo arquivo em vários processos

Na tela **Controle de Processos**, marque vários processos e use o botão **Enviar documentos em processos** para juntar os mesmos arquivos a todos eles — veja [Novos botões na barra de ações](../pages/BARRAACOES.md).

### Como ativar

A função vem **ligada** de fábrica. Ela fica nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Árvore e Visualização de Documentos**, opção **Enviar Múltiplos Documentos Externos**.

### Bom saber

* Valem as **regras do seu órgão** para documentos externos: extensões aceitas e tamanho máximo. Um arquivo fora dessas regras é recusado com a mensagem do SEI.
* Muitos órgãos **não aceitam** arquivos do Word ou Excel (`.doc`, `.docx`, `.xls`, `.xlsx`). Converta para PDF antes.
* Precisa reduzir, dividir ou tarjar o PDF antes de juntar? Use as [Ferramentas de PDF](../pages/FERRAMENTASPDF.md).
* Acentos e caracteres especiais no nome do arquivo são simplificados no envio.
* No **nome do documento na árvore**, os acentos são mantidos, mas os caracteres que o SEI não aceita, comuns em arquivos salvos pelo Word, são trocados pelo equivalente simples: o travessão (—) vira hífen (-) e as aspas curvas (“ ”) viram aspas retas (").

## Próximo item

> [Valores padronizados ao criar processos e documentos](../pages/VALDEFAULT.md)
