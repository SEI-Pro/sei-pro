import { ORDEM_FINAL, paineisHabilitados, SELECAO_PADRAO } from "../src/modelo/paineis";
import {
  alternarChecklist,
  alternarItem,
  alternarMarca,
  comporObservacaoAcompanhamento,
  comporTextoMarcador,
  continuarChecklist,
  dataIsoDaAnotacao,
  definirDataNaAnotacao,
  linhaDaPosicao,
  linhasDaAnotacao,
  moverLinhas,
  observacoesVisiveis,
  partesDoInteressado,
  posicaoDaLinha,
  prazoNativoDaPagina,
  reaberturaBrasileira,
  reaberturaParaCampo,
  separarTextoMarcador,
  situacaoDoPrazo,
  temMarca,
  textoComAtribuicao,
} from "../src/modelo/texto";
import { checar, secao } from "./util";

export function verificarTexto(): void {
  secao("marcador: prazo e texto");
  {
    const a = separarTextoMarcador("Ate 25/10/2026 18:30\nPrecisa de revisão");
    checar(
      "vencimento com hora e texto",
      a.prazo?.vencimento === true && a.prazo.data === "2026-10-25" && a.prazo.hora === "18:30" && a.texto === "Precisa de revisão",
      a,
    );
    const b = separarTextoMarcador("05/11/2026 09:00");
    checar("data simples sem texto", b.prazo?.vencimento === false && b.prazo.data === "2026-11-05" && b.texto === "", b);
    const c = separarTextoMarcador("Até 1/2/2027");
    checar(
      "com acento e dia de um digito, hora padrao 23:59",
      c.prazo?.vencimento === true && c.prazo.data === "2027-02-01" && c.prazo.hora === "23:59",
      c,
    );
    const d = separarTextoMarcador("so um texto");
    checar("sem data: sem prazo", d.prazo === null && d.texto === "so um texto");
    const e = separarTextoMarcador("Enviar ate 30/12/2026 14:00 por e-mail");
    checar(
      "data no meio do texto antigo: prazo achado e retirado do texto",
      e.prazo?.data === "2026-12-30" && e.prazo.hora === "14:00" && !/30\/12/.test(e.texto) && /Enviar/.test(e.texto),
      e,
    );
    checar(
      "compor e separar sao inversas",
      JSON.stringify(
        separarTextoMarcador(comporTextoMarcador({ prazo: { data: "2026-10-25", hora: "18:30", vencimento: true }, texto: "revisar" })),
      ) === JSON.stringify({ prazo: { data: "2026-10-25", hora: "18:30", vencimento: true }, texto: "revisar" }),
    );
    checar("compor sem prazo e so o texto", comporTextoMarcador({ prazo: null, texto: " ola " }) === "ola");
    checar("literal \\r\\n do legado vira quebra", separarTextoMarcador("Ate 01/01/2027 10:00\\r\\nabc").texto === "abc");
  }

  secao("marcador: situacao do prazo");
  {
    const agora = new Date(2026, 9, 24, 10, 0);
    const s = (data: string, venc = true) => situacaoDoPrazo({ data, hora: "23:59", vencimento: venc }, agora);
    checar("hoje (ainda no prazo) = atencao", s("2026-10-24").rotulo === "hoje" && s("2026-10-24").nivel === "atencao");
    checar("amanha", s("2026-10-25").rotulo === "amanhã");
    checar("em 10 dias = ok", s("2026-11-03").rotulo === "em 10 dias" && s("2026-11-03").nivel === "ok");
    checar("vencido ha 3 dias", s("2026-10-21").rotulo === "há 3 dias" && s("2026-10-21").nivel === "vencido");
    checar("data passada sem vencimento so avisa", s("2026-10-21", false).nivel === "atencao");
  }

  secao("prazo nativo");
  {
    const html =
      'x infraArvoreAcao("CONTROLEPRAZO","12","1","controlador.php?a=b",null,"Controle de Prazo:\\nSIGLA 30/10/2026 (6 dias)","svg/p.svg",1);';
    const p = prazoNativoDaPagina(html);
    checar("le data e estado", p?.data === "30/10/2026" && p.estado === "6 dias" && p.nivel === "ok", p);
    const atras = prazoNativoDaPagina(html.replace("6 dias", "atrasado 2 dias"));
    checar("atrasado", atras?.nivel === "vencido", atras);
    checar("sem a acao: null", prazoNativoDaPagina("nada") === null);
  }

  secao("anotacao: checklist e data");
  {
    const t = "Aguardando\n[ ] minuta\n[X] parecer";
    const l = linhasDaAnotacao(t);
    checar(
      "linhas e marcas",
      l.length === 3 && l[0]?.marca === null && l[1]?.marca === "aberto" && l[2]?.marca === "feito" && l[1]?.texto === "minuta",
      l,
    );
    checar("alternar item aberto -> feito", alternarItem(t, 1) === "Aguardando\n[X] minuta\n[X] parecer");
    checar("alternar item feito -> aberto", alternarItem(t, 2) === "Aguardando\n[ ] minuta\n[ ] parecer");
    checar("linha comum nao muda", alternarItem(t, 0) === t);
    checar("virar checklist uma faixa", alternarChecklist("a\nb\nc", 1, 2) === "a\n[ ] b\n[ ] c");
    checar("faixa toda checklist volta a texto", alternarChecklist("a\n[ ] b\n[X] c", 1, 2) === "a\nb\nc");
    checar("data nova no fim", definirDataNaAnotacao("Ligar para o setor", "2026-11-02") === "Ligar para o setor 02/11/2026");
    checar("data existente e trocada", definirDataNaAnotacao("Ligar 01/10/2026 cedo", "2026-11-02") === "Ligar 02/11/2026 cedo");
    checar("data iso da anotacao", dataIsoDaAnotacao("ver 3/4/2027") === "2027-04-03" && dataIsoDaAnotacao("sem data") === null);
  }

  secao("anotacao: editor (linha da posicao, mover linhas, continuar checklist)");
  {
    const t = "a\n[ ] b\n[X] c\nd";
    checar(
      "linha da posicao: inicio, meio e fim",
      linhaDaPosicao(t, 0) === 0 && linhaDaPosicao(t, 3) === 1 && linhaDaPosicao(t, t.length) === 3,
    );
    checar("posicao da linha", posicaoDaLinha(t, 0) === 0 && posicaoDaLinha(t, 2) === 8 && posicaoDaLinha(t, 3) === 14);
    const sobe = moverLinhas(t, 2, 2, -1);
    checar("subir uma linha troca com a de cima", sobe?.texto === "a\n[X] c\n[ ] b\nd" && sobe.de === 1 && sobe.ate === 1, sobe);
    const desce = moverLinhas(t, 1, 2, 1);
    checar(
      "descer uma faixa leva a linha de baixo para cima dela",
      desce?.texto === "a\nd\n[ ] b\n[X] c" && desce.de === 2 && desce.ate === 3,
      desce,
    );
    checar("subir a primeira e descer a ultima nao fazem nada", moverLinhas(t, 0, 0, -1) === null && moverLinhas(t, 3, 3, 1) === null);
    checar("mover guarda o texto de uma linha so", moverLinhas("so", 0, 0, 1) === null);
    const e1 = continuarChecklist("[ ] a\nb", 5);
    checar("Enter no fim de um item abre outro item aberto", e1?.texto === "[ ] a\n[ ] \nb" && e1.pos === 10, e1);
    const e2 = continuarChecklist("[X] a", 5);
    checar("Enter em item marcado abre item ABERTO", e2?.texto === "[X] a\n[ ] " && e2.pos === 10, e2);
    const e3 = continuarChecklist("[ ] a\n[ ] ", 11);
    checar("Enter em item vazio tira a marca (sai da lista)", e3?.texto === "[ ] a\n" && e3.pos === 6, e3);
    checar("Enter em linha comum: nada (o navegador faz a quebra)", continuarChecklist("abc", 3) === null);
    const e4 = continuarChecklist("[ ] abcd", 6);
    checar("Enter no meio de um item parte o texto e o resto vira o proximo item", e4?.texto === "[ ] ab\n[ ] cd" && e4.pos === 11, e4);
    checar("Enter dentro da marca nao e tratado", continuarChecklist("[ ] abc", 2) === null);
  }

  secao("especificacao: marcas");
  checar("acrescenta URGENTE", alternarMarca("Pagamento", "URGENTE") === "Pagamento (URGENTE)");
  checar("retira URGENTE", alternarMarca("Pagamento (URGENTE)", "URGENTE") === "Pagamento");
  checar("retira em qualquer caixa e no meio", alternarMarca("A (urgente) B", "URGENTE") === "A B");
  checar("temMarca", temMarca("x (Trancado)", "TRANCADO") && !temMarca("x", "TRANCADO"));

  secao("observacoes, acompanhamento, atribuicao, interessados");
  {
    const o = observacoesVisiveis("#prazo: 10\nlinha um\nlinha dois", "TESTE", [
      { unidade: "OUTRA", observacao: "#tag: x" },
      { unidade: "ZZ", observacao: "oi" },
    ]);
    checar(
      "etiquetas somem; unidade sem observacao some",
      o.length === 2 && o[0]?.observacao === "linha um linha dois" && o[1]?.unidade === "ZZ",
      o,
    );
    checar(
      "reabertura entra no texto bruto",
      comporObservacaoAcompanhamento("revisar", "01/12/2026 09:00") === 'revisar ["Reabertura": "01/12/2026 09:00"]',
    );
    checar("sem reabertura so o texto", comporObservacaoAcompanhamento(" revisar ", null) === "revisar");
    checar("reabertura ida e volta", reaberturaParaCampo(reaberturaBrasileira("2026-12-01T09:00")) === "2026-12-01T09:00");
    checar(
      "atribuicao: troca",
      textoComAtribuicao("Processo aberto somente na unidade TESTE (atribuído para ana).", "bia") ===
        "Processo aberto somente na unidade TESTE (atribuído para bia).",
    );
    checar(
      "atribuicao: acrescenta antes do ponto final",
      textoComAtribuicao("Processo aberto somente na unidade TESTE.", "bia") ===
        "Processo aberto somente na unidade TESTE (atribuído para bia).",
    );
    checar(
      "atribuicao: remove",
      textoComAtribuicao("Processo aberto na unidade TESTE (atribuído para ana)", null) === "Processo aberto na unidade TESTE",
    );
    checar(
      "interessado em partes",
      JSON.stringify(partesDoInteressado("Maria Souza (CPF 1)")) === JSON.stringify(["Maria Souza", "CPF 1"]) &&
        partesDoInteressado("Empresa X").length === 1,
    );
  }

  secao("painéis habilitados");
  {
    const padrao = paineisHabilitados(null);
    checar(
      "padrao: descricao sempre e Bloco Interno desligado",
      padrao.has("descricao") && padrao.has("anotacoes") && !padrao.has("bloco_interno") && padrao.size === SELECAO_PADRAO.length + 1,
      [...padrao],
    );
    const so = paineisHabilitados(["Marcador", "Bloco Interno"]);
    checar(
      "personalizado: so o escolhido + descricao",
      so.has("marcador") && so.has("bloco_interno") && so.has("descricao") && !so.has("assuntos") && so.size === 3,
      [...so],
    );
    checar(
      "ordem final do legado",
      ORDEM_FINAL.join(",") ===
        "responsaveis,bloco_interno,marcador,acompanhamento_especial,descricao,tipo_procedimento,nivel_acesso,interessados,assuntos,observacoes",
    );
  }
}
