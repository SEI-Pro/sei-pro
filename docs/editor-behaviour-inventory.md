# Inventário comportamental do editor SEI Pro

Referência de aceitação da migração do editor CKEditor 4. O nome entre parênteses é o seletor
compatível da barra; todas as ações também estão disponíveis na paleta `Ctrl+K`, exceto os
contêineres de menu sem ação própria.

| Ação | Comportamento esperado |
|---|---|
| Ferramentas de IA (`.getPlataformAIButtom`) | Abre o diálogo isolado de IA para o editor ativo. |
| Importar (`.importDocButtom`) | Insere texto de Word, HTML ou Google no editor, carregando Mammoth somente para DOCX. |
| Legislação (`.getLinkLegisButtom`) | Pesquisa e insere link de norma. |
| Citação SEI (`.getCitacaoDocumentoButtom`) | Insere referência a documento do processo. |
| Nota de rodapé (`.getNotaRodapeButtom`) | Cria ou edita nota de rodapé. |
| Referência interna (`.getRefInternaButtom`) | Insere âncora/referência dentro do documento. |
| Sumário (`.getSumarioButtom`) | Gera sumário a partir da estrutura do texto. |
| Dados do processo (`.getDadosProcessoButtom`) | Pesquisa, mostra prévia e insere um campo do processo. |
| Código QR (`.getQrCodeButtom`) | Configura e insere QR, carregando a biblioteca sob demanda. |
| Quebra de página (`.getPageBreakButtom`) | Insere quebra de página. |
| Quebra de seção (`.getSessionBreakButtom`) | Insere quebra de seção. |
| Link público (`.getProcessoPublicoButton`) | Consulta e insere link público após captcha. |
| Marca d’água (`.getMinutaWatermarkButton`) | Aplica/remove marca MINUTA ou MODELO. |
| Fundo/página (`.pageImageBackgroundButtom`) | Configura imagem de fundo e impressão. |
| Tabela rápida (`.getQuickTableButtom`) | Insere tabela pela grade de linhas/colunas. |
| Estilo de tabela (`.getTablestylesButtom`) | Aplica cores e estilos à tabela selecionada. |
| Qualidade de imagens (`.getBatchImgQualityButtom`) | Redimensiona/comprime imagens em lote. |
| Caixa de seleção (`.getInsertCheckboxButtom`) | Insere checkbox no conteúdo. |
| Maiúsculas iniciais (`.getCapLetterButtom`) | Capitaliza palavras preservando artigos/preposições. |
| Aumentar fonte (`.getFontSizeUpButtom`) | Aumenta o tamanho do trecho selecionado. |
| Diminuir fonte (`.getFontSizeDownButtom`) | Diminui o tamanho do trecho selecionado. |
| Copiar formatação (`.getCopyStyleButtom`) | Copia/aplica a formatação do trecho. |
| Menu de alinhamento (`.getAlignButtom`) | Exibe as quatro ações de alinhamento. |
| Esquerda (`.getAlignLeftButtom`) | Alinha o texto à esquerda. |
| Centro (`.getAlignCenterButtom`) | Centraliza o texto. |
| Direita (`.getAlignRightButtom`) | Alinha o texto à direita. |
| Justificar (`.getAlignJustifyButtom`) | Justifica o texto. |
| Marcar protegido (`.getMarkSigiloButton`) | Localiza ou marca dados pessoais/protegidos. |
| Caixa de sigilo (`.getBoxSigiloButton`) | Insere/remove bloco de conteúdo tarjado. |
| Ativar revisão (`.getReviewButton`) | Liga/desliga o registro de alterações. |
| Gerenciar revisões (`.getCtrReviewButton`) | Aceita/rejeita uma, todas ou apenas as próprias revisões. |
| Ativar ditado (`.getDitadoButton`) | Liga/desliga reconhecimento de voz. |
| Configurar ditado (`.getCtrDitadoButton`) | Abre opções de idioma e ditado. |
| Criar estilo (`.getNewStyleButton`) | Cria/aplica estilo personalizado. |
| Formatar legislação (`.getLegisButtom`) | Estrutura artigos, incisos, alíneas e itens. |
| Combo do CKEditor (`.cke_combo_button`) | Ajusta o painel nativo ao tema escuro. |
| Checklist (paleta) | Valida pendências e leva ao ponto encontrado. |
| Rascunhos/trechos/comparação (paleta) | Recupera versões, insere trechos e compara documentos. |

## Estado de verificação

- Cobertura automatizada: domínio, IO, views principais, provedores, segurança e estrutura.
- Build e suite completa: executar `npm test`.
- Verificação visual/integração real: seguir `SMOKE_TEST.md §3` em uma sessão SEI 4.1.
