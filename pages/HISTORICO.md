# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Histórico de Versões](../img/icon-historico.png) Histórico de versões

### Versão 2.1
23/09/2026

Versão que ensina o agente a trabalhar do jeito da sua unidade — e a custar menos.

- [Skills](../pages/AGENTEIA.md): instruções próprias da unidade que o agente carrega **só quando o pedido é daquele assunto** — como é o despacho de encaminhamento daqui, o roteiro da nota técnica, o que o parecer precisa ter. Você escreve na configuração ou aponta um arquivo `.md` do GitHub; na conversa, digite `/` e escolha, ou deixe que o próprio agente reconheça o assunto e carregue
- *Skills da equipe*: em vez de cada pessoa cadastrar as suas, a unidade mantém as skills numa pasta de repositório público e todo mundo aponta para ela. Quem cuida do padrão edita os arquivos; cada pessoa recebe a atualização. Há dois modelos prontos para copiar em [skills-exemplo](https://github.com/SEI-Pro/sei-pro/tree/master/skills-exemplo)
- *Desfazer*: cada alteração feita pelo agente ganha um botão **Desfazer** quando existe volta possível — reabrir o que foi concluído, devolver o marcador anterior, retirar do bloco o que foi incluído. Onde não há volta honesta (enviar, assinar, excluir), a linha diz *sem desfazer* e explica por quê
- *Regras da unidade*: escreva o que o agente **não** pode fazer aqui ("o envio de processo é feito por uma pessoa", "Portaria não é criada pelo agente") e quem aplica é a própria extensão, antes de qualquer alteração — não depende de o modelo lembrar
- *Memória da unidade*: o agente anota o que você corrige sobre o jeito de trabalhar e leva para as próximas conversas. Tudo aparece na conversa e na configuração, com data, e se apaga num clique; dado de processo, número e nome de pessoa **não** entram
- *Rotinas*: perguntas que o agente faz sozinho de tempos em tempos ("processos parados há mais de 30 dias"), sempre só de leitura, executadas quando você abre o agente depois do horário marcado
- *Tarefas longas*: leituras pesadas (dezenas de documentos) passam a ser entregues a agentes auxiliares, que trabalham em paralelo com contexto próprio e devolvem só a resposta — e podem rodar num modelo mais barato, à sua escolha
- *Gasto*: dá para definir um **teto por conversa e por dia**, em reais, com aviso antes de bater. O trecho que se repete a cada pergunta passa a ser marcado para o cache do serviço, e conversas muito longas têm o começo resumido automaticamente, em vez de simplesmente truncado
- *Serviços de IA*: além do OpenRouter, agora há **OpenAI**, **Google Gemini** e **Anthropic** prontos no seletor, com o endereço já configurado; o modelo é escolhido numa lista carregada do próprio fabricante. O passo a passo para conseguir a chave de cada um está em [Como obter a chave](../pages/CHAVEIA.md)
- *Avançado*: voltou o controle fino do chat antigo — temperatura, top P, máximo de tokens e penalidades — além de um campo de instruções que valem para toda conversa
- Blocos de assinatura e blocos internos: o agente passa a **criar bloco, incluir e retirar documentos, disponibilizar, retornar, concluir e reabrir**, além de assinar o bloco inteiro

### Versão 2.0.1
23/09/2026

Versão de correção.

- [Enviar documentos em processos](../pages/BARRAACOES.md): a ferramenta deixa de parar a lista inteira quando um processo não aceita o documento. Antes, bastava um tropeço — um processo que não está mais aberto na sua unidade, um formulário que não abre, o servidor sem responder — para a rodada morrer ali, sem aviso, e nenhum dos processos seguintes recebia nada. Agora o processo que falha é pulado, os demais seguem recebendo e, no fim, aparece a lista dos que ficaram de fora com o motivo de cada um. Eles continuam **marcados na tela**, para você conferir e tentar de novo
- *Enviar documentos em processos*: corrigido o travamento em listas grandes. A cada processo, os arquivos eram enfileirados de novo sobre a fila anterior, que dobrava de tamanho a cada passo (1, 2, 4, 8, 16…). Em listas com algumas dezenas de processos o navegador afogava e a ferramenta parava no meio do caminho. Nenhum documento chegou a ser duplicado no SEI
- *Enviar documentos em processos*: quando a árvore do processo demora a abrir, a ferramenta passa a esperar em vez de falhar calada

### Versão 2.0
22/09/2026

Versão com uma função nova grande: o **Agente de IA**.

- [Agente de IA](../pages/AGENTEIA.md): um agente que trabalha **dentro do SEI**, pela sua própria sessão e com as suas permissões, num painel ao lado do processo. Pergunte em português e ele consulta a caixa da unidade, o processo, a árvore, o histórico e o conteúdo dos documentos — inclusive PDF, com OCR quando é digitalizado —, pesquisa no órgão e resume. Ele também **altera**: tipo, especificação, interessados, nível de acesso, anotação, marcador, atribuição, acompanhamento, andamento, conclusão e reabertura, criação de documento com conteúdo, assinatura, envio para outra unidade, exclusão, cancelamento e ciência
- Nada é alterado sem a sua aprovação: antes de executar, o agente monta um cartão com o que pretende fazer, item a item, mostrando o valor de antes e o de depois. O que é irreversível (enviar processo, excluir ou cancelar documento, cancelar assinatura) ainda pede uma confirmação à parte, e assinar pede o cargo e a senha do SEI no próprio cartão — senha que **não** é enviada ao modelo de IA nem guardada
- Privacidade: processo **sigiloso** o agente não abre, de jeito nenhum; documento **restrito** só é lido depois que você autoriza, uma vez por conversa. Antes de qualquer texto sair do navegador, CPF, CNPJ, e-mail, telefone, endereço, conta bancária, CID e outros dados pessoais são trocados por rótulos como `[CPF_1]`. O dado real volta ao lugar dentro do seu navegador, quando o agente precisa escrever no SEI
- O serviço de IA é escolhido por você: **OpenRouter** (com a exigência de que o provedor não guarde nem treine com o que recebe) ou qualquer **API compatível com a OpenAI** — NVIDIA, Groq, um modelo na sua máquina ou um servidor do próprio órgão, caso em que o conteúdo não sai da rede interna. A chave é sua e fica só neste navegador: o SEI Pro não tem servidor e não vê as suas mensagens
- Conversas guardadas: o painel guarda a transcrição das conversas anteriores para reler e exportar em Markdown, com prazo de guarda configurável. Fica gravada só a transcrição — por isso a conversa antiga abre para leitura, não para continuar
- As **Ferramentas de Inteligência Artificial** antigas (ChatGPT e Gemini, com diálogo próprio no editor e o modo `+gpt`) saíram. O ícone da barra do processo e o botão de IA do editor passam a abrir o agente
- [Inserir link de documento público](../pages/DOCPUBLICO.md): o código de verificação (captcha) deixa de ser lido por inteligência artificial. A imagem aparece e quem digita é você
- [Ferramentas de PDF](../pages/FERRAMENTASPDF.md): o **OCR** voltou a funcionar. Desde a versão 1.7.0 ele falhava com "Recarregue a página e tente novamente", por causa de como o motor de reconhecimento era carregado

### Versão 1.7.7
21/09/2026

Versão de correção.

- Processos sigilosos no SEI 4.1 e no SEI 5: volta a ser possível digitar a senha na tela *Identificação de Acesso*. A extensão abria uma segunda janela de senha por trás da do SEI, e as duas disputavam o cursor: o campo perdia o foco a cada tecla. Vale para abrir o processo sigiloso e para o *Acervo de Sigilosos*
- Ícones da barra do documento (*Iniciar ações em lote*, *Documentos em Lote*, *Comparador de Documentos*, *Ferramentas de PDF* e *Ferramentas de IA*) voltam a aparecer para quem tem outra extensão que interfere no navegador. O endereço das imagens saía como `[object Promise]`
- Gerar Intimação Eletrônica (módulo de Peticionamento): a lista *Tipo de Intimação* deixa de ficar travada, sem largura e sem mostrar as opções. O mesmo vale para outras listas que ficam escondidas até o formulário ser preenchido

### Versão 1.7.6
21/09/2026

Versão de correção.

- Gestor de Atividades: corrigido o aviso "A chave de acesso é diferente do login do SEI", que passou a aparecer para quase todos os usuários depois da atualização para o **SEI 4.1.5** e fechava o painel de atividades. A partir dessa versão, o SEI grava o login com `_` no lugar do `.` (`fulano_silva` em vez de `fulano.silva`), e a extensão lia só a última parte (`silva`). Agora o login é lido do nome do usuário no topo do SEI, que mantém o formato original, e a comparação trata `.`, `_` e `-` como equivalentes. O mesmo vale para o SEI 5
- Gestor de Atividades: o pedido de nova chave de acesso e o envio de relatório de erro passam a informar o login completo do usuário. As anotações da árvore do processo também mostram o login completo em "por …"

### Versão 1.7.5
19/09/2026

- [Editar e formatar imagens](../pages/EDITARIMAGENS.md) voltam **no SEI 5**. Ao clicar na imagem, a barra que aparece embaixo dela ganha os botões **Formatar imagem** e **Editar imagem**, que também ficam no botão direito sobre a imagem. No SEI 5 eles não tinham nenhum acesso desde que o editor mudou
- Formatar imagem no SEI 5: tamanho, margens, borda, filtro e alinhamento passam a ser gravados no documento. Na imagem centralizada em bloco, o SEI 5 guarda só o tamanho e o texto alternativo, e um aviso explica como usar as demais opções
- Editar imagem: a imagem editada passa a ser gravada corretamente no SEI 5, e a janela do editor de imagens deixa de passar da altura da tela, que escondia os botões *Aplicar* e *Cancelar*
- Botão direito no SEI 3 e no SEI 4: *Copiar formatação*, *Bloquear Edição* e *Ditado* voltam ao menu do editor, ao lado de recortar, copiar e colar. Nos documentos com várias seções, os itens do SEI Pro passam a aparecer em todas as seções editáveis
- Botão direito no SEI 5: o menu do SEI Pro aparece sobre tabelas e imagens. Sobre o texto fica o menu do navegador, com copiar e o corretor ortográfico. **Shift + botão direito** sempre abre o menu do navegador

### Versão 1.7.4
18/09/2026

- [Escrita interativa](../pages/ESCRITAINTERATIVA.md) volta a funcionar **no SEI 5**. No novo editor, o SEI Pro usa o menu que o próprio SEI já abre ao digitar `@`: as variáveis do SEI (`@ano@` e outras) aparecem primeiro, seguidas das unidades. O `#` abre o mesmo menu com os documentos e os dados do processo
- Escrita interativa: o menu deixa de abrir sem motivo. Agora ele só aparece quando o `#` ou o `@` começa uma palavra, logo antes do cursor. Um e-mail (`fulano@orgao.gov.br`) ou um `#` em outro ponto do parágrafo não abrem mais a lista
- Escrita interativa no SEI 3 e no SEI 4: a lista de sugestões passa a ficar fora do texto do documento (antes era inserida dentro do parágrafo) e fecha com `Esc`. No `@`, a unidade cuja sigla é exatamente a digitada aparece primeiro

### Versão 1.7.3
18/09/2026

- Aviso quando há **mais de uma cópia do SEI Pro ativa** no navegador (por exemplo, a da Chrome Web Store e outra carregada sem compactação). As cópias conflitam entre si e causam falhas difíceis de identificar, como ícones que não carregam. Uma barra amarela no topo da página lista as cópias encontradas e orienta a deixar só uma ativa em `chrome://extensions`. A barra pode ser fechada no ×
- Botões das janelas do SEI Pro no SEI 4 e no SEI 5: o *OK* e os demais botões voltam ao visual correto, e o botão de fechar volta a mostrar o ×. O SEI 4 e o 5 carregam o Bootstrap, que tomava o lugar do componente de botão usado por essas janelas
- Corrigida a busca nas listas de seleção dos formulários, que podia ser bloqueada pelo Chrome quando havia duas cópias do SEI Pro instaladas ou depois de reinstalar a extensão de outra pasta
- O console do navegador deixa de mostrar centenas de avisos "Permissions policy violation: unload"

### Versão 1.7.2
16/09/2026

Versão de correção.

- Corrigida a queda da sessão do SEI logo depois do login, que começou na versão 1.7.1 em órgãos com mais de um item de Acompanhamento Especial no menu (como o do SEI do Maranhão, que tem também o da Ouvidoria). Ao abrir o Controle de Processos, a extensão lia a lista de acompanhamentos por um endereço formado pelos dois itens juntos, e o SEI encerrava a sessão ao receber esse endereço inválido
- [Documentos em Lote](../pages/DOCUMENTOSEMLOTE.md) e [Processos em Lote](../pages/PROCESSOSEMLOTE.md): a leitura dos tipos de documento e de processo passa a usar só o item *Pesquisa* do menu, evitando o mesmo problema em menus com outro item de pesquisa

### Versão 1.7.1
15/09/2026

Versão de correções, testada ao vivo no SEI 4.1.5 e no SEI 5.0.4.

- **SEI 4.1**: voltaram a funcionar as melhorias dentro dos formulários e documentos do processo, que a extensão não encontrava porque o SEI 4.1 abre o documento num quadro dentro de outro
  - [aviso de documentos não assinados](../pages/DOCSNAOASSINADOS.md) e as opções *Remover marcadores*, *Remover atribuição* e *Reabrir processo em data certa* no **Enviar Processo**
  - [valores padronizados](../pages/VALDEFAULT.md) ao incluir documento e ícone de [urgência](../pages/URGENTE.md)
  - [pré-visualização de ZIP](../pages/VISUALIZARZIP.md), [vídeo](../pages/PLAYVIDEO.md) e o ícone de [código de integridade (Hashcode)](../pages/HASHCODE.md) ([#149](https://github.com/SEI-Pro/sei-pro/issues/149))
  - histórico de tramitação na [capa do processo](../pages/CAPAPROCESSO.md)
  - [Certidão de Documento Oficial com Sigilo](../pages/CERTIDAOSIGILO.md), que encerrava a sessão do SEI ao ser gerada
- **SEI 5**
  - [tarja e marca de sigilo](../pages/SIGILODOC.md) no novo editor, que eram descartadas sem aviso
  - caixas de seleção que sumiam ao salvar o documento, e [Dados do Processo](../pages/DADOSPROCESSO.md) que não substituía os campos
  - colar imagem copiada de site, do Teams ou do WhatsApp Web
  - [contador de processos no ícone do SEI](../pages/CONTADORPROCESSOICONE.md)
  - erro a cada clique nos ícones da barra do processo, e "Protocolo: undefined" em *Consultar/Alterar Processo*
- Árvore do processo: [numeração](../pages/NUMERARDOCSARVORE.md), [duas linhas](../pages/DIVIDIRLINHASARVORE.md) e [menu rápido](../pages/MENURAPIDO.md) deixam de sumir em parte das aberturas e passam a valer também nos documentos das pastas, em processos com mais de 20 documentos. Corrigida a imagem quebrada no último documento
- [Favoritos](../pages/FAVORITOS.md): a estrela no Controle de Processos voltou a favoritar ([#83](https://github.com/SEI-Pro/sei-pro/issues/83))
- [Rolagem infinita](../pages/ROLAGEMINFINITA.md) na pesquisa voltou a funcionar no SEI 4 e no SEI 5, inclusive depois de abrir uma janela como a de assinatura ([#159](https://github.com/SEI-Pro/sei-pro/issues/159))
- Marcadores: o painel da árvore e o quadro por marcadores passam a mostrar os marcadores novos e a gravar de fato no SEI 4.1 e 5 — antes mostravam sucesso sem gravar. Remover o marcador pelo painel também voltou a funcionar ([#92](https://github.com/SEI-Pro/sei-pro/issues/92), [#116](https://github.com/SEI-Pro/sei-pro/issues/116))
- [Agrupamento](../pages/AGRUPAR.md) por Acompanhamento Especial com os grupos reais, também no ícone da linha e na planilha CSV ([#109](https://github.com/SEI-Pro/sei-pro/issues/109))
- Enviar Processo
  - Enter no campo de prazo do favorito **não envia mais o processo**
  - as unidades de um envio anterior não são mais pré-preenchidas em outro processo
  - *Remover atribuição* passa a funcionar junto com *Remover marcadores*
- Histórico do processo: o histórico visual e as [Ações em Lote](../pages/ACOESEMLOTE.md) passam a ler o histórico completo em processos grandes, sem exibir o histórico errado nem trocar a forma de exibição escolhida no SEI. O Enviar Processo reaproveita o histórico já lido: de 35 para 3 consultas num processo com 3.400 andamentos. O aviso "Aguarde... Pesquisando links" das Ações em Lote passa a fechar sozinho
- [Enviar múltiplos documentos externos](../pages/UPLOADDOCS.md) e [Ferramentas de PDF](../pages/FERRAMENTASPDF.md): quando o nome do arquivo não indica o tipo e não há tipo padrão, a extensão pergunta o tipo, em vez de usar o primeiro da lista. Nomes com travessão e aspas do Word chegam legíveis
- [Ferramentas de PDF](../pages/FERRAMENTASPDF.md): *Trazer do processo aberto* e *Enviar ao processo* funcionam com o processo aberto pela pesquisa rápida ou com a [URL amigável](../pages/URLAMIGAVEL.md); os modos *Por intervalos* e *A cada N páginas* do Dividir voltaram a funcionar
- [Documentos em Lote](../pages/DOCUMENTOSEMLOTE.md): corrigidos o número e o nome trocados na tabela final em órgãos com hífen na sigla, a criação em novos processos no SEI 4.1, as aspas curvas e o travessão do Word na especificação, e as mensagens de erro, que diziam apenas "false"
- Editor de documentos
  - a [caixa de seleção](../pages/CAIXASELECAO.md) não apaga mais o texto do item ao ser marcada
  - colar tabela do Excel ou texto do Word não insere mais uma cópia do trecho como imagem, e imagem colada não sai duplicada ([#105](https://github.com/SEI-Pro/sei-pro/issues/105), [#70](https://github.com/SEI-Pro/sei-pro/issues/70))
  - *Inserir dados do processo* e a [revisão de texto](../pages/REVISARDOC.md) atuavam no Cabeçalho em documentos com seções
  - o botão Ajuda da [Legística](../pages/LEGISTICA.md) voltou a abrir a página de ajuda
- [Parágrafos numerados](../pages/PARAGRAFOSNUMERADOS.md) passam a contar 1, 2, 3 — contavam de 2 em 2
- Layout do SEI 4.1: links "Ver por" numa linha só, caixas *Gerados* e *Externos* da pesquisa sem sobrepor o texto, e barra de ações fixa sem cobrir o cabeçalho
- Inicialização mais robusta quando os arquivos da extensão carregam fora de ordem — causa de funções que só apareciam depois de recarregar a página e da janela de assinatura que não abria ([#142](https://github.com/SEI-Pro/sei-pro/issues/142), [#126](https://github.com/SEI-Pro/sei-pro/issues/126), [#146](https://github.com/SEI-Pro/sei-pro/issues/146))
- Segurança: os dados do SEI inseridos pelos campos dinâmicos passam a ser tratados como texto, e o editor do SEI 5 deixa de aceitar atributos de script em conteúdo colado
- A partir desta versão, a extensão abre este histórico quando é atualizada

### Versão 1.7.0
11/09/2026

- Nova funcionalidade: [Ferramentas de PDF](../pages/FERRAMENTASPDF.md), uma página própria da extensão com nove ferramentas que rodam **inteiramente no seu computador** — nenhum arquivo é enviado a servidor nenhum, e tudo continua funcionando com a máquina desconectada
  - **Tarjar PDF**: suprime CPF, e-mail e outros dados sensíveis de forma que o texto **deixe de existir no arquivo**. A maioria dos editores desenha um retângulo por cima e o texto continua lá; aqui a página é reconstruída. O resultado é conferido antes de ser entregue — por posição, por texto extraído e por varredura dos bytes —, e o arquivo não é entregue se qualquer prova falhar
  - **Juntar**, **Dividir**, **Comprimir**, **Organizar páginas**, **Imagem para PDF**, **Numerar páginas**, **OCR (PDF pesquisável)** e **Conferir PDF/A**
  - Abertas pela barra de ações do Controle de Processos, pela barra da árvore do processo, pelo menu lateral ou pelo ícone da extensão
  - Com o processo aberto, é possível **trazer documentos do processo** e **devolver o resultado a ele**, sem baixar e reanexar à mão
  - Comprimir e Dividir passam a usar o **limite de upload real da sua instalação do SEI**, com margem de segurança. Não existe um limite padrão do SEI: cada órgão configura o seu
- Nova funcionalidade: [Processos em Lote](../pages/PROCESSOSEMLOTE.md), que abre vários processos de um mesmo tipo de uma só vez, a partir de uma lista de especificações colada de uma planilha ou de uma quantidade informada
  - Acessível pelo **menu lateral** do SEI, e pode ser desligada nas configurações da extensão
  - Permite escolher o **nível de acesso** (Público ou Restrito, com hipótese legal) e o **intervalo entre um processo e outro**, para reduzir o impacto no servidor
  - Ao final, apresenta a **tabela com o número de cada processo aberto**, pronta para copiar ou baixar em CSV, incluindo as linhas que falharam e o motivo — uma linha com erro não interrompe as demais
  - A ferramenta avisa, antes de começar, que a abertura em lote pode deixar o SEI lento para todos os usuários do órgão, e recomenda o uso fora do horário comercial
- O OCR das Ferramentas de IA parou de baixar o motor de reconhecimento e o modelo de português de uma CDN externa a cada uso: os arquivos passam a vir dentro da extensão. Além de mais rápido, é o que permite afirmar que a extensão não busca nada de terceiros
- Corrigida uma vulnerabilidade da biblioteca de leitura de PDF (CVE-2026-16633), que permitia a execução de código ao abrir um PDF criado para isso. A execução de JavaScript embutido em PDF fica desligada, e o interpretador nem sequer é distribuído com a extensão

### Versão 1.6.24
09/09/2026

- Corrigida a ferramenta **Enviar documentos em processos**, que não enviava nada: o arquivo ficava parado na fila, sem mensagem. As bibliotecas de apoio nunca chegavam ao contexto em que o envio é executado
- Corrigido o ícone quebrado na pré-visualização do arquivo a ser enviado
- Corrigido o erro ao clicar duas vezes no ícone da ferramenta, que impedia trocar de processo sem antes cancelar
- Corrigida a interrupção da inicialização do SEI Pro na tela **Controle de Processos**: quando a biblioteca de datas ainda não havia carregado, **nenhuma** funcionalidade da extensão subia naquela tela até um novo carregamento dar sorte ([#142](https://github.com/SEI-Pro/sei-pro/issues/142))

### Versão 1.6.23
09/09/2026

- Corrigida a substituição do jQuery da página, que derrubava a jQuery UI, o plugin do [Menu Suspenso](../pages/MENUSUSPENSO.md) e a janela modal do SEI. A extensão passa a usar o jQuery da própria página quando ele é igual ou mais novo que o dela. Eram 4 erros por carregamento; passaram a zero, no SEI 4.1.5 e no 5.0.4 (diagnóstico original de Rafael Farias, [#163](https://github.com/SEI-Pro/sei-pro/issues/163))
- Corrigido o acúmulo de temporizadores dos ícones da barra de ações: cada documento aberto deixava mais nove ciclos ativos, indefinidamente
- Corrigido o envio de conteúdo vazio às Ferramentas de IA — quando não era possível ler o documento, o texto seguia para a plataforma como a palavra "false" e a resposta vinha sobre um conteúdo inexistente
- Mensagem mais clara ao tentar duplicar um documento cujo tipo não está disponível na unidade

### Versão 1.6.22
09/09/2026

- Corrigidos os botões **Baixar Lista**, **Copiar** e **Baixar Documentos** na tela de pesquisa, que só apareciam depois de recarregar a página algumas vezes ([#146](https://github.com/SEI-Pro/sei-pro/issues/146))
- Corrigida a busca por nome em *Atribuir Processo*. Na prática, as [Caixas de seleção inteligentes](../pages/SUBSTITUIRSELECAO.md) estavam inteiramente inoperantes nas telas de formulário do SEI 4 — *Gerar Documento* e *Enviar Processo* também voltam a ter busca
- Corrigido o **Copiar número do processo** do menu rápido, que copiava o nome do primeiro documento da árvore

### Versão 1.6.21
09/09/2026

- Corrigido o botão **Painel de Controle**, que ficava invisível com o [Estilo Avançado](../pages/ESTILOAVANCADO.md) ativado ([#108](https://github.com/SEI-Pro/sei-pro/issues/108))
- Corrigida a lista de grupos do Acompanhamento Especial, que vinha vazia e só permitia criar grupo novo ([#103](https://github.com/SEI-Pro/sei-pro/issues/103))

### Versão 1.6.20
09/09/2026

- Corrigido o tamanho dos ícones da extensão no SEI 5, que apareciam com quase metade do tamanho
- [Ações em Lote](../pages/ACOESEMLOTE.md): a lista de documentos passa a se atualizar sozinha quando a árvore termina de expandir (de 19 para 119 documentos em um processo com 6 volumes fechados)
- [Ações em Lote](../pages/ACOESEMLOTE.md): corrigido o modal que abria vazio no SEI 4.1.x
- [Ações em Lote](../pages/ACOESEMLOTE.md): corrigidas as colunas *Unidade* e *Data da Assinatura*, que nunca eram preenchidas em nenhuma versão do SEI

### Versão 1.6.19
08/09/2026

- Corrigida a barra de ícones da tela **Controle de Processos**, que ficava comprimida no SEI 5
- Corrigido o botão `[-]`, que não recolhia as grades de processos quando o agrupamento estava ativo (em qualquer versão do SEI)

### Versão 1.6.18
08/09/2026

- Corrigidos a capa do processo (com o QR Code) e o [painel de dados do processo](../pages/DADOSPROCESSO.md) — atribuição, marcador, acompanhamento especial, especificação, tipo e nível de acesso —, que não carregavam no SEI 5 ([#162](https://github.com/SEI-Pro/sei-pro/issues/162))

### Versão 1.6.17
08/09/2026

- Corrigida a regressão da 1.6.16 que impedia a assinatura de documentos

### Versão 1.6.16
08/09/2026

- Compatibilidade com o **SEI 5**: a barra de ferramentas do SEI Pro voltou a ser injetada no editor de documentos ([#147](https://github.com/SEI-Pro/sei-pro/issues/147), [#162](https://github.com/SEI-Pro/sei-pro/issues/162))
- Corrigidos os botões de alinhamento duplicados na barra do editor
- Removido o registro da senha de assinatura em lote no console do navegador

### Versão 1.6.15
07/09/2026

- Editor de documentos adaptado ao **CKEditor 5** do SEI 5, mantendo o funcionamento no CKEditor 4
- Adicionada a exportação de documentos em **DOCX** no visualizador
- Correções gerais de compatibilidade com o SEI 5

### Versões 1.5.5 a 1.6.14
2024 — 2026

- Correções e melhorias


### Versão 1.5.4
23/10/2023

- Correções e melhorias
- Adicionado [Mover ícone de excluir documentos para o final da lista](../pages/MOVERICONE.md)
- Adicionado o [Autopreencher senha no login (SEI >= 4.0)](../pages/AUTOPREENCHERSENHA.md)
- Adicionado [Numerar documentos na árvore do processo](../pages/NUMERARDOCSARVORE.md)
- Adicionado o [Contador de processos não recebidos no ícone do SEI](../pages/CONTADORPROCESSOICONE.md)
- Adicionado [Mostrar especificação do processo na tabela de controle de processos](../pages/ESPECIFICACAOPROCESSO.md)
- Adicionado [Mostrar nomes de usuários na tabela de controle de processos](../pages/NOMESUSUARIOS.md)
- Adicionado [Permitir marcar processos como "Não Visualizado"](../pages/NAOLIDO.md)
- Adicionado a [Comparador de Documentos](../pages/COMPARARDOCUMENTOS.md)
- Adicionado a [Reabertura programada de processos](../pages/REABRIRPROCESSOS.md)
- Adicionado o [Ditado no editor de documentos](../pages/DITADO.md)
- Adicionado a [Escrita interativa no editor de documentos](../pages/ESCRITAINTERATIVA.md)
- Adicionado a [Revisão de texto no editor de documentos](../pages/REVISARDOC.md)
  
### Versão 1.2
10/02/2023

- Correções e melhorias
- Adicionado a [Redução da qualidade das imagens inseridas nos documentos](../pages/QUALIDADEIMAGENS.md)
- Adicionado as [Teclas de atalhos no editor de documentos](../pages/TECLASATALHO.md)
- Adicionado as [Referências internas](../pages/REFERENCIAINTERNA.md) (Sugestão Hélio Oliveira e Roberto Balata)

### Versão 1.0
15/06/2022

- Correções e melhorias
- Adicionado a [Alteração do layout do SEI (Estilo Avançado + Modo Noturno)](../pages/ESTILOAVANCADO.md)
- Adicionado a [Envio de múltiplas imagens, formatação e editação de opções avançadas](../pages/EDITARIMAGENS.md)
- Adicionado a [Redução da qualidade das imagens inseridas nos documentos](../pages/QUALIDADEIMAGENS.md)
- Adicionado a [Enumeração de Normas (Legística)](../pages/LEGISTICA.md) (Migrado do projeto [SEI Legis](https://github.com/SEI-Pro/sei-legis))
- Adicionado o [Controle de Prazos](../pages/PRAZOS.md)  (Sugestão de Bruno Crescenti)
- Adicionado as [Caixas de seleção inteligentes](../pages/SUBSTITUIRSELECAO.md)
- Adicionado as [Ações em Lote](../pages/ACOESEMLOTE.md)
- Adicionado a [Rolagem infinita na pesquisa de processos](../pages/ROLAGEMINFINITA.md)
- Adicionado os [Endereços amigáveis em processos e documentos](../pages/URLAMIGAVEL.md) (Sugestão Di Quirino)
- Adicionado o [Alerta sobre documentos não assinados ao enviar um processo](../pages/DOCSNAOASSINADOS.md) (Sugestão Leonardo Rafaele)
- Adicionado as [Cores personalizadas em Marcadores](../pages/CORESMARCADORES.md) (Sugestão de Felyssa)
- Adicionado os [Parágrafos numerados no visualizador de documentos](../pages/PARAGRAFOSNUMERADOS.md) (Sugestão de Francisco Eudes)
- Adicionado a [Certidão de Documento Oficial com Sigilo](../pages/CERTIDAOSIGILO.md) (Sugestão de Tatiana Cabral - CGU)

### Versão 0.1.26
08/09/2021

- Correções e melhorias
- Adicionado o [Gerenciador de processos favoritos](../pages/FAVORITOS.md)

### Versão 0.1.25
28/05/2021

- Correções e melhorias
- Adicionado o [Menu Suspenso](../pages/MENUSUSPENSO.md)
- Adicionada função de [Filtrar e ordenar tabelas ao clicar no seu cabeçalho](../pages/ORDENARTABELA.md)
- Adicionada função [Histórico de processos visitados](../pages/HISTORICOPROC.md) (Sugestão Leonardo Rafaele)
- Adicionada função [Informações adicionais na árvore do processo](../pages/INFOARVORE.md)
- Adicionada função de [Anotação diretamente pela árvore do processo](../pages/NOTAARVORE.md)

### Versão 0.1.24
07/04/2021

- Correções e melhorias
- Adicionada função de [Duplicar documentos com 1 click](../pages/DUPLICARDOC.md)
- Adicionada função de [Enviar múltiplos documentos externos](../pages/UPLOADDOCS.md)

### Versão 0.1.23
08/03/2021

- Correções e melhorias
- Adicionada função de [Pesquisar link permanente](../pages/LINKPERMANENTE.md) (Sugestão de Hélio Oliveira)
- Adicionada função de [Reproduzir vídeo na visualização de documentos](../pages/PLAYVIDEO.md) (Sugestão de Roberto Balata)
- Adicionada função de [Exportar informações de processos em planilha CSV](../pages/LISTAPROCESSOS.md) (Sugestão de Hélio Oliveira)
- Adicionada função de [Adicionar marca d'água de minuta ao documento](../pages/MARCAMINUTA.md) (Sugestão de Hélio Oliveira)
- Adicionada função de [Adicionar marca de sigilo e tarjas pretas de confidencialidade](../pages/SIGILODOC.md)
- Aperfeiçoada as funções de [Inserir dados do processo](../pages/DADOSPROCESSO.md) (Sugestão de Renata Rocha)

### Versão 0.1.22
24/01/2021

- Correções e melhorias (colaboração de Leonardo Rafaele)
- Adicionada função de [Valores padronizados ao inserir novo documento](../pages/VALDEFAULT.md) (Sugestão de Roberto Balata)
- Adicionada função de [Inserir documento externo (Google Planilhas)](../pages/INSERIRDOC.md) (Sugestão de James Wallace)

### Versão 0.1.21
20/12/2020

- Correções e melhorias (colaboração de Leonardo Rafaele)
- Adicionada função [Adicionar link de documento público](../pages/DOCPUBLICO.md) (Sugestão de Renata Rocha)

### Versão 0.1.20
06/12/2020

- Correções e melhorias (colaboração de Leonardo Rafaele)
- Adicionada função [Verificar código de integridade (Hashcode)](../pages/HASHCODE.md)
- Adicionada função [Agrupamento de lista de processos por unidade de envio e data de envio](../pages/AGRUPAR.md) (Sugestão de Dárcio Gomes)

### Versão 0.1.19
23/11/2020

- Correções e melhorias 
- Adicionada função [Agrupamento de lista de processos por data de recebimento e último acesso](../pages/AGRUPAR.md) (Sugestão de Dárcio Gomes)

### Versão 0.1.18
18/11/2020

- Correções e melhorias 
- Adicionada função [Alinhar o texto à esquerda, ao centro, à direita ou justificadamente](../pages/ALINHARTEXTO.md) (Sugestão de Geraldo Nogueira)
- Atualizada função [Adicionar link de legislação](../pages/LINKLEGIS.md) para inserir recurso de pesquisa legislação por conteúdo
- Adicionado recurso de desfazer (Ctrl + Z) as modificações feitas pelo SEI Pro no editor de texto do SEI

### Versão 0.1.17
13/11/2020

- Correções e melhorias
- Adicionada função [Copiar formatação de texto](../pages/COPIARFORMATACAO.md) (Sugestão de Lucas Campos)
- Adicionada função [Aumentar ou reduzir o tamanho da fonte](../pages/AUMENTARFONTE.md) (Sugestão de Samuel Kaiser)
- Adicionada aba na página de opção para [Desativar funções da extensão](../pages/DESATIVARFUNCOES.md)

### Versão 0.1.16
03/11/2020

- Correções e melhorias
- Adicionada função [Tabela rápida](../pages/TABELARAPIDA.md)

### Versão 0.1.15
23/10/2020

- Correções e melhorias
- Adicionada função [Menu rápido na árvore de documentos](../pages/MENURAPIDO.md)

### Versão 0.1.14
22/10/2020

- Correções e melhorias
- Inserida opção que corrige erros de codificação de documentos Word ao [Inserir documento externo](../pages/INSERIRDOC.md)

### Versão 0.1.13
21/10/2020

- Correções e melhorias
- Adicionado relatório filtrado no [Gerenciador de projetos](../pages/PROJETOS.md)

### Versão 0.1.12
15/10/2020

- Correções e melhorias
- Adicionada função de [Copiar número e nome do documento ou processo](../pages/COPIARDOC.md)

### Versão 0.1.11
06/10/2020

- Correções e melhorias
- Adicionada funcionalidade de [Inserir equações (fórmulas matemáticas)](../pages/EQUACOES.md) (Sugestão de Samuel Kaiser)

# Lista de funções do SEI Pro ![SEI Pro](../img/icon-32.png)

- [Alterar o layout do SEI (Estilo Avançado + Modo Noturno)](../pages/ESTILOAVANCADO.md)
- [Gerenciar projetos](../pages/PROJETOS.md)
- [Agrupar  lista de processos por data de recebimento, envio, último acesso, marcadores, tipo, responsável, ponto de controle e unidade de envio](../pages/AGRUPAR.md)
- [Inserir documento externo (HTML, Google Docs e Google Planilhas)](../pages/INSERIRDOC.md)
- [Adicionar estilo a tabela](../pages/ESTILOTABELA.md)
- [Adicionar link de legislação](../pages/LINKLEGIS.md)
- [Primeira letra maiúscula (exceto artigos e preposições)](../pages/LETRAMAIUSC.md)
- [Inserir referência de documentos do processo](../pages/REFDOCUMENTOS.md)
- [Inserir nota de rodapé](../pages/NOTARODAPE.md)
- [Inserir sumário](../pages/SUMARIO.md)
- [Inserir dados do processo](../pages/DADOSPROCESSO.md)
- [Gerar link curto do TinyUrl](../pages/LINKCURTO.md)
- [Gerar código QR (QRCode)](../pages/QRCODE.md)
- [Redimensionar imagens](../pages/REDIMENSIONAIMG.md)
- [Inserir quebra de página](../pages/QUEBRAPAGINA.md)
- [Alterar título da página](../pages/TITULOPAGINA.md)
- [Abrir, editar e remover hiperlinks](../pages/ABRIRLINKS.md)
- [Inserir equações (fórmulas matemáticas)](../pages/EQUACOES.md)
- [Menu e ícones rápidos na árvore de documentos](../pages/MENURAPIDO.md)
- [Tabela rápida](../pages/TABELARAPIDA.md)
- [Copiar formatação do texto](../pages/COPIARFORMATACAO.md)
- [Aumentar ou reduzir o tamanho da fonte](../pages/AUMENTARFONTE.md)
- [Alinhar o texto à esquerda, ao centro, à direita ou justificadamente](../pages/ALINHARTEXTO.md)
- [Verificar código de integridade (Hashcode)](../pages/HASHCODE.md)
- [Adicionar link de documento público](../pages/DOCPUBLICO.md)
- [Adicionar valores padronizados ao criar um novo documento](../pages/VALDEFAULT.md)
- [Pesquisar link permanente](../pages/LINKPERMANENTE.md)
- [Reproduzir vídeo na visualização de documentos](../pages/PLAYVIDEO.md)
- [Exportar informações de processos em planilha CSV](../pages/LISTAPROCESSOS.md)
- [Adicionar marca d'água de minuta ao documento](../pages/MARCAMINUTA.md)
- [Adicionar marca de sigilo e tarjas pretas de confidencialidade](../pages/SIGILODOC.md)
- [Duplicar documentos com 1 click](../pages/DUPLICARDOC.md)
- [Enviar múltiplos documentos externos](../pages/UPLOADDOCS.md)
- [Menu Suspenso](../pages/MENUSUSPENSO.md)
- [Filtrar e ordenar tabelas ao clicar no seu cabeçalho](../pages/ORDENARTABELA.md)
- [Histórico de processos visitados](../pages/HISTORICOPROC.md)
- [Informações adicionais na árvore do processo](../pages/INFOARVORE.md)
- [Anotação diretamente pela árvore do processo](../pages/NOTAARVORE.md)
- [Remover paginação de processos](../pages/REMOVEPAGINACAO.md)
- [Dividir as informações do documento na árvore do processo em duas linhas](../pages/DIVIDIRLINHASARVORE.md)
- [Redimensionar automaticamente a árvore do processo pela sua largura total](../pages/RESIZEARVORE.md)
- [Utilizar caixas de seleção inteligentes](../pages/SUBSTITUIRSELECAO.md)
- [Ações em Lote](../pages/ACOESEMLOTE.md)
- [Rolagem infinita na pesquisa de processos](../pages/ROLAGEMINFINITA.md)
- [Utilizar endereços amigáveis em processos e documentos](../pages/URLAMIGAVEL.md)
- [Alertar sobre documentos não assinados ao enviar um processo](../pages/DOCSNAOASSINADOS.md)
- [Permitir cores personalizadas em Marcadores](../pages/CORESMARCADORES.md)
- [Visualizar parágrafos numerados no visualizador de documentos](../pages/PARAGRAFOSNUMERADOS.md)
- [Gerar Certidão de Documento Oficial com Sigilo](../pages/CERTIDAOSIGILO.md)
- [Enviar múltiplas imagens, formatar e editar opções avançadas](../pages/EDITARIMAGENS.md)
- [Reduzir a qualidade das imagens inseridas nos documentos](../pages/QUALIDADEIMAGENS.md)
- [Salvar documentos automaticamente](../pages/SALVAMENTOAUTOMATICO.md)
