/**
 * Do `INFRA_EDITOR_CONFIG` da página do editor ao HTML limpo de cada seção editável.
 *
 * O HTML vem da configuração que o servidor escreveu na página (`initialData`), não do CKEditor: o CK5 já
 * converteu o que recebeu e, nessa conversão, perdeu os negritos do Google Docs (`span.c8`) e os títulos.
 * A configuração guarda o HTML como o SEI copiou do modelo.
 */

import { lerEditor, type SecaoEditor } from '../../sei-nucleo/src/dominio/editor';
import { folhasDaSecao, limparSecao, type RelatorioLimpeza } from './limpeza/limpar';

export interface SecaoLimpa {
  /** `txaEditor_N`, a raiz do CK5. */
  raiz: string;
  titulo: string;
  html: string;
  relatorio: RelatorioLimpeza;
}

export interface Preparo {
  idProcedimento?: string;
  secoes: SecaoLimpa[];
}

/** Texto do `<script>` da página que traz o `INFRA_EDITOR_CONFIG`, ou `undefined` fora do editor CK5. */
export function scriptDaConfiguracao(doc: Document): string | undefined {
  for (const s of doc.querySelectorAll('script:not([src])')) {
    const t = s.textContent ?? '';
    if (t.includes('INFRA_EDITOR_CONFIG')) return t;
  }
  return undefined;
}

export function idProcedimentoDaConfiguracao(texto: string): string | undefined {
  return /"idProcedimento"\s*:\s*"?(\d+)"?/.exec(texto)?.[1];
}

export function prepararLimpeza(texto: string, url: string, criarDocumento?: (html: string) => Document): Preparo {
  const ed = lerEditor({ url, status: 200, html: texto, get doc(): Document { throw new Error('sem documento'); } });
  if (ed.tipo !== 'ck5') return { secoes: [] };
  const folhasPorSecao = new Map<string, string[]>(ed.secoes.map((s) => [s.nome, folhasDaSecao(s.html, criarDocumento)]));
  const editaveis = ed.secoes.filter((s: SecaoEditor) => !s.somenteLeitura);
  const secoes = editaveis.map((s) => {
    const outras = ed.secoes.filter((o) => o.nome !== s.nome).flatMap((o) => folhasPorSecao.get(o.nome) ?? []);
    const { html, relatorio } = limparSecao(s.html, {
      estilos: s.estilos.map((e) => e.classe),
      estiloPadrao: s.estiloPadrao,
      folhasDoDocumento: outras,
      criarDocumento,
    });
    return { raiz: s.nome, titulo: s.titulo, html, relatorio };
  });
  return { idProcedimento: idProcedimentoDaConfiguracao(texto), secoes };
}

/** Juntar os relatórios das seções para o aviso. */
export function somar(secoes: SecaoLimpa[]): RelatorioLimpeza {
  const total: RelatorioLimpeza = {
    folhasRemovidas: 0,
    classesTrocadas: 0,
    negritosRecuperados: 0,
    titulosConvertidos: 0,
    listasConvertidas: 0,
    listasComNumeroEscrito: 0,
    marcaDaguaRemovida: false,
  };
  for (const { relatorio: r } of secoes) {
    total.folhasRemovidas += r.folhasRemovidas;
    total.classesTrocadas += r.classesTrocadas;
    total.negritosRecuperados += r.negritosRecuperados;
    total.titulosConvertidos += r.titulosConvertidos;
    total.listasConvertidas += r.listasConvertidas;
    total.listasComNumeroEscrito += r.listasComNumeroEscrito;
    total.marcaDaguaRemovida ||= r.marcaDaguaRemovida;
  }
  return total;
}
