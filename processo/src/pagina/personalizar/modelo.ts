/**
 * O estado da tela "Personalizar menu rápido" e a gravação dele, SEM DOM, no formato do legado:
 *  - cada aba guarda `[["nome"],["nome"],...]` na chave dela (`configViewFlash*Pro`): só os itens LIGADOS, na ordem em que o
 *    menu os mostra; a entrada "Ativar menu ao clicar" mora na lista do menu do documento;
 *  - a chave geral da aba é `optionsPro.optionsFlashMenu_<bloco>` (`"enabled"`/`"disabled"`), como o `setOptionsPro` do legado.
 * Ao abrir, os itens ligados vêm primeiro (na ordem gravada) e os desligados depois, na ordem do catálogo, como no legado.
 * Lista vazia equivale a "nunca personalizou" (o legado a trata assim): vale o padrão.
 */
import { semAcento as semAcentoBase } from "../../modelo/texto";
import { NOME_MENU_AO_CLICAR, nomeCanonico } from "../menuDoc/catalogo";
import { gravarOpcao, lerListaDoMenu, valorDaOpcao } from "../opcoes";
import type { DefAba, ItemPersonalizar } from "./catalogo";

export type Arm = Pick<Storage, "getItem" | "setItem"> & Partial<Pick<Storage, "removeItem">>;

export interface Linha {
  nome: string;
  ativo: boolean;
}

export interface EstadoAba {
  /** A chave geral da aba (a função inteira ligada). */
  geral: boolean;
  linhas: Linha[];
  /** Só na aba Documentos: "Ativar menu ao clicar". */
  aoClicar: boolean;
}

const chaveGeral = (def: DefAba): string => `optionsFlashMenu_${def.bloco}`;
const ehDocumentos = (def: DefAba): boolean => def.id === "documentos";

export function lerAba(a: Arm, def: DefAba): EstadoAba {
  const salvo = lerListaDoMenu(a, def.chave);
  const lista = salvo ?? def.padrao;
  const conhecidos = new Set(def.itens.map((i) => i.nome));
  const ativos: string[] = [];
  for (const bruto of lista) {
    const nome = nomeCanonico(bruto);
    if (conhecidos.has(nome) && !ativos.includes(nome)) ativos.push(nome);
  }
  const linhas: Linha[] = [
    ...ativos.map((nome) => ({ nome, ativo: true })),
    ...def.itens.filter((i) => !ativos.includes(i.nome)).map((i) => ({ nome: i.nome, ativo: false })),
  ];
  return {
    geral: valorDaOpcao(a, chaveGeral(def)) !== "disabled",
    linhas,
    aoClicar: ehDocumentos(def) && lista.includes(NOME_MENU_AO_CLICAR),
  };
}

/** Os nomes que o legado grava: só os ligados, na ordem das linhas ("Ativar menu ao clicar" vai na frente). */
export function nomesParaGravar(def: DefAba, e: Pick<EstadoAba, "linhas" | "aoClicar">): string[] {
  const nomes = e.linhas.filter((l) => l.ativo).map((l) => l.nome);
  return ehDocumentos(def) && e.aoClicar ? [NOME_MENU_AO_CLICAR, ...nomes] : nomes;
}

export function gravarLista(a: Arm, def: DefAba, e: Pick<EstadoAba, "linhas" | "aoClicar">): void {
  a.setItem(def.chave, JSON.stringify(nomesParaGravar(def, e).map((n) => [n])));
}

export function gravarGeral(a: Arm, def: DefAba, ligado: boolean): void {
  gravarOpcao(a, chaveGeral(def), ligado ? "enabled" : "disabled");
}

/** A aba sem nenhum item ligado: o menu volta ao padrão (é o que o legado faz com a lista vazia). */
export function semNenhum(def: DefAba, e: Pick<EstadoAba, "linhas" | "aoClicar">): boolean {
  return nomesParaGravar(def, { linhas: e.linhas, aoClicar: false }).length === 0 && !(ehDocumentos(def) && e.aoClicar);
}

/** Restaurar padrão: a aba volta a como ninguém a tivesse personalizado (a chave some) e a função fica ligada. */
export function restaurarPadrao(a: Arm, def: DefAba): EstadoAba {
  let apagou = false;
  if (a.removeItem) {
    try {
      a.removeItem(def.chave);
      apagou = true;
    } catch {
      apagou = false;
    }
  }
  if (!apagou) a.setItem(def.chave, JSON.stringify(def.padrao.map((n) => [n])));
  gravarGeral(a, def, true);
  return lerAba(a, def);
}

/** Texto para comparar sem acento nem caixa. */
export const semAcento = (t: string): string => semAcentoBase(t).toLowerCase().trim();

/** Os nomes que casam com a busca (o nome, a dica e o grupo do item); busca vazia casa tudo. */
export function casaComBusca(itens: readonly ItemPersonalizar[], busca: string): Set<string> {
  const q = semAcento(busca);
  const saida = new Set<string>();
  for (const i of itens) {
    if (!q || semAcento(`${i.nome} ${i.dica ?? ""} ${i.grupo ?? ""}`).includes(q)) saida.add(i.nome);
  }
  return saida;
}

export function contar(linhas: readonly Linha[]): { ativos: number; total: number } {
  return { ativos: linhas.filter((l) => l.ativo).length, total: linhas.length };
}

/**
 * Sobe (-1) ou desce (+1) um item LIGADO: ele troca de lugar com o item ligado vizinho (passando por cima dos desligados e dos
 * que a busca esconde). Só a ordem dos ligados é gravada e vale no menu, então mover um desligado não faz nada. Devolve a
 * mesma lista se não houver para onde ir.
 */
export function mover(linhas: readonly Linha[], nome: string, delta: -1 | 1, visivel: (nome: string) => boolean = () => true): Linha[] {
  const i = linhas.findIndex((l) => l.nome === nome);
  if (i < 0 || !(linhas[i] as Linha).ativo) return [...linhas];
  let j = i + delta;
  while (j >= 0 && j < linhas.length && !((linhas[j] as Linha).ativo && visivel((linhas[j] as Linha).nome))) j += delta;
  if (j < 0 || j >= linhas.length) return [...linhas];
  const nova = [...linhas];
  [nova[i], nova[j]] = [nova[j] as Linha, nova[i] as Linha];
  return nova;
}

/** O item ligado pode subir (-1) ou descer (+1)? (Há outro ligado, visível, nessa direção.) */
export function podeMover(linhas: readonly Linha[], nome: string, delta: -1 | 1, visivel: (nome: string) => boolean = () => true): boolean {
  const i = linhas.findIndex((l) => l.nome === nome);
  if (i < 0 || !(linhas[i] as Linha).ativo) return false;
  for (let j = i + delta; j >= 0 && j < linhas.length; j += delta)
    if ((linhas[j] as Linha).ativo && visivel((linhas[j] as Linha).nome)) return true;
  return false;
}

/** Arrastar: põe a linha `nome` antes da linha `antesDe` (ou no fim, com `null`). */
export function moverPara(linhas: readonly Linha[], nome: string, antesDe: string | null): Linha[] {
  const origem = linhas.find((l) => l.nome === nome);
  if (!origem || nome === antesDe) return [...linhas];
  const resto = linhas.filter((l) => l.nome !== nome);
  const alvo = antesDe === null ? resto.length : resto.findIndex((l) => l.nome === antesDe);
  resto.splice(alvo < 0 ? resto.length : alvo, 0, origem);
  return resto;
}
