const router = require("express").Router();

const express = require('express');
const { ethers } = require("hardhat"); // extremamente importante, voce importa o ethers do hardhat, nao do do ethers
const fs = require('fs');
const path = require('path');
const rifaRepository = require("./infra/helper/repositories/rifa-repository");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


//configuração de carteira e provider
const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Caminhos para os arquivos JSON gerados pelo Hardhat
const realDigitalPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'RealDigital.sol', 'RealDigital.json');
const rifaPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'Rifa.sol', 'Rifa.json');


// Lendo os arquivos JSON
const realDigitalJson = JSON.parse(fs.readFileSync(realDigitalPath, 'utf8'));
const rifaJson = JSON.parse(fs.readFileSync(rifaPath, 'utf8'));

// Extraindo as ABIs
const realDigitalAbi = realDigitalJson.abi;
const rifaAbi = rifaJson.abi;

// Configuração dos contratos
const realDigitalAddress = process.env.CONTRACT_ADDRESS_REALDIGITAL;
const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, wallet);

//Rota para criar Rifa
router.post('/criar-rifa', async (req, res) => {
    try {
        const { maxEntradas, valorEntrada } = req.body;
        
        const Rifa = await ethers.getContractFactory("Rifa", wallet);
        const rifa = await Rifa.deploy(realDigitalAddress, maxEntradas, ethers.parseUnits(valorEntrada, 18));
        await rifa.waitForDeployment();

        const novaRifa = new rifaRepository({
                address: await rifa.getAddress(),
                valorEntrada: valorEntrada,
                maxEntradas: maxEntradas
        });

        await novaRifa.save();

        res.json({ message: 'Rifa criada com sucesso!', rifaAddress: await rifa.getAddress() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a rifa' });
    }
});


//Rota para entrar na rifa
router.post('/entrar', async (req, res) => {
    try {
        const { rifaAddress, quantidadeRifas } = req.body;
        const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, wallet);

        // Tentativa de entrada na rifa
        const tx = await rifaContract.entrar(quantidadeRifas);
        await tx.wait();

        res.send({ message: 'Você entrou na rifa com sucesso', tx });
    } catch (error) {
        if (error.message.includes("O sorteio ja foi realizado")) {
            res.status(400).send({ error: 'O sorteio dessa rifa ja foi realizado' });
        }
        else if (error.message.includes("Saldo insuficiente")) {
            res.status(400).send({ error: 'Saldo insuficiente para entrar na rifa.' });
        } else if (error.code === 'CALL_EXCEPTION') {
            res.status(400).send({ error: 'Erro ao tentar executar a transação. Verifique os dados e tente novamente.' });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
});

//Rota para verificar a quantidade de entradas na rifa
router.get('/rifa/:address/entradas', async (req, res) => {
    try {
        const { address } = req.params;

        const RifaContract = new ethers.Contract(address, rifaAbi, wallet);
        const entradas = await RifaContract.getEntradas();
        
        res.json({ entradas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter as entradas da rifa' });
    }
});

//Rota para verificar quantas entradas a rifa ja teve
router.get('/rifa/:address/tokens-acumulados', async (req, res) => {
    try {
        const { address } = req.params;

        const RifaContract = new ethers.Contract(address, rifaAbi, wallet);
        const tokensAcumulados = await RifaContract.TokensAcumulados();
        
        res.json({ tokensAcumulados: ethers.formatUnits(tokensAcumulados, 18) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter os tokens acumulados' });
    }
});

//Rota que autoriza o contrato a gastar tokens
router.post('/approve', async (req, res) => {
    try {
        const { rifaAddress, amount } = req.body;  // Recebendo o endereço da rifa e a quantia
        const amountToApprove = ethers.parseUnits(amount, 18); // Convertendo a quantia para DREX (18 casas decimais)
        
        // Criando uma instância do contrato Rifa com o endereço fornecido
        const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, wallet);
        
        // Chamando a função approve no contrato RealDigital para o endereço da rifa
        const tx = await RealDigitalContract.approve(rifaContract.getAddress(), amountToApprove);
        await tx.wait();  // Aguardando a confirmação da transação

        res.send({ message: 'Aprovação realizada com sucesso', tx });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/rifa/:address/vagas-restantes', async (req, res) => {
    try {
        const { address } = req.params;

        const RifaContract = new ethers.Contract(address, rifaAbi, wallet);
        const vagasRestantes = await RifaContract.vagasRestantes();
         res.json({ vagasRestantes: vagasRestantes.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter as vagas restantes da rifa' });
    }

});


module.exports = router;
