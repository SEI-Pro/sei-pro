import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as imageQuality, qualidadePadrao } from "../../src/recursos/image-quality";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, disparar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

export async function verificarImageQuality(): Promise<void> {
  secao("recurso image-quality");
  igual(
    "qualidadePadrao: valida, limita a 1..100 e cai em 60",
    [qualidadePadrao("80"), qualidadePadrao(0), qualidadePadrao(500), qualidadePadrao("x"), qualidadePadrao(undefined)],
    [80, 1, 100, 60, 60],
  );

  await nosDoisEditores("image-quality", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    const chamadas: Array<[Element, Element, number]> = [];
    w.qualidadeImagens = 75;
    w.qualityImages = (o: Element, d: Element, q: number) => chamadas.push([o, d, q]);
    const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, '<p>x</p><img src="a.png"><img src="b.png">'));
    const ctx: Contexto = {
      adaptador: criarAdaptador(c.win),
      doc: c.doc,
      win: c.win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
    };
    const g = imageQuality.globais(ctx) as Record<string, Fn>;
    igual(`image-quality ${v}: globais do contrato`, Object.keys(g).sort(), ["getDialogBatchImgQuality", "openDialogBatchImgQuality"]);

    g.openDialogBatchImgQuality(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    const faixa = d.querySelector("#batchImgQualityRange") as HTMLInputElement;
    igual(
      `image-quality ${v}: abre com a qualidade configurada (75%)`,
      [faixa.value, d.querySelector('[data-valor-de="batchImgQualityRange"]')?.textContent],
      ["75", "75%"],
    );
    checar(`image-quality ${v}: sem Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    faixa.value = "40";
    disparar(faixa, "input");
    igual(
      `image-quality ${v}: o valor mostrado acompanha o controle`,
      d.querySelector('[data-valor-de="batchImgQualityRange"]')?.textContent,
      "40%",
    );
    clicar(d, "Aplicar");
    igual(
      `image-quality ${v}: aplica 0,40 a cada imagem do documento`,
      chamadas.map((x) => [x[0].getAttribute("src"), x[2]]),
      [
        ["a.png", 0.4],
        ["b.png", 0.4],
      ],
    );
    checar(`image-quality ${v}: fecha o dialogo`, !dialogoAberto(c.doc));
  });
}
