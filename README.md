# 🎉 Rifa Chain

A **Rifa Chain** foi criada como projeto final da trilha de aprendizado da *Compass.UOL*. Conseguimos colocar em prática os conhecimentos adquiridos! Nesta etapa, fizemos um trabalho em grupo para desenvolver uma solução utilizando tecnologia **Blockchain**.

Propomos a solução de criar um sistema de rifa utilizando blockchain, onde o cliente utiliza sua conta do **MetaMask** para gastar tokens do **Real Digital** (Utilizando ERC20) e paga sua entrada na rifa, que tem uma quantidade máxima de entradas e é sorteada automaticamente quando atinge o limite máximo. Além disso, o organizador da rifa pode sortear manualmente por meio de um botão e encerrar a rifa. O prêmio é entregue automaticamente ao vencedor através das lógicas do contrato inteligente.

## 🚀 Funcionalidades da API

Aqui estão os principais endpoints da nossa API:

### 🔒 Autenticação

- **Login**
  - Método: `POST`
  - Endpoint: `/api/auth/login`
  - Descrição: Realiza o login do usuário.
  
- **Cadastro**
  - Método: `POST`
  - Endpoint: `/api/auth/register`
  - Descrição: Realiza o cadastro de um novo usuário.

### 🎟️ Rifas

- **Criar uma rifa**
  - Método: `POST`
  - Endpoint: `/api/rifas`
  - Descrição: Cria uma nova rifa.

- **Listar rifas**
  - Método: `GET`
  - Endpoint: `/api/rifas`
  - Descrição: Retorna uma lista de todas as rifas disponíveis.

- **Detalhes de uma rifa**
  - Método: `GET`
  - Endpoint: `/api/rifas/:id`
  - Descrição: Retorna os detalhes de uma rifa específica.

- **Participar da rifa**
  - Método: `POST`
  - Endpoint: `/api/rifas/:id/participar`
  - Descrição: Permite que um usuário participe de uma rifa com seus tokens ERC20.

- **Sortear rifa**
  - Método: `POST`
  - Endpoint: `/api/rifas/:id/sortear`
  - Descrição: Organizador sorteia o vencedor da rifa.

### 📜 Contratos

- **Ver detalhes do contrato**
  - Método: `GET`
  - Endpoint: `/api/contratos/:id`
  - Descrição: Retorna as informações do contrato inteligente de uma rifa.

## 💻 Como Utilizar o Projeto (Localmente)

### 🛠️ Pré-requisitos - Back-end

- Node.js instalado na sua máquina.
- NPM (Node Package Manager) instalado.
- MongoDB configurado e em execução.

Instalar as seguintes bibliotecas:

```bash
npm install express
npm install axios
npm install @nomicfoundation/hardhat-ignition@0.15.5
npm install @nomicfoundation/hardhat-toolbox@5.0.0
npm install @nomicfoundation/ignition-core@0.15.5
npm install openzeppelin/contracts@5.0.2
npm install cors@2.8.5
npm install dotenv@16.4.5
npm install ethers@6.13.2
npm install express@4.19.2
npm install hardhat@2.22.9
npm install mongoose@8.6.1
```

### 🖥️ Pré-requisitos - Front-end

- Node.js instalado na sua máquina.
- NPM (Node Package Manager) instalado.

## 📥 Instalação

Clone o repositório:

```bash
git clone https://github.com/guigutox/Rifa_Chain.git
```

Navegue até o diretório do projeto:

```bash
cd project
```

Instale as dependências do projeto:

```bash
npm install
```

## 🏃 Executando o Projeto

Certifique-se de que o MongoDB está em execução.

### Blockchain:

```bash
npx hardhat node
```

Em outro terminal:

```bash
npx hardhat run --network localhost ignition/modules/deployERC20.js
```

### API:

Em outro terminal || no mesmo que voce deu deply no contrato (sem fechar os anteriores):

```bash
node api/server.js
```

### Front-end:

Em outro terminal:

```bash
cd Client
npx react-scripts start
```

Acesse a API no navegador via URL:

> 💡 **Dica:** Pelo navegador, há uma interface que permite interagir com a API.

## 🛠️ Acesse a API via Postman

Para utilizar as rotas, siga os endpoints mencionados acima.

#### Endpoints - Rifa

---

### `POST /criar-rifa`
Esse endpoint é responsável por criar uma nova rifa no sistema.

**Parâmetros do corpo da requisição:**
```json
{
  "maxEntradas": 100,
  "valorEntrada": "10.0"
}
```

**Respostas:**
- **201 Created**
    ```json
    {
      "message": "Rifa criada com sucesso!",
      "rifaAddress": "0x123..."
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao criar a rifa"
    }
    ```

---

### `POST /entrar`
Esse endpoint é responsável por permitir que um usuário entre em uma rifa.

**Parâmetros do corpo da requisição:**
```json
{
  "rifaId": "123456",
  "quantidadeRifas": 5
}
```

**Respostas:**
- **200 OK**
    ```json
    {
      "message": "Rifa atualizada com sucesso"
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Rifa não encontrada"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao entrar na rifa"
    }
    ```

---

### `GET /rifa/entradas`
Esse endpoint é responsável por listar a quantidade de entradas feitas em uma rifa.

**Parâmetros do corpo da requisição:**
```json
{
  "rifaId": "123456"
}
```

**Respostas:**
- **200 OK**
    ```json
    {
      "entradas": 50
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Rifa não encontrada"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao obter as entradas da rifa"
    }
    ```

---

### `GET /rifa/:address/vagas-restantes`
Esse endpoint é responsável por listar o número de vagas restantes em uma rifa.

**Parâmetros:**
- `address`: Endereço do contrato da rifa

**Respostas:**
- **200 OK**
    ```json
    {
      "vagasRestantes": "45"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao obter as vagas restantes da rifa"
    }
    ```

---

### `POST /sorteio`
Esse endpoint é responsável por realizar o sorteio de uma rifa.

**Parâmetros do corpo da requisição:**
```json
{
  "rifaId": "123456"
}
```

**Respostas:**
- **200 OK**
    ```json
    {
      "message": "Sorteio realizado com sucesso",
      "tx": { /* dados da transação */ }
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Rifa não encontrada"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao realizar o sorteio"
    }
    ```

---

### `GET /balance/:address`
Esse endpoint é responsável por obter o saldo de tokens de um endereço.

**Parâmetros:**
- `address`: Endereço da carteira do usuário

**Respostas:**
- **200 OK**
    ```json
    {
      "balance": "100.0"
    }
    ```
- **400 Bad Request**
    ```json
    {
      "error": "Endereço inválido"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao obter o saldo de tokens"
    }
    ```

---

### `GET /rifa/:rifaId`
Esse endpoint é responsável por buscar as informações de uma rifa, incluindo o endereço do contrato e a ABI.

**Parâmetros:**
- `rifaId`: ID da rifa

**Respostas:**
- **200 OK**
    ```json
    {
      "address": "0x123...",
      "abi": [/* ABI do contrato */]
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Rifa não encontrada"
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao obter informações da rifa"
    }
    ```

---

### `GET /real-digital-info`
Esse endpoint é responsável por retornar o endereço e a ABI do contrato RealDigital.

**Respostas:**
- **200 OK**
    ```json
    {
      "address": "0x456...",
      "abi": [/* ABI do contrato RealDigital */]
    }
    ```
- **500 Internal Server Error**
    ```json
    {
      "error": "Erro ao obter informações do contrato RealDigital"
    }
    ```

---

### `GET /rifas`
Esse endpoint é responsável por listar todas as rifas cadastradas.

**Respostas:**
- **200 OK**
    ```json
    [
      { /* dados da rifa 1 */ },
      { /* dados da rifa 2 */ }
    ]
    ```
- **500 Internal Server Error**
    ```json
    {
      "message": "Erro ao buscar rifas"
    }
    ```