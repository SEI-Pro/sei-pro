# [![Home](../img/home.png)](../) |  SEI Pro ![Icone](../img/icon-32.png)

## Configurando o Google Spreadsheets como uma base de dados

Para que você possa compartilhar seus projetos com sua equipe, utilizando uma planilha online no Google Spreadsheets como base de dados.

Dessa forma seus dados estarão protegidos pela camada de segurança do Google e sempre ao seu alcance.

Por isso, antes de iniciar a criação do banco de dados recomendamos criar uma conta Google utilizando seu email institucional. 

Dessa forma seu banco de dados ficará separada de sua conta pessoal do Gmail.

## Criando uma conta Google

> [Criar sua Conta do Google agora](https://accounts.google.com/SignUp)
>
> [Suporte Google: Como criar uma Conta do Google usando um endereço de e-mail existente](https://support.google.com/accounts/answer/27441)

> ![Tela 1](../img/tela-basedados1.png) 

## Criando o banco de dados
Depois de logado em sua nova conta Google, crie uma cópia do nosso banco de dados clicando no modelo de planilha abaixo:

> [https://docs.google.com/spreadsheets/d/1N3SFN80rc0Lgwvg8iKoH6KLk3VdMADUSaFsAkIeoRIo/copy](https://docs.google.com/spreadsheets/d/1N3SFN80rc0Lgwvg8iKoH6KLk3VdMADUSaFsAkIeoRIo/copy)

Clique em **"Fazer uma cópia"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados2.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados2.png" width="450"/>

### ID da planilha

Anote o ID da sua planilha, você precisará dele para [Conectar o SEI Pro ao Google Spreadsheets](../pages/SEISHEETS.md)

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados3.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados3.png" width="927"/>

### Configurando o Google Sheets API

Utilizamos a API do Google Sheets para acessar sua planilha de dados e gravar as informações necessárias da ferramenta. 

Para iniciar a configuração dessa API, acesse o **"Google Cloud Plataform"** e crie um novo projeto:

> [https://console.cloud.google.com/home/dashboard](https://console.cloud.google.com/home/dashboard)

## Criando um projeto

Clique no botão **Criar projeto**

No campo **"Nome do Projeto"** insira **"SEI Pro"**. Por fim, clique em **Criar**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados5.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados5.png" width="666"/>

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados6.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados6.png" width="535"/>

## Ativando o Google Sheets API

Na barra lateral, acesse o menu **"API e Serviços"** > **"Biblioteca"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados7.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados7.png" width="554"/>

Procure pelo termo **"Google Sheets API"**, ative a API

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados8.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados8.png" width="693"/>

## Criando tela de consentimento

Para que a aplicação possa manipular sua planilha de dados, o Google precisará exibir uma tela de consentimento para o usuário, perguntando se ele autoriza que o aplicativo acesse a planilha compartilhada.

Para criá-la, acesse na barra lateral o menu **"API e Serviços"** > **"Tela de consentimento OAuth"** ou utilize o link abaixo:

> [https://console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent)

Selecione a modalidade **Externo**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados10.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados10.png" width="536"/>

No campo **"Nome do Aplicativo"** insira **"SEI Pro"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados11.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados11.png" width="477"/>

No campo **"Domínios autorizados"** insira o domínio onde está hospedado o **SEI!** do seu órgão ou entidade. Não utilize **www**, **https** ou **/**

Isso irá garantir que sua planilha só poderá ser acessada por scripts gerados dentro do domínio do seu órgão ou entidade.

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados12.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados12.png" width="467"/>

Clique em **Criar**

## Criando credenciais de acesso

Após ativar a API, criar a tela de consentimentos, agora será preciso gerar credenciais de acesso para usar a API
Essas credenciais permitiram que os usuários que a possuirem possa alterar a planilha remotamente.

Para isso precisaremos de um ID de Cliente e uma Chave de API

### Criando ID de Cliente

Clique no botão **"Criar credenciais"** > **"ID do cliente do OAuth"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados13.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados13.png" width="672"/>

No campo **"Tipo de aplicativo"**, selecione **"Aplicativo da Web"**

No campo **"Nome"**, insira **"SEI Pro"**

No campo **"Origens JavaScript autorizadas"**, insira o URL do **SEI!** do seu órgão ou entidade.

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados14.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados14.png" width="500"/>

Anote **"Seu ID de Cliente"**, você precisará dela no passo a passo [Conectar o SEI Pro ao Google Spreadsheets](../pages/SEISHEETS.md)

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados15.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados15.png" width="494"/>

### Criando Chave de API

Clique no botão **"Criar credenciais"** > **"Chave de API"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados16.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados16.png" width="628"/>

Anote **"Sua Chave de API"**, você precisará dela no passo a passo [Conectar o SEI Pro ao Google Spreadsheets](../pages/SEISHEETS.md)

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados17.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados17.png" width="515"/>

Clique em **"Rentringir Chave"** para limitar o acesso das credenciais ao estritamente necessário para a aplicação

Nas **"Restrições do aplicativo"**, selecione **"Referenciadores de HTTP (sites da Web)"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados18.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados18.png" width="520"/>

Em **"Restrições de sites"**, clique em **"Adicionar um item"** e insira o URL do **SEI!** do seu órgão ou entidade.

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados19.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados19.png" width="520"/>
  
### Publicando o aplicativo

Antes de utilizar a API do Google, é necessário publicar a **Tela de consentimento OAuth**.

No menu lateral, acesse **"Tela de consentimento OAuth"** > **"Status da publicação"** e clique em **"Publicar Aplicativo"**

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados20.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados20.png" width="600"/>
  
**ATENÇÃO!** Caso o acesso ao SEI do seu órgão não utilize o protocolo seguro HTTPS, API do Google não funcionará em ambiente de produção. Nesse caso, ignore o passo anterior e utilize o aplicativo em ambiente de teste. 

Para verificar qual protocolo utilizado pelo SEI do seu órgão, clique sobre o cadeado na barra de endereços do navegador.

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados21.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados21.png" width="400"/>
  
Em ambiente de testes todos os utilizadores da base de dados precisam ser cadastrados no console de API do Google. Para isso, ainda na tela de **"Tela de consentimento OAuth"** vá para a seção **"Usuários de teste"** e adicione os emails dos usuários que utilização o Gestor de Projetos.

>  <img src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados22.png" data-canonical-src="https://github.com/pedrohsoaresadv/sei-pro/raw/master/img/tela-basedados22.png" width="814"/>

## Próximo item

[Conectar o SEI Pro ao Google Spreadsheets](../pages/SEISHEETS.md)
