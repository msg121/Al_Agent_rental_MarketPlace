'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Agent } from '@/types'
import { parseMetadata, formatUsdt, getDaysFromSeconds, getAverageRating, truncateAddress } from '@/lib/utils'
import { getAddressUrl } from '@/lib/contract'
import { RatingStars } from '@/components/agents/RatingStars'
import { RentButton } from '@/components/rental/RentButton'
import { RentalStatus } from '@/components/rental/RentalStatus'
import { AccessInfoPanel } from '@/components/rental/AccessInfoPanel'
import { useRental } from '@/hooks/useRental'
import { useRateAgent } from '@/hooks/useRateAgent'
import { useWeb3 } from '@/hooks/useWeb3'
import { useIsOwner } from '@/hooks/useIsOwner'
import { ToggleListingButton } from '@/components/agents/ToggleListingButton'
import { Bot, ExternalLink, Clock, Users, User, DollarSign, BrainCircuit, PenTool, ShieldCheck, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface AgentDetailProps {
  agent: Agent
}

function getAgentIcon(name: string) {
  if (name.includes('Code') || name.includes('MSG')) return <Bot className="w-12 h-12 text-cyan-400" />
  if (name.includes('Research') || name.includes('Adversity')) return <BrainCircuit className="w-12 h-12 text-purple-400" />
  if (name.includes('Content')) return <PenTool className="w-12 h-12 text-pink-400" />
  if (name.includes('Security')) return <ShieldCheck className="w-12 h-12 text-teal-400" />
  if (name.includes('Network')) return <Bot className="w-12 h-12 text-indigo-400" />
  return <Bot className="w-12 h-12 text-cyan-400" />
}

function getAgentGlow(name: string) {
  if (name.includes('Code') || name.includes('MSG')) return 'from-cyan-500/20 to-blue-500/20 shadow-[0_0_40px_rgba(6,182,212,0.3)] border-cyan-500/30'
  if (name.includes('Research') || name.includes('Adversity')) return 'from-purple-500/20 to-fuchsia-500/20 shadow-[0_0_40px_rgba(168,85,247,0.3)] border-purple-500/30'
  if (name.includes('Content')) return 'from-pink-500/20 to-rose-500/20 shadow-[0_0_40px_rgba(236,72,153,0.3)] border-pink-500/30'
  if (name.includes('Security')) return 'from-teal-500/20 to-emerald-500/20 shadow-[0_0_40px_rgba(20,184,166,0.3)] border-teal-500/30'
  if (name.includes('Network')) return 'from-indigo-500/20 to-blue-500/20 shadow-[0_0_40px_rgba(99,102,241,0.3)] border-indigo-500/30'
  return 'from-cyan-500/20 to-blue-500/20 shadow-[0_0_40px_rgba(6,182,212,0.3)] border-cyan-500/30'
}

export function AgentDetail({ agent }: AgentDetailProps) {
  const metadata = parseMetadata(agent.metadataURI)
  const avgRating = getAverageRating(agent.totalRatings, agent.ratingCount)
  const durationDays = getDaysFromSeconds(agent.periodDuration)
  const { address } = useWeb3()
  const { isOwner } = useIsOwner()
  const isProvider = address?.toLowerCase() === agent.provider.toLowerCase()
  const { rental, isActive } = useRental(agent.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a14]/60 backdrop-blur-xl p-8 lg:p-12 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-purple-900/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Big Icon */}
            <div className={`w-28 h-28 shrink-0 rounded-full bg-gradient-to-br ${getAgentGlow(metadata.name)} flex items-center justify-center border border-white/10`}>
              {getAgentIcon(metadata.name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {agent.isPaused ? (
                  <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> Paused
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active
                  </div>
                )}
                <div className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium tracking-wide uppercase">
                  {metadata.category}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {metadata.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <RatingStars rating={avgRating} showValue count={Number(agent.ratingCount)} size="md" />
                <div className="w-px h-5 bg-white/10" />
                <a
                  href={getAddressUrl(agent.provider)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <User className="w-4 h-4" /> {truncateAddress(agent.provider, 10, 8)}
                </a>
              </div>
            </div>

            <div className="md:text-right shrink-0">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Rental Price</div>
              <div className="text-4xl font-bold text-cyan-400 font-mono">
                {formatUsdt(agent.pricePerPeriod)} <span className="text-xl text-slate-400 font-sans font-medium">M</span>
              </div>
              <div className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 md:justify-end">
                <Clock className="w-4 h-4" /> {durationDays} days access
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Card */}
            <div className="rounded-2xl border border-white/5 bg-[#0c0c16]/80 p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                About this Agent
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6" />
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                {metadata.description}
              </p>
            </div>

            {/* Metrics/Stats Card */}
            <div className="rounded-2xl border border-white/5 bg-[#0c0c16]/80 p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                  <DollarSign className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Price</div>
                  <div className="text-sm font-bold text-white font-mono">{formatUsdt(agent.pricePerPeriod)} M</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                  <Clock className="w-5 h-5 text-indigo-400 mb-2" />
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Duration</div>
                  <div className="text-sm font-bold text-white">{durationDays} days</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                  <Users className="w-5 h-5 text-pink-400 mb-2" />
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Ratings</div>
                  <div className="text-sm font-bold text-white">{Number(agent.ratingCount)}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                  <Bot className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Agent ID</div>
                  <div className="text-sm font-bold text-white font-mono">#{Number(agent.id)}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Actions Card */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#0a0a14]/90 p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <RentButton
                agentId={agent.id}
                pricePerPeriod={agent.pricePerPeriod}
                isPaused={agent.isPaused}
                isProvider={isProvider}
                isRented={isActive}
              />
              
              <div className="mt-4 flex items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied to clipboard!')
                  }}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Agent
                </button>
              </div>
              
              {/* Management Controls (Owner/Provider) */}
              {(isProvider || isOwner) && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4 text-center">
                    Provider Controls
                  </div>
                  <ToggleListingButton agentId={agent.id} isPaused={agent.isPaused} />
                </div>
              )}
            </div>

            {/* Rental Status */}
            {rental && rental.expiryTime > 0n && (
              <div className="rounded-2xl border border-white/5 bg-[#0c0c16]/80 p-6 shadow-lg">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Your Rental Status</div>
                <RentalStatus agentId={agent.id} rental={rental} isActive={isActive} />
              </div>
            )}

            {/* Access Info */}
            {isActive && (
              <div className="rounded-2xl border border-success/30 bg-success/5 p-6 shadow-lg">
                <div className="text-xs text-success uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Access Granted
                </div>
                <AccessInfoPanel accessInfo={agent.accessInfo} isActive={isActive} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
