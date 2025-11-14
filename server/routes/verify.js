const express = require('express');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return res.status(404).json({ 
        valid: false,
        message: 'Transaction not found on blockchain' 
      });
    }

    // Load contract ABI
    const abiPath = path.join(__dirname, '../../contracts/artifacts/contracts/LandRegistry.sol/LandRegistry.json');
    let abi;
    
    if (fs.existsSync(abiPath)) {
      const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      abi = artifact.abi;
    } else {
      abi = [
        "event TitleVerified(uint256 indexed claimId, string ownerName, string location, address verifiedBy)"
      ];
    }

    // Create contract interface
    const iface = new ethers.Interface(abi);
    
    // Parse logs to find TitleVerified event
    let claimData = null;
    
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed && parsed.name === 'TitleVerified') {
          claimData = {
            claimId: parsed.args.claimId.toString(),
            ownerName: parsed.args.ownerName,
            location: parsed.args.location,
            verifiedBy: parsed.args.verifiedBy,
            blockNumber: receipt.blockNumber,
            timestamp: null // Will be populated from block
          };
          break;
        }
      } catch (err) {
        // Not the event we're looking for, continue
        continue;
      }
    }

    if (!claimData) {
      return res.json({
        valid: true,
        isLandClaim: false,
        message: 'Transaction is valid but not a land claim verification',
        txHash,
        blockNumber: receipt.blockNumber
      });
    }

    // Get block timestamp
    const block = await provider.getBlock(receipt.blockNumber);
    claimData.timestamp = new Date(block.timestamp * 1000).toISOString();

    res.json({
      valid: true,
      isLandClaim: true,
      message: 'Land claim verified successfully',
      txHash,
      blockNumber: receipt.blockNumber,
      claimData
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      valid: false,
      message: 'Error verifying transaction',
      error: error.message 
    });
  }
});

module.exports = router;
