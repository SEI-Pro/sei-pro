# Política de Privacidade — SEI Pro PRF

**Versão:** 2.1  
**Data de Vigência:** 22 de abril de 2026  
**Última Atualização:** 22 de abril de 2026

---

## 1. Objetivo

Esta política explica como a extensão **SEI Pro PRF** trata dados no navegador e em integrações opcionais.

A extensão é voltada ao uso no SEI e mantém a identidade visual da PRF apenas quando executada no ambiente da PRF.

---

## 2. O que a extensão trata

A extensão processa apenas dados necessários ao funcionamento das funcionalidades escolhidas pelo usuário, incluindo:

- configurações e preferências da extensão
- favoritos, filtros e caches locais
- dados de navegação dentro do SEI necessários para as funções da extensão
- conteúdo selecionado ou aberto no editor quando o usuário ativa recursos opcionais, como IA ou planilhas
- logs técnicos gerados pelo navegador e pela própria extensão para diagnóstico

---

## 3. Armazenamento local

As configurações e preferências ficam armazenadas no próprio navegador do usuário, por exemplo em `chrome.storage`, `localStorage` e estruturas temporárias de sessão.

Isso significa que:

- os dados ficam no dispositivo ou no perfil do navegador do usuário
- a extensão não cria, por padrão, um banco de dados próprio em servidor
- o usuário pode limpar esses dados removendo a extensão ou apagando os dados do navegador

---

## 4. Integrações opcionais

A extensão pode se integrar a serviços externos quando o usuário ou a instituição ativa uma funcionalidade específica.

Essas integrações incluem, por exemplo:

- serviços de IA, como OpenAI, Gemini ou Ollama
- Google Sheets / Google Apps Script, quando habilitados para funções específicas
- serviços de encurtamento de links, quando acionados manualmente

Quando uma integração externa é usada, apenas os dados necessários para aquela função são enviados. O conteúdo enviado passa a ser tratado também pelas políticas de privacidade do serviço de destino.

Perfis de provedores e chaves de API ficam somente em `chrome.storage.local`; as chaves não
são copiadas para o `localStorage` da página do SEI nem atravessam a ponte do editor. Para
montar o contexto, a extensão pode ler a minuta atual, metadados do processo, a árvore, o
histórico e corpos de documentos públicos, sempre dentro dos limites configurados.

Antes de enviar o corpo da minuta ou de um documento cujo acesso seja restrito, sigiloso ou
não verificável, a extensão identifica o documento e o provedor de destino e exige
confirmação. Endpoints locais ou institucionais marcados pelo usuário como confiáveis exigem
uma confirmação válida apenas durante a sessão da página. A autorização gera um registro
local com data, documento, nível de acesso, provedor e modelo; o conteúdo não é gravado no
histórico. Esse histórico é visível, exportável e apagável nas Configurações.

---

## 5. Reporte de bugs e sugestões

O mecanismo de reporte de bugs e sugestões é exibido e habilitado apenas no host `sei.prf.gov.br`.

Quando o envio é feito no ambiente da PRF, a extensão pode transmitir:

- a URL da página onde o problema ocorreu
- uma cópia dos logs e mensagens de console coletados pela extensão
- a descrição informada pelo usuário no formulário
- o tipo da ocorrência e o erro técnico associado, quando aplicável

O envio desse reporte é bloqueado fora do SEI da PRF.

---

## 6. Permissões do navegador

A extensão usa apenas permissões compatíveis com o funcionamento das suas funcionalidades:

- `storage` para salvar configurações e preferências
- permissões de host do SEI para atuar somente nas páginas compatíveis
- `notifications` para alertas opcionais

---

## 7. Segurança

A segurança dos dados depende também do ambiente do usuário:

- políticas de segurança do navegador
- proteção do perfil e do dispositivo
- restrições institucionais da rede e da estação de trabalho

A extensão não substitui controles institucionais de segurança da informação.

---

## 8. Código aberto

O projeto é publicado como código aberto, o que permite auditoria do comportamento da extensão e revisão do tratamento de dados descrito nesta política.

---

## 9. Contato

Para dúvidas sobre esta política ou sobre o comportamento da extensão, use o repositório público do fork ou o canal institucional definido para a distribuição.

---

## 10. Alterações

Esta política pode ser atualizada quando houver mudança relevante nas funcionalidades, nas integrações ou na forma de tratamento de dados.
