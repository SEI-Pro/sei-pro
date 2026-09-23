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
    descricao: "português, clareza e o que falta",
    cabe: noEditor,
    prompt: () => "Leia o texto do documento aberto no editor e aponte erros de português, trechos ambíguos e o que falta para ele ficar completo. Não altere nada ainda.",
  },
  {
    rotulo: "Escrever o fecho do documento",
    descricao: "no documento aberto no editor",
    cabe: noEditor,
    prompt: () => "Acrescente ao fim do documento aberto no editor um parágrafo de encerramento no padrão da redação oficial, coerente com o que já está escrito. Não salve: eu confiro antes.",
  },

  // ------------------------------------------------------- documento na tela
  {
    rotulo: "Explicar em linguagem simples",
    descricao: "o documento que está na tela",
    cabe: temDocumento,
    prompt: (t) => `Explique em linguagem simples, para quem não é da área, o documento ${doc(t)}.`,
  },
  {
    rotulo: "Resumir este documento",
    descricao: "decisões, prazos e o que se pede",
    cabe: temDocumento,
    prompt: (t) => `Resuma o documento ${doc(t)} em até cinco linhas, destacando decisões, prazos e o que está sendo pedido.`,
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
    descricao: "objeto, partes, atos e situação",
    cabe: temProcesso,
    prompt: (t) => `Leia os documentos de ${proc(t)} e faça um resumo: objeto, partes, principais atos em ordem e situação atual.`,
  },
  {
    rotulo: "Documentos sem assinatura",
    descricao: "o que ainda falta assinar aqui",
    cabe: temProcesso,
    prompt: (t) => `Em ${proc(t)}, quais documentos ainda não foram assinados e quem costuma assinar cada tipo?`,
  },
  {
    rotulo: "O que aconteceu até agora",
    descricao: "andamentos e onde o processo está",
    cabe: temProcesso,
    prompt: (t) => `Liste os últimos andamentos de ${proc(t)}, diga em que unidades ele está aberto e há quanto tempo está parado.`,
  },
  {
    rotulo: "Minutar um despacho",
    descricao: "rascunho para você revisar",
    cabe: temProcesso,
    prompt: (t) => `Crie em ${proc(t)} um Despacho encaminhando o processo, com texto curto no padrão da redação oficial e coerente com o que já há nos autos. Não assine nem envie: eu confiro antes.`,
  },
  {
    rotulo: "Acompanhamento especial",
    descricao: "marcar para acompanhar de perto",
    cabe: temProcesso,
    prompt: (t) => `Coloque ${proc(t)} em acompanhamento especial, escolhendo o grupo da unidade que fizer sentido, com uma observação dizendo o que estou esperando. Me pergunte se ficar em dúvida sobre o grupo.`,
  },
  {
    rotulo: "Marcar e anotar",
    descricao: "marcador e lembrete da unidade",
    cabe: temProcesso,
    prompt: (t) => `Marque ${proc(t)} com o marcador que melhor descreva a situação dele e registre uma anotação curta com o que falta fazer.`,
  },
  {
    rotulo: "Procurar dados pessoais",
    descricao: "o que talvez devesse ser restrito",
    cabe: temProcesso,
    prompt: (t) => `Percorra os documentos de ${proc(t)} e aponte trechos com dados pessoais (CPF, endereço, saúde, filiação) que talvez peçam nível de acesso restrito. Só aponte: não altere nada.`,
  },

  // ------------------------------------------- processos marcados na listagem
  {
    rotulo: "Resumir os processos marcados",
    descricao: "um parágrafo de cada um",
    cabe: (t) => Boolean(t.selecionados?.length),
    prompt: (t) => `Faça um parágrafo sobre cada um dos processos que marquei na tela (${(t.selecionados ?? []).join(", ")}): do que trata e em que pé está.`,
  },
  {
    rotulo: "Marcar os processos selecionados",
    descricao: "mesmo marcador em todos",
    cabe: (t) => Boolean(t.selecionados?.length),
    prompt: (t) => `Aplique o mesmo marcador nos processos que marquei na tela (${(t.selecionados ?? []).join(", ")}) e me mostre a prévia antes de aplicar.`,
  },

  // --------------------------------------------------------- caixa da unidade
  {
    rotulo: "Panorama da caixa",
    descricao: "quantos, de que tipo, o que chegou",
    cabe: naCaixa,
    prompt: () => "Faça um panorama da caixa da minha unidade: quantos processos recebidos e gerados, por tipo, e quais chegaram nos últimos dias.",
  },
  {
    rotulo: "Pendências da unidade",
    descricao: "por marcador, com o que está parado",
    cabe: naCaixa,
    prompt: () => "Liste os processos da minha unidade agrupados por marcador e aponte os que parecem parados ou com prazo vencido.",
  },
  {
    rotulo: "O que está comigo",
    descricao: "processos atribuídos a você",
    cabe: naCaixa,
    prompt: () => "Quais processos da caixa estão atribuídos a mim? Diga, de cada um, do que trata e o que parece faltar.",
  },
  {
    rotulo: "Processos sem dono",
    descricao: "recebidos e ainda não atribuídos",
    cabe: naCaixa,
    prompt: () => "Liste os processos recebidos que ainda não têm atribuição e diga, de cada um, o assunto e a urgência aparente.",
  },

  // ----------------------------------------------------------------- pesquisa
  {
    rotulo: "Pesquisar no órgão",
    descricao: "casos parecidos, com resumo",
    cabe: naPesquisa,
    prompt: () => "Pesquise no órgão processos sobre o assunto que eu disser e resuma os cinco mais recentes. Me pergunte o assunto.",
  },

  // ------------------------------------------------ vale em qualquer tela
  {
    rotulo: "Encontrar um processo",
    descricao: "busca pelo assunto, não pelo número",
    cabe: () => true,
    prompt: () => "Quero achar um processo do qual só lembro o assunto. Me pergunte o que eu lembro e pesquise no órgão.",
  },
  {
    rotulo: "Consultar um processo",
    descricao: "informe o número e veja o resumo",
    cabe: () => true,
    prompt: () => "Vou te passar um número de processo: consulte, liste os documentos e me diga em que pé está. Me pergunte o número.",
  },
  {
    rotulo: "O que você faz",
    descricao: "o que dá para pedir ao agente",
    cabe: () => true,
    prompt: () => "O que você consegue fazer no SEI por mim? Responda em uma lista curta, separando o que você só consulta do que você altera com a minha aprovação.",
  },
];

/** As `quantas` primeiras sugestões que cabem na tela atual. */
export function sugestoesPara(tela: TelaAtual | null, quantas = 4): Array<{ rotulo: string; descricao: string; prompt: string }> {
  const t = tela ?? {};
  return SUGESTOES.filter((s) => s.cabe(t))
    .slice(0, quantas)
    .map((s) => ({ rotulo: s.rotulo, descricao: s.descricao, prompt: s.prompt(t) }));
}
