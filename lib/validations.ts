import { z } from 'zod'

export const registerAgentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(80, 'Name is too long (max 80 chars)'),
  description: z.string().min(20, 'Please provide more detail (min 20 chars)').max(1000, 'Description is too long (max 1000 chars)'),
  category: z.string().min(1, 'Category is required'),
  accessInfo: z.string().min(5, 'Access info is required (API key, endpoint, etc.)').max(500, 'Access info too long'),
  priceUsdt: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)), { message: 'Enter a valid number' })
    .refine((val) => parseFloat(val) >= 1, { message: 'Minimum price is 1 USDT' })
    .refine((val) => parseFloat(val) <= 100000, { message: 'Maximum price is 100,000 USDT' }),
  durationDays: z.number().min(1, 'Duration must be at least 1 day').max(365, 'Maximum duration is 365 days'),
})

export const updateAgentSchema = z.object({
  priceUsdt: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)), { message: 'Enter a valid number' })
    .refine((val) => parseFloat(val) >= 1, { message: 'Minimum price is 1 USDT' }),
  isPaused: z.boolean(),
})

export const rateAgentSchema = z.object({
  rating: z.number().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5'),
})

export type RegisterAgentFormData = z.infer<typeof registerAgentSchema>
export type UpdateAgentFormData = z.infer<typeof updateAgentSchema>
export type RateAgentFormData = z.infer<typeof rateAgentSchema>

export const AGENT_CATEGORIES = [
  'Coding Assistant',
  'Image Generation',
  'Text Generation',
  'Data Analysis',
  'Translation',
  'Customer Support',
  'Research',
  'Other',
] as const
