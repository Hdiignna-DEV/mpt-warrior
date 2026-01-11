# 📱 MPT Warrior - Distribusi APK & Integrasi Website

## 🎯 Konsep Sederhana

**Website** (Next.js) dan **Mobile App** (React Native) saling terintegrasi:

```
USERS
  ├─→ Kunjungi Website (www.mptwarrior.com)
  │   └─→ Download APK
  │   └─→ Install di Android phone
  │
  └─→ Gunakan Mobile App
      └─→ Login dengan akun website
      └─→ Data sinkron otomatis
      └─→ Akses semua fitur
```

---

## ⚡ Cara Kerja Distribusi

### Step 1: Build APK (15 menit)
```powershell
cd mobile
npm install
npm run build:apk
```
**Hasil**: File `release.apk` siap upload

### Step 2: Upload ke Website
Upload APK file ke folder website Anda:
```
website/public/downloads/mpt-warrior.apk
```

### Step 3: Tambah Link di Website
Tambahkan tombol download di halaman website:
```html
<a href="/downloads/mpt-warrior.apk" class="btn btn-primary">
  📱 Download APK untuk Android
</a>
```

### Step 4: Users Download & Install
1. Kunjungi website
2. Klik tombol download
3. Install APK di Android phone
4. Login dengan akun website
5. Selesai!

---

## 🔗 Integrasi Website ↔️ Mobile App

### 1. **Authentication (Login/Register)**

**Website** dan **Mobile App** menggunakan **backend API yang sama**:

```
┌─────────────┐
│  Website    │
│  Login Form │
└──────┬──────┘
       │
       │ POST /api/auth/login
       ▼
┌──────────────────────┐
│  Next.js Backend     │
│  (API Routes)        │
└──────┬───────────────┘
       │
       │ Verify credentials
       │
       ▼
┌────────────────────┐
│  Azure Cosmos DB   │
│  (Users Collection)│
└────────────────────┘

       ↑
       │ Same API
       │
┌──────┴──────────┐
│  Mobile App     │
│  Login Screen   │
└─────────────────┘
```

**Code Integration:**

Website & Mobile App keduanya menggunakan **Axios HTTP client**:

```typescript
// Website (Next.js)
const response = await axios.post('/api/auth/login', {
  email: email,
  password: password
});
const token = response.data.token;
localStorage.setItem('jwt_token', token);

// Mobile App (React Native)
const response = await axios.post('https://website.com/api/auth/login', {
  email: email,
  password: password
});
const token = response.data.token;
await AsyncStorage.setItem('jwt_token', token);
```

**Result**: Same token, same user session!

---

### 2. **API Endpoints (Data Sync)**

Mobile app **mengakses API yang sama** dengan website:

| Feature | Website | Mobile | Endpoint |
|---------|---------|--------|----------|
| Chat | ✅ | ✅ | `POST /api/chat/message` |
| Journal | ✅ | ✅ | `POST /api/journal/add-trade` |
| Profile | ✅ | ✅ | `GET /api/profile/user/:id` |
| Dashboard | ✅ | ✅ | `GET /api/dashboard/stats` |
| Achievements | ✅ | ✅ | `GET /api/achievements` |

**Contoh:**

Website & mobile keduanya panggil API yang sama:

```typescript
// Get user trades (digunakan di website & mobile)
const getTrades = async (userId: string) => {
  const response = await axios.get(
    `https://website.com/api/journal/trades/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
```

---

### 3. **Data Synchronization**

**Real-time Sync** antara website dan mobile:

```
┌─────────────────┐                    ┌──────────────────┐
│   Website       │                    │   Mobile App     │
│                 │                    │                  │
│ Add new trade   │────┐              │ Add new trade    │
│                 │    │              │                  │
└─────────────────┘    │              └──────────────────┘
                       │                       │
                       │ POST /api/journal/... │
                       │ ────────────────────►│
                       │                       │
                       │         Azure Cosmos DB
                       └──────────────────────┘
                              │
                              │ Store data
                              ▼
                    ┌─────────────────────┐
                    │ Single Source Truth │
                    │ (Cosmos Database)   │
                    └─────────────────────┘
```

**Cara Kerjanya:**

1. User add trade di **Mobile App**
2. App kirim `POST /api/journal/add-trade` ke website
3. Website store di Cosmos Database
4. Website kirim response back ke mobile
5. Mobile save locally (AsyncStorage) untuk offline support
6. **Ketika user buka website** → Data sama (sudah ter-sync)

---

## 🔐 Security & Authentication

### Token-Based Auth (JWT)

Semua request ke API perlu token:

```typescript
// Mobile App - Add token ke setiap request
axios.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Website - Add token ke setiap request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Result**: 
- Users login once (di website atau mobile)
- Token valid di keduanya
- Data tersinkronisasi otomatis

---

## 🌐 Configuration untuk Integrasi

### Mobile App Config

Update `mobile/app.json` untuk production API:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://mptwarrior.vercel.app",
      "wsUrl": "wss://mptwarrior.vercel.app"
    }
  }
}
```

### Mobile App Services

File `mobile/services/api.ts`:

```typescript
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// Add JWT token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Website API Routes

Semua API endpoint sudah tersedia di `src/app/api/`:

```
api/
├── auth/           → Login, Register, Logout
├── chat/           → Send message, Get history
├── journal/        → Add trade, Get trades, Update trade
├── profile/        → Get profile, Update profile
└── achievements/   → Get badges, Track progress
```

---

## 📲 User Flow Lengkap

### Skenario 1: User Baru

```
1. Kunjungi Website (www.mptwarrior.com)
   ↓
2. Klik "Create Account"
   ↓
3. Register dengan email & password
   ↓
4. Klik "Download APK" link
   ↓
5. Download & install di Android phone
   ↓
6. Buka app → Login dengan akun yang baru dibuat
   ↓
7. App authenticated ✅
   ↓
8. Data sync otomatis dari website
   ↓
9. Ready to use! 🎉
```

### Skenario 2: User Existing

```
1. User sudah punya akun website
   ↓
2. Download APK dari website
   ↓
3. Install di Android
   ↓
4. Login dengan akun existing
   ↓
5. App fetch data dari Cosmos Database
   ↓
6. Show trading journal, achievements, profile
   ↓
7. Semua data otomatis sinkron ✅
```

### Skenario 3: User Add Trade di Mobile

```
1. User buka mobile app
   ↓
2. Buka Journal → Add New Trade
   ↓
3. Input trade details
   ↓
4. Klik "Save"
   ↓
5. App POST to /api/journal/add-trade
   ↓
6. Backend store di Cosmos DB
   ↓
7. Response back ke app (save locally + show success)
   ↓
8. User buka website di browser
   ↓
9. Klik "Journal" → See same trade! ✅
   ↓
10. Data automatically synced
```

---

## 🚀 Build & Distribute APK

### Build Command

```powershell
cd mobile
npm install
npm run build:apk
```

**Output**: `release.apk` file (~150-200 MB)

### Upload ke Website

1. Login ke hosting/server
2. Upload file ke folder publik:
   ```
   /public/downloads/mpt-warrior-v1.0.0.apk
   ```

3. Tambah link di website:
   ```html
   <!-- navigation bar atau download page -->
   <a href="/downloads/mpt-warrior-v1.0.0.apk" download>
     📱 Download Android App (APK)
   </a>
   ```

4. Buat landing page download:
   ```
   www.mptwarrior.com/download
   - Screenshot app
   - Features list
   - System requirements
   - Download button
   - Version info
   ```

---

## 📋 Checklist Sebelum Release

### Configuration
- [ ] API URL benar di `mobile/app.json`
- [ ] JWT token interceptor configured
- [ ] AsyncStorage setup untuk offline
- [ ] Network requests bekerja di development

### Testing
- [ ] Build APK successfully: `npm run build:apk`
- [ ] Install APK di Android device
- [ ] Login dengan akun website
- [ ] Test chat functionality
- [ ] Test journal (add/edit/delete trade)
- [ ] Test profile sync
- [ ] Test offline mode
- [ ] Data visible di website juga

### Website Integration
- [ ] Upload APK ke server
- [ ] Create download page
- [ ] Add download link ke homepage
- [ ] Test download link bekerja
- [ ] Create APK file versioning (v1.0.0, etc)

---

## 🔄 Update Workflow

### Ketika ada update aplikasi:

1. **Update code** di mobile folder
2. **Increment version** di `mobile/app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": { "versionCode": 2 }
   }
   ```

3. **Build APK baru**:
   ```powershell
   npm run build:apk
   ```

4. **Upload ke website** dengan nama baru:
   ```
   /public/downloads/mpt-warrior-v1.0.1.apk
   ```

5. **Update download page** dengan:
   - New version number
   - Changelog
   - Updated release date

6. **Users download** APK baru
   - Install (akan replace old version)
   - Seamless update ✅

---

## 📊 Benefits Integrasi

| Benefit | Deskripsi |
|---------|-----------|
| **Single Login** | Users login once, akses website & app |
| **Data Sync** | Add trade di mobile → visible di website |
| **No Fragmentation** | Same backend, same data |
| **Easy Updates** | Release new APK, users download |
| **Cost Efficient** | No Play Store fees, no App Store fees |
| **Full Control** | You control distribution, updates, versions |
| **User Engagement** | Website + Mobile = better retention |
| **Feature Parity** | Same features di website dan mobile |

---

## 📱 Mobile App Capabilities

### Offline Support
- Cache data locally dengan AsyncStorage
- Work without internet
- Sync when connection returns

### Push Notifications
- Trading alerts
- Message notifications
- Achievement unlocked alerts

### Biometric Auth (Optional)
- Fingerprint login
- Face recognition (Android)

### Camera Integration
- Upload trade screenshots
- Chart analysis images

---

## 🎯 Next Steps

### Today:
1. Review dokumentasi ini
2. Pastikan API endpoints siap
3. Update mobile/app.json dengan API URL

### Tomorrow:
4. Build APK: `npm run build:apk`
5. Test di Android device
6. Verify semua fitur bekerja

### Next Week:
7. Upload APK ke website
8. Create download page
9. Add download link ke homepage
10. Release! 🎉

---

## 📚 Reference Files

- **Mobile Config**: `mobile/app.json`
- **API Services**: `mobile/services/api.ts`
- **Auth Store**: `mobile/stores/authStore.ts`
- **Website API**: `src/app/api/`

---

## 💡 Tips

1. **Test thoroughly** sebelum release
2. **Keep versions** di mind saat update
3. **Monitor** user feedback & errors
4. **Plan** feature updates bersama-sama antara website dan mobile

---

**Status**: ✅ Ready untuk build & distribute APK  
**Integration**: ✅ Website & Mobile fully integrated  
**Next**: Build APK dan upload ke website
