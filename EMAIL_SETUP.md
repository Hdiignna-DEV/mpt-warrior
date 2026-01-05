# Email Notification Setup Guide

## Overview
Approval email notifications menggunakan **Resend** (https://resend.com) - service email modern dengan free tier 3,000 emails/month.

## Setup Steps

### 1. Get Resend API Key
1. Daftar di https://resend.com (gratis)
2. Verify email Anda
3. Pergi ke **API Keys** di dashboard
4. Click **Create API Key**
5. Copy API key yang diberikan

### 2. Add to Vercel Environment Variables
1. Buka Vercel project: https://vercel.com/deden/mpt-warrior
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan variable baru:
   - **Name**: `RESEND_API_KEY`
   - **Value**: [paste API key dari step 1]
   - **Environment**: Production, Preview, Development (check all)
4. Click **Save**
5. Redeploy project

### 3. Verify Domain (Optional - Production Ready)
Saat ini email dikirim dari `onboarding@resend.dev` (default Resend).

Untuk production yang lebih professional:
1. Di Resend dashboard, pergi ke **Domains**
2. Click **Add Domain**
3. Masukkan domain Anda (contoh: `mpt-community.com`)
4. Follow DNS verification steps
5. Setelah verified, update `SENDER_EMAIL` di `src/lib/email/resend-client.ts`:
   ```typescript
   export const SENDER_EMAIL = 'MPT Warrior <noreply@mpt-community.com>';
   ```

## Testing

### Test Locally
```bash
# Set API key di .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Run development server
npm run dev

# Approve a pending user dari Admin HQ
# Check console logs untuk email status
```

### Test Production
1. Deploy dengan RESEND_API_KEY sudah set
2. Approve user dari Admin HQ
3. Check email inbox user yang di-approve
4. Check Vercel logs untuk email status

## Email Template
Email yang dikirim berisi:
- ✅ Welcome message dengan gradient header
- ✅ Feature highlights (Dashboard, Journal, AI Mentor, Analytics)
- ✅ Login CTA button
- ✅ Tips untuk memulai trading
- ✅ MPT Warrior branding

## Troubleshooting

### Email tidak terkirim
1. Check Vercel logs untuk error message
2. Verify `RESEND_API_KEY` sudah benar
3. Check Resend dashboard untuk email logs
4. Pastikan user punya email dan name yang valid

### Email masuk spam
1. Verify domain untuk better deliverability
2. Setup SPF and DKIM records
3. Ask users to whitelist sender email

### Rate limits
- Free tier: 3,000 emails/month
- Jika exceeded, upgrade ke paid plan atau tunggu bulan berikutnya

## Code Location
- Email client: `src/lib/email/resend-client.ts`
- Integration: `src/app/api/admin/approve-user/route.ts`
- Email template: Inside `sendApprovalEmail()` function

## Notes
- Email sending is **non-blocking** - jika gagal, approval tetap berhasil
- Log success/failure di console untuk debugging
- Resend free tier sangat cukup untuk MPT Warrior scale
