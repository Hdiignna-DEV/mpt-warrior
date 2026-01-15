#!/usr/bin/env node

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         MPT WARRIOR - MOBILE APP BUILD WIZARD                ║
╚══════════════════════════════════════════════════════════════╝

🚀 Quick Start Guide

This script will help you build the mobile APK.

Step 1: Install Dependencies
━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd mobile
npm install --legacy-peer-deps


Step 2: Test Locally (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
npm start

Then press 'w' to preview in web browser.


Step 3: Build APK for Android
━━━━━━━━━━━━━━━━━━━━━━━━━━━
# First time only:
eas login

# Then build:
npm run build:android

or

eas build --platform android --profile production


Step 4: Monitor Build
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visit: https://expo.dev/accounts/mpt_community
(Takes 15-20 minutes)


Step 5: Download & Distribute
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Download APK from EAS dashboard
- Share with users via:
  * Email
  * Google Drive
  * WhatsApp
  * Website


📱 User Installation
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Download APK
2. Enable "Unknown Sources" in Settings
3. Open APK file → Install
4. Open app → Login with existing credentials
5. Done! ✅


🔒 Data Safety
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All existing user data is SAFE
✅ Same backend as website
✅ Same login credentials work everywhere
✅ Data syncs automatically


❓ Questions?
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read: MOBILE_BUILD_AND_RELEASE_GUIDE.md
Or:   MOBILE_APP_SETUP_GUIDE.md


👉 Ready? Run:
   cd mobile && npm install
`);
