const { ethers } = require('ethers')
const CoinContract = require('../../artifacts/contracts/RealDigital.sol/RealDigital.json')

const createContractInstance = async (address) => {
  const rpcProvider = new ethers.JsonRpcProvider("http://localhost:8545")
  const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", rpcProvider)

  const contract = new ethers.Contract(address, CoinContract.abi, rpcProvider)
  return await contract.connect(signer)
}

const create = async (receiver, amount, percentage) => {
  try {
    const contract = await createContractInstance('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const transaction = await contract.mint(receiver, ethers.parseUnits(amount))
    console.log(transaction)

    await transaction.wait()
    return `${amount} tokens foram criados com sucesso para: ${receiver}. Para mais informações, consulte o hash: ${transaction.hash}`
  } catch (error) {
    console.log(error.message)
  }

}


const getBalance = async (address) => {
  try {
    const contract = await createContractInstance('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const transaction = await contract.balanceOf(address)


    const result = Number(ethers.formatUnits(transaction, 18))
    return `O usuário ${address} possui ${result.toFixed(2)}  Coins em sua carteira`
  } catch (error) {
    console.log(error.message)
  }

}

async function main() {
  const demoAccountAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  try {
    // console.log('Iniciando fluxo de operações  Coins...\n')
    // console.log(`À fins de registro, durante essa demo será utilizada a conta: ${demoAccountAddress}. ${await getBalance(demoAccountAddress)} antes da demo ser iniciada.\n`)

    // console.log('Passo 1 - Deverão ser criados 50  Coins para determinada conta.')
    // console.log(`---- ${await create(demoAccountAddress, '50', 50)}\n`)

    console.log('Passo 2 - Ao consultar o saldo da conta em questão, deverá ser informado o valor atual.')
    console.log(`---- ${await getBalance(demoAccountAddress)}\n`)

    // console.log('Passo 3 - Tendo moedas suficientes, o usuário poderá trocá-las por um benefício.')
    // console.log(`---- ${await trade('30')}\n`)

    // console.log('Passo 4 - Após a troca, o novo saldo deverá ser retornado.')
    // console.log(`---- ${await getBalance(demoAccountAddress)}\n`)

    console.log('---- Operações concluídas com sucesso! ----')
  } catch (error) {
    console.error('Erro durante o fluxo de operações:', error.message)
  }
}

main()