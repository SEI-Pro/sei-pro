import { detectarVersao } from "../src/adaptador/versao";
import { criarCk4, criarCk5, paginaFalsa } from "./falsos";
import { checar, secao } from "./util";

export function verificarVersao(): void {
  secao("adaptador: deteccao de versao");
  const sei5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "", principal: true }] });
  sei5.win.CKEDITOR = { version: "45.1.0-infra" };
  checar("SEI 5 com CKEDITOR global e DOM do CK5 => 5", detectarVersao(sei5.win) === 5);

  const sei4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "" }] });
  checar("CKEDITOR.instances sem DOM do CK5 => 4", detectarVersao(sei4.win) === 4);

  const vazia = paginaFalsa();
  checar("pagina sem nenhum dos dois => 0", detectarVersao(vazia.win) === 0);

  const antes = paginaFalsa();
  antes.win.CKEDITOR = { version: "45.1.0-infra" };
  checar("SEI 5 com CKEDITOR mas o CK5 ainda nao montou => 0 (nao 4)", detectarVersao(antes.win) === 0);
}
