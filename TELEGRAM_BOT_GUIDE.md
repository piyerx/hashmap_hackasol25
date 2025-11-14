# 🤖 Adhikar Telegram Bot - User Guide

## Setup Complete! ✅

Your Telegram bot is now live and integrated with the Adhikar Land Registry system.

---

## 🚀 How to Use the Bot

### 1. Find Your Bot on Telegram
- Open Telegram
- Search for your bot using the bot username (you can find this in BotFather)
- Click "Start" to begin

### 2. Available Commands

#### `/start`
Shows welcome message and basic instructions

#### `/verify <transaction_hash>`
Verifies a land claim on the blockchain

**Example:**
```
/verify 0x6f4453c3bf7eda75a3933226b11e7ff3a620d48869cc73e0f25dc177d4564f7f
```

#### `/help`
Shows detailed help information and command list

---

## 📱 Bot Features

### ✅ What the Bot Does:
- **Instant Verification**: Fetches land claim details from Sepolia blockchain
- **Owner Information**: Shows owner name, GPS location, and claim ID
- **Blockchain Proof**: Provides block number and verification timestamp
- **Direct Links**: Etherscan link to view transaction on blockchain explorer
- **Smart Detection**: Distinguishes between land claims and regular transactions
- **User-Friendly**: Clear error messages and helpful suggestions

### 🔍 Verification Response Includes:
- ✓ Owner Name
- ✓ GPS Location (Latitude, Longitude)
- ✓ Claim ID
- ✓ Gram Sabha Council Address (who verified)
- ✓ Block Number
- ✓ Verification Date & Time
- ✓ Direct Etherscan Link

---

## 🧪 Testing the Bot

### Get a Test Transaction Hash:
1. Login to the website as `Piyyy` / `password123`
2. Submit a new land claim
3. Login as 5 different council members and vote
4. After 5 votes, claim gets verified and you receive a transaction hash
5. Copy that transaction hash

### Test on Telegram:
1. Open your Telegram bot
2. Send: `/verify 0xYourTransactionHashHere`
3. Bot will fetch and display all claim details!

---

## 💡 Example Usage

**User sends:**
```
/verify 0x6f4453c3bf7eda75a3933226b11e7ff3a620d48869cc73e0f25dc177d4564f7f
```

**Bot responds:**
```
✅ Valid Land Claim Found!

Owner: Ramesh Kumar
Location (GPS): 23.382813, 77.375622
Claim ID: 5555467491579772992
Verified By: 0x12da449C...A4eC770f
Block Number: 9628935
Verified On: 15 Nov 2025, 10:30 AM

🔗 View on Etherscan

This claim has been permanently recorded on the Sepolia 
blockchain and verified by the Gram Sabha Council.
```

---

## 🔐 Security Features

- ✓ **Read-Only**: Bot only reads blockchain data, cannot modify anything
- ✓ **No Login Required**: Public verification, no sensitive data
- ✓ **Direct Blockchain Query**: Fetches data directly from smart contract
- ✓ **Transparent**: All data is public and verifiable on Etherscan

---

## 🛠️ Technical Details

### Bot Configuration
- **Token**: Stored in `server/.env` as `TELEGRAM_BOT_TOKEN`
- **API Endpoint**: Uses `/api/verify/transaction/:txHash`
- **Network**: Sepolia Testnet
- **Contract**: 0x8490344FF3471847BC16e4d5b8EE079Fb794BaA6

### How It Works:
1. User sends transaction hash to bot
2. Bot validates hash format (0x + 64 hex chars)
3. Bot calls your API endpoint
4. API queries smart contract on Sepolia
5. Parses `TitleVerified` event from transaction logs
6. Returns formatted claim details to user

---

## 📝 Error Handling

### Invalid Hash Format
```
❌ Invalid transaction hash format!

Please provide a valid Ethereum transaction hash 
(66 characters starting with 0x).
```

### Claim Not Found
```
❌ Claim Not Found

We could not find a verified land claim for this transaction hash.

Possible reasons:
• Transaction hash is incorrect
• Claim is still pending (not yet verified by 5 council members)
• Transaction is not a land claim verification

What you can do:
• Check the transaction hash for typos
• Verify the claim has been approved by the Gram Sabha Council
• Visit our website to check claim status
```

### Non-Land Claim Transaction
```
ℹ️ Transaction Found

This is a valid blockchain transaction, but it's not a 
land claim verification.

Transaction Hash: 0x...
Block Number: 9628935

🔗 View on Etherscan
```

---

## 🎯 Use Cases

### For Tribal Community Members:
- **Quick Verification**: Check claim status on the go
- **Share Proof**: Forward verification to family/lawyers
- **No Internet Browser Needed**: Works directly in Telegram
- **Mobile-Friendly**: Perfect for areas with basic connectivity

### For Gram Sabha Officials:
- **Public Transparency**: Anyone can verify claims
- **Reduce Inquiries**: Direct people to bot for verification
- **Build Trust**: Instant blockchain proof

### For Legal/Administrative:
- **Evidence Collection**: Quick verification for legal processes
- **Audit Trail**: Permanent record of verification
- **Third-Party Verification**: Independent verification source

---

## 🚀 Next Steps

### Deployment to Production:
1. **Get Bot Token from BotFather**
   - Open Telegram, search for @BotFather
   - Send `/newbot` and follow instructions
   - Copy the token to `server/.env`

2. **Deploy Server**
   - Deploy to cloud (Heroku, AWS, DigitalOcean, etc.)
   - Update `API_BASE_URL` in `bot.js` to your domain
   - Ensure port is accessible

3. **Update Bot URLs**
   - Change localhost URLs to production URLs
   - Update Etherscan links if using mainnet

### Enhancements:
- ✨ Add inline keyboard buttons
- ✨ Support claim search by owner name
- ✨ Send notifications when claims are verified
- ✨ Multi-language support (English/Hindi)
- ✨ Add QR code generation for transaction hashes

---

## 🐛 Troubleshooting

### Bot Not Responding
- Check if server is running: `node server.js`
- Verify bot token in `.env` is correct
- Check console for error messages

### "Claim Not Found" Errors
- Ensure transaction is on Sepolia network
- Verify transaction was a land claim verification
- Check if 5 council members voted (claim finalized)

### Polling Errors
- Only one bot instance can run at a time
- Stop any other running instances
- Check your internet connection

---

## 📞 Support

**Server Running:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Telegram Bot: ✅ Active and listening

**Bot Status:**
You should see this in the console:
```
✅ Telegram bot is running and listening for commands...
```

**Test Transaction Hash:**
```
0x6f4453c3bf7eda75a3933226b11e7ff3a620d48869cc73e0f25dc177d4564f7f
```

---

## 🎉 Your Bot is Ready!

Open Telegram, find your bot, and start verifying land claims on the blockchain! 🚀

**Bot Features Summary:**
✓ Real-time blockchain verification
✓ Detailed claim information
✓ Direct Etherscan links
✓ User-friendly error messages
✓ 24/7 availability
✓ No registration required
✓ Mobile-optimized

**Empowering tribal communities through technology!** 🌿
