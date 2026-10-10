'use client'

import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { useTransactionStore } from '@/store/transactionStore'
import { formatUsdt } from '@/lib/utils'

export type AppTransaction = {
  id: string
  date: string
  type: string
  agent: string
  fromTo: string
  amount: string
  status: string
  txHash: string
  fullHash: string
  isPositive: boolean
  timestamp: number
}

export function useTransactions() {
  const { address, isConnected } = useWeb3()
  const [transactions, setTransactions] = useState<AppTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)

  const fetchTxs = useCallback(async () => {
    if (!isConnected || !address || !CONTRACT_ADDRESS) return
    setIsLoading(true)
    try {
      const provider = getReadProvider()
      const contract = getMarketplaceContract(provider)
      
      const filter = contract.filters.FundsWithdrawn(address)
      
      // We fetch from the last 50000 blocks to avoid rate limits on public RPCs
      const logs = await contract.queryFilter(filter, -50000)
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const txs = await Promise.all(logs.map(async (log: any) => {
        const block = await log.getBlock()
        const dateObj = new Date(block.timestamp * 1000)
        
        return {
          id: log.transactionHash,
          date: dateObj.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'Withdrawal',
          agent: 'Platform',
          fromTo: address.substring(0, 6) + '...' + address.substring(address.length - 4),
          amount: `- ${formatUsdt(log.args[1])} M`,
          status: 'Completed',
          txHash: log.transactionHash.substring(0, 6) + '...' + log.transactionHash.substring(log.transactionHash.length - 4),
          fullHash: log.transactionHash,
          isPositive: false,
          timestamp: block.timestamp
        }
      }))
      
      txs.sort((a, b) => b.timestamp - a.timestamp)
      setTransactions(txs)
    } catch (e) {
      console.error("Failed to fetch transactions:", e)
      // Fallback or just empty
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    fetchTxs()
  }, [fetchTxs, refreshTrigger])

  return { transactions, isLoading }
}
