// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const SEI_REFERENCE_PATTERN = /\bSEI(?:\s+n[ºo.]*)?\s*(\d{5,12})\b/giu;
const LEGAL_REFERENCE_PATTERN = /\b(?:Lei|Decreto|Portaria|Instrução\s+Normativa|Resolução)\s+n[ºo.]?\s*[\d.]+/giu;

export function verifyCitations(html, documents = [], { parseHtml } = {}) {
    if (typeof parseHtml !== 'function') {
        throw new TypeError('verifyCitations requer parseHtml');
    }
    const document = parseHtml(String(html || ''));
    const knownNumbers = new Set(documents.map((item) => String(
        item.numeroSEI || item.nr_sei || item.numero || ''
    ).replace(/\D/g, '')).filter(Boolean));
    const findings = [];
    const seen = new Set();
    const add = (finding) => {
        const key = `${finding.type}:${finding.value}`;
        if (seen.has(key)) return;
        seen.add(key);
        findings.push(finding);
    };

    const text = document.body?.textContent || '';
    if (knownNumbers.size) {
        for (const match of text.matchAll(SEI_REFERENCE_PATTERN)) {
            const number = match[1].replace(/\D/g, '');
            if (!knownNumbers.has(number)) {
                add({
                    type: 'unknown-sei-reference',
                    severity: 'error',
                    value: number,
                    message: `Referência SEI ${number} não encontrada no processo`
                });
            }
        }
    }

    Array.from(document.querySelectorAll('a[data-cke-linksei], a.ancoraSei, a.ancora_sei')).forEach((anchor) => {
        const number = String(anchor.textContent || '').match(/\d{5,12}/)?.[0];
        if (number && knownNumbers.size && !knownNumbers.has(number)) {
            add({
                type: 'unknown-sei-reference',
                severity: 'error',
                value: number,
                message: `Referência SEI ${number} não encontrada no processo`
            });
        }
    });

    Array.from(document.querySelectorAll('a.legisSeiPro, a[data-norma]')).forEach((anchor) => {
        const href = anchor.getAttribute('href') || anchor.getAttribute('data-cke-saved-href') || '';
        if (!/^https?:\/\//i.test(href)) {
            const value = String(anchor.textContent || anchor.getAttribute('data-norma') || '').trim();
            add({
                type: 'broken-legal-citation',
                severity: 'error',
                value,
                message: `Citação normativa sem link verificável: ${value || 'norma sem identificação'}`
            });
        }
    });

    const linkedLegalText = new Set(Array.from(document.querySelectorAll('a')).map((anchor) =>
        String(anchor.textContent || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase()
    ));
    for (const match of text.matchAll(LEGAL_REFERENCE_PATTERN)) {
        const value = match[0].replace(/\s+/g, ' ').trim();
        if (![...linkedLegalText].some((linked) => linked.includes(value.toLocaleLowerCase()))) {
            add({
                type: 'unlinked-legal-citation',
                severity: 'warning',
                value,
                message: `Confira a fonte e o link de “${value}”`
            });
        }
    }
    return findings;
}
