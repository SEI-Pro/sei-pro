# sei-comum

Peças genéricas do SEI Pro que não sabem nada do SEI: datas e feriados, construção
de DOM sem `innerHTML`, armazenamento uma-chave-por-entidade, mesclagem por
entidade (vence o mais recente), índice fracionário para ordem manual, leitura das
opções antigas (`dataValues`) e RPC sobre portas.

O que fala com o SEI fica no `sei-nucleo`. Os pacotes de funcionalidade
(`favoritos/`, `agente-ia/`) importam daqui pelo alias `@comum/*`.

Também a fundação dos módulos com painel e sincronia (Favoritos, Histórico,
Projetos):

- `sincronia/`: o motor do Texto Padrão (`motor.ts`, um adaptador por módulo,
  releitura antes de gravar), o controle da aba (`controlePagina.ts`), o nome e o
  conteúdo do texto (`textoPadraoCodec.ts`), assinatura, trava, consentimento,
  arquivo sincronizado, cópias diárias e o banco IndexedDB por módulo (`banco.ts`);
- `painel/`: o painel embutido no Controle de Processos (`embutido.ts`), a altura
  do iframe, a sobreposição do diálogo e o aviso no rodapé da tela;
- `ui/dialogo.ts` (modal, confirmar, baixar, escolher arquivo) e `ui/avatar.ts`;
- `ui/acoesNumeroProcesso.ts` + `.css`: `acoesDoNumero({protocolo, doc, aoAbrirNovaAba | href, copiar?, compacto?})`, os dois botões
  (abrir em nova aba e copiar número) ao lado do número do processo, usados na grade do Controle, no Histórico
  e nos Favoritos; `copiarTexto` (clipboard com fallback). O CSS entra nos builds de quem usa.
- `ui/alturaRedimensionavel.ts` + `.css`: `alturaRedimensionavel({rolagem, chave, padraoVh | padraoPx, minPx?, maxPx?, area?, rotulo?, aoMudar?})`
  devolve `{alca, estado(), ajustarAoConteudo(), limitar(px?), destruir()}`. A área ganha `max-height` (variável `--spro-altura-max`)
  e rolagem; a `alca` (role=separator horizontal, focável) vai logo depois dela e muda a altura por arrasto (pointer events),
  setas (24 px, Shift 96), Home (mínimo) e End/Enter/Espaço/duplo clique (modo auto: até `TETO_AUTO_PX` = 5000 px; outro
  duplo clique volta ao limitado). Persiste em `spro_altura:<chave>` na `area` (com memória do módulo, porque os painéis redesenham
  o corpo); falha de armazenamento é silenciosa. Em iframe que cresce com o conteúdo use `padraoPx` (`vh` seria circular).
  `comAlturaRedimensionavel` devolve o envoltório com área + alça. Usado na grade do Controle (68vh), nos Monitorados, na tabela
  das Demandas e nas listas dos Projetos (520 px). O CSS entra nos builds de quem usa.

    npm install && npm run tipos && npm run verificar && npm run checar
