'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { AgentGrid } from '@/components/agents/AgentGrid'
import { useAgents } from '@/hooks/useAgents'
import { useWeb3 } from '@/hooks/useWeb3'
import { Bot, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function MyAgentsPage() {
  const { agents, isLoading, isError } = useAgents()
  const { address, isConnected, openModal } = useWeb3()

  const myAgents = address
    ? agents.filter((a) => a.provider.toLowerCase() === address.toLowerCase())
    : []

  return (
    <div className="min-h-screen">
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
              className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-2xl border border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-sm max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Connect your wallet</h3>
              <p className="text-base text-muted-foreground mb-8 max-w-md">Connect your wallet securely to view and manage the AI agents you&apos;ve listed on the marketplace.</p>
              <Button size="lg" onClick={() => openModal({ view: 'Connect' })} className="gap-2 font-medium">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </Button>
            </motion.div>
          ) : (
            <>
              {!isLoading && myAgents.length === 0 && !isError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-2xl border border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-sm max-w-2xl mx-auto mt-4"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">No agents listed yet</h3>
                  <p className="text-base text-muted-foreground mb-8 max-w-md">
                    You haven&apos;t registered any AI agents on the marketplace. Start earning by listing your first agent today!
                  </p>
                  <Link href="/agents/register">
                    <Button size="lg" className="gap-2 font-medium">
                      Register an Agent
                    </Button>
                  </Link>
                </motion.div>
              )}
              {(myAgents.length > 0 || isLoading || isError) && (
                <AgentGrid agents={myAgents} isLoading={isLoading} isError={isError} showFilters={false} />
              )}
            </>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
