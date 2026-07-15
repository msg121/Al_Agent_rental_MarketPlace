'use client'

import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { useTransactionStore } from '@/store/transactionStore'
import { formatUsdt } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, TrendingUp } from 'lucide-react'

export function EarningsCard() {
  const { address, isConnected } = useWeb3()
  const [earnings, setEarnings] = useState(0n)
  const [isLoading, setIsLoading] = useState(false)
  const useMock = !CONTRACT_ADDRESS

  const fetchEarnings = useCallback(async () => {
    if (useMock || !isConnected || !address) return
    setIsLoading(true)
    try {
      const contract = getMarketplaceContract(getReadProvider())
      const result = await contract.earnings(address)
      setEarnings(result as bigint)
    } catch (e) {
      console.error('fetchEarnings:', e)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, isConnected, address])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchEarnings() }, [fetchEarnings, refreshTrigger])

  return (
    <Card className="bg-card/50 border-border/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 border border-primary/20">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Available Earnings</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {isLoading ? '...' : `${formatUsdt(earnings)} USDT`}
            </div>
          </div>
        </div>
        {earnings > 0n && (
          <div className="flex items-center gap-1.5 text-xs text-success">
            <TrendingUp className="h-3 w-3" />
            <span>Ready to withdraw</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
