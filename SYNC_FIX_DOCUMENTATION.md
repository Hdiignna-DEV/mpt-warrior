# Data Synchronization Fix - Dashboard & Journal Integration

## ✅ Problem Solved

**Issue**: Data yang diinput di Journal tidak muncul di Dashboard
- Journal menyimpan ke key `'mpt_journal_entries'`
- Dashboard membaca dari key `'trades'`
- Keys berbeda → Data tidak sync

---

## 🔧 Solution Implemented

### 1. **Created Unified Storage Sync Utility**
**File**: `src/utils/storage-sync.ts`

Utility ini menyediakan:
```typescript
// Storage Keys (centralized)
STORAGE_KEYS = {
  TRADES: 'trades',
  JOURNAL_ENTRIES: 'mpt_journal_entries',
  INITIAL_BALANCE: 'mpt_initial_balance',
  THEME: 'mpt-theme',
}

// Functions
getTrades()                    // Get trades dari localStorage
saveTrades(trades)            // Save trades + dispatch events
getJournalEntries()           // Get journal entries
saveJournalEntries(entries)   // Save journal + auto-sync to trades
addTrade(trade)               // Add single trade
updateTrade(id, updates)      // Update trade
deleteTrade(id)               // Delete trade
onTradesUpdated(callback)     // Subscribe ke trade updates
```

---

## 📊 Data Flow Architecture (New)

```
Journal Component
    ↓
handleSaveEntry()
    ↓
setEntries([...])  (React State)
    ↓
useEffect dependency triggered
    ↓
saveJournalEntries(entries)  (Utility)
    ↓
    ├─> localStorage.setItem('mpt_journal_entries', ...)
    ├─> Convert to Trade format
    ├─> localStorage.setItem('trades', ...)
    └─> notifyTradesUpdated()  (dispatch CustomEvent)
    ↓
Dashboard Component
    ↓
onTradesUpdated hook listener
    ↓
setTrades(updatedTrades)  (Auto update UI)
```

---

## 🔄 Synchronization Mechanisms

### **1. Same-Tab Sync (Immediate)**
```typescript
// In TradeJournal.tsx
useEffect(() => {
  if (entries.length > 0 || localStorage.getItem('mpt_journal_entries')) {
    saveJournalEntries(entries);  // Auto-sync to trades
  }
}, [entries]);

// In Dashboard page.tsx
useEffect(() => {
  const unsubscribe = onTradesUpdated((updatedTrades) => {
    setTrades(updatedTrades);  // Update UI in real-time
  });
  return unsubscribe;
}, []);
```

**Result**: ⚡ Instant sync - data appears immediately

### **2. Cross-Tab Sync (storage event)**
```typescript
// In Dashboard page.tsx
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'trades' && event.newValue) {
      const updatedTrades = JSON.parse(event.newValue);
      setTrades(updatedTrades);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
```

**Result**: 🔄 Cross-browser-tab sync works automatically

### **3. Event Subscription System**
```typescript
// Subscribe to updates
const unsubscribe = onTradesUpdated((trades) => {
  console.log('Trades updated:', trades);
});

// Cleanup
return unsubscribe;
```

---

## 📝 Updated Components

### **TradeJournal.tsx**
✅ Menggunakan `saveJournalEntries()` dari utility
✅ Auto-sync ke trades key
✅ Dispatch events untuk update dashboard

```typescript
import { saveJournalEntries, getJournalEntries } from '@/utils/storage-sync';

// Load
const loadedEntries = getJournalEntries();
setEntries(loadedEntries);

// Save (auto-syncs to dashboard)
useEffect(() => {
  if (entries.length > 0) {
    saveJournalEntries(entries);
  }
}, [entries]);
```

### **Dashboard (page.tsx)**
✅ Menggunakan utility functions untuk get/save data
✅ Subscribe ke events untuk real-time updates
✅ Listen ke storage changes untuk cross-tab sync

```typescript
import { getTrades, getInitialBalance, saveInitialBalance, onTradesUpdated } from '@/utils/storage-sync';

// Load initial data
useEffect(() => {
  const initialTrades = getTrades();
  setTrades(initialTrades);
}, []);

// Subscribe to real-time updates
useEffect(() => {
  const unsubscribe = onTradesUpdated((updatedTrades) => {
    setTrades(updatedTrades);
  });
  return unsubscribe;
}, []);
```

---

## 🎯 How It Works - Step by Step

### **Scenario: User adds trade di Journal**

1. **User submits form**
   ```
   Form → handleSaveEntry()
   ```

2. **Create entry & update state**
   ```
   const entry = { id, date, pair, trade, ... }
   setEntries([entry, ...entries])
   ```

3. **useEffect triggers (dependency: entries)**
   ```
   useEffect(() => {
     saveJournalEntries(entries)  // Utility function
   }, [entries])
   ```

4. **Inside saveJournalEntries()**
   ```
   // Step A: Save original journal entry
   localStorage.setItem('mpt_journal_entries', JSON.stringify(entries))
   
   // Step B: Convert to dashboard format
   const trades = entries.map(e => ({
     id: e.id,
     pair: e.pair,
     posisi: 'BUY',
     hasil: e.trade.result,  // WIN/LOSS
     pip: e.trade.pips,
     tanggal: e.date,
     catatan: e.notes || e.lessonLearned,
   }))
   
   // Step C: Sync to trades key
   localStorage.setItem('trades', JSON.stringify(trades))
   
   // Step D: Notify listeners
   notifyTradesUpdated(trades)
   ```

5. **Dashboard receives notification**
   ```
   window.addEventListener('tradesUpdated', (event) => {
     const trades = event.detail
     setTrades(trades)  // Update state
   })
   ```

6. **Dashboard re-renders with new data** ✅
   ```
   <div>Total Trades: {totalTrades}</div>
   <table>
     {trades.map(t => <tr>{t.pair} {t.hasil}</tr>)}
   </table>
   ```

---

## 📱 Data Transformation

**Journal Entry** → **Dashboard Trade**

```javascript
// Input (Journal)
{
  id: "1735...",
  date: "2025-01-01",
  pair: "EURUSD",
  trade: {
    entry: 1.0500,
    exit: 1.0525,
    pips: 250,
    result: "WIN"
  },
  emotionalState: "confident",
  notes: "Good entry point"
}

// Output (Dashboard)
{
  id: "1735...",
  pair: "EURUSD",
  posisi: "BUY",        // Default
  hasil: "WIN",         // From trade.result
  pip: 250,             // From trade.pips
  tanggal: "2025-01-01",// From date
  catatan: "Good entry point"  // From notes
}
```

---

## ✨ Benefits

| Feature | Before | After |
|---------|--------|-------|
| Data Sync | Manual | Automatic ✅ |
| Real-time Updates | No | Yes ✅ |
| Cross-tab Sync | No | Yes ✅ |
| Code Duplication | High | Low ✅ |
| Maintainability | Poor | Good ✅ |
| Event System | Missing | Built-in ✅ |

---

## 🧪 Testing

### Test 1: Add Trade to Journal
```
1. Open Journal page
2. Fill form:
   - Pair: EURUSD
   - Entry: 1.0500
   - Exit: 1.0525
   - Result: WIN
3. Click Submit
4. Go to Dashboard
✅ Trade should appear in "Recent Trades" section
✅ Stats should update (Total Trades +1, Win Rate %)
```

### Test 2: Real-time Sync
```
1. Open Dashboard in Tab A
2. Open Journal in Tab B
3. Add trade in Tab B → Submit
4. Look at Tab A
✅ Dashboard should update instantly
✅ New trade visible without refresh
```

### Test 3: Cross-Tab Sync
```
1. Open http://localhost:3000 in Tab A
2. Open http://localhost:3000/journal in Tab B
3. Add trade in Tab B
4. Go back to Tab A (Dashboard)
5. Hard refresh (not needed - should auto-update)
✅ New trade visible in both tabs
```

### Test 4: Refresh Persistence
```
1. Add trade in Journal
2. Close browser completely
3. Reopen browser
4. Go to Dashboard
✅ Trade still there - persistence works
```

---

## 🔍 Debugging

### Check localStorage in DevTools
```javascript
// Open Console (F12)

// View all trades
JSON.parse(localStorage.getItem('trades'))

// View journal entries
JSON.parse(localStorage.getItem('mpt_journal_entries'))

// View balance
localStorage.getItem('mpt_initial_balance')

// Clear all data
localStorage.clear()
```

### Monitor Events
```javascript
// Listen to custom events
window.addEventListener('tradesUpdated', (e) => {
  console.log('Trades updated:', e.detail)
})

window.addEventListener('balanceUpdated', (e) => {
  console.log('Balance updated:', e.detail)
})
```

---

## 📚 Migration Guide

### If you have other components that need sync:

**Old way:**
```typescript
localStorage.setItem('trades', JSON.stringify(trades))
```

**New way:**
```typescript
import { saveTrades, getTrades, onTradesUpdated } from '@/utils/storage-sync';

// Save
saveTrades(trades)

// Load
const trades = getTrades()

// Subscribe
const unsubscribe = onTradesUpdated((trades) => {
  setTrades(trades)
})
```

---

## 🚀 Future Enhancements

1. **Add Undo/Redo Functionality**
   ```typescript
   export const getTradeHistory = () => { ... }
   export const undo = () => { ... }
   export const redo = () => { ... }
   ```

2. **Data Validation**
   ```typescript
   export const validateTrade = (trade: Trade): boolean => { ... }
   ```

3. **Export/Import**
   ```typescript
   export const exportTrades = (format: 'json' | 'csv') => { ... }
   export const importTrades = (data: any) => { ... }
   ```

4. **Cloud Sync (Cosmos DB)**
   ```typescript
   export const syncToCloud = async (trades: Trade[]) => { ... }
   ```

---

## 📌 Summary

✅ **Created unified storage sync utility** - Single source of truth
✅ **Auto-sync from Journal to Dashboard** - Real-time updates
✅ **Event-driven architecture** - Decoupled components
✅ **Cross-tab synchronization** - Works across browser tabs
✅ **Type-safe** - Full TypeScript support
✅ **Zero dependency** - Uses built-in browser APIs

**Result**: Dashboard dan Journal sekarang fully synchronized! 🎉
