const hre = require("hardhat");

async function main() {
  console.log("Deploying VeriChainRecord Smart Contract...");
  const VeriChainRecord = await hre.ethers.getContractFactory("VeriChainRecord");
  const verichain = await VeriChainRecord.deploy();

  await verichain.waitForDeployment();
  const address = await verichain.getAddress();

  console.log("--------------------------------------------------");
  console.log(`✅ VeriChainRecord deployed to address: ${address}`);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
