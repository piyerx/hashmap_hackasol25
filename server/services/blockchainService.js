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
        "function voteToApprove(uint256 claimId, string memory ownerName, string memory location, string memory documentHash) external",
        "function recordVerifiedTitle(uint256 claimId, string memory ownerName, string memory location, string memory documentHash) external",
        "function getClaimVoteStatus(uint256 claimId) external view returns (uint8 voteCount, bool finalized, address[] memory voters)",
        "event VoteCast(uint256 indexed claimId, address indexed voter, uint8 currentVotes)",
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

// New voting function for council members
const voteForClaim = async (documentHash, ownerName, location, voterWalletAddress, councilMemberIndex = 0) => {
  try {
    if (!contract) {
      const initialized = initializeBlockchain();
      if (!initialized) {
        throw new Error('Blockchain service not initialized. Check your .env configuration.');
      }
    }

    console.log(`Casting vote on blockchain...`);
    console.log(`Voter Wallet: ${voterWalletAddress}`);
    console.log(`Council Member Index: ${councilMemberIndex}`);
    console.log(`Owner: ${ownerName}`);
    console.log(`Location: ${location}`);
    console.log(`Document Hash: ${documentHash}`);
    
    // Generate a numeric claim ID from the document hash
    const numericClaimId = BigInt('0x' + documentHash.substring(0, 16));
    console.log(`Numeric Claim ID: ${numericClaimId.toString()}`);

    // Create a wallet instance for this specific voter
    // Note: In production, each council member should sign with their own private key
    // For now, we'll use the main wallet but this should be changed
    const voterWallet = wallet; // TODO: Use council member's actual wallet
    
    const tx = await contract.connect(voterWallet).voteToApprove(
      numericClaimId,
      ownerName,
      location,
      documentHash,
      councilMemberIndex
    );

    console.log('Vote transaction sent:', tx.hash);
    console.log('⏳ Waiting for blockchain confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Vote confirmed in block:', receipt.blockNumber);
    
    // Check if this was the final vote that triggered verification
    const logs = receipt.logs;
    let isFinalVote = false;
    
    for (const log of logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed && parsed.name === 'TitleVerified') {
          isFinalVote = true;
          console.log('🎉 FINAL VOTE - Claim verified and recorded on blockchain!');
        } else if (parsed && parsed.name === 'VoteCast') {
          console.log(`📊 Vote count: ${parsed.args.currentVotes}/5`);
        }
      } catch (err) {
        // Ignore logs that don't match our contract
      }
    }

    return receipt.hash;
  } catch (error) {
    console.error('Blockchain voting error:', error);
    throw new Error(`Failed to cast vote on blockchain: ${error.message}`);
  }
};

module.exports = {
  initializeBlockchain,
  recordVerifiedClaim,
  voteForClaim
};
