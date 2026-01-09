# 🔧 PHASE 1 AUTOMATION - ENVIRONMENT SETUP

**Status**: Need to set Azure Cosmos DB credentials  
**Time**: 5 minutes  
**Effort**: Copy-paste credentials

---

## 🚨 BEFORE RUNNING AUTOMATION

You need **3 environment variables** for the database migration:

### 1. Get Credentials from Azure Portal

Go to: **Azure Portal → Cosmos DB Account → Keys**

Copy:
- **Endpoint URI** → `AZURE_COSMOS_ENDPOINT`
- **Primary Key** → `AZURE_COSMOS_KEY`
- **Database Name** → `AZURE_COSMOS_DATABASE` (probably "mpt-warrior")

---

## 📋 Setup Methods

### Method A: Export Environment Variables (Recommended)

**On macOS/Linux:**
```bash
export AZURE_COSMOS_ENDPOINT="https://xxx.documents.azure.com:443/"
export AZURE_COSMOS_KEY="your-primary-key-here"
export AZURE_COSMOS_DATABASE="mpt-warrior"

# Verify
echo $AZURE_COSMOS_ENDPOINT
echo $AZURE_COSMOS_KEY

# Now run automation
npm run phase1:auto
```

**On Windows PowerShell:**
```powershell
$env:AZURE_COSMOS_ENDPOINT = "https://xxx.documents.azure.com:443/"
$env:AZURE_COSMOS_KEY = "your-primary-key-here"
$env:AZURE_COSMOS_DATABASE = "mpt-warrior"

# Verify
echo $env:AZURE_COSMOS_ENDPOINT
echo $env:AZURE_COSMOS_KEY

# Now run automation
npm run phase1:auto
```

---

### Method B: Create .env File

**File**: `.env.local`

```env
AZURE_COSMOS_ENDPOINT=https://xxx.documents.azure.com:443/
AZURE_COSMOS_KEY=your-primary-key-here
AZURE_COSMOS_DATABASE=mpt-warrior

# Cron job secret (for Vercel)
CRON_SECRET=your-secret-key-here
```

**Usage**:
```bash
# Next.js automatically loads .env.local
npm run phase1:auto
```

---

### Method C: Vercel Dashboard

If deploying to Vercel:

1. Go to **Vercel Dashboard → Settings → Environment Variables**
2. Add:
   ```
   AZURE_COSMOS_ENDPOINT = https://xxx.documents.azure.com:443/
   AZURE_COSMOS_KEY = your-key-here
   AZURE_COSMOS_DATABASE = mpt-warrior
   CRON_SECRET = your-secret-here
   ```
3. Redeploy

---

## 🔍 Where to Find Credentials

### Azure Portal Steps:
1. Open **Azure Portal** (portal.azure.com)
2. Search for **Cosmos DB**
3. Click your database instance
4. Go to **Settings → Keys**
5. Copy:
   - **URI** → AZURE_COSMOS_ENDPOINT
   - **Primary Key** → AZURE_COSMOS_KEY

### Vercel Environment:
1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add all credentials
5. Redeploy to apply

---

## ✅ VERIFICATION

**Check if credentials are set:**

```bash
# macOS/Linux
echo $AZURE_COSMOS_ENDPOINT
echo $AZURE_COSMOS_KEY

# Windows PowerShell
echo $env:AZURE_COSMOS_ENDPOINT
echo $env:AZURE_COSMOS_KEY
```

**Should output:**
```
https://xxx.documents.azure.com:443/
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If empty, credentials not set yet.

---

## 🚀 ONCE CREDENTIALS ARE SET

Run automation:

```bash
npm run phase1:auto
```

Or:

```bash
npm run phase1:setup
```

---

## ⚠️ COMMON ISSUES

### "Migration failed: Invalid URL"
**Reason**: `AZURE_COSMOS_ENDPOINT` not set  
**Fix**: Set environment variable (see above)

### "Migration failed: Connection timeout"
**Reason**: Wrong endpoint or network issue  
**Fix**: Verify endpoint format: `https://xxx.documents.azure.com:443/`

### "Migration failed: Unauthorized (401)"
**Reason**: Wrong or expired key  
**Fix**: Get new key from Azure Portal

### "Migration failed: Database not found"
**Reason**: Database doesn't exist yet  
**Fix**: Create database first: `npm run db:init`

---

## 🔐 SECURITY NOTES

⚠️ **Never commit credentials to GitHub!**

```bash
# Good: Use .env.local (in .gitignore)
AZURE_COSMOS_KEY=secret

# Bad: Don't do this
echo "AZURE_COSMOS_KEY=secret" >> .env
git commit  # ❌ Don't!
```

**Safe practices**:
- Use `.env.local` (already in .gitignore)
- Use Vercel Environment Variables
- Use Azure Key Vault
- Rotate keys regularly

---

## 📊 CREDENTIAL FORMAT

### AZURE_COSMOS_ENDPOINT
```
https://account-name.documents.azure.com:443/
```

Example:
```
https://mpt-warrior-db.documents.azure.com:443/
```

### AZURE_COSMOS_KEY
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

It's a 96-character base64 string. Copy from Azure Portal Keys section.

### AZURE_COSMOS_DATABASE
```
mpt-warrior
```

Your database name (usually created during setup).

---

## 🎯 QUICK START

1. **Get credentials** from Azure Portal
2. **Set environment variables**:
   ```bash
   export AZURE_COSMOS_ENDPOINT="..."
   export AZURE_COSMOS_KEY="..."
   ```
3. **Run automation**:
   ```bash
   npm run phase1:auto
   ```
4. **Watch it go!** ✨

---

## 📞 HELP

**Still stuck?** Check:
1. Credentials format (no spaces, full URL)
2. Environment variable set: `echo $AZURE_COSMOS_ENDPOINT`
3. Network connectivity: `curl https://documents.azure.com`
4. Azure Portal: Verify database exists

---

**Ready to setup?** 👇

### Next Step:
```bash
# 1. Set credentials
export AZURE_COSMOS_ENDPOINT="https://xxx.documents.azure.com:443/"
export AZURE_COSMOS_KEY="your-key"

# 2. Run automation
npm run phase1:auto
```

Let's go! 🚀
