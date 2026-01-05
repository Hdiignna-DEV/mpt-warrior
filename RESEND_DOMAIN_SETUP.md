# Resend Domain Verification Guide

## Prerequisites
- ✅ RESEND_API_KEY already added to Vercel
- ✅ You have a domain name (e.g., mptwarrior.com)
- ✅ Access to domain DNS settings (Cloudflare, Namecheap, GoDaddy, etc)

---

## Step 1: Add Domain to Resend

1. **Login to Resend**: https://resend.com/login
2. **Go to Domains**: https://resend.com/domains
3. **Click "Add Domain"**
4. **Enter your domain**: 
   - For sending from: `noreply@mptwarrior.com`
   - Enter: `mptwarrior.com` (without www or subdomain)
5. **Click "Add"**

---

## Step 2: Get DNS Records

Resend will show you 3 DNS records to add:

### Record 1: SPF (TXT)
```
Type: TXT
Name: @ (or your domain)
Value: v=spf1 include:_spf.resend.com ~all
```

### Record 2: DKIM (TXT)
```
Type: TXT
Name: resend._domainkey
Value: [Long string provided by Resend]
```

### Record 3: DMARC (TXT)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
```

---

## Step 3: Add DNS Records to Your Domain

### If using **Cloudflare**:
1. Login to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add each of the 3 records above
6. **Proxy status**: DNS only (grey cloud)
7. Click **Save**

### If using **Namecheap**:
1. Login to Namecheap
2. Domain List → **Manage**
3. **Advanced DNS** tab
4. Add **TXT Records** for each
5. Click **Save**

### If using **GoDaddy**:
1. Login to GoDaddy
2. My Products → Domains → **DNS**
3. Add **TXT Records**
4. Click **Save**

---

## Step 4: Verify Domain in Resend

1. **Wait 5-10 minutes** (DNS propagation)
2. Back to Resend Domains page
3. Click **Verify** button
4. If successful: ✅ Status becomes "Verified"
5. If failed: Wait longer (up to 24 hours) and retry

---

## Step 5: Update Code

Once domain is verified, update the sender email:

**File**: `src/lib/email/resend-client.ts`

```typescript
// BEFORE (testing email)
export const SENDER_EMAIL = 'MPT Warrior <onboarding@resend.dev>';

// AFTER (your verified domain)
export const SENDER_EMAIL = 'MPT Warrior <noreply@mptwarrior.com>';
```

Replace `mptwarrior.com` with your actual domain.

---

## Step 6: Commit and Deploy

```bash
git add .
git commit -m "feat: Update sender email to verified domain"
git push
```

Vercel will auto-deploy. After deployment (~2 minutes), emails will be sent from your domain! 🎉

---

## Verification Checklist

- [ ] Domain added to Resend
- [ ] 3 DNS records added (SPF, DKIM, DMARC)
- [ ] Domain status shows "Verified" in Resend
- [ ] SENDER_EMAIL updated in code
- [ ] Committed and deployed
- [ ] Test email by approving a user

---

## Troubleshooting

### Domain not verifying?
- **Check DNS propagation**: https://dnschecker.org
- **Wait longer**: Can take up to 24 hours
- **Check record values**: Must match exactly what Resend provides
- **Remove existing records**: Some providers have conflicting SPF/DKIM

### Still getting "testing emails" error?
- Domain must show **Verified** status in Resend
- Wait 5 minutes after verification
- Redeploy application after updating SENDER_EMAIL

### Emails going to spam?
- Make sure all 3 DNS records are added
- DMARC policy is important for deliverability
- Use `p=none` initially, then `p=quarantine` after testing

---

## Benefits After Verification

✅ **Send to anyone**: No more email address restrictions
✅ **Professional**: Emails from noreply@yourdomain.com
✅ **Better deliverability**: Less likely to go to spam
✅ **Trust**: Custom domain looks more legitimate
✅ **Free tier**: Still 3,000 emails/month

---

## Alternative: Use Subdomain

If you don't want to use main domain:

**Option**: Use subdomain like `mail.mptwarrior.com`

1. Add subdomain to Resend: `mail.mptwarrior.com`
2. DNS records will use the subdomain
3. Sender: `noreply@mail.mptwarrior.com`

Same process, just use subdomain instead of main domain.

---

## Need Help?

- **Resend Docs**: https://resend.com/docs/dashboard/domains/introduction
- **DNS Help**: Check your domain registrar's help center
- **Test DNS**: https://mxtoolbox.com/SuperTool.aspx

