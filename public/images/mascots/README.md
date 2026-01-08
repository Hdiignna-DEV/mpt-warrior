# COMMANDER ARKA - 5 Pose Mascot Guide
## THE PLAN WARRIOR BLUEPRINT v1.0 - Level 4 Commander

### 📋 Overview
Commander Arka adalah mascot resmi MPT Warrior platform dengan 5 pose/state berbeda sesuai konteks pengguna. Setiap pose memiliki ekspresi dan aura unik yang mencerminkan situasi trading.

---

## 🎭 5 Pose yang Diperlukan

### 1️⃣ ONBOARDING / WELCOME (🫡)
**Pose Hormat - Military Salute**
- **Ekspresi:** Ramah, helm terbuka, memberikan salam hormat
- **Warna Aura:** Amber/Gold (#FBBF24)
- **Kegunaan:** 
  - Ditampilkan saat pertama kali aplikasi dibuka
  - Di halaman Login
  - Welcome screen untuk user baru
- **File:** `commander-arka-onboarding.png`

---

### 2️⃣ WARRIOR VISION / STANDAR (📸)
**Pose Siaga - Alert Position**
- **Ekspresi:** Serius, siap bertindak, memegang tablet holografik
- **Deskripsi:** Memegang perangkat futuristik untuk analisis chart
- **Warna Aura:** Blue (#3B82F6)
- **Kegunaan:**
  - Ikon utama di halaman AI Mentor
  - Muncul saat user mengunggah foto chart untuk Gemini scan
  - Status "sedang menganalisis"
- **File:** `commander-arka-vision.png`

---

### 3️⃣ SIGNAL / PROFIT NOTIFICATION (🎖️)
**Pose Selebrasi - Victory**
- **Ekspresi:** Gembira, triumfal, merayakan keberhasilan
- **Visual:** Dengan aura keemasan/biru terang, mungkin ada efek sparkle
- **Warna Aura:** Green (#10B981) + Golden glow
- **Kegunaan:**
  - Muncul saat trading plan menyentuh Take Profit (TP)
  - Saat profit harian tercapai
  - Notification/popup saat achievement unlock
- **File:** `commander-arka-victory.png`

---

### 4️⃣ RISK WARNING / AUDIT (⚠️)
**Pose Serius - Risk Alert**
- **Ekspresi:** Wajah serius, tangan menyilang membentuk X (pose protective)
- **Visual:** Visor helm berwarna amber/merah (warning indicator)
- **Warna Aura:** Red/Amber (#EF4444 atau #F97316)
- **Animasi:** Bounce/pulsing untuk urgency
- **Kegunaan:**
  - Muncul saat user melakukan "Overtrade"
  - Saat melanggar Trading Plan (masuk tanpa plan, dll)
  - Risk management warning system
  - Excessive leverage alert
- **File:** `commander-arka-warning.png`

---

### 5️⃣ EMPTY STATE / MAINTENANCE (🤔)
**Pose Berpikir - Thinking/Repair**
- **Ekspresi:** Lucu, berpikir (garuk kepala) atau sedang memperbaiki mesin
- **Visual:** Bisa dengan tools di tangan untuk "maintenance" feel
- **Warna Aura:** Slate Gray (#6B7280)
- **Kegunaan:**
  - Saat ada error (contoh: Gemini API error)
  - Jurnal trading masih kosong (first time)
  - Server maintenance/loading state
  - API rate limit exceeded
- **File:** `commander-arka-empty.png`

---

## 📐 Spesifikasi Teknis

| Aspek | Spesifikasi |
|-------|------------|
| **Format** | PNG dengan transparency |
| **Size Avatar** | 64×64px (chat bubble) |
| **Size Small** | 80×80px (inline) |
| **Size Medium** | 160×160px (welcome/notification) |
| **Size Large** | 300×300px (modal/full screen) |
| **Max File** | < 50KB per file |
| **Total** | 5 PNG files = ~250KB max |
| **Color Space** | SRGB |
| **DPI** | 72 DPI (screen) |

---

## 🎨 Design Guidelines

### Style & Theme
- **Overall Style:** Futuristik + Tactical + Minimalis
- **Theme:** War Room aesthetic (dari PROJECT_OVERVIEW)
- **Helmet:** Military commander dengan visor
- **Gear:** Tactical armor/body suit
- **Color Palette:**
  - Primary: Amber/Gold, Blue, Purple
  - Secondary: Green (victory), Red (warning)
  - Neutral: Slate gray (empty state)

### Konsistensi Antar Pose
- ✅ Karakter yang sama (Commander Arka)
- ✅ Style konsisten (futuristik + tactical)
- ✅ Ukuran relative sama
- ✅ Helmet style sama (hanya ekspresi/pose berubah)
- ✅ Proportions balanced

### Animation Considerations
- Onboarding: Bisa smooth slide-in
- Vision: Bisa subtle glow pulse
- Victory: Bisa celebrate animation
- Warning: Bounce/shake untuk urgency
- Empty: Bisa loading animation

---

## 💻 Code Integration

### File Paths
```
public/
└── images/
    └── mascots/
        ├── commander-arka-onboarding.png
        ├── commander-arka-vision.png
        ├── commander-arka-victory.png
        ├── commander-arka-warning.png
        └── commander-arka-empty.png
```

### Component Usage (sudah siap)

```tsx
import { 
  CommanderArkaAvatar, 
  CommanderArkaFullDisplay,
  type CommanderArkaPose 
} from '@/components/ChatUIEnhancers';

// Small avatar di chat bubble
<CommanderArkaAvatar 
  pose="vision"  // 'onboarding'|'vision'|'victory'|'warning'|'empty'
  isThinking={true}
  model="Warrior Buddy"
/>

// Full mascot display (welcome screen)
<CommanderArkaFullDisplay
  pose="onboarding"
  size="large"
  showLabel={true}
/>

// Notification
<CommanderArkaFullDisplay
  pose="victory"
  size="medium"
/>

// Warning
<CommanderArkaFullDisplay
  pose="warning"
  size="small"
/>
```

---

## 🚀 Implementation Checklist

**Phase 1: Image Creation**
- [ ] Design 5 poses dengan konsisten
- [ ] Export PNG dengan transparency
- [ ] Optimize file size (<50KB each)
- [ ] Create @2x variants (retina) optional

**Phase 2: Integration**
- [ ] Place PNG files di `public/images/mascots/`
- [ ] Update ChatUIEnhancers.tsx if needed for Image component
- [ ] Test di AI Mentor page
- [ ] Test di login screen (onboarding)

**Phase 3: Deployment**
- [ ] Verify images load correctly on Vercel
- [ ] Test on mobile/tablet
- [ ] Check performance impact
- [ ] Monitor image loading times

---

## 📱 Where Each Pose Appears

| Pose | Location/Screen | Trigger |
|------|-----------------|---------|
| **Onboarding** | Login page, Welcome modal, First-time onboarding | App load, new user signup |
| **Vision** | AI Mentor chat, chart upload section | User uploads screenshot, analyzing |
| **Victory** | Notification toast, modal popup, dashboard | TP hit, daily profit reached |
| **Warning** | Alert modal, warning banner | Overtrade detected, plan violation |
| **Empty** | Empty state message, error fallback | No trades, API error, loading |

---

## 🎯 Design Brief Summary

**Character:** Commander Arka - Level 4 COMMANDER from MPT hierarchy
**Role:** AI Mentor avatar, guide, and motivator for traders
**Visual Identity:** Futuristic military commander with tactical armor
**Personality:** Professional yet supportive ("Tegas tapi supportif")
**Tagline:** "Focus on the Plan, Not the Panic"

**Key Message:** "Saya adalah mentor yang siap mendampingi perjalanan trading Anda dengan disiplin dan strategi yang terbukti."

---

## 📝 Next Steps

1. **Create Mascot Images** (5 PNG files)
2. **Save to** `public/images/mascots/`
3. **Test Components** in ChatUIEnhancers.tsx
4. **Integrate in:**
   - AI Mentor page (`src/app/ai-mentor/page.tsx`)
   - Login page (`src/app/auth/login/page.tsx`)
   - Trade Journal notifications
   - Dashboard alerts
5. **Deploy to Vercel**

---

**Status:** 🔄 Ready for mascot design
**Components:** ✅ Code ready
**Documentation:** ✅ Complete
**Next:** Design 5 poses → Upload images → Test integration
