#!/bin/bash

# Deripesa Installation Script

set -e

echo "🚀 Deripesa Installation Script"
echo "================================"

# Check prerequisites
echo "Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Please install Node.js 20+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required. Please install npm"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git is required. Please install git"; exit 1; }

echo "✅ Prerequisites check passed"

# Install backend
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
npm run prisma:generate

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️ Backend .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "⚠️ Please update backend/.env with your configuration"
fi

cd ..

# Install frontend
echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️ Frontend .env file not found. Copying from .env.example..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Update frontend/.env with your configuration"
echo "3. Run: npm run dev (for development)"
echo "4. Or run: docker-compose up -d (for production with Docker)"
echo ""
echo "🎉 Happy coding!"
