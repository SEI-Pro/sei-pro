# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Reabertura programada](../img/icon-reabrirprocessos.png) Reabertura programada de processos

Concluiu um processo que precisa voltar à unidade numa data certa — uma vistoria no ano que vem, a renovação de um contrato? Com esta função, você **agenda a reabertura** e o SEI Pro avisa quando chegar a hora, reabrindo os processos com um clique.

> ![Tela Reabertura programada de processos](../img/tela-reabrirprocessos.gif)

### Como agendar

A reabertura é agendada pelo **Acompanhamento Especial** do processo:

1. Abra o processo e, no painel de informações ao lado da árvore, clique para editar o **Acompanhamento Especial** (ou inclua o processo em um grupo de acompanhamento);
2. Ligue a chave **Reabertura programada?**;
3. Informe a **Data de Reabertura** (dia e hora);
4. Salve. Depois, conclua o processo normalmente.

A data é gravada no campo de observação do acompanhamento especial, num trecho como `["Reabertura": "10/03/2027 08:00"]`.

### Como reabrir

O SEI Pro confere os processos agendados de duas formas:

* **Automaticamente**, ao abrir a tela Controle de Processos, sempre que tiver passado o intervalo configurado (em horas) desde a última verificação;
* **Quando você pede**, pelo ícone **Reabertura Programada de Processos** na barra de ações da tela Controle de Processos. Ao passar o mouse, ele mostra quando foi a última verificação.

Se houver processos com a data vencida, abre-se uma janela com a lista. Deixe marcados os que devem ser reabertos e confirme: eles são reabertos um a um na sua unidade, e uma mensagem avisa quando terminar.

### Como ativar

A função vem **desligada** de fábrica. Para ligar, abra as [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Controle de Processos**, e marque **Reabertura programada de processos**. Logo abaixo, em **Periodicidade de verificação de processos (em horas)**, defina de quantas em quantas horas a verificação automática deve acontecer. Clique em **Salvar** e recarregue o SEI.

### Bom saber

* A reabertura depende de alguém da unidade, com o SEI Pro, abrir a tela Controle de Processos. **Nada acontece com o navegador fechado.**
* Como o agendamento fica no acompanhamento especial, qualquer pessoa da unidade com o SEI Pro vê e pode reabrir os processos.
* Algumas versões do SEI já têm uma reabertura programada própria (menu **Reabertura Programada**). As duas são independentes: o agendamento feito por uma não aparece na outra.

## Próximo item

> [Agrupar, filtrar e ver os processos em quadro (Kanban)](../pages/AGRUPAR.md)
