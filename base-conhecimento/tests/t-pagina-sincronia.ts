import type { Area } from "@comum/armazenamento/area";
import { areaMemoria } from "@comum/armazenamento/area";
import type { ArmazemTexto } from "@comum/sincronia/controlePagina";
import { gerarConteudoTexto } from "@comum/sincronia/textoPadraoCodec";
import type { Travar, TravarEsperando } from "@comum/sincronia/trava";
import { ErroSei } from "@nucleo/sessao/erros";
import type { Envelope } from "../src/arvore/modelo";
import { FORMATO, VERSAO } from "../src/arvore/modelo";
import { RepositorioArvore } from "../src/arvore/repositorio";
import { armazemNaTela } from "../src/pagina/armazem";
import { consentimentoBase, perguntarEntendi, textoEntendi } from "../src/pagina/consentir";
import { type DepsSincronia, ligarSincronia, SincroniaBase } from "../src/pagina/sincronia";
import { checar, docDe, paginaFixture, teste } from "./util";

const IDENT = { host: "sei.exemplo.gov.br", unidade: "110000108" };
const travar: Travar = (_nome, fn) => fn();
const travarEsperando: TravarEsperando = (_nome, fn) => fn();

function repoDe(area: Area = areaMemoria()): RepositorioArvore {
  let agora = 1;
  return new RepositorioArvore({ area, ident: IDENT, carimbo: () => ({ agora: agora++, dispositivo: "d1" }) });
}

function armazemFake(o: { texto?: string | null; conferir?: (html: string) => { gravado: boolean; atual?: string | null } } = {}) {
  let conteudo = o.texto ?? null;
  const gravacoes: string[] = [];
  const conferencias: string[] = [];
  const armazem: ArmazemTexto = {
    async ler() {
      return conteudo;
    },
    async gravar(html) {
      gravacoes.push(html);
      conteudo = html;
    },
    async gravarConferindo(html) {
      conferencias.push(html);
      const r = o.conferir ? o.conferir(html) : { gravado: true };
      if (!r.gravado) return { gravado: false, atual: r.atual ?? null };
      gravacoes.push(html);
      conteudo = html;
      return { gravado: true };
    },
    async localizar() {
      return null;
    },
    async excluir() {
      conteudo = null;
      return true;
    },
  };
  return { armazem, gravacoes, conferencias };
}

const somenteLeitura: ArmazemTexto = {
  async ler() {
    return null;
  },
  async gravar() {
    throw new ErroSei("SEI_ACAO_INDISPONIVEL", "sem alterar");
  },
  async gravarConferindo() {
    throw new ErroSei("SEI_ACAO_INDISPONIVEL", "sem alterar");
  },
  async excluir() {
    return false;
  },
  async localizar() {
    return null;
  },
};

function sincronia(opts: { repo: RepositorioArvore; sync?: Area; armazem: ArmazemTexto }): SincroniaBase {
  const d: DepsSincronia = {
    ctx: { host: IDENT.host, login: "usuario.teste", nome: "Fulano de Tal" },
    unidade: { id: IDENT.unidade, sigla: "Sinst" },
    area: areaMemoria(),
    sync: opts.sync ?? areaMemoria(),
    repo: opts.repo,
    armazem: () => opts.armazem,
    travar,
    travarEsperando,
    atrasoEnvio: 0,
  };
  return new SincroniaBase(d);
}

async function consentir(sync: Area, valor: "ligado" | "desligado"): Promise<void> {
  await consentimentoBase(sync, IDENT.host, "usuario.teste", IDENT.unidade).definir(valor);
}

await teste("armazemNaTela reconhece o menu de Textos Padrao", () => {
  const p = paginaFixture("base_conhecimento_listar.html");
  checar("tem menu", armazemNaTela(p.doc, p.url) === true);
  checar("sem menu", armazemNaTela(docDe("<html><body></body></html>"), "https://sei.exemplo.gov.br/sei/controlador.php") === false);
});

await teste("consentimentoBase guarda o ligado por pessoa e unidade", async () => {
  const sync = areaMemoria();
  const porta = consentimentoBase(sync, IDENT.host, "usuario.teste", IDENT.unidade);
  checar("inicial", (await porta.estado()) === "nao-perguntado");
  await porta.definir("ligado");
  checar("depois", (await porta.estado()) === "ligado");
});

await teste("perguntarEntendi leva o texto da sigla e os rotulos", async () => {
  let visto = { texto: "", ok: "", nao: "" };
  const resposta = await perguntarEntendi(async (texto, ok, nao) => {
    visto = { texto, ok, nao };
    return true;
  }, "Sinst");
  checar("resposta", resposta === true);
  checar("texto", visto.texto === textoEntendi("Sinst") && visto.texto.includes("Sinst"));
  checar("rotulos", visto.ok === "Entendi" && visto.nao === "Agora não");
});

await teste("sem consentimento le mas nao grava e fica aguardando permissao", async () => {
  const repo = repoDe();
  await repo.criarPasta("Fiscalizacao", null);
  const fake = armazemFake();
  const s = sincronia({ repo, armazem: fake.armazem });
  const status = await s.agora();
  s.parar();
  checar("nao gravou", fake.gravacoes.length === 0);
  checar("aguardando permissao", status.aguardandoPermissao === true);
});

await teste("com consentimento grava e confere na gravacao", async () => {
  const repo = repoDe();
  await repo.criarPasta("Fiscalizacao", null);
  const sync = areaMemoria();
  await consentir(sync, "ligado");
  const fake = armazemFake();
  const s = sincronia({ repo, sync, armazem: fake.armazem });
  const status = await s.agora();
  s.parar();
  checar("gravou", fake.gravacoes.length >= 1);
  checar("conferiu", fake.conferencias.length >= 1);
  checar("status ok", status.estado === "ok");
});

await teste("texto mudando durante a gravacao deixa pendente com aviso", async () => {
  const repo = repoDe();
  await repo.criarPasta("Fiscalizacao", null);
  const sync = areaMemoria();
  await consentir(sync, "ligado");
  const outro: Envelope = {
    formato: FORMATO,
    versao: VERSAO,
    host: IDENT.host,
    unidade: IDENT.unidade,
    entidades: { p: [{ id: "p9", nome: "Outra", pai: null, ordem: "a0", atualizadoEm: 5, dispositivo: "dX" }], v: [] },
  };
  const textoOutro = await gerarConteudoTexto("outro", outro);
  const fake = armazemFake({ conferir: () => ({ gravado: false, atual: textoOutro }) });
  const s = sincronia({ repo, sync, armazem: fake.armazem });
  const status = await s.agora();
  s.parar();
  checar("pendente", status.pendente === true);
  checar("mensagem", (status.mensagem ?? "").includes("mudou"));
});

await teste("armazem sem permissao de alterar vira indisponivel", async () => {
  const repo = repoDe();
  await repo.criarPasta("Fiscalizacao", null);
  const sync = areaMemoria();
  await consentir(sync, "ligado");
  const s = sincronia({ repo, sync, armazem: somenteLeitura });
  const status = await s.agora();
  s.parar();
  checar("indisponivel", status.estado === "indisponivel");
});

await teste("ligarSincronia nao liga sem o menu e liga com ele", () => {
  const comum = {
    ctx: { host: IDENT.host, login: "usuario.teste", nome: "Fulano" },
    unidade: { id: IDENT.unidade, sigla: "Sinst" },
    area: areaMemoria(),
    sync: areaMemoria(),
    repo: repoDe(),
    armazem: () => armazemFake().armazem,
    travar,
    travarEsperando,
    janela: new EventTarget(),
    doc: Object.assign(new EventTarget(), { visibilityState: "visible" as DocumentVisibilityState }),
  };
  checar("sem armazem", ligarSincronia({ ...comum, temArmazem: () => false }) === null);
  const s = ligarSincronia({ ...comum, temArmazem: () => true });
  checar("com armazem", s instanceof SincroniaBase);
  s?.parar();
});
