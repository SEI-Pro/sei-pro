/**
 * Catalogo das ferramentas.
 *
 * Fonte unica: o hub, o roteador e o titulo da página leem daqui, entao uma
 * ferramenta nova entra em todos ao ser cadastrada em um lugar so.
 *
 * O `carregar` de cada uma e um `import()` dinamico -- e o que faz o Tarjar (com
 * o visualizador inteiro) e o OCR (com o Tesseract) sairem em pedacos
 * separados, carregados so quando alguem abre aquela ferramenta.
 */

import type { FerramentaMontada } from "@/ui/moldura";

export interface ItemCatalogo {
  slug: string;
  nome: string;
  resumo: string;
  icone: string;
  /**
   * A ferramenta trabalha sobre a página do documento e precisa de largura.
   *
   * O padrão é a largura de leitura -- boa para formulário e lista, e a mesma
   * das opções da extensão. Mas tarjar exige arrastar um retângulo sobre uma
   * linha de texto, e organizar exige reconhecer as páginas pela miniatura: com
   * a coluna estreita, o documento fica pequeno demais para as duas coisas.
   */
  amplo?: boolean;
  carregar: () => Promise<{ montar(): FerramentaMontada }>;
}

export const CATALOGO: ItemCatalogo[] = [
  {
    slug: "tarjar",
    nome: "Tarjar PDF",
    resumo:
      "Suprima CPF, e-mail e outros dados sensíveis, de forma que o texto deixe de existir no arquivo.",
    icone: "fas fa-marker",
    amplo: true,
    carregar: () => import("@/ui/apps/tarjar"),
  },
  {
    slug: "juntar",
    nome: "Juntar PDF",
    resumo: "Una vários PDFs em um documento só, na ordem que você definir.",
    icone: "fas fa-object-group",
    carregar: () => import("@/ui/apps/juntar"),
  },
  {
    slug: "comprimir",
    nome: "Comprimir PDF",
    resumo: "Reduza o tamanho do arquivo para caber no limite exigido pelo órgão.",
    icone: "fas fa-compress",
    carregar: () => import("@/ui/apps/comprimir"),
  },
  {
    slug: "dividir",
    nome: "Dividir PDF",
    resumo: "Separe páginas, intervalos, ou parta o arquivo em partes que caibam num limite.",
    icone: "fas fa-cut",
    carregar: () => import("@/ui/apps/dividir"),
  },
  {
    slug: "organizar",
    nome: "Organizar PDF",
    resumo: "Reordene, gire e remova páginas antes de protocolar.",
    icone: "fas fa-arrows-alt",
    amplo: true,
    carregar: () => import("@/ui/apps/organizar"),
  },
  {
    slug: "imagem-para-pdf",
    nome: "Imagem para PDF",
    resumo: "Converta fotos e digitalizações JPG ou PNG em um PDF único.",
    icone: "fas fa-file-image",
    carregar: () => import("@/ui/apps/imagemParaPdf"),
  },
  {
    slug: "numerar",
    nome: "Numerar páginas",
    resumo: "Insira numeração de páginas ou de folhas, na posição que você escolher.",
    icone: "fas fa-list-ol",
    carregar: () => import("@/ui/apps/numerarPaginas"),
  },
  {
    slug: "ocr",
    nome: "OCR: PDF pesquisável",
    resumo: "Torne pesquisável um PDF digitalizado, sem enviar o arquivo a servidor nenhum.",
    icone: "fas fa-search",
    carregar: () => import("@/ui/apps/ocr"),
  },
  {
    slug: "conferir-pdfa",
    nome: "Conferir PDF/A",
    resumo: "Descubra por que o seu PDF não é aceito como PDF/A, e o que fazer para corrigir.",
    icone: "fas fa-clipboard-check",
    carregar: () => import("@/ui/apps/conferirPdfa"),
  },
];

export function porSlug(slug: string): ItemCatalogo | undefined {
  return CATALOGO.find((f) => f.slug === slug);
}
