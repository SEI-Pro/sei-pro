/**
 * Sugestões de pedido, escolhidas pela tela que o usuário está vendo.
 *
 * O painel fica ao lado do SEI: sugerir "explique o documento na tela" para
 * quem está na caixa da unidade, sem documento nenhum aberto, é ruído. Aqui
 * cada sugestão diz em que contexto faz sentido (`cabe`), e o painel mostra as
 * primeiras que couberem — as mais específicas primeiro.
 *
 * REGRA: só entra sugestão que as ferramentas do agente sabem cumprir. Prometer
 * na tela o que o agente não faz é pior do que não sugerir nada.
 */

import type { TelaAtual } from "../motor/motor";

export interface Sugestao {
  rotulo: string;
  descricao: string;
  /** O pedido que vai para o agente. `t` é a tela, para citar processo e documento. */
  prompt: (t: TelaAtual) => string;
  cabe: (t: TelaAtual) => boolean;
}

const temProcesso = (t: TelaAtual) => Boolean(t.processo && !t.sigiloso);
const temDocumento = (t: TelaAtual) => Boolean(t.documento && !t.sigiloso);
const naCaixa = (t: TelaAtual) => t.acao === "procedimento_controlar" || t.acao === "procedimento_controlar_lista";
const naPesquisa = (t: TelaAtual) => t.acao === "protocolo_pesquisar" || t.acao === "pesquisa_protocolo_pesquisar";
const noEditor = (t: TelaAtual) => Boolean(t.editores?.length);
const proc = (t: TelaAtual) => t.processo?.protocolo ?? "o processo aberto";
const doc = (t: TelaAtual) => t.documento?.numero ?? "o documento aberto";

/**
 * Da mais específica para a mais geral: o painel percorre nesta ordem e para
 * quando enche a lista.
 */
export const SUGESTOES: Sugestao[] = [
  // ------------------------------------------------- janela do editor aberta
  {
    rotulo: "Revisar o que estou escrevendo",
    descricao: "portugu\u00EAs, clareza e o que falta",
    cabe: noEditor,
    prompt: () => "Leia o texto do documento aberto no editor e aponte erros de portugu\u00EAs, trechos amb\u00EDguos e o que falta para ele ficar completo. N\u00E3o altere nada ainda.",
  },
  {
    rotulo: "Escrever o fecho do documento",
    descricao: "no documento aberto no editor",
    cabe: noEditor,
    prompt: () => "Acrescente ao fim do documento aberto no editor um par\u00E1grafo de encerramento no padr\u00E3o da reda\u00E7\u00E3o oficial, coerente com o que j\u00E1 est\u00E1 escrito. N\u00E3o salve: eu confiro antes.",
  },

  // ------------------------------------------------------- documento na tela
  {
    rotulo: "Explicar em linguagem simples",
    descricao: "o documento que est\u00E1 na tela",
    cabe: temDocumento,
    prompt: (t) => `Explique em linguagem simples, para quem n\u00E3o \u00E9 da \u00E1rea, o documento ${doc(t)}.`,
  },
  {
    rotulo: "Resumir este documento",
    descricao: "decis\u00F5es, prazos e o que se pede",
    cabe: temDocumento,
    prompt: (t) => `Resuma o documento ${doc(t)} em at\u00E9 cinco linhas, destacando decis\u00F5es, prazos e o que est\u00E1 sendo pedido.`,
  },
  {
    rotulo: "Conferir a base legal citada",
    descricao: "normas e dispositivos do documento",
    cabe: temDocumento,
    prompt: (t) => `Liste as normas e os dispositivos citados no documento ${doc(t)} e diga, de cada um, para que ele foi usado no texto. Avise se algum parecer fora de contexto.`,
  },

  // ---------------------------------------------------------- processo aberto
  {
    rotulo: "Resumir este processo",
    descricao: "objeto, partes, atos e situa\u00E7\u00E3o",
    cabe: temProcesso,
    prompt: (t) => `Leia os documentos de ${proc(t)} e fa\u00E7a um resumo: objeto, partes, principais atos em ordem e situa\u00E7\u00E3o atual.`,
  },
  {
    rotulo: "Documentos sem assinatura",
    descricao: "o que ainda falta assinar aqui",
    cabe: temProcesso,
    prompt: (t) => `Em ${proc(t)}, quais documentos ainda n\u00E3o foram assinados e quem costuma assinar cada tipo?`,
  },
  {
    rotulo: "O que aconteceu at\u00E9 agora",
    descricao: "andamentos e onde o processo est\u00E1",
    cabe: temProcesso,
    prompt: (t) => `Liste os \u00FAltimos andamentos de ${proc(t)}, diga em que unidades ele est\u00E1 aberto e h\u00E1 quanto tempo est\u00E1 parado.`,
  },
  {
    rotulo: "Minutar um despacho",
    descricao: "rascunho para voc\u00EA revisar",
    cabe: temProcesso,
    prompt: (t) => `Crie em ${proc(t)} um Despacho encaminhando o processo, com texto curto no padr\u00E3o da reda\u00E7\u00E3o oficial e coerente com o que j\u00E1 h\u00E1 nos autos. N\u00E3o assine nem envie: eu confiro antes.`,
  },
  {
    rotulo: "Acompanhamento especial",
    descricao: "marcar para acompanhar de perto",
    cabe: temProcesso,
    prompt: (t) => `Coloque ${proc(t)} em acompanhamento especial, escolhendo o grupo da unidade que fizer sentido, com uma observa\u00E7\u00E3o dizendo o que estou esperando. Me pergunte se ficar em d\u00FAvida sobre o grupo.`,
  },
  {
    rotulo: "Marcar e anotar",
    descricao: "marcador e lembrete da unidade",
    cabe: temProcesso,
    prompt: (t) => `Marque ${proc(t)} com o marcador que melhor descreva a situa\u00E7\u00E3o dele e registre uma anota\u00E7\u00E3o curta com o que falta fazer.`,
  },
  {
    rotulo: "Procurar dados pessoais",
    descricao: "o que talvez devesse ser restrito",
    cabe: temProcesso,
    prompt: (t) => `Percorra os documentos de ${proc(t)} e aponte trechos com dados pessoais (CPF, endere\u00E7o, sa\u00FAde, filia\u00E7\u00E3o) que talvez pe\u00E7am n\u00EDvel de acesso restrito. S\u00F3 aponte: n\u00E3o altere nada.`,
  },

  // ------------------------------------------- processos marcados na listagem
  {
    rotulo: "Resumir os processos marcados",
    descricao: "um par\u00E1grafo de cada um",
    cabe: (t) => Boolean(t.selecionados?.length),
    prompt: (t) => `Fa\u00E7a um par\u00E1grafo sobre cada um dos processos que marquei na tela (${(t.selecionados ?? []).join(", ")}): do que trata e em que p\u00E9 est\u00E1.`,
  },
  {
    rotulo: "Marcar os processos selecionados",
    descricao: "mesmo marcador em todos",
    cabe: (t) => Boolean(t.selecionados?.length),
    prompt: (t) => `Aplique o mesmo marcador nos processos que marquei na tela (${(t.selecionados ?? []).join(", ")}) e me mostre a pr\u00E9via antes de aplicar.`,
  },

  // --------------------------------------------------------- caixa da unidade
  {
    rotulo: "Panorama da caixa",
    descricao: "quantos, de que tipo, o que chegou",
    cabe: naCaixa,
    prompt: () => "Fa\u00E7a um panorama da caixa da minha unidade: quantos processos recebidos e gerados, por tipo, e quais chegaram nos \u00FAltimos dias.",
  },
  {
    rotulo: "Pend\u00EAncias da unidade",
    descricao: "por marcador, com o que est\u00E1 parado",
    cabe: naCaixa,
    prompt: () => "Liste os processos da minha unidade agrupados por marcador e aponte os que parecem parados ou com prazo vencido.",
  },
  {
    rotulo: "O que est\u00E1 comigo",
    descricao: "processos atribu\u00EDdos a voc\u00EA",
    cabe: naCaixa,
    prompt: () => "Quais processos da caixa est\u00E3o atribu\u00EDdos a mim? Diga, de cada um, do que trata e o que parece faltar.",
  },
  {
    rotulo: "Processos sem dono",
    descricao: "recebidos e ainda n\u00E3o atribu\u00EDdos",
    cabe: naCaixa,
    prompt: () => "Liste os processos recebidos que ainda n\u00E3o t\u00EAm atribui\u00E7\u00E3o e diga, de cada um, o assunto e a urg\u00EAncia aparente.",
  },

  // ------------------------------------------------------------------- blocos
  {
    rotulo: "O que espera assinatura",
    descricao: "nos blocos da unidade",
    cabe: (t) => naCaixa(t) || /bloco/.test(t.acao ?? ""),
    prompt: () => "Liste os blocos de assinatura da unidade e, nos que ainda n\u00E3o foram conclu\u00EDdos, diga quais documentos est\u00E3o sem assinatura.",
  },
  {
    rotulo: "Blocos da unidade",
    descricao: "estado, grupo e a quem foi enviado",
    cabe: (t) => /bloco/.test(t.acao ?? ""),
    prompt: () => "Liste os blocos desta tela com estado, grupo, descri\u00E7\u00E3o e a quem foram disponibilizados, e diga quais parecem esquecidos.",
  },

  // ----------------------------------------------------------------- pesquisa
  {
    rotulo: "Pesquisar no \u00F3rg\u00E3o",
    descricao: "casos parecidos, com resumo",
    cabe: naPesquisa,
    prompt: () => "Pesquise no \u00F3rg\u00E3o processos sobre o assunto que eu disser e resuma os cinco mais recentes. Me pergunte o assunto.",
  },

  // ------------------------------------------------ vale em qualquer tela
  {
    rotulo: "Encontrar um processo",
    descricao: "busca pelo assunto, n\u00E3o pelo n\u00FAmero",
    cabe: () => true,
    prompt: () => "Quero achar um processo do qual s\u00F3 lembro o assunto. Me pergunte o que eu lembro e pesquise no \u00F3rg\u00E3o.",
  },
  {
    rotulo: "Consultar um processo",
    descricao: "informe o n\u00FAmero e veja o resumo",
    cabe: () => true,
    prompt: () => "Vou te passar um n\u00FAmero de processo: consulte, liste os documentos e me diga em que p\u00E9 est\u00E1. Me pergunte o n\u00FAmero.",
  },
  {
    rotulo: "O que voc\u00EA faz",
    descricao: "o que d\u00E1 para pedir ao agente",
    cabe: () => true,
    prompt: () => "O que voc\u00EA consegue fazer no SEI por mim? Responda em uma lista curta, separando o que voc\u00EA s\u00F3 consulta do que voc\u00EA altera com a minha aprova\u00E7\u00E3o.",
  },
];

/** As `quantas` primeiras sugestões que cabem na tela atual. */
export function sugestoesPara(tela: TelaAtual | null, quantas = 4): Array<{ rotulo: string; descricao: string; prompt: string }> {
  const t = tela ?? {};
  return SUGESTOES.filter((s) => s.cabe(t))
    .slice(0, quantas)
    .map((s) => ({ rotulo: s.rotulo, descricao: s.descricao, prompt: s.prompt(t) }));
}
