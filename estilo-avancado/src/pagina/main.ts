/**
 * Content script do Estilo Avançado (mundo isolado, todos os frames, document_start).
 * Aplica o tema na primeira pintura pelo espelho síncrono, confirma pelo chrome.storage.sync
 * e acompanha mudanças (opções, esquema do sistema) sem recarregar a página.
 */

import { CHAVE_TEMA, type ConfigTema, esquemaResolvido, normalizarConfig } from "@comum/tema/config";
import baseCss from "../../estatico/base.css";
import cascaCss from "../../estatico/casca.css";
import controlesCss from "../../estatico/controles.css";
import { gerarCssIcones, gerarCssMenuPro } from "../icones/css";
import { gravarTema } from "../opcoes/gravar";
import { aplicarTema } from "./aplicar";
import { gravarCache, lerCache } from "./cache";
import { iniciarDicas } from "./dicas";
import { iniciarRemapeamento } from "./documentos";
import { sincronizarEditorComEstilo } from "./editorSincronia";
import { iniciarBotaoLargura, iniciarLarguraDoPapel } from "./largura";
import { abrirModalAparencia } from "./modal";
import { iniciarNavbarCompacta } from "./navbar";
import { ativarNovoControleNaAba } from "./novoControle";
import { iniciarRespiro } from "./respiro";

const iconesCss = `${gerarCssIcones()}\n${gerarCssMenuPro()}`;
const global = window as unknown as { __seiProEstilo2?: boolean };

if (!global.__seiProEstilo2) {
  global.__seiProEstilo2 = true;

  // Marca que o Estilo Avancado existe neste pacote: o interruptor e a paleta da barra do SEI (sei-pro-all.js)
  // passam a controla-lo, e o estilo antigo (localStorage.seiSlim) fica desativado. Roda antes dos scripts do legado.
  document.documentElement.setAttribute("data-spro-estilo2", "");
  try {
    localStorage.removeItem("seiSlim");
  } catch {}

  const consulta = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  let cfg: ConfigTema | null = null;

  // Telas que so mostram o corpo de um documento (leitura): so la o remapeamento de cores roda.
  // O editor e a edicao ficam de fora: o que ele grava nao pode carregar cor adaptada.
  const ehDocumentoDeLeitura = /[?&]acao=(documento_visualizar|documento_imprimir_web)\b/.test(location.search);
  let pararRemapeamento: (() => void) | null = null;
  let pararDicas: (() => void) | null = null;
  let pararRespiro: (() => void) | null = null;
  // A tela que embute o documento (e tem "Abrir documento em nova aba"): so ela ganha o botao de largura.
  const ehTelaDeVisualizacao = /[?&]acao=arvore_visualizar\b/.test(location.search);
  let pararNavbar: (() => void) | null = null;
  let pararLargura: (() => void) | null = null;
  let pararBotaoLargura: (() => void) | null = null;

  /** O interruptor da barra do SEI acompanha o estado (ele e criado depois, pelo legado). */
  const sincronizarInterruptor = () => {
    const caixa = document.getElementById("changeSlimPro") as HTMLInputElement | null;
    if (caixa && cfg) caixa.checked = cfg.ativo;
  };

  const reaplicar = () => {
    if (!cfg) return;
    sincronizarEditorComEstilo(localStorage, cfg.ativo);
    sincronizarInterruptor();
    const sistemaEscuro = consulta?.matches ?? false;
    aplicarTema(document, cfg, sistemaEscuro, `${baseCss}\n${cascaCss}\n${controlesCss}\n${iconesCss}`);
    // O documento de leitura ganha o visual de papel sobre uma tela cinza (o CSS fica em controles.css).
    if (ehDocumentoDeLeitura && cfg.ativo) document.documentElement.setAttribute("data-spro-papel", "");
    else document.documentElement.removeAttribute("data-spro-papel");
    const querRemapear = ehDocumentoDeLeitura && cfg.ativo && cfg.escurecerDocumentos && esquemaResolvido(cfg, sistemaEscuro) === "escuro";
    // Respiro dos formularios internos: so com o tema ativo (desligar devolve a altura original).
    if (cfg.ativo && !pararRespiro) pararRespiro = iniciarRespiro(document);
    else if (!cfg.ativo && pararRespiro) {
      pararRespiro();
      pararRespiro = null;
    }
    // Largura do documento (papel estreito ou total): o documento aplica; a tela de fora tem o botão.
    if (cfg.ativo && ehDocumentoDeLeitura && !pararLargura) pararLargura = iniciarLarguraDoPapel(document, localStorage);
    else if (!cfg.ativo && pararLargura) {
      pararLargura();
      pararLargura = null;
    }
    if (cfg.ativo && ehTelaDeVisualizacao && !pararBotaoLargura) {
      const ligar = () => {
        if (pararBotaoLargura === null) return;
        pararBotaoLargura = iniciarBotaoLargura(document, localStorage);
      };
      pararBotaoLargura = () => {};
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligar, { once: true });
      else ligar();
    } else if (!cfg.ativo && pararBotaoLargura) {
      pararBotaoLargura();
      pararBotaoLargura = null;
    }
    // Barra superior mais alta no topo e normal ao rolar (so com o tema ativo).
    if (cfg.ativo && !pararNavbar) pararNavbar = iniciarNavbarCompacta(document);
    else if (!cfg.ativo && pararNavbar) {
      pararNavbar();
      pararNavbar = null;
    }
    // Tooltips da casca: só com o tema ativo (desligar devolve cada title).
    if (cfg.ativo && !pararDicas) {
      const ligarDicas = () => {
        if (pararDicas === null) return;
        pararDicas = iniciarDicas(document);
      };
      pararDicas = () => {};
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligarDicas, { once: true });
      else ligarDicas();
    } else if (!cfg.ativo && pararDicas) {
      pararDicas();
      pararDicas = null;
    }
    if (querRemapear && !pararRemapeamento) {
      const ligar = () => {
        if (pararRemapeamento === null) return;
        pararRemapeamento = iniciarRemapeamento(document, { botao: true });
      };
      pararRemapeamento = () => {};
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligar, { once: true });
      else ligar();
    } else if (!querRemapear && pararRemapeamento) {
      pararRemapeamento();
      pararRemapeamento = null;
    }
  };

  cfg = lerCache(localStorage);
  reaplicar();

  consulta?.addEventListener("change", reaplicar);

  let primeiraLeitura = true;
  const receber = (valor: unknown) => {
    const anterior = cfg;
    cfg = normalizarConfig(valor);
    gravarCache(localStorage, cfg);
    reaplicar();
    // Virou de desligado para ligado (e não é só a leitura inicial): o Novo Controle de Processos entra junto.
    if (!primeiraLeitura && !anterior?.ativo && cfg.ativo && window === window.top) ativarNovoControleNaAba(document, localStorage);
    primeiraLeitura = false;
  };

  chrome.storage.sync
    .get(CHAVE_TEMA)
    .then((r) => receber(r[CHAVE_TEMA]))
    .catch((e) => console.warn("[SEI Pro] estilo avancado 2:", e));

  const deps = {
    ler: async () => (await chrome.storage.sync.get(CHAVE_TEMA))[CHAVE_TEMA],
    gravar: gravarTema,
    sistemaEscuro: () => consulta?.matches ?? false,
  };
  // Eventos do interruptor e da paleta da barra do SEI (disparados no mundo da pagina, ouvidos aqui).
  document.addEventListener("spro-estilo2-alternar", () => {
    const atual = normalizarConfig(cfg);
    void deps.gravar({ ...atual, ativo: !atual.ativo });
    receber({ ...atual, ativo: !atual.ativo });
  });
  document.addEventListener("spro-estilo2-paleta", () => void abrirModalAparencia(document, deps));
  // O interruptor so existe depois que o legado monta a barra: confere quando a pagina termina de carregar.
  window.addEventListener("load", () => setTimeout(sincronizarInterruptor, 1500));

  chrome.storage.onChanged.addListener((mudancas, area) => {
    if (area === "sync" && mudancas[CHAVE_TEMA]) receber(mudancas[CHAVE_TEMA].newValue);
  });
}
