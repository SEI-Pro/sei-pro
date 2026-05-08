# Logging e auto-report de erros

Convenção para logs da extensão. Auditável remotamente — quando um usuário tem
problema, o log já chega no nosso endpoint sem precisar pedir reprodução.

## Como a infra existente funciona

Já implementado em [dist/js/sei-functions-pro.js](../dist/js/sei-functions-pro.js)
(função `ensureSEIProLogCapture`, linha ~450):

1. Intercepta `console.log/info/warn/error` em buffer (`window.__SEI_PRO_LOG_BUFFER__`).
2. Persiste em `sessionStorage` (`SEI_PRO_LOG_STORAGE_KEY`), até 200 entradas / 60 KB.
3. Em **`console.error`**, **`window.error`**, ou **`unhandledrejection`** dispara
   `scheduleSEIProAutomaticErrorReport`:
   - Debounce de 1.5s
   - Dedup por assinatura do erro (mesmo erro só vai uma vez por sessão)
   - Máx 10 reports por sessão
   - Inclui buffer recente de logs no payload
4. Envio via `background.js` → Apps Script (`SEI_PRO_APPS_SCRIPT_URL_FALLBACK`).

**Conclusão prática:** se você quer que algo seja reportado, é só logar via
`console.error`. A infra cuida do resto.

## Quando usar cada nível

| Nível | Uso | Auto-reporta? |
|---|---|---|
| `console.log` | Diagnóstico de fluxo normal ("painel montado", "fetch concluído"). | ❌ |
| `console.warn` | Estado degenerado **esperado** ou diagnóstico que não impede a feature. Ex.: "já booted", "submit button sem name". | ❌ |
| `console.error` | **A extensão não fez o que planejou.** Ex.: fetch falhou, DOM esperado ausente, edição reverteu. | ✅ |
| `report()` (helper) | Mesma coisa que error, mas com **contexto estruturado** (URL, frame, idProc) padronizado. Use sempre que possível. | ✅ |

## Helper `report()` — padrão a seguir

Definido em [dist/js/sei-pro-arvore-boot.js](../dist/js/sei-pro-arvore-boot.js) (linha ~32).
Replicar em outros arquivos quando precisar:

```js
function reportContext() {
    var ctx = { url: '', frame: '', idProc: '', host: '' };
    try {
        ctx.url = (location.href || '').split('?')[0];          // sem query (evita PII/hash)
        ctx.frame = window.name || (window === window.top ? 'top' : 'iframe');
        ctx.host = location.hostname || '';
        var m = (location.href || '').match(/[?&]id_procedimento=(\d+)/);
        if (m) ctx.idProc = m[1];
    } catch (e) {}
    return ctx;
}
function report(reason, detail) {
    var ctx = reportContext();
    console.error(
        TAG, '[REPORT]', reason,
        '| ctx=' + JSON.stringify(ctx) +
        (detail !== undefined ? ' | detail=' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : '')
    );
}
```

`TAG` é o prefixo do módulo (ex.: `'[SeiProTree]'`, `'[SeiProArvore]'`, `'[SeiProEditor]'`).
Útil pra filtrar logs por origem no console e no payload.

## Quando chamar `report()`

Regra: **se o usuário não vai conseguir usar a funcionalidade que esperava, é report.**

### Casos típicos

| Cenário | Reportar? | Detalhe a incluir |
|---|---|---|
| `fetch` retorna não-OK ou estoura | ✅ | URL fetchada, `e.message` |
| Elemento DOM esperado não existe (`#frmArvore`, `#selFoo`) | ✅ | seletor, página onde procurou |
| Toolbar link ausente (impede edição) | ✅ | nome do `acao=` procurado |
| Submit reverteu por erro do servidor | ✅ | URL, erro |
| Refresh agendado para nome inexistente | ✅ | nome solicitado |
| Watchdog de dialog estourou (refresh prematuro) | ✅ | timeout em ms |
| Parse de inline `Nos[N]` retorna 0 quando esperava ≥1 | ✅ | qual variante esperava |
| Stub parent ativado (degrade) | ❌ | Estado conhecido fora do contexto trabalhar — só `log` |
| `parent.X` indefinido em frame não-trabalhar | ❌ | Esperado, só `log` |
| Cross-origin em parent | ❌ | Esperado, `log` |
| "Sem marcador / sem responsáveis / sem assuntos" no painel | ❌ | Estado normal do processo |

### O que NÃO incluir no `detail`

- Conteúdo de documentos do usuário
- Texto de anotações
- Nomes de pessoas físicas (cuidado com `interessados`)
- Hashes de URL do SEI (eles são tokens de sessão — `reportContext` já strippa via `split('?')[0]`)
- Cookies, headers de auth

URL do erro (`e.message` de `fetchPage`) já é "HTTP 500" ou similar, não inclui body.
Mantenha assim.

## Migração de código existente

### `console.warn(...)` que indica falha → trocar por `report()`

Exemplos do que mudar:

```js
// ANTES
warn('inline editor: missing source', f.srcSelector);

// DEPOIS
report('inline editor: missing source field in fetched form',
       { selector: f.srcSelector, formUrl: formUrl });
```

```js
// ANTES
console.warn('SEI Pro: dadosProcessoPro vazio depois de 5s — desistindo');

// DEPOIS
report('dadosProcessoPro vazio depois de 5s — feature dependente desabilitada',
       { tentativas: 5 });
```

### `console.error(...)` direto sem contexto → trocar por `report()`

```js
// ANTES
console.error('Erro ao parsear marcador:', e);

// DEPOIS
report('Erro ao parsear marcador',
       { error: e.message, stack: e.stack && e.stack.split('\n')[0] });
```

A diferença é que `report()` força contexto e `[REPORT]` no log fica filtrável
no painel de relatórios.

### `try { ... } catch (e) {}` (catch silencioso) → reportar

Engolir erro é o pior caso — usuário tem um bug e a gente nem sabe. Só engolir
quando o erro **não for sintoma** (ex.: parsing de URL malformada num campo
opcional). Se a feature depende do `try`, reporte no `catch`.

```js
// ANTES (silent)
try { addUrl = new URL(m[1], location.href).href; } catch (e) { addUrl = m[1]; }

// DEPOIS
try { addUrl = new URL(m[1], location.href).href; }
catch (e) { report('marcador: URL inválida no btnAdicionar', { raw: m[1], error: e.message }); addUrl = m[1]; }
```

## Onde aplicar a seguir

Arquivos com muito `console.warn` / `console.error` sem contexto, candidatos
a migração:

- [dist/js/sei-pro-arvore.js](../dist/js/sei-pro-arvore.js) — restos do legacy
- [dist/js/sei-pro.js](../dist/js/sei-pro.js) — main page features
- [dist/js/sei-pro-editor.js](../dist/js/sei-pro-editor.js) — CKEditor enhancements
- [dist/js/sei-pro-ai.js](../dist/js/sei-pro-ai.js) — falhas de chamadas OpenAI/Gemini

Cada arquivo deve definir seu próprio `TAG` e `report()` local (não há
namespace global porque queremos o tag fixo no log).

## Como ler os logs no painel

(Pendente: documentar o painel Apps Script. Por enquanto, payloads chegam
em `descricao=Erro detectado automaticamente pela extensão` com `erro_tecnico`
contendo a string completa do `console.error`.)

Filtros úteis:
- `[REPORT]` — só os reports estruturados
- `[SeiProTree]` / `[SeiProEditor]` etc. — por módulo
- `ctx=` — extrair o JSON de contexto

## Limites a respeitar

- Cada sessão de usuário envia **no máx 10 reports** (definido em
  `SEI_PRO_AUTO_REPORT_MAX_PER_SESSION`).
- Erros idênticos (mesma assinatura) **só uma vez por sessão**. Logo, não
  precisa se preocupar com loop reportando.
- Buffer envia até 60 KB de logs prévios junto. Logs muito verbosos podem ser
  truncados — dimensione `console.log` com isso em mente.

## Quando NÃO logar

- Em loops apertados (ex.: dentro de MutationObserver callback que dispara 100×/s).
  Resuma em `log()` único após o batch.
- Conteúdo do usuário, mesmo em `log`. O buffer vai junto no payload.
- "Cliquei aqui" / "abri popup" — sem ação = sem log.
