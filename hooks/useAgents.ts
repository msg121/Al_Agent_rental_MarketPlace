'use client'
import { useState, useEffect, useCallback } from 'react'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { MOCK_AGENTS } from '@/lib/mockData'
import type { Agent } from '@/types'
import { useTransactionStore } from '@/store/transactionStore'

function parseAgent(r: Record<number, unknown>): Agent {
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

export function useAgents() {
  const useMock = !CONTRACT_ADDRESS
  const [agents, setAgents] = useState<Agent[]>(useMock ? MOCK_AGENTS : [])
  const [isLoading, setIsLoading] = useState(!useMock)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAgents = useCallback(async () => {
    if (useMock) return
    setIsLoading(true); setIsError(false)
    try {
      const contract = getMarketplaceContract(getReadProvider())
      const total = Number(await contract.totalAgents())
      if (total === 0) { setAgents([]); return }
      // Agent IDs start at 1 in the contract (totalAgents++ before assignment)
      const results = await Promise.all(
        Array.from({ length: total }, (_, i) => contract.agents(i + 1))
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAgents(results.map((r: any) => parseAgent(r)).filter((a) => a.id !== 0n))
    } catch (e) {
      setIsError(true); setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [useMock])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchAgents() }, [fetchAgents, refreshTrigger])

  return { agents, isLoading, isError, error, refetch: fetchAgents }
}
