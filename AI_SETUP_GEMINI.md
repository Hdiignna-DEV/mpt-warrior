# 🤖 AI Configuration - Google Gemini (FREE)

## ✅ Status: Configured & Ready!

MPT Warrior sekarang menggunakan **Google Gemini 2.0 Flash** sebagai AI mentor - **100% GRATIS!**

---

## 🎯 AI Model yang Digunakan

### **Google Gemini 2.0 Flash Experimental**

**Features:**
- ✅ **GRATIS selamanya** (generous free tier)
- ✅ **1,500 requests/day FREE**
- ✅ **Super cepat** (Flash model)
- ✅ **Vision support** (bisa analisa chart gambar!)
- ✅ **Multilingual** (Indonesia & English)
- ✅ **4096 max output tokens**
- ✅ **No credit card required**

**Digunakan untuk:**
1. **AI Mentor Chat** (`/ai-mentor`)
   - Analisa chart gambar
   - Konsultasi trading
   - Mindset coaching
   - Q&A trading

2. **Trade Analysis** (`/analytics`)
   - Analisa performa trading
   - Identifikasi pattern
   - Rekomendasi improvement
   - Psychological insights

---

## 📋 API Key Configuration

### Current Setup ✅

API Key sudah dikonfigurasi di `.env.local`:

```env
GEMINI_API_KEY=AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

### Untuk Azure Deployment

Tambahkan ke **Azure Static Web Apps Configuration**:

```
Name: GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo

Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

### Untuk GitHub Secrets

Tambahkan secret:

```
Name: GOOGLE_GEMINI_API_KEY
Value: AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

---

## 💰 Cost & Quota

### Free Tier Limits (Sudah Cukup!)

**Gemini 2.0 Flash Experimental:**
- ✅ **Requests per day**: 1,500 (FREE)
- ✅ **Requests per minute**: 15 (FREE)
- ✅ **Tokens per minute**: 1 million (FREE)
- ✅ **Max output tokens**: 8,192

**Estimasi Penggunaan:**
- 100 users aktif/hari
- 10 chat messages per user
- **Total: 1,000 requests/hari** ✅ (masih di bawah limit)

**Capacity:**
- Supports: **100-150 active users/day** dengan FREE tier
- Setelah itu: Upgrade ke paid (opsional)

---

## 🔄 Upgrade ke Paid (Optional)

Jika komunitas tumbuh besar dan quota habis:

### Google AI Gemini API Pricing

**Pay-as-you-go:**
- Gemini Flash: **$0.075 per 1M input tokens**
- Gemini Flash: **$0.30 per 1M output tokens**

**Estimasi biaya untuk 500 users/day:**
- ~5,000 requests/day
- ~$5-10/bulan

---

## 🆚 Comparison: Gemini vs Other AI

| Feature | Gemini Flash (Current) | Claude (Paid) | GPT-4 (Paid) | Groq (Free) |
|---------|----------------------|---------------|--------------|-------------|
| **Cost** | ✅ FREE | ❌ $3-15/month | ❌ $10-20/month | ✅ FREE |
| **Vision** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Speed** | ⚡ Fast | ⚡ Fast | 🐌 Slow | ⚡⚡ Very Fast |
| **Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Quota** | 1500/day | Pay per use | Pay per use | 30/min |
| **Best For** | **Trading mentor** | Complex tasks | Creative tasks | Speed-critical |

**Verdict:** Gemini Flash perfect untuk MPT Warrior! ✅

---

## 📚 Implementation Details

### File Changes Made:

1. **`/src/app/api/chat/route.ts`**
   - Changed from: Claude Anthropic SDK
   - Changed to: Google Generative AI SDK
   - Vision support: ✅ Maintained
   - Multilingual: ✅ Maintained

2. **`/src/app/api/ai/analyze-trades/route.ts`**
   - Changed from: Claude Sonnet 4.5
   - Changed to: Gemini 2.0 Flash
   - Analysis quality: ✅ Maintained

### API Endpoints:

```
POST /api/chat
- Body: { messages, image?, language? }
- Response: { choices: [{ message: { role, content } }] }

POST /api/ai/analyze-trades
- Headers: Authorization: Bearer <token>
- Response: { analysis, stats, tradesAnalyzed }
```

---

## 🧪 Testing AI Features

### Test AI Mentor (Text):

```bash
# Start dev server
npm run dev

# Visit: http://localhost:3000/ai-mentor
# Try questions like:
- "Apa itu risk management?"
- "How to handle losing streak?"
- "Analisa mindset trading saya"
```

### Test AI Mentor (Chart Image):

```bash
# Visit: http://localhost:3000/ai-mentor
# Click upload icon
# Upload chart screenshot
# Ask: "Analisa chart ini"
```

### Test Trade Analysis:

```bash
# Visit: http://localhost:3000/analytics
# Click "AI Analysis"
# Wait for comprehensive analysis
```

---

## 🐛 Troubleshooting

### Error: "API Key tidak valid"

**Solution:**
1. Check `.env.local` file
2. Verify API key starts with `AIza`
3. Restart dev server: `npm run dev`

### Error: "Quota exceeded"

**Solutions:**
1. **Short term**: Wait 24 hours (quota resets daily)
2. **Medium term**: Implement caching untuk responses
3. **Long term**: Upgrade ke paid tier

### Error: "Vision not working"

**Check:**
1. Model: Must be `gemini-2.0-flash-exp` or `gemini-1.5-flash`
2. Image format: PNG/JPEG base64
3. Image size: < 4MB

---

## 🚀 Optimization Tips

### 1. Implement Caching

Cache common questions:

```typescript
const cache = new Map<string, string>();

if (cache.has(question)) {
  return cache.get(question);
}

const response = await model.generateContent(question);
cache.set(question, response.text());
```

### 2. Rate Limiting

Limit per user:

```typescript
// Max 10 requests per user per hour
const rateLimit = {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000,
};
```

### 3. Prompt Optimization

Keep prompts concise:
- ✅ Short system instructions
- ✅ Focused questions
- ❌ Avoid very long contexts

---

## 📊 Monitoring

### Check API Usage

Visit: [Google AI Studio](https://aistudio.google.com/)
- View quota usage
- Monitor request patterns
- Check errors

### Setup Alerts

When quota > 80%:
- Email notification
- Upgrade reminder
- Fallback to cached responses

---

## ✅ Checklist

- [x] Gemini API key configured
- [x] Chat API updated to Gemini
- [x] Trade analysis updated to Gemini
- [x] Vision support working
- [x] Multilingual support maintained
- [x] Build successful
- [ ] Test on live deployment
- [ ] Monitor quota usage
- [ ] Setup caching (optional)

---

## 🎯 Next Steps

### After Deployment:

1. **Test AI features** on live app
2. **Monitor quota** daily for first week
3. **Collect feedback** from community
4. **Optimize prompts** based on usage
5. **Consider caching** if high traffic

### If Quota Issues:

1. Implement response caching
2. Add rate limiting per user
3. Upgrade to paid tier (if needed)
4. Consider hybrid: Gemini + Groq

---

## 🆘 Need Help?

### Documentation:
- [Gemini API Docs](https://ai.google.dev/docs)
- [Pricing](https://ai.google.dev/pricing)
- [Quota Management](https://ai.google.dev/gemini-api/docs/quota)

### Community:
- [Google AI Discord](https://discord.gg/google-ai)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-gemini)

---

**AI Mentor sekarang 100% GRATIS dengan Gemini! 🎉**

**Deploy sekarang dan komunitas Anda bisa chat dengan AI tanpa biaya!**
