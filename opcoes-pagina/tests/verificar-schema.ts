import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import { OPCOES_COMPLEMENTOS, SECOES_GERAL, todasAsOpcoes } from "../src/schema";
import { checar, secao } from "./util";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "options-legado.html");
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const nomeDe = (el: Element) => el.getAttribute("data-name") ?? "";

/** Opcoes que existiam na pagina legada e foram removidas de proposito (pedido do usuario em 10/10/2026). */
export const REMOVIDAS = ["gerenciarformularios", "natjus", "sincronizarprocessos"];
/** Opcoes novas, que nao existiam na pagina legada (Demandas, versao 2.8; alerta de processo parado da capa nova; Modelo limpo). */
export const ADICIONADAS = ["gerenciardemandas", "gradecontrole", "processoparado", "filtroarvore", "modelolimpo"];

export function verificarSchema(): void {
  secao("schema: paridade com a pagina de opcoes legada");
  const { document: doc } = parseHTML(readFileSync(FIXTURE, "latin1")) as unknown as { document: Document };
  const todosLegados = [...doc.querySelectorAll<HTMLElement>('[id^="itemConfigGeral_"]')];
  const legados = todosLegados.filter((el) => !REMOVIDAS.includes(nomeDe(el)));
  const schema = new Map(todasAsOpcoes().map((o) => [o.nome, o]));

  checar(
    "73 no legado; 75 no schema (menos as 3 removidas, mais as 5 adicionadas)",
    todosLegados.length === 73 && legados.length === 70 && schema.size === 75 && todasAsOpcoes().length === 75,
    {
      legado: todosLegados.length,
      schema: schema.size,
    },
  );
  for (const n of REMOVIDAS) checar(`${n}: removida do schema`, !schema.has(n));
  for (const n of ADICIONADAS)
    checar(`${n}: adicionada ao schema e ausente do legado`, schema.has(n) && !todosLegados.some((el) => nomeDe(el) === n));
  const parado = schema.get("processoparado");
  checar(
    "processoparado: numero em dias, padrao 15, 0 desliga, logo depois de infoarvore",
    parado?.tipo === "numero" &&
      parado.padrao === 15 &&
      parado.min === 0 &&
      (parado.max ?? 0) >= 365 &&
      !parado.dependencias &&
      SECOES_GERAL.flatMap((x) => x.opcoes.map((o) => o.nome)).indexOf("infoarvore") + 1 ===
        SECOES_GERAL.flatMap((x) => x.opcoes.map((o) => o.nome)).indexOf("processoparado"),
  );
  const filtro = schema.get("filtroarvore");
  checar(
    "filtroarvore: chave ligada por padrao, so no Lab, logo depois de processoparado",
    filtro?.tipo === "chave" &&
      filtro.padrao === true &&
      filtro.visivelEm === "lab" &&
      !filtro.dependencias &&
      SECOES_GERAL.flatMap((x) => x.opcoes.map((o) => o.nome)).indexOf("processoparado") + 1 ===
        SECOES_GERAL.flatMap((x) => x.opcoes.map((o) => o.nome)).indexOf("filtroarvore"),
  );
  checar("processoparado: so no Lab", parado?.visivelEm === "lab");
  const demandas = schema.get("gerenciardemandas");
  checar(
    "gerenciardemandas: chave ligada por padrao, logo depois de Gerenciar Projetos, com manual e ajuda",
    demandas?.tipo === "chave" &&
      demandas.padrao === true &&
      demandas.manual === "DEMANDAS" &&
      (demandas.ajuda ?? "").includes("Texto Padrão") &&
      JSON.stringify(SECOES_GERAL[0].opcoes.map((o) => o.nome).slice(1, 3)) === JSON.stringify(["gerenciarprojetos", "gerenciardemandas"]),
  );

  for (const el of legados) {
    const nome = nomeDe(el);
    const o = schema.get(nome);
    if (!o) {
      checar(`${nome}: existe no schema`, false);
      continue;
    }
    const linha = el.closest("tr") as Element;
    const tipoAttr = el.getAttribute("type");
    const tipo = el.tagName === "SELECT" ? "selecao" : tipoAttr === "checkbox" ? "chave" : tipoAttr === "number" ? "numero" : "texto";
    const padrao =
      tipo === "chave"
        ? el.hasAttribute("checked")
        : tipo === "numero"
          ? Number(el.getAttribute("value"))
          : tipo === "texto"
            ? (el.getAttribute("value") ?? "")
            : (el.querySelector("option")?.getAttribute("value") ?? "");
    const icone = (linha.querySelector("i.iconPopup")?.className ?? "")
      .split(/\s+/)
      .filter((c) => c && c !== "iconPopup" && !/Color$/.test(c))
      .join(" ");
    const href = linha.querySelector("a[href]")?.getAttribute("href") ?? undefined;
    const manual = href ? (/\/pages\/([A-Z0-9]+)\.html$/.exec(href)?.[1] ?? href) : undefined;

    checar(`${nome}: id`, el.getAttribute("id") === `itemConfigGeral_${nome}`);
    checar(`${nome}: tipo`, o.tipo === tipo, { schema: o.tipo, legado: tipo });
    checar(`${nome}: padrao`, o.padrao === padrao, { schema: o.padrao, legado: padrao });
    checar(`${nome}: rotulo`, o.rotulo === norm(linha.querySelector(".info")?.textContent ?? ""), o.rotulo);
    checar(`${nome}: icone`, o.icone === icone, { schema: o.icone, legado: icone });
    checar(`${nome}: manual`, o.manual === manual, { schema: o.manual, legado: manual });
    checar(
      `${nome}: visibilidade por produto`,
      (o.visivelEm === "lab") === linha.classList.contains("lab") && (o.visivelEm === "fora-antaq") === linha.classList.contains("notatq"),
    );
    if (tipo === "selecao") checar(`${nome}: escolhas`, (o.escolhas?.length ?? -1) === el.querySelectorAll("option").length);
    if (tipo === "numero") checar(`${nome}: faixa`, o.min === Number(el.getAttribute("min")) && o.max === Number(el.getAttribute("max")));
  }

  const secoesLegado = [...doc.querySelectorAll("#accordion > div")].map((d) =>
    [...d.querySelectorAll('[id^="itemConfigGeral_"]')].map(nomeDe),
  );
  for (const [i, s] of SECOES_GERAL.entries())
    checar(
      `secao ${s.id}: mesmas opcoes, mesma ordem`,
      JSON.stringify(s.opcoes.map((o) => o.nome).filter((n) => !ADICIONADAS.includes(n))) === JSON.stringify(secoesLegado[i]),
    );
  checar(
    "complementos: mesmas opcoes, mesma ordem",
    JSON.stringify(OPCOES_COMPLEMENTOS.map((o) => o.nome)) ===
      JSON.stringify(
        [...doc.querySelectorAll('#options-complements [id^="itemConfigGeral_"]')].map(nomeDe).filter((n) => !REMOVIDAS.includes(n)),
      ),
  );

  secao("schema: dependencias");
  const chaves = new Set(
    todasAsOpcoes()
      .filter((o) => o.tipo === "chave")
      .map((o) => o.nome),
  );
  for (const o of todasAsOpcoes())
    for (const d of o.dependencias ?? []) checar(`${o.nome}: depende de chave existente (${d.de})`, chaves.has(d.de));
  const dep = (n: string) => JSON.stringify(schema.get(n)?.dependencias ?? []);
  checar(
    "sortbeforeupload desmarca ao esconder",
    dep("sortbeforeupload") === JSON.stringify([{ de: "uploaddocsexternos", quando: true, limparAoEsconder: true }]),
  );
  checar("newdocsigilo: newdocdefault ligado e newdocnivel desligado", dep("newdocsigilo").includes('"newdocnivel","quando":false'));
  checar("salvamentoautomatico fica oculta", schema.get("salvamentoautomatico")?.oculta === true);
  checar(
    "so salvamentoautomatico e oculta sempre (as linhas do Lab aparecem no Lab)",
    todasAsOpcoes().filter((o) => o.oculta).length === 1,
  );
}
