# Histórico do SEI Pro

Histórico de processos visitados: registra cada processo aberto, por SEI e login
(`host|login`), em `chrome.storage.local` (uma chave por visita). Preferências em
`historico/preferencias`. Sigiloso nunca guarda especificação, interessados nem assuntos.

- `src/modelo/` tipos, constantes, regras e dias de calendário, sem DOM;
- `src/pagina/` content script (captura da visita, modal sobre o SEI, migração do histórico antigo);
- `src/app/` a lista, igual no modal e na aba da barra lateral. Na lateral, a chave de roteamento
  da ponte é `host|login`; ao trocar de unidade, o painel relê o contexto e remonta, para os
  Favoritos (estrela, filtro, "Favoritar") irem para a lista da unidade certa.

Cada linha tem, ao lado do número, os botões de abrir em outra aba (mesma ponte `abrirProcesso`, com `novaAba`; não fecha o
modal) e de copiar o número, do componente comum `acoesDoNumero`.

Provas em `tests/` (tsx + linkedom). Os bundles saem em `dist/js` pelo `build.mjs`.

    npm install && npm run tipos && npm run checar && npm run build
