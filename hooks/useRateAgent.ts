'use client'
import { getMarketplaceContract, getTxUrl } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { toast } from 'sonner'
import { useTransactionStore } from '@/store/transactionStore'
import { getAuthorizedSigner } from '@/lib/authorizedSigner'

export function useRateAgent() {
  const { walletProvider, address, isConnected } = useWeb3()
  const setPending = useTransactionStore((state) => state.setPending)
  const triggerRefresh = useTransactionStore((state) => state.triggerRefresh)

  const rateAgent = async (agentId: bigint, rating: number): Promise<boolean> => {
    try {
      if (!walletProvider || !address || !isConnected) return false
      setPending(true, 'Waiting for signature in wallet...')

      const { signer } = await getAuthorizedSigner(walletProvider, address)
      const contract = getMarketplaceContract(signer)

      const tx = await contract.rateAgent(agentId, rating)
      setPending(true, 'Submitting rating on blockchain...', tx.hash)
      await tx.wait(1)

      setPending(false)
      triggerRefresh()
      toast.success('Rating submitted!', {
        description: `You rated this agent ${rating}/5 stars`,
        action: { label: 'View Tx', onClick: () => window.open(getTxUrl(tx.hash), '_blank') },
      })
      return true
    } catch (error: unknown) {
      setPending(false)
      const code = (error as { code?: number | string })?.code
      if (code === 4001 || code === 'ACTION_REJECTED') toast.error('Transaction cancelled')
      else if (code === 4100) toast.error('Wallet authorization lost. Reconnect and try again.')
      else {
        const msg = (error as Error)?.message || ''
        if (msg.includes('No quota')) toast.error('No rating quota remaining for this agent')
        else toast.error('Rating failed. Please try again.')
      }
      return false
    }
  }

  const loading = useTransactionStore((state) => state.isPending)
  return { rateAgent, loading }
}
