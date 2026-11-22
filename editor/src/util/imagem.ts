/**
 * Baixa a imagem e a devolve como data URI PNG (via canvas), para embuti-la no documento: o SEI nao deve
 * depender de imagem hospedada fora. Exige que o servidor da imagem permita CORS (`crossOrigin = anonymous`);
 * sem isso o canvas fica "contaminado" e a conversao falha.
 */
export function imagemParaDataUri(win: Window & typeof globalThis, src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new win.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = win.document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("imagem nao carregou"));
    img.src = src;
  });
}
