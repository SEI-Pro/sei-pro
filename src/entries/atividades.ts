/**
 * Raiz de composição da capacidade ATIVIDADES — ADR-0002/0005.
 *
 * O núcleo residual continua dividido em módulos dentro de `features/atividades`,
 * mas a decisão de instalá-lo deixou de pertencer ao módulo da feature. As quatro
 * capacidades extraídas são instaladas explicitamente aqui, preservando a ordem
 * do bundle sem reintroduzir auto-boot ou dependência implícita do manifest.
 */
import { installAtividadesFeature } from '../features/atividades/index.js';
import { installAtividadesConfigFeature } from '../features/atividades-config/index.js';
import { installAtividadesAfastamentosFeature } from '../features/atividades-afastamentos/index.js';
import { installAtividadesAvaliacoesFeature } from '../features/atividades-avaliacoes/index.js';
import { installAtividadesRegistroFeature } from '../features/atividades-registro/index.js';

installAtividadesConfigFeature();
installAtividadesAfastamentosFeature();
installAtividadesAvaliacoesFeature();
installAtividadesRegistroFeature();
installAtividadesFeature();
