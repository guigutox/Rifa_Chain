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
    "rifaId": "endereço da rifa que foi instanciada na rota criar rifa",
    "amount": "quantidade que permitira gastar"
}
```

Exemplo:

```
{
  "rifaId: "ID DA RIFA",
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
  "rifaId": "ID DA RIFA",
  "quantidadeRifas": Quantidade de rifas a serem compradas
}
```

Exemplo:

```
{
  "rifaId": "ID DA RIFA",
  "quantidadeRifas": 2
}
```


---

GET http://localhost:3000/rifa/entradas

Descrição: Rota para verificar a quantidade de entradas que já foram realizadas na rifa, passando o endereço da rifa na URL

O request deve conter os seguintes campos:

```
{
    "rifaId": "Id da rifa gerado pelo mongo DB"
}
```

Exemplo:

```
  {
    "rifaId": "66d8a505afa36cc7a69dd0b4"
  }

```

Response:

```
{
    "entradas": 2
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

---

POST http://localhost:3000/sorteio

Descrição: Rota para escolher um vencedor de uma rifa

Exemplo:

```
{
  "rifaId": "ID DA RIFA",
}
```

---

GET  http://localhost:3000/balance/ENDERECO-DA-CARTEIRA

Descrição: Rota para saber quantos tokens uma wallet possui

Exemplo:

```
http://localhost:3000/balance/0x70997970C51812dc3A010C7d01b50e0d17dc79C8

```

Response:

```
{
    "balance": "100.0"
}
```
---

POST  http://localhost:3000/mint

Descrição: Minta tokens para um determinado endereço

Exemplo:

```
{
  "to": "endereco",
  "amount": "quantidade"
}

```



