'use client'

import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useWeb3 } from '@/hooks/useWeb3'
import { Coins } from 'lucide-react'

export function WalletStatus() {
  const { isConnected } = useWeb3()
  const { formatted } = useTokenBalance()

  if (!isConnected) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/30 text-xs">
      <Coins className="h-3.5 w-3.5 text-accent" />
      <span className="text-muted-foreground">Balance:</span>
      <span className="font-mono text-foreground font-medium">{formatted} USDT</span>
    </div>
  )
}
