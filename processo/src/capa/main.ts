/**
 * Content script da capa do processo (mundo isolado, todos os quadros, document_idle). Só age no quadro do
 * visualizador que traz a capa (`#divArvoreHtml`) e nunca na cópia oculta (`#frmCheckerProcessoPro`) que o legado
 * mantém. A capa legada cede por `data-seipro-processo-capa` (posto em `document_start` pelo script da árvore, na janela
 * de topo, e reafirmado aqui).
 */
import { areaChrome } from "@comum/armazenamento/area";
import { valorOpcaoLegada } from "@comum/opcoes/legadas";
import { corDoTemaSei } from "@comum/pagina/tema";
import { mostrarAviso } from "@comum/ui/aviso";
import base from "@comum/ui/base.css";
import { documentoTopo } from "@nucleo/sessao/pagina";
import capaCss from "../../estatico/capa.css";
import { OPCAO_PROCESSO_PARADO } from "../modelo/constantes";
import { copiarTexto } from "../pagina/comum";
import { escopoDoUsuario, lerUsuarioEUnidade } from "../pagina/contexto";
import { aoMudarTema, definirCss, garantirEstilo, temaEscuro } from "../pagina/estilo";
import { dentroDoVerificadorOculto, marcarCapa } from "../pagina/marca";
import { linkPermanente } from "../pagina/menuDoc/copiar";
import { type Capa, montarCapa } from "./controle";
import { limiteDeParado } from "./parado";
import { criarFonteDeCache, criarPonte } from "./ponte";

let capa: Capa | null = null;

/** Diagnóstico: o que a capa fez neste quadro, no <html> (`iniciando`, `desenhada`, `desistiu: motivo`, `erro: mensagem`). */
const estado = (texto: string): void => document.documentElement?.setAttribute("data-spro-capa-estado", texto);

async function principal(): Promise<void> {
  if (window === window.top || !document.getElementById("divArvoreHtml") || dentroDoVerificadorOculto(window)) return;
  estado("iniciando");
  const topo = documentoTopo();
  marcarCapa(topo);
  const { dataValues } = (await chrome.storage.sync.get("dataValues")) as { dataValues?: unknown };
  definirCss(`${base}\n${capaCss}`);
  garantirEstilo(document);
  const u = lerUsuarioEUnidade(topo);
  const area = areaChrome(chrome.storage.local, "local");
  // O endereço do PRÓPRIO quadro (`.../sei/controlador.php`): o da janela de topo vira `/sei/#processo?...` (URL amigável).
  const base_ = `${location.origin}${location.pathname}`;
  capa = await montarCapa({
    doc: document,
    ponte: criarPonte(topo),
    cache: (arv) => criarFonteDeCache(area, escopoDoUsuario(u.host, u.login), arv.idProcedimento),
    agora: () => new Date(),
    unidade: u.unidade.sigla,
    limite: limiteDeParado(valorOpcaoLegada(dataValues, OPCAO_PROCESSO_PARADO)),
    armazenamento: localStorage,
    linkPermanente: (id) => linkPermanente(base_, id),
    copiar: (t) => copiarTexto(document, t),
    avisar: (t, ms = 2000) => void mostrarAviso(document, t, undefined, ms),
    escuro: () => temaEscuro(document),
    corTema: () => corDoTemaSei(document) ?? corDoTemaSei(topo),
    aoMudarTema: (cb) => aoMudarTema(document, cb),
    depurar: (motivo) => estado(`desistiu: ${motivo}`),
  });
  if (capa) estado("desenhada");
  window.addEventListener("pagehide", () => capa?.destruir(), { once: true });
}

void principal().catch((e) => {
  estado(`erro: ${e instanceof Error ? e.message : String(e)}`);
  console.warn("[SEI Pro] capa do processo:", e);
});
