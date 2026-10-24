/**
 * O que o menu do documento precisa da arvore: acoes (endereco), botoes, funcoes dos botoes sem endereco e os
 * documentos de uma pasta aberta sob demanda. Fixtures reais do SEI SP Treinamento (4.1.5); sem requisicao.
 */

import { lerArvore, lerDocumentosDaPagina } from "../src/dominio/arvore";
import { tirarMinuta } from "../src/dominio/documento";
import { acaoDe } from "../src/links/links";
import { checar, fixture, secao } from "./util";

export async function verificarMenuDoc(): Promise<void> {
  secao("menu do documento: acoes, botoes e funcoes na arvore (4.1.5)");
  const arv = lerArvore(fixture("sei41/arvore_completa.html"));
  const interno = arv.documentos.find((d) => d.id === "160173")!;
  const externo = arv.documentos.find((d) => d.id === "160178")!;
  const assinado = arv.documentos.find((d) => d.id === "148268")!;
  const ids = (d: { acoes: string[] }) => d.acoes.map(acaoDe);

  checar("interno nao assinado: consultar, bloco, versoes, assinatura externa, favoritos por endereco", ["documento_alterar", "bloco_escolher", "documento_versao_listar", "assinatura_externa_gerenciar", "protocolo_modelo_gerenciar"].every((a) => ids(interno).includes(a)));
  checar("interno: o conteudo (visualizar) vem do src, sem requisicao", /acao=documento_visualizar/.test(interno.src));
  checar("interno: botoes sem endereco aparecem como funcoes (editar, assinar, excluir)", ["editarConteudo", "assinarDocumento", "excluirDocumento"].every((f) => interno.funcoes?.includes(f)), interno.funcoes);
  checar("interno nao assinado: nao oferece ciencia", !interno.funcoes?.includes("cienciaDocumento"));
  checar("externo: consultar e o 'recebido', mover documento por endereco, sem bloco nem versoes", ids(externo).includes("documento_alterar_recebido") && ids(externo).includes("documento_mover") && !ids(externo).includes("bloco_escolher") && !ids(externo).includes("documento_versao_listar"));
  checar("externo: baixar vem do src (documento_download_anexo)", /documento_download_anexo/.test(externo.src));
  checar("externo: ciencia e excluir como funcoes", Boolean(externo.funcoes?.includes("cienciaDocumento") && externo.funcoes?.includes("excluirDocumento")));
  checar("assinado: verificar assinaturas por endereco, sem editar conteudo", ids(assinado).includes("assinatura_verificar") && !assinado.funcoes?.includes("editarConteudo"), assinado.funcoes);
  checar("assinado: a arvore sabe que esta assinado", assinado.assinado);
  checar("processo: funcoes dos botoes sem endereco (ciencia, e-mail, bloco)", ["cienciaProcesso", "enviarEmailProcedimento", "incluirEmBloco"].every((f) => arv.funcoesProcesso?.includes(f)), arv.funcoesProcesso);
  checar("processo: acoes por endereco (atribuir, duplicar, concluir)", ["procedimento_atribuicao_cadastrar", "procedimento_duplicar", "procedimento_concluir"].every((a) => arv.acoesProcesso.map(acaoDe).includes(a)));

  secao("menu do documento: documentos de uma pasta aberta sob demanda (#ifrPasta)");
  const pasta = lerDocumentosDaPagina(fixture("sei41/pasta_paginar.html"));
  checar("a pasta traz os documentos (sem o no do processo)", pasta.length >= 15, pasta.length);
  const p0 = pasta.find((d) => d.id === "148266")!;
  checar("documento da pasta: numero, titulo e acoes", p0.numero === "0094776" && ids(p0).includes("documento_alterar") && p0.botoes.length > 5, p0.numero);
  checar("documento da pasta: assinatura vem da pagina da pasta", p0.assinado);
  checar("documento da pasta: funcoes dos botoes", Boolean(p0.funcoes?.includes("cienciaDocumento")), p0.funcoes);
  checar("a pasta nao inclui processo anexado nem documento movido como documento", !pasta.some((d) => d.id === "145698" || d.id.includes("-")));

  secao("duplicar: pergunta de remover MINUTA");
  checar("tira a palavra e o separador que a antecede", tirarMinuta("Despacho - Minuta") === "Despacho" && tirarMinuta("Minuta de Oficio") === "de Oficio" && tirarMinuta("MINUTA") === "");
  checar("nao mexe em palavra que apenas contem minuta", tirarMinuta("Minutario") === "Minutario");
}
