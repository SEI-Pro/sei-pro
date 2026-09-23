/**
 * Rotinas: quando uma pergunta agendada está vencida.
 *
 * O que mais importa é não disparar duas vezes pela mesma janela e não
 * acumular execuções de quem ficou uma semana fora.
 */

import { descreverFrequencia, vencidas, vencimento, type Rotina } from "../src/painel/rotinas";
import { checar, secao } from "./util";

const rotina = (r: Partial<Rotina> = {}): Rotina => ({
  id: "r1",
  nome: "Parados",
  pergunta: "liste os processos parados",
  frequencia: "diaria",
  hora: "08:00",
  ativa: true,
  ...r,
});

// 23/09/2026 é uma quarta-feira.
const quarta10h = new Date(2026, 8, 23, 10, 0);
const quarta7h = new Date(2026, 8, 23, 7, 0);

export function verificarRotinas(): void {
  secao("rotinas: diaria");
  checar("antes da hora, nao vence", vencidas([rotina()], quarta7h).length === 0);
  checar("depois da hora, vence", vencidas([rotina()], quarta10h).length === 1);
  checar("desligada nunca vence", vencidas([rotina({ ativa: false })], quarta10h).length === 0);
  checar("sem pergunta nao vence", vencidas([rotina({ pergunta: "  " })], quarta10h).length === 0);
  const jaRodouHoje = rotina({ ultimaEm: new Date(2026, 8, 23, 8, 30).getTime() });
  checar("nao roda duas vezes no mesmo dia", vencidas([jaRodouHoje], quarta10h).length === 0);
  const rodouOntem = rotina({ ultimaEm: new Date(2026, 8, 22, 9, 0).getTime() });
  checar("rodou ontem, vence de novo hoje", vencidas([rodouOntem], quarta10h).length === 1);

  secao("rotinas: semanal");
  const semanal = rotina({ frequencia: "semanal", diaSemana: 1 }); // segunda
  checar("na quarta, a segunda ja passou: vence", vencidas([semanal], quarta10h).length === 1);
  checar("mas nao se ja rodou na segunda", vencidas([{ ...semanal, ultimaEm: new Date(2026, 8, 21, 9, 0).getTime() }], quarta10h).length === 0);
  const naQuarta = rotina({ frequencia: "semanal", diaSemana: 3 });
  checar("no proprio dia, depois da hora, vence", vencidas([naQuarta], quarta10h).length === 1);
  checar("no proprio dia, antes da hora, nao vence", vencidas([naQuarta], quarta7h).length === 0);
  checar("quem sumiu uma semana volta com UMA pendencia", vencidas([{ ...semanal, ultimaEm: new Date(2026, 8, 7, 9, 0).getTime() }], quarta10h).length === 1);

  secao("rotinas: mensal");
  const mensal = rotina({ frequencia: "mensal", diaMes: 20 });
  checar("dia 23, o dia 20 ja passou: vence", vencidas([mensal], quarta10h).length === 1);
  checar("mas nao se rodou no dia 20", vencidas([{ ...mensal, ultimaEm: new Date(2026, 8, 20, 9, 0).getTime() }], quarta10h).length === 0);
  const dia25 = rotina({ frequencia: "mensal", diaMes: 25 });
  const venc25 = vencimento(dia25, quarta10h);
  checar("dia 25 ainda nao chegou: a janela e a do mes passado", venc25?.getMonth() === 7, venc25?.toISOString());
  checar("e ja rodou no mes passado, entao nao vence", vencidas([{ ...dia25, ultimaEm: new Date(2026, 7, 25, 9, 0).getTime() }], quarta10h).length === 0);

  secao("rotinas: como aparece para o usuario");
  checar("diaria", descreverFrequencia(rotina()) === "todo dia, a partir das 08:00");
  checar("semanal diz o dia", descreverFrequencia(rotina({ frequencia: "semanal", diaSemana: 5 })).includes("sexta"));
  checar("mensal diz o dia do mes", descreverFrequencia(rotina({ frequencia: "mensal", diaMes: 10 })).includes("dia 10"));
}
