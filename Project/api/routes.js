const router = require("express").Router();
const { ethers } = require("ethers");

// Rotas devem ser escritas aqui

const provider = new ethers.JsonRpcProvider("http://localhost:8545");
//inserir conta chave privada de alguma conta do hardhat
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

const contractABI = require("../blockchain/abis/Rifa.json").abi;
//Inserir endereço do contrato
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/status", async (req, res) => {
  try {
    const sorteado = await contract.getSorteado();
    res.json({ sorteado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/entradas", async (req, res) => {
  try {
    const entradas = await contract.getEntradas();
    res.json({ entradas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/entrar", async (req, res) => {
    try {
        const tx = await contract.entrar({ value: ethers.parseEther("0.1") });
        await tx.wait();
        res.json({ message: "Entrada realizada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
 });
module.exports = router;
