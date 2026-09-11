/**
 * Utilitários de CNPJ.
 *
 * Empresas podem ter o CNPJ gravado ora com máscara ora apenas com dígitos,
 * dependendo do fluxo de cadastro (admin vs. self-service). Estas funções
 * normalizam a exibição independentemente do formato armazenado.
 *
 * Há duas funções de formatação, de propósito, porque os casos de uso são
 * diferentes: `formatarCnpj` é para EXIBIR um valor já gravado (não mascara
 * parcialmente, para não disfarçar dado inválido), e `mascararCnpjProgressivo`
 * é para DIGITAÇÃO em formulário (formata a cada tecla).
 */

/** Retorna apenas os dígitos do CNPJ (até 14). */
export function apenasDigitosCnpj(valor: string | null | undefined): string {
  return (valor ?? "").replace(/\D/g, "").slice(0, 14);
}

/**
 * Formata um CNPJ para exibição no padrão `00.000.000/0000-00`, aceitando
 * entrada já mascarada ou apenas dígitos. Se não houver 14 dígitos, devolve
 * o valor original (evita mascarar parcialmente valores incompletos/inválidos).
 */
export function formatarCnpj(valor: string | null | undefined): string {
  const d = apenasDigitosCnpj(valor);
  if (d.length !== 14) return valor ?? "";
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/**
 * Máscara progressiva para campos de digitação: formata o que já foi digitado,
 * sem exigir o número completo.
 */
export function mascararCnpjProgressivo(valor: string): string {
  const d = apenasDigitosCnpj(valor);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

const PESOS_PRIMEIRO_DV = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_SEGUNDO_DV = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function digitoVerificador(numeros: string, pesos: number[]): number {
  const soma = pesos.reduce((acc, peso, i) => acc + Number(numeros[i]) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Valida o CNPJ conferindo os dois dígitos verificadores.
 *
 * Espelha `backend/app/utils/cnpj.py`: as duas pontas precisam concordar,
 * senão o formulário aceita o que a API recusa. Sequências repetidas
 * (11111111111111) satisfazem o cálculo do dígito verificador e por isso são
 * recusadas explicitamente.
 */
export function validarCnpj(valor: string | null | undefined): boolean {
  const d = apenasDigitosCnpj(valor);
  if (d.length !== 14) return false;
  if (new Set(d).size === 1) return false;
  if (digitoVerificador(d.slice(0, 12), PESOS_PRIMEIRO_DV) !== Number(d[12])) return false;
  if (digitoVerificador(d.slice(0, 13), PESOS_SEGUNDO_DV) !== Number(d[13])) return false;
  return true;
}

/**
 * Mensagem de erro para exibir sob o campo, ou null quando está válido.
 *
 * Diferencia "ainda incompleto" de "inválido": quem está digitando não deve
 * ver erro de dígito verificador antes de terminar de digitar.
 */
export function erroCnpj(valor: string | null | undefined): string | null {
  const d = apenasDigitosCnpj(valor);
  if (d.length === 0) return "Informe o CNPJ da empresa a monitorar.";
  if (d.length < 14) return "O CNPJ deve ter 14 dígitos.";
  if (!validarCnpj(d)) return "CNPJ inválido. Confira os dígitos e tente novamente.";
  return null;
}
