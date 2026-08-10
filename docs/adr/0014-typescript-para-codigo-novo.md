# ADR-0014 — TypeScript em toda a base; renomeação mecânica com dívida explícita

- **Status:** Aceito
- **Data:** 2026-08-07
- **Substitui:** [ADR-0010](./0010-tipagem-gradual-jsdoc-checkjs.md)
- **Relacionados:** ADR-0003, ADR-0005, ADR-0007, ADR-0008

## Contexto

O [ADR-0010](./0010-tipagem-gradual-jsdoc-checkjs.md), escrito horas antes deste, decidiu
tipagem por JSDoc + `checkJs` e **proibiu** `.ts` em `src/`. A revisão no mesmo dia mostrou
que seus argumentos não se sustentam, e a medição abaixo definiu a estratégia correta.

**O risco de pipeline não existe.** O ADR-0010 herdou o trauma da reversão do Vite + CRXJS
(que minificava os legados in-place, destruindo a fonte). Mas o esbuild — já o bundler do
projeto — compila `.ts` nativamente, sem plugin nem configuração. Verificado com esbuild
0.28.1.

**Renomear é praticamente grátis, ao contrário do que se supunha.** Os 978 imports em `src/`
e os 194 em `tests/` usam extensão `.js` explícita (zero sem extensão) — o que sugeriria
1.172 reescritas. Mas esbuild, vitest e `tsc` **todos resolvem `./x.js` para `x.ts`**.
Verificado nos três em 2026-08-07. A renomeação não exige tocar em nenhum import.

**Tipar sob `strict` é o custo real, e ele está concentrado no lugar errado.** Medição com
`checkJs: true` e `strict: true` sobre toda a base:

| Métrica | Valor |
|---|---|
| Erros de tipo | 19.788 |
| Arquivos com erro | 368 de 409 |
| Arquivos já limpos | 41 |
| Erros em `atividades` + `sei-functions` | 10.266 (52%) |
| Erros em `src/features` | 17.905 (90%) |
| Erros em `core` + `shared` + `platform` + `sei` | ~1.158 |

Reproduzir: `tsconfig` derivado do atual com `checkJs: true` e
`include: ["src/**/*.js", "src/**/*.ts"]`, depois `tsc --noEmit` e contar `error TS`.

Os dois maiores grupos de erro **não são dívida de tipagem**: `TS2304`/`TS2552` (5.183, 26%)
são globais não declarados, que um `.d.ts` elimina em massa; `TS2683` (1.312) é `this`
implícito em callback de jQuery, que desaparece sozinho conforme o ADR-0003 remove jQuery.
Uma fração grande do número cai sem ninguém tipar nada.

**O fato decisivo sobre a ferramenta:** o esbuild **remove os tipos sem verificá-los** — é
transpilador, não compilador TypeScript. Verificado: um erro `TS2322` real faz `tsc` sair com
código 1 e o esbuild sair com 0, bundlando o arquivo. Portanto TypeScript sem `tsc --noEmit`
em CI é *pior* que o JavaScript atual: entrega a sensação de garantia com zero verificação.

## Decisão

**Toda a base passa a ser TypeScript, por renomeação mecânica — não por campanha de
tipagem.** As duas metades têm custos que diferem em ordens de grandeza e são decididas
separadamente:

1. **Renomeação (`.js` → `.ts`), em um único commit mecânico.** Sem mudança de
   comportamento, sem tocar imports, sem tipar nada. Todo arquivo que não passa em `strict`
   recebe **`@ts-nocheck`** na primeira linha, com referência a este ADR.
2. **Remoção dos `@ts-nocheck`, arquivo por arquivo, governada por ratchet** (ADR-0008).
   Nunca em lote.

Condições, todas obrigatórias:

- **CI com `tsc --noEmit` antes da renomeação.** Sem o verificador, TypeScript é decoração.
  Isto amarra este ADR à fatia 0.1 de [`implementation-plan.md`](../implementation-plan.md).
- **A dívida é `@ts-nocheck`, nunca `any` nem `as`.** `@ts-nocheck` é um marcador único, no
  topo do arquivo, contável por `grep`, e honesto: declara que o arquivo não é verificado.
  Silenciar erro com `any` espalhado produziria uma base que *parece* tipada, verifica nada,
  e na qual não se distingue mais o seguro do inseguro — perdendo justamente o que a
  renomeação deveria comprar.
- **Arquivo tocado perde o `@ts-nocheck`.** Se você edita o arquivo por qualquer motivo, ele
  entra no `strict` no mesmo commit. É assim que o ratchet anda sem projeto dedicado.
- **Os 24 legados copiados verbatim continuam `.js`.** Não passam pelo bundler (o build
  apenas os copia) e são scripts clássicos, não módulos.
- **`tsc` só verifica; o esbuild continua compilando.** Nenhum `outDir`, nenhuma etapa nova.
- **Declarações para a fronteira legada** em `src/types/`: `SeiPro` (ADR-0005) e os globais
  de vendor. Feito primeiro, porque elimina 26% dos erros de uma vez.
- **Ordem de remoção do `@ts-nocheck` por valor:** `src/types` → ports de `platform` →
  descritor de feature e schema de configuração (ADR-0004, ADR-0009) → fronteira do ACL
  (ADR-0003) → `core` e `shared` → features.
- **`atividades` e `sei-functions` ficam por último**, apesar de concentrarem 52% dos erros:
  são o alvo de demolição do ADR-0007 e da reescrita do ADR-0003. Tipar antes de fatiar é
  pagar duas vezes e produzir um diff que mistura reescrita com anotação, inviável de
  revisar.

## Consequências

**Ganhamos:** um idioma único na base inteira, sem a ambiguidade de "este arquivo é
verificado?" respondida pela extensão; dívida de tipagem visível e contável, em vez de
difusa; expressividade real nas costuras que importam (ports, descritores, schema, parsers do
ACL); erro de contrato pego em CI e no editor em vez de na página do SEI; e 41 arquivos
entrando no `strict` imediatamente, de graça.

**Pagamos:** logo após a renomeação, ~90% da base é `.ts` **não verificado**, o que é uma
armadilha de leitura — a extensão `.ts` passa a sugerir garantia que 368 arquivos não têm, e
só o `@ts-nocheck` desmente. O commit de renomeação é enorme e conflita com qualquer trabalho
em andamento, exigindo coordenação. E `tsc` passa a ser um passo de CI que pode quebrar por
motivo alheio ao comportamento.

**Não ganhamos, e é importante não fingir que sim:** a renomeação **não deixa o código mais
seguro**. Ela compra idioma único e um medidor de dívida. Segurança vem da remoção de cada
`@ts-nocheck`, uma por uma, e isso custaria o mesmo se os arquivos continuassem `.js` com
`checkJs`.

**Fica proibido:** renomear antes de `tsc --noEmit` estar no CI; `tsc` emitindo arquivo;
converter legado copiado verbatim; adicionar `@ts-nocheck` a arquivo novo; silenciar erro com
`any` implícito, `as any` ou `@ts-ignore` sem justificativa escrita; remover `@ts-nocheck` em
lote sem revisão dos tipos introduzidos.

## Verificação

- `tsc --noEmit` em CI (ADR-0008); erro de tipo quebra o build.
- **Ratchet `@ts-nocheck`**: contagem de arquivos com o marcador, monotonicamente
  decrescente. É a medida oficial do progresso da migração.
- **Ratchet `any` explícito e `@ts-ignore`**: decrescente, para impedir que a dívida migre de
  um marcador honesto para um difuso.
- `tests/structure/typescript-boundary.test.js` (ADR-0014 + Spec Kit `002-ts-zero-legacy`):
  - descriptors são `feature.ts`;
  - `.js` remanescente em camadas modernas é **shrink-only allowlist**;
  - `tsconfig.json` tem `strict: true` e `include` com `src/**/*.ts`.
- **Policy gate** (`npm run policy:check` / `scripts/policy-check.mjs`): toque em runtime de
  produto exige fecho `exclusive`, sem `@ts-nocheck`/`any`/`@ts-ignore` nos arquivos
  tocados, sem acoplamento a superfície não-exclusive (ver `specs/002-ts-zero-legacy/`).
- `tests/structure/touched-ts-nocheck.test.js` e `exclusive-closure-policy.test.js`.
- **Gate do commit de renomeação:** o `dist/` gerado antes e depois deve ser idêntico, exceto
  os comentários de caminho que o esbuild injeta (`// src/x.js` → `// src/x.ts`). Diferença
  além disso significa que a renomeação mudou comportamento e deve ser revertida.

## Alternativas consideradas

**Só código novo em `.ts`, legado migra por oportunidade** — foi a proposta inicial deste
ADR. Rejeitada: mantém dois idiomas por extensão durante anos e depende de o legado ser
tocado algum dia, sem prazo nem medição. A renomeação mecânica atinge o mesmo destino com
custo quase zero e substitui a esperança por um ratchet.

**Manter JSDoc + `checkJs` (ADR-0010)** — funciona, mas paga menos em expressividade e deixa
a base num estado intermediário por decisão, não por transição. O argumento de risco que a
sustentava não se verificou.

**Renomear tudo e tipar tudo agora** — rejeitada pela distribuição medida: 52% dos erros
estão em código que ADR-0007 e ADR-0003 vão reescrever ou apagar, e 26% somem com um `.d.ts`
ou com a saída do jQuery. Seria pagar duas vezes e inviabilizar a revisão dos refactors que
valem mais.

**Renomear tudo com `strict: false` global, ligando por diretório via project references** —
alcança o mesmo efeito, mas com mais máquina (múltiplos `tsconfig`) e um medidor pior: a
dívida fica implícita na configuração, não contável por arquivo. `@ts-nocheck` é mais simples
e mais honesto.

**TypeScript sem `tsc` em CI, confiando no esbuild** — a armadilha específica deste projeto,
verificada empiricamente acima. Pior que não ter tipos.
