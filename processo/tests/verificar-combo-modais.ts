/**
 * Seletores com busca nos modais (atribuição, marcador, acompanhamento, tipo, nível): o `criarCombo` do SEI Pro no lugar
 * do `<select>`/lista nativa. Operações falsas; a gravação em si é provada no núcleo.
 */
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import type { LinhaAtribuicao, MarcadorDoPainel, OpcaoLista } from "@nucleo/dominio/painelProcesso";
import type { AlteracaoProcesso } from "@nucleo/dominio/processo";
import type { ContextoProcesso } from "../src/pagina/contexto";
import { abrirModalAcompanhamento } from "../src/pagina/modais/acompanhamento";
import { abrirModalAtribuicao } from "../src/pagina/modais/atribuicao";
import { abrirModalMarcador } from "../src/pagina/modais/marcador";
import { opcoesDeMarcadores, opcoesDeUsuarios, separarUsuario } from "../src/pagina/modais/opcoes";
import { abrirModalNivel, abrirModalTipo } from "../src/pagina/modais/processo";
import { COR_SEM_MARCADOR, CORES_DE_MARCADOR, corDoMarcador, luminancia, nomeDaCorDoMarcador, tagMarcador } from "../src/ui/tagMarcador";
import { fingirDialogos } from "./dialogo";
import { checar, disparar, instalarDom, secao, tique } from "./util";

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
function tecla(el: Element, key: string): void {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  el.dispatchEvent(ev);
}

const USUARIOS: OpcaoLista[] = [
  { valor: "12", texto: "ana.silva - Ana Paula da Silva" },
  { valor: "13", texto: "joao.pereira - João Carlos Pereira" },
  { valor: "14", texto: "jose.ribeiro - José Antônio Ribeiro" },
  { valor: "15", texto: "maria.souza - Maria de Souza - Gabinete" },
  { valor: "16", texto: "robo" },
];

const MARCADORES: OpcaoLista[] = [
  { valor: "5963", texto: "Capacitação", icone: "svg/marcador_rosa.svg?18" },
  { valor: "5510", texto: "Enviado para auditoria", icone: "svg/marcador_vermelho.svg?18" },
  { valor: "6", texto: "Marcador Teste 1", icone: "svg/marcador_amarelo.svg?18" },
  { valor: "7", texto: "Sem cor conhecida" },
  { valor: "8", texto: "Preto", icone: "svg/marcador_preto.svg?18" },
];

export async function verificarComboModais(): Promise<void> {
  secao("cores do marcador: nome do arquivo do SEI para hex, claro e escuro");
  {
    checar("o nome vem do caminho do icone", nomeDaCorDoMarcador("svg/marcador_azul_marinho.svg?18") === "azul_marinho");
    checar(
      "sem icone ou com icone de outra coisa: sem nome",
      nomeDaCorDoMarcador(undefined) === null && nomeDaCorDoMarcador("svg/arvore.svg") === null,
    );
    checar("32 cores do SEI mapeadas", Object.keys(CORES_DE_MARCADOR).length === 32, Object.keys(CORES_DE_MARCADOR).length);
    const c = corDoMarcador("svg/marcador_rosa.svg?18");
    checar("rosa: o hex do SEI", c.claro === "#ff1cae" && c.nome === "rosa", c);
    checar(
      "cor escura ganha versao clara no tema escuro, com luminancia para contrastar com o fundo",
      luminancia(corDoMarcador("svg/marcador_azul_marinho.svg").escuro) >= 0.17 &&
        luminancia(corDoMarcador("svg/marcador_verde_escuro.svg").escuro) >= 0.17 &&
        luminancia(corDoMarcador("svg/marcador_vinho.svg").escuro) >= 0.17,
    );
    checar("cor clara fica igual no escuro", corDoMarcador("svg/marcador_amarelo.svg").escuro === "#fff200");
    checar(
      "preto vira claro no escuro",
      corDoMarcador("svg/marcador_preto.svg").claro === "#000000" && corDoMarcador("svg/marcador_preto.svg").escuro === "#d5d9de",
    );
    checar(
      "desconhecida ou sem icone: cinza nos dois temas",
      corDoMarcador("svg/marcador_xyz.svg").claro === COR_SEM_MARCADOR && corDoMarcador(undefined).escuro === COR_SEM_MARCADOR,
    );
    const doc = instalarDom("<html><body></body></html>");
    const t = tagMarcador("svg/marcador_azul.svg?18", 16, doc);
    checar(
      "a tag e um SVG proprio, sem img, escondida da leitura de tela, com as duas cores em variaveis",
      t.tagName.toLowerCase() === "svg" &&
        t.getAttribute("aria-hidden") === "true" &&
        (t.getAttribute("style") ?? "").includes("--spro-tag:#4285f4") &&
        (t.getAttribute("style") ?? "").includes("--spro-tag-escuro:") &&
        t.querySelector("path")?.getAttribute("fill-rule") === "evenodd",
    );
  }

  secao("opcoes dos modais: usuario, marcador");
  {
    const { login, nome } = separarUsuario("maria.souza - Maria de Souza - Gabinete");
    checar(
      "usuario: login forte e o resto e o nome (mesmo com ' - ' no nome)",
      login === "maria.souza" && nome === "Maria de Souza - Gabinete",
    );
    checar("usuario sem nome: so o login", separarUsuario("robo").nome === "" && opcoesDeUsuarios(USUARIOS)[4]?.complemento === undefined);
    const doc = instalarDom("<html><body></body></html>");
    const m = opcoesDeMarcadores(MARCADORES, doc);
    checar(
      "cada marcador tem marca (fabrica) e rotulo",
      m.length === 5 && typeof m[0]?.marca === "function" && m[0]?.rotulo === "Capacitação",
    );
    const m1 = m[0]?.marca?.();
    const m2 = m[0]?.marca?.();
    checar("marca nova a cada chamada", !!m1 && !!m2 && m1 !== m2);
  }

  const doc = instalarDom("<html><head></head><body></body></html>");
  const restaurar = fingirDialogos(doc);
  const dlg = () => doc.querySelector<HTMLDialogElement>("dialog.spro-dialogo[open]");
  const pop = () => doc.querySelector(".spro-combo-pop");
  const botoes = () => [...(dlg()?.querySelectorAll("button") ?? [])] as HTMLButtonElement[];
  const botao = (rotulo: string) =>
    botoes().find((b) => (b.textContent ?? "").trim() === rotulo || b.getAttribute("aria-label") === rotulo);
  const combo = (rotulo: string) => dlg()?.querySelector<HTMLButtonElement>(`button[role="combobox"][aria-label="${rotulo}"]`) ?? null;
  const opcoes = () => [...(pop()?.querySelectorAll('[role="option"]') ?? [])];
  const digitar = (valor: string) => {
    const campo = pop()?.querySelector("input.spro-combo-busca") as HTMLInputElement;
    campo.value = valor;
    disparar(campo, "input");
  };
  const fechar = () => dlg()?.close();

  const atribuicoes: Array<string | null> = [];
  const marcacoes: Array<{ marcador: string; texto?: string }> = [];
  const desmarcacoes: string[] = [];
  const acompanhamentos: Array<{ grupo?: string; observacao?: string }> = [];
  const alteracoes: AlteracaoProcesso[] = [];
  let falharOpcoes = 0;
  let segurar: Promise<void> | null = null;
  let pedidosHipotese = 0;
  let atualAtribuicao: string | undefined;
  let mensagens = 0;
  const escrita = (resumo: string): ResultadoEscrita => ({ alvo: "x", mudancas: [], aplicado: true, resumo });
  const ctx = {
    topo: doc,
    doc,
    agora: () => new Date(2026, 9, 24, 10, 0),
    reaberturaProgramada: false,
    op: {
      opcoesAtribuicao: async () => {
        if (segurar) await segurar;
        if (falharOpcoes > 0) {
          falharOpcoes -= 1;
          throw new Error("Sua sessao do SEI expirou.");
        }
        return { opcoes: USUARIOS, ...(atualAtribuicao ? { atual: atualAtribuicao } : {}) };
      },
      atribuir: async (u: string | null) => {
        atribuicoes.push(u);
        return escrita("Atribuído.");
      },
      opcoesMarcador: async () => MARCADORES,
      marcar: async (m: { marcador: string; texto?: string }) => {
        marcacoes.push(m);
        return escrita("Marcado.");
      },
      desmarcar: async (n: string) => {
        desmarcacoes.push(n);
        return escrita("Desmarcado.");
      },
      opcoesAcompanhamento: async () => ({
        grupos: [
          { valor: "g1", texto: "Gabinete" },
          { valor: "g2", texto: "Licitações" },
        ],
        atual: "g2",
      }),
      acompanhar: async (a: { grupo?: string; observacao?: string }) => {
        acompanhamentos.push(a);
        return escrita("Acompanhando.");
      },
      formularioDoProcesso: async () => ({
        tipos: Array.from({ length: 220 }, (_, i) => ({ valor: `t${i}`, texto: `Tipo ${String(i).padStart(3, "0")} de processo` })),
        tipoAtual: "t5",
        nivel: "0",
        hipoteseAtual: "h2",
        interessados: [],
        assuntos: [],
        interessadosNegados: new Map(),
        assuntosNegados: new Map(),
        hipoteses: async () => {
          pedidosHipotese += 1;
          return [
            { valor: "h1", texto: "Informação Pessoal (Art. 31 da Lei 12.527)" },
            { valor: "h2", texto: "Controle Interno" },
          ];
        },
      }),
      alterarProcesso: async (a: AlteracaoProcesso) => {
        alteracoes.push(a);
        return escrita("Processo alterado.");
      },
    },
    recarregar: () => {
      mensagens += 1;
    },
  } as unknown as ContextoProcesso;

  secao("modal de atribuicao: seletor com busca por login e nome");
  {
    const linha: LinhaAtribuicao = { usuario: "joao.pereira" } as LinhaAtribuicao;
    let gravada: unknown = null;
    let soltar!: () => void;
    segurar = new Promise<void>((r) => (soltar = r));
    abrirModalAtribuicao(ctx, linha, (a) => (gravada = a));
    const c = combo("Usuário da unidade");
    checar(
      "o seletor aparece na hora, ocupado, com 'Carregando…' e sem lista nativa",
      !!c && c.getAttribute("aria-busy") === "true" && /Carregando/.test(c.textContent ?? "") && !dlg()?.querySelector("select"),
    );
    c?.click();
    await tique(0);
    checar(
      "aberto na carga: esqueleto, nenhuma opcao",
      (pop()?.querySelectorAll(".spro-combo-esqueleto").length ?? 0) >= 3 && opcoes().length === 0,
    );
    soltar();
    segurar = null;
    await tique(15);
    checar(
      "a carga termina: esqueleto some e as opcoes aparecem",
      opcoes().length === 5 && !pop()?.querySelector(".spro-combo-esqueleto"),
      opcoes().length,
    );
    checar(
      "o usuario atual da linha vem marcado (aria-selected) e no botao",
      pop()?.querySelector('[data-valor="13"]')?.getAttribute("aria-selected") === "true" &&
        c?.querySelector(".spro-combo-rotulo")?.textContent === "joao.pereira",
    );
    checar(
      "login forte e nome suave em cada opcao",
      pop()?.querySelector('[data-valor="12"] .spro-combo-op-rotulo')?.textContent === "ana.silva" &&
        pop()?.querySelector('[data-valor="12"] .spro-combo-op-compl')?.textContent === "Ana Paula da Silva",
    );
    checar("contagem sob a lista", /5 usuários na unidade/.test(pop()?.textContent ?? ""));
    checar(
      "ARIA: combobox, listbox, options e aria-expanded",
      c?.getAttribute("role") === "combobox" &&
        c?.getAttribute("aria-expanded") === "true" &&
        pop()?.querySelector('[role="listbox"]') !== null &&
        opcoes().every((o) => o.getAttribute("role") === "option"),
    );
    digitar("ribeiro");
    await tique();
    checar(
      "digitar parte do NOME filtra",
      opcoes()
        .map((o) => o.getAttribute("data-valor"))
        .join() === "14",
      opcoes().length,
    );
    digitar("JOSE");
    await tique();
    checar("sem acento nem caixa: 'JOSE' acha 'José' e 'jose.ribeiro'", opcoes().length === 1);
    digitar("joao");
    await tique();
    checar(
      "digitar parte do LOGIN filtra",
      opcoes()
        .map((o) => o.getAttribute("data-valor"))
        .join() === "13",
    );
    digitar("zzzz");
    await tique();
    checar("sem resultado: 'Nada encontrado.'", /Nada encontrado/.test(pop()?.textContent ?? "") && opcoes().length === 0);
    digitar("souza");
    await tique();
    checar(
      "o nome com ' - ' dentro aparece inteiro",
      pop()?.querySelector('[data-valor="15"] .spro-combo-op-compl')?.textContent === "Maria de Souza - Gabinete",
    );
    const busca = pop()?.querySelector("input.spro-combo-busca") as HTMLInputElement;
    tecla(busca, "Enter");
    await tique();
    checar(
      "Enter escolhe e fecha; o botao mostra o escolhido",
      !pop() && c?.querySelector(".spro-combo-rotulo")?.textContent === "maria.souza",
    );
    c?.click();
    await tique();
    tecla(pop()?.querySelector("input.spro-combo-busca") as Element, "Escape");
    await tique();
    checar("Esc fecha o seletor sem fechar o modal", !pop() && dlg() !== null);
    botao("Salvar")?.click();
    await tique(20);
    checar("Salvar atribui o login escolhido (valor da opcao)", atribuicoes.join() === "15", atribuicoes);
    checar(
      "o aviso de volta traz login e nome",
      JSON.stringify(gravada) === JSON.stringify({ usuario: "maria.souza", nome: "Maria de Souza - Gabinete" }),
      gravada,
    );
    checar("o modal fechou", dlg() === null);
  }

  secao("modal de atribuicao: remover, valor inicial do SEI, sem Cancelar e erro com 'Tentar de novo'");
  {
    atribuicoes.length = 0;
    let gravada: unknown = null;
    atualAtribuicao = "12";
    abrirModalAtribuicao(ctx, { usuario: "ana.silva" } as LinhaAtribuicao, (a) => (gravada = a));
    await tique(15);
    checar(
      "a atribuicao que o SEI marcou vem como valor inicial",
      combo("Usuário da unidade")?.querySelector(".spro-combo-rotulo")?.textContent === "ana.silva",
    );
    checar("sem botao Cancelar; ha Remover atribuicao e Salvar", !botao("Cancelar") && !!botao("Remover atribuição") && !!botao("Salvar"));
    checar(
      "nenhum title no modal",
      dlg()?.querySelector("[title]") === null || [...(dlg()?.querySelectorAll("[title]") ?? [])].every((e) => e.matches(".spro-combo")),
    );
    botao("Remover atribuição")?.click();
    await tique(20);
    checar(
      "Remover atribuicao grava null e avisa",
      atribuicoes.join() === "" &&
        atribuicoes.length === 1 &&
        atribuicoes[0] === null &&
        JSON.stringify(gravada) === JSON.stringify({ usuario: null }),
      atribuicoes,
    );
    atualAtribuicao = undefined;

    abrirModalAtribuicao(ctx, { usuario: null } as unknown as LinhaAtribuicao, () => {});
    await tique(15);
    checar("sem atribuicao: sem botao Remover", !botao("Remover atribuição"));
    botao("Salvar")?.click();
    await tique(10);
    checar(
      "Salvar sem escolher: mensagem, nada gravado",
      /Escolha um usuário/.test(dlg()?.querySelector(".spro-p-erro")?.textContent ?? "") && atribuicoes.length === 1,
    );
    fechar();

    falharOpcoes = 1;
    abrirModalAtribuicao(ctx, { usuario: null } as unknown as LinhaAtribuicao, () => {});
    await tique(15);
    const c = combo("Usuário da unidade");
    checar(
      "falha na carga: o botao avisa e fica marcado",
      /Não foi possível carregar/.test(c?.textContent ?? "") && c?.classList.contains("spro-combo-erro") === true,
    );
    c?.click();
    await tique();
    checar(
      "a lista mostra a mensagem e 'Tentar de novo'",
      /sessao do SEI expirou/.test(pop()?.querySelector('[role="alert"]')?.textContent ?? "") &&
        !!pop()?.querySelector(".spro-combo-de-novo"),
    );
    pop()!.querySelector<HTMLElement>(".spro-combo-de-novo")!.click();
    await tique(15);
    checar(
      "Tentar de novo recarrega e mostra as opcoes",
      opcoes().length === 5 && !pop()?.querySelector('[role="alert"]') && /Escolher um usuário/.test(c?.textContent ?? ""),
    );
    fechar();
  }

  secao("modal de marcador: etiqueta na cor, valor inicial, prazo e texto como estavam");
  {
    abrirModalMarcador(ctx);
    const c = combo("Marcador");
    checar("seletor de marcador, sem select nativo", !!c && !dlg()?.querySelector("select"));
    await tique(15);
    c?.click();
    await tique();
    checar(
      "cada opcao com a tag SVG na cor do marcador",
      opcoes().length === 5 && opcoes().every((o) => o.querySelector("svg.spro-tag") !== null),
    );
    const cor = (v: string) => pop()?.querySelector(`[data-valor="${v}"] svg.spro-tag`)?.getAttribute("style") ?? "";
    checar(
      "rosa, vermelho e amarelo como os do SEI",
      cor("5963").includes("--spro-tag:#ff1cae") && cor("5510").includes("--spro-tag:#ff4545") && cor("6").includes("--spro-tag:#fff200"),
      [cor("5963"), cor("5510"), cor("6")],
    );
    checar("sem icone: cinza", cor("7").includes(`--spro-tag:${COR_SEM_MARCADOR}`));
    checar("preto: claro preto e escuro claro", cor("8").includes("--spro-tag:#000000") && cor("8").includes("--spro-tag-escuro:#d5d9de"));
    digitar("audit");
    await tique();
    checar(
      "busca pelo nome",
      opcoes()
        .map((o) => o.getAttribute("data-valor"))
        .join() === "5510",
    );
    tecla(pop()?.querySelector("input.spro-combo-busca") as Element, "Enter");
    await tique();
    checar(
      "o valor selecionado mostra a tag na cor",
      c?.querySelector("svg.spro-tag")?.getAttribute("style")?.includes("#ff4545") === true &&
        c?.querySelector(".spro-combo-rotulo")?.textContent === "Enviado para auditoria",
    );
    checar(
      "prazo desligado, texto vazio",
      dlg()?.querySelector<HTMLTextAreaElement>("textarea")?.value === "" &&
        dlg()?.querySelector<HTMLElement>(".spro-p-grade")?.hasAttribute("hidden") === true,
    );
    const area = dlg()?.querySelector("textarea") as HTMLTextAreaElement;
    area.value = "ver com a chefia";
    botao("Salvar")?.click();
    await tique(20);
    checar(
      "Salvar grava o NOME do marcador e o texto",
      marcacoes.length === 1 && marcacoes[0]?.marcador === "Enviado para auditoria" && marcacoes[0]?.texto === "ver com a chefia",
      marcacoes,
    );
    checar("o painel e refeito", mensagens >= 1);

    // sem escolha
    marcacoes.length = 0;
    abrirModalMarcador(ctx);
    await tique(15);
    botao("Salvar")?.click();
    await tique(10);
    checar(
      "sem marcador escolhido: mensagem, nada gravado",
      /Escolha um marcador/.test(dlg()?.querySelector(".spro-p-erro")?.textContent ?? "") && marcacoes.length === 0,
    );
    fechar();

    // edicao: valor inicial e troca
    const item: MarcadorDoPainel = {
      id: "1",
      nome: "Marcador Teste 1",
      texto: "Ate 25/10/2026 18:00\nlembrar",
      icone: "svg/marcador_amarelo.svg?18",
      usuario: "x",
      data: "x",
    };
    abrirModalMarcador(ctx, item);
    await tique(15);
    checar(
      "editar: o marcador atual ja vem escolhido, com a tag",
      combo("Marcador")?.querySelector(".spro-combo-rotulo")?.textContent === "Marcador Teste 1" &&
        combo("Marcador")?.querySelector("svg.spro-tag") !== null,
    );
    checar(
      "editar: nota com a tag do atual",
      /Atual: Marcador Teste 1/.test(dlg()?.textContent ?? "") && dlg()?.querySelector(".spro-p-nota svg.spro-tag") !== null,
    );
    checar(
      "editar: prazo ligado com a data e a hora, e o texto",
      dlg()?.querySelector<HTMLElement>(".spro-p-grade")?.hasAttribute("hidden") === false &&
        dlg()?.querySelector<HTMLInputElement>('input[type="date"]')?.value === "2026-10-25" &&
        dlg()?.querySelector<HTMLInputElement>('input[type="time"]')?.value === "18:00" &&
        dlg()?.querySelector<HTMLTextAreaElement>("textarea")?.value === "lembrar",
    );
    combo("Marcador")?.click();
    await tique();
    pop()!.querySelector<HTMLElement>('[data-valor="5963"]')!.click();
    await tique();
    botao("Salvar")?.click();
    await tique(20);
    checar(
      "trocar o marcador de um item tira o antigo e poe o novo",
      desmarcacoes.join() === "Marcador Teste 1" && marcacoes[0]?.marcador === "Capacitação",
      [desmarcacoes, marcacoes],
    );
  }

  secao("modal de acompanhamento: grupo no seletor, '(sem grupo)' e o grupo atual");
  {
    abrirModalAcompanhamento(ctx, null, "obs padrao");
    await tique(15);
    const c = combo("Grupo");
    checar("seletor de grupo, sem select nativo", !!c && !dlg()?.querySelector("select"));
    checar("o grupo atual do SEI vem escolhido", c?.querySelector(".spro-combo-rotulo")?.textContent === "Licitações");
    c?.click();
    await tique();
    checar(
      "tem '(sem grupo)' primeiro e os grupos",
      opcoes()
        .map((o) => o.getAttribute("data-valor"))
        .join() === ",g1,g2",
    );
    pop()!.querySelector<HTMLElement>('[data-valor=""]')!.click();
    await tique();
    checar("(sem grupo) escolhido aparece no botao", c?.querySelector(".spro-combo-rotulo")?.textContent === "(sem grupo)");
    botao("Salvar")?.click();
    await tique(20);
    checar(
      "Salvar manda grupo vazio e a observacao",
      acompanhamentos.length === 1 && acompanhamentos[0]?.grupo === "" && /obs padrao/.test(acompanhamentos[0]?.observacao ?? ""),
      acompanhamentos,
    );
  }

  secao("modal de tipo: lista longa limitada com busca");
  {
    abrirModalTipo(ctx, "Tipo 005 de processo");
    await tique(15);
    const c = combo("Tipo de processo");
    checar("o tipo atual vem escolhido", c?.querySelector(".spro-combo-rotulo")?.textContent === "Tipo 005 de processo");
    c?.click();
    await tique();
    checar(
      "220 tipos: desenha 150 e avisa",
      opcoes().length === 150 && /Mostrando 150 de 220/.test(pop()?.textContent ?? ""),
      opcoes().length,
    );
    digitar("219");
    await tique();
    checar("filtrar traz os que estavam alem do limite", opcoes().length === 1 && /1 de 220 tipos/.test(pop()?.textContent ?? ""));
    tecla(pop()?.querySelector("input.spro-combo-busca") as Element, "Enter");
    await tique();
    botao("Salvar")?.click();
    await tique(20);
    checar(
      "Salvar grava o valor do tipo escolhido",
      alteracoes.length === 1 && (alteracoes[0] as { tipo?: string }).tipo === "t219",
      alteracoes,
    );
  }

  secao("modal de nivel de acesso: hipotese legal so e pedida no restrito");
  pedidosHipotese = 0;
  alteracoes.length = 0;
  abrirModalNivel(ctx);
  await tique(20);
  checar(
    "publico: nenhuma hipotese pedida ao SEI e a zona escondida",
    pedidosHipotese === 0 && dlg()?.querySelector<HTMLElement>("[hidden]") !== null,
  );
  botao("Restrito")?.click();
  await tique(20);
  checar(
    "restrito: pede as hipoteses uma vez e mostra a atual",
    pedidosHipotese === 1 && combo("Hipótese legal")?.querySelector(".spro-combo-rotulo")?.textContent === "Controle Interno",
  );
  botao("Público")?.click();
  botao("Restrito")?.click();
  await tique(20);
  checar("alternar de novo nao repete o pedido", pedidosHipotese === 1);
  combo("Hipótese legal")?.click();
  await tique();
  checar("duas hipoteses na lista", opcoes().length === 2);
  pop()!.querySelector<HTMLElement>('[data-valor="h1"]')!.click();
  await tique();
  botao("Salvar")?.click();
  await tique(20);
  checar(
    "Salvar grava restrito com a hipotese escolhida",
    JSON.stringify(alteracoes[0]) === JSON.stringify({ nivel: "restrito", hipotese: "h1" }),
    alteracoes,
  );
  restaurar();
}
