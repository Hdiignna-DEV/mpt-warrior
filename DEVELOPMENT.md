# MPT Warrior Hub - Setup & Development Guide

Panduan lengkap untuk setup, development, dan deployment MPT Warrior.

## 📋 Table of Contents
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Development](#development)
- [Project Structure](#project-structure)
- [Fitur Utama](#fitur-utama)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Persyaratan

### System Requirements
- Node.js >= 18.0.0
- npm atau yarn
- Git

### External Services
- Google Gemini API (untuk AI Mentor)
- Azure Cosmos DB (untuk production)
- Azure Cosmos DB Emulator (untuk development - optional)

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd mpt-warrior
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan credentials Anda
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 4. Jalankan Development Server
```bash
npm run dev
# Buka http://localhost:3000
```

## Development

### Scripts
```bash
npm run dev       # Development server
npm run build     # Build untuk production
npm start         # Start production server
npm run lint      # Jalankan ESLint
```

### Development Workflow

#### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Changes
- Ikuti coding standards
- Tambahkan type hints untuk TypeScript
- Gunakan components yang ada di `/src/components`

#### 3. Test Changes
```bash
npm run dev
# Test di http://localhost:3000
```

#### 4. Commit & Push
```bash
git add .
git commit -m "feat: description of changes"
git push origin feature/your-feature-name
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   ├── chat/       # AI Chat endpoint
│   │   └── calendar/   # Calendar integration
│   ├── ai-mentor/      # AI Mentor page
│   ├── calculator/     # Risk Calculator page
│   ├── journal/        # Trading Journal page
│   ├── achievements/   # Achievements page
│   ├── analytics/      # Analytics Dashboard page
│   ├── layout.tsx      # Root layout dengan ThemeProvider
│   ├── page.tsx        # Dashboard utama
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── Sidebar.tsx
│   ├── Statistics.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── TradeJournal.tsx
│   ├── Achievements.tsx
│   └── ... (komponen lainnya)
└── utils/             # Utility functions & services
    ├── config.ts      # Konfigurasi app
    ├── logger.ts      # Logging utility
    ├── helpers.ts     # Helper functions
    ├── analytics.ts   # Analytics service
    ├── backup.ts      # Backup service
    ├── cosmosdb.ts    # Cosmos DB integration
    └── store.ts       # Zustand state management
```

## Fitur Utama

### 1. Dashboard
- Overview statistik trading
- Win rate tracking
- Balance history
- Recent trades

### 2. AI Mentor
- Chat dengan AI untuk trading advice
- Image analysis untuk chart reading
- Context-aware responses
- Chat history persistence

### 3. Trading Journal
- Catat setiap trade
- Rich text editor untuk notes
- Emotion tracking
- Performance analysis

### 4. Risk Calculator
- Hitung position size
- Risk/Reward ratio
- Margin requirement
- Trade planning tools

### 5. Achievements & Gamification
- Badges untuk milestones
- Leaderboard
- Streak tracking
- Progress visualization

### 6. Analytics Dashboard
- Win rate analysis
- Profit/Loss tracking
- Trade distribution
- Time-based analytics

### 7. Economic Calendar
- Real-time economic events
- Market impact indicators
- Trading alerts

## Best Practices

### Code Style
```typescript
// ✅ Good
const calculateProfit = (entry: number, exit: number): number => {
  return exit - entry;
};

// ❌ Avoid
function calculateProfit(entry, exit) {
  return exit - entry;
}
```

### Component Structure
```typescript
// ✅ Good
'use client';

import { useState } from 'react';
import { ComponentIcon } from 'lucide-react';

interface ComponentProps {
  title: string;
  data: TradeData[];
}

export default function MyComponent({ title, data }: ComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

### API Routes
```typescript
// ✅ Good error handling
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Process
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### State Management
```typescript
// Gunakan Zustand untuk global state
import { create } from 'zustand';

export const useTradeStore = create((set) => ({
  trades: [],
  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades]
  }))
}));
```

## Cosmos DB Setup

### Untuk Development (Dengan Emulator)

1. **Download Azure Cosmos DB Emulator**
   - https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator

2. **Jalankan Emulator**
   ```bash
   # Windows
   & 'C:\Program Files\Azure Cosmos DB Emulator\cosmosdb.exe'
   
   # macOS/Linux dengan Docker
   docker run -p 8081:8081 mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
   ```

3. **Verifikasi Connection**
   - Endpoint: `https://localhost:8081/`
   - Key: `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QkCqFY=`

4. **Set Environment Variable**
   ```bash
   # .env.local
   NEXT_PUBLIC_COSMOS_CONNECTION_STRING=AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QkCqFY=;
   ```

### Untuk Production

1. **Create Azure Cosmos DB Account**
   ```bash
   az cosmosdb create --resource-group myResourceGroup \
     --name mpt-warrior-db \
     --kind GlobalDocumentDB
   ```

2. **Get Connection String**
   ```bash
   az cosmosdb keys list --resource-group myResourceGroup \
     --name mpt-warrior-db \
     --type connection-strings
   ```

3. **Set Production Environment**
   ```bash
   NEXT_PUBLIC_COSMOS_CONNECTION_STRING=your_connection_string
   ```

## Google Gemini Setup

1. **Create Google Cloud Project**
   - Buka https://console.cloud.google.com
   - Create new project

2. **Enable Generative AI API**
   - Search "Generative AI API"
   - Click "Enable"

3. **Create API Key**
   - Pilih "Credentials"
   - Create "API Key"

4. **Set Environment Variable**
   ```bash
   # .env.local
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
   GEMINI_API_KEY=your_api_key
   ```

## Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port berbeda
npm run dev -- -p 3001
```

### Cosmos DB connection error
1. Verifikasi emulator running
2. Check connection string di .env.local
3. Pastikan firewall tidak blocking

### Gemini API error
1. Verify API key di .env.local
2. Check API quota di Google Cloud Console
3. Ensure Generative AI API enabled

### Import errors
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Ke Vercel
```bash
# Push ke GitHub
git push origin main

# Vercel otomatis deploy
# Set environment variables di Vercel dashboard
```

### Ke Azure App Service
```bash
# Build
npm run build

# Deploy
az webapp up --resource-group myResourceGroup \
  --name mpt-warrior \
  --runtime "node|18"
```

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Azure Cosmos DB Docs](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Last Updated**: January 2026
**Version**: 1.0.0
