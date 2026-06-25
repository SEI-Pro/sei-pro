/**
 * Entry legada transitória — mantém dist/js/core-stack.bundle.js enquanto os
 * contextos de página ainda não foram migrados para src/entries/*. Quando todos
 * os blocos do manifest apontarem para entries, este arquivo é removido.
 *
 * A composição vive em src/core/stack.js (reusada pelas entries).
 */
import { installCoreStack } from '../core/stack.js';

installCoreStack();
