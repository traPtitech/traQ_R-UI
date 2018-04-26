self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(function (clientsArr) {
      if (clientsArr.length > 0) {
        return clientsArr[0].focus().then(function (client) {
          const data = {
            type: 'navigate',
            to: event.notification.data.channel_path
          }
          return client.postMessage(data)
        })
      } else {
        return clients.openWindow(event.notification.data.click_action)
      }
    })
    )
})
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: '993645413001'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = payload.data.title || 'traQ'
  const notificationOptions = payload.data
  notificationOptions.data = payload.data

  return self.registration.showNotification(notificationTitle,
      notificationOptions)
})
