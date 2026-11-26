import type { EntidadesArvore, Envelope } from "../src/arvore/modelo";
import { FORMATO, LIMITE_NOME_PASTA, pastaValida, VERSAO, validarEnvelope, vinculoValido } from "../src/arvore/modelo";
import { checar, teste } from "./util";

const IDENT = { host: "sei.exemplo.gov.br", unidade: "110000108" };
const CARIMBO = { atualizadoEm: 1, dispositivo: "d1" };

const pasta = (extra: Record<string, unknown> = {}) => ({
  id: "p1",
  nome: "Fiscalização",
  pai: null,
  ordem: "a0",
  ...CARIMBO,
  ...extra,
});
const vinculo = (extra: Record<string, unknown> = {}) => ({
  id: "40",
  titulo: "PROCEDIMENTO DE EXEMPLO A",
  pasta: "p1",
  ordem: "a0",
  ...CARIMBO,
  ...extra,
});
const envelope = (ent: Partial<EntidadesArvore> = {}, extra: Record<string, unknown> = {}): Envelope =>
  ({
    formato: FORMATO,
    versao: VERSAO,
    host: IDENT.host,
    unidade: IDENT.unidade,
    entidades: { p: [pasta()], v: [vinculo()], ...ent },
    ...extra,
  }) as Envelope;

await teste("envelope valido devolve ok", () => {
  const r = validarEnvelope(envelope(), IDENT);
  checar("ok", "ok" in r);
});

await teste("versao mais nova e reconhecida e nao deve ser sobrescrita", () => {
  const r = validarEnvelope(envelope({}, { versao: VERSAO + 1 }), IDENT);
  checar("maisNovo", "maisNovo" in r);
});

await teste("formato, host ou unidade diferentes sao invalidos", () => {
  checar("formato", "invalido" in validarEnvelope(envelope({}, { formato: "outro" }), IDENT));
  checar("host", "invalido" in validarEnvelope(envelope({}, { host: "outro.gov.br" }), IDENT));
  checar("unidade", "invalido" in validarEnvelope(envelope({}, { unidade: "1" }), IDENT));
});

await teste("bruto nulo ou fora de forma e invalido", () => {
  checar("nulo", "invalido" in validarEnvelope(null, IDENT));
  checar("array", "invalido" in validarEnvelope([], IDENT));
  checar(
    "sem entidades",
    "invalido" in validarEnvelope({ formato: FORMATO, versao: VERSAO, host: IDENT.host, unidade: IDENT.unidade }, IDENT),
  );
});

await teste("pasta exige nome de 1 a 80, id e ordem validos", () => {
  checar("nome vazio", !pastaValida(pasta({ nome: "   " })));
  checar("nome longo", !pastaValida(pasta({ nome: "x".repeat(LIMITE_NOME_PASTA + 1) })));
  checar("id vazio", !pastaValida(pasta({ id: "" })));
  checar("ordem invalida", !pastaValida(pasta({ ordem: "" })));
  checar("pai nulo ou texto", pastaValida(pasta({ pai: null })) && pastaValida(pasta({ pai: "p0" })));
});

await teste("vinculo exige id, titulo, pasta nula ou texto e ordem", () => {
  checar("valido", vinculoValido(vinculo()));
  checar("id vazio", !vinculoValido(vinculo({ id: "" })));
  checar("titulo nao texto", !vinculoValido(vinculo({ titulo: 1 })));
  checar("pasta nula", vinculoValido(vinculo({ pasta: null })));
});

await teste("lapide continua valida", () => {
  checar("pasta removida", pastaValida(pasta({ removidoEm: 2 })));
  checar("vinculo removido", vinculoValido(vinculo({ removidoEm: 2 })));
});

await teste("pai apontando para pasta ausente nao invalida o envelope (resolvido na exibicao)", () => {
  const r = validarEnvelope(envelope({ p: [pasta({ id: "p1", pai: "sumiu" })] }), IDENT);
  checar("ok", "ok" in r);
});

await teste("nome que nao e texto e invalido sem lancar", () => {
  checar("numero", !pastaValida(pasta({ nome: 123 })));
  checar("ausente", !pastaValida({ ...pasta(), nome: undefined }));
});
