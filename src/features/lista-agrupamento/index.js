import { installListaAgrupamentoDomain } from './domain.js';
import { installListaAgrupamentoIO } from './io.js';
import { installListaAgrupamentoView } from './view.js';
import './legacy-api.js';

const globalRef = typeof window !== 'undefined' ? window : globalThis;
installListaAgrupamentoDomain(globalRef);
installListaAgrupamentoIO(globalRef);
installListaAgrupamentoView(globalRef);