'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
  showValue?: boolean
  count?: number
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'sm',
  interactive = false,
  onRate,
  showValue = false,
  count,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.round(rating)
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate?.(i + 1)}
              className={cn(
                'transition-all duration-200',
                interactive && 'cursor-pointer hover:scale-125',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  'transition-colors duration-200',
                  filled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-muted-foreground/30'
                )}
              />
            </button>
          )
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-xs text-muted-foreground font-mono ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-0.5">
          ({count})
        </span>
      )}
    </div>
  )
}
