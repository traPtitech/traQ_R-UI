workbox.skipWaiting()
workbox.clientsClaim()

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

self.addEventListener('notificationclick', event => {
  console.log('Notificaton Click')

  event.notification.close()

  event.waitUntil(
    clients.openWindow(`https://traq-dev.tokyotech.org/channels/random`)
  )
})

self.addEventListener('fetch', event => {
  if (!navigator.onLine && event.request.url.match(/\/api\/1.0\/users\/me/)) {
    return event.respondWith(new Response(JSON.stringify({"userId":"d177f372-2d69-45ef-90fc-01bfc60c1148","name":"to-hutohu","displayName":"とーふ","iconFileId":"94e2a4f6-d863-49b6-860d-eebbf7c2abb8","bot":false,"twitterId":"to_hutohu","lastOnline":"2019-03-04T08:28:03.389130869Z","isOnline":true,"suspended":false,"accountStatus":1}), {headers:{'Content-Type': 'application/json'}}))
  }
})
