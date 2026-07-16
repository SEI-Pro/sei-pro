import { installListaAgrupamentoDomain } from './domain.js';
import { installListaAgrupamentoIO } from './io.js';
import './legacy-api.js';

installListaAgrupamentoDomain(typeof window !== 'undefined' ? window : globalThis);
installListaAgrupamentoIO(typeof window !== 'undefined' ? window : globalThis);