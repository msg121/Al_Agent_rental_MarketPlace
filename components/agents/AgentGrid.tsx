'use client'

import { useState } from 'react'
import type { Agent } from '@/types'
import { AgentCard } from '@/components/agents/AgentCard'
import { AgentSkeletonGrid } from '@/components/agents/AgentSkeleton'
import { cn } from '@/lib/utils'
import { Bot, AlertCircle } from 'lucide-react'

interface AgentGridProps {
  agents: Agent[]
  isLoading: boolean
  isError: boolean
  showFilters?: boolean
}

type FilterTab = 'all' | 'active' | 'paused'

export function AgentGrid({ agents, isLoading, isError, showFilters = true }: AgentGridProps) {
  const [filter, setFilter] = useState<FilterTab>('all')

  const filteredAgents = agents.filter((agent) => {
    if (filter === 'active') return !agent.isPaused
    if (filter === 'paused') return agent.isPaused
    return true
  })

  if (isLoading) return <AgentSkeletonGrid />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load agents</h3>
        <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
      </div>
    )
  }

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Agents', count: agents.length },
    { key: 'active', label: 'Active', count: agents.filter((a) => !a.isPaused).length },
    { key: 'paused', label: 'Paused', count: agents.filter((a) => a.isPaused).length },
  ]

  return (
    <div>
      {/* Filter tabs */}
      {showFilters && (
        <div className="flex items-center gap-1 mb-6 p-1 bg-muted/30 rounded-lg border border-border/30 w-fit">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                filter === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {label}
              <span className={cn(
                'ml-1.5 text-xs font-mono',
                filter === key ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No agents found</h3>
          <p className="text-sm text-muted-foreground">
            {filter === 'all'
              ? 'Be the first to list an AI agent on the marketplace!'
              : 'No agents match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent, i) => (
            <AgentCard key={Number(agent.id)} agent={agent} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
