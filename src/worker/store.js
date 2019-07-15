const data = new Map([
  ['stampNameMap', []],
  ['memberData', []],
  ['memberMap', {}],
  ['channelMap', {}],
  ['groupMap', {}],
  ['me', {}],
  ['baseURL', '']
])

export const importStates = [...data.keys()]

export const update = (key, val) => {
  data.set(key, val)
}

export const initialize = states => {
  for (const [key, val] of states) {
    update(key, val)
  }
  initializeStatus.done = true
}

let initializeStatus
export const initializePromise = new Promise(resolve => {
  initializeStatus = new Proxy(
    {
      done: false
    },
    {
      set(target, prop, val) {
        if (prop === 'done' && val) {
          resolve()
        }
        return Reflect.set(...arguments)
      }
    }
  )
})

const get = key => {
  return data.get(key)
}

export const getStampFromName = name => {
  return get('stampNameMap')[name]
}

export const getUserByName = name => {
  return get('memberData').find(user => user.name === name) || null
}

export const getMember = id => {
  return get('memberMap')[id]
}

export const getChannel = id => {
  return get('channelMap')[id]
}

export const getGroup = id => {
  return get('groupMap')[id]
}

export const getChannelPath = id => {
  let current = getChannel(id)
  let path = current.name
  let next = getChannel(current.parent)
  while (next.name) {
    path = next.name + '/' + path
    current = next
    next = getChannel(current.parent)
  }
  return path
}

export const getMe = () => {
  return get('me')
}

export const getBaseURL = () => {
  return get('baseURL')
}
