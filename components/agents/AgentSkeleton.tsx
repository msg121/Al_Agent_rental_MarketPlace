'use client'

export function AgentSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-8 w-20 rounded bg-muted" />
      </div>
    </div>
  )
}

export function AgentSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <AgentSkeleton key={i} />
      ))}
    </div>
  )
}
