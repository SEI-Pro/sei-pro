#!/usr/bin/env python3
"""Gera as capas Open Graph (1200x630) do site: img/og/home.png e img/og/<SLUG>.png.

Usa os mesmos dados do site: o catalogo do README.md (nome e categoria), o mapa
_data/icones.yml, o sprite _includes/icones.svg e o titulo/primeiro paragrafo de
cada pages/<SLUG>.md. Renderiza _og/modelo.html no Chrome headless.

Uso (na raiz do repositorio):
    python3 _og/gerar_capas.py            # todas as capas
    python3 _og/gerar_capas.py PRAZOS     # so as indicadas (e a home, se pedir "home")

Rode de novo ao criar uma funcionalidade, trocar um icone ou mudar o titulo de
uma pagina, e faca commit das imagens de img/og/. Paginas sem capa usam a da home.
"""
import html
import os
import re
import subprocess
import sys
import tempfile

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'img', 'og')
CHROME = os.environ.get('CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
LOGO = 'file://' + os.path.join(RAIZ, 'dist', 'icons', 'icon-256.png')
# Paginas cujo primeiro paragrafo nao serve de resumo
LEADS_FIXOS = {
    'HISTORICO': 'Tudo o que mudou em cada versão da extensão, da mais recente à mais antiga.',
    'AGENTEIA': 'Pergunte em português: ele consulta processos e documentos, escreve e altera o SEI — e só age depois que você aprova.',
}
LEAD_PADRAO = 'Passo a passo no guia do SEI Pro, a extensão gratuita com funções avançadas para o SEI.'
ICONES_HOME = ['bot', 'alarm-clock', 'kanban', 'list-checks', 'file-cog', 'file-pen-line', 'at-sign', 'spro-tarja', 'fingerprint']


def ler(caminho):
    with open(os.path.join(RAIZ, caminho), encoding='utf-8') as f:
        return f.read()


def rotulo_categoria(cat):
    """Mesmos rotulos curtos do catalogo da home."""
    return (cat.replace('Tela ', '')
               .replace('Editor de documentos:', 'Editor:')
               .replace(', menu e navegação', ' e navegação')
               .replace('revisão, sigilo e produtividade', 'revisão e produtividade'))


def catalogo():
    """slug -> categoria, com as mesmas regras de leitura do index.html."""
    readme = ler('README.md')
    secao = readme.split('## Funcionalidades disponíveis')[-1].split('## Encontrou um erro')[0]
    cats = {}
    total = 0
    for bloco in secao.split('### ')[1:]:
        linhas = bloco.split('\n')
        cat = rotulo_categoria(linhas[0].strip())
        for linha in linhas[1:]:
            m = re.match(r'- !\[.*?\]\(.*?\) \[.+?\]\(\./pages/(\w+)\.md\)', linha)
            if m:
                cats[m.group(1)] = cat
                total += 1
    return cats, total


def mapa_icones():
    mapa = {}
    for linha in ler('_data/icones.yml').split('\n'):
        m = re.match(r'^(\w+):\s*([\w-]+)\s*$', linha)
        if m:
            mapa[m.group(1)] = m.group(2)
    return mapa


def simbolos():
    sprite = ler('_includes/icones.svg')
    return {m.group(1): m.group(2) for m in re.finditer(r'<symbol id="i-([^"]+)" viewBox="0 0 24 24">(.*?)</symbol>', sprite, re.S)}


def svg(simb, nome):
    return '<svg class="ico" viewBox="0 0 24 24">%s</svg>' % simb.get(nome, simb['file-text'])


def limpar_markdown(texto):
    texto = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', texto)
    texto = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', texto)
    texto = re.sub(r'[*_`]', '', texto)
    return re.sub(r'\s+', ' ', texto).strip()


def resumir(texto, limite=150):
    if len(texto) <= limite:
        return texto
    corte = texto[:limite].rsplit(' ', 1)[0].rstrip(',;:—-')
    return corte + '…'


def dados_pagina(slug):
    md = ler('pages/%s.md' % slug).split('\n')
    titulo, lead = slug, ''
    for i, linha in enumerate(md):
        if linha.startswith('## '):
            titulo = limpar_markdown(linha[3:])
            for seguinte in md[i + 1:]:
                s = seguinte.strip()
                if s and not s.startswith(('>', '#', '|', '!', '<')):
                    lead = limpar_markdown(s.lstrip('*- '))
                    break
            break
    lead = LEADS_FIXOS.get(slug, lead)
    if len(lead) < 40 or re.match(r'^[\d/]+$', lead):
        lead = LEAD_PADRAO
    return titulo, resumir(lead)


def tamanho_titulo(titulo):
    n = len(titulo)
    return 80 if n <= 20 else 70 if n <= 32 else 60 if n <= 48 else 52 if n <= 64 else 46


def renderizar(html_pagina, destino):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(html_pagina)
        temp = f.name
    png = destino + '.tmp.png'
    try:
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                        '--force-device-scale-factor=1', '--window-size=1200,630',
                        '--virtual-time-budget=6000', '--allow-file-access-from-files',
                        '--screenshot=' + png, 'file://' + temp],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
        img = Image.open(png).convert('RGB').crop((0, 0, 1200, 630))
        img.save(destino, optimize=True)
    finally:
        os.unlink(temp)
        if os.path.exists(png):
            os.unlink(png)


def main(pedidos):
    os.makedirs(SAIDA, exist_ok=True)
    modelo = ler('_og/modelo.html')
    cats, total = catalogo()
    icones = mapa_icones()
    simb = simbolos()

    def montar(rotulo, titulo_html, tamanho, lead, lado):
        return (modelo.replace('{{LOGO}}', LOGO)
                      .replace('{{ROTULO}}', rotulo)
                      .replace('{{TITULO}}', titulo_html)
                      .replace('{{TAMANHO}}', str(tamanho))
                      .replace('{{LEAD}}', html.escape(lead))
                      .replace('{{LADO}}', lado))

    if not pedidos or 'home' in pedidos:
        grade = '<div class="grade">%s</div>' % ''.join('<div>%s</div>' % svg(simb, n) for n in ICONES_HOME)
        pagina = montar('', 'O SEI com as ferramentas que faltavam<span class="ponto">.</span>', 74,
                        'Extensão gratuita e de código aberto com %d funções para o Controle de Processos, '
                        'a árvore do processo e o editor de documentos.' % total, grade)
        renderizar(pagina, os.path.join(SAIDA, 'home.png'))
        print('home.png')

    slugs = sorted(f[:-3] for f in os.listdir(os.path.join(RAIZ, 'pages')) if f.endswith('.md'))
    for slug in slugs:
        if pedidos and slug not in pedidos:
            continue
        titulo, lead = dados_pagina(slug)
        icone = icones.get(slug, 'file-text')
        rotulo = '<span class="rotulo">%s</span>' % html.escape(cats.get(slug, 'Guia do SEI Pro'))
        lado = ('<div class="fundo">%s</div><div class="tile">%s</div>' % (svg(simb, icone), svg(simb, icone)))
        renderizar(montar(rotulo, html.escape(titulo), tamanho_titulo(titulo), lead, lado),
                   os.path.join(SAIDA, slug + '.png'))
        print('%s.png  (%s)' % (slug, titulo))


if __name__ == '__main__':
    main(sys.argv[1:])
