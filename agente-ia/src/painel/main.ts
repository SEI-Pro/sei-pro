/**
 * Painel lateral do Agente de IA.
 *
 * Guarda a chave do OpenRouter em `chrome.storage.local` (só neste navegador,
 * nunca sincronizada, nunca no mundo da página do SEI) e a conversa em
 * `chrome.storage.session` (some ao fechar o navegador; acessível só a
 * páginas da extensão — content scripts não leem a área de sessão).
 *
 * Telas: só uma. A conversa é a tela; a configuração é um <dialog> modal por
 * cima dela (na primeira vez, sem como fechar antes de salvar a chave).
 */

import { Pseudonimos } from "@nucleo/privacidade/anonimizar";
import { Motor, type TelaAtual } from "../motor/motor";
import { promptSistema } from "../motor/prompt";
import { aceitaImagem, COMPATIVEIS, ehErroDeImagem, ENDERECO_OUTRO, ErroProvedor, atalhoDeEndereco, campoModeloEhSelect, conferirChave, criarProvedor, DOC_CHAVES, enderecoDoServico, listarModelos, MODELO_OUTRO, MODELO_PADRAO, normalizarUrl, SERVICOS, TEMPERATURA_PADRAO, type Ajustes, type Servico } from "../motor/provedor";
import { RegistroTools, type ServicoDeImagens } from "../motor/tools";
import type { DecisaoPlano, ImagemPronta, InterfaceMotor, Mensagem, PlanoPrevisto, Tarefa, Uso } from "../motor/tipos";
import { PontePainel } from "../ponte/cliente";
import { toolsMotor } from "../tools/motor";
import { atualizarOpcaoProjetos } from "../tools/projetos";
import { INSTRUCAO_FIGURAS_AUXILIAR, PROMPT_VISAO, TOOLS_FORA_DO_AUXILIAR } from "../tools/imagem";
import { prepararImagem } from "./imagem";
import { TOOLS_SEI } from "../tools/sei";
import { duracao, formatarUso, h, icone, markdown, moeda } from "./dom";
import * as historico from "./historico";
import { cotacaoDolar, type Cotacao } from "./cambio";
import { ContadorDeUso, modeloDeVisao, modelosCurtos } from "./uso";
import { sugestoesPara } from "./sugestoes";
import { inversaDe, motivoSemDesfazer, type AcaoFeita, type ResultadoDeEscrita } from "./desfazer";
import { avaliarRegras, guardarRegras, listarRegras, recadoDoBloqueio, REGRAS_SUGERIDAS, type Regra } from "./regras";
import { CHAVE_CONFIG, configPadrao } from "./config";
import { cabeMaisUma, gastoDeHoje, somarGastoDoDia, type Limites } from "./gasto";
import { anotar, blocoDeMemoria, guardarMemoria, listarMemoria, MAX_TEXTO, type Lembranca } from "./memoria";
import {
  alarmesDe,
  avaliarPassos,
  descreverAlcance,
  estourouTeto,
  descreverFrequencia,
  guardarRotinas,
  listarRotinas,
  NOME_ALARME,
  registrarExecucao,
  textoDoAviso,
  vencidas,
  type Execucao,
  type Rotina,
} from "./rotinas";
import { guardarConectores, listarConectores, type Conector } from "../mcp/conectores";
import { linhasDeConectores, toolsMcp } from "../mcp/tools";
import { retestarLocais } from "../mcp/verificacao";
import { cartaoExterno, cartaoTransferencia, secaoConectores } from "./mcp-ui";
import { rodapeDaResposta } from "./resposta-ui";
import { apagarBaixados, listarBaixados, pedirPermissaoDeDownloads, registrarBaixado, salvarNoDisco, secaoBaixados, temPermissaoDeDownloads, type Baixado } from "./baixados";
import { toolsBaixar } from "../tools/baixar";
import { textoDaIntegridade, varrer } from "../seguranca/injecao";
import { montarDiagnostico, type Diagnostico } from "./diagnostico";
import { cartaoDeErro } from "./erro-ui";
import { envelopar } from "../seguranca/envelope";
import { secaoRotinas } from "./rotinas-ui";
import { secaoArquivo, type OpcoesArquivoUi } from "./arquivo-ui";
import { aplicarModo, mensagemDeErroPdf, type Anexo } from "./anexo";
import { andamentoDoAnexo, chipDoAnexo, confirmarOcrLongo } from "./anexo-ui";
import { lerPdfParaAnexo } from "./pdf";
import { ControleArquivo, escolherArquivoSync, handlesNoIndexedDB, temSeletorDeArquivo } from "@comum/sincronia/arquivo";
import { areaChrome } from "@comum/armazenamento/area";
import { adaptadorAgente, type AdaptadorAgente } from "../arquivo/adaptador";
import type { EnvelopeAgente } from "../arquivo/envelope";
import { CHAVE_SEGREDOS, CHAVE_STATUS, fontesDoNavegador, type Mudancas } from "../arquivo/retrato";
import { criarFila, deveAgendar, exportarBackup, fontesQueAvisam, importarBackup, NOME_DO_BACKUP, travarAdaptador } from "../arquivo/gatilho";
import { espelharListas, lerListasDoLocal, trazerDoSync } from "./sincronia-listas";
import { mudouParaOMotor, recarregarIntocados, type CampoDaConfig } from "./campos-config";
import { aoAvisar, aplicarConfigDoSync, CHAVE_MIGRADO, espelharConfig } from "./espelho";
import {
  baixarColecao,
  baixarSkillSeMudou,
  comSkills,
  descricaoDoTexto,
  guardarColecoes,
  guardarSkills,
  listarColecoes,
  listarSkills,
  LIMITE_SKILL,
  mesclarColecao,
  partesDoGitHub,
  sincronizarSkills,
  skillsCitadas,
  slugLivre,
  type ColecaoSkills,
  type SkillUsuario,
} from "./skills";
import { extrairTextoPdf } from "./pdf";
import { detalhesDaSugestao, textoDaSugestao } from "../fluxos/cartao";
import { CHAVE_FLUXOS, comIgnorada, guardarFluxos, guardarIgnorados, listarFluxos, listarIgnorados, type Fluxo, type Ignorados } from "../fluxos/modelo";
// `import type`: o esbuild descarta, e o bundle do painel nao ganha o sei-nucleo.
import type { RespostaFluxo, SugestaoDeFluxo } from "../ponte/operacoes";

export interface Config {
  /** Mostrar o gasto em reais, pela cotação do dia. */
  reais: boolean;
  /** Guardar a transcrição das conversas neste navegador. */
  guardar: boolean;
  /** Dias de guarda (0 = para sempre). */
  dias: number;
  /** `openrouter` (padrão), um fabricante conhecido ou um serviço compatível. */
  servico: Servico;
  /** Endereço do serviço compatível (vazio quando o serviço tem endereço fixo). */
  url: string;
  chave: string;
  modelo: string;
  nomes: boolean;
  cnpj: boolean;
  /** Controle fino do modelo; em branco = padrão do serviço. */
  ajustes: Ajustes;
  /** Instruções do usuário anexadas ao fim do prompt do agente. */
  instrucoes: string;
  /** Teto de gasto, em reais (0 = sem limite). */
  limites: Limites;
  /** Marcar o trecho estável do pedido para o cache do provedor. */
  cache: boolean;
  /** Deixar o agente anotar o que aprende sobre a unidade. */
  memoria: boolean;
  /** Modelo das tarefas auxiliares (vazio = o mesmo da conversa). */
  modeloAuxiliar: string;
}

type Item =
  /** `ms` (só na resposta do agente): quanto a rodada inteira demorou, do envio à resposta pronta. */
  | { tipo: "usuario" | "agente" | "aviso" | "decisao"; texto: string; ms?: number }
  /** `diagnostico`: o log de auditoria que o botão de copiar leva junto. */
  | { tipo: "erro"; texto: string; ms?: number; diagnostico?: Diagnostico }
  /** `nome`: o nome técnico da ferramenta. O `rotulo` não serve ao diagnóstico — ele traz número de processo. */
  | { tipo: "tool"; rotulo: string; nome?: string; estado: "rodando" | "ok" | "falha"; detalhe?: string; acao?: string; desfeita?: boolean };

type ItemAgente = { tipo: "agente"; texto: string; ms?: number };

const CHAVE_SESSAO = "agenteIA_conversa";

const PRIVACIDADE_CURTA =
  "Dados pessoais s\u00E3o mascarados antes de sair do navegador. Documentos restritos s\u00F3 com a sua autoriza\u00E7\u00E3o, sigilosos nunca, e toda altera\u00E7\u00E3o no SEI passa pela sua aprova\u00E7\u00E3o.";

const PRIVACIDADE =
  "Antes de qualquer texto sair do navegador, CPF, e-mail, telefone, endere\u00E7o, conta banc\u00E1ria, CID e outros dados pessoais s\u00E3o trocados por r\u00F3tulos como [CPF_1]. Documentos restritos s\u00F3 s\u00E3o lidos com a sua autoriza\u00E7\u00E3o; processos sigilosos nunca. Toda altera\u00E7\u00E3o no SEI precisa da sua aprova\u00E7\u00E3o.";

const RESPONSABILIDADE =
  "As respostas da IA podem conter erros, inclusive com apar\u00EAncia de certeza: confira antes de usar. O conte\u00FAdo de um documento assinado \u00E9 de responsabilidade do agente p\u00FAblico que o assina.";

/**
 * Verbos do indicador de "pensando". Todos falam de LER e RACIOCINAR: nenhum
 * pode parecer uma ação de escrita no SEI ("assinando", "tramitando"), que
 * faria o usuário achar que o agente está mexendo no processo sem ter pedido.
 */
const PENSANDO = [
  "Pensando", "Cogitando", "Ponderando", "Refletindo", "Raciocinando", "Matutando",
  "Ruminando", "Compulsando", "Folheando", "Cotejando", "Conferindo", "Catalogando",
  "Alinhavando", "Arrazoando", "Esmiu\u00E7ando", "Destrinchando", "Decifrando", "Interpretando",
  "Sistematizando", "Fundamentando", "Considerando", "Analisando", "Rascunhando", "Minutando",
  "Burilando", "Lapidando", "Deduzindo", "Concatenando", "Elucubrando", "Garimpando",
];


/** Marca do agente: o robô do SEI Pro, o mesmo ícone que abre o painel no SEI. */
const marca = (tamanho: number) =>
  h("img", { class: "logo", src: chrome.runtime.getURL("icons/menu/botpro_icon.svg"), alt: "", width: String(tamanho), height: String(tamanho) });

/** Tempo da rodada, no rodapé da resposta. */
function carimboDeTempo(ms: number): HTMLElement {
  return h("span", { class: "tempo-resposta", title: "Tempo entre o seu pedido e a resposta pronta" }, duracao(ms));
}


/** A pasta da equipe é conferida com menos frequência: a API do GitHub limita por hora. */
const INTERVALO_COLECAO = 12 * 60 * 60 * 1000;

/** "agora", "há 3 h", "ontem": quando a skill foi conferida pela última vez. */
function quando(ms?: number): string {
  if (!ms) return "ainda n\u00E3o conferida";
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 2) return "conferida agora";
  if (min < 60) return `conferida h\u00E1 ${min} min`;
  const horas = Math.round(min / 60);
  if (horas < 24) return `conferida h\u00E1 ${horas} h`;
  return `conferida em ${new Date(ms).toLocaleDateString("pt-BR")}`;
}

/** Texto do serviço + link do painel do fabricante + link do passo a passo. */
function ajudaDoServico(svc: Servico): Node[] {
  const info = SERVICOS[svc];
  const fora = (texto: string, url: string) => h("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, texto);
  const partes: Node[] = [document.createTextNode(info.ajuda)];
  if (info.painelChave) partes.push(document.createTextNode(" Crie a chave em "), fora(info.painelChave.texto, info.painelChave.url), document.createTextNode("."));
  partes.push(
    document.createTextNode(" "),
    fora("Como obter a chave, passo a passo", info.ancoraDoc ? `${DOC_CHAVES}#${info.ancoraDoc}` : DOC_CHAVES),
    document.createTextNode("."),
  );
  return partes;
}

class App {
  private readonly raiz = document.getElementById("app")!;
  private readonly ponte = new PontePainel();
  private config: Config = configPadrao();
  private privacidade = new Pseudonimos();
  private motor: Motor | null = null;
  private transcricao: Item[] = [];
  /** Gasto da conversa, somado de todos os motores que trabalharam nela (ver `uso.ts`). */
  private contador = new ContadorDeUso();
  private get uso(): Uso {
    return this.contador.total;
  }
  private tarefas: Tarefa[] = [];
  private anexo: Anexo | null = null;
  /** Geração da leitura de anexo em curso: trocar ou remover o anexo invalida a anterior. */
  private geracaoAnexo = 0;
  /** Há um PDF sendo lido (o envio espera). */
  private lendoAnexo = false;
  private idConversa = crypto.randomUUID();
  /** Skills do usuário (configurações), disponíveis por `/slug` e por `skill_ler`. */
  private skills: SkillUsuario[] = [];

  /** Pastas do GitHub que trazem as skills da equipe. */
  private colecoes: ColecaoSkills[] = [];

  /** O que esta conversa escreveu no SEI, para o botão de desfazer. */
  private feitos = new Map<string, AcaoFeita>();

  /** Regras da unidade: o que o agente não pode fazer, e o que exige atenção. */
  private regras: Regra[] = [];

  /** O que o agente aprendeu sobre a unidade, e leva para as próximas conversas. */
  private memoria: Lembranca[] = [];

  /** Perguntas que o agente faz sozinho de tempos em tempos. */
  private rotinas: Rotina[] = [];

  /**
   * Documentos desta conversa que traziam conteúdo suspeito.
   *
   * Alimenta o relatório de integridade e, principalmente, o aviso no cartão
   * de aprovação: aprovar uma alteração proposta depois de ler um documento
   * adulterado é uma decisão que precisa ser tomada sabendo disso.
   */
  private integridadeDaConversa: Array<{ documento: string; achados: Array<{ classe: string; trecho: string; motivo?: string }> }> = [];

  /** O aviso da cota de sincronização aparece uma vez por sessão. */
  private avisouDaCota = false;

  /**
   * Trava de reentrância da sincronização.
   *
   * `aplicarSincronizacao` grava no `local`, o que faz cada `guardarX`
   * espelhar, e o espelho dispara o `onChanged` da área `sync` — que chamaria
   * `aplicarSincronizacao` outra vez. O `espelhar` só grava o que mudou, então
   * a cadeia morreria na segunda volta; esta trava a corta na primeira.
   */
  private sincronizando = false;

  /** Redesenhos da configuração aberta, para o que vem do sync aparecer na hora. */
  private redesenharConfig: Array<() => void> = [];
  /** Redesenho da seção "Backup em arquivo", enquanto a configuração está aberta. */
  private redesenharArquivo: (() => void) | null = null;
  /** Os campos do diálogo aberto que o usuário não mexeu acompanham a config que mudou fora dele. */
  private recarregarCamposConfig: (() => void) | null = null;
  /** A config mudou fora do diálogo com o motor ocupado: refazer antes do próximo pedido. */
  private motorDesatualizado = false;

  /** Backup em arquivo: o adaptador (Exportar/Importar valem em todo navegador). */
  private adaptadorArquivo: AdaptadorAgente | null = null;
  /** O arquivo sincronizado: só onde há seletor de arquivo (Chrome/Edge). */
  private controleArquivo: ControleArquivo<EnvelopeAgente> | null = null;

  /**
   * Trava comum da sincronia do `storage.sync` e da mescla do arquivo: as duas
   * leem as listas e as regravam, e a do sync parte da memória do painel.
   * Rodando juntas, uma regravaria a lista velha por cima da outra.
   */
  private travaLocal = criarFila();
  /** Uma sincronização do arquivo (ou Exportar/Importar) de cada vez. */
  private filaArquivo = criarFila();
  private esperaArquivo: ReturnType<typeof setTimeout> | undefined;
  /** O foco volta muitas vezes seguidas: no máximo uma leitura a cada 30 s por ele. */
  private ultimoFoco = 0;

  /**
   * Liga o backup em arquivo. Depois de a mescla gravar no local (ainda na
   * trava), o painel relê as listas, espera o espelho no `sync` e espelha a
   * configuração: quando a sincronia do sync rodar, encontra tudo em dia.
   */
  private ligarArquivo(): void {
    const fontes = fontesQueAvisam(fontesDoNavegador(), (m) => this.depoisDoArquivo(m).catch(() => undefined));
    this.adaptadorArquivo = travarAdaptador(adaptadorAgente(fontes), this.travaLocal);
    if (!temSeletorDeArquivo(window)) return;
    this.controleArquivo = new ControleArquivo<EnvelopeAgente>({
      area: areaChrome(chrome.storage.local, "local"),
      dono: { host: "agente", login: "" },
      chaveStatus: CHAVE_STATUS,
      // Banco próprio: o `agenteIA` já tem a versão 1 com outras lojas.
      handles: handlesNoIndexedDB("agenteIA_arquivo"),
      escolher: (m) => escolherArquivoSync(m, NOME_DO_BACKUP, "Agente do SEI Pro"),
      adaptador: this.adaptadorArquivo,
    });
  }

  /** Na fila do arquivo; o que falhar não derruba o painel (a sincronia já vira `StatusArquivo`). */
  private naFilaDoArquivo<T>(tarefa: () => Promise<T>): Promise<T> {
    return this.filaArquivo(tarefa);
  }

  /** Grava o arquivo daqui a 15 s, juntando as mudanças seguidas (pela fila, como as outras). */
  private agendarArquivo(): void {
    if (!this.controleArquivo) return;
    clearTimeout(this.esperaArquivo);
    this.esperaArquivo = setTimeout(() => void this.sincronizarArquivo(), 15_000);
  }

  /** Sincroniza agora (na fila); falha vira `StatusArquivo`, e o que sobrar não derruba o painel. */
  private sincronizarArquivo(pedir = false): Promise<unknown> {
    const controle = this.controleArquivo;
    if (!controle) return Promise.resolve();
    return this.naFilaDoArquivo(() => controle.sincronizar(pedir)).catch(() => undefined);
  }

  /** O que a mescla do arquivo gravou no local passa à memória do painel e ao `sync`. */
  private async depoisDoArquivo(m: Mudancas): Promise<void> {
    if (m.config) {
      const salvo = (await chrome.storage.local.get(CHAVE_CONFIG))[CHAVE_CONFIG] as Partial<Config> | undefined;
      const antes = this.config;
      this.config = { ...this.config, ...salvo };
      // A configuração do arquivo não passa por `aplicarConfig`: sem isto o
      // `sync` (velho) ganharia de volta na próxima sincronia.
      await espelharConfig(this.config);
      this.configMudouDeFora(antes);
    }
    ({ skills: this.skills, colecoes: this.colecoes, regras: this.regras, memoria: this.memoria, rotinas: this.rotinas, conectores: this.conectores, fluxos: this.fluxos } =
      await lerListasDoLocal());
    this.fluxosIgnorados = await listarIgnorados();
    await espelharListas({ skills: this.skills, colecoes: this.colecoes, regras: this.regras, memoria: this.memoria, rotinas: this.rotinas, conectores: this.conectores, fluxos: this.fluxos });
    for (const redesenhar of this.redesenharConfig) redesenhar();
  }

  /**
   * A config mudou fora do diálogo (o arquivo, outra janela): os campos do
   * diálogo aberto que o usuário não mexeu passam a mostrar a nova — senão o
   * "Salvar" gravaria a velha por cima —, e o motor é refeito como em
   * `aplicarConfig` (mantendo a conversa e os pseudônimos), mas só se mudou
   * algo que ele lê, e nunca no meio de um pedido.
   */
  private configMudouDeFora(antes: Config): void {
    this.recarregarCamposConfig?.();
    if (!this.motor || !mudouParaOMotor(antes, this.config)) return;
    if (this.motor.ocupado || this.rotinaEmCurso) this.motorDesatualizado = true;
    else this.refazerMotor();
  }

  /** Backup em arquivo: o que a seção da configuração chama. */
  private opcoesArquivoUi(): OpcoesArquivoUi | null {
    const adaptador = this.adaptadorArquivo;
    if (!adaptador) return null;
    const controle = this.controleArquivo;
    return {
      temSeletor: Boolean(controle),
      configurado: async () => (controle ? controle.configurado() : false),
      status: async () => (controle ? controle.status() : null),
      // Escolher, reconectar e "agora" pedem o seletor ou a permissão, que só
      // valem logo depois do clique: não esperam na fila atrás de uma
      // sincronização lenta. A mescla do local continua na `travaLocal`.
      escolher: async (m) => void (await controle?.escolher(m)),
      reconectar: async () => void (await controle?.reconectar()),
      agora: async () => void (await controle?.sincronizar(true)),
      esquecer: async () => {
        clearTimeout(this.esperaArquivo);
        if (controle) await this.naFilaDoArquivo(() => controle.esquecer());
      },
      segredos: {
        ler: async () => (await chrome.storage.local.get(CHAVE_SEGREDOS))[CHAVE_SEGREDOS] === true,
        gravar: async (v) => {
          await chrome.storage.local.set({ [CHAVE_SEGREDOS]: v });
          // A caixa não agenda pelo `onChanged` (é da própria sincronia): grava já.
          await this.sincronizarArquivo();
        },
      },
      removerSegredos: async () => {
        if (!controle) return;
        adaptador.removerSegredosNaProxima();
        await this.sincronizarArquivo();
      },
      exportar: async () => {
        // O mesmo envelope da sincronia (diário carimbado, caixa dos segredos
        // daqui), sem consumir o "remover segredos" pendente.
        const url = URL.createObjectURL(new Blob([await this.naFilaDoArquivo(() => exportarBackup(adaptador))], { type: "application/json" }));
        const a = h("a", { href: url, download: NOME_DO_BACKUP });
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      },
      // A mescla grava no local; as fontes recarregam o painel e o `onChanged` agenda o arquivo.
      importar: async (arquivo) => {
        const texto = await arquivo.text();
        return this.naFilaDoArquivo(() => importarBackup(texto, adaptador));
      },
    };
  }

  /** Servidores MCP que o usuário ligou (ver `mcp/conectores.ts`). */
  private conectores: Conector[] = [];

  /**
   * Rotina sendo executada agora.
   *
   * É o que permite à rotina autônoma aprovar o próprio plano sem um segundo
   * motor: `aprovarPlano` consulta isto e decide por `avaliarPassos` em vez
   * de abrir o cartão. Fora de rotina, vale `null` e tudo segue como sempre.
   */
  private rotinaEmCurso: { rotina: Rotina; escritas: string[] } | null = null;

  /**
   * Vigia do teto de gasto da rotina em curso.
   *
   * O teto é por execução, e o custo só se conhece rodada a rodada: a conta é
   * feita a cada atualização de uso e, se estourar, a rodada é interrompida no
   * meio em vez de seguir gastando sem ninguém olhando.
   */
  private tetoDaRotina: { rotina: Rotina; base: number; parar: AbortController; avisado: boolean } | null = null;

  /** Fluxos mapeados no Estúdio de Fluxo, e o que o usuário mandou não sugerir. */
  private fluxos: Fluxo[] = [];
  private fluxosIgnorados: Ignorados = {};
  private sugestaoDeFluxo: SugestaoDeFluxo | null = null;

  /** Tela do SEI ao lado, para as sugestões combinarem com o que o usuário vê. */
  private tela: TelaAtual | null = null;
  private chaveTela = "";
  /** Cotação do dólar para o medidor; `null` enquanto não chega (ou sem rede). */
  private cambio: Cotacao | null = null;
  /** Conversa antiga aberta para leitura (sem como continuar: ver `historico.ts`). */
  private arquivada: historico.ConversaSalva | null = null;

  // elementos da tela
  private elConversa!: HTMLElement;
  private elAba!: HTMLElement;
  private elCusto!: HTMLElement;
  private elTarefas!: HTMLElement;
  private elFluxo!: HTMLElement;
  private elEntrada!: HTMLTextAreaElement;
  private elEnviar!: HTMLButtonElement;
  private elAnexo!: HTMLElement;
  private elMenu!: HTMLElement;
  private elPensando!: HTMLElement;
  private tickPensando: ReturnType<typeof setInterval> | null = null;
  private bolhaAtual: { el: HTMLElement; texto: string; pendente: boolean; fechada?: boolean } | null = null;
  /** Última resposta fechada da rodada: recebe o carimbo de tempo no fim. */
  private ultimaResposta: { el: HTMLElement; item: ItemAgente } | null = null;
  /** Cópias de documentos do SEI que o agente gravou em Downloads (ver `baixados.ts`). */
  private baixados: Baixado[] = [];
  private aoFimDoPlano: (() => void) | null = null;
  private toolsEl = new Map<string, { el: HTMLElement; item: Extract<Item, { tipo: "tool" }> }>();

  async iniciar(): Promise<void> {
    await this.ponte.iniciar();
    const salvo = (await chrome.storage.local.get(CHAVE_CONFIG))[CHAVE_CONFIG] as Partial<Config> | undefined;
    this.config = { ...this.config, ...salvo };
    this.skills = await listarSkills();
    this.colecoes = await listarColecoes();
    this.regras = await listarRegras();
    this.memoria = await listarMemoria();
    this.rotinas = await listarRotinas();
    this.conectores = await listarConectores();
    this.baixados = await listarBaixados();
    this.fluxos = await listarFluxos();
    this.fluxosIgnorados = await listarIgnorados();
    await this.aplicarSincronizacao();
    this.ligarArquivo();
    void this.sincronizarSkills();
    void this.sincronizarColecoes();
    void this.retestarConectoresLocais();
    this.ponte.aoMudar(() => this.atualizarAba());
    // O Estúdio de Fluxo é outra página: quando o usuário salva um fluxo lá, o
    // painel precisa passar a usá-lo sem esperar um recarregamento.
    chrome.storage.onChanged.addListener((mud, area) => {
      if (area === "local") {
        // Mudou algo do agente que vai ao arquivo: grava daqui a pouco. As
        // chaves da própria sincronia (status, diário, caixa) não agendam.
        if (deveAgendar(Object.keys(mud))) this.agendarArquivo();
        if (mud[CHAVE_STATUS]) this.redesenharArquivo?.();
        const cfg = mud[CHAVE_CONFIG]?.newValue as Partial<Config> | undefined;
        if (cfg && JSON.stringify({ ...this.config, ...cfg }) !== JSON.stringify(this.config)) {
          // A configuração mudou fora deste painel (o arquivo a trouxe, ou outra janela).
          const antes = this.config;
          this.config = { ...this.config, ...cfg };
          this.configMudouDeFora(antes);
          for (const redesenhar of this.redesenharConfig) redesenhar();
        }
      }
      if (area === "local" && mud[CHAVE_FLUXOS]) {
        this.fluxos = (mud[CHAVE_FLUXOS].newValue as Fluxo[]) ?? [];
        void this.avaliarFluxos();
        return;
      }
      // Outro computador mudou a configuração: traz para cá sem recarregar.
      // O `espelhar` deste navegador também dispara isto; `aplicarDoSync` é
      // idempotente, então o pior caso é uma leitura a mais.
      if (area === "sync" && Object.keys(mud).some((k) => k.startsWith("spro_"))) void this.aplicarSincronizacao();
    });
    await this.telaConversa();
    void this.atualizarCambio();
    void historico
      .podar(this.config.dias)
      .then(() => this.agendarArquivo())
      .catch(() => undefined);
    // O arquivo pode ter mudado em outro computador: lê ao abrir e quando o painel volta ao foco.
    void this.sincronizarArquivo();
    window.addEventListener("focus", () => {
      if (Date.now() - this.ultimoFoco < 30_000) return;
      this.ultimoFoco = Date.now();
      void this.sincronizarArquivo();
    });
    if (!this.config.chave) this.abrirConfig(true);
  }

  // ------------------------------------------------------------- tela

  private async telaConversa(): Promise<void> {
    this.motor ??= this.criarMotor();
    this.elAba = h("span", { class: "aba" });
    this.elCusto = h("span", { class: "custo", title: "Gasto desta conversa (o servi\u00E7o de IA informa o custo; sem isso, os tokens)" });
    this.elTarefas = h("div", { class: "tarefas", hidden: true });
    this.elFluxo = h("div", { class: "aviso-fluxo", hidden: true });
    this.elConversa = h("div", { class: "conversa", role: "log", "aria-live": "polite" });
    this.elEntrada = h("textarea", { rows: "2", placeholder: "Pe\u00E7a algo sobre o SEI...", "aria-label": "Mensagem" });
    this.elEnviar = h("button", { class: "enviar" });
    this.elAnexo = h("div", { class: "anexo-area", hidden: true });
    this.elMenu = h("div", { class: "menu", role: "menu", hidden: true });
    this.elPensando = h("div", { class: "pensando", role: "status" }, icone("estrela", 16), h("span", { class: "palavra" }), h("span", { class: "tempo" }));

    const arquivo = h("input", { type: "file", accept: ".pdf,.csv,.txt,.md,.json,.tsv", class: "sr-only" });
    const anexar = h("button", { class: "icone", title: "Anexar PDF, planilha CSV ou texto", "aria-label": "Anexar arquivo" }, icone("clipe"));
    const sugerir = h("button", { class: "icone", title: "Sugest\u00F5es de pedido", "aria-label": "Sugest\u00F5es de pedido" }, icone("lampada"));

    anexar.addEventListener("click", () => arquivo.click());
    arquivo.addEventListener("change", async () => {
      const f = arquivo.files?.[0];
      arquivo.value = "";
      if (!f) return;
      const geracao = ++this.geracaoAnexo;
      this.anexo = null;
      const bytes = new Uint8Array(await f.arrayBuffer());
      if (/\.pdf$/i.test(f.name) || f.type === "application/pdf") {
        // O PDF é lido aqui, neste computador: ao serviço de IA vai só o texto.
        const andamento = andamentoDoAnexo(f.name, () => this.removerAnexo());
        this.elAnexo.hidden = false;
        this.elAnexo.replaceChildren(andamento.elemento);
        this.lendoAnexo = true;
        try {
          const lido = await lerPdfParaAnexo(bytes, {
            aoProgredir: (e) => geracao === this.geracaoAnexo && andamento.atualizar(e),
            cancelado: () => geracao !== this.geracaoAnexo,
            confirmarOcr: (p) => confirmarOcrLongo((op) => this.abrirModal(op), p),
          });
          if (geracao !== this.geracaoAnexo) return;
          this.mostrarAnexo({ nome: f.name, texto: lido.texto, paginas: lido.paginas, modo: "inteiro", naoLidas: lido.naoLidas, motivoNaoLidas: lido.motivoNaoLidas });
        } catch (e) {
          if (geracao !== this.geracaoAnexo) return;
          this.removerAnexo();
          if ((e as { name?: string } | null)?.name !== "OperacaoCancelada") this.adicionar({ tipo: "aviso", texto: mensagemDeErroPdf(e) });
        } finally {
          if (geracao === this.geracaoAnexo) this.lendoAnexo = false;
        }
        return;
      }
      let texto: string;
      try {
        texto = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      } catch {
        texto = new TextDecoder("windows-1252").decode(bytes); // CSV do Excel
      }
      this.mostrarAnexo({ nome: f.name, texto, modo: "inteiro" });
    });

    sugerir.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (this.elMenu.hidden || this.elMenu.dataset.tipo === "skills") {
        this.elMenu.dataset.tipo = "sugestoes";
        this.elMenu.replaceChildren(
          ...sugestoesPara(this.tela, 8).map((a) => h("button", { role: "menuitem", onclick: () => ((this.elMenu.hidden = true), void this.enviar(a.prompt)) }, a.rotulo)),
        );
      }
      this.elMenu.hidden = this.elMenu.dataset.tipo === "sugestoes" ? !this.elMenu.hidden : false;
    });
    document.addEventListener("click", () => (this.elMenu.hidden = true));
    document.addEventListener("keydown", (ev) => ev.key === "Escape" && (this.elMenu.hidden = true));

    this.elEntrada.addEventListener("keydown", (ev) => {
      // Com a lista de skills aberta, as setas e o Enter são dela.
      const itens = this.elMenu.hidden ? [] : [...this.elMenu.querySelectorAll<HTMLButtonElement>("button")];
      if (itens.length && ["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(ev.key)) {
        const atual = itens.findIndex((b) => b.classList.contains("focado"));
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          ev.preventDefault();
          const proximo = (atual + (ev.key === "ArrowDown" ? 1 : itens.length - 1) + itens.length) % itens.length;
          itens.forEach((b, i) => b.classList.toggle("focado", i === proximo));
          return;
        }
        ev.preventDefault();
        (itens[Math.max(0, atual)] ?? itens[0]).click();
        return;
      }
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        this.elEnviar.click();
      }
    });
    this.elEntrada.addEventListener("input", () => {
      this.elEntrada.style.height = "auto";
      this.elEntrada.style.height = `${Math.min(this.elEntrada.scrollHeight, 180)}px`;
      this.estadoEnvio();
      this.menuDeSkills();
    });
    this.elEnviar.addEventListener("click", () => {
      if (this.motor?.ocupado) this.motor.parar();
      else void this.enviar(this.elEntrada.value);
    });

    this.raiz.replaceChildren(
      h(
        "header",
        { class: "topo" },
        marca(28),
        h("span", { class: "marca" }, h("strong", {}, "Agente de IA"), h("span", {}, "SEI Pro")),
        this.elCusto,
        h("button", { class: "icone", title: "Conversas guardadas", "aria-label": "Conversas guardadas", onclick: () => void this.abrirHistorico() }, icone("relogio")),
        h("button", { class: "icone", title: "Nova conversa", "aria-label": "Nova conversa", onclick: () => void this.novaConversa() }, icone("mais")),
        h("button", { class: "icone", title: "Configura\u00E7\u00E3o", "aria-label": "Configura\u00E7\u00E3o", onclick: () => this.abrirConfig() }, icone("ajustes")),
      ),
      h(
        "div",
        { class: "barra" },
        this.elAba,
        h("span", { class: "selo-privacidade", title: PRIVACIDADE }, icone("escudo", 13), "protegido"),
      ),
      this.elTarefas,
      this.elFluxo,
      this.elConversa,
      h(
        "div",
        { class: "rodape" },
        this.elMenu,
        this.elAnexo,
        h(
          "div",
          { class: "caixa" },
          this.elEntrada,
          h("div", { class: "caixa-acoes" }, anexar, arquivo, sugerir, h("span", { class: "espaco" }, "Enter envia"), this.elEnviar),
        ),
        h("div", { class: "aviso-ia", title: RESPONSABILIDADE }, "A IA pode errar: confira as respostas antes de usar."),
      ),
    );
    await this.restaurarSessao();
    this.atualizarAba();
    void this.rodarRotinas();
    void this.sincronizarAlarmes();
    // Com o painel aberto, quem confere os vencimentos é esta varredura: o
    // alarme do navegador acorda o service worker, não esta página.
    setInterval(() => void this.rodarRotinas(), 5 * 60 * 1000);
    // O background avisa quando um alarme vence; executar é sempre aqui.
    try {
      const porta = chrome.runtime.connect({ name: "agente-vivo" });
      porta.onMessage.addListener((m: { tipo?: string }) => {
        if (m?.tipo === "rodarRotinas") void this.rodarRotinas();
      });
    } catch {
      /* sem background (Firefox): a varredura periódica cobre */
    }
    this.redesenhar();
    this.elEntrada.focus();
  }

  /**
   * Lista de skills enquanto o usuário digita `/`.
   *
   * Mesmo menu das sugestões (o da lâmpada), aberto pelo que está sendo
   * escrito: `/desp` filtra pelo nome e pelo atalho. Escolher completa o texto.
   */
  private menuDeSkills(): void {
    const campo = this.elEntrada;
    const ate = campo.value.slice(0, campo.selectionStart ?? campo.value.length);
    const m = /(?:^|\s)\/([a-z0-9-]*)$/i.exec(ate);
    if (!m || !this.skills.length) {
      if (this.elMenu.dataset.tipo === "skills") this.elMenu.hidden = true;
      return;
    }
    const termo = m[1].toLowerCase();
    const achadas = this.skills.filter((sk) => !termo || sk.slug.includes(termo) || sk.nome.toLowerCase().includes(termo)).slice(0, 8);
    if (!achadas.length) {
      this.elMenu.hidden = true;
      return;
    }
    const inicio = (campo.selectionStart ?? 0) - m[1].length - 1;
    this.elMenu.dataset.tipo = "skills";
    this.elMenu.replaceChildren(
      ...achadas.map((sk, i) =>
        h(
          "button",
          {
            role: "menuitem",
            class: i === 0 ? "focado" : "",
            onclick: () => {
              const antes = campo.value.slice(0, inicio);
              const depois = campo.value.slice(campo.selectionStart ?? 0);
              campo.value = `${antes}/${sk.slug} ${depois}`;
              const cursor = antes.length + sk.slug.length + 2;
              campo.setSelectionRange(cursor, cursor);
              this.elMenu.hidden = true;
              campo.focus();
              this.estadoEnvio();
            },
          },
          h("code", {}, `/${sk.slug}`),
          h("span", {}, sk.nome),
        ),
      ),
    );
    this.elMenu.hidden = false;
  }

  /**
   * Indicador de trabalho em curso: fica no fim da conversa enquanto o modelo
   * pensa ou usa ferramentas, e sai quando a resposta começa a sair (ou quando
   * a vez é do usuário, num cartão de aprovação).
   */
  private pensar(ligado: boolean): void {
    if (!this.elPensando) return;
    if (!ligado) {
      if (this.tickPensando) clearInterval(this.tickPensando);
      this.tickPensando = null;
      this.elPensando.remove();
      return;
    }
    this.elConversa.append(this.elPensando); // sempre o último da conversa
    this.rolar();
    if (this.tickPensando) return;
    const palavra = this.elPensando.querySelector(".palavra")!;
    const tempo = this.elPensando.querySelector(".tempo")!;
    const sortear = () => (palavra.textContent = `${PENSANDO[Math.floor(Math.random() * PENSANDO.length)]}\u2026`);
    const desde = Date.now();
    sortear();
    tempo.textContent = "";
    this.tickPensando = setInterval(() => {
      const s = Math.round((Date.now() - desde) / 1000);
      tempo.textContent = `${s}s`;
      if (s % 4 === 0) sortear();
    }, 1000);
  }

  /**
   * Lê a tela do SEI ao lado quando ela muda (aba ou título diferentes) e, se a
   * conversa ainda não começou, redesenha as sugestões para combinarem com ela.
   */
  private async lerTelaDoSei(): Promise<void> {
    const aba = this.ponte.atual();
    const chave = aba ? `${aba.id}|${aba.contexto ?? aba.titulo}` : "";
    if (chave === this.chaveTela) return;
    this.chaveTela = chave;
    this.tela = aba ? ((await this.ponte.executar("tela", {}).catch(() => null)) as TelaAtual | null) : null;
    if (this.tela) this.tela.editores = this.ponte.editores();
    // A sugestão dos projetos depende da opção "Gerenciar Projetos": relida a cada tela (só no pacote com o módulo).
    await atualizarOpcaoProjetos();
    if (!this.transcricao.length && !this.arquivada) this.redesenhar();
    await this.avaliarFluxos();
  }

  // ------------------------------------------------------------- Estúdio de Fluxo

  /**
   * O processo da tela tem lacuna em algum fluxo mapeado?
   *
   * A conta é feita na aba do SEI, que busca a árvore COMPLETA do processo (com
   * as pastas abertas). Nem a mensagem sai quando não há processo na tela ou
   * quando a unidade não tem fluxo ligado: quem não usa o Estúdio não paga nada
   * por ele, e a árvore buscada fica 30 s em cache na aba.
   */
  private async avaliarFluxos(): Promise<void> {
    const processo = this.tela?.processo?.protocolo;
    const vale = Boolean(processo) && !this.tela?.sigiloso && this.fluxos.some((f) => f.ativo);
    // `tipo` vai de graça (a tela já o tem) e poupa a busca da árvore quando
    // nenhum fluxo ligado pode casar com um processo desse tipo.
    const r = vale
      ? ((await this.ponte
          .executar("fluxo.avaliar", { processo, tipo: this.tela?.processo?.tipo, fluxos: this.fluxos, ignorados: this.fluxosIgnorados, unidade: this.tela?.unidade })
          .catch(() => null)) as RespostaFluxo | null)
      : null;
    this.sugestaoDeFluxo = r?.sugestao ?? null;
    this.desenharSugestaoDeFluxo();
  }

  private desenharSugestaoDeFluxo(): void {
    if (!this.elFluxo) return;
    const s = this.sugestaoDeFluxo;
    const fluxo = s ? this.fluxos.find((f) => f.id === s.fluxoId) : undefined;
    const etapa = fluxo?.etapas.find((e) => e.id === s!.etapaId);
    if (!s || !fluxo || !etapa) {
      this.elFluxo.hidden = true;
      this.elFluxo.replaceChildren();
      return;
    }
    const nomeDaEtapa = (id: string) => fluxo.etapas.find((e) => e.id === id)?.nome ?? id;
    const dados = {
      fluxo: fluxo.nome,
      etapa: etapa.nome,
      etapaAnterior: nomeDaEtapa(s.etapaAnteriorId),
      anterior: s.anterior,
      cumpridas: s.cumpridas.map((c) => ({ etapa: nomeDaEtapa(c.etapaId), numero: c.numero, titulo: c.titulo })),
    };

    const detalhes = h("ul", { class: "pendencias detalhes-fluxo", hidden: true }, ...detalhesDaSugestao(dados).map((l) => h("li", {}, l)));
    const fechar = (aviso?: string) => {
      this.sugestaoDeFluxo = null;
      this.elFluxo.hidden = true;
      this.elFluxo.replaceChildren();
      if (aviso) this.adicionar({ tipo: "aviso", texto: aviso });
    };

    const preparar = h(
      "button",
      {
        class: "primario",
        disabled: !etapa.acao,
        title: etapa.acao
          ? this.config.chave
            ? etapa.acao.titulo
            : "A minuta precisa do Agente de IA configurado: o clique abre a configuração."
          : `A etapa "${etapa.nome}" não tem pedido ao agente. Defina um no Estúdio de Fluxo para este botão funcionar.`,
        onclick: () => {
          const pedido = etapa.acao?.pedido;
          if (!pedido) return;
          fechar();
          void this.enviar(pedido);
        },
      },
      icone("faisca", 15),
      etapa.acao?.titulo ?? "Preparar",
    );

    this.elFluxo.hidden = false;
    this.elFluxo.replaceChildren(
      h(
        "div",
        { class: "cartao fluxo" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("fluxo", 15)), h("h4", {}, `Fluxo: ${fluxo.nome}`)),
        h("div", { class: "sub" }, textoDaSugestao(dados)),
        detalhes,
        h(
          "div",
          { class: "acoes" },
          preparar,
          h("button", { class: "plana", onclick: () => (detalhes.hidden = !detalhes.hidden) }, icone("olho", 15), "Ver detalhes"),
          h(
            "button",
            { class: "plana", title: `Não sugerir esta etapa em ${s.protocolo}`, onclick: () => void this.ignorarEtapa(s.protocolo, etapa.id) },
            icone("olhoCorte", 15),
            "Ignorar neste processo",
          ),
          h("button", { class: "plana", title: `Desligar o fluxo "${fluxo.nome}"`, onclick: () => void this.desligarFluxo(fluxo.id, fluxo.nome) }, icone("fechar", 15), "Não sugerir este fluxo"),
        ),
      ),
    );
  }

  private async ignorarEtapa(protocolo: string, etapaId: string): Promise<void> {
    this.fluxosIgnorados = comIgnorada(this.fluxosIgnorados, protocolo, etapaId);
    await guardarIgnorados(this.fluxosIgnorados);
    this.sugestaoDeFluxo = null;
    this.desenharSugestaoDeFluxo();
  }

  private async desligarFluxo(id: string, nome: string): Promise<void> {
    if (!confirm(`Desligar o fluxo "${nome}"? Ele para de sugerir em todos os processos. Dá para ligar de novo no Estúdio de Fluxo.`)) return;
    this.fluxos = this.fluxos.map((f) => (f.id === id ? { ...f, ativo: false, atualizadoEm: Date.now() } : f));
    await guardarFluxos(this.fluxos);
    this.sugestaoDeFluxo = null;
    this.desenharSugestaoDeFluxo();
  }

  /** Busca a cotação do dia (uma vez por sessão, com cache de 6 h no storage). */
  private async atualizarCambio(): Promise<void> {
    if (!this.config.reais) {
      this.cambio = null;
      this.mostrarUso();
      return;
    }
    this.cambio = await cotacaoDolar().catch(() => null);
    this.mostrarUso();
  }

  /** Medidor do cabeçalho: valor e, no title, de onde ele veio. */
  /** Interrompe a rotina que passou do próprio teto de gasto. */
  private conferirTetoDaRotina(): void {
    const vigia = this.tetoDaRotina;
    if (!vigia || vigia.avisado) return;
    const gasto = this.uso.custo - vigia.base;
    if (!estourouTeto(vigia.rotina, gasto, this.cambio?.valor ?? 5.5)) return;
    vigia.avisado = true;
    vigia.parar.abort();
    this.adicionar({
      tipo: "aviso",
      texto: `A rotina "${vigia.rotina.nome}" passou do teto de R$ ${vigia.rotina.teto?.toFixed(2).replace(".", ",")} por execu\u00E7\u00E3o e foi interrompida.`,
    });
  }

  private mostrarUso(): void {
    this.conferirTetoDaRotina();
    if (!this.elCusto) return;
    const uso = this.arquivada?.uso ?? this.uso;
    this.elCusto.textContent = formatarUso(uso, this.arquivada ? this.cotacaoDaConversa(this.arquivada) : this.cambio);
    const doCache = uso.cache ? ` \u00B7 ${uso.cache.toLocaleString("pt-BR")} tokens vieram do cache` : "";
    this.elCusto.title = uso.custo
      ? this.cambio
        ? `Gasto desta conversa: ${moeda(uso.custo)} \u00B7 c\u00E2mbio ${this.cambio.valor.toLocaleString("pt-BR", { minimumFractionDigits: 4 })} (${this.cambio.fonte}, ${this.cambio.dia})${doCache}`
        : `Gasto desta conversa informado pelo servi\u00E7o de IA${doCache}`
      : "Tokens desta conversa (o servi\u00E7o de IA n\u00E3o informa custo)";
  }

  private atualizarAba(): void {
    if (!this.elAba) return;
    void this.lerTelaDoSei();
    const aba = this.ponte.atual();
    this.elAba.replaceChildren(
      h("span", { class: `ponto${aba ? " on" : ""}` }),
      aba ? `${aba.host} \u2014 ${aba.titulo.replace(/^SEI\s*-\s*/, "")}` : "Nenhuma aba do SEI conectada",
    );
    this.elAba.title = aba ? (this.elAba.textContent ?? "") : "Abra ou recarregue uma aba do SEI para o agente trabalhar nela.";
  }

  /** Ícone, rótulo e disponibilidade do botão de envio. */
  private estadoEnvio(): void {
    const ocupado = Boolean(this.motor?.ocupado);
    this.elEnviar.classList.toggle("parando", ocupado);
    this.elEnviar.replaceChildren(icone(ocupado ? "parar" : "setaCima", ocupado ? 16 : 18));
    this.elEnviar.setAttribute("title", ocupado ? "Parar" : "Enviar");
    this.elEnviar.setAttribute("aria-label", ocupado ? "Parar" : "Enviar");
    this.elEnviar.disabled = !ocupado && (!this.elEntrada.value.trim() || !this.config.chave || Boolean(this.arquivada));
    this.elEntrada.disabled = Boolean(this.arquivada);
    this.elEntrada.placeholder = this.arquivada ? "Conversa guardada: abra uma nova para escrever." : "Pe\u00E7a algo sobre o SEI...";
  }

  // ------------------------------------------------------------- configuração

  /**
   * Modal por cima da conversa. `obrigatorio` tira o "fechar": é a primeira
   * configuração, sem chave, que não faz sentido dispensar.
   */
  private abrirModal(o: { titulo: string; corpo: Array<Node | string | null | false>; acoes: Array<Node | string | null | false>; obrigatorio?: boolean }): HTMLDialogElement {
    const fechar = h("button", { class: "icone", title: "Fechar", "aria-label": "Fechar" }, icone("fechar"));
    const dlg = h(
      "dialog",
      { class: "modal", "aria-label": o.titulo, closedby: o.obrigatorio ? "none" : "any" },
      h("div", { class: "modal-topo" }, h("h2", {}, o.titulo), o.obrigatorio ? null : fechar),
      h("div", { class: "modal-corpo" }, ...o.corpo),
      h("div", { class: "modal-acoes" }, ...o.acoes),
    );
    fechar.addEventListener("click", () => dlg.close());
    // Esc e clique fora: `closedby` resolve no Chrome 134+/Firefox 141+; abaixo disso, à mão.
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      if (o.obrigatorio) dlg.addEventListener("cancel", (ev) => ev.preventDefault());
      else
        dlg.addEventListener("click", (ev) => {
          if (ev.target !== dlg) return;
          const r = dlg.getBoundingClientRect();
          const dentro = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
          if (!dentro) dlg.close();
        });
    }
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg);
    dlg.showModal();
    return dlg;
  }

  // ------------------------------------------------------------- histórico

  /** Conversas guardadas: abrir para ler, exportar em Markdown ou apagar. */
  private async abrirHistorico(): Promise<void> {
    const lista = await historico.listar().catch(() => []);
    const corpo = h("div", { class: "conversas" });
    const apagarTudo = h("button", { class: "perigo" }, icone("lixeira", 15), "Apagar todas");
    const dlg = this.abrirModal({ titulo: "Conversas guardadas", corpo: [corpo], acoes: [apagarTudo] });

    const desenhar = (itens: historico.ResumoConversa[]) => {
      if (!itens.length) {
        corpo.replaceChildren(
          h(
            "div",
            { class: "nota" },
            icone("relogio", 15),
            h("span", {}, this.config.guardar ? "Nenhuma conversa guardada ainda." : "As conversas n\u00E3o est\u00E3o sendo guardadas (veja a configura\u00E7\u00E3o)."),
          ),
        );
        return;
      }
      corpo.replaceChildren(
        ...itens.map((c) => {
          const linha = h(
            "div",
            { class: "linha" },
            h(
              "button",
              { class: "abrir", onclick: () => void this.verArquivada(c.id, dlg), ...(c.modelos?.length ? { title: `Modelo(s): ${c.modelos.join(", ")}` } : {}) },
              h("b", {}, c.titulo),
              h("small", {}, this.linhaDaConversaSalva(c)),
            ),
            h("button", { class: "icone pequeno", title: "Exportar em Markdown", "aria-label": "Exportar", onclick: () => void this.exportar(c.id) }, icone("baixar", 15)),
            h(
              "button",
              {
                class: "icone pequeno",
                title: "Excluir",
                "aria-label": "Excluir",
                onclick: async () => {
                  await historico.remover(c.id).catch(() => undefined);
                  this.agendarArquivo();
                  linha.remove();
                  if (!corpo.querySelector(".linha")) desenhar([]);
                },
              },
              icone("lixeira", 15),
            ),
          );
          return linha;
        }),
      );
    };
    desenhar(lista);

    apagarTudo.addEventListener("click", async () => {
      if (apagarTudo.textContent !== "Confirmar") {
        apagarTudo.replaceChildren("Confirmar");
        return;
      }
      await historico.limpar().catch(() => undefined);
      this.agendarArquivo();
      apagarTudo.replaceChildren(icone("lixeira", 15), "Apagar todas");
      desenhar([]);
    });
  }

  /** Abre uma conversa guardada para leitura. */
  private async verArquivada(id: string, dlg?: HTMLDialogElement): Promise<void> {
    const c = await historico.obter(id).catch(() => null);
    if (!c) return;
    this.motor?.parar();
    this.pensar(false);
    this.arquivada = c;
    this.tarefas = [];
    dlg?.close();
    this.redesenhar();
  }

  /** Data, mensagens, gasto, modelos e SEI de uma conversa guardada. */
  private linhaDaConversaSalva(c: historico.ResumoConversa, o: { modelosInteiros?: boolean } = {}): string {
    const gasto = c.uso.custo || c.uso.entrada ? formatarUso(c.uso, this.cotacaoDaConversa(c)) : "";
    const modelos = o.modelosInteiros ? (c.modelos ?? []).join(", ") : modelosCurtos(c.modelos);
    return [new Date(c.quando).toLocaleString("pt-BR"), `${c.mensagens} mensagem(ns)`, gasto, modelos, c.host ?? ""].filter(Boolean).join(" \u00B7 ");
  }

  /**
   * Em reais quando o painel mostra em reais: pela cotação do dia da conversa;
   * conversa guardada antes de existir a cotação, pela de hoje.
   */
  private cotacaoDaConversa(c: historico.ResumoConversa): { valor: number } | null {
    if (!this.config.reais) return null;
    return c.cotacao ? { valor: c.cotacao } : this.cambio;
  }

  /** Baixa a conversa em Markdown — o que dá para juntar num processo ou guardar fora. */
  private async exportar(id: string): Promise<void> {
    const c = await historico.obter(id).catch(() => null);
    if (!c) return;
    const linhas = [`# ${c.titulo}`, "", `_${this.linhaDaConversaSalva(c, { modelosInteiros: true })}_`, ""];
    for (const i of c.itens as Item[]) {
      if (i.tipo === "tool") linhas.push(`- \u2699\uFE0F ${i.rotulo}${i.detalhe ? ` (${i.detalhe})` : ""}`, "");
      else if (i.tipo === "usuario") linhas.push(`**Voc\u00EA:** ${i.texto}`, "");
      else if (i.tipo === "agente") linhas.push(i.texto, "");
      else linhas.push(`> ${i.texto}`, "");
    }
    linhas.push("", "---", "_Gerado pelo Agente de IA do SEI Pro. Respostas de IA podem conter erros._");
    const url = URL.createObjectURL(new Blob([linhas.join("\n")], { type: "text/markdown;charset=utf-8" }));
    const a = h("a", { href: url, download: `conversa-${new Date(c.quando).toISOString().slice(0, 10)}.md` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /**
   * Ajuda do serviço: o texto mais os dois links que o usuário precisa — o
   * painel do fabricante, onde a chave nasce, e o passo a passo do SEI Pro.
   * Endereço em texto puro obriga a copiar e colar; aqui abre em outra aba.
   */

  /** Configuração em modal. `obrigatorio`: primeira vez, sem chave — não fecha sem salvar. */
  private abrirConfig(obrigatorio = false): void {
    const servico = h(
      "select",
      { "aria-label": "Servi\u00E7o de IA" },
      ...(Object.entries(SERVICOS) as Array<[Servico, (typeof SERVICOS)[Servico]]>).map(([id, info]) =>
        h("option", { value: id, ...(this.config.servico === id ? { selected: true } : {}) }, info.nome),
      ),
    );
    const ajudaServico = h("div", { class: "ajuda" }, ...ajudaDoServico(this.config.servico));
    // Select de atalhos (NVIDIA/Groq/Ollama) + campo livre em "Outro". O datalist
    // filtrava pelo valor atual e o chevron n\u00E3o reabria a lista com a URL cheia.
    const url = h("input", { type: "url", placeholder: "https://.../v1", value: this.config.url, spellcheck: "false", "aria-label": "Endere\u00E7o do servi\u00E7o" });
    const urlAtalho = h(
      "select",
      { "aria-label": "Atalho de endere\u00E7o" },
      ...COMPATIVEIS.map((c) => h("option", { value: c.url }, c.nome)),
      h("option", { value: "" }, "Outro (digitar o endere\u00E7o)"),
    );
    const ajudaUrl = h("div", { class: "ajuda" });
    const chave = h("input", { type: "password", placeholder: "sk-or-v1-...", value: this.config.chave, autocomplete: "off", autofocus: true, "aria-label": "Chave do servi\u00E7o" });
    const verChave = h("button", { class: "icone", title: "Mostrar a chave", "aria-label": "Mostrar a chave" }, icone("olho"));
    verChave.addEventListener("click", () => {
      const escondida = chave.type === "password";
      chave.type = escondida ? "text" : "password";
      verChave.replaceChildren(icone(escondida ? "olhoCorte" : "olho"));
      verChave.setAttribute("title", escondida ? "Ocultar a chave" : "Mostrar a chave");
    });
    const modelo = h("select", { "aria-label": "Modelo" }, h("option", { value: this.config.modelo }, this.config.modelo));
    const modeloAux = h("select", { "aria-label": "Modelo das tarefas auxiliares" }, h("option", { value: "" }, "O mesmo da conversa"));
    const modeloAuxLivre = h("input", { type: "text", placeholder: "o mesmo da conversa", value: this.config.modeloAuxiliar, spellcheck: "false", "aria-label": "Modelo das tarefas auxiliares" });
    const modeloLivre = h("input", { type: "text", placeholder: "nome do modelo no servi\u00E7o", value: this.config.modelo, list: "modelosCompativeis", spellcheck: "false", "aria-label": "Modelo" });
    const listaModelos = h("datalist", { id: "modelosCompativeis" });
    const buscar = h("button", { title: "Buscar a lista de modelos do servi\u00E7o" }, "Atualizar");
    const ajudaModelo = h("div", { class: "ajuda" });
    const status = h("div", { class: "status" });
    const gastoHoje = h("span", {}, "");
    void gastoDeHoje().then((v) => (gastoHoje.textContent = v > 0 ? `Hoje foram gastos ${v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} at\u00E9 agora.` : "Nada gasto hoje ainda."));
    const nomes = h("input", { type: "checkbox", class: "switch", ...(this.config.nomes ? { checked: true } : {}) });
    const cnpj = h("input", { type: "checkbox", class: "switch", ...(this.config.cnpj ? { checked: true } : {}) });
    const guardar = h("input", { type: "checkbox", class: "switch", ...(this.config.guardar ? { checked: true } : {}) });
    const emReais = h("input", { type: "checkbox", class: "switch", ...(this.config.reais ? { checked: true } : {}) });
    const limiteConversa = h("input", { type: "number", min: "0", step: "1", placeholder: "sem limite", ...(this.config.limites.conversa ? { value: String(this.config.limites.conversa) } : {}), "aria-label": "Limite por conversa" });
    const limiteDia = h("input", { type: "number", min: "0", step: "1", placeholder: "sem limite", ...(this.config.limites.dia ? { value: String(this.config.limites.dia) } : {}), "aria-label": "Limite por dia" });
    const usarCache = h("input", { type: "checkbox", class: "switch", ...(this.config.cache ? { checked: true } : {}) });
    const dias = h(
      "select",
      { "aria-label": "Tempo de guarda" },
      ...([[7, "7 dias"], [30, "30 dias"], [90, "90 dias"], [0, "Sem limite"]] as Array<[number, string]>).map(([v, t]) =>
        h("option", { value: String(v), ...(this.config.dias === v ? { selected: true } : {}) }, t),
      ),
    );
    /** Permissão de host: só o OpenRouter responde com CORS liberado; os demais exigem autorização do navegador. */
    const autorizarEndereco = async (endereco: string): Promise<boolean> => {
      try {
        const origens = [`${new URL(endereco).origin}/*`];
        return (await chrome.permissions.contains({ origins: origens })) || (await chrome.permissions.request({ origins: origens }));
      } catch {
        return false;
      }
    };

    // O modo do endere\u00E7o s\u00F3 muda por escolha no select, nunca pelo que se digita:
    // se dependesse do texto, o campo sumiria no meio da digita\u00E7\u00E3o ao casar com um atalho.
    let enderecoLivre = !atalhoDeEndereco(this.config.url);
    const sincronizarUrlAtalho = (): void => {
      urlAtalho.value = enderecoLivre ? ENDERECO_OUTRO : (atalhoDeEndereco(url.value)?.url ?? ENDERECO_OUTRO);
      url.hidden = !enderecoLivre;
    };
    const campoUrl = h(
      "div",
      { class: "campo" },
      h("label", {}, "Endere\u00E7o do servi\u00E7o"),
      urlAtalho,
      url,
      ajudaUrl,
    );
    const notaCompativel = h(
      "div",
      { class: "nota atencao" },
      icone("alerta", 15),
      h(
        "span",
        {},
        "Fora do OpenRouter o agente n\u00E3o tem como exigir que o servi\u00E7o n\u00E3o guarde o que recebe: quem escolhe o endere\u00E7o responde por ele. E nem todo modelo sabe usar ferramentas \u2014 se o agente n\u00E3o conseguir agir no SEI, troque de modelo.",
      ),
    );
    const linhaBuscar = h("div", { class: "com-botao" }, modeloLivre, buscar);
    const linhaAux = h("div", {}, modeloAux, modeloAuxLivre);

    /**
     * Preenche o seletor de modelos com o catálogo do serviço.
     *
     * Fora do OpenRouter, listar exige a permissão de host — que o navegador só
     * concede durante um gesto do usuário. Por isso, ao abrir a tela a lista só
     * é buscada quando a permissão já existe; nos demais casos quem dá o gesto
     * é o próprio usuário, trocando o serviço ou clicando em "Atualizar".
     */
    /** Compatível: true depois de um /models bem-sucedido nesta abertura do modal. */
    let catalogoCompativel = false;
    /** Compat\u00EDvel com cat\u00E1logo: o usu\u00E1rio escolheu "Outro" para digitar um modelo fora da lista. */
    let modeloOutro = false;
    const invalidarCatalogo = (): void => {
      catalogoCompativel = false;
      modeloOutro = false;
    };

    const carregarModelos = async (gesto: boolean): Promise<void> => {
      const svc = servico.value as Servico;
      const endereco = enderecoDoServico(svc, url.value);
      // Ler `modelo.value` aqui não serve: o select é reescrito enquanto carrega
      // (e chegou a gravar "Buscando modelos..." como se fosse o modelo).
      const escolhido = (
        svc === "compativel" && !campoModeloEhSelect(svc, catalogoCompativel, modeloOutro) ? modeloLivre.value.trim() : modeloAtual
      ) || SERVICOS[svc].modeloPadrao || "";
      if (svc === "compativel" && !/^https?:\/\//.test(endereco)) return;
      const origens = [`${new URL(endereco).origin}/*`];
      const temPermissao = svc === "openrouter" || (await chrome.permissions.contains({ origins: origens }).catch(() => false));
      if (!temPermissao && !gesto) {
        modelo.replaceChildren(h("option", { value: escolhido, selected: true }, escolhido));
        ajudaModelo.textContent = "Clique em Atualizar para ver os modelos do servi\u00E7o (o navegador vai pedir a sua autoriza\u00E7\u00E3o).";
        return;
      }
      if (!temPermissao && !(await autorizarEndereco(endereco))) {
        status.className = "status erro";
        status.textContent = "O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.";
        return;
      }
      modelo.disabled = true;
      modelo.replaceChildren(h("option", { value: "" }, "Buscando modelos..."));
      ajudaModelo.textContent = "";
      try {
        const lista = await listarModelos({ servico: svc, url: endereco, chave: chave.value.trim() });
        if ((servico.value as Servico) !== svc) return; // trocou de serviço no meio do caminho
        if (!lista.length) throw new Error("O servi\u00E7o n\u00E3o devolveu nenhum modelo.");
        const comPreco = svc === "openrouter";
        const temEscolhido = lista.some((m) => m.id === escolhido);
        modeloOutro = false;
        modelo.replaceChildren(
          ...(temEscolhido || !escolhido ? [] : [h("option", { value: escolhido, selected: true }, `${escolhido} (atual)`)]),
          ...lista.map((m) =>
            h(
              "option",
              { value: m.id, ...(m.id === escolhido ? { selected: true } : {}) },
              comPreco ? `${m.nome} \u2014 US$ ${m.precoEntrada.toFixed(2)} / ${m.precoSaida.toFixed(2)}` : m.nome,
            ),
          ),
          ...(svc === "compativel" ? [h("option", { value: MODELO_OUTRO }, "Outro (digitar o nome do modelo)")] : []),
        );
        listaModelos.replaceChildren(...lista.map((m) => h("option", { value: m.id })));
        modeloAux.replaceChildren(
          h("option", { value: "", ...(this.config.modeloAuxiliar ? {} : { selected: true }) }, "O mesmo da conversa"),
          ...lista.map((m) =>
            h(
              "option",
              { value: m.id, ...(m.id === this.config.modeloAuxiliar ? { selected: true } : {}) },
              comPreco ? `${m.nome} \u2014 US$ ${m.precoEntrada.toFixed(2)} / ${m.precoSaida.toFixed(2)}` : m.nome,
            ),
          ),
        );
        modeloAtual = modelo.value || escolhido;
        if (svc === "compativel") {
          catalogoCompativel = true;
          modeloLivre.value = modeloAtual;
          ajustarServico();
        }
        ajudaModelo.textContent = comPreco
          ? "S\u00F3 modelos que usam ferramentas; pre\u00E7os em d\u00F3lares por milh\u00E3o de tokens (entrada / sa\u00EDda)."
          : `${lista.length} modelo(s) do servi\u00E7o. A lista vem do pr\u00F3prio fabricante.`;
        status.textContent = "";
        status.className = "status";
      } catch (e) {
        if (svc === "compativel") {
          invalidarCatalogo();
          listaModelos.replaceChildren();
          ajustarServico();
        }
        modelo.replaceChildren(h("option", { value: escolhido, selected: true }, escolhido || "(sem modelo)"));
        ajudaModelo.textContent = "";
        status.className = "status erro";
        status.textContent = `N\u00E3o deu para listar os modelos: ${(e as Error).message}`;
      } finally {
        modelo.disabled = false;
      }
    };

    const ajustarServico = (): Servico => {
      const svc = servico.value as Servico;
      const comp = svc === "compativel";
      campoUrl.hidden = !comp;
      // O aviso de política de dados vale para tudo que não é OpenRouter.
      notaCompativel.hidden = svc === "openrouter";
      // Com catálogo (OpenRouter etc., ou compatível depois do Atualizar), o
      // select abre sempre a lista inteira. Sem catálogo no compatível — servidor
      // sem /models, ou ainda sem buscar — o nome continua digitável (input).
      // O datalist filtrava pelo valor atual e escondia as opções com o campo
      // já preenchido; por isso o select toma o lugar dele quando há lista.
      const comSelect = campoModeloEhSelect(svc, catalogoCompativel);
      const modeloDigitado = !campoModeloEhSelect(svc, catalogoCompativel, modeloOutro);
      modelo.hidden = !comSelect;
      modeloAux.hidden = !comSelect;
      modeloAuxLivre.hidden = comSelect;
      linhaBuscar.hidden = !modeloDigitado || !comp;
      chave.placeholder = SERVICOS[svc].exemploChave;
      ajudaServico.replaceChildren(...ajudaDoServico(svc));
      const preset = atalhoDeEndereco(url.value);
      ajudaUrl.textContent = preset ? preset.ajuda : SERVICOS.compativel.ajuda;
      if (comp) sincronizarUrlAtalho();
      // Ao trocar de fabricante, o modelo do anterior não serve: sugere o de casa
      // (e num serviço sem sugestão, limpa em vez de deixar o nome alheio).
      const sugestao = SERVICOS[svc].modeloPadrao ?? "";
      if (comp && (!modeloLivre.value.trim() || modeloLivre.value === modeloSugerido)) modeloLivre.value = sugestao;
      // Trocou de fabricante: o modelo do anterior não existe lá.
      if (svc !== servicoAtual) {
        modeloAtual = svc === this.config.servico ? this.config.modelo : sugestao;
        invalidarCatalogo();
        servicoAtual = svc;
      }
      modeloSugerido = sugestao;
      return svc;
    };
    let modeloSugerido = SERVICOS[this.config.servico].modeloPadrao ?? "";
    let modeloAtual = this.config.modelo;
    let servicoAtual: Servico = this.config.servico;
    modelo.addEventListener("change", () => {
      if (modelo.value === MODELO_OUTRO) {
        // "Outro": volta o campo livre, j\u00E1 com o modelo que estava escolhido.
        modeloOutro = true;
        modeloLivre.value = modeloAtual;
        ajustarServico();
        modeloLivre.focus();
        modeloLivre.select();
        return;
      }
      if (!modelo.value) return;
      modeloAtual = modelo.value;
      // Voltou a escolher da lista: o campo livre sai de cena.
      if (modeloOutro) {
        modeloOutro = false;
        ajustarServico();
      }
    });
    servico.addEventListener("change", () => {
      const svc = ajustarServico();
      // O `change` É o gesto do usuário: dá para pedir a permissão e já listar.
      if (svc !== "compativel") void carregarModelos(true);
    });
    urlAtalho.addEventListener("change", () => {
      invalidarCatalogo();
      enderecoLivre = !urlAtalho.value;
      if (enderecoLivre) {
        if (atalhoDeEndereco(url.value)) url.value = "";
      } else {
        url.value = urlAtalho.value;
      }
      ajustarServico();
      if (enderecoLivre) url.focus();
    });
    url.addEventListener("input", () => {
      invalidarCatalogo();
      ajustarServico();
    });
    buscar.addEventListener("click", () => void carregarModelos(true));
    chave.addEventListener("change", () => {
      if ((servico.value as Servico) !== "compativel") void carregarModelos(false);
    });

    // Os resumos dos grupos são montados no fim, mas as listas (skills, regras,
    // memória, rotinas) desenham antes e já pedem atualização: por isso a
    // função nasce vazia e é substituída lá embaixo.
    let atualizarResumos: () => void = () => undefined;

    // ------------------------------------------------- skills do usuário
    const listaSkills = h("div", { class: "skills" });
    const novaSkill = h("button", {}, "Nova skill");
    const novaColecao = h("button", { title: "Trazer as skills de uma pasta do GitHub" }, "Skills da equipe");
    const sincronizarAgora = h("button", { title: "Conferir agora os arquivos no GitHub" }, "Sincronizar agora");
    const listaColecoes = h("div", { class: "skills" });
    const desenharSkills = () => {
      listaColecoes.replaceChildren(
        ...this.colecoes.map((col) =>
          h(
            "div",
            { class: "skill colecao" },
            h(
              "div",
              { class: "skill-texto" },
              h("strong", {}, col.nome),
              h("code", {}, `${col.quantas ?? 0} skill(s)`),
              h("small", { class: "origem" }, `${col.sincronizar ? "\u21BB " : ""}${col.url.replace(/^https?:\/\//, "")}${col.sincronizar ? ` \u00B7 ${quando(col.verificadaEm)}` : ""}`),
              col.erroSync ? h("small", { class: "falha" }, col.erroSync) : null,
            ),
            h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${col.nome}`, onclick: () => this.editarColecao(col, desenharSkills) }, icone("lapis", 15)),
            h(
              "button",
              {
                class: "icone",
                title: "Remover a cole\u00E7\u00E3o e as skills dela",
                "aria-label": `Remover ${col.nome}`,
                onclick: async () => {
                  this.colecoes = this.colecoes.filter((c) => c.id !== col.id);
                  this.skills = this.skills.filter((sk) => sk.colecao !== col.id);
                  await guardarColecoes(this.colecoes);
                  await guardarSkills(this.skills);
                  await this.aplicarConfig(this.config);
                  desenharSkills();
                },
              },
              icone("lixeira", 15),
            ),
          ),
        ),
      );
      listaSkills.replaceChildren(
        ...(this.skills.length
          ? this.skills.map((sk) =>
              h(
                "div",
                { class: "skill" },
                h(
                  "div",
                  { class: "skill-texto" },
                  h("strong", {}, sk.nome),
                  h("code", {}, `/${sk.slug}`),
                  h("small", {}, sk.descricao || descricaoDoTexto(sk.texto) || `${sk.texto.length.toLocaleString("pt-BR")} caracteres`),
                  sk.url ? h("small", { class: "origem" }, `${sk.sincronizar ? "\u21BB " : ""}${sk.url.replace(/^https?:\/\//, "")}${sk.sincronizar ? ` \u00B7 ${quando(sk.verificadaEm)}` : ""}`) : null,
                  sk.erroSync ? h("small", { class: "falha" }, `N\u00E3o deu para sincronizar: ${sk.erroSync}`) : null,
                ),
                sk.colecao ? null : h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${sk.nome}`, onclick: () => this.editarSkill(sk, desenharSkills) }, icone("lapis", 15)),
                sk.colecao
                  ? h("span", { class: "etiqueta", title: "Vem da pasta da equipe; para mudar, mude o arquivo no reposit\u00F3rio" }, "equipe")
                  : h(
                      "button",
                      {
                        class: "icone",
                        title: "Remover",
                        "aria-label": `Remover ${sk.nome}`,
                        onclick: async () => {
                          this.skills = this.skills.filter((x) => x.id !== sk.id);
                          await guardarSkills(this.skills);
                          await this.aplicarConfig(this.config);
                          desenharSkills();
                        },
                      },
                      icone("lixeira", 15),
                    ),
              ),
            )
          : [h("div", { class: "ajuda" }, "Nenhuma skill ainda. Uma skill \u00E9 um texto com as regras da sua unidade \u2014 como \u00E9 um despacho de encaminhamento, o que a nota t\u00E9cnica precisa ter \u2014 que o agente carrega s\u00F3 quando o pedido \u00E9 daquele assunto.")]),
      );
      atualizarResumos();
    };
    desenharSkills();
    novaSkill.addEventListener("click", () => this.editarSkill(null, desenharSkills));
    novaColecao.addEventListener("click", () => this.editarColecao(null, desenharSkills));
    sincronizarAgora.addEventListener("click", async () => {
      sincronizarAgora.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo os arquivos...";
      const mudaram = await this.sincronizarSkills(true);
      const decolecao = await this.sincronizarColecoes(true);
      desenharSkills();
      status.className = "status ok";
      const partes = [mudaram.length ? `Atualizada(s): ${mudaram.join(", ")}` : "", decolecao].filter(Boolean);
      status.textContent = partes.length ? `${partes.join(" \u00B7 ")}.` : "Nenhuma mudan\u00E7a no GitHub.";
      sincronizarAgora.disabled = false;
    });
    const secaoSkills = h(
      "div",
      { class: "campo" },
      h("label", {}, "Skills (instru\u00E7\u00F5es da sua unidade)"),
      listaSkills,
      listaColecoes,
      h("div", { class: "com-botao" }, novaSkill, novaColecao, this.skills.some((x) => x.url && x.sincronizar) || this.colecoes.length ? sincronizarAgora : null),
      h(
        "div",
        { class: "ajuda" },
        "Na conversa, digite ",
        h("code", {}, "/"),
        " para escolher uma skill; o agente tamb\u00E9m carrega sozinho quando o assunto bate. O conte\u00FAdo pode ser colado ou vir de um arquivo .md do GitHub.",
      ),
    );

    // ------------------------------------------------- rotinas
    const rotinasUI = secaoRotinas({
      rotinas: () => this.rotinas,
      definir: async (lista) => {
        this.rotinas = lista;
        await guardarRotinas(lista);
        await this.sincronizarAlarmes();
        atualizarResumos();
      },
      skills: () => this.skills.map((s) => ({ id: s.id, nome: s.nome })),
      escritasDisponiveis: () =>
        [...TOOLS_SEI, ...toolsMotor()]
          .filter((t) => t.efeito !== "leitura" && t.efeito !== "interna" && t.efeito !== "externo")
          .map((t) => ({ nome: t.nome, efeito: t.efeito })),
      abrirModal: (op) => this.abrirModal(op),
      rodarAgora: (r) => void this.rodarRotina(r, "manual"),
      pedirPermissaoDeAviso: () => this.pedirPermissaoDeAviso(),
    });
    const secaoRotinasEl = rotinasUI.elemento;
    const opcoesArquivo = this.opcoesArquivoUi();
    const arquivoUI = opcoesArquivo ? secaoArquivo(opcoesArquivo) : null;
    this.redesenharArquivo = arquivoUI ? () => arquivoUI.redesenhar() : null;
    const secaoArquivoEl = arquivoUI?.elemento ?? null;
    // Enquanto a configuração está aberta, o que chega do sync redesenha as
    // listas; ao fechar, os redesenhos saem (o DOM deixou de existir).
    this.redesenharConfig = [() => rotinasUI.redesenhar(), () => conectoresUI.redesenhar(), ...(arquivoUI ? [() => arquivoUI.redesenhar()] : [])];

    // ------------------------------------------------- memória da unidade
    const usarMemoria = h("input", { type: "checkbox", class: "switch", ...(this.config.memoria ? { checked: true } : {}) });
    const listaMemoria = h("div", { class: "skills" });
    const novaLembranca = h("input", { type: "text", placeholder: "Ex.: despachos desta unidade v\u00E3o assinados pelo coordenador", maxlength: String(MAX_TEXTO), "aria-label": "Nova lembran\u00E7a" });
    const addLembranca = h("button", {}, "Anotar");
    const statusMemoria = h("div", { class: "ajuda" });
    const desenharMemoria = () => {
      listaMemoria.replaceChildren(
        ...(this.memoria.length
          ? [...this.memoria].reverse().map((l) =>
              h(
                "div",
                { class: "skill lembranca" },
                h(
                  "div",
                  { class: "skill-texto" },
                  h("span", {}, l.texto),
                  h("small", { class: "origem" }, `${l.origem === "agente" ? "aprendido pelo agente" : "escrito por voc\u00EA"} \u00B7 ${new Date(l.quando).toLocaleDateString("pt-BR")}`),
                ),
                h(
                  "button",
                  {
                    class: "icone",
                    title: "Esquecer",
                    "aria-label": `Esquecer: ${l.texto}`,
                    onclick: async () => {
                      this.memoria = this.memoria.filter((x) => x.id !== l.id);
                      await guardarMemoria(this.memoria);
                      await this.aplicarConfig(this.config);
                      desenharMemoria();
                    },
                  },
                  icone("lixeira", 15),
                ),
              ),
            )
          : [h("div", { class: "ajuda" }, "Nada aprendido ainda. O agente anota sozinho o que voc\u00EA corrigir sobre o jeito da unidade trabalhar \u2014 e tudo aparece aqui, para conferir ou apagar.")]),
      );
      atualizarResumos();
    };
    desenharMemoria();
    addLembranca.addEventListener("click", async () => {
      const r = anotar(this.memoria, novaLembranca.value, "usuario");
      if (!r.ok) {
        statusMemoria.textContent = r.motivo;
        return;
      }
      this.memoria = [...this.memoria, r.lembranca];
      await guardarMemoria(this.memoria);
      await this.aplicarConfig(this.config);
      novaLembranca.value = "";
      statusMemoria.textContent = "";
      desenharMemoria();
    });
    const secaoMemoria = h(
      "div",
      { class: "campo" },
      h("label", {}, "Mem\u00F3ria da unidade"),
      h(
        "label",
        { class: "linha-switch" },
        usarMemoria,
        h("span", {}, "Deixar o agente aprender", h("small", {}, "S\u00F3 h\u00E1bito da unidade \u2014 estilo, destino de documento, jarg\u00E3o. Nada de dado de processo, n\u00FAmero ou nome de pessoa.")),
      ),
      listaMemoria,
      h("div", { class: "com-botao" }, novaLembranca, addLembranca),
      statusMemoria,
      h("div", { class: "ajuda" }, "A mem\u00F3ria vai junto em toda conversa. O que estiver aqui o agente trata como o jeito certo de trabalhar; o que o SEI mostrar na hora sempre vale mais."),
    );

    // ------------------------------------------------- regras da unidade
    const listaRegras = h("div", { class: "skills" });
    const novaRegra = h("button", {}, "Nova regra");
    const desenharRegras = () => {
      listaRegras.replaceChildren(
        ...(this.regras.length
          ? this.regras.map((re) =>
              h(
                "div",
                { class: `skill regra ${re.efeito}` },
                h("input", {
                  type: "checkbox",
                  class: "switch",
                  title: re.ativa ? "Ativa" : "Desligada",
                  ...(re.ativa ? { checked: true } : {}),
                  onchange: async (ev: Event) => {
                    re.ativa = (ev.target as HTMLInputElement).checked;
                    await guardarRegras(this.regras);
                  },
                }),
                h(
                  "div",
                  { class: "skill-texto" },
                  h("strong", {}, re.nome),
                  h("code", {}, re.efeito === "bloquear" ? "bloqueia" : "avisa"),
                  h("small", {}, `${re.ferramentas.length ? re.ferramentas.join(", ") : "qualquer altera\u00E7\u00E3o"}${re.contem ? ` \u00B7 contendo "${re.contem}"` : ""}`),
                  h("small", { class: "origem" }, re.mensagem),
                ),
                h("button", { class: "icone", title: "Editar", "aria-label": `Editar ${re.nome}`, onclick: () => this.editarRegra(re, desenharRegras) }, icone("lapis", 15)),
                h(
                  "button",
                  {
                    class: "icone",
                    title: "Remover",
                    "aria-label": `Remover ${re.nome}`,
                    onclick: async () => {
                      this.regras = this.regras.filter((x) => x.id !== re.id);
                      await guardarRegras(this.regras);
                      desenharRegras();
                    },
                  },
                  icone("lixeira", 15),
                ),
              ),
            )
          : [
              h(
                "div",
                { class: "ajuda" },
                "Nenhuma regra. Regra \u00E9 o que o agente N\u00C3O pode fazer nesta unidade (ou o que exige aten\u00E7\u00E3o) \u2014 conferido pelo pr\u00F3prio SEI Pro antes de cada altera\u00E7\u00E3o, sem depender de o modelo lembrar.",
              ),
            ]),
      );
      atualizarResumos();
    };
    desenharRegras();
    novaRegra.addEventListener("click", () => this.editarRegra(null, desenharRegras));
    const sugerirRegras = h("button", { title: "Come\u00E7ar com regras prontas" }, "Usar modelos");
    sugerirRegras.addEventListener("click", async () => {
      const faltando = REGRAS_SUGERIDAS.filter((m) => !this.regras.some((r) => r.nome === m.nome));
      this.regras = [...this.regras, ...faltando.map((m) => ({ ...m, id: crypto.randomUUID() }))];
      await guardarRegras(this.regras);
      desenharRegras();
    });
    const secaoRegras = h(
      "div",
      { class: "campo" },
      h("label", {}, "Regras da unidade"),
      listaRegras,
      h("div", { class: "com-botao" }, novaRegra, this.regras.length ? null : sugerirRegras),
      h(
        "div",
        { class: "ajuda" },
        "Uma regra que BLOQUEIA impede a a\u00E7\u00E3o antes de ela ser oferecida para aprova\u00E7\u00E3o, e o agente explica o motivo. Uma regra que AVISA deixa aprovar, com o alerta \u00E0 vista.",
      ),
    );

    // ------------------------------------------------- avançado (controle fino)
    const numero = (rotulo: string, dica: string, min: number, max: number, passo: number, valor: number | undefined, vazio: string) => {
      const campo = h("input", {
        type: "number",
        min: String(min),
        max: String(max),
        step: String(passo),
        placeholder: vazio,
        ...(valor === undefined ? {} : { value: String(valor) }),
        "aria-label": rotulo,
      });
      return { campo, bloco: h("div", { class: "campo-fino" }, h("label", {}, rotulo), campo, h("small", {}, dica)) };
    };
    const temperatura = numero("Temperatura", "0 = sempre a mesma resposta; acima de 1, mais criatividade e mais erro.", 0, 2, 0.1, this.config.ajustes.temperatura, String(TEMPERATURA_PADRAO));
    const topP = numero("Top P", "Corta a cauda das palavras improv\u00E1veis. Mexa nisto OU na temperatura, n\u00E3o nos dois.", 0, 1, 0.05, this.config.ajustes.topP, "padr\u00E3o");
    const maxTokens = numero("M\u00E1ximo de tokens na resposta", "Teto de tamanho da resposta. Curto demais corta o texto no meio.", 1, 200000, 1, this.config.ajustes.maxTokens, "padr\u00E3o");
    const penFrequencia = numero("Penalidade de frequ\u00EAncia", "Desencoraja repetir as mesmas palavras.", -2, 2, 0.1, this.config.ajustes.penalidadeFrequencia, "0");
    const penPresenca = numero("Penalidade de presen\u00E7a", "Empurra o modelo para assuntos novos.", -2, 2, 0.1, this.config.ajustes.penalidadePresenca, "0");
    const instrucoes = h("textarea", { rows: "4", placeholder: "Ex.: cite sempre o n\u00BA SEI entre par\u00EAnteses; trate o leitor por \u201Cvoc\u00EA\u201D.", spellcheck: "true", "aria-label": "Instru\u00E7\u00F5es adicionais" }, this.config.instrucoes);
    const padroes = h("button", {}, "Restaurar padr\u00F5es");
    padroes.addEventListener("click", () => {
      for (const n of [temperatura, topP, maxTokens, penFrequencia, penPresenca]) n.campo.value = "";
    });
    const controleDoModelo = h(
      "details",
      { class: "avancado" },
      h("summary", {}, "Controle fino do modelo"),
      h(
        "div",
        { class: "campo" },
        h("div", { class: "finos" }, temperatura.bloco, topP.bloco, maxTokens.bloco, penFrequencia.bloco, penPresenca.bloco),
        h("div", { class: "ajuda" }, "Campo em branco usa o padr\u00E3o do servi\u00E7o. Modelo que n\u00E3o aceitar um desses ajustes faz o agente repetir o pedido sem ele."),
        h("div", { class: "com-botao" }, padroes),
      ),
    );
    const campoInstrucoes = h(
      "div",
      { class: "campo" },
      h("label", {}, "Instru\u00E7\u00F5es que valem sempre"),
      instrucoes,
      h(
        "div",
        { class: "ajuda" },
        "Entram no fim das instru\u00E7\u00F5es do agente, para ajustar estilo e prefer\u00EAncias da sua unidade. As regras de seguran\u00E7a (aprova\u00E7\u00E3o antes de escrever, nada de sigiloso, senha nunca na conversa) continuam valendo.",
      ),
    );

    // ------------------------------------------------- grupos da configuração
    /**
     * A configuração passou de dez seções: numa tela só, viravam quatro
     * rolagens. Agrupadas e fechadas, o modal inteiro cabe na tela e o resumo
     * de cada grupo responde a maior parte das visitas ("qual modelo estou
     * usando?") sem precisar abrir nada. O `name` faz o próprio navegador
     * manter um aberto por vez.
     */
    const conectoresUI = secaoConectores({
      conectores: () => this.conectores,
      definir: async (lista) => {
        this.conectores = lista;
        await guardarConectores(lista);
        atualizarResumos();
      },
      abrirModal: (op) => this.abrirModal(op),
      aviso: (texto) => this.adicionar({ tipo: "aviso", texto }),
    });

    const resumos = {
      ia: h("small", {}),
      sabe: h("small", {}),
      pode: h("small", {}),
      gasto: h("small", {}),
      conversas: h("small", {}),
    };
    let primeiroGrupo = true;
    const grupo = (titulo: string, resumo: HTMLElement, ...filhos: Array<Node | null>) => {
      // Na primeira vez (sem chave), o grupo do serviço já abre: é o único
      // passo obrigatório para o agente funcionar.
      const abrir = obrigatorio && primeiroGrupo;
      primeiroGrupo = false;
      return h(
        "details",
        { class: "grupo", name: "configuracao", ...(abrir ? { open: true } : {}) },
        h("summary", {}, h("strong", {}, titulo), resumo),
        h("div", { class: "grupo-corpo" }, ...filhos),
      );
    };
    const qtd2 = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
    atualizarResumos = () => {
      const svc = SERVICOS[(servico.value as Servico) ?? this.config.servico];
      const nomeModelo = (campoModeloEhSelect(servico.value as Servico, catalogoCompativel, modeloOutro) ? modelo.value : modeloLivre.value) || this.config.modelo;
      resumos.ia.textContent = `${svc.nome.replace(/ \(.*\)$/, "")} \u00B7 ${nomeModelo || "sem modelo"}`;
      const colecoes = this.colecoes.length ? `, ${qtd2(this.colecoes.length, "cole\u00E7\u00E3o", "cole\u00E7\u00F5es")}` : "";
      resumos.sabe.textContent = `${qtd2(this.skills.length, "skill", "skills")}${colecoes} \u00B7 mem\u00F3ria ${usarMemoria.checked ? `com ${qtd2(this.memoria.length, "lembran\u00E7a", "lembran\u00E7as")}` : "desligada"}`;
      const ativas = this.regras.filter((r) => r.ativa).length;
      const ligados = this.conectores.filter((c) => c.ativo).length;
      resumos.pode.textContent = `${ativas ? qtd2(ativas, "regra ativa", "regras ativas") : "sem regras"} \u00B7 ${ligados ? qtd2(ligados, "conector", "conectores") : "sem conector"} \u00B7 ${nomes.checked ? "nomes mascarados" : "nomes vis\u00EDveis"}`;
      const teto = [
        Number(limiteConversa.value) > 0 ? `R$ ${limiteConversa.value}/conversa` : "",
        Number(limiteDia.value) > 0 ? `R$ ${limiteDia.value}/dia` : "",
      ].filter(Boolean);
      resumos.gasto.textContent = `${teto.length ? `teto ${teto.join(" e ")}` : "sem teto"} \u00B7 cache ${usarCache.checked ? "ligado" : "desligado"}`;
      const ativa = this.rotinas.filter((r) => r.ativa).length;
      resumos.conversas.textContent = `${guardar.checked ? `guarda ${dias.value === "0" ? "sem limite" : `${dias.value} dias`}` : "n\u00E3o guarda"} \u00B7 ${ativa ? qtd2(ativa, "rotina", "rotinas") : "sem rotina"}`;
    };
    atualizarResumos();
    for (const el of [servico, modelo, modeloLivre, nomes, cnpj, usarCache, usarMemoria, guardar, dias, limiteConversa, limiteDia])
      el.addEventListener("change", atualizarResumos);

    // A config que os campos mostram; quando ela muda fora do diálogo (o
    // Importar logo acima, o arquivo escolhido, outra janela), os campos que o
    // usuário não mexeu passam a mostrar a nova (ver `campos-config.ts`).
    let mostrada: Config = structuredClone(this.config);
    const texto = (e: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, de: (c: Config) => string): CampoDaConfig => ({
      ler: () => e.value,
      escrever: (v) => void (e.value = String(v)),
      de,
    });
    const caixa = (e: HTMLInputElement, de: (c: Config) => boolean): CampoDaConfig => ({ ler: () => e.checked, escrever: (v) => void (e.checked = Boolean(v)), de });
    const fino = (v: number | undefined): string => (v === undefined ? "" : String(v));
    const camposDaConfig: CampoDaConfig[] = [
      texto(servico, (c) => c.servico),
      texto(url, (c) => c.url),
      texto(chave, (c) => c.chave),
      // O seletor de modelos é reescrito pelo catálogo: quem guarda a escolha é `modeloAtual`.
      { ler: () => modeloAtual, escrever: (v) => void (modeloAtual = String(v)), de: (c) => c.modelo },
      texto(modeloLivre, (c) => c.modelo),
      texto(modeloAux, (c) => c.modeloAuxiliar),
      texto(modeloAuxLivre, (c) => c.modeloAuxiliar),
      caixa(nomes, (c) => c.nomes),
      caixa(cnpj, (c) => c.cnpj),
      caixa(guardar, (c) => c.guardar),
      caixa(emReais, (c) => c.reais),
      caixa(usarCache, (c) => c.cache),
      caixa(usarMemoria, (c) => c.memoria),
      texto(limiteConversa, (c) => (c.limites.conversa ? String(c.limites.conversa) : "")),
      texto(limiteDia, (c) => (c.limites.dia ? String(c.limites.dia) : "")),
      texto(dias, (c) => String(c.dias)),
      texto(instrucoes, (c) => c.instrucoes),
      texto(temperatura.campo, (c) => fino(c.ajustes.temperatura)),
      texto(topP.campo, (c) => fino(c.ajustes.topP)),
      texto(maxTokens.campo, (c) => fino(c.ajustes.maxTokens)),
      texto(penFrequencia.campo, (c) => fino(c.ajustes.penalidadeFrequencia)),
      texto(penPresenca.campo, (c) => fino(c.ajustes.penalidadePresenca)),
    ];
    this.recarregarCamposConfig = () => {
      const servicoAntes = servico.value;
      const trocados = recarregarIntocados(camposDaConfig, mostrada, this.config);
      mostrada = structuredClone(this.config);
      if (!trocados) return;
      if (servico.value !== servicoAntes) ajustarServico();
      // O seletor de modelos volta a mostrar a escolha (`modeloAtual`).
      void carregarModelos(false);
      atualizarResumos();
    };

    const salvar = h("button", { class: "primario" }, obrigatorio ? "Salvar e come\u00E7ar" : "Salvar");
    const dlg = this.abrirModal({
      titulo: "Configura\u00E7\u00E3o",
      obrigatorio,
      corpo: [
        grupo(
          "Servi\u00E7o de IA",
          resumos.ia,
          h("div", { class: "campo" }, h("label", {}, "Onde o agente pensa"), servico, ajudaServico),
          campoUrl,
          h(
            "div",
            { class: "campo" },
            h("label", {}, "Chave"),
            h("div", { class: "com-botao" }, chave, verChave),
            h("div", { class: "ajuda" }, "Fica guardada s\u00F3 neste navegador; o SEI Pro n\u00E3o tem servidor e n\u00E3o v\u00EA a sua chave."),
          ),
          h(
            "div",
            { class: "campo" },
            h("label", {}, "Modelo"),
            h("div", { class: "com-botao" }, modelo, buscar),
            linhaBuscar,
            listaModelos,
            ajudaModelo,
            notaCompativel,
            h(
              "div",
              { class: "campo-fino" },
              h("label", {}, "Modelo das tarefas auxiliares"),
              linhaAux,
              h(
                "small",
                {},
                "Quando o agente delega leituras pesadas, elas podem rodar num modelo mais barato (mini, flash, haiku). Precisa ser um modelo que saiba usar ferramentas.",
              ),
            ),
          ),
          controleDoModelo,
        ),
        grupo("O que o agente sabe", resumos.sabe, secaoSkills, secaoMemoria, campoInstrucoes),
        grupo(
          "O que o agente pode",
          resumos.pode,
          secaoRegras,
          conectoresUI.elemento,
          h(
            "div",
            { class: "campo" },
            h("label", {}, "Privacidade"),
            h("label", { class: "linha-switch" }, nomes, h("span", {}, "Mascarar nomes de pessoas", h("small", {}, "Interessados e nomes ap\u00F3s \u201CSr.\u201D, \u201Crequerente\u201D, \u201Cfilho de\u201D..."))),
            h("label", { class: "linha-switch" }, cnpj, h("span", {}, "Mascarar tamb\u00E9m CNPJ", h("small", {}, "Empresas; CPF, e-mail e telefone s\u00E3o sempre mascarados."))),
            h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, PRIVACIDADE)),
          ),
          secaoBaixados({
            listar: async () => (this.baixados = await listarBaixados()),
            apagar: async () => {
              // O clique no botão é o gesto que o navegador exige para pedir a permissão.
              await pedirPermissaoDeDownloads();
              const r = await apagarBaixados();
              this.baixados = [];
              return r;
            },
            permitido: temPermissaoDeDownloads,
            pedirPermissao: pedirPermissaoDeDownloads,
          }).elemento,
        ),
        grupo(
          "Gasto",
          resumos.gasto,
          h(
            "div",
            { class: "campo" },
            h(
              "label",
              { class: "linha-switch" },
              emReais,
              h("span", {}, "Mostrar o gasto em reais", h("small", {}, "Convertido pela cota\u00E7\u00E3o do dia (PTAX do Banco Central). Desligado, o painel mostra em d\u00F3lares.")),
            ),
            h(
              "div",
              { class: "finos" },
              h("div", { class: "campo-fino" }, h("label", {}, "Limite por conversa (R$)"), limiteConversa, h("small", {}, "Ao chegar no teto, a conversa para de aceitar perguntas. Em branco = sem limite.")),
              h("div", { class: "campo-fino" }, h("label", {}, "Limite por dia (R$)"), limiteDia, h("small", {}, "Soma o que foi gasto hoje, em todas as conversas. Zera \u00E0 meia-noite.")),
            ),
            h("div", { class: "ajuda" }, gastoHoje),
            h(
              "label",
              { class: "linha-switch" },
              usarCache,
              h(
                "span",
                {},
                "Reaproveitar o pedido no cache do servi\u00E7o",
                h("small", {}, "Marca o trecho que se repete (instru\u00E7\u00F5es, ferramentas, skills) para o provedor cobrar menos por ele. Alguns modelos ignoram; nenhum perde qualidade."),
              ),
            ),
          ),
        ),
        grupo(
          "Conversas e rotinas",
          resumos.conversas,
          h(
            "div",
            { class: "campo" },
            h("label", { class: "linha-switch" }, guardar, h("span", {}, "Guardar as conversas neste navegador", h("small", {}, "Para reler e exportar depois, pelo rel\u00F3gio no topo do painel."))),
            h("div", { class: "com-botao" }, h("span", { class: "ajuda" }, "Apagar depois de"), dias),
            h(
              "div",
              { class: "nota" },
              icone("baixar", 15),
              h(
                "span",
                {},
                "A configura\u00E7\u00E3o do agente acompanha a sua conta do navegador: instru\u00E7\u00F5es, regras, rotinas, mem\u00F3ria, conectores e fluxos aparecem nos seus outros computadores. Ficam S\u00D3 aqui a chave do servi\u00E7o de IA, os tokens dos conectores, o texto das skills coladas \u00E0 m\u00E3o (as do GitHub viajam pelo endere\u00E7o) e as conversas. Se o backup em arquivo estiver ligado, tudo isso vai para o arquivo (a chave e os tokens s\u00F3 se voc\u00EA marcar essa op\u00E7\u00E3o).",
              ),
            ),
            h(
              "div",
              { class: "nota" },
              icone("escudo", 15),
              h(
                "span",
                {},
                "Fica guardada s\u00F3 a transcri\u00E7\u00E3o \u2014 o que apareceu na tela. O hist\u00F3rico que vai ao modelo e a tabela que liga [PESSOA_1] ao nome real morrem quando o navegador fecha, e por isso uma conversa guardada abre para ler e exportar, n\u00E3o para continuar.",
              ),
            ),
          ),
          secaoRotinasEl,
        ),
        secaoArquivoEl ? grupo("Backup em arquivo", h("small", {}, "Opcional"), secaoArquivoEl) : null,
        h("div", { class: "nota atencao rodape-modal" }, icone("alerta", 15), h("span", {}, RESPONSABILIDADE)),
      ],
      acoes: [status, obrigatorio ? null : h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    dlg.addEventListener(
      "close",
      () => {
        this.redesenharConfig = [];
        this.redesenharArquivo = null;
        this.recarregarCamposConfig = null;
      },
      { once: true },
    );

    salvar.addEventListener("click", async () => {
      const erro = (texto: string) => {
        status.className = "status erro";
        status.textContent = texto;
        salvar.disabled = false;
      };
      const svc = servico.value as Servico;
      const comp = svc === "compativel";
      const catalogo = svc === "openrouter";
      const k = chave.value.trim();
      const enderecoLivre = comp ? normalizarUrl(url.value) : "";
      const endereco = enderecoDoServico(svc, enderecoLivre);
      const m = campoModeloEhSelect(svc, catalogoCompativel, modeloOutro)
        ? modelo.value || modeloAtual || SERVICOS[svc].modeloPadrao || MODELO_PADRAO
        : modeloLivre.value.trim();
      if (!k) return erro("Informe a chave.");
      if (comp && !/^https?:\/\//.test(endereco)) return erro("Informe o endere\u00E7o do servi\u00E7o (come\u00E7ando com https://).");
      if (!m) return erro(comp ? "Informe o nome do modelo no servi\u00E7o." : "Escolha o modelo.");
      const numeroDe = (e: HTMLInputElement, nome: string, min: number, max: number): number | undefined | null => {
        const t = e.value.trim();
        if (!t) return undefined;
        const v = Number(t.replace(",", "."));
        if (!Number.isFinite(v) || v < min || v > max) {
          erro(`${nome} precisa ser um n\u00FAmero entre ${min} e ${max}.`);
          return null;
        }
        return v;
      };
      const ajustes: Ajustes = {};
      const finos: Array<[keyof Ajustes, HTMLInputElement, string, number, number]> = [
        ["temperatura", temperatura.campo, "A temperatura", 0, 2],
        ["topP", topP.campo, "O Top P", 0, 1],
        ["maxTokens", maxTokens.campo, "O m\u00E1ximo de tokens", 1, 200000],
        ["penalidadeFrequencia", penFrequencia.campo, "A penalidade de frequ\u00EAncia", -2, 2],
        ["penalidadePresenca", penPresenca.campo, "A penalidade de presen\u00E7a", -2, 2],
      ];
      for (const [nome, campo, rotulo, min, max] of finos) {
        const v = numeroDe(campo, rotulo, min, max);
        if (v === null) {
          // Abre onde está o campo errado: o grupo e, dentro dele, o controle fino.
          controleDoModelo.closest("details.grupo")?.setAttribute("open", "");
          controleDoModelo.open = true;
          controleDoModelo.scrollIntoView({ block: "center" });
          return;
        }
        if (v !== undefined) ajustes[nome] = v;
      }
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Conferindo...";
      if (!catalogo && !(await autorizarEndereco(endereco))) return erro("O navegador n\u00E3o autorizou o agente a falar com esse endere\u00E7o.");
      const mudou = k !== this.config.chave || svc !== this.config.servico || enderecoLivre !== this.config.url;
      if (mudou) {
        const r = await conferirChave({ chave: k, servico: svc, url: endereco }).catch(() => ({ ok: false }));
        if (!r.ok) return erro(catalogo ? "A chave n\u00E3o foi aceita pelo OpenRouter." : `O ${SERVICOS[svc].nome.replace(/ \(.*\)$/, "")} n\u00E3o aceitou a chave${comp ? " (ou o endere\u00E7o est\u00E1 errado)" : ""}.`);
      }
      await this.aplicarConfig({
        reais: emReais.checked,
        guardar: guardar.checked,
        dias: Number(dias.value),
        servico: svc,
        url: enderecoLivre,
        chave: k,
        modelo: m,
        nomes: nomes.checked,
        cnpj: cnpj.checked,
        ajustes,
        instrucoes: instrucoes.value.trim(),
        limites: { conversa: Math.max(0, Number(limiteConversa.value) || 0), dia: Math.max(0, Number(limiteDia.value) || 0) },
        cache: usarCache.checked,
        memoria: usarMemoria.checked,
        modeloAuxiliar: (campoModeloEhSelect(svc, catalogoCompativel) ? modeloAux.value : modeloAuxLivre.value).trim(),
      });
      dlg.close();
    });
    ajustarServico();
    void carregarModelos(false);
  }

  /**
   * Roda as rotinas vencidas, uma de cada vez.
   *
   * Acontece ao abrir o painel, porque é o único momento em que a extensão
   * existe: não há servidor guardando a sessão do usuário para agir sozinho.
   * Espera a aba do SEI conectar — sem ela não há o que consultar — e respeita
   * o teto de gasto, senão a rotina viraria a maneira mais fácil de estourar o
   * limite sem perceber.
   */
  private async rodarRotinas(): Promise<void> {
    const pendentes = vencidas(this.rotinas);
    if (!pendentes.length || !this.config.chave) return;
    if (this.motor?.ocupado || this.rotinaEmCurso) return;
    for (let i = 0; i < 20 && !this.ponte.atual(); i += 1) await new Promise((r) => setTimeout(r, 1000));
    if (!this.ponte.atual()) return;
    for (const rotina of pendentes) {
      if (!(await this.rodarRotina(rotina, "vencida"))) break;
    }
  }

  /**
   * Uma execução de rotina, do aviso na conversa ao registro no histórico.
   *
   * Devolve `false` quando não vale seguir para a próxima — hoje, teto de
   * gasto estourado.
   *
   * Leitura roda no agente auxiliar (contexto próprio, ferramentas só de
   * leitura). Os outros alcances rodam no motor da conversa: é ele que tem a
   * interface do painel, e é `rotinaEmCurso` que diz ao `aprovarPlano` se o
   * plano se aprova sozinho ou se espera o usuário.
   */
  private async rodarRotina(rotina: Rotina, motivo: "vencida" | "manual"): Promise<boolean> {
    const emReais = (d: number) => d * (this.cambio?.valor ?? 5.5);
    const veredito = cabeMaisUma(this.config.limites, emReais(this.uso.custo), await gastoDeHoje());
    if (!veredito.permite) {
      this.adicionar({ tipo: "aviso", texto: `A rotina "${rotina.nome}" n\u00E3o rodou: ${veredito.motivo}` });
      return false;
    }
    const skills = (rotina.skills ?? []).map((id) => this.skills.find((s) => s.id === id)).filter((s): s is SkillUsuario => Boolean(s));
    const pedido = comSkills(rotina.pergunta.trim(), skills);
    if (!pedido.trim()) {
      this.adicionar({
        tipo: "aviso",
        texto: `A rotina "${rotina.nome}" n\u00E3o tem instru\u00E7\u00E3o: o texto est\u00E1 em branco e as skills escolhidas n\u00E3o existem mais.`,
      });
      return true;
    }
    this.adicionar({
      tipo: "aviso",
      texto: `Rotina "${rotina.nome}" (${motivo === "manual" ? "pedida por voc\u00EA" : descreverFrequencia(rotina)}) \u2014 ${descreverAlcance(rotina.alcance)}.`,
    });

    // Alcance que escreve usa o motor da conversa; se ele está no meio de um
    // pedido do usuário, a rotina espera a próxima oportunidade.
    if (rotina.alcance !== "leitura" && this.motor?.ocupado) {
      this.adicionar({ tipo: "aviso", texto: `A rotina "${rotina.nome}" espera: o agente est\u00E1 trabalhando no seu pedido.` });
      return true;
    }

    if (this.motorDesatualizado && !this.motor?.ocupado) this.refazerMotor();
    const antes = this.uso.custo;
    const curso = { rotina, escritas: [] as string[] };
    this.rotinaEmCurso = curso;
    const parar = new AbortController();
    this.tetoDaRotina = { rotina, base: antes, parar, avisado: false };
    let resultado = "";
    let ok = true;
    // Falha na EXECUÇÃO, que é o que desliga uma rotina autônoma. Estourar o
    // teto de gasto também marca a execução como malsucedida, mas não é
    // defeito de escrita e não desliga nada.
    let falhouExecutando = false;
    try {
      if (rotina.alcance === "leitura") {
        resultado = await this.delegar(pedido, parar.signal);
        this.adicionar({ tipo: "agente", texto: resultado });
      } else {
        this.motor ??= this.criarMotor();
        this.contador.anotarModelo(this.config.modelo);
        await this.motor.enviar(pedido, parar.signal);
        resultado = this.ultimoTextoDoAgente();
      }
    } catch (e) {
      ok = false;
      falhouExecutando = true;
      resultado = `Falhou: ${(e as Error).message}`;
      const recado = `Rotina "${rotina.nome}": ${(e as Error).message}`;
      this.adicionar({ tipo: "erro", texto: recado, diagnostico: await this.diagnosticoDoErro(recado, e) });
    } finally {
      this.rotinaEmCurso = null;
      this.tetoDaRotina = null;
    }
    const gasto = this.uso.custo - antes;
    if (gasto > 0) await somarGastoDoDia(emReais(gasto));
    if (estourouTeto(rotina, gasto, this.cambio?.valor ?? 5.5)) {
      ok = false;
      resultado = `Interrompida: passou do teto de R$ ${rotina.teto?.toFixed(2).replace(".", ",")} por execução.`;
    }

    // Escrita que falhou numa rotina autônoma desliga a rotina: insistir
    // sozinha, sem ninguém olhando, é pior que parar e avisar.
    const desligar = falhouExecutando && rotina.alcance === "autonoma" && curso.escritas.length > 0;
    const execucao: Execucao = {
      em: Date.now(),
      ok,
      resumo: resultado.slice(0, 300),
      custo: gasto,
      ...(curso.escritas.length ? { escritas: [...new Set(curso.escritas)] } : {}),
    };
    let atualizada = registrarExecucao(rotina, execucao);
    if (desligar) atualizada = { ...atualizada, ativa: false, falhas: (rotina.falhas ?? 0) + 1 };
    this.rotinas = this.rotinas.map((x) => (x.id === rotina.id ? atualizada : x));
    await guardarRotinas(this.rotinas);
    await this.salvarSessao();
    if (desligar) void this.sincronizarAlarmes();
    if (rotina.avisar) await this.avisarRotina(atualizada, execucao, desligar);
    return true;
  }

  /** O último texto que o agente escreveu na conversa (o resultado da rotina). */
  private ultimoTextoDoAgente(): string {
    for (let i = this.transcricao.length - 1; i >= 0; i -= 1) {
      const item = this.transcricao[i];
      if (item.tipo === "agente") return item.texto;
    }
    return "";
  }

  /**
   * Alarmes do navegador, um por rotina agendada.
   *
   * O alarme não executa nada: ele acorda o `background.js`, que avisa o
   * painel (se estiver aberto) ou mostra uma notificação de pendência. No
   * Firefox não há background, e aí a varredura periódica do painel é tudo.
   */
  private async sincronizarAlarmes(): Promise<void> {
    if (!chrome.alarms?.create) return;
    try {
      const existentes = await chrome.alarms.getAll();
      for (const a of existentes) if (a.name.startsWith(NOME_ALARME)) await chrome.alarms.clear(a.name);
      for (const { nome, periodoMin } of alarmesDe(this.rotinas)) {
        chrome.alarms.create(nome, { periodInMinutes: periodoMin, delayInMinutes: 1 });
      }
    } catch {
      /* navegador sem a API de alarmes: a varredura periódica cobre */
    }
  }

  /** Avisa que a rotina terminou. Sem permissão de notificação, não faz nada. */
  private async avisarRotina(rotina: Rotina, execucao: Execucao, desligada: boolean): Promise<void> {
    if (!chrome.notifications?.create) return;
    try {
      if (!(await chrome.permissions.contains({ permissions: ["notifications"] }))) return;
      const { titulo, corpo } = textoDoAviso(rotina, execucao, desligada);
      chrome.notifications.create(`rotina-fim:${rotina.id}:${execucao.em}`, {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/menu/botpro_icon.svg"),
        title: titulo,
        message: corpo,
      });
    } catch {
      /* sem permissão ou sem API: a rotina já rodou, o aviso é extra */
    }
  }

  /**
   * Pede a permissão de notificação.
   *
   * Tem de vir de um gesto do usuário — por isso só é chamada do clique na
   * caixa "avisar quando terminar", nunca na abertura do painel.
   */
  private async pedirPermissaoDeAviso(): Promise<boolean> {
    try {
      if (await chrome.permissions.contains({ permissions: ["notifications"] })) return true;
      return await chrome.permissions.request({ permissions: ["notifications"] });
    } catch {
      return false;
    }
  }

  /**
   * Guarda um fato sobre a unidade, se ele passar pelas travas da memória.
   *
   * Aparece na conversa mesmo quando é recusado: o usuário precisa ver o que o
   * agente tentou aprender — inclusive para corrigir.
   */
  private async lembrar(fato: string): Promise<{ guardado: boolean; motivo?: string }> {
    if (!this.config.memoria) return { guardado: false, motivo: "O usu\u00E1rio desligou a mem\u00F3ria nas configura\u00E7\u00F5es." };
    const r = anotar(this.memoria, fato, "agente");
    if (!r.ok) {
      this.adicionar({ tipo: "tool", rotulo: `Mem\u00F3ria: n\u00E3o anotei \u2014 ${r.motivo}`, estado: "falha" });
      return { guardado: false, motivo: r.motivo };
    }
    this.memoria = [...this.memoria, r.lembranca];
    await guardarMemoria(this.memoria);
    this.adicionar({ tipo: "tool", rotulo: `Aprendi: ${r.lembranca.texto}`, estado: "ok" });
    return { guardado: true };
  }

  /**
   * Agente auxiliar para uma tarefa de leitura.
   *
   * O motivo de existir é o contexto: ler trinta documentos para responder uma
   * pergunta enche a conversa principal de texto que ninguém vai reler — e que
   * é pago de novo a cada rodada seguinte. O auxiliar lê no lugar dela e
   * devolve só a resposta.
   *
   * Três limites, por segurança e por custo: ferramentas SÓ de leitura (ele
   * não escreve no SEI nem pede aprovação), sem delegar de novo (nada de
   * recursão), e poucos passos. A tabela de pseudônimos é a MESMA da conversa
   * principal: [PESSOA_1] precisa ser a mesma pessoa nos dois lados.
   */
  private async delegar(tarefa: string, sinal: AbortSignal): Promise<string> {
    // `ver_imagem` fica de fora: o auxiliar não tem como pedir permissão ao usuário.
    const soLeitura = [...TOOLS_SEI, ...toolsMotor(this.skills)].filter((t) => (t.efeito === "leitura" || t.nome === "skill_ler") && !TOOLS_FORA_DO_AUXILIAR.includes(t.nome));
    let resposta = "";
    const fonte = this.contador.fonte();
    this.contador.anotarModelo(this.config.modeloAuxiliar || this.config.modelo);
    const auxiliar = new Motor({
      // O auxiliar faz trabalho mecânico (abrir, extrair, resumir): quando o
      // usuário aponta um modelo mais barato, é aqui que ele entra.
      provedor: criarProvedor({
        servico: this.config.servico,
        url: this.config.url,
        chave: this.config.chave,
        modelo: this.config.modeloAuxiliar || this.config.modelo,
        ajustes: this.config.ajustes,
        cache: this.config.cache,
      }),
      tools: new RegistroTools(soLeitura),
      privacidade: this.privacidade,
      sei: (op, args, s2) => this.ponte.executar(op, args, s2),
      limitePassos: 14,
      sistema: (tela, nonce) =>
        `${promptSistema(tela, new Date(), this.config.instrucoes, this.skills, blocoDeMemoria(this.memoria), "", nonce)}

Voc\u00EA \u00E9 um AUXILIAR: recebeu uma tarefa de leitura de outro agente e n\u00E3o fala com o usu\u00E1rio.
- S\u00F3 tem ferramentas de leitura. N\u00E3o prometa nem planeje escrita.
- N\u00E3o pergunte nada: se faltar informa\u00E7\u00E3o, diga o que faltou na resposta.
- Responda em UMA mensagem final, completa e objetiva, com os n\u00FAmeros (n\u00BA SEI, protocolo) que embasam cada afirma\u00E7\u00E3o. Quem vai ler \u00E9 outro agente, n\u00E3o uma pessoa.
${INSTRUCAO_FIGURAS_AUXILIAR}`,
      tela: async (s2) => ({ ...((await this.ponte.executar("tela", {}, s2)) as TelaAtual), editores: this.ponte.editores() }),
      ui: {
        texto: (d) => (resposta += d),
        fimDaResposta: () => undefined,
        toolIniciada: (_id, _nome, rotulo) => this.mostrarProgressoAuxiliar(rotulo),
        toolTerminada: () => undefined,
        // Um auxiliar que pergunta ou pede aprovação travaria a conversa: aqui
        // as respostas são "não" e a tarefa volta com o que faltou.
        aprovarPlano: async () => ({ aprovado: false, motivo: "O auxiliar n\u00E3o escreve no SEI." }),
        progressoPlano: () => undefined,
        consentir: async () => false,
        perguntar: async () => "Sem resposta: responda com o que conseguiu apurar.",
        tarefas: () => undefined,
        uso: (u) => {
          // O gasto do auxiliar é gasto da conversa: entra no mesmo contador.
          fonte(u);
          this.mostrarUso();
        },
        aviso: () => undefined,
      },
    });
    try {
      await auxiliar.enviar(tarefa, sinal);
    } finally {
      auxiliar.parar();
    }
    return resposta.trim() || "O auxiliar n\u00E3o conseguiu apurar nada.";
  }

  /** Mostra no indicador de trabalho o que o auxiliar está fazendo agora. */
  private mostrarProgressoAuxiliar(rotulo: string): void {
    const palavra = this.elPensando.querySelector(".palavra");
    if (palavra) palavra.textContent = `Auxiliar: ${rotulo}`;
  }

  /**
   * Desfaz uma ação já aplicada no SEI, pela operação inversa.
   *
   * Vai direto pela ponte, sem passar pelo modelo: desfazer é decisão do
   * usuário, e um pedido em linguagem natural poderia virar outra coisa.
   */
  private async desfazer(acao: AcaoFeita): Promise<void> {
    const inversa = inversaDe(acao.tool, acao.args, acao.resultado);
    if (!inversa || acao.desfeita) return;
    if (!confirm(`${inversa.rotulo}?`)) return;
    this.adicionar({ tipo: "tool", rotulo: inversa.rotulo, estado: "rodando" });
    const item = this.transcricao[this.transcricao.length - 1] as Extract<Item, { tipo: "tool" }>;
    try {
      for (const passo of inversa.passos) await this.ponte.executar(passo.op, passo.args);
      acao.desfeita = true;
      const original = this.transcricao.find((i) => i.tipo === "tool" && i.acao === acao.id);
      if (original && original.tipo === "tool") original.desfeita = true;
      item.estado = "ok";
      // O modelo precisa saber, senão segue achando que a ação continua valendo.
      this.motor?.anotar(`O usu\u00E1rio desfez a a\u00E7\u00E3o "${acao.rotulo}" (${inversa.rotulo}).`);
    } catch (e) {
      item.estado = "falha";
      item.detalhe = (e as Error).message;
    }
    this.redesenhar();
    await this.salvarSessao();
  }

  /**
   * Atualiza as skills marcadas para acompanhar o arquivo no GitHub.
   *
   * Em segundo plano, sem travar o painel: quem depende disso é a próxima
   * pergunta, não a abertura. Só busca onde o navegador já autorizou o
   * endereço — pedir permissão exige um clique, e aqui não há nenhum.
   */
  private async sincronizarSkills(forcar = false): Promise<string[]> {
    if (!this.skills.some((s) => s.url && s.sincronizar)) return [];
    // Sem pedir permissão: o GitHub responde com CORS liberado, e pedir
    // permissão fora de um clique trava esperando um diálogo que ninguém vê.
    // Se o endereço do usuário não liberar, a falha vira `erroSync` na lista.
    const { lista, mudaram } = await sincronizarSkills(this.skills, { forcar });
    if (JSON.stringify(lista) === JSON.stringify(this.skills)) return [];
    this.skills = lista;
    await guardarSkills(lista);
    // O motor em curso carrega as skills no prompt e no skill_ler: precisa ser refeito.
    if (mudaram.length) await this.aplicarConfig(this.config);
    return mudaram;
  }

  /**
   * Atualiza as coleções da equipe (pastas do GitHub).
   *
   * Espaçada como a das skills e pelo mesmo motivo: a API do GitHub sem
   * autenticação dá 60 consultas por hora, e uma coleção gasta uma por
   * verificação mais uma por arquivo novo.
   */
  private async sincronizarColecoes(forcar = false): Promise<string> {
    const alvos = this.colecoes.filter((c) => c.sincronizar || forcar);
    if (!alvos.length) return "";
    const agora = Date.now();
    const partes: string[] = [];
    let mexeu = false;
    for (const col of alvos) {
      if (!forcar && col.verificadaEm && agora - col.verificadaEm < INTERVALO_COLECAO) continue;
      try {
        const baixadas = await baixarColecao(col.url);
        const r = mesclarColecao(this.skills, col, baixadas, agora);
        this.skills = r.lista;
        this.colecoes = this.colecoes.map((c) => (c.id === col.id ? { ...c, verificadaEm: agora, quantas: baixadas.length, erroSync: undefined } : c));
        mexeu = true;
        if (r.novas || r.atualizadas || r.removidas) {
          partes.push(`${col.nome}: ${[r.novas && `${r.novas} nova(s)`, r.atualizadas && `${r.atualizadas} atualizada(s)`, r.removidas && `${r.removidas} removida(s)`].filter(Boolean).join(", ")}`);
        }
      } catch (e) {
        this.colecoes = this.colecoes.map((c) => (c.id === col.id ? { ...c, verificadaEm: agora, erroSync: (e as Error).message } : c));
        mexeu = true;
        partes.push(`${col.nome}: ${(e as Error).message}`);
      }
    }
    if (mexeu) {
      await guardarSkills(this.skills);
      await guardarColecoes(this.colecoes);
      await this.aplicarConfig(this.config);
    }
    return partes.join(" \u00B7 ");
  }

  /** Cadastro de uma coleção da equipe: nome e a pasta do GitHub. */
  private editarColecao(colecao: ColecaoSkills | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: colecao?.nome ?? "", placeholder: "Skills da minha unidade", "aria-label": "Nome da cole\u00E7\u00E3o" });
    const url = h("input", {
      type: "url",
      value: colecao?.url ?? "",
      placeholder: "https://github.com/orgao/skills-sei/tree/main/skills",
      spellcheck: "false",
      "aria-label": "Pasta no GitHub",
    });
    const sincronizar = h("input", { type: "checkbox", class: "switch", ...(colecao?.sincronizar ? { checked: true } : {}) });
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, colecao ? "Salvar" : "Adicionar");
    const dlg = this.abrirModal({
      titulo: colecao ? "Editar cole\u00E7\u00E3o" : "Skills da equipe",
      corpo: [
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Nome"),
          nome,
          h("div", { class: "ajuda" }, "Como a sua unidade chama esse conjunto de instru\u00E7\u00F5es."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Pasta no GitHub"),
          url,
          h(
            "div",
            { class: "ajuda" },
            "Cada arquivo .md da pasta vira uma skill (o README fica de fora). Quem cuida do padr\u00E3o edita o reposit\u00F3rio; todo mundo recebe.",
          ),
        ),
        h(
          "label",
          { class: "linha-switch" },
          sincronizar,
          h("span", {}, "Manter sincronizada", h("small", {}, "Confere a pasta a cada 12 horas. Skill que sai da pasta sai daqui tamb\u00E9m.")),
        ),
        h(
          "div",
          { class: "nota" },
          icone("escudo", 15),
          h("span", {}, "As skills da equipe n\u00E3o se editam aqui: elas s\u00E3o um espelho do reposit\u00F3rio. Para mudar, mude o arquivo l\u00E1."),
        ),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    salvar.addEventListener("click", async () => {
      const erro = (t: string) => {
        status.className = "status erro";
        status.textContent = t;
        salvar.disabled = false;
      };
      const n = nome.value.trim();
      const u = url.value.trim();
      if (!n) return erro("Informe o nome da cole\u00E7\u00E3o.");
      if (!partesDoGitHub(u)) return erro("Informe a pasta no GitHub (github.com/dono/repo/tree/branch/pasta).");
      salvar.disabled = true;
      status.className = "status";
      status.textContent = "Buscando as skills...";
      const nova: ColecaoSkills = { id: colecao?.id ?? crypto.randomUUID(), nome: n, url: u, sincronizar: sincronizar.checked };
      try {
        const baixadas = await baixarColecao(u);
        const r = mesclarColecao(this.skills, nova, baixadas);
        this.skills = r.lista;
        this.colecoes = colecao ? this.colecoes.map((c) => (c.id === colecao.id ? { ...nova, verificadaEm: Date.now(), quantas: baixadas.length } : c)) : [...this.colecoes, { ...nova, verificadaEm: Date.now(), quantas: baixadas.length }];
        await guardarSkills(this.skills);
        await guardarColecoes(this.colecoes);
        await this.aplicarConfig(this.config);
        aoFechar();
        dlg.close();
      } catch (e) {
        return erro(
          e instanceof TypeError
            ? "N\u00E3o foi poss\u00EDvel falar com o GitHub (rede do \u00F3rg\u00E3o?). Confira se github.com est\u00E1 liberado."
            : (e as Error).message,
        );
      }
    });
  }

  /** Cadastro de uma regra da unidade. */
  private editarRegra(regra: Regra | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: regra?.nome ?? "", placeholder: "Nunca enviar processo sem revis\u00E3o", "aria-label": "Nome da regra" });
    const efeito = h(
      "select",
      { "aria-label": "Efeito" },
      h("option", { value: "bloquear", ...(regra?.efeito !== "avisar" ? { selected: true } : {}) }, "Bloquear a a\u00E7\u00E3o"),
      h("option", { value: "avisar", ...(regra?.efeito === "avisar" ? { selected: true } : {}) }, "Deixar passar, com aviso"),
    );
    // Só ferramentas que MUDAM algo no SEI: regra sobre leitura não faz sentido.
    const escritas = [...TOOLS_SEI, ...toolsMotor()].filter((t) => t.efeito !== "leitura" && t.efeito !== "interna").map((t) => t.nome).sort();
    const ferramentas = h(
      "select",
      { multiple: true, size: "8", "aria-label": "A\u00E7\u00F5es alcan\u00E7adas" },
      ...escritas.map((n) => h("option", { value: n, ...(regra?.ferramentas.includes(n) ? { selected: true } : {}) }, n)),
    );
    const contem = h("input", { type: "text", value: regra?.contem ?? "", placeholder: "Portaria, GABIN, sigiloso...", "aria-label": "Condi\u00E7\u00E3o de texto" });
    const mensagem = h("textarea", { rows: "2", "aria-label": "Mensagem" }, regra?.mensagem ?? "");
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, regra ? "Salvar" : "Adicionar");
    const dlg = this.abrirModal({
      titulo: regra ? "Editar regra" : "Nova regra",
      corpo: [
        h("div", { class: "campo" }, h("label", {}, "Nome"), nome),
        h("div", { class: "campo" }, h("label", {}, "O que fazer"), efeito),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "A\u00E7\u00F5es alcan\u00E7adas"),
          ferramentas,
          h("div", { class: "ajuda" }, "Segure Ctrl (ou Cmd) para escolher v\u00E1rias. Nenhuma escolhida = qualquer altera\u00E7\u00E3o no SEI."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "S\u00F3 quando aparecer (opcional)"),
          contem,
          h("div", { class: "ajuda" }, "Palavra que precisa estar no pedido \u2014 o tipo do documento, a sigla da unidade de destino, um termo. Sem acento e mai\u00FAscula n\u00E3o importam."),
        ),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Mensagem"),
          mensagem,
          h("div", { class: "ajuda" }, "Aparece para voc\u00EA e vai para o agente, que explica na conversa em vez de tentar de novo."),
        ),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });
    salvar.addEventListener("click", async () => {
      const n = nome.value.trim();
      const msg = mensagem.value.trim();
      if (!n || !msg) {
        status.className = "status erro";
        status.textContent = "Informe o nome e a mensagem.";
        return;
      }
      const nova: Regra = {
        id: regra?.id ?? crypto.randomUUID(),
        nome: n,
        ativa: regra?.ativa ?? true,
        efeito: efeito.value as Regra["efeito"],
        ferramentas: [...ferramentas.selectedOptions].map((o) => o.value),
        ...(contem.value.trim() ? { contem: contem.value.trim() } : {}),
        mensagem: msg,
      };
      this.regras = regra ? this.regras.map((x) => (x.id === regra.id ? nova : x)) : [...this.regras, nova];
      await guardarRegras(this.regras);
      aoFechar();
      dlg.close();
    });
  }

  /**
   * Cadastro de uma skill, em modal por cima da configuração.
   *
   * O conteúdo pode ser colado ou vir de um `.md` do GitHub — e, vindo de lá,
   * o texto é baixado e GUARDADO: a conversa não pode depender de a rede
   * alcançar o GitHub no meio do pedido.
   */
  private editarSkill(skill: SkillUsuario | null, aoFechar: () => void): void {
    const nome = h("input", { type: "text", value: skill?.nome ?? "", placeholder: "Despacho de encaminhamento", "aria-label": "Nome da skill" });
    const slug = h("input", { type: "text", value: skill?.slug ?? "", placeholder: "despacho-encaminhamento", spellcheck: "false", "aria-label": "Atalho" });
    const descricao = h("input", { type: "text", value: skill?.descricao ?? "", placeholder: "Quando usar: encaminhar processo a outra unidade", "aria-label": "Descri\u00E7\u00E3o" });
    const url = h("input", { type: "url", value: skill?.url ?? "", placeholder: "https://github.com/orgao/repo/blob/main/despacho.md", spellcheck: "false", "aria-label": "Arquivo .md no GitHub" });
    const texto = h("textarea", { rows: "8", spellcheck: "true", "aria-label": "Conte\u00FAdo da skill" }, skill?.texto ?? "");
    const buscar = h("button", {}, "Buscar do GitHub");
    const sincronizar = h("input", { type: "checkbox", class: "switch", ...(skill?.sincronizar ? { checked: true } : {}) });
    const linhaSync = h(
      "label",
      { class: "linha-switch" },
      sincronizar,
      h(
        "span",
        {},
        "Manter sincronizada com o GitHub",
        h("small", {}, "Desligado, o texto fica como est\u00E1 hoje. Ligado, o agente confere o arquivo a cada 6 horas e traz as mudan\u00E7as sozinho."),
      ),
    );
    const status = h("div", { class: "status" });
    const salvar = h("button", { class: "primario" }, skill ? "Salvar" : "Adicionar");

    // Guardados quando o botão busca, para a primeira sincronização não repetir o download.
    let etagBaixado = skill?.etag;
    let verificadaEmBaixado = skill?.verificadaEm;

    const ajustarSync = () => {
      const tem = /^https?:\/\//.test(url.value.trim());
      linhaSync.hidden = !tem;
      if (!tem) sincronizar.checked = false;
      if (url.value.trim() !== skill?.url) {
        etagBaixado = undefined;
        verificadaEmBaixado = undefined;
      }
    };
    url.addEventListener("input", ajustarSync);
    ajustarSync();

    // O slug acompanha o nome enquanto o usuário não o editar à mão.
    let slugManual = Boolean(skill);
    slug.addEventListener("input", () => (slugManual = true));
    nome.addEventListener("input", () => {
      if (!slugManual) slug.value = slugLivre(nome.value, this.skills, skill?.id);
    });

    buscar.addEventListener("click", async () => {
      const endereco = url.value.trim();
      if (!/^https?:\/\//.test(endereco)) {
        status.className = "status erro";
        status.textContent = "Informe o endere\u00E7o do arquivo .md.";
        return;
      }
      status.className = "status";
      status.textContent = "Buscando...";
      try {
        const r = await baixarSkillSeMudou(endereco);
        const conteudo = r?.texto ?? "";
        etagBaixado = r?.etag;
        verificadaEmBaixado = Date.now();
        texto.value = conteudo;
        if (!nome.value.trim()) {
          nome.value = decodeURIComponent(endereco.split("/").pop() ?? "").replace(/\.mdx?$/i, "").replace(/[-_]+/g, " ");
          if (!slugManual) slug.value = slugLivre(nome.value, this.skills, skill?.id);
        }
        if (!descricao.value.trim()) descricao.value = descricaoDoTexto(conteudo);
        status.className = "status ok";
        status.textContent = `${conteudo.length.toLocaleString("pt-BR")} caracteres carregados.`;
      } catch (e) {
        status.className = "status erro";
        status.textContent =
          e instanceof TypeError
            ? "N\u00E3o foi poss\u00EDvel falar com esse endere\u00E7o (rede do \u00F3rg\u00E3o ou servidor sem libera\u00E7\u00E3o para o navegador)."
            : (e as Error).message;
      }
    });

    const dlg = this.abrirModal({
      titulo: skill ? "Editar skill" : "Nova skill",
      corpo: [
        h("div", { class: "campo" }, h("label", {}, "Nome"), nome),
        h("div", { class: "campo" }, h("label", {}, "Atalho"), h("div", { class: "com-botao" }, h("span", { class: "ajuda" }, "/"), slug), h("div", { class: "ajuda" }, "\u00C9 assim que voc\u00EA chama a skill na conversa: digite / e escolha na lista.")),
        h("div", { class: "campo" }, h("label", {}, "Quando usar"), descricao, h("div", { class: "ajuda" }, "Uma linha. O agente l\u00EA isto para decidir sozinho se a skill serve ao pedido.")),
        h(
          "div",
          { class: "campo" },
          h("label", {}, "Arquivo no GitHub (opcional)"),
          h("div", { class: "com-botao" }, url, buscar),
          h("div", { class: "ajuda" }, "Link do arquivo .md em reposit\u00F3rio p\u00FAblico. O conte\u00FAdo \u00E9 copiado para c\u00E1, e \u00E9 esse texto que o agente usa."),
          linhaSync,
        ),
        h("div", { class: "campo" }, h("label", {}, "Conte\u00FAdo"), texto, h("div", { class: "ajuda" }, `Texto ou markdown, at\u00E9 ${LIMITE_SKILL.toLocaleString("pt-BR")} caracteres. Vale escrever como se fosse uma instru\u00E7\u00E3o para um colega novo.`)),
      ],
      acoes: [status, h("button", { onclick: () => dlg.close() }, "Cancelar"), salvar],
    });

    salvar.addEventListener("click", async () => {
      const erro = (t: string) => {
        status.className = "status erro";
        status.textContent = t;
      };
      const n = nome.value.trim();
      const conteudo = texto.value.trim();
      if (!n) return erro("Informe o nome da skill.");
      if (!conteudo) return erro("Informe o conte\u00FAdo (cole o texto ou busque do GitHub).");
      if (conteudo.length > LIMITE_SKILL) return erro(`O conte\u00FAdo passa de ${LIMITE_SKILL.toLocaleString("pt-BR")} caracteres.`);
      const s = slugLivre(slug.value.trim() || n, this.skills, skill?.id);
      const nova: SkillUsuario = {
        id: skill?.id ?? crypto.randomUUID(),
        nome: n,
        slug: s,
        descricao: descricao.value.trim() || descricaoDoTexto(conteudo),
        texto: conteudo,
        ...(url.value.trim() ? { url: url.value.trim(), sincronizar: sincronizar.checked, etag: etagBaixado, verificadaEm: verificadaEmBaixado } : {}),
        atualizadaEm: Date.now(),
      };
      this.skills = skill ? this.skills.map((x) => (x.id === skill.id ? nova : x)) : [...this.skills, nova];
      await guardarSkills(this.skills);
      // O motor já em curso precisa saber das skills novas (elas vão no prompt e no skill_ler).
      await this.aplicarConfig(this.config);
      aoFechar();
      dlg.close();
    });
  }

  /**
   * Traz do `storage.sync` o que foi configurado em outro computador.
   *
   * Na primeira vez é UNIÃO (ninguém tem chaves `spro_*` antes desta versão, e
   * apagar o que ainda não subiu seria perder cadastro); depois, o `sync` manda
   * — inclusive na exclusão, que é a chave deixar de existir lá.
   */
  private async aplicarSincronizacao(): Promise<void> {
    if (this.sincronizando) return;
    this.sincronizando = true;
    const marca = await chrome.storage.local.get(CHAVE_MIGRADO).catch(() => ({}) as Record<string, unknown>);
    const primeira = !marca?.[CHAVE_MIGRADO];
    aoAvisar((texto) => {
      if (this.avisouDaCota) return;
      this.avisouDaCota = true;
      this.adicionar({ tipo: "aviso", texto });
    });
    try {
      // Na trava comum com o arquivo: parte das listas da memória, e o
      // arquivo não pode estar no meio de gravar o local (ver `ligarArquivo`).
      await this.travaLocal(async () => {
        const l = await trazerDoSync(
          { skills: this.skills, colecoes: this.colecoes, regras: this.regras, memoria: this.memoria, rotinas: this.rotinas, conectores: this.conectores, fluxos: this.fluxos },
          primeira,
        );
        ({ skills: this.skills, colecoes: this.colecoes, regras: this.regras, memoria: this.memoria, rotinas: this.rotinas, conectores: this.conectores, fluxos: this.fluxos } = l);
        if (primeira) {
          void espelharConfig(this.config);
          await chrome.storage.local.set({ [CHAVE_MIGRADO]: Date.now() });
        }
        const cfg = await aplicarConfigDoSync(this.config);
        if (cfg.mudou) this.config = cfg.config;
      });
    } catch {
      /* sem sincronização (Firefox sem conta, API ausente): segue só com o local */
    } finally {
      this.sincronizando = false;
    }
    for (const redesenhar of this.redesenharConfig) redesenhar();
  }

  /** Salva a configuração e refaz o motor mantendo a conversa e os pseudônimos. */
  private async aplicarConfig(nova: Config): Promise<void> {
    this.config = nova;
    await chrome.storage.local.set({ [CHAVE_CONFIG]: this.config });
    // A configuração acompanha a conta do navegador; a chave do serviço, não.
    void espelharConfig(this.config);
    this.refazerMotor();
    void this.atualizarCambio();
    this.redesenhar();
    this.elEntrada.focus();
  }

  /** Refaz o motor com a config atual, mantendo a conversa e os pseudônimos. */
  private refazerMotor(): void {
    this.motorDesatualizado = false;
    this.motor?.parar();
    const historico = this.motor?.mensagens() ?? [];
    this.motor = this.criarMotor(Pseudonimos.importar(this.privacidade.exportar(), { nomes: this.config.nomes, cnpj: this.config.cnpj }));
    if (historico.length) this.motor.restaurar([...historico]);
  }

  // ------------------------------------------------------------- conversa

  /** `mapa`: pseudônimos restaurados da sessão; sem ele, conversa nova. */
  /**
   * Reteste de abertura: o servidor da própria máquina é ligado e desligado
   * pelo usuário, e o estado guardado ontem não diz nada sobre hoje.
   */
  private async retestarConectoresLocais(): Promise<void> {
    const antes = this.conectores;
    const depois = await retestarLocais(antes).catch(() => antes);
    // Só o que o teste mudou, sobre a lista de AGORA: o usuário pode ter
    // editado um conector enquanto o servidor não respondia.
    const mudou = depois.filter((c, i) => JSON.stringify({ ...c, verificadoEm: 0 }) !== JSON.stringify({ ...antes[i], verificadoEm: 0 }));
    if (!mudou.length) return;
    this.conectores = this.conectores.map((c) => {
      const novo = mudou.find((x) => x.id === c.id);
      return novo ? { ...c, tools: novo.tools, servidor: novo.servidor, verificadoEm: novo.verificadoEm, erro: novo.erro, semResposta: novo.semResposta } : c;
    });
    await guardarConectores(this.conectores);
  }

  /**
   * Ferramentas dos conectores MCP.
   *
   * Só a conversa principal as recebe. O agente auxiliar (`delegar`) fica de
   * fora de propósito: a interface dele não tem como pedir autorização ao
   * usuário, e ferramenta de conector pode ter efeito no mundo (abrir um
   * chamado, criar uma página) — não é leitura inofensiva como as do SEI.
   */
  private toolsDeConectores(): ReturnType<typeof toolsMcp> {
    return toolsMcp({
      arquivos: () => this.baixados.map((b) => b.caminho),
      baixados: () => this.baixados,
      conectores: () => this.conectores,
      guardar: async (c) => {
        this.conectores = this.conectores.map((x) => (x.id === c.id ? c : x));
        await guardarConectores(this.conectores);
      },
    });
  }

  private criarMotor(mapa?: Pseudonimos): Motor {
    this.privacidade = mapa ?? new Pseudonimos({ nomes: this.config.nomes, cnpj: this.config.cnpj });
    return new Motor({
      provedor: criarProvedor({ servico: this.config.servico, url: this.config.url, chave: this.config.chave, modelo: this.config.modelo, ajustes: this.config.ajustes, cache: this.config.cache }),
      tools: new RegistroTools([
        ...TOOLS_SEI,
        ...toolsMotor(this.skills),
        ...this.toolsDeConectores(),
        // Fora do agente auxiliar e das rotinas: grava no disco do usuário.
        ...toolsBaixar({ salvar: (a) => salvarNoDisco(a), registrar: async (b) => void (this.baixados = await registrarBaixado(b)) }),
      ]),
      ui: this.interfaceMotor(),
      privacidade: this.privacidade,
      sei: (op, args, sinal) => (op === "editores" ? Promise.resolve(this.ponte.editores()) : this.ponte.executar(op, args, sinal)),
      sistema: (tela, nonce) => promptSistema(tela, new Date(), this.config.instrucoes, this.skills, blocoDeMemoria(this.memoria), linhasDeConectores(this.conectores), nonce),
      delegar: (tarefa, sinal) => this.delegar(tarefa, sinal),
      // Só a conversa principal vê figuras: é ela que mostra o cartão ao usuário.
      imagens: this.servicoDeImagens(),
      lembrar: (fato) => this.lembrar(fato),
      regras: (passos) => {
        const v = avaliarRegras(this.regras, passos);
        return { bloqueios: v.bloqueios, avisos: v.avisos.map((a) => `${a.regra.mensagem} (regra "${a.regra.nome}")`), recado: recadoDoBloqueio(v) };
      },
      tela: async (sinal) => ({ ...((await this.ponte.executar("tela", {}, sinal)) as TelaAtual), editores: this.ponte.editores() }),
    });
  }

  private async enviar(texto: string): Promise<void> {
    const t = texto.trim();
    if (!t || !this.motor || this.motor.ocupado) return;
    // Enviar agora iria sem o PDF que ainda está sendo lido — e cancelaria a leitura sem avisar.
    if (this.lendoAnexo) {
      this.adicionar({ tipo: "aviso", texto: "Aguarde a leitura do PDF terminar (ou cancele) antes de enviar." });
      return;
    }
    if (this.motorDesatualizado) this.refazerMotor();
    if (!this.config.chave) {
      this.abrirConfig(true);
      return;
    }
    this.elEntrada.value = "";
    this.elEntrada.style.height = "auto";
    const emReais = (d: number) => d * (this.cambio?.valor ?? 5.5);
    const veredito = cabeMaisUma(this.config.limites, emReais(this.uso.custo), await gastoDeHoje());
    if (!veredito.permite) {
      this.adicionar({ tipo: "aviso", texto: veredito.motivo });
      return;
    }
    if (veredito.aviso) this.adicionar({ tipo: "aviso", texto: veredito.aviso });
    const custoAntes = this.uso.custo;
    const comecou = Date.now();
    this.ultimaResposta = null;
    // O arquivo anexado também é conteúdo de fora: uma planilha ou um texto
    // recebido de terceiro pode trazer instrução escondida igual a uma
    // petição. Vai varrido e dentro do envelope da conversa.
    this.motor ??= this.criarMotor();
    this.contador.anotarModelo(this.config.modelo);
    let comAnexo = t;
    if (this.anexo) {
      const varrido = varrer(aplicarModo(this.anexo).texto);
      if (varrido.achados.length) {
        this.integridadeDaConversa.push({ documento: this.anexo.nome, achados: varrido.achados });
        this.adicionar({ tipo: "aviso", texto: textoDaIntegridade(this.anexo.nome, varrido.achados) });
      }
      comAnexo = `${t}\n\n${envelopar(`anexo ${this.anexo.nome}`, varrido.texto, this.motor.envelope)}`;
    }
    // `/slug` na mensagem: o conteúdo da skill vai junto, como material de apoio.
    const usadas = skillsCitadas(t, this.skills);
    const comContexto = comSkills(comAnexo, usadas);
    this.adicionar({ tipo: "usuario", texto: this.anexo ? `${t}\n\u{1F4CE} ${this.anexo.nome}` : t });
    for (const sk of usadas) this.adicionar({ tipo: "tool", rotulo: `Skill: ${sk.nome}`, estado: "ok" });
    this.removerAnexo();
    try {
      const promessa = this.motor.enviar(comContexto);
      this.estadoEnvio();
      this.pensar(true);
      await promessa;
    } catch (e) {
      this.adicionar({ tipo: "erro", texto: (e as Error).message, diagnostico: await this.diagnosticoDoErro((e as Error).message, e) });
    } finally {
      this.pensar(false);
      this.carimbarRodada(Date.now() - comecou);
      this.estadoEnvio();
      // O teto do dia conta o que ESTA rodada custou, já em reais.
      const gasto = this.uso.custo - custoAntes;
      if (gasto > 0) await somarGastoDoDia(emReais(gasto));
      await this.salvarSessao();
    }
  }

  /**
   * Carimba a última resposta com o tempo da rodada inteira: o que o usuário
   * esperou entre mandar o pedido e poder ler, com ferramentas e tudo.
   */
  private carimbarRodada(ms: number): void {
    const resposta = this.ultimaResposta;
    this.ultimaResposta = null;
    if (!resposta || resposta.item.ms) return;
    resposta.item.ms = ms;
    (resposta.el.querySelector(".resposta-rodape") ?? resposta.el).append(carimboDeTempo(ms));
    this.rolar();
  }

  private async novaConversa(): Promise<void> {
    this.motor?.parar();
    this.pensar(false);
    this.motor = this.criarMotor();
    this.idConversa = crypto.randomUUID();
    this.arquivada = null;
    this.transcricao = [];
    this.contador.recomecar();
    this.tarefas = [];
    await chrome.storage.session?.remove(CHAVE_SESSAO).catch(() => undefined);
    this.redesenhar();
    this.elEntrada.focus();
  }

  // ------------------------------------------------------------- transcrição

  private adicionar(item: Item): HTMLElement {
    this.transcricao.push(item);
    const el = this.desenharItem(item);
    this.elConversa.querySelector(".vazio")?.remove();
    this.elConversa.append(el);
    if (this.tickPensando) this.elConversa.append(this.elPensando);
    this.rolar();
    return el;
  }

  /**
   * Reúne o que um chamado precisa saber sobre a falha.
   *
   * O que NÃO entra está documentado em `diagnostico.ts`; aqui o cuidado é um
   * só: das ferramentas vai o NOME, nunca o rótulo — "Histórico de
   * 99906.713-630.000032/2025-82" levaria o número do processo junto.
   */
  private async diagnosticoDoErro(mensagem: string, e?: unknown): Promise<Diagnostico> {
    const bruto = e as { status?: number; corpo?: string } | undefined;
    const ferramentas = this.transcricao
      .filter((x): x is Extract<Item, { tipo: "tool" }> => x.tipo === "tool" && Boolean(x.nome))
      .slice(-5)
      .map((x) => ({ nome: x.nome as string, ok: x.estado !== "falha", ...(x.estado === "falha" && x.detalhe ? { erro: x.detalhe } : {}) }));
    // "Failed to fetch" tanto é falta de rede quanto falta de autorização ao
    // endereço do serviço; conferir aqui separa os dois para quem for ajudar.
    const alvo = enderecoDoServico(this.config.servico, this.config.url);
    const acessoAoServico = await chrome.permissions
      .contains({ origins: [`${new URL(alvo).origin}/*`] })
      .catch(() => undefined);
    return montarDiagnostico({
      mensagem,
      ...(acessoAoServico === undefined ? {} : { acessoAoServico }),
      ...(bruto?.status || bruto?.corpo ? { erro: { status: bruto.status, corpo: bruto.corpo } } : {}),
      config: { servico: this.config.servico, url: this.config.url, modelo: this.config.modelo, modeloAuxiliar: this.config.modeloAuxiliar, cache: this.config.cache },
      extensao: { nome: chrome.runtime.getManifest().name, versao: chrome.runtime.getManifest().version },
      navegador: navigator.userAgent,
      uso: this.uso,
      rodadas: this.motor?.mensagens().length ?? 0,
      ...(this.tela ? { tela: { versao: this.tela.versao, processo: this.tela.processo } } : {}),
      ferramentas,
      conectores: this.conectores.map((c) => ({ nome: c.nome, ativo: c.ativo })),
      integridade: this.integridadeDaConversa.length,
    });
  }

  private desenharItem(item: Item): HTMLElement {
    if (item.tipo === "tool") {
      const acao = item.acao ? this.feitos.get(item.acao) : undefined;
      const inversa = acao && !acao.desfeita ? inversaDe(acao.tool, acao.args, acao.resultado) : null;
      const motivo = acao && !inversa && !acao.desfeita ? motivoSemDesfazer(acao.tool) : "";
      return h(
        "div",
        { class: `tool ${item.estado === "rodando" ? "" : item.estado}` },
        item.rotulo,
        item.detalhe ? h("span", { class: "detalhe" }, ` \u2014 ${item.detalhe}`) : null,
        item.desfeita ? h("span", { class: "detalhe" }, " \u2014 desfeita") : null,
        inversa
          ? h("button", { class: "plana desfazer", title: inversa.rotulo, onclick: () => void this.desfazer(acao as AcaoFeita) }, icone("voltar", 13), "Desfazer")
          : null,
        motivo ? h("span", { class: "detalhe", title: `N\u00E3o d\u00E1 para desfazer: ${motivo}` }, " \u2014 sem desfazer") : null,
      );
    }
    if (item.tipo === "agente") {
      const el = h("div", { class: "msg agente" });
      const rodape = rodapeDaResposta(item.texto);
      el.append(markdown(item.texto), rodape);
      if (item.ms) rodape.append(carimboDeTempo(item.ms));
      return el;
    }
    if (item.tipo === "aviso" || item.tipo === "decisao") return h("div", { class: "msg aviso" }, icone("alerta", 14), h("span", {}, item.texto));
    if (item.tipo === "erro") return cartaoDeErro(item.texto, item.diagnostico);
    return h("div", { class: "msg usuario" }, item.texto);
  }

  private redesenhar(): void {
    if (this.arquivada) {
      const a = this.arquivada;
      this.elConversa.replaceChildren(
        h(
          "div",
          { class: "arquivada" },
          icone("relogio", 14),
          h("span", {}, `${a.titulo} \u2014 ${new Date(a.quando).toLocaleString("pt-BR")}. S\u00F3 leitura.`),
          h("button", { class: "plana", onclick: () => void this.novaConversa() }, "Nova conversa"),
        ),
        ...(a.itens as Item[]).map((i) => this.desenharItem(i)),
      );
      this.mostrarUso();
      this.desenharTarefas();
      this.estadoEnvio();
      return;
    }
    this.elConversa.replaceChildren(...this.transcricao.map((i) => this.desenharItem(i)));
    if (!this.transcricao.length) this.elConversa.append(this.boasVindas());
    this.mostrarUso();
    this.desenharTarefas();
    this.estadoEnvio();
    // Conversa começando: o começo é o que interessa (rolar cortaria o título
    // em tela curta). Com conversa, o fim.
    if (this.transcricao.length) this.rolar();
    else requestAnimationFrame(() => (this.elConversa.scrollTop = 0));
  }

  /** Tela de início: o que o agente faz, sugestões de pedido e o aviso de privacidade. */
  private boasVindas(): HTMLElement {
    return h(
      "div",
      { class: "vazio" },
      marca(52),
      h("h2", {}, "O que fa\u00E7o no SEI por voc\u00EA?"),
      h("p", {}, "Consulto processos e documentos, altero sigilo em lote, crio e escrevo documentos, marco, anoto e atribuo processos."),
      this.config.chave
        ? h(
            "div",
            { class: "sugestoes" },
            ...sugestoesPara(this.tela).map((a) =>
              h(
                "button",
                { class: "sugestao", onclick: () => void this.enviar(a.prompt) },
                h("span", { class: "badge" }, icone("faisca", 14)),
                h("span", {}, h("b", {}, a.rotulo), h("small", {}, a.descricao)),
              ),
            ),
          )
        : h("button", { class: "primario", onclick: () => this.abrirConfig(true) }, "Configurar a chave do OpenRouter"),
      h("div", { class: "nota" }, icone("escudo", 15), h("span", {}, PRIVACIDADE_CURTA)),
      h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, RESPONSABILIDADE)),
    );
  }

  private rolar(): void {
    requestAnimationFrame(() => (this.elConversa.scrollTop = this.elConversa.scrollHeight));
  }

  private desenharTarefas(): void {
    this.elTarefas.hidden = !this.tarefas.length;
    this.elTarefas.replaceChildren(h("ul", {}, ...this.tarefas.map((t) => h("li", { class: t.estado }, t.titulo))));
  }

  // ------------------------------------------------------------- interface do motor

  private interfaceMotor(): InterfaceMotor {
    // Cada motor principal é uma fonte nova: recriá-lo não apaga o que o anterior gastou.
    const fonte = this.contador.fonte();
    return {
      aprovarExterno: (p) => cartaoExterno(p, (op) => this.abrirModal(op)),
      aprovarTransferencia: (p) => cartaoTransferencia(p, (op) => this.abrirModal(op)),
      integridade: (documento, achados) => {
        this.integridadeDaConversa.push({ documento, achados });
        this.adicionar({ tipo: "aviso", texto: textoDaIntegridade(documento, achados) });
      },
      texto: (delta) => {
        if (!this.bolhaAtual) {
          this.pensar(false);
          const el = h("div", { class: "msg agente" });
          this.elConversa.querySelector(".vazio")?.remove();
          this.elConversa.append(el);
          this.bolhaAtual = { el, texto: "", pendente: false };
        }
        const b = this.bolhaAtual;
        b.texto += delta;
        if (!b.pendente) {
          b.pendente = true;
          requestAnimationFrame(() => {
            b.pendente = false;
            // A bolha pode ter fechado entre o agendamento e agora; redesenhar
            // aqui apagaria o que veio depois (o carimbo de tempo, por exemplo).
            if (b.fechada) return;
            b.el.replaceChildren(markdown(b.texto));
            this.rolar();
          });
        }
      },
      fimDaResposta: () => {
        this.fecharBolha();
        if (this.motor?.ocupado) this.pensar(true);
        this.aoFimDoPlano?.();
        this.aoFimDoPlano = null;
      },
      toolIniciada: (id, nome, rotulo) => {
        this.fecharBolha();
        const item: Extract<Item, { tipo: "tool" }> = { tipo: "tool", rotulo, nome, estado: "rodando" };
        this.toolsEl.set(id, { el: this.adicionar(item), item });
      },
      toolTerminada: (id, ok, resumo) => {
        const t = this.toolsEl.get(id);
        if (!t) return;
        Object.assign(t.item, { estado: ok ? "ok" : "falha", detalhe: ok ? undefined : resumo });
        t.el.replaceWith(this.desenharItem(t.item));
        this.toolsEl.delete(id);
      },
      escritaFeita: (id, tool, args, resultado) => {
        const r = (resultado ?? {}) as ResultadoDeEscrita;
        if (r.aplicado === false) return;
        const t = this.toolsEl.get(id);
        this.feitos.set(id, { id, tool, rotulo: t?.item.rotulo ?? tool, args, resultado: r, quando: Date.now() });
        // Marca o item ANTES de `toolTerminada` redesenhá-lo: é assim que o
        // botão de desfazer nasce junto com a linha da ação.
        if (t) t.item.acao = id;
      },
      aprovarPlano: (p) => {
        const curso = this.rotinaEmCurso;
        // Rotina que aprova sozinha decide aqui, pelas cercas de avaliarPassos.
        // Alcance "aprovar" NÃO entra: o cartão é justamente o que ela quer.
        if (curso && curso.rotina.alcance !== "aprovar") {
          const veredito = avaliarPassos(
            curso.rotina,
            p.passos.map((passo) => ({ tool: passo.tool, efeito: passo.efeito })),
          );
          if (!veredito.aprovado) {
            this.adicionar({ tipo: "aviso", texto: `Rotina "${curso.rotina.nome}": ${veredito.motivo}` });
            return Promise.resolve({ aprovado: false, motivo: veredito.motivo });
          }
          for (const passo of p.passos) curso.escritas.push(passo.tool);
          this.adicionar({
            tipo: "aviso",
            texto: `Rotina "${curso.rotina.nome}" vai executar sem aprova\u00E7\u00E3o: ${p.passos.map((passo) => passo.rotulo).join("; ")}`,
          });
          return Promise.resolve({ aprovado: true });
        }
        return this.cartaoPlano(p);
      },
      progressoPlano: () => undefined,
      consentir: (tipo, detalhe) => this.cartaoConsentimento(tipo, detalhe),
      // Rotina roda sem ninguém olhando: imagem nenhuma sai sem o clique do usuário.
      consentirImagem: (img, o) => (this.rotinaEmCurso ? Promise.resolve("nao" as const) : this.cartaoImagem(img, o)),
      perguntar: (pergunta, opcoes) => this.cartaoPergunta(pergunta, opcoes),
      tarefas: (lista) => {
        this.tarefas = lista;
        this.desenharTarefas();
      },
      uso: (u) => {
        fonte(u);
        this.mostrarUso();
      },
      aviso: (t) => (this.fecharBolha(), void this.adicionar({ tipo: "aviso", texto: t })),
    };
  }

  private fecharBolha(): void {
    if (!this.bolhaAtual) return;
    const b = this.bolhaAtual;
    this.bolhaAtual = null;
    b.fechada = true;
    if (b.texto.trim()) {
      const item: ItemAgente = { tipo: "agente", texto: b.texto };
      this.transcricao.push(item);
      b.el.replaceChildren(markdown(b.texto), rodapeDaResposta(b.texto));
      this.ultimaResposta = { el: b.el, item };
    } else b.el.remove();
  }

  /** Fecha as ações de um cartão decidido, deixando no lugar o que foi decidido. */
  private encerrarCartao(cartao: HTMLElement, seletor: string, texto: string, sim: boolean): HTMLElement {
    this.pensar(Boolean(this.motor?.ocupado));
    const aviso = h("div", { class: "decidido" }, icone(sim ? "check" : "fechar", 14), h("span", {}, texto));
    cartao.querySelector(seletor)?.replaceWith(aviso);
    this.transcricao.push({ tipo: "decisao", texto });
    return aviso;
  }

  private cartaoPlano(p: PlanoPrevisto): Promise<DecisaoPlano> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const irreversivel = p.passos.some((x) => x.efeito === "irreversivel");
      const confirma = h("input", { type: "checkbox" });
      const motivo = h("textarea", { rows: "2", placeholder: "O que ajustar? (opcional)", hidden: true });
      const aprovar = h("button", { class: "primario" }, "Aprovar e executar");
      const recusar = h("button", {}, "Recusar");
      // Assinatura: cargo e senha digitados aqui; a senha vai direto para a aba e é descartada.
      const assinatura = p.passos.some((x) => x.efeito === "assinatura");
      const cargos = [...new Set(p.passos.flatMap((x) => x.previa.flatMap((i) => i.cargos ?? [])))];
      // Sem lista (documento criado no mesmo plano): cargo digitado; o núcleo casa com a lista do SEI.
      const selCargo: HTMLSelectElement | HTMLInputElement = cargos.length
        ? h("select", { "aria-label": "Cargo ou fun\u00E7\u00E3o" }, ...cargos.map((c) => h("option", { value: c }, c)))
        : h("input", { type: "text", placeholder: "Cargo ou fun\u00E7\u00E3o (como aparece no SEI)", "aria-label": "Cargo ou fun\u00E7\u00E3o" });
      const senha = h("input", { type: "password", placeholder: "Senha do SEI", autocomplete: "off", "aria-label": "Senha do SEI" });
      if (assinatura) {
        void chrome.storage.local.get("agenteIA_cargo").then((v) => {
          if (v?.agenteIA_cargo && (!cargos.length || cargos.includes(v.agenteIA_cargo))) selCargo.value = v.agenteIA_cargo;
          podeAprovar();
        });
      }
      const podeAprovar = () => (aprovar.disabled = (irreversivel && !confirma.checked) || (assinatura && (!senha.value || !selCargo.value.trim())));
      selCargo.addEventListener("input", podeAprovar);
      confirma.addEventListener("change", podeAprovar);
      senha.addEventListener("input", podeAprovar);
      senha.addEventListener("keydown", (ev) => ev.key === "Enter" && !aprovar.disabled && aprovar.click());
      podeAprovar();
      const total = p.passos.reduce((n, x) => n + x.previa.length, 0);
      const cartao = h(
        "div",
        { class: "cartao plano" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("lapis", 15)), h("h4", {}, "Aprovar altera\u00E7\u00F5es no SEI")),
        p.passos.length > 1 || p.objetivo !== p.passos[0]?.rotulo ? h("div", { class: "sub" }, p.objetivo) : null,
        ...(p.avisos ?? []).map((a) => h("div", { class: "nota atencao" }, icone("alerta", 15), h("span", {}, a))),
        // Quem aprova precisa saber que a proposta veio depois de ler um
        // documento que trazia instrução escondida.
        ...(this.integridadeDaConversa.length
          ? [
              h(
                "div",
                { class: "nota atencao" },
                icone("escudo", 15),
                h(
                  "span",
                  {},
                  `Aten\u00E7\u00E3o: ${this.integridadeDaConversa.length === 1 ? "um documento lido nesta conversa trazia" : `${this.integridadeDaConversa.length} documentos lidos nesta conversa traziam`} conte\u00FAdo dirigido a IA (${this.integridadeDaConversa.map((x) => x.documento).join(", ")}). As instru\u00E7\u00F5es foram ignoradas, mas confira se o que est\u00E1 sendo proposto \u00E9 mesmo o que voc\u00EA pediu.`,
                ),
              ),
            ]
          : []),
        ...p.passos.map((passo, i) => {
          const linhas = passo.previa.slice(0, 15).map((item) =>
            item.erro
              ? h("tr", {}, h("td", { class: "alvo" }, item.alvo || "\u2014"), h("td", { class: "erroItem", colspan: "2" }, item.erro))
              : item.mudancas.length
                ? h(
                    "tr",
                    {},
                    h("td", { class: "alvo" }, item.alvo),
                    h(
                      "td",
                      {},
                      ...item.mudancas.map((m) =>
                        h("div", {}, `${m.campo}: `, m.antes ? h("span", { class: "antes" }, m.antes) : null, m.antes ? " \u2192 " : "", h("span", { class: "depois" }, m.depois || "(vazio)")),
                      ),
                    ),
                  )
                : h("tr", {}, h("td", { class: "alvo" }, item.alvo), h("td", {}, item.resumo || "Nada muda")),
          );
          return h(
            "div",
            { class: "passo" },
            h("div", { class: "titulo" }, `${p.passos.length > 1 ? `${i + 1}. ` : ""}${passo.rotulo}`, passo.efeito === "irreversivel" ? h("span", { class: "selo irrev" }, "irrevers\u00EDvel") : null),
            passo.dependente ? h("div", { class: "mais" }, "Depende do resultado do passo anterior; a pr\u00E9via exata sai na execu\u00E7\u00E3o.") : null,
            linhas.length ? h("table", { class: "previa" }, ...linhas) : null,
            passo.previa.length > 15 ? h("div", { class: "mais" }, `e mais ${passo.previa.length - 15} item(ns).`) : null,
          );
        }),
        total > 1 ? h("div", { class: "mais" }, `${total} itens no total.`) : null,
        irreversivel ? h("label", { class: "check" }, confirma, " Entendo que esta a\u00E7\u00E3o n\u00E3o pode ser desfeita.") : null,
        assinatura
          ? h(
              "div",
              { class: "assinatura" },
              h("div", { class: "sub" }, "Assinar como o usu\u00E1rio logado. A senha n\u00E3o \u00E9 enviada ao modelo de IA nem guardada."),
              selCargo,
              senha,
            )
          : null,
        motivo,
        h("div", { class: "acoes" }, aprovar, recusar),
      );
      const decidir = (d: DecisaoPlano, texto: string) => {
        const aviso = this.encerrarCartao(cartao, ".acoes", texto, Boolean(d.aprovado));
        this.aoFimDoPlano = () => d.aprovado && aviso.replaceChildren(icone("check", 14), h("span", {}, "Aprovado e executado."));
        motivo.hidden = true;
        resolver(d);
      };
      aprovar.addEventListener("click", () => {
        const credencial = assinatura ? { cargo: selCargo.value, senha: senha.value } : undefined;
        senha.value = "";
        if (credencial) void chrome.storage.local.set({ agenteIA_cargo: credencial.cargo });
        decidir({ aprovado: true, assinatura: credencial }, "Aprovado. Executando...");
      });
      recusar.addEventListener("click", () => {
        if (motivo.hidden) {
          motivo.hidden = false;
          recusar.textContent = "Confirmar recusa";
          motivo.focus();
          return;
        }
        decidir({ aprovado: false, motivo: motivo.value.trim() || undefined }, `Recusado${motivo.value.trim() ? `: ${motivo.value.trim()}` : "."}`);
      });
      this.elConversa.append(cartao);
      this.rolar();
    });
  }

  private cartaoConsentimento(tipo: "restrito" | "conector", detalhe: string): Promise<boolean> {
    const titulo = tipo === "conector" ? "Enviar dados a um conector" : "Documento restrito";
    const explicacao =
      tipo === "conector"
        ? "O conte\u00FAdo deste pedido vai sair do seu navegador para o servidor do conector, que \u00E9 um servi\u00E7o de terceiro (dados pessoais v\u00E3o mascarados). Permitir?"
        : "O agente precisa enviar o conte\u00FAdo de documentos RESTRITOS ao modelo de IA (com dados pessoais mascarados). Permitir nesta conversa?";
    const feito = tipo === "conector" ? "Envio ao conector permitido." : "Leitura de restritos permitida nesta conversa.";
    const negado = tipo === "conector" ? "Envio ao conector n\u00E3o permitido." : "Leitura de restritos n\u00E3o permitida.";
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const cartao = h(
        "div",
        { class: "cartao consentimento" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("alerta", 15)), h("h4", {}, titulo)),
        h("div", { class: "sub" }, detalhe),
        h("div", {}, explicacao),
      );
      const decidir = (sim: boolean) => {
        this.encerrarCartao(cartao, ".acoes", sim ? feito : negado, sim);
        resolver(sim);
      };
      cartao.append(h("div", { class: "acoes" }, h("button", { class: "primario", onclick: () => decidir(true) }, "Permitir"), h("button", { onclick: () => decidir(false) }, "N\u00E3o permitir")));
      this.elConversa.append(cartao);
      this.rolar();
    });
  }

  /** Miniatura da figura antes de ela ir ao serviço de IA (`ver_imagem`). */
  private cartaoImagem(img: ImagemPronta, o: { restrito: boolean }): Promise<"esta" | "todas" | "nao"> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const cartao = h(
        "div",
        { class: "cartao consentimento imagem" },
        h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("alerta", 15)), h("h4", {}, "Enviar imagem ao servi\u00E7o de IA")),
        h("div", { class: "sub" }, img.descricao),
        h("img", { class: "miniatura", src: img.dataUrl, alt: `Miniatura: ${img.descricao}` }),
        h("div", {}, "A imagem vai ao servi\u00E7o de IA como est\u00E1: dados pessoais nela n\u00E3o s\u00E3o mascarados."),
      );
      const decidir = (r: "esta" | "todas" | "nao") => {
        const texto = r === "nao" ? "Imagem n\u00E3o enviada." : r === "todas" ? "Imagens desta conversa liberadas." : "Imagem enviada.";
        this.encerrarCartao(cartao, ".acoes", texto, r !== "nao");
        resolver(r);
      };
      cartao.append(
        h(
          "div",
          { class: "acoes" },
          h("button", { class: "primario", onclick: () => decidir("esta") }, "Enviar esta imagem"),
          // Documento restrito pergunta a cada imagem: o cartão nem oferece "todas".
          ...(o.restrito ? [] : [h("button", { onclick: () => decidir("todas") }, "Enviar as imagens desta conversa")]),
          h("button", { onclick: () => decidir("nao") }, "N\u00E3o enviar"),
        ),
      );
      this.elConversa.append(cartao);
      this.rolar();
    });
  }

  /**
   * Recorte e visão para o `ver_imagem`. O modelo que olha sai de
   * `modeloDeVisao`; o gasto entra no contador da conversa como fonte própria.
   */
  private servicoDeImagens(): ServicoDeImagens {
    const escolher = async () => {
      const aux = this.config.modeloAuxiliar?.trim() || undefined;
      const principal = this.config.modelo || MODELO_PADRAO;
      const [ea, ep] = await Promise.all([
        aux ? aceitaImagem({ servico: this.config.servico, modelo: aux }) : Promise.resolve(null),
        aceitaImagem({ servico: this.config.servico, modelo: principal }),
      ]);
      return modeloDeVisao({ modelo: this.config.modelo, ...(aux ? { modeloAuxiliar: aux } : {}) }, ea, ep);
    };
    const olhar = async (modelo: string, img: ImagemPronta, pedido: string, sinal: AbortSignal): Promise<string> => {
      const fonte = this.contador.fonte();
      const provedor = criarProvedor({ servico: this.config.servico, url: this.config.url, chave: this.config.chave, modelo, ajustes: this.config.ajustes, cache: false });
      const r = await provedor.conversar(
        {
          mensagens: [
            { role: "system", content: PROMPT_VISAO },
            { role: "user", content: [{ type: "text", text: pedido }, { type: "image_url", image_url: { url: img.dataUrl } }] },
          ],
          tools: [],
        },
        sinal,
        () => undefined,
      );
      this.contador.anotarModelo(provedor.modelo);
      if (r.uso) {
        fonte(r.uso);
        this.mostrarUso();
      }
      return r.texto.trim() || "O modelo n\u00E3o descreveu a imagem.";
    };
    return {
      enxerga: async () => (await escolher()).enxerga,
      preparar: (conteudo, figura, rotulo) => prepararImagem(conteudo, figura, rotulo),
      descrever: async (img, pedido, sinal) => {
        const e = await escolher();
        try {
          return await olhar(e.primeiro, img, pedido, sinal);
        } catch (erro) {
          // Serviço sem catálogo: o auxiliar recusou a imagem; o principal tenta uma vez.
          if (e.reserva && erro instanceof ErroProvedor && ehErroDeImagem(erro.status, erro.corpo)) return olhar(e.reserva, img, pedido, sinal);
          throw erro;
        }
      },
    };
  }

  private cartaoPergunta(pergunta: string, opcoes: string[]): Promise<string> {
    this.fecharBolha();
    this.pensar(false);
    return new Promise((resolver) => {
      const livre = h("input", { type: "text", placeholder: "Outra resposta..." });
      const cartao = h("div", { class: "cartao" }, h("div", { class: "cartao-topo" }, h("span", { class: "badge" }, icone("balao", 15)), h("h4", {}, pergunta)));
      const decidir = (r: string) => {
        if (!r.trim()) return;
        this.encerrarCartao(cartao, ".opcoes-pergunta", `${pergunta} \u2192 ${r}`, true);
        resolver(r);
      };
      livre.addEventListener("keydown", (ev) => ev.key === "Enter" && decidir(livre.value));
      cartao.append(h("div", { class: "opcoes-pergunta" }, ...opcoes.map((o) => h("button", { onclick: () => decidir(o) }, o)), livre));
      this.elConversa.append(cartao);
      this.rolar();
      livre.focus();
    });
  }

  /** Mostra o chip do anexo; "Cortar em 60 mil" troca o modo e redesenha. */
  private mostrarAnexo(a: Anexo): void {
    this.anexo = a;
    this.elAnexo.hidden = false;
    this.elAnexo.replaceChildren(
      chipDoAnexo(a, {
        remover: () => this.removerAnexo(),
        cortar: () => this.anexo && this.mostrarAnexo({ ...this.anexo, modo: "cortado" }),
      }),
    );
  }

  /** Tira o anexo e cancela a leitura de PDF em curso, se houver. */
  private removerAnexo(): void {
    this.geracaoAnexo += 1;
    this.lendoAnexo = false;
    this.anexo = null;
    this.elAnexo.hidden = true;
    this.elAnexo.replaceChildren();
  }

  // ------------------------------------------------------------- sessão

  /**
   * Grava a transcrição no histórico do navegador. Só ela: o histórico do
   * modelo e o mapa de pseudônimos ficam na sessão, que morre com o navegador.
   */
  private async guardarConversa(): Promise<void> {
    if (!this.config.guardar || this.arquivada || !this.transcricao.length) return;
    const primeira = this.transcricao.find((i) => i.tipo === "usuario");
    const titulo = primeira && "texto" in primeira ? primeira.texto.replace(/\s+/g, " ").slice(0, 70) : "Conversa";
    await historico
      .salvar({
        id: this.idConversa,
        titulo,
        quando: Date.now(),
        host: this.ponte.atual()?.host,
        uso: this.uso,
        modelos: this.contador.modelos,
        // A cotação do dia da conversa: a lista mostra em reais o que se pagou então.
        ...(this.config.reais && this.cambio ? { cotacao: this.cambio.valor } : {}),
        mensagens: this.transcricao.filter((i) => i.tipo === "usuario" || i.tipo === "agente").length,
        itens: this.transcricao,
      })
      .then(() => this.agendarArquivo())
      .catch(() => undefined);
  }

  private async salvarSessao(): Promise<void> {
    await this.guardarConversa();
    if (!this.motor) return;
    const dados = { historico: this.motor.mensagens(), transcricao: this.transcricao, uso: this.uso, modelos: this.contador.modelos, pseudonimos: this.privacidade.exportar(), tarefas: this.tarefas };
    // storage.session não existe em navegadores antigos (Firefox < 115): a conversa só não sobrevive à recarga.
    await chrome.storage.session?.set({ [CHAVE_SESSAO]: dados }).catch(() => undefined);
  }

  private async restaurarSessao(): Promise<void> {
    const bruto: Record<string, unknown> = (await chrome.storage.session?.get(CHAVE_SESSAO).catch(() => ({}))) ?? {};
    const d = bruto[CHAVE_SESSAO] as
      | { historico: Mensagem[]; transcricao: Item[]; uso: Uso; modelos?: string[]; pseudonimos: ReturnType<Pseudonimos["exportar"]>; tarefas: Tarefa[] }
      | undefined;
    if (!d || !this.motor || this.transcricao.length) return;
    this.motor = this.criarMotor(Pseudonimos.importar(d.pseudonimos, { nomes: this.config.nomes, cnpj: this.config.cnpj }));
    this.motor.restaurar(d.historico);
    this.transcricao = d.transcricao.map((i) => (i.tipo === "tool" && i.estado === "rodando" ? { ...i, estado: "falha", detalhe: "interrompido" } : i));
    this.contador.recomecar(d.uso, d.modelos);
    this.tarefas = d.tarefas ?? [];
  }

}

const app = new App();
// Diagnóstico: acessível só no console desta página da extensão (o SEI não a enxerga).
Object.defineProperty(window, "agenteIA", { value: app });
Object.defineProperty(window, "agenteIADiag", { value: { extrairTextoPdf, historico, inversaDe, markdown } });
void app.iniciar();
