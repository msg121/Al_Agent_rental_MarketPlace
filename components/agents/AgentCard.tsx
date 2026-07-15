'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Agent } from '@/types'
import { parseMetadata, formatUsdt, getDaysFromSeconds, getAverageRating, getCategoryGradient, getCategoryColor, truncateAddress } from '@/lib/utils'
import { RatingStars } from '@/components/agents/RatingStars'
import { Badge } from '@/components/ui/badge'
import { Bot, Clock, User, Pause } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
  index?: number
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
    >
      <Link href={`/agents/${Number(agent.id)}`} className="block group">
        <div className={`relative overflow-hidden rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}>
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(metadata.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Paused overlay */}
          {agent.isPaused && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="secondary" className="bg-warning/15 text-warning border-warning/30 gap-1">
                <Pause className="h-3 w-3" /> Paused
              </Badge>
            </div>
          )}

          <div className="relative z-[1]">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${getCategoryGradient(metadata.category)} border border-border/30`}>
                <Bot className={`h-5 w-5 ${getCategoryColor(metadata.category)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {metadata.name}
                </h3>
                <Badge variant="outline" className="text-[10px] mt-1 border-border/50 text-muted-foreground">
                  {metadata.category}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {metadata.description}
            </p>

            {/* Rating */}
            <div className="mb-4">
              <RatingStars
                rating={avgRating}
                showValue
                count={Number(agent.ratingCount)}
                size="sm"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {truncateAddress(agent.provider)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {durationDays}d
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary font-mono">
                  {formatUsdt(agent.pricePerPeriod)}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">USDT</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
