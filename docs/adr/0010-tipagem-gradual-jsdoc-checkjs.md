# ADR-0010 — Tipagem gradual com JSDoc + `checkJs`, sem migrar para TypeScript

- **Status:** Substituído por 0014
- **Data:** 2026-08-07
- **Relacionados:** ADR-0005, ADR-0008

> **Substituído por [ADR-0014](./0014-typescript-para-codigo-novo.md)** no mesmo dia.
> Os argumentos deste ADR não se sustentaram na medição: o risco de pipeline não existe (o
> esbuild compila `.ts` nativamente, sem plugin, e os legados continuam apenas copiados), e
> o custo de renomeação que ele presumiu é praticamente zero (esbuild, vitest e `tsc`
> resolvem `./x.js` para `x.ts`, então os 978 imports não precisam mudar). Mantido como
> registro; não seguir.

## Contexto

São 409 arquivos JavaScript em `src/`, sem nenhuma verificação de tipos: não há
`tsconfig.json`, `.ts` nem checagem estática de qualquer natureza. O primeiro sinal de que
um contrato entre camadas foi violado é a extensão quebrando numa página do SEI.

Isso pesa mais do que o normal por causa de duas decisões deste conjunto de ADRs. A injeção
explícita (ADR-0005) troca busca em global por objetos `deps` passados adiante — sem tipo,
um `deps` faltando um port só falha quando aquele caminho executa. E o ACL do SEI (ADR-0003)
faz parsers devolverem objetos de domínio — sem tipo, a forma desses objetos é convenção
oral entre parser e consumidor.

A tentação óbvia é migrar para TypeScript. Existe, porém, uma restrição histórica registrada
e importante: a tentativa anterior com Vite + CRXJS foi revertida porque o pipeline
minificava os arquivos legados in-place, destruindo a fonte. Há hoje 24 arquivos legados
copiados verbatim pelo build precisamente para não passarem pelo bundler. Qualquer mudança
que mexa no pipeline de compilação carrega esse risco.

Migrar 409 arquivos também competiria por atenção com os trabalhos de maior valor — ACL
(ADR-0003) e manifest gerado (ADR-0004) — e, no meio do caminho, produziria uma base metade
`.ts` metade `.js` com dois modos de build.

## Decisão

Adotar **verificação de tipos sobre JavaScript**: `tsconfig.json` com `checkJs: true` e
tipos declarados em JSDoc. `tsc` roda apenas como **verificador** (`--noEmit`); o build
continua sendo esbuild, sem nenhuma alteração no pipeline nem na cópia verbatim dos legados.

Estratégia gradual, começando pelo que dá mais retorno:

1. **Ports** (`src/platform/`) — `@typedef` de cada interface de port, para que a raiz de
   composição (ADR-0005) seja verificada ao montar `deps`.
2. **Descritor de feature** (ADR-0004) e **schema de configuração** (ADR-0009) — os dois
   contratos que outras coisas são geradas a partir de.
3. **Fronteira do ACL** (ADR-0003) — a forma dos objetos de domínio devolvidos pelos parsers.
4. **`src/core/`** — domínio puro, onde o retorno é maior e o custo menor.

Os 24 arquivos legados copiados verbatim ficam **fora** da checagem (`exclude`), pela mesma
razão que ficam fora do bundler.

Estrito onde é novo, tolerante onde é legado: `strict: true` no escopo verificado, com
`allowJs`; a expansão do escopo é governada por ratchet (ADR-0008), não por meta de data.

## Consequências

**Ganhamos:** violação de contrato entre camadas detectada em CI em vez de na página do
SEI; `deps` incompleto pega no editor; autocomplete real sobre ports, descritores e schema,
o que também melhora a assistência de agentes; nenhum risco ao pipeline de build, que é a
parte frágil e já queimada uma vez.

**Pagamos:** JSDoc é mais verboso e menos expressivo que sintaxe TypeScript, especialmente
em genéricos; a checagem cobre menos do que cobriria uma migração completa; e a base fica
num estado intermediário permanente, o que é uma escolha, não um acidente.

**Fica proibido:** introduzir `.ts` em `src/` (reabra por ADR se a premissa mudar); alterar
o pipeline do esbuild para acomodar tipos; `@ts-ignore` sem comentário justificando;
incluir os legados verbatim no escopo de checagem.

## Verificação

- `tsc --noEmit` roda em CI (ADR-0008); erro de tipo no escopo verificado quebra o build.
- Ratchet do número de arquivos ainda em `exclude` do `tsconfig.json`, decrescente.
- `tests/structure/typedefs.test.js` — todo módulo em `src/platform/` tem `@typedef` do seu
  port, e todo campo do descritor de feature está tipado.

## Alternativas consideradas

**Migrar para TypeScript** — melhor destino final, custo e risco errados agora: 409
arquivos, pipeline que já foi quebrado por mudança de bundler, e competição direta com
ADR-0003 e ADR-0004, que valem mais. Reavaliar quando os blocos legados do manifest
morrerem; nesse ponto a migração fica barata e o `checkJs` já terá pago a maior parte do
benefício.

**Nenhuma checagem de tipos** — mantém o custo atual, que a injeção explícita de ADR-0005
aumenta em vez de diminuir.

**Apenas ESLint com regras de tipo** — ESLint não faz inferência entre módulos; não pegaria
`deps` incompleto nem forma errada de objeto de domínio, que são exatamente os dois casos
que motivam este ADR.
