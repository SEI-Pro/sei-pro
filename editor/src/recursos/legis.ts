import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import {
  buscarNormas,
  htmlDaAncora,
  type Norma,
  numeroDaApi,
  periodoDaApi,
  type Rede,
  resolverSiglas,
  tipoDaSelecao,
  URL_LEGIS_API,
} from "../util/legis-api";
import type { Contexto, Recurso } from "./tipos";

/**
 * Link de legislacao (porte de `legis.js`): o dialogo tem as abas Legislacao Federal (tipo + numero, com pesquisa),
 * Norma Infralegal (orgao + tipo + numero) e Lista de Normas. Inserir resolve a norma pela API do SEI Pro e poe a
 * ancora `.legisSeiPro` no cursor. Numero repetido (ha sete Decretos n. 1) lista as opcoes em vez de escolher uma;
 * com o ano a busca ja volta com uma so. Tudo que vem da API e escapado e so URL http(s) vira `href`.
 * `resolverNormasLegisPro` continua global: `js/sei-legis.js` ("@lei8666") a chama.
 */
const SELECT_TIPO_FEDERAL: Array<[string, string]> = [
  ["", ""],
  ["Lei", "lei"],
  ["Lei Complementar", "lei.complementar"],
  ["Decreto", "decreto"],
  ["Decreto-Lei", "decreto.lei"],
  ["Medida Provisória", "medida.provisoria"],
  ["Emenda Constitucional", "emenda.constitucional"],
  ["Decreto Legislativo", "decreto.legislativo"],
];
const SELECT_PERIODO: Array<[string, string]> = [
  ["", ""],
  ["No ano", "ano"],
  ["Até o ano de...", "ate"],
  ["Após o ano de...", "apos"],
];
const SELECT_ORGAO: Array<[string, string]> = [
  ["", ""],
  ["ANTAQ", "Antaq"],
  ["Cade", "Cade"],
  ["PRF", "PRF"],
  ["TSE", "Tse"],
  ["TRE RR", "Trerr"],
  ["TJ RR", "TJRR"],
  ["CNJ", "CNJ"],
];
const SELECT_TIPO_INFRA: Array<[string, string]> = [
  ["", ""],
  ["Acordo/Plano/Ato/Nota", "acord"],
  ["Ata e Certidões de Julgamento", "atas"],
  ["Constituição Estadual", "ce"],
  ["Decreto Estadual", "decest"],
  ["Edital", "Edit"],
  ["Enunciado Administrativo", "enumadm"],
  ["Emenda Constitucional", "ec"],
  ["Emenda Regimental", "er"],
  ["Emendas", "Emenda"],
  ["Instrução Normativa", "in"],
  ["Instrução Normativa Conjunta", "resconj"],
  ["Lei Complementar Estadual", "lce"],
  ["Lei Estadual", "leiest"],
  ["Lei Municipal", "leimun"],
  ["Nota Técnica", "nt"],
  ["Orientação Normativa", "on"],
  ["Portaria", "port"],
  ["Portaria Conjunta", "portconj"],
  ["Portaria Interministerial", "portinter"],
  ["Portaria Interinstitucional", "portinst"],
  ["Provimento", "prov"],
  ["Recomendação", "Rec"],
  ["Regimento Interno", "regim"],
  ["Resolução Normativa", "rn"],
  ["Resolução", "res"],
  ["Resolução Conjunta", "resconj"],
  ["Súmula Administrativa", "sum"],
];
/** Sigla com ano: o numero sozinho e ambiguo (Lei 556 e Decreto 24.643 existem em mais de um ano). */
const SELECT_LISTA: Array<[string, string]> = [
  ["", ""],
  ["Código Brasileiro de Aeronáutica", "Lei7565/1986"],
  ["Código Brasileiro de Telecomunicações", "Lei4117/1962"],
  ["Código Civil", "Lei10406/2002"],
  ["Código Comercial", "Lei556/1850"],
  ["Código de Defesa do Consumidor", "Lei8078/1990"],
  ["Constituição Federal", "Cf"],
  ["Código Florestal", "Lei12651/2012"],
  ["Consolidação das Leis do Trabalho", "DecLei5452/1943"],
  ["Código de Águas", "Dec24643/1934"],
  ["Código Eleitoral", "Lei4737/1965"],
  ["Código de Minas", "DecLei227/1967"],
  ["Código Penal", "DecLei2848/1940"],
  ["Código de Processo Civil", "Lei13105/2015"],
  ["Código Penal Militar", "DecLei1001/1969"],
  ["Código de Processo Penal", "DecLei3689/1941"],
  ["Código de Processo Penal Militar", "DecLei1002/1969"],
  ["Código de Trânsito Brasileiro", "Lei9503/1997"],
  ["Código Tributário Nacional", "Lei5172/1966"],
  ["Estatuto da Criança e do Adolescente", "Lei8069/1990"],
  ["Estatuto da Cidade", "Lei10257/2001"],
  ["Estatuto do Desarmamento", "Lei10826/2003"],
  ["Estatuto do Idoso", "Lei10741/2003"],
  ["Estatuto da Igualdade Racial", "Lei12288/2010"],
  ["Estatuto do Índio", "Lei6001/1973"],
  ["Estatuto da Juventude", "Lei12852/2013"],
  ["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte", "LC123/2006"],
  ["Estatuto dos Militares", "Lei6880/1980"],
  ["Estatuto dos Museus", "Lei11904/2009"],
  ["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)", "Lei8906/1994"],
  ["Estatuto da Pessoa com Deficiência", "Lei13146/2015"],
  ["Estatuto dos Refugiados", "Lei9474/1997"],
  ["Estatuto da Terra", "Lei4504/1964"],
  ["Estatuto de Defesa do Torcedor", "Lei10671/2003"],
];

const MSG_FALHA = "Serviço de legislação indisponível no momento. Tente novamente mais tarde.";
const MSG_NAO_ACHADA = "Nenhuma legislação encontrada";

/** Ementa legivel: caixa alta vira normal e o texto longo e cortado na palavra depois do 170o caractere. */
export function ementaLegivel(ementa: string): { curta: string; completa: string; longa: boolean } {
  let completa = ementa.replace(/(\r\n|\n|\r)/gm, " ").trim();
  if (/[A-Z]/.test(completa) && completa === completa.toUpperCase()) completa = completa.charAt(0) + completa.toLocaleLowerCase().slice(1);
  const longa = completa.length > 170;
  return { curta: longa ? `${completa.replace(/^(.{170}\S*)[\s\S]*/, "$1")}...` : completa, completa, longa };
}

export const recurso: Recurso = {
  id: "legis",
  globais(c: Contexto) {
    const A = c.adaptador;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const rede: Rede = (url, init) => (c.fetch ?? c.win.fetch.bind(c.win))(url, init);
    let resultados: Norma[] = [];
    let fecharDialogo: (() => void) | null = null;
    let buscaAtual = 0;

    /** `refs` -> mapa sigla -> norma, chamado SEMPRE (vazio se a API falhar). Global: `sei-legis.js` o usa. */
    function resolverNormasLegisPro(refs: string[], callback: (achadas: Record<string, Norma>) => void): void {
      void resolverSiglas(rede, URL_LEGIS_API, refs ?? []).then(callback);
    }

    /** Insere a ancora da norma no cursor. Norma que ja esta no documento entra pelo titulo curto. */
    function inserirNorma(norma: Norma, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed || !norma) return;
      const repetida = A.findInBody(ed, "a").some(
        (a) => (norma.url && a.getAttribute("href") === norma.url) || a.getAttribute("data-norma") === norma.sigla,
      );
      const selecao = A.saveSelection(ed);
      // foco e selecao ANTES do passo de desfazer: o marcador interno do CK4 (cke_bm) nao entra no snapshot "antes"
      A.focus(ed);
      if (selecao) A.restoreSelection(ed, selecao);
      A.withEdit(ed, () => {
        // insertElement (e nao insertHtml): o cursor fica DEPOIS do link e a norma seguinte nao parte o anterior
        A.insertElement(ed, htmlDaAncora(norma, repetida));
      });
    }

    function sendLegisSEI(nome: string): void {
      const ed = A.getInstance();
      if (!ed) return;
      resolverNormasLegisPro([nome], (achadas) => {
        const norma = achadas[String(nome ?? "").trim()];
        if (!norma) return avisar(MSG_NAO_ACHADA);
        inserirNorma(norma, ed);
      });
    }

    /** Linha de resultado: titulo (link externo), apelido, "Revogada", "Adicionar" e a ementa com mais/menos. */
    function linhaDeResultado(norma: Norma, i: number): HTMLElement {
      const em = ementaLegivel(norma.ementa);
      const cor = norma.revogada ? "text-decoration:line-through;color:#adadad;" : "";
      const titulo = norma.url
        ? h("a", { class: "linkDialog", href: norma.url, target: "_blank", rel: "noopener noreferrer" }, norma.titulo, " ↗")
        : h("span", {}, norma.titulo);
      const adicionar = h(
        "button",
        {
          type: "button",
          class: "spro-botao",
          "data-legis-idx": String(i),
          style: "float:right;margin-left:10px;",
          onclick: () => insertLegisSEI(adicionar),
        },
        "Adicionar",
      );
      const linha = h(
        "div",
        { class: "searchLegis_linha", style: "border-bottom:2px solid #efefef;padding:10px 0;" },
        h(
          "p",
          {},
          titulo,
          norma.apelido ? h("span", { style: "opacity:.7;" }, ` (${norma.apelido})`) : null,
          norma.revogada
            ? h("span", { style: "background:#e0e0e0;padding:1px 5px;color:#444;border-radius:5px;margin-left:10px;" }, "Revogada")
            : null,
          adicionar,
        ),
      );
      if (em.completa) {
        const estiloEmenta = `font-style:italic;word-break:break-word;white-space:break-spaces;max-width:500px;padding:6px 0 0;${cor}`;
        linha.append(
          h(
            "p",
            { class: "searchLegis_ementa", style: estiloEmenta },
            `${em.curta} `,
            em.longa
              ? h(
                  "a",
                  {
                    class: "linkDialog",
                    role: "button",
                    tabindex: "0",
                    style: "cursor:pointer;",
                    onclick: (ev: Event) => getSearchLegisMore(ev.currentTarget as Element),
                  },
                  "mais",
                )
              : null,
          ),
          h(
            "p",
            { class: "searchLegis_ementafull", style: `display:none;${estiloEmenta}` },
            `${em.completa} `,
            h(
              "a",
              {
                class: "linkDialog",
                role: "button",
                tabindex: "0",
                style: "cursor:pointer;",
                onclick: (ev: Event) => getSearchLegisMore(ev.currentTarget as Element),
              },
              "menos",
            ),
          ),
        );
      }
      return linha;
    }

    const aviso = (texto: string) =>
      h("p", { style: "margin:10px;text-align:center;background:#fdfbe4;color:#333;padding:5px;border-radius:5px;" }, texto);

    function exibirResultados(raiz: ParentNode, normas: Norma[], total: number, avisoTopo?: string): void {
      resultados = normas;
      const area = raiz.querySelector<HTMLElement>("#searchLegis_result");
      if (!area) return;
      const filhos: Node[] = [];
      if (avisoTopo) filhos.push(aviso(avisoTopo));
      filhos.push(...normas.map((n, i) => linhaDeResultado(n, i)));
      if (total > normas.length) filhos.push(aviso(`Mostrando ${normas.length} de ${total} resultados. Restrinja sua pesquisa.`));
      else if (!normas.length) filhos.push(aviso("Nenhum resultado encontrado :("));
      area.replaceChildren(...filhos);
      area.style.display = "";
      const carga = raiz.querySelector<HTMLElement>("#searchLegis_load");
      if (carga) carga.style.display = "none";
    }

    function falhaDaApi(raiz: ParentNode): void {
      const carga = raiz.querySelector<HTMLElement>("#searchLegis_load");
      if (carga) carga.style.display = "none";
      avisar(MSG_FALHA);
    }

    const valor = (raiz: ParentNode, id: string) => raiz.querySelector<HTMLInputElement>(`#${id}`)?.value ?? "";
    const carregando = (raiz: ParentNode, ligado: boolean) => {
      const carga = raiz.querySelector<HTMLElement>("#searchLegis_load");
      if (carga) carga.style.display = ligado ? "" : "none";
    };

    /** Pesquisa da aba Federal. Tudo em branco tambem vale (a API devolve as normas mais recentes). */
    function getSearchLegis(this_?: Element | null): void {
      const raiz = (this_?.closest(".dialogBoxDiv") ?? c.doc.querySelector(".dialogBoxDiv")) as ParentNode | null;
      if (!raiz) return;
      const ano = valor(raiz, "legis_anoNorma").trim();
      carregando(raiz, true);
      const area = raiz.querySelector<HTMLElement>("#searchLegis_result");
      if (area) area.style.display = "none";
      buscaAtual += 1;
      const minha = buscaAtual;
      buscarNormas(rede, URL_LEGIS_API, {
        q: valor(raiz, "legis_termoNorma").trim(),
        tipo: valor(raiz, "legis_tipoNorma"),
        numero: numeroDaApi(valor(raiz, "legis_numeroNorma")),
        ano,
        periodo: ano ? periodoDaApi(valor(raiz, "legis_periodoNorma")) : "",
      }).then(
        (r) => minha === buscaAtual && exibirResultados(raiz, r.normas, r.total),
        () => minha === buscaAtual && falhaDaApi(raiz),
      );
    }

    /** "Inserir" na aba Federal: uma norma so entra direto; numero repetido vira lista para escolher. */
    function inserirFederal(raiz: ParentNode, tipo: string, numero: number, ano: string, periodo: string, ed: object): void {
      carregando(raiz, true);
      buscaAtual += 1;
      const minha = buscaAtual;
      buscarNormas(rede, URL_LEGIS_API, { tipo, numero, ano, periodo: ano ? periodoDaApi(periodo) : "" }).then(
        ({ normas, total }) => {
          if (minha !== buscaAtual) return;
          carregando(raiz, false);
          if (normas.length === 1 && total <= 1) {
            fecharDialogo?.();
            inserirNorma(normas[0] as Norma, ed);
          } else if (!normas.length) avisar(MSG_NAO_ACHADA);
          else
            exibirResultados(
              raiz,
              normas,
              total || normas.length,
              `Há ${total || normas.length} normas com esse número. Escolha abaixo ou informe o ano.`,
            );
        },
        () => minha === buscaAtual && falhaDaApi(raiz),
      );
    }

    /** O botao "Adicionar" de uma linha (`data-legis-idx`) fecha o dialogo e insere a norma. */
    function insertLegisSEI(this_: Element | null): void {
      const norma = resultados[Number.parseInt(this_?.getAttribute("data-legis-idx") ?? "", 10)];
      if (!norma) return;
      fecharDialogo?.();
      inserirNorma(norma);
    }

    /** Ementa resumida <-> completa na linha do resultado. */
    function getSearchLegisMore(this_: Element | null): void {
      const linha = this_?.closest(".searchLegis_linha");
      const curta = linha?.querySelector<HTMLElement>(".searchLegis_ementa");
      const cheia = linha?.querySelector<HTMLElement>(".searchLegis_ementafull");
      if (!curta || !cheia) return;
      const mostrarCurta = curta.style.display === "none";
      curta.style.display = mostrarCurta ? "" : "none";
      cheia.style.display = mostrarCurta ? "none" : "";
    }

    function campoSelect(rotulo: string, id: string, opcoes: Array<[string, string]>): HTMLElement {
      return h(
        "label",
        { style: "display:grid;gap:2px;font-size:12px;margin-bottom:8px;" },
        h("span", {}, rotulo),
        h("select", { id, style: "width:100%;" }, ...opcoes.map(([t, v]) => h("option", { value: v }, t))),
      );
    }
    function campoTexto(rotulo: string, id: string, tipo = "text"): HTMLElement {
      return h(
        "label",
        { style: "display:grid;gap:2px;font-size:12px;margin-bottom:8px;" },
        h("span", {}, rotulo),
        h("input", { type: tipo, id, style: "width:100%;" }),
      );
    }

    function openDialogLegisSEI(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      resultados = [];
      const abas = [
        ["federal", "Legislação Federal"],
        ["infra", "Norma Infralegal"],
        ["lista", "Lista de Normas"],
      ] as const;
      const botoes = new Map<string, HTMLElement>();
      const paineis = new Map<string, HTMLElement>();
      const selecionar = (id: string) => {
        for (const [aba] of abas) {
          botoes.get(aba)?.setAttribute("aria-selected", String(aba === id));
          botoes.get(aba)?.setAttribute("tabindex", aba === id ? "0" : "-1");
          if (aba === id) paineis.get(aba)?.removeAttribute("hidden");
          else paineis.get(aba)?.setAttribute("hidden", "");
        }
      };
      const carga = h("span", { id: "searchLegis_load", style: "margin-left:10px;display:none;" }, "Pesquisando...");
      const conteudo: Record<string, HTMLElement> = {
        federal: h(
          "div",
          {},
          campoSelect("Tipo de Legislação", "legis_tipoNorma", SELECT_TIPO_FEDERAL),
          campoTexto("Número da Legislação", "legis_numeroNorma", "number"),
          campoSelect("Período da Publicação", "legis_periodoNorma", SELECT_PERIODO),
          campoTexto("Ano da Publicação", "legis_anoNorma", "number"),
          campoTexto("Conteúdo da Legislação (palavras-chave)", "legis_termoNorma"),
          h(
            "div",
            { style: "text-align:right;margin-top:6px;" },
            h(
              "button",
              {
                type: "button",
                id: "searchLegis_uiElement",
                class: "spro-botao",
                title: "Pesquisar",
                onclick: (ev: Event) => getSearchLegis(ev.currentTarget as Element),
              },
              "Pesquisar",
            ),
            carga,
          ),
          h("div", { id: "searchLegis_result", style: "display:none;max-height:250px;overflow-y:auto;margin-top:15px;" }),
        ),
        infra: h(
          "div",
          {},
          campoSelect("Autoridade Signatária", "legis_orgaoInfraNorma", SELECT_ORGAO),
          campoSelect("Tipo de Legislação", "legis_tipoInfraNorma", SELECT_TIPO_INFRA),
          campoTexto("Número da Norma", "legis_numeroInfraNorma", "number"),
        ),
        lista: h("div", {}, campoSelect("Nome da Legislação", "legis_nomeNorma", SELECT_LISTA)),
      };
      const lista = h("div", { role: "tablist", style: "display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;" });
      abas.forEach(([id, rotulo]) => {
        const b = h(
          "button",
          {
            type: "button",
            role: "tab",
            id: `legisTab_${id}`,
            "aria-controls": `legisPainel_${id}`,
            "aria-selected": "false",
            class: "spro-botao",
            onclick: () => selecionar(id),
          },
          rotulo,
        );
        botoes.set(id, b);
        lista.append(b);
        paineis.set(
          id,
          h(
            "div",
            { role: "tabpanel", id: `legisPainel_${id}`, "aria-labelledby": `legisTab_${id}`, hidden: "" },
            conteudo[id] as HTMLElement,
          ),
        );
      });

      const raiz = h(
        "div",
        { class: "dialogBoxDiv", style: "min-width:480px;font-size:13px;" },
        lista,
        ...paineis.values(),
        h(
          "div",
          { class: "spro-dialogo-rodape" },
          h(
            "button",
            {
              type: "button",
              class: "spro-botao primario",
              onclick: () => {
                const tipo = valor(raiz, "legis_tipoNorma");
                const numero = numeroDaApi(valor(raiz, "legis_numeroNorma"));
                const tipoInfra = valor(raiz, "legis_tipoInfraNorma");
                const numeroInfra = valor(raiz, "legis_numeroInfraNorma");
                const nome = valor(raiz, "legis_nomeNorma");
                if (tipo !== "" && numero !== "")
                  return inserirFederal(raiz, tipo, numero, valor(raiz, "legis_anoNorma").trim(), valor(raiz, "legis_periodoNorma"), ed);
                if (tipoInfra !== "" && numeroInfra !== "") {
                  const nr = (numeroInfra.includes("/") ? (numeroInfra.split("/")[0] ?? "") : numeroInfra).replace(/[^0-9-]+/g, "");
                  sendLegisSEI(valor(raiz, "legis_orgaoInfraNorma") + tipoInfra + nr);
                } else if (nome !== "") sendLegisSEI(nome);
                else return avisar("Informe o tipo e o número da norma, ou escolha uma norma da lista.");
                fecharDialogo?.();
              },
            },
            "Inserir",
          ),
        ),
      );
      const dialogo = abrirDialogo(c.doc, { titulo: "Adicionar Link de Legislação", conteudo: raiz });
      fecharDialogo = () => dialogo.fechar();
      selecionar("federal");

      // pre-seleciona tipo/numero/ano pelo texto selecionado no editor
      const selecionado = A.getSelectedText(ed) || "";
      const tipoSel = tipoDaSelecao(selecionado);
      const tipoCampo = raiz.querySelector<HTMLSelectElement>("#legis_tipoNorma");
      if (tipoSel && tipoCampo) tipoCampo.value = tipoSel;
      if (/\d/.test(selecionado)) {
        let n = selecionado.includes("/") ? (selecionado.split("/")[0] ?? "") : selecionado;
        n = selecionado.includes(",") ? (selecionado.split(",")[0] ?? "") : n;
        const campoNumero = raiz.querySelector<HTMLInputElement>("#legis_numeroNorma");
        if (campoNumero) campoNumero.value = /\d/.test(n) ? n.replace(/\D/g, "") : "";
        // "..., de 21 de junho de 1993" / "8.666/1993": o ano desfaz a ambiguidade do numero
        const ano = /(?:\/|\bde\s+)(\d{4})\b/.exec(selecionado);
        const campoAno = raiz.querySelector<HTMLInputElement>("#legis_anoNorma");
        if (ano && campoAno) campoAno.value = ano[1] ?? "";
      }
      try {
        const win = c.win as unknown as { setChosenInCke?: () => void };
        if (c.verifyOpcao("substituiselecao") && typeof win.setChosenInCke === "function") win.setChosenInCke();
      } catch {
        /* opcao do legado: sem efeito se o auxiliar nao existe */
      }
    }

    return {
      resolverNormasLegisPro,
      sendLegisSEI,
      insertLegisSEI,
      getLegisSEI(this_: Element | null): void {
        const ed = A.getInstance(this_);
        if (ed) openDialogLegisSEI(ed);
      },
      getSearchLegisMore,
      getSearchLegis,
      /** Compat com o `initFunctions` do legado: o dialogo agora abre sob demanda. */
      getDialogLegisSEI: () => {},
    };
  },
};
