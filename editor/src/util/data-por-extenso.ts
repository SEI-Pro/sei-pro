const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** `"2024-01-05"` (o valor de um `<input type=date>`) -> `"5 de jan de 2024"`, o `moment(...).format("ll")` do legado em pt-BR. `""` se a data nao existe. */
export function dataPorExtenso(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return "";
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(ano, mes - 1, dia);
  if (d.getFullYear() !== ano || d.getMonth() !== mes - 1 || d.getDate() !== dia) return "";
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}
