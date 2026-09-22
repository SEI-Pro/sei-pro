# sei-nucleo

Biblioteca do SEI para o SEI Pro, em TypeScript, **sem UI, sem jQuery e sem agente**.
Lê e escreve no SEI pela sessão já aberta do usuário, com `fetch` e `DOMParser`,
e roda igual no mundo isolado de um content script, no mundo da página ou em
teste (linkedom).

Hoje ela alimenta o Agente de IA (`../agente-ia`). Foi desenhada para que o
código legado do SEI Pro (`dist/js/*.js`) a adote função por função — ver
[MIGRACAO.md](MIGRACAO.md).

## Camadas

```
src/
  sessao/       http.ts        único ponto que fala com o servidor; erros tipados
                codificacao.ts ISO-8859-1 / windows-1252, sem %uXXXX e sem mojibake
                literais.ts    leitor de chamadas JS geradas pelo SEI (Nos[], NosAcoes[])
                entidades.ts   entidades HTML sem DOM
                erros.ts       ErroSei { codigo, mensagem, detalhe }
  formulario/   formulario.ts  motor único: abrir → definir/escolher/definirLupa → enviar(prova)
  links/        links.ts       links assinados (infra_hash): colher, nunca montar
  dominio/      arvore, processo, documento, editor, historico, caixa,
                acoesProcesso (anotação, andamento, atribuição, acompanhamento,
                marcador), opcoes, escrita (convenção prévia/aplicar)
  privacidade/  anonimizar.ts  pseudônimos reversíveis sobre os detectores do Tarjar
  sei.ts        fachada por aba: contexto, linkMenu, localizar, arvore (cache), ajax
  index.ts      API pública (o bundle IIFE expõe window.SeiNucleo)
```

## Regras que o código garante

1. **Link se colhe, não se monta.** Link sem `infra_hash`, com hash de outro link
   ou com parâmetro alterado desloga o usuário (`InfraSessao::validarLink`).
   `linkDaAcao` casa a ação exata e devolve um link só.
2. **Toda resposta passa por `verificarPagina`**: `login.php` → `SEI_SESSAO_EXPIRADA`;
   `#divInfraExcecao` → `SEI_EXCECAO`; `#txaInfraValidacao` → `SEI_VALIDACAO` com
   a mensagem do SEI.
3. **Escrita só com prova** (`enviar({ sucesso })`): URL de destino, releitura ou
   `OK <versão>` do editor. Sem prova, `SEI_RESPOSTA_INESPERADA`.
4. **Prévia e gravação são a mesma função** (`{ aplicar: false | true }`): o que o
   usuário aprova é exatamente o que será enviado.
5. **Sigiloso nunca**: processo ou documento sigiloso lança `SEI_SIGILOSO` antes
   de qualquer byte de conteúdo.
6. **Lupas**: o motor de formulário refaz a serialização `id±texto¥` que o
   `infraLupaSelect` faria, lendo os pares `select → hdn` do próprio script da
   tela. Sem isso, alterar um processo apagaria assuntos e interessados.

## Uso

```ts
import { Sei, consultarProcesso, definirMarcador, lerConteudo, localizarDocumento } from "sei-nucleo";

const sei = new Sei(location.href, () => ({ url: location.href, status: 200, html: document.documentElement.outerHTML, doc: document }));
const p = await consultarProcesso(sei, "50300.018905/2018-67");
const previa = await definirMarcador(sei, p.protocolo, { marcador: "Prazo", texto: "Até 30/09/2026" }, { aplicar: false });
const feito = await definirMarcador(sei, p.protocolo, { marcador: "Prazo", texto: "Até 30/09/2026" }, { aplicar: true });
const doc = await lerConteudo(sei, await localizarDocumento(sei, "0103947"));
```

## Versões do SEI

| Tela | 4.1.5 (validado ao vivo) | 5.0.x |
|---|---|---|
| Árvore (`infraArvoreNo`, `NosAcoes`, `abrir_pastas=1`) | sim | mesmo gerador (`ProtocoloINT.php`), `UNIDADE_GERADORA` a mais |
| Pesquisa rápida (protocolo ou nº SEI → processo) | sim | sim |
| Escolher tipo de documento (POST `hdnIdSerie`) | sim | sim |
| Editor | CK4: `#frmEditor` + `editor_processar.php` | CK5: `INFRA_EDITOR_CONFIG` + `controlador_rest.php` (lido das fontes; falta validar ao vivo) |
| Marcadores (vários por processo, `andamento_marcador_*`) | sim | sim |

SEI 3.x: leitura deve funcionar (mesma árvore); marcador usa outra tela e
responde `SEI_VERSAO_NAO_SUPORTADA`.

## Testes

```
npm install
npm run verificar     # tsx tests/verificar.ts — 76 verificações
npm run tipos         # tsc --noEmit
```

As fixtures (`tests/fixtures/sei41/`) são telas reais do SEI SP Treinamento
(4.1.5), com hashes de sessão já expirados. Para capturar novas telas, veja o
roteiro em `docs/superpowers/plans/2026-09-22-agente-ia-sei.md` (Task 0).

## Build para o legado

`node build.mjs` gera `dist/js/sei-nucleo.js` (IIFE, `window.SeiNucleo`). Não é
carregado por nenhum manifest ainda: é o ponto de partida da migração.
