# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Agente de IA](../img/icon-agenteia.png) Agente de IA

Um agente de inteligência artificial que trabalha **dentro do SEI**, pela sua própria sessão: pergunte em português e ele consulta processos, lê documentos, resume, pesquisa — e, quando o pedido é para alterar alguma coisa, mostra antes o que vai mudar e só age depois que você aprova.

> ![Tela do Agente de IA](../img/tela-agenteia.gif)

> **Atenção:** as perguntas e os trechos de documentos que o agente precisa entender são enviados ao serviço de IA que **você** escolher, fora do seu órgão. Antes de usar, verifique se o seu órgão permite. O agente **nunca** atua em processos sigilosos, e documentos restritos só são lidos com a sua autorização.

### O que ele faz

| Consulta | Escrita (sempre com aprovação) |
| -------- | ------------------------------ |
| Listar a sua caixa de trabalho | Alterar tipo, especificação, interessados e nível de acesso |
| Consultar processo, árvore e histórico | Anotar, marcar, atribuir e acompanhar |
| Ler documentos, inclusive PDF | Registrar andamento, concluir e reabrir |
| Pesquisar processos e documentos do órgão | Criar documento e escrever o conteúdo |
| Ler o documento aberto no editor | Assinar, enviar para outra unidade, excluir, cancelar, dar ciência |

Alguns exemplos do que dá para pedir:

* *"Resuma este processo: objeto, partes, principais atos e situação atual."*
* *"Quais documentos ainda não foram assinados?"*
* *"Explique em linguagem simples o documento que estou vendo."*
* *"Liste os processos da minha unidade agrupados por marcador e aponte os parados."*
* *"Marque este processo como urgente e anote que aguarda parecer."*
* *"Crie um Despacho encaminhando o processo à unidade X, com o texto abaixo."*

### Como abrir

| Onde | O que acontece |
| ---- | -------------- |
| Barra de ações da tela **Controle de Processos** | Abre o painel lateral do navegador |
| Barra de ações da **árvore do processo** | Idem, já sabendo em que processo você está |
| **Menu lateral** do SEI › Agente de IA | Acesso de qualquer tela |
| Barra do **editor de documentos** › botão de IA | Abre o painel para trabalhar sobre o documento aberto |

O agente vive num **painel lateral**, ao lado do SEI: você continua vendo o processo enquanto conversa.

### Primeiro uso

1. Abra o agente e informe a **chave de API** do serviço de IA (veja abaixo);
2. Escolha o **modelo**;
3. Clique em **Salvar e começar**.

A chave fica guardada **só neste navegador**. O SEI Pro não tem servidor: as mensagens vão do seu navegador direto para o serviço escolhido, e o SEI Pro não as vê.

#### Qual serviço de IA

| Serviço | Quando usar |
| ------- | ----------- |
| **OpenRouter** (padrão) | Caminho recomendado: um cadastro dá acesso aos modelos de vários fabricantes, com preço por modelo e custo por pergunta. O agente ainda exige que o provedor **não guarde nem treine** com o que recebe |
| **Compatível com OpenAI** | Para quem já tem outro serviço: NVIDIA, Groq, um modelo rodando na própria máquina (Ollama) ou **um servidor do próprio órgão** — nesse caso o conteúdo não sai da rede interna |

Para o OpenRouter, crie a chave em [openrouter.ai/keys](https://openrouter.ai/keys) e adicione créditos. No modo compatível, informe o endereço da API (termina em `/v1`), a chave e o nome do modelo; o navegador vai pedir a sua autorização para falar com aquele endereço.

> **Nem todo modelo serve.** O agente trabalha chamando ferramentas, e só parte dos modelos sabe fazer isso. No OpenRouter a lista já vem filtrada. Fora dele, se o agente conversar mas não conseguir agir no SEI, troque de modelo.

### Nada é alterado sem a sua aprovação

Quando o pedido implica mexer no processo, o agente **não executa**: ele monta um cartão com o que pretende fazer, item a item, mostrando o valor de antes e o de depois. Nada acontece enquanto você não clicar em **Aprovar e executar**.

> ![Cartão de aprovação](../img/tela-agenteia2.gif)

* Ações **irreversíveis** — enviar processo, excluir ou cancelar documento, cancelar assinatura — exigem, além da aprovação, marcar que você entendeu que não dá para desfazer;
* **Assinar** pede o cargo e a sua senha do SEI no próprio cartão. A senha vai do painel direto para o SEI: ela **não** é enviada ao modelo de IA nem guardada;
* **Recusar** pede, opcionalmente, o que ajustar — e o agente tenta de novo com a sua correção.

### O que o agente não faz

* **Processo sigiloso:** o agente não carrega. Estando você num processo sigiloso, ele se recusa a responder qualquer coisa;
* **Documento restrito:** o conteúdo só é lido depois que você autoriza, uma vez por conversa;
* **Sua senha do SEI** nunca é enviada ao modelo;
* **Números de processo e documento** não são mascarados (o agente precisa deles), mas **dados pessoais são** — veja abaixo.

### Dados pessoais saem mascarados

Antes de qualquer texto sair do navegador, o agente troca por rótulos o que reconhece como dado pessoal: CPF, CNPJ (opcional), e-mail, telefone, CEP, RG, título de eleitor, CNH, cartão, chave PIX, data de nascimento, endereço, filiação, conta bancária e CID. O modelo recebe `[CPF_1]`, `[PESSOA_2]` — e não o dado.

Os nomes dos interessados do processo também são mascarados (dá para desligar nas configurações). Quando o agente precisa escrever algo no SEI, o dado real volta no lugar do rótulo, já dentro do seu navegador.

### Conversas guardadas

O relógio no topo do painel guarda as conversas anteriores: dá para reler, **exportar em Markdown** e apagar (uma ou todas). O prazo de guarda é configurável — 7, 30, 90 dias ou sem limite — e o recurso pode ser desligado.

> ![Conversas guardadas](../img/tela-agenteia3.gif)

Fica guardada **só a transcrição** — o que apareceu na tela. O histórico enviado ao modelo e a tabela que liga os rótulos aos dados reais somem quando o navegador fecha. É por isso que uma conversa guardada abre **só para leitura**: continuar exigiria justamente o que não foi gravado.

### Quanto custa

O SEI Pro é gratuito e não cobra nada pelo agente. O custo é o do serviço de IA que você escolher, cobrado diretamente por ele. O painel mostra, no topo, quanto a conversa em curso consumiu — **em reais**, convertidos pela cotação do dia do dólar (PTAX do Banco Central; passando o mouse, aparece o valor original e a cotação usada). Nas configurações dá para desligar a conversão e ver em dólares. Quando o serviço não informa custo, o painel mostra tokens.

Uma consulta simples costuma custar centavos de dólar. Ler documentos longos custa mais, porque o texto inteiro vai para o modelo.

### Como ativar

A função vem **ligada** de fábrica. Ela fica nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Editor de Texto**, opção **Agente de Inteligência Artificial**.

### Bom saber

* **A IA erra** — inclusive com aparência de certeza. Confira toda resposta antes de usar. O conteúdo de um documento assinado é de responsabilidade do agente público que o assina;
* O agente só enxerga o que **você** enxerga: ele usa a sua sessão do SEI e as suas permissões. Não há acesso a processo que você não poderia abrir;
* Toda alteração feita pelo agente entra no SEI **em seu nome**, e aparece no histórico do processo como qualquer outra;
* O agente lê PDF digitalizado com o OCR que vem na extensão, limitado às primeiras páginas. Para documentos longos, use as [Ferramentas de PDF](../pages/FERRAMENTASPDF.md);
* O SEI Pro **não intermedeia** as mensagens e não recebe financiamento de nenhum serviço de IA.

## Próximo item

> [Gerar Certidão de Documento Oficial com Sigilo (LAI e LGPD)](../pages/CERTIDAOSIGILO.md)
