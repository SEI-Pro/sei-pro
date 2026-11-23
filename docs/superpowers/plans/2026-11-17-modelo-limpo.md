# Modelo limpo — gerar documento a partir de modelo sem herdar a formatação quebrada

Pedido de 17/11/2026. Órgão migrou do SEI 4.1.5 para o 5.0.5; documento gerado com "Texto inicial: Documento
Modelo" abre no CKEditor 5 e desconfigura ao editar. Execução em sequência; nada de commit, tag ou push sem
pedido do autor.

## Diagnóstico (exemplos reais do órgão, guardados fora do repositório)

Um Documento Modelo montado no Google Docs e uma cópia dele, ambos de 1,7 MB:

1. **`<style>` do Google Docs dentro do conteúdo** (14 KB, 156 regras). Parte das regras é global
   (`h1`–`h4`, `ol {padding:0}`, `table td {padding:0}`) e, aberto o documento, atinge a página e a UI do CK5.
2. **Classes do Google Docs** (`c2`, `c16`, `c6 c35`…) em quase todo parágrafo. A cópia soma a classe do SEI
   (`Texto_Justificado_Recuo_Primeira_Linha c2`) e as duas brigam por recuo e espaçamento.
3. **O CK5 descarta `<span>` e `h1`–`h4` que não conhece.** O negrito do Google Docs vinha de `span.c8`
   (`font-weight:700`): "Art. 12." perde o negrito; "CAPÍTULO II" (`h3` centralizado e negrito) vira
   parágrafo justificado comum.
4. **Marca d'água MINUTA do próprio SEI Pro** (`dist/js/modules/editor/minuta-watermark.js`): grava
   `<style data-style="seipro-watermark">` no conteúdo; na cópia já aparece 3 vezes (soma a cada geração).

Editor 5.0.5 do órgão (documento 10000001): 5 seções (Cabeçalho, Título e Rodapé somente leitura; **Corpo do
Texto** principal; **Anexos** editável). Lista de estilos em **`infra.estilo`** (`itens`, `estiloPadrao`,
`css`) — o `sei-nucleo` só procura em `estilo` e hoje lê zero estilos neste órgão.

Estilos por seção: Corpo aceita 15 (nenhum de dispositivo); Anexos aceita 28, inclusive `Item_Inciso_Romano`,
`Item_Alinea_Letra`, `Item_Nivel1..4`, `Paragrafo_Numerado_Nivel1..4`.

## Decisões do autor

1. Botão na tela **Gerar Documento**, só para **Documento Modelo** (nº SEI). Texto Padrão fica de fora.
2. Limpeza **estrutura + estilos do órgão**: mantém parágrafos, negrito/itálico/sublinhado, listas, tabelas,
   links e imagens; toda formatação vira classe permitida da seção.
3. Listas numeradas viram **classes de dispositivo do órgão** (`Item_Inciso_Romano`, `Item_Alinea_Letra`…)
   onde a seção as aceita. Onde não aceita (Corpo, hoje), a numeração vira texto no parágrafo
   (`I –`, `a)`); o autor vai pedir ao administrador que habilite os `Item_*` no Corpo. A escolha é lida da
   lista de estilos da seção em tempo de execução: habilitado, passa a valer sem nova versão.
4. **Origem do HTML: a cópia do próprio SEI.** O SEI copia o modelo no servidor, seção a seção (funciona com
   modelo assinado). Ao abrir o editor do documento novo, a extensão lê o HTML bruto de cada seção
   (`INFRA_EDITOR_CONFIG.initialData`, antes do CK5 normalizar), limpa e põe no editor **sem salvar**: o
   usuário revisa e salva; Ctrl+Z desfaz.

## Desenho

```
Gerar Documento (frame)                      Editor do documento novo (janela)
  botão "Gerar com modelo limpo"               content script isolado
   ├ exige rdoTextoInicial=D e nº preenchido    ├ acha pedido pendente do mesmo processo (≤ 2 min)
   ├ grava pedido em chrome.storage.local        ├ injeta ponte no mundo da página (token)
   │  {idProcedimento, modelo, criadoEm}         ├ ponte: lê initialData + infra.estilo, limpa cada
   └ chama o btnSalvar nativo (validação SEI)    │  seção editável, editor.data.set(...) sem salvar
                                                 └ aviso: "Formatação do modelo limpa: revise e salve"
```

- Pedido consumido uma vez; expira em 2 min; casa por `idProcedimento` (`sei.idProcedimento` do editor).
- Seção somente leitura nunca é tocada. Sigiloso: o botão não aparece (nível 2 marcado na tela).
- Sem pedido pendente o editor é o do SEI, intacto.

### Limpeza (`limparSecao(html, { estilos, estiloPadrao })` — função pura, sem SEI)

1. Ler regras de todo `<style>` do fragmento: classe → propriedades (`text-align`, `text-indent`,
   `margin-left`, `font-weight`, `font-style`, `text-decoration`, `text-transform`) e regras de elemento
   (`h1`…`h4`). Ler também as regras `lst-kix_*` para saber o tipo de cada lista (decimal, romano, letra).
2. Remover `<style>`, `<script>`, `<meta>`, `<link>`, comentários, o parágrafo da marca d'água
   (`.minutaAncora` + `style[data-style=seipro-watermark]`), `id="h.*"`, `data-*`, `contenteditable`.
   A marca é recolocada uma vez pelo próprio SEI Pro quando o nome tem "minuta".
3. Inline: span negrito → `<strong>`, itálico → `<em>`, sublinhado → `<u>`; demais `<span>` desembrulhados;
   `<b>`/`<i>` → `<strong>`/`<em>`; `<font>` desembrulhado.
4. Blocos (`p`, `h1`–`h6`, `div`, `li`): uma classe só, escolhida entre as permitidas:
   - classe do SEI já presente e permitida → fica;
   - dentro de tabela → `Tabela_Texto_*` pelo alinhamento;
   - centralizado → `Texto_Centralizado` (+ `<strong>` se negrito); `h*` idem;
   - justificado com recuo de 1ª linha → `Texto_Justificado_Recuo_Primeira_Linha`; sem recuo →
     `Texto_Justificado`; esquerda → `Texto_Alinhado_Esquerda`; direita → `Texto_Alinhado_Direita`;
   - recuo esquerdo grande (≥ 100 pt) sem lista → `Citacao` se permitido;
   - nada casa → `estiloPadrao` da seção. Classe fora da lista nunca é emitida.
   - `style` inline sai, exceto `margin-left` nos parágrafos da seção Título (o SEI usa assim) — a
     confirmar nos testes.
5. Listas: item romano → `Item_Inciso_Romano`, letra → `Item_Alinea_Letra`, decimal → `Paragrafo_Numerado_*`
   pelo nível, se permitidos; senão parágrafo `Texto_Justificado_Recuo_Primeira_Linha` com o número
   escrito (`I –`, `a)`, `1.`) calculado da posição e do `start` da lista.
6. Tabelas: mantém `table/tr/td/th`, `colspan`, `rowspan`; tira classes e estilos do Google Docs.
7. Imagens `data:` mantidas. Links: mantém `href` http(s) e âncoras do SEI (`ancoraSei`); remove o resto.
8. Devolve `{ html, relatorio }` (contagens: estilos removidos, classes trocadas, negritos recuperados,
   listas convertidas) para o aviso ao usuário.

## Fases

**Fase 0 — Correção no `sei-nucleo`.** `lerEditor` aceita `estilo` na raiz **ou** em `infra.estilo`.
Fixture `tests/fixtures/sei5/editor_pmm505.html` (do exemplo 10000001, nome do autor anonimizado, hashes já
expirados). Teste: 5 seções, principal = Corpo, 15 estilos no Corpo, 28 nos Anexos, `estiloPadrao` por seção.

**Fase 1 — Limpeza (`modelo-limpo/`, sem efeito na tela).** Scaffold (copiar o de `menu-suspenso`),
`src/limpeza/{css,inline,blocos,listas,limpar}.ts`, `tests/verificar.ts` com `linkedom`. Fixture: o corpo do
modelo reduzido a trechos representativos. Testes: nenhum `<style>`/`c\d+`/`lst-kix` na saída; toda
classe emitida está na lista da seção; "Art. 12." sai em `<strong>`; "CAPÍTULO II" centralizado e negrito;
lista romana vira `Item_Inciso_Romano` nos Anexos e "I –" no Corpo; tabela mantém células e `colspan`;
marca d'água removida; limpar duas vezes = limpar uma vez.

**Fase 2 — Ponte do editor (mundo da página).** `src/ponte/editorPagina.ts` no padrão de
`agente-ia/src/ponte/editorPagina.ts` (token no `data-token`, `postMessage`). Lê `initialData` e
`infra.estilo` de `window.INFRA_EDITOR_CONFIG`, chama `limparSecao` em cada raiz editável, `editor.data.set`.

**Fase 3 — Botão em Gerar Documento + pedido pendente.** Content script no frame `documento_gerar` (5.0.x);
botão ao lado de `btnSalvar`, habilitado com `optProtocoloDocumentoTextoBase` marcado e nº preenchido;
grava o pedido e aciona o `btnSalvar` nativo. Content script no `editor_montar` consome o pedido.

**Fase 4 — Opção, manual e versão.** Opção `modelolimpo` em `opcoes-pagina/src/schema-dados.ts` (desligada
por padrão), entradas no `dist/manifest.json`, `pages/MODELOLIMPO.md`, `pages/HISTORICO.md`.

**Validação ao vivo (autor, SEI 5.0.5 do órgão):** gerar a partir do modelo com o botão; conferir negritos,
títulos, incisos, tabelas; editar e salvar sem desconfigurar; gerar sem o botão continua como o SEI faz.

## O que mudou na execução (17/11/2026)

- **Listas.** No modelo real, os 524 incisos, alíneas e parágrafos já são texto escrito ("I - …", "a) …");
  só há uma lista automática do Google Docs (2 alíneas). Os escritos ficam como estão; os `Item_*` valem só
  para listas automáticas. Os contadores do CSS do SEI são simulados: se a classe mostraria outra letra
  (alíneas continuando de outra lista), o número vai escrito.
- **Folhas entre seções.** O `<style>` do Google Docs está só no Corpo, mas os Anexos usam as mesmas classes;
  na página o CSS vale para o documento inteiro. A limpeza recebe as folhas das outras seções
  (`folhasDoDocumento`).
- **Botão na barra, não no quadro "Texto Inicial".** O 5.0.5 posiciona o quadro em coordenadas absolutas;
  o botão fica ao lado de cada "Salvar" e só aparece com "Documento Modelo" marcado. Escondido quando
  `sessionStorage.versaoSei` indica SEI anterior ao 5.
- **Recuo esquerdo grande** (≥ 50 pt) fica como `margin-left` inline: é o que o próprio tipo de documento do
  órgão usa na ementa e na autoria (`margin-left: 280px`).
- **Fase 0** confirmou: com a correção, o `sei-nucleo` lê 15 estilos no Corpo e 28 nos Anexos do 5.0.5 (antes,
  zero). As 3 falhas de "bloco interno" do `sei-nucleo` já existiam no `master`.
- **Espaçamento preservado** (pedido do autor depois da primeira entrega, revendo a decisão 2): o espaço
  antes/depois (`padding` do Google Docs, `margin` do Word/SEI) e a entrelinha diferente de 1,15 vão inline
  no parágrafo, com o alinhamento e o recuo de 1ª linha que a classe escolhida não reproduz. Opção
  `preservarEspacamento` (ligada por padrão). No modelo real: 590 parágrafos com 10 pt antes/depois, 190
  títulos com entrelinha 1,5. Pendente confirmar ao vivo que o CK5 do órgão mantém `margin-top`,
  `margin-bottom` e `line-height` inline (o `margin-top` já aparece no próprio tipo de documento).
- Histórico, versão e README geral ficam para o release.

## Restrições

- Bundles em `dist/js` gerados pelo esbuild em ASCII; não editar à mão.
- Montagem de DOM sem `innerHTML` na UI (`sei-comum/ui/dom`); a limpeza trabalha num documento isolado
  (`DOMParser`) e só devolve string.
- Commits por caminho explícito, nunca `git add -A`.
