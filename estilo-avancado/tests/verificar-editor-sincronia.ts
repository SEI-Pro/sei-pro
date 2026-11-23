import { sincronizarEditorComEstilo } from "../src/pagina/editorSincronia";
import { checar, secao } from "./util";

function armazem(inicial: Record<string, string> = {}) {
  const m = new Map(Object.entries(inicial));
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
  };
}

export function verificarEditorSincronia(): void {
  secao("visual do editor acompanha o Estilo Avancado");
  const a = armazem();
  sincronizarEditorComEstilo(a, true);
  checar("ligou o estilo: liga o editor", a.getItem("seiSlim_editor") === "true");

  sincronizarEditorComEstilo(a, false);
  checar("desligou o estilo: desliga o editor", a.getItem("seiSlim_editor") === null);

  sincronizarEditorComEstilo(a, true);
  checar("ligou de novo: liga o editor", a.getItem("seiSlim_editor") === "true");

  // o usuario desliga so o botao do editor; o proximo carregamento (estilo continua ligado) nao religa
  a.removeItem("seiSlim_editor");
  sincronizarEditorComEstilo(a, true);
  checar("estado do estilo igual ao ultimo: nao desfaz a escolha do editor", a.getItem("seiSlim_editor") === null);

  const b = armazem({ seiSlim_editor: "true" });
  sincronizarEditorComEstilo(b, false);
  checar("primeira execucao com o estilo desligado: nao apaga a escolha antiga", b.getItem("seiSlim_editor") === "true");

  const quebrado = {
    getItem: (): string | null => {
      throw new Error("bloqueado");
    },
    setItem: () => {
      throw new Error("bloqueado");
    },
    removeItem: () => {},
  };
  let lancou = false;
  try {
    sincronizarEditorComEstilo(quebrado, true);
  } catch {
    lancou = true;
  }
  checar("storage bloqueado nao derruba a pagina", !lancou);
}
