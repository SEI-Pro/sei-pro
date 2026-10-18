/**
 * Modelo do lote: um documento da árvore ou um Texto Padrão da unidade (porta de docsLote_docAnalysis e
 * docsLote_fillModelAnalysis, dist/js/sei-pro-docs-lote.js; txtPadrao_getList, dist/js/sei-pro.js).
 *
 * Ler o modelo é SÓ LEITURA. Os campos do documento vêm da visualização (`documento_visualizar`, todas as seções
 * já montadas, como o legado), nunca do editor: abrir o editor de um documento assinado cancela a assinatura. O
 * tipo vem da tela "Alterar Documento" (`hdnIdSerie`, id exato), que só é aberta, não enviada.
 */

import { extrairCampos } from "@dl/modelo/campos";
import { MAX_TEXTO_PREVIA } from "@dl/modelo/constantes";
import { lerConteudo, localizarDocumento, tipoDoDocumento, tiposDocumento } from "@nucleo/dominio/documento";
import { textoDoHtml } from "@nucleo/dominio/editor";
import type { Sei } from "@nucleo/sei";
import { analisarHtml, decodificarEntidades, textoDe } from "@nucleo/sessao/dom";
import { ErroSei } from "@nucleo/sessao/erros";
import type { OpcoesHttp } from "@nucleo/sessao/http";

/**
 * `texto` é o corpo do modelo em texto simples (até MAX_TEXTO_PREVIA caracteres), só para a prévia do app: a
 * criação copia o modelo pelo próprio SEI e não o usa. O app o tira antes de guardar o lote e de pedir `criar`.
 */
export type Modelo =
  | { origem: "documento"; numero: string; titulo: string; tipoId: string; tipoNome: string; campos: string[]; texto?: string }
  | { origem: "texto-padrao"; id: string; nome: string; tipoId?: string; tipoNome?: string; campos: string[]; texto?: string };

export interface ModelosDisponiveis {
  documentos: Array<{ numero: string; titulo: string }>;
  textosPadrao: Array<{ id: string; nome: string }>;
  tipos: Array<{ id: string; nome: string }>;
}

interface TextoPadraoListado {
  id: string;
  nome: string;
  consultar: string;
}

/** Textos "[_..." são dados internos do SEI Pro (favoritos, projetos, distribuição): não são modelo (legado). */
const INTERNO_SEI_PRO = /^\[_/;

/** Lista de Textos Padrão da unidade (primeira página, como o legado): id, nome e link de consultar. */
async function textosPadraoDaUnidade(sei: Sei, op?: OpcoesHttp): Promise<TextoPadraoListado[]> {
  const p = await sei.http.obter(sei.linkMenu("texto_padrao_interno_listar"), op);
  const lista: TextoPadraoListado[] = [];
  for (const tr of p.doc.querySelectorAll("table.infraTable tr")) {
    const caixa = tr.querySelector('input[type="checkbox"]');
    const id = caixa?.getAttribute("value") ?? "";
    const consultar = (tr.querySelector('a[href*="acao=texto_padrao_interno_consultar"]')?.getAttribute("href") ?? "").replace(
      /&amp;/g,
      "&",
    );
    // Coluna 3 (Nome), sem a coluna que as Anotações no controle acrescentam; na falta, o title da caixa.
    const tds = [...tr.querySelectorAll("td")].filter((td) => !td.classList.contains("spro-anotacao-coluna"));
    const nome = (tds[2] ? textoDe(tds[2]) : "") || (caixa?.getAttribute("title") ?? "").trim();
    if (!id || !nome || !consultar || INTERNO_SEI_PRO.test(nome)) continue;
    lista.push({ id, nome, consultar });
  }
  return lista;
}

/** O que pode ser modelo no processo `ref`: documentos internos da árvore, textos padrão e tipos de documento. */
export async function listarModelos(sei: Sei, ref: string, sinal?: AbortSignal): Promise<ModelosDisponiveis> {
  const arv = await sei.arvore(ref, { sinal });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o Documentos em Lote não atua nele.");
  const documentos = arv.documentos
    .filter((d) => !d.externo && !d.cancelado && d.nivel !== "sigiloso" && d.numero)
    .map((d) => ({ numero: d.numero, titulo: d.titulo }));
  const textosPadrao = (await textosPadraoDaUnidade(sei, { sinal })).map(({ id, nome }) => ({ id, nome }));
  const tipos = (await tiposDocumento(sei, ref, sinal)).filter((t) => t.id !== "-1");
  return { documentos, textosPadrao, tipos };
}

/**
 * Campos do HTML com as entidades decodificadas antes: a visualização do SEI escreve os acentos como entidade
 * (`##munic&iacute;pio##`), e o campo é o nome que o usuário digitou ("município"), o mesmo do cabeçalho do CSV.
 * Decodificar antes também desfaz `&#237;`, cujo `#` quebraria o `##…##`.
 */
const camposDoHtml = (html: string) => extrairCampos(decodificarEntidades(html));

/**
 * O que não é texto lido no documento: comentário, `<head>`/`<title>`, `<style>` (as "configurações de impressão" do
 * modelo), `<script>`, `<noscript>`, `<template>` e imagem (o `src` em base64). Sem isto o `textContent` mostraria o
 * CSS na prévia (D3 da validação no SEI real).
 */
const NAO_TEXTO = /<!--[\s\S]*?-->|<(head|title|style|script|noscript|template)\b[\s\S]*?<\/\1\s*>|<img\b[^>]*>/gi;
/** Endereço `data:` que sobre solto no texto (base64 colado como texto, por exemplo). */
const DADO_EMBUTIDO = /data:[a-z]+\/[\w.+-]+;base64,[A-Za-z0-9+/=]+/gi;

/**
 * O rodapé que a visualização do SEI (4.1 e 5) põe no fim do documento: "Criado por <login>, versão N por <login> em
 * dd/mm/aaaa hh:mm:ss." (um `<div unselectable>` com um `<hr>`). É da visualização, não do texto do modelo: na prévia
 * só faz ruído. Só sai a ÚLTIMA linha, e só com o padrão inteiro (versão e data); "Criado por" no corpo fica.
 */
const RODAPE_CRIADO_POR = /(?:^|\n)Criado por [^\n]+, vers[\u00E3a]o \d+ por [^\n]+ em \d{2}\/\d{2}\/\d{4}[^\n]*$/;

/**
 * O corpo em texto simples para a prévia (parágrafos em linhas, sem linhas em branco), sem o rodapé "Criado por" da
 * visualização, cortado em MAX_TEXTO_PREVIA. Só para a prévia: o que vai para o SEI é o próprio modelo.
 */
export const textoDaPrevia = (html: string) =>
  textoDoHtml(html.replace(NAO_TEXTO, ""))
    .replace(DADO_EMBUTIDO, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .replace(RODAPE_CRIADO_POR, "")
    .trim()
    .slice(0, MAX_TEXTO_PREVIA);

/** `alt` das imagens do cabeçalho que o SEI gera ("Código de Barras do Documento" / "do Processo"). */
const ALT_CODIGO_BARRAS = /c[o\u00F3]digo\s+de\s+barras/i;

/**
 * Tira o cabeçalho de código de barras (número do documento e do processo) do HTML do modelo (N2 da validação no
 * SEI MJ 5.0.4). O SEI refaz esse cabeçalho em cada documento criado, com o número novo e o processo de destino:
 * no modelo ele só mostra números que não vão para documento nenhum, e fazia o aviso do processo do modelo (D1)
 * disparar em quase todo modelo. Sai a menor tabela em volta das imagens e, subindo, a tabela externa que só a
 * envolve; uma tabela de layout com mais texto em volta fica. Sem essas imagens, o HTML volta como veio.
 */
export function semCabecalhoCodigoBarras(html: string): string {
  if (!/<img\b/i.test(html) || !ALT_CODIGO_BARRAS.test(decodificarEntidades(html))) return html;
  const doc = analisarHtml(`<!doctype html><html><head></head><body>${html}</body></html>`);
  const tabelas = new Set<Element>();
  for (const img of doc.querySelectorAll("img[alt]")) {
    if (!ALT_CODIGO_BARRAS.test(img.getAttribute("alt") ?? "")) continue;
    let tabela = img.closest("table");
    if (!tabela) continue;
    for (let acima = tabela.parentElement?.closest("table"); acima; acima = acima.parentElement?.closest("table")) {
      if (textoDe(acima) !== textoDe(tabela)) break;
      tabela = acima;
    }
    tabelas.add(tabela);
  }
  if (!tabelas.size) return html;
  for (const t of tabelas) t.remove();
  return doc.body?.innerHTML ?? html;
}

/** Só o corpo da página (o legado também cortava entre `<body>` e `</body>`): `##` no `<title>` não é campo. */
function corpoDa(html: string): string {
  const ini = html.search(/<body[\s>]/i);
  const fim = html.toLowerCase().lastIndexOf("</body>");
  return html.slice(ini >= 0 ? ini : 0, fim > ini ? fim : html.length);
}

export type EscolhaModelo = { documento: string } | { textoPadrao: string; tipoId: string; tipoNome?: string };

/**
 * Lê o modelo escolhido. Documento: tipo por `tipoDoDocumento` (id exato) e campos de todas as seções da
 * visualização. Texto Padrão: o conteúdo da consulta e o `tipoId` que o usuário escolheu (obrigatório, como no
 * legado: o texto padrão não tem tipo).
 */
export async function lerModelo(sei: Sei, escolha: EscolhaModelo, sinal?: AbortSignal): Promise<Modelo> {
  if ("textoPadrao" in escolha) {
    const tipoId = escolha.tipoId.trim();
    if (!tipoId) throw new ErroSei("ARGUMENTO_INVALIDO", "Escolha o tipo do documento a criar a partir do Texto Padrão.");
    const tp = (await textosPadraoDaUnidade(sei, { sinal })).find((t) => t.id === escolha.textoPadrao);
    if (!tp) throw new ErroSei("SEI_NAO_ENCONTRADO", `O Texto Padrão (id ${escolha.textoPadrao}) não está na lista da unidade.`);
    const consulta = await sei.http.obter(tp.consultar, { sinal });
    const conteudo = consulta.doc.querySelector('textarea[name="txaConteudo"], #txaConteudo')?.textContent ?? "";
    return {
      origem: "texto-padrao",
      id: tp.id,
      nome: tp.nome,
      tipoId,
      ...(escolha.tipoNome ? { tipoNome: escolha.tipoNome } : {}),
      campos: camposDoHtml(conteudo),
      // O HTML do texto padrão vem dentro do <textarea>: conforme o parser, ainda com as entidades (&lt;p&gt;).
      texto: textoDaPrevia(decodificarEntidades(conteudo)),
    };
  }

  const loc = await localizarDocumento(sei, escolha.documento, { sinal });
  if (loc.documento.externo) {
    throw new ErroSei("ARGUMENTO_INVALIDO", `O documento ${loc.documento.numero} é um anexo: só documento gerado no SEI serve de modelo.`);
  }
  // lerConteudo recusa sigiloso antes de baixar qualquer byte.
  const conteudo = await lerConteudo(sei, loc, { sinal });
  const html = conteudo.forma === "html" ? conteudo.html : "";
  const tipo = await tipoDoDocumento(sei, loc.documento.numero, sinal);
  return {
    origem: "documento",
    numero: loc.documento.numero,
    titulo: loc.documento.titulo,
    tipoId: tipo.id,
    tipoNome: tipo.nome,
    campos: camposDoHtml(corpoDa(html)),
    // Sem o cabeçalho de código de barras: o SEI o refaz com os números do documento criado (N2).
    texto: textoDaPrevia(semCabecalhoCodigoBarras(corpoDa(html))),
  };
}
