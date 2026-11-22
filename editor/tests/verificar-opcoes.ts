import { checkOpcao, verifyOpcao } from "../src/opcoes";
import { checar, secao } from "./util";

function armazem(valor: string | null): Pick<Storage, "getItem"> {
  return { getItem: (k: string) => (k === "configBasePro" ? valor : null) };
}

export function verificarOpcoes(): void {
  secao("opcoes");
  const cfg = armazem(
    JSON.stringify([
      {
        configGeral: [
          { name: "x", value: false },
          { name: "y", value: true },
        ],
      },
    ]),
  );
  checar("checkOpcao: valor false desliga", checkOpcao("x", cfg) === false);
  checar("checkOpcao: valor true liga", checkOpcao("y", cfg) === true);
  checar("checkOpcao: ausente conta como ligada", checkOpcao("ausente", cfg) === true);
  checar("verifyOpcao: ausente conta como desligada", verifyOpcao("ausente", cfg) === false);
  checar("verifyOpcao: valor true liga", verifyOpcao("y", cfg) === true);
  checar("verifyOpcao: valor false desliga", verifyOpcao("x", cfg) === false);
  for (const [rotulo, bruto] of [
    ["vazio", ""],
    ["ausente (null)", null],
    ["JSON invalido", "{nao-json"],
  ] as const) {
    const s = armazem(bruto);
    let lancou = false;
    let c = false;
    try {
      c = checkOpcao("x", s);
    } catch {
      lancou = true;
    }
    checar(`configBasePro ${rotulo}: checkOpcao liga e nao lanca`, !lancou && c === true);
  }
}
