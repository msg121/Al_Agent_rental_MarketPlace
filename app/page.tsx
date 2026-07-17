'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { AgentGrid } from '@/components/agents/AgentGrid'
import { useAgents } from '@/hooks/useAgents'
import { Bot, Zap, Shield, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const { agents, isLoading, isError } = useAgents()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/30">
          {/* Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6"
              >
                <Zap className="h-3.5 w-3.5" />
                Decentralized AI Agent Marketplace
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent pr-2">
                  Rent AI Agents
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  On-Chain
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Browse, rent, and list AI agents on the blockchain. Pay with USDT, get instant access, 
                and earn from your AI models — all without middlemen.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                {[
                  { icon: Bot, label: 'AI Agents', value: agents.length.toString() },
                  { icon: Shield, label: 'Trustless', value: 'On-Chain' },
                  { icon: Globe, label: 'Network', value: 'Sepolia' },
                ].map(({ icon: Icon, label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-xl font-bold text-foreground font-mono">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Agent Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Browse Agents</h2>
              <p className="text-sm text-muted-foreground mt-1">Discover and rent AI agents from providers worldwide</p>
            </div>
          </div>
          <AgentGrid agents={agents} isLoading={isLoading} isError={isError} />
        </section>
      </PageWrapper>
    </div>
  )
}
