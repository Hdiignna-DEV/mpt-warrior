# MPT Warrior - Quick Start Checklist

Panduan langkah demi langkah untuk memulai dengan MPT Warrior.

## ✅ Pre-Installation Checklist

- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 8.0.0 installed (or yarn)
- [ ] Git installed
- [ ] Google account untuk Gemini API
- [ ] Text editor atau IDE (VSCode recommended)

## 📥 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/mpt-warrior.git
cd mpt-warrior
```
- [ ] Repository cloned successfully

### 2. Setup Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Get API Key dari Google Cloud Console
# 1. Go to https://console.cloud.google.com
# 2. Create new project
# 3. Enable Generative AI API
# 4. Create API Key
# 5. Paste ke .env.local

# .env.local should contain:
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```
- [ ] Google Gemini API key obtained
- [ ] .env.local file created
- [ ] API keys configured

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```
- [ ] All dependencies installed
- [ ] No installation errors

### 4. Verify Setup
```bash
npm run type-check
npm run lint
```
- [ ] Type checking passed
- [ ] Linting passed

### 5. Start Development Server
```bash
npm run dev
```
- [ ] Server started on http://localhost:3000
- [ ] No build errors
- [ ] Page loads successfully

## 🎯 First Use Setup

### 1. Access Application
- [ ] Open http://localhost:3000 in browser
- [ ] See dashboard page
- [ ] UI renders correctly

### 2. Configure Account Balance
- [ ] Click on balance in top right
- [ ] Enter your initial balance (e.g., $10,000)
- [ ] Balance saved and displayed

### 3. Set Risk Percentage
- [ ] Go to Settings (if available)
- [ ] Set default risk per trade (recommended: 2%)
- [ ] Save preferences

### 4. Choose Theme
- [ ] Click theme toggle (☀️/🌙 icon)
- [ ] Toggle between light/dark mode
- [ ] Preference persists on reload

### 5. Test Navigation
- [ ] Click Sidebar menu items
- [ ] Navigate to each page:
  - [ ] Dashboard
  - [ ] AI Mentor
  - [ ] Risk Calculator
  - [ ] Trading Journal
  - [ ] Achievements
  - [ ] Analytics

## 🤖 Test AI Mentor Feature

### 1. Go to AI Mentor Page
- [ ] Navigate to /ai-mentor

### 2. Start Chat
- [ ] Type a message like "Halo"
- [ ] Click Send button
- [ ] Wait for AI response

### 3. Verify Response
- [ ] AI returns appropriate response
- [ ] Chat history displayed
- [ ] Messages properly formatted

## 📊 Test Risk Calculator

### 1. Go to Calculator Page
- [ ] Navigate to /calculator

### 2. Enter Values
- [ ] Account Balance: 10,000
- [ ] Risk %: 2
- [ ] Entry Price: 1.2000
- [ ] Stop Loss: 1.1950
- [ ] Take Profit: 1.2100

### 3. Verify Calculations
- [ ] Risk Amount calculated
- [ ] Position Size shown
- [ ] R:R Ratio displayed
- [ ] Export button works

## 📝 Test Trading Journal

### 1. Go to Journal Page
- [ ] Navigate to /journal

### 2. Log Trade
- [ ] Click "Add Trade" button
- [ ] Fill in trade details
- [ ] Add trade to list

### 3. View Journal Entry
- [ ] See entry in list
- [ ] Click to expand details
- [ ] Edit functionality works

## 🏆 Test Achievements

### 1. Go to Achievements Page
- [ ] Navigate to /achievements

### 2. View Badges
- [ ] See achievement cards
- [ ] Check achievement descriptions
- [ ] Progress bars visible

## 📈 Test Analytics

### 1. Go to Analytics Page
- [ ] Navigate to /analytics

### 2. View Charts
- [ ] Charts load without errors
- [ ] Data displayed correctly
- [ ] Responsive on mobile

## 🔌 Test API Endpoints

### 1. Test Chat Endpoint
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Halo",
    "sessionId": "test-session",
    "history": []
  }'
```
- [ ] Endpoint responds
- [ ] Returns valid JSON

### 2. Test Calendar Endpoint
```bash
curl http://localhost:3000/api/calendar
```
- [ ] Endpoint responds
- [ ] Returns event data

## 🐳 Optional: Docker Setup

### 1. Install Docker
```bash
# Download dari https://www.docker.com/products/docker-desktop
```
- [ ] Docker installed

### 2. Build Docker Image
```bash
docker build -t mpt-warrior .
```
- [ ] Image builds successfully

### 3. Run Container
```bash
docker run -p 3000:3000 mpt-warrior
```
- [ ] Container runs
- [ ] App accessible at http://localhost:3000

## 📱 Test Responsive Design

- [ ] Desktop (1920x1080) - All features work
- [ ] Tablet (768x1024) - Layout adjusts properly
- [ ] Mobile (375x812) - Sidebar collapses, navigation works

## 🔒 Test Data Persistence

### 1. Add Trade Data
- [ ] Log a trade
- [ ] Reload page (F5)
- [ ] Trade still visible

### 2. Change Theme
- [ ] Toggle theme
- [ ] Reload page
- [ ] Theme preference persists

### 3. Chat History
- [ ] Send message
- [ ] Reload page
- [ ] Chat history preserved

## 🚀 Deploy to Production

### 1. Build for Production
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] .next folder created

### 2. Start Production Server
```bash
npm start
```
- [ ] Server starts on port 3000
- [ ] Application responsive

### 3. Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# Go to https://vercel.com
# Import repository
# Set environment variables
# Deploy
```
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Deployment successful

## ✅ Final Verification

- [ ] All pages load without errors
- [ ] Navigation works smoothly
- [ ] Features functional
- [ ] Data persists correctly
- [ ] API responses valid
- [ ] Responsive design working
- [ ] Dark/Light mode toggles
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Ready for production

## 📊 Performance Checklist

### Core Web Vitals
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

### Bundle Size
- [ ] JavaScript bundle < 500KB
- [ ] CSS < 100KB
- [ ] Total < 2MB

## 🆘 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Missing API key
```bash
# Verify .env.local exists
cat .env.local

# Should contain:
# NEXT_PUBLIC_GEMINI_API_KEY=your_key
```

### Issue: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Issue: API errors
- [ ] Check network tab in DevTools
- [ ] Verify API key
- [ ] Check browser console for errors
- [ ] Verify endpoint URLs

## 📞 Support

- 📖 See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed guide
- 🚀 See [ROADMAP.md](ROADMAP.md) for upcoming features
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- 🔒 See [SECURITY.md](SECURITY.md) for security info

---

**Congratulations! MPT Warrior is now set up and ready to use! 🎉**

**Happy Trading! 📈**
