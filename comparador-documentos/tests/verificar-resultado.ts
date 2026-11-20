import { lerBlocos } from "@cd/modelo/blocos";
import { compararBlocos } from "@cd/modelo/diff";
import { montarResultado, semDiferencas } from "@cd/modelo/resultado";
import { DOMParser } from "linkedom";
import { checar, igual, secao } from "./util";

const parser = new DOMParser() as unknown as globalThis.DOMParser;
const doc = (corpo: string, cabeca = ""): string => `<html><head>${cabeca}</head><body>${corpo}</body></html>`;

function comparar(antes: string, depois: string): { html: string; sem: boolean } {
  const a = lerBlocos(antes, parser);
  const d = lerBlocos(depois, parser);
  const ed = compararBlocos(a.blocos, d.blocos);
  return { html: montarResultado(d, ed, parser), sem: semDiferencas(ed) };
}

export function verificarResultado(): void {
  secao("resultado");

  const tab = comparar(
    doc("<table><tr><td>codigo 1</td><td>valor antigo da clausula</td></tr></table><p>fim</p>"),
    doc("<table><tr><td>codigo 1</td><td>valor novo da clausula</td></tr></table><p>fim</p>"),
  );
  checar(
    "tabela preservada com o diff dentro da celula",
    /<table>.*<td>codigo 1<\/td><td>.*<del.*antigo.*<ins.*novo.*<\/td>.*<\/table>/s.test(tab.html),
    tab.html,
  );
  igual("com diferencas: semDiferencas falso", tab.sem, false);

  const rem = comparar(doc("<p>um</p><p>este paragrafo vai sair do documento</p><p>tres</p>"), doc("<p>um</p><p>tres</p>"));
  const posDel = rem.html.indexOf("<del");
  checar("removido aparece entre os vizinhos", rem.html.indexOf(">um<") < posDel && posDel < rem.html.indexOf(">tres<"), rem.html);

  const dois = comparar(
    doc("<p>um</p><p>primeiro removido do antes</p><p>segundo removido do antes</p><p>tres</p>"),
    doc("<p>um</p><p>tres</p>"),
  );
  checar(
    "removidos consecutivos mantem a ordem do antes",
    dois.html.indexOf("primeiro removido") > 0 && dois.html.indexOf("primeiro removido") < dois.html.indexOf("segundo removido"),
    dois.html,
  );

  const fim = comparar(doc("<p>um</p><p>sobrou no antes</p>"), doc("<p>um</p>"));
  checar("removido no fim fica depois do ultimo bloco", fim.html.indexOf(">um<") < fim.html.indexOf("<del"), fim.html);

  const mau = comparar(
    doc("<p>x</p>"),
    doc(
      '<p onclick="a()">novo <a href="javascript:b()">link</a></p><script>c()</script>',
      '<script>d()</script><style>p{color:red}</style><link rel="stylesheet" href="x.css">',
    ),
  );
  checar("script, onclick e javascript: nao chegam ao resultado", !/<script|onclick|javascript:|c\(\)|d\(\)/i.test(mau.html), mau.html);
  checar("estilo inline do cabecalho e mantido, link externo nao", mau.html.includes("p{color:red}") && !/<link/i.test(mau.html), mau.html);

  const imgs = comparar(
    doc("<p>x</p>"),
    doc('<p><img src="a.png"></p><p>texto no meio</p><p><img src="a.png"></p><p><img src="b.png"></p>'),
  );
  igual("imagens com o mesmo src: so a primeira", (imgs.html.match(/src="a\.png"/g) ?? []).length, 1);
  checar("imagem de outro src fica", imgs.html.includes('src="b.png"'), imgs.html);

  const vazio = comparar(doc(""), doc(""));
  checar("documentos vazios: html valido", /^<html>.*<\/html>$/s.test(vazio.html), vazio.html);
  igual("documentos vazios: sem diferencas", vazio.sem, true);

  const igualdade = comparar(doc("<p>mesmo texto</p>"), doc("<p>mesmo texto</p>"));
  igual("iguais: sem diferencas", igualdade.sem, true);

  const delNativo = comparar(doc("<p>valor <del>antigo</del> igual</p>"), doc("<p>valor <del>antigo</del> igual</p>"));
  igual("del do proprio documento nao conta como diferenca", delNativo.sem, true);
}
