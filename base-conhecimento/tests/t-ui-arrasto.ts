import { lerArrasto, MIME_ARRASTO, serializarArrasto } from "../src/ui/arrasto";
import { checar, teste } from "./util";

function fakeDt(mime: string, valor: string): DataTransfer {
  const dados: Record<string, string> = { [mime]: valor };
  return {
    setData: (t: string, v: string) => {
      dados[t] = v;
    },
    getData: (t: string) => dados[t] ?? "",
  } as unknown as DataTransfer;
}

await teste("payload de arrasto ida e volta", () => {
  checar(
    "item",
    JSON.stringify(lerArrasto(fakeDt(MIME_ARRASTO, serializarArrasto({ tipo: "item", agrupador: "40" })))) ===
      JSON.stringify({ tipo: "item", agrupador: "40" }),
  );
  checar(
    "pasta",
    JSON.stringify(lerArrasto(fakeDt(MIME_ARRASTO, serializarArrasto({ tipo: "pasta", id: "p1" })))) ===
      JSON.stringify({ tipo: "pasta", id: "p1" }),
  );
});

await teste("payload invalido devolve null", () => {
  checar("mime errado", lerArrasto(fakeDt("text/plain", serializarArrasto({ tipo: "item", agrupador: "1" }))) === null);
  checar("vazio", lerArrasto(fakeDt(MIME_ARRASTO, "")) === null);
  checar("json invalido", lerArrasto(fakeDt(MIME_ARRASTO, "{")) === null);
  checar("forma invalida", lerArrasto(fakeDt(MIME_ARRASTO, JSON.stringify({ tipo: "pasta" }))) === null);
  checar("sem dataTransfer", lerArrasto(null) === null);
});
