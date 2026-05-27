import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "chainId:", network.chainId);

  // 1. Deploy implementation
  console.log("\n1. Deploying LaunchlyToken implementation...");
  const LaunchlyToken = await ethers.getContractFactory("LaunchlyToken");
  const impl = await LaunchlyToken.deploy();
  await impl.waitForDeployment();
  const implAddr = await impl.getAddress();
  console.log("   Implementation:", implAddr);

  // 2. Deploy factory
  console.log("\n2. Deploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(implAddr, deployer.address);
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("   Factory:", factoryAddr);

  // 3. Save deployment info
  const info = {
    network: network.name,
    chainId: Number(network.chainId),
    implementation: implAddr,
    factory: factoryAddr,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${network.name}-${network.chainId}.json`;
  fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(info, null, 2));
  console.log("\n3. Saved deployment info to:", path.join(outDir, fileName));

  // 4. Verify on Etherscan (if API key available)
  if (process.env.ETHERSCAN_API_KEY && network.name === "sepolia") {
    console.log("\n4. Waiting for confirmations before verification...");
    // Wait 5 blocks for indexing
    const tx = impl.deploymentTransaction();
    if (tx) await tx.wait(5);

    try {
      await hre.run("verify:verify", { address: implAddr, constructorArguments: [] });
      console.log("   Implementation verified ✓");
    } catch (e: any) { console.log("   Impl verify failed:", e.message?.slice(0, 100)); }
  }

  console.log("\n✅ Deployment complete!");
  console.log("   Factory:", factoryAddr);
  console.log("   Explorer link will be in the deployment JSON");
}

main().catch((e) => {
  console.error("❌ Deployment failed:", e);
  process.exit(1);
});
