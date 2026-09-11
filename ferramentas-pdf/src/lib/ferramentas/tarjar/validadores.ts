/**
 * Validadores dos dados sensíveis detectáveis.
 *
 * POR QUE VALIDAR, e não só casar a regex: numa petição de vinte páginas há
 * dezenas de sequências de onze dígitos que não são CPF — número de protocolo,
 * matrícula, código de barras, valor sem separador. Marcar todas treina o
 * usuário a clicar em "desmarcar tudo", e é exatamente aí que o CPF de verdade
 * escapa junto. O dígito verificador derruba quase todo esse ruído de graça.
 *
 * O QUE NÃO TEM COMO VALIDAR fica registrado como tal e é exibido ao usuário
 * com selo diferente: RG não tem dígito verificador nacional, e um "provável"
 * apresentado com a mesma confiança de um CPF conferido seria desonesto.
 */

import { validarCpf } from "@/lib/cpf";
import { validarCnpj } from "@/lib/cnpj";

export { validarCpf, validarCnpj };

function digitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

function todosIguais(d: string): boolean {
  return new Set(d).size === 1;
}

/**
 * PIS / PASEP / NIT / NIS.
 *
 * Onze dígitos com um verificador módulo 11 de pesos fixos. Colide em
 * comprimento com CPF e CNH, e a desempate está em `deteccao.ts`.
 */
const PESOS_PIS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function validarPis(valor: string): boolean {
  const d = digitos(valor);
  if (d.length !== 11 || todosIguais(d)) return false;
  const soma = PESOS_PIS.reduce((acc, peso, i) => acc + Number(d[i]) * peso, 0);
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;
  return dv === Number(d[10]);
}

/**
 * Título de eleitor.
 *
 * Doze dígitos: oito de sequencial, dois de código de UF (01 a 28) e dois
 * verificadores. O código de UF é o que dá força ao teste — sem ele, doze
 * dígitos quaisquer passariam com frequência incômoda.
 *
 * A regra de exceção para São Paulo (01) e Minas Gerais (02) não é
 * arbitrariedade nossa: é como o TSE especifica o resto zero.
 */
export function validarTituloEleitor(valor: string): boolean {
  const d = digitos(valor);
  if (d.length !== 12 || todosIguais(d)) return false;

  const uf = Number(d.slice(8, 10));
  if (uf < 1 || uf > 28) return false;
  const excecaoSpMg = uf === 1 || uf === 2;

  let soma = 0;
  for (let i = 0; i < 8; i += 1) soma += Number(d[i]) * (i + 2);
  let dv1 = soma % 11;
  if (dv1 === 10) dv1 = 0;
  else if (dv1 === 0 && excecaoSpMg) dv1 = 1;
  if (dv1 !== Number(d[10])) return false;

  const soma2 = Number(d[8]) * 7 + Number(d[9]) * 8 + dv1 * 9;
  let dv2 = soma2 % 11;
  if (dv2 === 10) dv2 = 0;
  else if (dv2 === 0 && excecaoSpMg) dv2 = 1;
  return dv2 === Number(d[11]);
}

/**
 * Número de registro de CNH.
 *
 * Onze dígitos com dois verificadores de pesos espelhados. Colide com CPF e
 * PIS, e como é o mais fraco dos três, `deteccao.ts` exige rótulo por perto.
 */
export function validarCnh(valor: string): boolean {
  const d = digitos(valor);
  if (d.length !== 11 || todosIguais(d)) return false;

  let soma1 = 0;
  let soma2 = 0;
  for (let i = 0; i < 9; i += 1) {
    soma1 += Number(d[i]) * (9 - i);
    soma2 += Number(d[i]) * (1 + i);
  }

  let dv1 = soma1 % 11;
  const ajuste = dv1 >= 10 ? 2 : 0;
  if (dv1 >= 10) dv1 = 0;
  if (dv1 !== Number(d[9])) return false;

  let dv2 = soma2 % 11;
  dv2 = dv2 >= 10 ? 0 : dv2 - ajuste;
  if (dv2 < 0) dv2 += 11;
  return dv2 === Number(d[10]);
}

/** Algoritmo de Luhn, usado no número de cartão de pagamento. */
export function validarLuhn(valor: string): boolean {
  const d = digitos(valor);
  if (d.length < 12) return false;
  let soma = 0;
  let dobra = false;
  for (let i = d.length - 1; i >= 0; i -= 1) {
    let n = Number(d[i]);
    if (dobra) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    soma += n;
    dobra = !dobra;
  }
  return soma % 10 === 0;
}

/**
 * Prefixos de bandeira conhecidos.
 *
 * Luhn sozinho aceita um em cada dez números aleatórios do tamanho certo, o
 * que é ruído demais num documento cheio de códigos. Exigir também um prefixo
 * de emissor real derruba quase tudo o que sobrou.
 */
export function pareceCartaoDePagamento(valor: string): boolean {
  const d = digitos(valor);
  if (d.length < 13 || d.length > 19) return false;
  if (!validarLuhn(d)) return false;

  const doisPrimeiros = Number(d.slice(0, 2));
  const quatroPrimeiros = Number(d.slice(0, 4));
  return (
    d[0] === "4" || // Visa
    (doisPrimeiros >= 51 && doisPrimeiros <= 55) || // Mastercard
    (quatroPrimeiros >= 2221 && quatroPrimeiros <= 2720) || // Mastercard (faixa nova)
    doisPrimeiros === 34 ||
    doisPrimeiros === 37 || // American Express
    d.startsWith("6011") ||
    doisPrimeiros === 65 || // Discover
    doisPrimeiros === 36 ||
    doisPrimeiros === 38 || // Diners
    doisPrimeiros === 60 || // Hipercard
    d.startsWith("606282") // Hipercard
  );
}

/** DDDs efetivamente em uso no Brasil. */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function dddValido(ddd: number): boolean {
  return DDDS.has(ddd);
}

/**
 * Telefone brasileiro com DDD, com ou sem o 55 na frente.
 *
 * Celular tem nove dígitos e começa por 9; fixo tem oito e começa de 2 a 5.
 * A distinção derruba número de protocolo que por acaso tem dez dígitos.
 */
export function validarTelefoneBr(valor: string): boolean {
  let d = digitos(valor);
  if (d.length === 12 || d.length === 13) {
    if (!d.startsWith("55")) return false;
    d = d.slice(2);
  }
  if (d.length !== 10 && d.length !== 11) return false;
  if (todosIguais(d.slice(2))) return false;
  if (!dddValido(Number(d.slice(0, 2)))) return false;

  const assinante = d.slice(2);
  if (assinante.length === 9) return assinante[0] === "9";
  return /^[2-5]/.test(assinante);
}

/** Data no calendário, em `dd/mm/aaaa` ou com ponto ou hífen. */
export function validarDataBrasileira(valor: string): { ano: number } | null {
  const m = /^(\d{2})[/.-](\d{2})[/.-](\d{4})$/.exec(valor.trim());
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  if (mes < 1 || mes > 12 || dia < 1) return null;
  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia > diasNoMes) return null;
  return { ano };
}

/**
 * Número único de processo judicial (Resolução CNJ 65/2008).
 *
 * Vinte dígitos com verificador módulo 97. Vale detectar porque aparece em
 * peça administrativa e porque, sem isso, o miolo dele passaria por CPF.
 */
export function validarProcessoCnj(valor: string): boolean {
  const d = digitos(valor);
  if (d.length !== 20) return false;
  const sequencial = d.slice(0, 7);
  const dv = d.slice(7, 9);
  const resto = d.slice(9); // ano + segmento + tribunal + origem
  let acumulado = 0;
  for (const c of `${sequencial}${resto}00`) {
    acumulado = (acumulado * 10 + Number(c)) % 97;
  }
  return 98 - acumulado === Number(dv);
}

/**
 * Sequência longa demais para ser dado pessoal.
 *
 * Linha digitável de boleto tem 47 ou 48 dígitos e código de barras tem 44.
 * Sem esta barreira, o miolo deles casa com CPF, CNPJ e cartão o tempo todo.
 */
export const LIMITE_DIGITOS_SEGUIDOS = 20;

/** UUID versão 4, o formato da chave PIX aleatória. */
export function validarUuidV4(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    valor.trim(),
  );
}
