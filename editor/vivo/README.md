# vivo/ — validação ao vivo (CDP) dos recursos do editor

Scripts para validar um recurso no **CK4 (SP treinamento)** e no **CK5 (ANTAQ)** com o Chrome for Testing. Nada aqui roda
nos testes automatizados (`npm run verificar`); é ferramenta de quem porta um recurso.

## Uma vez por sessão

1. Chrome for Testing (versão do seu Chrome) e perfil próprio: `SPRO_CFT=<executável> SPRO_PERFIL=<pasta> nohup node vivo/daemon.cjs > /tmp/spro-daemon.log 2>&1 &`
   (porta 9444; nunca use o Chrome de outra sessão; nunca duas cópias do SEI Pro no mesmo navegador).
2. SP: `SEI_SP_USUARIO`/`SEI_SP_SENHA` (conta de teste, ver memória `reference_sei_sp_treinamento`); `abrirEditorSp()` de
   `ambientes.cjs` abre o documento de teste no editor. ANTAQ: o login Microsoft é do autor; deixe aberto o editor do
   Despacho-MINUTA de teste (processo 50300.018905/2018-67, documento 3385255).

## Por recurso

    node vivo/preparar.cjs reinstalar <id-do-recurso>

Reinstala a extensão, **recarrega cada editor 2 vezes** (o 1º carregamento depois de reinstalar usa o content script antigo
e roda o legado) e falha se o `data-seipro-editor-ts` não contiver o id. Depois use `rodarEm(pagina, fn)` de
`cenario.cjs` (a `fn` roda na página e lê `window.__spro`; a mesma API nos dois editores: `definirHtml`, `cursorEm`,
`selecionarTexto`, `obterHtml`, `desfazer`).

## Armadilhas

- SP: a sessão cai com facilidade (o primeiro clique num processo pode devolver a tela de login); relogue e feche o modal
  "Novidades" com Esc.
- CK5: o cursor do model fica na raiz focada; `focus()` na editável do corpo ANTES da seleção nativa. Selecionar por
  `model.change(setSelection)` e depois focar faz o CK5 reler o cursor antigo.
- Nada é salvo pelos testes (só edição em memória); recarregar a página descarta.
