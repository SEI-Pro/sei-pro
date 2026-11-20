import { lerBlocos } from "@cd/modelo/blocos";
import { DOMParser } from "linkedom";
import { checar, igual, secao } from "./util";

const parser = new DOMParser() as unknown as globalThis.DOMParser;
// Fragmento vira documento completo (o linkedom nao cria o corpo quando a entrada comeca em <body>).
const ler = (html: string) => lerBlocos(/^<html/i.test(html) ? html : `<html><body>${html}</body></html>`, parser);
const textos = (html: string) => ler(html).blocos.map((b) => b.texto);

export function verificarBlocos(): void {
  secao("blocos");

  igual(
    "head, style, script e comentario nao geram bloco",
    textos("<html><head><title>t</title><style>p{}</style></head><body><!-- c --><script>x()</script><p>a</p></body></html>"),
    ["a"],
  );

  igual(
    "p, li, h1..h6, td e th sao folhas na ordem do documento",
    textos("<h1>t</h1><p>um</p><ul><li>dois</li></ul><table><tr><th>tres</th><td>quatro</td></tr></table>"),
    ["t", "um", "dois", "tres", "quatro"],
  );

  igual("texto solto entre blocos vira bloco proprio", textos("<div>solto<p>x</p></div>"), ["solto", "x"]);

  igual(
    "tabela aninhada: so as folhas mais internas",
    textos("<table><tr><td><table><tr><td>fundo</td></tr></table></td><td>lado</td></tr></table>"),
    ["fundo", "lado"],
  );

  const img = ler('<body><p><img src="a.png"></p><p><img src="a.png"></p></body>');
  igual(
    "bloco so com imagem conta pelo src",
    img.blocos.map((b) => b.texto),
    ["[img:a.png]", "[img:a.png]"],
  );

  const vazio = ler("<html><body></body></html>");
  igual("documento vazio nao gera bloco", vazio.blocos.length, 0);
  igual("documento vazio: folhas vazias", vazio.folhas.length, 0);

  const onclick = ler('<body><p onclick="x()">a <a href="javascript:y()">b</a></p></body>');
  checar("onclick nao vai para o html do bloco", !/onclick/i.test(onclick.blocos[0]!.html), onclick.blocos[0]!.html);
  checar("javascript: nao vai para o html do bloco", !/javascript:/i.test(onclick.blocos[0]!.html), onclick.blocos[0]!.html);

  const par = ler("<p>  muitos   espacos\n aqui &amp; ali </p>");
  igual("texto colapsa espacos e decodifica entidades", par.blocos[0]!.texto, "muitos espacos aqui & ali");
  igual("folhas e blocos alinhados", par.folhas.length, par.blocos.length);
}
