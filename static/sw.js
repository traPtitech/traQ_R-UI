workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  new RegExp('https://traq-dev.tokyotech.org/api/1.0/files'),
  workbox.strategies.staleWhileRevalidate()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)

self.addEventListener('notificationclick', event => {
  console.log('Notificaton Click')

  event.notification.close()

  event.waitUntil(
    clients.openWindow(`${event.data.origin}/${event.data.channel_path}`)
  )
})
