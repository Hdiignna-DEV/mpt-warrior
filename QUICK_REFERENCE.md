# ⚡ MPT Warrior - 30 Second Quick Reference

## 🎯 What Do You Want?

### 1️⃣ Test APK with Friends (15 min)
```powershell
npm run build:apk
# Share APK file from ./builds/ folder
```

### 2️⃣ Publish to Google Play (2 hours + 1 day review)
```powershell
# 1. Create account: https://play.google.com/console ($25)
# 2. Complete checklist: PRODUCTION_RELEASE_CHECKLIST.md
# 3. Submit:
npm run submit:android
```

### 3️⃣ Publish to App Store (3 hours + 1 day review)
```powershell
# Requires macOS
npm run submit:ios
```

---

## 📋 Essential Commands

| What | Command | Time |
|------|---------|------|
| Build APK | `npm run build:apk` | 15 min |
| Build iOS | `npm run build:ios` | 15 min |
| Submit to Play | `npm run submit:android` | 1 min |
| Submit to App | `npm run submit:ios` | 1 min |
| Check status | `eas build:list` | instant |
| View logs | `eas build:view [ID]` | instant |

---

## ✅ Before Submitting

1. ✅ Increment version in `app.json`
2. ✅ Run `npm run lint` (no errors)
3. ✅ Test APK on real device
4. ✅ Use [PRODUCTION_RELEASE_CHECKLIST.md](PRODUCTION_RELEASE_CHECKLIST.md)
5. ✅ Screenshots ready
6. ✅ Privacy policy written
7. ✅ Submit!

---

## 📚 Documentation Files

| Need | File |
|------|------|
| **Overview** | [APP_DISTRIBUTION_SUMMARY.md](APP_DISTRIBUTION_SUMMARY.md) |
| **Quick Start** | [mobile/BUILD_AND_DOWNLOAD_GUIDE.md](mobile/BUILD_AND_DOWNLOAD_GUIDE.md) |
| **Play Store** | [GOOGLE_PLAY_STORE_GUIDE.md](GOOGLE_PLAY_STORE_GUIDE.md) |
| **Detailed Guide** | [mobile/MOBILE_DISTRIBUTION_GUIDE.md](mobile/MOBILE_DISTRIBUTION_GUIDE.md) |
| **Troubleshoot** | [mobile/TROUBLESHOOTING_AND_FAQ.md](mobile/TROUBLESHOOTING_AND_FAQ.md) |
| **Pre-Release** | [PRODUCTION_RELEASE_CHECKLIST.md](PRODUCTION_RELEASE_CHECKLIST.md) |

---

## 💰 Costs

- **Google Play**: $25 (one-time)
- **App Store**: $99 (per year)
- **APK Download**: Free

---

## 🎁 Current Status

✅ App ready  
✅ Android configured  
✅ iOS configured  
✅ Icons included  
✅ Documentation complete  
✅ **Ready to distribute!**

---

**Start with**: [APP_DISTRIBUTION_SUMMARY.md](APP_DISTRIBUTION_SUMMARY.md)
