#!/bin/bash

# CV Builder Admin Panel - Local Development Server
# This script starts a simple HTTP server for testing the admin panel locally

echo "🔒 Starting CV Builder Admin Panel..."
echo "   This is a secure admin interface - use admin credentials to log in"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "📡 Starting server with Python 3..."
    echo "🌐 Admin panel will be available at: http://localhost:8080"
    echo "🔑 Use your admin credentials to log in"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "📡 Starting server with Python..."
    echo "🌐 Admin panel will be available at: http://localhost:8080"
    echo "🔑 Use your admin credentials to log in"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    python -m http.server 8080
elif command -v node &> /dev/null; then
    echo "📡 Starting server with Node.js..."
    echo "🌐 Admin panel will be available at: http://localhost:8080"
    echo "🔑 Use your admin credentials to log in"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    npx http-server -p 8080 -c-1
elif command -v php &> /dev/null; then
    echo "📡 Starting server with PHP..."
    echo "🌐 Admin panel will be available at: http://localhost:8080"
    echo "🔑 Use your admin credentials to log in"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    php -S localhost:8080
else
    echo "❌ Error: No suitable server found."
    echo "   Please install one of the following:"
    echo "   - Python 3: 'brew install python3' or visit python.org"
    echo "   - Node.js: 'brew install node' or visit nodejs.org"
    echo "   - PHP: 'brew install php' or use system PHP"
    echo ""
    echo "   Or open index.html directly in your web browser."
    exit 1
fi 