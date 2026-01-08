# 🔑 CARA CEPAT: Dapatkan Gemini API Key Baru

**Problem:** Error 429 - Quota Gemini habis  
**Solution:** Buat API key baru untuk fresh quota (1,500 requests/day)

---

## ⚡ Quick Steps (5 Menit)

### 1️⃣ Buat API Key Baru

1. Buka: **https://aistudio.google.com/app/apikey**
2. Login dengan Google account (bisa pakai email berbeda untuk quota terpisah)
3. Klik tombol **"Create API Key"**
4. Pilih project atau "Create new project"
5. **COPY** API key yang muncul (dimulai dengan `AIza...`)

**💡 Tip:** Pakai multiple Google accounts untuk multiple free quotas!

---

### 2️⃣ Update di Vercel

#### Via Vercel Dashboard:
1. Buka: **https://vercel.com/[your-team]/mpt-warrior/settings/environment-variables**
2. Find variable: `GEMINI_API_KEY`
3. Click **"Edit"**
4. Paste API key baru
5. Click **"Save"**
6. Repeat untuk `NEXT_PUBLIC_GEMINI_API_KEY`
7. Klik **"Redeploy"** untuk apply changes

#### Via Vercel CLI:
```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add GEMINI_API_KEY production
# Paste your new key when prompted

vercel env add NEXT_PUBLIC_GEMINI_API_KEY production
# Paste same key

# Redeploy
vercel --prod
```

---

### 3️⃣ Update di Local (.env.local)

Edit file `.env.local`:

```env
# Ganti dengan API key baru
GEMINI_API_KEY=AIzaSy_YOUR_NEW_KEY_HERE
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy_YOUR_NEW_KEY_HERE
```

**Jangan commit ke Git!** File `.env.local` sudah di `.gitignore`.

---

### 4️⃣ Test

```bash
# Local test
npm run dev
# Buka http://localhost:3000/ai-mentor
# Kirim message test

# Production test  
# Buka https://mpt-community.vercel.app/ai-mentor
# Test AI Mentor
```

---

## 🎯 Multiple Free API Keys Strategy

Untuk extend free quota tanpa bayar:

### Strategy 1: Daily Rotation
```env
# Monday-Wednesday
GEMINI_API_KEY=AIzaSy_key_1

# Thursday-Saturday  
GEMINI_API_KEY=AIzaSy_key_2

# Sunday
GEMINI_API_KEY=AIzaSy_key_3
```

**Total FREE quota:** 3 × 1,500 = **4,500 requests/day**!

### Strategy 2: Auto-Rotation (Advanced)

Create `src/lib/gemini-keys.ts`:

```typescript
// Rotate keys based on time of day
const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,  // 00:00 - 08:00
  process.env.GEMINI_KEY_2,  // 08:00 - 16:00  
  process.env.GEMINI_KEY_3,  // 16:00 - 24:00
];

export function getActiveGeminiKey(): string {
  const hour = new Date().getHours();
  const keyIndex = Math.floor(hour / 8);
  return GEMINI_KEYS[keyIndex] || GEMINI_KEYS[0];
}
```

Update `src/app/api/chat/route.ts`:

```typescript
import { getActiveGeminiKey } from '@/lib/gemini-keys';

const GEMINI_API_KEY = getActiveGeminiKey();
```

**Vercel Environment Variables:**
```
GEMINI_KEY_1=AIzaSy_first_key
GEMINI_KEY_2=AIzaSy_second_key  
GEMINI_KEY_3=AIzaSy_third_key
```

---

## 💰 Upgrade to Paid (Recommended)

**When to upgrade:**
- Active users > 100/day
- Hitting quota limit frequently
- Need reliable service 24/7

**Cost estimation:**
```
100 users × 10 messages/day = 1,000 requests
Average tokens per request: 500
Total tokens/day: 500,000

Cost/day:
- Input: 500k × $0.075/1M = $0.0375
- Output: 500k × $0.30/1M = $0.15
Total: ~$0.19/day = $5.70/month
```

**Sangat murah untuk production app!**

### Enable Paid Plan:

1. Buka: https://console.cloud.google.com/
2. Select project yang dipakai untuk API key
3. Go to: **Billing** → **Link a billing account**
4. Add credit card (Google won't charge without confirmation)
5. Enable **Gemini API**
6. Done! Unlimited quota ✅

---

## 🔒 API Key Security

### ✅ DO:
- Store di environment variables
- Use `.env.local` untuk local dev
- Use Vercel env vars untuk production
- Rotate keys jika exposed
- Monitor usage di Google AI Studio

### ❌ DON'T:
- Commit ke Git
- Share di public
- Hardcode di source code
- Use NEXT_PUBLIC prefix untuk sensitive keys
- Leave unused keys active

---

## 📊 Monitor Usage

### Google AI Studio Dashboard:
1. https://aistudio.google.com/app/apikey
2. Click pada API key
3. View **"Quotas & System Limits"**
4. Monitor requests/day

### Set Alert:
```typescript
// Add to API route
if (requestCount > 1400) {
  console.warn('⚠️ Approaching quota limit!');
  // Send email alert to admin
}
```

---

## 🆘 Emergency: Quota Habis di Production

### Quick Fix (1 menit):

```bash
# Terminal
vercel env add GEMINI_API_KEY production

# Paste new key
AIzaSy_emergency_new_key

# Redeploy
vercel --prod --force
```

**Users akan bisa chat lagi dalam 2-3 menit!**

---

## 📞 Support

**Google Gemini API:**
- Docs: https://ai.google.dev/docs
- Support: https://support.google.com/

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**MPT Warrior:**
- Admin: dedenhadigun@gmail.com

---

**Last Updated:** January 8, 2026  
**Status:** Rate limiting implemented ✅  
**Next:** Monitor usage for 24 hours
