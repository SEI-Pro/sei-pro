import assert from 'node:assert/strict';
import { areaMemoria } from '../../sei-comum/src/armazenamento/area';
import { acoesDaBarra } from '../src/leitura/barra';
import { lerTabelas } from '../src/leitura/tabela';
import { criarArmazem } from '../src/persistencia/armazem';
import type { DepsMover } from '../src/acoes/mover';
import { criarApp, type DepsApp } from '../src/ui/app';
import { ativarToggle, docDe, docFixture, proc, teste } from './util';

const q = <T extends Element>(app: { host: HTMLElement }, s: string) => app.host.shadowRoot!.querySelector<T>(s)!;
/** A dica pode estar em data-tip (convertida) ou ainda em title. */
const dicaDe = (e: Element): string => e.getAttribute('data-tip') ?? e.getAttribute('title') ?? '';
const qa = (app: { host: HTMLElement }, s: string) => [...app.host.shadowRoot!.querySelectorAll<HTMLElement>(s)];
const marcadas = (doc: Document) => [...doc.querySelectorAll<HTMLInputElement>('#tblProcessosRecebidos input[type=checkbox]')].filter((c) => c.checked).length;
const tick = () => new Promise((r) => setTimeout(r, 0));

const salvos: Array<[string, string]> = [];
const enviados: Array<[string, string]> = [];
const prazosAbertos: string[] = [];
const anotados: Array<[string, string, boolean]> = [];
async function montar(extra: Partial<DepsApp> = {}, nome = 'caixa_prazos.html') {
  const doc = ativarToggle(docFixture(nome));
  (globalThis as unknown as { document: Document }).document = doc;
  const inicial = lerTabelas(doc);
  const chamadas: string[] = [];
  const mover: DepsMover = {
    marcador: async (p, m) => void chamadas.push(`${p} ${m.remover ? '-' : '+'}${m.marcador}`),
    atribuir: async (p, u) => void chamadas.push(`${p} @${u}`),
  };
  const baixados: Array<[string, string]> = [];
  const app = criarApp({
    doc, inicial, agora: () => Date.UTC(2026, 9, 11, 12), hoje: () => '2026-10-11', eu: 'teste01',
    armazem: criarArmazem({ local: areaMemoria(), sync: areaMemoria() }, 'u'), fonte: null, mover,
    acoes: () => acoesDaBarra(doc), css: '', escuro: false, baixar: (n, c) => void baixados.push([n, c]), novoId: () => 'id1', semDebounce: true,
    aoVoltarNativa: () => undefined,
    enviarAcao: (url, plano) => void enviados.push([url, JSON.stringify(plano.porGrupo)]),
    editarEspecificacao: async (p, t) => void salvos.push([p, t]),
    abrirPrazo: (id) => void prazosAbertos.push(id),
    anotar: async (p, a) => void anotados.push([p, a.texto, a.prioridade]),
    ...extra,
  });
  doc.body.append(app.host);
  await app.iniciar();
  await tick();
  return { app, doc, chamadas, baixados };
}
const linhas = (app: { host: HTMLElement }) => qa(app, '.spro-linha');

await teste('app: renderiza as linhas da caixa real, com protocolo e contagem', async () => {
  const { app } = await montar();
  assert.equal(linhas(app).length, 10);
  assert.match(q(app, '.spro-status').textContent!, /10 de 10 processos/);
  assert.ok(qa(app, '.spro-proc').some((a) => a.textContent === '99906.713-630.000032/2025-82'));
  app.fechar();
});
await teste('app: definirTema troca claro/escuro com a grade aberta (host e raiz)', async () => {
  const { app } = await montar();
  assert.equal(app.host.getAttribute('data-tema'), 'claro');
  app.definirTema(true);
  assert.equal(app.host.getAttribute('data-tema'), 'escuro');
  assert.ok(app.host.shadowRoot!.querySelector('.spro-app')!.classList.contains('spro-escuro'));
  app.definirTema(false);
  assert.equal(app.host.getAttribute('data-tema'), 'claro');
  assert.ok(!app.host.shadowRoot!.querySelector('.spro-app')!.classList.contains('spro-escuro'));
  app.fechar();
});
await teste('app: nada do SEI vira HTML (texto malicioso continua texto)', async () => {
  const doc = docFixture('caixa_prazos.html');
  const { app } = await montar({ inicial: (() => { const l = lerTabelas(doc); l.processos[0]!.especificacao = '<img src=x onerror=alert(1)>'; return l; })() });
  assert.equal(app.host.shadowRoot!.querySelector('img[src="x"]'), null);
  app.definirVisao({ colunas: ['processo', 'especificacao'] });
  assert.equal(app.host.shadowRoot!.querySelector('img[src="x"]'), null);
  assert.ok(qa(app, '.spro-corta').some((e) => e.textContent === '<img src=x onerror=alert(1)>'));
  app.fechar();
});
await teste('app: a busca filtra e o chip aparece; remover o chip restaura', async () => {
  const { app } = await montar();
  const busca = q<HTMLInputElement>(app, '.spro-busca');
  busca.value = 'resp:teste01';
  busca.dispatchEvent(new (busca.ownerDocument.defaultView as any).Event('input'));
  assert.equal(linhas(app).length, 4);
  assert.equal(qa(app, '.spro-chip').length, 1);
  q<HTMLButtonElement>(app, '.spro-chip button').click();
  assert.equal(linhas(app).length, 10);
  assert.equal(qa(app, '.spro-chip').length, 0);
  app.fechar();
});
await teste('app: o filtro externo (pesquisa rápida) soma-se à busca sem alterá-la nem criar chip, e vazio limpa', async () => {
  const { app } = await montar();
  assert.equal(linhas(app).length, 10);
  app.definirFiltroExterno('bruno');
  assert.equal(linhas(app).length, 1);
  assert.equal(qa(app, '.spro-chip').length, 0);
  assert.equal(q<HTMLInputElement>(app, '.spro-busca').value, '');
  assert.match(q(app, '.spro-status').textContent!, /filtro da pesquisa rápida: bruno/);
  app.definirFiltroExterno('');
  assert.equal(linhas(app).length, 10);
  assert.doesNotMatch(q(app, '.spro-status').textContent!, /pesquisa rápida/);
  app.fechar();
});
await teste('app: filtro rápido liga e desliga o termo', async () => {
  const { app } = await montar();
  const atrasados = qa(app, '.spro-rapido').find((b) => b.textContent === 'Atrasados')!;
  atrasados.click();
  assert.equal(app.estado().visao.busca, 'prazo:atrasado');
  assert.ok(linhas(app).length > 0 && linhas(app).length < 10);
  qa(app, '.spro-rapido').find((b) => b.textContent === 'Atrasados')!.click();
  assert.equal(app.estado().visao.busca, '');
  app.fechar();
});
await teste('app: agrupar mostra cabeçalhos com contagem e recolher esconde as linhas', async () => {
  const { app } = await montar();
  app.definirVisao({ agrupar: 'prazo' });
  const grupos = qa(app, '.spro-grupo');
  assert.ok(grupos.length >= 2);
  const antes = linhas(app).length;
  qa(app, '.spro-grupo-b')[0]!.click();
  assert.ok(linhas(app).length < antes);
  app.fechar();
});
await teste('app: ordenar pelo cabeçalho alterna o sentido', async () => {
  const { app } = await montar();
  const th = () => qa(app, '.spro-th-b').find((b) => b.textContent!.startsWith('Processo'))!;
  th().click();
  assert.deepEqual(app.estado().visao.ordem, [{ campo: 'protocolo', decrescente: false }]);
  th().click();
  assert.deepEqual(app.estado().visao.ordem, [{ campo: 'protocolo', decrescente: true }]);
  th().click();
  assert.deepEqual(app.estado().visao.ordem, []);
  app.fechar();
});
await teste('app: marcar uma linha clica o checkbox nativo e mostra a barra de lote', async () => {
  const { app, doc } = await montar();
  const cb = q<HTMLInputElement>(app, '.spro-linha input[type=checkbox]');
  cb.checked = true;
  cb.dispatchEvent(new (doc.defaultView as any).Event('change'));
  await tick();
  assert.equal(marcadas(doc), 1);
  assert.equal(q(app, '.spro-lote').hasAttribute('hidden'), false);
  assert.match(q(app, '.spro-lote strong').textContent!, /1 selecionado/);
  assert.ok(qa(app, '.spro-lote .spro-bt').some((b) => dicaDe(b) === 'Enviar Processo'));
  qa(app, '.spro-lote .spro-link').at(-1)!.click();
  await tick();
  assert.equal(marcadas(doc), 0);
  app.fechar();
});
await teste('app: o botão de ação do lote repassa o clique ao link nativo', async () => {
  const { app, doc } = await montar();
  let cliques = 0;
  acoesDaBarra(doc)[0]!.elemento.addEventListener('click', () => cliques++);
  const cb = q<HTMLInputElement>(app, '.spro-linha input[type=checkbox]');
  cb.checked = true;
  cb.dispatchEvent(new (doc.defaultView as any).Event('change'));
  await tick();
  qa(app, '.spro-lote .spro-bt').find((b) => dicaDe(b) === 'Enviar Processo')!.click();
  assert.equal(cliques, 1);
  app.fechar();
});
await teste('app: exportar CSV baixa a visão filtrada', async () => {
  const { app, baixados } = await montar();
  app.definirVisao({ busca: 'resp:teste01' });
  qa(app, '.spro-bt').find((b) => dicaDe(b) === 'Exportar CSV')!.click();
  assert.equal(baixados.length, 1);
  assert.equal(baixados[0]![0], 'processos-2026-10-11.csv');
  assert.equal(baixados[0]![1].split('\r\n').length, 5);
  app.fechar();
});
await teste('app: quadro por marcador; arrastar move (acrescenta e remove) e o aviso oferece desfazer', async () => {
  const { app, chamadas } = await montar();
  app.definirVisao({ modo: 'quadro' });
  const col = (chave: string) => qa(app, '.spro-col').find((c) => c.getAttribute('data-chave') === chave)!;
  // Processo 148265 tem [Para Pessoa assinar, teste]; sem consultarDatasMarcadores usa o ultimo da lista (teste), sem duplicar.
  assert.ok(col('sem') && col('m:teste'));
  assert.equal(col('m:Para Pessoa assinar'), undefined);
  const cartao = [...col('m:teste').querySelectorAll<HTMLElement>('.spro-cartao')][0]!;
  const id = cartao.getAttribute('data-id')!;
  const dt = new Map<string, string>();
  const transfer = { types: ['application/x-spro-cartao'], setData: (k: string, v: string) => dt.set(k, v), getData: (k: string) => dt.get(k) ?? '', effectAllowed: '' };
  const Ev = (cartao.ownerDocument.defaultView as any).Event;
  const ev = (tipo: string) => Object.assign(new Ev(tipo, { bubbles: true, cancelable: true }), { dataTransfer: transfer });
  cartao.dispatchEvent(ev('dragstart'));
  col('sem').dispatchEvent(ev('drop'));
  await tick(); await tick();
  assert.deepEqual(chamadas, ['99906.713-630.000032/2025-82 -teste']);
  assert.equal(id, '148265');
  assert.ok(qa(app, '.spro-aviso').length >= 1);
  app.fechar();
});
await teste('app: quadro consulta data/hora real dos marcadores quando processo tem 2+ marcadores e posiciona no mais recente', async () => {
  const consultados: string[] = [];
  const { app } = await montar({
    consultarDatasMarcadores: async (p) => {
      consultados.push(p.id);
      return {
        'para pessoa assinar': Date.parse('2026-09-14T04:32:00Z'),
        teste: Date.parse('2026-09-14T03:53:00Z'),
      };
    },
  });
  app.definirVisao({ modo: 'quadro' });
  await tick(); await tick();
  assert.deepEqual(consultados, ['148265']);
  const col = (chave: string) => qa(app, '.spro-col').find((c) => c.getAttribute('data-chave') === chave);
  assert.ok(col('m:Para Pessoa assinar'), 'moveu para o marcador com data/hora mais recente');
  assert.equal(col('m:teste'), undefined, 'nao duplica no marcador mais antigo');
  app.fechar();
});
await teste('app: coluna só de leitura (prazo) não aceita soltar', async () => {
  const { app, chamadas } = await montar();
  app.definirVisao({ modo: 'quadro', quadro: { colunas: 'prazo', limite: 0, raiasPorResponsavel: false } });
  assert.ok(qa(app, '.spro-col-trava').length > 0);
  const cartao = qa(app, '.spro-cartao')[0]!;
  const Ev = (cartao.ownerDocument.defaultView as any).Event;
  const transfer = { types: ['application/x-spro-cartao'], setData: () => undefined, getData: () => JSON.stringify({ id: cartao.getAttribute('data-id'), de: 'x' }) };
  qa(app, '.spro-col')[0]!.dispatchEvent(Object.assign(new Ev('drop', { bubbles: true, cancelable: true }), { dataTransfer: transfer }));
  await tick();
  assert.deepEqual(chamadas, []);
  app.fechar();
});
await teste('app: mover que o SEI recusa reverte e avisa', async () => {
  const { app } = await montar({ mover: { marcador: async () => { throw new Error('sem permissão'); }, atribuir: async () => undefined } });
  app.definirVisao({ modo: 'quadro' });
  const ids = () => qa(app, '.spro-col').map((c) => `${c.getAttribute('data-chave')}:${c.querySelectorAll('.spro-cartao').length}`).join();
  const antes = ids();
  const cartao = qa(app, '.spro-col').find((c) => c.getAttribute('data-chave') === 'm:teste')!.querySelector<HTMLElement>('.spro-cartao')!;
  const Ev = (cartao.ownerDocument.defaultView as any).Event;
  const transfer = { types: ['application/x-spro-cartao'], setData: () => undefined, getData: () => JSON.stringify({ id: cartao.getAttribute('data-id'), de: 'm:teste' }) };
  qa(app, '.spro-col').find((c) => c.getAttribute('data-chave') === 'sem')!.dispatchEvent(Object.assign(new Ev('drop', { bubbles: true, cancelable: true }), { dataTransfer: transfer }));
  await tick(); await tick(); await tick();
  assert.equal(ids(), antes);
  assert.match(q(app, '.spro-aviso').textContent!, /sem permissão/);
  app.fechar();
});
await teste('app: quadro reordena colunas por drag/drop, recolhe/expande coluna, ajusta largura e exibe anotacao e especificacao nos cartoes', async () => {
  const local = areaMemoria();
  const sync = areaMemoria();
  const armazem = criarArmazem({ local, sync }, 'u-quadro');
  const anotacoesSalvas: Array<{ protocolo: string; texto: string; prioridade: boolean }> = [];
  const { app } = await montar({
    armazem,
    anotar: async (protocolo, a) => { anotacoesSalvas.push({ protocolo, ...a }); },
  });
  // Injeta anotacao com checklist no processo 148265 para validar renderizacao e marcacao direta no card
  const p = app.estado().todos.find((x) => x.id === '148265')!;
  p.anotacao = { texto: 'Em Assinatura:\n[X] Everton\n[ ] Ricardo', autor: 'usr', prioridade: false };
  app.definirVisao({ modo: 'quadro' });
  const chavesAntes = qa(app, '.spro-col').map((c) => c.getAttribute('data-chave')!);
  assert.ok(chavesAntes.length >= 2);
  // Drag ultima coluna para a primeira posicao
  const origem = chavesAntes[chavesAntes.length - 1]!;
  const destino = chavesAntes[0]!;
  const colDestino = qa(app, '.spro-col').find((c) => c.getAttribute('data-chave') === destino)!;
  const Ev = (colDestino.ownerDocument.defaultView as any).Event;
  const transferCol = { types: ['application/x-spro-coluna'], setData: () => undefined, getData: (t: string) => (t === 'application/x-spro-coluna' ? origem : '') };
  colDestino.dispatchEvent(Object.assign(new Ev('drop', { bubbles: true, cancelable: true }), { dataTransfer: transferCol }));
  await tick();
  const chavesDepois = qa(app, '.spro-col').map((c) => c.getAttribute('data-chave')!);
  assert.equal(chavesDepois[0], origem);
  // Recolher e expandir a primeira coluna
  const btnRecolher = qa(app, '.spro-col')[0]!.querySelector<HTMLButtonElement>('.spro-col-recolher')!;
  btnRecolher.click();
  await tick();
  assert.ok(qa(app, '.spro-col')[0]!.classList.contains('spro-col-recolhida'));
  assert.deepEqual(app.estado().visao.quadro.colunasRecolhidas, [origem]);
  // Expandir novamente para testar o checklist dentro do card
  qa(app, '.spro-col')[0]!.querySelector<HTMLButtonElement>('.spro-col-recolher')!.click();
  await tick();
  assert.ok(!qa(app, '.spro-col')[0]!.classList.contains('spro-col-recolhida'));
  // Aumentar largura das colunas via botao '+'
  const btnMais = qa(app, '.spro-largura-bt')[1]!;
  btnMais.click();
  await tick();
  assert.equal(app.estado().visao.quadro.larguraColuna, 300);
  assert.equal(q<HTMLElement>(app, '.spro-quadro').style.getPropertyValue('--spro-col-largura'), '300px');
  // Cartoes exibem especificacao e anotacao com checklist interativo
  assert.ok(qa(app, '.spro-cartao-espec').length > 0);
  assert.ok(qa(app, '.spro-cartao-anotacao').length > 0);
  const checks = qa(app, '.spro-anot-check');
  assert.equal(checks.length, 2);
  assert.equal(checks[0]!.getAttribute('aria-checked'), 'true');
  assert.equal(checks[1]!.getAttribute('aria-checked'), 'false');
  // Marcar o segundo item do checklist diretamente no card
  (checks[1] as HTMLButtonElement).click();
  await tick(); await tick();
  assert.equal(anotacoesSalvas.length, 1);
  assert.equal(anotacoesSalvas[0]!.texto, 'Em Assinatura:\n[X] Everton\n[X] Ricardo');
  assert.equal(qa(app, '.spro-anot-check')[1]!.getAttribute('aria-checked'), 'true');
  // Clicar no conteiner da anotacao abre o modal de edicao sem sair da tela
  q<HTMLElement>(app, '.spro-cartao-anotacao').click();
  await tick();
  assert.ok(app.host.shadowRoot!.querySelector('.spro-pi-editor'), 'modal de edicao de anotacao aberto');
  // Persistencia no armazem para proximos acessos
  const salvo = await armazem.lerEstado();
  assert.equal(salvo.visao.quadro.ordemColunas?.[0], origem);
  assert.equal(salvo.visao.quadro.larguraColuna, 300);
  app.fechar();
});
await teste('app: visão salva persiste e reaplica (visões no sync)', async () => {
  const sync = areaMemoria();
  const local = areaMemoria();
  const a = await montar({ armazem: criarArmazem({ local, sync }, 'u') });
  a.app.definirVisao({ busca: 'prazo:atrasado', agrupar: 'prazo' });
  qa(a.app, '.spro-bt').find((b) => dicaDe(b) === 'Visões')!.click();
  q<HTMLInputElement>(a.app, '.spro-nome').value = 'Atrasados';
  qa(a.app, '.spro-painel .spro-bt').find((b) => b.textContent === 'Salvar como nova')!.click();
  await tick(); await tick();
  const salvas = await criarArmazem({ local, sync }, 'u').lerVisoes();
  assert.deepEqual(salvas.map((v) => [v.nome, v.busca, v.agrupar]), [['Atrasados', 'prazo:atrasado', 'prazo']]);
  a.app.fechar();
});
await teste('app: atalhos — / foca a busca, g q abre o quadro, ? mostra ajuda; ignora ao digitar', async () => {
  const { app, doc } = await montar();
  const Ev = (doc.defaultView as any).Event;
  const tecla = (key: string, alvo: Element = doc.body) => alvo.dispatchEvent(Object.assign(new Ev('keydown', { bubbles: true, cancelable: true }), { key }));
  tecla('g'); tecla('q');
  assert.equal(app.estado().visao.modo, 'quadro');
  tecla('g'); tecla('t');
  assert.equal(app.estado().visao.modo, 'tabela');
  tecla('?');
  assert.equal(q(app, '.spro-ajuda-atalhos').hasAttribute('hidden'), false);
  const antes = app.estado().visao.modo;
  tecla('g', q(app, '.spro-busca')); tecla('q', q(app, '.spro-busca'));
  assert.equal(app.estado().visao.modo, antes);
  app.fechar();
});
await teste('app: carga progressiva soma as outras páginas e avisa quando falha', async () => {
  const fonte = { pagina: async () => { throw new Error('rede caiu'); }, restaurar: async () => undefined };
  const { app } = await montar({ fonte });
  await tick(); await tick();
  assert.match(q(app, '.spro-status').textContent!, /rede caiu/);
  assert.equal(app.estado().completo, false);
  app.fechar();
});
await teste('app: fechar remove o host e para de ouvir o teclado', async () => {
  const { app, doc } = await montar();
  app.fechar();
  assert.equal(doc.getElementById('spro-grade'), null);
});
await teste('app: agrupar e filtrar usam o seletor pesquisavel (combobox), nao <select> nativo', async () => {
  const { app } = await montar();
  assert.equal(app.host.shadowRoot!.querySelectorAll('select').length, 0);
  const combos = qa(app, 'button.spro-combo');
  assert.ok(combos.length >= 5, String(combos.length));
  const agrupar = combos.find((c) => c.getAttribute('aria-label') === 'Agrupar por')!;
  agrupar.click();
  const opcao = [...app.host.shadowRoot!.querySelectorAll<HTMLElement>('[role=option]')].find((o) => o.textContent!.includes('Prazo'))!;
  opcao.click();
  assert.equal(app.estado().visao.agrupar, 'prazo');
  app.fechar();
});
await teste('app: filtro por responsavel pelo combobox acrescenta o termo e volta ao vazio', async () => {
  const { app } = await montar();
  const resp = qa(app, 'button.spro-combo').find((c) => c.getAttribute('aria-label') === 'Filtrar por responsável')!;
  resp.click();
  const op = [...app.host.shadowRoot!.querySelectorAll<HTMLElement>('[role=option]')].find((o) => o.textContent!.includes('teste01'))!;
  op.click();
  assert.equal(app.estado().visao.busca, 'resp:teste01');
  assert.equal(app.estado().filtrados, 4);
  app.fechar();
});

// ---------------- icones dos modulos, edicao inline, prazo, anotacao, sincronia ----------------
function comIconesNativos(doc: Document, id: string) {
  const td = doc.querySelector(`tr#P${id}`)!.querySelectorAll('td')[1]!;
  const estrela = doc.createElement('button');
  estrela.className = 'spro-fav-estrela spro-fav-icone';
  estrela.setAttribute('aria-pressed', 'true');
  estrela.setAttribute('aria-label', 'Remover dos monitorados');
  const dem = doc.createElement('button');
  dem.className = 'spro-dem-cx';
  dem.setAttribute('data-spro-dem-caixa', '');
  td.prepend(dem);
  td.prepend(estrela);
}
await teste('app: cola na linha os icones que os outros modulos puseram na linha nativa (monitorado, demanda) com data-spro-id', async () => {
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  comIconesNativos(doc, '148265');
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc);
  const cel = qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '148265')!;
  const icones = [...cel.querySelectorAll<HTMLElement>('.spro-icones > button')];
  assert.deepEqual(icones.map((i) => i.className.split(' ')[0]), ['spro-fav-estrela', 'spro-dem-cx']);
  assert.ok(icones.every((i) => i.getAttribute('data-spro-id') === '148265'));
  assert.equal(icones[0]!.getAttribute('aria-pressed'), 'true');
  assert.equal(qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '150098')!.querySelectorAll('.spro-icones > button').length, 0);
  app.fechar();
});
async function montarCom(doc: Document, extra: Partial<DepsApp> = {}) {
  const inicial = lerTabelas(doc);
  const app = criarApp({ doc, inicial, agora: () => Date.UTC(2026, 9, 11, 12), hoje: () => '2026-10-11', eu: 'teste01', armazem: criarArmazem({ local: areaMemoria(), sync: areaMemoria() }, 'u'), fonte: null,
    mover: { marcador: async () => undefined, atribuir: async () => undefined }, acoes: () => acoesDaBarra(doc), css: '', escuro: false, baixar: () => undefined, novoId: () => 'id1', semDebounce: true,
    aoVoltarNativa: () => undefined, enviarAcao: (url, plano) => void enviados.push([url, JSON.stringify(plano.porGrupo)]), editarEspecificacao: async (p, t) => void salvos.push([p, t]), abrirPrazo: (id) => void prazosAbertos.push(id), anotar: async (p, a) => void anotados.push([p, a.texto, a.prioridade]), ...extra });
  doc.body.append(app.host);
  await app.iniciar();
  await tick();
  return { app, doc };
}
await teste('app: a coluna Especificacao vem antes de Tipo e tem lapis; editar salva so com Enter', async () => {
  salvos.length = 0;
  const { app } = await montar();
  const cab = qa(app, '.spro-cab .spro-th').map((c) => c.textContent!.trim());
  assert.ok(cab.indexOf('Especificação') > 0 && cab.indexOf('Especificação') < cab.indexOf('Tipo'), cab.join(','));
  const linha = () => qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '148265')!;
  linha().querySelector<HTMLElement>('.spro-c-especificacao .spro-lapis')!.click();
  const entrada = linha().querySelector<HTMLInputElement>('.spro-espec-input')!;
  assert.equal(entrada.value, 'CAU contrato');
  entrada.value = 'CAU contrato revisto';
  entrada.dispatchEvent(new (entrada.ownerDocument.defaultView as any).Event('input'));
  entrada.dispatchEvent(Object.assign(new (entrada.ownerDocument.defaultView as any).Event('keydown', { bubbles: true }), { key: 'Enter' }));
  await tick(); await tick();
  assert.deepEqual(salvos, [['99906.713-630.000032/2025-82', 'CAU contrato revisto']]);
  assert.equal(linha().querySelector('.spro-c-especificacao .spro-corta')!.textContent, 'CAU contrato revisto');
  app.fechar();
});
await teste('app: Esc cancela a edicao sem salvar; vazio nao salva; falha reverte e avisa', async () => {
  salvos.length = 0;
  const { app } = await montar({ editarEspecificacao: async () => { throw new Error('sem permissão'); } });
  const linha = () => qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '148265')!;
  const abrir = () => linha().querySelector<HTMLElement>('.spro-c-especificacao .spro-lapis')!.click();
  abrir();
  const w = linha().ownerDocument.defaultView as any;
  const tecla = (el: Element, key: string) => el.dispatchEvent(Object.assign(new w.Event('keydown', { bubbles: true }), { key }));
  tecla(linha().querySelector('.spro-espec-input')!, 'Escape');
  assert.equal(linha().querySelector('.spro-espec-input'), null);
  abrir();
  const e1 = linha().querySelector<HTMLInputElement>('.spro-espec-input')!;
  e1.value = 'novo texto'; e1.dispatchEvent(new w.Event('input'));
  tecla(e1, 'Enter');
  await tick(); await tick();
  assert.equal(linha().querySelector('.spro-c-especificacao .spro-corta')!.textContent, 'CAU contrato', 'reverteu');
  assert.match(q(app, '.spro-aviso').textContent!, /sem permissão/);
  app.fechar();
});
await teste('app: sigiloso nao tem lapis de especificacao (o SEI nao a entrega)', async () => {
  const { app } = await montar();
  const sig = qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '157584')!;
  assert.equal(sig.querySelector('.spro-c-especificacao .spro-lapis'), null);
  app.fechar();
});
await teste('app: clicar no prazo abre o menu do modulo de prazos para aquele processo', async () => {
  prazosAbertos.length = 0;
  const { app } = await montar();
  qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '148265')!.querySelector<HTMLElement>('.spro-prazo-b')!.click();
  qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === '150098')!.querySelector<HTMLElement>('.spro-prazo-b')!.click();
  assert.deepEqual(prazosAbertos, ['148265', '150098']);
  app.fechar();
});
await teste('app: sem prazo ainda ha botao "definir prazo" (a celula vazia tambem edita)', async () => {
  const { app } = await montar();
  const l = qa(app, '.spro-linha').find((x) => x.getAttribute('data-id') === '157584')!;
  assert.ok(l.querySelector('.spro-prazo-b .spro-prazo-vazio') || l.querySelector('.spro-prazo-b'));
  app.fechar();
});
await teste('app: no Quadro, clicar no prazo ou em "definir" abre o menu do modulo de prazos', async () => {
  prazosAbertos.length = 0;
  const { app } = await montar();
  qa(app, '.spro-seg-b').find((b) => b.getAttribute('data-modo') === 'quadro')!.click();
  const card = qa(app, '.spro-cartao').find((c) => c.getAttribute('data-id') === '150098');
  assert.ok(card, 'cartao presente no quadro');
  card!.querySelector<HTMLElement>('.spro-prazo-b')!.click();
  assert.deepEqual(prazosAbertos, ['150098']);
  app.fechar();
});
await teste('app: sincroniza com a linha nativa — a estrela clicada em outro modulo aparece na grade', async () => {
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc);
  const l = () => qa(app, '.spro-linha').find((x) => x.getAttribute('data-id') === '148265')!;
  assert.equal(l().querySelectorAll('.spro-icones > button').length, 0);
  comIconesNativos(doc, '148265');
  app.sincronizar();
  assert.equal(l().querySelectorAll('.spro-icones > .spro-fav-estrela').length, 1);
  // prazo mudado pela linha nativa (modulo de prazos) tambem chega
  const a = doc.querySelector('tr#P148265 a[href*="acao=controle_prazo_definir"]')!;
  a.setAttribute('aria-label', 'Controle de Prazo / usuario02 30/10/2026 (19 dias)');
  app.sincronizar();
  assert.match(l().querySelector('.spro-c-prazo .spro-prazo')!.textContent!, /19 dias/);
  app.fechar();
});
await teste('app: nao relê a linha nativa enquanto ha escrita em andamento (a otimista nao e desfeita)', async () => {
  let solta!: () => void;
  const trava = new Promise<void>((r) => (solta = r));
  const { app } = await montar({ editarEspecificacao: () => trava });
  const l = () => qa(app, '.spro-linha').find((x) => x.getAttribute('data-id') === '148265')!;
  l().querySelector<HTMLElement>('.spro-c-especificacao .spro-lapis')!.click();
  const e = l().querySelector<HTMLInputElement>('.spro-espec-input')!;
  e.value = 'em voo'; e.dispatchEvent(new (l().ownerDocument.defaultView as any).Event('input'));
  e.dispatchEvent(Object.assign(new (l().ownerDocument.defaultView as any).Event('keydown', { bubbles: true }), { key: 'Enter' }));
  await tick();
  app.sincronizar();
  assert.equal(l().querySelector('.spro-c-especificacao .spro-corta')!.textContent, 'em voo');
  solta();
  await tick(); await tick();
  app.fechar();
});
await teste('app: "nomes de usuarios" (opcao do legado) mostra o nome em vez da sigla', async () => {
  const { app } = await montar();
  const sigla = () => qa(app, '.spro-linha').find((x) => x.getAttribute('data-id') === '157584')!.querySelector('.spro-c-responsavel')!.textContent;
  assert.equal(sigla(), 'teste01');
  app.definirNomesCompletos(true);
  assert.notEqual(sigla(), 'teste01');
  app.fechar();
});
await teste('app: o icone clonado e o MESMO elemento ao redesenhar (o balao de um modulo fica ancorado nele)', async () => {
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  comIconesNativos(doc, '148265');
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc);
  const pegar = () => qa(app, '.spro-linha').find((x) => x.getAttribute('data-id') === '148265')!.querySelector('.spro-fav-estrela')!;
  const antes = pegar();
  doc.querySelector('tr#P148265 .spro-fav-estrela')!.setAttribute('aria-pressed', 'false');
  app.sincronizar();
  app.render();
  const depois = pegar();
  assert.equal(antes, depois);
  assert.equal(depois.getAttribute('aria-pressed'), 'false');
  app.fechar();
});

// ---------------- edicoes dinamicas (modais) ----------------
const extrasEdicao = async () => ({ responsaveis: [{ sigla: 'ana', nome: 'Ana Souza' }, { sigla: 'beto', nome: 'Beto Lima' }], marcadores: ['Urgente', 'Para assinar', 'teste'] });
const dialogo = (app: { host: HTMLElement }) => app.host.shadowRoot!.querySelector<HTMLElement>('dialog.spro-dialogo-grade');
const linhaDe = (app: { host: HTMLElement }, id: string) => qa(app, '.spro-linha').find((l) => l.getAttribute('data-id') === id)!;
function escolherNoCombo(app: { host: HTMLElement }, dlg: HTMLElement, rotulo: string, texto: string) {
  dlg.querySelector<HTMLElement>('button.spro-combo')!.click();
  const op = [...app.host.shadowRoot!.querySelectorAll<HTMLElement>('[role=option]')].find((o) => o.textContent!.includes(texto));
  assert.ok(op, `${rotulo}: sem a opcao ${texto}`);
  op!.click();
}
await teste('edicao: responsavel — modal com busca, grava a atribuicao e muda a celula na hora', async () => {
  const chamadas: string[] = [];
  const { app } = await montar({ extras: extrasEdicao, mover: { marcador: async () => undefined, atribuir: async (p, u) => void chamadas.push(`${p} @${u}`) } });
  await tick();
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-responsavel .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  assert.ok(dlg, 'abriu o modal');
  assert.equal(dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.disabled, true, 'sem mudanca nao salva');
  escolherNoCombo(app, dlg, 'resp', 'Beto');
  const salvar = dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!;
  assert.equal(salvar.disabled, false);
  salvar.click();
  await tick(); await tick();
  assert.deepEqual(chamadas, ['99906.713-630.000032/2025-82 @beto']);
  assert.equal(linhaDe(app, '148265').querySelector('.spro-c-responsavel .spro-corta')!.textContent, 'beto');
  assert.equal(dialogo(app), null, 'o modal fechou');
  app.fechar();
});
await teste('edicao: responsavel aplica tambem aos selecionados quando a caixa e marcada', async () => {
  const chamadas: string[] = [];
  const { app, doc } = await montar({ extras: extrasEdicao, mover: { marcador: async () => undefined, atribuir: async (p, u) => void chamadas.push(`${p}:${u}`) } });
  for (const id of ['150098', '21831']) { const cb = linhaDe(app, id).querySelector<HTMLInputElement>('input[type=checkbox]')!; cb.checked = true; cb.dispatchEvent(new (doc.defaultView as any).Event('change')); }
  void doc;
  await tick();
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-responsavel .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  const caixa = dlg.querySelector<HTMLInputElement>('.spro-estender input')!;
  assert.ok(caixa, 'ha a opcao de estender');
  assert.match(dlg.querySelector('.spro-estender')!.textContent!, /2 outros selecionados/);
  escolherNoCombo(app, dlg, 'resp', 'Ana');
  caixa.checked = true;
  dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick(); await tick();
  assert.equal(chamadas.length, 3);
  assert.ok(chamadas.every((c) => c.endsWith(':ana')));
  app.fechar();
});
await teste('edicao: responsavel — a falha do SEI desfaz na tela e avisa', async () => {
  const { app } = await montar({ extras: extrasEdicao, mover: { marcador: async () => undefined, atribuir: async () => { throw new Error('sem permissão'); } } });
  await tick();
  const antes = linhaDe(app, '148265').querySelector('.spro-c-responsavel')!.textContent;
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-responsavel .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  escolherNoCombo(app, dlg, 'resp', 'Ana');
  dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick();
  assert.equal(linhaDe(app, '148265').querySelector('.spro-c-responsavel')!.textContent, antes);
  assert.match(q(app, '.spro-aviso').textContent!, /sem permissão/);
  app.fechar();
});
await teste('edicao: anotacao em post-it — texto, lista de tarefas, prioridade, contador e remover', async () => {
  anotados.length = 0;
  const { app } = await montar();
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-anotacao .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  const editor = dlg.querySelector<HTMLElement>('.spro-pi-editor')!;
  assert.ok(editor, 'editor post-it');
  assert.equal(editor.textContent, 'teste');
  // escreve duas linhas, uma delas ja como tarefa feita
  editor.replaceChildren(...['ligar para o fornecedor', 'minuta pronta'].map((t, i) => { const d = editor.ownerDocument.createElement('div'); d.className = 'spro-pi-linha'; if (i === 1) d.setAttribute('data-tarefa', 'x'); d.textContent = t; return d; }));
  const w = editor.ownerDocument.defaultView as any;
  editor.dispatchEvent(new w.Event('input'));
  assert.match(dlg.querySelector('.spro-pi-contador')!.textContent!, /^\d+\/500$/);
  dlg.querySelector<HTMLElement>('.spro-pi-bt[aria-label="Prioridade"]')!.click();
  assert.ok(dlg.querySelector('.spro-pi-prio'));
  dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick();
  assert.deepEqual(anotados, [['99906.713-630.000032/2025-82', 'ligar para o fornecedor\n[X] minuta pronta', true]]);
  assert.match(linhaDe(app, '148265').querySelector('.spro-c-anotacao .spro-corta')!.textContent!, /ligar para o fornecedor \/ \u2611 minuta pronta/);
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-anotacao .spro-lapis')!.click();
  await tick();
  dialogo(app)!.querySelector<HTMLButtonElement>('.spro-botao.perigo')!.click();
  await tick(); await tick();
  assert.deepEqual(anotados.at(-1), ['99906.713-630.000032/2025-82', '', false]);
  app.fechar();
});
await teste('edicao: anotacao — botao de lista liga a tarefa na linha e o clique na caixa marca como feita', async () => {
  anotados.length = 0;
  const { app } = await montar();
  linhaDe(app, '150098').querySelector<HTMLElement>('.spro-c-anotacao .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  const editor = dlg.querySelector<HTMLElement>('.spro-pi-editor')!;
  const w = editor.ownerDocument.defaultView as any;
  const linha = editor.ownerDocument.createElement('div'); linha.className = 'spro-pi-linha'; linha.textContent = 'revisar contrato';
  editor.replaceChildren(linha);
  editor.dispatchEvent(new w.Event('input'));
  dlg.querySelector<HTMLElement>('.spro-pi-bt[aria-label="Lista de tarefas"]')!.click();
  assert.equal(editor.querySelector('.spro-pi-linha')!.getAttribute('data-tarefa'), 'o', 'sem selecao: a ultima linha vira tarefa');
  dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick();
  assert.equal(anotados.at(-1)![1], '[ ] revisar contrato');
  app.fechar();
});
await teste('edicao: anotacao — sem texto nao salva; sigiloso nao tem lapis de anotacao nem de marcador', async () => {
  const { app } = await montar();
  const sig = linhaDe(app, '157584');
  assert.equal(sig.querySelector('.spro-c-anotacao .spro-lapis'), null);
  assert.equal(sig.querySelector('.spro-c-marcadores .spro-lapis'), null);
  assert.ok(sig.querySelector('.spro-c-responsavel .spro-lapis'), 'responsavel de sigiloso pode');
  linhaDe(app, '150098').querySelector<HTMLElement>('.spro-c-anotacao .spro-lapis')!.click();
  await tick();
  assert.equal(dialogo(app)!.querySelector<HTMLButtonElement>('.spro-botao.primario')!.disabled, true);
  app.fechar();
});
await teste('edicao: marcadores — remove, acrescenta com texto e grava na ordem remover -> adicionar', async () => {
  const chamadas: string[] = [];
  const { app } = await montar({ extras: extrasEdicao, mover: { marcador: async (p, m) => void chamadas.push(`${m.remover ? '-' : '+'}${m.marcador}${m.texto ? `(${m.texto})` : ''}`), atribuir: async () => undefined } });
  await tick();
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-marcadores .spro-lapis')!.click();
  await tick();
  const dlg = dialogo(app)!;
  assert.equal(dlg.querySelectorAll('.spro-marcador-linha').length, 2);
  dlg.querySelector<HTMLElement>('.spro-marcador-linha button')!.click(); // remove o 1o (Para Pessoa assinar)
  escolherNoCombo(app, dlg, 'marc', 'Urgente');
  const entrada = dlg.querySelectorAll<HTMLInputElement>('.spro-marcador-linha input')[1]!;
  entrada.value = 'ate sexta';
  entrada.dispatchEvent(new (entrada.ownerDocument.defaultView as any).Event('input'));
  dlg.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick(); await tick();
  assert.deepEqual(chamadas, ['-Para Pessoa assinar', '+Urgente(ate sexta)']);
  const nomes = [...linhaDe(app, '148265').querySelectorAll('.spro-c-marcadores .spro-marcador')].map((m) => m.textContent);
  assert.deepEqual(nomes, ['teste', 'Urgente']);
  app.fechar();
});
await teste('edicao: o que a grade gravou nao e desfeito quando a linha nativa (ainda velha) muda por outro motivo', async () => {
  const { app, doc } = await montar({ extras: extrasEdicao });
  await tick();
  linhaDe(app, '148265').querySelector<HTMLElement>('.spro-c-responsavel .spro-lapis')!.click();
  await tick();
  escolherNoCombo(app, dialogo(app)!, 'resp', 'Ana');
  dialogo(app)!.querySelector<HTMLButtonElement>('.spro-botao.primario')!.click();
  await tick(); await tick();
  doc.querySelector('tr#P148265 a[href*="acao=controle_prazo_definir"]')!.setAttribute('aria-label', 'Controle de Prazo / usuario02 30/10/2026 (19 dias)');
  app.sincronizar();
  assert.equal(linhaDe(app, '148265').querySelector('.spro-c-responsavel .spro-corta')!.textContent, 'ana');
  assert.match(linhaDe(app, '148265').querySelector('.spro-c-prazo .spro-prazo')!.textContent!, /19 dias/);
  app.fechar();
});
await teste('dica: nenhum elemento da grade fica com title (o navegador nao mostra o balao dele)', async () => {
  const { app } = await montar({ extras: extrasEdicao });
  await tick();
  const comTitle = [...app.host.shadowRoot!.querySelectorAll('[title]')].filter((e) => e.getAttribute('title'));
  assert.equal(comTitle.length, 0, comTitle.map((e) => e.className).join(','));
  assert.ok(app.host.shadowRoot!.querySelectorAll('[data-tip]').length > 10);
  app.fechar();
});
await teste('app: icone de origem (recebido/gerado) com dica e icone para abrir em nova guia', async () => {
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  const l = lerTabelas(doc);
  l.processos[1]!.grupo = 'gerados';
  (globalThis as unknown as { document: Document }).document = doc;
  const app = criarApp({ doc, inicial: l, agora: () => Date.UTC(2026, 9, 11, 12), hoje: () => '2026-10-11', armazem: criarArmazem({ local: areaMemoria(), sync: areaMemoria() }, 'u'), fonte: null,
    mover: { marcador: async () => undefined, atribuir: async () => undefined }, acoes: () => [], css: '', escuro: false, baixar: () => undefined, novoId: () => 'i', semDebounce: true,
    aoVoltarNativa: () => undefined, enviarAcao: () => undefined, editarEspecificacao: async () => undefined, abrirPrazo: () => undefined, anotar: async () => undefined });
  doc.body.append(app.host);
  await app.iniciar(); await tick();
  const rec = linhaDe(app, '150098').querySelector('.spro-origem')!;
  const ger = linhaDe(app, '148265').querySelector('.spro-origem')!;
  void rec; void ger;
  const origens = qa(app, '.spro-origem').map((o) => [o.className.split(' ')[1], o.getAttribute('data-tip') ?? o.getAttribute('title')]);
  assert.ok(origens.some(([c, t]) => c === 'spro-origem-gerados' && /gerado/.test(t!)));
  assert.ok(origens.some(([c, t]) => c === 'spro-origem-recebidos' && /recebido/.test(t!)));
  const g = qa(app, '.spro-linha').find((x) => x.querySelector('.spro-origem-gerados'))!;
  const nova = g.querySelector<HTMLAnchorElement>('.spro-nova-guia')!;
  assert.equal(nova.getAttribute('target'), '_blank');
  assert.equal(nova.getAttribute('rel'), 'noopener');
  assert.equal(nova.getAttribute('href'), g.querySelector('.spro-proc')!.getAttribute('href'));
  assert.equal(nova.previousElementSibling, g.querySelector('.spro-proc'), 'logo depois do numero');
  app.fechar();
});
await teste('app: filtros Recebidos e Gerados na faixa dos rapidos, na ordem pedida, e um desliga o outro', async () => {
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  const l = lerTabelas(doc);
  l.processos[0]!.grupo = 'gerados';
  l.processos[1]!.grupo = 'gerados';
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc, { inicial: l });
  const rot = () => qa(app, '.spro-rapido').map((b) => b.textContent!.trim());
  assert.deepEqual(rot().slice(0, 4), ['Meus', 'Recebidos', 'Gerados', 'Atrasados']);
  const clicar = (nome: string) => qa(app, '.spro-rapido').find((b) => b.textContent!.trim() === nome)!.click();
  clicar('Gerados');
  assert.equal(app.estado().visao.busca, 'grupo:gerados');
  const ng = l.processos.filter((x) => x.grupo === 'gerados').length;
  assert.equal(app.estado().filtrados, ng);
  clicar('Recebidos');
  assert.equal(app.estado().visao.busca, 'grupo:recebidos', 'ligar um desliga o outro');
  assert.equal(app.estado().filtrados, l.processos.length - ng);
  clicar('Recebidos');
  assert.equal(app.estado().visao.busca, '');
  app.fechar();
});
await teste('app: os 3 primeiros filtros rapidos (Meus, Recebidos, Gerados) nunca perdem o rotulo na faixa compacta', async () => {
  const { app } = await montar();
  const css = (await import('node:fs')).readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.spro-faixa-c1 \.spro-rapido:nth-child\(n\+4\) \.spro-rapido-rotulo \{ display: none; \}/);
  assert.doesNotMatch(css, /\.spro-faixa-c1 \.spro-rapido-rotulo/);
  assert.deepEqual(qa(app, '.spro-rapido').slice(0, 3).map((b) => b.textContent!.trim()), ['Meus', 'Recebidos', 'Gerados']);
  app.fechar();
});
await teste('app: cada filtro rapido tem dica (data-tip) com o nome, o que faz e o termo de busca', async () => {
  const { app } = await montar();
  for (const b of qa(app, '.spro-rapido')) {
    const t = b.getAttribute('data-tip')!;
    assert.ok(t && t.split('\n').length >= 3, `${b.getAttribute('aria-label')}: ${t}`);
    assert.equal(b.hasAttribute('title'), false);
  }
  assert.match(qa(app, '.spro-rapido')[0]!.getAttribute('data-tip')!, /Meus\nProcessos atribuídos a você\nBusca: resp:eu/);
  app.fechar();
});

// ---------------- acao em lote com processos de outra pagina ----------------
import { camposDoPlano, enviarAcao, planejarAcao } from '../src/acoes/foraDaPagina';
import { urlDaAcao } from '../src/leitura/barra';
const sel = (itens: string, hash: string) => ({ itens, hash });
await teste('fora da pagina: um grupo, uma pagina — plano com o par daquela pagina; mais de uma pagina por grupo e recusado', () => {
  const a = proc({ id: '1', grupo: 'recebidos', pagina: 2, naPaginaAtual: false });
  const b = proc({ id: '2', grupo: 'recebidos', pagina: 2, naPaginaAtual: false });
  const c = proc({ id: '3', grupo: 'recebidos', pagina: 0 });
  const g = proc({ id: '9', grupo: 'gerados', pagina: 0 });
  const mapa = new Map([['recebidos:2', sel('1,2,5', 'H2')], ['recebidos:0', sel('3,4', 'H0')], ['gerados:0', sel('9', 'HG')]]);
  const r = planejarAcao([a, b], mapa);
  assert.ok(r.ok);
  assert.equal(r.ok && r.plano.todosNaPaginaAtual, false);
  assert.deepEqual(r.ok && camposDoPlano(r.plano), { hdnRecebidosItemId: '', hdnRecebidosItensSelecionados: '1,2', hdnRecebidosItens: '1,2,5', hdnRecebidosItensHash: 'H2', hdnGeradosItemId: '', hdnGeradosItensSelecionados: '' });
  const dois = planejarAcao([a, g], mapa);
  assert.ok(dois.ok, 'recebidos da pagina 3 + gerados da 1 cabem no mesmo POST');
  assert.equal(dois.ok && camposDoPlano(dois.plano).hdnGeradosItensHash, 'HG');
  const mistura = planejarAcao([a, c], mapa);
  assert.equal(mistura.ok, false);
  assert.match(!mistura.ok ? mistura.motivo : '', /páginas 1 e 3/);
  const semDados = planejarAcao([a], new Map());
  assert.equal(semDados.ok, false);
  assert.match(!semDados.ok ? semDados.motivo : '', /ainda não foram lidos/);
  assert.equal(planejarAcao([c], mapa).ok && (planejarAcao([c], mapa) as { plano: { todosNaPaginaAtual: boolean } }).plano.todosNaPaginaAtual, true);
});
await teste('fora da pagina: o formulario enviado leva os campos da tela nativa e o par da outra pagina por cima', () => {
  const doc = docDe('<body><form id="frmProcedimentoControlar"><input type="hidden" name="hdnTipoVisualizacao" value="R"><input type="hidden" name="hdnRecebidosItens" value="3,4"><input type="hidden" name="hdnRecebidosItensHash" value="H0"><input type="hidden" name="hdnRecebidosItensSelecionados" value="3"><input type="checkbox" name="chk" value="x" checked></form></body>');
  const enviados2: Array<[string, string, Record<string, string>]> = [];
  const f0 = (doc.defaultView as unknown as { HTMLFormElement?: { prototype: { submit(): void } } });
  void f0;
  const orig = doc.createElement.bind(doc);
  (doc as any).createElement = (tag: string) => { const e = orig(tag) as any; if (tag === 'form') e.submit = function () { enviados2.push([this.getAttribute('action'), this.getAttribute('method'), Object.fromEntries([...this.querySelectorAll('input')].map((i: any) => [i.getAttribute('name'), i.getAttribute('value')]))]); }; return e; };
  const plano = { porGrupo: { recebidos: { ids: ['1', '2'], pagina: 2, selecao: sel('1,2,5', 'H2') } }, todosNaPaginaAtual: false };
  enviarAcao(doc, 'controlador.php?acao=procedimento_atribuicao_cadastrar&infra_hash=abc', plano as any);
  assert.equal(enviados2.length, 1);
  assert.equal(enviados2[0]![0], 'controlador.php?acao=procedimento_atribuicao_cadastrar&infra_hash=abc');
  assert.equal(enviados2[0]![1], 'post');
  const c = enviados2[0]![2];
  assert.equal(c.hdnTipoVisualizacao, 'R');
  assert.equal(c.hdnRecebidosItens, '1,2,5');
  assert.equal(c.hdnRecebidosItensHash, 'H2');
  assert.equal(c.hdnRecebidosItensSelecionados, '1,2');
  assert.equal(c.chk, undefined, 'checkbox da tela nao vai (a selecao e a do plano)');
});
await teste('fora da pagina: le o endereco assinado e as regras da acao do botao nativo', () => {
  const doc = docFixture('caixa_prazos.html');
  const [enviar, , atribuir] = acoesDaBarra(doc);
  const u = urlDaAcao(enviar!)!;
  assert.match(u.url, /^controlador\.php\?acao=procedimento_enviar&acao_origem=/);
  assert.equal(u.requerSelecao, true);
  assert.equal(u.aceitaSigiloso, false);
  assert.equal(urlDaAcao(atribuir!)!.aceitaSigiloso, false);
});
await teste('app: marcar processo de outra pagina e acionar a acao do SEI envia o POST com o par daquela pagina', async () => {
  enviados.length = 0;
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  const l = lerTabelas(doc);
  const fora = l.processos[1]!;
  fora.pagina = 2; fora.naPaginaAtual = false;
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc, { inicial: l });
  app.registrarSelecaoParaTeste('recebidos', 2, { itens: `${fora.id},777`, hash: 'HASH2' });
  const cb = linhaDe(app, fora.id).querySelector<HTMLInputElement>('input[type=checkbox]')!;
  assert.equal(cb.disabled, false, 'a caixa de processo de outra pagina funciona');
  cb.checked = true;
  cb.dispatchEvent(new (doc.defaultView as any).Event('change'));
  await tick();
  assert.match(q(app, '.spro-lote strong').textContent!, /1 selecionado/);
  qa(app, '.spro-lote .spro-bt').find((b) => dicaDe(b) === 'Atribuição de Processos')!.click();
  assert.equal(enviados.length, 1);
  assert.match(enviados[0]![0], /acao=procedimento_atribuicao_cadastrar/);
  assert.deepEqual(JSON.parse(enviados[0]![1]).recebidos, { ids: [fora.id], pagina: 2, selecao: { itens: `${fora.id},777`, hash: 'HASH2' } });
  app.fechar();
});
await teste('app: marcados em duas paginas do mesmo grupo — a acao nao e enviada e o aviso explica', async () => {
  enviados.length = 0;
  const doc = ativarToggle(docFixture('caixa_prazos.html'));
  const l = lerTabelas(doc);
  const fora = l.processos[1]!; fora.pagina = 2; fora.naPaginaAtual = false;
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc, { inicial: l });
  app.registrarSelecaoParaTeste('recebidos', 2, { itens: fora.id, hash: 'H' });
  for (const id of [fora.id, l.processos[0]!.id]) { const cb = linhaDe(app, id).querySelector<HTMLInputElement>('input[type=checkbox]')!; cb.checked = true; cb.dispatchEvent(new (doc.defaultView as any).Event('change')); }
  await tick();
  qa(app, '.spro-lote .spro-bt').find((b) => dicaDe(b) === 'Atribuição de Processos')!.click();
  assert.equal(enviados.length, 0);
  assert.match(q(app, '.spro-aviso').textContent!, /páginas 1 e 3/);
  app.fechar();
});

// ---------------- visao detalhada ----------------
await teste('detalhada: plano usa o par Detalhado (uma tabela so) e recusa duas paginas', () => {
  const a = proc({ id: '1', pagina: 2, naPaginaAtual: false });
  const b = proc({ id: '2', pagina: 0 });
  const mapa = new Map([['detalhado:2', sel('1,5', 'HD2')], ['detalhado:0', sel('2', 'HD0')]]);
  const r = planejarAcao([a], mapa, 'detalhada');
  assert.ok(r.ok);
  assert.deepEqual(r.ok && camposDoPlano(r.plano), { hdnDetalhadoItemId: '', hdnDetalhadoItensSelecionados: '1', hdnDetalhadoItens: '1,5', hdnDetalhadoItensHash: 'HD2' });
  const dois = planejarAcao([a, b], mapa, 'detalhada');
  assert.equal(dois.ok, false);
  assert.match(!dois.ok ? dois.motivo : '', /páginas 1 e 3/);
});
await teste('detalhada: o leitor guarda o par hdnDetalhado e o carregador pagina por hdnDetalhadoPaginaAtual', async () => {
  const html = (ids: number[], pag: number) => `<body><form id="frmProcedimentoControlar"><input type="hidden" id="hdnDetalhadoItens" name="hdnDetalhadoItens" value="${ids.join(',')}"><input type="hidden" id="hdnDetalhadoItensHash" name="hdnDetalhadoItensHash" value="H${pag}"><input type="hidden" id="hdnDetalhadoPaginaAtual" name="hdnDetalhadoPaginaAtual" value="${pag}"></form><table id="tblProcessosDetalhado"><caption>Processos (4 registros - ${pag * 2 + 1} a ${pag * 2 + 2}):</caption>${ids.map((i) => `<tr id="P${i}"><td><input type="checkbox" name="chkDetalhadoItem${i}" title="1/${i}" value="${i}" aria-label="Tipo A / Especificação x"></td><td></td><td><a href="controlador.php?acao=procedimento_trabalhar&id_procedimento=${i}">1/${i}</a></td></tr>`).join('')}</table></form></body>`;
  const l0 = lerTabelas(docDe(html([1, 2], 0)));
  assert.equal(l0.visao, 'detalhada');
  assert.deepEqual(l0.selecoes.detalhado, { itens: '1,2', hash: 'H0' });
  const pedidas: number[] = [];
  const pares: Array<[string, number, string]> = [];
  const { carregarRestante } = await import('../src/paginas/carregar');
  const fonte = { pagina: async (_g: string, n: number) => { pedidas.push(n); return docDe(html([n * 2 + 1, n * 2 + 2], n)); }, restaurar: async () => undefined };
  const r = await carregarRestante(l0, fonte as any, { aoSelecao: (g, n, s) => void pares.push([g, n, s.hash]) });
  assert.deepEqual(pedidas, [1]);
  assert.equal(r.completo, true);
  assert.deepEqual(pares, [['detalhado', 1, 'H1']]);
});
await teste('detalhada: sem o icone de origem e sem os filtros Recebidos/Gerados', async () => {
  const html = `<body><table id="tblProcessosDetalhado"><caption>Processos (1 registro):</caption><tr id="P7"><td><input type="checkbox" name="chkDetalhadoItem0" title="1/7" value="7" aria-label="Tipo A / Especificação x"></td><td></td><td><a class="processoVisualizado" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=7">1/7</a></td></tr></table></body>`;
  const doc = ativarToggle(docDe(html));
  (globalThis as unknown as { document: Document }).document = doc;
  const { app } = await montarCom(doc);
  assert.equal(qa(app, '.spro-origem').length, 0);
  assert.deepEqual(qa(app, '.spro-rapido').slice(0, 2).map((b) => b.textContent!.trim()), ['Meus', 'Atrasados']);
  app.fechar();
});
await teste('app: a celula de anotacao leva a nota bruta para a dica rica (sem title nativo)', async () => {
  const { app } = await montar();
  const c = linhaDe(app, '148265').querySelector('.spro-c-anotacao')!;
  assert.equal(c.hasAttribute('title'), false);
  assert.match(c.getAttribute('data-tip-nota')!, /teste|\[/);
  assert.ok(c.getAttribute('data-tip-autor'));
  app.fechar();
});

// ---------- agrupar por andamento (datas e unidade de envio) ----------
const escolherAgrupamento = (app: { host: HTMLElement }, texto: string) => {
  qa(app, 'button.spro-combo').find((c) => c.getAttribute('aria-label') === 'Agrupar por')!.click();
  [...app.host.shadowRoot!.querySelectorAll<HTMLElement>('[role=option]')].find((o) => o.textContent!.includes(texto))!.click();
};
const esperarAte = async (f: () => boolean) => { for (let i = 0; i < 400 && !f(); i += 1) await new Promise((r) => setTimeout(r, 5)); };

await teste('andamento: sem o consultor, os agrupamentos por andamento nem aparecem', async () => {
  const { app } = await montar();
  qa(app, 'button.spro-combo').find((c) => c.getAttribute('aria-label') === 'Agrupar por')!.click();
  const rotulos = [...app.host.shadowRoot!.querySelectorAll('[role=option]')].map((o) => o.textContent);
  assert.ok(!rotulos.some((t) => /recebimento|autuação|envio/i.test(t!)), rotulos.join('|'));
  app.fechar();
});

await teste('andamento: escolher o agrupamento avisa antes, so consulta depois do aval e guarda o resultado por 24 h', async () => {
  const local = areaMemoria();
  const consultados: string[] = [];
  const consultar = async (p: { id: string; protocolo: string }) => { consultados.push(p.id); return { recebimento: '2026-10-10', unidadeEnvio: 'GABIN' }; };
  const a = await montar({ armazem: criarArmazem({ local, sync: areaMemoria() }, 'u', 'ana'), consultarAndamento: consultar as never, andamentoPausaMs: 0, andamentoSimultaneas: 2 });
  escolherAgrupamento(a.app, 'Data de recebimento');
  await tick();
  const dlg = dialogo(a.app);
  assert.ok(dlg, 'abriu o aviso');
  assert.match(dlg!.textContent!, /abrir o andamento de cada processo/);
  assert.match(dlg!.textContent!, /Serão consultados \d+ processos?/);
  assert.equal(consultados.length, 0, 'nada foi consultado antes do aval');
  dlg!.querySelector<HTMLElement>('button.primario')!.click();
  await esperarAte(() => q(a.app, '.spro-andamento').textContent!.startsWith('Andamento consultado'));
  assert.ok(consultados.length > 0);
  assert.equal(new Set(consultados).size, consultados.length, 'cada processo uma vez');
  assert.match(q(a.app, '.spro-andamento').textContent!, /Andamento consultado agora há pouco/);
  const grupos = qa(a.app, '.spro-grupo-titulo, .spro-grupo').map((g) => g.textContent).join('|');
  assert.match(grupos, /Nos últimos 7 dias/);
  a.app.fechar();

  // Recarregar a pagina: o cache reaparece, sem aviso e sem nova consulta.
  const antes = consultados.length;
  const b = await montar({ armazem: criarArmazem({ local, sync: areaMemoria() }, 'u', 'ana'), consultarAndamento: consultar as never, andamentoPausaMs: 0 });
  b.app.definirVisao({ agrupar: 'recebimento' });
  await tick();
  assert.equal(dialogo(b.app), null, 'com cache valido nao ha aviso');
  assert.equal(consultados.length, antes, 'nada foi reconsultado');
  assert.match(q(b.app, '.spro-andamento').textContent!, /Andamento consultado/);
  assert.match(qa(b.app, '.spro-andamento button').map((x) => x.textContent).join(' '), /Atualizar/);
  b.app.fechar();
});

await teste('andamento: desistir do aviso, sem nada guardado, volta ao agrupamento anterior', async () => {
  const consultados: string[] = [];
  const a = await montar({ consultarAndamento: (async (p: { id: string }) => { consultados.push(p.id); return {}; }) as never });
  escolherAgrupamento(a.app, 'Unidade de envio');
  await tick();
  const dlg = dialogo(a.app)!;
  dlg.querySelector<HTMLElement>('button[aria-label=Fechar]')!.click();
  dlg.dispatchEvent(new (dlg.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event('close')); // o linkedom nao dispara o 'close' do <dialog>
  await tick(); await tick();
  assert.equal(consultados.length, 0);
  assert.equal(a.app.estado().visao.agrupar, 'nenhum');
  a.app.fechar();
});

await teste('andamento: Cancelar para a consulta e o que ja foi lido fica', async () => {
  let cancelar: (() => void) | null = null;
  let n = 0;
  const consultar = (p: { id: string }, sinal: AbortSignal) => new Promise<{ envio: string } | null>((res) => {
    n += 1;
    if (n > 3) { cancelar ??= () => undefined; sinal.addEventListener('abort', () => res(null)); return; }
    res({ envio: '2026-10-01' });
  });
  const a = await montar({ consultarAndamento: consultar as never, andamentoPausaMs: 0, andamentoSimultaneas: 1 });
  escolherAgrupamento(a.app, 'Data de envio');
  await tick();
  dialogo(a.app)!.querySelector<HTMLElement>('button.primario')!.click();
  await esperarAte(() => /Consultando/.test(q(a.app, '.spro-andamento').textContent!) && n > 3);
  assert.match(q(a.app, '.spro-andamento').textContent!, /Consultando o andamento dos processos… \d+ de \d+/);
  qa(a.app, '.spro-andamento button').find((b) => b.textContent === 'Cancelar')!.click();
  await esperarAte(() => !/Consultando/.test(q(a.app, '.spro-andamento').textContent!));
  assert.match(q(a.app, '.spro-andamento').textContent!, /Andamento consultado|ainda não foi consultado/);
  a.app.fechar();
});

await teste('andamento: o botao Atualizar pede novo aviso e reconsulta todos os processos', async () => {
  const consultados: string[] = [];
  const consultar = async (p: { id: string }) => { consultados.push(p.id); return { envio: '2026-10-01' }; };
  const a = await montar({ consultarAndamento: consultar as never, andamentoPausaMs: 0 });
  escolherAgrupamento(a.app, 'Data de envio');
  await tick();
  dialogo(a.app)!.querySelector<HTMLElement>('button.primario')!.click();
  await esperarAte(() => q(a.app, '.spro-andamento').textContent!.startsWith('Andamento consultado'));
  const primeira = consultados.length;
  qa(a.app, '.spro-andamento button').find((b) => /Atualizar/.test(b.textContent!))!.click();
  await tick();
  assert.ok(dialogo(a.app), 'Atualizar avisa de novo');
  assert.equal(consultados.length, primeira, 'so depois do aval');
  dialogo(a.app)!.querySelector<HTMLElement>('button.primario')!.click();
  await esperarAte(() => consultados.length >= primeira * 2);
  assert.equal(consultados.length, primeira * 2, 'todos reconsultados');
  a.app.fechar();
});
