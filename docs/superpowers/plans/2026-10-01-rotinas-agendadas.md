# Rotinas agendadas no Agente de IA — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar as rotinas de leitura que já existem em tarefas agendadas completas: frequências novas (manual, horária, dias úteis), instruções por prompt ou por skills, três alcances de permissão (leitura, aprovar, autônoma) com cercas, histórico de execuções, aviso por notificação do navegador e disparo por alarme.

**Architecture:** `painel/rotinas.ts` continua sendo a **lógica pura** (modelo, vencimento, cercas) — é ela que os testes exercitam sem navegador. A execução fica no painel, que é o único lugar com a ponte para a aba do SEI; o `background.js` só acorda pelo alarme para avisar ou mandar o painel rodar. A interface sai de `main.ts` para `painel/rotinas-ui.ts`.

**Tech Stack:** TypeScript, esbuild, `chrome.storage.local`, `chrome.alarms`, `chrome.notifications`, `chrome.permissions`, testes caseiros em `agente-ia/tests/verificar-*.ts` por `tsx`.

**Spec:** `docs/superpowers/specs/2026-10-01-mcp-e-rotinas-design.md`

## Global Constraints

- Diálogo, comentários, nomes de símbolo e textos de interface em **português do Brasil**.
- Arquivos em `dist/js/` são **gerados**: nunca editar à mão. Build: `cd agente-ia && npm run build`.
- `dist/background.js` **não** é gerado: é editado à mão, sem TypeScript, no estilo do arquivo (`var`, `function`, sem acento cru — acento vai como `\uXXXX`).
- Toda entrega roda `cd agente-ia && npm run verificar` com **0 falhas** (hoje 570 ok).
- Os 12 `dist/manifest*.json` sobem juntos: editar todos por script e depois rodar `node tools/patch-manifests.mjs`. `alarms` entra em `permissions`; `notifications` em `optional_permissions` (é a que mostra aviso ao usuário).
- Nada de `git add -A`: há outra sessão num worktree paralelo.
- Rotina existente, sem `alcance`, é lida como `"leitura"` — nenhuma rotina já cadastrada pode ganhar poder de escrita numa atualização.
- No Firefox não há background no `manifest_v2.json`: nada do alarme funciona lá, e a interface diz isso.

## Review Focus

1. **Rotina antiga, gravada antes desta versão** (sem `alcance`, sem `ultimas`, com `ultimoResultado`) — tem de continuar funcionando como leitura e não perder o último resultado da tela. Teste na Tarefa 1.
2. **Rotina autônoma diante de um passo irreversível ou de assinatura** — a aprovação automática não pode deixar passar, mesmo que a tool esteja na lista de autorizadas. Teste na Tarefa 2.
3. **Horária que já rodou nesta hora, e horária cujo `ultimaEm` é do minuto anterior à hora cheia** — não pode disparar duas vezes na mesma janela nem perder a janela nova. Teste na Tarefa 1.
4. **Rotina sem prompt e sem skill válida** (a skill foi excluída depois) — não pode rodar nem sumir em silêncio: fica listada com aviso. Teste na Tarefa 3.
5. **Permissão de notificação recusada pelo usuário** — a caixa "avisar" tem de voltar a desmarcada, e a rotina continua funcionando sem aviso. Teste na Tarefa 6 (prova manual, documentada no passo).

---

### Task 1: Modelo, frequências novas e leitura de rotina antiga

**Files:**
- Modify: `agente-ia/src/painel/rotinas.ts`
- Modify: `agente-ia/tests/verificar-rotinas.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type Frequencia = "manual" | "horaria" | "diaria" | "uteis" | "semanal" | "mensal"`
  - `type Alcance = "leitura" | "aprovar" | "autonoma"`
  - `interface Execucao { em: number; ok: boolean; resumo: string; custo: number; escritas?: string[] }`
  - `interface Rotina` com os campos novos `skills?`, `alcance`, `autorizadas?`, `avisar?`, `teto?`, `ultimas?`, `falhas?`
  - `normalizarRotina(bruta: unknown): Rotina | null` — lê o formato antigo
  - `vencimento(r, agora)` e `vencidas(lista, agora)` cobrindo as frequências novas
  - `descreverFrequencia(r)`, `descreverAlcance(a: Alcance): string`
  - `registrarExecucao(r: Rotina, e: Execucao): Rotina` — insere em `ultimas`, corta em 10, atualiza `ultimaEm`
  - `MAX_EXECUCOES = 10`

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar a `agente-ia/tests/verificar-rotinas.ts`, dentro de `verificarRotinas()`, e importar os símbolos novos no topo:

```ts
  secao("rotinas: horaria");
  const horaria = rotina({ frequencia: "horaria" });
  const dezEmPonto = new Date(2026, 8, 23, 10, 0);
  const dezEMeia = new Date(2026, 8, 23, 10, 30);
  checar("sem nunca ter rodado, vence", vencidas([horaria], dezEMeia).length === 1);
  checar("a janela e a hora cheia", vencimento(horaria, dezEMeia)?.getMinutes() === 0);
  const rodou10h05 = rotina({ frequencia: "horaria", ultimaEm: new Date(2026, 8, 23, 10, 5).getTime() });
  checar("nao repete na mesma hora", vencidas([rodou10h05], dezEMeia).length === 0);
  const rodou9h59 = rotina({ frequencia: "horaria", ultimaEm: new Date(2026, 8, 23, 9, 59).getTime() });
  checar("hora nova vence de novo", vencidas([rodou9h59], dezEmPonto).length === 1);

  secao("rotinas: dias uteis");
  const uteis = rotina({ frequencia: "uteis" });
  checar("quarta depois da hora vence", vencidas([uteis], quarta10h).length === 1);
  checar("quarta antes da hora nao vence", vencidas([uteis], quarta7h).length === 0);
  const sabado = new Date(2026, 8, 26, 10, 0); // 26/09/2026 e sabado
  const domingo = new Date(2026, 8, 27, 10, 0);
  checar("sabado nao vence", vencidas([uteis], sabado).length === 0);
  checar("domingo nao vence", vencidas([uteis], domingo).length === 0);
  const segunda = new Date(2026, 8, 28, 10, 0);
  const rodouSexta = rotina({ frequencia: "uteis", ultimaEm: new Date(2026, 8, 25, 9, 0).getTime() });
  checar("segunda cobre o fim de semana com UMA execucao", vencidas([rodouSexta], segunda).length === 1);

  secao("rotinas: manual");
  checar("manual nunca vence", vencidas([rotina({ frequencia: "manual" })], quarta10h).length === 0);
  checar("manual nao tem vencimento", vencimento(rotina({ frequencia: "manual" }), quarta10h) === null);
  checar("manual se descreve", descreverFrequencia(rotina({ frequencia: "manual" })) === "quando você mandar");
  checar("horaria se descreve", descreverFrequencia(rotina({ frequencia: "horaria" })) === "a cada hora");
  checar("uteis diz que nao conta feriado", /feriado/.test(descreverFrequencia(rotina({ frequencia: "uteis" }))));

  secao("rotinas: instrucoes por skill");
  const soSkill = rotina({ pergunta: "  ", skills: ["s1"] });
  checar("sem pergunta mas com skill, vence", vencidas([soSkill], quarta10h).length === 1);
  checar("sem pergunta e sem skill, nao vence", vencidas([rotina({ pergunta: " ", skills: [] })], quarta10h).length === 0);

  secao("rotinas: rotina gravada na versao anterior");
  const antiga = normalizarRotina({
    id: "velha", nome: "Parados", pergunta: "liste", frequencia: "diaria", hora: "08:00", ativa: true,
    ultimaEm: 1_700_000_000_000, ultimoResultado: "8 processos parados",
  });
  checar("continua valendo", antiga !== null);
  checar("nasce como leitura", antiga?.alcance === "leitura");
  checar("o ultimo resultado vira execucao", antiga?.ultimas?.[0].resumo === "8 processos parados");
  checar("frequencia desconhecida e recusada", normalizarRotina({ id: "x", nome: "x", pergunta: "x", frequencia: "a cada lua", hora: "08:00", ativa: true }) === null);
  checar("alcance desconhecido cai para leitura", normalizarRotina({ id: "y", nome: "y", pergunta: "y", frequencia: "diaria", hora: "08:00", ativa: true, alcance: "tudo" })?.alcance === "leitura");

  secao("rotinas: historico de execucoes");
  let comHistorico = rotina();
  for (let i = 0; i < 12; i += 1) comHistorico = registrarExecucao(comHistorico, { em: 1000 + i, ok: true, resumo: `r${i}`, custo: 0.01 });
  checar("guarda no maximo 10", comHistorico.ultimas?.length === MAX_EXECUCOES);
  checar("a mais nova vem primeiro", comHistorico.ultimas?.[0].resumo === "r11", comHistorico.ultimas?.[0]);
  checar("marca a ultima execucao", comHistorico.ultimaEm === 1011);
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd agente-ia && npm run verificar`
Expected: FAIL — `normalizarRotina`, `registrarExecucao` e `MAX_EXECUCOES` não existem; `"horaria"` não é `Frequencia`.

- [ ] **Step 3: Reescrever o modelo em `rotinas.ts`**

Substituir o bloco de tipos (mantendo o comentário de cabeçalho do arquivo, que explica o limite da extensão, e acrescentando nele uma frase sobre o alarme):

```ts
export type Frequencia = "manual" | "horaria" | "diaria" | "uteis" | "semanal" | "mensal";

/**
 * O que a rotina pode fazer no SEI.
 *
 * `leitura` é o padrão e o que toda rotina fazia antes desta versão.
 * `aprovar` propõe a escrita e PARA, esperando o usuário. `autonoma` aprova
 * sozinha, dentro das cercas de `avaliarPassos` — e nunca em passo
 * irreversível ou de assinatura.
 */
export type Alcance = "leitura" | "aprovar" | "autonoma";

export interface Execucao {
  em: number;
  ok: boolean;
  /** Primeiras linhas do resultado (ou o motivo da falha). */
  resumo: string;
  /** Custo em dólares desta execução. */
  custo: number;
  /** Tools de escrita executadas (só em `autonoma`). */
  escritas?: string[];
}

export interface Rotina {
  id: string;
  nome: string;
  /** O pedido, como você digitaria na conversa. Pode ser vazio se houver skills. */
  pergunta: string;
  /** Ids de skills cadastradas, anexadas ao pedido como material de apoio. */
  skills?: string[];
  frequencia: Frequencia;
  /** "08:00" — antes disso no dia, a rotina ainda não está vencida. Ignorado em manual e horária. */
  hora: string;
  /** 1 = segunda ... 7 = domingo (só na semanal). */
  diaSemana?: number;
  /** 1 a 28 (só na mensal). */
  diaMes?: number;
  ativa: boolean;
  alcance: Alcance;
  /** Tools de escrita autorizadas quando `alcance === "autonoma"`. */
  autorizadas?: string[];
  /** Notificar o navegador ao terminar. */
  avisar?: boolean;
  /** Teto de gasto por execução, em reais (0 ou ausente = sem teto próprio). */
  teto?: number;
  ultimaEm?: number;
  /** As 10 últimas execuções, da mais nova para a mais velha. */
  ultimas?: Execucao[];
  /** Falhas de escrita; em 1, a rotina se desliga (ver `avaliarPassos`). */
  falhas?: number;
}

export const MAX_EXECUCOES = 10;

const FREQUENCIAS: Frequencia[] = ["manual", "horaria", "diaria", "uteis", "semanal", "mensal"];
const ALCANCES: Alcance[] = ["leitura", "aprovar", "autonoma"];
```

- [ ] **Step 4: Escrever `normalizarRotina` e `registrarExecucao`**

```ts
/**
 * Lê uma rotina guardada, inclusive na forma anterior a esta versão.
 *
 * Duas garantias: rotina antiga nasce como LEITURA (uma atualização não pode
 * dar poder de escrita a quem não pediu) e o `ultimoResultado` que aparecia
 * na tela vira a primeira execução do histórico, para não desaparecer.
 */
export function normalizarRotina(bruta: unknown): Rotina | null {
  const r = bruta as Partial<Rotina> & { ultimoResultado?: string };
  if (!r || typeof r !== "object" || !r.id || !r.nome) return null;
  if (!FREQUENCIAS.includes(r.frequencia as Frequencia)) return null;
  const alcance = ALCANCES.includes(r.alcance as Alcance) ? (r.alcance as Alcance) : "leitura";
  const ultimas = Array.isArray(r.ultimas)
    ? r.ultimas.slice(0, MAX_EXECUCOES)
    : r.ultimoResultado
      ? [{ em: r.ultimaEm ?? 0, ok: true, resumo: r.ultimoResultado, custo: 0 }]
      : [];
  return {
    id: r.id,
    nome: r.nome,
    pergunta: r.pergunta ?? "",
    ...(r.skills?.length ? { skills: r.skills } : {}),
    frequencia: r.frequencia as Frequencia,
    hora: /^\d{2}:\d{2}$/.test(r.hora ?? "") ? (r.hora as string) : "08:00",
    ...(r.diaSemana ? { diaSemana: r.diaSemana } : {}),
    ...(r.diaMes ? { diaMes: r.diaMes } : {}),
    ativa: r.ativa !== false,
    alcance,
    ...(alcance === "autonoma" && r.autorizadas?.length ? { autorizadas: r.autorizadas } : {}),
    ...(r.avisar || alcance === "autonoma" ? { avisar: true } : {}),
    ...(r.teto ? { teto: r.teto } : {}),
    ...(r.ultimaEm ? { ultimaEm: r.ultimaEm } : {}),
    ...(ultimas.length ? { ultimas } : {}),
    ...(r.falhas ? { falhas: r.falhas } : {}),
  };
}

/** Anota a execução no histórico (a mais nova primeiro) e marca `ultimaEm`. */
export function registrarExecucao(r: Rotina, e: Execucao): Rotina {
  return { ...r, ultimaEm: e.em, ultimas: [e, ...(r.ultimas ?? [])].slice(0, MAX_EXECUCOES) };
}
```

Em `listarRotinas`, passar a lista pelo normalizador:

```ts
    return Array.isArray(lista) ? lista.map(normalizarRotina).filter((r): r is Rotina => r !== null) : [];
```

- [ ] **Step 5: Estender `vencimento`, `vencidas` e as descrições**

Em `vencimento`, antes do caso `diaria`:

```ts
  if (r.frequencia === "manual") return null;
  // Horária: a janela é a hora cheia corrente. Minuto do `ultimaEm` dentro da
  // mesma hora significa "já rodou nesta janela".
  if (r.frequencia === "horaria") return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), agora.getHours(), 0);
  if (r.frequencia === "uteis") {
    const dia = diaDaSemana(agora);
    if (dia > 5) return null; // sábado e domingo
    return agora >= naHora ? naHora : null;
  }
```

Em `vencidas`, trocar a guarda do pedido vazio por uma que aceite skills:

```ts
    if (!r.ativa) return false;
    if (!r.pergunta.trim() && !(r.skills?.length)) return false;
```

Em `descreverFrequencia`, os casos novos:

```ts
  if (r.frequencia === "manual") return "quando você mandar";
  if (r.frequencia === "horaria") return "a cada hora";
  if (r.frequencia === "uteis") return `de segunda a sexta, a partir das ${r.hora} (sem contar feriado)`;
```

E uma descrição de alcance para a interface:

```ts
export function descreverAlcance(a: Alcance): string {
  if (a === "leitura") return "só leitura";
  if (a === "aprovar") return "pode propor alterações e espera você aprovar";
  return "altera o SEI sem pedir aprovação";
}
```

- [ ] **Step 6: Rodar os testes**

Run: `cd agente-ia && npm run verificar && npm run tipos`
Expected: PASS nos dois. Os testes antigos de diária, semanal e mensal continuam passando sem mudança.

- [ ] **Step 7: Commit**

```bash
git add agente-ia/src/painel/rotinas.ts agente-ia/tests/verificar-rotinas.ts
git commit -m "Rotinas: frequencia manual, horaria e dias uteis, historico e leitura do formato antigo

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: As cercas da rotina autônoma

**Files:**
- Modify: `agente-ia/src/painel/rotinas.ts`
- Modify: `agente-ia/tests/verificar-rotinas.ts`

**Interfaces:**
- Consumes: `Rotina`, `Alcance`; `Efeito` de `motor/tipos.ts`.
- Produces:
  - `interface PassoParaAvaliar { tool: string; efeito: Efeito }`
  - `avaliarPassos(r: Rotina, passos: PassoParaAvaliar[]): { aprovado: boolean; motivo?: string; desligar?: boolean }`

- [ ] **Step 1: Escrever os testes que falham**

```ts
  secao("rotinas: cercas da rotina autonoma");
  const auto = (autorizadas: string[]) => rotina({ alcance: "autonoma", autorizadas });
  const passo = (tool: string, efeito: "escrita" | "irreversivel" | "assinatura" | "leitura") => ({ tool, efeito });

  const liberado = avaliarPassos(auto(["processo_marcador"]), [passo("processo_marcador", "escrita")]);
  checar("tool autorizada passa", liberado.aprovado, liberado);

  const fora = avaliarPassos(auto(["processo_marcador"]), [passo("documento_excluir", "escrita")]);
  checar("tool fora da lista reprova o plano inteiro", !fora.aprovado && /não autorizada|não está/i.test(fora.motivo ?? ""), fora);

  const irrev = avaliarPassos(auto(["documento_excluir"]), [passo("documento_excluir", "irreversivel")]);
  checar("irreversivel nunca passa, mesmo autorizada", !irrev.aprovado && /irreversível/i.test(irrev.motivo ?? ""), irrev);

  const assina = avaliarPassos(auto(["documento_assinar"]), [passo("documento_assinar", "assinatura")]);
  checar("assinatura nunca passa", !assina.aprovado && /assinatura/i.test(assina.motivo ?? ""), assina);

  const misto = avaliarPassos(auto(["processo_marcador"]), [passo("processo_marcador", "escrita"), passo("documento_excluir", "irreversivel")]);
  checar("um passo barrado reprova o plano todo", !misto.aprovado, misto);

  const semLista = avaliarPassos(rotina({ alcance: "autonoma" }), [passo("processo_marcador", "escrita")]);
  checar("autonoma sem lista de autorizadas nao escreve nada", !semLista.aprovado, semLista);

  const soLeitura = avaliarPassos(rotina(), [passo("processo_marcador", "escrita")]);
  checar("rotina de leitura reprova qualquer escrita", !soLeitura.aprovado && /leitura/i.test(soLeitura.motivo ?? ""), soLeitura);

  const paraAprovar = avaliarPassos(rotina({ alcance: "aprovar" }), [passo("processo_marcador", "escrita")]);
  checar("alcance aprovar nao decide sozinho", !paraAprovar.aprovado && paraAprovar.desligar !== true, paraAprovar);
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd agente-ia && npm run verificar`
Expected: FAIL — `avaliarPassos` não existe.

- [ ] **Step 3: Escrever `avaliarPassos`**

```ts
import type { Efeito } from "../motor/tipos";

export interface PassoParaAvaliar {
  tool: string;
  efeito: Efeito;
}

/**
 * Decide, sem interface nenhuma, se uma rotina pode aprovar este plano.
 *
 * Mora aqui, numa função pura, porque é a trava mais delicada do agente: a
 * única porta pela qual uma escrita no SEI acontece sem ninguém na frente da
 * tela. Testar isso não pode depender de navegador.
 *
 * Quatro recusas, nesta ordem:
 * 1. efeito irreversível ou de assinatura — nunca, nem listado em `autorizadas`;
 * 2. rotina que não é autônoma — ela não decide: quem decide é o usuário;
 * 3. autônoma sem lista de autorizadas — lista vazia é "nada autorizado";
 * 4. passo fora da lista — reprova o plano inteiro, não só o passo.
 */
export function avaliarPassos(r: Rotina, passos: PassoParaAvaliar[]): { aprovado: boolean; motivo?: string; desligar?: boolean } {
  const escritas = passos.filter((p) => p.efeito !== "leitura" && p.efeito !== "interna" && p.efeito !== "externo");
  if (!escritas.length) return { aprovado: true };

  const grave = escritas.find((p) => p.efeito === "irreversivel" || p.efeito === "assinatura");
  if (grave) {
    return {
      aprovado: false,
      motivo: `"${grave.tool}" é ${grave.efeito === "assinatura" ? "assinatura" : "irreversível"} e uma rotina nunca faz isso sozinha. Peça ao usuário na conversa.`,
    };
  }
  if (r.alcance === "leitura") {
    return { aprovado: false, motivo: "Esta rotina é de leitura: ela não altera nada no SEI. Responda com o que foi encontrado." };
  }
  if (r.alcance === "aprovar") {
    return { aprovado: false, motivo: "Esta rotina precisa da aprovação do usuário para escrever." };
  }
  const autorizadas = r.autorizadas ?? [];
  const barrada = escritas.find((p) => !autorizadas.includes(p.tool));
  if (barrada) {
    return {
      aprovado: false,
      motivo: `"${barrada.tool}" não está entre as ferramentas autorizadas desta rotina (${autorizadas.join(", ") || "nenhuma"}).`,
    };
  }
  return { aprovado: true };
}
```

- [ ] **Step 4: Rodar os testes**

Run: `cd agente-ia && npm run verificar && npm run tipos`
Expected: PASS, 0 falhas.

- [ ] **Step 5: Commit**

```bash
git add agente-ia/src/painel/rotinas.ts agente-ia/tests/verificar-rotinas.ts
git commit -m "Rotinas: cercas da execucao autonoma como funcao pura e testada

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Execução no painel (leitura, aprovar, autônoma)

**Files:**
- Modify: `agente-ia/src/painel/main.ts` (a `rodarRotinas` por volta de `main.ts:1652`)

**Interfaces:**
- Consumes: `vencidas`, `avaliarPassos`, `registrarExecucao`, `descreverFrequencia`, `descreverAlcance`, `comSkills`, `cabeMaisUma`, `gastoDeHoje`, `somarGastoDoDia`.
- Produces:
  - `App.rodarRotina(r: Rotina, motivo: "vencida" | "manual"): Promise<Execucao>` — método privado, chamado pela varredura e pelo botão "Rodar agora".

- [ ] **Step 1: Reescrever `rodarRotinas`**

Trocar o corpo atual por uma varredura que delega a cada execução, mantendo as duas travas que já existem (esperar a aba do SEI e respeitar o teto de gasto):

```ts
  /**
   * Roda as rotinas vencidas, uma de cada vez.
   *
   * Acontece ao abrir o painel e, com ele aberto, a cada cinco minutos — é
   * nesses dois momentos que a extensão existe. O alarme do navegador (ver
   * `background.js`) só avisa; quem executa é sempre o painel, porque a
   * sessão do SEI é da aba do usuário.
   */
  private async rodarRotinas(): Promise<void> {
    const pendentes = vencidas(this.rotinas);
    if (!pendentes.length || !this.config.chave) return;
    for (let i = 0; i < 20 && !this.ponte.atual(); i += 1) await new Promise((r) => setTimeout(r, 1000));
    if (!this.ponte.atual()) return;
    for (const rotina of pendentes) {
      const seguir = await this.rodarRotina(rotina, "vencida");
      if (!seguir) break;
    }
  }
```

- [ ] **Step 2: Escrever `rodarRotina`**

```ts
  /**
   * Uma execução de rotina, do aviso na conversa ao registro no histórico.
   *
   * Devolve `false` quando não vale seguir para a próxima (teto de gasto
   * estourado) — quem varre a lista para aí.
   */
  private async rodarRotina(rotina: Rotina, motivo: "vencida" | "manual"): Promise<boolean> {
    const emReais = (d: number) => d * (this.cambio?.valor ?? 5.5);
    const veredito = cabeMaisUma(this.config.limites, emReais(this.uso.custo), await gastoDeHoje());
    if (!veredito.permite) {
      this.adicionar({ tipo: "aviso", texto: `A rotina "${rotina.nome}" não rodou: ${veredito.motivo}` });
      return false;
    }
    const skills = (rotina.skills ?? []).map((id) => this.skills.find((s) => s.id === id)).filter((s): s is SkillUsuario => Boolean(s));
    const pedido = comSkills(rotina.pergunta.trim(), skills);
    if (!pedido.trim()) {
      this.adicionar({ tipo: "aviso", texto: `A rotina "${rotina.nome}" não tem instrução: o texto está em branco e as skills escolhidas não existem mais.` });
      return true;
    }
    this.adicionar({
      tipo: "aviso",
      texto: `Rotina "${rotina.nome}" (${motivo === "manual" ? "pedida por você" : descreverFrequencia(rotina)}) — ${descreverAlcance(rotina.alcance)}.`,
    });

    const antes = this.uso.custo;
    const escritas: string[] = [];
    let resultado = "";
    let ok = true;
    let desligar = false;
    try {
      if (rotina.alcance === "leitura") {
        resultado = await this.delegar(pedido, new AbortController().signal);
        this.adicionar({ tipo: "agente", texto: resultado });
      } else {
        // Motor principal, com a interface do painel — e, na autônoma, com a
        // aprovação decidida por `avaliarPassos` em vez do cartão.
        const motor = this.criarMotor(
          undefined,
          rotina.alcance === "autonoma"
            ? {
                aprovarPlano: async (plano) => {
                  const r = avaliarPassos(rotina, plano.passos.map((p) => ({ tool: p.tool, efeito: p.efeito })));
                  if (!r.aprovado) {
                    this.adicionar({ tipo: "aviso", texto: `Rotina "${rotina.nome}": ${r.motivo}` });
                    return { aprovado: false, motivo: r.motivo };
                  }
                  for (const p of plano.passos) escritas.push(p.tool);
                  this.adicionar({ tipo: "aviso", texto: `Rotina "${rotina.nome}" vai executar sem aprovação: ${plano.passos.map((p) => p.rotulo).join("; ")}` });
                  return { aprovado: true };
                },
              }
            : {},
        );
        await motor.enviar(pedido);
        resultado = this.ultimoTextoDoAgente();
      }
    } catch (e) {
      ok = false;
      resultado = `Falhou: ${(e as Error).message}`;
      this.adicionar({ tipo: "erro", texto: `Rotina "${rotina.nome}": ${(e as Error).message}` });
      if (rotina.alcance === "autonoma" && escritas.length) desligar = true;
    }
    const gasto = this.uso.custo - antes;
    if (gasto > 0) await somarGastoDoDia(emReais(gasto));

    const execucao: Execucao = { em: Date.now(), ok, resumo: resultado.slice(0, 300), custo: gasto, ...(escritas.length ? { escritas } : {}) };
    let atualizada = registrarExecucao(rotina, execucao);
    if (desligar) atualizada = { ...atualizada, ativa: false, falhas: (rotina.falhas ?? 0) + 1 };
    this.rotinas = this.rotinas.map((x) => (x.id === rotina.id ? atualizada : x));
    await guardarRotinas(this.rotinas);
    await this.salvarSessao();
    if (rotina.avisar) await this.avisarRotina(atualizada, execucao, desligar);
    return true;
  }
```

Notas ao implementador:
- `criarMotor` existe em `main.ts:2165` com a assinatura `private criarMotor(mapa?: Pseudonimos): Motor`. Passa a ser `private criarMotor(mapa?: Pseudonimos, extra: Partial<InterfaceMotor> = {}): Motor`, e o objeto de `ui:` recebe `...extra` por último — é o que permite trocar só o `aprovarPlano` na rotina autônoma sem duplicar a montagem. As chamadas que já existem (`criarMotor()` e `criarMotor(Pseudonimos.importar(...))`) continuam valendo sem mudança.
- `ultimoTextoDoAgente()` é um auxiliar novo de uma linha: o último item da transcrição com `tipo: "agente"`, ou texto vazio.
- `avisarRotina` vem na Tarefa 5; até lá, deixar o método declarado devolvendo `Promise.resolve()` **não** vale: implementar a Tarefa 5 antes de dar a Tarefa 3 por concluída, ou inverter a ordem das duas.

- [ ] **Step 3: Varredura periódica com o painel aberto**

Em `iniciar()`, depois do `void this.rodarRotinas();` que já existe:

```ts
    // Com o painel aberto, a rotina horária precisa de alguém conferindo:
    // o alarme do navegador acorda o service worker, não esta página.
    setInterval(() => void this.rodarRotinas(), 5 * 60 * 1000);
```

- [ ] **Step 4: Rodar e provar**

Run: `cd agente-ia && npm run verificar && npm run tipos && npm run build`
Expected: PASS nos três.

Prova manual no Chrome for Testing (porta 9444): cadastrar uma rotina de leitura com frequência horária e `ultimaEm` antigo, abrir o painel com uma aba do SEI de treinamento ao lado e confirmar que a rotina roda uma vez, aparece na conversa e fica registrada na configuração com data e custo.

- [ ] **Step 5: Commit**

```bash
git add agente-ia/src/painel/main.ts dist/js/agente
git commit -m "Rotinas: execucao por alcance, com instrucoes por skill e historico

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Permissões no manifest

**Files:**
- Modify: os 12 `dist/manifest*.json`

**Interfaces:**
- Consumes: nada.
- Produces: `permissions` com `alarms`; `optional_permissions` com `notifications`.

- [ ] **Step 1: Alterar os 12 manifests por script**

```bash
cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro" && python3 - <<'PY'
import glob, json
for nome in sorted(glob.glob("dist/manifest*.json")):
    with open(nome, encoding="utf-8") as f: m = json.load(f)
    perms = m.setdefault("permissions", [])
    if "alarms" not in perms: perms.append("alarms")
    opc = m.setdefault("optional_permissions", [])
    if "notifications" not in opc: opc.append("notifications")
    with open(nome, "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(nome, perms, opc)
PY
node tools/patch-manifests.mjs
```

- [ ] **Step 2: Conferir**

Run: `python3 -c "import json,glob; [print(n, json.load(open(n))['permissions'], json.load(open(n)).get('optional_permissions')) for n in sorted(glob.glob('dist/manifest*.json'))]"`
Expected: `alarms` em todos os 12, `notifications` só em `optional_permissions`, e nenhum outro campo alterado.

- [ ] **Step 3: Commit**

```bash
git add dist/manifest.json
git commit -m "Manifest: permissao alarms e notifications opcional para as rotinas

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

(Os `manifest_*.json` não são versionados — `.gitignore`.)

---

### Task 5: Alarme, porta e notificação

**Files:**
- Modify: `dist/background.js`
- Modify: `agente-ia/src/painel/main.ts`

**Interfaces:**
- Consumes: `chrome.alarms`, `chrome.notifications`, `chrome.permissions`.
- Produces:
  - no background: alarme `rotina:<id>`, porta `agente-vivo`, mensagem `{ tipo: "rodarRotinas" }` ao painel, notificação `rotina-pendente:<id>`;
  - no painel: `App.sincronizarAlarmes()`, `App.avisarRotina(r, e, desligada)`, `App.pedirPermissaoDeAviso(): Promise<boolean>`.

- [ ] **Step 1: Acrescentar o alarme ao `background.js`**

No fim do arquivo, no estilo do que já está lá (sem acento cru, `var`/`function`):

```js
/******************************************************************************
 * Rotinas do Agente de IA: o alarme AVISA, o painel EXECUTA.
 *
 * A sessao do SEI e da aba do usuario, e a ponte liga o content script direto
 * ao painel: nao ha como consultar o SEI daqui. Entao, na hora marcada, se o
 * painel esta aberto (porta "agente-vivo"), pedimos que ele rode; se nao esta,
 * mostramos uma notificacao que ao ser clicada abre o agente.
 *
 * No Firefox nada disto roda: o manifest v2 do SEI Pro nao declara background.
 ******************************************************************************/
var portasDoAgente = [];

browser.runtime.onConnect.addListener(function (porta) {
  if (porta.name !== "agente-vivo") return;
  portasDoAgente.push(porta);
  porta.onDisconnect.addListener(function () {
    portasDoAgente = portasDoAgente.filter(function (p) { return p !== porta; });
  });
});

function avisarRotinaPendente(id, nome) {
  if (!browser.notifications || !browser.notifications.create) return;
  browser.notifications.create("rotina-pendente:" + id, {
    type: "basic",
    iconUrl: browser.runtime.getURL("icons/menu/botpro_icon.svg"),
    title: "Rotina pendente: " + nome,
    // "Abra o agente" e literal: a rotina so roda com o painel aberto.
    message: "Abra o Agente de IA para rodar esta rotina."
  }, function () { /* sem permissao de notificacao: nada a fazer */ });
}

if (browser.alarms && browser.alarms.onAlarm) {
  browser.alarms.onAlarm.addListener(function (alarme) {
    if (!alarme || alarme.name.indexOf("rotina:") !== 0) return;
    var id = alarme.name.slice("rotina:".length);
    if (portasDoAgente.length) {
      portasDoAgente.forEach(function (p) { p.postMessage({ tipo: "rodarRotinas", rotina: id }); });
      return;
    }
    browser.storage.local.get("agenteIA_rotinas").then(function (v) {
      var lista = (v && v.agenteIA_rotinas) || [];
      var r = lista.filter(function (x) { return x.id === id; })[0];
      if (r && r.ativa) avisarRotinaPendente(id, r.nome);
    });
  });
}

if (browser.notifications && browser.notifications.onClicked) {
  browser.notifications.onClicked.addListener(function (id) {
    if (id.indexOf("rotina") !== 0) return;
    browser.notifications.clear(id);
    // O clique na notificacao e gesto do usuario: serve para abrir o painel.
    if (typeof chrome !== "undefined" && chrome.sidePanel && chrome.sidePanel.open) {
      browser.tabs.query({ active: true, currentWindow: true }).then(function (abas) {
        if (abas && abas[0]) chrome.sidePanel.open({ tabId: abas[0].id }).catch(function () {
          browser.tabs.create({ url: browser.runtime.getURL("html/agente.html") });
        });
      });
    } else {
      browser.tabs.create({ url: browser.runtime.getURL("html/agente.html") });
    }
  });
}
```

- [ ] **Step 2: Registrar e ouvir no painel**

Em `main.ts`:

```ts
  /** Alarmes do navegador para as rotinas agendadas (o manual não tem alarme). */
  private async sincronizarAlarmes(): Promise<void> {
    if (!chrome.alarms?.create) return;
    const existentes = await chrome.alarms.getAll().catch(() => [] as chrome.alarms.Alarm[]);
    for (const a of existentes) if (a.name.startsWith("rotina:")) await chrome.alarms.clear(a.name);
    for (const r of this.rotinas) {
      if (!r.ativa || r.frequencia === "manual") continue;
      // Mínimo de 60 minutos: é o menor período que o Chrome aceita de forma
      // confiável, e a janela da rotina horária é exatamente essa.
      await chrome.alarms.create(`rotina:${r.id}`, { periodInMinutes: 60, delayInMinutes: 1 });
    }
  }
```

Chamar `void this.sincronizarAlarmes();` em `iniciar()` e depois de cada `guardarRotinas(...)`.

A porta e a mensagem:

```ts
    // O background avisa quando um alarme vence; executar é sempre aqui.
    try {
      const porta = chrome.runtime.connect({ name: "agente-vivo" });
      porta.onMessage.addListener((m: { tipo?: string }) => {
        if (m?.tipo === "rodarRotinas") void this.rodarRotinas();
      });
    } catch {
      /* sem background (Firefox): a varredura periódica cobre */
    }
```

- [ ] **Step 3: Notificação ao terminar e pedido de permissão**

```ts
  /** Avisa que a rotina terminou. Sem permissão de notificação, não faz nada. */
  private async avisarRotina(r: Rotina, e: Execucao, desligada: boolean): Promise<void> {
    if (!chrome.notifications?.create) return;
    const temPermissao = await chrome.permissions.contains({ permissions: ["notifications"] }).catch(() => false);
    if (!temPermissao) return;
    const primeiraLinha = e.resumo.split("\n").find((l) => l.trim()) ?? "";
    const corpo = desligada
      ? "A rotina foi desligada depois de uma falha ao alterar o SEI. Veja a conversa."
      : e.ok
        ? primeiraLinha.slice(0, 180) || "Terminou sem nada a relatar."
        : `Falhou: ${primeiraLinha.slice(0, 160)}`;
    chrome.notifications.create(`rotina-fim:${r.id}:${e.em}`, {
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/menu/botpro_icon.svg"),
      title: `Rotina: ${r.nome}`,
      message: corpo,
    });
  }

  /** Pede a permissão de notificação (exige gesto do usuário: vem do clique na caixa). */
  private async pedirPermissaoDeAviso(): Promise<boolean> {
    try {
      if (await chrome.permissions.contains({ permissions: ["notifications"] })) return true;
      return await chrome.permissions.request({ permissions: ["notifications"] });
    } catch {
      return false;
    }
  }
```

- [ ] **Step 4: Rodar, construir e provar**

Run: `cd agente-ia && npm run verificar && npm run tipos && npm run build`
Expected: PASS.

Prova manual no Chrome for Testing: com o painel aberto, `chrome.alarms.create("rotina:<id>", {delayInMinutes: 0.1})` pelo console da página do agente e confirmar que a rotina roda sem notificação; fechar o painel, repetir e confirmar a notificação de pendência, cujo clique abre o agente.

- [ ] **Step 5: Commit**

```bash
git add dist/background.js agente-ia/src/painel/main.ts dist/js/agente
git commit -m "Rotinas: alarme no background que avisa, e notificacao ao terminar

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Interface das rotinas

**Files:**
- Create: `agente-ia/src/painel/rotinas-ui.ts`
- Modify: `agente-ia/src/painel/main.ts` (remover `editarRotina` e a montagem da lista, que passam para o arquivo novo)
- Modify: `agente-ia/estatico/agente.css`

**Interfaces:**
- Consumes: `h`, `icone`; `App.abrirModal` (`main.ts:624`) passado como parâmetro `abrirModal: AbrirModal`, o mesmo tipo da interface dos conectores; `descreverFrequencia`, `descreverAlcance`, `DIAS`, `guardarRotinas`; `TOOLS_SEI` e `toolsMotor` (para a lista de tools de escrita autorizáveis).
- Produces:
  - `secaoRotinas(o: OpcoesRotinas): { elemento: HTMLElement; redesenhar(): void }`
  - `interface OpcoesRotinas { rotinas(): Rotina[]; definir(l: Rotina[]): Promise<void>; skills(): SkillUsuario[]; escritasDisponiveis(): Array<{ nome: string; efeito: Efeito }>; abrirModal: AbrirModal; rodarAgora(r: Rotina): void; pedirPermissaoDeAviso(): Promise<boolean> }`

- [ ] **Step 1: Mover a interface para o arquivo novo**

Levar para `rotinas-ui.ts` o que hoje está em `main.ts` entre a montagem de `listaRotinas` (por volta da linha 1062) e o fim de `editarRotina` (por volta da linha 1640), adaptando para receber tudo por `OpcoesRotinas` em vez de ler `this`. Nada de comportamento muda neste passo: é o recorte que deixa o cadastro novo caber sem engordar mais um arquivo de 2.600 linhas.

- [ ] **Step 2: Campos novos no cadastro**

No formulário:

- **Frequência**: as seis opções; `manual` esconde hora, dia da semana e dia do mês; `horaria` esconde a hora; `uteis` mostra só a hora, com a ajuda "de segunda a sexta — feriado não é considerado".
- **Instruções**: a caixa de texto que já existe, mais uma lista de skills com caixas de seleção (as de `o.skills()`), com a ajuda "o texto das skills escolhidas entra junto do pedido, como na conversa".
- **Alcance**: três rádios com o texto de `descreverAlcance`. Ao escolher `autonoma`, aparece (a) a confirmação obrigatória "Entendo que esta rotina vai alterar o SEI sem me pedir aprovação" e (b) a lista de tools de escrita (`o.escritasDisponiveis()` filtrando `efeito === "escrita"` — irreversíveis e de assinatura **não entram na lista**, com a nota "exclusão, cancelamento e assinatura nunca são feitos por rotina"). Salvar com `autonoma` sem nenhuma tool marcada é erro de formulário.
- **Avisar quando terminar**: caixa que, ao ser marcada, chama `o.pedirPermissaoDeAviso()`; recusada, a caixa volta a desmarcada e aparece a ajuda "o navegador não autorizou as notificações".
- **Teto por execução (R$)**: campo numérico opcional.
- **Rodar agora**: botão no formulário e na lista, chamando `o.rodarAgora(r)`.

- [ ] **Step 3: Lista**

Cada item mostra nome, `descreverFrequencia`, selo de alcance (destacado quando `autonoma`), a última execução ("ontem, R$ 0,04" ou "falhou") e, quando `ativa === false && falhas`, o aviso "desligada depois de uma falha ao alterar o SEI — religue quando quiser".

A nota da seção passa a dizer as duas coisas: que a rotina roda com o navegador aberto, e que no Firefox ela roda só com a barra lateral do agente aberta.

- [ ] **Step 4: Rodar, construir e provar**

Run: `cd agente-ia && npm run verificar && npm run tipos && npm run build`
Expected: PASS.

Prova manual no Chrome for Testing, com perfil limpo:
1. criar rotina de leitura horária → aparece na lista, roda, registra;
2. marcar "avisar quando terminar" → o navegador pede a permissão; **recusar** e confirmar que a caixa volta a desmarcada e a rotina continua funcionando (Review Focus 5);
3. criar rotina autônoma → exige a confirmação e ao menos uma tool; conferir que nenhuma tool irreversível ou de assinatura aparece na lista;
4. conferir no console que não há erro novo.

- [ ] **Step 5: Commit**

```bash
git add agente-ia/src/painel/rotinas-ui.ts agente-ia/src/painel/main.ts agente-ia/estatico/agente.css dist/js/agente dist/css/agente.css
git commit -m "Rotinas: cadastro com frequencias novas, skills, alcance e aviso

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Documentação e justificativa das lojas

**Files:**
- Modify: `pages/` (página do Agente de IA)
- Create: `<scratchpad>/justificativa-permissoes.md`

**Interfaces:**
- Consumes: nada.
- Produces: nada de código.

- [ ] **Step 1: Ajuda na página**

Acrescentar à página do Agente de IA a seção "Rotinas": o que é, as seis frequências, o que cada alcance faz, que o aviso é uma notificação do navegador, e a frase que não pode faltar — a rotina roda no seu navegador, com a sua sessão do SEI, quando o agente está aberto; não há servidor do SEI Pro agindo de madrugada.

- [ ] **Step 2: Justificativa das permissões**

Em `<scratchpad>/justificativa-permissoes.md`, escrever os dois textos para os formulários das lojas (limite de 1.000 caracteres cada, como o do `sidePanel`):

- **alarms**: agendar as rotinas que o próprio usuário cadastra, para avisá-lo na hora marcada; nenhum dado sai do navegador por causa dela.
- **notifications**: avisar que uma rotina terminou ou está pendente; é opcional e só é pedida quando o usuário marca "avisar quando terminar".

- [ ] **Step 3: Commit e entrega**

```bash
git add pages
git commit -m "Ajuda: secao de rotinas do Agente de IA

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Mostrar as duas justificativas na conversa: elas são necessárias no envio às lojas, junto da que já existe para o `sidePanel`.
