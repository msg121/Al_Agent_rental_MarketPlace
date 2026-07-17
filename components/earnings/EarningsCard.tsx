'use client'

import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'
import { useTransactionStore } from '@/store/transactionStore'
import { formatUsdt } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, TrendingUp, Shield } from 'lucide-react'

export function EarningsCard() {
  const { address, isConnected } = useWeb3()
  const [providerEarnings, setProviderEarnings] = useState(0n)
  const [platformFees, setPlatformFees] = useState(0n)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const useMock = !CONTRACT_ADDRESS

  const fetchEarnings = useCallback(async () => {
    if (useMock || !isConnected || !address) return
    setIsLoading(true)
    try {
      const contract = getMarketplaceContract(getReadProvider())
      const pEarnings = await contract.earnings(address) as bigint
      setProviderEarnings(pEarnings)
      
      const ownerAddr = await contract.owner()
      const ownerStatus = ownerAddr.toLowerCase() === address.toLowerCase()
      setIsOwner(ownerStatus)
      
      if (ownerStatus) {
        const fees = await contract.totalPlatformFees() as bigint
        setPlatformFees(fees)
      } else {
        setPlatformFees(0n)
      }
    } catch (e) {
      console.error('fetchEarnings:', e)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, isConnected, address])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchEarnings() }, [fetchEarnings, refreshTrigger])

  const total = providerEarnings + platformFees

  return (
    <Card className="bg-card/50 border-border/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 border border-primary/20">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Provider Earnings</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {isLoading ? '...' : `${formatUsdt(providerEarnings)} USDT`}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/20">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 border border-accent/20">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Marketplace Fees (Owner)</div>
              <div className="text-xl font-bold font-mono text-foreground">
                {isLoading ? '...' : `${formatUsdt(platformFees)} USDT`}
              </div>
            </div>
          </div>
        )}

        {total > 0n && (
          <div className="flex items-center gap-1.5 text-xs text-success mt-5 bg-success/10 w-fit px-3 py-1.5 rounded-full border border-success/20">
            <TrendingUp className="h-3 w-3" />
            <span>Ready to withdraw: <strong>{formatUsdt(total)} USDT total</strong></span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
