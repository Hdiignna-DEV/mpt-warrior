# Vercel Deployment Guide

## Overview
Aplikasi MPT Warrior Hub telah dikonfigurasi dan dioptimalkan untuk deployment di Vercel dengan dukungan penuh untuk tema gelap/terang.

## Prerequisites
- Akun Vercel (https://vercel.com)
- GitHub repository untuk aplikasi ini
- Environment variables yang diperlukan

## Environment Variables

Berikut environment variables yang diperlukan untuk production di Vercel:

### Required for API & Services
```env
# Azure Cosmos DB (Required - dari Azure Portal > Cosmos DB > Keys)
AZURE_COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-primary-key
AZURE_COSMOS_DATABASE=MPT

# JWT Authentication (Required - generate random string)
JWT_SECRET=your-secret-key-change-in-production

# Google Generative AI (Optional - untuk AI Mentor)
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key

# Email Service (Optional - untuk email notifications)
# Configure salah satu dari: Resend, Gmail SMTP, atau SendGrid
```

### Theme Configuration (Auto-handled)
```env
# Tidak perlu dikonfigurasi - next-themes menangani ini secara otomatis
# Theme preference disimpan di localStorage client-side
```

## Deployment Steps

### 1. Push ke GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment with fixed dark/light theme"
git push origin main
```

### 2. Connect ke Vercel
1. Buka https://vercel.com/new
2. Pilih "Import Git Repository"
3. Pilih repository Anda
4. Konfigurasi project settings:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Set Environment Variables
Di Vercel Dashboard:
1. Buka Project → Settings → Environment Variables
2. Tambahkan environment variables berikut:

**CRITICAL - Must Set:**
```
AZURE_COSMOS_ENDPOINT = https://your-account.documents.azure.com:443/
AZURE_COSMOS_KEY = your-primary-or-secondary-key
AZURE_COSMOS_DATABASE = MPT
JWT_SECRET = random-secret-string-min-32-chars
```

**Optional:**
```
NEXT_PUBLIC_GOOGLE_API_KEY = your-google-ai-api-key
```

3. Pastikan variables tersedia untuk **Production** environment
4. Klik "Save" untuk setiap variable

### 4. Deploy
```bash
vercel deploy --prod
```

Atau gunakan auto-deploy dari GitHub (recommended)

## Dark/Light Theme Implementation

### How It Works
1. **ThemeScript.tsx**: Menjalankan script sebelum render untuk mendeteksi preferensi tema
2. **ThemeProvider.tsx**: Wrapper untuk next-themes dengan konfigurasi optimal
3. **ThemeToggle.tsx**: Tombol untuk switch antara light/dark mode
4. **globals.css**: CSS variables dan Tailwind dark mode setup

### Key Features
✅ Deteksi otomatis preferensi sistem (`prefers-color-scheme`)
✅ Persist theme preference di localStorage
✅ Tidak ada flash of unstyled content (FOUC)
✅ Smooth transitions antara tema
✅ Kompatibel dengan Tailwind CSS v4
✅ Bekerja sempurna di Vercel

### Testing Theme Locally
```bash
npm run dev
```
Buka http://localhost:3000 dan test theme toggle di header.

## Production Verification

Setelah deploy ke Vercel:

1. **Test Theme Toggle**
   - Klik tombol Sun/Moon di header
   - Verifikasi tema berubah instantly
   - Refresh halaman - tema harus tetap sama (disimpan di localStorage)

2. **Test System Preference**
   - Buka DevTools → Settings → Rendering
   - Toggle "Emulate CSS media feature prefers-color-scheme"
   - Verifikasi tema berubah sesuai preferensi sistem

3. **Check Browser Consistency**
   - Test di Chrome, Firefox, Safari
   - Pastikan tema konsisten di semua browser

## Performance Optimization

### Cache Strategy
Vercel secara otomatis mengoptimalkan:
- Static assets caching
- API routes caching
- Image optimization

### SEO & Meta Tags
- colorScheme meta tag untuk browser support
- Proper viewport configuration untuk mobile
- PWA manifest configuration

## Troubleshooting

### Theme Not Persisting
**Solusi**: 
- Clear browser localStorage: `localStorage.clear()`
- Clear browser cache
- Hard refresh: Ctrl+Shift+R

### Flash of Wrong Theme
**Solusi**: 
- Pastikan ThemeScript diload sebelum body render
- Check browser console untuk errors
- Verify next-themes package version

### Environment Variables Not Loading
**Solusi**:
- Verifikasi nama environment variable di Vercel Dashboard
- Pastikan NEXT_PUBLIC_ prefix untuk public variables
- Redeploy setelah ubah environment variables

## Monitoring

### Recommended Monitoring Tools
1. **Vercel Analytics**: Enable di Vercel Dashboard
2. **Sentry**: Untuk error tracking (optional)
3. **LogRocket**: Untuk session recording (optional)

## Rollback Strategy

Jika ada masalah setelah deploy:

1. **Revert Deployment**:
   - Vercel Dashboard → Deployments → Select Previous Build → Promote to Production

2. **Inspect Logs**:
   - Vercel Dashboard → Function Logs
   - Check untuk build errors atau runtime errors

## Migration from Local to Production

### Important Notes
1. Environment variables HARUS dikonfigurasi di Vercel sebelum deploy
2. Theme functionality tidak memerlukan backend - fully client-side
3. Database credentials HARUS tidak pernah di-commit ke repository

### Verification Checklist
- [ ] Environment variables configured di Vercel
- [ ] GitHub repository connected
- [ ] Build completes successfully
- [ ] Theme toggle works on production
- [ ] API endpoints responsive
- [ ] No CORS errors
- [ ] Performance acceptable

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Next-Themes: https://github.com/pacocur/next-themes
- Tailwind CSS Dark Mode: https://tailwindcss.com/docs/dark-mode

## Latest Changes (Theme Fix)

### Fixed Issues
✅ Dark mode class tidak diapply ke html element
✅ Hydration mismatch antara server dan client
✅ Flash of unstyled content (FOUC)
✅ Theme toggle tidak responsive
✅ Incompatibility dengan Tailwind CSS v4

### Implementation Details
- ThemeScript sekarang menggunakan IIFE untuk isolation
- `resolvedTheme` digunakan instead of `theme` untuk akurasi
- CSS variables didefinisikan untuk kedua light dan dark modes
- Smooth transitions ditambahkan ke semua theme-aware elements

---

**Last Updated**: January 1, 2026  
**Status**: ✅ Ready for Production
