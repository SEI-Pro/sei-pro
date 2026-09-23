# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Instalação manual](../img/icon-32.png) Instalar sem a loja, pelo pacote do GitHub

O caminho normal é a loja do navegador: ela instala, atualiza sozinha e não pede nada de você. Esta página é para quando esse caminho não existe.

| Navegador | Loja |
| --------- | ---- |
| Google Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/sei-pro/pdbbapplhjopafpgidbgceccbbmehcjj) |
| Microsoft Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/sei-pro/gkhfbbbminanojfklpfmloaglckmlfne) |

Motivos comuns para instalar à mão: o órgão bloqueia a loja de extensões no computador de trabalho, você precisa de uma versão anterior, ou quer testar uma versão antes de liberá-la para a equipe. No **Firefox**, enquanto a extensão não estiver publicada na loja de complementos, este é o único caminho.

O pacote sai da [página de versões do GitHub](https://github.com/SEI-Pro/sei-pro/releases/latest) e a instalação leva dois ou três minutos.

### Antes de começar

Três cuidados resolvem a maior parte dos problemas.

**Deixe uma cópia só do SEI Pro ativa.** Se você já tem a extensão instalada pela loja, **remova ou desative** antes de carregar a pasta. Duas cópias na mesma página disputam os mesmos recursos e quebram funções sem dizer por quê — a caixa de seleção que não abre, o erro de política de segurança no console. Desde a versão 1.7.3 o próprio SEI Pro mostra uma barra amarela no topo da tela quando percebe mais de uma cópia ativa.

**As configurações não vão junto.** Cada instalação guarda as suas próprias opções, e o navegador apaga as opções da extensão quando ela é removida. O que você marcou na versão da loja precisa ser marcado de novo na nova.

**Em computador gerenciado pelo órgão, a política pode barrar.** Se o modo de desenvolvedor não liga, ou a extensão aparece como bloqueada pelo administrador, não há ajuste no navegador que resolva: é um pedido para a área de TI.

### Passo 1 — Baixar o pacote

Abra a [página do último release](https://github.com/SEI-Pro/sei-pro/releases/latest) e, na lista **Assets**, baixe o arquivo do seu navegador:

| Navegador | Arquivo |
| --------- | ------- |
| Chrome e Edge | `sei-pro-<versão>.zip` |
| Firefox | `sei-pro-<versão>-firefox.zip` |

> **Os dois têm o mesmo código**, mas não são intercambiáveis: o que muda é o formato do manifesto, e cada navegador só aceita o seu. O pacote do Chrome, carregado no Firefox, é recusado com a mensagem `background.service_worker is currently disabled. Add background.scripts.`

### Passo 2 — Descompactar

O zip precisa ser **descompactado**, e a pasta que sair dele precisa ficar onde está: o navegador lê os arquivos dela toda vez que abre.

* **Windows:** clique com o botão direito no arquivo e escolha **Extrair tudo**. Abrir o zip com dois cliques apenas espia o conteúdo — não serve.
* **macOS:** dois cliques no arquivo.

Guarde a pasta num lugar definitivo — `Documentos\SEI Pro`, por exemplo. Em Downloads, ou na pasta temporária que o Windows usa ao espiar um zip, ela desaparece na primeira limpeza e a extensão para de funcionar junto.

> **A pasta certa é a que contém o arquivo `manifest.json`.** Alguns descompactadores criam uma pasta dentro da outra. Se ao abrir a pasta você vê outra pasta sozinha, é a de dentro que o navegador quer.

### Google Chrome

1. Abra `chrome://extensions` (copie e cole na barra de endereço) ou vá em **⋮ → Extensões → Gerenciar extensões**;
2. Ligue o **Modo do desenvolvedor**, no canto superior direito;
3. Clique em **Carregar sem compactação** (*Load unpacked*), que aparece no canto superior esquerdo;
4. Escolha a pasta do passo 2 e confirme;
5. O cartão **SEI Pro Lab** entra na lista, com o número da versão;
6. Para deixar o ícone à vista, clique na peça de quebra-cabeça na barra do navegador e fixe o SEI Pro;
7. Abra o SEI e **recarregue a página** (F5).

> **O aviso "Desative as extensões do modo de desenvolvedor"** volta a cada vez que o Chrome abre. É do próprio Chrome, e vale para qualquer extensão instalada assim. Feche o aviso: se clicar em **Desativar**, a extensão é desligada e você terá que religá-la em `chrome://extensions`.

### Microsoft Edge

1. Abra `edge://extensions` ou vá em **⋯ → Extensões → Gerenciar extensões**;
2. Ligue o **Modo de desenvolvedor**, na coluna da esquerda;
3. Clique em **Carregar sem pacote** (*Load unpacked*);
4. Escolha a pasta do passo 2 e confirme;
5. O cartão **SEI Pro Lab** entra na lista;
6. Abra o SEI e **recarregue a página** (F5).

> O Edge também instala extensões da Chrome Web Store: na própria loja do Chrome ele oferece **Permitir extensões de outras lojas**. Quando a loja não está bloqueada, esse continua sendo o caminho mais simples.

### Mozilla Firefox

No Firefox use o arquivo `sei-pro-<versão>-firefox.zip`, descompactado como no passo 2.

1. Abra `about:debugging` na barra de endereço;
2. Clique em **Este Firefox**, na coluna da esquerda;
3. Clique em **Carregar extensão temporária…** (*Load Temporary Add-on*);
4. Entre na pasta e selecione o arquivo **`manifest.json`** — aqui se escolhe o arquivo, não a pasta;
5. **SEI Pro Lab** aparece na lista de extensões temporárias;
6. Abra o SEI e **recarregue a página** (F5).

> **É temporária, e isso pesa no dia a dia.** A extensão fica ativa até você **fechar o Firefox**; ao reabrir, é preciso refazer os passos 1 a 4. Assim o Firefox trata toda extensão que não foi assinada pela Mozilla — não é uma limitação do SEI Pro.

O Firefox precisa ser a versão 102 ou mais nova.

### Atualizar para uma versão nova

Extensão instalada desta forma **não se atualiza sozinha**. Quando sair uma versão nova — elas aparecem no [histórico de versões](../pages/HISTORICO.md) —, faça assim:

1. Baixe o zip novo;
2. Apague o conteúdo da pasta antiga e descompacte o novo **na mesma pasta**. Mantendo a pasta, o navegador entende que é a mesma extensão e as suas opções continuam lá;
3. No Chrome ou no Edge, clique no ícone de recarregar do cartão da extensão, em `chrome://extensions` / `edge://extensions`;
4. Recarregue as abas do SEI que estiverem abertas.

No Firefox, basta carregar de novo pelo `about:debugging`.

### Remover

Em `chrome://extensions` ou `edge://extensions`, clique em **Remover** no cartão da extensão. As opções que você marcou são apagadas junto — se pretende reinstalar depois, anote as que usa. No Firefox, fechar o navegador já basta.

### Quando dá errado

| O que aparece | O que é | O que fazer |
| ------------- | ------- | ----------- |
| "Arquivo de manifesto ausente ou ilegível" (*Manifest file is missing or unreadable*) | A pasta escolhida não é a que contém o `manifest.json` | Entre na pasta interna e escolha essa |
| `background.service_worker is currently disabled` no Firefox | É o pacote de Chrome/Edge | Baixe o arquivo terminado em `-firefox.zip` |
| A extensão sumiu depois de reiniciar o computador | A pasta foi apagada ou movida | Descompacte de novo, num lugar definitivo, e carregue outra vez. No Firefox, sumir ao fechar é o comportamento normal |
| Barra amarela no topo do SEI avisando de mais de uma cópia | Duas instalações ativas ao mesmo tempo | Remova ou desative uma delas |
| Os botões do SEI Pro não aparecem no SEI | A aba foi aberta antes da instalação | Recarregue a página (F5) |
| As funções que você usava estão desligadas | As opções não passam de uma instalação para a outra | Abra as opções do SEI Pro e marque de novo |
| "Bloqueado pelo administrador", ou o modo de desenvolvedor não liga | Política do computador gerenciado pelo órgão | Peça à área de TI |

### Por que o nome é "SEI Pro Lab"

O pacote publicado no GitHub é o da versão **Lab**, que sai primeiro para o grupo de testadores. As funções são as mesmas da versão da loja; mudam o nome, o ícone e a lista dos órgãos que têm uma versão própria do SEI Pro. O nome diferente ajuda a distinguir uma da outra quando as duas aparecem na mesma lista — situação que, de todo modo, convém evitar.
