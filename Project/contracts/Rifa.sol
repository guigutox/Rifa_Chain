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

    // Modificador para garantir que o sorteio ainda não foi realizado
    modifier notSorteado() {
        require(!sorteado, "O sorteio ja foi realizado");
        _;
    }

    // Modificador para garantir que ainda há entradas disponíveis
    modifier entradasDisponiveis() {
        require(restEntradas > 0, "Nao ha entradas disponiveis");
        _;
    }


    // Permite que usuários entrem na rifa com uma ou mais entradas
    function entrar(uint256 quantidadeTokens) public notSorteado entradasDisponiveis{
        require(!sorteado, "O sorteio ja foi realizado");
        require(quantidadeTokens >= valorEntrada, "Quantidade minima de tokens nao atingida");  

        

        // Verifica se o usuário tem saldo suficiente para a transferência
        uint256 saldoUsuario = token.balanceOf(msg.sender);
        require(saldoUsuario >= quantidadeTokens, "Saldo insuficiente para entrar na rifa");

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
