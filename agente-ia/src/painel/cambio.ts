/**
 * Cotação do dólar, para o painel mostrar o gasto em reais.
 *
 * O serviço de IA cobra em dólar; quem usa o SEI raciocina em real. A conversão
 * aqui é uma REFERÊNCIA, não contabilidade: a cotação do dia basta, e por isso
 * fica guardada por seis horas em `chrome.storage.local`.
 *
 * Fonte: **PTAX do Banco Central** (Olinda, sem chave, sem cadastro) — a
 * referência oficial para a administração pública. A consulta pede um período
 * de dez dias e pega a última cotação, porque fim de semana e feriado não têm
 * boletim. Se o BC estiver fora do ar, cai para a AwesomeAPI; se as duas
 * falharem, o painel continua mostrando dólares.
 */

export interface Cotacao {
  /** Reais por dólar. */
  valor: number;
  fonte: string;
  /** Quando a cotação foi publicada (texto curto para o usuário). */
  dia: string;
  /** Quando foi buscada, em ms — controla a validade do cache. */
  quando: number;
}

const CHAVE = "agenteIA_cambio";
const VALIDADE = 6 * 60 * 60 * 1000;

const ddmmaaaa = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
const mmddaaaa = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;

async function doBancoCentral(f: typeof fetch): Promise<Cotacao | null> {
  const hoje = new Date();
  const inicio = new Date(hoje.getTime() - 10 * 86_400_000);
  const url =
    "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@i,dataFinalCotacao=@f)" +
    `?@i='${mmddaaaa(inicio)}'&@f='${mmddaaaa(hoje)}'&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoVenda,dataHoraCotacao`;
  const r = await f(url);
  if (!r.ok) return null;
  const j = (await r.json()) as { value?: Array<{ cotacaoVenda?: number; dataHoraCotacao?: string }> };
  const item = j.value?.[0];
  if (!item?.cotacaoVenda) return null;
  const [data] = (item.dataHoraCotacao ?? "").split(" ");
  const [a, m, d] = data.split("-");
  return { valor: item.cotacaoVenda, fonte: "PTAX/Banco Central", dia: d && m && a ? `${d}/${m}/${a}` : ddmmaaaa(new Date()), quando: Date.now() };
}

async function daAwesome(f: typeof fetch): Promise<Cotacao | null> {
  const r = await f("https://economia.awesomeapi.com.br/json/last/USD-BRL");
  if (!r.ok) return null;
  const j = (await r.json()) as { USDBRL?: { bid?: string; create_date?: string } };
  const valor = Number(j.USDBRL?.bid);
  if (!Number.isFinite(valor) || valor <= 0) return null;
  return { valor, fonte: "AwesomeAPI", dia: (j.USDBRL?.create_date ?? "").split(" ")[0]?.split("-").reverse().join("/") || ddmmaaaa(new Date()), quando: Date.now() };
}

/** Cotação do dia, do cache ou da rede. `null` quando não dá para saber. */
export async function cotacaoDolar(f: typeof fetch = fetch): Promise<Cotacao | null> {
  let guardada: Cotacao | null = null;
  try {
    guardada = ((await chrome.storage.local.get(CHAVE))[CHAVE] as Cotacao | undefined) ?? null;
  } catch {
    /* sem storage: busca direto */
  }
  if (guardada && Date.now() - guardada.quando < VALIDADE) return guardada;
  for (const buscar of [doBancoCentral, daAwesome]) {
    try {
      const nova = await buscar(f);
      if (nova) {
        await chrome.storage.local.set({ [CHAVE]: nova }).catch(() => undefined);
        return nova;
      }
    } catch {
      /* tenta a próxima fonte */
    }
  }
  // Rede fora: uma cotação velha ainda serve de referência; nada não serve.
  return guardada;
}
