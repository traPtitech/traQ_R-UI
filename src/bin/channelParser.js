function dfs(channel, root) {
  channel.channelName = root + channel.name
  channel.children.forEach(function(elem) {
    dfs(elem, channel.channelName + '/')
  })
}

/* ChannelParse
required data:
[
  {
    "channelId": UUID(string),
    "name": string,
    "parent": UUID(string),
    "children": [
      UUID(string)
    ],
    "visibility": bool
  }
]
output:
sorted array
[
  {
    channelId: UUID(string)
    name: string,
    channelName: string,
    children: [this type object],
    childrenIds: [UUID(string)],
    visibility: bool
  }
]
 */
export default function ChannelParse(channels) {
  let pool = {}
  let root = ''
  channels.forEach(function(channel) {
    pool[channel.channelId] = {
      channelId: channel.channelId,
      name: channel.name,
      channelName: channel.name,
      children: [],
      visibility: channel.visibility,
      parent: channel.parent
    }
  })
  Object.keys(pool).forEach(function(id) {
    if (pool[id].channelId === '') return
    pool[pool[id].parent].children.push(pool[id])
  })
  Object.keys(pool).forEach(function(id) {
    pool[pool[id].parent].children.sort(function(lhs, rhs) {
      if (lhs.name < rhs.name) return -1
      if (lhs.name > rhs.name) return 1
      return 0
    })
  })
  pool[root].children.forEach(function(elem) {
    dfs(elem, '')
  })
  return pool[root].children
}
