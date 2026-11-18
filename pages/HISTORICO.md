# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Histórico de Versões](../img/icon-historico.png) Histórico de versões

### Versão 3.9.2
18/11/2026

**Corrigido — o [Agente de IA](../pages/AGENTEIA.md) mascarava números de tabela como telefone** (*SEI Pro Lab*). Numa tabela com percentuais e volumes (por exemplo, "9,5% · 19.000 · 28.500"), os números de células vizinhas eram lidos juntos e confundidos com um celular, e o agente recebia "[TELEFONE_11]" no lugar dos valores. Percentuais, vírgulas e números com separador de milhar não se juntam mais. A mesma correção fechou uma falha no sentido oposto: **telefones listados em sequência, separados por vírgula, não eram mascarados** e chegavam ao modelo de IA como estavam. Agora cada um vira um rótulo. A detecção automática do Tarjar, nas Ferramentas de PDF, usa o mesmo detector e ganhou as duas correções.

**Corrigido — aviso falso de "texto escondido" na verificação de integridade.** Fichas e formulários copiados de páginas da web apareciam como "letra branca sobre fundo branco" (o que estava declarado era o *fundo* branco), e textos colados do navegador apareciam como "caixa de tamanho zero". A verificação agora lê cada propriedade de estilo pelo nome exato e só aponta o que realmente some da tela. Letra branca sobre fundo colorido, como num cabeçalho de tabela, também deixou de ser apontada. Os esconderijos de verdade continuam sendo detectados: letra branca sobre fundo branco, fonte minúscula, texto transparente ou fora da tela.

### Versão 3.9.1
18/11/2026

**Corrigido — pacote da 3.9 recusado pela Chrome Web Store** (*SEI Pro Lab*). A revisão automática da loja encontrou, dentro do leitor de texto de imagens (OCR) usado pelo [Agente de IA](../pages/AGENTEIA.md) e pelas Ferramentas de PDF, endereços de download de um servidor externo que a extensão nunca usou, e recusou a 3.9. Esses endereços foram retirados do pacote. **Nada muda no uso**: o OCR continua rodando no seu computador, com os arquivos que já vêm na extensão, e nenhum código é baixado da internet. Esta versão traz tudo o que a 3.9 trouxe.

### Versão 3.9
17/11/2026

**Novo — árvore do processo refeita** (*SEI Pro Lab*, Chrome e Edge). A árvore, a [capa do processo](../pages/CAPAPROCESSO.md) e o menu do documento ganharam uma versão nova, mais rápida e que não depende mais da janela oculta que o SEI Pro mantinha aberta por trás da tela.

- **[Capa do processo](../pages/CAPAPROCESSO.md)** com faixa de cards (árvore e histórico), **alerta de processo parado** (por padrão, 15 dias sem andamento; a opção *Dias para o alerta de processo parado* aceita 0 para desligar), **copiar resumo** e QR Code próprio. Nos processos com pastas fechadas, a capa **estima** o total de documentos e diz "nas pastas abertas" quando o número é parcial; o botão **Contar tudo** abre as pastas, uma por vez, para a contagem exata.
- **Filtro da árvore:** uma lupa ao lado dos monitorados abre a busca, com os atalhos **Não assinados**, **Externos** e **Cancelados**. O filtro só esconde linhas (nada é alterado no processo), carrega as pastas fechadas com **progresso, parar e tentar de novo**, e fechar a lupa limpa o filtro. Vem **ligado** e pode ser desligado nas Configurações.
- **Menu da árvore agrupado** em *Copiar*, *Abrir* e *Ações*, no lugar do menu rápido antigo, e **[Personalizar menu rápido](../pages/MENURAPIDO.md)** em tela nova: quatro abas, interruptores, busca, ordem e **restaurar padrão**, aplicada na hora no menu, nos ícones fixos e nos painéis. As suas escolhas anteriores continuam valendo.
- **Gantt do processo** desenhado pelo próprio SEI Pro: janela com progresso e cancelamento da coleta, tempo por unidade, **exportar CSV** e **imprimir**. O histórico lido fica guardado por 30 minutos, então abrir de novo é imediato.
- **Painéis** na mesma escala de tamanhos do SEI, com os títulos iguais ao *Consultar Andamento* nativo. A **anotação** agora é editada **no próprio painel**, num post-it (sem abrir janela): o texto cresce com o conteúdo, tem contador, lista de tarefas com **Enter** e **Alt+setas**, e grava ao sair do campo; se der erro, o texto não se perde.
- **Edição pelos painéis:** *assuntos* e *interessados* podem ser editados direto no painel (os de outra unidade ficam protegidos), e os seletores de atribuição, marcador, grupo, tipo e hipótese legal ganharam **busca** (o marcador aparece com a etiqueta na cor).
- **Aviso de documentos não assinados** ao Enviar Processo a partir da árvore e **título da aba** do processo, sem a janela oculta.
- Os ícones de ação rápida ao lado do documento ficaram **maiores e alinhados** com o texto, e o menu rápido do documento não deixa mais um vão que fazia o mouse cruzar o documento de baixo.

**Novo — abrir em outra aba e copiar o número.** Ao lado do número de cada processo da **grade do Controle**, do **[Histórico](../pages/HISTORICOPROC.md)** (janela e aba lateral) e dos **[Monitorados](../pages/FAVORITOS.md)** há agora dois botões: abrir em **nova aba** e **copiar o número** (com confirmação por 1,5 segundo).

**Novo — listas com altura limitada e alça para redimensionar.** A grade do Controle (68% da altura da tela), os Monitorados, as Demandas e as listas dos Projetos passaram a ter **cabeçalho fixo e rolagem interna**, com uma alça no fim para ajustar a altura (arrastando, pelo teclado, ou duplo clique para ajustar ao conteúdo). A altura escolhida é lembrada.

**Também nesta versão**
- **Corrigido — [Documentos em Lote](../pages/DOCUMENTOSEMLOTE.md):** o número do processo não quebra mais em duas linhas, a tabela da Verificação não muda de altura nem de largura ao verificar de novo, o botão de arquivo ficou no padrão visual, o Resultado cabe sem rolagem lateral, *processo de destino* mostra o processo já criado também nas linhas pendentes (e fica vazio só nas que ficaram de fora), e a prévia não traz mais o rodapé "Criado por…" do modelo.
- **Corrigido — filtro "Processos sem atribuição"** (Controle de Processos): a escolha não se perdia mais quando a tabela ainda estava sendo montada, e escolher o filtro de novo agora funciona.
- **Corrigido — editor do SEI 5:** os botões de fonte não ficam mais dentro do menu *Transformar o texto* (tampavam os vizinhos), dois botões soltos do menu de tabela voltaram à barra, e **Ativar estilo avançado** não faz mais os ícones sumirem.
- **Corrigido — [Demandas](../pages/DEMANDAS.md):** editar uma demanda que já tem processo vinculado voltava a travar ao abrir a janela; agora abre, e qualquer erro ao abrir aparece na tela em vez de passar em silêncio.
- **Corrigido — prescrições:** o selo de prazo voltou a responder ao clique.
- **Ajuste — árvore sem o Atividades:** os nomes (`__`) não dependem mais do módulo de Atividades para aparecer.
- **Ícones novos:** *Hashcode* (folha com cadeado) e *duplicar* (folha com "+"), agora distintos do copiar.
- **Segurança — DOM seguro:** o SEI Pro passou a montar as telas sem inserir HTML cru na página, o que também deixa o pacote do **Firefox** sem código fora do escopo da loja. Nada muda no uso.
- **[Política de privacidade](../PRIVACY_POLICY.md) 3.6:** a consulta de legislação usa agora um servidor do projeto, no Brasil (Hostinger), com registro mínimo e **sem guardar o IP**.

### Versão 3.8
18/10/2026

**Novo — [Documentos em Lote](../pages/DOCUMENTOSEMLOTE.md) refeito** (*SEI Pro Lab*, Chrome e Edge). A "mala direta" do SEI ganhou uma janela nova, no mesmo estilo dos outros painéis do SEI Pro, com tema claro e escuro, e uma novidade grande: cada documento pode ser gravado **no processo indicado em uma coluna da planilha**, e não só no processo aberto na tela.

- **Processo de destino.** Na etapa *Cruzamento* você escolhe onde criar os documentos: no processo da tela (como antes), em um processo novo por linha (como antes) ou **no processo cujo número está em uma coluna do CSV**. Dá para mandar um documento diferente para cada processo de uma só vez.
- **Verificação antes de gravar.** Nenhum documento é criado antes de o SEI Pro conferir cada processo da planilha, uma vez só: se existe, se está **aberto na sua unidade**, se não é sigiloso e se o tipo do documento pode ser criado ali. A tabela mostra a situação de cada um, com **Abrir em nova aba** (para receber ou reabrir o processo) e **Verificar de novo**.
- **Grave só as linhas válidas.** O botão diz quantas linhas serão gravadas e quantas ficam de fora. Depois de corrigir os processos com problema, **Gravar as que ficaram de fora** cria o que faltou, no mesmo lote.
- **Prévia.** Mostra o documento de cada linha já preenchido, com o nome na árvore e a descrição finais, e **marca** os campos `##...##` que ficariam sem valor. Se o texto do modelo cita o número do processo do modelo e o documento vai para outro processo, avisa: o SEI copia o texto como está, inclusive o "Processo nº ... / Interessado: ...".
- **Uma linha que falha não derruba o lote.** O erro aparece no resultado e a ferramenta segue. Um pedido que o SEI pode ter concluído mesmo sem confirmar aparece como **incerto**: nunca é repetido sozinho, para não criar documento em duplicidade.
- **Retomar de onde parou.** O andamento é guardado a cada documento. Se a janela fechar ou a sessão cair, **Continuar de onde parou** cria só o que falta; **Repetir só as que falharam** refaz apenas o que, com certeza, não foi criado.
- **Nível de acesso e hipótese legal por linha**, em colunas opcionais da planilha (sem a coluna, os documentos saem públicos, como antes).
- **Resultado completo.** Cada linha mostra o processo de destino, o nome, o número SEI e o link do documento. Dá para **copiar** (com links clicáveis), **baixar em CSV** e **gerar links permanentes** dos documentos criados. Quando os documentos foram criados no processo da tela, a árvore é recarregada ao final.
- **Privacidade.** O andamento do lote fica só neste navegador, por até 7 dias após o último uso, e é apagado ao concluir ou descartar; o texto do modelo não é guardado. Cada lote aceita até 2000 linhas e 2 MB de dados.
- **Correção embutida:** travessão, aspas curvas e o símbolo € vindos da planilha eram gravados como "?" nos documentos do SEI 5 (editor novo); agora saem certos.

**Também nesta versão**
- **Novo — [Menu Suspenso](../pages/MENUSUSPENSO.md) refeito** (*SEI Pro Lab*): o menu abre **por cima do conteúdo**, sem empurrar a tela, pelo ícone ☰; fecha ao clicar fora ou com **Esc**; respeita a barra de ações fixa e não pisca aberto ao trocar de tela.

### Versão 3.7
17/10/2026

**Novo — [Agente de IA](../pages/AGENTEIA.md): backup em arquivo e anexo de PDF.**

- **[Backup em arquivo](../pages/AGENTEIA.md#backup-em-arquivo-o-agente-inteiro-em-outro-computador):** o agente inteiro — conversas, memória, instruções, skills, regras, rotinas, conectores e fluxos — num `.json` numa pasta do OneDrive ou do Google Drive, gravado sozinho a cada mudança, com **Exportar** e **Importar**. Ler o arquivo sempre mescla, nunca apaga. A chave do serviço e os tokens dos conectores só entram se você marcar a opção; conector e rotina que chegam pelo arquivo vêm desligados.
- **[Anexar PDF](../pages/AGENTEIA.md#anexar-pdf-na-conversa):** o PDF é lido no seu computador, página por página, com OCR nas páginas digitalizadas, e só o texto vai ao serviço de IA. Mostra o andamento, dá para cancelar e avisa quando o OCR pode deixar o computador lento.
- **[Serviço compatível](../pages/CHAVEIA.md) e Ollama:** as listas de **Endereço** e **Modelo** voltam a abrir de novo depois de escolhidas (com a opção *Outro* para digitar), e o **403** de um servidor local passa a explicar como liberar `OLLAMA_ORIGINS`, em vez de dizer que a chave foi recusada. Contribuição de Manoel Fernandes ([#182](https://github.com/SEI-Pro/sei-pro/pull/182)).

**Também nesta versão**
- **Corrigido — [Estilo Avançado](../pages/ESTILOAVANCADO.md):** os botões do canto (largura total, nova aba, baixar HTML/DOCX) apareciam sobre formulários como *Incluir em Bloco*; agora só aparecem quando a tela mostra um documento.

### Versão 3.6
17/10/2026

**Novo — [Ações em Lote](../pages/ACOESEMLOTE.md) refeitas** (*SEI Pro Lab*, Chrome e Edge). O antigo "Iniciar ações em lote" da árvore do processo agora se chama **Ações em Lote** e ganhou uma janela nova, no mesmo estilo dos painéis do SEI Pro, com tema claro e escuro.

- **Mais ações.** Além de dar ciência, excluir, cancelar assinatura, baixar, alterar o nível de acesso, assinar e duplicar, agora dá para **cancelar documento** (com motivo), **incluir em bloco de assinatura** (existente ou novo, criado uma vez só para o lote), **alterar dados** (descrição, observação, interessados e assuntos, com *Acrescentar*, *Remover* ou *Substituir*), **mover para outro processo** e **baixar tudo num ZIP** ou **num PDF único** gerado pelo próprio SEI.
- **Várias ações de uma vez.** Monte uma fila — por exemplo, alterar dados, incluir em bloco e assinar — e cada documento passa pelas etapas em ordem. Se uma etapa falha, as seguintes daquele documento ficam de fora.
- **Seleção inteligente.** Filtros por tipo, unidade, assinatura, nível, origem e período, e os atalhos *Não assinados da minha unidade*, *Assinados por mim* e *Externos*. Cada botão mostra quantos documentos selecionados aceitam a ação.
- **Prévia antes de executar.** Mostra, documento por documento, o que vai mudar (campo a campo) e quem será pulado e por quê. Excluir, cancelar e mover pedem confirmação.
- **Pausar, minimizar e retomar.** O lote é salvo a cada etapa: se a janela fechar ou a sessão cair, dá para continuar de onde parou, sem repetir o que já foi feito. Uma etapa que o SEI não confirmou aparece como **Confira** e nunca é repetida sozinha. Senha errada pausa o lote no primeiro documento, para não bloquear sua conta, e a senha nunca é guardada.
- **Resultado** com situação de cada etapa, **Copiar**, **Baixar CSV** e **Tentar de novo só as falhas**. No fim, a árvore do processo é recarregada.
- **Mudança:** documentos e processos **sigilosos** ficam de fora das Ações em Lote (aparecem na lista como pulados, com o motivo).

**Também nesta versão**
- **Ajuste — nome:** o botão da árvore e o menu rápido passam a dizer **Ações em Lote** em todas as versões do SEI Pro. A configuração do menu rápido que você já tinha salvo continua valendo.

### Versão 3.5
16/10/2026

**Novo — agrupar o Novo Controle de Processos por datas e unidade de envio** (*SEI Pro Lab*, Chrome e Edge). O que o agrupamento do SEI Pro antigo fazia, refeito: [Data de autuação, Data de recebimento, Data de envio e Unidade de envio](../pages/GRADECONTROLE.md#agrupar-por-datas-e-unidade-de-envio-consulta-o-andamento).

- **Avisa antes de consultar.** O SEI não mostra essas datas na lista: para agrupar, o SEI Pro abre o andamento de cada processo. O aviso diz quantos serão consultados e o que fica de fora (não visualizados e sigilosos), e a consulta só começa depois que você confirma.
- **Cache de 24 horas.** Ao recarregar a página, o agrupamento reaparece sem consultar de novo. Uma faixa mostra há quanto tempo foi a consulta e traz o botão **Atualizar**.
- **Com progresso e cancelamento.** Os grupos vão se completando enquanto a consulta corre, e ela para sozinha se a sessão do SEI cair.
- **Sem os iframes ocultos do legado:** a consulta é direta e só de leitura, sem guardar nada na página do SEI.

### Versão 3.4
16/10/2026

**Novo — [Pesquisar Link Permanente](../pages/LINKPERMANENTE.md) e [Processos em Lote](../pages/PROCESSOSEMLOTE.md) refeitos** (*SEI Pro Lab*, Chrome e Edge), no mesmo estilo dos painéis do SEI Pro, com tema claro e escuro.

**Pesquisar Link Permanente**
- **Status por linha:** cada número aparece como *Encontrado*, *Não encontrado*, *Sem acesso* ou *Erro*, e o botão **Tentar de novo só as que falharam** repete apenas o que falhou.
- **Cole o texto como estiver:** um e-mail, um parágrafo ou uma planilha. O módulo reconhece os números de processo e os números SEI, tira as repetições e mostra o que entendeu antes de pesquisar.
- **Copiar com links:** o número vai com o link por baixo, e cola clicável no Teams, no Outlook e no Word. Continua o **Baixar CSV**.
- **Pesquisa em paralelo:** três de cada vez, com a lista aparecendo conforme chega.

**Processos em Lote**
- **Prévia antes de criar:** mostra repetidas, linhas vazias, texto cortado em 100 caracteres e caracteres trocados (o travessão do Word vira hífen), com **Remover repetidas**. Um nível de acesso que o módulo não reconhece trava a prévia, em vez de criar o processo com outro nível.
- **Colunas da planilha:** especificação, interessado, observação e nível de acesso por linha, com cabeçalho opcional. *(A coluna de interessado é lida, mas ainda não é aplicada.)*
- **Retomar de onde parou:** o lote fica salvo a cada processo. Se a janela fechar ou a sessão cair, ao reabrir dá para **continuar sem recriar** o que já tem número. Se parecer que outra aba do SEI está rodando o mesmo lote, o módulo avisa.
- **Minimizar:** a janela vira uma pastilha de progresso no canto e a tela do SEI fica livre para leitura. Há **Pausar**, **Continuar** e **Cancelar**, e a pausa entre processos se ajusta sozinha quando o SEI fica lento.
- **Sem duplicar processo:** se o SEI não confirmar uma criação (a rede caiu, a resposta veio estranha), o processo aparece como **incerto** e o SEI Pro **não tenta de novo**; confira no Controle de Processos.
- **Resultado:** tabela com número SEI e link, **Copiar com links**, **Baixar CSV**, **Tentar de novo as falhas** e **Gerar links permanentes destes processos** (abre o Pesquisar Link Permanente já preenchido).
- **Modelos salvos:** guarde o tipo, o nível, a hipótese legal, a pausa e as ações depois da criação sob um nome, e aplique de novo quando quiser. Nunca guarda as linhas.
- **Depois de criar:** nos processos criados com número confirmado, **incluir em bloco interno**, **aplicar marcador** e **acompanhar**, cada ação opcional. Repetir é seguro: o que já estava aparece como *já estava*, e uma inclusão que o SEI não confirmou nunca é reenviada ao mesmo bloco.

**Também nesta versão**
- **Corrigido — [Pesquisa rápida](../pages/PESQUISARAPIDA.md) com o [Novo Controle de Processos](../pages/GRADECONTROLE.md):** com a grade ligada, digitar na pesquisa rápida não filtrava nada. Agora o termo filtra a grade (sem criar filtro salvo) e aparece na linha de status; sem a grade, tudo funciona como antes.
- **Corrigido — hipótese legal padrão:** a lista agora é lida do SEI quando você abre um processo (no máximo a cada 12 horas), e as Configurações só montam a escolha a partir dela. Antes dependia de um botão dentro do editor de documentos, que saiu. Se estiver vazia, as Configurações pedem para abrir um processo no SEI.
- **Corrigido — Documentos em Lote:** com nível de acesso público, o SEI recusava o documento com *Hipótese Legal não aplicável ao protocolo*, porque a hipótese pré-selecionada pelo tipo ia junto. Agora ela não é enviada nesse caso.
- **Ajuste — convite para avaliar nas lojas:** o texto do convite é sorteado a cada abertura, em vez de um por dia.

### Versão 3.3
15/10/2026

**Novo — [Estilo Avançado](../pages/ESTILOAVANCADO.md) refeito do zero** (*SEI Pro Lab*, Chrome e Edge). O visual novo do SEI, no mesmo estilo dos painéis do SEI Pro, com **cor da barra superior à sua escolha** e um **modo escuro feito do jeito certo**. **Vem desligado**: ligue pela chave do canto superior direito do SEI, ou pelo ícone de paleta ao lado dela, que abre a janela **Aparência do SEI**. Onde o novo existe, o estilo anterior fica desativado.

- **Cor da barra superior:** 18 cores prontas (inclusive **Rosa**, Magenta, Índigo, Turquesa, Terracota, Oliva, Cobre e Azul-petróleo) e **cor livre**. A cor ajusta o texto para continuar legível. A janela tem prévia ao vivo e as mesmas opções ficam nas Configurações, na seção **Aparência**, sincronizadas.
- **Claro, Escuro e Automático.** O modo escuro cobre o sistema inteiro (menu, tabelas, formulários, janelas, árvore do processo, painéis do SEI Pro) e, opcionalmente, o **texto dos documentos**, com um botão **Ver original** para conferir antes de assinar.
- **Ligar o Estilo Avançado liga também o [Novo Controle de Processos](../pages/GRADECONTROLE.md)**, e a grade abre na hora se você estiver no Controle de Processos.
- **Barra superior com duas alturas:** mais alta no topo, **compacta ao rolar**, com transição suave. Compacta, o nome do órgão passa para **junto da logo do SEI**, e a barra de ações fixa gruda logo abaixo.
- **Barra de ações:** os ícones nativos do SEI ficam como sempre; os botões do SEI Pro (monitorar, PDF, ação e documentos em lote, comparar, histórico, certidão) ganharam desenho próprio, colorido como os nativos. O **Agente de IA**, o **Estúdio de Fluxo** e o **Monitorados** mantêm o ícone de sempre.
- **Novo botão de [Histórico de Processos Visitados](../pages/HISTORICOPROC.md)** na barra de ações, ao lado do Estúdio de Fluxo (no Controle e dentro do processo).
- **Documento numa caixa só**, em formato de página, com o botão **Largura total** (alterna entre a página estreita e a largura inteira; o navegador lembra), e os botões **Abrir em nova aba**, **Baixar HTML** e **Baixar DOCX** agora com **rótulo** e no mesmo estilo. Ao rolar o documento, ficam só os ícones, à direita.
- **Árvore do processo:** divisor vertical com alça, selo da unidade em pílula alinhado aos ícones de copiar, respiro acima do número do processo, divisores de seção suaves e menu suspenso dos documentos sem quebra de texto.
- **Mais respiro** no campo *Pesquisar no Menu* e entre rótulos e campos dos formulários internos; tooltips próprios nos botões; transições suaves nos botões e estados de hover.
- **Tudo é só visual:** nada é gravado nos documentos e o editor não é adaptado.

### Versão 3.2.4
14/10/2026

- **Corrigido — [Agente de IA](../pages/AGENTEIA.md):** ao enviar um documento a conector em outro computador, o caminho de outro arquivo baixado que aparecesse no mesmo pedido ia sem máscara. Agora só o próprio documento enviado deixa de ser mascarado; o resto do pedido segue mascarado como em qualquer conector.

### Versão 3.2.3
14/10/2026

- **Novo — [Agente de IA](../pages/AGENTEIA.md) entrega documentos a conector em outro computador.** Antes, o agente baixava o documento e passava ao conector só o caminho do arquivo, que um servidor em outra máquina não consegue abrir. Agora, quando o conector aceita receber o arquivo, o SEI Pro confere se é o mesmo documento aprovado no download e envia o conteúdo, com o nome aprovado. **Você aprova cada envio**, mesmo com "Sempre permitir", e o cartão mostra o documento, o tamanho e o servidor. Ideia e primeira versão de Tavares (ANTAQ), para o conector do Sistema de Arrendamento.
- **Nome legível no download.** O agente escolhe o nome do arquivo a partir do documento (por exemplo, *Contrato de Cessão de Uso - Porto de Itaqui*), sempre com a extensão original e o número SEI.
- **Corrigido — [Demandas](../pages/DEMANDAS.md):** editar uma demanda que já tinha processo vinculado reabria o diálogo em vez de salvar.
- **Ajuste — [Novo Controle de Processos](../pages/GRADECONTROLE.md):** os marcadores e o prazo ficam com a mesma altura e alinhados na linha.

### Versão 3.2.2
12/10/2026

Ajuste no [Novo Controle de Processos](../pages/GRADECONTROLE.md) (*SEI Pro Lab*, Chrome e Edge): a opção continua **ligada por padrão**, mas a grade **não abre sozinha**.

- **O Controle de Processos abre na lista do SEI**, como sempre. A grade só aparece depois que você clica no botão ao lado do título; o navegador lembra a escolha nas próximas aberturas, e clicar de novo volta à lista.
- Quem desmarcar a opção nas Configurações, aba Geral, tira o botão e a grade de cena.

### Versão 3.2.1
12/10/2026

Mais uma correção de segurança no download de documentos pelo [Agente de IA](../pages/AGENTEIA.md) (*SEI Pro Lab*, Chrome e Edge).

- **O download só acontece com o cartão que você aprovou.** O agente só grava o arquivo se o nome e o destino estiverem no cartão daquele pedido. Um cartão recusado antes não vale para um pedido posterior, e pedido que chega sem mostrar o arquivo não é gravado.

### Versão 3.2
12/10/2026

O [Novo Controle de Processos](../pages/GRADECONTROLE.md) (*SEI Pro Lab*, Chrome e Edge), que estreou na 3.0 com o nome "Visão nova do Controle de Processos", agora **vem ligado por padrão**.

- **Já vem ligado.** Ao atualizar, a grade nova aparece no Controle de Processos sem precisar mexer nas Configurações. Quem preferir a lista do SEI desmarca a opção, ou usa o botão ao lado do título para alternar na hora.
- **Nome novo e opção mais à vista.** Passou a se chamar **Novo Controle de Processos** e, nas Configurações, aba Geral, ficou logo antes de *Controlar Prazos*.

### Versão 3.1.1
12/10/2026

Correções de segurança no download de documentos pelo [Agente de IA](../pages/AGENTEIA.md), que entrou na 3.1 (*SEI Pro Lab*, Chrome e Edge).

- **O cartão de aprovação mostra o arquivo que será gravado de verdade.** Nome, tipo e tamanho vêm do SEI, e não mais de uma estimativa. Se o arquivo mudar entre a aprovação e a gravação, nada é salvo.
- **Só documentos e imagens vão para o computador** (PDF, Word, Excel, imagens, texto). Anexo de outro tipo, como programa executável, é recusado.
- **A limpeza só apaga o que o agente baixou.** Antes de remover, o SEI Pro confere se o registro ainda corresponde ao mesmo arquivo.
- **O caminho do arquivo só vai sem máscara a conector do seu próprio computador.** Conector de fora recebe o caminho mascarado, como qualquer outro dado pessoal.
- **Mensagem de erro do conector não repete o que foi digitado** nos campos de autenticação.

### Versão 3.1
12/10/2026

Melhorias no [Agente de IA](../pages/AGENTEIA.md) para quem usa **conectores (MCP)**, no *SEI Pro Lab* (Chrome e Edge).

- **Corrigido — o teste de conexão dos conectores falhava** com a mensagem *Illegal invocation*, e o conector ficava "com erro" mesmo com o servidor no ar. Agora conecta e lista as ferramentas.
- **Novo — conector no seu próprio computador.** Servidor em `localhost` ou `127.0.0.1` passa a mostrar o estado na lista (**conectado** ou **sem resposta**), com o botão **Testar de novo**, e o estado é conferido toda vez que o painel abre. Com o servidor desligado, o agente avisa que ele não está rodando, em vez de um erro de rede.
- **Novo — baixar um documento do SEI para entregar a um conector.** Quando o conector só lê arquivos do disco, o agente salva o documento externo (PDF, planilha, imagem) em `Downloads/SEI Pro/<número do processo>/` e passa o caminho adiante. **Você aprova cada download**, o cartão mostra o documento e o destino, e a cópia sai com os dados reais, sem máscara. Em *Configuração → O que o agente pode → Arquivos baixados pelo agente* há um botão para apagar essas cópias. O navegador pede a permissão de downloads só na primeira vez que a função é usada.
- **Erro da ferramenta não derruba o conector.** Quando o servidor responde que um login expirou ou que um dado foi recusado, o texto chega inteiro a você e ao agente, e o conector continua ligado.
- **O agente acha a ferramenta certa.** Em conector com muitas ferramentas de nome parecido, a busca passa a trazer primeiro a que casa melhor com o pedido e informa o nome das que não couberam na resposta.
- **Token colado errado é dito como tal.** Aspas curvas, acento ou quebra de linha no token agora geram um aviso para colar de novo, e não um erro de conexão.
- **Novo — botão de copiar a resposta.** Cada resposta do agente ganhou um ícone de copiar, que leva o texto com a formatação (tabelas e listas continuam tabelas e listas ao colar).

### Versão 3.0
12/10/2026

**Novo — [Visão nova do Controle de Processos](../pages/GRADECONTROLE.md)** (SEI Pro Lab, no Chrome e no Edge). Uma grade moderna no lugar da lista do SEI. Na 3.0 vinha desligada; **desde a 3.2 vem ligada** (nas Configurações, aba Geral, a opção *Novo Controle de Processos*). Um botão ao lado do título volta à lista do SEI quando você quiser.

- **Abre sem piscar e carrega tudo.** A tela nativa fica escondida enquanto a grade monta, e todas as páginas do seu controle são lidas em segundo plano, não só os 100 primeiros.
- **Busca com operadores e filtros rápidos.** `resp:eu prazo:<7d marcador:urgente -tipo:ofício`, mais botões para *Meus*, *Recebidos*, *Gerados*, *Atrasados*, *Vencem na semana*, *Sem responsável*, *Não visualizados*, *Novos desde a última visita* e *Parados há +30 dias*, e seletores pesquisáveis de responsável, tipo e marcador.
- **Agrupar, ordenar e organizar.** Agrupe por responsável, tipo, marcador, prazo e mais; ordene por vários critérios; escolha as colunas e a densidade; guarde **visões salvas** (que acompanham você em outros computadores) e **exporte em CSV** o que está na tela.
- **Quadro (Kanban).** Arraste o processo entre colunas de marcador ou de responsável: o SEI é atualizado e há **Desfazer**. Limite de cartões por coluna e raias por responsável.
- **Edição na própria linha.** Especificação (lápis, Enter salva), responsável, marcadores e prazo (a mesma janela do [Controle de Prazos](../pages/PRAZOS.md)), com a opção de aplicar a todos os processos marcados. Se o SEI recusar, a tela volta ao que era e um aviso explica.
- **Anotação em post-it com lista de tarefas.** O mesmo post-it da árvore do processo: caixas `[ ]`/`[X]` que se marcam com um clique, data de hoje, prioridade e contador de 500 caracteres. O balão da anotação mostra as tarefas com caixa e texto riscado.
- **Ações do SEI em vários processos, de qualquer página.** A barra de ações usa os botões do próprio SEI (Enviar, Atribuir, Concluir...) e agora aceita processos que vieram da paginação, na visão resumida e na detalhada. O SEI só permite processos de uma página por grupo em cada ação, e a grade avisa quando a seleção passa disso.
- **Tudo o que já estava na linha:** ícones de Monitorados, Projetos, Demandas e Acompanhamento especial; ícone de **recebido/gerado**; ícone para **abrir em nova guia**; não visualizados em vermelho; urgente e trancado; **dicas na hora** ao passar o mouse; atalhos de teclado (`/`, `j`, `k`, `x`, `Enter`, `g t`, `g q`).
- **Convive com o resto.** O botão de recolher o painel, a ordem dos painéis e o legado seguem funcionando; com a opção desligada, nada muda.

**Bom saber:** as edições, o quadro e as ações em lote **gravam de verdade no SEI**. A visão nova foi testada no SEI 4.1.5 e no 5.0.4. A versão da loja e o Firefox não recebem a visão nova nesta versão.

### Versão 2.9
11/10/2026

A versão da loja, no Chrome e no Edge, recebe tudo o que o *SEI Pro Lab* vinha testando desde a 2.4: os Processos Monitorados e o Histórico de processos refeitos, os Projetos novos, o Controle de Prazos que grava no próprio SEI, as Demandas, o filtro pela pesquisa rápida e o retorno de bloco de assinatura. O painel lateral passa a ter abas. A partir daqui, a versão da loja e o *SEI Pro Lab* têm as mesmas funções; o Lab continua sendo o canal de testes. **No Firefox nada muda nesta versão.**

**Processos Monitorados refeitos**

- **Novo — [Processos Monitorados](../pages/FAVORITOS.md) num aplicativo novo.** Os monitorados passam a ficar guardados **na própria extensão**, e limpar o cache do navegador não os apaga mais. São duas listas: a da **unidade** e a **Pessoal**, que aparece em todas as unidades. Cada processo pode ter pasta, etiquetas coloridas, nota, prazo, lembrete, documentos monitorados e local no mapa.
- **Veja o que mudou sem abrir o processo.** Um selo avisa o que mudou desde a última vez (*2 documentos novos*, *saiu da sua unidade*…), lido da sua caixa e da árvore que você abre. Lembretes vencidos sobem para **Para hoje**, e você pode fixar no topo os processos que quer sempre à vista. A lista tem busca sem acento, filtros com várias escolhas e uma lixeira com os removidos nos últimos 30 dias.
- **Para levar a outro computador**, em *Sincronização…*: um Texto Padrão da unidade (só com o seu consentimento, porque ele fica visível para a unidade; a lista Pessoal e os sigilosos nunca vão para lá), um arquivo numa pasta da nuvem ou as cópias diárias que o SEI Pro guarda neste navegador.
- **O que acontece com os monitorados que você já tinha.** Eles **não são trazidos sozinhos**: na primeira vez que a lista nova abre, o SEI Pro mostra quantos encontrou neste navegador e pergunta se você quer trazê-los para a lista da unidade ou para a Pessoal. Vêm o processo, o tipo, a especificação, a categoria (que vira pasta), as etiquetas com as suas cores, o prazo e o local no mapa. **Nada é apagado**: os dados antigos continuam guardados. Se escolher *Agora não*, a lista nova começa vazia e a pergunta volta em 30 dias; dá para trazer a qualquer momento pelo menu ⚙ → *Trazer monitorados da versão anterior*. A pergunta é feita uma vez para cada SEI e cada usuário.

**Histórico de processos refeito**

- **Novo — o [Histórico de processos visitados](../pages/HISTORICOPROC.md) abre numa janela no meio da tela** e ganha uma aba no painel lateral, que mostra no topo, na mesma hora, cada processo que você abre. A busca acha o processo pelo número (com ou sem pontuação), pelo tipo, pela especificação, pelo interessado ou pelo assunto, e há filtros de período, tipo, unidade, interessado, assunto e situação.
- **Cada pessoa tem o seu histórico**, guardado na própria extensão. Você pode pausar o registro, apagar o que viu na última hora, hoje, nos últimos 7 ou 30 dias ou tudo, e escolher quantos processos guardar. De processo sigiloso, o histórico guarda só o número e o tipo.
- **O histórico que você já tinha vem sozinho**, sem perguntar, na primeira vez que você usa o SEI com esta versão, e o antigo não é apagado. Como o histórico antigo era um só para todos os logins do mesmo SEI neste navegador, ele vai inteiro para o primeiro login que abrir o SEI. Com o registro pausado, a cópia espera até você retomar.

**Projetos novos**

- **Novo — [gerenciador de Projetos](../pages/PROJETOS.md) reescrito, sem planilha do Google.** Projetos com fases, etapas, marcos e dependências, em Gantt ou em lista, no Controle de Processos, no painel lateral (com a *Agenda* das etapas atrasadas e da semana) e na árvore do processo, onde dá para concluir a etapa escolhendo um documento. O projeto da unidade fica num Texto Padrão do SEI; o seu, no navegador, com cópias diárias e arquivo. A opção é **Gerenciar Projetos**, na aba *Geral* das configurações.
- **Fim do gerenciador antigo.** A ferramenta que usava uma planilha do Google já não funcionava, porque a API do Google que ela usava foi desativada, e deixa de aparecer no Chrome e no Edge. **Os projetos da planilha não são trazidos** para o gerenciador novo. Quem usa o servidor do Atividades continua vendo o painel antigo, com o nome *Projetos (Atividades)*, e pode trazer esses projetos pelo menu de ajustes, em *Importar do servidor do Atividades…*.

**Controle de Prazos refeito**

- **Alterado — o [Controle de Prazos](../pages/PRAZOS.md) grava no controle de prazo do próprio SEI (4.1.5 ou superior).** O vencimento não ocupa mais o marcador, quem não usa a extensão enxerga e altera o prazo pelo próprio SEI, e o prazo em dias úteis é calculado pelo SEI com os feriados dele. Dá para concluir o prazo, que fica listado sem alerta de atraso. A janela *Prazo* é nova e grava para vários processos de uma vez.
- **Hora, texto e data inicial continuam no marcador**, só quando você os informa. Datas já vencidas e SEIs anteriores ao 4.1.5 também gravam no marcador, como antes. **Os prazos que já estavam em marcadores continuam na coluna.**
- **Atenção na unidade:** quem ainda usa uma versão antiga do SEI Pro, ou o SEI Pro no Firefox, não vê na coluna *Prazos* os prazos gravados só no controle do SEI (o ícone do próprio SEI continua aparecendo).

**Demandas (novo)**

- **Novo — [Demandas](../pages/DEMANDAS.md).** Demandas com título, responsável, prazo e prioridade, ligadas a processos, em tabela, quadro, cronograma e painel, com um botão na barra do processo. As da unidade ficam em Textos Padrão do SEI, e as suas, no navegador. Vem **ligada**, e nada é gravado no Texto Padrão da unidade antes de você confirmar o aviso (*Entendi*) na primeira vez. Para desligar, desmarque *Demandas* nas configurações (aba *Geral*, seção *Controle de Processos*) ou esconda o painel pela [Ordem e visibilidade dos painéis](../pages/ORDEMPAINEIS.md).

**Pesquisa rápida e blocos de assinatura**

- **Novo — [filtrar a página pelo campo de pesquisa rápida](../pages/PESQUISARAPIDA.md).** Digite no campo de pesquisa do topo do SEI, sem apertar Enter: o Controle de Processos mostra só os processos que correspondem, e a árvore e o documento aberto destacam as ocorrências. Vem **desligada**: ligue a opção *Filtrar a página pelo campo de pesquisa rápida* nas configurações.
- **Novo — [retornar bloco disponibilizado](../pages/RETORNARBLOCO.md)** na tela *Incluir em Bloco de Assinatura*, sem sair dela. Vem ligado.

**Painel lateral com abas**

- **Alterado — o painel lateral do navegador** deixa de ter só o Agente de IA e passa a ter as abas **Monitorados**, **Histórico**, **Projetos**, **Demandas** e **Agente de IA**.

**O que você vai notar ao atualizar**

- **Dois painéis novos aparecem logo abaixo da lista do Controle de Processos: *Projetos* e *Demandas*.** Eles vêm vazios, com um botão para criar o primeiro projeto ou a primeira demanda, porque as duas funções vêm ligadas. Se não quiser vê-los, desligue *Gerenciar Projetos* e *Demandas* nas [Configurações](../pages/DESATIVARFUNCOES.md) ou esconda os painéis pela [Ordem e visibilidade dos painéis](../pages/ORDEMPAINEIS.md). Nada é gravado no Texto Padrão da unidade enquanto você não confirmar o aviso *Entendi*.
- **Na primeira vez que abrir os Monitorados**, o SEI Pro pergunta se quer trazer os que você já tinha (veja acima). O histórico antigo vem sozinho.

**O que fica igual**

- **Nada precisa ser religado.** As suas configurações continuam como estavam. Quem não quiser alguma destas funções pode desligá-la nas [Configurações](../pages/DESATIVARFUNCOES.md), aba *Geral*, seção *Controle de Processos*: *Processos Monitorados*, *Gerenciar Projetos*, *Demandas*, *Controlar Prazos*, *Histórico de processos visitados*, *Filtrar a página pelo campo de pesquisa rápida* e *Retornar bloco de assinatura disponibilizado na tela de inclusão*.
- **No Firefox**, o SEI Pro continua com os monitorados, o histórico e o controle de prazos anteriores; só o número da versão muda.

### Versão 2.8.1
10/10/2026

Correção da aba lateral das Demandas, que não abria na 2.8, e de um detalhe no título sugerido para a nova demanda.

- **Correção — a aba *Demandas* do painel lateral abria só com o aviso "Este modo só abre em tela cheia".** Ela volta a mostrar a *Agenda* das demandas (atrasadas, da semana e sem responsável) e o botão de nova demanda. Isso vale só para o *SEI Pro Lab* (Chrome e Edge), que é onde as [Demandas](../pages/DEMANDAS.md) existem.
- **Correção — o título sugerido ao criar uma demanda pelo botão do processo repetia o número do documento** (por exemplo, *Despacho 0104018 0104018*). Agora o número aparece uma vez só.

### Versão 2.8
10/10/2026

Os *Favoritos* do SEI Pro agora se chamam **Monitorados**, e a estrela virou um alvo. Só o nome e o ícone mudaram: o funcionamento e os seus dados continuam iguais. Esta versão também traz a página de configurações e as Ferramentas de PDF com visual novo, para todos, e uma leva de novidades que chega primeiro ao *SEI Pro Lab* (Chrome e Edge): o gerenciador de **Demandas**, o **Controle de Prazos** refeito, o filtro pela pesquisa rápida e o retorno de bloco de assinatura na tela de inclusão.

**Processos Monitorados (para todos)**

- **Alterado — Processos Favoritos agora é [Processos Monitorados](../pages/FAVORITOS.md).** O SEI passou a ter os seus próprios *Favoritos*, e ter o mesmo nome e a mesma estrela na extensão confundia. Agora cada recurso tem o seu nome e o seu ícone, mais próximos do jeito nativo do SEI. A mudança vale para as listas, o painel lateral, a aba do painel, o histórico de processos, as configurações e o Agente de IA.
- **A estrela virou um alvo.** Para monitorar um processo, clique no **alvo** ao lado dele, no Controle de Processos, na árvore, nos blocos, no Acompanhamento Especial, nos sobrestados e nos resultados da Pesquisa. O alvo aceso mostra o que já é monitorado. Os botões passam a dizer **Monitorar** e **Parar de monitorar**, e *Manter processo em Monitorados* no Enviar Processo.
- **Nada muda no que você já tem.** Seus processos, pastas, etiquetas, notas, prazos, lembretes, documentos monitorados e configurações continuam exatamente como estavam, e nenhuma opção precisa ser religada. O que o próprio SEI chama de *Favoritos* segue sendo outra coisa, independente desta função.
- **Documentação refeita.** A página de [Processos Monitorados](../pages/FAVORITOS.md) ganhou um aviso da renomeação, imagens novas e um GIF do passo a passo de monitorar um processo.

**Demandas (novo, em teste, só no SEI Pro Lab para Chrome e Edge)**

- **Novo — [Demandas](../pages/DEMANDAS.md).** Crie demandas com título, responsável, prazo e prioridade, ligue-as a um ou mais processos e atribua a um colega. Dá para anotar descrição, etiquetas, uma lista de tarefas e o tempo estimado, e cada mudança fica no histórico da demanda. Quem usa a versão da loja ainda não tem esta função. Para ligar, marque *Demandas* nas configurações do SEI Pro (aba *Geral*, seção *Controle de Processos*, logo abaixo de *Gerenciar Projetos*).
- **Quatro visões:** **Tabela** (lista com filtros e ordenação), **Quadro** (cartões em colunas para arrastar de uma situação para outra, também pelo teclado), **Cronograma** (barras no tempo; arrastar muda as datas e mudar o prazo pede um motivo) e **Painel** (atrasadas, da semana, concluídas, entregas por mês e quem tem mais trabalho).
- **O ciclo completo da demanda:** iniciar, pausar, concluir registrando o documento entregue, prorrogar com motivo, avaliar e arquivar. A demanda pode também apontar para uma etapa do [gerenciador de Projetos](../pages/PROJETOS.md).
- **Botão *Demandas* na barra do processo.** Mostra as demandas ligadas ao processo aberto e cria uma nova com o formulário já preenchido pela tela: o processo, o título (com o nome do documento aberto ou o tipo do processo) e você como responsável. Ali mesmo dá para iniciar, *concluir com este documento* e abrir a demanda no painel, sem consultas extras ao SEI e sem marcar o processo como visualizado.
- **Ícone na grade do Controle de Processos.** Cada processo com demandas ganha um ícone na linha (com um número azul quando são duas ou mais); clicar nele abre o mesmo menu do botão do processo. O painel das Demandas aparece abaixo da lista do Controle de Processos e numa aba do painel lateral, com o número de atrasadas.
- **Para toda a unidade ou só seu.** As demandas da unidade ficam em Textos Padrão do SEI, uma tabela por texto, e aparecem para os colegas que usam o SEI Pro Lab (você confirma com *Entendi* na primeira vez). As suas ficam no navegador, com cópias diárias, e tudo pode ir para um arquivo no seu computador e voltar dele.
- **Limites e arquivo morto.** Cada Texto Padrão aceita até 100 KB (cerca de 560 demandas): a partir de 80 KB o painel avisa, e em 100 KB só a criação de novas é bloqueada. *Arquivar concluídas antigas* tira da lista ativa sem apagar nada, e *Exportar arquivo morto e limpar* só tira as arquivadas do Texto Padrão depois que você confirma que guardou o arquivo.
- **Sigilo.** O número de processo ou de documento sigiloso nunca vai ao Texto Padrão nem ao título sugerido, e o menu do processo sigiloso avisa disso. Mas o que você digita no título e na descrição vai como está: **não escreva dados sigilosos nesses campos**.

**Controle de Prazos refeito (SEI Pro Lab, Chrome e Edge)**

- **Alterado — o [Controle de Prazos](../pages/PRAZOS.md) grava no controle de prazo do próprio SEI (4.1.5 ou superior).** O vencimento não ocupa mais o marcador do processo, quem não usa a extensão enxerga e altera o prazo pelo próprio SEI, e o prazo em **dias úteis** é calculado pelo SEI com os feriados dele. Dá para **concluir** o prazo, que fica listado sem alerta de atraso.
- **Hora, texto e data inicial continuam no marcador**, só quando você os informa (o controle do SEI guarda apenas a data). Datas já vencidas e SEIs anteriores ao 4.1.5 também gravam no marcador, como antes. Os prazos que já estavam em marcadores continuam na coluna.
- **Nova janela *Prazo*** no mesmo desenho dos monitorados, do histórico e dos projetos, com o destino do prazo explicado enquanto você preenche, prazo **em N dias** (corridos ou úteis) e gravação para vários processos de uma vez. O painel da árvore mostra o prazo do SEI junto do marcador.
- **Atenção na unidade:** quem ainda usa uma versão antiga do SEI Pro, ou a versão da loja, não vê na coluna *Prazos* os prazos gravados só no controle do SEI (o ícone do próprio SEI continua aparecendo).

**Configurações e Ferramentas de PDF (para todos)**

- **Alterado — página de [Configurações](../pages/DESATIVARFUNCOES.md) nova.** As opções ficam em seções recolhíveis, com chaves liga/desliga, um campo de **busca** que acha a opção pelo nome (sem se importar com acentos) e a barra *Salvar* logo abaixo do título. O que você já tinha configurado continua igual.
- ***Gerenciar Projetos* passou para a aba *Geral***, na seção *Controle de Processos*, abaixo de *Processos Monitorados*. As opções **Gerenciar Formulários** e **Pesquisa NatJus** saíram da página.
- **Configurações mais seguras ao salvar.** Se as configurações passarem do espaço que o navegador reserva para sincronizá-las (8 KB), a página avisa antes, em vez de dizer "salvo" sem ter salvo; um erro do navegador ao gravar também aparece na tela. Um formulário de base de dados em branco não dispara mais o alerta ao salvar, apagar a última base não apaga o resto das configurações, e uma configuração antiga corrompida não deixa mais a página sem botões.
- **Alterado — [Ferramentas de PDF](../pages/FERRAMENTASPDF.md) com o novo desenho**, as mesmas cores da página de configurações, o modo escuro e o nome do produto no título. O título e a barra de ações (voltar e destino no SEI) ficam em linhas separadas, e a barra fica fixa no alto.

**Controle de Processos**

- **Novo — [Ordem e visibilidade dos painéis](../pages/ORDEMPAINEIS.md) (Chrome e Edge, também na versão da loja).** O botão *Ordenar e ocultar painéis*, na barra de título do Controle de Processos, abre uma janela para arrastar os painéis (Monitorados, Atividades, Projetos e agora Demandas) na ordem que você preferir e esconder os que não usa. A escolha sincroniza entre os seus computadores e vale na hora, sem recarregar. Quem já ordenava arrastando os painéis mantém a ordem; o arrastar antigo foi substituído por esta janela, que é mais estável.
- **Novo — [anotação em coluna](../pages/ANOTACAOCONTROLE.md).** Com *Mostrar a anotação de cada processo* ligada, aparece a opção de colocar o cartão da anotação numa coluna à esquerda do número do processo, na mesma linha. A ordenação que você salvou na tabela acompanha a troca. A ideia veio de uma proposta de *SEI Pro PRF* ([#177](https://github.com/SEI-Pro/sei-pro/pull/177)).
- **Novo (SEI Pro Lab) — [filtrar a página pelo campo de pesquisa rápida](../pages/PESQUISARAPIDA.md).** Digite no campo de pesquisa rápida do SEI, sem apertar Enter: no Controle de Processos, a lista mostra só os processos que correspondem ao texto (número, especificação, tipo, atribuição, marcador, anotação); na árvore e no documento aberto, as ocorrências ficam destacadas. Começa com três caracteres, ignora maiúsculas, acentos e pontuação, e o **Enter** mantém a pesquisa normal do SEI. Vem desligada. Proposta de *SEI Pro PRF* ([#179](https://github.com/SEI-Pro/sei-pro/pull/179)).
- **Correção:** o ícone dos Projetos novos, na árvore do processo, descia alguns pixels em relação aos botões dos Monitorados. Agora fica alinhado.

**Blocos de assinatura (SEI Pro Lab)**

- **Novo — [retornar bloco disponibilizado](../pages/RETORNARBLOCO.md) sem sair da tela.** Na tela *Incluir em Bloco de Assinatura*, o botão **Retornar bloco disponibilizado** lista os blocos que a sua unidade disponibilizou, recolhe o escolhido e já o deixa selecionado no campo *Bloco*, com os documentos marcados preservados. A opção vem ligada e pode ser desligada nas configurações. Proposta de *SEI Pro PRF* ([#176](https://github.com/SEI-Pro/sei-pro/pull/176)).

### Versão 2.7
09/10/2026

O gerenciador de projetos foi refeito do zero e chega primeiro ao SEI Pro Lab, em versão de teste. Duas falhas do painel lateral e dos favoritos novos também foram corrigidas.

- **Novo (em teste) — [gerenciador de Projetos](../pages/PROJETOS.md) reescrito, no *SEI Pro Lab* (Chrome e Edge).** Quem usa a versão da loja continua com o gerenciador de sempre e recebe o novo depois dessa validação. Para ligar, marque *Gerenciar Projetos* nas configurações do SEI Pro.
- **Painel no Controle de Processos.** Projetos com fases, etapas, marcos, dependências e linha de base, em Gantt ou em lista, com filtros, visão de todos os projetos, exportação para planilha e impressão. As etapas atrasadas e as que vencem na semana aparecem em pílulas no título do painel.
- **Os projetos acompanham o processo.** Na caixa, um ícone ao lado da estrela dos favoritos abre um balão com os projetos e as etapas ligados ao processo. Na árvore do processo, o ícone mostra uma faixa quando há etapa atrasada e permite concluir a etapa escolhendo um documento da própria árvore, sem carregar nada em segundo plano.
- **Painel lateral.** Uma aba *Projetos* ao lado de Favoritos, Histórico e Agente de IA, com a *Agenda* (atrasadas, desta semana e dos próximos 30 dias) e um mini-Gantt de cada projeto. O número vermelho da aba mostra as etapas atrasadas.
- **Para toda a unidade ou só seu.** O projeto da unidade fica num Texto Padrão do SEI e aparece para os colegas que usam o SEI Pro (você confirma com *Entendi* na primeira vez). O projeto só seu fica no navegador, com cópias diárias e arquivo para enviar e receber.
- **O Agente de IA lê os seus projetos** (*"quais etapas minhas estão atrasadas?"*). Processos sigilosos ficam de fora: o número deles não vai ao Texto Padrão, nem aos arquivos, nem ao Agente.
- **Correção:** com o painel lateral aberto em mais de uma janela do navegador, abrir uma aba (por exemplo, pelo botão dos favoritos) trocava a aba do painel de **todas** as janelas. Agora só troca o painel da janela em que você clicou.
- **Correção nos favoritos novos (SEI Pro Lab):** o número de pendências nas abas do painel lateral, a troca de aba pedida pelo SEI com o painel aberto e a barra de progresso (com o *Cancelar*) do *Atualizar* não funcionavam, porque a extensão lia errado o aviso de mudança do armazenamento do Chrome. Os três voltam a funcionar.

### Versão 2.6
07/10/2026

A anotação de cada processo pode aparecer na própria lista do Controle de Processos, com o checklist das anotações desenhado como caixas.

- **Novo — [anotações no Controle de Processos](../pages/ANOTACAOCONTROLE.md).** Com a opção ligada, o texto da anotação aparece num cartão logo abaixo do número do processo, em *Recebidos* e *Gerados*, sem precisar passar o mouse sobre o ícone. A anotação com prioridade fica vermelha, com a etiqueta *Prioridade*. Texto longo abre e fecha pela seta do cartão, que também mostra o autor e a data. O ícone do SEI continua no lugar para editar a anotação
- **O checklist das anotações vira caixas.** As linhas que começam com `[ ]` ou `[X]` aparecem com uma caixa desmarcada ou marcada, e os itens concluídos ficam riscados. A caixa é só para leitura: para marcar ou desmarcar, edite a anotação
- A função vem **desligada**. Para ligar: *Configurações do SEI Pro*, aba *Geral*, seção *Controle de Processos*, opção *Mostrar a anotação de cada processo na tela de controle de processos*. Ela não faz nenhuma consulta extra ao SEI, segue o modo noturno e vale no Chrome e no Edge. A ideia veio de uma proposta de *SEI Pro PRF* ([#174](https://github.com/SEI-Pro/sei-pro/pull/174))
- **Agente de IA: modelos com raciocínio voltam a funcionar.** Com alguns modelos novos da OpenAI, toda pergunta terminava em erro 400, porque o serviço recusava o raciocínio junto com as ferramentas do SEI. Agora o agente refaz o pedido com o raciocínio desligado. Se o modelo recusar mesmo assim, a mensagem explica, em português, que é preciso escolher outro modelo
- **Nos favoritos novos (SEI Pro Lab):** o título do painel não aparece mais com a letra pequena no SEI 5 enquanto a página termina de carregar

### Versão 2.5.1
05/10/2026

O link de legislação volta a funcionar, com uma base nova de normas federais, e chega ao SEI 5.

- **[Adicionar link de legislação](../pages/LINKLEGIS.md) volta a funcionar.** A pesquisa tinha parado porque o serviço antigo de normas saiu do ar. Agora a consulta vai para a nova API de legislação do SEI Pro, montada com os dados abertos do Senado Federal (mais de 212 mil normas federais), e o link da citação aponta para a norma no portal *normas.leg.br*
- **A ferramenta passa a funcionar no SEI 5.** Até aqui, o botão mostrava apenas o aviso de que a busca estava "em migração"
- **Quando o número se repete, você escolhe.** Existem sete Decretos nº 1, por exemplo: em vez de inserir um deles por conta própria, o SEI Pro mostra as opções. Informe o ano para ir direto à norma certa. A aba *Legislação Federal* ganhou também *Emenda Constitucional* e *Decreto Legislativo*
- **Citar a mesma norma de novo** já insere a forma curta (*Lei nº 8.112, de 1990*), e inserir duas normas seguidas não parte mais o link anterior em dois
- Na **enumeração de normas** com `@`, as referências como `@lei8666`, `@cc` e `@estatutoidoso` passam a ser resolvidas pela base nova
- As **normas infralegais** (ANTAQ, Cade e outros órgãos) estão sendo levadas para a base nova. Até lá, a aba *Norma Infralegal* não encontra resultados
- **Correção:** em algumas janelas abertas pelo SEI Pro no editor, os botões executavam a ação duas vezes. O *mais* da ementa, por exemplo, abria e fechava na mesma hora
- A [política de privacidade](../PRIVACY_POLICY.md) foi atualizada: ela diz para onde vai a consulta de normas e o que a hospedagem registra. Os termos pesquisados não são guardados

### Versão 2.5
02/10/2026

O histórico de processos visitados foi refeito do zero, por enquanto no SEI Pro Lab. Ele abre numa janela no meio da tela e ganha uma aba própria no painel lateral, ao lado dos favoritos e do Agente de IA.

- **Novo — o [histórico de processos visitados](../pages/HISTORICOPROC.md) foi reescrito e chega primeiro ao *SEI Pro Lab*, no Chrome e no Edge.** Quem usa a versão da loja continua com o histórico de sempre e recebe o novo depois dessa validação. O item *Histórico de Processos Visitados* do menu abre uma janela no meio da tela, e o painel lateral ganha a aba **Histórico**, ao lado de *Favoritos* e *Agente de IA*. Com o painel aberto, cada processo que você abre no SEI aparece no topo da lista na mesma hora
- **Busca e filtros como os dos favoritos.** A busca acha o processo pelo número, com ou sem pontuação, e também pelo tipo, pela especificação, pelo interessado ou pelo assunto, sem diferenciar acento. Os filtros de *Período*, *Tipo*, *Unidade*, *Interessado*, *Assunto* e *Situação* aceitam várias escolhas e mostram quantos processos há em cada opção. A lista é agrupada por dia (*Hoje*, *Ontem*, *Últimos 7 dias*…), mostra quantas vezes você abriu cada processo e pode ser ordenada por *Mais visitados*
- **Cada pessoa tem o seu histórico.** Antes, dois logins no mesmo navegador dividiam a mesma lista. Agora o histórico fica guardado na própria extensão, e limpar o cache do navegador não o apaga. O processo abre pela pesquisa do SEI, sem montar link à mão, que no SEI 5 derrubava a sessão. Na primeira vez, o histórico antigo é trazido para a lista nova, e nada é apagado
- **Uma estrela em cada linha favorita o processo ali mesmo**, um de cada vez ou vários de uma vez, sempre com *Desfazer*. O filtro *Situação* separa os que já estão nos favoritos
- **Privacidade:** você pode pausar o registro, apagar o que viu na última hora, hoje, nos últimos 7 ou 30 dias ou tudo, e escolher quantos processos guardar (de 500 a 5.000). De processo sigiloso, o histórico guarda só o número e o tipo. As observações do processo nunca são guardadas
- **O Agente de IA lê o seu histórico.** Pergunte *"que processos eu vi ontem?"* ou use a sugestão *Processos que vi esta semana*. Os sigilosos ficam de fora, e os nomes dos interessados são mascarados antes de sair do navegador
- **Nos favoritos novos:** a estrela dos documentos na árvore não se repete mais (chegava a aparecer três vezes no mesmo documento); as estrelas da caixa e das listas ficam no tamanho e na altura dos ícones do SEI; e o título do painel mantém o mesmo peso do título da tela no SEI 5

### Versão 2.4
02/10/2026

Os favoritos foram refeitos do zero, por enquanto no SEI Pro Lab. A ferramenta de links SEI em lote passa a reconhecer números de processo, e os itens do SEI Pro no menu lateral ganham ícones.

- **Novo — os favoritos foram reescritos, e chegam primeiro ao *SEI Pro Lab*, a versão dos testadores, no Chrome e no Edge.** Quem usa a versão da loja continua com os favoritos de sempre e recebe os novos depois dessa validação. Os favoritos agora ficam guardados **na própria extensão**: limpar o cache do navegador não os apaga mais. Há duas listas, a da **unidade** e a **Pessoal**, que aparece em todas as unidades. Cada favorito pode ter pasta, etiquetas coloridas, nota, prazo, lembrete, documentos favoritos e local no mapa. Na primeira vez, o SEI Pro oferece trazer os favoritos da versão anterior. Nada é apagado
- Ainda nos favoritos: **um selo mostra o que mudou** desde a última vez que você viu o processo (*2 documentos novos*, *saiu da sua unidade*…). O SEI Pro faz isso sem abrir processo nenhum por conta própria: ele lê a sua caixa e a árvore que você abre. Lembretes vencidos sobem para **Para hoje**, e você pode **fixar no topo** os processos que quer sempre à vista. O prazo pode ir até uma data, contar N dias corridos ou úteis, começar na assinatura de um documento ou no próximo documento de um tipo
- **A lista tem filtros que aceitam várias escolhas ao mesmo tempo e uma busca que ignora acento** (*licitacao* acha *Licitação*). Ela aparece abaixo da lista de processos, como sempre, ou **no painel lateral**, ao lado de qualquer tela do SEI. No painel lateral ela acompanha o tema claro ou escuro do sistema. As janelas de edição abrem no meio da tela visível, mesmo com a página rolada até o fim
- **Para levar os favoritos a outro computador**, escolha entre um Texto Padrão da unidade (só com o seu consentimento: esse texto fica visível para a unidade, e a lista Pessoal e os sigilosos nunca vão para lá), um arquivo numa pasta da nuvem (Chrome e Edge) ou as cópias diárias que o SEI Pro guarda neste navegador. O Agente de IA também lê a sua lista, sem os sigilosos
- O título **Controle de Processos** ganha o mesmo desenho do título dos favoritos: o ícone de pasta e a seta que recolhe a lista de processos
- **[Converter os números SEI do texto em links](../pages/LINKSEILOTE.md) agora converte também os números de processo.** Até aqui a ferramenta só encontrava números de documento, e quem citava outro processo num despacho tinha de fazer o link à mão. Agora ela reconhece o formato do processo em que você está e os números que terminam em ano e dígito verificador: o padrão federal (*50300.018905/2018-67*) e a maioria dos formatos estaduais. Isso vale mesmo quando o mesmo SEI atende órgãos com formatos diferentes. Na lista de conferência, cada número diz se é documento ou processo
- **O número do próprio processo vem desmarcado.** Quase todo despacho repete o número do processo em que está, no cabeçalho ou no texto. Ele aparece na lista com a etiqueta *este processo* e só vira link se você marcar
- Ainda nessa ferramenta, no SEI 3 e 4: **o documento passa a ser lido inteiro.** Em modelos com mais de uma seção editável, só uma delas era percorrida, e os números do texto principal ficavam de fora. É o caso do despacho do SEI SP, que traz a seção *Processo nº / Interessado* antes do texto. E o aviso do final não aponta mais como "sem link" um número que você mesmo desmarcou
- **Os itens do SEI Pro no menu lateral ganharam ícones (SEI 4 e 5).** *Agente de IA*, *Pesquisar Link Permanente*, *Histórico de Processos Visitados*, *Ferramentas de PDF* e *Processos em Lote* agora têm ícone próprio, no mesmo desenho e alinhamento dos itens do SEI. No modo *SEI Slim*, aparecem com os ícones do tema no lugar da seta genérica
- Depois de uma atualização com novidades, esta página pode convidar você a **avaliar o SEI Pro na loja**. O convite aparece no máximo uma vez a cada versão de novidades, e "Agora não" o adia por 60 dias

### Versão 2.3.1
01/10/2026

Correção no aviso de erro do Agente de IA e um jeito de pedir ajuda sem precisar descrever o problema.

- **"Muitas requisições ao modelo" deixou de ser a resposta para tudo.** Quem usa o Agente com chave própria e via esse aviso repetido em toda pergunta não estava com pressa: o serviço de IA devolve o mesmo código tanto para *"você está indo rápido demais"* quanto para *"sua conta está sem crédito"* — e o segundo caso nunca se resolve esperando. Agora o agente distingue os dois, diz qual é o seu e o que fazer: adicionar crédito, ou esperar o tempo que o próprio serviço informa. Relato de *Francisco*
- Na mesma correção: quando é limite de ritmo, o agente passa a **esperar o tempo que o serviço pede** (antes tentava de novo em 1, 2 e 4 segundos, curto demais para um limite que é por minuto — e cada tentativa gastava mais do limite). Quando é falta de crédito, ele para na primeira vez, em vez de insistir três vezes à toa. O aviso também explica a causa comum: cada pergunta leva junto o catálogo de ferramentas do SEI, e conta nova costuma ter limite baixo — um modelo "mini" resolve
- **Novo — todo erro agora tem um botão de copiar.** Ele leva a mensagem **e um diagnóstico técnico** prontos para colar num chamado ou numa conversa com quem mantém a extensão: versão, navegador, serviço de IA e modelo, código da resposta, o que o provedor respondeu, tamanho da conversa, últimas ferramentas usadas e se o navegador autorizou o acesso ao endereço do serviço. Uma seta ao lado abre esse diagnóstico na tela, para você conferir antes de enviar. **Não vão junto** a sua chave, os tokens dos conectores, o conteúdo dos documentos, o texto da conversa, o número do processo nem a sigla da sua unidade

### Versão 2.3
01/10/2026

O Agente de IA ganha conectores, tarefas agendadas, configuração que acompanha você entre computadores e uma blindagem contra instruções escondidas dentro de documentos.

- **Novo — [conectores (MCP)](../pages/AGENTEIA.md#conectores-ferramentas-de-fora-do-sei) no Agente de IA.** O agente passa a usar ferramentas de fora do SEI: um serviço do seu órgão, uma base pública, um sistema que a sua equipe mantém. É o mesmo padrão que o Claude e outros assistentes usam. Você informa o endereço e, se houver, o token; o SEI Pro busca a lista de ferramentas e **cada uma recebe a permissão que você der**: *sempre permitir*, *requer aprovação* (o padrão) ou *bloqueado*. Em *requer aprovação*, aparece um cartão com o conector, a ferramenta e **exatamente o que vai ser enviado**, antes de qualquer coisa sair do navegador. Dados pessoais vão mascarados, como nas conversas, e o token fica só neste computador
- **As [rotinas](../pages/AGENTEIA.md#rotinas) deixaram de ser só perguntas e viraram tarefas.** Agora a rotina pode seguir **skills** além do texto que você escreve, roda também **a cada hora**, **em dias úteis** ou **quando você mandar**, guarda as **10 últimas execuções** com data e custo, aceita um **teto de gasto por execução** e pode **avisar por notificação do navegador** quando terminar. No Chrome, o navegador lembra você na hora marcada mesmo com o painel fechado
- Ainda nas rotinas: elas podem, se você quiser, **propor alterações no SEI** — esperando a sua aprovação — ou **executá-las sozinhas**, apenas nas ferramentas que você autorizar, uma a uma. Exclusão, cancelamento e assinatura **nunca** são feitos por rotina, nem com autorização; a rotina que falhar ao alterar o SEI se desliga sozinha e avisa o motivo
- **Novo — a configuração do Agente acompanha a sua conta do navegador.** Instruções, regras da unidade, memória, rotinas, conectores, fluxos e os endereços das suas skills aparecem nos seus outros computadores, sem cadastrar duas vezes. Ficam **só neste computador**: a chave do serviço de IA, os tokens dos conectores, o texto das skills coladas à mão (as que vêm do GitHub viajam pelo endereço) e as conversas
- **Novo — proteção contra instruções escondidas dentro de documentos.** Em outubro de 2026 o STF multou um advogado que escondeu, no cabeçalho de uma petição, um comando dirigido à inteligência artificial que lê os autos. O SEI Pro passa a **enxergar o que o documento esconde da tela** — letra branca, fonte de tamanho zero, texto fora da área visível —, a marcar trechos redigidos como ordem a sistemas de IA e a remover caracteres invisíveis. Nada é apagado do documento: o conteúdo é preservado e **apontado**, com uma verificação de integridade na conversa dizendo onde está. E se o agente propuser alguma alteração depois de ler um documento assim, o cartão de aprovação avisa. A ideia partiu de uma sugestão de *Marcus Tavares* (SOG/ANTAQ)
- **[Estilo Avançado](../pages/ESTILOAVANCADO.md): o primeiro campo do formulário voltou a responder ao clique.** Com o Estilo Avançado ligado, a barra de *Salvar/Voltar* ficava por cima do começo do formulário — em *Registrar Documento Externo*, o campo *Tipo do Documento* simplesmente não abria. Agora a barra deixa o clique passar para o campo que está embaixo; só os botões dela recebem clique
- **As configurações do SEI Pro avisam de verdade quando não conseguem salvar.** Se o navegador recusa a gravação — por espaço ou por excesso de gravações seguidas —, a página dizia "salvo com sucesso" mesmo assim. Agora o erro aparece, e a página avisa antes de passar do espaço que o navegador reserva
- Ainda nas configurações: um campo obrigatório em branco numa Base de Dados **não descarta mais as bases seguintes** em silêncio, e a configuração alterada em outro computador passa a valer sem precisar recarregar a página
- **Menos credencial guardada na página do SEI.** A extensão copiava para o armazenamento do site todas as credenciais da *Base de Dados* — inclusive chaves de API que ficavam legíveis para qualquer script da página e sobreviviam à desinstalação. Agora só vai para lá o que de fato é usado ali: as opções marcadas e o perfil do gestor de atividades

### Versão 2.2.5
29/09/2026

Novidades no Documentos em Lote, vindas do PluriDocs, e um acerto no aviso de cópias do SEI Pro.

- [Documentos em Lote](../pages/DOCUMENTOSEMLOTE.md): **novo campo *Descrição do documento***, na etapa de cruzamento de dados. Ele preenche o campo *Descrição* de cada documento gerado e aceita `##coluna##` para trazer o valor da planilha, sozinho ou junto com texto: `Termo de sigilo - ##nome## (##unidade##)`. É opcional: em branco, o campo fica vazio, como antes. Os acentos são mantidos e o texto vai até 250 caracteres, o limite do SEI. A ideia veio do [PluriDocs SEI!](https://github.com/tuliogontijo/PluriDocs-SEI), de *Tulio Gontijo*, a ferramenta que deu origem ao Documentos em Lote
- Ainda no Documentos em Lote: cancelar a escolha do arquivo CSV não trava mais o botão **Avançar**; no SEI 5, quando o SEI recusa a gravação de um documento, a mensagem dele aparece na janela de erro, em vez de um erro genérico; e a leitura do editor do SEI 3 e 4 ficou mais robusta
- **O aviso de "cópias do SEI Pro ativas" não confunde mais outras extensões com o SEI Pro.** Extensões feitas a partir do código do SEI Pro, como o *SFIS Pro*, carregam os mesmos ícones, e o aviso as contava como uma segunda cópia, pedindo para desativar algo que não era o SEI Pro. Agora cada suspeita é conferida antes de entrar no aviso. Uma segunda instalação do SEI Pro continua sendo avisada

### Versão 2.2.4
29/09/2026

Duas correções que chegaram pelas avaliações da Chrome Web Store.

- **Quatro itens voltam ao menu lateral do SEI**: *Pesquisar Link Permanente*, [Histórico de Processos Visitados](../pages/HISTORICOPROC.md), [Ferramentas de PDF](../pages/FERRAMENTASPDF.md) e [Processos em Lote](../pages/PROCESSOSEMLOTE.md). Desde a versão 2.0 eles não apareciam para ninguém. A causa: o item novo do *Agente de IA* usava a mesma marcação que a extensão conferia para não colocar esses itens duas vezes — e, como o Agente entra primeiro, a extensão concluía que eles já estavam lá. Relato de *Alessandro Costa*
- [Enviar múltiplos documentos externos](../pages/UPLOADDOCS.md): no SEI 4 e no SEI 5, o nome do arquivo passa a ir para o campo **Nome na Árvore**, e não mais para o **Número**. Na árvore o documento aparece igual, mas o Número fica livre para o número de verdade do documento, que é o que a pesquisa do SEI procura. No SEI 3, que não tem o Nome na Árvore, nada muda. Relato de *José Fernando Souza Fernandes*

### Versão 2.2.3
28/09/2026

Correção para quem usa os modelos **Gemini 3** no Agente de IA.

- **O agente parava com erro 400 na segunda consulta ao SEI.** Quem configurou o Gemini direto (chave do Google AI Studio) e escolheu um modelo da família 3 via a conversa morrer com uma mensagem sobre `thought_signature`: o agente consultava o SEI uma vez e, ao retomar, o Google recusava o pedido — a resposta nunca chegava. A causa: os modelos 3 devolvem, junto com o pedido de ferramenta, uma marca interna de raciocínio que precisa voltar no pedido seguinte, e a extensão a descartava ao remontar a conversa. Agora ela é preservada. Quem usa o Gemini **pelo OpenRouter**, ou um modelo 2.5, nunca foi atingido — o que explica o problema ter aparecido só agora. Relato de *rudnypc* e diagnóstico de *dalcib* ([#169](https://github.com/SEI-Pro/sei-pro/issues/169))
- De passagem: ao trocar de provedor no meio de uma conversa já iniciada, essa marca do Gemini é removida do histórico antes de enviar — serviço que não a conhece recusa o pedido inteiro

### Versão 2.2.2
25/09/2026

Uma correção importante no Agente de IA e a fundação que abre caminho para a extensão voltar à loja do Firefox.

- **O painel do Agente de IA travava ao responder com tabelas.** Quem usa uma skill que pede resposta em quadro via a janela congelar por completo — sem clique, sem rolagem, sem fechar. A causa: a resposta é desenhada enquanto chega, e uma tabela que ainda não chegou inteira fazia o leitor de texto rodar em círculos. Agradecimento a Marcus Tavares (SOG/ANTAQ), que reportou e rastreou o problema
- **Skills grandes não são mais cortadas em silêncio.** O limite era de 20 mil caracteres e o que passasse disso sumia sem aviso — junto com o final do arquivo, onde costumam estar os exemplos. Agora cabem 40 mil, o que não couber é avisado na tela, e quem já tinha uma skill cortada recebe o arquivo completo na próxima sincronização
- **Resposta que trava no meio agora termina.** Se o serviço de IA para de responder sem encerrar a conexão, o agente espera 90 segundos, mantém o que já chegou e avisa — em vez de ficar "pensando" para sempre
- **Novo** — [destaque dos documentos da sua unidade ainda não assinados](../pages/DOCSNAOASSINADOS.md), sugestão do grupo SEI Lab: na árvore, o documento que a própria unidade produziu e ainda não assinou ficava idêntico aos assinados, e a única conferência era o aviso na hora de enviar o processo. Agora ele ganha fundo âmbar com um filete lateral — cor escolhida para não se confundir com a que o SEI já usa no não assinado de *outra* unidade. Vem desligado; ative em Configurações
- **Os ícones de ajuda das Configurações voltaram a funcionar.** Eles apontavam para um endereço que, dentro da extensão, não existe — clicar não levava a lugar nenhum. Agora abrem a documentação em seipro.app
- **A extensão passou a construir sua interface por um caminho único**, que higieniza todo o HTML antes de inserir na página e tira as ações de dentro dos atributos do HTML. É exigência da loja do Firefox, que recusou a extensão por isso, e vale também para quem usa o Chrome: é uma camada a menos por onde conteúdo de terceiros poderia virar código. **Sem mudança de funcionamento** — os cinco arquivos convertidos nesta etapa foram percorridos um a um no SEI 4.1.5 e no SEI 5
- De passagem, três defeitos antigos que ninguém via: um bloco de estilos era injetado sem a tag de fechamento, uma caixa de diálogo abria uma marcação e fechava outra, e três atributos de dados eram gravados com um nome que o navegador não reconhece como tal

### Versão 2.2.1
24/09/2026

Versão de acerto do [Estúdio de Fluxo](../pages/FLUXOS.md), com o mesmo dia de vida da 2.2.

- **A sugestão do fluxo aparece mesmo quando você abre o processo pelo número.** O cartão só sabia morar na capa; quem chega pela pesquisa rápida cai direto num documento, e a capa nem é desenhada — a sugestão ficava só na bolinha do ícone do robô, que pisca sem dizer o que é. Agora, quando não há capa na tela, a mesma sugestão aparece numa faixa estreita entre a barra de ações e o documento: a etapa que falta, quanto do rito já andou e os dois botões de sempre
- **O Estúdio de Fluxo também na barra de ações dentro do processo.** O ícone existia só na tela de Controle de Processos; agora fica ao lado do Agente de IA enquanto você lê os autos
- **Botão *Voltar* no editor de fluxo.** Antes só se saía de um fluxo abrindo outro: quem entrava para conferir ficava preso na edição. O botão avisa se houver alteração não salva
- Detalhes de acabamento: a faixa usa a moldura do SEI (mesma sombra e mesmos cantos das caixas dele) e o ícone do Estúdio passou a responder ao mouse como os vizinhos da barra

### Versão 2.2
24/09/2026

Versão que ensina a extensão o **rito da sua unidade** — e o agente a escrever no padrão dela.

- **Novo** — [Estúdio de Fluxo](../pages/FLUXOS.md): todo mundo na unidade sabe que a Nota Técnica costuma ser seguida de um Despacho de aprovação, e que um Ofício-MINUTA assinado vira Ofício expedido. Só que esse conhecimento não está escrito em lugar nenhum: mora na cabeça de quem tem tempo de casa. Agora dá para escrevê-lo. Você mapeia a sequência de documentos que um tipo de processo percorre, e o SEI Pro passa a dizer **em que etapa cada processo está** e a sugerir qual costuma ser a próxima providência — num cartão que aparece na capa do processo e no painel do agente, com um ponto no ícone do robô. Você aceita, adia ou recusa; aceitar manda o agente preparar a minuta, que continua passando pela sua aprovação
- *Aprender de um processo modelo*: se um processo já percorreu o rito inteiro, aponte o número e o Estúdio propõe o fluxo. Ele lê da árvore apenas os **títulos dos documentos na ordem**, a unidade, se estão assinados e o histórico — o conteúdo dos documentos **não** é lido nem enviado — e separa etapa do rito de documento acessório (anexo, comprovante, e-mail). Com dois ou três processos ele fica bem melhor, e diz o que divergiu entre eles. A proposta vem **desligada**, para você conferir e corrigir: precedente não é norma
- *Fluxos da equipe*: em vez de cada pessoa mapear o seu, a unidade mantém os fluxos numa pasta de repositório público e todo mundo aponta para ela, com sincronização — igual às skills. Os arquivos são `.md` que se leem e se editam no próprio GitHub, com histórico e revisão. Qualquer fluxo pode ser exportado em `.md` com um clique, e um `.md` que alguém te mandar abre direto do computador como rascunho. Há um modelo pronto em [fluxos-exemplo](https://github.com/SEI-Pro/sei-pro/tree/master/fluxos-exemplo)
- *A tela explica o silêncio*: se você mapeou o fluxo, ligou e não apareceu sugestão, o Estúdio diz por quê — o fluxo não se aplica àquele tipo de processo, o rito ainda não começou, já está cumprido, ou você mesmo mandou ignorar aquela etapa naquele processo
- **O agente escreve com os estilos do SEU órgão.** Antes de escrever o conteúdo, ele consulta os estilos que o editor daquele documento realmente oferece e usa só aqueles. Parece detalhe e não é: a lista de estilos é configurada por órgão e por seção do modelo, e o SEI **ignora em silêncio** a classe que não existe — o documento saía sem formatação nenhuma e ninguém via erro
- **O agente aprende com os seus documentos.** Antes de escrever, ele pergunta se você quer que procure documentos parecidos seus para seguir a estrutura e a linguagem. Se sim, procura os do **mesmo tipo**, priorizando os do mesmo tipo de processo e os gerados por você, e lê um ou dois antes de redigir
- **O agente não apaga mais o conteúdo do documento em silêncio.** Ao escrever, ele podia gravar um corpo em branco: o SEI aceita isso sem reclamar e responde como se tudo tivesse dado certo, então o documento ficava só com cabeçalho e signatário e o agente anunciava sucesso. Agora conteúdo em branco é recusado antes de ir para o SEI, e o agente só diz que gravou depois de reler o documento e confirmar o que ficou lá
- **Documento criado aparece na hora.** Ao criar um documento, a árvore do processo é recarregada e o documento novo abre no visualizador — antes ele existia no SEI e não aparecia na tela até você recarregar à mão. Ao alterar o conteúdo de um documento, o visualizador também é atualizado
### Versão 2.1.2
23/09/2026

Versão de correção da cópia de tabelas.

- **Copiar uma tabela do SEI e colar fora dele** — no Teams, no Word, num e-mail — deixa de trazer um fundo cinza atrás do texto. Esse cinza vinha da própria extensão: dentro do SEI ele é invisível, mas ia junto na cópia, e o Teams ainda o transformava em realce palavra por palavra
- A cópia agora sai limpa. Ficam só as colunas com conteúdo, com bordas simples: sem a barra *Baixar / Copiar / Pesquisar*, sem a linha de pesquisa, sem as caixas de seleção e sem a coluna de ações, que fora do SEI aparecia como um punhado de imagens quebradas
- Se você pesquisou dentro da tabela antes de copiar, vai **o que está na tela** — as linhas escondidas pelo filtro não são mais copiadas
- Colando em **Excel** ou em editor de texto simples, o conteúdo chega em colunas. Antes chegava o código HTML da tabela

Vale para todas as tabelas em que o SEI Pro oferece o botão *Copiar*: blocos de assinatura, favoritos, processos e documentos em lote, histórico de processos e resultado de pesquisa.

### Versão 2.1.1
23/09/2026

Versão de correção do editor, com uma função nova.

- **Novo** — [Converter os números SEI do texto em links](../pages/LINKSEILOTE.md): escreveu um despacho que cita vários documentos? Em vez de marcar número por número e clicar no botão de link a cada vez, a extensão varre o texto, encontra os números e converte todos de uma vez. Ela reconhece o tamanho do número olhando os documentos do próprio processo, mostra antes a lista do que encontrou — para você desmarcar o que não for documento — e, no fim, diz quais ficaram de fora e por quê. No SEI 5 fica na barra do editor; no SEI 3 e 4, dentro da janela *Inserir um Link para processo ou documento do SEI!*
- **Botões do SEI Pro voltam à barra do editor no SEI 5.** Nenhum deles aparecia: a extensão concluía que o editor era o antigo, porque o SEI 5 também chama o CKEditor de `CKEDITOR`. Com isso, as funções do editor ficavam todas inacessíveis — tabela rápida, estilos, sumário, nota de rodapé, referências, QR Code, marca d'água e as demais
- **Aumentar e diminuir o tamanho da letra** volta a funcionar no SEI 3 e 4: a extensão dizia *"Selecione um texto"* mesmo com o texto selecionado. O mesmo defeito atingia **Copiar formatação**, **Marca de sigilo** e **Revisar documento**
- Aumentar e diminuir a letra também passam a existir **no SEI 5**, onde os botões nunca chegaram a ser criados. E, no SEI 3 e 4, a fonte deixa de empacar: a partir do terceiro clique ela parava de crescer
- **Inserir link do SEI** com o número já selecionado: a janela volta a vir preenchida e confirmada sozinha
- Corrigido um erro que disparava a cada clique dentro do texto e impedia a extensão de receber as teclas — era o que atrapalhava a [escrita interativa](../pages/ESCRITAINTERATIVA.md) (`#` e `@`) no SEI 3 e 4

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
