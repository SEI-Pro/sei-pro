# Modelo limpo

Contribuição do IPPLAM (Instituto de Pesquisa e Planejamento Urbano de Maringá, Município de Maringá/PR),
por Bruno Albuquerque. Ver [CREDITOS.md](../CREDITOS.md).

Gerar documento a partir de Documento Modelo no SEI 5 sem herdar a formatação que o CKEditor 5 não entende
(`<style>` e classes do Google Docs, restos do CK4, a marca d'água MINUTA duplicada). Manual do usuário:
[pages/MODELOLIMPO.md](../pages/MODELOLIMPO.md). Plano e diagnóstico:
[docs/superpowers/plans/2026-11-17-modelo-limpo.md](../docs/superpowers/plans/2026-11-17-modelo-limpo.md).

Content script isolado (`dist/js/init_modelo_limpo.js`, todos os frames), opção `modelolimpo` (desligada por
padrão), em duas telas:

- **Gerar Documento** (`src/gerar.ts`): botão "Salvar com modelo limpo" ao lado de cada "Salvar", só com
  "Documento Modelo" marcado. Grava um pedido em `chrome.storage.local` (`src/pedido.ts`: mesmo processo,
  2 minutos, uso único) e aciona o "Salvar" do próprio SEI.
- **Editor CK5** (`src/editor.ts`): com pedido válido, lê o `INFRA_EDITOR_CONFIG` da página (o HTML que o SEI
  copiou, antes de o CK5 normalizar e perder os negritos), limpa cada seção editável (`src/preparar.ts`) e
  passa o resultado ao mundo da página (`src/pagina.ts` → `dist/js/modelo-limpo-pagina.js`), que faz
  `editor.data.set` desfazível, sem salvar.

A limpeza (`src/limpeza/`) é função pura: `limparSecao(html, { estilos, estiloPadrao, folhasDoDocumento })`.
Lê as folhas `<style>` do modelo como texto (`css.ts`), escolhe a classe permitida mais próxima pelo nome do
estilo do SEI (`classes.ts`) e simula os contadores dos estilos de dispositivo para só usar
`Item_Inciso_Romano`/`Item_Alinea_Letra` quando a numeração que o CSS do SEI desenharia bate com a da lista.

    npm install
    npm run tipos
    npm run build      # roda tests/verificar.ts e gera os dois bundles em ASCII

Não editar os bundles à mão. Fixtures: `tests/fixtures/modelo_exemplo_{corpo,anexos}.html` (estrutura e formatação de um modelo real
do SEI 5.0.5 municipal, com o texto trocado por palavras fictícias e as imagens por 1 px) e
`estilos_pmm505.json`; o editor real fica em `sei-nucleo/tests/fixtures/sei5/editor_pmm505.html`.

## Validação no SEI

Pendente: gerar a partir de um Documento Modelo no SEI 5.0.5 e conferir negritos, títulos, tabelas e a edição
depois de salvar.
