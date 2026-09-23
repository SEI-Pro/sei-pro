/**
 * Roda os casos de avaliação contra um modelo de verdade.
 *
 *   CHAVE_IA=sk-or-v1-... npm run evals
 *   CHAVE_IA=... MODELO=openai/gpt-5 SERVICO=openrouter npm run evals
 *
 * Custa dinheiro (cada caso é uma conversa), então não entra no `verificar`.
 * O lugar disto é antes de publicar uma versão e depois de trocar o modelo
 * padrão ou mexer no prompt.
 */

import { Pseudonimos } from "@nucleo/privacidade/anonimizar";
import { Motor } from "../src/motor/motor";
import { criarProvedor, MODELO_PADRAO, type Servico } from "../src/motor/provedor";
import { promptSistema } from "../src/motor/prompt";
import { RegistroTools } from "../src/motor/tools";
import type { InterfaceMotor, PlanoPrevisto, Uso } from "../src/motor/tipos";
import { TOOLS_SEI } from "../src/tools/sei";
import { toolsMotor } from "../src/tools/motor";
import { CASOS, CASOS_FLUXO, TELA_BASE, type Caso, type CasoFluxo } from "./casos";
import { inferirFluxo } from "../src/fluxos/inferir";
import { normalizar } from "../src/fluxos/modelo";

const chave = process.env.CHAVE_IA ?? "";
const servico = (process.env.SERVICO ?? "openrouter") as Servico;
const modelo = process.env.MODELO ?? MODELO_PADRAO;

if (!chave) {
  console.error("Informe a chave: CHAVE_IA=... npm run evals");
  process.exit(1);
}

interface Registro {
  tools: string[];
  planos: PlanoPrevisto[];
  perguntas: string[];
  texto: string;
  uso: Uso;
}

function interfaceDeTeste(r: Registro): InterfaceMotor {
  return {
    texto: (d) => (r.texto += d),
    fimDaResposta: () => undefined,
    toolIniciada: (_id, nome) => r.tools.push(nome),
    toolTerminada: () => undefined,
    // Nada é aprovado: o que se mede é se o agente PEDIU aprovação.
    aprovarPlano: async (p) => (r.planos.push(p), { aprovado: false, motivo: "avaliação: nada é aplicado" }),
    progressoPlano: () => undefined,
    consentir: async () => true,
    perguntar: async (pergunta) => (r.perguntas.push(pergunta), "não sei, decida você"),
    tarefas: () => undefined,
    uso: (u) => (r.uso = u),
    aviso: (t) => (r.texto += `\n[aviso] ${t}`),
  };
}

async function rodarCaso(caso: Caso): Promise<{ ok: boolean; falhas: string[]; reg: Registro }> {
  const reg: Registro = { tools: [], planos: [], perguntas: [], texto: "", uso: { entrada: 0, saida: 0, custo: 0 } };
  const privacidade = new Pseudonimos({ nomes: true, cnpj: false });
  const motor = new Motor({
    provedor: criarProvedor({ servico, chave, modelo }),
    tools: new RegistroTools([...TOOLS_SEI, ...toolsMotor()]),
    privacidade,
    ui: interfaceDeTeste(reg),
    limitePassos: 10,
    sistema: (tela) => promptSistema(tela, new Date(2026, 8, 23)),
    tela: async () => ({ ...TELA_BASE, ...caso.tela }),
    sei: async (op) => {
      const resposta = caso.sei?.[op];
      if (resposta === undefined) return {};
      if (typeof resposta === "object" && resposta !== null && "__erro" in resposta) throw new Error(String((resposta as { __erro: string }).__erro));
      return resposta;
    },
  });
  await motor.enviar(caso.pergunta);

  const falhas: string[] = [];
  const e = caso.espera;
  for (const t of e.chama ?? []) if (!reg.tools.includes(t)) falhas.push(`nao chamou ${t} (chamou: ${reg.tools.join(", ") || "nada"})`);
  for (const t of e.naoChama ?? []) if (reg.tools.includes(t)) falhas.push(`chamou ${t}, que nao devia`);
  if (e.texto && !e.texto.test(reg.texto)) falhas.push(`o texto nao casa ${e.texto}`);
  if (e.textoNao && e.textoNao.test(reg.texto)) falhas.push(`o texto casa o que era proibido ${e.textoNao}`);
  if (e.pedeAprovacao && !reg.planos.length) falhas.push("nao pediu aprovacao para escrever");
  // Pedir esclarecimento pela ferramenta `perguntar` ou terminar a resposta com
  // uma pergunta são a mesma coisa para quem usa; o que não pode é agir no
  // escuro. O critério mede o comportamento, não o caminho.
  if (e.pergunta && !reg.perguntas.length && !/\?\s*$/.test(reg.texto.trim())) falhas.push("nao pediu esclarecimento (nem por ferramenta, nem no texto)");
  return { ok: !falhas.length, falhas, reg };
}

/**
 * Caso do Estúdio de Fluxo: uma chamada só, com os metadados de um processo
 * modelo. Mede se o modelo separa etapa do rito de documento acessório.
 */
async function rodarCasoFluxo(caso: CasoFluxo): Promise<{ ok: boolean; falhas: string[]; texto: string; uso: Uso }> {
  const r = await inferirFluxo(criarProvedor({ servico, chave, modelo }), caso.modelos, new AbortController().signal);
  const etapas = r.fluxo.etapas;
  // A etapa "é sobre" um termo quando o nome ou qualquer variação do título o contém.
  const fala = (termo: string) => etapas.some((e) => [e.nome, ...e.documento.tituloContem].some((t) => normalizar(t).includes(normalizar(termo))));
  const falhas: string[] = [];
  for (const t of caso.espera.etapas) if (!fala(t)) falhas.push(`nao criou etapa para "${t}"`);
  for (const t of caso.espera.naoEtapas) if (fala(t)) falhas.push(`criou etapa para "${t}", que e documento acessorio`);
  if (caso.espera.maxEtapas && etapas.length > caso.espera.maxEtapas) falhas.push(`${etapas.length} etapas, teto era ${caso.espera.maxEtapas}`);
  return { ok: !falhas.length, falhas, texto: etapas.map((e) => e.nome).join(" > "), uso: r.uso ?? { entrada: 0, saida: 0, custo: 0 } };
}

const so = process.argv[2];
const escolhidos = so ? CASOS.filter((c) => c.nome.includes(so)) : CASOS;
const escolhidosFluxo = so ? CASOS_FLUXO.filter((c) => c.nome.includes(so)) : CASOS_FLUXO;
console.log(`Avaliando ${escolhidos.length + escolhidosFluxo.length} caso(s) com ${modelo} (${servico})\n`);

let passou = 0;
let custo = 0;
const comeco = Date.now();
for (const caso of escolhidos) {
  const t = Date.now();
  try {
    const r = await rodarCaso(caso);
    custo += r.reg.uso.custo;
    if (r.ok) {
      passou += 1;
      console.log(`  ok    ${caso.nome} (${((Date.now() - t) / 1000).toFixed(1)}s)`);
    } else {
      console.log(`  FALHA ${caso.nome}`);
      for (const f of r.falhas) console.log(`        ${f}`);
      console.log(`        resposta: ${r.reg.texto.replace(/\s+/g, " ").slice(0, 200)}`);
    }
  } catch (erro) {
    console.log(`  ERRO  ${caso.nome}: ${(erro as Error).message}`);
  }
}
for (const caso of escolhidosFluxo) {
  const t = Date.now();
  try {
    const r = await rodarCasoFluxo(caso);
    custo += r.uso.custo;
    if (r.ok) {
      passou += 1;
      console.log(`  ok    ${caso.nome} (${((Date.now() - t) / 1000).toFixed(1)}s) \u2014 ${r.texto}`);
    } else {
      console.log(`  FALHA ${caso.nome}`);
      for (const f of r.falhas) console.log(`        ${f}`);
      console.log(`        proposta: ${r.texto}`);
    }
  } catch (erro) {
    console.log(`  ERRO  ${caso.nome}: ${(erro as Error).message}`);
  }
}

const total = escolhidos.length + escolhidosFluxo.length;
console.log(
  `\n${passou}/${total} casos \u00b7 ${((Date.now() - comeco) / 1000).toFixed(0)}s \u00b7 US$ ${custo.toFixed(4)}`,
);
process.exit(passou === total ? 0 : 1);
