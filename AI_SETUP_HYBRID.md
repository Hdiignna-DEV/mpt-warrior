# 🚀 AI SETUP - HYBRID (GROQ + GEMINI)

## Konfigurasi Terbaik: Kombinasi 2 AI Gratis! ⚡

**Strategy:**
- **Groq (Llama 3.3 70B)** → Text chat (super cepat, hemat quota)
- **Gemini 2.0 Flash** → Image analysis (vision untuk chart)
- **Auto-Fallback** → Jika satu gagal, pakai yang lain

---

## 1️⃣ Dapatkan API Keys (100% GRATIS)

### Groq API Key (PRIORITAS - WAJIB!)
1. Buka: https://console.groq.com/keys
2. Login dengan Google/GitHub
3. Klik **"Create API Key"**
4. Copy key yang dimulai dengan `gsk_...`

**Quota GRATIS:**
- ✅ 30 requests/minute
- ✅ Unlimited requests/day
- ✅ Sangat cepat (lebih cepat dari Gemini)
- ✅ Llama 3.3 70B model

### Gemini API Key (OPTIONAL - untuk chart analysis)
1. Buka: https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik **"Create API Key"**
4. Copy key yang dimulai dengan `AIza...`

**Quota GRATIS:**
- ✅ 1,500 requests/day
- ✅ Vision support (analisa chart)
- ✅ Multilingual

---

## 2️⃣ Pasang API Keys di .env.local

```env
# ========================================
# GROQ AI (PRIORITAS - WAJIB!)
# ========================================
GROQ_API_KEY=gsk_your_groq_api_key_here
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_groq_api_key_here

# ========================================
# GEMINI AI (OPTIONAL - untuk chart)
# ========================================
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
GEMINI_API_KEY=AIzaSyAzXu1TcdIfn8vbz-SFsmMPiAbsr76CFGo
```

---

## 3️⃣ Bagaimana Hybrid System Bekerja?

### Skenario 1: User kirim TEXT biasa
```
User: "Gimana cara manage risk?"
→ Groq Llama 3.3 (⚡ ultra-fast, hemat Gemini quota)
→ Response dalam 1-2 detik
```

### Skenario 2: User upload CHART image
```
User: [Upload gambar chart EURUSD]
→ Gemini 2.0 Flash (📸 vision support)
→ Analisa struktur market, trend, support/resistance
```

### Skenario 3: Groq down/quota habis
```
User: "Analisa trade gue"
→ Groq error ❌
→ Auto fallback ke Gemini ✅
→ Tetap dapat response!
```

### Skenario 4: Gemini quota habis
```
User: [Upload chart]
→ Gemini quota exceeded ❌
→ Error message: "Chart analysis unavailable. Please try text chat."
→ User masih bisa chat TEXT dengan Groq!
```

---

## 4️⃣ Fitur AI di MPT Warrior

### ✅ AI Mentor Chat (`/api/chat`)
- **Groq**: Text chat biasa (cepat, hemat)
- **Gemini**: Analisa chart image (vision)
- **Fallback**: Auto switch jika error
- **Bahasa**: Indonesia & English

### ✅ Trade Analysis (`/api/ai/analyze-trades`)
- **Groq**: Analisa performa trading (cepat)
- **Gemini**: Fallback jika Groq down
- **Output**: Strengths, weaknesses, recommendations

---

## 5️⃣ Testing AI

### Test 1: Chat biasa (harus pakai Groq)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Halo MPT Bot!"}],
    "language": "id"
  }'
```

**Expected:**
```json
{
  "choices": [{"message": {"content": "Halo Warrior! ..."}}],
  "model": "Groq Llama 3.3 70B (FREE)"
}
```

### Test 2: Upload chart (harus pakai Gemini)
1. Buka: http://localhost:3000/ai-mentor
2. Upload screenshot chart
3. Kirim message
4. Check console logs: `📸 Analyzing chart image with Gemini Vision...`

---

## 6️⃣ Monitoring & Logs

### Console Logs
```
⚡ Processing with Groq (super fast)...
✅ Response generated with: Groq Llama 3.3 70B (FREE)

📸 Analyzing chart image with Gemini Vision...
✅ Response generated with: Gemini 2.0 Flash (Vision)

⚠️ Groq failed, falling back to Gemini...
✅ Response generated with: Gemini 2.0 Flash (Fallback)
```

### Response Format
```json
{
  "choices": [...],
  "model": "Groq Llama 3.3 70B (FREE)" // atau "Gemini 2.0 Flash (Vision)"
}
```

---

## 7️⃣ Keuntungan Hybrid Strategy

| Fitur | Groq Only | Gemini Only | Hybrid (Keduanya) |
|-------|-----------|-------------|-------------------|
| Text chat | ✅ Cepat | ✅ Good | ✅✅ Terbaik (Groq) |
| Chart analysis | ❌ No vision | ✅ Vision | ✅✅ Terbaik (Gemini) |
| Speed | ✅✅ Super fast | ✅ Good | ✅✅ Terbaik |
| Quota/day | Unlimited | 1,500 | ✅✅ Hemat Gemini |
| Reliability | ⚠️ Single point | ⚠️ Single point | ✅✅ Auto fallback |
| Cost | $0 | $0 | $0 |

---

## 8️⃣ Best Practices

### DO ✅
- Pasang KEDUA API keys untuk reliability maksimal
- Gunakan Groq untuk text chat (hemat Gemini quota)
- Gunakan Gemini untuk chart analysis (vision)
- Monitor logs untuk tracking AI provider yang dipakai

### DON'T ❌
- Jangan pakai Gemini untuk text biasa (buang quota)
- Jangan spam upload chart (quota terbatas)
- Jangan lupa restart dev server setelah update .env.local

---

## 9️⃣ Troubleshooting

### Error: "No AI provider configured"
**Fix:** Minimal pasang 1 API key (Groq atau Gemini)

### Error: "Image analysis requires Gemini API"
**Fix:** Pasang Gemini API key untuk vision support

### Groq: "quota exceeded"
**No problem!** Auto fallback ke Gemini

### Gemini: "quota exceeded"
**No problem!** Text chat masih jalan dengan Groq

---

## 🎯 Checklist Setup

- [ ] Daftar Groq: https://console.groq.com/keys
- [ ] Copy Groq API key → .env.local
- [ ] (Optional) Daftar Gemini: https://aistudio.google.com/app/apikey
- [ ] (Optional) Copy Gemini API key → .env.local
- [ ] Restart dev server: `npm run dev`
- [ ] Test text chat (harus Groq)
- [ ] Test chart upload (harus Gemini jika ada key)
- [ ] Deploy ke Azure Static Web Apps

---

## 📊 Summary

**SETUP INI OPTIMAL KARENA:**
1. ⚡ **Speed:** Groq super cepat untuk text (1-2 detik)
2. 📸 **Vision:** Gemini bisa analisa chart
3. 🛡️ **Reliability:** Auto fallback antar AI
4. 💰 **Cost:** 100% GRATIS selamanya
5. 📈 **Quota:** Unlimited Groq + 1,500/day Gemini

**RECOMMENDATION:**
Pasang KEDUA API keys untuk pengalaman terbaik. Jika hanya bisa 1, pilih **Groq** karena:
- Lebih cepat
- Unlimited requests
- Cukup untuk 90% use cases (kecuali chart analysis)

---

**Created:** January 7, 2026  
**Status:** ✅ Production Ready  
**AI Models:** Groq Llama 3.3 70B + Google Gemini 2.0 Flash
