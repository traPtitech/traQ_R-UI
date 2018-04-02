// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: '179667783849'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  new RegExp('https://traq-dev.tokyotech.org/api/1.0/files'),
  workbox.strategies.staleWhileRevalidate()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest)
