# CaboAi Frontend - Next.js 14 Application

Professional frontend for the CaboAi AI-powered email assistant platform, specifically designed for Los Cabos businesses.

## 🚀 Features

- **Modern Next.js 14** with App Router and TypeScript
- **Authentication System** with NextAuth.js and JWT
- **AI Chat Interface** for intelligent email generation
- **Subscription Management** with tiered pricing ($99/$299/$599)
- **Usage Analytics** and performance insights
- **Bilingual Support** (Spanish/English) for Los Cabos market
- **Industry-Specific Templates** for hospitality, real estate, and tourism
- **Responsive Design** with Tailwind CSS
- **Professional Dashboard** with comprehensive features

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## 📱 Application Structure

- **Landing Page** (`/`) - Hero section with features
- **Authentication** (`/login`, `/register`) - User management
- **Dashboard** (`/dashboard`) - Overview and statistics
- **AI Chat** (`/chat`) - Real-time AI email generation
- **Subscription** (`/subscription`) - Plan management
- **Analytics** (`/analytics`) - Usage insights

## 🎯 Key Features

### AI Chat Interface
- Real-time AI conversation
- Configurable tone and industry
- Bilingual support (Spanish/English)
- Business context settings
- Token usage tracking

### Subscription Management
- **Basic** ($99/month) - 1,000 emails
- **Professional** ($299/month) - 5,000 emails  
- **Enterprise** ($599/month) - Unlimited emails
- Feature comparison and usage tracking

## 🌍 Los Cabos Business Focus

Specialized for:
- **Hospitality** - Hotels, resorts, accommodations
- **Real Estate** - Property sales and rentals
- **Tourism** - Tours, activities, attractions

Ready for production use by Los Cabos businesses!