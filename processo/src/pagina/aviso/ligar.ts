/**
 * Liga o aviso no quadro do Enviar Processo. Roda em todo quadro `acao=procedimento_enviar` (o do visualizador aninhado
 * do SEI 4.1 e o do 5), com a opção `naoassinados` ligada (padrão do legado: ligada). A árvore é a do quadro vizinho.
 */
import { areaChrome } from "@comum/armazenamento/area";
import { opcaoLegadaLigada } from "@comum/opcoes/legadas";
import { documentoTopo } from "@nucleo/sessao/pagina";
import { historicoGuardado } from "../../gantt/coleta";
import { OPCAO_NAO_ASSINADOS } from "../../modelo/constantes";
import { LojaProcesso } from "../../modelo/loja";
import { escopoDoUsuario, lerUsuarioEUnidade } from "../contexto";
import { aguardarArvore, tentarLerArvore } from "../leituraArvore";
import { type Aviso, montarAviso } from "./aviso";
import { datasDeGeracao } from "./modelo";

export function ehEnviarProcesso(janela: Pick<Window, "location" | "top">): boolean {
  return janela !== janela.top && /[?&]acao=procedimento_enviar(&|$)/.test(janela.location.search);
}

/** O documento do quadro da árvore da janela de topo (`#ifrArvore`), ou null se não dá para ler. */
export function quadroDaArvoreDoTopo(topo: Document): Document | null {
  try {
    return (topo.getElementById("ifrArvore") as HTMLIFrameElement | null)?.contentDocument ?? null;
  } catch {
    return null;
  }
}

export async function ligarAviso(doc: Document = document): Promise<Aviso | null> {
  if (!doc.getElementById("frmAtividadeListar")) return null;
  const { dataValues } = (await chrome.storage.sync.get("dataValues")) as { dataValues?: unknown };
  if (!opcaoLegadaLigada(dataValues, OPCAO_NAO_ASSINADOS)) return null;
  const topo = documentoTopo();
  const quadro = quadroDaArvoreDoTopo(topo);
  // A árvore já está na tela (o Enviar Processo é aberto a partir dela); a espera é só para o caso de carga em andamento.
  const arv = quadro ? (tentarLerArvore(quadro) ?? (await aguardarArvore(quadro, 5000))) : null;
  const u = lerUsuarioEUnidade(topo);
  return montarAviso({
    doc,
    topo,
    quadroDaArvore: () => quadroDaArvoreDoTopo(topo),
    lerArvore: (q) => tentarLerArvore(q),
    unidade: u.unidade.sigla,
    datas: async () => {
      if (!arv || arv.nivel === "sigiloso" || !u.login) return null;
      const loja = new LojaProcesso(areaChrome(chrome.storage.local, "local"), escopoDoUsuario(u.host, u.login), arv.idProcedimento);
      const g = await historicoGuardado({ loja, agora: () => new Date(), sigiloso: false });
      return g?.vale ? datasDeGeracao(g.historico.andamentos) : null;
    },
  });
}
