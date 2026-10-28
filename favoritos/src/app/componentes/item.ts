import { acoesDoNumero } from "@comum/ui/acoesNumeroProcesso";
import { h, icone } from "@comum/ui/dom";
import { criarMenu } from "@comum/ui/menu";
import type { DocumentoFavorito, Etiqueta, Favorito, Pasta, ResumoPrazo } from "../../modelo/tipos";

export interface ApoioItem {
  pastas: ReadonlyMap<string, Pasta>;
  etiquetas: ReadonlyMap<string, Etiqueta>;
  resumo?: ResumoPrazo;
  selecionado: boolean;
  arrastavel: boolean;
  /** Rótulo da outra lista ("Pessoal" ou a sigla), ou null quando só existe uma. */
  outraLista: string | null;
  /** Resumo do que mudou desde o último "visto" (vazio = nada). */
  novidade?: string;
  /** "hoje", "amanhã", "desde 28/09/2026"... */
  lembrete?: string;
  /** Lembrete para hoje ou atrasado. */
  lembreteVencido?: boolean;
  /** Fora da unidade na última leitura. */
  fora?: boolean;
}

export interface AcoesItem {
  abrir(f: Favorito, novaAba: boolean): void;
  /** Copia o texto e diz se deu certo (botao ao lado do numero); sem ele, usa o clipboard do documento. */
  copiarTexto?(texto: string): Promise<boolean>;
  editar(f: Favorito): void;
  alternarSelecao(f: Favorito, marcado: boolean): void;
  remover(f: Favorito): void;
  moverLista(f: Favorito): void;
  moverOrdem(f: Favorito, direcao: -1 | 1): void;
  /** Ausente quando o mapa não está disponível (testes, pacote sem Leaflet). */
  mapa?(f: Favorito): void;
  marcarVisto?(f: Favorito): void;
  lembrete?(f: Favorito): void;
  abrirDocumento?(f: Favorito, d: DocumentoFavorito, novaAba: boolean): void;
  removerDocumento?(f: Favorito, d: DocumentoFavorito): void;
  /** Fixa ou desafixa no topo da lista. */
  fixar?(f: Favorito): void;
}

/** O que a faixa colorida à esquerda do item conta, do mais urgente para o menos. */
function estadoDoItem(a: ApoioItem): string | undefined {
  if (a.resumo?.situacao === "atrasado") return "atrasado";
  if (a.resumo?.situacao === "hoje" || a.lembreteVencido) return "hoje";
  if (a.novidade) return "novidade";
  return undefined;
}

const TOM_PRAZO: Record<string, string> = {
  atrasado: "var(--spro-perigo)",
  hoje: "var(--spro-aviso)",
  noPrazo: "var(--spro-ok)",
};

export function renderItem(f: Favorito, a: ApoioItem, acoes: AcoesItem): HTMLLIElement {
  const descricao = [f.tipo, f.especificacao].filter(Boolean).join(" · ");
  const titulo = f.titulo || descricao || "(sem descrição)";
  const pasta = f.pasta ? a.pastas.get(f.pasta) : undefined;
  const etiquetas = f.etiquetas.map((id) => a.etiquetas.get(id)).filter((e): e is Etiqueta => !!e && e.removidoEm === undefined);
  const novaAba = (ev: Event) => {
    const m = ev as MouseEvent;
    return !!(m.ctrlKey || m.metaKey);
  };

  const menu = criarMenu({
    rotulo: `Mais ações para ${f.protocolo}`,
    icone: "menu",
    classe: "spro-botao-icone pequeno fav-acao",
    itens: () => [
      { rotulo: "Editar", icone: "lapis", fazer: () => acoes.editar(f) },
      acoes.fixar ? { rotulo: f.fixado ? "Desafixar" : "Fixar no topo", icone: "pino", fazer: () => acoes.fixar?.(f) } : null,
      { rotulo: "Abrir em outra aba", icone: "saida", fazer: () => acoes.abrir(f, true) },
      a.novidade && acoes.marcarVisto ? { rotulo: "Marcar como visto", icone: "olho", fazer: () => acoes.marcarVisto?.(f) } : null,
      acoes.lembrete ? { rotulo: "Lembrete…", icone: "sino", fazer: () => acoes.lembrete?.(f) } : null,
      acoes.mapa ? { rotulo: "Local no mapa…", icone: "local", fazer: () => acoes.mapa?.(f) } : null,
      "-",
      a.outraLista ? { rotulo: `Mover para ${a.outraLista}`, icone: "mover", fazer: () => acoes.moverLista(f) } : null,
      { rotulo: "Mover para cima", icone: "setaCima", fazer: () => acoes.moverOrdem(f, -1) },
      { rotulo: "Mover para baixo", icone: "setaBaixo", fazer: () => acoes.moverOrdem(f, 1) },
      "-",
      { rotulo: "Remover", icone: "lixeira", perigo: true, fazer: () => acoes.remover(f) },
    ],
  });

  const estado = estadoDoItem(a);
  return h(
    "li",
    {
      class: `fav-item${a.selecionado ? " fav-item-selecionado" : ""}${f.fixado ? " fav-item-fixado" : ""}`,
      "data-id": f.id,
      "data-estado": estado,
      draggable: a.arrastavel ? "true" : undefined,
    },
    h(
      "span",
      { class: "fav-sel-caixa" },
      h("input", {
        type: "checkbox",
        class: "fav-sel",
        "aria-label": `Selecionar ${f.protocolo}`,
        checked: a.selecionado,
        onchange: (ev) => acoes.alternarSelecao(f, (ev.target as HTMLInputElement).checked),
      }),
    ),
    a.arrastavel ? h("span", { class: "fav-alca", title: "Arraste para reordenar", "aria-hidden": "true" }, icone("alca", 14)) : null,
    h(
      "div",
      { class: "fav-cabeca-item" },
      h(
        "a",
        {
          class: "fav-protocolo",
          href: "#",
          title: "Abrir o processo (Ctrl+clique abre em outra aba)",
          onclick: (ev) => {
            ev.preventDefault();
            acoes.abrir(f, novaAba(ev));
          },
        },
        f.protocolo,
      ),
      acoesDoNumero({
        protocolo: f.protocolo,
        doc: document,
        compacto: true,
        aoAbrirNovaAba: () => acoes.abrir(f, true),
        copiar: acoes.copiarTexto,
      }),
      f.sigiloso
        ? h(
            "span",
            { class: "spro-pilula fav-selo", title: "Processo sigiloso", style: "--tom:var(--spro-perigo)" },
            icone("cadeado", 11),
            "sigiloso",
          )
        : null,
    ),
    h(
      "div",
      { class: "fav-principal" },
      a.novidade
        ? h(
            "span",
            { class: "spro-pilula fav-novidade", title: `O que mudou desde a última vez que você viu: ${a.novidade}` },
            icone("brilho", 12),
            h("span", {}, a.novidade),
          )
        : null,
      h(
        "button",
        {
          type: "button",
          class: "fav-titulo",
          title: descricao && f.titulo ? `${titulo} — ${descricao}` : "Editar monitorado",
          onclick: () => acoes.editar(f),
        },
        titulo,
      ),
      f.documentos?.length
        ? h(
            "details",
            { class: "fav-docs" },
            h(
              "summary",
              {},
              icone("documento", 12),
              ` ${f.documentos.length} ${f.documentos.length === 1 ? "documento monitorado" : "documentos monitorados"}`,
              icone("chevron", 12),
            ),
            h(
              "ul",
              {},
              ...f.documentos.map((d) =>
                h(
                  "li",
                  {},
                  h(
                    "button",
                    {
                      type: "button",
                      class: "fav-doc-abrir",
                      title: "Abrir o documento (Ctrl+clique abre em outra aba)",
                      onclick: (ev) => acoes.abrirDocumento?.(f, d, novaAba(ev)),
                    },
                    `${d.numero} — ${d.titulo}`,
                  ),
                  acoes.removerDocumento
                    ? h(
                        "button",
                        {
                          type: "button",
                          class: "spro-botao-icone pequeno",
                          "aria-label": `Tirar ${d.numero} dos documentos monitorados`,
                          title: "Tirar dos documentos monitorados",
                          onclick: () => acoes.removerDocumento?.(f, d),
                        },
                        icone("fechar", 12),
                      )
                    : null,
                ),
              ),
            ),
          )
        : null,
    ),
    h(
      "div",
      { class: "fav-meta" },
      pasta
        ? h(
            "span",
            { class: "spro-pilula fav-pasta", title: `Pasta ${pasta.nome}`, style: pasta.cor ? `--cor-pasta:${pasta.cor}` : undefined },
            icone("pasta", 12),
            h("span", {}, pasta.nome),
          )
        : null,
      ...etiquetas.map((e) =>
        h("span", { class: "fav-etiqueta", style: `--cor:${e.cor}`, title: `Etiqueta ${e.nome}` }, h("span", {}, e.nome)),
      ),
      a.resumo
        ? h(
            "span",
            {
              class: `spro-pilula fav-prazo fav-prazo-${a.resumo.situacao}`,
              title: a.resumo.dica,
              style: TOM_PRAZO[a.resumo.situacao] ? `--tom:${TOM_PRAZO[a.resumo.situacao]}` : undefined,
            },
            icone("relogio", 12),
            h("span", {}, a.resumo.texto),
          )
        : null,
      f.lembrete && a.lembrete
        ? h(
            "button",
            {
              type: "button",
              class: `spro-pilula fav-lembrete${a.lembreteVencido ? " fav-lembrete-vencido" : ""}`,
              title: `Lembrete ${a.lembrete}${f.lembrete.texto ? `: ${f.lembrete.texto}` : ""}`,
              onclick: () => acoes.lembrete?.(f),
            },
            icone("sino", 12),
            h("span", {}, f.lembrete.texto ? `${a.lembrete} · ${f.lembrete.texto}` : a.lembrete),
          )
        : null,
      a.fora
        ? h(
            "span",
            { class: "spro-pilula fav-fora", title: "Fora da sua unidade na última leitura" },
            icone("saida", 12),
            h("span", {}, "fora"),
          )
        : null,
      f.nota ? h("span", { class: "fav-nota", title: f.nota, "aria-label": `Nota: ${f.nota}` }, icone("nota", 14)) : null,
      f.local && acoes.mapa
        ? h(
            "button",
            {
              type: "button",
              class: "fav-local",
              title: "Ver o local no mapa",
              "aria-label": "Ver o local no mapa",
              onclick: () => acoes.mapa?.(f),
            },
            icone("local", 14),
          )
        : null,
    ),
    h(
      "div",
      { class: "fav-acoes" },
      h(
        "button",
        {
          type: "button",
          class: "spro-botao-icone pequeno fav-acao",
          title: "Editar",
          "aria-label": `Editar ${f.protocolo}`,
          onclick: () => acoes.editar(f),
        },
        icone("lapis", 15),
      ),
      acoes.lembrete
        ? h(
            "button",
            {
              type: "button",
              class: "spro-botao-icone pequeno fav-acao",
              title: "Lembrete",
              "aria-label": `Lembrete de ${f.protocolo}`,
              onclick: () => acoes.lembrete?.(f),
            },
            icone("sino", 15),
          )
        : null,
      acoes.fixar
        ? h(
            "button",
            {
              type: "button",
              class: "spro-botao-icone pequeno fav-acao fav-fixar",
              "aria-pressed": String(!!f.fixado),
              "aria-label": f.fixado ? "Desafixar" : "Fixar no topo",
              title: f.fixado ? "Desafixar (deixa de ficar no topo)" : "Fixar no topo da lista",
              onclick: () => acoes.fixar?.(f),
            },
            icone(f.fixado ? "pinoCheio" : "pino", 15),
          )
        : null,
      menu,
    ),
  );
}
