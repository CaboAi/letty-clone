import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockROIData } from '../data/mockData';
import { ROIData } from '../types';

const ROITracker: React.FC = () => {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('monthly');
  const [roiData] = useState<ROIData>(mockROIData);

  // Mock chart data - in a real app, this would come from your analytics service
  const chartData = {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      timeSaved: [12, 15, 18, 22, 25, 24],
      responseRate: [85, 87, 89, 92, 94, 94],
      conversion: [12, 14, 16, 17, 19, 18]
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      timeSaved: [45, 65, 72, 75],
      responseRate: [87, 91, 93, 94],
      conversion: [14, 17, 18, 19]
    }
  };

  const currentChart = chartData[period];

  const StatCard = ({ title, value, unit, change, icon: Icon, color }: {
    title: string;
    value: number;
    unit: string;
    change: string;
    icon: any;
    color: string;
  }) => (
    <Card hover>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {value}{unit}
            </p>
            <p className="text-sm text-green-600">{change}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const SimpleChart = ({ data, label, color }: { data: number[], label: string, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{data[data.length - 1]}</span>
      </div>
      <div className="flex items-end space-x-1 h-16">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col justify-end">
            <div
              className={`${color} rounded-t`}
              style={{ height: `${(value / Math.max(...data)) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        {currentChart.labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ROI Tracker</h1>
          <p className="text-gray-600">Monitor the impact and savings from AI automation</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                period === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('quarterly')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                period === 'quarterly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quarterly
            </button>
          </div>
          <Button variant="outline" icon={Calendar}>Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Time Saved"
          value={roiData.timeSaved}
          unit=" hours"
          change="+15% vs last period"
          icon={Clock}
          color="bg-blue-600"
        />
        <StatCard
          title="Response Rate"
          value={roiData.responseRate}
          unit="%"
          change="+2.3% vs last period"
          icon={TrendingUp}
          color="bg-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={roiData.conversion}
          unit="%"
          change="+1.2% vs last period"
          icon={Users}
          color="bg-purple-600"
        />
        <StatCard
          title="Dollar Savings"
          value={roiData.dollarSavings.toLocaleString()}
          unit=" MXN"
          change="+8% vs last period"
          icon={DollarSign}
          color="bg-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Time Saved (Hours)</h3>
          </div>
          <div className="p-6">
            <SimpleChart
              data={currentChart.timeSaved}
              label="Hours per period"
              color="bg-blue-500"
            />
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Response Rate (%)</h3>
          </div>
          <div className="p-6">
            <SimpleChart
              data={currentChart.responseRate}
              label="Response rate"
              color="bg-green-500"
            />
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Conversion Rate (%)</h3>
          </div>
          <div className="p-6">
            <SimpleChart
              data={currentChart.conversion}
              label="Conversion rate"
              color="bg-purple-500"
            />
          </div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cost Savings Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Staff Time Reduction</p>
                  <p className="text-sm text-gray-600">24.5 hours @ 350 MXN/hour</p>
                </div>
                <span className="text-lg font-semibold text-green-600">8,575 MXN</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Increased Conversions</p>
                  <p className="text-sm text-gray-600">12 additional bookings</p>
                </div>
                <span className="text-lg font-semibold text-green-600">3,200 MXN</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Faster Response Times</p>
                  <p className="text-sm text-gray-600">Improved customer satisfaction</p>
                </div>
                <span className="text-lg font-semibold text-green-600">675 MXN</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900">Total Monthly Savings</p>
                <span className="text-xl font-bold text-green-600">12,450 MXN</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Performance Insights</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Top Performing Channels</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">WhatsApp</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SMS</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Recommendations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    Increase WhatsApp automation to match email performance
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    Add more real estate templates to boost conversions
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    Focus on weekend inquiries for maximum impact
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROITracker;