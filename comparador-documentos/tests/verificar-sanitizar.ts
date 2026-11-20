import { lerBlocos } from "@cd/modelo/blocos";
import { urlSegura } from "@cd/modelo/sanitizar";
import { DOMParser } from "linkedom";
import { checar, igual, secao } from "./util";

const parser = new DOMParser() as unknown as globalThis.DOMParser;
const html = (corpo: string): string =>
  lerBlocos(`<html><body>${corpo}</body></html>`, parser)
    .blocos.map((b) => b.html)
    .join("|");

export function verificarSanitizar(): void {
  secao("sanitizar");

  igual("relativa passa", urlSegura("href", "arquivo.html"), true);
  igual("ancora passa", urlSegura("href", "#nota"), true);
  igual("http e https passam", [urlSegura("href", "http://a.br"), urlSegura("href", "https://a.br/x")], [true, true]);
  igual("mailto e tel passam", [urlSegura("href", "mailto:a@b.br"), urlSegura("href", "tel:+551")], [true, true]);
  igual("javascript: cai", urlSegura("href", "javascript:alert(1)"), false);
  igual("javascript: com espacos e controles cai", urlSegura("href", " \tjava\nscript\u0000:alert(1)"), false);
  igual("vbscript: cai", urlSegura("href", "vbscript:x"), false);
  igual("data:text/html cai em href", urlSegura("href", "data:text/html,<script>x</script>"), false);
  igual(
    "data:image so passa em src",
    [urlSegura("src", "data:image/png;base64,AAAA"), urlSegura("href", "data:image/png;base64,AAAA")],
    [true, false],
  );
  igual("data:image/svg+xml cai (pode ter script)", urlSegura("src", "data:image/svg+xml;base64,AAAA"), false);

  checar(
    "iframe, object, embed e frame saem com o conteudo",
    !/iframe|object|embed|frame|payload/i.test(
      html('<p>a</p><iframe srcdoc="<script>payload()</script>"></iframe><object data="x"></object><embed src="x"><p>b</p>'),
    ),
    html("<p>a</p><iframe></iframe>"),
  );
  checar("base sai", !/<base/i.test(html('<base href="https://mau.example/"><p>a</p>')), "");
  checar(
    "srcdoc, formaction e action saem",
    !/srcdoc|formaction|action=/i.test(
      html('<p>a<button formaction="javascript:x()">b</button></p><form action="javascript:x()"><p>c</p></form>'),
    ),
    html('<form action="javascript:x()"><p>c</p></form>'),
  );
  checar("form mantem o conteudo", html('<form action="x"><p>texto do form</p></form>').includes("texto do form"), "");
  checar(
    "href com javascript: mascarado cai",
    !/javascript/i.test(html('<p><a href="  jav&#x0A;ascript:alert(1)">x</a></p>')),
    html('<p><a href="  jav&#x0A;ascript:alert(1)">x</a></p>'),
  );
  checar("src de img com javascript: cai", !/javascript/i.test(html('<p><img src="javascript:alert(1)"></p>')), "");
  checar("on* em svg cai", !/onload/i.test(html('<p><svg onload="x()"><circle/></svg></p>')), "");
  checar("link http preservado", html('<p><a href="https://sei.gov.br/x">x</a></p>').includes('href="https://sei.gov.br/x"'), "");
}
