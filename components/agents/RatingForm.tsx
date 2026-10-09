'use client'

import { useState } from 'react'
import { RatingStars } from './RatingStars'
import { useRateAgent } from '@/hooks/useRateAgent'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface RatingFormProps {
  agentId: bigint
  isDisabled?: boolean
}

export function RatingForm({ agentId, isDisabled = false }: RatingFormProps) {
  const [rating, setRating] = useState<number>(0)
  const { rateAgent, loading } = useRateAgent()

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (rating === 0 || isDisabled) return
    const success = await rateAgent(agentId, rating)
    if (success) setRating(0)
  }

  return (
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-cyan-500/10">
      <div className="text-sm font-medium text-slate-300">
        {isDisabled ? 'Already Rated' : 'Rate this agent'}
      </div>
      <div className="flex items-center justify-between gap-4">
        <RatingStars 
          rating={rating} 
          size="lg" 
          interactive={!loading && !isDisabled} 
          onRate={setRating} 
        />
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || loading || isDisabled}
          size="sm"
          className={`h-8 ${isDisabled ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold'}`}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isDisabled ? 'Rated' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
