'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { usageApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface AnalyticsData {
  totalRequests: number
  totalTokens: number
  totalCost: number
  dailyAverage: number
  endpointBreakdown: Record<string, any>
  firstRequest?: string
  lastRequest?: string
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData>({
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    dailyAverage: 0,
    endpointBreakdown: {}
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await usageApi.getStats(session?.user?.email, timeRange)
        setData({
          totalRequests: response.data.total_requests,
          totalTokens: response.data.total_tokens,
          totalCost: response.data.total_cost,
          dailyAverage: response.data.daily_average,
          endpointBreakdown: response.data.endpoint_breakdown,
          firstRequest: response.data.first_request,
          lastRequest: response.data.last_request
        })
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchAnalytics()
    }
  }, [session, timeRange])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">
              Usage insights and performance metrics
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Requests"
            value={data.totalRequests.toLocaleString()}
            icon="📊"
            color="blue"
          />
          <MetricCard
            title="Tokens Used"
            value={data.totalTokens.toLocaleString()}
            icon="🔢"
            color="green"
          />
          <MetricCard
            title="Total Cost"
            value={formatCurrency(data.totalCost)}
            icon="💰"
            color="purple"
          />
          <MetricCard
            title="Daily Average"
            value={data.dailyAverage.toFixed(1)}
            icon="📈"
            color="orange"
          />
        </div>

        {/* Endpoint Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usage by Endpoint
          </h2>
          <div className="space-y-4">
            {Object.entries(data.endpointBreakdown).map(([endpoint, stats]: [string, any]) => (
              <div key={endpoint} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{endpoint}</h3>
                  <p className="text-sm text-gray-600">
                    {stats.requests} requests • {stats.tokens.toLocaleString()} tokens
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stats.cost)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {((stats.requests / data.totalRequests) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usage Timeline
          </h2>
          <div className="space-y-4">
            {data.firstRequest && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">First Request</span>
                <span className="font-medium">{formatDate(data.firstRequest)}</span>
              </div>
            )}
            {data.lastRequest && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Request</span>
                <span className="font-medium">{formatDate(data.lastRequest)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Period Covered</span>
              <span className="font-medium">{timeRange} days</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Insights
          </h2>
          <div className="space-y-2 text-blue-800">
            <p>• Your average cost per request is {formatCurrency(data.totalCost / data.totalRequests || 0)}</p>
            <p>• You're averaging {data.dailyAverage.toFixed(1)} requests per day</p>
            <p>• Most used endpoint: {Object.keys(data.endpointBreakdown)[0] || 'N/A'}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function MetricCard({ title, value, icon, color }: {
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}