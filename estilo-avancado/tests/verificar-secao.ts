import { CONFIG_PADRAO, type ConfigTema } from "@comum/tema/config";
import { montarSecaoAparencia } from "../src/opcoes/secao";
import { checar, disparar, instalarDom, secao, tique } from "./util";

export async function verificarSecao(): Promise<void> {
  secao("secao Aparencia");
  const doc = instalarDom("<html><head></head><body></body></html>");
  const g: { salvo: ConfigTema | null; vezes?: number } = { salvo: null, vezes: 0 };
  const deps = {
    ler: async () => ({ versao: 1, ativo: false, modo: "auto", paleta: "sei-pro", corBarra: "#1f5fbf", escurecerDocumentos: true }),
    gravar: async (c: ConfigTema) => {
      g.salvo = c;
      g.vezes = (g.vezes ?? 0) + 1;
    },
    sistemaEscuro: () => false,
  };
  const el = await montarSecaoAparencia(deps);
  doc.body.append(el);

  checar("18 paletas na grade", el.querySelectorAll("[data-paleta]").length === 18);
  checar("3 modos", el.querySelectorAll("[data-modo]").length === 3);
  checar("modo automatico marcado", el.querySelector('[data-modo="auto"]')?.getAttribute("aria-checked") === "true");
  checar("paleta SEI Pro marcada", el.querySelector('[data-paleta="sei-pro"]')?.getAttribute("aria-pressed") === "true");

  const chaveAtivo = el.querySelector('input[role="switch"]') as HTMLInputElement;
  chaveAtivo.checked = true;
  disparar(chaveAtivo, "change");
  await tique();
  checar("ligar grava ativo:true", g.salvo?.ativo === true);

  (el.querySelector('[data-paleta="floresta"]') as HTMLElement).click();
  await tique();
  checar("escolher paleta grava a cor dela", g.salvo?.paleta === "floresta" && g.salvo?.corBarra === "#1f7a4d");
  checar(
    "previa recebe os tokens da cor",
    (el.querySelector(".spro-ap-previa") as HTMLElement).style.getPropertyValue("--spro-barra") !== "",
  );

  const livre = el.querySelector('input[type="color"]') as HTMLInputElement;
  // SEI Pro Lab: arrastar o seletor (varios "input") nao grava a cada movimento; grava uma vez ao soltar ("change").
  const antes = g.vezes ?? 0;
  for (const c of ["#aa0000", "#aa1111", "#aa2222", "#aa3366"]) {
    livre.value = c;
    disparar(livre, "input");
  }
  await tique();
  checar("arrastar o seletor nao grava a cada movimento", (g.vezes ?? 0) === antes);
  disparar(livre, "change");
  await tique();
  checar(
    "cor livre grava paleta livre (uma vez, ao soltar)",
    g.salvo?.paleta === "livre" && g.salvo?.corBarra === "#aa3366" && (g.vezes ?? 0) === antes + 1,
  );

  (el.querySelector('[data-modo="escuro"]') as HTMLElement).click();
  await tique();
  checar(
    "modo escuro gravado e marcado",
    g.salvo?.modo === "escuro" && el.querySelector('[data-modo="escuro"]')?.getAttribute("aria-checked") === "true",
  );

  const restaurar = [...el.querySelectorAll("button")].find((b) => b.textContent === "Restaurar padrão") as HTMLElement;
  restaurar.click();
  await tique();
  checar(
    "restaurar volta ao padrao mas mantem ligado",
    g.salvo?.modo === CONFIG_PADRAO.modo && g.salvo?.corBarra === CONFIG_PADRAO.corBarra && g.salvo?.ativo === true,
  );

  (el.querySelector('[data-paleta="floresta"]') as HTMLElement).click();
  (el.querySelector('[data-modo="escuro"]') as HTMLElement).click();
  await tique();
  checar(
    "paleta pronta no escuro: sem aviso (escurecer a barra e esperado)",
    (el.querySelector(".spro-ap-aviso")?.textContent ?? "") === "",
  );

  const meio = el.querySelector('input[type="color"]') as HTMLInputElement;
  meio.value = "#c06020";
  disparar(meio, "input");
  await tique();
  checar(
    "cor de tom medio (sem contraste nem com branco nem com preto) mostra aviso",
    (el.querySelector(".spro-ap-aviso")?.textContent ?? "").includes("Ajustamos"),
  );
}
