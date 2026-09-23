# Prompt para a sessão que vai implementar o Estúdio de Fluxo

Copie o bloco abaixo inteiro como primeira mensagem de uma sessão nova do Claude Code, aberta em
`/Users/phs/Documents/Git/Lab2Code/SEI Pro/sei-pro`.

---

Implemente a **fase 1 do Estúdio de Fluxo** do SEI Pro, conforme
`docs/superpowers/specs/2026-09-23-estudio-de-fluxo-design.md` — leia essa especificação inteira
antes de escrever qualquer código. Ela foi aprovada com o autor e as decisões dela não estão em
aberto; se algo nela parecer errado, diga antes de implementar em vez de mudar por conta.

## O que existe hoje

Monorepo com três partes que você vai tocar:

- `sei-nucleo/` — biblioteca do SEI em TypeScript (fetch + DOMParser, sem UI). Já tem árvore,
  histórico, documento, blocos. Provavelmente você **não precisa mexer aqui**.
- `agente-ia/` — motor do agente, painel lateral, ponte com a aba do SEI, skills, regras,
  memória, rotinas, desfazer, evals. É aqui que o Estúdio nasce.
- `dist/` — o que vai para o navegador. **É gerado**: nunca edite `dist/js/**` à mão; rode
  `cd agente-ia && node build.mjs`. Os arquivos estáticos (`dist/html/*.html`, `dist/css/*.css`,
  ícones) são copiados de `agente-ia/estatico/` pelo mesmo build — veja `build.mjs` antes.

Comandos:

```bash
cd agente-ia
npx tsc --noEmit          # tipos
npm run verificar         # 201 testes hoje, todos passando — não deixe cair
node build.mjs            # gera dist/
CHAVE_IA=... npm run evals   # avaliação com modelo real (custa dinheiro; ver abaixo)
```

## Regras da casa (não negociáveis)

1. **Português do Brasil** em tudo: nomes de função, variáveis, comentários, textos de tela,
   mensagens de commit. O código existente é o padrão — siga o tom dele.
2. **Comentário explica POR QUE, não o quê.** Onde houver uma armadilha do SEI ou uma decisão
   contraintuitiva, registre o motivo. Não comente o óbvio.
3. **Nada de `dist/js` editado à mão** e **nada de acento cru em `dist/js/*.js`** — o esbuild já
   emite ASCII; confira com `LC_ALL=C grep -c $'[\xc0-\xff]' dist/js/estudio/*.js` (tem que dar 0).
4. **Toda funcionalidade nova precisa de teste** em `agente-ia/tests/verificar-*.ts`, registrado
   em `tests/verificar.ts`. Teste o comportamento, não a implementação.
5. **Não invente link do SEI.** Link se colhe da página; montar um `infra_hash` à mão **derruba a
   sessão do usuário**. Use o que `sei-nucleo` já devolve.
6. **Sigiloso nunca.** Processo sigiloso não é lido, avaliado nem sugerido.
7. Commits em português, explicando a decisão e a armadilha; termine com
   `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
   **Não faça push nem crie release** sem o autor pedir.

## O que implementar (fase 1)

Siga a seção 9 da especificação. Em resumo:

1. `agente-ia/src/fluxos/modelo.ts` — tipos `Fluxo`/`Etapa` (a spec traz as interfaces prontas),
   leitura e gravação em `chrome.storage.local` (`agenteIA_fluxos`, `agenteIA_fluxosIgnorados`),
   validação (etapa sem documento, id duplicado, desvio apontando para etapa inexistente).
2. `agente-ia/src/fluxos/avaliar.ts` — **função pura**, sem rede: recebe o fluxo e a árvore já
   lida e devolve `{ aplica, cumpridas, etapaAtual, lacuna }`. É o coração; teste bem.
   A ordem da árvore é cronológica — "veio depois" é posição, não data.
3. `agente-ia/src/fluxos/inferir.ts` — monta o prompt com **metadados** dos processos modelo
   (título, ordem, unidade, assinado; e o histórico com datas) e faz o parse do JSON de volta,
   tolerando resposta suja (texto antes/depois, campo a mais, etapa sem nome).
4. `agente-ia/src/estudio/main.ts` + `agente-ia/estatico/fluxos.html` — a página em tela cheia:
   lista de fluxos, editor de etapas (adicionar, reordenar, remover), ativar/desativar, excluir,
   e "aprender de processo modelo". Reaproveite `painel/dom.ts` (`h`, `icone`) e o CSS de
   `estatico/agente.css` — não crie um segundo sistema de estilo.
5. Ponte: operação `fluxo.avaliar` no content script (`src/ponte/operacoes.ts`), que lê a árvore
   do processo aberto e devolve o resultado da avaliação. **Só avalia se o painel estiver
   aberto** (a ponte já sabe disso pela `CHAVE_ABERTURA`).
6. Painel: cartão de sugestão no topo da conversa, com as quatro ações da seção 4 da spec.
   "Preparar" envia `acao.pedido` como se o usuário tivesse digitado.
7. Barra do SEI: botão do Estúdio ao lado do Agente de IA (`dist/js/sei-pro.js`, procure
   `htmlBtnAgenteIA` e faça igual), com ícone novo em `dist/icons/menu/`, e o ponto discreto no
   ícone do agente quando houver sugestão.
8. Manifests: acrescente `html/fluxos.html`, o bundle e o ícone novo em `RECURSOS_NOVOS` de
   `tools/patch-manifests.mjs` e rode `node tools/patch-manifests.mjs`. **Recurso novo que não
   entra no `web_accessible_resources` aparece como texto alternativo no lugar do ícone.**
   Só `dist/manifest.json` é versionado; os outros 11 são locais.
9. Opção própria nas configurações do SEI Pro (`dist/html/options.html` + `config.json`, veja como
   `ferramentasia` é declarada) e página de documentação em `pages/` no padrão da casa, com a
   linha correspondente no catálogo do `README.md` e o ícone em `_data/icones.yml` +
   `_includes/icones.svg`.

## Como testar de verdade

O projeto tem um harness de navegador (não versionado, monte o seu no diretório de scratchpad):

- Use o **Chrome for Testing**, não o Chrome do sistema — o Chrome instalado é gerenciado por
  política da organização e **recusa extensão descompactada** (`chrome://extensions` vazia,
  `ERR_BLOCKED_BY_CLIENT`). Binário em
  `~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/Google Chrome for Testing.app/...`.
- `puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions', '--disable-component-extensions-with-background-pages'] })`
  e `await browser.installExtension('<caminho>/dist')`. **Nunca chame `chrome.runtime.reload()`**:
  ele descarrega a extensão de vez na sessão.
- Depois de reinstalar a extensão, **abra uma aba nova do SEI** — a antiga fica com o contexto
  invalidado e não conecta ao painel. E reinstalar zera o `chrome.storage`.
- SEI de teste: `https://treinamento.sei.sp.gov.br/sei/` (usuário e senha `pedro.soares`, órgão
  GESP-TREINAMENTO). É ambiente de treinamento; pode escrever, mas **limpe o que criar**.
- `chrome.permissions.request` só funciona dentro de um gesto do usuário **e antes de qualquer
  `await`** — pedir permissão depois de um await trava num diálogo que ninguém vê.

## Avaliação com modelo real

`npm run evals` roda o motor contra um SEI de mentira e custa dinheiro. A chave está no perfil de
teste do navegador (`chrome.storage.local`, `agenteIA_config.chave`) — leia de lá e passe por
variável de ambiente ao processo filho; **não escreva a chave em arquivo nem no comando**.
Acrescente o caso da seção 10 da spec.

## Critérios de aceite

- `npx tsc --noEmit` limpo, `npm run verificar` sem falhas (inclusive os novos).
- Com um fluxo mapeado à mão e um processo que casa, o cartão aparece no painel e "Preparar"
  chega ao cartão de aprovação do documento.
- Com chave de IA, "aprender de processo modelo" devolve uma proposta editável a partir de um
  processo real, sem incluir anexos como etapa.
- **Sem chave de IA**, o estúdio abre, mapeia e sugere normalmente; só "Preparar" e "aprender"
  explicam que precisam do agente configurado.
- Nenhuma requisição ao SEI quando o painel do agente está fechado.
- Documentação e opção nas configurações prontas, no padrão das outras funcionalidades.

## Quando parar e perguntar

- Se a avaliação precisar ler **conteúdo** de documento para decidir se sugere (a spec diz que
  não deve: conteúdo só depois do clique).
- Se aparecer necessidade de varrer a caixa da unidade (fora do escopo desta fase).
- Se algum título de documento do SEI real não casar com o modelo de dados — traga o caso.
- Antes de qualquer `git push`, tag ou release.

O autor vai fornecer um processo real da ANTAQ para servir de modelo de teste; até lá, use o SEI
de treinamento de SP.
