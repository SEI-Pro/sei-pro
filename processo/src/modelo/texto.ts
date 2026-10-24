/**
 * Regras de texto dos painéis, sem DOM: marcador com prazo, anotação com checklist e data, marcas de
 * especificação, observações, atribuição. São as mesmas regras do legado (`editDadosArvorePro_`, `sticknote*`,
 * `addUrgenteProcessoPro`), isoladas para teste.
 */

// RegExp por texto: o esbuild (charset ascii) deixaria o intervalo literal como bytes altos no bundle.
const MARCAS_DE_ACENTO = /[\u0300-\u036f]/g;

/** Sem acento (mantem a caixa e o tamanho do texto). */
export const semAcento = (s: string): string => s.normalize("NFD").replace(MARCAS_DE_ACENTO, "");

/** Para buscar e comparar: sem acento, sem caixa, espacos unicos. */
export const paraBusca = (s: string): string => semAcento(s).toLowerCase().replace(/\s+/g, " ").trim();

const dois = (n: number): string => String(n).padStart(2, "0");

// --- Marcador: "Ate dd/mm/aaaa hh:mm\ntexto" ----------------------------------------------------------------

export interface PrazoMarcador {
  /** aaaa-mm-dd (formato do `<input type=date>`). */
  data: string;
  /** hh:mm. */
  hora: string;
  /** "Até": controla o vencimento, em vez de só marcar uma data. */
  vencimento: boolean;
}

export interface TextoMarcador {
  prazo: PrazoMarcador | null;
  texto: string;
}

const DATA = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
const HORA = /(\d{1,2}):(\d{2})/;

/** Separa o texto livre do prazo que o SEI Pro grava no início do texto do marcador. */
export function separarTextoMarcador(bruto: string): TextoMarcador {
  const original = (bruto ?? "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .trim();
  const sem = semAcento(original);
  // Sem acento o texto mantém o tamanho (cada letra acentuada vira uma letra): os índices valem para os dois.
  const limpo = sem.length === original.length ? sem : original;
  const d = DATA.exec(limpo);
  if (!d) return { prazo: null, texto: original };
  const h = HORA.exec(limpo.slice(d.index + d[0].length)) ?? HORA.exec(limpo);
  const vencimento = /(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(limpo);
  const data = `${d[3]}-${dois(Number(d[2]))}-${dois(Number(d[1]))}`;
  const hora = h ? `${dois(Number(h[1]))}:${h[2]}` : "23:59";
  // O SEI Pro grava o prazo no começo ("Ate 25/10/2026 23:59\ntexto"); em texto antigo ele pode estar no meio.
  const trecho = /(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(limpo);
  const texto = trecho
    ? `${original.slice(0, trecho.index)} ${original.slice(trecho.index + trecho[0].length)}`.replace(/[ \t]{2,}/g, " ").trim()
    : original;
  return { prazo: { data, hora, vencimento }, texto };
}

export function comporTextoMarcador(t: TextoMarcador): string {
  const texto = t.texto.trim();
  if (!t.prazo) return texto;
  const [a, m, d] = t.prazo.data.split("-");
  const quando = `${t.prazo.vencimento ? "Ate " : ""}${d}/${m}/${a} ${t.prazo.hora || "23:59"}`;
  return texto ? `${quando}\n${texto}` : quando;
}

export type NivelPrazo = "ok" | "atencao" | "vencido";

export interface SituacaoPrazo {
  rotulo: string;
  nivel: NivelPrazo;
}

const MS_DIA = 86_400_000;

/** "em 3 dias", "hoje", "vencido há 2 dias": como o prazo do marcador se apresenta ao usuário. */
export function situacaoDoPrazo(p: PrazoMarcador, agora: Date): SituacaoPrazo {
  const [a, m, d] = p.data.split("-").map(Number);
  const [hh, mm] = p.hora.split(":").map(Number);
  const alvo = new Date(a ?? 1970, (m ?? 1) - 1, d ?? 1, hh ?? 23, mm ?? 59);
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const dia = new Date(alvo.getFullYear(), alvo.getMonth(), alvo.getDate());
  const dias = Math.round((dia.getTime() - hoje.getTime()) / MS_DIA);
  if (dias === 0)
    return {
      rotulo: alvo.getTime() < agora.getTime() && p.vencimento ? "venceu hoje" : "hoje",
      nivel: alvo.getTime() < agora.getTime() && p.vencimento ? "vencido" : "atencao",
    };
  if (dias > 0) return { rotulo: dias === 1 ? "amanhã" : `em ${dias} dias`, nivel: dias <= 2 ? "atencao" : "ok" };
  return { rotulo: dias === -1 ? "ontem" : `há ${-dias} dias`, nivel: p.vencimento ? "vencido" : "atencao" };
}

export function dataBrasileira(p: PrazoMarcador): string {
  const [a, m, d] = p.data.split("-");
  return `${d}/${m}/${a}`;
}

// --- Prazo nativo do SEI (CONTROLEPRAZO) ---------------------------------------------------------------------

export interface PrazoNativo {
  data: string;
  estado: string;
  nivel: NivelPrazo | "concluido";
}

/**
 * Controle de prazo nativo (SEI 4.1.5+), que a árvore declara no script da página:
 * `infraArvoreAcao("CONTROLEPRAZO", ...)` com título "Controle de Prazo:\nSIGLA dd/mm/aaaa (10 dias | atrasado N dias | ...)".
 * Sem requisição.
 */
export function prazoNativoDaPagina(html: string): PrazoNativo | null {
  const acao = /infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(
    html,
  );
  if (!acao?.[1]) return null;
  const m = /(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(acao[1].replace(/\\n/g, " "));
  if (!m?.[1] || m[2] === undefined) return null;
  const estado = m[2].toLowerCase();
  const nivel = estado.startsWith("atrasado") ? "vencido" : estado.startsWith("conclu") ? "concluido" : "ok";
  return { data: m[1], estado: m[2], nivel };
}

// --- Anotação: texto com checklist e data -------------------------------------------------------------------

export const LIMITE_ANOTACAO = 500;

export interface LinhaAnotacao {
  texto: string;
  /** null = linha comum; "aberto" = `[ ]`; "feito" = `[X]`. */
  marca: null | "aberto" | "feito";
}

const MARCA = /^\s*\[( |x|X)\]\s?/;

export function linhasDaAnotacao(texto: string): LinhaAnotacao[] {
  return texto
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => {
      const m = MARCA.exec(l);
      if (!m) return { texto: l, marca: null };
      return { texto: l.slice(m[0].length), marca: m[1] === " " ? "aberto" : "feito" };
    });
}

export function juntarLinhas(linhas: LinhaAnotacao[]): string {
  return linhas.map((l) => (l.marca === null ? l.texto : `${l.marca === "feito" ? "[X]" : "[ ]"} ${l.texto}`)).join("\n");
}

/** Marca ou desmarca o item de checklist da linha `i`. Linha comum não muda. */
export function alternarItem(texto: string, i: number): string {
  const l = linhasDaAnotacao(texto);
  const alvo = l[i];
  if (!alvo || alvo.marca === null) return texto;
  alvo.marca = alvo.marca === "aberto" ? "feito" : "aberto";
  return juntarLinhas(l);
}

/** Transforma as linhas `de..ate` em checklist (ou volta a texto comum, se todas já eram). */
export function alternarChecklist(texto: string, de: number, ate: number): string {
  const l = linhasDaAnotacao(texto);
  const faixa = l.slice(de, ate + 1);
  const todas = faixa.length > 0 && faixa.every((x) => x.marca !== null);
  for (const x of faixa) x.marca = todas ? null : (x.marca ?? "aberto");
  return juntarLinhas(l);
}

export function dataDaAnotacao(texto: string): string | null {
  const m = DATA.exec(semAcento(texto));
  return m ? `${dois(Number(m[1]))}/${dois(Number(m[2]))}/${m[3]}` : null;
}

/** Troca a primeira data do texto (dd/mm/aaaa) ou, se não houver, acrescenta no fim. `data` vem como aaaa-mm-dd. */
export function definirDataNaAnotacao(texto: string, data: string): string {
  const [a, m, d] = data.split("-");
  const nova = `${d}/${m}/${a}`;
  if (DATA.test(texto)) return texto.replace(DATA, nova);
  return texto.trim() ? `${texto.replace(/\s+$/, "")} ${nova}` : nova;
}

/** Data da anotação em aaaa-mm-dd (para o `<input type=date>`), ou null. */
export function dataIsoDaAnotacao(texto: string): string | null {
  const br = dataDaAnotacao(texto);
  if (!br) return null;
  const [d, m, a] = br.split("/");
  return `${a}-${m}-${d}`;
}

// --- Especificação: (URGENTE) e (TRANCADO) --------------------------------------------------------------------

export type MarcaEspecificacao = "URGENTE" | "TRANCADO";

export function temMarca(texto: string, marca: MarcaEspecificacao): boolean {
  return texto.toLowerCase().includes(`(${marca.toLowerCase()})`);
}

/** Acrescenta a marca no fim ou a retira (mesma regra do legado). */
export function alternarMarca(texto: string, marca: MarcaEspecificacao): string {
  if (!temMarca(texto, marca)) return `${texto} (${marca})`.trim();
  return texto
    .replace(new RegExp(`\\(${marca}\\)`, "ig"), "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// --- Observações ----------------------------------------------------------------------------------------------

export interface ObservacaoUnidade {
  unidade: string;
  observacao: string;
}

/** Linhas que começam com `#` são etiquetas (`#tag: valor`) e não aparecem como observação. */
export function semEtiquetas(texto: string): string {
  return texto
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((l) => l.trim().charAt(0) !== "#")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

export function observacoesVisiveis(propria: string, siglaUnidade: string, outras: ObservacaoUnidade[]): ObservacaoUnidade[] {
  const lista = [
    { unidade: siglaUnidade, observacao: semEtiquetas(propria) },
    ...outras.map((o) => ({ unidade: o.unidade, observacao: semEtiquetas(o.observacao) })),
  ];
  return lista.filter((o) => o.observacao);
}

// --- Acompanhamento especial: reabertura programada --------------------------------------------------------

/** "dd/mm/aaaa hh:mm" a partir do `<input type=datetime-local>` ("aaaa-mm-ddThh:mm"). */
export function reaberturaBrasileira(local: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(local);
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : "";
}

/** O inverso: do texto gravado para o `<input type=datetime-local>`. */
export function reaberturaParaCampo(br: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(br);
  return m ? `${m[3]}-${m[2]}-${m[1]}T${m[4] ?? "00"}:${m[5] ?? "00"}` : "";
}

export function comporObservacaoAcompanhamento(texto: string, reabertura: string | null): string {
  const base = texto.trim();
  if (!reabertura) return base;
  return `${base} ["Reabertura": "${reabertura}"]`.trim().slice(0, 500);
}

// --- Atribuição ------------------------------------------------------------------------------------------------

/** Atualiza a linha "(atribuído para fulano)" depois de uma troca, já que a árvore da tela não se refaz. */
export function textoComAtribuicao(texto: string, sigla: string | null): string {
  const grupo = /\s*\(atribu.do para [^)]*\)/i;
  if (sigla === null) return texto.replace(grupo, "");
  if (grupo.test(texto)) return texto.replace(grupo, ` (atribuído para ${sigla})`);
  return texto.replace(/(\.?)\s*$/, ` (atribuído para ${sigla})$1`);
}

// --- Interessados -----------------------------------------------------------------------------------------------

/** "Fulano (CPF 000...)" vira ["Fulano", "CPF 000..."]: o legado mostra cada parte copiável. */
export function partesDoInteressado(nome: string): string[] {
  if (!nome.includes("(")) return [nome.trim()];
  return nome
    .split("(")
    .map((p) =>
      p
        .trim()
        .replace(/\)\s*$/, "")
        .replace(")", "")
        .trim(),
    )
    .filter(Boolean);
}
