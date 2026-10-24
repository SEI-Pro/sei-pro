/**
 * Editor da anotação NO LUGAR (sem modal): abrir, digitar, contador, salvar, erro sem perder o texto, mudança da fatia durante a
 * edição, checklist, atalhos, sair do foco, descartar e remover. O linkedom não tem foco nem seleção reais: o editor recebe um
 * "ambiente" (janela com foco, elemento ativo) e os testes dão a seleção como propriedade do campo.
 */
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import type { AnotacaoProcesso } from "@nucleo/dominio/painelProcesso";
import { criarEditorAnotacao, type Encerramento, type OpcoesEditor } from "../src/pagina/paineis/anotacaoEditor";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";

const ok: ResultadoEscrita = { alvo: "x", mudancas: [], aplicado: true, resumo: "Anotacao gravada." };

function tecla(el: Element, key: string, extra: Record<string, unknown> = {}): { impediu: boolean } {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = Object.assign(new Ev("keydown", { bubbles: true, cancelable: true }), { key, ...extra });
  el.dispatchEvent(ev);
  return { impediu: ev.defaultPrevented };
}

interface Cena {
  doc: Document;
  gravadas: Array<{ texto: string; prioridade: boolean }>;
  encerrou: Encerramento[];
  perguntas: string[];
  falhar: { msg: string | null };
  resposta: { sim: boolean };
  janela: { foco: boolean };
  ativo: { el: Element | null };
  ed: ReturnType<typeof criarEditorAnotacao>;
  campo: HTMLTextAreaElement;
  b: (rotulo: string) => HTMLButtonElement | undefined;
  segurar: { liberar: (() => void) | null; ligado: boolean };
}

function cena(inicial: AnotacaoProcesso | null, extra: Partial<OpcoesEditor> = {}): Cena {
  const doc = instalarDom();
  const gravadas: Cena["gravadas"] = [];
  const encerrou: Encerramento[] = [];
  const perguntas: string[] = [];
  const falhar: Cena["falhar"] = { msg: null };
  const resposta = { sim: true };
  const janela = { foco: false };
  const ativo: Cena["ativo"] = { el: null };
  const segurar: Cena["segurar"] = { liberar: null, ligado: false };
  const ctx = {
    doc,
    topo: doc,
    op: {
      anotar: async (a: { texto: string; prioridade: boolean }): Promise<ResultadoEscrita> => {
        gravadas.push(a);
        if (segurar.ligado) await new Promise<void>((r) => (segurar.liberar = r));
        if (falhar.msg) throw new Error(falhar.msg);
        return ok;
      },
    },
  } as unknown as Parameters<typeof criarEditorAnotacao>[0];
  const ed = criarEditorAnotacao(ctx, {
    inicial,
    aoEncerrar: (r) => encerrou.push(r),
    confirmar: async (t) => (perguntas.push(t), resposta.sim),
    ambiente: { focoEmOutroQuadro: () => janela.foco, ativo: () => ativo.el },
    esperaSaidaMs: 0,
    ...extra,
  });
  doc.body.append(ed.el);
  const campo = ed.el.querySelector("textarea") as HTMLTextAreaElement;
  return { doc, gravadas, encerrou, perguntas, falhar, resposta, janela, ativo, ed, campo, b: (r) => botao(ed.el, r), segurar };
}

function digitar(c: Cena, texto: string): void {
  c.campo.value = texto;
  disparar(c.campo, "input");
}

export async function verificarAnotacao(): Promise<void> {
  secao("anotacao inline: abrir (sem modal, com a pele do post-it)");
  {
    const c = cena(null);
    checar(
      "o editor e o proprio papel do post-it",
      c.ed.el.classList.contains("spro-p-post-it") && c.ed.el.classList.contains("spro-p-post-it-edicao"),
    );
    checar("nao abre modal nenhum", c.doc.querySelector("dialog") === null);
    checar(
      "area de texto com aria-label, limite do SEI (500) e dica",
      c.campo.getAttribute("aria-label") === "Anotação" &&
        c.campo.getAttribute("maxlength") === "500" &&
        !!c.campo.getAttribute("placeholder"),
    );
    checar("campo vazio de uma anotacao nova", c.campo.value === "");
    const rotulos = [
      "Salvar anotação",
      "Prioridade",
      "Transformar as linhas selecionadas em checklist",
      "Subir as linhas selecionadas",
      "Descer as linhas selecionadas",
      "Descartar alterações (Esc)",
    ];
    checar(
      "todos os botoes tem aria-label",
      rotulos.every((r) => !!c.b(r)),
      rotulos.filter((r) => !c.b(r)),
    );
    checar(
      "data com aria-label",
      c.ed.el.querySelector('input[type="date"]')?.getAttribute("aria-label") === "Data para inserir na anotação",
    );
    checar("anotacao nova: sem Remover", !c.b("Remover anotação"));
    checar(
      "barra de ferramentas em bloco proprio (toolbar) e rodape do papel com contador",
      c.ed.el.querySelector('[role="toolbar"]')?.parentElement === c.ed.el &&
        c.ed.el.querySelector(".spro-p-post-it-rodape .spro-p-contador") !== null,
    );
    checar("sem title (so aria-label)", c.ed.el.querySelector("[title]") === null);
    checar("contador inicial", c.ed.el.querySelector(".spro-p-contador")?.textContent === "500 caracteres restantes");
    checar("nao esta sujo", !c.ed.sujo());
    const e = cena({ texto: "Aguardando parecer.\n[ ] Item", prioridade: true });
    checar(
      "anotacao existente: texto e prioridade carregados, com Remover",
      e.campo.value === "Aguardando parecer.\n[ ] Item" && e.ed.prioridade() && !!e.b("Remover anotação"),
    );
    checar(
      "prioridade ligada: aria-pressed e borda vermelha",
      e.b("Prioridade")?.getAttribute("aria-pressed") === "true" && e.ed.el.classList.contains("prioridade"),
    );
  }

  secao("anotacao inline: digitar, contador e limite");
  {
    const c = cena(null);
    digitar(c, "Novo texto");
    checar("o contador acompanha a digitacao", c.ed.el.querySelector(".spro-p-contador")?.textContent === "490 caracteres restantes");
    checar("digitar deixa o editor sujo", c.ed.sujo());
    digitar(c, "x".repeat(500));
    checar("no limite: mensagem do limite", /máximo de caracteres/.test(c.ed.el.querySelector(".spro-p-contador")?.textContent ?? ""));
    digitar(c, "");
    checar("apagar tudo volta ao limpo", !c.ed.sujo());
  }

  secao("anotacao inline: salvar (botao e Ctrl/Cmd+Enter)");
  {
    const c = cena(null);
    digitar(c, "  Novo texto  ");
    c.b("Prioridade")?.click();
    checar("prioridade liga ao clicar", c.b("Prioridade")?.getAttribute("aria-pressed") === "true");
    c.segurar.ligado = true;
    const p = c.b("Salvar anotação")?.click();
    void p;
    await tique(5);
    checar(
      "salvando: campo so de leitura, botoes travados e aviso",
      c.campo.readOnly &&
        c.b("Salvar anotação")?.disabled === true &&
        /Salvando/.test(c.ed.el.textContent ?? "") &&
        c.ed.el.getAttribute("data-estado") === "salvando" &&
        c.ed.el.getAttribute("aria-busy") === "true",
    );
    c.segurar.liberar?.();
    await tique(5);
    checar(
      "grava texto aparado e prioridade pela escrita do nucleo",
      c.gravadas.length === 1 && c.gravadas[0]?.texto === "Novo texto" && c.gravadas[0].prioridade === true,
      c.gravadas,
    );
    checar(
      "encerra com o valor gravado",
      c.encerrou.length === 1 &&
        c.encerrou[0]?.gravou === true &&
        (c.encerrou[0] as { valor: AnotacaoProcesso }).valor.texto === "Novo texto",
      c.encerrou,
    );

    const m = cena(null);
    digitar(m, "pelo atalho");
    const r = tecla(m.campo, "Enter", { ctrlKey: true });
    await tique(5);
    checar("Ctrl+Enter salva e nao insere quebra", r.impediu && m.gravadas[0]?.texto === "pelo atalho");
    const m2 = cena(null);
    digitar(m2, "no mac");
    tecla(m2.campo, "Enter", { metaKey: true });
    await tique(5);
    checar("Cmd+Enter salva", m2.gravadas[0]?.texto === "no mac");

    const sem = cena({ texto: "igual", prioridade: false });
    await sem.ed.salvar();
    checar("salvar sem mudanca nao grava: so fecha", sem.gravadas.length === 0 && sem.encerrou[0]?.gravou === false);
    const nova = cena(null);
    await nova.ed.salvar();
    checar("anotacao nova e vazia: nada a gravar", nova.gravadas.length === 0 && nova.encerrou[0]?.gravou === false);
  }

  secao("anotacao inline: erro de gravacao sem perder o texto digitado");
  {
    const c = cena({ texto: "original", prioridade: false });
    digitar(c, "meu texto novo");
    c.falhar.msg = "O SEI recusou: sessao expirada";
    await c.ed.salvar();
    const aviso = c.ed.el.querySelector('[role="alert"]') as HTMLElement;
    checar(
      "erro: aviso com a mensagem do SEI e 'Tentar de novo'",
      aviso.hidden === false && /sessao expirada/.test(aviso.textContent ?? "") && !!botao(c.ed.el, "Tentar de novo"),
    );
    checar(
      "o texto digitado continua no campo, editavel e o editor segue aberto",
      c.campo.value === "meu texto novo" && !c.campo.readOnly && c.encerrou.length === 0 && c.ed.el.getAttribute("data-estado") === "erro",
    );
    checar("botoes voltam a funcionar", c.b("Salvar anotação")?.disabled === false);
    c.falhar.msg = null;
    botao(c.ed.el, "Tentar de novo")?.click();
    await tique(5);
    checar(
      "tentar de novo grava o MESMO texto e encerra",
      c.gravadas.length === 2 && c.gravadas[1]?.texto === "meu texto novo" && c.encerrou[0]?.gravou === true,
      c.gravadas,
    );
    checar("o aviso de erro some", (c.ed.el.querySelector('[role="alert"]') as HTMLElement).hidden === true);
  }

  secao("anotacao inline: a fatia muda enquanto se edita");
  {
    const c = cena({ texto: "original", prioridade: false });
    digitar(c, "digitando algo importante");
    const noCampo = c.ed.el.querySelector("textarea");
    c.ed.fatiaMudou({ texto: "outra pessoa mudou", prioridade: false });
    checar(
      "mostra o aviso de que mudou no SEI",
      (c.ed.el.querySelector(".desatualizado") as HTMLElement).hidden === false && c.ed.el.hasAttribute("data-desatualizado"),
    );
    checar(
      "NAO mexe no texto digitado nem refaz o campo",
      c.campo.value === "digitando algo importante" && c.ed.el.querySelector("textarea") === noCampo,
    );
    c.ed.fatiaMudou({ texto: "original", prioridade: false });
    checar(
      "voltou a ser igual a origem: aviso some",
      (c.ed.el.querySelector(".desatualizado") as HTMLElement).hidden === true && !c.ed.el.hasAttribute("data-desatualizado"),
    );
    c.ed.fatiaMudou({ texto: "digitando algo importante", prioridade: false });
    checar("igual ao que o usuario ja escreveu: sem aviso", (c.ed.el.querySelector(".desatualizado") as HTMLElement).hidden === true);
    c.ed.fatiaMudou(null);
    checar("removida por outra unidade/pessoa: avisa tambem", (c.ed.el.querySelector(".desatualizado") as HTMLElement).hidden === false);
    botao(c.ed.el, "Usar a versão do SEI")?.click();
    checar(
      "'Usar a versao do SEI' troca o texto pela do SEI (aqui, vazio) e limpa o aviso",
      c.campo.value === "" && (c.ed.el.querySelector(".desatualizado") as HTMLElement).hidden === true,
    );
  }

  secao("anotacao inline: checklist (linhas selecionadas, Enter e reordenar)");
  {
    const c = cena({ texto: "a\nb\nc", prioridade: false });
    c.campo.selectionStart = 2;
    c.campo.selectionEnd = 3;
    c.b("Transformar as linhas selecionadas em checklist")?.click();
    checar("o botao vira a linha selecionada em item", c.campo.value === "a\n[ ] b\nc", c.campo.value);
    c.b("Transformar as linhas selecionadas em checklist")?.click();
    checar("de novo: volta a texto comum", c.campo.value === "a\nb\nc");
    c.campo.selectionStart = 0;
    c.campo.selectionEnd = 5;
    c.b("Transformar as linhas selecionadas em checklist")?.click();
    checar("varias linhas de uma vez", c.campo.value === "[ ] a\n[ ] b\n[ ] c", c.campo.value);

    const e = cena({ texto: "[ ] a", prioridade: false });
    e.campo.selectionStart = 5;
    e.campo.selectionEnd = 5;
    const r = tecla(e.campo, "Enter");
    checar("Enter no fim de um item abre o proximo item", r.impediu && e.campo.value === "[ ] a\n[ ] ", e.campo.value);
    const r2 = tecla(e.campo, "Enter");
    checar("Enter em item vazio sai da lista", r2.impediu && e.campo.value === "[ ] a\n", e.campo.value);
    const comum = cena({ texto: "abc", prioridade: false });
    comum.campo.selectionStart = 3;
    comum.campo.selectionEnd = 3;
    checar("Enter em linha comum fica para o navegador", tecla(comum.campo, "Enter").impediu === false);
    const lotada = cena(null);
    digitar(lotada, `[ ] ${"x".repeat(496)}`);
    lotada.campo.selectionStart = 500;
    lotada.campo.selectionEnd = 500;
    checar("no limite, Enter nao estoura os 500", tecla(lotada.campo, "Enter").impediu === false && lotada.campo.value.length === 500);

    const o = cena({ texto: "um\ndois\ntres", prioridade: false });
    o.campo.selectionStart = 5;
    o.campo.selectionEnd = 5;
    o.b("Subir as linhas selecionadas")?.click();
    checar("subir a linha atual (botao)", o.campo.value === "dois\num\ntres", o.campo.value);
    checar("reordenar deixa o editor sujo", o.ed.sujo());
    checar(
      "o cursor sem selecao continua na mesma coluna da linha que subiu (digitar nao apaga nada)",
      o.campo.selectionStart === o.campo.selectionEnd && o.campo.selectionStart === 2,
      [o.campo.selectionStart, o.campo.selectionEnd],
    );
    const alt = tecla(o.campo, "ArrowDown", { altKey: true });
    checar(
      "Alt+seta para baixo desce a linha (e voltando a ordem original o editor deixa de estar sujo)",
      alt.impediu && o.campo.value === "um\ndois\ntres" && !o.ed.sujo(),
      o.campo.value,
    );
  }

  secao("anotacao inline: data");
  {
    const c = cena({ texto: "Ligar", prioridade: false });
    const d = c.ed.el.querySelector('input[type="date"]') as HTMLInputElement;
    d.value = "2026-11-02";
    disparar(d, "change");
    checar("a data entra no fim do texto", c.campo.value === "Ligar 02/11/2026", c.campo.value);
    d.value = "2026-12-05";
    disparar(d, "change");
    checar("trocar a data troca a que ja esta no texto", c.campo.value === "Ligar 05/12/2026", c.campo.value);
    const com = cena({ texto: "Prazo 01/10/2026", prioridade: false });
    checar(
      "a data do texto ja aparece no campo de data",
      (com.ed.el.querySelector('input[type="date"]') as HTMLInputElement).value === "2026-10-01",
    );
  }

  secao("anotacao inline: Esc e descartar (confirma so se houver mudanca)");
  {
    const c = cena({ texto: "original", prioridade: false });
    const r = tecla(c.campo, "Escape");
    await tique(5);
    checar("Esc sem mudanca descarta direto, sem perguntar", r.impediu && c.perguntas.length === 0 && c.encerrou[0]?.gravou === false);
    const d = cena({ texto: "original", prioridade: false });
    digitar(d, "mudei");
    tecla(d.campo, "Escape");
    await tique(5);
    checar(
      "Esc com mudanca pergunta antes de descartar",
      d.perguntas.length === 1 && /Descartar/.test(d.perguntas[0] ?? "") && d.encerrou[0]?.gravou === false && d.gravadas.length === 0,
    );
    const n = cena({ texto: "original", prioridade: false });
    digitar(n, "mudei");
    n.resposta.sim = false;
    n.b("Descartar alterações (Esc)")?.click();
    await tique(5);
    checar("responder que nao mantem o editor aberto com o texto", n.encerrou.length === 0 && n.campo.value === "mudei");
    n.resposta.sim = true;
    n.b("Descartar alterações (Esc)")?.click();
    await tique(5);
    checar("responder que sim fecha sem gravar", n.encerrou.length === 1 && n.gravadas.length === 0);
    const p = cena({ texto: "original", prioridade: false });
    p.b("Prioridade")?.click();
    p.b("Descartar alterações (Esc)")?.click();
    await tique(5);
    checar("so a prioridade mudou: tambem e mudanca (pergunta)", p.perguntas.length === 1);
  }

  secao("anotacao inline: sair do foco grava (como o legado), so com gesto do usuario");
  {
    const Ev = (d: Document) => (d.defaultView as unknown as { Event: typeof Event }).Event;
    const clicarFora = (c: Cena) => c.doc.body.dispatchEvent(new (Ev(c.doc))("pointerdown", { bubbles: true }));
    const c = cena({ texto: "original", prioridade: false });
    digitar(c, "mudei e cliquei fora");
    clicarFora(c);
    c.ed.saiuDoFoco();
    await tique(10);
    checar("clicar fora com mudanca grava", c.gravadas[0]?.texto === "mudei e cliquei fora" && c.encerrou[0]?.gravou === true, c.gravadas);
    checar("... e solta os ouvintes do documento (nada grava de novo)", c.encerrou.length === 1);

    const tab = cena({ texto: "original", prioridade: false });
    digitar(tab, "mudei e dei Tab");
    tecla(tab.campo, "Tab");
    tab.ed.saiuDoFoco();
    await tique(10);
    checar("sair com Tab tambem e gesto", tab.gravadas[0]?.texto === "mudei e dei Tab");

    const sem = cena({ texto: "original", prioridade: false });
    digitar(sem, "mudei");
    sem.ed.saiuDoFoco();
    await tique(10);
    checar(
      "foco que some SEM gesto (dialogo, captura de tela, script da pagina) nao grava nem fecha",
      sem.gravadas.length === 0 && sem.encerrou.length === 0,
    );

    const b = cena({ texto: "original", prioridade: false });
    digitar(b, "mudei");
    clicarFora(b);
    b.ativo.el = b.b("Prioridade") ?? null;
    b.ed.saiuDoFoco();
    await tique(10);
    checar("foco indo para um botao DO editor nao grava", b.gravadas.length === 0 && b.encerrou.length === 0);

    const q = cena({ texto: "original", prioridade: false });
    digitar(q, "mudei e fui para o visualizador");
    q.janela.foco = true;
    q.doc.defaultView?.dispatchEvent(new (Ev(q.doc))("blur"));
    await tique(10);
    checar(
      "o foco foi para OUTRO quadro do SEI (o topo continua com foco): grava",
      q.gravadas[0]?.texto === "mudei e fui para o visualizador",
      q.gravadas,
    );

    const q2 = cena({ texto: "original", prioridade: false });
    digitar(q2, "mudei");
    q2.janela.foco = false;
    q2.doc.defaultView?.dispatchEvent(new (Ev(q2.doc))("blur"));
    await tique(10);
    checar(
      "o foco nao foi para outro quadro (trocou de aba, captura de tela): nao grava",
      q2.gravadas.length === 0 && q2.encerrou.length === 0,
    );

    const s = cena({ texto: "original", prioridade: false });
    clicarFora(s);
    s.ed.saiuDoFoco();
    await tique(10);
    checar("sair sem ter mudado nada fecha o editor, sem gravar", s.gravadas.length === 0 && s.encerrou[0]?.gravou === false);

    const v = cena({ texto: "original", prioridade: false });
    digitar(v, "");
    clicarFora(v);
    v.ed.saiuDoFoco();
    await tique(10);
    checar("texto apagado nao some sozinho ao sair: continua aberto", v.gravadas.length === 0 && v.encerrou.length === 0);

    const t = cena({ texto: "original", prioridade: false });
    digitar(t, "mudei");
    clicarFora(t);
    t.ed.el.dispatchEvent(new (Ev(t.doc))("pointerdown", { bubbles: true }));
    t.ed.saiuDoFoco();
    await tique(10);
    checar("clique em curso dentro do editor (Safari/Firefox nao focam o botao) nao grava", t.gravadas.length === 0);
  }

  secao("anotacao inline: remover");
  {
    const c = cena({ texto: "original", prioridade: true });
    c.b("Remover anotação")?.click();
    await tique(5);
    checar(
      "pede confirmacao e grava texto vazio sem prioridade",
      c.perguntas.length === 1 && c.gravadas[0]?.texto === "" && c.gravadas[0].prioridade === false,
    );
    checar("encerra com valor nulo", c.encerrou[0]?.gravou === true && (c.encerrou[0] as { valor: unknown }).valor === null);
    const n = cena({ texto: "original", prioridade: true });
    n.resposta.sim = false;
    n.b("Remover anotação")?.click();
    await tique(5);
    checar("recusar a confirmacao nao grava", n.gravadas.length === 0 && n.encerrou.length === 0);
    const v = cena({ texto: "original", prioridade: false });
    digitar(v, "   ");
    await v.ed.salvar();
    checar(
      "salvar com tudo apagado e o mesmo que remover: pergunta antes",
      v.perguntas.length === 1 && v.gravadas[0]?.texto === "" && v.encerrou[0]?.gravou === true,
    );
  }
}
