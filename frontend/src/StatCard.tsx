import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-600'
}) => {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <Card hover className="p-4 lg:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-50 flex items-center justify-center`}>
            <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${iconColor}`} />
          </div>
        </div>
        <div className="ml-3 lg:ml-4 flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg lg:text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs lg:text-sm ${changeColorClass} truncate`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;