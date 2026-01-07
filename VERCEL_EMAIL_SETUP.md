# Vercel Email Setup Guide

## Setup GMAIL_APP_PASSWORD di Vercel

### 1. Generate Gmail App Password (Jika Belum)
1. Buka https://myaccount.google.com/security
2. Enable **2-Step Verification** jika belum aktif
3. Kembali ke Security → pilih **App passwords**
4. Pilih app: **Mail**, device: **Other (Custom name)**
5. Ketik: "MPT Community Vercel"
6. Klik **Generate**
7. **COPY** 16-digit password yang muncul (format: xxxx xxxx xxxx xxxx)

### 2. Add Environment Variable di Vercel
1. Buka https://vercel.com/your-team/mpt-warrior/settings/environment-variables
2. Klik **Add New**
3. Isi:
   - **Key**: `GMAIL_APP_PASSWORD`
   - **Value**: Paste 16-digit password (tanpa spasi)
   - **Environment**: Pilih semua (Production, Preview, Development)
4. Klik **Save**

### 3. Redeploy Application
**Option A - Via Vercel Dashboard:**
1. Go to Deployments tab
2. Klik menu (⋮) pada deployment terakhir
3. Pilih **Redeploy**

**Option B - Via Git Push:**
```bash
git commit --allow-empty -m "chore: trigger redeploy for env vars"
git push
```

### 4. Test Email Delivery
1. Login sebagai SUPER_ADMIN
2. Buka `/admin-hq/quiz-grading`
3. Grade satu essay dengan score dan feedback
4. Check email user apakah menerima notifikasi

### 5. Verify Email di Logs
1. Buka Vercel Dashboard → Deployments → Latest
2. Klik **Functions** tab
3. Check logs untuk konfirmasi email sent/failed

---

## Email Templates yang Aktif

### ✅ Essay Graded Email
- **Trigger**: Admin grade essay question
- **Recipient**: User yang essay-nya dinilai
- **Content**: Score card, feedback, pass/fail status, encouragement message

### ✅ Module Completion Email
- **Trigger**: User complete semua lessons + pass quiz >= 70%
- **Recipient**: User yang complete module
- **Content**: Trophy celebration, progress bar, next module info

### ✅ Welcome Email (Existing)
- **Trigger**: Super Admin approve new user
- **Recipient**: Newly approved user
- **Content**: Welcome message, getting started guide

---

## Troubleshooting

### Email Tidak Terkirim
1. **Check Environment Variable**: Pastikan `GMAIL_APP_PASSWORD` dan `GMAIL_USER` sudah ada di Vercel
2. **Check Logs**: Lihat error message di Vercel Function logs
3. **Invalid Credentials**: Re-generate App Password dan update di Vercel
4. **Redeploy**: Setiap perubahan env var butuh redeploy

### Email Masuk Spam
1. Check spam folder user
2. User mark as "Not Spam"
3. Add `info.mptcommunity@gmail.com` ke contacts

### Email Delay
- Email dikirim asynchronous (non-blocking)
- Biasanya sampai dalam 1-2 menit
- Grading tetap sukses walaupun email gagal

---

## Current Configuration

```env
GMAIL_USER=info.mptcommunity@gmail.com
GMAIL_APP_PASSWORD=[Your 16-digit app password]
```

**Sender Name**: MPT Community  
**Email Templates**: HTML with inline CSS (mobile responsive)  
**Delivery Method**: Gmail SMTP via Nodemailer

---

## Next Steps After Setup

1. ✅ Test email dengan grade 1 essay
2. ✅ Verify user menerima email
3. ✅ Check template rendering di email client
4. 📋 Monitor email delivery di Vercel logs
5. 📋 Collect user feedback tentang email content
