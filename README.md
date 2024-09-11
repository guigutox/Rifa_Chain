# 🎉 Rifa Chain

A **Rifa Chain** foi criada como projeto final da trilha de aprendizado da *Compass.UOL*. Conseguimos colocar em prática os conhecimentos adquiridos! Nesta etapa, fizemos um trabalho em grupo para desenvolver uma solução utilizando tecnologia **Blockchain**.

Propomos a solução de criar um sistema de rifa utilizando blockchain, onde o cliente utiliza sua conta do **MetaMask** para gastar tokens do **Real Digital** (Utilizando ERC20) e paga sua entrada na rifa, que tem uma quantidade máxima de entradas e é sorteada automaticamente quando atinge o limite máximo. Além disso, o organizador da rifa pode sortear manualmente por meio de um botão e encerrar a rifa. O prêmio é entregue automaticamente ao vencedor através das lógicas do contrato inteligente.


## 💻 Como Utilizar o Projeto (Localmente)

### 🛠️ Pré-requisitos - Back-end

- Node.js instalado na sua máquina.
- NPM (Node Package Manager) instalado.


### 🖥️ Pré-requisitos - Front-end

- Node.js instalado na sua máquina.
- NPM (Node Package Manager) instalado.

## 📥 Instalação

Clone o repositório:

```bash
git clone https://github.com/guigutox/Rifa_Chain.git
```

Navegue até o diretório  Project e Client:

```bash
cd project
cd Client
```

Instale as dependências tanto no frontend quando no backend:

```bash
npm install
```

Configure suas variáveis de ambiente:

```bash
cp .env.example .env
```

## 🏃 Executando o Projeto
Baixe o mongo
https://www.mongodb.com/try/download/community

Baixe a GUI do mongo
https://www.mongodb.com/try/download/compass

Abra o mongo e crie uma nova conexão, sendo ela a conexão localhost na porta 27017



### Blockchain:

Para subir uma rede blockchain usando o hardhat:

```bash
npx hardhat node
```

Em outro terminal, faça deploy no contrato de tokens:

```bash
npx hardhat run --network localhost ignition/modules/deployERC20.js
```

### API:

Em outro terminal || no mesmo que voce deu deploy no contrato (sem fechar os anteriores):

```bash
node api/server.js
```

### Front-end:

Em outro terminal:

```bash
cd ..
cd Client
npm start
```

Ao usar o npm start, o navegador ira abrir automaticamente.

Considerando que voce tenha o metamask instalado, voce ainda precisará fazer o seguinte:
```
Importe a seguinte conta para seu metamask utilizando a private key: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'.
Essa conta é sempre a responsável por dar deploy no contrato de tokens, ou seja, somente ela é capaz de mintar tokens para outras contas.
Se voce preferir, pode importar outras contas que aparecem no console do 'npx hardhat node'. Voce precisa usar uma dessas contas, pois precisará de ETH para pagar pelo gás das transações.

```
Por fim, no seu metamask, adicione uma network manualmente:

```
Nome da rede: O que voce preferir
Novo URL da RPC: http://localhost:8545 // a nao ser que voce tenha colocado um RPC diferente no seu dotenv
ID da cadeia: 31337
Simbolo da moeda: ETH // DREX sao os tokens, nao a moeda da rede.
```


> 💡 **Dica:** Apesar de ser possivel interagir com as rotas via postman, isso não é recomendado, pois, ao faze-lo, haverá dessincronização entre a blockchain e o banco de dados




