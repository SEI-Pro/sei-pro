# Gestor de Projetos em TS — P1 Fundação comum: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar dos Favoritos para o `sei-comum` as peças genéricas que o pacote `projetos/` vai usar (motor de sincronia por Texto Padrão com releitura antes de gravar, controle da aba, codec, assinatura, trava, consentimento, arquivo sincronizado, cópias diárias e banco IndexedDB por módulo, diálogos, painel embutido com altura/sobreposição/aviso e avatar), e migrar Favoritos e Histórico para elas sem mudar comportamento nem as expectativas das suítes.

**Architecture:** Cada peça entra no `sei-comum/src/` parametrizada por um **adaptador** (o módulo ensina o envelope, a mesclagem, a assinatura, o teto e as mensagens) ou por opções (id, título, prefixo, canal). Os arquivos antigos dos Favoritos viram **fachadas finas** com os mesmos nomes e assinaturas (as provas deles importam por `../src/...` e não mudam uma linha), e o Histórico troca os diálogos duplicados pelos do comum. O código deste plano foi ensaiado inteiro numa cópia da worktree: todas as contagens de provas abaixo são as que saíram do ensaio.

**Tech Stack:** TypeScript 5.9, esbuild 0.25 (`charset: "ascii"`), tsx + linkedom (testes), Biome 2, Chrome MV3.

**Spec:** `docs/superpowers/specs/2026-10-06-projetos-design.md` (seções 4.2, 6.1, 6.2 e 10) e o plano-mestre `docs/superpowers/plans/2026-10-06-projetos-00-mapa.md` (fase P1).

## Global Constraints

- Idioma: código, nomes, comentários, textos de interface e mensagens em português do Brasil; título de commit sem acento (`Comum: ...`), terminando com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Git: trabalhar só na worktree `/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos` (branch `feat/projetos-ts`); conferir `git branch --show-current` antes do primeiro commit; **nunca `git add -A`** (adicionar por caminho); sem push, merge, release.
- `dist/js` gerado: só ASCII (esbuild `charset: "ascii"` + portão de bytes > 0x7f no `build.mjs`). **O portão grava o `dist/` antes de reprovar**: depois de todo `node build.mjs`, conferir que a saída termina na tabela "Favoritos -- build"/"Historico -- build" e não tem linha `ERRO:`.
- Escapes `\uXXXX`: as ferramentas de edição e o heredoc do shell desta máquina convertem `\uXXXX` em caractere cru, e caractere cru dentro de **regex** passa direto pelo esbuild e reprova o portão ASCII. Nenhum código novo deste plano usa `\u` (o BOM sai por `charCodeAt(0) === 0xfeff`; nos testes, `String.fromCharCode(0xfeff)`). Arquivo que já tem `\uXXXX` (`favoritos/src/app/app.ts:1135`) só recebe `Edit` pontual, nunca `Write` do arquivo inteiro. Regex com faixa de acentos usa `normalizarTexto` de `@comum/texto`.
- DOM seguro: em TS só `h()`/`textContent`/`createElementNS`/`style.setProperty`; proibido `innerHTML`, `outerHTML`, `insertAdjacentHTML`, atributos `on*` em string.
- SEI em HTTP: sem `crypto.randomUUID` e sem Web Locks — a trava do comum roda direto sem `navigator.locks` (recuo existente) e as provas cobrem esse caminho.
- Comportamento dos Favoritos e do Histórico **não muda**: mesmo nome de Texto Padrão (`[_SEIPRO_FAV_<login>]`), mesma chave de status (`favoritos/sync/tp/<escopo>`, `favoritos/sync/arquivo/<host>|<login>`), mesma chave de consentimento (`host|login|idUnidade` em `textoPadraoUnidades`), mesma trava (`seipro-favoritos-sync|<chave>`), mesmo banco IndexedDB (`seipro-favoritos`, versão 1, depósitos `copias` e `arquivos`), mesmas mensagens, mesmas classes (`spro-fav-*`, `#favoritesPro`). Os Favoritos usam o motor com `releituras: 0`.
- **Nenhum arquivo em `favoritos/tests/` ou `historico/tests/` muda nesta fase** (é a prova de que as expectativas são as mesmas).
- Testes: tsx + linkedom, agregador `tests/verificar.ts` por pacote; **linha de base que não pode cair**: sei-comum 178, sei-nucleo 110, favoritos 578, historico 485, agente-ia 1054 (todas ok em 06/10/2026, `9eda964`). Ao fim desta fase: sei-comum 384, os outros iguais.
- Portões: `npx tsc --noEmit` e `npx biome check src tests` nos pacotes tocados (sem erros; avisos pré-existentes: sei-comum 8, favoritos 1, historico 0); portão ASCII dos builds; `node tools/check-dom-injection.mjs`; `node tools/patch-manifests.mjs --check` (o `tools/` é gitignored e já está na worktree).
- Os bundles gerados são versionados: toda tarefa que muda fonte dos Favoritos ou do Histórico regera com `node build.mjs` e comita os arquivos de `dist/js/` que mudaram, no mesmo commit.
- Manifest: nada muda nesta fase.

## Review Focus

1. **Quem já usa a sincronia dos Favoritos atualiza a extensão** — continua no mesmo Texto Padrão, com o mesmo consentimento, a mesma trava, o mesmo status e o mesmo banco de cópias; nada pede consentimento de novo, nada some, nenhuma cópia antiga fica invisível. Provas: Task 1 (nome do texto no formato antigo), Task 2 (chave de consentimento no formato antigo), Task 3 (nome da trava), Task 5 (banco `seipro-favoritos` já existente abre sem upgrade e acha a cópia antiga), e as 578 provas dos Favoritos intocadas.
2. **Outra pessoa grava o texto "Toda a unidade" entre a leitura e a gravação, ou continuamente** — nada do que ela gravou se perde: a releitura re-mescla e grava as duas coisas; se o texto mudar a cada leitura, depois de 3 releituras o motor não grava por cima, fica pendente e grava tudo na rodada seguinte. Provas: Task 3.
3. **SEI servido por HTTP (sem Web Locks)** — a rodada roda (com a releitura) e o "apagar" não fica preso esperando uma trava que não existe. Provas: Task 2 (trava sem locks) e Task 4 (controle com `travarComLocks(..., null)` e sem `travarEsperando`).
4. **Texto hostil (`<img src=x onerror=...>`, aspas, `&`, emoji, acento)** no título do painel, no título do diálogo, no texto do confirmar, no aviso no rodapé da tela e no nome do avatar aparece como texto, nunca vira elemento. Provas: Tasks 7, 8, 9 e 10.
5. **Painel embutido recolhido, removido ("onde mostrar" mudou) ou com o app recarregado/porta caída durante um diálogo aberto** — a página do SEI nunca fica travada (rolagem presa, iframe transparente por cima). Provas: Task 8 (sobreposição recolhida nega; `load` com diálogo aberto destrava) e Task 9 (porta caída com diálogo aberto destrava; painel fora da página nega).

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `sei-comum/src/sincronia/assinatura.ts` | criar (T1) | JSON estável, `porId`, assinatura de 16 hex |
| `sei-comum/src/sincronia/textoPadraoCodec.ts` | criar (T1) | nome `[_SEIPRO_<SIGLA>_<chave>]`, conteúdo legível + blocos, leitura de volta, "versão mais nova" |
| `sei-comum/src/sincronia/entidade.ts` | modificar (T1) | + `podarLapides` (prazo de lápide por escopo) |
| `sei-comum/src/sincronia/trava.ts` | criar (T2) | Web Locks com recuo sem locks |
| `sei-comum/src/sincronia/consentimento.ts` | criar (T2) | chave `host|login|unidade[|texto]`, leitura/gravação no objeto de preferências, porta |
| `sei-comum/src/sincronia/motor.ts` | criar (T3) | `MotorTextoPadrao<E>` + adaptador + releitura antes de gravar |
| `sei-comum/src/sincronia/controlePagina.ts` | criar (T4) | `ControleTextoPadrao<E>` (content script) + `ocultarTextosInternos` |
| `sei-comum/src/sincronia/banco.ts` | criar (T5) | IndexedDB por módulo (versão 1, `copias` + `arquivos`) |
| `sei-comum/src/sincronia/copias.ts` | criar (T5) | cópias diárias genéricas, `recarimbarAtivos` |
| `sei-comum/src/sincronia/arquivo.ts` | criar (T6) | `SincroniaArquivo<E>`, `ControleArquivo<E>`, handles, seletor |
| `sei-comum/src/ui/dialogo.ts` | criar (T7) | `criarAbrirModal`, `criarConfirmar`, `baixar`, `escolherArquivo` |
| `sei-comum/src/painel/altura.ts` | criar (T8) | `observarAltura` (lado do app) |
| `sei-comum/src/painel/sobreposicao.ts` | criar (T8) | `criarSobreposicao` (aba) + `sobreposicaoNoApp` (app) |
| `sei-comum/src/painel/aviso.ts` | criar (T8) | `avisoNaPagina` (aba) + `emissorDeAvisoPelaPagina` (app) |
| `sei-comum/src/painel/embutido.ts` | criar (T9) | montar painel em `#panelHomePro`, ordem, título, estilo, tratadores RPC, porta por carga |
| `sei-comum/src/ui/avatar.ts` | criar (T10) | iniciais + cor estável |
| `sei-comum/tests/util.ts` | modificar (T1) | + `tique` |
| `sei-comum/tests/adaptadorTeste.ts` | criar (T3), modificar (T6) | módulo de mentira para as provas da sincronia |
| `sei-comum/tests/idbFalso.ts` | criar (T5) | IndexedDB mínimo em memória |
| `sei-comum/tests/verificar-*.ts` (10 novos) + `verificar.ts` | criar / modificar | provas novas |
| `favoritos/src/sincronia/{assinatura,textoPadrao,motor,copias,arquivoSync}.ts` | fachadas (T1, T3, T5, T6) | adaptadores dos Favoritos sobre o comum |
| `favoritos/src/preferencias.ts` | modificar (T2) | chave de consentimento do comum |
| `favoritos/src/pagina/{sincronia,sobreposicao,aviso,painel,executor,main}.ts` | fachadas / modificar (T2, T4, T8, T9) | controle, painel e porta do comum |
| `favoritos/src/app/{main,app}.ts` | modificar (T6, T7, T8) | diálogos, seletor, altura, sobreposição, aviso do comum |
| `favoritos/src/app/altura.ts` | apagar (T8) | foi para `@comum/painel/altura` |
| `historico/src/app/{main,app}.ts` | modificar (T7) | diálogos do comum |
| `dist/js/init_favoritos.js`, `dist/js/favoritos/{app,opcoes}.js`, `dist/js/historico/app.js` | regerar | bundles |
| `sei-comum/README.md` | modificar (T11) | lista da fundação comum |

## Interfaces que as fases seguintes usam (resumo; detalhe no bloco "Produces" de cada tarefa)

- `@comum/sincronia/assinatura`: `jsonEstavel(v: unknown): string`, `porId<T extends { id: string }>(l: readonly T[]): T[]`, `assinaturaEstavel(v: unknown): string`.
- `@comum/sincronia/entidade`: `podarLapides<C extends Record<string, Versionada[]>>(colecoes: C, agora: number, dias: number): C`.
- `@comum/sincronia/textoPadraoCodec`: `PREFIXO_TEXTO_INTERNO`, `LIMITE_NOME_TEXTO`, `type ValidacaoTexto<E>`, `type LeituraTexto`, `nomeDeTextoInterno(sigla, chave): string`, `gerarConteudoTexto(legivel, envelope): Promise<string>`, `lerConteudoTexto(html): Promise<LeituraTexto>`, `versaoMaisNova(bruto, formato, versaoAtual): boolean`.
- `@comum/sincronia/trava`: `type Travar`, `type TravarEsperando`, `type GerenteDeTravas`, `travarComLocks(nome, fn, locks?)`, `travarEsperando(nome, fn, locks?)`.
- `@comum/sincronia/consentimento`: `type EstadoConsentimento`, `type MapaConsentimento`, `interface PortaConsentimento`, `chaveConsentimento(host, login, idUnidade, texto?)`, `estadoConsentimento(mapa, chave)`, `lerConsentimento(area, chavePreferencias, campo, chave)`, `definirConsentimento(area, chavePreferencias, campo, chave, valor)`, `consentimentoNaArea({ area, chavePreferencias, campo, chave })`.
- `@comum/sincronia/motor`: `interface StatusSync`, `interface DestinoTexto`, `interface MensagensMotor`, `MENSAGENS_MOTOR`, `interface AdaptadorTexto<E>`, `interface DepsMotorTexto<E>`, `nomeDaTrava(modulo, chaveStatus)`, `textoDoErro(e)`, `class MotorTextoPadrao<E>`.
- `@comum/sincronia/controlePagina`: `ocultarTextosInternos(doc)`, `interface ArmazemTexto`, `interface DepsControlePagina<E>`, `class ControleTextoPadrao<E>`.
- `@comum/sincronia/banco`: `VERSAO_BANCO`, `type Deposito`, `abrirBanco(nome, fabrica?)`, `noDeposito(nome, deposito, modo, fazer, fabrica?)`.
- `@comum/sincronia/copias`: `MAX_COPIAS`, `interface Dono`, `interface Copia<E>`, `interface ArmazemCopias<E>`, `chaveDono(d)`, `fazerCopiaDoDia(armazem, dono, hoje, quando, exportar)`, `recarimbarAtivos(lista, carimbo)`, `copiasEmMemoria<E>()`, `copiasNoIndexedDB<E>(banco, fabrica?)`.
- `@comum/sincronia/arquivo`: `interface ArquivoSync`, `interface StatusArquivo`, `interface MensagensArquivo`, `MENSAGENS_ARQUIVO`, `interface AdaptadorArquivo<E>`, `class SincroniaArquivo<E>`, `type HandleArquivo`, `temSeletorDeArquivo(w?)`, `arquivoDoHandle(h)`, `permissao(h, pedir)`, `interface ArmazemHandles`, `handlesNoIndexedDB(banco, fabrica?)`, `interface DepsControleArquivo<E>`, `class ControleArquivo<E>`, `escolherArquivoSync(modo, nomeSugerido, descricao, janela?)`.
- `@comum/ui/dialogo`: `interface OpcoesModal`, `type AbrirModal`, `criarAbrirModal({ aoAbrir?, aoFechar? }?)`, `criarConfirmar(abrirModal)`, `baixar(nome, conteudo, tipo, revogarEm?)`, `escolherArquivo(aceitar?)`.
- `@comum/painel/altura`: `interface AlturaDoApp`, `observarAltura(rpc, raiz?)`.
- `@comum/painel/sobreposicao`: `interface Sobreposicao`, `criarSobreposicao(doc, iframe, reserva)`, `sobreposicaoNoApp(rpc, altura, o?)`.
- `@comum/painel/aviso`: `type AvisarNaPagina`, `validarPrefixo(prefixo)`, `avisoNaPagina(doc, temaEscuro, prefixo?)`, `emissorDeAvisoPelaPagina(rpc, doc?)`.
- `@comum/painel/embutido`: `ordemLegada(armazenamento, id)`, `inserirNaOrdem(container, painel, ordem)`, `igualarAoTituloDoSei(doc, titulo, depoisDaCarga?)`, `copiarLetraDoTitulo(doc, titulo)`, `instalarEstiloPainel(doc, prefixo)`, `interface OpcoesPainelEmbutido`, `interface PainelMontado`, `montarPainelEmbutido(doc, o)`, `tratadoresDoPainel(d)`, `ligarPortaDoPainel(m, conectar, tratadores)`.
- `@comum/ui/avatar`: `PALETA_AVATAR`, `iniciais(nome)`, `corDoAvatar(nome)`, `avatar(nome, o?)`.

## Como rodar

- Provas de um pacote: `cd <pacote> && npx tsx tests/verificar.ts` (a última linha é `N ok, 0 falha(s)`).
- Tipos: `cd <pacote> && npx tsc --noEmit` (sem saída = ok). Lint/formato: `cd <pacote> && npx biome check src tests`.
- Formatar só os arquivos novos de uma tarefa (nunca `--write` no pacote inteiro, que mexeria em avisos antigos): `npx biome format --write <arquivos>`.
- Build: `cd favoritos && node build.mjs`, `cd historico && node build.mjs`.
- Todos os comandos partem da raiz da worktree: `cd "/Users/phs/Develop/Git/Lab2Code/SEI Pro/sei-pro-projetos"`.
- Números de linha citados numa tarefa são os do arquivo **antes daquela tarefa** (as tarefas anteriores já aplicadas). Aplique cada troca pelo texto exato mostrado (o `Edit` casa o texto); dentro de uma mesma tarefa, uma troca anterior pode deslocar as linhas das seguintes.

---

### Task 1: Assinatura, codec do Texto Padrão e poda de lápides

**Files:**
- Create: `sei-comum/src/sincronia/assinatura.ts`, `sei-comum/src/sincronia/textoPadraoCodec.ts`, `sei-comum/tests/verificar-sincronia-base.ts`
- Modify: `sei-comum/src/sincronia/entidade.ts` (acrescentar ao fim), `sei-comum/tests/util.ts` (acrescentar ao fim), `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/sincronia/assinatura.ts` (reescrever), `favoritos/src/sincronia/textoPadrao.ts:12-14,21-28,90-93,101-121`
- Regerar: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `hashCurto(texto: string): string` (`@comum/texto`); `codificar`, `decodificar`, `paraParagrafos`, `deParagrafos` (`@comum/sincronia/codec`); `purgarLapides`, `Versionada` (`@comum/sincronia/entidade`).
- Produces:
  - `jsonEstavel(v: unknown): string`; `porId<T extends { id: string }>(lista: readonly T[]): T[]`; `assinaturaEstavel(v: unknown): string` (16 hex; mesma conta da assinatura dos Favoritos).
  - `PREFIXO_TEXTO_INTERNO = "[_SEIPRO_"`; `LIMITE_NOME_TEXTO = 50`; `type ValidacaoTexto<E> = { ok: E } | { invalido: string } | { maisNovo: true }`; `type LeituraTexto = { bruto: unknown } | { invalido: string }`.
  - `nomeDeTextoInterno(sigla: string, chave: string): string` — `("PRJ", "UNIDADE")` → `[_SEIPRO_PRJ_UNIDADE]`; chave longa → 27 caracteres + `~` + 8 hex. A chave entra como veio (login: o chamador passa em minúsculas).
  - `gerarConteudoTexto(legivel: string, envelope: unknown): Promise<string>`; `lerConteudoTexto(html: string): Promise<LeituraTexto>`; `versaoMaisNova(bruto: unknown, formato: string, versaoAtual: number): boolean`.
  - `podarLapides<C extends Record<string, Versionada[]>>(colecoes: C, agora: number, dias: number): C` (prazo de lápide por escopo: o Projetos usará 180 dias na unidade e 90 no pessoal).
  - Nos Favoritos (novos exports): `legivelFavoritos(nomeUsuario: string): string`; `validarEnvelopeDoTexto(bruto: unknown, escopo: Escopo): ValidacaoTexto<Envelope>`.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-sincronia-base.ts`:

```ts
import { assinaturaEstavel, jsonEstavel, porId } from "../src/sincronia/assinatura";
import { codificar, paraParagrafos } from "../src/sincronia/codec";
import { podarLapides } from "../src/sincronia/entidade";
import {
  gerarConteudoTexto,
  LIMITE_NOME_TEXTO,
  lerConteudoTexto,
  nomeDeTextoInterno,
  PREFIXO_TEXTO_INTERNO,
  versaoMaisNova,
} from "../src/sincronia/textoPadraoCodec";
import { checar, secao } from "./util";

const DIA = 86_400_000;

export async function verificarSincroniaBase(): Promise<void> {
  secao("sincronia: assinatura estavel");
  checar("ordem das chaves nao muda a assinatura", assinaturaEstavel({ a: 1, b: [2, 3] }) === assinaturaEstavel({ b: [2, 3], a: 1 }));
  checar("campo undefined e o mesmo que ausente", assinaturaEstavel({ a: 1, b: undefined }) === assinaturaEstavel({ a: 1 }));
  checar("valor diferente, assinatura diferente", assinaturaEstavel({ a: 1 }) !== assinaturaEstavel({ a: 2 }));
  checar("16 hexadecimais", /^[0-9a-f]{16}$/.test(assinaturaEstavel([1, "x"])));
  const lista = [{ id: "b" }, { id: "a" }];
  checar(
    "porId ordena sem mexer na original",
    porId(lista)
      .map((x) => x.id)
      .join() === "a,b" && lista[0]?.id === "b",
  );
  checar("jsonEstavel", jsonEstavel({ z: [1, { y: 2, x: 1 }], a: "t" }) === '{"a":"t","z":[1,{"x":1,"y":2}]}');

  secao("sincronia: nome do Texto Padrao");
  checar("Favoritos: login curto", nomeDeTextoInterno("FAV", "pedro.soares") === "[_SEIPRO_FAV_pedro.soares]");
  const longo = nomeDeTextoInterno("FAV", `${"a".repeat(30)}@orgao.gov.br`);
  checar(
    "login longo: 27 + ~ + 8 hex, cabe em 50 (o formato dos Favoritos)",
    longo.length === LIMITE_NOME_TEXTO && /^\[_SEIPRO_FAV_a{27}~[0-9a-f]{8}\]$/.test(longo),
    longo,
  );
  checar(
    "logins longos diferentes nao colidem",
    nomeDeTextoInterno("PRJ", `${"a".repeat(30)}@x.gov.br`) !== nomeDeTextoInterno("PRJ", `${"a".repeat(30)}@y.gov.br`),
  );
  checar("Projetos: texto da unidade", nomeDeTextoInterno("PRJ", "UNIDADE") === "[_SEIPRO_PRJ_UNIDADE]");
  checar("todo nome comeca pelo prefixo interno", nomeDeTextoInterno("PRJ", "x").startsWith(PREFIXO_TEXTO_INTERNO));

  secao("sincronia: conteudo do Texto Padrao");
  const env = { formato: "teste", versao: 1, itens: [{ id: "1", nome: "Ação <b>&" }] };
  const html = await gerarConteudoTexto("Dados internos do SEI Pro <não edite> & obrigado", env);
  checar("paragrafo legivel primeiro, escapado", html.startsWith("<p>Dados internos do SEI Pro &lt;não edite&gt; &amp; obrigado</p>"));
  const volta = await lerConteudoTexto(html);
  checar("ida e volta", "bruto" in volta && JSON.stringify(volta.bruto) === JSON.stringify(env), volta);
  const editado = html.replace(/<\/p>\n<p>/, "</p>\n<p>colega escreveu aqui</p>\n<p>");
  const r1 = await lerConteudoTexto(editado);
  checar("bloco editado por colega: invalido", "invalido" in r1 && /editado/.test(r1.invalido), r1);
  checar("vazio: invalido", "invalido" in (await lerConteudoTexto("")));
  const corrompido = paraParagrafos("Dados internos", "QUFBQUFB");
  const r2 = await lerConteudoTexto(corrompido);
  checar("base64 valido que nao e gzip: corrompido", "invalido" in r2 && /corrompidos/.test(r2.invalido), r2);
  const sei5 = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  checar("conteudo escapado mais uma vez (SEI 5) ainda le", "bruto" in (await lerConteudoTexto(sei5)));
  checar("codec continua o mesmo do pacote", (await codificar({ a: 1 })).length > 0);

  secao("sincronia: versao mais nova");
  checar("mesmo formato, versao maior", versaoMaisNova({ formato: "seipro-projetos", versao: 2 }, "seipro-projetos", 1));
  checar("mesma versao: nao", !versaoMaisNova({ formato: "seipro-projetos", versao: 1 }, "seipro-projetos", 1));
  checar(
    "outro formato: nao (e invalido, nao mais novo)",
    !versaoMaisNova({ formato: "seipro-favoritos", versao: 9 }, "seipro-projetos", 1),
  );
  checar("lixo: nao", !versaoMaisNova(null, "x", 1) && !versaoMaisNova("texto", "x", 1));

  secao("sincronia: lapides com prazo por escopo");
  const agora = 1000 * DIA;
  const vivo = { id: "a", atualizadoEm: 1, dispositivo: "A" };
  const de120 = { id: "b", atualizadoEm: agora - 120 * DIA, dispositivo: "A", removidoEm: agora - 120 * DIA };
  const de200 = { id: "c", atualizadoEm: agora - 200 * DIA, dispositivo: "A", removidoEm: agora - 200 * DIA };
  const unidade = podarLapides({ p: [vivo, de120, de200], e: [de200] }, agora, 180);
  checar(
    "180 dias (unidade): fica a de 120, sai a de 200, em todas as listas",
    unidade.p.map((x) => x.id).join() === "a,b" && unidade.e.length === 0,
    unidade,
  );
  const pessoal = podarLapides({ p: [vivo, de120, de200] }, agora, 90);
  checar("90 dias (pessoal): so o vivo", pessoal.p.map((x) => x.id).join() === "a", pessoal);
}
```

Acrescentar ao fim de `sei-comum/tests/util.ts`:

```ts

/** Deixa as promessas e os setTimeout curtos correrem. */
export const tique = (ms = 5): Promise<void> => new Promise((r) => setTimeout(r, ms));
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarSincroniaBase } from "./verificar-sincronia-base";` logo depois da linha `import { verificarRpc } from "./verificar-rpc";`, e `await verificarSincroniaBase();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/assinatura' imported from .../tests/verificar-sincronia-base.ts`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/assinatura.ts`:

```ts
/**
 * Impressão digital de um conteúdo, igual em qualquer computador para o mesmo
 * dado: chaves do JSON em ordem, campos `undefined` fora. Quem chama põe as
 * listas em ordem (`porId`) e deixa de fora quem gravou e quando. Serve para
 * não regravar o que já está igual (Texto Padrão, arquivo).
 */

import { hashCurto } from "../texto";

export function jsonEstavel(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(jsonEstavel).join(",")}]`;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o)
      .sort()
      .filter((k) => o[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${jsonEstavel(o[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v);
}

/** Cópia ordenada pelo id (a lista original fica como estava). */
export function porId<T extends { id: string }>(lista: readonly T[]): T[] {
  return [...lista].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** Dois FNV-1a (o JSON e o JSON de trás para frente): 16 hexadecimais. */
export function assinaturaEstavel(v: unknown): string {
  const s = jsonEstavel(v);
  return `${hashCurto(s)}${hashCurto(s.split("").reverse().join(""))}`;
}
```

Criar `sei-comum/src/sincronia/textoPadraoCodec.ts`:

```ts
/**
 * O lado "Texto Padrão" de toda sincronia do SEI Pro: o nome do texto, o
 * conteúdo gravado (um parágrafo legível + os blocos do codec) e a leitura de
 * volta. O envelope é de quem usa (Favoritos, Projetos): aqui ele só é
 * codificado e decodificado. A validação do envelope é do adaptador (motor.ts).
 */

import { hashCurto } from "../texto";
import { codificar, decodificar, deParagrafos, paraParagrafos } from "./codec";

/** Todo texto de dados do SEI Pro começa assim (e sai do seletor do SEI: controlePagina.ts). */
export const PREFIXO_TEXTO_INTERNO = "[_SEIPRO_";
/** O limite do campo "Nome" do Texto Padrão no SEI. */
export const LIMITE_NOME_TEXTO = 50;

/** O que o adaptador diz do envelope lido: bom, inválido (com o motivo) ou de versão mais nova do SEI Pro. */
export type ValidacaoTexto<E> = { ok: E } | { invalido: string } | { maisNovo: true };

export type LeituraTexto = { bruto: unknown } | { invalido: string };

/**
 * `[_SEIPRO_<SIGLA>_<chave>]` em até 50 caracteres. Chave longa (login com
 * domínio) fica com o começo, `~` e 8 hexadecimais do hash da chave inteira:
 * logins longos diferentes não colidem. A chave entra como veio: quem chama
 * decide a caixa (login em minúsculas, "UNIDADE" em maiúsculas).
 */
export function nomeDeTextoInterno(sigla: string, chave: string): string {
  const inicio = `${PREFIXO_TEXTO_INTERNO}${sigla}_`;
  const nome = `${inicio}${chave}]`;
  if (nome.length <= LIMITE_NOME_TEXTO) return nome;
  const cabe = LIMITE_NOME_TEXTO - inicio.length - 1 - 8 - 1;
  return `${inicio}${chave.slice(0, cabe)}~${hashCurto(chave).slice(0, 8)}]`;
}

export async function gerarConteudoTexto(legivel: string, envelope: unknown): Promise<string> {
  return paraParagrafos(legivel, await codificar(envelope));
}

/** O JSON guardado no texto, ou o motivo de não haver um (texto editado, vazio ou corrompido). */
export async function lerConteudoTexto(html: string): Promise<LeituraTexto> {
  const b64 = deParagrafos(html);
  if (!b64) return { invalido: "o texto não tem os dados do SEI Pro (foi editado ou está vazio)" };
  try {
    return { bruto: await decodificar(b64) };
  } catch {
    return { invalido: "os dados do texto estão corrompidos" };
  }
}

/** Gravado por uma versão mais nova do SEI Pro: esta não entende o formato e não pode regravar por cima. */
export function versaoMaisNova(bruto: unknown, formato: string, versaoAtual: number): boolean {
  const b = bruto as { formato?: unknown; versao?: unknown } | null;
  return b?.formato === formato && typeof b.versao === "number" && b.versao > versaoAtual;
}
```

Acrescentar ao fim de `sei-comum/src/sincronia/entidade.ts` (depois de `purgarLapides`):

```ts

/**
 * Todas as listas de um envelope sem as lápides mais velhas que `dias`. O
 * prazo é de quem exporta e pode mudar por escopo (Projetos: 180 dias no texto
 * da unidade, que um colega eventual pode demorar a sincronizar; 90 no pessoal).
 * Lápide que sai cedo demais deixa o item "ressuscitar" pelo computador que
 * ainda o tinha vivo.
 */
export function podarLapides<C extends Record<string, Versionada[]>>(colecoes: C, agora: number, dias: number): C {
  const saida: Record<string, Versionada[]> = {};
  for (const [k, lista] of Object.entries(colecoes)) saida[k] = purgarLapides(lista, agora, dias);
  return saida as C;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `202 ok, 0 falha(s)`; tsc sem saída; biome `Found 8 warnings.` e nenhum erro (se o biome reclamar só de formatação dos arquivos novos, `npx biome format --write src/sincronia/assinatura.ts src/sincronia/textoPadraoCodec.ts src/sincronia/entidade.ts tests/verificar-sincronia-base.ts tests/util.ts tests/verificar.ts` e rodar de novo).

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/sincronia/assinatura.ts` inteiro (a conta é a mesma; o JSON estável e o hash duplo vieram para o comum):

```ts
/**
 * Impressão digital do conteúdo de um envelope, igual em qualquer computador
 * para o mesmo dado: entidades e listas em ordem, chaves do JSON em ordem, sem
 * os campos de quem gravou e quando. Serve para não regravar o que já está igual.
 * A conta é a da sei-comum (`@comum/sincronia/assinatura`); aqui só se escolhe o que entra.
 */

import { assinaturaEstavel, porId } from "@comum/sincronia/assinatura";
import type { Envelope } from "../arquivo";
import { chaveEscopo } from "../modelo/escopo";

export function assinaturaEnvelope(env: Envelope): string {
  const escopos = [...env.escopos]
    .map((e) => ({ k: chaveEscopo(e.escopo), f: porId(e.favoritos), p: porId(e.pastas), e: porId(e.etiquetas) }))
    .sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
  return assinaturaEstavel(escopos);
}
```

Em `favoritos/src/sincronia/textoPadrao.ts` (o resto do arquivo fica igual):

(a) linhas 12-14 — trocar

```ts
import { codificar, decodificar, deParagrafos, paraParagrafos } from "@comum/sincronia/codec";
import { hashCurto } from "@comum/texto";
import { type Envelope, lerEnvelope } from "../arquivo";
```

por

```ts
import {
  gerarConteudoTexto,
  lerConteudoTexto,
  nomeDeTextoInterno,
  PREFIXO_TEXTO_INTERNO,
  type ValidacaoTexto,
  versaoMaisNova,
} from "@comum/sincronia/textoPadraoCodec";
import { type Envelope, lerEnvelope } from "../arquivo";
```

(b) linhas 21-28 — trocar

```ts
export const PREFIXO_TEXTO = "[_SEIPRO_";

/** `[_SEIPRO_FAV_<login>]`, no máximo 50 caracteres (o limite do campo). */
export function nomeDoTexto(login: string): string {
  const l = login.trim().toLowerCase();
  const nome = `${PREFIXO_TEXTO}FAV_${l}]`;
  return nome.length <= 50 ? nome : `${PREFIXO_TEXTO}FAV_${l.slice(0, 27)}~${hashCurto(l).slice(0, 8)}]`;
}
```

por

```ts
export const PREFIXO_TEXTO = PREFIXO_TEXTO_INTERNO;

/** `[_SEIPRO_FAV_<login>]`, no máximo 50 caracteres (o limite do campo). */
export function nomeDoTexto(login: string): string {
  return nomeDeTextoInterno("FAV", login.trim().toLowerCase());
}
```

(c) linhas 90-93 — trocar

```ts
export async function conteudoDoTexto(env: Envelope, nomeUsuario: string): Promise<string> {
  const legivel = `Dados internos do SEI Pro — favoritos de ${nomeUsuario}. Não use em documentos nem edite: o SEI Pro regrava este texto sozinho.`;
  return paraParagrafos(legivel, await codificar(env));
}
```

por

```ts
/** O parágrafo legível que abre o texto. */
export function legivelFavoritos(nomeUsuario: string): string {
  return `Dados internos do SEI Pro — favoritos de ${nomeUsuario}. Não use em documentos nem edite: o SEI Pro regrava este texto sozinho.`;
}

export function conteudoDoTexto(env: Envelope, nomeUsuario: string): Promise<string> {
  return gerarConteudoTexto(legivelFavoritos(nomeUsuario), env);
}
```

(d) linhas 101-121 (a função `lerConteudoDoTexto` inteira) — trocar por

```ts
/** O envelope já decodificado (o codec é da sei-comum): só vale o do mesmo SEI, login e unidade. */
export function validarEnvelopeDoTexto(bruto: unknown, escopo: Escopo): ValidacaoTexto<Envelope> {
  // Gravado por uma versão mais nova do SEI Pro: não é "inválido", e esta versão não pode regravar por cima.
  if (versaoMaisNova(bruto, "seipro-favoritos", 1)) return { maisNovo: true };
  const lido = lerEnvelope(bruto);
  if (!lido) return { invalido: "o texto não está no formato dos favoritos" };
  const e = lido.envelope.escopos;
  if (e.length !== 1 || !mesmoEscopo(e[0]!.escopo, escopo)) return { invalido: "o texto é de outro usuário ou de outra unidade" };
  return { ok: lido.envelope };
}

export async function lerConteudoDoTexto(
  html: string,
  escopo: Escopo,
): Promise<{ envelope: Envelope } | { invalido: string } | { maisNovo: true }> {
  const r = await lerConteudoTexto(html);
  if ("invalido" in r) return r;
  const v = validarEnvelopeDoTexto(r.bruto, escopo);
  return "ok" in v ? { envelope: v.ok } : v;
}
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)`; tsc sem saída; biome `Found 1 warning.` sem erro; build termina na tabela "Favoritos -- build" sem linha `ERRO:`.
Run: `git status --short dist`
Expected: só ` M dist/js/favoritos/app.js` e ` M dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/assinatura.ts sei-comum/src/sincronia/textoPadraoCodec.ts sei-comum/src/sincronia/entidade.ts \
  sei-comum/tests/util.ts sei-comum/tests/verificar-sincronia-base.ts sei-comum/tests/verificar.ts \
  favoritos/src/sincronia/assinatura.ts favoritos/src/sincronia/textoPadrao.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: assinatura, codec do Texto Padrao e poda de lapides (Favoritos migram)

Nome do texto, conteudo legivel + blocos e leitura de volta saem dos Favoritos
para o sei-comum, com a assinatura estavel e a poda de lapides por prazo.
Os Favoritos usam o comum sem mudar nome, mensagens nem provas.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Trava e consentimento

**Files:**
- Create: `sei-comum/src/sincronia/trava.ts`, `sei-comum/src/sincronia/consentimento.ts`, `sei-comum/tests/verificar-trava.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/preferencias.ts:1-2,16-20,28,39`, `favoritos/src/pagina/main.ts:15-16,111-112,326-332,438-443`
- Regerar: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`, `dist/js/favoritos/opcoes.js`

**Interfaces:**
- Consumes: `Area` (`@comum/armazenamento/area`); `tique` (Task 1, `sei-comum/tests/util.ts`).
- Produces:
  - `type Travar = <T>(nome: string, fn: () => Promise<T>) => Promise<T | null>`; `type TravarEsperando = <T>(nome: string, fn: () => Promise<T>) => Promise<T>`; `type GerenteDeTravas = Pick<LockManager, "request">`.
  - `travarComLocks<T>(nome: string, fn: () => Promise<T>, locks: GerenteDeTravas | null = navigator.locks): Promise<T | null>` (null = outra aba está com a trava; `locks` null = roda direto).
  - `travarEsperando<T>(nome: string, fn: () => Promise<T>, locks?: GerenteDeTravas | null): Promise<T>`.
  - `type EstadoConsentimento = "nao-perguntado" | "ligado" | "desligado"`; `type MapaConsentimento = Record<string, "ligado" | "desligado">`.
  - `interface PortaConsentimento { estado(): Promise<EstadoConsentimento>; definir(valor: "ligado" | "desligado"): Promise<unknown>; aoMudar(cb: () => void): () => void }`.
  - `chaveConsentimento(host: string, login: string, idUnidade: string, texto?: string): string` (`host|login minúsculo|idUnidade[|texto]`).
  - `estadoConsentimento(mapa: Readonly<MapaConsentimento> | undefined, chave: string): EstadoConsentimento`.
  - `lerConsentimento(area: Area, chavePreferencias: string, campo: string, chave: string): Promise<EstadoConsentimento>`.
  - `definirConsentimento(area: Area, chavePreferencias: string, campo: string, chave: string, valor: "ligado" | "desligado"): Promise<void>` (grava só essa chave do mapa; o resto das preferências fica).
  - `consentimentoNaArea(o: { area: Area; chavePreferencias: string; campo: string; chave: string }): PortaConsentimento`.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-trava.ts`:

```ts
import { areaMemoria } from "../src/armazenamento/area";
import {
  chaveConsentimento,
  consentimentoNaArea,
  definirConsentimento,
  estadoConsentimento,
  lerConsentimento,
} from "../src/sincronia/consentimento";
import { type GerenteDeTravas, travarComLocks, travarEsperando } from "../src/sincronia/trava";
import { checar, secao, tique } from "./util";

/** Web Locks de mentira: uma fila por nome; `ifAvailable` devolve lock null se alguém está com ela. */
function locksFalsos(): GerenteDeTravas {
  const ocupados = new Set<string>();
  const caudas = new Map<string, Promise<void>>();
  const adquirir = (nome: string, fn: (lock: unknown) => Promise<unknown>) => {
    const antes = caudas.get(nome) ?? Promise.resolve();
    let soltar: () => void = () => undefined;
    const minha = new Promise<void>((ok) => {
      soltar = ok;
    });
    caudas.set(
      nome,
      antes.then(() => minha),
    );
    return antes.then(async () => {
      ocupados.add(nome);
      try {
        return await fn({ name: nome });
      } finally {
        ocupados.delete(nome);
        soltar();
      }
    });
  };
  return {
    request(nome: string, a: unknown, b?: unknown) {
      const fn = (typeof a === "function" ? a : b) as (lock: unknown) => Promise<unknown>;
      const opcoes = (typeof a === "function" ? {} : a) as { ifAvailable?: boolean };
      if (opcoes.ifAvailable && ocupados.has(nome)) return Promise.resolve(fn(null));
      return adquirir(nome, fn);
    },
  } as unknown as GerenteDeTravas;
}

export async function verificarTravaEConsentimento(): Promise<void> {
  secao("trava: SEI em HTTP (sem Web Locks)");
  checar("sem locks, roda direto", (await travarComLocks("t", async () => 7, null)) === 7);
  checar("esperando, sem locks, tambem roda", (await travarEsperando("t", async () => 8, null)) === 8);

  secao("trava: com Web Locks");
  const locks = locksFalsos();
  let soltar: () => void = () => undefined;
  const ordem: string[] = [];
  const primeira = travarComLocks(
    "seipro-teste-sync|k",
    () =>
      new Promise<string>((ok) => {
        ordem.push("rodada");
        soltar = () => ok("feito");
      }),
    locks,
  );
  await tique();
  let rodouSegunda = false;
  const segunda = await travarComLocks(
    "seipro-teste-sync|k",
    async () => {
      rodouSegunda = true;
      return 1;
    },
    locks,
  );
  checar("outra aba com a trava: devolve null e nao roda", segunda === null && !rodouSegunda);
  checar("outro nome nao espera", (await travarComLocks("seipro-teste-sync|outra", async () => 2, locks)) === 2);
  const apagar = travarEsperando(
    "seipro-teste-sync|k",
    async () => {
      ordem.push("apagar");
      return true;
    },
    locks,
  );
  await tique();
  checar("esperando: so roda depois da rodada em curso", ordem.join() === "rodada");
  soltar();
  checar("e entao roda", (await primeira) === "feito" && (await apagar) === true && ordem.join() === "rodada,apagar");
  checar("livre de novo", (await travarComLocks("seipro-teste-sync|k", async () => 3, locks)) === 3);

  secao("consentimento: chave por SEI, login, unidade (e texto)");
  checar("formato dos Favoritos", chaveConsentimento("sei.x.gov.br", " Pedro.Soares ", "110") === "sei.x.gov.br|pedro.soares|110");
  checar("com o texto (Projetos)", chaveConsentimento("sei.x.gov.br", "pedro", "110", "eu") === "sei.x.gov.br|pedro|110|eu");
  checar("sem nada gravado: nao perguntado", estadoConsentimento(undefined, "k") === "nao-perguntado");
  checar("do mapa", estadoConsentimento({ k: "ligado" }, "k") === "ligado");

  secao("consentimento: na area de preferencias");
  const area = areaMemoria({ "teste/preferencias": { recolhido: true } });
  const k = chaveConsentimento("sei.x.gov.br", "pedro", "110", "unidade");
  await definirConsentimento(area, "teste/preferencias", "textoPadrao", k, "ligado");
  const prefs = (await area.obter("teste/preferencias"))["teste/preferencias"] as {
    recolhido?: boolean;
    textoPadrao?: Record<string, string>;
  };
  checar("grava so a chave e mantem as outras preferencias", prefs.recolhido === true && prefs.textoPadrao?.[k] === "ligado", prefs);
  checar("le de volta", (await lerConsentimento(area, "teste/preferencias", "textoPadrao", k)) === "ligado");
  const outras = [
    chaveConsentimento("sei.x.gov.br", "pedro", "110", "eu"),
    chaveConsentimento("sei.x.gov.br", "pedro", "111", "unidade"),
    chaveConsentimento("sei.x.gov.br", "ana", "110", "unidade"),
    chaveConsentimento("sei.y.gov.br", "pedro", "110", "unidade"),
  ];
  const estados = await Promise.all(outras.map((c) => lerConsentimento(area, "teste/preferencias", "textoPadrao", c)));
  checar(
    "outro texto, unidade, login ou SEI nao herda o ligado",
    estados.every((e) => e === "nao-perguntado"),
    estados,
  );
  const lixo = areaMemoria({ "teste/preferencias": "corrompido" });
  checar(
    "preferencias corrompidas: nao perguntado",
    (await lerConsentimento(lixo, "teste/preferencias", "textoPadrao", k)) === "nao-perguntado",
  );

  secao("consentimento: porta");
  const porta = consentimentoNaArea({ area, chavePreferencias: "teste/preferencias", campo: "textoPadrao", chave: k });
  let avisos = 0;
  const parar = porta.aoMudar(() => {
    avisos++;
  });
  await area.gravar({ "outra/chave": 1 });
  checar("mudanca em outra chave nao avisa", avisos === 0);
  await porta.definir("desligado");
  checar("definir avisa e grava", avisos === 1 && (await porta.estado()) === "desligado");
  parar();
  await porta.definir("ligado");
  checar("depois de parar, nao avisa mais", avisos === 1);
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarTravaEConsentimento } from "./verificar-trava";` logo depois de `import { verificarSincroniaBase } from "./verificar-sincronia-base";`, e `await verificarTravaEConsentimento();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/consentimento'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/trava.ts`:

```ts
/**
 * Uma aba sincroniza por vez: Web Locks, quando a página tem. O SEI servido
 * por HTTP não tem (não é contexto seguro): aí a função roda direto e quem
 * protege é a comparação de conteúdo do motor (conteúdo igual não é regravado).
 */

export type Travar = <T>(nome: string, fn: () => Promise<T>) => Promise<T | null>;
export type TravarEsperando = <T>(nome: string, fn: () => Promise<T>) => Promise<T>;
export type GerenteDeTravas = Pick<LockManager, "request">;

function locksDaPagina(): GerenteDeTravas | null {
  return (globalThis.navigator as (Navigator & { locks?: LockManager }) | undefined)?.locks ?? null;
}

/** Roda `fn` com a trava; devolve null se outra aba já está com ela. `locks: null` = página sem Web Locks. */
export function travarComLocks<T>(nome: string, fn: () => Promise<T>, locks: GerenteDeTravas | null = locksDaPagina()): Promise<T | null> {
  if (!locks) return fn();
  return locks.request(nome, { ifAvailable: true }, async (lock): Promise<T | null> => (lock ? fn() : null)) as Promise<T | null>;
}

/** A mesma trava, esperando a vez (o "apagar do SEI" nunca pode ser pulado). */
export function travarEsperando<T>(nome: string, fn: () => Promise<T>, locks: GerenteDeTravas | null = locksDaPagina()): Promise<T> {
  if (!locks) return fn();
  return locks.request(nome, () => fn()) as Promise<T>;
}
```

Criar `sei-comum/src/sincronia/consentimento.ts`:

```ts
/**
 * Consentimento da sincronia por Texto Padrão: de cada PESSOA em cada UNIDADE
 * de cada SEI (`host|login|idUnidade`), porque o texto fica visível para aquela
 * unidade. Ligar numa unidade não liga nas outras, e outro usuário do SEI no
 * mesmo perfil do navegador não herda o "ligado". Módulo com mais de um texto
 * por unidade (Projetos: o da unidade e o pessoal) acrescenta o texto à chave.
 *
 * O mapa mora num campo do objeto de preferências do módulo (os Favoritos usam
 * `textoPadraoUnidades` em `favoritos/preferencias`, no storage.sync).
 */

import type { Area } from "../armazenamento/area";

export type EstadoConsentimento = "nao-perguntado" | "ligado" | "desligado";
export type MapaConsentimento = Record<string, "ligado" | "desligado">;

/** A porta que o controle da página usa: o módulo decide onde o consentimento mora. */
export interface PortaConsentimento {
  estado(): Promise<EstadoConsentimento>;
  definir(valor: "ligado" | "desligado"): Promise<unknown>;
  /** Avisa quando o consentimento PODE ter mudado (quem ouve relê o estado). */
  aoMudar(cb: () => void): () => void;
}

export function chaveConsentimento(host: string, login: string, idUnidade: string, texto?: string): string {
  const base = `${host}|${login.trim().toLowerCase()}|${idUnidade}`;
  return texto ? `${base}|${texto}` : base;
}

export function estadoConsentimento(mapa: Readonly<MapaConsentimento> | undefined, chave: string): EstadoConsentimento {
  return mapa?.[chave] ?? "nao-perguntado";
}

type Objeto = Record<string, unknown>;
const objeto = (v: unknown): Objeto => (v && typeof v === "object" && !Array.isArray(v) ? (v as Objeto) : {});

export async function lerConsentimento(area: Area, chavePreferencias: string, campo: string, chave: string): Promise<EstadoConsentimento> {
  const prefs = objeto((await area.obter(chavePreferencias))[chavePreferencias]);
  return estadoConsentimento(objeto(prefs[campo]) as MapaConsentimento, chave);
}

/** Grava só esta chave do mapa; o resto das preferências fica como estava. */
export async function definirConsentimento(
  area: Area,
  chavePreferencias: string,
  campo: string,
  chave: string,
  valor: "ligado" | "desligado",
): Promise<void> {
  const prefs = objeto((await area.obter(chavePreferencias))[chavePreferencias]);
  await area.gravar({ [chavePreferencias]: { ...prefs, [campo]: { ...objeto(prefs[campo]), [chave]: valor } } });
}

export function consentimentoNaArea(o: { area: Area; chavePreferencias: string; campo: string; chave: string }): PortaConsentimento {
  return {
    estado: () => lerConsentimento(o.area, o.chavePreferencias, o.campo, o.chave),
    definir: (valor) => definirConsentimento(o.area, o.chavePreferencias, o.campo, o.chave, valor),
    aoMudar: (cb) =>
      o.area.aoMudar((m) => {
        if (o.chavePreferencias in m) cb();
      }),
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `220 ok, 0 falha(s)`; tsc sem saída; biome sem erro (`Found 8 warnings.`).

- [ ] **Step 5: Migrar os Favoritos**

Em `favoritos/src/preferencias.ts`:

(a) linhas 1-2 — trocar

```ts
import type { Area } from "@comum/armazenamento/area";
import { CHAVE_PREFERENCIAS } from "./modelo/constantes";
```

por

```ts
import type { Area } from "@comum/armazenamento/area";
import { chaveConsentimento, estadoConsentimento } from "@comum/sincronia/consentimento";
import { CHAVE_PREFERENCIAS } from "./modelo/constantes";
```

(b) linhas 16-20 — trocar

```ts
/**
 * O consentimento é de cada pessoa em cada unidade: o texto fica visível para ELA, ligar numa não liga
 * nas outras, e outro usuário do SEI no mesmo perfil do navegador não herda o "ligado".
 */
const chaveTP = (host: string, login: string, idUnidade: string) => `${host}|${login.trim().toLowerCase()}|${idUnidade}`;
```

por

```ts
/**
 * O consentimento é de cada pessoa em cada unidade: o texto fica visível para ELA, ligar numa não liga
 * nas outras, e outro usuário do SEI no mesmo perfil do navegador não herda o "ligado".
 * A chave (`host|login|idUnidade`) é a da sei-comum (`@comum/sincronia/consentimento`).
 */
```

(c) linha 28 — trocar `  return p.textoPadraoUnidades?.[chaveTP(host, login, idUnidade)] ?? "nao-perguntado";` por

```ts
  return estadoConsentimento(p.textoPadraoUnidades, chaveConsentimento(host, login, idUnidade));
```

(d) linha 39 — trocar `  return gravarPreferencias(sync, { textoPadraoUnidades: { ...(p.textoPadraoUnidades ?? {}), [chaveTP(host, login, idUnidade)]: valor } });` por

```ts
  return gravarPreferencias(sync, {
    textoPadraoUnidades: { ...(p.textoPadraoUnidades ?? {}), [chaveConsentimento(host, login, idUnidade)]: valor },
  });
```

Em `favoritos/src/pagina/main.ts`:

(a) linhas 15-16 — trocar

```ts
import { criarRpc, ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import cssBase from "@comum/ui/base.css";
```

por

```ts
import { criarRpc, ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import { travarComLocks, travarEsperando } from "@comum/sincronia/trava";
import cssBase from "@comum/ui/base.css";
```

(b) linhas 111-112 — trocar

```ts
          travar: travarComLocks,
          travarEsperando: travarEsperandoComLocks,
```

por

```ts
          travar: travarComLocks,
          travarEsperando,
```

(c) apagar as linhas 326-332 (a função local e a linha em branco depois dela):

```ts
/** Uma aba sincroniza por vez (Web Locks; o SEI em HTTP não tem: aí vale a comparação de conteúdo do motor). */
function travarComLocks<T>(nome: string, fn: () => Promise<T>): Promise<T | null> {
  const locks = (navigator as Navigator & { locks?: LockManager }).locks;
  if (!locks) return fn();
  return locks.request(nome, { ifAvailable: true }, async (lock): Promise<T | null> => (lock ? fn() : null)) as Promise<T | null>;
}

```

(d) apagar o fim do arquivo, linhas 437-443 (a linha em branco antes e a função):

```ts

/** A mesma trava, esperando a vez (para o "apagar do SEI" nunca ser pulado). */
function travarEsperandoComLocks<T>(nome: string, fn: () => Promise<T>): Promise<T> {
  const locks = (navigator as Navigator & { locks?: LockManager }).locks;
  if (!locks) return fn();
  return locks.request(nome, () => fn()) as Promise<T>;
}
```

(o arquivo passa a terminar no `}` de `instalarDocumentosFavoritos`).

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)`; tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: ` M` só em `dist/js/favoritos/app.js`, `dist/js/favoritos/opcoes.js`, `dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/trava.ts sei-comum/src/sincronia/consentimento.ts sei-comum/tests/verificar-trava.ts sei-comum/tests/verificar.ts \
  favoritos/src/preferencias.ts favoritos/src/pagina/main.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: trava e consentimento da sincronia (Favoritos migram)

Web Locks com recuo para SEI em HTTP e consentimento por SEI, login, unidade
(e texto, para modulos com mais de um Texto Padrao) no sei-comum. Os Favoritos
usam a mesma chave de sempre.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Motor genérico do Texto Padrão, com releitura antes de gravar

**Files:**
- Create: `sei-comum/src/sincronia/motor.ts`, `sei-comum/tests/adaptadorTeste.ts`, `sei-comum/tests/verificar-motor.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/sincronia/motor.ts` (reescrever: fachada + adaptador)
- Regerar: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `gerarConteudoTexto`, `lerConteudoTexto`, `ValidacaoTexto<E>`, `versaoMaisNova` (Task 1); `assinaturaEstavel`, `porId` (Task 1); `purgarLapides`, `vence` (`@comum/sincronia/entidade`); `Travar` (Task 2); `Area`.
- Produces:
  - `interface StatusSync { estado: "ok" | "erro" | "indisponivel" | "nunca"; quando: number; ultimoOk?: number; ultimoPuxar?: number; mensagem?: string; tamanho?: number; pendente: boolean; indisponivelAte?: number }` (o mesmo dos Favoritos).
  - `interface DestinoTexto { ler(): Promise<string | null>; gravar(html: string): Promise<void> }`.
  - `interface MensagensMotor { maisNovo: string; grandeDemais(kb: number, tetoKb: number): string; pertoDoTeto(kb: number): string; invalidoRegravado(motivo: string): string; mudouDuranteGravacao: string }`; `MENSAGENS_MOTOR: MensagensMotor`.
  - `interface AdaptadorTexto<E> { modulo: string; chaveStatus: string; teto: number; aviso: number; legivel(): string; validar(bruto: unknown): ValidacaoTexto<E>; importar(envelope: E): Promise<void>; exportar(c: { remoto: E | null; agora: number }): Promise<E>; assinatura(envelope: E): string; mensagens?: Partial<MensagensMotor> }` — a assinatura ignora quem gravou e quando; `exportar` recebe `agora` para podar lápides com o prazo do escopo (`podarLapides`).
  - `interface DepsMotorTexto<E> { adaptador: AdaptadorTexto<E>; destino: DestinoTexto; area: Area; travar: Travar; agora?: () => number; atrasoEnvio?: number /*15 s*/; intervaloPuxar?: number /*5 min*/; releituras?: number /*3; 0 desliga*/; permitido?: () => Promise<boolean> }`.
  - `nomeDaTrava(modulo: string, chaveStatus: string): string` → `seipro-<modulo>-sync|<chaveStatus>`.
  - `textoDoErro(e: unknown): { estado: StatusSync["estado"]; mensagem: string }`.
  - `class MotorTextoPadrao<E> { constructor(d: DepsMotorTexto<E>); status(): Promise<StatusSync>; marcarPendente(): Promise<void>; agendarEnvio(): Promise<void>; parar(): void; sincronizar(o?: { forcar?: boolean }): Promise<StatusSync> }`.
  - Nos Favoritos: `adaptadorFavoritos(d: Pick<DepsMotor, "repo" | "escopo" | "carimbo" | "nomeUsuario" | "chaveStatus" | "teto">): AdaptadorTexto<Envelope>`; `MotorSincronia` (mesma assinatura de antes) agora `extends MotorTextoPadrao<Envelope>` com `releituras: 0`; `DestinoSync = DestinoTexto`.

Regra da releitura (o que as provas fixam): ler → validar → importar → exportar → (igual à assinatura remota: termina sem gravar) → teto → **ler de novo**; se o texto mudou (comparação do HTML), volta ao começo com o texto novo; na 3.ª releitura que ainda achar mudança, não grava, deixa `pendente: true` e a mensagem `mudouDuranteGravacao`; senão confere `permitido` e grava.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/adaptadorTeste.ts` (o módulo de mentira que as Tasks 4 e 6 também usam):

```ts
/**
 * Um módulo de mentira para as provas da sincronia genérica: itens
 * versionados num Map (o "repositório"), o envelope
 * `{ formato: "teste", versao: 1, dono, itens }` e a mesclagem de verdade
 * (`vence`) da sei-comum.
 */

import { assinaturaEstavel, porId } from "../src/sincronia/assinatura";
import { purgarLapides, type Versionada, vence } from "../src/sincronia/entidade";
import type { AdaptadorTexto } from "../src/sincronia/motor";
import { gerarConteudoTexto, lerConteudoTexto, versaoMaisNova } from "../src/sincronia/textoPadraoCodec";

export interface ItemTeste extends Versionada {
  valor: string;
}

export interface EnvTeste {
  formato: "teste";
  versao: number;
  dono: string;
  itens: ItemTeste[];
}

export interface RepoTeste {
  itens: Map<string, ItemTeste>;
  por(id: string, valor: string, quando: number, dispositivo?: string): void;
  remover(id: string, quando: number): void;
  importar(env: EnvTeste): void;
  aoMudar(cb: () => void): () => void;
}

export function repoTeste(): RepoTeste {
  const itens = new Map<string, ItemTeste>();
  const ouvintes = new Set<() => void>();
  const avisar = () => {
    for (const o of [...ouvintes]) o();
  };
  return {
    itens,
    por(id, valor, quando, dispositivo = "A") {
      itens.set(id, { id, valor, atualizadoEm: quando, dispositivo });
      avisar();
    },
    remover(id, quando) {
      const i = itens.get(id);
      if (!i) return;
      itens.set(id, { ...i, atualizadoEm: quando, removidoEm: quando });
      avisar();
    },
    importar(env) {
      let mudou = false;
      for (const i of env.itens) {
        const atual = itens.get(i.id);
        if (!atual || vence(i, atual)) {
          itens.set(i.id, i);
          mudou = true;
        }
      }
      if (mudou) avisar();
    },
    aoMudar(cb) {
      ouvintes.add(cb);
      return () => {
        ouvintes.delete(cb);
      };
    },
  };
}

export function adaptadorTeste(
  repo: RepoTeste,
  o: { dono?: string; teto?: number; aviso?: number; chaveStatus?: string; diasLapide?: number } = {},
): AdaptadorTexto<EnvTeste> {
  const dono = o.dono ?? "pedro";
  return {
    modulo: "teste",
    chaveStatus: o.chaveStatus ?? "teste/sync/tp/a",
    teto: o.teto ?? 100 * 1024,
    aviso: o.aviso ?? 80 * 1024,
    legivel: () => "Dados internos do SEI Pro (teste). Não edite.",
    validar(bruto) {
      if (versaoMaisNova(bruto, "teste", 1)) return { maisNovo: true };
      const b = bruto as Partial<EnvTeste> | null;
      if (b?.formato !== "teste" || b.versao !== 1 || !Array.isArray(b.itens)) return { invalido: "não é do módulo de teste" };
      if (b.dono !== dono) return { invalido: "é de outro dono" };
      return { ok: b as EnvTeste };
    },
    async importar(env) {
      repo.importar(env);
    },
    async exportar({ agora }) {
      const itens = [...repo.itens.values()];
      return { formato: "teste", versao: 1, dono, itens: o.diasLapide === undefined ? itens : purgarLapides(itens, agora, o.diasLapide) };
    },
    assinatura: (env) => assinaturaEstavel({ dono: env.dono, itens: porId(env.itens) }),
  };
}

/** O texto que outro computador (ou um colega) gravaria com estes itens. */
export function textoDeOutro(itens: ItemTeste[], dono = "pedro", versao = 1): Promise<string> {
  return gerarConteudoTexto("Dados internos do SEI Pro (teste).", { formato: "teste", versao, dono, itens });
}

/** Os itens guardados num texto (vazio se o texto não é do módulo de teste). */
export async function itensDoTexto(html: string | null): Promise<ItemTeste[]> {
  if (html === null) return [];
  const r = await lerConteudoTexto(html);
  return "bruto" in r ? ((r.bruto as EnvTeste).itens ?? []) : [];
}

export const item = (id: string, quando: number, dispositivo = "B", removido = false): ItemTeste => ({
  id,
  valor: id,
  atualizadoEm: quando,
  dispositivo,
  ...(removido ? { removidoEm: quando } : {}),
});

/** O Texto Padrão "no SEI": conta leituras e gravações; `aoLer` muda o texto como outra pessoa faria. */
export function destinoTeste(inicial: string | null = null) {
  const d = {
    html: inicial,
    lidas: 0,
    gravadas: 0,
    aoLer: undefined as ((n: number) => Promise<void> | void) | undefined,
    erro: undefined as { codigo: string; message: string } | undefined,
    async ler(): Promise<string | null> {
      d.lidas++;
      await d.aoLer?.(d.lidas);
      if (d.erro) throw Object.assign(new Error(d.erro.message), { codigo: d.erro.codigo });
      return d.html;
    },
    async gravar(html: string): Promise<void> {
      d.gravadas++;
      d.html = html;
    },
  };
  return d;
}
```

Criar `sei-comum/tests/verificar-motor.ts`:

```ts
import { areaMemoria } from "../src/armazenamento/area";
import { MotorTextoPadrao, nomeDaTrava, type StatusSync, textoDoErro } from "../src/sincronia/motor";
import { adaptadorTeste, destinoTeste, type EnvTeste, item, itensDoTexto, repoTeste, textoDeOutro } from "./adaptadorTeste";
import { checar, secao, tique } from "./util";

const DIA = 86_400_000;

function montar(
  o: {
    remoto?: string | null;
    teto?: number;
    aviso?: number;
    releituras?: number;
    intervaloPuxar?: number;
    diasLapide?: number;
    agora?: number;
    permitido?: () => Promise<boolean>;
  } = {},
) {
  const area = areaMemoria();
  const repo = repoTeste();
  const destino = destinoTeste(o.remoto ?? null);
  let agora = o.agora ?? 10_000_000;
  let ocupado = false;
  const travas: string[] = [];
  const motor = new MotorTextoPadrao<EnvTeste>({
    adaptador: adaptadorTeste(repo, { teto: o.teto, aviso: o.aviso, diasLapide: o.diasLapide }),
    destino,
    area,
    travar: async (nome, fn) => {
      travas.push(nome);
      return ocupado ? null : fn();
    },
    agora: () => agora,
    atrasoEnvio: 10,
    releituras: o.releituras,
    intervaloPuxar: o.intervaloPuxar,
    permitido: o.permitido,
  });
  return {
    area,
    repo,
    destino,
    motor,
    travas,
    avancar: (ms: number) => {
      agora += ms;
    },
    ocupar: (v: boolean) => {
      ocupado = v;
    },
  };
}

const ids = (l: Array<{ id: string }>) =>
  l
    .map((i) => i.id)
    .sort()
    .join();

export async function verificarMotorTexto(): Promise<void> {
  secao("motor generico: primeira rodada e intervalo");
  const m = montar();
  m.repo.por("a1", "um", 100);
  const s1 = await m.motor.sincronizar();
  checar(
    "sem texto no SEI: cria (e rele uma vez antes de gravar)",
    m.destino.gravadas === 1 && m.destino.lidas === 2 && s1.estado === "ok" && !s1.pendente,
    { s1, lidas: m.destino.lidas },
  );
  await m.motor.sincronizar();
  checar("logo depois, sem mudanca: nem le", m.destino.lidas === 2);
  m.avancar(6 * 60_000);
  await m.motor.sincronizar();
  checar("depois de 5 min le, e sem diferenca nao rele nem regrava", m.destino.lidas === 3 && m.destino.gravadas === 1);
  const mi = montar({ intervaloPuxar: 2 * 60_000 });
  await mi.motor.sincronizar();
  const antes = mi.destino.lidas;
  mi.avancar(3 * 60_000);
  await mi.motor.sincronizar();
  checar("intervalo configuravel (2 min): puxa de novo depois de 3 min", mi.destino.lidas > antes);
  checar(
    "trava por texto: seipro-<modulo>-sync|<chave de status> (o nome dos Favoritos nao muda)",
    m.travas[0] === "seipro-teste-sync|teste/sync/tp/a" && nomeDaTrava("favoritos", "k") === "seipro-favoritos-sync|k",
    m.travas,
  );

  secao("motor generico: mescla e releitura antes de gravar");
  const m2 = montar({ remoto: await textoDeOutro([item("b1", 50)]) });
  m2.repo.por("a1", "um", 100);
  m2.destino.aoLer = async (n) => {
    if (n === 2) m2.destino.html = await textoDeOutro([item("b1", 50), item("b2", 60)]);
  };
  await m2.motor.sincronizar();
  checar(
    "o colega gravou entre a leitura e a gravacao: a nova versao entra na mescla",
    m2.repo.itens.has("b2") && ids(await itensDoTexto(m2.destino.html)) === "a1,b1,b2",
    await itensDoTexto(m2.destino.html),
  );
  checar("e grava uma vez so, depois de reler de novo", m2.destino.gravadas === 1 && m2.destino.lidas === 3, m2.destino);
  const m3 = montar({ remoto: await textoDeOutro([item("b1", 50)]) });
  m3.repo.por("a1", "um", 100);
  const lista: ReturnType<typeof item>[] = [];
  m3.destino.aoLer = async (n) => {
    lista.push(item(`b${n}`, 50 + n));
    m3.destino.html = await textoDeOutro([...lista]);
  };
  const s3 = await m3.motor.sincronizar();
  checar(
    "texto mudando a cada leitura: depois de 3 releituras nao grava por cima e fica pendente",
    m3.destino.gravadas === 0 && m3.destino.lidas === 4 && s3.estado === "erro" && s3.pendente && /mudou/.test(s3.mensagem ?? ""),
    s3,
  );
  checar("o que o colega gravou ate a ultima mescla ja esta aqui", m3.repo.itens.has("b3"));
  m3.destino.aoLer = undefined;
  const s3b = await m3.motor.sincronizar();
  checar(
    "na rodada seguinte, com o texto parado, grava tudo",
    s3b.estado === "ok" && ids(await itensDoTexto(m3.destino.html)) === "a1,b1,b2,b3,b4",
    await itensDoTexto(m3.destino.html),
  );
  const m4 = montar({ releituras: 0 });
  m4.repo.por("a1", "um", 100);
  await m4.motor.sincronizar();
  checar("releituras: 0 le uma vez so (o modo dos Favoritos)", m4.destino.lidas === 1 && m4.destino.gravadas === 1);
  const m5 = montar({ remoto: await textoDeOutro([item("b1", 50)]) });
  await m5.motor.sincronizar();
  checar("igual depois de mesclar: nao regrava", m5.destino.gravadas === 0 && m5.repo.itens.has("b1"));

  secao("motor generico: texto invalido, mais novo, teto, aviso e permissao");
  const m6 = montar({ remoto: "<p>Um colega apagou tudo e escreveu isto</p>" });
  m6.repo.por("a1", "um", 100);
  const s6 = await m6.motor.sincronizar();
  checar(
    "invalido: regrava a partir do local e avisa",
    m6.destino.gravadas === 1 && s6.estado === "ok" && /regrav/.test(s6.mensagem ?? ""),
    s6,
  );
  checar("nada local some", m6.repo.itens.has("a1"));
  const m7 = montar({ remoto: await textoDeOutro([item("x", 1)], "maria") });
  m7.repo.por("a1", "um", 100);
  const s7 = await m7.motor.sincronizar();
  checar(
    "texto de outro escopo: invalido, com o motivo na mensagem",
    m7.destino.gravadas === 1 && /outro dono/.test(s7.mensagem ?? ""),
    s7,
  );
  const m8 = montar({ remoto: await textoDeOutro([], "pedro", 2) });
  m8.repo.por("a1", "um", 100);
  const s8 = await m8.motor.sincronizar();
  checar(
    "versao mais nova: nao toca e pede para atualizar",
    m8.destino.gravadas === 0 && s8.estado === "erro" && /mais nova/.test(s8.mensagem ?? ""),
    s8,
  );
  const m9 = montar({ teto: 100 });
  m9.repo.por("a1", "um", 100);
  const s9 = await m9.motor.sincronizar();
  checar(
    "acima do teto: nao grava e explica",
    m9.destino.gravadas === 0 && s9.estado === "erro" && /grandes demais/.test(s9.mensagem ?? ""),
    s9,
  );
  const m10 = montar({ aviso: 10 });
  m10.repo.por("a1", "um", 100);
  const s10 = await m10.motor.sincronizar();
  checar("acima do aviso: grava e avisa", m10.destino.gravadas === 1 && /perto do limite/.test(s10.mensagem ?? ""), s10);
  const m11 = montar({ permitido: async () => false });
  m11.repo.por("a1", "um", 100);
  const s11 = await m11.motor.sincronizar();
  checar("desligado no meio da rodada: nao grava", m11.destino.gravadas === 0 && s11.estado === "nunca" && !s11.pendente, s11);

  secao("motor generico: erros, trava e envio agendado");
  const m12 = montar();
  m12.destino.erro = { codigo: "SEI_SESSAO_EXPIRADA", message: "Sessão expirada" };
  await m12.motor.marcarPendente();
  const s12 = await m12.motor.sincronizar();
  checar("sessao expirada: erro, pendencia mantida", s12.estado === "erro" && s12.pendente && /Sess/.test(s12.mensagem ?? ""), s12);
  const m13 = montar();
  m13.destino.erro = { codigo: "SEI_ACAO_INDISPONIVEL", message: "sem menu" };
  const s13 = await m13.motor.sincronizar();
  checar("sem permissao de Texto Padrao: indisponivel", s13.estado === "indisponivel" && (s13.indisponivelAte ?? 0) > 0, s13);
  m13.avancar(60 * 60_000);
  await m13.motor.sincronizar();
  checar("e nao tenta de novo no mesmo dia", m13.destino.lidas === 1);
  await m13.motor.sincronizar({ forcar: true });
  checar("salvo se o usuario pedir", m13.destino.lidas === 2);
  checar("erro qualquer: a mensagem dele", textoDoErro(new Error("falhou")).mensagem === "falhou");
  const m14 = montar();
  m14.ocupar(true);
  await m14.motor.sincronizar({ forcar: true });
  checar("outra aba sincronizando: esta nao faz nada", m14.destino.lidas === 0);
  m14.ocupar(false);
  void m14.motor.agendarEnvio();
  await m14.motor.agendarEnvio();
  checar(
    "mudanca local marca pendente na hora",
    ((await m14.area.obter("teste/sync/tp/a"))["teste/sync/tp/a"] as StatusSync | undefined)?.pendente === true,
  );
  await tique(60);
  checar("duas mudancas seguidas: um envio so", m14.destino.gravadas === 1 && m14.destino.lidas === 2, m14.destino);

  secao("motor generico: lapides com prazo por escopo");
  const agora = 400 * DIA;
  const remotoVivo = await textoDeOutro([item("x", agora - 130 * DIA)]);
  const u = montar({ remoto: remotoVivo, diasLapide: 180, agora });
  u.repo.por("x", "x", agora - 200 * DIA);
  u.repo.remover("x", agora - 120 * DIA);
  await u.motor.sincronizar();
  const noTexto = (await itensDoTexto(u.destino.html)).find((i) => i.id === "x");
  checar("unidade (180 dias): a lapide de 120 dias vai no texto", noTexto?.removidoEm === agora - 120 * DIA, noTexto);
  const outro = repoTeste();
  outro.por("x", "x", agora - 130 * DIA, "B");
  outro.importar({ formato: "teste", versao: 1, dono: "pedro", itens: await itensDoTexto(u.destino.html) });
  checar("e o computador que ainda tinha o item vivo recebe a remocao (nao ressuscita)", outro.itens.get("x")?.removidoEm !== undefined);
  const p = montar({ remoto: remotoVivo, diasLapide: 90, agora });
  p.repo.por("x", "x", agora - 200 * DIA);
  p.repo.remover("x", agora - 120 * DIA);
  await p.motor.sincronizar();
  checar(
    "pessoal (90 dias): a mesma lapide ja nao viaja",
    !(await itensDoTexto(p.destino.html)).some((i) => i.id === "x"),
    await itensDoTexto(p.destino.html),
  );
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarMotorTexto } from "./verificar-motor";` logo depois de `import { verificarMenu } from "./verificar-menu";`, e `await verificarMotorTexto();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/motor'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/motor.ts`:

```ts
/**
 * Motor genérico da sincronia de UM Texto Padrão (um escopo de um módulo):
 * puxar → validar → mesclar → (se mudou) reler → gravar. O módulo entra por um
 * adaptador (envelope, mesclagem, assinatura, teto, mensagens). A mesclagem é
 * a do módulo (vence a versão mais recente de cada entidade, com lápides), então
 * a rodada pode se repetir sem medo, em qualquer aba e em qualquer ordem.
 *
 * - Puxa no máximo a cada `intervaloPuxar` (5 min), salvo pendência local ou pedido do usuário.
 * - Mudança local marca "pendente" NA HORA (persistido: se a página fechar, a
 *   próxima carga envia) e envia `atrasoEnvio` (15 s) depois da última.
 * - Texto inválido (editado à mão, corrompido, de outro escopo) nunca apaga
 *   nada: é regravado a partir do local. De versão mais nova: não é tocado.
 * - Acima do teto não grava (e explica); acima do aviso grava e avisa.
 * - Sem permissão de Texto Padrão: "indisponível", e não insiste por um dia.
 * - Releitura: logo antes de gravar, lê de novo. Se outra pessoa (o texto da
 *   unidade é de todos) ou outro computador gravou no meio, mescla de novo e
 *   recalcula, até `releituras` vezes (3). Esgotado, não grava e fica
 *   pendente: a próxima rodada tenta de novo, e ninguém perde o que gravou.
 *   `releituras: 0` desliga (os Favoritos: um texto por pessoa).
 * - Uma trava por texto (Web Locks, quando a página tem) evita duas abas
 *   juntas; e o conteúdo igual ao remoto não é regravado.
 */

import type { Area } from "../armazenamento/area";
import { gerarConteudoTexto, lerConteudoTexto, type ValidacaoTexto } from "./textoPadraoCodec";
import type { Travar } from "./trava";

export interface StatusSync {
  estado: "ok" | "erro" | "indisponivel" | "nunca";
  /** Última tentativa. */
  quando: number;
  ultimoOk?: number;
  ultimoPuxar?: number;
  mensagem?: string;
  /** Bytes do último conteúdo gravado ou lido. */
  tamanho?: number;
  /** Há mudança local ainda não enviada. */
  pendente: boolean;
  indisponivelAte?: number;
}

export interface DestinoTexto {
  ler(): Promise<string | null>;
  gravar(html: string): Promise<void>;
}

export interface MensagensMotor {
  maisNovo: string;
  grandeDemais(kb: number, tetoKb: number): string;
  pertoDoTeto(kb: number): string;
  invalidoRegravado(motivo: string): string;
  mudouDuranteGravacao: string;
}

export const MENSAGENS_MOTOR: MensagensMotor = {
  maisNovo:
    "Os dados no SEI foram gravados por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o texto não foi alterado.",
  grandeDemais: (kb, tetoKb) => `Os dados ficaram grandes demais para o Texto Padrão (${kb} KB de ${tetoKb} KB).`,
  pertoDoTeto: (kb) => `Os dados estão perto do limite do Texto Padrão (${kb} KB).`,
  invalidoRegravado: (motivo) => `O texto no SEI estava inválido (${motivo}) e foi regravado a partir deste computador.`,
  mudouDuranteGravacao: "O texto no SEI mudou enquanto era gravado (outra pessoa sincronizando). Nova tentativa na próxima rodada.",
};

/** O que o módulo ensina ao motor. Um adaptador por texto (escopo). */
export interface AdaptadorTexto<E> {
  /** Nome do módulo: a trava é `seipro-<modulo>-sync|<chaveStatus>`. */
  modulo: string;
  /** Onde o StatusSync deste texto fica na área local. */
  chaveStatus: string;
  /** Tamanho máximo do conteúdo (bytes do HTML): acima, não grava. */
  teto: number;
  /** Acima disto grava, mas avisa. */
  aviso: number;
  /** O parágrafo legível que abre o texto. */
  legivel(): string;
  /** O JSON lido do texto: envelope bom, inválido (motivo) ou de versão mais nova. */
  validar(bruto: unknown): ValidacaoTexto<E>;
  /** Mescla no armazenamento local (vence o mais recente; lápides valem). */
  importar(envelope: E): Promise<void>;
  /** O envelope a gravar. `remoto`: o que o texto tem agora (null se não há ou é inválido); `agora`: para podar lápides. */
  exportar(c: { remoto: E | null; agora: number }): Promise<E>;
  /** Igual para o mesmo conteúdo em qualquer computador (sem quem gravou nem quando). */
  assinatura(envelope: E): string;
  mensagens?: Partial<MensagensMotor>;
}

export interface DepsMotorTexto<E> {
  adaptador: AdaptadorTexto<E>;
  destino: DestinoTexto;
  /** Área local (o StatusSync). */
  area: Area;
  /** Roda `fn` com a trava; devolve null se outra aba já está com ela. */
  travar: Travar;
  agora?: () => number;
  /** Envio depois da última mudança local (15 s). */
  atrasoEnvio?: number;
  /** Intervalo mínimo entre duas puxadas sem pendência (5 min). */
  intervaloPuxar?: number;
  /** Releituras antes de gravar (3); 0 desliga. */
  releituras?: number;
  /** Ainda pode gravar? (O usuário pode ter desligado durante a rodada.) */
  permitido?: () => Promise<boolean>;
}

const CINCO_MIN = 5 * 60_000;
const UM_DIA = 86_400_000;

export const nomeDaTrava = (modulo: string, chaveStatus: string): string => `seipro-${modulo}-sync|${chaveStatus}`;

export function textoDoErro(e: unknown): { estado: StatusSync["estado"]; mensagem: string } {
  const codigo = (e as { codigo?: string } | null)?.codigo;
  if (codigo === "SEI_SESSAO_EXPIRADA") return { estado: "erro", mensagem: "Sessão do SEI expirada. Entre de novo no SEI." };
  if (codigo === "SEI_ACAO_INDISPONIVEL")
    return { estado: "indisponivel", mensagem: "Indisponível nesta unidade: o SEI não oferece Textos Padrão para você aqui." };
  return { estado: "erro", mensagem: e instanceof Error ? e.message : String(e) };
}

export class MotorTextoPadrao<E> {
  private espera: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly d: DepsMotorTexto<E>) {}

  private agora(): number {
    return this.d.agora?.() ?? Date.now();
  }

  async status(): Promise<StatusSync> {
    const k = this.d.adaptador.chaveStatus;
    const v = (await this.d.area.obter(k))[k] as StatusSync | undefined;
    return v ?? { estado: "nunca", quando: 0, pendente: false };
  }

  private async gravarStatus(m: Partial<StatusSync>): Promise<StatusSync> {
    const novo = { ...(await this.status()), ...m };
    await this.d.area.gravar({ [this.d.adaptador.chaveStatus]: novo });
    return novo;
  }

  async marcarPendente(): Promise<void> {
    const s = await this.status();
    if (!s.pendente) await this.gravarStatus({ pendente: true });
  }

  /** Mudança local: pendente na hora, envio `atrasoEnvio` depois da última. */
  agendarEnvio(): Promise<void> {
    clearTimeout(this.espera);
    this.espera = setTimeout(() => void this.sincronizar({ forcar: true }).catch(() => undefined), this.d.atrasoEnvio ?? 15_000);
    return this.marcarPendente();
  }

  parar(): void {
    clearTimeout(this.espera);
  }

  async sincronizar(o: { forcar?: boolean } = {}): Promise<StatusSync> {
    const agora = this.agora();
    const s = await this.status();
    if (!o.forcar) {
      if (s.estado === "indisponivel" && (s.indisponivelAte ?? 0) > agora) return s;
      if (!s.pendente && s.ultimoPuxar && agora - s.ultimoPuxar < (this.d.intervaloPuxar ?? CINCO_MIN)) return s;
    }
    const a = this.d.adaptador;
    const feito = await this.d.travar(nomeDaTrava(a.modulo, a.chaveStatus), () => this.rodada(agora));
    return feito ?? (await this.status());
  }

  private async validar(html: string): Promise<ValidacaoTexto<E>> {
    const r = await lerConteudoTexto(html);
    return "invalido" in r ? r : this.d.adaptador.validar(r.bruto);
  }

  private async rodada(agora: number): Promise<StatusSync> {
    const a = this.d.adaptador;
    const m = { ...MENSAGENS_MOTOR, ...a.mensagens };
    const releituras = this.d.releituras ?? 3;
    try {
      let remoto = await this.d.destino.ler();
      for (let tentativa = 0; ; tentativa++) {
        let lido: E | null = null;
        let invalido: string | null = null;
        if (remoto !== null) {
          const r = await this.validar(remoto);
          if ("maisNovo" in r) return this.gravarStatus({ estado: "erro", quando: agora, ultimoPuxar: agora, mensagem: m.maisNovo });
          if ("ok" in r) {
            await a.importar(r.ok);
            lido = r.ok;
          } else {
            invalido = r.invalido;
          }
        }
        const env = await a.exportar({ remoto: lido, agora });
        if (remoto !== null && lido !== null && a.assinatura(env) === a.assinatura(lido)) {
          return this.gravarStatus({
            estado: "ok",
            quando: agora,
            ultimoOk: agora,
            ultimoPuxar: agora,
            pendente: false,
            mensagem: undefined,
            tamanho: remoto.length,
          });
        }
        const html = await gerarConteudoTexto(a.legivel(), env);
        const kb = Math.ceil(html.length / 1024);
        if (html.length > a.teto) {
          return this.gravarStatus({
            estado: "erro",
            quando: agora,
            ultimoPuxar: agora,
            tamanho: html.length,
            mensagem: m.grandeDemais(kb, Math.round(a.teto / 1024)),
          });
        }
        if (releituras > 0) {
          const deNovo = await this.d.destino.ler();
          if (deNovo !== remoto) {
            if (tentativa + 1 >= releituras) {
              return this.gravarStatus({
                estado: "erro",
                quando: agora,
                ultimoPuxar: agora,
                pendente: true,
                mensagem: m.mudouDuranteGravacao,
              });
            }
            remoto = deNovo;
            continue;
          }
        }
        if (this.d.permitido && !(await this.d.permitido())) {
          return this.gravarStatus({ estado: "nunca", quando: agora, pendente: false, mensagem: undefined });
        }
        await this.d.destino.gravar(html);
        return this.gravarStatus({
          estado: "ok",
          quando: agora,
          ultimoOk: agora,
          ultimoPuxar: agora,
          pendente: false,
          tamanho: html.length,
          mensagem: invalido ? m.invalidoRegravado(invalido) : html.length > a.aviso ? m.pertoDoTeto(kb) : undefined,
        });
      }
    } catch (e) {
      const t = textoDoErro(e);
      return this.gravarStatus({
        estado: t.estado,
        mensagem: t.mensagem,
        quando: agora,
        indisponivelAte: t.estado === "indisponivel" ? agora + UM_DIA : undefined,
      });
    }
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `250 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/sincronia/motor.ts` inteiro (as mensagens, o teto, o aviso e os `idsRemotos` dos sigilosos são os de antes; `releituras: 0` mantém o comportamento e as contagens de leitura das provas):

```ts
/**
 * Motor da sincronia da lista DA UNIDADE com o Texto Padrão (spec 9.1). O
 * motor é o genérico da sei-comum (`@comum/sincronia/motor`); aqui fica o
 * adaptador dos favoritos: o envelope de um escopo, a mesclagem do
 * repositório, a assinatura e as mensagens de sempre.
 *
 * Sem releitura antes de gravar (`releituras: 0`): o texto é de UMA pessoa, e
 * o comportamento (e as provas) dos Favoritos ficam exatamente como eram.
 */

import type { Area } from "@comum/armazenamento/area";
import { type AdaptadorTexto, type DestinoTexto, MotorTextoPadrao } from "@comum/sincronia/motor";
import type { Envelope } from "../arquivo";
import type { Carimbo, Escopo } from "../modelo/tipos";
import type { RepositorioFavoritos } from "../repositorio";
import { assinaturaEnvelope } from "./assinatura";
import { AVISO_TEXTO, envelopeDaUnidade, legivelFavoritos, TETO_TEXTO, validarEnvelopeDoTexto } from "./textoPadrao";

export { type StatusSync, textoDoErro } from "@comum/sincronia/motor";
export type DestinoSync = DestinoTexto;

export interface DepsMotor {
  repo: RepositorioFavoritos;
  escopo: Escopo;
  destino: DestinoSync;
  area: Area;
  chaveStatus: string;
  carimbo: () => Carimbo;
  nomeUsuario: string;
  /** Roda `fn` com a trava; devolve null se outra aba já está com ela. */
  travar<T>(nome: string, fn: () => Promise<T>): Promise<T | null>;
  agora?: () => number;
  teto?: number;
  atrasoEnvio?: number;
  /** Ainda pode gravar? (O usuário pode ter desligado durante a rodada.) */
  permitido?: () => Promise<boolean>;
}

export function adaptadorFavoritos(
  d: Pick<DepsMotor, "repo" | "escopo" | "carimbo" | "nomeUsuario" | "chaveStatus" | "teto">,
): AdaptadorTexto<Envelope> {
  return {
    modulo: "favoritos",
    chaveStatus: d.chaveStatus,
    teto: d.teto ?? TETO_TEXTO,
    aviso: d.teto ? d.teto * 0.8 : AVISO_TEXTO,
    legivel: () => legivelFavoritos(d.nomeUsuario),
    validar: (bruto) => validarEnvelopeDoTexto(bruto, d.escopo),
    importar: async (env) => {
      await d.repo.importar(env.escopos[0]!);
    },
    // Um sigiloso só vai (como aviso, sem número) se o texto já tinha uma cópia dele: idsRemotos.
    exportar: ({ remoto }) =>
      envelopeDaUnidade(d.repo, d.escopo, d.carimbo(), new Set((remoto?.escopos[0]?.favoritos ?? []).map((f) => f.id))),
    assinatura: assinaturaEnvelope,
    mensagens: {
      maisNovo:
        "Os favoritos no SEI foram gravados por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o texto não foi alterado.",
      grandeDemais: (kb, tetoKb) =>
        `A lista ficou grande demais para o Texto Padrão (${kb} KB de ${tetoKb} KB). Use a sincronização por arquivo.`,
      pertoDoTeto: (kb) => `A lista está perto do limite do Texto Padrão (${kb} KB).`,
    },
  };
}

export class MotorSincronia extends MotorTextoPadrao<Envelope> {
  constructor(d: DepsMotor) {
    super({
      adaptador: adaptadorFavoritos(d),
      destino: d.destino,
      area: d.area,
      travar: d.travar,
      agora: d.agora,
      atrasoEnvio: d.atrasoEnvio,
      permitido: d.permitido,
      releituras: 0,
    });
  }
}
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)` (inclui `verificar-motor.ts` dos Favoritos, intocado: mesmas contagens de leitura e gravação); tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: ` M dist/js/favoritos/app.js` e ` M dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/motor.ts sei-comum/tests/adaptadorTeste.ts sei-comum/tests/verificar-motor.ts sei-comum/tests/verificar.ts \
  favoritos/src/sincronia/motor.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: motor generico do Texto Padrao com releitura antes de gravar

O motor dos Favoritos vira o MotorTextoPadrao do sei-comum, com adaptador por
modulo, teto/aviso configuraveis, intervalo de puxada e releitura logo antes de
gravar (re-mescla se outra pessoa gravou no meio; ate 3 vezes, depois fica
pendente). Os Favoritos usam o motor sem releitura, como antes.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Controle da sincronia na página (content script)

**Files:**
- Create: `sei-comum/src/sincronia/controlePagina.ts`, `sei-comum/tests/verificar-controle-pagina.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/pagina/sincronia.ts` (reescrever: fachada)
- Regerar: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `MotorTextoPadrao`, `AdaptadorTexto`, `DestinoTexto`, `StatusSync`, `nomeDaTrava` (Task 3); `PortaConsentimento`, `chaveConsentimento`, `consentimentoNaArea`, `definirConsentimento` (Task 2); `Travar`, `TravarEsperando`, `travarComLocks` (Task 2); `PREFIXO_TEXTO_INTERNO` (Task 1); `adaptadorTeste`, `repoTeste`, `itensDoTexto` (Task 3, testes); `adaptadorFavoritos` (Task 3, Favoritos).
- Produces:
  - `ocultarTextosInternos(doc: Document): number` (tira do `select#selTextoPadrao` / `select[name="selTextoPadrao"]` toda opção que começa por `[_SEIPRO_`; devolve quantas).
  - `interface ArmazemTexto extends DestinoTexto { excluir(): Promise<boolean>; localizar?(): Promise<unknown> }` (o `criarArmazemTextoPadrao` do núcleo já é um).
  - `interface DepsControlePagina<E> { area: Area; adaptador: AdaptadorTexto<E>; armazem: () => ArmazemTexto; consentimento: PortaConsentimento; aoMudarLocal(cb: () => void): () => void; travar: Travar; travarEsperando?: TravarEsperando; atrasoEnvio?: number; intervaloPuxar?: number; releituras?: number; agora?: () => number }`.
  - `class ControleTextoPadrao<E> { constructor(d: DepsControlePagina<E>); iniciar(o: { puxar: boolean }): Promise<void>; puxar(): Promise<StatusSync | null> /*ao ganhar foco; null = desligado*/; agora(): Promise<StatusSync>; apagar(): Promise<boolean>; parar(): void }`.
  - Nos Favoritos: `ControleSincronia` (mesma assinatura: `iniciar(tela: string | null)`, `agora()`, `apagar()`, `parar()`), `chaveStatusTexto(e: Escopo)`, `ocultarTextosInternos` (reexportado), `type ArmazemDestino = ArmazemTexto`.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-controle-pagina.ts`:

```ts
import { areaMemoria } from "../src/armazenamento/area";
import { chaveConsentimento, consentimentoNaArea, definirConsentimento } from "../src/sincronia/consentimento";
import { ControleTextoPadrao, ocultarTextosInternos } from "../src/sincronia/controlePagina";
import type { StatusSync } from "../src/sincronia/motor";
import { travarComLocks } from "../src/sincronia/trava";
import { adaptadorTeste, type EnvTeste, itensDoTexto, repoTeste } from "./adaptadorTeste";
import { checar, instalarDom, secao, tique } from "./util";

const PREFS = "teste/preferencias";
const chaveDe = (texto: string) => chaveConsentimento("sei.exemplo.gov.br", "Pedro", "110", texto);
const porta = (area: ReturnType<typeof areaMemoria>, texto = "unidade") =>
  consentimentoNaArea({ area, chavePreferencias: PREFS, campo: "textoPadrao", chave: chaveDe(texto) });

function armazemEmMemoria() {
  const remoto = { html: null as string | null, lidas: 0, excluido: false };
  const armazem = {
    ler: async () => {
      remoto.lidas++;
      return remoto.html;
    },
    gravar: async (h: string) => {
      remoto.html = h;
    },
    excluir: async () => {
      const havia = remoto.html !== null;
      remoto.excluido = true;
      remoto.html = null;
      return havia;
    },
  };
  return { remoto, armazem };
}

export async function verificarControlePagina(): Promise<void> {
  secao("controle da pagina: textos internos fora do seletor do SEI");
  const doc = instalarDom(
    '<html><body><select id="selTextoPadrao"><option value="">-</option><option value="1">Despacho</option><option value="2">[_SEIPRO_FAV_ana]</option><option value="3">[_SEIPRO_PRJ_UNIDADE]</option></select><select name="selTextoPadrao"><option>[_SEIPRO_PRJ_ana]</option><option>Ofício</option></select></body></html>',
  );
  checar(
    "remove os [_SEIPRO_ dos dois seletores e mantem os outros",
    ocultarTextosInternos(doc) === 3 && doc.querySelectorAll("option").length === 3,
  );

  secao("controle da pagina: consentimento, envio e apagar");
  const area = areaMemoria();
  const prefs = areaMemoria();
  const repo = repoTeste();
  const { remoto, armazem } = armazemEmMemoria();
  const consentimento = porta(prefs);
  let t = 1000;
  const c = new ControleTextoPadrao<EnvTeste>({
    area,
    adaptador: adaptadorTeste(repo),
    armazem: () => armazem,
    consentimento,
    aoMudarLocal: (cb) => repo.aoMudar(cb),
    travar: (_n, fn) => fn(),
    atrasoEnvio: 10,
    releituras: 0,
  });
  await c.iniciar({ puxar: true });
  checar("sem consentimento, nao sincroniza", remoto.lidas === 0);
  await definirConsentimento(prefs, PREFS, "textoPadrao", chaveDe("eu"), "ligado");
  await tique(30);
  checar("ligar o texto pessoal nao liga o da unidade (consentimento por texto)", remoto.lidas === 0);
  await consentimento.definir("ligado");
  await tique(30);
  checar("ligou (de qualquer lugar): sincroniza na hora", remoto.lidas === 1 && remoto.html !== null);
  repo.por("a1", "um", ++t);
  await tique(80);
  checar("mudanca local vai para o SEI sozinha", remoto.lidas === 2 && (await itensDoTexto(remoto.html)).some((i) => i.id === "a1"));
  const st = await c.agora();
  checar("sincronizar agora (pedido do app)", st.estado === "ok" && remoto.lidas === 3, st);
  const pux = await c.puxar();
  checar("puxar ao ganhar foco respeita o intervalo", pux?.estado === "ok" && remoto.lidas === 3);
  await c.apagar();
  const status = (await area.obter("teste/sync/tp/a"))["teste/sync/tp/a"] as StatusSync | undefined;
  checar(
    "apagar exclui o texto, desliga e zera o status",
    remoto.excluido && (await consentimento.estado()) === "desligado" && status?.estado === "nunca",
    status,
  );
  repo.por("a2", "dois", ++t);
  await tique(80);
  checar("desligado: mudancas nao vao mais", remoto.html === null);
  checar("desligado: puxar nao faz nada", (await c.puxar()) === null && remoto.lidas === 3);
  c.parar();

  secao("controle da pagina: pendencia de uma carga anterior");
  const area3 = areaMemoria({ "teste/sync/tp/a": { estado: "ok", quando: 1, pendente: true } satisfies StatusSync });
  const prefs3 = areaMemoria();
  await definirConsentimento(prefs3, PREFS, "textoPadrao", chaveDe("unidade"), "ligado");
  const r3 = armazemEmMemoria();
  const c3 = new ControleTextoPadrao<EnvTeste>({
    area: area3,
    adaptador: adaptadorTeste(repoTeste()),
    armazem: () => r3.armazem,
    consentimento: porta(prefs3),
    aoMudarLocal: () => () => undefined,
    travar: (_n, fn) => fn(),
    releituras: 0,
  });
  await c3.iniciar({ puxar: false });
  await tique(30);
  checar("fora da caixa, mas com pendencia: envia ao carregar", r3.remoto.lidas === 1 && r3.remoto.html !== null);
  c3.parar();

  secao("controle da pagina: apagar com uma rodada em curso nao deixa texto no SEI");
  const area2 = areaMemoria();
  const prefs2 = areaMemoria();
  const repo2 = repoTeste();
  repo2.por("a1", "um", 1);
  const remoto2 = { html: null as string | null };
  let soltarGravacao: () => void = () => undefined;
  const armazem2 = {
    ler: async () => remoto2.html,
    // A gravação demora (rede do órgão): o usuário pede "apagar" no meio dela.
    gravar: (h: string) =>
      new Promise<void>((ok) => {
        soltarGravacao = () => {
          remoto2.html = h;
          ok();
        };
      }),
    excluir: async () => {
      const havia = remoto2.html !== null;
      remoto2.html = null;
      return havia;
    },
    localizar: async () => (remoto2.html ? { id: "1" } : null),
  };
  let fila = Promise.resolve();
  const travarEsperando = <T>(_n: string, fn: () => Promise<T>) => {
    const r = fila.then(fn);
    fila = r.then(
      () => undefined,
      () => undefined,
    );
    return r;
  };
  const c2 = new ControleTextoPadrao<EnvTeste>({
    area: area2,
    adaptador: adaptadorTeste(repo2),
    armazem: () => armazem2,
    consentimento: porta(prefs2),
    aoMudarLocal: (cb) => repo2.aoMudar(cb),
    travar: (n, fn) => travarEsperando(n, fn),
    travarEsperando,
    atrasoEnvio: 10,
    releituras: 0,
  });
  await c2.iniciar({ puxar: true });
  await porta(prefs2).definir("ligado");
  await tique(30);
  const apagando = c2.apagar();
  await tique(10);
  soltarGravacao();
  await apagando;
  await tique(30);
  checar("o texto que a rodada gravou depois do pedido tambem sai", remoto2.html === null, remoto2.html?.slice(0, 40));
  c2.parar();

  secao("controle da pagina: SEI em HTTP (sem Web Locks)");
  const prefs4 = areaMemoria();
  await definirConsentimento(prefs4, PREFS, "textoPadrao", chaveDe("unidade"), "ligado");
  const r4 = armazemEmMemoria();
  const repo4 = repoTeste();
  repo4.por("a1", "um", 1);
  const c4 = new ControleTextoPadrao<EnvTeste>({
    area: areaMemoria(),
    adaptador: adaptadorTeste(repo4),
    armazem: () => r4.armazem,
    consentimento: porta(prefs4),
    aoMudarLocal: (cb) => repo4.aoMudar(cb),
    travar: (n, fn) => travarComLocks(n, fn, null),
  });
  const s4 = await c4.agora();
  checar(
    "sem trava, a rodada roda (com a releitura padrao) e grava",
    s4.estado === "ok" && r4.remoto.lidas === 2 && r4.remoto.html !== null,
    s4,
  );
  checar("e o apagar, sem travarEsperando, tambem", (await c4.apagar()) === true && r4.remoto.html === null);
  c4.parar();
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarControlePagina } from "./verificar-controle-pagina";` logo depois de `import { verificarCombobox, verificarComboboxNoDialogo } from "./verificar-combobox";`, e `await verificarControlePagina();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/controlePagina'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/controlePagina.ts`:

```ts
/**
 * A sincronia por Texto Padrão do lado da aba do SEI (o content script tem a
 * sessão). Um controle por texto. Liga e desliga sozinho conforme o
 * consentimento daquele texto (porta do módulo), que o usuário decide no app:
 * - ao iniciar (o módulo diz se puxa: a caixa do Controle de Processos, por
 *   exemplo), ou se ficou pendência de uma carga anterior;
 * - qualquer mudança local (aqui, no app ou em outra aba) é enviada
 *   `atrasoEnvio` depois;
 * - `puxar()` ao ganhar foco; `agora()` e `apagar()` a pedido do app.
 */

import type { Area } from "../armazenamento/area";
import type { PortaConsentimento } from "./consentimento";
import { type AdaptadorTexto, type DestinoTexto, MotorTextoPadrao, nomeDaTrava, type StatusSync } from "./motor";
import { PREFIXO_TEXTO_INTERNO } from "./textoPadraoCodec";
import type { Travar, TravarEsperando } from "./trava";

/** Esconde os textos de dados do SEI Pro no seletor "Texto Padrão" ao gerar documento. É cosmético: o dado continua no SEI. */
export function ocultarTextosInternos(doc: Document): number {
  let n = 0;
  for (const o of doc.querySelectorAll<HTMLOptionElement>('select#selTextoPadrao option, select[name="selTextoPadrao"] option')) {
    if ((o.textContent ?? "").trim().startsWith(PREFIXO_TEXTO_INTERNO)) {
      o.remove();
      n++;
    }
  }
  return n;
}

export interface ArmazemTexto extends DestinoTexto {
  /** true se havia o texto e ele foi excluído. */
  excluir(): Promise<boolean>;
  /** Para conferir que o texto sumiu depois de excluir. */
  localizar?(): Promise<unknown>;
}

export interface DepsControlePagina<E> {
  /** Área local (o StatusSync). */
  area: Area;
  adaptador: AdaptadorTexto<E>;
  /** Criado só na primeira rodada (o armazém do núcleo monta o Sei da aba). */
  armazem: () => ArmazemTexto;
  consentimento: PortaConsentimento;
  /** Mudança nos dados locais deste texto (o repositório do escopo). */
  aoMudarLocal(cb: () => void): () => void;
  travar: Travar;
  /** A mesma trava, mas ESPERANDO a vez (o "apagar" não pode ser pulado). */
  travarEsperando?: TravarEsperando;
  atrasoEnvio?: number;
  intervaloPuxar?: number;
  releituras?: number;
  agora?: () => number;
}

export class ControleTextoPadrao<E> {
  private motor: MotorTextoPadrao<E> | null = null;
  private pararMudancas: (() => void) | null = null;
  private pararConsentimento: (() => void) | null = null;

  constructor(private readonly d: DepsControlePagina<E>) {}

  private criarMotor(): MotorTextoPadrao<E> {
    const armazem = this.d.armazem();
    return new MotorTextoPadrao<E>({
      adaptador: this.d.adaptador,
      destino: { ler: () => armazem.ler(), gravar: (h) => armazem.gravar(h) },
      area: this.d.area,
      travar: this.d.travar,
      agora: this.d.agora,
      atrasoEnvio: this.d.atrasoEnvio,
      intervaloPuxar: this.d.intervaloPuxar,
      releituras: this.d.releituras,
      // Conferido logo antes de gravar: quem desligou (ou mandou apagar) no meio de uma rodada não ganha o texto de volta.
      permitido: async () => (await this.d.consentimento.estado()) === "ligado",
    });
  }

  private rodar(forcar: boolean): Promise<StatusSync> {
    this.motor ??= this.criarMotor();
    return this.motor.sincronizar({ forcar });
  }

  private ligar(puxar: boolean): void {
    if (this.pararMudancas) return;
    this.motor ??= this.criarMotor();
    // As escritas da própria mesclagem também chegam aqui: custam uma leitura a mais depois,
    // que acha tudo igual e não regrava. Ignorá-las por janela de tempo engoliria mudança do usuário.
    this.pararMudancas = this.d.aoMudarLocal(() => void this.motor?.agendarEnvio());
    if (puxar) void this.rodar(false).catch(() => undefined);
  }

  private desligar(): void {
    this.pararMudancas?.();
    this.pararMudancas = null;
    this.motor?.parar();
  }

  private async pendenteGravado(): Promise<boolean> {
    const k = this.d.adaptador.chaveStatus;
    return ((await this.d.area.obter(k))[k] as StatusSync | undefined)?.pendente === true;
  }

  async iniciar(o: { puxar: boolean }): Promise<void> {
    if ((await this.d.consentimento.estado()) === "ligado") this.ligar(o.puxar || (await this.pendenteGravado()));
    this.pararConsentimento = this.d.consentimento.aoMudar(() => {
      void this.d.consentimento.estado().then((e) => {
        if (e === "ligado" && !this.pararMudancas) {
          this.ligar(false);
          void this.rodar(true).catch(() => undefined);
        } else if (e !== "ligado") {
          this.desligar();
        }
      });
    });
  }

  /** A aba ganhou foco: puxa se a sincronia está ligada, respeitando o intervalo. null = desligada. */
  async puxar(): Promise<StatusSync | null> {
    if (!this.pararMudancas) return null;
    return this.rodar(false);
  }

  /** "Sincronizar agora", pedido pelo app. */
  agora(): Promise<StatusSync> {
    return this.rodar(true);
  }

  /** "Apagar meus dados do SEI": exclui o texto e desliga a sincronia deste texto. */
  async apagar(): Promise<boolean> {
    this.desligar();
    await this.d.consentimento.definir("desligado");
    const armazem = this.d.armazem();
    const fazer = async () => {
      let excluiu = await armazem.excluir();
      // Confere: uma rodada que terminou nesse meio tempo (outra aba) pode ter gravado o texto de novo.
      if (armazem.localizar && (await armazem.localizar())) excluiu = (await armazem.excluir()) || excluiu;
      return excluiu;
    };
    // Na mesma trava da rodada: espera a que está em curso terminar, e só então exclui.
    const nome = nomeDaTrava(this.d.adaptador.modulo, this.d.adaptador.chaveStatus);
    const excluiu = this.d.travarEsperando ? await this.d.travarEsperando(nome, fazer) : await fazer();
    await this.d.area.gravar({
      [this.d.adaptador.chaveStatus]: { estado: "nunca", quando: Date.now(), pendente: false } satisfies StatusSync,
    });
    return excluiu;
  }

  parar(): void {
    this.desligar();
    this.pararConsentimento?.();
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `264 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/pagina/sincronia.ts` inteiro (a porta de consentimento lê e grava `textoPadraoUnidades` pelas funções de sempre de `preferencias.ts`; `tela === "caixa"` é o "puxar ao carregar"):

```ts
/**
 * Sincronia por Texto Padrão, do lado da aba do SEI (o content script tem a
 * sessão). O controle é o genérico da sei-comum (`@comum/sincronia/controlePagina`),
 * com o adaptador dos favoritos e o consentimento DESTA unidade
 * (`estadoTextoPadrao`), que o usuário decide no app:
 * - ao carregar o Controle de Processos, puxa (no máximo a cada 5 min);
 * - qualquer mudança na lista da unidade, feita aqui, no app ou em outra aba,
 *   é enviada 15 s depois;
 * - o app pede "sincronizar agora" e "apagar meus dados do SEI" pela ponte.
 */

import type { Area } from "@comum/armazenamento/area";
import { type ArmazemTexto, ControleTextoPadrao } from "@comum/sincronia/controlePagina";
import type { Envelope } from "../arquivo";
import { CHAVE_PREFERENCIAS } from "../modelo/constantes";
import { chaveEscopo } from "../modelo/escopo";
import type { Carimbo, ContextoAba, Escopo } from "../modelo/tipos";
import { definirTextoPadrao, estadoTextoPadrao, lerPreferencias } from "../preferencias";
import type { RepositorioFavoritos } from "../repositorio";
import { adaptadorFavoritos, type StatusSync } from "../sincronia/motor";

export { ocultarTextosInternos } from "@comum/sincronia/controlePagina";
export type ArmazemDestino = ArmazemTexto;

export const chaveStatusTexto = (e: Escopo): string => `favoritos/sync/tp/${chaveEscopo(e)}`;

export interface DepsControle {
  ctx: ContextoAba;
  area: Area;
  sync: Area;
  repo: RepositorioFavoritos;
  escopo: Escopo;
  armazem: () => ArmazemDestino;
  carimbo: () => Carimbo;
  travar<T>(nome: string, fn: () => Promise<T>): Promise<T | null>;
  /** A mesma trava, mas ESPERANDO a vez (o "apagar" não pode ser pulado). */
  travarEsperando?<T>(nome: string, fn: () => Promise<T>): Promise<T>;
  atrasoEnvio?: number;
}

export class ControleSincronia {
  private readonly controle: ControleTextoPadrao<Envelope>;

  constructor(d: DepsControle) {
    const idUnidade = d.escopo.unidade?.id ?? "";
    this.controle = new ControleTextoPadrao<Envelope>({
      area: d.area,
      adaptador: adaptadorFavoritos({
        repo: d.repo,
        escopo: d.escopo,
        carimbo: d.carimbo,
        nomeUsuario: d.ctx.nome || d.ctx.login,
        chaveStatus: chaveStatusTexto(d.escopo),
      }),
      armazem: d.armazem,
      consentimento: {
        estado: async () => estadoTextoPadrao(await lerPreferencias(d.sync), d.ctx.host, d.ctx.login, idUnidade),
        definir: (valor) => definirTextoPadrao(d.sync, d.ctx.host, d.ctx.login, idUnidade, valor),
        aoMudar: (cb) =>
          d.sync.aoMudar((m) => {
            if (CHAVE_PREFERENCIAS in m) cb();
          }),
      },
      aoMudarLocal: (cb) => d.repo.aoMudar(cb),
      travar: d.travar,
      travarEsperando: d.travarEsperando,
      atrasoEnvio: d.atrasoEnvio,
      // Um texto por pessoa: sem releitura antes de gravar (o comportamento de sempre).
      releituras: 0,
    });
  }

  iniciar(tela: string | null): Promise<void> {
    return this.controle.iniciar({ puxar: tela === "caixa" });
  }

  /** "Sincronizar agora", pedido pelo app. */
  agora(): Promise<StatusSync> {
    return this.controle.agora();
  }

  /** "Apagar meus dados do SEI desta unidade": exclui o texto e desliga a sincronia. */
  apagar(): Promise<boolean> {
    return this.controle.apagar();
  }

  parar(): void {
    this.controle.parar();
  }
}
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)` (inclui `verificar-controle-sync.ts` dos Favoritos, intocado); tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: ` M dist/js/favoritos/app.js` e ` M dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/controlePagina.ts sei-comum/tests/verificar-controle-pagina.ts sei-comum/tests/verificar.ts \
  favoritos/src/pagina/sincronia.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: controle da sincronia na pagina (Favoritos migram)

O controle do content script (ligar/desligar pelo consentimento, envio depois
de mudanca local, puxar ao carregar ou com pendencia, apagar na mesma trava e
esconder os textos internos do seletor do SEI) vira ControleTextoPadrao.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 5: Banco IndexedDB por módulo e cópias diárias

**Files:**
- Create: `sei-comum/src/sincronia/banco.ts`, `sei-comum/src/sincronia/copias.ts`, `sei-comum/tests/idbFalso.ts`, `sei-comum/tests/verificar-copias.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/sincronia/copias.ts` (reescrever: fachada)
- Regerar: `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `DataISO` (`@comum/datas/dias`); `Versionada` (`@comum/sincronia/entidade`).
- Produces:
  - `VERSAO_BANCO = 1`; `type Deposito = "copias" | "arquivos"`.
  - `abrirBanco(nome: string, fabrica: IDBFactory = indexedDB): Promise<IDBDatabase>` (cria `copias` com keyPath `id` e índice `dono`, e `arquivos`, só se faltarem).
  - `noDeposito<T>(nome: string, deposito: Deposito, modo: IDBTransactionMode, fazer: (s: IDBObjectStore) => IDBRequest<T>, fabrica?: IDBFactory): Promise<T>`.
  - `MAX_COPIAS = 14`; `interface Dono { host: string; login: string }`; `interface Copia<E = unknown> { id: string; dono: string; dia: DataISO; quando: number; quantidade: number; envelope: E }`; `interface ArmazemCopias<E = unknown> { listar(dono: Dono): Promise<Copia<E>[]>; gravar(c: Copia<E>): Promise<void>; apagar(id: string): Promise<void> }`; `chaveDono(d: Dono): string`.
  - `fazerCopiaDoDia<E>(armazem: ArmazemCopias<E>, dono: Dono, hoje: DataISO, quando: number, exportar: () => Promise<{ envelope: E; quantidade: number }>): Promise<boolean>` (exporta só se vai copiar).
  - `recarimbarAtivos<T extends Versionada>(lista: readonly T[], c: { agora: number; dispositivo: string }): T[]` (a regra do "restaurar").
  - `copiasEmMemoria<E = unknown>(): ArmazemCopias<E>`; `copiasNoIndexedDB<E = unknown>(banco: string, fabrica?: IDBFactory): ArmazemCopias<E>` (Projetos: `"seipro-projetos"`).
  - Nos Favoritos: `fazerCopiaDoDia(area, dono, armazem, hoje, c)`, `restaurarCopia(area, copia, carimbo, dono)`, `copiasEmMemoria()`, `copiasNoIndexedDB(nome = "seipro-favoritos")`, `type Copia = Copia<Envelope>`, `type ArmazemCopias = ArmazemCopias<Envelope>`, `Dono`, `MAX_COPIAS` — mesmas assinaturas de antes.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/idbFalso.ts` (o linkedom e o Node não têm IndexedDB):

```ts
/**
 * IndexedDB mínimo em memória, só o que `banco.ts` usa: open com upgrade,
 * depósitos com keyPath e índice, get/put/delete/getAll e a transação que
 * termina depois. Conta as atualizações de versão de cada banco.
 */

interface DepositoFalso {
  keyPath?: string;
  indices: Map<string, string>;
  dados: Map<unknown, unknown>;
}

interface BancoFalso {
  versao: number;
  depositos: Map<string, DepositoFalso>;
}

export function idbFalso(): { fabrica: IDBFactory; bancos: Map<string, BancoFalso>; atualizacoes: Map<string, number> } {
  const bancos = new Map<string, BancoFalso>();
  const atualizacoes = new Map<string, number>();
  const pedido = <T>(result: T) => ({ result });
  const fabrica = {
    open(nome: string, versao: number) {
      const r: { result?: unknown; error: null; onupgradeneeded?: () => void; onsuccess?: () => void; onerror?: () => void } = {
        error: null,
      };
      setTimeout(() => {
        const banco = bancos.get(nome) ?? { versao: 0, depositos: new Map<string, DepositoFalso>() };
        bancos.set(nome, banco);
        r.result = {
          objectStoreNames: { contains: (n: string) => banco.depositos.has(n) },
          createObjectStore(n: string, o?: { keyPath?: string }) {
            const dep: DepositoFalso = { keyPath: o?.keyPath, indices: new Map(), dados: new Map() };
            banco.depositos.set(n, dep);
            return { createIndex: (indice: string, campo: string) => dep.indices.set(indice, campo) };
          },
          transaction(n: string) {
            const dep = banco.depositos.get(n);
            if (!dep) throw new Error(`depósito inexistente: ${n}`);
            const loja = {
              get: (k: unknown) => pedido(structuredClone(dep.dados.get(k))),
              put: (v: Record<string, unknown>, k?: unknown) => {
                const chave = dep.keyPath ? v[dep.keyPath] : k;
                dep.dados.set(chave, structuredClone(v));
                return pedido(chave);
              },
              delete: (k: unknown) => {
                dep.dados.delete(k);
                return pedido(undefined);
              },
              index: (i: string) => ({
                getAll: (valor: unknown) =>
                  pedido(
                    [...dep.dados.values()]
                      .filter((x) => (x as Record<string, unknown>)[dep.indices.get(i) ?? ""] === valor)
                      .map((x) => structuredClone(x)),
                  ),
              }),
            };
            const t: { error: null; oncomplete?: () => void; onerror?: () => void; objectStore: () => typeof loja } = {
              error: null,
              objectStore: () => loja,
            };
            setTimeout(() => t.oncomplete?.(), 0);
            return t;
          },
          close: () => undefined,
        };
        if (banco.versao < versao) {
          banco.versao = versao;
          atualizacoes.set(nome, (atualizacoes.get(nome) ?? 0) + 1);
          r.onupgradeneeded?.();
        }
        r.onsuccess?.();
      }, 0);
      return r;
    },
  };
  return { fabrica: fabrica as unknown as IDBFactory, bancos, atualizacoes };
}
```

Criar `sei-comum/tests/verificar-copias.ts`:

```ts
import { abrirBanco, noDeposito } from "../src/sincronia/banco";
import { type Copia, copiasEmMemoria, copiasNoIndexedDB, fazerCopiaDoDia, recarimbarAtivos } from "../src/sincronia/copias";
import { idbFalso } from "./idbFalso";
import { checar, secao } from "./util";

const dono = { host: "sei.exemplo.gov.br", login: "Pedro" };

export async function verificarBancoECopias(): Promise<void> {
  secao("copias diarias");
  const copias = copiasEmMemoria<{ itens: number }>();
  let exportacoes = 0;
  const exportar = async () => {
    exportacoes++;
    return { envelope: { itens: 3 }, quantidade: 3 };
  };
  checar("primeira do dia: copia", await fazerCopiaDoDia(copias, dono, "2026-10-01", 1, exportar));
  checar(
    "segunda no mesmo dia: nao duplica, e nem exporta",
    !(await fazerCopiaDoDia(copias, dono, "2026-10-01", 2, exportar)) && exportacoes === 1,
  );
  for (let d = 2; d <= 20; d++) await fazerCopiaDoDia(copias, dono, `2026-10-${String(d).padStart(2, "0")}`, d, exportar);
  const lista = await copias.listar(dono);
  checar(
    "guarda as 14 mais recentes, a mais nova primeiro",
    lista.length === 14 && lista[0]?.dia === "2026-10-20" && lista.at(-1)?.dia === "2026-10-07",
    lista.map((c) => c.dia),
  );
  checar(
    "id e dono por host|login (login sem caixa)",
    lista[0]?.id === "sei.exemplo.gov.br|pedro|2026-10-20" && lista[0]?.quantidade === 3,
  );
  checar("outro dono nao ve", (await copias.listar({ host: dono.host, login: "ana" })).length === 0);
  const itens = [
    { id: "1", atualizadoEm: 1, dispositivo: "A" },
    { id: "2", atualizadoEm: 1, dispositivo: "A", removidoEm: 1 },
  ];
  const recarimbados = recarimbarAtivos(itens, { agora: 99, dispositivo: "B" });
  checar(
    "restaurar: so os ativos, recarimbados (vencem remocoes posteriores)",
    recarimbados.length === 1 &&
      recarimbados[0]?.atualizadoEm === 99 &&
      recarimbados[0]?.dispositivo === "B" &&
      itens[0]?.atualizadoEm === 1,
  );

  secao("IndexedDB: um banco por modulo");
  const idb = idbFalso();
  const doProjetos = copiasNoIndexedDB<{ x: number }>("seipro-projetos", idb.fabrica);
  await doProjetos.gravar({
    id: "sei.exemplo.gov.br|pedro|2026-10-06",
    dono: "sei.exemplo.gov.br|pedro",
    dia: "2026-10-06",
    quando: 1,
    quantidade: 1,
    envelope: { x: 1 },
  });
  await doProjetos.gravar({
    id: "sei.exemplo.gov.br|pedro|2026-10-07",
    dono: "sei.exemplo.gov.br|pedro",
    dia: "2026-10-07",
    quando: 2,
    quantidade: 1,
    envelope: { x: 2 },
  });
  const doBanco = await doProjetos.listar(dono);
  checar(
    "grava e lista pelo dono, a mais nova primeiro",
    doBanco.map((c) => c.dia).join() === "2026-10-07,2026-10-06" && doBanco[0]?.envelope.x === 2,
  );
  const banco = idb.bancos.get("seipro-projetos");
  checar(
    "banco do modulo, versao 1, com os dois depositos",
    banco?.versao === 1 && banco.depositos.has("copias") && banco.depositos.has("arquivos") && !idb.bancos.has("seipro-favoritos"),
  );
  await doProjetos.apagar("sei.exemplo.gov.br|pedro|2026-10-06");
  checar("apagar", (await doProjetos.listar(dono)).length === 1);

  secao("IndexedDB: o banco que os Favoritos ja tem nao migra");
  const antigo: Copia<{ favoritos: number }> = {
    id: "sei.exemplo.gov.br|pedro|2026-09-30",
    dono: "sei.exemplo.gov.br|pedro",
    dia: "2026-09-30",
    quando: 1,
    quantidade: 5,
    envelope: { favoritos: 5 },
  };
  (await abrirBanco("seipro-favoritos", idb.fabrica)).close();
  await noDeposito("seipro-favoritos", "copias", "readwrite", (s) => s.put(antigo), idb.fabrica);
  const lidas = await copiasNoIndexedDB<{ favoritos: number }>("seipro-favoritos", idb.fabrica).listar(dono);
  checar(
    "abrir de novo acha a copia antiga e nao roda upgrade",
    lidas[0]?.envelope.favoritos === 5 && idb.atualizacoes.get("seipro-favoritos") === 1,
    idb.atualizacoes,
  );
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarBancoECopias } from "./verificar-copias";` logo depois de `import { verificarControlePagina } from "./verificar-controle-pagina";`, e `await verificarBancoECopias();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/banco'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/banco.ts`:

```ts
/**
 * O IndexedDB da extensão (origem chrome-extension://): UM BANCO POR MÓDULO
 * (`seipro-favoritos`, `seipro-projetos`), versão 1, com dois depósitos:
 * `copias` (as cópias diárias, chave `id`, índice `dono`) e `arquivos` (o
 * handle do arquivo sincronizado, chave `host|login`). É exatamente o banco
 * que os Favoritos já tinham: abrir de novo com o mesmo nome não migra nada.
 *
 * Abre e fecha a cada operação (são poucas, e um banco aberto preso numa aba
 * impediria a próxima versão de criar depósitos).
 */

export const VERSAO_BANCO = 1;
export type Deposito = "copias" | "arquivos";

export function abrirBanco(nome: string, fabrica: IDBFactory = globalThis.indexedDB): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((ok, erro) => {
    const r = fabrica.open(nome, VERSAO_BANCO);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains("copias")) db.createObjectStore("copias", { keyPath: "id" }).createIndex("dono", "dono");
      if (!db.objectStoreNames.contains("arquivos")) db.createObjectStore("arquivos");
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => erro(r.error);
  });
}

/** Uma operação num depósito, numa transação própria; resolve quando a transação termina. */
export function noDeposito<T>(
  nome: string,
  deposito: Deposito,
  modo: IDBTransactionMode,
  fazer: (s: IDBObjectStore) => IDBRequest<T>,
  fabrica?: IDBFactory,
): Promise<T> {
  return abrirBanco(nome, fabrica).then(
    (db) =>
      new Promise<T>((ok, erro) => {
        const t = db.transaction(deposito, modo);
        const r = fazer(t.objectStore(deposito));
        t.oncomplete = () => {
          ok(r.result);
          db.close();
        };
        t.onerror = () => {
          erro(t.error);
          db.close();
        };
      }),
  );
}
```

Criar `sei-comum/src/sincronia/copias.ts`:

```ts
/**
 * Cópias diárias: uma por dia, de tudo o que o usuário tem no módulo, no
 * IndexedDB da extensão (banco do módulo); ficam as 14 mais recentes. É a rede
 * de segurança de tudo o resto (um colega que apagou o texto, uma importação
 * errada, a lixeira que venceu).
 *
 * Restaurar é do módulo (ele sabe o envelope), mas a regra é uma só e está em
 * `recarimbarAtivos`: traz de volta o que estava ATIVO na cópia, com carimbo
 * novo para vencer remoções posteriores, e deixa em paz o que entrou depois.
 */

import type { DataISO } from "../datas/dias";
import { noDeposito } from "./banco";
import type { Versionada } from "./entidade";

export const MAX_COPIAS = 14;

export interface Dono {
  host: string;
  login: string;
}

export interface Copia<E = unknown> {
  /** host|login|dia */
  id: string;
  dono: string;
  dia: DataISO;
  quando: number;
  /** Itens ativos na cópia (o que o diálogo mostra). */
  quantidade: number;
  envelope: E;
}

export interface ArmazemCopias<E = unknown> {
  listar(dono: Dono): Promise<Copia<E>[]>;
  gravar(c: Copia<E>): Promise<void>;
  apagar(id: string): Promise<void>;
}

export const chaveDono = (d: Dono): string => `${d.host}|${d.login.toLowerCase()}`;

const maisNovaPrimeiro = (a: { dia: DataISO }, b: { dia: DataISO }) => (a.dia < b.dia ? 1 : -1);

/** Faz a cópia de hoje, se ainda não há; `exportar` só roda quando vai mesmo copiar. */
export async function fazerCopiaDoDia<E>(
  armazem: ArmazemCopias<E>,
  dono: Dono,
  hoje: DataISO,
  quando: number,
  exportar: () => Promise<{ envelope: E; quantidade: number }>,
): Promise<boolean> {
  const existentes = await armazem.listar(dono);
  if (existentes.some((x) => x.dia === hoje)) return false;
  const { envelope, quantidade } = await exportar();
  await armazem.gravar({ id: `${chaveDono(dono)}|${hoje}`, dono: chaveDono(dono), dia: hoje, quando, quantidade, envelope });
  const sobra = [...existentes, { dia: hoje } as Copia<E>].sort(maisNovaPrimeiro).slice(MAX_COPIAS);
  for (const x of sobra) if (x.id) await armazem.apagar(x.id);
  return true;
}

/** Os ativos da lista, recarimbados (vencem as remoções feitas depois da cópia). */
export function recarimbarAtivos<T extends Versionada>(lista: readonly T[], c: { agora: number; dispositivo: string }): T[] {
  return lista.filter((x) => x.removidoEm === undefined).map((x) => ({ ...x, atualizadoEm: c.agora, dispositivo: c.dispositivo }));
}

/** Para os testes (e como recuo quando o IndexedDB falha). */
export function copiasEmMemoria<E = unknown>(): ArmazemCopias<E> {
  const dados = new Map<string, Copia<E>>();
  return {
    async listar(dono) {
      return [...dados.values()].filter((c) => c.dono === chaveDono(dono)).sort(maisNovaPrimeiro);
    },
    async gravar(c) {
      dados.set(c.id, structuredClone(c));
    },
    async apagar(id) {
      dados.delete(id);
    },
  };
}

/** O depósito "copias" do banco do módulo (banco.ts). */
export function copiasNoIndexedDB<E = unknown>(banco: string, fabrica?: IDBFactory): ArmazemCopias<E> {
  return {
    async listar(dono) {
      const todas = await noDeposito<Copia<E>[]>(
        banco,
        "copias",
        "readonly",
        (s) => s.index("dono").getAll(chaveDono(dono)) as IDBRequest<Copia<E>[]>,
        fabrica,
      );
      return todas.sort(maisNovaPrimeiro);
    },
    async gravar(c) {
      await noDeposito(banco, "copias", "readwrite", (s) => s.put(c), fabrica);
    },
    async apagar(id) {
      await noDeposito(banco, "copias", "readwrite", (s) => s.delete(id), fabrica);
    },
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `274 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/sincronia/copias.ts` inteiro (o banco continua `seipro-favoritos`; as cópias que os usuários já têm aparecem do mesmo jeito):

```ts
/**
 * Cópias diárias (spec 9.4): uma por dia, de todas as listas do usuário, no
 * IndexedDB da extensão (banco "seipro-favoritos"); ficam as 14 mais recentes.
 * A mecânica é a genérica da sei-comum (`@comum/sincronia/copias`); aqui fica
 * o envelope dos favoritos.
 *
 * Restaurar não "volta no tempo" apagando o que veio depois: traz de volta o
 * que estava ATIVO na cópia, com carimbo novo para vencer remoções posteriores,
 * e deixa em paz o que entrou depois dela.
 */

import type { Area } from "@comum/armazenamento/area";
import type { DataISO } from "@comum/datas/dias";
import {
  type ArmazemCopias as ArmazemCopiasComum,
  type Copia as CopiaComum,
  copiasEmMemoria as copiasEmMemoriaComum,
  copiasNoIndexedDB as copiasNoBanco,
  type Dono,
  fazerCopiaDoDia as fazerCopiaComum,
  recarimbarAtivos,
} from "@comum/sincronia/copias";
import { type Envelope, exportarTudo, importarEnvelope } from "../arquivo";
import type { Carimbo } from "../modelo/tipos";

export { type Dono, MAX_COPIAS } from "@comum/sincronia/copias";
export type Copia = CopiaComum<Envelope>;
export type ArmazemCopias = ArmazemCopiasComum<Envelope>;

export function fazerCopiaDoDia(area: Area, dono: Dono, armazem: ArmazemCopias, hoje: DataISO, c: Carimbo): Promise<boolean> {
  return fazerCopiaComum(armazem, dono, hoje, c.agora, async () => {
    const envelope = await exportarTudo(area, dono.host, dono.login, c);
    const quantidade = envelope.escopos.reduce((n, e) => n + e.favoritos.filter((f) => f.removidoEm === undefined).length, 0);
    return { envelope, quantidade };
  });
}

export async function restaurarCopia(area: Area, copia: Copia, carimbo: () => Carimbo, dono: Dono): Promise<{ restaurados: number }> {
  const c = carimbo();
  const env: Envelope = {
    ...copia.envelope,
    escopos: copia.envelope.escopos.map((e) => ({
      ...e,
      favoritos: recarimbarAtivos(e.favoritos, c),
      pastas: recarimbarAtivos(e.pastas, c),
      etiquetas: recarimbarAtivos(e.etiquetas, c),
    })),
  };
  const r = await importarEnvelope(area, env, () => c, dono);
  return { restaurados: r.novos + r.atualizados };
}

/** Para os testes (e como recuo quando o IndexedDB falha). */
export const copiasEmMemoria = (): ArmazemCopias => copiasEmMemoriaComum<Envelope>();

/** IndexedDB da extensão, banco "seipro-favoritos", depósito "copias" (o mesmo de sempre). */
export const copiasNoIndexedDB = (nome = "seipro-favoritos"): ArmazemCopias => copiasNoBanco<Envelope>(nome);
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)`; tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: só ` M dist/js/favoritos/app.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/banco.ts sei-comum/src/sincronia/copias.ts sei-comum/tests/idbFalso.ts sei-comum/tests/verificar-copias.ts sei-comum/tests/verificar.ts \
  favoritos/src/sincronia/copias.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: banco IndexedDB por modulo e copias diarias (Favoritos migram)

Um banco por modulo (versao 1, depositos copias e arquivos) e as copias
diarias genericas no sei-comum. Os Favoritos seguem no banco seipro-favoritos,
sem migracao de dados.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 6: Sincronia por arquivo

**Files:**
- Create: `sei-comum/src/sincronia/arquivo.ts`, `sei-comum/tests/verificar-arquivo.ts`
- Modify: `sei-comum/tests/adaptadorTeste.ts` (import no topo + adaptador de arquivo no fim), `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/sincronia/arquivoSync.ts` (reescrever: fachada), `favoritos/src/app/main.ts:17-18,28,344,349-364`
- Regerar: `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `noDeposito` (Task 5); `Dono` (Task 5); `versaoMaisNova`, `assinaturaEstavel`, `porId` (Task 1); `idbFalso`, `repoTeste`, `ItemTeste` (Tasks 3 e 5, testes).
- Produces:
  - `interface ArquivoSync { ler(): Promise<string>; gravar(conteudo: string): Promise<void> }`; `interface StatusArquivo { estado: "ok" | "erro" | "permissao"; quando: number; mensagem?: string; nome?: string }`.
  - `interface MensagensArquivo { maisNovo: string; regravado: string; outros(n: number): string; permissao: string }`; `MENSAGENS_ARQUIVO`.
  - `interface AdaptadorArquivo<E> { formato: string; versao: number; ler(bruto: unknown): E | null; importar(envelope: E): Promise<unknown>; exportar(lido: E | null): Promise<{ envelope: E; outros: number }>; assinatura(envelope: E): string; mensagens?: Partial<MensagensArquivo> }`.
  - `class SincroniaArquivo<E> { constructor(d: { area: Area; chaveStatus: string; arquivo: ArquivoSync; adaptador: AdaptadorArquivo<E>; nome?: string }); sincronizar(): Promise<StatusArquivo> }`.
  - `type HandleArquivo`; `temSeletorDeArquivo(w?: unknown): boolean`; `arquivoDoHandle(h: HandleArquivo): ArquivoSync`; `permissao(h: HandleArquivo, pedir: boolean): Promise<PermissionState>`.
  - `interface ArmazemHandles { ler(d: Dono): Promise<HandleArquivo | undefined>; guardar(d: Dono, h: HandleArquivo): Promise<unknown>; esquecer(d: Dono): Promise<unknown> }`; `handlesNoIndexedDB(banco: string, fabrica?: IDBFactory): ArmazemHandles`.
  - `interface DepsControleArquivo<E> { area: Area; dono: Dono; chaveStatus: string; handles: ArmazemHandles; escolher(modo: "novo" | "existente"): Promise<HandleArquivo | null>; adaptador: AdaptadorArquivo<E>; atraso?: number }`.
  - `class ControleArquivo<E> { configurado(): Promise<boolean>; status(): Promise<StatusArquivo | null>; sincronizar(pedir?: boolean): Promise<StatusArquivo | null>; escolher(modo?: "novo" | "existente"): Promise<StatusArquivo | null>; reconectar(): Promise<StatusArquivo | null>; esquecer(): Promise<void>; agendar(): void; parar(): void }`.
  - `escolherArquivoSync(modo: "novo" | "existente", nomeSugerido: string, descricao: string, janela?: unknown): Promise<HandleArquivo | null>`.
  - Nos Favoritos: `SincroniaArquivo`, `ControleArquivo`, `handlesNoIndexedDB(nome = "seipro-favoritos")`, `chaveStatusArquivo`, `adaptadorArquivoFavoritos(area, dono, carimbo)` e os reexports (`arquivoDoHandle`, `permissao`, `temSeletorDeArquivo`, `ArquivoSync`, `HandleArquivo`, `StatusArquivo`) com as assinaturas de antes.

- [ ] **Step 1: Escrever as provas**

Em `sei-comum/tests/adaptadorTeste.ts`, trocar a linha `import { assinaturaEstavel, porId } from "../src/sincronia/assinatura";` por

```ts
import type { AdaptadorArquivo } from "../src/sincronia/arquivo";
import { assinaturaEstavel, porId } from "../src/sincronia/assinatura";
```

e acrescentar ao fim do arquivo:

```ts
/** O arquivo de teste: uma lista por dono (o mesmo arquivo pode ter sido escolhido por outro usuário). */
export interface EnvArquivoTeste {
  formato: "teste";
  versao: number;
  donos: Array<{ dono: string; itens: ItemTeste[] }>;
}

export function adaptadorArquivoTeste(repo: RepoTeste, dono: string): AdaptadorArquivo<EnvArquivoTeste> {
  return {
    formato: "teste",
    versao: 1,
    ler(bruto) {
      const b = bruto as Partial<EnvArquivoTeste> | null;
      return b?.formato === "teste" && b.versao === 1 && Array.isArray(b.donos) ? (b as EnvArquivoTeste) : null;
    },
    async importar(env) {
      for (const d of env.donos) if (d.dono === dono) repo.importar({ formato: "teste", versao: 1, dono, itens: d.itens });
    },
    async exportar(lido) {
      const outros = (lido?.donos ?? []).filter((d) => d.dono !== dono);
      return {
        envelope: { formato: "teste", versao: 1, donos: [{ dono, itens: [...repo.itens.values()] }, ...outros] },
        outros: outros.length,
      };
    },
    assinatura: (env) =>
      assinaturaEstavel(
        env.donos.map((d) => ({ dono: d.dono, itens: porId(d.itens) })).sort((a, b) => (a.dono < b.dono ? -1 : a.dono > b.dono ? 1 : 0)),
      ),
  };
}
```

Criar `sei-comum/tests/verificar-arquivo.ts`:

```ts
import { areaMemoria } from "../src/armazenamento/area";
import {
  type ArquivoSync,
  ControleArquivo,
  escolherArquivoSync,
  type HandleArquivo,
  handlesNoIndexedDB,
  permissao,
  SincroniaArquivo,
  temSeletorDeArquivo,
} from "../src/sincronia/arquivo";
import { adaptadorArquivoTeste, repoTeste } from "./adaptadorTeste";
import { idbFalso } from "./idbFalso";
import { checar, lanca, secao, tique } from "./util";

const dono = { host: "sei.exemplo.gov.br", login: "pedro" };
const CHAVE = "teste/sync/arquivo/sei.exemplo.gov.br|pedro";

function arquivoEmMemoria(inicial = "") {
  const a = { conteudo: inicial, escritas: 0 };
  const arquivo: ArquivoSync = {
    ler: async () => a.conteudo,
    gravar: async (s) => {
      a.escritas++;
      a.conteudo = s;
    },
  };
  return { a, arquivo };
}

export async function verificarArquivo(): Promise<void> {
  secao("arquivo sincronizado (pasta da nuvem)");
  const area = areaMemoria();
  const repoA = repoTeste();
  repoA.por("a1", "um", 1);
  const { a, arquivo } = arquivoEmMemoria();
  const sA = new SincroniaArquivo({ area, chaveStatus: CHAVE, arquivo, adaptador: adaptadorArquivoTeste(repoA, "pedro") });
  const r1 = await sA.sincronizar();
  checar("arquivo vazio: grava tudo do dono", r1.estado === "ok" && a.escritas === 1 && a.conteudo.includes('"a1"'));
  checar("status na chave do modulo", ((await area.obter(CHAVE))[CHAVE] as { estado?: string } | undefined)?.estado === "ok");
  const repoB = repoTeste();
  repoB.por("b1", "dois", 2, "B");
  const sB = new SincroniaArquivo({ area: areaMemoria(), chaveStatus: CHAVE, arquivo, adaptador: adaptadorArquivoTeste(repoB, "pedro") });
  await sB.sincronizar();
  checar("outro computador le e mescla", repoB.itens.has("a1"));
  checar("e grava o que so ele tinha", a.escritas === 2 && a.conteudo.includes('"b1"'));
  await sB.sincronizar();
  checar("sem mudanca: nao regrava", a.escritas === 2);
  a.conteudo = `${String.fromCharCode(0xfeff)}${a.conteudo}`;
  await sB.sincronizar();
  checar("arquivo com BOM (Bloco de Notas) e lido como sempre", a.escritas === 2);
  a.conteudo = "{ isto nao e json";
  const r3 = await sB.sincronizar();
  checar(
    "arquivo estragado: nao apaga nada e regrava",
    r3.estado === "ok" && a.escritas === 3 && repoB.itens.has("b1") && /regrav/.test(r3.mensagem ?? ""),
    r3,
  );

  secao("arquivo: compartilhado e de versao mais nova");
  const compartilhado = arquivoEmMemoria(
    JSON.stringify({
      formato: "teste",
      versao: 1,
      donos: [{ dono: "maria", itens: [{ id: "m1", valor: "x", atualizadoEm: 1, dispositivo: "Z" }] }],
    }),
  );
  const rC = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: compartilhado.arquivo,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar(
    "mantem os dados do outro usuario e grava os meus",
    compartilhado.a.conteudo.includes('"m1"') && compartilhado.a.conteudo.includes('"a1"'),
  );
  checar("e avisa que o arquivo tem dados de outro", /outro usu/.test(rC.mensagem ?? ""), rC);
  checar("e nao importa os dados do outro", !repoA.itens.has("m1"));
  const novo = arquivoEmMemoria(JSON.stringify({ formato: "teste", versao: 2, donos: [] }));
  const rN = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: novo.arquivo,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar("versao mais nova: nao sobrescreve", novo.a.escritas === 0 && rN.estado === "erro" && /mais nova/.test(rN.mensagem ?? ""), rN);
  const negado: ArquivoSync = {
    ler: async () => "",
    gravar: async () => {
      throw Object.assign(new Error("negado"), { name: "NotAllowedError" });
    },
  };
  const rP = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: negado,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar("permissao negada no meio: pede reconectar", rP.estado === "permissao");

  secao("arquivo: controle no app");
  const areaC = areaMemoria();
  const repoC = repoTeste();
  repoC.por("c1", "um", 1);
  let conteudo = "";
  let perm: PermissionState = "granted";
  const handle = {
    name: "projetos-seipro.json",
    getFile: async () => ({ text: async () => conteudo }),
    createWritable: async () => ({
      write: async (s: string) => {
        conteudo = s;
      },
      close: async () => undefined,
    }),
    queryPermission: async () => perm,
    requestPermission: async () => {
      perm = "granted";
      return perm;
    },
  } as unknown as HandleArquivo;
  const guardados = new Map<string, HandleArquivo>();
  const c = new ControleArquivo({
    area: areaC,
    dono,
    chaveStatus: CHAVE,
    handles: {
      ler: async () => guardados.get("h"),
      guardar: async (_d, h) => guardados.set("h", h),
      esquecer: async () => guardados.delete("h"),
    },
    escolher: async () => handle,
    adaptador: adaptadorArquivoTeste(repoC, "pedro"),
    atraso: 10,
  });
  checar("sem arquivo escolhido: nada a fazer", (await c.sincronizar()) === null && !(await c.configurado()));
  await c.escolher();
  checar(
    "escolher grava no arquivo",
    conteudo.includes('"c1"') && (await c.status())?.estado === "ok" && (await c.status())?.nome === "projetos-seipro.json",
  );
  perm = "prompt";
  const s = await c.sincronizar();
  checar("permissao expirada: pede reconectar (sem gesto nao pergunta)", s?.estado === "permissao", s);
  await c.reconectar();
  checar("reconectar pede a permissao e sincroniza", (perm as PermissionState) === "granted" && (await c.status())?.estado === "ok");
  repoC.por("c2", "dois", 2);
  c.agendar();
  c.agendar();
  await tique(60);
  checar("mudanca local vai para o arquivo depois do intervalo", conteudo.includes('"c2"'));
  await c.esquecer();
  checar("parar de usar o arquivo", !(await c.configurado()) && (await c.status()) === null);

  secao("arquivo: handle no banco do modulo e seletor");
  const idb = idbFalso();
  const handles = handlesNoIndexedDB("seipro-projetos", idb.fabrica);
  await handles.guardar(dono, { name: "x.json" } as unknown as HandleArquivo);
  checar(
    "guarda pelo dono (login sem caixa) no banco do modulo",
    (await handles.ler({ host: dono.host, login: "PEDRO" }))?.name === "x.json" &&
      idb.bancos.get("seipro-projetos")?.depositos.has("arquivos") === true,
  );
  await handles.esquecer(dono);
  checar("esquecer", (await handles.ler(dono)) === undefined);
  checar("tem seletor so com showSaveFilePicker", temSeletorDeArquivo({ showSaveFilePicker() {} }) && !temSeletorDeArquivo({}));
  checar("handle sem queryPermission: concedido", (await permissao({} as HandleArquivo, false)) === "granted");
  let opcoes: { suggestedName?: string; types?: Array<{ description?: string }> } = {};
  const janela = {
    showSaveFilePicker: async (o: typeof opcoes) => {
      opcoes = o;
      return handle;
    },
    showOpenFilePicker: async () => [] as HandleArquivo[],
  };
  checar(
    "novo: Salvar como com o nome e a descricao do modulo",
    (await escolherArquivoSync("novo", "projetos-seipro.json", "Projetos do SEI Pro", janela)) === handle &&
      opcoes.suggestedName === "projetos-seipro.json" &&
      opcoes.types?.[0]?.description === "Projetos do SEI Pro",
  );
  checar("existente sem escolha: null", (await escolherArquivoSync("existente", "x", "y", janela)) === null);
  const cancelado = {
    showSaveFilePicker: async () => {
      throw Object.assign(new Error("cancelou"), { name: "AbortError" });
    },
  };
  checar("cancelar nao e erro", (await escolherArquivoSync("novo", "x", "y", cancelado)) === null);
  const quebrado = {
    showSaveFilePicker: async () => {
      throw Object.assign(new Error("sem permissao de seletor"), { name: "SecurityError" });
    },
  };
  checar("outro erro sobe", (await lanca(() => escolherArquivoSync("novo", "x", "y", quebrado)))?.message === "sem permissao de seletor");
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarArquivo } from "./verificar-arquivo";` logo depois de `import { verificarArmazenamento } from "./verificar-armazenamento";`, e `await verificarArquivo();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/sincronia/arquivo'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/sincronia/arquivo.ts` (o BOM sai por `charCodeAt`, sem regex com `\u`: ver Global Constraints):

```ts
/**
 * Sincronia por arquivo: um .json numa pasta que o próprio usuário já
 * sincroniza (OneDrive, Google Drive, Dropbox, rede). Leva tudo do usuário no
 * módulo: é o backup completo e legível.
 *
 * Chrome/Edge: File System Access, com o "handle" guardado no IndexedDB da
 * extensão (banco do módulo, depósito "arquivos") e permissão pedida por gesto
 * ("Reconectar arquivo") quando expira. Firefox não tem a API: lá valem
 * "Exportar" e "Importar", que já mesclam.
 *
 * Ler sempre MESCLA; arquivo ilegível nunca apaga nada e é regravado; arquivo
 * de versão mais nova do SEI Pro não é tocado; o que o arquivo tem de outro
 * usuário ou outro SEI (o mesmo arquivo escolhido em dois lugares) fica.
 */

import type { Area } from "../armazenamento/area";
import { noDeposito } from "./banco";
import type { Dono } from "./copias";
import { versaoMaisNova } from "./textoPadraoCodec";

export interface ArquivoSync {
  ler(): Promise<string>;
  gravar(conteudo: string): Promise<void>;
}

export interface StatusArquivo {
  estado: "ok" | "erro" | "permissao";
  quando: number;
  mensagem?: string;
  nome?: string;
}

export interface MensagensArquivo {
  maisNovo: string;
  regravado: string;
  outros(n: number): string;
  permissao: string;
}

export const MENSAGENS_ARQUIVO: MensagensArquivo = {
  maisNovo: "O arquivo foi gravado por uma versão mais nova do SEI Pro. Atualize a extensão neste computador; o arquivo não foi alterado.",
  regravado: "O arquivo estava ilegível e foi regravado a partir deste computador.",
  outros: (n) =>
    `O arquivo também tem dados de ${n === 1 ? "outro usuário ou outro SEI" : `${n} outros usuários ou SEIs`}, que foram mantidos.`,
  permissao: "O navegador pede de novo a permissão do arquivo.",
};

/** O que o módulo ensina à sincronia por arquivo. */
export interface AdaptadorArquivo<E> {
  /** `formato` e `versao` do envelope: arquivo com o mesmo formato e versão maior é "mais novo". */
  formato: string;
  versao: number;
  /** O envelope do JSON lido, já validado, ou null se não é deste módulo (vira "ilegível"). */
  ler(bruto: unknown): E | null;
  /** Mescla no armazenamento local o que é do dono (o de outros fica como está). */
  importar(envelope: E): Promise<unknown>;
  /** O que gravar: tudo do dono + o que o arquivo lido tinha de outros (`outros` = quantos). */
  exportar(lido: E | null): Promise<{ envelope: E; outros: number }>;
  assinatura(envelope: E): string;
  mensagens?: Partial<MensagensArquivo>;
}

/** O Bloco de Notas do Windows grava o arquivo com BOM (U+FEFF) no começo: o JSON.parse recusaria. */
const semBom = (texto: string): string => (texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto);

export class SincroniaArquivo<E> {
  constructor(
    private readonly d: {
      area: Area;
      chaveStatus: string;
      arquivo: ArquivoSync;
      adaptador: AdaptadorArquivo<E>;
      nome?: string;
    },
  ) {}

  async sincronizar(): Promise<StatusArquivo> {
    const agora = Date.now();
    const a = this.d.adaptador;
    const m = { ...MENSAGENS_ARQUIVO, ...a.mensagens };
    try {
      const texto = await this.d.arquivo.ler();
      let remota = "";
      let invalido = false;
      let lido: E | null = null;
      if (texto.trim()) {
        let bruto: unknown = null;
        try {
          bruto = JSON.parse(semBom(texto));
        } catch {
          bruto = null;
        }
        if (versaoMaisNova(bruto, a.formato, a.versao))
          return this.status({ estado: "erro", quando: agora, nome: this.d.nome, mensagem: m.maisNovo });
        lido = bruto === null ? null : a.ler(bruto);
        if (lido) {
          await a.importar(lido);
          remota = a.assinatura(lido);
        } else {
          invalido = true;
        }
      }
      const { envelope, outros } = await a.exportar(lido);
      if (!texto.trim() || invalido || a.assinatura(envelope) !== remota) await this.d.arquivo.gravar(JSON.stringify(envelope, null, 2));
      return this.status({
        estado: "ok",
        quando: agora,
        nome: this.d.nome,
        mensagem: invalido ? m.regravado : outros ? m.outros(outros) : undefined,
      });
    } catch (e) {
      const nome = (e as { name?: string } | null)?.name;
      if (nome === "NotAllowedError" || nome === "SecurityError") {
        return this.status({ estado: "permissao", quando: agora, nome: this.d.nome, mensagem: m.permissao });
      }
      return this.status({ estado: "erro", quando: agora, nome: this.d.nome, mensagem: e instanceof Error ? e.message : String(e) });
    }
  }

  private async status(s: StatusArquivo): Promise<StatusArquivo> {
    await this.d.area.gravar({ [this.d.chaveStatus]: s });
    return s;
  }
}

/* ---- File System Access (Chrome/Edge) ---- */

interface Permissivel {
  queryPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
  requestPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
}
export type HandleArquivo = FileSystemFileHandle & Permissivel;

export function temSeletorDeArquivo(w: unknown = globalThis): boolean {
  return typeof (w as { showSaveFilePicker?: unknown }).showSaveFilePicker === "function";
}

export function arquivoDoHandle(handle: HandleArquivo): ArquivoSync {
  return {
    ler: async () => (await handle.getFile()).text(),
    gravar: async (conteudo) => {
      const w = await handle.createWritable();
      await w.write(conteudo);
      await w.close();
    },
  };
}

/** "granted" sem perguntar; "prompt" pede gesto do usuário (botão "Reconectar arquivo"). */
export async function permissao(handle: HandleArquivo, pedir: boolean): Promise<PermissionState> {
  const o = { mode: "readwrite" as const };
  const atual = (await handle.queryPermission?.(o)) ?? "granted";
  if (atual === "granted" || !pedir) return atual;
  return (await handle.requestPermission?.(o)) ?? "denied";
}

export interface ArmazemHandles {
  ler(d: Dono): Promise<HandleArquivo | undefined>;
  guardar(d: Dono, h: HandleArquivo): Promise<unknown>;
  esquecer(d: Dono): Promise<unknown>;
}

/** O handle fica no IndexedDB da extensão (o storage do navegador não guarda handles), no banco do módulo. */
export function handlesNoIndexedDB(banco: string, fabrica?: IDBFactory): ArmazemHandles {
  const chave = (d: Dono) => `${d.host}|${d.login.toLowerCase()}`;
  return {
    ler: (d) =>
      noDeposito<HandleArquivo | undefined>(
        banco,
        "arquivos",
        "readonly",
        (s) => s.get(chave(d)) as IDBRequest<HandleArquivo | undefined>,
        fabrica,
      ),
    guardar: (d, h) => noDeposito(banco, "arquivos", "readwrite", (s) => s.put(h, chave(d)), fabrica),
    esquecer: (d) => noDeposito(banco, "arquivos", "readwrite", (s) => s.delete(chave(d)), fabrica),
  };
}

export interface DepsControleArquivo<E> {
  area: Area;
  dono: Dono;
  /** Onde o StatusArquivo fica na área local. */
  chaveStatus: string;
  handles: ArmazemHandles;
  /** Seletor do navegador (precisa de gesto do usuário): "novo" = Salvar como, "existente" = Abrir. */
  escolher(modo: "novo" | "existente"): Promise<HandleArquivo | null>;
  adaptador: AdaptadorArquivo<E>;
  atraso?: number;
}

/** O arquivo no app: escolher, reconectar, sincronizar ao abrir/ganhar foco e `atraso` (15 s) depois de mudar. */
export class ControleArquivo<E> {
  private espera: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly d: DepsControleArquivo<E>) {}

  async configurado(): Promise<boolean> {
    return Boolean(await this.d.handles.ler(this.d.dono).catch(() => undefined));
  }

  async status(): Promise<StatusArquivo | null> {
    const k = this.d.chaveStatus;
    return ((await this.d.area.obter(k))[k] as StatusArquivo | undefined) ?? null;
  }

  /** null quando não há arquivo escolhido. `pedir` só com gesto do usuário. */
  async sincronizar(pedir = false): Promise<StatusArquivo | null> {
    const h = await this.d.handles.ler(this.d.dono).catch(() => undefined);
    if (!h) return null;
    if ((await permissao(h, pedir).catch(() => "denied" as PermissionState)) !== "granted") {
      const s: StatusArquivo = {
        estado: "permissao",
        quando: Date.now(),
        nome: h.name,
        mensagem: this.d.adaptador.mensagens?.permissao ?? MENSAGENS_ARQUIVO.permissao,
      };
      await this.d.area.gravar({ [this.d.chaveStatus]: s });
      return s;
    }
    return new SincroniaArquivo<E>({
      area: this.d.area,
      chaveStatus: this.d.chaveStatus,
      arquivo: arquivoDoHandle(h),
      adaptador: this.d.adaptador,
      nome: h.name,
    }).sincronizar();
  }

  async escolher(modo: "novo" | "existente" = "novo"): Promise<StatusArquivo | null> {
    const h = await this.d.escolher(modo);
    if (!h) return null;
    await this.d.handles.guardar(this.d.dono, h);
    return this.sincronizar(true);
  }

  reconectar(): Promise<StatusArquivo | null> {
    return this.sincronizar(true);
  }

  async esquecer(): Promise<void> {
    clearTimeout(this.espera);
    await this.d.handles.esquecer(this.d.dono);
    await this.d.area.remover(this.d.chaveStatus);
  }

  agendar(): void {
    clearTimeout(this.espera);
    this.espera = setTimeout(() => void this.sincronizar().catch(() => undefined), this.d.atraso ?? 15_000);
  }

  parar(): void {
    clearTimeout(this.espera);
  }
}

/** Seletor de arquivo do navegador (File System Access). Cancelar devolve null. */
export async function escolherArquivoSync(
  modo: "novo" | "existente",
  nomeSugerido: string,
  descricao: string,
  janela: unknown = globalThis,
): Promise<HandleArquivo | null> {
  const tipos = [{ description: descricao, accept: { "application/json": [".json"] } }];
  const w = janela as {
    showSaveFilePicker(o: unknown): Promise<HandleArquivo>;
    showOpenFilePicker(o: unknown): Promise<HandleArquivo[]>;
  };
  try {
    if (modo === "novo") return await w.showSaveFilePicker({ suggestedName: nomeSugerido, types: tipos });
    return (await w.showOpenFilePicker({ types: tipos, multiple: false }))[0] ?? null;
  } catch (e) {
    if ((e as { name?: string }).name === "AbortError") return null;
    throw e;
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `300 ok, 0 falha(s)`; tsc sem saída; biome sem erro.
Run: `node -e 'for (const f of process.argv.slice(1)) console.log(f, require("fs").readFileSync(f, "utf8").includes(String.fromCharCode(0xfeff)))' src/sincronia/arquivo.ts tests/verificar-arquivo.ts`
Expected: `false` nos dois (nenhum BOM cru no fonte).

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/sincronia/arquivoSync.ts` inteiro (mesmo formato, mesma chave de status, mesmo banco, mesma mensagem "uma lista / N listas"):

```ts
/**
 * Sincronia por arquivo (spec 9.3): um .json numa pasta que o próprio usuário
 * já sincroniza (OneDrive, Google Drive, Dropbox, rede). Leva TODAS as listas
 * do usuário, inclusive a Pessoal: é o backup completo e legível.
 *
 * A mecânica (File System Access, handle no IndexedDB, permissão, mescla,
 * regravação do ilegível) é a genérica da sei-comum (`@comum/sincronia/arquivo`);
 * aqui fica o adaptador do envelope dos favoritos.
 */

import type { Area } from "@comum/armazenamento/area";
import {
  type AdaptadorArquivo,
  type ArmazemHandles,
  type ArquivoSync,
  ControleArquivo as ControleArquivoComum,
  type HandleArquivo,
  handlesNoIndexedDB as handlesNoBanco,
  SincroniaArquivo as SincroniaArquivoComum,
} from "@comum/sincronia/arquivo";
import { type Envelope, exportarTudo, importarEnvelope, lerEnvelope } from "../arquivo";
import type { Carimbo } from "../modelo/tipos";
import { assinaturaEnvelope } from "./assinatura";
import type { Dono } from "./copias";

export {
  type ArquivoSync,
  arquivoDoHandle,
  type HandleArquivo,
  permissao,
  type StatusArquivo,
  temSeletorDeArquivo,
} from "@comum/sincronia/arquivo";

export const chaveStatusArquivo = (d: Dono): string => `favoritos/sync/arquivo/${d.host}|${d.login.toLowerCase()}`;

export function adaptadorArquivoFavoritos(area: Area, dono: Dono, carimbo: () => Carimbo): AdaptadorArquivo<Envelope> {
  return {
    formato: "seipro-favoritos",
    versao: 1,
    ler: (bruto) => lerEnvelope(bruto)?.envelope ?? null,
    importar: (env) => importarEnvelope(area, env, carimbo, dono),
    async exportar(lido) {
      const meu = await exportarTudo(area, dono.host, dono.login, carimbo());
      // Listas de outro SEI ou usuário (o mesmo arquivo escolhido em dois lugares): ficam como estão.
      const outros = (lido?.escopos ?? []).filter(
        (e) => e.escopo.host !== dono.host || e.escopo.login.toLowerCase() !== dono.login.toLowerCase(),
      );
      return { envelope: { ...meu, escopos: [...meu.escopos, ...outros] }, outros: outros.length };
    },
    assinatura: assinaturaEnvelope,
    mensagens: {
      outros: (n) => `O arquivo também tem ${n === 1 ? "uma lista" : `${n} listas`} de outro usuário ou outro SEI, que foram mantidas.`,
    },
  };
}

export class SincroniaArquivo extends SincroniaArquivoComum<Envelope> {
  constructor(d: { area: Area; dono: Dono; arquivo: ArquivoSync; carimbo: () => Carimbo; nome?: string }) {
    super({
      area: d.area,
      chaveStatus: chaveStatusArquivo(d.dono),
      arquivo: d.arquivo,
      nome: d.nome,
      adaptador: adaptadorArquivoFavoritos(d.area, d.dono, d.carimbo),
    });
  }
}

/** O handle fica no IndexedDB da extensão, banco "seipro-favoritos" (o mesmo de sempre). */
export const handlesNoIndexedDB = (nome = "seipro-favoritos"): ArmazemHandles => handlesNoBanco(nome);

export interface DepsControleArquivo {
  area: Area;
  dono: Dono;
  handles: ArmazemHandles;
  /** Seletor do navegador (precisa de gesto do usuário): "novo" = Salvar como, "existente" = Abrir. */
  escolher(modo: "novo" | "existente"): Promise<HandleArquivo | null>;
  carimbo: () => Carimbo;
  atraso?: number;
}

/** O arquivo no app: escolher, reconectar, sincronizar ao abrir/ganhar foco e 15 s depois de mudar. */
export class ControleArquivo extends ControleArquivoComum<Envelope> {
  constructor(d: DepsControleArquivo) {
    super({
      area: d.area,
      dono: d.dono,
      chaveStatus: chaveStatusArquivo(d.dono),
      handles: d.handles,
      escolher: d.escolher,
      atraso: d.atraso,
      adaptador: adaptadorArquivoFavoritos(d.area, d.dono, d.carimbo),
    });
  }
}
```

Em `favoritos/src/app/main.ts`:

(a) linhas 17-18 — trocar

```ts
import { PonteLateral } from "@comum/ponte/lateral";
import { ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
```

por

```ts
import { PonteLateral } from "@comum/ponte/lateral";
import { ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import { escolherArquivoSync } from "@comum/sincronia/arquivo";
```

(b) linha 28 — trocar `import { ControleArquivo, type HandleArquivo, handlesNoIndexedDB, temSeletorDeArquivo } from "../sincronia/arquivoSync";` por

```ts
import { ControleArquivo, handlesNoIndexedDB, temSeletorDeArquivo } from "../sincronia/arquivoSync";
```

(c) linha 344 — trocar

```ts
          escolher: (modo) => escolherArquivoSync(modo, `favoritos-seipro-${ctx.login.toLowerCase()}-${ctx.host}.json`),
```

por

```ts
          escolher: (modo) =>
            escolherArquivoSync(modo, `favoritos-seipro-${ctx.login.toLowerCase()}-${ctx.host}.json`, "Favoritos do SEI Pro"),
```

(d) apagar as linhas 349-364 (a linha em branco e a função local `escolherArquivoSync` no fim do arquivo):

```ts

/** Seletor de arquivo do navegador (File System Access). Cancelar devolve null. */
async function escolherArquivoSync(modo: "novo" | "existente", nomeSugerido = "favoritos-seipro.json"): Promise<HandleArquivo | null> {
  const tipos = [{ description: "Favoritos do SEI Pro", accept: { "application/json": [".json"] } }];
  const w = window as unknown as {
    showSaveFilePicker(o: unknown): Promise<HandleArquivo>;
    showOpenFilePicker(o: unknown): Promise<HandleArquivo[]>;
  };
  try {
    if (modo === "novo") return await w.showSaveFilePicker({ suggestedName: nomeSugerido, types: tipos });
    return (await w.showOpenFilePicker({ types: tipos, multiple: false }))[0] ?? null;
  } catch (e) {
    if ((e as { name?: string }).name === "AbortError") return null;
    throw e;
  }
}
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)` (inclui `verificar-copias.ts` dos Favoritos: arquivo, arquivo estragado, versão mais nova, outro SEI); tsc sem saída; biome `Found 1 warning.`; build **sem `ERRO:`** (é aqui que um BOM cru, U+FEFF, dentro de regex apareceria).
Run: `git status --short dist`
Expected: só ` M dist/js/favoritos/app.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/sincronia/arquivo.ts sei-comum/tests/adaptadorTeste.ts sei-comum/tests/verificar-arquivo.ts sei-comum/tests/verificar.ts \
  favoritos/src/sincronia/arquivoSync.ts favoritos/src/app/main.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: sincronia por arquivo generica (Favoritos migram)

SincroniaArquivo e ControleArquivo com adaptador por modulo, handle no banco
do modulo e seletor de arquivo parametrizado. O BOM do Bloco de Notas sai por
charCodeAt (sem regex com escape). Os Favoritos mantem formato e mensagens.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 7: Diálogos dos apps (Favoritos e Histórico)

**Files:**
- Create: `sei-comum/src/ui/dialogo.ts`, `sei-comum/tests/verificar-dialogo.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/app/main.ts:21,32,238-318,331`, `favoritos/src/app/app.ts:12,59`
- Modify: `historico/src/app/main.ts:21-22,26,42,254-326`, `historico/src/app/app.ts:14,38`
- Regerar: `dist/js/favoritos/app.js`, `dist/js/historico/app.js`

**Interfaces:**
- Consumes: `h`, `icone`, `NomeIcone` (`@comum/ui/dom`); `tique`, `botao`, `disparar` (testes).
- Produces:
  - `interface OpcoesModal { titulo: string; conteudo: HTMLElement; icone?: NomeIcone; aoFechar?: () => void }`; `type AbrirModal = (o: OpcoesModal) => { fechar(): void }` (estruturalmente o mesmo `AbrirModal` dos dois apps, que passam a reexportar este).
  - `criarAbrirModal(g?: { aoAbrir?: () => void; aoFechar?: () => void }): AbrirModal` (o painel embutido passa os ganchos da sobreposição).
  - `criarConfirmar(abrirModal: AbrirModal): (texto: string, rotuloOk?: string) => Promise<boolean>`.
  - `baixar(nome: string, conteudo: string, tipo: string, revogarEm = 10_000): void`.
  - `escolherArquivo(aceitar = ".json,application/json"): Promise<string | null>`.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-dialogo.ts` (o `fingirDialogos` dá ao protótipo do linkedom o `showModal`/`close`/`open` e devolve como estava):

```ts
import { baixar, criarAbrirModal, criarConfirmar, escolherArquivo } from "../src/ui/dialogo";
import { h } from "../src/ui/dom";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";

type Proto = Record<string, unknown>;

/** `<dialog>` do navegador: o linkedom não tem showModal/close/open (o protótipo é o de todo elemento). */
function fingirDialogos(doc: Document): () => void {
  const proto = Object.getPrototypeOf(doc.createElement("dialog")) as Proto;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  proto.showModal = function (this: HTMLElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Ev("close"));
  };
  Object.defineProperty(proto, "open", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("open");
    },
  });
  return () => {
    for (const k of ["showModal", "close", "open"]) Reflect.deleteProperty(proto, k);
  };
}

export async function verificarDialogo(): Promise<void> {
  secao("dialogo: abrir e fechar");
  const doc = instalarDom();
  const restaurar = fingirDialogos(doc);
  const ganchos: string[] = [];
  const abrirModal = criarAbrirModal({ aoAbrir: () => ganchos.push("abriu"), aoFechar: () => ganchos.push("fechou") });
  const campo = h("input", { type: "text" });
  let focado = false;
  campo.focus = () => {
    focado = true;
  };
  let fechouNoApp = 0;
  const hostil = '<img src=x onerror="alert(1)">';
  const m = abrirModal({ titulo: hostil, conteudo: h("div", {}, campo), icone: "nuvem", aoFechar: () => fechouNoApp++ });
  const dlg = doc.querySelector("dialog.spro-dialogo");
  checar("abre um dialog modal no body", dlg?.hasAttribute("open") === true && dlg.parentElement === doc.body);
  checar("titulo hostil aparece como texto", dlg?.querySelector("h2")?.textContent === hostil && !dlg.querySelector("img"));
  checar("rotulo acessivel e icone", dlg?.getAttribute("aria-label") === hostil && !!dlg.querySelector(".spro-dialogo-icone svg"));
  checar("foco no primeiro campo do corpo", focado);
  checar("gancho de abrir antes de mostrar", ganchos.join() === "abriu");
  m.fechar();
  checar(
    "fechar tira da pagina e avisa o painel e o app",
    !doc.querySelector("dialog") && ganchos.join() === "abriu,fechou" && fechouNoApp === 1,
  );
  m.fechar();
  checar("fechar de novo nao faz nada", fechouNoApp === 1);
  abrirModal({ titulo: "X", conteudo: h("p", {}, "oi") });
  botao(doc.body, "Fechar")!.click();
  checar("o X do cabecalho fecha", !doc.querySelector("dialog"));

  secao("dialogo: confirmar");
  const confirmar = criarConfirmar(abrirModal);
  const sim = confirmar("Apagar o projeto?", "Apagar");
  botao(doc.body, "Apagar")!.click();
  checar("botao de confirmar (rotulo proprio): true", (await sim) === true && !doc.querySelector("dialog"));
  const nao = confirmar("Apagar?");
  botao(doc.body, "Cancelar")!.click();
  checar("cancelar: false", (await nao) === false);
  const esc = confirmar("Apagar?");
  (doc.querySelector("dialog") as HTMLDialogElement).close();
  checar("Esc (close do navegador): false", (await esc) === false);
  const padrao = confirmar("Texto <b>do</b> usuario");
  checar(
    "rotulo padrao Confirmar, texto como texto",
    !!botao(doc.body, "Confirmar") && doc.querySelector("dialog p")?.textContent === "Texto <b>do</b> usuario",
  );
  botao(doc.body, "Confirmar")!.click();
  await padrao;
  restaurar();

  secao("dialogo: baixar e escolher arquivo");
  const docB = instalarDom();
  const urlOriginal = { criar: URL.createObjectURL, revogar: URL.revokeObjectURL };
  const blobs: Blob[] = [];
  const revogados: string[] = [];
  URL.createObjectURL = (b: Blob | MediaSource) => {
    blobs.push(b as Blob);
    return "blob:teste/1";
  };
  URL.revokeObjectURL = (u: string) => {
    revogados.push(u);
  };
  let anchor: HTMLAnchorElement | null = null;
  let cliques = 0;
  const anexar = docB.body.append.bind(docB.body);
  docB.body.append = (...nos: Array<Node | string>) => {
    anchor = nos[0] as HTMLAnchorElement;
    anchor.addEventListener("click", () => cliques++);
    anexar(...nos);
  };
  baixar("projetos.csv", "a;b", "text/csv;charset=utf-8", 5);
  const a = anchor as HTMLAnchorElement | null;
  checar(
    "link com o nome e o endereco do blob, clicado e retirado",
    a?.getAttribute("download") === "projetos.csv" && a.getAttribute("href") === "blob:teste/1" && cliques === 1 && !a.isConnected,
  );
  checar("conteudo e tipo", (await blobs[0]?.text()) === "a;b" && blobs[0]?.type === "text/csv;charset=utf-8");
  await tique(20);
  checar("libera o endereco depois", revogados.join() === "blob:teste/1");
  URL.createObjectURL = urlOriginal.criar;
  URL.revokeObjectURL = urlOriginal.revogar;

  const proto = Object.getPrototypeOf(docB.createElement("input")) as Proto;
  const cliqueOriginal = proto.click;
  let entrada: HTMLInputElement | null = null;
  proto.click = function (this: HTMLElement) {
    if (this.localName === "input") entrada = this as HTMLInputElement;
  };
  const escolhido = escolherArquivo(".json");
  const i = entrada as HTMLInputElement | null;
  checar("input de arquivo com o filtro pedido", i?.getAttribute("type") === "file" && i.getAttribute("accept") === ".json");
  if (i) {
    Object.defineProperty(i, "files", { value: [{ text: async () => '{"ok":true}' }] });
    disparar(i, "change");
  }
  checar("devolve o texto do arquivo", (await escolhido) === '{"ok":true}');
  const cancelado = escolherArquivo();
  if (entrada) disparar(entrada as HTMLInputElement, "cancel");
  checar("cancelar: null", (await cancelado) === null);
  proto.click = cliqueOriginal;
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarDialogo } from "./verificar-dialogo";` logo depois de `import { verificarDatas } from "./verificar-datas";`, e `await verificarDialogo();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/ui/dialogo'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/ui/dialogo.ts`:

```ts
/**
 * Diálogos das páginas da extensão (apps dos Favoritos, do Histórico e do
 * Projetos): o `<dialog>` modal com cabeçalho (ícone, título, X) e corpo; a
 * confirmação; o download; o seletor de arquivo. Tudo por `h()`: título e
 * textos entram como texto, nunca como HTML.
 */

import { h, icone, type NomeIcone } from "./dom";

export interface OpcoesModal {
  titulo: string;
  conteudo: HTMLElement;
  icone?: NomeIcone;
  aoFechar?: () => void;
}

export type AbrirModal = (o: OpcoesModal) => { fechar(): void };

/** O primeiro campo do corpo (e não o X do cabeçalho, o primeiro focável da árvore). */
const PRIMEIRO_CAMPO =
  ".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";

/**
 * `aoAbrir`/`aoFechar`: o painel embutido usa para pôr o iframe por cima da
 * tela enquanto há diálogo (painel/sobreposicao.ts). O mais novo fica por cima (top layer).
 */
export function criarAbrirModal(g: { aoAbrir?: () => void; aoFechar?: () => void } = {}): AbrirModal {
  return ({ titulo, conteudo, icone: nome, aoFechar }) => {
    const dlg = h("dialog", { class: "spro-dialogo", "aria-label": titulo });
    const fechar = () => {
      if (dlg.open) dlg.close();
    };
    dlg.append(
      h(
        "header",
        {},
        nome ? h("span", { class: "spro-dialogo-icone", "aria-hidden": "true" }, icone(nome, 18)) : null,
        h("h2", {}, titulo),
        h(
          "button",
          { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", title: "Fechar (Esc)", onclick: fechar },
          icone("fechar", 16),
        ),
      ),
      h("div", { class: "spro-dialogo-corpo" }, conteudo),
    );
    dlg.addEventListener("close", () => {
      dlg.remove();
      g.aoFechar?.();
      aoFechar?.();
    });
    document.body.append(dlg);
    g.aoAbrir?.();
    dlg.showModal();
    dlg.querySelector<HTMLElement>(PRIMEIRO_CAMPO)?.focus({ preventScroll: true });
    return { fechar };
  };
}

/** "Confirmar" ou "Cancelar" (Esc e X também cancelam). */
export function criarConfirmar(abrirModal: AbrirModal): (texto: string, rotuloOk?: string) => Promise<boolean> {
  return (texto, rotuloOk = "Confirmar") =>
    new Promise<boolean>((ok) => {
      let resposta = false;
      let modal: { fechar(): void } | null = null;
      const corpo = h(
        "div",
        {},
        h("p", {}, texto),
        h(
          "div",
          { class: "spro-dialogo-rodape" },
          h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, "Cancelar"),
          h(
            "button",
            {
              type: "button",
              class: "spro-botao perigo",
              onclick: () => {
                resposta = true;
                modal?.fechar();
              },
            },
            rotuloOk,
          ),
        ),
      );
      modal = abrirModal({ titulo: "Confirmar", icone: "alerta", conteudo: corpo, aoFechar: () => ok(resposta) });
    });
}

/** Baixa um texto como arquivo; o endereço temporário é liberado `revogarEm` ms depois. */
export function baixar(nome: string, conteudo: string, tipo: string, revogarEm = 10_000): void {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = h("a", { href: url, download: nome });
  document.body.append(a);
  a.click();
  a.remove();
  const t = setTimeout(() => URL.revokeObjectURL(url), revogarEm);
  // Só libera memória: não pode segurar o processo dos testes (Node) aberto.
  (t as unknown as { unref?: () => void }).unref?.();
}

/** O seletor de arquivo comum (sem File System Access): o texto do arquivo, ou null se cancelou. */
export function escolherArquivo(aceitar = ".json,application/json"): Promise<string | null> {
  return new Promise<string | null>((ok) => {
    const i = h("input", { type: "file", accept: aceitar });
    i.addEventListener("change", async () => {
      const f = i.files?.[0];
      ok(f ? await f.text() : null);
    });
    i.addEventListener("cancel", () => ok(null));
    i.click();
  });
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `318 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Em `favoritos/src/app/main.ts`:

(a) linha 21 (`import { h, icone } from "@comum/ui/dom";`) — acrescentar antes dela

```ts
import { baixar, criarAbrirModal, criarConfirmar, escolherArquivo } from "@comum/ui/dialogo";
```

(b) linha 32 — trocar `import { type AbrirModal, AppFavoritos } from "./app";` por `import { AppFavoritos } from "./app";`

(c) linhas 238-318 — apagar desde `  const abrirModal: AbrirModal = ({ titulo, conteudo, icone: nome, aoFechar }) => {` até o fim de `const escolherArquivo = () => ...` (a linha `    });` antes da linha em branco que precede `  return new AppFavoritos(raiz, {`) e pôr no lugar:

```ts
  // Com o painel embutido, o diálogo põe o iframe por cima da tela (aoAbrirModal/aoFecharModal).
  const abrirModal = criarAbrirModal({ aoAbrir: g.aoAbrirModal, aoFechar: g.aoFecharModal });
  const confirmar = criarConfirmar(abrirModal);
```

(d) linha 331 — trocar `    escolherArquivo,` por `    escolherArquivo: () => escolherArquivo(),`

Em `favoritos/src/app/app.ts`:

(a) linha 12 (`import { h, icone, type NomeIcone } from "@comum/ui/dom";`) — acrescentar antes dela `import type { AbrirModal } from "@comum/ui/dialogo";`

(b) linha 59 — trocar `export type AbrirModal = (o: { titulo: string; conteudo: HTMLElement; icone?: NomeIcone; aoFechar?: () => void }) => { fechar(): void };` por `export type { AbrirModal } from "@comum/ui/dialogo";` (as provas importam `AbrirModal` de `../src/app/app` e continuam importando).

- [ ] **Step 6: Migrar o Histórico**

Em `historico/src/app/main.ts`:

(a) linhas 21-22 — trocar

```ts
import { ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import { h, icone } from "@comum/ui/dom";
```

por

```ts
import { ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
import { baixar, criarAbrirModal, criarConfirmar } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
```

(b) linha 26 — trocar `import { type AbrirModal, AppHistorico } from "./app";` por `import { AppHistorico } from "./app";`

(c) depois da linha 41 (`const mensagem = (e: unknown): string => (e instanceof Error ? e.message : String(e));`), acrescentar (antes de `if (lateral)`, para não haver uso antes da declaração):

```ts

/** Diálogos do app: <dialog> modais irmãos do modal, e o mais novo fica por cima (top layer). */
const abrirModal = criarAbrirModal();
const confirmar = criarConfirmar(abrirModal);
```

(d) linhas 253-326 — apagar do fim do arquivo a linha em branco e os três blocos: `/** Diálogos do app: ... */ const abrirModal: AbrirModal = ...`, `function confirmar(...)` e `function baixar(...)`. O arquivo passa a terminar no `}` de `abrirOpcoes`.

Em `historico/src/app/app.ts`:

(a) linha 14 (`import { h, icone, type NomeIcone } from "@comum/ui/dom";`) — acrescentar antes dela `import type { AbrirModal } from "@comum/ui/dialogo";`

(b) linha 38 — trocar `export type AbrirModal = (o: { titulo: string; conteudo: HTMLElement; icone?: NomeIcone; aoFechar?: () => void }) => { fechar(): void };` por `export type { AbrirModal } from "@comum/ui/dialogo";`

- [ ] **Step 7: Sem regressão, builds**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)`; tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `cd historico && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `485 ok, 0 falha(s)`; tsc sem saída; biome sem aviso nem erro; build termina na tabela "Historico -- build" sem `ERRO:`.
Run: `git status --short dist`
Expected: ` M dist/js/favoritos/app.js` e ` M dist/js/historico/app.js`.

- [ ] **Step 8: Commit**

```bash
git add sei-comum/src/ui/dialogo.ts sei-comum/tests/verificar-dialogo.ts sei-comum/tests/verificar.ts \
  favoritos/src/app/main.ts favoritos/src/app/app.ts historico/src/app/main.ts historico/src/app/app.ts \
  dist/js/favoritos/app.js dist/js/historico/app.js
git commit -F - <<'EOF'
Comum: dialogos dos apps (Favoritos e Historico migram)

abrirModal, confirmar, baixar e escolher arquivo, que estavam duplicados nos
dois apps, vao para sei-comum/src/ui/dialogo.ts.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 8: Altura, sobreposição e aviso do painel embutido

**Files:**
- Create: `sei-comum/src/painel/altura.ts`, `sei-comum/src/painel/sobreposicao.ts`, `sei-comum/src/painel/aviso.ts`, `sei-comum/tests/verificar-painel-app.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/pagina/sobreposicao.ts` e `favoritos/src/pagina/aviso.ts` (reescrever: fachadas), `favoritos/src/app/main.ts:15,20,32,75-84,165-210`
- Delete: `favoritos/src/app/altura.ts`
- Regerar: `dist/js/init_favoritos.js`, `dist/js/favoritos/app.js`

**Interfaces:**
- Consumes: `Rpc`, `EmissorAviso`, `mostrarAviso`, `h` (comum); `tique`, `botao`, `disparar`, `lanca` (testes).
- Produces:
  - `interface AlturaDoApp { minimo(px: number): void; extra(px: number): void; medir(): void }`; `observarAltura(rpc: Pick<Rpc, "chamar">, raiz?: HTMLElement): AlturaDoApp` (RPC `altura` com `{ px }`).
  - `interface Sobreposicao { ligar(ativo: boolean): boolean; altura(px: number): void }`; `criarSobreposicao(doc: Document, iframe: HTMLIFrameElement, reserva: HTMLElement): Sobreposicao` (lado da aba).
  - `sobreposicaoNoApp(rpc: Pick<Rpc, "chamar">, altura: Pick<AlturaDoApp, "minimo">, o?: { doc?: Document; espera?: number }): { abrir(): void; fechar(): void }` (lado do app; RPC `sobrepor` com `{ ativo }`; marca `<html data-sobreposto="abrindo|sim|falhou">`).
  - `type AvisarNaPagina = (texto: string, acao: string | undefined, ms: number) => Promise<boolean>`; `validarPrefixo(prefixo: string): string` (lança se não for `^[a-z][a-z0-9-]*$`).
  - `avisoNaPagina(doc: Document, temaEscuro: boolean, prefixo = "spro-painel"): AvisarNaPagina` (classe `<prefixo>-aviso`, animação `<prefixo>-aviso`).
  - `emissorDeAvisoPelaPagina(rpc: Pick<Rpc, "chamar">, doc?: Document): EmissorAviso` (RPC `aviso` com `{ texto, acao, ms }` e prazo `ms + 5000`).

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-painel-app.ts`:

```ts
import { observarAltura } from "../src/painel/altura";
import { avisoNaPagina, emissorDeAvisoPelaPagina } from "../src/painel/aviso";
import { criarSobreposicao, sobreposicaoNoApp } from "../src/painel/sobreposicao";
import type { Rpc } from "../src/ponte/rpc";
import { botao, checar, disparar, instalarDom, lanca, secao, tique } from "./util";

/** Um rpc que só anota o que o app pediu; `responder` decide a resposta de cada operação. */
function rpcFalso(responder: (op: string, args: unknown) => Promise<unknown> = async () => true) {
  const chamadas: Array<{ op: string; args: unknown; prazo?: number }> = [];
  const rpc: Pick<Rpc, "chamar"> = {
    chamar: <T>(op: string, args?: unknown, prazo?: number) => {
      chamadas.push({ op, args, prazo });
      return responder(op, args) as Promise<T>;
    },
  };
  return { rpc, chamadas };
}

export async function verificarPainelApp(): Promise<void> {
  secao("painel (app): altura do iframe");
  const doc = instalarDom('<html><body><div id="app"></div></body></html>');
  const app = doc.getElementById("app") as HTMLElement;
  let alturaApp = 200;
  app.getBoundingClientRect = () => ({ height: alturaApp }) as DOMRect;
  let aoRedimensionar: () => void = () => undefined;
  const g = globalThis as { ResizeObserver?: unknown };
  const roOriginal = g.ResizeObserver;
  g.ResizeObserver = class {
    constructor(cb: () => void) {
      aoRedimensionar = cb;
    }
    observe() {}
  };
  const { rpc, chamadas } = rpcFalso();
  const alt = observarAltura(rpc, app);
  const pxs = () => chamadas.filter((c) => c.op === "altura").map((c) => (c.args as { px: number }).px);
  checar("pede a altura do conteudo (+4) ao montar", pxs().join() === "204");
  aoRedimensionar();
  checar("mesma altura: nao pede de novo", pxs().length === 1);
  alt.minimo(640);
  alt.extra(900);
  alt.extra(0);
  alt.minimo(0);
  checar("minimo do dialogo e fundo da lista aberta valem enquanto ativos", pxs().join() === "204,640,900,640,204", pxs());
  alturaApp = 300;
  alt.medir();
  checar("medir de novo (ResizeObserver suspenso fora da tela)", pxs().at(-1) === 304);
  g.ResizeObserver = roOriginal;

  secao("painel (app): sobreposicao do dialogo");
  const docS = instalarDom();
  const html = docS.documentElement;
  const minimos: number[] = [];
  const s1 = rpcFalso(async () => true);
  const sob = sobreposicaoNoApp(s1.rpc, { minimo: (px) => minimos.push(px) }, { doc: docS });
  sob.abrir();
  checar("abrindo enquanto a aba responde", html.dataset.sobreposto === "abrindo");
  await tique();
  checar("a aba pos o iframe por cima: sim", html.dataset.sobreposto === "sim" && s1.chamadas[0]?.op === "sobrepor");
  sob.abrir();
  sob.fechar();
  checar("dois dialogos, um fechado: continua", html.dataset.sobreposto === "sim" && s1.chamadas.length === 1);
  sob.fechar();
  checar(
    "o ultimo fecha: desliga na aba e tira o minimo",
    html.dataset.sobreposto === undefined &&
      minimos.join() === "0" &&
      (s1.chamadas[1]?.args as { ativo?: boolean } | undefined)?.ativo === false,
  );
  const s2 = rpcFalso(async () => false);
  const sob2 = sobreposicaoNoApp(s2.rpc, { minimo: (px) => minimos.push(px) }, { doc: docS });
  sob2.abrir();
  await tique();
  checar("painel recolhido (a aba nega): o iframe cresce", html.dataset.sobreposto === "falhou" && minimos.at(-1) === 640);
  sob2.fechar();
  const s3 = rpcFalso(() => new Promise(() => undefined));
  const sob3 = sobreposicaoNoApp(s3.rpc, { minimo: (px) => minimos.push(px) }, { doc: docS, espera: 10 });
  sob3.abrir();
  await tique(30);
  checar("aba sem resposta (versao antiga): cresce depois da espera", html.dataset.sobreposto === "falhou" && minimos.at(-1) === 640);
  sob3.fechar();

  secao("painel (aba): sobreposicao");
  const docP = instalarDom(
    '<html><body><div id="corpo"><iframe id="f" style="width: 100%; height: 300px; border: 0;"></iframe></div></body></html>',
  );
  const fr = docP.getElementById("f") as HTMLIFrameElement;
  const corpo = docP.getElementById("corpo") as HTMLElement;
  const sp = criarSobreposicao(docP, fr, corpo);
  checar(
    "liga: iframe cobre a tela e a pagina trava",
    sp.ligar(true) && fr.style.position === "fixed" && docP.documentElement.style.overflow === "hidden",
  );
  sp.altura(500);
  sp.ligar(false);
  checar(
    "desliga e aplica a altura pedida no meio",
    fr.style.position === "" && fr.style.height === "500px" && docP.documentElement.style.overflow === "",
  );
  corpo.hidden = true;
  checar("painel recolhido: nega e nao trava", !sp.ligar(true) && docP.documentElement.style.overflow === "");
  corpo.hidden = false;
  sp.ligar(true);
  disparar(fr, "load");
  checar("app recarregado com dialogo aberto: destrava sozinho", fr.style.position === "" && docP.documentElement.style.overflow === "");

  secao("painel (aba): aviso no rodape da tela");
  const docA = instalarDom();
  const avisar = avisoNaPagina(docA, false, "spro-prj");
  const hostil = '<img src=x onerror="alert(1)">';
  const resposta = avisar(hostil, "Desfazer", 5000);
  const toast = docA.querySelector(".spro-prj-aviso");
  checar(
    "texto hostil como texto, com a animacao do prefixo",
    toast?.textContent?.includes(hostil) === true &&
      !toast.querySelector("img") &&
      (toast.getAttribute("style") ?? "").includes("animation:spro-prj-aviso"),
  );
  botao(docA.body, "Desfazer")!.click();
  checar("a acao volta ao app", (await resposta) === true && !docA.querySelector(".spro-prj-aviso"));
  void avisar("Primeiro", undefined, 5000);
  const ultimo = avisar("Segundo", undefined, 20);
  checar(
    "um aviso por vez",
    docA.querySelectorAll(".spro-prj-aviso").length === 1 && docA.querySelector(".spro-prj-aviso")?.textContent === "Segundo",
  );
  checar("some sozinho e diz que nao houve acao", (await ultimo) === false);
  checar(
    "prefixo que nao e classe simples e recusado",
    (await lanca(() => avisoNaPagina(docA, false, "x;}body{")))?.message?.includes("Prefixo") === true,
  );

  secao("painel (app): emissor de avisos pela pagina");
  const docE = instalarDom();
  let desfez = 0;
  const e1 = rpcFalso(async () => true);
  const emitir = emissorDeAvisoPelaPagina(e1.rpc, docE);
  checar("manda para a aba", emitir("Projeto excluido.", { rotulo: "Desfazer", fazer: () => desfez++ }, 7000) === true);
  await tique();
  checar(
    "com o rotulo da acao e prazo de resposta maior que o aviso",
    e1.chamadas[0]?.op === "aviso" &&
      (e1.chamadas[0]?.args as { acao?: string } | undefined)?.acao === "Desfazer" &&
      e1.chamadas[0]?.prazo === 12000 &&
      desfez === 1,
  );
  docE.documentElement.dataset.sobreposto = "sim";
  checar("com dialogo sobreposto: o app mostra ele mesmo", emitir("x", undefined, 50) === false && e1.chamadas.length === 1);
  delete docE.documentElement.dataset.sobreposto;
  const e2 = rpcFalso(async () => {
    throw new Error("sem aba");
  });
  emissorDeAvisoPelaPagina(e2.rpc, docE)("Copiado.", undefined, 50);
  await tique();
  checar("aba sem resposta: o aviso aparece no app", docE.querySelector(".spro-aviso")?.textContent?.includes("Copiado.") === true);
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarPainelApp } from "./verificar-painel-app";` logo depois de `import { verificarOpcoes } from "./verificar-opcoes";`, e `await verificarPainelApp();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/painel/altura'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/painel/altura.ts` (era `favoritos/src/app/altura.ts`, com a raiz como parâmetro):

```ts
/**
 * Lado do app de um painel embutido (iframe abaixo da lista do SEI): o iframe
 * cresce com o conteúdo (a página do SEI rola, não o iframe). O app mede a
 * própria altura e pede à aba (RPC `altura`). Enquanto um <dialog> está aberto
 * sem a sobreposição, pede uma altura mínima: o diálogo seria cortado.
 */

import type { Rpc } from "../ponte/rpc";

export interface AlturaDoApp {
  /** Altura mínima (diálogo aberto sem sobreposição); 0 = nenhuma. */
  minimo(px: number): void;
  /** Até onde desce a lista de um seletor ou menu aberto (ui/flutuante.ts); 0 = nenhum aberto. */
  extra(px: number): void;
  /** Mede de novo (fora da tela o Chrome suspende o ResizeObserver de iframe de outra origem). */
  medir(): void;
}

export function observarAltura(rpc: Pick<Rpc, "chamar">, raiz: HTMLElement = document.getElementById("app") ?? document.body): AlturaDoApp {
  let minimo = 0;
  let fundo = 0;
  let ultima = 0;
  const enviar = () => {
    const px = Math.max(Math.ceil(raiz.getBoundingClientRect().height) + 4, minimo, fundo);
    if (px === ultima) return;
    ultima = px;
    void rpc.chamar("altura", { px }).catch(() => undefined);
  };
  new ResizeObserver(enviar).observe(raiz);
  enviar();
  return {
    minimo(px) {
      minimo = px;
      enviar();
    },
    extra(px) {
      fundo = px;
      enviar();
    },
    // Ler a geometria força o layout mesmo com a renderização do iframe suspensa.
    medir: enviar,
  };
}
```

Criar `sei-comum/src/painel/sobreposicao.ts` (o lado da aba é o `favoritos/src/pagina/sobreposicao.ts` de antes, sem mudança; o lado do app é a função `sobreposicao` de `favoritos/src/app/main.ts` — linhas 170-207 em `9eda964` —, com `doc` e `espera` como opções):

```ts
/**
 * Diálogo do painel embutido no meio da tela visível: o iframe do app vive
 * abaixo da lista de processos e cresce com o conteúdo; um `<dialog>` dentro
 * dele ficaria centralizado na altura do PAINEL, às vezes lá embaixo, fora da
 * vista. Enquanto há diálogo aberto, o iframe vira uma camada fixa sobre a tela
 * inteira (o app deixa o próprio fundo transparente e só o diálogo e o véu
 * aparecem), uma reserva da mesma altura segura o lugar dele na página e a
 * rolagem da página trava. Ao fechar, tudo volta como estava.
 *
 * Dois lados: `criarSobreposicao` na aba do SEI (content script, RPC
 * `sobrepor`) e `sobreposicaoNoApp` no app (os ganchos de abrir/fechar diálogo).
 */

import type { Rpc } from "../ponte/rpc";
import type { AlturaDoApp } from "./altura";

export interface Sobreposicao {
  ligar(ativo: boolean): boolean;
  /** Altura pedida pelo app: durante a sobreposição, fica para depois. */
  altura(px: number): void;
}

const CAMADA =
  "position:fixed;inset:0;left:0;top:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;z-index:2147483646;background:transparent;";

export function criarSobreposicao(doc: Document, iframe: HTMLIFrameElement, reserva: HTMLElement): Sobreposicao {
  let salvo: { iframe: string; reserva: string; travados: Array<[HTMLElement, string]> } | null = null;
  let pendente: number | null = null;

  const aplicarAltura = (px: number) => {
    iframe.style.height = `${Math.max(80, Math.min(Math.round(px), 20000))}px`;
  };

  /** html, body e os ancestrais do iframe que rolam (o SEI 4+ rola dentro de divs). */
  const rolaveis = (): HTMLElement[] => {
    const lista: HTMLElement[] = [doc.documentElement];
    if (doc.body) lista.push(doc.body);
    const visao = doc.defaultView;
    for (let el = iframe.parentElement; el && el !== doc.body && el !== doc.documentElement; el = el.parentElement) {
      try {
        const oy = visao?.getComputedStyle?.(el).overflowY ?? "";
        if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) lista.push(el);
      } catch {
        /* sem estilo computado (testes) */
      }
    }
    return lista;
  };

  const visivel = () => {
    if (!iframe.isConnected || reserva.hidden || reserva.closest?.("[hidden]")) return false;
    return typeof iframe.getClientRects !== "function" || iframe.getClientRects().length > 0;
  };

  const api: Sobreposicao = {
    ligar(ativo) {
      // Painel recolhido (ou fora da página): o diálogo nem apareceria, e a página ficaria travada sem motivo visível.
      if (ativo && !salvo && !visivel()) return false;
      if (ativo && !salvo) {
        const alturaAtual = iframe.getBoundingClientRect?.().height || Number.parseFloat(iframe.style.height) || 0;
        const travados = rolaveis().map((el): [HTMLElement, string] => [el, el.style.overflow]);
        salvo = { iframe: iframe.getAttribute("style") ?? "", reserva: reserva.style.minHeight, travados };
        if (alturaAtual) reserva.style.minHeight = `${Math.round(alturaAtual)}px`;
        iframe.setAttribute("style", `${salvo.iframe};${CAMADA}`);
        for (const [el] of travados) el.style.overflow = "hidden";
      } else if (!ativo && salvo) {
        iframe.setAttribute("style", salvo.iframe);
        reserva.style.minHeight = salvo.reserva;
        for (const [el, antes] of salvo.travados) el.style.overflow = antes;
        salvo = null;
        if (pendente !== null) aplicarAltura(pendente);
        pendente = null;
      }
      return true;
    },
    altura(px) {
      if (!Number.isFinite(px)) return;
      if (salvo) pendente = px;
      else aplicarAltura(px);
    },
  };
  // O app recarregou (extensão atualizada, por exemplo) com um diálogo aberto: ninguém mais vai pedir para desligar.
  iframe.addEventListener("load", () => api.ligar(false));
  return api;
}

/**
 * Lado do app: enquanto há diálogo aberto, pede à aba a sobreposição e marca
 * `<html data-sobreposto>` ("abrindo", "sim" ou "falhou"; o CSS do app esconde
 * a lista e deixa o fundo transparente). Sem resposta da aba em `espera` ms
 * (content script antigo), volta ao jeito antigo: o iframe cresce (mínimo 640).
 */
export function sobreposicaoNoApp(
  rpc: Pick<Rpc, "chamar">,
  altura: Pick<AlturaDoApp, "minimo">,
  o: { doc?: Document; espera?: number } = {},
): { abrir(): void; fechar(): void } {
  const html = (o.doc ?? document).documentElement;
  let abertos = 0;
  let reserva: ReturnType<typeof setTimeout> | undefined;
  return {
    abrir() {
      if (abertos++ > 0) return;
      html.dataset.sobreposto = "abrindo";
      clearTimeout(reserva);
      reserva = setTimeout(() => {
        if (html.dataset.sobreposto !== "abrindo") return;
        html.dataset.sobreposto = "falhou";
        altura.minimo(640);
      }, o.espera ?? 800);
      void rpc
        .chamar<boolean>("sobrepor", { ativo: true }, 3000)
        .then((ok) => {
          clearTimeout(reserva);
          if (!abertos) return;
          html.dataset.sobreposto = ok ? "sim" : "falhou";
          if (!ok) altura.minimo(640);
        })
        .catch(() => {
          clearTimeout(reserva);
          if (!abertos) return;
          html.dataset.sobreposto = "falhou";
          altura.minimo(640);
        });
    },
    fechar() {
      if (abertos === 0 || --abertos > 0) return;
      clearTimeout(reserva);
      delete html.dataset.sobreposto;
      altura.minimo(0);
      void rpc.chamar("sobrepor", { ativo: false }, 3000).catch(() => undefined);
    },
  };
}
```

Criar `sei-comum/src/painel/aviso.ts` (o lado da aba é o `favoritos/src/pagina/aviso.ts` com o prefixo como parâmetro; o lado do app é o emissor de `favoritos/src/app/main.ts` — linhas 75-82 em `9eda964`):

```ts
/**
 * Aviso (toast) do painel embutido no rodapé da TELA do SEI: dentro do iframe,
 * que cresce com a lista, um aviso preso embaixo ficaria fora da vista.
 *
 * Lado da aba (`avisoNaPagina`): estilo em linha (a página do SEI não tem a
 * base visual) e cores fixas, legíveis nos dois temas; a promessa diz se o
 * usuário clicou a ação ("Desfazer"). A animação `<prefixo>-aviso` vem do CSS
 * do painel (embutido.ts, `instalarEstiloPainel`).
 * Lado do app (`emissorDeAvisoPelaPagina`): manda o aviso para a aba; com
 * diálogo sobreposto, ou se a aba não responde, o app mostra ele mesmo.
 */

import type { Rpc } from "../ponte/rpc";
import { type EmissorAviso, mostrarAviso } from "../ui/aviso";
import { h } from "../ui/dom";

export type AvisarNaPagina = (texto: string, acao: string | undefined, ms: number) => Promise<boolean>;

const caixa = (prefixo: string) =>
  "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:12px;" +
  "max-width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:10px 10px 10px 16px;" +
  "font:13px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#f3f5f8;background:#1f2329;" +
  "border:1px solid rgb(255 255 255 / 8%);border-radius:12px;box-shadow:0 10px 24px -6px rgb(16 24 40 / 30%),0 24px 56px -12px rgb(16 24 40 / 35%);" +
  `animation:${prefixo}-aviso 220ms cubic-bezier(.2,.8,.2,1)`;
const BOTAO =
  "flex:none;padding:5px 10px;font:inherit;font-weight:600;color:#9cc3ff;background:rgb(255 255 255 / 7%);border:0;border-radius:6px;cursor:pointer";

/** Prefixo das classes do painel na página do SEI (entra em CSS: só letras minúsculas, dígitos e hífen). */
export function validarPrefixo(prefixo: string): string {
  if (!/^[a-z][a-z0-9-]*$/.test(prefixo)) throw new Error(`Prefixo de classe inválido: ${prefixo}`);
  return prefixo;
}

export function avisoNaPagina(doc: Document, temaEscuro: boolean, prefixo = "spro-painel"): AvisarNaPagina {
  const classe = `${validarPrefixo(prefixo)}-aviso`;
  return (texto, acao, ms) =>
    new Promise<boolean>((resolver) => {
      for (const velho of doc.querySelectorAll(`.${classe}`)) velho.remove();
      let feito = false;
      const terminar = (acionado: boolean) => {
        if (feito) return;
        feito = true;
        el.remove();
        resolver(acionado);
      };
      const el = h(
        "div",
        { class: classe, role: "status", style: caixa(prefixo) + (temaEscuro ? ";background:#2b3036" : "") },
        h("span", { style: "flex:1" }, texto),
        acao ? h("button", { type: "button", style: BOTAO, onclick: () => terminar(true) }, acao) : null,
      );
      (doc.body ?? doc.documentElement).append(el);
      setTimeout(() => terminar(false), Math.max(10, Math.min(ms, 60_000)));
    });
}

/** Emissor de avisos do app embutido (ui/aviso.ts `definirEmissorDeAviso`): o aviso vai para o rodapé da tela do SEI. */
export function emissorDeAvisoPelaPagina(rpc: Pick<Rpc, "chamar">, doc: Document = document): EmissorAviso {
  return (texto, acao, ms) => {
    // Com diálogo aberto, o iframe já cobre a tela: o aviso fica no próprio app.
    if (doc.documentElement.dataset.sobreposto) return false;
    rpc
      .chamar<boolean>("aviso", { texto, acao: acao?.rotulo, ms }, ms + 5000)
      .then((acionado) => acionado && acao?.fazer())
      .catch(() => mostrarAviso(doc, texto, acao, ms));
    return true;
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `341 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/pagina/sobreposicao.ts` inteiro:

```ts
/**
 * Diálogo do painel embutido no meio da tela visível (pedido do autor). A
 * sobreposição é a genérica da sei-comum (`@comum/painel/sobreposicao`), a
 * mesma do Projetos.
 */

export { criarSobreposicao, type Sobreposicao } from "@comum/painel/sobreposicao";
```

Reescrever `favoritos/src/pagina/aviso.ts` inteiro (a classe continua `spro-fav-aviso`, e a animação continua vindo de `pagina/estilo.ts`):

```ts
/**
 * Aviso (toast) do painel embutido no rodapé da TELA do SEI. O aviso é o
 * genérico da sei-comum (`@comum/painel/aviso`); a classe e a animação seguem
 * com o prefixo de sempre (`spro-fav-aviso`, do CSS de pagina/estilo.ts).
 */

import { type AvisarNaPagina, avisoNaPagina as avisoNaPaginaComum } from "@comum/painel/aviso";

export type { AvisarNaPagina } from "@comum/painel/aviso";

export function avisoNaPagina(doc: Document, temaEscuro: boolean): AvisarNaPagina {
  return avisoNaPaginaComum(doc, temaEscuro, "spro-fav");
}
```

Apagar `favoritos/src/app/altura.ts`: `git rm favoritos/src/app/altura.ts`.

Em `favoritos/src/app/main.ts`:

(a) depois da linha 15 (`import { novoId } from "@comum/id";`), acrescentar

```ts
import { observarAltura } from "@comum/painel/altura";
import { emissorDeAvisoPelaPagina } from "@comum/painel/aviso";
import { sobreposicaoNoApp } from "@comum/painel/sobreposicao";
```

(b) linha 20 — trocar `import { definirEmissorDeAviso, mostrarAviso } from "@comum/ui/aviso";` por `import { definirEmissorDeAviso } from "@comum/ui/aviso";`

(c) apagar a linha 32 (`import { observarAltura } from "./altura";`)

(d) em `iniciarEmbutido`, linhas 75-84, trocar

```ts
  const sobrepor = sobreposicao(rpc, altura);
  // Aviso no rodapé da TELA do SEI (o do iframe ficaria lá embaixo, fora da vista); com diálogo aberto, aqui mesmo.
  definirEmissorDeAviso((texto, acao, ms) => {
    if (document.documentElement.dataset.sobreposto) return false;
    rpc
      .chamar<boolean>("aviso", { texto, acao: acao?.rotulo, ms }, ms + 5000)
      .then((acionado) => acionado && acao?.fazer())
      .catch(() => mostrarAviso(document, texto, acao, ms));
    return true;
  });
```

por

```ts
  // Diálogo no meio da tela visível: a aba põe o iframe por cima de tudo enquanto há diálogo aberto.
  const sobrepor = sobreposicaoNoApp(rpc, altura);
  // Aviso no rodapé da TELA do SEI (o do iframe ficaria lá embaixo, fora da vista); com diálogo aberto, aqui mesmo.
  definirEmissorDeAviso(emissorDeAvisoPelaPagina(rpc));
```

(e) apagar as linhas 165-210: do `/**` cuja linha seguinte é ` * Diálogo do painel embutido FORA do contêiner: enquanto há diálogo aberto, a` até o `}` que fecha a função `function sobreposicao(rpc: Pick<Rpc, "chamar">, altura: ReturnType<typeof observarAltura>)`, mais a linha em branco depois dele. `interface Ganchos {` passa a vir logo depois da linha em branco que segue o `}` de `iniciarLateral`.

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)` (inclui as provas de sobreposição e aviso de `verificar-painel.ts` dos Favoritos, intocadas); tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: ` M dist/js/favoritos/app.js` e ` M dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/painel/altura.ts sei-comum/src/painel/sobreposicao.ts sei-comum/src/painel/aviso.ts \
  sei-comum/tests/verificar-painel-app.ts sei-comum/tests/verificar.ts \
  favoritos/src/pagina/sobreposicao.ts favoritos/src/pagina/aviso.ts favoritos/src/app/main.ts favoritos/src/app/altura.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: altura, sobreposicao e aviso do painel embutido (Favoritos migram)

Os dois lados (aba e app) da altura do iframe, do dialogo no meio da tela e do
aviso no rodape da tela do SEI vao para sei-comum/src/painel, com o prefixo
das classes como parametro.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 9: Montagem genérica do painel embutido

**Files:**
- Create: `sei-comum/src/painel/embutido.ts`, `sei-comum/tests/verificar-embutido.ts`
- Modify: `sei-comum/tests/verificar.ts`
- Modify: `favoritos/src/pagina/painel.ts` (reescrever: fachada), `favoritos/src/pagina/executor.ts:7-8,13,16,36-53`, `favoritos/src/pagina/main.ts:14-15,309-324`
- Regerar: `dist/js/init_favoritos.js`

**Interfaces:**
- Consumes: `criarSobreposicao`, `Sobreposicao` (Task 8); `AvisarNaPagina`, `validarPrefixo` (Task 8); `criarRpc`, `PortaRpc`, `Rpc`, `Tratador`, `parDePortas` (comum); `h`, `icone`.
- Produces:
  - `ordemLegada(armazenamento: Pick<Storage, "getItem">, id: string): number | null`; `inserirNaOrdem(container: Element, painel: Element, ordem: number | null): void`.
  - `igualarAoTituloDoSei(doc: Document, titulo: HTMLElement, depoisDaCarga?: (fn: () => void) => void): void`; `copiarLetraDoTitulo(doc: Document, titulo: HTMLElement): void`.
  - `instalarEstiloPainel(doc: Document, prefixo: string): void` (`style#<prefixo>-painel-estilo`: `-titulo`, `-recolher`, `@keyframes <prefixo>-aviso`).
  - `interface OpcoesPainelEmbutido { id: string; titulo: string; icone: () => Element; urlApp: string; tituloIframe: string; prefixo: string; rotulos: { mostrar: string; recolher: string }; temaEscuro?: boolean; recolhido: boolean; ordem: number | null; aoRecolher(recolhido: boolean): void; estilo?: (doc: Document) => void; alturaInicial?: number }`.
  - `interface PainelMontado { painel: HTMLElement; iframe: HTMLIFrameElement; corpo: HTMLElement; sobreposicao: Sobreposicao; fechar(): void }`.
  - `montarPainelEmbutido(doc: Document, o: OpcoesPainelEmbutido): PainelMontado | null` (null sem `#frmProcedimentoControlar`, com `#tblMarcadores` ou com o `id` já na página).
  - `tratadoresDoPainel(d: { iframe: HTMLIFrameElement | null; sobreposicao?: Sobreposicao | null; avisar?: AvisarNaPagina | null }): Record<string, Tratador>` (`altura`, `sobrepor`, `aviso`).
  - `ligarPortaDoPainel(m: Pick<PainelMontado, "iframe" | "sobreposicao" | "fechar">, conectar: () => PortaRpc, tratadores: Record<string, Tratador>): { fechar(): void }`.
  - Para o P3: o `id` do painel do Projetos não pode ser o do painel legado do Atividades (os dois podem aparecer juntos); um id sem entrada em `optionsPro.orderPanelHome` entra no fim do `#panelHomePro`.

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-embutido.ts`:

```ts
import {
  copiarLetraDoTitulo,
  inserirNaOrdem,
  instalarEstiloPainel,
  ligarPortaDoPainel,
  montarPainelEmbutido,
  type OpcoesPainelEmbutido,
  ordemLegada,
  tratadoresDoPainel,
} from "../src/painel/embutido";
import { criarSobreposicao } from "../src/painel/sobreposicao";
import { parDePortas } from "../src/ponte/parDePortas";
import { criarRpc, type PortaRpc, type Rpc } from "../src/ponte/rpc";
import { icone } from "../src/ui/dom";
import { checar, disparar, instalarDom, lanca, secao, tique } from "./util";

const opcoes = (o: Partial<OpcoesPainelEmbutido> = {}): OpcoesPainelEmbutido => ({
  id: "projetosSeiPro",
  titulo: "Projetos",
  icone: () => icone("calendario", 20),
  urlApp: "chrome-extension://abc/html/projetos.html#modo=embutido",
  tituloIframe: "Projetos do SEI Pro",
  prefixo: "spro-prj",
  rotulos: { mostrar: "Mostrar projetos", recolher: "Recolher projetos" },
  recolhido: false,
  ordem: null,
  aoRecolher: () => undefined,
  ...o,
});

export async function verificarEmbutido(): Promise<void> {
  secao("painel embutido: ordem do legado");
  const loja = {
    getItem: () =>
      JSON.stringify({
        orderPanelHome: [
          { name: "favoritesPro", index: 3 },
          { name: "projetosSeiPro", index: "5" },
        ],
      }),
  };
  checar("ordem do painel pelo id", ordemLegada(loja, "projetosSeiPro") === 5 && ordemLegada(loja, "favoritesPro") === 3);
  checar("sem ordem guardada, ou JSON quebrado", ordemLegada(loja, "outro") === null && ordemLegada({ getItem: () => "{x" }, "x") === null);
  const docO = instalarDom(
    '<html><body><div id="c"><div class="panelHomePro" id="a" data-order="1"></div><div class="panelHomePro" id="b" data-order="5"></div></div></body></html>',
  );
  const novo = docO.createElement("div");
  novo.id = "n";
  inserirNaOrdem(docO.querySelector("#c")!, novo, 3);
  checar("entra antes do primeiro de ordem maior", [...docO.querySelectorAll("#c > div")].map((d) => d.id).join() === "a,n,b");

  secao("painel embutido: montar");
  const doc = instalarDom('<html><head></head><body><form id="frmProcedimentoControlar"></form></body></html>');
  const recolhidos: boolean[] = [];
  const m = montarPainelEmbutido(doc, opcoes({ temaEscuro: true, aoRecolher: (r) => recolhidos.push(r) }));
  checar(
    "cria #panelHomePro depois do formulario e o painel dentro",
    doc.querySelector("#frmProcedimentoControlar + #panelHomePro > #projetosSeiPro") !== null,
  );
  checar(
    "iframe do app: endereco, titulo, copiar e esquema de cores do tema",
    m?.iframe.getAttribute("src") === "chrome-extension://abc/html/projetos.html#modo=embutido" &&
      m.iframe.getAttribute("title") === "Projetos do SEI Pro" &&
      m.iframe.getAttribute("allow") === "clipboard-write" &&
      (m.iframe.getAttribute("style") ?? "").includes("color-scheme: dark") &&
      m.iframe.style.height === "120px",
  );
  const titulo = doc.querySelector("#projetosSeiPro .spro-prj-titulo");
  checar(
    "titulo com a classe da tela, icone e texto solto (sem span)",
    titulo?.classList.contains("infraBarraLocalizacao") === true &&
      !!titulo.querySelector("svg") &&
      !titulo.querySelector("span") &&
      (titulo.textContent ?? "").trim() === "Projetos",
  );
  checar("peso do titulo fixo (600)", (titulo as HTMLElement | null)?.style.getPropertyValue("font-weight") === "600");
  const estilo = doc.getElementById("spro-prj-painel-estilo")?.textContent ?? "";
  checar(
    "CSS do prefixo instalado, com a animacao do aviso",
    estilo.includes(".spro-prj-titulo") && estilo.includes("@keyframes spro-prj-aviso"),
  );
  const rec = doc.querySelector(".spro-prj-recolher") as HTMLButtonElement;
  checar(
    "botao de recolher com o rotulo do modulo",
    rec.getAttribute("aria-label") === "Recolher projetos" && rec.getAttribute("aria-expanded") === "true",
  );
  rec.click();
  checar(
    "recolher esconde, troca o rotulo e avisa",
    m?.corpo.hidden === true && rec.getAttribute("aria-label") === "Mostrar projetos" && recolhidos.join() === "true",
  );
  checar("nao monta duas vezes o mesmo painel", montarPainelEmbutido(doc, opcoes()) === null);
  const outro = montarPainelEmbutido(doc, opcoes({ id: "favoritesPro", prefixo: "spro-fav", estilo: () => undefined }));
  checar(
    "outro painel usa o mesmo contêiner, e o estilo proprio dele",
    doc.querySelectorAll("#panelHomePro").length === 1 &&
      outro?.painel.parentElement?.id === "panelHomePro" &&
      !doc.getElementById("spro-fav-painel-estilo"),
  );
  const hostil = '<img src=x onerror="alert(1)">';
  const docH = instalarDom('<html><body><form id="frmProcedimentoControlar"></form></body></html>');
  montarPainelEmbutido(docH, opcoes({ titulo: hostil }));
  checar(
    "titulo hostil como texto",
    (docH.querySelector(".spro-prj-titulo")?.textContent ?? "").includes(hostil) && !docH.querySelector(".spro-prj-titulo img"),
  );
  const docM = instalarDom('<html><body><form id="frmProcedimentoControlar"></form><table id="tblMarcadores"></table></body></html>');
  checar(
    "caixa filtrada por marcador, ou sem a caixa: nao monta",
    montarPainelEmbutido(docM, opcoes()) === null && montarPainelEmbutido(instalarDom(), opcoes()) === null,
  );
  checar(
    "prefixo invalido e recusado",
    (await lanca(() => instalarEstiloPainel(instalarDom(), "spro prj")))?.message?.includes("Prefixo") === true,
  );
  const docT = instalarDom('<html><body><div id="divInfraBarraLocalizacao">Controle de Processos</div></body></html>');
  (docT.defaultView as unknown as { getComputedStyle: () => Partial<CSSStyleDeclaration> }).getComputedStyle = () => ({
    fontSize: "22.4px",
    fontFamily: "Roboto, Arial",
  });
  const tituloT = docT.createElement("div");
  copiarLetraDoTitulo(docT, tituloT);
  checar("depois da carga, a letra do titulo da tela", tituloT.style.fontSize === "22.4px");

  secao("painel embutido: tratadores da aba");
  const docE = instalarDom('<html><body><iframe id="f"></iframe></body></html>');
  const fr = docE.getElementById("f") as HTMLIFrameElement;
  const sem = tratadoresDoPainel({ iframe: fr });
  await sem.altura?.({ px: 345.4 });
  checar("altura segue o conteudo", fr.style.height === "345px");
  await sem.altura?.({ px: 10 });
  const minimo = fr.style.height;
  await sem.altura?.({ px: 1e9 });
  checar("com limites (80 e 20000)", minimo === "80px" && fr.style.height === "20000px");
  checar(
    "sem sobreposicao (lateral) nega, sem aviso nega",
    (await sem.sobrepor?.({ ativo: true })) === false && (await sem.aviso?.({ texto: "x" })) === false,
  );
  const pedidos: Array<[string, string | undefined, number]> = [];
  const com = tratadoresDoPainel({
    iframe: fr,
    avisar: async (t, a, ms) => {
      pedidos.push([t, a, ms]);
      return true;
    },
  });
  await com.aviso?.({ texto: "x".repeat(500), acao: "D".repeat(50), ms: "nao e numero" });
  checar(
    "aviso: texto e acao cortados, prazo padrao",
    pedidos[0]?.[0].length === 400 && pedidos[0]?.[1]?.length === 40 && pedidos[0]?.[2] === 7000,
  );

  secao("painel embutido: porta a cada carga do iframe");
  const docR = instalarDom('<html><body><form id="frmProcedimentoControlar"></form></body></html>');
  const mp = montarPainelEmbutido(docR, opcoes())!;
  let conexoes = 0;
  let ladoApp: Rpc | null = null;
  const conectar = (): PortaRpc => {
    conexoes++;
    const [app, aba] = parDePortas();
    ladoApp = criarRpc(app);
    return aba;
  };
  const porta = ligarPortaDoPainel(mp, conectar, tratadoresDoPainel({ iframe: mp.iframe, sobreposicao: mp.sobreposicao }));
  checar("antes da carga do iframe, nenhuma porta", conexoes === 0);
  disparar(mp.iframe, "load");
  const primeiro = ladoApp as Rpc | null;
  await primeiro?.chamar("altura", { px: 300 });
  checar("carregou: porta nova, e o app pede a altura", conexoes === 1 && mp.iframe.style.height === "300px");
  disparar(mp.iframe, "load");
  await tique();
  checar("recarregou: a porta antiga fecha e vem outra", conexoes === 2 && primeiro?.aberta === false);
  const segundo = ladoApp as Rpc | null;
  checar(
    "o app liga a sobreposicao pela porta",
    (await segundo?.chamar("sobrepor", { ativo: true })) === true && docR.documentElement.style.overflow === "hidden",
  );
  segundo?.fechar();
  await tique();
  checar("porta caiu com dialogo aberto: a pagina destrava", docR.documentElement.style.overflow === "" && mp.iframe.style.position === "");
  porta.fechar();
  checar("fechar tira o painel", !docR.querySelector("#projetosSeiPro"));
  const sob = criarSobreposicao(docR, mp.iframe, mp.corpo);
  checar("sobreposicao de painel fora da pagina nega", sob.ligar(true) === false);
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarEmbutido } from "./verificar-embutido";` logo depois de `import { verificarDialogo } from "./verificar-dialogo";`, e `await verificarEmbutido();` logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/painel/embutido'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/painel/embutido.ts` (o corpo de `montarPainelEmbutido` é o `montarPainel` de `favoritos/src/pagina/painel.ts:102-161` com id, título, ícone, prefixo e rótulos como opções; os tratadores são os de `favoritos/src/pagina/executor.ts:37-53`; a porta é a de `favoritos/src/pagina/main.ts:308-323`):

```ts
/**
 * Painel embutido no Controle de Processos, abaixo da lista: um iframe da
 * própria extensão (o app roda na origem dela: chrome.storage direto, CSS
 * isolado do SEI), dentro do contêiner do legado (#panelHomePro), para valer a
 * ordem entre painéis que o usuário já escolheu (optionsPro.orderPanelHome).
 * Favoritos (`favoritesPro`) e Projetos montam o seu com o mesmo código.
 *
 * Lado da aba: montar (título com a letra do título da tela, recolher
 * lembrado, iframe com o esquema de cores do app), os tratadores RPC que todo
 * painel atende (`altura`, `sobrepor`, `aviso`) e a porta nova a cada carga do iframe.
 */

import { criarRpc, type PortaRpc, type Rpc, type Tratador } from "../ponte/rpc";
import { h, icone } from "../ui/dom";
import { type AvisarNaPagina, validarPrefixo } from "./aviso";
import { criarSobreposicao, type Sobreposicao } from "./sobreposicao";

/** A ordem do painel `id` no `optionsPro` do legado (localStorage do SEI), ou null. */
export function ordemLegada(armazenamento: Pick<Storage, "getItem">, id: string): number | null {
  try {
    const op = JSON.parse(armazenamento.getItem("optionsPro") ?? "{}") as { orderPanelHome?: unknown };
    if (!Array.isArray(op.orderPanelHome)) return null;
    const item = op.orderPanelHome.find((i) => (i as { name?: unknown })?.name === id) as { index?: unknown } | undefined;
    const n = Number(item?.index);
    return item && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Mesma regra de `orderDivPanel` (sei-pro.js): antes do primeiro painel de ordem maior. */
export function inserirNaOrdem(container: Element, painel: Element, ordem: number | null): void {
  if (ordem !== null) {
    for (const outro of [...container.children]) {
      if (!outro.classList.contains("panelHomePro")) continue;
      const n = Number.parseInt(outro.getAttribute("data-order") ?? "", 10);
      if (Number.isFinite(n) && n > ordem) {
        outro.before(painel);
        return;
      }
    }
  }
  container.append(painel);
}

/**
 * O título do painel com a letra do título da tela ("Controle de Processos"). A classe
 * `infraBarraLocalizacao` já dá a mesma letra (o que o deixava pequeno era um `<span>`, que o SEI
 * encolhe). Copiar o estilo computado NA MONTAGEM falhava no SEI 5: os estilos da página ainda estão
 * carregando, e o valor copiado (pequeno, ou peso 400), por ser inline, vencia o da classe. Por isso o
 * peso é fixo e a letra só é conferida depois que a página termina de carregar.
 */
export function igualarAoTituloDoSei(
  doc: Document,
  titulo: HTMLElement,
  depoisDaCarga: (fn: () => void) => void = (fn) => aposCarregar(doc, fn),
): void {
  titulo.style.setProperty("font-weight", "600", "important");
  depoisDaCarga(() => copiarLetraDoTitulo(doc, titulo));
}

/** Copia tamanho e família do título da tela, se ele já tem letra de título (nunca a de texto comum). */
export function copiarLetraDoTitulo(doc: Document, titulo: HTMLElement): void {
  const ref = doc.querySelector("#divInfraBarraLocalizacao");
  const visao = doc.defaultView as (Window & { getComputedStyle?: Window["getComputedStyle"] }) | null;
  if (!ref || !visao?.getComputedStyle) return;
  try {
    const c = visao.getComputedStyle(ref);
    if (!(Number.parseFloat(c.fontSize) > 16)) return;
    titulo.style.fontSize = c.fontSize;
    if (c.fontFamily) titulo.style.fontFamily = c.fontFamily;
  } catch {
    /* sem estilo computado */
  }
}

/** Depois do `load` da página (estilos carregados) e mais um pouco, para o que o SEI aplica por script. */
function aposCarregar(doc: Document, fn: () => void): void {
  const visao = doc.defaultView;
  const agendar = () => visao?.setTimeout(fn, 1500);
  if (doc.readyState === "complete") agendar();
  else visao?.addEventListener("load", agendar, { once: true });
}

/** CSS mínimo do título, do botão de recolher e da animação do aviso, uma vez por documento e prefixo. */
export function instalarEstiloPainel(doc: Document, prefixo: string): void {
  const p = validarPrefixo(prefixo);
  const id = `${p}-painel-estilo`;
  if (doc.getElementById(id)) return;
  const s = doc.createElement("style");
  s.id = id;
  s.textContent = [
    `.${p}-titulo{display:flex!important;align-items:center;gap:8px}`,
    `.${p}-recolher{margin-left:4px;background:none;border:0;cursor:pointer;color:inherit;line-height:0;padding:2px;border-radius:4px}`,
    `.${p}-recolher:hover{background:rgb(127 127 127 / 14%)}`,
    `.${p}-recolher:focus-visible{outline:2px solid #1a73e8;outline-offset:1px}`,
    `@keyframes ${p}-aviso{from{opacity:0;transform:translate(-50%,10px)}}`,
    `@media (prefers-reduced-motion:reduce){.${p}-aviso{animation:none!important}}`,
  ].join("\n");
  (doc.head ?? doc.documentElement).append(s);
}

export interface OpcoesPainelEmbutido {
  /** id do painel (e nome na ordem do legado): "favoritesPro". Não pode repetir o de outro painel. */
  id: string;
  /** Texto do título ("Favoritos"). */
  titulo: string;
  /** Ícone antes do título (já com cor, se tiver). */
  icone: () => Element;
  urlApp: string;
  /** title do iframe (leitor de tela): "Favoritos do SEI Pro". */
  tituloIframe: string;
  /** Prefixo das classes na página do SEI: `<prefixo>-titulo`, `-corpo`, `-recolher`, `-aviso`. */
  prefixo: string;
  rotulos: { mostrar: string; recolher: string };
  /**
   * Mesmo esquema de cor do app: com esquemas diferentes, o navegador pinta um
   * fundo opaco atrás do iframe, e o diálogo sobreposto não teria fundo transparente.
   */
  temaEscuro?: boolean;
  recolhido: boolean;
  ordem: number | null;
  aoRecolher(recolhido: boolean): void;
  /** CSS do título/recolher/aviso; padrão: `instalarEstiloPainel(doc, prefixo)`. */
  estilo?: (doc: Document) => void;
  /** Altura do iframe antes de o app medir (px). */
  alturaInicial?: number;
}

export interface PainelMontado {
  painel: HTMLElement;
  iframe: HTMLIFrameElement;
  corpo: HTMLElement;
  /** Diálogo do app no meio da tela (sobreposicao.ts). */
  sobreposicao: Sobreposicao;
  /** Tira o painel da página, destravando antes a rolagem se havia diálogo aberto. */
  fechar(): void;
}

export function montarPainelEmbutido(doc: Document, o: OpcoesPainelEmbutido): PainelMontado | null {
  const form = doc.querySelector("#frmProcedimentoControlar");
  // #tblMarcadores: caixa filtrada por marcador, onde o legado também não punha painéis.
  if (!form || doc.querySelector("#tblMarcadores") || doc.getElementById(o.id)) return null;
  const p = validarPrefixo(o.prefixo);
  (o.estilo ?? ((d: Document) => instalarEstiloPainel(d, p)))(doc);
  let container = doc.querySelector("#panelHomePro");
  if (!container) {
    container = h("div", { id: "panelHomePro", style: "display: inline-block; width: 100%;" });
    form.after(container);
  }
  const iframe = h("iframe", {
    src: o.urlApp,
    title: o.tituloIframe,
    allow: "clipboard-write",
    style: `width: 100%; height: ${o.alturaInicial ?? 120}px; border: 0; display: block; color-scheme: ${o.temaEscuro ? "dark" : "light"};`,
  });
  const corpo = h("div", { class: `${p}-corpo`, hidden: o.recolhido }, iframe);
  const recolher = h("button", { type: "button", class: `${p}-recolher` });
  const pintar = () => {
    const fechado = corpo.hidden;
    const rotulo = fechado ? o.rotulos.mostrar : o.rotulos.recolher;
    recolher.setAttribute("aria-expanded", String(!fechado));
    recolher.setAttribute("aria-label", rotulo);
    recolher.title = rotulo;
    recolher.replaceChildren(icone(fechado ? "expandir" : "recolher", 18));
  };
  recolher.addEventListener("click", () => {
    corpo.hidden = !corpo.hidden;
    pintar();
    o.aoRecolher(corpo.hidden);
  });
  pintar();
  // O texto vai solto no div (como o do Controle de Processos): o SEI encolhe todo span.
  const titulo = h("div", { class: `infraBarraLocalizacao titlePanelHome ${p}-titulo` }, o.icone(), o.titulo, recolher);
  igualarAoTituloDoSei(doc, titulo);
  const painel = h(
    "div",
    {
      class: "panelHomePro",
      id: o.id,
      "data-order": o.ordem === null ? "" : String(o.ordem),
      style: "display: inline-block; width: 100%;",
    },
    titulo,
    corpo,
  );
  inserirNaOrdem(container, painel, o.ordem);
  const sobreposicao = criarSobreposicao(doc, iframe, corpo);
  return {
    painel,
    iframe,
    corpo,
    sobreposicao,
    fechar: () => {
      sobreposicao.ligar(false);
      painel.remove();
    },
  };
}

/** O que todo painel embutido atende: altura do iframe, sobreposição do diálogo e aviso no rodapé da tela. */
export function tratadoresDoPainel(d: {
  iframe: HTMLIFrameElement | null;
  sobreposicao?: Sobreposicao | null;
  avisar?: AvisarNaPagina | null;
}): Record<string, Tratador> {
  return {
    altura: (args) => {
      const px = Number((args as { px?: unknown } | null)?.px);
      if (d.sobreposicao) d.sobreposicao.altura(px);
      else if (d.iframe && Number.isFinite(px)) d.iframe.style.height = `${Math.max(80, Math.min(Math.round(px), 20000))}px`;
      return true;
    },
    sobrepor: (args) => (d.sobreposicao ? d.sobreposicao.ligar((args as { ativo?: unknown } | null)?.ativo === true) : false),
    aviso: (args) => {
      const a = (args ?? {}) as { texto?: unknown; acao?: unknown; ms?: unknown };
      if (!d.avisar) return false;
      const ms = Number(a.ms);
      return d.avisar(
        String(a.texto ?? "").slice(0, 400),
        a.acao ? String(a.acao).slice(0, 40) : undefined,
        Number.isFinite(ms) ? ms : 7000,
      );
    },
  };
}

/**
 * A cada carga do iframe, uma porta nova (o app só aceita a porta da própria aba:
 * ponte/conexaoDaAba.ts). Porta caída (app fechado ou extensão atualizada): ninguém
 * mais vai pedir para desligar a sobreposição, então ela sai aqui.
 */
export function ligarPortaDoPainel(
  m: Pick<PainelMontado, "iframe" | "sobreposicao" | "fechar">,
  conectar: () => PortaRpc,
  tratadores: Record<string, Tratador>,
): { fechar(): void } {
  let rpc: Rpc | null = null;
  m.iframe.addEventListener("load", () => {
    rpc?.fechar();
    rpc = criarRpc(conectar(), tratadores);
    rpc.aoFechar(() => m.sobreposicao.ligar(false));
  });
  return {
    fechar: () => {
      rpc?.fechar();
      m.fechar();
    },
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `368 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Migrar os Favoritos**

Reescrever `favoritos/src/pagina/painel.ts` inteiro (o DOM gerado é o mesmo: `#favoritesPro`, `.spro-fav-titulo`, `.spro-fav-corpo`, `.spro-fav-recolher`, estrela `#e0a100`, CSS de `pagina/estilo.ts`):

```ts
/**
 * O painel "Favoritos" abaixo da lista do Controle de Processos. É um iframe
 * da própria extensão (html/favoritos.html), e não HTML injetado: o app roda
 * na origem da extensão (chrome.storage direto, CSS isolado do SEI) e é o
 * MESMO app do painel lateral da F2. Container e id são os do legado
 * (#panelHomePro, #favoritesPro), para valer a ordem entre painéis que o
 * usuário já escolheu. A montagem é a genérica da sei-comum (`@comum/painel/embutido`).
 */

import { montarPainelEmbutido, ordemLegada as ordemDoPainel, type PainelMontado } from "@comum/painel/embutido";
import { icone } from "@comum/ui/dom";
import { instalarEstilo } from "./estilo";

export { copiarLetraDoTitulo, igualarAoTituloDoSei, inserirNaOrdem, type PainelMontado } from "@comum/painel/embutido";

export const ID_PAINEL = "favoritesPro";

export function ordemLegada(armazenamento: Pick<Storage, "getItem">): number | null {
  return ordemDoPainel(armazenamento, ID_PAINEL);
}

export interface OpcoesPainel {
  urlApp: string;
  /**
   * Mesmo esquema de cor do app: com esquemas diferentes, o navegador pinta um
   * fundo opaco atrás do iframe, e o diálogo sobreposto não teria fundo transparente.
   */
  temaEscuro?: boolean;
  recolhido: boolean;
  ordem: number | null;
  aoRecolher(recolhido: boolean): void;
}

export function montarPainel(doc: Document, o: OpcoesPainel): PainelMontado | null {
  return montarPainelEmbutido(doc, {
    ...o,
    id: ID_PAINEL,
    titulo: "Favoritos",
    tituloIframe: "Favoritos do SEI Pro",
    prefixo: "spro-fav",
    rotulos: { mostrar: "Mostrar favoritos", recolher: "Recolher favoritos" },
    icone: () => {
      const estrela = icone("estrelaCheia", 20);
      estrela.setAttribute("style", "color:#e0a100");
      return estrela;
    },
    // O CSS das estrelas já traz o do título, do recolher e do aviso (spro-fav-*).
    estilo: instalarEstilo,
  });
}
```

Em `favoritos/src/pagina/executor.ts`:

(a) linhas 7-8 — trocar

```ts
import { abrirProcesso } from "@comum/pagina/abrir";
import { ErroRpc, type Tratador } from "@comum/ponte/rpc";
```

por

```ts
import { abrirProcesso } from "@comum/pagina/abrir";
import type { AvisarNaPagina } from "@comum/painel/aviso";
import { tratadoresDoPainel } from "@comum/painel/embutido";
import type { Sobreposicao } from "@comum/painel/sobreposicao";
import { ErroRpc, type Tratador } from "@comum/ponte/rpc";
```

(b) apagar as linhas 13 (`import type { AvisarNaPagina } from "./aviso";`) e 16 (`import type { Sobreposicao } from "./sobreposicao";`).

(c) linhas 36-53 — trocar

```ts
    contexto: () => d.ctx,
    altura: (args) => {
      const px = Number((args as { px?: unknown } | null)?.px);
      if (d.sobreposicao) d.sobreposicao.altura(px);
      else if (d.iframe && Number.isFinite(px)) d.iframe.style.height = `${Math.max(80, Math.min(Math.round(px), 20000))}px`;
      return true;
    },
    sobrepor: (args) => (d.sobreposicao ? d.sobreposicao.ligar((args as { ativo?: unknown } | null)?.ativo === true) : false),
    aviso: (args) => {
      const a = (args ?? {}) as { texto?: unknown; acao?: unknown; ms?: unknown };
      if (!d.avisar) return false;
      const ms = Number(a.ms);
      return d.avisar(
        String(a.texto ?? "").slice(0, 400),
        a.acao ? String(a.acao).slice(0, 40) : undefined,
        Number.isFinite(ms) ? ms : 7000,
      );
    },
```

por

```ts
    contexto: () => d.ctx,
    // altura, sobrepor e aviso: os de todo painel embutido (sei-comum).
    ...tratadoresDoPainel(d),
```

Em `favoritos/src/pagina/main.ts`:

(a) linhas 14-15 — trocar

```ts
import { ligarLadoAba } from "@comum/ponte/lateral";
import { criarRpc, ErroRpc, type PortaRpc, type Rpc } from "@comum/ponte/rpc";
```

por

```ts
import { ligarPortaDoPainel } from "@comum/painel/embutido";
import { ligarLadoAba } from "@comum/ponte/lateral";
import { ErroRpc, type PortaRpc } from "@comum/ponte/rpc";
```

(b) em `montarEmbutido`, linhas 309-324, trocar

```ts
  let rpc: Rpc | null = null;
  // A cada carga do iframe, uma porta nova: o app só aceita a porta da própria aba (@comum/ponte/conexaoDaAba).
  montado.iframe.addEventListener("load", () => {
    rpc?.fechar();
    rpc = criarRpc(chrome.runtime.connect({ name: CANAL_FAVORITOS }), tratadores);
    // A porta caiu (app fechado ou extensão atualizada): ninguém mais vai pedir para desligar a sobreposição.
    rpc.aoFechar(() => montado.sobreposicao.ligar(false));
  });
  return {
    painel: montado.painel,
    corpo: montado.corpo,
    fechar: () => {
      rpc?.fechar();
      montado.fechar();
    },
  };
```

por

```ts
  // A cada carga do iframe, uma porta nova: o app só aceita a porta da própria aba (@comum/ponte/conexaoDaAba).
  const porta = ligarPortaDoPainel(montado, () => chrome.runtime.connect({ name: CANAL_FAVORITOS }) as unknown as PortaRpc, tratadores);
  return { painel: montado.painel, corpo: montado.corpo, fechar: porta.fechar };
```

- [ ] **Step 6: Favoritos sem regressão, build**

Run: `cd favoritos && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests && node build.mjs`
Expected: `578 ok, 0 falha(s)` (inclui `verificar-painel.ts` dos Favoritos: `#frmProcedimentoControlar + #panelHomePro > #favoritesPro`, título sem span, peso 600, recolher, não monta duas vezes, sobreposição e aviso); tsc sem saída; biome `Found 1 warning.`; build sem `ERRO:`.
Run: `git status --short dist`
Expected: só ` M dist/js/init_favoritos.js`.

- [ ] **Step 7: Commit**

```bash
git add sei-comum/src/painel/embutido.ts sei-comum/tests/verificar-embutido.ts sei-comum/tests/verificar.ts \
  favoritos/src/pagina/painel.ts favoritos/src/pagina/executor.ts favoritos/src/pagina/main.ts \
  dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/painel.js dist/js/favoritos/opcoes.js
git commit -F - <<'EOF'
Comum: montagem generica do painel embutido (Favoritos migram)

Painel em #panelHomePro depois de #frmProcedimentoControlar, ordem do legado,
titulo com a letra da tela, recolher, iframe com color-scheme, tratadores RPC
(altura, sobrepor, aviso) e porta nova a cada carga, parametrizados por id,
titulo, icone, prefixo e endereco do app.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 10: Avatar (iniciais e cor estável)

**Files:**
- Create: `sei-comum/src/ui/avatar.ts`, `sei-comum/tests/verificar-avatar.ts`
- Modify: `sei-comum/tests/verificar.ts`

**Interfaces:**
- Consumes: `hashCurto`, `normalizarTexto` (`@comum/texto`); `h` (`@comum/ui/dom`).
- Produces:
  - `PALETA_AVATAR: readonly string[]` (12 cores; branco com contraste ≥ 4,5:1 em todas; círculo ≥ 2,5:1 sobre `#1f2329`).
  - `iniciais(nome: string): string` ("Pedro Henrique Soares" → "PS"; "Maria da Silva" → "MS"; "pedro.soares@x" → "PS"; uma palavra → uma letra; vazio → "?").
  - `corDoAvatar(nome: string): string` (estável por `normalizarTexto`).
  - `avatar(nome: string, o?: { tamanho?: number /*12..64, padrão 20*/; rotulo?: string }): HTMLSpanElement` (`span.spro-avatar`, `role="img"`, `title`/`aria-label`, estilo em linha).

- [ ] **Step 1: Escrever as provas**

Criar `sei-comum/tests/verificar-avatar.ts`:

```ts
import { avatar, corDoAvatar, iniciais, PALETA_AVATAR } from "../src/ui/avatar";
import { checar, instalarDom, secao } from "./util";

/** Luminância relativa e contraste (WCAG 2), contados aqui de novo, sem usar o código provado. */
function luminancia(hex: string): number {
  const c = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (c[0] ?? 0) + 0.7152 * (c[1] ?? 0) + 0.0722 * (c[2] ?? 0);
}
const contraste = (a: string, b: string) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return ((x ?? 0) + 0.05) / ((y ?? 0) + 0.05);
};

export function verificarAvatar(): void {
  secao("avatar: iniciais");
  checar("nome completo: primeira e ultima", iniciais("Pedro Henrique Soares") === "PS");
  checar("particulas nao contam", iniciais("Maria da Silva") === "MS" && iniciais("João dos Santos e Souza") === "JS");
  checar("login: antes do @, partes por ponto", iniciais("pedro.soares@antaq.gov.br") === "PS");
  checar("uma palavra: uma letra", iniciais("ana") === "A");
  checar("acento e emoji inteiros", iniciais("érica luz") === "ÉL" && iniciais("🙂 Teste") === "🙂T");
  checar("vazio: interrogacao", iniciais("   ") === "?" && iniciais("") === "?");

  secao("avatar: cor estavel e paleta legivel");
  checar("mesmo nome, mesma cor (sem caixa, acento ou espaco a mais)", corDoAvatar("Pedro Soares") === corDoAvatar("  PEDRO   soares "));
  checar("acento nao muda a cor", corDoAvatar("João") === corDoAvatar("Joao"));
  const nomes = [
    "Ana",
    "Bruno",
    "Carla",
    "Diego",
    "Elisa",
    "Fabio",
    "Gabriela",
    "Hugo",
    "Iara",
    "Joana",
    "Kleber",
    "Lucia",
    "Marcos",
    "Nadia",
    "Otavio",
    "Paula",
  ];
  const cores = new Set(nomes.map(corDoAvatar));
  checar("nomes diferentes se espalham pela paleta", cores.size >= 6, cores.size);
  checar(
    "branco das iniciais com contraste de texto (4,5:1) em toda cor",
    PALETA_AVATAR.every((c) => contraste(c, "#ffffff") >= 4.5),
    PALETA_AVATAR.map((c) => contraste(c, "#ffffff").toFixed(2)),
  );
  checar(
    "o circulo aparece no tema escuro (2,5:1 sobre #1f2329)",
    PALETA_AVATAR.every((c) => contraste(c, "#1f2329") >= 2.5),
    PALETA_AVATAR.map((c) => contraste(c, "#1f2329").toFixed(2)),
  );

  secao("avatar: elemento");
  instalarDom();
  const hostil = '<img src=x onerror="alert(1)"> Silva';
  const el = avatar(hostil, { tamanho: 24 });
  checar("nome hostil: so texto, nenhum elemento dentro", el.children.length === 0 && el.textContent === "<S", el.textContent);
  checar(
    "rotulo acessivel e title com o nome",
    el.getAttribute("aria-label") === hostil && el.getAttribute("title") === hostil && el.getAttribute("role") === "img",
  );
  checar(
    "cor do nome e tamanho",
    el.style.getPropertyValue("background-color") === corDoAvatar(hostil) && el.style.getPropertyValue("width") === "24px",
  );
  checar("tamanho absurdo fica no limite", avatar("A", { tamanho: 999 }).style.getPropertyValue("width") === "64px");
  checar(
    "rotulo proprio (ex.: 'Responsavel: Ana')",
    avatar("Ana", { rotulo: "Responsável: Ana" }).getAttribute("aria-label") === "Responsável: Ana",
  );
}
```

Em `sei-comum/tests/verificar.ts`, acrescentar `import { verificarAvatar } from "./verificar-avatar";` logo depois de `import { verificarArquivo } from "./verificar-arquivo";` (antes de `verificar-aviso`: o biome ordena `avatar` < `aviso`), e `verificarAvatar();` (sem `await`) logo antes de `resumo();`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd sei-comum && npx tsx tests/verificar.ts`
Expected: FAIL — `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../sei-comum/src/ui/avatar'`

- [ ] **Step 3: Implementar**

Criar `sei-comum/src/ui/avatar.ts`:

```ts
/**
 * Avatar de uma pessoa (responsável de etapa, autor de alteração): círculo
 * com as iniciais e uma cor estável derivada do nome (o mesmo nome tem a mesma
 * cor em qualquer computador e tema). A paleta foi escolhida para o branco das
 * iniciais ter contraste de texto (4,5:1) e o círculo aparecer também sobre o
 * fundo escuro. Estilo em linha: serve na página da extensão e no Shadow DOM.
 */

import { hashCurto, normalizarTexto } from "../texto";
import { h } from "./dom";

export const PALETA_AVATAR: readonly string[] = [
  "#1e6fd9",
  "#2e7d32",
  "#00796b",
  "#0277bd",
  "#7c3aed",
  "#c2185b",
  "#b45309",
  "#546e7a",
  "#9333ea",
  "#4d7c0f",
  "#c2410c",
  "#0e7490",
];

/** Partículas que não viram inicial ("Maria da Silva" = MS). */
const PARTICULAS = new Set(["de", "da", "do", "das", "dos", "e", "di", "du", "van", "von"]);

/** Uma letra (nome de uma palavra) ou a primeira e a última ("Pedro Henrique Soares" = PS). Login vale ("pedro.soares" = PS). */
export function iniciais(nome: string): string {
  const base = nome.split("@")[0] ?? "";
  const palavras = base.split(/[\s._-]+/).filter((p) => p.length > 0);
  const uteis = palavras.filter((p) => !PARTICULAS.has(normalizarTexto(p)));
  const lista = uteis.length ? uteis : palavras;
  const primeira = (p: string | undefined) => (p ? (Array.from(p)[0] ?? "") : "");
  if (!lista.length) return "?";
  const texto = lista.length === 1 ? primeira(lista[0]) : `${primeira(lista[0])}${primeira(lista.at(-1))}`;
  return texto.toLocaleUpperCase("pt-BR");
}

/** A mesma cor para o mesmo nome (sem acento, caixa ou espaços a mais). */
export function corDoAvatar(nome: string): string {
  const i = Number.parseInt(hashCurto(normalizarTexto(nome)).slice(0, 6), 16) % PALETA_AVATAR.length;
  return PALETA_AVATAR[i] ?? "#1e6fd9";
}

export function avatar(nome: string, o: { tamanho?: number; rotulo?: string } = {}): HTMLSpanElement {
  const t = Math.max(12, Math.min(Math.round(o.tamanho ?? 20), 64));
  const rotulo = o.rotulo ?? nome;
  const el = h("span", { class: "spro-avatar", role: "img", title: rotulo, "aria-label": rotulo }, iniciais(nome));
  const estilo: Array<[string, string]> = [
    ["display", "inline-flex"],
    ["align-items", "center"],
    ["justify-content", "center"],
    ["flex", "none"],
    ["width", `${t}px`],
    ["height", `${t}px`],
    ["border-radius", "50%"],
    ["background-color", corDoAvatar(nome)],
    ["color", "#ffffff"],
    ["font", `600 ${Math.round(t * 0.42)}px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`],
    ["letter-spacing", "0"],
    ["user-select", "none"],
  ];
  for (const [k, v] of estilo) el.style.setProperty(k, v);
  return el;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd sei-comum && npx tsx tests/verificar.ts && npx tsc --noEmit && npx biome check src tests`
Expected: `384 ok, 0 falha(s)`; tsc sem saída; biome sem erro.

- [ ] **Step 5: Commit**

```bash
git add sei-comum/src/ui/avatar.ts sei-comum/tests/verificar-avatar.ts sei-comum/tests/verificar.ts
git commit -F - <<'EOF'
Comum: avatar com iniciais e cor estavel

Iniciais (particulas fora, login vale) e cor derivada do nome numa paleta
legivel nos dois temas, para responsaveis e autores de alteracao.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 11: Fechamento — README, todas as suítes, portões e diff do `dist/`

**Files:**
- Modify: `sei-comum/README.md` (acrescentar um parágrafo antes da linha do comando)

**Interfaces:**
- Consumes: tudo das Tasks 1-10.
- Produces: nada novo (verificação).

- [ ] **Step 1: README do sei-comum**

Em `sei-comum/README.md`, acrescentar antes da linha `    npm install && npm run tipos && npm run verificar && npm run checar`:

```markdown
Também a fundação dos módulos com painel e sincronia (Favoritos, Histórico,
Projetos):

- `sincronia/`: o motor do Texto Padrão (`motor.ts`, um adaptador por módulo,
  releitura antes de gravar), o controle da aba (`controlePagina.ts`), o nome e o
  conteúdo do texto (`textoPadraoCodec.ts`), assinatura, trava, consentimento,
  arquivo sincronizado, cópias diárias e o banco IndexedDB por módulo (`banco.ts`);
- `painel/`: o painel embutido no Controle de Processos (`embutido.ts`), a altura
  do iframe, a sobreposição do diálogo e o aviso no rodapé da tela;
- `ui/dialogo.ts` (modal, confirmar, baixar, escolher arquivo) e `ui/avatar.ts`.

```

- [ ] **Step 2: Todas as suítes**

Run (cada uma na raiz da worktree):

```bash
(cd sei-comum && npx tsx tests/verificar.ts | tail -2)
(cd sei-nucleo && npx tsx tests/verificar.ts | tail -2)
(cd favoritos && npx tsx tests/verificar.ts | tail -2)
(cd historico && npx tsx tests/verificar.ts | tail -2)
(cd agente-ia && npx tsx tests/verificar.ts | tail -2)
```

Expected: `384 ok, 0 falha(s)`, `110 ok, 0 falha(s)`, `578 ok, 0 falha(s)`, `485 ok, 0 falha(s)`, `1054 ok, 0 falha(s)`.

- [ ] **Step 3: Tipos e lint**

Run: `for p in sei-comum favoritos historico agente-ia; do (cd $p && npx tsc --noEmit && echo "$p tipos ok"); done`
Expected: `sei-comum tipos ok`, `favoritos tipos ok`, `historico tipos ok`, `agente-ia tipos ok` (o agente importa `@favoritos/modelo/*` e `@favoritos/repositorio`: continua compilando).
Run: `for p in sei-comum favoritos historico; do (cd $p && npx biome check src tests 2>&1 | grep -E "Found|Checked"); done`
Expected: sei-comum `Found 8 warnings.`, favoritos `Found 1 warning.`, historico só `Checked ...`; nenhum `error`.

- [ ] **Step 4: Builds e portões**

Run: `(cd favoritos && node build.mjs) && (cd historico && node build.mjs)`
Expected: as duas tabelas ("Favoritos -- build", "Historico -- build") e nenhuma linha `ERRO:`.
Run: `git status --short dist`
Expected: vazio (os builds das tarefas já foram comitados; rebuild idêntico).
Run: `node tools/check-dom-injection.mjs && node tools/patch-manifests.mjs --check`
Expected: `check-dom-injection: 0 erro(s), 0 aviso(s)` e `0 manifest(s) precisam de ajuste, 1 ja em dia`.

- [ ] **Step 5: O diff do `dist/` é só o esperado, e nenhuma prova antiga mudou**

Run: `git diff --stat 9eda964 -- dist`
Expected: exatamente quatro arquivos: `dist/js/favoritos/app.js`, `dist/js/favoritos/opcoes.js`, `dist/js/historico/app.js`, `dist/js/init_favoritos.js` (nada em `dist/css`, `dist/html`, `dist/js/favoritos/painel.js`, `dist/js/init_historico.js`, manifests ou agente).
Run: `git diff --stat 9eda964 -- favoritos/tests historico/tests sei-nucleo agente-ia`
Expected: vazio.
Run: `node -e 'for (const f of process.argv.slice(1)) console.log(f, require("fs").readFileSync(f).findIndex((x) => x > 0x7f))' dist/js/init_favoritos.js dist/js/favoritos/app.js dist/js/favoritos/opcoes.js dist/js/historico/app.js`
Expected: `-1` nos quatro (nenhum byte > 0x7f; o portão do build já garante, aqui fica registrado).

- [ ] **Step 6: Commit**

```bash
git add sei-comum/README.md
git commit -F - <<'EOF'
Comum: README da fundacao comum (P1 do gestor de projetos)

Lista o que o sei-comum passou a oferecer aos modulos com painel e sincronia:
motor e controle do Texto Padrao, arquivo, copias, banco por modulo, painel
embutido, dialogos e avatar. Suites: sei-comum 384, sei-nucleo 110,
favoritos 578, historico 485, agente-ia 1054.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

## Auto-revisão (feita ao escrever o plano)

**Cobertura da spec (4.2, 6.1, 6.2, 10):**
- `sincronia/motor.ts` com adaptador `{nome do texto, descrição, exportar, importar, validar ok|invalido|maisNovo, assinatura, teto, aviso, chaveStatus}` → Task 3 (nome e descrição do texto ficam com quem cria o armazém do núcleo — `criarArmazemTextoPadrao(sei, { nome, descricao })`, como nos Favoritos; o motor recebe o `DestinoTexto` pronto). Releitura com até 3 tentativas, com prova → Task 3. `agendarEnvio` 15 s, recuo de 1 dia, `textoDoErro` → Task 3.
- `textoPadraoCodec.ts` (envelope ↔ conteúdo, nome curto 27 + `~` + 8 hex) → Task 1. `assinatura.ts` → Task 1. Lápides com prazo configurável por escopo → `podarLapides` (Task 1) + prova de ponta a ponta no motor (Task 3: 180 dias viaja e remove no outro computador; 90 dias não viaja).
- `arquivo.ts` (`SincroniaArquivo` + `ControleArquivo`, handle no IndexedDB por módulo) → Task 6; `copias.ts` (14, banco por módulo) → Task 5; banco por módulo sem migração dos Favoritos → Task 5 (prova do banco já existente).
- `trava.ts` → Task 2; `consentimento.ts` (`host|login|unidade`, e texto) → Task 2; `controlePagina.ts` (puxar ao carregar ou com pendência, `aoMudar` agenda, liga/desliga, apagar com trava e `localizar`, `ocultarTextosInternos`) → Task 4; intervalo de puxada configurável (2 min no Projetos) e `puxar()` ao ganhar foco → Tasks 3 e 4.
- `ui/dialogo.ts` → Task 7; `painel/embutido.ts` + altura + sobreposição + aviso → Tasks 8 e 9; `ui/avatar.ts` → Task 10.
- Favoritos e Histórico migrados sem mudar expectativas → Tasks 1-9 + Task 11 (diff vazio em `favoritos/tests` e `historico/tests`; contagens iguais).

**Placeholders:** nenhum "TBD"/"depois"; todo passo de código traz o código; os blocos "trocar X por Y" citam o texto exato.

**Consistência de tipos:** `ValidacaoTexto<E>` nasce na Task 1 e é o retorno de `AdaptadorTexto.validar` (Task 3) e de `validarEnvelopeDoTexto` (Favoritos); `Travar`/`TravarEsperando` (Task 2) são os tipos de `DepsMotorTexto.travar` e `DepsControlePagina.travarEsperando`; `PortaConsentimento` (Task 2) tem `estado/definir/aoMudar`, os três usados pelo `ControleTextoPadrao` (Task 4) e implementados pela fachada dos Favoritos; `Dono` nasce em `copias.ts` (Task 5) e é usado por `arquivo.ts` (Task 6); `Sobreposicao`/`AvisarNaPagina` (Task 8) são os tipos de `tratadoresDoPainel` (Task 9) e do `DepsExecutor` dos Favoritos; `AlturaDoApp` (Task 8) é o parâmetro de `sobreposicaoNoApp`.

**Review Focus:** cada item tem prova na tarefa dona — 1: Tasks 1, 2, 3, 5 (+ suíte dos Favoritos intocada); 2: Task 3; 3: Tasks 2 e 4; 4: Tasks 7, 8, 9, 10; 5: Tasks 8 e 9.
