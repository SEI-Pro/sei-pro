/**
 * Repositório da árvore: uma entidade por chave (`Colecao`), com lápide para
 * exclusões, para que a mesclagem entre colegas saiba o que foi apagado.
 *
 * A mesclagem usa `vence` do `sei-comum` (mais recente vence; empate por
 * dispositivo). A integridade do `pai` fica para a exibição (ver modelo.ts).
 */

import type { Area } from "@comum/armazenamento/area";
import { Colecao } from "@comum/armazenamento/colecao";
import { novoId } from "@comum/id";
import { indiceEntre } from "@comum/ordem/indice";
import { porId } from "@comum/sincronia/assinatura";
import { type Versionada, vence } from "@comum/sincronia/entidade";
import type { EntidadesArvore, Envelope, IdentidadeArvore, Pasta, Vinculo } from "./modelo";
import { ErroArvore, FORMATO, LIMITE_NOME_PASTA, pastaValida, VERSAO, vinculoValido } from "./modelo";

export interface Carimbo {
  agora: number;
  dispositivo: string;
}

export interface DepsRepositorio {
  area: Area;
  /** A que SEI/unidade este repositório pertence (vai no envelope). */
  ident: IdentidadeArvore;
  carimbo: () => Carimbo;
  /** Gerador de id das pastas (padrão: 10 hexadecimais aleatórios, compacto para o envelope). */
  gerarId?: () => string;
}

export const PREFIXO_PASTAS = "base-conhecimento/pastas/";
export const PREFIXO_VINCULOS = "base-conhecimento/vinculos/";

const idCurto = () => novoId().replace(/-/g, "").slice(0, 10);

const nomeLimpo = (nome: string): string => {
  const t = (nome ?? "").trim();
  if (t.length < 1 || t.length > LIMITE_NOME_PASTA)
    throw new ErroArvore(`O nome da pasta deve ter de 1 a ${LIMITE_NOME_PASTA} caracteres.`);
  return t;
};

const viva = <T extends Versionada>(x: T | undefined): T | undefined => (x && x.removidoEm === undefined ? x : undefined);

const porOrdem = <T extends { ordem: string }>(a: T, b: T): number => (a.ordem < b.ordem ? -1 : a.ordem > b.ordem ? 1 : 0);

/** Carimbo de operação → campos de Versionada (o carimbo usa `agora`; a entidade usa `atualizadoEm`). */
const carimboDe = (c: Carimbo): { atualizadoEm: number; dispositivo: string } => ({
  atualizadoEm: c.agora,
  dispositivo: c.dispositivo,
});

export class RepositorioArvore {
  readonly pastas: Colecao<Pasta>;
  readonly vinculos: Colecao<Vinculo>;
  private readonly d: DepsRepositorio;

  constructor(d: DepsRepositorio) {
    this.d = d;
    this.pastas = new Colecao<Pasta>(d.area, PREFIXO_PASTAS);
    this.vinculos = new Colecao<Vinculo>(d.area, PREFIXO_VINCULOS);
  }

  carimboAtual(): Carimbo {
    return this.d.carimbo();
  }

  aoMudar(cb: () => void): () => void {
    const a = this.pastas.aoMudar(cb);
    const b = this.vinculos.aoMudar(cb);
    return () => {
      a();
      b();
    };
  }

  /** Todas as entidades, inclusive lápides (a exibição filtra). Ordenadas por id. */
  async listar(): Promise<EntidadesArvore> {
    const [p, v] = await Promise.all([this.pastas.listar(), this.vinculos.listar()]);
    return { p: porId(p), v: porId(v) };
  }

  /** Mescla entidades vindas de outro computador (mais recente vence; lápide vale). */
  async importar(ent: Partial<EntidadesArvore>): Promise<void> {
    await this.mesclar(this.pastas, (ent.p ?? []).filter(pastaValida));
    await this.mesclar(this.vinculos, (ent.v ?? []).filter(vinculoValido));
  }

  async exportar(): Promise<Envelope> {
    const { p, v } = await this.listar();
    return {
      formato: FORMATO,
      versao: VERSAO,
      host: this.d.ident.host,
      unidade: this.d.ident.unidade,
      entidades: { p, v },
    };
  }

  async criarPasta(nome: string, pai: string | null, antes?: string): Promise<Pasta> {
    const limpo = nomeLimpo(nome);
    if (pai !== null && !viva(await this.pastas.obter(pai))) throw new ErroArvore("A pasta de destino nao existe.");
    const irmaos = await this.irmasDe(pai);
    let prev: string | null = null;
    let next: string | null = null;
    const idx = antes ? irmaos.findIndex((p) => p.id === antes) : -1;
    if (idx >= 0) {
      prev = irmaos[idx - 1]?.ordem ?? null;
      next = irmaos[idx]?.ordem ?? null;
    } else {
      prev = irmaos[irmaos.length - 1]?.ordem ?? null;
    }
    const pasta: Pasta = {
      id: (this.d.gerarId ?? idCurto)(),
      nome: limpo,
      pai,
      ordem: indiceEntre(prev, next),
      ...carimboDe(this.d.carimbo()),
    };
    await this.pastas.gravar(pasta.id, pasta);
    return pasta;
  }

  async renomearPasta(id: string, nome: string): Promise<Pasta> {
    const p = viva(await this.pastas.obter(id));
    if (!p) throw new ErroArvore("A pasta nao existe.");
    const atualizada: Pasta = { ...p, nome: nomeLimpo(nome), ...carimboDe(this.d.carimbo()) };
    await this.pastas.gravar(id, atualizada);
    return atualizada;
  }

  async moverPasta(id: string, pai: string | null): Promise<Pasta> {
    const p = viva(await this.pastas.obter(id));
    if (!p) throw new ErroArvore("A pasta nao existe.");
    if (pai !== null) {
      if (pai === id) throw new ErroArvore("Uma pasta nao pode ficar dentro dela mesma.");
      if (!viva(await this.pastas.obter(pai))) throw new ErroArvore("A pasta de destino nao existe.");
      if (await this.ehDescendente(pai, id)) throw new ErroArvore("Uma pasta nao pode ir para dentro de uma subpasta dela.");
    }
    const irmaos = (await this.irmasDe(pai)).filter((x) => x.id !== id);
    const movida: Pasta = {
      ...p,
      pai,
      ordem: indiceEntre(irmaos[irmaos.length - 1]?.ordem ?? null, null),
      ...carimboDe(this.d.carimbo()),
    };
    await this.pastas.gravar(id, movida);
    return movida;
  }

  /** Exclui a pasta e as subpastas (lápides): os vínculos de toda a subárvore voltam a "Sem pasta". */
  async excluirPasta(id: string): Promise<void> {
    const p = viva(await this.pastas.obter(id));
    if (!p) return;
    const carimbo = this.d.carimbo();
    const vivas = (await this.pastas.listar()).filter((x) => x.removidoEm === undefined);
    const alvo = new Set<string>([id]);
    let mudou = true;
    while (mudou) {
      mudou = false;
      for (const x of vivas) {
        if (x.pai !== null && alvo.has(x.pai) && !alvo.has(x.id)) {
          alvo.add(x.id);
          mudou = true;
        }
      }
    }
    const vinculos = await this.vinculos.listar();
    for (const v of vinculos) {
      if (v.removidoEm === undefined && v.pasta !== null && alvo.has(v.pasta))
        await this.vinculos.gravar(v.id, { ...v, pasta: null, ...carimboDe(carimbo) });
    }
    for (const alvoId of alvo) {
      const pasta = vivas.find((x) => x.id === alvoId);
      if (pasta) await this.pastas.gravar(pasta.id, { ...pasta, removidoEm: carimbo.agora, ...carimboDe(carimbo) });
    }
  }

  /** Cria ou reposiciona o vínculo de um item (título é cache do título real). */
  async moverVinculo(agrupador: string, pasta: string | null, titulo: string): Promise<Vinculo> {
    if (pasta !== null && !viva(await this.pastas.obter(pasta))) throw new ErroArvore("A pasta de destino nao existe.");
    const atual = await this.vinculos.obter(agrupador);
    let ordem: string;
    if (atual && atual.removidoEm === undefined && atual.pasta === pasta) {
      ordem = atual.ordem;
    } else {
      const irmaos = (await this.vinculos.listar())
        .filter((v) => v.removidoEm === undefined && v.pasta === pasta && v.id !== agrupador)
        .sort(porOrdem);
      ordem = indiceEntre(irmaos[irmaos.length - 1]?.ordem ?? null, null);
    }
    const vinculo: Vinculo = { id: agrupador, titulo, pasta, ordem, ...carimboDe(this.d.carimbo()) };
    await this.vinculos.gravar(agrupador, vinculo);
    return vinculo;
  }

  async removerVinculo(agrupador: string): Promise<void> {
    const atual = viva(await this.vinculos.obter(agrupador));
    if (!atual) return;
    const carimbo = this.d.carimbo();
    await this.vinculos.gravar(agrupador, { ...atual, removidoEm: carimbo.agora, ...carimboDe(carimbo) });
  }

  private async irmasDe(pai: string | null): Promise<Pasta[]> {
    const todas = await this.pastas.listar();
    return todas.filter((p) => p.removidoEm === undefined && p.pai === pai).sort(porOrdem);
  }

  private async ehDescendente(candidato: string, ancestral: string): Promise<boolean> {
    let atual: string | null = candidato;
    const vistos = new Set<string>();
    while (atual !== null && !vistos.has(atual)) {
      if (atual === ancestral) return true;
      vistos.add(atual);
      atual = viva(await this.pastas.obter(atual))?.pai ?? null;
    }
    return false;
  }

  private async mesclar<T extends Versionada>(col: Colecao<T>, novas: T[]): Promise<void> {
    for (const n of novas) {
      const atual = await col.obter(n.id);
      if (!atual || vence(n, atual)) await col.gravar(n.id, n);
    }
  }
}
