#!/bin/bash
# MPT Warrior - APK Build Guide (EAS)

echo "╔════════════════════════════════════════════╗"
echo "║  MPT Warrior APK Build - EAS Build Service║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if logged in
eas whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged into EAS"
    echo "Login with: eas login"
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Check app.json
if ! grep -q '"projectId"' mobile/app.json; then
    echo "❌ projectId not found in app.json"
    echo "Run: eas init"
    exit 1
fi

PROJECT_ID=$(grep -o '"projectId": "[^"]*"' mobile/app.json | cut -d'"' -f4)
echo "✅ Project ID: $PROJECT_ID"
echo ""

echo "📋 Build Options:"
echo "  1. Build APK (production)"
echo "  2. Build APK (preview)"
echo "  3. View build status"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting production build..."
        echo "   This may take 5-10 minutes"
        echo ""
        cd mobile
        eas build --platform android --profile production
        echo ""
        echo "✅ Build queued!"
        echo "📊 Track progress: https://build.eas.io/projects/$PROJECT_ID"
        ;;
    2)
        echo ""
        echo "🚀 Starting preview build..."
        cd mobile
        eas build --platform android --profile preview
        echo ""
        echo "✅ Build queued!"
        echo "📊 Track progress: https://build.eas.io/projects/$PROJECT_ID"
        ;;
    3)
        echo "📊 Build Status:"
        echo "🔗 https://build.eas.io/projects/$PROJECT_ID"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "💡 Next steps:"
echo "  1. Go to: https://build.eas.io/projects/$PROJECT_ID"
echo "  2. Wait for build to complete"
echo "  3. Download APK"
echo "  4. Share with users"
echo ""
