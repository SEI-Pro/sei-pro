/**
 * Utilitários de CPF.
 *
 * Espelha a estrutura de `src/lib/cnpj.ts` de propósito: as duas funções são
 * usadas lado a lado na detecção de dados sensíveis, e divergir na assinatura
 * só criaria chance de trocar uma pela outra.
 *
 * Há duas funções de formatação, pelo mesmo motivo que no CNPJ: `formatarCpf`
 * é para EXIBIR valor já pronto (não mascara parcialmente, para não disfarçar
 * dado inválido) e `mascararCpfProgressivo` é para DIGITAÇÃO em formulário.
 */

/** Retorna apenas os dígitos do CPF (até 11). */
export function apenasDigitosCpf(valor: string | null | undefined): string {
  return (valor ?? "").replace(/\D/g, "").slice(0, 11);
}

/**
 * Formata para `000.000.000-00`. Sem 11 dígitos, devolve o valor original.
 */
export function formatarCpf(valor: string | null | undefined): string {
  const d = apenasDigitosCpf(valor);
  if (d.length !== 11) return valor ?? "";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Máscara progressiva para campo de digitação. */
export function mascararCpfProgressivo(valor: string): string {
  const d = apenasDigitosCpf(valor);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Dígito verificador módulo 11 com pesos decrescentes a partir de `pesoInicial`. */
function digitoVerificador(numeros: string, pesoInicial: number): number {
  let soma = 0;
  for (let i = 0; i < numeros.length; i += 1) {
    soma += Number(numeros[i]) * (pesoInicial - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/**
 * Valida o CPF conferindo os dois dígitos verificadores.
 *
 * Sequências repetidas (00000000000, 11111111111 …) satisfazem o cálculo e
 * por isso são recusadas explicitamente — é a mesma armadilha já tratada em
 * `validarCnpj`.
 */
export function validarCpf(valor: string | null | undefined): boolean {
  const d = apenasDigitosCpf(valor);
  if (d.length !== 11) return false;
  if (new Set(d).size === 1) return false;
  if (digitoVerificador(d.slice(0, 9), 10) !== Number(d[9])) return false;
  if (digitoVerificador(d.slice(0, 10), 11) !== Number(d[10])) return false;
  return true;
}

/** Exibição segura: `123.***.**9-09`. Mantém o começo e o fim para conferência. */
export function mascararCpfParaExibicao(valor: string | null | undefined): string {
  const d = apenasDigitosCpf(valor);
  if (d.length !== 11) return "***";
  return `${d.slice(0, 3)}.***.**${d[8]}-${d.slice(9)}`;
}

/** Mensagem de erro para exibir sob o campo, ou null quando está válido. */
export function erroCpf(valor: string | null | undefined): string | null {
  const d = apenasDigitosCpf(valor);
  if (d.length === 0) return "Informe o CPF.";
  if (d.length < 11) return "O CPF deve ter 11 dígitos.";
  if (!validarCpf(d)) return "CPF inválido. Confira os dígitos e tente novamente.";
  return null;
}
