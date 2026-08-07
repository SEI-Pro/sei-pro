# Third-Party Notices

**Arquivo gerado.** Não editar à mão — rode `node scripts/write-third-party-notices.mjs`.
A fonte é `vendor/<lib>/VERSION.txt`; o que cada lib entrega vem de
`scripts/asset-manifest.mjs`.

O SEI Pro PRF é distribuído sob [AGPL-3.0](./LICENSE.txt) e embarca as bibliotecas
de terceiros abaixo, em `vendor/`, copiadas para `dist/` no build.

Total: **26** bibliotecas.

> Versão ou licença marcada como `desconhecida` significa que o arquivo foi resgatado de
> `dist/` sem registro de origem (ver [ADR-0011](./docs/adr/0011-dist-fora-do-versionamento.md)).
> Confirme antes de atualizar a biblioteca — não presuma.

| Biblioteca | Licença | Observações | Entregue como |
|---|---|---|---|
| Chart.js 4.4.7 | MIT | — | `js/lib/chart.min.js`<br>`css/chart.min.css` |
| Chosen 1.8.2 | MIT | — | `js/lib/chosen.jquery.min.js`<br>`css/chosen.min.css` |
| CKEditor 4 desconhecida | GPL / LGPL / MPL (verificar) | — | `js/lib/ckeditor/ckeditor.js`<br>`js/lib/ckeditor/tableselection.js`<br>`js/lib/ckeditor/tableselection.css`<br>`css/tableselection.css` |
| CryptoJS desconhecida | MIT | — | `js/lib/crypto-js.min.js` |
| diff2html desconhecida | MIT | — | `js/lib/diff2html.min.js` |
| DOMPurify 3.2.5 | Apache-2.0 / MPL-2.0 | — | `js/lib/purify.min.js` |
| Favico.js 0.3.10 | MIT | — | `js/lib/favico-0.3.10.min.js` |
| Font Awesome Pro (subset) desconhecida | Font Awesome Pro (licença comercial) | subset (só o que é usado) | `css/fontawesome.pro.min.css`<br>`webfonts/pro/` |
| frappe-gantt 1.2.2 | MIT | — | `js/lib/frappe-gantt.js`<br>`css/frappe-gantt.css` |
| jKanban desconhecida | MIT | — | `js/lib/jkanban.min.js`<br>`css/jkanban.min.css` |
| JMESPath desconhecida | Apache-2.0 | — | `js/lib/jmespath.min.js` |
| jQuery 3.7.1 | MIT | — | `js/lib/jquery-3.7.1.min.js` |
| jQuery Masked Input desconhecida | MIT | — | `js/lib/jquery.maskedinput.min.js` |
| jQuery Table Edit desconhecida | desconhecida | — | `js/lib/jquery-table-edit.min.js` |
| TableSorter (fork de Rob Garrison) 2.31.3 | MIT | — | `js/lib/jquery.tablesorter.combined.min.js` |
| jQuery Tags Input (revisited) desconhecida | MIT | — | `js/lib/jquery.tagsinput-revisited.js` |
| jQuery Toolbar desconhecida | MIT | — | `js/lib/jquery.toolbar.min.js`<br>`css/jquery.toolbar.css` |
| jQuery UI 1.14.1 | MIT | — | `js/lib/jquery-ui.min.js`<br>`css/jquery-ui.css`<br>`css/images/ui-icons_444444_256x240.png`<br>`css/images/ui-icons_555555_256x240.png`<br>`css/images/ui-icons_777620_256x240.png`<br>`css/images/ui-icons_777777_256x240.png`<br>`css/images/ui-icons_cc0000_256x240.png`<br>`css/images/ui-icons_ffffff_256x240.png` |
| jQuery Visible desconhecida | MIT | — | `js/lib/jquery-visible.min.js` |
| jschardet desconhecida | LGPL | — | `js/lib/jschardet.min.js` |
| JSZip 3.10.1 | MIT / GPLv3 | — | `js/lib/jszip.min.js`<br>`js/lib/jszip-utils.min.js` |
| Mammoth.js (browser) desconhecida | BSD-2-Clause | — | `js/lib/mammoth.browser.min.js` |
| modalLink 1.1.0 | desconhecida | **patch local** — reaplicar ao atualizar | `js/lib/modalLink.js` |
| Moment.js 2.30.1 | MIT | — | `js/lib/moment.min.js`<br>`js/lib/moment-duration-format.min.js`<br>`js/lib/moment-weekday-calc.js` |
| Papa Parse 5.5.2 | MIT | — | `js/lib/papaparse.js` |
| qrcode.js desconhecida | MIT | — | `js/lib/qrcode.min.js` |

## Fontes de dados públicos

A extensão consulta serviços do SEI da instituição e, quando o usuário configura
perfis BYOK, provedores de IA de terceiros (OpenAI, Anthropic, Google, Moonshot,
Ollama ou endpoint compatível). Chaves são armazenadas localmente e não são
sincronizadas. Ver [Política de Privacidade](./PRIVACY_POLICY.md).
