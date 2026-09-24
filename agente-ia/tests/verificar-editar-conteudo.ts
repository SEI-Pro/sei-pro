/**
 * Gravar conteúdo: o que o SEI aceita calado.
 *
 * Medido no SEI 5.0.4 da ANTAQ (processo 50300.012526/2025-92, produção), com
 * o POST do CK5 reproduzido à mão:
 *
 * - o SEI guarda FIELMENTE o que recebe — cerca de markdown, `<h2>`, `<ul>`,
 *   classe inexistente, `<div>`, tabela, texto cru e acento (vira entidade).
 *   Não há filtro que coma conteúdo: se a seção ficou vazia, foi vazia que ela
 *   chegou;
 * - mandando `<p>&nbsp;</p>` no corpo, o SEI responde **200 com `{"versao":3}`**
 *   e apaga o corpo. Era o bastante para o `salvar` dar por gravado e o agente
 *   anunciar sucesso: o documento ficava só com cabeçalho e signatário, sem
 *   erro em lugar nenhum.
 *
 * Daí as duas regras deste arquivo: conteúdo sem texto não vai para o SEI, e
 * "gravado" só se pode dizer depois de reler a seção.
 */

import { editarConteudo } from "@nucleo/dominio/editor";
import type { Sei } from "@nucleo/sei";
import type { Pagina } from "@nucleo/sessao/http";
import { DOMParser } from "linkedom";
import { checar, lanca, secao } from "./util";

const parser = new DOMParser();
const parse = (html: string) => parser.parseFromString(html, "text/html") as unknown as Document;

const LINK_EDITOR = "https://sei.exemplo.gov.br/sei/controlador.php?acao=editor_montar&id_documento=9&infra_hash=abc";
const CORPO_MODELO = '<p class="Texto_Justificado">Em 24/09/2026, arquiva-se este processo pelo motivo: [descrever].</p>';

function paginaEditor(corpo: string): Pagina {
  const cfg = {
    initialData: { txaEditor_1: "<p>Timbre</p>", txaEditor_2: corpo, txaEditor_3: "<p>[INFORMAR SIGNATÁRIO]</p>" },
    rootsAttributes: {
      txaEditor_1: { label: "Cabeçalho", somenteLeitura: true },
      txaEditor_2: { label: "Corpo do Texto", principal: true },
      txaEditor_3: { label: "Assinatura" },
    },
    sei: { urlSalvar: "controlador_rest.php?acao_rest=editor_salvar_conteudo", versao: 1, siglaUnidade: "GPF" },
  };
  const html = `<html><body><script>window.INFRA_EDITOR_CONFIG = ${JSON.stringify(cfg)};</script></body></html>`;
  return { url: LINK_EDITOR, status: 200, html, get doc() { return parse(html); } };
}

/**
 * `Sei` de mentira. `corpos` é a fila de conteúdos que o editor devolve a cada
 * abertura: o primeiro é o que se vai editar, o seguinte é o que o SEI mostra
 * DEPOIS de gravar — é assim que se testa a conferência.
 */
function seiFalso(corpos: string[]) {
  const aberturas: string[] = [];
  const invalidados: string[] = [];
  let i = 0;
  const sei = {
    localizar: async () => ({ idDocumento: "9" }),
    arvore: async () => ({
      idProcedimento: "77",
      protocolo: "50300.012526/2025-92",
      documentos: [{ id: "9", numero: "3035276", titulo: "Termo de Arquivamento", nivel: "publico", externo: false, assinado: false, cancelado: false, link: "/doc", acoes: [LINK_EDITOR] }],
    }),
    http: {
      obter: async (url: string) => (aberturas.push(url), paginaEditor(corpos[Math.min(i++, corpos.length - 1)])),
      absoluta: (u: string) => new URL(u, LINK_EDITOR).href,
    },
    contexto: () => ({ unidade: { sigla: "GPF" } }),
    invalidar: (id: string) => invalidados.push(id),
  } as unknown as Sei;
  return { sei, aberturas, invalidados };
}

/** Troca o `fetch` global (o `salvar` do CK5 não passa pelo `sei.http`). */
function fetchFalso(resposta = '{"versao":2,"comentariosAtualizados":false}') {
  const enviados: Array<{ nome: string; html: string }> = [];
  const original = globalThis.fetch;
  globalThis.fetch = (async (_url: string, init: { body: string }) => {
    const corpo = JSON.parse(init.body) as { secoesConteudo: Array<{ nome: string; html: string }> };
    enviados.push(...corpo.secoesConteudo);
    return { ok: true, status: 200, text: async () => resposta };
  }) as unknown as typeof fetch;
  return { enviados, restaurar: () => { globalThis.fetch = original; } };
}

export async function verificarEditarConteudo(): Promise<void> {
  const op = { aplicar: true, sinal: new AbortController().signal };

  secao("editar conteudo: conteudo em branco nao apaga o documento");
  for (const branco of ["<p>&nbsp;</p>", "   ", "<p></p>", "<br />", "<p class=\"Texto_Justificado\"> </p>"]) {
    const { sei } = seiFalso([CORPO_MODELO]);
    const f = fetchFalso();
    const erro = await lanca(() => editarConteudo(sei, "3035276", { html: branco }, op));
    f.restaurar();
    checar(`recusa ${JSON.stringify(branco)}`, erro?.codigo === "ARGUMENTO_INVALIDO", erro);
    checar(`e nao chega a gravar ${JSON.stringify(branco)}`, f.enviados.length === 0, f.enviados);
  }

  secao("editar conteudo: o que tem texto (ou imagem) passa");
  {
    const novo = '<p class="Texto_Justificado">(X) Pelo cumprimento do seu objeto.</p>';
    const { sei, invalidados } = seiFalso([CORPO_MODELO, novo]);
    const f = fetchFalso();
    const r = await editarConteudo(sei, "3035276", { html: novo }, op);
    f.restaurar();
    checar("gravou", r.aplicado === true, r);
    checar("mandou as TRES secoes, so o corpo trocado", f.enviados.length === 3 && f.enviados[1].html === novo && f.enviados[0].html === "<p>Timbre</p>", f.enviados);
    checar("invalidou o cache da arvore", invalidados.join() === "77", invalidados);
  }
  {
    const soImagem = '<p class="Texto_Centralizado"><img alt="Assinatura" src="data:image/png;base64,iVBOR" /></p>';
    const { sei } = seiFalso([CORPO_MODELO, soImagem]);
    const f = fetchFalso();
    const erro = await lanca(() => editarConteudo(sei, "3035276", { html: soImagem }, op));
    f.restaurar();
    checar("conteudo so com imagem nao e 'em branco'", erro === null, erro);
  }

  secao("editar conteudo: 'gravado' so depois de conferir na fonte");
  {
    // O SEI respondeu 200 com "versao", mas a secao continua como estava.
    const novo = '<p class="Texto_Justificado">Texto novo que o SEI descartou.</p>';
    const { sei } = seiFalso([CORPO_MODELO, CORPO_MODELO]);
    const f = fetchFalso();
    const erro = await lanca(() => editarConteudo(sei, "3035276", { html: novo }, op));
    f.restaurar();
    checar("acusa que nada mudou em vez de dizer que gravou", erro?.codigo === "SEI_VALIDACAO", erro);
  }
  {
    // O caso da ANTAQ: 200, "versao" nova e a secao vazia do outro lado.
    const novo = '<p class="Texto_Justificado">Texto que sumiu.</p>';
    const { sei } = seiFalso([CORPO_MODELO, "<p>&nbsp;</p>"]);
    const f = fetchFalso();
    const erro = await lanca(() => editarConteudo(sei, "3035276", { html: novo }, op));
    f.restaurar();
    checar("acusa a secao vazia depois de gravar", erro?.codigo === "SEI_VALIDACAO" && /vazi/i.test(erro?.message ?? ""), erro);
  }

  secao("editar conteudo: previa nao confere nada (nao gravou)");
  {
    const { sei, aberturas } = seiFalso([CORPO_MODELO]);
    const f = fetchFalso();
    const r = await editarConteudo(sei, "3035276", { html: '<p class="Texto_Justificado">Proposta.</p>' }, { aplicar: false, sinal: op.sinal });
    f.restaurar();
    checar("previa nao grava", r.aplicado === false && f.enviados.length === 0, r);
    checar("previa abre o editor uma vez so", aberturas.length === 1, aberturas);
  }

  secao("editar conteudo: acrescentar preserva o que ja estava");
  {
    const pedaco = '<p class="Texto_Justificado">Paragrafo acrescentado.</p>';
    const { sei } = seiFalso([CORPO_MODELO, `${CORPO_MODELO}\n${pedaco}`]);
    const f = fetchFalso();
    const r = await editarConteudo(sei, "3035276", { html: pedaco, modo: "acrescentar" }, op);
    f.restaurar();
    checar("gravou o antigo mais o novo", r.aplicado === true && f.enviados[1].html === `${CORPO_MODELO}\n${pedaco}`, f.enviados[1]);
  }
}
