# Fluxos de exemplo

Um arquivo `.md` por fluxo. É o formato que o **Estúdio de Fluxo** do SEI Pro lê
e escreve: aponte uma pasta como esta em *Coleção da equipe* e todo mundo da
unidade recebe os mesmos ritos, com sincronização.

O formato é texto que se lê — a ideia é que a equipe **confira e edite o arquivo
aqui no GitHub**, com histórico e revisão, e não numa tela de configuração que
só uma pessoa enxerga.

## Como é o arquivo

```markdown
# Nome do fluxo

Uma linha dizendo para que ele serve.

- aplica-se a: Procedimento de Fiscalização | Dispensa
- marcador: Urgente
- unidade: GPF

## 1. Nome da etapa
- documento: Título como aparece na árvore | Variação | Sigla
- assinado: sim
- da minha unidade: sim
- obrigatória: não
- prazo: 5 dias
- ação: Preparar despacho de aprovação
- pedido: Texto enviado ao agente quando o usuário aceita a sugestão.
- desvio: se o título anterior contiver "MINUTA", ir para "Nome de outra etapa"
```

Só `#` (nome) e, em cada etapa, `- documento:` são obrigatórios. O resto é opcional.

## O que você precisa saber

* **Fluxo que chega da equipe nasce desligado.** Cada pessoa decide quando ligar,
  e essa decisão dela não é desfeita nas sincronizações seguintes;
* **O arquivo manda.** O que você editar na tela, num fluxo que veio da pasta,
  é substituído na próxima sincronização — para mudar de verdade, edite aqui;
* **Arquivo apagado na pasta some** dos navegadores na sincronização seguinte.
  Os fluxos que cada um escreveu à mão continuam intactos;
* Um arquivo com problema **não derruba a sincronização**: ele fica de fora, e o
  motivo aparece na tela da coleção;
* O casamento é pelo **título do documento na árvore**, sem acento e sem caixa.
  Como os títulos mudam de órgão para órgão, liste as variações separadas por `|`;
* **Duas etapas com títulos parecidos precisam de ordem.** No rito
  "Ofício-MINUTA assinado → Ofício expedido", ponha a etapa específica (`Ofício-MINUTA`)
  ANTES da genérica (`Ofício`): a avaliação anda para a frente e consome a primeira
  que casar.

Para gerar o primeiro arquivo, monte o fluxo no Estúdio e use **Exportar .md**.
