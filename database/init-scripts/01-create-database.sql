-- PostgreSQL Database Initialization for CaboAI
-- This script creates the initial database structure for Railway deployment

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'business_owner', 'employee', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_category AS ENUM (
        'hospitalidad', 'restaurantes', 'turismo', 'bienes_raices', 
        'transporte', 'servicios_medicos', 'entretenimiento', 'compras',
        'servicios_profesionales', 'deportes_recreacion', 'servicios_publicos'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE conversation_status AS ENUM ('active', 'waiting', 'resolved', 'escalated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'audio', 'video', 'location');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category business_category NOT NULL,
    subcategory VARCHAR(100),
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    website VARCHAR(255),
    
    -- Location
    address TEXT,
    neighborhood VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Los Cabos',
    state VARCHAR(100) DEFAULT 'Baja California Sur',
    country VARCHAR(100) DEFAULT 'México',
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business hours (JSON format)
    business_hours JSONB,
    
    -- Services and amenities
    services TEXT[],
    amenities TEXT[],
    languages TEXT[] DEFAULT ARRAY['es', 'en'],
    
    -- Pricing
    price_range VARCHAR(10),
    accepted_currencies TEXT[] DEFAULT ARRAY['MXN', 'USD'],
    
    -- AI Configuration
    ai_enabled BOOLEAN NOT NULL DEFAULT true,
    ai_personality TEXT,
    custom_responses JSONB,
    escalation_rules JSONB,
    
    -- Subscription
    subscription_plan VARCHAR(50) DEFAULT 'starter',
    subscription_active BOOLEAN NOT NULL DEFAULT true,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    timezone VARCHAR(50) DEFAULT 'America/Mazatlan',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(200),
    customer_email VARCHAR(255),
    
    -- Conversation metadata
    channel VARCHAR(50) NOT NULL DEFAULT 'whatsapp', -- whatsapp, sms, email, web
    language VARCHAR(5) NOT NULL DEFAULT 'es',
    status conversation_status NOT NULL DEFAULT 'active',
    
    -- AI handling
    ai_confidence DECIMAL(5, 4) DEFAULT 0.0000,
    requires_human BOOLEAN NOT NULL DEFAULT false,
    assigned_to UUID REFERENCES users(id),
    
    -- Business context
    intent VARCHAR(100),
    entities JSONB,
    context JSONB,
    
    -- Timing
    last_message_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'text',
    media_url VARCHAR(500),
    
    -- Sender information
    is_from_customer BOOLEAN NOT NULL,
    sender_name VARCHAR(200),
    
    -- AI processing
    processed_by_ai BOOLEAN NOT NULL DEFAULT false,
    ai_response_time_ms INTEGER,
    ai_confidence DECIMAL(5, 4),
    
    -- Message metadata
    external_id VARCHAR(255), -- For WhatsApp/SMS message IDs
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Business analytics table
CREATE TABLE IF NOT EXISTS business_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Conversation metrics
    total_conversations INTEGER DEFAULT 0,
    new_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    escalated_conversations INTEGER DEFAULT 0,
    
    -- Message metrics
    total_messages INTEGER DEFAULT 0,
    ai_messages INTEGER DEFAULT 0,
    human_messages INTEGER DEFAULT 0,
    
    -- Response metrics
    avg_response_time_seconds INTEGER DEFAULT 0,
    avg_resolution_time_minutes INTEGER DEFAULT 0,
    customer_satisfaction_score DECIMAL(3, 2),
    
    -- Business metrics
    leads_generated INTEGER DEFAULT 0,
    bookings_made INTEGER DEFAULT 0,
    revenue_generated DECIMAL(12, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(business_id, date)
);

-- Knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    
    -- Language and localization
    language VARCHAR(5) NOT NULL DEFAULT 'es',
    
    -- AI processing
    embedding VECTOR(1536), -- For semantic search (if using pgvector)
    
    -- Metadata
    is_active BOOLEAN NOT NULL DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Key information
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_preview VARCHAR(20) NOT NULL, -- First few characters for display
    
    -- Permissions
    permissions JSONB NOT NULL DEFAULT '[]',
    rate_limit INTEGER DEFAULT 1000,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_businesses_subscription ON businesses(subscription_plan, subscription_active);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_business_id ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_phone ON conversations(customer_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

CREATE INDEX IF NOT EXISTS idx_analytics_business_date ON business_analytics(business_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON business_analytics(date);

CREATE INDEX IF NOT EXISTS idx_knowledge_business_id ON knowledge_base(business_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_language ON knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON knowledge_base(is_active);

CREATE INDEX IF NOT EXISTS idx_api_keys_business_id ON api_keys(business_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_businesses_name_search ON businesses USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_knowledge_content_search ON knowledge_base USING gin(to_tsvector('spanish', title || ' ' || content));

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();