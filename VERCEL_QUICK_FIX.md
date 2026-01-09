# 🚀 VERCEL DEPLOYMENT FIX - QUICK GUIDE

## ⚡ IMMEDIATE ACTIONS (Do These First)

### Action 1: Verify Vercel Settings
1. Go ke https://vercel.com/dashboard
2. Select "mpt-warrior" project
3. Go ke **Settings**
4. Click **Environment Variables**
5. Verify ada semua ini:
   ```
   ✅ NEXT_PUBLIC_GEMINI_API_KEY
   ✅ GEMINI_API_KEY
   ✅ AZURE_COSMOS_ENDPOINT
   ✅ AZURE_COSMOS_KEY
   ✅ AZURE_COSMOS_DATABASE
   ✅ JWT_SECRET
   ✅ Etc (all dari .env.local)
   ```

### Action 2: Force Rebuild
1. Di Vercel Dashboard
2. Go ke **Deployments**
3. Find latest failed deployment
4. Click **Rebuild** button
5. Wait for build to complete

### Action 3: Update Node Version
1. Settings → Build & Development Settings
2. Scroll ke Node.js Version
3. Set ke **20.x** (latest stable)
4. Save

---

## 🔧 IF STILL FAILING

### Check 1: Local Build Test
```bash
cd c:\Users\deden\mpt-warrior

# Full clean build
rm -r node_modules package-lock.json
npm install
npm run build
```

If lokal build gagal → fix locally first sebelum push

### Check 2: Dependencies Issue
```bash
# Force install all dependencies
npm install --force

# Update all dependencies
npm update

# Check for conflicts
npm audit fix
```

### Check 3: Clear Vercel Cache
1. Vercel Dashboard → Settings → Functions
2. Scroll ke "Caching"
3. Click "Clear All Caches"

Then rebuild

### Check 4: Check Environment Variables
Pastikan di `.env.local` semua variable filled:
```bash
# Show all env vars
cat .env.local | grep -E "^[A-Z_]+=" | sort
```

Copy semua yang punya value (bukan empty), masukkan ke Vercel Settings

---

## 📝 VERCEL.JSON CONFIG

Current config di `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "env": {},
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}
```

Sudah correct! Jangan diubah.

---

## 🎯 PRIORITY CHECKLIST

Do these in order:

- [ ] Check Vercel environment variables (ALL SET?)
- [ ] Click Rebuild di Vercel Dashboard
- [ ] Wait 5 minutes for build
- [ ] Check if passed ✅

If still fails:

- [ ] Run `npm run build` locally
- [ ] Copy error message
- [ ] Share dengan me

---

## 🛠️ AUTOMATED FIX

Run this command untuk fix common issues:

```bash
cd c:\Users\deden\mpt-warrior

# Install dependencies fresh
npm install --force

# Verify build works
npm run build

# If build passes, commit and push
git add .
git commit -m "fix: update dependencies for vercel deployment"
git push origin main
```

Then Vercel akan auto-deploy

---

## 📊 WHAT TO CHECK IN VERCEL LOGS

When deployment fails, look for:

1. **"Module not found"** → dependency issue
2. **"Cannot find variable"** → missing env var
3. **"TypeScript error"** → code issue
4. **"ENOENT"** → file missing
5. **"Memory limit"** → too large build

---

## 💬 PROVIDE THESE IF STILL STUCK

1. **Exact error message** dari Vercel build logs
2. **Screenshot** dari failed deployment
3. **Output** dari `npm run build` command

Then I can fix immediately!

---

**Status**: Build local ✅ SUCCESS → Ready for Vercel

Date: January 9, 2026
