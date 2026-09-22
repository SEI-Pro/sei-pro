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
`processo_historico`, `documentos_listar`, `documento_ler` (HTML e PDF com texto).

Escrita (em lote, com prévia): `processo_alterar`, `processo_marcador`,
`processo_anotacao`, `processo_andamento`, `processo_atribuir`,
`processo_acompanhamento`, `processo_concluir`, `processo_reabrir`,
`processo_enviar` (irreversível: o cartão exige confirmação), `documento_assinar`
(o cartão pede cargo e senha; a senha vai do painel direto para a aba e nunca entra
nos argumentos que o modelo vê),
`documento_alterar` (sigilo em lote), `documento_criar` (documentos em lote, com
conteúdo), `documento_editar`.

Motor: `plano_propor` (escritas dependentes, referências `$1.caminho`),
`tarefas`, `perguntar`, `skill_ler` (`redacao-oficial`, `lote`, `prazos`).

Para acrescentar uma ferramenta: operação no núcleo (`sei-nucleo/src/dominio`),
entrada em `ponte/operacoes.ts` e definição em `tools/sei.ts` (escrita usa
`escritaEmLote`, que já faz prévia e resultado por item).

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

## Pendências conhecidas (fase 2)

- `editor_ler` / `editor_escrever` no editor ABERTO (hoje o conteúdo é gravado
  pelo servidor; com o editor aberto, o SEI avisa de nova versão ao salvar).
- OCR de PDF digitalizado (reaproveitar o Tesseract das Ferramentas de PDF).
- Firefox (`sidebar_action` nos manifests v2).
- Excluir, cancelar assinatura, ciência, pesquisa avançada;
  blocos e sobrestamento (fase 3).
- Remover a ferramenta de IA antiga (`sei-pro-ai.js` e IA do editor).
