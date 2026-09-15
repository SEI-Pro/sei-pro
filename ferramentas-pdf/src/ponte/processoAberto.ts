/**
 * Qual processo está aberto nesta aba do SEI, e onde fica o `controlador.php`.
 *
 * A URL DO TOPO NÃO BASTA. Dois caminhos comuns a deixam sem o processo, e os
 * dois foram vistos no SEI 4.1.5:
 *
 * 1. Com a opção "URL amigável" do SEI Pro, `updateUrlPage` troca o endereço
 *    da aba por "/sei/#protocolo@nrSEI" (history.replaceState) poucos segundos
 *    depois de o processo abrir. Some o `id_procedimento`, e o caminho deixa de
 *    ser o do controlador: "/sei/?acao=..." cai no index.php, não no
 *    controlador.php.
 * 2. Aberto pela pesquisa rápida, o processo chega como
 *    `procedimento_trabalhar&id_protocolo=...`, sem `id_procedimento` na URL,
 *    com ou sem a opção ligada.
 *
 * Nos dois casos a ferramenta dizia "Abra um processo no SEI" com o processo
 * aberto na frente do usuário.
 *
 * A fonte que não muda é o quadro da árvore. O SEI monta o `src` do
 * `#ifrArvore` com `id_procedimento` em todas as versões
 * (`$strLinkMontarArvore` no procedimento_trabalhar.php do 3.1.7 e do 5.0.0), e
 * o resto do SEI Pro já lê o processo dali:
 * `getParamsUrlPro($('#ifrArvore').attr('src'))`.
 *
 * É uma função pura sobre as fontes já lidas, para ser verificada sem navegador.
 */

export interface FontesDoProcesso {
  /** `location.href` do topo. */
  urlDoTopo: string;
  /** Atributo `src` do `#ifrArvore`, como está no HTML (em geral relativo). */
  srcDaArvore?: string | null;
  /** `location.href` do quadro da árvore, quando legível. */
  urlDaArvore?: string | null;
}

export interface ProcessoAberto {
  idProcedimento: string;
  /** Endereço absoluto do `controlador.php` desta instalação, sem parâmetros. */
  controlador: string;
}

export function localizarProcesso(fontes: FontesDoProcesso): ProcessoAberto | null {
  const topo = comoUrl(fontes.urlDoTopo);
  if (!topo) return null;

  // A URL do topo ainda traz o processo: é o caminho de sempre, sem mudança.
  const doTopo = topo.searchParams.get("id_procedimento");
  if (doTopo) return { idProcedimento: doTopo, controlador: semParametros(topo) };

  // O `src` da árvore é resolvido contra o endereço REAL do quadro, que continua
  // no controlador.php mesmo quando o topo virou "/sei/#...". Sem o quadro
  // legível (recarregando, por exemplo), resta o endereço do topo.
  if (!fontes.srcDaArvore) return null;
  const base = /^https?:/i.test(fontes.urlDaArvore ?? "") ? fontes.urlDaArvore! : fontes.urlDoTopo;
  const arvore = comoUrl(fontes.srcDaArvore, base);
  const daArvore = arvore?.searchParams.get("id_procedimento");
  if (!arvore || !daArvore) return null;
  return { idProcedimento: daArvore, controlador: semParametros(arvore) };
}

function comoUrl(endereco: string, base?: string): URL | null {
  try {
    return new URL(endereco, base);
  } catch {
    return null;
  }
}

function semParametros(url: URL): string {
  return `${url.origin}${url.pathname}`;
}
