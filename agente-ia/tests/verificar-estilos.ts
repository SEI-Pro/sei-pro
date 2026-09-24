/**
 * Os estilos que o EDITOR daquele documento oferece, naquele órgão.
 *
 * Por que ler do editor em vez de usar uma lista fixa: o conjunto de estilos é
 * configurável por órgão e por SEÇÃO do modelo. Uma lista fixa acerta no órgão
 * de quem a escreveu e erra silenciosamente nos outros — o SEI simplesmente
 * ignora a classe que não existe, e o documento sai sem formatação.
 *
 * De onde sai, conferido nas fontes do SEI 5.0.0:
 * - CK4 (`EditorCk4RN.php`): cada `CKEDITOR.replace` traz
 *   `stylesheetParser_validSelectors: /^(p)\.(A|B|C)$/i` com as classes daquela
 *   seção;
 * - CK5 (`EditorCk5RN.php` + `InfraEditorCK5.php`): `setConfiguracao` com chave
 *   pontuada vira objeto ANINHADO, então a lista está em
 *   `INFRA_EDITOR_CONFIG.estilo.itens` (`{nome, classeCss, permitidoEm}`), e o
 *   padrão de cada seção em `estilo.estiloPadrao`.
 */

import { lerEditor } from "@nucleo/dominio/editor";
import { DOMParser } from "linkedom";
import { checar, secao } from "./util";

const parser = new DOMParser();
const pagina = (html: string) => ({ url: "https://sei.exemplo.gov.br/sei/controlador.php?acao=editor_montar", status: 200, html, get doc() { return parser.parseFromString(html, "text/html") as unknown as Document; } });

const CK4 = `<html><body>
<textarea name="txaEditor_11" style="display:none;">&lt;p&gt;corpo&lt;/p&gt;</textarea>
<textarea name="txaEditor_12" style="display:none;">&lt;p&gt;fecho&lt;/p&gt;</textarea>
<script>
CKEDITOR.replace('txaEditor_11',{filebrowserUploadUrl:"x","toolbar":toolbar,"stylesheetParser_validSelectors":/^(p)\\.(Texto_Justificado|Paragrafo_Numerado_Nivel1|Citacao)$/i,disableNativeSpellChecker:false,"readOnly":false,title:"Corpo do Texto"});
CKEDITOR.replace('txaEditor_12',{"toolbar":toolbar,"stylesheetParser_validSelectors":/^(p)\\.(Texto_Centralizado|Texto_Centralizado_Maiusculas)$/i,"readOnly":false,title:"Assinatura"});
</script></body></html>`;

const CK5 = `<html><body><script>window.INFRA_EDITOR_CONFIG = ${JSON.stringify({
  initialData: { corpo: "<p>corpo</p>", assinatura: "<p>ass</p>" },
  rootsAttributes: { corpo: { label: "Corpo do Texto", principal: true }, assinatura: { label: "Assinatura" } },
  sei: { urlSalvar: "/salvar", versao: 1, siglaUnidade: "GPF" },
  estilo: {
    css: ["p.Texto_Justificado{text-align:justify}"],
    itens: [
      { nome: "Texto_Justificado", classeCss: "Texto_Justificado", permitidoEm: ["corpo"] },
      { nome: "Item_Nivel1", classeCss: "Item_Nivel1", permitidoEm: ["corpo"] },
      { nome: "Texto_Centralizado_Maiusculas", classeCss: "Texto_Centralizado_Maiusculas", permitidoEm: ["assinatura"] },
      { nome: "Em_Qualquer_Secao", classeCss: "Em_Qualquer_Secao" },
    ],
    estiloPadrao: { corpo: "Texto_Justificado" },
  },
})};</script></body></html>`;

export function verificarEstilosDoEditor(): void {
  secao("estilos: CK4, pelos seletores validos de cada secao");
  const ck4 = lerEditor(pagina(CK4));
  checar("leu as duas secoes", ck4.secoes.length === 2, ck4.secoes.map((s) => s.titulo));
  const corpo4 = ck4.secoes.find((s) => s.titulo === "Corpo do Texto");
  checar("o corpo traz os tres estilos dele", corpo4?.estilos.map((e) => e.classe).join(",") === "Texto_Justificado,Paragrafo_Numerado_Nivel1,Citacao", corpo4?.estilos);
  const ass4 = ck4.secoes.find((s) => s.titulo === "Assinatura");
  checar("a assinatura traz OS DELA, nao os do corpo", ass4?.estilos.map((e) => e.classe).join(",") === "Texto_Centralizado,Texto_Centralizado_Maiusculas", ass4?.estilos);

  secao("estilos: CK5, por estilo.itens e permitidoEm");
  const ck5 = lerEditor(pagina(CK5));
  const corpo5 = ck5.secoes.find((s) => s.nome === "corpo");
  const ass5 = ck5.secoes.find((s) => s.nome === "assinatura");
  checar("o corpo recebe os dele e o que vale em qualquer secao", corpo5?.estilos.map((e) => e.classe).sort().join(",") === "Em_Qualquer_Secao,Item_Nivel1,Texto_Justificado", corpo5?.estilos);
  checar("a assinatura NAO recebe os do corpo", !corpo5 || !ass5?.estilos.some((e) => e.classe === "Item_Nivel1"), ass5?.estilos);
  checar("estilo sem permitidoEm vale em toda secao", ass5?.estilos.some((e) => e.classe === "Em_Qualquer_Secao") === true);
  checar("o padrao da secao vem junto", corpo5?.estiloPadrao === "Texto_Justificado", corpo5?.estiloPadrao);
  checar("secao sem padrao nao inventa", ass5?.estiloPadrao === undefined);

  secao("estilos: editor sem estilos configurados");
  const semEstilo = `<html><body><script>window.INFRA_EDITOR_CONFIG = ${JSON.stringify({ initialData: { corpo: "<p>x</p>" }, rootsAttributes: {}, sei: { urlSalvar: "/s" } })};</script></body></html>`;
  checar("nao quebra, devolve lista vazia", lerEditor(pagina(semEstilo)).secoes[0].estilos.length === 0);
  const ck4Sem = `<html><body><textarea name="txaEditor_1"></textarea><script>CKEDITOR.replace('txaEditor_1',{"readOnly":false,title:"Corpo"});</script></body></html>`;
  checar("CK4 sem seletores tambem nao quebra", lerEditor(pagina(ck4Sem)).secoes[0].estilos.length === 0);
}
