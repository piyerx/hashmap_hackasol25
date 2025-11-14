const express = require('express');
const LandClaim = require('../models/LandClaim');
const { auth, adminAuth, userAuth } = require('../middleware/auth');
const { recordVerifiedClaim } = require('../services/blockchainService');

const router = express.Router();

router.post('/submit', auth, userAuth, async (req, res) => {
  try {
    const { ownerName, location, documentHash } = req.body;

    if (!ownerName || !location || !documentHash) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const landClaim = new LandClaim({
      ownerName,
      location,
      documentHash,
      status: 'Pending',
      submittedBy: req.user.userId
    });

    await landClaim.save();

    res.status(201).json({
      message: 'Land claim submitted successfully',
      claim: landClaim
    });
  } catch (error) {
    console.error('Claim submission error:', error);
    res.status(500).json({ error: 'Server error during claim submission' });
  }
});

router.get('/my-claims', auth, userAuth, async (req, res) => {
  try {
    const claims = await LandClaim.find({ submittedBy: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      claims
    });
  } catch (error) {
    console.error('Fetching claims error:', error);
    res.status(500).json({ error: 'Server error while fetching claims' });
  }
});

router.get('/pending', auth, adminAuth, async (req, res) => {
  try {
    const pendingClaims = await LandClaim.find({ status: 'Pending' })
      .populate('submittedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      claims: pendingClaims
    });
  } catch (error) {
    console.error('Fetching pending claims error:', error);
    res.status(500).json({ error: 'Server error while fetching pending claims' });
  }
});

router.put('/approve/:claimId', auth, adminAuth, async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await LandClaim.findById(claimId);
    
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status === 'Verified') {
      return res.status(400).json({ error: 'Claim already verified' });
    }

    const transactionHash = await recordVerifiedClaim(
      claimId,
      claim.ownerName,
      claim.location,
      claim.documentHash
    );

    claim.status = 'Verified';
    claim.onChainTransactionHash = transactionHash;
    await claim.save();

    res.json({
      message: 'Claim approved and recorded on blockchain',
      claim,
      transactionHash
    });
  } catch (error) {
    console.error('Claim approval error:', error);
    res.status(500).json({ error: 'Server error during claim approval', details: error.message });
  }
});

module.exports = router;
