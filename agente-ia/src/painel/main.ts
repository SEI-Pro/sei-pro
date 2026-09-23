/**
 * Painel lateral do Agente de IA.
 *
 * Guarda a chave do OpenRouter em `chrome.storage.local` (só neste navegador,
 * nunca sincronizada, nunca no mundo da página do SEI) e a conversa em
 * `chrome.storage.session` (some ao fechar o navegador; acessível só a
 * páginas da extensão — content scripts não leem a área de sessão).
 *
 * Telas: só uma. A conversa é a tela; a configuração é um <dialog> modal por
 * cima dela (na primeira vez, sem como fechar antes de salvar a chave).
 */

import { Pseudonimos } from "@nucleo/privacidade/anonimizar";
import { Motor, type TelaAtual } from "../motor/motor";
import { promptSistema } from "../motor/prompt";
import { COMPATIVEIS, conferirChave, criarProvedor, listarModelos, MODELO_PADRAO, normalizarUrl, type Servico } from "../motor/provedor";
import { RegistroTools } from "../motor/tools";
import type { DecisaoPlano, InterfaceMotor, Mensagem, PlanoPrevisto, Tarefa, Uso } from "../motor/tipos";
import { PontePainel } from "../ponte/cliente";
import { TOOLS_MOTOR } from "../tools/motor";
import { TOOLS_SEI } from "../tools/sei";
import { duracao, formatarUso, h, icone, markdown, moeda } from "./dom";
import * as historico from "./historico";
import { cotacaoDolar, type Cotacao } from "./cambio";
import { sugestoesPara } from "./sugestoes";
import { extrairTextoPdf } from "./pdf";

interface Config {
  /** Mostrar o gasto em reais, pela cotação do dia. */
  reais: boolean;
  /** Guardar a transcrição das conversas neste navegador. */
  guardar: boolean;
  /** Dias de guarda (0 = para sempre). */
  dias: number;
  /** `openrouter` (padrão) ou um serviço que fale o protocolo da OpenAI. */
  servico: Servico;
  /** Endereço do serviço compatível (vazio no OpenRouter). */
  url: string;
  chave: string;
  modelo: string;
  nomes: boolean;
  cnpj: boolean;
}

type Item =
  /** `ms` (só na resposta do agente): quanto a rodada inteira demorou, do envio à resposta pronta. */
  | { tipo: "usuario" | "agente" | "aviso" | "erro" | "decisao"; texto: string; ms?: number }
  | { tipo: "tool"; rotulo: string; estado: "rodando" | "ok" | "falha"; detalhe?: string };

type ItemAgente = { tipo: "agente"; texto: string; ms?: number };

const CHAVE_CONFIG = "agenteIA_config";
const CHAVE_SESSAO = "agenteIA_conversa";

const PRIVACIDADE_CURTA =
  "Dados pessoais s\u00E3o mascarados antes de sair do navegador. Documentos restritos s\u00F3 com a sua autoriza\u00E7\u00E3o, sigilosos nunca, e toda altera\u00E7\u00E3o no SEI passa pela sua aprova\u00E7\u00E3o.";

const PRIVACIDADE =
  "Antes de qualquer texto sair do navegador, CPF, e-mail, telefone, endere\u00E7o, conta banc\u00E1ria, CID e outros dados pessoais s\u00E3o trocados por r\u00F3tulos como [CPF_1]. Documentos restritos s\u00F3 s\u00E3o lidos com a sua autoriza\u00E7\u00E3o; processos sigilosos nunca. Toda altera\u00E7\u00E3o no SEI precisa da sua aprova\u00E7\u00E3o.";

const RESPONSABILIDADE =
  "As respostas da IA podem conter erros, inclusive com apar\u00EAncia de certeza: confira antes de usar. O conte\u00FAdo de um documento assinado \u00E9 de responsabilidade do agente p\u00FAblico que o assina.";

/**
 * Verbos do indicador de "pensando". Todos falam de LER e RACIOCINAR: nenhum
 * pode parecer uma ação de escrita no SEI ("assinando", "tramitando"), que
 * faria o usuário achar que o agente está mexendo no processo sem ter pedido.
 */
const PENSANDO = [
  "Pensando", "Cogitando", "Ponderando", "Refletindo", "Raciocinando", "Matutando",
  "Ruminando", "Compulsando", "Folheando", "Cotejando", "Conferindo", "Catalogando",
  "Alinhavando", "Arrazoando", "Esmiu\u00E7ando", "Destrinchando", "Decifrando", "Interpretando",
  "Sistematizando", "Fundamentando", "Considerando", "Analisando", "Rascunhando", "Minutando",
  "Burilando", "Lapidando", "Deduzindo", "Concatenando", "Elucubrando", "Garimpando",
];


/** Marca do agente: o robô do SEI Pro, o mesmo ícone que abre o painel no SEI. */
const marca = (tamanho: number) =>
  h("img", { class: "logo", src: chrome.runtime.getURL("icons/menu/botpro_icon.svg"), alt: "", width: String(tamanho), height: String(tamanho) });

/** Tempo da rodada, no rodapé da resposta. */
function carimboDeTempo(ms: number): HTMLElement {
  return h("span", { class: "tempo-resposta", title: "Tempo entre o seu pedido e a resposta pronta" }, duracao(ms));
}

class App {
  private readonly raiz = document.getElementById("app")!;
  private readonly ponte = new PontePainel();
  private config: Config = { reais: true, guardar: true, dias: 30, servico: "openrouter", url: "", chave: "", modelo: MODELO_PADRAO, nomes: true, cnpj: false };
  private privacidade = new Pseudonimos();
  private motor: Motor | null = null;
  private transcricao: Item[] = [];
  private uso: Uso = { entrada: 0, saida: 0, custo: 0 };
  private tarefas: Tarefa[] = [];
  private anexo: { nome: string; texto: string } | null = null;
  private idConversa = crypto.randomUUID();
  /** Tela do SEI ao lado, para as sugestões combinarem com o que o usuário vê. */
  private tela: TelaAtual | null = null;
  private chaveTela = "";
  /** Cotação do dólar para o medidor; `null` enquanto não chega (ou sem rede). */
  private cambio: Cotacao | null = null;
  /** Conversa antiga aberta para leitura (sem como continuar: ver `historico.ts`). */
  private arquivada: historico.ConversaSalva | null = null;

  // elementos da tela
  private elConversa!: HTMLElement;
  private elAba!: HTMLElement;
  private elCusto!: HTMLElement;
  private elTarefas!: HTMLElement;
  private elEntrada!: HTMLTextAreaElement;
  private elEnviar!: HTMLButtonElement;
  private elAnexo!: HTMLElement;
  private elMenu!: HTMLElement;
  private elPensando!: HTMLElement;
  private tickPensando: ReturnType<typeof setInterval> | null = null;
  private bolhaAtual: { el: HTMLElement; texto: string; pendente: boolean; fechada?: boolean } | null = null;
  /** Última resposta fechada da rodada: recebe o carimbo de tempo no fim. */
  private ultimaResposta: { el: HTMLElement; item: ItemAgente } | null = null;
  private aoFimDoPlano: (() => void) | null = null;
  private toolsEl = new Map<string, { el: HTMLElement; item: Extract<Item, { tipo: "tool" }> }>();

  async iniciar(): Promise<void> {
    await this.ponte.iniciar();
    const salvo = (await chrome.storage.local.get(CHAVE_CONFIG))[CHAVE_CONFIG] as Partial<Config> | undefined;
    this.config = { ...this.config, ...salvo };
    this.ponte.aoMudar(() => this.atualizarAba());
    await this.telaConversa();
    void this.atualizarCambio();
    void historico.podar(this.config.dias).catch(() => undefined);
    if (!this.config.chave) this.abrirConfig(true);
  }

  // ------------------------------------------------------------- tela

  private async telaConversa(): Promise<void> {
    this.motor ??= this.criarMotor();
    this.elAba = h("span", { class: "aba" });
    this.elCusto = h("span", { class: "custo", title: "Gasto desta conversa (o servi\u00E7o de IA informa o custo; sem isso, os tokens)" });
    this.elTarefas = h("div", { class: "tarefas", hidden: true });
    this.elConversa = h("div", { class: "conversa", role: "log", "aria-live": "polite" });
    this.elEntrada = h("textarea", { rows: "2", placeholder: "Pe\u00E7a algo sobre o SEI...", "aria-label": "Mensagem" });
    this.elEnviar = h("button", { class: "enviar" });
    this.elAnexo = h("div", { class: "anexo", hidden: true });
    this.elMenu = h("div", { class: "menu", role: "menu", hidden: true });
    this.elPensando = h("div", { class: "pensando", role: "status" }, icone("estrela", 16), h("span", { class: "palavra" }), h("span", { class: "tempo" }));

    const arquivo = h("input", { type: "file", accept: ".csv,.txt,.md,.json,.tsv", class: "sr-only" });
    const anexar = h("button", { class: "icone", title: "Anexar planilha CSV ou texto", "aria-label": "Anexar arquivo" }, icone("clipe"));
    const sugerir = h("button", { class: "icone", title: "Sugest\u00F5es de pedido", "aria-label": "Sugest\u00F5es de pedido" }, icone("lampada"));

    anexar.addEventListener("click", () => arquivo.click());
    arquivo.addEventListener("change", async () => {
      const f = arquivo.files?.[0];
      if (!f) return;
      const bytes = new Uint8Array(await f.arrayBuffer());
      let texto: string;
      try {
        texto = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      } catch {
        texto = new TextDecoder("windows-1252").decode(bytes); // CSV do Excel
      }
      this.anexo = { nome: f.name, texto: texto.slice(0, 60_000) };
      this.elAnexo.hidden = false;
      this.elAnexo.replaceChildren(
        icone("clipe", 13),
        h("span", {}, `${f.name} \u2014 ${texto.length.toLocaleString("pt-BR")} caracteres`),
        h("button", { class: "icone pequeno", title: "Remover anexo", "aria-label": "Remover anexo", onclick: () => ((this.anexo = null), (this.elAnexo.hidden = true)) }, icone("fechar", 14)),
      );
      arquivo.value = "";
    });

    sugerir.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (this.elMenu.hidden) {
        this.elMenu.replaceChildren(
          ...sugestoesPara(this.tela, 8).map((a) => h("button", { role: "menuitem", onclick: () => ((this.elMenu.hidden = true), void this.enviar(a.prompt)) }, a.rotulo)),
        );
      }
      this.elMenu.hidden = !this.elMenu.hidden;
    });
    document.addEventListener("click", () => (this.elMenu.hidden = true));
    document.addEventListener("keydown", (ev) => ev.key === "Escape" && (this.elMenu.hidden = true));

    this.elEntrada.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        this.elEnviar.click();
      }
    });
    this.elEntrada.addEventListener("input", () => {
      this.elEntrada.style.height = "auto";
      this.elEntrada.style.height = `${Math.min(this.elEntrada.scrollHeight, 180)}px`;
      this.estadoEnvio();
    });
    this.elEnviar.addEventListener("click", () => {
      if (this.motor?.ocupado) this.motor.parar();
      else void this.enviar(this.elEntrada.value);
    });

    this.raiz.replaceChildren(
      h(
        "header",
        { class: "topo" },
        marca(28),
        h("span", { class: "marca" }, h("strong", {}, "Agente de IA"), h("span", {}, "SEI Pro")),
        this.elCusto,
        h("button", { class: "icone", title: "Conversas guardadas", "aria-label": "Conversas guardadas", onclick: () => void this.abrirHistorico() }, icone("relogio")),
        h("button", { class: "icone", title: "Nova conversa", "aria-label": "Nova conversa", onclick: () => void this.novaConversa() }, icone("mais")),
        h("button", { class: "icone", title: "Configura\u00E7\u00E3o", "aria-label": "Configura\u00E7\u00E3o", onclick: () => this.abrirConfig() }, icone("ajustes")),
      ),
      h(
        "div",
        { class: "barra" },
        this.elAba,
        h("span", { class: "selo-privacidade", title: PRIVACIDADE }, icone("escudo", 13), "protegido"),
      ),
      this.elTarefas,
      this.elConversa,
      h(
        "div",
        { class: "rodape" },
        this.elMenu,
        this.elAnexo,
        h(
          "div",
          { class: "caixa" },
          this.elEntrada,
          h("div", { class: "caixa-acoes" }, anexar, arquivo, sugerir, h("span", { class: "espaco" }, "Enter envia"), this.elEnviar),
        ),
        h("div", { class: "aviso-ia", title: RESPONSABILIDADE }, "A IA pode errar: confira as respostas antes de usar."),
      ),
    );
    await this.restaurarSessao();
    this.atualizarAba();
    this.redesenhar();
    this.elEntrada.focus();
  }

  /**
   * Indicador de trabalho em curso: fica no fim da conversa enquanto o modelo
   * pensa ou usa ferramentas, e sai quando a resposta começa a sair (ou quando
   * a vez é do usuário, num cartão de aprovação).
   */
  private pensar(ligado: boolean): void {
    if (!this.elPensando) return;
    if (!ligado) {
      if (this.tickPensando) clearInterval(this.tickPensando);
      this.tickPensando = null;
      this.elPensando.remove();
      return;
    }
    this.elConversa.append(this.elPensando); // sempre o último da conversa
    this.rolar();
    if (this.tickPensando) return;
    const palavra = this.elPensando.querySelector(".palavra")!;
    const tempo = this.elPensando.querySelector(".tempo")!;
    const sortear = () => (palavra.textContent = `${PENSANDO[Math.floor(Math.random() * PENSANDO.length)]}\u2026`);
    const desde = Date.now();
    sortear();
    tempo.textContent = "";
    this.tickPensando = setInterval(() => {
      const s = Math.round((Date.now() - desde) / 1000);
      tempo.textContent = `${s}s`;
      if (s % 4 === 0) sortear();
    }, 1000);
  }

  /**
   * Lê a tela do SEI ao lado quando ela muda (aba ou título diferentes) e, se a
   * conversa ainda não começou, redesenha as sugestões para combinarem com ela.
   */
  private async lerTelaDoSei(): Promise<void> {
    const aba = this.ponte.atual();
    const chave = aba ? `${aba.id}|${aba.contexto ?? aba.titulo}` : "";
    if (chave === this.chaveTela) return;
    this.chaveTela = chave;
    this.tela = aba ? ((await this.ponte.executar("tela", {}).catch(() => null)) as TelaAtual | null) : null;
    if (this.tela) this.tela.editores = this.ponte.editores();
    if (!this.transcricao.length && !this.arquivada) this.redesenhar();
  }

  /** Busca a cotação do dia (uma vez por sessão, com cache de 6 h no storage). */
  private async atualizarCambio(): Promise<void> {
    if (!this.config.reais) {
      this.cambio = null;
      this.mostrarUso();
      return;
    }
    this.cambio = await cotacaoDolar().catch(() => null);
    this.mostrarUso();
  }

  /** Medidor do cabeçalho: valor e, no title, de onde ele veio. */
  private mostrarUso(): void {
    if (!this.elCusto) return;
    const uso = this.arquivada?.uso ?? this.uso;
    this.elCusto.textContent = formatarUso(uso, this.cambio);
    this.elCusto.title = uso.custo
      ? this.cambio
        ? `Gasto desta conversa: ${moeda(uso.custo)} \u00B7 c\u00E2mbio ${this.cambio.valor.toLocaleString("pt-BR", { minimumFractionDigits: 4 })} (${this.cambio.fonte}, ${this.cambio.dia})`
        : `Gasto desta conversa informado pelo servi\u00E7o de IA`
      : "Tokens desta conversa (o servi\u00E7o de IA n\u00E3o informa custo)";
  }

  private atualizarAba(): void {
    if (!this.elAba) return;
    void this.lerTelaDoSei();
    const aba = this.ponte.atual();
    this.elAba.replaceChildren(
      h("span", { class: `ponto${aba ? " on" : ""}` }),
      aba ? `${aba.host} \u2014 ${aba.titulo.replace(/^SEI\s*-\s*/, "")}` : "Nenhuma aba do SEI conectada",
    );
    this.elAba.title = aba ? (this.elAba.textContent ?? "") : "Abra ou recarregue uma aba do SEI para o agente trabalhar nela.";
  }

  /** Ícone, rótulo e disponibilidade do botão de envio. */
  private estadoEnvio(): void {
    const ocupado = Boolean(this.motor?.ocupado);
    this.elEnviar.classList.toggle("parando", ocupado);
    this.elEnviar.replaceChildren(icone(ocupado ? "parar" : "setaCima", ocupado ? 16 : 18));
    this.elEnviar.setAttribute("title", ocupado ? "Parar" : "Enviar");
    this.elEnviar.setAttribute("aria-label", ocupado ? "Parar" : "Enviar");
    this.elEnviar.disabled = !ocupado && (!this.elEntrada.value.trim() || !this.config.chave || Boolean(this.arquivada));
    this.elEntrada.disabled = Boolean(this.arquivada);
    this.elEntrada.placeholder = this.arquivada ? "Conversa guardada: abra uma nova para escrever." : "Pe\u00E7a algo sobre o SEI...";
  }

  // ------------------------------------------------------------- configuração

  /**
   * Modal por cima da conversa. `obrigatorio` tira o "fechar": é a primeira
   * configuração, sem chave, que não faz sentido dispensar.
   */
  private abrirModal(o: { titulo: string; corpo: Array<Node | string | null | false>; acoes: Array<Node | string | null | false>; obrigatorio?: boolean }): HTMLDialogElement {
    const fechar = h("button", { class: "icone", title: "Fechar", "aria-label": "Fechar" }, icone("fechar"));
    const dlg = h(
      "dialog",
      { class: "modal", "aria-label": o.titulo, closedby: o.obrigatorio ? "none" : "any" },
      h("div", { class: "modal-topo" }, h("h2", {}, o.titulo), o.obrigatorio ? null : fechar),
      h("div", { class: "modal-corpo" }, ...o.corpo),
      h("div", { class: "modal-acoes" }, ...o.acoes),
    );
    fechar.addEventListener("click", () => dlg.close());
    // Esc e clique fora: `closedby` resolve no Chrome 134+/Firefox 141+; abaixo disso, à mão.
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      if (o.obrigatorio) dlg.addEventListener("cancel", (ev) => ev.preventDefault());
      else
        dlg.addEventListener("click", (ev) => {
          if (ev.target !== dlg) return;
          const r = dlg.getBoundingClientRect();
          const dentro = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
          if (!dentro) dlg.close();
        });
    }
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg);
    dlg.showModal();
    return dlg;
  }

  // ------------------------------------------------------------- histórico

  /** Conversas guardadas: abrir para ler, exportar em Markdown ou apagar. */
  private async abrirHistorico(): Promise<void> {
    const lista = await historico.listar().catch(() => []);
    const corpo = h("div", { class: "conversas" });
    const apagarTudo = h("button", { class: "perigo" }, icone("lixeira", 15), "Apagar todas");
    const dlg = this.abrirModal({ titulo: "Conversas guardadas", corpo: [corpo], acoes: [apagarTudo] });

    const desenhar = (itens: historico.ResumoConversa[]) => {
      if (!itens.length) {
        corpo.replaceChildren(
          h(
            "div",
            { class: "nota" },
            icone("relogio", 15),
            h("span", {}, this.config.guardar ? "Nenhuma conversa guardada ainda." : "As conversas n\u00E3o est\u00E3o sendo guardadas (veja a configura\u00E7\u00E3o)."),
          ),
        );
        return;
      }
      corpo.replaceChildren(
        ...itens.map((c) => {
          const linha = h(
            "div",
            { class: "linha" },
            h(
              "button",
              { class: "abrir", onclick: () => void this.verArquivada(c.id, dlg) },
              h("b", {}, c.titulo),
              h("small", {}, `${new Date(c.quando).toLocaleString("pt-BR")} \u00B7 ${c.mensagens} mensagem(ns)${c.uso.custo || c.uso.entrada ? ` \u00B7 ${formatarUso(c.uso)}` : ""}${c.host ? ` \u00B7 ${c.host}` : ""}`),
            ),
            h("button", { class: "icone pequeno", title: "Exportar em Markdown", "aria-label": "Exportar", onclick: () => void this.exportar(c.id) }, icone("baixar", 15)),
            h(
              "button",
              {
                class: "icone pequeno",
                title: "Excluir",
                "aria-label": "Excluir",
                onclick: async () => {
                  await historico.remover(c.id).catch(() => undefined);
                  linha.remove();
                  if (!corpo.querySelector(".linha")) desenhar([]);
                },
              },
              icone("lixeira", 15),
            ),
          );
          return linha;
        }),
      );
    };
    desenhar(lista);

    apagarTudo.addEventListener("click", async () => {
      if (apagarTudo.textContent !== "Confirmar") {
        apagarTudo.replaceChildren("Confirmar");
        return;
      }
      await historico.limpar().catch(() => undefined);
      apagarTudo.replaceChildren(icone("lixeira", 15), "Apagar todas");
      desenhar([]);
    });
  }

  /** Abre uma conversa guardada para leitura. */
  private async verArquivada(id: string, dlg?: HTMLDialogElement): Promise<void> {
    const c = await historico.obter(id).catch(() => null);
    if (!c) return;
    this.motor?.parar();
    this.pensar(false);
    this.arquivada = c;
    this.tarefas = [];
    dlg?.close();
    this.redesenhar();
  }

  /** Baixa a conversa em Markdown — o que dá para juntar num processo ou guardar fora. */
  private async exportar(id: string): Promise<void> {
    const c = await historico.obter(id).catch(() => null);
    if (!c) return;
    const linhas = [`# ${c.titulo}`, "", `_${new Date(c.quando).toLocaleString("pt-BR")}${c.host ? ` \u00B7 ${c.host}` : ""} \u00B7 ${formatarUso(c.uso)}_`, ""];
    for (const i of c.itens as Item[]) {
      if (i.tipo === "tool") linhas.push(`- \u2699\uFE0F ${i.rotulo}${i.detalhe ? ` (${i.detalhe})` : ""}`, "");
      else if (i.tipo === "usuario") linhas.push(`**Voc\u00EA:** ${i.texto}`, "");
      else if (i.tipo === "agente") linhas.push(i.texto, "");
      else linhas.push(`> ${i.texto}`, "");
    }
    linhas.push("", "---", "_Gerado pelo Agente de IA do SEI Pro. Respostas de IA podem conter erros._");
    const url = URL.createObjectURL(new Blob([linhas.join("\n")], { type: "text/markdown;charset=utf-8" }));
    const a = h("a", { href: url, download: `conversa-${new Date(c.quando).toISOString().slice(0, 10)}.md` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /** Configuração em modal. `obrigatorio`: primeira vez, sem chave — não fecha sem salvar. */
  private abrirConfig(obrigatorio = false): void {
    const servico = h(
      "select",
      { "aria-label": "Servi\u00E7o de IA" },
      h("option", { value: "openrouter", ...(this.config.servico === "openrouter" ? { selected: true } : {}) }, "OpenRouter (recomendado)"),
      h("option", { value: "compativel", ...(this.config.servico === "compativel" ? { selected: true } : {}) }, "Compat\u00EDvel com OpenAI (avan\u00E7ado)"),
    );
    const url = h("input", { type: "url", placeholder: "https://.../v1", value: this.config.url, list: "urlsCompativeis", spellcheck: "false", "aria-label": "Endere\u00E7o do servi\u00E7o" });
    const ajudaUrl = h("div", { class: "ajuda" });
    const chave = h("input", { type: "password", placeholder: "sk-or-v1-...", value: this.config.chave, autocomplete: "off", autofocus: true, "aria-label": "Chave do servi\u00E7o" });
    const verChave = h("button", { class: "icone", title: "Mostrar a chave", "aria-label": "Mostrar a chave" }, icone("olho"));
    verChave.addEventListener("click", () => {
      const escondida = chave.type === "password";
      chave.type = escondida ? "text" : "password";
      verChave.replaceChildren(icone(escondida ? "olhoCorte" : "olho"));
      verChave.setAttribute("title", escondida ? "Ocultar a chave" : "Mostrar a chave");
    });
    const modelo = h("select", { "aria-label": "Modelo" }, h("option", { value: this.config.modelo }, this.config.modelo));
    const modeloLivre = h("input", { type: "text", placeholder: "nome do modelo no servi\u00E7o", value: this.config.modelo, list: "modelosCompativeis", spellcheck: "false", "aria-label": "Modelo" });
    const listaModelos = h("datalist", { id: "modelosCompativeis" });
    const buscar = h("button", {}, "Buscar modelos");
    const ajudaModelo = h("div", { class: "ajuda" }, "S\u00F3 modelos que usam ferramentas; pre\u00E7os em d\u00F3lares por milh\u00E3o de tokens (entrada / sa\u00EDda).");
    const status = h("div", { class: "status" });
    const nomes = h("input", { type: "checkbox", class: "switch", ...(this.config.nomes ? { checked: true } : {}) });
    const cnpj = h("input", { type: "checkbox", class: "switch", ...(this.config.cnpj ? { checked: true } : {}) });
    const guardar = h("input", { type: "checkbox", class: "switch", ...(this.config.guardar ? { checked: true } : {}) });
    const emReais = h("input", { type: "checkbox", class: "switch", ...(this.config.reais ? { checked: true } : {}) });
    const dias = h(
      "select",
      { "aria-label": "Tempo de guarda" },
      ...([[7, "7 dias"], [30, "30 dias"], [90, "90 dias"], [0, "Sem limite"]] as Array<[number, string]>).map(([v, t]) =>
        h("option", { value: String(v), ...(this.config.dias === v ? { selected: true } : {}) }, t),
      ),
    );
    if (this.config.servico === "openrouter")
      void listarModelos()
      .then((lista) => {
        modelo.replaceChildren(
          ...lista.map((m) =>
            h("option", { value: m.id, ...(m.id === this.config.modelo ? { selected: true } : {}) }, `${m.nome} \u2014 US$ ${m.precoEntrada.toFixed(2)} / ${m.precoSaida.toFixed(2)}`),
          ),
        );
      })
      .catch(() => {
        status.className = "status";
        status.textContent = "N\u00E3o foi poss\u00EDvel listar os modelos agora; o modelo atual ser\u00E1 mantido.";
      });

    /** Permissão de host: só o OpenRouter responde com CORS liberado; os demais exigem autorização do navegador. */
    const autorizarEndereco = async (endereco: string): Promise<boolean> => {
      try {
        const origens = [`${new URL(endereco).origin}/*`];
        return (await chrome.permissions.contains({ origins: origens })) || (await chrome.permissions.request({ origins: origens }));
      } catch {
        return false;
      }
    };

    const campoUrl = h(
      "div",
      { class: "campo" },
      h("label", {}, "Endere\u00E7o do servi\u00E7o"),
      url,
      h("datalist", { id: "urlsCompativeis" }, ...COMPATIVEIS.map((c) => h("option", { value: c.url }, c.nome))),
      ajudaUrl,
    );
    const notaCompativel = h(
      "div",
      { class: "nota atencao" },
      icone("alerta", 15),
      h(
        "span",
        {},
        "Fora do OpenRouter o agente n\u00E3o tem como exigir que o servi\u00E7o n\u00E3o guarde o que recebe: quem escolhe o endere\u00E7o responde por ele. E nem todo modelo sabe usar ferramentas \u2014 se o agente n\u00E3o conseguir agir no SEI, troque de modelo.",
      ),
    );
    const linhaBuscar = h("div", { class: "com-botao" }, modeloLivre, buscar);

    const ajustarServico = () => {
      const comp = servico.value === "compativel";
      campoUrl.hidden = !comp;
      notaCompativel.hidden = !comp;
      modelo.hidden = comp;
      linhaBuscar.hidden = !comp;
      ajudaModelo.hidden = comp;
      chave.placeholder = comp ? "chave do servi\u00E7o" : "sk-or-v1-...";
      const preset = COMPATIVEIS.find((c) => c.url === normalizarUrl(url.value));
      ajudaUrl.textContent = preset ? preset.ajuda : "Endere\u00E7o que fala o protocolo da OpenAI, terminando em /v1. O navegador vai pedir sua autoriza\u00E7\u00E3o para falar com ele.";
    };
    servico.addEventListener("change", ajustarServico);
    url.addEventListener("input", ajustarServico);
    buscar.addEventListener("click", async () => {
      const endereco = normalizarUrl(url.value);
      status.className = "status";
      status.textContent = "Buscando modelos...";
      if (!(await autorizarEndereco(endereco))) {
        status.className = "status erro";
        status.textContent = "O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.";
        return;
      }
      try {
        const lista = await listarModelos({ servico: "compativel", url: endereco, chave: chave.value.trim() });
        listaModelos.replaceChildren(...lista.map((m) => h("option", { value: m.id })));
        status.className = "status ok";
        status.textContent = `${lista.length} modelo(s) dispon\u00EDvel(is).`;
      } catch (e) {
        status.className = "status erro";
        status.textContent = (e as Error).message;
      }
    });

    const salvar = h("button", { class: "primario" }, obrigatorio ? "Salvar e come\u00E7ar" : "Salvar");
    const dlg = this.abrirModal({
      titulo: "Configura\u00E7\u00E3o",
      obrigatorio,
      corpo: [
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Servi\u00E7o de IA"),
          servico,
          h("div", { class: "ajuda" }, "O OpenRouter traz cat\u00E1logo com pre\u00E7os e deixa exigir provedor que n\u00E3o guarde os dados. A op\u00E7\u00E3o compat\u00EDvel serve para NVIDIA, Groq ou um servidor do pr\u00F3prio \u00F3rg\u00E3o."),
        ),
        campoUrl,
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Chave"),
          h("div", { class: "com-botao" }, chave, verChave),
          h("div", { class: "ajuda" }, "Fica guardada s\u00F3 neste navegador; o SEI Pro n\u00E3o tem servidor e n\u00E3o v\u00EA a sua chave. No OpenRouter, crie em openrouter.ai/keys."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Modelo"),
          modelo,
          linhaBuscar,
          listaModelos,
          ajudaModelo,
          notaCompativel,
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Privacidade"),
          h("label", { class: "linha-switch" }, nomes, h("span", {}, "Mascarar nomes de pessoas", h("small", {}, "Interessados e nomes ap\u00F3s \u201CSr.\u201D, \u201Crequerente\u201D, \u201Cfilho de\u201D..."))),
          h("label", { class: "linha-switch" }, cnpj, h("span", {}, "Mascarar tamb\u00E9m CNPJ", h("small", {}, "Empresas; CPF, e-mail e telefone s\u00E3o sempre mascarados."))),
          h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, PRIVACIDADE)),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Gasto"),
          h(
            "label",
            { class: "linha-switch" },
            emReais,
            h("span", {}, "Mostrar o gasto em reais", h("small", {}, "Convertido pela cota\u00E7\u00E3o do dia (PTAX do Banco Central). Desligado, o painel mostra em d\u00F3lares.")),
          ),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Conversas"),
          h("label", { class: "linha-switch" }, guardar, h("span", {}, "Guardar as conversas neste navegador", h("small", {}, "Para reler e exportar depois, pelo rel\u00F3gio no topo do painel."))),
          h("div", { class: "com-botao" }, h("span", { class: "ajuda" }, "Apagar depois de"), dias),
          h(
            "div",
            { class: "nota" },
            icone("escudo", 15),
            h(
              "span",
              {},
              "Fica guardada s\u00F3 a transcri\u00E7\u00E3o \u2014 o que apareceu na tela. O hist\u00F3rico que vai ao modelo e a tabela que liga [PESSOA_1] ao nome real morrem quando o navegador fecha, e por isso uma conversa guardada abre para ler e exportar, n\u00E3o para continuar.",
            ),
          ),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Responsabilidade"),
          h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, RESPONSABILIDADE)),
        ),
      ],
      acoes: [status, obrigatorio ? null : h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    salvar.addEventListener("click", async () => {
      const erro = (texto: string) => {
        status.className = "status erro";
        status.textContent = texto;
        salvar.disabled = false;
      };
      const comp = servico.value === "compativel";
      const k = chave.value.trim();
      const endereco = comp ? normalizarUrl(url.value) : "";
      const m = comp ? modeloLivre.value.trim() : modelo.value || MODELO_PADRAO;
      if (!k) return erro("Informe a chave.");
      if (comp && !/^https?:\/\//.test(endereco)) return erro("Informe o endere\u00E7o do servi\u00E7o (come\u00E7ando com https://).");
      if (comp && !m) return erro("Informe o nome do modelo no servi\u00E7o.");
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo...";
      if (comp && !(await autorizarEndereco(endereco))) return erro("O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.");
      const mudou = k !== this.config.chave || comp !== (this.config.servico === "compativel") || endereco !== this.config.url;
      if (mudou) {
        const r = await conferirChave({ chave: k, servico: comp ? "compativel" : "openrouter", url: endereco }).catch(() => ({ ok: false }));
        if (!r.ok) return erro(comp ? "O servi\u00E7o n\u00E3o aceitou a chave (ou o endere\u00E7o est\u00E1 errado)." : "A chave n\u00E3o foi aceita pelo OpenRouter.");
      }
      await this.aplicarConfig({
        reais: emReais.checked,
        guardar: guardar.checked,
        dias: Number(dias.value),
        servico: comp ? "compativel" : "openrouter",
        url: endereco,
        chave: k,
        modelo: m,
        nomes: nomes.checked,
        cnpj: cnpj.checked,
      });
      dlg.close();
    });
    ajustarServico();
  }

  /** Salva a configuração e refaz o motor mantendo a conversa e os pseudônimos. */
  private async aplicarConfig(nova: Config): Promise<void> {
    this.config = nova;
    await chrome.storage.local.set({ [CHAVE_CONFIG]: this.config });
    this.motor?.parar();
    const historico = this.motor?.mensagens() ?? [];
    this.motor = this.criarMotor(Pseudonimos.importar(this.privacidade.exportar(), { nomes: nova.nomes, cnpj: nova.cnpj }));
    if (historico.length) this.motor.restaurar([...historico], this.uso);
    void this.atualizarCambio();
    this.redesenhar();
    this.elEntrada.focus();
  }

  // ------------------------------------------------------------- conversa

  /** `mapa`: pseudônimos restaurados da sessão; sem ele, conversa nova. */
  private criarMotor(mapa?: Pseudonimos): Motor {
    this.privacidade = mapa ?? new Pseudonimos({ nomes: this.config.nomes, cnpj: this.config.cnpj });
    return new Motor({
      provedor: criarProvedor({ servico: this.config.servico, url: this.config.url, chave: this.config.chave, modelo: this.config.modelo }),
      tools: new RegistroTools([...TOOLS_SEI, ...TOOLS_MOTOR]),
      ui: this.interfaceMotor(),
      privacidade: this.privacidade,
      sei: (op, args, sinal) => (op === "editores" ? Promise.resolve(this.ponte.editores()) : this.ponte.executar(op, args, sinal)),
      sistema: (tela) => promptSistema(tela),
      tela: async (sinal) => ({ ...((await this.ponte.executar("tela", {}, sinal)) as TelaAtual), editores: this.ponte.editores() }),
    });
  }

  private async enviar(texto: string): Promise<void> {
    const t = texto.trim();
    if (!t || !this.motor || this.motor.ocupado) return;
    if (!this.config.chave) {
      this.abrirConfig(true);
      return;
    }
    this.elEntrada.value = "";
    this.elEntrada.style.height = "auto";
    const comecou = Date.now();
    this.ultimaResposta = null;
    const comAnexo = this.anexo ? `${t}\n\n[Anexo: ${this.anexo.nome}]\n${this.anexo.texto}` : t;
    this.adicionar({ tipo: "usuario", texto: this.anexo ? `${t}\n\u{1F4CE} ${this.anexo.nome}` : t });
    this.anexo = null;
    this.elAnexo.hidden = true;
    try {
      const promessa = this.motor.enviar(comAnexo);
      this.estadoEnvio();
      this.pensar(true);
      await promessa;
    } catch (e) {
      this.adicionar({ tipo: "erro", texto: (e as Error).message });
    } finally {
      this.pensar(false);
      this.carimbarRodada(Date.now() - comecou);
      this.estadoEnvio();
      await this.salvarSessao();
    }
  }

  /**
   * Carimba a última resposta com o tempo da rodada inteira: o que o usuário
   * esperou entre mandar o pedido e poder ler, com ferramentas e tudo.
   */
  private carimbarRodada(ms: number): void {
    const resposta = this.ultimaResposta;
    this.ultimaResposta = null;
    if (!resposta || resposta.item.ms) return;
    resposta.item.ms = ms;
    resposta.el.append(carimboDeTempo(ms));
    this.rolar();
  }

  private async novaConversa(): Promise<void> {
    this.motor?.parar();
    this.pensar(false);
    this.motor = this.criarMotor();
    this.idConversa = crypto.randomUUID();
    this.arquivada = null;
    this.transcricao = [];
    this.uso = { entrada: 0, saida: 0, custo: 0 };
    this.tarefas = [];
    await chrome.storage.session?.remove(CHAVE_SESSAO).catch(() => undefined);
    this.redesenhar();
    this.elEntrada.focus();
  }

  // ------------------------------------------------------------- transcrição

  private adicionar(item: Item): HTMLElement {
    this.transcricao.push(item);
    const el = this.desenharItem(item);
    this.elConversa.querySelector(".vazio")?.remove();
    this.elConversa.append(el);
    if (this.tickPensando) this.elConversa.append(this.elPensando);
    this.rolar();
    return el;
  }

  private desenharItem(item: Item): HTMLElement {
    if (item.tipo === "tool") {
      return h("div", { class: `tool ${item.estado === "rodando" ? "" : item.estado}` }, item.rotulo, item.detalhe ? h("span", { class: "detalhe" }, ` \u2014 ${item.detalhe}`) : null);
    }
    if (item.tipo === "agente") {
      const el = h("div", { class: "msg agente" });
      el.append(markdown(item.texto));
      if (item.ms) el.append(carimboDeTempo(item.ms));
      return el;
    }
    if (item.tipo === "aviso" || item.tipo === "decisao") return h("div", { class: "msg aviso" }, icone("alerta", 14), h("span", {}, item.texto));
    if (item.tipo === "erro") return h("div", { class: "msg erro" }, icone("alerta", 14), h("span", {}, item.texto));
    return h("div", { class: "msg usuario" }, item.texto);
  }

  private redesenhar(): void {
    if (this.arquivada) {
      const a = this.arquivada;
      this.elConversa.replaceChildren(
        h(
          "div",
          { class: "arquivada" },
          icone("relogio", 14),
          h("span", {}, `${a.titulo} \u2014 ${new Date(a.quando).toLocaleString("pt-BR")}. S\u00F3 leitura.`),
          h("button", { class: "plana", onclick: () => void this.novaConversa() }, "Nova conversa"),
        ),
        ...(a.itens as Item[]).map((i) => this.desenharItem(i)),
      );
      this.mostrarUso();
      this.desenharTarefas();
      this.estadoEnvio();
      return;
    }
    this.elConversa.replaceChildren(...this.transcricao.map((i) => this.desenharItem(i)));
    if (!this.transcricao.length) this.elConversa.append(this.boasVindas());
    this.mostrarUso();
    this.desenharTarefas();
    this.estadoEnvio();
    // Conversa começando: o começo é o que interessa (rolar cortaria o título
    // em tela curta). Com conversa, o fim.
    if (this.transcricao.length) this.rolar();
    else requestAnimationFrame(() => (this.elConversa.scrollTop = 0));
  }

  /** Tela de início: o que o agente faz, sugestões de pedido e o aviso de privacidade. */
  private boasVindas(): HTMLElement {
    return h(
      "div",
      { class: "vazio" },
      marca(52),
      h("h2", {}, "O que fa\u00E7o no SEI por voc\u00EA?"),
      h("p", {}, "Consulto processos e documentos, altero sigilo em lote, crio e escrevo documentos, marco, anoto e atribuo processos."),
      this.config.chave
        ? h(
            "div",
            { class: "sugestoes" },
            ...sugestoesPara(this.tela).map((a) =>
              h(
                "button",
                { class: "sugestao", onclick: () => void this.enviar(a.prompt) },
                h("span", { class: "badge" }, icone("faisca", 14)),
                h("span", {}, h("b", {}, a.rotulo), h("small", {}, a.descricao)),
              ),
            ),
          )
        : h("button", { class: "primario", onclick: () => this.abrirConfig(true) }, "Configurar a chave do OpenRouter"),
      h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, PRIVACIDADE_CURTA)),
      h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, RESPONSABILIDADE)),
    );
  }

  private rolar(): void {
    requestAnimationFrame(() => (this.elConversa.scrollTop = this.elConversa.scrollHeight));
  }

  private desenharTarefas(): void {
    this.elTarefas.hidden = !this.tarefas.length;
    this.elTarefas.replaceChildren(h("ul", {}, ...this.tarefas.map((t) => h("li", { class: t.estado }, t.titulo))));
  }

  // ------------------------------------------------------------- interface do motor

  private interfaceMotor(): InterfaceMotor {
    return {
      texto: (delta) => {
        if (!this.bolhaAtual) {
          this.pensar(false);
          const el = h("div", { class: "msg agente" });
          this.elConversa.querySelector(".vazio")?.remove();
          this.elConversa.append(el);
          this.bolhaAtual = { el, texto: "", pendente: false };
        }
        const b = this.bolhaAtual;
        b.texto += delta;
        if (!b.pendente) {
          b.pendente = true;
          requestAnimationFrame(() => {
            b.pendente = false;
            // A bolha pode ter fechado entre o agendamento e agora; redesenhar
            // aqui apagaria o que veio depois (o carimbo de tempo, por exemplo).
            if (b.fechada) return;
            b.el.replaceChildren(markdown(b.texto));
            this.rolar();
          });
        }
      },
      fimDaResposta: () => {
        this.fecharBolha();
        if (this.motor?.ocupado) this.pensar(true);
        this.aoFimDoPlano?.();
        this.aoFimDoPlano = null;
      },
      toolIniciada: (id, _nome, rotulo) => {
        this.fecharBolha();
        const item: Extract<Item, { tipo: "tool" }> = { tipo: "tool", rotulo, estado: "rodando" };
        this.toolsEl.set(id, { el: this.adicionar(item), item });
      },
      toolTerminada: (id, ok, resumo) => {
        const t = this.toolsEl.get(id);
        if (!t) return;
        Object.assign(t.item, { estado: ok ? "ok" : "falha", detalhe: ok ? undefined : resumo });
        t.el.replaceWith(this.desenharItem(t.item));
        this.toolsEl.delete(id);
      },
      aprovarPlano: (p) => this.cartaoPlano(p),
      progressoPlano: () => undefined,
      consentir: (_tipo, detalhe) => this.cartaoConsentimento(detalhe),
      perguntar: (pergunta, opcoes) => this.cartaoPergunta(pergunta, opcoes),
      tarefas: (lista) => {
        this.tarefas = lista;
        this.desenharTarefas();
      },
      uso: (u) => {
        this.uso = u;
        this.mostrarUso();
      },
      aviso: (t) => (this.fecharBolha(), void this.adicionar({ tipo: "aviso", texto: t })),
    };
  }

  private fecharBolha(): void {
    if (!this.bolhaAtual) return;
    const b = this.bolhaAtual;
    this.bolhaAtual = null;
    b.fechada = true;
    if (b.texto.trim()) {
      const item: ItemAgente = { tipo: "agente", texto: b.texto };
      this.transcricao.push(item);
      b.el.replaceChildren(markdown(b.texto));
      this.ultimaResposta = { el: b.el, item };
    } else b.el.remove();
  }

  /** Fecha as ações de um cartão decidido, deixando no lugar o que foi decidido. */
  private encerrarCartao(cartao: HTMLElement, seletor: string, texto: string, sim: boolean): HTMLElement {
    this.pensar(Boolean(this.motor?.ocupado));
    const aviso = h("div", { class: "decidido" }, icone(sim ? "check" : "fechar", 14), h("span", {}, texto));
    cartao.querySelector(seletor)?.replaceWith(aviso);
    this.transcricao.push({ tipo: "decisao", texto });
    return aviso;
  }

  private cartaoPlano(p: PlanoPrevisto): Promise<DecisaoPlano> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const irreversivel = p.passos.some((x) => x.efeito === "irreversivel");
      const confirma = h("input", { type: "checkbox" });
      const motivo = h("textarea", { rows: "2", placeholder: "O que ajustar? (opcional)", hidden: true });
      const aprovar = h("button", { class: "primario" }, "Aprovar e executar");
      const recusar = h("button", {}, "Recusar");
      // Assinatura: cargo e senha digitados aqui; a senha vai direto para a aba e é descartada.
      const assinatura = p.passos.some((x) => x.efeito === "assinatura");
      const cargos = [...new Set(p.passos.flatMap((x) => x.previa.flatMap((i) => i.cargos ?? [])))];
      // Sem lista (documento criado no mesmo plano): cargo digitado; o núcleo casa com a lista do SEI.
      const selCargo: HTMLSelectElement | HTMLInputElement = cargos.length
        ? h("select", { "aria-label": "Cargo ou fun\u00E7\u00E3o" }, ...cargos.map((c) => h("option", { value: c }, c)))
        : h("input", { type: "text", placeholder: "Cargo ou fun\u00E7\u00E3o (como aparece no SEI)", "aria-label": "Cargo ou fun\u00E7\u00E3o" });
      const senha = h("input", { type: "password", placeholder: "Senha do SEI", autocomplete: "off", "aria-label": "Senha do SEI" });
      if (assinatura) {
        void chrome.storage.local.get("agenteIA_cargo").then((v) => {
          if (v?.agenteIA_cargo && (!cargos.length || cargos.includes(v.agenteIA_cargo))) selCargo.value = v.agenteIA_cargo;
          podeAprovar();
        });
      }
      const podeAprovar = () => (aprovar.disabled = (irreversivel && !confirma.checked) || (assinatura && (!senha.value || !selCargo.value.trim())));
      selCargo.addEventListener("input", podeAprovar);
      confirma.addEventListener("change", podeAprovar);
      senha.addEventListener("input", podeAprovar);
      senha.addEventListener("keydown", (ev) => ev.key === "Enter" && !aprovar.disabled && aprovar.click());
      podeAprovar();
      const total = p.passos.reduce((n, x) => n + x.previa.length, 0);
      const cartao = h(
        "div",
        { class: "cartao plano" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("lapis", 15)), h("h4", {}, "Aprovar altera\u00E7\u00F5es no SEI")),
        p.passos.length > 1 || p.objetivo !== p.passos[0]?.rotulo ? h("div", { class: "sub" }, p.objetivo) : null,
        ...p.passos.map((passo, i) => {
          const linhas = passo.previa.slice(0, 15).map((item) =>
            item.erro
              ? h("tr", {}, h("td", { class: "alvo" }, item.alvo || "\u2014"), h("td", { class: "erroItem", colspan: "2" }, item.erro))
              : item.mudancas.length
                ? h(
                    "tr",
                    {},
                    h("td", { class: "alvo" }, item.alvo),
                    h(
                      "td",
                      {},
                      ...item.mudancas.map((m) =>
                        h("div", {}, `${m.campo}: `, m.antes ? h("span", { class: "antes" }, m.antes) : null, m.antes ? " \u2192 " : "", h("span", { class: "depois" }, m.depois || "(vazio)")),
                      ),
                    ),
                  )
                : h("tr", {}, h("td", { class: "alvo" }, item.alvo), h("td", {}, item.resumo || "Nada muda")),
          );
          return h(
            "div",
            { class: "passo" },
            h("div", { class: "titulo" }, `${p.passos.length > 1 ? `${i + 1}. ` : ""}${passo.rotulo}`, passo.efeito === "irreversivel" ? h("span", { class: "selo irrev" }, "irrevers\u00EDvel") : null),
            passo.dependente ? h("div", { class: "mais" }, "Depende do resultado do passo anterior; a pr\u00E9via exata sai na execu\u00E7\u00E3o.") : null,
            linhas.length ? h("table", { class: "previa" }, ...linhas) : null,
            passo.previa.length > 15 ? h("div", { class: "mais" }, `e mais ${passo.previa.length - 15} item(ns).`) : null,
          );
        }),
        total > 1 ? h("div", { class: "mais" }, `${total} itens no total.`) : null,
        irreversivel ? h("label", { class: "check" }, confirma, " Entendo que esta a\u00E7\u00E3o n\u00E3o pode ser desfeita.") : null,
        assinatura
          ? h(
              "div",
              { class: "assinatura" },
              h("div", { class: "sub" }, "Assinar como o usu\u00E1rio logado. A senha n\u00E3o \u00E9 enviada ao modelo de IA nem guardada."),
              selCargo,
              senha,
            )
          : null,
        motivo,
        h("div", { class: "acoes" }, aprovar, recusar),
      );
      const decidir = (d: DecisaoPlano, texto: string) => {
        const aviso = this.encerrarCartao(cartao, ".acoes", texto, Boolean(d.aprovado));
        this.aoFimDoPlano = () => d.aprovado && aviso.replaceChildren(icone("check", 14), h("span", {}, "Aprovado e executado."));
        motivo.hidden = true;
        resolver(d);
      };
      aprovar.addEventListener("click", () => {
        const credencial = assinatura ? { cargo: selCargo.value, senha: senha.value } : undefined;
        senha.value = "";
        if (credencial) void chrome.storage.local.set({ agenteIA_cargo: credencial.cargo });
        decidir({ aprovado: true, assinatura: credencial }, "Aprovado. Executando...");
      });
      recusar.addEventListener("click", () => {
        if (motivo.hidden) {
          motivo.hidden = false;
          recusar.textContent = "Confirmar recusa";
          motivo.focus();
          return;
        }
        decidir({ aprovado: false, motivo: motivo.value.trim() || undefined }, `Recusado${motivo.value.trim() ? `: ${motivo.value.trim()}` : "."}`);
      });
      this.elConversa.append(cartao);
      this.rolar();
    });
  }

  private cartaoConsentimento(detalhe: string): Promise<boolean> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const cartao = h(
        "div",
        { class: "cartao consentimento" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("alerta", 15)), h("h4", {}, "Documento restrito")),
        h("div", { class: "sub" }, detalhe),
        h("div", {}, "O agente precisa enviar o conte\u00FAdo de documentos RESTRITOS ao modelo de IA (com dados pessoais mascarados). Permitir nesta conversa?"),
      );
      const decidir = (sim: boolean) => {
        this.encerrarCartao(cartao, ".acoes", sim ? "Leitura de restritos permitida nesta conversa." : "Leitura de restritos n\u00E3o permitida.", sim);
        resolver(sim);
      };
      cartao.append(h("div", { class: "acoes" }, h("button", { class: "primario", onclick: () => decidir(true) }, "Permitir"), h("button", { onclick: () => decidir(false) }, "N\u00E3o permitir")));
      this.elConversa.append(cartao);
      this.rolar();
    });
  }

  private cartaoPergunta(pergunta: string, opcoes: string[]): Promise<string> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const livre = h("input", { type: "text", placeholder: "Outra resposta..." });
      const cartao = h("div", { class: "cartao" }, h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("balao", 15)), h("h4", {}, pergunta)));
      const decidir = (r: string) => {
        if (!r.trim()) return;
        this.encerrarCartao(cartao, ".opcoes-pergunta", `${pergunta} \u2192 ${r}`, true);
        resolver(r);
      };
      livre.addEventListener("keydown", (ev) => ev.key === "Enter" && decidir(livre.value));
      cartao.append(h("div", { class: "opcoes-pergunta" }, ...opcoes.map((o) => h("button", { onclick: () => decidir(o) }, o)), livre));
      this.elConversa.append(cartao);
      this.rolar();
      livre.focus();
    });
  }

  // ------------------------------------------------------------- sessão

  /**
   * Grava a transcrição no histórico do navegador. Só ela: o histórico do
   * modelo e o mapa de pseudônimos ficam na sessão, que morre com o navegador.
   */
  private async guardarConversa(): Promise<void> {
    if (!this.config.guardar || this.arquivada || !this.transcricao.length) return;
    const primeira = this.transcricao.find((i) => i.tipo === "usuario");
    const titulo = primeira && "texto" in primeira ? primeira.texto.replace(/\s+/g, " ").slice(0, 70) : "Conversa";
    await historico
      .salvar({
        id: this.idConversa,
        titulo,
        quando: Date.now(),
        host: this.ponte.atual()?.host,
        uso: this.uso,
        mensagens: this.transcricao.filter((i) => i.tipo === "usuario" || i.tipo === "agente").length,
        itens: this.transcricao,
      })
      .catch(() => undefined);
  }

  private async salvarSessao(): Promise<void> {
    await this.guardarConversa();
    if (!this.motor) return;
    const dados = { historico: this.motor.mensagens(), transcricao: this.transcricao, uso: this.uso, pseudonimos: this.privacidade.exportar(), tarefas: this.tarefas };
    // storage.session não existe em navegadores antigos (Firefox < 115): a conversa só não sobrevive à recarga.
    await chrome.storage.session?.set({ [CHAVE_SESSAO]: dados }).catch(() => undefined);
  }

  private async restaurarSessao(): Promise<void> {
    const bruto: Record<string, unknown> = (await chrome.storage.session?.get(CHAVE_SESSAO).catch(() => ({}))) ?? {};
    const d = bruto[CHAVE_SESSAO] as
      | { historico: Mensagem[]; transcricao: Item[]; uso: Uso; pseudonimos: ReturnType<Pseudonimos["exportar"]>; tarefas: Tarefa[] }
      | undefined;
    if (!d || !this.motor || this.transcricao.length) return;
    this.motor = this.criarMotor(Pseudonimos.importar(d.pseudonimos, { nomes: this.config.nomes, cnpj: this.config.cnpj }));
    this.motor.restaurar(d.historico, d.uso);
    this.transcricao = d.transcricao.map((i) => (i.tipo === "tool" && i.estado === "rodando" ? { ...i, estado: "falha", detalhe: "interrompido" } : i));
    this.uso = d.uso;
    this.tarefas = d.tarefas ?? [];
  }

}

const app = new App();
// Diagnóstico: acessível só no console desta página da extensão (o SEI não a enxerga).
Object.defineProperty(window, "agenteIA", { value: app });
Object.defineProperty(window, "agenteIADiag", { value: { extrairTextoPdf, historico } });
void app.iniciar();
