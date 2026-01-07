# MPT Warrior - Trading Journal Application

## 📱 Apa itu MPT Warrior?

MPT Warrior adalah aplikasi Progressive Web App (PWA) untuk trader yang ingin mencatat, menganalisis, dan meningkatkan performa trading mereka. Aplikasi ini dapat diinstall di smartphone seperti aplikasi native, namun tetap berbasis web untuk kemudahan update dan akses lintas platform.

## ✨ Fitur Utama

### 1. **Trade Journal** 
- Catat setiap trade dengan detail lengkap (pair, entry, exit, profit/loss, screenshot)
- Auto-kalkulasi win rate, total profit/loss, average risk
- Filter dan sort berdasarkan tanggal, pair, atau status
- Export data untuk analisis lebih lanjut

### 2. **Dashboard Real-time**
- Statistik trading terupdate otomatis dari database
- Grafik performa harian, mingguan, bulanan
- Tracking progress menuju target profit
- Insight AI untuk improvement

### 3. **Profile & Analytics**
- Win rate otomatis dari data trades
- Best trade & worst trade tracking
- Total profit/loss akumulatif
- Risk management metrics

### 4. **Economic Calendar**
- Kalender ekonomi global terintegrasi
- Filter berdasarkan impact (high, medium, low)
- Zona waktu otomatis sesuai lokasi
- Reminder untuk event penting

### 5. **Trading Calculator**
- Position size calculator
- Risk/reward ratio calculator
- Pip value calculator
- Lot size optimizer

### 6. **Academy**
- Materi pembelajaran trading
- Video tutorial dan artikel
- Quiz dan progress tracking
- Sertifikat untuk member aktif

### 7. **AI Mentor**
- Analisis performa trading dengan AI
- Rekomendasi improvement personal
- Chat untuk konsultasi strategy
- Pattern recognition dari trade history

## 🏗️ Teknologi & Arsitektur

### Frontend
- **Next.js 16.1.1** - React framework dengan Turbopack
- **TypeScript** - Type safety dan better developer experience
- **Tailwind CSS** - Modern styling dengan utility-first approach
- **PWA** - Installable, offline-capable, app-like experience

### Backend & Database
- **Azure Cosmos DB** - NoSQL database global dengan low-latency
- **API Routes** - Serverless functions di Next.js
- **JWT Authentication** - Secure token-based authentication

### Deployment
- **Vercel** - Auto-deployment dari GitHub
- **Azure Static Web Apps** - Alternative hosting dengan Azure integration

## 🔐 Sistem Keamanan

### Multi-layer Security
1. **JWT Token Authentication** - Setiap request terverifikasi dengan token
2. **Invitation Code System** - Registrasi hanya dengan kode undangan valid
3. **User Role Management** - Admin, Premium, Free tier dengan akses berbeda
4. **Rate Limiting** - Proteksi dari spam dan abuse
5. **Audit Logs** - Tracking semua aktivitas penting

### Privacy
- Data user terenkripsi di Cosmos DB
- Password di-hash sebelum disimpan
- Session timeout otomatis untuk keamanan
- HTTPS untuk semua komunikasi

## 💾 Cara Kerja Data (Penting!)

### Data Storage - Azure Cosmos DB
**Semua data PERMANEN tersimpan di cloud database:**
- ✅ Trades yang kamu input → Langsung ke Cosmos DB
- ✅ Profile updates → Tersimpan di Cosmos DB
- ✅ Settings & preferences → Di-sync ke Cosmos DB
- ✅ Achievement progress → Real-time ke database

**Artinya:**
- Data tetap ada walaupun hapus aplikasi
- Login dari device lain, data tetap sama
- Tidak akan hilang walaupun offline lama
- Auto-sync ketika online lagi

### PWA Cache - Temporary Storage
**Cache hanya untuk offline mode:**
- 📦 Assets statis (logo, CSS, JS) → Cached di browser
- 📦 Halaman terakhir dibuka → Cached untuk offline access
- 📦 Read-only data → Temporary untuk speed

**Cache ini:**
- ❌ BUKAN primary storage
- ❌ Bisa dihapus browser kapan saja
- ✅ Hanya untuk faster loading & offline mode

### Flow Input Trade
```
User Input Trade → API Route → Validate Token → 
Save to Cosmos DB → Return Success → Update UI
```

**Ketika Offline:**
```
User Input Trade → Save to IndexedDB (temporary) →
Ketika Online → Background Sync → Upload to Cosmos DB
```

## 📊 Database Containers

### 1. **users**
- User profiles dan settings
- Membership tier (Free, Premium, Admin)
- WhatsApp & Telegram integration
- 7 users aktif saat ini

### 2. **trades**
- Semua data trading journal
- Link ke user_id
- Profit/loss, screenshots, notes
- Auto-calculated statistics

### 3. **invitation-codes**
- Kode undangan untuk registrasi baru
- Track siapa yang mengundang siapa
- Limit usage per kode

### 4. **audit-logs**
- Tracking semua aktivitas penting
- Login attempts, data changes
- Security monitoring

## 🌐 PWA Features (Mobile App Experience)

### Installable
- **Android**: Prompt "Add to Home Screen" otomatis muncul
- **iOS**: Manual via Safari → Share → Add to Home Screen
- **Desktop**: Install via Chrome/Edge address bar

### Offline Mode
- Buka aplikasi tanpa internet
- Lihat data terakhir yang di-cache
- Input trade offline → Auto-sync ketika online
- Kalender dan calculator tetap berfungsi

### App-like Experience
- Fullscreen tanpa browser UI
- Splash screen dengan logo MPT
- Native navigation gestures
- Fast loading dengan pre-caching

### Push Notifications (Coming Soon)
- Reminder untuk input daily trade
- Alert untuk economic calendar events
- Achievement unlocked notifications

## 👥 User Roles & Permissions

### Free Tier
- ✅ Basic trade journal (limit 50 trades/month)
- ✅ Profile & statistics
- ✅ Economic calendar
- ✅ Calculator
- ❌ AI Mentor
- ❌ Advanced analytics
- ❌ Export unlimited

### Premium Member
- ✅ Unlimited trades
- ✅ AI Mentor & chat
- ✅ Advanced analytics & reports
- ✅ Export to Excel/PDF
- ✅ Custom indicators
- ✅ Priority support

### Admin
- ✅ All Premium features
- ✅ User management
- ✅ Generate invitation codes
- ✅ View audit logs
- ✅ System configuration

## 🚀 Roadmap & Future Features

### Q1 2026
- [x] PWA Implementation
- [x] Profile stats sync fix
- [ ] Push notifications
- [ ] Dark mode improvements
- [ ] Multi-language (EN, ID)

### Q2 2026
- [ ] Mobile app (React Native)
- [ ] Trading signals integration
- [ ] Social features (follow traders)
- [ ] Leaderboard & challenges

### Q3 2026
- [ ] Broker integration (MT4/MT5)
- [ ] Auto trade import
- [ ] AI trade suggestions
- [ ] Advanced charting

## 🛠️ Development Setup

### Prerequisites
```bash
Node.js 18+
Azure Account (Cosmos DB)
Git
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/Hdiignna-DEV/mpt-warrior.git
cd mpt-warrior

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan Cosmos DB credentials

# Run development server
npm run dev
```

### Environment Variables Required
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
COSMOS_ENDPOINT=https://your-cosmos.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
JWT_SECRET=your-jwt-secret
```

## 📞 Support & Contact

### Untuk User
- **WhatsApp**: Link via profile settings
- **Email**: info.mptcommunity@gmail.com
- **Telegram**: @MPTWarrior

### Untuk Developer
- **GitHub Issues**: Report bugs atau request features
- **Documentation**: Lihat file `DEVELOPMENT.md`
- **API Docs**: `API_BEST_PRACTICES.md`

## 📄 License

Private project - MPT Community © 2026

---

**Last Updated**: January 7, 2026  
**Version**: 1.0.0 (PWA)  
**Status**: Production Ready ✅
