async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy RealDigital
    const RealDigital = await ethers.getContractFactory("RealDigital");
    const realDigital = await RealDigital.deploy();
    await realDigital.waitForDeployment();  // importante aguardar esse negocio, se nao ele retorna undefined
    const realDigitalAddress = await realDigital.getAddress();  // graças ao await ali, é garantia que o contrato ja vai ter feito o deploy e com o endereço em maos
  
    console.log("RealDigital implementado no endereço:", realDigitalAddress);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  