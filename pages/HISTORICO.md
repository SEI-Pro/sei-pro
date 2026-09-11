# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Histórico de Versões](../img/icon-historico.png) Histórico de versões

### Versão 1.7.0
10/09/2026

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
- O OCR das [Ferramentas de IA](../pages/FERRAMENTASIA.md) parou de baixar o motor de reconhecimento e o modelo de português de uma CDN externa a cada uso: os arquivos passam a vir dentro da extensão. Além de mais rápido, é o que permite afirmar que a extensão não busca nada de terceiros
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
- Corrigido o envio de conteúdo vazio às [Ferramentas de IA](../pages/FERRAMENTASIA.md) — quando não era possível ler o documento, o texto seguia para a plataforma como a palavra "false" e a resposta vinha sobre um conteúdo inexistente
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
- Adicionado [Mover ícone de excluir documentos para o final da lista](./pages/MOVERICONE.md)
- Adicionado o [Autopreencher senha no login (SEI >= 4.0)](./pages/AUTOPREENCHERSENHA.md)
- Adicionado [Numerar documentos na árvore do processo](./pages/NUMERARDOCSARVORE.md)
- Adicionado o [Contador de processos não recebidos no ícone do SEI](./pages/CONTADORPROCESSOICONE.md)
- Adicionado [Mostrar especificação do processo na tabela de controle de processos](./pages/ESPECIFICACAOPROCESSO.md)
- Adicionado [Mostrar nomes de usuários na tabela de controle de processos](./pages/NOMESUSUARIOS.md)
- Adicionado [Permitir marcar processos como "Não Visualizado"](./pages/NAOLIDO.md)
- Adicionado a [Comparador de Documentos](./pages/COMPARARDOCUMENTOS.md)
- Adicionado a [Reabertura programada de processos](./pages/REABRIRPROCESSOS.md)
- Adicionado o [Ditado no editor de documentos](./pages/DITADO.md)
- Adicionado a [Escrita interativa no editor de documentos](./pages/ESCRITAINTERATIVA.md)
- Adicionado a [Revisão de texto no editor de documentos](./pages/REVISARDOC.md)
  
### Versão 1.2
10/02/2023

- Correções e melhorias
- Adicionado a [Redução da qualidade das imagens inseridas nos documentos](./pages/QUALIDADEIMAGENS.md)
- Adicionado as [Teclas de atalhos no editor de documentos](./pages/TECLASATALHO.md)
- Adicionado as [Referências internas](./pages/REFERENCIAINTERNA.md) (Sugestão Hélio Oliveira e Roberto Balata)

### Versão 1.0
15/06/2022

- Correções e melhorias
- Adicionado a [Alteração do layout do SEI (Estilo Avançado + Modo Noturno)](..pages/ESTILOAVANCADO.md)
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

- [Alterar o layout do SEI (Estilo Avançado + Modo Noturno)](..pages/ESTILOAVANCADO.md)
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
- [Filtrar e ordenar tabelas ao clicar no seu cabeçalho](../pages/ORDERNARTABELA.md)
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
