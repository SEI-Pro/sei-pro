/**
 * O painel lateral da extensão (html/painel.html): abas Favoritos | Histórico |
 * Projetos | Demandas | Agente de IA. A casca genérica mora em `@comum/painel/shell`; aqui
 * só se decide quais abas existem neste pacote e como cada uma se chama.
 */

import type { Area } from "@comum/armazenamento/area";
import { CHAVE_CONTADOR_DEMANDAS, CHAVE_CONTADOR_PROJETOS, TETO_CONTADOR_DEMANDAS, TETO_CONTADOR_PROJETOS } from "@comum/painel/contadores";
import { CHAVE_ABA, type DefAba, montarAbas } from "@comum/painel/shell";

export { CHAVE_ABA };
export type AbaPainel = "favoritos" | "historico" | "projetos" | "demandas" | "conhecimento" | "agente";

export interface DepsShell {
  sessao: Area;
  temAgente: boolean;
  /** O favoritos novo está no manifest (no pacote oficial ainda com o antigo, a aba nunca conectaria). Padrão: true. */
  temFavoritos?: boolean;
  /** O histórico está no manifest (js/init_historico.js). Padrão: false. */
  temHistorico?: boolean;
  /** Os projetos novos estão no manifest (js/init_projetos.js). Padrão: false. */
  temProjetos?: boolean;
  /** O Gestor de Demandas está no manifest (js/init_demandas.js). Padrão: false. */
  temDemandas?: boolean;
  /** A Base de Conhecimento em pastas está no manifest (js/init_base_conhecimento.js). Padrão: false. */
  temConhecimento?: boolean;
  url(caminho: string): string;
  /** Aba pedida pelo endereço (`#aba=agente`), quando o painel abre numa janela comum (Firefox). */
  abaDoEndereco?: AbaPainel | null;
  /** Id da janela deste painel: o pedido de aba de outra janela nao troca a aba daqui. */
  janela?: () => Promise<number | null>;
  /** chrome.storage.local: o app grava as pendências (lembretes + novidades) em `favoritos/contadorPainel`. */
  local?: Area;
}

export const CHAVE_CONTADOR = "favoritos/contadorPainel";

/** O que o manifest do pacote declara, só o que decide as abas. */
export interface ManifestoDoPacote {
  content_scripts?: ReadonlyArray<{ js?: readonly string[] }>;
}

/**
 * Quais ferramentas este pacote tem, pelos content scripts do manifest. O oficial (manifest_seipro.json) ainda não
 * tem init_favoritos, init_historico, init_projetos nem init_demandas: as abas que nunca conectariam não aparecem.
 */
export function ferramentasDoPacote(
  m: ManifestoDoPacote,
): Required<Pick<DepsShell, "temAgente" | "temFavoritos" | "temHistorico" | "temProjetos" | "temDemandas" | "temConhecimento">> {
  const tem = (arquivo: string) => (m.content_scripts ?? []).some((c) => c.js?.includes(arquivo) === true);
  return {
    temAgente: tem("js/init_agente.js"),
    temFavoritos: tem("js/init_favoritos.js"),
    temHistorico: tem("js/init_historico.js"),
    temProjetos: tem("js/init_projetos.js"),
    temDemandas: tem("js/init_demandas.js"),
    temConhecimento: tem("js/init_base_conhecimento.js"),
  };
}

const ABAS: readonly AbaPainel[] = ["favoritos", "historico", "projetos", "demandas", "conhecimento", "agente"];

/** A aba pedida pelo endereço (`#aba=projetos`), quando o painel abre numa janela comum (Firefox); outra coisa: nenhuma. */
export function abaPedidaNoEndereco(hash: string): AbaPainel | null {
  const v = new URLSearchParams(hash.replace(/^#/, "")).get("aba");
  return ABAS.find((x) => x === v) ?? null;
}

export async function montarShell(raiz: HTMLElement, d: DepsShell): Promise<{ mostrar(aba: AbaPainel): void; atual(): AbaPainel }> {
  const abas: DefAba[] = [
    ...(d.temFavoritos !== false
      ? [
          {
            id: "favoritos",
            rotulo: "Monitorados",
            icone: "alvo",
            caminho: "html/favoritos.html#modo=lateral",
            titulo: "Monitorados do SEI Pro",
            contador: {
              chave: CHAVE_CONTADOR,
              dica: (n: number) => `${n} ${n === 1 ? "monitorado pede" : "monitorados pedem"} atenção (lembrete ou novidade)`,
            },
          } satisfies DefAba,
        ]
      : []),
    ...(d.temHistorico === true
      ? [
          {
            id: "historico",
            rotulo: "Histórico",
            icone: "historico",
            caminho: "html/historico.html#modo=lateral",
            titulo: "Histórico de processos visitados",
          } satisfies DefAba,
        ]
      : []),
    ...(d.temProjetos === true
      ? [
          {
            id: "projetos",
            rotulo: "Projetos",
            icone: "gantt",
            caminho: "html/projetos.html#modo=lateral",
            titulo: "Projetos do SEI Pro",
            contador: {
              chave: CHAVE_CONTADOR_PROJETOS,
              dica: (n: number) => `${n} ${n === 1 ? "etapa atrasada" : "etapas atrasadas"} nos projetos da unidade`,
              teto: TETO_CONTADOR_PROJETOS,
            },
          } satisfies DefAba,
        ]
      : []),
    ...(d.temDemandas === true
      ? [
          {
            id: "demandas",
            rotulo: "Demandas",
            icone: "demandas",
            caminho: "html/demandas.html#modo=lateral",
            titulo: "Demandas",
            contador: {
              chave: CHAVE_CONTADOR_DEMANDAS,
              dica: (n: number) => `${n} ${n === 1 ? "demanda sua atrasada" : "demandas suas atrasadas"} na unidade`,
              teto: TETO_CONTADOR_DEMANDAS,
            },
          } satisfies DefAba,
        ]
      : []),
    ...(d.temConhecimento === true
      ? [
          {
            id: "conhecimento",
            rotulo: "Conhecimento",
            icone: "pasta",
            caminho: "html/base-conhecimento.html#modo=lateral",
            titulo: "Base de Conhecimento em pastas",
          } satisfies DefAba,
        ]
      : []),
    ...(d.temAgente
      ? [
          {
            id: "agente",
            rotulo: "Agente de IA",
            icone: "brilho",
            caminho: "html/agente.html",
            titulo: "Agente de IA do SEI Pro",
          } satisfies DefAba,
        ]
      : []),
  ];
  const r = await montarAbas(raiz, {
    sessao: d.sessao,
    local: d.local,
    abas,
    url: d.url,
    abaDoEndereco: d.abaDoEndereco,
    janela: d.janela,
  });
  return {
    mostrar: (aba) => r.mostrar(aba),
    atual: () => (r.atual() || "agente") as AbaPainel,
  };
}
