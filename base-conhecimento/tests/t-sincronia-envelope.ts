import { areaMemoria } from "@comum/armazenamento/area";
import type { Envelope } from "../src/arvore/modelo";
import { AVISO_TEXTO, FORMATO, TETO_TEXTO, VERSAO } from "../src/arvore/modelo";
import { RepositorioArvore } from "../src/arvore/repositorio";
import {
  adaptadorBaseConhecimento,
  assinaturaEnvelope,
  chaveStatus,
  chaveSubstituido,
  descricaoDoTexto,
  legivelEnvelope,
  nomeDoTexto,
  textoComoGravado,
} from "../src/sincronia/envelope";
import { checar, teste } from "./util";

const IDENT = { host: "sei.exemplo.gov.br", unidade: "110000108" };
const CARIMBO = { atualizadoEm: 10, dispositivo: "d1" };

function envelope(extra: Partial<Envelope> = {}): Envelope {
  return {
    formato: FORMATO,
    versao: VERSAO,
    host: IDENT.host,
    unidade: IDENT.unidade,
    entidades: {
      p: [{ id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", ...CARIMBO }],
      v: [{ id: "40", titulo: "PROCEDIMENTO A", pasta: "p1", ordem: "a0", ...CARIMBO }],
    },
    ...extra,
  };
}

function repoDe(area = areaMemoria()) {
  let agora = 1;
  return new RepositorioArvore({ area, ident: IDENT, carimbo: () => ({ agora: agora++, dispositivo: "d1" }) });
}

await teste("nome e descricao do texto da unidade", () => {
  checar("nome", nomeDoTexto() === "[_SEIPRO_BC_UNIDADE]");
  checar("descricao curta", descricaoDoTexto().length > 0 && descricaoDoTexto().length <= 300);
});

await teste("legivel cita a unidade e o usuario", () => {
  const texto = legivelEnvelope("Sinst", "Fulano de Tal");
  checar("sigla", texto.includes("Sinst"));
  checar("usuario", texto.includes("Fulano de Tal"));
});

await teste("assinatura ignora quem gravou e quando, mas muda com lapide", () => {
  const a = envelope();
  const b = envelope({ entidades: { p: [{ ...a.entidades.p[0]!, atualizadoEm: 99, dispositivo: "d2" }], v: a.entidades.v } });
  checar("mesma assinatura", assinaturaEnvelope(a) === assinaturaEnvelope(b));
  const c = envelope({ entidades: { p: [{ ...a.entidades.p[0]!, removidoEm: 50 }], v: [] } });
  checar("lapide muda", assinaturaEnvelope(a) !== assinaturaEnvelope(c));
});

await teste("adaptador valida envelope, detecta versao nova e vazio", () => {
  const adaptador = adaptadorBaseConhecimento({ repo: repoDe(), area: areaMemoria(), ident: IDENT, sigla: "Sinst", nomeUsuario: "Fulano" });
  checar("modulo", adaptador.modulo === "base-conhecimento");
  checar("chaveStatus", adaptador.chaveStatus === chaveStatus && chaveStatus === "base-conhecimento/sync/tp/unidade");
  checar("teto", adaptador.teto === TETO_TEXTO && adaptador.aviso === AVISO_TEXTO);
  checar("valida bom", "ok" in adaptador.validar(envelope()));
  checar("valida ruim", "invalido" in adaptador.validar({ formato: FORMATO, versao: VERSAO }));
  checar("versao nova", "maisNovo" in adaptador.validar(envelope({ versao: VERSAO + 1 })));
  checar("vazio", adaptador.vazio?.({ ...envelope(), entidades: { p: [], v: [] } }) === true);
  checar("nao vazio", adaptador.vazio?.(envelope()) === false);
});

await teste("adaptador importa e exporta o repositorio", async () => {
  const repo = repoDe();
  const adaptador = adaptadorBaseConhecimento({ repo, area: areaMemoria(), ident: IDENT, sigla: "Sinst", nomeUsuario: "Fulano" });
  await adaptador.importar(envelope());
  const exportado = await adaptador.exportar({ remoto: null, agora: 1, invalido: false });
  checar("pasta chegou", exportado.entidades.p.length === 1 && exportado.entidades.p[0]?.nome === "Fiscalizacao");
  checar("identidade", exportado.host === IDENT.host && exportado.unidade === IDENT.unidade);
});

await teste("normalizar e idempotente", async () => {
  const uma = await textoComoGravado(envelope(), IDENT, 1);
  const duas = await textoComoGravado(uma, IDENT, 2);
  checar("mesma assinatura", assinaturaEnvelope(uma) === assinaturaEnvelope(duas));
});

await teste("antesDeRegravarInvalido guarda copia do texto", async () => {
  const area = areaMemoria();
  const adaptador = adaptadorBaseConhecimento({ repo: repoDe(), area, ident: IDENT, sigla: "Sinst", nomeUsuario: "Fulano" });
  await adaptador.antesDeRegravarInvalido?.("formato desconhecido", "<p>texto antigo</p>");
  const guardado = (await area.obter(chaveSubstituido))[chaveSubstituido] as { motivo: string; html: string } | undefined;
  checar("motivo", guardado?.motivo === "formato desconhecido");
  checar("html", guardado?.html === "<p>texto antigo</p>");
});
