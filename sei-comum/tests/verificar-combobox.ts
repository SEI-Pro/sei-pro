import { criarCombo, filtrarOpcoes, partesDestacadas } from "../src/ui/combobox";
import { checar, disparar, instalarDom, secao } from "./util";

const tique = (ms = 5) => new Promise((r) => setTimeout(r, ms));

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
function tecla(el: Element, key: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  el.dispatchEvent(ev);
}

const PASTAS = [
  { valor: "a", rotulo: "Licitações", contagem: 3 },
  { valor: "b", rotulo: "Fiscalização", contagem: 4 },
  { valor: "c", rotulo: "Contratos", contagem: 2 },
  { valor: "d", rotulo: "Ação Civil Pública", contagem: 1 },
];

export async function verificarCombobox(): Promise<void> {
  secao("combobox: filtro sem acento nem caixa");
  checar(
    "'licitacoes' acha 'Licitações'",
    filtrarOpcoes(PASTAS, "licitacoes")
      .map((o) => o.valor)
      .join() === "a",
  );
  checar(
    "'ACAO civil' acha 'Ação Civil Pública' (palavras em qualquer parte)",
    filtrarOpcoes(PASTAS, "ACAO civil")
      .map((o) => o.valor)
      .join() === "d",
  );
  checar(
    "'co' poe primeiro quem comeca com o termo",
    filtrarOpcoes(PASTAS, "co")[0]?.valor === "c",
    filtrarOpcoes(PASTAS, "co").map((o) => o.rotulo),
  );
  checar("termo vazio devolve tudo na ordem", filtrarOpcoes(PASTAS, "  ").length === 4);
  const partes = partesDestacadas("Fiscalização", "zacao");
  checar(
    "destaca o trecho achado no texto ORIGINAL (com acento)",
    partes.map((p) => (p.marcado ? `[${p.texto}]` : p.texto)).join("") === "Fiscali[zação]",
    partes,
  );

  secao("combobox: multipla escolha");
  const doc = instalarDom('<html><body><div id="r"></div></body></html>');
  let mudou: string[] = [];
  const combo = criarCombo({ rotulo: "Pasta", multiplo: true, opcoes: PASTAS, vazio: "Todas as pastas", aoMudar: (v) => (mudou = v) });
  doc.getElementById("r")!.append(combo.el);
  checar("botao mostra o texto de vazio", (combo.el.textContent ?? "").includes("Todas as pastas"));
  checar("acessivel como combobox", combo.el.getAttribute("role") === "combobox" && combo.el.getAttribute("aria-expanded") === "false");
  {
    // O texto de vazio muda depois de criado (ex.: "carregando..." -> "selecione..."), sem mexer na escolha.
    const c2 = criarCombo({ rotulo: "Tipo", opcoes: [], vazio: "carregando..." });
    c2.definirVazio("selecione o tipo");
    checar(
      "definirVazio troca o texto do botao",
      (c2.el.textContent ?? "").includes("selecione o tipo") && !(c2.el.textContent ?? "").includes("carregando"),
    );
    const c3 = criarCombo({ rotulo: "Tipo", opcoes: PASTAS, valor: ["a"], vazio: "nada" });
    c3.definirVazio("outro vazio");
    checar("definirVazio com escolha mostra a escolha", (c3.el.textContent ?? "").includes("Licitações") && c3.valor().join() === "a");
  }
  combo.el.click();
  await tique();
  const pop = () => doc.querySelector(".spro-combo-pop");
  checar(
    "abre a lista com a busca",
    !!pop() && !!pop()!.querySelector("input.spro-combo-busca") && combo.el.getAttribute("aria-expanded") === "true",
  );
  checar("mostra a contagem de cada opcao", pop()!.querySelector('[data-valor="b"] .spro-combo-conta')?.textContent === "4");
  const busca = pop()!.querySelector("input.spro-combo-busca") as HTMLInputElement;
  busca.value = "fiscalizacao";
  disparar(busca, "input");
  await tique();
  const visiveis = () => [...pop()!.querySelectorAll('[role="option"]')].map((o) => o.getAttribute("data-valor"));
  checar("digitar filtra (sem acento)", visiveis().join() === "b", visiveis());
  tecla(busca, "Enter");
  await tique();
  checar("Enter marca a opcao em destaque e mantem aberto (multiplo)", mudou.join() === "b" && !!pop());
  busca.value = "";
  disparar(busca, "input");
  await tique();
  (pop()!.querySelector('[data-valor="c"]') as HTMLElement).click();
  await tique();
  checar("clicar acrescenta", mudou.join() === "b,c", mudou);
  checar("opcao marcada fica aria-selected", pop()!.querySelector('[data-valor="c"]')?.getAttribute("aria-selected") === "true");
  tecla(busca, "Backspace");
  await tique();
  checar("Backspace com a busca vazia tira a ultima", mudou.join() === "b", mudou);
  tecla(busca, "Escape");
  await tique();
  checar("Esc fecha", !pop() && combo.el.getAttribute("aria-expanded") === "false");
  checar("botao resume a escolha", (combo.el.textContent ?? "").includes("Fiscalização"), combo.el.textContent);
  combo.el.click();
  await tique();
  (pop()!.querySelector(".spro-combo-limpar") as HTMLElement).click();
  await tique();
  checar("Limpar zera", mudou.length === 0);
  disparar(doc.body, "pointerdown");
  await tique();
  checar("clicar fora fecha", !pop());

  secao("combobox: escolha simples, teclado e criar");
  let simples: string[] = [];
  const criados: string[] = [];
  const unico = criarCombo({
    rotulo: "Pasta",
    opcoes: () => PASTAS,
    vazio: "(sem pasta)",
    aoMudar: (v) => (simples = v),
    criar: async (t) => {
      criados.push(t);
      return { valor: "novo", rotulo: t };
    },
    rotuloCriar: (t) => `Criar pasta “${t}”`,
  });
  doc.getElementById("r")!.append(unico.el);
  tecla(unico.el, "ArrowDown");
  await tique();
  const b2 = pop()!.querySelector("input.spro-combo-busca") as HTMLInputElement;
  tecla(b2, "ArrowDown");
  tecla(b2, "Enter");
  await tique();
  checar("setas e Enter escolhem e fecham (simples)", simples.join() === "b" && !pop(), simples);
  unico.el.click();
  await tique();
  const b3 = pop()!.querySelector("input.spro-combo-busca") as HTMLInputElement;
  b3.value = "Convênios";
  disparar(b3, "input");
  await tique();
  const criar = pop()!.querySelector(".spro-combo-criar") as HTMLElement | null;
  checar("sem achar, oferece criar", criar?.textContent?.includes("Criar pasta “Convênios”") === true, criar?.textContent);
  criar!.click();
  await tique(20);
  checar("criar chama o criador e ja escolhe", criados.join() === "Convênios" && simples.join() === "novo");
}

export async function verificarComboboxExtensoes(): Promise<void> {
  secao("combobox: complemento, marca, estados e lista longa");
  const doc = instalarDom('<html><body><div id="r"></div></body></html>');
  const pop = () => doc.querySelector(".spro-combo-pop");
  const marca = (cor: string) => () => {
    const s = doc.createElement("span");
    s.className = "teste-marca";
    s.setAttribute("data-cor", cor);
    return s;
  };
  const gente = [
    { valor: "ana", rotulo: "ana.silva", complemento: "Ana Paula da Silva", marca: marca("a") },
    { valor: "joao", rotulo: "joao.pereira", complemento: "João Carlos Pereira" },
    { valor: "zeca", rotulo: "zeca", complemento: "José Antônio Ribeiro" },
  ];
  checar(
    "o complemento entra na busca, sem acento nem caixa",
    filtrarOpcoes(gente, "JOSE antonio")
      .map((o) => o.valor)
      .join() === "zeca",
  );
  checar(
    "quem comeca com o termo no rotulo vem antes de quem so tem no complemento",
    filtrarOpcoes(gente, "jo")
      .map((o) => o.valor)
      .join() === "joao,zeca",
    filtrarOpcoes(gente, "jo").map((o) => o.valor),
  );
  let mudou: string[] = [];
  const c = criarCombo({ rotulo: "Usuário", busca: true, opcoes: gente, valor: ["ana"], vazio: "Escolher…", aoMudar: (v) => (mudou = v) });
  doc.getElementById("r")!.append(c.el);
  checar(
    "o botao mostra a marca, o rotulo forte e o complemento suave",
    !!c.el.querySelector(".teste-marca") &&
      c.el.querySelector(".spro-combo-rotulo")?.textContent === "ana.silva" &&
      c.el.querySelector(".spro-combo-compl")?.textContent === "Ana Paula da Silva",
  );
  c.el.click();
  await tique();
  checar(
    "a opcao mostra a marca, o rotulo e o complemento, e a atual vem marcada",
    pop()!.querySelectorAll(".teste-marca").length === 1 &&
      pop()!.querySelector('[data-valor="ana"] .spro-combo-op-rotulo')?.textContent === "ana.silva" &&
      pop()!.querySelector('[data-valor="ana"] .spro-combo-op-compl')?.textContent === "Ana Paula da Silva" &&
      pop()!.querySelector('[data-valor="ana"]')?.getAttribute("aria-selected") === "true",
  );
  const busca = pop()!.querySelector("input.spro-combo-busca") as HTMLInputElement;
  busca.value = "ribeiro";
  disparar(busca, "input");
  await tique();
  checar(
    "achar pelo complemento destaca o trecho no complemento",
    pop()!.querySelector('[data-valor="zeca"] .spro-combo-op-compl mark')?.textContent === "Ribeiro",
  );
  tecla(busca, "Enter");
  await tique();
  checar(
    "Enter escolhe e o botao passa a mostrar o novo",
    mudou.join() === "zeca" && c.el.querySelector(".spro-combo-rotulo")?.textContent === "zeca",
  );

  secao("combobox: carregando e erro");
  const lista: Array<{ valor: string; rotulo: string }> = [];
  let tentou = 0;
  const e = criarCombo({ rotulo: "Carga", opcoes: () => lista, vazio: "Carregando…" });
  doc.getElementById("r")!.append(e.el);
  e.definirEstado({ tipo: "carregando" });
  checar("botao ocupado enquanto carrega", e.el.getAttribute("aria-busy") === "true");
  e.el.click();
  await tique();
  checar(
    "esqueleto na lista e nenhuma opcao",
    pop()!.querySelectorAll(".spro-combo-esqueleto").length >= 3 &&
      pop()!.querySelectorAll('[role="option"]').length === 0 &&
      pop()!.querySelector('[role="listbox"]')?.getAttribute("aria-busy") === "true",
  );
  e.definirEstado({ tipo: "erro", mensagem: "Sem rede.", tentar: () => tentou++ });
  await tique();
  checar(
    "erro: mensagem em alerta e 'Tentar de novo'",
    pop()!.querySelector('[role="alert"]')?.textContent === "Sem rede." &&
      /Tentar de novo/.test(pop()!.querySelector(".spro-combo-de-novo")?.textContent ?? ""),
  );
  checar("erro marca o botao", e.el.classList.contains("spro-combo-erro"));
  (pop()!.querySelector(".spro-combo-de-novo") as HTMLElement).click();
  checar("'Tentar de novo' chama o chamador", tentou === 1);
  lista.push({ valor: "x", rotulo: "Xis" }, { valor: "y", rotulo: "Ypsilon" });
  e.definirEstado({ tipo: "pronto" });
  await tique();
  checar(
    "pronto: as opcoes aparecem e o erro some",
    pop()!.querySelectorAll('[role="option"]').length === 2 &&
      !pop()!.querySelector('[role="alert"]') &&
      !e.el.classList.contains("spro-combo-erro") &&
      e.el.getAttribute("aria-busy") === "false",
  );
  tecla(pop()!.querySelector("input.spro-combo-busca") ?? pop()!, "Escape");
  await tique();

  secao("combobox: lista longa limitada");
  const muitas = Array.from({ length: 450 }, (_, i) => ({
    valor: `u${i}`,
    rotulo: `usuario${String(i).padStart(3, "0")}`,
    complemento: `Pessoa ${i}`,
  }));
  const m = criarCombo({
    rotulo: "Muitos",
    opcoes: muitas,
    limite: 100,
    resumo: (_mostradas, achadas, total) => `${achadas} de ${total} usuários`,
  });
  doc.getElementById("r")!.append(m.el);
  m.el.click();
  await tique();
  checar("desenha so o limite", pop()!.querySelectorAll('[role="option"]').length === 100);
  checar(
    "avisa quantas faltam e dá a contagem",
    /Mostrando 100 de 450/.test(pop()!.textContent ?? "") && /450 de 450 usuários/.test(pop()!.textContent ?? ""),
  );
  const bm = pop()!.querySelector("input.spro-combo-busca") as HTMLInputElement;
  bm.value = "usuario44";
  disparar(bm, "input");
  await tique();
  checar(
    "filtrar traz o que estava depois do limite, sem aviso de corte",
    pop()!.querySelectorAll('[role="option"]').length === 10 && !/Mostrando/.test(pop()!.textContent ?? ""),
    pop()!.querySelectorAll('[role="option"]').length,
  );
  tecla(bm, "ArrowUp");
  tecla(bm, "Enter");
  await tique();
  checar("seta para cima no primeiro vai ao ultimo filtrado e Enter escolhe", m.valor().join() === "u449", m.valor());
}

export async function verificarComboboxNoDialogo(): Promise<void> {
  secao("combobox: dentro de um dialogo, a lista fica no dialogo");
  const doc = instalarDom('<html><body><dialog id="d" open><div id="dentro"></div></dialog></body></html>');
  const c = criarCombo({ rotulo: "Pasta", opcoes: PASTAS });
  doc.getElementById("dentro")!.append(c.el);
  c.el.click();
  await tique();
  checar("lista anexada ao dialogo aberto", doc.querySelector(".spro-combo-pop")?.parentElement?.id === "d");
}
