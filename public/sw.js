/* eslint-disable */
workbox.core.skipWaiting()
workbox.core.clientsClaim()

workbox.precaching.precacheAndRoute(self.__precacheManifest)

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/index.html"),
  {
    whitelist: [new RegExp("/channels/"), new RegExp("/users/")],
    blacklist: [new RegExp("/pipeline"), new RegExp("/api/")]
  }
)

// ファイルAPIのキャッシュ設定
workbox.routing.registerRoute(
  new RegExp('/api/1\\.0/files/[0-9a-fA-F-]{36}$'),
  new workbox.strategies.CacheFirst({
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
  new workbox.strategies.CacheFirst({
    cacheName: 'thumbnail-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

const openDB = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('traQ-DB', 1)
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
        if (me === null) {
          return new Response(JSON.stringify(me), {
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          return new Response('', { status: 403 })
        }
      })
    }
  }
  return
})

self.addEventListener('push', async event => {
  const payload = event.data.json()
  const channelID = payload.data.tag.slice('c:'.length)

  await fetch(`/api/1.0/channels/${channelID}/messages?limit=20&offset=0`)
    .then(res => res.json())
    .then(data => {
      return new Promise((resolve, reject) => {
        openDB().then(db => {
          console.log(db)
          const transaction = db.transaction('channelMessages', 'readwrite')
          const store = transaction.objectStore('channelMessages')
          const req = store.put({
            channelId: channelID,
            data: data.reverse()
          })

          req.onsuccess = resolve
          req.onerror = reject
        })
      })
    })
    .catch(console.error)
})

const showNotification = data => {
  // Customize notification here
  const title = data.title
  const notificationTitle = title || 'traQ'
  const notificationOptions = data
  notificationOptions.data = data
  notificationOptions.renotify = true
  notificationOptions.badge = '/static/badge.png'
  if (title && !['#general', '#random'].includes(title)) {
    const verb = title.includes('#') ? '投稿' : '返信'
    notificationOptions.actions = [
      {
        action: 'reply',
        type: 'text',
        title: '返信',
        placeholder: `${title}へ${verb}する...`
      }
    ]
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  ).catch(err => {
    console.error('[sw] showNotification error:', err)
  })
}

const delay = () => new Promise(resolve => setTimeout(resolve, 0))

self.addEventListener('notificationclick', event => {
  if (event.reply) {
    const data = event.notification.data
    const channelID = data.tag.slice('c:'.length)
    // https://crbug.com/1050352#c5
    // androidでしか通知の再度の発火は発生しない模様
    event.waitUntil(
      Promise.all([getMeData(), fetch(`/api/1.0/channels/${channelID}/messages?embed=1`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: event.reply
        })
      })]).then(([{ data: me }]) => {
        event.notification.close()
        data.body = `${me.displayName}: ${event.reply}`
        data.icon = `/api/1.0/public/icon/${me.name}`
        data.silent = true
        return showNotification(data)
      }, err => {
        console.error('[sw] sendReply error:', err)
        return showNotification(data).then(delay).then(() => {
          return self.registration.getNotifications({ tag: data.tag })
        }).then(
          notifications => notifications.forEach(notification => notification.close())
        )
      })
    )
    return
  }
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientsArr => {
        if (clientsArr.length > 0) {
          return clientsArr[0].focus().then(function (client) {
            const data = {
              type: 'navigate',
              to: event.notification.data.path
            }
            return client.postMessage(data)
          })
        } else {
          return clients.openWindow(event.notification.data.path)
        }
      })
  )
})
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyDee_VkrRtByJCrCZAX3nTSDPl8AaHlWfY',
  projectId: 'traq-r',
  appId: '1:993645413001:web:b253ea3776d6cf85163c58',
  messagingSenderId: '993645413001'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(async payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )

  // Customize notification here
  return showNotification(payload.data)
})
