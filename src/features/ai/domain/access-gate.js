export function normalizeAccessLevel(value) {
    if (value === 1 || value === '1') return 1;
    if (value === 2 || value === '2') return 2;
    const text = String(value || '').toLocaleLowerCase();
    if (text.includes('sigil')) return 2;
    if (text.includes('restrit')) return 1;
    return 0;
}

export function requiresDocumentConsent(document = {}) {
    if (document.accessKnown === false) return true;
    return normalizeAccessLevel(
        document.nivelAcesso ?? document.nivel_acesso ?? document.sigilo
    ) > 0;
}

export function partitionDocumentsByAccess(documents = []) {
    return documents.reduce(function (result, document) {
        result[requiresDocumentConsent(document) ? 'restricted' : 'public'].push(document);
        return result;
    }, { public: [], restricted: [] });
}

export function restrictedContentNotice(document = {}) {
    const level = normalizeAccessLevel(document.nivelAcesso ?? document.sigilo);
    const label = document.accessKnown === false
        ? 'ACCESS LEVEL NOT VERIFIED'
        : (level === 2 ? 'CONFIDENTIAL' : 'RESTRICTED');
    return [
        `[${label} CONTENT EXPLICITLY AUTHORIZED BY THE USER]`,
        `SEI document: ${document.numeroSEI || document.id || 'unknown'}`,
        `Legal hypothesis: ${document.hipoteseLegal || 'not available'}`
    ].join('\n');
}

export function createAccessAuditRecord(document = {}, profile = {}, now = new Date()) {
    return {
        timestamp: now.toISOString(),
        providerId: profile.providerId || '',
        model: profile.model || '',
        profileId: profile.id || '',
        documentNumber: String(document.numeroSEI || document.id || ''),
        accessLevel: document.accessKnown === false
            ? null
            : normalizeAccessLevel(document.nivelAcesso ?? document.sigilo),
        accessLevelVerified: document.accessKnown !== false
    };
}
