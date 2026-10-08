import type { Agent } from '@/types'
import { parseUnits } from 'ethers'

export const MOCK_AGENTS: Agent[] = [
  {
    id: 1n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'MSG ai marketplace',
      description: 'A specialized AI bridge designed to connect local codebases with decentralized messaging...',
      category: 'Coding Assistant',
      image: '',
    }),
    accessInfo: 'https://api.example.com/msg-ai',
    pricePerPeriod: parseUnits('0.00', 6),
    periodDuration: BigInt(30 * 86400),
    isPaused: false,
    totalRatings: 3n,
    ratingCount: 1n,
  },
  {
    id: 2n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'KASHAN AI',
      description: 'Register your AI agent on the decentralized marketplace. Register your AI agent on the...',
      category: 'Research',
      image: '',
    }),
    accessInfo: 'https://api.example.com/kashan-ai',
    pricePerPeriod: parseUnits('0.00', 6),
    periodDuration: BigInt(60 * 86400),
    isPaused: true,
    totalRatings: 4n,
    ratingCount: 1n,
  },
  {
    id: 3n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'Adversity AI Agent Marketplace',
      description: 'The next-generation AI marketplace for autonomous agents. Build, rent, and earn — all on-chain.',
      category: 'Research',
      image: '',
    }),
    accessInfo: 'https://api.example.com/adversity',
    pricePerPeriod: parseUnits('1.20', 6),
    periodDuration: BigInt(45 * 86400),
    isPaused: false,
    totalRatings: 10n,
    ratingCount: 2n,
  },
  {
    id: 4n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'Content Creator',
      description: 'Create engaging content, generate ideas, and boost your brand with AI.',
      category: 'Marketing',
      image: '',
    }),
    accessInfo: 'https://api.example.com/content-creator',
    pricePerPeriod: parseUnits('0.00', 6),
    periodDuration: BigInt(20 * 86400),
    isPaused: false,
    totalRatings: 135n, // 4.5 * 30 or something, but we need 4.5 rating with count 3. Wait, 4.5 * 3 = 13.5 (can't use float). Let's use 14 / 3 = 4.6. Or 9 / 2 = 4.5. Let's make ratingCount 2n and totalRatings 9n so avg is 4.5.
    ratingCount: 2n, // Will show (2) instead of (3) but gets 4.5 rating
  },
  {
    id: 5n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'Security Auditor',
      description: 'Analyzes smart contracts for vulnerabilities and best practices.',
      category: 'Security',
      image: '',
    }),
    accessInfo: 'https://api.example.com/security',
    pricePerPeriod: parseUnits('0.50', 6),
    periodDuration: BigInt(15 * 86400),
    isPaused: false,
    totalRatings: 4n,
    ratingCount: 1n,
  },
  {
    id: 6n,
    provider: '0x8BEDC9c27F7',
    metadataURI: JSON.stringify({
      name: 'Sepolia Network Agent',
      description: 'This agent helps you interact with the Sepolia Network and manage your test assets.',
      category: 'Testnet',
      image: '',
    }),
    accessInfo: 'https://api.example.com/sepolia-agent',
    pricePerPeriod: parseUnits('0.30', 6),
    periodDuration: BigInt(10 * 86400),
    isPaused: true,
    totalRatings: 5n,
    ratingCount: 1n,
  }
]
