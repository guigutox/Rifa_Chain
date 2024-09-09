const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rifa", function () {
    let RealDigital, realDigital, Rifa, rifa, owner, addr1, addr2;

    beforeEach(async function () {
        // Implantando o contrato RealDigital (Token)
        RealDigital = await ethers.getContractFactory("RealDigital");
        realDigital = await RealDigital.deploy();
        await realDigital.waitForDeployment(); // Esperar até o deploy estar completo

        // Definindo contas
        [owner, addr1, addr2] = await ethers.getSigners();

        // Implantando o contrato Rifa com o token RealDigital
        Rifa = await ethers.getContractFactory("Rifa");
        rifa = await Rifa.deploy(realDigital.getAddress(), 10, 1); // Máximo de 10 entradas e custo de 1 token por entrada

        // Distribuindo tokens para as contas
        await realDigital.mint(addr1.address, 20); // addr1 recebe 20 tokens
        await realDigital.mint(addr2.address, 15); // addr2 recebe 15 tokens
    });

    it("Deve permitir que um usuário compre entradas se tiver saldo suficiente", async function () {
        // Aprovação de tokens do addr1 para o contrato da rifa
        await realDigital.connect(addr1).approve(rifa.getAddress(), 2);

        // addr1 compra 2 entradas
        await rifa.connect(addr1).entrar(2);

        // Verifica se addr1 entrou corretamente
        expect(await rifa.entradas(0)).to.equal(addr1.address);
        expect(await rifa.entradas(1)).to.equal(addr1.address);
        expect(await rifa.restEntradas()).to.equal(8); // restEntradas deve ter sido decrementado
    });

    it("Deve falhar se o saldo do usuário for insuficiente para comprar entradas", async function () {
        // Tentativa de comprar entradas sem saldo suficiente
        await expect(rifa.connect(addr2).entrar(20)).to.be.revertedWith("Saldo insuficiente para entrar na rifa");
    });

    it("Deve sortear o vencedor corretamente após todas as entradas serem compradas", async function () {
        // Aprovações para addr1 e addr2
        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);
        await realDigital.connect(addr2).approve(rifa.getAddress(), 5);

        // addr1 compra 5 entradas e addr2 compra outras 5 entradas
        await rifa.connect(addr1).entrar(5);
        await rifa.connect(addr2).entrar(5);

        // Restam 0 entradas após as compras
        expect(await rifa.restEntradas()).to.equal(0);

        // Como as entradas acabaram, o sorteio deve ser realizado automaticamente
        const vencedor = await rifa.vencedor();
        expect(vencedor).to.be.oneOf([addr1.address, addr2.address]);
    });

    it("Apenas o gerente pode chamar escolherVencedor manualmente", async function () {
        // Aprovação de tokens para addr1 e addr2
        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);
        await realDigital.connect(addr2).approve(rifa.getAddress(), 5);

        // addr1 compra 5 entradas e addr2 compra outras 5 entradas
        await rifa.connect(addr1).entrar(5);
        await rifa.connect(addr2).entrar(5);

        // Como o sorteio já foi realizado, testamos o caso em que um não-gerente tenta chamar a função
        await expect(rifa.connect(addr2).escolherVencedor()).to.be.revertedWith("Apenas o gerente pode chamar esta funcao");

        // Tentativa do gerente escolher manualmente (deve falhar se o sorteio já foi realizado)
        await expect(rifa.escolherVencedor()).to.be.revertedWith("Sorteio ja realizado");
    });
});
