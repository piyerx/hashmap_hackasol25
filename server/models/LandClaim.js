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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LandClaim', landClaimSchema);
