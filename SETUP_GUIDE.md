# 🚀 MPT WARRIOR - QUICK SETUP GUIDE

## ⚡ Fast Track Setup (30 minutes)

### ✅ Prerequisites
- Node.js 18+
- Azure for Student account
- npm or yarn

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Azure Cosmos DB Setup (10 min)**

1. **Login ke Azure Portal**
   ```
   https://portal.azure.com
   ```

2. **Create Cosmos DB Account**
   - Click "Create a resource"
   - Search "Azure Cosmos DB"
   - Click "Create" > "Azure Cosmos DB for NoSQL"
   
3. **Configure Settings**
   ```
   Resource Group: mpt-warrior-rg (create new)
   Account Name: mpt-warrior-db
   Location: Southeast Asia
   Capacity Mode: Provisioned throughput
   ✅ Apply Free Tier Discount: YES
   ```

4. **Create Account** (wait 3-5 minutes)

5. **Get Connection Details**
   - Go to your Cosmos DB account
   - Click "Keys" in left sidebar
   - Copy these values:
     - **URI** → This is your `AZURE_COSMOS_ENDPOINT`
     - **PRIMARY KEY** → This is your `AZURE_COSMOS_KEY`

---

### **STEP 2: Environment Setup (5 min)**

1. **Create `.env.local` file**
   ```bash
   cp .env.template .env.local
   ```

2. **Edit `.env.local`** (paste your values)
   ```env
   # Azure Cosmos DB
   AZURE_COSMOS_ENDPOINT=https://mpt-warrior-db.documents.azure.com:443/
   AZURE_COSMOS_KEY=your-primary-key-from-step-1
   AZURE_COSMOS_DATABASE=mpt-warrior

   # JWT Secret (generate new one)
   JWT_SECRET=your-random-32-character-secret-here

   # Admin Email (your email)
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com

   # Google Gemini (existing)
   GEMINI_API_KEY=your-existing-gemini-key

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Generate JWT Secret**
   ```bash
   # On Windows PowerShell:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

   # On Linux/Mac:
   openssl rand -base64 32
   ```

---

### **STEP 3: Initialize Database (5 min)**

1. **Install dependencies** (if not done)
   ```bash
   npm install
   ```

2. **Initialize Cosmos DB containers**
   ```bash
   npm run db:init
   ```

   Expected output:
   ```
   🚀 Initializing Cosmos DB containers...
   ✅ All containers created successfully!
   
   📋 Created containers:
     - users (partition key: /id)
     - trades (partition key: /userId)
     - invitation-codes (partition key: /code)
     - audit-logs (partition key: /performed_by)
   ```

3. **Generate invitation codes**
   ```bash
   npm run db:generate-codes
   ```

   Expected output:
   ```
   🔑 Generating invitation codes...
   
   ✅ Created: MPT-A7X2-2026 (10 uses, expires 04/04/2026)
   ✅ Created: MPT-B3Y9-2026 (10 uses, expires 04/04/2026)
   ✅ Created: MPT-C5Z1-2026 (10 uses, expires 04/04/2026)
   ✅ Created: MPT-D8W4-2026 (10 uses, expires 04/04/2026)
   ✅ Created: MPT-E2Q7-2026 (10 uses, expires 04/04/2026)
   
   🎉 Successfully created 5 invitation codes!
   ```

---

### **STEP 4: Test The System (10 min)**

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Register as Admin** (first user)
   - Open http://localhost:3000/register
   - Fill form:
     ```
     Name: Your Name
     Email: same-as-NEXT_PUBLIC_ADMIN_EMAIL
     Password: strongpassword123
     WhatsApp: 081234567890
     Telegram: @yourusername
     Invitation Code: MPT-XXXX-2026 (from step 3)
     ```
   - Click "SUBMIT REGISTRATION"

3. **Manually approve yourself** (one-time)
   - Go to Azure Portal > Cosmos DB > Data Explorer
   - Navigate to: `mpt-warrior` > `users` > your user document
   - Click "Edit"
   - Change:
     ```json
     "status": "active",
     "role": "ADMIN",
     "approved_date": "2026-01-04T00:00:00.000Z",
     "approved_by": "system"
     ```
   - Click "Update"

4. **Login as Admin**
   - Go to http://localhost:3000/login
   - Use your email and password
   - You'll be redirected to `/admin-hq`

5. **Test Registration Flow**
   - Open incognito window
   - Register new user with another email
   - User will be redirected to `/pending-approval`
   - In admin window, approve the user
   - Login as that user → should access `/dashboard`

---

## ✅ Verification Checklist

- [ ] Cosmos DB created with Free Tier discount
- [ ] `.env.local` configured with correct values
- [ ] Database containers initialized
- [ ] Invitation codes generated
- [ ] Admin user registered and approved
- [ ] Can access Admin HQ (`/admin-hq`)
- [ ] Can approve/reject pending users
- [ ] Middleware protection working (try accessing `/dashboard` without login)

---

## 🎯 What's Next?

### **Share Invitation Codes**
- Copy codes from step 3
- Share in WhatsApp/Telegram groups:
  ```
  🎯 MPT WARRIOR INVITATION
  
  Join MPT Community dengan invitation code:
  MPT-XXXX-2026
  
  Register: https://mpt-warrior.vercel.app/register
  
  Limited slots: 10 users per code
  Expires: 3 months
  ```

### **Customize Invitation Codes**
- Edit `scripts/generate-codes.ts`
- Change `codesCount` and `maxUsesPerCode`
- Run `npm run db:generate-codes` again

### **Monitor Users**
- Admin HQ: http://localhost:3000/admin-hq
- View pending users
- Approve/reject/suspend
- Check invitation code usage

---

## 🚨 Troubleshooting

### Error: "Cannot connect to Cosmos DB"
- ✅ Check `.env.local` has correct `AZURE_COSMOS_ENDPOINT` and `AZURE_COSMOS_KEY`
- ✅ Verify Cosmos DB is running in Azure Portal
- ✅ Check firewall rules (allow all IPs for development)

### Error: "Invitation code invalid"
- ✅ Run `npm run db:generate-codes` first
- ✅ Check code in Cosmos DB Data Explorer
- ✅ Verify code hasn't reached max usage limit

### Cannot access Admin HQ
- ✅ Verify email in `.env.local` matches user email
- ✅ Check user role is "ADMIN" in Cosmos DB
- ✅ Clear browser cache and cookies

### Middleware redirecting incorrectly
- ✅ Check JWT token in browser cookies
- ✅ Verify middleware.ts has correct route protection
- ✅ Clear localStorage and re-login

---

## 💰 Cost Monitoring

### Azure Cosmos DB Free Tier
```
✅ 1000 RU/s: FREE forever
✅ 25 GB storage: FREE forever
✅ Estimated for 50 users:
   - Storage: ~500 MB
   - RU/s usage: ~50-100 RU/s average
   
Result: $0/month 🎉
```

### Set Budget Alert
1. Azure Portal > Cost Management > Budgets
2. Create budget: $10/month
3. Alert threshold: 80% ($8)
4. Email notification: your-email@example.com

---

## 📚 Additional Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MEMBERSHIP_IMPLEMENTATION.md](./MEMBERSHIP_IMPLEMENTATION.md) - Full technical docs

---

## 🎉 Success!

Your MPT Warrior membership system is now live!

**Next steps:**
1. ✅ Test all flows (register, login, approve, access)
2. ✅ Share invitation codes with your community
3. ✅ Monitor Admin HQ for pending users
4. ✅ Deploy to Vercel when ready

**Questions?**
- Review [MEMBERSHIP_IMPLEMENTATION.md](./MEMBERSHIP_IMPLEMENTATION.md)
- Check Azure Cosmos DB logs
- Review browser console for client errors

---

**Ready to build your warrior community! 🎯**
