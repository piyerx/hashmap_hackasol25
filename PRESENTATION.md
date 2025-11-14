# 🌿 Adhikar - The Decentralized Tribal Land Registry

## 📋 Project Overview

**Adhikar** is a blockchain-powered land registry system designed specifically for tribal communities in India. It helps preserve and protect tribal land ownership by creating permanent, tamper-proof digital records on the blockchain.

### The Problem We're Solving

Tribal communities often face challenges in proving land ownership because:
- Traditional paper documents can be lost, damaged, or forged
- Land records are sometimes manipulated by corrupt officials
- There's no easy way for community members to verify land ownership
- Legal disputes arise due to unclear or disputed records

### Our Solution

Adhikar creates a **digital notary system** using blockchain technology where:
- Every land claim is permanently recorded and cannot be altered
- The Gram Sabha (village council) approves legitimate claims
- Anyone can verify land ownership using a transaction hash
- All records are transparent and accessible to the public

---

## 🛠️ Technology Stack

### Frontend (What Users See)
- **React** - Creates interactive web pages
- **Vite** - Makes the website load faster
- **TailwindCSS** - Provides beautiful, low-bandwidth design with a light green theme
- **Axios** - Communicates with the server

**Why these choices?**
- React makes the interface smooth and responsive
- TailwindCSS keeps file sizes small for low-bandwidth areas
- The green theme (#4CAF50) represents nature and tribal heritage

### Backend (Server Side)
- **Node.js + Express** - Handles user requests and manages data
- **MongoDB Atlas** - Cloud database that stores user accounts and claim details
- **JWT (JSON Web Tokens)** - Secure login system
- **bcryptjs** - Encrypts passwords for security

**Why these choices?**
- MongoDB is flexible and can handle growing data
- Cloud hosting means the system works from anywhere
- JWT ensures only authorized users can submit claims

### Blockchain (Digital Notary)
- **Ethereum (Sepolia Testnet)** - Public blockchain for permanent records
- **Solidity** - Programming language for smart contracts
- **Hardhat** - Tools for deploying blockchain code
- **Ethers.js** - Connects our website to the blockchain

**Why blockchain?**
- Records are **immutable** (cannot be changed or deleted)
- **Decentralized** (no single authority controls the data)
- **Transparent** (anyone can verify records)
- **Permanent** (records exist forever on the blockchain)

---

## 🔄 How It Works

### System Architecture

```
User → Website → Server → MongoDB (stores details)
                     ↓
                 Blockchain (stores proof)
```

### Step-by-Step Process

#### 1. **User Registration**
   - A tribal member creates an account with username and password
   - Password is encrypted and stored securely
   - Each user gets a unique account

#### 2. **Claim Submission**
   - User fills in land owner name
   - Uploads 4 required documents:
     - **Form B1** - Traditional land ownership form
     - **Form P2** - Additional ownership proof
     - **Aadhar Card** - Government ID
     - **Witness Proof** - Community witness document
   - Selects location on visual map (GPS coordinates)
   - System automatically generates a **Document Hash** (unique fingerprint)

#### 3. **Hash Generation**
   - All 4 PDF files are combined
   - SHA-256 algorithm creates a unique 64-character code
   - This hash proves these exact documents existed at this time
   - Hash is stored with the claim

#### 4. **Admin Review**
   - Gram Sabha admin logs in
   - Sees all pending claims in an expandable list
   - Reviews uploaded documents
   - Can approve legitimate claims

#### 5. **Blockchain Recording**
   - When admin approves, the system:
     - Converts document hash to a numeric Claim ID
     - Calls the smart contract on Ethereum
     - Records: Owner Name, GPS Location, Document Hash
     - Gets a Transaction Hash as proof
   - This transaction costs a small gas fee (paid from admin wallet)

#### 6. **Public Verification**
   - Anyone can enter the transaction hash
   - System fetches data from blockchain
   - Shows: Owner name, Location, Claim ID, Verification time
   - Provides Etherscan link for blockchain proof

---

## 👥 User Guide

### For Tribal Community Members (Users)

#### Step 1: Register
1. Go to the website
2. Click "Register"
3. Enter username and password
4. Click "Sign Up"

#### Step 2: Login
1. Click "Login"
2. Enter your username and password
3. You'll see your dashboard

#### Step 3: Submit a Land Claim
1. Click "Submit Claim" in navigation
2. Fill in the **Owner Name** (the person who owns the land)
3. Upload all 4 documents (PDF format only):
   - Form B1
   - Form P2
   - Aadhar Card
   - Witness Proof
4. Click the map to select your land location
   - A red marker will appear
   - GPS coordinates are automatically recorded
5. The **Document Hash** generates automatically
6. Click "Submit Claim"

#### Step 4: Track Your Claim
1. Go to "My Claims" dashboard
2. See all your submitted claims
3. Status will show:
   - **⏳ Pending** - Waiting for Gram Sabha review
   - **✓ Verified** - Approved and recorded on blockchain
4. For verified claims, click the Etherscan link to see blockchain proof
5. Dashboard auto-refreshes every 10 seconds

#### Step 5: Share Proof
- Copy the transaction hash from verified claims
- Share it with anyone who needs to verify ownership
- They can use the "Verify Claim" page

---

### For Gram Sabha (Admins)

#### Step 1: Admin Login
1. Use your admin credentials
2. Username: `PiyyyAdmin`
3. Password: `admin123`
4. You'll see the Admin Dashboard

#### Step 2: Review Pending Claims
1. See all pending claims as cards
2. Click on any claim to expand details
3. Review the information:
   - Owner Name
   - Location (GPS coordinates)
   - Document Hash
   - Uploaded Files (shows checkmarks for all 4 files)

#### Step 3: Verify Documents
- Check if all 4 documents are uploaded
- Verify the documents are legitimate
- Confirm the owner name is correct
- Ensure GPS location matches

#### Step 4: Approve Claim
1. If everything is valid, click "Approve"
2. System will:
   - Send data to blockchain
   - Wait for transaction confirmation (15-30 seconds)
   - Show success message
   - Remove claim from pending list
3. User will see "Verified" status in their dashboard

#### Important Notes for Admins:
- Approval is permanent and cannot be reversed
- Only approve legitimate claims with proper documentation
- Each approval costs a small gas fee (~$0.01-0.05)
- The blockchain wallet must have sufficient ETH balance

---

## 🔍 Public Verification (For Everyone)

Anyone can verify land claims - no login required!

### How to Verify:
1. Go to "Verify Claim" page
2. Enter the transaction hash (starts with 0x...)
3. Click "Verify on Blockchain"
4. System shows:
   - ✓ Valid/Invalid status
   - Owner Name
   - GPS Location
   - Claim ID
   - Verified By (Gram Sabha address)
   - Verification Time
   - Block Number
5. Click "View on Etherscan" for blockchain proof

### What Makes This Trustworthy?
- Data comes directly from Ethereum blockchain
- Cannot be faked or manipulated
- Timestamp proves when verification happened
- Etherscan provides independent confirmation

---

## 🎨 Design Philosophy

### Low-Bandwidth Friendly
- Minimal graphics and animations
- Small file sizes for faster loading
- Works on 2G/3G connections
- No heavy images or videos

### Color Scheme
- **Primary Green (#4CAF50)** - Represents nature and growth
- **Light Green Background (#F0FDF4)** - Easy on eyes, reduces eye strain
- **Dark Text (#1F2937)** - High contrast for readability
- Inspired by tribal connection to nature

### Visual Map
- Custom-designed map with gradient background
- Shows roads, trees, and landmarks
- Red marker for precise location selection
- No internet connection needed for map rendering

---

## 🔐 Security Features

### User Authentication
- Passwords are hashed with bcryptjs (cannot be read even by admins)
- JWT tokens expire after sessions
- Protected routes prevent unauthorized access

### Document Integrity
- SHA-256 hashing ensures documents haven't been tampered with
- Even a single pixel change creates a different hash
- Hash is stored both in MongoDB and blockchain

### Blockchain Security
- Smart contract has `onlyGramSabha` modifier
- Only authorized admin wallet can approve claims
- All transactions are signed and verified
- Records are immutable once written

---

## 📊 Smart Contract Details

### Contract Address
`0x1254CF82dc4bf13aD1dB722b6481641Dd11755F1` (Sepolia Testnet)

### Key Functions
- `recordVerifiedTitle()` - Records approved land claims
- `getLandTitle()` - Retrieves claim details by ID
- Emits `TitleVerified` event for tracking

### What Gets Stored on Blockchain?
- Claim ID (numeric, derived from document hash)
- Owner Name
- GPS Location (latitude, longitude)
- Document Hash (SHA-256)
- Verifier Address (Gram Sabha wallet)
- Timestamp (automatic)

---

## 🌐 Multilingual Support

The system includes a **Language Switcher** (English/हिंदी):
- Makes the platform accessible to Hindi speakers
- Preserves tribal languages and culture
- Can be expanded to include more languages

---

## 💡 Future Enhancements

### Planned Features
1. **OCR Scanner** - Auto-extract text from documents
2. **Mobile App** - Native Android/iOS applications
3. **Offline Mode** - Submit claims without internet, sync later
4. **Document Vault** - Encrypted storage for uploaded files
5. **SMS Notifications** - Alerts for claim status changes
6. **Dispute Resolution** - Community voting for contested claims
7. **Transfer of Ownership** - Record land sales on blockchain

---

## 📈 Benefits for Tribal Communities

### Immediate Benefits
✅ **Permanent Records** - Documents can never be lost
✅ **Transparency** - Everyone can verify ownership
✅ **Low Cost** - No expensive legal procedures
✅ **Accessibility** - Works on basic smartphones
✅ **Trust** - Blockchain removes need for intermediaries

### Long-Term Impact
🌱 **Land Protection** - Prevents illegal land grabs
🌱 **Legal Evidence** - Blockchain records accepted as proof
🌱 **Economic Empowerment** - Secure ownership enables loans/development
🌱 **Cultural Preservation** - Protects ancestral lands
🌱 **Community Control** - Gram Sabha maintains authority

---

## 🚀 Getting Started

### For Development
1. Clone the repository
2. Install dependencies: `npm install` in all folders
3. Set up MongoDB Atlas connection
4. Configure Ethereum wallet and RPC URL
5. Deploy smart contract: `cd contracts && npx hardhat run scripts/deploy.js`
6. Start backend: `cd server && npm start`
7. Start frontend: `cd client && npm run dev`

### Environment Variables Required
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SEPOLIA_RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_contract_address
```

---

## 📞 Support & Contact

For questions, issues, or suggestions:
- Check the README.md for technical documentation
- Review code comments for implementation details
- Contact the development team for support

---

## 🙏 Acknowledgments

This project is dedicated to tribal communities across India who have protected their lands for generations. Adhikar aims to provide modern tools while respecting traditional governance structures like the Gram Sabha.

**Together, we can protect tribal land rights through technology.**

---

*Built with ❤️ for tribal communities*
