// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Rifa {
    address public manager;
    address[] public entradas;
    uint256 public premio;
    bool public sorteado;
    address public vencedor;
    uint256 public len;
    uint256 _maxEntradas = 100;
    uint256 public maxEntradas;

    constructor() {
        manager = msg.sender;
        sorteado = false;
        maxEntradas = maxEntradas;
    }

    // Permite que usuários entrem na rifa com uma ou mais entradas
    function entrar() public payable {
        require(!sorteado, "O sorteio ja foi realizado");  // Verifica se o sorteio já foi realizado
        require(msg.value > .01 ether, "Quantidade minima de ETH nao atingida");

        uint256 numEntradas = msg.value / .01 ether;
        for (uint256 i = 0; i < numEntradas; i++) {
            entradas.push(msg.sender);
        }

        premio += msg.value;
        len = entradas.length;

        if(len >= maxEntradas){
            escolherVencedor();
        }
    }

    // Função para gerar um número aleatório usando o hash do bloco
    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, entradas)));
    }

    // Função para escolher o vencedor da rifa
    function escolherVencedor() private {
        require(entradas.length > 0, "Nenhuma entrada na rifa");
        require(!sorteado, "Sorteio ja realizado");

        uint256 index = random() % entradas.length;
        vencedor = entradas[index];
        payable(vencedor).transfer(premio);
        sorteado = true;
    }

    // Modificador que garante que apenas o gerente possa executar certas funções
  /*  modifier restricted() {
        require(msg.sender == manager, "Somente o gerente pode chamar esta funcao");
        ;
    }*/

    // Função para visualizar os participantes da rifa
    function getEntradas() public view returns (address[] memory) {
        return entradas;
    }
}