/**
 * Diálogo "Nova demanda" / "Editar demanda" (spec 5.6). No topo só o que a demanda exige (título, responsável, prazo);
 * "Mais campos" fica recolhido. O prazo de uma demanda existente só muda por "Prorrogar…" (com motivo). O botão
 * Gravar trava com o texto das demandas da unidade cheio (criar, duplicar e restaurar travam; editar segue) e "Só eu"
 * o libera (o limite é da unidade). Fechar com Esc ou X depois de mexer pergunta "Descartar as alterações?".
 */

import { novoId } from "@comum/id";
import { type Combo, criarCombo, type OpcaoCombo } from "@comum/ui/combobox";
import { h, icone } from "@comum/ui/dom";
import type { Responsavel } from "@projetos/modelo/tipos";
import { bloqueiaCriacao } from "../../modelo/alertas";
import { LIMITES } from "../../modelo/constantes";
import { chaveResponsavel } from "../../modelo/filtro";
import { prorrogar } from "../../modelo/operacoes";
import type { Demanda, ItemChecklist, Prioridade, Vinculo, Vis } from "../../modelo/tipos";
import type { MudancasDemanda } from "../../repositorio";
import { montarCampoEtapa } from "../componentes/campoEtapa";
import type { DemandaNaTela } from "../dados";
import { responsaveisUsados } from "../dados";
import { dataDeFormulario, dataLonga, lerTempo, tempoParaCampo } from "../formato";
import type { ContextoDialogo } from "../tipos";
import { type CampoProcesso, caixaDeErros, campo, campoProcesso, ERRO_PROTOCOLO, linhaDeCampos, mensagensDoErro, secao } from "./campos";
import { abrirDialogoProrrogacao } from "./prorrogar";

export interface ResultadoDemanda {
  vis: Vis;
  demanda: Demanda;
}

const PRIORIDADES: ReadonlyArray<[Prioridade, string]> = [
  ["normal", "Normal"],
  ["importante", "Importante"],
  ["urgente", "Urgente"],
];

export const TEXTO_BLOQUEIO =
  "O texto das demandas da unidade chegou ao limite: criar, duplicar e restaurar estão bloqueados. Arquive as concluídas, ou escolha “Só eu” em Quem vê.";

function cartao(valor: Vis, marcado: boolean, travado: boolean, titulo: string, explica: string): HTMLElement {
  return h(
    "label",
    { class: "dem-opcao" },
    h("input", { type: "radio", name: "vis", value: valor, checked: marcado, disabled: travado }),
    h("div", {}, h("b", {}, titulo), h("span", {}, ` ${explica}`)),
  );
}

export function abrirDialogoDemanda(c: ContextoDialogo, o: { demanda?: DemandaNaTela; vis?: Vis } = {}): Promise<ResultadoDemanda | null> {
  return new Promise((ok) => {
    let atual: Demanda | undefined = o.demanda?.demanda;
    const edicao = !!atual;
    const vis0: Vis = o.demanda?.vis ?? o.vis ?? "unidade";
    const meuLogin = c.contexto.login.toLowerCase();
    const eu: Responsavel = { login: c.contexto.login, nome: c.contexto.nome };
    const sigla = c.contexto.unidade?.sigla ?? "";
    const erros = caixaDeErros();

    // ---------- campos de cima ----------
    const titulo = h("input", {
      type: "text",
      class: "spro-campo",
      name: "titulo",
      maxlength: String(LIMITES.titulo),
      value: atual?.titulo ?? "",
    });

    const responsaveis = new Map<string, Responsavel>();
    const lembrar = (r?: Responsavel) => {
      if (r?.nome) responsaveis.set(chaveResponsavel(r), r);
    };
    lembrar(eu);
    lembrar(atual?.responsavel);
    const opcoesResp = (): OpcaoCombo[] => [
      { valor: "", rotulo: "Sem responsável" },
      ...[...responsaveis.values()].map((r) => ({
        valor: chaveResponsavel(r),
        rotulo: r.login && r.login.toLowerCase() === meuLogin ? `${r.nome} (eu)` : r.nome,
        icone: "pessoa" as const,
      })),
    ];
    const responsavel: Combo = criarCombo({
      rotulo: "Responsável",
      opcoes: opcoesResp,
      valor: [atual?.responsavel ? chaveResponsavel(atual.responsavel) : ""],
      vazio: "Sem responsável",
      busca: true,
      larguraLista: 300,
      criar: (t) => {
        const nome = t.trim();
        if (!nome) return null;
        const r: Responsavel = { nome };
        lembrar(r);
        return { valor: chaveResponsavel(r), rotulo: nome };
      },
      rotuloCriar: (t) => `Usar o nome “${t.trim()}”`,
    });
    const responsavelEscolhido = (): Responsavel | undefined => {
      const v = responsavel.valor()[0] ?? "";
      return v ? responsaveis.get(v) : undefined;
    };
    const campoResp = campo("Responsável", responsavel.el, { classe: "dem-campo-resp" });

    const prazo = h("input", { type: "date", class: "spro-campo", name: "prazo", value: atual?.prazo ?? c.hoje() });
    const prazoTexto = h("span", { class: "dem-prazo-atual" }, atual ? dataLonga(atual.prazo) : "");
    const prazoCampo = atual
      ? campo(
          "Prazo",
          h(
            "div",
            { class: "dem-prazo-fixo" },
            prazoTexto,
            h(
              "button",
              {
                type: "button",
                class: "spro-botao pequeno",
                onclick: async () => {
                  if (!atual) return;
                  const dados = await abrirDialogoProrrogacao(c, atual);
                  if (!dados) return;
                  try {
                    atual = await c.repos[vis0].aplicar(atual.id, (d, car) => prorrogar(d, dados, car));
                    prazoTexto.textContent = dataLonga(atual.prazo);
                    erros.mostrar([]);
                  } catch (e) {
                    erros.mostrar(mensagensDoErro(e));
                  }
                },
              },
              icone("calendario", 14),
              "Prorrogar…",
            ),
          ),
          { dica: "O prazo só muda por prorrogação, com motivo." },
        )
      : campo("Prazo", prazo);

    // ---------- mais campos ----------
    const descricao = h("textarea", {
      class: "spro-campo",
      name: "descricao",
      rows: "3",
      maxlength: String(LIMITES.descricao),
      value: atual?.descricao ?? "",
    });
    const distribuida = h("input", { type: "date", class: "spro-campo", name: "distribuida", value: atual?.distribuidaEm ?? c.hoje() });
    const prioridade = criarCombo({
      rotulo: "Prioridade",
      opcoes: PRIORIDADES.map(([valor, rotulo]) => ({ valor, rotulo })),
      valor: [atual?.prioridade ?? "normal"],
      busca: false,
    });
    const etiquetasConhecidas = new Set<string>(atual?.etiquetas ?? []);
    const etiquetas = criarCombo({
      rotulo: "Etiquetas",
      multiplo: true,
      opcoes: () => [...etiquetasConhecidas].sort((a, b) => a.localeCompare(b, "pt-BR")).map((e) => ({ valor: e, rotulo: e })),
      valor: atual?.etiquetas ?? [],
      vazio: "Nenhuma",
      busca: true,
      criar: (t) => {
        const e = t.trim().slice(0, LIMITES.etiquetaTexto);
        if (!e) return null;
        etiquetasConhecidas.add(e);
        return { valor: e, rotulo: e };
      },
    });
    const estimado = h("input", {
      type: "text",
      class: "spro-campo",
      name: "estimado",
      placeholder: "1h30",
      value: tempoParaCampo(atual?.tempoEstimadoMin),
    });

    // Etapa do projeto: a lista vem do Gestor de Projetos (somente leitura); a guardada aparece mesmo sem ele.
    let visAgora = (): Vis => vis0;
    const campoEtapa = montarCampoEtapa({
      ...(atual?.etapa ? { atual: atual.etapa } : {}),
      carregar: () => c.etapasDoProjetos(),
      // A etapa de um projeto "Só eu" não vai para uma demanda da unidade (o rótulo seria lido por todos).
      vis: () => visAgora(),
    });
    const etapa = campoEtapa.combo;

    // Checklist.
    let itens: ItemChecklist[] = (atual?.checklist ?? []).map((i) => ({ ...i }));
    const listaChecklist = h("div", { class: "dem-checklist", role: "list" });
    const novoItem = h("input", {
      type: "text",
      class: "spro-campo",
      name: "novo-item",
      maxlength: String(LIMITES.checklistTexto),
      placeholder: "Novo item",
    });
    const pintarChecklist = () => {
      listaChecklist.replaceChildren(
        ...itens.map((i, k) =>
          h(
            "div",
            { class: "dem-item", role: "listitem", "data-item": i.id },
            h("input", {
              type: "checkbox",
              "aria-label": "Feito",
              checked: i.feito,
              onchange: (ev: Event) => {
                i.feito = (ev.target as HTMLInputElement).checked;
              },
            }),
            h("input", {
              type: "text",
              class: "spro-campo",
              name: "item",
              maxlength: String(LIMITES.checklistTexto),
              value: i.texto,
              oninput: (ev: Event) => {
                i.texto = (ev.target as HTMLInputElement).value;
              },
            }),
            h(
              "button",
              {
                type: "button",
                class: "spro-botao-icone pequeno",
                "aria-label": "Subir item",
                disabled: k === 0,
                onclick: () => mover(k, -1),
              },
              icone("setaCima", 14),
            ),
            h(
              "button",
              {
                type: "button",
                class: "spro-botao-icone pequeno",
                "aria-label": "Descer item",
                disabled: k === itens.length - 1,
                onclick: () => mover(k, 1),
              },
              icone("setaBaixo", 14),
            ),
            h(
              "button",
              { type: "button", class: "spro-botao-icone pequeno", "aria-label": "Remover item", onclick: () => remover(k) },
              icone("lixeira", 14),
            ),
          ),
        ),
      );
      checklistSecao.resumir();
    };
    const mover = (k: number, d: number) => {
      const alvo = itens[k + d];
      if (!alvo) return;
      [itens[k], itens[k + d]] = [alvo, itens[k] as ItemChecklist];
      pintarChecklist();
    };
    const remover = (k: number) => {
      itens = itens.filter((_, i) => i !== k);
      pintarChecklist();
    };
    const adicionarItem = () => {
      const t = novoItem.value.trim();
      if (!t) return;
      if (itens.length >= LIMITES.checklistItens) {
        erros.mostrar([`O checklist aceita até ${LIMITES.checklistItens} itens.`]);
        return;
      }
      erros.mostrar([]);
      itens.push({ id: novoId(), texto: t.slice(0, LIMITES.checklistTexto), feito: false });
      novoItem.value = "";
      pintarChecklist();
    };
    novoItem.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      ev.stopPropagation();
      adicionarItem();
    });

    // Processos.
    const linhasProcesso: Array<{ campo: CampoProcesso; el: HTMLElement }> = [];
    const caixaProcessos = h("div", { class: "dem-processos" });
    const dicaSigilo = h(
      "div",
      { class: "dem-dica dem-dica-sigilo", hidden: true },
      "Processo sigiloso: o número não é compartilhado com a unidade.",
    );
    const pintarSigilo = () => {
      dicaSigilo.hidden = !linhasProcesso.some((l) => l.campo.vinculo()?.sigiloso === true);
      processosSecao.resumir();
    };
    const adicionarProcesso = (atualV?: Vinculo) => {
      if (linhasProcesso.length >= LIMITES.processos) {
        erros.mostrar([`Uma demanda aceita até ${LIMITES.processos} processos.`]);
        return;
      }
      const cp = campoProcesso({
        rotulo: `Processo ${linhasProcesso.length + 1}`,
        ...(atualV ? { atual: atualV } : {}),
        vazio: "Nenhum",
        processos: () => c.processosDaCaixa(),
        aoMudar: pintarSigilo,
      });
      const el = h(
        "div",
        { class: "dem-processo-linha" },
        cp.combo.el,
        h(
          "button",
          {
            type: "button",
            class: "spro-botao-icone pequeno",
            "aria-label": "Remover processo",
            onclick: () => {
              linhasProcesso.splice(
                linhasProcesso.findIndex((l) => l.el === el),
                1,
              );
              el.remove();
              pintarSigilo();
            },
          },
          icone("lixeira", 14),
        ),
      );
      linhasProcesso.push({ campo: cp, el });
      caixaProcessos.append(el);
      pintarSigilo();
    };
    // As linhas dos processos já existentes só se criam depois de `processosSecao` (mais abaixo): `pintarSigilo` a usa.

    // Quem vê.
    const cartoes = h(
      "div",
      { class: "dem-opcoes", role: "radiogroup", "aria-label": "Quem vê" },
      cartao(
        "unidade",
        vis0 === "unidade",
        edicao,
        `Toda a unidade${sigla ? ` (${sigla})` : ""}`,
        "Quem usa o SEI Pro na unidade vê e edita.",
      ),
      cartao("eu", vis0 === "eu", edicao, "Só eu", "Aparece só para você, nesta unidade."),
    );
    const vis = (): Vis => (cartoes.querySelector<HTMLInputElement>("input[value='eu']")?.checked ? "eu" : "unidade");
    visAgora = vis;

    const checklistSecao = secao(
      "checklist",
      icone("check", 16),
      "Checklist",
      () => (itens.length ? `${itens.filter((i) => i.feito).length}/${itens.length}` : "vazio"),
      h(
        "div",
        { class: "dem-sec-pilha" },
        listaChecklist,
        h(
          "div",
          { class: "dem-linha" },
          novoItem,
          h("button", { type: "button", class: "spro-botao", onclick: adicionarItem }, icone("mais", 14), "Adicionar item"),
        ),
      ),
    );
    const processosSecao = secao(
      "processos",
      icone("pasta", 16),
      "Processos",
      () => (linhasProcesso.length ? String(linhasProcesso.length) : "nenhum"),
      h(
        "div",
        { class: "dem-sec-pilha" },
        caixaProcessos,
        dicaSigilo,
        h("button", { type: "button", class: "spro-botao", onclick: () => adicionarProcesso() }, icone("mais", 14), "Adicionar processo"),
      ),
    );
    for (const v of atual?.processos ?? []) adicionarProcesso(v);
    pintarChecklist();

    const corpoMais = h(
      "div",
      { class: "dem-sec-pilha" },
      campo("Descrição", descricao, { opcional: "(opcional)" }),
      linhaDeCampos(campo("Prioridade", prioridade.el), campo("Etiquetas", etiquetas.el, { classe: "dem-campo-largo" })),
      linhaDeCampos(
        campo("Distribuída em", distribuida),
        campo("Tempo estimado", estimado, { opcional: "(opcional)", dica: "Ex.: 1h30 ou 90." }),
      ),
      campo("Etapa do projeto", etapa.el, { opcional: "(opcional)" }),
      checklistSecao.el,
      processosSecao.el,
      campo("Quem vê", cartoes),
    );
    const mais = secao(
      "mais",
      icone("mais", 16),
      "Mais campos",
      () =>
        [
          prioridade.valor()[0] !== "normal" ? "prioridade" : "",
          etiquetas.valor().length ? "etiquetas" : "",
          itens.length ? "checklist" : "",
        ]
          .filter(Boolean)
          .join(", "),
      corpoMais,
    );

    // ---------- bloqueio por limite ----------
    let bloqueada = false;
    const aviso = h("div", { class: "dem-bloqueio", role: "status", hidden: true }, TEXTO_BLOQUEIO);
    const gravarBotao = h("button", { type: "button", class: "spro-botao primario" }, edicao ? "Gravar" : "Criar demanda");
    const atualizarGravar = () => {
      const trava = !edicao && bloqueada && vis() === "unidade";
      gravarBotao.disabled = trava;
      if (trava) gravarBotao.setAttribute("title", TEXTO_BLOQUEIO);
      else gravarBotao.removeAttribute("title");
      aviso.hidden = !trava;
      campoResp.hidden = vis() === "eu";
    };
    cartoes.addEventListener("change", atualizarGravar);
    cartoes.addEventListener("change", () => {
      if (campoEtapa.aoMudarVis())
        erros.mostrar(["A etapa de projeto escolhida é só sua e não pode ir para uma demanda da unidade; ela foi retirada."]);
    });
    void c
      .tabelas()
      .then((ts) => {
        bloqueada = ts.some((t) => t.vis === "unidade" && t.tabela === "d" && (t.faixa === "bloqueio" || bloqueiaCriacao(t.bytes)));
        atualizarGravar();
      })
      .catch(() => undefined);
    // Quem aparece na lista: os usuários da caixa e os responsáveis já usados nas demandas.
    void Promise.all([c.usuarios(), c.repos.unidade.dados(), c.repos.eu.dados()])
      .then(([us, du, de]) => {
        for (const u of us) lembrar(u);
        for (const r of responsaveisUsados([...du, ...de].map((d) => ({ demanda: d }) as DemandaNaTela))) lembrar(r);
        for (const d of [...du, ...de]) for (const e of d.etiquetas) etiquetasConhecidas.add(e);
        responsavel.atualizar();
        etiquetas.atualizar();
      })
      .catch(() => undefined);
    // ---------- gravar ----------
    const validar = (): string[] => {
      const m: string[] = [];
      if (!titulo.value.trim()) m.push("Informe o título da demanda.");
      else if (titulo.value.trim().length > LIMITES.titulo) m.push(`O título passa de ${LIMITES.titulo} caracteres.`);
      const dist = dataDeFormulario(distribuida.value);
      if (!dist) m.push("Informe uma data de distribuição válida.");
      const pz = edicao ? atual?.prazo : dataDeFormulario(prazo.value);
      if (!pz) m.push("Informe um prazo válido (dia/mês/ano).");
      else if (dist && pz < dist) m.push("O prazo não pode ser antes da distribuição.");
      if (lerTempo(estimado.value) === null) m.push("Tempo estimado inválido. Use 1h30, 1:30, 45min ou só os minutos.");
      if (linhasProcesso.some((l) => l.campo.invalido())) m.push(ERRO_PROTOCOLO);
      return m;
    };
    const vinculos = (): Vinculo[] => {
      const vistos = new Set<string>();
      const lista: Vinculo[] = [];
      for (const l of linhasProcesso) {
        const v = l.campo.vinculo();
        if (!v) continue;
        if (v.protocolo) {
          if (vistos.has(v.protocolo)) continue;
          vistos.add(v.protocolo);
        }
        lista.push(v);
      }
      return lista;
    };
    let gravado = false;
    let modal: { fechar(): void } | null = null;
    let resultado: ResultadoDemanda | null = null;
    let ocupado = false;
    const gravar = async () => {
      if (ocupado || gravarBotao.disabled) return;
      const m = validar();
      erros.mostrar(m);
      if (m.length) return;
      const destino = edicao ? vis0 : vis();
      const resp = destino === "eu" ? (atual?.responsavel ?? eu) : responsavelEscolhido();
      const min = lerTempo(estimado.value);
      const etapaEscolhida = campoEtapa.escolhida();
      ocupado = true;
      gravarBotao.disabled = true;
      try {
        const repo = c.repos[destino];
        let d: Demanda;
        if (atual) {
          const mud: MudancasDemanda = {
            titulo: titulo.value,
            descricao: descricao.value.trim() || undefined,
            responsavel: resp,
            prioridade: (prioridade.valor()[0] ?? "normal") as Prioridade,
            etiquetas: etiquetas.valor(),
            processos: vinculos(),
            checklist: itens,
            distribuidaEm: dataDeFormulario(distribuida.value) as string,
            tempoEstimadoMin: min ?? undefined,
            etapa: etapaEscolhida,
          };
          d = await repo.editar(atual.id, mud);
        } else {
          d = await repo.criar({
            titulo: titulo.value,
            ...(descricao.value.trim() ? { descricao: descricao.value.trim() } : {}),
            ...(resp ? { responsavel: resp } : {}),
            distribuidaEm: dataDeFormulario(distribuida.value) as string,
            prazo: dataDeFormulario(prazo.value) as string,
            prioridade: (prioridade.valor()[0] ?? "normal") as Prioridade,
            etiquetas: etiquetas.valor(),
            processos: vinculos(),
            checklist: itens,
            ...(min !== undefined && min !== null ? { tempoEstimadoMin: min } : {}),
            ...(etapaEscolhida ? { etapa: etapaEscolhida } : {}),
          });
        }
        gravado = true;
        resultado = { vis: destino, demanda: d };
        modal?.fechar();
      } catch (e) {
        erros.mostrar(mensagensDoErro(e));
        ocupado = false;
        atualizarGravar();
      }
    };
    gravarBotao.addEventListener("click", () => void gravar());
    titulo.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      void gravar();
    });

    // ---------- descartar ----------
    const estado = () =>
      JSON.stringify([
        titulo.value,
        responsavel.valor(),
        prazo.value,
        descricao.value,
        distribuida.value,
        prioridade.valor(),
        etiquetas.valor(),
        estimado.value,
        etapa.valor(),
        itens,
        linhasProcesso.map((l) => l.campo.vinculo() ?? null),
        vis(),
        atual?.prazo,
      ]);
    let inicial = "";

    const conteudo = h(
      "div",
      { class: "dem-form dem-form-demanda" },
      campo("Título", titulo),
      linhaDeCampos(campoResp, prazoCampo),
      mais.el,
      aviso,
      erros.el,
      h("div", { class: "spro-dialogo-rodape" }, gravarBotao),
    );
    const abrir = () => {
      modal = c.abrirModal({
        titulo: edicao ? "Editar demanda" : "Nova demanda",
        icone: "gantt",
        conteudo,
        aoFechar: () => {
          if (gravado || estado() === inicial) return ok(resultado);
          void c.confirmar("Descartar as alterações?", "Descartar").then((sim) => {
            if (sim) ok(null);
            else abrir();
          });
        },
      });
    };
    atualizarGravar();
    inicial = estado();
    abrir();
  });
}
