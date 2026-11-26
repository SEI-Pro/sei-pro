import { areaMemoria } from "@comum/armazenamento/area";
import { disparar } from "../../sei-comum/tests/util";
import { montarPagina } from "../src/painel/main";
import { CHAVE_NUMERAR } from "../src/preferencias";
import { checar, docDe, teste } from "./util";

const tique = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

const montar = () => {
  const doc = docDe("<html><body><div id='p'></div></body></html>");
  const raiz = doc.getElementById("p") as HTMLElement;
  return { raiz, caixa: () => raiz.querySelector("input[type=checkbox]") as HTMLInputElement };
};

await teste("pagina desmarcada por padrao e explica o formato", () => {
  const { raiz, caixa } = montar();
  const p = montarPagina(raiz, areaMemoria());
  checar("desmarcada", !caixa().checked);
  checar("titulo", raiz.querySelector("h1")?.textContent === "Base de Conhecimento");
  checar("explicacao do formato", raiz.textContent?.includes("1. Pasta, 1.1 Sub-pasta, 1.1.1 Sub-sub-pasta") === true);
  checar("nota do escopo por navegador", raiz.textContent?.includes("Vale só neste navegador") === true);
  p.destruir();
});

await teste("marcar grava sim, desmarcar grava nao e destruir limpa a pagina", async () => {
  const { raiz, caixa } = montar();
  const area = areaMemoria();
  const p = montarPagina(raiz, area);
  const c = caixa();
  c.checked = true;
  disparar(c, "change");
  await tique();
  checar("gravou sim", (await area.obter(CHAVE_NUMERAR))[CHAVE_NUMERAR] === "sim");
  c.checked = false;
  disparar(c, "change");
  await tique();
  checar("gravou nao", (await area.obter(CHAVE_NUMERAR))[CHAVE_NUMERAR] === "nao");
  p.destruir();
  checar("destruir limpa", raiz.childNodes.length === 0);
});

await teste("area com sim abre marcada", async () => {
  const { raiz, caixa } = montar();
  const p = montarPagina(raiz, areaMemoria({ [CHAVE_NUMERAR]: "sim" }));
  await tique();
  checar("marcada", caixa().checked === true);
  p.destruir();
});
