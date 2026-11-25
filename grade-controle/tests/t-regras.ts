import { gerarCsvLegado } from '../src/modelo/exportar';
import assert from 'node:assert/strict';
import { acrescentar, casa, filtrarPorBusca, interpretar, remover } from '../src/modelo/busca';
import { DIA_MS } from '../src/modelo/contexto';
import { facetasDe } from '../src/modelo/facetas';
import { linhasCsv, sinaisDe } from '../src/modelo/exportar';
import { agrupar, faixaDoPrazo } from '../src/modelo/grupos';
import { abrirVisita, comIdade, estadoVazio, JANELA_VISITA, MAX_REGISTROS, normalizarEstado, registrarVistos, rotuloIdade } from '../src/modelo/idade';
import { calcularJanela } from '../src/modelo/janela';
import { achatar } from '../src/modelo/linhas';
import { alternarOrdem, chaveProtocolo, ordenar } from '../src/modelo/ordem';
import { aplicarMovimento, montarQuadro, planejarMovimento, reordenarColunas } from '../src/modelo/quadro';
import { excluirVisao, mudouDe, normalizarLista, normalizarVisao, renomearVisao, salvarVisao, visaoPadrao, MAX_VISOES } from '../src/modelo/visoes';
import { AGORA, CTX, prazoEm, proc, teste } from './util';

const ana = { sigla: 'ana', nome: 'Ana Souza' };
const beto = { sigla: 'beto', nome: 'Beto Lima' };
const mk = (nome: string, texto = '') => ({ nome, cor: 'preto', texto });
const casaCom = (q: string, p: ReturnType<typeof proc>) => casa(interpretar(q), p, CTX);

// ---------------- busca ----------------
await teste('busca: texto livre sem acento e sem caixa, em todos os campos', () => {
  const p = proc({ tipo: 'Contratação de serviços', especificacao: 'Pregão eletrônico', atribuicao: ana, marcadores: [mk('Urgente')], anotacao: { texto: 'ligar para o fornecedor', autor: 'x', prioridade: false } });
  for (const q of ['contratacao', 'PREGAO', 'souza', 'urgente', 'FORNECEDOR', 'servicos pregao']) assert.ok(casaCom(q, p), q);
  assert.ok(!casaCom('inexistente', p));
});
await teste('busca: protocolo com ou sem pontuação', () => {
  const p = proc({ protocolo: '99906.713-630.000032/2025-82' });
  assert.ok(casaCom('000032', p));
  assert.ok(casaCom('99906713630000032202582', p));
  assert.ok(casaCom('protocolo:32/2025', p));
});
await teste('busca: aspas, negação e E entre termos', () => {
  const p = proc({ tipo: 'Ofício circular', atribuicao: ana });
  assert.ok(casaCom('"oficio circular"', p));
  assert.ok(!casaCom('"circular oficio"', p));
  assert.ok(casaCom('oficio -beto', p));
  assert.ok(!casaCom('oficio -ana', p));
  assert.ok(casaCom('tipo:"oficio circular" resp:ana', p));
});
await teste('busca: resp:eu, resp:sem e por nome ou sigla', () => {
  assert.ok(casaCom('resp:eu', proc({ atribuicao: ana })));
  assert.ok(!casaCom('resp:eu', proc({ atribuicao: beto })));
  assert.ok(casaCom('resp:sem', proc()));
  assert.ok(casaCom('resp:souza', proc({ atribuicao: ana })));
  assert.ok(!casa(interpretar('resp:eu'), proc({ atribuicao: ana }), { ...CTX, eu: undefined }));
});
await teste('busca: marcador e anotação, com sem/com', () => {
  assert.ok(casaCom('marcador:urg', proc({ marcadores: [mk('Urgente')] })));
  assert.ok(casaCom('marcador:sem', proc()));
  assert.ok(!casaCom('marcador:sem', proc({ marcadores: [mk('A')] })));
  assert.ok(casaCom('anot:prioridade', proc({ anotacao: { texto: 'x', autor: '', prioridade: true } })));
  assert.ok(casaCom('anot:sem', proc()));
});
await teste('busca: prazo atrasado, hoje, semana, sem, <7d e >30d', () => {
  const atrasado = proc({ prazo: prazoEm('1', '2026-10-01') });
  const hoje = proc({ prazo: prazoEm('2', '2026-10-11') });
  const em5 = proc({ prazo: prazoEm('3', '2026-10-16') });
  const em40 = proc({ prazo: prazoEm('4', '2026-11-20') });
  const sem = proc();
  assert.ok(casaCom('prazo:atrasado', atrasado) && !casaCom('prazo:atrasado', hoje));
  assert.ok(casaCom('prazo:hoje', hoje));
  assert.ok(casaCom('prazo:semana', em5) && casaCom('prazo:semana', hoje) && !casaCom('prazo:semana', em40));
  assert.ok(casaCom('prazo:sem', sem) && !casaCom('prazo:sem', atrasado));
  assert.ok(casaCom('prazo:<7d', em5) && casaCom('prazo:<7d', atrasado) && !casaCom('prazo:<7d', em40));
  assert.ok(casaCom('prazo:>30d', em40) && !casaCom('prazo:>30d', em5));
});
await teste('busca: prazo concluído não é atrasado nem entra em <7d', () => {
  const c = proc({ prazo: prazoEm('1', '2026-10-01', { concluidoEm: '2026-10-02' }) });
  assert.ok(!casaCom('prazo:atrasado', c));
  assert.ok(!casaCom('prazo:<7d', c));
  assert.ok(casaCom('prazo:concluido', c));
});
await teste('busca: caixa:>30d usa o primeiro registro; sem registro não casa', () => {
  const velho = proc({ vistoEm: AGORA - 45 * DIA_MS });
  assert.ok(casaCom('caixa:>30d', velho));
  assert.ok(!casaCom('caixa:>30d', proc({ vistoEm: AGORA - 2 * DIA_MS })));
  assert.ok(!casaCom('caixa:>30d', proc()));
  assert.ok(casaCom('caixa:<3d', proc({ vistoEm: AGORA - 1 * DIA_MS })));
});
await teste('busca: novo, sigilo, grupo, retorno', () => {
  assert.ok(casaCom('novo:sim', proc({ naoVisualizado: true })));
  assert.ok(casaCom('novo:nao', proc()));
  assert.ok(casaCom('sigilo:sim', proc({ sigiloso: true })));
  assert.ok(casaCom('grupo:gerados', proc({ grupo: 'gerados' })));
  assert.ok(!casaCom('grupo:gerados', proc()));
  assert.ok(casaCom('retorno:atrasado', proc({ retornos: [{ tipo: 'programado', descricao: '', atrasado: true }] })));
  assert.ok(casaCom('retorno:sem', proc()));
  const c = { ...CTX, visitaAnterior: AGORA - DIA_MS };
  assert.ok(casa(interpretar('novo:visita'), proc({ vistoEm: AGORA }), c));
  assert.ok(!casa(interpretar('novo:visita'), proc({ vistoEm: AGORA - 5 * DIA_MS }), c));
  assert.ok(!casa(interpretar('novo:visita'), proc({ vistoEm: AGORA }), CTX), 'sem visita anterior não há novo');
});
await teste('busca: operador desconhecido vira texto livre e nunca lança', () => {
  const p = proc({ especificacao: 'reunião às 10:30 em http://x' });
  assert.ok(casaCom('10:30', p));
  assert.ok(casaCom('http:algo', proc({ especificacao: 'veja http:algo' })), 'campo desconhecido vira texto livre');
  assert.doesNotThrow(() => interpretar('::: -: "aberta resp:'));
  assert.deepEqual(interpretar('   ').termos, []);
  assert.equal(filtrarPorBusca([p], '', CTX).length, 1);
});
await teste('busca: tokens para chips; acrescentar e remover sem duplicar', () => {
  const c = interpretar('resp:ana "frase x" -teste');
  assert.deepEqual(c.tokens.map((t) => t.texto), ['resp:ana', '"frase x"', '-teste']);
  assert.equal(c.termos[2]!.negado, true);
  assert.equal(acrescentar('resp:ana', 'tipo', 'Ofício circular'), 'resp:ana tipo:"Ofício circular"');
  assert.equal(acrescentar('resp:ana', 'resp', 'ana'), 'resp:ana');
  assert.equal(remover('resp:ana tipo:x', 'resp:ana'), 'tipo:x');
});

// ---------------- ordem ----------------
await teste('ordem: protocolo por ano e sequência, não por texto', () => {
  assert.deepEqual(chaveProtocolo('99906.713-630.000032/2025-82'), [2025, 32]);
  assert.deepEqual(chaveProtocolo('012.00000178/2025-23'), [2025, 178]);
  const a = proc({ protocolo: '1.2.000100/2024-01' });
  const b = proc({ protocolo: '1.2.000009/2025-01' });
  const c = proc({ protocolo: '1.2.000010/2025-01' });
  assert.deepEqual(ordenar([c, a, b], [{ campo: 'protocolo', decrescente: false }], CTX).map((p) => p.protocolo), [a.protocolo, b.protocolo, c.protocolo]);
  assert.deepEqual(ordenar([a, b, c], [{ campo: 'protocolo', decrescente: true }], CTX).map((p) => p.protocolo), [c.protocolo, b.protocolo, a.protocolo]);
});
await teste('ordem: prazo (atrasados primeiro), sem prazo sempre no fim, nos dois sentidos', () => {
  const sem = proc();
  const atr = proc({ prazo: prazoEm('1', '2026-10-01') });
  const fut = proc({ prazo: prazoEm('2', '2026-12-01') });
  assert.deepEqual(ordenar([sem, fut, atr], [{ campo: 'prazo', decrescente: false }], CTX), [atr, fut, sem]);
  assert.deepEqual(ordenar([sem, atr, fut], [{ campo: 'prazo', decrescente: true }], CTX), [fut, atr, sem]);
});
await teste('ordem: multi-critério e estável', () => {
  const a = proc({ tipo: 'B', atribuicao: ana });
  const b = proc({ tipo: 'A', atribuicao: beto });
  const c = proc({ tipo: 'A', atribuicao: ana });
  const d = proc({ tipo: 'A', atribuicao: ana });
  const r = ordenar([a, b, c, d], [{ campo: 'tipo', decrescente: false }, { campo: 'responsavel', decrescente: false }], CTX);
  assert.deepEqual(r.map((p) => p.id), [c.id, d.id, b.id, a.id]);
});
await teste('ordem: alternar asc -> desc -> nenhuma; Shift acumula', () => {
  let o = alternarOrdem([], 'tipo', false);
  assert.deepEqual(o, [{ campo: 'tipo', decrescente: false }]);
  o = alternarOrdem(o, 'tipo', false);
  assert.deepEqual(o, [{ campo: 'tipo', decrescente: true }]);
  assert.deepEqual(alternarOrdem(o, 'tipo', false), []);
  o = alternarOrdem([{ campo: 'tipo', decrescente: false }], 'prazo', true);
  assert.equal(o.length, 2);
  assert.equal(alternarOrdem(o, 'tipo', true).length, 2);
  assert.equal(alternarOrdem(alternarOrdem(o, 'prazo', true), 'prazo', true).length, 1);
});

// ---------------- grupos ----------------
await teste('grupos: por responsável, sem responsável por último', () => {
  const g = agrupar([proc(), proc({ atribuicao: beto }), proc({ atribuicao: ana })], 'responsavel', CTX);
  assert.deepEqual(g.map((x) => x.chave), ['u:ana', 'u:beto', 'sem']);
});
await teste('grupos: processo com 2 marcadores aparece apenas no último marcador (dataHora ou último da lista)', () => {
  const p = proc({ marcadores: [mk('A'), mk('B')] });
  const g = agrupar([p, proc()], 'marcador', CTX);
  assert.deepEqual(g.map((x) => [x.chave, x.itens.length]), [['m:B', 1], ['sem', 1]]);
  const comData = proc({
    marcadores: [
      { nome: 'Recente', cor: 'preto', texto: '', dataHora: Date.parse('2026-09-14T15:30:00Z') },
      { nome: 'Antigo', cor: 'preto', texto: '', dataHora: Date.parse('2026-09-01T10:00:00Z') },
    ],
  });
  assert.deepEqual(agrupar([comData], 'marcador', CTX).map((x) => x.chave), ['m:Recente']);
});
await teste('grupos: faixas de prazo na ordem fixa, só as que têm itens', () => {
  const ps = [proc(), proc({ prazo: prazoEm('1', '2026-10-01') }), proc({ prazo: prazoEm('2', '2026-10-11') }), proc({ prazo: prazoEm('3', '2026-10-15') }), proc({ prazo: prazoEm('4', '2026-10-30') }), proc({ prazo: prazoEm('5', '2027-03-01') })];
  assert.deepEqual(agrupar(ps, 'prazo', CTX).map((x) => x.chave), ['atrasado', 'hoje', 'semana', 'mes', 'depois', 'sem']);
  assert.equal(agrupar(ps, 'prazo', CTX)[0]!.tom, 'perigo');
  assert.equal(faixaDoPrazo(proc({ prazo: { idProcedimento: '9', origem: 'marcador', inicio: '2026-10-01' } }), CTX), 'desde');
});
await teste('grupos: situação, grupo, anotação, retorno, caixa e nenhum', () => {
  const ps = [proc({ naoVisualizado: true }), proc(), proc({ grupo: 'gerados', anotacao: { texto: 'x', autor: '', prioridade: true } }), proc({ retornos: [{ tipo: 'aguardando', descricao: '', atrasado: false }], vistoEm: AGORA - 40 * DIA_MS })];
  assert.deepEqual(agrupar(ps, 'situacao', CTX).map((x) => x.chave), ['novo', 'lido']);
  assert.deepEqual(agrupar(ps, 'grupo', CTX).map((x) => x.chave), ['recebidos', 'gerados']);
  assert.deepEqual(agrupar(ps, 'anotacao', CTX).map((x) => x.chave), ['prio', 'sem']);
  assert.deepEqual(agrupar(ps, 'retorno', CTX).map((x) => x.chave), ['aguardando', 'sem']);
  assert.deepEqual(agrupar(ps, 'caixa', CTX).map((x) => x.chave), ['antigo', 'desconhecido']);
  assert.equal(agrupar(ps, 'nenhum', CTX).length, 1);
});
await teste('grupos: achatar respeita grupos recolhidos e a ausência de cabeçalho', () => {
  const g = agrupar([proc({ atribuicao: ana }), proc({ atribuicao: ana }), proc({ atribuicao: beto })], 'responsavel', CTX);
  assert.equal(achatar(g, new Set(), true).length, 5);
  assert.equal(achatar(g, new Set(['u:ana']), true).length, 3);
  assert.equal(achatar(agrupar([proc(), proc()], 'nenhum', CTX), new Set(), false).length, 2);
});

// ---------------- idade ----------------
await teste('idade: primeira vez fixa o instante; não muda depois', () => {
  const e1 = registrarVistos(estadoVazio(), ['1', '2'], 1000, false);
  const e2 = registrarVistos(e1, ['1', '3'], 5000, false);
  assert.deepEqual(e2.vistoEm, { '1': 1000, '2': 1000, '3': 5000 });
  assert.deepEqual(e1.vistoEm, { '1': 1000, '2': 1000 }, 'não altera o estado recebido');
});
await teste('idade: só poda ausentes em carga completa', () => {
  const e1 = registrarVistos(estadoVazio(), ['1', '2'], 1000, true);
  assert.deepEqual(Object.keys(registrarVistos(e1, ['1'], 2000, false).vistoEm).sort(), ['1', '2']);
  assert.deepEqual(Object.keys(registrarVistos(e1, ['1'], 2000, true).vistoEm), ['1']);
});
await teste('idade: teto de registros guarda os mais recentes', () => {
  const ids = Array.from({ length: MAX_REGISTROS + 50 }, (_, i) => String(i));
  const e = registrarVistos({ vistoEm: Object.fromEntries(ids.slice(0, 50).map((id, i) => [id, i + 1])) }, ids, 1_000_000, false);
  assert.equal(Object.keys(e.vistoEm).length, MAX_REGISTROS);
});
await teste('idade: visita vira a página só depois da janela', () => {
  const a = abrirVisita(estadoVazio(), 1000);
  assert.deepEqual([a.visitaAtual, a.visitaAnterior], [1000, undefined]);
  const b = abrirVisita(a, 1000 + JANELA_VISITA - 1);
  assert.equal(b.visitaAtual, 1000);
  const c = abrirVisita(a, 1000 + JANELA_VISITA + 1);
  assert.deepEqual([c.visitaAnterior, c.visitaAtual], [1000, 1000 + JANELA_VISITA + 1]);
});
await teste('idade: estado ruim do storage vira estado vazio; comIdade não muta', () => {
  assert.deepEqual(normalizarEstado('lixo'), estadoVazio());
  assert.deepEqual(normalizarEstado({ vistoEm: { a: 5, b: 'x', c: -1 }, visitaAtual: 'z' }), { vistoEm: { a: 5 } });
  const p = proc({ id: 'a' });
  assert.equal(comIdade([p], { vistoEm: { a: 7 } })[0]!.vistoEm, 7);
  assert.equal(p.vistoEm, undefined);
  assert.deepEqual([rotuloIdade(0), rotuloIdade(1), rotuloIdade(10), rotuloIdade(90), rotuloIdade(800), rotuloIdade(null)], ['hoje', '1 dia', '10 dias', '3 meses', '2 anos', '']);
});

// ---------------- visões ----------------
await teste('visões: normalizar aceita lixo e limita tamanhos', () => {
  assert.deepEqual(normalizarVisao(null), visaoPadrao());
  const v = normalizarVisao({ nome: '  '.padEnd(80, 'x'), busca: 'a', ordem: [{ campo: 'prazo', decrescente: 1 }, { campo: 'inexistente' }], agrupar: 'xyz', modo: 'quadro', colunas: ['prazo', 'prazo', 'zzz'], quadro: { limite: 500, colunas: 'tipo' } });
  assert.equal(v.nome.length, 40);
  assert.deepEqual(v.ordem, [{ campo: 'prazo', decrescente: false }]);
  assert.equal(v.agrupar, 'nenhum');
  assert.equal(v.modo, 'quadro');
  assert.deepEqual(v.colunas, ['prazo']);
  assert.equal(v.quadro.limite, 99);
});
await teste('visões: salvar, atualizar, renomear, excluir e teto', () => {
  let n = 0;
  const id = () => `v${++n}`;
  const base = { ...visaoPadrao(), nome: 'Minhas', busca: 'resp:eu' };
  const r1 = salvarVisao([], base, id)!;
  assert.equal(r1.visao.id, 'v1');
  const r2 = salvarVisao(r1.lista, { ...r1.visao, busca: 'prazo:atrasado' }, id)!;
  assert.equal(r2.lista.length, 1);
  assert.equal(r2.lista[0]!.busca, 'prazo:atrasado');
  assert.equal(renomearVisao(r2.lista, 'v1', 'Outra')[0]!.nome, 'Outra');
  assert.equal(renomearVisao(r2.lista, 'v1', '   ')[0]!.nome, 'Minhas');
  assert.deepEqual(excluirVisao(r2.lista, 'v1'), []);
  let cheia = r2.lista;
  for (let i = 0; i < MAX_VISOES; i++) cheia = salvarVisao(cheia, { ...base, id: '' }, id)?.lista ?? cheia;
  assert.equal(cheia.length, MAX_VISOES);
  assert.equal(salvarVisao(cheia, { ...base, id: '' }, id), null);
  assert.deepEqual(normalizarLista([{ ...base, id: 'a' }, { ...base, id: 'a' }, { ...base }]).length, 1);
  assert.equal(mudouDe(base, { ...base, nome: 'x', id: 'y' }), false);
  assert.equal(mudouDe(base, { ...base, busca: 'z' }), true);
});

// ---------------- quadro ----------------
await teste('quadro: por marcador oculta colunas vazias, ordena por quantidade decrescente e respeita ordemColunas', () => {
  const ps = [
    proc({ marcadores: [mk('B')] }),
    proc({ marcadores: [mk('B')] }),
    proc({ marcadores: [mk('C')] }),
    proc(),
  ];
  const cols = montarQuadro(ps, { colunas: 'marcador', limite: 0, raiasPorResponsavel: false }, CTX, { marcadores: ['A', 'B', 'C', 'Vazio'] });
  assert.deepEqual(cols.map((c) => [c.chave, c.itens.length]), [['m:B', 2], ['m:C', 1], ['sem', 1]]);
  assert.ok(cols.every((c) => c.aceitaSoltar));
  const reordenadas = montarQuadro(ps, { colunas: 'marcador', limite: 0, raiasPorResponsavel: false, ordemColunas: ['sem', 'm:C'] }, CTX, { marcadores: ['A', 'B', 'C'] });
  assert.deepEqual(reordenadas.map((c) => c.chave), ['sem', 'm:C', 'm:B']);
  assert.deepEqual(reordenarColunas(['m:B', 'm:C', 'sem'], 'sem', 'm:B'), ['sem', 'm:B', 'm:C']);
});
await teste('quadro: limite marca coluna excedida; prazo e tipo são só leitura', () => {
  const ps = [proc({ marcadores: [mk('A')] }), proc({ marcadores: [mk('A')] }), proc({ marcadores: [mk('A')] })];
  const cols = montarQuadro(ps, { colunas: 'marcador', limite: 2, raiasPorResponsavel: false }, CTX);
  assert.equal(cols.find((c) => c.chave === 'm:A')!.excedeu, true);
  const porPrazo = montarQuadro(ps, { colunas: 'prazo', limite: 0, raiasPorResponsavel: false }, CTX);
  assert.ok(porPrazo.every((c) => !c.aceitaSoltar && c.motivoSomenteLeitura));
  assert.ok(montarQuadro(ps, { colunas: 'tipo', limite: 0, raiasPorResponsavel: false }, CTX).every((c) => !c.aceitaSoltar));
});
await teste('quadro: colunasVazias traz de volta os marcadores sem processos como destinos de soltar', () => {
  const ps = [proc({ marcadores: [mk('B')] }), proc()];
  const cols = montarQuadro(ps, { colunas: 'marcador', limite: 0, raiasPorResponsavel: false, colunasVazias: true }, CTX, { marcadores: ['A', 'B', 'Vazio'] });
  assert.deepEqual(cols.map((c) => [c.chave, c.itens.length]).sort(), [['m:A', 0], ['m:B', 1], ['m:Vazio', 0], ['sem', 1]]);
  assert.ok(cols.every((c) => c.aceitaSoltar));
});

await teste('csv completo: neutraliza fórmula (inclusive iniciada por -) e mantém o "-" das células vazias', () => {
  const saida = gerarCsvLegado([['-', '=1+1', '-2+3', '@x', 'a;b']]);
  assert.equal(saida, "\uFEFF-;'=1+1;'-2+3;'@x;ab");
});

await teste('quadro: mover marcador A -> B remove A, põe B e leva o texto', () => {
  const p = proc({ marcadores: [mk('A', 'Até 20/10/2026'), mk('Z')] });
  const r = planejarMovimento('marcador', p, 'm:A', 'm:B');
  assert.ok(r.ok);
  assert.deepEqual(r.ok && r.movimento, { tipo: 'marcador', id: p.id, protocolo: p.protocolo, remover: 'A', adicionar: 'B', texto: 'Até 20/10/2026' });
  const novo = aplicarMovimento(p, r.ok ? r.movimento : (undefined as never));
  assert.deepEqual(novo.marcadores.map((m) => m.nome), ['Z', 'B']);
  assert.deepEqual(p.marcadores.map((m) => m.nome), ['A', 'Z'], 'não muta');
});
await teste('quadro: de "sem marcador" só adiciona; para "sem marcador" só remove; destino que já existe só remove', () => {
  const p = proc({ marcadores: [mk('A'), mk('B')] });
  const sem = proc();
  assert.deepEqual((planejarMovimento('marcador', sem, 'sem', 'm:B') as any).movimento.adicionar, 'B');
  assert.equal((planejarMovimento('marcador', p, 'm:A', 'sem') as any).movimento.adicionar, undefined);
  const dup = planejarMovimento('marcador', p, 'm:A', 'm:B') as any;
  assert.equal(dup.movimento.remover, 'A');
  assert.equal(dup.movimento.adicionar, undefined);
  assert.equal(planejarMovimento('marcador', p, 'm:A', 'm:A').ok, false);
  assert.equal(planejarMovimento('marcador', sem, 'm:A', 'm:B').ok, false, 'marcador de origem que o processo não tem');
});
await teste('quadro: mover responsável atribui ou remove; outros modos recusam', () => {
  const p = proc({ atribuicao: ana });
  const r = planejarMovimento('responsavel', p, 'u:ana', 'u:beto');
  assert.deepEqual(r.ok && r.movimento, { tipo: 'atribuicao', id: p.id, protocolo: p.protocolo, para: 'beto', de: 'ana' });
  assert.equal(aplicarMovimento(p, (r as any).movimento, { beto: 'Beto Lima' }).atribuicao!.nome, 'Beto Lima');
  assert.equal(aplicarMovimento(p, { tipo: 'atribuicao', id: p.id, protocolo: p.protocolo, para: null, de: 'ana' }).atribuicao, undefined);
  assert.equal(planejarMovimento('prazo', p, 'hoje', 'semana').ok, false);
  assert.equal(planejarMovimento('tipo', p, 't:A', 't:B').ok, false);
});

// ---------------- facetas, CSV, janela ----------------
await teste('facetas: contagens por responsável, tipo, marcador e prazo', () => {
  const f = facetasDe([proc({ atribuicao: ana, marcadores: [mk('A')], prazo: prazoEm('1', '2026-10-01') }), proc({ atribuicao: ana }), proc()], CTX);
  assert.deepEqual(f.responsaveis.map((x) => [x.valor, x.n]), [['ana', 2], ['sem', 1]]);
  assert.deepEqual(f.marcadores.map((x) => [x.valor, x.n]), [['sem', 2], ['A', 1]]);
  assert.equal(f.prazos.find((x) => x.valor === 'atrasado')!.n, 1);
});
await teste('CSV: cabeçalho, colunas escolhidas e fórmula neutralizada', async () => {
  const { gerarCsv } = await import('../../sei-comum/src/csv');
  const p = proc({ protocolo: '1/2026-1', especificacao: '=HYPERLINK("x")', atribuicao: ana, marcadores: [mk('A', 'txt')], naoVisualizado: true, prazo: prazoEm('1', '2026-10-01') });
  const l = linhasCsv([p], ['processo', 'especificacao', 'responsavel', 'marcadores', 'prazo', 'sinais'], CTX);
  assert.deepEqual(l[0], ['Processo', 'Especificação', 'Responsável', 'Marcadores', 'Prazo', 'Sinais']);
  assert.deepEqual(l[1], ['1/2026-1', '=HYPERLINK("x")', 'Ana Souza (ana)', 'A: txt', '01/10/2026 (10 dias de atraso)', 'Não visualizado']);
  const csv = gerarCsv(l);
  assert.ok(csv.startsWith('﻿'));
  assert.ok(csv.includes(`"'=HYPERLINK`) || csv.includes(`'=HYPERLINK`));
  assert.deepEqual(sinaisDe(proc({ sigiloso: true, retornos: [{ tipo: 'programado', descricao: '', atrasado: true }] })), ['Sigiloso', 'Retorno programado (atrasado)']);
});
await teste('janela: só as linhas visíveis mais a sobra; espaçadores somam o total', () => {
  const j = calcularJanela(10_000, 40, 4000, 800, 5);
  assert.deepEqual([j.inicio, j.fim], [95, 125]);
  assert.equal(j.antes + (j.fim - j.inicio) * 40 + j.depois, 10_000 * 40);
  assert.deepEqual(calcularJanela(0, 40, 0, 800), { inicio: 0, fim: 0, antes: 0, depois: 0 });
  assert.ok(calcularJanela(100, 40, 0, 0).fim > 0, 'sem layout ainda desenha um bloco');
  assert.equal(calcularJanela(10, 40, 99999, 800).inicio, 10);
});

await teste('busca: parado (última movimentação), prioridade, interessado; ordem por parado', () => {
  const velho = proc({ ultimaMov: '2026-08-01', prioridade: 'Alta', interessados: 'Maria Silva; João' });
  const novo = proc({ ultimaMov: '2026-10-10' });
  assert.ok(casaCom('parado:>30d', velho) && !casaCom('parado:>30d', novo));
  assert.ok(casaCom('parado:<3d', novo) && !casaCom('parado:<3d', proc()));
  assert.ok(casaCom('prio:alta', velho) && casaCom('interessado:maria', velho) && casaCom('joao', velho));
  assert.deepEqual(ordenar([novo, proc(), velho], [{ campo: 'parado', decrescente: true }], CTX).map((p) => p.ultimaMov), ['2026-08-01', '2026-10-10', undefined]);
});

// ---------------- edicoes dinamicas ----------------
import { alvosDaEdicao, aplicarAnotacao, aplicarMarcadores, aplicarResponsavel, planoMarcadores, textoAnotacao, MAX_ANOTACAO } from '../src/modelo/edicoes';
await teste('edicoes: plano de marcadores — remove, acrescenta, muda texto; nada a fazer quando igual', () => {
  const atuais = [mk('A', 'x'), mk('B'), mk('C', 'velho')];
  const ops = planoMarcadores(atuais, [{ nome: 'a', texto: 'x' }, { nome: 'C', texto: 'novo' }, { nome: 'D', texto: '  t  ' }]);
  assert.deepEqual(ops, [{ tipo: 'remover', nome: 'B' }, { tipo: 'adicionar', nome: 'D', texto: 't' }, { tipo: 'texto', nome: 'C', texto: 'novo' }]);
  assert.deepEqual(planoMarcadores(atuais, atuais.map((m) => ({ nome: m.nome, texto: m.texto }))), []);
  assert.deepEqual(planoMarcadores([], [{ nome: ' ', texto: 'x' }, { nome: 'A', texto: '' }, { nome: 'a', texto: '' }]), [{ tipo: 'adicionar', nome: 'A', texto: '' }]);
  assert.equal(planoMarcadores([], [{ nome: 'A', texto: 'z'.repeat(400) }])[0]!.tipo, 'adicionar');
  assert.equal((planoMarcadores([], [{ nome: 'A', texto: 'z'.repeat(400) }])[0] as { texto: string }).texto.length, 250);
});
await teste('edicoes: aplicar marcadores nao muta e leva a cor conhecida', () => {
  const p = proc({ marcadores: [mk('A', 't1'), mk('B')] });
  const novo = aplicarMarcadores(p, [{ tipo: 'remover', nome: 'B' }, { tipo: 'adicionar', nome: 'Z', texto: 'q' }, { tipo: 'texto', nome: 'A', texto: 'T2' }], (n) => (n === 'Z' ? 'verde' : ''));
  assert.deepEqual(novo.marcadores, [{ nome: 'A', cor: 'preto', texto: 'T2' }, { nome: 'Z', cor: 'verde', texto: 'q' }]);
  assert.equal(p.marcadores.length, 2);
});
await teste('edicoes: anotacao — limite, vazio remove, prioridade cai junto', () => {
  assert.equal(textoAnotacao('  a\r\nb  '), 'a\nb');
  assert.equal(textoAnotacao('x'.repeat(900)).length, MAX_ANOTACAO);
  const p = proc({ anotacao: { texto: 'velha', autor: 'ana', prioridade: true } });
  assert.equal(aplicarAnotacao(p, '   ', true).anotacao, undefined);
  const n = aplicarAnotacao(p, 'nova', false);
  assert.deepEqual(n.anotacao, { texto: 'nova', autor: 'ana', prioridade: false });
  assert.deepEqual(aplicarAnotacao(proc(), 'primeira', true, 'eu').anotacao, { texto: 'primeira', autor: 'eu', prioridade: true });
});
await teste('edicoes: responsavel e alvos (clicado + selecionados, so os permitidos)', () => {
  const p = proc({ atribuicao: ana });
  assert.equal(aplicarResponsavel(p, null).atribuicao, undefined);
  assert.equal(aplicarResponsavel(p, beto).atribuicao!.sigla, 'beto');
  const a = proc(); const b = proc(); const c = proc({ sigiloso: true });
  const todos = [a, b, c];
  assert.deepEqual(alvosDaEdicao(a, new Set([b.id, c.id]), todos, false, () => true).map((x) => x.id), [a.id]);
  assert.deepEqual(alvosDaEdicao(a, new Set([b.id, c.id]), todos, true, () => true).map((x) => x.id), [a.id, b.id, c.id]);
  assert.deepEqual(alvosDaEdicao(a, new Set([b.id, c.id]), todos, true, (x) => !x.sigiloso).map((x) => x.id), [a.id, b.id]);
});
await teste('edicoes: as mesmas operacoes valem para outro processo so onde fazem sentido', async () => {
  const { opsParaProcesso } = await import('../src/modelo/edicoes');
  const ops = [{ tipo: 'remover' as const, nome: 'B' }, { tipo: 'adicionar' as const, nome: 'D', texto: '' }, { tipo: 'texto' as const, nome: 'C', texto: 'n' }];
  const outro = proc({ marcadores: [mk('b'), mk('D')] });
  assert.deepEqual(opsParaProcesso(ops, outro), [{ tipo: 'remover', nome: 'B' }]);
  assert.deepEqual(opsParaProcesso(ops, proc()).map((o) => o.tipo), ['adicionar']);
});

// ---------------- lista de tarefas na anotacao ----------------
import { alternarFeito, alternarLista, contarTarefas, escreverNota, lerNota, resumoDaNota } from '../src/modelo/checklist';
await teste('checklist: ler e escrever o formato [ ] / [X] sem perder nada', () => {
  const txt = 'Aguardando parecer.\n\n[X] Minuta pronta\n[ ] Parecer juridico\n[x] minusculo';
  const l = lerNota(txt);
  assert.deepEqual(l.map((x) => x.marca), [null, null, true, false, true]);
  assert.equal(l[3]!.texto, 'Parecer juridico');
  assert.equal(escreverNota(l), 'Aguardando parecer.\n\n[X] Minuta pronta\n[ ] Parecer juridico\n[X] minusculo');
  assert.equal(escreverNota(lerNota('so texto\r\noutra')), 'so texto\noutra');
});
await teste('checklist: alternar lista liga nas linhas, desliga se todas ja eram tarefas', () => {
  const base = lerNota('a\nb\n[ ] c');
  const ligou = alternarLista(base, [0, 1]);
  assert.deepEqual(ligou.map((x) => x.marca), [false, false, false]);
  assert.deepEqual(alternarLista(ligou, [0, 1]).map((x) => x.marca), [null, null, false]);
  assert.deepEqual(alternarLista(base, [1, 2]).map((x) => x.marca), [null, false, false], 'mistura: liga todas');
  assert.deepEqual(alternarLista(base, []), base);
  assert.deepEqual(alternarLista(base, [9]), base);
});
await teste('checklist: marcar feito so em tarefa; contagem; resumo da celula', () => {
  const l = lerNota('x\n[ ] a\n[X] b');
  assert.equal(alternarFeito(l, 0)[0]!.marca, null);
  assert.equal(alternarFeito(l, 1)[1]!.marca, true);
  assert.deepEqual(contarTarefas(l), { feitas: 1, total: 2 });
  assert.equal(resumoDaNota('Nota\n\n[X] ok\n[ ] falta'), 'Nota / ☑ ok / ☐ falta');
});
