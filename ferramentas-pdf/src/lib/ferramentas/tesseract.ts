/**
 * Ponto único de configuração do Tesseract.
 *
 * TODOS os assets vêm do pacote da extensão, e isso não é preferência de
 * estilo. A ferramenta inteira se sustenta na afirmação de que o documento não
 * sai do computador do usuário. Buscar o modelo de reconhecimento numa CDN de
 * terceiro contradiz o discurso: mesmo sem enviar o arquivo, o pedido do modelo
 * conta a um estranho que aquela pessoa está fazendo OCR agora. E, com a
 * política de segurança de MV3, a requisição externa é bloqueada — a ferramenta
 * quebraria só no navegador do usuário, com o empacotamento passando.
 *
 * ARMADILHA DO `corePath`, verificada dentro do `worker.min.js`: se o caminho
 * NÃO terminar em `.js`, o worker o trata como DIRETÓRIO, faz detecção de
 * capacidade do navegador e monta o nome do arquivo sozinho (`-simd-`,
 * `-relaxedsimd-`...). Duas consequências ruins: seria preciso empacotar as
 * três variantes (11,7 MB) para não arriscar um 404, e, se o arquivo escolhido
 * faltar, o worker cai no jsDelivr. Apontar o ARQUIVO exato pula a detecção e
 * fecha esse caminho. Há um verificador só para isso em
 * `tests/verificar-ambiente.ts`.
 *
 * O QUE FOI EMPACOTADO, e por que só isso:
 * - `worker.min.js` — o worker do tesseract.js.
 * - `core/tesseract-core-simd-lstm.wasm.js` — UMA variante LSTM, com SIMD.
 *   Cobre Chrome 91+ e Firefox 89+; as outras duas custariam +7,8 MB. Não
 *   existe `.wasm` solto porque esse arquivo já embute o binário.
 * - `lang/por.traineddata.gz` — modelo de português do `tessdata_fast`, cerca
 *   de um oitavo do modelo completo e suficiente para texto impresso.
 *
 * Nada disso é baixado: já está no pacote, e o OCR funciona em modo avião.
 */

import { recursoDaExtensao } from "@/plataforma/recursos";

const BASE = "vendor/ferramentas-pdf/tesseract";

export const CAMINHOS_TESSERACT = {
  worker: recursoDaExtensao(`${BASE}/worker.min.js`),
  // ARQUIVO, nunca diretório. Ver a armadilha no topo.
  core: recursoDaExtensao(`${BASE}/core/tesseract-core-simd-lstm.wasm.js`),
  lang: recursoDaExtensao(`${BASE}/lang`),
} as const;

/** Idioma do modelo empacotado. Acrescentar outro exige empacotar o `.gz`. */
export const IDIOMA_OCR = "por";

/**
 * Resolução de rasterização, em pontos por polegada.
 *
 * 200 dpi não é chute: é o que a Portaria 11/2016 e os manuais de
 * peticionamento dos órgãos pedem para digitalização. Subir para 300 melhora
 * pouco o reconhecimento de texto impresso e multiplica o tempo e a memória,
 * que aqui saem da máquina do usuário.
 */
export const DPI_PADRAO = 200;

/** Teto de páginas por execução, para o navegador não morrer sem aviso. */
export const MAX_PAGINAS_OCR = 100;

/**
 * O core empacotado exige SIMD. Sem essa checagem, um navegador antigo faz o
 * worker morrer sem mensagem útil — o usuário vê o OCR "travar" para sempre.
 *
 * O módulo abaixo é o menor WebAssembly válido que usa uma instrução SIMD
 * (`v128.const`): se o navegador o valida, tem SIMD.
 */
export function suportaSimd(): boolean {
  try {
    return WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0,
        10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
      ]),
    );
  } catch {
    return false;
  }
}
