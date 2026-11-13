import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';
import type { Http, OpcoesHttp, Pagina } from '../../sei-nucleo/src/sessao/http';
import { definirAnalisador } from '../../sei-nucleo/src/sessao/dom';
import { lerPrazoNativo, lerPrazosDaCaixa, temControleNativo } from '../src/nativo/leitura';
import { interpretarResposta } from '../src/nativo/resposta';
import { concluirPrazo, definirPrazo, excluirPrazo, grupoDaLinha, hrefDaBarra, obterAcaoDefinir } from '../src/nativo/formulario';
import { decidir } from '../src/pagina/destino';
import { lerPrazoDaLinha, idsSelecionados } from '../src/pagina/linha';
import { ServicoPrazos, type DepsServico } from '../src/pagina/servico';
import { desenharCelula, iniciarCelulas } from '../src/pagina/celulas';
import { abrirModal } from '../src/pagina/modal';
definirAnalisador(html => parseHTML(html).document as unknown as Document);
import { formatarMarcador, lerMarcador } from '../src/modelo/marcador';
import { fundir } from '../src/modelo/fusao';
import { resumir } from '../src/modelo/situacao';
import type { PrazoNativo, PrazoProcesso } from '../src/modelo/tipos';

let n = 0;
async function teste(nome: string, fn: () => void | Promise<void>) { await fn(); console.log(`OK ${++n}: ${nome}`); }

// ---------------- Fase 1: marcador ----------------
await teste('marcador: "Até data hora texto" no formato que o SEI Pro escreve', () => {
  assert.deepEqual(lerMarcador('Ate 25/09/2026 23:59\nResponder ofício'), { data: '2026-09-25', hora: '23:59', vencimento: true, texto: 'Responder ofício' });
});
await teste('marcador: sem "ate" é data inicial; hora ausente fica indefinida', () => {
  assert.deepEqual(lerMarcador('01/10/2026'), { data: '2026-10-01', hora: undefined, vencimento: false, texto: '' });
});
await teste('marcador: "até" com acento e caixa alta; hora de um dígito', () => {
  assert.deepEqual(lerMarcador('ATÉ 5/10/2026 9:30'.replace('5/10', '05/10')), { data: '2026-10-05', hora: '09:30', vencimento: true, texto: '' });
});
await teste('marcador: "ate" dentro de outra palavra não é vencimento (o legado errava)', () => {
  assert.equal(lerMarcador('Atendimento 12/10/2026')?.vencimento, false);
  assert.equal(lerMarcador('Data limite 12/10/2026')?.vencimento, false);
});
await teste('marcador: data impossível ou ausente não é prazo', () => {
  assert.equal(lerMarcador('Ate 31/02/2026'), null);
  assert.equal(lerMarcador('Para Ana assinar'), null);
  assert.equal(lerMarcador(''), null);
});
await teste('marcador: texto com data no meio guarda o resto sem a data', () => {
  assert.deepEqual(lerMarcador('Reunião em 30/10/2026 com a diretoria'), { data: '2026-10-30', hora: undefined, vencimento: false, texto: 'Reunião em com a diretoria' });
});
await teste('marcador: formatar e ler de volta é estável', () => {
  for (const p of [{ vencimento: true, data: '2026-12-31', hora: '08:00', texto: 'Enviar ao jurídico' }, { vencimento: false, data: '2026-01-02', texto: '' }]) {
    const txt = formatarMarcador(p);
    const volta = lerMarcador(txt)!;
    assert.equal(volta.data, p.data); assert.equal(volta.vencimento, p.vencimento); assert.equal(volta.texto, p.texto ?? '');
  }
  assert.equal(formatarMarcador({ vencimento: true, data: '2026-09-25', texto: 'Responder ofício' }), 'Ate 25/09/2026 23:59\nResponder ofício');
  assert.equal(formatarMarcador({ vencimento: false, data: '2026-09-25' }), '25/09/2026 23:59');
});

// ---------------- Fase 1: situação ----------------
const HOJE = '2026-10-10';
const venc = (v: string, extra: Partial<PrazoProcesso> = {}): PrazoProcesso => ({ idProcedimento: '1', origem: 'nativo', vencimento: v, ...extra });
await teste('situação: no prazo, hoje e atrasado, com singular e plural', () => {
  assert.deepEqual([resumir(venc('2026-10-11'), HOJE).texto, resumir(venc('2026-10-20'), HOJE).texto], ['vence em 1 dia', 'vence em 10 dias']);
  assert.equal(resumir(venc('2026-10-10'), HOJE).situacao, 'hoje');
  const a = resumir(venc('2026-10-09'), HOJE);
  assert.deepEqual([a.situacao, a.texto, a.ordem], ['atrasado', '1 dia de atraso', -1]);
  assert.equal(resumir(venc('2026-10-05'), HOJE).texto, '5 dias de atraso');
});
await teste('situação: sorter no contrato do legado, com hora do marcador ou 23:59', () => {
  assert.equal(resumir(venc('2026-10-20'), HOJE).sorter, '2026-10-20 23:59:00');
  assert.equal(resumir(venc('2026-10-20', { hora: '08:00' }), HOJE).sorter, '2026-10-20 08:00:00');
});
await teste('situação: data inicial mostra há quantos dias; sempre depois dos vencimentos na ordem', () => {
  const d = resumir({ idProcedimento: '1', origem: 'marcador', inicio: '2026-10-05' }, HOJE);
  assert.deepEqual([d.situacao, d.texto], ['desde', 'há 5 dias']);
  assert.ok(d.ordem > resumir(venc('2026-12-31'), HOJE).ordem);
  assert.equal(resumir({ idProcedimento: '1', origem: 'marcador', inicio: HOJE }, HOJE).texto, 'hoje');
});
await teste('situação: concluído é neutro e não conta como atrasado', () => {
  const c = resumir(venc('2026-10-01', { concluidoEm: '2026-10-08' }), HOJE);
  assert.deepEqual([c.situacao, c.texto], ['concluido', 'concluído em 08/10']);
  assert.equal(c.ordem, Number.MAX_SAFE_INTEGER);
});
await teste('situação: virada do dia à noite não antecipa o vencimento (data civil local)', () => {
  assert.equal(resumir(venc('2026-10-10'), '2026-10-10').situacao, 'hoje');
});
await teste('situação: a dica traz hora, texto e quem definiu', () => {
  const r = resumir(venc('2026-10-20', { hora: '14:00', texto: 'Responder', sigla: 'ana' }), HOJE);
  assert.match(r.dica, /Vence em 20\/10\/2026 às 14:00\./);
  assert.match(r.dica, /Responder/); assert.match(r.dica, /Definido por ana/);
});

// ---------------- Fase 1: fusão ----------------
const nat = (data: string, extra: Partial<PrazoNativo> = {}): PrazoNativo => ({ idControlePrazo: '9', idProcedimento: '1', sigla: 'ana', data, estado: 'noPrazo', link: 'controlador.php?acao=controle_prazo_definir&id_controle_prazo=9', ...extra });
await teste('fusão: sem nada, sem prazo', () => assert.equal(fundir('1', null, null), null));
await teste('fusão: só nativo', () => {
  assert.deepEqual(fundir('1', nat('2026-10-20')), { idProcedimento: '1', origem: 'nativo', vencimento: '2026-10-20', idControlePrazo: '9', sigla: 'ana', linkNativo: 'controlador.php?acao=controle_prazo_definir&id_controle_prazo=9' });
});
await teste('fusão: só marcador, vencimento ou data inicial', () => {
  assert.equal(fundir('1', null, { data: '2026-10-20', vencimento: true, texto: 'x', hora: '10:00' })?.vencimento, '2026-10-20');
  const d = fundir('1', null, { data: '2026-10-01', vencimento: false, texto: '' });
  assert.deepEqual([d?.inicio, d?.vencimento, d?.origem], ['2026-10-01', undefined, 'marcador']);
});
await teste('fusão: marcador de mesma data acrescenta hora e texto ao nativo', () => {
  const f = fundir('1', nat('2026-10-20'), { data: '2026-10-20', vencimento: true, hora: '14:00', texto: 'Responder' })!;
  assert.deepEqual([f.origem, f.vencimento, f.hora, f.texto, f.idControlePrazo], ['ambos', '2026-10-20', '14:00', 'Responder', '9']);
});
await teste('fusão: marcador de data diferente está defasado e não entra', () => {
  const f = fundir('1', nat('2026-10-25'), { data: '2026-10-20', vencimento: true, hora: '14:00', texto: 'velho' })!;
  assert.deepEqual([f.origem, f.vencimento, f.hora, f.texto], ['nativo', '2026-10-25', undefined, undefined]);
});
await teste('fusão: marcador "desde" não aparece quando há nativo', () => {
  const f = fundir('1', nat('2026-10-25'), { data: '2026-10-01', vencimento: false, texto: '' })!;
  assert.deepEqual([f.origem, f.inicio], ['nativo', undefined]);
});
await teste('fusão: concluído do nativo é preservado', () => {
  assert.equal(fundir('1', nat('2026-10-01', { estado: 'concluido', concluidoEm: '2026-10-08' }))?.concluidoEm, '2026-10-08');
});

// ---------------- Fase 2: nativo (fixtures reais do SEI 4.1.5, treinamento SP) ----------------
const fx = (nome: string) => readFileSync(new URL(`./fixtures/sei41/${nome}`, import.meta.url), 'utf8');
const docDe = (html: string) => parseHTML(html).document as unknown as Document;
const pagina = (url: string, html: string): Pagina => { let d: Document | null = null; return { url, status: 200, html, get doc() { return (d ??= docDe(html)); } }; };
const SEI = 'https://treinamento.sei.sp.gov.br/sei/';

await teste('nativo: lê data, estado, sigla e ids do ícone de cada linha', () => {
  const p = lerPrazosDaCaixa(docDe(fx('caixa_prazos.html')));
  assert.equal(p.size, 6);
  const a = p.get('21831')!;
  assert.deepEqual({ ...a, link: undefined }, { idControlePrazo: '1332', idProcedimento: '21831', sigla: 'usuario01', data: '2023-05-20', estado: 'atrasado', link: undefined });
  assert.match(a.link, /^controlador\.php\?acao=controle_prazo_definir&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&id_controle_prazo=1332&id_procedimento=21831&/);
  assert.deepEqual([p.get('150098')?.data, p.get('150098')?.estado, p.get('150098')?.idControlePrazo], ['2026-10-20', 'noPrazo', '8557']);
  assert.deepEqual([p.get('112825') ?? null], [null]);
  const hoje = [...p.values()].find(x => x.estado === 'hoje');
  assert.deepEqual([hoje?.data, hoje?.sigla], ['2026-10-10', 'usuario02']);
});
await teste('nativo: prazo concluído guarda a data da conclusão', () => {
  const p = lerPrazosDaCaixa(docDe(fx('caixa_concluido.html')));
  const c = p.get('150098');
  assert.deepEqual([c?.estado, c?.data, c?.concluidoEm], ['concluido', '2026-10-30', '2026-10-10']);
});
await teste('nativo: retorno programado e outros ícones com tooltip parecido não viram prazo', () => {
  const d = docDe(fx('caixa_sem_prazo_nativo.html'));
  const tr = d.querySelector('tr#P21831')!;
  assert.match(tr.innerHTML, /retorno_programado3/);
  assert.equal(lerPrazoNativo(tr)?.idControlePrazo, '1332');
  assert.equal(lerPrazoNativo(d.querySelector('tr#P150098') ?? tr.cloneNode(false) as Element), null);
});
await teste('nativo: sem aria-label, o tooltip basta; rótulo ilegível não vira prazo', () => {
  const linha = (extra: string) => docDe(`<table><tr id="P7"><td><a href="controlador.php?acao=controle_prazo_definir&amp;id_controle_prazo=3&amp;id_procedimento=7" ${extra}><img src="svg/controle_prazo1.svg"></a></td></tr></table>`).querySelector('tr')!;
  const t = lerPrazoNativo(linha(`onmouseover="return infraTooltipMostrar('ana 05/11/2026 (25 dias)','Controle de Prazo');"`));
  assert.deepEqual([t?.sigla, t?.data, t?.estado], ['ana', '2026-11-05', 'noPrazo']);
  assert.equal(lerPrazoNativo(linha(`aria-label="Controle de Prazo / ana quando der"`)), null);
});
await teste('nativo: detecta o botão da barra e acha o link assinado', () => {
  const d = docDe(fx('caixa_prazos.html'));
  assert.equal(temControleNativo(d), true);
  assert.match(hrefDaBarra(d, 'controle_prazo_definir')!, /^controlador\.php\?acao=controle_prazo_definir&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&/);
  assert.equal(temControleNativo(docDe('<html><body><a onclick="return acaoControleProcessos(\'controlador.php?acao=outra\')">x</a></body></html>')), false);
});
await teste('nativo: o grupo (hdn*) vem da tabela da linha', () => {
  const d = docDe(fx('caixa_prazos.html'));
  assert.equal(grupoDaLinha(d, '150098'), 'Recebidos');
  assert.equal(grupoDaLinha(d, '7318'), 'Gerados');
  assert.equal(grupoDaLinha(d, '999'), null);
});
await teste('resposta: sucesso é sair do formulário; erro vem de #divInfraMensagens', () => {
  assert.deepEqual(interpretarResposta(pagina(`${SEI}controlador.php?acao=procedimento_controlar&acao_origem=controle_prazo_definir`, fx('caixa_prazos.html'))).ok, true);
  const e = interpretarResposta(pagina(`${SEI}controlador.php?acao=controle_prazo_definir&acao_origem=controle_prazo_definir`, fx('definir_erro_passado.html')));
  assert.deepEqual([e.ok, e.erro], [false, 'Data de prazo não pode estar no passado.']);
  const sem = interpretarResposta(pagina(`${SEI}controlador.php?acao=controle_prazo_definir&acao_origem=controle_prazo_definir`, fx('definir_form.html')));
  assert.equal(sem.ok, false);
});

/** Http de mentira: guarda o que foi enviado e responde pelo roteiro. */
function httpFalso(responder: (metodo: 'obter' | 'enviar', url: string, campos?: ReadonlyArray<readonly [string, string]>) => Pagina) {
  const chamadas: Array<{ metodo: string; url: string; campos?: Array<[string, string]> }> = [];
  const http: Http = {
    base: new URL(SEI),
    absoluta: (u: string) => new URL(u, SEI).href,
    async obter(url: string, _op?: OpcoesHttp) { chamadas.push({ metodo: 'obter', url }); return responder('obter', url); },
    async enviar(url: string, campos: ReadonlyArray<readonly [string, string]>, _op?: OpcoesHttp) { chamadas.push({ metodo: 'enviar', url, campos: campos.map(c => [c[0], c[1]] as [string, string]) }); return responder('enviar', url, campos); },
    async baixar() { throw new Error('não usado'); },
  };
  return { http, chamadas };
}
const valor = (campos: Array<[string, string]> | undefined, nome: string) => campos?.find(c => c[0] === nome)?.[1];

await teste('escrita: obtém o action assinado sem mexer na seleção da tela e o reaproveita', async () => {
  const doc = docDe(fx('caixa_prazos.html'));
  const { http, chamadas } = httpFalso(() => pagina(`${SEI}controlador.php?acao=controle_prazo_definir`, fx('definir_form.html')));
  const a1 = await obterAcaoDefinir(http, doc, `${SEI}controlador.php?acao=procedimento_controlar`, '150098');
  assert.match(a1, /acao=controle_prazo_definir&acao_origem=controle_prazo_definir/);
  const a2 = await obterAcaoDefinir(http, doc, `${SEI}controlador.php?acao=procedimento_controlar`, '7318');
  assert.equal(a2, a1);
  assert.equal(chamadas.length, 1);
  assert.match(chamadas[0]!.url, /acao=controle_prazo_definir&acao_origem=procedimento_controlar/);
  assert.equal(valor(chamadas[0]!.campos, 'hdnRecebidosItensSelecionados'), '150098');
  assert.equal(valor(chamadas[0]!.campos, 'hdnGeradosItensSelecionados'), '');
});
await teste('escrita: definir por data e por dias úteis monta os campos do formulário do SEI', async () => {
  const { http, chamadas } = httpFalso(() => pagina(`${SEI}controlador.php?acao=procedimento_controlar&acao_origem=controle_prazo_definir`, fx('caixa_prazos.html')));
  const r1 = await definirPrazo(http, 'controlador.php?acao=controle_prazo_definir&x=1', ['1', '2'], { tipo: 'data', data: '2026-10-20' });
  assert.equal(r1.ok, true);
  const c1 = chamadas[0]!.campos;
  assert.deepEqual([valor(c1, 'rdoPrazo'), valor(c1, 'txtPrazo'), valor(c1, 'txtDias'), valor(c1, 'hdnIdProcedimentos'), valor(c1, 'hdnIdControlePrazo'), valor(c1, 'sbmDefinirControlePrazo')], ['1', '20/10/2026', '', '1,2', '', 'Salvar']);
  await definirPrazo(http, 'a', ['3'], { tipo: 'dias', dias: 5, uteis: true });
  const c2 = chamadas[1]!.campos;
  assert.deepEqual([valor(c2, 'rdoPrazo'), valor(c2, 'txtPrazo'), valor(c2, 'txtDias'), valor(c2, 'chkSinDiasUteis')], ['2', '', '5', 'on']);
  await definirPrazo(http, 'a', ['3'], { tipo: 'dias', dias: 3, uteis: false });
  assert.equal(valor(chamadas[2]!.campos, 'chkSinDiasUteis'), undefined);
});
await teste('escrita: o erro de validação do SEI volta ao chamador, sem exceção', async () => {
  const { http } = httpFalso(() => pagina(`${SEI}controlador.php?acao=controle_prazo_definir&acao_origem=controle_prazo_definir`, fx('definir_erro_passado.html')));
  const r = await definirPrazo(http, 'a', ['1'], { tipo: 'data', data: '2020-01-01' });
  assert.deepEqual([r.ok, r.erro], [false, 'Data de prazo não pode estar no passado.']);
});
await teste('escrita: concluir usa rdoPrazo=3', async () => {
  const { http, chamadas } = httpFalso(() => pagina(`${SEI}controlador.php?acao=procedimento_controlar`, fx('caixa_concluido.html')));
  assert.equal((await concluirPrazo(http, 'a', ['150098'])).ok, true);
  assert.equal(valor(chamadas[0]!.campos, 'rdoPrazo'), '3');
});
await teste('escrita: excluir abre a edição pelo link do ícone e posta no action de exclusão', async () => {
  const { http, chamadas } = httpFalso((m) => m === 'obter' ? pagina(`${SEI}controlador.php?acao=controle_prazo_definir`, fx('definir_editar.html')) : pagina(`${SEI}controlador.php?acao=procedimento_controlar&acao_origem=controle_prazo_excluir`, fx('caixa_prazos.html')));
  const r = await excluirPrazo(http, 'controlador.php?acao=controle_prazo_definir&id_controle_prazo=8557&id_procedimento=150098');
  assert.equal(r.ok, true);
  assert.equal(chamadas[0]!.metodo, 'obter');
  assert.match(chamadas[1]!.url, /acao=controle_prazo_excluir&acao_origem=controle_prazo_definir&acao_retorno=procedimento_controlar&id_controle_prazo=8557/);
  assert.equal(valor(chamadas[1]!.campos, 'hdnIdControlePrazo'), '8557');
});
await teste('escrita: sem o link de exclusão (sem permissão), diz isso em vez de falhar calado', async () => {
  const { http } = httpFalso(() => pagina(`${SEI}controlador.php?acao=controle_prazo_definir`, fx('definir_form.html')));
  const r = await excluirPrazo(http, 'controlador.php?acao=controle_prazo_definir&id_controle_prazo=1');
  assert.equal(r.ok, false);
  assert.match(r.erro!, /permiss/);
});

// ---------------- Fase 3: destino do prazo (decisão A) ----------------
const H = '2026-10-10';
const base = { ids: ['1'], vencimento: true, contagem: 'data' as const, data: '2026-10-20' };
await teste('destino: vencimento por data vai só ao SEI quando não há hora, texto nem marcador', () => {
  assert.deepEqual(decidir(base, true, H), { nativo: true, marcador: false });
});
await teste('destino: hora ou texto exigem marcador e vão para ele, além do SEI', () => {
  const d = decidir({ ...base, texto: 'Responder' }, true, H);
  assert.deepEqual([d.nativo, d.marcador], [true, true]);
  assert.match(d.erro!, /Escolha o marcador/);
  const ok = decidir({ ...base, hora: '14:00', marcador: '7' }, true, H);
  assert.deepEqual([ok.nativo, ok.marcador, ok.erro], [true, true, undefined]);
});
await teste('destino: data inicial só no marcador (o SEI só aceita vencimento)', () => {
  const d = decidir({ ...base, vencimento: false }, true, H);
  assert.deepEqual([d.nativo, d.marcador], [false, true]);
  assert.match(d.erro!, /marcador/);
  assert.equal(decidir({ ...base, vencimento: false, marcador: '7' }, true, H).erro, undefined);
});
await teste('destino: data já vencida não vai ao SEI (ele recusa data passada)', () => {
  const d = decidir({ ...base, data: '2026-10-01', marcador: '7' }, true, H);
  assert.deepEqual([d.nativo, d.marcador, d.erro], [false, true, undefined]);
  assert.match(d.aviso!, /j\u00E1 passou/);
  assert.equal(decidir({ ...base, data: '2026-10-10' }, true, H).nativo, true);
});
await teste('destino: sem controle nativo vai ao marcador, com a data de dias úteis calculada aqui', () => {
  const d = decidir({ ...base, contagem: 'dias', data: undefined, dias: 5, uteis: true, marcador: '7' }, false, H);
  assert.deepEqual([d.nativo, d.marcador, d.dataCalculada, d.erro], [false, true, '2026-10-16', undefined]);
  assert.match(d.aviso!, /n\u00E3o oferece o controle de prazo/);
  assert.equal(decidir({ ...base, contagem: 'dias', data: undefined, dias: 3, uteis: false, marcador: '7' }, false, H).dataCalculada, '2026-10-13');
});
await teste('destino: campos obrigatórios', () => {
  assert.match(decidir({ ...base, ids: [] }, true, H).erro!, /Selecione/);
  assert.match(decidir({ ...base, data: undefined }, true, H).erro!, /data de vencimento/);
  assert.match(decidir({ ...base, contagem: 'dias', data: undefined, dias: 0 }, true, H).erro!, /n\u00FAmero de dias/);
  assert.match(decidir({ ...base, contagem: 'dias', data: undefined, dias: 1000 }, true, H).erro!, /1 a 999/);
  assert.equal(decidir({ ...base, contagem: 'dias', data: undefined, dias: 5 }, true, H).erro, undefined);
});

// ---------------- Fase 3: linha da caixa ----------------
const linhaMarcador = (tooltip: string, extra = '') => docDe(`<table id="tblProcessosRecebidos"><tr id="P9"><td><input type="checkbox" value="9" title="99906.713-630.000001/2026-01"></td><td><a href="controlador.php?acao=andamento_marcador_gerenciar&amp;id_procedimento=9" aria-label="Marcador / x" onmouseover="return infraTooltipMostrar(${tooltip});"><img src="svg/marcador_preto.svg"></a>${extra}</td></tr></table>`).querySelector('tr')!;
await teste('linha: lê o prazo do tooltip do marcador (texto com \\n e aspas) e o nome do marcador', () => {
  const l = lerPrazoDaLinha(linhaMarcador(String.raw`'Ate 25/12/2026 23:59\nD\'Avila: responder','Para assinar'`));
  assert.deepEqual([l.marcador?.data, l.marcador?.vencimento, l.marcador?.texto, l.nomeMarcador], ['2026-12-25', true, "D'Avila: responder", 'Para assinar']);
  assert.equal(l.nativo, null);
});
await teste('linha: marcador sem data não é prazo; JS no tooltip não é executado', () => {
  assert.equal(lerPrazoDaLinha(linhaMarcador(`'','Para Ana assinar'`)).marcador, null);
  assert.equal(lerPrazoDaLinha(linhaMarcador('alert(1)')).marcador, null);
});
await teste('linha: o primeiro marcador COM data vale, mesmo que outro venha antes (SEI 4.1+ tem vários)', () => {
  const outro = `<a href="controlador.php?acao=andamento_marcador_gerenciar&amp;id_procedimento=9" onmouseover="return infraTooltipMostrar('01/11/2026','Outro');"></a>`;
  const l = lerPrazoDaLinha(linhaMarcador(`'','Sem data'`, outro));
  assert.deepEqual([l.marcador?.data, l.marcador?.vencimento, l.nomeMarcador], ['2026-11-01', false, 'Outro']);
});
await teste('linha: ids marcados nas tabelas do Controle', () => {
  const d = docDe(`<table id="tblProcessosRecebidos"><tr id="P1"><td><input type="checkbox" value="1"></td></tr><tr id="P2"><td><input type="checkbox" value="2"></td></tr></table><table id="tblProcessosGerados"><tr id="P3"><td><input type="checkbox" value="3"></td></tr></table>`);
  (d.querySelector('#P1 input') as HTMLInputElement).checked = true;
  (d.querySelector('#P3 input') as HTMLInputElement).checked = true;
  assert.deepEqual(idsSelecionados(d), ['1', '3']);
});

// ---------------- Fase 3: serviço ----------------
function servicoDe(opcoes: { vivo?: string; resposta?: string; semNativo?: boolean; falhaMarcador?: string[] } = {}) {
  const doc = docDe(opcoes.vivo ?? fx('caixa_prazos.html'));
  if (opcoes.semNativo) doc.querySelectorAll('a[onclick*="acaoControleProcessos"]').forEach(a => a.remove());
  const marcados: Array<[string, string, string]> = [];
  const { http, chamadas } = httpFalso((metodo, url) => {
    if (metodo === 'obter') return pagina(`${SEI}controlador.php?acao=controle_prazo_definir`, fx('definir_editar.html'));
    if (/acao=controle_prazo_definir&acao_origem=procedimento_controlar/.test(url)) return pagina(`${SEI}controlador.php?acao=controle_prazo_definir`, fx('definir_form.html'));
    return pagina(`${SEI}controlador.php?acao=procedimento_controlar&acao_origem=controle_prazo_definir`, opcoes.resposta ?? fx('caixa_prazos.html'));
  });
  const deps: DepsServico = {
    doc, url: `${SEI}controlador.php?acao=procedimento_controlar`, http, hoje: () => H,
    escreverMarcador: async (protocolo, marcador, texto) => {
      if (opcoes.falhaMarcador?.includes(protocolo)) throw new Error('marcador recusado');
      marcados.push([protocolo, marcador, texto]);
    },
  };
  const servico = new ServicoPrazos(deps);
  return { doc, servico, chamadas, marcados };
}
const pedido = (extra: Record<string, unknown> = {}) => ({ ids: ['150098'], vencimento: true, contagem: 'data' as const, data: '2026-10-20', ...extra });

await teste('serviço: lê o prazo nativo da linha (fusão) e a situação sai do modelo', () => {
  const { servico } = servicoDe();
  const p = servico.ler('150098')!;
  assert.deepEqual([p.origem, p.vencimento, p.idControlePrazo], ['nativo', '2026-10-20', '8557']);
  assert.equal(servico.ler('112825'), null);
  assert.equal(servico.nativoDisponivel(), true);
});
await teste('serviço: vencimento sem complemento grava só no SEI e atualiza a linha', async () => {
  const { servico, chamadas, marcados } = servicoDe();
  const antes = servico.ler('150098')!.linkNativo;
  const r = await servico.salvar(pedido());
  assert.deepEqual([r.erro, r.gravados, r.falhas.length], [undefined, ['150098'], 0]);
  assert.equal(marcados.length, 0);
  const envio = chamadas.at(-1)!.campos;
  assert.deepEqual([valor(envio, 'rdoPrazo'), valor(envio, 'txtPrazo'), valor(envio, 'hdnIdProcedimentos')], ['1', '20/10/2026', '150098']);
  assert.ok(antes);
});
await teste('serviço: com hora e texto grava também o marcador, com a data que o SEI devolveu', async () => {
  const { servico, marcados } = servicoDe();
  const r = await servico.salvar(pedido({ hora: '14:00', texto: 'Responder ofício', marcador: '7' }));
  assert.deepEqual([r.erro, r.gravados], [undefined, ['150098']]);
  assert.equal(marcados.length, 1);
  assert.equal(marcados[0]![2], 'Ate 20/10/2026 14:00\nResponder ofício');
  const p = servico.ler('150098')!;
  assert.deepEqual([p.origem, p.hora, p.texto], ['ambos', '14:00', 'Responder ofício']);
});
await teste('serviço: data inicial vai só ao marcador, sem nenhuma requisição ao controle de prazo', async () => {
  const { servico, chamadas, marcados } = servicoDe();
  const r = await servico.salvar(pedido({ ids: ['112825'], vencimento: false, data: '2026-10-01', marcador: '7' }));
  assert.deepEqual([r.erro, r.gravados], [undefined, ['112825']]);
  assert.equal(chamadas.length, 0);
  assert.equal(marcados[0]![2], '01/10/2026 23:59');
  assert.deepEqual([servico.ler('112825')?.inicio, servico.ler('112825')?.origem], ['2026-10-01', 'marcador']);
});
await teste('serviço: SEI sem controle nativo e prazo em dias úteis grava no marcador com a data calculada', async () => {
  const { servico, chamadas, marcados } = servicoDe({ semNativo: true });
  assert.equal(servico.nativoDisponivel(), false);
  const r = await servico.salvar({ ids: ['112825'], vencimento: true, contagem: 'dias', dias: 5, uteis: true, marcador: '7' });
  assert.deepEqual([r.erro, r.gravados, chamadas.length], [undefined, ['112825'], 0]);
  assert.equal(marcados[0]![2], 'Ate 16/10/2026 23:59');
});
await teste('serviço: regra recusa o pedido antes de qualquer requisição', async () => {
  const { servico, chamadas } = servicoDe();
  const r = await servico.salvar(pedido({ data: undefined }));
  assert.match(r.erro!, /data de vencimento/);
  assert.equal(chamadas.length, 0);
});
await teste('serviço: erro de validação do SEI volta como erro do pedido', async () => {
  const { servico } = servicoDe({ resposta: fx('definir_erro_passado.html') });
  const r = await servico.salvar(pedido({ ids: ['112825'], data: '2026-10-12' }));
  assert.equal(r.erro, 'Data de prazo não pode estar no passado.');
  assert.deepEqual(r.gravados, []);
});
await teste('serviço: falha do marcador de um processo não impede os outros', async () => {
  const ids = ['150098', '148265'];
  const { servico, marcados } = servicoDe({ falhaMarcador: ['99906.713-630.000089/2023-10'] });
  const nativos = ids.map(id => servico.ler(id));
  void nativos;
  const r = await servico.salvar({ ids, vencimento: false, contagem: 'data', data: '2026-10-01', marcador: '7' });
  assert.equal(r.gravados.length + r.falhas.length, 2);
  assert.equal(marcados.length, r.gravados.length);
});
await teste('serviço: remover exclui o nativo e a linha deixa de ter prazo', async () => {
  const { servico, doc, chamadas } = servicoDe({ resposta: fx('caixa_sem_prazo_nativo.html') });
  const r = await servico.remover(['150098']);
  assert.deepEqual([r.falhas.length, r.gravados], [0, ['150098']]);
  assert.match(chamadas.at(-1)!.url, /acao=controle_prazo_excluir/);
  assert.equal(servico.ler('150098'), null);
  assert.equal(doc.querySelector('tr#P150098 a[href*="acao=controle_prazo_definir"]'), null);
});
await teste('serviço: remover limpa o marcador que o próprio módulo gravou, mesmo sem recarregar a caixa', async () => {
  const { servico, marcados } = servicoDe({ resposta: fx('caixa_sem_prazo_nativo.html') });
  await servico.salvar(pedido({ ids: ['112825'], vencimento: false, data: '2026-10-01', marcador: '7', texto: 'x' }));
  assert.equal(servico.marcadorDoPrazo('112825'), '7');
  const r = await servico.remover(['112825']);
  assert.deepEqual([r.falhas.length, r.gravados], [0, ['112825']]);
  assert.deepEqual(marcados.at(-1)?.slice(1), ['7', '']);
  assert.equal(servico.ler('112825'), null);
  assert.equal(servico.marcadorDoPrazo('112825'), undefined);
});
await teste('serviço: concluir mostra o prazo como concluído; sem prazo nativo avisa', async () => {
  const { servico } = servicoDe({ resposta: fx('caixa_concluido.html') });
  assert.deepEqual([(await servico.concluir(['150098'])).gravados, servico.ler('150098')?.concluidoEm], [['150098'], '2026-10-10']);
  assert.match((await servico.concluir(['112825'])).erro!, /Nenhum dos processos/);
});

// ---------------- Fase 3: células ----------------
function caixaComCelulas() {
  const doc = docDe(fx('caixa_prazos.html'));
  for (const tr of doc.querySelectorAll('tr[id^="P"]')) {
    const td = doc.createElement('td');
    td.className = 'prazoBoxDisplay';
    tr.append(td);
  }
  return doc;
}
await teste('células: desenha cada situação com o contrato do legado e marca as linhas', () => {
  const doc = caixaComCelulas();
  const { servico } = (() => { const s = servicoDe(); return { servico: new ServicoPrazos({ ...({} as DepsServico), doc, url: SEI, http: s.servico['d'].http, hoje: () => H, escreverMarcador: async () => {} } as DepsServico) }; })();
  for (const tr of doc.querySelectorAll('tr[id^="P"]')) desenharCelula(doc, tr, servico, H);
  const caixa = (id: string) => doc.querySelector(`tr#P${id} td.prazoBoxDisplay .dateboxDisplay`) as HTMLElement | null;
  assert.equal(caixa('150098')?.getAttribute('data-time-sorter'), '2026-10-20 23:59:00');
  assert.match(caixa('150098')!.textContent!, /vence em 10 dias/);
  assert.match(caixa('21831')!.className, /spro-prazo-atrasado/);
  assert.equal(doc.querySelector('tr#P21831')!.classList.contains('infraTrAtrasada'), true);
  const hojeTr = [...doc.querySelectorAll('tr[id^="P"]')].find(tr => tr.querySelector('.spro-prazo-hoje'))!;
  assert.equal(hojeTr.classList.contains('infraTrAlerta'), true);
  assert.match(doc.querySelector('tr#P112825 td.prazoBoxDisplay')!.textContent!, /Adicionar prazo/);
});
await teste('células: redesenhar sem mudança não recria o nó (idempotente, sem laço de mutação)', () => {
  const doc = caixaComCelulas();
  const s = servicoDe();
  const servico = new ServicoPrazos({ doc, url: SEI, http: s.servico['d'].http, hoje: () => H, escreverMarcador: async () => {} });
  const tr = doc.querySelector('tr#P150098')!;
  desenharCelula(doc, tr, servico, H);
  const no = tr.querySelector('.dateboxDisplay');
  desenharCelula(doc, tr, servico, H);
  assert.equal(tr.querySelector('.dateboxDisplay'), no);
});
await teste('células: clique na célula abre o modal da linha; o link do legado não dispara outro', () => {
  const doc = caixaComCelulas();
  const s = servicoDe();
  const servico = new ServicoPrazos({ doc, url: SEI, http: s.servico['d'].http, hoje: () => H, escreverMarcador: async () => {} });
  const aberturas: string[][] = [];
  const c = iniciarCelulas(doc, servico, () => H, ids => aberturas.push(ids));
  c.ligar();
  const alvo = doc.querySelector('tr#P150098 td.prazoBoxDisplay .dateboxDisplay')!;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  alvo.dispatchEvent(new Ev('click', { bubbles: true, cancelable: true }));
  assert.deepEqual(aberturas, [['150098']]);
  c.desligar();
  assert.equal(doc.querySelector('td.prazoBoxDisplay[data-spro-prazo]'), null);
});
await teste('células: no Quadro (#processosKanban), clique no prazo abre o modal e desenharCelula sincroniza o cartão', () => {
  const doc = caixaComCelulas();
  const kanban = doc.createElement('div');
  kanban.id = 'processosKanban';
  const item = doc.createElement('div');
  item.className = 'kanban-item';
  item.setAttribute('data-eid', '150098');
  const prazoSpan = doc.createElement('span');
  prazoSpan.setAttribute('data-type', 'prazo');
  item.append(prazoSpan);
  kanban.append(item);
  doc.body.append(kanban);

  const s = servicoDe();
  const servico = new ServicoPrazos({ doc, url: SEI, http: s.servico['d'].http, hoje: () => H, escreverMarcador: async () => {} });
  const aberturas: string[][] = [];
  const c = iniciarCelulas(doc, servico, () => H, ids => aberturas.push(ids));
  c.ligar();
  const alvo = doc.querySelector('#processosKanban .kanban-item[data-eid="150098"] [data-type="prazo"] .dateboxDisplay');
  assert.ok(alvo, 'cartão do Kanban sincronizado com o prazo da linha');
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  alvo!.dispatchEvent(new Ev('click', { bubbles: true, cancelable: true }));
  assert.deepEqual(aberturas, [['150098']]);
  c.desligar();
  assert.equal(doc.querySelector('#processosKanban [data-type="prazo"][data-spro-prazo]'), null);
});

// ---------------- Fase 3: modal ----------------
await teste('modal: preenche com o prazo atual, mostra o destino e só salva com a regra satisfeita', async () => {
  const doc = caixaComCelulas();
  const s = servicoDe();
  const salvos: unknown[] = [];
  const servico = new ServicoPrazos({ doc, url: SEI, http: s.servico['d'].http, hoje: () => H, escreverMarcador: async () => {} });
  servico.salvar = (async (e: unknown) => { salvos.push(e); return { gravados: ['150098'], falhas: [] }; }) as typeof servico.salvar;
  abrirModal(doc, ['150098'], servico, () => H, { titulo: 'Prazo do processo', inicial: { prazo: servico.ler('150098') }, marcadores: async () => [{ valor: '7', texto: 'Urgente' }] });
  await new Promise(r => setTimeout(r, 10));
  const raiz = doc.querySelector('.spro-prz-host')!.shadowRoot as unknown as ParentNode;
  const q = <T extends Element>(sel: string) => raiz.querySelector(sel) as unknown as T;
  assert.equal(q<HTMLInputElement>('input[type=date]').value, '2026-10-20');
  assert.match(q('.spro-prz-destino').textContent!, /controle de prazo do SEI/);
  assert.equal(q<HTMLButtonElement>('.spro-prz-salvar').disabled, false);
  assert.equal(q<HTMLButtonElement>('.spro-prz-remover').hidden, false);
  assert.equal(q<HTMLButtonElement>('.spro-prz-concluir').hidden, false);
  assert.deepEqual([...raiz.querySelectorAll('select option')].map(o => o.textContent), ['— nenhum —', 'Urgente']);
  // texto sem marcador: a regra pede o marcador e o botão trava
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  const texto = q<HTMLInputElement>('input[type=text]'); texto.value = 'Responder'; texto.dispatchEvent(new Ev('input', { bubbles: true }));
  assert.match(q('.spro-prz-erro').textContent!, /Escolha o marcador/);
  assert.equal(q<HTMLButtonElement>('.spro-prz-salvar').disabled, true);
  const sel = q<HTMLSelectElement>('select'); (raiz.querySelector('select option[value="7"]') as unknown as HTMLOptionElement).selected = true; sel.dispatchEvent(new Ev('change', { bubbles: true }));
  assert.equal(q<HTMLButtonElement>('.spro-prz-salvar').disabled, false);
  q<HTMLButtonElement>('.spro-prz-salvar').dispatchEvent(new Ev('click', { bubbles: true }));
  await new Promise(r => setTimeout(r, 10));
  assert.equal(salvos.length, 1);
  assert.deepEqual({ ...(salvos[0] as object), uteis: undefined }, { ids: ['150098'], vencimento: true, contagem: 'data', data: '2026-10-20', dias: undefined, uteis: undefined, hora: undefined, texto: 'Responder', marcador: '7' });
  assert.equal(doc.querySelector('.spro-prz-host'), null, 'fecha ao gravar sem falhas');
});

console.log(`\n${n} testes OK`);
