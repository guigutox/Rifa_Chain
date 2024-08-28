async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy RealDigital
    const RealDigital = await ethers.getContractFactory("RealDigital");
    const realDigital = await RealDigital.deploy();
    await realDigital.waitForDeployment();  // importante aguardar esse negocio, se nao ele retorna undefined
    const realDigitalAddress = await realDigital.getAddress();  // graças ao await ali, é garantia que o contrato ja vai ter feito o deploy e com o endereço em maos
  
    console.log("RealDigital implementado no endereço:", realDigitalAddress);
  
    // Deploy Rifa
    const maxEntradas = 100;
    const valorEntrada = ethers.parseUnits("10", 18); // 10 DREX por entrada
    console.log({realDigitalAddress, maxEntradas, valorEntrada});
    const Rifa = await ethers.getContractFactory("Rifa");
    const rifa = await Rifa.deploy(realDigitalAddress, maxEntradas, valorEntrada);
    await rifa.waitForDeployment();  // mesma coisa de ali em cima
    const rifaAddress = await rifa.getAddress();  
  
    console.log("Rifa implementado no endereço:", rifaAddress);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  