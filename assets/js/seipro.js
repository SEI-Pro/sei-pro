/* SEI Pro — site de documentação */
(function () {
  'use strict';

  var base = (document.body.getAttribute('data-base') || '').replace(/\/$/, '');

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  /* Menu no celular */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu-principal');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      menuBtn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('aberto'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Tecla "/" leva à busca */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    var busca = document.getElementById('busca-funcoes') || document.getElementById('busca-lado');
    if (busca) { e.preventDefault(); busca.focus(); }
  });

  /* ---------- Página inicial ---------- */

  /* Botão de instalar conforme o navegador */
  var btnInstalar = document.getElementById('btn-instalar');
  if (btnInstalar) {
    var ua = navigator.userAgent;
    var celular = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) && !/Windows NT|Macintosh(?!.*Mobile)/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua) && window.innerWidth < 1100);
    var outros = document.getElementById('outros-nav');
    var lojas = {
      edge: ['Adicionar ao Edge', 'https://microsoftedge.microsoft.com/addons/detail/sei-pro/gkhfbbbminanojfklpfmloaglckmlfne'],
      firefox: ['Adicionar ao Firefox', 'https://addons.mozilla.org/pt-BR/firefox/addon/sei-pro/']
    };
    var nav = /Edg\//.test(ua) ? 'edge' : /Firefox\//.test(ua) ? 'firefox' : null;
    if (celular) {
      btnInstalar.hidden = true;
      btnInstalar.style.display = 'none';
      var aviso = document.getElementById('aviso-celular');
      if (aviso) aviso.hidden = false;
      if (outros) outros.hidden = true;
      var compartilhar = document.getElementById('btn-compartilhar');
      if (compartilhar) {
        compartilhar.addEventListener('click', function () {
          var dados = { title: 'SEI Pro', text: 'Extensão SEI Pro para instalar no computador', url: location.origin + base + '/' };
          if (navigator.share) {
            navigator.share(dados).catch(function () {});
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(dados.url).then(function () {
              compartilhar.querySelector('span').textContent = 'Link copiado';
            });
          }
        });
      }
    } else if (nav) {
      btnInstalar.querySelector('span').textContent = lojas[nav][0];
      btnInstalar.href = lojas[nav][1];
      if (outros) {
        /* Reescreve "Também para ..." com as duas lojas que não são a do navegador atual */
        var nomes = { chrome: 'Google Chrome', edge: 'Microsoft Edge', firefox: 'Mozilla Firefox' };
        var urls = {
          chrome: 'https://chrome.google.com/webstore/detail/sei-pro/pdbbapplhjopafpgidbgceccbbmehcjj',
          edge: lojas.edge[1],
          firefox: lojas.firefox[1]
        };
        var resto = ['chrome', 'edge', 'firefox'].filter(function (k) { return k !== nav; });
        outros.textContent = 'Também para ';
        outros.appendChild(el('a', { href: urls[resto[0]] }, nomes[resto[0]]));
        outros.appendChild(document.createTextNode(' e '));
        outros.appendChild(el('a', { href: urls[resto[1]] }, nomes[resto[1]]));
      }
    }
  }

  /* Catálogo: busca e filtros */
  var grupos = document.getElementById('grupos');
  if (grupos) {
    var busca = document.getElementById('busca-funcoes');
    var chips = document.getElementById('chips');
    var vazio = document.getElementById('vazio');
    var listaGrupos = Array.prototype.slice.call(grupos.querySelectorAll('.grupo'));
    var filtroCats = null;

    listaGrupos.forEach(function (g) {
      var b = el('button', { type: 'button', 'aria-pressed': 'false', 'data-cat': g.getAttribute('data-cat') }, g.getAttribute('data-cat'));
      chips.appendChild(b);
      Array.prototype.forEach.call(g.querySelectorAll('li'), function (li) { li.setAttribute('data-busca', norm(li.textContent)); });
    });

    function aplicar() {
      var q = norm(busca.value.trim());
      var algum = false;
      listaGrupos.forEach(function (g) {
        var naCat = !filtroCats || filtroCats.indexOf(g.getAttribute('data-cat')) >= 0;
        var visiveis = 0;
        Array.prototype.forEach.call(g.querySelectorAll('li'), function (li) {
          var ok = naCat && (!q || li.getAttribute('data-busca').indexOf(q) >= 0);
          li.hidden = !ok;
          if (ok) visiveis++;
        });
        g.hidden = visiveis === 0;
        if (visiveis) algum = true;
      });
      vazio.hidden = algum;
    }
    function marcarChip(cats) {
      Array.prototype.forEach.call(chips.querySelectorAll('button'), function (b) {
        var c = b.getAttribute('data-cat');
        var on = cats ? (cats.length === 1 && cats[0] === c) : c === '';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var c = b.getAttribute('data-cat');
      filtroCats = c ? [c] : null;
      marcarChip(filtroCats);
      aplicar();
    });
    busca.addEventListener('input', aplicar);

    Array.prototype.forEach.call(document.querySelectorAll('.area[data-filtro]'), function (a) {
      a.addEventListener('click', function () {
        filtroCats = a.getAttribute('data-filtro').split('|');
        marcarChip(filtroCats);
        busca.value = '';
        aplicar();
      });
    });
  }

  /* ---------- Páginas de funcionalidade ---------- */
  var navFuncoes = document.getElementById('nav-funcoes');
  if (navFuncoes) {
    var prosa = document.getElementById('prosa');

    /* Sumário "Nesta página" */
    var toc = document.getElementById('toc');
    var titulos = prosa ? prosa.querySelectorAll('h3[id]') : [];
    if (toc && titulos.length > 1) {
      Array.prototype.forEach.call(titulos, function (h) {
        toc.appendChild(el('a', { href: '#' + h.id }, h.textContent));
      });
      toc.hidden = false;
      if ('IntersectionObserver' in window) {
        var links = toc.querySelectorAll('a');
        var obs = new IntersectionObserver(function (entradas) {
          entradas.forEach(function (en) {
            if (en.isIntersecting) {
              Array.prototype.forEach.call(links, function (l) { l.classList.toggle('ativo', l.getAttribute('href') === '#' + en.target.id); });
            }
          });
        }, { rootMargin: '-80px 0px -70% 0px' });
        Array.prototype.forEach.call(titulos, function (h) { obs.observe(h); });
      }
    }

    var lado = navFuncoes.closest('.doc-lado');
    var buscaLado = document.getElementById('busca-lado');
    var atual = location.pathname.split('/').pop().toLowerCase();

    fetch(base + '/funcionalidades.json').then(function (r) { return r.json(); }).then(function (cats) {
      var plano = [];
      var catAtual = null;
      cats.forEach(function (c) {
        c.itens.forEach(function (f) {
          f.cat = c.cat;
          plano.push(f);
          if (f.url.split('/').pop().toLowerCase() === atual) { catAtual = c.cat; }
        });
      });

      function montar(q) {
        navFuncoes.textContent = '';
        if (q) {
          var achados = plano.filter(function (f) { return norm(f.nome).indexOf(q) >= 0; });
          achados.forEach(function (f) { navFuncoes.appendChild(linkFuncao(f)); });
          if (!achados.length) navFuncoes.appendChild(el('span', { 'class': 'rotulo-peq' }, 'Nada encontrado'));
          return;
        }
        cats.forEach(function (c) {
          var d = el('details');
          if (c.cat === catAtual) d.open = true;
          var s = el('summary');
          s.appendChild(document.createTextNode(c.cat));
          s.appendChild(el('span', null, String(c.itens.length)));
          d.appendChild(s);
          var box = el('div');
          c.itens.forEach(function (f) { box.appendChild(linkFuncao(f)); });
          d.appendChild(box);
          if (c.cat === catAtual) navFuncoes.insertBefore(d, navFuncoes.firstChild); else navFuncoes.appendChild(d);
        });
        if (catAtual && navFuncoes.children.length > 1) {
          navFuncoes.insertBefore(el('span', { 'class': 'rotulo-peq' }, 'Outras áreas'), navFuncoes.children[1]);
        }
      }
      function linkFuncao(f) {
        var a = el('a', { href: f.url }, f.nome);
        if (f.url.split('/').pop().toLowerCase() === atual) a.setAttribute('aria-current', 'page');
        return a;
      }
      montar('');

      if (buscaLado) {
        buscaLado.addEventListener('input', function () {
          var q = norm(buscaLado.value.trim());
          montar(q);
          if (lado) lado.classList.toggle('aberto', !!q);
        });
      }

      /* Caminho e anterior/próxima */
      var i = -1;
      plano.forEach(function (f, k) { if (f.url.split('/').pop().toLowerCase() === atual) i = k; });
      if (i >= 0) {
        var migalha = document.getElementById('migalha');
        migalha.appendChild(el('span', { 'aria-hidden': 'true' }, '/'));
        migalha.appendChild(el('span', null, plano[i].cat));
        migalha.appendChild(el('span', { 'aria-hidden': 'true' }, '/'));
        migalha.appendChild(el('span', { 'aria-current': 'page' }, plano[i].nome));

        var ap = document.getElementById('anterior-proxima');
        if (plano[i - 1]) {
          var a1 = el('a', { href: plano[i - 1].url });
          a1.appendChild(el('small', null, '← Anterior'));
          a1.appendChild(el('strong', null, plano[i - 1].nome));
          ap.appendChild(a1);
        }
        if (plano[i + 1]) {
          var a2 = el('a', { href: plano[i + 1].url, 'class': 'proxima' });
          a2.appendChild(el('small', null, 'Próxima →'));
          a2.appendChild(el('strong', null, plano[i + 1].nome));
          ap.appendChild(a2);
        }
      }

      /* No celular a lista fica recolhida atrás de um botão */
      if (lado) {
        var toggle = el('button', { type: 'button', 'class': 'btn btn-claro lado-toggle', 'aria-expanded': 'false' }, 'Ver a lista de funções');
        toggle.addEventListener('click', function () {
          var ab = lado.classList.toggle('aberto');
          toggle.setAttribute('aria-expanded', ab ? 'true' : 'false');
          toggle.textContent = ab ? 'Esconder a lista de funções' : 'Ver a lista de funções';
        });
        lado.insertBefore(toggle, navFuncoes);
      }
    }).catch(function () { /* sem a lista, a página continua legível */ });
  }
})();
