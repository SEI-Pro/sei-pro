/**
 * `ver_imagem`: o agente olha uma figura marcada na leitura (ver
 * `painel/figuras.ts`). A leitura continua só texto; a imagem só sai do
 * computador por aqui, uma por vez, depois de o usuário ver a miniatura e
 * permitir, numa chamada sem ferramentas — e a descrição volta como conteúdo
 * de documento: varrida e envelopada.
 */

import { s } from "../motor/esquema";
import { definirTool } from "../motor/tools";
import { lerIdFigura } from "../painel/figuras";
import { envelopar } from "../seguranca/envelope";
import { resumoDosAchados, varrer } from "../seguranca/injecao";

/** Tools que o agente auxiliar não recebe, mesmo sendo de leitura: precisam do usuário. */
export const TOOLS_FORA_DO_AUXILIAR = ["ver_imagem"];

const falha = (mensagem: string, codigo: string) => Object.assign(new Error(mensagem), { codigo });
const cancelado = () => falha("Cancelado pelo usu\u00E1rio.", "CANCELADO");

type Meta = { numero?: string; titulo?: string; processo?: string; nivel?: string };
type Lido = Meta & { conteudo?: { forma: string; tipo?: string; base64?: string }; imagem?: { tipo: string; base64: string } };

export const TOOL_VER_IMAGEM = definirTool({
  nome: "ver_imagem",
  descricao:
    "Olha uma figura de documento que o texto do documento_ler marcou ([figura p3-1 \u2026], [figura img-2 \u2026], [p\u00E1gina 7 digitalizada \u2026], [arquivo de imagem \u2026], [poss\u00EDvel figura desenhada \u2026]) e devolve a descri\u00E7\u00E3o dela. Chame quando a resposta depender da figura (gr\u00E1fico, mapa, tabela em imagem, foto, planta). N\u00C3O chame para bras\u00E3o, logotipo ou assinatura. Uma figura por chamada; o usu\u00E1rio v\u00EA a miniatura e decide se ela vai ao modelo. 'pN' mostra a p\u00E1gina N inteira de um PDF.",
  parametros: s.objeto({
    documento: s.texto({ descricao: "N\u00BA SEI do documento." }),
    figura: s.texto({ descricao: "Id da marca: p3-1 (figura do PDF), p3 (p\u00E1gina inteira), img-2 (imagem do editor do SEI) ou arquivo (documento que \u00E9 imagem)." }),
    "pergunta?": s.texto({ max: 500, descricao: "O que procurar na figura (ex.: o valor de 2024 no gr\u00E1fico)." }),
  }),
  efeito: "leitura",
  rotulo: (a) => `Ver a figura ${String(a.figura)} do documento ${String(a.documento)}`,
  executar: async (a, ctx) => {
    if (!ctx.imagens) throw falha("Este agente n\u00E3o v\u00EA imagens: s\u00F3 a conversa principal pede a permiss\u00E3o do usu\u00E1rio. Liste a figura no resultado para quem pediu.", "IMAGEM_INDISPONIVEL");
    const numero = String(a.documento).trim();
    const figura = String(a.figura).trim();
    const id = lerIdFigura(figura);
    if (!id) throw falha(`"${figura}" n\u00E3o \u00E9 um id de figura. Use o que veio na marca: p3-1, p3, img-2 ou arquivo.`, "FIGURA_INEXISTENTE");
    const meta = await ctx.sei<Meta>("documento.ler", { numero, somenteMetadados: true });
    if (meta.nivel === "sigiloso") throw falha("Documento sigiloso: o agente n\u00E3o atua nele.", "SEI_SIGILOSO");
    const restrito = meta.nivel === "restrito";
    if (restrito && !(await ctx.consentirRestrito(`Documento ${meta.numero} (${meta.titulo}), processo ${meta.processo}`))) {
      throw falha("Conte\u00FAdo restrito: o usu\u00E1rio n\u00E3o autorizou o envio ao modelo nesta conversa.", "CONTEUDO_RESTRITO_NAO_AUTORIZADO");
    }
    if ((await ctx.imagens.enxerga()) === false) throw falha("O modelo escolhido n\u00E3o enxerga imagem. Escolha um modelo com vis\u00E3o em Configura\u00E7\u00E3o (o modelo auxiliar basta).", "MODELO_SEM_VISAO");

    let conteudo: { tipo: string; base64: string };
    if (id.tipo === "html") {
      const r = await ctx.sei<Lido>("documento.ler", { numero, imagemHtml: id.indice });
      if (!r.imagem) throw falha(`O documento ${numero} n\u00E3o tem a imagem ${figura}.`, "FIGURA_INEXISTENTE");
      conteudo = r.imagem;
    } else {
      const r = await ctx.sei<Lido>("documento.ler", { numero });
      if (r.conteudo?.forma === "grande") throw falha(`O arquivo do documento ${numero} \u00E9 grande demais para o agente abrir.`, "FIGURA_INEXISTENTE");
      if (r.conteudo?.forma !== "arquivo" || !r.conteudo.base64 || !r.conteudo.tipo) {
        throw falha(`O documento ${numero} foi escrito no editor do SEI: as figuras dele s\u00E3o img-1, img-2\u2026 (veja as marcas no texto).`, "FIGURA_INEXISTENTE");
      }
      conteudo = { tipo: r.conteudo.tipo, base64: r.conteudo.base64 };
    }
    const doc = meta.numero ?? numero;
    if (ctx.sinal.aborted) throw cancelado();
    const img = await ctx.imagens.preparar(conteudo, figura, `figura ${figura} do documento ${doc}`);
    if (ctx.sinal.aborted) throw cancelado();
    if (!(await ctx.consentirImagem(img, { restrito }))) throw falha("O usu\u00E1rio n\u00E3o autorizou o envio desta imagem ao servi\u00E7o de IA. Responda sem ela e diga isso.", "IMAGEM_NAO_AUTORIZADA");
    if (ctx.sinal.aborted) throw cancelado();
    const pergunta = typeof a.pergunta === "string" && a.pergunta.trim() ? ` O que procurar: ${a.pergunta.trim()}` : "";
    const descricao = await ctx.imagens.descrever(img, `Documento ${doc}, figura ${figura}.${pergunta}`, ctx.sinal);
    if (ctx.sinal.aborted) throw cancelado();
    // A descrição é conteúdo do documento: uma imagem pode trazer texto
    // dirigido a IA, e o modelo de visão o transcreve.
    const varrido = varrer(descricao);
    if (varrido.achados.length) ctx.registrarAchados(doc, varrido.achados);
    return {
      documento: doc,
      figura,
      descricao: envelopar(doc, varrido.texto, ctx.nonce),
      ...(varrido.achados.length ? { integridade: resumoDosAchados(varrido.achados) } : {}),
    };
  },
});
