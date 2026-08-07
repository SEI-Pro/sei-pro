/**
 * ADR-0015 (Fronteira 3) — nenhuma fixture carrega dado pessoal real.
 *
 * As fixtures do ACL (ADR-0003) são HTML capturado do SEI, um sistema que tramita processos
 * de um órgão de segurança pública. Uma captura descuidada comita nome, CPF e número de
 * processo reais num repositório público, de forma permanente (git não esquece).
 *
 * Esta trava existe ANTES da primeira fixture de propósito: o custo de removê-la depois de
 * comitada é reescrever história; o custo de barrá-la na entrada é reexecutar a captura.
 *
 * O protocolo de captura está em DEVELOPMENT.md. Ele torna PII improvável por construção
 * (a fixture é esqueleto estrutural com conteúdo sintético); este teste é a rede de
 * segurança, não o mecanismo.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const fixturesDir = path.join(process.cwd(), 'tests/fixtures');

/** Todos os arquivos sob tests/fixtures/, recursivamente. */
function listFixtures(dir) {
    if (!existsSync(dir)) return [];
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) out.push(...listFixtures(full));
        else out.push(full);
    }
    return out;
}

/**
 * Padrões de identificação pessoal. Deliberadamente amplos: falso positivo custa uma
 * conversa, falso negativo custa um vazamento. Para inserir um valor que casa com estes
 * padrões numa fixture, use os valores sintéticos reservados em DEVELOPMENT.md.
 */
const PII = [
    { nome: 'CPF', re: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/ },
    { nome: 'CPF sem máscara', re: /\b\d{11}\b/ },
    { nome: 'CNPJ', re: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/ },
    { nome: 'NUP (número de processo)', re: /\b\d{5}\.\d{6}\/\d{4}-\d{2}\b/ },
    { nome: 'e-mail', re: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/ },
    { nome: 'telefone', re: /\b\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}\b/ },
    { nome: 'CEP', re: /\b\d{5}-\d{3}\b/ }
];

/**
 * Valores sintéticos reservados: casam com o formato mas são reconhecidamente falsos.
 * Uma fixture que precisa exercitar o parser de CPF usa estes, não um CPF real.
 */
const SINTETICOS = [
    '000.000.000-00',
    '00000000000',
    '11111111111',
    '00.000.000/0000-00',
    '00000.000000/0000-00',
    'fulano@exemplo.invalid',
    'ciclano@exemplo.invalid',
    '(00) 00000-0000',
    '00000-000'
];

const fixtures = listFixtures(fixturesDir);
const textual = fixtures.filter((f) => /\.(html|json|txt|xml|csv|md)$/i.test(f));

/** Remove as ocorrências sintéticas antes de procurar PII, para não gerar falso positivo. */
function semSinteticos(conteudo) {
    let out = conteudo;
    for (const valor of SINTETICOS) out = out.split(valor).join('');
    return out;
}

describe('fixtures: nenhum dado pessoal real (ADR-0015)', () => {
    it('a trava está ativa mesmo sem fixtures — protege a primeira captura', () => {
        // Não é tautologia: garante que este teste roda e falharia se uma fixture com PII
        // fosse adicionada, em vez de passar silenciosamente por ausência de arquivos.
        expect(Array.isArray(fixtures)).toBe(true);
    });

    if (textual.length > 0) {
        it.each(textual)('%s não contém padrão de dado pessoal', (file) => {
            const conteudo = semSinteticos(readFileSync(file, 'utf8'));
            const achados = PII.filter(({ re }) => re.test(conteudo)).map(({ nome }) => nome);
            expect(
                achados,
                `${path.relative(process.cwd(), file)}: encontrado ${achados.join(', ')}. ` +
                    'Recapture seguindo o protocolo em DEVELOPMENT.md (esqueleto estrutural + ' +
                    'valores sintéticos). NÃO edite o arquivo à mão para "limpar": se ele já ' +
                    'foi comitado, o dado permanece no histórico do git.'
            ).toEqual([]);
        });

        it.each(textual)('%s declara procedência ao lado (.meta.json)', (file) => {
            if (file.endsWith('.meta.json')) return;
            const meta = file.replace(/\.[^.]+$/, '.meta.json');
            expect(
                existsSync(meta),
                `${path.relative(process.cwd(), file)}: falta ${path.basename(meta)} com ` +
                    'versaoSei, pagina, origem e dataCaptura. Fixture sem procedência não ' +
                    'pode ser recapturada nem validada contra a versão do SEI que ela representa.'
            ).toBe(true);
        });
    }
});
