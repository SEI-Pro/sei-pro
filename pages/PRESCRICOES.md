# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Prescrições](../img/icon-prescricoes.png) Gerenciar Prescrições Processuais

Para áreas que conduzem **processos sancionadores** — fiscalização, infrações, penalidades —, perder um prazo de prescrição significa perder o direito de punir. Esta função acompanha, **dentro de cada processo**, a contagem dos prazos prescricionais: quanto já correu, quanto falta, as suspensões e o encerramento.

> Esta é uma função **institucional**. Ela só funciona em órgãos que usam o módulo **Atividades** do SEI Pro, com um servidor próprio configurado pela área responsável, e para usuários com permissão para ver prescrições. Sem isso, a opção pode estar ligada nas configurações, mas nada aparece no SEI.

### O que aparece

Nos processos em que há prescrição cadastrada, a árvore do processo ganha o painel **Gerenciar prescrições do processo**, com uma tabela para cada tipo de prescrição:

| Coluna | Significado |
| ------ | ----------- |
| **Ação inaugural** / **Documento** | O documento que dá início à contagem |
| **Data Início** e **Data Fim** | O período de cada contagem |
| **Dias decorridos** / **Duração** | Quanto tempo já correu em cada período |
| **Prazo (dias)** | O prazo prescricional do tipo |
| **Total** | Soma do tempo decorrido, descontadas as suspensões |

### Como cadastrar

Usuários com permissão de alteração veem o botão **Adicionar nova prescrição**:

1. Escolha o **Tipo de Prescrição**;
2. Informe a **Data** e o **Documento** que marca o início;
3. Se for o caso, marque **Suspender a contagem prescricional?** ou **Encerrar a contagem prescricional? (trânsito em julgado)**;
4. Clique em **Salvar**.

### Como ativar

1. A área responsável no seu órgão fornece o **endereço do servidor** e a **chave de acesso** do módulo Atividades;
2. Nas [Configurações do SEI Pro](../pages/DESATIVARFUNCOES.md), aba **Base de Dados**, cadastre uma base do tipo **Atividades** com esses dados;
3. Na aba **Complementos**, deixe marcada **Gerenciar Prescrições Processuais** (vem ligada de fábrica);
4. Clique em **Salvar** e recarregue o SEI.

### Bom saber

* Os tipos de prescrição e seus prazos são definidos pela área responsável no servidor do órgão, não pelo usuário.
* As informações ficam no servidor do órgão e são compartilhadas por todos os usuários autorizados.

## Próximo item

> [Gerenciar projetos (descontinuada)](../pages/PROJETOS.md)
