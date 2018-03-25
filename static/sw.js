workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  new RegExp('https://traq-dev.trapti.tech/api/1.0/files'),
  workbox.strategies.staleWhileRevalidate()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)
