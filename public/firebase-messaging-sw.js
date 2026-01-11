/**
 * Firebase Messaging Service Worker
 * Add this to your service worker to handle FCM messages
 */

// Import Firebase scripts (assuming they're loaded globally)
// In your HTML head, add:
// <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js"></script>

// Handle messages in service worker (background)
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
    const messageData = event.data.json();
    
    notificationData = {
      title: messageData.notification?.title || notificationData.title,
      body: messageData.notification?.body || notificationData.body,
      icon: messageData.notification?.image || notificationData.icon,
      badge: notificationData.badge,
      tag: messageData.notification?.tag || notificationData.tag,
      data: messageData.data || {},
    };
  } catch (e) {
    // Fallback untuk plain text
    notificationData.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      ...notificationData,
      actions: [
        {
          action: 'open',
          title: 'Buka',
          icon: '/mpt-logo.png',
        },
        {
          action: 'close',
          title: 'Tutup',
        },
      ],
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Try to find existing window
      for (let client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // If not found, open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[FCM-SW] Notification closed:', event.notification.tag);
});
