/**
 * Etapa 2, Planilha: o usuário escolhe o arquivo CSV; a tela o lê aqui mesmo (`lerCsv`, nada vai à aba nem à rede)
 * e mostra as colunas, a quantidade de linhas, a codificação detectada e os avisos da leitura.
 *
 * Arquivo vazio, só com o cabeçalho, acima do teto de linhas ou grande demais para o lote guardado (TETO_BYTES_LOTE): erro, e nada fica no estado (o Avançar fica desabilitado).
 * Cada escolha abre uma geração: a leitura atrasada de um arquivo anterior não vale.
 */

import { h, icone } from "@comum/ui/dom";
import { TETO, TETO_BYTES_LOTE } from "../modelo/constantes";
import { type CsvLido, lerCsv } from "../modelo/csv";
import { mensagemLoteGrande } from "../modelo/lote";
import { type DepsEtapa, type EstadoApp, limparVerificacao, mensagemDe, type TelaEtapa } from "./estado";

/** O mínimo de um `File` que a tela usa (o teste passa um `File` de verdade do Node). */
interface ArquivoLido {
  name: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export const NOME_CODIFICACAO: Record<CsvLido["codificacao"], string> = {
  "utf-8": "UTF-8",
  "windows-1252": "Windows-1252 (ANSI, o CSV do Excel antigo)",
  "utf-16le": "UTF-16 LE (Texto Unicode do Excel)",
  "utf-16be": "UTF-16 BE",
};

export const ERROS_PLANILHA = {
  vazio: "O arquivo está vazio. Escolha um CSV com a linha de cabeçalho (os nomes das colunas) e ao menos uma linha de dados.",
  soCabecalho: "O arquivo tem só o cabeçalho e nenhuma linha de dados.",
  teto: (n: number) => `O limite é de ${TETO} linhas por execução, e o arquivo tem ${n}. Divida a planilha em partes menores.`,
} as const;

export const linhasTexto = (n: number): string => `${n} ${n === 1 ? "linha" : "linhas"}`;

/** Apaga do estado o que esta etapa escreveu. */
function limparPlanilha(e: EstadoApp): void {
  e.nomeArquivo = undefined;
  e.colunas = undefined;
  e.config = undefined;
  limparVerificacao(e);
  e.registros = undefined;
  e.codificacao = undefined;
  e.avisosCsv = undefined;
}

export class TelaPlanilha implements TelaEtapa {
  readonly el: HTMLElement;
  private readonly arquivo: HTMLInputElement;
  /** O nome do arquivo escolhido, ao lado do botão (o campo nativo, que o mostrava, fica escondido à vista). */
  private readonly nomeArquivo: HTMLElement;
  private readonly carregando: HTMLElement;
  private readonly erro: HTMLElement;
  private readonly resumo: HTMLElement;
  private seq = 0;
  private destruida = false;

  constructor(private readonly d: DepsEtapa) {
    // O botão nativo de arquivo não segue o visual do módulo: o campo fica dentro de um <label> com a cara de
    // botão, escondido só à vista (continua focável pelo teclado; o label mostra o anel com :focus-within).
    this.arquivo = h("input", {
      type: "file",
      id: "dl-arquivo",
      class: "dl-arquivo-oculto",
      accept: ".csv,.txt,text/csv,text/plain",
      "aria-describedby": "dl-nome-arquivo",
    });
    this.nomeArquivo = h("span", { id: "dl-nome-arquivo", class: "dl-nome-arquivo", "aria-live": "polite" });
    this.mostrarNome(d.estado.nomeArquivo);
    this.arquivo.addEventListener("change", () => {
      const f = this.arquivo.files?.[0];
      if (!f) return;
      this.mostrarNome(f.name);
      void this.ler(f);
    });
    this.carregando = h("small", { class: "dl-carregando", "aria-live": "polite", hidden: true });
    this.erro = h("p", { class: "dl-erro", role: "alert", hidden: true });
    this.resumo = h("div", { class: "dl-resumo-planilha" });
    this.el = h(
      "section",
      { class: "dl-etapa-planilha", "aria-label": "Planilha" },
      h("h2", {}, "Escolha a planilha"),
      h(
        "p",
        { class: "dl-nota" },
        "Um arquivo CSV (no Excel: Salvar como, CSV). A primeira linha traz os nomes das colunas, os mesmos dos ",
        h("code", {}, "##campos##"),
        " do modelo; cada linha seguinte vira um documento. O arquivo é lido só neste navegador.",
      ),
      h(
        "div",
        { class: "dl-campo" },
        h("span", { class: "dl-rotulo" }, "Arquivo CSV"),
        h(
          "div",
          { class: "dl-escolher-arquivo" },
          h("label", { class: "spro-botao dl-botao-arquivo" }, icone("subir", 16), "Escolher arquivo CSV", this.arquivo),
          this.nomeArquivo,
        ),
        h("small", { class: "dl-dica" }, `Separador ponto e vírgula, vírgula ou tabulação; até ${TETO} linhas.`),
        this.carregando,
      ),
      this.erro,
      this.resumo,
    );
    this.desenharResumo();
  }

  completa(): boolean {
    return !!this.d.estado.registros?.length;
  }

  destruir(): void {
    this.destruida = true;
    this.seq++;
  }

  private async ler(f: ArquivoLido): Promise<void> {
    const s = ++this.seq;
    const e = this.d.estado;
    limparPlanilha(e);
    this.mostrarErro(null);
    this.desenharResumo();
    this.carregando.hidden = false;
    this.carregando.textContent = "Lendo o arquivo...";
    this.d.aoMudar();
    let lido: CsvLido | null = null;
    let falha = "";
    try {
      lido = lerCsv(new Uint8Array(await f.arrayBuffer()));
    } catch (err) {
      falha = `Não foi possível ler o arquivo: ${mensagemDe(err)}`;
    }
    if (this.destruida || s !== this.seq) return;
    this.carregando.hidden = true;
    this.carregando.textContent = "";
    if (lido && !lido.colunas.length) falha = ERROS_PLANILHA.vazio;
    else if (lido && !lido.registros.length) falha = ERROS_PLANILHA.soCabecalho;
    else if (lido && lido.registros.length > TETO) falha = ERROS_PLANILHA.teto(lido.registros.length);
    else if (lido) {
      // Só os registros já não caberiam no lote guardado: avisa agora, não na Prévia.
      const bytes = JSON.stringify(lido.registros).length;
      if (bytes > TETO_BYTES_LOTE) falha = mensagemLoteGrande(bytes);
    }
    if (falha || !lido) {
      this.mostrarErro(falha);
    } else {
      e.nomeArquivo = f.name;
      e.colunas = lido.colunas;
      e.config = undefined;
      limparVerificacao(e);
      e.registros = lido.registros;
      e.codificacao = lido.codificacao;
      e.avisosCsv = lido.avisos;
    }
    this.desenharResumo();
    this.d.aoMudar();
  }

  private mostrarNome(nome: string | undefined): void {
    this.nomeArquivo.textContent = nome || "Nenhum arquivo escolhido";
    this.nomeArquivo.classList.toggle("vazio", !nome);
  }

  private mostrarErro(texto: string | null): void {
    this.erro.hidden = !texto;
    this.erro.replaceChildren(...(texto ? [icone("alerta", 16), h("span", {}, texto)] : []));
  }

  private desenharResumo(): void {
    const e = this.d.estado;
    if (!e.registros?.length || !e.colunas) {
      this.resumo.replaceChildren();
      return;
    }
    this.resumo.replaceChildren(
      h(
        "p",
        {},
        h("strong", {}, e.nomeArquivo ?? "arquivo"),
        ": ",
        h("strong", {}, linhasTexto(e.registros.length)),
        e.codificacao ? h("span", { class: "dl-dica" }, ` · codificação detectada: ${NOME_CODIFICACAO[e.codificacao]}`) : null,
      ),
      ...(e.avisosCsv ?? []).map((a) => h("p", { class: "dl-motivo" }, icone("alerta", 16), h("span", {}, a))),
      h(
        "div",
        { class: "dl-campo" },
        h("span", { class: "dl-rotulo" }, `Colunas (${e.colunas.length})`),
        h("ul", { class: "dl-lista-nomes" }, ...e.colunas.map((c) => h("li", {}, c))),
      ),
    );
  }
}
