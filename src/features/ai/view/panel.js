import { createStreamPanel } from '../../../shared/ui/stream-panel.js';

export function createAiPanel({ onAccept, onDiscard, onStop, onRetry } = {}) {
    const progress = [];
    let round = 0;
    const panel = createStreamPanel({
        title: 'Minuta — IA do SEI Pro',
        onAccept,
        onDiscard,
        onStop,
        onRetry
    });

    return {
        ...panel,
        start() {
            round = 0;
            progress.length = 0;
            panel.setText('').setTools([]).setStatus('Preparando contexto…').setRunning(true).open();
            return this;
        },
        beginRound(iteration) {
            round = iteration;
            if (iteration > 1) panel.setText('');
            panel.setStatus(iteration > 1
                ? `Gerando após as leituras, rodada ${iteration}…`
                : 'Gerando…');
            return this;
        },
        appendDelta(delta) {
            panel.appendDelta(delta);
            return this;
        },
        addProgress(message) {
            progress.push(String(message));
            panel.setTools(progress.slice(-8));
            panel.setStatus(String(message));
            return this;
        },
        complete(message = 'Minuta pronta para revisão') {
            panel.setStatus(message).setRunning(false);
            return this;
        },
        fail(error) {
            panel.setStatus(`Erro: ${error.message || error}`).setRunning(false);
            return this;
        },
        stopped() {
            panel.setStatus('Geração interrompida').setRunning(false);
            return this;
        },
        get round() {
            return round;
        }
    };
}
