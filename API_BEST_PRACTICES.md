# MPT Warrior - API Rate Limiting & Best Practices

## Rate Limiting

### Current Limits

```
General API:      100 requests per minute per IP
Chat API:         20 requests per minute per user
Calendar API:     50 requests per minute per IP
```

### Response Headers

```
X-RateLimit-Limit:       100
X-RateLimit-Remaining:   95
X-RateLimit-Reset:       1234567890
Retry-After:             30
```

## API Authentication

### Implementation

```typescript
// Example: Add API key to request
const headers = {
  'Authorization': 'Bearer your_api_key',
  'Content-Type': 'application/json',
};

fetch('/api/trades', {
  method: 'GET',
  headers,
});
```

## Error Handling

### Standard Error Responses

```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-01-01T00:00:00Z",
  "details": {}
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Data conflict |
| RATE_LIMIT | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily down |

## Retry Strategy

### Recommended

```typescript
// Exponential backoff with jitter
const maxRetries = 3;
const baseDelay = 1000; // 1 second

for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    const response = await fetch('/api/data');
    if (response.ok) return response.json();
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      await sleep(parseInt(retryAfter || baseDelay.toString()));
    }
  } catch (error) {
    if (attempt < maxRetries) {
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await sleep(delay);
    }
  }
}
```

## Pagination

### Query Parameters

```
GET /api/trades?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

### Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2026-01-01T00:00:00Z"
}
```

## Caching

### Client-Side Caching

```typescript
// Use HTTP cache headers
Cache-Control: public, max-age=3600
ETag: "33a64df551"
Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
```

### Server-Side Caching

- API responses cached for 1 hour
- Dashboard data cached for 5 minutes
- User-specific data not cached

## Webhooks (Future)

### Event Types

- trade.created
- trade.closed
- achievement.unlocked
- journal.created

### Retry Logic

Failed webhook deliveries retry:
- Attempt 1: Immediate
- Attempt 2: 5 minutes
- Attempt 3: 30 minutes
- Attempt 4: 2 hours
- Attempt 5: 24 hours

### Verification

```typescript
// HMAC SHA256 signature
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(event))
  .digest('hex');

// Header: X-Signature-SHA256: {signature}
```

## Performance

### Target Metrics

| Metric | Target |
|--------|--------|
| API Response Time | < 500ms |
| Page Load Time | < 3s |
| Time to Interactive | < 5s |
| Largest Contentful Paint | < 2.5s |

### Optimization Tips

1. Use request compression (gzip)
2. Minimize payload size
3. Implement pagination
4. Cache frequently accessed data
5. Use CDN for static assets

## Monitoring

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T00:00:00Z",
  "database": "connected",
  "cache": "operational"
}
```

### Metrics

- Request rate
- Error rate
- Response time distribution
- Database performance
- Cache hit rate

---

**Last Updated**: January 2026
