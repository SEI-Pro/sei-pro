/**
 * Entrada de html/favoritos.html. Liga o app ao navegador: <dialog>, download,
 * área de transferência, seletor de arquivo e a ponte com o SEI.
 *
 * Dois modos, pelo hash da URL:
 * - embutido (padrão): iframe abaixo da lista, ligado à PRÓPRIA aba;
 * - lateral (`#modo=lateral`): dentro do painel lateral, ligado à aba do SEI
 *   que está na frente nesta janela, e remontado quando ela é de outra unidade.
 */

import type { Area } from "@comum/armazenamento/area";
import { areaChrome } from "@comum/armazenamento/area";
import { idDispositivo } from "@comum/armazenamento/dispositivo";
import { hojeISO } from "@comum/datas/dias";
import { novoId } from "@comum/id";
import { observarAltura } from "@comum/painel/altura";
import { emissorDeAvisoPelaPagina } from "@comum/painel/aviso";
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
import { esperarConexaoDaAba } from "@comum/ponte/conexaoDaAba";
import { PonteLateral } from "@comum/ponte/lateral";
import { ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import { escolherArquivoSync } from "@comum/sincronia/arquivo";
import { acompanharTemaDoPainel, aplicarTemaDoContexto } from "@comum/tema/painel";
import { definirEmissorDeAviso } from "@comum/ui/aviso";
import { baixar, criarAbrirModal, criarConfirmar, escolherArquivo } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import { definirJanelaQueCresce } from "@comum/ui/flutuante";
import { CANAL_FAVORITOS, CANAL_LATERAL, CHAVE_LATERAL } from "../modelo/constantes";
import { chaveDoContexto, escoposDoContexto } from "../modelo/escopo";
import { temPainelLateral } from "../modelo/exibicao";
import type { Carimbo, ContextoAba } from "../modelo/tipos";
import { RepositorioFavoritos } from "../repositorio";
import { CHAVE_CONTADOR } from "../shell/painel";
import { ControleArquivo, handlesNoIndexedDB, temSeletorDeArquivo } from "../sincronia/arquivoSync";
import { copiasNoIndexedDB } from "../sincronia/copias";
import { AppFavoritos } from "./app";
import { carregarLeaflet } from "./mapa";

const lateral = new URLSearchParams(location.hash.slice(1)).get("modo") === "lateral";
document.documentElement.dataset.modo = lateral ? "lateral" : "embutido";
const raiz = document.getElementById("app")!;

// Embutido: o ouvinte da porta é registrado já, antes do `load` do iframe, que é quando o content script conecta.
const conexao = lateral ? null : esperarConexaoDaAba(CANAL_FAVORITOS);

const mostrarErro = (e: unknown) =>
  raiz.replaceChildren(
    h("p", { class: "fav-erro" }, `Não foi possível abrir os monitorados: ${e instanceof Error ? e.message : String(e)}`),
  );

void (lateral ? iniciarLateral() : iniciarEmbutido()).catch(mostrarErro);

// O arquivo da nuvem pode ter mudado em outro computador enquanto o app estava escondido.
let appAtual: AppFavoritos | null = null;
addEventListener("focus", () => appAtual?.aoGanharFoco());
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && appAtual?.aoGanharFoco());

interface Base {
  area: Area;
  sync: Area;
  carimbo: () => Carimbo;
}

async function base(): Promise<Base> {
  const area = areaChrome(chrome.storage.local, "local");
  const sync = areaChrome(chrome.storage.sync, "sync");
  const dispositivo = await idDispositivo(area);
  return { area, sync, carimbo: () => ({ agora: Date.now(), dispositivo }) };
}

async function iniciarEmbutido(): Promise<void> {
  const rpc = await conexao!;
  const ctx = await rpc.chamar<ContextoAba>("contexto");
  const b = await base();
  const altura = observarAltura(rpc);
  // A lista de um seletor ou menu aberto perto do fim do painel: o iframe cresce até ela caber.
  addEventListener("spro-popover", (ev) => altura.extra(Number((ev as CustomEvent<{ fundo?: number }>).detail?.fundo) || 0));
  // O iframe cresce com o conteúdo: listas abrem para baixo. Com diálogo sobreposto, a janela é a tela e não cresce.
  definirJanelaQueCresce(() => document.documentElement.dataset.sobreposto !== "sim");
  // Diálogo no meio da tela visível: a aba põe o iframe por cima de tudo enquanto há diálogo aberto.
  const sobrepor = sobreposicaoNoApp(rpc, altura);
  // Aviso no rodapé da TELA do SEI (o do iframe ficaria lá embaixo, fora da vista); com diálogo aberto, aqui mesmo.
  definirEmissorDeAviso(emissorDeAvisoPelaPagina(rpc));
  const app = criarApp(b, ctx, rpc, {
    embutido: true,
    aoAbrirModal: sobrepor.abrir,
    aoFecharModal: sobrepor.fechar,
    aoRedesenhar: () => altura.medir(),
  });
  appAtual = app;
  await app.iniciar();
}

async function iniciarLateral(): Promise<void> {
  const b = await base();
  let janela = -1;
  try {
    janela = (await chrome.windows.getCurrent()).id ?? -1;
  } catch {
    /* sidebar do Firefox: sem API de janelas, aceita qualquer aba */
  }
  const ponte = new PonteLateral({
    area: b.area,
    chave: CHAVE_LATERAL,
    janela,
    novoId: () => novoId(),
    ouvirConexoes: (cb) =>
      chrome.runtime.onConnect.addListener((porta) => {
        // Portas de outros canais (o app embutido, o agente) não são deste painel: não se mexe nelas.
        if (porta.name === CANAL_LATERAL) cb(porta as unknown as PortaRpc, porta.sender ?? {});
      }),
  });
  let montado: { chave: string; app: AppFavoritos } | null = null;
  // O rpc fala com uma aba DA UNIDADE da lista montada (a da frente, se for dela): trocar de aba
  // na mesma unidade não remonta nada, e um pedido nunca vai para outro SEI ou outra unidade.
  const rpc: Pick<Rpc, "chamar"> = {
    chamar: <T>(op: string, args?: unknown, prazo?: number) => {
      const a = ponte.daChave(montado?.chave ?? "");
      return a
        ? a.rpc.chamar<T>(op, args, prazo)
        : Promise.reject(
            new ErroRpc("SEM_ABA", "A aba do SEI desta lista não está mais aberta nesta janela. Abra o SEI na unidade e tente de novo."),
          );
    },
  };
  let fila = Promise.resolve();
  const esperando = h(
    "div",
    { class: "fav-sem-aba" },
    icone("alvo", 28),
    h("p", {}, "Abra o SEI nesta janela para ver seus monitorados."),
    h("p", { class: "fav-dica" }, "Se o SEI já está aberto e nada aparece, recarregue a página dele (F5)."),
  );
  const reagir = () => {
    fila = fila
      .then(async () => {
        const a = ponte.atual();
        const chave = a?.chave ?? "";
        if (montado && montado.chave === chave) return;
        montado?.app.destruir();
        montado = null;
        if (!a) {
          raiz.replaceChildren(esperando);
          return;
        }
        const ctx = await a.rpc.chamar<ContextoAba>("contexto");
        // A aba pode ter mudado enquanto o contexto chegava: a próxima volta da fila corrige.
        if (chaveDoContexto(ctx) !== chave) return;
        const app = criarApp(b, ctx, rpc, { aoContar: (n) => void b.area.gravar({ [CHAVE_CONTADOR]: n }).catch(() => undefined) });
        montado = { chave, app };
        appAtual = app;
        await app.iniciar();
      })
      .catch(mostrarErro);
  };
  raiz.replaceChildren(h("p", { class: "fav-dica" }, "Procurando o SEI nesta janela…"));
  ponte.aoMudar(reagir);
  await ponte.iniciar();
  addEventListener("pagehide", () => void ponte.encerrar());
  // As abas que já estão abertas conectam ao ver o anúncio; se nenhuma vier, avisa.
  setTimeout(reagir, 1500);
}

interface Ganchos {
  /** Painel abaixo da lista: segue o tema do SEI. O lateral segue o sistema. */
  embutido?: boolean;
  aoContar?: (n: number) => void;
  aoAbrirModal?: () => void;
  aoFecharModal?: () => void;
  aoRedesenhar?: () => void;
}

function criarApp(b: Base, ctx: ContextoAba, rpc: Pick<Rpc, "chamar">, g: Ganchos): AppFavoritos {
  const html = document.documentElement;
  if (g.embutido) {
    html.dataset.tema = ctx.temaEscuro ? "escuro" : "claro";
    if (ctx.corTema) {
      html.style.setProperty("--spro-cor-sei", ctx.corTema);
      html.dataset.corSei = "";
    }
  } else {
    // Painel lateral: claro ou escuro conforme o sistema (prefers-color-scheme).
    delete html.dataset.tema;
    delete html.dataset.corSei;
  }
  // Estilo Avançado 2 (quando ligado): o tema e o destaque dele valem em todos os modos e mudam ao vivo.
  acompanharTemaDoPainel(
    document,
    g.embutido ? { aoDesligar: async () => aplicarTemaDoContexto(html, await rpc.chamar<ContextoAba>("contexto")) } : {},
  );
  const esc = escoposDoContexto(ctx);
  const repos = {
    unidade: esc.unidade ? new RepositorioFavoritos(b.area, esc.unidade, b.carimbo) : null,
    pessoal: new RepositorioFavoritos(b.area, esc.pessoal, b.carimbo),
  };

  // Com o painel embutido, o diálogo põe o iframe por cima da tela (aoAbrirModal/aoFecharModal).
  const abrirModal = criarAbrirModal({ aoAbrir: g.aoAbrirModal, aoFechar: g.aoFecharModal });
  const confirmar = criarConfirmar(abrirModal);

  return new AppFavoritos(raiz, {
    rpc,
    ctx,
    area: b.area,
    sync: b.sync,
    repos,
    carimbo: b.carimbo,
    abrirModal,
    confirmar,
    baixar,
    copiar: (texto) => navigator.clipboard.writeText(texto),
    escolherArquivo: () => escolherArquivo(),
    hoje: () => hojeISO(),
    aoRedesenhar: g.aoRedesenhar,
    aoContar: g.aoContar,
    limitarAltura: !lateral,
    lateralDisponivel: temPainelLateral(chrome.runtime.getManifest()),
    carregarMapa: () => carregarLeaflet(document, (c) => `../${c}`),
    copias: copiasNoIndexedDB(),
    arquivo: temSeletorDeArquivo(window)
      ? new ControleArquivo({
          area: b.area,
          dono: { host: ctx.host, login: ctx.login.toLowerCase() },
          handles: handlesNoIndexedDB(),
          carimbo: b.carimbo,
          // Um arquivo por SEI e usuário: dois SEIs no mesmo arquivo funcionam, mas cada um fica mais simples sozinho.
          escolher: (modo) =>
            escolherArquivoSync(modo, `favoritos-seipro-${ctx.login.toLowerCase()}-${ctx.host}.json`, "Monitorados do SEI Pro"),
        })
      : null,
  });
}
