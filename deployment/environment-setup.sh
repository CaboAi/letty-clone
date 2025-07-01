#!/bin/bash

# CaboAI Environment Setup Script for Railway Deployment
# This script helps configure environment variables for all services

set -e

echo "🚀 CaboAI Railway Deployment Environment Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

print_status "Railway CLI found"

# Login check
if ! railway whoami &> /dev/null; then
    print_warning "Not logged in to Railway"
    echo "Logging in..."
    railway login
fi

print_status "Logged in to Railway"

# Function to set environment variable
set_env_var() {
    local service=$1
    local key=$2
    local value=$3
    local required=${4:-true}
    
    if [ -z "$value" ] && [ "$required" = true ]; then
        print_error "Required variable $key is empty"
        return 1
    fi
    
    if [ -n "$value" ]; then
        railway variables set $key="$value" --service $service
        print_status "Set $key for $service"
    else
        print_warning "Skipping empty variable $key for $service"
    fi
}

# Function to generate random secret
generate_secret() {
    openssl rand -hex 32
}

echo ""
print_info "Setting up environment variables for all services..."

# Generate secrets if not provided
JWT_SECRET=${JWT_SECRET:-$(generate_secret)}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET:-$(generate_secret)}
AI_SERVICE_API_KEY=${AI_SERVICE_API_KEY:-"caboai_$(openssl rand -hex 16)"}
SECRET_KEY=${SECRET_KEY:-$(generate_secret)}

echo ""
print_info "🗄️  Setting up PostgreSQL Database..."

# Create PostgreSQL service if it doesn't exist
if ! railway status --service postgres &> /dev/null; then
    print_info "Creating PostgreSQL service..."
    railway add --template postgres
    print_status "PostgreSQL service created"
else
    print_status "PostgreSQL service already exists"
fi

echo ""
print_info "🎯 Setting up Backend Service (NestJS)..."

# Backend environment variables
print_info "Setting backend environment variables..."

set_env_var "backend" "NODE_ENV" "production"
set_env_var "backend" "PORT" "3000"
set_env_var "backend" "APP_NAME" "CaboAI Backend"

# Database connection (using Railway references)
set_env_var "backend" "DATABASE_URL" "\${{Postgres.DATABASE_URL}}"
set_env_var "backend" "PGHOST" "\${{Postgres.PGHOST}}"
set_env_var "backend" "PGPORT" "\${{Postgres.PGPORT}}"
set_env_var "backend" "PGUSER" "\${{Postgres.PGUSER}}"
set_env_var "backend" "PGPASSWORD" "\${{Postgres.PGPASSWORD}}"
set_env_var "backend" "PGDATABASE" "\${{Postgres.PGDATABASE}}"

# Security
set_env_var "backend" "JWT_SECRET" "$JWT_SECRET"
set_env_var "backend" "JWT_REFRESH_SECRET" "$JWT_REFRESH_SECRET"

# CORS
read -p "Enter your frontend URL (e.g., https://caboai.netlify.app): " FRONTEND_URL
set_env_var "backend" "CORS_ORIGIN" "$FRONTEND_URL"

# External services
read -p "Enter your OpenAI API key: " OPENAI_API_KEY
set_env_var "backend" "OPENAI_API_KEY" "$OPENAI_API_KEY"

read -p "Enter WhatsApp Business Token (optional): " WHATSAPP_TOKEN
set_env_var "backend" "WHATSAPP_TOKEN" "$WHATSAPP_TOKEN" false

read -p "Enter WhatsApp Phone Number ID (optional): " WHATSAPP_PHONE_NUMBER_ID
set_env_var "backend" "WHATSAPP_PHONE_NUMBER_ID" "$WHATSAPP_PHONE_NUMBER_ID" false

read -p "Enter SendGrid API Key (optional): " SENDGRID_API_KEY
set_env_var "backend" "SENDGRID_API_KEY" "$SENDGRID_API_KEY" false

# Los Cabos specific
read -p "Enter Currency API Key (optional): " CURRENCY_API_KEY
set_env_var "backend" "CURRENCY_API_KEY" "$CURRENCY_API_KEY" false

read -p "Enter Banxico Token (optional): " BANXICO_TOKEN
set_env_var "backend" "BANXICO_TOKEN" "$BANXICO_TOKEN" false

set_env_var "backend" "TIMEZONE" "America/Mazatlan"

# AI Service connection (will be set after AI service is created)
set_env_var "backend" "AI_SERVICE_API_KEY" "$AI_SERVICE_API_KEY"

echo ""
print_info "🤖 Setting up AI Service (FastAPI)..."

# AI Service environment variables
set_env_var "ai-service" "ENVIRONMENT" "production"
set_env_var "ai-service" "PORT" "8000"

# Security
set_env_var "ai-service" "AI_SERVICE_API_KEY" "$AI_SERVICE_API_KEY"
set_env_var "ai-service" "SECRET_KEY" "$SECRET_KEY"

# Database connection
set_env_var "ai-service" "DATABASE_URL" "\${{Postgres.DATABASE_URL}}"

# OpenAI
set_env_var "ai-service" "OPENAI_API_KEY" "$OPENAI_API_KEY"
set_env_var "ai-service" "OPENAI_MODEL" "gpt-4"

# CORS
set_env_var "ai-service" "CORS_ORIGIN" "$FRONTEND_URL"

# Los Cabos configuration
set_env_var "ai-service" "TIMEZONE" "America/Mazatlan"
set_env_var "ai-service" "DEFAULT_LANGUAGE" "es"
set_env_var "ai-service" "SUPPORTED_LANGUAGES" "es,en"

echo ""
print_info "🔗 Setting up service interconnections..."

# Wait for user to confirm services are deployed
echo ""
print_warning "Please deploy your services first, then come back to set up interconnections"
read -p "Have you deployed both backend and AI services? (y/n): " deployed

if [ "$deployed" = "y" ] || [ "$deployed" = "Y" ]; then
    # Get service URLs
    print_info "Getting service URLs..."
    
    BACKEND_URL=$(railway status --service backend --json | jq -r '.deployments[0].url // empty')
    AI_SERVICE_URL=$(railway status --service ai-service --json | jq -r '.deployments[0].url // empty')
    
    if [ -n "$BACKEND_URL" ]; then
        set_env_var "ai-service" "BACKEND_URL" "$BACKEND_URL"
        print_status "Set backend URL for AI service: $BACKEND_URL"
    fi
    
    if [ -n "$AI_SERVICE_URL" ]; then
        set_env_var "backend" "AI_SERVICE_URL" "$AI_SERVICE_URL"
        print_status "Set AI service URL for backend: $AI_SERVICE_URL"
    fi
fi

echo ""
print_info "🗄️  Database initialization..."

# Create initialization script
cat > /tmp/init_db.sql << EOF
-- Run this script in your Railway PostgreSQL database
-- You can connect using: railway connect postgres

\i database/init-scripts/01-create-database.sql
\i database/init-scripts/02-seed-data.sql
EOF

print_warning "Database initialization required!"
echo "Run these commands to initialize your database:"
echo ""
echo "1. Connect to your database:"
echo "   railway connect postgres"
echo ""
echo "2. Run initialization scripts:"
echo "   \\i database/init-scripts/01-create-database.sql"
echo "   \\i database/init-scripts/02-seed-data.sql"
echo ""

echo ""
print_status "Environment setup complete!"
echo ""
print_info "📋 Summary of what was configured:"
echo "  • PostgreSQL database with connection variables"
echo "  • Backend service with all required environment variables"
echo "  • AI service with all required environment variables"
echo "  • Service interconnection URLs (if services are deployed)"
echo "  • CORS configuration for frontend connection"
echo ""
print_info "🚀 Next steps:"
echo "  1. Deploy your services:"
echo "     railway up --service backend"
echo "     railway up --service ai-service"
echo ""
echo "  2. Initialize your database with the SQL scripts"
echo ""
echo "  3. Update service URLs if not set automatically"
echo ""
echo "  4. Test your deployment:"
echo "     curl https://your-backend.railway.app/health"
echo "     curl https://your-ai-service.railway.app/health"
echo ""

# Save configuration for reference
cat > .railway-config << EOF
# CaboAI Railway Configuration
# Generated on $(date)

FRONTEND_URL=$FRONTEND_URL
JWT_SECRET=$JWT_SECRET
AI_SERVICE_API_KEY=$AI_SERVICE_API_KEY

# Service URLs (update after deployment):
BACKEND_URL=$BACKEND_URL
AI_SERVICE_URL=$AI_SERVICE_URL

# Database initialized: NO (run SQL scripts manually)
EOF

print_status "Configuration saved to .railway-config"
print_warning "Keep your secrets safe and don't commit .railway-config to version control!"

echo ""
print_info "🎉 Railway deployment setup complete!"