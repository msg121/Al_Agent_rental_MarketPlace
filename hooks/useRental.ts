'use client'
import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import type { Rental } from '@/types'
import { useWeb3 } from '@/hooks/useWeb3'
import { useTransactionStore } from '@/store/transactionStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseRental(r: any): Rental {
  return {
    renter: r[0] as string,
    startTime: r[1] as bigint,
    expiryTime: r[2] as bigint,
    allowedRatingsCount: r[3] as bigint,
  }
}

export function useRental(agentId: bigint) {
  const useMock = !CONTRACT_ADDRESS
  const { address, isConnected } = useWeb3()
  const [rental, setRental] = useState<Rental | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const fetchRental = useCallback(async () => {
    if (useMock || !isConnected || !address) {
      setRental(null)
      setIsActive(false)
      return
    }
    setIsLoading(true)
    try {
      const result = await getMarketplaceContract(getReadProvider()).rentals(agentId, address)
      const parsed = parseRental(result)
      setRental(parsed)
      const now = BigInt(Math.floor(Date.now() / 1000))
      setIsActive(parsed.expiryTime > now && parsed.renter !== '0x0000000000000000000000000000000000000000')
    } catch {
      setRental(null)
      setIsActive(false)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, isConnected, address, agentId])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchRental() }, [fetchRental, refreshTrigger])

  return { rental, isLoading, isActive, refetch: fetchRental }
}
