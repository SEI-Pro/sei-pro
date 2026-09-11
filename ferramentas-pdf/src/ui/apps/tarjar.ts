/**
 * Tarjar PDF.
 *
 * O QUE DIFERENCIA ESTA FERRAMENTA de desenhar um retangulo preto por cima: a
 * pagina tarjada e RECONSTRUIDA. O texto suprimido nao fica no arquivo -- nem
 * escondido sob a tarja, nem num fluxo orfao. Quem abrir o resultado num leitor
 * que extrai texto nao encontra o dado, porque ele nao esta la.
 *
 * E O MOTOR SE RECUSA A ENTREGAR ARQUIVO NAO CONFERIDO. Depois de gerar, ele
 * reabre a propria saida e procura o que deveria ter sumido -- por geometria,
 * por texto extraido e por varredura dos bytes, inclusive em hexadecimal. Se
 * qualquer prova falhar, o arquivo nao e entregue. Este app so exibe o
 * veredito; a decisao e do nucleo, e e assim que tem de ser.
 */

import type { Deteccao, TipoDado } from "@/lib/ferramentas/tarjar/deteccao";
import { TIPOS_ORDENADOS } from "@/lib/ferramentas/tarjar/deteccao";
import type { EstadoTarjar, Marcacao } from "@/lib/ferramentas/tarjar/estado";
import {
  ESTADO_INICIAL,
  contarAtivas,
  marcacaoDeDeteccao,
  reduzir,
  rotuloDoTipo,
} from "@/lib/ferramentas/tarjar/estado";
import type { FonteDoDocumento } from "@/lib/ferramentas/tarjar/tarjar";
import { el, icone, repor } from "@/ui/dom";
import { criarRegiaoAnuncio, criarZonaDeArquivos } from "@/ui/componentes/zonaDeArquivos";
import { criarProgresso } from "@/ui/componentes/progresso";
import { criarPainelResultado } from "@/ui/componentes/painelResultado";
import { criarPaginaTarjar, type PaginaTarjar } from "@/ui/tarjar/paginaTarjar";
import { instalarMedidorDeTexto, desinstalarMedidorDeTexto } from "@/ui/tarjar/medidor";
import { confirmarTarja } from "@/ui/tarjar/confirmar";
import { ponte } from "@/ui/contexto";
import { mensagemDaPonte } from "@/ui/mensagens";
import type { FerramentaMontada } from "@/ui/moldura";

const ESCALAS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

/**
 * Escala máxima do ajuste automático.
 *
 * Sem teto, um documento de página pequena (um recibo, por exemplo) seria
 * esticado até a largura da janela e ficaria borrado -- o canvas é rasterizado
 * naquela escala.
 */
const AJUSTE_MAXIMO = 2.5;

export function montar(): FerramentaMontada {
  let estado: EstadoTarjar = { ...ESTADO_INICIAL };
  let arquivo: { nome: string; bytes: Uint8Array; senha?: string } | null = null;
  let fonte: FonteDoDocumento | null = null;
  let paginas: PaginaTarjar[] = [];
  // Começa em 1 e é ajustada assim que as dimensões do documento são
  // conhecidas: ver `escalaParaCaber`.
  let escala = 1;
  let ajustarNaLargura = true;
  let modo: "marcar" | "desenhar" = "marcar";
  let realce: string | null = null;
  let cancelado = false;
  let enviando = false;
  let mensagemEnvio: string | null = null;
  let observador: IntersectionObserver | null = null;
  /** Para saber quando o resultado aparece e a área de preview precisa ceder espaço. */
  let tinhaResultado = false;

  instalarMedidorDeTexto();

  const anuncio = criarRegiaoAnuncio();
  const areaPaginas = el("div", { class: "fpdf-tarjar__paginas" });
  const painel = el("div", { class: "fpdf-tarjar__painel" });
  const barra = el("div", { class: "fpdf-tarjar__barra" });
  const erro = el("p", { class: "fpdf-erro", role: "alert", hidden: true });
  const relatorio = el("div", { class: "fpdf-relatorio", hidden: true });
  const progresso = criarProgresso(() => {
    cancelado = true;
    despachar({ tipo: "anunciar", texto: "Cancelando..." });
  });

  const areaTrabalho = el(
    "div",
    { class: "fpdf-tarjar", hidden: true },
    areaPaginas,
    painel,
  );

  const zona = criarZonaDeArquivos({
    titulo: "Solte o PDF aqui",
    apoio: "ou escolha o arquivo do seu computador",
    rotuloBotao: "Escolher PDF",
    ajuda:
      "Um documento por vez. O arquivo é lido nesta máquina: nada é enviado para servidor nenhum.",
    multiplo: false,
    aoEscolher: (arquivos) => void abrir(arquivos[0]),
    aoTrazerDoSei: () => trazerDoProcesso(),
  });

  const resultado = criarPainelResultado({
    aoBaixar: () => void baixar(),
    aoEnviarAoSei: () => void enviarAoSei(),
    aoRecomecar: () => reiniciar(),
  });

  const raiz = el(
    "section",
    { class: "fpdf-ferramenta" },
    el(
      "header",
      { class: "fpdf-ferramenta__cabecalho" },
      el("h2", {}, "Tarjar PDF"),
      el(
        "p",
        { class: "fpdf-ferramenta__descricao" },
        "Suprima CPF, e-mail e outros dados sensíveis de um PDF, de forma que o texto deixe de existir no arquivo.",
      ),
    ),
    anuncio.raiz,
    zona.raiz,
    barra,
    // O resultado vem ANTES do documento, e não depois.
    //
    // O botão que aplica as tarjas fica na barra, no alto. Com o resultado
    // embaixo do preview -- que ocupa a altura inteira da janela --, aplicar
    // parecia não ter feito nada: era preciso rolar uma tela cheia para
    // descobrir que o arquivo estava pronto.
    progresso.raiz,
    erro,
    resultado.raiz,
    relatorio,
    areaTrabalho,
  );

  function despachar(acao: Parameters<typeof reduzir>[1]) {
    estado = reduzir(estado, acao);
    sincronizar();
  }

  /**
   * Traz um documento do processo aberto no SEI.
   *
   * O Tarjar trabalha um documento por vez, então a escolha é única: trazer
   * dois substituiria o primeiro sem aviso, e perder marcações já feitas é
   * pior que pedir para repetir a operação.
   */
  async function trazerDoProcesso() {
    try {
      const docs = await ponte().listarDocumentos();
      const baixaveis = docs.filter((d) => d.baixavel);
      if (baixaveis.length === 0) {
        despachar({
          tipo: "erro",
          mensagem: "Nenhum documento externo em PDF foi encontrado neste processo.",
        });
        return;
      }

      const { escolherDocumentosDoProcesso } = await import(
        "@/ui/componentes/escolherDocumentos"
      );
      const escolhidos = await escolherDocumentosDoProcesso(baixaveis, { unico: true });
      if (!escolhidos.length) return;

      despachar({ tipo: "abrindo", nome: escolhidos[0].nome });
      const trazido = await ponte().obterPdf(escolhidos[0].id, (fracao) =>
        despachar({ tipo: "analisando", feito: Math.round(fracao * 100), total: 100 }),
      );
      await abrirBytes(trazido.nome, trazido.bytes);
    } catch (e) {
      despachar({ tipo: "erro", mensagem: mensagemDaPonte(e) });
    }
  }

  // ---- abrir ----

  async function abrir(arquivoEscolhido: File) {
    reiniciar();
    despachar({ tipo: "abrindo", nome: arquivoEscolhido.name });
    await abrirBytes(arquivoEscolhido.name, new Uint8Array(await arquivoEscolhido.arrayBuffer()));
  }

  /** Abre bytes já em memória -- do disco ou trazidos do processo. */
  async function abrirBytes(nome: string, bytes: Uint8Array) {
    try {
      arquivo = { nome, bytes };

      const { analisarPdf } = await import("@/lib/ferramentas/analisarPdf");
      const { diagnostico } = await analisarPdf(bytes, { nome });

      const { criarFontePdfJs } = await import("@/lib/ferramentas/tarjar/rasterizar");
      fonte = await criarFontePdfJs(bytes);

      const dimensoes = await lerDimensoes(bytes);
      despachar({
        tipo: "abriu",
        totalPaginas: fonte.totalDePaginas,
        dimensoes,
        temAssinatura: diagnostico.temAssinatura,
      });

      montarPaginas(dimensoes);
      await analisar();
    } catch (e) {
      await mostrarErro(e);
    }
  }

  /** Dimensoes vem do pdf.js; a matriz de viewport e do nucleo. */
  async function lerDimensoes(bytes: Uint8Array) {
    const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
    const pdfjs = await carregarPdfJs();
    const tarefa = pdfjs.getDocument(opcoesDocumento(new Uint8Array(bytes)));
    const doc = await tarefa.promise;
    const dimensoes = [];
    for (let n = 1; n <= doc.numPages; n += 1) {
      const pagina = await doc.getPage(n);
      const vp = pagina.getViewport({ scale: 1 });
      dimensoes.push({
        view: pagina.view as unknown as readonly [number, number, number, number],
        giro: pagina.rotate,
        larguraExibida: vp.width,
        alturaExibida: vp.height,
      });
      pagina.cleanup();
    }
    await tarefa.destroy();
    return dimensoes;
  }

  // ---- analisar ----

  async function analisar() {
    if (!fonte) return;
    cancelado = false;
    const { construirTextoPagina } = await import("@/lib/ferramentas/tarjar/textoPagina");
    const { detectarNaPagina } = await import("@/lib/ferramentas/tarjar/deteccao");

    const marcacoes: Marcacao[] = [];
    const semTexto: number[] = [];
    const total = fonte.totalDePaginas;

    for (let n = 1; n <= total; n += 1) {
      if (cancelado) break;
      despachar({ tipo: "analisando", feito: n - 1, total });
      const conteudo = await fonte.lerTexto(n);
      if (!conteudo || conteudo.items.length === 0) {
        semTexto.push(n);
        continue;
      }
      const tp = construirTextoPagina(n, conteudo);
      const achados: Deteccao[] = detectarNaPagina(tp, { tipos: estado.tiposLigados });
      for (const d of achados) {
        marcacoes.push(marcacaoDeDeteccao(d, crypto.randomUUID()));
      }
    }

    despachar({ tipo: "analisou", marcacoes, paginasSemTexto: semTexto });
  }

  // ---- aplicar ----

  async function aplicar() {
    if (!arquivo || !fonte) return;
    const ativas = estado.marcacoes.filter((m) => m.ativa);
    if (ativas.length === 0) return;

    const confirmou = await confirmarTarja({
      quantidade: ativas.length,
      temAssinatura: estado.temAssinatura,
      paginasSemTexto: estado.paginasSemTexto,
    });
    if (!confirmou) return;

    cancelado = false;
    despachar({ tipo: "aplicando", feito: 0, total: estado.totalPaginas });

    try {
      const { tarjarPdf } = await import("@/lib/ferramentas/tarjar/tarjar");
      const tarjas = ativas.flatMap((m) =>
        m.caixas.map((caixa) => ({
          pagina: m.pagina,
          caixa,
          textoSuprimido: m.textoSuprimido,
        })),
      );

      const rel = await tarjarPdf(arquivo, {
        tarjas,
        fonte,
        confirmarPerdaDeAssinatura: estado.temAssinatura,
        aoProgredir: (feito, total) => despachar({ tipo: "aplicando", feito, total }),
        cancelado: () => cancelado,
      });

      despachar({
        tipo: "aplicou",
        resultado: {
          nome: rel.nomeArquivo,
          bytes: rel.bytes,
          paginasRasterizadas: rel.paginasRasterizadas.length,
          paginasIntactas: rel.paginasIntactas,
          bytesOriginais: rel.bytesOriginais,
          bytesFinais: rel.bytesFinais,
          itensDescartados: rel.itensDescartados,
          restantes: rel.verificacao?.falhas.length ?? 0,
        },
      });
      mostrarRelatorio(rel);
    } catch (e) {
      await mostrarErro(e);
    }
  }

  function mostrarRelatorio(rel: {
    paginasRasterizadas: number[];
    paginasIntactas: number;
    itensDescartados: number;
    verificacao: { aprovado: boolean } | null;
    camadaDeTextoDesligadaEm: number[];
  }) {
    relatorio.hidden = false;
    const linhas: string[] = [];

    linhas.push(
      `${rel.paginasRasterizadas.length} ${rel.paginasRasterizadas.length === 1 ? "página foi reconstruída" : "páginas foram reconstruídas"}; ${rel.paginasIntactas} ${rel.paginasIntactas === 1 ? "permaneceu" : "permaneceram"} como estavam.`,
    );

    if (rel.verificacao?.aprovado) {
      // O motor so entrega arquivo aprovado; dizer isso ao usuario e o que
      // transforma a promessa em algo verificado, nao em promessa.
      linhas.push(
        "O arquivo gerado foi conferido: o texto tarjado não aparece no documento, nem na extração de texto, nem na varredura dos bytes.",
      );
    }

    if (rel.itensDescartados > 0) {
      linhas.push(
        `${rel.itensDescartados} trecho(s) de texto que encostavam nas tarjas não foram reescritos, por segurança. A aparência da página é preservada pela imagem; apenas esses trechos deixam de ser selecionáveis.`,
      );
    }

    if (rel.camadaDeTextoDesligadaEm.length > 0) {
      linhas.push(
        `Em ${rel.camadaDeTextoDesligadaEm.length} página(s) a camada de texto foi desligada para garantir que nada vazasse. Essas páginas ficam como imagem.`,
      );
    }

    repor(relatorio, ...linhas.map((t) => el("p", {}, t)));
  }

  async function mostrarErro(e: unknown) {
    const { ErroFerramenta, mensagemDeErro } = await import("@/lib/ferramentas/erros");
    const { OperacaoCancelada } = await import("@/lib/ferramentas/juntar");
    if (e instanceof OperacaoCancelada) {
      despachar({ tipo: "anunciar", texto: "Operação cancelada." });
      return;
    }
    const codigo = e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA";
    despachar({
      tipo: "erro",
      mensagem: mensagemDeErro(codigo as never, { nome: arquivo?.nome }),
    });
  }

  // ---- paginas ----

  /**
   * Escala que faz a página caber na largura disponível.
   *
   * Sem isto, o documento abre sempre em 100% -- uma A4 ocupa 595px, e o resto
   * da área fica vazio. Numa janela de notebook isso deixava a página com menos
   * da metade do espaço, e arrastar uma tarja sobre uma linha de texto virava
   * trabalho de precisão desnecessário.
   */
  function escalaParaCaber(larguraDaPagina: number): number {
    const area = areaPaginas.clientWidth;
    if (!area || !larguraDaPagina) return 1;
    // Desconta a barra de rolagem e o respiro lateral.
    const util = area - 28;
    const bruta = util / larguraDaPagina;
    return Math.max(0.5, Math.min(AJUSTE_MAXIMO, Math.round(bruta * 20) / 20));
  }

  function montarPaginas(dimensoes: ReturnType<typeof Array.prototype.slice>) {
    desmontarPaginas();
    observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const n = Number((entrada.target as HTMLElement).dataset.pagina);
          const pagina = paginas.find((p) => p.numero === n);
          if (!pagina) continue;
          if (entrada.isIntersecting) pagina.renderizar();
          else pagina.liberar();
        }
      },
      { root: areaPaginas, rootMargin: "200px" },
    );

    const lista = dimensoes as {
      view: readonly [number, number, number, number];
      giro: number;
      larguraExibida: number;
      alturaExibida: number;
    }[];

    // A escala do ajuste vem da PRIMEIRA página: documentos de processo têm
    // páginas do mesmo tamanho, e variar a escala entre elas faria a rolagem
    // saltar.
    if (ajustarNaLargura && lista[0]) escala = escalaParaCaber(lista[0].larguraExibida);

    paginas = lista.map(
      (dimensao, i) =>
        criarPaginaTarjar({
          numero: i + 1,
          dimensao,
          escala,
          aoAlternarMarcacao: (id) => despachar({ tipo: "alternar", id }),
          aoDesenhar: (pagina, caixa) => {
            despachar({
              tipo: "acrescentar",
              marcacoes: [
                {
                  id: crypto.randomUUID(),
                  pagina,
                  caixas: [caixa],
                  tipo: "manual",
                  origem: "retangulo",
                  ativa: true,
                  confianca: "validado",
                  amostra: "área marcada à mão",
                },
              ],
            });
          },
          renderizar: (numero, canvas, esc) => renderizarPagina(numero, canvas, esc),
          montarTexto: (numero, camada, esc) => montarCamadaDeTexto(numero, camada, esc),
          aoFalhar: (e: unknown) => {
            repor(
              erro,
              icone("fas fa-exclamation-triangle"),
              " Não foi possível desenhar a página " + (i + 1) + ": " + descreverErro(e),
            );
            erro.hidden = false;
          },
        }),
    );

    repor(areaPaginas, ...paginas.map((p) => p.raiz));
    // A altura precisa valer ANTES do ajuste de largura: o cálculo da escala
    // desconta a barra de rolagem, que só existe com a altura definida.
    ajustarAlturaDaArea();
    for (const p of paginas) observador.observe(p.raiz);
  }

  function desmontarPaginas() {
    observador?.disconnect();
    observador = null;
    for (const p of paginas) p.destruir();
    paginas = [];
  }

  function renderizarPagina(numero: number, canvas: HTMLCanvasElement, esc: number) {
    let cancelar = () => {};
    const promessa = (async () => {
      const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
      if (!arquivo) return;
      const pdfjs = await carregarPdfJs();
      const tarefa = pdfjs.getDocument(opcoesDocumento(new Uint8Array(arquivo.bytes)));
      const doc = await tarefa.promise;
      const pagina = await doc.getPage(numero);
      const viewport = pagina.getViewport({ scale: esc });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const render = pagina.render({ canvas, canvasContext: ctx, viewport });
      cancelar = () => render.cancel();
      await render.promise;
      pagina.cleanup();
      await tarefa.destroy();
    })();
    return { promessa, cancelar: () => cancelar() };
  }

  async function montarCamadaDeTexto(numero: number, camada: HTMLElement, esc: number) {
    if (!arquivo) return;
    const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
    const pdfjs = await carregarPdfJs();
    const tarefa = pdfjs.getDocument(opcoesDocumento(new Uint8Array(arquivo.bytes)));
    const doc = await tarefa.promise;
    const pagina = await doc.getPage(numero);
    const textLayer = new pdfjs.TextLayer({
      textContentSource: await pagina.getTextContent(),
      container: camada,
      viewport: pagina.getViewport({ scale: esc }),
    });
    await textLayer.render();
    pagina.cleanup();
    await tarefa.destroy();
  }

  // ---- saida ----

  async function baixar() {
    if (!estado.resultado) return;
    const { baixarPdf } = await import("@/lib/ferramentas/baixar");
    baixarPdf(estado.resultado.bytes, estado.resultado.nome);
  }

  async function enviarAoSei() {
    if (!estado.resultado) return;
    enviando = true;
    sincronizar();
    try {
      await ponte().enviarAoProcesso({
        nome: estado.resultado.nome,
        bytes: estado.resultado.bytes,
      });
      mensagemEnvio = "Documento tarjado enviado ao processo.";
    } catch (e) {
      // O erro carrega o codigo do que aconteceu, e a mensagem certa vem
      // dele. A versao anterior descartava o erro e dizia sempre "nao foi
      // possivel enviar": diante de sessao expirada, o usuario relogava as
      // cegas -- ou nem isso, porque nao sabia que era esse o problema.
      mensagemEnvio = mensagemDaPonte(e);
    } finally {
      enviando = false;
      sincronizar();
    }
  }

  function reiniciar() {
    cancelado = true;
    desmontarPaginas();
    void fonte?.destruir?.();
    fonte = null;
    arquivo = null;
    mensagemEnvio = null;
    realce = null;
    relatorio.hidden = true;
    estado = { ...ESTADO_INICIAL };
    sincronizar();
  }

  // ---- interface ----

  function sincronizar() {
    const temDoc = estado.fase !== "vazio" && estado.totalPaginas > 0;
    const ocupado = estado.fase === "abrindo" || estado.fase === "analisando" || estado.fase === "aplicando";

    zona.sincronizar({
      desabilitado: ocupado,
      podeTrazerDoSei: ponte().disponivel(),
      recolhida: temDoc,
    });
    areaTrabalho.hidden = !temDoc;
    progresso.sincronizar({ processando: ocupado, ...estado.progresso });

    for (const p of paginas) {
      p.definirModo(modo);
      p.sincronizarMarcacoes(estado.marcacoes, realce);
    }

    montarBarra(ocupado);
    montarPainel(ocupado);

    erro.hidden = !estado.erro;
    if (estado.erro) repor(erro, icone("fas fa-exclamation-triangle"), " ", estado.erro);

    // O painel de resultado entra ACIMA do preview, então empurra a área para
    // baixo: a altura disponível muda e precisa ser medida de novo. Só quando o
    // estado vira, para não forçar cálculo de layout a cada sincronização.
    const temResultado = Boolean(estado.resultado);
    if (temResultado !== tinhaResultado) {
      tinhaResultado = temResultado;
      if (paginas.length > 0) requestAnimationFrame(() => ajustarAlturaDaArea());
    }

    resultado.sincronizar({
      saidas: estado.resultado
        ? [{ nome: estado.resultado.nome, bytes: estado.resultado.bytes }]
        : null,
      bytes: estado.resultado?.bytesFinais ?? 0,
      podeEnviarAoSei: ponte().disponivel(),
      enviando,
      mensagemEnvio,
    });

    anuncio.anunciar(estado.anuncio);
  }

  function montarBarra(ocupado: boolean) {
    barra.hidden = estado.totalPaginas === 0;
    if (barra.hidden) return;

    const ativas = contarAtivas(estado.marcacoes);

    repor(
      barra,
      el(
        "div",
        { class: "fpdf-tarjar__grupo" },
        botao(modo === "marcar" ? "fas fa-hand-pointer" : "fas fa-vector-square",
          modo === "marcar" ? "Marcar" : "Desenhar tarja",
          () => {
            modo = modo === "marcar" ? "desenhar" : "marcar";
            sincronizar();
          },
          ocupado,
          modo === "desenhar",
        ),
      ),
      el(
        "div",
        { class: "fpdf-tarjar__grupo" },
        botao("fas fa-search-minus", "Reduzir", () => mudarZoom(-1), ocupado || escala <= ESCALAS[0]),
        el("span", { class: "fpdf-tarjar__zoom" }, `${Math.round(escala * 100)}%`),
        botao("fas fa-search-plus", "Ampliar", () => mudarZoom(1), ocupado || escala >= ESCALAS[ESCALAS.length - 1]),
        botao(
          "fas fa-arrows-alt-h",
          "Ajustar \u00e0 largura",
          () => ajustarLargura(),
          ocupado || paginas.length === 0,
          ajustarNaLargura,
        ),
      ),
      el(
        "div",
        { class: "fpdf-tarjar__grupo" },
        botao("fas fa-undo", "Desfazer", () => despachar({ tipo: "desfazer" }), ocupado || estado.historico.length === 0),
      ),
      el("span", { class: "fpdf-tarjar__espaco", estilo: { flex: "1" } }),
      el(
        "button",
        {
          type: "button",
          class: "fpdf-botao fpdf-botao--primario",
          disabled: ocupado || ativas === 0,
          onclick: () => void aplicar(),
        },
        icone("fas fa-marker"),
        ` Aplicar ${ativas} ${ativas === 1 ? "tarja" : "tarjas"}`,
      ),
    );
  }

  function botao(
    classeIcone: string,
    titulo: string,
    aoClicar: () => void,
    desabilitado = false,
    ativo = false,
  ) {
    return el(
      "button",
      {
        type: "button",
        class: `fpdf-botao fpdf-botao--secundario${ativo ? " fpdf-botao--ativo" : ""}`,
        title: titulo,
        "aria-label": titulo,
        "aria-pressed": ativo ? "true" : undefined,
        disabled: desabilitado,
        onclick: aoClicar,
      },
      icone(classeIcone),
    );
  }

  function mudarZoom(passo: number) {
    // Mexer no zoom é uma decisão do usuário: o ajuste automático sai de cena
    // até ele pedir de volta.
    ajustarNaLargura = false;
    // A escala corrente pode não estar na lista (veio do ajuste), então
    // procuramos o degrau mais próximo antes de andar.
    const atual = ESCALAS.reduce((melhor, e) =>
      Math.abs(e - escala) < Math.abs(melhor - escala) ? e : melhor,
    );
    const i = ESCALAS.indexOf(atual);
    const novo = ESCALAS[Math.min(ESCALAS.length - 1, Math.max(0, i + passo))];
    if (novo === escala) return;
    escala = novo;
    for (const p of paginas) p.definirEscala(escala);
    sincronizar();
  }

  /**
   * Faz a área de preview ocupar o que resta da janela.
   *
   * Em CSS isto seria `calc(100vh - <altura do que está acima>)`, mas essa
   * altura varia: o selo encolhe, a zona recolhe, a barra quebra em duas linhas
   * em janela estreita. Com uma constante chutada o preview extrapolava a
   * janela -- começava a 555px do topo com 570px de altura numa tela de 860, e
   * a metade de baixo ficava fora do alcance da rolagem interna.
   *
   * Medir a posição real resolve para qualquer combinação.
   */
  function ajustarAlturaDaArea() {
    const topo = areaPaginas.getBoundingClientRect().top;
    // Respiro no rodapé, para a área não colar na borda da janela.
    const disponivel = window.innerHeight - topo - 24;
    const altura = Math.max(360, disponivel);
    areaPaginas.style.height = `${altura}px`;
    painel.style.maxHeight = `${altura}px`;
  }

  /** Volta a página para a largura da área. */
  function ajustarLargura() {
    const primeira = estado.dimensoes[0];
    if (!primeira) return;
    ajustarNaLargura = true;
    escala = escalaParaCaber(primeira.larguraExibida);
    for (const p of paginas) p.definirEscala(escala);
    sincronizar();
  }

  function montarPainel(ocupado: boolean) {
    const porTipo = new Map<TipoDado | "manual", Marcacao[]>();
    for (const m of estado.marcacoes) {
      const lista = porTipo.get(m.tipo) ?? [];
      lista.push(m);
      porTipo.set(m.tipo, lista);
    }

    const tipos = el(
      "ul",
      { class: "fpdf-tarjar__tipos" },
      ...TIPOS_ORDENADOS.filter((t) => porTipo.has(t)).map((t) => {
        const achados = porTipo.get(t) ?? [];
        const ligado = achados.some((m) => m.ativa);
        const id = `tipo-${t}`;
        return el(
          "li",
          { class: "fpdf-tarjar__tipo" },
          el("input", {
            type: "checkbox",
            id,
            checked: ligado,
            disabled: ocupado,
            onchange: (ev: Event) =>
              despachar({
                tipo: "alternarTipo",
                alvo: t,
                ativa: (ev.target as HTMLInputElement).checked,
              }),
          }),
          el("label", { for: id }, rotuloDoTipo(t, achados.length !== 1)),
          el("span", { class: "fpdf-tarjar__tipo-contagem" }, String(achados.length)),
        );
      }),
    );

    const ocorrencias = el(
      "ul",
      { class: "fpdf-tarjar__ocorrencias" },
      ...estado.marcacoes.map((m) =>
        el(
          "li",
          {},
          el(
            "button",
            {
              type: "button",
              class: "fpdf-tarjar__ocorrencia",
              onclick: () => {
                realce = m.id;
                paginas.find((p) => p.numero === m.pagina)?.raiz.scrollIntoView({
                  block: "center",
                  behavior: "smooth",
                });
                sincronizar();
              },
            },
            // A amostra JA VEM mascarada do nucleo: uma captura de tela desta
            // propria ferramenta nao pode vazar o dado que ela existe para
            // esconder.
            el("span", { class: "fpdf-tarjar__amostra" }, m.amostra),
            el("span", { class: "fpdf-tarjar__pagina-num" }, `p. ${m.pagina}`),
          ),
        ),
      ),
    );

    const avisoSemTexto =
      estado.paginasSemTexto.length > 0
        ? el(
            "p",
            { class: "fpdf-opcoes__ajuda" },
            `${estado.paginasSemTexto.length} página(s) sem texto extraível — provavelmente digitalização sem OCR. A detecção automática não alcança essas páginas: use o modo de desenhar tarja, ou passe antes pelo OCR.`,
          )
        : null;

    repor(
      painel,
      el("h3", {}, `${estado.marcacoes.length} ocorrencia(s)`),
      tipos,
      avisoSemTexto,
      ocorrencias,
    );
  }

  const cancelarPonte = ponte().aoMudar(() => sincronizar());

  // Redimensionar a janela muda a largura útil: enquanto o ajuste automático
  // estiver ligado, a página acompanha.
  let esperaRedimensionar: number | null = null;
  const aoRedimensionar = () => {
    if (paginas.length === 0) return;
    // A altura acompanha de imediato: é só uma medida, e ver a área encolher
    // com atraso incomoda mais do que o custo de recalcular.
    ajustarAlturaDaArea();
    if (!ajustarNaLargura) return;
    if (esperaRedimensionar !== null) clearTimeout(esperaRedimensionar);
    // A escala, não: redesenhar o canvas a cada pixel de arrasto seria caro.
    esperaRedimensionar = window.setTimeout(() => ajustarLargura(), 200);
  };
  window.addEventListener("resize", aoRedimensionar);
  sincronizar();

  return {
    raiz,
    destruir() {
      cancelado = true;
      window.removeEventListener("resize", aoRedimensionar);
      if (esperaRedimensionar !== null) clearTimeout(esperaRedimensionar);
      cancelarPonte();
      desmontarPaginas();
      progresso.destruir();
      desinstalarMedidorDeTexto();
      void fonte?.destruir?.();
    },
  };
}

function descreverErro(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
