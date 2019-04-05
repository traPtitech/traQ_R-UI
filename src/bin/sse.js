let once = {}
let on = {}
let listeningEventList = {}
let source = null

if (process.env.NODE_ENV === 'development') {
  window.sseCheck = () => {
    console.log(source)
    return source
  }
}

const callFunction = (eventName, json) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('sse:' + eventName, json)
  }

  if (Array.isArray(on[eventName])) {
    on[eventName].forEach(fn => {
      fn(json)
    })
  }

  if (Array.isArray(once[eventName])) {
    once[eventName].forEach(fn => {
      fn(json)
    })
    once[eventName] = []
  }
}

const sse = {
  startListen(cb) {
    if (source) {
      source.close()
      source = null
    }
    source = new EventSource('/api/1.0/notification', {
      withCredentials: true
    })
    source.onopen = cb
    Object.keys(listeningEventList).forEach(eventName => {
      source.addEventListener(eventName, data => {
        const json = JSON.parse(data.data)
        callFunction(eventName, json)
      })
    })
  },
  stopListen() {
    source.close()
    source = null
    listeningEventList = {}
  },
  isListening() {
    console.log(source)
    return !!source && source.readyState < 2
  },
  on(eventName, cb) {
    if (!listeningEventList[eventName]) {
      source.addEventListener(eventName, data => {
        const json = JSON.parse(data.data)
        callFunction(eventName, json)
      })
      listeningEventList[eventName] = true
    }
    if (!Array.isArray(on[eventName])) {
      on[eventName] = []
    }
    on[eventName].push(cb)
  },
  onOnce(eventName, cb) {
    if (!listeningEventList[eventName]) {
      source.addEventListener(eventName, data => {
        const json = JSON.parse(data)
        callFunction(eventName, json)
      })
      listeningEventList[eventName] = true
    }
    if (!Array.isArray(on[eventName])) {
      once[eventName] = []
    }
    once[eventName].push(cb)
  },
  resetEventListener() {
    listeningEventList = {}
    once = {}
    on = {}
  }
}

export default sse
