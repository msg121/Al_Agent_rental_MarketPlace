'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Copy, CheckCircle2, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface AccessInfoPanelProps {
  accessInfo: string
  isActive: boolean
}

export function AccessInfoPanel({ accessInfo, isActive }: AccessInfoPanelProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accessInfo)
    setCopied(true)
    toast.success('Access info copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isActive) {
    return (
      <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm">Rent this agent to unlock access info</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-accent">Access Information</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRevealed(!isRevealed)}
            className="h-7 px-2 text-xs gap-1"
          >
            {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {isRevealed ? 'Hide' : 'Reveal'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs gap-1"
          >
            {copied ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isRevealed ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <code className="block text-xs font-mono text-foreground bg-background/50 border border-border/30 rounded-md p-3 break-all">
              {accessInfo}
            </code>
          </motion.div>
        ) : (
          <div className="text-xs text-muted-foreground font-mono bg-background/50 border border-border/30 rounded-md p-3">
            ••••••••••••••••••••••••••
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
