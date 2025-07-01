import axios from 'axios'
import { getSession } from 'next-auth/react'

// Backend API client
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AI Service API client
export const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// Types for API responses
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ChatRequest {
  message: string
  tone: 'professional' | 'casual' | 'friendly'
  industry: 'hospitality' | 'real_estate' | 'tourism' | 'general'
  language: 'auto' | 'es' | 'en'
  user_id?: string
  business_context?: {
    name?: string
    location?: string
    specialties?: string[]
    contact?: string
    website?: string
  }
}

export interface ChatResponse {
  response: string
  tone: string
  industry: string
  language: string
  conversation_id: string
  tokens_used: number
  success: boolean
  error?: string
}

export interface UsageStats {
  total_requests: number
  total_tokens: number
  total_cost: number
  daily_average: number
  period_days: number
  endpoint_breakdown: Record<string, any>
  first_request?: string
  last_request?: string
}

// API functions
export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  getProfile: () => api.get<User>('/users/profile'),
}

export const chatApi = {
  sendMessage: (data: ChatRequest) => aiApi.post<ChatResponse>('/chat', data),
  generateEmail: (data: ChatRequest) => aiApi.post<ChatResponse>('/generate-email', data),
}

export const usageApi = {
  getStats: (userId?: string, days: number = 30) => 
    aiApi.get<UsageStats>('/usage-stats', { 
      params: { user_id: userId, days } 
    }),
  getRateLimit: (userId?: string) => 
    aiApi.get('/rate-limit-status', { 
      params: { user_id: userId } 
    }),
}

export const healthApi = {
  check: () => api.get('/health'),
  checkAI: () => aiApi.get('/health'),
}