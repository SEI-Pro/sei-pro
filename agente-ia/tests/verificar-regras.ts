/**
 * Regras da unidade: o que barra, o que só avisa, e o que passa.
 *
 * A regra existe justamente para não depender do modelo lembrar, então o
 * teste olha o veredito — não o prompt.
 */

import { avaliarRegras, recadoDoBloqueio, REGRAS_SUGERIDAS, type Regra } from "../src/painel/regras";
import { checar, secao } from "./util";

const regra = (r: Partial<Regra> = {}): Regra => ({
  id: "r1",
  nome: "Regra",
  ativa: true,
  efeito: "bloquear",
  ferramentas: [],
  mensagem: "Não pode.",
  ...r,
});

const passo = (tool: string, args: Record<string, unknown> = {}, rotulo = tool) => ({ tool, rotulo, args });

export function verificarRegras(): void {
  secao("regras: alcance");
  const enviar = passo("processo_enviar", { processos: ["1"], unidades: ["GABIN"] }, "Enviar 1 processo");
  const marcar = passo("processo_marcador", { processos: ["1"], marcador: "Urgente" }, "Aplicar marcador");

  checar("regra sem ferramenta alcanca qualquer escrita", avaliarRegras([regra()], [marcar]).bloqueios.length === 1);
  checar("regra com ferramenta so alcanca ela", avaliarRegras([regra({ ferramentas: ["processo_enviar"] })], [marcar]).bloqueios.length === 0);
  checar("e alcanca quando e ela", avaliarRegras([regra({ ferramentas: ["processo_enviar"] })], [enviar]).bloqueios.length === 1);
  checar("regra desligada nao vale", avaliarRegras([regra({ ativa: false })], [enviar]).bloqueios.length === 0);

  secao("regras: condicao de texto");
  const portaria = regra({ ferramentas: ["documento_criar"], contem: "Portaria" });
  checar(
    "casa no argumento, sem acento e sem caixa",
    avaliarRegras([portaria], [passo("documento_criar", { processo: "1", tipo: "PORTARIA" })]).bloqueios.length === 1,
  );
  checar("nao casa outro tipo", avaliarRegras([portaria], [passo("documento_criar", { processo: "1", tipo: "Despacho" })]).bloqueios.length === 0);
  checar(
    "casa tambem pelo rotulo da acao",
    avaliarRegras([regra({ contem: "GABIN" })], [passo("processo_enviar", { processos: ["1"] }, "Enviar para GABIN")]).bloqueios.length === 1,
  );

  secao("regras: bloquear x avisar");
  const v = avaliarRegras([regra({ efeito: "avisar", nome: "Atenção" })], [enviar]);
  checar("avisar nao bloqueia", v.bloqueios.length === 0 && v.avisos.length === 1);
  const dois = avaliarRegras([regra({ id: "a", efeito: "avisar" }), regra({ id: "b", nome: "Proibido" })], [enviar]);
  checar("bloqueio e aviso convivem", dois.bloqueios.length === 1 && dois.avisos.length === 1);

  secao("regras: recado ao modelo");
  const recado = recadoDoBloqueio(avaliarRegras([regra({ nome: "Sem envio", mensagem: "Aqui quem envia e uma pessoa." })], [enviar]));
  checar("diz que nada foi feito", /nada foi feito no SEI/i.test(recado));
  checar("cita a regra e a mensagem", recado.includes("Sem envio") && recado.includes("Aqui quem envia e uma pessoa."));
  checar("manda explicar em vez de insistir", /não tente de novo/i.test(recado));

  secao("regras: modelos prontos");
  checar("tem modelo que bloqueia envio", REGRAS_SUGERIDAS.some((r) => r.ferramentas.includes("processo_enviar") && r.efeito === "bloquear"));
  checar("tem modelo que so avisa na assinatura", REGRAS_SUGERIDAS.some((r) => r.efeito === "avisar" && r.ferramentas.includes("documento_assinar")));
  checar("modelo arriscado vem desligado", REGRAS_SUGERIDAS.every((r) => r.ativa || Boolean(r.contem)));
}
