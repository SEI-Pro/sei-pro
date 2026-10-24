/**
 * Edição de assuntos e interessados: a lista editável, a busca incremental e o modal (com o formulário do processo e a
 * pesquisa falsos; a serialização da lupa em si é provada no núcleo, `verificar-lupas-processo.ts`).
 */
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import type { AlteracaoProcesso } from "@nucleo/dominio/processo";
import type { ItemLupa } from "@nucleo/formulario/formulario";
import { ListaEditavel } from "../src/modelo/lista";
import { type EstadoDaBusca, Pesquisador } from "../src/modelo/pesquisador";
import type { ContextoProcesso } from "../src/pagina/contexto";
import { abrirModalAssuntos, abrirModalInteressados } from "../src/pagina/modais/processo";
import { fingirDialogos } from "./dialogo";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const item = (id: string, texto: string): ItemLupa => ({ id, texto });

export async function verificarLupa(): Promise<void> {
  secao("lista editavel: atuais, novos, retirados e negados");
  {
    const l = new ListaEditavel([item("1", "A"), item("2", "B"), item("3", "C")], new Map([["2", "GAB"]]));
    checar(
      "sem mudanca: resultado igual e mudou() falso",
      l
        .resultado()
        .map((i) => i.id)
        .join() === "1,2,3" && !l.mudou(),
    );
    checar(
      "retirar um atual",
      l.alternarRetirada("1") &&
        l
          .resultado()
          .map((i) => i.id)
          .join() === "2,3" &&
        l.mudou(),
    );
    checar(
      "negado (outra unidade) nao sai",
      !l.alternarRetirada("2") && l.resultado().some((i) => i.id === "2") && l.linhas().find((x) => x.item.id === "2")?.negadoPor === "GAB",
    );
    checar(
      "devolver o retirado volta no mesmo lugar",
      l.alternarRetirada("1") &&
        l
          .resultado()
          .map((i) => i.id)
          .join() === "1,2,3" &&
        !l.mudou(),
    );
    checar(
      "adicionar novo vai para o fim",
      l.adicionar(item("9", "Novo")) &&
        l
          .resultado()
          .map((i) => i.id)
          .join() === "1,2,3,9" &&
        l.mudou(),
    );
    checar("adicionar repetido (atual ou novo) e recusado", !l.adicionar(item("9", "Novo")) && !l.adicionar(item("1", "A")));
    checar("tem(): atual, novo e retirado", l.tem("1") && l.tem("9") && (l.alternarRetirada("3"), !l.tem("3")));
    checar(
      "readicionar um retirado o devolve, sem duplicar",
      l.adicionar(item("3", "C")) && l.resultado().filter((i) => i.id === "3").length === 1,
    );
    checar("desfazer um novo", l.removerNovo("9") && !l.tem("9") && !l.mudou());
    checar("ids desconhecidos nao fazem nada", !l.alternarRetirada("77") && !l.removerNovo("77"));
    const c = new ListaEditavel([item("1", "A")]);
    c.alternarRetirada("1");
    c.adicionar(item("2", "B"));
    checar("contagem", JSON.stringify(c.contagem()) === JSON.stringify({ atuais: 0, retirados: 1, novos: 1 }));
  }

  secao("pesquisador: espera, minimo, cancelamento e erro");
  {
    const estados: EstadoDaBusca[] = [];
    const chamadas: Array<{ termo: string; sinal: AbortSignal }> = [];
    let resposta: (() => Promise<ItemLupa[]>) | null = null;
    const p = new Pesquisador({
      pesquisar: (termo, sinal) => {
        chamadas.push({ termo, sinal });
        return resposta ? resposta() : Promise.resolve([item("1", termo)]);
      },
      aoMudar: (e) => estados.push(e),
      esperaMs: 5,
    });
    p.digitou("");
    p.digitou("ab");
    checar(
      "vazio e curto",
      estados[0]?.tipo === "ocioso" && estados[1]?.tipo === "curto" && (estados[1] as { falta: number }).falta === 1,
      estados,
    );
    estados.length = 0;
    p.digitou("abc");
    p.digitou("abcd");
    p.digitou("abcde");
    await tique(40);
    checar(
      "varias teclas seguidas: uma pesquisa so, com o ultimo texto",
      chamadas.length === 1 && chamadas[0]?.termo === "abcde",
      chamadas.map((c) => c.termo),
    );
    checar(
      "estados: pesquisando e resultado",
      estados.map((e) => e.tipo).join() === "pesquisando,resultado",
      estados.map((e) => e.tipo),
    );
    estados.length = 0;
    chamadas.length = 0;
    p.agora("  tecnologia   da informacao ");
    await tique(10);
    checar("Enter pesquisa na hora, com espacos normalizados", chamadas[0]?.termo === "tecnologia da informacao");
    // resposta velha descartada
    chamadas.length = 0;
    estados.length = 0;
    let soltar!: (v: ItemLupa[]) => void;
    resposta = () => new Promise<ItemLupa[]>((r) => (soltar = r));
    p.agora("primeira");
    await tique(5);
    const velha = soltar;
    const sinalVelho = chamadas[0]?.sinal;
    resposta = () => Promise.resolve([item("2", "segunda")]);
    p.agora("segunda");
    await tique(10);
    velha([item("1", "primeira")]);
    await tique(10);
    const ultimo = estados[estados.length - 1];
    checar(
      "a pesquisa anterior e cancelada (sinal) e a resposta atrasada nao sobrescreve",
      sinalVelho?.aborted === true && ultimo?.tipo === "resultado" && (ultimo as { termo: string }).termo === "segunda",
      estados.map((e) => e.tipo + ":" + ("termo" in e ? e.termo : "")),
    );
    resposta = () => Promise.resolve([]);
    estados.length = 0;
    p.agora("nada");
    await tique(10);
    checar("sem resultado: vazio", estados[estados.length - 1]?.tipo === "vazio");
    resposta = () => Promise.reject(new Error("Sem conexao"));
    estados.length = 0;
    p.agora("falha");
    await tique(10);
    checar(
      "falha: erro com a mensagem",
      estados[estados.length - 1]?.tipo === "erro" && (estados[estados.length - 1] as { mensagem: string }).mensagem === "Sem conexao",
    );
    resposta = () => Promise.resolve([item("1", "ok")]);
    estados.length = 0;
    p.repetir("falha");
    await tique(10);
    checar("repetir tenta de novo", estados[estados.length - 1]?.tipo === "resultado");
    estados.length = 0;
    p.digitou("abcdef");
    p.parar();
    await tique(30);
    checar("parar cancela a espera pendente", estados.length === 0);
  }

  secao("modal de assuntos e de interessados (formulario e pesquisa falsos)");
  const doc = instalarDom("<html><head></head><body></body></html>");
  const restaurar = fingirDialogos(doc);
  const pesquisas: Array<{ qual: string; termo: string }> = [];
  const gravacoes: AlteracaoProcesso[] = [];
  let recarregou = 0;
  let falharNaCarga = false;
  let falharNaGravacao: string | null = null;
  const form = (negadosAssuntos: Array<[string, string]> = []) => ({
    tipos: [],
    nivel: "0",
    interessados: [item("100", "CGE-CAUD"), item("101", "Cliente 1")],
    assuntos: [item("1287", "004.01.05.002 - Informatica"), item("55", "020 - Outro")],
    interessadosNegados: new Map<string, string>(),
    assuntosNegados: new Map<string, string>(negadosAssuntos),
    pesquisarAssuntos: async (termo: string) => {
      pesquisas.push({ qual: "assuntos", termo });
      return termo === "nada" ? [] : [item("55", "020 - Outro"), item("777", `123.4 - ${termo}`)];
    },
    pesquisarContatos: async (termo: string) => {
      pesquisas.push({ qual: "contatos", termo });
      if (termo === "erro") throw Object.assign(new Error("x"), { codigo: "SEI_REDE" });
      return [item("424", `Contato ${termo}`)];
    },
    hipoteses: async () => [],
  });
  let negados: Array<[string, string]> = [];
  const ctx = {
    topo: doc,
    doc,
    op: {
      formularioDoProcesso: async () => {
        if (falharNaCarga) throw new Error("Sua sessao do SEI expirou.");
        return form(negados);
      },
      alterarProcesso: async (a: AlteracaoProcesso): Promise<ResultadoEscrita> => {
        if (falharNaGravacao) throw new Error(falharNaGravacao);
        gravacoes.push(a);
        return { alvo: "x", mudancas: [], aplicado: true, resumo: "Processo alterado." };
      },
    },
    recarregar: () => void (recarregou += 1),
  } as unknown as ContextoProcesso;
  const dlg = () => doc.querySelector<HTMLDialogElement>("dialog.spro-dialogo[open]");
  const botao = (rotulo: string) =>
    [...(dlg()?.querySelectorAll("button") ?? [])].find(
      (b) => (b.textContent ?? "").trim() === rotulo || b.getAttribute("aria-label") === rotulo,
    ) as HTMLButtonElement | undefined;
  const digitar = (valor: string) => {
    const campo = dlg()?.querySelector("input[type=search]") as HTMLInputElement;
    campo.value = valor;
    disparar(campo, "input");
  };
  const fechar = () => dlg()?.close();

  abrirModalAssuntos(ctx);
  checar("abre carregando", /Carregando assuntos/.test(dlg()?.textContent ?? ""));
  await tique(10);
  checar(
    "lista os assuntos do processo com contagem",
    dlg()?.querySelectorAll('ul[aria-label="assuntos no processo"] li').length === 2 && /No processo \(2\)/.test(dlg()?.textContent ?? ""),
    dlg()?.textContent,
  );
  checar("sem botao Cancelar; so o X e o Salvar", !botao("Cancelar") && !!botao("Fechar (Esc)") && !!botao("Salvar"));
  checar("Salvar desabilitado sem mudanca", botao("Salvar")?.disabled === true);
  checar(
    "campo de busca com aria-label e estado inicial",
    dlg()?.querySelector("input[type=search]")?.getAttribute("aria-label") === "Pesquisar assunto para adicionar" &&
      /Digite o código/.test(dlg()?.querySelector(".spro-p-lupa-estado")?.textContent ?? ""),
  );
  checar("nenhum title no modal", dlg()?.querySelector("[title]") === null);
  digitar("ab");
  await tique(10);
  checar("curto: pede mais letras, sem rede", /Digite mais 1 letra/.test(dlg()?.textContent ?? "") && pesquisas.length === 0);
  digitar("tecnologia");
  await tique(450);
  checar(
    "pesquisa incremental no autocompletar de assuntos",
    pesquisas.length === 1 && pesquisas[0]?.qual === "assuntos" && pesquisas[0].termo === "tecnologia",
    pesquisas,
  );
  checar(
    "resultados: 2, o que ja esta no processo vem desabilitado",
    dlg()?.querySelectorAll(".spro-p-resultados li").length === 2 &&
      (botao("020 - Outro (já está no processo)") as HTMLButtonElement)?.disabled === true &&
      /2 resultados/.test(dlg()?.textContent ?? ""),
  );
  botao("Adicionar 123.4 - tecnologia")?.click();
  checar(
    "adicionar: entra na lista como Novo e habilita Salvar",
    dlg()?.querySelectorAll('ul[aria-label="assuntos no processo"] li').length === 3 &&
      !!dlg()?.querySelector('[data-estado="novo"]') &&
      botao("Salvar")?.disabled === false &&
      /1 a acrescentar/.test(dlg()?.textContent ?? ""),
  );
  checar(
    "o resultado adicionado fica desabilitado",
    (botao("123.4 - tecnologia (já está no processo)") as HTMLButtonElement)?.disabled === true,
  );
  botao("Retirar 004.01.05.002 - Informatica")?.click();
  checar(
    "retirar marca (pressed), riscado, e conta",
    dlg()?.querySelector('[data-estado="retirado"]') !== null &&
      /1 a acrescentar, 1 a retirar/.test(dlg()?.textContent ?? "") &&
      botao("Manter 004.01.05.002 - Informatica")?.getAttribute("aria-pressed") === "true",
  );
  botao("Salvar")?.click();
  await tique(20);
  const g = gravacoes[0]?.assuntos ?? [];
  checar(
    "Salvar grava a lista final pela lupa de assuntos, com ids",
    g.map((i) => i.id).join() === "55,777" && gravacoes[0]?.interessados === undefined,
    g,
  );
  checar("fechou e o painel foi refeito", dlg() === null && recarregou === 1);

  // obrigatorio
  abrirModalAssuntos(ctx);
  await tique(10);
  botao("Retirar 004.01.05.002 - Informatica")?.click();
  botao("Retirar 020 - Outro")?.click();
  botao("Salvar")?.click();
  await tique(10);
  checar(
    "assuntos nao pode ficar sem nenhum: mensagem no modal, nada gravado",
    /ao menos um assunto/.test(dlg()?.querySelector(".spro-p-erro")?.textContent ?? "") && gravacoes.length === 1,
  );
  fechar();

  // negado
  negados = [["55", "GAB"]];
  abrirModalAssuntos(ctx);
  await tique(10);
  checar(
    "assunto acrescentado por outra unidade: sem botao Retirar e com a sigla",
    !botao("Retirar 020 - Outro") && /Acrescentado por GAB/.test(dlg()?.textContent ?? ""),
  );
  fechar();
  negados = [];

  // erro de gravacao mantem tudo
  abrirModalAssuntos(ctx);
  await tique(10);
  digitar("zzz");
  await tique(450);
  botao("Adicionar 123.4 - zzz")?.click();
  falharNaGravacao = "O SEI nao confirmou a alteracao.";
  botao("Salvar")?.click();
  await tique(20);
  checar(
    "erro do SEI: mensagem no modal, modal aberto, lista mantida, Salvar de volta",
    /O SEI nao confirmou/.test(dlg()?.querySelector(".spro-p-erro")?.textContent ?? "") &&
      dlg()?.querySelectorAll('[data-estado="novo"]').length === 1 &&
      botao("Salvar")?.disabled === false,
  );
  falharNaGravacao = null;
  fechar();

  // sem resultado
  abrirModalAssuntos(ctx);
  await tique(10);
  digitar("nada");
  await tique(450);
  checar(
    "sem resultado: mensagem, nao erro",
    /Nenhum resultado para “nada”/.test(dlg()?.textContent ?? "") && dlg()?.querySelectorAll(".spro-p-resultados li").length === 0,
  );
  fechar();

  // erro ao carregar o formulario
  falharNaCarga = true;
  abrirModalAssuntos(ctx);
  await tique(10);
  checar(
    "erro ao carregar: mensagem e Tentar de novo (nunca carregando eterno)",
    /sessão do SEI expirou|sessao do SEI expirou/.test(dlg()?.textContent ?? "") &&
      !!botao("Tentar de novo") &&
      !/Carregando/.test(dlg()?.textContent ?? ""),
  );
  falharNaCarga = false;
  botao("Tentar de novo")?.click();
  await tique(10);
  checar("Tentar de novo carrega", dlg()?.querySelectorAll('ul[aria-label="assuntos no processo"] li').length === 2);
  fechar();

  // interessados
  pesquisas.length = 0;
  abrirModalInteressados(ctx);
  await tique(10);
  checar(
    "interessados: lista e titulo",
    dlg()?.querySelector("h2")?.textContent === "Interessados do processo" &&
      dlg()?.querySelectorAll('ul[aria-label="interessados no processo"] li').length === 2,
  );
  botao("Retirar CGE-CAUD")?.click();
  digitar("maria");
  await tique(450);
  checar("pesquisa de contatos", pesquisas[0]?.qual === "contatos" && pesquisas[0].termo === "maria");
  botao("Adicionar Contato maria")?.click();
  botao("Salvar")?.click();
  await tique(20);
  const gi = gravacoes[gravacoes.length - 1]?.interessados ?? [];
  checar(
    "grava interessados: sai um, entra um (ids)",
    gi.map((i) => i.id).join() === "101,424" && gravacoes[gravacoes.length - 1]?.assuntos === undefined,
    gi,
  );

  abrirModalInteressados(ctx);
  await tique(10);
  digitar("erro");
  await tique(450);
  checar(
    "erro na pesquisa: mensagem com Tentar de novo, lista do processo intacta",
    /Sem conex/.test(dlg()?.querySelector(".spro-p-lupa-estado")?.textContent ?? "") &&
      !!botao("Tentar de novo") &&
      dlg()?.querySelectorAll('ul[aria-label="interessados no processo"] li').length === 2,
  );
  checar(
    "teclado: Enter no campo pesquisa na hora",
    (() => {
      const antes = pesquisas.length;
      const campo = dlg()?.querySelector("input[type=search]") as HTMLInputElement;
      const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
      const tecla = Object.assign(new Ev("keydown", { bubbles: true }), { key: "Enter" });
      campo.dispatchEvent(tecla);
      return pesquisas.length === antes + 1;
    })(),
  );
  fechar();
  restaurar();
}
