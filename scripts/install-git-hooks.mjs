#!/usr/bin/env node
/**
 * Instala os hooks de `scripts/hooks/` em `.git/hooks/`.
 *
 * O git não versiona `.git/hooks/`, então hook precisa de instalação explícita — é por isso
 * que ele não pode ser a única barreira (a de verdade é o CI). Aqui ele existe para recusar
 * o commit antes de PII entrar no histórico, onde remover custa reescrever história.
 */
import { chmodSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origem = path.join(root, 'scripts/hooks');
const destino = path.join(root, '.git/hooks');

if (!existsSync(destino)) {
    console.error('erro: .git/hooks não existe — este diretório é um repositório git?');
    process.exit(1);
}

for (const nome of readdirSync(origem)) {
    const alvo = path.join(destino, nome);
    copyFileSync(path.join(origem, nome), alvo);
    chmodSync(alvo, 0o755);
    console.log(`instalado: .git/hooks/${nome}`);
}

console.log('Reinstale após alterar scripts/hooks/ — são cópias, não links.');
