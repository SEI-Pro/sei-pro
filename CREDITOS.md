# [![Home](./img/home.png)](./) |  SEI Pro ![Icone](./img/icon-32.png)

## Créditos

### Projeto original

O **SEI Pro** é criado e mantido por **Pedro Soares** e colaboradores, em
[github.com/SEI-Pro/sei-pro](https://github.com/SEI-Pro/sei-pro), sob a licença
[AGPL-3.0](./LICENSE.txt). Todo o resto da extensão, as funções, a documentação e a identidade visual, é
desse projeto.

### Contribuição do IPPLAM (Maringá/PR)

As funções abaixo foram desenvolvidas por **Bruno Albuquerque**, do **IPPLAM, Instituto de Pesquisa e
Planejamento Urbano de Maringá**, autarquia municipal vinculada ao Poder Executivo do **Município de
Maringá (PMM, Prefeitura do Município de Maringá)**. Elas foram feitas para o uso diário do SEI 5.0.5 do
município e são oferecidas ao projeto original, para serem incorporadas às versões oficiais se o
mantenedor quiser.

| Função | Manual | Código |
| ------ | ------ | ------ |
| Tabela com colunas em %: larguras, posição, temas personalizados, bordas para o "Gerar PDF", limpeza de tabela colada | [pages/TABELACOLUNAS.md](./pages/TABELACOLUNAS.md) | [tabela-colunas/](./tabela-colunas/) |
| Gerar documento com modelo limpo | [pages/MODELOLIMPO.md](./pages/MODELOLIMPO.md) | [modelo-limpo/](./modelo-limpo/) |
| Núcleo: estilos do editor lidos de `infra.estilo`, como chegam no SEI 5.0.5 | n/a | [sei-nucleo/src/dominio/editor.ts](./sei-nucleo/src/dominio/editor.ts) |
| Botões de tabela do SEI Pro num grupo próprio da barra do CK5, para não se sobreporem | n/a | `inserirGrupoTabelaCK5` em [dist/js/sei-pro-editor.js](./dist/js/sei-pro-editor.js) |

### Contribuição de @willmedina87

Melhorias no Quadro da Grade do Controle (colunas reordenáveis e recolhíveis, largura ajustável, último marcador, cartões com anotação e checklist), prazos nos cartões do Quadro, correção do botão "Exibir Menu do Sistema" do Estilo Avançado e tratamento de contexto de extensão invalidado, CSV completo na Grade do Controle, correções no envio de PDF ao processo, enviadas no PR [#193](https://github.com/SEI-Pro/sei-pro/pull/193) por [willmedina87](https://github.com/willmedina87).
