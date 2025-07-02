import React from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Activity,
  TrendingUp,
  Brain,
  FileText,
  BarChart3
} from 'lucide-react';
import Card from '../components/shared/Card';
import StatCard from '../components/shared/StatCard';
import Button from '../components/shared/Button';
import { mockInteractions, mockUsageStats, mockAISettings } from '../data/mockData';

const Dashboard: React.FC = () => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'chat': return MessageSquare;
      case 'sms': return Smartphone;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm lg:text-base text-gray-600">Overview of your AI communications platform</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button variant="outline" icon={FileText} size="sm" className="w-full sm:w-auto">
            View Reports
          </Button>
          <Button icon={Brain} size="sm" className="w-full sm:w-auto">
            Customize AI
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard
          title="API Calls Used"
          value={mockUsageStats.apiCalls.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={Activity}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Emails Processed"
          value={mockUsageStats.emailsProcessed}
          change="+8% from last month"
          changeType="positive"
          icon={Mail}
          iconColor="text-green-600"
        />
        <StatCard
          title="Active Channels"
          value={mockUsageStats.activeChannels}
          change="2 new this month"
          changeType="positive"
          icon={MessageSquare}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Interactions"
          value={mockUsageStats.totalInteractions.toLocaleString()}
          change="+18% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
        {/* Recent AI Interactions */}
        <div className="xl:col-span-2">
          <Card>
            <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-medium text-gray-900">Recent AI Interactions</h3>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-3 lg:space-y-4">
                {mockInteractions.map((interaction) => {
                  const Icon = getChannelIcon(interaction.type);
                  return (
                    <div key={interaction.id} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {interaction.summary}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          {interaction.channel} • {formatTimeAgo(interaction.timestamp)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interaction.status)}`}>
                          {interaction.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 lg:mt-6">
                <Button variant="outline" className="w-full" size="sm">
                  View All Interactions
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* AI Settings Summary */}
          <Card>
            <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-medium text-gray-900">AI Settings</h3>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {mockAISettings.tone.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Language</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {mockAISettings.language}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verbosity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAISettings.verbosity}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Channels</span>
                  <span className="text-sm font-medium text-gray-900">
                    {mockAISettings.preferredChannels.length}
                  </span>
                </div>
              </div>
              <div className="mt-4 lg:mt-6">
                <Button variant="outline" className="w-full" size="sm">
                  Modify Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-2 lg:space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={Brain} size="sm">
                  Customize AI
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={FileText} size="sm">
                  Upload Documents
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={BarChart3} size="sm">
                  View ROI Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;