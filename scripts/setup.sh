#!/bin/bash

# StarLord2 × SKYNT LaunchNFT Deployment Script
# This script handles first-time deployment and setup

set -e

echo "════════════════════════════════════════════════════════"
echo "StarLord2 × SKYNT LaunchNFT Ecosystem Deployment"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file. Please edit it with your configuration.${NC}"
    echo ""
fi

# Install root dependencies
echo -e "${BLUE}📦 Installing root dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Compile smart contracts
echo -e "${BLUE}🔨 Compiling smart contracts...${NC}"
npm run compile

# Check if user wants to deploy contracts
echo ""
read -p "Deploy smart contracts to local network? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Start Hardhat node in background
    echo -e "${BLUE}🚀 Starting Hardhat node...${NC}"
    npm run node &
    NODE_PID=$!
    sleep 5
    
    # Deploy contracts
    echo -e "${BLUE}🚀 Deploying contracts...${NC}"
    npm run deploy:localhost
    
    echo -e "${GREEN}✅ Contracts deployed!${NC}"
    echo -e "${YELLOW}⚠️  Hardhat node is running in background (PID: $NODE_PID)${NC}"
    echo -e "${YELLOW}⚠️  Stop it with: kill $NODE_PID${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping contract deployment${NC}"
fi

# Check deployed_admin.json
if [ -f deployed_admin.json ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment data found:${NC}"
    cat deployed_admin.json | grep -E '(address|phiValue)' || true
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Update .env with deployed contract addresses"
echo "2. Start backend:  cd backend && npm start"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Or use PM2:"
echo "  pm2 start ecosystem.config.js"
echo ""
echo "Happy launching! 🚀"
