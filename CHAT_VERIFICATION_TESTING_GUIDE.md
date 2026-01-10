# Chat History - Verification & Testing Guide

**Quick Verify**: Is everything working? Follow these steps!

---

## ✅ Verification Method 1: Check Health Endpoint

### Step 1: Run Terminal Command
```bash
curl http://localhost:3000/api/health/cosmos
```

### Step 2: Look for This Response
```json
{
  "success": true,
  "isHealthy": true,
  "database": true,
  "containers": {
    "users": true,
    "trades": true,
    "invitationCodes": true,
    "auditLogs": true,
    "chatThreads": true,       ← ✅ Must be TRUE
    "chatMessages": true       ← ✅ Must be TRUE
  },
  "timestamp": "2026-01-10T10:30:00.000Z"
}
```

### Step 3: What Each Field Means
| Field | Meaning |
|-------|---------|
| `chatThreads: true` | ✅ Thread container exists |
| `chatMessages: true` | ✅ Message container exists |
| Both TRUE | ✅ Auto-initialization worked! |

---

## ✅ Verification Method 2: Test Chat Flow (Browser)

### Step 1: Open App
- Go to http://localhost:3000
- Login/register if needed

### Step 2: Create New Chat
1. Click "New Chat" or "Start Conversation"
2. Give it a title (e.g., "Test Chat")
3. Send a message

### Step 3: Reload Page
1. Press F5 or Cmd+R
2. Go back to same chat thread
3. **Expected**: Message should still be there! ✅

### Step 4: Close and Reopen
1. Close the browser tab
2. Open new tab to app
3. Navigate to same chat thread
4. **Expected**: Message persists! ✅

---

## ✅ Verification Method 3: Azure Portal (Advanced)

### Step 1: Go to Azure Portal
- https://portal.azure.com
- Find your Cosmos DB account (mpt-warrior-db)

### Step 2: Open Data Explorer
1. Click "Data Explorer" in left menu
2. Expand database "mpt-warrior"
3. Look for folders:
   - ✅ `chat-threads`
   - ✅ `chat-messages`

### Step 3: Check Container Details
For each container, verify:
- **Partition Key**: `/userId` ✅
- **Throughput**: Auto-scale 400-4000 RU/s ✅
- **TTL**: Not set ✅

### Step 4: View Sample Data
Click into each container and look for:
- chat-threads: Thread documents with userId, title, etc
- chat-messages: Message documents with content, role, etc

---

## ✅ Verification Method 4: Run Tests

### If Tests Exist
```bash
npm run test
```

### Expected Output
```
PASS  src/__tests__/api/chat.test.ts
  ✓ Should create chat thread
  ✓ Should save message
  ✓ Should load history
  ✓ Should handle errors

Tests:       4 passed, 0 failed
```

---

## ✅ Verification Method 5: Check Build

### Run Build
```bash
npm run build
```

### Expected Output
```
✓ Compiled successfully in 5.1s
✓ Finished TypeScript in 8.7s
✓ 81 routes generated
✓ 0 TypeScript errors
```

---

## 🚨 Troubleshooting: If Verification Fails

### Issue 1: `chatThreads: false` or `chatMessages: false`

**Cause**: Containers not created yet  
**Solution**:
```bash
# Call health endpoint to trigger auto-creation
curl http://localhost:3000/api/health/cosmos

# Wait 5 seconds for Azure to process
sleep 5

# Try again
curl http://localhost:3000/api/health/cosmos
```

### Issue 2: "401 Unauthorized" or "Permission Denied"

**Cause**: Wrong connection string  
**Solution**:
1. Check `.env` file: `AZURE_COSMOS_CONNECTION_STRING`
2. Verify in Azure Portal:
   - Go to Cosmos DB → Keys
   - Copy the "Primary Connection String"
   - Update your `.env`
3. Restart app and try again

### Issue 3: Message Disappears After Reload

**Cause**: Message not actually saved to database  
**Solution**:
1. Check browser Network tab (F12 → Network):
   - POST /api/chat/save should be `200 OK`
   - Response should include message object
2. If response is `500` error:
   - Check server logs for error message
   - Likely database connection issue

### Issue 4: "Container does not exist" Error

**Cause**: Auto-initialization failed  
**Solution**:
1. Call health endpoint:
   ```bash
   curl http://localhost:3000/api/health/cosmos
   ```
2. Or manually trigger init (if admin):
   ```bash
   curl -X POST http://localhost:3000/api/admin/init-cosmos \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

---

## 📊 Expected Response Times

If system is working correctly:

| Action | Time | Status |
|--------|------|--------|
| Create thread | ~100ms | ✅ |
| Save message | ~50-100ms | ✅ |
| Load history | ~100-200ms | ✅ |
| Reload page | <1s total | ✅ |

If slower than this, could indicate:
- Network latency
- Cold start on Azure
- Database connection issue

---

## 🔍 Debug Checklist

Before reporting an issue, check:

- [ ] App is running (`npm run dev`)
- [ ] Health endpoint returns `true` for both chat containers
- [ ] JWT token is valid (not expired)
- [ ] AZURE_COSMOS_CONNECTION_STRING is set in .env
- [ ] Browser Network tab shows POST requests returning 200 OK
- [ ] Browser Console (F12) shows no red errors
- [ ] Azure Cosmos DB account is not in read-only mode
- [ ] Sufficient quota/RU available

---

## 🎯 Quick Diagnostic

Run this to get diagnostic info:
```bash
# Check app health
curl http://localhost:3000/api/health/cosmos | jq .

# Check if containers exist in Azure
# (Login to Azure Portal, check Data Explorer)

# Check app version
curl http://localhost:3000/api/health | jq .version

# Check logs (if running in Docker)
docker logs container_name
```

---

## ✅ Full Verification Checklist

After implementing, verify everything:

```
□ Health endpoint returns both containers as true
□ Can create new chat thread in UI
□ Can send message in chat
□ Message appears immediately in UI
□ Reload page - message still there
□ Close browser - message still there
□ Check Azure Portal - see containers exist
□ Check Azure Portal - see messages in database
□ Build passes (npm run build)
□ No errors in console (F12)
□ API responses are 200 OK
```

---

## 📞 When Everything Works

You'll see:
- ✅ Messages save instantly
- ✅ Chat history persists on reload
- ✅ Multiple users have separate threads
- ✅ No data loss
- ✅ Fast response times (~50-200ms)

---

## 🎉 You're Done!

If you can answer YES to:
1. "Do I see `chatThreads: true` and `chatMessages: true` in health check?"
2. "Can I send a message and see it after page reload?"
3. "Does build pass with 0 errors?"

Then your chat system is **fully working**! ✅

---

**Next Steps**:
- Deploy to Vercel/Azure
- Share with users
- Monitor for issues
- Enjoy working chat history! 🎉

---

**Status**: Ready for Production ✅
