# Base de Conhecimento em pastas

A tela da **Base de Conhecimento** do SEI ganha uma navegação por **pastas hierárquicas**, no espírito de ferramentas como Confluence e ClickUp, sem mudar a forma como o SEI guarda os itens: os procedimentos continuam sendo os mesmos, com seus anexos e versões.

![Base de Conhecimento em pastas](/img/icon-agruparlista.png)

## Como usar

- O painel **Pastas** aparece à esquerda da lista. Clique numa pasta para ver os itens dela; clique em **Sem pasta** para ver o que ainda não foi organizado.
- Cada pasta com conteúdo tem uma **seta** ao lado do nome: `▸` recolhida, `▾` expandida. As pastas começam **recolhidas**; a seta mostra ou esconde as subpastas e os documentos.
- **+ Nova pasta** cria uma pasta **dentro da pasta selecionada** (com "Sem pasta" ou nada selecionado, cria na raiz). O menu **⋯** de cada pasta tem **Renomear**, **Nova subpasta** e **Excluir**.
- A lista ganha a coluna **Pasta**, que mostra o caminho de cada item. As linhas de outras pastas ficam ocultas quando você seleciona uma pasta (o filtro é de verdade, não é só esmaecer). Ao abrir, **nenhuma pasta fica selecionada** e a tabela mostra todos os itens; ordenar a tabela não seleciona pasta.
- A contagem à direita do nome é o número de **documentos** da pasta e aparece entre parênteses ("Fiscalização (3)").
- **Documentos dentro da pasta**: ao expandir uma pasta, os documentos aparecem na árvore; clicar no nome abre o item no SEI (nova aba).
- Para organizar, **arraste** um documento ou uma pasta para outra pasta (ou para "Sem pasta", que devolve o documento à lista sem pasta; uma pasta solta em "Sem pasta" vai para a raiz). Toda soltura pede **confirmação**; ao mover uma **pasta**, o aviso deixa claro que ela vai com subpastas e itens. Também dá para usar **Mover para…** no documento. Para desfazer um vínculo de item que já não existe no SEI, use **esquecer**.
- O botão **Pastas**, na barra de comandos, alterna entre a visão em pastas e a lista plana.
- **Criar dentro da pasta**: com uma pasta selecionada, clicar em **Nova** (o botão nativo do SEI) faz o item nascer já organizado nela. A tela de cadastro mostra a faixa “Será organizado em: …” com o botão **Não organizar** (cancela a organização, nada é gravado). Ao voltar, o aviso diz onde o documento ficou e oferece **Desfazer**; sem o **"Entendi"**, o item fica em **Sem pasta** e o aviso oferece **Entendi e organizar**.
- **Numeração de pastas**: marque **Numerar pastas** no próprio painel Pastas (ou na aba **Conhecimento** do painel lateral, no ícone da extensão ao lado da barra de endereço) para ver `1. Pasta`, `1.1 Sub-pasta`, `1.1.1 Sub-sub-pasta` na árvore, nos caminhos e na coluna **Pasta**. A numeração é posicional (mover ou reordenar renumera), vale só naquele navegador e não altera o dado compartilhado da unidade.
- A busca do painel **Buscar…** filtra a árvore e a lista pelo título, inclusive pastas que contêm um documento com o termo. A busca do topo do SEI continua filtrando só a tabela.
- Nomear, renomear, confirmar e escolher pasta usam **diálogos no padrão do SEI**; os avisos aparecem numa barra azul no topo, no visual do SEI.

Criar, editar, liberar e excluir **itens** continua sendo feito nas telas do SEI: o SEI Pro só organiza.

## O que fica guardado e onde

- A organização (pastas e vínculos) fica num **Texto Padrão da unidade** chamado `[_SEIPRO_BC_UNIDADE]`, visível a quem tem acesso a esse texto no SEI.
- Na primeira gravação aparece o aviso **"Entendi"**. Sem ele, nada é gravado no SEI.
- A árvore é **da unidade**: quem usa o SEI Pro na mesma unidade vê e edita a mesma organização.
- Duas pessoas organizando ao mesmo tempo: vence a alteração mais recente **por pasta ou por vínculo**, e nada é perdido (a sincronia relê antes de gravar).
- Excluir uma pasta exclui também as **subpastas** dela; os itens de todas elas voltam para **Sem pasta** e **continuam no SEI** (o SEI Pro nunca exclui itens da Base de Conhecimento). A confirmação avisa disso antes de excluir.

## Problemas comuns

- **"Indisponível nesta unidade"**: o seu perfil lê, mas o SEI não deixa alterar Texto Padrão nesta unidade. A árvore fica em modo leitura.
- **A pasta não aparece para um colega**: confira se ele usa o SEI Pro na mesma unidade e se o Texto Padrão `[_SEIPRO_BC_UNIDADE]` existe.
- **Um item sumiu da pasta**: se o item foi excluído no SEI, o vínculo fica órfão (riscado). Use **esquecer**.

## Privacidade

O texto da organização guarda apenas **identificadores e títulos** dos procedimentos e a estrutura de pastas — nenhum conteúdo, anexo ou dado de processo. O SEI Pro não envia nada para servidor próprio; a sincronia acontece dentro do próprio SEI, pela sua sessão. Veja a [Política de Privacidade](../PRIVACY_POLICY.md).
