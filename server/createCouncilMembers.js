require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const councilMembers = [
  {
    username: 'CouncilMember1',
    password: 'council123',
    councilMemberName: 'Ramesh Kumar',
    councilWalletAddress: '0x12da449Cb44b85e5952DB086DeaEA142A4eC770f', // Use your wallet
    role: 'council',
    isCouncilMember: true
  },
  {
    username: 'CouncilMember2',
    password: 'council123',
    councilMemberName: 'Sita Devi',
    councilWalletAddress: '0x12da449Cb44b85e5952DB086DeaEA142A4eC770f', // Replace with unique wallets
    role: 'council',
    isCouncilMember: true
  },
  {
    username: 'CouncilMember3',
    password: 'council123',
    councilMemberName: 'Prakash Singh',
    councilWalletAddress: '0x12da449Cb44b85e5952DB086DeaEA142A4eC770f', // Replace with unique wallets
    role: 'council',
    isCouncilMember: true
  },
  {
    username: 'CouncilMember4',
    password: 'council123',
    councilMemberName: 'Lakshmi Bai',
    councilWalletAddress: '0x12da449Cb44b85e5952DB086DeaEA142A4eC770f', // Replace with unique wallets
    role: 'council',
    isCouncilMember: true
  },
  {
    username: 'CouncilMember5',
    password: 'council123',
    councilMemberName: 'Arjun Yadav',
    councilWalletAddress: '0x12da449Cb44b85e5952DB086DeaEA142A4eC770f', // Replace with unique wallets
    role: 'council',
    isCouncilMember: true
  }
];

async function createCouncilMembers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adhikar');
    console.log('Connected to MongoDB');

    // Clear existing council members
    await User.deleteMany({ role: 'council' });
    console.log('Cleared existing council members');

    // Create new council members
    for (const member of councilMembers) {
      const hashedPassword = await bcrypt.hash(member.password, 10);
      const user = new User({
        username: member.username,
        password: hashedPassword,
        role: member.role,
        isCouncilMember: member.isCouncilMember,
        councilWalletAddress: member.councilWalletAddress,
        councilMemberName: member.councilMemberName
      });
      await user.save();
      console.log(`✅ Created: ${member.username} (${member.councilMemberName})`);
    }

    console.log('\n🎉 All 5 Council Members created successfully!');
    console.log('\nCouncil Member Credentials:');
    councilMembers.forEach((member, index) => {
      console.log(`  ${index + 1}. Username: ${member.username}, Password: ${member.password}`);
    });
    
    console.log('\n⚠️  NOTE: In production, replace wallet addresses with unique addresses for each council member');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createCouncilMembers();
