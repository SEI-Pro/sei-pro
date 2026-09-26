/**
 * O que a tela do SEI faz depois de uma escrita do agente.
 *
 * Criar documento pela ponte deixava a árvore do processo velha: o documento
 * existia no SEI e não aparecia na tela até o usuário recarregar à mão. Pior
 * ainda, ele abria o visualizador vazio se clicasse no lugar errado.
 *
 * O que se decide aqui é QUANDO mexer na tela e em QUE documento — e,
 * sobretudo, quando NÃO mexer: prévia não mexe, escrita que não foi aplicada
 * não mexe, e operação que não é de documento não mexe.
 */

import { alvoParaMostrar } from "../src/ponte/operacoes";
import { checar, secao } from "./util";

const criado = { alvo: "1", mudancas: [], aplicado: true, resumo: "", dados: { idDocumento: "3317255", numero: "3024923" } };

export function verificarDepoisDaEscrita(): void {
  secao("ponte: o que mostrar depois da escrita");
  checar("documento criado abre pelo id interno", alvoParaMostrar("documento.criar", {}, criado)?.id === "3317255");
  checar("e recarrega a arvore", alvoParaMostrar("documento.criar", {}, criado)?.recarregarArvore === true);

  const previa = { ...criado, aplicado: false };
  checar("previa NAO mexe na tela", alvoParaMostrar("documento.criar", {}, previa) === null);
  checar("criacao sem id NAO mexe", alvoParaMostrar("documento.criar", {}, { ...criado, dados: {} }) === null);
  checar("resultado torto NAO mexe", alvoParaMostrar("documento.criar", {}, null) === null && alvoParaMostrar("documento.criar", {}, "oi") === null);

  // Editar o conteúdo do documento recém-criado: a árvore já está certa, mas o
  // visualizador mostra o texto antigo (ou vazio, se acabou de nascer).
  const editado = { alvo: "3024923", mudancas: [], aplicado: true, resumo: "" };
  const ed = alvoParaMostrar("documento.editar", { numero: "3024923" }, editado);
  checar("documento editado e reaberto pelo nº SEI", ed?.numero === "3024923", ed);
  checar("e a arvore NAO precisa recarregar (nada entrou nem saiu dela)", ed?.recarregarArvore === false, ed);
  checar("edicao nao aplicada NAO mexe", alvoParaMostrar("documento.editar", { numero: "1" }, { ...editado, aplicado: false }) === null);

  secao("ponte: o que NAO mexe na tela");
  for (const op of ["processo.arvore", "documento.ler", "pesquisar", "processo.enviar", "documento.assinar", "bloco.criar", "tela"]) {
    checar(`${op} nao mexe na tela`, alvoParaMostrar(op, {}, criado) === null);
  }
}
