# RiFACHAIN

## Configuração do Projeto

Primeiro, instale as dependências necessárias:

`npm install`

Em seguida, configure suas variáveis de ambiente:

`cp .env.example .env`

Baixe o mongo
https://www.mongodb.com/try/download/community

Baixe a GUI do mongo
https://www.mongodb.com/try/download/compass

Abra o mongo e crie uma nova conexão, sendo ela a conexão localhost na porta 27017

---

## Configurar Ambiente de Desenvolvimento

Utilize no terminal:

`npx hardhat node`

Em outro terminal utilize:

`npx hardhat run --network localhost ignition/modules/deployERC20.js`

---

## Iniciar Aplicação

### API:

Para executar a API, use o seguinte comando:
`nodemon api/server.js`

---

## ROTAS

### Criar uma rifa

POST http://localhost:3000/criar-rifa

Descrição:
Utilizada para realizar a criação de uma rifa.

O request deve conter os seguintes campos:

```
{
  "maxEntradas": quantidade maxima de entradas,
  "valorEntrada": "valor de cada entrada"
}

```

Exemplo:

```
{
  "maxEntradas": 100,
  "valorEntrada": "10"
}
```

---

POST http://localhost:3000/approve

Descrição:
Rota utilizada para autorizar a rifa a gastar seus ativos.

O request deve conter os seguintes campos:

```
{
    "rifaAddress": "endereço da rifa que foi instanciada na rota criar rifa",
    "amount": "quantidade que permitira gastar"
}
```

Exemplo:

```
{
  "rifaAddress": "ENDERECO DA RIFA",
  "amount": "20"
}

```

---

POST http://localhost:3000/entrar

Descrição:
Rota utilizada para entrar na rifa.

O request deve conter os seguintes campos:

```
{
  "rifaAddress": "ENDERECO DA RIFA",
  "quantidadeRifas": Quantidade de rifas a serem compradas
}
```

Exemplo:

```
{
  "rifaAddress": "ENDERECO DA RIFA",
  "quantidadeRifas": 2
}
```

---

GET http://localhost:3000/rifa/ENDERECO DA RIFA/tokens-acumulados

Descrição: Rota para verificar a quantidade de tokens acumulados na rifa, passando o endereço da rifa na URL.

Exemplo:

```
GET http://localhost:3000/rifa/0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6/tokens-acumulados

```

Response:

```
{
    "tokensAcumulados": "20.0"
}
```

---

GET http://localhost:3000/rifa/ENDERECO DA RIFA/entradas

Descrição: Rota para verificar a quantidade de entradas que já foram realizadas na rifa, passando o endereço da rifa na URL

Exemplo:

```
http://localhost:3000/rifa/0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9/entradas
```

Response:

```
{
    "entradas": [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    ]
}
```

---

GET http://localhost:3000/rifa/ENDERECO DA RIFA/vagas-restantes

Descriação: Rota para verificar quantas entradas restantes há na rifa, passando endereço da rifa pela URL

Exemplo:

```
http://localhost:3000/rifa/0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9/vagas-restantes
```

Response:

```
{
    "vagasRestantes": "98"
}
```
