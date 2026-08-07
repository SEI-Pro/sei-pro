# ADR-0003 — Isolar o SEI atrás de um Anti-Corruption Layer em `src/sei/`

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0002, ADR-0008

## Contexto

O SEI é um sistema externo que não controlamos, evolui sem nos consultar, roda em versões
diferentes em órgãos diferentes (4.x e 5.x simultaneamente), e cuja interface pública para
nós é a mais frágil possível: HTML gerado por servidor, ids `infra*`, `controlador.php?acao=…`
e iframes nomeados. Toda quebra da extensão em produção vem daqui.

Já existe o embrião correto do isolamento. `src/sei/adapter.js` mapeia 16 seletores com
ramificação por versão — por exemplo `divComandos` alternando entre
`#divBotoesControleProcessos` e `#divComandos` conforme a versão é ≥ 4.1.0. Esse arquivo é
o padrão certo.

O problema é a proporção. Medido em 2026-08-07:

| Métrica | Valor |
|---|---|
| Tamanho total de `src/sei/` | **261 linhas** (4 arquivos) |
| Arquivos fora de `src/sei/` com seletores `infra*`/`divArvore`/`txtSenha` | **36** |
| Arquivos fora de `src/sei/` que conhecem `controlador.php` | **37** |
| Arquivos fora de `src/sei/` que conhecem `acao=` | **59** |
| Ramificações `isNewSEI` / `isSEI_5` espalhadas | **228** em 42 arquivos |
| Usos de `$(` em `src/` | **3611** em 91 arquivos |

Isto é o inverso de um ACL: o conhecimento sobre o sistema externo está difundido por todo
o código, e a camada que deveria concentrá-lo tem 261 linhas. As consequências práticas são
mensuráveis e conhecidas:

- Uma atualização de versão do SEI exige varredura em 42 arquivos para achar as
  ramificações, sem garantia de completude.
- Não é possível testar o parsing contra HTML real, porque o parsing está entrelaçado com
  view e jQuery nos mesmos arquivos.
- A ramificação `isNewSEI ? a : b` repetida 228 vezes é o mesmo condicional duplicado —
  cada cópia é uma chance de esquecer uma quando a versão 6 sair.

Este é o acoplamento de maior custo do projeto, e o que mais ameaça a meta de "consertar,
modificar e expandir facilmente".

## Decisão

`src/sei/` é o **Anti-Corruption Layer** e a única fronteira do projeto autorizada a
conhecer o SEI. Regra operacional, em uma frase: **nenhum seletor do SEI, nenhuma URL do
SEI e nenhuma ramificação por versão do SEI fora de `src/sei/`.**

Estrutura-alvo:

```
src/sei/
├── version.js          # detecção 4.x / 5.x (existe)
├── selectors.js        # TODO seletor do SEI, nomeado por intenção, resolvido por versão
├── urls.js             # construção e parsing de controlador.php?acao=… (existe, expandir)
├── pages.js            # identificação de contexto/página a partir da URL
├── parse/              # HTML do SEI → objetos de domínio (árvore, lista, processo, doc)
├── dom.js              # leitura/escrita pontual em regiões do SEI (barra de comandos, árvore)
└── fixtures/           # HTML real capturado do SEI 4.x e 5.x, por página
```

Consequências operacionais:

- O resto do código **nunca** escreve `'#divComandos'`. Pede `sei.selectors.divComandos`,
  cujo nome descreve a intenção, não o id.
- O resto do código **nunca** escreve `if (isNewSEI)`. A diferença de versão é resolvida
  dentro do ACL. Quando a diferença for comportamental e não apenas de seletor, o ACL
  expõe uma capability (`sei.supports.abaAssinatura`), não a versão.
- Parsing de página do SEI devolve **dados**, nunca elemento DOM nem objeto jQuery —
  o que torna `src/sei/parse/` testável em Node puro contra as fixtures.
- Fixtures de HTML real são o mecanismo de regressão: cada parser tem teste contra
  4.x e 5.x.

Migração incremental: o ACL cresce por contexto conforme cada feature é migrada
(ADR-0004), com ratchet decrescente (ADR-0008). Não há big bang.

## Consequências

**Ganhamos:** uma quebra do SEI passa a ser uma correção localizada em uma pasta, com
teste que reproduz a quebra a partir de HTML real; suporte a uma versão nova do SEI vira
trabalho enumerável em vez de caçada; o parsing fica testável sem navegador; a saída do
jQuery (91 arquivos) fica viável, porque o que amarra o jQuery é justamente a manipulação
espalhada de DOM do SEI.

**Pagamos:** indireção — ler `sei.selectors.divComandos` exige um salto a mais que ler o
id literal. É o custo do padrão e é o que compra a localidade da mudança. Também pagamos
a curadoria das fixtures: HTML capturado do SEI precisa ser anonimizado antes de entrar no
repositório, e envelhece se ninguém recapturar.

**Fica proibido:** seletor literal do SEI fora de `src/sei/`; `isNewSEI`/`isSEI_5` fora de
`src/sei/`; parser do SEI devolvendo DOM ou jQuery; fixture com dado real de processo,
pessoa ou credencial.

## Verificação

- `tests/structure/sei-acl.test.js` — nenhum arquivo fora de `src/sei/` contém padrão de
  seletor do SEI (`#infra…`, `#div…`, `.infraBarra…`, `txtSenha`, `ifrArvore…`),
  `controlador.php`, nem `isNewSEI`/`isSEI_5`. Lista de exceções explícita e decrescente
  por ratchet (ADR-0008), baselines: seletores 36, `controlador.php` 37, `acao=` 59,
  ramificação de versão 42 arquivos.
- `tests/sei/parse/*.test.js` — cada parser roda contra fixture 4.x e 5.x.
- `tests/structure/purity.test.js` — nenhum arquivo em `src/sei/parse/` importa jQuery,
  `domq` ou toca `document` global (recebe `Document` parseado como argumento).

## Alternativas consideradas

**Manter `adapter.js` fino e aceitar seletores espalhados** — é o estado atual. Falha
porque desloca o custo para todo evento de atualização do SEI, que é frequente e fora do
nosso controle.

**Testes end-to-end contra uma instância real do SEI** — não substitui o ACL, e é
inviável como portão: exige autenticação, dados reais e ambiente que a equipe não
controla. Fixtures capturadas dão a maior parte do valor de regressão a custo baixo. O
smoke manual em `SMOKE_TEST.md` continua sendo o portão de ambiente.

**Gerar os seletores a partir de introspecção do SEI em runtime** — heurística frágil
que troca uma quebra determinística e diagnosticável por uma quebra silenciosa.
