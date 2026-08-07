# ADR-0006 — Isolar falhas de `install` por feature

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0004, ADR-0005

## Contexto

As features de um contexto compartilham o mesmo mundo isolado e, nos blocos legados, o mesmo
escopo global. O boot atual instala em sequência sem proteção:

```39:45:src/app/boot.js
    ids.forEach((id) => {
        const entry = getRegisteredFeature(id);
        if (!entry) return;
        if (!isFeatureEnabled(entry.configKey)) return;
        entry.install(deps);
        installed.push(id);
    });
```

Uma exceção em `entry.install(deps)` propaga e aborta o `forEach`: todas as features
seguintes na ordem simplesmente não são instaladas. O usuário vê metade da extensão
faltando, sem mensagem, e o diagnóstico depende de descobrir qual foi a primeira a quebrar.

O risco é concreto porque a causa mais provável de falha no `install` é externa e frequente:
o SEI mudou um seletor e a view não encontra o ponto de ancoragem (ADR-0003). Ou seja, a
falha esperada é justamente a que não deveria ser fatal.

Existe infraestrutura de captura de erro (`src/platform/report.js`, com interceptação de
console, `window.onerror` e `unhandledrejection`), mas ela **reporta** depois do fato; não
contém a falha nem preserva as features vizinhas.

## Decisão

O boot instala cada feature dentro de um limite de falha. Uma feature que quebra na
instalação é registrada e desativada; as demais continuam.

```js
for (const entry of features) {
    if (!isEnabled(entry, deps.config)) continue;
    try {
        const cleanup = entry.install(deps);
        installed.push({ id: entry.id, cleanup });
    } catch (error) {
        deps.logger.error(`feature "${entry.id}" falhou ao instalar`, error);
        failed.push({ id: entry.id, error });
    }
}
return { context, installed, failed };
```

Regras derivadas:

- `install` pode devolver uma função de `cleanup`. O boot a guarda; contextos com
  navegação em iframe usam isso para desinstalar sem vazar listener.
- O limite cobre **apenas** o `install` sincrônico. Erro em handler de evento é
  responsabilidade da view, que envolve os próprios handlers — um `try/catch` no boot não
  alcança callback assíncrono.
- Falhas vão para o logger injetado (ADR-0005) e alimentam `platform/report.js`. O
  resultado `{ installed, failed }` é o contrato observável usado pelos testes.
- **O usuário é avisado.** Falha silenciosa é pior que falha visível: uma feature que caiu
  aparece como indisponível na interface, não como ausente. O detalhe técnico fica no
  relatório de erro, não na tela.

## Consequências

**Ganhamos:** uma quebra causada por mudança no SEI degrada uma feature em vez de derrubar
o contexto; o `failed` dá um sinal diagnóstico nomeado, em vez de "faltou coisa na página";
`cleanup` abre caminho para reinstalação em navegação de iframe, hoje impossível.

**Pagamos:** risco de mascarar erro em desenvolvimento, transformando bug em degradação
silenciosa. Mitigação: em build de desenvolvimento o limite loga com stack completa e o
teste de boot exige que `failed` esteja vazio nos cenários felizes.

**Fica proibido:** `catch` vazio ou que engole erro sem registrar (o padrão de
`bus.js:31`, `catch (e) { /* ignore */ }`, é o antipadrão que este ADR proíbe);
`install` que deixa DOM ou listener pela metade ao lançar — deve limpar o que criou.

## Verificação

- `tests/app/boot.test.js` — feature que lança no `install` não impede as seguintes;
  `failed` contém o id e o erro; o logger recebeu a falha.
- `tests/structure/no-silent-catch.test.js` — nenhum `catch` em `src/` sem chamada a
  logger, `report`, `throw` ou comentário justificando com condição. Baseline por ratchet
  (ADR-0008).

## Alternativas consideradas

**Deixar propagar e confiar no `report.js`** — é o estado atual. Reporta a primeira falha
e perde todas as features seguintes.

**Instalar cada feature em `try/catch` dentro da própria feature** — espalha a
responsabilidade por 22 lugares e não garante cobertura; o limite pertence ao composition
root, que é quem conhece a lista.

**Isolar por iframe ou Web Worker** — isolamento real, mas as features precisam do DOM da
página do SEI; inviável.
