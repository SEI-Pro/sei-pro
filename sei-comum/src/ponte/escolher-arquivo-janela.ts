/**
 * Página `html/escolher-arquivo.html`: a janela de nível superior da extensão onde o seletor de arquivo
 * funciona (o app em iframe não pode abri-lo, issue #186). Mostra um botão (o seletor exige clique), grava o
 * handle no depósito de passagem e avisa o app. Fechar sem escolher avisa "cancelado".
 * Lógica em `escolhaPorJanela.ts`; este arquivo só liga a tela.
 */
import { escolherArquivoSync } from "../sincronia/arquivo";
import {
  escolhaNoIndexedDB,
  MSG_ESCOLHA_FEITA,
  type PedidoEscolha,
  type ResultadoEscolha,
} from "../sincronia/escolhaPorJanela";

export function lerPedido(busca: string): PedidoEscolha | null {
  const q = new URLSearchParams(busca);
  const id = q.get("id");
  const modo = q.get("modo");
  if (!id || (modo !== "novo" && modo !== "existente")) return null;
  return { id, modo, nome: q.get("nome") ?? "arquivo.json", descricao: q.get("descricao") ?? "SEI Pro" };
}

function ligar(): void {
  const pedido = lerPedido(location.search);
  const msg = document.getElementById("msg") as HTMLElement;
  const botao = document.getElementById("escolher") as HTMLButtonElement;
  if (!pedido) {
    msg.textContent = "Pedido inválido. Feche esta janela e tente de novo pela tela de sincronização.";
    botao.hidden = true;
    return;
  }
  let respondido = false;
  const responder = (ok: boolean) => {
    if (respondido) return;
    respondido = true;
    const r: ResultadoEscolha = { tipo: MSG_ESCOLHA_FEITA, id: pedido.id, ok };
    void chrome.runtime.sendMessage(r).catch(() => undefined);
  };
  msg.textContent =
    pedido.modo === "novo"
      ? `Escolha onde guardar o arquivo de ${pedido.descricao}, de preferência numa pasta que já sincroniza com a nuvem.`
      : `Escolha o arquivo de ${pedido.descricao} que você já tem, de preferência numa pasta que já sincroniza com a nuvem.`;
  botao.textContent = pedido.modo === "novo" ? "Escolher onde guardar…" : "Escolher o arquivo…";
  botao.addEventListener("click", () => {
    botao.disabled = true;
    // Aqui a janela é de nível superior: sem o desvio por janela, para não abrir outra.
    escolherArquivoSync(pedido.modo, pedido.nome, pedido.descricao, window, null)
      .then(async (h) => {
        if (!h) {
          botao.disabled = false;
          return;
        }
        await escolhaNoIndexedDB().guardar(pedido.id, h);
        responder(true);
        window.close();
      })
      .catch((e: unknown) => {
        botao.disabled = false;
        msg.textContent = `Não foi possível escolher o arquivo: ${(e as Error).message}`;
      });
  });
  // Fechar a janela sem escolher: o app não fica esperando.
  window.addEventListener("pagehide", () => responder(false));
}

if (typeof document !== "undefined" && document.getElementById("escolher")) ligar();
