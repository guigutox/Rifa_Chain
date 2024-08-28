// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RealDigital.sol";  // Importa o contrato MyToken específico

contract Rifa {
    address public manager;
    address[] public entradas;
    bool public sorteado;
    address public vencedor;
    uint256 public len;

    uint256 public maxEntradas;  // quantidade maxima de entradas
    uint256 public restEntradas; // Entradas restantes
    uint256 public valorEntrada; // Preço de cada entrada
    uint256 public numEntradas;  // quantidade atual de entradas

    RealDigital public token; // dizendo qual token erc20 vamos usar

    constructor(RealDigital _token, uint256 _maxEntradas, uint256 _valorEntrada) {
        manager = msg.sender;
        token = _token;
        sorteado = false;
        maxEntradas = _maxEntradas;
        restEntradas = maxEntradas;
        valorEntrada = _valorEntrada;
    }

     // Modificador para permitir apenas o gerente executar certas funções
    modifier onlyManager() {
        require(msg.sender == manager, "Apenas o gerente pode chamar esta funcao");
        _;
    }

    // Permite que usuários entrem na rifa com uma ou mais entradas
    function entrar(uint256 quantidadeTokens) public {
        require(!sorteado, "O sorteio ja foi realizado");
        require(quantidadeTokens >= valorEntrada, "Quantidade minima de tokens nao atingida");

        numEntradas = quantidadeTokens / valorEntrada;

        // verifica se o sender nao tentou entrar com mais vagas do que existem
        if (numEntradas > restEntradas) {
            numEntradas = restEntradas;  // ajusta a quantidade de entradas que ele vai usar, tirando a necessidade de troco
        }
        // transfere a quantidade de tokens ja ajustada para o contrato
        uint256 totalTransferencia = numEntradas * valorEntrada;
        require(token.transferFrom(msg.sender, address(this), totalTransferencia), "Transferencia de tokens falhou");

        for (uint256 i = 0; i < numEntradas; i++) {
            entradas.push(msg.sender);
        }

        // utilizar mapping ao inves de length
        // Fazer a funcao gerar vencedor pelo dono da rifa
        // Multiplo do valor do contrato. Ex se a rifa o cara so pode comprar 7, 14, 21 ...
        // Passa a quantidade de fichas que voce quer comprar e o contrato verifica se voce tem a quantidade de tokens para comprar 
        // Duas funcoes, para verificar se o sortei ja foi sorteado ou nao, logo apos a linha 31. Modifier. Pro cara nao ficar spamando o request
        // Usar o balnceOF do proprio contrato ao inves da varial premio para saber quem foi o ganhador 
        // Passar a quantidade de rifas ao inves de valor DREX
        ///////////////////////////// FLUXOGRAMA /////////////////////////////
        // Primeiro o cliente entra e verifica se a refia ja foi sorteada ou nao --> Requires
        // Validacao para nao deixar ele comprar valores negativos --> Requires
        // Validacao para mandar mensagem --> require
        // Calcular o custo da rifa --> numEntradas * valorEntrada
        // Adcionar o endereco do cliente no array de entradas --> entradas.push(msg.sender)
        // Diminuir a quantidade de tickets disponiveis, baseado na quantidade que o cliente comprou
        // Passar as variaveis para ingles

        restEntradas -= numEntradas;
    }

    // Função para gerar um número aleatório usando o hash do bloco
    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, entradas)));
    }

    function escolherVencedor() public onlyManager {
        require(entradas.length > 0, "Nenhuma entrada na rifa");
        require(!sorteado, "Sorteio ja realizado");

        uint256 index = random() % entradas.length;
        vencedor = entradas[index];

        // Transfere os tokens acumulados como prêmio para o vencedor
        uint256 premio = token.balanceOf(address(this));
        require(token.transfer(vencedor, premio), "Transferencia do premio falhou");

        sorteado = true;
    }

    // Função para visualizar os participantes da rifa
    function getEntradas() public view returns (address[] memory) {
        return entradas;
    }

    function getSorteado() public view returns (bool) {
        return sorteado;
    }
}
