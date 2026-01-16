// MPT Command Center - Service Worker for PWA
// Supports offline access, caching, and push notifications
const CACHE_NAME = 'mpt-command-center-v3';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/mpt-logo.png',
  '/manifest.json',
  '/manifest.webmanifest',
  '/dashboard',
  '/journal',
  '/calculator',
  '/leaderboard',
];

// API routes to always keep fresh
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/dashboard',
  '/leaderboard',
  '/journal',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker for MPT Command Center...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching essential assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Some assets could not be cached:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  let notificationData = {
    title: 'MPT Command Center',
    body: 'Notifikasi dari MPT',
    icon: '/mpt-logo.png',
    badge: '/mpt-logo.png',
    tag: 'mpt-notification',
    requireInteraction: false,
  };

  try {
    const data = event.data.json();
    notificationData = {
      ...notificationData,
      title: data.title || notificationData.title,
      body: data.body || notificationData.body,
      icon: data.icon || notificationData.icon,
      badge: data.badge || notificationData.badge,
      tag: data.tag || notificationData.tag,
      data: data.data || {},
    };
  } catch (e) {
    notificationData.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Check if we have a window/tab open with target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome extensions and non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Check if this is a network-first route
  const isNetworkFirst = NETWORK_FIRST_ROUTES.some(route =>
    event.request.url.includes(route)
  );

  if (isNetworkFirst) {
    // Network first for API routes
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses (clone before using)
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache on network failure
          return caches.match(event.request);
        })
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response; // Return cached if exists
        }
        return fetch(event.request)
          .then((response) => {
            // Cache new assets (only if successful)
            if (response && response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return null;
          });
      })
    );
  }
});

// Background sync for trades (when back online)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-trades') {
    event.waitUntil(syncTrades());
  }
});

async function syncTrades() {
  // This will be called when connection is restored
  console.log('[SW] Syncing trades with server...');
  // Implementation would go here
}

// Push notification support
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'MPT Warrior',
    body: 'New trading update!',
    icon: '/mpt-logo.png',
    badge: '/mpt-logo.png',
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    tag: notificationData.data?.tag || 'mpt-warrior',
    requireInteraction: notificationData.data?.requireInteraction || false,
    data: notificationData.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/images/open-icon.png',
      },
      {
        action: 'close',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Determine URL based on notification type
  let url = '/dashboard';
  if (event.notification.data) {
    const { type } = event.notification.data;
    switch (type) {
      case 'trade':
        url = '/journal';
        break;
      case 'achievement':
        url = '/achievements';
        break;
      case 'risk':
        url = '/calculator';
        break;
      case 'mentor':
        url = '/ai-mentor';
        break;
      default:
        url = '/dashboard';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
