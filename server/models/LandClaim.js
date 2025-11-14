const mongoose = require('mongoose');

const landClaimSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  documentHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  onChainTransactionHash: {
    type: String,
    default: null
  },
  uploadedFiles: {
    formB1: { type: String },
    formP2: { type: String },
    aadharCard: { type: String },
    witnessProof: { type: String }
  },
  votes: [{
    councilMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    councilMemberName: String,
    councilWalletAddress: String,
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  voteCount: {
    type: Number,
    default: 0
  },
  requiredVotes: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LandClaim', landClaimSchema);
