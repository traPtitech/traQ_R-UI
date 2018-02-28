const once = {}
const on = {}
let listeningEventList = {}
let source = null

const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://traq-dev.herokuapp.com'
  : ''

const callFunction = (eventName, json) => {
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
  startListen () {
    source = new EventSource(baseURL + '/api/1.0/notification', {withCredentials: true})
  },
  stopListen () {
    source.close()
    source = null
    listeningEventList = {}
  },
  isListening () {
    return !!source
  },
  on (eventName, cb) {
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
  onOnce (eventName, cb) {
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
  }
}

export default sse
