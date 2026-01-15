#!/bin/bash

# APK Distribution Manager
# Download dan serve APK untuk users

set -e

echo "📱 MPT Warrior APK Distribution Manager"
echo "======================================"

APK_DIR="./public/apk"
BUILD_INFO="./public/apk/build-info.json"

# Create APK directory if not exists
mkdir -p "$APK_DIR"

# Function to download APK from EAS
download_apk_from_eas() {
    local BUILD_ID=$1
    
    if [ -z "$BUILD_ID" ]; then
        echo "❌ Build ID not provided"
        echo "Usage: ./scripts/distribute-apk.sh <BUILD_ID>"
        exit 1
    fi
    
    echo "📥 Downloading APK from EAS Build #$BUILD_ID..."
    
    # Get build info from EAS API
    BUILD_INFO=$(curl -s "https://api.expo.dev/v2/builds/$BUILD_ID" \
        -H "Authorization: Bearer $EAS_BUILD_TOKEN")
    
    # Extract download URL
    DOWNLOAD_URL=$(echo $BUILD_INFO | grep -o '"artifacts":{[^}]*"url":"[^"]*' | sed 's/.*"url":"//')
    
    if [ -z "$DOWNLOAD_URL" ]; then
        echo "❌ Failed to get download URL from build"
        exit 1
    fi
    
    echo "📤 Download URL: $DOWNLOAD_URL"
    
    # Download APK
    wget "$DOWNLOAD_URL" -O "$APK_DIR/mpt-commandcenter.apk"
    
    echo "✅ APK downloaded successfully!"
    ls -lh "$APK_DIR/mpt-commandcenter.apk"
}

# Function to create build info JSON
create_build_info() {
    local VERSION=$1
    local BUILD_DATE=$2
    local FILE_SIZE=$3
    
    cat > "$BUILD_INFO" << EOF
{
  "version": "$VERSION",
  "buildDate": "$BUILD_DATE",
  "downloadUrl": "/apk/mpt-commandcenter.apk",
  "fileSize": "$FILE_SIZE",
  "platform": "android",
  "minAndroidVersion": 5.0,
  "md5": "$(md5sum "$APK_DIR/mpt-commandcenter.apk" | awk '{print $1}')"
}
EOF
    
    echo "✅ Build info saved"
    cat "$BUILD_INFO"
}

# Function to create QR code
create_qr_code() {
    local URL=$1
    
    echo "🔖 Creating QR code..."
    # Using qrcode.js or similar
    # This would be called from Next.js
}

# Main
if [ "$1" = "download" ]; then
    download_apk_from_eas "$2"
    create_build_info "1.0.1" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(du -h "$APK_DIR/mpt-commandcenter.apk" | cut -f1)"
elif [ "$1" = "info" ]; then
    echo "📄 Current Build Info:"
    cat "$BUILD_INFO" 2>/dev/null || echo "No build info found"
elif [ "$1" = "serve" ]; then
    echo "🚀 Serving APK from: http://localhost:3000/apk/mpt-commandcenter.apk"
    ls -lh "$APK_DIR"
else
    echo "Usage:"
    echo "  ./scripts/distribute-apk.sh download <BUILD_ID>"
    echo "  ./scripts/distribute-apk.sh info"
    echo "  ./scripts/distribute-apk.sh serve"
fi
