'use client'

import type { Rental } from '@/types'
import { getTimeRemaining, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

interface RentalStatusProps {
  rental: Rental | null
  isActive: boolean
}

export function RentalStatus({ rental, isActive }: RentalStatusProps) {
  if (!rental || rental.expiryTime === 0n) return null

  const { days, hours, expired } = getTimeRemaining(rental.expiryTime)

  return (
    <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        {isActive ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm font-semibold text-success">Active Rental</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Rental Expired</span>
          </>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Started</span>
          <span className="font-mono text-foreground">{formatDate(rental.startTime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expires</span>
          <span className="font-mono text-foreground">{formatDate(rental.expiryTime)}</span>
        </div>
        {isActive && !expired && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Time Left</span>
            <Badge variant="outline" className="gap-1 text-accent border-accent/30 bg-accent/5">
              <Clock className="h-3 w-3" />
              {days}d {hours}h
            </Badge>
          </div>
        )}
        {rental.allowedRatingsCount > 0n && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rating Quota</span>
            <span className="font-mono text-foreground">{Number(rental.allowedRatingsCount)} remaining</span>
          </div>
        )}
      </div>
    </div>
  )
}
