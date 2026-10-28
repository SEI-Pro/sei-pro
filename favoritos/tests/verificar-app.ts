import { areaMemoria } from "@comum/armazenamento/area";
import { instalarChromeStorage } from "../../sei-comum/tests/chromeFalso";
import { type AbrirModal, AppFavoritos, type DepsApp } from "../src/app/app";
import { chaveMigracao, chaveUltimaUnidade } from "../src/modelo/constantes";
import { escoposDoContexto } from "../src/modelo/escopo";
import { chaveCancelar, chaveProgresso } from "../src/pagina/atualizar";
import { chaveStatusTexto } from "../src/pagina/sincronia";
import { definirTextoPadrao, estadoTextoPadrao, gravarPreferencias, lerPreferencias } from "../src/preferencias";
import { RepositorioFavoritos } from "../src/repositorio";
import { copiasEmMemoria } from "../src/sincronia/copias";
import { botao, checar, disparar, escolherCombo, instalarDom, itemDoMenu, secao, tique } from "./util";
import { CTX } from "./verificar-modelo";

function montar(extra: Partial<DepsApp> = {}, inicial: Record<string, unknown> = {}) {
  const doc = instalarDom('<html><body><div id="app"></div></body></html>');
  const area = areaMemoria(inicial);
  const sync = areaMemoria();
  let t = 1000;
  const carimbo = () => ({ agora: ++t, dispositivo: "X" });
  const esc = escoposDoContexto(CTX);
  const repos = {
    unidade: new RepositorioFavoritos(area, esc.unidade!, carimbo),
    pessoal: new RepositorioFavoritos(area, esc.pessoal, carimbo),
  };
  const chamadas: Array<[string, unknown]> = [];
  const modais: Array<{ titulo: string; conteudo: HTMLElement; fechado: boolean }> = [];
  const baixados: string[] = [];
  const copiados: string[] = [];
  const abrirModal: AbrirModal = (o) => {
    const m = { titulo: o.titulo, conteudo: o.conteudo, fechado: false };
    modais.push(m);
    return {
      fechar: () => {
        m.fechado = true;
        o.aoFechar?.();
      },
    };
  };
  const deps: DepsApp = {
    rpc: {
      chamar: (async (op: string, args?: unknown) => {
        chamadas.push([op, args]);
        return op === "lerLegado" ? { local: null, arquivo: null } : true;
      }) as DepsApp["rpc"]["chamar"],
    },
    ctx: CTX,
    area,
    sync,
    repos,
    carimbo,
    abrirModal,
    confirmar: async () => true,
    baixar: (nome) => void baixados.push(nome),
    copiar: async (texto) => void copiados.push(texto),
    escolherArquivo: async () => null,
    hoje: () => "2026-10-01",
    ...extra,
  };
  const raiz = doc.getElementById("app")!;
  return { doc, raiz, area, sync, repos, chamadas, modais, baixados, copiados, app: new AppFavoritos(raiz, deps) };
}

export async function verificarApp(): Promise<void> {
  secao("app montado: lista, abas e mudancas de outro contexto");
  const a = montar();
  await a.repos.unidade.adicionar({ id: "1", protocolo: "50300.000001/2026-01", tipo: "Fiscalização" });
  await a.repos.unidade.adicionar({ id: "2", protocolo: "50300.000002/2026-02", tipo: "Contrato" });
  await a.app.iniciar();
  const itens = () => a.raiz.querySelectorAll("li.fav-item").length;
  checar("lista os monitorados da unidade", itens() === 2, itens());
  checar("abas com contagem", !!botao(a.raiz, "GPF (2)") && !!botao(a.raiz, "Pessoal (0)"));
  await a.repos.unidade.adicionar({ id: "3", protocolo: "50300.000003/2026-03" });
  await tique(80);
  checar("monitorado gravado pela estrela (outro contexto) aparece sozinho", itens() === 3);

  (a.raiz.querySelector('li[data-id="1"] .fav-protocolo') as HTMLElement).click();
  checar(
    "clicar no numero pede a aba para abrir",
    a.chamadas.some(([op, x]) => op === "abrirProcesso" && (x as { id: string }).id === "1"),
  );

  const linhasMon = [...a.raiz.querySelectorAll("li.fav-item")];
  checar(
    "cada monitorado tem um 'abrir em nova aba' e um 'copiar', depois do numero",
    linhasMon.length === 3 &&
      linhasMon.every(
        (li) =>
          li.querySelectorAll(".spro-nova-guia").length === 1 &&
          li.querySelectorAll(".spro-copiar-num").length === 1 &&
          li.querySelector(".spro-nova-guia")?.previousElementSibling === li.querySelector(".fav-protocolo") &&
          li.querySelector(".spro-copiar-num")?.previousElementSibling === li.querySelector(".spro-nova-guia"),
      ),
  );
  const antesChamadas = a.chamadas.length;
  (a.raiz.querySelector('li[data-id="2"] .spro-nova-guia') as HTMLElement).click();
  checar(
    "nova aba: abrirProcesso com novaAba=true",
    a.chamadas.length === antesChamadas + 1 &&
      JSON.stringify(a.chamadas.at(-1)?.[1]) === JSON.stringify({ id: "2", protocolo: "50300.000002/2026-02", novaAba: true }),
    a.chamadas.at(-1),
  );
  const antesCopias = a.copiados.length;
  (a.raiz.querySelector('li[data-id="2"] .spro-copiar-num') as HTMLElement).click();
  await tique();
  checar(
    "copiar: numero da linha, sem abrir o processo",
    a.copiados.at(-1) === "50300.000002/2026-02" && a.copiados.length === antesCopias + 1 && a.chamadas.length === antesChamadas + 1,
    a.copiados,
  );
  a.copiados.length = 0;
  checar(
    "copiar: feedback no botao",
    a.raiz.querySelector('li[data-id="2"] .spro-copiar-num')?.classList.contains("spro-copiado") === true,
  );
  checar("botoes nao marcam o monitorado", !a.raiz.querySelector('li[data-id="2"]')?.classList.contains("fav-item-selecionado"));

  const busca = a.raiz.querySelector('input[type="search"]') as HTMLInputElement;
  busca.value = "contrato";
  disparar(busca, "input");
  await tique(220);
  checar("busca filtra", itens() === 1);
  busca.value = "";
  disparar(busca, "input");
  await tique(220);

  secao("app montado: selecao e lote");
  const sel = a.raiz.querySelector('li[data-id="2"] input.fav-sel') as HTMLInputElement;
  // No linkedom, `checked` não reflete o atributo: marca-se como o navegador faz.
  sel.checked = true;
  disparar(sel, "change");
  checar("barra de selecao entra animada so na primeira vez", !!a.raiz.querySelector(".fav-lote.fav-lote-entrar"));
  const sel3 = a.raiz.querySelector('li[data-id="3"] input.fav-sel') as HTMLInputElement;
  sel3.checked = true;
  disparar(sel3, "change");
  checar("segunda marcacao nao reanima a barra", !!a.raiz.querySelector(".fav-lote") && !a.raiz.querySelector(".fav-lote-entrar"));
  sel3.checked = false;
  disparar(sel3, "change");
  botao(a.raiz, "Copiar números")!.click();
  await tique();
  checar("copia os numeros selecionados", a.copiados.join() === "50300.000002/2026-02");
  botao(a.raiz, "Baixar CSV")!.click();
  checar("baixa o CSV com nome da lista e data", a.baixados.includes("favoritos-GPF-2026-10-01.csv"), a.baixados);
  botao(a.raiz, "Remover selecionados")!.click();
  await tique(80);
  checar("remover manda para a lixeira", !(await a.repos.unidade.contem("2")) && itens() === 2);
  checar("aviso com desfazer, no rodape da tela", !!botao(a.doc.body, "Desfazer"));
  checar(
    "o aviso vai para a camada de cima (acima de dialogo aberto)",
    a.doc.body.querySelector(".spro-aviso")?.getAttribute("popover") === "manual",
  );
  botao(a.doc.body, "Desfazer")!.click();
  await tique(80);
  checar("desfazer devolve", (await a.repos.unidade.contem("2")) && itens() === 3);

  secao("app montado: editar");
  (a.raiz.querySelector('li[data-id="1"] .fav-titulo') as HTMLElement).click();
  const modal = a.modais[a.modais.length - 1]!;
  checar("editar abre o dialogo do processo", modal.titulo.includes("50300.000001/2026-01"));
  (modal.conteudo.querySelector('input[aria-label="Título"]') as HTMLInputElement).value = "Porto de Santos";
  botao(modal.conteudo, "Salvar")!.click();
  await tique(80);
  checar(
    "salvar grava e a lista mostra o titulo",
    (await a.repos.unidade.obter("1"))?.titulo === "Porto de Santos" && (a.raiz.textContent ?? "").includes("Porto de Santos"),
  );

  secao("app montado: Pessoal e lixeira");
  botao(a.raiz, "Pessoal (0)")!.click();
  await tique(80);
  checar("aba Pessoal vazia convida a usar o alvo", (a.raiz.querySelector(".fav-vazio")?.textContent ?? "").includes("alvo"));
  botao(a.raiz, "GPF (3)")!.click();
  await tique(80);
  itemDoMenu(a.raiz, "Opções dos monitorados", "Lixeira");
  await tique(20);
  checar("lixeira abre (vazia depois do desfazer)", (a.raiz.textContent ?? "").includes("A lixeira está vazia."));

  secao("app montado: altura do iframe fora da tela");
  // Fora da tela o Chrome suspende o ResizeObserver do iframe de outra origem
  // (prova P2, SEI SP 4.1.5): o app avisa a cada redesenho para a altura ser medida na hora.
  let redesenhos = 0;
  const h = montar({ aoRedesenhar: () => (redesenhos += 1) });
  await h.app.iniciar();
  const depoisDeIniciar = redesenhos;
  await h.repos.unidade.adicionar({ id: "9", protocolo: "9/2026" });
  await tique(80);
  checar("avisa o redesenho ao iniciar e quando a lista muda", depoisDeIniciar >= 1 && redesenhos > depoisDeIniciar, {
    depoisDeIniciar,
    redesenhos,
  });

  secao("app montado: troca de unidade");
  const b = montar({}, { [chaveUltimaUnidade(CTX.host, CTX.login.toLowerCase())]: { id: "999", sigla: "SFC" } });
  await b.app.iniciar();
  const faixa = b.raiz.querySelector(".fav-faixa-unidade")?.textContent ?? "";
  checar("faixa explica a troca de unidade", faixa.includes("GPF") && faixa.includes("SFC"), faixa);
  const c = montar({}, { [chaveUltimaUnidade(CTX.host, CTX.login.toLowerCase())]: { id: "110000001", sigla: "GPF" } });
  await c.app.iniciar();
  checar("mesma unidade, sem faixa", !c.raiz.querySelector(".fav-faixa-unidade"));

  secao("app montado: migracao dos monitorados antigos");
  const legado = { favorites: [{ id_procedimento: "70", processo: "70/2026", categoria: "Contratos" }] };
  const m = montar({
    rpc: { chamar: (async (op: string) => (op === "lerLegado" ? { local: legado, arquivo: null } : true)) as DepsApp["rpc"]["chamar"] },
  });
  await m.app.iniciar();
  const dlg = m.modais[0];
  checar("oferece trazer os antigos na primeira vez", dlg?.titulo === "Monitorados da versão anterior");
  botao(dlg!.conteudo, "Trazer para GPF")!.click();
  await tique(80);
  checar(
    "traz para a unidade e marca a migracao",
    (await m.repos.unidade.contem("70")) &&
      !!(await m.area.obter(chaveMigracao(CTX.host, "pedro.soares")))[chaveMigracao(CTX.host, "pedro.soares")],
  );
  const legadoRpc = {
    chamar: (async (op: string) => (op === "lerLegado" ? { local: legado, arquivo: null } : true)) as DepsApp["rpc"]["chamar"],
  };
  const dia = 86_400_000;
  const m2 = montar({ rpc: legadoRpc }, { [chaveMigracao(CTX.host, "pedro.soares")]: { adiadoEm: Date.now() - dia } });
  await m2.app.iniciar();
  checar("'Agora nao' recente: nao pergunta de novo", m2.modais.length === 0);
  const m3 = montar({ rpc: legadoRpc }, { [chaveMigracao(CTX.host, "pedro.soares")]: { adiadoEm: Date.now() - 31 * dia } });
  await m3.app.iniciar();
  checar("'Agora nao' ha mais de 30 dias: oferece de novo", m3.modais[0]?.titulo === "Monitorados da versão anterior");
  checar(
    "o dialogo diz onde achar a opcao depois",
    (m3.modais[0]?.conteudo.textContent ?? "").includes("Trazer monitorados da versão anterior"),
  );
  const m4 = montar({ rpc: legadoRpc }, { [chaveMigracao(CTX.host, "pedro.soares")]: { em: 1, quantidade: 1, destino: "unidade" } });
  await m4.app.iniciar();
  checar("depois de trazidos, nunca mais pergunta", m4.modais.length === 0);

  secao("app: destruir (painel lateral remonta ao trocar de unidade)");
  const d = montar();
  await d.app.iniciar();
  d.app.destruir();
  await d.repos.unidade.adicionar({ id: "88", protocolo: "50300.000088/2026-88" });
  await tique(80);
  checar("app destruido nao reage mais ao storage", d.raiz.querySelectorAll("li.fav-item").length === 0);

  secao("app: preferencias pelo menu");
  const pr = montar({ lateralDisponivel: true });
  await pr.app.iniciar();
  itemDoMenu(pr.raiz, "Opções dos monitorados", "Preferências…");
  await tique(20);
  const dlgPref = pr.modais.at(-1);
  checar("abre o dialogo de preferencias", dlgPref?.titulo === "Preferências dos monitorados");
  checar("com 'onde mostrar' (painel lateral disponivel)", !!dlgPref?.conteudo.querySelector('input[value="lateral"]'));

  secao("app: mapa");
  const marcadores: Array<[number, number]> = [];
  const objeto = (): Record<string, unknown> => {
    const o: Record<string, unknown> = {};
    for (const k of ["addTo", "setView", "on", "bindPopup", "fitBounds", "invalidateSize", "setLatLng"]) o[k] = () => o;
    return o;
  };
  const Lfalso = {
    map: () => objeto(),
    tileLayer: () => objeto(),
    marker: (p: [number, number]) => {
      marcadores.push(p);
      return objeto();
    },
    latLngBounds: () => ({}),
  };
  const mp = montar({ carregarMapa: async () => Lfalso });
  await mp.repos.unidade.adicionar({ id: "61", protocolo: "50300.000061/2026-61" });
  await mp.repos.unidade.editar("61", { local: { lat: -3.7, lng: -38.5 } });
  await mp.app.iniciar();
  checar("item com local mostra o alfinete", !!mp.raiz.querySelector('li[data-id="61"] .fav-local'));
  itemDoMenu(mp.raiz.querySelector('li[data-id="61"]')!, "Mais ações para 50300.000061/2026-61", "Local no mapa…");
  await tique(80);
  checar("abre o mapa do monitorado", mp.modais.at(-1)?.titulo === "Local no mapa — 50300.000061/2026-61");
  checar(
    "ja com o marcador no local salvo",
    marcadores.some(([a, b]) => a === -3.7 && b === -38.5),
  );
  botao(mp.modais.at(-1)!.conteudo, "Remover local")!.click();
  await tique(40);
  checar("remover local grava", (await mp.repos.unidade.obter("61"))?.local === undefined);
  itemDoMenu(mp.raiz, "Opções dos monitorados", "Mapa dos monitorados");
  await tique(80);
  checar(
    "mapa geral abre mesmo sem locais e explica",
    mp.modais.at(-1)?.titulo === "Mapa dos monitorados" && /Nenhum monitorado/.test(mp.modais.at(-1)!.conteudo.textContent ?? ""),
  );
  const semMapa = montar();
  await semMapa.app.iniciar();
  checar("sem carregador de mapa, sem item de mapa", !itemDoMenu(semMapa.raiz, "Opções dos monitorados", "Mapa dos monitorados"));

  secao("app: sincronia pelo Texto Padrao");
  const sy = montar();
  await sy.app.iniciar();
  const convite = () => sy.raiz.querySelector(".fav-convite-sync");
  checar("convida a sincronizar (unidade e ainda nao perguntado)", !!convite() && /outros computadores/.test(convite()!.textContent ?? ""));
  botao(convite()!, "Saiba mais e ligar")!.click();
  await tique(20);
  const dlgC = sy.modais.at(-1);
  checar(
    "o consentimento explica os quatro pontos",
    dlgC?.titulo === "Sincronizar pelo Texto Padrão" &&
      /toda a unidade/.test(dlgC.conteudo.textContent ?? "") &&
      /sigilosos/.test(dlgC.conteudo.textContent ?? "") &&
      /Pessoal/.test(dlgC.conteudo.textContent ?? "") &&
      /desligar/i.test(dlgC.conteudo.textContent ?? ""),
  );
  botao(dlgC!.conteudo, "Ligar")!.click();
  await tique(30);
  const prefSy = await lerPreferencias(sy.sync);
  checar(
    "ligar grava o consentimento DESTA unidade e tira o convite",
    estadoTextoPadrao(prefSy, CTX.host, CTX.login, CTX.unidade!.id) === "ligado" &&
      estadoTextoPadrao(prefSy, CTX.host, CTX.login, "outra") === "nao-perguntado" &&
      !convite(),
    prefSy,
  );
  const esc = escoposDoContexto(CTX).unidade!;
  await sy.area.gravar({
    [chaveStatusTexto(esc)]: { estado: "ok", quando: Date.now() - 120_000, ultimoOk: Date.now() - 120_000, pendente: false },
  });
  await tique(30);
  const rodape = () => sy.raiz.querySelector(".fav-status-sync")?.textContent ?? "";
  checar("linha de status: sincronizado ha 2 min", /Sincronizado há 2 min/.test(rodape()), rodape());
  await sy.area.gravar({
    [chaveStatusTexto(esc)]: {
      estado: "erro",
      quando: Date.now(),
      pendente: true,
      mensagem: "Sessão do SEI expirada. Entre de novo no SEI.",
    },
  });
  await tique(30);
  checar("linha de status: erro com a mensagem", /expirada/.test(rodape()), rodape());
  itemDoMenu(sy.raiz, "Opções dos monitorados", "Sincronização…");
  await tique(20);
  const dlgS = sy.modais.at(-1)!;
  botao(dlgS.conteudo, "Sincronizar agora")!.click();
  await tique(20);
  checar(
    "sincronizar agora pede a aba",
    sy.chamadas.some(([op]) => op === "sincronizarAgora"),
  );
  botao(dlgS.conteudo, "Desligar e apagar do SEI")!.click();
  await tique(30);
  checar(
    "desligar e apagar pede a aba para excluir o texto",
    sy.chamadas.some(([op]) => op === "apagarDoSei"),
  );

  // Na aba, o "apagar" desliga a unidade (pagina/sincronia.ts); aqui o rpc é falso, então desliga-se à mão.
  await definirTextoPadrao(sy.sync, CTX.host, CTX.login, CTX.unidade!.id, "desligado");
  await tique(30);
  itemDoMenu(sy.raiz, "Opções dos monitorados", "Sincronização…");
  await tique(30);
  const dlgD = sy.modais.at(-1)!;
  checar(
    "desligado ainda oferece apagar um texto que ficou no SEI",
    !!botao(dlgD.conteudo, "Apagar o texto do SEI") && !!botao(dlgD.conteudo, "Ligar…"),
  );

  const naoAgora = montar();
  await naoAgora.app.iniciar();
  botao(naoAgora.raiz.querySelector(".fav-convite-sync")!, "Agora não")!.click();
  await tique(20);
  checar(
    "'Agora nao' desliga e some",
    !naoAgora.raiz.querySelector(".fav-convite-sync") &&
      estadoTextoPadrao(await lerPreferencias(naoAgora.sync), CTX.host, CTX.login, CTX.unidade!.id) === "desligado",
  );

  secao("app: copias diarias no dialogo de sincronizacao");
  const cp = copiasEmMemoria();
  const ap = montar({ copias: cp });
  await ap.repos.unidade.adicionar({ id: "31", protocolo: "50300.000031/2026-31" });
  await ap.app.iniciar();
  await tique(40);
  const lista = await cp.listar({ host: CTX.host, login: CTX.login });
  checar(
    "abrir o app faz a copia do dia",
    lista.length === 1 && lista[0]!.dia === "2026-10-01",
    lista.map((c) => c.dia),
  );
  itemDoMenu(ap.raiz, "Opções dos monitorados", "Sincronização…");
  await tique(40);
  const dlgCp = ap.modais.at(-1)!;
  checar(
    "o dialogo lista a copia com Restaurar",
    /01\/10\/2026/.test(dlgCp.conteudo.textContent ?? "") && !!botao(dlgCp.conteudo, "Restaurar"),
  );
  checar("sem arquivo disponivel, explica a alternativa", /Exportar/.test(dlgCp.conteudo.textContent ?? ""));
  await ap.repos.unidade.remover(["31"]);
  botao(dlgCp.conteudo, "Restaurar")!.click();
  await tique(60);
  checar("restaurar devolve o monitorado removido", await ap.repos.unidade.contem("31"));

  secao("app: o que mudou");
  const nv = montar();
  await nv.repos.unidade.adicionar({ id: "41", protocolo: "50300.000041/2026-41" });
  await nv.repos.unidade.adicionar({ id: "42", protocolo: "50300.000042/2026-42" });
  await nv.repos.unidade.editar("41", { visto: { quando: 1, fonte: "caixa", qtdDocumentos: 3, abertoNaUnidade: true } });
  await nv.repos.unidade.gravarAtual("41", { quando: 2, fonte: "caixa", qtdDocumentos: 5, abertoNaUnidade: false });
  await nv.app.iniciar();
  const selo = () => nv.raiz.querySelector('li[data-id="41"] .fav-novidade')?.textContent ?? "";
  checar("selo com o resumo da mudanca", selo() === "2 documentos novos · saiu da sua unidade", selo());
  checar("item sem mudanca, sem selo", !nv.raiz.querySelector('li[data-id="42"] .fav-novidade'));
  escolherCombo(nv.raiz, "Situação", "novidade");
  await tique(20);
  checar("filtro 'com novidade'", nv.raiz.querySelectorAll("li.fav-item").length === 1);
  escolherCombo(nv.raiz, "Situação", "novidade");
  await tique(20);
  checar("filtro tirado, voltam todos", nv.raiz.querySelectorAll("li.fav-item").length === 2);
  checar("o resumo conta as novidades", (nv.raiz.querySelector(".fav-resumo")?.textContent ?? "").includes("1 com novidade"));
  botao(nv.raiz, "1 com novidade")!.click();
  await tique(20);
  checar(
    "clicar no indicador filtra e vira ficha",
    nv.raiz.querySelectorAll("li.fav-item").length === 1 && !!botao(nv.raiz, "Tirar o filtro Com novidade"),
  );
  checar(
    "situacao 'fora da unidade' pela ultima leitura",
    (() => {
      botao(nv.raiz, "Tirar o filtro Com novidade")!.click();
      escolherCombo(nv.raiz, "Situação", "fora");
      const n = nv.raiz.querySelectorAll("li.fav-item").length;
      escolherCombo(nv.raiz, "Situação", "fora");
      return n === 1;
    })(),
  );
  await tique(20);
  itemDoMenu(nv.raiz.querySelector('li[data-id="41"]')!, "Mais ações para 50300.000041/2026-41", "Marcar como visto");
  await tique(80);
  checar("marcar como visto tira o selo", selo() === "", selo());
  await nv.repos.unidade.gravarAtual("41", { quando: 3, fonte: "caixa", qtdDocumentos: 6, abertoNaUnidade: false });
  await tique(80);
  checar("leitura nova (outro contexto) aparece sozinha", selo() === "1 documento novo", selo());

  secao("app: fixar no topo");
  const fx = montar();
  await fx.repos.unidade.adicionar({ id: "71", protocolo: "50300.000071/2026-71" });
  await fx.repos.unidade.adicionar({ id: "72", protocolo: "50300.000072/2026-72" });
  await fx.repos.unidade.adicionar({ id: "73", protocolo: "50300.000073/2026-73" });
  await fx.app.iniciar();
  const ordemIds = () => [...fx.raiz.querySelectorAll<HTMLElement>("li.fav-item")].map((l) => l.dataset.id).join();
  const fixar = (id: string) => fx.raiz.querySelector<HTMLButtonElement>(`li[data-id="${id}"] .fav-fixar`);
  checar(
    "botao de fixar ao lado do menu, desligado",
    fixar("73")?.getAttribute("aria-pressed") === "false" && fixar("73")?.getAttribute("aria-label") === "Fixar no topo",
  );
  fixar("73")!.click();
  await tique(80);
  checar(
    "fixado sobe para o topo, numa secao propria",
    ordemIds().startsWith("73,") && !!fx.raiz.querySelector('.fav-fixados li[data-id="73"]'),
    ordemIds(),
  );
  checar("grava no monitorado", (await fx.repos.unidade.obter("73"))?.fixado === true);
  checar(
    "o pino fica marcado",
    fixar("73")?.getAttribute("aria-pressed") === "true" && fixar("73")?.getAttribute("aria-label") === "Desafixar",
  );
  checar("nao repete o item na lista de baixo", fx.raiz.querySelectorAll('li[data-id="73"]').length === 1);
  itemDoMenu(fx.raiz.querySelector('li[data-id="73"]')!, "Mais ações para 50300.000073/2026-73", "Desafixar");
  await tique(80);
  checar(
    "desafixar pelo menu devolve a ordem",
    !(await fx.repos.unidade.obter("73"))?.fixado && !fx.raiz.querySelector(".fav-fixados"),
    ordemIds(),
  );

  secao("app: menu aberto e lista redesenhada");
  const or = montar();
  await or.repos.unidade.adicionar({ id: "81", protocolo: "50300.000081/2026-81" });
  await or.app.iniciar();
  (or.raiz.querySelector('li[data-id="81"] button[aria-haspopup="menu"]') as HTMLElement).click();
  checar("menu do item aberto", !!or.doc.querySelector(".spro-menu-pop"));
  await or.repos.unidade.adicionar({ id: "82", protocolo: "50300.000082/2026-82" });
  await tique(80);
  checar(
    "a lista redesenhou e o menu orfao fechou",
    !or.doc.querySelector(".spro-menu-pop") && or.raiz.querySelectorAll("li.fav-item").length === 2,
  );

  secao("app: selecionar todos nao pega grupo recolhido");
  const gr = montar();
  const pastaG = await gr.repos.unidade.criarPasta("Contratos");
  await gr.repos.unidade.adicionar({ id: "91", protocolo: "50300.000091/2026-91" });
  await gr.repos.unidade.adicionar({ id: "92", protocolo: "50300.000092/2026-92" });
  await gr.repos.unidade.editar("92", { pasta: pastaG.id });
  await gravarPreferencias(gr.sync, { agruparPorPasta: true });
  await gr.app.iniciar();
  const tituloGrupo = [...gr.raiz.querySelectorAll<HTMLElement>(".fav-grupo-titulo")].find((b) =>
    (b.textContent ?? "").includes("Contratos"),
  )!;
  tituloGrupo.click();
  checar("grupo recolhido esconde os itens", gr.raiz.querySelectorAll("li.fav-item").length === 1);
  botao(gr.raiz, "Selecionar todos")!.click();
  checar(
    "so seleciona o que esta a vista",
    (gr.raiz.querySelector(".fav-lote")?.textContent ?? "").includes("1 selecionado") &&
      !(gr.raiz.querySelector(".fav-lote")?.textContent ?? "").includes("2 selecionados"),
    gr.raiz.querySelector(".fav-lote")?.textContent,
  );

  secao("app: lembretes e 'Para hoje'");
  const lb = montar();
  await lb.repos.unidade.adicionar({ id: "51", protocolo: "50300.000051/2026-51" });
  await lb.repos.unidade.adicionar({ id: "52", protocolo: "50300.000052/2026-52" });
  await lb.repos.unidade.editar("52", { lembrete: { em: "2026-09-29", texto: "cobrar a SFC" } });
  await lb.app.iniciar();
  const hoje = lb.raiz.querySelector(".fav-hoje");
  checar(
    "'Para hoje' no topo com o lembrete vencido",
    !!hoje && !!hoje.querySelector('li[data-id="52"]') && /cobrar a SFC/.test(hoje.textContent ?? ""),
  );
  checar("e o item nao repete na lista", lb.raiz.querySelectorAll('li[data-id="52"]').length === 1);
  botao(lb.raiz.querySelector('li[data-id="51"]')!, "Lembrete de 50300.000051/2026-51")!.click();
  await tique(20);
  const dlgL = lb.modais.at(-1)!;
  checar("dialogo de lembrete", dlgL.titulo === "Lembrete — 50300.000051/2026-51");
  botao(dlgL.conteudo, "Amanhã")!.click();
  await tique(40);
  checar("'Amanha' grava o lembrete", (await lb.repos.unidade.obter("51"))?.lembrete?.em === "2026-10-02");
  itemDoMenu(lb.raiz.querySelector('li[data-id="52"]')!, "Mais ações para 50300.000052/2026-52", "Lembrete…");
  await tique(20);
  botao(lb.modais.at(-1)!.conteudo, "Concluir")!.click();
  await tique(60);
  checar(
    "concluir apaga o lembrete e tira de 'Para hoje'",
    (await lb.repos.unidade.obter("52"))?.lembrete === undefined && !lb.raiz.querySelector(".fav-hoje"),
  );

  secao("app: atualizar fora da unidade");
  const at = montar();
  await at.repos.unidade.adicionar({ id: "61", protocolo: "50300.000061/2026-61" });
  await at.repos.unidade.adicionar({ id: "62", protocolo: "50300.000062/2026-62" });
  await at.repos.unidade.gravarAtual("62", { quando: 1, fonte: "caixa", abertoNaUnidade: true });
  await at.app.iniciar();
  const bAt = botao(at.raiz, "Atualizar fora da unidade (1)");
  checar("botao conta os que nao estao na caixa", !!bAt);
  bAt!.click();
  await tique(20);
  const dlgA = at.modais.at(-1)!;
  checar(
    "na primeira vez explica antes de rodar",
    /recebimento/.test(dlgA.conteudo.textContent ?? "") && !at.chamadas.some(([op]) => op === "atualizarForaDaUnidade"),
  );
  botao(dlgA.conteudo, "Atualizar")!.click();
  await tique(30);
  checar(
    "e roda na aba",
    at.chamadas.some(([op]) => op === "atualizarForaDaUnidade"),
  );
  botao(at.raiz, "Atualizar fora da unidade (1)")!.click();
  await tique(30);
  checar("da segunda vez roda direto", at.chamadas.filter(([op]) => op === "atualizarForaDaUnidade").length === 2);

  secao("app: progresso do Atualizar");
  const pg = montar();
  await pg.app.iniciar();
  await pg.area.gravar({
    [chaveProgresso(CTX.host, CTX.login)]: { feitos: 2, total: 5, atual: "50300.000003/2026-03", quando: Date.now() },
  });
  await tique(40);
  const faixaP = () => pg.raiz.querySelector(".fav-progresso");
  checar("mostra o andamento da atualizacao", /2 de 5/.test(faixaP()?.textContent ?? ""), faixaP()?.textContent);
  botao(faixaP()!, "Cancelar")!.click();
  await tique(20);
  checar(
    "cancelar vai pelo storage (a aba que roda escuta)",
    (await pg.area.obter(chaveCancelar(CTX.host, CTX.login)))[chaveCancelar(CTX.host, CTX.login)] !== undefined,
  );
  await pg.area.gravar({ [chaveProgresso(CTX.host, CTX.login)]: { feitos: 5, total: 5, fim: true, quando: Date.now() } });
  await tique(40);
  checar("no fim a faixa some", !faixaP());

  secao("app: progresso do Atualizar pelo chrome.storage de verdade (formato do Chrome, areaChrome)");
  const chrome = instalarChromeStorage();
  try {
    const pc = montar({ area: chrome.local });
    await pc.app.iniciar();
    await chrome.local.gravar({
      [chaveProgresso(CTX.host, CTX.login)]: { feitos: 3, total: 5, atual: "50300.000003/2026-03", quando: Date.now() },
    });
    await tique(40);
    const faixaC = () => pc.raiz.querySelector(".fav-progresso");
    checar("o andamento gravado pela aba aparece no app", /3 de 5/.test(faixaC()?.textContent ?? ""), faixaC()?.textContent);
    await chrome.local.gravar({ [chaveProgresso(CTX.host, CTX.login)]: { feitos: 5, total: 5, fim: true, quando: Date.now() } });
    await tique(40);
    checar("e some no fim", !faixaC());
    pc.app.destruir();
  } finally {
    chrome.restaurar();
  }

  secao("app: documentos monitorados no item");
  const df = montar();
  await df.repos.unidade.adicionar({ id: "71", protocolo: "50300.000071/2026-71" });
  await df.repos.unidade.editar("71", { documentos: [{ id: "9", numero: "0104019", titulo: "Despacho 12", criadoEm: 1 }] });
  await df.app.iniciar();
  const docs = df.raiz.querySelector('li[data-id="71"] .fav-docs');
  checar(
    "lista os documentos do monitorado",
    !!docs && /0104019/.test(docs.textContent ?? "") && /Despacho 12/.test(docs.textContent ?? ""),
  );
  botao(docs!, "0104019 — Despacho 12")!.click();
  await tique(20);
  checar(
    "abrir o documento vai pela pesquisa rapida com o numero SEI",
    df.chamadas.some(
      ([op, a]) => op === "abrirProcesso" && (a as { protocolo: string }).protocolo === "0104019" && (a as { id: string }).id === "",
    ),
  );
  botao(docs!, "Tirar 0104019 dos documentos monitorados")!.click();
  await tique(60);
  checar("tirar o documento", !(await df.repos.unidade.obter("71"))?.documentos?.length);
}
