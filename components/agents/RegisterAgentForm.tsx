'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerAgentSchema, type RegisterAgentFormData, AGENT_CATEGORIES } from '@/lib/validations'
import { useRegisterAgent } from '@/hooks/useRegisterAgent'
import { useWeb3 } from '@/hooks/useWeb3'
import { Bot, Loader2, CheckCircle2, ArrowRight, PenTool, LayoutGrid, Type, Wallet, Calendar, ShieldCheck, ChevronDown, CloudUpload, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function RegisterAgentForm() {
  const { registerAgent, loading, isSuccess } = useRegisterAgent()
  const { isConnected, openModal } = useWeb3()
  const [charCount, setCharCount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterAgentFormData>({
    resolver: zodResolver(registerAgentSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      accessInfo: '',
      priceUsdt: '',
      durationDays: 30,
    },
  })

  const selectedCategory = watch('category')

  const onSubmit = async (data: RegisterAgentFormData) => {
    if (!isConnected) {
      openModal({ view: 'Connect' })
      return
    }
    await registerAgent(data)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CheckCircle2 className="h-10 w-10 text-cyan-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Agent Listed!</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your AI agent is now live on the marketplace. Renters can now discover and access it securely on-chain.
        </p>
        <Link 
          href="/browse"
          className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          Browse Marketplace <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Agent Name */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/90 shadow-lg backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50" />
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="name" className="text-lg font-bold text-white mb-1 block">Agent Name</label>
              <p className="text-sm text-slate-400 mb-4">Give your AI agent a unique and memorable name.</p>
              <input
                id="name"
                placeholder="e.g., GPT-4 Code Architect"
                {...register('name')}
                className="block w-full px-5 py-4 bg-[#0f172a]/60 border-2 border-cyan-500/20 rounded-full leading-5 text-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-base transition-all hover:bg-[#0f172a]/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              />
              {errors.name && <p className="text-xs text-red-400 mt-2 ml-4">{errors.name.message}</p>}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/90 shadow-lg backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500/50" />
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
              <LayoutGrid className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 w-full">
              <label className="text-lg font-bold text-white mb-1 block">Category</label>
              <p className="text-sm text-slate-400 mb-4">Select the category that best describes your AI agent.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {AGENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue('category', cat, { shouldValidate: true })}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 text-left ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-[#0f172a]/40 border-slate-700/50 text-slate-300 hover:border-purple-500/50 hover:bg-[#0f172a]/80 hover:text-white'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedCategory === cat ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-500'}`} />
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-red-400 mt-2 ml-4">{errors.category.message}</p>}
            </div>
          </div>
        </div>

        {/* Description & Access Info */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/90 shadow-lg backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/50" />
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
              <Type className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="description" className="text-lg font-bold text-white mb-1 block">Description</label>
              <p className="text-sm text-slate-400 mb-4">Describe what your AI agent does, its capabilities, and how users benefit from renting it.</p>
              
              <div className="relative">
                <textarea
                  id="description"
                  placeholder="e.g., This AI agent helps developers write, debug and optimize code. It supports multiple programming languages..."
                  {...register('description', {
                    onChange: (e) => setCharCount(e.target.value.length)
                  })}
                  rows={5}
                  className="block w-full px-5 py-4 bg-[#0f172a]/60 border-2 border-blue-500/20 rounded-2xl leading-relaxed text-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-[#0f172a]/80"
                />
                <div className="absolute bottom-4 right-5 text-xs text-slate-400 font-mono font-bold bg-[#0c0c16] px-2 py-1 rounded-md border border-white/5">
                  {charCount}/1000
                </div>
              </div>
              {errors.description && <p className="text-xs text-red-400 mt-2 ml-4">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="accessInfo" className="text-lg font-bold text-white mb-1 block">Access Information</label>
              <p className="text-sm text-slate-400 mb-4">Securely encrypted API endpoint or key. Only revealed to active renters.</p>
              
              <input
                id="accessInfo"
                placeholder="https://api.example.com/your-agent?key=..."
                {...register('accessInfo')}
                className="block w-full px-5 py-4 bg-[#0f172a]/60 border-2 border-indigo-500/20 rounded-full leading-5 text-indigo-300 font-mono font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-[#0f172a]/80"
              />
              {errors.accessInfo && <p className="text-xs text-red-400 mt-2 ml-4">{errors.accessInfo.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 md:p-8 rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/90 shadow-lg backdrop-blur-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-full bg-green-500/50" />
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="priceUsdt" className="text-lg font-bold text-white mb-1 block">Pricing</label>
                <p className="text-sm text-slate-400 mb-4">Set your rental price per hour (in M).</p>
                
                <div className="flex items-center rounded-full bg-[#0f172a]/60 border-2 border-green-500/20 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 overflow-hidden pr-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-[#0f172a]/80">
                  <div className="pl-4 pr-3 py-3.5 border-r border-green-500/20 flex items-center gap-2 bg-green-950/30">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-[10px] shadow-[0_0_10px_rgba(34,197,94,0.4)]">M</div>
                    <span className="text-sm font-bold text-green-100">M Token</span>
                  </div>
                  <input
                    id="priceUsdt"
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                    {...register('priceUsdt')}
                    className="block w-full px-4 py-3.5 bg-transparent leading-5 font-mono text-white text-lg font-medium placeholder-slate-500 focus:outline-none"
                  />
                  <div className="pl-2 pr-4 text-slate-400 font-bold border-l border-green-500/20">/hr</div>
                </div>
                {errors.priceUsdt && <p className="text-xs text-red-400 mt-2 ml-2">{errors.priceUsdt.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-2xl border border-[#1a1a2e] bg-[#0c0c16]/90 shadow-lg backdrop-blur-xl relative overflow-hidden group hover:border-pink-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-full bg-pink-500/50" />
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="durationDays" className="text-lg font-bold text-white mb-1 block">Rental Duration</label>
                <p className="text-sm text-slate-400 mb-4">Set maximum access duration.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute -top-2.5 left-4 bg-[#0c0c16] px-1.5 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider rounded border border-white/5 z-10">Duration</span>
                    <div className="flex items-center rounded-xl bg-[#0f172a]/60 border-2 border-pink-500/20 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500 overflow-hidden pr-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-[#0f172a]/80 transition-all">
                      <input
                        id="durationDays"
                        type="number"
                        placeholder="30"
                        {...register('durationDays', { valueAsNumber: true })}
                        className="block w-full px-4 py-4 bg-transparent leading-5 font-mono text-white text-lg font-medium placeholder-slate-500 focus:outline-none"
                      />
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-2.5 left-4 bg-[#0c0c16] px-1.5 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider rounded border border-white/5 z-10">Availability</span>
                    <div className="flex items-center rounded-xl bg-[#0f172a]/30 border-2 border-[#1a1a2e] px-4 py-4 cursor-not-allowed opacity-80">
                      <Clock className="w-5 h-5 text-slate-500 mr-2" />
                      <span className="text-sm font-semibold text-slate-400">Always</span>
                    </div>
                  </div>
                </div>
                {errors.durationDays && <p className="text-xs text-red-400 mt-2 ml-2">{errors.durationDays.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_40px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative flex items-center gap-3 drop-shadow-md">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <CloudUpload className="h-6 w-6" />
              )}
              {isConnected ? 'List Agent On-Chain' : 'Connect Wallet to Register'}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="text-center text-xs font-medium text-slate-400 mt-5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Your agent will be verified and listed on the blockchain.
          </p>
        </div>
      </form>
    </motion.div>
  )
}
