'use client'
import { useState } from 'react'
import { parseUnits } from 'ethers'
import { getMarketplaceContract, getTxUrl } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { toast } from 'sonner'
import { useTransactionStore } from '@/store/transactionStore'
import type { RegisterAgentFormData } from '@/lib/validations'
import { getAuthorizedSigner } from '@/lib/authorizedSigner'

export function useRegisterAgent() {
  const { walletProvider, address, isConnected } = useWeb3()
  const [isSuccess, setIsSuccess] = useState(false)
  const setPending = useTransactionStore((state) => state.setPending)
  const triggerRefresh = useTransactionStore((state) => state.triggerRefresh)

  const registerAgent = async (data: RegisterAgentFormData): Promise<boolean> => {
    try {
      if (!walletProvider || !address || !isConnected) return false
      setPending(true, 'Waiting for signature in wallet...')

      const { signer } = await getAuthorizedSigner(walletProvider, address)
      const contract = getMarketplaceContract(signer)

      // Build metadataURI as JSON string
      const metadataURI = JSON.stringify({
        name: data.name,
        description: data.description,
        category: data.category,
        image: '',
      })

      const tx = await contract.registerAgent(
        metadataURI,
        data.accessInfo,
        parseUnits(data.priceUsdt, 6),
        BigInt(data.durationDays),
      )
      setPending(true, 'Transaction processing on blockchain...', tx.hash)
      await tx.wait(1)

      setIsSuccess(true)
      setPending(false)
      triggerRefresh()
      toast.success('Agent registered!', {
        description: 'Your AI agent is now listed on the marketplace',
        action: { label: 'View Tx', onClick: () => window.open(getTxUrl(tx.hash), '_blank') },
      })
      return true
    } catch (error: unknown) {
      setPending(false)
      const code = (error as { code?: number | string })?.code
      if (code === 4001 || code === 'ACTION_REJECTED') toast.error('Transaction cancelled')
      else if (code === 4100) toast.error('Wallet authorization lost. Reconnect and try again.')
      else toast.error('Registration failed. Please try again.')
      return false
    }
  }

  const loading = useTransactionStore((state) => state.isPending)
  return { registerAgent, loading, isSuccess }
}
