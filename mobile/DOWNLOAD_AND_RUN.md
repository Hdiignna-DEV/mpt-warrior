# 🚀 MPT Warrior - Quick Download & Run Guide

**Easy Way To Use The App**

---

## 📱 Option 1: QUICKEST - Use Expo (Recommended)

### What You Need
- Phone (iOS or Android)
- Internet connection
- Expo Go app installed

### Steps
1. **Install Expo Go** (from App Store or Play Store)
2. **Open this link** on your phone:
   ```
   exp://YOUR_EXPO_PUBLIC_URL
   ```
3. **Done!** App opens instantly

**No installation needed. Just scan & run.**

---

## 🔽 Option 2: Android APK Download

### What You Need
- Android phone
- Enable "Unknown Sources" in settings
- ~80MB free storage

### Steps

1. **Download APK File**
   ```
   https://your-server.com/mpt-warrior.apk
   ```

2. **On Your Phone**
   - Go to Settings → Security
   - Enable "Unknown Sources"
   - Download the APK file
   - Open file → Install

3. **Done!** App icon appears on home screen

### To Build APK Yourself
```bash
cd mobile
npm install
eas build --platform android
```

---

## 🍎 Option 3: iOS via TestFlight

### What You Need
- iPhone
- Apple ID
- TestFlight app

### Steps

1. **Get TestFlight Link**
   - Share TestFlight link via email/message

2. **On iPhone**
   - Click link
   - Install TestFlight if needed
   - Tap "Install"

3. **Done!** App runs for 30 days

---

## 💻 Option 4: Run on Your Computer (Development)

### What You Need
- Node.js 18+
- npm or yarn
- Computer

### Steps

```bash
# 1. Clone the project
git clone https://github.com/Hdiignna-DEV/mpt-warrior.git
cd mpt-warrior/mobile

# 2. Install dependencies
npm install

# 3. Start the app
npm start

# 4. Scan QR code with phone camera
# Or use emulator
```

---

## 🎯 Comparison

| Method | Ease | Speed | Works | Requirement |
|--------|------|-------|-------|-------------|
| **Expo Link** | ⭐⭐⭐⭐⭐ | Instant | Both | Phone + internet |
| **APK Download** | ⭐⭐⭐⭐ | 5 min | Android | Android phone |
| **TestFlight** | ⭐⭐⭐ | 10 min | iOS | iPhone + Apple ID |
| **Local Run** | ⭐⭐⭐ | 15 min | Both | Computer |

---

## 🔗 Download Links (Will Be Added)

- **Expo Public Link**: [To be generated with `eas publish`]
- **Android APK**: [To be uploaded]
- **iOS TestFlight**: [To be set up]
- **GitHub Repository**: https://github.com/Hdiignna-DEV/mpt-warrior

---

## ⚙️ Setup Instructions (For Admin)

### Build APK for Distribution

```bash
cd mobile

# Login to EAS
eas login

# Build APK for download
eas build --platform android --local

# Find APK in output folder
# Share the file to users
```

### Create Expo Public Link

```bash
# Publish to Expo
eas publish

# Get shareable link
# Users can scan QR or visit link
```

### Setup TestFlight (iOS)

```bash
# Build for TestFlight
eas build --platform ios

# Create TestFlight link in App Store Connect
# Share link with testers
```

---

## 🆘 Troubleshooting

### APK Won't Install
- ✅ Check Android version (need 10.0+)
- ✅ Check storage space (~80MB needed)
- ✅ Enable "Unknown Sources"
- ✅ Try downloading again

### Expo Link Doesn't Work
- ✅ Check internet connection
- ✅ Install Expo Go app first
- ✅ Try scanning QR code instead of link

### App Crashes
- ✅ Check internet connection
- ✅ Reinstall the app
- ✅ Check API server is running
- ✅ Clear app cache

---

## 🔑 API Configuration

The app needs internet to connect to API server.

Configure in `mobile/.env.local`:
```env
REACT_APP_API_URL=https://your-api-server.com
REACT_APP_API_BASE=/api
```

---

## 📊 System Requirements

### Minimum
- **Android**: 10.0+
- **iOS**: 13.0+
- **RAM**: 2GB
- **Storage**: 100MB

### Recommended
- **Android**: 12.0+
- **iOS**: 15.0+
- **RAM**: 4GB+
- **Storage**: 200MB

---

## 👥 Share With Friends

### Easiest Way
1. Generate Expo public link
2. Share QR code or link
3. They scan/tap → App runs

### No App Store Needed
Users don't need to go to App Store. They can:
- Scan QR code
- Or click link
- Or download APK file

---

## 🎓 Next Steps

1. **For Users**: Choose an option above and download
2. **For Admin**: Follow "Setup Instructions" to generate links
3. **For Developers**: Run locally for development

---

## 📞 Support

**Issues?** Check troubleshooting above or contact:
- Email: support@mpt-warrior.app
- GitHub Issues: [link]

---

**Version**: 1.0.0  
**Date**: January 10, 2026  
**Status**: Ready to download & use  

---
