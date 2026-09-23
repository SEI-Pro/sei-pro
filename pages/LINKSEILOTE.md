# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Converter números SEI em links](../img/icon-linkseilote.png) Converter os números SEI do texto em links

Escreveu um despacho que cita uma penca de documentos — *0103984*, *0103990*, *0104018* — e agora precisa transformar cada número em link? Em vez de marcar um a um e clicar no botão de link do SEI a cada vez, o SEI Pro **varre o texto inteiro, encontra os números e converte todos de uma vez**.

### Como usar

1. Com o documento aberto no editor, acione a ferramenta:
   * **SEI 5:** botão **Converter os números SEI do texto em links**, na barra do editor, ao lado do botão de link do SEI;
   * **SEI 3 e 4:** abra a janela **Inserir um Link para processo ou documento do SEI!** (o botão de link do SEI, ou `Ctrl+Shift+L`) e clique em **Converter todos os números do texto**, no rodapé da janela.
2. A extensão mostra a lista do que encontrou: cada número com o trecho de texto em volta, todos marcados;
3. **Desmarque o que não for documento** e clique em **Converter**;
4. Ao final, aparece quantos viraram link — e, se algum ficar de fora, quais foram e o motivo que o SEI deu.

### Como os números são reconhecidos

O tamanho do número de documento muda de órgão para órgão (7 dígitos em uns, 8 em outros). A extensão **não** usa uma lista fixa: ela olha os documentos do **próprio processo** e procura no texto números do mesmo tamanho.

Por isso a conferência da lista importa: uma sequência solta de 8 dígitos também pode ser um CEP, um ano com mês e dia, um número de outro sistema. Quem decide é você, na janela da prévia.

### Bom saber

* Número que **já é link** não entra na conta — a ferramenta só procura texto puro.
* Funciona com documentos de **outros processos**, não só do processo atual: a consulta é a mesma que o botão de link do SEI faz.
* Cada número marcado é **uma consulta ao servidor**. Em listas muito grandes, a conversão leva alguns segundos e é feita um número de cada vez, para não sobrecarregar o SEI.
* Se o SEI não encontrar um documento, aquele número **continua como texto** e aparece no aviso do final, com a resposta do SEI. Os demais são convertidos normalmente.
* O documento **não é salvo** pela ferramenta: confira o resultado e clique em **Salvar**.

## Próximo item

> [Referência a documentos](../pages/REFDOCUMENTOS.md)
