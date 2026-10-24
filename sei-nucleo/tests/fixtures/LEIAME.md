# Fixtures do sei-nucleo

`sei41/` traz telas reais do SEI SP Treinamento (4.1.5) e `sei5/` telas reais
do SEI 5, todas com hashes de sessão zerados. A primeira linha de cada arquivo
é `<!-- url: ... -->`, a URL de onde a tela veio.

## Captura do SEI MJ (5.0.4)

| Arquivo | Origem | Anonimização |
|---|---|---|
| `sei5/documento_alterar.html` | Tela `documento_alterar` de um Termo de Compromisso de Manutenção de Sigilo, capturada no SEI MJ de homologação (hmlsei.mj.gov.br, CK5), em 16/10/2026. Mantida em Latin-1, como o servidor entrega. | Todo hash de sessão de 64 hexadecimais virou 64 zeros; o login do usuário (`usuario.teste`, inclusive no prefixo do cookie `MJ_SEI_usuario_teste`) e o nome de pessoa no conteúdo (`Fulano de Tal`) foram trocados. Ids de unidade e de processo ficaram. |

## Capturas do SEI SP Treinamento (4.1.5) para o módulo Processo, 24/10/2026

Somente leitura (GET), na unidade TESTE. Hashes de sessão zerados; o login `28352243861` virou `usuario.teste` e os nomes de pessoa de terceiros (`Fernando Silva Oliveira`, `Romualdo Lima Pereira`) foram trocados por `Fulano de Tal` e `Beltrano de Tal`.

| Arquivo | Origem |
|---|---|
| `sei41/arvore_relacionados.html` | Árvore (`procedimento_visualizar`) do processo 142145, que tem dois processos relacionados (`#divRelacionadosParciais`). |
| `sei41/arvore_atribuido.html` | Árvore do processo 148265 já atribuído: `Nos[0].html` com "Processo aberto nas unidades", uma delas "atribuído para" o usuário. |
| `sei41/p_acompanhamento_lista.html` | `acompanhamento_gerenciar` do processo 142145 (que já tem acompanhamento): a lista de acompanhamentos da unidade no processo. |
| `sei41/p_acompanhamento_alterar.html` | `acompanhamento_alterar` do mesmo acompanhamento: formulário com `hdnIdAcompanhamento`, grupo e observação preenchidos. |
| `sei41/p_anotacao_prioridade.html` | `anotacao_registrar` do processo 148265: anotação com texto em checklist e prioridade marcada. |

## Capturas do SEI SP Treinamento (4.1.5) para o menu da árvore, 24/10/2026

| Arquivo | Origem |
|---|---|
| `sei41/pasta_paginar.html` | O que o SEI deixa no `#ifrPasta` depois de abrir a Pasta I do processo 148265 (resposta de `procedimento_paginar`): os `Nos[n]` e `Nos[n].acoes` de 20 documentos da pasta (inclusive um processo anexado e um documento movido), sem o nó do processo. A resposta é JavaScript que o navegador guarda como comentário; o arquivo é o `outerHTML` do documento do iframe, com o `<html>` sem os atributos da extensão e os hashes de sessão zerados. |

Não há captura real de árvore do SEI 5 nas fixtures: os testes do menu usam a mesma árvore do 4.1 com a âncora do 5 montada a partir do fonte do 5.0.0 (`arvore_montar.js`: `data-serialtip` no `anchorImg`), marcada como sintética nos próprios testes.

## Capturas do SEI SP Treinamento (4.1.5) para o leitor de andamentos, 24/10/2026

Histórico completo (`hdnTipoHistorico=P`), capturado pelo POST do formulário do histórico (somente leitura de dados; muda o estado do histórico na sessão, que a coleta devolveu ao que era). Hashes de sessão zerados (`hdnInfraHashCriterios`, que é um MD5 da consulta e não da sessão, ficou); os logins e nomes de pessoas (`afarias`, CPFs, `pedro.soares`, nomes completos) viraram `usuarioNN`/`Usuário NN`; os e-mails e o nome do destinatário do acesso externo viraram `fulano@exemplo.com`/`beltrano@exemplo.com`/`FULANO APOSENTADO`.

| Arquivo | Origem |
|---|---|
| `sei41/historico_completo_p0.html`, `historico_completo_p1.html` | Páginas 0 e 1 do histórico completo de um processo com 150 andamentos (100 + 50, sem `select` de páginas: só o link de próxima), remessa para várias unidades, reabertura, conclusão, unidades que nunca abriram o processo e linhas `andamentoAberto`. Aqui "Chefia de Gabinete" é o nome de cinco unidades de órgãos diferentes e a sigla SSP-CG aparece com dois nomes. |
| `sei41/historico_completo_siglas.html` | Histórico completo de um processo com 60 andamentos (uma página): a sigla CGE-CG com dois nomes. |

## Capturas do SEI SP Treinamento (4.1.5) para assuntos, interessados e a pesquisa do interessado, 24/10/2026

Somente leitura: a pesquisa (`protocolo_pesquisar`) e o autocompletar (`controlador_ajax.php`) são consultas do próprio SEI, feitas com a sessão do usuário. Hashes de sessão zerados; o login `pedro.soares` virou `usuario.teste` (inclusive no prefixo do cookie `GESP-TREINAMENTO_SEI_usuario_teste`), o nome do usuário virou `Fulano de Tal` e um login de terceiros (`fendi`) virou `usuario03`. Nomes de unidade, de tipo de processo e de contato são os genéricos do ambiente de treinamento (órgãos e empresas, nenhuma pessoa física).

| Arquivo | Origem |
|---|---|
| `sei41/p_pesquisa_interessado_p0.html`, `p_pesquisa_interessado_p1.html` | Pesquisa de PROCESSOS com `hdnIdContato` de um contato órgão (Secretaria da Segurança Pública) que tem 13 processos: página 1 ("Exibindo 1 - 10 de 13") e página 2 (`hdnInicio=10`, a barra diz só "13 resultados"). Cada resultado: número, tipo, unidade (sigla e nome), usuário (login e nome) e data de inclusão. |
| `sei41/p_pesquisa_interessado_unico.html` | O que o SEI devolve quando a pesquisa por um interessado acha UM só processo: pula direto para `procedimento_trabalhar` (o título da tela traz o número do processo, a URL o `id_procedimento`). |
| `sei41/ajax_assunto_autocompletar.xml` | Resposta de `assunto_auto_completar_RI1223` para "contratação" (itens `<item id descricao>`, descrição com acentos). |
| `sei41/ajax_contato_autocompletar.xml` | Resposta de `contato_auto_completar_contexto_RI1225` para "segurança" (a tela envia o termo codificado duas vezes). |

Ainda sem captura do SEI 5.0.4 para estas telas: os ids dos campos e do autocompletar foram conferidos no fonte do 5.0.0 (`procedimento_cadastro.php`: `hdnIdAssunto`, `hdnIdInteressadoProcedimento`, `arrAssuntosNegados`, `arrInteressadosNegados`).

## Fixtures sintéticas (não são captura)

| Arquivo | Origem | Substituir |
|---|---|---|
| `sei41/documento_mover.html` | Montada à mão a partir do HTML de `sei/web/documento_mover.php` do SEI 5.0.0 (formulário `#frmDocumentoMover`, campos, botão `sbmMover` e o `infraAjaxComplementar` de `protocolo_RI1023` no script da tela), com os ids do processo 148265 e do documento 160172 de `sei41/arvore_completa.html`. | Tarefa 13 (Ações em Lote): capturar a tela real no SEI SP (4.1.5) e no SEI MJ (5.0.4). |

Respostas montadas dentro das provas (não há arquivo): o XML do
`protocolo_RI1023` (`InfraAjax::gerarXMLComplementosArray` do SEI 5) e a tela
`documento_selecionar` da lupa do PDF (`documento_selecao.php` do SEI 5, linhas
com `chkInfraItemN`). Também a confirmar com captura real na Tarefa 13.
