/**
 * Entrada de html/demandas.html. Liga o app ao navegador: <dialog>, download, seletor de arquivo e a ponte com a aba do
 * SEI. Modos, pelo hash da URL:
 * - embutido (padrão): iframe abaixo da lista do Controle de Processos, ligado à PRÓPRIA aba (o content script conecta
 *   a cada carga do iframe). O app só LÊ e grava no storage.local; o SEI é da aba (a sincronia dos Textos Padrão e o
 *   "Sincronizar agora" passam por RPC). A `Colaboracao` (faixas, "Entendi", diálogos, cópias diárias e o arquivo
 *   ligado onde o navegador deixa) vive aqui. Segue o tema do SEI (data-tema, --spro-cor-sei);
 * - lateral: a aba "Demandas" do painel lateral, ligada à aba do SEI da frente nesta janela pela unidade
 *   (host|login|unidade): remonta ao trocar de unidade (`lateral/montagem.ts`) com a Agenda e a mesma colaboração
 *   (`lateral/criar.ts`). Segue o tema do sistema, como os Favoritos;
 * - pagina: sem aba (provas e abrir em tela cheia): o contexto vem do hash `#modo=pagina&host=...&login=...&unidade=...`
 *   e as chamadas à aba (usuários, processos, sincronizar) não existem.
 */

import { areaChrome } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { hojeISO } from "@comum/datas/dias";
import { novoId } from "@comum/id";
import { observarAltura } from "@comum/painel/altura";
import { emissorDeAvisoPelaPagina } from "@comum/painel/aviso";
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import { PonteLateral } from "@comum/ponte/lateral";
import type { PortaRpc, Rpc } from "@comum/ponte/rpc";
import { temSeletorDeArquivo } from "@comum/sincronia/arquivo";
import { acompanharTemaDoPainel, aplicarTemaDoContexto } from "@comum/tema/painel";
import { avisar, definirEmissorDeAviso } from "@comum/ui/aviso";
import { baixar, criarAbrirModal, criarConfirmar } from "@comum/ui/dialogo";
import { h } from "@comum/ui/dom";
import { definirJanelaQueCresce } from "@comum/ui/flutuante";
import type { ProcessoDaCaixa, UsuarioDaUnidade } from "@projetos/ponte/tipos";
import { concluirEtapaDaDemanda, etapasAbertasDaUnidade, reposDosProjetos } from "../integracao/projetos";
import { CHAVE_LATERAL } from "../modelo/constantes";
import { escoposDaUnidade } from "../modelo/escopo";
import { lerOpcaoDemandas } from "../pagina/opcao";
import { CANAL_DEMANDAS, CANAL_LATERAL, type ContextoDemandas } from "../ponte/tipos";
import { gravarPreferencias, lerPreferencias } from "../preferencias";
import { RepositorioDemandas } from "../repositorio";
import { controleArquivo, copiasDasDemandas } from "../sincronia/arquivo";
import { estadoDasTabelas } from "../sincronia/orquestrador";
import { montarApp } from "./app";
import { escolherArquivoLocal } from "./arquivoLocal";
import { Colaboracao } from "./colaboracao";
import { criarAppDoLateral } from "./lateral/criar";
import { MontagemLateral } from "./lateral/montagem";
import { ancestraisDaExtensao, recusaDoModo } from "./modo";
import { pedidosDaAba } from "./pedidos";
import type { AppMontado } from "./tipos";

const html = document.documentElement;
const params = new URLSearchParams(location.hash.slice(1));
const modo = params.get("modo") ?? "embutido";
html.dataset.modo = modo;
const raiz = document.getElementById("app")!;

// O que a aba pede ao app (pílula do título): os tratadores entram na porta já; até o app ficar pronto, os pedidos
// esperam na fila.
const pedidos = pedidosDaAba();
// Embutido: o ouvinte da porta é registrado já, antes do `load` do iframe, que é quando o content script conecta.
const conexao = modo === "embutido" ? esperarConexaoDaAba(CANAL_DEMANDAS, pedidos.tratadores) : null;

const erro = (texto: string) => raiz.replaceChildren(h("p", { class: "dem-erro" }, texto));
const mostrarErro = (e: unknown) => erro(`Não foi possível abrir as demandas: ${e instanceof Error ? e.message : String(e)}`);

const recusa = recusaDoModo(modo, { noTopo: window.top === window, ancestraisSaoDaExtensao: ancestraisDaExtensao(location) });
if (recusa) erro(recusa);
else if (modo === "pagina") void iniciarPagina().catch(mostrarErro);
else if (modo === "lateral") void iniciarLateral().catch(mostrarErro);
else if (conexao) void iniciarEmbutido(conexao).catch(mostrarErro);
else erro("Este modo do painel ainda não está disponível.");

/** O que o app e a colaboração precisam do navegador, igual nos modos com e sem aba. */
async function ligar(
  ctx: ContextoDemandas,
  rpc: Pick<Rpc, "chamar">,
  modoDoApp: "embutido" | "pagina",
  extras: { sobreposicao?: Parameters<typeof criarAbrirModal>[0] },
) {
  const unidade = ctx.unidade;
  if (!unidade) throw new Error("Abra o SEI numa unidade para ver as demandas.");
  const area = areaChrome(chrome.storage.local, "local");
  const dispositivo = await idDispositivo(area);
  const carimbo = () => ({ agora: Date.now(), dispositivo, por: ctx.login, nome: ctx.nome });
  const esc = escoposDaUnidade(ctx.host, ctx.login, unidade.id);
  const repos = { unidade: new RepositorioDemandas(area, esc.unidade, carimbo), eu: new RepositorioDemandas(area, esc.eu, carimbo) };
  const reposProjetos = reposDosProjetos(area, ctx, unidade.id, carimbo);
  const abrirModal = criarAbrirModal(extras.sobreposicao);
  const confirmar = criarConfirmar(abrirModal);
  const colab = new Colaboracao({
    repos,
    area,
    sync: areaChrome(chrome.storage.sync, "sync"),
    rpc,
    contexto: ctx,
    hoje: () => hojeISO(),
    agora: () => Date.now(),
    carimbo,
    abrirModal,
    confirmar,
    baixar,
    // O próprio arquivo (o tamanho é conferido antes de ler o JSON).
    escolherArquivo: () => escolherArquivoLocal(),
    copias: typeof indexedDB === "undefined" ? null : copiasDasDemandas(),
    // Dentro do iframe o Chrome pode recusar o seletor: o diálogo Sincronização explica.
    arquivo: temSeletorDeArquivo(window) ? controleArquivo(area, { host: ctx.host, login: ctx.login }, carimbo) : null,
    avisar,
  });
  // Nada da colaboração impede o app de abrir: uma falha ao iniciar só vai ao console.
  await colab.iniciar().catch((e: unknown) => console.warn("[SEI Pro] demandas: a colaboração não iniciou:", e));
  let app: AppMontado;
  try {
    app = await montarApp({
      raiz,
      repos,
      contexto: ctx,
      modo: modoDoApp,
      hoje: () => hojeISO(),
      usuarios: () => rpc.chamar<UsuarioDaUnidade[]>("usuarios", undefined, 60_000).catch(() => []),
      processosDaCaixa: () => rpc.chamar<ProcessoDaCaixa[]>("processosDaCaixa").catch(() => []),
      // Vínculo opcional com as etapas do Gestor de Projetos (lidas do storage; "Concluir também a etapa?" grava lá).
      etapasDoProjetos: () => etapasAbertasDaUnidade(reposProjetos),
      concluirEtapa: (ref) => concluirEtapaDaDemanda(reposProjetos, ref, hojeISO()),
      tabelas: () => estadoDasTabelas(area, [esc.unidade, esc.eu]),
      preferencias: { ler: () => lerPreferencias(area), gravar: (p) => gravarPreferencias(area, p) },
      area,
      abrirModal,
      confirmar,
      abrirProcesso: (protocolo, idProcedimento) =>
        void rpc.chamar("abrirProcesso", { id: idProcedimento ?? "", protocolo, novaAba: false }).catch(() => undefined),
      colaboracao: colab,
    });
  } catch (e) {
    // O app não abriu: a colaboração não fica ligada (ouvintes, arquivo ligado) sem ninguém que a desligue.
    colab.destruir();
    throw e;
  }
  const aoFocar = () => colab.aoGanharFoco();
  addEventListener("focus", aoFocar);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && aoFocar());
  addEventListener("pagehide", () => {
    app.destruir();
    colab.destruir();
  });
  let espera: ReturnType<typeof setTimeout> | undefined;
  addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(() => app.aoRedimensionar(), 200);
  });
  return app;
}

async function iniciarEmbutido(conectar: Promise<Rpc>): Promise<void> {
  const rpc = await conectar;
  const ctx = await rpc.chamar<ContextoDemandas>("contexto");
  if (!ctx.unidade) {
    erro("Abra o SEI numa unidade para ver as demandas.");
    return;
  }
  // Painel abaixo da lista: segue o SEI (modo noturno do SEI Pro e a cor da barra do sistema).
  html.dataset.tema = ctx.temaEscuro ? "escuro" : "claro";
  if (ctx.corTema) {
    html.style.setProperty("--spro-cor-sei", ctx.corTema);
    html.dataset.corSei = "";
  }
  acompanharTemaDoPainel(document, {
    aoDesligar: async () => aplicarTemaDoContexto(html, await rpc.chamar<ContextoDemandas>("contexto")),
  });
  const altura = observarAltura(rpc);
  // A lista de um seletor ou menu aberto perto do fim do painel: o iframe cresce até ela caber.
  addEventListener("spro-popover", (ev) => altura.extra(Number((ev as CustomEvent<{ fundo?: number }>).detail?.fundo) || 0));
  definirJanelaQueCresce(() => html.dataset.sobreposto !== "sim");
  // Diálogo no meio da tela visível: a aba põe o iframe por cima de tudo enquanto há diálogo aberto.
  const sobrepor = sobreposicaoNoApp(rpc, altura);
  // Aviso no rodapé da TELA do SEI (o do iframe ficaria lá embaixo, fora da vista).
  definirEmissorDeAviso(emissorDeAvisoPelaPagina(rpc));
  const app = await ligar(ctx, rpc, "embutido", { sobreposicao: { aoAbrir: sobrepor.abrir, aoFechar: sobrepor.fechar } });
  pedidos.pronto(app);
}

/** Sem aba do SEI: o contexto vem do hash; usuários, processos e sincronia não existem aqui. */
async function iniciarPagina(): Promise<void> {
  const host = params.get("host") ?? "";
  const login = (params.get("login") ?? "").toLowerCase();
  const id = params.get("unidade") ?? "";
  if (!host || !login || !id) {
    erro("Endereço incompleto: use #modo=pagina&host=...&login=...&unidade=...");
    return;
  }
  const ctx: ContextoDemandas = {
    host,
    login,
    nome: params.get("nome") ?? login,
    unidade: { id, sigla: params.get("sigla") ?? id, nome: params.get("sigla") ?? id },
    versao: "",
    temaEscuro: false,
  };
  html.dataset.tema = "claro";
  const semAba: Pick<Rpc, "chamar"> = {
    chamar: async () => {
      throw new Error("Abra as Demandas pelo Controle de Processos do SEI para usar esta função.");
    },
  };
  await ligar(ctx, semAba, "pagina", {});
}

async function iniciarLateral(): Promise<void> {
  acompanharTemaDoPainel(document);
  // Painel lateral: claro ou escuro conforme o sistema (prefers-color-scheme), sem o `data-tema` do SEI.
  // Como o content script: a opção "Gestor de Demandas" desligada, nada de demandas (nem anúncio às abas).
  if (!(await lerOpcaoDemandas())) {
    erro("As Demandas estão desligadas nas opções do SEI Pro (Demandas).");
    return;
  }
  const area = areaChrome(chrome.storage.local, "local");
  const dispositivo = await idDispositivo(area);
  let janela = -1;
  try {
    janela = (await chrome.windows.getCurrent()).id ?? -1;
  } catch {
    /* sidebar do Firefox: sem API de janelas, aceita qualquer aba */
  }
  const ponte = new PonteLateral({
    area,
    chave: CHAVE_LATERAL,
    janela,
    novoId: () => novoId(),
    ouvirConexoes: (cb) =>
      chrome.runtime.onConnect.addListener((porta) => {
        // As portas de outros canais (o painel embutido, os Favoritos, o agente) não são deste painel.
        if (porta.name === CANAL_LATERAL) cb(porta as unknown as PortaRpc, porta.sender ?? {});
      }),
  });
  const montagem = new MontagemLateral({
    raiz,
    ponte,
    criar: criarAppDoLateral({
      raiz,
      area,
      sync: areaChrome(chrome.storage.sync, "sync"),
      abrirModal: criarAbrirModal(),
      baixar,
      // O próprio arquivo (o tamanho é conferido antes de ler o JSON).
      escolherArquivo: () => escolherArquivoLocal(),
      hoje: () => hojeISO(),
      agora: () => Date.now(),
      dispositivo,
      copias: typeof indexedDB === "undefined" ? null : copiasDasDemandas(),
      // No lateral o seletor de arquivo funciona (no iframe do painel embutido o Chrome pode recusar).
      arquivo: (ctx, carimbo) =>
        temSeletorDeArquivo(window) ? controleArquivo(area, { host: ctx.host, login: ctx.login }, carimbo) : null,
    }),
  });
  montagem.iniciar();
  await ponte.iniciar();
  addEventListener("pagehide", () => void ponte.encerrar());
  // O arquivo ligado pode ter sido mudado por outro computador enquanto o painel estava escondido.
  addEventListener("focus", () => montagem.aoGanharFoco());
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && montagem.aoGanharFoco());
  // As abas que já estão abertas conectam ao ver o anúncio; se nenhuma vier, avisa.
  setTimeout(() => void montagem.reagir(), 1500);
}
