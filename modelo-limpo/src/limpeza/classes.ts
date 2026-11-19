/**
 * Escolha da classe de parágrafo entre as que a seção do editor aceita.
 *
 * As classes do SEI seguem uma convenção de nome estável entre órgãos (`Texto_Justificado_Recuo_Primeira_Linha`,
 * `Tabela_Texto_Centralizado`, `Texto_Centralizado_Maiusculas_Negrito`…). Os traços de cada uma saem do nome,
 * não do CSS: o CSS do órgão nem sempre chega (CK4, telas antigas) e o nome é o que o usuário vê na barra.
 */

export type Alinhamento = 'justify' | 'center' | 'left' | 'right';

/** Traços que mudam a aparência além de alinhamento e recuo. Classe com traço que a origem não tem perde pontos. */
export type Extra = 'maiusculas' | 'negrito' | 'cinza' | 'espacoDuplo' | 'dispositivo' | 'cabecalho' | 'citacao' | 'oficio' | 'tamanho';

export interface Tracos {
  tabela: boolean;
  alinhamento?: Alinhamento;
  recuo: boolean;
  extras: Set<Extra>;
}

export function tracosDoNome(classe: string): Tracos {
  const extras = new Set<Extra>();
  if (/Maiusc/i.test(classe)) extras.add('maiusculas');
  if (/Negrito/i.test(classe)) extras.add('negrito');
  if (/Fundo_Cinza/i.test(classe)) extras.add('cinza');
  if (/Espaco_Duplo/i.test(classe)) extras.add('espacoDuplo');
  if (/^(Item_|Paragrafo_Numerado|Nivel\d)/i.test(classe)) extras.add('dispositivo');
  if (/^Cabecalho/i.test(classe)) extras.add('cabecalho');
  if (/^Citacao/i.test(classe)) extras.add('citacao');
  if (/Oficio/i.test(classe)) extras.add('oficio');
  if (/(^|_)(8|10|12)(pt)?($|_)|_\d+pt/i.test(classe)) extras.add('tamanho');
  let alinhamento: Alinhamento | undefined;
  if (/Centralizad/i.test(classe)) alinhamento = 'center';
  else if (/Direita/i.test(classe)) alinhamento = 'right';
  else if (/Esquerda/i.test(classe)) alinhamento = 'left';
  else if (/Justificad|Just_/i.test(classe)) alinhamento = 'justify';
  return { tabela: /^Tabela_/i.test(classe), alinhamento, recuo: /Recuo/i.test(classe), extras };
}

/**
 * Classe permitida mais próxima dos traços pedidos, ou `undefined` quando nenhuma tem o mesmo alinhamento
 * (quem chama usa o estilo padrão da seção). Desempate: a de nome mais curto, que é a mais genérica.
 */
export function classeMaisProxima(alvo: Tracos, permitidas: string[]): string | undefined {
  if (!alvo.alinhamento) return undefined;
  const candidatas = permitidas.map((classe) => ({ classe, t: tracosDoNome(classe) }));
  const mesmaArea = candidatas.filter((c) => c.t.tabela === alvo.tabela);
  const base = mesmaArea.length ? mesmaArea : candidatas;
  let melhor: { classe: string; pontos: number } | undefined;
  for (const { classe, t } of base) {
    if (t.alinhamento !== alvo.alinhamento) continue;
    if (t.extras.has('dispositivo') || t.extras.has('cabecalho')) continue;
    let pontos = 0;
    if (t.tabela === alvo.tabela) pontos += 8;
    if (t.recuo === alvo.recuo) pontos += 4;
    for (const e of t.extras) pontos += alvo.extras.has(e) ? 2 : -3;
    for (const e of alvo.extras) if (!t.extras.has(e)) pontos -= 1;
    if (!melhor || pontos > melhor.pontos || (pontos === melhor.pontos && classe.length < melhor.classe.length)) {
      melhor = { classe, pontos };
    }
  }
  return melhor?.classe;
}
