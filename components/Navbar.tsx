'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { WalletStatus } from '@/components/wallet/WalletStatus'
import { Bot, LayoutGrid, PlusCircle, Key, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Browse', icon: LayoutGrid },
  { href: '/agents/register', label: 'List Agent', icon: PlusCircle },
  { href: '/rentals', label: 'My Rentals', icon: Key },
  { href: '/agents/mine', label: 'My Agents', icon: Bot },
  { href: '/earnings', label: 'Earnings', icon: DollarSign },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-card border border-border/50 rounded-lg p-1.5">
                <Bot className="h-5 w-5 text-accent" />
              </div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Agent<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10 shadow-sm shadow-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <WalletStatus />
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
