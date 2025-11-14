# 🚀 Quick Deployment Guide - Council Voting System

## Prerequisites
- Sepolia ETH in your wallet
- MongoDB Atlas connection working
- Node.js and npm installed

## Step-by-Step Deployment

### 1. Deploy Smart Contract
```bash
cd contracts
npx hardhat run scripts/deployCouncil.js --network sepolia
```

**Copy the output contract address!**

### 2. Update Environment Variables
Edit `server/.env`:
```env
CONTRACT_ADDRESS=<paste_new_contract_address_here>
```

### 3. Create Council Members
```bash
cd ../server
node createCouncilMembers.js
```

This creates 5 accounts:
- CouncilMember1 / council123
- CouncilMember2 / council123
- CouncilMember3 / council123
- CouncilMember4 / council123
- CouncilMember5 / council123

### 4. Start Services
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd ../client
npm run dev
```

### 5. Test the System

#### Test Vote Flow:
1. Login as regular user (Piyyy / password123)
2. Submit a new land claim
3. Logout

4. Login as CouncilMember1 / council123
5. Go to dashboard → Click claim → Vote
6. See "1/5 Votes"
7. Logout

8. Repeat with CouncilMember2, 3, 4, 5
9. On 5th vote, claim gets verified on blockchain!

10. Login back as Piyyy
11. Check dashboard → Claim shows "Verified" with transaction hash

## Quick Test Script

Run this to test everything at once:
```bash
# 1. Deploy
cd contracts && npx hardhat run scripts/deployCouncil.js --network sepolia

# 2. Create accounts
cd ../server && node createCouncilMembers.js

# 3. Start server (in background)
cd server && npm start &

# 4. Start client (in background)
cd ../client && npm run dev &
```

## Troubleshooting

### "Port 5000 already in use"
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### "Contract not deployed"
- Check CONTRACT_ADDRESS in server/.env
- Verify deployment succeeded
- Check Sepolia Etherscan

### "Cannot cast vote"
- Ensure logged in as council member
- Check wallet has ETH
- Verify you haven't voted already

### "Vote not showing"
- Refresh dashboard
- Check MongoDB connection
- Verify API endpoint is being called

## Verification

After deployment, verify:
1. ✅ Contract visible on Sepolia Etherscan
2. ✅ 5 council members in database
3. ✅ Can submit claim as user
4. ✅ Council members can see pending claims
5. ✅ Voting works and increments count
6. ✅ 5th vote triggers blockchain recording
7. ✅ Transaction hash appears in user dashboard

## Admin Accounts

- **Regular User**: Piyyy / password123
- **Old Admin**: PiyyyAdmin / admin123 (legacy, for emergency)
- **Council Members**: CouncilMember1-5 / council123

## Next Steps

1. Change default passwords
2. Add unique wallet addresses for each council member
3. Fund council member wallets with Sepolia ETH
4. Update PRESENTATION.md with new voting system
5. Test with real tribal community members

---

**🎉 Your decentralized governance system is now live!**
