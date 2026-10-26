/**
 * Aplicação ao vivo: quando a personalização muda (na tela nova ou em outra janela), o menu, os ícones fixos e os painéis
 * reagem sem recarregar a página. Dois caminhos, o mesmo aviso:
 *  - dentro do quadro da árvore (onde mora o content script e onde a tela nova grava): um barramento simples em memória;
 *  - fora dele (o legado ou outra aba gravando o localStorage da mesma origem): o evento `storage`, que o navegador
 *    entrega a todas as outras janelas da origem, exceto a que gravou.
 */
import { valorDaOpcao } from "../opcoes";
import { ABAS, CHAVE_LISTA_ARVORE, CHAVE_LISTA_DOCUMENTOS, CHAVE_LISTA_PAINEL, CHAVE_LISTA_PROCESSO, type IdAba } from "./catalogo";

export type AbaAfetada = IdAba | "todas";
type Ouvinte = (aba: AbaAfetada) => void;

const ouvintes = new Set<Ouvinte>();

/** Quem quer saber de mudanças na personalização. Devolve o desligador. */
export function aoMudarPersonalizacao(cb: Ouvinte): () => void {
  ouvintes.add(cb);
  return () => void ouvintes.delete(cb);
}

export function avisarPersonalizacao(aba: AbaAfetada): void {
  for (const cb of [...ouvintes]) {
    try {
      cb(aba);
    } catch (e) {
      // um consumidor com defeito não pode impedir os outros de reagir
      console.warn("[SEI Pro] personalização:", e);
    }
  }
}

const ABA_DA_CHAVE: Record<string, IdAba> = {
  [CHAVE_LISTA_PROCESSO]: "processo",
  [CHAVE_LISTA_DOCUMENTOS]: "documentos",
  [CHAVE_LISTA_ARVORE]: "arvore",
  [CHAVE_LISTA_PAINEL]: "painel",
};

/** Escuta gravações do localStorage feitas por OUTRA janela da origem e as repassa ao barramento. */
export function ouvirArmazenamentoExterno(janela: Pick<Window, "addEventListener" | "removeEventListener">): () => void {
  const aoGravar = (ev: Event) => {
    const chave = (ev as StorageEvent).key;
    // key nula = limparam tudo; optionsPro guarda as chaves gerais (e muita coisa que não nos importa: só avisa, o consumidor confere).
    if (chave === null || chave === "optionsPro") return avisarPersonalizacao("todas");
    const aba = ABA_DA_CHAVE[chave];
    if (aba) avisarPersonalizacao(aba);
  };
  janela.addEventListener("storage", aoGravar);
  return () => janela.removeEventListener("storage", aoGravar);
}

type Leitura = Pick<Storage, "getItem" | "setItem"> & Partial<Pick<Storage, "removeItem">>;

/** O que, no armazenamento, define uma aba: a lista gravada e a chave geral. Muda só quando a personalização muda. */
function assinaturaDaAba(a: Leitura, aba: IdAba): string {
  const def = ABAS.find((d) => d.id === aba);
  if (!def) return "";
  let lista: string | null = null;
  try {
    lista = a.getItem(def.chave);
  } catch {
    lista = null;
  }
  return `${lista ?? ""}|${String(valorDaOpcao(a, `optionsFlashMenu_${def.bloco}`) ?? "")}`;
}

/**
 * Chama `cb(aba)` quando a personalização de uma aba MUDOU de fato, venha a mudança da tela nova (barramento) ou de outra
 * janela (`storage`). O `optionsPro` é gravado por muita coisa (painéis abertos/recolhidos, filtros...): comparar com a
 * última assinatura evita refazer o menu e os painéis à toa. Devolve o desligador.
 */
export function observarPersonalizacao(
  a: Leitura,
  janela: Pick<Window, "addEventListener" | "removeEventListener"> | null,
  cb: (aba: IdAba) => void,
): () => void {
  const ultimas = new Map<IdAba, string>(ABAS.map((d) => [d.id, assinaturaDaAba(a, d.id)]));
  const conferir = (afetada: AbaAfetada) => {
    for (const d of ABAS) {
      if (afetada !== "todas" && afetada !== d.id) continue;
      const nova = assinaturaDaAba(a, d.id);
      if (nova === ultimas.get(d.id)) continue;
      ultimas.set(d.id, nova);
      cb(d.id);
    }
  };
  const sairBarramento = aoMudarPersonalizacao(conferir);
  const sairExterno = janela ? ouvirArmazenamentoExterno(janela) : () => {};
  return () => {
    sairBarramento();
    sairExterno();
  };
}
