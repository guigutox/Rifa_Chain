const router = require("express").Router();
const express = require('express');
const { ethers } = require("hardhat"); // extremamente importante, voce importa o ethers do hardhat, nao do  ethers
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
const rifaBytecode = rifaJson.bytecode;

// Configuração dos contratos
const realDigitalAddress = process.env.CONTRACT_ADDRESS_REALDIGITAL;
const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, wallet);


//Rota para criar Rifa
router.post('/criar-rifa', async (req, res) => {
    try {
      const { rifaAddress, maxEntradas, valorEntrada } = req.body;
  
      const novaRifa = new rifaRepository({
        address: rifaAddress,
        valorEntrada: valorEntrada,
        maxEntradas: maxEntradas,
        entradasRestantes: maxEntradas,  // Inicialmente todas as vagas estão disponíveis
        sorteioRealizado: false,  
        tokensAcumulados: "0",  
      });
  
      await novaRifa.save();
  
      res.json({ message: 'Rifa criada e salva no banco de dados com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao salvar a rifa no banco de dados' });
    }
  });
  



//Rota para atualizar o banco de dados conforme mais pessoas entram na rifa
router.post('/atualizaDB', async (req, res) => {
    try {
        const { rifaId, quantidadeRifas } = req.body;

        const rifaData = await rifaRepository.findById(rifaId);
        if (!rifaData) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }

        const novasEntradasRestantes = rifaData.entradasRestantes - quantidadeRifas;
        rifaData.tokensAcumulados += (quantidadeRifas * rifaData.valorEntrada);
        if(novasEntradasRestantes <= 0){
            rifaData.sorteioRealizado = true;
            rifaData.tokensAcumulados = 0;
        }
        rifaData.entradasRestantes = novasEntradasRestantes;
        await rifaData.save();

        res.send({ message: 'Rifa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});



// ta na mira
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

// Rota para escolher um vencedor JOGAR ISSO PARA O FRONT
router.post('/sorteio', async (req, res) => {
    try {
        const { rifaId } = req.body;

        const rifa = await rifaRepository.findById(rifaId);
        if (!rifa) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }


        rifa.sorteioRealizado = true;
        rifa.tokensAcumulados = 0;
        await rifa.save();

        res.send({ message: 'Sorteio realizado com sucesso' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
// Rota para obter o saldo de tokens de um endereço
router.get('/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Verifica se o endereço é válido
        if (!ethers.isAddress(address)) {
            return res.status(400).send({ error: 'Endereço inválido' });
        }

        // Obtém o saldo de tokens do endereço
        const balance = await RealDigitalContract.balanceOf(address);

        res.json({ balance: ethers.formatUnits(balance, 18) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter o saldo de tokens' });
    }
});



// Nova rota para buscar informações do contrato
router.get('/rifa/:rifaId', async (req, res) => {
    try {
        const { rifaId } = req.params;


        const rifaData = await rifaRepository.findById(rifaId);
        if (!rifaData) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }


        res.json({
            address: rifaData.address,
            abi: rifaAbi
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter informações da rifa' });
    }
});
// Rota para fornecer o endereço e a ABI do contrato RealDigital
router.get('/real-digital-info', async (req, res) => {
    try {
        // Envie o endereço e a ABI do contrato para o frontend
        res.json({
            address: realDigitalAddress, // Endereço do contrato RealDigital.sol
            abi: realDigitalAbi          // ABI do contrato RealDigital.sol
        });
    } catch (error) {
        console.error('Erro ao obter informações do contrato RealDigital:', error);
        res.status(500).json({ error: 'Erro ao obter informações do contrato RealDigital' });
    }
});
router.get('/rifas', async (req, res) => {
    try {
        const rifas = await rifaRepository.find(); // Buscando todas as rifas
        res.json(rifas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar rifas' });
    }
});
router.get('/rifa-abi-bytecode', async (req, res) => {
    try {
        res.json({
            abi: rifaAbi,
            bytecode: rifaBytecode


        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter informações da rifa' });
    }
});



module.exports = router;