importScripts('/static/workbox-sw.prod.v2.1.3.js')

const workboxSW = new WorkboxSW({
  cacheId: 'traQ',
  skipWaiting: true
})
workboxSW.precache([])
