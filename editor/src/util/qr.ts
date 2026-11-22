/**
 * Unico ponto de contato com a biblioteca do QR Code (o plugin jQuery `jquery-qrcode` 0.18, que o `init.js` carrega na
 * pagina). Trocar a biblioteca por outra e mexer so aqui.
 */
export interface OpcoesQr {
  render: "image" | "canvas";
  ecLevel: string;
  minVersion: number;
  fill: string;
  /** `null` = fundo transparente. */
  background: string | null;
  text: string;
  size: number;
  radius: number;
  quiet: number;
  mode: number;
  mSize: number;
  mPosX: number;
  mPosY: number;
  label: string;
  fontname: string;
  fontcolor: string;
  image: HTMLImageElement | null;
}

type JQuery = (alvo: Element) => { qrcode?(o: OpcoesQr): unknown };

/**
 * Desenha o QR em `alvo` (a biblioteca poe um `<img>` com data URI, ou um `<canvas>`) e devolve o elemento criado, ou
 * `null` se a biblioteca nao esta na pagina ou falhou (texto grande demais para a versao, p.ex.).
 */
export function gerarQr(win: Window, alvo: HTMLElement, opcoes: OpcoesQr): HTMLImageElement | HTMLCanvasElement | null {
  const jq = (win as unknown as { jQuery?: JQuery }).jQuery;
  const plugin = jq?.(alvo).qrcode;
  if (!jq || typeof plugin !== "function") return null;
  alvo.replaceChildren();
  try {
    jq(alvo).qrcode?.(opcoes);
  } catch {
    alvo.replaceChildren();
    return null;
  }
  return alvo.querySelector<HTMLImageElement | HTMLCanvasElement>("img, canvas");
}
