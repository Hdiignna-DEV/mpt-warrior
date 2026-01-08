# 🚨 TROUBLESHOOTING: Error 429 (Rate Limit Exceeded)

**Error:** `Failed to load resource: the server responded with a status of 429 ()`

---

## 🔍 Apa itu Error 429?

Error 429 = **"Too Many Requests"** - Quota API Gemini sudah mencapai limit.

### Gemini FREE Tier Limits:
- ✅ **1,500 requests per hari**
- ✅ **15 requests per menit**

Jika limit tercapai, API akan return error 429.

---

## ✅ Solusi yang Sudah Diterapkan

### 1. **Rate Limiting di Backend** ✅
- Max 10 requests per menit per user
- Mencegah spam dari single user
- File: `src/app/api/chat/route.ts`

### 2. **Retry Logic dengan Exponential Backoff** ✅
- Auto retry 3x jika error 429
- Delay: 1s → 2s → 4s
- Meningkatkan success rate

### 3. **Better Error Messages** ✅
- User mendapat pesan jelas tentang quota
- Suggestion untuk coba lagi besok
- Info tentang upgrade option

### 4. **Frontend Error Handling** ✅
- Display server error messages
- User-friendly error UI
- Informasi troubleshooting

---

## 🔧 Cara Mengatasi Error 429

### Opsi 1: Tunggu Quota Reset (GRATIS)
Gemini quota reset setiap 24 jam (UTC timezone).

**Solusi:**
1. Tunggu hingga besok (waktu UTC reset)
2. User akan mendapat 1,500 requests lagi
3. Pastikan user tidak spam request

### Opsi 2: Dapatkan API Key Baru (GRATIS)
Buat API key baru untuk dapat quota fresh.

**Steps:**
1. Buka: https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy key baru
4. Update di Vercel environment variables:
   - `GEMINI_API_KEY` = new key
   - `NEXT_PUBLIC_GEMINI_API_KEY` = new key
5. Redeploy aplikasi

### Opsi 3: Upgrade ke Paid Plan (RECOMMENDED)
Gemini Pay-as-you-go sangat murah!

**Pricing:**
- Input: $0.075 per 1M tokens (~3,000 chat messages)
- Output: $0.30 per 1M tokens
- Estimasi: $5-10/bulan untuk 100-150 active users

**Cara Upgrade:**
1. Buka: https://aistudio.google.com/app/apikey
2. Enable billing di Google Cloud Console
3. Link billing account
4. Unlimited quota! ✅

### Opsi 4: Implement Multiple API Keys (Advanced)
Rotate multiple FREE API keys untuk extend quota.

**Strategy:**
```typescript
const GEMINI_KEYS = [
  'key_1_for_morning',
  'key_2_for_afternoon', 
  'key_3_for_evening'
];

// Rotate based on time or request count
const currentKey = GEMINI_KEYS[Math.floor(Date.now() / 8_hours) % 3];
```

**Not Recommended untuk production** - Better upgrade ke paid.

---

## 📊 Monitoring Quota Usage

### Check Current Usage:
1. Buka: https://aistudio.google.com/app/apikey
2. Click pada API key yang dipakai
3. View "Usage" atau "Quotas"

### Vercel Logs:
```bash
# Check error logs
vercel logs --prod

# Filter for 429 errors
vercel logs --prod | grep "429"
```

### Add Logging di Code:
```typescript
// Track request count
console.log(`✅ Request successful. User: ${userId}`);
console.log(`📊 Recent requests: ${recentRequests.length}/10 per minute`);
```

---

## 🛡️ Pencegahan Error 429

### 1. Implement Caching
Cache common responses untuk reduce API calls:

```typescript
const responseCache = new Map<string, string>();

function getCachedResponse(query: string): string | null {
  return responseCache.get(query) || null;
}
```

### 2. Debouncing di Frontend
Prevent rapid-fire requests:

```typescript
const [isTyping, setIsTyping] = useState(false);

// Wait 500ms after user stops typing
useEffect(() => {
  const timer = setTimeout(() => {
    setIsTyping(false);
  }, 500);
  return () => clearTimeout(timer);
}, [input]);
```

### 3. User Rate Limiting
Sudah implemented! ✅
- 10 requests per minute per user
- Auto block jika exceed

### 4. Show Queue Position
```typescript
if (isRateLimited) {
  return "⏰ Mohon tunggu 1 menit. Terlalu banyak request.";
}
```

---

## 🎯 Recommended Solution

### For Production App with Active Users:

**UPGRADE KE PAID PLAN** ($5-10/month)

**Why?**
✅ Unlimited quota  
✅ No interruption untuk users  
✅ Predictable costs  
✅ Better user experience  
✅ Scalable untuk growth  

**ROI:**
- 100 active users × 10 messages/day = 1,000 requests/day
- Cost: ~$0.10/day = $3/month
- Membership fee: $500k/month
- AI cost: Negligible! 

### Alternative for Low-Budget:

**Multiple FREE Keys Rotation**
- Key 1: Main (1,500/day)
- Key 2: Backup (1,500/day)
- Key 3: Emergency (1,500/day)
- **Total: 4,500 requests/day** for FREE!

---

## 📝 Implementation Checklist

### Immediate Actions:
- [x] Add rate limiting di backend ✅
- [x] Implement retry logic ✅
- [x] Better error messages ✅
- [x] Frontend error handling ✅
- [ ] Monitor usage daily
- [ ] Setup alerts for quota threshold
- [ ] Decide: Paid vs Free keys

### Long-term Actions:
- [ ] Implement response caching
- [ ] Add request debouncing
- [ ] Setup Redis for distributed rate limiting
- [ ] Analytics dashboard for API usage
- [ ] Auto-scaling with multiple keys

---

## 🆘 Emergency Contacts

**If quota habis di production:**

1. **Quick Fix:** Deploy dengan API key baru
   ```bash
   # Update Vercel env var
   vercel env add GEMINI_API_KEY
   # Paste new key
   # Redeploy
   vercel --prod
   ```

2. **Temporary Disable:** Show maintenance message
   ```typescript
   return NextResponse.json({ 
     error: '🔧 AI Mentor sedang maintenance. Akan aktif kembali dalam 1 jam.' 
   }, { status: 503 });
   ```

3. **Admin Contact:** Notify users via email
   ```
   Subject: AI Mentor Temporary Unavailable
   Body: Due to high traffic, AI Mentor akan available besok jam 00:00 UTC.
   ```

---

## 📊 Current Status

**Rate Limit Protection:** ✅ ACTIVE  
**Retry Logic:** ✅ ACTIVE (3 retries with backoff)  
**Error Handling:** ✅ IMPROVED  
**User Messages:** ✅ FRIENDLY & INFORMATIVE  

**Quota Status:** Check di Google AI Studio  
**Recommended:** Upgrade to Paid Plan untuk peace of mind  

---

**Last Updated:** January 8, 2026  
**Next Review:** Monitor for 48 hours, then decide Paid vs Free
