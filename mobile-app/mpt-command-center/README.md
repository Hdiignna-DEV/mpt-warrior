# MPT Command Center Mobile App

Aplikasi mobile trading profesional untuk Warrior Indonesia dengan fitur lengkap.

## Fitur Utama

- **Dashboard** - Statistik trading real-time
- **Trading Journal** - Catat dan analisis setiap trade
- **AI Mentor** - Dapatkan saran dari AI  
- **Risk Calculator** - Hitung posisi size dengan akurat
- **Leaderboard** - Kompetisi dengan trader lain
- **Achievements** - Raih badge dan milestone

## Build untuk Android

```bash
eas build --platform android --profile preview
```

## Install Lokal (Development)

```bash
npm install
npm start
```

Kemudian pilih Android di menu yang muncul.

## Struktur Project

```
app/
  (tabs)/           # Tab navigation screens
    dashboard.tsx
    journal.tsx
    ai-mentor.tsx
    calculator.tsx
    leaderboard.tsx
    achievements.tsx
    _layout.tsx
  _layout.tsx       # Root layout
assets/             # Images & fonts
constants/          # Theme colors & constants
hooks/              # Custom React hooks
```
