/**
 * Quem alimenta cada fatia da loja. Cada leitura é independente das outras e só usa o que a árvore já
 * tem na tela ou um GET de link que ela oferece (nunca a árvore de novo; ver o `build.mjs`).
 */
import type { Arvore } from "@nucleo/dominio/arvore";
import {
  acoesDoPainel,
  lerAcompanhamento,
  lerAnotacao,
  lerAtribuicaoDaPagina,
  lerMarcadoresDoProcesso,
  type MarcadorDoPainel,
} from "@nucleo/dominio/painelProcesso";
import { consultarDaArvore } from "@nucleo/dominio/processo";
import type { Http } from "@nucleo/sessao/http";
import type { DadoAcompanhamento, DadoAnotacao, DadoAtribuicao, DadoBlocoInterno, DadoMarcador, DadoProcesso } from "../modelo/dados";
import type { LojaProcesso } from "../modelo/loja";
import type { NomeFatia } from "../modelo/tipos";
import { mensagemDeLeitura } from "./comum";

export interface DepsLeituras {
  http: Http;
  arv: Arvore;
  loja: LojaProcesso;
  unidadeSigla: string;
  consultasDesativadas: boolean;
}

export type Leituras = Partial<Record<NomeFatia, () => Promise<unknown>>>;

/** Marcadores que a própria árvore declara ("Nome — texto"), para quando a barra não oferece a tela de marcadores. */
export function marcadoresDaArvore(arv: Arvore): MarcadorDoPainel[] {
  return arv.marcadores.map((m) => {
    const [nome = "", ...resto] = m.split(" — ");
    return { id: "", nome: nome.trim(), texto: resto.join(" — ").trim(), icone: "", usuario: "", data: "" };
  });
}

/** Falha de leitura com a mensagem que o usuário entende (a loja a guarda como `erro` da fatia). */
function amigavel(busca: () => Promise<unknown>): () => Promise<unknown> {
  return async () => {
    try {
      return await busca();
    } catch (e) {
      throw new Error(mensagemDeLeitura(e));
    }
  };
}

export function criarLeituras(d: DepsLeituras): Leituras {
  const bruto = criarLeiturasBrutas(d);
  return Object.fromEntries(Object.entries(bruto).map(([n, f]) => [n, amigavel(f)])) as Leituras;
}

function criarLeiturasBrutas(d: DepsLeituras): Leituras {
  const acoes = acoesDoPainel(d.arv);
  const semConsulta = { disponivel: false, motivo: "consultas" } as const;
  const semAcao = { disponivel: false, motivo: "acao" } as const;
  return {
    dadosProcesso: async (): Promise<DadoProcesso> => {
      if (d.consultasDesativadas) return semConsulta;
      if (!acoes.consultar) return semAcao;
      return { disponivel: true, valor: await consultarDaArvore(d.http, d.arv) };
    },
    anotacao: async (): Promise<DadoAnotacao> => {
      if (d.consultasDesativadas) return semConsulta;
      if (!acoes.anotar) return semAcao;
      return { disponivel: true, valor: await lerAnotacao(d.http, d.arv) };
    },
    marcador: async (): Promise<DadoMarcador> => {
      if (d.consultasDesativadas || !acoes.marcar) return { itens: marcadoresDaArvore(d.arv), editavel: false };
      return { itens: await lerMarcadoresDoProcesso(d.http, d.arv), editavel: true };
    },
    acompanhamento: async (): Promise<DadoAcompanhamento> => {
      if (d.consultasDesativadas) return semConsulta;
      if (!acoes.acompanhar) return semAcao;
      return { disponivel: true, valor: await lerAcompanhamento(d.http, d.arv) };
    },
    atribuicao: async (): Promise<DadoAtribuicao> => ({
      ...lerAtribuicaoDaPagina(d.arv, d.unidadeSigla),
      editavel: acoes.atribuir && d.arv.nivel !== "sigiloso",
    }),
    // Sem leitura própria: o bloco interno só sai do histórico completo (Etapa 3). Devolve o que já existe (o cache).
    blocoInterno: async (): Promise<DadoBlocoInterno> =>
      d.loja.ler<DadoBlocoInterno>("blocoInterno").dado ?? { descricao: null, coletadoEm: 0 },
  };
}
