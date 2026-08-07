/**
 * ADR-0015 — o esqueletizador não deixa passar dado pessoal, e preserva o que o ACL lê.
 *
 * Este teste é mais importante que a maioria: a única instância de SEI disponível para
 * captura é produção, então `scripts/skeletonize-fixture.mjs` é a única barreira entre dado
 * real de cidadão e um repositório público. Um esqueletizador com vazamento é pior que
 * nenhum, porque cria confiança injustificada.
 *
 * A entrada abaixo imita a forma real de uma página do SEI e concentra PII em todos os
 * lugares onde ela costuma aparecer: texto, atributo, `onclick`, `title`, querystring,
 * comentário e `id`.
 */
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { esqueletizar } from '../../scripts/skeletonize-fixture.mjs';

const HTML_CRU = `<!DOCTYPE html>
<html lang="pt-br">
<head><title>Processo 12345.000123/2026-45 — MARIA DA SILVA</title></head>
<body>
<!-- gerado para CPF 123.456.789-01 em 2026-08-07 -->
<table id="tblProcessos" class="infraTable">
    <tr class="infraTrClara">
        <td colspan="2" class="infraTd">
            <a href="controlador.php?acao=procedimento_trabalhar&id_procedimento=987654&infra_hash=a1b2c3"
               title="Abrir processo de MARIA DA SILVA (CPF 123.456.789-01)"
               onclick="abrirProcesso('12345.000123/2026-45','maria.silva@prf.gov.br')">
                12345.000123/2026-45
            </a>
        </td>
        <td class="infraTd">
            <input type="checkbox" name="chkProcesso987654" id="chkProc987654"
                   value="12345.000123/2026-45" data-cpf="123.456.789-01">
        </td>
    </tr>
</table>
<script>var interessado = {nome: "MARIA DA SILVA", cpf: "12345678901", tel: "(61) 99999-1234"};</script>
</body></html>`;

/** Tudo que jamais pode sobreviver, em qualquer forma. */
const SEGREDOS = [
    'MARIA DA SILVA',
    '12345.000123/2026-45',
    '123.456.789-01',
    '12345678901',
    'maria.silva@prf.gov.br',
    '(61) 99999-1234',
    '987654',
    'a1b2c3',
    'abrirProcesso'
];

const esqueleto = esqueletizar(HTML_CRU);

describe('esqueletizador: nada de conteúdo sobrevive', () => {
    it.each(SEGREDOS)('descarta %s', (segredo) => {
        expect(esqueleto).not.toContain(segredo);
    });

    it('não sobra sequência longa de dígitos que não seja máscara', () => {
        // Rede a mais: sequência de 4+ dígitos é candidata a identificador. Zeros são o
        // resultado do mascaramento e são esperados — `chkProc000000` preserva a forma do
        // seletor sem preservar o identificador.
        const suspeitos = (esqueleto.match(/\d{4,}/g) || []).filter((s) => !/^0+$/.test(s));
        expect(suspeitos).toEqual([]);
    });

    it('descarta comentários por inteiro', () => {
        expect(esqueleto).not.toContain('<!--');
    });

    it('descarta o corpo dos scripts', () => {
        expect(esqueleto).not.toContain('interessado');
        expect(esqueleto).not.toContain('var ');
    });
});

describe('esqueletizador: preserva o que o ACL precisa', () => {
    const doc = new JSDOM(esqueleto).window.document;

    it('mantém a hierarquia e as tags', () => {
        expect(doc.querySelector('table tr td a')).toBeTruthy();
        expect(doc.querySelectorAll('td').length).toBe(2);
    });

    it('mantém os seletores por class', () => {
        expect(doc.querySelector('.infraTable')).toBeTruthy();
        expect(doc.querySelector('.infraTrClara')).toBeTruthy();
    });

    it('mantém a forma do id, mascarando o identificador', () => {
        // O prefixo é o que o seletor casa; o número é o que identifica a pessoa.
        const input = doc.querySelector('input[type="checkbox"]');
        expect(input.id).toBe('chkProc000000');
        expect(input.getAttribute('name')).toBe('chkProcesso000000');
    });

    it('mantém `acao` na querystring, porque identifica a página', () => {
        const href = doc.querySelector('a').getAttribute('href');
        expect(href).toContain('acao=procedimento_trabalhar');
    });

    it('mantém os nomes dos parâmetros, esvaziando os valores', () => {
        const href = doc.querySelector('a').getAttribute('href');
        expect(href).toContain('id_procedimento=');
        expect(href).not.toContain('id_procedimento=987654');
    });

    it('mantém a presença de data-* sem o valor', () => {
        const input = doc.querySelector('input[type="checkbox"]');
        expect(input.hasAttribute('data-cpf')).toBe(true);
        expect(input.getAttribute('data-cpf')).toBe('');
    });

    it('preserva colspan, que é estrutural e não pode ser mascarado', () => {
        expect(doc.querySelector('td').getAttribute('colspan')).toBe('2');
    });

    it('mantém as tags de script, só sem corpo', () => {
        expect(doc.querySelectorAll('script').length).toBe(1);
        expect(doc.querySelector('script').textContent).toBe('');
    });
});

describe('esqueletizador: o resultado passa na própria trava de PII', () => {
    // Fecha o ciclo: a saída do esqueletizador satisfaz fixtures-sem-pii.test.js.
    const PII = [
        /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/,
        /\b\d{11}\b/,
        /\b\d{5}\.\d{6}\/\d{4}-\d{2}\b/,
        /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/,
        /\b\d{5}-\d{3}\b/
    ];

    it.each(PII.map((re) => [String(re), re]))('não casa com %s', (_nome, re) => {
        expect(re.test(esqueleto)).toBe(false);
    });
});
