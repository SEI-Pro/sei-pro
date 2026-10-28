import { ordenarDemandas } from "../src/app/componentes/vistaTabela";
import type { DemandaNaTela } from "../src/app/dados";
import { naTela } from "../src/app/dados";
import { appDeTeste, digitar, itemDoMenu, itensDoMenu, marcar, nova, type Teste, tecla, texto } from "./apoioApp";
import { demanda, HOJE } from "./fabrica";
import { botao, checar, secao, tique } from "./util";

const linhas = (t: Teste) => [...t.raiz.querySelectorAll<HTMLElement>("tr.dem-tab-linha")];
const linhaDe = (t: Teste, id: string) => t.raiz.querySelector<HTMLElement>(`tr.dem-tab-linha[data-id="${id}"]`) as HTMLElement;
const ev = (el: Element, tipo: string) =>
  el.dispatchEvent(new (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event(tipo, { bubbles: true }));

export async function verificarAppTabela(): Promise<void> {
  secao("tabela: ordenar e estabilidade");
  {
    const mk = (m: Parameters<typeof demanda>[0]): DemandaNaTela => naTela(demanda(m), "unidade", HOJE);
    const itens = [
      mk({ id: "c", titulo: "Banana", prioridade: "normal", prazo: "2026-10-20", responsavel: { nome: "Zélia" } }),
      mk({ id: "a", titulo: "banana", prioridade: "urgente", prazo: "2026-10-20", responsavel: { nome: "Ana" } }),
      mk({ id: "b", titulo: "Abacaxi", prioridade: "importante", prazo: "2026-10-18" }),
      mk({ id: "d", titulo: "Cereja", prioridade: "urgente", prazo: "2026-10-25", iniciadaEm: 1, tempoGastoMin: 30 }),
    ];
    const ids = (c: Parameters<typeof ordenarDemandas>[1], s: 1 | -1) =>
      ordenarDemandas(itens, c, s)
        .map((x) => x.demanda.id)
        .join("");
    checar("prioridade: urgente primeiro, empate pelo id", ids("prioridade", 1) === "adbc", ids("prioridade", 1));
    checar("prioridade invertida mantem o empate pelo id", ids("prioridade", -1) === "cbad", ids("prioridade", -1));
    checar("titulo com localeCompare pt-BR, empate pelo id", ids("titulo", 1) === "bacd" || ids("titulo", 1) === "bcad", ids("titulo", 1));
    checar("prazo: o mais proximo primeiro, empate pelo id", ids("prazo", 1) === "bacd", ids("prazo", 1));
    checar(
      "responsavel: sem responsavel antes pelo vazio",
      ids("responsavel", 1).startsWith("bd") || ids("responsavel", 1).startsWith("db"),
      ids("responsavel", 1),
    );
    checar(
      "situacao: iniciada depois da nao iniciada",
      ids("situacao", 1).endsWith("d") && ids("situacao", -1).startsWith("d"),
      ids("situacao", 1),
    );
    checar("tempo: sem tempo primeiro", ids("tempo", 1).endsWith("d"), ids("tempo", 1));
    const mesmo =
      ordenarDemandas(itens, "prazo", 1)
        .map((x) => x.demanda.id)
        .join() ===
      ordenarDemandas([...itens].reverse(), "prazo", 1)
        .map((x) => x.demanda.id)
        .join();
    checar("o resultado nao depende da ordem de entrada", mesmo);
  }

  secao("tabela: linhas, cabecalho ordenavel e marcas");
  {
    const t = appDeTeste();
    const a = await nova(t, "unidade", "Alfa", "nao_iniciada", {
      prioridade: "urgente",
      checklist: [
        { id: "i1", texto: "x", feito: true },
        { id: "i2", texto: "y", feito: false },
      ],
      responsavel: { login: "carla", nome: "Carla Dias" },
    });
    await nova(t, "eu", "Beta");
    await t.montar();
    checar("uma linha por demanda com data-id", linhas(t).length === 2 && !!linhaDe(t, a));
    checar("a barra de prioridade urgente", !!linhaDe(t, a).querySelector(".dem-prio.urgente"));
    checar("o contador do checklist", texto(linhaDe(t, a).querySelector(".dem-barra")) === "1/2");
    checar(
      "o responsavel aparece com avatar",
      texto(linhaDe(t, a).querySelector(".dem-resp")).includes("Carla Dias") && !!linhaDe(t, a).querySelector(".spro-avatar"),
    );
    checar("o selo Só eu so no escopo eu", linhas(t).filter((l) => l.querySelector(".dem-selo-eu")).length === 1);
    const th = (c: string) => t.raiz.querySelector(`th[data-coluna="${c}"]`) as HTMLElement;
    checar(
      "ordenacao inicial por prazo (crescente)",
      th("prazo").getAttribute("aria-sort") === "ascending" && th("titulo").getAttribute("aria-sort") === "none",
    );
    (th("titulo").querySelector("button") as HTMLElement).click();
    checar(
      "aria-sort no cabecalho clicado",
      th("titulo").getAttribute("aria-sort") === "ascending" && th("prazo").getAttribute("aria-sort") === "none",
    );
    (th("titulo").querySelector("button") as HTMLElement).click();
    checar("clicar de novo inverte", th("titulo").getAttribute("aria-sort") === "descending");
    checar(
      "a ordem das linhas segue o sentido",
      linhas(t)
        .map((l) => texto(l.querySelector(".dem-titulo-texto")))
        .join() === "Beta,Alfa",
    );
  }

  secao("tabela: link do processo e processo sigiloso");
  {
    const abertos: string[] = [];
    const t = appDeTeste({ abrirProcesso: (p, id) => void abertos.push(`${p}|${id}`) });
    await nova(t, "unidade", "Com processo", "nao_iniciada", {
      processos: [
        { protocolo: "50300.001234/2026-11", idProcedimento: "77" },
        { protocolo: "", sigiloso: true },
      ],
    });
    await t.montar();
    const l = linhas(t)[0] as HTMLElement;
    (l.querySelector("a.dem-processo") as HTMLElement).click();
    checar("o numero do processo e link que chama abrirProcesso", abertos.join() === "50300.001234/2026-11|77", abertos);
    checar("clicar no link nao abre o menu", !t.doc.querySelector(".spro-menu-pop"));
    checar(
      "processo sigiloso sem numero aparece como texto, sem link",
      texto(l.querySelector(".dem-processo-sigiloso")) === "Processo sigiloso" && l.querySelectorAll("a.dem-processo").length === 1,
    );
  }

  secao("tabela: menu de acoes por situacao");
  {
    const t = appDeTeste();
    const ids = {
      nao_iniciada: await nova(t, "unidade", "A nao iniciada"),
      iniciada: await nova(t, "unidade", "B iniciada", "iniciada"),
      pausada: await nova(t, "unidade", "C pausada", "pausada"),
      concluida: await nova(t, "unidade", "D concluida", "concluida"),
      avaliada: await nova(t, "unidade", "E avaliada", "avaliada"),
    };
    await t.montar();
    (t.raiz.querySelector('[data-escopo="unidade"]') as HTMLElement).click();
    botao(t.raiz, "Arquivadas")!.click();
    await nova(t, "unidade", "F arquivada", "arquivada");
    await tique(20);
    const arquivada = linhas(t).find((l) => texto(l).includes("F arquivada")) as HTMLElement;
    const itens = (l: HTMLElement) => itensDoMenu(l, "Ações da demanda");
    const esperado: Record<string, string[]> = {
      nao_iniciada: ["Iniciar", "Editar", "Prorrogar…", "Duplicar", "Histórico", "Excluir"],
      iniciada: ["Pausar", "Concluir…", "Voltar a não iniciada", "Prorrogar…", "Editar", "Histórico"],
      pausada: ["Retomar", "Concluir…", "Prorrogar…", "Editar", "Histórico"],
      concluida: ["Avaliar…", "Reabrir", "Arquivar", "Editar", "Histórico"],
      avaliada: ["Cancelar avaliação", "Arquivar", "Editar", "Histórico"],
    };
    for (const [s, id] of Object.entries(ids))
      checar(
        `menu da situacao ${s}: so o que vale`,
        itens(linhaDe(t, id)).join("|") === (esperado[s] as string[]).join("|"),
        itens(linhaDe(t, id)),
      );
    checar("menu da arquivada", itens(arquivada).join("|") === "Desarquivar|Histórico|Excluir", itens(arquivada));

    tecla(linhaDe(t, ids.nao_iniciada), "Enter");
    checar("Enter na linha abre o menu", !!t.doc.querySelector(".spro-menu-pop"));
    tecla(t.doc.querySelector(".spro-menu-pop") as HTMLElement, "Escape");
    checar("Esc fecha o menu", !t.doc.querySelector(".spro-menu-pop"));
    linhaDe(t, ids.nao_iniciada).click();
    checar("clicar na linha tambem abre o menu", !!t.doc.querySelector(".spro-menu-pop"));
    tecla(t.doc.querySelector(".spro-menu-pop") as HTMLElement, "Escape");

    const antes = linhas(t).length;
    itemDoMenu(linhaDe(t, ids.nao_iniciada), "Ações da demanda", "Duplicar");
    await tique(20);
    checar("Duplicar cria outra linha", linhas(t).length === antes + 1);
    itemDoMenu(linhaDe(t, ids.nao_iniciada), "Ações da demanda", "Iniciar");
    await tique(20);
    checar("Iniciar grava e a linha muda de situacao", texto(linhaDe(t, ids.nao_iniciada).querySelector(".dem-situacao")) === "Iniciada");
    itemDoMenu(linhaDe(t, ids.iniciada), "Ações da demanda", "Pausar");
    await tique(20);
    checar("Pausar", texto(linhaDe(t, ids.iniciada).querySelector(".dem-situacao")) === "Pausada");
    itemDoMenu(linhaDe(t, ids.concluida), "Ações da demanda", "Arquivar");
    await tique(20);
    checar("Arquivar", texto(linhaDe(t, ids.concluida).querySelector(".dem-situacao")) === "Arquivada");
    itemDoMenu(linhaDe(t, ids.avaliada), "Ações da demanda", "Cancelar avaliação");
    await tique(20);
    checar("Cancelar avaliacao volta a concluida", texto(linhaDe(t, ids.avaliada).querySelector(".dem-situacao")) === "Concluída");
  }

  secao("tabela: edicao inline");
  {
    const t = appDeTeste();
    const id = await nova(t, "unidade", "Titulo velho", "nao_iniciada", { etiquetas: ["ti"] });
    await t.montar();
    const titulo = () => linhaDe(t, id).querySelector(".dem-titulo-texto") as HTMLElement;
    ev(titulo(), "dblclick");
    const campo = () => linhaDe(t, id).querySelector("input.dem-inline") as HTMLInputElement;
    checar("duplo clique abre o campo preenchido", !!campo() && campo().value === "Titulo velho");
    digitar(campo(), "Titulo novo");
    tecla(campo(), "Escape");
    checar("Esc desfaz sem gravar", texto(titulo()) === "Titulo velho" && (await t.repos.unidade.obter(id))?.titulo === "Titulo velho");
    ev(titulo(), "dblclick");
    digitar(campo(), "Titulo novo");
    tecla(campo(), "Enter");
    await tique(30);
    checar("Enter grava", (await t.repos.unidade.obter(id))?.titulo === "Titulo novo" && texto(titulo()) === "Titulo novo");
    ev(titulo(), "dblclick");
    digitar(campo(), "   ");
    tecla(campo(), "Enter");
    await tique(30);
    checar(
      "titulo vazio nao grava e a linha volta ao que era",
      (await t.repos.unidade.obter(id))?.titulo === "Titulo novo" && texto(titulo()) === "Titulo novo",
    );
    const etiquetas = () => linhaDe(t, id).querySelector(".dem-etiquetas") as HTMLElement;
    ev(etiquetas(), "dblclick");
    digitar(campo(), "ti, urgente , ,Ti");
    tecla(campo(), "Enter");
    await tique(30);
    checar(
      "etiquetas inline: separadas por virgula, sem vazias nem repetidas",
      (await t.repos.unidade.obter(id))?.etiquetas.join() === "ti,urgente",
      (await t.repos.unidade.obter(id))?.etiquetas,
    );
  }

  secao("tabela: excluir pede confirmacao e Desfazer restaura");
  {
    const perguntas: string[] = [];
    let resposta = false;
    const t = appDeTeste({
      confirmar: async (p) => {
        perguntas.push(p);
        return resposta;
      },
    });
    const id = await nova(t, "unidade", "Para excluir");
    await t.montar();
    itemDoMenu(linhaDe(t, id), "Ações da demanda", "Excluir");
    await tique(20);
    checar("pergunta antes de excluir", perguntas.length === 1 && perguntas[0]?.includes("Para excluir") === true);
    checar("recusar nao exclui", !!(await t.repos.unidade.obter(id)) && !!linhaDe(t, id));
    resposta = true;
    itemDoMenu(linhaDe(t, id), "Ações da demanda", "Excluir");
    await tique(30);
    checar("confirmar exclui", !(await t.repos.unidade.obter(id)) && !t.raiz.querySelector(`tr[data-id="${id}"]`));
    const aviso = t.doc.querySelector(".spro-aviso") as HTMLElement;
    checar("o aviso oferece Desfazer", !!aviso && texto(aviso).includes("Demanda excluída") && !!botao(aviso, "Desfazer"));
    botao(aviso, "Desfazer")!.click();
    await tique(30);
    checar("Desfazer restaura a demanda", !!(await t.repos.unidade.obter(id)) && !!t.raiz.querySelector(`tr[data-id="${id}"]`));
  }

  secao("tabela: selecao em lote");
  {
    const t = appDeTeste();
    const a = await nova(t, "unidade", "Concluida", "concluida");
    const b = await nova(t, "unidade", "Aberta 1");
    const c = await nova(t, "eu", "Aberta 2", "iniciada");
    await t.montar();
    const caixa = (id: string) => linhaDe(t, id).querySelector("input.dem-sel") as HTMLInputElement;
    checar("sem selecao nao ha barra", !t.raiz.querySelector(".dem-lote"));
    for (const id of [a, b, c]) marcar(caixa(id));
    const lote = t.raiz.querySelector(".dem-lote") as HTMLElement;
    checar("a barra mostra Arquivar (3) e Excluir (3)", !!botao(lote, "Arquivar (3)") && !!botao(lote, "Excluir (3)"), texto(lote));
    botao(lote, "Arquivar (3)")!.click();
    await tique(40);
    checar(
      "arquivarVarias: so a concluida arquivou",
      !!(await t.repos.unidade.obter(a))?.arquivadoEm &&
        !(await t.repos.unidade.obter(b))?.arquivadoEm &&
        !(await t.repos.eu.obter(c))?.arquivadoEm,
    );
    checar(
      "o aviso conta 1 arquivada, 2 ignoradas",
      texto(t.doc.querySelector(".spro-aviso")).includes("1 arquivada, 2 ignoradas"),
      texto(t.doc.querySelector(".spro-aviso")),
    );
    checar("a selecao some depois", !t.raiz.querySelector(".dem-lote"));
    for (const id of [b, c]) marcar(caixa(id));
    botao(t.raiz.querySelector(".dem-lote") as HTMLElement, "Excluir (2)")!.click();
    await tique(40);
    checar("excluir em lote", !(await t.repos.unidade.obter(b)) && !(await t.repos.eu.obter(c)));
  }
}

export async function verificarAlturaDaTabela(): Promise<void> {
  secao("tabela: altura limitada com alca so no painel embutido");
  {
    const t = appDeTeste({ modo: "embutido" });
    await nova(t, "unidade", "Alfa");
    await nova(t, "eu", "Beta");
    await t.montar();
    const caixa = t.raiz.querySelector<HTMLElement>(".dem-tabela-caixa");
    const alca = t.raiz.querySelector<HTMLElement>(".spro-altura-alca");
    checar(
      "a caixa da tabela ganha altura maxima e rolagem",
      !!caixa?.classList.contains("spro-altura-rolagem") && caixa.style.getPropertyValue("--spro-altura-max") === "520px",
    );
    checar(
      "a alca e o ultimo item, logo depois da caixa",
      !!alca && caixa?.nextElementSibling === alca && alca.parentElement?.lastElementChild === alca,
    );
    checar(
      "alca acessivel",
      alca?.getAttribute("role") === "separator" &&
        alca.getAttribute("aria-orientation") === "horizontal" &&
        alca.getAttribute("tabindex") === "0",
    );
    checar("as linhas continuam la", linhas(t).length === 2);
    ev(alca!, "dblclick");
    await tique();
    checar(
      "duplo clique ajusta ao conteudo e grava",
      caixa?.getAttribute("data-altura") === "auto" &&
        JSON.stringify((await t.area.obter("spro_altura:demandas-tabela"))["spro_altura:demandas-tabela"]) ===
          JSON.stringify({ auto: true, px: null }),
    );
    const botaoOrdem = t.raiz.querySelector<HTMLElement>("th button.dem-ordenar");
    botaoOrdem?.click();
    await tique();
    checar(
      "redesenhar (ordenar) mantem o modo escolhido",
      t.raiz.querySelector(".dem-tabela-caixa")?.getAttribute("data-altura") === "auto",
    );
  }
  {
    const t = appDeTeste({ modo: "pagina" });
    await nova(t, "unidade", "Alfa");
    await t.montar();
    checar(
      "na pagina (ja rola): sem alca e sem limite",
      !t.raiz.querySelector(".spro-altura-alca") && !t.raiz.querySelector(".spro-altura-rolagem"),
    );
  }
}
