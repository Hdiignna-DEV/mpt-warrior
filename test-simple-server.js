// test-simple-server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, message: 'Server is working' }));
});

server.listen(3000, '0.0.0.0', () => {
  console.log('✓ Simple server listening on http://localhost:3000');
  console.log('✓ Try: curl http://localhost:3000');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
