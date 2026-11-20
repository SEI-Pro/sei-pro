# Medições do Comparador de Documentos (legado × novo)

Data: 2026-11-20. Chrome com a extensão carregada do `dist/` (branch `feat/comparador-ts`).

## Ao vivo: SEI SP treinamento (SEI 4.1.5)

Processo `99906.713-630.000032/2025-82`; A = Despacho E1 Descartar (0105060), B = Despacho Maria Souza (0103948), documentos pequenos (~36 KB de HTML).

| | Legado | Novo |
|---|---|---|
| Do clique no B até o resultado | 2.402 ms | ~1.150 ms (uma requisição; A já lido ao abrir) |
| Cálculo (blocos + diff + montagem) | dentro dos 2.402 ms | ~7 ms (2,7 + 4,0 + 0,6) |
| Inverter | refaz tudo | 0 ms de leitura (cache), ~3 ms de cálculo |
| Onde roda o diff | thread da página | Web Worker (`js/comparador/worker.js` aparece como alvo `worker` no Chrome) |

O ganho nesses documentos pequenos vem das requisições (o legado faz três em série para achar o endereço do B). O custo do diff só aparece em documento maior:

## Algoritmo em escala (Node, documentos sintéticos, 5% dos parágrafos alterados)

| Parágrafos (tamanho) | `htmldiff` do legado | Diff novo (blocos + palavras) |
|---|---|---|
| 100 (39 KB) | 3.420 ms | 17 ms |
| 300 (117 KB) | 98.694 ms | 16 ms |
| 600 e 1.200 | não terminou (interrompido) | — |

Provas unitárias do diff novo: 5.000 blocos com 5% alterados < 1 s; 3.000 blocos totalmente diferentes < 2 s.

## Conferido ao vivo (SEI SP)

Abrir pelo botão da barra; A fixo; lista de B sem anexos; resultado com cores e estrutura do documento; Inverter (6/8 ↔ 8/6 ins/del); Baixar (nome igual ao do legado, BOM `ef bb bf`, MIME `text/html;charset=utf-8`); Criar Novo Documento (documento 0106148 criado, 8 `<ins>` e 6 `<del>` gravados; processo restrito herda a hipótese legal do processo); processo marcado na árvore = "Nenhum documento selecionado"; X fecha, devolve a rolagem da página.

## Observações

- PDF marcado como A: o app recusa ("só documentos gerados no SEI"); o legado "comparava" o visualizador de PDF (resultado sem sentido).
- Console: o `DOMParser` que lê o HTML original do SEI (com `onclick`/`onload` inline) gera avisos de CSP "Executing inline event handler" no app. São inertes (o documento do parser não executa nada) e inerentes a ler HTML do SEI numa página de extensão; o resultado exibido não tem nenhum `on*`.
