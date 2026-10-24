# processo

Painéis abaixo da árvore, menu do documento, capa com cards e Gantt de tramitação, em TypeScript.
Desenho: `docs/superpowers/specs/2026-10-23-processo-design.md`; plano: `docs/superpowers/plans/2026-10-24-processo.md`.

## Estado

Etapa 1, tarefa 1: base de dados.

- `src/modelo/loja.ts`: `LojaProcesso`, uma por `host|login|idProcedimento`. Cada fatia (`dadosProcesso`, `anotacao`,
  `marcador`, `acompanhamento`, `atribuicao`, `relacionados`, `blocoInterno`) tem estado próprio
  (`carregando | pronto | erro | desatualizado`) e carrega em paralelo com as outras.
  - `carregar` pinta o cache como `desatualizado`, busca, tenta de novo (2 tentativas no total, espera crescente) e
    termina `pronto` ou `erro` (o dado anterior é mantido no erro). Nunca rejeita; chamadas simultâneas na mesma
    fatia dividem a busca.
  - `enfileirar` serializa as gravações no SEI do processo.
  - `sigiloso = true` (ou escopo sem login) impede qualquer gravação no cache.
- `src/repositorio.ts`: cache em `chrome.storage.local`, uma chave `processo/<host|login>/<id>` por processo, teto de
  200 processos e 2 MB (poda os mais antigos), entrada acima de 64 KB só em memória, qualquer falha do storage
  (cota cheia) é engolida.

## Comandos

```
npm run tipos       # tsc --noEmit
npm run verificar   # testes (tsx + linkedom)
npm run build       # verificar + build.mjs (pula entradas que ainda não existem)
```

O `build.mjs` reprova, no código que roda na página, `innerHTML` & cia e os endereços que gravam
"Processo recebido" (`procedimento_visualizar`, `arvore_montar`, `procedimento_atribuicao_cadastrar`).
