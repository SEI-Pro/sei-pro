import { CHAVE_TEMA, type ConfigTema, esquemaResolvido, normalizarConfig } from "./config";
import { derivarBarra, FUNDOS } from "./paleta";
import { superficiesDoFundo } from "./tokens";

/**
 * Tema nos painéis que são páginas da extensão (iframe embutido no Controle, painel lateral,
 * Histórico): eles não estão no documento do SEI, então leem a configuração `spro_tema`
 * sozinhos e acompanham mudanças (opções, sistema). Com o Estilo Avançado desligado não
 * mexem em nada: vale o que o contexto da aba já disse (modo noturno antigo, cor da barra).
 */
export interface DepsTemaPainel {
  ler: () => Promise<unknown>;
  /** Assina mudanças da configuração; devolve o desligador. */
  aoMudar: (cb: (valor: unknown) => void) => () => void;
  sistemaEscuro: () => boolean;
  /** Assina mudanças do tema do sistema; devolve o desligador. */
  aoMudarSistema: (cb: () => void) => () => void;
}

/**
 * SEI Pro Lab: além do destaque, as superfícies e os textos acompanham o tom de fundo escolhido no Estilo
 * Avançado. Com o tom padrão nada disso é posto (o painel fica exatamente como antes).
 */
const SUPERFICIES_DO_TOM = [
  "--spro-fundo",
  "--spro-fundo-2",
  "--spro-fundo-3",
  "--spro-pagina",
  "--spro-borda",
  "--spro-borda-forte",
  "--spro-texto",
  "--spro-suave",
  "--spro-fraco",
] as const;
const PROPRIEDADES = ["--spro-destaque", "--spro-destaque-texto", ...SUPERFICIES_DO_TOM] as const;
const TEXTO_DO_DESTAQUE = { claro: "#ffffff", escuro: "#0a1526" } as const;

export interface OpcoesTemaPainel {
  /**
   * Chamado quando o Estilo Avançado é desligado com o painel aberto: o que valia antes não é mais
   * confiável (o contexto era o do estilo), então o painel pede o contexto atual à página.
   * Sem isto, o painel volta ao que tinha ao ligar o acompanhamento.
   */
  aoDesligar?: () => void | Promise<void>;
}

/** O tema que o contexto da aba descreve: claro/escuro do SEI e a cor da barra. */
export function aplicarTemaDoContexto(raiz: HTMLElement, ctx: { temaEscuro: boolean; corTema?: string | undefined }): void {
  raiz.dataset.tema = ctx.temaEscuro ? "escuro" : "claro";
  if (ctx.corTema) {
    raiz.style.setProperty("--spro-cor-sei", ctx.corTema);
    raiz.dataset.corSei = "";
  } else {
    raiz.style.removeProperty("--spro-cor-sei");
    delete raiz.dataset.corSei;
  }
}

export function acompanharTemaEstilo2(doc: Document, deps: DepsTemaPainel, opcoes: OpcoesTemaPainel = {}): () => void {
  const raiz = doc.documentElement;
  const original = {
    tema: raiz.dataset.tema,
    props: PROPRIEDADES.map((p) => raiz.style.getPropertyValue(p)),
  };
  let cfg: ConfigTema | null = null;
  let parado = false;
  let aplicadoAntes = false;

  const restaurar = () => {
    if (original.tema === undefined) delete raiz.dataset.tema;
    else raiz.dataset.tema = original.tema;
    PROPRIEDADES.forEach((p, i) => {
      if (original.props[i]) raiz.style.setProperty(p, original.props[i] as string);
      else raiz.style.removeProperty(p);
    });
  };

  const aplicar = () => {
    if (parado || !cfg) return;
    if (!cfg.ativo) {
      if (aplicadoAntes && opcoes.aoDesligar) {
        // Tira o que este módulo pôs e deixa a página dizer o que vale agora (ela atualiza o contexto na hora).
        for (const p of PROPRIEDADES) raiz.style.removeProperty(p);
        const refazer = opcoes.aoDesligar;
        setTimeout(() => {
          if (!parado) void Promise.resolve(refazer()).catch(() => {});
        }, 300);
      } else restaurar();
      aplicadoAntes = false;
      return;
    }
    aplicadoAntes = true;
    const esquema = esquemaResolvido(cfg, deps.sistemaEscuro());
    raiz.dataset.tema = esquema;
    const fundo = esquema === "escuro" ? cfg.fundoEscuro : cfg.fundoClaro;
    const comTom = !!fundo && fundo.toLowerCase() !== FUNDOS[esquema][0]!.cor;
    const sup = superficiesDoFundo(esquema, fundo);
    for (const p of SUPERFICIES_DO_TOM) {
      if (comTom && sup[p]) raiz.style.setProperty(p, sup[p]);
      else raiz.style.removeProperty(p);
    }
    raiz.style.setProperty("--spro-destaque", derivarBarra(cfg.corBarra, esquema, comTom ? sup["--spro-fundo"] : undefined).destaque);
    raiz.style.setProperty("--spro-destaque-texto", TEXTO_DO_DESTAQUE[esquema]);
  };

  const sair = [
    deps.aoMudar((v) => {
      cfg = normalizarConfig(v);
      aplicar();
    }),
    deps.aoMudarSistema(aplicar),
  ];
  void deps
    .ler()
    .then((v) => {
      cfg = normalizarConfig(v);
      aplicar();
    })
    .catch(() => {});

  return () => {
    parado = true;
    for (const f of sair) f();
    restaurar();
  };
}

/** As dependências reais (chrome.storage.sync e matchMedia) para as páginas da extensão. */
export function depsDoNavegador(chave: string): DepsTemaPainel {
  const consulta = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  return {
    ler: async () => (await chrome.storage.sync.get(chave))[chave],
    aoMudar: (cb) => {
      const f = (m: Record<string, chrome.storage.StorageChange>, area: string) => {
        if (area === "sync" && m[chave]) cb(m[chave].newValue);
      };
      chrome.storage.onChanged.addListener(f);
      return () => chrome.storage.onChanged.removeListener(f);
    },
    sistemaEscuro: () => consulta?.matches ?? false,
    aoMudarSistema: (cb) => {
      consulta?.addEventListener("change", cb);
      return () => consulta?.removeEventListener("change", cb);
    },
  };
}

/** Atalho para as páginas da extensão: acompanha o Estilo Avançado com as dependências reais. */
export function acompanharTemaDoPainel(doc: Document = document, opcoes: OpcoesTemaPainel = {}): () => void {
  return acompanharTemaEstilo2(doc, depsDoNavegador(CHAVE_TEMA), opcoes);
}
