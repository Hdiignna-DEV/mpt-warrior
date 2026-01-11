# ⚡ QUICK GUIDE - Build APK & Share via Website

## 3 Langkah Sederhana

### 1️⃣ BUILD APK (15 menit)
```powershell
cd mobile
npm install
npm run build:apk
```

**Hasil**: File `release.apk` (~150-200 MB)

---

### 2️⃣ UPLOAD KE WEBSITE
Upload file APK ke folder publik website Anda:
```
website/public/downloads/mpt-warrior.apk
```

---

### 3️⃣ SHARE LINK
Tambahkan link di website untuk download:
```html
<a href="/downloads/mpt-warrior.apk" download>
  📱 Download APK
</a>
```

---

## Cara User Install

1. **Download APK** dari link di website
2. **Enable Unknown Sources** di Android settings
3. **Open file** & tap Install
4. **Login** dengan akun website mereka
5. **Done!** 🎉 Data otomatis sinkron

---

## Website ↔️ Mobile Integration

```
┌──────────────┐                    ┌────────────┐
│   Website    │ ◄──API Calls──► │ Mobile App │
│   Next.js    │    Shared DB     │ React Na   │
└──────────────┘                    └────────────┘
        │                                   │
        └────────────┬──────────────────────┘
                  Azure Cosmos DB
                (Single Source of Truth)
```

**Yang Sinkron**:
- ✅ User login & session
- ✅ Trading journal & trades
- ✅ Chat messages
- ✅ Achievements & badges
- ✅ User profile & stats

---

## Commands Reference

```powershell
# Build APK
npm run build:apk

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

---

## Version Updates

Ketika ada update:

1. Update `mobile/app.json`:
   ```json
   "version": "1.0.1",
   "android": { "versionCode": 2 }
   ```

2. Build baru: `npm run build:apk`

3. Upload dengan nama berbeda:
   ```
   mpt-warrior-v1.0.1.apk
   ```

4. Users download & install baru

---

## ✅ Checklist

- [ ] API endpoints accessible from mobile
- [ ] JWT auth working
- [ ] Cosmos DB connected
- [ ] APK builds successfully
- [ ] Can login from app
- [ ] Data syncs with website
- [ ] Upload APK to website
- [ ] Download link working

---

**Status**: Ready to build and distribute!

**Next**: `npm run build:apk`
