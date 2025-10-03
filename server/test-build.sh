#!/bin/bash

# Build test script for local verification
echo "🧪 Testing Docker build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
docker system prune -f
rm -rf build/

echo "🔨 Building Docker image..."
docker build -t genai-backend-test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    echo "🧪 Testing image..."
    # Test run (without starting the full app)
    docker run --rm genai-backend-test node --version
    
    if [ $? -eq 0 ]; then
        echo "✅ Image test successful!"
        echo "🚀 Ready for deployment!"
    else
        echo "❌ Image test failed!"
        exit 1
    fi
else
    echo "❌ Docker build failed!"
    exit 1
fi