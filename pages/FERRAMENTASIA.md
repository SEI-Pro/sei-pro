# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## ![SEI Pro Ferramentas IA](../img/icon-ferramentasia.png) Ferramentas de Inteligência Artificial

As ferramentas de IA funcionam diretamente no editor de documentos, com respostas em
streaming e perfis BYOK (*bring your own key*). Cada usuário fornece sua própria chave de API.
A chave fica somente no armazenamento local do navegador e não é sincronizada.

### Provedores compatíveis

- OpenAI
- Anthropic (Claude)
- Google Gemini
- Moonshot (Kimi)
- Ollama local
- APIs compatíveis com OpenAI, como gateways institucionais, OpenRouter e LiteLLM

Cadastre os perfis em **Configurações > Provedores de IA**. Informe nome, provedor, URL base,
modelo e chave. Para Ollama ou um gateway institucional, marque o perfil como confiável
somente quando você conhecer e controlar o endpoint.

O Cursor não oferece uma API de chat compatível para este fluxo. Caso exista um endpoint
compatível fornecido pela sua organização ou por uma versão futura do serviço, configure-o
como **Compatível com OpenAI**, usando a URL base personalizada e o nome do modelo.

> **ATENÇÃO:** confirme qual serviço receberá o conteúdo antes de gerar um texto. Documentos
> restritos ou sigilosos exigem confirmação explícita e o resultado da IA deve sempre ser
> revisado antes da assinatura.

### Contexto, limites e auditoria

Em **Configurações > Provedores de IA**, também é possível definir o máximo de rodadas, o
limite total de documentos lidos, o orçamento aproximado de tokens, a palavra-chave inline
e uma instrução institucional adicional. O teto de documentos é único por geração: leituras
automáticas e chamadas de ferramenta compartilham o mesmo contador.

A IA pode listar e ler documentos, consultar dados e histórico do processo, ler a minuta
atual e pesquisar legislação. Todas as ferramentas são somente leitura. A extensão não
oferece à IA ações para criar, assinar, tramitar ou alterar processos.

Autorizações para conteúdo protegido ficam no **Histórico local de autorizações**, na mesma
página de configurações. O histórico não guarda o conteúdo enviado e pode ser baixado ou
limpo pelo usuário.

### Ferramentas do editor

- `Ctrl+K`: pesquisa todas as ações do editor, com categorias, favoritos e recentes.
- Checklist antes da assinatura: valida campos, tags, revisões, referências e citações.
- Trechos da unidade: salva textos reutilizáveis com placeholders como `{{processo}}`,
  `{{interessado}}`, `{{unidade}}` e `{{hoje}}`.
- Comparação: confronta a minuta com outro documento do processo.

> 
## Próximo item

> [PAGE](../pages/PAGE.md)
