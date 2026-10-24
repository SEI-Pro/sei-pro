/**
 * Desenho da capa. A raiz (`#capaProcessoPro`, o id que o Agente de IA e o Estilo Avançado procuram) nasce uma vez;
 * cada parte (faixa de cards, campos, lado) é trocada sozinha, sem apagar o que outros módulos puserem na raiz (o
 * cartão de sugestão do Agente entra como primeiro filho). Texto vindo do SEI entra sempre como nó de texto.
 */
import { type Filho, h, icone, type NomeIcone } from "@comum/ui/dom";
import type { Card } from "./cards";
import { gerarQr } from "./qr";
import type { VistaCapa } from "./vista";

export const ID_DA_CAPA = "capaProcessoPro";

export interface AcoesDaCapa {
  calcular(): void;
  cancelar(): void;
  abrirHistorico(): void;
  copiarResumo(): void;
  copiarTexto(texto: string): void;
  copiarLink(): void;
  tentarDeNovo(): void;
}

export interface PartesDaCapa {
  raiz: HTMLElement;
  faixa: HTMLElement;
  /** Ações da faixa (cancelar o cálculo), fora da lista de cards. */
  faixaAcoes: HTMLElement;
  barra: HTMLElement;
  campos: HTMLElement;
  lado: HTMLElement;
  qr: HTMLElement;
  info: HTMLElement;
}

export function criarRaiz(): PartesDaCapa {
  const faixa = h("div", { class: "spro-c-faixa", role: "list", "aria-label": "Resumo do processo" });
  const faixaAcoes = h("div", { class: "spro-c-faixa-acoes" });
  const barra = h("div", { class: "spro-c-barra" });
  const campos = h("dl", { class: "spro-c-campos" });
  const qr = h("div", { class: "spro-c-qr" });
  const info = h("div", { class: "spro-c-info" });
  const lado = h("aside", { class: "spro-c-lado" }, qr, info);
  const raiz = h(
    "div",
    { id: ID_DA_CAPA, class: "spro-c-raiz", "data-spro-capa": "1" },
    faixa,
    faixaAcoes,
    h("div", { class: "spro-c-corpo" }, h("div", { class: "spro-c-principal" }, barra, campos), lado),
  );
  return { raiz, faixa, faixaAcoes, barra, campos, lado, qr, info };
}

// --- Faixa de cards --------------------------------------------------------------------------------------------

function textoDoCard(c: Card, rotuloExtra?: Filho): Filho[] {
  return [
    h("span", { class: "spro-c-rotulo" }, rotuloExtra, c.rotulo),
    h("strong", { class: `spro-c-valor${/^\d/.test(c.valor) || c.valor === "—" ? "" : " texto"}` }, c.valor),
    c.detalhe ? h("span", { class: "spro-c-detalhe" }, c.detalhe) : null,
  ];
}

function cardPronto(c: Card): HTMLElement {
  return h(
    "div",
    {
      class: `spro-c-card${c.alerta ? " alerta" : ""}`,
      "data-id": c.id,
      "aria-label": c.alerta ? `Atenção. ${c.rotulo}: ${c.valor}. ${c.detalhe ?? ""}` : undefined,
    },
    ...textoDoCard(c, c.alerta ? icone("alerta", 12) : null),
  );
}

function cardPendente(c: Card, v: VistaCapa, a: AcoesDaCapa): HTMLElement {
  const coleta = v.coleta;
  const ocupado = coleta.fase === "coletando";
  const detalhe = ocupado
    ? coleta.total > 0
      ? `Calculando... página ${coleta.feito} de ${coleta.total}`
      : "Calculando..."
    : coleta.fase === "erro"
      ? `${coleta.mensagem} Tentar de novo`
      : "Calcular";
  return h(
    "button",
    {
      type: "button",
      class: `spro-c-card pendente${coleta.fase === "erro" ? " erro" : ""}`,
      "data-id": c.id,
      "aria-busy": ocupado ? "true" : undefined,
      "aria-label": ocupado
        ? `${c.rotulo}: ${detalhe}`
        : `${c.rotulo}: ${detalhe === "Calcular" ? "calcular a partir do histórico do processo" : detalhe}`,
      onclick: () => {
        if (!ocupado) a.calcular();
      },
    },
    h("span", { class: "spro-c-rotulo" }, c.rotulo),
    h("strong", { class: "spro-c-valor" }, c.valor),
    h("span", { class: "spro-c-detalhe" }, detalhe),
  );
}

export function desenharFaixa(p: PartesDaCapa, v: VistaCapa, a: AcoesDaCapa): void {
  // Cada card é um item da lista; o card pendente é um botão, por isso o item o envolve (um botão com role=listitem
  // deixaria de ser botão para o leitor de tela).
  p.faixa.replaceChildren(
    ...v.cards.map((c) =>
      h("div", { class: "spro-c-item", role: "listitem" }, c.estado === "pendente" ? cardPendente(c, v, a) : cardPronto(c)),
    ),
  );
  p.faixaAcoes.replaceChildren(
    ...(v.coleta.fase === "coletando"
      ? [h("button", { type: "button", class: "spro-c-acao pequeno contorno", onclick: () => a.cancelar() }, "Cancelar o cálculo")]
      : []),
  );
}

// --- Campos --------------------------------------------------------------------------------------------------------

function campo(nome: string, ic: NomeIcone, id: string, ...valor: Filho[]): HTMLElement {
  return h("div", { class: "spro-c-campo", "data-campo": id }, h("dt", {}, icone(ic, 15), nome), h("dd", {}, ...valor));
}

const copiavel = (a: AcoesDaCapa, texto: string, forte = false): HTMLElement =>
  h(
    "button",
    {
      type: "button",
      class: `spro-c-copiavel${forte ? " forte" : ""}`,
      "aria-label": `Copiar: ${texto}`,
      onclick: () => a.copiarTexto(texto),
    },
    texto,
  );

function listaCopiavel(a: AcoesDaCapa, itens: readonly string[]): Filho[] {
  return itens.length ? itens.map((t) => copiavel(a, t)) : [h("span", { class: "spro-c-nota" }, "Nenhum")];
}

function marcadorItem(a: AcoesDaCapa, m: VistaCapa["marcadores"][number]): HTMLElement {
  return h(
    "span",
    { class: "spro-c-marcador" },
    m.icone ? h("img", { src: m.icone, alt: "" }) : icone("etiqueta", 15),
    copiavel(a, m.nome, true),
    m.prazo ? h("span", { class: `spro-c-chip ${m.prazo.nivel}` }, icone("relogio", 11), m.prazo.rotulo) : null,
    m.texto ? copiavel(a, m.texto) : null,
  );
}

/** O que ocupa o lugar dos campos do formulário enquanto não vieram (ou quando não vêm). */
function estadoDosDados(v: VistaCapa, a: AcoesDaCapa): HTMLElement | null {
  switch (v.dados) {
    case "carregando":
      return campo(
        "Dados do processo",
        "nota",
        "dados",
        h("div", { class: "spro-c-esqueleto", "aria-busy": "true", "aria-label": "Carregando" }),
        h("div", { class: "spro-c-esqueleto", style: "width:60%" }),
      );
    case "indisponivel":
      return campo(
        "Dados do processo",
        "nota",
        "dados",
        h(
          "span",
          { class: "spro-c-erro", role: "alert" },
          icone("alerta", 13),
          "Não foi possível carregar autuação, especificação, assuntos e interessados.",
          h("button", { type: "button", class: "spro-c-acao pequeno", onclick: () => a.tentarDeNovo() }, "Tentar de novo"),
        ),
      );
    case "consultas":
      return campo(
        "Dados do processo",
        "nota",
        "dados",
        h(
          "p",
          { class: "spro-c-nota" },
          "Autuação, especificação, assuntos e interessados não aparecem: as consultas adicionais estão desativadas nas opções do SEI Pro.",
        ),
      );
    case "fechado":
      return campo(
        "Dados do processo",
        "nota",
        "dados",
        h(
          "p",
          { class: "spro-c-nota" },
          "Autuação, especificação, assuntos e interessados aparecem quando o processo está aberto na sua unidade.",
        ),
      );
    default:
      return null;
  }
}

export function desenharCampos(p: PartesDaCapa, v: VistaCapa, a: AcoesDaCapa): void {
  const linhas: Array<HTMLElement | null> = [];
  linhas.push(
    campo(
      "Processo",
      "pasta",
      "processo",
      copiavel(a, v.protocolo, true),
      h(
        "button",
        { type: "button", class: "spro-c-icone-botao", "aria-label": "Copiar o link do processo", onclick: () => a.copiarLink() },
        icone("link", 15),
      ),
    ),
  );
  if (!v.sigiloso) {
    const dados = v.dados === "pronto";
    if (dados && v.autuacao) linhas.push(campo("Data de autuação", "calendario", "autuacao", copiavel(a, v.autuacao)));
  }
  linhas.push(
    campo("Tipo do processo", "documento", "tipo", v.tipo ? copiavel(a, v.tipo) : h("span", { class: "spro-c-nota" }, "Não informado")),
  );
  if (!v.sigiloso) {
    if (v.dados === "pronto") {
      linhas.push(
        campo(
          "Especificação",
          "nota",
          "especificacao",
          v.urgente ? h("span", { class: "spro-c-urgente" }, "URGENTE") : null,
          v.especificacao ? copiavel(a, v.especificacao) : h("span", { class: "spro-c-nota" }, "Sem especificação"),
        ),
        campo("Assuntos", "etiqueta", "assuntos", ...listaCopiavel(a, v.assuntos)),
        campo("Interessados", "pessoa", "interessados", ...listaCopiavel(a, v.interessados)),
      );
    } else {
      linhas.push(estadoDosDados(v, a));
    }
  }
  linhas.push(campo("Nível de acesso", v.nivel.icone, "nivel", copiavel(a, v.nivel.rotulo)));
  if (!v.sigiloso) {
    linhas.push(
      campo(
        "Marcador",
        "etiqueta",
        "marcador",
        ...(v.marcadores.length || v.prazoNativo
          ? [
              ...v.marcadores.map((m) => marcadorItem(a, m)),
              v.prazoNativo
                ? h(
                    "span",
                    { class: `spro-c-chip ${v.prazoNativo.nivel === "vencido" ? "vencido" : "ok"}` },
                    icone("relogio", 11),
                    `Prazo do SEI: ${v.prazoNativo.data} (${v.prazoNativo.estado})`,
                  )
                : null,
            ]
          : [h("span", { class: "spro-c-nota" }, "Sem marcador")]),
      ),
    );
    if (v.blocoInterno) linhas.push(campo("Bloco interno", "camadas", "bloco", copiavel(a, v.blocoInterno)));
    if (v.dados === "pronto") {
      linhas.push(
        campo(
          "Observações",
          "nota",
          "observacoes",
          ...(v.observacoes.length
            ? v.observacoes.map((o) => copiavel(a, `${o.unidade}: ${o.observacao}`))
            : [h("span", { class: "spro-c-nota" }, "Sem observações")]),
        ),
      );
    }
  }
  p.campos.replaceChildren(...(linhas.filter(Boolean) as HTMLElement[]));
}

export function desenharBarra(p: PartesDaCapa, v: VistaCapa, a: AcoesDaCapa): void {
  const botoes: HTMLElement[] = [];
  if (!v.sigiloso) {
    botoes.push(
      h(
        "button",
        { type: "button", class: "spro-c-acao", "data-acao": "historico", onclick: () => a.abrirHistorico() },
        icone("historico", 15),
        "Histórico de tramitação do processo",
      ),
    );
  }
  botoes.push(
    h(
      "button",
      { type: "button", class: "spro-c-acao contorno", "data-acao": "resumo", onclick: () => a.copiarResumo() },
      icone("copiar", 14),
      "Copiar resumo",
    ),
  );
  p.barra.replaceChildren(...botoes);
}

// --- QR code e aviso do SEI --------------------------------------------------------------------------------------

const NS = "http://www.w3.org/2000/svg";

/** O QR como SVG (um só `path`), com a zona de silêncio de 4 módulos e fundo branco: o escuro do SEI não o inverte. */
export function desenharQr(doc: Document, texto: string): SVGSVGElement | null {
  const matriz = gerarQr(texto);
  if (!matriz) return null;
  const n = matriz.length;
  const margem = 4;
  const lado = n + margem * 2;
  const svg = doc.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${lado} ${lado}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "QR code para abrir o processo no celular");
  svg.setAttribute("shape-rendering", "crispEdges");
  const fundo = doc.createElementNS(NS, "rect");
  fundo.setAttribute("width", String(lado));
  fundo.setAttribute("height", String(lado));
  fundo.setAttribute("fill", "#ffffff");
  const caminho: string[] = [];
  matriz.forEach((linha, r) => {
    let c = 0;
    while (c < n) {
      if (!linha[c]) {
        c++;
        continue;
      }
      let fim = c;
      while (fim < n && linha[fim]) fim++;
      caminho.push(`M${c + margem} ${r + margem}h${fim - c}v1h-${fim - c}z`);
      c = fim;
    }
  });
  const modulos = doc.createElementNS(NS, "path");
  modulos.setAttribute("d", caminho.join(""));
  modulos.setAttribute("fill", "#000000");
  svg.append(fundo, modulos);
  return svg;
}

export function desenharLado(p: PartesDaCapa, v: VistaCapa, doc: Document): void {
  const svg = desenharQr(doc, v.linkPermanente);
  p.qr.replaceChildren(...(svg ? [svg, h("span", {}, "Aponte a câmera para abrir o processo no celular")] : []));
}

/** O aviso do SEI ("Processo aberto somente na unidade X"): uma cópia do nó original, sem ids repetidos. */
export function copiarInfo(p: PartesDaCapa, origem: Element | null): void {
  if (!origem) {
    p.info.replaceChildren();
    return;
  }
  const copia = [...origem.childNodes].map((n) => n.cloneNode(true));
  for (const n of copia)
    if (n.nodeType === 1) for (const el of [n as Element, ...(n as Element).querySelectorAll("[id]")]) el.removeAttribute("id");
  p.info.replaceChildren(...copia);
}
