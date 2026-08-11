/**
 * Domain puro da capacidade "Informações adicionais na árvore" (`infoarvore`).
 * Sem DOM / window / chrome / storage — só ids, estados e preferência.
 */
export const PREFERENCE_STORAGE_KEY = 'configViewFlashPanelArvorePro' as const;

export const PANEL_SECTION_IDS = [
    'anotacoes',
    'responsaveis',
    'marcador',
    'acompanhamento_especial',
    'tipo_procedimento',
    'interessados',
    'nivel_acesso',
    'assuntos',
    'observacoes'
] as const;

export type PanelSectionId = (typeof PANEL_SECTION_IDS)[number];

/** Rótulos usados na personalização (Personalizar Menu / flash panel). */
export const PANEL_SECTION_LABELS: Readonly<Record<PanelSectionId, string>> = Object.freeze({
    anotacoes: 'Anotações',
    responsaveis: 'Atribuição',
    marcador: 'Marcador',
    acompanhamento_especial: 'Acompanhamento Especial',
    tipo_procedimento: 'Tipo de Procedimento',
    interessados: 'Interessados',
    nivel_acesso: 'Nível de Acesso',
    assuntos: 'Assuntos',
    observacoes: 'Observações'
});

export type PanelSectionMode = 'read' | 'edit';

export const PANEL_SECTION_MODES: Readonly<Record<PanelSectionId, PanelSectionMode>> = Object.freeze({
    anotacoes: 'edit',
    responsaveis: 'edit',
    marcador: 'edit',
    acompanhamento_especial: 'edit',
    tipo_procedimento: 'edit',
    interessados: 'read',
    nivel_acesso: 'read',
    assuntos: 'read',
    observacoes: 'read'
});

export type PanelSectionState =
    | 'hidden'
    | 'loading'
    | 'ready'
    | 'empty'
    | 'unavailable'
    | 'failed'
    | 'editing'
    | 'saving';

export function isPanelSectionId(value: string): value is PanelSectionId {
    return (PANEL_SECTION_IDS as readonly string[]).includes(value);
}

/**
 * Preferência ausente, vazia ou inválida → todas as seções canônicas habilitadas.
 * Entradas desconhecidas são ignoradas.
 */
export function resolveEnabledSectionIds(raw: unknown): ReadonlySet<PanelSectionId> {
    if (raw == null) return new Set(PANEL_SECTION_IDS);
    if (!Array.isArray(raw) || raw.length === 0) return new Set(PANEL_SECTION_IDS);

    const labelToId = new Map<string, PanelSectionId>();
    for (const id of PANEL_SECTION_IDS) {
        labelToId.set(PANEL_SECTION_LABELS[id], id);
    }

    const enabled = new Set<PanelSectionId>();
    for (const entry of raw) {
        const name = Array.isArray(entry) ? entry[0] : entry;
        if (typeof name !== 'string' || !name) continue;
        const id = labelToId.get(name);
        if (id) enabled.add(id);
    }
    return enabled.size > 0 ? enabled : new Set(PANEL_SECTION_IDS);
}

export function isSectionEnabled(
    sectionId: string,
    enabledIds: ReadonlySet<PanelSectionId> | null | undefined
): boolean {
    if (!enabledIds) return true;
    if (!isPanelSectionId(sectionId)) return true;
    return enabledIds.has(sectionId);
}
