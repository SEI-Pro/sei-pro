// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — demo seed data (local-first smoke without backend).
 */
import { addDays, formatDateTime, today } from './domain/datas.js';
import { normalizeProjeto } from './domain/model.js';

export function buildDemoProjetos(now = today()) {
    const t0 = addDays(now, -14);
    const p1 = normalizeProjeto({
        id_projeto: 9001,
        nome_projeto: 'Demo — Modernizacao SEI Pro',
        id_tipo_projeto: 1,
        nome_tipo_projeto: 'Interno',
        ativo: true,
        sigla_unidade: 'DEMO',
        etapas: [
            {
                id_etapa: 1,
                nome_etapa: 'Levantamento de requisitos',
                macroetapa: 'Planejamento',
                responsavel: 'Ana',
                grupo: 'Produto',
                data_inicio_programado: formatDateTime(t0),
                data_fim_programado: formatDateTime(addDays(t0, 4)),
                data_inicio_execucao: formatDateTime(t0),
                data_fim_execucao: formatDateTime(addDays(t0, 5)),
                progresso_execucao: 100,
                calendario: 'util'
            },
            {
                id_etapa: 2,
                nome_etapa: 'Arquitetura e prototipo',
                macroetapa: 'Planejamento',
                responsavel: 'Bruno',
                id_dependencia: 1,
                predecessoras: [{ id_etapa: 1, tipo: 'FS', lag_dias: 0 }],
                data_inicio_programado: formatDateTime(addDays(t0, 5)),
                data_fim_programado: formatDateTime(addDays(t0, 12)),
                progresso_execucao: 60,
                data_inicio_progresso_automatico: formatDateTime(addDays(t0, 5)),
                data_fim_progresso_automatico: formatDateTime(addDays(t0, 12)),
                calendario: 'util'
            },
            {
                id_etapa: 3,
                nome_etapa: 'Migracao do modulo Projetos',
                macroetapa: 'Execucao',
                responsavel: 'Ana',
                id_dependencia: 2,
                predecessoras: [{ id_etapa: 2, tipo: 'FS', lag_dias: 0 }],
                data_inicio_programado: formatDateTime(addDays(t0, 13)),
                data_fim_programado: formatDateTime(addDays(t0, 27)),
                progresso_execucao: 35,
                calendario: 'util'
            },
            {
                id_etapa: 4,
                nome_etapa: 'Marco — Go-live interno',
                macroetapa: 'Entrega',
                responsavel: 'Bruno',
                marco: true,
                id_dependencia: 3,
                predecessoras: [{ id_etapa: 3, tipo: 'FS', lag_dias: 0 }],
                data_inicio_programado: formatDateTime(addDays(t0, 28)),
                data_fim_programado: formatDateTime(addDays(t0, 28)),
                progresso_execucao: 0,
                calendario: 'util'
            },
            {
                id_etapa: 5,
                nome_etapa: 'Documentacao e smoke test',
                macroetapa: 'Entrega',
                responsavel: 'Carla',
                id_dependencia: 3,
                predecessoras: [{ id_etapa: 3, tipo: 'SS', lag_dias: 2 }],
                data_inicio_programado: formatDateTime(addDays(t0, 20)),
                data_fim_programado: formatDateTime(addDays(t0, 30)),
                progresso_execucao: 10,
                calendario: 'corrido'
            }
        ]
    });

    const p2 = normalizeProjeto({
        id_projeto: 9002,
        nome_projeto: 'Demo — Capacitacao da equipe',
        id_tipo_projeto: 2,
        nome_tipo_projeto: 'Capacitacao',
        ativo: true,
        sigla_unidade: 'DEMO',
        etapas: [
            {
                id_etapa: 11,
                nome_etapa: 'Material de apoio',
                macroetapa: 'Preparacao',
                responsavel: 'Carla',
                data_inicio_programado: formatDateTime(addDays(now, -7)),
                data_fim_programado: formatDateTime(addDays(now, 3)),
                progresso_execucao: 80
            },
            {
                id_etapa: 12,
                nome_etapa: 'Oficina pratica',
                macroetapa: 'Execucao',
                responsavel: 'Ana',
                id_dependencia: 11,
                predecessoras: [{ id_etapa: 11, tipo: 'FS', lag_dias: 1 }],
                data_inicio_programado: formatDateTime(addDays(now, 4)),
                data_fim_programado: formatDateTime(addDays(now, 5)),
                progresso_execucao: 0
            }
        ]
    });

    return [p1, p2];
}

export function demoTipos() {
    return [
        { id_tipo_projeto: 1, nome_tipo_projeto: 'Interno' },
        { id_tipo_projeto: 2, nome_tipo_projeto: 'Capacitacao' }
    ];
}
