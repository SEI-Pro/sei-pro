import { ATRIBUTO_ATIVO, EVENTO_ABRIR } from "@cd/modelo/constantes";
import type { ContextoComparador } from "@cd/pagina/contexto";
import { type Chamadas, tratadoresComparador } from "@cd/pagina/executor";
import { marcarAtivo } from "@cd/pagina/marca";
import { armarSeLigado, CONFIG_MODAL } from "@cd/pagina/modal";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import { ErroSei } from "@nucleo/sessao/erros";
import { checar, igual, instalarDom, secao } from "./util";

const H = "f".repeat(64);
const CTX: ContextoComparador = {
  host: "sei.x.gov.br",
  login: "ana",
  nomeUsuario: "Ana",
  unidadeSigla: "UNI",
  temaEscuro: false,
  base: `https://sei.x.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=900&infra_hash=${H}`,
  linkArvore: `https://sei.x.gov.br/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=900&infra_hash=${H}`,
  idProcedimento: "900",
};

const doc = (o: Partial<DocumentoArvore> & { id: string }): DocumentoArvore =>
  ({
    numero: `00${o.id}`,
    titulo: `Doc ${o.id}`,
    externo: false,
    cancelado: false,
    nivel: "publico",
    src: `controlador.php?acao=documento_visualizar&id_documento=${o.id}&infra_hash=${H}`,
    ...o,
  }) as DocumentoArvore;

const ARVORE = {
  protocolo: "00.001/2026-11",
  nivel: "publico",
  documentos: [doc({ id: "1" }), doc({ id: "2" }), doc({ id: "3", externo: true }), doc({ id: "4", nivel: "restrito", hipotese: "34" })],
} as unknown as Arvore;

function montar(selecionado: { id: string; titulo: string } | null, extra: Partial<Chamadas> = {}) {
  const reg = { fechou: 0, recarregou: 0, criou: [] as unknown[], lidos: [] as string[], minimizou: [] as boolean[] };
  const chamadas: Partial<Chamadas> = {
    abrirArvore: async () => ARVORE,
    lerHtml: async (_s, c) => {
      reg.lidos.push(c.id);
      return `<p>conteudo ${c.id}</p>`;
    },
    tiposParaCriar: async () => [
      { id: "12", nome: "Despacho" },
      { id: "-1", nome: "Externo" },
    ],
    criarComparativo: async (_s, p) => {
      reg.criou.push(p);
      return { idDocumento: "99", numero: "0099" };
    },
    ...extra,
  };
  const t = tratadoresComparador({
    sei: { http: {} } as unknown as Sei,
    ctx: CTX,
    selecionado: () => selecionado,
    fechar: () => reg.fechou++,
    minimizar: (m) => reg.minimizou.push(m),
    recarregarArvore: () => reg.recarregou++,
    chamadas,
  });
  return { t, reg };
}

export async function verificarPagina(): Promise<void> {
  secao("pagina: marca e opcao");
  const d0 = instalarDom();
  marcarAtivo(d0);
  igual("marca o html", d0.documentElement.getAttribute(ATRIBUTO_ATIVO), "1");
  igual(
    "config do modal",
    [CONFIG_MODAL.evento, CONFIG_MODAL.seletorItemMenu, CONFIG_MODAL.atributoIframe],
    [EVENTO_ABRIR, "#iconCompareDocs", "data-spro-comparador-modal"],
  );
  igual("titulo do modal", CONFIG_MODAL.titulo, "Comparar Documentos");
  let armou = 0;
  let semOpcao = 0;
  checar(
    "opcao desligada nao arma e avisa",
    (await armarSeLigado(
      async () => false,
      () => armou++,
      () => semOpcao++,
    )) === false &&
      armou === 0 &&
      semOpcao === 1,
    { armou, semOpcao },
  );
  checar(
    "opcao ligada arma",
    (await armarSeLigado(
      async () => true,
      () => armou++,
    )) === true && armou === 1,
    armou,
  );

  secao("pagina: tratadores");
  {
    const { t } = montar({ id: "1", titulo: "Doc 1" });
    igual("contexto: A selecionado", await t.contexto!(null), { ok: true, idA: "1", tituloA: "Doc 1", host: "sei.x.gov.br" });
  }
  {
    const { t } = montar(null);
    const c = (await t.contexto!(null)) as { ok: boolean; idA: string | null };
    checar("contexto sem documento selecionado: idA null", c.ok === true && c.idA === null, c);
  }
  {
    // Com o proprio processo marcado na arvore (span<id do processo>), nao ha documento selecionado.
    const { t } = montar({ id: "900", titulo: "99906.713-630.000032/2025-82" });
    const c = (await t.contexto!(null)) as { ok: boolean; idA: string | null; tituloA: string };
    checar("processo marcado na arvore: sem documento A", c.ok === true && c.idA === null && c.tituloA === "", c);
  }
  {
    const { t } = montar({ id: "1", titulo: "Doc 1" });
    await t.contexto!(null);
    const r = (await t.candidatos!(null)) as { ok: true; candidatos: Array<Record<string, string>>; aLegivel: boolean };
    igual(
      "candidatos: sem o A, sem externo",
      r.candidatos.map((c) => c.id),
      ["2", "4"],
    );
    const json = JSON.stringify(r);
    checar("candidatos: nada de src nem infra_hash na ponte", !/src|infra_hash|linkArvore/.test(json), json);
    igual("A legivel", r.aLegivel, true);
  }
  {
    const { t } = montar({ id: "3", titulo: "Anexo" });
    await t.contexto!(null);
    const r = (await t.candidatos!(null)) as { aLegivel: boolean };
    igual("A externo (PDF): nao legivel", r.aLegivel, false);
  }
  {
    const { t, reg } = montar({ id: "1", titulo: "Doc 1" });
    await t.contexto!(null);
    await t.candidatos!(null);
    igual("conteudo de candidato", await t.conteudo!({ id: "2" }), { ok: true, html: "<p>conteudo 2</p>" });
    igual("conteudo do proprio A", await t.conteudo!({ id: "1" }), { ok: true, html: "<p>conteudo 1</p>" });
    const fora = (await t.conteudo!({ id: "3" })) as { ok: boolean; erro: string };
    checar(
      "conteudo de id fora da lista e recusado sem ler",
      fora.ok === false && /lista/i.test(fora.erro) && !reg.lidos.includes("3"),
      fora,
    );
    const semLista = montar({ id: "1", titulo: "x" });
    const antes = (await semLista.t.conteudo!({ id: "2" })) as { ok: boolean };
    igual("conteudo antes de listar: recusado", antes.ok, false);
  }
  {
    const { t } = montar(
      { id: "1", titulo: "Doc 1" },
      {
        lerHtml: async () => {
          throw new ErroSei("SEI_SESSAO_EXPIRADA", "Sessão expirada.");
        },
      },
    );
    await t.contexto!(null);
    await t.candidatos!(null);
    const r = (await t.conteudo!({ id: "2" })) as { ok: boolean; sessao?: boolean; erro: string };
    checar("sessao expirada volta como falha com a marca", r.ok === false && r.sessao === true && /Sess/.test(r.erro), r);
  }
  {
    const { t } = montar(null);
    igual("tema: modo escuro e cor do SEI (so o que existe)", await t.tema!(null), { ok: true, temaEscuro: false });
  }
  {
    const { t } = montar(null);
    igual("tipos: sem o externo", await t.tipos!(null), { ok: true, tipos: [{ id: "12", nome: "Despacho" }] });
  }
  {
    const { t, reg } = montar({ id: "1", titulo: "Doc 1" });
    await t.contexto!(null);
    await t.candidatos!(null);
    const r = await t.criar!({ tipoId: "12", tipoNome: "Despacho", html: "<html><body>x</body></html>", idB: "4" });
    igual("criar devolve o numero", r, { ok: true, numero: "0099" });
    igual("criar recarrega a arvore depois de criar", reg.recarregou, 1);
    const pedido = reg.criou[0] as { processo: string; nivel: string; hipotese?: string };
    igual(
      "criar: processo, nivel restrito (B restrito) e hipotese",
      [pedido.processo, pedido.nivel, pedido.hipotese],
      ["00.001/2026-11", "restrito", "34"],
    );
    const semTipo = (await t.criar!({ tipoId: "", html: "<p>x</p>", idB: "4" })) as { ok: boolean };
    const idFora = (await t.criar!({ tipoId: "12", html: "<p>x</p>", idB: "3" })) as { ok: boolean };
    checar("criar recusa sem tipo e com B fora da lista", semTipo.ok === false && idFora.ok === false, { semTipo, idFora });
    igual("recusas nao criaram nada", reg.criou.length, 1);
  }
  {
    const { t, reg } = montar(null);
    await t.fechar!(null);
    await t.minimizar!({ minimizado: true });
    igual("fechar e minimizar", [reg.fechou, reg.minimizou], [1, [true]]);
  }
}
