/**
 * Ponto de entrada da página Ferramentas de PDF.
 *
 * Roteia por FRAGMENTO (`#/juntar`), nao por caminho: e uma página so, dentro
 * da extensao, e o fragmento nunca vai para servidor nenhum. Uma ferramenta por
 * vez fica montada -- as nove coexistindo segurariam facilmente centenas de
 * megabytes de bytes de documentos ja fechados.
 */

import { CATALOGO, porSlug, type ItemCatalogo } from "@/ui/catalogo";
import { el, icone, repor } from "@/ui/dom";
import { aoMudarPerfil, ponte } from "@/ui/contexto";
import { conectarAoSei } from "@/ponte/cliente";
import { lerRota, montarHash } from "@/ui/rota";
import type { FerramentaMontada } from "@/ui/moldura";

const TITULO_BASE = "Ferramentas de PDF";

const conteudo = el("main", { class: "fpdf-conteudo", id: "conteudo" });
const tituloBarra = el("h1", {}, TITULO_BASE);
const destino = el("span", { class: "fpdf-destino", hidden: true });

const voltar = el(
  "button",
  {
    type: "button",
    class: "fpdf-cabecalho__voltar",
    hidden: true,
    onclick: () => irPara(""),
  },
  icone("fas fa-arrow-left"),
  " Todas as ferramentas",
);

const cabecalho = el(
  "header",
  { class: "fpdf-cabecalho" },
  icone("fas fa-file-pdf"),
  tituloBarra,
  el("span", { class: "fpdf-cabecalho__espaco" }),
  destino,
  voltar,
);

let montada: FerramentaMontada | null = null;

/**
 * O selo de privacidade.
 *
 * A afirmacao e forte porque e verificavel: os arquivos do motor de PDF e do
 * reconhecimento de texto vem dentro da extensao, nao ha permissao de acesso a
 * sites, e a página funciona com a maquina desconectada. Nao dizemos "o arquivo
 * nao sai desta página" -- quando voce traz um documento do processo, os bytes
 * atravessam de uma aba para outra dentro do proprio navegador. O que nao
 * acontece, em nenhum caso, e o arquivo sair do computador.
 */
function selo(): HTMLElement {
  return el(
    "div",
    { class: "fpdf-privacidade" },
    icone("fas fa-shield-alt"),
    el(
      "div",
      {},
      el(
        "p",
        {},
        el("strong", {}, "Tudo acontece no seu computador. "),
        "Nenhum arquivo é enviado para servidor nenhum — nem nosso, nem de terceiros. O processamento roda inteiro no seu navegador, e as ferramentas continuam funcionando com a máquina desconectada da internet.",
      ),
      el(
        "p",
        {},
        "Nada é guardado: ao fechar esta aba, os documentos saem da memória. Não há registro do que você abriu, nem envio de estatísticas de uso.",
      ),
    ),
  );
}

function montarHub() {
  repor(
    conteudo,
    selo(),
    el(
      "div",
      { class: "fpdf-hub" },
      el(
        "div",
        { class: "fpdf-hub__grade" },
        ...CATALOGO.map((f) =>
          el(
            "button",
            {
              type: "button",
              class: "fpdf-cartao",
              onclick: () => irPara(f.slug),
            },
            el("span", { class: "fpdf-cartao__icone" }, icone(f.icone)),
            el("span", { class: "fpdf-cartao__nome" }, f.nome),
            el("span", { class: "fpdf-cartao__resumo" }, f.resumo),
          ),
        ),
      ),
    ),
  );
}

async function montarFerramenta(item: ItemCatalogo) {
  repor(
    conteudo,
    el("p", { class: "fpdf-resumo" }, "Carregando ", item.nome, "..."),
  );
  const modulo = await item.carregar();
  montada = modulo.montar();
  // Ferramentas que trabalham sobre a página do documento usam a largura da
  // janela; as demais ficam na largura de leitura. Ver `amplo` no catálogo.
  conteudo.classList.toggle("fpdf-conteudo--amplo", Boolean(item.amplo));
  repor(conteudo, selo(), montada.raiz);
}

/** Navega preservando os parametros de conexao com o SEI. */
function irPara(slug: string) {
  window.location.hash = montarHash(slug, lerRota().parametros);
}

async function rotear() {
  // Trocar de ferramenta com processamento em curso cancela o que estava
  // rodando: o `destruir` de cada uma interrompe e revoga os object URLs.
  montada?.destruir();
  montada = null;

  const { slug, parametros } = lerRota();
  const item = slug ? porSlug(slug) : undefined;

  if (!item) {
    conteudo.classList.remove("fpdf-conteudo--amplo");
    document.title = `${TITULO_BASE} | SEI Pro`;
    repor(tituloBarra, TITULO_BASE);
    voltar.hidden = true;
    montarHub();
    // Slug desconhecido volta para o hub, mas os parametros de conexao ficam:
    // limpar o fragmento inteiro derrubaria a ponte com o SEI.
    if (slug) window.location.hash = montarHash("", parametros);
    return;
  }

  document.title = `${item.nome} | ${TITULO_BASE}`;
  repor(tituloBarra, item.nome);
  voltar.hidden = false;
  await montarFerramenta(item);
}

function iniciar() {
  document.body.classList.add("fpdf", "fpdf-body");
  document.body.append(cabecalho, conteudo);

  window.addEventListener("hashchange", () => void rotear());
  window.addEventListener("beforeunload", () => montada?.destruir());

  // A faixa de destino so aparece quando ha um SEI do outro lado -- ausencia
  // esconde o controle, nao mostra um campo vazio.
  aoMudarPerfil((perfil) => {
    const teto = perfil.limites.bytesPorArquivo;
    if (ponte().disponivel() && teto) {
      destino.hidden = false;
      repor(destino, `Limite deste órgão: ${(teto / (1024 * 1024)).toFixed(0)} MB`);
    } else {
      destino.hidden = true;
    }
  });

  // Se a página foi aberta pelo SEI, ele se apresenta em seguida. Sem isso, a
  // página simplesmente funciona sozinha, com as integracoes escondidas.
  conectarAoSei();

  void rotear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
