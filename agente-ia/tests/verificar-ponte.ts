/**
 * Quem a aba do SEI precisa servir.
 *
 * `chrome.runtime.onConnect` só dispara no MOMENTO do `connect`: uma página da
 * extensão aberta DEPOIS de a aba já ter conectado não recebe porta nenhuma.
 * Era o caso real do fluxo normal de uso — painel aberto, clico no botão do
 * Estúdio, e o Estúdio dizia "Nenhuma aba do SEI conectada".
 *
 * A aba refaz a conexão quando vê um ABRIDOR novo. O que ela não pode fazer é
 * refazer a cada renovação do mesmo abridor: o painel reescreve o aviso a cada
 * 60 s, e reconectar nessa cadência mataria operação em curso e encheria o SEI
 * de churn.
 */

import { abridorDe, precisaConectar } from "../src/ponte/protocolo";
import { checar, secao } from "./util";

export function verificarPonte(): void {
  secao("ponte: quando a aba (re)conecta");
  const servidos = new Set<string>();

  checar("sem aviso nenhum, nao conecta", precisaConectar(undefined, false, servidos) === false);
  checar("aviso novo e sem porta: conecta", precisaConectar({ id: "painel-1", quando: 1 }, false, servidos));

  servidos.add("painel-1");
  checar("mesmo abridor renovando, com porta viva: NAO reconecta", precisaConectar({ id: "painel-1", quando: 2 }, true, servidos) === false);
  checar("abridor NOVO com porta viva: reconecta, para servi-lo", precisaConectar({ id: "estudio-1", quando: 3 }, true, servidos));
  servidos.add("estudio-1");
  checar("depois de servido, o estudio renovando nao reconecta", precisaConectar({ id: "estudio-1", quando: 4 }, true, servidos) === false);
  checar("e o painel renovando tambem nao", precisaConectar({ id: "painel-1", quando: 5 }, true, servidos) === false);
  checar("porta caida e abridor ja servido: conecta de novo", precisaConectar({ id: "painel-1", quando: 6 }, false, servidos));

  secao("ponte: aviso no formato antigo");
  // Durante uma atualizacao, uma aba com o content script NOVO pode ver o aviso
  // gravado por um painel ANTIGO, que era so um numero.
  checar("numero vira abridor", abridorDe(1790202322314) === "1790202322314");
  checar("objeto novo da o id", abridorDe({ id: "painel-1", quando: 9 }) === "painel-1");
  checar("valor vazio nao da abridor", abridorDe(undefined) === null && abridorDe(0) === null);
  const antigos = new Set<string>();
  checar("aviso antigo conecta uma vez", precisaConectar(1790202322314, false, antigos));
  antigos.add("1790202322314");
  checar("e o mesmo numero nao reconecta", precisaConectar(1790202322314, true, antigos) === false);
}
