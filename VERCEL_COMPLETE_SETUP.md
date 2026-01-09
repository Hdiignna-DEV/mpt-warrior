# ⚙️ VERCEL DEPLOYMENT - COMPLETE SETUP & TROUBLESHOOTING

**Project**: mpt-warrior  
**Current Issue**: Auto-deploy fails  
**Solution**: Follow this guide step-by-step

---

## 🎯 STEP 1: VERIFY ENVIRONMENT VARIABLES (MOST COMMON ISSUE)

### 1.1 Check What's in .env.local
```bash
cat c:\Users\deden\mpt-warrior\.env.local
```

### 1.2 Copy ALL Non-Empty Variables to Vercel
1. Open: https://vercel.com/dashboard → mpt-warrior → Settings → Environment Variables
2. Add each variable:
   - Key: `VARIABLE_NAME`
   - Value: `value_from_env_local`
   - Select: **Production, Preview, Development**
   - Click "Save"

**Critical Variables (MUST exist)**:
```
NEXT_PUBLIC_GEMINI_API_KEY
GEMINI_API_KEY
AZURE_COSMOS_ENDPOINT
AZURE_COSMOS_KEY
AZURE_COSMOS_DATABASE
AZURE_COSMOS_CONNECTION_STRING
JWT_SECRET
NEXT_PUBLIC_ADMIN_EMAIL
GMAIL_USER
GMAIL_APP_PASSWORD
RESEND_API_KEY
CRON_SECRET (for scheduled jobs)
ADMIN_API_KEY (if used)
```

**Optional but Recommended**:
```
CLAUDE_API_KEY
GROQ_API_KEY
YOU_API_KEY
NEXT_PUBLIC_GROQ_API_KEY
AZURE_BLOB_CONTAINER
AZURE_STORAGE_CONNECTION_STRING
```

### ✅ Verification:
After adding all variables:
1. Click "Redeploy" di Vercel
2. Watch the build logs
3. Should complete successfully

---

## 🎯 STEP 2: CHECK BUILD SETTINGS

Go to Vercel → Settings → Build & Development Settings

**Verify these are set correctly**:

| Setting | Value | Status |
|---------|-------|--------|
| Framework | Next.js | ✅ |
| Build Command | `npm run build` | ✅ |
| Output Directory | `.next` | ✅ |
| Install Command | `npm ci` | ✅ |
| Node.js Version | 20.x | ✅ |
| Root Directory | `./` | ✅ |

**If changed, click "Save"**

---

## 🎯 STEP 3: VERIFY GITHUB CONNECTION

1. Vercel Dashboard → Settings → Git
2. Under "GitHub":
   ```
   ✅ Repository: Hdiignna-DEV/mpt-warrior
   ✅ Branch: main
   ✅ Auto-deploy on push: Enabled
   ✅ Deployments: Production enabled
   ```

---

## 🎯 STEP 4: REBUILD WITHOUT CACHE

1. Vercel Dashboard → **Deployments**
2. Find failed deployment
3. Click **More (...)** menu
4. Click **Rebuild**
5. Check **"Use different source cache"** (if available)
6. Wait for build

---

## 🎯 STEP 5: LOCAL VERIFICATION

Run locally to confirm build works:

```bash
cd c:\Users\deden\mpt-warrior

# Clean install
rm -r node_modules
npm install

# Build
npm run build

# If build succeeds locally, issue is with Vercel config
# If build fails locally, fix locally first
```

**Expected output**:
```
✓ Compiled successfully in X.Xs
Collecting page data using Y workers
✓ Collecting page data
Generating static pages using Z workers
✓ Generating static pages
✓ Finalizing page optimization
✓ Linting source code using 15 workers
✓ Creating serverless functions
✓ Generating build manifest
✓ Pruning the cache
Route (app)                                        Size      First Load
...
```

---

## 🔍 STEP 6: DEBUG VERCEL BUILD LOGS

When deployment fails:

1. Vercel Dashboard → **Deployments** → Failed deployment
2. Scroll to bottom for **"Build Logs"**
3. Look for:
   ```
   ❌ Error: [exact error message]
   ❌ at [file:line]
   ❌ [suggested fix]
   ```

**Common errors & fixes**:

### Error: "Module not found"
```
Error: Cannot find module '@/components/leaderboard/Top10Celebration'
```
**Fix**: 
```bash
# Check file exists
ls src/components/leaderboard/Top10Celebration.tsx

# If exists, reinstall
npm install --force
```

### Error: "Cannot find variable"
```
Error: ReferenceError: NEXT_PUBLIC_GEMINI_API_KEY is not defined
```
**Fix**: Add to Vercel Environment Variables (Step 1)

### Error: "TypeScript compilation error"
```
Error: Type 'xxx' is not assignable to type 'yyy'
```
**Fix**: 
```bash
npm run build  # Run locally to see full error
# Fix the TypeScript error
git add .
git commit -m "fix: typescript error"
git push origin main
```

### Error: "ENOENT: no such file"
```
Error: ENOENT: no such file or directory, open '/vercel/path/to/file'
```
**Fix**: Check if file is committed to git
```bash
git status
git add -A
git commit -m "add missing files"
git push origin main
```

---

## 🚀 STEP 7: MANUAL DEPLOYMENT TRIGGER

If auto-deploy not working:

```bash
cd c:\Users\deden\mpt-warrior

# Make an empty commit to trigger redeploy
git commit --allow-empty -m "trigger: vercel rebuild"
git push origin main

# Vercel should auto-deploy within 30 seconds
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] `.env.local` has all required variables
- [ ] All variables copied to Vercel → Settings → Environment Variables
- [ ] Build settings correct (Node.js 20.x, `npm run build`)
- [ ] GitHub connection verified
- [ ] Local build works: `npm run build` passes
- [ ] Recent commits pushed to main branch
- [ ] No TypeScript errors locally

---

## 🎁 BONUS: PRODUCTION ENVIRONMENT SETUP

For production use, also set:

1. **Vercel Environment** → Select "Production"
2. **Custom Domain** (if you have one)
3. **SSL/TLS** → Auto (default)
4. **Region** → Closest to you
5. **Edge Caching** → Enabled

---

## 📞 IF STILL STUCK

**Provide these details**:

1. **Error message** from Vercel build log
2. **Exact timestamp** of failed deployment
3. **Output** from `npm run build` locally
4. **List** of environment variables set (without values)

Example:
```
Error from Vercel:
"Error: Cannot find module '@/components/leaderboard/Top10Celebration' 
  at /vercel/path/index.js:123"

Local build output:
"✓ Compiled successfully in 5.1s"

Environment variables set:
- NEXT_PUBLIC_GEMINI_API_KEY ✅
- AZURE_COSMOS_ENDPOINT ✅
- JWT_SECRET ✅
```

With this info, I can fix immediately!

---

## 🔗 USEFUL LINKS

- Vercel Dashboard: https://vercel.com/dashboard
- Project Settings: https://vercel.com/dashboard/mpt-warrior/settings
- Deployments: https://vercel.com/dashboard/mpt-warrior/deployments
- GitHub Repo: https://github.com/Hdiignna-DEV/mpt-warrior

---

**Last Updated**: January 9, 2026  
**Status**: Ready for debugging  
**Next**: Follow steps above or share error message
