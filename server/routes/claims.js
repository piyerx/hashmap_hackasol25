const express = require('express');
const LandClaim = require('../models/LandClaim');
const User = require('../models/User');
const { auth, adminAuth, userAuth, councilAuth } = require('../middleware/auth');
const { voteForClaim } = require('../services/blockchainService');

const router = express.Router();

router.post('/submit', auth, userAuth, async (req, res) => {
  try {
    const { ownerName, location, documentHash, uploadedFiles } = req.body;

    if (!ownerName || !location || !documentHash) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const landClaim = new LandClaim({
      ownerName,
      location,
      documentHash,
      status: 'Pending',
      submittedBy: req.user.userId,
      uploadedFiles: uploadedFiles || {}
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

router.get('/pending', auth, async (req, res) => {
  try {
    // Allow both council members and admins to view pending claims
    if (req.user.role !== 'council' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pendingClaims = await LandClaim.find({ status: 'Pending' })
      .populate('submittedBy', 'username')
      .populate('votes.councilMemberId', 'username councilMemberName')
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

// New voting endpoint for council members
router.post('/vote/:claimId', auth, councilAuth, async (req, res) => {
  try {
    const { claimId } = req.params;
    const councilMemberId = req.user.userId;

    // Get council member details
    const councilMember = await User.findById(councilMemberId);
    if (!councilMember || !councilMember.isCouncilMember) {
      return res.status(403).json({ error: 'Not authorized as council member' });
    }

    // Find the claim
    const claim = await LandClaim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    if (claim.status === 'Verified') {
      return res.status(400).json({ error: 'Claim already verified' });
    }

    // Check if this council member already voted
    const alreadyVoted = claim.votes.some(
      vote => vote.councilMemberId.toString() === councilMemberId
    );

    if (alreadyVoted) {
      return res.status(400).json({ error: 'You have already voted for this claim' });
    }

    // Determine council member index (0-4)
    // Since we're using the same wallet for testing, we'll use the vote count as index
    const councilMemberIndex = claim.votes.length; // 0, 1, 2, 3, or 4

    // Add vote
    claim.votes.push({
      councilMemberId,
      councilMemberName: councilMember.councilMemberName || councilMember.username,
      councilWalletAddress: councilMember.councilWalletAddress,
      votedAt: new Date()
    });
    claim.voteCount = claim.votes.length;

    await claim.save();

    // Check if threshold reached (5 votes)
    if (claim.voteCount >= claim.requiredVotes) {
      try {
        // Record on blockchain using the voting function
        const transactionHash = await voteForClaim(
          claim.documentHash,
          claim.ownerName,
          claim.location,
          councilMember.councilWalletAddress,
          councilMemberIndex
        );

        claim.status = 'Verified';
        claim.onChainTransactionHash = transactionHash;
        await claim.save();

        return res.json({
          message: 'Final vote cast! Claim verified and recorded on blockchain',
          claim,
          transactionHash,
          voteCount: claim.voteCount,
          requiredVotes: claim.requiredVotes,
          finalized: true
        });
      } catch (blockchainError) {
        console.error('Blockchain recording error:', blockchainError);
        return res.status(500).json({ 
          error: 'Vote recorded but blockchain transaction failed',
          details: blockchainError.message,
          claim,
          voteCount: claim.voteCount
        });
      }
    }

    res.json({
      message: 'Vote recorded successfully',
      claim,
      voteCount: claim.voteCount,
      requiredVotes: claim.requiredVotes,
      finalized: false
    });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: 'Server error during voting', details: error.message });
  }
});

module.exports = router;
