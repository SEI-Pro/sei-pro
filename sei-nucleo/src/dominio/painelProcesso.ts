/**
 * Leituras para os painéis abaixo da árvore do processo (Anotações, Acompanhamento Especial, Processos
 * Relacionados, Atribuição, Bloco Interno).
 *
 * Todas SEM efeito colateral: ou só leem a página da árvore que o quadro já tem (sem rede), ou fazem um GET
 * do link assinado que essa árvore oferece. Nenhuma busca a árvore do processo de novo: buscar
 * `procedimento_visualizar` de processo aberto na unidade grava "Processo recebido" em nome do usuário.
 *
 * Substitui no legado: `getDadosAnotacao` (anotação pelo iframe oculto), a leitura do acompanhamento especial
 * pela lista paginada da unidade inteira (`getListAcompanhamentoEspecial`), a leitura de `Nos[0].html` e dos
 * `#divRelacionados*` pelo painel (`setDadosProcessoArvore`) e `getBlocoProcessoHistorico`.
 *
 * Bloco interno: não existe tela barata e sem efeito colateral que diga em que bloco o processo está (só o
 * andamento "Processo inserido no bloco interno" do histórico). `blocoInternoDoHistorico` aplica a regra do
 * legado a andamentos que quem chama já coletou; o painel não busca o histórico sozinho.
 */

import { acaoNaArvore, type Arvore } from "./arvore";
import type { Andamento } from "./historico";
import { hipotesesDoFormulario } from "./escrita";
import { Formulario, type ItemLupa } from "../formulario/formulario";
import { linkDaAcao } from "../links/links";
import { lerString } from "../sessao/literais";
import { analisarHtml, textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Http, OpcoesHttp, Pagina } from "../sessao/http";
import { lerContexto, type Sei } from "../sei";

function linkObrigatorio(arv: Arvore, acao: string, nome: string): string {
  const l = acaoNaArvore(arv, acao);
  if (!l) {
    throw new ErroSei(
      "SEI_ACAO_INDISPONIVEL",
      `"${nome}" não está disponível no processo ${arv.protocolo} (processo fechado na unidade ou sem permissão).`,
    );
  }
  return l;
}

// --- Anotação -----------------------------------------------------------------------------------------------

export interface AnotacaoProcesso {
  texto: string;
  prioridade: boolean;
}

/**
 * Anotação da unidade no processo (GET do formulário `anotacao_registrar` que a barra do processo oferece).
 * `null` = o processo não tem anotação (estado vazio, não erro). Lança `SEI_ACAO_INDISPONIVEL` se a árvore não
 * oferece a ação (processo fechado na unidade): quem desenha o painel deve conferir `acaoNaArvore` antes.
 */
export async function lerAnotacao(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<AnotacaoProcesso | null> {
  const form = await Formulario.abrir(http, linkObrigatorio(arv, "anotacao_registrar", "Anotações"), "#frmAnotacaoCadastro", op);
  const texto = (form.valor("txaDescricao") ?? "").replace(/\r\n?/g, "\n").trim();
  if (!texto) return null;
  return { texto, prioridade: form.valor("chkSinPrioridade") !== undefined };
}

// --- Acompanhamento especial --------------------------------------------------------------------------------

export interface AcompanhamentoProcesso {
  /** id do acompanhamento (para alterar/excluir). */
  id?: string;
  grupo?: string;
  /** Observação sem o trecho `["Reabertura": "..."]` que o SEI Pro acrescenta. */
  observacao?: string;
  /** Texto como está gravado no SEI (com o trecho de reabertura), para regravar sem perder a configuração. */
  observacaoBruta?: string;
  /** Reabertura programada (`dd/mm/aaaa hh:mm`). */
  reabertura?: string;
}

const REABERTURA = /\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;

function montarAcompanhamento(id: string | undefined, grupo: string, bruta: string): AcompanhamentoProcesso {
  const r = REABERTURA.exec(bruta);
  const observacao = bruta.replace(REABERTURA, "").trim();
  const saida: AcompanhamentoProcesso = {};
  if (id) saida.id = id;
  if (grupo) saida.grupo = grupo;
  if (observacao) saida.observacao = observacao;
  if (bruta) saida.observacaoBruta = bruta;
  if (r) saida.reabertura = r[1];
  return saida;
}

function lerListaDeAcompanhamentos(pagina: Pagina): AcompanhamentoProcesso | null | undefined {
  const tabela = [...pagina.doc.querySelectorAll("table")].find((t) => /Grupo/i.test(textoDe(t.querySelector("th, tr")) || t.textContent || ""));
  if (!tabela) return undefined;
  const cabecalho = [...tabela.querySelectorAll("th")].map((th) => textoDe(th).toLowerCase());
  const iGrupo = cabecalho.findIndex((c) => c.startsWith("grupo"));
  const iObs = cabecalho.findIndex((c) => c.startsWith("observa"));
  if (iGrupo < 0 || iObs < 0) return undefined;
  const linha = [...tabela.querySelectorAll("tr")].find((tr) => tr.querySelectorAll("td").length > iObs);
  if (!linha) return null;
  const td = [...linha.querySelectorAll("td")];
  const id = linha.querySelector("input[type=checkbox]")?.getAttribute("value") ?? /id_acompanhamento=(\d+)/.exec(linha.innerHTML ?? "")?.[1] ?? undefined;
  return montarAcompanhamento(id || undefined, textoDe(td[iGrupo]), textoDe(td[iObs]));
}

/**
 * Acompanhamento especial DESTE processo na unidade: um GET do link `acompanhamento_gerenciar` da barra do
 * processo, em vez de ler a lista paginada da unidade inteira. A tela responde de três jeitos, todos tratados:
 * lista do processo (há acompanhamento; no SEI 5 e no 4.1), formulário de cadastro vazio (o SEI redireciona
 * quando não há nenhum) e formulário de alteração (hdnIdAcompanhamento preenchido). `null` = sem acompanhamento.
 */
export async function lerAcompanhamento(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<AcompanhamentoProcesso | null> {
  const tela = await http.obter(linkObrigatorio(arv, "acompanhamento_gerenciar", "Acompanhamento Especial"), { ...op, aceitarValidacao: true });
  if (tela.doc.querySelector("#frmAcompanhamentoCadastro")) {
    const f = Formulario.de(tela, "#frmAcompanhamentoCadastro");
    const id = f.valor("hdnIdAcompanhamento");
    if (!id) return null;
    const grupo = f.opcoes("selGrupoAcompanhamento").find((o) => o.valor === f.valor("selGrupoAcompanhamento") && o.valor !== "null")?.texto ?? "";
    return montarAcompanhamento(id, grupo.trim(), (f.valor("txaObservacao") ?? "").trim());
  }
  const lista = lerListaDeAcompanhamentos(tela);
  if (lista === undefined) {
    throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela de acompanhamento especial não é a lista nem o formulário esperados.", textoDe(tela.doc.querySelector("title")));
  }
  return lista;
}

// --- Processos relacionados ---------------------------------------------------------------------------------

export interface ProcessoRelacionado {
  protocolo: string;
  /** Tipo do processo relacionado (o título do grupo, sem a contagem). */
  tipo: string;
  descricao?: string;
  /** Link assinado do SEI para abrir o processo (use-o como veio). */
  link: string;
  /** Aberto em alguma unidade (verde) ou concluído (vermelho); ausente se a tela não diz. */
  aberto?: boolean;
}

function situacao(a: Element): boolean | undefined {
  const cls = a.getAttribute("class") ?? "";
  const cor = (a.getAttribute("style") ?? "").toLowerCase();
  if (/text-success/.test(cls) || cor.includes("#05a381")) return true;
  if (/text-danger/.test(cls) || cor.includes("#ff4545")) return false;
  return undefined;
}

/** Processos relacionados que a árvore já traz no HTML (`#divRelacionadosParciais`). Sem rede. */
export function lerRelacionados(arv: Arvore): ProcessoRelacionado[] {
  const doc = arv.pagina.doc;
  const saida: ProcessoRelacionado[] = [];
  [...doc.querySelectorAll("a.ancoraRelacionadosParcial")].forEach((ancora, ordem) => {
    const indice = /visualizacaoRelacionados\((\d+)\)/.exec(ancora.getAttribute("onclick") ?? "")?.[1] ?? String(ordem);
    const tipo = textoDe(ancora).replace(/\s*\(\d+\)\s*$/, "");
    const grupo = doc.getElementById(`divRelacionadosParcial${indice}`);
    for (const card of grupo ? [...grupo.querySelectorAll(".cardRelacionado")] : []) {
      const a = card.querySelector(".cardTitleRelacionado a");
      const protocolo = textoDe(a);
      if (!a || !protocolo) continue;
      const rel: ProcessoRelacionado = { protocolo, tipo, link: (a.getAttribute("href") ?? "").replace(/&amp;/g, "&") };
      const descricao = textoDe(card.querySelector(".card-text"));
      if (descricao) rel.descricao = descricao;
      const aberto = situacao(a);
      if (aberto !== undefined) rel.aberto = aberto;
      saida.push(rel);
    }
  });
  return saida;
}

// --- Atribuição -----------------------------------------------------------------------------------------------

export interface LinhaAtribuicao {
  texto: string;
  unidade: string;
  /** Sigla (login) do usuário a quem a unidade atribuiu o processo. */
  usuario: string | null;
  nomeUsuario?: string;
}

export interface AtribuicaoDaPagina {
  /** Usuário atribuído NA unidade atual (sigla/login); `null` = ninguém, ou não se sabe qual é a unidade atual. */
  usuario: string | null;
  nomeUsuario?: string;
  /** A unidade atual tem o processo aberto (a barra oferece "Consultar/Alterar Processo"). */
  unidadeAberta: boolean;
  /** A mensagem do SEI sobre onde o processo está aberto, em texto, uma linha por unidade. */
  texto: string;
  linhas: LinhaAtribuicao[];
}

function htmlDoNoProcesso(arv: Arvore): string {
  const m = /Nos\[0\]\.html\s*=\s*(['"])/.exec(arv.pagina.html);
  return m ? lerString(arv.pagina.html, m.index + m[0].length - 1)[0] : "";
}

/** Quebra o HTML da mensagem em linhas (`<br />`), cada uma com o texto e os links `ancoraSigla`. */
function linhasDaMensagem(html: string): Array<{ texto: string; ancoras: Array<{ sigla: string; nome: string }> }> {
  if (!html.trim()) return [];
  const raiz = analisarHtml(`<div id="r">${html}</div>`).getElementById("r");
  if (!raiz) return [];
  const linhas: Array<{ texto: string; ancoras: Array<{ sigla: string; nome: string }> }> = [];
  let atual = { texto: "", ancoras: [] as Array<{ sigla: string; nome: string }> };
  const fechar = () => {
    const texto = atual.texto.replace(/\s+/g, " ").trim();
    if (texto) linhas.push({ texto, ancoras: atual.ancoras });
    atual = { texto: "", ancoras: [] };
  };
  for (const no of [...raiz.childNodes]) {
    if (no.nodeType === 1 && (no as Element).tagName === "BR") fechar();
    else {
      atual.texto += no.textContent ?? "";
      if (no.nodeType === 1 && (no as Element).classList?.contains("ancoraSigla")) {
        const el = no as Element;
        atual.ancoras.push({ sigla: textoDe(el), nome: el.getAttribute("title") ?? el.getAttribute("alt") ?? "" });
      }
    }
  }
  fechar();
  return linhas;
}

/**
 * Onde o processo está aberto e a quem a unidade atual o atribuiu, lido da mensagem `Nos[0].html` da árvore
 * (a mesma que o SEI mostra abaixo do nome do processo). Sem rede.
 * `unidadeAtual` é a sigla da unidade do usuário; sem ela tenta o cabeçalho da página e, na dúvida entre várias
 * unidades, não adivinha (`usuario: null`).
 */
export function lerAtribuicaoDaPagina(arv: Arvore, unidadeAtual?: string): AtribuicaoDaPagina {
  const brutas = linhasDaMensagem(htmlDoNoProcesso(arv));
  const linhas: LinhaAtribuicao[] = [];
  for (const l of brutas) {
    if (!l.ancoras.length) continue;
    // Sigiloso: "com o usuário <login> / <unidade>" -- é credencial, não atribuição.
    const sigiloso = /\bcom (?:o|os) usu.rios?\b/i.test(l.texto);
    if (sigiloso) {
      linhas.push({ texto: l.texto, unidade: l.ancoras[1]?.sigla ?? "", usuario: null });
      continue;
    }
    const atribuido = /atribu.do para/i.test(l.texto) && l.ancoras.length > 1 ? l.ancoras[1] : null;
    linhas.push({ texto: l.texto, unidade: l.ancoras[0].sigla, usuario: atribuido?.sigla ?? null, ...(atribuido?.nome ? { nomeUsuario: atribuido.nome } : {}) });
  }
  const sigla = (unidadeAtual ?? lerContexto(arv.pagina).unidade.sigla).trim().toLowerCase();
  const minha = sigla ? linhas.find((l) => l.unidade.toLowerCase() === sigla) : linhas.length === 1 ? linhas[0] : undefined;
  return {
    usuario: minha?.usuario ?? null,
    ...(minha?.nomeUsuario ? { nomeUsuario: minha.nomeUsuario } : {}),
    unidadeAberta: Boolean(acaoNaArvore(arv, "procedimento_alterar")),
    texto: brutas.map((l) => l.texto).join("\n"),
    linhas,
  };
}

// --- Bloco interno -------------------------------------------------------------------------------------------

const momento = (data: string): number => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(data);
  return m ? Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] ?? 0), Number(m[5] ?? 0)) : Number.NaN;
};

/**
 * Bloco interno em que a unidade colocou o processo, pelos andamentos do histórico (regra do legado
 * `getBlocoProcessoHistorico`): vale a inserção mais recente da unidade, a menos que haja retirada posterior.
 * Devolve a descrição do andamento ("Processo inserido no bloco interno ...") ou `null`. Não busca nada.
 */
export function blocoInternoDoHistorico(andamentos: Andamento[], siglaUnidade: string): string | null {
  const da = andamentos.filter((a) => a.unidade === siglaUnidade);
  const maisRecente = (lista: Andamento[]) => lista.reduce<Andamento | null>((m, a) => (!m || momento(a.data) > momento(m.data) ? a : m), null);
  const inserido = maisRecente(da.filter((a) => a.descricao.includes("Processo inserido no bloco")));
  if (!inserido) return null;
  const retirado = maisRecente(da.filter((a) => a.descricao.includes("Processo retirado do bloco")));
  return retirado && momento(inserido.data) < momento(retirado.data) ? null : inserido.descricao;
}

// --- O que a barra do processo oferece -----------------------------------------------------------------------

export interface AcoesDoPainel {
  /** Anotações (`anotacao_registrar`). */
  anotar: boolean;
  /** Acompanhamento especial (`acompanhamento_gerenciar`). */
  acompanhar: boolean;
  /** Marcadores (`andamento_marcador_gerenciar`). */
  marcar: boolean;
  /** Atribuição (o ícone "Atribuir Processo" da barra). */
  atribuir: boolean;
  /** "Consultar/Alterar Processo" (processo aberto na unidade). */
  alterar: boolean;
  /** Pelo menos a consulta do processo (aberto ou não). */
  consultar: boolean;
}

/** Quais ações a barra do processo oferece ao usuário, lido da árvore que já está na tela. Sem rede. */
export function acoesDoPainel(arv: Arvore): AcoesDoPainel {
  const tem = (a: string) => Boolean(acaoNaArvore(arv, a));
  const alterar = tem("procedimento_alterar");
  return {
    anotar: tem("anotacao_registrar"),
    acompanhar: tem("acompanhamento_gerenciar"),
    marcar: tem("andamento_marcador_gerenciar"),
    atribuir: tem("procedimento_atribuicao_cadastrar"),
    alterar,
    consultar: alterar || tem("procedimento_consultar"),
  };
}

// --- Marcadores do processo, com ícone ------------------------------------------------------------------------

export interface MarcadorDoPainel {
  /** id do marcador (vale para `definirMarcador` e para o vínculo de remoção). */
  id: string;
  nome: string;
  texto: string;
  /** Caminho do ícone como o SEI o serve (`svg/marcador_azul.svg?18`), relativo à tela. */
  icone: string;
  usuario: string;
  data: string;
}

/**
 * Marcadores do processo (GET da tela "Gerenciar Marcador" que a árvore oferece). Diferente de
 * `marcadoresDoProcesso` (do agente), usa a árvore que o quadro já tem e traz o ícone de cada marcador.
 * Lista vazia = sem marcador (estado vazio, não erro).
 */
export async function lerMarcadoresDoProcesso(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<MarcadorDoPainel[]> {
  const tela = await http.obter(linkObrigatorio(arv, "andamento_marcador_gerenciar", "Gerenciar Marcador"), { ...op, aceitarValidacao: true });
  // Sem nenhum marcador o SEI 5 abre direto o formulário de cadastro: não há lista.
  if (tela.doc.querySelector("#frmAndamentoMarcadorCadastro")) return [];
  const tabela = tela.doc.querySelector("#tblMarcadores");
  if (!tabela) {
    if (/Nenhum registro encontrado|sem marcador/i.test(tela.doc.body?.textContent ?? "") || tela.doc.querySelector("#frmGerenciarMarcador")) return [];
    throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela de marcadores não é a lista nem o formulário esperados.", textoDe(tela.doc.querySelector("title")));
  }
  const linhas = [...tabela.querySelectorAll("tr")].filter((tr) => tr.querySelector("input[type=checkbox]"));
  return linhas.map((tr) => {
    const td = [...tr.querySelectorAll("td")];
    return {
      id: tr.querySelector("input[type=checkbox]")?.getAttribute("value") ?? "",
      nome: textoDe(td[1]),
      texto: textoDe(td[2]),
      icone: td[1]?.querySelector("img")?.getAttribute("src") ?? "",
      usuario: textoDe(td[3]),
      data: textoDe(td[4]),
    };
  });
}

// --- Listas dos modais de edição ------------------------------------------------------------------------------

export interface OpcaoLista {
  valor: string;
  texto: string;
  /** Ícone (marcadores). */
  icone?: string;
}

/** Usuários a quem a unidade pode atribuir o processo (GET do formulário de atribuição, que não grava nada). */
export async function lerOpcoesAtribuicao(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<{ opcoes: OpcaoLista[]; atual?: string }> {
  const f = await Formulario.abrir(http, linkObrigatorio(arv, "procedimento_atribuicao_cadastrar", "Atribuir Processo"), "#frmAtividadeAtribuir", { ...op, aceitarValidacao: true });
  const todas = f.opcoes("selAtribuicao");
  const atual = todas.find((o) => o.selecionada && o.valor !== "null")?.valor;
  return { opcoes: todas.filter((o) => o.valor !== "null" && o.texto).map((o) => ({ valor: o.valor, texto: o.texto })), ...(atual ? { atual } : {}) };
}

/** Marcadores que a unidade pode aplicar (select do formulário "Adicionar"). */
export async function lerOpcoesMarcador(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<OpcaoLista[]> {
  const tela = await http.obter(linkObrigatorio(arv, "andamento_marcador_gerenciar", "Gerenciar Marcador"), { ...op, aceitarValidacao: true });
  let pagina = tela;
  if (!tela.doc.querySelector("#frmAndamentoMarcadorCadastro")) {
    const cadastrar = linkDaAcao(tela.html, "andamento_marcador_cadastrar");
    if (!cadastrar) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "Esta versão do SEI não tem a tela de marcadores esperada (4.1 ou superior).");
    pagina = await http.obter(cadastrar, { ...op, aceitarValidacao: true });
  }
  const sel = pagina.doc.querySelector("#selMarcador");
  if (!sel) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela de marcadores não tem a lista de marcadores.");
  return [...sel.querySelectorAll("option")]
    .map((o) => ({ valor: o.getAttribute("value") ?? "", texto: textoDe(o), icone: o.getAttribute("data-imagesrc") ?? undefined }))
    .filter((o) => o.valor && o.valor !== "null" && o.texto)
    .map((o) => (o.icone ? o : { valor: o.valor, texto: o.texto }));
}

/** Grupos de acompanhamento especial da unidade e o grupo atual do processo (GET, sem gravar). */
export async function lerOpcoesAcompanhamento(http: Http, arv: Arvore, op?: OpcoesHttp): Promise<{ grupos: OpcaoLista[]; atual?: string }> {
  const tela = await http.obter(linkObrigatorio(arv, "acompanhamento_gerenciar", "Acompanhamento Especial"), { ...op, aceitarValidacao: true });
  let pagina = tela;
  if (!tela.doc.querySelector("#frmAcompanhamentoCadastro")) {
    const link = ["acompanhamento_alterar", "acompanhamento_cadastrar"].map((a) => linkDaAcao(tela.html, a)).find(Boolean);
    if (!link) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela de acompanhamento especial não tem o formulário esperado.");
    pagina = await http.obter(link, { ...op, aceitarValidacao: true });
  }
  const f = Formulario.de(pagina, "#frmAcompanhamentoCadastro");
  const todas = f.opcoes("selGrupoAcompanhamento");
  const atual = todas.find((o) => o.selecionada && o.valor !== "null")?.valor;
  return { grupos: todas.filter((o) => o.valor !== "null" && o.texto).map((o) => ({ valor: o.valor, texto: o.texto })), ...(atual ? { atual } : {}) };
}

export interface FormularioDoProcesso {
  tipos: OpcaoLista[];
  tipoAtual?: string;
  nivel: string;
  hipoteseAtual?: string;
  interessados: ItemLupa[];
  /** Hipóteses legais de um nível ("1" restrito, "2" sigiloso): a tela só as preenche por AJAX. */
  hipoteses(nivel: string, sinal?: AbortSignal): Promise<OpcaoLista[]>;
}

/** Tipos de processo, nível, hipótese e interessados do formulário "Consultar/Alterar Processo" (GET, sem gravar). */
export async function lerFormularioDoProcesso(sei: Sei, arv: Arvore, op?: OpcoesHttp): Promise<FormularioDoProcesso> {
  const link = acaoNaArvore(arv, "procedimento_alterar") ?? acaoNaArvore(arv, "procedimento_consultar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI não oferece a consulta do processo ${arv.protocolo} para você.`);
  const f = await Formulario.abrir(sei.http, link, "#frmProcedimentoCadastro", op);
  const tipos = f.opcoes("selTipoProcedimento");
  const hip = f.opcoes("selHipoteseLegal").find((o) => o.selecionada && o.valor !== "null")?.valor;
  const tipoAtual = tipos.find((o) => o.selecionada)?.valor;
  return {
    tipos: tipos.filter((o) => o.valor && o.valor !== "null").map((o) => ({ valor: o.valor, texto: o.texto })),
    ...(tipoAtual ? { tipoAtual } : {}),
    nivel: f.valor("rdoNivelAcesso") ?? "",
    ...(hip ? { hipoteseAtual: hip } : {}),
    interessados: f.itensLupa("selInteressadosProcedimento"),
    async hipoteses(nivel, sinal) {
      return (await hipotesesDoFormulario(sei, f, nivel, sinal)).map((h) => ({ valor: h.id, texto: h.texto }));
    },
  };
}
