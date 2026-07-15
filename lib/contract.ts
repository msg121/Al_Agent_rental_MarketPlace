import { JsonRpcProvider, Contract } from 'ethers'

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''
export const USDT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS ?? ''
export const SUPPORTED_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '11155111')
export const USDT_DECIMALS = 6

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? 'https://rpc.sepolia.org'
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://sepolia.etherscan.io'

/** Read-only provider (no wallet needed) */
export function getReadProvider() {
  return new JsonRpcProvider(RPC_URL)
}

export function getTxUrl(hash: string) {
  return `${EXPLORER_URL}/tx/${hash}`
}

export function getAddressUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`
}

// ── USDT ERC-20 ABI ─────────────────────────────────────────────────────────

export const USDT_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function faucet()',
] as const

// ── AI Agent Rental Marketplace ABI ─────────────────────────────────────────

export const MARKETPLACE_ABI = [
  // Read functions
  'function owner() view returns (address)',
  'function paymentToken() view returns (address)',
  'function platformFeePercent() view returns (uint256)',
  'function totalAgents() view returns (uint256)',
  'function totalPlatformFees() view returns (uint256)',
  'function agents(uint256 agentId) view returns (uint256 id, address provider, string metadataURI, string accessInfo, uint256 pricePerPeriod, uint256 periodDuration, bool isPaused, uint256 totalRatings, uint256 ratingCount)',
  'function rentals(uint256 agentId, address renter) view returns (address renter, uint256 startTime, uint256 expiryTime, uint256 allowedRatingsCount)',
  'function earnings(address user) view returns (uint256)',
  'function getAccessInfo(uint256 agentId) view returns (string)',
  'function getAverageRating(uint256 agentId) view returns (uint256)',

  // Write functions
  'function registerAgent(string metadataURI, string accessInfo, uint256 pricePerPeriod, uint256 durationInDays)',
  'function rentAgent(uint256 agentId)',
  'function rateAgent(uint256 agentId, uint8 rating)',
  'function withdraw()',
  'function updateAgent(uint256 agentId, uint256 newPrice, bool isPaused)',
  'function toggleListingStatus(uint256 agentId)',
  'function setPlatformFeePercent(uint256 newFeePercent)',
] as const

// ── Contract factory functions ──────────────────────────────────────────────

export function getMarketplaceContract(signerOrProvider: ConstructorParameters<typeof Contract>[2]) {
  return new Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, signerOrProvider)
}

export function getUsdtContract(signerOrProvider: ConstructorParameters<typeof Contract>[2]) {
  return new Contract(USDT_TOKEN_ADDRESS, USDT_ABI, signerOrProvider)
}
