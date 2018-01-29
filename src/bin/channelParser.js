
/* ChannelParse
required json:
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
    children: [this type object],
    childrenIds: [UUID(string)],
    visibility: bool
  }
]
 */
export default function ChannelParse (channels) {
  let pool = {}
  let root
  channels.forEach(function (channel) {
    if(channel.parent === '') {
      root = channel.channelId
    }
  })
  channels.forEach(function (channel) {
    pool[channel.channelId] = {
      channelId: channel.channelId,
      name: channel.name,
      children: [],
      visibility: channel.visibility
    }
  })
  Object.keys(pool).forEach(function (id) {
    if(pool[id].parent === '') return
    pool[pool[id].parent].push(pool[id])
  })
  Object.keys(pool).forEach(function (id) {
    pool[pool[id].parent].children.sort(function (lhs, rhs) {
      if (lhs.name < rhs.name) return -1
      if (lhs.name > rhs.name) return 1
      return 0
    })
  })
  return pool[root].children
}
