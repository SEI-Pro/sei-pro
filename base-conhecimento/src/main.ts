/**
 * Entrada do content script da Base de Conhecimento em pastas.
 *
 * Decide pela tela (`base_conhecimento_listar` monta; `base_conhecimento_pesquisar`
 * ganha o atalho "Ver pastas"), respeita o liga/desliga da página de opções e
 * devolve a tela nativa em qualquer falha. Só leitura nos itens do SEI; a única
 * escrita é o Texto Padrão da árvore, pela sincronia.
 */

import { type Area, areaChrome, areaMemoria } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { lerOpcaoLegada, opcaoLegadaLigada } from "@comum/opcoes/legadas";
import { travarComLocks, travarEsperando } from "@comum/sincronia/trava";
import { linkDoMenu } from "@nucleo/links/links";
import { lerContexto } from "@nucleo/sei";
import { criarHttp } from "@nucleo/sessao/http";
import { paginaDe } from "@nucleo/sessao/pagina";
import { lerItensDaUnidade } from "./nucleo/itens";
import { armazemDoTexto } from "./pagina/armazem";
import { montar, quandoDomPronto, telaAtual } from "./pagina/montar";
import { areaDaAba, lerIntencao, limparIntencao, montarFaixaDestino } from "./pagina/novaEmContexto";
import { CHAVE_NUMERAR, lerNumeracao } from "./preferencias";
import { criarAvisos } from "./ui/aviso";
import cssAvisos from "./ui/aviso.css";
import { criarDialogos } from "./ui/dialogos";
import cssDialogos from "./ui/dialogos.css";
import cssPainel from "./ui/painel.css";

const OPCAO = "baseconhecimento";
const MARCA = "data-seipro-base-conhecimento";

let desfazer: (() => void) | null = null;
let montando = false;

const pagina = () => paginaDe(document, location.href);

/** Na tela de pesquisa, um atalho para a lista (onde a árvore vive). */
function injetarAtalho(): void {
  try {
    if (document.querySelector("#sproBcAtalho")) return;
    const href = linkDoMenu(pagina(), "base_conhecimento_listar");
    const alvo = document.querySelector("#frmBaseConhecimento") ?? document.querySelector("#divInfraAreaTelaD form");
    if (!alvo) return;
    const a = document.createElement("a");
    a.id = "sproBcAtalho";
    a.href = href;
    a.textContent = "Ver pastas";
    a.className = "infraButton";
    a.style.marginLeft = "8px";
    alvo.appendChild(a);
  } catch {
    // Sem o item no menu desta tela: nada a injetar.
  }
}

async function iniciar(): Promise<void> {
  if (montando) return;
  montando = true;
  try {
    const ctx = lerContexto(pagina());
    const area = areaChrome(chrome.storage.local, "local");
    const sync = areaChrome(chrome.storage.sync, "sync");
    const numerar = await lerNumeracao(area);
    const dialogos = criarDialogos({ css: cssDialogos });
    const avisos = criarAvisos({ css: cssAvisos });
    const sessao = { http: criarHttp(location.href), linkMenu: (acao: string) => linkDoMenu(pagina(), acao) };
    try {
      const desmontar = await montar({
        doc: document,
        url: location.href,
        area,
        sync,
        ident: { host: ctx.host, unidade: ctx.unidade.id },
        contexto: {
          login: ctx.usuario.login,
          nome: ctx.usuario.nome,
          unidade: { id: ctx.unidade.id, sigla: ctx.unidade.sigla },
        },
        lerItens: () => lerItensDaUnidade(sessao),
        armazem: () => armazemDoTexto(document, location.href),
        perguntar: (texto, ok, nao) => dialogos.perguntar(texto, ok, nao),
        pedirTexto: (rotulo, inicial) => dialogos.pedirTexto(rotulo, inicial),
        confirmar: (texto) => dialogos.confirmar(texto),
        escolherPasta: (pastas, atual, numerar) => dialogos.escolherPasta(pastas, atual, numerar),
        avisar: (texto, acao) => avisos.avisar(texto, acao),
        idDispositivo: await idDispositivo(area),
        cssPainel,
        numerar,
        intencao: areaDaIntencao(),
        janela: window,
        docEventos: document,
        travar: travarComLocks,
        travarEsperando,
      });
      desfazer = () => {
        desmontar();
        dialogos.destruir();
        avisos.destruir();
      };
    } catch (e) {
      dialogos.destruir();
      avisos.destruir();
      throw e;
    }
  } finally {
    montando = false;
  }
}

/** Na tela de cadastro, mostra o destino da intenção antes de criar (só UI). */
async function mostrarFaixa(): Promise<void> {
  const ctx = lerContexto(pagina());
  const area = areaDaIntencao();
  const intencao = await lerIntencao(area, { host: ctx.host, unidade: ctx.unidade.id });
  if (!intencao) return;
  const form =
    document.querySelector<HTMLFormElement>("#frmBaseConhecimentoCadastro") ??
    document.querySelector<HTMLFormElement>("#divInfraAreaTelaD form");
  if (!form) return;
  const faixa = montarFaixaDestino(document, intencao, () => {
    void limparIntencao(area);
  });
  form.insertBefore(faixa.raiz, form.firstChild);
}

/** A intenção é da aba: sessionStorage (duas abas do SEI não compartilham a intenção). */
function areaDaIntencao(): Area {
  try {
    return areaDaAba(window.sessionStorage);
  } catch {
    return areaMemoria();
  }
}

async function partir(): Promise<void> {
  const tela = telaAtual();
  if (!tela) return;
  if (tela === "pesquisar") {
    injetarAtalho();
    return;
  }

  let ligada = true;
  try {
    ligada = await lerOpcaoLegada(OPCAO);
  } catch {
    ligada = true;
  }

  if (tela === "cadastrar") {
    if (ligada) await mostrarFaixa().catch((e) => console.warn("[SEI Pro] base-conhecimento:", e));
    return;
  }

  if (ligada) await iniciar().catch((e) => console.warn("[SEI Pro] base-conhecimento:", e));

  chrome.storage.onChanged.addListener((m, area) => {
    if (area !== "sync" || !("dataValues" in m)) return;
    const agora = opcaoLegadaLigada(m.dataValues?.newValue, OPCAO);
    if (!agora) {
      desfazer?.();
      desfazer = null;
    } else if (!desfazer) {
      void iniciar().catch((e) => console.warn("[SEI Pro] base-conhecimento:", e));
    }
  });

  // Numeração: só apresentação, por navegador (chrome.storage.local). Trocar a
  // preferência remonta a tela; a árvore volta ao estado padrão.
  chrome.storage.onChanged.addListener((m, area) => {
    if (area !== "local" || !(CHAVE_NUMERAR in m) || !desfazer) return;
    desfazer();
    desfazer = null;
    void iniciar().catch((e) => console.warn("[SEI Pro] base-conhecimento:", e));
  });
}

// Marca cedo (document_start) e só age quando o DOM existe: a leitura do menu e
// da tabela depende da página pronta.
document.documentElement.setAttribute(MARCA, "");
quandoDomPronto(document, () => {
  void partir();
});
