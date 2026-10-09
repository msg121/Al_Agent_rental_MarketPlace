'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { useAgents } from '@/hooks/useAgents'
import { Bot, Link as LinkIcon, Zap, ArrowRight, Plus, BrainCircuit, ShieldCheck, Search, PenTool, Hexagon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Agent } from '@/types'
import { parseMetadata, formatUsdt, getDaysFromSeconds } from '@/lib/utils'

// Helper to get specific icons for the featured agents based on name
function getAgentIcon(name: string) {
  if (name.includes('Code')) return <Bot className="w-6 h-6 text-cyan-400" />
  if (name.includes('Research')) return <BrainCircuit className="w-6 h-6 text-purple-400" />
  if (name.includes('Content')) return <PenTool className="w-6 h-6 text-pink-400" />
  if (name.includes('Security')) return <ShieldCheck className="w-6 h-6 text-teal-400" />
  return <Bot className="w-6 h-6 text-cyan-400" />
}

function getAgentGlow(name: string) {
  if (name.includes('Code')) return 'from-cyan-500/20 to-blue-500/20 shadow-cyan-500/20'
  if (name.includes('Research')) return 'from-purple-500/20 to-fuchsia-500/20 shadow-purple-500/20'
  if (name.includes('Content')) return 'from-pink-500/20 to-rose-500/20 shadow-pink-500/20'
  if (name.includes('Security')) return 'from-teal-500/20 to-emerald-500/20 shadow-teal-500/20'
  return 'from-cyan-500/20 to-blue-500/20 shadow-cyan-500/20'
}

function FeaturedAgentCard({ agent, index }: { agent: Agent; index: number }) {
  const metadata = parseMetadata(agent.metadataURI)
  const isPopular = metadata.name.includes('Code') || metadata.name.includes('Research')
  const durationDays = getDaysFromSeconds(agent.periodDuration)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="relative flex flex-col justify-between h-full group rounded-3xl border-2 border-cyan-500/10 bg-[#0c1222]/90 backdrop-blur-xl overflow-hidden hover:border-cyan-500/40 hover:bg-[#0f172a]/90 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a14] pointer-events-none" />
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAgentGlow(metadata.name)} flex items-center justify-center border border-white/5 shadow-lg`}>
            {getAgentIcon(metadata.name)}
          </div>
          {isPopular && (
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>
          )}
        </div>

        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            {metadata.name}
          </h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500 font-medium uppercase tracking-wider">Online</span>
          </div>
        </div>

        <div className="text-xs text-indigo-300 mb-4 font-medium uppercase tracking-wider">
          {metadata.category}
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {metadata.description}
        </p>
      </div>

      <div className="p-6 pt-0 mt-auto relative z-10 flex flex-col gap-4 border-t border-white/5">
        <div className="flex items-center gap-2 pt-4">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
            <span className="text-white text-[10px]">$</span>
          </div>
          <span className="text-white font-mono font-bold">${formatUsdt(agent.pricePerPeriod)} <span className="text-slate-500 text-sm font-sans font-normal">/ {durationDays}d</span></span>
        </div>
        
        <Link 
          href={`/agents/${Number(agent.id)}`}
          className="flex items-center justify-center w-full py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          Rent Agent <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { agents } = useAgents()
  const featuredAgents = agents.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      <Navbar />
      <PageWrapper>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-900/10 blur-[100px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8">
                <Zap className="h-3 w-3" />
                Decentralized AI Agent Marketplace
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Rent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Agents</span><br />
                On-Chain
              </h1>

              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
                Discover, rent, and deploy AI agents on the blockchain. Pay with M, get instant access, and earn from your AI models — without middlemen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#featured" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  Explore AI Agents <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <Link href="/agents/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-cyan-500/30 bg-[#0c0c16]/80 text-white font-semibold text-sm transition-all hover:bg-cyan-500/10 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <Plus className="w-4 h-4 mr-2" /> Deploy Your Agent
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block h-[500px]"
            >
              {/* Orbital Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-indigo-500/20 animate-[spin_40s_linear_infinite_reverse]" />
              
              {/* Main Floating Window */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] rounded-2xl border border-cyan-500/20 bg-[#0a0a14]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden z-20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold">AgentHub</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 mb-4 text-xs text-slate-400">
                    <Search className="w-3.5 h-3.5" /> Search AI agents...
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Code Assistant', role: 'Developer • Productivity', price: '2.5 M', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
                      { name: 'Content Creator', role: 'Marketing • Writing', price: '1.8 M', color: 'text-pink-400', bg: 'bg-pink-500/20' },
                      { name: 'Research Agent', role: 'Research • Analysis', price: '3.0 M', color: 'text-purple-400', bg: 'bg-purple-500/20' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                            <Bot className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-400">{item.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">{item.price} <span className="text-slate-500 font-sans font-normal">/ hr</span></div>
                          <div className="text-[9px] text-cyan-400 font-semibold uppercase mt-0.5 px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 inline-block">Rent</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 z-30 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              >
                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-100">On-Chain</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 z-30 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <Hexagon className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-100">Sepolia</span>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-cyan-500/20 bg-[#0c1222]/80 backdrop-blur-xl hover:border-cyan-500/50 hover:bg-[#0f172a]/90 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-cyan-400">{agents.length}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">AI Agents</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Explore a growing collection of trusted AI agents.</p>
              </div>
            </div>
            
            <div className="p-8 rounded-3xl border border-indigo-500/20 bg-[#0c1222]/80 backdrop-blur-xl hover:border-indigo-500/50 hover:bg-[#0f172a]/90 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-transform">
                <LinkIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">On-Chain</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Transparent, secure, and fully decentralized.</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-purple-500/20 bg-[#0c1222]/80 backdrop-blur-xl hover:border-purple-500/50 hover:bg-[#0f172a]/90 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
                <Hexagon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Sepolia Network</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Testnet environment for a safe and seamless experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Agents */}
        <section id="featured" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Agents</span></h2>
              <p className="text-slate-400 text-sm">Discover top-performing agents, ready to work for you.</p>
            </div>
            <Link href="/browse" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View All Agents <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent, i) => (
              <FeaturedAgentCard key={Number(agent.id)} agent={agent} index={i} />
            ))}
          </div>
        </section>

      </PageWrapper>
    </div>
  )
}
