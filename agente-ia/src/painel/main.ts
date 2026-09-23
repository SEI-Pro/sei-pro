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
import { COMPATIVEIS, conferirChave, criarProvedor, DOC_CHAVES, enderecoDoServico, listarModelos, MODELO_PADRAO, normalizarUrl, SERVICOS, TEMPERATURA_PADRAO, type Ajustes, type Servico } from "../motor/provedor";
import { RegistroTools } from "../motor/tools";
import type { DecisaoPlano, InterfaceMotor, Mensagem, PlanoPrevisto, Tarefa, Uso } from "../motor/tipos";
import { PontePainel } from "../ponte/cliente";
import { toolsMotor } from "../tools/motor";
import { TOOLS_SEI } from "../tools/sei";
import { duracao, formatarUso, h, icone, markdown, moeda } from "./dom";
import * as historico from "./historico";
import { cotacaoDolar, type Cotacao } from "./cambio";
import { sugestoesPara } from "./sugestoes";
import { inversaDe, motivoSemDesfazer, type AcaoFeita, type ResultadoDeEscrita } from "./desfazer";
import { avaliarRegras, guardarRegras, listarRegras, recadoDoBloqueio, REGRAS_SUGERIDAS, type Regra } from "./regras";
import {
  baixarColecao,
  baixarSkillSeMudou,
  comSkills,
  descricaoDoTexto,
  guardarColecoes,
  guardarSkills,
  listarColecoes,
  listarSkills,
  LIMITE_SKILL,
  mesclarColecao,
  partesDoGitHub,
  sincronizarSkills,
  skillsCitadas,
  slugLivre,
  type ColecaoSkills,
  type SkillUsuario,
} from "./skills";
import { extrairTextoPdf } from "./pdf";

interface Config {
  /** Mostrar o gasto em reais, pela cotação do dia. */
  reais: boolean;
  /** Guardar a transcrição das conversas neste navegador. */
  guardar: boolean;
  /** Dias de guarda (0 = para sempre). */
  dias: number;
  /** `openrouter` (padrão), um fabricante conhecido ou um serviço compatível. */
  servico: Servico;
  /** Endereço do serviço compatível (vazio quando o serviço tem endereço fixo). */
  url: string;
  chave: string;
  modelo: string;
  nomes: boolean;
  cnpj: boolean;
  /** Controle fino do modelo; em branco = padrão do serviço. */
  ajustes: Ajustes;
  /** Instruções do usuário anexadas ao fim do prompt do agente. */
  instrucoes: string;
}

type Item =
  /** `ms` (só na resposta do agente): quanto a rodada inteira demorou, do envio à resposta pronta. */
  | { tipo: "usuario" | "agente" | "aviso" | "erro" | "decisao"; texto: string; ms?: number }
  | { tipo: "tool"; rotulo: string; estado: "rodando" | "ok" | "falha"; detalhe?: string; acao?: string; desfeita?: boolean };

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


/** A pasta da equipe é conferida com menos frequência: a API do GitHub limita por hora. */
const INTERVALO_COLECAO = 12 * 60 * 60 * 1000;

/** "agora", "há 3 h", "ontem": quando a skill foi conferida pela última vez. */
function quando(ms?: number): string {
  if (!ms) return "ainda n\u00E3o conferida";
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 2) return "conferida agora";
  if (min < 60) return `conferida h\u00E1 ${min} min`;
  const horas = Math.round(min / 60);
  if (horas < 24) return `conferida h\u00E1 ${horas} h`;
  return `conferida em ${new Date(ms).toLocaleDateString("pt-BR")}`;
}

/** Texto do serviço + link do painel do fabricante + link do passo a passo. */
function ajudaDoServico(svc: Servico): Node[] {
  const info = SERVICOS[svc];
  const fora = (texto: string, url: string) => h("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, texto);
  const partes: Node[] = [document.createTextNode(info.ajuda)];
  if (info.painelChave) partes.push(document.createTextNode(" Crie a chave em "), fora(info.painelChave.texto, info.painelChave.url), document.createTextNode("."));
  partes.push(
    document.createTextNode(" "),
    fora("Como obter a chave, passo a passo", info.ancoraDoc ? `${DOC_CHAVES}#${info.ancoraDoc}` : DOC_CHAVES),
    document.createTextNode("."),
  );
  return partes;
}

class App {
  private readonly raiz = document.getElementById("app")!;
  private readonly ponte = new PontePainel();
  private config: Config = { reais: true, guardar: true, dias: 30, servico: "openrouter", url: "", chave: "", modelo: MODELO_PADRAO, nomes: true, cnpj: false, ajustes: {}, instrucoes: "" };
  private privacidade = new Pseudonimos();
  private motor: Motor | null = null;
  private transcricao: Item[] = [];
  private uso: Uso = { entrada: 0, saida: 0, custo: 0 };
  private tarefas: Tarefa[] = [];
  private anexo: { nome: string; texto: string } | null = null;
  private idConversa = crypto.randomUUID();
  /** Skills do usuário (configurações), disponíveis por `/slug` e por `skill_ler`. */
  private skills: SkillUsuario[] = [];

  /** Pastas do GitHub que trazem as skills da equipe. */
  private colecoes: ColecaoSkills[] = [];

  /** O que esta conversa escreveu no SEI, para o botão de desfazer. */
  private feitos = new Map<string, AcaoFeita>();

  /** Regras da unidade: o que o agente não pode fazer, e o que exige atenção. */
  private regras: Regra[] = [];

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
    this.skills = await listarSkills();
    this.colecoes = await listarColecoes();
    this.regras = await listarRegras();
    void this.sincronizarSkills();
    void this.sincronizarColecoes();
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
      if (this.elMenu.hidden || this.elMenu.dataset.tipo === "skills") {
        this.elMenu.dataset.tipo = "sugestoes";
        this.elMenu.replaceChildren(
          ...sugestoesPara(this.tela, 8).map((a) => h("button", { role: "menuitem", onclick: () => ((this.elMenu.hidden = true), void this.enviar(a.prompt)) }, a.rotulo)),
        );
      }
      this.elMenu.hidden = this.elMenu.dataset.tipo === "sugestoes" ? !this.elMenu.hidden : false;
    });
    document.addEventListener("click", () => (this.elMenu.hidden = true));
    document.addEventListener("keydown", (ev) => ev.key === "Escape" && (this.elMenu.hidden = true));

    this.elEntrada.addEventListener("keydown", (ev) => {
      // Com a lista de skills aberta, as setas e o Enter são dela.
      const itens = this.elMenu.hidden ? [] : [...this.elMenu.querySelectorAll<HTMLButtonElement>("button")];
      if (itens.length && ["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(ev.key)) {
        const atual = itens.findIndex((b) => b.classList.contains("focado"));
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          ev.preventDefault();
          const proximo = (atual + (ev.key === "ArrowDown" ? 1 : itens.length - 1) + itens.length) % itens.length;
          itens.forEach((b, i) => b.classList.toggle("focado", i === proximo));
          return;
        }
        ev.preventDefault();
        (itens[Math.max(0, atual)] ?? itens[0]).click();
        return;
      }
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        this.elEnviar.click();
      }
    });
    this.elEntrada.addEventListener("input", () => {
      this.elEntrada.style.height = "auto";
      this.elEntrada.style.height = `${Math.min(this.elEntrada.scrollHeight, 180)}px`;
      this.estadoEnvio();
      this.menuDeSkills();
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
   * Lista de skills enquanto o usuário digita `/`.
   *
   * Mesmo menu das sugestões (o da lâmpada), aberto pelo que está sendo
   * escrito: `/desp` filtra pelo nome e pelo atalho. Escolher completa o texto.
   */
  private menuDeSkills(): void {
    const campo = this.elEntrada;
    const ate = campo.value.slice(0, campo.selectionStart ?? campo.value.length);
    const m = /(?:^|\s)\/([a-z0-9-]*)$/i.exec(ate);
    if (!m || !this.skills.length) {
      if (this.elMenu.dataset.tipo === "skills") this.elMenu.hidden = true;
      return;
    }
    const termo = m[1].toLowerCase();
    const achadas = this.skills.filter((sk) => !termo || sk.slug.includes(termo) || sk.nome.toLowerCase().includes(termo)).slice(0, 8);
    if (!achadas.length) {
      this.elMenu.hidden = true;
      return;
    }
    const inicio = (campo.selectionStart ?? 0) - m[1].length - 1;
    this.elMenu.dataset.tipo = "skills";
    this.elMenu.replaceChildren(
      ...achadas.map((sk, i) =>
        h(
          "button",
          {
            role: "menuitem",
            class: i === 0 ? "focado" : "",
            onclick: () => {
              const antes = campo.value.slice(0, inicio);
              const depois = campo.value.slice(campo.selectionStart ?? 0);
              campo.value = `${antes}/${sk.slug} ${depois}`;
              const cursor = antes.length + sk.slug.length + 2;
              campo.setSelectionRange(cursor, cursor);
              this.elMenu.hidden = true;
              campo.focus();
              this.estadoEnvio();
            },
          },
          h("code", {}, `/${sk.slug}`),
          h("span", {}, sk.nome),
        ),
      ),
    );
    this.elMenu.hidden = false;
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

  /**
   * Ajuda do serviço: o texto mais os dois links que o usuário precisa — o
   * painel do fabricante, onde a chave nasce, e o passo a passo do SEI Pro.
   * Endereço em texto puro obriga a copiar e colar; aqui abre em outra aba.
   */

  /** Configuração em modal. `obrigatorio`: primeira vez, sem chave — não fecha sem salvar. */
  private abrirConfig(obrigatorio = false): void {
    const servico = h(
      "select",
      { "aria-label": "Servi\u00E7o de IA" },
      ...(Object.entries(SERVICOS) as Array<[Servico, (typeof SERVICOS)[Servico]]>).map(([id, info]) =>
        h("option", { value: id, ...(this.config.servico === id ? { selected: true } : {}) }, info.nome),
      ),
    );
    const ajudaServico = h("div", { class: "ajuda" }, ...ajudaDoServico(this.config.servico));
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
    const buscar = h("button", { title: "Buscar a lista de modelos do servi\u00E7o" }, "Atualizar");
    const ajudaModelo = h("div", { class: "ajuda" });
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

    /**
     * Preenche o seletor de modelos com o catálogo do serviço.
     *
     * Fora do OpenRouter, listar exige a permissão de host — que o navegador só
     * concede durante um gesto do usuário. Por isso, ao abrir a tela a lista só
     * é buscada quando a permissão já existe; nos demais casos quem dá o gesto
     * é o próprio usuário, trocando o serviço ou clicando em "Atualizar".
     */
    const carregarModelos = async (gesto: boolean): Promise<void> => {
      const svc = servico.value as Servico;
      const endereco = enderecoDoServico(svc, url.value);
      // Ler `modelo.value` aqui não serve: o select é reescrito enquanto carrega
      // (e chegou a gravar "Buscando modelos..." como se fosse o modelo).
      const escolhido = (svc === "compativel" ? modeloLivre.value.trim() : modeloAtual) || SERVICOS[svc].modeloPadrao || "";
      if (svc === "compativel" && !/^https?:\/\//.test(endereco)) return;
      const origens = [`${new URL(endereco).origin}/*`];
      const temPermissao = svc === "openrouter" || (await chrome.permissions.contains({ origins: origens }).catch(() => false));
      if (!temPermissao && !gesto) {
        modelo.replaceChildren(h("option", { value: escolhido, selected: true }, escolhido));
        ajudaModelo.textContent = "Clique em Atualizar para ver os modelos do servi\u00E7o (o navegador vai pedir a sua autoriza\u00E7\u00E3o).";
        return;
      }
      if (!temPermissao && !(await autorizarEndereco(endereco))) {
        status.className = "status erro";
        status.textContent = "O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.";
        return;
      }
      modelo.disabled = true;
      modelo.replaceChildren(h("option", { value: "" }, "Buscando modelos..."));
      ajudaModelo.textContent = "";
      try {
        const lista = await listarModelos({ servico: svc, url: endereco, chave: chave.value.trim() });
        if ((servico.value as Servico) !== svc) return; // trocou de serviço no meio do caminho
        if (!lista.length) throw new Error("O servi\u00E7o n\u00E3o devolveu nenhum modelo.");
        const comPreco = svc === "openrouter";
        const temEscolhido = lista.some((m) => m.id === escolhido);
        modelo.replaceChildren(
          ...(temEscolhido || !escolhido ? [] : [h("option", { value: escolhido, selected: true }, `${escolhido} (atual)`)]),
          ...lista.map((m) =>
            h(
              "option",
              { value: m.id, ...(m.id === escolhido ? { selected: true } : {}) },
              comPreco ? `${m.nome} \u2014 US$ ${m.precoEntrada.toFixed(2)} / ${m.precoSaida.toFixed(2)}` : m.nome,
            ),
          ),
        );
        listaModelos.replaceChildren(...lista.map((m) => h("option", { value: m.id })));
        modeloAtual = modelo.value || escolhido;
        ajudaModelo.textContent = comPreco
          ? "S\u00F3 modelos que usam ferramentas; pre\u00E7os em d\u00F3lares por milh\u00E3o de tokens (entrada / sa\u00EDda)."
          : `${lista.length} modelo(s) do servi\u00E7o. A lista vem do pr\u00F3prio fabricante.`;
        status.textContent = "";
        status.className = "status";
      } catch (e) {
        modelo.replaceChildren(h("option", { value: escolhido, selected: true }, escolhido || "(sem modelo)"));
        ajudaModelo.textContent = "";
        status.className = "status erro";
        status.textContent = `N\u00E3o deu para listar os modelos: ${(e as Error).message}`;
      } finally {
        modelo.disabled = false;
      }
    };

    const ajustarServico = (): Servico => {
      const svc = servico.value as Servico;
      const comp = svc === "compativel";
      campoUrl.hidden = !comp;
      // O aviso de política de dados vale para tudo que não é OpenRouter.
      notaCompativel.hidden = svc === "openrouter";
      // O seletor vale para os serviços com catálogo; num servidor próprio, que
      // pode nem ter /models, o nome do modelo continua sendo digitado.
      modelo.hidden = comp;
      linhaBuscar.hidden = !comp;
      chave.placeholder = SERVICOS[svc].exemploChave;
      ajudaServico.replaceChildren(...ajudaDoServico(svc));
      const preset = COMPATIVEIS.find((c) => c.url === normalizarUrl(url.value));
      ajudaUrl.textContent = preset ? preset.ajuda : SERVICOS.compativel.ajuda;
      // Ao trocar de fabricante, o modelo do anterior não serve: sugere o de casa
      // (e num serviço sem sugestão, limpa em vez de deixar o nome alheio).
      const sugestao = SERVICOS[svc].modeloPadrao ?? "";
      if (comp && (!modeloLivre.value.trim() || modeloLivre.value === modeloSugerido)) modeloLivre.value = sugestao;
      // Trocou de fabricante: o modelo do anterior não existe lá.
      if (svc !== servicoAtual) {
        modeloAtual = svc === this.config.servico ? this.config.modelo : sugestao;
        servicoAtual = svc;
      }
      modeloSugerido = sugestao;
      return svc;
    };
    let modeloSugerido = SERVICOS[this.config.servico].modeloPadrao ?? "";
    let modeloAtual = this.config.modelo;
    let servicoAtual: Servico = this.config.servico;
    modelo.addEventListener("change", () => {
      if (modelo.value) modeloAtual = modelo.value;
    });
    servico.addEventListener("change", () => {
      const svc = ajustarServico();
      // O `change` É o gesto do usuário: dá para pedir a permissão e já listar.
      if (svc !== "compativel") void carregarModelos(true);
    });
    url.addEventListener("input", ajustarServico);
    buscar.addEventListener("click", () => void carregarModelos(true));
    chave.addEventListener("change", () => {
      if ((servico.value as Servico) !== "compativel") void carregarModelos(false);
    });

    // ------------------------------------------------- skills do usuário
    const listaSkills = h("div", { class: "skills" });
    const novaSkill = h("button", {}, "Nova skill");
    const novaColecao = h("button", { title: "Trazer as skills de uma pasta do GitHub" }, "Skills da equipe");
    const sincronizarAgora = h("button", { title: "Conferir agora os arquivos no GitHub" }, "Sincronizar agora");
    const listaColecoes = h("div", { class: "skills" });
    const desenharSkills = () => {
      listaColecoes.replaceChildren(
        ...this.colecoes.map((col) =>
          h(
            "div",
            { class: "skill colecao" },
            h(
              "div",
              { class: "skill-texto" },
              h("strong", {}, col.nome),
              h("code", {}, `${col.quantas ?? 0} skill(s)`),
              h("small", { class: "origem" }, `${col.sincronizar ? "\u21BB " : ""}${col.url.replace(/^https?:\/\//, "")}${col.sincronizar ? ` \u00B7 ${quando(col.verificadaEm)}` : ""}`),
              col.erroSync ? h("small", { class: "falha" }, col.erroSync) : null,
            ),
            h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${col.nome}`, onclick: () => this.editarColecao(col, desenharSkills) }, icone("lapis", 15)),
            h(
              "button",
              {
                class: "icone",
                title: "Remover a cole\u00E7\u00E3o e as skills dela",
                "aria-label": `Remover ${col.nome}`,
                onclick: async () => {
                  this.colecoes = this.colecoes.filter((c) => c.id !== col.id);
                  this.skills = this.skills.filter((sk) => sk.colecao !== col.id);
                  await guardarColecoes(this.colecoes);
                  await guardarSkills(this.skills);
                  await this.aplicarConfig(this.config);
                  desenharSkills();
                },
              },
              icone("lixeira", 15),
            ),
          ),
        ),
      );
      listaSkills.replaceChildren(
        ...(this.skills.length
          ? this.skills.map((sk) =>
              h(
                "div",
                { class: "skill" },
                h(
                  "div",
                  { class: "skill-texto" },
                  h("strong", {}, sk.nome),
                  h("code", {}, `/${sk.slug}`),
                  h("small", {}, sk.descricao || descricaoDoTexto(sk.texto) || `${sk.texto.length.toLocaleString("pt-BR")} caracteres`),
                  sk.url ? h("small", { class: "origem" }, `${sk.sincronizar ? "\u21BB " : ""}${sk.url.replace(/^https?:\/\//, "")}${sk.sincronizar ? ` \u00B7 ${quando(sk.verificadaEm)}` : ""}`) : null,
                  sk.erroSync ? h("small", { class: "falha" }, `N\u00E3o deu para sincronizar: ${sk.erroSync}`) : null,
                ),
                sk.colecao ? null : h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${sk.nome}`, onclick: () => this.editarSkill(sk, desenharSkills) }, icone("lapis", 15)),
                sk.colecao
                  ? h("span", { class: "etiqueta", title: "Vem da pasta da equipe; para mudar, mude o arquivo no reposit\u00F3rio" }, "equipe")
                  : h(
                      "button",
                      {
                        class: "icone",
                        title: "Remover",
                        "aria-label": `Remover ${sk.nome}`,
                        onclick: async () => {
                          this.skills = this.skills.filter((x) => x.id !== sk.id);
                          await guardarSkills(this.skills);
                          await this.aplicarConfig(this.config);
                          desenharSkills();
                        },
                      },
                      icone("lixeira", 15),
                    ),
              ),
            )
          : [h("div", { class: "ajuda" }, "Nenhuma skill ainda. Uma skill \u00E9 um texto com as regras da sua unidade \u2014 como \u00E9 um despacho de encaminhamento, o que a nota t\u00E9cnica precisa ter \u2014 que o agente carrega s\u00F3 quando o pedido \u00E9 daquele assunto.")]),
      );
    };
    desenharSkills();
    novaSkill.addEventListener("click", () => this.editarSkill(null, desenharSkills));
    novaColecao.addEventListener("click", () => this.editarColecao(null, desenharSkills));
    sincronizarAgora.addEventListener("click", async () => {
      sincronizarAgora.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo os arquivos...";
      const mudaram = await this.sincronizarSkills(true);
      const decolecao = await this.sincronizarColecoes(true);
      desenharSkills();
      status.className = "status ok";
      const partes = [mudaram.length ? `Atualizada(s): ${mudaram.join(", ")}` : "", decolecao].filter(Boolean);
      status.textContent = partes.length ? `${partes.join(" \u00B7 ")}.` : "Nenhuma mudan\u00E7a no GitHub.";
      sincronizarAgora.disabled = false;
    });
    const secaoSkills = h(
      "div",
      { class: "campo" },
      h("label", {}, "Skills (instru\u00E7\u00F5es da sua unidade)"),
      listaSkills,
      listaColecoes,
      h("div", { class: "com-botao" }, novaSkill, novaColecao, this.skills.some((x) => x.url && x.sincronizar) || this.colecoes.length ? sincronizarAgora : null),
      h(
        "div",
        { class: "ajuda" },
        "Na conversa, digite ",
        h("code", {}, "/"),
        " para escolher uma skill; o agente tamb\u00E9m carrega sozinho quando o assunto bate. O conte\u00FAdo pode ser colado ou vir de um arquivo .md do GitHub.",
      ),
    );

    // ------------------------------------------------- regras da unidade
    const listaRegras = h("div", { class: "skills" });
    const novaRegra = h("button", {}, "Nova regra");
    const desenharRegras = () => {
      listaRegras.replaceChildren(
        ...(this.regras.length
          ? this.regras.map((re) =>
              h(
                "div",
                { class: `skill regra ${re.efeito}` },
                h("input", {
                  type: "checkbox",
                  class: "switch",
                  title: re.ativa ? "Ativa" : "Desligada",
                  ...(re.ativa ? { checked: true } : {}),
                  onchange: async (ev: Event) => {
                    re.ativa = (ev.target as HTMLInputElement).checked;
                    await guardarRegras(this.regras);
                  },
                }),
                h(
                  "div",
                  { class: "skill-texto" },
                  h("strong", {}, re.nome),
                  h("code", {}, re.efeito === "bloquear" ? "bloqueia" : "avisa"),
                  h("small", {}, `${re.ferramentas.length ? re.ferramentas.join(", ") : "qualquer altera\u00E7\u00E3o"}${re.contem ? ` \u00B7 contendo "${re.contem}"` : ""}`),
                  h("small", { class: "origem" }, re.mensagem),
                ),
                h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${re.nome}`, onclick: () => this.editarRegra(re, desenharRegras) }, icone("lapis", 15)),
                h(
                  "button",
                  {
                    class: "icone",
                    title: "Remover",
                    "aria-label": `Remover ${re.nome}`,
                    onclick: async () => {
                      this.regras = this.regras.filter((x) => x.id !== re.id);
                      await guardarRegras(this.regras);
                      desenharRegras();
                    },
                  },
                  icone("lixeira", 15),
                ),
              ),
            )
          : [
              h(
                "div",
                { class: "ajuda" },
                "Nenhuma regra. Regra \u00E9 o que o agente N\u00C3O pode fazer nesta unidade (ou o que exige aten\u00E7\u00E3o) \u2014 conferido pelo pr\u00F3prio SEI Pro antes de cada altera\u00E7\u00E3o, sem depender de o modelo lembrar.",
              ),
            ]),
      );
    };
    desenharRegras();
    novaRegra.addEventListener("click", () => this.editarRegra(null, desenharRegras));
    const sugerirRegras = h("button", { title: "Come\u00E7ar com regras prontas" }, "Usar modelos");
    sugerirRegras.addEventListener("click", async () => {
      const faltando = REGRAS_SUGERIDAS.filter((m) => !this.regras.some((r) => r.nome === m.nome));
      this.regras = [...this.regras, ...faltando.map((m) => ({ ...m, id: crypto.randomUUID() }))];
      await guardarRegras(this.regras);
      desenharRegras();
    });
    const secaoRegras = h(
      "div",
      { class: "campo" },
      h("label", {}, "Regras da unidade"),
      listaRegras,
      h("div", { class: "com-botao" }, novaRegra, this.regras.length ? null : sugerirRegras),
      h(
        "div",
        { class: "ajuda" },
        "Uma regra que BLOQUEIA impede a a\u00E7\u00E3o antes de ela ser oferecida para aprova\u00E7\u00E3o, e o agente explica o motivo. Uma regra que AVISA deixa aprovar, com o alerta \u00E0 vista.",
      ),
    );

    // ------------------------------------------------- avançado (controle fino)
    const numero = (rotulo: string, dica: string, min: number, max: number, passo: number, valor: number | undefined, vazio: string) => {
      const campo = h("input", {
        type: "number",
        min: String(min),
        max: String(max),
        step: String(passo),
        placeholder: vazio,
        ...(valor === undefined ? {} : { value: String(valor) }),
        "aria-label": rotulo,
      });
      return { campo, bloco: h("div", { class: "campo-fino" }, h("label", {}, rotulo), campo, h("small", {}, dica)) };
    };
    const temperatura = numero("Temperatura", "0 = sempre a mesma resposta; acima de 1, mais criatividade e mais erro.", 0, 2, 0.1, this.config.ajustes.temperatura, String(TEMPERATURA_PADRAO));
    const topP = numero("Top P", "Corta a cauda das palavras improv\u00E1veis. Mexa nisto OU na temperatura, n\u00E3o nos dois.", 0, 1, 0.05, this.config.ajustes.topP, "padr\u00E3o");
    const maxTokens = numero("M\u00E1ximo de tokens na resposta", "Teto de tamanho da resposta. Curto demais corta o texto no meio.", 1, 200000, 1, this.config.ajustes.maxTokens, "padr\u00E3o");
    const penFrequencia = numero("Penalidade de frequ\u00EAncia", "Desencoraja repetir as mesmas palavras.", -2, 2, 0.1, this.config.ajustes.penalidadeFrequencia, "0");
    const penPresenca = numero("Penalidade de presen\u00E7a", "Empurra o modelo para assuntos novos.", -2, 2, 0.1, this.config.ajustes.penalidadePresenca, "0");
    const instrucoes = h("textarea", { rows: "4", placeholder: "Ex.: cite sempre o n\u00BA SEI entre par\u00EAnteses; trate o leitor por \u201Cvoc\u00EA\u201D.", spellcheck: "true", "aria-label": "Instru\u00E7\u00F5es adicionais" }, this.config.instrucoes);
    const padroes = h("button", {}, "Restaurar padr\u00F5es");
    padroes.addEventListener("click", () => {
      for (const n of [temperatura, topP, maxTokens, penFrequencia, penPresenca]) n.campo.value = "";
      instrucoes.value = "";
    });
    const avancado = h(
      "details",
      { class: "avancado" },
      h("summary", {}, "Avan\u00E7ado"),
      h(
        "div",
        { class: "campo" },
        h("label", {}, "Controle do modelo"),
        h("div", { class: "finos" }, temperatura.bloco, topP.bloco, maxTokens.bloco, penFrequencia.bloco, penPresenca.bloco),
        h("div", { class: "ajuda" }, "Campo em branco usa o padr\u00E3o do servi\u00E7o. Modelo que n\u00E3o aceitar um desses ajustes faz o agente repetir o pedido sem ele."),
      ),
      h(
        "div",
        { class: "campo" },
        h("label", {}, "Instru\u00E7\u00F5es adicionais"),
        instrucoes,
        h("div", { class: "ajuda" }, "Entram no fim das instru\u00E7\u00F5es do agente, para ajustar estilo e prefer\u00EAncias da sua unidade. As regras de seguran\u00E7a (aprova\u00E7\u00E3o antes de escrever, nada de sigiloso, senha nunca na conversa) continuam valendo."),
      ),
      h("div", { class: "com-botao" }, padroes),
    );

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
          ajudaServico,
        ),
        campoUrl,
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Chave"),
          h("div", { class: "com-botao" }, chave, verChave),
          h("div", { class: "ajuda" }, "Fica guardada s\u00F3 neste navegador; o SEI Pro n\u00E3o tem servidor e n\u00E3o v\u00EA a sua chave."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Modelo"),
          h("div", { class: "com-botao" }, modelo, buscar),
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
        secaoSkills,
        secaoRegras,
        avancado,
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
      const svc = servico.value as Servico;
      const comp = svc === "compativel";
      const catalogo = svc === "openrouter";
      const k = chave.value.trim();
      const enderecoLivre = comp ? normalizarUrl(url.value) : "";
      const endereco = enderecoDoServico(svc, enderecoLivre);
      const m = comp ? modeloLivre.value.trim() : modelo.value || modeloAtual || SERVICOS[svc].modeloPadrao || MODELO_PADRAO;
      if (!k) return erro("Informe a chave.");
      if (comp && !/^https?:\/\//.test(endereco)) return erro("Informe o endere\u00E7o do servi\u00E7o (come\u00E7ando com https://).");
      if (!m) return erro(comp ? "Informe o nome do modelo no servi\u00E7o." : "Escolha o modelo.");
      const numeroDe = (e: HTMLInputElement, nome: string, min: number, max: number): number | undefined | null => {
        const t = e.value.trim();
        if (!t) return undefined;
        const v = Number(t.replace(",", "."));
        if (!Number.isFinite(v) || v < min || v > max) {
          erro(`${nome} precisa ser um n\u00FAmero entre ${min} e ${max}.`);
          return null;
        }
        return v;
      };
      const ajustes: Ajustes = {};
      const finos: Array<[keyof Ajustes, HTMLInputElement, string, number, number]> = [
        ["temperatura", temperatura.campo, "A temperatura", 0, 2],
        ["topP", topP.campo, "O Top P", 0, 1],
        ["maxTokens", maxTokens.campo, "O m\u00E1ximo de tokens", 1, 200000],
        ["penalidadeFrequencia", penFrequencia.campo, "A penalidade de frequ\u00EAncia", -2, 2],
        ["penalidadePresenca", penPresenca.campo, "A penalidade de presen\u00E7a", -2, 2],
      ];
      for (const [nome, campo, rotulo, min, max] of finos) {
        const v = numeroDe(campo, rotulo, min, max);
        if (v === null) {
          avancado.open = true;
          return;
        }
        if (v !== undefined) ajustes[nome] = v;
      }
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo...";
      if (!catalogo && !(await autorizarEndereco(endereco))) return erro("O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.");
      const mudou = k !== this.config.chave || svc !== this.config.servico || enderecoLivre !== this.config.url;
      if (mudou) {
        const r = await conferirChave({ chave: k, servico: svc, url: endereco }).catch(() => ({ ok: false }));
        if (!r.ok) return erro(catalogo ? "A chave n\u00E3o foi aceita pelo OpenRouter." : `O ${SERVICOS[svc].nome.replace(/ \(.*\)$/, "")} n\u00E3o aceitou a chave${comp ? " (ou o endere\u00E7o est\u00E1 errado)" : ""}.`);
      }
      await this.aplicarConfig({
        reais: emReais.checked,
        guardar: guardar.checked,
        dias: Number(dias.value),
        servico: svc,
        url: enderecoLivre,
        chave: k,
        modelo: m,
        nomes: nomes.checked,
        cnpj: cnpj.checked,
        ajustes,
        instrucoes: instrucoes.value.trim(),
      });
      dlg.close();
    });
    ajustarServico();
    void carregarModelos(false);
  }

  /**
   * Desfaz uma ação já aplicada no SEI, pela operação inversa.
   *
   * Vai direto pela ponte, sem passar pelo modelo: desfazer é decisão do
   * usuário, e um pedido em linguagem natural poderia virar outra coisa.
   */
  private async desfazer(acao: AcaoFeita): Promise<void> {
    const inversa = inversaDe(acao.tool, acao.args, acao.resultado);
    if (!inversa || acao.desfeita) return;
    if (!confirm(`${inversa.rotulo}?`)) return;
    this.adicionar({ tipo: "tool", rotulo: inversa.rotulo, estado: "rodando" });
    const item = this.transcricao[this.transcricao.length - 1] as Extract<Item, { tipo: "tool" }>;
    try {
      for (const passo of inversa.passos) await this.ponte.executar(passo.op, passo.args);
      acao.desfeita = true;
      const original = this.transcricao.find((i) => i.tipo === "tool" && i.acao === acao.id);
      if (original && original.tipo === "tool") original.desfeita = true;
      item.estado = "ok";
      // O modelo precisa saber, senão segue achando que a ação continua valendo.
      this.motor?.anotar(`O usu\u00E1rio desfez a a\u00E7\u00E3o "${acao.rotulo}" (${inversa.rotulo}).`);
    } catch (e) {
      item.estado = "falha";
      item.detalhe = (e as Error).message;
    }
    this.redesenhar();
    await this.salvarSessao();
  }

  /**
   * Atualiza as skills marcadas para acompanhar o arquivo no GitHub.
   *
   * Em segundo plano, sem travar o painel: quem depende disso é a próxima
   * pergunta, não a abertura. Só busca onde o navegador já autorizou o
   * endereço — pedir permissão exige um clique, e aqui não há nenhum.
   */
  private async sincronizarSkills(forcar = false): Promise<string[]> {
    if (!this.skills.some((s) => s.url && s.sincronizar)) return [];
    // Sem pedir permissão: o GitHub responde com CORS liberado, e pedir
    // permissão fora de um clique trava esperando um diálogo que ninguém vê.
    // Se o endereço do usuário não liberar, a falha vira `erroSync` na lista.
    const { lista, mudaram } = await sincronizarSkills(this.skills, { forcar });
    if (JSON.stringify(lista) === JSON.stringify(this.skills)) return [];
    this.skills = lista;
    await guardarSkills(lista);
    // O motor em curso carrega as skills no prompt e no skill_ler: precisa ser refeito.
    if (mudaram.length) await this.aplicarConfig(this.config);
    return mudaram;
  }

  /**
   * Atualiza as coleções da equipe (pastas do GitHub).
   *
   * Espaçada como a das skills e pelo mesmo motivo: a API do GitHub sem
   * autenticação dá 60 consultas por hora, e uma coleção gasta uma por
   * verificação mais uma por arquivo novo.
   */
  private async sincronizarColecoes(forcar = false): Promise<string> {
    const alvos = this.colecoes.filter((c) => c.sincronizar || forcar);
    if (!alvos.length) return "";
    const agora = Date.now();
    const partes: string[] = [];
    let mexeu = false;
    for (const col of alvos) {
      if (!forcar && col.verificadaEm && agora - col.verificadaEm < INTERVALO_COLECAO) continue;
      try {
        const baixadas = await baixarColecao(col.url);
        const r = mesclarColecao(this.skills, col, baixadas, agora);
        this.skills = r.lista;
        this.colecoes = this.colecoes.map((c) => (c.id === col.id ? { ...c, verificadaEm: agora, quantas: baixadas.length, erroSync: undefined } : c));
        mexeu = true;
        if (r.novas || r.atualizadas || r.removidas) {
          partes.push(`${col.nome}: ${[r.novas && `${r.novas} nova(s)`, r.atualizadas && `${r.atualizadas} atualizada(s)`, r.removidas && `${r.removidas} removida(s)`].filter(Boolean).join(", ")}`);
        }
      } catch (e) {
        this.colecoes = this.colecoes.map((c) => (c.id === col.id ? { ...c, verificadaEm: agora, erroSync: (e as Error).message } : c));
        mexeu = true;
        partes.push(`${col.nome}: ${(e as Error).message}`);
      }
    }
    if (mexeu) {
      await guardarSkills(this.skills);
      await guardarColecoes(this.colecoes);
      await this.aplicarConfig(this.config);
    }
    return partes.join(" \u00B7 ");
  }

  /** Cadastro de uma coleção da equipe: nome e a pasta do GitHub. */
  private editarColecao(colecao: ColecaoSkills | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: colecao?.nome ?? "", placeholder: "Skills da minha unidade", "aria-label": "Nome da cole\u00E7\u00E3o" });
    const url = h("input", {
      type: "url",
      value: colecao?.url ?? "",
      placeholder: "https://github.com/orgao/skills-sei/tree/main/skills",
      spellcheck: "false",
      "aria-label": "Pasta no GitHub",
    });
    const sincronizar = h("input", { type: "checkbox", class: "switch", ...(colecao?.sincronizar ? { checked: true } : {}) });
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, colecao ? "Salvar" : "Adicionar");
    const dlg = this.abrirModal({
      titulo: colecao ? "Editar cole\u00E7\u00E3o" : "Skills da equipe",
      corpo: [
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Nome"),
          nome,
          h("div", { class: "ajuda" }, "Como a sua unidade chama esse conjunto de instru\u00E7\u00F5es."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Pasta no GitHub"),
          url,
          h(
            "div",
            { class: "ajuda" },
            "Cada arquivo .md da pasta vira uma skill (o README fica de fora). Quem cuida do padr\u00E3o edita o reposit\u00F3rio; todo mundo recebe.",
          ),
        ),
        h(
          "label",
          { class: "linha-switch" },
          sincronizar,
          h("span", {}, "Manter sincronizada", h("small", {}, "Confere a pasta a cada 12 horas. Skill que sai da pasta sai daqui tamb\u00E9m.")),
        ),
        h(
          "div",
          { class: "nota" },
          icone("escudo", 15),
          h("span", {}, "As skills da equipe n\u00E3o se editam aqui: elas s\u00E3o um espelho do reposit\u00F3rio. Para mudar, mude o arquivo l\u00E1."),
        ),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    salvar.addEventListener("click", async () => {
      const erro = (t: string) => {
        status.className = "status erro";
        status.textContent = t;
        salvar.disabled = false;
      };
      const n = nome.value.trim();
      const u = url.value.trim();
      if (!n) return erro("Informe o nome da cole\u00E7\u00E3o.");
      if (!partesDoGitHub(u)) return erro("Informe a pasta no GitHub (github.com/dono/repo/tree/branch/pasta).");
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Buscando as skills...";
      const nova: ColecaoSkills = { id: colecao?.id ?? crypto.randomUUID(), nome: n, url: u, sincronizar: sincronizar.checked };
      try {
        const baixadas = await baixarColecao(u);
        const r = mesclarColecao(this.skills, nova, baixadas);
        this.skills = r.lista;
        this.colecoes = colecao ? this.colecoes.map((c) => (c.id === colecao.id ? { ...nova, verificadaEm: Date.now(), quantas: baixadas.length } : c)) : [...this.colecoes, { ...nova, verificadaEm: Date.now(), quantas: baixadas.length }];
        await guardarSkills(this.skills);
        await guardarColecoes(this.colecoes);
        await this.aplicarConfig(this.config);
        aoFechar();
        dlg.close();
      } catch (e) {
        return erro(
          e instanceof TypeError
            ? "N\u00E3o foi poss\u00EDvel falar com o GitHub (rede do \u00F3rg\u00E3o?). Confira se github.com est\u00E1 liberado."
            : (e as Error).message,
        );
      }
    });
  }

  /** Cadastro de uma regra da unidade. */
  private editarRegra(regra: Regra | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: regra?.nome ?? "", placeholder: "Nunca enviar processo sem revis\u00E3o", "aria-label": "Nome da regra" });
    const efeito = h(
      "select",
      { "aria-label": "Efeito" },
      h("option", { value: "bloquear", ...(regra?.efeito !== "avisar" ? { selected: true } : {}) }, "Bloquear a a\u00E7\u00E3o"),
      h("option", { value: "avisar", ...(regra?.efeito === "avisar" ? { selected: true } : {}) }, "Deixar passar, com aviso"),
    );
    // Só ferramentas que MUDAM algo no SEI: regra sobre leitura não faz sentido.
    const escritas = [...TOOLS_SEI, ...toolsMotor()].filter((t) => t.efeito !== "leitura" && t.efeito !== "interna").map((t) => t.nome).sort();
    const ferramentas = h(
      "select",
      { multiple: true, size: "8", "aria-label": "A\u00E7\u00F5es alcan\u00E7adas" },
      ...escritas.map((n) => h("option", { value: n, ...(regra?.ferramentas.includes(n) ? { selected: true } : {}) }, n)),
    );
    const contem = h("input", { type: "text", value: regra?.contem ?? "", placeholder: "Portaria, GABIN, sigiloso...", "aria-label": "Condi\u00E7\u00E3o de texto" });
    const mensagem = h("textarea", { rows: "2", "aria-label": "Mensagem" }, regra?.mensagem ?? "");
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, regra ? "Salvar" : "Adicionar");
    const dlg = this.abrirModal({
      titulo: regra ? "Editar regra" : "Nova regra",
      corpo: [
        h("div", { class: "campo" }, h("label", {}, "Nome"), nome),
        h("div", { class: "campo" }, h("label", {}, "O que fazer"), efeito),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "A\u00E7\u00F5es alcan\u00E7adas"),
          ferramentas,
          h("div", { class: "ajuda" }, "Segure Ctrl (ou Cmd) para escolher v\u00E1rias. Nenhuma escolhida = qualquer altera\u00E7\u00E3o no SEI."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "S\u00F3 quando aparecer (opcional)"),
          contem,
          h("div", { class: "ajuda" }, "Palavra que precisa estar no pedido \u2014 o tipo do documento, a sigla da unidade de destino, um termo. Sem acento e mai\u00FAscula n\u00E3o importam."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Mensagem"),
          mensagem,
          h("div", { class: "ajuda" }, "Aparece para voc\u00EA e vai para o agente, que explica na conversa em vez de tentar de novo."),
        ),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });
    salvar.addEventListener("click", async () => {
      const n = nome.value.trim();
      const msg = mensagem.value.trim();
      if (!n || !msg) {
        status.className = "status erro";
        status.textContent = "Informe o nome e a mensagem.";
        return;
      }
      const nova: Regra = {
        id: regra?.id ?? crypto.randomUUID(),
        nome: n,
        ativa: regra?.ativa ?? true,
        efeito: efeito.value as Regra["efeito"],
        ferramentas: [...ferramentas.selectedOptions].map((o) => o.value),
        ...(contem.value.trim() ? { contem: contem.value.trim() } : {}),
        mensagem: msg,
      };
      this.regras = regra ? this.regras.map((x) => (x.id === regra.id ? nova : x)) : [...this.regras, nova];
      await guardarRegras(this.regras);
      aoFechar();
      dlg.close();
    });
  }

  /**
   * Cadastro de uma skill, em modal por cima da configuração.
   *
   * O conteúdo pode ser colado ou vir de um `.md` do GitHub — e, vindo de lá,
   * o texto é baixado e GUARDADO: a conversa não pode depender de a rede
   * alcançar o GitHub no meio do pedido.
   */
  private editarSkill(skill: SkillUsuario | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: skill?.nome ?? "", placeholder: "Despacho de encaminhamento", "aria-label": "Nome da skill" });
    const slug = h("input", { type: "text", value: skill?.slug ?? "", placeholder: "despacho-encaminhamento", spellcheck: "false", "aria-label": "Atalho" });
    const descricao = h("input", { type: "text", value: skill?.descricao ?? "", placeholder: "Quando usar: encaminhar processo a outra unidade", "aria-label": "Descri\u00E7\u00E3o" });
    const url = h("input", { type: "url", value: skill?.url ?? "", placeholder: "https://github.com/orgao/repo/blob/main/despacho.md", spellcheck: "false", "aria-label": "Arquivo .md no GitHub" });
    const texto = h("textarea", { rows: "8", spellcheck: "true", "aria-label": "Conte\u00FAdo da skill" }, skill?.texto ?? "");
    const buscar = h("button", {}, "Buscar do GitHub");
    const sincronizar = h("input", { type: "checkbox", class: "switch", ...(skill?.sincronizar ? { checked: true } : {}) });
    const linhaSync = h(
      "label",
      { class: "linha-switch" },
      sincronizar,
      h(
        "span",
        {},
        "Manter sincronizada com o GitHub",
        h("small", {}, "Desligado, o texto fica como est\u00E1 hoje. Ligado, o agente confere o arquivo a cada 6 horas e traz as mudan\u00E7as sozinho."),
      ),
    );
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, skill ? "Salvar" : "Adicionar");

    // Guardados quando o botão busca, para a primeira sincronização não repetir o download.
    let etagBaixado = skill?.etag;
    let verificadaEmBaixado = skill?.verificadaEm;

    const ajustarSync = () => {
      const tem = /^https?:\/\//.test(url.value.trim());
      linhaSync.hidden = !tem;
      if (!tem) sincronizar.checked = false;
      if (url.value.trim() !== skill?.url) {
        etagBaixado = undefined;
        verificadaEmBaixado = undefined;
      }
    };
    url.addEventListener("input", ajustarSync);
    ajustarSync();

    // O slug acompanha o nome enquanto o usuário não o editar à mão.
    let slugManual = Boolean(skill);
    slug.addEventListener("input", () => (slugManual = true));
    nome.addEventListener("input", () => {
      if (!slugManual) slug.value = slugLivre(nome.value, this.skills, skill?.id);
    });

    buscar.addEventListener("click", async () => {
      const endereco = url.value.trim();
      if (!/^https?:\/\//.test(endereco)) {
        status.className = "status erro";
        status.textContent = "Informe o endere\u00E7o do arquivo .md.";
        return;
      }
      status.className = "status";
      status.textContent = "Buscando...";
      try {
        const r = await baixarSkillSeMudou(endereco);
        const conteudo = r?.texto ?? "";
        etagBaixado = r?.etag;
        verificadaEmBaixado = Date.now();
        texto.value = conteudo;
        if (!nome.value.trim()) {
          nome.value = decodeURIComponent(endereco.split("/").pop() ?? "").replace(/\.mdx?$/i, "").replace(/[-_]+/g, " ");
          if (!slugManual) slug.value = slugLivre(nome.value, this.skills, skill?.id);
        }
        if (!descricao.value.trim()) descricao.value = descricaoDoTexto(conteudo);
        status.className = "status ok";
        status.textContent = `${conteudo.length.toLocaleString("pt-BR")} caracteres carregados.`;
      } catch (e) {
        status.className = "status erro";
        status.textContent =
          e instanceof TypeError
            ? "N\u00E3o foi poss\u00EDvel falar com esse endere\u00E7o (rede do \u00F3rg\u00E3o ou servidor sem libera\u00E7\u00E3o para o navegador)."
            : (e as Error).message;
      }
    });

    const dlg = this.abrirModal({
      titulo: skill ? "Editar skill" : "Nova skill",
      corpo: [
        h("div", { class: "campo" }, h("label", {}, "Nome"), nome),
        h("div", { class: "campo" }, h("label", {}, "Atalho"), h("div", { class: "com-botao" }, h("span", { class: "ajuda" }, "/"), slug), h("div", { class: "ajuda" }, "\u00C9 assim que voc\u00EA chama a skill na conversa: digite / e escolha na lista.")),
        h("div", { class: "campo" }, h("label", {}, "Quando usar"), descricao, h("div", { class: "ajuda" }, "Uma linha. O agente l\u00EA isto para decidir sozinho se a skill serve ao pedido.")),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Arquivo no GitHub (opcional)"),
          h("div", { class: "com-botao" }, url, buscar),
          h("div", { class: "ajuda" }, "Link do arquivo .md em reposit\u00F3rio p\u00FAblico. O conte\u00FAdo \u00E9 copiado para c\u00E1, e \u00E9 esse texto que o agente usa."),
          linhaSync,
        ),
        h("div", { class: "campo" }, h("label", {}, "Conte\u00FAdo"), texto, h("div", { class: "ajuda" }, `Texto ou markdown, at\u00E9 ${LIMITE_SKILL.toLocaleString("pt-BR")} caracteres. Vale escrever como se fosse uma instru\u00E7\u00E3o para um colega novo.`)),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    salvar.addEventListener("click", async () => {
      const erro = (t: string) => {
        status.className = "status erro";
        status.textContent = t;
      };
      const n = nome.value.trim();
      const conteudo = texto.value.trim();
      if (!n) return erro("Informe o nome da skill.");
      if (!conteudo) return erro("Informe o conte\u00FAdo (cole o texto ou busque do GitHub).");
      if (conteudo.length > LIMITE_SKILL) return erro(`O conte\u00FAdo passa de ${LIMITE_SKILL.toLocaleString("pt-BR")} caracteres.`);
      const s = slugLivre(slug.value.trim() || n, this.skills, skill?.id);
      const nova: SkillUsuario = {
        id: skill?.id ?? crypto.randomUUID(),
        nome: n,
        slug: s,
        descricao: descricao.value.trim() || descricaoDoTexto(conteudo),
        texto: conteudo,
        ...(url.value.trim() ? { url: url.value.trim(), sincronizar: sincronizar.checked, etag: etagBaixado, verificadaEm: verificadaEmBaixado } : {}),
        atualizadaEm: Date.now(),
      };
      this.skills = skill ? this.skills.map((x) => (x.id === skill.id ? nova : x)) : [...this.skills, nova];
      await guardarSkills(this.skills);
      // O motor já em curso precisa saber das skills novas (elas vão no prompt e no skill_ler).
      await this.aplicarConfig(this.config);
      aoFechar();
      dlg.close();
    });
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
      provedor: criarProvedor({ servico: this.config.servico, url: this.config.url, chave: this.config.chave, modelo: this.config.modelo, ajustes: this.config.ajustes }),
      tools: new RegistroTools([...TOOLS_SEI, ...toolsMotor(this.skills)]),
      ui: this.interfaceMotor(),
      privacidade: this.privacidade,
      sei: (op, args, sinal) => (op === "editores" ? Promise.resolve(this.ponte.editores()) : this.ponte.executar(op, args, sinal)),
      sistema: (tela) => promptSistema(tela, new Date(), this.config.instrucoes, this.skills),
      regras: (passos) => {
        const v = avaliarRegras(this.regras, passos);
        return { bloqueios: v.bloqueios, avisos: v.avisos.map((a) => `${a.regra.mensagem} (regra "${a.regra.nome}")`), recado: recadoDoBloqueio(v) };
      },
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
    // `/slug` na mensagem: o conteúdo da skill vai junto, como material de apoio.
    const usadas = skillsCitadas(t, this.skills);
    const comContexto = comSkills(comAnexo, usadas);
    this.adicionar({ tipo: "usuario", texto: this.anexo ? `${t}\n\u{1F4CE} ${this.anexo.nome}` : t });
    for (const sk of usadas) this.adicionar({ tipo: "tool", rotulo: `Skill: ${sk.nome}`, estado: "ok" });
    this.anexo = null;
    this.elAnexo.hidden = true;
    try {
      const promessa = this.motor.enviar(comContexto);
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
      const acao = item.acao ? this.feitos.get(item.acao) : undefined;
      const inversa = acao && !acao.desfeita ? inversaDe(acao.tool, acao.args, acao.resultado) : null;
      const motivo = acao && !inversa && !acao.desfeita ? motivoSemDesfazer(acao.tool) : "";
      return h(
        "div",
        { class: `tool ${item.estado === "rodando" ? "" : item.estado}` },
        item.rotulo,
        item.detalhe ? h("span", { class: "detalhe" }, ` \u2014 ${item.detalhe}`) : null,
        item.desfeita ? h("span", { class: "detalhe" }, " \u2014 desfeita") : null,
        inversa
          ? h("button", { class: "plana desfazer", title: inversa.rotulo, onclick: () => void this.desfazer(acao as AcaoFeita) }, icone("voltar", 13), "Desfazer")
          : null,
        motivo ? h("span", { class: "detalhe", title: `N\u00E3o d\u00E1 para desfazer: ${motivo}` }, " \u2014 sem desfazer") : null,
      );
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
      escritaFeita: (id, tool, args, resultado) => {
        const r = (resultado ?? {}) as ResultadoDeEscrita;
        if (r.aplicado === false) return;
        const t = this.toolsEl.get(id);
        this.feitos.set(id, { id, tool, rotulo: t?.item.rotulo ?? tool, args, resultado: r, quando: Date.now() });
        // Marca o item ANTES de `toolTerminada` redesenhá-lo: é assim que o
        // botão de desfazer nasce junto com a linha da ação.
        if (t) t.item.acao = id;
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
        ...(p.avisos ?? []).map((a) => h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, a))),
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
Object.defineProperty(window, "agenteIADiag", { value: { extrairTextoPdf, historico, inversaDe } });
void app.iniciar();
