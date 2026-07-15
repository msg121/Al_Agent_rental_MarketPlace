'use client'

import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { RegisterAgentForm } from '@/components/agents/RegisterAgentForm'

export default function RegisterAgentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RegisterAgentForm />
        </div>
      </PageWrapper>
    </div>
  )
}
