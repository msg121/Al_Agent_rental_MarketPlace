'use client'
import { useState, useEffect, useCallback } from 'react'
import { getMarketplaceContract, getReadProvider, CONTRACT_ADDRESS } from '@/lib/contract'
import { useWeb3 } from '@/hooks/useWeb3'

export function useIsOwner() {
  const { address, isConnected } = useWeb3()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkIsOwner = useCallback(async () => {
    if (!isConnected || !address || !CONTRACT_ADDRESS) {
      setIsOwner(false)
      setIsLoading(false)
      return
    }

    try {
      const contract = getMarketplaceContract(getReadProvider())
      const ownerAddress = await contract.owner()
      setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase())
    } catch (error) {
      console.error('Failed to check owner:', error)
      setIsOwner(false)
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    checkIsOwner()
  }, [checkIsOwner])

  return { isOwner, isLoading }
}
