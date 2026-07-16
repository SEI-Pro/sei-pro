import { installListaAgrupamentoDomain } from './domain.js';
import './legacy-api.js';

installListaAgrupamentoDomain(typeof window !== 'undefined' ? window : globalThis);