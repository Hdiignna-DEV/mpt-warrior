# 🎯 QUICK START: Build APK in 3 Commands

## Prerequisites ✅
- ✅ EAS CLI installed (version 16.28.0)
- ✅ app.json configured correctly
- ✅ Old APK removed

---

## The 3 Commands

### **Command 1: Login to Expo** (Interactive)

```bash
eas login
```

**What to do:**
1. Run command in terminal
2. A browser window will open to Expo login page
3. Sign up with free account OR use existing account
4. Confirm login in browser
5. Terminal will show "✅ Logged in"

---

### **Command 2: Build APK** (Automated)

```bash
eas build --platform android --type apk --profile production
```

**What happens:**
- Takes ~15 minutes
- Shows progress in terminal
- Displays download URL when done
- Example: `https://eas-builds.s3.us-west-2.amazonaws.com/builds/xxxxx.apk`

---

### **Command 3: Download & Place APK**

When build is done, download the APK and save to:
```
C:\Users\deden\mpt-warrior\public\apk\mpt-command-center-v1.0.apk
```

---

## ✨ Done!

Users can now download at:
```
https://mpt-community.vercel.app/download
```

---

## 📞 I'm Ready When You Are!

Just let me know:
- ✅ You created/have Expo account
- ✅ You ran `eas login`
- ✅ You're ready to build

Then I'll guide you through the build process!

---

**Current Status:**
- ✅ app.json: Ready
- ✅ EAS CLI: Ready
- ⏳ Expo Login: Waiting for you
- ⏳ Build: Ready to start
- ⏳ APK: Ready to be deployed
