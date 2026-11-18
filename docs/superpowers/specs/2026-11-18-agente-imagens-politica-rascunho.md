# Rascunho: política de privacidade e loja para o `ver_imagem`

Base: `PRIVACY_POLICY.md` do GitHub (origin/master), **versão 3.6, de 25/10/2026**, conferida em 18/11/2026. O remoto é a fonte da verdade desse arquivo, e quem publica é o autor, pela web. Este rascunho não altera a política.

## O que muda de fato

Até aqui, a política diz que só **texto** sai do navegador: o PDF é lido no computador, e o arquivo em si não sai. Com o `ver_imagem`, uma **imagem recortada de um documento** pode ir ao serviço de IA, nestas condições:

- só a pedido do agente durante uma conversa;
- só depois de o usuário ver a miniatura no chat e clicar em **Enviar esta imagem** ou **Enviar as imagens desta conversa**;
- em documento restrito, a pergunta vem a cada imagem, e "desta conversa" não vale;
- nunca de documento sigiloso, nunca em rotina, nunca pelo agente auxiliar;
- a imagem **não passa pela anonimização**, porque o mascaramento trabalha sobre texto.

## Trechos propostos (seção 4.2, Agente de IA)

**Cabeçalho:** Versão 3.7, Última Atualização: data da publicação.

**Em "O que é enviado"**, depois do item "o resultado das consultas…", acrescentar:

> - **imagens de documentos, só com a permissão do usuário:** quando a resposta depende de uma figura (gráfico, mapa, tabela em imagem, foto), o agente pode pedir para vê-la. A figura é recortada no próprio computador e mostrada ao usuário em miniatura. Ela só é enviada se o usuário clicar em "Enviar esta imagem" ou em "Enviar as imagens desta conversa". Em documento restrito, a pergunta é feita a cada imagem. Sem permissão, nada é enviado, e o agente responde sem a figura.

**No primeiro item de "O que é enviado"**, trocar "e **só o texto extraído** é enviado; o arquivo em si não sai do navegador" por:

> e **só o texto extraído** é enviado; o arquivo em si não sai do navegador. Uma figura do documento só sai como imagem nas condições do item "imagens de documentos" abaixo.

**Em "Anonimização" → "Limitação"**, acrescentar ao fim:

> **Imagens enviadas com a permissão do usuário não passam pela substituição:** o que estiver escrito ou fotografado nelas (nome, assinatura, documento de identidade) segue como está. Por isso o painel pede a permissão mostrando a miniatura.

**Em "Sigilo"**, acrescentar:

> - Imagens de documentos sigilosos nunca são enviadas, e as rotinas e o agente auxiliar nunca enviam imagem.

**Em "Outras consultas do painel" → "catálogo de modelos"**, completar:

> a lista pública de modelos do serviço escolhido, também usada para saber se o modelo aceita imagem;

**Em "Conteúdo dos documentos tratado como dado"**, acrescentar ao fim:

> A descrição que o serviço de IA devolve de uma imagem passa pela mesma verificação, e a imagem vai numa chamada separada, sem acesso a nenhuma ferramenta do agente.

## Chrome Web Store (práticas de privacidade)

O que confirmar no painel da loja (não tenho acesso a ele; o que está declarado hoje precisa ser conferido lá):

- **Tipos de dados:** a categoria que cobre o conteúdo das páginas do SEI enviado ao serviço de IA ("Conteúdo do site", *Website content*) já deveria estar marcada, por causa do texto dos documentos. A imagem recortada é conteúdo do site da mesma natureza. Se essa categoria não estiver marcada, ela precisa ser.
- **Justificativa de uso** (sugestão para o campo de texto, se houver um para o Agente): "O Agente de IA envia ao serviço de IA escolhido pelo usuário, com a chave dele, o texto dos documentos que lê para cumprir o pedido e, só quando o usuário permite vendo a miniatura, a imagem de uma figura de documento."
- **Certificações** (não vender dados, não usar para fins não relacionados, não usar para crédito): não mudam.

## Firefox (AMO)

Se a versão do Firefox receber o recurso, a declaração de coleta de dados da AMO segue a mesma lógica. Hoje, a 2.x do Firefox não tem os recursos só do Lab, então não há o que mudar até lá.
