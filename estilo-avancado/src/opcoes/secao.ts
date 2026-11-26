import {
  CHAVE_TEMA,
  CHAVE_TEMA_CACHE,
  CONFIG_PADRAO,
  type ConfigTema,
  type ConjuntoIcones,
  esquemaResolvido,
  type ModoTema,
  normalizarConfig,
} from "@comum/tema/config";
import { derivarBarra, type Esquema, FUNDOS, lerHex, PALETAS } from "@comum/tema/paleta";
import { gerarTokens } from "@comum/tema/tokens";
import { h } from "@comum/ui/dom";
import { DUOTOM, svgDoIcone } from "../icones/css";
import { svgPastilha } from "../icones/pastilhas";

/** O que a seção precisa do navegador: injetado para o teste não depender do chrome.* */
export interface DepsAparencia {
  ler: () => Promise<unknown>;
  gravar: (cfg: ConfigTema) => Promise<void>;
  sistemaEscuro: () => boolean;
}

const MODOS: { id: ModoTema; rotulo: string }[] = [
  { id: "claro", rotulo: "Claro" },
  { id: "escuro", rotulo: "Escuro" },
  { id: "auto", rotulo: "Automático" },
];

/** SEI Pro Lab: conjuntos de ícones da casca. */
const CONJUNTOS: { id: ConjuntoIcones; rotulo: string }[] = [
  { id: "moderno", rotulo: "Moderno" },
  { id: "duotom", rotulo: "Duotom" },
  { id: "pastilhas", rotulo: "Pastilhas" },
  { id: "originais", rotulo: "Originais do SEI" },
];
const ICONES_PREVIA = ["lista", "busca", "pastaMais", "relogio", "estrela", "etiqueta", "lapis", "lixeira"];
const DICA_ICONES: Record<ConjuntoIcones, string> = {
  moderno: "Traço de uma cor, que acompanha a cor do tema.",
  duotom: "Vetorial, em traço fino com um preenchimento suave na mesma cor. Acompanha a cor do tema.",
  pastilhas: "Quadradinhos coloridos pela função, no estilo dos botões do próprio SEI.",
  originais: "O Estilo Avançado não troca nenhum ícone: ficam os do SEI e os do SEI Pro.",
};
const svgUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

export const CSS_APARENCIA = `
.spro-ap-corpo{display:grid;gap:0}
.spro-ap-linha{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 12px;align-items:center;padding:14px 20px;border-top:1px solid var(--linha)}
.spro-ap-linha>.spro-ap-rotulo{flex:1 1 200px;min-width:0}
.spro-ap-linha:first-child{border-top:0}
.spro-ap-rotulo{display:grid;gap:2px;line-height:1.35}
.spro-ap-dica{font-size:13px;color:var(--tinta-2)}
.spro-ap-selo{padding:2px 10px;border-radius:999px;background:var(--azul-claro);color:var(--azul);font-size:12px;font-weight:600}
.spro-ap-seg{display:inline-flex;flex-wrap:wrap;max-width:100%;border:1px solid var(--linha);border-radius:10px;overflow:hidden}
.spro-ap-seg button{min-height:38px;padding:0 14px;border:0;background:var(--superficie);color:var(--tinta);font:600 14px var(--texto);cursor:pointer}
.spro-ap-seg button+button{border-left:1px solid var(--linha)}
.spro-ap-seg button[aria-checked="true"]{background:var(--azul);color:var(--sobre-azul)}
.spro-ap-cores{display:grid;gap:10px;padding:14px 20px;border-top:1px solid var(--linha)}
.spro-ap-grade{display:flex;flex-wrap:wrap;gap:8px}
.spro-ap-cor{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:0 12px 0 8px;border:1px solid var(--linha);border-radius:10px;background:var(--superficie);color:var(--tinta);font:600 13px var(--texto);cursor:pointer}
.spro-ap-cor i{width:20px;height:20px;border-radius:6px;border:1px solid rgb(0 0 0/20%)}
.spro-ap-cor[aria-pressed="true"]{border-color:var(--azul);box-shadow:0 0 0 2px var(--azul-claro)}
.spro-ap-livre{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.spro-ap-livre input[type=color]{width:44px;height:38px;padding:2px;border:1px solid var(--linha);border-radius:8px;background:var(--superficie);cursor:pointer}
.spro-ap-aviso{font-size:13px;color:var(--tinta-2);min-height:1.2em}
.spro-ap-previa{margin:0 20px 16px;border:1px solid var(--spro-borda);border-radius:var(--spro-raio-g);overflow:hidden;background:var(--spro-pagina);color:var(--spro-texto);font-family:var(--spro-fonte)}
.spro-ap-previa-barra{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--spro-barra);color:var(--spro-barra-texto);font-weight:600;border-bottom:1px solid var(--spro-barra-borda)}
.spro-ap-previa-barra span{padding:2px 8px;border-radius:6px;background:var(--spro-barra-hover);font-weight:500;font-size:12px}
.spro-ap-previa-corpo{padding:14px;display:grid;gap:10px}
.spro-ap-previa-tab{width:100%;border-collapse:collapse;font-size:13px;background:var(--spro-fundo);border:1px solid var(--spro-borda);border-radius:var(--spro-raio);overflow:hidden}
.spro-ap-previa-tab th{padding:6px 10px;text-align:left;background:var(--spro-fundo-3)}
.spro-ap-previa-tab td{padding:6px 10px;border-top:1px solid var(--spro-borda)}
.spro-ap-previa-tab tr:nth-child(even) td{background:var(--spro-fundo-2)}
.spro-ap-previa a{color:var(--spro-destaque)}
.spro-ap-previa-botoes{display:flex;gap:8px;align-items:center}
.spro-ap-previa button{min-height:34px;padding:0 14px;border-radius:var(--spro-raio);font:600 13px var(--spro-fonte)}
.spro-ap-previa .p{background:var(--spro-destaque);color:var(--spro-destaque-texto);border:1px solid var(--spro-destaque)}
.spro-ap-previa .s{background:var(--spro-fundo);color:var(--spro-texto);border:1px solid var(--spro-borda-forte)}
.spro-ap-rodape{display:flex;gap:8px;flex-wrap:wrap;padding:0 20px 16px}
.spro-ap-previa-icones{display:flex;gap:10px;align-items:center;min-height:24px;color:var(--spro-suave);font-size:12px}
.spro-ap-previa-icones i{display:inline-block;width:22px;height:22px;background:currentColor;-webkit-mask:center/contain no-repeat}
.spro-ap-previa-icones img{width:22px;height:22px}
`;

function chave(ativo: boolean, rotulo: string, aoMudar: (v: boolean) => void): HTMLLabelElement {
  const entrada = h("input", { type: "checkbox", role: "switch", "aria-label": rotulo }) as HTMLInputElement;
  entrada.checked = ativo;
  entrada.addEventListener("change", () => aoMudar(entrada.checked));
  return h("label", { class: "chave" }, entrada, h("span", { class: "trilho" })) as HTMLLabelElement;
}

/** Conteúdo da aparência (sem a casca de `<details>`): usado na seção das opções e no modal da barra do SEI. */
export async function montarCorpoAparencia(deps: DepsAparencia): Promise<{ conteudo: HTMLElement; atualizar: (novo: unknown) => void }> {
  let cfg = normalizarConfig(await deps.ler());

  const previa = h(
    "div",
    { class: "spro-ap-previa", "aria-hidden": "true" },
    h("div", { class: "spro-ap-previa-barra" }, "SEI", h("span", {}, "Controle de Processos")),
    h(
      "div",
      { class: "spro-ap-previa-corpo" },
      h(
        "table",
        { class: "spro-ap-previa-tab" },
        h("tr", {}, h("th", {}, "Processo"), h("th", {}, "Tipo")),
        h("tr", {}, h("td", {}, h("a", { href: "#" }, "00000.000000/2026-00")), h("td", {}, "Ofício")),
        h("tr", {}, h("td", {}, "00000.000001/2026-11"), h("td", {}, "Parecer")),
      ),
      h("div", { class: "spro-ap-previa-icones" }),
      h(
        "div",
        { class: "spro-ap-previa-botoes" },
        h("button", { type: "button", class: "p" }, "Salvar"),
        h("button", { type: "button", class: "s" }, "Cancelar"),
      ),
    ),
  );
  const aviso = h("div", { class: "spro-ap-aviso", role: "status" });
  const linhaModo = h("div", { class: "spro-ap-seg", role: "radiogroup", "aria-label": "Modo do tema" });
  const grade = h("div", { class: "spro-ap-grade" });
  const livre = h("input", { type: "color", "aria-label": "Cor livre da barra" }) as HTMLInputElement;
  const hex = h("code", {}, "");
  const sub = h("div", { class: "spro-ap-corpo" });
  const linhaIcones = h("div", { class: "spro-ap-seg", role: "radiogroup", "aria-label": "Ícones" });
  const dicaIcones = h("span", { class: "spro-ap-dica" }, "");

  /** SEI Pro Lab: grade de tons de fundo de um esquema, com a cor livre. */
  const montarFundos = (esquema: Esquema) => {
    const gradeF = h("div", { class: "spro-ap-grade" });
    const livreF = h("input", { type: "color", "aria-label": `Outra cor de fundo do modo ${esquema}` }) as HTMLInputElement;
    const hexF = h("code", {}, "");
    const campos = esquema === "claro" ? (["tomClaro", "fundoClaro"] as const) : (["tomEscuro", "fundoEscuro"] as const);
    for (const f of FUNDOS[esquema]) {
      gradeF.append(
        h(
          "button",
          {
            type: "button",
            class: "spro-ap-cor",
            "data-fundo": f.id,
            "aria-pressed": "false",
            onclick: () => void salvar({ [campos[0]]: f.id, [campos[1]]: f.cor, ...(cfg.modo === "auto" ? {} : { modo: esquema }) }),
          },
          h("i", { style: `background:${f.cor}` }),
          f.nome,
        ),
      );
    }
    livreF.addEventListener(
      "input",
      () => void salvar({ [campos[0]]: "livre", [campos[1]]: livreF.value, ...(cfg.modo === "auto" ? {} : { modo: esquema }) }, false),
    );
    livreF.addEventListener("change", () => void gravarJa());
    const bloco = h(
      "div",
      { class: "spro-ap-cores" },
      h("strong", {}, esquema === "claro" ? "Tom do fundo no modo claro" : "Tom do fundo no modo escuro"),
      gradeF,
      h("div", { class: "spro-ap-livre" }, "Outra cor:", livreF, hexF),
      h("span", { class: "spro-ap-dica" }, "As camadas, as bordas e a cor da letra se ajustam ao tom para manter a leitura."),
    );
    const desenharF = () => {
      for (const b of gradeF.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.fundo === cfg[campos[0]]));
      livreF.value = cfg[campos[1]];
      hexF.textContent = cfg[campos[1]];
    };
    return { bloco, desenharF };
  };
  const fundoClaro = montarFundos("claro");
  const fundoEscuro = montarFundos("escuro");

  const desenhar = () => {
    const esquema = esquemaResolvido(cfg, deps.sistemaEscuro());
    for (const [k, v] of Object.entries(gerarTokens(cfg, esquema))) previa.style.setProperty(k, v);

    for (const b of linhaModo.querySelectorAll("button")) b.setAttribute("aria-checked", String(b.dataset.modo === cfg.modo));
    for (const b of grade.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.paleta === cfg.paleta));
    livre.value = cfg.corBarra;
    hex.textContent = cfg.corBarra;

    // O aviso vale para a cor escolhida em si (tema claro): escurecer a barra no modo escuro e esperado.
    const d = derivarBarra(cfg.corBarra, "claro");
    const mudou = lerHex(d.barra) && d.barra.toLowerCase() !== cfg.corBarra.toLowerCase();
    aviso.textContent = mudou ? "Ajustamos o tom para manter o texto legível." : "";
    fundoClaro.desenharF();
    fundoEscuro.desenharF();
    for (const b of linhaIcones.querySelectorAll("button")) b.setAttribute("aria-checked", String(b.dataset.icones === cfg.icones));
    dicaIcones.textContent = DICA_ICONES[cfg.icones];
    const caixaIcones = previa.querySelector(".spro-ap-previa-icones");
    if (caixaIcones) {
      caixaIcones.replaceChildren(
        ...(cfg.icones === "originais"
          ? [h("span", {}, "Ícones originais do SEI")]
          : ICONES_PREVIA.map((n) =>
              cfg.icones === "pastilhas"
                ? h("img", { alt: "", src: `data:image/svg+xml,${encodeURIComponent(svgPastilha(n))}` })
                : h("i", {
                    style: `-webkit-mask-image:${svgUri(cfg.icones === "duotom" ? svgDoIcone(DUOTOM.trocar?.[n] ?? n, DUOTOM.preenchido, DUOTOM.traco) : svgDoIcone(n))}`,
                  }),
            )),
      );
    }
    sub.toggleAttribute("data-inativo", !cfg.ativo);
  };

  // SEI Pro Lab: o chrome.storage.sync aceita poucas gravações por minuto. Os seletores de cor disparam "input" a cada
  // movimento do mouse; gravando a cada um, a cota estourava em segundos (MAX_WRITE_OPERATIONS_PER_MINUTE) e nada mais
  // gravava, nem as outras configurações. Agora a prévia muda na hora e a gravação espera o seletor parar (ou fechar),
  // e nunca regrava o que já está salvo.
  let pendente: ReturnType<typeof setTimeout> | null = null;
  let gravado = JSON.stringify(cfg);
  const gravarJa = async () => {
    if (pendente) {
      clearTimeout(pendente);
      pendente = null;
    }
    const texto = JSON.stringify(cfg);
    if (texto === gravado) return;
    gravado = texto;
    try {
      await deps.gravar(cfg);
    } catch {
      gravado = "";
      aviso.textContent = "Não foi possível salvar agora (limite do navegador). Espere um minuto e tente de novo.";
    }
  };
  const salvar = async (parcial: Partial<ConfigTema>, imediato = true) => {
    cfg = normalizarConfig({ ...cfg, ...parcial });
    desenhar();
    if (imediato) {
      await gravarJa();
      return;
    }
    if (pendente) clearTimeout(pendente);
    pendente = setTimeout(() => void gravarJa(), 700);
  };

  for (const m of MODOS) {
    const b = h("button", { type: "button", role: "radio", "data-modo": m.id, onclick: () => void salvar({ modo: m.id }) }, m.rotulo);
    linhaModo.append(b);
  }
  for (const p of PALETAS) {
    grade.append(
      h(
        "button",
        {
          type: "button",
          class: "spro-ap-cor",
          "data-paleta": p.id,
          "aria-pressed": "false",
          onclick: () => void salvar({ paleta: p.id, corBarra: p.cor }),
        },
        h("i", { style: `background:${p.cor}` }),
        p.nome,
      ),
    );
  }
  livre.addEventListener("input", () => void salvar({ paleta: "livre", corBarra: livre.value }, false));
  livre.addEventListener("change", () => void gravarJa());
  for (const c of CONJUNTOS) {
    linhaIcones.append(
      h("button", { type: "button", role: "radio", "data-icones": c.id, onclick: () => void salvar({ icones: c.id }) }, c.rotulo),
    );
  }

  const linha = (titulo: string, dica: string, controle: Node) =>
    h(
      "div",
      { class: "spro-ap-linha" },
      h("div", { class: "spro-ap-rotulo" }, h("strong", {}, titulo), h("span", { class: "spro-ap-dica" }, dica)),
      controle,
    );

  const restaurar = h(
    "button",
    {
      type: "button",
      class: "btn btn-secundario",
      onclick: () => void salvar({ ...CONFIG_PADRAO, ativo: cfg.ativo }),
    },
    "Restaurar padrão",
  );

  sub.append(
    linha("Modo", "Automático segue o tema do seu sistema operacional.", linhaModo),
    h(
      "div",
      { class: "spro-ap-cores" },
      h("strong", {}, "Cor da barra superior"),
      grade,
      h("div", { class: "spro-ap-livre" }, "Outra cor:", livre, hex),
      aviso,
    ),
    fundoClaro.bloco,
    fundoEscuro.bloco,
    h("div", { class: "spro-ap-linha" }, h("div", { class: "spro-ap-rotulo" }, h("strong", {}, "Ícones"), dicaIcones), linhaIcones),
    linha(
      "Escurecer o conteúdo dos documentos",
      "No modo escuro, o texto dos documentos é adaptado e há um botão “Ver original” para conferir antes de assinar.",
      chave(cfg.escurecerDocumentos, "Escurecer o conteúdo dos documentos", (v) => void salvar({ escurecerDocumentos: v })),
    ),
    previa,
    h("div", { class: "spro-ap-rodape" }, restaurar),
  );

  const conteudo = h(
    "div",
    { class: "secao-corpo" },
    linha(
      "Ativar o Estilo Avançado",
      "Visual novo do SEI, no mesmo estilo das telas do SEI Pro. As mudanças valem na hora, sem precisar salvar.",
      chave(cfg.ativo, "Ativar o Estilo Avançado", (v) => void salvar({ ativo: v })),
    ),
    sub,
  );
  desenhar();
  return {
    conteudo,
    atualizar: (novo: unknown) => {
      cfg = normalizarConfig(novo);
      desenhar();
      const sw = conteudo.querySelectorAll<HTMLInputElement>('input[role="switch"]');
      if (sw[0]) sw[0].checked = cfg.ativo;
      if (sw[1]) sw[1].checked = cfg.escurecerDocumentos;
    },
  };
}

/** Monta a seção "Aparência". Grava a cada mudança (a prévia é ao vivo e o SEI aberto repinta sozinho). */
export async function montarSecaoAparencia(deps: DepsAparencia): Promise<HTMLElement> {
  const { conteudo } = await montarCorpoAparencia(deps);
  return h(
    "details",
    { class: "secao", open: true, id: "secao-aparencia" },
    h("summary", {}, h("span", { class: "secao-titulo" }, "Aparência (Estilo Avançado)"), h("span", { class: "spro-ap-selo" }, "Novo")),
    conteudo,
  );
}

export { CHAVE_TEMA, CHAVE_TEMA_CACHE };
