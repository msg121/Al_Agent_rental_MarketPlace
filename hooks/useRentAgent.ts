'use client'
import { parseUnits } from 'ethers'
import { getMarketplaceContract, getUsdtContract, CONTRACT_ADDRESS, getTxUrl } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { toast } from 'sonner'
import { getAuthorizedSigner } from '@/lib/authorizedSigner'
import { useTransactionStore } from '@/store/transactionStore'

export function useRentAgent() {
  const { walletProvider, address, isConnected } = useWeb3()
  const setPending = useTransactionStore((state) => state.setPending)
  const triggerRefresh = useTransactionStore((state) => state.triggerRefresh)

  const rentAgent = async (agentId: bigint, pricePerPeriod: bigint): Promise<boolean> => {
    try {
      if (!walletProvider || !address || !isConnected) return false
      setPending(true, 'Waiting for signature in wallet...')

      const { signer } = await getAuthorizedSigner(walletProvider, address)

      const usdtContract = getUsdtContract(signer)
      let marketplaceContract = getMarketplaceContract(signer)

      // Step 1: approve if current allowance is insufficient
      const allowance = await usdtContract.allowance(address, CONTRACT_ADDRESS)
      if ((allowance as bigint) < pricePerPeriod) {
        setPending(true, 'Approving USDT spend allowance...')
        const approveTx = await usdtContract.approve(CONTRACT_ADDRESS, pricePerPeriod)
        setPending(true, 'Processing USDT approval on blockchain...', approveTx.hash)
        await approveTx.wait(1)

        // Re-authorize after long wait — Opera/MetaMask returns 4100 without this
        const { signer: freshSigner } = await getAuthorizedSigner(walletProvider, address)
        marketplaceContract = getMarketplaceContract(freshSigner)
        setPending(true, 'Waiting for rental signature in wallet...')
      }

      // Step 2: rent the agent
      const tx = await marketplaceContract.rentAgent(agentId)
      setPending(true, 'Processing rental on blockchain...', tx.hash)
      await tx.wait(1)

      setPending(false)
      triggerRefresh()
      toast.success('Agent rented successfully!', {
        description: `You now have access to this AI agent`,
        action: { label: 'View Tx', onClick: () => window.open(getTxUrl(tx.hash), '_blank') },
      })
      return true
    } catch (error: unknown) {
      setPending(false)
      const code = (error as { code?: number | string })?.code
      if (code === 4001 || code === 'ACTION_REJECTED') toast.error('Transaction cancelled')
      else if (code === 4100) toast.error('Wallet authorization lost. Reconnect and try again.')
      else toast.error('Rental failed. Please try again.')
      return false
    }
  }

  const loading = useTransactionStore((state) => state.isPending)
  return { rentAgent, loading }
}
