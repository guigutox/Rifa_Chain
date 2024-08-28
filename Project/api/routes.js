const router = require("express").Router();
const { ethers } = require("ethers");

// Configurações de provider e wallet
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

// ABI e endereço do contrato
const contractABI = require("../blockchain/abis/Rifa.json").abi;
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Rota padrão
router.get("/", (req, res) => {
  res.send("Ate aqui Deus nos ajudou !");
});

// Rota para verificar o status do sorteio
router.get("/status", async (req, res) => {
  try {
    const sorteado = await contract.getSorteado();
    res.json({ sorteado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter a lista de entradas
router.get("/entradas", async (req, res) => {
  try {
    const entradas = await contract.getEntradas();
    res.json({ entradas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para entrar na rifa
router.post("/entrar", async (req, res) => {
  const { key, quantidadeTokens } = req.body;
  
  if (!key || !quantidadeTokens) {
    return res.status(400).json({ error: "Necessário informar uma chave e a quantidade de tokens" });
  }

  const newWallet = new ethers.Wallet(key, provider);
  const newContract = new ethers.Contract(contractAddress, contractABI, newWallet);
  await newContract.connect(newWallet);

  try {
    // Aprova a transferência dos tokens para o contrato
    // const tokenAddress = await newContract.token();
    // const tokenContractABI = require("../blockchain/abis/RealDigital.json").abi;
    // const tokenContract = new ethers.Contract(tokenAddress, tokenContractABI, newWallet);

    // const approvalTx = await tokenContract.approve(contractAddress, quantidadeTokens);
    // await approvalTx.wait();

    // Entra na rifa
    console.log(newContract);
    const tx = await newContract.entrar(ethers.parseUnits(quantidadeTokens.toString(), 18));
    await tx.wait();

    res.json({ message: "Entrada realizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
//Testes a serem realizados no hardhat console 
// const RealDigital= await ethers.getContractFactory("RealDigital");
// const realDigital= await RealDigital.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3"); 
// await realDigital.mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 100)