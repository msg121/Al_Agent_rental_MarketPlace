'use client'

import { useWithdrawEarnings } from '@/hooks/useWithdrawEarnings'
import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowDownToLine } from 'lucide-react'

export function WithdrawButton() {
  const { withdraw, loading } = useWithdrawEarnings()
  const { isConnected, openModal } = useWeb3()

  const handleWithdraw = async () => {
    if (!isConnected) {
      openModal({ view: 'Connect' })
      return
    }
    await withdraw()
  }

  return (
    <Button
      onClick={handleWithdraw}
      disabled={loading}
      className="w-full bg-gradient-to-r from-success/80 to-success hover:from-success/70 hover:to-success/90 text-white gap-2 h-11 shadow-lg shadow-success/20"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowDownToLine className="h-4 w-4" />
      )}
      Withdraw Earnings
    </Button>
  )
}
