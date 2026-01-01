# Data Source Architecture - MPT Warrior Dashboard

## 📊 Dashboard Data Sources

Dashboard mengambil data dari **3 sumber berbeda** dengan hierarki fallback:

### 1. **localStorage (Primary - Client-Side)**
```
Lokasi: Browser's localStorage
Key: 'trades' dan 'mpt_initial_balance'
Tipe Data: JSON string
Scope: Single browser, persistent
```

**Data yang disimpan:**
```javascript
// Trades
localStorage.getItem('trades')
// Format: [{ id, pair, posisi, hasil, pip, tanggal, catatan }, ...]

// Balance
localStorage.getItem('mpt_initial_balance')
// Format: "10000"
```

### 2. **Zustand Store (Client-Side State Management)**
```
File: src/utils/store.ts
Tipe: In-memory state store dengan persistence
Storage: localStorage via zustand persist middleware
Key: 'mpt-trade-store'
```

**Store Structure:**
```typescript
interface TradeStore {
  trades: Trade[]           // Array of trade records
  balance: number          // Current account balance
  userId: string          // User identifier
  // Methods: addTrade, removeTrade, updateTrade, setTrades, setBalance
}
```

### 3. **Azure Cosmos DB (Optional - Production)**
```
File: src/utils/cosmosdb.ts
Database: Azure Cosmos DB SQL API
Database Name: mpt-warrior
Container Names: trades, journal-entries, users
Partition Key: /userId
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Dashboard (page.tsx)                   │
│                                                           │
│  useEffect(() => {                                       │
│    // Load dari localStorage                             │
│    const saved = localStorage.getItem('trades')          │
│    const savedBalance = localStorage.getItem(...)        │
│  })                                                       │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌───────────────────────────────────────┐
        │        Data Processing Layer          │
        │                                       │
        │  - Calculate statistics               │
        │  - Compute win rate                   │
        │  - Calculate balance                  │
        │  - Determine best streak              │
        └───────────────────────────────────────┘
                           ↓
        ┌───────────────────────────────────────┐
        │        UI Components Layer            │
        │                                       │
        │  - Stats cards                        │
        │  - Charts (if implemented)            │
        │  - Recent trades table                │
        │  - Balance editor                     │
        └───────────────────────────────────────┘
```

---

## 📝 Data Flow Per Component

### Dashboard Data Load
```tsx
// src/app/page.tsx
useEffect(() => {
  // 1. Load trades dari localStorage
  const saved = localStorage.getItem('trades');
  if (saved) {
    const parsedTrades = JSON.parse(saved);
    setTrades(parsedTrades);
  }

  // 2. Load balance preference
  const savedBalance = localStorage.getItem('mpt_initial_balance');
  if (savedBalance) {
    setCustomBalance(parseFloat(savedBalance));
  }
}, []);
```

### Trading Journal Data Persistence
```tsx
// src/components/TradeJournal.tsx
// Ketika user menambah trade:
1. Create new trade object
2. Save ke localStorage via Zustand
3. Update state menggunakan setTrades()
4. Display updated list

// localStorage structure:
{
  "trades": [
    {
      "id": "uuid",
      "pair": "EURUSD",
      "posisi": "BUY",
      "hasil": "WIN",
      "pip": 25,
      "tanggal": "2025-01-01",
      "catatan": "Good entry point"
    }
  ]
}
```

---

## 🔐 Current Implementation (Default)

**Saat ini aplikasi menggunakan:**
- ✅ **localStorage** untuk persistency (primary)
- ✅ **Zustand store** untuk state management
- ⚠️ **Cosmos DB** ter-setup tapi tidak digunakan (optional)

**Mengapa localStorage?**
- Tidak memerlukan backend server
- Instant loading tanpa latency
- GDPR compliant (data di client)
- Sempurna untuk single-user aplikasi

---

## 💾 Data Persistence Timeline

```
User Input
    ↓
State Update (React State)
    ↓
localStorage.setItem('trades', JSON.stringify(trades))
    ↓
Zustand store update via persist middleware
    ↓
Data persists across browser sessions
```

---

## 🔄 Sync Mechanism

### Auto-Save Locations
```javascript
// Ketika trade ditambah/diubah/dihapus:

1. React State → setTrades([...])
2. localStorage → localStorage.setItem('trades', JSON.stringify(trades))
3. Zustand → store.setTrades(trades)
4. Local File System → (via Zustand persist)
```

### Multi-Tab Synchronization
⚠️ **Saat ini tidak di-implement**
- Changes di tab A tidak auto-sync ke tab B
- Workaround: Hard refresh di tab lain
- Solusi future: Implement `storage` event listener

---

## 📊 Statistics Calculation (All Client-Side)

Dashboard menghitung statistik real-time dari local trades:

```typescript
// Total Trades
const totalTrades = trades.length;

// Win/Loss Count
const winTrades = trades.filter(t => t.hasil === 'WIN').length;
const lossTrades = totalTrades - winTrades;

// Win Rate %
const winRate = totalTrades > 0 
  ? Math.round((winTrades / totalTrades) * 100) 
  : 0;

// Total Pips
const totalPips = trades.reduce((sum, trade) => sum + trade.pip, 0);

// Current Balance
const currentBalance = initialBalance + (totalPips * 10);

// Profit/Loss
const profitLoss = currentBalance - initialBalance;

// Best Winning Streak
function calculateBestStreak() {
  let currentStreak = 0;
  let bestStreak = 0;
  
  trades.forEach(trade => {
    if (trade.hasil === 'WIN') {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return bestStreak;
}
```

---

## 🔌 Optional: Enable Cosmos DB Backend

### Jika ingin pindah ke cloud database:

1. **Set Environment Variables:**
```env
NEXT_PUBLIC_COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_DB_KEY=your-primary-key
```

2. **Update store.ts:**
```typescript
// Add sync to Cosmos DB
export const syncToCosmosDB = async (trades: Trade[]) => {
  const container = await getContainer('trades');
  // Implement sync logic
}
```

3. **Call sync after mutations:**
```typescript
const addTrade = (trade) => {
  setTrades([trade, ...trades]);
  await syncToCosmosDB([trade, ...trades]); // NEW
}
```

---

## 🎯 Data Model

### Trade Interface
```typescript
interface Trade {
  id: string;           // UUID
  pair: string;         // e.g., "EURUSD", "GBPUSD"
  posisi: 'BUY' | 'SELL';  // Trade direction
  hasil: 'WIN' | 'LOSS';   // Trade result
  pip: number;          // Pips gained/lost
  tanggal: string;      // Date in YYYY-MM-DD format
  catatan: string;      // Trade notes/reasoning
}
```

### Balance Storage
```typescript
interface BalanceData {
  initial: number;      // Starting balance
  current: number;      // = initial + (totalPips * 10)
  trades: Trade[];      // Array of trades
}
```

---

## 🔍 Data Access Patterns

### Reading Data (Dashboard)
```
Dashboard Load → localStorage.getItem('trades') → Parse JSON → Display
```

### Creating Data (Journal)
```
Form Submit → Validate → Create Trade Object → 
localStorage.setItem() → Update State → Display New Trade
```

### Updating Data
```
Edit Trade → Update Object → localStorage.setItem() → Re-render
```

### Deleting Data
```
Delete Request → Filter Array → localStorage.setItem() → Update UI
```

---

## ⚠️ Data Limitations

### Current Implementation
- **Max Data**: ~5-10MB per browser (localStorage limit)
- **Scope**: Single browser only
- **Backup**: Manual (export required)
- **Sync**: No cross-device sync
- **History**: No data versioning

### Best For
✅ Personal trading tracking
✅ Demo/testing purposes
✅ Single-user scenarios
✅ Offline-first approach

### Not Suitable For
❌ Multi-user collaboration
❌ Enterprise backup requirements
❌ Complex data relationships
❌ Real-time sync across devices

---

## 🚀 Future Improvements

1. **Cloud Sync**: Implement Cosmos DB backend
2. **Multi-Device Sync**: Cross-device data synchronization
3. **Data Export**: CSV/JSON export functionality
4. **Data Import**: Import trades from external sources
5. **Backup System**: Automatic daily backups
6. **Version Control**: Track changes history

---

## 🔒 Data Security

### Current Implementation
✅ Data stored locally in browser
✅ No server transmission of sensitive data
✅ User fully controls their data

### Recommendations
⚠️ Never share browser/localStorage data
⚠️ Clear browser cache if sharing computer
⚠️ Implement authentication for cloud sync
⚠️ Use HTTPS for all API calls

---

## 📈 Example: Complete Data Flow

```
User Opens Dashboard
    ↓
useEffect triggers on component mount
    ↓
localStorage.getItem('trades')
    ↓
Parse JSON string to Trade[]
    ↓
setTrades(parsedTrades)
    ↓
Calculate statistics:
  - Total Trades: 10
  - Win Rate: 60%
  - Current Balance: $10,250
    ↓
Render UI with statistics
    ↓
User clicks "Add Trade" → Navigates to Journal
    ↓
User fills form → Clicks Submit
    ↓
Create Trade object + UUID
    ↓
Update localStorage: trades.push(newTrade)
    ↓
Zustand store updates via persist middleware
    ↓
Dashboard auto-refreshes with new stats
```

---

**Summary**: Dashboard mengambil data dari **localStorage** (primary), dengan Zustand sebagai state manager, dan Cosmos DB sebagai optional backend untuk cloud sync di masa depan.
