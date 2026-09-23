# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Estúdio de Fluxo](../img/icon-fluxos.png) Estúdio de Fluxo

Mapeie o **rito da sua unidade** — a sequência de documentos que um tipo de processo costuma percorrer — e o SEI Pro passa a dizer em que etapa cada processo está e a sugerir, no painel do Agente de IA, qual costuma ser a próxima providência.

> **A detecção é 100% local.** A comparação entre o fluxo e a árvore do processo é feita no seu navegador, sobre o que já está na tela. Nenhum conteúdo de documento é lido, e nada sai do seu computador sem um clique seu.

### O problema

Todo mundo na unidade sabe que a Nota Técnica costuma ser seguida de um Despacho de aprovação, e que um Ofício-MINUTA assinado vira Ofício expedido. Mas esse conhecimento não está escrito em lugar nenhum: mora na cabeça de quem tem tempo de casa. Quem chega, aprende errando; quem já está, esquece um passo num processo entre trinta.

O Estúdio de Fluxo é onde esse rito se escreve.

### O que é um fluxo

Um fluxo tem um **nome**, diz **a que processos se aplica** e lista as **etapas**, em ordem:

| Etapa | O documento que a caracteriza |
| ----- | ----------------------------- |
| 1. Nota Técnica | título contém "Nota Técnica" ou "NT", **assinado** |
| 2. Despacho de aprovação | título contém "Despacho" |
| 3. Ofício | título contém "Ofício" |

Cada etapa pode ainda ser **opcional** (não gera aviso quando falta), ter um **prazo** e trazer um **pedido ao agente** — o texto que o botão **Preparar** envia quando você aceita a sugestão.

O casamento é pelo **título como ele aparece na árvore**, sem acento e sem diferença de maiúsculas. Como os títulos mudam de órgão para órgão, cada etapa aceita **uma lista de variações**: "Nota Técnica" numa linha, "NT" na outra. Basta uma delas casar.

### Como abrir

| Onde | O que acontece |
| ---- | -------------- |
| Barra de ações da tela **Controle de Processos**, ao lado do Agente de IA | Abre o Estúdio numa aba nova |

O Estúdio é uma **aba em tela cheia**, e não um painel lateral: o navegador mostra um painel por vez, e abri-lo ali fecharia o agente.

### Escrever um fluxo à mão

1. Clique em **Novo fluxo** e dê um nome a ele ("Contrato de transição");
2. Em **Quando este fluxo se aplica**, diga o que o tipo do processo precisa conter (e, se quiser, o marcador e as unidades). Sem nenhum critério, o fluxo vale para qualquer processo aberto na tela;
3. Acrescente as etapas na ordem, uma por documento do rito. Em cada uma, liste as variações do título e diga se ela só vale com o documento assinado;
4. Opcionalmente, escreva o **pedido ao agente** da etapa — ele pode citar uma [skill](../pages/AGENTEIA.md) (`/despacho`) para a minuta sair no padrão da unidade;
5. Ligue o fluxo e **salve**.

Fluxo novo nasce **desligado**: só fluxo ligado sugere.

### Aprender de um processo modelo

Se um processo já percorreu o rito inteiro, o Estúdio pode ler esse processo e **propor** o fluxo.

1. Clique em **Aprender de processo modelo**;
2. Informe os números dos processos, um por linha;
3. O Estúdio lê da árvore apenas os **metadados** — os títulos dos documentos na ordem, a unidade geradora, se estão assinados, quais são anexos — e o histórico de andamentos. **O conteúdo dos documentos não é lido nem enviado**;
4. Uma chamada ao serviço de IA separa **etapa do rito** de **documento acessório** (anexo, comprovante, e-mail, despacho de mero encaminhamento) e devolve a sequência;
5. A proposta abre no editor, **desligada**, para você conferir, corrigir e salvar.

**Dois ou três processos rendem um fluxo muito melhor.** Com um só, não há como distinguir o rito do que aconteceu naquele caso — e o Estúdio diz isso. Com mais de um, ele mostra também **o que divergiu** entre eles ("em 2 de 3 veio Despacho antes do Ofício").

> **Precedente não é norma.** Um fluxo aprendido é a leitura do que *foi feito*, não do que *deveria ser feito*. Por isso nada entra ligado, e cada fluxo guarda de que processos veio.

### A sugestão

Com um fluxo ligado, ao abrir um processo que se aplica **e com o painel do Agente de IA aberto**, aparece um cartão no topo da conversa:

> Nestes autos, o último documento do rito é Nota Técnica 55 (0123456), assinado. O fluxo "Contrato de transição" prevê Despacho de aprovação depois dele, e não há Despacho de aprovação na árvore — talvez seja a próxima providência.

O cartão fala só de **estrutura**: que documento existe, qual não existe e em que ordem. Ele não afirma nada sobre o conteúdo dos documentos, porque não leu o conteúdo. E traz quatro botões:

| Botão | O que faz |
| ----- | --------- |
| **Preparar** | Envia ao agente o pedido escrito naquela etapa, como se você tivesse digitado. A minuta passa pelo cartão de aprovação de sempre |
| **Ver detalhes** | Mostra as etapas já cumpridas, com os números dos documentos, e a que falta |
| **Ignorar neste processo** | Some com a sugestão daquela etapa **só** naquele processo |
| **Não sugerir este fluxo** | Desliga o fluxo inteiro. Dá para ligar de novo no Estúdio |

Enquanto há sugestão, um **ponto discreto** aparece no ícone do Agente de IA, na barra do SEI.

### Sem chave de IA

O Estúdio funciona **sem** o Agente de IA configurado: mapear, editar, reordenar, ligar, desligar e excluir fluxos é tudo local, e as sugestões aparecem normalmente. Só duas coisas precisam da chave, e elas explicam isso quando você clica: **Preparar** (que escreve a minuta) e **aprender de processo modelo**.

### Como ativar

A função vem **ligada** de fábrica. Ela fica nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Editor de Texto**, opção **Estúdio de Fluxo**.

### Bom saber

* **Uma sugestão por processo.** Vale o primeiro fluxo ligado que se aplica, e só a primeira etapa obrigatória que falta;
* **A ordem da árvore é cronológica.** Um Despacho que já estava nos autos *antes* da Nota Técnica não cumpre a etapa que vem *depois* dela;
* **Documento cancelado não cumpre etapa**, e documento de processo **sigiloso** nunca é avaliado nem sugerido;
* **Duas etapas com títulos parecidos precisam de algo que as distinga.** No rito "Ofício-MINUTA assinado → Ofício expedido", as duas etapas casariam o mesmo "Ofício": a primeira consome o documento e a segunda parece faltar. Use a variação completa do título ("Ofício-MINUTA") ou a exigência de assinatura para separá-las;
* A avaliação só roda com o **painel do agente aberto**, e sobre a árvore que já está na tela: ela **não faz nenhuma requisição** ao SEI;
* **Processo com pastas: abra as pastas.** Como a avaliação lê a árvore que está na tela, e o SEI só carrega o conteúdo de uma pasta quando você a abre, um processo com pastas fechadas é visto pela metade — e aí o fluxo simplesmente não sugere nada, sem avisar. Num processo de fiscalização com seis pastas, por exemplo, a árvore na tela mostra 16 itens dos 111 que ele tem;
* Os fluxos ficam guardados **só neste navegador**. Ainda não há como compartilhá-los com a equipe — está previsto;
* O fluxo descreve o que a sua unidade **costuma** fazer. Quem decide o que fazer em cada processo continua sendo você.

## Próximo item

> [Gerar Certidão de Documento Oficial com Sigilo (LAI e LGPD)](../pages/CERTIDAOSIGILO.md)
