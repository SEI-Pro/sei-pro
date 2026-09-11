# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Ferramentas de PDF](../img/icon-ferramentaspdf.png) Ferramentas de PDF

Nove ferramentas para trabalhar arquivos PDF antes de anexá-los ao processo: tarjar dados sensíveis, juntar, dividir, comprimir, organizar páginas, converter imagens, numerar, aplicar OCR e conferir PDF/A.

### Tudo acontece no seu computador

**Nenhum arquivo é enviado para servidor nenhum** — nem do SEI Pro, nem de terceiros. Todo o processamento roda dentro do seu navegador, e as ferramentas continuam funcionando com a máquina desconectada da internet.

Isso não é uma promessa: é uma consequência de como a funcionalidade foi construída.

* O motor de PDF e o de reconhecimento de texto vêm **dentro da extensão**. Nada é baixado durante o uso.
* A extensão **não pede permissão de acesso a sites**.
* **Não há telemetria**: nenhum evento de uso é registrado ou transmitido.
* Ao fechar a aba, os documentos saem da memória. Nada fica guardado.

Você pode conferir: abra a aba **Rede** das ferramentas de desenvolvedor do navegador antes de processar um arquivo. Não haverá requisição alguma com o conteúdo do documento.

> **Uma precisão importante:** quando você traz um documento do processo aberto, os bytes atravessam de uma aba do navegador para outra, no seu próprio computador. O que não acontece, em nenhum caso, é o arquivo sair da sua máquina.

### Como abrir

A página abre por quatro caminhos:

| Onde | O que muda |
| ---- | ---------- |
| Barra de ações da tela **Controle de Processos** | Abre a página vazia, para você arrastar arquivos do computador |
| Barra de ações da **árvore do processo** | Abre já sabendo o processo, permitindo trazer e devolver documentos |
| **Menu lateral** do SEI | Acesso de qualquer tela |
| Ícone do **SEI Pro** na barra do navegador | Abre sem precisar estar no SEI |

### As ferramentas

#### Tarjar PDF

Suprime CPF, e-mail e outros dados sensíveis de um PDF, **de forma que o texto deixe de existir no arquivo**.

A maioria dos editores desenha um retângulo preto por cima, e o texto continua lá — basta selecionar e copiar para recuperá-lo. Aqui a página é reconstruída: o que foi tarjado não entra no documento gerado.

E o resultado é conferido antes de ser entregue. Depois de gerar o arquivo, a ferramenta o reabre e procura o que deveria ter sumido: pela posição na página, pelo texto extraído e por varredura direta dos bytes. **Se qualquer uma das três provas falhar, o arquivo não é entregue.**

A detecção automática reconhece CPF, CNPJ, e-mail, telefone, CEP, cartão, chave PIX aleatória, data de nascimento, RG, PIS, título de eleitor, CNH e número de processo — com conferência de dígito verificador, o que evita marcar sequências que só se parecem com um documento. Você também pode marcar qualquer área à mão.

As amostras exibidas na tela vêm sempre mascaradas: uma captura de tela da própria ferramenta não revela o dado que ela existe para esconder.

> **Documento assinado digitalmente:** tarjar altera o arquivo e invalida a assinatura. A ferramenta avisa antes de prosseguir. O documento original no seu computador não é alterado.

#### Juntar PDF

Une vários PDFs em um documento só, na ordem que você definir.

#### Comprimir PDF

Reduz o tamanho do arquivo para caber no limite exigido pelo órgão. Ao abrir a ferramenta a partir do SEI, o limite é lido da sua própria instalação.

No fim, um relatório diz o que foi feito — inclusive quando **não** foi possível reduzir, e por quê. Imagens em formatos que seriam corrompidos por recompressão são preservadas como estavam.

#### Dividir PDF

Separa páginas, intervalos, ou parte o arquivo em pedaços que caibam num limite de tamanho.

#### Organizar PDF

Reordena, gira e remove páginas antes de protocolar, com miniaturas de todas as páginas.

#### Imagem para PDF

Converte fotos e digitalizações JPG ou PNG em um PDF único.

#### Numerar páginas

Insere numeração de páginas ou de folhas, na posição que você escolher.

#### OCR: PDF pesquisável

Torna pesquisável um PDF digitalizado. O modelo de português já vem com a extensão — **funciona offline**.

A imagem original é preservada: o texto reconhecido entra como camada invisível por cima, então o documento continua com a mesma aparência.

#### Conferir PDF/A

Explica por que o seu PDF não é aceito como PDF/A: declaração de perfil, criptografia, fontes embutidas, perfil de cor, JavaScript e anexos.

> Esta ferramenta **não converte** arquivos. Converter para PDF/A de verdade exige software que não pode ser distribuído aqui, e um conversor pela metade entregaria um arquivo que só seria recusado depois do prazo.

### Integração com o SEI

Quando a página é aberta a partir do SEI, três coisas a mais ficam disponíveis:

* **O limite real do seu órgão.** Não existe um "limite do SEI": cada instalação configura o seu, e a diferença entre uma e outra vai de poucos megabytes a vários gigabytes. As ferramentas de comprimir e dividir passam a usar o número verdadeiro, com margem de segurança — a assinatura digital acrescenta bytes depois.
* **Trazer documentos do processo.** Lista os documentos externos em PDF do processo aberto, para carregá-los sem baixar um a um.
* **Devolver ao processo.** Envia o arquivo processado direto para o processo, sem salvar e reanexar à mão. O documento entra como **externo**, do mesmo jeito que entraria se você o arrastasse para a árvore: o **tipo** é deduzido do nome do arquivo (um arquivo chamado *Ofício 32.pdf* entra como Ofício) e, quando o nome não diz nada, vale o tipo padrão que você configurou — ou **Anexo**. O **nível de acesso** e o formato seguem as suas configurações do SEI Pro. Nada é enviado sem você clicar.

Aberta pelo ícone da extensão, sem SEI, a página funciona igual — apenas sem esses três atalhos.

> **Atenção às extensões aceitas:** a lista do SEI costuma incluir PDF e os formatos ODF, mas **não** aceita `doc`, `docx`, `xls`, `xlsx`, `ppt` nem `pptx`. Quem tenta anexar um arquivo do Word é barrado — e esse é um motivo de recusa tão frequente quanto o tamanho.

### Limites

O teto é a memória do seu computador, e ele existe. Documentos muito grandes podem esgotá-la, principalmente no OCR, que trabalha página a página em alta resolução. O OCR processa até 100 páginas por execução.

## Próximo item

> [Enviar múltiplos documentos externos](../pages/UPLOADDOCS.md)
