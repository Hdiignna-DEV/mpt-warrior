# 🚀 MPT Warrior - Azure Static Web Apps Deployment Guide

## 📋 Prerequisites

1. **Azure for Students Account** (Already have ✅)
2. **GitHub Account** with this repository
3. **Azure CLI** installed (optional but recommended)

---

## 🎯 Step 1: Create Azure Static Web App

### Via Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Static Web App"**
4. Click **Create**

### Configuration:

```yaml
Subscription: Azure for Students
Resource Group: mpt-warrior-rg (create new)
Name: mpt-warrior-app
Region: East Asia (closest to Indonesia)
Plan: Free (F0)
Deployment Source: GitHub
```

5. **Authorize GitHub** when prompted
6. Select your repository: `mpt-warrior`
7. Select branch: `main`
8. Build Presets: **Next.js**
9. App location: `/`
10. Output location: `.next`

Click **Review + Create** → **Create**

---

## 🔑 Step 2: Configure Environment Variables

In Azure Portal, go to your Static Web App:

1. Click **"Configuration"** in left menu
2. Click **"Application settings"**
3. Add these variables:

### Database (Already configured in Cosmos DB)
```
AZURE_COSMOS_ENDPOINT=https://your-cosmos-db.documents.azure.com:443/
AZURE_COSMOS_KEY=your-primary-key
AZURE_COSMOS_DATABASE=mpt-warrior
```

### AI Services (Your existing keys)
```
GOOGLE_GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key (optional)
ANTHROPIC_API_KEY=your-key (optional)
GROQ_API_KEY=your-key (optional)
```

### Authentication
```
NEXTAUTH_SECRET=your-random-32-char-string
NEXTAUTH_URL=https://your-app-name.azurestaticapps.net
```

### Email (Optional - Resend)
```
RESEND_API_KEY=your-key
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🔧 Step 3: Update Next.js Config

The `staticwebapp.config.json` has been created for you with:
- ✅ SPA routing support
- ✅ API routes configuration
- ✅ CORS headers
- ✅ PWA manifest support

---

## 📦 Step 4: Setup GitHub Secrets

The workflow file has been created at `.github/workflows/azure-static-web-apps.yml`

Add these secrets to your GitHub repo:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each:

```
AZURE_STATIC_WEB_APPS_API_TOKEN (from Azure Portal - Static Web App → Manage deployment token)

Database:
AZURE_COSMOS_ENDPOINT
AZURE_COSMOS_KEY
AZURE_COSMOS_DATABASE

AI:
GOOGLE_GEMINI_API_KEY
OPENAI_API_KEY (optional)
ANTHROPIC_API_KEY (optional)
GROQ_API_KEY (optional)

Auth:
NEXTAUTH_SECRET
NEXTAUTH_URL

Email:
RESEND_API_KEY (optional)
EMAIL_FROM (optional)
```

---

## 🚀 Step 5: Deploy

### Automatic Deployment:
```bash
git add .
git commit -m "Setup Azure Static Web Apps deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build your Next.js app
2. Deploy to Azure Static Web Apps
3. Update your live site

### Check Deployment:
- GitHub: Go to **Actions** tab to see build progress
- Azure: Go to **Environments** in Static Web App to see deployments

---

## 🌐 Step 6: Access Your App

Your app will be available at:
```
https://your-app-name.azurestaticapps.net
```

### Optional: Add Custom Domain
1. In Azure Portal → Static Web App → **Custom domains**
2. Add your domain (requires DNS configuration)

---

## 📊 Step 7: Setup Monitoring (FREE)

### Azure Monitor (Included in Free Tier):

1. In Azure Portal → Static Web App
2. Click **"Monitoring"** → **"Metrics"**
3. Add alerts for:
   - Bandwidth usage (alert at 80 GB)
   - Request count
   - Response time

### Cosmos DB Monitoring:

1. Go to Cosmos DB → **Metrics**
2. Monitor:
   - **Total Request Units** (keep under 1000 RU/s)
   - **Storage used** (keep under 25 GB)
3. Set alerts at 800 RU/s

---

## 💰 Cost Optimization Tips

### 1. Keep Cosmos DB in Free Tier
```typescript
// Always use partition keys in queries
const user = await container.item(userId, userId).read();

// Avoid cross-partition queries
// ❌ BAD
const allUsers = await container.items.readAll().fetchAll();

// ✅ GOOD
const usersByRole = await container.items
  .query({
    query: "SELECT * FROM c WHERE c.role = @role",
    parameters: [{ name: "@role", value: "warrior" }]
  }, { partitionKey: "warrior" })
  .fetchAll();
```

### 2. Enable Caching
```typescript
// Cache API responses
export const revalidate = 3600; // 1 hour

// Use React Query for client-side caching (already setup ✅)
```

### 3. Optimize Images
```typescript
// Already configured in next.config.ts ✅
// Uses AVIF and WebP formats
// Image optimization included
```

### 4. Monitor Usage Weekly
- Check bandwidth in Azure Portal
- Check RU/s consumption
- Review request logs

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Azure App Settings for production

### 2. API Protection
```typescript
// Rate limiting (add to API routes)
// Use Azure API Management (free tier available)
```

### 3. CORS Configuration
Already configured in `staticwebapp.config.json` ✅

---

## 🐛 Troubleshooting

### Build Fails:
1. Check GitHub Actions logs
2. Verify all environment variables are set
3. Test build locally: `npm run build`

### 404 Errors:
- Check `staticwebapp.config.json` routes
- Verify `navigationFallback` is configured

### API Not Working:
- Check CORS settings
- Verify environment variables in Azure Portal
- Check API logs in Azure Portal

### Slow Performance:
- Enable CDN caching
- Optimize images
- Reduce bundle size

---

## 📈 Next Steps

### Phase 1 Complete ✅
- [x] Azure Static Web Apps setup
- [x] GitHub Actions CI/CD
- [x] Environment configuration
- [x] Monitoring setup

### Phase 2: PWA Enhancements
- [ ] Push notifications
- [ ] Better offline support
- [ ] App shortcuts optimization

### Phase 3: React Native Mobile App
- [ ] Expo project setup
- [ ] Core features migration
- [ ] Native push notifications
- [ ] App Store submission

---

## 🆘 Support

### Azure Issues:
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Support (Free tier included)](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

### Community:
- Check `TODO.md` for known issues
- Review `DEVELOPMENT.md` for dev guidelines

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Azure
- [ ] GitHub secrets added
- [ ] Cosmos DB optimized for free tier (400 RU/s)
- [ ] Monitoring alerts setup
- [ ] Custom domain configured (optional)
- [ ] SSL certificate auto-generated by Azure ✅
- [ ] PWA manifest tested
- [ ] Service worker registered
- [ ] Offline page accessible
- [ ] Test deployment on staging environment

---

**Your app will be 100% FREE on Azure for Students** as long as:
- Bandwidth < 100 GB/month
- Cosmos DB < 1000 RU/s
- Storage < 25 GB

**Estimated capacity: 5,000-10,000 active users** 🎉
