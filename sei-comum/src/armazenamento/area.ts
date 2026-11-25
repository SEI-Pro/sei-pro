/**
 * Área de chave-valor com a forma do `chrome.storage`, para os módulos não
 * dependerem do navegador nos testes. Os dados vivem no `chrome.storage.local`,
 * que sobrevive à limpeza de cache e de dados de site (só a desinstalação
 * apaga). Essa é a primeira defesa contra a perda de favoritos relatada pelos
 * usuários, que guardavam tudo no localStorage da página do SEI.
 */

export type Mudancas = Record<string, { novo?: unknown; antigo?: unknown }>;

export interface Area {
  obter(chaves?: string | string[] | null): Promise<Record<string, unknown>>;
  gravar(itens: Record<string, unknown>): Promise<void>;
  remover(chaves: string | string[]): Promise<void>;
  /** Só os nomes das chaves (sem os valores). Ausente onde o navegador não oferece `getKeys`. */
  chaves?(): Promise<string[]>;
  /** Avisa mudanças feitas por QUALQUER contexto (outra aba, o app, o content script). */
  aoMudar(cb: (m: Mudancas) => void): () => void;
}

/**
 * O `onChanged` do Chrome fala `{ newValue, oldValue }`; os módulos leem `{ novo, antigo }` (o formato do
 * `areaMemoria`). Só os campos presentes: a chave removida chega sem `novo` (e a chave nova, sem `antigo`), e um
 * `null` gravado continua `novo: null`.
 */
function traduzirMudancas(m: Record<string, chrome.storage.StorageChange>): Mudancas {
  const saida: Mudancas = {};
  for (const [chave, c] of Object.entries(m)) {
    const t: { novo?: unknown; antigo?: unknown } = {};
    if (c && "newValue" in c) t.novo = c.newValue;
    if (c && "oldValue" in c) t.antigo = c.oldValue;
    saida[chave] = t;
  }
  return saida;
}

export function areaChrome(area: chrome.storage.StorageArea, nome: "local" | "sync" | "session"): Area {
  return {
    obter: async (chaves = null) => (await area.get(chaves)) as Record<string, unknown>,
    gravar: async (itens) => {
      await area.set(itens);
    },
    remover: async (chaves) => {
      await area.remove(chaves);
    },
    // getKeys (Chrome 130+, Firefox 143+) evita transferir os valores de todo o storage, que o
    // Agente também usa, só para descobrir quais chaves são de uma coleção.
    chaves:
      typeof (area as { getKeys?: unknown }).getKeys === "function"
        ? async () => await (area as unknown as { getKeys(): Promise<string[]> }).getKeys()
        : undefined,
    aoMudar(cb) {
      const ouvinte = (m: Record<string, chrome.storage.StorageChange>, n: string) => {
        if (n === nome) cb(traduzirMudancas(m));
      };
      try {
        chrome.storage.onChanged.addListener(ouvinte);
      } catch {
        /* contexto da extensao invalidado */
      }
      return () => {
        try {
          chrome.storage.onChanged.removeListener(ouvinte);
        } catch {
          /* contexto da extensao invalidado */
        }
      };
    },
  };
}

export function areaMemoria(inicial: Record<string, unknown> = {}): Area {
  const dados = new Map<string, unknown>(Object.entries(structuredClone(inicial)));
  const ouvintes = new Set<(m: Mudancas) => void>();
  const avisar = (m: Mudancas) => {
    if (Object.keys(m).length) for (const o of [...ouvintes]) o(m);
  };
  return {
    async obter(chaves = null) {
      const lista = chaves === null ? [...dados.keys()] : typeof chaves === "string" ? [chaves] : chaves;
      const saida: Record<string, unknown> = {};
      for (const k of lista) if (dados.has(k)) saida[k] = structuredClone(dados.get(k));
      return saida;
    },
    async gravar(itens) {
      const m: Mudancas = {};
      for (const [k, v] of Object.entries(itens)) {
        m[k] = { antigo: dados.get(k), novo: structuredClone(v) };
        dados.set(k, structuredClone(v));
      }
      avisar(m);
    },
    async remover(chaves) {
      const m: Mudancas = {};
      for (const k of typeof chaves === "string" ? [chaves] : chaves) {
        if (!dados.has(k)) continue;
        m[k] = { antigo: dados.get(k) };
        dados.delete(k);
      }
      avisar(m);
    },
    async chaves() {
      return [...dados.keys()];
    },
    aoMudar(cb) {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
  };
}
