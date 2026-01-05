# 🔥 AZURE COSMOS DB FREE TIER SETUP GUIDE

## STEP 1: CREATE AZURE COSMOS DB (10 menit)

### 1.1 Login ke Azure Portal
1. Buka: https://portal.azure.com
2. Login dengan akun Microsoft Anda
3. Jika belum punya akun Azure, daftar dulu (butuh kartu kredit untuk verifikasi, tapi FREE TIER gratis selamanya)

### 1.2 Create Cosmos DB Resource
1. Di Azure Portal, klik **"Create a resource"** (pojok kiri atas)
2. Search: **"Azure Cosmos DB"**
3. Klik **"Azure Cosmos DB"** → **"Create"**
4. Pilih API: **"Azure Cosmos DB for NoSQL"** → **"Create"**

### 1.3 Configure Database
**Basics Tab:**
- **Subscription**: Pilih subscription Anda
- **Resource Group**: Create new → nama: `mpt-warrior-rg`
- **Account Name**: `mpt-warrior-db` (atau nama unik lainnya, must be globally unique)
- **Location**: **Southeast Asia** (closest to Indonesia)
- **Capacity mode**: **Provisioned throughput**
- **Apply Free Tier Discount**: ✅ **ENABLE THIS!** (1000 RU/s FREE)
- **Limit total account throughput**: ✅ Check this (prevent overcharges)

**Global Distribution Tab:**
- Geo-Redundancy: Disable (untuk Free Tier)
- Multi-region Writes: Disable

**Networking Tab:**
- Connectivity method: **All networks** (atau pilih "Selected networks" jika mau lebih secure)

**Backup Policy Tab:**
- Leave default (Periodic)

**Encryption Tab:**
- Leave default

**Review + Create:**
- Klik **"Create"**
- Wait 3-5 menit untuk deployment selesai

---

## STEP 2: GET CONNECTION CREDENTIALS (2 menit)

### 2.1 Navigate to Cosmos DB
1. Deployment selesai → Klik **"Go to resource"**
2. Atau search "mpt-warrior-db" di search bar atas

### 2.2 Copy Credentials
1. Di sidebar kiri, klik **"Keys"** (under Settings)
2. Copy dan simpan:
   ```
   URI: https://mpt-warrior-db.documents.azure.com:443/
   PRIMARY KEY: [long string, copy this]
   ```

⚠️ **JANGAN SHARE PRIMARY KEY KE SIAPAPUN!**

---

## STEP 3: VERCEL ENVIRONMENT VARIABLES (5 menit)

### 3.1 Login ke Vercel
1. Buka: https://vercel.com
2. Login dengan GitHub account
3. Pilih project: **mpt-warrior**

### 3.2 Add Environment Variables
1. Klik **Settings** tab
2. Klik **Environment Variables** di sidebar
3. Tambahkan variabel berikut (satu per satu):

```env
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
AZURE_COSMOS_KEY=[paste PRIMARY KEY dari Azure]
AZURE_COSMOS_DATABASE=mpt-warrior

# JWT Authentication
JWT_SECRET=[generate random string 32+ characters]

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com

# App URL
NEXT_PUBLIC_APP_URL=https://mpt-community.vercel.app

# Gemini API (jika sudah ada)
GEMINI_API_KEY=[your gemini api key]
```

**Generate JWT_SECRET:**
- Buka terminal, jalankan:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Copy hasilnya, paste ke JWT_SECRET

### 3.3 Apply to Production
- Untuk setiap variable, pilih environment: **Production**, **Preview**, **Development** (check all)
- Klik **Save**

### 3.4 Redeploy
- Setelah semua variable ditambahkan
- Klik tab **Deployments**
- Klik 3 dots (...) pada deployment terakhir
- Klik **Redeploy** → Confirm

Wait 1-2 menit untuk deployment selesai.

---

## STEP 4: CREATE CONTAINERS DI AZURE (5 menit)

### 4.1 Create Database
1. Kembali ke Azure Portal → Cosmos DB resource Anda
2. Klik **"Data Explorer"** di sidebar
3. Klik **"New Database"**
   - Database id: `mpt-warrior`
   - Provision throughput: **Unchecked** (kita set per container)
   - Klik **OK**

### 4.2 Create Containers
Buat 4 containers berikut (satu per satu):

**Container 1: users**
- Klik **New Container**
- Database id: Select existing → `mpt-warrior`
- Container id: `users`
- Partition key: `/id`
- Throughput: **Manual** → `400` RU/s
- Klik **OK**

**Container 2: trades**
- Container id: `trades`
- Partition key: `/userId`
- Throughput: **Manual** → `400` RU/s
- Klik **OK**

**Container 3: invitation-codes**
- Container id: `invitation-codes`
- Partition key: `/id`
- Throughput: **Manual** → `400` RU/s
- Klik **OK**

**Container 4: audit-logs**
- Container id: `audit-logs`
- Partition key: `/userId`
- Throughput: **Manual** → `400` RU/s
- Klik **OK**

**Total RU/s: 1600** (Free Tier covers 1000 RU/s, you pay ~$0.008/hour untuk 600 RU/s sisanya = ~$5/month)

**OPTIONAL: Reduce ke 1000 RU/s total (FREE):**
- Set setiap container ke 250 RU/s instead (4 x 250 = 1000 RU/s)

---

## STEP 5: GENERATE INVITATION CODES (2 menit)

### 5.1 Create Script
Kita akan generate invitation codes via local script.

File sudah ada: `scripts/generate-invitation-codes.ts`

### 5.2 Setup Local Environment
1. Di folder project, create file `.env.local`:
```env
AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
AZURE_COSMOS_KEY=[paste PRIMARY KEY]
AZURE_COSMOS_DATABASE=mpt-warrior
```

### 5.3 Run Script
```bash
npm run db:generate-codes
```

Ini akan generate 5 invitation codes pertama.

### 5.4 Verify di Azure Portal
1. Azure Portal → Data Explorer
2. Expand database `mpt-warrior` → container `invitation-codes`
3. Klik **Items**
4. Lihat 5 invitation codes yang baru dibuat
5. Copy salah satu `code` untuk testing nanti

---

## STEP 6: FIRST ADMIN ACCOUNT (5 menit)

### 6.1 Register Admin
1. Buka: https://mpt-community.vercel.app/register
2. Isi form:
   - Username: admin (atau username pilihan)
   - Email: [email yang sama dengan NEXT_PUBLIC_ADMIN_EMAIL]
   - Password: [strong password]
   - Invitation Code: [paste code dari step 5.4]
3. Klik **Register**

### 6.2 Approve via Azure Portal
Karena ini admin pertama, kita approve manual via Azure:

1. Azure Portal → Data Explorer → container `users` → Items
2. Cari user yang baru didaftarkan
3. Klik item tersebut
4. Edit JSON:
   ```json
   {
     ...
     "status": "active",
     "role": "ADMIN",
     ...
   }
   ```
5. Klik **Update**

### 6.3 Login as Admin
1. Buka: https://mpt-community.vercel.app/login
2. Login dengan email + password
3. Redirect ke dashboard ✅
4. Akses: https://mpt-community.vercel.app/admin-hq
5. Verify Admin HQ bisa diakses ✅

---

## STEP 7: TESTING COMPLETE FLOW (5 menit)

### 7.1 Test User Registration
1. Open incognito browser
2. Register user baru dengan invitation code lain
3. Verify redirect ke `/pending-approval`

### 7.2 Test Admin Approval
1. Login as admin → Admin HQ
2. Lihat pending user
3. Approve user tersebut
4. Verify user status berubah ke "active"

### 7.3 Test Approved User Login
1. Login dengan user yang sudah di-approve
2. Verify bisa akses dashboard
3. Test features: AI Mentor, Journal, Calculator

### 7.4 Test Middleware Protection
1. Logout
2. Coba akses: https://mpt-community.vercel.app/dashboard
3. Verify redirect ke `/login` ✅

---

## ✅ SETUP COMPLETE!

**What You Have Now:**
- ✅ Azure Cosmos DB Free Tier (1000 RU/s, 25 GB)
- ✅ 4 containers created (users, trades, invitation-codes, audit-logs)
- ✅ Vercel environment variables configured
- ✅ Admin account active
- ✅ Membership system LIVE
- ✅ 5 invitation codes ready

**Next Steps:**
1. Generate more invitation codes untuk member
2. Share codes di WhatsApp/Telegram groups
3. Monitor user registrations di Admin HQ
4. Test AI Mentor dengan Gemini API
5. Start onboarding 50+ members! 🚀

---

## 🔧 TROUBLESHOOTING

**Error: "Unable to connect to Cosmos DB"**
- Check AZURE_COSMOS_ENDPOINT dan AZURE_COSMOS_KEY benar
- Check Cosmos DB networking settings (allow public access)
- Check Vercel environment variables sudah di-save

**Error: "Invitation code invalid"**
- Run `npm run db:generate-codes` lagi
- Check container `invitation-codes` di Azure Portal

**Error: "JWT token invalid"**
- Check JWT_SECRET di Vercel environment variables
- Redeploy Vercel after adding variables

**Error: "Insufficient permissions"**
- Check user role di database (must be "ADMIN" for Admin HQ)
- Check user status (must be "active")

**Free Tier Exceeded?**
- Check total RU/s allocation (max 1000 for free)
- Reduce container throughput if needed
- Monitor usage di Azure Portal → Metrics

---

## 📞 SUPPORT

Jika ada masalah:
1. Check error logs di Vercel → Deployments → View Function Logs
2. Check Azure Portal → Cosmos DB → Monitoring → Insights
3. Tanya di chat! 🔥
