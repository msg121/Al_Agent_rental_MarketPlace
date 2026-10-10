'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { useWeb3 } from '@/hooks/useWeb3'
import { getReadProvider, getMarketplaceContract, CONTRACT_ADDRESS } from '@/lib/contract'
import { useTransactionStore } from '@/store/transactionStore'
import { formatUsdt, truncateAddress } from '@/lib/utils'
import { useWithdrawEarnings } from '@/hooks/useWithdrawEarnings'
import { 
  Wallet, DollarSign, TrendingUp, Shield, ArrowDownToLine, 
  Zap, Clock, ArrowUpRight, ArrowDownRight, Activity, Calendar, History, BarChart2, CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { useTransactions } from '@/hooks/useTransactions'
import { getTxUrl } from '@/lib/contract'

export default function EarningsPage() {
  const { address, isConnected, openModal } = useWeb3()
  const { transactions, isLoading: isTxsLoading } = useTransactions()
  
  // Earnings Data Logic
  const [providerEarnings, setProviderEarnings] = useState(0n)
  const [platformFees, setPlatformFees] = useState(0n)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const useMock = !CONTRACT_ADDRESS

  const fetchEarnings = useCallback(async () => {
    if (useMock || !isConnected || !address) return
    setIsLoading(true)
    try {
      const contract = getMarketplaceContract(getReadProvider())
      const pEarnings = (await contract.earnings(address)) as bigint
      setProviderEarnings(pEarnings)
      
      const ownerAddr = await contract.owner()
      const ownerStatus = ownerAddr.toLowerCase() === address.toLowerCase()
      setIsOwner(ownerStatus)
      
      if (ownerStatus) {
        const fees = (await contract.totalPlatformFees()) as bigint
        setPlatformFees(fees)
      } else {
        setPlatformFees(0n)
      }
    } catch (e) {
      console.error('fetchEarnings:', e)
    } finally {
      setIsLoading(false)
    }
  }, [useMock, isConnected, address])

  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger)
  useEffect(() => { fetchEarnings() }, [fetchEarnings, refreshTrigger])

  const totalBalance = providerEarnings + platformFees

  // Withdraw Logic
  const { withdraw, loading: isWithdrawing } = useWithdrawEarnings()
  const handleWithdraw = async () => {
    if (!isConnected) {
      openModal({ view: 'Connect' })
      return
    }
    await withdraw()
  }

  const [activeTab, setActiveTab] = useState('earnings')

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
        <section className="relative z-10 pt-16 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Earnings</span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg font-medium">
                Track your AI agent earnings, view transaction history, and monitor your performance — all on-chain.
              </p>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:flex h-[300px] items-center justify-center"
            >
              <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[250px] h-[250px] rounded-full border border-purple-500/20 border-dashed animate-[spin_30s_linear_infinite_reverse]" />
              
              <div className="relative z-10 w-48 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <Wallet className="w-12 h-12 text-cyan-400 mb-2 drop-shadow-md" />
                <span className="font-mono text-xl font-bold text-white">M Token</span>
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 px-4 py-2 rounded-xl bg-[#0c1222]/80 border border-cyan-500/30 backdrop-blur-md shadow-lg flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center"><DollarSign className="w-4 h-4 text-cyan-400"/></div>
                <span className="text-xs font-bold text-white">+ Yield</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {!isConnected ? (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="bg-[#0c1222]/60 border border-white/5 rounded-3xl p-16 backdrop-blur-xl max-w-2xl mx-auto shadow-lg">
              <Wallet className="h-20 w-20 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Wallet Not Connected</h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Connect your wallet to securely view your earnings and withdraw your M tokens.</p>
              <button 
                onClick={() => openModal({ view: 'Connect' })} 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Wallet className="h-5 w-5" /> Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            
            {/* Summary Cards */}
            <div className={`grid grid-cols-1 ${isOwner ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-sm'} gap-6 mb-8`}>
              {/* Total Earnings (Only visible to Owner) */}
              {isOwner && (
                <div className="p-6 rounded-3xl border border-cyan-500/20 bg-[#0c1222]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Earnings</h3>
                        <p className="text-xs text-slate-500">From all your agents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                    </div>
                  </div>
                  <div className="font-mono text-4xl font-bold text-white">
                    {isLoading ? '...' : formatUsdt(providerEarnings)} <span className="text-xl text-slate-500 font-sans">M</span>
                  </div>
                </div>
              )}

              {/* Marketplace Fees (Only visible to Owner) */}
              {isOwner && (
                <div className="p-6 rounded-3xl border border-purple-500/20 bg-[#0c1222]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Marketplace Fees</h3>
                        <p className="text-xs text-slate-500">Owner Revenue</p>
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-4xl font-bold text-white">
                    {isLoading ? '...' : formatUsdt(platformFees)} <span className="text-xl text-slate-500 font-sans">M</span>
                  </div>
                </div>
              )}

              {/* Available Balance (Provider's Payment) */}
              <div className="p-6 rounded-3xl border border-green-500/20 bg-[#0c1222]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{isOwner ? 'Available Balance' : 'Your Payment'}</h3>
                      <p className="text-xs text-slate-500">Ready to withdraw</p>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-4xl font-bold text-white mb-4">
                  {isLoading ? '...' : formatUsdt(totalBalance)} <span className="text-xl text-slate-500 font-sans">M</span>
                </div>
                <button 
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || totalBalance === 0n}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#05050A] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  {isWithdrawing ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Controls & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex p-1 rounded-xl bg-[#0c1222] border border-white/5">
                <button onClick={() => setActiveTab('earnings')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'earnings' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
                  <History className="w-4 h-4" /> Earnings History
                </button>
                <button onClick={() => setActiveTab('withdraw')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'withdraw' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
                  <ArrowDownToLine className="w-4 h-4" /> Withdraw History
                </button>
                <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'stats' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
                  <BarChart2 className="w-4 h-4" /> Stats
                </button>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1222] border border-white/5 cursor-not-allowed opacity-80">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300">Last 30 Days</span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/5 bg-[#0c1222]/80 backdrop-blur-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-2xl">Date & Time</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">From / To</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 rounded-tr-2xl">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {transactions.length === 0 && !isTxsLoading && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No transactions found</td>
                      </tr>
                    )}
                    {isTxsLoading && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading history from blockchain...</td>
                      </tr>
                    )}
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tx.type === 'Rental Payment' ? 'bg-green-500/10 border-green-500/30 text-green-400' : tx.type === 'Marketplace Fee' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            {tx.type === 'Rental Payment' && <TrendingUp className="w-3 h-3" />}
                            {tx.type === 'Marketplace Fee' && <Shield className="w-3 h-3" />}
                            {tx.type === 'Withdrawal' && <ArrowDownRight className="w-3 h-3" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{tx.agent}</td>
                        <td className="px-6 py-4 font-mono text-xs">{tx.fromTo}</td>
                        <td className={`px-6 py-4 font-mono font-bold ${tx.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a href={getTxUrl(tx.fullHash)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-xs transition-colors">
                            {tx.txHash} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs text-slate-500">Showing {transactions.length} transactions</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 text-xs">&lt;</button>
                  <button className="px-3 py-1 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold">1</button>
                  <button className="px-3 py-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 text-xs">2</button>
                  <button className="px-3 py-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 text-xs">3</button>
                  <button className="px-3 py-1 rounded bg-white/5 text-slate-400 hover:bg-white/10 text-xs">&gt;</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </PageWrapper>
    </div>
  )
}
