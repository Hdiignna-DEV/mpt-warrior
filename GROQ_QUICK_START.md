# ⚡ QUICK START: Groq API Key Setup

**Goal:** Get your FREE Groq API key in 2 minutes!

---

## 🔑 Step 1: Get API Key (2 minutes)

### Via Browser:

1. **Buka:** https://console.groq.com/keys
2. **Login:** Pakai Google atau GitHub account
3. **Click:** "Create API Key" button (orange/purple button)
4. **Name:** "MPT Warrior Production"
5. **Copy:** Key starts with `gsk_...`

**Screenshot guide:**
```
[Groq Console] → [API Keys] → [Create API Key] → [Copy Key]
```

**Important:** 
- ⚠️ Save immediately! Won't show again
- ✅ FREE forever - no credit card needed
- ✅ Unlimited daily requests
- ✅ 30 requests per minute

---

## 📋 Step 2: Add to Vercel (1 minute)

### Quick Method:

1. **Go to:** https://vercel.com/settings/environment-variables
   (Or your specific project settings)

2. **Add TWO variables:**

   **Variable 1:**
   ```
   Name: GROQ_API_KEY
   Value: [paste your gsk_... key here]
   Environment: Production, Preview, Development
   ```

   **Variable 2:**
   ```
   Name: NEXT_PUBLIC_GROQ_API_KEY
   Value: [paste same gsk_... key here]  
   Environment: Production, Preview, Development
   ```

3. **Click:** "Save"

---

## 🚀 Step 3: Deploy

### Option A: Auto Deploy (Recommended)
```bash
# Just push to GitHub
git add .
git commit -m "feat: Add Groq AI support"
git push origin main

# Vercel auto-deploys in 1-2 minutes
```

### Option B: Manual Deploy
```bash
# Via Vercel CLI
vercel --prod

# Or via Vercel dashboard
# Click "Deploy" button
```

---

## ✅ Step 4: Test (30 seconds)

1. **Open:** https://mpt-community.vercel.app/ai-mentor
2. **Send message:** "Test AI mentor"
3. **Check:**
   - ✅ Get response in 1-2 seconds
   - ✅ Footer shows "POWERED BY GROQ LLAMA 3.3 70B"
   - ✅ No errors

**If works:** 🎉 Done! AI Mentor is live!

---

## 🆘 Troubleshooting

### ❌ Error: "API key not configured"
**Fix:** 
1. Check Vercel env vars are saved
2. Redeploy application
3. Clear cache: `vercel --prod --force`

### ❌ Error: "Invalid API key"
**Fix:**
1. Get new key from console.groq.com
2. Make sure you copied full key (starts with `gsk_`)
3. No spaces before/after key

### ❌ No response / Timeout
**Fix:**
1. Check Vercel function logs
2. Verify GROQ_API_KEY is set
3. Test locally first: `npm run dev`

---

## 📊 Verify Setup

### Check Vercel Environment Variables:

```bash
# Via CLI
vercel env ls

# Should see:
# GROQ_API_KEY (Production, Preview, Development)
# NEXT_PUBLIC_GROQ_API_KEY (Production, Preview, Development)
```

### Check Vercel Logs:

```bash
# Real-time logs
vercel logs --prod --follow

# Should see:
# ⚡ Processing with Groq Llama 3.3 70B...
# ✅ Response generated successfully
```

---

## 💡 Pro Tips

### Tip 1: Multiple API Keys (Advanced)
Create 2-3 keys for rotation if needed:
```
GROQ_API_KEY_1=gsk_key_for_main
GROQ_API_KEY_2=gsk_key_for_backup
```

### Tip 2: Monitor Usage
Check usage at: https://console.groq.com/usage

### Tip 3: Rate Limit Status
Current implementation: 15 req/min per user (safe margin)

---

## 🎯 Quick Checklist

- [ ] Login to console.groq.com
- [ ] Create API key
- [ ] Copy key (starts with gsk_)
- [ ] Add to Vercel env vars (both GROQ_API_KEY variants)
- [ ] Deploy to Vercel
- [ ] Test at /ai-mentor
- [ ] Verify "POWERED BY GROQ" badge

**Total time:** ~5 minutes ⚡

---

## 🔗 Important Links

- **Groq Console:** https://console.groq.com
- **API Keys Page:** https://console.groq.com/keys
- **Groq Docs:** https://console.groq.com/docs
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**Status:** Ready to deploy! 🚀  
**Estimated setup time:** 5 minutes  
**Difficulty:** Easy (just copy-paste)

*Get unlimited free AI requests with Groq!*
