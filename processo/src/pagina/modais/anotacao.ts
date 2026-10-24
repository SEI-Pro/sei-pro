import { h, icone } from "@comum/ui/dom";
import type { AnotacaoProcesso } from "@nucleo/dominio/painelProcesso";
import { alternarChecklist, dataIsoDaAnotacao, definirDataNaAnotacao, LIMITE_ANOTACAO } from "../../modelo/texto";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, confirmar, rodape } from "./comum";

/**
 * Anotação da unidade no processo: texto (500 caracteres), checklist, data e prioridade. O papel é o post-it do cartão
 * do painel (degradê amarelo, igual nos dois temas): o texto ocupa o papel inteiro e, embaixo, no rodapé do papel, o
 * contador fica à esquerda e as ferramentas (prioridade, checklist, data) à direita; quando não cabem lado a lado, as
 * ferramentas descem para a linha de baixo (nunca sobrepõem o contador).
 */
export function abrirModalAnotacao(ctx: ContextoProcesso, atual: AnotacaoProcesso | null): void {
  const texto = h("textarea", {
    class: "spro-p-anotacao spro-p-post-it-texto",
    rows: "7",
    maxlength: String(LIMITE_ANOTACAO),
    "aria-label": "Anotação",
    placeholder: "Escreva a anotação",
  });
  texto.value = atual?.texto ?? "";
  const contador = h("span", { class: "spro-p-contador", "aria-live": "polite" });
  const atualizarContador = () => {
    const resta = LIMITE_ANOTACAO - texto.value.length;
    contador.textContent = resta <= 0 ? "Limite de caracteres atingido." : `${resta} caracteres restantes`;
  };
  texto.addEventListener("input", atualizarContador);
  atualizarContador();

  const linhaDe = (pos: number): number => texto.value.slice(0, pos).split("\n").length - 1;

  let prioritaria = atual?.prioridade ?? false;
  const prioridade = h(
    "button",
    { type: "button", class: "spro-p-post-it-botao prioridade", "aria-pressed": String(prioritaria), "aria-label": "Prioridade" },
    icone("alerta", 14),
    "Prioridade",
  );
  prioridade.addEventListener("click", () => {
    prioritaria = !prioritaria;
    prioridade.setAttribute("aria-pressed", String(prioritaria));
  });

  const checklist = h(
    "button",
    { type: "button", class: "spro-p-post-it-botao", "aria-label": "Transformar as linhas selecionadas em checklist" },
    icone("check", 14),
    "Checklist",
  );
  checklist.addEventListener("click", () => {
    texto.value = alternarChecklist(texto.value, linhaDe(texto.selectionStart ?? 0), linhaDe(texto.selectionEnd ?? 0)).slice(
      0,
      LIMITE_ANOTACAO,
    );
    atualizarContador();
    texto.focus();
  });

  const data = h("input", { type: "date", class: "spro-p-post-it-data", "aria-label": "Data para inserir na anotação" });
  data.value = dataIsoDaAnotacao(texto.value) ?? "";
  data.addEventListener("change", () => {
    if (!data.value) return;
    texto.value = definirDataNaAnotacao(texto.value, data.value).slice(0, LIMITE_ANOTACAO);
    atualizarContador();
  });

  const papel = h(
    "div",
    { class: "spro-p-post-it spro-p-post-it-edicao" },
    texto,
    h(
      "div",
      { class: "spro-p-post-it-rodape" },
      contador,
      h("div", { class: "spro-p-post-it-ferramentas" }, prioridade, checklist, h("span", { class: "spro-p-post-it-data-rotulo" }, icone("calendario", 14), data)),
    ),
  );

  const salvar = botaoPrimario("Salvar", () => void enviar(texto.value, prioritaria));
  const remover = h("button", { type: "button", class: "spro-botao perigo spro-esquerda" }, "Remover anotação");
  const d = abrirDialogo(ctx, {
    titulo: atual ? "Editar anotação" : "Adicionar anotação",
    icone: "nota",
    largura: 600,
    conteudo: [papel, rodape(atual ? remover : null, salvar)],
  });
  const enviar = async (t: string, p: boolean) => {
    const ok = await d.gravar(() => ctx.op.anotar({ texto: t.trim(), prioridade: p }), [salvar, remover]);
    if (ok) ctx.recarregar("anotacao");
  };
  remover.addEventListener("click", () => {
    void confirmar(ctx, "Tem certeza que deseja remover esta anotação?", "Remover").then((sim) => {
      if (sim) void enviar("", false);
    });
  });
}
