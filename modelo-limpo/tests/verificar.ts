import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';
import { classeMaisProxima, tracosDoNome } from '../src/limpeza/classes';
import { emPontos, lerFolha } from '../src/limpeza/css';
import { folhasDaSecao, limparSecao, numero, type OpcoesLimpeza } from '../src/limpeza/limpar';
import { objetoJson } from '../../sei-nucleo/src/dominio/editor';
import { ehTelaGerar, montarBotoes, seiAntesDo5 } from '../src/gerar';
import { pedidoValido, VALIDADE_MS } from '../src/pedido';
import { idProcedimentoDaConfiguracao, prepararLimpeza, scriptDaConfiguracao, somar } from '../src/preparar';

let n = 0;
async function teste(nome: string, fn: () => void | Promise<void>) {
  await fn();
  console.log(`OK ${++n}: ${nome}`);
}

const criarDocumento = (html: string) => parseHTML(html).document as unknown as Document;
const fixture = (nome: string) => readFileSync(new URL(`fixtures/${nome}`, import.meta.url), 'utf8');
const estilos = JSON.parse(fixture('estilos_pmm505.json')) as Record<'corpo' | 'anexos', { estilos: string[]; estiloPadrao: string }>;
// Os testes de escolha de classe desligam o espaçamento; os do modelo real usam o padrão (ligado).
const CORPO: OpcoesLimpeza = { ...estilos.corpo, criarDocumento, preservarEspacamento: false };
const ANEXOS: OpcoesLimpeza = { ...estilos.anexos, criarDocumento, preservarEspacamento: false };
const CORPO_ESP: OpcoesLimpeza = { ...CORPO, preservarEspacamento: true };
const ANEXOS_ESP: OpcoesLimpeza = { ...ANEXOS, preservarEspacamento: true };
const limpar = (html: string, op: OpcoesLimpeza = CORPO) => limparSecao(html, op);
const corpo = (html: string) => criarDocumento(`<html><body>${html}</body></html>`).body;
const classes = (html: string) => [...corpo(html).querySelectorAll('[class]')].map((e) => e.getAttribute('class') ?? '');
/** HTML com os atributos de cada elemento em ordem alfabética: a ordem não muda nada e o linkedom não segue a do navegador. */
function normalizar(html: string): string {
  const raiz = corpo(html);
  for (const el of [...raiz.querySelectorAll('*')]) {
    const attrs = [...el.attributes].map((a) => [a.name, a.value] as const).sort(([a], [b]) => a.localeCompare(b));
    for (const [nome] of attrs) el.removeAttribute(nome);
    for (const [nome, valor] of attrs) el.setAttribute(nome, valor);
  }
  return raiz.innerHTML.replace(/&#160;| /g, '&nbsp;');
}
const igualHtml = (atual: string, esperado: string) => assert.equal(normalizar(atual), normalizar(esperado));

const GDOCS = `<style>.c8{font-weight:700}.c25{font-style:italic}.c2{padding-top:10pt;text-indent:36pt;text-align:justify}
.c1{text-align:center}.c60{text-align:right}.c38{margin-left:170.1pt;text-align:justify}
h2{font-weight:700;text-align:center} ol{margin:0;padding:0} table td,table th{padding:0}
.c42{border-right-style:solid;border-top-width:1pt;border-right-width:1pt}
.lst-kix_abc-0>li:before{content:"" counter(lst-ctn-kix_abc-0,lower-latin) ") "}
.lst-kix_rom-0>li:before{content:"" counter(lst-ctn-kix_rom-0,upper-roman) " - "}
@media print { .c2 { color: red } }</style>`;

// ---------------------------------------------------------------------------------------------
// Peças

await teste('css: classes, elementos e tipo de lista do Google Docs', () => {
  const f = lerFolha([GDOCS.replace(/<\/?style>/g, '')]);
  assert.equal(f.classes.get('c8')?.['font-weight'], '700');
  assert.equal(f.classes.get('c2')?.['text-indent'], '36pt');
  assert.equal(f.elementos.get('h2')?.['text-align'], 'center');
  assert.deepEqual(f.listas.get('lst-kix_abc-0'), { tipo: 'lower-latin', sufixo: ') ' });
  assert.equal(f.listas.get('lst-kix_rom-0')?.tipo, 'upper-roman');
  assert.ok(!f.classes.get('c2')?.color, 'regra dentro de @media fica de fora');
});

await teste('css: comprimentos em pontos', () => {
  assert.equal(emPontos('36pt'), 36);
  assert.equal(emPontos('280px'), 210);
  assert.ok(Math.abs(emPontos('25mm') - 70.87) < 0.1);
  assert.ok(Number.isNaN(emPontos('auto')));
});

await teste('classes: traços pelo nome do estilo do SEI', () => {
  const t = tracosDoNome('Texto_Justificado_Recuo_Primeira_Linha_Esp_Simples');
  assert.equal(t.alinhamento, 'justify');
  assert.equal(t.recuo, true);
  assert.equal(tracosDoNome('Tabela_Texto_Centralizado').tabela, true);
  assert.ok(tracosDoNome('Texto_Centralizado_Maiusculas_Negrito').extras.has('negrito'));
});

await teste('classes: a mais próxima entre as permitidas no Corpo', () => {
  const p = estilos.corpo.estilos;
  const vazio = new Set<never>();
  assert.equal(classeMaisProxima({ tabela: false, alinhamento: 'justify', recuo: true, extras: vazio }, p), 'Texto_Justificado_Recuo_Primeira_Linha');
  assert.equal(classeMaisProxima({ tabela: false, alinhamento: 'justify', recuo: false, extras: vazio }, p), 'Texto_Justificado');
  assert.equal(classeMaisProxima({ tabela: false, alinhamento: 'center', recuo: false, extras: vazio }, p), 'Texto_Centralizado');
  assert.equal(classeMaisProxima({ tabela: false, alinhamento: 'right', recuo: false, extras: vazio }, p), 'Texto_Alinhado_Direita');
  assert.equal(classeMaisProxima({ tabela: true, alinhamento: 'center', recuo: false, extras: vazio }, p), 'Tabela_Texto_Centralizado');
  assert.equal(classeMaisProxima({ tabela: false, alinhamento: undefined, recuo: false, extras: vazio }, p), undefined);
});

await teste('números escritos', () => {
  assert.equal(numero(4, 'upper-roman'), 'IV');
  assert.equal(numero(14, 'upper-roman'), 'XIV');
  assert.equal(numero(3, 'lower-latin'), 'c');
  assert.equal(numero(27, 'lower-latin'), 'aa');
});

// ---------------------------------------------------------------------------------------------
// Limpeza em trechos

await teste('negrito do Google Docs (span.c8) vira <strong> e o parágrafo ganha a classe do SEI', () => {
  const { html, relatorio } = limpar(`${GDOCS}<p class="c2"><span class="c8">Art. 12.</span>&nbsp;A ocupação de mais de um lote.</p>`);
  igualHtml(html, '<p class="Texto_Justificado_Recuo_Primeira_Linha"><strong>Art. 12.</strong>&nbsp;A ocupação de mais de um lote.</p>');
  assert.equal(relatorio.negritosRecuperados, 1);
  assert.equal(relatorio.folhasRemovidas, 1);
});

await teste('título h2 centralizado e negrito vira Texto_Centralizado com <strong>', () => {
  const { html, relatorio } = limpar(`${GDOCS}<h2 class="c1" id="h.p4hwe01m6pc7"><span class="c18 c8">CAPÍTULO II</span></h2>`);
  igualHtml(html, '<p class="Texto_Centralizado"><strong>CAPÍTULO II</strong></p>');
  assert.equal(relatorio.titulosConvertidos, 1);
});

await teste('título negrito pela regra do elemento, sem span: o negrito vai para o texto', () => {
  const { html } = limpar(`${GDOCS}<h2>DOS PRINCÍPIOS</h2>`);
  igualHtml(html, '<p class="Texto_Centralizado"><strong>DOS PRINCÍPIOS</strong></p>');
});

await teste('itálico, direita e recuo esquerdo grande (ementa) preservados', () => {
  const { html } = limpar(`${GDOCS}<p class="c60"><span class="c25">caput</span></p><p class="c38">Dispõe sobre o Código de Obras.</p>`);
  igualHtml(html, '<p class="Texto_Alinhado_Direita"><em>caput</em></p><p class="Texto_Justificado" style="margin-left: 170.1pt;">Dispõe sobre o Código de Obras.</p>');
});

await teste('classe do SEI permitida fica; a combinação com classe do Google Docs perde a do Google', () => {
  const { html } = limpar(`${GDOCS}<p class="Texto_Justificado_Recuo_Primeira_Linha c2">Texto.</p><p class="Texto_Centralizado_Maiusculas">anexo</p>`);
  assert.deepEqual(classes(html), ['Texto_Justificado_Recuo_Primeira_Linha', 'Texto_Centralizado_Maiusculas']);
});

await teste('classe do SEI não permitida na seção vira a mais próxima (Esp_Simples não existe no Corpo)', () => {
  const { html, relatorio } = limpar('<p class="Texto_Justificado_Recuo_Primeira_Linha_Esp_Simples">x</p>');
  igualHtml(html, '<p class="Texto_Justificado_Recuo_Primeira_Linha">x</p>');
  assert.equal(relatorio.classesTrocadas, 1);
});

await teste('classe com negrito que a escolhida não tem: o negrito vai para o texto', () => {
  const { html } = limpar('<p class="Texto_Fundo_Cinza_Negrito">Observação</p>');
  igualHtml(html, '<p class="Texto_Justificado"><strong>Observação</strong></p>');
});

await teste('sem alinhamento nem classe: estilo padrão da seção', () => {
  igualHtml(limpar('<p>solto</p>').html, '<p class="Texto_Justificado_Recuo_Primeira_Linha">solto</p>');
  igualHtml(limpar('<p>solto</p>', ANEXOS).html, '<p class="Texto_Justificado">solto</p>');
});

await teste('marca d’água MINUTA do SEI Pro sai inteira (parágrafo, âncora e style)', () => {
  const marca = `<p class="Texto_Alinhado_Esquerda"><span class="minutaAncora" contenteditable="false" data-type="auto"><a class="ancoraSei" contenteditable="false" style="text-indent:0;">
<style data-style="seipro-watermark" type="text/css">body:after{content:"MINUTA"}</style>MINUTA</a></span></p><p class="Texto_Justificado">texto</p>`;
  const { html, relatorio } = limpar(marca);
  igualHtml(html, '<p class="Texto_Justificado">texto</p>');
  assert.equal(relatorio.marcaDaguaRemovida, true);
  assert.equal(relatorio.folhasRemovidas, 0);
});

await teste('lista de alíneas do Google Docs: Item_Alinea_Letra nos Anexos (logo depois de um inciso)', () => {
  const html = `${GDOCS}<p class="Item_Inciso_Romano">os componentes:</p><ol class="c62 lst-kix_abc-0 start" start="1"><li class="c48">título;</li><li class="c48">número.</li></ol>`;
  const r = limpar(html, ANEXOS);
  igualHtml(r.html, '<p class="Item_Inciso_Romano">os componentes:</p><p class="Item_Alinea_Letra">título;</p><p class="Item_Alinea_Letra">número.</p>');
  assert.equal(r.relatorio.listasComNumeroEscrito, 0);
});

await teste('lista de alíneas no Corpo (sem estilos de dispositivo): número escrito no texto', () => {
  const html = `${GDOCS}<ol class="c62 lst-kix_abc-0 start" start="1"><li class="c48">título;</li><li class="c48">número.</li></ol>`;
  const r = limpar(html);
  igualHtml(r.html, '<p class="Texto_Justificado_Recuo_Primeira_Linha">a) título;</p><p class="Texto_Justificado_Recuo_Primeira_Linha">b) número.</p>');
  assert.equal(r.relatorio.listasComNumeroEscrito, 1);
});

await teste('numeração que a classe não reproduziria (alíneas continuando de outra lista): número escrito', () => {
  const html = `${GDOCS}<p class="Item_Alinea_Letra">antes</p><ol class="lst-kix_abc-0" start="1"><li>primeira</li></ol>`;
  const r = limpar(html, ANEXOS);
  igualHtml(r.html, '<p class="Item_Alinea_Letra">antes</p><p class="Texto_Justificado_Recuo_Primeira_Linha">a) primeira</p>');
});

await teste('inciso com estilo de dispositivo numa seção que não o aceita: o número que o CSS desenhava vira texto', () => {
  const r = limpar('<p class="Item_Inciso_Romano">primeiro</p><p class="Item_Inciso_Romano">segundo</p><p class="Item_Alinea_Letra">alínea</p>');
  assert.equal(
    r.html,
    '<p class="Texto_Justificado">I - primeiro</p><p class="Texto_Justificado">II - segundo</p><p class="Texto_Justificado">a) alínea</p>',
  );
});

await teste('lista com marcadores continua lista', () => {
  igualHtml(limpar('<ul><li><p class="c2">um</p></li><li>dois</li></ul>').html, '<ul><li>um</li><li>dois</li></ul>');
});

await teste('tabela: células, colspan e borda do Google Docs; classe de tabela no parágrafo da célula', () => {
  const { html } = limpar(`${GDOCS}<table class="c59"><tbody><tr class="c52"><td class="c42" colspan="2" rowspan="1"><p class="c1"><span class="c8">Uso</span></p></td></tr></tbody></table>`);
  igualHtml(html, '<table><tbody><tr><td colspan="2" style="border: 1px solid #000000;"><p class="Tabela_Texto_Centralizado"><strong>Uso</strong></p></td></tr></tbody></table>');
});

await teste('links: redirecionador do Google vira o endereço real; link sem destino é desembrulhado', () => {
  const { html } = limpar('<p class="Texto_Justificado"><a href="https://www.google.com/url?q=https://leis.org/lei1&amp;sa=D">lei</a> e <a id="cmnt1">nota</a></p>');
  igualHtml(html, '<p class="Texto_Justificado"><a href="https://leis.org/lei1">lei</a> e nota</p>');
});

await teste('imagem embutida fica, com largura e altura; script e comentário saem', () => {
  const { html } = limpar('<p class="Texto_Centralizado"><img src="data:image/png;base64,AAAA" style="width: 120px; height: 40.4px;" alt="logo"><script>alert(1)</script><!-- x --></p>');
  igualHtml(html, '<p class="Texto_Centralizado"><img src="data:image/png;base64,AAAA" alt="logo" width="120" height="40"></p>');
});

await teste('Word: <o:p>, <font> e mso-* somem', () => {
  const { html } = limpar('<p class="MsoNormal" style="text-align:justify;text-indent:2cm;mso-line-height-alt:12pt"><b><font face="Arial">Art. 1º</font></b> texto<o:p></o:p></p>');
  igualHtml(html, '<p class="Texto_Justificado_Recuo_Primeira_Linha"><strong>Art. 1º</strong> texto</p>');
});

await teste('limpar duas vezes dá o mesmo que limpar uma', () => {
  const entrada = `${GDOCS}<h2 class="c1"><span class="c8">CAPÍTULO I</span></h2><p class="c2"><span class="c8">Art. 1º</span> Texto <span class="c25">caput</span>.</p><p class="c38">Ementa</p><ol class="lst-kix_abc-0" start="1"><li>a</li></ol><table><tbody><tr><td class="c42"><p class="c1">x</p></td></tr></tbody></table>`;
  const uma = limpar(entrada).html;
  assert.equal(limpar(uma).html, uma);
});

await teste('espaçamento: espaço antes/depois do Google Docs (padding) vira margem no parágrafo', () => {
  const css = '<style>.c2{padding-top:10pt;padding-bottom:10pt;text-indent:36pt;text-align:justify;line-height:1.15}</style>';
  igualHtml(limpar(`${css}<p class="c2">Art. 1º</p>`, CORPO_ESP).html, '<p class="Texto_Justificado_Recuo_Primeira_Linha" style="margin-top: 10pt; margin-bottom: 10pt;">Art. 1º</p>');
  igualHtml(limpar(`${css}<p class="c2">Art. 1º</p>`, CORPO).html, '<p class="Texto_Justificado_Recuo_Primeira_Linha">Art. 1º</p>');
});

await teste('espaçamento: entrelinha diferente do normal fica; 1,15 (o normal do Arial) não', () => {
  const css = '<style>.c1{text-align:center;line-height:1.5}.c4{text-align:center;line-height:1.15}</style>';
  igualHtml(limpar(`${css}<p class="c1">T</p><p class="c4">U</p>`, CORPO_ESP).html, '<p class="Texto_Centralizado" style="line-height: 1.5;">T</p><p class="Texto_Centralizado">U</p>');
});

await teste('espaçamento: margin do Word (atalho de 4 valores) e margem já inline do SEI ficam como vieram', () => {
  igualHtml(
    limpar('<p class="MsoNormal" style="margin:6pt 0cm 12pt 0cm;text-align:justify">x</p>', CORPO_ESP).html,
    '<p class="Texto_Justificado" style="margin-top: 6pt; margin-bottom: 12pt;">x</p>',
  );
  igualHtml(
    limpar('<p class="Texto_Justificado" style="margin-left: 280px; margin-top: 20px;">Autoria</p>', CORPO_ESP).html,
    '<p class="Texto_Justificado" style="margin-left: 280px; margin-top: 20px;">Autoria</p>',
  );
});

await teste('espaçamento: alinhamento e recuo que nenhuma classe permitida reproduz ficam no parágrafo', () => {
  // Direita com recuo de 1ª linha: Texto_Alinhado_Direita não tem recuo.
  igualHtml(
    limpar('<p style="text-align:right;text-indent:28.3pt">Paço Municipal</p>', CORPO_ESP).html,
    '<p class="Texto_Alinhado_Direita" style="text-indent: 28.3pt;">Paço Municipal</p>',
  );
  // Seção sem estilos configurados: só o estilo inline guarda o alinhamento.
  igualHtml(limpar('<p style="text-align:center">x</p>', { estilos: [], criarDocumento }).html, '<p style="text-align: center;">x</p>');
});

await teste('espaçamento: zero não é gravado e limpar de novo não muda nada', () => {
  const css = '<style>.c6{padding-top:0pt;padding-bottom:0pt;text-align:justify}.c16{padding-top:12pt;text-indent:36pt;text-align:justify}</style>';
  const uma = limpar(`${css}<p class="c6">a</p><p class="c16">b</p>`, CORPO_ESP).html;
  igualHtml(uma, '<p class="Texto_Justificado">a</p><p class="Texto_Justificado_Recuo_Primeira_Linha" style="margin-top: 12pt;">b</p>');
  assert.equal(limpar(uma, CORPO_ESP).html, uma);
});

await teste('folhas de outra seção valem aqui (o <style> do Corpo pinta os Anexos)', () => {
  const folhas = folhasDaSecao(GDOCS, criarDocumento);
  const sem = limpar('<p class="c2"><span class="c8">Art. 1º</span></p>', ANEXOS).html;
  const com = limpar('<p class="c2"><span class="c8">Art. 1º</span></p>', { ...ANEXOS, folhasDoDocumento: folhas }).html;
  igualHtml(sem, '<p class="Texto_Justificado">Art. 1º</p>');
  igualHtml(com, '<p class="Texto_Justificado_Recuo_Primeira_Linha"><strong>Art. 1º</strong></p>');
});

// ---------------------------------------------------------------------------------------------
// Modelo real montado no Google Docs, com o texto trocado por palavras fictícias (estrutura e formatação originais)

const corpoReal = fixture('modelo_exemplo_corpo.html');
const anexosReal = fixture('modelo_exemplo_anexos.html');
const folhasReais = folhasDaSecao(corpoReal, criarDocumento);
const rCorpo = limpar(corpoReal, CORPO_ESP);
const rAnexos = limpar(anexosReal, { ...ANEXOS_ESP, folhasDoDocumento: folhasReais });

await teste('real: nada do Google Docs nem da marca d’água sobra', () => {
  for (const r of [rCorpo, rAnexos]) {
    assert.ok(!/<style|<script|lst-kix|minutaAncora|seipro-watermark|\bid="h\./.test(r.html));
    assert.ok(!/class="[^"]*\bc\d+\b/.test(r.html), 'classe cN do Google Docs');
    assert.ok(!/<(span|font|h[1-6]|div|ol)\b/.test(r.html), 'tag que o CK5 descartaria');
  }
  assert.equal(rCorpo.relatorio.marcaDaguaRemovida, true);
  assert.equal(rCorpo.relatorio.folhasRemovidas, 1);
});

await teste('real: toda classe emitida é permitida na sua seção', () => {
  const fora = (html: string, permitidas: string[]) => classes(html).filter((c) => !permitidas.includes(c));
  assert.deepEqual([...new Set(fora(rCorpo.html, estilos.corpo.estilos))], []);
  assert.deepEqual([...new Set(fora(rAnexos.html, estilos.anexos.estilos))], []);
});

await teste('real: "Art. 12." volta em negrito e "CAPÍTULO II" é título centralizado em negrito', () => {
  assert.ok(rCorpo.html.includes('<strong>Art. 12.</strong>'));
  assert.match(rCorpo.html, /<p (style="margin-top: 12pt; line-height: 1\.5;" )?class="Texto_Centralizado"( style="margin-top: 12pt; line-height: 1\.5;")?><strong>CAPÍTULO II\s*<\/strong><\/p>/);
  assert.ok(rCorpo.relatorio.negritosRecuperados > 100, String(rCorpo.relatorio.negritosRecuperados));
});

await teste('real: a lista automática de alíneas do Corpo vira texto "a)" e "b)"', () => {
  assert.ok(rCorpo.html.includes('a) Caso o forma regra texto ponto'));
  assert.ok(rCorpo.html.includes('b) Nota exemplo o ponto'));
  assert.equal(rCorpo.relatorio.listasComNumeroEscrito, 1);
});

await teste('real: o texto todo continua lá (só a marca d’água sai)', () => {
  // Sem espaços: parágrafos vizinhos não têm espaço entre si no textContent, itens de lista tinham.
  const semEspaco = (s: string) => s.replace(/[\s ]+/g, '');
  const original = corpo(corpoReal);
  for (const el of [...original.querySelectorAll('style, .minutaAncora')]) el.remove();
  const antes = semEspaco(original.textContent ?? '');
  // Os dois únicos acréscimos: os números das alíneas da lista automática.
  const depois = semEspaco(corpo(rCorpo.html).textContent ?? '')
    .replace('a)Casooforma', 'Casooforma')
    .replace('b)Notaexemploo', 'Notaexemploo');
  assert.equal(depois, antes);
});

await teste('real: limpar de novo não muda nada', () => {
  // Sem meta de tamanho: com o espaçamento inline o resultado pode ficar maior que o original.
  assert.equal(limpar(rCorpo.html, CORPO_ESP).html, rCorpo.html);
});

// ---------------------------------------------------------------------------------------------
// Pedido e preparação no editor (configuração real do SEI 5.0.5)

await teste('pedido: mesmo processo, dentro do prazo, uma vez', () => {
  const p = { idProcedimento: '7000001', modelo: '9000001', criadoEm: 1_000_000 };
  assert.equal(pedidoValido(p, '7000001', 1_000_000 + 30_000), true);
  assert.equal(pedidoValido(p, '7105513', 1_000_000 + 30_000), false, 'outro processo');
  assert.equal(pedidoValido(p, '7000001', 1_000_000 + VALIDADE_MS + 1), false, 'vencido');
  assert.equal(pedidoValido(p, undefined, 1_000_000), false, 'editor sem processo');
  assert.equal(pedidoValido({ modelo: 'x' }, '7000001', 1_000_000), false, 'pedido torto');
});

const editorReal = readFileSync(new URL('../../sei-nucleo/tests/fixtures/sei5/editor_pmm505.html', import.meta.url), 'utf8');
const configReal = scriptDaConfiguracao(criarDocumento(editorReal))!;

await teste('preparo: acha a configuração na página e o processo', () => {
  assert.ok(configReal.includes('INFRA_EDITOR_CONFIG'));
  assert.equal(idProcedimentoDaConfiguracao(configReal), '7000001');
});

await teste('preparo: só as duas seções editáveis (Corpo e Anexos), com os estilos de cada uma', () => {
  const p = prepararLimpeza(configReal, 'https://sei.exemplo.gov.br/sei/controlador.php?acao=editor_montar', criarDocumento);
  assert.deepEqual(p.secoes.map((s) => s.titulo), ['Corpo do Texto', 'Anexos']);
  assert.equal(p.idProcedimento, '7000001');
  // Documento novo, do tipo: nada a limpar além de normalizar, e nenhuma classe fora da lista.
  const corpo505 = p.secoes[0];
  assert.deepEqual(classes(corpo505.html).filter((c) => !estilos.corpo.estilos.includes(c)), []);
});

await teste('preparo de ponta a ponta: cópia do modelo no editor do 5.0.5', () => {
  // O que o SEI escreveria na página do documento gerado a partir do modelo: a mesma configuração, com o
  // HTML do modelo nas seções Corpo e Anexos.
  const i = configReal.indexOf('{', configReal.indexOf('INFRA_EDITOR_CONFIG'));
  const cfg = JSON.parse(objetoJson(configReal, i)!) as { initialData: Record<string, string> };
  cfg.initialData.txaEditor_2597 = corpoReal;
  cfg.initialData.txaEditor_2599 = anexosReal;
  const texto = `window.INFRA_EDITOR_CONFIG = ${JSON.stringify(cfg)};`;
  const p = prepararLimpeza(texto, 'https://h/sei/controlador.php?acao=editor_montar', criarDocumento);
  const [c, a] = p.secoes;
  assert.ok(c.html.includes('<strong>Art. 12.</strong>'));
  assert.ok(!/<style|class="[^"]*\bc\d+\b/.test(c.html + a.html));
  assert.deepEqual(classes(c.html).filter((x) => !estilos.corpo.estilos.includes(x)), []);
  assert.deepEqual(classes(a.html).filter((x) => !estilos.anexos.estilos.includes(x)), []);
  const total = somar(p.secoes);
  assert.ok(total.negritosRecuperados > 100);
  assert.equal(total.marcaDaguaRemovida, true);
});

// ---------------------------------------------------------------------------------------------
// Tela "Gerar Documento"

const TELA_GERAR = `<form id="frmDocumentoCadastro"><div id="divInfraBarraComandosSuperior"><button type="button" name="btnSalvar" id="btnSalvar">Salvar</button></div>
<input type="hidden" id="hdnIdProcedimento" value="7000001">
<input type="radio" name="rdoTextoInicial" id="optProtocoloDocumentoTextoBase" value="D"><input type="text" id="txtProtocoloDocumentoTextoBase">
<input type="radio" name="rdoTextoInicial" id="optNenhum" value="N" checked>
<input type="radio" name="rdoNivelAcesso" id="optSigiloso" value="2">
<div id="divInfraBarraComandosInferior"><button type="button" name="btnSalvar" id="btnSalvar">Salvar</button></div></form>`;

await teste('gerar: um botão ao lado de cada Salvar, visível só com Documento Modelo', () => {
  const d = criarDocumento(`<html><body>${TELA_GERAR}</body></html>`);
  (globalThis as { document?: Document }).document = d;
  assert.equal(ehTelaGerar(d), true);
  const desmontar = montarBotoes(d);
  const botoes = [...d.querySelectorAll<HTMLElement>('[data-spro-modelo-limpo]')];
  assert.equal(botoes.length, 2);
  assert.ok(botoes.every((b) => b.previousElementSibling?.getAttribute('name') === 'btnSalvar'));
  assert.ok(botoes.every((b) => b.style.display === 'none'));
  const opcao = d.getElementById('optProtocoloDocumentoTextoBase') as HTMLInputElement;
  opcao.checked = true;
  opcao.dispatchEvent(new d.defaultView!.Event('click', { bubbles: true }));
  assert.ok(botoes.every((b) => b.style.display === ''));
  desmontar();
  assert.equal(d.querySelectorAll('[data-spro-modelo-limpo]').length, 0);
  delete (globalThis as { document?: Document }).document;
});

await teste('gerar: botão some só quando a versão conhecida é anterior ao SEI 5', () => {
  assert.equal(seiAntesDo5('4.1.5'), true);
  assert.equal(seiAntesDo5('5.0.5'), false);
  assert.equal(seiAntesDo5(null), false);
  assert.equal(seiAntesDo5('lixo'), false);
});

await teste('gerar: tela sem o quadro de texto inicial não é a tela', () => {
  assert.equal(ehTelaGerar(criarDocumento('<html><body><form id="frmDocumentoCadastro"></form></body></html>')), false);
});

console.log(`\n${n} verificações ok`);
