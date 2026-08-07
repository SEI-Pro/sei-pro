# Ambiente de build e verificação — dispensa Node instalado no sistema operacional.
#
#   docker compose run --rm build     # gera dist/ no host
#   docker compose run --rm verify    # typecheck + build + testes + auditoria
#   docker compose run --rm dev       # shell, ou build em watch
#
# O código NÃO é copiado para a imagem: o repositório entra por bind mount em tempo de
# execução (ver compose.yaml), para que dist/ apareça direto no host e possa ser carregado
# em chrome://extensions sem passo de cópia.
#
# Versão exata, não uma faixa: o ADR-0011 exige dist/ reproduzível, e "node:22" flutuaria
# entre máquinas. Ao subir esta versão, suba .nvmrc e "engines" em package.json junto.
FROM node:22.23.1-bookworm-slim

# git é dependência de teste, não conveniência: as fitness functions de ADR-0011
# (tests/structure/no-dist-in-git.test.js) executam `git ls-files` e `git check-ignore`.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# O node_modules do host é inutilizável aqui: esbuild e jsdom trazem binários por
# plataforma, e o host pode ser darwin-arm64. O compose monta um volume nomeado neste
# caminho; criar o diretório com o dono correto ANTES garante que o volume herde a posse e
# que o usuário sem privilégio consiga instalar.
RUN mkdir -p /app/node_modules && chown -R node:node /app

# O bind mount traz o .git do host com outro dono; sem isto o git recusa operar no
# diretório e os testes de estrutura falham com "dubious ownership".
RUN git config --system --add safe.directory /app

COPY --chown=node:node scripts/docker-entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Não rodar como root: senão dist/ e node_modules saem com dono root no host Linux.
USER node

ENV npm_config_update_notifier=false \
    npm_config_fund=false \
    npm_config_audit=false

ENTRYPOINT ["entrypoint"]
CMD ["npm", "run", "build"]
