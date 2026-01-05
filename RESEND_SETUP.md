# Resend Email Setup Guide

## Quick Setup (5 minutes)

### 1. Get Resend API Key

1. Go to https://resend.com
2. Sign up with your email (FREE - 3,000 emails/month, 100 emails/day)
3. Verify your email
4. Go to **API Keys** in dashboard
5. Click **Create API Key**
6. Give it a name: `MPT Warrior Production`
7. Copy the key (starts with `re_...`)

### 2. Add to Vercel Environment Variables

1. Open Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **mpt-warrior** (or **mpt-community**)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key
   - **Environments**: Check all (Production, Preview, Development)
6. Click **Save**

### 3. Redeploy (Optional but Recommended)

Vercel will use the new environment variable in next deployment automatically.

For immediate activation:
1. Go to **Deployments** tab
2. Click **... menu** on latest deployment
3. Click **Redeploy**

### 4. Verify Email Works

1. Login as SUPER_ADMIN
2. Go to Admin HQ → Pending Users
3. Approve a user
4. User should receive email notification

---

## Email Features Enabled

### ✅ Approval Email
- Sent when admin approves a user
- Includes welcome message
- Platform features overview
- Call-to-action button
- **Sender**: MPT Warrior <onboarding@resend.dev>

### 📧 Email Template

Beautiful HTML email with:
- Gradient header (Red to Amber)
- Feature highlights
- Direct login link
- Professional design

---

## Troubleshooting

### Email not sending?

**Check Vercel Logs:**
1. Vercel Dashboard → Project → Deployments
2. Click latest deployment
3. Go to **Runtime Logs**
4. Search for: `Approval email`

**Common Issues:**
- ❌ `RESEND_API_KEY not found` → Add env variable and redeploy
- ❌ `Invalid API key` → Double-check copied key
- ❌ `Rate limit exceeded` → Using free tier (100/day limit)

### Email goes to spam?

**For Production:**
1. Add custom domain in Resend
2. Configure DNS records (SPF, DKIM, DMARC)
3. Change sender from `onboarding@resend.dev` to `noreply@yourdomain.com`

**Quick fix for testing:**
- Ask users to check spam folder
- Add `onboarding@resend.dev` to safe senders

---

## API Key Security

✅ **DO:**
- Store in Vercel environment variables
- Never commit to Git
- Rotate keys periodically
- Use different keys for dev/prod

❌ **DON'T:**
- Share API key publicly
- Hardcode in source code
- Expose in client-side code

---

## Cost & Limits

### Free Tier
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ All features
- ✅ No credit card required

### Paid Plans (if needed later)
- Pro: $20/month → 50,000 emails
- Business: Custom pricing

For MPT Warrior community (50-100 users), **free tier is sufficient**.

---

## Future Email Features (Optional)

Could be added:
- 📧 Password reset emails
- 🔔 Suspension notifications
- 📊 Weekly activity reports
- 🎉 Achievement notifications
- ⚠️ System alerts to admins

All email sending is **non-blocking** - approval succeeds even if email fails.

---

## Current Status

📝 **Code**: ✅ Complete (already implemented)
🔑 **API Key**: ⚠️ Needs to be added to Vercel
📬 **Testing**: ⏳ Pending API key setup

**Estimated time to activate**: 5 minutes
