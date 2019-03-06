workbox.skipWaiting()
workbox.clientsClaim()
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('/index.html'), {
    whitelist: [
      new RegExp('/channels/'),
      new RegExp('/users/')
    ],
    blacklist: [
      new RegExp('/pipeline')
    ]
  }
)

// ファイルAPIのキャッシュ設定
workbox.routing.registerRoute(
  new RegExp('/api/1\\.0/files/[0-9a-fA-F-]{36}$'),
  workbox.strategies.cacheFirst({
    cacheName: 'files-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
        headers: {
          'X-TRAQ-FILE-CACHE': 'true'
        }
      })
    ]
  })
)
workbox.routing.registerRoute(
  new RegExp('/api/1\\.0/files/[0-9a-fA-F-]{36}/thumbnail$'),
  workbox.strategies.cacheFirst({
    cacheName: 'thumbnail-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)

const openDB = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('traQ-R', 1)
    req.onsuccess = event => {
      resolve(req.result)
    }

    req.onerror = reject
  })
}

const getMeData = () => {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('generalData', 'readonly')
      const store = transaction.objectStore('generalData')
      const req = store.get('me')
      req.onsuccess = () => resolve(req.result)
      req.onerror = reject
    })
  })
}

self.addEventListener('fetch', event => {
  if (!navigator.onLine) {
    if (event.request.url.match(/\/api\/1.0\/users\/me/)) {
      return event.respondWith(async () => {
        const me = getMeData()
        new Response(JSON.stringify(me), {headers:{'Content-Type': 'application/json'}})
      })
    }
  }
  return
})
