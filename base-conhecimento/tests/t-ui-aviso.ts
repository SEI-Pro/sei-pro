import { readFileSync } from "node:fs";
import { criarAvisos } from "../src/ui/aviso";
import { checar, docDe, teste } from "./util";

const CSS = readFileSync(new URL("../src/ui/aviso.css", import.meta.url), "utf8");

function montar(o: { duracaoMs?: number } = {}) {
  const doc = docDe("<html><body></body></html>");
  const a = criarAvisos({ doc, css: CSS, ...o });
  const host = doc.querySelector(".spro-bc-avisos") as HTMLElement;
  return { doc, a, raiz: host.shadowRoot as unknown as DocumentFragment };
}

await teste("avisar mostra status acessivel, com botao de fechar", () => {
  const { a, raiz } = montar();
  a.avisar("Pasta criada");
  const aviso = raiz.querySelector('.aviso[role="status"][aria-live="polite"]');
  checar("aviso", aviso !== null && (aviso.textContent ?? "").includes("Pasta criada"));
  checar("css fixo no topo", CSS.includes("position: fixed"));
  checar("token acessivel", CSS.includes("#155f9b"));
  const fechar = raiz.querySelector('[aria-label="Fechar aviso"]') as HTMLElement;
  checar("fechar existe", fechar !== null);
  fechar.click();
  checar("removido", raiz.querySelector(".aviso") === null);
  a.destruir();
});

await teste("dois avisos empilham e o timer remove", async () => {
  const { a, raiz } = montar({ duracaoMs: 10 });
  a.avisar("um");
  a.avisar("dois");
  checar("dois avisos", raiz.querySelectorAll(".aviso").length === 2);
  await new Promise((r) => setTimeout(r, 40));
  checar("sumiram", raiz.querySelectorAll(".aviso").length === 0);
  a.destruir();
});

await teste("aviso com acao mostra o botao, executa e remove", () => {
  const { a, raiz } = montar();
  let feito = 0;
  a.avisar("Documento criado", {
    rotulo: "Desfazer",
    fazer: () => {
      feito += 1;
    },
  });
  const botao = raiz.querySelector(".botao-acao") as HTMLElement;
  checar("botao com rotulo", botao !== null && botao.textContent === "Desfazer");
  checar("aria-label igual ao rotulo", botao.getAttribute("aria-label") === "Desfazer");
  checar("alvo de 44px no css", CSS.includes(".botao-acao") && CSS.includes("min-height: 44px"));
  botao.click();
  checar("executou a acao", feito === 1);
  checar("removeu o aviso", raiz.querySelector(".aviso") === null);
  a.destruir();
});

await teste("aviso com acao nao expira sozinho e o x continua fechando", async () => {
  const { a, raiz } = montar({ duracaoMs: 10 });
  a.avisar("Fica", { rotulo: "Entendi e organizar", fazer: () => {} });
  await new Promise((r) => setTimeout(r, 40));
  checar("continua na tela", raiz.querySelector(".aviso") !== null);
  const fechar = raiz.querySelector('[aria-label="Fechar aviso"]') as HTMLElement;
  fechar.click();
  checar("x remove", raiz.querySelector(".aviso") === null);
  a.destruir();
});

await teste("destruir remove o host", () => {
  const { doc, a } = montar();
  a.destruir();
  checar("host removido", doc.querySelector(".spro-bc-avisos") === null);
});
