// 🔍 DEBUG SCRIPT: Check Chat History Source
// Copy & paste di browser console untuk melihat di mana data berasal

console.log('╔════════════════════════════════════════╗');
console.log('║   CHAT HISTORY SOURCE INVESTIGATION   ║');
console.log('╚════════════════════════════════════════╝\n');

// ✅ Check 1: localStorage
console.log('📍 1. LOCALSTORAGE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const savedHistory = localStorage.getItem('mpt_ai_chat_history');
if (savedHistory) {
  const parsed = JSON.parse(savedHistory);
  console.log(`✅ Found mpt_ai_chat_history: ${parsed.length} chats`);
  parsed.forEach((chat, i) => {
    console.log(`  ${i + 1}. "${chat.title}" (${chat.messages.length} messages)`);
  });
} else {
  console.log('❌ mpt_ai_chat_history: NOT FOUND');
}

const lastThreadId = localStorage.getItem('mpt_last_thread_id');
console.log(`\nmpt_last_thread_id: ${lastThreadId || 'NOT FOUND'}`);

// ✅ Check 2: Cosmos DB API
console.log('\n📍 2. COSMOS DB (via API):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const token = localStorage.getItem('mpt_token');
fetch('/api/chat/history', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    if (data.threads && data.threads.length > 0) {
      console.log(`✅ Found in Cosmos DB: ${data.threads.length} threads`);
      data.threads.forEach((thread, i) => {
        console.log(`  ${i + 1}. "${thread.title}" (${thread.messageCount} messages)`);
        console.log(`     ID: ${thread.id}`);
        console.log(`     Updated: ${new Date(thread.updatedAt).toLocaleString('id-ID')}`);
      });
    } else {
      console.log('❌ No threads found in Cosmos DB');
    }
  })
  .catch(err => console.error('❌ Error fetching from Cosmos DB:', err));

// ✅ Check 3: Summary
console.log('\n📍 3. SUMMARY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Data bisa berasal dari:');
console.log('1. 💾 localStorage → Data lama dari testing');
console.log('2. ☁️  Cosmos DB → Data disimpan di cloud');
console.log('3. Kombinasi keduanya');

console.log('\n🔧 UNTUK CLEAR HISTORY:');
console.log('localStorage.removeItem("mpt_ai_chat_history")');
console.log('localStorage.removeItem("mpt_last_thread_id")');
console.log('// Reload page setelah itu');
