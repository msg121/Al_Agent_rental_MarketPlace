export interface Agent {
  id: bigint
  provider: string
  metadataURI: string
  accessInfo: string
  pricePerPeriod: bigint   // USDT in 6-decimal units
  periodDuration: bigint   // seconds
  isPaused: boolean
  totalRatings: bigint
  ratingCount: bigint
}

export interface Rental {
  renter: string
  startTime: bigint
  expiryTime: bigint
  allowedRatingsCount: bigint
}

/**
 * Parsed from metadataURI JSON string.
 * Example: { name: "GPT-4 Assistant", description: "...", category: "coding", image: "" }
 */
export interface AgentMetadata {
  name: string
  description: string
  category: string
  image?: string
}
