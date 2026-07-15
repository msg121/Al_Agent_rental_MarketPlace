'use client'

import { useState } from 'react'
import { useRentAgent } from '@/hooks/useRentAgent'
import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { formatUsdt } from '@/lib/utils'

interface RentButtonProps {
  agentId: bigint
  pricePerPeriod: bigint
  isPaused: boolean
  isProvider: boolean
  isRented: boolean
  onSuccess?: () => void
}

export function RentButton({ agentId, pricePerPeriod, isPaused, isProvider, isRented, onSuccess }: RentButtonProps) {
  const { rentAgent, loading } = useRentAgent()
  const { isConnected, openModal } = useWeb3()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRent = async () => {
    if (!isConnected) {
      openModal({ view: 'Connect' })
      return
    }
    setIsProcessing(true)
    const success = await rentAgent(agentId, pricePerPeriod)
    if (success) onSuccess?.()
    setIsProcessing(false)
  }

  const disabled = isPaused || isProvider || loading || isProcessing

  const getLabel = () => {
    if (!isConnected) return 'Connect to Rent'
    if (isPaused) return 'Agent Paused'
    if (isProvider) return 'Your Agent'
    if (isRented) return `Extend Rental — ${formatUsdt(pricePerPeriod)} USDT`
    return `Rent for ${formatUsdt(pricePerPeriod)} USDT`
  }

  return (
    <Button
      onClick={handleRent}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white gap-2 h-11 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-300"
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {getLabel()}
    </Button>
  )
}
