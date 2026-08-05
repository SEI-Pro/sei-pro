const REQUIRED_CLASS_PATTERN = /(?:^|[-_\s])(required|required-field|obrigatorio|campo-obrigatorio)(?:$|[-_\s])/i;
const PLACEHOLDER_PATTERN = /(?:\[\s*(?:preencher|inserir|informar|texto|exemplo)[^\]]*\]|\{\{[^}]+\}\}|_{3,})/i;
const TEMPLATE_TEXT_PATTERN = /^(?:nome completo|cargo ou fun[cç][aã]o)$/i;
const TAG_PATTERN = /(^|[\s([{>])#([\p{L}][\p{L}\p{N}_+-]*)/gu;

function excerpt(value, maxLength = 100) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function issue(type, message, context = '', severity = 'warning', location = null) {
    return {
        id: `${type}:${message}:${context}`,
        type,
        severity,
        message,
        context: excerpt(context),
        location
    };
}

function defaultParseHtml(html) {
    if (typeof DOMParser !== 'function') {
        throw new TypeError('scanChecklist requires parseHtml outside a browser');
    }
    return new DOMParser().parseFromString(html, 'text/html');
}

export function scanChecklist(html, { parseHtml = defaultParseHtml, documents = [] } = {}) {
    const document = parseHtml(String(html ?? ''));
    const issues = [];
    const bodyText = document.body?.textContent || document.documentElement?.textContent || '';
    const seenTags = new Set();

    for (const match of bodyText.matchAll(TAG_PATTERN)) {
        const tag = `#${match[2]}`;
        if (!seenTags.has(tag.toLocaleLowerCase())) {
            seenTags.add(tag.toLocaleLowerCase());
            issues.push(issue('unresolved-tag', `Campo dinâmico não resolvido: ${tag}`, tag, 'error', {
                kind: 'text',
                value: tag
            }));
        }
    }

    Array.from(document.querySelectorAll('p')).forEach((paragraph, index) => {
        const text = String(paragraph.textContent || '').replace(/\u00a0/g, ' ').trim();
        const className = paragraph.getAttribute('class') || '';
        const explicitlyRequired = paragraph.hasAttribute('required')
            || paragraph.getAttribute('aria-required') === 'true'
            || paragraph.getAttribute('data-required') === 'true'
            || REQUIRED_CLASS_PATTERN.test(className);
        const previousText = String(paragraph.previousElementSibling?.textContent || '').trim();
        const followsShortLabel = !text && previousText.length > 0
            && previousText.length <= 80 && /:\s*$/.test(previousText);

        if ((!text && (explicitlyRequired || followsShortLabel))
            || PLACEHOLDER_PATTERN.test(text)
            || TEMPLATE_TEXT_PATTERN.test(text)) {
            issues.push(issue(
                'required-field',
                text ? 'Campo obrigatório ainda contém um marcador' : 'Campo obrigatório aparentemente vazio',
                text || previousText || `Paragraph ${index + 1}`,
                'error',
                { kind: 'paragraph', index }
            ));
        }
    });

    const reviewNodes = Array.from(document.querySelectorAll(
        '.reviewSeiPro, [data-review], .seipro-review-pending, .pending-review'
    ));
    const reviewMarks = new Set(reviewNodes.map((node, index) =>
        node.getAttribute('data-id-review') || `node-${index}`
    ));
    if (reviewMarks.size) {
        issues.push(issue(
            'pending-review',
            `${reviewMarks.size} marca(s) de revisão pendente(s)`,
            reviewNodes.map((node) => node.textContent).join(' '),
            'error',
            { kind: 'selector', value: '.reviewSeiPro, [data-review]' }
        ));
    }

    Array.from(document.querySelectorAll('a[href^="#"]')).forEach((anchor) => {
        const href = anchor.getAttribute('href');
        const target = href?.slice(1);
        if (!target) return;
        let decodedTarget = target;
        try {
            decodedTarget = decodeURIComponent(target);
        } catch {
            // Keep the original fragment when malformed encoding is present.
        }
        const destination = document.getElementById(decodedTarget)
            || document.getElementsByName?.(decodedTarget)?.[0];
        if (!destination) {
            issues.push(issue(
                'broken-reference',
                `Referência interna quebrada: #${decodedTarget}`,
                anchor.textContent || href,
                'error',
                { kind: 'selector', value: `a[href="#${target}"]` }
            ));
        }
    });

    verifyCitations(html, documents, { parseHtml }).forEach((finding) => {
        issues.push(issue(
            finding.type,
            finding.message,
            finding.value,
            finding.severity,
            { kind: 'text', value: finding.value }
        ));
    });

    return {
        issues,
        counts: issues.reduce((counts, item) => {
            counts[item.type] = (counts[item.type] || 0) + 1;
            return counts;
        }, {}),
        ok: issues.length === 0
    };
}
import { verifyCitations } from './citations.js';
