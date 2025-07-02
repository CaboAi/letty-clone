export interface AIInteraction {
  id: string;
  type: 'chat' | 'email' | 'sms';
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  channel: string;
  summary: string;
}

export interface UsageStats {
  apiCalls: number;
  emailsProcessed: number;
  activeChannels: number;
  totalInteractions: number;
}

export interface AISettings {
  tone: 'formal' | 'friendly' | 'sales-oriented';
  language: 'english' | 'spanish';
  verbosity: number;
  preferredChannels: string[];
}

export interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: Date;
  status: 'processing' | 'ready' | 'error';
  type: string;
}

export interface Template {
  id: string;
  name: string;
  industry: 'real-estate' | 'tourism' | 'hospitality';
  description: string;
  content: string;
  lastModified: Date;
}

export interface ROIData {
  timeSaved: number;
  responseRate: number;
  conversion: number;
  dollarSavings: number;
  period: 'monthly' | 'quarterly';
}

export interface LocalizationSettings {
  timezone: string;
  currency: 'MXN' | 'USD';
  mexicanHolidays: boolean;
  uiLanguage: 'english' | 'spanish';
}

export interface AccountSettings {
  apiKeys: APIKey[];
  connectedAccounts: ConnectedAccount[];
  teamMembers: TeamMember[];
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
}

export interface ConnectedAccount {
  id: string;
  type: 'gmail' | 'outlook' | 'twilio';
  email: string;
  status: 'connected' | 'disconnected';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastActive: Date;
}