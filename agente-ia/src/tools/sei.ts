/**
 * Tools do SEI (fase 1): consulta, alteração em lote de processos e documentos,
 * criação e edição de documentos.
 *
 * As DESCRIÇÕES são escritas para o modelo: dizem quando usar, quando não
 * usar e o que vem na resposta. O motor cuida de aprovação, anonimização e
 * reidratação; a tool só fala com a aba do SEI (`ctx.sei`).
 *
 * Escritas aceitam LISTAS de alvos: é isso que substitui as Ações em Lote.
 * Um item que falha não impede os outros (são independentes); a resposta
 * diz item a item o que aconteceu.
 */

import { s, type Esquema } from "../motor/esquema";
import { definirTool, type ContextoTool, type DefTool } from "../motor/tools";
import type { PreviaItem } from "../motor/tipos";
import { extrairTextoPdf } from "../painel/pdf";

type Args = Record<string, unknown>;

const PROCESSO = s.texto({ descricao: "N\u00FAmero do processo (protocolo), ex.: 50300.018905/2018-67." });
const PROCESSOS = s.lista(PROCESSO, { min: 1, max: 500, descricao: "Um ou mais processos." });
const DOCUMENTOS = s.lista(s.texto({ descricao: "N\u00BA SEI do documento, ex.: 0103947." }), { min: 1, max: 500 });
const NIVEL = s.texto({ enum: ["publico", "restrito"], descricao: "N\u00EDvel de acesso. Sigiloso n\u00E3o \u00E9 permitido ao agente." });

interface ResultadoEscrita {
  alvo: string;
  mudancas: PreviaItem["mudancas"];
  resumo: string;
  aplicado: boolean;
  dados?: Record<string, string>;
}

/** Monta uma tool de escrita que repete a mesma operação para cada alvo. */
function escritaEmLote(d: {
  nome: string;
  descricao: string;
  parametros: Esquema;
  op: string;
  alvos: (a: Args) => string[];
  argsOp: (a: Args, alvo: string, ctx: ContextoTool) => Args;
  rotulo: (a: Args) => string;
  efeito?: "escrita" | "irreversivel" | "assinatura";
}): DefTool {
  const rodar = async (a: Args, ctx: ContextoTool, aplicar: boolean) => {
    const saida: Array<ResultadoEscrita | { alvo: string; erro: string; codigo?: string }> = [];
    for (const alvo of d.alvos(a)) {
      if (ctx.sinal.aborted) break;
      try {
        saida.push(await ctx.sei<ResultadoEscrita>(d.op, { ...d.argsOp(a, alvo, ctx), aplicar }));
      } catch (e) {
        const x = e as { message?: string; codigo?: string };
        saida.push({ alvo, erro: x.message ?? String(e), codigo: x.codigo });
      }
    }
    return saida;
  };
  return definirTool({
    nome: d.nome,
    descricao: d.descricao,
    parametros: d.parametros,
    efeito: d.efeito ?? "escrita",
    rotulo: d.rotulo,
    previsualizar: async (a, ctx) =>
      (await rodar(a, ctx, false)).map((r) =>
        "erro" in r
          ? { alvo: r.alvo, mudancas: [], resumo: "", erro: r.erro }
          : { alvo: r.alvo, mudancas: r.mudancas, resumo: r.resumo, ...(r.dados?.cargos ? { cargos: r.dados.cargos.split("|").filter(Boolean) } : {}) },
      ),
    executar: async (a, ctx) => {
      const r = await rodar(a, ctx, true);
      const ok = r.filter((x) => !("erro" in x)).length;
      return { concluidos: ok, falhas: r.length - ok, itens: r.map((x) => ("erro" in x ? x : { alvo: x.alvo, ok: true, resumo: x.resumo, ...(x.dados ? { dados: x.dados } : {}) })) };
    },
  });
}

const qtd = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

// ---------------------------------------------------------------- leitura

let cacheCaixa: { quando: number; dados: { total: number; processos: Array<Record<string, unknown>> } } | null = null;

/** Editor alvo: o informado, ou o único aberto. Confere sigilo pelo núcleo (tela do SEI). */
async function editorAlvo(a: Args, ctx: ContextoTool): Promise<{ numero: string; nivel: string; titulo: string }> {
  const abertos = await ctx.sei<string[]>("editores");
  const numero = a.numero ? String(a.numero) : abertos.length === 1 ? abertos[0] : "";
  if (!numero) {
    throw Object.assign(new Error(abertos.length ? `H\u00E1 ${abertos.length} editores abertos (${abertos.join(", ")}): informe o n\u00FAmero.` : "Nenhum documento aberto no editor do SEI."), { codigo: "SEI_SEM_EDITOR" });
  }
  const meta = await ctx.sei<{ nivel: string; titulo: string }>("documento.ler", { numero, somenteMetadados: true });
  if (meta.nivel === "sigiloso") throw Object.assign(new Error("Documento sigiloso: o agente n\u00E3o atua nele."), { codigo: "SEI_SIGILOSO" });
  return { numero, nivel: meta.nivel, titulo: meta.titulo };
}

export const TOOLS_SEI: DefTool[] = [
  definirTool({
    nome: "contexto_tela",
    descricao:
      "O que o usu\u00E1rio est\u00E1 vendo agora no SEI: unidade, usu\u00E1rio, vers\u00E3o do SEI, processo aberto (protocolo, tipo, n\u00EDvel), documento em visualiza\u00E7\u00E3o e processos marcados na caixa. Use quando o pedido se refere a 'este processo', 'este documento' ou 'os processos selecionados'.",
    parametros: s.objeto({}),
    efeito: "leitura",
    rotulo: () => "Ler a tela do SEI",
    executar: (_a, ctx) => ctx.sei("tela"),
  }),

  definirTool({
    nome: "sei_opcoes",
    descricao:
      "Lista op\u00E7\u00F5es v\u00E1lidas do SEI para preencher outras ferramentas: tipos de processo, tipos de documento, hip\u00F3teses legais, usu\u00E1rios da unidade (para atribuir), marcadores da unidade e grupos de acompanhamento especial. Precisa de um processo aberto na unidade como refer\u00EAncia. Use antes de escrever quando n\u00E3o souber o nome exato de um tipo, hip\u00F3tese, marcador ou usu\u00E1rio.",
    parametros: s.objeto({
      lista: s.texto({ enum: ["tipos_processo", "tipos_documento", "hipoteses_legais", "usuarios", "marcadores", "grupos_acompanhamento"] }),
      processo: PROCESSO,
      "filtro?": s.texto({ descricao: "Parte do nome, sem acento ou caixa." }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Consultar ${String(a.lista).replace(/_/g, " ")}`,
    executar: (a, ctx) => ctx.sei("opcoes", a),
  }),

  definirTool({
    nome: "blocos_listar",
    descricao:
      "Blocos da unidade: de ASSINATURA (documentos juntados para assinar de uma vez ou enviados a outra unidade para assinar) e INTERNOS (processos que a unidade agrupou para trabalhar). Traz n\u00FAmero, estado (Gerado, Disponibilizado, Retornado, Conclu\u00EDdo), unidade geradora, a quem foi disponibilizado, grupo e descri\u00E7\u00E3o. Use para 'quais blocos tenho', 'o que est\u00E1 esperando assinatura', 'blocos disponibilizados para a minha unidade'.",
    parametros: s.objeto({
      "tipo?": s.texto({ enum: ["assinatura", "interno"], descricao: "Padr\u00E3o: assinatura." }),
      "filtro?": s.texto({ descricao: "Texto em n\u00FAmero, descri\u00E7\u00E3o, estado ou grupo (sem acento/caixa)." }),
      "concluidos?": s.booleano({ descricao: "Inclui os blocos conclu\u00EDdos, que o filtro do SEI esconde por padr\u00E3o." }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Listar blocos de ${a.tipo === "interno" ? "processos" : "assinatura"}`,
    executar: (a, ctx) => ctx.sei("blocos.listar", a),
  }),

  definirTool({
    nome: "bloco_conteudo",
    descricao:
      "O que h\u00E1 dentro de um bloco, pelo n\u00FAmero. Em bloco de ASSINATURA cada item \u00E9 um documento (processo, n\u00BA SEI, tipo, quem j\u00E1 assinou); em bloco INTERNO cada item \u00E9 um processo (sem documento e sem assinaturas). Use para saber o que falta assinar num bloco ou quais processos ele re\u00FAne. N\u00E3o assina nem altera nada.",
    parametros: s.objeto({
      bloco: s.texto({ descricao: "N\u00FAmero do bloco, como aparece na listagem." }),
      "tipo?": s.texto({ enum: ["assinatura", "interno"] }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Conte\u00FAdo do bloco ${a.bloco}`,
    executar: (a, ctx) => ctx.sei("bloco.conteudo", a),
  }),

  definirTool({
    nome: "bloco_incluir",
    descricao:
      "Inclui documentos num bloco de assinatura existente. Aceita documentos de processos diferentes (o agente percorre um processo por vez). Documento que j\u00E1 est\u00E1 no bloco fica de fora. Com `disponibilizar`, usa o bot\u00E3o Incluir e Disponibilizar, que manda o bloco \u00E0s unidades de destino \u2014 e a\u00ED outra unidade passa a ver os documentos.",
    parametros: s.objeto({
      bloco: s.texto({ descricao: "N\u00FAmero do bloco de assinatura." }),
      documentos: DOCUMENTOS,
      "disponibilizar?": s.booleano({ descricao: "Incluir e disponibilizar o bloco (padr\u00E3o: s\u00F3 incluir)." }),
    }),
    efeito: "escrita",
    rotulo: (a) => `Incluir ${qtd((a.documentos as string[]).length, "documento", "documentos")} no bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.incluir", { ...a, aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.incluir", { ...a, aplicar: true }),
  }),

  definirTool({
    nome: "bloco_retirar",
    descricao:
      "Retira documentos de um bloco de assinatura (ou processos de um bloco interno). N\u00E3o apaga nada do processo: s\u00F3 tira do bloco.",
    parametros: s.objeto({
      bloco: s.texto({ descricao: "N\u00FAmero do bloco." }),
      itens: s.lista(s.texto(), { descricao: "N\u00BA SEI dos documentos (bloco de assinatura) ou protocolos (bloco interno)." }),
    }),
    efeito: "escrita",
    rotulo: (a) => `Retirar ${qtd((a.itens as string[]).length, "item", "itens")} do bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.retirar", { ...a, aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.retirar", { ...a, aplicar: true }),
  }),

  definirTool({
    nome: "bloco_criar",
    descricao:
      "Cria um bloco de assinatura (para assinar v\u00E1rios documentos de uma vez) ou um bloco interno (para organizar processos na unidade). As unidades s\u00E3o para disponibiliza\u00E7\u00E3o e s\u00F3 valem no bloco de assinatura.",
    parametros: s.objeto({
      descricao: s.texto({ descricao: "Descri\u00E7\u00E3o do bloco." }),
      "tipo?": s.texto({ enum: ["assinatura", "interno"], descricao: "Tipo do bloco. Padr\u00E3o: assinatura." }),
      "unidades?": s.lista(s.texto(), { descricao: "Siglas das unidades para disponibiliza\u00E7\u00E3o (bloco de assinatura)." }),
      "grupo?": s.texto({ descricao: "Grupo de blocos da unidade, se houver." }),
    }),
    efeito: "escrita",
    rotulo: (a) => `Criar bloco ${a.tipo === "interno" ? "interno" : "de assinatura"}: ${a.descricao}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.criar", { ...a, aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.criar", { ...a, aplicar: true }),
  }),

  definirTool({
    nome: "bloco_disponibilizar",
    descricao:
      "Disponibiliza um bloco de assinatura para as unidades cadastradas nele (o bloco precisa estar gerado e ter unidades). Use bloco_concluir para fechar o bloco depois.",
    parametros: s.objeto({ bloco: s.texto({ descricao: "N\u00FAmero do bloco." }) }),
    efeito: "escrita",
    rotulo: (a) => `Disponibilizar o bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "disponibilizar", aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "disponibilizar", aplicar: true }),
  }),

  definirTool({
    nome: "bloco_cancelar_disponibilizacao",
    descricao: "Cancela a disponibiliza\u00E7\u00E3o de um bloco, trazendo-o de volta para a unidade que o gerou.",
    parametros: s.objeto({ bloco: s.texto({ descricao: "N\u00FAmero do bloco." }) }),
    efeito: "escrita",
    rotulo: (a) => `Cancelar a disponibiliza\u00E7\u00E3o do bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "cancelar", aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "cancelar", aplicar: true }),
  }),

  definirTool({
    nome: "bloco_retornar",
    descricao: "Devolve \u00E0 unidade de origem um bloco que foi disponibilizado para a sua unidade.",
    parametros: s.objeto({ bloco: s.texto({ descricao: "N\u00FAmero do bloco." }) }),
    efeito: "escrita",
    rotulo: (a) => `Retornar o bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "retornar", aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "retornar", aplicar: true }),
  }),

  definirTool({
    nome: "bloco_concluir",
    descricao: "Conclui um bloco (assinatura ou interno). Bloco conclu\u00EDdo sai da lista de trabalho da unidade e pode ser reaberto.",
    parametros: s.objeto({ bloco: s.texto({ descricao: "N\u00FAmero do bloco." }) }),
    efeito: "escrita",
    rotulo: (a) => `Concluir o bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "concluir", aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "concluir", aplicar: true }),
  }),

  definirTool({
    nome: "bloco_reabrir",
    descricao:
      "Reabre um bloco conclu\u00EDdo, devolvendo-o ao estado gerado: ele volta para a lista de blocos da unidade e aceita de novo inclus\u00E3o, assinatura e disponibiliza\u00E7\u00E3o.",
    parametros: s.objeto({ bloco: s.texto({ descricao: "N\u00FAmero do bloco." }) }),
    efeito: "escrita",
    rotulo: (a) => `Reabrir o bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "reabrir", aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.mudar", { ...a, acao: "reabrir", aplicar: true }),
  }),

  definirTool({
    nome: "bloco_assinar",
    descricao:
      "Assina de uma vez os documentos de um bloco de assinatura \u2014 o que a tela faz com o bot\u00E3o Assinar depois de marcar as caixas. Sem `documentos`, assina todos os do bloco que ainda faltam a sua assinatura. Quem voc\u00EA j\u00E1 assinou fica de fora. Cargo e senha do SEI s\u00E3o pedidos ao usu\u00E1rio no cart\u00E3o de aprova\u00E7\u00E3o: NUNCA invente nem pe\u00E7a senha no chat.",
    parametros: s.objeto({
      bloco: s.texto({ descricao: "N\u00FAmero do bloco de assinatura." }),
      "documentos?": s.lista(s.texto(), { descricao: "N\u00BA SEI dos documentos a assinar. Vazio = todos os pendentes do bloco." }),
    }),
    efeito: "assinatura",
    rotulo: (a) => `Assinar o bloco ${a.bloco}`,
    previsualizar: (a, ctx) => ctx.sei("bloco.assinar", { ...a, aplicar: false }),
    executar: (a, ctx) => ctx.sei("bloco.assinar", { ...a, aplicar: true, ...(ctx.assinatura ?? {}) }),
  }),

  definirTool({
    nome: "processos_listar",
    descricao:
      "Processos abertos na unidade (caixa do Controle de Processos), com tipo, especifica\u00E7\u00E3o, atribui\u00E7\u00E3o, marcadores e anota\u00E7\u00F5es. Filtra, agrupa e conta sem abrir cada processo. Use para 'quantos processos', 'quais est\u00E3o atribu\u00EDdos a X', 'processos do tipo Y', 'com marcador Z'. Sigilosos aparecem s\u00F3 pelo n\u00FAmero.",
    parametros: s.objeto({
      "filtro?": s.texto({ descricao: "Texto em tipo, especifica\u00E7\u00E3o, marcador ou anota\u00E7\u00E3o (sem acento/caixa)." }),
      "grupo?": s.texto({ enum: ["recebidos", "gerados"] }),
      "atribuido_a?": s.texto({ descricao: "Sigla do usu\u00E1rio; use '-' para n\u00E3o atribu\u00EDdos." }),
      "apenas_novos?": s.booleano({ descricao: "S\u00F3 os ainda n\u00E3o visualizados na unidade." }),
      "agrupar_por?": s.texto({ enum: ["tipo", "atribuido", "marcador", "grupo"], descricao: "Devolve contagens por grupo em vez da lista." }),
      "limite?": s.inteiro({ min: 1, max: 500, descricao: "Itens por p\u00E1gina (padr\u00E3o 100)." }),
      "pagina?": s.inteiro({ min: 1 }),
      "atualizar?": s.booleano({ descricao: "Ignorar o cache de 2 minutos." }),
    }),
    efeito: "leitura",
    rotulo: () => "Listar processos da unidade",
    executar: async (a, ctx) => {
      if (!cacheCaixa || a.atualizar === true || Date.now() - cacheCaixa.quando > 120_000) {
        cacheCaixa = { quando: Date.now(), dados: await ctx.sei("caixa.listar", {}) };
      }
      const norm = (x: unknown) => String(x ?? "").normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase();
      let lista = cacheCaixa.dados.processos;
      if (a.grupo) lista = lista.filter((p) => p.grupo === a.grupo);
      if (a.apenas_novos) lista = lista.filter((p) => p.novo);
      if (a.atribuido_a) lista = lista.filter((p) => (a.atribuido_a === "-" ? !p.atribuido : norm(p.atribuido) === norm(a.atribuido_a)));
      if (a.filtro) {
        const f = norm(a.filtro);
        lista = lista.filter((p) => norm([p.tipo, p.especificacao, ...((p.sinais as string[]) ?? [])].join(" ")).includes(f));
      }
      if (a.agrupar_por) {
        const cont = new Map<string, number>();
        for (const p of lista) {
          const chaves =
            a.agrupar_por === "marcador"
              ? ((p.sinais as string[]) ?? []).filter((x) => x.startsWith("Marcador")).map((x) => x.replace(/^Marcador \/ /, "")) || []
              : [String((a.agrupar_por === "atribuido" ? p.atribuido : a.agrupar_por === "grupo" ? p.grupo : p.tipo) || "(nenhum)")];
          for (const k of chaves.length ? chaves : ["(nenhum)"]) cont.set(k, (cont.get(k) ?? 0) + 1);
        }
        return { total: lista.length, grupos: [...cont].sort((x, y) => y[1] - x[1]).map(([nome, quantidade]) => ({ nome, quantidade })) };
      }
      const limite = Number(a.limite ?? 100);
      const pagina = Number(a.pagina ?? 1);
      return { total: lista.length, pagina, paginas: Math.ceil(lista.length / limite), processos: lista.slice((pagina - 1) * limite, pagina * limite) };
    },
  }),

  definirTool({
    nome: "processos_pesquisar",
    descricao:
      "Pesquisa do SEI em todo o \u00F3rg\u00E3o (n\u00E3o s\u00F3 a caixa da unidade), com as permiss\u00F5es do usu\u00E1rio: palavras-chave no conte\u00FAdo, especifica\u00E7\u00E3o, tipo de processo, tipo de documento, n\u00FAmero, per\u00EDodo (dd/mm/aaaa). Devolve protocolo, tipo, n\u00BA SEI do documento (se em=documentos), unidade, usu\u00E1rio e data. O trecho do conte\u00FAdo s\u00F3 vem com com_trecho=true (pede autoriza\u00E7\u00E3o para conte\u00FAdo restrito).",
    parametros: s.objeto({
      "texto?": s.texto({ descricao: "Palavras-chave (aceita e, ou, n\u00E3o, aspas)." }),
      "em?": s.texto({ enum: ["processos", "documentos"] }),
      "especificacao?": s.texto(),
      "tipo_processo?": s.texto(),
      "tipo_documento?": s.texto(),
      "numero_documento?": s.texto(),
      "data_inicio?": s.texto(),
      "data_fim?": s.texto(),
      "limite?": s.inteiro({ min: 1, max: 200, descricao: "Padr\u00E3o 50." }),
      "com_trecho?": s.booleano(),
    }),
    efeito: "leitura",
    rotulo: (a) => `Pesquisar no SEI${a.texto ? `: ${a.texto}` : ""}`,
    executar: async (a, ctx) => {
      const r = await ctx.sei<{ total: number; resultados: Array<Record<string, unknown>> }>("pesquisar", a);
      const comTrecho = a.com_trecho === true && (await ctx.consentirRestrito("Trechos de documentos nos resultados da pesquisa"));
      return { total: r.total, resultados: r.resultados.map(({ trecho, ...x }) => (comTrecho ? { ...x, trecho } : x)) };
    },
  }),

  definirTool({
    nome: "processo_consultar",
    descricao:
      "Metadados de um processo: tipo, especifica\u00E7\u00E3o, assuntos, interessados, observa\u00E7\u00F5es da unidade, n\u00EDvel de acesso, marcadores, se est\u00E1 aberto na unidade (editavel) e quantos documentos tem.",
    parametros: s.objeto({ processo: PROCESSO }),
    efeito: "leitura",
    rotulo: (a) => `Consultar ${a.processo}`,
    executar: async (a, ctx) => {
      const p = await ctx.sei<{ interessados: string[] }>("processo.consultar", a);
      ctx.pessoasVistas(p.interessados ?? []);
      return p;
    },
  }),

  definirTool({
    nome: "processo_historico",
    descricao:
      "Andamentos (hist\u00F3rico) do processo, do mais recente para o mais antigo: data, unidade, usu\u00E1rio e descri\u00E7\u00E3o. 'resumido' \u00E9 o padr\u00E3o do SEI; 'completo' inclui tudo da unidade; 'total' inclui todas as unidades.",
    parametros: s.objeto({
      processo: PROCESSO,
      "tipo?": s.texto({ enum: ["resumido", "completo", "total"] }),
      "limite?": s.inteiro({ min: 1, max: 1000 }),
      "filtro?": s.texto({ descricao: "S\u00F3 andamentos cuja descri\u00E7\u00E3o contenha este texto." }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Hist\u00F3rico de ${a.processo}`,
    executar: async (a, ctx) => {
      const r = await ctx.sei<{ protocolo: string; total: number; andamentos: Array<{ descricao: string }> }>("processo.historico", a);
      if (!a.filtro) return r;
      const f = String(a.filtro).toLowerCase();
      return { ...r, andamentos: r.andamentos.filter((x) => x.descricao.toLowerCase().includes(f)) };
    },
  }),

  definirTool({
    nome: "documentos_listar",
    descricao:
      "Documentos do processo (\u00E1rvore completa, todas as pastas): n\u00BA SEI, t\u00EDtulo, formato (interno, pdf...), externo, n\u00EDvel de acesso, assinado e por quem. Use antes de ler ou alterar documentos para obter os n\u00FAmeros.",
    parametros: s.objeto({
      processo: PROCESSO,
      "filtro?": s.texto({ descricao: "Parte do t\u00EDtulo (sem acento/caixa)." }),
      "nivel?": s.texto({ enum: ["publico", "restrito"] }),
      "assinado?": s.booleano(),
    }),
    efeito: "leitura",
    rotulo: (a) => `Documentos de ${a.processo}`,
    executar: async (a, ctx) => {
      const r = await ctx.sei<{ documentos: Array<Record<string, unknown>> }>("processo.arvore", { processo: a.processo });
      const norm = (x: unknown) => String(x ?? "").normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase();
      let docs = r.documentos;
      if (a.filtro) docs = docs.filter((d) => norm(d.titulo).includes(norm(a.filtro)));
      if (a.nivel) docs = docs.filter((d) => d.nivel === a.nivel);
      if (a.assinado !== undefined) docs = docs.filter((d) => Boolean(d.assinado) === a.assinado);
      return { ...r, documentos: docs, filtrados: docs.length };
    },
  }),

  definirTool({
    nome: "documento_ler",
    descricao:
      "Conte\u00FAdo de documentos em texto (documento do editor do SEI, PDF com texto, arquivos de texto). Documento restrito pede consentimento ao usu\u00E1rio uma vez por conversa. PDF digitalizado sem camada de texto volta sem texto. Use 'inicio' para continuar um texto longo.",
    parametros: s.objeto({
      documentos: s.lista(s.texto(), { min: 1, max: 20, descricao: "N\u00BA SEI dos documentos." }),
      "inicio?": s.inteiro({ min: 0, descricao: "Posi\u00E7\u00E3o (em caracteres) para continuar a leitura." }),
      "tamanho?": s.inteiro({ min: 500, max: 60000, descricao: "Caracteres por documento (padr\u00E3o 12000)." }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Ler ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
    executar: async (a, ctx) => {
      const inicio = Number(a.inicio ?? 0);
      const tamanho = Number(a.tamanho ?? 12000);
      const saida = [];
      for (const numero of a.documentos as string[]) {
        try {
          const meta = await ctx.sei<Record<string, unknown>>("documento.ler", { numero, somenteMetadados: true });
          if (meta.nivel === "restrito" && !(await ctx.consentirRestrito(`Documento ${meta.numero} (${meta.titulo}), processo ${meta.processo}`))) {
            saida.push({ ...meta, erro: "Conte\u00FAdo restrito: o usu\u00E1rio n\u00E3o autorizou o envio ao modelo nesta conversa.", codigo: "CONTEUDO_RESTRITO_NAO_AUTORIZADO" });
            continue;
          }
          const r = await ctx.sei<Record<string, unknown> & { conteudo: { forma: string; texto?: string; base64?: string; tipo?: string } }>("documento.ler", { numero });
          let texto = r.conteudo.texto ?? "";
          if (r.conteudo.forma === "arquivo" && r.conteudo.tipo === "application/pdf" && r.conteudo.base64) texto = await extrairTextoPdf(r.conteudo.base64);
          else if (r.conteudo.forma === "arquivo") texto = `[arquivo ${r.conteudo.tipo}: sem extra\u00E7\u00E3o de texto nesta vers\u00E3o]`;
          else if (r.conteudo.forma === "grande") texto = "[arquivo grande demais para ler]";
          const { conteudo: _c, ...m } = r;
          saida.push({ ...m, total_caracteres: texto.length, inicio, texto: texto.slice(inicio, inicio + tamanho), ...(inicio + tamanho < texto.length ? { continua_em: inicio + tamanho } : {}) });
        } catch (e) {
          const x = e as { message?: string; codigo?: string };
          saida.push({ numero, erro: x.message, codigo: x.codigo });
        }
      }
      return saida;
    },
  }),

  definirTool({
    nome: "editor_ler",
    descricao:
      "L\u00EA o documento que o usu\u00E1rio est\u00E1 editando AGORA na janela do editor do SEI (inclusive o que ainda n\u00E3o foi salvo) e o texto selecionado. Use quando ele disser 'este texto', 'o que estou escrevendo', 'o trecho selecionado'.",
    parametros: s.objeto({ "numero?": s.texto({ descricao: "N\u00BA SEI do documento aberto; opcional se houver um editor s\u00F3." }), "secao?": s.texto() }),
    efeito: "leitura",
    rotulo: () => "Ler o editor aberto",
    executar: async (a, ctx) => {
      const alvo = await editorAlvo(a, ctx);
      if (alvo.nivel === "restrito" && !(await ctx.consentirRestrito(`Documento ${alvo.numero} aberto no editor`))) {
        return { erro: "Conte\u00FAdo restrito: o usu\u00E1rio n\u00E3o autorizou o envio ao modelo nesta conversa.", codigo: "CONTEUDO_RESTRITO_NAO_AUTORIZADO" };
      }
      const r = await ctx.sei<{ editor: string; secao: string; html: string; selecao: string }>("editor.ler", { numero: alvo.numero, secao: a.secao });
      const texto = r.html.replace(/<\/(p|div|li|tr|h\d)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\n{3,}/g, "\n\n").trim();
      return { numero: alvo.numero, secao: r.secao, texto, html: r.html.slice(0, 20000), selecionado: r.selecao };
    },
  }),

  definirTool({
    nome: "editor_escrever",
    descricao:
      "Escreve no documento aberto na janela do editor do SEI, SEM salvar: o usu\u00E1rio v\u00EA, pode desfazer (Ctrl+Z) e salva quando quiser. modo: 'cursor' (onde est\u00E1 o cursor), 'fim' (fim da se\u00E7\u00E3o) ou 'substituir' (troca a se\u00E7\u00E3o inteira). HTML com as classes de estilo do SEI (skill redacao-oficial).",
    parametros: s.objeto({
      html: s.texto({ min: 1 }),
      "modo?": s.texto({ enum: ["cursor", "fim", "substituir"] }),
      "numero?": s.texto(),
      "secao?": s.texto(),
    }),
    efeito: "escrita",
    rotulo: (a) => `Escrever no editor (${a.modo ?? "cursor"})`,
    previsualizar: async (a, ctx) => {
      try {
        const alvo = await editorAlvo(a, ctx);
        const texto = String(a.html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        return [{ alvo: alvo.numero, mudancas: [{ campo: `Editor aberto (${a.modo ?? "cursor"}, sem salvar)`, antes: "", depois: texto.slice(0, 500) }], resumo: "" }];
      } catch (e) {
        return [{ alvo: String(a.numero ?? "editor"), mudancas: [], resumo: "", erro: (e as Error).message }];
      }
    },
    executar: async (a, ctx) => {
      const alvo = await editorAlvo(a, ctx);
      const r = await ctx.sei<{ resultado: string }>("editor.escrever", { numero: alvo.numero, html: a.html, modo: a.modo ?? "cursor", secao: a.secao });
      return { numero: alvo.numero, ok: true, resultado: r.resultado, aviso: "O texto est\u00E1 no editor, ainda N\u00C3O salvo. O usu\u00E1rio salva quando quiser." };
    },
  }),

  // ---------------------------------------------------------------- escrita

  escritaEmLote({
    nome: "processo_alterar",
    descricao:
      "Altera metadados de um ou mais processos abertos na unidade: especifica\u00E7\u00E3o, tipo, n\u00EDvel de acesso (publico/restrito, restrito exige hip\u00F3tese legal), observa\u00E7\u00F5es da unidade. S\u00F3 os campos informados mudam. Requer aprova\u00E7\u00E3o do usu\u00E1rio (plano).",
    parametros: s.objeto({
      processos: PROCESSOS,
      "especificacao?": s.texto({ max: 100 }),
      "tipo?": s.texto({ descricao: "Nome do tipo de processo (ver sei_opcoes)." }),
      "nivel?": NIVEL,
      "hipotese?": s.texto({ descricao: "Nome da hip\u00F3tese legal (ver sei_opcoes)." }),
      "observacoes?": s.texto(),
    }),
    op: "processo.alterar",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => {
      const { processos: _p, ...alteracao } = a;
      return { processo: alvo, alteracao };
    },
    rotulo: (a) => `Alterar ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_marcador",
    descricao:
      "Adiciona (ou atualiza o texto de) um marcador da unidade em processos, ou remove com remover=true. Para prazo, escreva no texto 'At\u00E9 DD/MM/AAAA'. O marcador precisa existir na unidade (ver sei_opcoes lista=marcadores).",
    parametros: s.objeto({ processos: PROCESSOS, marcador: s.texto(), "texto?": s.texto({ max: 250 }), "remover?": s.booleano() }),
    op: "processo.marcador",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, marcador: a.marcador, texto: a.texto, remover: a.remover }),
    rotulo: (a) => `${a.remover ? "Remover" : "Aplicar"} marcador "${a.marcador}" em ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_anotacao",
    descricao: "Define a anota\u00E7\u00E3o da unidade em processos (substitui a atual). Texto vazio remove a anota\u00E7\u00E3o. At\u00E9 500 caracteres.",
    parametros: s.objeto({ processos: PROCESSOS, texto: s.texto({ max: 500 }), "prioridade?": s.booleano() }),
    op: "processo.anotacao",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, texto: a.texto, prioridade: a.prioridade }),
    rotulo: (a) => `${a.texto ? "Anotar" : "Remover anota\u00E7\u00E3o de"} ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_andamento",
    descricao: "Registra um andamento ('Atualizar Andamento') no hist\u00F3rico de processos. Fica permanente no hist\u00F3rico.",
    parametros: s.objeto({ processos: PROCESSOS, texto: s.texto({ min: 3, max: 4000 }) }),
    op: "processo.andamento",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, texto: a.texto }),
    rotulo: (a) => `Registrar andamento em ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_atribuir",
    descricao: "Atribui processos a um usu\u00E1rio da unidade (sigla, nome ou parte do nome; ver sei_opcoes lista=usuarios). Sem 'usuario', remove a atribui\u00E7\u00E3o.",
    parametros: s.objeto({ processos: PROCESSOS, "usuario?": s.texto() }),
    op: "processo.atribuir",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, usuario: a.usuario ?? null }),
    rotulo: (a) => (a.usuario ? `Atribuir ${qtd((a.processos as string[]).length, "processo", "processos")} a ${a.usuario}` : `Remover atribui\u00E7\u00E3o de ${qtd((a.processos as string[]).length, "processo", "processos")}`),
  }),

  escritaEmLote({
    nome: "processo_acompanhamento",
    descricao: "Inclui processos no acompanhamento especial da unidade (ou altera grupo/observa\u00E7\u00E3o se j\u00E1 estiverem).",
    parametros: s.objeto({ processos: PROCESSOS, "grupo?": s.texto(), "observacao?": s.texto({ max: 500 }) }),
    op: "processo.acompanhamento",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, grupo: a.grupo, observacao: a.observacao }),
    rotulo: (a) => `Acompanhamento especial em ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_concluir",
    descricao:
      "Conclui processos na unidade (somem da caixa). Opcional: reabertura programada em 'reabrir_em' (data dd/mm/aaaa ou n\u00FAmero de dias). Revers\u00EDvel com processo_reabrir.",
    parametros: s.objeto({ processos: PROCESSOS, "reabrir_em?": s.texto({ descricao: "dd/mm/aaaa ou n\u00FAmero de dias." }) }),
    op: "processo.concluir",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, reabrir_em: a.reabrir_em }),
    rotulo: (a) => `Concluir ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_reabrir",
    descricao: "Reabre na unidade processos conclu\u00EDdos que tramitaram por ela.",
    parametros: s.objeto({ processos: PROCESSOS }),
    op: "processo.reabrir",
    alvos: (a) => a.processos as string[],
    argsOp: (_a, alvo) => ({ processo: alvo }),
    rotulo: (a) => `Reabrir ${qtd((a.processos as string[]).length, "processo", "processos")}`,
  }),

  escritaEmLote({
    nome: "processo_enviar",
    descricao:
      "Envia (tramita) processos para uma ou mais unidades, pela sigla exata (ex.: 'SEGES/DIAP'). Sigla amb\u00EDgua ou inexistente volta como erro com as candidatas: pergunte ao usu\u00E1rio, nunca escolha por conta pr\u00F3pria. Op\u00E7\u00F5es: manter aberto na unidade, remover anota\u00E7\u00E3o, e-mail de notifica\u00E7\u00E3o, retorno programado (data dd/mm/aaaa ou dias). Irrevers\u00EDvel para a unidade: o usu\u00E1rio confirma no cart\u00E3o.",
    parametros: s.objeto({
      processos: PROCESSOS,
      unidades: s.lista(s.texto({ descricao: "Sigla da unidade de destino." }), { min: 1, max: 20 }),
      "manter_aberto?": s.booleano(),
      "remover_anotacao?": s.booleano(),
      "enviar_email?": s.booleano(),
      "retorno_em?": s.texto({ descricao: "dd/mm/aaaa ou n\u00FAmero de dias." }),
    }),
    op: "processo.enviar",
    efeito: "irreversivel",
    alvos: (a) => a.processos as string[],
    argsOp: (a, alvo) => ({ processo: alvo, unidades: a.unidades, manter_aberto: a.manter_aberto, remover_anotacao: a.remover_anotacao, enviar_email: a.enviar_email, retorno_em: a.retorno_em }),
    rotulo: (a) => `Enviar ${qtd((a.processos as string[]).length, "processo", "processos")} para ${(a.unidades as string[]).join(", ")}`,
  }),

  escritaEmLote({
    nome: "documento_assinar",
    descricao:
      "Assina documentos como o usu\u00E1rio. Cargo e SENHA s\u00E3o pedidos pelo pr\u00F3prio cart\u00E3o de aprova\u00E7\u00E3o, fora da conversa: NUNCA pe\u00E7a a senha ao usu\u00E1rio nem a coloque em argumentos. Documento j\u00E1 assinado pelo usu\u00E1rio \u00E9 ignorado.",
    parametros: s.objeto({ documentos: DOCUMENTOS }),
    op: "documento.assinar",
    efeito: "assinatura",
    alvos: (a) => a.documentos as string[],
    argsOp: (_a, alvo, ctx) => ({ numero: alvo, cargo: ctx.assinatura?.cargo, senha: ctx.assinatura?.senha }),
    rotulo: (a) => `Assinar ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
  }),

  escritaEmLote({
    nome: "documento_excluir",
    descricao:
      "Exclui documentos que o SEI ainda deixa excluir (em geral: gerados na unidade e processo ainda n\u00E3o tramitado depois deles). Se o SEI s\u00F3 oferecer 'Cancelar Documento', use documento_cancelar. Irrevers\u00EDvel.",
    parametros: s.objeto({ documentos: DOCUMENTOS }),
    op: "documento.excluir",
    efeito: "irreversivel",
    alvos: (a) => a.documentos as string[],
    argsOp: (_a, alvo) => ({ numero: alvo }),
    rotulo: (a) => `Excluir ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
  }),

  escritaEmLote({
    nome: "documento_cancelar",
    descricao:
      "Cancela documentos com motivo (o documento fica na \u00E1rvore marcado como cancelado). \u00C9 o que o SEI oferece no lugar de excluir depois que o processo tramitou. Irrevers\u00EDvel.",
    parametros: s.objeto({ documentos: DOCUMENTOS, motivo: s.texto({ min: 3, max: 500 }) }),
    op: "documento.cancelar",
    efeito: "irreversivel",
    alvos: (a) => a.documentos as string[],
    argsOp: (a, alvo) => ({ numero: alvo, motivo: a.motivo }),
    rotulo: (a) => `Cancelar ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
  }),

  escritaEmLote({
    nome: "documento_cancelar_assinatura",
    descricao:
      "Cancela as assinaturas de documentos internos que o usu\u00E1rio ainda pode editar (o documento volta a precisar de assinatura). Use antes de documento_editar em documento assinado. Irrevers\u00EDvel.",
    parametros: s.objeto({ documentos: DOCUMENTOS }),
    op: "documento.cancelarAssinatura",
    efeito: "irreversivel",
    alvos: (a) => a.documentos as string[],
    argsOp: (_a, alvo) => ({ numero: alvo }),
    rotulo: (a) => `Cancelar assinaturas de ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
  }),

  escritaEmLote({
    nome: "documento_ciencia",
    descricao: "D\u00E1 ci\u00EAncia em documentos (fica no hist\u00F3rico). Para ci\u00EAncia no processo inteiro, informe o protocolo em 'processos'.",
    parametros: s.objeto({ "documentos?": s.lista(s.texto(), { max: 500 }), "processos?": s.lista(PROCESSO, { max: 500 }) }),
    op: "ciencia",
    alvos: (a) => [...((a.documentos as string[]) ?? []), ...((a.processos as string[]) ?? []).map((p) => `P:${p}`)],
    argsOp: (_a, alvo) => (alvo.startsWith("P:") ? { alvo: alvo.slice(2), processo: true } : { alvo }),
    rotulo: (a) => `Dar ci\u00EAncia em ${qtd(((a.documentos as string[]) ?? []).length + ((a.processos as string[]) ?? []).length, "item", "itens")}`,
  }),

  escritaEmLote({
    nome: "documento_alterar",
    descricao:
      "Altera metadados de documentos: descri\u00E7\u00E3o, n\u00EDvel de acesso (publico/restrito; restrito exige hip\u00F3tese legal). \u00C9 o 'alterar sigilo em lote'. N\u00E3o mexe no conte\u00FAdo.",
    parametros: s.objeto({ documentos: DOCUMENTOS, "descricao?": s.texto({ max: 250 }), "nivel?": NIVEL, "hipotese?": s.texto() }),
    op: "documento.alterar",
    alvos: (a) => a.documentos as string[],
    argsOp: (a, alvo) => {
      const { documentos: _d, ...alteracao } = a;
      return { numero: alvo, alteracao };
    },
    rotulo: (a) => `Alterar ${qtd((a.documentos as string[]).length, "documento", "documentos")}${a.nivel ? ` para ${a.nivel}` : ""}`,
  }),

  definirTool({
    nome: "documento_estilos",
    descricao:
      "Catálogo dos estilos de parágrafo que o editor oferece NESTE documento, seção a seção, NESTE órgão. Use ANTES de escrever conteúdo com documento_editar: o conjunto de estilos é configurado por órgão e por seção, e o SEI IGNORA EM SILÊNCIO a classe que não existe — o documento sai sem formatação e ninguém vê erro. Escreva só com as classes que esta ferramenta devolver. (documento_criar já devolve o catálogo do documento que acabou de criar: nesse caso não precisa chamar de novo.) Abre o editor do documento para ler a configuração.",
    parametros: s.objeto({ numero: s.texto({ descricao: "Nº SEI do documento." }) }),
    efeito: "leitura",
    rotulo: (a) => `Estilos disponíveis em ${String(a.numero)}`,
    executar: (a, ctx) => ctx.sei("documento.estilos", a),
  }),

  definirTool({
    nome: "documentos_similares",
    descricao:
      "Procura documentos do MESMO TIPO já existentes no órgão, para o agente aprender a estrutura e a linguagem antes de escrever. Prioriza os do mesmo tipo de processo e os gerados pelo próprio usuário. Devolve só a lista; para ver o texto, leia um ou dois com documento_ler. PERGUNTE AO USUÁRIO (ferramenta perguntar) antes de usar: a busca varre o órgão e abre documentos de outras unidades.",
    parametros: s.objeto({
      tipo_documento: s.texto({ descricao: "Nome do tipo (Despacho, Ofício, Nota Técnica...)." }),
      "tipo_processo?": s.texto({ descricao: "Tipo do processo em que o documento vai entrar; prioriza os semelhantes." }),
      "excluir_processo?": s.texto({ descricao: "Protocolo do processo em que você vai escrever, para não se citar." }),
      "limite?": s.inteiro({ min: 1, max: 20, descricao: "Padrão 6." }),
    }),
    efeito: "leitura",
    rotulo: (a) => `Procurar ${String(a.tipo_documento)} parecidos`,
    executar: (a, ctx) => ctx.sei("documentos.similares", a),
  }),

  definirTool({
    nome: "documento_criar",
    descricao:
      "Cria documentos internos (Despacho, Of\u00EDcio, Nota T\u00E9cnica...) em processos abertos na unidade, j\u00E1 com o conte\u00FAdo do corpo em HTML do SEI (ver skill 'redacao-oficial'). Aceita v\u00E1rios itens: \u00E9 o 'documentos em lote'. Devolve o n\u00BA SEI de cada documento criado E o cat\u00E1logo de estilos do editor daquele documento (campo `estilos`), que \u00E9 o que voc\u00EA deve usar ao escrever o conte\u00FAdo com documento_editar. Nunca assina.",
    parametros: s.objeto({
      itens: s.lista(
        s.objeto({
          processo: PROCESSO,
          tipo: s.texto({ descricao: "Nome do tipo de documento (ver sei_opcoes lista=tipos_documento)." }),
          "descricao?": s.texto({ max: 250 }),
          "numero?": s.texto({ descricao: "N\u00FAmero, para tipos numerados pelo usu\u00E1rio." }),
          "nome_arvore?": s.texto({ max: 50 }),
          "nivel?": NIVEL,
          "hipotese?": s.texto(),
          "conteudo_html?": s.texto({ descricao: "Corpo do documento em par\u00E1grafos HTML. Use s\u00F3 as classes que documento_estilos devolver para este \u00F3rg\u00E3o; se ainda n\u00E3o as consultou, deixe em branco e escreva depois com documento_editar." }),
          "documento_modelo?": s.texto({ descricao: "N\u00BA SEI de um documento para usar como texto inicial." }),
          "texto_padrao?": s.texto({ descricao: "Nome de um texto padr\u00E3o da unidade." }),
        }),
        { min: 1, max: 300 },
      ),
    }),
    efeito: "escrita",
    rotulo: (a) => `Criar ${qtd((a.itens as unknown[]).length, "documento", "documentos")}`,
    previsualizar: async (a, ctx) => {
      const itens = a.itens as Array<Args>;
      const out: PreviaItem[] = [];
      for (const it of itens) {
        try {
          const r = await ctx.sei<ResultadoEscrita>("documento.criar", { processo: it.processo, novo: novoDoc(it), aplicar: false });
          if (it.conteudo_html) r.mudancas.push({ campo: "Conte\u00FAdo", antes: "", depois: String(it.conteudo_html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 300) });
          out.push({ alvo: r.alvo, mudancas: r.mudancas, resumo: r.resumo });
        } catch (e) {
          out.push({ alvo: String(it.processo), mudancas: [], resumo: "", erro: (e as Error).message });
        }
      }
      return out;
    },
    executar: async (a, ctx) => {
      const itens = a.itens as Array<Args>;
      const saida = [];
      for (const it of itens) {
        if (ctx.sinal.aborted) break;
        try {
          const r = await ctx.sei<ResultadoEscrita>("documento.criar", { processo: it.processo, novo: novoDoc(it), aplicar: true });
          const numero = r.dados?.numero ?? "";
          if (it.conteudo_html && numero) await ctx.sei("documento.editar", { numero, html: it.conteudo_html, aplicar: true });
          saida.push({ processo: it.processo, ok: true, numero, resumo: r.resumo });
        } catch (e) {
          const x = e as { message?: string; codigo?: string };
          saida.push({ processo: it.processo, erro: x.message, codigo: x.codigo });
        }
      }
      return { criados: saida.filter((x) => "ok" in x).length, itens: saida };
    },
  }),

  escritaEmLote({
    nome: "documento_editar",
    descricao:
      "Substitui (ou acrescenta ao fim) o conte\u00FAdo do corpo de documentos internos N\u00C3O assinados, em HTML do SEI. Documento assinado \u00E9 recusado (editar cancelaria a assinatura).",
    parametros: s.objeto({
      documentos: DOCUMENTOS,
      conteudo_html: s.texto({ min: 1 }),
      "modo?": s.texto({ enum: ["substituir", "acrescentar"] }),
      "secao?": s.texto({ descricao: "T\u00EDtulo da se\u00E7\u00E3o, se n\u00E3o for o corpo do texto." }),
    }),
    op: "documento.editar",
    alvos: (a) => a.documentos as string[],
    argsOp: (a, alvo) => ({ numero: alvo, html: a.conteudo_html, modo: a.modo, secao: a.secao }),
    rotulo: (a) => `Editar conte\u00FAdo de ${qtd((a.documentos as string[]).length, "documento", "documentos")}`,
  }),
];

function novoDoc(it: Args) {
  return {
    tipo: it.tipo,
    descricao: it.descricao,
    numero: it.numero,
    nomeArvore: it.nome_arvore,
    nivel: it.nivel,
    hipotese: it.hipotese,
    documentoModelo: it.documento_modelo,
    textoPadrao: it.texto_padrao,
  };
}
