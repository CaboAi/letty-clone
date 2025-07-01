'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { t } from '@/lib/i18n'
import { formatCurrency } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month'
  features: string[]
  popular?: boolean
  current?: boolean
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    interval: 'month',
    features: [
      '1,000 AI-generated emails per month',
      'Basic email templates',
      'Standard support',
      'Spanish & English support',
      'Basic analytics'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    interval: 'month',
    popular: true,
    current: true,
    features: [
      '5,000 AI-generated emails per month',
      'Advanced email templates',
      'Priority support',
      'Spanish & English support',
      'Advanced analytics',
      'Industry-specific templates',
      'Conversation memory',
      'Tone customization'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    interval: 'month',
    features: [
      'Unlimited AI-generated emails',
      'Custom email templates',
      'Dedicated support',
      'Spanish & English support',
      'Advanced analytics & reporting',
      'Industry-specific templates',
      'Advanced conversation memory',
      'Custom tone training',
      'API access',
      'White-label options'
    ]
  }
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    try {
      // Here you would integrate with Stripe or your payment processor
      console.log('Upgrading to plan:', planId)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Handle successful upgrade
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('subscription.title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Scale your Los Cabos business with AI-powered email automation
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onUpgrade={handleUpgrade}
              loading={loading === plan.id}
            />
          ))}
        </div>

        {/* Usage Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Current Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">1,247</p>
              <p className="text-sm text-blue-700">Emails Generated This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">12,450</p>
              <p className="text-sm text-blue-700">Total Tokens Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">$37.35</p>
              <p className="text-sm text-blue-700">Est. Cost This Month</p>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Feature Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <FeatureRow 
                  feature="Monthly Email Limit"
                  basic="1,000"
                  professional="5,000"
                  enterprise="Unlimited"
                />
                <FeatureRow 
                  feature="Industry Templates"
                  basic="Basic"
                  professional="✓"
                  enterprise="✓ + Custom"
                />
                <FeatureRow 
                  feature="Conversation Memory"
                  basic="✗"
                  professional="✓"
                  enterprise="Advanced"
                />
                <FeatureRow 
                  feature="API Access"
                  basic="✗"
                  professional="✗"
                  enterprise="✓"
                />
                <FeatureRow 
                  feature="Support Level"
                  basic="Standard"
                  professional="Priority"
                  enterprise="Dedicated"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function PlanCard({ plan, onUpgrade, loading }: {
  plan: Plan
  onUpgrade: (planId: string) => void
  loading: boolean
}) {
  return (
    <div className={`relative bg-white border-2 rounded-xl p-6 ${
      plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
            {t('subscription.mostPopular')}
          </span>
        </div>
      )}

      {plan.current && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full">
            {t('subscription.currentPlan')}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {t(`subscription.${plan.id}` as any) || plan.name}
        </h3>
        <div className="mt-2">
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(plan.price)}
          </span>
          <span className="text-gray-600">/{t('subscription.month')}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onUpgrade(plan.id)}
        variant={plan.current ? 'secondary' : plan.popular ? 'primary' : 'outline'}
        className="w-full"
        loading={loading}
        disabled={plan.current || loading}
      >
        {plan.current 
          ? t('subscription.currentPlan')
          : t('subscription.upgrade')
        }
      </Button>
    </div>
  )
}

function FeatureRow({ feature, basic, professional, enterprise }: {
  feature: string
  basic: string
  professional: string
  enterprise: string
}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {feature}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {basic}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {professional}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {enterprise}
      </td>
    </tr>
  )
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}