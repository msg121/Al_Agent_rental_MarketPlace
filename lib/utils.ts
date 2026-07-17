import { formatUnits } from 'ethers'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AgentMetadata } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

import { USDT_DECIMALS } from '@/lib/contract'

// Token uses specified decimals (usually 18 for test tokens, 6 for real USDT)
export function formatUsdt(amount: bigint, decimals = 2): string {
  return parseFloat(formatUnits(amount, USDT_DECIMALS)).toFixed(decimals)
}

export function getDaysFromSeconds(seconds: bigint): number {
  return Number(seconds / 86400n)
}

export function getTimeRemaining(expiryTime: bigint): { days: number; hours: number; expired: boolean } {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (expiryTime <= now) return { days: 0, hours: 0, expired: true }
  const remaining = Number(expiryTime - now)
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    expired: false,
  }
}

export function timeAgo(timestamp: bigint): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const seconds = Number(BigInt(Math.floor(Date.now() / 1000)) - timestamp)
  if (seconds < 60) return rtf.format(-seconds, 'second')
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute')
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour')
  return rtf.format(-Math.floor(seconds / 86400), 'day')
}

export function formatDate(unixSeconds: bigint | number): string {
  return new Date(Number(unixSeconds) * 1000).toLocaleString()
}

export function isValidUsdtAmount(amount: string): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num >= 1 && num <= 100000
}

/**
 * Parse the metadataURI JSON string into AgentMetadata.
 * Falls back to defaults if the JSON is invalid.
 */
export function parseMetadata(metadataURI: string): AgentMetadata {
  try {
    const parsed = JSON.parse(metadataURI)
    return {
      name: parsed.name || 'Unnamed Agent',
      description: parsed.description || 'No description provided.',
      category: parsed.category || 'Other',
      image: parsed.image || '',
    }
  } catch {
    return {
      name: 'Unnamed Agent',
      description: metadataURI || 'No description provided.',
      category: 'Other',
      image: '',
    }
  }
}

/**
 * Get star rating from on-chain totalRatings / ratingCount
 */
export function getAverageRating(totalRatings: bigint, ratingCount: bigint): number {
  if (ratingCount === 0n) return 0
  return Number(totalRatings) / Number(ratingCount)
}

/**
 * Get a category-specific gradient for agent cards
 */
export function getCategoryGradient(category: string): string {
  const map: Record<string, string> = {
    'Coding Assistant': 'from-violet-500/20 to-indigo-500/20',
    'Image Generation': 'from-pink-500/20 to-rose-500/20',
    'Text Generation': 'from-blue-500/20 to-cyan-500/20',
    'Data Analysis': 'from-emerald-500/20 to-teal-500/20',
    'Translation': 'from-amber-500/20 to-yellow-500/20',
    'Customer Support': 'from-orange-500/20 to-red-500/20',
    'Research': 'from-purple-500/20 to-fuchsia-500/20',
  }
  return map[category] || 'from-slate-500/20 to-gray-500/20'
}

/**
 * Get a category-specific icon color
 */
export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    'Coding Assistant': 'text-violet-400',
    'Image Generation': 'text-pink-400',
    'Text Generation': 'text-blue-400',
    'Data Analysis': 'text-emerald-400',
    'Translation': 'text-amber-400',
    'Customer Support': 'text-orange-400',
    'Research': 'text-purple-400',
  }
  return map[category] || 'text-gray-400'
}
