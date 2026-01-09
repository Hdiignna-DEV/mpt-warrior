# 🚀 VERCEL DEPLOYMENT TROUBLESHOOTING GUIDE

**Issue**: Auto-deploy dari GitHub ke Vercel gagal  
**Date**: January 9, 2026  
**Project**: mpt-warrior

---

## 🔍 DIAGNOSTIC STEPS

### Step 1: Check Vercel Logs
1. Go ke https://vercel.com/dashboard
2. Select project "mpt-warrior"
3. Click "Deployments"
4. Find the failed deployment (red X)
5. Click on it dan scroll ke bawah untuk lihat **Build logs**
6. Copy error message dan share dengan saya

**Common error patterns:**
- ❌ `Module not found`
- ❌ `ENOENT: no such file`
- ❌ `TypeScript compilation error`
- ❌ `Environment variable missing`
- ❌ `Build command failed`

---

## ⚙️ COMMON FIXES

### Fix 1: Missing Environment Variables
**Symptoms**: Build fails dengan `undefined variable` errors

**Solution**:
1. Go ke Project Settings → Environment Variables
2. Verify semua variables sudah di-set (dari `.env.example`):
   - `NEXT_PUBLIC_GEMINI_API_KEY` ✅
   - `GEMINI_API_KEY` ✅
   - `AZURE_COSMOS_ENDPOINT` ✅
   - `AZURE_COSMOS_KEY` ✅
   - `AZURE_COSMOS_DATABASE` ✅
   - `JWT_SECRET` ✅
   - `NEXT_PUBLIC_ADMIN_EMAIL` ✅
   - Dll...

**Check in Vercel**:
```
Settings → Environment Variables → Production/Preview/Development
```

### Fix 2: Node Version Mismatch
**Symptoms**: `npm ERR!` atau compatibility errors

**Solution**:
1. Update `.nvmrc`:
```
20.9.0
```

2. Or set di Vercel:
```
Settings → Build & Development Settings → Node.js Version → 20.x
```

### Fix 3: Build Command Issue
**Symptoms**: Build command not found

**Solution - vercel.json sudah correct**:
```json
{
  "buildCommand": "npm run build"
}
```

Tapi verify di Vercel UI:
```
Settings → Build & Development Settings → Build Command → "npm run build"
```

### Fix 4: npm install Failures
**Symptoms**: `npm ERR! code ERESOLVE` atau peer dependency warnings

**Solution**:
Update package-lock.json:
```bash
npm install --force
# Then push ke GitHub
```

---

## 🔧 QUICK FIXES TO TRY

### 1. Clear Vercel Cache
```
Vercel Dashboard → Deployments → More Menu (3 dots) → Redeploy
```
Then scroll down and click "Redeploy with existing outputs"

### 2. Rebuild from Source
```
Vercel Dashboard → Deployments → More Menu → Rebuild
```

### 3. Trigger New Deployment
Push empty commit:
```bash
cd c:\Users\deden\mpt-warrior
git commit --allow-empty -m "trigger: rebuild"
git push origin main
```

### 4. Update Build Settings
In Vercel:
1. Settings → Build & Development Settings
2. Clear Framework Preset
3. Set:
   - Framework: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

## 📋 VERCEL CONFIGURATION CHECKLIST

- [ ] Project connected ke GitHub
- [ ] Auto-deploy enabled untuk `main` branch
- [ ] Environment variables all set ✅
- [ ] Node.js version correct (20.x)
- [ ] Build command: `npm run build`
- [ ] Install command: `npm ci` (default)
- [ ] Output directory: `.next`
- [ ] Root directory: `./` (project root)

---

## 🚨 TROUBLESHOOTING TREE

```
Vercel build fails?
│
├─→ Check build logs (Deployments → Failed → View Logs)
│
├─→ Is it "Module not found"?
│   ├─→ YES: File path issue? Check imports
│   └─→ NO: Go next
│
├─→ Is it "Cannot find module"?
│   ├─→ YES: `npm install --force` then push
│   └─→ NO: Go next
│
├─→ Is it about environment variables?
│   ├─→ YES: Add to Vercel Settings → Env Variables
│   └─→ NO: Go next
│
├─→ Is it TypeScript error?
│   ├─→ YES: Check `npm run build` locally
│   └─→ NO: Go next
│
└─→ If still failing:
    → Check GitHub Actions logs
    → Contact Vercel support dengan logs
```

---

## 🔗 GITHUB ACTIONS LOGS

Sometimes issue is with GitHub workflow, not Vercel:

1. Go to GitHub: https://github.com/Hdiignna-DEV/mpt-warrior
2. Click "Actions" tab
3. Find the failed workflow
4. Click on it untuk see logs
5. Check untuk errors

---

## 📝 DEBUG STEPS

### Step A: Test Build Locally
```bash
npm run build
# If this fails locally, Vercel akan fail juga
```

### Step B: Check New Files Syntax
Recent changes might have issues:
```bash
# Check TypeScript errors
npm run build 2>&1 | grep -i "error"
```

### Step C: Validate Dependencies
```bash
npm ls framer-motion
npm ls canvas-confetti

# Should show installed versions
```

### Step D: Clear & Reinstall
```bash
npm ci --force
npm run build
```

---

## 🎯 MOST COMMON CAUSES (for this project)

1. **❌ Missing Cosmos DB environment variables**
   - Fix: Add to Vercel Settings

2. **❌ Framer-motion or canvas-confetti not installed**
   - Fix: Already in package.json, but try `npm install --force`

3. **❌ TypeScript compilation errors**
   - Fix: Run `npm run build` locally to identify

4. **❌ Node version issue**
   - Fix: Vercel should use 20.x (check .nvmrc)

5. **❌ Next.js caching issue**
   - Fix: Rebuild without cache di Vercel UI

---

## 💡 PREVENTION TIPS

1. **Always test locally before push**:
```bash
npm run build
npm run start
# Verify works at http://localhost:3000
```

2. **Keep .env.local updated**:
```bash
cp .env.example .env.local
# Fill in your values
```

3. **Regular dependency updates**:
```bash
npm install
npm audit fix
```

4. **Monitor Vercel dashboard**:
   - Set up Slack notifications
   - Review deployment logs weekly

---

## 📞 NEXT STEP

**Please share:**
1. Exact error message dari Vercel build logs
2. Screenshot dari failed deployment
3. Recent changes made to code

**Atau gunakan automated fix**:
```bash
# This will help identify issues
npm run build 2>&1
```

Share output dari command above, dan saya akan fix immediately!

---

**Ready to help!** Just provide the error message from Vercel.

Last Updated: January 9, 2026
