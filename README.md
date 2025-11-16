![HASHMAP Github Banner](https://github.com/user-attachments/assets/1987d028-7be4-4597-8ff9-5bccfa974ec7)
`NOTE: Merging the branch(es) and re-arranging the repo, adding images is done later, the project was finished and deployed during the hackathon deadline.`

# ADHIKAR - Decentralized Tribal Land Registry
A Web3 + MERN + AI solution to fight corruption and secure ancestral land rights for India's 100 million tribal citizens.

## PROJECT DEMO 📽️
Watch our 3-minute presentation and demo of the complete application, from user submission to council approval and on-chain verification.
[Watch the video](https://youtu.be/zKi49ZAPVpI)

## THE PROBLEM
> In regions surrounding the Udanti–Sitanadi Tiger Reserve, tribal communities are facing land surveys and demarcations that many fear could lead to forced relocations, potentially violating the Forest Rights Act and bypassing Gram Sabha consent. Historically, land ownership records in rural Chhattisgarh have been vulnerable to manipulation, loss, and bureaucratic delays, leaving indigenous communities without verifiable proof of their ancestral rights.
Your challenge is to design a decentralized, blockchain-powered land registry system that ensures transparency, immutability, and community control over land records—preserving tribal rights and preventing unlawful displacement.

## 🏆 THE SOLUTION: Decentralised Governance
We asked: What if no single person could approve a claim?
Adhikar is our answer. We replace the single, vulnerable official with a 5-member Gram Sabha (community) council. To verify a land claim, you now need 5 independent, on-chain digital signatures. <br>

This **"5-of-5"** multi-signature model makes corruption economically unfeasible. You can't bribe one person; you'd have to bribe the entire council. This simple change moves the system from a single point of failure to a democratic, decentralised, and incorruptible foundation

## 🖼️ PROJECT SCREENSHOTS

## HOW IT WORKS?
A Step-by-Step Flow

- **User Submits Claim**: A farmer ("Ramesh") logs in and fills out the claim form. He uploads his 4 key documents (Form B1, P2, Aadhar, Witness Proof).
- **AI & Hashing**: The system's AI-OCR (placeholder) reads the documents, and an interactive map helps him pin his exact GPS location. A unique SHA-256 hash ("digital fingerprint") is generated from his documents.
- **Council Review**: The claim now appears on the dashboard of all 5 Gram Sabha council members. The status is "Pending (0/5 Votes)".
- **Democratic Voting**: Each member reviews the claim and its documents independently. As they vote, the status updates for everyone: "Pending (1/5 Votes)", "Pending (2/5 Votes)", and so on.
- **Smart Contract Execution**: When the 5th member casts the final, deciding vote, the threshold is met. The backend automatically calls the smart contract, which executes and records the claim's verified data (owner, hash, location) permanently onto the Ethereum blockchain.
- **Public Verification**: Ramesh's dashboard updates to "Verified ✓" with a link to the Etherscan transaction. Now, anyone (a bank, a buyer, or another office) can instantly verify his ownership on our website or via our Telegram Bot, with no login required.

## 🚀 Core Features

### 👤 User Features

* Secure registration & login (JWT-based authentication).
* Multi-document upload (4 required proofs).
* Client-side **SHA-256** hashing to ensure integrity before upload.
* Interactive GPS map picker to choose precise coordinates.
* AI OCR scanner (placeholder) to auto-fill parts of the form.
* Real-time dashboard with automatic status polling (e.g., "Pending 2/5 Votes").
* Direct Etherscan link for verified claims.

### 👨‍💼 Admin (Gram Sabha Council) Features

* Role-based access for council members.
* Pending claims dashboard to review all unvoted claims.
* Expandable claim details: owner, GPS, hash, filenames of uploaded docs.
* "Vote to Approve" button that logs member votes.
* Automatic smart contract execution on the 5th (final) vote.
* Success notifications including transaction hash.

### 🌎 Public & Accessibility Features

* Public verification page (no login) to validate claims using transaction hash.
* Telegram Bot integration: `/verify <hash>` for low-bandwidth users.
* Low-bandwidth frontend design built with TailwindCSS (mobile-first).
* Multi-language placeholder (English/Hindi toggle planned).

---

## 🛠️ Tech Stack

| Component      | Technology                                          |
| -------------- | --------------------------------------------------- |
| Frontend       | React 18, Vite, React Router v6, TailwindCSS, Axios |
| Backend        | Node.js, Express, MongoDB (Mongoose)                |
| Authentication | JSON Web Tokens (JWT), bcrypt                       |
| Blockchain     | Solidity (v0.8.20), Hardhat                         |
| Web3 Lib       | Ethers.js v6, Ethereum (Sepolia Testnet)            |
| Bot            | node-telegram-bot-api                               |
| Dev/Build      | npm, Hardhat, Vercel (for deployment)               |

---

## 📁 Project Structure

```
/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Node.js/Express backend (MERN)
├── contracts/       # Hardhat/Solidity smart contracts
└── README.md
```

---

## ⚙️ Setup and Deployment (For Developers)

Follow these steps to run the project locally.

### Prerequisites

* Node.js v20.x or later
* npm / yarn
* MongoDB (local or Atlas)
* A Web3 wallet (MetaMask)
* Sepolia ETH (from a faucet)
* An Alchemy or Infura RPC URL

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_REPO/adhikar.git
cd adhikar
```

### 2. Configure Environment Variables

Create `.env` files in three places.

#### A) `contracts/.env`

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY_FOR_DEPLOYMENT
```

#### B) `server/.env`

```bash
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MIN_32_CHARS_LONG
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_SERVER_WALLET_PRIVATE_KEY_FOR_TRANSACTIONS
CONTRACT_ADDRESS=THE_ADDRESS_FROM_STEP_4
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
```

#### C) `client/.env`

```bash
VITE_SERVER_URL=http://localhost:5000
```

### 3. Install Dependencies

Run `npm install` in each directory.

```bash
# In root
npm install

# In /contracts
cd contracts && npm install

# In /server
cd ../server && npm install

# In /client
cd ../client && npm install
```

### 4. Deploy the Smart Contract (to get CONTRACT_ADDRESS)

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Output example: `LandRegistry deployed to: 0x...`
Copy this address into `server/.env` as `CONTRACT_ADDRESS`.

### 5. Start the Application

Open two terminals.

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
# App opens on http://localhost:5173 (or similar)
```

### 6. Create Admin / Council Accounts

Register five new users through the frontend, then update their roles in MongoDB manually.

Example MongoDB query to set a user as admin:

```js
db.users.updateOne(
  { username: "council_member_1" },
  { $set: { role: "admin" } }
)
```

---

## 🗺️ Future Roadmap

* Full Tesseract.js OCR integration, WhatsApp Bot.
* Integration with official government registries and migration to a low-cost L2 (e.g., Polygon) for minimal transaction costs.

---

## ⚠️ Notes & Helpful Tips

* If you hit Sepolia faucet issues requiring mainnet ETH, try alternative Sepolia faucets or use a local test RPC (Hardhat/Anvil) for development deployments.
* Keep private keys out of source control. Use secure secret managers for production.

---

## THANK YOU

Made with ❤️ by Team HASHMAP for Hack-A-Sol 4.0
