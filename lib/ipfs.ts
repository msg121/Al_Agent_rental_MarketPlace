import { AgentMetadata } from '@/types'

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY ?? ''
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY ?? ''
const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? 'https://gateway.pinata.cloud/ipfs/'
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN ?? ''

/**
 * Uploads Agent metadata to Pinata (IPFS)
 * @param metadata The agent metadata object
 * @returns The IPFS URI (e.g. ipfs://Qm...)
 */
export async function uploadMetadata(metadata: AgentMetadata): Promise<string> {
  // Since AgentCard and other components parse metadata synchronously,
  // we return the JSON stringified metadata directly instead of an IPFS URI.
  return JSON.stringify(metadata)
}

/**
 * Fetches Agent metadata from IPFS via Pinata Gateway
 * @param uri The IPFS URI (e.g. ipfs://Qm...)
 * @returns The parsed AgentMetadata
 */
export async function fetchMetadata(uri: string): Promise<AgentMetadata> {
  if (!uri || uri.trim() === '') {
    throw new Error('Invalid URI provided for metadata')
  }

  // Handle both ipfs:// prefix and raw CIDs
  const cid = uri.replace('ipfs://', '')
  const tokenParam = GATEWAY_TOKEN ? `?pinataGatewayToken=${GATEWAY_TOKEN}` : ''
  const fetchUrl = `${GATEWAY}${cid}${tokenParam}`

  const res = await fetch(fetchUrl)
  
  if (!res.ok) {
    throw new Error('Failed to fetch agent metadata')
  }
  
  return res.json()
}
