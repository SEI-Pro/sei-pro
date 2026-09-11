/**
 * Casca comum das ferramentas de fluxo linear.
 *
 * Ordem da tela: zona de arquivos -> lista -> opcoes -> acao -> progresso ->
 * erro -> resultado. Nao e assistente de varios passos: a intencao de quem abre
 * "juntar PDF" e transacional, e enterrar a ferramenta atras de etapas so
 * atrapalha.
 *
 * Tres das nove ferramentas (Tarjar, OCR e Conferir PDF/A) NAO usam esta
 * moldura, porque o fluxo delas e mesmo diferente -- mas reusam a zona de
 * arquivos, o progresso e a regiao de anuncio.
 */

import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
import type { OperacaoPdf, SaidaWorker } from "@/lib/ferramentas/protocoloWorker";
import { el, icone, repor } from "@/ui/dom";
import { criarFerramenta, type Ferramenta } from "@/ui/ferramenta";
import { criarListaArquivos } from "@/ui/componentes/listaArquivos";
import { criarPainelResultado } from "@/ui/componentes/painelResultado";
import { criarProgresso } from "@/ui/componentes/progresso";
import { criarRegiaoAnuncio, criarZonaDeArquivos } from "@/ui/componentes/zonaDeArquivos";
import { ponte } from "@/ui/contexto";
import { mensagemDaPonte } from "@/ui/mensagens";

export interface OpcoesMoldura {
  operacao: OperacaoPdf;
  titulo: string;
  descricao: string;
  /** Texto do botao que dispara o processamento. */
  rotuloAcao: string;
  aceita?: string;
  multiplo?: boolean;
  /** Falso para imagens: passar imagem pelo diagnostico de PDF e erro certo. */
  diagnosticarComoPdf?: boolean;
  zona: { titulo: string; apoio: string; rotuloBotao: string; ajuda: string };
  /** Painel de opcoes especifico da ferramenta. */
  painelOpcoes?(ferramenta: Ferramenta, sincronizar: () => void): {
    raiz: HTMLElement;
    valores(): Record<string, unknown>;
    sincronizar?(desabilitado: boolean): void;
  };
  /** Base do nome do ZIP quando a saida e multipla. */
  nomeZip?: string;
  /** Mensagem quando ainda nao da para processar (ex.: 2 arquivos no minimo). */
  validar?(ferramenta: Ferramenta): string | null;
  /**
   * Chamado quando o processamento termina bem. Serve para a ferramenta
   * mostrar o que so ela sabe explicar -- o relatorio da compressao, por
   * exemplo, que precisa da `meta` devolvida pelo despacho.
   */
  aoConcluir?(saidas: SaidaWorker[]): Node | null;
}

export interface FerramentaMontada {
  raiz: HTMLElement;
  destruir(): void;
}

export function montarMoldura(opcoes: OpcoesMoldura): FerramentaMontada {
  const {
    operacao,
    titulo,
    descricao,
    rotuloAcao,
    aceita,
    multiplo = true,
    diagnosticarComoPdf = true,
    zona: textosZona,
    painelOpcoes,
    nomeZip = "documentos",
    validar,
    aoConcluir,
  } = opcoes;

  const f = criarFerramenta();
  const anuncio = criarRegiaoAnuncio();

  const zona = criarZonaDeArquivos({
    ...textosZona,
    aceita,
    multiplo,
    aoEscolher: (arquivos) => void f.adicionar(arquivos, { diagnosticar: diagnosticarComoPdf }),
    aoTrazerDoSei: () => trazerDoSei(),
  });

  const lista = criarListaArquivos({
    aoMover: (de, para) => f.mover(de, para),
    aoRemover: (id) => f.remover(id),
    aoSenha: (id, senha) => void f.tentarSenha(id, senha),
  });

  const progresso = criarProgresso(() => f.cancelar());

  let enviando = false;
  let mensagemEnvio: string | null = null;

  const resultado = criarPainelResultado({
    aoBaixar: () => void f.baixar(nomeZip),
    aoEnviarAoSei: () => void enviarAoSei(),
    aoRecomecar: () => f.limparTudo(),
  });

  /**
   * A montagem ainda não terminou.
   *
   * O painel de opções de algumas ferramentas precisa ajustar a própria
   * visibilidade assim que nasce (o Dividir mostra campos diferentes conforme o
   * modo) e, para isso, pede um `sincronizar()` durante a própria construção --
   * antes de a moldura ter criado o resumo, o erro e os botões. Sem esta
   * guarda, o `sincronizar` lia uma constante que ainda não existia e a
   * ferramenta inteira morria com "Cannot access ... before initialization",
   * deixando a tela parada em "Carregando...".
   */
  let montado = false;

  const opcoesPainel = painelOpcoes?.(f, () => sincronizar());

  const resumo = el("p", { class: "fpdf-resumo", hidden: true });
  const erro = el("p", { class: "fpdf-erro", role: "alert", hidden: true });
  const areaRelatorio = el("div", { class: "fpdf-relatorio", hidden: true });

  const botaoAcao = el(
    "button",
    {
      type: "button",
      class: "fpdf-botao fpdf-botao--primario fpdf-botao--grande",
      onclick: () => void processar(),
    },
    rotuloAcao,
  );

  const botaoLimpar = el(
    "button",
    {
      type: "button",
      class: "fpdf-botao fpdf-botao--texto",
      hidden: true,
      onclick: () => f.limparTudo(),
    },
    "Limpar lista",
  );

  const raiz = el(
    "section",
    { class: "fpdf-ferramenta" },
    el(
      "header",
      { class: "fpdf-ferramenta__cabecalho" },
      el("h2", {}, titulo),
      el("p", { class: "fpdf-ferramenta__descricao" }, descricao),
    ),
    anuncio.raiz,
    zona.raiz,
    lista.raiz,
    resumo,
    opcoesPainel?.raiz ?? null,
    el("div", { class: "fpdf-ferramenta__acoes" }, botaoAcao, botaoLimpar),
    progresso.raiz,
    erro,
    resultado.raiz,
    areaRelatorio,
  );

  async function processar() {
    const impedimento = validar?.(f) ?? null;
    if (impedimento) {
      repor(erro, impedimento);
      erro.hidden = false;
      return;
    }
    mensagemEnvio = null;
    const saidas = await f.processar(operacao, opcoesPainel?.valores() ?? {});
    const conteudo = saidas && aoConcluir ? aoConcluir(saidas) : null;
    areaRelatorio.hidden = !conteudo;
    if (conteudo) repor(areaRelatorio, conteudo);
  }

  async function trazerDoSei() {
    try {
      const docs = await ponte().listarDocumentos();
      const baixaveis = docs.filter((d) => d.baixavel);
      if (baixaveis.length === 0) {
        repor(erro, "Nenhum documento externo em PDF foi encontrado neste processo.");
        erro.hidden = false;
        return;
      }
      const escolhidos = await escolherDocumentos(baixaveis);
      if (!escolhidos.length) return;
      const trazidos = [];
      for (const doc of escolhidos) {
        trazidos.push(await ponte().obterPdf(doc.id));
      }
      await f.adicionarBytes(trazidos);
    } catch (e) {
      repor(erro, mensagemDaPonte(e));
      erro.hidden = false;
    }
  }

  async function enviarAoSei() {
    const saidas = f.estado.resultado?.saidas;
    if (!saidas?.length) return;
    enviando = true;
    mensagemEnvio = null;
    sincronizar();
    try {
      for (const saida of saidas) {
        await ponte().enviarAoProcesso({ nome: saida.nome, bytes: saida.bytes });
      }
      mensagemEnvio =
        saidas.length === 1
          ? "Documento enviado ao processo."
          : `${saidas.length} documentos enviados ao processo.`;
      anuncio.anunciar(mensagemEnvio);
    } catch (e) {
      mensagemEnvio = mensagemDaPonte(e);
    } finally {
      enviando = false;
      sincronizar();
    }
  }

  function sincronizar() {
    // Ver o comentário de `montado`: durante a construção do painel de opções
    // ainda não há o que sincronizar, e o estado final é aplicado no fim.
    if (!montado) return;
    const e = f.estado;
    const impedimento = validar?.(f) ?? null;

    lista.sincronizar(e.itens, e.processando);
    zona.sincronizar({
      desabilitado: e.processando,
      podeTrazerDoSei: ponte().disponivel(),
    });
    progresso.sincronizar({ processando: e.processando, ...e.progresso });

    resumo.hidden = e.itens.length === 0;
    if (e.itens.length) {
      const paginas = f.paginas;
      repor(
        resumo,
        `${e.itens.length} ${e.itens.length === 1 ? "documento" : "documentos"}`,
        paginas ? ` · ${paginas} ${paginas === 1 ? "página" : "páginas"}` : "",
        ` · ${formatarBytes(f.bytes)}`,
      );
    }

    botaoAcao.disabled = e.processando || Boolean(impedimento) || e.itens.length === 0;
    botaoLimpar.hidden = e.itens.length === 0 || e.processando;
    opcoesPainel?.sincronizar?.(e.processando);

    // O erro do processamento tem prioridade sobre o aviso de validacao: um diz
    // que falhou, o outro que ainda nao da para tentar.
    const textoErro = e.erroGeral ?? (e.itens.length > 0 ? impedimento : null);
    erro.hidden = !textoErro;
    if (textoErro) repor(erro, icone("fas fa-exclamation-triangle"), " ", textoErro);

    if (!e.resultado) areaRelatorio.hidden = true;

    resultado.sincronizar({
      saidas: e.resultado?.saidas ?? null,
      bytes: e.resultado?.bytes ?? 0,
      podeEnviarAoSei: ponte().disponivel(),
      enviando,
      mensagemEnvio,
    });

    anuncio.anunciar(e.anuncio);
  }

  montado = true;

  const cancelarAssinatura = f.assinar(sincronizar);
  const cancelarPonte = ponte().aoMudar(() => sincronizar());
  // Aplica de uma vez o que o painel de opções pediu enquanto era construído.
  sincronizar();

  return {
    raiz,
    destruir() {
      cancelarAssinatura();
      cancelarPonte();
      progresso.destruir();
      void f.destruir();
    },
  };
}

/** Dialogo de escolha de documentos do processo. */
async function escolherDocumentos(
  docs: { id: string; nome: string; numero?: string }[],
): Promise<{ id: string; nome: string }[]> {
  const { escolherDocumentosDoProcesso } = await import("@/ui/componentes/escolherDocumentos");
  return escolherDocumentosDoProcesso(docs);
}
