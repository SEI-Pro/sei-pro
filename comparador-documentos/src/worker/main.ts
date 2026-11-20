/** Web Worker da comparação: recebe os blocos dos dois documentos e devolve a Edicao (nada de DOM aqui). */
import { type Pedido, tratar } from "./protocolo";

const escopo = self as unknown as {
  onmessage: ((e: { data: Pedido }) => void) | null;
  postMessage(m: unknown): void;
};

escopo.onmessage = (e) => escopo.postMessage(tratar(e.data));
