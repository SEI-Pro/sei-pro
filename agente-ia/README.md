# Agente de IA do SEI Pro

Um agente que trabalha **dentro do SEI**, pela sessão do usuário, direto do
navegador: sem backend, sem API WSSEI, com a chave do OpenRouter do próprio
usuário. O modelo escolhe e aciona ferramentas tipadas; toda escrita no SEI
passa por um plano que o usuário aprova.

Desenho completo: [`docs/superpowers/specs/2026-09-22-agente-ia-sei-design.md`](../docs/superpowers/specs/2026-09-22-agente-ia-sei-design.md).

## Onde cada coisa roda

```
Painel lateral (html/agente.html + js/agente/painel.js) — página da extensão
  motor (loop OpenRouter + tools + plano) · chave · pseudônimos · UI
        ▲  porta chrome.runtime "seipro-agente" (aberta pela aba)
Aba do SEI: js/init_agente.js — content script, MUNDO ISOLADO
  sei-nucleo (fetch com os cookies da sessão) · operações · leitura da tela
```

- O painel nunca fala com o SEI: pede à aba. Link assinado, cookie e HTML de tela
  não saem da aba; o painel recebe dados já reduzidos (`ponte/operacoes.ts`).
- O content script roda no mundo isolado: os scripts do SEI não enxergam o agente.
- A aba abre a porta para o painel (técnica das Ferramentas de PDF), por isso a
  extensão não precisa da permissão `tabs`. Permissão nova: só `sidePanel`.

## As três fronteiras do motor (`src/motor/motor.ts`)

1. **Saída para o modelo:** mensagem do usuário e resultado de tool passam por
   `Pseudonimos.anonimizar` (CPF, e-mail, telefone, CEP, RG, título, CNH, cartão,
   PIX, endereço, filiação, conta, CID, nomes de interessados → `[CPF_1]`,
   `[PESSOA_2]`...). Protocolos do SEI são preservados. `infra_hash` nunca sai.
2. **Entrada do modelo:** argumentos validados contra o esquema (erro volta ao
   modelo para ele corrigir) e reidratados (`[PESSOA_2]` → nome real) só na hora
   de executar.
3. **Escrita no SEI:** só dentro de plano aprovado. As escritas de uma rodada
   viram UM cartão (prévia real antes → depois, item a item); aprovado, o motor
   executa sem voltar ao modelo entre os passos.

Sigilo: processo sigiloso na tela bloqueia a conversa antes de qualquer envio;
o núcleo recusa conteúdo sigiloso; restrito pede consentimento uma vez por conversa.

## Ferramentas (fase 1)

Leitura: `contexto_tela`, `sei_opcoes`, `processos_listar`, `processo_consultar`,
`processo_historico`, `processos_pesquisar` (pesquisa do órgão; trecho só com
consentimento), `documentos_listar`, `documento_ler` (HTML e PDF com texto).

Escrita (em lote, com prévia): `processo_alterar`, `processo_marcador`,
`processo_anotacao`, `processo_andamento`, `processo_atribuir`,
`processo_acompanhamento`, `processo_concluir`, `processo_reabrir`,
`processo_enviar` (irreversível: o cartão exige confirmação), `documento_assinar`
(o cartão pede cargo e senha; a senha vai do painel direto para a aba e nunca entra
nos argumentos que o modelo vê),
`documento_excluir`, `documento_cancelar` (motivo), `documento_cancelar_assinatura`
(os três irreversíveis), `documento_ciencia`, `documento_alterar` (sigilo em lote), `documento_criar` (documentos em lote, com
conteúdo), `documento_editar`.

Motor: `plano_propor` (escritas dependentes, referências `$1.caminho`),
`tarefas`, `perguntar`, `skill_ler` (`redacao-oficial`, `lote`, `prazos`).

Para acrescentar uma ferramenta: operação no núcleo (`sei-nucleo/src/dominio`),
entrada em `ponte/operacoes.ts` e definição em `tools/sei.ts` (escrita usa
`escritaEmLote`, que já faz prévia e resultado por item).

## Conversas guardadas

A conversa viva fica em `chrome.storage.session` (morre com o navegador). Além
dela, o painel guarda no IndexedDB **só a transcrição** — o que apareceu na
tela (`painel/historico.ts`). Ficam de fora, de propósito, o histórico que vai
ao modelo e o mapa de pseudônimos, que liga `[PESSOA_1]` ao nome real: em
disco, seria a parte mais sensível da conversa, legível por quem usar o mesmo
perfil do navegador. Por isso uma conversa guardada abre para **ler e
exportar** (Markdown), nunca para continuar.

O relógio no topo do painel lista, abre, exporta e apaga. Na configuração há o
interruptor ("Guardar as conversas neste navegador", ligado) e o prazo de
guarda (7, 30, 90 dias ou sem limite), aplicado a cada abertura do painel.

## Serviço de IA

Dois caminhos, o mesmo protocolo (o da API da OpenAI):

- **OpenRouter** (padrão): catálogo filtrado pelos modelos que usam ferramentas,
  preço por modelo, custo real por requisição e `provider.data_collection: "deny"`
  — o agente só aceita provedor que não guarde nem treine com o que recebe.
- **Compatível com OpenAI**: o usuário informa endereço, chave e modelo. Serve
  para NVIDIA (`https://integrate.api.nvidia.com/v1`), Groq, um Ollama na
  própria máquina ou um servidor do órgão. Sem catálogo de preços (o medidor
  passa a mostrar tokens) e sem como exigir política de dados: quem escolhe o
  endereço responde por ele. Nem todo modelo aceita ferramentas.

Só o OpenRouter responde com `Access-Control-Allow-Origin: *`. Para os demais o
navegador bloqueia por CORS, então o painel pede permissão de host no momento
em que o usuário salva o endereço (`optional_host_permissions` no manifest, e o
pedido cai sobre a origem informada — nunca sobre todos os sites). O manifest v2
do Firefox precisa do mesmo em `optional_permissions`.

## Painel (UI)

Uma tela só — a conversa. A configuração é um `<dialog>` modal por cima dela (na primeira vez,
sem chave, ele não fecha sem salvar); os cartões de plano, consentimento e pergunta nascem na
própria conversa. `estatico/agente.css` guarda todo o design em tokens no `:root`, redefinidos
no modo escuro: nenhuma cor literal fora dali. Os ícones são SVG desenhados no DOM (`icone()`
em `src/painel/dom.ts`), nunca emoji nem `innerHTML`.

O alvo do build é Chrome 116 e Firefox 115, então o CSS não usa aninhamento nem `:has()`, e o
que é recente (`closedby`, `@starting-style`) tem recuo ou degrada sozinho.

## Desenvolvimento

```
npm install            # também em ../sei-nucleo e ../ferramentas-pdf (pdf.js)
npm run verificar      # motor com provedor roteirizado (24 verificações)
npm run tipos
npm run build          # gera os arquivos em ../dist
```

O teste ponta a ponta usado na validação (Chrome com a extensão + SEI SP
Treinamento + OpenRouter simulado por interceptação de rede) está descrito no
plano, Task 13.

## Firefox

Validado no Firefox 156 (manifest v2): o item "Agente de IA" do menu do SEI é
um link para `html/agente.html` (o Firefox recusa `window.open` de endereço da
extensão feito por content script), e o painel também fica em
`sidebar_action`. O manifest v2 do Firefox (`dist/manifest_v2.json`) não é
versionado: ele precisa de `sidebar_action`, do content script
`js/init_agente.js` e de `js/sei-pro-agente-editor.js` e `html/agente.html` em
`web_accessible_resources` — ver o script de empacotamento do Firefox.

## Pendências conhecidas

- Blocos e sobrestamento (fase 3).
- Remover a ferramenta de IA antiga (`sei-pro-ai.js` e IA do editor).
