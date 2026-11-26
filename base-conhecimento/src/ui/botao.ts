/**
 * Botão "Pastas" na barra de comandos nativa: alterna entre a visão em pastas
 * (padrão) e a lista plana. O modo fica em chrome.storage.local
 * (`spro_bc_modo`), por navegador.
 */

import type { Area } from "@comum/armazenamento/area";

export const CHAVE_MODO = "spro_bc_modo";
export type Modo = "arvore" | "lista";
export const ID_BOTAO = "btnSproPastas";

export function garantirBotaoPastas(doc: Document, area: Area, aoAlternar: (modo: Modo) => void): void {
  const barra = doc.querySelector("#divInfraBarraComandosSuperior");
  if (!barra || doc.querySelector(`#${ID_BOTAO}`)) return;

  const botao = doc.createElement("button");
  botao.type = "button";
  botao.id = ID_BOTAO;
  botao.className = "infraButton";
  const tecla = doc.createElement("span");
  tecla.className = "infraTeclaAtalho";
  tecla.textContent = "P";
  botao.append(tecla, doc.createTextNode("astas"));
  barra.appendChild(botao);

  let modo: Modo = "arvore";
  let interagiu = false;
  const aplicar = (): void => {
    if (modo === "arvore") {
      botao.style.background = "#e7f0f8";
      botao.style.fontWeight = "600";
    } else {
      botao.style.background = "";
      botao.style.fontWeight = "";
    }
  };
  aplicar();

  botao.addEventListener("click", () => {
    interagiu = true;
    modo = modo === "arvore" ? "lista" : "arvore";
    aplicar();
    void area.gravar({ [CHAVE_MODO]: modo });
    aoAlternar(modo);
  });

  // O modo gravado vale ao abrir; se o usuário já clicou, o clique manda.
  void area.obter(CHAVE_MODO).then((v) => {
    if (interagiu) return;
    if (v[CHAVE_MODO] === "lista") {
      modo = "lista";
      aplicar();
      aoAlternar(modo);
    }
  });
}
