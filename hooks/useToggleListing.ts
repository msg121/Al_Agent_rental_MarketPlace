'use client'
import { getMarketplaceContract, getTxUrl } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { toast } from 'sonner'
import { useTransactionStore } from '@/store/transactionStore'
import { getAuthorizedSigner } from '@/lib/authorizedSigner'

export function useToggleListing() {
  const { walletProvider, address, isConnected } = useWeb3()
  const setPending = useTransactionStore((state) => state.setPending)
  const triggerRefresh = useTransactionStore((state) => state.triggerRefresh)

  const toggleListing = async (agentId: bigint, isCurrentlyPaused: boolean): Promise<boolean> => {
    try {
      if (!walletProvider || !address || !isConnected) return false
      setPending(true, 'Waiting for signature in wallet...')

      const { signer } = await getAuthorizedSigner(walletProvider, address)
      const contract = getMarketplaceContract(signer)

      const tx = await contract.toggleListingStatus(agentId)
      setPending(true, 'Transaction processing on blockchain...', tx.hash)
      await tx.wait(1)

      setPending(false)
      triggerRefresh()
      toast.success(isCurrentlyPaused ? 'Agent resumed!' : 'Agent paused!', {
        description: isCurrentlyPaused 
          ? 'Your AI agent is now available for rent.' 
          : 'Your AI agent has been temporarily disabled.',
        action: { label: 'View Tx', onClick: () => window.open(getTxUrl(tx.hash), '_blank') },
      })
      return true
    } catch (error: unknown) {
      setPending(false)
      const code = (error as { code?: number | string })?.code
      if (code === 4001 || code === 'ACTION_REJECTED') toast.error('Transaction cancelled')
      else if (code === 4100) toast.error('Wallet authorization lost. Reconnect and try again.')
      else toast.error('Failed to update agent status. Please try again.')
      return false
    }
  }

  const loading = useTransactionStore((state) => state.isPending)
  return { toggleListing, loading }
}
