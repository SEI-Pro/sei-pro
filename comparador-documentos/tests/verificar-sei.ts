import { readFileSync } from "node:fs";
import { contextoComparador, selecionadoNaArvore } from "@cd/pagina/contexto";
import { criarComparativo, nivelDoComparativo } from "@cd/sei/criar";
import { type Candidato, lerHtml, listarCandidatos } from "@cd/sei/documentos";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { ErroSei } from "@nucleo/sessao/erros";
import { DOMParser } from "linkedom";
import { checar, igual, instalarDom, lanca, secao } from "./util";

definirAnalisador((h) => new DOMParser().parseFromString(h, "text/html") as unknown as Document);

const doc = (o: Partial<DocumentoArvore> & { id: string }): DocumentoArvore => ({
  numero: `00${o.id}`,
  titulo: `Doc ${o.id}`,
  pasta: null,
  externo: false,
  formato: "interno",
  nivel: "publico",
  assinado: false,
  assinaturas: [],
  cancelado: false,
  link: `link${o.id}`,
  src: `src${o.id}`,
  acoes: [],
  botoes: [],
  ...o,
});
const arvore = (documentos: DocumentoArvore[], nivel: Arvore["nivel"] = "publico"): Arvore =>
  ({ protocolo: "00.001/2026-11", nivel, documentos }) as unknown as Arvore;

const FIXTURE = new URL("../../sei-nucleo/tests/fixtures/sei41/trabalhar.html", import.meta.url);
const URL_TELA = "https://treinamento.sei.sp.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=148265&infra_hash=zzz";

export async function verificarSei(): Promise<void> {
  secao("sei: candidatos");
  const a = arvore([
    doc({ id: "1" }),
    doc({ id: "2", externo: true, formato: "pdf" }),
    doc({ id: "3", cancelado: true }),
    doc({ id: "4", nivel: "sigiloso" }),
    doc({ id: "5", src: "" }),
    doc({ id: "6" }),
  ]);
  igual(
    "so gerados no SEI, ativos, nao sigilosos, com src; sem o A",
    listarCandidatos(a, "1").map((c) => c.id),
    ["6"],
  );
  igual(
    "sem o A excluido: o proprio A entra",
    listarCandidatos(a, null).map((c) => c.id),
    ["1", "6"],
  );
  igual("arvore sem candidatos: lista vazia", listarCandidatos(arvore([doc({ id: "9", externo: true })]), null), []);
  igual("candidato traz id, numero, titulo e src", listarCandidatos(a, "1")[0], {
    id: "6",
    numero: "006",
    titulo: "Doc 6",
    src: "src6",
  } satisfies Candidato);

  secao("sei: lerHtml");
  const sei = (obter: (url: string) => Promise<{ html: string }>) => ({ http: { obter } }) as unknown as Sei;
  igual(
    "devolve o html",
    await lerHtml(
      sei(async (u) => ({ html: `<p>${u}</p>` })),
      { id: "6", numero: "006", titulo: "t", src: "src6" },
    ),
    "<p>src6</p>",
  );
  const sessao = await lanca(() =>
    lerHtml(
      sei(async () => {
        throw new ErroSei("SEI_SESSAO_EXPIRADA", "Sessão expirada.");
      }),
      { id: "6", numero: "006", titulo: "t", src: "s" },
    ),
  );
  checar(
    "sessao expirada mantem o codigo e a mensagem",
    sessao?.codigo === "SEI_SESSAO_EXPIRADA" && /Sess/.test(sessao.message ?? ""),
    sessao,
  );
  const rede = await lanca(() =>
    lerHtml(
      sei(async () => {
        throw new Error("boom");
      }),
      { id: "6", numero: "006", titulo: "Parecer", src: "s" },
    ),
  );
  checar(
    "erro generico vira mensagem em portugues com o documento",
    /Parecer/.test(rede?.message ?? "") && /ler/i.test(rede?.message ?? ""),
    rede,
  );

  secao("sei: nivel do comparativo");
  igual("tudo publico: publico", nivelDoComparativo(arvore([], "publico"), [doc({ id: "1" }), doc({ id: "2" })]), { nivel: "publico" });
  igual(
    "um restrito com hipotese: restrito com a hipotese",
    nivelDoComparativo(arvore([]), [doc({ id: "1" }), doc({ id: "2", nivel: "restrito", hipotese: "34" })]),
    {
      nivel: "restrito",
      hipotese: "34",
    },
  );
  igual("processo restrito: restrito", nivelDoComparativo(arvore([], "restrito"), [doc({ id: "1" })]).nivel, "restrito");

  secao("sei: criarComparativo");
  const chamadas: string[] = [];
  const deps = {
    criar: async (_s: Sei, processo: string, novo: { tipoId?: string; nivel?: string }) => {
      chamadas.push(`criar:${processo}:${novo.tipoId}:${novo.nivel}`);
      return { alvo: processo, mudancas: [], aplicado: true, resumo: "", dados: { idDocumento: "77", numero: "0077" } };
    },
    arvore: async () => arvore([doc({ id: "77", numero: "0077" })]),
    editar: async (
      _s: Sei,
      d: { documento: DocumentoArvore },
      trocar: (s: { somenteLeitura?: boolean; html: string; nome: string; titulo: string }) => string | null,
    ) => {
      chamadas.push(`editar:${d.documento.id}`);
      igual(
        "so a primeira secao editavel recebe o conteudo",
        [trocar({ nome: "a", titulo: "A", somenteLeitura: true, html: "" }), trocar({ nome: "b", titulo: "B", html: "" })],
        [null, "<p>corpo</p>"],
      );
      return { alvo: "0077", mudancas: [], aplicado: true, resumo: "" };
    },
  };
  const r = await criarComparativo(
    {} as Sei,
    {
      processo: "00.001/2026-11",
      tipoId: "12",
      html: "<html><head><style>x{}</style></head><body><p>corpo</p></body></html>",
      nivel: "publico",
    },
    deps as never,
  );
  igual("devolve id e numero", r, { idDocumento: "77", numero: "0077" });
  igual("cria com o tipo e o nivel, depois grava no documento novo", chamadas, ["criar:00.001/2026-11:12:publico", "editar:77"]);

  secao("pagina: contexto e selecao");
  {
    const html = readFileSync(FIXTURE, "latin1");
    const ctx = contextoComparador(instalarDom(html), { temaEscuro: true, corTema: "#123456" }, URL_TELA);
    checar(
      "contexto: processo, tema e base",
      ctx?.idProcedimento === "148265" && ctx.temaEscuro === true && ctx.corTema === "#123456" && ctx.base === URL_TELA,
      ctx,
    );
    igual("sem arvore: null", contextoComparador(instalarDom("<html><body></body></html>"), { temaEscuro: false }, URL_TELA), null);
  }
  const arv = instalarDom(
    '<html><body><div id="content"><a><span id="span12345" class="infraArvoreNoSelecionado">Despacho 123 (0010)</span></a></div></body></html>',
  );
  igual("selecionado na arvore: id e titulo", selecionadoNaArvore(arv), { id: "12345", titulo: "Despacho 123 (0010)" });
  igual("nada selecionado: null", selecionadoNaArvore(instalarDom("<html><body><div id='content'></div></body></html>")), null);
  igual("sem documento da arvore: null", selecionadoNaArvore(null), null);
}
