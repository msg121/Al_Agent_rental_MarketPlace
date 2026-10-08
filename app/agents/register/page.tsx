'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { RegisterAgentForm } from '@/components/agents/RegisterAgentForm'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Globe, Coins, Bot, Code2, LineChart, Hexagon } from 'lucide-react'

export default function RegisterAgentPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      <Navbar />
      <PageWrapper>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <Zap className="h-3 w-3" />
                Decentralized AI Agent Marketplace
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                List Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Agent</span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg font-medium">
                Register your AI agent on the decentralized marketplace. Share your creation with the world, earn from rentals, and be part of the next generation of AI + Web3.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-slate-300 font-medium">On-Chain<br/>Transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-300 font-medium">Global<br/>Marketplace</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300 font-medium">Earn<br/>Passive Income</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block h-[400px]"
            >
              {/* Orbital Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-indigo-500/20 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
              
              {/* Central Glowing Robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                <Bot className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]" />
              </div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 z-30 px-5 py-3 rounded-2xl border border-cyan-500/30 bg-[#0c0c16]/80 backdrop-blur-md flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Code2 className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-100">Create</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-16 right-10 z-30 px-5 py-3 rounded-2xl border border-purple-500/30 bg-[#0c0c16]/80 backdrop-blur-md flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <LineChart className="w-6 h-6 text-purple-400" />
                <span className="text-xs font-bold text-purple-100">Earn</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-16 right-16 z-30 px-5 py-3 rounded-2xl border border-indigo-500/30 bg-[#0c0c16]/80 backdrop-blur-md flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <Hexagon className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-100">On-Chain</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <RegisterAgentForm />
        </section>

        {/* Footer Trust Strip */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 border-t border-white/5 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-cyan-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Build the Future of AI + Web3</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Decentralized & Transparent</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Global Marketplace</span>
            </div>
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-green-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Earn from Your Creations</span>
            </div>
          </div>
        </section>

      </PageWrapper>
    </div>
  )
}
