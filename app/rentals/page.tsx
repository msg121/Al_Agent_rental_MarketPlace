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
import { Bot, Key, Wallet, BrainCircuit, Zap } from 'lucide-react'
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
    <div className="min-h-screen bg-[#030308] text-white selection:bg-cyan-500/30 overflow-hidden font-sans relative">
      <Navbar />
      
      {/* Dynamic Animated Background with Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" 
        />
        
        {/* Orbital Rings in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyan-500/5 border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-purple-500/5 animate-[spin_80s_linear_infinite_reverse]" />

        {/* Floating AI Logos */}
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        >
          <Bot className="w-8 h-8 text-cyan-400" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] right-[12%] w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        >
          <BrainCircuit className="w-6 h-6 text-purple-400" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -25, 0], x: [0, 25, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute bottom-[20%] left-[15%] w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]"
        >
          <Zap className="w-10 h-10 text-blue-400" />
        </motion.div>

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Key className="w-4 h-4" /> VIP Access
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Rentals</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Manage your exclusive AI agents. Instant access to the power of decentralized intelligence.</p>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 px-6 text-center rounded-[40px] border border-cyan-500/30 bg-[#0a0f1c]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
              <div className="w-24 h-24 mb-8 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <Wallet className="h-12 w-12 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Connect your wallet</h3>
              <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">Unlock your personal dashboard to view your rented AI agents.</p>
              <button onClick={() => openModal({ view: 'Connect' })} className="flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                <Wallet className="h-5 w-5 mr-3" /> Connect Wallet
              </button>
            </motion.div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-3xl border border-white/5 bg-[#0a0f1c]/60 p-8 animate-pulse h-64">
                  <div className="h-20 w-20 bg-slate-800 rounded-2xl mb-6" />
                  <div className="h-6 w-3/4 bg-slate-800 rounded mb-4" />
                  <div className="h-4 w-1/2 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : rentals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 px-6 text-center rounded-[40px] border border-purple-500/30 bg-[#0a0f1c]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              <div className="w-24 h-24 mb-8 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <Bot className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No AI Agents Yet</h3>
              <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">Your arsenal is empty. Discover powerful AI agents on the marketplace to get started.</p>
              <Link href="/browse" className="flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                <Bot className="h-5 w-5 mr-3" /> Explore Marketplace
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rentals.map(({ agentId, agentName, agentCategory, agentPrice, rental, isActive }, i) => (
                <motion.div
                  key={Number(agentId)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="h-full flex flex-col"
                >
                  <Link href={`/agents/${Number(agentId)}`} className="block h-full flex-1">
                    {/* VIP Card Container */}
                    <div className="relative group h-full rounded-[32px] bg-[#0d1326]/90 backdrop-blur-3xl border-2 border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-500 shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] overflow-hidden">
                      
                      {/* Intense Background Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* VIP Top Border Line */}
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${isActive ? 'from-cyan-400 via-blue-500 to-purple-500' : 'from-slate-500 to-slate-700'}`} />
                      
                      <div className="p-8 relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          {/* Agent Icon Box */}
                          <div className={`w-20 h-20 rounded-2xl bg-[#0a0f1c] flex items-center justify-center border-2 border-cyan-500/40 shadow-[inset_0_0_20px_rgba(6,182,212,0.2),0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[inset_0_0_30px_rgba(6,182,212,0.4),0_0_40px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-all duration-500`}>
                            <Bot className={`h-10 w-10 ${getCategoryColor(agentCategory)}`} />
                          </div>
                          
                          {/* Status Badge */}
                          <div className="shrink-0 flex items-center">
                            {isActive ? (
                              <div className="px-5 py-2.5 rounded-full bg-green-500/20 border-2 border-green-500/50 text-green-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] backdrop-blur-md">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                                VIP Active
                              </div>
                            ) : (
                              <div className="px-5 py-2.5 rounded-full bg-slate-800/80 border-2 border-slate-600/50 text-slate-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                                Expired
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors mb-3 line-clamp-1">{agentName}</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                              {agentCategory}
                            </div>
                            <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-[#050812] border border-white/10">
                              <span className="font-mono text-cyan-400 font-bold text-base">{formatUsdt(agentPrice)}</span>
                              <span className="text-slate-500 text-xs font-bold uppercase">M / period</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-cyan-500/20">
                          <div className="bg-[#050812] rounded-2xl p-5 border border-cyan-500/20 shadow-inner group-hover:border-cyan-500/40 transition-colors duration-500">
                            <RentalStatus agentId={agentId} rental={rental} isActive={isActive} />
                          </div>
                        </div>
                      </div>
                    </div>
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
