/**
 * CSS mínimo das estrelas, injetado uma vez por documento. As classes têm o
 * prefixo `spro-fav-` para não colidir com o SEI nem com o legado. Uma folha
 * nova em dist/css exigiria mexer nos manifests de todos os pacotes.
 */
const ID = "spro-fav-estilo";
const CSS = `.spro-fav-estrela{background:none;border:0;padding:0 3px;margin:0 2px;cursor:pointer;color:#8a8a8a;vertical-align:middle;line-height:0}
.spro-fav-estrela:hover{color:#5f5f5f}
.spro-fav-estrela[aria-pressed="true"]{color:#e0a100}
.spro-fav-estrela[data-erro]{color:#c62828}
.spro-fav-estrela[aria-busy="true"]{opacity:.5}
.spro-fav-estrela:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.spro-fav-abrir{background:none;border:0;padding:0 3px;margin:0 2px;cursor:pointer;color:#8a8a8a;vertical-align:middle;line-height:0}
.spro-fav-abrir:hover{color:#5f5f5f}
.spro-fav-abrir:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.spro-fav-doc{background:none;border:0;padding:2px;margin:0;border-radius:5px;cursor:pointer;color:#a0a0a0;vertical-align:text-top;margin-top:-10px;line-height:0}
.seiSlim.seiSlim_arvore .spro-fav-doc{margin-top:0;vertical-align:middle;position:relative;top:-1.6px}
.spro-fav-doc[aria-pressed="true"]{color:#e0a100}
.spro-fav-doc:hover{color:#fff;background:#017fff}
.spro-fav-doc[aria-busy="true"]{opacity:.5}
.spro-fav-doc:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.seiSlim.dark-mode .spro-fav-estrela,.seiSlim.dark-mode .spro-fav-abrir{color:#9aa0a8}
.seiSlim.dark-mode .spro-fav-estrela:hover,.seiSlim.dark-mode .spro-fav-abrir:hover{color:#d0d3d8}
.seiSlim.dark-mode .spro-fav-estrela[aria-pressed="true"],.seiSlim.dark-mode .spro-fav-doc[aria-pressed="true"]{color:#f0b429}
.seiSlim.dark-mode .spro-fav-estrela[data-erro]{color:#ef5350}
.seiSlim.dark-mode .spro-fav-doc:not([aria-pressed="true"]):not(:hover){color:#9aa0a8}
.seiSlim.dark-mode .spro-fav-estrela svg,.seiSlim.dark-mode .spro-fav-estrela svg *,.seiSlim.dark-mode .spro-fav-abrir svg,.seiSlim.dark-mode .spro-fav-abrir svg *,.seiSlim.dark-mode .spro-fav-doc svg,.seiSlim.dark-mode .spro-fav-doc svg *{color:inherit}
.spro-fav-icone{display:inline-block;width:28px;height:24px;padding:0;margin:0;line-height:0;vertical-align:baseline}
.spro-fav-icone svg{display:block;width:20px;height:20px;margin:2px auto}
#topmenu .spro-fav-estrela,#topmenu .spro-fav-abrir{display:inline-block;width:27px;height:24px;padding:0;margin:0;line-height:0;vertical-align:baseline}
#topmenu .spro-fav-estrela svg,#topmenu .spro-fav-abrir svg{display:block;width:20px;height:20px;margin:2px auto}
.spro-fav-botao{position:relative}
.spro-fav-contador{position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#d93025;color:#fff;font:600 10px/16px sans-serif;text-align:center;box-sizing:border-box}
.spro-fav-titulo{display:flex!important;align-items:center;gap:8px}
.spro-fav-recolher{margin-left:4px;background:none;border:0;cursor:pointer;color:inherit;line-height:0;padding:2px;border-radius:4px}
.spro-fav-recolher:hover{background:rgb(127 127 127 / 14%)}
.spro-fav-recolher:focus-visible{outline:2px solid #1a73e8;outline-offset:1px}
@keyframes spro-fav-aviso{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.spro-fav-aviso{animation:none!important}}`;

export function instalarEstilo(doc: Document): void {
  if (doc.getElementById(ID)) return;
  const s = doc.createElement("style");
  s.id = ID;
  s.textContent = CSS;
  (doc.head ?? doc.documentElement).append(s);
}
