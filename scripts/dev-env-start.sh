#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file is required but not found!"
    echo "📝 Please create a .env file based on env.example"
    echo "💡 Run: cp env.example .env"
    exit 1
fi

npm install

# Determine what to run based on COMPONENT environment variable
case $COMPONENT in
  "server")
    echo "🚀 Starting TypeScript server only..."
    npm run server
    ;;
  "server:java")
    echo "☕ Starting Java server only..."
    npm run server:java
    ;;
  "client")
    echo "🎨 Starting client only..."
    npm run client
    ;;
  "build")
    echo "🔨 Building application..."
    npm run build
    npm run server:build
    ;;
  "preview")
    echo "🔨 Building and serving production build..."
    npm run build
    npm run server:build
    npm run server:prod &
    npm run preview
    ;;
  "dev:java")
    echo "☕ Running with Java server + client..."
    npm run dev:java
    ;;
  *)
    echo "🚀 Starting full development mode (TypeScript server + client)..."
    npm run dev
    ;;
esac
