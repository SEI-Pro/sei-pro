/**
 * Raiz de composição da capacidade ATIVIDADES — ADR-0002/0005.
 *
 * O corpo continua dividido em módulos dentro de `features/atividades`, mas a
 * decisão de instalá-lo deixou de pertencer ao módulo da feature. Isso permite
 * extrair configuração, afastamentos, avaliações e registro em fatias futuras
 * sem reintroduzir auto-boot ou ordem implícita no manifest.
 */
import { installAtividadesFeature } from '../features/atividades/index.js';

installAtividadesFeature();
