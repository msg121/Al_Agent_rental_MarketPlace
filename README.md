# AI Agent Rental Marketplace

A decentralized platform for providing and renting AI agents on the blockchain.

## Overview

**AI Agent Rental Marketplace** is a Web3 decentralized application (dApp) that connects AI agent creators with users looking to rent their capabilities. Powered by a Solidity smart contract, all payments, rental durations, and access rights are managed securely and transparently on the blockchain without any middlemen.

## Features

- **List Your Agents**: Providers can register their AI agents with a name, description, price per rental period, and access details (like an API key or URL).
- **Rent Agents**: Users can browse active agents and rent them using ERC-20 tokens (e.g., USDT). Once rented, they unlock the agent's access information for the specified duration.
- **Secure Access Verification**: The smart contract verifies if a user has an active, unexpired rental before returning the private access info.
- **Rating System**: After renting an agent, users can leave a 1-5 star rating. This helps the community identify the most reliable and useful AI agents.
- **Withdraw Earnings**: Providers can withdraw their accumulated rental earnings directly to their connected wallets at any time. The platform handles a configurable platform fee automatically.
- **Agent Management**: Providers retain full control over their agents and can update pricing or pause/unpause their listings.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: `ethers.js` v6
- **Wallet Connection**: Reown AppKit (`@reown/appkit`)
- **Smart Contract**: Solidity (`AIAgentRentalMarketplace.sol`)
- **Network**: Ethereum Sepolia Testnet

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- A Web3 Wallet (like MetaMask)
- Sepolia Testnet ETH (for gas fees)
- Mock USDT (for renting agents)

### 1. Clone & Install Dependencies

```bash
git clone <repository_url>
cd Al_Agent_rental_MarketPlace
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following keys. You can get a WalletConnect Project ID from [cloud.reown.com](https://cloud.reown.com/).

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_reown_project_id"
NEXT_PUBLIC_CONTRACT_ADDRESS="your_deployed_marketplace_contract_address"
NEXT_PUBLIC_USDT_ADDRESS="your_deployed_erc20_token_address"
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
NEXT_PUBLIC_EXPLORER_URL="https://sepolia.etherscan.io"
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

## Smart Contract Structure

The main logic resides in `contracts/AIAgentRentalMarketplace.sol`.

### Key Functions
- `registerAgent()`: Creates a new AI agent listing.
- `rentAgent()`: Transfers the payment token from the renter to the contract, locking the rental period.
- `getAccessInfo()`: A read function that verifies the caller's rental expiry before returning the private access URL/key.
- `rateAgent()`: Allows a verified renter to rate the agent.
- `withdraw()`: Allows providers to claim their earnings and the owner to collect platform fees.
- `updateAgent()` & `toggleListingStatus()`: Allows the provider to manage their listings.
