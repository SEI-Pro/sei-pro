# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## Gerar documento com modelo limpo

Um documento gerado a partir de um **Documento Modelo** herda tudo o que estava no modelo, inclusive a formatação que veio de fora: textos colados do **Google Docs** ou do **Word** e restos do editor antigo do SEI. No SEI 5, o editor novo não entende essa formatação. O documento abre aparentemente certo, mas **desconfigura quando você edita**: recuos mudam, negritos somem, títulos viram texto comum.

O botão **Salvar com modelo limpo** gera o documento a partir do modelo como o SEI sempre fez e, quando o editor abre, troca a formatação herdada pelos **estilos do seu órgão**. O texto não muda.

### Como usar

1. No processo, clique em **Incluir Documento** e escolha o tipo, como de costume;
2. Em **Texto Inicial**, marque **Documento Modelo** e informe o número SEI do modelo;
3. Preencha o resto da tela normalmente (descrição, interessados, nível de acesso);
4. Clique em **Salvar com modelo limpo**, ao lado do botão **Salvar**;
5. O editor abre com o documento já limpo e um aviso no canto da tela com o que foi feito. **Revise e salve.** Se preferir o documento como o SEI copiou, aperte **Ctrl+Z** antes de salvar.

O botão só aparece com **Documento Modelo** marcado. Com **Texto Padrão** ou **Nenhum**, use o Salvar do SEI.

### O que a limpeza faz

* **Remove** as folhas de estilo coladas no meio do texto (as do Google Docs mudavam títulos, listas e tabelas da página inteira), as classes do Google Docs e do Word e a marca d'água "MINUTA" duplicada. A marca d'água volta **uma vez**, como o SEI Pro faz em toda minuta.
* **Mantém** parágrafos, **negrito**, *itálico*, sublinhado, tabelas (com células mescladas), imagens e links.
* **Recupera** o que o editor novo jogava fora: negritos do Google Docs e títulos (CAPÍTULO, Seção) como parágrafo centralizado em negrito.
* **Dá a cada parágrafo um estilo do seu órgão**, escolhido entre os que aquela parte do documento aceita: justificado com recuo, centralizado, à direita, texto de tabela… Ementa e autoria deslocadas à direita continuam deslocadas.
* **Mantém os espaçamentos do modelo**: o espaço antes e depois de cada parágrafo e a entrelinha (por exemplo, 1,5 nos títulos). Alinhamento e recuo que nenhum estilo do órgão reproduz também ficam no parágrafo.
* **Listas numeradas automáticas** viram os estilos de dispositivo do órgão (inciso, alínea) quando a parte do documento os aceita. Quando não aceita, o número é **escrito no texto** ("a)", "I -"), para não sumir. Incisos e alíneas que já estavam escritos no modelo ficam como estão.

### Bom saber

* Nada é salvo sem você: a limpeza só muda o que está no editor aberto.
* Cabeçalho, título e rodapé do tipo de documento não são tocados.
* Documento sigiloso não passa pela limpeza.
* Se a sua unidade quiser os estilos de inciso e alínea também no Corpo do Texto, peça ao administrador do SEI que os habilite para o tipo de documento. A limpeza passa a usá-los sozinha.
* A limpeza vale para o SEI 5. No SEI 4 o editor antigo convive com essa formatação.

### Como ativar

A função vem **desligada** de fábrica. Para ligar, abra as [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Geral**, seção **Editor de Texto**, e marque **Gerar documento com modelo limpo**. Clique em **Salvar** e recarregue a tela do processo.

> Função contribuída pelo IPPLAM (Maringá/PR). Veja os [Créditos](../CREDITOS.md).

## Próximo item

> [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md)
