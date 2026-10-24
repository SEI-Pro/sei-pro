/**
 * Liga o menu da árvore: o menu do documento (ao passar o mouse, ou ao clicar), o menu do número do processo e os
 * ícones fixos. Um só ouvinte no documento da árvore (delegação) atende todos os nós, inclusive os das pastas que o
 * SEI abre depois, sem reiniciar nada.
 */
import { opcaoLegadaLigada, valorOpcaoLegada } from "@comum/opcoes/legadas";
import { type Arvore, acaoNaArvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import type { Http } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { type ContextoProcesso, SeiDaPagina } from "../contexto";
import { aoMudarTema, garantirEstilo, temaEscuro } from "../estilo";
import { blocoDoMenuLigado, lerListaDoMenu } from "../opcoes";
import {
  type AlvoDocumento,
  type ItemMenu,
  iconesFixosDoDocumento,
  itensDoDocumento,
  itensDoProcesso,
  type OpcoesMenu,
  type Servicos,
} from "./acoes";
import { NOME_MENU_AO_CLICAR } from "./catalogo";
import { DocumentosDaTela, idDoNo } from "./documentos";
import { colocarIcones, manterIcones, tirarIcones } from "./icones";
import { abrirMenu, type MenuAberto } from "./menu";
import { criarServicos } from "./servicos";

export const CHAVE_MENU_PROCESSO = "configViewFlashMenuPro";
export const CHAVE_MENU_DOCUMENTO = "configViewFlashDocMenuPro";
export const CHAVE_ICONES_ARVORE = "configViewFlashDocArvorePro";

export interface DepsLigar {
  ctx: ContextoProcesso;
  /** `chrome.storage.sync.dataValues` (opções gerais: `uploaddocsexternos`, `acoesemlote`, `citacaodoc`). */
  dataValues: unknown;
  http: Http;
  /** Para os testes; o padrão enxerga a árvore da tela com os documentos das pastas abertas. */
  sei?: Sei;
  /** Para os testes: serviços falsos. */
  servicos?: Servicos;
  /** Tempo de espera antes de abrir e de fechar ao passar o mouse (ms). */
  esperaAbrir?: number;
  esperaFechar?: number;
  recarregarArvore?: () => void;
}

export interface MenuLigado {
  documentos: DocumentosDaTela;
  /** Abre o menu de um nó agora (testes e teclado). */
  abrir(ancora: HTMLElement, focar?: boolean): void;
  atual(): MenuAberto | null;
  parar(): void;
}

type Gatilho = { tipo: "documento"; ancora: HTMLElement; id: string } | { tipo: "processo"; ancora: HTMLElement };

export function ligarMenuDaArvore(d: DepsLigar): MenuLigado {
  const { ctx } = d;
  const doc = ctx.doc;
  const esperaAbrir = d.esperaAbrir ?? 150;
  const esperaFechar = d.esperaFechar ?? 300;
  garantirEstilo(doc);

  const docs = new DocumentosDaTela(ctx.arv.documentos);
  docs.lerDoIframe(doc);

  const arvoreVista = (): Arvore => ({ ...ctx.arv, documentos: docs.todos() });
  const sei =
    d.sei ?? new SeiDaPagina(doc.location?.href ?? "https://sei.invalido/sei/controlador.php", arvoreVista, () => paginaDe(ctx.topo));
  const servicos =
    d.servicos ??
    criarServicos({
      ctx,
      http: d.http,
      sei,
      recarregarArvore: d.recarregarArvore ?? (() => doc.location.reload()),
    });

  const base = `${doc.location?.origin ?? ""}${doc.location?.pathname ?? ""}`;
  const incluir = (): boolean => Boolean(acaoNaArvore(arvoreVista(), "documento_escolher_tipo"));
  const opcoes = (selecao: readonly string[] | null): OpcoesMenu => ({
    selecao,
    citacao: valorOpcaoLegada(d.dataValues, "citacaodoc"),
    base,
    idProcedimento: ctx.arv.idProcedimento,
    protocolo: ctx.arv.protocolo,
    linkProcesso: ctx.arv.linkProcesso,
    acoesProcesso: ctx.arv.acoesProcesso,
    funcoesProcesso: ctx.arv.funcoesProcesso ?? [],
    podeIncluirDocumento: incluir(),
    uploadLigado: opcaoLegadaLigada(d.dataValues, "uploaddocsexternos"),
    loteLigado: opcaoLegadaLigada(d.dataValues, "acoesemlote"),
    servicos,
  });
  const selecaoDoc = () => lerListaDoMenu(ctx.armazenamento, CHAVE_MENU_DOCUMENTO);
  const selecaoProc = () => lerListaDoMenu(ctx.armazenamento, CHAVE_MENU_PROCESSO);
  const selecaoIcones = () => lerListaDoMenu(ctx.armazenamento, CHAVE_ICONES_ARVORE);
  const cliqueLigado = () => selecaoDoc()?.includes(NOME_MENU_AO_CLICAR) ?? false;

  const alvoDe = (id: string, rotulo: string): AlvoDocumento => {
    let dado = docs.obter(id);
    if (!dado) {
      // A pasta pode ter chegado sem o evento de carga: uma leitura do iframe antes de desistir.
      docs.lerDoIframe(doc);
      dado = docs.obter(id);
    }
    return { id, rotulo, dado };
  };

  const personalizar: ItemMenu = {
    id: "personalizar",
    nome: "Personalizar Menu",
    grupo: "Acoes",
    rotulo: "Personalizar menu",
    icone: "ajustes",
    executar: () => servicos.legado("personalizar"),
  };

  // ---- gatilhos ---------------------------------------------------------------------------------------------------
  const gatilhoDe = (alvo: EventTarget | null): Gatilho | null => {
    const el = alvo as Element | null;
    if (!el?.closest) return null;
    const img = el.closest<HTMLElement>('a[id^="anchorImg"]');
    if (img) {
      const id = idDoNo(img.id, "anchorImg");
      if (id && id !== ctx.arv.idProcedimento && blocoDoMenuLigado(ctx.armazenamento, "menudoc"))
        return { tipo: "documento", ancora: img, id };
      return null;
    }
    const nomeProc = el.closest<HTMLElement>(`a[id="anchor${ctx.arv.idProcedimento}"]`);
    if (nomeProc && blocoDoMenuLigado(ctx.armazenamento, "menuproc")) return { tipo: "processo", ancora: nomeProc };
    return null;
  };

  const itensDe = (g: Gatilho): { itens: ItemMenu[]; rotulo: string } => {
    if (g.tipo === "processo") {
      return { itens: itensDoProcesso(opcoes(selecaoProc())), rotulo: "Menu do processo" };
    }
    const nome = doc.getElementById(`anchor${g.id}`);
    const alvo = alvoDe(g.id, (nome?.textContent ?? "").replace(/\s+/g, " ").trim());
    return { itens: itensDoDocumento(alvo, opcoes(selecaoDoc())), rotulo: "Menu do documento" };
  };

  let aberto: { menu: MenuAberto; ancora: HTMLElement } | null = null;
  let pendente: { ancora: HTMLElement; timer: ReturnType<typeof setTimeout> } | null = null;
  let timerFechar: ReturnType<typeof setTimeout> | undefined;

  const fecharAgora = () => {
    clearTimeout(timerFechar);
    if (pendente) clearTimeout(pendente.timer);
    pendente = null;
    const a = aberto;
    aberto = null;
    a?.menu.fechar();
  };

  const abrirPara = (g: Gatilho, focar: boolean) => {
    if (aberto?.ancora === g.ancora) return;
    fecharAgora();
    const { itens, rotulo } = itensDe(g);
    if (!itens.length) return;
    const menu = abrirMenu(g.ancora, itens, {
      rotulo,
      escuro: temaEscuro(doc),
      focar,
      rodape: [personalizar],
      aoFechar: () => {
        if (aberto?.menu === menu) aberto = null;
      },
      aoEscolher: (it) => {
        void Promise.resolve()
          .then(() => it.executar())
          .catch((e) => {
            console.warn("[SEI Pro] menu da árvore:", e);
            servicos.avisar("Não foi possível concluir a ação.", 5000);
          });
      },
    });
    aberto = { menu, ancora: g.ancora };
    menu.el.addEventListener("mouseenter", () => clearTimeout(timerFechar));
    menu.el.addEventListener("mouseleave", () => agendarFechar());
  };

  const agendarFechar = () => {
    clearTimeout(timerFechar);
    timerFechar = setTimeout(fecharAgora, esperaFechar);
  };

  const dentroDaZona = (alvo: EventTarget | null): boolean => {
    const el = alvo as Node | null;
    if (!el) return false;
    if (aberto && (aberto.ancora.contains(el) || aberto.menu.el.contains(el))) return true;
    if (pendente?.ancora.contains(el)) return true;
    return false;
  };

  const aoEntrar = (ev: Event) => {
    if (dentroDaZona(ev.target)) {
      clearTimeout(timerFechar);
      return;
    }
    const g = gatilhoDe(ev.target);
    // Saiu do que ia abrir.
    if (pendente) {
      clearTimeout(pendente.timer);
      pendente = null;
    }
    // O clique manda no documento (nada abre ao passar o mouse), ou o mouse foi para fora de tudo.
    if (!g || (g.tipo === "documento" && cliqueLigado())) {
      if (aberto) agendarFechar();
      return;
    }
    if (aberto) agendarFechar();
    pendente = {
      ancora: g.ancora,
      timer: setTimeout(() => {
        pendente = null;
        abrirPara(g, false);
      }, esperaAbrir),
    };
  };

  const aoSair = (ev: Event) => {
    // Saiu do documento da árvore (sem passar por outro elemento): nenhum mouseover vai avisar.
    if ((ev as MouseEvent).relatedTarget) return;
    if (pendente) {
      clearTimeout(pendente.timer);
      pendente = null;
    }
    if (aberto) agendarFechar();
  };

  const aoClicar = (ev: Event) => {
    const g = gatilhoDe(ev.target);
    if (!g) return;
    if (g.tipo === "documento" && cliqueLigado()) {
      // O menu toma o lugar do balão de cópia do SEI.
      ev.preventDefault();
      ev.stopImmediatePropagation();
      if (aberto?.ancora === g.ancora) fecharAgora();
      else abrirPara(g, false);
      return;
    }
    // Passando o mouse: o clique no ícone deixa o balão do SEI aparecer sozinho, sem o nosso por cima.
    if (g.tipo === "documento" && aberto?.ancora === g.ancora) fecharAgora();
  };

  const aoTeclar = (ev: KeyboardEvent) => {
    const g = gatilhoDe(ev.target);
    if (!g) return;
    const abre = ev.key === "ArrowDown" || ((ev.key === "Enter" || ev.key === " ") && g.tipo === "documento" && cliqueLigado());
    if (!abre) return;
    ev.preventDefault();
    // O menu que abre agora ouve o mesmo teclado: esta tecla ja foi a que o abriu.
    ev.stopImmediatePropagation();
    abrirPara(g, true);
  };

  doc.addEventListener("mouseover", aoEntrar);
  doc.addEventListener("mouseout", aoSair);
  doc.addEventListener("click", aoClicar, true);
  doc.addEventListener("keydown", aoTeclar, true);

  // ---- ícones fixos -----------------------------------------------------------------------------------------------
  let pararIcones: (() => void) | null = null;
  const recolocar = () => {
    if (!blocoDoMenuLigado(ctx.armazenamento, "iconstree")) {
      tirarIcones(doc);
      return;
    }
    colocarIcones(doc, ctx.arv.idProcedimento, alvoDe, () => opcoes(selecaoDoc()), selecaoIcones);
  };
  if (blocoDoMenuLigado(ctx.armazenamento, "iconstree")) {
    pararIcones = manterIcones(
      doc,
      async (id, modo) => {
        const nome = doc.getElementById(`anchor${id}`);
        const alvo = alvoDe(id, (nome?.textContent ?? "").replace(/\s+/g, " ").trim());
        const it = iconesFixosDoDocumento(alvo, opcoes(selecaoDoc()), selecaoIcones()).find((i) => i.modo === modo);
        await it?.executar();
      },
      recolocar,
    );
    recolocar();
  }
  const pararPastas = docs.acompanharPastas(doc, () => setTimeout(recolocar, 80));
  const pararTema = aoMudarTema(doc, () => {
    if (!aberto) return;
    if (temaEscuro(doc)) aberto.menu.el.setAttribute("data-tema", "escuro");
    else aberto.menu.el.removeAttribute("data-tema");
  });

  return {
    documentos: docs,
    abrir(ancora, focar = false) {
      const idDoc = idDoNo(ancora.id, "anchorImg");
      if (idDoc) return abrirPara({ tipo: "documento", ancora, id: idDoc }, focar);
      abrirPara({ tipo: "processo", ancora }, focar);
    },
    atual: () => aberto?.menu ?? null,
    parar() {
      fecharAgora();
      doc.removeEventListener("mouseover", aoEntrar);
      doc.removeEventListener("mouseout", aoSair);
      doc.removeEventListener("click", aoClicar, true);
      doc.removeEventListener("keydown", aoTeclar, true);
      pararIcones?.();
      pararPastas();
      pararTema();
    },
  };
}
