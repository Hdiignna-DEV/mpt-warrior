# Gmail SMTP Setup - Quick Guide

## ✅ Email: info.mptcommunity@gmail.com

### Step 1: Enable 2-Factor Authentication (2FA)

**Jika belum aktif 2FA:**

1. Buka https://myaccount.google.com/security
2. Login dengan **info.mptcommunity@gmail.com**
3. Scroll ke **"Signing in to Google"**
4. Klik **"2-Step Verification"**
5. Klik **"Get Started"**
6. Ikuti instruksi (verifikasi phone number)
7. **2FA aktif** ✅

---

### Step 2: Generate App Password

1. Buka https://myaccount.google.com/apppasswords
2. Login jika diminta
3. **Select app**: Pilih "Mail"
4. **Select device**: Pilih "Other (Custom name)"
5. Ketik nama: **MPT Warrior Vercel**
6. Klik **"Generate"**
7. **COPY** 16-digit password yang muncul
   - Format: `xxxx xxxx xxxx xxxx` (tanpa spasi untuk dipakai)
   - Contoh: `abcd efgh ijkl mnop` → gunakan `abcdefghijklmnop`

⚠️ **PENTING**: App password hanya muncul 1x, SIMPAN dengan aman!

---

### Step 3: Add to Vercel Environment Variables

1. Buka https://vercel.com/dashboard
2. Pilih project **mpt-warrior**
3. **Settings** → **Environment Variables**
4. **Add New** (2 variables):

#### Variable 1:
- **Name**: `GMAIL_USER`
- **Value**: `info.mptcommunity@gmail.com`
- **Environments**: ✅ Production, Preview, Development
- Click **Save**

#### Variable 2:
- **Name**: `GMAIL_APP_PASSWORD`
- **Value**: `abcdefghijklmnop` (16 karakter tanpa spasi)
- **Environments**: ✅ Production, Preview, Development
- Click **Save**

---

### Step 4: Deploy

Code sudah ready! Tinggal push:

```bash
git add .
git commit -m "feat: Switch from Resend to Gmail SMTP"
git push
```

Vercel auto-deploy (~2 minutes).

---

## Testing

Setelah deployment selesai:

1. **Login sebagai admin** di https://mpt-community.vercel.app/admin-hq
2. **Approve 1 user** di Pending Users
3. **Check alert**:
   - ✅ "Email notifikasi terkirim" = SUCCESS! 🎉
   - ⚠️ "Email gagal terkirim" = Check logs atau env variables
4. **Ask user to check email** (including spam folder)

---

## Gmail Limits (Free)

- ✅ **500 emails/day** (cukup untuk community)
- ✅ **Gratis selamanya**
- ✅ **Kirim ke siapa saja** (tidak ada domain verification)
- ✅ **Professional sender**: info.mptcommunity@gmail.com

---

## Troubleshooting

### "Invalid login" error?
- ❌ Jangan pakai password Gmail biasa
- ✅ Harus pakai **App Password** (16 karakter)
- Check apakah 2FA sudah aktif

### Email tidak terkirim?
- Check env variables di Vercel (typo?)
- Pastikan App Password tanpa spasi
- Check Vercel logs untuk error message

### Gmail blocked login?
- Google might block "less secure app"
- Solution: Use App Password (bukan password biasa)
- Check https://myaccount.google.com/notifications untuk security alerts

---

## Benefits

✅ **Otomatis**: Email langsung terkirim saat approve
✅ **Gratis**: Selamanya (Gmail free tier)
✅ **Unlimited recipients**: Kirim ke siapa saja
✅ **Professional**: From MPT Community email
✅ **Reliable**: Gmail infrastructure (99.9% uptime)

---

## Security Notes

- App Password berbeda dari password Gmail biasa
- Hanya untuk aplikasi, bukan untuk login Gmail
- Bisa di-revoke kapan saja di https://myaccount.google.com/apppasswords
- Vercel menyimpan environment variables dengan aman (encrypted)

---

## Ready to Go!

Setelah setup:
1. ✅ User register → pending
2. ✅ Admin approve → email otomatis terkirim 📧
3. ✅ User dapat notifikasi → login langsung
4. ✅ No manual WhatsApp needed (kecuali user mau tanya)

Workflow fully automated! 🚀
