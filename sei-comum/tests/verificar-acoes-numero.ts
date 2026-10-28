import { acoesDoNumero, copiarTexto } from "../src/ui/acoesNumeroProcesso";
import { checar, disparar, instalarDom, secao, tique } from "./util";

function comNavigator<T>(valor: unknown, fn: () => Promise<T>): Promise<T> {
  const antes = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: valor });
  return fn().finally(() => {
    if (antes) Object.defineProperty(globalThis, "navigator", antes);
    else delete (globalThis as { navigator?: unknown }).navigator;
  });
}

export async function verificarAcoesNumero(): Promise<void> {
  secao("acoesDoNumero: abrir em nova aba + copiar numero");
  const doc = instalarDom('<html><body><ul id="l"><li id="linha"></li></ul></body></html>');
  const linha = doc.getElementById("linha")!;
  const copiados: string[] = [];
  let abertos = 0;
  let subiu = 0;
  linha.addEventListener("click", () => void subiu++);
  linha.addEventListener("keydown", () => void subiu++);
  linha.append(
    acoesDoNumero({
      protocolo: "50300.000001/2026-01",
      doc,
      aoAbrirNovaAba: () => void abertos++,
      copiar: async (t) => {
        copiados.push(t);
        return true;
      },
    }),
  );
  const [abrir, copiar] = [...linha.children] as HTMLElement[];
  checar("dois botoes, abrir antes de copiar", linha.children.length === 2 && abrir?.tagName === "BUTTON" && copiar?.tagName === "BUTTON");
  checar(
    "abrir: classe e aria-label",
    !!abrir?.classList.contains("spro-nova-guia") && abrir.getAttribute("aria-label") === "Abrir 50300.000001/2026-01 em nova aba",
  );
  checar(
    "copiar: classe e aria-label",
    !!copiar?.classList.contains("spro-copiar-num") && copiar.getAttribute("aria-label") === "Copiar número do processo",
  );
  checar("sem title (so aria-label)", !abrir?.hasAttribute("title") && !copiar?.hasAttribute("title"));
  checar("type=button", abrir?.getAttribute("type") === "button" && copiar?.getAttribute("type") === "button");

  abrir!.click();
  checar("abrir chama o callback uma vez e nao propaga", abertos === 1 && subiu === 0);
  disparar(abrir!, "keydown");
  disparar(copiar!, "keydown");
  checar("Enter/Espaco nos botoes nao sobem", subiu === 0);

  copiar!.click();
  await tique();
  checar("copiar entrega o numero", copiados.length === 1 && copiados[0] === "50300.000001/2026-01");
  checar("copiar nao propaga", subiu === 0);
  checar(
    "feedback: classe e aviso",
    copiar!.classList.contains("spro-copiado") && copiar!.querySelector("[role=status]")?.textContent === "Número copiado",
  );
  checar("feedback: um unico svg", copiar!.querySelectorAll("svg").length === 1);
  checar("aria-live polite", copiar!.querySelector("[role=status]")?.getAttribute("aria-live") === "polite");
  await tique(1600);
  checar("reverte em 1,5 s", !copiar!.classList.contains("spro-copiado") && copiar!.querySelector("[role=status]")?.textContent === "");

  secao("acoesDoNumero: falha ao copiar e variante com link");
  const l2 = doc.createElement("div");
  doc.body.append(l2);
  l2.append(acoesDoNumero({ protocolo: "1/2026", doc, compacto: true, aoAbrirNovaAba: () => undefined, copiar: async () => false }));
  const c2 = l2.querySelector<HTMLElement>(".spro-copiar-num")!;
  c2.click();
  await tique();
  checar(
    "falha: avisa e nao marca copiado",
    !c2.classList.contains("spro-copiado") && c2.querySelector("[role=status]")?.textContent === "Não foi possível copiar",
  );
  checar(
    "compacto: classe",
    c2.classList.contains("spro-acao-num-compacta") &&
      l2.querySelector(".spro-nova-guia")?.classList.contains("spro-acao-num-compacta") === true,
  );

  const l3 = doc.createElement("div");
  doc.body.append(l3);
  let sobe3 = 0;
  l3.addEventListener("click", () => void sobe3++);
  l3.append(acoesDoNumero({ protocolo: "2/2026", doc, href: "/sei/controlador.php?x=1&infra_hash=abc" }));
  const a3 = l3.querySelector<HTMLAnchorElement>("a.spro-nova-guia")!;
  checar(
    "com href: link assinado, _blank, noopener",
    a3?.getAttribute("href") === "/sei/controlador.php?x=1&infra_hash=abc" &&
      a3.getAttribute("target") === "_blank" &&
      a3.getAttribute("rel") === "noopener",
  );
  checar("com href: aria-label", a3?.getAttribute("aria-label") === "Abrir 2/2026 em nova aba");
  a3.addEventListener("click", (ev) => ev.preventDefault());
  a3.click();
  checar("com href: clique nao sobe", sobe3 === 0);

  secao("copiarTexto: clipboard e fallback");
  const escritos: string[] = [];
  const ok = await comNavigator({ clipboard: { writeText: async (t: string) => void escritos.push(t) } }, () => copiarTexto(doc, "abc"));
  checar("usa navigator.clipboard", ok && escritos[0] === "abc");
  // O linkedom nao implementa select() na textarea.
  (Object.getPrototypeOf(doc.createElement("textarea")) as { select?: () => void }).select = () => undefined;
  let usouExec = 0;
  (doc as unknown as { execCommand: () => boolean }).execCommand = () => {
    usouExec++;
    return true;
  };
  const ok2 = await comNavigator({ clipboard: { writeText: async () => Promise.reject(new Error("negado")) } }, () =>
    copiarTexto(doc, "abc"),
  );
  checar("clipboard recusado cai no execCommand", ok2 && usouExec === 1);
  const ok3 = await comNavigator(undefined, () => copiarTexto(doc, "abc"));
  checar("sem clipboard cai no execCommand", ok3 && usouExec === 2);
  checar("textarea temporaria removida", doc.querySelectorAll("textarea").length === 0);
}
