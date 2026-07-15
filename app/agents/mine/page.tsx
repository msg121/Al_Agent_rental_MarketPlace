'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { AgentGrid } from '@/components/agents/AgentGrid'
import { useAgents } from '@/hooks/useAgents'
import { useWeb3 } from '@/hooks/useWeb3'
import { Bot, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function MyAgentsPage() {
  const { agents, isLoading, isError } = useAgents()
  const { address, isConnected, openModal } = useWeb3()

  const myAgents = address
    ? agents.filter((a) => a.provider.toLowerCase() === address.toLowerCase())
    : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">My Listed Agents</h1>
            <p className="text-sm text-muted-foreground">Manage the AI agents you&apos;ve registered on the marketplace.</p>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Wallet className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to see agents you&apos;ve listed.</p>
              <Button onClick={() => openModal({ view: 'Connect' })} className="gap-2">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </Button>
            </motion.div>
          ) : (
            <>
              {!isLoading && myAgents.length === 0 && !isError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <Bot className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No agents listed yet</h3>
                  <p className="text-sm text-muted-foreground">You haven&apos;t registered any AI agents on the marketplace.</p>
                </motion.div>
              )}
              {(myAgents.length > 0 || isLoading) && (
                <AgentGrid agents={myAgents} isLoading={isLoading} isError={isError} showFilters={false} />
              )}
            </>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
