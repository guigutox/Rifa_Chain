const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rifa", function () {
    let RealDigital, realDigital, Rifa, rifa, owner, addr1, addr2;

    beforeEach(async function () {
        
        RealDigital = await ethers.getContractFactory("RealDigital");
        realDigital = await RealDigital.deploy();
        await realDigital.waitForDeployment(); 

        
        [owner, addr1, addr2] = await ethers.getSigners();

        
        Rifa = await ethers.getContractFactory("Rifa");
        rifa = await Rifa.deploy(realDigital.getAddress(), 10, 1); 

        
        await realDigital.mint(addr1.address, 20); 
        await realDigital.mint(addr2.address, 15); 
    });

    it("Deve permitir que um usuário compre entradas se tiver saldo suficiente", async function () {
        
        await realDigital.connect(addr1).approve(rifa.getAddress(), 2);

        
        await rifa.connect(addr1).entrar(2);

        
        expect(await rifa.entradas(0)).to.equal(addr1.address);
        expect(await rifa.entradas(1)).to.equal(addr1.address);
        expect(await rifa.restEntradas()).to.equal(8); 
    });

    it("Deve falhar se o saldo do usuário for insuficiente para comprar entradas", async function () {
       
        await expect(rifa.connect(addr2).entrar(20)).to.be.revertedWith("Saldo insuficiente para entrar na rifa");
    });

    it("Deve sortear o vencedor corretamente após todas as entradas serem compradas", async function () {

        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);
        await realDigital.connect(addr2).approve(rifa.getAddress(), 5);

        await rifa.connect(addr1).entrar(5);
        await rifa.connect(addr2).entrar(5);

        expect(await rifa.restEntradas()).to.equal(0);

        const vencedor = await rifa.vencedor();
        expect(vencedor).to.be.oneOf([addr1.address, addr2.address]);
    });

    it("Apenas o dono pode chamar escolherVencedor manualmente", async function () {

        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);
        await realDigital.connect(addr2).approve(rifa.getAddress(), 5);

        
        await rifa.connect(addr1).entrar(5);
        await rifa.connect(addr2).entrar(5);

        
        await expect(rifa.connect(addr2).escolherVencedor()).to.be.revertedWith("Apenas o gerente pode chamar esta funcao");

        
        await expect(rifa.escolherVencedor()).to.be.revertedWith("Sorteio ja realizado");
    });

    it("Deve criar uma nova rifa corretamente", async function () {
        
        const maxEntradas = 100;
        const valorEntrada = 2;
    
       
        const Rifa = await ethers.getContractFactory("Rifa");
        const rifaCriada = await Rifa.deploy(realDigital.getAddress(), maxEntradas, valorEntrada);
    
       
        expect(await rifaCriada.maxEntradas()).to.equal(maxEntradas);
        expect(await rifaCriada.valorEntrada()).to.equal(valorEntrada);
        expect(await rifaCriada.restEntradas()).to.equal(maxEntradas); 
        expect(await rifaCriada.sorteado()).to.equal(false); 
    });

    it("Deve atualizar o contrato corretamente após a compra de entradas", async function () {
       
        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);

       
        await rifa.connect(addr1).entrar(5);

        
        expect(await rifa.entradas(0)).to.equal(addr1.address);
        expect(await rifa.entradas(1)).to.equal(addr1.address);
        expect(await rifa.restEntradas()).to.equal(5); 
    });

    it("Verifica se o saldo do vencedor é atualizado corretamente após o sorteio", async function () {
       
        await realDigital.connect(addr1).approve(rifa.getAddress(), 5);
        await realDigital.connect(addr2).approve(rifa.getAddress(), 5);

       
        await rifa.connect(addr1).entrar(5);
        await rifa.connect(addr2).entrar(5);

      
        expect(await rifa.restEntradas()).to.equal(0);

     
        const vencedor = await rifa.vencedor();

        
        const saldoVencedor = await realDigital.balanceOf(vencedor);
        expect(saldoVencedor).to.be.greaterThan(0);
    });
});
