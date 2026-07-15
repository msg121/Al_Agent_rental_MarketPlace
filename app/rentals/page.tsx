'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { RentalStatus } from '@/components/rental/RentalStatus'
import { useAgents } from '@/hooks/useAgents'
import { useWeb3 } from '@/hooks/useWeb3'
import { useTransactionStore } from '@/store/transactionStore'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { parseMetadata, formatUsdt, getCategoryColor } from '@/lib/utils'
import type { Rental } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Key, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface RentalWithAgent {
  agentId: bigint
  agentName: string
  agentCategory: string
  agentPrice: bigint
  rental: Rental
  isActive: boolean
}

export default function RentalsPage() {
  const { agents } = useAgents()
  const { address, isConnected, openModal } = useWeb3()
  const [rentals, setRentals] = useState<RentalWithAgent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const useMock = !CONTRACT_ADDRESS
  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)

  const fetchRentals = useCallback(async () => {
    if (useMock || !isConnected || !address || agents.length === 0) return
    setIsLoading(true)
    try {
      const contract = getMarketplaceContract(getReadProvider())
      const results: RentalWithAgent[] = []
      const now = BigInt(Math.floor(Date.now() / 1000))

      for (const agent of agents) {
        try {
          const r = await contract.rentals(agent.id, address)
          const rental: Rental = {
            renter: r[0] as string,
            startTime: r[1] as bigint,
            expiryTime: r[2] as bigint,
            allowedRatingsCount: r[3] as bigint,
          }
          // Only show if there was ever a rental (expiryTime > 0)
          if (rental.expiryTime > 0n) {
            const metadata = parseMetadata(agent.metadataURI)
            results.push({
              agentId: agent.id,
              agentName: metadata.name,
              agentCategory: metadata.category,
              agentPrice: agent.pricePerPeriod,
              rental,
              isActive: rental.expiryTime > now,
            })
          }
        } catch {
          // Skip agents we can't read rental for
        }
      }

      // Sort: active first, then by expiry desc
      results.sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
        return Number(b.rental.expiryTime - a.rental.expiryTime)
      })

      setRentals(results)
    } catch (e) {
      console.error('fetchRentals:', e)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, isConnected, address, agents])

  useEffect(() => { fetchRentals() }, [fetchRentals, refreshTrigger])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">My Rentals</h1>
            <p className="text-sm text-muted-foreground">View your active and past AI agent rentals.</p>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Wallet className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to see your rental history.</p>
              <Button onClick={() => openModal({ view: 'Connect' })} className="gap-2">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </Button>
            </motion.div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-5 animate-pulse">
                  <div className="h-5 w-48 bg-muted rounded mb-3" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : rentals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Key className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No rentals yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse the marketplace to rent your first AI agent.</p>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" /> Browse Agents
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {rentals.map(({ agentId, agentName, agentCategory, agentPrice, rental, isActive }, i) => (
                <motion.div
                  key={Number(agentId)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/agents/${Number(agentId)}`}>
                    <Card className="bg-card/50 border-border/40 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted/50 border border-border/30">
                              <Bot className={`h-5 w-5 ${getCategoryColor(agentCategory)}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{agentName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px]">{agentCategory}</Badge>
                                <span className="text-xs font-mono text-muted-foreground">{formatUsdt(agentPrice)} USDT</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className={isActive ? 'bg-success/15 text-success border-success/30' : ''}
                          >
                            {isActive ? 'Active' : 'Expired'}
                          </Badge>
                        </div>
                        <RentalStatus rental={rental} isActive={isActive} />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
