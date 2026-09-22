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
    nome: "documento_criar",
    descricao:
      "Cria documentos internos (Despacho, Of\u00EDcio, Nota T\u00E9cnica...) em processos abertos na unidade, j\u00E1 com o conte\u00FAdo do corpo em HTML do SEI (ver skill 'redacao-oficial'). Aceita v\u00E1rios itens: \u00E9 o 'documentos em lote'. Devolve o n\u00BA SEI de cada documento criado. Nunca assina.",
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
          "conteudo_html?": s.texto({ descricao: "Corpo do documento em par\u00E1grafos HTML com as classes de estilo do SEI." }),
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
