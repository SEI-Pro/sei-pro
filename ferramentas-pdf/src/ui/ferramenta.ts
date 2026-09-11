/**
 * Coreografia comum a todas as ferramentas: escolher arquivos, diagnosticar,
 * reordenar, processar com progresso, cancelar e baixar.
 *
 * Existe porque sao varias ferramentas com o mesmo fluxo. Duplica-lo garantiria
 * que uma delas esquecesse de revogar object URL, ou de anunciar o progresso a
 * leitor de tela, ou de tratar o cancelamento.
 *
 * TRADUCAO DO HOOK ORIGINAL, para quem for comparar: cada `useState` virou
 * campo de `estado` mais uma chamada a `notificar()`; cada `useRef` virou
 * variavel de closure -- que e o que um ref sempre foi; e o `useEffect` de
 * desmontagem virou `destruir()`, chamado pelo roteador ao trocar de
 * ferramenta.
 *
 * AS BIBLIOTECAS DE PDF NUNCA ENTRAM NO TOPO DESTE ARQUIVO: so por
 * `await import()` dentro dos metodos, para que o peso do pdf.js e do pdf-lib
 * nao caia sobre a abertura da página.
 */

import type { OperacaoPdf, SaidaWorker } from "@/lib/ferramentas/protocoloWorker";
import type { ArquivoEntrada, CodigoErroFerramenta } from "@/types/ferramentas";

export interface ResultadoPronto {
  saidas: SaidaWorker[];
  /** Somatorio dos bytes gerados. */
  bytes: number;
}

export interface EstadoFerramenta {
  itens: ArquivoEntrada[];
  processando: boolean;
  progresso: { feito: number; total: number };
  erroGeral: string | null;
  resultado: ResultadoPronto | null;
  /** Ultima mensagem para a regiao `aria-live`. */
  anuncio: string;
}

const ESTADO_INICIAL: EstadoFerramenta = {
  itens: [],
  processando: false,
  progresso: { feito: 0, total: 0 },
  erroGeral: null,
  resultado: null,
  anuncio: "",
};

/** Id de item de lista. `randomUUID` existe em contexto seguro, que e o caso. */
function novoId(): string {
  return crypto.randomUUID();
}

export type Ferramenta = ReturnType<typeof criarFerramenta>;

export function criarFerramenta() {
  const estado: EstadoFerramenta = { ...ESTADO_INICIAL, itens: [] };
  const ouvintes = new Set<(e: EstadoFerramenta) => void>();
  let cancelarExecucao: (() => void) | null = null;
  let destruido = false;

  function notificar() {
    if (destruido) return;
    for (const ouvinte of ouvintes) ouvinte(estado);
  }

  function anunciar(texto: string) {
    estado.anuncio = texto;
  }

  function limparResultado() {
    estado.resultado = null;
    estado.erroGeral = null;
  }

  return {
    get estado() {
      return estado;
    },

    assinar(ouvinte: (e: EstadoFerramenta) => void): () => void {
      ouvintes.add(ouvinte);
      ouvinte(estado);
      return () => ouvintes.delete(ouvinte);
    },

    /** Le e diagnostica os arquivos. A leitura e local: nada e transmitido. */
    async adicionar(arquivos: File[], opcoes: { diagnosticar?: boolean } = {}) {
      const { diagnosticar = true } = opcoes;
      limparResultado();

      const novos: ArquivoEntrada[] = [];

      if (diagnosticar) {
        const { analisarPdf } = await import("@/lib/ferramentas/analisarPdf");
        const { ErroFerramenta } = await import("@/lib/ferramentas/erros");

        for (const arquivo of arquivos) {
          const bytes = new Uint8Array(await arquivo.arrayBuffer());
          const base: ArquivoEntrada = {
            id: novoId(),
            nome: arquivo.name,
            tamanho: arquivo.size,
            bytes,
          };
          try {
            const { diagnostico } = await analisarPdf(bytes, { nome: arquivo.name });
            novos.push({ ...base, diagnostico });
          } catch (e) {
            const codigo = (
              e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA"
            ) as CodigoErroFerramenta;
            novos.push({ ...base, erro: codigo });
          }
        }
      } else {
        // Imagens nao passam pelo diagnostico de PDF: seria erro garantido.
        for (const arquivo of arquivos) {
          novos.push({
            id: novoId(),
            nome: arquivo.name,
            tamanho: arquivo.size,
            bytes: new Uint8Array(await arquivo.arrayBuffer()),
          });
        }
      }

      estado.itens = [...estado.itens, ...novos];
      anunciar(
        `${novos.length} ${novos.length === 1 ? "documento adicionado" : "documentos adicionados"}. ${estado.itens.length} no total.`,
      );
      notificar();
    },

    /** Acrescenta bytes que ja estao em memoria (vindos do SEI, por exemplo). */
    async adicionarBytes(entradas: { nome: string; bytes: Uint8Array }[]) {
      limparResultado();
      const { analisarPdf } = await import("@/lib/ferramentas/analisarPdf");
      const { ErroFerramenta } = await import("@/lib/ferramentas/erros");

      for (const entrada of entradas) {
        const base: ArquivoEntrada = {
          id: novoId(),
          nome: entrada.nome,
          tamanho: entrada.bytes.byteLength,
          bytes: entrada.bytes,
        };
        try {
          const { diagnostico } = await analisarPdf(entrada.bytes, { nome: entrada.nome });
          estado.itens = [...estado.itens, { ...base, diagnostico }];
        } catch (e) {
          const codigo = (
            e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA"
          ) as CodigoErroFerramenta;
          estado.itens = [...estado.itens, { ...base, erro: codigo }];
        }
      }
      anunciar(`${entradas.length} documento(s) trazidos do processo.`);
      notificar();
    },

    async tentarSenha(id: string, senha: string) {
      if (!senha) return;
      const { analisarPdf } = await import("@/lib/ferramentas/analisarPdf");
      const { ErroFerramenta } = await import("@/lib/ferramentas/erros");

      const alvo = estado.itens.find((i) => i.id === id);
      if (!alvo) return;

      try {
        const { diagnostico } = await analisarPdf(alvo.bytes, { nome: alvo.nome, senha });
        estado.itens = estado.itens.map((i) =>
          i.id === id ? { ...i, senha, diagnostico, erro: undefined } : i,
        );
        anunciar(`${alvo.nome} desbloqueado.`);
      } catch (e) {
        const codigo = (
          e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA"
        ) as CodigoErroFerramenta;
        estado.itens = estado.itens.map((i) => (i.id === id ? { ...i, erro: codigo } : i));
      }
      notificar();
    },

    mover(de: number, para: number) {
      const copia = [...estado.itens];
      const [item] = copia.splice(de, 1);
      copia.splice(para, 0, item);
      estado.itens = copia;
      estado.resultado = null;
      anunciar(`${item.nome} movido para a posição ${para + 1} de ${copia.length}.`);
      notificar();
    },

    remover(id: string) {
      estado.itens = estado.itens.filter((i) => i.id !== id);
      estado.resultado = null;
      anunciar("Documento removido.");
      notificar();
    },

    limparTudo() {
      estado.itens = [];
      limparResultado();
      anunciar("Lista esvaziada.");
      notificar();
    },

    inverterOrdem() {
      estado.itens = [...estado.itens].reverse();
      estado.resultado = null;
      anunciar("Ordem invertida.");
      notificar();
    },

    /**
     * Processa a operacao.
     *
     * Os bytes vao para o worker por TRANSFERENCIA, o que destaca o buffer
     * original. Como o usuario pode reprocessar com outras opcoes sem escolher
     * os arquivos de novo, mandamos COPIAS e preservamos o estado local.
     */
    async processar(
      operacao: OperacaoPdf,
      opcoes: Record<string, unknown> = {},
    ): Promise<SaidaWorker[] | null> {
      const atuais = estado.itens;
      limparResultado();
      estado.processando = true;
      estado.progresso = { feito: 0, total: 0 };
      notificar();

      try {
        const { executar } = await import("@/lib/ferramentas/clienteWorker");

        const execucao = executar({
          operacao,
          opcoes,
          entradas: atuais.map((i) => ({
            nome: i.nome,
            bytes: new Uint8Array(i.bytes),
            senha: i.senha,
          })),
          aoProgredir: (feito, total) => {
            estado.progresso = { feito, total };
            notificar();
          },
        });
        cancelarExecucao = execucao.cancelar;

        const saidas = await execucao.resultado;
        const bytes = saidas.reduce((s, x) => s + x.bytes.byteLength, 0);

        estado.resultado = { saidas, bytes };
        anunciar(saidas.length === 1 ? "Documento pronto." : `${saidas.length} arquivos gerados.`);
        return saidas;
      } catch (e) {
        const { ErroFerramenta, mensagemDeErro } = await import("@/lib/ferramentas/erros");
        const { OperacaoCancelada } = await import("@/lib/ferramentas/juntar");
        if (e instanceof OperacaoCancelada) {
          anunciar("Operação cancelada.");
          return null;
        }
        const codigo = (
          e instanceof ErroFerramenta ? e.codigo : "FALHA_INESPERADA"
        ) as CodigoErroFerramenta;
        const nome = e instanceof ErroFerramenta ? e.contexto.nome : undefined;
        estado.erroGeral = mensagemDeErro(codigo, { nome });
        return null;
      } finally {
        estado.processando = false;
        cancelarExecucao = null;
        notificar();
      }
    },

    cancelar() {
      cancelarExecucao?.();
      anunciar("Cancelando...");
      notificar();
    },

    /**
     * Baixa o resultado.
     *
     * Saida multipla vai SEMPRE em ZIP unico, nunca em N downloads: cliques
     * sucessivos em ancoras sao bloqueados pelo navegador como "download
     * multiplo" e simplesmente nao acontecem.
     */
    async baixar(nomeZip = "arquivos") {
      if (!estado.resultado) return;
      const { baixarPdf, baixarZip } = await import("@/lib/ferramentas/baixar");

      if (estado.resultado.saidas.length === 1) {
        baixarPdf(estado.resultado.saidas[0].bytes, estado.resultado.saidas[0].nome);
      } else {
        await baixarZip(estado.resultado.saidas, `${nomeZip}.zip`);
      }
    },

    limparResultado() {
      limparResultado();
      notificar();
    },

    /** Chamado pelo roteador ao trocar de ferramenta. */
    async destruir() {
      cancelarExecucao?.();
      destruido = true;
      ouvintes.clear();
      const { revogarTudo } = await import("@/lib/ferramentas/baixar");
      revogarTudo();
    },

    // Derivados, calculados na hora para nao viver fora de sincronia.
    get prontos() {
      return estado.itens.filter((i) => !i.erro);
    },
    get temErro() {
      return estado.itens.some((i) => i.erro);
    },
    get paginas() {
      return estado.itens.reduce((s, i) => s + (i.diagnostico?.paginas ?? 0), 0);
    },
    get bytes() {
      return estado.itens.reduce((s, i) => s + i.tamanho, 0);
    },
  };
}
