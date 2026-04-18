/**
 * Service Worker Configuration
 * Enables offline support, caching strategies, and background sync
 */

// Cache names
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
];

// API endpoints to cache
const CACHEABLE_ENDPOINTS = [
  '/api/auth/user',
  '/api/doctors',
  '/api/specializations',
  '/api/appointments',
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - Cache first, fallback to network
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // HTML pages - Network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request));
});

/**
 * Cache first strategy
 * Useful for static assets
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    // Try cache first
    const cached = await cache.match(request);
    if (cached) {
      console.log('[Cache] Hit:', request.url);
      return cached;
    }

    // If not in cache, fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Cache] Error:', error);
    return new Response('Network unavailable', { status: 503 });
  }
}

/**
 * Network first strategy
 * Useful for API calls and dynamic content
 */
async function networkFirstStrategy(request) {
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      dynamicCache.put(request, response.clone());
      return response;
    }
    
    // If network fails, try cache
    const cached = await dynamicCache.match(request);
    return cached || createOfflineResponse();
  } catch (error) {
    console.log('[Cache] Network failed, using cache:', request.url);
    
    // Try to return cached response
    const cached = await dynamicCache.match(request);
    return cached || createOfflineResponse();
  }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  const ext = url.pathname.split('.').pop();
  return ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'woff', 'woff2'].includes(ext);
}

/**
 * Create offline response
 */
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      error: 'You are offline',
      message: 'Please check your internet connection'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
  );
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  console.log('[Service Worker] Syncing appointments...');
  // Implementation for syncing offline actions
}
