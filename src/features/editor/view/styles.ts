// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function removeDataCkeSavedImg() {
    q(state.editorTitle).each(function(){
        var iframe = q(this).contents();
        if ( iframe.find('body').attr('contenteditable') == 'true' ) {
            iframe.find('img').removeAttr('data-cke-saved-src');
        }
    });
}
export function addStyleIframes(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){
        q('div[id*="cke_txaEditor_"] a.cke_button').each(function(){
            var title = q(this).attr('title');
                title = (typeof title !== 'undefined') ? title.replace(/["']/g, "") : '';
            if (typeof title !== 'undefined' && title != '') {
                q(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()').removeAttr('title');
            }
        });
        if ( q(state.editorTitle).eq(0).contents().find('head').find('style[data-style="seipro"]').length == 0 ) {
            q(state.editorTitle).each(function(){
                var iframe = q(this).contents();
                if ( iframe.find('head').find('style[data-style="seipro"]').length == 0 ) {
                    iframe.find('head').append(('<style type="text/css" data-style="seipro">\n'
                                                +(localStorage.getItem('darkModePro') ? '   * { color: #fbfbfe; }\n' : '')
                                                +'   span.checkboxSEI {cursor: pointer;}\n'
                                                +'   p .ancoraSei { background: #e4e4e4; }\n'
                                                +'   html.dark-mode body[contenteditable="false"],\n'
                                                +'   html.dark-mode p.Texto_Fundo_Cinza_Maiusculas_Negrito,\n'
                                                +'   html.dark-mode p.Texto_Fundo_Cinza_Negrito,\n'
                                                +'   html.dark-mode p .ancoraSei,\n'
                                                +'   html.dark-mode p.Item_Nivel1 {\n'
                                                +'       background-color: #e5e5e566 !important;\n'
                                                +'   }\n'
                                                +'   html.dark-mode .dark-mode-color-black,\n'
                                                +'   html.dark-mode .dark-mode-color-black * {\n'
                                                +'       color: #000 !important;\n'
                                                +'   }\n'
                                                +'   html.dark-mode .dark-mode-color-white,\n'
                                                +'   html.dark-mode .dark-mode-color-white * {\n'
                                                +'       color: #fff !important;\n'
                                                +'   }\n'
                                                +'   .dot-flashing,.dot-flashing::after,.dot-flashing::before{width:7px;height:7px;background-color:#4285f4;color:#4285f4}.dot-flashing{position:relative;border-radius:50%;animation:1s linear .5s infinite alternate dot-flashing}.dot-flashing::after,.dot-flashing::before{content:"";display:inline-block;position:absolute;top:0}.dot-flashing::before{left:-13px;border-radius:5px;animation:1s infinite alternate dot-flashing}.dot-flashing::after{left:13px;border-radius:50%;animation:1s 1s infinite alternate dot-flashing}@keyframes dot-flashing{0%{background-color:#4285f4}100%,50%{background-color:rgba(152,128,255,.2)}}\n'
                                                +'   p[contenteditable="false"] { background-color: #f3f3f3; position: relative; }\n'
                                                +'   p[contenteditable="false"]::after { content: "\\f023"; font-family: "Font Awesome 5 Pro"; right: 0; position: absolute; color: #747474; opacity: 0.5;}\n'
                                                +'   a.anchorRefInternaPro { cursor: pointer; }\n'
                                                +'   p .legis { background: #f1f1f1; }\n'
                                                +'   p .error { background-color: #ffd2d2; }\n'
                                                +'   p .alert { cursor: pointer; background: #fffbc9; border-left: 3px solid #ffe52a; padding-left: 4px; } '
                                                +'   span.tooltips { position: absolute; text-align: left; background: #fffbc9; text-indent: 0; border-left: 3px solid #ffe52a; margin: -46px 0px 0px -7px; width: 500px; font-size: 10pt; padding: 5px; color: #636363; height: 36px; }'
                                                +'   span.tooltips .ignoretext { background: #ecdc89; padding: 3px 5px; margin: 3px; font-size: 8pt; text-transform: uppercase; border-radius: 5px; float: right; }'
                                                +'   span.sigiloSEI { background-color: #ececec; border-bottom: 2px solid #d79d23; }\n'
                                                +'   span.sigiloSEI::before { content: "\\f023"; font-family: "Font Awesome 5 '+(state.isSeiSlim ? 'Pro' : 'Free')+'"; color: #d79d23; margin: 0 5px; font-size: 80%; font-weight: 600; }\n'
                                                +'   html.dark-mode .pageBreakPro, html.dark-mode .sessionBreakPro { background: #6f7071; height: 15px; }\n'
                                                +'   .pageBreakPro, .sessionBreakPro { background: #f1f1f1; height: 15px; }\n'
                                                +'   .pageBreakPro::before, .sessionBreakPro::before { border-bottom: 2px dashed #bfbfbf; display: block; content: \'\'; height: 7px; }\n'
                                                +'   .pageBreakPro::after, .sessionBreakPro::after { content: \'\u21B3 Quebra de p\u00E1gina\'; font-family: Calibri; text-align: center; display: block; margin-top: -10px; color: #585858; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; font-size: 10pt; font-style: italic; }\n'
                                                +'   .sessionBreakPro::after { content: \'\u21B3 Quebra de se\u00E7\u00E3o\' !important; }\n'
                                                +'   .linkDisplayPro, .reviewDisplayPro { max-width: 90% !important; user-select: none; position: absolute; display: inline-block; padding: 8px; box-shadow: 0 1px 3px 1px rgba(60,64,67,.35); background: #fff; border-color: #dadce0; border-radius: 8px; margin-top: 16px; text-align: left; text-indent: initial; font-size: 12pt; text-transform: initial; font-weight: initial; letter-spacing: initial; text-decoration: initial; white-space: nowrap; }\n'
                                                +'   .linkDisplayPro a, .reviewDisplayPro a { padding: 0 8px; cursor: pointer; text-decoration: underline; color:#1155cc; }\n'
                                                +'   .linkDisplayPro strong.title-linktip { width: calc(100% - 160px); display: inline-flex; overflow: hidden; }\n'
                                                +'   .linkDisplayPro ul { margin: 0;padding: 0;max-height: 207px;overflow-y: scroll; }\n'
                                                +'   .linkDisplayPro li { padding: 5px; cursor:pointer; }\n'
                                                +'   .linkDisplayPro li.highlighted, .linkDisplayPro li:hover { background-color: #3875d7; background-image: linear-gradient(#3875d7 20%, #2a62bc 90%); color: #ffffff; }\n'
                                                +'   html.dark-mode .linkDisplayPro, html.dark-mode .reviewDisplayPro { background-color:#3D3D3D !important; }\n'
                                                +'   html.dark-mode .linkDisplayPro a, html.dark-mode .reviewDisplayPro a { color:#fbfbfe !important; }\n'
                                                +'   span.reviewSeiPro[data-comment][data-review="delete"]:before { content: "\\f075";font-family: \'Font Awesome 5 '+(state.isSeiSlim ? 'Pro' : 'Free')+'\';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);}\n'
                                                +'   span.reviewSeiPro[data-comment][data-review="add"]:before { content: "\\f075";font-family: \'Font Awesome 5 '+(state.isSeiSlim ? 'Pro' : 'Free')+'\';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);}\n'
                                                +'   html.dark-mode .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEzLjY0MDMyODc0MzE5OTIzNCIgaGVpZ2h0PSIxNi4xMjAwMDAwMDAwMDAwMDUiIHZpZXdCb3g9IjMxNC42Njk2NzEyNTY4MDA3NyAzMTEuOTQgMTMuNjQwMzI4NzQzMTk5MjM0IDE2LjEyMDAwMDAwMDAwMDAwNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNC42LjA8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDYgMCAwIDAuMDYgMzI0LjU3IDMyMCkiIGlkPSJ3MGQwNHhBNjhSaG1qYldBZWQyTmgiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBldmVub2RkOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC0xNTEsIC0xMjYpIiBkPSJNIDE3MCAxNCBMIDIwMC4wMDc1MzcgMTQgQyAyMDIuNzY5MDU3IDE0IDIwNSAxMS43NjM2NDkzIDIwNSA5LjAwNDk3MDkyIEwgMjA1IDQuOTk1MDI5MDggQyAyMDUgMi4yMzM4MjIxMiAyMDIuNzY0Nzk4IDAgMjAwLjAwNzUzNyAwIEwgMTAxLjk5MjQ2MyAwIEMgOTkuMjMwOTQzMSAwIDk3IDIuMjM2MzUwNjkgOTcgNC45OTUwMjkwOCBMIDk3IDkuMDA0OTcwOTIgQyA5NyAxMS43NjYxNzc5IDk5LjIzNTIwMTcgMTQgMTAxLjk5MjQ2MyAxNCBMIDEzMyAxNCBMIDEzMyAyMzggTCAxMDEuOTkyNDYzIDIzOCBDIDk5LjIzMDk0MzEgMjM4IDk3IDI0MC4yMzYzNTEgOTcgMjQyLjk5NTAyOSBMIDk3IDI0Ny4wMDQ5NzEgQyA5NyAyNDkuNzY2MTc4IDk5LjIzNTIwMTcgMjUyIDEwMS45OTI0NjMgMjUyIEwgMjAwLjAwNzUzNyAyNTIgQyAyMDIuNzY5MDU3IDI1MiAyMDUgMjQ5Ljc2MzY0OSAyMDUgMjQ3LjAwNDk3MSBMIDIwNSAyNDIuOTk1MDI5IEMgMjA1IDI0MC4yMzM4MjIgMjAyLjc2NDc5OCAyMzggMjAwLjAwNzUzNyAyMzggTCAxNzAgMjM4IEwgMTcwIDE0IFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjA2IDAgMCAwLjA2IDMxOCAzMTkuNDgpIiBpZD0iNjlfbUZlWUc0MzlsTGM2X3FqUHlhIiAgPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigyNTUsMjU1LDI1NSk7IGZpbGwtcnVsZTogZXZlbm9kZDsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtNDcuNTcsIC0xMTcuNzgpIiBkPSJNIDY1IDIyMi4yODA4MjkgQyA2MC42MTMxMTc2IDIyMi4yODA4MjkgNTYuMzc0MjE2MiAyMjIuMjgwODI4IDUyLjk5OTk5OTUgMjIyLjI4MDgyOCBMIDUzIDE3MCBMIDQyIDE3MCBMIDQyIDIyMi41NjA1OTMgQyAzOC42MTMwMjQ2IDIyMi41NjA1OTMgMzQuMzc2MzMwOCAyMjIuNTYwNTkzIDMwLjAwMDAwMDUgMjIyLjU2MDU5NCBMIDMwIDE3MCBMIDE5IDE3MCBMIDE5IDIyMi41NjA1OTUgQyAxNi4zMjQ4NjUgMjIyLjU2MDU5NSAxMy44NDYzMzY5IDIyMi41NjA1OTUgMTEuNzYxMjcyNSAyMjIuNTYwNTk2IEMgLTAuMzY5NTg2NDM4IDIyMi41NjA1OTkgMS4yODM4MTc0NiAyMTEuNTA5MzEzIDEuMjgzODE3NDYgMjExLjUwOTMxMyBDIDEuMjgzODE3NDYgMjExLjUwOTMxMyAwLjM4OTY4OTk0NCAxNzcuNzU2IDAuMzk2NTcxMjc3IDE1OCBMIDk0Ljc0MDgyMzIgMTU4IEMgOTQuNzM5MjczNiAxNzcuNzkzMDg5IDkzLjg1MzUzOTYgMjExLjIyOTU0OCA5My44NTM1Mzk2IDIxMS4yMjk1NDggQyA5My44NTM1Mzk2IDIxMS4yMjk1NDggOTUuNTA2OTQzNSAyMjIuMjgwODM0IDgzLjM3NjA4NDUgMjIyLjI4MDgzMSBDIDgxLjI1NTM3ODIgMjIyLjI4MDgzIDc4LjcyNzY0MTUgMjIyLjI4MDgzIDc2LjAwMDAwMDIgMjIyLjI4MDgzIEwgNzYgMTcwIEwgNjUgMTcwIEwgNjUgMjIyLjI4MDgyOSBaIE0gMC41NzQ1MzQwMzYgMTQ3IEMgMC41Nzk3NjgzODcgMTQ2Ljg5NjE0OSAwLjU4NTEzMTYzOCAxNDYuNzk0NzU1IDAuNTkwNjI1NTE0IDE0Ni42OTU4NjYgQyAxLjI4MzgxNzQ4IDEzNC4yMTg0MDkgLTAuNzk3MTEyMjg2IDEyMi40MzQxNDYgMTYuODc5MjgxNiAxMTYuMTk1NDIyIEMgMzQuNTU1Njc1NSAxMDkuOTU2Njk4IDI4LjY2NjI1MzYgMTA3LjUzMDUyMiAzMC4zOTc4NzkyIDk1Ljc0NjI1NzYgQyAzMi4xMjk1MDQ4IDgzLjk2MTk5MyAyNS44OTIxMjk4IDc4LjA2OTg2MyAyNS44OTIxMzE1IDQ0Ljc5NjY0OTYgQyAyNS44OTIxMzMgMTcuOTYwNzIwNiAzOC41MTY5NDY3IDEzLjkyMjAxNzMgNDUuNTIyMDkzOSAxMy4zNjM3NjE3IEMgNDUuNjA4OTgxNCAxMy4xMzQwNzI3IDQ1LjcwMDI1MDYgMTMuMDE2NDM5MSA0NS43OTYwNjMxIDEzLjAxNjQzOTEgQyA0OS44MzcyMDU2IDEzLjAxNjQzODkgNjkuMjQ1MjIzNyAxMS4yNDM2NzEzIDY5LjI0NTIyNTUgNDQuNTE2ODg0NyBDIDY5LjI0NTIyNzMgNzcuNzkwMDk4MiA2My4wMDc4NTIzIDgzLjY4MjIyODEgNjQuNzM5NDc3OCA5NS40NjY0OTI4IEMgNjYuNDcxMTAzNCAxMDcuMjUwNzU3IDYwLjU4MTY4MTUgMTA5LjY3NjkzMyA3OC4yNTgwNzU0IDExNS45MTU2NTcgQyA5NS45MzQ0NjkzIDEyMi4xNTQzODEgOTMuODUzNTM5NSAxMzMuOTM4NjQ0IDk0LjU0NjczMTUgMTQ2LjQxNjEwMSBDIDk0LjU1NzA1ODYgMTQ2LjYwMTk4OSA5NC41NjY5MjQyIDE0Ni43OTY3MjQgOTQuNTc2MzM5NyAxNDcgTCAwLjU3NDUzNDAzNiAxNDcgWiBNIDQ3LjUgNDEgQyA1Mi4xOTQ0MjA0IDQxIDU2IDM3LjE5NDQyMDQgNTYgMzIuNSBDIDU2IDI3LjgwNTU3OTYgNTIuMTk0NDIwNCAyNCA0Ny41IDI0IEMgNDIuODA1NTc5NiAyNCAzOSAyNy44MDU1Nzk2IDM5IDMyLjUgQyAzOSAzNy4xOTQ0MjA0IDQyLjgwNTU3OTYgNDEgNDcuNSA0MSBaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+") 12 1, auto !important; } \n'
                                                +'   .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDIwNSAyNTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZXNjPjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDkuMDAwMDAwLCAtMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9ImN1cnNvciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3MCwxNCBMMjAwLjAwNzUzNywxNCBDMjAyLjc2OTA1NywxNCAyMDUsMTEuNzYzNjQ5MyAyMDUsOS4wMDQ5NzA5MiBMMjA1LDQuOTk1MDI5MDggQzIwNSwyLjIzMzgyMjEyIDIwMi43NjQ3OTgsMCAyMDAuMDA3NTM3LDAgTDEwMS45OTI0NjMsMCBDOTkuMjMwOTQzMSwwIDk3LDIuMjM2MzUwNjkgOTcsNC45OTUwMjkwOCBMOTcsOS4wMDQ5NzA5MiBDOTcsMTEuNzY2MTc3OSA5OS4yMzUyMDE3LDE0IDEwMS45OTI0NjMsMTQgTDEzMywxNCBMMTMzLDIzOCBMMTAxLjk5MjQ2MywyMzggQzk5LjIzMDk0MzEsMjM4IDk3LDI0MC4yMzYzNTEgOTcsMjQyLjk5NTAyOSBMOTcsMjQ3LjAwNDk3MSBDOTcsMjQ5Ljc2NjE3OCA5OS4yMzUyMDE3LDI1MiAxMDEuOTkyNDYzLDI1MiBMMjAwLjAwNzUzNywyNTIgQzIwMi43NjkwNTcsMjUyIDIwNSwyNDkuNzYzNjQ5IDIwNSwyNDcuMDA0OTcxIEwyMDUsMjQyLjk5NTAyOSBDMjA1LDI0MC4yMzM4MjIgMjAyLjc2NDc5OCwyMzggMjAwLjAwNzUzNywyMzggTDE3MCwyMzggTDE3MCwxNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NSwyMjIuMjgwODI5IEM2MC42MTMxMTc2LDIyMi4yODA4MjkgNTYuMzc0MjE2MiwyMjIuMjgwODI4IDUyLjk5OTk5OTUsMjIyLjI4MDgyOCBMNTMsMTcwIEw0MiwxNzAgTDQyLDIyMi41NjA1OTMgQzM4LjYxMzAyNDYsMjIyLjU2MDU5MyAzNC4zNzYzMzA4LDIyMi41NjA1OTMgMzAuMDAwMDAwNSwyMjIuNTYwNTk0IEwzMCwxNzAgTDE5LDE3MCBMMTksMjIyLjU2MDU5NSBDMTYuMzI0ODY1LDIyMi41NjA1OTUgMTMuODQ2MzM2OSwyMjIuNTYwNTk1IDExLjc2MTI3MjUsMjIyLjU2MDU5NiBDLTAuMzY5NTg2NDM4LDIyMi41NjA1OTkgMS4yODM4MTc0NiwyMTEuNTA5MzEzIDEuMjgzODE3NDYsMjExLjUwOTMxMyBDMS4yODM4MTc0NiwyMTEuNTA5MzEzIDAuMzg5Njg5OTQ0LDE3Ny43NTYgMC4zOTY1NzEyNzcsMTU4IEw5NC43NDA4MjMyLDE1OCBDOTQuNzM5MjczNiwxNzcuNzkzMDg5IDkzLjg1MzUzOTYsMjExLjIyOTU0OCA5My44NTM1Mzk2LDIxMS4yMjk1NDggQzkzLjg1MzUzOTYsMjExLjIyOTU0OCA5NS41MDY5NDM1LDIyMi4yODA4MzQgODMuMzc2MDg0NSwyMjIuMjgwODMxIEM4MS4yNTUzNzgyLDIyMi4yODA4MyA3OC43Mjc2NDE1LDIyMi4yODA4MyA3Ni4wMDAwMDAyLDIyMi4yODA4MyBMNzYsMTcwIEw2NSwxNzAgTDY1LDIyMi4yODA4MjkgWiBNMC41NzQ1MzQwMzYsMTQ3IEMwLjU3OTc2ODM4NywxNDYuODk2MTQ5IDAuNTg1MTMxNjM4LDE0Ni43OTQ3NTUgMC41OTA2MjU1MTQsMTQ2LjY5NTg2NiBDMS4yODM4MTc0OCwxMzQuMjE4NDA5IC0wLjc5NzExMjI4NiwxMjIuNDM0MTQ2IDE2Ljg3OTI4MTYsMTE2LjE5NTQyMiBDMzQuNTU1Njc1NSwxMDkuOTU2Njk4IDI4LjY2NjI1MzYsMTA3LjUzMDUyMiAzMC4zOTc4NzkyLDk1Ljc0NjI1NzYgQzMyLjEyOTUwNDgsODMuOTYxOTkzIDI1Ljg5MjEyOTgsNzguMDY5ODYzIDI1Ljg5MjEzMTUsNDQuNzk2NjQ5NiBDMjUuODkyMTMzLDE3Ljk2MDcyMDYgMzguNTE2OTQ2NywxMy45MjIwMTczIDQ1LjUyMjA5MzksMTMuMzYzNzYxNyBDNDUuNjA4OTgxNCwxMy4xMzQwNzI3IDQ1LjcwMDI1MDYsMTMuMDE2NDM5MSA0NS43OTYwNjMxLDEzLjAxNjQzOTEgQzQ5LjgzNzIwNTYsMTMuMDE2NDM4OSA2OS4yNDUyMjM3LDExLjI0MzY3MTMgNjkuMjQ1MjI1NSw0NC41MTY4ODQ3IEM2OS4yNDUyMjczLDc3Ljc5MDA5ODIgNjMuMDA3ODUyMyw4My42ODIyMjgxIDY0LjczOTQ3NzgsOTUuNDY2NDkyOCBDNjYuNDcxMTAzNCwxMDcuMjUwNzU3IDYwLjU4MTY4MTUsMTA5LjY3NjkzMyA3OC4yNTgwNzU0LDExNS45MTU2NTcgQzk1LjkzNDQ2OTMsMTIyLjE1NDM4MSA5My44NTM1Mzk1LDEzMy45Mzg2NDQgOTQuNTQ2NzMxNSwxNDYuNDE2MTAxIEM5NC41NTcwNTg2LDE0Ni42MDE5ODkgOTQuNTY2OTI0MiwxNDYuNzk2NzI0IDk0LjU3NjMzOTcsMTQ3IEwwLjU3NDUzNDAzNiwxNDcgWiBNNDcuNSw0MSBDNTIuMTk0NDIwNCw0MSA1NiwzNy4xOTQ0MjA0IDU2LDMyLjUgQzU2LDI3LjgwNTU3OTYgNTIuMTk0NDIwNCwyNCA0Ny41LDI0IEM0Mi44MDU1Nzk2LDI0IDM5LDI3LjgwNTU3OTYgMzksMzIuNSBDMzksMzcuMTk0NDIwNCA0Mi44MDU1Nzk2LDQxIDQ3LjUsNDEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=") 12 1, auto !important; } \n'
                                                +'</style>\n').replace(/[ \t]+\n/g, '\n'));
                    if (localStorage.getItem('darkModePro')) iframe.find('html').addClass('dark-mode');
                    api.repareBgTableColor(iframe);
                    api.repairBugChrome116(iframe);
                    api.setActionCheckbox(iframe);
                }
                api.setOnBodyActs(iframe);
            });
            api.setCKEDITOR_instances();
            q('head').append("<style type='text/css' data-style='seipro'> "
                            +"  .seipro-editor-align-menu { display:none; background-image: -webkit-linear-gradient(top,#fff,#e4e4e4); position: absolute; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .seipro-editor-quick-table { display:none; position: absolute; background: #f1f1f1; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .seipro-editor-quick-table td { height: 15px; width: 15px; border: 1px solid #ccc; background: #fff; }"
                            +"  .seipro-editor-quick-table .seipro-editor-quick-table-info { text-align: center; padding: 5px; color: #777; }"
                            +"  .seipro-editor-quick-table .seipro-editor-quick-table-hover { background: #72bae2; }"
                            +"</style>");

        } else {
            api.addStyleIframes(TimeOut - 100);
            console.log('addStyleIframes Reload => '+TimeOut);
        }
    }, 500);
}
export function setActionCheckbox(iframe) {
    iframe.find('.checkboxSEI').on('click',function(){
        if (!delayCrash) {
            delayCrash = true;
            setTimeout(function(){ delayCrash = false }, 300);
            state.oEditor.fire('saveSnapshot');
            if (q(this).hasClass('checked')) {
                q(this).html('&#9744;').removeClass('checked');
            } else {
                q(this).html('&#9745;').addClass('checked');
            }
            state.oEditor.fire('saveSnapshot');
            console.log('click',delayCrash);
        }
    });
}
export function getInsertCheckboxButtom() {
    state.oEditor.focus();
    state.oEditor.fire('saveSnapshot');
    state.oEditor.insertHtml('<span class="ancoraSei checkboxSEI" data-id="'+randomString(16)+'" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>');
    state.oEditor.fire('saveSnapshot');
}
export function repairBugChrome116(iframe) {
    if (!!window.chrome) {
        iframe.find('p').each(function(){
            var className = q(this).attr('class');
            if (typeof className !== 'undefined') {
                q(this).attr('class','_'+className);
                q(this).attr('class',className);
            }
        });
    }
}
export function setOnBodyActs(iframe) {
    iframe.find('body').on('mousedown', function(e) {
        if ( typeof e.target.href !== 'undefined' && e.target.href.indexOf('http')  !== -1 && checkConfigValue('editarlinks')) {
            api.showLinkTips(e.target, iframe);
        } else if (q(e.target).closest('span').hasClass('reviewSeiPro') && checkConfigValue('revisaotexto')) {
            api.showReviewTips(e.target, iframe);
        } else {
            api.hideLinkTips(iframe);
            api.hideReviewTips(iframe);
        }
        api.removeDataCkeSavedImg();
        api.hideQuickTable();
        api.setActionCheckbox(iframe);
        setTimeout(() => {
            api.setOnKeyEditor();
        }, 1000);
    }).on('mouseup', function(e) {
        api.initCKEDITOR_SEIPRO(e);
    }).on('blur', function(e) {
        api.hideLinkTips(iframe);
        api.hideReviewTips(iframe);
        api.hideQuickTable();
        api.removeCopyStyle();
        api.closeAlignText();
    });
}
export function initCKEDITOR_SEIPRO(e, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof oEditor !== 'undefined') {
        api.applyCopyStyle();
        api.activeIconsSelectedText();
        api.closeAlignText();
    } else {
        if (TimeOut == 9000) {
            var force = CKEDITOR.instances[q(e.currentTarget).attr('data-editor')];
            api.setCKEDITOR_instances(force || false);
        }
        setTimeout(function(){
            api.initCKEDITOR_SEIPRO(e, TimeOut - 100);
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initCKEDITOR_SEIPRO');
        }, 500);
    }
}
export function setDarkModeCkePanel() {
    var iframeCkePanel = q('iframe.cke_panel_frame').contents();
    if (localStorage.getItem('darkModePro') && iframeCkePanel.find('style[data-style="seipro"]').length == 0) {
    iframeCkePanel.find('head').append('<style type="text/css" data-style="seipro">\n'+
        '  body { background-color: #202123 !important; }\n'+
        '  .cke_panel_block * { background: #202123; border: none !important; color: #fff; box-shadow: none !important; text-shadow: none !important;}\n'+
        '  .cke_panel_block a[onclick*="Fundo"] p { background-color: #6f7071; }\n'+
        '  .cke_panel_block a:hover, .cke_panel_block a:hover p { background-color: #017fff !important; }\n'+
        '  .cke_panel_block .cke_selected *  { background: transparent; color: #202123 !important; }\n'+
        '</style>');
    }
}
api.removeDataCkeSavedImg = removeDataCkeSavedImg;
api.addStyleIframes = addStyleIframes;
api.setActionCheckbox = setActionCheckbox;
api.getInsertCheckboxButtom = getInsertCheckboxButtom;
api.repairBugChrome116 = repairBugChrome116;
api.setOnBodyActs = setOnBodyActs;
api.initCKEDITOR_SEIPRO = initCKEDITOR_SEIPRO;
api.setDarkModeCkePanel = setDarkModeCkePanel;
