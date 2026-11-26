import { areaMemoria } from "@comum/armazenamento/area";
import { disparar } from "../../sei-comum/tests/util";
import { agrupadorDoTr } from "../src/nucleo/itens";
import { CHAVE_MODO, garantirBotaoPastas } from "../src/ui/botao";
import {
  atualizarCaption,
  contarLinhasVisiveis,
  filtrarPorPasta,
  ligarAoSortDaTabela,
  pintarPastas,
  prepararTabela,
  removerTabela,
} from "../src/ui/colunaPasta";
import { checar, docDe, docFixture, teste } from "./util";

await teste("prepararTabela insere a coluna Pasta e marca as linhas", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  const ths = [...doc.querySelectorAll("table.infraTable thead th")].map((t) => (t.textContent ?? "").trim());
  checar("coluna depois do checkbox", ths[1] === "Pasta");
  const linhas = [...doc.querySelectorAll("tr[data-spro-agrupador]")];
  checar("tres linhas", linhas.length === 3);
  checar("agrupador do primeiro", linhas[0]?.getAttribute("data-spro-agrupador") === "40");
  checar("celula da pasta", linhas[0]?.querySelector("td.spro-cel-pasta") !== null);
});

await teste("prepararTabela e idempotente", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  const ths = doc.querySelectorAll("table.infraTable thead th").length;
  const tds = doc.querySelectorAll("td.spro-cel-pasta").length;
  prepararTabela(doc, agrupadorDoTr);
  checar("nao duplica th", doc.querySelectorAll("table.infraTable thead th").length === ths);
  checar("nao duplica td", doc.querySelectorAll("td.spro-cel-pasta").length === tds);
});

await teste("pintarPastas escreve o caminho de cada item", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  pintarPastas(doc, (agrupador) => (agrupador === "40" ? "Fiscalizacao › Notas" : "Sem pasta"));
  const linhas = [...doc.querySelectorAll("tr[data-spro-agrupador]")];
  checar("rotulo do 40", linhas[0]?.querySelector("td.spro-cel-pasta")?.textContent === "Fiscalizacao › Notas");
  checar("rotulo dos outros", linhas[1]?.querySelector("td.spro-cel-pasta")?.textContent === "Sem pasta");
});

await teste("filtrarPorPasta esconde e restaura as linhas", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  const linhas = [...doc.querySelectorAll("tr[data-spro-agrupador]")] as HTMLElement[];
  filtrarPorPasta(doc, new Set(["40"]));
  checar("mantem o 40", linhas[0]?.style.display === "");
  checar("esconde o segundo", linhas[1]?.style.display === "none");
  checar("esconde o terceiro", linhas[2]?.style.display === "none");
  filtrarPorPasta(doc, null);
  checar("restaura", linhas[1]?.style.display === "");
});

await teste("atualizarCaption usa singular e plural", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  atualizarCaption(doc, 1);
  checar("singular", (doc.querySelector("caption.infraCaption")?.textContent ?? "").endsWith("(1 registro):"));
  atualizarCaption(doc, 3);
  checar("plural", (doc.querySelector("caption.infraCaption")?.textContent ?? "").endsWith("(3 registros):"));
});

await teste("ligarAoSortDaTabela reaplica no sortEnd e desliga", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  const tabela = doc.querySelector("table.infraTable") as unknown as HTMLElement;
  let n = 0;
  const desligar = ligarAoSortDaTabela(doc, () => n++);
  disparar(tabela, "sortEnd");
  checar("reaplicou", n === 1);
  desligar();
  disparar(tabela, "sortEnd");
  checar("desligou", n === 1);
});

await teste("garantirBotaoPastas cria o botao, alterna e persiste", async () => {
  const doc = docDe('<html><body><div id="divInfraBarraComandosSuperior"></div></body></html>');
  const area = areaMemoria();
  const modos: string[] = [];
  garantirBotaoPastas(doc, area, (m) => modos.push(m));
  const botao = doc.querySelector("#btnSproPastas") as unknown as HTMLElement;
  checar("botao criado", botao?.classList.contains("infraButton") === true);
  checar("rotulo com tecla", botao.textContent === "Pastas");
  disparar(botao, "click");
  checar("primeiro clique vai para lista", modos[0] === "lista");
  disparar(botao, "click");
  checar("segundo clique volta para arvore", modos[1] === "arvore");
  await new Promise((r) => setTimeout(r, 0));
  checar("modo persistido", (await area.obter(CHAVE_MODO))[CHAVE_MODO] === "arvore");
  garantirBotaoPastas(doc, area, () => undefined);
  checar("nao duplica", doc.querySelectorAll("#btnSproPastas").length === 1);
});

await teste("todas as linhas com td ficam alinhadas com o cabecalho", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  const ths = doc.querySelectorAll("table.infraTable thead th").length;
  const linhas = [...doc.querySelectorAll("table.infraTable tr")].filter((tr) => tr.querySelector("td"));
  checar("linhas existem", linhas.length > 0);
  checar(
    "alinhamento",
    linhas.every((tr) => tr.querySelectorAll("td").length === ths),
  );
  const celulas = [...doc.querySelectorAll("td[data-spro-cel-pasta]")];
  checar(
    "data-label",
    celulas.every((td) => td.getAttribute("data-label") === "Pasta"),
  );
});

await teste("removerTabela devolve a tabela nativa", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  const antes = doc.querySelectorAll("table.infraTable thead th").length;
  prepararTabela(doc, agrupadorDoTr);
  removerTabela(doc);
  checar("th removido", doc.querySelectorAll("table.infraTable thead th").length === antes);
  checar("sem marcas", doc.querySelectorAll("[data-spro-agrupador]").length === 0 && doc.querySelectorAll(".spro-cel-pasta").length === 0);
});

await teste("contarLinhasVisiveis acompanha o filtro", () => {
  const doc = docFixture("base_conhecimento_listar.html");
  prepararTabela(doc, agrupadorDoTr);
  checar("todas", contarLinhasVisiveis(doc) === 3);
  filtrarPorPasta(doc, new Set(["40"]));
  checar("filtrado", contarLinhasVisiveis(doc) === 1);
});
