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

        // Obtenha informações adicionais após o deploy
        const rifaAddress = await rifa.getAddress();
        const entradasRestantes = maxEntradas;  // Inicialmente, todas as vagas estão disponíveis
        const sorteioRealizado = false;  // O sorteio ainda não foi realizado
        const tokensAcumulados = "0";  // Inicialmente, nenhum token foi acumulado

        // Salvar a nova rifa com os campos adicionais no banco de dados
        const novaRifa = new rifaRepository({
            address: rifaAddress,
            valorEntrada: valorEntrada,
            maxEntradas: maxEntradas,
            entradasRestantes: entradasRestantes,
            sorteioRealizado: sorteioRealizado,
            tokensAcumulados: tokensAcumulados
        });

        await novaRifa.save();

        res.json({ message: 'Rifa criada com sucesso!', rifaAddress: rifaAddress, rifaId: novaRifa._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a rifa' });
    }
});



//Rota para entrar na rifa
router.post('/entrar', async (req, res) => {
    try {
        const { rifaId, quantidadeRifas } = req.body;

        // Busca a rifa pelo ID no banco de dados
        const rifaData = await rifaRepository.findById(rifaId);
        if (!rifaData) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }

        // Cria uma instância do contrato com o endereço da rifa
        const rifaContract = new ethers.Contract(rifaData.address, rifaAbi, wallet);

        // Verifica se o sorteio já foi realizado
        if (rifaData.sorteioRealizado) {
            return res.status(400).send({ error: 'O sorteio desta rifa já foi realizado' });
        }

        // Tenta realizar a entrada na rifa
        const tx = await rifaContract.entrar(quantidadeRifas);
        await tx.wait();

        // Atualiza o número de entradas restantes
        const novasEntradasRestantes = rifaData.entradasRestantes - quantidadeRifas;

        // Atualiza a quantidade de tokens acumulados na rifa
        const tokensAcumulados = await rifaContract.TokensAcumulados();

        // Verifica se todas as entradas foram compradas
        let sorteioRealizado = rifaData.sorteioRealizado;
        if (novasEntradasRestantes <= 0) {
            sorteioRealizado = true;
            // Opcional: Pode-se chamar a função `escolherVencedor` automaticamente aqui, se desejado.
            // await rifaContract.escolherVencedor();
        }

        // Atualiza os dados da rifa no banco de dados
        rifaData.entradasRestantes = novasEntradasRestantes;
        rifaData.tokensAcumulados = ethers.formatUnits(tokensAcumulados, 18);
        rifaData.sorteioRealizado = sorteioRealizado;

        await rifaData.save();

        res.send({ message: 'Você entrou na rifa com sucesso', tx });
    } catch (error) {
        if (error.message.includes("O sorteio ja foi realizado")) {
            res.status(400).send({ error: 'O sorteio dessa rifa já foi realizado' });
        } else if (error.message.includes("Saldo insuficiente")) {
            res.status(400).send({ error: 'Saldo insuficiente para entrar na rifa.' });
        } else if (error.code === 'CALL_EXCEPTION') {
            res.status(400).send({ error: 'Erro ao tentar executar a transação. Verifique os dados e tente novamente.' });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
});


///////////////// ROTAS PASSIVEIS DE SEREM TIRADAS: essas 2 informacoes ja estao sendo guardadas no banco de dados
//Rota para verificar a quantidade de entradas na rifa
router.get('/rifa/entradas', async (req, res) => {
    try {
        const { rifaId } = req.body;

        // Busca a rifa pelo ID no banco de dados
        const rifaData = await rifaRepository.findById(rifaId);
        if (!rifaData) {
        return res.status(404).send({ error: 'Rifa não encontrada' });
        }
        const entradas = rifaData.maxEntradas - rifaData.entradasRestantes;
        res.json({ entradas: entradas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter as entradas da rifa' });
    }
});

/////////////////////
//Rota que autoriza o contrato a gastar tokens
router.post('/approve', async (req, res) => {
    try {
        const { rifaId, amount } = req.body;  // Recebendo o ID da rifa e a quantia
        
        // Busca a rifa no banco de dados pelo ID
        const rifa = await rifaRepository.findById(rifaId);
        if (!rifa) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }

        const amountToApprove = ethers.parseUnits(amount, 18); // Convertendo a quantia para DREX (18 casas decimais)
        
        // Criando uma instância do contrato Rifa com o endereço da rifa encontrado no banco de dados
        const rifaContract = new ethers.Contract(rifa.address, rifaAbi, wallet);
        
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

// Rota para escolher um vencedor
router.post('/sorteio', async (req, res) => {
    try {
        const { rifaId } = req.body;

        const rifa = await rifaRepository.findById(rifaId);
        if (!rifa) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }

        const rifaContract = new ethers.Contract(rifa.address, rifaAbi, wallet);

        // Realizar o sorteio
        const tx = await rifaContract.escolherVencedor();
        await tx.wait();

        // Atualizar informações no banco de dados
        rifa.sorteioRealizado = true;
        rifa.tokensAcumulados = 0;
        await rifa.save();

        res.send({ message: 'Sorteio realizado com sucesso', tx });
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

// Rota para mintar novos tokens para um endereço
router.post('/mint', async (req, res) => {
    try {
        const { to, amount } = req.body;

        // Verifica se o endereço é válido
        if (!ethers.isAddress(to)) {
            return res.status(400).send({ error: 'Endereço inválido' });
        }

        const amountToMint = ethers.parseUnits(amount, 18); // Converte a quantia para DREX (18 casas decimais)

        // Chama a função mint do contrato RealDigital
        const tx = await RealDigitalContract.mint(to, amountToMint);
        await tx.wait();  // Aguardando a confirmação da transação

        res.send({ message: 'Tokens mintados com sucesso', tx });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erro ao mintar tokens' });
    }
});


module.exports = router;
