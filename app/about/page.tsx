'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { motion } from 'framer-motion'
import { Hexagon, ShieldCheck, Zap, Globe, Coins, BrainCircuit, ArrowRight, Database, Code2, Rocket, Network, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      <Navbar />
      <PageWrapper>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Hexagon className="h-4 w-4" />
              AgentHub Architecture
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              The Future of AI is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">On-Chain</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              AgentHub is a next-generation decentralized marketplace connecting AI developers directly with users. We eliminate middlemen, ensure transparent pricing via smart contracts, and securely host agent metadata on IPFS.
            </p>
          </motion.div>
        </section>

        {/* How It Works Diagram Section */}
        <section className="relative z-10 py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How AgentHub Works</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/50 to-cyan-500/20 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#0c1222]/90 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-cyan-500/30 transition-colors shadow-lg relative group"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Developer Lists Agent</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  AI Developers register their agents on the platform. Metadata and encrypted access keys are securely pinned to IPFS, ensuring decentralized storage.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#0c1222]/90 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-purple-500/30 transition-colors shadow-lg relative group md:-translate-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Smart Contract Escrow</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A user pays the rental fee in M Tokens. The Sepolia smart contract securely holds the funds, verifies the transaction, and instantly grants access rights.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-[#0c1222]/90 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-blue-500/30 transition-colors shadow-lg relative group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. Instant AI Access</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Upon blockchain verification, the user receives the decrypted API endpoints directly in their dashboard and can utilize the AI agent for the rented duration.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:bg-white/[0.05] transition-colors">
              <Database className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">IPFS Integration</h3>
              <p className="text-slate-400">All agent metadata, including names, descriptions, and categories, is stored immutably on the InterPlanetary File System (IPFS) via Pinata, guaranteeing no single point of failure.</p>
            </div>
            
            <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:bg-white/[0.05] transition-colors">
              <Network className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Backend Required</h3>
              <p className="text-slate-400">AgentHub runs entirely on the client-side connected directly to the Ethereum network (Sepolia). True Web3 architecture with zero centralized databases.</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:bg-white/[0.05] transition-colors">
              <Coins className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Tokenized Economy</h3>
              <p className="text-slate-400">Payments are processed instantly using our custom ERC-20 'M' Token. Providers receive 100% of their set price without any platform fees eating into their profits.</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:bg-white/[0.05] transition-colors">
              <ShieldCheck className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Trustless Ratings</h3>
              <p className="text-slate-400">Only users who have actively rented an AI agent can leave a rating on the blockchain, completely eliminating fake reviews and spam.</p>
            </div>
          </div>
        </section>

        {/* Roadmap / Future Vision */}
        <section className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0c1222]/90 border border-cyan-500/20 rounded-[40px] p-10 md:p-16 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center mb-12">
              <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Roadmap & Future Vision</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                We are building this project for a Web3 hackathon, but our vision extends far beyond. We are continuously improving the platform with cutting-edge features.
              </p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Phase 1 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <div className="w-0.5 h-full bg-cyan-500/30 my-2" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Phase 1: The Foundation (Live)</h3>
                  <p className="text-slate-400 text-sm">
                    Fully functional smart contract marketplace on Sepolia. IPFS metadata integration. Complete UI/UX redesign with a premium glassmorphism dark theme. Wallet connection, agent listing, and decentralized rentals.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                  <div className="w-0.5 h-full bg-purple-500/30 my-2" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Phase 2: AI Support & Refinement (In Progress)</h3>
                  <p className="text-slate-400 text-sm">
                    Integration of a 24/7 AI Customer Support Agent directly into the dApp to assist users with wallet connections, smart contract questions, and platform navigation. Enhanced analytics and performance tracking.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Phase 3: Multi-Chain & Mainnet</h3>
                  <p className="text-slate-500 text-sm">
                    Deploying the smart contracts to Ethereum Mainnet, Arbitrum, and Polygon. Supporting multiple tokens for payments and introducing cross-chain AI agent access protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer / Built By Section */}
        <section className="relative z-10 py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#0c1222]/80 border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-slate-400 text-sm">Built By</h2>
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 mb-5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div className="w-full h-full rounded-full bg-[#05050A] flex items-center justify-center">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">M</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">MSG</h3>
              <p className="text-sm text-cyan-400 font-medium mb-6">Web3 & AI Developer</p>
              
              <div className="flex items-center justify-center gap-4">
                <a 
                  href="https://github.com/msg121" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors group"
                >
                  <Github className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/muhammad-saad-b4439540b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to join the revolution?</h2>
          <div className="flex justify-center gap-4">
            <Link 
              href="/browse"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Explore AI Agents
            </Link>
            <Link 
              href="/agents/register"
              className="px-8 py-4 rounded-full border border-purple-500/30 bg-purple-500/10 text-white font-bold hover:bg-purple-500/20 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            >
              List Your Agent
            </Link>
          </div>
        </section>

      </PageWrapper>
    </div>
  )
}
