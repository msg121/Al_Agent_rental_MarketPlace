'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import { truncateAddress } from '@/lib/utils'
import { motion } from 'framer-motion'

export function ConnectButton() {
  const { address, isConnected, openModal, disconnect } = useWeb3()

  if (!isConnected) {
    return (
      <Button
        onClick={() => openModal({ view: 'Connect' })}
        className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal({ view: 'Account' })}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm text-sm text-foreground hover:border-primary/50 transition-all duration-300"
      >
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span className="font-mono text-xs">{truncateAddress(address || '')}</span>
      </motion.button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => disconnect()}
        className="h-9 w-9 text-muted-foreground hover:text-destructive transition-colors"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
