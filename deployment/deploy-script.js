// Hardhat deployment script for FREEAI Token
// Run: npx hardhat run scripts/deploy.js --network bscTestnet

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("🚀 Deploying FREEAI Token...");
    console.log("📍 Deployer address:", deployer.address);
    console.log("💰 Account balance:", (await deployer.getBalance()).toString());
    
    // Deploy parameters
    const DEV_WALLET = deployer.address; // Change this to your actual dev wallet
    
    console.log("🔧 Dev wallet:", DEV_WALLET);
    
    // Deploy the contract
    const FreeAIToken = await ethers.getContractFactory("FreeAIToken");
    const freeai = await FreeAIToken.deploy(DEV_WALLET);
    
    await freeai.deployed();
    
    console.log("✅ FREEAI Token deployed to:", freeai.address);
    console.log("📊 Token Details:");
    console.log("   - Name:", await freeai.name());
    console.log("   - Symbol:", await freeai.symbol());
    console.log("   - Decimals:", await freeai.decimals());
    console.log("   - Total Supply:", ethers.utils.formatEther(await freeai.totalSupply()));
    
    // Contract verification info
    console.log("\n📋 Contract Verification Info:");
    console.log("Contract Address:", freeai.address);
    console.log("Network: BSC Testnet");
    console.log("Constructor Args:", DEV_WALLET);
    
    // Save deployment info
    const deploymentInfo = {
        network: "bscTestnet",
        contractAddress: freeai.address,
        deployer: deployer.address,
        devWallet: DEV_WALLET,
        deployedAt: new Date().toISOString(),
        gasUsed: "~0.02 BNB",
        totalSupply: "1,000,000,000",
        distribution: {
            airdrop: "70%",
            dev: "5%",
            liquidity: "20%",
            marketing: "5%"
        }
    };
    
    console.log("\n💾 Deployment completed!");
    console.log("Save this info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Next steps
    console.log("\n📝 Next Steps:");
    console.log("1. Verify contract on BSCScan");
    console.log("2. Create website with contract address");
    console.log("3. Set up Telegram group");
    console.log("4. Prepare airdrop list");
    console.log("5. Enable trading when ready");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });