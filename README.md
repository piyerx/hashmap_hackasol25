*(Project Under Development)*

# Adhikar - Decentralized Tribal Land Registry

A complete MERN + Web3 application for tribal communities to submit and verify land claims on the blockchain.

## Project Structure

```
hashmap_draft/
├── client/          # React frontend with TailwindCSS
├── server/          # Node.js/Express backend
├── contracts/       # Hardhat/Solidity smart contracts
└── README.md
```

## Features

- **User Authentication**: JWT-based auth for Users and Admins (Gram Sabha)
- **Land Claim Submission**: Users can submit land claims with GPS coordinates and document hashes
- **Admin Approval**: Gram Sabha can review and approve claims, recording them on blockchain
- **Blockchain Integration**: Verified claims are permanently recorded on Ethereum (Sepolia testnet)
- **Public Verification**: Anyone can verify claims using blockchain transaction hashes
- **AI OCR Scanner**: Placeholder for document text extraction (Tesseract.js)
- **GPS Map Picker**: Interactive map for location selection
- **Multi-language Support**: Language switcher (English/Hindi)

## Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Vite
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Ethers.js v6

### Blockchain
- Solidity 0.8.20
- Hardhat
- Ethereum Sepolia Testnet

## Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MongoDB (local or Atlas)
- MetaMask or similar Web3 wallet
- Infura/Alchemy account for Sepolia RPC

### 1. Install Dependencies

```powershell
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install contracts dependencies
cd ../contracts
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both `server/` and `contracts/` directories:

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adhikar
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_ethereum_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

**contracts/.env**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_ethereum_private_key_here
```

### 3. Deploy Smart Contract

```powershell
cd contracts
npm run compile
npm run deploy
# Copy the CONTRACT_ADDRESS from output to server/.env
```

### 4. Start the Application

**Terminal 1 - Start MongoDB** (if running locally)
```powershell
mongod
```

**Terminal 2 - Start Backend**
```powershell
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 3 - Start Frontend**
```powershell
cd client
npm run dev
# Client runs on http://localhost:3000
```

## Usage Guide

### For Users (Community Members)

1. **Register**: Create an account at `/register`
2. **Login**: Sign in at `/login`
3. **Submit Claim**: 
   - Navigate to "Submit Claim"
   - Use OCR scanner to extract owner name from documents
   - Use map picker to select GPS coordinates
   - Enter document hash (SHA-256 of land documents)
   - Submit the claim
4. **Track Claims**: View all your claims and their status on the dashboard

### For Admins (Gram Sabha)

1. **Login**: Sign in with admin credentials
2. **Review Claims**: View all pending claims on admin dashboard
3. **Approve Claims**: 
   - Click "Approve" on valid claims
   - System records the claim on blockchain
   - User receives transaction hash as proof

### Public Verification

- Anyone can visit `/verify` page
- Enter a blockchain transaction hash
- System verifies if the claim exists on-chain

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin

### Claims (Protected)
- `POST /api/claims/submit` - Submit new claim (User only)
- `GET /api/claims/my-claims` - Get user's claims (User only)
- `GET /api/claims/pending` - Get pending claims (Admin only)
- `PUT /api/claims/approve/:claimId` - Approve claim (Admin only)

## Smart Contract Functions

### LandRegistry.sol

- `recordVerifiedTitle(claimId, ownerName, location, documentHash)` - Records verified claim (only Gram Sabha)
- `getLandTitle(claimId)` - Retrieves claim details
- `getTotalVerifiedClaims()` - Returns count of verified claims
- `transferGramSabhaRole(newAddress)` - Transfer admin role

## Color Palette

- Primary (Dark Green): `#4CAF50`
- Background (Light Green): `#F0FDF4`
- Text (Dark Grey): `#1F2937`

## Creating Admin Account

To create an admin account, register normally then update the user in MongoDB:

```javascript
db.users.updateOne(
  { username: "admin_username" },
  { $set: { role: "admin" } }
)
```

## Security Notes

- Never commit `.env` files
- Keep private keys secure
- Use environment variables for sensitive data
- Hash document contents before storing hashes
- Validate all inputs on both client and server

## Future Enhancements

- Implement actual OCR with Tesseract.js
- Integrate real map API (Google Maps/OpenStreetMap)
- Add document upload to IPFS
- Multi-language translation system
- Mobile app version
- Batch claim processing

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
