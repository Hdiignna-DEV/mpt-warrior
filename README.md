# 🚀 MPT Warrior - Mindset Plan Trader Hub

**Comprehensive Trading Platform with AI Mentor, Risk Calculator, Trading Journal, and Analytics**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-yellow.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)

## ✨ Features

### Core Features

#### 🎯 Dashboard
- Real-time trading metrics and statistics
- Win rate tracking and performance overview
- Recent trades activity feed
- Customizable widgets

#### 🤖 AI Trading Mentor
- Real-time chat with Google Gemini AI
- Chart image analysis and technical interpretation
- Trading strategy discussion
- Risk management guidance
- Emotional support and psychology coaching
- Chat history persistence

#### 📊 Risk Calculator
- Position size calculation
- Risk/Reward ratio analyzer
- Margin requirement calculator
- Portfolio impact assessment
- Multiple currency support
- Export calculations as JSON

#### 📝 Trading Journal
- Rich text editor (React Quill)
- Emotion tracking and psychological analysis
- Screenshot and image support
- Lesson learned documentation
- Advanced filtering and search
- Performance analysis per trade

#### 🏆 Achievements & Gamification
- Badge system with 10+ unique achievements
- Streak tracking (wins/losses)
- Leaderboard and ranking
- Milestone rewards and progression
- Category-based achievements (Consistency, Discipline, Skill, Psychology)

#### 📈 Analytics Dashboard
- Win rate and profit factor analysis
- Sharpe ratio and drawdown calculations
- Trade distribution by pair/time/direction
- Monthly and quarterly performance
- Heatmaps and trend analysis
- Exportable reports

#### 📅 Economic Calendar
- Real-time economic event listings
- Impact indicators (High/Medium/Low)
- Previous/Forecast/Actual comparisons
- Trading alerts and notifications
- Timezone support
- Calendar export

#### 🛡️ Admin HQ (SUPER_ADMIN)
- User management (approve/reject registrations)
- Quiz grading dashboard for essay questions
- System analytics and monitoring
- Invitation code management
- Audit log tracking
- Real-time statistics

#### 📧 Email Notifications
- Welcome email on user approval
- Essay grading result notifications
- Module completion celebration emails
- Powered by Gmail SMTP (setup required)
- Beautiful HTML templates with MPT branding

### Technical Features

- **Dark/Light Theme** with persistent preference
- **Responsive Design** optimized for mobile and desktop
- **PWA Support** for offline functionality
- **Offline Support** with localStorage persistence
- **Real-time Updates** using React hooks
- **Type-safe** with full TypeScript support
- **Performance Optimized** with code splitting and lazy loading
- **Security** with XSS protection and CORS headers

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Google Gemini API key (for AI features)
- Optional: Azure Cosmos DB (for production)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/mpt-warrior.git
cd mpt-warrior
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Setup Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your API keys
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
```

#### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. **Allow localStorage** - Application uses browser localStorage for data persistence
2. **Set Account Balance** - Click on balance in dashboard to set your initial account size
3. **Configure Risk** - Set your preferred risk percentage in settings (default: 2%)
4. **Add Your First Trade** - Navigate to dashboard and log your first trade
5. **Chat with AI Mentor** - Go to AI Mentor page and ask for trading advice

## 📁 Project Structure

```
mpt-warrior/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   ├── chat/             # AI chat endpoint
│   │   │   └── calendar/         # Calendar integration
│   │   ├── ai-mentor/            # AI Mentor page
│   │   ├── calculator/           # Risk Calculator page
│   │   ├── journal/              # Trading Journal page
│   │   ├── achievements/         # Achievements page
│   │   ├── analytics/            # Analytics Dashboard
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Main dashboard
│   │   └── globals.css           # Global styles
│   ├── components/               # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── Statistics.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TradeJournal.tsx
│   │   ├── Achievements.tsx
│   │   └── ... (more components)
│   ├── utils/                    # Utility functions
│   │   ├── config.ts             # Configuration
│   │   ├── logger.ts             # Logging utility
│   │   ├── helpers.ts            # Helper functions
│   │   ├── hooks.ts              # Custom React hooks
│   │   ├── constants.ts          # App constants
│   │   ├── errors.ts             # Error handling
│   │   ├── http.ts               # HTTP client
│   │   ├── analytics.ts          # Analytics service
│   │   ├── cosmosdb.ts           # Cosmos DB integration
│   │   └── store.ts              # Zustand store
│   └── types/
│       └── index.ts              # Type definitions
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
├── DEVELOPMENT.md                # Development guide
└── ROADMAP.md                    # Feature roadmap
```

## 🔌 API Documentation

### Chat API

#### POST `/api/chat`

Send message to AI mentor.

**Request:**
```json
{
  "message": "Bagaimana cara menghitung position size?",
  "sessionId": "unique-session-id",
  "history": [],
  "image": "base64-encoded-chart-image"
}
```

**Response:**
```json
{
  "message": "AI response text here...",
  "tokens": 256,
  "model": "gemini-flash-latest"
}
```

## 💾 Database Schema

### Cosmos DB Collections

#### Trades Collection
```typescript
{
  id: string;
  userId: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  status: "OPEN" | "CLOSED" | "CANCELLED";
  result?: "WIN" | "LOSS" | "BREAKEVEN";
  riskAmount: number;
  createdAt: timestamp;
  closedAt?: timestamp;
  notes?: string;
}
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set environment variables in dashboard
   - Deploy

## 🔑 Environment Variables

```bash
# Required for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key

# Optional: Cosmos DB (for production)
NEXT_PUBLIC_COSMOS_ENDPOINT=your_endpoint
NEXT_PUBLIC_COSMOS_KEY=your_key
NEXT_PUBLIC_COSMOS_CONNECTION_STRING=your_connection_string

# Optional: Application settings
NEXT_PUBLIC_APP_NAME=MPT Warrior
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

## 📚 Development

For detailed development instructions, see [DEVELOPMENT.md](DEVELOPMENT.md)

For feature roadmap, see [ROADMAP.md](ROADMAP.md)

### Development Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mpt-warrior/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mpt-warrior/discussions)

---

**Made with ❤️ by the MPT Warrior Team**

Last Updated: January 2026 | Version: 1.0.0
