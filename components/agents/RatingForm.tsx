'use client'

import { useState } from 'react'
import { RatingStars } from './RatingStars'
import { useRateAgent } from '@/hooks/useRateAgent'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface RatingFormProps {
  agentId: bigint
}

export function RatingForm({ agentId }: RatingFormProps) {
  const [rating, setRating] = useState<number>(0)
  const { rateAgent, loading } = useRateAgent()

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (rating === 0) return
    const success = await rateAgent(agentId, rating)
    if (success) setRating(0)
  }

  return (
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
      <div className="text-sm font-medium text-foreground">Rate this agent</div>
      <div className="flex items-center justify-between">
        <RatingStars 
          rating={rating} 
          size="lg" 
          interactive={!loading} 
          onRate={setRating} 
        />
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || loading}
          size="sm"
          className="h-8"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Rating
        </Button>
      </div>
    </div>
  )
}
