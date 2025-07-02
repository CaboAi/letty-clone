import React, { useState } from 'react';
import { Save, Globe, Clock, DollarSign, Calendar } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockLocalizationSettings } from '../data/mockData';
import { LocalizationSettings } from '../types';

const LocalizationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<LocalizationSettings>(mockLocalizationSettings);
  const [isLoading, setIsLoading] = useState(false);

  const timezones = [
    { value: 'America/Mazatlan', label: 'Cabo San Lucas (MST/MDT)' },
    { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)' },
    { value: 'America/Cancun', label: 'Cancún (EST)' },
    { value: 'America/Tijuana', label: 'Tijuana (PST/PDT)' }
  ];

  const mexicanHolidays = [
    'Año Nuevo (New Year\'s Day)',
    'Día de la Constitución (Constitution Day)',
    'Natalicio de Benito Juárez (Benito Juárez\'s Birthday)',
    'Día del Trabajo (Labor Day)',
    'Día de la Independencia (Independence Day)',
    'Día de la Revolución (Revolution Day)',
    'Navidad (Christmas Day)'
  ];

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Localization settings saved successfully!');
  };

  const updateSettings = (key: keyof LocalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Localization Settings</h1>
          <p className="text-gray-600">Configure regional and cultural preferences for Cabo operations</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} icon={Save}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Time Zone Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Time Zone</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Set the primary time zone for scheduling and notifications</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {timezones.map((timezone) => (
                <label key={timezone.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timezone"
                    value={timezone.value}
                    checked={settings.timezone === timezone.value}
                    onChange={() => updateSettings('timezone', timezone.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-900">{timezone.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current time:</strong> {new Date().toLocaleString('en-US', { 
                  timeZone: settings.timezone,
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Currency Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Currency</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Primary currency for pricing and transactions</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="currency"
                  value="MXN"
                  checked={settings.currency === 'MXN'}
                  onChange={() => updateSettings('currency', 'MXN')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Mexican Peso (MXN)</div>
                  <div className="text-sm text-gray-500">Primary for local operations</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={settings.currency === 'USD'}
                  onChange={() => updateSettings('currency', 'USD')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">US Dollar (USD)</div>
                  <div className="text-sm text-gray-500">For international customers</div>
                </div>
              </label>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Format preview:</strong> {settings.currency === 'MXN' ? '$12,450 MXN' : '$1,245 USD'}
              </p>
            </div>
          </div>
        </Card>

        {/* Mexican Holidays */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Mexican Holidays</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Automatically adjust AI responses during Mexican holidays</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mexicanHolidays}
                  onChange={(e) => updateSettings('mexicanHolidays', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Enable Holiday Recognition</div>
                  <div className="text-sm text-gray-500">AI will acknowledge holidays in responses and adjust expectations</div>
                </div>
              </label>
            </div>
            
            {settings.mexicanHolidays && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">Recognized Holidays:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {mexicanHolidays.map((holiday, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      {holiday}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-green-600 mt-2">
                  During holidays, AI responses will include appropriate greetings and adjusted response times.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Language Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Interface Language</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Language for the CaboAi dashboard interface</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="uiLanguage"
                  value="english"
                  checked={settings.uiLanguage === 'english'}
                  onChange={() => updateSettings('uiLanguage', 'english')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">English</div>
                  <div className="text-sm text-gray-500">Dashboard in English</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="uiLanguage"
                  value="spanish"
                  checked={settings.uiLanguage === 'spanish'}
                  onChange={() => updateSettings('uiLanguage', 'spanish')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Español</div>
                  <div className="text-sm text-gray-500">Panel de control en español</div>
                </div>
              </label>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This only affects the dashboard interface. AI communication language is set in AI Settings.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Regional Preferences Summary */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Configuration Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Time Zone</p>
              <p className="text-sm text-gray-600">
                {timezones.find(tz => tz.value === settings.timezone)?.label.split('(')[0].trim()}
              </p>
            </div>
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Currency</p>
              <p className="text-sm text-gray-600">{settings.currency}</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Holidays</p>
              <p className="text-sm text-gray-600">
                {settings.mexicanHolidays ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Interface</p>
              <p className="text-sm text-gray-600 capitalize">{settings.uiLanguage}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LocalizationSettingsPage;