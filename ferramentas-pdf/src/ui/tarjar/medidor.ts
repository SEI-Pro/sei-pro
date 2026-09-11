/**
 * Medidor de largura de texto, injetado no nucleo.
 *
 * SEM ISTO A TARJA FICA CURTA, E NADA FALHA. O `getTextContent()` do pdf.js
 * costuma devolver a LINHA INTEIRA como um item so, entao todo casamento e
 * parcial e precisa ser recortado. Recortar por proporcao de CONTAGEM de
 * caracteres erra em fonte proporcional: numa linha `CEP: 70070-600 -
 * Brasilia/DF`, a tarja cobria `70070-60` e deixava o ultimo digito a vista.
 *
 * O nucleo nao pode criar um canvas sozinho -- ele roda tambem em Node, nos
 * verificadores. Dai a injecao.
 */

import { configurarMedidorDeTexto } from "@/lib/ferramentas/tarjar/textoPagina";

let contexto: CanvasRenderingContext2D | null = null;

export function instalarMedidorDeTexto(): void {
  if (!contexto) {
    const canvas = document.createElement("canvas");
    contexto = canvas.getContext("2d");
  }
  const ctx = contexto;
  if (!ctx) return;

  configurarMedidorDeTexto((texto, fontFamily) => {
    // Tamanho fixo: o que importa e a PROPORCAO entre larguras, nao a medida
    // absoluta -- o chamador normaliza pelo total.
    ctx.font = `100px ${fontFamily || "sans-serif"}`;
    return ctx.measureText(texto).width / 100;
  });
}

export function desinstalarMedidorDeTexto(): void {
  configurarMedidorDeTexto(null);
}
