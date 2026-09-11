/**
 * Tipos das APIs de extensão que este projeto usa.
 *
 * Declarados à mão em vez de trazer `@types/chrome`: são quatro membros, e o
 * pacote completo custaria dezenas de milhares de linhas de definição para
 * cobrir APIs que a extensão nem pede permissão para usar. Se um dia o uso
 * crescer, trocar por ele é direto.
 */

declare namespace chrome {
  namespace runtime {
    interface Port {
      name: string;
      postMessage(mensagem: unknown): void;
      disconnect(): void;
      onMessage: {
        addListener(ouvinte: (mensagem: unknown, porta: Port) => void): void;
      };
      onDisconnect: {
        addListener(ouvinte: (porta: Port) => void): void;
      };
    }

    function connect(info?: { name?: string }): Port;
    function getURL(caminho: string): string;

    const onConnect: {
      addListener(ouvinte: (porta: Port) => void): void;
    };

    /** Presente quando a última chamada falhou. Ler limpa o estado. */
    const lastError: { message?: string } | undefined;
  }

  namespace storage {
    interface Area {
      get(chaves?: string | string[] | Record<string, unknown> | null): Promise<Record<string, unknown>>;
      set(itens: Record<string, unknown>): Promise<void>;
      remove(chaves: string | string[]): Promise<void>;
    }
    const local: Area;
    const sync: Area;

    const onChanged: {
      addListener(
        ouvinte: (
          mudancas: Record<string, { oldValue?: unknown; newValue?: unknown }>,
          area: string,
        ) => void,
      ): void;
    };
  }
}

/** O Firefox expõe a mesma superfície sob `browser`. */
declare const browser: typeof chrome | undefined;
