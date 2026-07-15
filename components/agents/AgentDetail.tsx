'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Agent } from '@/types'
import { parseMetadata, formatUsdt, getDaysFromSeconds, getAverageRating, getCategoryGradient, getCategoryColor, truncateAddress } from '@/lib/utils'
import { getAddressUrl } from '@/lib/contract'
import { RatingStars } from '@/components/agents/RatingStars'
import { RentButton } from '@/components/rental/RentButton'
import { RentalStatus } from '@/components/rental/RentalStatus'
import { AccessInfoPanel } from '@/components/rental/AccessInfoPanel'
import { useRental } from '@/hooks/useRental'
import { useRateAgent } from '@/hooks/useRateAgent'
import { useWeb3 } from '@/hooks/useWeb3'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, ExternalLink, Clock, Users, DollarSign, Pause, Star } from 'lucide-react'
import { toast } from 'sonner'

interface AgentDetailProps {
  agent: Agent
}

export function AgentDetail({ agent }: AgentDetailProps) {
  const metadata = parseMetadata(agent.metadataURI)
  const avgRating = getAverageRating(agent.totalRatings, agent.ratingCount)
  const durationDays = getDaysFromSeconds(agent.periodDuration)
  const { address } = useWeb3()
  const isProvider = address?.toLowerCase() === agent.provider.toLowerCase()
  const { rental, isActive } = useRental(agent.id)
  const { rateAgent } = useRateAgent()
  const [userRating, setUserRating] = useState(0)

  const canRate = rental !== null && rental.allowedRatingsCount > 0n

  const handleRate = async (rating: number) => {
    setUserRating(rating)
    const success = await rateAgent(agent.id, rating)
    if (!success) setUserRating(0)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className={`relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br ${getCategoryGradient(metadata.category)} p-8 mb-6`}>
          <div className="absolute inset-0 bg-card/70 backdrop-blur-sm" />
          <div className="relative z-[1] flex flex-col md:flex-row md:items-start gap-6">
            <div className={`flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br ${getCategoryGradient(metadata.category)} border border-border/30 shrink-0`}>
              <Bot className={`h-8 w-8 ${getCategoryColor(metadata.category)}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{metadata.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="border-border/50 text-muted-foreground">
                      {metadata.category}
                    </Badge>
                    {agent.isPaused && (
                      <Badge variant="secondary" className="bg-warning/15 text-warning border-warning/30 gap-1">
                        <Pause className="h-3 w-3" /> Paused
                      </Badge>
                    )}
                    <RatingStars rating={avgRating} showValue count={Number(agent.ratingCount)} size="md" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary font-mono">
                    {formatUsdt(agent.pricePerPeriod)}
                  </div>
                  <div className="text-xs text-muted-foreground">USDT / {durationDays} days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">About this Agent</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {metadata.description}
                </p>
              </CardContent>
            </Card>

            {/* Agent Details */}
            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                    <DollarSign className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</div>
                      <div className="text-sm font-semibold font-mono">{formatUsdt(agent.pricePerPeriod)} USDT</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                    <Clock className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</div>
                      <div className="text-sm font-semibold">{durationDays} days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                    <Star className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Rating</div>
                      <div className="text-sm font-semibold">{avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : 'No ratings'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                    <Users className="h-4 w-4 text-success shrink-0" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Reviews</div>
                      <div className="text-sm font-semibold">{Number(agent.ratingCount)}</div>
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Provider</div>
                  <a
                    href={getAddressUrl(agent.provider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
                  >
                    {truncateAddress(agent.provider, 10, 8)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Rate Agent */}
            {canRate && (
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Rate this Agent</h2>
                  <p className="text-sm text-muted-foreground mb-4">Share your experience with this AI agent.</p>
                  <RatingStars
                    rating={userRating}
                    interactive
                    onRate={handleRate}
                    size="lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Rent Button */}
            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-5">
                <RentButton
                  agentId={agent.id}
                  pricePerPeriod={agent.pricePerPeriod}
                  isPaused={agent.isPaused}
                  isProvider={isProvider}
                  isRented={isActive}
                />
              </CardContent>
            </Card>

            {/* Rental Status */}
            <RentalStatus rental={rental} isActive={isActive} />

            {/* Access Info */}
            <AccessInfoPanel accessInfo={agent.accessInfo} isActive={isActive} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
