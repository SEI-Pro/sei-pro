/**
 * O que o menu faz de verdade na página do SEI: copiar para a área de transferência, abrir telas no visualizador ou
 * em outra aba, duplicar, perguntar. Os itens (`acoes.ts`) só chamam estes serviços quando o usuário os escolhe.
 */

import { h } from "@comum/ui/dom";
import { duplicarDocumento } from "@nucleo/dominio/documento";
import type { Sei } from "@nucleo/sei";
import type { Http } from "@nucleo/sessao/http";
import type { DadoProcesso } from "../../modelo/dados";
import { avisarNoTopo, copiarTexto, mensagemDeErro } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, rodape } from "../modais/comum";
import { alternarMarcaDoProcesso } from "../paineis/dadosProcesso";
import type { Servicos } from "./acoes";
import type { Copia } from "./copiar";

export const EVENTO_LEGADO = "seipro-processo-menu";
export const ATRIBUTO_PEDIDO = "data-spro-pm-pedido";

/** O texto vai como `text/plain` e o hiperlink como `text/html` (para colar num documento do SEI). */
async function copiarComLink(doc: Document, c: Copia): Promise<boolean> {
  if (!c.html) return copiarTexto(doc, c.texto);
  const janela = doc.defaultView as (Window & { ClipboardItem?: typeof ClipboardItem }) | null;
  try {
    if (janela?.ClipboardItem && janela.navigator.clipboard?.write) {
      await janela.navigator.clipboard.write([
        new janela.ClipboardItem({
          "text/html": new Blob([c.html], { type: "text/html" }),
          "text/plain": new Blob([c.texto], { type: "text/plain" }),
        }),
      ]);
      return true;
    }
  } catch {
    // sem a API (ou sem foco): o caminho antigo do navegador, logo abaixo
  }
  let ok = false;
  const ao = (e: ClipboardEvent) => {
    e.clipboardData?.setData("text/html", c.html ?? "");
    e.clipboardData?.setData("text/plain", c.texto);
    e.preventDefault();
  };
  doc.addEventListener("copy", ao);
  try {
    ok = doc.execCommand("copy");
  } catch {
    ok = false;
  }
  doc.removeEventListener("copy", ao);
  return ok;
}

/** Os dois quadros do visualizador, de fora para dentro (`ifrConteudoVisualizacao` > `ifrVisualizacao` no SEI 4.1+). */
function quadrosDoVisualizador(topo: Document): HTMLIFrameElement[] {
  const fora = (topo.getElementById("ifrConteudoVisualizacao") ?? topo.getElementById("ifrVisualizacao")) as HTMLIFrameElement | null;
  if (!fora) return [];
  const saida = [fora];
  try {
    const dentro = fora.contentDocument?.getElementById("ifrVisualizacao") as HTMLIFrameElement | null | undefined;
    if (dentro && dentro !== fora) saida.push(dentro);
  } catch {
    // quadro de outra origem
  }
  return saida;
}

export interface DepsServicos {
  ctx: ContextoProcesso;
  http: Http;
  sei: Sei;
  /** Recarrega a árvore (depois de duplicar). Nos testes, um registro. */
  recarregarArvore(): void;
}

export function criarServicos(d: DepsServicos): Servicos {
  const { ctx } = d;
  const doc = ctx.doc;
  const absoluta = (link: string) => new URL(link, doc.baseURI).href;
  const avisar = (t: string, ms?: number) => avisarNoTopo(ctx, t, ms);

  const pergunta = (
    titulo: string,
    texto: string,
    botoes: Array<{ id: string; rotulo: string; principal?: boolean }>,
  ): Promise<string | null> =>
    new Promise((resolver) => {
      let resposta: string | null = null;
      const dlg = abrirDialogo(ctx, {
        titulo,
        icone: "alerta",
        largura: 420,
        conteudo: [
          h("p", {}, texto),
          rodape(
            ...botoes.map((b) =>
              b.principal
                ? botaoPrimario(b.rotulo, () => {
                    resposta = b.id;
                    dlg.fechar();
                  })
                : h(
                    "button",
                    {
                      type: "button",
                      class: "spro-botao",
                      onclick: () => {
                        resposta = b.id;
                        dlg.fechar();
                      },
                    },
                    b.rotulo,
                  ),
            ),
          ),
        ],
        aoFechar: () => resolver(resposta),
      });
    });

  return {
    async copiar(c, aviso) {
      const ok = await copiarComLink(doc, c);
      avisar(ok ? aviso : "Não foi possível copiar.", 1800);
    },

    abrirNoVisualizador(link) {
      const quadros = quadrosDoVisualizador(ctx.topo);
      const alvo = quadros[quadros.length - 1];
      if (!alvo) return avisar("Não achei o visualizador do SEI nesta tela.", 5000);
      alvo.setAttribute("src", absoluta(link));
    },

    abrirEmNovaAba(link) {
      const a = h("a", { href: absoluta(link), target: "_blank", rel: "noopener" });
      doc.body.append(a);
      a.click();
      a.remove();
    },

    baixar(link, nome) {
      const a = h("a", { href: absoluta(link), download: nome });
      doc.body.append(a);
      a.click();
      a.remove();
    },

    async duplicar(numero, semMinuta) {
      avisar("Duplicando o documento...", 20000);
      try {
        await duplicarDocumento(d.sei, numero, { aplicar: true }, { semMinuta });
        avisar(`Documento ${numero} duplicado. Atualizando a árvore...`, 5000);
        d.recarregarArvore();
      } catch (e) {
        avisar(mensagemDeErro(e), 8000);
      }
    },

    async perguntarMinuta() {
      const r = await pergunta("Duplicar documento", "Deseja duplicar o documento sem a denominação MINUTA?", [
        { id: "manter", rotulo: "Mantenha MINUTA" },
        { id: "remover", rotulo: "Remova a denominação MINUTA", principal: true },
      ]);
      return r === "remover" || r === "manter" ? r : null;
    },

    async confirmar(texto, rotuloOk) {
      const r = await pergunta("Confirmar", texto, [
        { id: "voltar", rotulo: "Voltar" },
        { id: "ok", rotulo: rotuloOk, principal: true },
      ]);
      return r === "ok";
    },

    async linkDaTela(urlDaTela, variavel) {
      const p = await d.http.obter(urlDaTela);
      const m = new RegExp(`var\\s+${variavel}\\s*=\\s*'([^']+)'`).exec(p.html);
      return m ? (m[1] ?? "").replace(/&amp;/g, "&") : null;
    },

    legado(pedido, idDocumento) {
      doc.documentElement.setAttribute(ATRIBUTO_PEDIDO, `${pedido}|${idDocumento ?? ""}`);
      const Ev = (doc.defaultView as (Window & { Event: typeof Event }) | null)?.Event ?? Event;
      doc.dispatchEvent(new Ev(EVENTO_LEGADO));
      // O legado (mundo da página) lê e apaga o pedido na hora. Se sobrou, ele ainda não carregou.
      if (doc.documentElement.hasAttribute(ATRIBUTO_PEDIDO)) {
        doc.documentElement.removeAttribute(ATRIBUTO_PEDIDO);
        avisar("Esta função ainda está carregando. Tente de novo em instantes.", 5000);
      }
    },

    async alternarUrgencia() {
      const dado = ctx.loja.ler<DadoProcesso>("dadosProcesso").dado;
      if (!dado?.disponivel) {
        ctx.recarregar("dadosProcesso");
        return avisar("Carregando os dados do processo. Tente de novo em instantes.", 5000);
      }
      await alternarMarcaDoProcesso(ctx, "URGENTE");
    },

    clicarBotaoNativo(funcao) {
      for (const q of quadrosDoVisualizador(ctx.topo)) {
        try {
          const botao = q.contentDocument?.querySelector<HTMLElement>(`#divArvoreAcoes a[onclick*="${funcao}("]`);
          if (botao) {
            botao.click();
            return true;
          }
        } catch {
          // quadro de outra origem
        }
      }
      return false;
    },

    avisar,
  };
}
