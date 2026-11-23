import { h, icone } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { campoComPrefixo, criarAbas, dica, formulario, grupo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Dados do processo (porte de `dados-processo.js`): o dialogo tem quatro abas. "Inserir dados" poe no cursor o dado
 * escolhido (numero, autuacao, tipo, interessados, assuntos, QR Code, campos personalizados...); "Substituir" troca as
 * #hashtags ja digitadas pelos valores; "Personalizados" cria, edita e remove os campos da unidade (salvos nas
 * observacoes do processo); "Lista" e a referencia das hashtags. A montagem dos dados (`arrayDadosEditor`) e a troca das
 * hashtags (`replaceDadosEditor`) continuam no monolito, que tambem as usa; aqui so mora o dialogo e o CRUD.
 */

type Par = readonly [tag: string, descricao: string, nota?: string];

const CAMPOS: readonly Par[] = [
  ["processo", "Número do processo", "com link"],
  ["processo_texto", "Número do processo", "sem link"],
  ["autuacao", "Data de autuação do processo", "formato DD/MM/AAAA"],
  ["tipo", "Tipo do processo"],
  ["especificacao", "Especificação do processo"],
  ["assuntos", "Classificação por assuntos do processo", "separados por vírgula"],
  ["assuntos_lista", "Classificação por assuntos do processo", "em formato de lista"],
  ["interessados", "Interessados do processo", "separados por vírgula"],
  ["interessados_lista", "Interessados do processo", "em formato de lista"],
  ["observacoes", "Observações do processo", "separadas por vírgula"],
  ["observacoes_lista", "Observações do processo", "em formato de lista"],
  ["observacao", "Observação da unidade atual"],
  ["acesso", "Nível de acesso do processo"],
  ["acesso_texto", "Nível de acesso do processo", "sem ícone"],
  ["documentos", "Lista de todos os documentos do processo", "separados por vírgula"],
  ["totaldocumentos", "Número de documentos do processo"],
  ["documentos_lista", "Lista de todos os documentos do processo", "em formato de lista"],
  ["hoje", "Data de hoje", "formato [dia] de [mês] de [ano]"],
  ["ano", "Ano corrente", "4 dígitos [YYYY]"],
  ["qrcode", "QR Code do link para acesso ao processo (SEI interno)"],
];

const CAMPOS_AVANCADOS: readonly Par[] = [
  ["assunto1", "Primeiro assunto do processo"],
  ["assunto3", "Terceiro assunto do processo"],
  ["interessado1", "Primeiro interessado do processo"],
  ["interessado4", "Quarto interessado do processo"],
  ["observacao1", "Primeira observação do processo"],
  ["observacao2", "Segunda observação do processo"],
  ["documento1", "Primeiro documento do processo"],
  ["documento5", "Quinto documento do processo"],
  ["documento+1", "Próximo documento do processo em relação ao atual"],
  ["documento+3", "Terceiro documento do processo em relação ao atual"],
  ["documento-1", "Primeiro documento do processo anterior ao atual"],
  ["documento-6", "Sexto documento do processo anterior ao atual"],
  ["hoje+1", "Amanhã", "formato [dia] de [mês] de [ano]"],
  ["hoje-1", "Ontem", "formato [dia] de [mês] de [ano]"],
  ["hoje+7", "Data daqui a 7 dias", "formato [dia] de [mês] de [ano]"],
  ["hoje-5", "Data de 5 dias atrás", "formato [dia] de [mês] de [ano]"],
];

/** Nomes que o usuario nao pode tomar para um campo personalizado (so letras e `_`, como o legado comparava). */
export const NOMES_RESERVADOS: ReadonlySet<string> = new Set(
  [...CAMPOS, ...CAMPOS_AVANCADOS].map(([tag]) => tag.replace(/[^a-zA-Z_]+/g, "")),
);

interface TagPersonalizada {
  name: string;
  value: string;
}
interface TagsDaUnidade {
  unidade: string;
  tags: TagPersonalizada[];
}
interface ObservacaoDaUnidade {
  unidade: string;
  observacao: string;
}
interface DadosDoProcesso {
  propProcesso?: { txaTagsObservacoes?: TagsDaUnidade[]; txaObservacoes?: ObservacaoDaUnidade[] };
  listDocumentos?: unknown;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais: a ausencia nunca derruba o dialogo). */
interface Monolito {
  dadosProcessoPro?: DadosDoProcesso;
  siglaUnidadeAtual?: string;
  checkProcessoSigiloso?(): boolean;
  arrayDadosEditor?(): Array<[string?, string?]>;
  getDadosProcessoSession?(): DadosDoProcesso | null | undefined;
  setParamEditor?(el: Element | null): void;
  replaceDadosEditor?(el: Element | null): void;
  htmlLinksProtocoloEditorPro?(html: string, ed: object): string;
  getHashTagsPro?(texto: string): unknown[];
  removeAcentos?(texto: string): string;
  textoParaHtmlPro?(texto: string): string;
  updateDadosProcesso?(chave: string, valor: string): void;
}

const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Rotulos do monolito vem com entidades (`&amp;`): vira texto simples para o `<option>`. Nunca interpreta tags. */
export function entidadesParaTexto(html: string): string {
  return html.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (todo, hex?: string, dec?: string, nome?: string) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (dec) return String.fromCodePoint(Number(dec));
    return (nome && ENTIDADES[nome.toLowerCase()]) || todo;
  });
}

// por RegExp(string): o esbuild expande o intervalo literal e o bundle sairia com byte nao-ASCII
const MARCAS_DE_ACENTO = /[\u0300-\u036f]/g;
const semAcentos = (t: string): string => t.normalize("NFD").replace(MARCAS_DE_ACENTO, "");

export const recurso: Recurso = {
  id: "dados-processo",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const sigla = () => String(w.siglaUnidadeAtual ?? "");
    const tagsDaUnidade = (): TagsDaUnidade | undefined => {
      const lista = w.dadosProcessoPro?.propProcesso?.txaTagsObservacoes ?? [];
      return lista.find((t) => t.unidade === sigla()) ?? lista.find((t) => t.unidade === "");
    };

    /** Clique do botao: espera os dados do processo carregarem (consulta de 500 ms) e abre o dialogo. */
    function getDadosEditor(this_: Element | null, TimeOut = 9000): void {
      if (w.checkProcessoSigiloso?.()) {
        A.getInstance(this_);
        avisar("Não disponível para processos sigilosos");
        return;
      }
      if (TimeOut <= 0) return;
      const d = w.dadosProcessoPro;
      if (d?.propProcesso !== undefined && d.listDocumentos !== undefined && (w.arrayDadosEditor?.().length ?? 0) > 0) {
        getDialogDadosEditor(this_);
        return;
      }
      setTimeout(() => {
        if (w.dadosProcessoPro?.propProcesso === undefined) {
          const sessao = w.getDadosProcessoSession?.();
          if (sessao) w.dadosProcessoPro = sessao;
        }
        getDadosEditor(this_, TimeOut - 100);
      }, 500);
    }

    function getDialogDadosEditor(this_?: Element | null): void {
      // chamada de boot do legado, sem elemento: nao ha o que abrir
      if (this_ === undefined) return;
      if (w.checkProcessoSigiloso?.()) return;
      const ed = A.getInstance(this_);
      if (!ed) return;
      // `replaceDadosEditor` (monolito) usa os globais que o `setParamEditor` fixa na instancia deste botao
      try {
        w.setParamEditor?.(this_);
      } catch {
        // sem o auxiliar: a troca cai na primeira instancia da pagina
      }

      // ---------- aba 1: inserir um dado ----------
      const dados = w.arrayDadosEditor?.() ?? [];
      const listaDados = h(
        "select",
        { id: "listDados" },
        ...dados.map(([rotulo, valor]) =>
          h("option", { value: String(valor ?? "") }, entidadesParaTexto(String(rotulo ?? "")) || "Selecione um dado…"),
        ),
      );
      const aba1 = grupo(
        "Dado do processo",
        { para: "listDados", dica: "O valor escolhido entra no documento, no ponto do cursor." },
        listaDados,
      );

      // ---------- aba 2: substituir hashtags ----------
      const corpo = A.findInBody(ed, "p");
      const texto = corpo.map((p) => p.textContent ?? "").join(" ");
      const detectadas = w.getHashTagsPro?.(texto).length ?? 0;
      const resultado = h("div", { id: "tabReplaceTag_result", class: "spro-nota" });
      resultado.append(
        h("label", {}, `${detectadas} ${detectadas === 1 ? "campo dinâmico detectado" : "campos dinâmicos detectados"} no documento.`),
      );
      const substituir = h(
        "button",
        { type: "button", class: "spro-botao", onclick: () => w.replaceDadosEditor?.(substituir) },
        "Substituir campos dinâmicos",
      );
      const aba2 = formulario(
        dica("Troca as #hashtags já digitadas no documento (como #processo ou #hoje) pelos valores reais do processo."),
        h("div", {}, substituir),
        resultado,
      );

      // ---------- aba 3: campos personalizados ----------
      const nome = h("input", {
        type: "text",
        id: "dinNome",
        placeholder: "ex.: gestor ou prazo_resposta",
        autocomplete: "off",
        spellcheck: "false",
      });
      const valor = h("input", { type: "text", id: "dinValor", placeholder: "Texto que substitui o campo", autocomplete: "off" });
      const aviso = h("div", { id: "tabNewDynamicField_alert", class: "spro-nota", hidden: "" });
      const lista = h("div", {
        id: "tabNewDynamicField_result",
        class: "spro-lista-campos",
        "data-vazio": "Nenhum campo personalizado nesta unidade ainda",
      });
      const mostrar = (msg: string) => {
        aviso.replaceChildren(h("label", {}, msg));
        aviso.removeAttribute("hidden");
      };
      const linha = (nomeCampo: string, valorCampo: string): HTMLElement => {
        const l = h("div", { class: "spro-linha-campo", "data-tag": nomeCampo, "data-valor": valorCampo });
        l.append(
          h("b", { class: "spro-hash" }, `#${nomeCampo}`),
          h("span", { class: "spro-linha-valor" }, valorCampo),
          h(
            "div",
            { class: "spro-linha-acoes" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao-icone pequeno",
                title: "Editar",
                "aria-label": `Editar #${nomeCampo}`,
                onclick: () => editDynamicField(l),
              },
              icone("lapis", 15),
            ),
            h(
              "button",
              {
                type: "button",
                class: "spro-botao-icone pequeno",
                title: "Remover",
                "aria-label": `Remover #${nomeCampo}`,
                onclick: () => removeDynamicField(l),
              },
              icone("lixeira", 15),
            ),
          ),
        );
        return l;
      };
      for (const t of tagsDaUnidade()?.tags ?? []) lista.append(linha(t.name, t.value));

      /** Grava a lista atual: atualiza as opcoes da aba 1, os dados em memoria e as observacoes da unidade. */
      function updateDynamicField(): void {
        for (const o of [...listaDados.querySelectorAll("option")])
          if ((o.textContent ?? "").trim().startsWith("Personalizado")) o.remove();
        const campos: TagPersonalizada[] = [...lista.querySelectorAll<HTMLElement>(".spro-linha-campo")].map((l) => ({
          name: l.getAttribute("data-tag") ?? "",
          value: l.getAttribute("data-valor") ?? "",
        }));
        let obsTexto = "";
        for (const { name, value } of campos) {
          const html = w.textoParaHtmlPro ? w.textoParaHtmlPro(value) : value;
          listaDados.append(h("option", { value: html }, `Personalizado (${sigla()}) #${name}: ${value}`));
          obsTexto += `#${name}: ${value}\n`;
        }
        const prop = w.dadosProcessoPro?.propProcesso;
        for (const t of prop?.txaTagsObservacoes ?? []) if (t.unidade === sigla()) t.tags = campos;
        const obs = prop?.txaObservacoes?.find((o) => o.unidade === sigla())?.observacao;
        w.updateDadosProcesso?.("txaObservacoes", obs !== undefined && obs !== null ? obsTexto + obs : obsTexto);
      }

      function removeDynamicField(l: HTMLElement): void {
        l.remove();
        updateDynamicField();
        mostrar("Campo dinâmico excluído com sucesso.");
      }

      function editDynamicField(l: HTMLElement): void {
        nome.value = l.getAttribute("data-tag") ?? "";
        valor.value = l.getAttribute("data-valor") ?? "";
        valor.focus();
      }

      function newDynamicField(): void {
        aviso.setAttribute("hidden", "");
        const limpar = (t: string) => (w.removeAcentos ? w.removeAcentos(t) : semAcentos(t));
        const bruto = nome.value.trim();
        const campo =
          bruto === ""
            ? ""
            : limpar(bruto.split(":")[0]?.replace("#", "") ?? "")
                .replace(/ /g, "")
                .toLowerCase()
                .trim();
        const texto2 = valor.value.trim();
        if (campo === "" || texto2 === "") {
          mostrar("Informe o nome e o valor do campo.");
          return;
        }
        if (NOMES_RESERVADOS.has(campo)) {
          mostrar("Esse nome é reservado para uso interno (veja a aba Lista de campos). Escolha outro.");
          return;
        }
        const existente = [...lista.querySelectorAll<HTMLElement>(".spro-linha-campo")].find((l) => l.getAttribute("data-tag") === campo);
        if (existente) existente.replaceWith(linha(campo, texto2));
        else lista.prepend(linha(campo, texto2));
        nome.value = "";
        valor.value = "";
        updateDynamicField();
        mostrar("Campo dinâmico salvo com sucesso.");
      }

      const salvar = h(
        "button",
        { type: "button", id: "buttonNewDynamicField", class: "spro-botao", onclick: newDynamicField },
        "Salvar campo",
      );
      const aba3 = formulario(
        dica("Crie campos próprios, como #gestor, para usar nos documentos deste processo. Ficam salvos nas observações da unidade."),
        grupo("Nome do campo", { para: "dinNome", dica: "Sem acentos nem espaços." }, campoComPrefixo(nome, "#")),
        grupo("Valor do campo", { para: "dinValor" }, valor),
        h("div", {}, salvar),
        aviso,
        grupo("Campos salvos", {}, lista),
      );

      // ---------- aba 4: referencia das hashtags ----------
      const referencia = (titulo: string, itens: readonly Par[]) =>
        grupo(
          titulo,
          {},
          h(
            "div",
            { class: "spro-lista-campos spro-referencia" },
            ...itens.map(([tag, desc, nota]) =>
              h(
                "div",
                { class: "spro-linha-campo" },
                h("b", { class: "spro-hash" }, `#${tag}`),
                h("span", { class: "spro-linha-valor" }, desc, nota ? h("em", {}, ` (${nota})`) : null),
              ),
            ),
          ),
        );
      const aba4 = formulario(
        referencia("Campos disponíveis", CAMPOS),
        referencia("Campos avançados (posição ou data relativa)", CAMPOS_AVANCADOS),
      );

      // ---------- dialogo ----------
      let rodape: HTMLElement | null = null;
      const abas = criarAbas(
        "dados",
        [
          ["inserir", "Inserir dados"],
          ["substituir", "Substituir campos"],
          ["personalizados", "Personalizados"],
          ["lista", "Lista de campos"],
        ],
        { inserir: aba1, substituir: aba2, personalizados: aba3, lista: aba4 },
        (id) => {
          if (!rodape) return;
          if (id === "inserir") rodape.removeAttribute("hidden");
          else rodape.setAttribute("hidden", "");
        },
      );
      const inserir = h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: () => {
            const v = listaDados.value;
            if (!v) {
              avisar("Escolha o dado a inserir.");
              return;
            }
            insertDadosEditor(v, ed);
            dialogo.fechar();
          },
        },
        "Inserir",
      );
      rodape = h("div", { class: "spro-dialogo-rodape" }, inserir);
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Dados do processo",
        largura: 700,
        conteudo: h("div", { class: "spro-form" }, abas.barra, h("div", {}, ...abas.paineis), rodape),
      });
      abas.selecionar("inserir");
      listaDados.focus({ preventScroll: true });
    }

    /** Insere o valor escolhido no ponto do cursor (o link do processo vai no formato do plugin de links do SEI no CK5). */
    function insertDadosEditor(value: string, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      const html = w.htmlLinksProtocoloEditorPro ? w.htmlLinksProtocoloEditorPro(value, ed) : value;
      A.withEdit(ed, () => A.insertHtml(ed, html));
    }

    return { getDadosEditor, getDialogDadosEditor, insertDadosEditor };
  },
};
