import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockAISettings } from '../data/mockData';
import { AISettings } from '../types';

const AISettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AISettings>(mockAISettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message (would use toast in real app)
    alert('Settings saved successfully!');
  };

  const handleToneChange = (tone: AISettings['tone']) => {
    setSettings(prev => ({ ...prev, tone }));
  };

  const handleLanguageChange = (language: AISettings['language']) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const handleVerbosityChange = (verbosity: number) => {
    setSettings(prev => ({ ...prev, verbosity }));
  };

  const handleChannelToggle = (channel: string) => {
    setSettings(prev => ({
      ...prev,
      preferredChannels: prev.preferredChannels.includes(channel)
        ? prev.preferredChannels.filter(c => c !== channel)
        : [...prev.preferredChannels, channel]
    }));
  };

  const channels = [
    { id: 'email', label: 'Email', description: 'Gmail, Outlook integration' },
    { id: 'whatsapp', label: 'WhatsApp', description: 'WhatsApp Business API' },
    { id: 'sms', label: 'SMS', description: 'Twilio SMS integration' },
    { id: 'chat', label: 'Live Chat', description: 'Website chat widget' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Settings</h1>
          <p className="text-gray-600">Configure your AI communication preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={RefreshCw}>Reset to Default</Button>
          <Button onClick={handleSave} disabled={isLoading} icon={Save}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tone Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Communication Tone</h3>
            <p className="text-sm text-gray-600">Choose how your AI communicates with clients</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(['formal', 'friendly', 'sales-oriented'] as const).map((tone) => (
                <label key={tone} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={settings.tone === tone}
                    onChange={() => handleToneChange(tone)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {tone.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tone === 'formal' && 'Professional and business-like communication'}
                      {tone === 'friendly' && 'Warm and approachable messaging'}
                      {tone === 'sales-oriented' && 'Persuasive and conversion-focused'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Language Settings</h3>
            <p className="text-sm text-gray-600">Select primary communication language</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(['english', 'spanish'] as const).map((language) => (
                <label key={language} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={language}
                    checked={settings.language === language}
                    onChange={() => handleLanguageChange(language)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {language}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'english' && 'Primary language for communications'}
                      {language === 'spanish' && 'Español para comunicaciones locales'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Verbosity Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Response Length</h3>
            <p className="text-sm text-gray-600">Control how detailed AI responses should be</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Concise</span>
                <span className="text-sm text-gray-600">Detailed</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.verbosity}
                onChange={(e) => handleVerbosityChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center">
                <span className="text-lg font-semibold text-blue-600">{settings.verbosity}%</span>
              </div>
              <div className="text-sm text-gray-500 text-center">
                {settings.verbosity < 30 && 'Brief, to-the-point responses'}
                {settings.verbosity >= 30 && settings.verbosity < 70 && 'Balanced detail level'}
                {settings.verbosity >= 70 && 'Comprehensive, detailed responses'}
              </div>
            </div>
          </div>
        </Card>

        {/* Channel Preferences */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Preferred Channels</h3>
            <p className="text-sm text-gray-600">Select which communication channels to enable</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {channels.map((channel) => (
                <label key={channel.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preferredChannels.includes(channel.id)}
                    onChange={() => handleChannelToggle(channel.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {channel.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {channel.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Response Preview</h3>
          <p className="text-sm text-gray-600">See how your AI will respond with current settings</p>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Sample customer question:</p>
            <p className="text-sm font-medium text-gray-900 mb-4">
              "I'm interested in booking a beachfront villa for next weekend. What are your availability and rates?"
            </p>
            <p className="text-sm text-gray-600 mb-2">AI Response ({settings.tone}, {settings.verbosity}% detail):</p>
            <div className="bg-white border rounded-md p-3">
              <p className="text-sm text-gray-900">
                {settings.tone === 'formal' && settings.verbosity < 50 && 
                  "Thank you for your inquiry. We have beachfront villas available for next weekend. Please contact us for specific rates and booking details."}
                {settings.tone === 'friendly' && settings.verbosity >= 50 && 
                  "Hi there! Thanks for reaching out about our beachfront villas. I'd love to help you find the perfect place for your weekend getaway! We do have some availability for next weekend. Our beachfront villas feature stunning ocean views, private beach access, and all the amenities you need for a relaxing stay. Rates vary depending on the specific property and dates. I'd be happy to check our availability and provide you with detailed pricing. Would you like me to send you some options?"}
                {settings.tone === 'sales-oriented' && 
                  "Great choice! Our beachfront villas are in high demand, especially for weekends. I have limited availability for next weekend - these premium properties book quickly! With direct beach access and luxury amenities, they offer exceptional value. Let me secure one of our best units for you before they're gone. Special weekend packages starting at competitive rates. Shall I reserve your preferred dates now?"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AISettingsPage;