'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerAgentSchema, type RegisterAgentFormData, AGENT_CATEGORIES } from '@/lib/validations'
import { useRegisterAgent } from '@/hooks/useRegisterAgent'
import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function RegisterAgentForm() {
  const { registerAgent, loading, isSuccess } = useRegisterAgent()
  const { isConnected, openModal } = useWeb3()

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
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-success/20 rounded-full blur-xl" />
          <CheckCircle2 className="relative h-16 w-16 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Agent Listed!</h2>
        <p className="text-muted-foreground mb-6">Your AI agent is now live on the marketplace.</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Browse Marketplace
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">List Your AI Agent</h1>
        <p className="text-muted-foreground">Register your AI agent on the decentralized marketplace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Agent Name */}
        <Card className="bg-card/50 border-border/40">
          <CardContent className="p-6 space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">Agent Name</Label>
              <Input
                id="name"
                placeholder="e.g., GPT-4 Code Architect"
                {...register('name')}
                className="bg-background/50 border-border/50"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Category</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AGENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue('category', cat, { shouldValidate: true })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      selectedCategory === cat
                        ? 'bg-primary/15 border-primary/50 text-primary'
                        : 'bg-muted/30 border-border/30 text-muted-foreground hover:border-border/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">Description</Label>
              <textarea
                id="description"
                placeholder="Describe what your AI agent does, its capabilities, and how users benefit from renting it..."
                {...register('description')}
                rows={4}
                className="flex w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Access & Pricing */}
        <Card className="bg-card/50 border-border/40">
          <CardContent className="p-6 space-y-5">
            <div>
              <Label htmlFor="accessInfo" className="text-sm font-medium mb-2 block">Access Information</Label>
              <p className="text-xs text-muted-foreground mb-2">API endpoint, key, or instructions renters will receive after payment.</p>
              <Input
                id="accessInfo"
                placeholder="https://api.example.com/your-agent?key=..."
                {...register('accessInfo')}
                className="bg-background/50 border-border/50 font-mono text-xs"
              />
              {errors.accessInfo && <p className="text-xs text-destructive mt-1">{errors.accessInfo.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceUsdt" className="text-sm font-medium mb-2 block">Price (USDT)</Label>
                <Input
                  id="priceUsdt"
                  type="number"
                  step="0.01"
                  placeholder="25"
                  {...register('priceUsdt')}
                  className="bg-background/50 border-border/50 font-mono"
                />
                {errors.priceUsdt && <p className="text-xs text-destructive mt-1">{errors.priceUsdt.message}</p>}
              </div>
              <div>
                <Label htmlFor="durationDays" className="text-sm font-medium mb-2 block">Rental Duration (Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  placeholder="30"
                  {...register('durationDays', { valueAsNumber: true })}
                  className="bg-background/50 border-border/50 font-mono"
                />
                {errors.durationDays && <p className="text-xs text-destructive mt-1">{errors.durationDays.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent text-white h-12 text-base font-semibold shadow-lg shadow-primary/20 gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
          {isConnected ? 'Register Agent on Blockchain' : 'Connect Wallet to Register'}
        </Button>
      </form>
    </motion.div>
  )
}
