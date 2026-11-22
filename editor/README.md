# editor

Editor de documentos do SEI Pro em TypeScript. Convive com o legado (`dist/js/sei-pro-editor*.js` e
`dist/js/modules/editor/`) e o vai substituindo recurso por recurso. Desenho:
`docs/superpowers/specs/2026-11-20-editor-ts-design.md`.

## Como roda

- `dist/js/init_editor.js` (content script isolado, `src/ponte/`): grava no `<html>` o atributo
  `data-seipro-editor-ts="id1,id2,..."` e injeta o bundle.
- `dist/js/editor/pagina.js` (mundo da pagina, `src/pagina/`): so la existe o CKEditor (`CKEDITOR.instances` no CK4;
  `ckeditorInstance` e `INFRA_EDITOR_CONFIG` no CK5). Instala em `window` os globais de cada recurso (mesmos nomes
  do legado) e inicia os recursos quando o editor esta pronto.
- O `loadModules` do adapter legado pula os modulos listados no atributo. Os modulos portados foram apagados.

## Estrutura

- `src/adaptador/`: CK4 e CK5 atras de uma interface unica (`Adaptador`); recursos nunca falam com `CKEDITOR.*`.
- `src/recursos/<id>.ts`: um recurso por arquivo (`Recurso`: `id`, `globais`, `iniciar`); registrar em `ids.ts` e `indice.ts`.
- `src/ui/`: dialogo (sem "Cancelar") e aviso por DOM API, sem `innerHTML`; `src/util/`: helpers.
- `tests/`: provas com linkedom e CKEditor falsos (`tests/falsos/`), sem framework. `tests/contrato-legado.json`
  congela os globais que o legado ainda chama dos modulos ja apagados.

## Comandos

    npm install && npm run tipos && npm run verificar && npm run checar
    npm run build            # gera dist/js/editor/pagina.js e dist/js/init_editor.js (ASCII)

## Novo recurso

1. Ler o modulo legado e fixar casos entrada -> saida no teste (rodando o legado, se preciso).
2. Teste em `tests/recursos/<id>.ts` nos dois editores (`nosDoisEditores`), registrar em `tests/verificar.ts`.
3. `src/recursos/<id>.ts` exportando os globais EXATOS do legado; registrar em `ids.ts` e `indice.ts`.
4. Validar ao vivo no CK4 (SP) e no CK5 (ANTAQ). **Depois de `installExtension` o primeiro carregamento usa o content
   script antigo e roda o legado: confira `data-seipro-editor-ts` e recarregue pelo menos 2 vezes.**
5. So entao apagar o modulo legado (prova de referencias vivas com `acorn`, `node tools/check-dom-injection.mjs`,
   `node tools/conferir-modos.mjs <arquivo> <ref>`, `node tools/escape-nonascii.mjs --check`), tirar de `MODULES` no
   adapter e acrescentar o contrato em `tests/contrato-legado.json`.

## Armadilhas conhecidas

- SEI 4.1: a barra e compartilhada e mora no wrapper da 1a instancia (Cabecalho, somente leitura); `getInstance`
  prefere a instancia com foco.
- CK5: o cursor do model fica na raiz focada; escritas em raiz somente leitura sao ignoradas. Classe/estilo/atributo
  so pelo model (`window.SeiProGhs`, recurso `ghs-unlock`); o estilo SEI do paragrafo e o atributo `estilo`.
