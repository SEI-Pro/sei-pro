# Atividades: arquitetura desacoplada

`src/entries/atividades.ts` é a raiz de composição; `src/features/atividades/index.ts`
monta o núcleo residual sem auto-boot. As quatro fronteiras de capacidade agora são
explicitamente instaladas antes dele:

- `atividades-config/`: administração de configuração;
- `atividades-afastamentos/`: afastamentos;
- `atividades-avaliacoes/`: avaliações e recursos;
- `atividades-registro/`: registro, formulários, painel, kanban e relatórios.

O núcleo em `features/atividades/` mantém apenas runtime, portas, handlers e fachadas de
compatibilidade. As fachadas serão removidas à medida que os call-sites migrarem para
`SeiPro.features.<capability>.api`.

Dentro de cada capability, as camadas técnicas continuam:

- `context.js`, `store.js` e `runtime-state.js`: estado, inicialização e
  dependências do host;
- `io.js`, `storage.js`, `request.js` e `server-ports.js`: portas de
  rede/persistência e efeitos do host;
- `domain.js`, `config-domain.js` e `config-queries.js`: regras puras;
- `application/`, `api.js`, `activity-use-cases.js` e `config-use-cases.js`:
  comandos e consultas públicos.

As fatias legadas (`activity-*`, `config-*`, `panel`, `kanban`, relatórios e
afastamentos) continuam contendo os adaptadores de tela necessários ao SEI, mas agora
vivem nas pastas de capacidade. Reexports em `features/atividades/` preservam os imports
internos durante a migração. O dispatcher `callAtiv` resolve primeiro o registry; o estado
é lido do store canônico.

`server.js` é somente a boundary de autorização, payload e transporte. O
roteamento de efeitos da UI legada está em `server-response.js`, recebido como
um adapter com ports explícitos. Novas telas devem usar `api.request` e
assinar o evento normalizado; `api.legacyRequest` existe apenas para os fluxos
que ainda precisam das side effects do SEI antigo.

`legacy-api.js` permanece apenas como ponte opt-in para hosts de terceiros:

```js
installAtividadesLegacyApi({ enabled: true });
```

O fallback de `callAtiv` para `window[nome]` usa a mesma flag e fica desligado
no fluxo normal.

O namespace publicado segue o contrato canônico (`docs/architecture.md`) Tier C:

```js
SeiPro.features.atividades = {
  id: 'atividades',
  api,       // handlers, commands, queries, state, request (+ legacyRequest temporário)
  install,   // boot da feature
  useCases,  // extras Tier C: activity e config
  ports      // extras Tier C: context, storage, effects e server
}
```

Consumidores cross-feature devem preferir `.api`.

Monitorados, projetos, árvore, prescrições, lista e o runtime legado transversal consultam
`feature.api` para estado, handlers, capacidade e requests; nenhum deles
depende dos aliases globais da feature no caminho normal.

Respostas de rede também emitem `seipro:atividades-response` com uma forma
normalizada produzida por `response.js`, permitindo que novas views não
conheçam o roteador legado. O `server-response.js` mantém somente o adaptador
de efeitos de tela para as rotas antigas; novos fluxos devem usar
`api.request` ou os casos de uso.

O smoke automatizado de contrato, view e dispatcher roda com:

```sh
npm run test:atividades:smoke
```
