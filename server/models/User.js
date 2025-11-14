const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'council'],
    default: 'user'
  },
  isCouncilMember: {
    type: Boolean,
    default: false
  },
  councilWalletAddress: {
    type: String,
    default: null
  },
  councilMemberName: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
