# Política de Privacidade — SEI Pro ![SEI Pro](/img/icon-32.png)

**Versão:** 3.6  
**Data de Vigência:** 25 de outubro de 2026  
**Última Atualização:** 25 de outubro de 2026

---

## 1. Introdução

Esta Política de Privacidade descreve como a extensão de navegador **SEI Pro** trata dados. Ela diz o que fica guardado no navegador, quais funções se comunicam com serviços fora do SEI, em que condições isso acontece, o que é enviado e para quem. O texto segue a Lei nº 13.709, de 14 de agosto de 2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).

O SEI Pro é uma extensão gratuita e de código aberto, licenciada sob AGPL-3.0. Ela acrescenta funcionalidades ao Sistema Eletrônico de Informações (SEI): na página inicial, na tela de processos e no editor de textos.

---

## 2. Princípios

### 2.1. O que o SEI Pro não faz

- **Não coleta dados para o desenvolvedor.** Não há telemetria, estatística de uso, registro de atividade nem identificação de usuários. A única ressalva é o registro técnico mínimo da API de legislação, sem endereço IP nem termos pesquisados (seção 2.3).
- **Não rastreia a navegação.** A extensão atua apenas nas páginas do SEI e não lê outros sites.
- **Não envia a senha nem a sessão do SEI a terceiros.** A senha digitada para assinar documentos vai apenas ao próprio SEI.
- **Não vende, não compartilha e não usa dados para publicidade.**

### 2.2. Funcionamento padrão

Nas funções comuns, o SEI Pro funciona dentro do navegador. Ele se comunica apenas com o servidor SEI do próprio órgão, usando a sessão já aberta pelo usuário, e as configurações ficam no próprio navegador (seção 3).

Algumas **funções opcionais** enviam dados a serviços fora do SEI. Elas só funcionam quando o usuário as aciona e estão todas listadas na seção 4.

### 2.3. Servidores do projeto

O SEI Pro **não tem servidor de coleta de dados**. Não há banco de dados remoto com informações de usuários nem serviço de análise ou perfilamento.

O projeto mantém a **API de legislação** (`legis.seipro.app`), usada pelas funções Legística e Link Legis. Ela recebe apenas o tipo, o número e o ano da norma, ou os termos pesquisados, e responde com os dados da legislação correspondente, montados a partir dos dados abertos do Senado Federal. O texto do documento nunca é enviado.

A API não tem cadastro de usuários, não guarda as consultas e **não registra os termos pesquisados**. As consultas passam pela Cloudflare (Cloudflare, Inc., Estados Unidos), que protege o serviço contra ataques e as repassa ao servidor do projeto. A API usa o endereço IP de origem apenas para limitar a quantidade de consultas por minuto, sem gravá-lo.

A API roda num servidor do próprio projeto, contratado da Hostinger e localizado no Brasil. Esse servidor **não mantém registro de acesso com endereço IP nem com a identificação do navegador**. Para cada consulta, a API anota apenas o horário, o tipo de consulta (o molde do endereço, por exemplo `/v1/normas`, sem os termos pesquisados nem o número ou o nome da norma), o resultado e o tempo de resposta. Esse registro serve só para a operação do serviço, não identifica ninguém e é descartado à medida que é substituído por registros mais novos. A Cloudflare, por onde as consultas passam, mantém os próprios registros técnicos, nos termos da [política de privacidade dela](https://www.cloudflare.com/privacypolicy/).

O navegador também informa ao serviço o endereço do SEI de onde a consulta partiu, o que identifica o órgão; esse dado não fica no registro da API.

O site de documentação (`seipro.app`) é um site comum e não usa ferramentas de estatística.

O site também oferece a **lista de novidades por e-mail**, opcional e independente da extensão (seção 2.5). Para quem se inscreve, o projeto guarda o endereço de e-mail.

### 2.4. Fundamentação legal

| Princípio (art. 6º da LGPD) | Aplicação no SEI Pro |
|---|---|
| **Finalidade** | Os dados são usados só para executar a função pedida pelo usuário |
| **Adequação** | Cada função envia apenas o que é preciso para a tarefa, ao serviço que a executa |
| **Necessidade** | Nada é enviado por padrão; as funções que se comunicam com serviços externos dependem de ação do usuário |
| **Transparência** | Esta política lista cada função, o dado enviado e o destinatário |
| **Segurança** | Armazenamento no navegador, conexões cifradas e proteções específicas no Agente de IA (seção 4.2) |
| **Prevenção** | Documentos sigilosos não são lidos pelo Agente de IA, e toda ação no SEI exige aprovação do usuário |

<a id="novidades-por-e-mail"></a>

### 2.5. Novidades por e-mail

A inscrição é opcional e acontece no site (`seipro.app` e `novidades.seipro.app`), nunca pela extensão. A extensão não sabe se você está inscrito.

| Item | Como funciona |
|---|---|
| **Dados guardados** | Endereço de e-mail, data da inscrição e a página em que ela foi feita |
| **Finalidade** | Enviar um aviso a cada versão nova do SEI Pro, com dicas de uso, e comunicados sobre o projeto. A lista não é vendida nem compartilhada, e não recebe publicidade de terceiros |
| **Base legal** | Consentimento (art. 7º, I, da LGPD). O endereço só entra na lista depois que a pessoa clica em "Confirmar inscrição" no e-mail de confirmação, e um pedido não confirmado em 7 dias perde o efeito |
| **Proteção contra abuso** | As páginas que exibem o formulário carregam o Cloudflare Turnstile, que verifica se quem envia é uma pessoa. O serviço conta os pedidos por endereço IP e por e-mail apenas na memória, por até 24 horas, sem gravar |
| **Medição** | Os e-mails não levam rastreamento de abertura nem de cliques |
| **Operador** | O Resend (Resend, Inc., Estados Unidos) guarda a lista e envia as mensagens, nos termos da [política de privacidade do Resend](https://resend.com/legal/privacy-policy) |
| **Saída** | O link "Cancelar inscrição", no rodapé de qualquer e-mail, tira o endereço da lista na hora. Também é possível pedir pelos canais da seção 10.2. Depois do cancelamento, o endereço fica marcado como descadastrado e não recebe mais mensagens, a menos que a pessoa se inscreva e confirme de novo |

---

## 3. Armazenamento no navegador

### 3.1. Onde os dados ficam

O SEI Pro guarda configurações e dados de trabalho **no dispositivo do usuário**, usando os recursos do próprio navegador:

- **Local Storage e Session Storage:** preferências e dados temporários de uso nas páginas do SEI;
- **Storage API do navegador (`storage.local`, `storage.sync` e `storage.session`):** configurações da extensão. O `storage.sync` é sincronizado entre os dispositivos do usuário pela conta do navegador (Google, Microsoft ou Mozilla), se a sincronização estiver ativada;
- **IndexedDB:** dados estruturados, como o histórico de processos visitados, as conversas do Agente de IA e as cópias automáticas diárias (as 14 mais recentes) dos Processos Monitorados, dos Projetos e das Demandas, que o usuário pode restaurar;
- **Textos Padrão do SEI (opcional, para compartilhar com a unidade):** os Processos Monitorados, os Projetos e as Demandas podem guardar a lista **da unidade** em Textos Padrão do próprio SEI, para que os colegas que usam a extensão vejam os mesmos dados. Esse caso tem regras próprias e está descrito na seção 3.5;
- **Arquivo escolhido pelo usuário (opcional):** os mesmos módulos podem gravar uma cópia num arquivo do computador, na pasta que o usuário escolher (seção 3.5). O Agente de IA também pode manter um backup completo num arquivo assim (seção 3.6).

#### O que é sincronizado entre dispositivos

Quando a sincronização do navegador está ativada, acompanham a conta do usuário:

- as **opções do SEI Pro** marcadas na página de configurações, a ordem e a visibilidade dos painéis do Controle de Processos, inclusive os dados de conexão da função **Base de Dados** — endereço, identificador de cliente e chave de API do serviço que o próprio usuário indicou (seção 4.3);
- a **configuração do Agente de IA**: serviço escolhido, modelo, ajustes, instruções adicionais, limites de gasto, regras da unidade, memória da unidade, rotinas, fluxos, coleções de skills e, das skills, apenas nome, atalho e o endereço do arquivo de origem;
- os **conectores (servidores MCP)** cadastrados: nome, endereço, situação e a permissão dada a cada ferramenta.

**Permanecem somente no dispositivo em que foram informados:**

- a **chave de API do serviço de IA**;
- o **token de autenticação dos conectores**;
- o **texto das skills** criadas diretamente no painel (as que vêm de um repositório viajam apenas como endereço);
- as conversas guardadas, o gasto diário, o histórico de execuções das rotinas e o catálogo de ferramentas dos conectores.

A exceção é o **backup em arquivo do Agente de IA** (seção 3.6), que o usuário liga se quiser: ele leva ao arquivo também as conversas, o texto das skills e o histórico das rotinas — e a chave e os tokens apenas se o usuário marcar essa opção.

Esses dados trafegam pela infraestrutura do fabricante do navegador, nunca por servidores do SEI Pro. O usuário pode desligar a sincronização nas configurações do próprio navegador; nesse caso, tudo passa a ficar apenas no dispositivo.

### 3.2. Tipos de dados

| Tipo de dado | Finalidade | Onde fica |
|---|---|---|
| Configurações e preferências | Personalizar a extensão | Navegador; sincronizadas pela conta do navegador, se ativado |
| Processos Monitorados (antes chamados Favoritos), marcadores e valores padrão | Organização e agilidade no SEI | Navegador; a lista da unidade, só se o usuário confirmar, também em Texto Padrão do SEI (seção 3.5) |
| Projetos (nome, fases, etapas, responsáveis, prazos, processos vinculados e histórico de alterações) | Acompanhar projetos | Navegador; os da unidade, só se o usuário confirmar, também em Texto Padrão do SEI (seção 3.5) |
| Demandas (título, descrição, responsável, prazo, etiquetas, lista de tarefas, tempos, avaliação, processos vinculados e histórico) | Distribuir e acompanhar o trabalho | Navegador; as da unidade, só se o usuário confirmar, também em Texto Padrão do SEI (seção 3.5); arquivo local opcional |
| Prazos do Controle de Prazos | Acompanhar vencimentos de processos | No próprio SEI: controle de prazo do processo e marcador do processo (seção 3.5) |
| Histórico de processos visitados | Navegação entre processos recentes | Navegador |
| Endereço e chave do servidor de Atividades (seção 4.3) | Conectar ao servidor do órgão | Navegador; sincronizados pela conta do navegador, se ativado |
| Chave de API do serviço de IA | Usar o Agente de IA | Somente neste navegador (não é sincronizada); vai ao arquivo de backup do agente só se o usuário marcar a opção (seção 3.6) |
| Conversas do Agente de IA | Reler conversas anteriores | Navegador, com prazo de guarda escolhido pelo usuário (7, 30 ou 90 dias, ou sem limite); o recurso pode ser desligado; arquivo de backup opcional (seção 3.6) |
| Tabela de pseudônimos do Agente de IA | Restaurar os dados reais nas respostas | Memória temporária; apagada ao fechar o navegador |
| Conectores (MCP): endereço, situação e permissões | Usar ferramentas externas no Agente de IA | Navegador; sincronizados pela conta do navegador, se ativado |
| Token de autenticação dos conectores | Acessar o serviço indicado pelo usuário | Somente neste navegador (não é sincronizado); vai ao arquivo de backup do agente só se o usuário marcar a opção (seção 3.6) |
| Backup do Agente de IA (configuração, conversas, memória, instruções, skills, regras, rotinas, conectores e fluxos) | Levar o agente a outro computador | Arquivo `.json` escolhido pelo usuário; opcional (seção 3.6) |
| Lote das Ações em Lote em andamento (números SEI dos documentos, ações escolhidas e situação de cada etapa; nunca a senha de assinatura) | Retomar um lote interrompido | Navegador, só neste computador; apagado quando o lote termina ou é descartado |
| Rotinas do Agente de IA e seu histórico de execuções | Repetir tarefas que o usuário programou | Navegador; as rotinas são sincronizadas, o histórico não |

### 3.3. Controle do usuário

- **Visualização e alteração:** as configurações ficam acessíveis na página de opções da extensão e no painel do Agente de IA.
- **Exclusão:** o usuário pode apagar as conversas do agente no próprio painel. A desinstalação apaga os dados guardados nas áreas da extensão. Parte das preferências fica no armazenamento da página do SEI e é apagada ao limpar os dados do site do SEI nas configurações do navegador.

### 3.4. Segurança do armazenamento

Os dados guardados no navegador **não são criptografados pela extensão**. A segurança deles depende do navegador, do dispositivo e das políticas de acesso do órgão. Em ambientes com requisitos elevados, recomenda-se:

- usar dispositivos gerenciados;
- aplicar criptografia de disco;
- bloquear a sessão automaticamente;
- restringir o acesso físico aos equipamentos.

### 3.5. Dados que o usuário escolhe compartilhar com a unidade

Alguns módulos permitem trabalhar em equipe sem servidor do SEI Pro. Para isso usam recursos do próprio SEI e do computador do usuário:

- **Textos Padrão do SEI.** Os Processos Monitorados, os Projetos e as Demandas podem gravar a lista **da unidade** em Textos Padrão do SEI, cujos nomes começam por `[_SEIPRO_`. O SEI Pro cria, lê e atualiza esses textos sozinho, com a sessão do próprio usuário. **Eles ficam no SEI do órgão, e não em servidor do SEI Pro.** Por serem Textos Padrão da unidade, **podem ser vistos e alterados por quem tem acesso aos Textos Padrão daquela unidade**, inclusive pela tela do SEI, e ocupam espaço (cada texto aceita até 100 KB).
- **Quando isso acontece.** A gravação em Texto Padrão só começa depois que o usuário confirma o aviso ("Entendi"), na primeira vez, em cada unidade. Ler os textos que os colegas gravaram não altera nada no SEI. O que o usuário marca como "só meu" fica no navegador. As Demandas e os Projetos têm uma opção de guardar também os dados "só meus" em Texto Padrão; ela vem **desligada** e só se liga por escolha do usuário, e esse texto, por estar no SEI, também é visível a quem acessa os Textos Padrão da unidade. Os Processos Monitorados nunca enviam a lista pessoal.
- **O que vai.** Processos Monitorados: os processos da lista da unidade e os dados de organização associados. Projetos: nomes, fases, etapas, responsáveis, datas, números de processos vinculados e o histórico de alterações. Demandas: título, descrição, responsável, datas, etiquetas, lista de tarefas, tempos, avaliação, processos vinculados e o histórico de alterações. **O que o usuário digita em títulos, descrições e observações vai exatamente como foi escrito:** não se deve incluir dados sigilosos ou pessoais desnecessários nesses campos.
- **Processos sigilosos.** O número de processo ou de documento sigiloso não é gravado nos Textos Padrão pelos Projetos e pelas Demandas, e os Processos Monitorados guardam desses processos apenas um aviso, sem número nem anotações. O número continua só no navegador do próprio usuário.
- **Arquivo no computador.** O usuário pode escolher um arquivo, por exemplo numa pasta sincronizada pela nuvem corporativa do órgão, para guardar uma cópia desses dados e levá-la a outro computador. A extensão apenas lê e grava esse arquivo, nunca o envia a servidor do SEI Pro; o conteúdo, inclusive os números de processos sigilosos do próprio usuário, fica sob a guarda de quem escolhe a pasta.
- **Controle de Prazos.** O prazo informado é gravado no controle de prazo do próprio SEI (a partir do 4.1.5) e, quando o usuário informa hora, texto ou data inicial, também no marcador do processo. Ficam visíveis a quem acessa o processo, como qualquer prazo ou marcador do SEI.
- **Como parar.** Basta desligar o módulo na página de configurações. Os textos já gravados permanecem no SEI até serem excluídos em Textos Padrão, pelo próprio SEI.

Os módulos de Projetos e de Demandas descritos aqui **não** usam o servidor do órgão da seção 4.3.

### 3.6. Backup em arquivo do Agente de IA

O Agente de IA pode guardar uma cópia completa de si mesmo num arquivo `.json` escolhido pelo usuário, normalmente numa pasta sincronizada pela nuvem (OneDrive, Google Drive ou a nuvem corporativa do órgão), para usá-la em outro computador.

- **Quando acontece:** só se o usuário ligar a função em Configuração → Backup em arquivo, escolhendo o arquivo. A partir daí, a extensão grava o arquivo alguns segundos depois de cada mudança e o lê ao abrir o painel. Também há Exportar e Importar manuais.
- **O que vai:** a configuração do agente, as conversas guardadas (se o recurso de guardar conversas estiver ligado), a memória da unidade, as instruções, as skills (inclusive o texto das coladas à mão), as regras, as rotinas e o histórico de execuções, os conectores e os fluxos.
- **Segredos:** a chave de API do serviço de IA e os tokens dos conectores **só vão ao arquivo se o usuário marcar essa opção**, que vem desmarcada e vale apenas para o computador em que foi marcada. Quem tiver acesso à pasta do arquivo poderá usar essas credenciais.
- **Para onde vai:** a extensão apenas lê e grava o arquivo no computador do usuário. **Nada é enviado a servidor do SEI Pro.** Se a pasta for sincronizada por um serviço de nuvem, o conteúdo segue as regras desse serviço e do órgão, e fica sob a guarda de quem escolheu a pasta. As conversas podem conter trechos de documentos do SEI lidos pelo agente.
- **Proteção contra arquivo alterado:** como a pasta pode ser editada por outras pessoas, ler o arquivo sempre mescla com o que já existe no computador e nunca apaga nada dele; rotinas e conectores que chegam pelo arquivo entram desligados, e o arquivo nunca libera permissões de um conector.
- **Como parar:** desligar a função em Configuração → Backup em arquivo (opção *Esquecer arquivo*) e, se quiser, apagar o arquivo da pasta.

---

## 4. Funções que se comunicam com serviços externos

### 4.1. Regras gerais

- **Nenhuma dessas funções envia dados sem ação do usuário.** Elas dependem de um clique, de um botão no editor ou de uma configuração feita pelo próprio usuário.
- **Os dados vão do navegador diretamente ao serviço indicado.** Nada passa por servidor do SEI Pro, exceto a consulta à API de legislação (seção 2.3).
- **Valem as políticas de cada serviço.** Os dados enviados a terceiros seguem a política de privacidade de quem os recebe.
- **Cabe ao usuário e ao órgão avaliar o uso.** Informações sigilosas e dados pessoais não devem ser enviados a serviços externos sem autorização institucional.

### 4.2. Agente de IA

- **Quando funciona:** só depois que o usuário abre o painel do agente e cadastra uma **chave de API própria**. Sem chave, nenhuma conversa é enviada. O usuário também pode cadastrar **rotinas**: pedidos que ele escreve uma vez e manda repetir em um horário. Nesse caso o envio acontece sem ele digitar na hora, mas sempre a partir do pedido que ele próprio cadastrou, com o agente aberto no seu navegador e usando a sua sessão do SEI. Uma rotina só altera o SEI se o usuário tiver autorizado essa rotina, ferramenta por ferramenta; exclusão, cancelamento e assinatura nunca são feitos por rotina.
- **Destinatário:** o serviço de IA escolhido pelo usuário:
  - OpenRouter (pré-selecionado);
  - OpenAI;
  - Google Gemini;
  - Anthropic;
  - outro endereço compatível informado pelo usuário, que pode ser um servidor do próprio órgão.
- **O que é enviado:**
  - o pedido digitado e os arquivos que o usuário anexar à conversa. Um **PDF anexado é lido no próprio computador** — com reconhecimento de texto (OCR) local nas páginas digitalizadas — e **só o texto extraído** é enviado; o arquivo em si não sai do navegador;
  - o contexto da tela: sigla da unidade; número, tipo e nível de acesso do processo aberto; número e título do documento em visualização;
  - o resultado das consultas que o agente faz no SEI para cumprir o pedido: texto dos documentos lidos, árvore do processo, andamentos, resultados de pesquisa e dados da caixa de processos;
  - as instruções e skills cadastradas pelo usuário e as anotações da memória da unidade.
- **Anonimização:**
  - Antes de sair do navegador, o texto passa por uma substituição automática de dados pessoais por rótulos, como [PESSOA_1] e [CPF_2]. Ela cobre CPF, e-mail, telefone, CEP, RG, título de eleitor, CNH, cartão, chave PIX, dados bancários, endereço, CID e nomes de pessoas.
  - O mascaramento de CNPJ é opcional.
  - A tabela que liga rótulos a valores reais fica só no navegador.
  - **Limitação:** a substituição funciona por padrões e não garante a remoção de todo dado pessoal. Nomes são reconhecidos pelo contexto ou quando constam como interessados do processo. O contexto da tela e as instruções do usuário são enviados sem substituição.
- **Sigilo:**
  - Processos e documentos **sigilosos nunca são lidos**.
  - Documentos **restritos** só são lidos com autorização do usuário, pedida a cada conversa. Dados de identificação, como número e título, podem ser enviados sem esse pedido.
- **Conteúdo dos documentos tratado como dado:** antes de ser enviado ao serviço de IA, o conteúdo lido dos processos passa por uma verificação local, no próprio navegador, que identifica (a) trechos que o documento esconde da tela por recursos de formatação, (b) caracteres invisíveis e (c) textos redigidos como ordem dirigida a sistemas de inteligência artificial. Esses trechos são **marcados, não removidos** — o documento é preservado na íntegra — e o resultado é mostrado ao usuário como verificação de integridade. Nenhuma instrução encontrada em documento é executada pelo agente.
- **Ações no SEI:** nenhuma ação é executada sem aprovação do usuário, caso a caso. Isso vale para criar, editar, assinar, enviar e as demais ações. A senha de assinatura é digitada pelo usuário e enviada somente ao SEI.
- **Retenção pelo serviço de IA:**
  - No OpenRouter, o pedido exige que ele só seja encaminhado a provedores que não guardam os dados nem os usam para treinar modelos.
  - Nos demais serviços, valem os termos do contrato do usuário ou do órgão com o fabricante.
- **Outras consultas do painel** (nenhuma leva dados do usuário ou do SEI):
  - **cotação do dólar:** para mostrar o custo em reais, consultada no Banco Central (`olinda.bcb.gov.br`), com a AwesomeAPI (`economia.awesomeapi.com.br`) como reserva. A conversão pode ser desligada;
  - **catálogo de modelos:** a lista pública de modelos do serviço escolhido;
  - **arquivos de skills e coleções:** baixados dos endereços que o usuário cadastrar, como pastas do GitHub (`api.github.com`, `raw.githubusercontent.com`).
- **Políticas aplicáveis:** [OpenRouter](https://openrouter.ai/privacy), [OpenAI](https://openai.com/policies/privacy-policy), [Google](https://policies.google.com/privacy), [Anthropic](https://www.anthropic.com/legal/privacy).

### 4.2.1. Conectores (servidores MCP) do Agente de IA

- **Quando acontece:** somente se o usuário cadastrar um conector em Configuração → O que o agente pode → Conectores (MCP). Sem conector cadastrado, nada nesta subseção se aplica.
- **Destinatário:** o servidor escolhido pelo próprio usuário, identificado pelo endereço que ele informou. Pode ser um serviço do órgão, um serviço público ou um serviço de terceiro. O SEI Pro não mantém, não indica e não intermedeia nenhum conector.
- **O que é enviado:** apenas os parâmetros da ferramenta que o agente for usar, montados a partir do pedido do usuário e do que foi lido no SEI naquela conversa. Dados pessoais são mascarados antes do envio, pelo mesmo mecanismo aplicado ao serviço de IA (seção 4.2).
- **Autorizações exigidas, em três camadas:**
  1. o navegador pede ao usuário a permissão de acesso ao endereço do conector, no momento em que ele testa a conexão;
  2. na primeira chamada a cada conector, o agente pede autorização explícita, informando que o conteúdo sairá do navegador para aquele endereço;
  3. cada ferramenta do conector tem a permissão que o usuário definir — sempre permitir, requer aprovação (padrão) ou bloqueado. Em "requer aprovação", o usuário vê o conteúdo exato antes do envio.
- **O que fica guardado:** endereço, nome, token de autenticação, lista de ferramentas e permissões, somente no navegador do usuário. O token não é sincronizado (seção 3.1).
- **Retenção pelo servidor do conector:** regida pelos termos do serviço escolhido pelo usuário. O SEI Pro não tem como conhecê-los nem como garanti-los.
- **O conector não altera o SEI:** ele oferece ferramentas externas. Qualquer alteração no SEI continua dependendo da aprovação do usuário.

### 4.3. Gestão de Atividades, Projetos e Prescrições

- **Escopo:** esta seção trata do gerenciador de **Atividades** (e de Prescrições) que usa servidor do órgão. Os gerenciadores novos de Projetos e de Demandas não usam servidor: veja a seção 3.5.
- **Natureza:** o módulo não é um serviço público do SEI Pro. Ele depende de um **servidor mantido pelo órgão** que o adota. O endereço e a chave de acesso são fornecidos pela área responsável do órgão. Sem essa configuração, o módulo não envia dados.
- **Destinatário:** exclusivamente o servidor do órgão, que é quem controla esses dados.
- **Onde ficam as credenciais:** o endereço, o identificador de cliente e a chave de API ficam no navegador e, com a sincronização ativada, **acompanham a conta do navegador do usuário**, como as demais opções do SEI Pro (seção 3.1).
- **O que é enviado, depois de configurado:**
  - em toda chamada: a chave de acesso do usuário e a sigla da unidade;
  - ao abrir um processo: o número dele, para exibir as demandas vinculadas;
  - ao salvar demandas, afastamentos, prescrições ou projetos: os dados preenchidos pelo usuário e os números dos documentos SEI relacionados;
  - se o servidor do órgão habilitar: os processos favoritos (número, especificação, interessados e tipo) e relatórios de erro, que podem incluir captura de tela e registro técnico da página.
- **O que não é enviado:** o conteúdo dos documentos e a senha.
- **Integração com o PGD:** o envio de dados ao Programa de Gestão e Desempenho (API do PGD) é feito pelo servidor do órgão, não pelo navegador, e só quando o órgão ativa essa integração.

### 4.4. Demais funções

| Função | Quando | Destinatário | O que é enviado |
|---|---|---|---|
| **Legística e Link Legis** (busca de normas) | Ao pesquisar, inserir ou atualizar referências a normas no editor | API de legislação do SEI Pro (`legis.seipro.app`), por meio da Cloudflare | Tipo, número e ano da norma, ou os termos pesquisados. O texto do documento não é enviado, e os termos pesquisados não são registrados. A API guarda só um registro técnico mínimo, sem endereço IP (seção 2.3) |
| **Equações (LaTeX)** | Ao gerar uma equação no editor | CodeCogs (`latex.codecogs.com`) | O texto da fórmula. A imagem gerada fica gravada no documento |
| **Link curto** | Ao pedir um link curto no editor | TinyURL (`tinyurl.com`) | O endereço a encurtar |
| **Importar Google Docs ou Planilhas** | Ao importar um documento publicado | Google (`docs.google.com`) | O pedido do documento cujo link o usuário informou. Nada do SEI é enviado |
| **Mapa dos Monitorados** | Ao abrir o mapa ou pesquisar um endereço | OpenStreetMap (`tile.openstreetmap.org`, `nominatim.openstreetmap.org`) | A área exibida no mapa e o endereço digitado. Dados do processo não são enviados, e a localização do dispositivo não é solicitada |
| **Ditado por voz** | Ao ditar texto no editor | Serviço de reconhecimento de voz do navegador (Google no Chrome, Microsoft no Edge) | O áudio ditado, para transcrição. O SEI Pro não recebe nem guarda o áudio |
| **Estúdio de Fluxo** | Ao importar coleções de fluxos ou usar "Aprender de processo modelo" | GitHub e o serviço de IA configurado no Agente | O endereço da coleção. No aprendizado: títulos de documentos, unidades e descrições de andamentos do processo modelo |
| **Aviso de novidades** | Ao instalar ou atualizar a extensão | Site do SEI Pro (`seipro.app`) | Abre uma aba com a página de novidades, como uma visita comum ao site |

Políticas aplicáveis: [CodeCogs (termos de uso)](https://www.codecogs.com/terms), [TinyURL](https://tinyurl.com/app/privacy-policy), [Google](https://policies.google.com/privacy), [OpenStreetMap Foundation](https://osmfoundation.org/wiki/Privacy_Policy), [Microsoft](https://privacy.microsoft.com/pt-br/privacystatement), [GitHub](https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement).

### 4.5. Controle institucional

A extensão **ainda não oferece configuração centralizada** por política de grupo. Os órgãos têm dois caminhos para controlar o uso:

- **Orientar os usuários:** as funções opcionais podem ser desligadas nas opções da extensão ou simplesmente não usadas. O Agente de IA não funciona sem uma chave cadastrada pelo próprio usuário.
- **Bloquear na rede:** para ter uma garantia técnica independente da configuração de cada usuário, basta bloquear no proxy ou no firewall os destinos que o órgão não quiser permitir. Os principais são:
  - `openrouter.ai`, `api.openai.com`, `generativelanguage.googleapis.com`, `api.anthropic.com` (Agente de IA);
  - `olinda.bcb.gov.br`, `economia.awesomeapi.com.br` (cotação do dólar);
  - `api.github.com`, `raw.githubusercontent.com` (skills e coleções de fluxos);
  - `legis.seipro.app` (busca de normas);
  - `latex.codecogs.com` (equações);
  - `tinyurl.com` (link curto);
  - `docs.google.com` (importação do Google);
  - `tile.openstreetmap.org`, `nominatim.openstreetmap.org` (mapa).

---

## 5. Permissões do navegador

### 5.1. Permissões solicitadas

| Permissão | Justificativa |
|---|---|
| `storage` | Guardar configurações e preferências no navegador |
| `sidePanel` (Chrome e Edge) ou painel lateral (Firefox) | Exibir o painel do Agente de IA |
| Acesso às páginas do SEI | Os scripts da extensão só são carregados em endereços de instalações do SEI e do SIP (por exemplo, `/sei/`, `/sip/` e `controlador.php`, em domínios `.br` e `.org`) |
| `alarms` (Chrome e Edge) | Marcar o horário das rotinas que o próprio usuário cadastra no Agente de IA. Nenhum dado sai do navegador por causa dela |
| `notifications` (opcional) | Avisar quando uma rotina do Agente de IA termina ou fica pendente. É pedida **somente** quando o usuário marca "avisar quando terminar"; recusada, a extensão funciona normalmente e nenhuma notificação é mostrada |
| Acesso opcional a outros endereços (`https://*/*`, `localhost`) | Pedido **somente** quando o usuário configura, no Agente de IA, um serviço diferente do OpenRouter, e **apenas para o endereço desse serviço**. O navegador mostra o pedido e o usuário decide |
| Acesso opcional ao endereço de um conector (MCP) | Pedido **somente** quando o usuário cadastra um conector e testa a conexão, e **apenas para o endereço daquele conector** |

### 5.2. Menor privilégio

- A extensão não pede acesso permanente a todos os sites.
- O acesso opcional é pedido um endereço por vez, com confirmação do usuário.
- A extensão não lê nem altera sites que não sejam o SEI.

---

## 6. Código aberto e auditabilidade

### 6.1. Transparência

O SEI Pro é um projeto de **código aberto**, e todo o comportamento descrito nesta política pode ser conferido no código.

- **Repositório:** [https://github.com/sei-pro/sei-pro](https://github.com/sei-pro/sei-pro)
- **Licença:** AGPL-3.0 (GNU Affero General Public License v3.0)
- **Histórico:** todas as alterações ficam registradas publicamente
- **Issues:** canal aberto para relatar problemas e sugestões

### 6.2. Distribuição oficial

A extensão é distribuída pelos canais oficiais:

- **Chrome Web Store:** [SEI Pro na Chrome Web Store](https://chrome.google.com/webstore/detail/sei-pro/pdbbapplhjopafpgidbgceccbbmehcjj)
- **Microsoft Edge Add-ons:** [SEI Pro no Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/sei-pro/gkhfbbbminanojfklpfmloaglckmlfne)
- **Firefox Add-ons:** [SEI Pro no Firefox Add-ons](https://addons.mozilla.org/pt-BR/firefox/addon/sei-pro/)

---

## 7. Direitos do titular (LGPD)

O desenvolvedor do SEI Pro **não recebe nem guarda dados pessoais dos usuários**. Por isso, os direitos previstos no art. 18 da LGPD se exercem assim:

- **Dados guardados no navegador:** o próprio usuário pode consultar, corrigir e apagar, pela extensão ou pelas configurações do navegador.
- **Dados enviados ao servidor de Atividades:** o controlador é o órgão que mantém o servidor. Os pedidos devem ser dirigidos a ele.
- **Dados enviados a serviços de terceiros** (serviço de IA, Google, OpenStreetMap e demais da seção 4): valem as políticas e os canais desses serviços.
- **Revogação:** o usuário pode desligar as funções opcionais ou desinstalar a extensão a qualquer momento.

Para esclarecimentos sobre esta política, use os canais da seção 10.

---

## 8. Crianças e adolescentes

O SEI Pro é uma ferramenta de trabalho destinada à Administração Pública. Ela não é direcionada a menores de 18 anos e não coleta dados de nenhum usuário, inclusive menores.

---

## 9. Segurança da informação

### 9.1. Medidas técnicas

- **Execução no navegador:** o SEI Pro não mantém dados de usuários fora do dispositivo.
- **Conexões cifradas:** os serviços externos da seção 4 são acessados por HTTPS. Endereços próprios informados pelo usuário ou pelo órgão (serviço de IA próprio, servidor de Atividades) seguem a configuração de quem os mantém.
- **Proteções do Agente de IA:**
  - substituição de dados pessoais antes do envio;
  - bloqueio de documentos sigilosos;
  - consentimento para documentos restritos;
  - aprovação de cada ação no SEI;
  - verificação local do conteúdo dos documentos, que marca instruções dirigidas a sistemas de inteligência artificial e trechos escondidos da tela, sem alterar o documento (seção 4.2);
  - delimitação do conteúdo enviado ao modelo, para que texto vindo de documento não possa se passar por instrução.
- **Restrição de código:** a extensão só executa código do próprio pacote; não carrega scripts de fora.
- **Código aberto e atualizações:** o código é auditável e as correções são publicadas no repositório e nas lojas.

### 9.2. Limitações

A segurança também depende de fatores externos: o dispositivo do usuário, as configurações do navegador, as políticas do órgão e as atualizações do sistema operacional.

### 9.3. Incidentes de segurança

1. Vulnerabilidades podem ser comunicadas pelo repositório no GitHub (Issues ou Security Advisories).
2. A vulnerabilidade é analisada e corrigida com prioridade.
3. Uma nova versão é publicada nas lojas de extensões.
4. Os usuários são avisados conforme a gravidade do incidente.

---

## 10. Identificação do desenvolvedor

### 10.1. Desenvolvedor

**Nome:** Pedro Henrique Soares  
**Vínculo:** Servidor Público Federal — Agência Nacional de Transportes Aquaviários (ANTAQ)  
**Função:** Desenvolvimento voluntário, sem fins lucrativos

### 10.2. Canais de contato

- **Repositório GitHub:** [https://github.com/sei-pro/sei-pro](https://github.com/sei-pro/sei-pro)
- **Issues:** [https://github.com/sei-pro/sei-pro/issues](https://github.com/sei-pro/sei-pro/issues)
- **Comunidade:** [Fórum ParticiPEN](https://www.gov.br/participamaisbrasil/sei-pro)

### 10.3. Suporte institucional

Questões sobre compatibilidade ou uso institucional podem ser levadas aos canais do projeto ou discutidas no fórum da comunidade ParticiPEN.

---

## 11. Alterações nesta política

### 11.1. Atualização

Esta política é revisada sempre que uma função nova passa a se comunicar com um serviço externo, ou quando mudam as exigências legais.

### 11.2. Aviso de alterações

As alterações relevantes são comunicadas:

- pela data de vigência no início deste documento;
- pela publicação no repositório GitHub;
- pelo histórico de versões da extensão.

### 11.3. Histórico de versões

| Versão | Data | Principais alterações |
|---|---|---|
| 3.6 | 25/10/2026 | A API de legislação passa a rodar em servidor do projeto no Brasil (Hostinger), no lugar do Railway (Estados Unidos); a seção 2.3 descreve o registro técnico mínimo que restou, sem endereço IP, sem identificação do navegador e sem os termos pesquisados |
| 3.5 | 17/10/2026 | Nova seção 3.6: backup em arquivo do Agente de IA (o que vai, segredos só por opção do usuário, nada enviado a servidor do SEI Pro, proteção contra arquivo alterado); anexo de PDF no Agente lido no computador, com só o texto enviado (seção 4.2); inventário em 3.1 e 3.2 atualizado, inclusive o lote em andamento das Ações em Lote, guardado só no navegador |
| 3.4 | 10/10/2026 | Nova seção 3.5: dados que o usuário escolhe compartilhar com a unidade (Textos Padrão do SEI dos Processos Monitorados, Projetos e Demandas, arquivo no computador e prazos gravados no SEI); inventário em 3.1 e 3.2 atualizado (cópias diárias, ordem dos painéis, Projetos, Demandas, Prazos); Favoritos passa a se chamar Monitorados; a seção 4.3 esclarece que trata só do servidor do órgão |
| 3.3 | 04/10/2026 | Busca de normas passa a usar a API de legislação (`legis.seipro.app`); a extensão deixou de contatar `seipro.io`. A API não registra os termos pesquisados e recebe as consultas por meio da Cloudflare; a política passa a descrever os registros técnicos de acesso mantidos pela hospedagem (o que é registrado, por quem e por quanto tempo) |
| 3.2 | 01/10/2026 | Lista de novidades por e-mail (seção 2.5): inscrição opcional no site com confirmação por e-mail, dados guardados, operador (Resend) e cancelamento |
| 3.1 | 01/10/2026 | Conectores (servidores MCP) configurados pelo usuário; sincronização da configuração do Agente de IA entre dispositivos, com a lista do que viaja e do que fica no aparelho; declaração de que as credenciais da função Base de Dados acompanham a conta do navegador; verificação local do conteúdo dos documentos contra instruções dirigidas a sistemas de IA; rotinas do Agente de IA; permissões `alarms` e `notifications` |
| 3.0 | 28/09/2026 | Revisão completa. Inventário de todas as funções que se comunicam com serviços externos (Agente de IA, módulo de Atividades, busca de normas, equações, ditado, Estúdio de Fluxo e demais), com o dado enviado, a condição e o destinatário; correção da declaração de que a extensão não transmite dados; tabela de permissões atualizada; orientação de controle institucional por bloqueio de rede |
| 2.0 | 14/01/2026 | Reformulação para adequação à LGPD; detalhamento das integrações externas |
| 1.0 | 02/08/2020 | Versão inicial (modelo genérico) |

---

## 12. Disposições finais

### 12.1. Legislação aplicável

Esta política é regida pela legislação brasileira, em especial:

- Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)
- Lei nº 12.965/2014 — Marco Civil da Internet
- Decreto nº 8.771/2016 — Regulamentação do Marco Civil

### 12.2. Foro competente

Fica eleito o foro da comarca de Brasília/DF para dirimir eventuais questões oriundas desta política.

### 12.3. Aceitação

A instalação e o uso da extensão SEI Pro implicam a aceitação desta política. Quem não concordar com ela deve deixar de instalar a extensão ou desinstalá-la.

---

## 13. Glossário

| Termo | Definição |
|---|---|
| **Dado pessoal** | Informação relacionada a pessoa natural identificada ou identificável (art. 5º, I, LGPD) |
| **Tratamento** | Toda operação realizada com dados pessoais: coleta, armazenamento, uso etc. (art. 5º, X, LGPD) |
| **Titular** | Pessoa natural a quem se referem os dados pessoais (art. 5º, V, LGPD) |
| **Controlador** | Pessoa a quem competem as decisões sobre o tratamento de dados pessoais (art. 5º, VI, LGPD) |
| **Pseudonimização** | Substituição de um dado pessoal por um rótulo, de modo que ele não possa ser associado ao titular sem informação guardada à parte (art. 13, § 4º, LGPD) |
| **Chave de API** | Credencial fornecida por um serviço de IA para autorizar e cobrar o uso |
| **LGPD** | Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018 |
| **SEI** | Sistema Eletrônico de Informações |
| **API** | Application Programming Interface — Interface de Programação de Aplicações |

---

**SEI Pro** — Extensão de código aberto para o Sistema Eletrônico de Informações  
Desenvolvido pela comunidade, para a comunidade.
