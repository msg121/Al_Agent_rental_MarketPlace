'use client'
import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { MOCK_AGENTS } from '@/lib/mockData'
import type { Agent } from '@/types'
import { useTransactionStore } from '@/store/transactionStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAgent(r: any): Agent {
  return {
    id: r[0] as bigint,
    provider: r[1] as string,
    metadataURI: r[2] as string,
    accessInfo: r[3] as string,
    pricePerPeriod: r[4] as bigint,
    periodDuration: r[5] as bigint,
    isPaused: r[6] as boolean,
    totalRatings: r[7] as bigint,
    ratingCount: r[8] as bigint,
  }
}

export function useAgent(agentId: bigint) {
  const useMock = !CONTRACT_ADDRESS
  const [agent, setAgent] = useState<Agent | undefined>(
    useMock ? MOCK_AGENTS.find((a) => a.id === agentId) : undefined
  )
  const [isLoading, setIsLoading] = useState(!useMock)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAgent = useCallback(async () => {
    if (useMock) return
    setIsLoading(true); setIsError(false)
    try {
      const result = await getMarketplaceContract(getReadProvider()).agents(agentId)
      setAgent(parseAgent(result))
    } catch (e) {
      setIsError(true); setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, agentId])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchAgent() }, [fetchAgent, refreshTrigger])

  return { agent, isLoading, isError, error, refetch: fetchAgent }
}
