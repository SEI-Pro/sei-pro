# ADR-0013 — Remover o event bus enquanto não houver consumidor real

- **Status:** Aceito
- **Data:** 2026-08-07
- **Relacionados:** ADR-0005, ADR-0007

## Contexto

`src/platform/bus.js` é apresentado em `docs/architecture.md` e `DEVELOPMENT.md` como um dos
três mecanismos de comunicação do projeto, com whitelist de três eventos
(`config:changed`, `monitorados:updated`, `process-list:refreshed`) e exemplo de uso na
documentação.

Medido em 2026-08-07:

- **1 emissor**: `src/features/monitorados/store.js:63` emite `monitorados:updated`.
- **0 assinantes**: nenhum `bus.on(` em `src/`.
- 2 dos 3 eventos da whitelist nunca são emitidos nem escutados.

É abstração especulativa: foi construída para um desacoplamento que não aconteceu. O custo
não é o tamanho do arquivo (55 linhas) — é o custo de documentação e decisão. Aparece como
mecanismo recomendado, então cada nova feature precisa decidir entre `feature.api` e bus sem
nenhum exemplo real de qual usar quando. E há um defeito embutido que só apareceria quando
alguém finalmente o usasse:

```30:32:src/platform/bus.js
        set.forEach((handler) => {
            try { handler(payload); } catch (e) { /* ignore listener errors */ }
        });
```

Erro de listener é engolido em silêncio — o antipadrão que ADR-0006 proíbe. Um bus com essa
semântica transforma bug de assinante em comportamento faltando sem rastro.

Há também uma incompatibilidade de fundo com ADR-0002: o bus é um objeto em memória, então
só funciona **dentro** de um contexto de execução. A comunicação que de fato precisa de
desacoplamento neste projeto é a que atravessa contexto (content script ↔ service worker ↔
options), e essa é obrigatoriamente serializável — o bus não serve para ela. Dentro de um
único contexto, a raiz de composição (ADR-0005) já resolve o mesmo problema explicitamente,
ligando produtor e consumidor num lugar legível.

## Decisão

Remover `src/platform/bus.js` e as referências a ele em `docs/architecture.md` e
`DEVELOPMENT.md`. O emissor único em `monitorados/store.js` passa a receber um callback
injetado pela raiz de composição (ADR-0005) — quem quiser reagir à atualização é ligado no
entry do contexto, explicitamente.

Comunicação passa a ter duas formas, ambas com uso real:

| Necessidade | Mecanismo |
|---|---|
| Feature chama feature, mesmo contexto | `SeiPro.features.<id>.api` (ADR-0004) ou ligação na raiz de composição (ADR-0005) |
| Atravessar contexto de execução | Mensagem serializável via `platform/messaging.js` |

Este ADR **não** proíbe um bus para sempre. Ele exige que a abstração venha depois da
necessidade: quando houver dois consumidores reais de um mesmo evento que a ligação na raiz
de composição não atenda, um novo ADR reintroduz o bus — com propagação de erro para o
logger, não `catch` vazio.

## Consequências

**Ganhamos:** um mecanismo a menos para escolher entre, e a documentação deixa de
recomendar algo sem uso; some um `catch` silencioso; a comunicação entre features fica
rastreável por leitura, já que a ligação é explícita na raiz de composição.

**Pagamos:** se o desacoplamento por evento virar necessidade real, será preciso reintroduzir
— e o custo de reintroduzir 55 linhas é menor que o de manter uma recomendação enganosa.
Também é preciso ajustar o único emissor, que hoje não tem assinante e portanto não muda
comportamento.

**Fica proibido:** reintroduzir bus sem ADR e sem pelo menos dois consumidores reais;
`catch` que engole erro de listener (ADR-0006); usar evento para comunicação intra-feature.

## Verificação

- `tests/structure/no-bus.test.js` — nenhum import de `platform/bus.js`; o arquivo não
  existe.
- `tests/structure/no-silent-catch.test.js` (ADR-0006) cobre o padrão do `catch` vazio.

## Alternativas consideradas

**Manter o bus e adotá-lo de verdade** — defensável se houvesse um caso concreto pedindo
desacoplamento entre produtor e consumidor no mesmo contexto. Não há: o único emissor não
tem assinante depois de meses.

**Manter como está, custo baixo** — o custo real não é o código, é a documentação recomendar
um caminho sem uso, e o defeito latente do `catch` vazio esperando o primeiro usuário.

**Substituir por `CustomEvent` no DOM** — herda os mesmos problemas e adiciona acoplamento ao
DOM da página do SEI, que é justamente o que ADR-0003 isola.
