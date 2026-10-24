/**
 * As escritas e as listas dos modais, sobre as funções do núcleo. Toda escrita vai pela fila do processo
 * (`loja.enfileirar`), com `aplicar: true` e a prova de sucesso que o núcleo exige: se o SEI não confirmar, a
 * função lança e o modal mostra a mensagem do SEI, mantendo o valor anterior.
 */

import { atribuirProcesso, definirAcompanhamento, definirAnotacao, definirMarcador } from "@nucleo/dominio/acoesProcesso";
import type { Arvore } from "@nucleo/dominio/arvore";
import type { OpcoesEscrita, ResultadoEscrita } from "@nucleo/dominio/escrita";
import {
  type FormularioDoProcesso,
  lerFormularioDoProcesso,
  lerOpcoesAcompanhamento,
  lerOpcoesAtribuicao,
  lerOpcoesMarcador,
  type OpcaoLista,
} from "@nucleo/dominio/painelProcesso";
import { type AlteracaoProcesso, alterarProcesso } from "@nucleo/dominio/processo";
import type { Sei } from "@nucleo/sei";
import type { LojaProcesso } from "../modelo/loja";

export interface Operacoes {
  atribuir(usuario: string | null): Promise<ResultadoEscrita>;
  anotar(a: { texto: string; prioridade: boolean }): Promise<ResultadoEscrita>;
  acompanhar(a: { grupo?: string; observacao?: string }): Promise<ResultadoEscrita>;
  /** `marcador` é o NOME do marcador (o núcleo compara por nome para saber se o processo já o tem). */
  marcar(m: { marcador: string; texto?: string }): Promise<ResultadoEscrita>;
  desmarcar(marcador: string): Promise<ResultadoEscrita>;
  alterarProcesso(a: AlteracaoProcesso): Promise<ResultadoEscrita>;
  opcoesAtribuicao(): Promise<{ opcoes: OpcaoLista[]; atual?: string }>;
  opcoesMarcador(): Promise<OpcaoLista[]>;
  opcoesAcompanhamento(): Promise<{ grupos: OpcaoLista[]; atual?: string }>;
  formularioDoProcesso(): Promise<FormularioDoProcesso>;
}

export function operacoesDe(sei: Sei, arv: Arvore, loja: LojaProcesso): Operacoes {
  const ref = arv.protocolo;
  const gravar = <R>(fn: (op: OpcoesEscrita) => Promise<R>): Promise<R> => loja.enfileirar(() => fn({ aplicar: true }));
  return {
    atribuir: (usuario) => gravar((op) => atribuirProcesso(sei, ref, usuario, op)),
    anotar: (a) => gravar((op) => definirAnotacao(sei, ref, a, op)),
    acompanhar: (a) => gravar((op) => definirAcompanhamento(sei, ref, a, op)),
    marcar: (m) => gravar((op) => definirMarcador(sei, ref, m, op)),
    desmarcar: (marcador) => gravar((op) => definirMarcador(sei, ref, { marcador, remover: true }, op)),
    alterarProcesso: (a) => gravar((op) => alterarProcesso(sei, ref, a, op)),
    opcoesAtribuicao: () => lerOpcoesAtribuicao(sei.http, arv),
    opcoesMarcador: () => lerOpcoesMarcador(sei.http, arv),
    opcoesAcompanhamento: () => lerOpcoesAcompanhamento(sei.http, arv),
    formularioDoProcesso: () => lerFormularioDoProcesso(sei, arv),
  };
}
