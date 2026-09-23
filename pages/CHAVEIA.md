# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![Chave do serviço de IA](../img/icon-agenteia.png) Como obter a chave do serviço de IA

O [Agente de IA](../pages/AGENTEIA.md) trabalha com o serviço de inteligência artificial que **você** escolher, usando uma **chave de API** sua. Esta página mostra, passo a passo, como conseguir essa chave em cada serviço.

> **Por que a chave é sua.** O SEI Pro não tem servidor: as mensagens vão do seu navegador direto para o serviço escolhido, e a chave fica guardada só neste navegador. Ninguém — nem o SEI Pro, nem o seu órgão — paga ou vê o que você pergunta. Em compensação, o custo do uso é cobrado de você pelo serviço.

**Antes de escolher**, confira com a área de TI ou com a autoridade de dados do seu órgão se o uso daquele serviço é permitido. As perguntas e os trechos de documentos que o agente precisa entender saem do órgão.

| Serviço | Cadastro | Bom para |
| ------- | -------- | -------- |
| [OpenRouter](#openrouter) | Uma conta só | Quem quer **começar**: dá acesso a modelos de vários fabricantes, mostra o preço de cada um e é a única opção em que o agente exige provedor que não guarde os dados |
| [OpenAI](#openai) | Conta na OpenAI | Quem já usa a API da OpenAI (GPT) |
| [Gemini](#gemini) | Conta Google | Quem já usa o Google AI Studio; tem faixa gratuita |
| [Anthropic](#anthropic) | Conta na Anthropic | Quem já usa a API do Claude |
| [Outro serviço compatível](#outro-servico-compativel) | Depende do serviço | Servidor **do próprio órgão**, NVIDIA, Groq ou um modelo na sua máquina |

Em todos os casos, o caminho no SEI Pro é o mesmo: abra o painel do agente, clique no ícone de **configuração** (⚙), escolha o **serviço**, cole a **chave** e escolha o **modelo** — a lista de modelos é carregada do próprio fabricante.

> **Guarde a chave como guarda uma senha.** Ela dá acesso à sua conta no serviço e gasta o seu saldo. Não compartilhe, não cole em documento do SEI e não use a chave de outra pessoa ou do órgão sem autorização.

### OpenRouter

É o caminho recomendado e o padrão do agente.

1. Acesse [openrouter.ai](https://openrouter.ai) e crie a conta (dá para entrar com Google ou GitHub);
2. Adicione créditos em **Credits** — o OpenRouter é pré-pago e funciona a partir de poucos dólares;
3. Vá em [openrouter.ai/keys](https://openrouter.ai/keys) e clique em **Create key**. Dê um nome (por exemplo, "SEI Pro") e, se quiser, um limite de gasto;
4. Copie a chave (começa com `sk-or-v1-`) — ela só aparece uma vez;
5. No SEI Pro: configuração do agente → serviço **OpenRouter** → cole a chave → escolha o modelo na lista.

A lista do OpenRouter já vem filtrada: só aparecem modelos que sabem usar ferramentas, com o preço em dólares por milhão de tokens (entrada / saída).

> **Política de dados.** O agente envia, em todo pedido ao OpenRouter, a exigência de que o provedor **não guarde nem treine** com o conteúdo. Se aparecer a mensagem "nenhum provedor deste modelo passa pela política de dados", confira também as preferências da sua conta em [openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy) ou escolha outro modelo.

### OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com) e entre com a sua conta;
2. Em **Billing**, adicione um método de pagamento e créditos. A API é cobrada à parte: **assinar o ChatGPT não dá acesso à API**;
3. Vá em [platform.openai.com/api-keys](https://platform.openai.com/api-keys) e clique em **Create new secret key**;
4. Copie a chave (começa com `sk-`) — ela só aparece uma vez;
5. No SEI Pro: configuração do agente → serviço **OpenAI** → cole a chave → escolha o modelo.

Na primeira vez, o navegador pede a sua autorização para o agente falar com `api.openai.com`. Sem ela, a lista de modelos não carrega.

### Gemini

1. Acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey) e entre com a sua conta Google;
2. Clique em **Criar chave de API** e escolha o projeto do Google Cloud (ou deixe criar um);
3. Copie a chave (começa com `AIza`);
4. No SEI Pro: configuração do agente → serviço **Google Gemini** → cole a chave → escolha o modelo.

O Gemini tem uma faixa de uso gratuita, útil para experimentar. **Atenção:** na faixa gratuita o Google pode usar o conteúdo enviado para melhorar os produtos dele — para uso com documentos do SEI, prefira a faixa paga e confirme os termos vigentes.

### Anthropic

1. Acesse [console.anthropic.com](https://console.anthropic.com) e crie a conta;
2. Em **Billing**, adicione créditos (também é pré-pago);
3. Vá em **Settings → API keys** ([console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)) e clique em **Create key**;
4. Copie a chave (começa com `sk-ant-`);
5. No SEI Pro: configuração do agente → serviço **Anthropic** → cole a chave → escolha o modelo.

O agente conversa com a Anthropic pela camada compatível com OpenAI que ela publica, e informa ao serviço que a chamada vem de um navegador — nada disso precisa ser configurado por você.

### Outro serviço compatível {#outro-servico-compativel}

Serve para qualquer endereço que fale o protocolo da OpenAI: um servidor de modelos **do próprio órgão**, NVIDIA, Groq, ou um modelo rodando na sua máquina com Ollama.

1. Descubra o endereço da API (quase sempre termina em `/v1`) e a chave, com quem administra o serviço;
2. No SEI Pro: configuração do agente → serviço **Outro serviço compatível** → informe o endereço, a chave e o nome do modelo;
3. Clique em **Atualizar** para tentar carregar a lista de modelos daquele servidor — nem todo serviço oferece essa lista, e nesse caso o nome do modelo é digitado.

Num servidor do próprio órgão, o conteúdo não sai da rede interna — é a opção mais conservadora do ponto de vista de dados.

> **Nem todo modelo serve.** O agente trabalha chamando ferramentas, e só parte dos modelos sabe fazer isso. Se o agente conversar mas não conseguir agir no SEI, troque de modelo.

### Quanto custa

Cada serviço cobra por uso, contado em *tokens* (pedaços de palavra) que entram e saem do modelo. O painel do agente mostra, no topo, quanto a conversa em curso consumiu, **em reais**, convertidos pela cotação do dia (PTAX do Banco Central).

Na prática: uma pergunta simples custa centavos; ler documentos longos custa mais, porque o texto inteiro vai para o modelo. Modelos "mini", "flash", "nano" e "haiku" são bem mais baratos e resolvem a maior parte das tarefas do dia a dia.

### Se a chave não for aceita

| O que aparece | O que costuma ser |
| ------------- | ----------------- |
| "A chave não foi aceita" | Chave copiada pela metade, de outro serviço, ou já revogada — gere outra |
| "Sem crédito para este modelo" | Falta saldo na conta do serviço |
| "O navegador não autorizou o agente a falar com esse endereço" | A permissão foi recusada; abra a configuração de novo e aceite quando o navegador perguntar |
| A lista de modelos não carrega | Clique em **Atualizar**, ao lado do seletor de modelo — é o clique que permite ao navegador pedir a autorização |
| "Muitas requisições agora" | Limite de uso do serviço; espere alguns segundos |

## Próximo item

> [Agente de IA](../pages/AGENTEIA.md)
