'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { AgentGrid } from '@/components/agents/AgentGrid'
import { useAgents } from '@/hooks/useAgents'
import { motion } from 'framer-motion'
import { Bot, Search, BrainCircuit, PenTool, TrendingUp, ShieldCheck, Zap } from 'lucide-react'

export default function BrowsePage() {
  const { agents, isLoading, isError } = useAgents()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      <Navbar />
      <PageWrapper>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <Zap className="h-3 w-3" />
                Decentralized AI Agent Marketplace
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Agents</span>
              </h1>

              <p className="text-base text-slate-400 mb-8 leading-relaxed max-w-lg">
                Discover and explore a wide range of AI agents, designed to help you work smarter, earn more, and build the future — on-chain.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search agents by name, category or use case..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-32 py-4 bg-[#0a0a14]/80 border border-cyan-500/30 rounded-full leading-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                />
                <div className="absolute inset-y-1 right-1">
                  <button className="flex items-center justify-center px-6 h-full rounded-full bg-cyan-500 text-white font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    Search
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual Elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block h-[350px]"
            >
              {/* Central Robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                <Bot className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              </div>

              {/* Floating Orbit Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-cyan-500/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-indigo-500/20 border-dashed animate-[spin_40s_linear_infinite_reverse]" />

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Research<br/>Agent</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-4 px-4 py-2.5 rounded-xl border border-pink-500/30 bg-pink-500/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/50">
                  <PenTool className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">Content<br/>Creator</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-20 right-4 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Trading<br/>Agent</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-10 right-10 px-4 py-2.5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(217,70,239,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/50">
                  <Bot className="w-4 h-4 text-fuchsia-400" />
                </div>
                <span className="text-xs font-bold text-fuchsia-100 uppercase tracking-wider">Marketing<br/>Agent</span>
              </motion.div>

              {/* Bottom Badge */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 backdrop-blur-md flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center"><Bot className="w-3 h-3 text-cyan-400" /></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center"><BrainCircuit className="w-3 h-3 text-purple-400" /></div>
                </div>
                <span className="text-xs font-bold text-cyan-100">AI Agents</span>
                <span className="text-[10px] text-cyan-400/70 border-l border-cyan-500/30 pl-3">On-Chain • Secure • Decentralized</span>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Main Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <AgentGrid agents={agents} isLoading={isLoading} isError={isError} searchQuery={searchQuery} />
        </section>
      </PageWrapper>
    </div>
  )
}
