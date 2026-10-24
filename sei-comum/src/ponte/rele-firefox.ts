/**
 * Background do pacote do FIREFOX (manifest MV2, `background.scripts`): o relé entre a aba do SEI e os apps
 * da extensão em iframe da mesma aba. No Chrome não entra -- lá o `runtime.connect` do content script chega
 * direto ao iframe. Ver `rele.ts`.
 */
import { CANAIS_IFRAME, ligarRele, type PortaRele } from "./rele";

const base = chrome.runtime.getURL("");
ligarRele({
  ouvirConexoes: (cb) => chrome.runtime.onConnect.addListener((p) => cb(p as unknown as PortaRele)),
  ehDaExtensao: (url) => url.startsWith(base),
  canais: new Set(CANAIS_IFRAME),
});
