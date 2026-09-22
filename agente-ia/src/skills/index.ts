/**
 * Skills: instruções longas carregadas sob demanda (`skill_ler`), para o
 * prompt de sistema ficar curto. Mesma ideia das skills do Claude Code: o
 * modelo vê a lista com uma linha de descrição e lê a skill quando precisa.
 *
 * O dicionário de estilos veio do MCP SEI Pro (`mcp-sei/src/mcp_seipro/sei_styles.py`).
 */

export interface Skill {
  descricao: string;
  texto: string;
}

export const SKILLS: Record<string, Skill> = {
  "redacao-oficial": {
    descricao: "Como escrever o HTML do corpo de documentos do SEI (classes de estilo, t\u00EDtulos, listas, cita\u00E7\u00F5es, tabelas, link para outro documento).",
    texto: `# Reda\u00E7\u00E3o no editor do SEI

O corpo do documento \u00E9 HTML com PAR\u00C1GRAFOS e CLASSES do SEI. N\u00E3o use <h1>, <ul>, <b> soltos nem CSS inline: use as classes.
Cabe\u00E7alho, t\u00EDtulo e ep\u00EDgrafe j\u00E1 v\u00EAm do modelo do tipo de documento: escreva s\u00F3 o corpo.

Exemplo de despacho:
<p class="Texto_Alinhado_Esquerda">\u00C0 SIGLA - Nome da Unidade,</p>
<p class="Texto_Justificado_Recuo_Primeira_Linha">Encaminho o presente processo para an\u00E1lise e manifesta\u00E7\u00E3o.</p>
<p class="Texto_Justificado_Recuo_Primeira_Linha">Atenciosamente,</p>

Classes dispon\u00EDveis:
- Texto_Justificado: Par\u00E1grafo justificado (uso geral, mais comum)
- Texto_Justificado_Recuo_Primeira_Linha: Par\u00E1grafo justificado com recuo na primeira linha (25mm)
- Texto_Justificado_Maiusculas: Par\u00E1grafo justificado em mai\u00FAsculas
- Texto_Alinhado_Esquerda: Texto alinhado \u00E0 esquerda. Para destinat\u00E1rio de Despachos, usar com \u00E2ncora SEI para vincular \u00E0 unidade.
- Texto_Alinhado_Esquerda_Espacamento_Simples: Texto \u00E0 esquerda com espa\u00E7amento simples (menos margem)
- Texto_Alinhado_Esquerda_Maiusc: Texto \u00E0 esquerda em mai\u00FAsculas
- Texto_Alinhado_Esquerda_Maiusc_Negrito: Texto \u00E0 esquerda, mai\u00FAsculas, negrito (13pt)
- Texto_Alinhado_Direita: Texto alinhado \u00E0 direita
- Texto_Alinhado_Direita_Maiusc: Texto \u00E0 direita em mai\u00FAsculas
- Texto_Centralizado: Texto centralizado (cabe\u00E7alhos, assinaturas)
- Texto_Centralizado_Maiusculas: Texto centralizado em mai\u00FAsculas (13pt, nome do signat\u00E1rio)
- Texto_Centralizado_Maiusculas_Negrito: Texto centralizado, mai\u00FAsculas, negrito (t\u00EDtulos de se\u00E7\u00E3o)
- Texto_Fundo_Cinza_Negrito: Texto com fundo cinza e negrito (destaque de se\u00E7\u00E3o)
- Texto_Fundo_Cinza_Maiusculas_Negrito: Texto com fundo cinza, mai\u00FAsculas e negrito
- Texto_Espaco_Duplo_Recuo_Primeira_Linha: Negrito com espa\u00E7amento duplo entre letras (\u00EAnfase especial)
- Citacao: Cita\u00E7\u00E3o recuada (10pt, margem esquerda 160px). Usar para reproduzir trechos de leis, normas, ac\u00F3rd\u00E3os, pareceres ou outros documentos citados no texto.
- Tachado: Texto tachado (riscado, para indicar exclus\u00E3o)
- Paragrafo_Numerado_Nivel1: Par\u00E1grafo numerado n\u00EDvel 1 (1. 2. 3.)
- Paragrafo_Numerado_Nivel2: Par\u00E1grafo numerado n\u00EDvel 2 (1.1. 1.2.)
- Paragrafo_Numerado_Nivel3: Par\u00E1grafo numerado n\u00EDvel 3 (1.1.1.)
- Paragrafo_Numerado_Nivel4: Par\u00E1grafo numerado n\u00EDvel 4 (1.1.1.1.)
- Item_Nivel1: T\u00EDtulo de se\u00E7\u00E3o n\u00EDvel 1 (\u2248 H1 / #) \u2014 mai\u00FAsculas, negrito, fundo cinza. Ex: '1. INTRODU\u00C7\u00C3O', '2. FUNDAMENTA\u00C7\u00C3O'
- Item_Nivel2: T\u00EDtulo de se\u00E7\u00E3o n\u00EDvel 2 (\u2248 H2 / ##). Ex: '1.1. Do objeto'
- Item_Nivel3: T\u00EDtulo de se\u00E7\u00E3o n\u00EDvel 3 (\u2248 H3 / ###). Ex: '1.1.1. Da compet\u00EAncia'
- Item_Nivel4: T\u00EDtulo de se\u00E7\u00E3o n\u00EDvel 4 (\u2248 H4 / ####). Ex: '1.1.1.1.'
- Item_Alinea_Letra: Al\u00EDnea com letra min\u00FAscula \u2014 autonumera a) b) c). N\u00C3O escrever a letra no texto, o SEI gera automaticamente.
- Item_Inciso_Romano: Inciso com numeral romano \u2014 autonumera I - II - III -. N\u00C3O escrever o numeral no texto, o SEI gera automaticamente. Recuo 120px.
- Item_Inciso_Romano_Recuo: Inciso romano com recuo menor (margem 6pt). Autonumera I - II - III -.
- Item_Inciso_Romano_Esquerda_Recuo_Justif: Inciso romano justificado com recuo \u00E0 esquerda. Autonumera I - II - III -.
- Tabela_Texto_Justificado: Texto justificado dentro de tabela (11pt)
- Tabela_Texto_Centralizado: Texto centralizado dentro de tabela (11pt). Tamb\u00E9m usado para legendas de tabela em tamanho normal.
- Tabela_Texto_Alinhado_Esquerda: Texto \u00E0 esquerda dentro de tabela (11pt)
- Tabela_Texto_Alinhado_Direita: Texto \u00E0 direita dentro de tabela (11pt, valores)
- Tabela_Texto_8: Texto pequeno em tabela (8pt, \u00E0 esquerda)
- Tabela_Texto_8_Centralizado: Texto pequeno centralizado em tabela (8pt)
- Tabela_Fonte_9_Centralizado: Texto menor (9pt) centralizado em tabela. Usado para legendas de tabela em fonte reduzida.
- Tabela_Justificado_Recuo_Primeira_Linha: Texto justificado com recuo em tabela (11pt)
- Texto_Mono_Espacado: Texto monoespa\u00E7ado (8pt, pr\u00E9-formatado, c\u00F3digo/dados)

Regras:
- Listas autonumeradas (Item_Alinea_Letra, Item_Inciso_Romano, Paragrafo_Numerado_*): N\u00C3O escreva a letra/n\u00FAmero, o SEI numera.
- Tabelas: <table border="1" style="border-collapse:collapse"><tr><td><p class="Tabela_Texto_Justificado">...</p></td></tr></table>
- Para citar outro documento do SEI como link: <span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei{ID}" style="text-indent:0;">{NUMERO}</a></span>, com ID (campo "id" de documentos_listar) e NUMERO (n\u00BA SEI).
- Nunca inclua assinatura, data por extenso de assinatura eletr\u00F4nica ou bras\u00E3o: o SEI gera.
- Dados pessoais mascarados ([PESSOA_1], [CPF_2]...) devem ser escritos exatamente assim: o sistema troca pelo valor real ao gravar.`,
  },
  lote: {
    descricao: "Como fazer opera\u00E7\u00F5es em muitos processos ou documentos (lote), inclusive a partir de planilha anexada.",
    texto: `# Opera\u00E7\u00F5es em lote

1. Descubra os alvos com leitura (processos_listar, documentos_listar, documento_ler) antes de escrever.
2. Use UMA chamada de escrita com a lista inteira (ex.: documento_alterar com 40 documentos), e n\u00E3o 40 chamadas.
3. Para v\u00E1rias escritas dependentes (criar documento e depois editar outro com o n\u00FAmero dele), use plano_propor com refer\u00EAncias: "$1.itens.0.numero" \u00E9 o valor; "Despacho {$1.itens.0.numero}" interpola.
4. Com planilha anexada (CSV), cada linha vira um item de documento_criar; confira as colunas com o usu\u00E1rio antes.
5. Depois de executar, relate quantos deram certo e liste os que falharam com o motivo.`,
  },
  prazos: {
    descricao: "Controle de prazos com marcadores e anota\u00E7\u00F5es.",
    texto: `# Prazos

- Prazo vai no TEXTO do marcador: "At\u00E9 DD/MM/AAAA - motivo". Use processo_marcador com o marcador que a unidade usa para prazos (ver sei_opcoes lista=marcadores).
- Para achar vencidos: processos_listar agrupar_por=marcador ou filtro pelo marcador, e compare as datas "At\u00E9 ..." com a data de hoje.
- Anota\u00E7\u00E3o (processo_anotacao) \u00E9 lembrete interno da unidade; andamento (processo_andamento) fica no hist\u00F3rico oficial para sempre.`,
  },
};
