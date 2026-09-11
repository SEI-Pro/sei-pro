/**
 * Verificação do indicador de carregamento.
 *
 * REGRA DO PROJETO: todo botão que dispara operação capaz de demorar precisa
 * mostrar que está trabalhando. Num processo com muitos documentos, ler a
 * árvore leva segundos, e sem indicador a espera é indistinguível de um clique
 * que não funcionou -- o usuário clica de novo e empilha requisições.
 *
 * O caso que mais importa aqui é o da FALHA: um botão que fica girando para
 * sempre depois de um erro é pior do que indicador nenhum, porque tira do
 * usuário a chance de tentar de novo.
 */

import { comCarregamento } from "@/ui/carregando";

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe?: string) {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe ? ` -- ${detalhe}` : ""}`);
  }
}

/**
 * Botão de mentira, com o pouco que o helper usa.
 *
 * Evita trazer um DOM inteiro para o teste: o que se quer verificar é a
 * sequência de estados, não a renderização.
 */
function botaoFalso(classeDoIcone = "fas fa-sitemap") {
  const icone = { className: classeDoIcone, remove() {} };
  const atributos = new Map<string, string>();
  return {
    disabled: false,
    querySelector: () => icone,
    prepend() {},
    setAttribute: (k: string, v: string) => void atributos.set(k, v),
    removeAttribute: (k: string) => void atributos.delete(k),
    get iconeAtual() {
      return icone.className;
    },
    get ocupado() {
      return atributos.get("aria-busy");
    },
  };
}

async function main() {
  console.log("\n== enquanto a operação corre ==");
  {
    const botao = botaoFalso();
    let girandoDurante: string | undefined;
    let desabilitadoDurante = false;
    let ocupadoDurante: string | undefined;

    await comCarregamento(botao as never, async () => {
      girandoDurante = botao.iconeAtual;
      desabilitadoDurante = botao.disabled;
      ocupadoDurante = botao.ocupado;
      await new Promise((r) => setTimeout(r, 10));
    });

    checar("o ícone vira indicador", /fa-spinner/.test(girandoDurante ?? ""), girandoDurante);
    checar("e ele gira", /fa-spin\b/.test(girandoDurante ?? ""));
    checar("o botão fica desabilitado", desabilitadoDurante);
    checar("e é anunciado como ocupado", ocupadoDurante === "true");
  }

  console.log("\n== depois de terminar bem ==");
  {
    const botao = botaoFalso("fas fa-sitemap");
    const valor = await comCarregamento(botao as never, async () => "resultado");
    checar("o ícone original volta", botao.iconeAtual === "fas fa-sitemap", botao.iconeAtual);
    checar("o botão volta a funcionar", botao.disabled === false);
    checar("o estado ocupado sai", botao.ocupado === undefined);
    checar("e o valor da operação é devolvido", valor === "resultado");
  }

  console.log("\n== depois de FALHAR ==");
  // O ponto mais importante: sem isto, um erro deixa o botão girando para
  // sempre e o usuário não consegue nem tentar de novo.
  {
    const botao = botaoFalso("fas fa-sitemap");
    let repassou = false;
    try {
      await comCarregamento(botao as never, async () => {
        throw new Error("o SEI recusou");
      });
    } catch (e) {
      repassou = (e as Error).message === "o SEI recusou";
    }
    checar("o ícone original volta mesmo com erro", botao.iconeAtual === "fas fa-sitemap");
    checar("o botão volta a funcionar mesmo com erro", botao.disabled === false);
    checar("o estado ocupado sai mesmo com erro", botao.ocupado === undefined);
    checar("e o erro NÃO é engolido", repassou);
  }

  console.log("\n== botão que já estava desabilitado ==");
  {
    const botao = botaoFalso();
    botao.disabled = true;
    await comCarregamento(botao as never, async () => undefined);
    checar("continua desabilitado no fim", botao.disabled === true);
  }

  console.log("\n== sem botão ==");
  {
    const valor = await comCarregamento(null, async () => 42);
    checar("a operação roda assim mesmo", valor === 42);
  }

  console.log("\n== o padrão vale em toda a interface ==");
  // Não basta o helper existir: ele precisa estar em TODO botão que fala com o
  // SEI. Esta conferência lê o código e cobra isso, para uma ferramenta nova não
  // nascer sem indicador.
  const { readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join, resolve, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src");

  function arquivos(dir: string): string[] {
    const saida: string[] = [];
    for (const item of readdirSync(dir)) {
      const caminho = join(dir, item);
      if (statSync(caminho).isDirectory()) saida.push(...arquivos(caminho));
      else if (item.endsWith(".ts")) saida.push(caminho);
    }
    return saida;
  }

  /**
   * Componentes que SÃO DONOS dos botões de operação com o SEI.
   *
   * A conferência recai sobre eles, e não sobre as ferramentas: um app como o
   * Tarjar chama `ponte().obterPdf(...)`, mas o botão que dispara isso é da
   * zona de arquivos -- é lá que o indicador tem de estar. Cobrar o helper de
   * quem não tem botão produziria alarme falso e, pior, ensinaria a ignorar a
   * conferência.
   */
  const DONOS_DE_BOTAO = ["ui/componentes/zonaDeArquivos.ts", "ui/componentes/painelResultado.ts"];

  const semIndicador: string[] = [];
  for (const relativo of DONOS_DE_BOTAO) {
    const texto = readFileSync(join(SRC, relativo), "utf8");
    if (!texto.includes("comCarregamento")) semIndicador.push(relativo);
  }

  checar(
    "os botões de operação com o SEI usam o indicador",
    semIndicador.length === 0,
    semIndicador.join(", "),
  );

  /**
   * E nenhuma ferramenta pode chamar a ponte direto de um `onclick` próprio:
   * seria um botão sem dono, fora do padrão e sem indicador.
   */
  const DEMORADAS = ["listarDocumentos", "obterPdf", "enviarAoProcesso", "parametrosUpload"];
  const foraDoPadrao: string[] = [];
  for (const arquivo of arquivos(join(SRC, "ui"))) {
    const curto = arquivo.slice(SRC.length + 1);
    if (DONOS_DE_BOTAO.includes(curto)) continue;
    const texto = readFileSync(arquivo, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // `onclick` cuja expressão, nas linhas seguintes, chama a ponte.
    for (const m of texto.matchAll(/onclick:\s*([\s\S]{0,220})/g)) {
      if (DEMORADAS.some((op) => m[1].includes(`ponte().${op}(`))) {
        foraDoPadrao.push(curto);
        break;
      }
    }
  }

  checar(
    "nenhuma ferramenta chama a ponte direto de um onclick próprio",
    foraDoPadrao.length === 0,
    foraDoPadrao.join(", "),
  );

  // E o helper precisa continuar restaurando em `finally` -- é o que garante a
  // volta depois de um erro.
  const fonteHelper = readFileSync(join(SRC, "ui", "carregando.ts"), "utf8");
  checar("a restauração acontece em finally", /\}\s*finally\s*\{/.test(fonteHelper));

  console.log("\n== o botão de enviar ao processo, no fluxo de verdade ==");
  /*
   * O teste acima confere o helper isolado. Este confere o BOTÃO REAL, contra
   * a coisa que quebra na prática: uma sincronização no meio do envio.
   *
   * O envio ao SEI dura vários segundos e atravessa várias sincronizações
   * (progresso, mudança da ponte, chegada do resultado). Enquanto o estado
   * ocupado dependia só do clique, bastava uma delas redesenhar o botão para
   * ele voltar a parecer parado -- e o usuário clicava de novo, mandando o
   * documento duas vezes para o processo.
   */
  {
    const { parseHTML } = await import("linkedom");
    const janela = parseHTML("<html><body></body></html>");
    for (const chave of ["document", "HTMLElement", "Node", "Event"]) {
      (globalThis as never as Record<string, unknown>)[chave] =
        (janela as never as Record<string, unknown>)[chave];
    }
    const { criarPainelResultado } = await import("@/ui/componentes/painelResultado");

    const visto: string[] = [];
    let sincronizar: (enviando: boolean) => void = () => {};

    const painel = criarPainelResultado({
      aoBaixar: () => {},
      aoRecomecar: () => {},
      aoEnviarAoSei: async () => {
        sincronizar(true);
        visto.push(icone() ?? "sem-icone");

        // A SINCRONIZAÇÃO DESAVISADA. `enviando` é opcional, e nem todo caminho
        // que redesenha o painel sabe que há um envio em curso -- a chegada de
        // um progresso, a ponte mudando de estado, uma ferramenta nova que
        // esqueça de repassar a bandeira. Enquanto o indicador dependia só do
        // clique, esta única linha o apagava para sempre: o botão voltava a
        // parecer parado no meio do envio.
        painel.sincronizar({ saidas, bytes: 10, podeEnviarAoSei: true });

        // E a sincronização seguinte, agora ciente, tem de trazê-lo de volta.
        sincronizar(true);
        visto.push(icone() ?? "sem-icone");

        await new Promise((r) => setTimeout(r, 5));
        visto.push(icone() ?? "sem-icone");
      },
    });

    const botaoEnviar = () =>
      [...painel.raiz.querySelectorAll("button")].find((b) =>
        /Enviar ao processo/.test(b.textContent ?? ""),
      ) as (HTMLButtonElement & { disabled: boolean }) | undefined;
    const icone = () => botaoEnviar()?.querySelector("i")?.className ?? null;

    const saidas = [{ nome: "x.pdf", bytes: new Uint8Array(10) }] as never;
    sincronizar = (enviando) =>
      painel.sincronizar({ saidas, bytes: 10, podeEnviarAoSei: true, enviando });

    sincronizar(false);
    checar("antes do clique o ícone é o normal", icone() === "fas fa-sitemap", String(icone()));

    botaoEnviar()?.dispatchEvent(new (janela as never as { Event: typeof Event }).Event("click"));
    await new Promise((r) => setTimeout(r, 40));

    checar(
      "o ícone gira durante TODO o envio, mesmo com sincronizações no meio",
      visto.length === 3 && visto.every((c) => /fa-spinner/.test(c) && /fa-spin\b/.test(c)),
      visto.join(" -> "),
    );
    sincronizar(false);
    checar("e volta ao normal no fim", icone() === "fas fa-sitemap", String(icone()));
    checar("o botão volta a aceitar clique", botaoEnviar()?.disabled === false);
  }

  console.log(`\n${passou} conferem, ${falhou} falham\n`);
  process.exit(falhou === 0 ? 0 : 1);
}

void main();
