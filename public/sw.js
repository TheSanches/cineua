const CACHE_NAME = 'cineua-v2'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/manifest.json',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  // Не кешуємо API запити
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('tmdb.org')
  ) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
