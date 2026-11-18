/**
 * Sincronia por arquivo: um .json numa pasta que o próprio usuário já
 * sincroniza (OneDrive, Google Drive, Dropbox, rede). Leva tudo do usuário no
 * módulo: é o backup completo e legível.
 *
 * Chrome/Edge: File System Access, com o "handle" guardado no IndexedDB da
 * extensão (banco do módulo, depósito "arquivos") e permissão pedida por gesto
 * ("Reconectar arquivo") quando expira. Firefox não tem a API: lá valem
 * "Exportar" e "Importar", que já mesclam.
 *
 * Ler sempre MESCLA; arquivo ilegível nunca apaga nada e é regravado; arquivo
 * de versão mais nova do SEI Pro não é tocado; o que o arquivo tem de outro
 * usuário ou outro SEI (o mesmo arquivo escolhido em dois lugares) fica.
 */

import type { Area } from "../armazenamento/area";
import { noDeposito } from "./banco";
import { escolherPelaJanelaDaExtensao, seletorBarradoNoIframe } from "./escolhaPorJanela";
import type { Dono } from "./copias";
import { versaoMaisNova } from "./textoPadraoCodec";

export interface ArquivoSync {
  ler(): Promise<string>;
  gravar(conteudo: string): Promise<void>;
}

export interface StatusArquivo {
  estado: "ok" | "erro" | "permissao";
  quando: number;
  mensagem?: string;
  nome?: string;
}

export interface MensagensArquivo {
  maisNovo: string;
  regravado: string;
  outros(n: number): string;
  permissao: string;
}

export const MENSAGENS_ARQUIVO: MensagensArquivo = {
  maisNovo: "O arquivo foi gravado por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o arquivo não foi alterado.",
  regravado: "O arquivo estava ilegível e foi regravado a partir deste computador.",
  outros: (n) =>
    `O arquivo também tem dados de ${n === 1 ? "outro usuário ou outro SEI" : `${n} outros usuários ou SEIs`}, que foram mantidos.`,
  permissao: "O navegador pede de novo a permissão do arquivo.",
};

/** O que o módulo ensina à sincronia por arquivo. */
export interface AdaptadorArquivo<E> {
  /** `formato` e `versao` do envelope: arquivo com o mesmo formato e versão maior é "mais novo". */
  formato: string;
  versao: number;
  /** O envelope do JSON lido, já validado, ou null se não é deste módulo (vira "ilegível"). */
  ler(bruto: unknown): E | null;
  /** Mescla no armazenamento local o que é do dono (o de outros fica como está). */
  importar(envelope: E): Promise<unknown>;
  /** O que gravar: tudo do dono + o que o arquivo lido tinha de outros (`outros` = quantos). */
  exportar(lido: E | null): Promise<{ envelope: E; outros: number }>;
  assinatura(envelope: E): string;
  mensagens?: Partial<MensagensArquivo>;
}

/** O Bloco de Notas do Windows grava o arquivo com BOM (U+FEFF) no começo: o JSON.parse recusaria. */
const semBom = (texto: string): string => (texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto);

export class SincroniaArquivo<E> {
  constructor(
    private readonly d: {
      area: Area;
      chaveStatus: string;
      arquivo: ArquivoSync;
      adaptador: AdaptadorArquivo<E>;
      nome?: string;
    },
  ) {}

  async sincronizar(): Promise<StatusArquivo> {
    const agora = Date.now();
    const a = this.d.adaptador;
    const m = { ...MENSAGENS_ARQUIVO, ...a.mensagens };
    try {
      const texto = await this.d.arquivo.ler();
      let remota = "";
      let invalido = false;
      let lido: E | null = null;
      if (texto.trim()) {
        let bruto: unknown = null;
        try {
          bruto = JSON.parse(semBom(texto));
        } catch {
          bruto = null;
        }
        if (versaoMaisNova(bruto, a.formato, a.versao))
          return this.status({ estado: "erro", quando: agora, nome: this.d.nome, mensagem: m.maisNovo });
        lido = bruto === null ? null : a.ler(bruto);
        if (lido) {
          await a.importar(lido);
          remota = a.assinatura(lido);
        } else {
          invalido = true;
        }
      }
      const { envelope, outros } = await a.exportar(lido);
      if (!texto.trim() || invalido || a.assinatura(envelope) !== remota) await this.d.arquivo.gravar(JSON.stringify(envelope, null, 2));
      return this.status({
        estado: "ok",
        quando: agora,
        nome: this.d.nome,
        mensagem: invalido ? m.regravado : outros ? m.outros(outros) : undefined,
      });
    } catch (e) {
      const nome = (e as { name?: string } | null)?.name;
      if (nome === "NotAllowedError" || nome === "SecurityError") {
        return this.status({ estado: "permissao", quando: agora, nome: this.d.nome, mensagem: m.permissao });
      }
      return this.status({ estado: "erro", quando: agora, nome: this.d.nome, mensagem: e instanceof Error ? e.message : String(e) });
    }
  }

  private async status(s: StatusArquivo): Promise<StatusArquivo> {
    await this.d.area.gravar({ [this.d.chaveStatus]: s });
    return s;
  }
}

/* ---- File System Access (Chrome/Edge) ---- */

interface Permissivel {
  queryPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
  requestPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
}
export type HandleArquivo = FileSystemFileHandle & Permissivel;

export function temSeletorDeArquivo(w: unknown = globalThis): boolean {
  return typeof (w as { showSaveFilePicker?: unknown }).showSaveFilePicker === "function";
}

export function arquivoDoHandle(handle: HandleArquivo): ArquivoSync {
  return {
    ler: async () => (await handle.getFile()).text(),
    gravar: async (conteudo) => {
      const w = await handle.createWritable();
      await w.write(conteudo);
      await w.close();
    },
  };
}

/** "granted" sem perguntar; "prompt" pede gesto do usuário (botão "Reconectar arquivo"). */
export async function permissao(handle: HandleArquivo, pedir: boolean): Promise<PermissionState> {
  const o = { mode: "readwrite" as const };
  const atual = (await handle.queryPermission?.(o)) ?? "granted";
  if (atual === "granted" || !pedir) return atual;
  return (await handle.requestPermission?.(o)) ?? "denied";
}

export interface ArmazemHandles {
  ler(d: Dono): Promise<HandleArquivo | undefined>;
  guardar(d: Dono, h: HandleArquivo): Promise<unknown>;
  esquecer(d: Dono): Promise<unknown>;
}

/** O handle fica no IndexedDB da extensão (o storage do navegador não guarda handles), no banco do módulo. */
export function handlesNoIndexedDB(banco: string, fabrica?: IDBFactory): ArmazemHandles {
  const chave = (d: Dono) => `${d.host}|${d.login.toLowerCase()}`;
  return {
    ler: (d) =>
      noDeposito<HandleArquivo | undefined>(
        banco,
        "arquivos",
        "readonly",
        (s) => s.get(chave(d)) as IDBRequest<HandleArquivo | undefined>,
        fabrica,
      ),
    guardar: (d, h) => noDeposito(banco, "arquivos", "readwrite", (s) => s.put(h, chave(d)), fabrica),
    esquecer: (d) => noDeposito(banco, "arquivos", "readwrite", (s) => s.delete(chave(d)), fabrica),
  };
}

export interface DepsControleArquivo<E> {
  area: Area;
  dono: Dono;
  /** Onde o StatusArquivo fica na área local. */
  chaveStatus: string;
  handles: ArmazemHandles;
  /** Seletor do navegador (precisa de gesto do usuário): "novo" = Salvar como, "existente" = Abrir. */
  escolher(modo: "novo" | "existente"): Promise<HandleArquivo | null>;
  adaptador: AdaptadorArquivo<E>;
  atraso?: number;
}

/** O arquivo no app: escolher, reconectar, sincronizar ao abrir/ganhar foco e `atraso` (15 s) depois de mudar. */
export class ControleArquivo<E> {
  private espera: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly d: DepsControleArquivo<E>) {}

  async configurado(): Promise<boolean> {
    return Boolean(await this.d.handles.ler(this.d.dono).catch(() => undefined));
  }

  async status(): Promise<StatusArquivo | null> {
    const k = this.d.chaveStatus;
    return ((await this.d.area.obter(k))[k] as StatusArquivo | undefined) ?? null;
  }

  /** null quando não há arquivo escolhido. `pedir` só com gesto do usuário. */
  async sincronizar(pedir = false): Promise<StatusArquivo | null> {
    const h = await this.d.handles.ler(this.d.dono).catch(() => undefined);
    if (!h) return null;
    if ((await permissao(h, pedir).catch(() => "denied" as PermissionState)) !== "granted") {
      const s: StatusArquivo = {
        estado: "permissao",
        quando: Date.now(),
        nome: h.name,
        mensagem: this.d.adaptador.mensagens?.permissao ?? MENSAGENS_ARQUIVO.permissao,
      };
      await this.d.area.gravar({ [this.d.chaveStatus]: s });
      return s;
    }
    return new SincroniaArquivo<E>({
      area: this.d.area,
      chaveStatus: this.d.chaveStatus,
      arquivo: arquivoDoHandle(h),
      adaptador: this.d.adaptador,
      nome: h.name,
    }).sincronizar();
  }

  async escolher(modo: "novo" | "existente" = "novo"): Promise<StatusArquivo | null> {
    const h = await this.d.escolher(modo);
    if (!h) return null;
    await this.d.handles.guardar(this.d.dono, h);
    return this.sincronizar(true);
  }

  reconectar(): Promise<StatusArquivo | null> {
    return this.sincronizar(true);
  }

  async esquecer(): Promise<void> {
    clearTimeout(this.espera);
    await this.d.handles.esquecer(this.d.dono);
    await this.d.area.remover(this.d.chaveStatus);
  }

  agendar(): void {
    clearTimeout(this.espera);
    this.espera = setTimeout(() => void this.sincronizar().catch(() => undefined), this.d.atraso ?? 15_000);
  }

  parar(): void {
    clearTimeout(this.espera);
  }
}

/**
 * Seletor de arquivo do navegador (File System Access). Cancelar devolve null.
 * Em iframe de outra origem o Chrome recusa o seletor (issue #186): então a escolha vai para uma janela da
 * extensão (`viaJanela`; `null` desliga, para a janela que já é de nível superior e para os testes).
 */
export async function escolherArquivoSync(
  modo: "novo" | "existente",
  nomeSugerido: string,
  descricao: string,
  janela: unknown = globalThis,
  viaJanela: typeof escolherPelaJanelaDaExtensao | null = escolherPelaJanelaDaExtensao,
): Promise<HandleArquivo | null> {
  const tipos = [{ description: descricao, accept: { "application/json": [".json"] } }];
  const w = janela as {
    showSaveFilePicker(o: unknown): Promise<HandleArquivo>;
    showOpenFilePicker(o: unknown): Promise<HandleArquivo[]>;
  };
  try {
    if (modo === "novo") return await w.showSaveFilePicker({ suggestedName: nomeSugerido, types: tipos });
    return (await w.showOpenFilePicker({ types: tipos, multiple: false }))[0] ?? null;
  } catch (e) {
    if ((e as { name?: string }).name === "AbortError") return null;
    if (viaJanela && seletorBarradoNoIframe(e)) return await viaJanela(modo, nomeSugerido, descricao);
    throw e;
  }
}
