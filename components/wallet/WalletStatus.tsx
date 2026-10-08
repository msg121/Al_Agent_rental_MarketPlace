'use client'

import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useWeb3 } from '@/hooks/useWeb3'
import { Wallet } from 'lucide-react'

export function WalletStatus() {
  const { isConnected } = useWeb3()
  const { formatted } = useTokenBalance()

  if (!isConnected) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-[#0c1222]/80 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:border-cyan-500/50">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
        <Wallet className="h-3 w-3 text-cyan-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-cyan-400 uppercase font-bold tracking-wider leading-none mb-0.5">Balance</span>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-mono text-white font-bold text-xs">{formatted}</span>
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
            <span className="text-[9px] font-bold text-[#05050a] leading-none">M</span>
          </div>
        </div>
      </div>
    </div>
  )
}
