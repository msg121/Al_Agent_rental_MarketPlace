'use client'
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect, useAppKitNetwork } from '@reown/appkit/react'
import type { Eip1193Provider } from 'ethers'
import { SUPPORTED_CHAIN_ID } from '@/lib/contract'

export function useWeb3() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider<Eip1193Provider>('eip155')
  const { disconnect } = useDisconnect()

  const chainId = caipNetwork
    ? Number(String(caipNetwork.id).includes(':') ? String(caipNetwork.id).split(':').pop() : caipNetwork.id)
    : undefined
  const isCorrectNetwork = chainId === SUPPORTED_CHAIN_ID
  
  // Extract the actual hex address if it's in CAIP-10 format (e.g., eip155:1:0x...)
  const parsedAddress = address
    ? (address.includes(':') ? address.split(':').pop() : address)
    : undefined

  return {
    address: parsedAddress as string | undefined,
    isConnected,
    chainId,
    isCorrectNetwork,
    walletProvider,
    openModal: (options?: { view?: 'Account' | 'Connect' | 'Networks' | 'ApproveTransaction' | 'OnRampProviders' }) => open(options),
    disconnect,
  }
}
