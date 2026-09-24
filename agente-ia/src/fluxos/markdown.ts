/**
 * Fluxo em Markdown: o formato que vai para a pasta do GitHub da equipe.
 *
 * Serve a dois leitores ao mesmo tempo. A extensão o interpreta, e a PESSOA
 * abre o arquivo no GitHub para conferir, comentar e editar — que é a razão de
 * o fluxo da equipe morar num repositório. Por isso não é JSON num bloco de
 * código: é texto que se lê, com um `##` por etapa.
 *
 * A ida e volta é sem perda. Se um campo se perdesse no caminho, a equipe
 * publicaria um fluxo e receberia outro de volta, sem aviso nenhum.
 *
 * O que NÃO atravessa, de propósito: o `ativo` e os ids. Fluxo que chega de
 * fora nasce DESLIGADO (precedente não é norma, e fluxo de outra unidade menos
 * ainda), e os ids são refeitos — id de outro navegador não significa nada
 * aqui, e o desvio é reancorado pelo NOME da etapa.
 */

import { etapaNova, fluxoNovo, type Etapa, type Fluxo } from "./modelo";

const SIM = "sim";
const NAO = "não";

const lista = (v: string[] | undefined): string => (v ?? []).join(" | ");

function campos(e: Etapa, nomePorId: Map<string, string>): string[] {
  const l = [`- documento: ${lista(e.documento.tituloContem)}`];
  if (e.documento.assinado !== undefined) l.push(`- assinado: ${e.documento.assinado ? SIM : NAO}`);
  if (e.documento.daMinhaUnidade) l.push(`- da minha unidade: ${SIM}`);
  if (!e.obrigatoria) l.push(`- obrigatória: ${NAO}`);
  if (e.prazoDias) l.push(`- prazo: ${e.prazoDias} dias`);
  if (e.acao) {
    l.push(`- ação: ${e.acao.titulo}`);
    l.push(`- pedido: ${e.acao.pedido.replace(/\s*\n\s*/g, " ")}`);
  }
  // O desvio aponta pelo NOME da etapa: id de outro navegador não diz nada a
  // quem lê o arquivo, nem a quem o importa.
  if (e.condicao) l.push(`- desvio: se o título anterior contiver "${e.condicao.seDocumentoContem}", ir para "${nomePorId.get(e.condicao.entaoIrPara) ?? e.condicao.entaoIrPara}"`);
  return l;
}

export function paraMarkdown(f: Fluxo): string {
  const nomePorId = new Map(f.etapas.map((e) => [e.id, e.nome]));
  const cabeca: string[] = [`# ${f.nome}`, ""];
  if (f.descricao?.trim()) cabeca.push(f.descricao.trim(), "");
  const alcance: string[] = [];
  if (f.aplicaSe.tipoProcessoContem?.length) alcance.push(`- aplica-se a: ${lista(f.aplicaSe.tipoProcessoContem)}`);
  if (f.aplicaSe.marcador?.length) alcance.push(`- marcador: ${lista(f.aplicaSe.marcador)}`);
  if (f.aplicaSe.unidade?.length) alcance.push(`- unidade: ${lista(f.aplicaSe.unidade)}`);
  if (alcance.length) cabeca.push(...alcance, "");
  const etapas = f.etapas.map((e, i) => [`## ${i + 1}. ${e.nome}`, ...campos(e, nomePorId), ""].join("\n"));
  return [...cabeca, ...etapas].join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

const partes = (v: string): string[] =>
  v
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);

const ehSim = (v: string): boolean => /^(sim|s|true|1)$/i.test(v.trim());
const ehNao = (v: string): boolean => /^(n[aã]o|n|false|0)$/i.test(v.trim());

/** `- campo: valor` de um bloco, na ordem em que aparecem. */
function bullets(bloco: string): Array<[string, string]> {
  const saida: Array<[string, string]> = [];
  for (const linha of bloco.split("\n")) {
    const m = /^\s*[-*]\s*([^:]+):\s*(.*)$/.exec(linha);
    if (m) saida.push([m[1].trim().toLowerCase(), m[2].trim()]);
  }
  return saida;
}

/** Lê o arquivo de fluxo. Lança quando não dá para aproveitar nada. */
export function deMarkdown(texto: string): Fluxo {
  const limpo = texto.replace(/\r/g, "");
  const nome = /^#\s+(.+)$/m.exec(limpo)?.[1]?.trim();
  if (!nome) throw new Error("O arquivo precisa começar com o nome do fluxo numa linha \"# Nome do fluxo\".");

  const blocos = limpo.split(/^##\s+/m);
  const cabeca = blocos[0];
  const f: Fluxo = { ...fluxoNovo(nome), origem: "colecao", ativo: false };

  // Descrição: o primeiro parágrafo solto do cabeçalho (nem título, nem bullet).
  const descricao = cabeca
    .split("\n")
    .slice(1)
    .filter((l) => l.trim() && !/^\s*[-*]\s/.test(l) && !/^#/.test(l))
    .join(" ")
    .trim();
  if (descricao) f.descricao = descricao;

  for (const [campo, valor] of bullets(cabeca)) {
    if (/aplica|tipo/.test(campo)) f.aplicaSe.tipoProcessoContem = partes(valor);
    else if (/marcador/.test(campo)) f.aplicaSe.marcador = partes(valor);
    else if (/unidade/.test(campo)) f.aplicaSe.unidade = partes(valor);
  }

  const desvios: Array<{ etapa: Etapa; contem: string; paraNome: string }> = [];
  for (const bloco of blocos.slice(1)) {
    const titulo = (bloco.split("\n")[0] ?? "").replace(/^\d+[.)]\s*/, "").trim();
    if (!titulo) continue;
    const e = etapaNova(titulo);
    e.documento = { tituloContem: [] };
    for (const [campo, valor] of bullets(bloco)) {
      if (/documento|título|titulo/.test(campo)) e.documento.tituloContem = partes(valor);
      else if (/assinado/.test(campo)) e.documento.assinado = ehSim(valor) ? true : ehNao(valor) ? false : undefined;
      else if (/minha unidade/.test(campo)) e.documento.daMinhaUnidade = ehSim(valor) || undefined;
      else if (/obrigat/.test(campo)) e.obrigatoria = !ehNao(valor);
      else if (/prazo/.test(campo)) e.prazoDias = Number(/\d+/.exec(valor)?.[0] ?? 0) || undefined;
      else if (/ação|acao/.test(campo)) e.acao = { titulo: valor, pedido: e.acao?.pedido ?? "" };
      else if (/pedido/.test(campo)) e.acao = { titulo: e.acao?.titulo || `Preparar ${titulo}`, pedido: valor };
      else if (/desvio/.test(campo)) {
        const m = /contiver\s+"([^"]+)"[^"]*"([^"]+)"/i.exec(valor) ?? /"([^"]+)".*?"([^"]+)"/.exec(valor);
        if (m) desvios.push({ etapa: e, contem: m[1], paraNome: m[2] });
      }
    }
    // Ação pela metade não vira ação: o cartão mostraria um botão que não faz nada.
    if (e.acao && !e.acao.pedido.trim()) e.acao = undefined;
    // Etapa sem documento nunca casaria com a árvore: fica de fora.
    if (e.documento.tituloContem.length) f.etapas.push(e);
  }
  if (!f.etapas.length) throw new Error(`O fluxo "${nome}" não tem etapa nenhuma com documento (cada etapa precisa de "- documento: ...").`);

  const porNome = new Map(f.etapas.map((e) => [e.nome.toLowerCase(), e.id]));
  for (const d of desvios) {
    const destino = porNome.get(d.paraNome.toLowerCase());
    if (destino && destino !== d.etapa.id) d.etapa.condicao = { seDocumentoContem: d.contem, entaoIrPara: destino };
  }
  return f;
}
