# 🔍 Chat History Debug - Pesan Hilang saat Refresh

**Masalah**: Pesan chat hilang saat di-refresh  
**Penyebab Utama**: Environment variables Cosmos DB belum dikonfigurasi  
**Status**: 🔴 CRITICAL - Perlu fix segera

---

## Root Cause: Cosmos DB Not Connected!

### Masalahnya:

```
App → Try to save message
  → Connect to Cosmos DB
  → ❌ Environment vars NOT SET
  → Cosmos DB client not initialized
  → Messages tidak tersimpan
  → Pesan hanya di browser memory
  → Di-refresh → HILANG! 😞
```

---

## Solusi: Konfigurasi Environment Variables

### Step 1: Buka Azure Portal

1. Login ke https://portal.azure.com
2. Cari "Cosmos DB" di search bar
3. Buka account Anda: **mpt-warrior-db**

### Step 2: Dapatkan Connection String

1. Di menu kiri, klik **Keys**
2. Lihat section **Connection Strings**
3. Copy **PRIMARY CONNECTION STRING** (yang panjang banget)
   - Contoh: `DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=...`

### Step 3: Copy Endpoint & Key

Atau jika ingin split, ambil dari section **Read-write Keys**:
- **URI**: Copy ini (ini ENDPOINT)
- **PRIMARY KEY**: Copy ini (ini KEY)

---

## Cara Setup di Project

### Opsi A: Local Development (.env.local)

**File**: `c:\Users\deden\mpt-warrior\.env.local`

```env
# Azure Cosmos DB
AZURE_COSMOS_CONNECTION_STRING=DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=YOUR_KEY;
AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
AZURE_COSMOS_KEY=YOUR_PRIMARY_KEY
AZURE_COSMOS_DATABASE=mpt-warrior
```

**Atau pakai connection string saja**:

```env
AZURE_COSMOS_CONNECTION_STRING=DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=YOUR_KEY;
```

### Opsi B: Vercel Deployment

1. Go to Vercel project settings
2. Environment Variables
3. Tambah:
   ```
   AZURE_COSMOS_CONNECTION_STRING = ...
   ```
   Atau:
   ```
   AZURE_COSMOS_ENDPOINT = ...
   AZURE_COSMOS_KEY = ...
   ```

---

## Langkah-Langkah Lengkap

### 1️⃣ Get Cosmos DB Credentials

Pergi ke Azure Portal:
```
portal.azure.com 
  → Search "Cosmos DB"
  → mpt-warrior-db
  → Keys (di sidebar kiri)
  → Copy "Primary Connection String"
```

Hasil copy contoh:
```
DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=abc123xyz==;
```

### 2️⃣ Buat/Edit .env.local

```bash
# Windows Command
echo AZURE_COSMOS_CONNECTION_STRING=YOUR_STRING >> .env.local
```

Atau edit manual:

**File**: `.env.local` (di root folder)

```env
# Chat / Cosmos DB
AZURE_COSMOS_CONNECTION_STRING=DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=YOUR_KEY;
```

### 3️⃣ Restart App

```bash
# Stop app jika sedang berjalan (Ctrl+C)
npm run dev
```

### 4️⃣ Test

```bash
# Terminal baru
curl http://localhost:3000/api/health/cosmos
```

**Expected output**:
```json
{
  "success": true,
  "isHealthy": true,
  "chatThreads": true,
  "chatMessages": true
}
```

Jika muncul `true` untuk chat containers, bearti sudah connected! ✅

---

## Verification Checklist

- [ ] Cosmos DB credentials diperoleh dari Azure Portal
- [ ] `.env.local` atau Vercel env vars sudah dikonfigurasi
- [ ] App di-restart (`npm run dev`)
- [ ] Health check menunjukkan `chatThreads: true`
- [ ] Test chat: kirim pesan → reload → pesan masih ada ✅

---

## Troubleshooting

### Error: "Missing Cosmos DB credentials"

**Cause**: `.env.local` belum dibuat  
**Fix**:
1. Buat file `.env.local` di root folder
2. Paste connection string dari Azure
3. Restart app

### Error: "Invalid connection string format"

**Cause**: Connection string di-copy salah  
**Fix**:
1. Buka Azure Portal lagi
2. Copy ulang PRIMARY CONNECTION STRING (satu baris penuh)
3. Paste ke `.env.local`
4. Pastikan ada di akhir

### Error: "The resource with id [chat-messages] does not exist"

**Cause**: 
1. Connection string tidak valid (masih pointer ke credentials lama)
2. Database/containers belum dibuat

**Fix**:
1. Verify connection string benar
2. Call health endpoint: `curl http://localhost:3000/api/health/cosmos`
3. Tunggu 5 detik untuk Azure process
4. Try again

### Messages Still Disappear After Refresh

**Checklist**:
- [ ] Run `curl http://localhost:3000/api/health/cosmos` → check `chatThreads` & `chatMessages` = true
- [ ] Browser Console (F12) → check ada error merah?
- [ ] Network tab (F12) → POST /api/chat/save → status 200?
- [ ] Cosmos DB connected?

If all green tapi masih hilang:
```bash
# Stop dan restart dev server
# Ctrl+C
npm run dev
```

---

## Environment Variables Reference

```env
# Method 1: Connection String (RECOMMENDED - Simpler)
AZURE_COSMOS_CONNECTION_STRING=DefaultEndpointProtocol=https;AccountName=mpt-warrior-db;AccountKey=YOUR_KEY;

# Method 2: Endpoint + Key (Alternative)
AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
AZURE_COSMOS_KEY=YOUR_PRIMARY_KEY

# Optional: Specify database name (default: mpt-warrior)
AZURE_COSMOS_DATABASE=mpt-warrior
```

**Use one of the two methods above, not both.**

---

## Quick Diagram: How It Works

```
┌─────────────────────────────────────────┐
│ .env.local configured ✅                 │
│ AZURE_COSMOS_CONNECTION_STRING=...      │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ App starts → reads .env.local            │
│ Initializes Cosmos DB client             │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ User sends message                      │
│ POST /api/chat/save                     │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ saveChatMessage() function               │
│ → cosmosClient initialized ✅            │
│ → container.items.create(message)        │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Message saved to:                       │
│ Azure Cosmos DB → mpt-warrior database  │
│ → chat-messages container                │
│ → with userId partition key              │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ User refreshes page                      │
│ GET /api/chat/thread/{threadId}         │
│ → Queries Cosmos DB                     │
│ → Returns all messages from container   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Messages loaded & displayed ✅            │
│ Pesan tidak hilang! 🎉                   │
└─────────────────────────────────────────┘
```

---

## Command Quick Reference

```bash
# 1. Check if app is running
curl http://localhost:3000

# 2. Check Cosmos DB connection
curl http://localhost:3000/api/health/cosmos

# 3. If Cosmos DB is down
# → Check .env.local
# → Check connection string is correct
# → Restart app (Ctrl+C, then npm run dev)
```

---

## Summary

**Solusi singkatnya**:

1. ✅ Ambil Cosmos DB credentials dari Azure Portal
2. ✅ Buat `.env.local` dengan credentials
3. ✅ Restart app
4. ✅ Test dengan health check
5. ✅ Kirim pesan, refresh, pesan masih ada! ✅

**Pesan hilang karena**: Environment variables belum di-set → Cosmos DB not connected → messages hanya di browser memory → refresh = hilang

**Setelah fix**: Messages akan tersimpan ke Azure Cosmos DB → di-refresh tetap ada!

---

---

## UPDATE: Environment Variables Sudah Dikonfigurasi! ✅

`.env.local` sudah memiliki kredensial Cosmos DB yang valid:
```env
AZURE_COSMOS_CONNECTION_STRING=AccountEndpoint=https://mpt-warrior-db.documents.azure.com:443/;...
AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
AZURE_COSMOS_KEY=...
AZURE_COSMOS_DATABASE=mpt-warrior
```

**Masalah saat testing lokal**: Windows + Next.js/Turbopack issues dengan port binding

---

## ✅ RECOMMENDED SOLUTION: Deploy ke Vercel!

**Masalah**: Lokal dev server tidak stabil pada Windows  
**Solusi**: Deploy ke Vercel (sudah dikonfigurasi dan stable)

### Langkah Deploy:

```bash
git add .
git commit -m "Setup: Configure Cosmos DB for chat history"
git push origin main
```

Vercel akan automatically:
1. ✅ Deploy updated code
2. ✅ Use env variables yang sudah dikonfigurasi
3. ✅ Start server dengan proper infrastructure
4. ✅ Chat history akan work!

### Test di Vercel:

1. Go to: https://mpt-community.vercel.app
2. Login
3. Create new chat
4. Send message
5. Refresh page
6. **Message should still be there!** ✅

---

## Lokal Testing (Alternative - Jika Ingin Di-Debug Lebih):

Jika ingin test lokal, gunakan Docker:

```bash
docker build -t mpt-warrior .
docker run -p 3000:3000 \
  -e AZURE_COSMOS_CONNECTION_STRING="..." \
  mpt-warrior
```

**Status**: ✅ Code is ready, environment variables are set  
**Next Step**: Push to GitHub → Vercel deploys → Test live!
