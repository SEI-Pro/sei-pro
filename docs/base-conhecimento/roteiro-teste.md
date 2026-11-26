# Roteiro de teste ao vivo — Base de Conhecimento em pastas

Ambiente de referência: SEI 5.0.4 (INMETRO), unidade de teste. Use **somente leitura** nos itens nativos do SEI; as únicas escritas permitidas são nas pastas da árvore e no Texto Padrão `[_SEIPRO_BC_UNIDADE]` da unidade.

## Preparação

1. `cd base-conhecimento && npm install && npm run build` (gera `dist/js/init_base_conhecimento.js`).
2. Chrome → `chrome://extensions` → modo desenvolvedor → **Carregar sem compactação** → pasta `dist/`.
3. Abrir o SEI → menu **Base de Conhecimento** e depois a **lista da unidade**
   (`controlador.php?acao=base_conhecimento_listar`).
4. Conferir no console que não há erro do módulo e que `<html>` tem
   `data-seipro-base-conhecimento`.

## Cenários

- [X] **Painel e coluna**: o painel "Pastas" aparece à esquerda; a tabela ganha a coluna "Pasta"; o botão "Pastas" está na barra de comandos.
- [X] **Estado inicial**: sem pastas, tudo aparece em "Sem pasta"; com pastas, **nenhuma fica selecionada** ao abrir e a tabela mostra todos os itens; o caption mostra o total de registros.
- [X] **Chevrons e recolhidas**: as pastas existentes aparecem **recolhidas** (`▸`); clicar na seta expande (`▾`) e mostra subpastas e documentos; clicar de novo recolhe. A seta não troca a seleção.
- [X] **Nova pasta filha**: selecionar "Fiscalização" (fundo azul) e clicar em **+ Nova pasta**; a nova pasta nasce **dentro** de "Fiscalização", o pai aparece expandido e a nova fica selecionada.
- [X] **Subpasta**: pelo menu **⋯ → Nova subpasta**, criar dentro da pasta; o recuo e a contagem aparecem.
- [X] **Documentos na árvore**: expandir uma pasta com documentos; clicar no nome do documento abre o item no SEI em nova aba.
- [X] **Diálogos no padrão SEI**: criar/renomear pasta e escolher destino usam diálogo do SEI (sem caixa crua do navegador); Escape e o X cancelam sem gravar.
- [X] **Aviso no padrão SEI**: criar uma pasta mostra a barra azul no topo ("Pasta criada."), que fecha sozinha; os avisos com ação (Desfazer / Entendi e organizar) ficam na tela até você agir ou fechar.
- [X] **Arrastar documento**: arrastar um documento de "Sem pasta" para uma pasta; aparece a confirmação e, ao aceitar, o documento passa para a pasta.
- [X] **Arrastar pasta**: arrastar uma pasta para outra; a confirmação diz explicitamente que a **pasta** (com subpastas e itens) será movida; ao aceitar, a pasta muda de lugar. Soltar uma pasta dentro dela mesma/descendente é recusado com aviso.
- [X] **Mover item**: mover um item para "Fiscalização › Notas Técnicas" pelo "Mover para…"; a coluna "Pasta" mostra o caminho e a linha passa a pertencer à pasta.
- [X] **Filtro**: clicar na pasta; só as linhas dela ficam visíveis; o caption mostra a contagem da pasta; clicar em "Sem pasta" mostra as demais.
- [X] **Busca**: no campo **Buscar…** do painel Pastas, digitar um trecho de um nome de pasta **ou de um título de documento**: a árvore mostra só as pastas que casam (inclusive as que contêm um documento que casa) e a tabela filtra pelo título. A busca nativa do SEI (topo) filtra só a tabela.
- [X] **Ordenar**: clicar no cabeçalho "Descrição" (tablesorter); o filtro continua aplicado depois da ordenação e **nenhuma pasta fica selecionada** só por ordenar.
- [X] **Renomear**: renomear a pasta; o caminho na coluna "Pasta" acompanha.
- [X] **Excluir pasta**: excluir "Notas Técnicas"; a pasta **e as subpastas** somem, e os itens de todas elas voltam para "Sem pasta" (continuam no SEI — o módulo nunca exclui itens). A confirmação já diz que as subpastas vão junto e que os itens continuam no SEI. Pastas irmãs e seus itens ficam intactos.
- [X] **Órfão**: (em ambiente de teste) excluir um item da Base de Conhecimento; o vínculo aparece riscado em "Sem pasta" com a ação "esquecer".
 > A confirmação de exclusão do item é do **SEI nativo** (alerta do navegador): o módulo não intercepta nem substitui diálogos das telas nativas; ele só percebe o item sumido e marca o vínculo como órfão.
- [X] **Modo lista**: clicar em "Pastas"; o painel recolhe e a tabela mostra tudo; clicar de novo volta à visão em pastas.
- [X] **Liga/desliga**: na página de opções da extensão, procurar "Base de Conhecimento em pastas"; desligar devolve a tela nativa; religar e recarregar. (Se a opção não aparecer, recarregar a extensão: `dist/html/options.js` precisa ser o build atual.)
- [X] **Outro computador**: abrir o mesmo SEI em outro perfil/navegador com o SEI Pro; aceitar o "Entendi"; a árvore chega pelo Texto Padrão.
- [X] **Duas pessoas**: com dois perfis, criar pastas diferentes ao mesmo tempo; as duas aparecem após a sincronia (mais recente vence por pasta).
- [NAO TESTADO] **Sem permissão de alterar**: usar um perfil que só lê Textos Padrão; a árvore fica em leitura ("Indisponível nesta unidade").
> Só conseguirei testar futuramente.
## Criar em contexto e numeração (25/11/2026)

- [X] **Criar dentro da pasta**: selecionar "Fiscalização" → clicar **Nova** → a tela de cadastro mostra a faixa “Será organizado em: …” com o caminho (com números **só** se a numeração estiver ligada; desligada por padrão) → salvar → ao voltar, o item aparece na pasta e o aviso “Documento criado em …” oferece **Desfazer**.
- [X] **Desfazer**: no aviso, clicar **Desfazer**; o item volta a "Sem pasta" e a pasta deixa de mostrá-lo. (O aviso com ação fica na tela até você agir ou fechar.)
- [X] **Não organizar**: repetir com uma pasta selecionada e, na tela de cadastro, clicar **Não organizar**; salvar; o item fica em "Sem pasta" e nenhum vínculo novo aparece.
- [X] **Voltar sem criar**: clicar **Nova** e cancelar/voltar sem salvar; ao voltar para a lista a intenção foi limpa (nada é organizado depois).
- [X] **Sem o "Entendi"**: com o consentimento limpo (outro navegador/perfil — ou, no mesmo perfil, depois de limpar o consentimento nas opções), criar com pasta selecionada; o item fica em "Sem pasta" e o aviso oferece **Entendi e organizar**; aceitar o "Entendi" organiza o item.
- [NAO TESTADO] **Colega organizou antes**: com dois perfis, um organiza o item recém-criado antes de o outro voltar; o segundo **não** sobrescreve a pasta do colega.
- [X] **Pasta removida**: selecionar uma pasta, clicar **Nova** e, em outra aba, excluir a pasta antes de salvar; ao voltar, o aviso diz que a pasta não existe mais e o item fica em "Sem pasta". (A intenção é da aba: excluir em outra aba não a apaga.)
- [x] **Numeração ligada**: no painel **Pastas**, marcar **Numerar pastas** (o mesmo interruptor está na aba **Conhecimento** do painel lateral). A árvore, a coluna "Pasta" e o diálogo "Mover para…" passam a mostrar "1. …", "1.1 …", "1.1.1 …". Desmarcado por padrão; a contagem à direita do nome aparece entre parênteses — ex. "Fiscalização (3)" — e **não** é numeração.
- [X] **Renumeração**: com a numeração ligada, mover uma pasta (ou criar uma pasta no topo); os números dos irmãos mudam na hora. Conferir no Texto Padrão `[_SEIPRO_BC_UNIDADE]` que **não** há números gravados.
- [X] **Escopo da numeração**: recarregar o navegador; a preferência continua. Abrir outro navegador/perfil; a numeração começa **desligada** (é por navegador). Mudar o interruptor no painel atualiza a árvore na hora.
- [NAO TESTADO] **Aba condicional**: num pacote sem `js/init_base_conhecimento.js` no manifest, a aba "Conhecimento" não aparece no painel lateral.

## Correções desta rodada (26/11/2026)

- **Intenção de "Nova" por aba** (sessionStorage): abrir a lista em outra aba não apaga nem consome mais a intenção da aba que está criando. Isso corrige os avisos que "não apareciam" em Desfazer, Entendi e pasta removida.
- **Aviso de sucesso ao criar pasta** ("Pasta criada.") e avisos com ação passam a ficar na tela até agir/fechar.
- **Sem seleção automática**: ao abrir a lista (ou ordenar), nenhuma pasta fica selecionada e a tabela mostra todos os itens.
- **Excluir pasta exclui a subárvore**: as subpastas somem e os itens de todas elas voltam para "Sem pasta" (continuam no SEI); a confirmação informa.
- **Busca da árvore** considera também títulos de documentos dentro das pastas.
- **Contagem entre parênteses** ("Fiscalização (3)") para não confundir com numeração.
- **Numerar pastas no próprio painel** (além da aba "Conhecimento" do painel lateral).
- **Opções**: `dist/html/options.js` regerado — a chave "Base de Conhecimento em pastas" volta a aparecer.

## Conferência de segurança (obrigatória)

- [X] Nenhum item da Base de Conhecimento foi **criado, alterado, liberado ou excluído** pelo módulo.
- [X] A única alteração no SEI é o Texto Padrão `[_SEIPRO_BC_UNIDADE]` (menu → Textos Padrão).
- [X] O conteúdo dos itens e eventuais anexos continuam intactos.

## Portões de empacotamento (máquina do autor)

- [ ] `node tools/check-dom-injection.mjs` (se existir) sem apontamentos.
- [ ] `node tools/patch-manifests.mjs --check` (se existir) sem diferenças.
- [ ] `node tools/gerar-pacote-firefox.mjs <versao>` copia o bloco `js/init_base_conhecimento.js` (o bloco tem `exclude_matches`).
