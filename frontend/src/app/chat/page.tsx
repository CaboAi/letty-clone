'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { chatApi, ChatRequest } from '@/lib/api'
import { t } from '@/lib/i18n'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    tone?: string
    industry?: string
    language?: string
    tokens_used?: number
  }
}

interface ChatSettings {
  tone: 'professional' | 'casual' | 'friendly'
  industry: 'hospitality' | 'real_estate' | 'tourism' | 'general'
  language: 'auto' | 'es' | 'en'
  businessContext: {
    name: string
    location: string
    specialties: string
  }
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'professional',
    industry: 'hospitality',
    language: 'auto',
    businessContext: {
      name: '',
      location: 'Los Cabos',
      specialties: ''
    }
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const request: ChatRequest = {
        message: input,
        tone: settings.tone,
        industry: settings.industry,
        language: settings.language,
        user_id: session?.user?.email,
        business_context: {
          name: settings.businessContext.name,
          location: settings.businessContext.location,
          specialties: settings.businessContext.specialties.split(',').map(s => s.trim()).filter(Boolean)
        }
      }

      const response = await chatApi.sendMessage(request)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        metadata: {
          tone: response.data.tone,
          industry: response.data.industry,
          language: response.data.language,
          tokens_used: response.data.tokens_used
        }
      }

      setMessages(prev => [...prev, assistantMessage])

      if (!response.data.success && response.data.error) {
        toast.error('AI service unavailable, showing fallback response')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] bg-white rounded-lg border border-gray-200">
        {/* Settings Panel */}
        <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('chat.title')}
          </h2>

          <div className="space-y-4">
            {/* Business Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessContext.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  businessContext: { ...prev.businessContext, name: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hotel Cabo Paradise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={settings.businessContext.location}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  businessContext: { ...prev.businessContext, location: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Medano Beach, Cabo San Lucas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <textarea
                value={settings.businessContext.specialties}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  businessContext: { ...prev.businessContext, specialties: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ocean view rooms, All-inclusive packages"
                rows={2}
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('chat.tone')}
              </label>
              <select
                value={settings.tone}
                onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="professional">{t('chat.professional')}</option>
                <option value="casual">{t('chat.casual')}</option>
                <option value="friendly">{t('chat.friendly')}</option>
              </select>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('chat.industry')}
              </label>
              <select
                value={settings.industry}
                onChange={(e) => setSettings(prev => ({ ...prev, industry: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hospitality">{t('chat.hospitality')}</option>
                <option value="real_estate">{t('chat.realEstate')}</option>
                <option value="tourism">{t('chat.tourism')}</option>
                <option value="general">{t('chat.general')}</option>
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('chat.language')}
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">{t('chat.auto')}</option>
                <option value="en">{t('chat.english')}</option>
                <option value="es">{t('chat.spanish')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Start a conversation to generate AI-powered email responses</p>
                <p className="text-sm mt-2">Try: "A customer wants to book a room for 2 people next week"</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.metadata && (
                    <div className="mt-2 text-xs opacity-75">
                      <span>
                        {message.metadata.language && `${message.metadata.language.toUpperCase()} • `}
                        {message.metadata.tone && `${message.metadata.tone} • `}
                        {message.metadata.tokens_used && `${message.metadata.tokens_used} tokens`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Generating response...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                loading={loading}
                className="self-end"
              >
                {t('chat.send')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}