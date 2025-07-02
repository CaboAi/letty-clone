import { AIInteraction, UsageStats, AISettings, Document, Template, ROIData, LocalizationSettings, AccountSettings } from '../types';

export const mockInteractions: AIInteraction[] = [
  {
    id: '1',
    type: 'email',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'completed',
    channel: 'Gmail',
    summary: 'Property inquiry response for beachfront villa'
  },
  {
    id: '2',
    type: 'chat',
    timestamp: new Date('2024-01-15T09:45:00'),
    status: 'completed',
    channel: 'WhatsApp',
    summary: 'Tour booking assistance for family vacation'
  },
  {
    id: '3',
    type: 'sms',
    timestamp: new Date('2024-01-15T08:20:00'),
    status: 'pending',
    channel: 'Twilio',
    summary: 'Restaurant reservation confirmation'
  }
];

export const mockUsageStats: UsageStats = {
  apiCalls: 1247,
  emailsProcessed: 89,
  activeChannels: 5,
  totalInteractions: 1556
};

export const mockAISettings: AISettings = {
  tone: 'friendly',
  language: 'english',
  verbosity: 70,
  preferredChannels: ['email', 'whatsapp', 'sms']
};

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Property_Listings_2024.pdf',
    size: '2.4 MB',
    uploadDate: new Date('2024-01-10'),
    status: 'ready',
    type: 'PDF'
  },
  {
    id: '2',
    name: 'Tour_Packages.docx',
    size: '1.8 MB',
    uploadDate: new Date('2024-01-12'),
    status: 'processing',
    type: 'Word'
  },
  {
    id: '3',
    name: 'FAQ_Database.xlsx',
    size: '950 KB',
    uploadDate: new Date('2024-01-14'),
    status: 'ready',
    type: 'Excel'
  }
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Property Inquiry Response',
    industry: 'real-estate',
    description: 'Automated response for property inquiries',
    content: 'Thank you for your interest in our property...',
    lastModified: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Tour Booking Confirmation',
    industry: 'tourism',
    description: 'Confirmation template for tour bookings',
    content: 'We are excited to confirm your tour booking...',
    lastModified: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Restaurant Reservation',
    industry: 'hospitality',
    description: 'Restaurant reservation management',
    content: 'Your reservation has been confirmed...',
    lastModified: new Date('2024-01-14')
  }
];

export const mockROIData: ROIData = {
  timeSaved: 24.5,
  responseRate: 94.2,
  conversion: 18.7,
  dollarSavings: 12450,
  period: 'monthly'
};

export const mockLocalizationSettings: LocalizationSettings = {
  timezone: 'America/Mazatlan',
  currency: 'MXN',
  mexicanHolidays: true,
  uiLanguage: 'english'
};

export const mockAccountSettings: AccountSettings = {
  apiKeys: [
    {
      id: '1',
      name: 'Production API',
      key: 'cabo_api_***************',
      created: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Development API',
      key: 'cabo_dev_***************',
      created: new Date('2024-01-05')
    }
  ],
  connectedAccounts: [
    {
      id: '1',
      type: 'gmail',
      email: 'info@caboai.com',
      status: 'connected'
    },
    {
      id: '2',
      type: 'twilio',
      email: 'sms@caboai.com',
      status: 'connected'
    }
  ],
  teamMembers: [
    {
      id: '1',
      name: 'Maria Rodriguez',
      email: 'maria@caboai.com',
      role: 'admin',
      lastActive: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Carlos Mendez',
      email: 'carlos@caboai.com',
      role: 'editor',
      lastActive: new Date('2024-01-14')
    }
  ]
};