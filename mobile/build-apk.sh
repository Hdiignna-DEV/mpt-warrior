#!/bin/bash
# Build APK for direct download
# Usage: ./build-apk.sh

echo "🚀 Building MPT Warrior APK..."
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: app.json not found"
    echo "Please run this script from the mobile folder"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building APK (this may take a few minutes)..."
npx eas build --platform android --local

echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Look for the APK file in the output folder"
echo ""
echo "📱 To install on Android:"
echo "1. Transfer APK to your phone"
echo "2. Open file manager → Find APK"
echo "3. Tap to install"
echo "4. Allow installation from unknown sources"
echo ""
echo "🔗 To share:"
echo "Upload the APK file to a cloud service (Google Drive, Dropbox, etc)"
echo "Share the download link with users"
echo ""
