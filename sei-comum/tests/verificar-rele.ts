import { parDePortas } from "../src/ponte/parDePortas";
import { ligarRele, type PortaRele } from "../src/ponte/rele";
import type { PortaRpc } from "../src/ponte/rpc";
import { checar, secao, tique } from "./util";

const EXT = "moz-extension://abc/";
type Lado = "aba" | "app";

/** Liga uma porta "do remetente" ao relé e devolve a ponta do remetente (a que ele usa). */
function fabrica() {
  let ouvinte: ((p: PortaRele) => void) | null = null;
  ligarRele({
    ouvirConexoes: (cb) => {
      ouvinte = cb;
    },
    ehDaExtensao: (url) => url.startsWith(EXT),
    canais: new Set(["seipro-teste", "seipro-outro"]),
  });
  return (
    lado: Lado,
    aba: number | undefined,
    nome = "seipro-teste",
    frameId: number | null = lado === "aba" ? 0 : 7, // null = sem frameId (undefined aplicaria o padrao)
  ): { porta: PortaRpc; caiu: () => boolean } => {
    const [remetente, noRele] = parDePortas();
    let caiu = false;
    remetente.onDisconnect.addListener(() => {
      caiu = true;
    });
    const url = lado === "app" ? `${EXT}html/teste.html` : "https://sei.exemplo.gov.br/sei/controlador.php";
    ouvinte?.({
      ...noRele,
      name: nome,
      sender: { ...(aba === undefined ? {} : { tab: { id: aba } }), ...(frameId === null ? {} : { frameId }), url },
    });
    return { porta: remetente, caiu: () => caiu };
  };
}

function recebidas(p: PortaRpc): unknown[] {
  const r: unknown[] = [];
  p.onMessage.addListener((m) => r.push(m));
  return r;
}

export async function verificarRele(): Promise<void> {
  secao("rele do Firefox: liga a aba ao app (iframe da mesma aba)");
  let conectar = fabrica();
  const aba = conectar("aba", 1);
  const doAba = recebidas(aba.porta);
  aba.porta.postMessage("cedo-da-aba");
  await tique();
  const app = conectar("app", 1);
  const doApp = recebidas(app.porta);
  await tique();
  checar("mensagem da aba antes do app chega quando o app conecta", doApp.join() === "cedo-da-aba", doApp);
  app.porta.postMessage("do-app");
  await tique();
  checar("o app fala com a aba", doAba.join() === "do-app", doAba);

  conectar = fabrica();
  const app2 = conectar("app", 2);
  app2.porta.postMessage("cedo-do-app");
  const doApp2 = recebidas(app2.porta);
  await tique();
  const aba2 = conectar("aba", 2);
  const doAba2 = recebidas(aba2.porta);
  await tique();
  checar("app antes da aba: a mensagem guardada chega a aba", doAba2.join() === "cedo-do-app", doAba2);
  aba2.porta.postMessage("resposta");
  await tique();
  checar("e a aba responde ao app", doApp2.join() === "resposta", doApp2);

  secao("rele do Firefox: so liga o que e da mesma aba e do frame de topo");
  conectar = fabrica();
  const abaA = conectar("aba", 3);
  const appB = conectar("app", 4);
  const doAppB = recebidas(appB.porta);
  abaA.porta.postMessage("x");
  await tique();
  checar("abas diferentes nao se ligam", doAppB.length === 0);
  const frameInterno = conectar("aba", 5, "seipro-teste", 2);
  await tique();
  checar("porta de frame interno da aba e recusada", frameInterno.caiu());
  const velha = conectar("aba", 6);
  const nova = conectar("aba", 6);
  await tique();
  checar("porta nova do mesmo lado substitui a antiga (a antiga cai)", velha.caiu() && !nova.caiu());
  const fora = conectar("aba", 6, "seipro-outro-canal");
  await tique();
  checar("canal fora da lista e ignorado (nem liga, nem derruba)", !fora.caiu());

  secao("rele do Firefox: a queda de uma ponta derruba a outra");
  conectar = fabrica();
  const aba7 = conectar("aba", 7);
  const app7 = conectar("app", 7);
  await tique();
  app7.porta.disconnect();
  await tique();
  await tique();
  checar("app caiu: a aba cai junto", aba7.caiu());
  const aba8 = conectar("aba", 8);
  const app8 = conectar("app", 8);
  await tique();
  aba8.porta.disconnect();
  await tique();
  await tique();
  checar("aba caiu: o app cai junto", app8.caiu());
  const sozinha = conectar("aba", 9);
  sozinha.porta.disconnect();
  await tique();
  const depois = conectar("app", 9);
  const doDepois = recebidas(depois.porta);
  await tique();
  const abaNova = conectar("aba", 9);
  abaNova.porta.postMessage("da-aba-nova");
  await tique();
  checar(
    "ponta que caiu antes de ligar nao fica esperando: o app liga com a aba nova",
    doDepois.join() === "da-aba-nova" && !depois.caiu(),
    doDepois,
  );

  secao("rele do Firefox: casos de borda (revisao)");
  conectar = fabrica();
  const semTab = conectar("aba", undefined);
  const semFrame = conectar("aba", 10, "seipro-teste", null);
  await tique();
  checar("porta sem aba e recusada", semTab.caiu());
  checar("porta da aba sem frameId e recusada (como no Chrome: frameId === 0)", semFrame.caiu());
  const abaC1 = conectar("aba", 11, "seipro-teste");
  const abaC2 = conectar("aba", 11, "seipro-outro");
  const appC2 = conectar("app", 11, "seipro-outro");
  const appC1 = conectar("app", 11, "seipro-teste");
  const doAppC1 = recebidas(appC1.porta);
  const doAppC2 = recebidas(appC2.porta);
  abaC1.porta.postMessage("c1");
  abaC2.porta.postMessage("c2");
  await tique();
  checar("dois canais na mesma aba nao se misturam", doAppC1.join() === "c1" && doAppC2.join() === "c2", [doAppC1, doAppC2]);
  const appVelho = conectar("app", 12);
  const abaP = conectar("aba", 12);
  await tique();
  const appRecarregado = conectar("app", 12);
  const doRecarregado = recebidas(appRecarregado.porta);
  abaP.porta.postMessage("depois-da-recarga");
  await tique();
  appVelho.porta.disconnect();
  await tique();
  await tique();
  checar(
    "app recarregado com o antigo ainda pareado: a aba segue com o antigo ate ele cair",
    doRecarregado.length === 0 && abaP.caiu(),
    doRecarregado,
  );
}

/** A lista do relé tem de cobrir todo canal de app em iframe declarado nos módulos (os `*-lateral` são da sidebar). */
export async function verificarCanaisDoRele(): Promise<void> {
  secao("rele do Firefox: a lista de canais cobre os modulos");
  const { readdirSync, readFileSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { CANAIS_IFRAME } = await import("../src/ponte/rele");
  const raiz = join(import.meta.dirname, "..", "..");
  const achados = new Set<string>();
  const varrer = (dir: string): void => {
    for (const n of readdirSync(dir)) {
      if (n === "node_modules" || n === "tests") continue;
      const p = join(dir, n);
      if (statSync(p).isDirectory()) varrer(p);
      else if (p.endsWith(".ts"))
        for (const m of readFileSync(p, "utf8").matchAll(/export const CANAL_[A-Z_]+ = "([^"]+)"/g))
          if (!m[1]!.endsWith("-lateral")) achados.add(m[1]!);
    }
  };
  for (const proj of readdirSync(raiz)) {
    const src = join(raiz, proj, "src");
    try {
      if (statSync(src).isDirectory()) varrer(src);
    } catch {
      /* sem src */
    }
  }
  const faltam = [...achados].filter((c) => !CANAIS_IFRAME.includes(c));
  checar("todo canal de app em iframe esta na lista do rele", achados.size > 0 && faltam.length === 0, faltam);
  const sobram = CANAIS_IFRAME.filter((c) => !achados.has(c));
  checar("a lista do rele nao tem canal que nao existe mais nos modulos", sobram.length === 0, sobram);
}
