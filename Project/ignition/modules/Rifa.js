const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RifaModule", (m) => {

  const rifaContract = m.contract("Rifa", [150])

  return { rifaContract };
});
