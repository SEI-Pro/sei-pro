import { criarAdaptador } from "../../src/adaptador";
import { recurso as tinyUrl } from "../../src/recursos/tiny-url";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, digitar, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk4, nosDoisEditores, primeiroP, selecionarTexto, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

interface Chamada {
  url: string;
}

function contexto(c: CasoEditor, respostas: Array<{ status: number; corpo: string } | Error>, chamadas: Chamada[]): Contexto {
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
    fetch: (async (url: string) => {
      chamadas.push({ url });
      const r = respostas.shift();
      if (!r) throw new Error("sem resposta combinada");
      if (r instanceof Error) throw r;
      return { status: r.status, text: async () => r.corpo };
    }) as unknown as typeof fetch,
  };
}

const campo = (d: HTMLElement, id: string) => d.querySelector(`#${id}`) as HTMLInputElement;

export async function verificarTinyUrl(): Promise<void> {
  secao("recurso tiny-url");
  await nosDoisEditores("tiny-url", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const chamadas: Chamada[] = [];
    const respostas: Array<{ status: number; corpo: string } | Error> = [];
    const g = tinyUrl.globais(contexto(c, respostas, chamadas)) as Record<string, (...a: unknown[]) => unknown>;
    const v = `[CK${c.versao}]`;
    igual(`tiny-url ${v}: globais`, Object.keys(g).sort(), ["ajaxTinyUrl", "getTinyUrl"]);

    // abre o dialogo; texto selecionado que e URL preenche o campo
    selecionarTexto(c, primeiroP(c), "texto qualquer");
    (c.win as unknown as Record<string, unknown>).getSelection = () => "https://sei.antaq.gov.br/documento/1";
    g.getTinyUrl(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `tiny-url ${v}: dialogo com o titulo e os campos`,
      [d.querySelector("h2")?.textContent, !!campo(d, "urlTiny"), !!campo(d, "aliasTiny")],
      ["Gerar link curto do TinyURL", true, true],
    );
    igual(`tiny-url ${v}: a selecao que e URL preenche o campo`, campo(d, "urlTiny").value, "https://sei.antaq.gov.br/documento/1");
    checar(`tiny-url ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));

    // alias: legenda ao digitar
    digitar(campo(d, "aliasTiny"), "meu-alias");
    igual(
      `tiny-url ${v}: alias valido mostra o resultado`,
      d.querySelector("#tinyResult")?.textContent,
      "Resultado: https://tinyurl.com/meu-alias",
    );
    digitar(campo(d, "aliasTiny"), "a b!");
    checar(
      `tiny-url ${v}: alias invalido mostra o erro (cor de perigo)`,
      /apenas letras/.test(d.querySelector("#tinyResult .spro-erro")?.textContent ?? ""),
    );

    // validacoes: nao chama a rede
    digitar(campo(d, "urlTiny"), "nao e url");
    digitar(campo(d, "aliasTiny"), "");
    clicar(d, "Inserir");
    await tique();
    checar(
      `tiny-url ${v}: URL invalida avisa e nao chama a rede`,
      chamadas.length === 0 && /Digite um link v/.test(c.doc.body.textContent ?? ""),
    );
    digitar(campo(d, "urlTiny"), "https://sei.antaq.gov.br/x");
    digitar(campo(d, "aliasTiny"), "ab c");
    clicar(d, "Inserir");
    await tique();
    checar(`tiny-url ${v}: alias com caractere invalido nao chama a rede`, chamadas.length === 0);
    digitar(campo(d, "aliasTiny"), "abc");
    clicar(d, "Inserir");
    await tique();
    checar(
      `tiny-url ${v}: alias de 3 caracteres avisa e nao chama a rede`,
      chamadas.length === 0 && /mais de 4/.test(c.doc.body.textContent ?? ""),
    );
    checar(`tiny-url ${v}: o dialogo continua aberto para corrigir`, !!dialogoAberto(c.doc));

    // sucesso: chama o TinyURL e insere o link; o dialogo fecha
    digitar(campo(d, "aliasTiny"), "meu-alias");
    respostas.push({ status: 200, corpo: "https://tinyurl.com/meu-alias\n" });
    clicar(d, "Inserir");
    await tique(20);
    igual(
      `tiny-url ${v}: pede ao TinyURL com url e alias codificados`,
      chamadas.at(-1)?.url,
      "https://tinyurl.com/api-create.php?url=https%3A%2F%2Fsei.antaq.gov.br%2Fx&alias=meu-alias",
    );
    igual(
      `tiny-url ${v}: insere o link curto como ancora`,
      ultimoInserido(c),
      '<a href="https://tinyurl.com/meu-alias" class="ancoraSei" target="_blank">https://tinyurl.com/meu-alias</a>',
    );
    checar(`tiny-url ${v}: o dialogo fecha`, !dialogoAberto(c.doc));

    // erros do servico
    for (const [status, mensagem] of [
      [400, "Erro: Nenhuma link gerado"],
      [422, "Erro: O nome personalizado já existe. Insira outro."],
    ] as const) {
      c.doc.body.querySelector(".spro-aviso")?.remove();
      respostas.push({ status, corpo: "" });
      const antes = ultimoInserido(c);
      await g.ajaxTinyUrl("https://sei.antaq.gov.br/y", "", "insert");
      checar(
        `tiny-url ${v}: HTTP ${status} avisa "${mensagem}" e nao insere`,
        (c.doc.body.textContent ?? "").includes(mensagem) && ultimoInserido(c) === antes,
      );
    }
    c.doc.body.querySelector(".spro-aviso")?.remove();
    respostas.push(new Error("rede fora"));
    await g.ajaxTinyUrl("https://sei.antaq.gov.br/y", "", "insert");
    checar(`tiny-url ${v}: falha de rede avisa e nao lanca`, /não foi possível gerar o link curto/.test(c.doc.body.textContent ?? ""));

    // resposta hostil: so link do proprio TinyURL entra no documento
    const antes = ultimoInserido(c);
    for (const hostil of [
      "javascript:alert(1)",
      'https://tinyurl.com/x"><img src=x onerror=alert(1)>',
      "https://evil.example/x",
      "<b>oi</b>",
    ]) {
      respostas.push({ status: 200, corpo: hostil });
      await g.ajaxTinyUrl("https://sei.antaq.gov.br/y", "", "insert");
    }
    checar(`tiny-url ${v}: resposta hostil (esquema executavel, marcacao, outro dominio) nao e inserida`, ultimoInserido(c) === antes);

    // modo setinput: entrega ao campo do QR Code
    const recebido: string[] = [];
    (c.win as unknown as Record<string, unknown>).setInputTinyUrl = (u: string) => recebido.push(u);
    respostas.push({ status: 200, corpo: "https://tinyurl.com/qr-1" });
    await g.ajaxTinyUrl("https://sei.antaq.gov.br/z", "", "setinput");
    igual(`tiny-url ${v}: modo setinput entrega ao setInputTinyUrl`, recebido, ["https://tinyurl.com/qr-1"]);
  });

  // o "Inserir" usa a instancia capturada ao ABRIR o dialogo, mesmo que o foco mude depois
  {
    const f = criarCk4({
      secoes: [
        { nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>a</p>" },
        { nome: "txaEditor_2", titulo: "Processo e Interessado", html: "<p>b</p>" },
      ],
    });
    usarDocumento(f.doc);
    const caso = { versao: 4, doc: f.doc, win: f.win, ed: f } as unknown as CasoEditor;
    const g = tinyUrl.globais(contexto(caso, [{ status: 200, corpo: "https://tinyurl.com/abc12" }], [])) as Record<
      string,
      (...a: unknown[]) => unknown
    >;
    f.focar("txaEditor_1");
    (f.win as unknown as Record<string, unknown>).getSelection = () => "https://sei.antaq.gov.br/x";
    g.getTinyUrl(null);
    f.focar("txaEditor_2");
    clicar(dialogoAberto(f.doc) as HTMLElement, "Inserir");
    await tique(20);
    igual(
      "tiny-url: o link vai para a secao onde o dialogo foi aberto",
      [f.instancia("txaEditor_1").inseridos.length, f.instancia("txaEditor_2").inseridos.length],
      [1, 0],
    );
  }
}
