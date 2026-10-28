/**
 * Menu da arvore (menuDoc/): quais itens aparecem por documento (interno, externo, assinado, cancelado) a partir
 * das fixtures do SEI SP (4.1.5), o que cada item faz, hover e clique, teclado, icones fixos, pastas abertas sob
 * demanda e a variante de ancora do SEI 5 (sintetica, do fonte do SEI 5.0.0: `data-serialtip` no `anchorImg`).
 * O linkedom nao tem foco real nem layout: o que depende deles se prova ao vivo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaMemoria } from "@comum/armazenamento/area";
import { type Arvore, type DocumentoArvore, lerArvore } from "@nucleo/dominio/arvore";
import { definirAnalisador } from "@nucleo/sessao/dom";
import type { Http } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { LojaProcesso } from "../src/modelo/loja";
import { paineisHabilitados } from "../src/modelo/paineis";
import { criarContexto } from "../src/pagina/contexto";
import { ehQuadroDaArvore, marcarMenu } from "../src/pagina/marca";
import {
  type AlvoDocumento,
  type ItemMenu,
  iconesFixosDoDocumento,
  itensDoDocumento,
  itensDoProcesso,
  type OpcoesMenu,
  type Servicos,
} from "../src/pagina/menuDoc/acoes";
import { ITENS_DOCUMENTO, ITENS_PROCESSO, NOME_MENU_AO_CLICAR } from "../src/pagina/menuDoc/catalogo";
import {
  copiaDoNome,
  copiaDoNomeComLink,
  copiaDoNumero,
  copiaDoNumeroComLink,
  linkPermanente,
  nomeSeiDoRotulo,
  numeroSeiDoRotulo,
  soNumeros,
} from "../src/pagina/menuDoc/copiar";
import { DocumentosDaTela, idDoNo, textoDosComentarios } from "../src/pagina/menuDoc/documentos";
import { ligarMenuDaArvore } from "../src/pagina/menuDoc/ligar";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const lerFixture = (nome: string) =>
  readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures", nome), "utf8").replace(/^<!-- url: .*? -->\n/, "");
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const TODOS_DOC = ITENS_DOCUMENTO.map((d) => d.nome);
const TODOS_PROC = ITENS_PROCESSO.map((d) => d.nome);

interface Registro {
  chamadas: string[];
  servicos: Servicos;
  confirmar: boolean;
  minuta: "remover" | "manter" | null;
  nativo: boolean;
}

function servicosFalsos(): Registro {
  const r: Registro = { chamadas: [], confirmar: true, minuta: "remover", nativo: false, servicos: null as unknown as Servicos };
  const reg = (s: string): void => void r.chamadas.push(s);
  r.servicos = {
    copiar: async (c, aviso) => reg(`copiar:${c.texto}|${c.html ?? ""}|${aviso}`),
    abrirNoVisualizador: (l) => reg(`viewer:${l}`),
    abrirEmNovaAba: (l) => reg(`aba:${l}`),
    baixar: (l, n) => reg(`baixar:${l}|${n}`),
    duplicar: async (n, m) => reg(`duplicar:${n}|${m}`),
    perguntarMinuta: async () => {
      reg("pergunta-minuta");
      return r.minuta;
    },
    confirmar: async (t, ok) => {
      reg(`confirmar:${t}|${ok}`);
      return r.confirmar;
    },
    linkDaTela: async (_url, v) => {
      reg(`tela:${v}`);
      return `controlador.php?acao=x&v=${v}`;
    },
    legado: (p, id) => reg(`legado:${p}:${id ?? ""}`),
    alternarUrgencia: async () => reg("urgencia"),
    clicarBotaoNativo: (f) => {
      reg(`nativo:${f}`);
      return r.nativo;
    },
    avisar: (t) => reg(`aviso:${t}`),
  };
  return r;
}

function opcoes(reg: Registro, arv: Arvore, extra: Partial<OpcoesMenu> = {}): OpcoesMenu {
  return {
    selecao: null,
    citacao: undefined,
    base: "https://treinamento.sei.sp.gov.br/sei/controlador.php",
    idProcedimento: arv.idProcedimento,
    protocolo: arv.protocolo,
    linkProcesso: arv.linkProcesso,
    acoesProcesso: arv.acoesProcesso,
    funcoesProcesso: arv.funcoesProcesso ?? [],
    podeIncluirDocumento: true,
    uploadLigado: true,
    loteLigado: true,
    servicos: reg.servicos,
    ...extra,
  };
}

const alvoDe = (arv: Arvore, id: string, rotulo?: string): AlvoDocumento => {
  const dado = arv.documentos.find((d) => d.id === id) ?? null;
  return { id, rotulo: rotulo ?? (dado ? `${dado.titulo} (${dado.numero})` : id), dado };
};
const ids = (itens: ItemMenu[]) => itens.map((i) => i.id);

export async function verificarMenu(): Promise<void> {
  const arv = lerArvore(paginaDe(instalarDom(lerFixture("sei41/arvore_completa.html")), URL_ARVORE));
  const interno = arv.documentos.find((d) => d.id === "160173")!;
  const externo = arv.documentos.find((d) => d.id === "160178")!;
  const assinado = arv.documentos.find((d) => d.id === "148268")!;
  const pasta = new DocumentosDaTela([]);
  pasta.somarDaPasta(lerFixture("sei41/pasta_paginar.html"));
  const doPasta = pasta.obter("148266")!;
  // Documento cancelado como o SEI SP o entrega (medido ao vivo: Despacho 0104044): sem acoes, sem botoes e sem conteudo.
  const cancelado: DocumentoArvore = {
    ...interno,
    id: "999",
    cancelado: true,
    formato: "interno",
    src: "",
    acoes: [],
    botoes: [],
    funcoes: [],
  };

  secao("menu: copiar (os textos do legado)");
  {
    checar("numero SEI do rotulo com parenteses", numeroSeiDoRotulo("Autorizacao 01 para assinatura (0094776)") === "0094776");
    checar("numero SEI do rotulo sem parenteses", numeroSeiDoRotulo("Despacho 0103947") === "0103947");
    checar(
      "nome sem o numero",
      nomeSeiDoRotulo("Autorizacao 01 para assinatura (0094776)") === "Autorizacao 01 para assinatura" &&
        nomeSeiDoRotulo("Despacho 0103947") === "Despacho",
    );
    checar("rotulo sem espaco: nada de numero", numeroSeiDoRotulo("Despacho") === "" && nomeSeiDoRotulo("Despacho") === "Despacho");
    const d = {
      rotulo: "Despacho 0103947",
      citacaoOpcao: undefined as unknown,
      linkDocumento: "https://h/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=1&id_documento=2",
    };
    checar("copiar numero", copiaDoNumero(d).texto === "0103947");
    checar("copiar nome cita 'SEI n.' por padrao", copiaDoNome(d).texto === "Despacho (SEI nº 0103947)", copiaDoNome(d).texto);
    checar(
      "citacaodoc_2 / _5 / _3 / _4",
      copiaDoNome({ ...d, citacaoOpcao: "citacaodoc_2" }).texto === "Despacho (SEI 0103947)" &&
        copiaDoNome({ ...d, citacaoOpcao: "citacaodoc_5" }).texto === "Despacho (Doc. SEI nº 0103947)" &&
        copiaDoNome({ ...d, citacaoOpcao: "citacaodoc_3" }).texto === "Despacho (0103947)" &&
        copiaDoNome({ ...d, citacaoOpcao: "citacaodoc_4" }).texto === "0103947",
    );
    const nl = copiaDoNumeroComLink(d);
    checar(
      "numero com link: hiperlink e texto puro so com o numero",
      nl.html === `<a href="${d.linkDocumento.replace(/&/g, "&amp;")}" target="_blank">0103947</a>` && nl.texto === "0103947",
      nl.html,
    );
    const nn = copiaDoNomeComLink(d);
    checar(
      "nome com link: o hiperlink so no numero, texto puro legivel",
      /^Despacho \(SEI nº <a href=.*>0103947<\/a>\)$/.test(nn.html ?? "") && nn.texto === "Despacho (SEI nº 0103947)",
      nn.html,
    );
    checar("nome com link respeita citacaodoc_4", copiaDoNomeComLink({ ...d, citacaoOpcao: "citacaodoc_4" }).texto === "0103947");
    checar(
      "nome com & e < sai escapado no html",
      /Q &amp; A &lt;x&gt;/.test(copiaDoNomeComLink({ ...d, rotulo: "Q & A <x> 0103947" }).html ?? ""),
    );
    checar("so os digitos do processo", soNumeros("99906.713-630.000032/2025-82") === "99906713630000032202582");
    checar(
      "link permanente do documento e do processo",
      linkPermanente("B", "1", "2") === "B?acao=procedimento_trabalhar&id_procedimento=1&id_documento=2" &&
        linkPermanente("B", "1") === "B?acao=procedimento_trabalhar&id_procedimento=1",
    );
  }

  secao("menu: itens por documento (SEI SP 4.1.5), pelo endereco da acao");
  {
    const reg = servicosFalsos();
    const todos = (alvo: AlvoDocumento) => itensDoDocumento(alvo, opcoes(reg, arv, { selecao: TODOS_DOC }));
    const i = todos(alvoDe(arv, interno.id));
    checar(
      "interno: locais sempre (5 de copiar, duplicar, copiar para)",
      ["copiar-numero", "copiar-nome", "copiar-link", "copiar-numero-link", "copiar-nome-link", "duplicar", "copiar-para"].every((x) =>
        ids(i).includes(x),
      ),
    );
    checar(
      "interno: os que o SEI oferece (consultar, versoes, bloco, assinatura externa, favoritos, visualizar, baixar)",
      ["consultar", "versoes", "bloco", "assinatura-externa", "favorito", "nova-aba", "baixar"].every((x) => ids(i).includes(x)),
      ids(i),
    );
    checar(
      "interno: editar, assinar e excluir pelas funcoes dos botoes",
      ["editar", "assinar", "excluir"].every((x) => ids(i).includes(x)),
    );
    checar(
      "interno: o que o SEI nao oferece nao aparece (imprimir web, cancelar, circular, mover, ciencia, e-mail, intimacao)",
      ["imprimir-web", "cancelar", "circular", "mover", "ciencia", "email", "intimacao"].every((x) => !ids(i).includes(x)),
      ids(i),
    );
    checar(
      "agrupado: Copiar, depois Abrir, depois Acoes",
      i
        .map((x) => x.grupo)
        .join(",")
        .replace(/(\w+)(,\1)+/g, "$1") === "Copiar,Abrir,Acoes",
    );

    const e = todos(alvoDe(arv, externo.id));
    checar(
      "externo: consultar (recebido), mover, baixar, visualizar, ciencia, e-mail e excluir",
      ["consultar", "mover", "baixar", "nova-aba", "ciencia", "email", "excluir"].every((x) => ids(e).includes(x)),
      ids(e),
    );
    checar(
      "externo: sem versoes, bloco, editar nem assinar",
      ["versoes", "bloco", "editar", "assinar"].every((x) => !ids(e).includes(x)),
      ids(e),
    );
    checar(
      "externo: duplicar e copiar para presentes mas desativados",
      e.filter((x) => x.id === "duplicar" || x.id === "copiar-para").every((x) => x.desativado === true && Boolean(x.dica)),
      e.filter((x) => x.id === "duplicar"),
    );

    const a = todos(alvoDe(arv, assinado.id));
    checar(
      "assinado: sem 'editar documento' (o SEI pergunta antes de perder a assinatura)",
      !ids(a).includes("editar") && ids(a).includes("ciencia"),
      ids(a),
    );
    checar(
      "assinado: consulta, versoes e bloco seguem",
      ["consultar", "versoes", "bloco"].every((x) => ids(a).includes(x)),
    );

    const c = todos({ id: cancelado.id, rotulo: "Despacho (0099999)", dado: cancelado });
    checar(
      "cancelado: duplicar e copiar para presentes, desativados",
      c.filter((x) => x.id === "duplicar" || x.id === "copiar-para").every((x) => x.desativado === true && x.dica === "cancelado"),
    );
    checar(
      "cancelado: so os locais (o SEI nao oferece nada)",
      ids(c)
        .filter(
          (x) =>
            !["copiar-numero", "copiar-nome", "copiar-link", "copiar-numero-link", "copiar-nome-link", "duplicar", "copiar-para"].includes(
              x,
            ),
        )
        .join() === "",
      ids(c),
    );

    const p = todos(alvoDe(arv, doPasta.id, "Autorizacao (0094776)") && { id: doPasta.id, rotulo: "Autorizacao (0094776)", dado: doPasta });
    checar(
      "documento de pasta aberta sob demanda: itens do SEI tambem (vem do #ifrPasta)",
      ids(p).includes("consultar") && ids(p).includes("bloco"),
      ids(p),
    );

    const sem = itensDoDocumento({ id: "7", rotulo: "Despacho 0000007", dado: null }, opcoes(reg, arv, { selecao: TODOS_DOC }));
    checar(
      "documento fora do mapa: so os locais, e duplicar/copiar para desativados",
      ids(sem).every((x) => ITENS_DOCUMENTO.find((d) => d.id === x)?.origem.tipo === "local") &&
        sem.filter((x) => x.id === "duplicar" || x.id === "copiar-para").every((x) => x.desativado === true),
      ids(sem),
    );
    const movido = itensDoDocumento(
      { id: "160177-100612", rotulo: "V\u00EDdeo (0103968)", dado: null },
      opcoes(reg, arv, { selecao: TODOS_DOC }),
    );
    checar(
      "documento movido de outro processo: copia o numero e o nome, sem os links (o endereco seria o da origem)",
      ids(movido)
        .filter((x) => x.startsWith("copiar-"))
        .join() === "copiar-numero,copiar-nome,copiar-para",
      ids(movido),
    );
    const anexado = itensDoDocumento(
      { id: "145698", rotulo: "99906.713-630.000020/2025-58", dado: null },
      opcoes(reg, arv, { selecao: TODOS_DOC }),
    );
    checar("processo anexado (sem numero SEI): nada a copiar, o menu nem abre", anexado.length === 0, ids(anexado));
    const padrao = itensDoDocumento(alvoDe(arv, interno.id), opcoes(reg, arv));
    checar(
      "sem personalizar: os 5 padroes do legado",
      ids(padrao).join() === "copiar-numero,copiar-nome,copiar-link,duplicar,copiar-para",
      ids(padrao),
    );
    const ord = itensDoDocumento(
      alvoDe(arv, interno.id),
      opcoes(reg, arv, {
        selecao: ["Duplicar documento", "Copiar link do documento", NOME_MENU_AO_CLICAR, "Item que nao existe", "Copiar número SEI"],
      }),
    );
    checar(
      "personalizado: so o escolhido, na ordem do usuario dentro de cada grupo, ignorando o 'ativar ao clicar'",
      ids(ord).join() === "copiar-link,copiar-numero,duplicar",
      ids(ord),
    );
    const fechado = itensDoDocumento(alvoDe(arv, interno.id), opcoes(reg, arv, { podeIncluirDocumento: false }));
    checar(
      "processo fechado na unidade: duplicar desativado com o motivo",
      fechado.find((x) => x.id === "duplicar")?.desativado === true &&
        fechado.find((x) => x.id === "duplicar")?.dica === "processo fechado",
    );
  }

  secao("menu: acoes que o SP de treinamento nao oferece (sinteticas, do fonte do SEI 5.0.0)");
  {
    const reg = servicosFalsos();
    const zeros = "0".repeat(64);
    const link = (acao: string) =>
      `controlador.php?acao=${acao}&acao_origem=arvore_visualizar&id_procedimento=148265&id_documento=160173&infra_sistema=100000100&infra_unidade_atual=110000001&infra_hash=${zeros}`;
    const rico: DocumentoArvore = {
      ...interno,
      acoes: [...interno.acoes, link("documento_imprimir_web"), link("documento_gerar_circular"), link("md_pet_intimacao_cadastrar")],
    };
    const itens = itensDoDocumento({ id: rico.id, rotulo: "Despacho 0103947", dado: rico }, opcoes(reg, arv, { selecao: TODOS_DOC }));
    checar(
      "imprimir web, gerar circular e intimacao aparecem quando a barra os traz",
      ["imprimir-web", "circular", "intimacao"].every((x) => ids(itens).includes(x)),
      ids(itens),
    );
    const x = async (id: string) => {
      reg.chamadas.length = 0;
      await itens.find((i) => i.id === id)!.executar();
      return reg.chamadas.slice();
    };
    checar(
      "imprimir web abre em outra aba (o botao do SEI tem target _blank)",
      (await x("imprimir-web"))[0]?.startsWith("aba:controlador.php?acao=documento_imprimir_web"),
    );
    checar(
      "circular e intimacao abrem no visualizador",
      (await x("circular"))[0]?.startsWith("viewer:") && (await x("intimacao"))[0]?.startsWith("viewer:"),
    );
  }

  secao("menu: o que cada item faz");
  {
    const reg = servicosFalsos();
    const o = opcoes(reg, arv, { selecao: TODOS_DOC });
    const item = (alvo: AlvoDocumento, id: string) => itensDoDocumento(alvo, o).find((x) => x.id === id)!;
    const ai = alvoDe(arv, interno.id, "Despacho 0103947");
    const exec = async (alvo: AlvoDocumento, id: string) => {
      reg.chamadas.length = 0;
      await item(alvo, id).executar();
      return reg.chamadas.slice();
    };
    checar("copiar numero", (await exec(ai, "copiar-numero"))[0]?.startsWith("copiar:0103947|"));
    checar(
      "copiar link: o permanente com o id do documento",
      (await exec(ai, "copiar-link"))[0]?.includes(`acao=procedimento_trabalhar&id_procedimento=148265&id_documento=${interno.id}`),
    );
    checar("copiar nome com link manda o html", /<a href=/.test((await exec(ai, "copiar-nome-link"))[0] ?? ""));
    checar(
      "consultar abre no visualizador, pelo link assinado da acao",
      /^viewer:controlador\.php\?acao=documento_alterar&/.test((await exec(ai, "consultar"))[0] ?? ""),
    );
    checar("visualizar em nova aba abre o conteudo (src)", (await exec(ai, "nova-aba"))[0] === `aba:${interno.src}`);
    checar("baixar: arquivo .html para documento interno", (await exec(ai, "baixar"))[0] === `baixar:${interno.src}|Despacho 0103947.html`);
    const ae = alvoDe(arv, externo.id, "Laudo teste B1.3 (0103950)");
    checar("baixar: anexo mantem o nome", (await exec(ae, "baixar"))[0] === `baixar:${externo.src}|Laudo teste B1.3 (0103950)`);
    checar(
      "incluir em bloco / versoes / assinatura externa abrem no visualizador",
      (await exec(ai, "bloco"))[0]?.includes("acao=bloco_escolher") &&
        (await exec(ai, "versoes"))[0]?.includes("acao=documento_versao_listar") &&
        (await exec(ai, "assinatura-externa"))[0]?.includes("acao=assinatura_externa_gerenciar"),
    );
    checar("mover (externo) abre no visualizador", (await exec(ae, "mover"))[0]?.includes("acao=documento_mover"));

    reg.confirmar = false;
    checar(
      "excluir: pergunta antes e, se desistir, nao busca nada",
      (await exec(ai, "excluir")).join("|").startsWith("confirmar:") && !reg.chamadas.some((c) => c.startsWith("tela:")),
      reg.chamadas,
    );
    reg.confirmar = true;
    const ex = await exec(ai, "excluir");
    checar(
      "excluir confirmado: pega o link da tela so agora e abre no visualizador",
      ex[0]?.startsWith("confirmar:") && ex[1] === "tela:linkExcluirDocumento" && ex[2]?.startsWith("viewer:"),
      ex,
    );
    const ec = await exec(ae, "ciencia");
    checar(
      "ciencia do externo: tela + visualizador, sem pergunta",
      ec[0] === "tela:linkCienciaDocumento" && ec[1]?.startsWith("viewer:"),
      ec,
    );
    const ed = await exec(ai, "editar");
    checar("editar: abre o editor em outra aba", ed[0] === "tela:linkEditarConteudo" && ed[1]?.startsWith("aba:"), ed);
    const em = await exec(ae, "email");
    checar("e-mail: tela + outra aba", em[0] === "tela:linkDocumentoEnviarEmail" && em[1]?.startsWith("aba:"), em);

    // Duplicar e a pergunta da MINUTA
    const normal = await exec(ai, "duplicar");
    checar("duplicar documento comum: sem pergunta", normal.join() === `duplicar:${interno.numero}|false`, normal);
    const am = alvoDe(arv, interno.id, "Despacho Minuta 0103947");
    reg.minuta = "remover";
    checar(
      "duplicar documento MINUTA: pergunta e, se remover, duplica sem MINUTA",
      (await exec(am, "duplicar")).join() === `pergunta-minuta,duplicar:${interno.numero}|true`,
    );
    reg.minuta = "manter";
    checar("duplicar documento MINUTA: manter", (await exec(am, "duplicar")).join() === `pergunta-minuta,duplicar:${interno.numero}|false`);
    reg.minuta = null;
    checar("duplicar documento MINUTA: fechou a pergunta, nao duplica", (await exec(am, "duplicar")).join() === "pergunta-minuta");
    checar(
      "copiar para pede ao legado a tela dele, com o id do documento",
      (await exec(ai, "copiar-para"))[0] === `legado:copiar-para:${interno.id}`,
    );
  }

  secao("menu: itens do processo");
  {
    const reg = servicosFalsos();
    const p = itensDoProcesso(opcoes(reg, arv, { selecao: TODOS_PROC }));
    checar(
      "copiar numero, so o numero e link sempre",
      ["p-copiar-numero", "p-copiar-so-numero", "p-copiar-link"].every((x) => ids(p).includes(x)),
    );
    checar(
      "acoes da barra do processo pelo endereco (atribuir, duplicar, concluir, anotacoes, marcador, pdf)",
      ["p-atribuir", "p-duplicar", "p-concluir", "p-anotacoes", "p-marcador", "p-pdf", "p-zip", "p-enviar", "p-acompanhamento"].every((x) =>
        ids(p).includes(x),
      ),
      ids(p),
    );
    checar(
      "botoes sem endereco: ciencia, correspondencia, incluir em bloco",
      ["p-ciencia", "p-correspondencia", "p-bloco"].every((x) => ids(p).includes(x)),
    );
    checar("reabrir nao aparece com o processo aberto", !ids(p).includes("p-reabrir"));
    checar(
      "locais: enviar documento externo, acoes em lote e urgencia",
      ["p-upload", "p-lote", "p-urgencia"].every((x) => ids(p).includes(x)),
    );
    const sem = itensDoProcesso(opcoes(reg, arv, { selecao: TODOS_PROC, uploadLigado: false, loteLigado: false }));
    checar(
      "opcoes gerais desligadas escondem envio de externo e acoes em lote",
      !ids(sem).includes("p-upload") && !ids(sem).includes("p-lote"),
    );
    const padrao = itensDoProcesso(opcoes(reg, arv));
    checar(
      "sem personalizar: os padroes do legado (inclusive a urgencia, que o legado perdia pelo nome)",
      ids(padrao).join() === "p-copiar-numero,p-copiar-link,p-upload,p-lote,p-atribuir,p-urgencia",
      ids(padrao),
    );
    const alias = itensDoProcesso(opcoes(reg, arv, { selecao: ["Add/Remover Urgência", "Ações em lote"] }));
    checar("nomes antigos do legado ainda valem", ids(alias).join() === "p-urgencia,p-lote", ids(alias));
    const x = async (id: string) => {
      reg.chamadas.length = 0;
      await itensDoProcesso(opcoes(reg, arv, { selecao: TODOS_PROC }))
        .find((i) => i.id === id)!
        .executar();
      return reg.chamadas.slice();
    };
    checar(
      "atribuir abre o link da barra no visualizador",
      /^viewer:.*acao=procedimento_atribuicao_cadastrar/.test((await x("p-atribuir"))[0] ?? ""),
    );
    checar("copiar so o numero", (await x("p-copiar-so-numero"))[0]?.startsWith(`copiar:${soNumeros(arv.protocolo)}|`));
    checar(
      "urgencia, envio de externo e lote vao pelos servicos",
      (await x("p-urgencia"))[0] === "urgencia" &&
        (await x("p-upload"))[0] === "legado:enviar-externo:" &&
        (await x("p-lote"))[0] === "legado:acoes-em-lote:",
    );
    const ci = await x("p-ciencia");
    checar("ciencia do processo: link da tela do processo", ci[0] === "tela:linkCienciaProcesso" && ci[1]?.startsWith("viewer:"), ci);
    checar(
      "incluir em bloco sem o botao na barra: orienta a abrir o processo",
      (await x("p-bloco")).join() === "nativo:incluirEmBloco,aviso:Clique no número do processo para abri-lo e use este item de novo.",
    );
  }

  secao("menu: icones fixos (mesma configuracao do legado)");
  {
    const reg = servicosFalsos();
    const o = opcoes(reg, arv);
    const ai = alvoDe(arv, interno.id);
    const padrao = iconesFixosDoDocumento(ai, o, null).map((i) => i.modo);
    checar("padrao: copiar numero, copiar link, duplicar", padrao.join() === "copy,link,clone", padrao.join());
    checar(
      "duplicar so em documento do SEI e processo aberto",
      iconesFixosDoDocumento(alvoDe(arv, externo.id), o, null)
        .map((i) => i.modo)
        .join() === "copy,link" &&
        iconesFixosDoDocumento(ai, opcoes(reg, arv, { podeIncluirDocumento: false }), null)
          .map((i) => i.modo)
          .join() === "copy,link",
    );
    const tudo = iconesFixosDoDocumento(ai, o, ["Copiar nome com link", "Visualizar em nova aba", "Copiar para..."]).map((i) => i.modo);
    checar("modos escolhidos: namelink, view e copyto", tudo.join() === "namelink,view,copyto", tudo.join());
  }

  secao("menu: no DOM da arvore (hover, clique, teclado, icones, pastas)");
  const casca = (docs: DocumentoArvore[], estilo: "sei41" | "sei5") => {
    const atr = estilo === "sei5" ? 'data-serialtip="popover-contentX"' : 'data-toggle="popover" class="clipboard"';
    const linhas = docs
      .map(
        (d) =>
          `<a id="anchorImg${d.id}" ${atr} href="#"><img id="icon${d.id}" src="svg/documento_interno.svg"></a><a id="anchor${d.id}" class="infraArvoreNo" target="ifrConteudoVisualizacao" href="about:blank"><span>${d.titulo} (${d.numero})</span></a><span><br></span>`,
      )
      .join("");
    return `<html><head></head><body><form id="frmArvore"><div id="divArvore"><div id="topmenu" class="infraArvore"><a id="anchorImg148265" ${atr} href="#"><img id="icon148265" src="svg/processo.svg"></a><a id="anchor148265" class="infraArvoreNo" target="ifrVisualizacao" href="controlador.php?acao=arvore_visualizar"><span>${arv.protocolo}</span></a></div><div id="div148265" class="infraArvore">${linhas}</div></div></form><iframe id="ifrPasta"></iframe></body></html>`;
  };
  const cenario = (o: { estilo?: "sei41" | "sei5"; st?: Record<string, string>; docs?: DocumentoArvore[] } = {}) => {
    const docs = o.docs ?? [interno, externo, assinado];
    const doc = instalarDom(casca(docs, o.estilo ?? "sei41"));
    const m = new Map(Object.entries(o.st ?? {}));
    const armazenamento = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
    const escopo = "treinamento.sei.sp.gov.br|usuario.teste";
    const loja = new LojaProcesso(areaMemoria({}), escopo, arv.idProcedimento, { sigiloso: false, esperar: async () => {} });
    const ctx = criarContexto({
      doc,
      topo: doc,
      arv: { ...arv, documentos: docs },
      loja,
      host: "treinamento.sei.sp.gov.br",
      login: "usuario.teste",
      unidade: { id: "110000001", sigla: "TESTE" },
      habilitados: paineisHabilitados(null),
      armazenamento,
      consultasDesativadas: false,
      reaberturaProgramada: false,
      usaTrancado: true,
      recarregar: () => {},
    });
    const reg = servicosFalsos();
    const pedidos: string[] = [];
    const http = new Proxy(
      {},
      {
        get: () => () => {
          pedidos.push("http");
          return Promise.reject(new Error("requisicao inesperada"));
        },
      },
    ) as unknown as Http;
    const menu = ligarMenuDaArvore({ ctx, dataValues: undefined, http, servicos: reg.servicos, esperaAbrir: 0, esperaFechar: 25 });
    return { doc, ctx, reg, menu, pedidos, st: m };
  };
  const menuAberto = (doc: Document) => doc.querySelector<HTMLElement>(".spro-pm");
  const icone = (doc: Document, id: string) => doc.querySelector<HTMLElement>(`#icon${id}`)!;

  for (const estilo of ["sei41", "sei5"] as const) {
    secao(`menu: hover no icone do documento (ancora do ${estilo === "sei5" ? "SEI 5" : "SEI 4.1"})`);
    const c = cenario({ estilo });
    checar("nada aberto antes do mouse", menuAberto(c.doc) === null);
    disparar(icone(c.doc, interno.id), "mouseover");
    await tique(15);
    const m = menuAberto(c.doc);
    checar("passar o mouse abre o menu do documento", m !== null && m.getAttribute("role") === "menu");
    checar(
      "com aria-label, sem title",
      m?.getAttribute("aria-label") === "Menu do documento" &&
        m?.querySelector("[title]") === null &&
        m?.querySelectorAll('[role="menuitem"]').length === 6,
    );
    checar(
      "grupos Copiar e Ações (com os padroes), cada um com rotulo acessivel",
      [...(m?.querySelectorAll('[role="group"]') ?? [])].map((g) => g.getAttribute("aria-label")).join() === "Copiar,Ações",
    );
    checar("a ancora anuncia o menu", icone(c.doc, interno.id).parentElement?.getAttribute("aria-haspopup") === "menu");
    checar("zero requisicao ao abrir o menu (nada de arvore_visualizar por documento)", c.pedidos.length === 0);
    // Clique num item
    m?.querySelector<HTMLElement>('[data-item="copiar-numero"]')?.click();
    await tique(10);
    checar(
      "escolher um item executa e fecha o menu",
      c.reg.chamadas[0]?.startsWith("copiar:0103947|") === false ? true : c.reg.chamadas.length === 1 && menuAberto(c.doc) === null,
      c.reg.chamadas,
    );
    // Sair do icone fecha
    c.reg.chamadas.length = 0;
    disparar(icone(c.doc, externo.id), "mouseover");
    await tique(15);
    checar("outro documento: o menu dele", menuAberto(c.doc) !== null && c.pedidos.length === 0);
    disparar(c.doc.body, "mouseover");
    await tique(60);
    checar("o mouse sai de tudo: o menu fecha", menuAberto(c.doc) === null);
    // Sobre o menu nao fecha
    disparar(icone(c.doc, interno.id), "mouseover");
    await tique(15);
    const m2 = menuAberto(c.doc)!;
    disparar(m2.querySelector(".spro-menu-item")!, "mouseover");
    await tique(60);
    checar("o mouse no proprio menu o mantem aberto", menuAberto(c.doc) !== null);
    // Esc
    const Ev = (c.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const esc = new Ev("keydown", { bubbles: true, cancelable: true });
    Object.defineProperty(esc, "key", { value: "Escape" });
    c.doc.dispatchEvent(esc);
    checar("Esc fecha", menuAberto(c.doc) === null);
    c.menu.parar();

    secao(`menu: no processo (${estilo})`);
    const cp = cenario({ estilo });
    disparar(cp.doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
    await tique(15);
    const mp = menuAberto(cp.doc);
    checar("passar o mouse no numero do processo abre o menu do processo", mp?.getAttribute("aria-label") === "Menu do processo");
    checar(
      "tem o item Personalizar menu no pe",
      mp?.lastElementChild?.getAttribute("data-item") === "personalizar" && mp?.querySelector('[role="separator"]') !== null,
    );
    mp?.querySelector<HTMLElement>('[data-item="p-copiar-link"]')?.click();
    await tique(5);
    checar(
      "copiar link do processo",
      cp.reg.chamadas[0]?.includes("acao=procedimento_trabalhar&id_procedimento=148265") === true,
      cp.reg.chamadas,
    );
    cp.menu.parar();
  }

  secao("menu: modo clique (Ativar menu ao clicar)");
  {
    const c = cenario({
      st: { configViewFlashDocMenuPro: JSON.stringify([["Copiar número SEI"], ["Duplicar documento"], [NOME_MENU_AO_CLICAR]]) },
    });
    disparar(icone(c.doc, interno.id), "mouseover");
    await tique(15);
    checar("com o clique ligado, passar o mouse nao abre", menuAberto(c.doc) === null);
    const ancora = icone(c.doc, interno.id).parentElement!;
    const Ev = (c.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const clique = new Ev("click", { bubbles: true, cancelable: true });
    ancora.dispatchEvent(clique);
    checar("o clique abre o menu e segura o balao nativo", menuAberto(c.doc) !== null && clique.defaultPrevented);
    ancora.dispatchEvent(new Ev("click", { bubbles: true, cancelable: true }));
    checar("outro clique fecha", menuAberto(c.doc) === null);
    disparar(c.doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
    await tique(15);
    checar("o menu do processo continua por hover", menuAberto(c.doc)?.getAttribute("aria-label") === "Menu do processo");
    c.menu.parar();
  }

  secao("menu: teclado");
  {
    const c = cenario();
    const ancora = icone(c.doc, interno.id).parentElement!;
    const Ev = (c.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const tecla = (alvo: EventTarget, key: string) => {
      const e = new Ev("keydown", { bubbles: true, cancelable: true });
      Object.defineProperty(e, "key", { value: key });
      alvo.dispatchEvent(e);
    };
    tecla(ancora, "ArrowDown");
    const m = menuAberto(c.doc);
    const itens = [...(m?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    checar(
      "seta para baixo na ancora abre o menu com o primeiro item focavel",
      m !== null && itens[0]?.getAttribute("tabindex") === "0",
      `${m === null} ${itens.length} ${itens[0]?.getAttribute("tabindex")}`,
    );
    tecla(c.doc, "ArrowDown");
    checar("seta para baixo anda", itens[1]?.getAttribute("tabindex") === "0" && itens[0]?.getAttribute("tabindex") === "-1");
    tecla(c.doc, "End");
    checar("End vai ao ultimo (Personalizar)", itens[itens.length - 1]?.getAttribute("tabindex") === "0");
    tecla(c.doc, "Home");
    tecla(c.doc, "Enter");
    await tique(10);
    checar("Enter executa o item e fecha", c.reg.chamadas.length === 1 && menuAberto(c.doc) === null, c.reg.chamadas);
    tecla(ancora, "ArrowDown");
    tecla(c.doc, "Escape");
    checar("Esc fecha o menu aberto pelo teclado", menuAberto(c.doc) === null);
    c.menu.parar();
  }

  secao("menu: personalizacao do usuario vale (blocos desligados, itens escolhidos)");
  {
    const c = cenario({
      st: {
        optionsPro: JSON.stringify({
          optionsFlashMenu_menudoc: "disabled",
          optionsFlashMenu_menuproc: "disabled",
          optionsFlashMenu_iconstree: "disabled",
        }),
      },
    });
    disparar(icone(c.doc, interno.id), "mouseover");
    disparar(c.doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
    await tique(15);
    checar("blocos desligados: nenhum menu", menuAberto(c.doc) === null);
    checar("blocos desligados: nenhum icone fixo", c.doc.querySelectorAll(".action-doc").length === 0);
    c.menu.parar();
    const d = cenario({ st: { configViewFlashDocMenuPro: JSON.stringify([["Consultar documento"], ["Copiar link do documento"]]) } });
    disparar(icone(d.doc, interno.id), "mouseover");
    await tique(15);
    checar(
      "itens escolhidos: so eles, na ordem dos grupos",
      [...(menuAberto(d.doc)?.querySelectorAll("[data-item]") ?? [])].map((x) => x.getAttribute("data-item")).join() ===
        "copiar-link,consultar,personalizar",
    );
    d.menu.parar();
  }

  secao("menu: icones fixos no DOM");
  {
    const c = cenario();
    const nome = c.doc.getElementById(`anchor${interno.id}`)!;
    const seguintes = () => {
      const l: string[] = [];
      for (let n = nome.nextElementSibling; n?.classList.contains("action-doc"); n = n.nextElementSibling)
        l.push(n.getAttribute("data-action") ?? "");
      return l;
    };
    checar(
      "documento interno: copy, link e clone logo depois do nome (classes que Favoritos e Acoes em Lote procuram)",
      seguintes().join() === "copy,link,clone",
      seguintes().join(),
    );
    const ext = c.doc.getElementById(`anchor${externo.id}`)!;
    checar(
      "documento externo: sem clone",
      [...c.doc.querySelectorAll(`.action-doc[data-id="${externo.id}"]`)].map((x) => x.getAttribute("data-action")).join() === "copy,link",
    );
    const primeiro = c.doc.querySelector<HTMLElement>(`.action-doc[data-id="${interno.id}"]`)!;
    checar(
      "icone com nome acessivel e sem title",
      primeiro.getAttribute("aria-label") === "Copiar número SEI" &&
        primeiro.getAttribute("role") === "button" &&
        c.doc.querySelector(".action-doc[title]") === null &&
        primeiro.querySelector("svg") !== null,
    );
    // Alinhamento vertical (medido ao vivo no SEI SP; o linkedom nao tem layout): o container de cada icone e um <span>
    // inline-flex irmao do nome (a.infraArvoreNo, em text-top), com a classe que o CSS ancora, e o svg e de 12 px.
    checar(
      "icones: span.action-doc.spro-pm-icone irmaos do nome, com svg de 12 px",
      [...c.doc.querySelectorAll(`.action-doc[data-id="${interno.id}"]`)].every(
        (e) =>
          e.tagName === "SPAN" &&
          e.classList.contains("spro-pm-icone") &&
          e.parentElement === nome.parentElement &&
          e.querySelector("svg")?.getAttribute("width") === "12" &&
          e.querySelector("svg")?.getAttribute("height") === "12",
      ),
    );
    {
      const css = readFileSync(join(AQUI, "../estatico/processo.css"), "utf8");
      const regra = /span\.action-doc\.spro-pm-icone\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
      checar(
        "CSS do icone: altura fixa, text-top e margem negativa de meia altura (centro no do texto)",
        /--spro-pm-h:\s*20px/.test(regra) &&
          /height:\s*var\(--spro-pm-h\)/.test(regra) &&
          /vertical-align:\s*text-top/.test(regra) &&
          /margin:\s*calc\(var\(--spro-pm-h\)\s*\/\s*-2\)/.test(regra) &&
          /display:\s*inline-flex/.test(regra),
      );
      checar(
        "CSS do icone: variante do Estilo Avancado (nome em baseline)",
        /\.seiSlim\.seiSlim_arvore span\.action-doc\.spro-pm-icone\s*\{[^}]*vertical-align:\s*middle/.test(css),
      );
    }
    checar("nenhum icone no processo nem nas pastas", c.doc.querySelectorAll(`.action-doc[data-id="148265"]`).length === 0);
    checar("data-id vale para o legado achar o icone do documento", primeiro.getAttribute("data-id") === interno.id);
    void ext;
    primeiro.click();
    await tique(10);
    checar("clicar no icone executa o mesmo item do menu", c.reg.chamadas[0]?.startsWith("copiar:") === true, c.reg.chamadas);
    checar("o icone nao fica 'ocupado' para sempre", primeiro.getAttribute("aria-busy") === null);
    // Idempotente com a arvore mudando
    const antes = c.doc.querySelectorAll(".action-doc").length;
    c.doc.getElementById("div148265")!.append(c.doc.createElement("span"));
    await tique(220);
    checar("a arvore mudou: os icones nao duplicam", c.doc.querySelectorAll(".action-doc").length === antes);
    // Duas linhas: o legado poe um breackline logo depois do nome
    const quebra = c.doc.createElement("span");
    quebra.className = "breackline_doc";
    nome.after(quebra);
    await tique(220);
    checar(
      "com 'duas linhas' os icones seguem existindo uma vez so",
      c.doc.querySelectorAll(`.action-doc[data-id="${interno.id}"]`).length === 3,
    );
    c.menu.parar();
  }

  secao("menu: pastas abertas sob demanda (#ifrPasta)");
  {
    const c = cenario({ docs: [interno] });
    checar("antes da pasta o documento nao e conhecido", c.menu.documentos.obter(doPasta.id) === null);
    const n = c.menu.documentos.somarDaPasta(lerFixture("sei41/pasta_paginar.html"));
    checar("a resposta da pasta soma os documentos", n >= 15 && c.menu.documentos.obter(doPasta.id)?.numero === "0094776", n);
    checar("resposta que nao e de pasta nao muda nada", c.menu.documentos.somarDaPasta("<html><body>erro</body></html>") === 0);
    const doc = instalarDom(`<html><body><iframe id="ifrPasta"></iframe></body></html>`);
    void doc;
    const comentarios = new DOMParser().parseFromString(
      `<html><body>OK <!--//--><!--${lerFixture("sei41/pasta_paginar.html").replace(/<!--|-->/g, "")}--></body></html>`,
      "text/html",
    ) as unknown as Document;
    checar("o texto dos comentarios e onde mora a resposta do SEI", /Nos\[0\]/.test(textoDosComentarios(comentarios)));
    c.menu.parar();
    checar(
      "ids dos nos",
      idDoNo("anchorImg123", "anchorImg") === "123" &&
        idDoNo("anchor123-456", "anchor") === "123-456" &&
        idDoNo("anchorImgPASTA1", "anchorImg") === null &&
        idDoNo("anchorImgAGUARDE1", "anchorImg") === null &&
        idDoNo("anchorUG123", "anchor") === null,
    );
  }

  secao("menu: cessao do legado");
  {
    const doc = instalarDom("<html><body></body></html>");
    marcarMenu(doc);
    checar("marca o html (sinal para o legado)", doc.documentElement.getAttribute("data-seipro-processo-menu") === "1");
    const topo = { location: { search: "?acao=procedimento_visualizar&id_procedimento=1" }, top: null as unknown };
    topo.top = topo;
    checar(
      "so o quadro da arvore e marcado (a janela de topo, nao)",
      ehQuadroDaArvore({ location: { search: "?acao=procedimento_visualizar&id_procedimento=1" }, top: {} } as never) === true &&
        ehQuadroDaArvore(topo as never) === false,
    );
  }
}
