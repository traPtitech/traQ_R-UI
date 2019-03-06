workbox.skipWaiting()
workbox.clientsClaim()
workbox.routing.registerNavigationRoute(
  '/index.html', {
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
          return new Response(JSON.stringify(me), {headers:{'Content-Type': 'application/json'}})
        } else {
          return new Response('', {status: 403})
        }
      })
    }
  }
  return
})

self.addEventListener('push', async event => {
  const payload = event.data.json()
  const channelID = payload.data.tag.substr(2)

  if (payload.data.path.startsWith('/channels')) {
    await fetch(`/api/1.0/channels/${channelID}/messages?limit=20&offset=0`).then(res => res.json())
      .then(data => {
        return new Promise((resolve, reject) => {
          openDB().then(db => {
            console.log(db)
            const transaction = db.transaction('channelMessages', 'readwrite')
            const store = transaction.objectStore('channelMessages')
            const req = store.put({channelId: channelID, data: data.reverse()})

            req.onsuccess = resolve
            req.onerror = reject
          })
        })
      })
      .catch(console.error)
  } else {
    await fetch(`/api/1.0/users/${channelID}/messages?limit=20&offset=0`).then(res => res.json())
      .then(data => {
        return new Promise((resolve, reject) => {
          openDB().then(db => {
            const transaction = db.transaction('channelMessages', 'readwrite')
            const store = transaction.objectStore('channelMessages')
            const req = store.put({channelId: channelID, data: data.reverse()})

            req.onsuccess = resolve
            req.onerror = reject
          })
        })
      })
      .catch(console.error)
  }
})

