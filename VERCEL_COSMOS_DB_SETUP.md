# Vercel + Azure Cosmos DB Setup Guide

## Error yang Anda Alami

Berdasarkan log error dari Vercel, ada 2 masalah utama:

### 1. Error 404/1003: "Owner resource does not exist"
```
{"Errors":["Owner resource does not exist"]}
code: 404, substatus: 1003
```

**Penyebab:** Container `users` belum dibuat di Azure Cosmos DB

**Solusi:** Jalankan script initialization untuk membuat semua containers

### 2. Error: "invalid input: input is not string"
```
Error: invalid input: input is not string
  at get url
```

**Penyebab:** Connection string environment variable tidak valid atau format salah

**Solusi:** Pastikan environment variable di Vercel menggunakan format yang benar

---

## 📋 Langkah-langkah Setup

### Step 1: Setup Azure Cosmos DB (Jika Belum)

1. **Buat Cosmos DB Account** di Azure Portal
   - Database API: **NoSQL (Core SQL)**
   - Location: Pilih yang terdekat (Southeast Asia recommended)
   - Capacity mode: **Serverless** (untuk development/production kecil)

2. **Buat Database**
   - Database name: `mpt-warrior-db`
   - Throughput: Shared (untuk serverless) atau Manual (400 RU/s minimum)

3. **Dapatkan Connection String**
   - Buka Cosmos DB account → Keys
   - Copy **PRIMARY CONNECTION STRING**
   - Format: `AccountEndpoint=https://...;AccountKey=...`

---

### Step 2: Setup Environment Variables di Vercel

1. **Buka Vercel Dashboard**
   - Pilih project: `mpt-community`
   - Settings → Environment Variables

2. **Tambahkan Variable Berikut:**

   ```
   AZURE_COSMOS_CONNECTION_STRING=AccountEndpoint=https://YOUR-ACCOUNT.documents.azure.com:443/;AccountKey=YOUR-KEY-HERE==
   ```

   **ATAU** (alternatif, gunakan salah satu):

   ```
   AZURE_COSMOS_ENDPOINT=https://YOUR-ACCOUNT.documents.azure.com:443/
   AZURE_COSMOS_KEY=YOUR-KEY-HERE==
   ```

3. **Environment untuk semua:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Klik "Save"**

---

### Step 3: Initialize Database Containers

#### Option A: Via Local Development (Recommended)

1. **Clone repository** (jika belum):
   ```bash
   git clone https://github.com/YOUR-USERNAME/mpt-warrior.git
   cd mpt-warrior
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment** di `.env.local`:
   ```bash
   # Copy connection string dari Azure
   AZURE_COSMOS_CONNECTION_STRING="AccountEndpoint=https://...;AccountKey=...=="
   
   # ATAU
   AZURE_COSMOS_ENDPOINT="https://YOUR-ACCOUNT.documents.azure.com:443/"
   AZURE_COSMOS_KEY="YOUR-KEY-HERE=="
   
   # Database name
   COSMOS_DB_NAME="mpt-warrior-db"
   ```

4. **Run initialization script**:
   ```bash
   npm run db:init
   ```

   **Ini akan membuat:**
   - ✅ Container `users` (partition key: `/id`)
   - ✅ Container `trades` (partition key: `/userId`)
   - ✅ Container `invitation-codes` (partition key: `/code`)
   - ✅ Container `audit-logs` (partition key: `/performed_by`)

5. **Verify di Azure Portal**:
   - Cosmos DB → Data Explorer
   - Database: `mpt-warrior-db`
   - Containers: Lihat 4 containers yang baru dibuat

#### Option B: Via Azure Portal (Manual)

1. **Buka Cosmos DB** → Data Explorer
2. **Buat Containers** secara manual:

   **Container 1: users**
   - Container ID: `users`
   - Partition key: `/id`

   **Container 2: trades**
   - Container ID: `trades`
   - Partition key: `/userId`

   **Container 3: invitation-codes**
   - Container ID: `invitation-codes`
   - Partition key: `/code`

   **Container 4: audit-logs**
   - Container ID: `audit-logs`
   - Partition key: `/performed_by`

---

### Step 4: Redeploy Vercel

1. **Trigger new deployment**:
   - Option A: Git push (recommended)
     ```bash
     git commit --allow-empty -m "Trigger redeploy with Cosmos DB"
     git push
     ```
   
   - Option B: Manual redeploy di Vercel Dashboard
     - Deployments → Latest → **Redeploy**

2. **Wait for deployment** to complete

---

### Step 5: Verify Setup

1. **Check Database Health**:
   ```
   GET https://mpt-community.vercel.app/api/health/cosmos
   ```

   **Expected response (healthy):**
   ```json
   {
     "success": true,
     "isHealthy": true,
     "database": true,
     "containers": {
       "users": true,
       "trades": true,
       "invitationCodes": true,
       "auditLogs": true
     },
     "timestamp": "2025-01-05T..."
   }
   ```

2. **Test Profile API**:
   ```
   GET https://mpt-community.vercel.app/api/profile
   ```

   **Expected:** No more "Owner resource does not exist" error

---

## 🔍 Troubleshooting

### Error: "Connection string is invalid"

**Check:**
1. Connection string tidak boleh ada spasi atau newline
2. Harus dimulai dengan `AccountEndpoint=`
3. Format: `AccountEndpoint=https://...;AccountKey=...==`

**Fix:**
```bash
# Benar ✅
AZURE_COSMOS_CONNECTION_STRING="AccountEndpoint=https://mpt-db.documents.azure.com:443/;AccountKey=abc123=="

# Salah ❌ (ada spasi/newline)
AZURE_COSMOS_CONNECTION_STRING="AccountEndpoint=https://...
AccountKey=...=="
```

### Error: "Database not found"

**Check:**
- Database name di environment variable harus match dengan yang di Azure
- Default: `mpt-warrior-db`

**Fix di Vercel:**
```
COSMOS_DB_NAME=mpt-warrior-db
```

### Error: Container tidak ditemukan

**Symptoms:**
- Error 404 substatus 1003
- "Owner resource does not exist"

**Fix:**
1. Run `npm run db:init` locally
2. Atau buat manual di Azure Portal (lihat Step 3 Option B)

### Environment variable tidak terbaca

**Check di Vercel:**
1. Settings → Environment Variables
2. Pastikan applied ke **Production, Preview, Development**
3. Klik "Redeploy" setelah menambah/update variable

---

## 📝 Environment Variable Checklist

Pastikan variable berikut sudah ada di Vercel:

- [ ] `AZURE_COSMOS_CONNECTION_STRING` atau (`AZURE_COSMOS_ENDPOINT` + `AZURE_COSMOS_KEY`)
- [ ] `COSMOS_DB_NAME` (default: `mpt-warrior-db`)
- [ ] `JWT_SECRET` (untuk authentication)
- [ ] `NEXT_PUBLIC_API_URL` (URL production Anda)

---

## 🎯 Next Steps After Setup

1. **Create first user**:
   ```bash
   POST /api/auth/register
   {
     "email": "admin@mpt.com",
     "password": "your-secure-password",
     "name": "Admin"
   }
   ```

2. **Upgrade to SUPER_ADMIN** (via script):
   ```bash
   npm run admin:create admin@mpt.com
   ```

3. **Test Profile System**:
   - Login → `/api/auth/login`
   - Get Profile → `/api/profile`
   - Update Profile → `/api/profile/update`

---

## 📚 Related Documentation

- [AZURE_SETUP_GUIDE.md](./AZURE_SETUP_GUIDE.md) - Azure setup lengkap
- [USER_MANAGEMENT_QUICKSTART.md](./USER_MANAGEMENT_QUICKSTART.md) - User management setup
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel deployment guide

---

## 🆘 Need Help?

Jika masih ada error setelah mengikuti guide ini:

1. **Check Vercel logs**:
   - Dashboard → Deployments → Latest → Functions
   - Lihat error detail di runtime logs

2. **Check Azure Cosmos DB metrics**:
   - Azure Portal → Cosmos DB → Metrics
   - Monitor requests, errors, latency

3. **Run health check**:
   ```
   GET /api/health/cosmos
   ```

4. **Contact support** atau buka issue di GitHub dengan:
   - Error message lengkap
   - Environment variable yang digunakan (tanpa sensitive data)
   - Screenshot dari Azure Portal (containers)
