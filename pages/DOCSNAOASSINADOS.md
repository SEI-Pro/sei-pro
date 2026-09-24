# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Documentos não assinados](../img/icon-docsnaoassinados.png) Alertar sobre documentos não assinados ao enviar um processo

É comum enviar um processo e só depois perceber que um documento da unidade ficou sem assinatura. Com esta função, ao abrir a tela **Enviar Processo**, o SEI Pro **confere os documentos da sua unidade** e avisa se algum ainda não foi assinado — antes de o processo sair.

> ![Tela Documentos não assinados](../img/tela-docsnaoassinados.gif)

### Como funciona

Ao abrir **Enviar Processo**, aparece no alto do formulário uma das mensagens:

| Mensagem | Significado |
| -------- | ----------- |
| *Verificando documentos não assinados na unidade...* | A conferência está em andamento |
| *Todos os documentos foram assinados na unidade* | Pode enviar |
| *Existem documentos não assinados na unidade* | Há pendência. Clique em **Detalhes** para ver a lista |
| *Não foi possível verificar...* | A consulta falhou. Clique em **Tentar novamente** |

Quando há pendência, a lista de documentos sem assinatura abre sozinha.

### Opções extras no envio

Na mesma tela, o SEI Pro acrescenta caixas para fazer, junto com o envio:

* **Remover marcadores** do processo na sua unidade;
* **Remover atribuição**;
* **Reabrir processo em data certa** — veja [Reabertura programada](../pages/REABRIRPROCESSOS.md) (quando essa opção está ligada).

### Como ativar

A função vem **ligada** de fábrica. Ela fica nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Árvore e Visualização de Documentos**, opção **Alertar sobre documentos não assinados ao enviar um processo**.

### Bom saber

* São conferidos apenas os documentos **gerados no SEI** (não os externos) e **criados pela sua unidade**.
* O aviso não impede o envio: a decisão continua sendo sua.
* Em processos com muitos documentos, a conferência pode levar alguns segundos.

### Destacar na árvore os documentos não assinados

Para não depender da tela de envio, o SEI Pro também pode **destacar na árvore do processo** os documentos que a sua unidade criou e ainda não assinou. O nome do documento ganha um fundo âmbar suave, com um filete na lateral, e ao passar o mouse aparece *Pendente de assinatura na unidade*. Quando o documento é assinado, a árvore recarrega e o destaque some.

O destaque não se confunde com a cor que o próprio SEI já usa: o nome em marrom-claro indica documento **de outra unidade** ainda não assinado, que você não consegue abrir.

A função vem **desligada** de fábrica. Para ativar, vá às [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Árvore e Visualização de Documentos**, opção **Destacar na árvore os documentos da unidade ainda não assinados**.

* Valem os mesmos critérios do alerta: documentos **gerados no SEI** (não os externos) e **criados pela sua unidade**.
* Funciona no SEI 4 e no SEI 5. No SEI 3, a árvore não informa a unidade que gerou o documento, e nada é destacado.

## Próximo item

> [Numerar documentos na árvore do processo](../pages/NUMERARDOCSARVORE.md)
