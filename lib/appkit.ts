'use client'
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { sepolia } from '@reown/appkit/networks'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''

const ethersAdapter = new EthersAdapter()

createAppKit({
  adapters: [ethersAdapter],
  networks: [sepolia],
  defaultNetwork: sepolia,
  projectId,
  // Keep wallet selection deterministic: single injected provider path only.
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  enableWalletConnect: true,
  allWallets: 'SHOW',
  featuredWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
  metadata: {
    name: 'AgentHub',
    description: 'AI Agent Rental Marketplace on Blockchain',
    url: 'http://localhost:3000',
    icons: [],
  },
  features: {
    analytics: false,
    allWallets: true,
    email: false,
    socials: [],
  },
  themeMode: 'dark',
})
