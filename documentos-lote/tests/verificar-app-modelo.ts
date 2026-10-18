/**
 * Provas do app dos Documentos em Lote, etapas 1 (Modelo) e 2 (Planilha), com DOM do linkedom e RPC falso (molde
 * de processos-lote/tests/verificar-app.ts). A aba responde por roteiro e cada resposta pode ser segurada para a
 * prova agir no meio (resposta atrasada de uma escolha anterior não vale).
 */

import { areaMemoria } from "@comum/armazenamento/area";
import { AppDocumentosLote, type DepsApp } from "@dl/app/app";
import { ROTULO_MODELO, ROTULO_TIPO } from "@dl/app/modelo";
import { TETO, TETO_BYTES_LOTE } from "@dl/modelo/constantes";
import type { EscolhaModelo, Modelo, ModelosDisponiveis } from "@dl/sei/modelo";
import { RepositorioLote } from "../src/repositorio";
import { botao, checar, combo, disparar, escolherCombo, igual, instalarDom, secao, tique } from "./util";

const DISPONIVEIS: ModelosDisponiveis = {
  documentos: [
    { numero: "0000123", titulo: "Ofício 12" },
    { numero: "0000124", titulo: "Despacho 3" },
  ],
  textosPadrao: [{ id: "9", nome: "Notificação padrão" }],
  tipos: [
    { id: "5", nome: "Despacho" },
    { id: "6", nome: "Ofício" },
  ],
};

type RespostaLer = { situacao: "ok"; modelo: Modelo } | { situacao: "erro"; erro: string; sessao?: true };
type RespostaListar = { situacao: "ok"; protocolo: string; modelos: ModelosDisponiveis } | { situacao: "erro"; erro: string };

const modeloDoc = (numero: string, campos: string[]): Modelo => ({
  origem: "documento",
  numero,
  titulo: numero === "0000123" ? "Ofício 12" : "Despacho 3",
  tipoId: numero === "0000123" ? "6" : "5",
  tipoNome: numero === "0000123" ? "Ofício" : "Despacho",
  campos,
});

interface OpcoesMontar {
  listar?: () => RespostaListar | Promise<RespostaListar>;
  ler?: (e: EscolhaModelo) => RespostaLer | Error | Promise<RespostaLer | Error>;
}

export function montar(o: OpcoesMontar = {}) {
  const doc = instalarDom('<html><body><div id="app"></div></body></html>');
  const raiz = doc.getElementById("app")!;
  const chamadas: Array<{ op: string; args: unknown }> = [];
  const t = {
    fechou: 0,
    /** Textos das confirmações pedidas e a resposta (Tarefa 14b). */
    confirmacoes: [] as string[],
    responder: true,
    baixados: [] as Array<{ nome: string; conteudo: string; tipo: string }>,
    copiados: [] as string[],
    avisos: [] as string[],
    entradaLink: [] as string[],
    minimizou: [] as boolean[],
  };
  const deps: DepsApp = {
    rpc: {
      chamar: (async (op: string, args?: unknown) => {
        chamadas.push({ op, args });
        await tique(1);
        if (op === "listarModelos")
          return o.listar ? o.listar() : { situacao: "ok", protocolo: "00001.000001/2026-11", modelos: DISPONIVEIS };
        if (op === "lerModelo") {
          const e = args as EscolhaModelo;
          const r = o.ler
            ? await o.ler(e)
            : "documento" in e
              ? { situacao: "ok", modelo: modeloDoc(e.documento, ["nome", "cargo"]) }
              : null;
          if (r instanceof Error) throw r;
          return r;
        }
        return true;
      }) as DepsApp["rpc"]["chamar"],
    },
    ctx: {
      host: "sei.x.gov.br",
      login: "ana",
      nomeUsuario: "Ana",
      unidadeSigla: "GAB",
      temaEscuro: false,
      idProcedimento: "77",
      origem: "https://sei.x.gov.br/sei/controlador.php",
    },
    repo: new RepositorioLote(areaMemoria()),
    fechar: () => {
      t.fechou += 1;
    },
    minimizar: async (m) => {
      t.minimizou.push(m);
    },
    confirmar: async (texto) => {
      t.confirmacoes.push(texto);
      return t.responder;
    },
    baixar: (nome, conteudo, tipo) => void t.baixados.push({ nome, conteudo, tipo }),
    clip: {
      writeText: async (texto) => void t.copiados.push(texto),
    },
    avisar: (texto) => void t.avisos.push(texto),
    gravarEntradaLink: async (texto) => void t.entradaLink.push(texto),
  };
  const app = new AppDocumentosLote(raiz, deps);
  const visivel = (el: Element | null | undefined) => !!el && !(el as HTMLElement).hidden && !el.closest("[hidden]");
  const textoVisivel = (texto: string) =>
    [...raiz.querySelectorAll("p, span, div, strong, li, h2, code, small")].some(
      (el) => visivel(el) && (el.textContent ?? "").includes(texto),
    );
  const avancar = () => botao(raiz, "Avançar");
  const ler = () => chamadas.filter((c) => c.op === "lerModelo");
  const arquivo = () => raiz.querySelector<HTMLInputElement>('input[type="file"]');
  /** Escolhe o arquivo como o usuário: põe em `files` e dispara `change`. */
  const escolherArquivo = async (nome: string, bytes: Uint8Array) => {
    const input = arquivo();
    if (!input) throw new Error("campo de arquivo não encontrado");
    Object.defineProperty(input, "files", { value: [new File([bytes as Uint8Array<ArrayBuffer>], nome)], configurable: true });
    disparar(input, "change");
    await ate(() => !raiz.querySelector(".dl-carregando:not([hidden])"));
    await tique(5);
  };
  return { doc, raiz, app, deps, chamadas, t, textoVisivel, visivel, avancar, ler, arquivo, escolherArquivo };
}

export async function ate(cond: () => boolean, ms = 1000): Promise<void> {
  const fim = Date.now() + ms;
  while (!cond()) {
    if (Date.now() > fim) throw new Error("condição não chegou");
    await tique(2);
  }
}

export const utf8 = (s: string): Uint8Array => new TextEncoder().encode(s);

/** Até a etapa Modelo estar com a lista carregada. */
async function iniciado(m: ReturnType<typeof montar>): Promise<void> {
  void m.app.iniciar();
  await ate(() => !!combo(m.raiz, ROTULO_MODELO) && m.chamadas.some((c) => c.op === "listarModelos"));
  await tique(5);
}

/** Escolhe o documento 0000123 (campos nome e cargo) e avança para a Planilha. */
export async function naPlanilha(m: ReturnType<typeof montar>): Promise<void> {
  await iniciado(m);
  escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
  await ate(() => m.avancar()?.disabled === false);
  disparar(m.avancar()!, "click");
  await ate(() => !!m.arquivo());
}

export async function verificarAppModelo(): Promise<void> {
  secao("app: esqueleto (X, Esc, sem Cancelar, etapas)");
  {
    const m = montar();
    await iniciado(m);
    checar("pediu a lista de modelos à aba", m.chamadas.filter((c) => c.op === "listarModelos").length === 1);
    checar("sem botão Cancelar", !botao(m.doc, "Cancelar"));
    checar("Avançar existe e começa desabilitado", m.avancar()?.disabled === true);
    checar("Voltar escondido na primeira etapa", !m.visivel(botao(m.raiz, "Voltar")));
    const atual = m.raiz.querySelector('.dl-etapas [aria-current="step"]');
    checar("indicador de etapas marca Modelo", (atual?.textContent ?? "").includes("Modelo"), atual?.textContent);
    checar("indicador lista Planilha", (m.raiz.querySelector(".dl-etapas")?.textContent ?? "").includes("Planilha"));
    disparar(botao(m.raiz, "Fechar")!, "click");
    igual("X fecha", m.t.fechou, 1);
    const Ev = (m.doc.defaultView as unknown as { KeyboardEvent?: typeof KeyboardEvent; Event: typeof Event }).Event;
    const esc = new Ev("keydown", { bubbles: true }) as KeyboardEvent;
    Object.defineProperty(esc, "key", { value: "Escape" });
    m.doc.dispatchEvent(esc);
    igual("Esc fecha", m.t.fechou, 2);
    m.app.destruir();
    const esc2 = new Ev("keydown", { bubbles: true }) as KeyboardEvent;
    Object.defineProperty(esc2, "key", { value: "Escape" });
    m.doc.dispatchEvent(esc2);
    igual("depois de destruir o Esc não chama fechar", m.t.fechou, 2);
  }

  secao("app etapa 1: documento da árvore");
  {
    const m = montar();
    await iniciado(m);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
    await ate(() => m.ler().length === 1);
    igual("lerModelo com o número do documento", m.ler()[0]?.args, { documento: "0000123" });
    await ate(() => m.avancar()?.disabled === false);
    checar("mostra o tipo do modelo", m.textoVisivel("Ofício"));
    checar("mostra o campo ##nome##", m.textoVisivel("##nome##"));
    checar("mostra o campo ##cargo##", m.textoVisivel("##cargo##"));
    checar("Texto Padrão não pede tipo para documento", !m.visivel(combo(m.raiz, ROTULO_TIPO)));
    igual("estado guarda o modelo", m.app.estado.modelo, modeloDoc("0000123", ["nome", "cargo"]));
  }

  secao("app etapa 1: modelo sem campos");
  {
    const m = montar({ ler: (e) => ({ situacao: "ok", modelo: modeloDoc((e as { documento: string }).documento, []) }) });
    await iniciado(m);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000124");
    await ate(() => m.ler().length === 1 && m.avancar()?.disabled === false);
    checar("aviso de nenhum campo dinâmico", m.textoVisivel("Nenhum campo dinâmico encontrado"));
    checar("o aviso não bloqueia o Avançar", m.avancar()?.disabled === false);
  }

  secao("app etapa 1: Texto Padrão exige o tipo");
  {
    const m = montar({
      ler: (e) =>
        "textoPadrao" in e
          ? {
              situacao: "ok",
              modelo: {
                origem: "texto-padrao",
                id: e.textoPadrao,
                nome: "Notificação padrão",
                tipoId: e.tipoId,
                tipoNome: e.tipoNome,
                campos: ["cpf"],
              },
            }
          : { situacao: "erro", erro: "inesperado" },
    });
    await iniciado(m);
    escolherCombo(m.raiz, ROTULO_MODELO, "tp:9");
    await tique(10);
    checar("seletor de tipo aparece", m.visivel(combo(m.raiz, ROTULO_TIPO)));
    igual("sem tipo, não lê o modelo", m.ler().length, 0);
    checar("sem tipo, Avançar desabilitado", m.avancar()?.disabled === true);
    escolherCombo(m.raiz, ROTULO_TIPO, "5");
    await ate(() => m.ler().length === 1);
    igual("lerModelo com texto padrão e tipo", m.ler()[0]?.args, { textoPadrao: "9", tipoId: "5", tipoNome: "Despacho" });
    await ate(() => m.avancar()?.disabled === false);
    checar("mostra o campo do texto padrão", m.textoVisivel("##cpf##"));
    checar("mostra o tipo escolhido", m.textoVisivel("Despacho"));
    escolherCombo(m.raiz, ROTULO_MODELO, "tp:9");
    checar("escolher o mesmo texto padrão não perde o tipo", m.avancar()?.disabled === false);
  }

  secao("app etapa 1: falha ao ler o modelo");
  {
    const erroAba =
      "Não foi possível ler o tipo do documento 0000123 para usá-lo como modelo: Ação indisponível. Escolha outro documento ou um Texto Padrão.";
    let vez = 0;
    const m = montar({
      ler: (e) => {
        vez += 1;
        if (vez === 1) return { situacao: "erro", erro: erroAba };
        if (vez === 2) return { situacao: "erro", erro: "O SEI demorou para responder." };
        if (vez === 3) return new Error("tempo esgotado");
        return { situacao: "ok", modelo: modeloDoc((e as { documento: string }).documento, ["x"]) };
      },
    });
    await iniciado(m);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
    await ate(() => m.ler().length === 1);
    await ate(() => !!m.raiz.querySelector('.dl-erro[role="alert"]:not([hidden])'));
    checar("mostra o erro da aba (SEI_ACAO_INDISPONIVEL)", m.textoVisivel(erroAba));
    checar("Avançar continua desabilitado", m.avancar()?.disabled === true);
    checar("estado sem modelo", m.app.estado.modelo === undefined);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000124");
    await ate(() => m.ler().length === 2);
    await tique(10);
    checar("erro genérico ganha a sugestão de escolher outro modelo", m.textoVisivel("O SEI demorou para responder. Escolha outro modelo"));
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
    await ate(() => m.ler().length === 3);
    await tique(10);
    checar("exceção da ponte vira aviso", m.textoVisivel("tempo esgotado"));
    checar("Avançar desabilitado depois da exceção", m.avancar()?.disabled === true);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000124");
    await ate(() => m.avancar()?.disabled === false);
    checar("modelo bom apaga o erro", !m.raiz.querySelector('.dl-erro[role="alert"]:not([hidden])'));
  }

  secao("app etapa 1: resposta atrasada de uma escolha anterior não vale");
  {
    let soltar: (() => void) | null = null;
    const m = montar({
      ler: (e) => {
        const numero = (e as { documento: string }).documento;
        if (numero === "0000123") return new Promise((ok) => (soltar = () => ok({ situacao: "ok", modelo: modeloDoc(numero, ["velho"]) })));
        return { situacao: "ok", modelo: modeloDoc(numero, ["novo"]) };
      },
    });
    await iniciado(m);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
    await ate(() => m.ler().length === 1 && !!soltar);
    checar("lendo: Avançar desabilitado", m.avancar()?.disabled === true);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000124");
    await ate(() => m.avancar()?.disabled === false);
    (soltar as unknown as () => void)();
    await tique(10);
    igual("vale a última escolha", m.app.estado.modelo?.campos, ["novo"]);
    checar("o campo velho não aparece", !m.textoVisivel("##velho##"));
  }

  secao("app etapa 1: falha ao listar os modelos");
  {
    let vez = 0;
    const m = montar({
      listar: () =>
        ++vez === 1 ? { situacao: "erro", erro: "Processo sigiloso." } : { situacao: "ok", protocolo: "1", modelos: DISPONIVEIS },
    });
    void m.app.iniciar();
    await ate(() => m.textoVisivel("Processo sigiloso."));
    checar("Avançar desabilitado", m.avancar()?.disabled === true);
    const de = botao(m.raiz, "Tentar de novo");
    checar("oferece Tentar de novo", m.visivel(de));
    disparar(de!, "click");
    await ate(() => vez === 2);
    await tique(10);
    escolherCombo(m.raiz, ROTULO_MODELO, "doc:0000123");
    await ate(() => m.avancar()?.disabled === false);
    checar("depois de tentar de novo a lista funciona", !m.textoVisivel("Processo sigiloso."));
  }

  secao("app: Avançar e Voltar preservam o estado");
  {
    const m = montar();
    await naPlanilha(m);
    const atual = m.raiz.querySelector('.dl-etapas [aria-current="step"]');
    checar("indicador marca Planilha", (atual?.textContent ?? "").includes("Planilha"));
    checar("na planilha sem arquivo, Avançar desabilitado", m.avancar()?.disabled === true);
    checar("Voltar visível", m.visivel(botao(m.raiz, "Voltar")));
    disparar(botao(m.raiz, "Voltar")!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_MODELO));
    await tique(5);
    checar("de volta ao Modelo com o modelo mantido", m.avancar()?.disabled === false);
    checar("os campos continuam à vista", m.textoVisivel("##nome##"));
    igual("não leu de novo", m.ler().length, 1);
    igual("não listou de novo", m.chamadas.filter((c) => c.op === "listarModelos").length, 1);
    igual("o seletor mostra o documento escolhido", combo(m.raiz, ROTULO_MODELO)?.textContent?.includes("Ofício 12"), true);
  }

  secao("app etapa 2: escolher arquivo é um botão do módulo (não o botão nativo)");
  {
    const m = montar();
    await naPlanilha(m);
    const input = m.arquivo();
    const rotulo = input?.closest("label");
    checar("o campo de arquivo fica dentro de um label com a cara de botão", !!rotulo?.classList.contains("spro-botao"), rotulo?.className);
    checar("o label diz o que faz", (rotulo?.textContent ?? "").includes("Escolher arquivo CSV"), rotulo?.textContent);
    checar(
      "o campo nativo fica escondido só à vista (continua focável)",
      !!input?.classList.contains("dl-arquivo-oculto") && !input?.hidden,
    );
    const nome = () => m.raiz.querySelector(".dl-nome-arquivo")?.textContent ?? "";
    igual("sem arquivo: diz que nenhum foi escolhido", nome(), "Nenhum arquivo escolhido");
    await m.escolherArquivo("pessoas.csv", utf8("nome;cargo\nAna;Analista\n"));
    igual("o nome do arquivo escolhido ao lado do botão", nome(), "pessoas.csv");
    disparar(botao(m.raiz, "Voltar")!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_MODELO));
    disparar(m.avancar()!, "click");
    await ate(() => !!m.arquivo());
    igual("de volta à planilha: o nome do arquivo lido", nome(), "pessoas.csv");
  }

  secao("app etapa 2: planilha");
  {
    const m = montar();
    await naPlanilha(m);
    await m.escolherArquivo("pessoas.csv", utf8("nome;cargo;cpf\nAna;Analista;1\nBia;Técnica;2\nCid;Chefe;3\n"));
    checar('mostra "3 linhas"', m.textoVisivel("3 linhas"));
    checar("mostra a coluna nome", m.textoVisivel("nome"));
    checar("mostra a coluna cpf", m.textoVisivel("cpf"));
    checar("mostra o nome do arquivo", m.textoVisivel("pessoas.csv"));
    checar("mostra a codificação", m.textoVisivel("UTF-8"));
    checar("Avançar habilitado", m.avancar()?.disabled === false);
    igual("estado: colunas", m.app.estado.colunas, ["nome", "cargo", "cpf"]);
    igual("estado: registros", m.app.estado.registros?.length, 3);
    igual("estado: nome do arquivo", m.app.estado.nomeArquivo, "pessoas.csv");

    await m.escolherArquivo("vazio.csv", new Uint8Array());
    checar("arquivo vazio: erro", m.textoVisivel("O arquivo está vazio"));
    checar("arquivo vazio: Avançar desabilitado", m.avancar()?.disabled === true);
    checar("arquivo vazio: estado limpo", m.app.estado.registros === undefined && m.app.estado.colunas === undefined);
    checar("arquivo vazio: não mostra as linhas do anterior", !m.textoVisivel("3 linhas"));

    await m.escolherArquivo("so-cabecalho.csv", utf8("nome;cargo\n"));
    checar("só cabeçalho: erro", m.textoVisivel("nenhuma linha de dados"));
    checar("só cabeçalho: Avançar desabilitado", m.avancar()?.disabled === true);

    await m.escolherArquivo("um.csv", utf8("nome\nAna\n"));
    checar('uma linha: "1 linha"', m.textoVisivel("1 linha"));

    await m.escolherArquivo("ansi.csv", new Uint8Array([...utf8("nome\nJos"), 0xe9, 0x0a]));
    checar("mostra Windows-1252", m.textoVisivel("Windows-1252"));

    await m.escolherArquivo("aspas.csv", utf8('nome;cargo\nAna;x\n"Bia;y\nCid;z\n'));
    checar("aspas não fechadas: aviso na tela", m.textoVisivel("Aspas não fechadas na linha 3"));
    checar("aviso não bloqueia", m.avancar()?.disabled === false);

    const grande = `n\n${Array.from({ length: TETO + 1 }, (_, i) => String(i)).join("\n")}\n`;
    await m.escolherArquivo("grande.csv", utf8(grande));
    checar("acima do teto: erro", m.textoVisivel(`O limite é de ${TETO} linhas`));
    checar("acima do teto: Avançar desabilitado", m.avancar()?.disabled === true);

    // Poucas linhas, mas grandes demais para o lote caber no armazenamento (teto de bytes).
    const pesada = `nome;cargo\n${Array.from({ length: 3 }, (_, i) => `P${i};${"a".repeat(Math.ceil(TETO_BYTES_LOTE / 2))}`).join("\n")}\n`;
    await m.escolherArquivo("pesada.csv", utf8(pesada));
    checar(
      "planilha grande demais em bytes: erro",
      m.textoVisivel("A planilha é grande demais para guardar o andamento do lote") && m.textoVisivel("o limite é 2 MB"),
    );
    checar("planilha grande demais em bytes: Avançar desabilitado", m.avancar()?.disabled === true);
    checar("planilha grande demais em bytes: estado limpo", m.app.estado.registros === undefined);

    // Voltar e Avançar de novo: o arquivo lido continua.
    await m.escolherArquivo("pessoas.csv", utf8("nome;cargo;cpf\nAna;Analista;1\n"));
    disparar(botao(m.raiz, "Voltar")!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_MODELO));
    disparar(m.avancar()!, "click");
    await ate(() => !!m.arquivo());
    checar("de volta à planilha com o arquivo mantido", m.textoVisivel("1 linha") && m.avancar()?.disabled === false);
  }
}
