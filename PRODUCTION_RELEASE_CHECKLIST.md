# ✅ Pre-Release Production Checklist

Use this checklist before submitting your app to any store.

---

## 🔐 Security & Privacy

- [ ] Remove all `console.log()` statements
  ```bash
  npm run lint  # Check for issues
  ```

- [ ] No API keys exposed in client code
  - ✅ All keys in environment variables
  - ✅ `.env.local` in `.gitignore`
  
- [ ] Remove debug/development features
  - [ ] No debug mode toggles
  - [ ] No test user accounts visible
  - [ ] No mock data in production build

- [ ] Privacy policy exists and linked
  - [ ] Added to Play Store listing
  - [ ] Added to App Store listing
  - [ ] Covers data collection clearly

- [ ] Terms of Service exists (optional but recommended)
  - [ ] Clear about user obligations
  - [ ] Liability disclaimers
  - [ ] Contact info for support

---

## 📱 App Metadata

- [ ] App name: **MPT Warrior**
  ```json
  // app.json
  "name": "MPT Warrior"
  ```

- [ ] Package name: **com.dedendev.mptwarrior**
  ```json
  "package": "com.dedendev.mptwarrior"
  ```

- [ ] Version updated to 1.0.0+
  ```json
  "version": "1.0.0",
  "android": { "versionCode": 1 },
  "ios": { "buildNumber": "1" }
  ```

- [ ] Icon ready (1024x1024px PNG)
  ```
  assets/images/icon.png ✅
  ```

- [ ] Splash screen ready (1284x2778px)
  ```
  assets/images/splash-icon.png ✅
  ```

- [ ] Dark mode configured
  ```json
  "userInterfaceStyle": "dark" ✅
  ```

---

## 🎨 App Store Content

### Google Play Store

- [ ] Short description (50 chars max)
  ```
  AI Trading Journal & Mentor
  ```

- [ ] Full description (up to 4000 chars)
  - Features clearly listed
  - Benefits explained
  - Call-to-action present
  - No misleading claims

- [ ] Screenshots prepared (5-8 images)
  - Dimensions: 1080x1920px
  - Shows main features
  - Professional quality
  - Include text/captions

- [ ] App category selected
  - ✅ Category: Finance
  - ✅ Content rating: Requested

- [ ] Privacy policy URL added
  - HTTPS link
  - Accessible & readable
  - Covers data practices

- [ ] Support email/website
  - Response time: < 24 hours
  - Professional contact

### Apple App Store

- [ ] App name (max 30 chars)
- [ ] Subtitle (max 30 chars)
- [ ] Keywords (100 chars total)
- [ ] Description (up to 4000 chars)
- [ ] Screenshot set (6-8 images)
- [ ] Preview video (optional, 15-30 sec)
- [ ] Support URL
- [ ] Marketing URL
- [ ] Privacy policy URL

---

## 🚀 Technical Requirements

### Android
- [ ] Target API 34+ (required by Google)
  ```json
  "targetSdkVersion": 34
  ```

- [ ] Minimum API 26 (Android 8.0)
  ```json
  "minSdkVersion": 26
  ```

- [ ] All permissions requested
  ```json
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.POST_NOTIFICATIONS"
  ]
  ```

- [ ] Adaptive icon configured
  ```json
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/icon.png",
    "backgroundColor": "#0f172a"
  }
  ```

### iOS
- [ ] Minimum iOS version: 13.0+
- [ ] iPad support enabled (optional)
- [ ] Dark mode support ✅
- [ ] Notification permissions
- [ ] Camera/photo permissions (if needed)

---

## 🧪 Testing

### Before Release Build
```bash
npm run lint     # Check for errors
npm run start    # Test on emulator
```

### Functional Testing
- [ ] App launches without crash
- [ ] Login/Register works
- [ ] All screens accessible
- [ ] Chat with AI works
- [ ] Journal displays trades
- [ ] Achievements show
- [ ] Profile updates
- [ ] Logout works
- [ ] Settings accessible
- [ ] Notifications work
- [ ] Internet required ✅

### Edge Cases
- [ ] Network error handling
- [ ] Offline mode behavior
- [ ] Permission requests
- [ ] Screen rotation
- [ ] Back button navigation
- [ ] Deep linking (if used)
- [ ] Biometric auth (if used)

### Performance
- [ ] App size < 500 MB
- [ ] Startup time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive UI

---

## 🔒 Data & Storage

- [ ] AsyncStorage encrypted
  - ✅ JWT tokens secure
  - ✅ No sensitive data in cache

- [ ] API calls use HTTPS only
  - No HTTP
  - Certificate pinning optional

- [ ] User data handling
  - [ ] GDPR compliant
  - [ ] Data deletion possible
  - [ ] Export data available

---

## 📊 Analytics & Monitoring (Optional)

- [ ] Error reporting configured (Sentry, LogRocket)
- [ ] Analytics events set up (Firebase, Mixpanel)
- [ ] Crash reporting enabled
- [ ] User session tracking
- [ ] Performance monitoring

---

## 💰 Monetization (If Applicable)

- [ ] Pricing strategy clear
  - Free with optional features ✅

- [ ] In-app purchases disclosed
  - Listed in description
  - Price clear
  - Refund policy known

- [ ] No misleading ads
  - Ads clearly labeled (if used)
  - Privacy-friendly
  - No deceptive practices

---

## 📧 Support & Communication

- [ ] Support email configured
  ```
  support@mptwarrior.com
  ```

- [ ] Response time: < 24 hours
- [ ] FAQ page created
- [ ] Known issues documented
- [ ] Update schedule planned

---

## 🏗️ Deployment Files

### Required Files
- [ ] `app.json` - App configuration
- [ ] `eas.json` - EAS build configuration
- [ ] `package.json` - Dependencies
- [ ] `App.tsx` - Main entry point
- [ ] All source files in `app/` directory

### Configuration Check
```bash
cd mobile

# Verify all files present
ls -la app.json
ls -la eas.json
ls -la package.json
ls -la App.tsx
ls -la app/

# Check for syntax errors
npm run lint
```

---

## 🎯 Release Checklist (Per Update)

When releasing new version:

1. [ ] Update version in `app.json`
2. [ ] Update `versionCode`/`buildNumber`
3. [ ] Update release notes
4. [ ] Test all features
5. [ ] Run lint: `npm run lint`
6. [ ] Build APK: `npm run build:apk`
7. [ ] Test APK on real device
8. [ ] Fix any issues found
9. [ ] Submit to store
10. [ ] Monitor reviews
11. [ ] Respond to user feedback

---

## 🚫 Don't Do

- ❌ Don't ship with console.log() for debugging
- ❌ Don't hardcode API keys or passwords
- ❌ Don't include test/mock data
- ❌ Don't use HTTP for API calls
- ❌ Don't skip privacy policy
- ❌ Don't use beta/experimental SDKs
- ❌ Don't promise features not yet built
- ❌ Don't use outdated dependencies
- ❌ Don't ignore user permissions
- ❌ Don't skip testing on real devices

---

## ✅ Do This

- ✅ Use environment variables for secrets
- ✅ Test on multiple devices
- ✅ Handle errors gracefully
- ✅ Provide clear error messages
- ✅ Update dependencies regularly
- ✅ Monitor crash reports
- ✅ Respond to user reviews
- ✅ Plan regular updates
- ✅ Document changes
- ✅ Version your code properly

---

## 🔍 Final Review (24 Hours Before Release)

```bash
# 1. Lint & format
npm run lint

# 2. Build release version
npm run build:apk

# 3. Test on real device
# Install APK and test all features

# 4. Verify app.json
cat app.json | grep -E "version|name|package"

# 5. Check environment variables
cat .env

# 6. Review app listing
# Go through all text & images one more time

# 7. Final go/no-go
# All checks passed? Ready to submit!
```

---

## 📋 Submission Checklist

### Google Play
- [ ] APK uploaded
- [ ] All metadata filled
- [ ] Screenshots added
- [ ] Privacy policy linked
- [ ] Content rating completed
- [ ] Review & submit

### App Store (iOS)
- [ ] IPA uploaded
- [ ] All metadata filled
- [ ] Screenshots added
- [ ] Privacy policy linked
- [ ] Age rating completed
- [ ] Review & submit

---

## 🎉 Success!

When your app is published:

1. ✅ Monitor Play Store reviews
2. ✅ Fix reported bugs quickly
3. ✅ Add features based on feedback
4. ✅ Plan next version
5. ✅ Keep dependencies updated
6. ✅ Respond professionally to reviews

---

## 📞 Emergency Contacts

If something breaks after release:
- [ ] Have backup of signing keys
- [ ] Have version control backup
- [ ] Have rollback plan
- [ ] Have support email monitored
- [ ] Have incident response plan

---

**Last Updated**: 2026-01-10  
**Use this before every release!**
