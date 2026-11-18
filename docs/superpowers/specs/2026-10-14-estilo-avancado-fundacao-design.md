# Estilo Avançado 2: fundação do tema (sub-projeto 1 de 4)

Data: 2026-10-14 · Escopo: pacote novo `estilo-avancado/`, módulo `sei-comum/src/tema/`, seção "Aparência" em `dist/html/options.*`, entradas no `dist/manifest.json` (Lab MV3 apenas)

## Objetivo

Substituir, aos poucos, o Estilo Avançado artesanal (`dist/css/sei-slim.css`, 190 KB, 423 regras `dark-mode` escritas à mão, CSS injetado em strings dentro de `sei-functions-pro.js`) por um sistema em TypeScript baseado em tokens `--spro-*`, o mesmo das telas novas (controle, Favoritos, Demandas, Projetos, Histórico, Opções). Quem usar o novo vê o SEI inteiro coerente com essas telas, escolhe a cor da barra superior e tem um modo escuro feito do jeito correto, inclusive no corpo dos documentos.

Este spec cobre só a **fundação**. O trabalho todo se divide em quatro sub-projetos, cada um com spec, plano e entrega próprios:

| # | Sub-projeto | Entrega |
|---|---|---|
| 1 | **Fundação do tema** (este spec) | Modelo de configuração, paleta, tokens, aplicação em todos os frames, remapeamento de cores, tela de configuração, folha base mínima (barra, fundo, texto, links, tabelas, campos, botões) |
| 2 | Casca do SEI | Barra superior completa, menu, árvore, barra de ações |
| 3 | Telas nativas | Controle de processos, formulários, tabelas, diálogos jQuery UI/Bootstrap |
| 4 | Editor e documentos | CK4/CK5, visualizador e "Ver original" refinado |

O sub-projeto 1 já entrega algo visível e testável: a cor da barra escolhida pelo usuário, o claro/escuro/automático e o corpo dos documentos legível no escuro.

## Decisões do usuário (14/10/2026)

1. **Convivência:** o antigo continua intacto; o novo é opção separada ("Estilo Avançado 2"), primeiro só no Lab MV3 (como Favoritos e Projetos). O antigo some só quando o novo cobrir tudo.
2. **Cor da barra:** paletas prontas mais seletor de cor livre; o sistema deriva texto legível, hover e destaque.
3. **Modo escuro:** claro, escuro e automático (segue o sistema). O escuro vale **inclusive para o conteúdo dos documentos e o editor**.
4. **Técnica do escuro:** tokens para a interface e remapeamento adaptativo de luminosidade (preserva matiz) para cores inline de documentos, com "Ver original" para conferir antes de assinar. Descartados: filtro de inversão (distorce cores) e dois temas escritos à mão (repete o modelo atual).

## Não negociável

- **Nada de recurso externo**: sem Google Fonts nem CDN. Fontes do sistema (`--spro-fonte`). Aba Network sem host de terceiros (política de privacidade e auditoria da 2.2.2).
- **DOM seguro (Firefox)**: nada de `innerHTML` com dados. A folha entra como `textContent` de um `<style>` criado por DOM API; atributos por `setAttribute`.
- **JS sob `dist/` só com ASCII** (acentos como `\uXXXX`); o `build.mjs` confere byte a byte, como o do Favoritos.
- **Sem flash branco**: o tema é aplicado em `document_start`.
- **Compatibilidade**: SEI 4.1.5 e SEI 5.0.4; páginas principais, árvore, visualização e diálogos (iframes). O documento assinado/gravado **nunca** é alterado: o remapeamento é só de exibição.
- **Não mexer no legado**: `sei-slim.css`, `seiSlim`, `darkModePro` e o popup "Cor Principal do Layout" seguem como estão.

## 1. Modelo de configuração

Chave `spro_tema` em `chrome.storage.sync` (poucos bytes; a cota do `storage.sync` foi medida em `reference_cota_storage_sync`):

```ts
interface ConfigTema {
  versao: 1;
  ativo: boolean;              // "Estilo Avançado 2" ligado; padrão false
  modo: "claro" | "escuro" | "auto";   // padrão "auto"
  paleta: string;              // id de paleta pronta, ou "livre"
  corBarra: string;            // #RRGGBB (resolvida da paleta ou escolhida)
  escurecerDocumentos: boolean; // padrão true (decisão 3)
}
```

- Normalização defensiva (`normalizarConfig`): valor ausente, tipo errado, hex inválido ou versão desconhecida caem no padrão. Nunca lança.
- Fica fora do `dataValues` (que tem limite de 8 KB e perfis) para não competir com as opções antigas.
- O leitor faz `chrome.storage.sync.get("spro_tema")` e assina `storage.onChanged` (com `areaChrome`, para o mapeamento `newValue`→`novo` já corrigido).
- Não há migração automática do `seiSlim`/`colorSlimPro`: o novo é opt-in. A tela de configuração oferece "Usar a cor atual do Estilo Avançado" quando existir `colorSlimPro`.

## 2. Paleta (`sei-comum/src/tema/paleta.ts`)

Funções puras, sem DOM, testáveis em `sei-comum/tests`.

- Conversão sRGB ⇄ OKLCH (`paraOklch`, `deOklch`) e contraste WCAG (`contraste(a, b)`).
- `derivarBarra(corBase, esquema)` devolve `{ barra, texto, hover, borda, destaque }`:
  - `texto`: branco ou quase-preto (`#14181d`), o que atingir **contraste ≥ 4,5:1** sobre `barra`; se nenhum atingir, ajusta a luminosidade da barra (matiz e croma preservados) até atingir.
  - `hover`: barra com L ± 0,05 (clareia no escuro, escurece no claro).
  - `borda`: barra com L − 0,08.
  - `destaque`: cor de ação do conteúdo (botão primário, link, seleção), derivada do matiz da barra com L/C ajustados para ≥ 4,5:1 contra `--spro-fundo` do esquema. Cinza e cor sem croma caem no azul padrão do SEI Pro (`#1f5fbf`/`#79acff`).
  - No esquema escuro, a barra tem L reduzido (teto 0,42) e croma reduzido a 85%, para não ofuscar; o matiz é mantido.
- Paletas prontas (`PALETAS`, 10): SEI Pro (azul `#1f5fbf`), Oceano `#0b6e99`, Floresta `#1f7a4d`, Esmeralda `#0e7c66`, Grafite `#3a4350`, Vinho `#8a2a43`, Roxo `#5b43b8`, Âmbar `#a85d00`, Ardósia `#475c7a`, Preto `#14181d`. Cada uma tem `id`, `nome` e `cor`.
- `corLivre`: qualquer `#RRGGBB`; cores com contraste impossível (amarelo `#ffff00`) são ajustadas pela regra de `texto`, e a tela de configuração mostra "Ajustamos o tom para manter o texto legível".

## 3. Tokens e aplicação

### 3.1 Tokens (`sei-comum/src/tema/tokens.ts`)

`gerarFolha(cfg, esquema): string` produz o texto CSS. Reaproveita os nomes de `sei-comum/src/ui/base.css` (`--spro-fundo`, `--spro-fundo-2`, `--spro-fundo-3`, `--spro-pagina`, `--spro-texto`, `--spro-suave`, `--spro-borda`, `--spro-destaque`, `--spro-raio*`, `--spro-sombra-*`, `--spro-anel`) para que componentes novos funcionem sem mudança, e acrescenta:

`--spro-barra`, `--spro-barra-texto`, `--spro-barra-hover`, `--spro-barra-borda`.

O escuro redefine as superfícies em camadas (`pagina` < `fundo` < `fundo-2` < `fundo-3`), não inverte. Os valores escuros são os de `base.css` (`#141619`, `#1a1d21`, `#22262b`, `#2b3036`), para o SEI e as telas novas terem o mesmo escuro.

### 3.2 Aplicação (`estilo-avancado/src/pagina/aplicar.ts`)

- Injeta **um** `<style data-spro-tema>` no `<head>` (ou em `documentElement` se o `<head>` ainda não existir em `document_start`), com `textContent` = tokens + folha base (§6).
- Marca o `<html>` com `data-spro-tema="claro|escuro"` (esquema resolvido) e `style.colorScheme`, para controles nativos e barras de rolagem acompanharem.
- `modo: "auto"`: `matchMedia("(prefers-color-scheme: dark)")` com listener; o esquema muda em tempo real.
- `ativo: false`: remove o `<style>`, o atributo e o remapeamento; zero rastro.
- **Supressão do legado:** com `ativo`, o content script define `data-spro-tema-ativo` no `<html>`; a folha base prefixa `:root[data-spro-tema-ativo]` e usa especificidade suficiente para vencer `.seiSlim` sem `!important` espalhado. O `loadStyleDesign` do legado continua a funcionar se o usuário tiver os dois ligados; a tela de configuração avisa e o novo prevalece. (A remoção do legado quando o novo está ativo é decidida no sub-projeto 2, quando a casca estiver coberta.)

### 3.3 Frames

O content script `js/init_estilo.js` roda em **todos os frames** (`all_frames: true`, `document_start`), nos mesmos `matches` de `init_favoritos.js`. Cada frame lê a configuração e aplica sozinho; mudanças chegam por `storage.onChanged`. Iframes criados depois recebem o tema ao carregar. Sem `postMessage` entre frames.

## 4. Remapeamento de cores de documentos (`sei-comum/src/tema/adaptar.ts` + `estilo-avancado/src/pagina/documentos.ts`)

Objetivo: no esquema escuro, o corpo de documentos e o editor ficam legíveis **sem mudar o significado das cores** (vermelho continua vermelho; realce continua realce).

- **Núcleo puro** (`adaptarCor(css, papel, esquema)`): converte a cor para OKLCH e devolve outra com o mesmo matiz e croma (limitado ao gamut) e luminosidade reposta:
  - `papel: "texto"`: L alvo = `1 − L` mapeado para [0,62; 0,95]; garante contraste ≥ 4,5:1 contra o fundo escuro do documento.
  - `papel: "fundo"`: L alvo = mapeado para [0,18; 0,34], preservando a ordem relativa (branco → mais escuro; cinza `#ccc` → camada visivelmente distinta; amarelo de realce → amarelo escuro e saturado, ainda reconhecível como realce).
  - Preto e branco puros: preto de texto → `#e7e9ec`; branco de fundo → `--spro-fundo`.
  - Transparente e `inherit` passam inalterados.
- **Aplicação** (módulo de página): percorre o conteúdo do documento (`#divInfraAreaTelaD`, corpo do `iframe` de visualização, `body` do editor CK4/CK5), lê `getComputedStyle` dos elementos que têm `style` inline, atributo `bgcolor`/`color` ou `<font>`, e grava a cor adaptada como **variável própria** (`--spro-orig-cor`, `--spro-orig-fundo` guardam a original) e atributo `data-spro-adaptado`. A cor original nunca é sobrescrita no DOM do documento; o "Ver original" (§4.1) só remove o atributo.
- **Exclusões:** `img`, `canvas`, `svg` de conteúdo, `iframe` de PDF e QR code ficam intactos.
- **Dinâmico:** `MutationObserver` em lote (`requestIdleCallback`, fallback `setTimeout`), com teto de 400 elementos por ciclo, para não travar documentos grandes.
- **Documento aberto para edição:** o conteúdo salvo pelo editor **não** carrega as cores adaptadas (variáveis e atributo ficam de fora do `getData`); testado explicitamente no CK4 (SP) e CK5 (MJ).

### 4.1 "Ver original"

Botão na barra do visualizador (e no editor) com ícone `sun`: alterna o documento para fundo branco e cores originais enquanto estiver ativo, por documento, sem persistir. Rótulo "Ver original (como será assinado)". Com `escurecerDocumentos: false`, o remapeamento não roda e o botão não aparece.

## 5. Tela de configuração

Seção "Aparência" na página de opções (schema declarativo da `opcoes-redesign`), só no build Lab (`options.*`), com:

- toggle "Estilo Avançado 2 (novo)" e aviso "Experimental: pode ser combinado com o Estilo Avançado antigo, mas o novo prevalece";
- segmentado Claro / Escuro / Automático;
- grade das 10 paletas (botões de cor com `aria-pressed`, nome acessível) mais o seletor livre (`<input type="color">`), com a cor derivada de texto exibida na prévia;
- toggle "Escurecer também o conteúdo dos documentos";
- **prévia ao vivo** (miniatura de barra + cartão + tabela + botão) usando o mesmo `gerarFolha`, em Shadow DOM ou `data-` escopado;
- "Restaurar padrão" e "Usar a cor atual do Estilo Avançado" (quando houver `colorSlimPro`).

A página roda de três jeitos (aba própria, popup, iframe de 800 px no SEI): layout responsivo, foco visível, operação por teclado, `prefers-reduced-motion`.

## 6. Folha base (escopo mínimo desta etapa)

Cobre o suficiente para a cor da barra e o escuro serem demonstráveis no SEI real sem quebrar telas; o refinamento é dos sub-projetos 2 a 4.

- **Barra superior** (`#divInfraBarraSistema*`, `.infraBarraSistema`, `.infraCorBarraSistema`, `#divInfraBarraSuperior`): fundo `--spro-barra`, texto/ícones `--spro-barra-texto`, hover `--spro-barra-hover`, borda inferior `--spro-barra-borda`.
- **Página:** fundo `--spro-pagina`, texto `--spro-texto`, `color-scheme`.
- **Links** (`a`, `.ancoraPadraoAzul`): `--spro-destaque`.
- **Tabelas** (`table.infraTable`, `.infraTrClara/Escura`, `th`): superfícies em camadas, borda `--spro-borda`.
- **Campos** (`input`, `select`, `textarea`, `.infraText`, `.infraSelect`, `.chosen-container`): fundo `--spro-fundo`, borda `--spro-borda-forte`, anel de foco `--spro-anel`.
- **Botões** (`.infraButton`, `button`): primário `--spro-destaque`/`--spro-destaque-texto`, raio `--spro-raio`.
- **Diálogos** (`.ui-dialog`, `.modal-content`): superfície `--spro-fundo`, sombra `--spro-sombra-3`.
- **Barras de rolagem**: `scrollbar-color` por `--spro-borda-forte`.

Seletores são levantados no SEI 4.1.5 e no 5.0.4 (fontes locais em `/Users/phs/Develop/Git/ANTAQ/SEI`, ler com `grep -a`). A folha vive em `estilo-avancado/estatico/base.css` e entra no bundle como texto (`loader: text`).

## 7. Estrutura de arquivos

| Caminho | Responsabilidade |
|---|---|
| `sei-comum/src/tema/paleta.ts` | OKLCH, contraste, `derivarBarra`, `PALETAS` |
| `sei-comum/src/tema/config.ts` | `ConfigTema`, `normalizarConfig`, padrões |
| `sei-comum/src/tema/tokens.ts` | `gerarFolha(cfg, esquema)` |
| `sei-comum/src/tema/adaptar.ts` | `adaptarCor` (puro) |
| `estilo-avancado/src/pagina/main.ts` | content script: lê config, aplica, assina mudanças |
| `estilo-avancado/src/pagina/aplicar.ts` | `<style>`, atributos, `matchMedia` |
| `estilo-avancado/src/pagina/documentos.ts` | remapeamento no DOM, observer, "Ver original" |
| `estilo-avancado/src/opcoes/main.ts` | seção "Aparência" |
| `estilo-avancado/estatico/base.css` | folha base |
| `estilo-avancado/build.mjs` | gera `dist/js/init_estilo.js`, `dist/js/estilo-avancado/opcoes.js`, confere ASCII |
| `dist/manifest.json` | content script (`all_frames`, `document_start`) e `web_accessible_resources`, **só no Lab** |

O pacote segue o padrão do Favoritos (`package.json`, `tsconfig.json` com alias `@comum/*`, `biome.json`, `tests/`).

**Fora do release oficial e do Firefox nesta etapa:** `manifest_seipro*.json`, `manifest_v2.json` e whitelabels ficam sem alteração. A opção só aparece no Lab MV3 (Chrome/Edge).

## 8. Verificação

1. **Unitários** (`npm run verificar` em `sei-comum` e `estilo-avancado`):
   - `paleta`: para 2.000 cores aleatórias mais as 10 prontas, em claro e escuro, `contraste(texto, barra) ≥ 4,5` e `contraste(destaque, fundo) ≥ 4,5`; round-trip OKLCH ≤ 1/255; cinza cai no azul padrão.
   - `config`: lixo, tipos errados e versão futura normalizam sem lançar.
   - `tokens`: a folha contém todos os tokens, nenhum `undefined`, sem URL externa (`url(http`, `@import`).
   - `adaptar`: tabela de cores reais de documentos do SEI (`#ccc`, vermelho `#ff0000`, azul `#0000ff`, amarelo de realce `#ffff00`, preto e branco): contraste ≥ 4,5 de texto sobre o fundo escuro, matiz preservado (± 6°), ordem relativa dos fundos preservada.
   - `aplicar` (linkedom): cria um único `<style>`, `ativo:false` não deixa rastro, `auto` reage ao `matchMedia`.
2. **Estático:** `tsc --noEmit`, `biome check`, byte não-ASCII nos bundles (falha o build), manifest válido (JSON e chaves).
3. **Harness no Chrome real** (extensão carregada em perfil limpo; `reference_mcp_chrome_extensao`):
   - **SEI SP de Treinamento (4.1.5, CK4)** e **SEI MJ de homologação (5.0.4, CK5)**; o usuário faz o login e a troca de unidade (`reference_sei_sp_treinamento`, `reference_sei_mj_homologacao`; **nunca** produção do MJ).
   - Roteiro: ligar o Estilo Avançado 2; trocar paleta e cor livre (barra muda, texto legível); alternar claro/escuro/auto (com emulação de `prefers-color-scheme`); conferir barra, tabela do controle, formulário, diálogo, árvore, visualização de documento com tabela de fundo cinza e texto colorido; "Ver original"; editar um documento no editor (CK4 e CK5), salvar e confirmar que o HTML gravado **não** contém as cores adaptadas; recarregar e conferir ausência de flash; desligar e confirmar zero rastro.
   - Prints e GIF de cada etapa; Network sem hosts de terceiros; console sem erros novos.
4. **Regressão:** com o Estilo Avançado 2 desligado, o SEI renderiza byte a byte igual ao de antes (mesma comparação de DOM e de estilos computados nas páginas do roteiro).

## 9. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Documento escuro induz a assinar sem ver direito | "Ver original" visível; remapeamento só de exibição; nada é gravado |
| Vazamento das cores adaptadas ao salvar no editor | Variáveis e atributo fora do `getData`; teste explícito CK4/CK5 |
| Cores inline do SEI que ninguém previu | Remapeamento por estilo computado (não por classe); tabela de cores reais nos testes |
| Disputa de especificidade com `.seiSlim` | Prefixo `:root[data-spro-tema-ativo]`; avisar quando os dois estão ligados |
| Desempenho em documentos grandes | Lote com teto, `requestIdleCallback`, observer só no contêiner do conteúdo |
| Flash branco | `document_start`, leitura síncrona do último valor em `localStorage` (espelho `spro_tema_cache`) para a primeira pintura, `storage.sync` confirma em seguida |
| Firefox/DOMPurify | Fora desta etapa; só DOM API desde já, para a portabilidade futura |

## 10. Fora de escopo

- Visual completo da casca, telas nativas e editor (sub-projetos 2 a 4).
- Remover ou migrar o `sei-slim.css` e o popup antigo.
- Release oficial, Firefox e whitelabels.
- Fontes personalizadas e ajuste de densidade.

## 11. Resultado da implementação (14/10/2026)

Implementado na branch `feat/estilo-avancado-2` e testado no Chrome real, com a extensão carregada, no **SEI MJ de homologação (5.0.4, CK5)** e no **SEI SP de Treinamento (4.1.5, CK4)**. Telas em `2026-10-14-estilo-avancado-telas/`.

**Mudanças em relação ao desenho acima**

- **Remapeamento só nas telas de leitura** (`documento_visualizar`, `documento_imprimir_web`). O editor fica de fora: o que ele grava não pode carregar cor adaptada. O escuro no editor é do sub-projeto 4. `limparParaGravar` existe e é testado, para esse dia.
- **Sem variáveis `--spro-orig-*`.** A cor original nunca é tocada, então não há o que guardar. O atributo `style` volta byte a byte ao original ao desligar.
- **`!important` permitido só nas classes de tema do SEI** (`.infraCor*`, `.sparkling-modal-title`, `div.pesquisaPaginaSelecionada`): o esquema de cores do SEI as define com `!important`, e é a única forma de uma regra de tema vencer outra. O teste da folha base confere.
- **Variáveis do SEI redefinidas** (`--infra-esquema-cor-*`) a partir dos tokens, além das classes.
- **Token novo `--spro-menu`** (a cor da barra bem mais escura) para o menu lateral não brigar com a barra.
- **O botão "Ver original" fica no canto inferior esquerdo** do documento: no superior direito ele ficava atrás da barra "Abrir documento em nova aba".
- **"Usar a cor atual do Estilo Avançado" não foi feito**: o `colorSlimPro` fica no `localStorage` da origem do SEI e a página de opções não o alcança.
- O aviso "Ajustamos o tom…" vale só para a cor escolhida (tema claro); no escuro a barra escurece por design.

**Verificado no navegador real**

- Barra, menu lateral, fundo, tabelas, campos, botões e diálogos no tema; cor escolhida aparece na barra (Floresta = `rgb(31,122,77)`).
- Claro, escuro e automático (o automático reage ao sistema ao vivo, sem recarregar).
- Documento real nos dois SEIs: cores adaptadas, "Ver original" liga e desliga.
- Desligar a opção ou "escurecer documentos" limpa tudo: zero rastro de atributo, variável, estilo e botão (10 frames).
- Sem flash: o tema é aplicado com o documento ainda em `loading`.
- Nenhuma URL externa nos bundles.

**Lacunas conhecidas (não verificadas ou fora desta etapa)**

- **Editor CK5 (SEI 5) não exercitado** no SEI real: o documento de teste do MJ não tem o ícone "Editar Conteúdo". O CSS do CK5 (variáveis `--ck-*`) não foi escrito às cegas e fica para o sub-projeto 4.
- Resíduos brancos de elementos do SEI Pro e do SEI (barra de ícones, seletor Tabela/Quadro, barra "Abrir documento em nova aba"): sub-projetos 2 e 3.
- Imagens (selo "assinatura eletrônica", código de barras) ficam intactas por decisão; num fundo escuro têm menos contraste.
- Firefox, release oficial e whitelabels: fora de escopo.

### 11.1 Segunda rodada: escuro de verdade (14/10/2026, a partir do feedback do usuário)

O primeiro escuro deixava áreas claras e texto ilegível. Em vez de caçar no olho, foi criada uma **auditoria no navegador real** (por frame: contraste de cada texto contra o fundo efetivo, mínimo 4,5:1, e fundos claros grandes) e o CSS foi corrigido até ela zerar nas telas testadas do SEI SP. Achados e correções:

- `#divInfraAreaTelaD` (cinza `#e0e0e0` ao redor do documento) e o fundo do painel de visualização do SEI 4.1;
- capa do processo: o SEI Pro injeta `div#capaProcessoPro .data a.newLink { color:#222 }` e `.label { color:#777 }`; sobrepostos com `#capaProcessoPro` na especificidade;
- caixas brancas da árvore (`span.noVisitado`) e o destaque `a.infraArvoreNo.highlight`;
- barra "Abrir documento em nova aba" (`a.openNewTab`, fundo inline), botão da unidade (`a.infraAcaoBarraConjugada`, `!important` do SEI), tooltips (`div.infraTooltip`), alerta `#checkNaoAssinados` (fundo inline), tabela de tipos e realce de busca (`span.spanRealce`);
- **editor CKEditor 4:** barra de ferramentas, grupos, combos, diálogos e rodapé com tokens; ícones escurecidos por `filter` só no escuro (são decoração, não conteúdo); as áreas editáveis são iframes `about:srcdoc`, então o content script ganhou `match_about_blank: true`; o `body.cke_editable` das seções somente leitura traz fundo cinza inline (`!important`).

Ficam de fora, por decisão: os cartões de anotação pastel do SEI Pro (fundo em gradiente próprio, texto escuro legível sobre ele) e as imagens.

**Verificado no editor CK4 (SP, Despacho Marcia Goncalves 0104775), só leitura:** as 4 áreas editáveis ficam em dark; o `getData()` das 4 instâncias tem os mesmos tamanhos com e sem o tema (12854, 62, 313, 10078) e nenhum traço de `data-spro-*`. Nada foi salvo.

A lista de `!important` permitidos na folha base (conferida por teste) agora é: `.infraCor*`, `.sparkling-modal-title`, `div.pesquisaPaginaSelecionada`, `a.infraAcaoBarraConjugada`, `body.cke_editable`, `a.openNewTab` e `#checkNaoAssinados`. Todos existem porque o SEI ou o SEI Pro grava a cor com `!important` ou inline.

### 11.3 Terceira rodada: os painéis refatorados (14/10/2026)

A grade do Controle de Processos, os Monitorados/Favoritos, os Projetos, as Demandas e o Histórico decidiam claro/escuro por `temaEscuroLegado` (o modo noturno antigo, `darkModePro`), então ficavam claros num SEI escuro. Agora seguem o Estilo Avançado 2.

- **Pergunta única:** `seiEscuro(doc, storage)` (em `sei-comum/src/pagina/tema.ts`): o esquema que o Estilo Avançado 2 gravou no `<html>` manda, inclusive para dizer "claro"; sem ele vale o modo noturno antigo. Todas as páginas e controladores passaram a usá-la.
- **Grade (dentro da página do SEI):** `aoMudarEsquemaSei` observa `data-spro-tema` e chama `app.definirTema(...)`: troca o modo ao vivo.
- **Painéis em iframe e lateral (páginas da extensão):** `acompanharTemaDoPainel` (`sei-comum/src/tema/painel.ts`) lê `spro_tema` do `chrome.storage`, aplica `data-tema` e o destaque derivado da cor da barra (`derivarBarra(...).destaque`, contraste garantido), e acompanha mudanças, inclusive o modo Automático.
- **Desligar com o painel aberto:** a página mantém o contexto da aba em dia (`manterTemaNoContexto`; o RPC `contexto` devolve esse objeto vivo) e o iframe o pede de novo (`aoDesligar`, após 300 ms), em vez de voltar ao valor que já vinha do estilo ligado. Sem isso o painel ficava escuro num SEI claro.
- **Botões injetados (Monitorados, PDF, Agente de IA, Fluxos):** o SEI Pro põe `infraCorBarraSistema` nas `<img>` deles, e o override da cor da barra os pintava de verde. A regra agora exclui `img` e zera o fundo desses ícones.
- **Selos de prazo e botões do SEI 5:** as variantes escuras dos selos de prazo são do modo antigo (`.seiSlim.dark-mode`); foram escritas versões com tokens. `.btn-light`, linhas atrasadas (`infraTrAtrasada`) e a caixa do menu do SEI 5 também entraram.

**Verificado no navegador real (SP 4.1.5 e MJ 5.0.4):** modo escuro, claro, escuro de novo, desligado e religado, com a grade e os três iframes seguindo cada passo (destaque `#5eb382` no escuro e `#1f7a4d` no claro; ao desligar, tudo volta ao claro e o destaque some). A auditoria de contraste fecha vazia no Controle e nas telas testadas dos dois SEIs, com a instalação limpa.

**Não coberto:** os balões (Shadow DOM) de Favoritos e Projetos criados depois de a página abrir pegam o esquema do momento da criação do contexto (`ctx` agora é mantido em dia, então novos balões saem certos); um balão já aberto durante a troca de modo só atualiza ao reabrir. O Histórico em modal não foi aberto neste teste.

### 11.4 Quarta rodada: rastreio de todo o menu lateral (14/10/2026)

A pedido do usuário (os Blocos de Assinatura tinham linhas vermelhas ilegíveis), um script abriu **todos os links do menu lateral** (só leitura: nenhum formulário foi enviado; ações com nome de efeito colateral foram filtradas), tirou o print de cada tela e rodou a auditoria de contraste (≥ 4,5:1) e de fundos claros em todos os frames.

- **SP (SEI 4.1.5): 178 telas.** Primeiro rastreio: dezenas de telas com problema. Depois das correções: **0 problemas**.
- **MJ (SEI 5.0.4): 122 ações únicas de leitura** (as telas "novo/reativar" repetem as do SP). De 19 telas com problema para **1 ocorrência**: o texto azul inline de uma notícia escrita pelo administrador, que é conteúdo do usuário.

Todas as correções vieram de regras fixas que o SEI ou o SEI Pro gravam, descobertas com `CSS.getMatchedStylesForNode`:

- **Listagens (51 telas):** `table.tablesorter` com `background-color:#ccc` inline, e a legenda `caption.infraCaption` sobre ele (contraste 1,4). `table.infraTable` passa a ter fundo do tema com `!important`.
- **Blocos de Assinatura:** `tr.trVermelha` (`#ffbfbf`) com texto claro. Vira vermelho do tema a 16% sobre o fundo.
- **Painel de Controle:** os rótulos dos cartões usam `color: var(--infra-esquema-cor-escura)` inline, e o tema tinha redefinido essa variável como o verde-escuro da borda da barra. **Erro meu:** no escuro a variável passa a ser o destaque.
- **Retorno Programado:** calendário (`#divCalendario td.diaUtil` `#ccc`, `td.diaFimDeSemana` branco).
- **Iniciar Processo:** `td.tdOpcaoSigiloso a { background: red }` e, no SEI 5, `table.tabelaOpcoes, table.tabelaOpcoes tr { background: white !important }`.
- **Configuração do Histórico:** `tr.infraTrMarcada` com `!important` ciano.
- **Telas de administração dos módulos (SEI 5, Bootstrap):** `.form-control`, `fieldset.infraFieldset`, `.input-group-text`, `.alert-*`, rótulos `.input-label-first/second` (`#666 !important`), linhas gravadas com `style="background-color:#d8f5b9"` e `bgcolor="#F4A460"`, `.cke_inner`.

A lista de `!important` permitidos na folha base, conferida por teste, agora também cobre `table.tablesorter`, `table.infraTable`, `infraTrMarcada`, `tabelaOpcoes`, `tdOpcaoSigiloso`, `input-label-*`, `#ed1c24` e `d8f5b9`. O teste também passou a ignorar valores de cor que aparecem dentro de seletores de atributo (texto a casar, não cor aplicada).

Os prints de todas as telas e um `INDICE.md` ficam em `capturas-estilo-avancado-2/` (fora do Git; 58 MB).

## 12. Sub-projeto 2: a casca do SEI (14/10/2026)

### 12.1 Primeira passada (acabamento) e por que foi insuficiente

A primeira versão só refinava o que já existia (cantos, hover, foco, seleção). O usuário a achou **tímida** perto do redesign do Estilo Avançado antigo, que refazia menus, botões e ícones. A segunda passada (abaixo) é um redesenho de verdade.

### 12.2 Redesenho (14/10/2026)

**Ícones.** Os ícones nativos do SEI (`<img src="menu/x.svg">` etc.) são trocados por **ícones de traço** do mesmo conjunto dos painéis, tematizáveis. Como o nome do arquivo identifica o ícone, a troca é CSS puro: `content: url(GIF transparente de 1 px)` na `<img>` (esconde o desenho original) e `background-color: currentColor` com `-webkit-mask` (o desenho novo, em SVG). Assim o ícone herda a cor do contexto e segue o tema, o modo escuro e a cor da barra.

- `sei-comum/src/ui/dom.ts` passou a exportar `ICONES` e `Forma`.
- `estilo-avancado/src/icones/extras.ts`: 30 ícones novos no mesmo traço (engrenagem gerada por geometria; livro, lista, pessoas, bandeira, avião de papel, selo, polegar, e-mail…).
- `estilo-avancado/src/icones/mapa.ts`: nome do arquivo nativo → ícone, por contexto (`menu` 24 px, `topo` 24 px, `barra` 40 px com respiro de 7 px) e tom opcional (`perigo` para excluir/cancelar).
- `estilo-avancado/src/icones/css.ts`: gera o CSS (uma regra base por contexto e uma de máscara por ícone). Teste: todo ícone do mapa existe, todo SVG é bem formado, o CSS é ASCII, sem recurso externo (só `data:`), e uma máscara por ícone.
- Três armadilhas resolvidas: a `<img>` perde o tamanho natural quando o `content` vira um GIF de 1 px (o topo não traz `width/height`, então se fixa 24 px); `div.barraBotoesSEI img { background-color: unset !important }` do SEI Pro exige `!important` na máscara da barra de ações; `div.infraSidebarMenu span { color:#fff !important }` do SEI exige `!important` no rótulo do menu.
- Ícones de documento da árvore (PDF, ZIP, imagem…) ficam como estão: a cor deles carrega significado.

**Casca.**
- *Barra superior:* brilho sutil sobre a cor escolhida e sombra; ícones em botões redondos de 40 px com hover e "press"; pesquisa em pílula translúcida que vira superfície ao focar, com a lupa num botão que fecha a pílula; unidade em pílula.
- *Menu lateral:* superfície neutra (clara ou escura conforme o tema) em vez da barra colorida; itens de 42 px com raio de 12 px, ícone de traço, hover, foco e item atual com faixa de destaque; seta de submenu em chevron que gira; submenus recuados com guia lateral; pesquisa em pílula.
- *Barra de ações:* cartão com borda e sombra; botões-ladrilho de 44 px que sobem 1 px no hover e ganham o destaque; tooltips escuros em "pílula".
- *Títulos:* 24 px, peso 750.
- *Árvore:* nó em hover e nó selecionado com o destaque e anel.

**Controles** (`controles.css`).
- Botões nativos de 36 px, raio de 10 px, peso 600, sobem no hover; o botão que envia o formulário é o primário, com gradiente, brilho interno e halo na cor de destaque.
- Grupo Baixar/Copiar/Pesquisar e botões dos diálogos no mesmo padrão.
- Campos de 36 px com raio de 10; rótulos em 13 px/600; quadros de formulário (`fieldset`) viram cartões com a legenda em pílula maiúscula; `accent-color` nas caixas de seleção.
- Diálogos jQuery UI com raio de 16 px, sombra e rodapé em superfície; overlay com desfoque; barras de rolagem finas e arredondadas; cor de seleção do texto.
- Tabelas no padrão de `.dem-tabela` (cabeçalho em maiúsculas esmaecidas, divisores suaves, hover no destaque, cantos arredondados pelas células das pontas).
- **O documento como papel** (`data-spro-papel` no `<html>` das telas de leitura): o corpo vira uma folha centralizada de até 940 px, com borda, raio e sombra, sobre a tela de fundo do tema.

**Verificado no SEI SP 4.1.5** (Controle, Marcadores, Novo Contato e processo com documento). Pendente: MJ (SEI 5.0.4), que depende de login.

### 12.3 Ajustes de 15/10/2026

- **Navbar:** o botão "Menu" virou pílula com respiro (era um link fixo de 40 px com texto de 50 px, que estourava e colava na pesquisa); os botões de ícone usam `padding: 8px` (o Bootstrap do SEI força `display:block`, então o centro vem do respiro, não do flex); a lupa tem a altura do campo; o bloco da logo perdeu a cor sólida própria e mostra o degradê da barra; o interruptor e a paleta do Estilo Avançado v1 (`div[data-ref="infraAcaoBarraSistema"]`, com `style` inline do SEI Pro) ficam no eixo dos ícones. Armadilha: tornar o `.infraAncoraSigla` um flex encolhia a trilha do interruptor para 3 px.
- **Painéis em iframe** (Favoritos, Projetos, Demandas): `html[data-modo="embutido"]` passa a ter fundo **transparente**, e a página do SEI aparece atrás; cartões e grades seguem iguais. O `embutido.ts` acompanha o `color-scheme` do iframe quando o tema muda (se divergir do documento de dentro, o Chrome pinta fundo opaco).
- **Tooltips próprios** (`src/pagina/dicas.ts`): o `title` dos botões da casca sai (era a caixa cinza do navegador sobreposta ao tooltip do SEI) e vira `data-spro-dica`; uma caixa única, no visual do tooltip do SEI no tema, mostra o texto. Quem já tem o tooltip do SEI (`infraTooltipMostrar`) só perde o `title`. Botão só com ícone ganha `aria-label`. Desligar o tema devolve cada `title`.
- **Histórico de Processos Visitados** na barra de ações, ao lado do Estúdio de Fluxo, no Controle (`sei-pro.js`) e dentro do processo (`sei-functions-pro.js` + `sei-pro-visualizacao.js`), com a opção `historicoproc` e a mesma ação do item do menu (`getHistoryProcessosPro()`). Ícone embutido (data URI) para valer em todas as versões sem mexer em manifest; a marca `<!--spro-historico-->` deixa o Estilo Avançado 2 trocá-lo por máscara.
