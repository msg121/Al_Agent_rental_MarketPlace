# 🤖 AgentHub: Decentralized AI Agent Marketplace

![AgentHub Banner](https://img.shields.io/badge/AgentHub-Web3%20AI%20Marketplace-cyan?style=for-the-badge) 
![Ethereum Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge)
![IPFS/Pinata](https://img.shields.io/badge/Storage-IPFS%20Pinata-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge)

AgentHub is a premium, fully decentralized Web3 marketplace built for renting and listing AI Agents. We bridge the gap between AI developers and users by providing a transparent, trustless, and smart-contract-powered platform.

## 🚀 The Problem & Our Solution
Centralized AI marketplaces take huge cuts, lack transparency, and control user data. **AgentHub solves this** by executing all logic on-chain. Developers list their AI models directly, metadata is immutably stored on IPFS, and users rent agents securely via our custom ERC-20 `M` Token. 
**No Middlemen. No Hidden Fees. Pure Web3.**

## ✨ Key Features
- **Smart Contract Escrow:** Rental agreements are handled by an Ethereum (Sepolia) smart contract. Payments are secure, transparent, and instantly credited to developers.
- **Decentralized Storage (IPFS):** Agent metadata (Name, Category, Description) is pinned to IPFS via Pinata.
- **Encrypted Access:** API keys and access endpoints are securely managed and only revealed to active renters.
- **Tokenized Economy:** Uses a custom ERC-20 `M` Token for instant, borderless payments.
- **Trustless Rating System:** Only users with a valid on-chain rental history can review an agent, completely eliminating fake reviews.
- **Premium Glassmorphism UI:** Built with Next.js, TailwindCSS, and Framer Motion for a stunning, futuristic user experience.

## 🏗️ Architecture Flow
1. **List:** Developer lists an AI agent -> Metadata uploads to IPFS -> Agent is registered on the Sepolia Smart Contract.
2. **Rent:** User browses agents -> Connects MetaMask -> Pays `M` Tokens -> Smart contract assigns active rental status.
3. **Earn & Withdraw:** Developer tracks earnings on their dashboard -> Withdraws accumulated `M` Tokens directly to their wallet.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, React, TailwindCSS, Framer Motion, Lucide Icons
- **Blockchain/Web3:** Solidity, ethers.js, MetaMask integration
- **Storage:** IPFS (via Pinata Dedicated Gateway)

## 💻 Running Locally

1. Clone the repository:
```bash
git clone https://github.com/your-username/AgentHub.git
cd AgentHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`.env.local`):
```env
NEXT_PUBLIC_PINATA_GATEWAY_URL=your_pinata_gateway
```

4. Run the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with the marketplace.

## 🌟 Roadmap (What's Next?)
- **Phase 1 (Live):** Sepolia Testnet deployment, IPFS integration, Glassmorphism UI, full rental flow.
- **Phase 2 (In-Progress):** Integration of an on-chain 24/7 AI Customer Support Agent to assist Web3 users.
- **Phase 3:** Deployment to Ethereum Mainnet, Arbitrum, and Polygon. Support for multi-token payments.

## 🤝 Built By
**MSG** - Web3 & AI Developer  
*Developed specifically for showcasing at Web3 Hackathons.*
