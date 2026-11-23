import { h, icone } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { caixa, formulario, grade, grupo, previa } from "../ui/formulario";
import { escaparHtml } from "../util/html";
import { urlHttpValida } from "../util/url";
import type { Contexto, Recurso } from "./tipos";

/**
 * Link de documento publico (porte de `processo-publico.js`): pesquisa um processo na area de pesquisa publica do SEI (o
 * usuario digita o codigo da imagem de verificacao), lista os documentos publicos e insere no cursor um link para o
 * escolhido. A pesquisa roda num iframe oculto da mesma origem (`#frmCheckerProcessoPublicoPro`, que e a pagina de
 * pesquisa publica e nao o iframe do editor); o resultado e lido do documento dele e a pagina do processo, por `fetch`.
 */

export interface DocumentoPublico {
  /** Texto que entra no documento (ja escapado), com o link quando o documento e publico. */
  html: string;
  rotulo: string;
  restrito: boolean;
}

const CAMINHO = "/sei/modulos/pesquisa/";
const ID_IFRAME = "frmCheckerProcessoPublicoPro";
const TENTATIVAS = 60;
const ESPERA_MS = 500;

/** Monta a lista a partir da pagina do processo publico: um item por documento e, por fim, o proprio processo. */
export function lerDocumentosPublicos(doc: Document, origem: string, hrefProcesso: string, prefixo: string): DocumentoPublico[] {
  const itens: DocumentoPublico[] = [];
  for (const tr of doc.querySelectorAll("#tblDocumentos tr.infraTrClara")) {
    const dados = [...tr.querySelectorAll("td")].map((td) => (td.textContent ?? "").trim());
    const onclick = tr.querySelector("a.ancoraPadraoAzul")?.getAttribute("onclick") ?? "";
    const rel = /'([^']+)'/.exec(onclick)?.[1];
    const url = rel ? `${origem}${CAMINHO}${rel}` : "";
    const tipo = dados[2] ?? "";
    const numero = dados[1] ?? "";
    const texto = `${escaparHtml(tipo)}&nbsp;(${escaparHtml(prefixo)}${escaparHtml(numero)})`;
    const restrito = url === "" || !urlHttpValida(url);
    itens.push({
      html: restrito ? texto : `<a class="ancoraSei" href="${escaparHtml(url)}" target="_blank">${texto}</a>`,
      rotulo: `${tipo} (${prefixo}${numero})${restrito ? " [documento restrito]" : ""}`,
      restrito,
    });
  }
  const processo = (doc.querySelector("#tblCabecalho tr.infraTrClara")?.querySelectorAll("td")[1]?.textContent ?? "").trim();
  if (processo) {
    itens.push({
      html: urlHttpValida(hrefProcesso)
        ? `<a class="ancoraSei" href="${escaparHtml(hrefProcesso)}" target="_blank">${escaparHtml(processo)}</a>`
        : escaparHtml(processo),
      rotulo: `${processo} (o processo)`,
      restrito: false,
    });
  }
  return itens;
}

interface Monolito {
  dadosProcessoPro?: { listAndamento?: { processo?: string } };
  delayCrash?: boolean;
  getCitacaoDoc?(): string;
  setParamEditor?(el: Element | null): void;
}

export const recurso: Recurso = {
  id: "processo-publico",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const origem = () => c.win.location?.origin ?? "";
    const urlPesquisa = () =>
      `${origem()}/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0`;
    const espera = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms));
    const analisar = (html: string): Document =>
      new (c.win as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(html, "text/html");

    /** Cria (uma vez) o iframe oculto da pesquisa publica. */
    function getCheckerProcessoPublicoPro(): HTMLIFrameElement {
      let f = c.doc.getElementById(ID_IFRAME) as HTMLIFrameElement | null;
      if (!f) {
        f = c.doc.createElement("iframe");
        f.id = ID_IFRAME;
        f.setAttribute("style", "width:1px;height:1px;position:absolute;top:-100px;display:none;");
        f.setAttribute("tabindex", "-1");
        f.setAttribute("scrolling", "no");
        c.doc.body.append(f);
      }
      return f;
    }

    const documentoDoIframe = (): Document | null => {
      try {
        return (c.doc.getElementById(ID_IFRAME) as HTMLIFrameElement | null)?.contentDocument ?? null;
      } catch {
        return null;
      }
    };

    /** Espera `pronto(doc)` no documento do iframe (ate ~30 s). */
    async function aguardar<T>(pronto: (d: Document) => T | null | false): Promise<T | null> {
      for (let i = 0; i < TENTATIVAS; i += 1) {
        const d = documentoDoIframe();
        const r = d ? pronto(d) : null;
        if (r) return r;
        await espera(ESPERA_MS);
      }
      return null;
    }

    function openDialogProcessoPublicoPro(this_: Element | null): void {
      try {
        w.setParamEditor?.(this_);
      } catch {
        // sem o auxiliar: a insercao usa a instancia ativa
      }
      const ed = A.getInstance(this_);
      if (!ed) return;

      const processo = h("input", { type: "text", id: "processoPub", autocomplete: "off", placeholder: "Número do processo" });
      processo.value = w.dadosProcessoPro?.listAndamento?.processo ?? "";
      const codigo = h("input", { type: "text", id: "captchaPub", autocomplete: "off", placeholder: "Código da imagem" });
      const imagem = previa({ id: "searchPub_captcha" }, { vazio: "Carregando o código…" });
      const estado = h("p", { id: "searchPub_result", class: "spro-dica", style: "flex:1;" });
      const lista = h("div", {
        id: "listaDocPublico",
        class: "spro-checklist",
        role: "radiogroup",
        "aria-label": "Documentos do processo",
      });
      const blocoLista = grupo("Documentos do processo", { largo: true }, lista);
      blocoLista.setAttribute("hidden", "");
      let documentos: DocumentoPublico[] = [];
      let versao = 0;

      const pesquisar = h("button", { type: "button", id: "searchPub_search", class: "spro-botao" }, icone("busca", 15), "Pesquisar");
      const inserir = h("button", { type: "button", class: "spro-botao primario", disabled: "" }, "Inserir");
      const ocupado = (sim: boolean, msg = "") => {
        estado.textContent = msg;
        if (sim) pesquisar.setAttribute("disabled", "");
        else pesquisar.removeAttribute("disabled");
      };

      const falha = () => {
        w.delayCrash = false;
        ocupado(false, "Não foi possível usar a pesquisa pública agora. Tente de novo.");
      };

      /** Carrega a pagina de pesquisa no iframe e mostra a imagem de verificacao. */
      async function getDadosIframeProcessoPublicoPro(): Promise<void> {
        versao += 1;
        const minha = versao;
        imagem.replaceChildren();
        codigo.value = "";
        ocupado(true, "Carregando o código de verificação…");
        const f = getCheckerProcessoPublicoPro();
        f.src = urlPesquisa();
        const src = await aguardar((d) => {
          if (!d.querySelector("#seiSearch")) return null;
          return d.querySelector("#lblCaptcha img")?.getAttribute("src") ?? d.querySelector("#imgCaptcha")?.getAttribute("src") ?? null;
        });
        if (minha !== versao) return;
        if (!src) {
          ocupado(false, "Não foi possível carregar a pesquisa pública. Tente de novo.");
          return;
        }
        const recarregar = h(
          "button",
          {
            type: "button",
            class: "spro-botao-icone pequeno",
            title: "Outro código",
            "aria-label": "Outro código",
            onclick: () => void getDadosIframeProcessoPublicoPro(),
          },
          icone("atualizar", 15),
        );
        imagem.replaceChildren(h("img", { src, alt: "Código de verificação" }), recarregar);
        ocupado(false, "");
        codigo.focus({ preventScroll: true });
      }

      async function loadListaProcessoPublicoPro(): Promise<void> {
        const proc = processo.value.trim();
        const cod = codigo.value.trim();
        if (!proc || !cod) {
          avisar("Digite o processo e o código da imagem.");
          return;
        }
        w.delayCrash = true;
        blocoLista.setAttribute("hidden", "");
        inserir.setAttribute("disabled", "");
        ocupado(true, "Pesquisando…");
        const d = documentoDoIframe();
        if (!d) {
          ocupado(false, "A pesquisa pública não está carregada.");
          w.delayCrash = false;
          return;
        }
        const campoCodigo = d.querySelector<HTMLInputElement>("#txtCaptcha") ?? d.querySelector<HTMLInputElement>("#txtInfraCaptcha");
        const campoProcesso = d.querySelector<HTMLInputElement>("#txtProtocoloPesquisa");
        if (campoProcesso) campoProcesso.value = proc;
        if (campoCodigo) campoCodigo.value = cod;
        d.querySelector<HTMLElement>("#sbmPesquisar")?.click();
        await espera(800);
        const href = await aguardar((dd) => dd.querySelector("#conteudo a.protocoloNormal")?.getAttribute("href") ?? null);
        w.delayCrash = false;
        if (!href) {
          ocupado(false, "Processo não encontrado ou código incorreto. Confira e tente com outro código.");
          void getDadosIframeProcessoPublicoPro().catch(falha);
          return;
        }
        await getLinksProcessoPublicoPro(`${origem()}${CAMINHO}${href}`);
      }

      /** Busca a pagina do processo publico e monta a lista de documentos. */
      async function getLinksProcessoPublicoPro(href: string): Promise<void> {
        try {
          const resposta = await (c.fetch ?? c.win.fetch.bind(c.win))(href);
          const doc = analisar(await resposta.text());
          documentos = lerDocumentosPublicos(doc, origem(), href, w.getCitacaoDoc?.() ?? "SEI nº ");
        } catch {
          ocupado(false, "Não foi possível ler o processo. Tente de novo.");
          return;
        }
        lista.replaceChildren(
          ...documentos.map((d, i) => {
            const opcao = caixa({ name: "docPublico", value: String(i), ...(i === 0 ? { checked: "checked" } : {}) }, d.rotulo, "radio");
            return opcao;
          }),
        );
        blocoLista.removeAttribute("hidden");
        inserir.removeAttribute("disabled");
        ocupado(
          false,
          documentos.length
            ? `${documentos.length} ${documentos.length === 1 ? "item encontrado" : "itens encontrados"}.`
            : "O processo não tem documentos públicos.",
        );
      }

      pesquisar.addEventListener("click", () => void loadListaProcessoPublicoPro().catch(falha));
      codigo.addEventListener("keydown", (ev) => {
        if ((ev as KeyboardEvent).key === "Enter") {
          ev.preventDefault();
          void loadListaProcessoPublicoPro().catch(falha);
        }
      });
      inserir.addEventListener("click", () => {
        const marcado = [...lista.querySelectorAll<HTMLInputElement>("input")].find((i) =>
          typeof i.checked === "boolean" ? i.checked : i.hasAttribute("checked"),
        );
        const escolhido = marcado ? documentos[Number(marcado.getAttribute("value"))] : undefined;
        if (!escolhido) {
          avisar("Escolha o documento a inserir.");
          return;
        }
        A.withEdit(ed, () => A.insertHtml(ed, escolhido.html));
        dialogo.fechar();
      });

      const raiz = formulario(
        grupo("Processo", { para: "processoPub" }, processo),
        grade("duas", grupo("Imagem de verificação", {}, imagem), grupo("Digite o código da imagem", { para: "captchaPub" }, codigo)),
        h("div", { class: "spro-barra fim" }, estado, pesquisar),
        blocoLista,
        h("div", { class: "spro-dialogo-rodape" }, inserir),
      );
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Adicionar link de documento público",
        largura: 640,
        conteudo: raiz,
        aoFechar: () => {
          versao += 1;
          w.delayCrash = false;
        },
      });
      void getDadosIframeProcessoPublicoPro().catch(falha);
    }

    return { getCheckerProcessoPublicoPro, openDialogProcessoPublicoPro };
  },
};
