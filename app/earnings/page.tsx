'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { EarningsCard } from '@/components/earnings/EarningsCard'
import { WithdrawButton } from '@/components/earnings/WithdrawButton'
import { useWeb3 } from '@/hooks/useWeb3'
import { Wallet, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function EarningsPage() {
  const { isConnected, openModal } = useWeb3()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Earnings</h1>
            <p className="text-sm text-muted-foreground">View and withdraw your AI agent rental earnings.</p>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Wallet className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to view your earnings.</p>
              <Button onClick={() => openModal({ view: 'Connect' })} className="gap-2">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <EarningsCard />

              <div className="p-5 rounded-xl border border-border/40 bg-card/50 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Withdraw Funds</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Withdraw your accumulated rental earnings to your connected wallet.
                  Earnings are paid in USDT and transferred directly to your address.
                </p>
                <WithdrawButton />
              </div>

              <div className="p-4 rounded-lg bg-muted/20 border border-border/20">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>How earnings work:</strong> When someone rents your AI agent, the platform deducts a small fee and 
                  credits the rest to your earnings balance. You can withdraw anytime there are funds available.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
