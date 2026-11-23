import assert from 'node:assert/strict';
import { acoesDaBarra } from '../src/leitura/barra';
import { lerTabelas } from '../src/leitura/tabela';
import { docDe, docFixture, fixture, teste } from './util';

await teste('leitura: caixa real do SEI 4.1.5 (10 processos, total e página)', () => {
  const l = lerTabelas(docFixture('caixa_prazos.html'));
  assert.equal(l.visao, 'resumida');
  assert.equal(l.processos.length, 10);
  assert.equal(l.totais.recebidos, 300);
  assert.equal(l.porPagina.recebidos, 100);
  assert.ok(l.processos.every((p) => p.naPaginaAtual && p.pagina === 0));
});
await teste('leitura: tipo, especificação, protocolo e id vêm do checkbox', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '148265')!;
  assert.equal(p.protocolo, '99906.713-630.000032/2025-82');
  assert.equal(p.tipo, 'Processo de contratação de serviços de informática e automação');
  assert.equal(p.especificacao, 'CAU contrato');
  assert.equal(p.grupo, 'recebidos');
});
await teste('leitura: marcadores com nome e cor, anotação e prazo nativo da mesma linha', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '148265')!;
  assert.deepEqual(p.marcadores.map((m) => [m.nome, m.cor]), [['Para Pessoa assinar', 'azul_marinho'], ['teste', 'preto']]);
  assert.equal(p.anotacao?.texto, 'teste');
  assert.equal(p.anotacao?.autor, 'usuario02 em 22/09/2026 08:55');
  assert.equal(p.prazo?.vencimento, '2026-10-16');
  assert.equal(p.prazo?.origem, 'nativo');
});
await teste('leitura: atribuição traz sigla e nome completo', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '157584')!;
  assert.deepEqual(p.atribuicao, { sigla: 'teste01', nome: 'Usuário de Teste 1' });
});
await teste('leitura: sigiloso não entrega especificação, marcadores nem anotação', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '157584')!;
  assert.equal(p.sigiloso, true);
  assert.equal(p.especificacao, '');
  assert.deepEqual(p.marcadores, []);
  assert.equal(p.anotacao, undefined);
  assert.equal(p.prazo, undefined);
});
await teste('leitura: retorno programado e aguardando, com atraso', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '21831')!;
  assert.deepEqual(p.retornos.map((r) => [r.tipo, r.atrasado]), [['programado', true], ['aguardando', true]]);
  assert.equal(p.prazo?.vencimento, '2023-05-20');
});
await teste('leitura: não visualizado vem da classe do link', () => {
  const ps = lerTabelas(docFixture('caixa_prazos.html')).processos;
  assert.equal(ps.filter((p) => p.naoVisualizado).length, (fixture('caixa_prazos.html').match(/class="processoNaoVisualizado"/g) ?? []).length);
  assert.ok(ps.some((p) => p.naoVisualizado));
});
await teste('leitura: caixa de 8 linhas e caixa com prazo concluído', () => {
  assert.equal(lerTabelas(docFixture('caixa_sem_prazo_nativo.html')).processos.length, 8);
  assert.ok(lerTabelas(docFixture('caixa_concluido.html')).processos.some((p) => p.prazo?.concluidoEm));
});
await teste('leitura: tabela vazia ou ausente não quebra', () => {
  const l = lerTabelas(docDe('<html><body><form></form></body></html>'));
  assert.deepEqual(l.processos, []);
  assert.equal(l.totais.recebidos, 0);
});
await teste('leitura: página buscada marca naPaginaAtual falso e a página', () => {
  const l = lerTabelas(docFixture('caixa_prazos.html'), { pagina: 2, naPaginaAtual: false });
  assert.ok(l.processos.every((p) => !p.naPaginaAtual && p.pagina === 2));
});
await teste('leitura: visão detalhada mapeia colunas pelo cabeçalho, não pela posição', () => {
  const html = `<body><table id="tblProcessosDetalhado"><caption>Processos (3 registros - 1 a 3):</caption>
  <tr><th></th><th>Responsável</th><th>Processo</th><th>Tipo</th><th>Marcador</th></tr>
  <tr id="P9"><td><input type="checkbox" name="chkRecebidosItem0" title="1.2/2026-1" value="9" aria-label="Tipo Ofício / Especificação X"></td>
  <td>(ana)</td><td><a class="processoVisualizado" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=9">1.2/2026-1</a></td><td>Ofício</td><td>Urgente</td></tr></table></body>`;
  const p = lerTabelas(docDe(html)).processos[0]!;
  assert.equal(lerTabelas(docDe(html)).visao, 'detalhada');
  assert.equal(p.id, '9');
  assert.equal(p.tipo, 'Ofício');
  assert.equal(p.atribuicao?.sigla, 'ana');
  assert.equal(p.marcadores[0]?.nome, 'Urgente');
});
await teste('barra: ações nativas com ícone e rótulo do próprio SEI', () => {
  const doc = docFixture('caixa_prazos.html');
  const a = acoesDaBarra(doc);
  assert.ok(a.length >= 9);
  assert.deepEqual(a.slice(0, 3).map((x) => x.acao), ['procedimento_enviar', 'procedimento_atualizar_andamento', 'procedimento_atribuicao_cadastrar']);
  assert.equal(a[0]!.rotulo, 'Enviar Processo');
});
await teste('leitura: detalhada traz última movimentação, prioridade, interessados e observação', () => {
  const html = `<body><table id="tblProcessosDetalhado"><caption>Detalhada (1 registro):</caption>
  <tr><th></th><th></th><th>Processo</th><th>Prioridade</th><th>Interessados</th><th>Observação</th><th>Última&nbsp;Mov.</th></tr>
  <tr id="P7"><td><input type="checkbox" name="chkDetalhadoItem0" title="1/2026-1" value="7" aria-label="Tipo Ofício / Especificação X"></td><td></td>
  <td><a class="processoVisualizado" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=7">1/2026-1</a></td><td>Alta</td><td><div>Maria; João</div></td><td>ver contrato</td><td>03/10/2026</td></tr></table></body>`;
  const p = lerTabelas(docDe(html)).processos[0]!;
  assert.deepEqual([p.prioridade, p.interessados, p.observacao, p.ultimaMov], ['Alta', 'Maria; João', 'ver contrato', '2026-10-03']);
});
await teste('leitura: link do processo vem do próprio SEI (assinado), sem inventar', () => {
  const p = lerTabelas(docFixture('caixa_prazos.html')).processos.find((x) => x.id === '148265')!;
  assert.match(p.link!, /^controlador\.php\?acao=procedimento_trabalhar&acao_origem=procedimento_controlar.*id_procedimento=148265/);
  assert.match(p.linkMarcadores!, /^controlador\.php\?acao=andamento_marcador_gerenciar.*id_procedimento=148265/);
});
await teste('leitura: datasMarcadores extrai data/hora real de cada marcador da tela andamento_marcador_gerenciar', async () => {
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const { lerDatasMarcadores } = await import('../src/leitura/datasMarcadores');
  const html = readFileSync(resolve(import.meta.dirname, '../../sei-nucleo/tests/fixtures/sei41/p_andamento_marcador_gerenciar.html'), 'latin1');
  const datas = lerDatasMarcadores(docDe(html));
  assert.ok(datas['para bruna assinar']! > datas['teste']!, 'Para Bruna assinar (04:32) deve ser mais recente que teste (03:53)');
});
