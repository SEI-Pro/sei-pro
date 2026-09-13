# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Ativar debug](../img/icon-debugpage.png) Ativar debug (diagnóstico de problemas)

Se alguma função do SEI Pro não aparece ou não funciona como deveria, esta opção faz a extensão **registrar mensagens de diagnóstico no console do navegador**. Essas mensagens mostram, passo a passo, o que o SEI Pro está tentando carregar — e ajudam muito quem vai investigar o problema.

É uma opção para **quando algo dá errado**. No dia a dia, mantenha-a desligada.

> ![Tela Complementos](../img/tela-desativaconsultas.png)

### Como usar

1. Abra as [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Complementos**, e marque **Ativar debug**. Clique em **Salvar**;
2. Volte ao SEI e **recarregue a página** onde o problema acontece;
3. Abra o console do navegador:
   * **Chrome e Edge:** tecla `F12` (ou `Ctrl + Shift + J`; no Mac, `Cmd + Option + J`) e clique na aba **Console**;
   * **Firefox:** `Ctrl + Shift + K` (no Mac, `Cmd + Option + K`);
4. Repita o que estava fazendo quando o problema apareceu;
5. Clique com o botão direito dentro do console, escolha **Salvar como...** (ou selecione as mensagens e copie) e anexe ao relato.

### Onde relatar

Abra uma [issue no GitHub do SEI Pro](https://github.com/pedrohsoaresadv/sei-pro/issues) contando:

* o que você fez e o que esperava que acontecesse;
* o navegador e a versão do SEI Pro (aparece na página de extensões do navegador, `chrome://extensions` ou `about:addons`);
* a versão do SEI do seu órgão, se souber;
* as mensagens do console.

### Bom saber

* As mensagens começam com **Reload** seguido do nome de uma função quando o SEI Pro está **esperando** algo carregar. Muitas repetições da mesma mensagem indicam onde a inicialização travou.
* **Antes de enviar, confira o conteúdo:** o console pode conter números de processo e nomes. Apague o que for sigiloso.
* Com o debug ligado, o console fica bem mais "barulhento", e o navegador pode ficar um pouco mais lento.

## Próximo item

> [Gerenciar Prescrições Processuais (institucional)](../pages/PRESCRICOES.md)
