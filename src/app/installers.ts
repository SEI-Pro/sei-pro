/**
 * Executa instaladores nomeados sem deixar uma falha interromper os próximos.
 *
 * As raízes de composição usam esta pequena porta quando ainda precisam
 * instalar módulos legados fora do registry de features. O contrato mantém o
 * mesmo isolamento do `app/boot`, mas não acopla o runtime legado ao DOM.
 */
export type NamedInstaller = readonly [id: string, install: () => unknown];

export type InstallerLogger = {
    error(message: string, error: unknown): void;
};

export type InstallerReport = {
    failed: string[];
};

/**
 * Executa a lista em ordem e continua após uma falha.
 */
export function runInstallersSafely(
    installers: readonly NamedInstaller[],
    { logger }: { logger: InstallerLogger }
): InstallerReport {
    const failed: string[] = [];

    for (const [id, install] of installers) {
        try {
            install();
        } catch (error) {
            failed.push(id);
            logger.error(`installer "${id}" falhou`, error);
        }
    }

    return { failed };
}
