# Favoritos do SEI Pro

Lista pessoal de processos: uma por unidade do usuário e uma lista Pessoal, que
acompanha o usuário em qualquer unidade. Os dados ficam em `chrome.storage.local`
(uma chave por favorito). Spec: `docs/superpowers/specs/2026-10-01-favoritos-design.md`.

- `src/pagina/` content script (`dist/js/init_favoritos.js`, todos os frames,
  document_start): estrelas, balão e painel embutido no Controle de Processos.
- `src/app/` página `dist/html/favoritos.html`, aberta como iframe abaixo da lista.
- Cada monitorado tem, ao lado do número, os botões de abrir em outra aba (ponte `abrirProcesso`) e de copiar o número
  (componente comum `acoesDoNumero`).
- `src/modelo/`, `src/repositorio.ts`, `src/migracao/` sem DOM, cobertos por `tests/`.

    npm install && npm run tipos && npm run checar && npm run build
