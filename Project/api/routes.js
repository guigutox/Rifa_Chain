const router = require("express").Router();
const express = require('express');
const path = require('path');
const rifaRepository = require("./infra/helper/repositories/rifa-repository");

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


//Rota para criar Rifa no db
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
        const { rifaAddress, quantidadeRifas } = req.body;

        // Busca a rifa pelo campo "address"
        const rifaData = await rifaRepository.findOne({ address: rifaAddress });
        if (!rifaData) {
            return res.status(404).send({ error: 'Rifa não encontrada' });
        }

        const novasEntradasRestantes = rifaData.entradasRestantes - quantidadeRifas;
        rifaData.tokensAcumulados += (quantidadeRifas * rifaData.valorEntrada);
        if (novasEntradasRestantes <= 0) {
            rifaData.sorteioRealizado = true;
            rifaData.tokensAcumulados = 0;
            novasEntradasRestantes = 0;
        }
        rifaData.entradasRestantes = novasEntradasRestantes;
        await rifaData.save();

        res.send({ message: 'Rifa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});


// atualiza o db caso alguem seja sorteado
router.post('/sorteio', async (req, res) => {
    try {
        const { rifaAddress } = req.body;

        const rifa = await rifaRepository.findOne({ address: rifaAddress });
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




router.get('/rifas', async (req, res) => {
    try {
        const rifas = await rifaRepository.find(); 
        res.json(rifas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar rifas' });
    }
});


module.exports = router;