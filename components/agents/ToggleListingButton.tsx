'use client'

import { useState } from 'react'
import { useToggleListing } from '@/hooks/useToggleListing'
import { Button } from '@/components/ui/button'
import { Pause, Play, Loader2 } from 'lucide-react'

interface ToggleListingButtonProps {
  agentId: bigint
  isPaused: boolean
}

export function ToggleListingButton({ agentId, isPaused }: ToggleListingButtonProps) {
  const { toggleListing, loading } = useToggleListing()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleToggle = async () => {
    setIsProcessing(true)
    await toggleListing(agentId, isPaused)
    setIsProcessing(false)
  }

  const disabled = loading || isProcessing

  return (
    <Button
      onClick={handleToggle}
      disabled={disabled}
      variant={isPaused ? "default" : "destructive"}
      className="w-full gap-2 h-11 text-sm font-semibold shadow-lg transition-all duration-300"
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPaused ? (
        <Play className="h-4 w-4" />
      ) : (
        <Pause className="h-4 w-4" />
      )}
      {isPaused ? 'Resume Agent' : 'Pause Agent'}
    </Button>
  )
}
