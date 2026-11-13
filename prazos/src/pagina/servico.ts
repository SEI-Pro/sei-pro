/**
 * Orquestra o prazo de um processo: lê (nativo + marcador, fundidos), grava segundo o destino que
 * `decidir` escolheu, remove e conclui. Tudo o que ele grava é lembrado numa sobreposição por
 * processo, para a coluna mostrar o resultado na hora, sem recarregar a caixa; o ícone do próprio
 * SEI na linha é trocado pelo da resposta (que já vem com a caixa atualizada).
 */
import type { DataISO } from '../../../sei-comum/src/datas/dias';
import type { Http } from '../../../sei-nucleo/src/sessao/http';
import { ehErroSei } from '../../../sei-nucleo/src/sessao/erros';
import { fundir } from '../modelo/fusao';
import { formatarMarcador } from '../modelo/marcador';
import type { PrazoMarcador, PrazoNativo, PrazoProcesso } from '../modelo/tipos';
import { concluirPrazo, definirPrazo, esquecerAcao, excluirPrazo, obterAcaoDefinir } from '../nativo/formulario';
import { LINK_NATIVO, lerPrazosDaCaixa, temControleNativo } from '../nativo/leitura';
import { type Destino, decidir, type Entrada } from './destino';
import { lerPrazoDaLinha, protocoloDaLinha, TABELAS } from './linha';

/** Grava o texto do marcador do processo (`definirMarcador` do núcleo, ou um falso nos testes). */
export type EscreverMarcador = (protocolo: string, marcador: string, texto: string) => Promise<void>;

export interface DepsServico {
  doc: Document;
  url: string;
  http: Http;
  escreverMarcador: EscreverMarcador;
  hoje: () => DataISO;
  feriados?: (hoje: DataISO) => ReadonlySet<DataISO>;
}

export interface Falha {
  id: string;
  protocolo: string;
  erro: string;
}

export interface Resultado {
  gravados: string[];
  falhas: Falha[];
  /** Quando a regra recusou o pedido inteiro (campo faltando, por exemplo). */
  erro?: string;
}

interface Sobreposicao {
  nativo?: PrazoNativo | null;
  marcador?: PrazoMarcador | null;
  /** O marcador que este módulo gravou (id ou nome): a linha só mostra o novo marcador depois de recarregar. */
  nomeMarcador?: string;
}

const mensagemDe = (e: unknown) => (ehErroSei(e) ? e.message : e instanceof Error ? e.message : String(e));

export class ServicoPrazos {
  private readonly sobre = new Map<string, Sobreposicao>();
  private readonly ouvintes = new Set<() => void>();

  constructor(private readonly d: DepsServico) {}

  nativoDisponivel(): boolean {
    return temControleNativo(this.d.doc);
  }

  aoMudar(fn: () => void): () => void {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }

  private linha(id: string): Element | null {
    return this.d.doc.querySelector(`tr#P${id}`);
  }

  /** Prazo atual do processo: o que a linha mostra, com o que este módulo gravou por cima. */
  ler(id: string): PrazoProcesso | null {
    const tr = this.linha(id);
    const lido = tr ? lerPrazoDaLinha(tr) : { nativo: null, marcador: null };
    const s = this.sobre.get(id);
    return fundir(id, s?.nativo !== undefined ? s.nativo : lido.nativo, s?.marcador !== undefined ? s.marcador : lido.marcador);
  }

  /** O marcador (nome ou id) que hoje traz o prazo, se houver. */
  marcadorDoPrazo(id: string): string | undefined {
    const s = this.sobre.get(id);
    if (s?.marcador !== undefined) return s.marcador ? s.nomeMarcador : undefined;
    const tr = this.linha(id);
    return tr ? lerPrazoDaLinha(tr).nomeMarcador : undefined;
  }

  decidir(e: Entrada): Destino {
    const hoje = this.d.hoje();
    return decidir(e, this.nativoDisponivel(), hoje, this.d.feriados?.(hoje));
  }

  private protocolo(id: string): string {
    const tr = this.linha(id);
    return (tr && protocoloDaLinha(tr)) || id;
  }

  private notificar(): void {
    for (const fn of this.ouvintes) fn();
  }

  /** Troca o ícone do SEI na linha pelo da resposta (que traz a caixa já atualizada). */
  private sincronizarIcone(id: string, respostaDoc: Document): void {
    const novo = respostaDoc.querySelector(`tr#P${id} ${LINK_NATIVO}`);
    for (const tr of this.d.doc.querySelectorAll(`tr#P${id}`)) {
      const velho = tr.querySelector(LINK_NATIVO);
      if (novo) {
        const copia = this.d.doc.importNode(novo, true);
        if (velho) velho.replaceWith(copia);
        else (tr.querySelectorAll('td')[1] ?? tr).append(copia);
      } else velho?.remove();
    }
  }

  private async acao(id: string): Promise<string> {
    return obterAcaoDefinir(this.d.http, this.d.doc, this.d.url, id);
  }

  async salvar(e: Entrada, progresso: (feito: number, total: number) => void = () => {}): Promise<Resultado> {
    const dest = this.decidir(e);
    const r: Resultado = { gravados: [], falhas: [] };
    if (dest.erro) return { ...r, erro: dest.erro };
    const falhar = (id: string, erro: string) => r.falhas.push({ id, protocolo: this.protocolo(id), erro });
    const datas = new Map<string, DataISO>();
    let ids = e.ids;
    let feito = 0;
    progresso(0, ids.length);

    if (dest.nativo) {
      try {
        const acao = await this.acao(ids[0]!);
        const env = await definirPrazo(this.d.http, acao, ids, e.contagem === 'data' ? { tipo: 'data', data: e.data! } : { tipo: 'dias', dias: e.dias!, uteis: !!e.uteis });
        if (!env.ok) return { ...r, erro: env.erro };
        const lidos = lerPrazosDaCaixa(env.pagina.doc);
        for (const id of ids) {
          const n = lidos.get(id);
          if (n) {
            this.sobre.set(id, { ...this.sobre.get(id), nativo: n });
            datas.set(id, n.data);
          } else if (e.data) datas.set(id, e.data);
          this.sincronizarIcone(id, env.pagina.doc);
        }
        // Dias: se algum processo ficou fora da primeira página da resposta, o servidor calculou e nós não sabemos a data.
        ids = ids.filter((id) => {
          if (dest.marcador && !datas.has(id)) {
            falhar(id, 'O SEI gravou o prazo, mas a data não veio na resposta; o marcador não foi atualizado.');
            return false;
          }
          return true;
        });
        if (!dest.marcador) for (const id of ids) r.gravados.push(id);
      } catch (erro) {
        esquecerAcao(this.d.doc);
        return { ...r, erro: mensagemDe(erro) };
      }
    }

    if (dest.marcador) {
      for (const id of ids) {
        const data = datas.get(id) ?? e.data ?? dest.dataCalculada;
        if (!data) { falhar(id, 'Sem data para gravar no marcador.'); continue; }
        try {
          const texto = formatarMarcador({ vencimento: e.vencimento, data, hora: e.hora?.trim() || undefined, texto: e.texto });
          await this.d.escreverMarcador(this.protocolo(id), e.marcador!, texto);
          this.sobre.set(id, { ...this.sobre.get(id), nomeMarcador: e.marcador, marcador: { data, hora: e.hora?.trim() || undefined, vencimento: e.vencimento, texto: (e.texto ?? '').trim() } });
          r.gravados.push(id);
        } catch (erro) {
          falhar(id, mensagemDe(erro));
        }
        progresso(++feito, ids.length);
      }
    }
    progresso(ids.length, ids.length);
    this.notificar();
    return r;
  }

  /** Tira o prazo: exclui o nativo e limpa o texto do marcador que o trazia (o marcador continua no processo). */
  async remover(ids: string[], progresso: (feito: number, total: number) => void = () => {}): Promise<Resultado> {
    const r: Resultado = { gravados: [], falhas: [] };
    let feito = 0;
    for (const id of ids) {
      const atual = this.ler(id);
      const tr = this.linha(id);
      const lido = tr ? lerPrazoDaLinha(tr) : null;
      try {
        const s = this.sobre.get(id);
        const nativo = s?.nativo !== undefined ? s.nativo : lido?.nativo;
        if (nativo) {
          const env = await excluirPrazo(this.d.http, nativo.link);
          if (!env.ok) throw new Error(env.erro);
          this.sobre.set(id, { ...this.sobre.get(id), nativo: null });
          this.sincronizarIcone(id, env.pagina.doc);
        }
        const temTexto = s?.marcador !== undefined ? s.marcador : lido?.marcador;
        const nome = this.marcadorDoPrazo(id);
        if (nome && temTexto) {
          await this.d.escreverMarcador(this.protocolo(id), nome, '');
          this.sobre.set(id, { ...this.sobre.get(id), marcador: null, nomeMarcador: undefined });
        }
        if (atual) r.gravados.push(id);
      } catch (erro) {
        r.falhas.push({ id, protocolo: this.protocolo(id), erro: mensagemDe(erro) });
      }
      progresso(++feito, ids.length);
    }
    this.notificar();
    return r;
  }

  /** Conclui o prazo nativo dos processos que o têm (o SEI guarda a data da conclusão). */
  async concluir(ids: string[]): Promise<Resultado> {
    const r: Resultado = { gravados: [], falhas: [] };
    const alvo = ids.filter((id) => this.ler(id)?.idControlePrazo);
    if (alvo.length === 0) return { ...r, erro: 'Nenhum dos processos tem prazo no controle do SEI para concluir.' };
    try {
      const env = await concluirPrazo(this.d.http, await this.acao(alvo[0]!), alvo);
      if (!env.ok) return { ...r, erro: env.erro };
      const lidos = lerPrazosDaCaixa(env.pagina.doc);
      for (const id of alvo) {
        const n = lidos.get(id);
        if (n) this.sobre.set(id, { ...this.sobre.get(id), nativo: n });
        this.sincronizarIcone(id, env.pagina.doc);
        r.gravados.push(id);
      }
    } catch (erro) {
      esquecerAcao(this.d.doc);
      return { ...r, erro: mensagemDe(erro) };
    }
    this.notificar();
    return r;
  }
}

export { TABELAS };
