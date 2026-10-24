import { comOpcaoLegada, definirOpcaoLegada, lerOpcaoLegada, opcaoLegadaLigada, opcaoLegadaMarcada } from "../src/opcoes/legadas";
import { checar, secao } from "./util";

const dv = (configGeral: Array<{ name: string; value: unknown }>) => JSON.stringify([{ baseTipo: "x" }, { configGeral }]);

export async function verificarOpcoes(): Promise<void> {
  secao("opcoes legadas (mesma regra de checkConfigValue)");
  checar("desligada", !opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: false }]), "gerenciarfavoritos"));
  checar("ligada", opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: true }]), "gerenciarfavoritos"));
  checar("ausente conta como ligada", opcaoLegadaLigada(dv([{ name: "outra", value: false }]), "gerenciarfavoritos"));
  checar("valor nulo conta como ligado", opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: null }]), "gerenciarfavoritos"));
  checar("zero desliga, como no == false", !opcaoLegadaLigada(dv([{ name: "gerenciarfavoritos", value: 0 }]), "gerenciarfavoritos"));
  checar("sem configuracao, tudo ligado", opcaoLegadaLigada("", "gerenciarfavoritos") && opcaoLegadaLigada("[]", "gerenciarfavoritos"));
  checar("JSON quebrado nao derruba (fica ligado)", opcaoLegadaLigada("{quebrado", "gerenciarfavoritos"));
  checar("aceita a lista ja analisada", !opcaoLegadaLigada([{ configGeral: [{ name: "a", value: false }] }], "a"));
  const falso = { get: async () => ({ dataValues: dv([{ name: "a", value: false }]) }) } as unknown as Pick<
    chrome.storage.StorageArea,
    "get"
  >;
  checar("lerOpcaoLegada le do sync", (await lerOpcaoLegada("a", falso)) === false);

  secao("opcoes legadas desligadas por padrao (mesma regra de verifyConfigValue)");
  checar("marcada liga", opcaoLegadaMarcada(dv([{ name: "nova", value: true }]), "nova"));
  checar("desmarcada desliga", !opcaoLegadaMarcada(dv([{ name: "nova", value: false }]), "nova"));
  checar("ausente conta como desligada", !opcaoLegadaMarcada(dv([{ name: "outra", value: true }]), "nova"));
  checar("valor nulo conta como desligado", !opcaoLegadaMarcada(dv([{ name: "nova", value: null }]), "nova"));
  checar("um liga, como no == true", opcaoLegadaMarcada(dv([{ name: "nova", value: 1 }]), "nova"));
  checar(
    "sem configuracao, desligada",
    !opcaoLegadaMarcada("", "nova") && !opcaoLegadaMarcada("[]", "nova") && !opcaoLegadaMarcada(undefined, "nova"),
  );
  checar("JSON quebrado nao derruba (fica desligada)", !opcaoLegadaMarcada("{quebrado", "nova"));
  checar("aceita a lista ja analisada", opcaoLegadaMarcada([{ configGeral: [{ name: "a", value: true }] }], "a"));

  secao("opcoes legadas: gravar");
  const lerGeral = (j: string | null) => (j ? (JSON.parse(j)[1].configGeral as Array<{ name: string; value: unknown }>) : null);
  const ligou = comOpcaoLegada(
    dv([
      { name: "gradecontrole", value: false },
      { name: "outra", value: true },
    ]),
    "gradecontrole",
    true,
  );
  checar(
    "liga a opcao que estava desligada e preserva o resto do perfil",
    lerGeral(ligou)?.find((o) => o.name === "gradecontrole")?.value === true &&
      lerGeral(ligou)?.find((o) => o.name === "outra")?.value === true &&
      JSON.parse(ligou as string)[0].baseTipo === "x",
  );
  checar(
    "opcao ausente e acrescentada",
    lerGeral(comOpcaoLegada(dv([{ name: "outra", value: true }]), "gradecontrole", true))?.some(
      (o) => o.name === "gradecontrole" && o.value === true,
    ) === true,
  );
  checar("ja estava assim: nada a gravar", comOpcaoLegada(dv([{ name: "gradecontrole", value: true }]), "gradecontrole", true) === null);
  checar(
    "sem perfil legivel nao inventa estrutura",
    comOpcaoLegada("", "g", true) === null &&
      comOpcaoLegada("[]", "g", true) === null &&
      comOpcaoLegada("{quebrado", "g", true) === null &&
      comOpcaoLegada(undefined, "g", true) === null,
  );
  checar(
    "aceita a lista ja analisada",
    lerGeral(JSON.stringify([{}, ...JSON.parse(comOpcaoLegada([{}, { configGeral: [] }], "a", true) as string).slice(1)]))?.[0]?.name ===
      "a",
  );
  const gravados: Array<Record<string, unknown>> = [];
  const area = {
    get: async () => ({ dataValues: dv([{ name: "gradecontrole", value: false }]) }),
    set: async (o: Record<string, unknown>) => void gravados.push(o),
  };
  checar(
    "definirOpcaoLegada grava em dataValues",
    (await definirOpcaoLegada("gradecontrole", true, area as never)) === true && gravados.length === 1 && "dataValues" in gravados[0]!,
  );
  checar(
    "e nao grava de novo quando ja esta igual",
    (await definirOpcaoLegada("gradecontrole", false, {
      ...area,
      get: async () => ({ dataValues: dv([{ name: "gradecontrole", value: false }]) }),
    } as never)) === false,
  );
}
