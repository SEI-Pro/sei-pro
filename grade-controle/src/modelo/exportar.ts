/** Linhas do CSV da visão atual. A neutralização de fórmulas é do `gerarCsv` (sei-comum). */
import { formatarData } from '../../../sei-comum/src/datas/dias';
import type { Ctx } from './contexto';
import { diasNaCaixa, diasParado, resumoDoPrazo } from './derivados';
import { ultimoMarcador } from './grupos';
import { rotuloIdade } from './idade';
import { type Coluna, type Processo, ROTULO_COLUNA } from './tipos';

export function sinaisDe(p: Processo): string[] {
  const s: string[] = [];
  if (p.sigiloso) s.push('Sigiloso');
  if (p.naoVisualizado) s.push('Não visualizado');
  if (p.documentoNovo) s.push('Documento novo');
  if (p.urgente) s.push('Urgente');
  if (p.trancado) s.push('Trancado');
  if (p.acompanhamentoEspecial) s.push(p.acompanhamentoGrupo ? `Acompanhamento especial (${p.acompanhamentoGrupo})` : 'Acompanhamento especial');
  for (const r of p.retornos) s.push(`${r.tipo === 'aguardando' ? 'Aguardando retorno' : 'Retorno programado'}${r.atrasado ? ' (atrasado)' : ''}`);
  return s;
}

export function textoPrazo(p: Processo, ctx: Ctx): string {
  const r = resumoDoPrazo(p, ctx);
  if (!p.prazo || !r) return '';
  const data = p.prazo.vencimento ?? p.prazo.inicio;
  return `${data ? formatarData(data) : ''}${p.prazo.hora ? ` ${p.prazo.hora}` : ''} (${r.texto})`.trim();
}

const celula = (p: Processo, c: Coluna, ctx: Ctx): string => {
  switch (c) {
    case 'processo':
      return p.protocolo;
    case 'tipo':
      return p.tipo;
    case 'especificacao':
      return p.especificacao;
    case 'responsavel':
      return p.atribuicao ? (p.atribuicao.nome === p.atribuicao.sigla ? p.atribuicao.sigla : `${p.atribuicao.nome} (${p.atribuicao.sigla})`) : '';
    case 'marcadores':
      return p.marcadores.map((m) => (m.texto ? `${m.nome}: ${m.texto}` : m.nome)).join('; ');
    case 'prazo':
      return textoPrazo(p, ctx);
    case 'anotacao':
      return p.anotacao?.texto.replace(/\s*\n\s*/g, ' / ') ?? '';
    case 'caixa':
      return rotuloIdade(diasNaCaixa(p, ctx));
    case 'parado':
      return rotuloIdade(diasParado(p, ctx));
    case 'sinais':
      return sinaisDe(p).join('; ');
  }
};

export function linhasCsv(processos: Processo[], colunas: Coluna[], ctx: Ctx): string[][] {
  return [colunas.map((c) => ROTULO_COLUNA[c]), ...processos.map((p) => colunas.map((c) => celula(p, c, ctx)))];
}

export const nomeArquivo = (hoje: string): string => `processos-${hoje}.csv`;

/** Colunas na ordem e nomes exatos do `ListaProcessos_SEIPro_*.csv` da visão nativa (compatível com dashboards externos). */
export const CABECALHO_CSV_LEGADO = [
  'ID',
  'Protocolo',
  'Link_Permanente',
  'Atribuicao',
  'Etiqueta',
  'Etiqueta_Descricao',
  'Anotacao',
  'Anotacao_Responsavel',
  'Ponto_Controle',
  'Especificacao',
  'Tipo',
  'Data_Autuacao',
  'Data_Autuacao_Descricao',
  'Data_Recebimento',
  'Data_Recebimento_Descricao',
  'Data_Envio',
  'Data_Envio_Descricao',
  'Unidade_Envio',
  'Documento_Incluido',
  'Observacoes',
  'Acompanhamento_Especial',
] as const;

export interface DadosRecebimentoPro {
  id_procedimento?: string;
  datageracao?: string;
  descricaodatageracao?: string;
  datahora?: string;
  descricao?: string;
  datesend?: string;
  descricaosend?: string;
  unidadesend?: string | null;
  observacoes?: Array<{ unidade?: string; observacao?: string }> | string;
  acompanhamentoesp?: string | null;
}

export interface OpcoesCsvLegado {
  /** Base da URL do SEI (ex.: `https://sei.org.br/sei/controlador.php`). */
  urlBase?: string;
  /** Cache `configDataRecebimentoPro` do localStorage do SEI Pro (por `id_procedimento`). */
  recebimentos?: ReadonlyMap<string, DadosRecebimentoPro>;
}

/** Lê `configDataRecebimentoPro` do localStorage do SEI (usado pela exportação nativa para datas/descrições). */
export function lerCacheRecebimentoPro(storage?: Pick<Storage, 'getItem'> | null): Map<string, DadosRecebimentoPro> {
  const mapa = new Map<string, DadosRecebimentoPro>();
  if (!storage) return mapa;
  try {
    const bruto = storage.getItem('configDataRecebimentoPro');
    if (!bruto) return mapa;
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return mapa;
    for (const item of lista) {
      if (item && typeof item === 'object' && item.id_procedimento) mapa.set(String(item.id_procedimento), item as DadosRecebimentoPro);
    }
  } catch {
    /* storage indisponível ou corrompido */
  }
  return mapa;
}

function formatarDataHoraLegado(isoOuSql?: string): string {
  if (!isoOuSql) return '-';
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/.exec(isoOuSql.trim());
  if (!m) return isoOuSql.trim() || '-';
  const hora = m[4] ? (m[4].length === 5 ? `${m[4]}:00` : m[4]) : '00:00:00';
  return `${m[3]}/${m[2]}/${m[1]} ${hora}`;
}

const limparCampoLegado = (v: string | undefined | null, padrao = '-'): string => {
  const s = (v ?? '').replace(/;/g, '').trim();
  return s || padrao;
};

function formatarObservacoes(info?: DadosRecebimentoPro, fallback?: string): string {
  if (info?.observacoes && Array.isArray(info.observacoes)) {
    const partes = info.observacoes
      .filter((v) => v && v.unidade)
      .map((v) => `${v.unidade}: ${v.observacao ?? ''}`);
    if (partes.length) return limparCampoLegado(partes.join(','));
  }
  if (typeof info?.observacoes === 'string' && info.observacoes.trim()) return limparCampoLegado(info.observacoes);
  return limparCampoLegado(fallback);
}

/** Monta as 21 colunas no mesmo formato, ordem e nomes do CSV da visão nativa (`ListaProcessos_SEIPro`). */
export function linhasCsvLegado(processos: Processo[], ctx: Ctx, opcoes: OpcoesCsvLegado = {}): string[][] {
  const base = opcoes.urlBase ?? '';
  const mapa = opcoes.recebimentos;
  return [
    [...CABECALHO_CSV_LEGADO],
    ...processos.map((p) => {
      const mk = ultimoMarcador(p);
      const info = mapa?.get(p.id);
      const and = ctx.andamentos?.[p.id];
      const linkPerm = base ? `${base}?acao=procedimento_trabalhar&id_procedimento=${p.id}` : (p.link ?? '-');
      const dataAutuacao = info?.datageracao ? formatarDataHoraLegado(info.datageracao) : (and?.autuacao ? formatarDataHoraLegado(and.autuacao) : '-');
      const dataReceb = info?.datahora ? formatarDataHoraLegado(info.datahora) : (and?.recebimento ? formatarDataHoraLegado(and.recebimento) : '-');
      const dataEnvio = info?.datesend ? formatarDataHoraLegado(info.datesend) : (and?.envio ? formatarDataHoraLegado(and.envio) : '-');
      const unidadeEnvio = limparCampoLegado(info?.unidadesend ?? and?.unidadeEnvio);
      const acomp = limparCampoLegado(info?.acompanhamentoesp ?? p.acompanhamentoGrupo);
      return [
        p.id,
        p.protocolo,
        linkPerm,
        limparCampoLegado(p.atribuicao?.sigla),
        limparCampoLegado(mk?.nome),
        limparCampoLegado(mk?.texto),
        limparCampoLegado(p.anotacao?.texto),
        limparCampoLegado(p.anotacao?.autor),
        limparCampoLegado(p.pontoControle),
        limparCampoLegado(p.especificacao),
        limparCampoLegado(p.tipo),
        dataAutuacao,
        limparCampoLegado(info?.descricaodatageracao),
        dataReceb,
        limparCampoLegado(info?.descricao),
        dataEnvio,
        limparCampoLegado(info?.descricaosend),
        unidadeEnvio,
        p.documentoNovo ? 'Um novo documento foi incluido ou assinado' : '',
        formatarObservacoes(info, p.observacao),
        acomp,
      ];
    }),
  ];
}

/** Serializa o CSV no formato compatível com `ListaProcessos_SEIPro` (mantém `-` literal em células vazias). */
export function gerarCsvLegado(linhas: string[][]): string {
  const campo = (bruto: string) => {
    const semPontoVirgula = bruto.replace(/;/g, '');
    const v = semPontoVirgula !== '-' && /^[=+\-@\t\r]/.test(semPontoVirgula) ? `'${semPontoVirgula}` : semPontoVirgula;
    return /["\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  return `\uFEFF${linhas.map((l) => l.map(campo).join(';')).join('\r\n')}`;
}

export function nomeArquivoLegado(agoraMs: number): string {
  const d = new Date(agoraMs);
  const p = (n: number) => String(n).padStart(2, '0');
  return `ListaProcessos_SEIPro_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}_${p(d.getMinutes())}_${p(d.getSeconds())}.csv`;
}
