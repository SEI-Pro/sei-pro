/**
 * Personalizar menu rápido (personalizar/): o catálogo igual ao do legado (extraído dele para uma fixture), a leitura e a gravação
 * nos MESMOS formatos do legado (ida e volta com o perfil de quem personalizou no modal antigo), aliases, migração da chave solta,
 * restaurar padrão, busca, reordenação, a tela (abas, interruptores, chave geral, teclado, tema), a aplicação ao vivo (o menu, os
 * ícones fixos e os painéis reagem sem recarregar) e a guarda do legado (`configFlashMenuPro` cede à tela nova).
 * O linkedom não tem foco real, layout nem arrastar de verdade: isso se prova ao vivo.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { areaMemoria } from "@comum/armazenamento/area";
import { lerArvore } from "@nucleo/dominio/arvore";
import { definirAnalisador } from "@nucleo/sessao/dom";
import type { Http } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { ATRIBUTO_PERSONALIZAR_ACK, EVENTO_ABRIR_PERSONALIZAR } from "../src/modelo/constantes";
import { LojaProcesso } from "../src/modelo/loja";
import { paineisHabilitados } from "../src/modelo/paineis";
import type { NomeFatia } from "../src/modelo/tipos";
import { criarContexto } from "../src/pagina/contexto";
import {
  defPorNome,
  ITENS_DOCUMENTO,
  ITENS_PROCESSO,
  NOME_MENU_AO_CLICAR,
  PADRAO_ICONES_ARVORE,
  PADRAO_MENU_DOCUMENTO,
  PADRAO_MENU_PROCESSO,
} from "../src/pagina/menuDoc/catalogo";
import { ligarMenuDaArvore } from "../src/pagina/menuDoc/ligar";
import { blocoDoMenuLigado, gravarOpcao, lerListaDoMenu, lerSelecao, painelLigado, valorDaOpcao } from "../src/pagina/opcoes";
import { ligarPaineisVivos } from "../src/pagina/paineisVivos";
import { ABAS, aba, ITEM_MENU_AO_CLICAR } from "../src/pagina/personalizar/catalogo";
import { avisosDasOpcoes, criarAbertura, ligarPersonalizar } from "../src/pagina/personalizar/ligar";
import { abrirPersonalizar, type PersonalizarAberto } from "../src/pagina/personalizar/modal";
import {
  casaComBusca,
  contar,
  gravarGeral,
  gravarLista,
  lerAba,
  mover,
  moverPara,
  nomesParaGravar,
  podeMover,
  restaurarPadrao,
  semAcento,
  semNenhum,
} from "../src/pagina/personalizar/modelo";
import { aoMudarPersonalizacao, avisarPersonalizacao, observarPersonalizacao } from "../src/pagina/personalizar/mudancas";
import { formasDoGlifo } from "../src/ui/glifosMenu";
import { fingirDialogos } from "./dialogo";
import { checar, disparar, instalarDom, secao, tique } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const lerArquivo = (rel: string) => readFileSync(join(AQUI, rel), "utf8");
const json = (rel: string) => JSON.parse(lerArquivo(rel)) as Record<string, unknown>;
const URL_ARVORE = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=148265";

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

interface Legado {
  iconsFlashMenu: Array<{ name: string; icon: string; alt: string }>;
  iconsFlashDocMenu: Array<{ name: string; icon: string; alt: string }>;
  iconsFlashDocArvore: Array<{ name: string; icon: string; alt: string }>;
  iconsFlashPanelArvore: Array<{ name: string; icon: string; alt: string }>;
}

/** Memória que age como o localStorage (com remoção) e conta as gravações. */
function memoria(inicial: Record<string, string> = {}) {
  const m = new Map(Object.entries(inicial));
  return {
    m,
    getItem: (k: string): string | null => m.get(k) ?? null,
    setItem: (k: string, v: string): void => void m.set(k, String(v)),
    removeItem: (k: string): void => void m.delete(k),
  };
}

/** O que o legado grava ao mexer na tabela (`changeFlashMenuPro`): os marcados, na ordem das linhas, cada um `[nome]`. */
const gravacaoDoLegado = (linhas: Array<{ nome: string; marcado: boolean }>): string =>
  JSON.stringify(linhas.filter((l) => l.marcado).map((l) => [l.nome]));

/** Tecla do linkedom (o KeyboardEvent do Node não serve aos elementos dele). */
function tecla(el: Element, key: string, extra: { altKey?: boolean } = {}): boolean {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev("keydown", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "key", { value: key });
  Object.defineProperty(ev, "altKey", { value: Boolean(extra.altKey) });
  return el.dispatchEvent(ev);
}

const nomesDasLinhas = (raiz: ParentNode, id: string): string[] =>
  [...raiz.querySelectorAll(`#spro-pp-painel-${id} li.spro-pp-linha`)].map((l) => l.getAttribute("data-nome") ?? "");

export async function verificarPersonalizar(): Promise<void> {
  const legado = json("fixtures/personalizar-legado.json") as unknown as Legado;
  const perfil = (json("fixtures/personalizar-perfil-legado.json") as { localStorage: Record<string, string> }).localStorage;

  secao("personalizar: catalogo igual ao do legado (mesmos nomes, mesma ordem)");
  {
    const por = (id: string) => aba(id as never).itens.map((i) => i.nome);
    checar(
      "Processo: os 29 itens do iconsFlashMenu, na ordem",
      por("processo").join("|") === legado.iconsFlashMenu.map((i) => i.name).join("|"),
    );
    checar(
      "Documentos: os 24 itens do iconsFlashDocMenu, na ordem",
      por("documentos").join("|") === legado.iconsFlashDocMenu.map((i) => i.name).join("|"),
    );
    checar(
      "Arvore: os 8 itens do iconsFlashDocArvore, na ordem",
      por("arvore").join("|") === legado.iconsFlashDocArvore.map((i) => i.name).join("|"),
    );
    checar(
      "Painel: os 10 itens do iconsFlashPanelArvore, na ordem",
      por("painel").join("|") === legado.iconsFlashPanelArvore.map((i) => i.name).join("|"),
    );
    checar(
      "quatro abas, na ordem Processo, Documentos, Arvore, Painel",
      ABAS.map((a) => a.rotulo).join() === "Processo,Documentos,Árvore,Painel",
    );
    checar(
      "cada aba grava na chave do legado e usa a chave geral do legado",
      ABAS.map((a) => `${a.chave}:${a.bloco}`).join() ===
        "configViewFlashMenuPro:menuproc,configViewFlashDocMenuPro:menudoc,configViewFlashDocArvorePro:iconstree,configViewFlashPanelArvorePro:panelinfo",
    );
    // O legado como está HOJE no arquivo (se alguém mexer lá, esta fixture precisa ser refeita: tests/fixtures/extrair-personalizar.mjs).
    const fonte = lerArquivo("../../dist/js/sei-functions-pro.js");
    const bloco = (nome: string): Array<{ name: string }> => {
      const i = fonte.indexOf(`var ${nome} = [`);
      return vm.runInNewContext(fonte.slice(i + `var ${nome} = `.length, fonte.indexOf("];", i) + 1)) as Array<{ name: string }>;
    };
    checar(
      "a fixture continua igual ao legado do dist/js/sei-functions-pro.js",
      JSON.stringify(legado.iconsFlashMenu.map((i) => i.name)) === JSON.stringify(bloco("iconsFlashMenu").map((i) => i.name)) &&
        JSON.stringify(legado.iconsFlashDocMenu.map((i) => i.name)) === JSON.stringify(bloco("iconsFlashDocMenu").map((i) => i.name)) &&
        JSON.stringify(legado.iconsFlashDocArvore.map((i) => i.name)) === JSON.stringify(bloco("iconsFlashDocArvore").map((i) => i.name)) &&
        JSON.stringify(legado.iconsFlashPanelArvore.map((i) => i.name)) ===
          JSON.stringify(bloco("iconsFlashPanelArvore").map((i) => i.name)),
    );
    // Os títulos e rótulos do legado, como estão escritos (com \uXXXX) no arquivo.
    const esc = (t: string) => t.replace(/[^\x20-\x7e]/g, (c) => `\\u${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`);
    checar(
      "titulos e rotulos das abas iguais aos do legado",
      [
        "Menu rápido do processo",
        "Menu rápido dos documentos",
        "Ícones rápidos na árvore",
        "Painel de Informações na árvore",
        "Personalizar Menu Rápido",
      ].every((t) => fonte.includes(esc(t))) &&
        ABAS.every((a) => fonte.includes(`</i> ${esc(a.rotulo)}</a>`)) &&
        ABAS.every(
          (a) =>
            a.id === "painel" ||
            a.id === "arvore" ||
            fonte.includes(esc(a.titulo)) ||
            fonte.includes(esc(a.titulo).replace("rápido", "r\\u00E1pido")),
        ),
    );
    checar(
      "'Ativar menu ao clicar' do legado e o mesmo nome",
      ITEM_MENU_AO_CLICAR.nome === "Ativar menu ao clicar" && fonte.includes('name: "Ativar menu ao clicar"'),
    );
    checar(
      "todo item tem glifo desenhado",
      [...ABAS.flatMap((a) => a.itens), ITEM_MENU_AO_CLICAR].every(
        (i) => formasDoGlifo(i.glifo).length > 0 && formasDoGlifo(i.glifo).every((f) => /^M/.test(f)),
      ),
    );
    checar(
      "todo item das abas de menu existe no catalogo do menu (o menu sabe desenhar)",
      aba("processo").itens.every((i) => defPorNome(ITENS_PROCESSO, i.nome)) &&
        aba("documentos").itens.every((i) => defPorNome(ITENS_DOCUMENTO, i.nome)) &&
        aba("arvore").itens.every((i) => defPorNome(ITENS_DOCUMENTO, i.nome)?.modo),
    );
    checar(
      "os padroes sao os que o menu usa de fato",
      aba("processo").padrao === PADRAO_MENU_PROCESSO &&
        aba("documentos").padrao === PADRAO_MENU_DOCUMENTO &&
        aba("arvore").padrao === PADRAO_ICONES_ARVORE &&
        aba("painel").padrao.length === 9 &&
        ABAS.every((a) => a.padrao.every((n) => a.itens.some((i) => i.nome === n))),
    );
    checar(
      "so as abas de menu e icones podem reordenar (os paineis tem ordem fixa)",
      ABAS.map((a) => a.ordenavel).join() === "true,true,true,false",
    );
  }

  secao("personalizar: ler a personalizacao do legado (perfil de quem personalizou no modal antigo)");
  {
    const a = memoria(perfil);
    const p = lerAba(a, aba("processo"));
    checar(
      "Processo: os ligados primeiro, na ordem gravada, com os nomes antigos reconhecidos; os demais na ordem do catalogo",
      p.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === "Copiar link do processo|Incluir Documento|Adicionar ou Remover Urgência|Ações em Lote|Atribuir Processo" &&
        p.linhas.slice(5).every((l) => !l.ativo) &&
        p.linhas.length === 29 &&
        p.linhas[5]?.nome === "Copiar número do processo",
      p.linhas.slice(0, 7),
    );
    checar("Processo: a chave solta antiga (optionsFlashMenu_menuproc) desliga a chave geral", p.geral === false);
    checar("Processo: o 'Ações em lote' antigo nao duplica", p.linhas.filter((l) => l.nome.toLowerCase() === "ações em lote").length === 1);
    const d = lerAba(a, aba("documentos"));
    checar(
      "Documentos: 'Ativar menu ao clicar' vem da lista e nao vira item",
      d.aoClicar === true && !d.linhas.some((l) => l.nome === NOME_MENU_AO_CLICAR),
    );
    checar(
      "Documentos: so os itens que o SEI Pro conhece ficam (o que sumiu do catalogo cai)",
      d.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === "Baixar documento|Copiar número SEI|Ciência" && d.linhas.length === 24,
      d.linhas.filter((l) => l.ativo),
    );
    checar("Documentos: a chave geral ligada", d.geral === true);
    const t = lerAba(a, aba("arvore"));
    checar(
      "Arvore: ordem gravada e chave geral desligada (optionsPro)",
      t.linhas[0]?.nome === "Visualizar em nova aba" && t.linhas[1]?.nome === "Copiar número SEI" && t.geral === false,
    );
    const pn = lerAba(a, aba("painel"));
    checar(
      "Painel: os tres escolhidos (inclusive o Bloco Interno)",
      pn.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === "Anotações|Marcador|Bloco Interno" && pn.geral === true,
    );
    checar(
      "quem le a personalizacao no menu enxerga o mesmo que a tela (mesma chave, mesmo formato)",
      lerListaDoMenu(a, "configViewFlashDocMenuPro")?.includes(NOME_MENU_AO_CLICAR) === true &&
        lerSelecao(a)?.join("|") === "Anotações|Marcador|Bloco Interno" &&
        blocoDoMenuLigado(a, "menuproc") === false &&
        blocoDoMenuLigado(a, "iconstree") === false &&
        blocoDoMenuLigado(a, "menudoc") === true &&
        painelLigado(a) === true,
    );
    const novo = memoria();
    const n = lerAba(novo, aba("processo"));
    checar(
      "sem personalizar: vale o padrao do menu, ligado",
      n.geral === true &&
        n.linhas
          .filter((l) => l.ativo)
          .map((l) => l.nome)
          .join("|") === PADRAO_MENU_PROCESSO.join("|"),
    );
    const vazio = memoria({ configViewFlashMenuPro: "[]" });
    checar(
      "lista vazia (o que o legado grava ao desmarcar tudo) vale como nao personalizada",
      lerAba(vazio, aba("processo"))
        .linhas.filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === PADRAO_MENU_PROCESSO.join("|"),
    );
    const lixo = memoria({ configViewFlashMenuPro: "isto nao e json", optionsPro: "{quebrado" });
    checar(
      "armazenamento corrompido: padrao, sem erro",
      lerAba(lixo, aba("processo")).linhas.filter((l) => l.ativo).length === PADRAO_MENU_PROCESSO.length,
    );
    const formatoPlano = memoria({ configViewFlashDocArvorePro: JSON.stringify(["Copiar link do documento", "Duplicar documento"]) });
    checar(
      "lista de nomes soltos (sem o colchete interno) tambem e lida",
      lerAba(formatoPlano, aba("arvore"))
        .linhas.filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === "Copiar link do documento|Duplicar documento",
    );
  }

  secao("personalizar: ida e volta com o que o MODAL LEGADO gravou de verdade (captura ao vivo, SEI SP 4.1.5)");
  {
    const real = (json("fixtures/personalizar-capturado-legado.json") as { localStorage: Record<string, string> }).localStorage;
    const a = memoria(real);
    const ativos = (id: string) =>
      lerAba(a, aba(id as never))
        .linhas.filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|");
    checar(
      "Processo: a ordem que o legado gravou (Enviar Processo foi levado ao topo)",
      ativos("processo") ===
        "Enviar Processo|Consultar/Alterar Processo|Enviar Documento Externo|Atribuir Processo|Copiar link do processo",
      ativos("processo"),
    );
    checar(
      "Documentos: itens na ordem gravada, com o clique ligado",
      ativos("documentos") === "Copiar número SEI|Copiar nome do documento|Copiar link do documento|Imprimir Web|Baixar documento" &&
        lerAba(a, aba("documentos")).aoClicar === true,
      ativos("documentos"),
    );
    checar(
      "Arvore: itens gravados e a chave geral desligada no optionsPro",
      ativos("arvore") === "Copiar número SEI|Copiar link do documento|Visualizar em nova aba" && lerAba(a, aba("arvore")).geral === false,
    );
    checar(
      "Painel: os 9 gravados (Bloco Interno entra, Observacoes sai)",
      ativos("painel") ===
        "Anotações|Marcador|Acompanhamento Especial|Tipo de Procedimento|Assuntos|Interessados|Atribuição|Nível de Acesso|Bloco Interno",
    );
    // Gravar o mesmo estado de volta tem de dar EXATAMENTE os mesmos bytes: quem alterna entre a tela nova e a antiga nao ve diferenca.
    for (const def of ABAS) {
      const antes = real[def.chave];
      const e = lerAba(a, def);
      gravarLista(a, def, e);
      checar(`${def.rotulo}: regravar o estado lido produz os mesmos bytes do legado`, a.m.get(def.chave) === antes, a.m.get(def.chave));
    }
    checar(
      "a chave geral regravada fica igual (optionsPro so com as chaves do legado)",
      ((): boolean => {
        gravarGeral(a, aba("arvore"), false);
        return a.m.get("optionsPro") === real.optionsPro;
      })(),
      a.m.get("optionsPro"),
    );
  }

  secao("personalizar: gravar no formato do legado (ida e volta)");
  {
    const a = memoria(perfil);
    const def = aba("processo");
    const e = lerAba(a, def);
    // Liga 'Duplicar Processo' e desliga 'Incluir Documento', como a tabela do legado faria.
    const linhas = e.linhas.map((l) =>
      l.nome === "Duplicar Processo" ? { ...l, ativo: true } : l.nome === "Incluir Documento" ? { ...l, ativo: false } : l,
    );
    gravarLista(a, def, { linhas, aoClicar: false });
    const esperado = gravacaoDoLegado(linhas.map((l) => ({ nome: l.nome, marcado: l.ativo })));
    checar(
      "o que a tela grava e byte a byte o que o legado gravaria para as mesmas linhas",
      a.m.get("configViewFlashMenuPro") === esperado,
      a.m.get("configViewFlashMenuPro"),
    );
    checar(
      "o formato e [[nome],...] (cada nome num colchete)",
      /^\[\["[^"]+"\](,\["[^"]+"\])*\]$/.test(a.m.get("configViewFlashMenuPro") ?? ""),
    );
    checar(
      "gravar usa os nomes novos (Adicionar ou Remover Urgencia, Acoes em Lote), nao os antigos",
      (a.m.get("configViewFlashMenuPro") ?? "").includes("Adicionar ou Remover Urgência") &&
        !(a.m.get("configViewFlashMenuPro") ?? "").includes("Add/Remover"),
    );
    const volta = lerAba(a, def);
    checar(
      "ler de volta da os mesmos ligados, na mesma ordem (os desligados voltam para a ordem do catalogo, como no legado)",
      volta.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join() ===
        linhas
          .filter((l) => l.ativo)
          .map((l) => l.nome)
          .join(),
    );
    // Documentos: o clique e gravado dentro da lista, na frente.
    const dd = aba("documentos");
    const ed = lerAba(a, dd);
    gravarLista(a, dd, { linhas: ed.linhas, aoClicar: false });
    checar(
      "desligar o clique tira a entrada da lista",
      !(a.m.get("configViewFlashDocMenuPro") ?? "").includes(NOME_MENU_AO_CLICAR) && lerAba(a, dd).aoClicar === false,
    );
    gravarLista(a, dd, { linhas: ed.linhas, aoClicar: true });
    checar(
      "ligar o clique poe a entrada na frente da lista",
      (a.m.get("configViewFlashDocMenuPro") ?? "").startsWith(`[["${NOME_MENU_AO_CLICAR}"],`),
    );
    checar("nomesParaGravar bate com o gravado", nomesParaGravar(dd, { linhas: ed.linhas, aoClicar: true })[0] === NOME_MENU_AO_CLICAR);
    // Chave geral: dentro do optionsPro, sem perder as outras opcoes (o legado usa setOptionsPro).
    gravarGeral(a, aba("arvore"), true);
    const opt = JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>;
    checar(
      "a chave geral vai para o optionsPro como 'enabled'/'disabled' sem apagar as outras opcoes",
      opt.optionsFlashMenu_iconstree === "enabled" &&
        opt.alguma_outra_opcao === "x" &&
        opt.panelDadosArvorePro_anotacoes === "hide" &&
        opt.panelDadosArvoreInteressados_mesmaNatureza === true,
      opt,
    );
    gravarGeral(a, aba("documentos"), false);
    checar(
      "desligar grava 'disabled'",
      (JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>).optionsFlashMenu_menudoc === "disabled",
    );
    // Migracao da chave solta (updateOptionsPro do legado move para dentro do optionsPro).
    gravarGeral(a, aba("processo"), true);
    checar(
      "a chave solta antiga some e passa para o optionsPro (como o updateOptionsPro do legado)",
      !a.m.has("optionsFlashMenu_menuproc") &&
        (JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>).optionsFlashMenu_menuproc === "enabled",
    );
    const solta = memoria({ optionsFlashMenu_panelinfo: '"disabled"' });
    checar(
      "chave solta lida quando o optionsPro ainda nao tem a opcao",
      valorDaOpcao(solta, "optionsFlashMenu_panelinfo") === "disabled" && painelLigado(solta) === false,
    );
    const soltaCrua = memoria({ optionsFlashMenu_panelinfo: "disabled" });
    checar("chave solta sem aspas tambem", painelLigado(soltaCrua) === false);
    const ambas = memoria({
      optionsFlashMenu_panelinfo: '"disabled"',
      optionsPro: JSON.stringify({ optionsFlashMenu_panelinfo: "enabled" }),
    });
    checar("o optionsPro vale primeiro", painelLigado(ambas) === true);
    gravarOpcao(ambas, "x", 1);
    checar(
      "gravarOpcao sem removeItem nao quebra",
      ((): boolean => {
        const sem = {
          m: new Map<string, string>(),
          getItem: (k: string) => sem.m.get(k) ?? null,
          setItem: (k: string, v: string) => void sem.m.set(k, v),
        };
        gravarOpcao(sem, "optionsFlashMenu_menudoc", "disabled");
        return blocoDoMenuLigado(sem, "menudoc") === false;
      })(),
    );
  }

  secao("personalizar: restaurar padrao, lista vazia");
  {
    const a = memoria(perfil);
    const def = aba("processo");
    const r = restaurarPadrao(a, def);
    checar(
      "a lista personalizada some (volta a 'nunca personalizou') e a chave geral liga",
      !a.m.has("configViewFlashMenuPro") &&
        r.geral === true &&
        (JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>).optionsFlashMenu_menuproc === "enabled",
    );
    checar(
      "o estado volta com os itens do padrao, na ordem do padrao",
      r.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === PADRAO_MENU_PROCESSO.join("|"),
    );
    const dd = aba("documentos");
    const rd = restaurarPadrao(a, dd);
    checar("Documentos: o clique desliga", rd.aoClicar === false && !a.m.has("configViewFlashDocMenuPro"));
    const sem = {
      m: new Map<string, string>([["configViewFlashDocArvorePro", '[["Copiar link do documento"]]']]),
      getItem(k: string) {
        return this.m.get(k) ?? null;
      },
      setItem(k: string, v: string) {
        this.m.set(k, v);
      },
    };
    const rs = restaurarPadrao(sem, aba("arvore"));
    checar(
      "sem removeItem grava a lista padrao",
      rs.linhas
        .filter((l) => l.ativo)
        .map((l) => l.nome)
        .join("|") === PADRAO_ICONES_ARVORE.join("|"),
    );
    const e = lerAba(memoria(), aba("painel"));
    checar(
      "semNenhum: aviso so quando nenhum item esta ligado (e nao ha clique)",
      !semNenhum(aba("painel"), e) &&
        semNenhum(aba("painel"), { linhas: e.linhas.map((l) => ({ ...l, ativo: false })), aoClicar: false }) &&
        !semNenhum(aba("documentos"), {
          linhas: lerAba(memoria(), aba("documentos")).linhas.map((l) => ({ ...l, ativo: false })),
          aoClicar: true,
        }),
    );
    gravarLista(a, aba("painel"), { linhas: e.linhas.map((l) => ({ ...l, ativo: false })), aoClicar: false });
    checar(
      "tudo desligado grava [] (como o legado) e o menu volta ao padrao ao ler",
      a.m.get("configViewFlashPanelArvorePro") === "[]" && lerSelecao(a) === null,
    );
  }

  secao("personalizar: busca, contagem e ordem");
  {
    const itens = aba("processo").itens;
    const quais = (q: string) => [...casaComBusca(itens, q)];
    checar(
      "sem acento nem caixa: 'urgencia' acha Adicionar ou Remover Urgencia",
      quais("urgencia").join() === "Adicionar ou Remover Urgência",
    );
    checar("'ANOTACOES' acha Anotacoes", quais("ANOTACOES").join() === "Anotações");
    checar("busca vazia casa tudo", quais("  ").length === 29);
    checar("pela dica: 'especificacao' acha a urgencia", quais("especificacao").join() === "Adicionar ou Remover Urgência");
    checar(
      "pelo grupo: 'copiar' acha so os do grupo Copiar",
      quais("copiar").every((n) => /Copiar/.test(n) || defPorNome(ITENS_PROCESSO, n)?.grupo === "Copiar") && quais("copiar").length >= 3,
    );
    checar("nada casa: vazio", quais("xyzzy").length === 0);
    checar("semAcento normaliza", semAcento("  Ícones Rápidos ") === "icones rapidos");
    const linhas = [
      { nome: "A", ativo: true },
      { nome: "B", ativo: false },
      { nome: "C", ativo: true },
      { nome: "D", ativo: true },
    ];
    checar("contar: n de m", JSON.stringify(contar(linhas)) === '{"ativos":3,"total":4}');
    const ordem = (l: Array<{ nome: string }>) => l.map((x) => x.nome).join("");
    checar("mover um ligado para baixo troca com o PROXIMO LIGADO (passa por cima do desligado)", ordem(mover(linhas, "A", 1)) === "CBAD");
    checar("mover para cima na ponta nao muda", ordem(mover(linhas, "A", -1)) === "ABCD");
    checar(
      "mover passa por cima do que a busca esconde (C escondido: A vai para depois de D)",
      ordem(mover(linhas, "A", 1, (n) => n !== "C")) === "DBCA",
    );
    checar(
      "um item DESLIGADO nao se move (a ordem dos desligados nao vale nada)",
      ordem(mover(linhas, "B", 1)) === "ABCD" && !podeMover(linhas, "B", 1),
    );
    checar(
      "podeMover: so ha para onde ir se existir outro ligado visivel na direcao",
      podeMover(linhas, "A", 1) &&
        !podeMover(linhas, "A", -1) &&
        podeMover(linhas, "D", -1) &&
        !podeMover(linhas, "D", 1) &&
        !podeMover(linhas, "A", 1, (n) => n === "A"),
    );
    checar(
      "mover nome inexistente nao muda",
      mover(linhas, "Z", 1)
        .map((l) => l.nome)
        .join("") === "ABCD",
    );
    checar(
      "moverPara antes de outra",
      moverPara(linhas, "D", "B")
        .map((l) => l.nome)
        .join("") === "ADBC",
    );
    checar(
      "moverPara o fim",
      moverPara(linhas, "A", null)
        .map((l) => l.nome)
        .join("") === "BCDA",
    );
    checar(
      "moverPara em si mesmo nao muda",
      moverPara(linhas, "A", "A")
        .map((l) => l.nome)
        .join("") === "ABCD",
    );
  }

  secao("personalizar: barramento e observador (so avisa quando a personalizacao mudou de fato)");
  {
    const a = memoria(perfil);
    const vistas: string[] = [];
    const sair = observarPersonalizacao(a, null, (x) => vistas.push(x));
    avisarPersonalizacao("todas");
    checar("nada mudou: ninguem e avisado", vistas.length === 0);
    gravarLista(a, aba("arvore"), { linhas: lerAba(a, aba("arvore")).linhas.map((l) => ({ ...l, ativo: true })), aoClicar: false });
    avisarPersonalizacao("arvore");
    checar("a aba que mudou e avisada", vistas.join() === "arvore", vistas);
    avisarPersonalizacao("arvore");
    checar("o mesmo estado nao avisa de novo", vistas.length === 1);
    gravarOpcao(a, "panelDadosArvorePro_marcador", "hide");
    avisarPersonalizacao("todas");
    checar("gravar um painel recolhido (optionsPro) nao conta como mudanca da personalizacao", vistas.length === 1);
    gravarGeral(a, aba("painel"), false);
    avisarPersonalizacao("todas");
    checar("a chave geral desligada avisa a aba dela", vistas.join() === "arvore,painel", vistas);
    // Outra janela grava: chega o evento storage.
    const doc = instalarDom();
    const janela = doc.defaultView as unknown as Window;
    const vistas2: string[] = [];
    const memo2 = memoria();
    const sair2 = observarPersonalizacao(memo2, janela, (x) => vistas2.push(x));
    memo2.setItem("configViewFlashDocMenuPro", '[["Copiar número SEI"]]');
    const Ev = (janela as unknown as { Event: typeof Event }).Event;
    const ev = new Ev("storage");
    Object.defineProperty(ev, "key", { value: "configViewFlashDocMenuPro" });
    janela.dispatchEvent(ev);
    checar("evento storage de outra janela (o legado) avisa a aba da chave", vistas2.join() === "documentos", vistas2);
    const sinal: string[] = [];
    const parar = aoMudarPersonalizacao((x) => sinal.push(x));
    avisarPersonalizacao("painel");
    parar();
    avisarPersonalizacao("painel");
    checar("aoMudarPersonalizacao devolve o desligador", sinal.length === 1);
    sair();
    sair2();
  }

  secao("personalizar: a tela (abas, interruptores, chave geral, busca, teclado, tema)");
  {
    const doc = instalarDom('<html><head></head><body><div class="infraCorBarraSistema" style="background:#155e9e"></div></body></html>');
    fingirDialogos(doc);
    const win = doc.defaultView as unknown as { getComputedStyle: (e: Element) => { backgroundColor: string } };
    win.getComputedStyle = () => ({ backgroundColor: "rgb(21, 94, 158)" });
    const a = memoria(perfil);
    const mudancas: string[] = [];
    let confirmacoes = 0;
    let resposta = true;
    const aberto: PersonalizarAberto = abrirPersonalizar({
      topo: doc,
      doc,
      armazenamento: a,
      aoMudar: (x) => mudancas.push(x),
      confirmar: async () => {
        confirmacoes += 1;
        return resposta;
      },
      avisos: { painel: "Os paineis estao desligados nas Opcoes." },
    });
    const dlg = aberto.dialogo.el;
    checar(
      "e um dialog.spro-dialogo, com titulo e X, sem botao Cancelar nem Ok",
      ((): boolean => {
        const botoes = [...dlg.querySelectorAll("button")].map((b) => (b.textContent ?? "").trim() || (b.getAttribute("aria-label") ?? ""));
        return (
          dlg.tagName === "DIALOG" &&
          dlg.classList.contains("spro-dialogo") &&
          dlg.querySelector("h2")?.textContent === "Personalizar menu rápido" &&
          botoes.includes("Fechar (Esc)") &&
          !botoes.includes("Cancelar") &&
          !botoes.includes("Ok") &&
          !botoes.includes("Concluir")
        );
      })(),
    );
    checar("sem atributo title em nenhum elemento (aria-label no lugar)", dlg.querySelectorAll("[title]").length === 0);
    const tabs = [...dlg.querySelectorAll<HTMLElement>('[role="tab"]')];
    checar(
      "quatro abas na ordem do legado, com role=tab",
      tabs.map((t) => (t.textContent ?? "").trim()).join() === "Processo,Documentos,Árvore,Painel",
      tabs.map((t) => t.textContent),
    );
    checar(
      "so a aba escolhida esta selecionada e visivel",
      tabs.map((t) => t.getAttribute("aria-selected")).join() === "true,false,false,false" &&
        dlg.querySelectorAll('[role="tabpanel"]:not([hidden])').length === 1,
    );
    checar(
      "cada aba aponta para o painel dela (aria-controls / aria-labelledby)",
      tabs.every((t) => {
        const p = dlg.querySelector(`#${t.getAttribute("aria-controls")}`);
        return p?.getAttribute("aria-labelledby") === t.id && p.getAttribute("role") === "tabpanel";
      }),
    );
    checar(
      "os itens do Processo na ordem do legado: ligados primeiro",
      nomesDasLinhas(dlg, "processo").slice(0, 6).join("|") ===
        "Copiar link do processo|Incluir Documento|Adicionar ou Remover Urgência|Ações em Lote|Atribuir Processo|Copiar número do processo",
    );
    checar(
      "29 linhas no Processo, 25 + clique no Documentos, 8 na Arvore, 10 no Painel",
      ["processo", "documentos", "arvore", "painel"].map((i) => nomesDasLinhas(dlg, i).length).join() === "29,25,8,10",
    );
    const todos = [...dlg.querySelectorAll<HTMLElement>("li.spro-pp-linha")];
    checar(
      "todo item tem um interruptor role=switch com aria-checked e nome acessivel",
      todos.every((li) => {
        const sw = li.querySelector('button[role="switch"]');
        return (
          sw &&
          (sw.getAttribute("aria-checked") === "true" || sw.getAttribute("aria-checked") === "false") &&
          Boolean(sw.getAttribute("aria-label")) &&
          sw.getAttribute("type") === "button"
        );
      }),
    );
    checar(
      "todo item tem o glifo SVG (aria-hidden)",
      todos.every((li) => li.querySelector(".spro-pp-glifo svg[aria-hidden='true']")),
    );
    const painelProc = dlg.querySelector<HTMLElement>("#spro-pp-painel-processo")!;
    const swDe = (id: string, nome: string) =>
      dlg.querySelector<HTMLElement>(`#spro-pp-painel-${id} li[data-nome="${nome}"] button[role="switch"]`)!;
    checar(
      "o interruptor reflete o estado salvo",
      swDe("processo", "Incluir Documento").getAttribute("aria-checked") === "true" &&
        swDe("processo", "Enviar Processo").getAttribute("aria-checked") === "false",
    );
    checar(
      "grupo como etiqueta no menu (Copiar/Abrir/Acoes) e dica curta quando ha",
      painelProc.querySelector('li[data-nome="Copiar link do processo"] .spro-pp-grupo')?.textContent === "Copiar" &&
        (painelProc.querySelector('li[data-nome="Adicionar ou Remover Urgência"] .spro-pp-dica')?.textContent ?? "").includes("URGENTE"),
    );
    checar(
      "a dica fica ligada ao interruptor por aria-describedby",
      swDe("processo", "Adicionar ou Remover Urgência").getAttribute("aria-describedby") !== null,
    );
    checar(
      "contador n de m na aba",
      painelProc.querySelector(".spro-pp-contador")?.textContent === "5 de 29 ativos",
      painelProc.querySelector(".spro-pp-contador")?.textContent,
    );
    checar(
      "a chave geral do Processo esta desligada (a chave solta antiga) e as linhas ficam desabilitadas",
      swDe("processo", "Incluir Documento").hasAttribute("disabled") &&
        painelProc.getAttribute("data-geral") === "false" &&
        painelProc.querySelector("ul")?.getAttribute("aria-disabled") === "true",
    );
    const geralProc = painelProc.querySelector<HTMLElement>("button.spro-pp-geral")!;
    checar(
      "a chave geral e um switch com o nome do legado",
      geralProc.getAttribute("role") === "switch" &&
        geralProc.getAttribute("aria-label") === "Menu rápido do processo" &&
        geralProc.getAttribute("aria-checked") === "false",
    );

    // Liga a chave geral: salva na hora, avisa, habilita as linhas.
    geralProc.click();
    checar(
      "ligar a chave geral grava optionsFlashMenu_menuproc=enabled no optionsPro, avisa a aba e libera as linhas",
      (JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>).optionsFlashMenu_menuproc === "enabled" &&
        mudancas.at(-1) === "processo" &&
        geralProc.getAttribute("aria-checked") === "true" &&
        !swDe("processo", "Incluir Documento").hasAttribute("disabled") &&
        painelProc.getAttribute("data-geral") === "true" &&
        !a.m.has("optionsFlashMenu_menuproc"),
      a.m.get("optionsPro"),
    );
    // Liga um item: salva na hora no formato do legado.
    swDe("processo", "Enviar Processo").click();
    checar(
      "ligar um item salva AO MUDAR, no formato do legado, mantendo a ordem",
      a.m.get("configViewFlashMenuPro") ===
        '[["Copiar link do processo"],["Incluir Documento"],["Adicionar ou Remover Urgência"],["Ações em Lote"],["Atribuir Processo"],["Enviar Processo"]]' &&
        swDe("processo", "Enviar Processo").getAttribute("aria-checked") === "true" &&
        mudancas.at(-1) === "processo" &&
        painelProc.querySelector(".spro-pp-contador")?.textContent === "6 de 29 ativos",
      a.m.get("configViewFlashMenuPro"),
    );
    swDe("processo", "Incluir Documento").click();
    checar(
      "desligar um item o tira da lista salva",
      !(a.m.get("configViewFlashMenuPro") ?? "").includes("Incluir Documento") &&
        painelProc.querySelector(".spro-pp-contador")?.textContent === "5 de 29 ativos",
    );

    // Reordenar: botao, Alt+seta. So os LIGADOS se movem, trocando com o ligado vizinho (o desligado no meio e ignorado).
    const linhaUrg = painelProc.querySelector<HTMLElement>('li[data-nome="Adicionar ou Remover Urgência"]')!;
    const botaoSubir = linhaUrg.querySelector<HTMLButtonElement>('button[data-mover="subir"]')!;
    checar(
      "nos desligados os botoes de ordem ficam desabilitados; no primeiro ligado so o de subir",
      painelProc.querySelector<HTMLButtonElement>('li[data-nome="Enviar Processo"] button[data-mover="subir"]')?.disabled === false &&
        painelProc.querySelector<HTMLButtonElement>('li[data-nome="Incluir Documento"] button[data-mover="subir"]')?.disabled === true &&
        painelProc.querySelector<HTMLButtonElement>('li[data-nome="Copiar link do processo"] button[data-mover="subir"]')?.disabled ===
          true &&
        painelProc.querySelector<HTMLButtonElement>('li[data-nome="Copiar link do processo"] button[data-mover="descer"]')?.disabled ===
          false,
    );
    botaoSubir.click();
    checar(
      "subir pelo botao passa por cima do desligado e troca com o ligado de cima; grava a nova ordem",
      (a.m.get("configViewFlashMenuPro") ?? "").startsWith(
        '[["Adicionar ou Remover Urgência"],["Copiar link do processo"],["Ações em Lote"]',
      ) && nomesDasLinhas(dlg, "processo")[0] === "Adicionar ou Remover Urgência",
      a.m.get("configViewFlashMenuPro"),
    );
    const swUrg = swDe("processo", "Adicionar ou Remover Urgência");
    const livre = tecla(swUrg, "ArrowDown", { altKey: true });
    checar(
      "Alt+seta para baixo no interruptor desce o item (e impede o rolar da pagina)",
      livre === false &&
        (a.m.get("configViewFlashMenuPro") ?? "").startsWith(
          '[["Copiar link do processo"],["Adicionar ou Remover Urgência"],["Ações em Lote"]',
        ),
      a.m.get("configViewFlashMenuPro"),
    );
    tecla(swDe("processo", "Adicionar ou Remover Urgência"), "ArrowDown");
    checar(
      "seta sem Alt nao mexe na ordem",
      (a.m.get("configViewFlashMenuPro") ?? "").startsWith('[["Copiar link do processo"],["Adicionar ou Remover Urgência"],'),
    );
    tecla(swDe("processo", "Incluir Documento"), "ArrowUp", { altKey: true });
    checar("Alt+seta num item desligado nao faz nada", !(a.m.get("configViewFlashMenuPro") ?? "").includes("Incluir Documento"));
    checar(
      "o item movido ainda tem o interruptor certo (a lista foi refeita sem perder o estado)",
      swDe("processo", "Adicionar ou Remover Urgência").getAttribute("aria-checked") === "true",
    );

    // Documentos: clique.
    selecionar(aberto, tabs[1]!);
    const painelDoc = dlg.querySelector<HTMLElement>("#spro-pp-painel-documentos")!;
    const swClique = swDe("documentos", NOME_MENU_AO_CLICAR);
    checar(
      "Documentos: 'Ativar menu ao clicar' e o primeiro item, ligado, e nao entra na contagem",
      nomesDasLinhas(dlg, "documentos")[0] === NOME_MENU_AO_CLICAR &&
        swClique.getAttribute("aria-checked") === "true" &&
        painelDoc.querySelector(".spro-pp-contador")?.textContent === "3 de 24 ativos",
      painelDoc.querySelector(".spro-pp-contador")?.textContent,
    );
    swClique.click();
    checar(
      "desligar o clique grava a lista sem a entrada",
      !(a.m.get("configViewFlashDocMenuPro") ?? "").includes(NOME_MENU_AO_CLICAR) && mudancas.at(-1) === "documentos",
    );
    swClique.click();
    checar(
      "ligar o clique poe a entrada na frente",
      (a.m.get("configViewFlashDocMenuPro") ?? "").startsWith(`[["${NOME_MENU_AO_CLICAR}"],`),
    );
    checar(
      "a entrada do clique nao tem botoes de ordem",
      dlg.querySelector(`#spro-pp-painel-documentos li[data-nome="${NOME_MENU_AO_CLICAR}"] button[data-mover]`) === null,
    );

    // Painel: sem ordem; aviso da opcao geral.
    selecionar(aberto, tabs[3]!);
    const painelPainel = dlg.querySelector<HTMLElement>("#spro-pp-painel-painel")!;
    checar(
      "Painel: sem botoes de ordem e com o aviso da opcao desligada",
      painelPainel.querySelectorAll("button[data-mover]").length === 0 &&
        (painelPainel.querySelector(".spro-pp-aviso")?.textContent ?? "").includes("desligados"),
    );
    swDe("painel", "Observações").click();
    checar(
      "Painel: ligar Observacoes grava na chave dos paineis (a que os paineis novos leem)",
      lerSelecao(a)?.includes("Observações") === true && mudancas.at(-1) === "painel",
    );
    // Desmarcar tudo: o aviso aparece (a lista vazia volta ao padrao).
    for (const nome of ["Anotações", "Marcador", "Bloco Interno", "Observações"]) swDe("painel", nome).click();
    checar(
      "Painel: sem nenhum item marcado a tela avisa que vale o padrao",
      painelPainel.querySelector(".spro-pp-aviso:not([role='note'])")?.hasAttribute("hidden") === false &&
        a.m.get("configViewFlashPanelArvorePro") === "[]",
    );
    swDe("painel", "Marcador").click();
    checar(
      "e o aviso some ao marcar de novo",
      painelPainel.querySelector(".spro-pp-aviso:not([role='note'])")?.hasAttribute("hidden") === true,
    );

    // Arvore: chave geral desligada pelo optionsPro no perfil; ligar.
    selecionar(aberto, tabs[2]!);
    const geralArv = dlg.querySelector<HTMLElement>("#spro-pp-painel-arvore button.spro-pp-geral")!;
    checar("Arvore: a chave geral reflete o optionsPro do legado (desligada)", geralArv.getAttribute("aria-checked") === "false");
    geralArv.click();
    checar(
      "Arvore: ligar grava enabled",
      (JSON.parse(a.m.get("optionsPro") ?? "{}") as Record<string, unknown>).optionsFlashMenu_iconstree === "enabled" &&
        mudancas.at(-1) === "arvore",
    );

    // Teclado nas abas.
    tabs[0]!.focus?.();
    tecla(tabs[0]!, "ArrowRight");
    checar(
      "ArrowRight na aba vai para a proxima e a seleciona",
      tabs[1]!.getAttribute("aria-selected") === "true" &&
        tabs[0]!.getAttribute("aria-selected") === "false" &&
        tabs[1]!.getAttribute("tabindex") === "0" &&
        tabs[0]!.getAttribute("tabindex") === "-1",
    );
    tecla(tabs[1]!, "End");
    checar("End vai para a ultima", tabs[3]!.getAttribute("aria-selected") === "true");
    tecla(tabs[3]!, "ArrowRight");
    checar("ArrowRight na ultima da a volta na primeira", tabs[0]!.getAttribute("aria-selected") === "true");
    tecla(tabs[0]!, "ArrowLeft");
    checar("ArrowLeft na primeira vai para a ultima; Home volta", tabs[3]!.getAttribute("aria-selected") === "true");
    tecla(tabs[3]!, "Home");
    checar(
      "Home vai para a primeira",
      tabs[0]!.getAttribute("aria-selected") === "true" && dlg.querySelectorAll('[role="tabpanel"]:not([hidden])').length === 1,
    );

    // Busca.
    const busca = dlg.querySelector<HTMLInputElement>("input[type=search]")!;
    checar("campo de busca com rotulo acessivel", busca.getAttribute("aria-label") === "Buscar item pelo nome");
    busca.value = "urgencia";
    disparar(busca, "input");
    const visiveisDoProc = [...painelProc.querySelectorAll<HTMLElement>("li.spro-pp-linha")].filter((l) => !l.hasAttribute("hidden"));
    checar(
      "a busca sem acento mostra so o item que casa",
      visiveisDoProc.length === 1 && visiveisDoProc[0]?.getAttribute("data-nome") === "Adicionar ou Remover Urgência",
      visiveisDoProc.map((l) => l.getAttribute("data-nome")),
    );
    checar(
      "a aba mostra quantos itens casam e o rotulo acessivel diz",
      tabs[0]!.querySelector(".spro-pp-aba-conta")?.textContent === "1" && (tabs[0]!.getAttribute("aria-label") ?? "").includes("1 item"),
      tabs[0]!.getAttribute("aria-label"),
    );
    checar(
      "a busca vale em todas as abas (Documentos sem 'urgencia' fica vazia)",
      painelDoc.querySelector(".spro-pp-vazio")?.hasAttribute("hidden") === false &&
        (painelDoc.querySelector(".spro-pp-vazio")?.textContent ?? "").includes("urgencia"),
    );
    busca.value = "";
    disparar(busca, "input");
    checar(
      "limpar a busca mostra tudo de novo",
      [...painelProc.querySelectorAll("li.spro-pp-linha")].every((l) => !l.hasAttribute("hidden")) &&
        tabs[0]!.querySelector(".spro-pp-aba-conta")?.hasAttribute("hidden") === true,
    );
    busca.value = "baixar";
    disparar(busca, "input");
    const naBusca = nomesDasLinhas(dlg, "documentos").filter(
      (n) => !dlg.querySelector(`#spro-pp-painel-documentos li[data-nome="${n}"]`)?.hasAttribute("hidden"),
    );
    checar("a busca por 'baixar' acha so Baixar documento", naBusca.join() === "Baixar documento", naBusca);
    // Esc no campo com texto limpa a busca e NAO fecha o modal.
    const livreEsc = tecla(busca, "Escape");
    checar("Esc no campo limpa a busca sem fechar o modal", livreEsc === false && busca.value === "" && dlg.hasAttribute("open"));

    // Restaurar padrao (com confirmacao): vale para a aba aberta.
    resposta = false;
    const botoes = [...dlg.querySelectorAll<HTMLButtonElement>("button")];
    const restaurar = botoes.find((b) => (b.textContent ?? "").trim() === "Restaurar padrão")!;
    const antes = a.m.get("configViewFlashMenuPro");
    restaurar.click();
    await tique(10);
    checar("restaurar pede confirmacao e, recusada, nao muda nada", confirmacoes === 1 && a.m.get("configViewFlashMenuPro") === antes);
    resposta = true;
    const totalMudancas = mudancas.length;
    restaurar.click();
    await tique(10);
    checar(
      "confirmada: a aba volta ao padrao (a chave some), liga a funcao, avisa e a tela mostra o padrao",
      confirmacoes === 2 &&
        !a.m.has("configViewFlashMenuPro") &&
        mudancas.length === totalMudancas + 1 &&
        mudancas.at(-1) === "processo" &&
        nomesDasLinhas(dlg, "processo").slice(0, PADRAO_MENU_PROCESSO.length).join("|") === PADRAO_MENU_PROCESSO.join("|") &&
        painelProc.querySelector(".spro-pp-contador")?.textContent === `${PADRAO_MENU_PROCESSO.length} de 29 ativos`,
      painelProc.querySelector(".spro-pp-contador")?.textContent,
    );
    checar("a tela diz que restaurou", (dlg.querySelector(".spro-pp-situacao")?.textContent ?? "").includes("Padrão restaurado"));

    // Tema: escuro e cor do SEI.
    checar(
      "tema claro no inicio e a cor do SEI aplicada ao destaque (como a capa)",
      !dlg.hasAttribute("data-tema") && dlg.hasAttribute("data-cor-sei") && dlg.style.getPropertyValue("--spro-cor-sei") === "#155e9e",
      dlg.style.getPropertyValue("--spro-cor-sei"),
    );
    // Fecha: nao deixa lixo e permite reabrir.
    aberto.fechar();
    checar("fechar remove o dialogo do documento", !doc.body.contains(dlg));
    const outro = abrirPersonalizar({ topo: doc, doc, armazenamento: a });
    checar(
      "depois de fechar abre outro, na aba pedida por padrao (Processo)",
      outro.dialogo.el !== dlg && outro.dialogo.el.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim() === "Processo",
    );
    const igual = abrirPersonalizar({ topo: doc, doc, armazenamento: a, aba: "painel" });
    checar(
      "abrir de novo com a tela aberta nao duplica: reaproveita e troca para a aba pedida",
      igual === outro &&
        doc.querySelectorAll("dialog.spro-pp").length === 1 &&
        outro.dialogo.el.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim() === "Painel",
    );
    outro.fechar();
  }

  secao("personalizar: tema escuro, erro de gravacao e abas pedidas");
  {
    const doc = instalarDom('<html data-spro-tema="escuro"><head></head><body></body></html>');
    fingirDialogos(doc);
    const a = memoria();
    const aberto = abrirPersonalizar({ topo: doc, doc, armazenamento: a, aba: "documentos" });
    checar("SEI escuro (Estilo Avancado): o modal ganha data-tema=escuro", aberto.dialogo.el.getAttribute("data-tema") === "escuro");
    checar(
      "abre na aba pedida",
      aberto.dialogo.el.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim() === "Documentos",
    );
    checar("sem cor do SEI no teste: nao poe data-cor-sei", !aberto.dialogo.el.hasAttribute("data-cor-sei"));
    // Armazenamento recusa gravar (cota cheia ou janela privada): o erro aparece no modal e o interruptor volta.
    const cheio = {
      ...a,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    const ab2 = abrirPersonalizar({ topo: instalarDom(), doc: instalarDom(), armazenamento: cheio, aoMudar: () => {} });
    const sw = ab2.dialogo.el.querySelector<HTMLElement>('#spro-pp-painel-processo li[data-nome="Enviar Processo"] button[role="switch"]')!;
    sw.click();
    const sw2 = ab2.dialogo.el.querySelector<HTMLElement>(
      '#spro-pp-painel-processo li[data-nome="Enviar Processo"] button[role="switch"]',
    )!;
    checar(
      "gravacao recusada: aparece o erro e o interruptor volta ao que esta salvo",
      (ab2.dialogo.el.querySelector(".spro-p-erro")?.textContent ?? "").includes("Não foi possível salvar") &&
        sw2.getAttribute("aria-checked") === "false",
    );
    // Escuro alternado ao vivo: o observador troca o atributo.
    aberto.fechar();
    ab2.fechar();
  }

  secao("personalizar: abertura (evento do legado, handshake, avisos das opcoes)");
  {
    const doc = instalarDom();
    const chamadas: Array<string | undefined> = [];
    const parar = ligarPersonalizar(doc, (aba) => chamadas.push(aba));
    const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
    doc.dispatchEvent(new Ev(EVENTO_ABRIR_PERSONALIZAR));
    checar(
      "o evento do legado abre a tela e o atributo de confirmacao ja esta no html (mesmo instante)",
      chamadas.length === 1 && doc.documentElement.getAttribute(ATRIBUTO_PERSONALIZAR_ACK) === "1",
    );
    parar();
    doc.dispatchEvent(new Ev(EVENTO_ABRIR_PERSONALIZAR));
    checar("desligado, o evento nao faz nada", chamadas.length === 1);

    const desligadas = JSON.stringify([
      {
        configGeral: [
          { name: "menurapido", value: false },
          { name: "infoarvore", value: false },
        ],
      },
    ]);
    const av = avisosDasOpcoes(desligadas);
    checar(
      "sem as opcoes ligadas, a tela avisa em cada aba (menu e paineis)",
      Boolean(av.processo && av.documentos && av.arvore && av.painel),
    );
    const ligadas = avisosDasOpcoes(
      JSON.stringify([
        {
          configGeral: [
            { name: "menurapido", value: true },
            { name: "infoarvore", value: true },
          ],
        },
      ]),
    );
    checar("com as opcoes ligadas, sem aviso", Object.keys(ligadas).length === 0, ligadas);

    let recebido: { aba?: string; avisos?: unknown } | null = null;
    const abrir = criarAbertura({
      doc,
      topo: () => doc,
      armazenamento: memoria(),
      dataValues: async () => desligadas,
      abrir: (d) => {
        recebido = { ...(d.aba ? { aba: d.aba } : {}), avisos: d.avisos };
        return null as unknown as PersonalizarAberto;
      },
    });
    abrir("documentos");
    await tique(10);
    checar(
      "criarAbertura repassa a aba pedida e os avisos das opcoes",
      (recebido as { aba?: string } | null)?.aba === "documentos" &&
        Object.keys((recebido as { avisos?: object } | null)?.avisos ?? {}).length === 4,
    );
  }

  secao("personalizar: a guarda do legado (configFlashMenuPro cede a tela nova; sem ela abre a janela antiga)");
  {
    const fonte = lerArquivo("../../dist/js/sei-functions-pro.js");
    const i = fonte.indexOf("function abrirPersonalizarMenuNovoPro()");
    const f = fonte.indexOf("function configFlashMenuPro(", i);
    const corpo = fonte.slice(i, f);
    checar(
      "a funcao do legado dispara o evento certo e le o atributo certo",
      corpo.includes(`'${EVENTO_ABRIR_PERSONALIZAR}'`) && corpo.includes(`'${ATRIBUTO_PERSONALIZAR_ACK}'`),
    );
    checar(
      "configFlashMenuPro chama a guarda na primeira linha",
      /function configFlashMenuPro\(arrayLinksArvore\) \{ \n\s+if \(abrirPersonalizarMenuNovoPro\(\)\) return;/.test(fonte),
    );
    const rodar = (modulo: "presente" | "ausente" | "semQuadro"): { retorno: boolean; eventos: string[]; sobrou: boolean } => {
      const eventos: string[] = [];
      const atributos = new Map<string, string>();
      const html = {
        removeAttribute: (n: string) => void atributos.delete(n),
        hasAttribute: (n: string) => atributos.has(n),
        setAttribute: (n: string, v: string) => void atributos.set(n, v),
      };
      const docArvore = {
        documentElement: html,
        dispatchEvent: (e: { type: string }) => {
          eventos.push(e.type);
          // O modulo (mundo isolado) responde na hora, dentro do dispatch.
          if (modulo === "presente") atributos.set(ATRIBUTO_PERSONALIZAR_ACK, "1");
          return true;
        },
      };
      const sandbox = {
        document: {
          getElementById: (id: string) => (id === "ifrArvore" && modulo !== "semQuadro" ? { contentDocument: docArvore } : null),
        },
        CustomEvent: class {
          type: string;
          constructor(t: string) {
            this.type = t;
          }
        },
        retorno: false,
      };
      vm.runInNewContext(`${corpo}\nretorno = abrirPersonalizarMenuNovoPro();`, sandbox);
      return { retorno: sandbox.retorno, eventos, sobrou: atributos.has(ATRIBUTO_PERSONALIZAR_ACK) };
    };
    const com = rodar("presente");
    checar(
      "com o modulo: dispara o evento, recebe a confirmacao, apaga o atributo e devolve true (nao abre a janela antiga)",
      com.retorno === true && com.eventos.join() === EVENTO_ABRIR_PERSONALIZAR && com.sobrou === false,
    );
    const sem = rodar("ausente");
    checar("sem o modulo (ninguem confirma): devolve false e a janela antiga abre", sem.retorno === false && sem.eventos.length === 1);
    const semQuadro = rodar("semQuadro");
    checar("sem o quadro da arvore: devolve false, sem erro", semQuadro.retorno === false && semQuadro.eventos.length === 0);
  }

  await verificarAoVivo();
}

/** Seleciona uma aba como o clique faz. */
function selecionar(_a: PersonalizarAberto, aba: HTMLElement): void {
  aba.click();
}

async function verificarAoVivo(): Promise<void> {
  secao("personalizar: ao vivo (o menu, os icones fixos e os paineis reagem sem recarregar)");
  const arv = lerArvore(
    paginaDe(
      instalarDom(
        readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41/arvore_completa.html"), "utf8").replace(/^<!-- url: .*? -->\n/, ""),
      ),
      URL_ARVORE,
    ),
  );
  const interno = arv.documentos.find((d) => d.id === "160173")!;
  const externo = arv.documentos.find((d) => d.id === "160178")!;
  const docs = [interno, externo];
  const atr = 'data-toggle="popover" class="clipboard"';
  const linhas = docs
    .map(
      (d) =>
        `<a id="anchorImg${d.id}" ${atr} href="#"><img id="icon${d.id}" src="svg/documento_interno.svg"></a><a id="anchor${d.id}" class="infraArvoreNo" target="ifrConteudoVisualizacao" href="about:blank"><span>${d.titulo} (${d.numero})</span></a><span><br></span>`,
    )
    .join("");
  const doc = instalarDom(
    `<html><head></head><body><form id="frmArvore"><div id="divArvore"><div id="topmenu" class="infraArvore"><a id="anchorImg148265" ${atr} href="#"><img id="icon148265" src="svg/processo.svg"></a><a id="anchor148265" class="infraArvoreNo" target="ifrVisualizacao" href="controlador.php?acao=arvore_visualizar"><span>${arv.protocolo}</span></a></div><div id="div148265" class="infraArvore">${linhas}</div></div></form><iframe id="ifrPasta"></iframe></body></html>`,
  );
  fingirDialogos(doc);
  const a = memoria();
  const loja = new LojaProcesso(areaMemoria({}), "treinamento.sei.sp.gov.br|usuario.teste", arv.idProcedimento, {
    sigiloso: false,
    esperar: async () => {},
  });
  const ctx = criarContexto({
    doc,
    topo: doc,
    arv: { ...arv, documentos: docs },
    loja,
    host: "treinamento.sei.sp.gov.br",
    login: "usuario.teste",
    unidade: { id: "110000001", sigla: "TESTE" },
    habilitados: paineisHabilitados(null),
    armazenamento: a,
    consultasDesativadas: false,
    reaberturaProgramada: false,
    usaTrancado: true,
    recarregar: () => {},
  });
  const http = new Proxy({}, { get: () => () => Promise.reject(new Error("requisicao inesperada")) }) as unknown as Http;
  const abertas: string[] = [];
  const menu = ligarMenuDaArvore({
    ctx,
    dataValues: undefined,
    http,
    esperaAbrir: 0,
    esperaFechar: 25,
    personalizar: (aba) => void abertas.push(aba),
  });
  await tique(200);
  const icones = (id: string): string[] =>
    [...doc.querySelectorAll<HTMLElement>(`.spro-pm-icone[data-id="${id}"]`)].map((e) => e.getAttribute("data-action") ?? "");
  checar(
    "ao ligar: os icones do padrao (copiar numero, copiar link, duplicar)",
    icones(interno.id).join() === "copy,link,clone",
    icones(interno.id),
  );

  const tela = abrirPersonalizar({ topo: doc, doc, armazenamento: a, aba: "arvore" });
  const sw = (aba: string, nome: string) =>
    tela.dialogo.el.querySelector<HTMLElement>(`#spro-pp-painel-${aba} li[data-nome="${nome}"] button[role="switch"]`)!;
  sw("arvore", "Visualizar em nova aba").click();
  await tique(220);
  checar(
    "ligar 'Visualizar em nova aba' na tela poe o icone na arvore SEM recarregar",
    icones(interno.id).includes("view"),
    icones(interno.id),
  );
  sw("arvore", "Copiar link do documento").click();
  await tique(220);
  checar(
    "desligar 'Copiar link' tira o icone",
    !icones(interno.id).includes("link") && icones(interno.id).includes("view"),
    icones(interno.id),
  );
  // Ordem: sobe 'Visualizar em nova aba' ao topo.
  for (let i = 0; i < 8; i++)
    tela.dialogo.el
      .querySelector<HTMLElement>('#spro-pp-painel-arvore li[data-nome="Visualizar em nova aba"] button[data-mover="subir"]')
      ?.click();
  await tique(220);
  checar("mudar a ordem refaz os icones na ordem nova", icones(interno.id)[0] === "view", icones(interno.id));
  // Chave geral da aba Arvore.
  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-arvore button.spro-pp-geral")!.click();
  await tique(220);
  checar("desligar a chave geral da aba Arvore tira TODOS os icones", doc.querySelectorAll(".spro-pm-icone").length === 0);
  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-arvore button.spro-pp-geral")!.click();
  await tique(220);
  checar("ligar de novo traz os icones de volta", icones(interno.id).length > 0);

  // O menu: abre com a lista nova; a mudanca fecha o menu aberto.
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
  await tique(15);
  const m1 = doc.querySelector<HTMLElement>(".spro-pm");
  const itensProc = () =>
    [...(doc.querySelector(".spro-pm")?.querySelectorAll("[data-item]") ?? [])].map((b) => b.getAttribute("data-item"));
  checar("menu do processo com o padrao (sem 'Enviar Processo')", m1 !== null && !itensProc().includes("p-enviar"), itensProc());
  const antes = itensProc();
  tela.selecionar("processo");
  sw("processo", "Copiar somente o número").click();
  await tique(5);
  checar("mudar a lista fecha o menu aberto (nao fica com itens velhos)", doc.querySelector(".spro-pm") === null, antes);
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseout");
  await tique(40);
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
  await tique(15);
  checar("o proximo menu do processo ja traz o item novo, sem recarregar", itensProc().includes("p-copiar-so-numero"), itensProc());
  // Chave geral do menu do processo.
  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-processo button.spro-pp-geral")!.click();
  await tique(5);
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseout");
  await tique(40);
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
  await tique(15);
  checar("desligar o menu do processo (chave geral) e ele nao abre mais", doc.querySelector(".spro-pm") === null);
  // Item "Personalizar menu" abre a tela nova (no lugar do legado).
  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-processo button.spro-pp-geral")!.click();
  await tique(5);
  disparar(doc.getElementById("anchor148265")!.firstElementChild!, "mouseover");
  await tique(15);
  doc.querySelector<HTMLElement>('.spro-pm [data-item="personalizar"]')?.click();
  await tique(5);
  checar("o item 'Personalizar menu' do processo abre a tela nova na aba Processo", abertas.at(-1) === "processo", abertas);
  disparar(doc.getElementById(`icon${interno.id}`)!, "mouseover");
  await tique(15);
  doc.querySelector<HTMLElement>('.spro-pm [data-item="personalizar"]')?.click();
  await tique(5);
  checar("o do documento abre na aba Documentos", abertas.at(-1) === "documentos", abertas);

  // Outra janela (o legado) grava: o menu reage pelo evento storage.
  const janela = doc.defaultView as unknown as Window & { Event: typeof Event };
  a.setItem("configViewFlashDocArvorePro", '[["Copiar nome do documento"]]');
  const ev = new janela.Event("storage");
  Object.defineProperty(ev, "key", { value: "configViewFlashDocArvorePro" });
  janela.dispatchEvent(ev);
  await tique(220);
  checar("gravacao feita pelo legado (outra janela) tambem refaz os icones", icones(interno.id).join() === "name", icones(interno.id));
  tela.fechar();
  menu.parar();

  await verificarPaineisAoVivo();
}

async function verificarPaineisAoVivo(): Promise<void> {
  secao("personalizar: paineis ao vivo (chave geral e lista da aba Painel)");
  const html = readFileSync(join(AQUI, "../../sei-nucleo/tests/fixtures/sei41/arvore.html"), "utf8").replace(/^<!-- url: .*? -->\n/, "");
  const doc = instalarDom(html);
  fingirDialogos(doc);
  const arv = lerArvore(paginaDe(doc, URL_ARVORE));
  const a = memoria();
  const loja = new LojaProcesso(areaMemoria({}), "treinamento.sei.sp.gov.br|usuario.teste", arv.idProcedimento, {
    sigiloso: false,
    esperar: async () => {},
  });
  const carregadas: NomeFatia[] = [];
  const ctx = criarContexto({
    doc,
    topo: doc,
    arv,
    loja,
    host: "treinamento.sei.sp.gov.br",
    login: "usuario.teste",
    unidade: { id: "110000001", sigla: "TESTE" },
    habilitados: paineisHabilitados(null),
    armazenamento: a,
    consultasDesativadas: false,
    reaberturaProgramada: false,
    usaTrancado: true,
    recarregar: (n) => {
      carregadas.push(n);
      void loja.carregar(n, () => new Promise<never>(() => {}));
    },
  });
  const vivos = ligarPaineisVivos(ctx, { comTitulo: false, janela: null });
  const presentes = () => [...doc.querySelectorAll("[data-spro-painel]")].map((e) => e.getAttribute("data-spro-painel") ?? "").sort();
  checar(
    "sem personalizar: os 9 paineis do padrao (mais a especificacao), sem Bloco Interno",
    presentes().includes("marcador") && presentes().includes("anotacoes") && !presentes().includes("bloco_interno"),
    presentes(),
  );
  const primeiras = carregadas.length;
  checar("na primeira vez carrega as fatias que os paineis leem", primeiras > 0);

  const tela = abrirPersonalizar({ topo: doc, doc, armazenamento: a, aba: "painel" });
  const sw = (nome: string) =>
    tela.dialogo.el.querySelector<HTMLElement>(`#spro-pp-painel-painel li[data-nome="${nome}"] button[role="switch"]`)!;
  sw("Bloco Interno").click();
  checar("ligar 'Bloco Interno' na tela monta o painel SEM recarregar a pagina", presentes().includes("bloco_interno"), presentes());
  checar(
    "so a fatia que faltava foi carregada (as consultas do processo nao se repetem)",
    carregadas.slice(primeiras).join() === "blocoInterno",
    carregadas.slice(primeiras),
  );
  sw("Marcador").click();
  checar("desligar 'Marcador' tira o painel", !presentes().includes("marcador") && presentes().includes("bloco_interno"), presentes());
  sw("Marcador").click();
  checar(
    "ligar de novo traz o painel de volta, sem carregar outra vez",
    presentes().includes("marcador") && carregadas.slice(primeiras).join() === "blocoInterno",
    carregadas.slice(primeiras),
  );
  const raizes = () => doc.querySelectorAll("[data-spro-processo-raiz]").length;
  checar("sem duplicar a montagem (uma raiz dos paineis e uma das anotacoes)", raizes() === 2, raizes());

  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-painel button.spro-pp-geral")!.click();
  checar("a chave geral da aba Painel desligada tira TODOS os paineis", presentes().length === 0 && raizes() === 0, presentes());
  tela.dialogo.el.querySelector<HTMLElement>("#spro-pp-painel-painel button.spro-pp-geral")!.click();
  checar(
    "ligada de novo, monta de novo com a lista salva (Bloco Interno incluso)",
    presentes().includes("bloco_interno") && presentes().includes("marcador") && raizes() === 2,
    presentes(),
  );
  // O legado (outra janela) grava a lista: os paineis acompanham pelo evento storage.
  const janela = doc.defaultView as unknown as Window & { Event: typeof Event };
  const fora = ligarPaineisVivos({ ...ctx, doc: ctx.doc }, { comTitulo: false, janela });
  fora.parar();
  a.setItem("configViewFlashPanelArvorePro", JSON.stringify([["Anotações"]]));
  const ev = new janela.Event("storage");
  Object.defineProperty(ev, "key", { value: "configViewFlashPanelArvorePro" });
  janela.dispatchEvent(ev);
  vivos.aplicar();
  checar(
    "a lista gravada pelo legado vale (so Anotacoes e a especificacao)",
    presentes().join() === "anotacoes,descricao" || presentes().every((t) => t === "anotacoes" || t === "descricao"),
    presentes(),
  );
  tela.fechar();
  vivos.parar();
  checar("parar tira os paineis e o ouvinte", doc.querySelectorAll("[data-spro-processo-raiz]").length === 0);
}
