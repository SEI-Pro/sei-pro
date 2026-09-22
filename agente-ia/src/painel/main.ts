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
import { conferirChave, criarProvedorOpenRouter, listarModelos, MODELO_PADRAO } from "../motor/provedor";
import { RegistroTools } from "../motor/tools";
import type { DecisaoPlano, InterfaceMotor, Mensagem, PlanoPrevisto, Tarefa, Uso } from "../motor/tipos";
import { PontePainel } from "../ponte/cliente";
import { TOOLS_MOTOR } from "../tools/motor";
import { TOOLS_SEI } from "../tools/sei";
import { h, icone, markdown, moeda } from "./dom";
import { extrairTextoPdf } from "./pdf";

interface Config {
  chave: string;
  modelo: string;
  nomes: boolean;
  cnpj: boolean;
}

type Item =
  | { tipo: "usuario" | "agente" | "aviso" | "erro" | "decisao"; texto: string }
  | { tipo: "tool"; rotulo: string; estado: "rodando" | "ok" | "falha"; detalhe?: string };

const CHAVE_CONFIG = "agenteIA_config";
const CHAVE_SESSAO = "agenteIA_conversa";

const PRIVACIDADE_CURTA =
  "Dados pessoais s\u00E3o mascarados antes de sair do navegador. Documentos restritos s\u00F3 com a sua autoriza\u00E7\u00E3o, sigilosos nunca, e toda altera\u00E7\u00E3o no SEI passa pela sua aprova\u00E7\u00E3o.";

const PRIVACIDADE =
  "Antes de qualquer texto sair do navegador, CPF, e-mail, telefone, endere\u00E7o, conta banc\u00E1ria, CID e outros dados pessoais s\u00E3o trocados por r\u00F3tulos como [CPF_1]. Documentos restritos s\u00F3 s\u00E3o lidos com a sua autoriza\u00E7\u00E3o; processos sigilosos nunca. Toda altera\u00E7\u00E3o no SEI precisa da sua aprova\u00E7\u00E3o.";

const ATALHOS: Array<{ rotulo: string; descricao: string; prompt: string }> = [
  {
    rotulo: "Resumir este processo",
    descricao: "objeto, partes, atos e situa\u00E7\u00E3o",
    prompt: "Leia os documentos deste processo e fa\u00E7a um resumo: objeto, partes, principais atos em ordem e situa\u00E7\u00E3o atual.",
  },
  {
    rotulo: "Pend\u00EAncias da unidade",
    descricao: "por marcador, com o que est\u00E1 parado",
    prompt: "Liste os processos da minha unidade agrupados por marcador e aponte os que parecem parados ou com prazo vencido.",
  },
  {
    rotulo: "Documentos sem assinatura",
    descricao: "no processo aberto",
    prompt: "Neste processo, quais documentos ainda n\u00E3o foram assinados?",
  },
  {
    rotulo: "Linguagem simples",
    descricao: "explicar o documento na tela",
    prompt: "Explique em linguagem simples o documento que estou vendo (ou o \u00FAltimo documento deste processo).",
  },
];

class App {
  private readonly raiz = document.getElementById("app")!;
  private readonly ponte = new PontePainel();
  private config: Config = { chave: "", modelo: MODELO_PADRAO, nomes: true, cnpj: false };
  private privacidade = new Pseudonimos();
  private motor: Motor | null = null;
  private transcricao: Item[] = [];
  private uso: Uso = { entrada: 0, saida: 0, custo: 0 };
  private tarefas: Tarefa[] = [];
  private anexo: { nome: string; texto: string } | null = null;

  // elementos da tela
  private elConversa!: HTMLElement;
  private elAba!: HTMLElement;
  private elCusto!: HTMLElement;
  private elTarefas!: HTMLElement;
  private elEntrada!: HTMLTextAreaElement;
  private elEnviar!: HTMLButtonElement;
  private elAnexo!: HTMLElement;
  private elMenu!: HTMLElement;
  private bolhaAtual: { el: HTMLElement; texto: string; pendente: boolean } | null = null;
  private aoFimDoPlano: (() => void) | null = null;
  private toolsEl = new Map<string, { el: HTMLElement; item: Extract<Item, { tipo: "tool" }> }>();

  async iniciar(): Promise<void> {
    await this.ponte.iniciar();
    const salvo = (await chrome.storage.local.get(CHAVE_CONFIG))[CHAVE_CONFIG] as Partial<Config> | undefined;
    this.config = { ...this.config, ...salvo };
    this.ponte.aoMudar(() => this.atualizarAba());
    await this.telaConversa();
    if (!this.config.chave) this.abrirConfig(true);
  }

  // ------------------------------------------------------------- tela

  private async telaConversa(): Promise<void> {
    this.motor ??= this.criarMotor();
    this.elAba = h("span", { class: "aba" });
    this.elCusto = h("span", { class: "custo", title: "Custo desta conversa informado pelo OpenRouter" });
    this.elTarefas = h("div", { class: "tarefas", hidden: true });
    this.elConversa = h("div", { class: "conversa", role: "log", "aria-live": "polite" });
    this.elEntrada = h("textarea", { rows: "2", placeholder: "Pe\u00E7a algo sobre o SEI...", "aria-label": "Mensagem" });
    this.elEnviar = h("button", { class: "enviar" });
    this.elAnexo = h("div", { class: "anexo", hidden: true });
    this.elMenu = h("div", { class: "menu", role: "menu", hidden: true });

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

    this.elMenu.replaceChildren(...ATALHOS.map((a) => h("button", { role: "menuitem", onclick: () => ((this.elMenu.hidden = true), void this.enviar(a.prompt)) }, a.rotulo)));
    sugerir.addEventListener("click", (ev) => {
      ev.stopPropagation();
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
        h("span", { class: "logo" }, icone("faisca", 17)),
        h("span", { class: "marca" }, h("strong", {}, "Agente de IA"), h("span", {}, "SEI Pro")),
        this.elCusto,
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
      ),
    );
    await this.restaurarSessao();
    this.atualizarAba();
    this.redesenhar();
    this.elEntrada.focus();
  }

  private atualizarAba(): void {
    if (!this.elAba) return;
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
    this.elEnviar.disabled = !ocupado && (!this.elEntrada.value.trim() || !this.config.chave);
  }

  // ------------------------------------------------------------- configuração

  /** Configuração em modal. `obrigatorio`: primeira vez, sem chave — não fecha sem salvar. */
  private abrirConfig(obrigatorio = false): void {
    const chave = h("input", { type: "password", placeholder: "sk-or-v1-...", value: this.config.chave, autocomplete: "off", autofocus: true, "aria-label": "Chave do OpenRouter" });
    const verChave = h("button", { class: "icone", title: "Mostrar a chave", "aria-label": "Mostrar a chave" }, icone("olho"));
    verChave.addEventListener("click", () => {
      const escondida = chave.type === "password";
      chave.type = escondida ? "text" : "password";
      verChave.replaceChildren(icone(escondida ? "olhoCorte" : "olho"));
      verChave.setAttribute("title", escondida ? "Ocultar a chave" : "Mostrar a chave");
    });
    const modelo = h("select", { "aria-label": "Modelo" }, h("option", { value: this.config.modelo }, this.config.modelo));
    const status = h("div", { class: "status" });
    const nomes = h("input", { type: "checkbox", class: "switch", ...(this.config.nomes ? { checked: true } : {}) });
    const cnpj = h("input", { type: "checkbox", class: "switch", ...(this.config.cnpj ? { checked: true } : {}) });
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

    const salvar = h("button", { class: "primario" }, obrigatorio ? "Salvar e come\u00E7ar" : "Salvar");
    const fechar = h("button", { class: "icone", title: "Fechar", "aria-label": "Fechar" }, icone("fechar"));
    const dlg = h(
      "dialog",
      { class: "modal", "aria-labelledby": "tituloConfig", closedby: obrigatorio ? "none" : "any" },
      h("div", { class: "modal-topo" }, h("h2", { id: "tituloConfig" }, "Configura\u00E7\u00E3o"), obrigatorio ? null : fechar),
      h(
        "div",
        { class: "modal-corpo" },
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Chave do OpenRouter"),
          h("div", { class: "com-botao" }, chave, verChave),
          h("div", { class: "ajuda" }, "Crie em openrouter.ai/keys. Fica guardada s\u00F3 neste navegador; o SEI Pro n\u00E3o tem servidor e n\u00E3o v\u00EA a sua chave."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Modelo"),
          modelo,
          h("div", { class: "ajuda" }, "Somente modelos que usam ferramentas. Pre\u00E7os em d\u00F3lares por milh\u00E3o de tokens (entrada / sa\u00EDda)."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Privacidade"),
          h("label", { class: "linha-switch" }, nomes, h("span", {}, "Mascarar nomes de pessoas", h("small", {}, "Interessados e nomes ap\u00F3s \u201CSr.\u201D, \u201Crequerente\u201D, \u201Cfilho de\u201D..."))),
          h("label", { class: "linha-switch" }, cnpj, h("span", {}, "Mascarar tamb\u00E9m CNPJ", h("small", {}, "Empresas; CPF, e-mail e telefone s\u00E3o sempre mascarados."))),
          h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, PRIVACIDADE)),
        ),
      ),
      h("div", { class: "modal-acoes" }, status, obrigatorio ? null : h("button", { onclick: () => dlgFechar() }, "Cancelar"), salvar),
    );
    const dlgFechar = () => dlg.close();

    salvar.addEventListener("click", async () => {
      const k = chave.value.trim();
      if (!k) {
        status.className = "status erro";
        status.textContent = "Informe a chave.";
        return;
      }
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo a chave...";
      if (k !== this.config.chave) {
        const r = await conferirChave(k).catch(() => ({ ok: false }));
        if (!r.ok) {
          status.className = "status erro";
          status.textContent = "A chave n\u00E3o foi aceita pelo OpenRouter.";
          salvar.disabled = false;
          return;
        }
      }
      await this.aplicarConfig({ chave: k, modelo: modelo.value || MODELO_PADRAO, nomes: nomes.checked, cnpj: cnpj.checked });
      dlg.close();
    });
    fechar.addEventListener("click", dlgFechar);
    // Esc e clique fora: `closedby` resolve no Chrome 134+/Firefox 141+; abaixo disso, à mão.
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      if (obrigatorio) dlg.addEventListener("cancel", (ev) => ev.preventDefault());
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
  }

  /** Salva a configuração e refaz o motor mantendo a conversa e os pseudônimos. */
  private async aplicarConfig(nova: Config): Promise<void> {
    this.config = nova;
    await chrome.storage.local.set({ [CHAVE_CONFIG]: this.config });
    this.motor?.parar();
    const historico = this.motor?.mensagens() ?? [];
    this.motor = this.criarMotor(Pseudonimos.importar(this.privacidade.exportar(), { nomes: nova.nomes, cnpj: nova.cnpj }));
    if (historico.length) this.motor.restaurar([...historico], this.uso);
    this.redesenhar();
    this.elEntrada.focus();
  }

  // ------------------------------------------------------------- conversa

  /** `mapa`: pseudônimos restaurados da sessão; sem ele, conversa nova. */
  private criarMotor(mapa?: Pseudonimos): Motor {
    this.privacidade = mapa ?? new Pseudonimos({ nomes: this.config.nomes, cnpj: this.config.cnpj });
    return new Motor({
      provedor: criarProvedorOpenRouter({ chave: this.config.chave, modelo: this.config.modelo }),
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
    const comAnexo = this.anexo ? `${t}\n\n[Anexo: ${this.anexo.nome}]\n${this.anexo.texto}` : t;
    this.adicionar({ tipo: "usuario", texto: this.anexo ? `${t}\n\u{1F4CE} ${this.anexo.nome}` : t });
    this.anexo = null;
    this.elAnexo.hidden = true;
    try {
      const promessa = this.motor.enviar(comAnexo);
      this.estadoEnvio();
      await promessa;
    } catch (e) {
      this.adicionar({ tipo: "erro", texto: (e as Error).message });
    } finally {
      this.estadoEnvio();
      await this.salvarSessao();
    }
  }

  private async novaConversa(): Promise<void> {
    this.motor?.parar();
    this.motor = this.criarMotor();
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
      return el;
    }
    if (item.tipo === "aviso" || item.tipo === "decisao") return h("div", { class: "msg aviso" }, icone("alerta", 14), h("span", {}, item.texto));
    if (item.tipo === "erro") return h("div", { class: "msg erro" }, icone("alerta", 14), h("span", {}, item.texto));
    return h("div", { class: "msg usuario" }, item.texto);
  }

  private redesenhar(): void {
    this.elConversa.replaceChildren(...this.transcricao.map((i) => this.desenharItem(i)));
    if (!this.transcricao.length) this.elConversa.append(this.boasVindas());
    this.elCusto.textContent = this.uso.custo ? moeda(this.uso.custo) : "";
    this.desenharTarefas();
    this.estadoEnvio();
    this.rolar();
  }

  /** Tela de início: o que o agente faz, sugestões de pedido e o aviso de privacidade. */
  private boasVindas(): HTMLElement {
    return h(
      "div",
      { class: "vazio" },
      h("span", { class: "logo" }, icone("faisca", 26)),
      h("h2", {}, "O que fa\u00E7o no SEI por voc\u00EA?"),
      h("p", {}, "Consulto processos e documentos, altero sigilo em lote, crio e escrevo documentos, marco, anoto e atribuo processos."),
      this.config.chave
        ? h(
            "div",
            { class: "sugestoes" },
            ...ATALHOS.map((a) =>
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
            b.el.replaceChildren(markdown(b.texto));
            this.rolar();
          });
        }
      },
      fimDaResposta: () => {
        this.fecharBolha();
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
        this.elCusto.textContent = moeda(u.custo);
      },
      aviso: (t) => (this.fecharBolha(), void this.adicionar({ tipo: "aviso", texto: t })),
    };
  }

  private fecharBolha(): void {
    if (!this.bolhaAtual) return;
    const b = this.bolhaAtual;
    this.bolhaAtual = null;
    if (b.texto.trim()) {
      this.transcricao.push({ tipo: "agente", texto: b.texto });
      b.el.replaceChildren(markdown(b.texto));
    } else b.el.remove();
  }

  /** Fecha as ações de um cartão decidido, deixando no lugar o que foi decidido. */
  private encerrarCartao(cartao: HTMLElement, seletor: string, texto: string, sim: boolean): HTMLElement {
    const aviso = h("div", { class: "decidido" }, icone(sim ? "check" : "fechar", 14), h("span", {}, texto));
    cartao.querySelector(seletor)?.replaceWith(aviso);
    this.transcricao.push({ tipo: "decisao", texto });
    return aviso;
  }

  private cartaoPlano(p: PlanoPrevisto): Promise<DecisaoPlano> {
    this.fecharBolha();
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

  private async salvarSessao(): Promise<void> {
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
Object.defineProperty(window, "agenteIADiag", { value: { extrairTextoPdf } });
void app.iniciar();
