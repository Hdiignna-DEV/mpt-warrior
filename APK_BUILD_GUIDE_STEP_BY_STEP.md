# 🚀 MPT Command Center - APK Build Guide (FROM SCRATCH)

**Status:** Ready to build new APK  
**Date:** January 11, 2026  
**Platform:** Android via EAS (Expo Application Services)  

---

## ✅ What's Already Done

- ✅ **app.json**: Configured with "MPT Command Center" branding
- ✅ **Manifest.json**: Updated for PWA
- ✅ **Service Worker**: Configured for offline support
- ✅ **Mobile Interface**: Created at `/src/app/mobile` (363 lines)
- ✅ **Download Page**: Smart device detection at `/download`
- ✅ **EAS CLI**: Installed globally
- ✅ **Old APK**: Removed from `/public/apk`

---

## 🔧 NEXT STEPS - To Complete APK Build

### **Step 1: Login to Expo Account** (5 minutes)

Run this command in your terminal:

```bash
eas login
```

This will:
1. Open a browser window to Expo login page
2. You can create FREE account or use existing account
3. Browser will confirm login
4. Terminal will show you're authenticated

**Note:** If you don't have an Expo account:
- Go to https://expo.dev
- Click "Sign Up"
- Create free account with email
- Then run `eas login` command

---

### **Step 2: Verify Project Link**

The project already has `projectId` in app.json:
```json
"extra": {
  "eas": {
    "projectId": "01cbff08-a5b5-4e32-b7d6-11eebe07c986"
  }
}
```

This links your project to Expo's build service ✅

---

### **Step 3: Build New APK**

Run this command:

```bash
eas build --platform android --type apk --profile production
```

**What happens:**
1. Uploads your code to Expo's build servers (takes ~30 seconds)
2. Compiles Android APK (takes ~10-15 minutes)
3. You'll see build progress in terminal
4. When done, shows download URL

**Terminal output will look like:**
```
✅ Build complete!
📦 APK available at: https://eas-builds.s3.us-west-2.amazonaws.com/builds/xxxxx.apk
```

---

### **Step 4: Download the APK**

Once build is complete:
1. Copy the download URL from terminal
2. Download the .apk file
3. Rename to: `mpt-command-center-v1.0.apk`
4. Save to: `c:\Users\deden\mpt-warrior\public\apk\`

---

### **Step 5: Verify Download Link**

The download page at `/download` will automatically serve the APK from:
```
/apk/mpt-command-center-v1.0.apk
```

Users can download at:
```
https://mpt-community.vercel.app/download
```

---

## 📋 Checklist

- [ ] Login to Expo: `eas login`
- [ ] Wait for Expo authentication
- [ ] Build APK: `eas build --platform android --type apk --profile production`
- [ ] Wait 15 minutes for build to complete
- [ ] Download APK from URL provided
- [ ] Move APK to `/public/apk/mpt-command-center-v1.0.apk`
- [ ] Test download link at `/download` page
- [ ] Push to GitHub: `git add -A && git commit -m "apk: new mpt command center apk built from scratch" && git push`

---

## ⏱️ Estimated Time

- Login: 2 minutes
- Build: 15 minutes  
- Download & Setup: 3 minutes
- **Total: ~20 minutes**

---

## 🎯 What APK Will Include

✅ **App Name**: MPT Command Center  
✅ **Icon**: Official MPT logo  
✅ **Package ID**: com.mptcommandcenter.app  
✅ **Features**: All 6 tabs (Dashboard, Journal, Chat, Calculator, Leaderboard, Achievements)  
✅ **Branding**: Dark theme with amber accents  
✅ **Integration**: Full connection to website backend  
✅ **Offline Support**: Works without internet (with cached data)  
✅ **Size**: ~85-90 MB  

---

## 📱 After APK is Ready

### Users can download from `/download` page:

**Android Users:**
- Click "DOWNLOAD APK" button
- APK downloads directly
- Tap to install
- App opens with correct branding

**iPhone Users:**
- See PWA installation guide
- 3 steps to install on home screen
- Works fully featured on iPhone

**Desktop Users:**
- See QR code to scan
- Or download link to share

---

## 🔗 Important Links

- **Download Page**: https://mpt-community.vercel.app/download
- **Expo Console**: https://expo.dev/projects
- **Build Status**: Check in Expo dashboard after building

---

## 💡 Troubleshooting

**If build fails:**
- Check your Firebase/SDK are up to date
- Ensure app.json has valid icon path
- Check project is linked to Expo

**If login fails:**
- Create new free account at https://expo.dev
- Try `eas login` again

**If APK doesn't download:**
- Check file is in `/public/apk/` folder
- Clear browser cache
- Try different browser

---

## 🚀 Next Action

**Please run this command and let me know when Expo asks for login credentials:**

```bash
eas login
```

Once you're logged in, I'll guide you through the build process!

---

**Let me know when you're ready to proceed!** 🎯
