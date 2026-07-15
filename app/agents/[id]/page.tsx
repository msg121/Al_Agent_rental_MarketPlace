'use client'

import { useParams } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { AgentDetail } from '@/components/agents/AgentDetail'
import { useAgent } from '@/hooks/useAgent'
import { AgentSkeleton } from '@/components/agents/AgentSkeleton'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = BigInt(params.id as string)
  const { agent, isLoading, isError } = useAgent(agentId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          {isLoading && (
            <div className="max-w-4xl mx-auto">
              <AgentSkeleton />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Agent not found</h3>
              <p className="text-sm text-muted-foreground mb-4">This agent may not exist or the network is unavailable.</p>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Browse Marketplace
                </Button>
              </Link>
            </div>
          )}

          {agent && !isLoading && <AgentDetail agent={agent} />}
        </div>
      </PageWrapper>
    </div>
  )
}
