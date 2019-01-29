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
