'use client'

import { useState } from 'react'
import type { Agent } from '@/types'
import { AgentCard } from '@/components/agents/AgentCard'
import { AgentSkeletonGrid } from '@/components/agents/AgentSkeleton'
import { cn, parseMetadata } from '@/lib/utils'
import { Bot, AlertCircle, ChevronDown } from 'lucide-react'

interface AgentGridProps {
  agents: Agent[]
  isLoading: boolean
  isError: boolean
  showFilters?: boolean
  searchQuery?: string
}

type FilterTab = 'all' | 'active' | 'paused'
type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating'

export function AgentGrid({ agents, isLoading, isError, showFilters = true, searchQuery = '' }: AgentGridProps) {
  const [filter, setFilter] = useState<FilterTab>('all')
  const [sort, setSort] = useState<SortOption>('newest')

  let filteredAgents = agents.filter((agent) => {
    // 1. Status Filter
    if (filter === 'active' && agent.isPaused) return false
    if (filter === 'paused' && !agent.isPaused) return false
    
    // 2. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const metadata = parseMetadata(agent.metadataURI)
      if (!metadata.name.toLowerCase().includes(q) && 
          !metadata.category.toLowerCase().includes(q) && 
          !metadata.description.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  // 3. Sorting
  filteredAgents = filteredAgents.sort((a, b) => {
    if (sort === 'newest') return Number(b.id - a.id)
    if (sort === 'price-low') return Number(a.pricePerPeriod - b.pricePerPeriod)
    if (sort === 'price-high') return Number(b.pricePerPeriod - a.pricePerPeriod)
    if (sort === 'rating') {
      const rA = a.ratingCount > 0n ? Number(a.totalRatings) / Number(a.ratingCount) : 0
      const rB = b.ratingCount > 0n ? Number(b.totalRatings) / Number(b.ratingCount) : 0
      return rB - rA
    }
    return 0
  })

  if (isLoading) return <AgentSkeletonGrid />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Failed to load agents</h3>
        <p className="text-sm text-slate-400">Please check your connection and try again.</p>
      </div>
    )
  }

  const tabs = [
    { key: 'all' as FilterTab, label: 'All Agents', count: agents.length },
    { key: 'active' as FilterTab, label: 'Active', count: agents.filter((a) => !a.isPaused).length },
    { key: 'paused' as FilterTab, label: 'Paused', count: agents.filter((a) => a.isPaused).length },
  ]

  return (
    <div>
      {/* Filters and Sort */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          
          {/* Segmented Control */}
          <div className="flex items-center p-1 bg-[#121220] rounded-full border border-white/5 shadow-inner">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                  filter === key
                    ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px]',
                  filter === key ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                )}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none bg-[#121220] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:border-white/20 cursor-pointer shadow-sm transition-all"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

        </div>
      )}

      {/* Grid */}
      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-white/5 bg-[#0a0a14]/50 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No agents found</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            {filter === 'all' && !searchQuery
              ? 'Be the first to list an AI agent on the marketplace!'
              : 'Try adjusting your filters or search query.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, i) => (
            <AgentCard key={Number(agent.id)} agent={agent} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
