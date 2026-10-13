import { naTela } from "../src/app/dados";
import { abrirDialogoAvaliacao } from "../src/app/dialogos/avaliar";
import { abrirDialogoConclusao } from "../src/app/dialogos/concluir";
import { abrirDialogoDemanda } from "../src/app/dialogos/demanda";
import { abrirHistorico } from "../src/app/dialogos/historico";
import { abrirDialogoProrrogacao } from "../src/app/dialogos/prorrogar";
import { iniciar } from "../src/modelo/operacoes";
import type { Demanda } from "../src/modelo/tipos";
import {
  appDeTeste,
  criarNoCombo,
  dialogoAberto,
  digitar,
  escolherCombo,
  fecharDialogo,
  marcar,
  opcoesDoCombo,
  tecla,
  texto,
} from "./apoioApp";
import { HOJE } from "./fabrica";
import { botao, checar, secao, tique } from "./util";

type Teste = ReturnType<typeof appDeTeste>;
const dlg = (t: Teste) => dialogoAberto(t.doc) as HTMLElement;
const campo = (t: Teste, nome: string) => dlg(t).querySelector(`[name="${nome}"]`) as HTMLInputElement;
const erros = (t: Teste) => texto(dlg(t).querySelector(".dem-erros"));
const todas = async (t: Teste): Promise<Demanda[]> => [...(await t.repos.unidade.dados()), ...(await t.repos.eu.dados())];

async function abrir(t: Teste, o: Parameters<typeof abrirDialogoDemanda>[1] = {}) {
  const p = abrirDialogoDemanda(t.deps, o);
  await tique(15);
  return p;
}

export async function verificarAppDialogos(): Promise<void> {
  secao("dialogo da demanda: estrutura");
  {
    const t = appDeTeste();
    void abrir(t);
    await tique(15);
    checar("titulo do dialogo", texto(dlg(t).querySelector("h2")) === "Nova demanda");
    checar(
      "obrigatorios no topo: titulo, responsavel e prazo",
      !!campo(t, "titulo") && !!dlg(t).querySelector('button[role="combobox"][aria-label="Responsável"]') && !!campo(t, "prazo"),
    );
    const mais = dlg(t).querySelector('.dem-sec[data-secao="mais"]') as HTMLElement;
    checar(
      "Mais campos fica recolhido",
      !!mais && !mais.classList.contains("dem-sec-aberta") && texto(mais.querySelector(".dem-sec-tit")) === "Mais campos",
    );
    checar(
      "Mais campos tem descricao, prioridade, etiquetas, processos, checklist, tempo, etapa e quem ve",
      !!mais.querySelector("[name=descricao]") &&
        !!mais.querySelector('[aria-label="Prioridade"]') &&
        !!mais.querySelector('[aria-label="Etiquetas"]') &&
        !!mais.querySelector('[data-secao="processos"]') &&
        !!mais.querySelector('[data-secao="checklist"]') &&
        !!mais.querySelector("[name=estimado]") &&
        !!mais.querySelector('[aria-label="Etapa do projeto"]') &&
        !!mais.querySelector('[role="radiogroup"][aria-label="Quem vê"]'),
    );
    checar("Quem ve mostra a sigla da unidade", texto(dlg(t).querySelector(".dem-opcao")).includes("(SUPAC)"));
    checar(
      "a lista de responsaveis tem o usuario e a opcao sem responsavel",
      ["", "l:ana", "l:carla"].every((v) => opcoesDoCombo(dlg(t), "Responsável").includes(v)),
    );
    fecharDialogo(t.doc);
    await tique(15);
  }

  secao("dialogo da demanda: criar");
  {
    const t = appDeTeste();
    const p = abrir(t);
    await tique(15);
    digitar(campo(t, "titulo"), "  Revisar a norma  ");
    escolherCombo(dlg(t), "Responsável", "l:carla");
    digitar(campo(t, "prazo"), "2026-10-25");
    tecla(campo(t, "titulo"), "Enter");
    const r = await p;
    await tique(10);
    checar("Enter no titulo grava e fecha", !!r && !dialogoAberto(t.doc));
    const d = (await t.repos.unidade.dados())[0] as Demanda;
    checar(
      "a demanda existe na unidade com o responsavel do combo",
      d?.titulo === "Revisar a norma" && d.responsavel?.login === "carla" && d.prazo === "2026-10-25" && r?.vis === "unidade",
      d,
    );
    checar("a distribuicao e a de hoje", d.distribuidaEm === HOJE);
  }

  secao("dialogo da demanda: Só eu");
  {
    const t = appDeTeste();
    const p = abrir(t);
    await tique(15);
    const campoResp = () => dlg(t).querySelector(".dem-campo-resp") as HTMLElement;
    checar("na unidade o campo Responsavel aparece", !campoResp().hidden);
    marcar(dlg(t).querySelector("input[value='eu']"));
    checar("em Só eu o campo Responsavel some", campoResp().hidden);
    digitar(campo(t, "titulo"), "Minha tarefa");
    digitar(campo(t, "prazo"), "2026-10-30");
    botao(dlg(t), "Criar demanda")!.click();
    const r = await p;
    checar(
      "grava no repositorio eu, com o proprio usuario",
      r?.vis === "eu" && (await t.repos.unidade.dados()).length === 0 && (await t.repos.eu.dados())[0]?.responsavel?.login === "ana",
    );
  }

  secao("dialogo da demanda: recusas (Review Focus 10)");
  {
    const t = appDeTeste();
    void abrir(t);
    await tique(15);
    digitar(campo(t, "prazo"), "2026-10-25");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar(
      "titulo vazio: mensagem e o dialogo nao fecha",
      erros(t) === "Informe o título da demanda." && !!dialogoAberto(t.doc) && (await todas(t)).length === 0,
      erros(t),
    );
    digitar(campo(t, "titulo"), "x".repeat(201));
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar("titulo gigante e recusado", erros(t).includes("passa de 200 caracteres") && (await todas(t)).length === 0, erros(t));
    digitar(campo(t, "titulo"), "Valido");
    digitar(campo(t, "prazo"), "30/02/2026");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar(
      "prazo invalido (30/02/2026) e recusado",
      erros(t).includes("Informe um prazo válido") && (await todas(t)).length === 0,
      erros(t),
    );
    digitar(campo(t, "prazo"), "2026-02-30");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar("prazo 2026-02-30 tambem", erros(t).includes("Informe um prazo válido") && (await todas(t)).length === 0, erros(t));
    digitar(campo(t, "prazo"), "2026-10-05");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar(
      "prazo antes da distribuicao e recusado",
      erros(t).includes("não pode ser antes da distribuição") && (await todas(t)).length === 0,
      erros(t),
    );
    digitar(campo(t, "prazo"), "2026-10-25");
    digitar(campo(t, "estimado"), "abc");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar("tempo estimado invalido e recusado", erros(t).includes("Tempo estimado inválido") && (await todas(t)).length === 0, erros(t));
    digitar(campo(t, "estimado"), "1h30");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(20);
    checar("corrigido, grava com o tempo estimado", (await todas(t))[0]?.tempoEstimadoMin === 90 && !dialogoAberto(t.doc));
  }

  secao("dialogo da demanda: editar e prorrogar");
  {
    const t = appDeTeste();
    const criada = await t.repos.unidade.criar({
      titulo: "Original",
      prazo: "2026-10-20",
      distribuidaEm: "2026-10-01",
      descricao: "desc",
      etiquetas: ["ti"],
      prioridade: "importante",
    });
    const alvo = naTela(criada, "unidade", HOJE);
    const p = abrir(t, { demanda: alvo });
    await tique(15);
    checar(
      "abre preenchido",
      texto(dlg(t).querySelector("h2")) === "Editar demanda" &&
        campo(t, "titulo").value === "Original" &&
        campo(t, "descricao").value === "desc",
    );
    checar(
      "o campo Prazo mostra Prorrogar… em vez de ser editavel",
      !dlg(t).querySelector("input[name=prazo]") &&
        !!botao(dlg(t), "Prorrogar…") &&
        texto(dlg(t).querySelector(".dem-prazo-atual")) === "20/10/2026",
    );
    checar(
      "Quem ve fica travado na edicao",
      [...dlg(t).querySelectorAll("input[name=vis]")].every((i) => i.hasAttribute("disabled")),
    );
    botao(dlg(t), "Prorrogar…")!.click();
    await tique(15);
    checar("Prorrogar abre o dialogo de prorrogacao por cima", texto(dlg(t).querySelector("h2")) === "Prorrogar prazo");
    digitar(campo(t, "prazo"), "2026-10-27");
    botao(dlg(t), "Prorrogar")!.click();
    await tique(15);
    checar(
      "sem motivo nao grava e nao fecha",
      erros(t) === "Informe o motivo da mudança de prazo." && (await t.repos.unidade.obter(criada.id))?.prazo === "2026-10-20",
    );
    digitar(campo(t, "motivo"), "Aguardando o parecer");
    botao(dlg(t), "Prorrogar")!.click();
    await tique(30);
    const nova = await t.repos.unidade.obter(criada.id);
    checar("com motivo grava, guarda o prazo original", nova?.prazo === "2026-10-27" && nova.prazoOriginal === "2026-10-20");
    checar(
      "o dialogo da demanda mostra o prazo novo",
      texto(dlg(t).querySelector(".dem-prazo-atual")) === "27/10/2026" && texto(dlg(t).querySelector("h2")) === "Editar demanda",
    );
    digitar(campo(t, "titulo"), "Mudado");
    botao(dlg(t), "Gravar")!.click();
    const r = await p;
    const gravada = await t.repos.unidade.obter(criada.id);
    checar(
      "mudar o titulo grava, sem mexer no prazo",
      r?.demanda.titulo === "Mudado" &&
        gravada?.titulo === "Mudado" &&
        gravada.prazo === "2026-10-27" &&
        gravada.prioridade === "importante" &&
        gravada.etiquetas.join() === "ti",
    );
  }

  secao("dialogo da demanda: checklist");
  {
    const t = appDeTeste();
    const p = abrir(t);
    await tique(15);
    const novo = () => campo(t, "novo-item");
    const adicionar = (texto: string) => {
      digitar(novo(), texto);
      botao(dlg(t), "Adicionar item")!.click();
    };
    adicionar("A");
    tecla(novo(), "Enter");
    digitar(novo(), "B");
    tecla(novo(), "Enter");
    adicionar("C");
    const itens = () => [...dlg(t).querySelectorAll<HTMLInputElement>('.dem-item input[name="item"]')].map((i) => i.value);
    checar("adiciona itens (botao e Enter no campo)", itens().join() === "A,B,C", itens());
    checar("Enter no campo do item nao grava a demanda", !!dialogoAberto(t.doc) && (await todas(t)).length === 0);
    (dlg(t).querySelectorAll('button[aria-label="Descer item"]')[0] as HTMLElement).click();
    checar("descer o primeiro", itens().join() === "B,A,C", itens());
    (dlg(t).querySelectorAll('button[aria-label="Subir item"]')[2] as HTMLElement).click();
    checar("subir o ultimo", itens().join() === "B,C,A", itens());
    checar(
      "o primeiro nao sobe e o ultimo nao desce",
      dlg(t).querySelectorAll('button[aria-label="Subir item"]')[0]?.hasAttribute("disabled") === true &&
        dlg(t).querySelectorAll('button[aria-label="Descer item"]')[2]?.hasAttribute("disabled") === true,
    );
    marcar(dlg(t).querySelectorAll<HTMLInputElement>('.dem-item input[type="checkbox"]')[0]);
    (dlg(t).querySelectorAll('button[aria-label="Remover item"]')[1] as HTMLElement).click();
    checar("remover o do meio", itens().join() === "B,A", itens());
    checar("o resumo da secao mostra feitos de total", texto(dlg(t).querySelector('[data-secao="checklist"] .dem-sec-res')) === "1/2");
    for (let i = 3; i <= 50; i++) adicionar(`item ${i}`);
    checar("50 itens cabem", itens().length === 50);
    adicionar("o 51");
    checar("o 51o item e recusado com mensagem", itens().length === 50 && erros(t).includes("até 50 itens"), erros(t));
    digitar(campo(t, "titulo"), "Com checklist");
    digitar(campo(t, "prazo"), "2026-10-25");
    botao(dlg(t), "Criar demanda")!.click();
    await p;
    const d = (await todas(t))[0];
    checar(
      "grava a ordem e o feito",
      d?.checklist.length === 50 && d.checklist[0]?.texto === "B" && d.checklist[0]?.feito === true && d.checklist[1]?.feito === false,
    );
  }

  secao("dialogo da demanda: EDITAR uma demanda que ja tem processo (regressao da 2.9: o dialogo nem abria)");
  {
    const t = appDeTeste();
    const criada = await t.repos.unidade.criar({
      titulo: "Com processos",
      prazo: "2026-10-20",
      distribuidaEm: "2026-10-01",
      processos: [
        { protocolo: "26.0.000135872-2", idProcedimento: "77" },
        { protocolo: "26.0.000145655-4" },
        { protocolo: "", sigiloso: true },
      ],
    });
    const alvo = naTela(criada, "unidade", HOJE);
    let abriu = false;
    let erro: unknown = null;
    const p = abrir(t, { demanda: alvo });
    p.catch((e) => {
      erro = e;
    });
    await tique(15);
    abriu = !!t.doc.querySelector("dialog[open]");
    checar("o dialogo abre (nao lanca ReferenceError por processosSecao antes da declaracao)", abriu && erro === null, String(erro));
    checar("as linhas de processo vem preenchidas", dlg(t).querySelectorAll(".dem-processo-linha").length === 3);
    checar("o resumo da secao conta os processos", texto(dlg(t).querySelector('[data-secao="processos"] .dem-sec-res')) === "3");
    checar("a dica de sigilo aparece com um vinculo sigiloso", !(dlg(t).querySelector(".dem-dica-sigilo") as HTMLElement).hidden);
    digitar(campo(t, "titulo"), "Com processos (editado)");
    botao(dlg(t), "Gravar")!.click();
    await tique(15);
    const gravada = (await t.repos.unidade.dados()).find((d) => d.id === criada.id);
    checar(
      "grava o titulo e mantem os 3 processos",
      gravada?.titulo === "Com processos (editado)" &&
        gravada.processos.length === 3 &&
        gravada.processos[0]?.protocolo === "26.0.000135872-2" &&
        gravada.processos[0]?.idProcedimento === "77",
      JSON.stringify(gravada?.processos),
    );
  }

  secao("dialogo da demanda: processos");
  {
    const t = appDeTeste({
      processosDaCaixa: async () => [
        { protocolo: "50300.001234/2026-11", idProcedimento: "77", sigiloso: false },
        { protocolo: "50300.009999/2026-00", idProcedimento: "88", sigiloso: true },
      ],
    });
    const p = abrir(t);
    await tique(15);
    botao(dlg(t), "Adicionar processo")!.click();
    await tique(15);
    escolherCombo(dlg(t), "Processo 1", "50300.001234/2026-11");
    checar("um da caixa comum nao mostra a dica de sigilo", (dlg(t).querySelector(".dem-dica-sigilo") as HTMLElement).hidden);
    botao(dlg(t), "Adicionar processo")!.click();
    await tique(5);
    await criarNoCombo(dlg(t), "Processo 2", "abc");
    digitar(campo(t, "titulo"), "Com processos");
    digitar(campo(t, "prazo"), "2026-10-25");
    botao(dlg(t), "Criar demanda")!.click();
    await tique(15);
    checar("numero fora da forma e recusado", erros(t) === "Número de processo inválido." && (await todas(t)).length === 0, erros(t));
    escolherCombo(dlg(t), "Processo 2", "50300.009999/2026-00");
    const dica = dlg(t).querySelector(".dem-dica-sigilo") as HTMLElement;
    checar(
      "o sigiloso vem marcado e a dica explica",
      !dica.hidden && texto(dica).includes("o número não é compartilhado com a unidade"),
      texto(dica),
    );
    for (let i = 0; i < 3; i++) botao(dlg(t), "Adicionar processo")!.click();
    botao(dlg(t), "Adicionar processo")!.click();
    checar("o 6o processo e recusado", erros(t).includes("até 5 processos"), erros(t));
    while (dlg(t).querySelectorAll('button[aria-label="Remover processo"]').length > 2)
      (dlg(t).querySelectorAll('button[aria-label="Remover processo"]')[2] as HTMLElement).click();
    botao(dlg(t), "Criar demanda")!.click();
    await p;
    const d = (await todas(t))[0] as Demanda;
    checar(
      "grava os dois, o sigiloso marcado e com o numero local",
      d.processos.length === 2 &&
        d.processos[0]?.idProcedimento === "77" &&
        d.processos[1]?.sigiloso === true &&
        d.processos[1]?.protocolo === "50300.009999/2026-00",
      d.processos,
    );
  }

  secao("dialogo da demanda: criacao bloqueada (Review Focus 9)");
  {
    const t = appDeTeste({ tabelas: async () => [{ vis: "unidade", tabela: "d", faixa: "bloqueio", percentual: 100, bytes: 102400 }] });
    const p = abrir(t);
    await tique(15);
    const gravar = () => botao(dlg(t), "Criar demanda") as HTMLButtonElement;
    checar(
      "o dialogo abre, mas Gravar fica desabilitado com a explicacao",
      !!dlg(t) &&
        gravar().disabled &&
        (gravar().getAttribute("title") ?? "").includes("bloqueados") &&
        !(dlg(t).querySelector(".dem-bloqueio") as HTMLElement).hidden,
    );
    marcar(dlg(t).querySelector("input[value='eu']"));
    checar(
      "escolher Só eu libera (o limite e da unidade)",
      !gravar().disabled && (dlg(t).querySelector(".dem-bloqueio") as HTMLElement).hidden,
    );
    digitar(campo(t, "titulo"), "Pessoal");
    digitar(campo(t, "prazo"), "2026-10-25");
    gravar().click();
    const r = await p;
    checar(
      "grava no escopo eu",
      r?.vis === "eu" && (await t.repos.eu.dados()).length === 1 && (await t.repos.unidade.dados()).length === 0,
    );
    // Editar continua com o limite batido.
    const existente = await t.repos.unidade.criar({ titulo: "Antiga", prazo: "2026-10-20", distribuidaEm: "2026-10-01" });
    const p2 = abrir(t, { demanda: naTela(existente, "unidade", HOJE) });
    await tique(15);
    checar("editar segue liberado com o limite batido", !(botao(dlg(t), "Gravar") as HTMLButtonElement).disabled);
    digitar(campo(t, "titulo"), "Antiga editada");
    botao(dlg(t), "Gravar")!.click();
    await p2;
    checar("e grava", (await t.repos.unidade.obter(existente.id))?.titulo === "Antiga editada");
  }

  secao("dialogo da demanda: descartar as alteracoes");
  {
    const perguntas: string[] = [];
    let sim = false;
    const t = appDeTeste({
      confirmar: async (p) => {
        perguntas.push(p);
        return sim;
      },
    });
    let resolvido: unknown = "pendente";
    void abrir(t).then((r) => (resolvido = r));
    await tique(15);
    fecharDialogo(t.doc);
    await tique(15);
    checar("sem alteracao, fecha sem perguntar", perguntas.length === 0 && !dialogoAberto(t.doc) && resolvido === null, resolvido);
    resolvido = "pendente";
    void abrir(t).then((r) => (resolvido = r));
    await tique(15);
    digitar(campo(t, "titulo"), "Comecei a digitar");
    fecharDialogo(t.doc);
    await tique(15);
    checar("com alteracao, pergunta Descartar as alterações?", perguntas.join() === "Descartar as alterações?");
    checar(
      "dizendo nao, o dialogo volta com o que foi digitado",
      !!dialogoAberto(t.doc) && campo(t, "titulo").value === "Comecei a digitar" && resolvido === "pendente",
    );
    sim = true;
    fecharDialogo(t.doc);
    await tique(15);
    checar("dizendo sim, descarta: nada gravado", !dialogoAberto(t.doc) && resolvido === null && (await todas(t)).length === 0);
  }

  secao("dialogo concluir");
  {
    const t = appDeTeste();
    const d = await t.repos.unidade.criar({ titulo: "Para concluir", prazo: "2026-10-20", distribuidaEm: "2026-10-05" });
    await t.repos.unidade.aplicar(d.id, iniciar);
    const viva = (await t.repos.unidade.obter(d.id)) as Demanda;
    const p = abrirDialogoConclusao(t.deps, viva);
    await tique(15);
    checar("a data vem com hoje", campo(t, "data").value === HOJE);
    digitar(campo(t, "data"), "2026-10-01");
    botao(dlg(t), "Concluir")!.click();
    checar("nunca antes da distribuicao", erros(t).includes("não pode ser antes da distribuição") && !!dialogoAberto(t.doc), erros(t));
    digitar(campo(t, "data"), "2026-10-12");
    digitar(campo(t, "tempo"), "abc");
    botao(dlg(t), "Concluir")!.click();
    checar("tempo invalido", erros(t).includes("Tempo gasto inválido"), erros(t));
    digitar(campo(t, "tempo"), "1h75");
    botao(dlg(t), "Concluir")!.click();
    checar("minutos acima de 59 sao recusados", erros(t).includes("Tempo gasto inválido"), erros(t));
    digitar(campo(t, "tempo"), "1h30");
    digitar(campo(t, "documento"), "1".repeat(21));
    botao(dlg(t), "Concluir")!.click();
    checar("documento com 21 digitos e recusado", erros(t).includes("Número de documento inválido"), erros(t));
    digitar(campo(t, "documento"), "123456");
    digitar(campo(t, "observacao"), "  Feito  ");
    botao(dlg(t), "Concluir")!.click();
    const r = await p;
    checar(
      "devolve os dados limpos",
      JSON.stringify(r) === JSON.stringify({ data: "2026-10-12", tempoGastoMin: 90, observacao: "Feito", documento: { numero: "123456" } }),
      r,
    );
    checar("o dialogo so coleta: nada foi gravado", (await t.repos.unidade.obter(d.id))?.concluidaEm === undefined);
    const p2 = abrirDialogoConclusao(t.deps, viva);
    await tique(15);
    botao(dlg(t), "Concluir")!.click();
    const r2 = await p2;
    checar("tempo e documento vazios nao sao informados", JSON.stringify(r2) === JSON.stringify({ data: HOJE }), r2);
    const p3 = abrirDialogoConclusao(t.deps, viva);
    await tique(15);
    fecharDialogo(t.doc);
    checar("Esc devolve null", (await p3) === null);
  }

  secao("dialogo prorrogar");
  {
    const t = appDeTeste();
    const d = await t.repos.unidade.criar({ titulo: "P", prazo: "2026-10-20", distribuidaEm: "2026-10-05" });
    await t.repos.unidade.aplicar(d.id, (x, c) => ({
      demanda: { ...x, prazo: "2026-10-22", prazoOriginal: "2026-10-20", atualizadoEm: c.agora },
      registros: [],
    }));
    const viva = (await t.repos.unidade.obter(d.id)) as Demanda;
    const p = abrirDialogoProrrogacao(t.deps, viva);
    await tique(15);
    checar(
      "mostra o prazo atual e o original",
      texto(dlg(t)).includes("Prazo atual: 22/10/2026") && texto(dlg(t)).includes("prazo original: 20/10/2026"),
      texto(dlg(t)),
    );
    botao(dlg(t), "Prorrogar")!.click();
    checar("o mesmo prazo e recusado", erros(t).includes("igual ao atual"));
    digitar(campo(t, "prazo"), "2026-10-03");
    digitar(campo(t, "motivo"), "x");
    botao(dlg(t), "Prorrogar")!.click();
    checar("antes da distribuicao e recusado", erros(t).includes("antes da distribuição"), erros(t));
    digitar(campo(t, "prazo"), "2026-11-01");
    digitar(campo(t, "motivo"), "  ");
    botao(dlg(t), "Prorrogar")!.click();
    checar("sem motivo nao grava", erros(t).includes("Informe o motivo") && !!dialogoAberto(t.doc));
    digitar(campo(t, "motivo"), "Mudou a prioridade");
    tecla(campo(t, "motivo"), "Enter");
    checar("com motivo devolve", JSON.stringify(await p) === JSON.stringify({ prazo: "2026-11-01", motivo: "Mudou a prioridade" }));
  }

  secao("dialogo avaliar");
  {
    const t = appDeTeste();
    const d = await t.repos.unidade.criar({
      titulo: "Avaliar",
      prazo: "2026-10-20",
      distribuidaEm: "2026-10-05",
      responsavel: { login: "ana", nome: "Ana Lima" },
    });
    const p = abrirDialogoAvaliacao(t.deps, d);
    await tique(15);
    const grupo = () => dlg(t).querySelector('[role="radiogroup"][aria-label="Nota"]') as HTMLElement;
    const estrelas = () => [...grupo().querySelectorAll<HTMLElement>('[role="radio"]')];
    checar("cinco estrelas acessiveis", estrelas().length === 5 && estrelas().every((e) => e.getAttribute("aria-checked") === "false"));
    checar("avaliar a propria demanda mostra a dica (e e permitido)", texto(dlg(t)).includes("Você é o responsável por esta demanda"));
    botao(dlg(t), "Avaliar")!.click();
    checar("sem nota nao grava", erros(t).includes("Escolha uma nota") && !!dialogoAberto(t.doc));
    tecla(estrelas()[0] as HTMLElement, "ArrowRight");
    tecla(estrelas()[1] as HTMLElement, "ArrowRight");
    checar(
      "seta para a direita sobe a nota",
      estrelas()[1]?.getAttribute("aria-checked") === "true" || estrelas()[0]?.getAttribute("aria-checked") === "true",
    );
    tecla(estrelas()[1] as HTMLElement, "ArrowRight");
    const marcada = estrelas().findIndex((e) => e.getAttribute("aria-checked") === "true") + 1;
    checar(
      "so uma estrela fica marcada (nota 3 apos duas setas)",
      marcada === 3 && estrelas().filter((e) => e.getAttribute("aria-checked") === "true").length === 1,
      marcada,
    );
    tecla(estrelas()[2] as HTMLElement, "ArrowLeft");
    checar("seta para a esquerda desce", estrelas().findIndex((e) => e.getAttribute("aria-checked") === "true") === 1);
    estrelas()[3]?.click();
    digitar(campo(t, "comentario"), " Muito bom ");
    botao(dlg(t), "Avaliar")!.click();
    checar("devolve nota e comentario", JSON.stringify(await p) === JSON.stringify({ nota: 4, comentario: "Muito bom" }));
    const outra = await t.repos.unidade.criar({
      titulo: "De outra",
      prazo: "2026-10-20",
      distribuidaEm: "2026-10-05",
      responsavel: { login: "carla", nome: "Carla Dias" },
    });
    void abrirDialogoAvaliacao(t.deps, outra);
    await tique(15);
    checar("a dica so aparece para o proprio responsavel", !texto(dlg(t)).includes("Você é o responsável"));
    fecharDialogo(t.doc);
  }

  secao("dialogo historico");
  {
    const t = appDeTeste();
    const d = await t.repos.unidade.criar({ titulo: "Com historico", prazo: "2026-10-20", distribuidaEm: "2026-10-05" });
    await t.repos.unidade.aplicar(d.id, iniciar);
    await t.repos.unidade.aplicar(d.id, (x, c) => ({
      demanda: { ...x, prazo: "2026-10-27", prazoOriginal: x.prazo, atualizadoEm: c.agora },
      registros: [{ demanda: x.id, campo: "prazo", antes: x.prazo, depois: "2026-10-27", motivo: "Parecer atrasou" }],
    }));
    const viva = (await t.repos.unidade.obter(d.id)) as Demanda;
    const fim = abrirHistorico(t.deps, viva);
    await tique(15);
    const linhas = [...dlg(t).querySelectorAll(".dem-hist-linha")].map((l) => texto(l));
    checar(
      "do mais recente ao mais antigo",
      linhas.length === 3 &&
        linhas[0]?.includes("prazo 20/10/2026 → 27/10/2026") === true &&
        linhas[2]?.includes("criou a demanda") === true,
      linhas,
    );
    checar(
      "mostra quem, e o motivo da prorrogacao",
      linhas[0]?.includes("Ana Lima") === true && linhas[0]?.includes("Motivo: Parecer atrasou") === true,
    );
    fecharDialogo(t.doc);
    await fim;
    checar("o historico fecha e resolve", !dialogoAberto(t.doc));
  }
}
