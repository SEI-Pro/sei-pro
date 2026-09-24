/**
 * Estúdio de Fluxo: a página onde a unidade escreve o próprio rito.
 *
 * Em TELA CHEIA, e não numa segunda sidebar: o Chrome mostra um painel lateral
 * por vez (abrir o estúdio fecharia o agente) e um editor de etapas precisa de
 * largura.
 *
 * Funciona SEM chave de IA. Mapear, editar, ligar e desligar fluxo é tudo
 * local; a chave só entra em "aprender de processo modelo", que é uma chamada
 * ao modelo com metadados. Sem chave, esse botão explica o que falta em vez de
 * desaparecer — botão que some deixa o usuário sem saber que a função existe.
 *
 * O DOM é montado com o `h` do painel, sem innerHTML com texto externo: nome de
 * fluxo, título de documento e proposta do modelo entram como nó de texto.
 */

import { h, icone } from "../painel/dom";
import { PontePainel } from "../ponte/cliente";
import { criarProvedor, MODELO_PADRAO, type Ajustes, type Servico } from "../motor/provedor";
import { inferirFluxo, type ProcessoModelo } from "../fluxos/inferir";
import { andamentosDoHistorico, comAcao, comDesvio, deLinhas, metadadosDaArvore, numerosDeProcesso, paraLinhas, resumoDoAlcance, textoDoDiagnostico } from "./campos";
import type { RespostaFluxo } from "../ponte/operacoes";
import type { TelaAtual } from "../motor/motor";
import {
  etapaNova,
  fluxoNovo,
  guardarFluxos,
  listarFluxos,
  listarIgnorados,
  validarFluxo,
  CHAVE_FLUXOS,
  type Etapa,
  type Fluxo,
} from "../fluxos/modelo";

/** O que o estúdio precisa da configuração do agente (mesma chave, mesmo storage). */
interface ConfigIA {
  servico: Servico;
  url: string;
  chave: string;
  modelo: string;
  /** Modelo das tarefas auxiliares: inferir fluxo é trabalho mecânico de leitura. */
  modeloAuxiliar: string;
  ajustes: Ajustes;
  cache: boolean;
}

const CHAVE_CONFIG = "agenteIA_config";

const SEM_CHAVE = "Isto precisa do Agente de IA configurado: abra o painel do agente e informe a chave do serviço de IA.";

const ORIGEM: Record<Fluxo["origem"], string> = { manual: "escrito à mão", inferido: "aprendido de processo modelo", colecao: "coleção da equipe" };

class Estudio {
  private readonly raiz = document.getElementById("app")!;
  private readonly ponte = new PontePainel();
  private config: ConfigIA = { servico: "openrouter", url: "", chave: "", modelo: MODELO_PADRAO, modeloAuxiliar: "", ajustes: {}, cache: true };
  private fluxos: Fluxo[] = [];
  /** Cópia em edição do fluxo escolhido. `null` = nada aberto. */
  private rascunho: Fluxo | null = null;
  /** O rascunho ainda não está na lista salva (proposta ou fluxo novo). */
  private novo = false;
  private sujo = false;
  /** Divergências e descartes da última inferência, para mostrar junto da proposta. */
  private notas: { divergencias: string[]; avisos: string[] } = { divergencias: [], avisos: [] };
  private elAba!: HTMLElement;
  /** Bloco que explica, ao vivo, o que este fluxo diria do processo na tela. */
  private elDiagnostico!: HTMLElement;
  /** Estado já conferido: a aba se reapresenta a cada 5 s, e refazer a conta nessa cadência seria carga à toa. */
  private chaveConferencia = "";
  private elLado!: HTMLElement;
  private elObra!: HTMLElement;

  async iniciar(): Promise<void> {
    await this.ponte.iniciar();
    const salvo = (await chrome.storage.local.get(CHAVE_CONFIG))[CHAVE_CONFIG] as Partial<ConfigIA> | undefined;
    this.config = { ...this.config, ...salvo };
    this.fluxos = await listarFluxos();
    this.ponte.aoMudar(() => {
      this.mostrarAba();
      void this.conferirNaTela();
    });
    // O painel também mexe nos fluxos ("não sugerir este fluxo" desliga um).
    // Enquanto há edição em curso, a tela NÃO se recarrega: perder o que a
    // pessoa está digitando por causa de um clique na outra janela seria pior
    // do que mostrar uma lista velha por um minuto.
    chrome.storage.onChanged.addListener((mud, area) => {
      if (area !== "local" || !mud[CHAVE_FLUXOS] || this.sujo) return;
      this.fluxos = (mud[CHAVE_FLUXOS].newValue as Fluxo[]) ?? [];
      if (this.rascunho && !this.novo) this.rascunho = this.fluxos.find((f) => f.id === this.rascunho!.id) ?? null;
      this.desenhar();
    });
    // Fechar a aba com rascunho não salvo perde tudo: é uma página em tela
    // cheia, e fechar a aba é o gesto mais fácil que existe.
    addEventListener("beforeunload", (ev) => {
      if (!this.sujo) return;
      ev.preventDefault();
      ev.returnValue = "";
    });
    this.montar();
  }

  // --------------------------------------------------------------- estrutura

  private montar(): void {
    this.elAba = h("span", { class: "aba" });
    this.elLado = h("aside", { class: "lado", "aria-label": "Fluxos mapeados" });
    this.elObra = h("main", { class: "obra" });
    const marca = h("img", { class: "logo", src: chrome.runtime.getURL("icons/menu/fluxos.svg"), alt: "", width: "28", height: "28" });
    this.raiz.replaceChildren(
      h(
        "header",
        { class: "topo" },
        marca,
        h("span", { class: "marca" }, h("strong", {}, "Estúdio de Fluxo"), h("span", {}, "SEI Pro")),
        h("button", { class: "plana", onclick: () => this.aprenderDeModelo() }, icone("faisca", 15), "Aprender de processo modelo"),
        h("button", { class: "primario", onclick: () => this.abrir(fluxoNovo("Novo fluxo"), true) }, icone("mais", 16), "Novo fluxo"),
      ),
      h("div", { class: "barra" }, this.elAba, h("span", { class: "selo-privacidade", title: "A avaliação dos fluxos é feita no seu navegador: nada sai daqui sem o seu clique." }, icone("escudo", 13), "local")),
      h("div", { class: "estudio" }, this.elLado, this.elObra),
    );
    this.mostrarAba();
    this.desenhar();
  }

  private mostrarAba(): void {
    const aba = this.ponte.atual();
    this.elAba.replaceChildren(
      h("span", { class: `ponto${aba ? " on" : ""}` }),
      aba ? `${aba.host} — ${aba.titulo.replace(/^SEI\s*-\s*/, "")}` : "Nenhuma aba do SEI conectada",
    );
    this.elAba.title = aba
      ? "Aba do SEI de onde o estúdio lê os processos modelo."
      : "Abra ou recarregue uma aba do SEI: é dela que o estúdio lê os processos modelo.";
  }

  private desenhar(): void {
    this.desenharLista();
    this.desenharObra();
  }

  // ------------------------------------------------------------------- lista

  private desenharLista(): void {
    const ligados = this.fluxos.filter((f) => f.ativo).length;
    // `replaceChildren` é DOM puro e não engole `null` como o `h` faz.
    const itens: Array<Node | null> = [
      h("h3", {}, this.fluxos.length ? `${this.fluxos.length} fluxo(s) · ${ligados} ligado(s)` : "Nenhum fluxo ainda"),
      ...this.fluxos.map((f) =>
        h(
          "div",
          { class: `item-fluxo${f.id === this.rascunho?.id ? " atual" : ""}${f.ativo ? "" : " desligado"}` },
          h(
            "button",
            { class: "plana corpo", onclick: () => this.abrir(f, false) },
            h("b", {}, f.nome || "(sem nome)"),
            h("small", {}, resumoDoAlcance(f)),
          ),
          h("input", {
            type: "checkbox",
            class: "switch",
            title: f.ativo ? "Ligado: este fluxo sugere" : "Desligado: este fluxo não sugere",
            "aria-label": `Ligar o fluxo ${f.nome}`,
            ...(f.ativo ? { checked: true } : {}),
            change: (ev: Event) => void this.ligar(f.id, (ev.target as HTMLInputElement).checked),
          }),
        ),
      ),
      this.fluxos.length
        ? null
        : h(
            "div",
            { class: "nota" },
            icone("lampada", 15),
            h("span", {}, "Um fluxo é a sequência de documentos que a sua unidade espera num tipo de processo. Escreva-a à mão em \"Novo fluxo\", ou aponte um processo que já percorreu o rito inteiro e deixe o agente propor."),
          ),
    ];
    this.elLado.replaceChildren(...itens.filter((x): x is Node => x !== null));
  }

  private async ligar(id: string, ativo: boolean): Promise<void> {
    this.fluxos = (await listarFluxos()).map((f) => (f.id === id ? { ...f, ativo, atualizadoEm: Date.now() } : f));
    if (this.rascunho?.id === id && !this.sujo) this.rascunho = { ...this.rascunho, ativo };
    await guardarFluxos(this.fluxos);
    this.desenhar();
  }

  private abrir(fluxo: Fluxo, novo: boolean): void {
    if (this.sujo && !confirm("Você tem alterações não salvas neste fluxo. Descartar?")) return;
    // Cópia profunda: editar o objeto da lista salvaria sem passar por "Salvar".
    this.rascunho = structuredClone(fluxo);
    this.novo = novo;
    this.sujo = novo;
    this.notas = { divergencias: [], avisos: [] };
    this.desenhar();
  }

  // ------------------------------------------------------------------ editor

  private mudar(f: (r: Fluxo) => void): void {
    if (!this.rascunho) return;
    f(this.rascunho);
    this.sujo = true;
    this.desenharObra();
  }

  private desenharObra(): void {
    const r = this.rascunho;
    if (!r) {
      this.elObra.replaceChildren(
        h(
          "div",
          { class: "obra-caixa" },
          h("div", { class: "vazio" }, h("h2", {}, "Escreva o rito da sua unidade"), h("p", {}, "O SEI Pro passa a dizer em que etapa cada processo está e a sugerir a próxima providência — no painel do agente, sempre como sugestão.")),
          h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, "A detecção é 100% local: a comparação entre o fluxo e a árvore do processo é feita no seu navegador. Nada do conteúdo dos autos sai daqui sem o seu clique.")),
          h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, "Precedente não é norma: um fluxo aprendido de processo modelo é a leitura do que foi feito, não do que deveria ser. Revise antes de ligar.")),
        ),
      );
      return;
    }

    const elPendencias = h("div", {});
    this.elDiagnostico = h("div", {});
    const elSalvar = h("button", { class: "primario", onclick: () => void this.salvar() }, icone("check", 16), this.novo ? "Salvar fluxo" : "Salvar alterações");
    this.revalidar = () => {
      const faltam = validarFluxo(r);
      elSalvar.disabled = faltam.length > 0;
      elPendencias.replaceChildren(
        ...(faltam.length
          ? [h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, h("b", {}, "Falta resolver antes de salvar:"), h("ul", { class: "pendencias" }, ...faltam.map((p) => h("li", {}, p)))))]
          : []),
      );
    };
    const campo = (rotulo: string, ajuda: string | null, ...filhos: Array<Node | string | null>) =>
      h("div", { class: "campo" }, h("label", {}, rotulo), ...filhos, ajuda ? h("div", { class: "ajuda" }, ajuda) : null);

    // O título da tela e o rótulo de cada etapa espelham campos que NÃO
    // redesenham ao digitar (o cursor se perderia). Eles são atualizados à mão,
    // ou ficariam mostrando o nome antigo até a próxima mudança estrutural.
    // O nome, e não "Novo fluxo", mesmo em rascunho: uma proposta aprendida de
    // processo modelo JÁ vem nomeada pelo modelo, e chamá-la de "Novo fluxo"
    // escondia esse nome do usuário.
    const titulo = h("h2", {}, r.nome || "Novo fluxo");
    this.elObra.replaceChildren(
      h(
        "div",
        { class: "obra-caixa" },
        titulo,
        h("div", { class: "ajuda" }, `Origem: ${ORIGEM[r.origem]}.`, r.modelos?.length ? ` Processos modelo: ${r.modelos.map((m) => m.protocolo).join(", ")}.` : ""),

        ...this.notasDaProposta(),

        campo(
          "Nome do fluxo",
          "Como a sua unidade chama esse rito.",
          h("input", {
            type: "text",
            value: r.nome,
            placeholder: "Contrato de transição",
            input: (ev: Event) =>
              this.mudarSemRedesenhar(() => {
                r.nome = (ev.target as HTMLInputElement).value;
                titulo.textContent = r.nome || "(sem nome)";
              }),
          }),
        ),
        campo(
          "Descrição (opcional)",
          null,
          h("input", { type: "text", value: r.descricao ?? "", input: (ev: Event) => this.mudarSemRedesenhar(() => (r.descricao = (ev.target as HTMLInputElement).value)) }),
        ),

        h(
          "details",
          { class: "avancado", ...(r.aplicaSe.tipoProcessoContem?.length || r.aplicaSe.marcador?.length || r.aplicaSe.unidade?.length ? { open: true } : {}) },
          h("summary", {}, "Quando este fluxo se aplica"),
          h(
            "div",
            { class: "campo" },
            h("div", { class: "dupla" }, ...this.camposDoAlcance(r)),
            h("div", { class: "ajuda" }, "Uma linha por termo. Sem nenhum critério, o fluxo se aplica a qualquer processo aberto na tela. O tipo casa por pedaço do texto, sem acento e sem caixa; a unidade casa a sigla inteira."),
          ),
        ),

        h("h3", { class: "etapas-titulo" }, `Etapas (${r.etapas.length})`),
        h("div", { class: "skills" }, ...r.etapas.map((e, i) => this.cartaoDeEtapa(r, e, i))),
        h("button", { class: "plana", onclick: () => this.mudar((x) => x.etapas.push(etapaNova("Nova etapa"))) }, icone("mais", 15), "Acrescentar etapa"),

        elPendencias,

        this.elDiagnostico,

        h(
          "div",
          { class: "acoes-obra" },
          h("label", { class: "linha-switch espaco" }, h("input", { type: "checkbox", class: "switch", ...(r.ativo ? { checked: true } : {}), change: (ev: Event) => this.mudar((x) => (x.ativo = (ev.target as HTMLInputElement).checked)) }), h("span", {}, "Ligado", h("small", {}, "Só fluxo ligado sugere no painel do agente."))),
          this.novo ? null : h("button", { class: "perigo", onclick: () => void this.excluir(r.id) }, icone("lixeira", 15), "Excluir"),
          elSalvar,
        ),
      ),
    );
    this.revalidar();
    void this.conferirNaTela(true);
  }

  /**
   * O que ESTE fluxo diria do processo aberto na aba do SEI, agora.
   *
   * Existe porque a tela sem isto é muda: quem mapeia o rito, liga o fluxo,
   * abre o processo e não vê nada não tem como saber se errou o tipo, se o rito
   * já acabou ou se a ferramenta quebrou. Aqui o silêncio vira frase.
   *
   * Avalia SÓ o fluxo aberto na tela — no painel vale o primeiro fluxo ligado
   * que se aplica, e a pergunta aqui é sobre este.
   */
  private async conferirNaTela(forcar = false): Promise<void> {
    const r = this.rascunho;
    if (!this.elDiagnostico || !r) return;
    const aba = this.ponte.atual();
    const chave = `${r.id}|${r.ativo}|${aba?.id ?? ""}|${aba?.contexto ?? ""}`;
    if (!forcar && chave === this.chaveConferencia) return;
    this.chaveConferencia = chave;
    const mostrar = (texto: string, classe = "") => {
      if (this.rascunho !== r) return; // trocou de fluxo enquanto a resposta vinha
      this.elDiagnostico.replaceChildren(h("div", { class: `nota ${classe}` }, icone(classe === "atencao" ? "alerta" : "lampada", 15), h("span", {}, texto)));
    };
    // Fluxo desligado vem ANTES da aba: é sobre o que a pessoa está editando, e
    // vale com ou sem SEI aberto.
    if (!r.ativo) return mostrar(textoDoDiagnostico({ motivo: "fluxo-desligado" }), "atencao");
    if (!aba) return mostrar(textoDoDiagnostico({ motivo: "sem-aba" }), "atencao");

    const tela = (await this.ponte.executar("tela", {}).catch(() => null)) as TelaAtual | null;
    const processo = tela?.processo?.protocolo;
    if (!processo) return mostrar(textoDoDiagnostico({ motivo: "sem-processo" }), "atencao");

    const resp = (await this.ponte
      .executar("fluxo.avaliar", { processo, tipo: tela?.processo?.tipo, fluxos: [r], ignorados: await listarIgnorados(), unidade: tela?.unidade })
      .catch(() => null)) as RespostaFluxo | null;
    if (!resp) return mostrar(textoDoDiagnostico({}), "atencao");
    const nome = (id?: string) => r.etapas.find((e) => e.id === id)?.nome;
    const comum = { protocolo: resp.protocolo ?? processo, tipo: resp.tipo ?? tela?.processo?.tipo, cumpridas: resp.cumpridas, total: r.etapas.length };
    if (resp.sugestao) return mostrar(textoDoDiagnostico({ ...comum, temSugestao: true, etapa: nome(resp.sugestao.etapaId) }));
    mostrar(
      textoDoDiagnostico({ ...comum, motivo: resp.motivo, etapa: nome(resp.etapaAtualId ?? resp.primeiraId ?? resp.etapaIgnoradaId) }),
      resp.motivo === "rito-cumprido" ? "" : "atencao",
    );
  }

  /**
   * Edição de campo de texto: mexe no rascunho sem redesenhar (o cursor se
   * perderia). A validação, porém, PRECISA ser refeita: sem isso o botão
   * Salvar seguia mostrando o veredito do último desenho — habilitado num fluxo
   * que acabou de ficar inválido (e aí o clique virava um nada silencioso) ou
   * travado desabilitado depois de a pendência já ter sido resolvida.
   */
  private mudarSemRedesenhar(f: () => void): void {
    f();
    this.sujo = true;
    this.revalidar();
  }

  /** Reposta pelo `desenharObra` do rascunho aberto. */
  private revalidar: () => void = () => undefined;

  private camposDoAlcance(r: Fluxo): Node[] {
    const area = (rotulo: string, valor: string[] | undefined, placeholder: string, guardar: (v: string[]) => void) =>
      h(
        "div",
        { class: "campo-fino" },
        h("label", {}, rotulo),
        h("textarea", {
          rows: "3",
          placeholder,
          value: paraLinhas(valor),
          input: (ev: Event) => this.mudarSemRedesenhar(() => guardar(deLinhas((ev.target as HTMLTextAreaElement).value))),
        }),
      );
    return [
      area("Tipo do processo contém", r.aplicaSe.tipoProcessoContem, "Contratação Direta", (v) => (r.aplicaSe.tipoProcessoContem = v.length ? v : undefined)),
      area("Marcador", r.aplicaSe.marcador, "Urgente", (v) => (r.aplicaSe.marcador = v.length ? v : undefined)),
      area("Só nestas unidades", r.aplicaSe.unidade, "GESP-TESTE", (v) => (r.aplicaSe.unidade = v.length ? v : undefined)),
    ];
  }

  private cartaoDeEtapa(r: Fluxo, etapa: Etapa, i: number): HTMLElement {
    const mover = (de: number, para: number) =>
      this.mudar((x) => {
        if (para < 0 || para >= x.etapas.length) return;
        const [e] = x.etapas.splice(de, 1);
        x.etapas.splice(para, 0, e);
      });
    const destinos = r.etapas.filter((e) => e.id !== etapa.id);
    const rotulo = h("span", { class: "nome" }, etapa.nome || "(sem nome)");
    return h(
      "details",
      { class: "etapa-cartao" },
      h(
        "summary",
        { class: "etapa-topo" },
        h("span", { class: "ordem" }, String(i + 1)),
        rotulo,
        etapa.obrigatoria ? null : h("span", { class: "etiqueta" }, "opcional"),
        h("button", { class: "icone pequeno", title: "Subir", "aria-label": `Subir a etapa ${etapa.nome}`, disabled: i === 0, click: (ev: Event) => (ev.preventDefault(), mover(i, i - 1)) }, icone("setaCima", 14)),
        h("button", { class: "icone pequeno", title: "Descer", "aria-label": `Descer a etapa ${etapa.nome}`, disabled: i === r.etapas.length - 1, click: (ev: Event) => (ev.preventDefault(), mover(i, i + 1)) }, icone("setaBaixo", 14)),
        h("button", { class: "icone pequeno", title: "Remover", "aria-label": `Remover a etapa ${etapa.nome}`, click: (ev: Event) => (ev.preventDefault(), this.mudar((x) => x.etapas.splice(i, 1))) }, icone("lixeira", 14)),
      ),
      h(
        "div",
        { class: "etapa-corpo" },
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Nome da etapa"),
          h("input", {
            type: "text",
            value: etapa.nome,
            input: (ev: Event) =>
              this.mudarSemRedesenhar(() => {
                etapa.nome = (ev.target as HTMLInputElement).value;
                rotulo.textContent = etapa.nome || "(sem nome)";
              }),
          }),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Título do documento na árvore contém"),
          h("textarea", {
            rows: "2",
            placeholder: "Nota Técnica\nNT",
            value: paraLinhas(etapa.documento.tituloContem),
            input: (ev: Event) => this.mudarSemRedesenhar(() => (etapa.documento.tituloContem = deLinhas((ev.target as HTMLTextAreaElement).value))),
          }),
          h("div", { class: "ajuda" }, "Uma variação por linha. Basta uma delas casar. Os títulos mudam de órgão para órgão: liste como a SUA unidade nomeia o documento."),
        ),
        h(
          "div",
          { class: "dupla" },
          h(
            "div",
            { class: "campo-fino" },
            h("label", {}, "Assinatura"),
            h(
              "select",
              { change: (ev: Event) => this.mudar(() => { const v = (ev.target as HTMLSelectElement).value; etapa.documento.assinado = v === "" ? undefined : v === "sim"; }) },
              h("option", { value: "", ...(etapa.documento.assinado === undefined ? { selected: true } : {}) }, "Tanto faz"),
              h("option", { value: "sim", ...(etapa.documento.assinado === true ? { selected: true } : {}) }, "Só se assinado"),
              h("option", { value: "nao", ...(etapa.documento.assinado === false ? { selected: true } : {}) }, "Só se não assinado"),
            ),
          ),
          h(
            "div",
            { class: "campo-fino" },
            h("label", {}, "Prazo (dias)"),
            h("input", { type: "number", min: "0", value: String(etapa.prazoDias ?? 0), input: (ev: Event) => this.mudarSemRedesenhar(() => (etapa.prazoDias = Number((ev.target as HTMLInputElement).value) || undefined)) }),
            h("small", {}, "0 = sem prazo."),
          ),
        ),
        h("label", { class: "linha-switch" }, h("input", { type: "checkbox", class: "switch", ...(etapa.obrigatoria ? { checked: true } : {}), change: (ev: Event) => this.mudar(() => (etapa.obrigatoria = (ev.target as HTMLInputElement).checked)) }), h("span", {}, "Obrigatória", h("small", {}, "Etapa opcional não gera sugestão de falta."))),
        h("label", { class: "linha-switch" }, h("input", { type: "checkbox", class: "switch", ...(etapa.documento.daMinhaUnidade ? { checked: true } : {}), change: (ev: Event) => this.mudar(() => (etapa.documento.daMinhaUnidade = (ev.target as HTMLInputElement).checked || undefined)) }), h("span", {}, "Só vale se for da minha unidade", h("small", {}, "Compara a unidade geradora do documento com a unidade em que você está."))),
        h(
          "details",
          { class: "avancado", ...(etapa.acao ? { open: true } : {}) },
          h("summary", {}, "O que o agente faz quando eu aceitar a sugestão"),
          h(
            "div",
            { class: "campo" },
            h("input", { type: "text", placeholder: "Preparar despacho de aprovação", value: etapa.acao?.titulo ?? "", input: (ev: Event) => this.mudarSemRedesenhar(() => (etapa.acao = comAcao(etapa, { titulo: (ev.target as HTMLInputElement).value }))) }),
            h("textarea", {
              rows: "3",
              placeholder: "Crie neste processo um Despacho de aprovação da Nota Técnica anterior, usando /despacho. Não assine nem envie.",
              value: etapa.acao?.pedido ?? "",
              input: (ev: Event) => this.mudarSemRedesenhar(() => (etapa.acao = comAcao(etapa, { pedido: (ev.target as HTMLTextAreaElement).value }))),
            }),
            h("div", { class: "ajuda" }, "O texto vai para o agente como se você tivesse digitado, e pode citar uma skill (/despacho) para a minuta sair no padrão da unidade. Sem este texto, o cartão só avisa da falta."),
          ),
        ),
        h(
          "details",
          { class: "avancado", ...(etapa.condicao ? { open: true } : {}) },
          h("summary", {}, "Desvio (opcional)"),
          h(
            "div",
            { class: "campo" },
            h("div", { class: "ajuda" }, "Se o TÍTULO do documento da etapa ANTERIOR contiver o texto abaixo, o fluxo pula para outra etapa em vez desta. É o título na árvore, não o conteúdo: a avaliação é local e não lê documento."),
            h("input", { type: "text", placeholder: "MINUTA", value: etapa.condicao?.seDocumentoContem ?? "", input: (ev: Event) => this.mudarSemRedesenhar(() => (etapa.condicao = comDesvio(etapa, { seDocumentoContem: (ev.target as HTMLInputElement).value }))) }),
            h(
              "select",
              { change: (ev: Event) => this.mudar(() => (etapa.condicao = comDesvio(etapa, { entaoIrPara: (ev.target as HTMLSelectElement).value }))) },
              h("option", { value: "" }, "— nenhuma —"),
              ...destinos.map((d) => h("option", { value: d.id, ...(etapa.condicao?.entaoIrPara === d.id ? { selected: true } : {}) }, d.nome || "(sem nome)")),
            ),
          ),
        ),
      ),
    );
  }


  private notasDaProposta(): Array<Node | null> {
    const lista = (titulo: string, itens: string[], classe: string, ic: "lampada" | "alerta") =>
      itens.length ? h("div", { class: `nota ${classe}` }, icone(ic, 15), h("span", {}, h("b", {}, titulo), h("ul", { class: "pendencias", style: "color: inherit" }, ...itens.map((x) => h("li", {}, x))))) : null;
    return [
      lista("O que variou entre os processos modelo:", this.notas.divergencias, "", "lampada"),
      lista("O que a proposta perdeu no caminho:", this.notas.avisos, "atencao", "alerta"),
    ];
  }

  /**
   * Grava o rascunho.
   *
   * RELÊ a lista antes de escrever, e troca só o fluxo editado. O painel do
   * agente mexe na mesma chave ("não sugerir este fluxo" desliga um), e esta
   * tela não se recarrega enquanto há edição em curso: gravar a lista que
   * estava em memória desfaria, sem avisar, o que o painel decidiu.
   */
  private async salvar(): Promise<void> {
    const r = this.rascunho;
    if (!r || validarFluxo(r).length) {
      this.revalidar();
      return;
    }
    r.atualizadoEm = Date.now();
    const atuais = await listarFluxos();
    this.fluxos = atuais.some((f) => f.id === r.id) ? atuais.map((f) => (f.id === r.id ? r : f)) : [...atuais, r];
    await guardarFluxos(this.fluxos);
    this.novo = false;
    this.sujo = false;
    this.rascunho = structuredClone(r);
    this.desenhar();
  }

  private async excluir(id: string): Promise<void> {
    const f = this.fluxos.find((x) => x.id === id);
    if (!f || !confirm(`Excluir o fluxo "${f.nome}"? As etapas mapeadas se vão com ele.`)) return;
    this.fluxos = (await listarFluxos()).filter((x) => x.id !== id);
    await guardarFluxos(this.fluxos);
    this.rascunho = null;
    this.novo = false;
    this.sujo = false;
    this.desenhar();
  }

  // ------------------------------------------- aprender de processo modelo

  private modal(o: { titulo: string; corpo: Array<Node | string | null>; acoes: Array<Node | null> }): HTMLDialogElement {
    const fechar = h("button", { class: "icone", title: "Fechar", "aria-label": "Fechar" }, icone("fechar"));
    const dlg = h(
      "dialog",
      { class: "modal", "aria-label": o.titulo, closedby: "any" },
      h("div", { class: "modal-topo" }, h("h2", {}, o.titulo), fechar),
      h("div", { class: "modal-corpo" }, ...o.corpo),
      h("div", { class: "modal-acoes" }, ...o.acoes),
    );
    fechar.addEventListener("click", () => dlg.close());
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg);
    dlg.showModal();
    return dlg;
  }

  private aprenderDeModelo(): void {
    const campo = h("textarea", { rows: "4", placeholder: "12345.000001/2026-11\n12345.000002/2026-66" });
    const estado = h("div", { class: "status" });
    const botao = h("button", { class: "primario" }, icone("faisca", 16), "Ler e propor o fluxo");
    const dlg = this.modal({
      titulo: "Aprender de processo modelo",
      corpo: [
        h("div", { class: "ajuda" }, "Informe processos que JÁ percorreram o rito inteiro, um por linha. O estúdio lê da árvore apenas METADADOS — títulos dos documentos na ordem, unidade geradora, se está assinado — e o histórico. O conteúdo dos documentos NÃO é lido nem enviado."),
        h("div", { class: "campo" }, h("label", {}, "Números de processo"), campo),
        h("div", { class: "nota" }, icone("lampada", 15), h("span", {}, "Dois ou três processos rendem um fluxo muito melhor: com um só, o estúdio não tem como distinguir o rito do que aconteceu naquele caso.")),
        this.config.chave ? null : h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, SEM_CHAVE)),
        h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, "O resultado é uma PROPOSTA desligada, para você editar: precedente não é norma.")),
      ],
      acoes: [estado, botao],
    });
    if (!this.config.chave) {
      botao.disabled = true;
      botao.title = SEM_CHAVE;
      return;
    }
    // O diálogo fecha com Esc e com clique fora. Sem abortar, a chamada ao
    // modelo seguiria correndo (e sendo paga) e, ao voltar, trocaria o fluxo
    // que o usuário tivesse aberto no meio-tempo.
    const ctl = new AbortController();
    let pronto = false;
    dlg.addEventListener("close", () => !pronto && ctl.abort());
    botao.addEventListener("click", async () => {
      const numeros = numerosDeProcesso(campo.value);
      if (!numeros.length) {
        estado.className = "status erro";
        estado.replaceChildren(icone("alerta", 14), "Informe ao menos um número de processo.");
        return;
      }
      botao.disabled = true;
      try {
        const modelos: ProcessoModelo[] = [];
        for (const [i, numero] of numeros.entries()) {
          estado.className = "status";
          estado.replaceChildren(icone("relogio", 14), `Lendo ${numero} (${i + 1} de ${numeros.length})…`);
          modelos.push(await this.lerModelo(numero));
        }
        estado.replaceChildren(icone("faisca", 14), "Propondo o fluxo…");
        const provedor = criarProvedor({
          servico: this.config.servico,
          url: this.config.url,
          chave: this.config.chave,
          // Trabalho mecânico de leitura: usa o modelo auxiliar quando há um.
          modelo: this.config.modeloAuxiliar || this.config.modelo,
          ajustes: this.config.ajustes,
          cache: this.config.cache,
        });
        const r = await inferirFluxo(provedor, modelos, ctl.signal);
        if (ctl.signal.aborted) return;
        // A proposta substitui o que está aberto: se havia edição em curso
        // atrás do diálogo, ela se perderia sem uma palavra.
        if (this.sujo && !confirm("Você tem alterações não salvas no fluxo aberto. Substituir pela proposta?")) return;
        pronto = true;
        dlg.close();
        this.rascunho = r.fluxo;
        this.novo = true;
        this.sujo = true;
        this.notas = { divergencias: r.divergencias, avisos: r.avisos };
        this.desenhar();
      } catch (e) {
        if (ctl.signal.aborted) return;
        estado.className = "status erro";
        estado.replaceChildren(icone("alerta", 14), (e as Error).message);
        botao.disabled = false;
      }
    });
  }

  /**
   * Metadados de um processo modelo: a árvore e o histórico, pela ponte.
   *
   * A árvore vem da operação `processo.arvore`, que já recusa processo
   * sigiloso — o estúdio não precisa (nem deve) tratar isso por conta.
   */
  private async lerModelo(numero: string): Promise<ProcessoModelo> {
    const arv = (await this.ponte.executar("processo.arvore", { processo: numero })) as {
      protocolo: string;
      tipo?: string;
      documentos: Array<{ numero: string; titulo?: string; assinado?: boolean; externo?: boolean; unidade?: string; nivel?: string; cancelado?: boolean }>;
    };
    const historico = await this.ponte.executar("processo.historico", { processo: numero, tipo: "resumido", limite: 200 }).catch(() => null);
    return {
      protocolo: arv.protocolo || numero,
      tipo: arv.tipo,
      documentos: metadadosDaArvore(arv.documentos),
      historico: andamentosDoHistorico(historico),
    };
  }
}

const estudio = new Estudio();
void estudio.iniciar();
