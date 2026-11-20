/**
 * Entrada de html/comparador-documentos.html. Liga o app ao navegador: <dialog>, ponte com a aba do SEI e Worker.
 *
 * Só o modo modal (`#modo=modal&tema=claro|escuro`): iframe transparente sobre a tela do SEI, ligado à PRÓPRIA aba
 * (pagina/main.ts), com o app num <dialog> com véu.
 */
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import type { Rpc } from "@comum/ponte/rpc";
import { acompanharTemaDoPainel, aplicarTemaDoContexto } from "@comum/tema/painel";
import { baixar, criarAbrirModal } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { CANAL_COMPARADOR } from "../modelo/constantes";
import { AppComparador } from "./app";
import { criarComparador } from "./trabalhador";

const parametros = new URLSearchParams(location.hash.slice(1));
document.documentElement.dataset.modo = "modal";
// O tema do SEI já vem no endereço: sem ele, até o contexto chegar valeria o do sistema, e com esquema de cores
// diferente do iframe o Chrome pinta o fundo opaco sobre a tela do SEI.
const temaDoEndereco = parametros.get("tema");
if (temaDoEndereco === "claro" || temaDoEndereco === "escuro") document.documentElement.dataset.tema = temaDoEndereco;
const raiz = document.getElementById("app")!;

const conexao = esperarConexaoDaAba(CANAL_COMPARADOR, {});
const mensagem = (e: unknown): string => (e instanceof Error ? e.message : String(e));

void iniciarModal();

async function iniciarModal(): Promise<void> {
  const dlg = h("dialog", { class: "spro-dialogo cmp-modal", "aria-label": "Comparar Documentos" });
  // O CSS do modal mira `dialog.cmp-modal #app`.
  dlg.append(raiz);
  document.body.append(dlg);
  let rpc: Rpc | null = null;
  let app: AppComparador | null = null;
  // Fechar o diálogo (X, Esc, véu) pede à aba que tire o iframe; sem o pedido, a tela do SEI fica presa sob ele até o F5.
  dlg.addEventListener("close", () => {
    app?.destruir();
    void rpc?.chamar("fechar", undefined, 3000).catch(() => undefined);
  });
  // Véu: o clique cai no próprio <dialog>, fora do retângulo dele. Começo e fim no véu, para uma seleção de texto
  // que termina fora não fechar a janela.
  const noVeu = (ev: MouseEvent) => {
    if (ev.target !== dlg) return false;
    const r = dlg.getBoundingClientRect();
    return ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom;
  };
  let comecouNoVeu = false;
  dlg.addEventListener("pointerdown", (ev) => {
    comecouNoVeu = noVeu(ev);
  });
  dlg.addEventListener("click", (ev) => {
    if (comecouNoVeu && noVeu(ev)) dlg.close();
    comecouNoVeu = false;
  });
  const mostrar = () => {
    if (!dlg.open) dlg.showModal();
  };
  try {
    rpc = await conexao;
    const rpcAba = rpc;
    const tema = () => rpcAba.chamar<{ temaEscuro: boolean; corTema?: string }>("tema");
    // Segue o SEI (modo noturno do SEI Pro e cor da barra).
    const html = document.documentElement;
    aplicarTemaDoContexto(html, await tema());
    acompanharTemaDoPainel(document, { aoDesligar: async () => aplicarTemaDoContexto(html, await tema()) });
    app = new AppComparador(raiz, {
      rpc,
      comparador: criarComparador(chrome.runtime.getURL("js/comparador/worker.js")),
      fechar: () => dlg.close(),
      abrirModal: criarAbrirModal(),
      baixar,
      produto: chrome.runtime.getManifest().short_name,
    });
    mostrar();
    await app.iniciar();
  } catch (e) {
    app?.destruir();
    app = null;
    // Mesmo com erro o diálogo abre: é por ele que o usuário fecha o iframe que cobre a tela.
    raiz.replaceChildren(
      h("p", { class: "spro-lista-erro" }, `Não foi possível abrir o Comparador de Documentos: ${mensagem(e)}`),
      h(
        "div",
        { class: "spro-dialogo-rodape" },
        h("button", { type: "button", class: "spro-botao", onclick: () => dlg.close() }, "Fechar"),
      ),
    );
    mostrar();
  }
}
