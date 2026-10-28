import { acoesDoNumero } from "@comum/ui/acoesNumeroProcesso";
import { h, icone } from "@comum/ui/dom";
import { criarMenu } from "@comum/ui/menu";
import { dataHora, quando } from "../../modelo/dias";
import type { Visita } from "../../modelo/tipos";

export interface ApoioItem {
  agora: number;
  selecionado: boolean;
  /** null = Favoritos inativo (sem estrela e sem item de menu). */
  favorito: boolean | null;
}

export interface AcoesItem {
  abrir(v: Visita, novaAba: boolean): void;
  alternarSelecao(v: Visita, marcado: boolean): void;
  alternarFavorito?(v: Visita): void;
  copiar(v: Visita): void;
  /** Copia o texto e diz se deu certo (botao ao lado do numero); sem ele, usa o clipboard do documento. */
  copiarTexto?(texto: string): Promise<boolean>;
  remover(v: Visita): void;
}

const novaAba = (ev: Event): boolean => {
  const m = ev as MouseEvent;
  return !!(m.ctrlKey || m.metaKey);
};

/** Linha de apoio: quando, quantas vezes, unidade e interessados. */
function textoApoio(v: Visita, agora: number): string {
  const partes = [quando(v.ultima, agora)];
  if (v.vezes > 1) partes.push(`${v.vezes} visitas`);
  const sigla = v.unidades[0]?.sigla;
  if (sigla) partes.push(sigla);
  const inte = v.interessados ?? [];
  if (inte.length) partes.push(inte.slice(0, 2).join(", ") + (inte.length > 2 ? ` +${inte.length - 2}` : ""));
  return partes.join(" · ");
}

export function renderItem(v: Visita, a: ApoioItem, acoes: AcoesItem): HTMLLIElement {
  const sigiloso = v.nivel === "sigiloso";
  const selo = v.nivel === "sigiloso" || v.nivel === "restrito";
  const favoritavel = a.favorito !== null && !!acoes.alternarFavorito;

  const menu = criarMenu({
    rotulo: `Mais ações para ${v.protocolo}`,
    icone: "menu",
    classe: "spro-botao-icone pequeno spro-lista-acao",
    itens: () => [
      { rotulo: "Abrir em outra aba", icone: "saida", fazer: () => acoes.abrir(v, true) },
      { rotulo: "Copiar número", icone: "copiar", fazer: () => acoes.copiar(v) },
      favoritavel
        ? {
            rotulo: a.favorito ? "Tirar dos monitorados" : "Monitorar",
            icone: a.favorito ? "alvoAtivo" : "alvo",
            fazer: () => acoes.alternarFavorito?.(v),
          }
        : null,
      "-",
      { rotulo: "Remover do histórico", icone: "lixeira", perigo: true, fazer: () => acoes.remover(v) },
    ],
  });

  return h(
    "li",
    {
      class: `spro-lista-item${a.selecionado ? " spro-lista-item-selecionado" : ""}`,
      "data-id": v.id,
      title: `Primeira visita: ${dataHora(v.primeira)}`,
    },
    h(
      "span",
      { class: "spro-lista-sel-caixa" },
      h("input", {
        type: "checkbox",
        class: "spro-lista-sel",
        "aria-label": `Selecionar ${v.protocolo}`,
        checked: a.selecionado,
        onchange: (ev) => acoes.alternarSelecao(v, (ev.target as HTMLInputElement).checked),
      }),
    ),
    favoritavel
      ? h(
          "button",
          {
            type: "button",
            class: "spro-lista-estrela",
            "aria-pressed": String(!!a.favorito),
            "aria-label": a.favorito ? `Tirar ${v.protocolo} dos monitorados` : `Monitorar ${v.protocolo}`,
            title: a.favorito ? "Tirar dos monitorados" : "Monitorar",
            onclick: () => acoes.alternarFavorito?.(v),
          },
          a.favorito ? h("span", { style: "color:#e0a100" }, icone("alvoAtivo", 15)) : icone("alvo", 15),
        )
      : null,
    h(
      "span",
      { class: "spro-lista-proto-cel" },
      h(
        "a",
        {
          class: "spro-lista-protocolo",
          href: "#",
          title: "Abrir o processo (Ctrl+clique abre em outra aba)",
          onclick: (ev) => {
            ev.preventDefault();
            acoes.abrir(v, novaAba(ev));
          },
        },
        v.protocolo,
      ),
      acoesDoNumero({
        protocolo: v.protocolo,
        doc: document,
        compacto: true,
        aoAbrirNovaAba: () => acoes.abrir(v, true),
        copiar: acoes.copiarTexto,
      }),
    ),
    selo
      ? h(
          "span",
          {
            class: "spro-pilula spro-lista-selo",
            title: sigiloso ? "Processo sigiloso" : "Processo restrito",
            style: `--tom:var(${sigiloso ? "--spro-perigo" : "--spro-aviso"})`,
          },
          icone("cadeado", 11),
          sigiloso ? "sigiloso" : "restrito",
        )
      : null,
    h(
      "div",
      { class: "spro-lista-principal" },
      v.tipo ? h("span", { class: "spro-lista-tipo" }, v.tipo) : null,
      !sigiloso && v.especificacao ? h("strong", { class: "spro-lista-esp" }, v.especificacao) : null,
      !v.tipo && (sigiloso || !v.especificacao) ? h("span", { class: "spro-lista-tipo" }, "(sem descrição)") : null,
    ),
    h("div", { class: "spro-lista-apoio" }, textoApoio(v, a.agora)),
    menu,
  );
}
