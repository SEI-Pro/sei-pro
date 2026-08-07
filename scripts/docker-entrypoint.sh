#!/bin/sh
# Instala dependências no volume do container quando necessário e executa o comando pedido.
#
# O node_modules vive num volume nomeado (não no bind mount do host), porque esbuild e jsdom
# trazem binários por plataforma e o host pode ser macOS/arm64. Consequência: na primeira
# execução o volume está vazio e precisa ser populado aqui — não há como fazê-lo no build da
# imagem, já que package.json só chega com o bind mount.
set -eu

STAMP=/app/node_modules/.docker-install-stamp

needs_install() {
    [ ! -d /app/node_modules/.bin ] && return 0
    [ ! -f "$STAMP" ] && return 0
    # package-lock.json mais recente que a instalação: dependência mudou desde então.
    [ /app/package-lock.json -nt "$STAMP" ] && return 0
    return 1
}

if needs_install; then
    echo "entrypoint: instalando dependências (npm ci)..." >&2
    # `npm ci` respeita o lockfile exatamente — é o que torna o ambiente reproduzível.
    npm ci --no-progress
    date -u +%Y-%m-%dT%H:%M:%SZ > "$STAMP"
fi

exec "$@"
