#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up environment files for CV Builder...${NC}"

# Copy the root .env file
echo -e "Copying frontend environment template to .env..."
cp env.template .env
echo -e "${GREEN}✓ Frontend .env created${NC}"

# Copy the server .env file
echo -e "Copying server environment template to server/.env..."
cp server.env.template server/.env
echo -e "${GREEN}✓ Server .env created${NC}"

echo -e "\n${YELLOW}IMPORTANT:${NC} Please edit the .env files and replace placeholder values with your actual secrets!"
echo -e "Frontend .env: $(pwd)/.env"
echo -e "Server .env: $(pwd)/server/.env"

echo -e "\n${GREEN}Environment setup complete!${NC}" 