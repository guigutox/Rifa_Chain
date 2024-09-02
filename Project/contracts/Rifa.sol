// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RealDigital.sol";  // Importa o contrato MyToken específico

contract Rifa {
    address public manager;
    mapping(uint256 => address) public entradas;
    uint256 public entradasCount;
    bool public sorteado;
    address public vencedor;

    uint256 public maxEntradas;  // quantidade maxima de entradas
    uint256 public restEntradas; // Entradas restantes
    uint256 public valorEntrada; // Preço de cada entrada

    RealDigital public token; // dizendo qual token erc20 vamos usar

    constructor(RealDigital _token, uint256 _maxEntradas, uint256 _valorEntrada) {
        manager = msg.sender;
        token = _token;
        sorteado = false;
        maxEntradas = _maxEntradas;
        restEntradas = maxEntradas;
        valorEntrada = _valorEntrada;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Apenas o gerente pode chamar esta funcao");
        _;
    }

    modifier notSorteado() {
        require(!sorteado, "O sorteio ja foi realizado");
        _;
    }

    modifier entradasDisponiveis() {
        require(restEntradas > 0, "Nao ha entradas disponiveis");
        _;
    }

    function entrar(uint256 quantidadeRifas) public notSorteado entradasDisponiveis {
        require(quantidadeRifas > 0, "Quantidade de rifas deve ser maior que zero");


        uint256 totalCusto = quantidadeRifas * valorEntrada;
        require(token.balanceOf(msg.sender) >= totalCusto, "Saldo insuficiente para entrar na rifa");

        // verifica se ele nao tentou comprar mais tickets do que estao disponiveis
        if (quantidadeRifas > restEntradas) {
            quantidadeRifas = restEntradas;
            totalCusto = quantidadeRifas * valorEntrada;
        }

        require(token.transferFrom(msg.sender, address(this), totalCusto), "Transferencia de tokens falhou");

        for (uint256 i = 0; i < quantidadeRifas; i++) {
            entradas[entradasCount] = msg.sender;
            entradasCount++;
        }
        restEntradas -= quantidadeRifas;
        

        // nao da pra criar uma funcao separada para sortear automaticamente, para fazer isso teriamos que adicionar o modifier onlyManager, o que impediria que algum endereço que nao seja o owner compre a ultima ficha dessa rifa
        if(restEntradas == 0){
        uint256 index = random() % entradasCount;
        vencedor = entradas[index];


        require(token.transfer(vencedor, (token.balanceOf(address(this)))), "Transferencia do premio falhou");

        sorteado = true;

        }

    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, entradasCount)));
    }

    function escolherVencedor() public onlyManager {
        require(entradasCount > 0, "Nenhuma entrada na rifa");
        require(!sorteado, "Sorteio ja realizado");

        uint256 index = random() % entradasCount;
        vencedor = entradas[index];


        require(token.transfer(vencedor, (token.balanceOf(address(this)))), "Transferencia do premio falhou");

        sorteado = true;
    }

    function getEntradas() public view returns (address[] memory) {
        address[] memory participantes = new address[](entradasCount);
        for (uint256 i = 0; i < entradasCount; i++) {
            participantes[i] = entradas[i];
        }
        return participantes;
    }

    function getSorteado() public view returns (bool) {
        return sorteado;
    }
    function TokensAcumulados() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
    function vagasRestantes() public view returns (uint256) {
        return restEntradas;
    }
}
