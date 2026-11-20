import type { Adaptador } from "../adaptador";

/** O que cada recurso recebe: o editor (adaptador), a pagina e as opcoes do usuario. */
export interface Contexto {
  adaptador: Adaptador;
  doc: Document;
  win: Window;
  /** URL base da extensao (`chrome-extension://<id>/`), vinda do `data-base` do `<script>`. */
  base: string;
  /** Regra `checkConfigValue`: opcao ausente conta como ligada. */
  checkOpcao(nome: string): boolean;
  /** Regra `verifyConfigValue`: opcao ausente conta como desligada. */
  verifyOpcao(nome: string): boolean;
  /** Rede, injetavel nos testes; o padrao e o `fetch` da pagina. */
  fetch?: typeof fetch;
  /** Baixa uma imagem e a devolve como data URI (canvas); injetavel nos testes. */
  imagemParaDataUri?: (src: string) => Promise<string>;
}

/** Formato das funcoes globais que o monolito chama pelo nome (`this_` = elemento clicado). */
// biome-ignore lint/suspicious/noExplicitAny: os globais do legado tem assinaturas livres por recurso
export type GlobalDoRecurso = (this_: Element | null, ...args: any[]) => unknown;

/**
 * Uma funcionalidade do editor. `id` e o nome do modulo legado (`dist/js/modules/editor/<id>.js`) que
 * passa a ceder. `globais` devolve o que vai para `window` (funcoes do contrato de nomes e, em casos
 * como `SeiProGhs`, um objeto); `iniciar` roda quando o editor esta pronto.
 */
export interface Recurso {
  id: string;
  globais(c: Contexto): Record<string, unknown>;
  iniciar?(c: Contexto): void;
}
