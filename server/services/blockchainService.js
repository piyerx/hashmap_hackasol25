const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let contract = null;
let provider = null;
let wallet = null;

const initializeBlockchain = () => {
  try {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
    provider = new ethers.JsonRpcProvider(rpcUrl);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.warn('WARNING: PRIVATE_KEY not set in .env file');
      return false;
    }

    wallet = new ethers.Wallet(privateKey, provider);

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn('WARNING: CONTRACT_ADDRESS not set in .env file');
      return false;
    }

    const abiPath = path.join(__dirname, '../../contracts/artifacts/contracts/LandRegistry.sol/LandRegistry.json');
    
    let abi;
    if (fs.existsSync(abiPath)) {
      const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      abi = artifact.abi;
    } else {
      console.warn('WARNING: Contract ABI not found. Please compile contracts first.');
      abi = [
        "function recordVerifiedTitle(uint256 claimId, string memory ownerName, string memory location, string memory documentHash) external",
        "event TitleVerified(uint256 indexed claimId, string ownerName, string location, address verifiedBy)"
      ];
    }

    contract = new ethers.Contract(contractAddress, abi, wallet);
    console.log('Blockchain service initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain service:', error.message);
    return false;
  }
};

const recordVerifiedClaim = async (claimId, ownerName, location, documentHash) => {
  try {
    if (!contract) {
      const initialized = initializeBlockchain();
      if (!initialized) {
        throw new Error('Blockchain service not initialized. Check your .env configuration.');
      }
    }

    console.log(`Recording claim on blockchain...`);
    console.log(`Owner: ${ownerName}`);
    console.log(`Location: ${location}`);
    console.log(`Document Hash: ${documentHash}`);
    
    // Generate a numeric claim ID from the document hash
    // Take first 16 hex characters of the hash and convert to number
    const numericClaimId = BigInt('0x' + documentHash.substring(0, 16));
    
    console.log(`Numeric Claim ID: ${numericClaimId.toString()}`);
    
    const tx = await contract.recordVerifiedTitle(
      numericClaimId,
      ownerName,
      location,
      documentHash
    );

    console.log('Transaction sent:', tx.hash);
    console.log('⏳ Waiting for blockchain confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    console.log('📝 Transaction hash:', receipt.hash);

    return receipt.hash;
  } catch (error) {
    console.error('Blockchain recording error:', error);
    throw new Error(`Failed to record on blockchain: ${error.message}`);
  }
};

module.exports = {
  initializeBlockchain,
  recordVerifiedClaim
};
