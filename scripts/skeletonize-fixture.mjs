#!/usr/bin/env node
/**
 * Converte HTML capturado do SEI em esqueleto estrutural, sem dado pessoal.
 *
 *   node scripts/skeletonize-fixture.mjs <html-cru> <destino-em-tests/fixtures> \
 *       --versao-sei=4.0.12 --pagina=procedimento_trabalhar --responsavel="Nome"
 *
 * Por que isto existe (ADR-0015, protocolo em DEVELOPMENT.md): a única instância de SEI
 * disponível para captura é PRODUÇÃO. Então o HTML cru contém nome, CPF e número de processo
 * reais de pessoas, e não pode chegar ao repositório em nenhuma circunstância — o git não
 * esquece, e remover depois é operação de incidente.
 *
 * O método NÃO é procurar PII e apagar (depende de prever todo formato e falha em silêncio).
 * É o inverso: preservar só o que o parser do ACL precisa — tags, hierarquia e seletores — e
 * descartar todo o resto por padrão. O conteúdo não é filtrado; ele simplesmente não é
 * copiado. PII fica impossível por construção, e `tests/structure/fixtures-sem-pii.test.js`
 * é a rede de segurança, não o mecanismo.
 */
import { JSDOM } from 'jsdom';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const SKELETONIZER_VERSION = 1;

/**
 * Atributos cujo VALOR é preservado (com dígitos mascarados): são o que os seletores do ACL
 * casam. Qualquer atributo fora desta lista tem o valor esvaziado, mantendo só a presença.
 */
const VALOR_PRESERVADO = new Set([
    'class', 'id', 'name', 'type', 'role', 'for', 'scope', 'headers',
    'method', 'target', 'rel', 'lang', 'dir', 'disabled', 'checked',
    'selected', 'readonly', 'multiple', 'required', 'colspan', 'rowspan'
]);

/**
 * Atributos numéricos cujo valor é estrutural e NÃO pode ser mascarado — `colspan="3"`
 * viraria `colspan="0"` e mudaria a forma da tabela que o parser lê.
 */
const NUMERICO_ESTRUTURAL = new Set([
    'colspan', 'rowspan', 'size', 'maxlength', 'tabindex', 'width', 'height', 'span'
]);

/** Atributos de URL: preserva a rota e os NOMES dos parâmetros, não os valores. */
const ATRIBUTO_URL = new Set(['href', 'src', 'action', 'formaction', 'data-href']);

/**
 * Parâmetros de querystring cujo valor é estrutural: `acao` identifica a página do SEI e é
 * exatamente o que `src/sei/pages.js` interpreta. Todo outro valor (id_procedimento,
 * id_documento, hashes de sessão) é identificador e vai fora.
 */
const PARAM_PRESERVADO = new Set(['acao', 'acao_origem', 'infra_sistema']);

/** Elementos cujo conteúdo textual é descartado inteiro, mantendo a tag. */
const CONTEUDO_DESCARTADO = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);

/** Dígito é o que carrega identificação (CPF, NUP, id de processo). */
function mascararDigitos(valor) {
    return valor.replace(/\d/g, '0');
}

function limparUrl(valor) {
    // URL relativa é o caso comum no SEI; a base é descartável, só serve para parsear.
    let url;
    try {
        url = new URL(valor, 'https://sei.invalid/');
    } catch {
        return '';
    }
    const params = new URLSearchParams();
    for (const [chave] of url.searchParams) {
        // Nome do parâmetro é estrutural; valor só quando explicitamente liberado.
        params.set(chave, PARAM_PRESERVADO.has(chave) ? url.searchParams.get(chave) : '');
    }
    const query = params.toString();
    const rota = mascararDigitos(url.pathname);
    return query ? `${rota}?${decodeURIComponent(query)}` : rota;
}

function tratarAtributos(el) {
    for (const attr of [...el.attributes]) {
        const nome = attr.name;
        const valor = attr.value;

        if (ATRIBUTO_URL.has(nome)) {
            el.setAttribute(nome, limparUrl(valor));
            continue;
        }
        // data-* e aria-*: a CHAVE é estrutural e o parser pode casar por ela; o valor não.
        if (nome.startsWith('data-') || nome.startsWith('aria-')) {
            el.setAttribute(nome, '');
            continue;
        }
        if (!VALOR_PRESERVADO.has(nome)) {
            // Inclui onclick, onchange, title, alt, value, placeholder: tudo que costuma
            // carregar id de processo ou nome de pessoa.
            el.setAttribute(nome, '');
            continue;
        }
        el.setAttribute(nome, NUMERICO_ESTRUTURAL.has(nome) ? valor : mascararDigitos(valor));
    }
}

/** Percorre a árvore preservando estrutura e descartando conteúdo. */
function esqueletizarNo(no) {
    // Comentário pode conter dado e nunca é lido por parser.
    for (const filho of [...no.childNodes]) {
        if (filho.nodeType === 8) {
            filho.remove();
            continue;
        }
        if (filho.nodeType === 3) {
            filho.nodeValue = '';
            continue;
        }
        if (filho.nodeType === 1) {
            tratarAtributos(filho);
            if (CONTEUDO_DESCARTADO.has(filho.tagName)) {
                filho.textContent = '';
                continue;
            }
            esqueletizarNo(filho);
        }
    }
}

/**
 * @param {string} htmlCru HTML como veio da página.
 * @returns {string} esqueleto estrutural, sem conteúdo.
 */
export function esqueletizar(htmlCru) {
    const dom = new JSDOM(htmlCru);
    const doc = dom.window.document;
    if (doc.documentElement) tratarAtributos(doc.documentElement);
    esqueletizarNo(doc.documentElement);
    return dom.serialize();
}

function parseArgs(argv) {
    const posicionais = [];
    const nomeados = {};
    for (const arg of argv) {
        const m = /^--([^=]+)=(.*)$/.exec(arg);
        if (m) nomeados[m[1]] = m[2];
        else posicionais.push(arg);
    }
    return { posicionais, nomeados };
}

function main() {
    const { posicionais, nomeados } = parseArgs(process.argv.slice(2));
    const [entrada, saida] = posicionais;

    if (!entrada || !saida) {
        console.error(
            'uso: node scripts/skeletonize-fixture.mjs <html-cru> <destino> \\\n' +
                '         --versao-sei=<x.y.z> --pagina=<acao> --responsavel="<nome>"\n\n' +
                'O <html-cru> deve estar FORA do repositório (ex.: /tmp), para que o HTML com\n' +
                'dado real nunca seja alcançável por `git add`.'
        );
        process.exit(2);
    }

    const repo = process.cwd();
    const entradaAbs = path.resolve(entrada);

    // Guarda central do protocolo: se o HTML cru estiver dentro do repositório, ele já pode
    // ser comitado por acidente (`git add -A`). Recusar é mais seguro que avisar.
    if (entradaAbs.startsWith(repo + path.sep)) {
        console.error(
            `erro: o HTML cru está dentro do repositório (${path.relative(repo, entradaAbs)}).\n` +
                'Mova a captura para fora (ex.: /tmp/captura.html) e rode de novo. HTML de\n' +
                'produção não pode ficar em caminho alcançável por git add.'
        );
        process.exit(1);
    }

    const saidaAbs = path.resolve(saida);
    const fixturesDir = path.join(repo, 'tests', 'fixtures');
    if (!saidaAbs.startsWith(fixturesDir + path.sep)) {
        console.error(`erro: o destino deve estar sob tests/fixtures/ (recebido: ${saida}).`);
        process.exit(1);
    }

    const faltando = ['versao-sei', 'pagina', 'responsavel'].filter((k) => !nomeados[k]);
    if (faltando.length) {
        console.error(
            `erro: procedência incompleta, faltam: ${faltando.join(', ')}.\n` +
                'Fixture sem procedência não pode ser recapturada nem validada contra a versão\n' +
                'do SEI que ela representa.'
        );
        process.exit(1);
    }

    if (!existsSync(entradaAbs)) {
        console.error(`erro: não encontrei ${entrada}`);
        process.exit(1);
    }

    const cru = readFileSync(entradaAbs, 'utf8');
    const esqueleto = esqueletizar(cru);

    mkdirSync(path.dirname(saidaAbs), { recursive: true });
    writeFileSync(saidaAbs, esqueleto);

    const meta = {
        versaoSei: nomeados['versao-sei'],
        pagina: nomeados.pagina,
        origem: nomeados.origem || 'producao',
        dataCaptura: new Date().toISOString().slice(0, 10),
        responsavel: nomeados.responsavel,
        skeletonizerVersion: SKELETONIZER_VERSION
    };
    const metaPath = saidaAbs.replace(/\.[^.]+$/, '.meta.json');
    writeFileSync(metaPath, JSON.stringify(meta, null, 4) + '\n');

    const reducao = Math.round((1 - esqueleto.length / cru.length) * 100);
    console.log(
        `esqueleto: ${path.relative(repo, saidaAbs)} ` +
            `(${cru.length} → ${esqueleto.length} bytes, −${reducao}% de conteúdo)\n` +
            `procedência: ${path.relative(repo, metaPath)}\n` +
            'Apague a captura crua agora: rm ' + entradaAbs
    );
}

// Só executa como CLI; importável pelos testes.
if (import.meta.url === `file://${process.argv[1]}`) main();
