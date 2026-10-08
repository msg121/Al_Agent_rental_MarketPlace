'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Agent } from '@/types'
import { parseMetadata, formatUsdt, getDaysFromSeconds, getAverageRating, truncateAddress } from '@/lib/utils'
import { RatingStars } from '@/components/agents/RatingStars'
import { Bot, Clock, User, ArrowRight, BrainCircuit, PenTool, ShieldCheck } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
  index?: number
}

function getAgentIcon(name: string) {
  if (name.includes('Code') || name.includes('MSG')) return <Bot className="w-8 h-8 text-cyan-400" />
  if (name.includes('Research') || name.includes('Adversity')) return <BrainCircuit className="w-8 h-8 text-purple-400" />
  if (name.includes('Content')) return <PenTool className="w-8 h-8 text-pink-400" />
  if (name.includes('Security')) return <ShieldCheck className="w-8 h-8 text-teal-400" />
  if (name.includes('Network')) return <Bot className="w-8 h-8 text-indigo-400" />
  return <Bot className="w-8 h-8 text-cyan-400" />
}

function getAgentGlow(name: string) {
  if (name.includes('Code') || name.includes('MSG')) return 'from-cyan-500/20 to-blue-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] border-cyan-500/30'
  if (name.includes('Research') || name.includes('Adversity')) return 'from-purple-500/20 to-fuchsia-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] border-purple-500/30'
  if (name.includes('Content')) return 'from-pink-500/20 to-rose-500/20 shadow-[0_0_20px_rgba(236,72,153,0.3)] border-pink-500/30'
  if (name.includes('Security')) return 'from-teal-500/20 to-emerald-500/20 shadow-[0_0_20px_rgba(20,184,166,0.3)] border-teal-500/30'
  if (name.includes('Network')) return 'from-indigo-500/20 to-blue-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] border-indigo-500/30'
  return 'from-cyan-500/20 to-blue-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] border-cyan-500/30'
}

export function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const metadata = parseMetadata(agent.metadataURI)
  const avgRating = getAverageRating(agent.totalRatings, agent.ratingCount)
  const durationDays = getDaysFromSeconds(agent.periodDuration)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      <div className="relative flex flex-col justify-between h-full group rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/80 backdrop-blur-md overflow-hidden hover:border-cyan-500/50 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a14] pointer-events-none" />
        
        <div className="p-6 pb-4 relative z-10 flex-1 flex flex-col">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-5">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAgentGlow(metadata.name)} flex items-center justify-center border border-white/5`}>
              {getAgentIcon(metadata.name)}
            </div>
            
            {/* Status Pill */}
            {agent.isPaused ? (
              <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Paused
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-1">
            {metadata.name}
          </h3>
          
          <div className="mb-4">
            <div className="inline-flex px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium tracking-wide">
              {metadata.category}
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
            {metadata.description}
          </p>
          
          <div className="mb-5">
            <RatingStars
              rating={avgRating}
              showValue
              count={Number(agent.ratingCount)}
              size="sm"
            />
          </div>

          {/* Footer Info Row */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {truncateAddress(agent.provider)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {durationDays}d
              </span>
            </div>
            <div className="text-right flex items-center gap-1">
              <span className="text-sm font-bold text-cyan-400 font-mono">
                {formatUsdt(agent.pricePerPeriod)}
              </span>
              <span className="text-xs text-cyan-400 font-medium">M</span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="px-6 pb-6 relative z-10">
          <Link 
            href={`/agents/${Number(agent.id)}`}
            className="flex items-center justify-center w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
