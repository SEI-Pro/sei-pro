# Política de Privacidade — SEI Pro ![SEI Pro](/img/icon-32.png)

**Versão:** 2.0  
**Data de Vigência:** 14 de janeiro de 2026  
**Última Atualização:** 14 de janeiro de 2026

---

## 1. Introdução

Esta Política de Privacidade descreve, de forma clara e transparente, as práticas de tratamento de dados da extensão de navegador **SEI Pro**, em conformidade com a Lei nº 13.709, de 14 de agosto de 2018 — Lei Geral de Proteção de Dados Pessoais (LGPD) — e com as melhores práticas de segurança da informação.

O SEI Pro é uma extensão de navegador gratuita e de código aberto, licenciada sob AGPL-3.0, que adiciona funcionalidades avançadas ao Sistema Eletrônico de Informações (SEI), tanto na página inicial quanto na tela de processos e no editor de textos.

**Esta extensão foi desenvolvida com o princípio de "Privacy by Design" (Privacidade desde a Concepção), priorizando a proteção dos dados dos usuários desde sua arquitetura inicial.**

---

## 2. Declaração de Não Coleta de Dados

### 2.1. Compromisso Fundamental

**O SEI Pro NÃO coleta, NÃO transmite, NÃO armazena remotamente e NÃO processa nenhum dado pessoal ou informação dos usuários.**

Esta declaração é feita de forma inequívoca e abrange:

- **Dados de identificação pessoal:** nome, e-mail, CPF, endereço ou qualquer informação que identifique direta ou indiretamente uma pessoa natural
- **Dados técnicos de conexão:** endereço IP, geolocalização, identificadores de dispositivo
- **Dados de navegação:** histórico de navegação, URLs visitadas, padrões de uso
- **Dados do navegador:** tipo de navegador, sistema operacional, idioma, configurações
- **Dados de uso da extensão:** estatísticas, telemetria, logs de atividade
- **Conteúdo dos processos:** documentos, textos, informações contidas nos processos do SEI
- **Credenciais de acesso:** senhas, tokens, cookies de sessão do SEI

### 2.2. Ausência de Servidor de Coleta

O SEI Pro **não possui** infraestrutura de servidor para coleta de dados. Não há:

- Servidores de analytics ou telemetria
- Endpoints de API próprios para recebimento de dados
- Bancos de dados remotos vinculados à extensão
- Serviços de rastreamento ou perfilamento

### 2.3. Fundamentação Legal

Esta política atende aos princípios da LGPD estabelecidos no art. 6º da Lei nº 13.709/2018:

| Princípio | Aplicação no SEI Pro |
|-----------|---------------------|
| **Finalidade** | A extensão tem propósito único e específico: aprimorar a experiência de uso do SEI |
| **Adequação** | Não há coleta de dados, eliminando riscos de tratamento inadequado |
| **Necessidade** | A extensão opera com o mínimo absoluto: zero dados coletados |
| **Transparência** | Esta política explicita de forma clara e acessível todas as práticas |
| **Segurança** | Armazenamento exclusivamente local, sob controle do usuário |
| **Prevenção** | Arquitetura projetada para prevenir qualquer vazamento de dados |

---

## 3. Armazenamento Local de Dados

### 3.1. Funcionamento do Armazenamento

O SEI Pro armazena **exclusivamente no dispositivo do usuário** determinadas configurações e preferências necessárias para o funcionamento das funcionalidades da extensão.

Este armazenamento utiliza as seguintes tecnologias nativas do navegador:

- **Local Storage (Armazenamento Local):** para configurações e preferências do usuário
- **Chrome Storage API / Browser Storage API:** para sincronização opcional de configurações entre dispositivos do mesmo usuário (via conta do navegador)
- **IndexedDB:** para dados estruturados como histórico de processos visitados

### 3.2. Tipos de Dados Armazenados Localmente

| Tipo de Dado | Finalidade | Local |
|--------------|------------|-------|
| Configurações da extensão | Personalização das funcionalidades | Dispositivo do usuário |
| Preferências de interface | Tema, layout, modo noturno | Dispositivo do usuário |
| Lista de processos favoritos | Acesso rápido a processos frequentes | Dispositivo do usuário |
| Histórico de processos visitados | Navegação entre processos recentes | Dispositivo do usuário |
| Valores padrão de documentos | Agilizar criação de documentos | Dispositivo do usuário |
| Marcadores personalizados | Organização visual de processos | Dispositivo do usuário |

### 3.3. Controle do Usuário sobre os Dados Locais

O usuário tem **controle total** sobre os dados armazenados localmente:

- **Visualização:** todas as configurações são acessíveis pela interface da extensão
- **Modificação:** o usuário pode alterar qualquer configuração a qualquer momento
- **Exclusão:** o usuário pode limpar todos os dados através das configurações do navegador ou desinstalando a extensão
- **Portabilidade:** os dados sincronizados via Chrome Sync são portáveis entre dispositivos do usuário

### 3.4. Segurança do Armazenamento Local

**Importante:** Os dados armazenados localmente utilizam as APIs padrão do navegador e **não são criptografados pela extensão**. A segurança desses dados depende:

- Das configurações de segurança do navegador
- Das políticas de acesso ao dispositivo
- Da proteção do perfil do usuário no navegador

Para ambientes com requisitos elevados de segurança, recomenda-se:

- Utilizar dispositivos gerenciados institucionalmente
- Aplicar políticas de criptografia de disco
- Configurar bloqueio automático de sessão
- Restringir acesso físico aos dispositivos

---

## 4. Integrações com Serviços Externos (Opcional)

### 4.1. Natureza das Integrações

O SEI Pro oferece **funcionalidades opcionais** que, quando habilitadas pelo usuário, podem se comunicar com serviços externos de terceiros. Estas integrações:

- São **desativadas por padrão**
- Requerem **ação deliberada do usuário** para ativação
- Exigem **configuração explícita** (como inserção de chaves de API)
- Podem ser **desativadas a qualquer momento**

### 4.2. Integrações Disponíveis

#### 4.2.1. Google Sheets / Google Docs

- **Funcionalidade:** Inserção de conteúdo de planilhas ou documentos no editor do SEI
- **Dados transmitidos:** Apenas os necessários para acessar o documento especificado
- **Política de privacidade aplicável:** [Política de Privacidade do Google](https://policies.google.com/privacy)
- **Controle:** Usuário configura e autoriza manualmente cada acesso

#### 4.2.2. TinyURL

- **Funcionalidade:** Geração de links encurtados para documentos
- **Dados transmitidos:** URL do documento a ser encurtado
- **Política de privacidade aplicável:** [Política de Privacidade do TinyURL](https://tinyurl.com/privacy-policy)
- **Controle:** Funcionalidade acionada manualmente pelo usuário

#### 4.2.3. Ferramentas de Inteligência Artificial (ChatGPT/OpenAI)

- **Funcionalidade:** Assistência na elaboração de textos no editor do SEI
- **Dados transmitidos:** Apenas o conteúdo selecionado pelo usuário para processamento
- **Requisitos:** Necessita de chave de API própria do usuário
- **Política de privacidade aplicável:** [Política de Privacidade da OpenAI](https://openai.com/policies/privacy-policy)
- **Controle:** Usuário decide o que enviar e quando enviar

### 4.3. Responsabilidade e Alertas

**⚠️ ATENÇÃO:** Ao utilizar integrações com serviços externos:

1. **O usuário é responsável** por avaliar se o uso é compatível com as políticas de segurança de sua organização
2. **Dados enviados a serviços externos** estão sujeitos às políticas de privacidade desses serviços
3. **Informações sigilosas ou dados pessoais** não devem ser enviados a serviços externos sem autorização institucional
4. **Recomenda-se** que organizações públicas avaliem a conformidade com suas políticas internas antes de habilitar estas funcionalidades

### 4.4. Configuração Institucional

Administradores de TI podem, através de políticas de grupo ou configurações gerenciadas:

- Desativar funcionalidades de integração externa
- Restringir quais integrações estão disponíveis
- Definir configurações padrão para toda a organização

---

## 5. Permissões do Navegador

### 5.1. Permissões Solicitadas

O SEI Pro solicita permissões ao navegador para operar. Estas permissões são necessárias exclusivamente para o funcionamento das funcionalidades da extensão:

| Permissão | Justificativa | Uso |
|-----------|---------------|-----|
| `activeTab` | Acesso à aba ativa | Interagir com a interface do SEI |
| `storage` | Armazenamento local | Salvar configurações e preferências |
| `clipboardWrite` | Escrita na área de transferência | Copiar informações de processos |
| Host permissions (URLs do SEI) | Acesso a páginas específicas | Funcionar apenas em instalações do SEI |

### 5.2. Princípio do Menor Privilégio

A extensão opera sob o princípio do menor privilégio:

- Solicita apenas as permissões estritamente necessárias
- Opera apenas em domínios de instalações do SEI
- Não solicita permissões amplas como `<all_urls>`
- Não acessa outros sites ou serviços sem ação do usuário

---

## 6. Código Aberto e Auditabilidade

### 6.1. Transparência do Código-Fonte

O SEI Pro é um projeto de **código aberto**, permitindo total transparência:

- **Repositório:** [https://github.com/sei-pro/sei-pro](https://github.com/sei-pro/sei-pro)
- **Licença:** AGPL-3.0 (GNU Affero General Public License v3.0)
- **Commits:** Histórico completo de alterações disponível publicamente
- **Issues:** Canal aberto para reporte de problemas e sugestões

### 6.2. Auditoria Comunitária

A natureza open source permite:

- Verificação independente das práticas de privacidade
- Auditoria do código por especialistas em segurança
- Identificação e correção colaborativa de vulnerabilidades
- Transparência total sobre o funcionamento da extensão

### 6.3. Distribuição Oficial

A extensão é distribuída exclusivamente através de canais oficiais:

- **Chrome Web Store:** [Link da Chrome Web Store]
- **Microsoft Edge Add-ons:** [Link da Microsoft Edge Add-ons]

---

## 7. Direitos do Titular (LGPD)

Embora o SEI Pro não colete dados pessoais, em respeito à LGPD e à transparência, informamos sobre os direitos dos titulares previstos no art. 18 da Lei nº 13.709/2018:

### 7.1. Direitos Assegurados

- **Confirmação e acesso:** Não há dados pessoais coletados pela extensão
- **Correção:** Não aplicável — não há dados armazenados remotamente
- **Eliminação:** Dados locais podem ser eliminados pelo próprio usuário através das configurações do navegador
- **Portabilidade:** Não aplicável — não há dados em posse do desenvolvedor
- **Informação sobre compartilhamento:** Não há compartilhamento de dados com terceiros pela extensão
- **Revogação de consentimento:** O usuário pode desinstalar a extensão a qualquer momento

### 7.2. Exercício dos Direitos

Para esclarecimentos sobre esta Política de Privacidade ou sobre práticas de tratamento de dados, o titular pode entrar em contato através dos canais indicados na Seção 10.

---

## 8. Proteção de Crianças e Adolescentes

O SEI Pro é uma ferramenta de produtividade destinada ao uso profissional no âmbito da Administração Pública. A extensão:

- Não é direcionada a menores de 18 anos
- Não coleta dados de nenhum usuário, incluindo menores
- Está em conformidade com as disposições da LGPD sobre tratamento de dados de crianças e adolescentes (art. 14)

---

## 9. Segurança da Informação

### 9.1. Medidas Técnicas

O SEI Pro adota as seguintes medidas de segurança:

- **Ausência de transmissão de dados:** não há dados a serem interceptados
- **Código aberto:** permite auditoria e identificação de vulnerabilidades
- **Atualizações regulares:** correções de segurança são publicadas no repositório
- **Revisão de código:** alterações passam por revisão antes da publicação

### 9.2. Limitações

A segurança da extensão depende também de fatores externos:

- Segurança do dispositivo do usuário
- Configurações do navegador
- Políticas de segurança da organização
- Atualizações do sistema operacional e navegador

### 9.3. Incidentes de Segurança

Em caso de identificação de vulnerabilidade ou incidente de segurança:

1. O desenvolvedor será notificado através do repositório GitHub (Issues ou Security Advisories)
2. A vulnerabilidade será analisada e corrigida com prioridade
3. Uma nova versão será publicada nas lojas de extensões
4. Usuários serão notificados conforme a severidade do incidente

---

## 10. Identificação do Desenvolvedor

### 10.1. Desenvolvedor

**Nome:** Pedro Henrique Soares  
**Vínculo:** Servidor Público Federal — Agência Nacional de Transportes Aquaviários (ANTAQ)  
**Função:** Desenvolvimento voluntário, sem fins lucrativos

### 10.2. Canais de Contato

- **Repositório GitHub:** [https://github.com/sei-pro/sei-pro](https://github.com/sei-pro/sei-pro)
- **Issues:** [https://github.com/sei-pro/sei-pro/issues](https://github.com/sei-pro/sei-pro/issues)
- **Comunidade:** [Fórum ParticiPEN](https://www.gov.br/participamaisbrasil/sei-pro)

### 10.3. Suporte Institucional

Questões relacionadas a compatibilidade ou uso institucional podem ser direcionadas aos canais de suporte do projeto ou discutidas no fórum da comunidade ParticiPEN.

---

## 11. Alterações nesta Política

### 11.1. Processo de Atualização

Esta Política de Privacidade pode ser atualizada periodicamente para:

- Refletir alterações nas funcionalidades da extensão
- Adequar-se a novas exigências legais ou regulatórias
- Melhorar a clareza e transparência das informações

### 11.2. Notificação de Alterações

Alterações substanciais serão comunicadas através de:

- Atualização da data de vigência no início deste documento
- Publicação no repositório GitHub
- Notas de versão (changelog) nas lojas de extensões

### 11.3. Histórico de Versões

| Versão | Data | Principais Alterações |
|--------|------|----------------------|
| 2.0 | 14/01/2026 | Reformulação completa para adequação à LGPD; declaração explícita de não coleta de dados; detalhamento de integrações externas |
| 1.0 | 02/08/2020 | Versão inicial (modelo genérico) |

---

## 12. Disposições Finais

### 12.1. Legislação Aplicável

Esta Política de Privacidade é regida pela legislação brasileira, em especial:

- Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD)
- Lei nº 12.965/2014 — Marco Civil da Internet
- Decreto nº 8.771/2016 — Regulamentação do Marco Civil

### 12.2. Foro Competente

Fica eleito o foro da comarca de Brasília/DF para dirimir eventuais questões oriundas desta Política de Privacidade.

### 12.3. Aceitação

A instalação e uso da extensão SEI Pro implica na aceitação integral desta Política de Privacidade. Caso não concorde com os termos aqui estabelecidos, recomenda-se não instalar ou desinstalar a extensão.

---

## 13. Glossário

| Termo | Definição |
|-------|-----------|
| **Dado Pessoal** | Informação relacionada a pessoa natural identificada ou identificável (art. 5º, I, LGPD) |
| **Tratamento** | Toda operação realizada com dados pessoais (coleta, armazenamento, uso, etc.) (art. 5º, X, LGPD) |
| **Titular** | Pessoa natural a quem se referem os dados pessoais (art. 5º, V, LGPD) |
| **Controlador** | Pessoa a quem competem as decisões sobre o tratamento de dados pessoais (art. 5º, VI, LGPD) |
| **LGPD** | Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018 |
| **SEI** | Sistema Eletrônico de Informações |
| **API** | Application Programming Interface — Interface de Programação de Aplicações |
| **Local Storage** | Mecanismo de armazenamento de dados no navegador do usuário |

---

**SEI Pro** — Extensão de código aberto para o Sistema Eletrônico de Informações  
Desenvolvido pela comunidade, para a comunidade.

*Este documento foi elaborado em conformidade com a Lei nº 13.709/2018 (LGPD) e com as melhores práticas de segurança da informação.*
