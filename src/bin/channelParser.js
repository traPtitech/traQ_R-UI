
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
function ChannelParse (json) {
  let channels = JSON.parse(json)
  let pool = {}
  channels.forEach(function (channel) {
    pool[channel.channelId] = {
      channelId: channel.channelId,
      name: channel.name,
      children: [],
      childrenIds: channel.children,
      visibility: channel.visibility
    }
  })
  function gatherChildren (channel) {
    channel.childrenIds.forEach(function (id) {
      let child = pool[id]
      delete(pool[id])
      gatherChildren(child)
      channel.children.push(child)
    })
  }
  Object.keys(pool).forEach(function (key) {
    if (pool[key]) gatherChildren(pool[key])
  })
  let ret = []
  Object.keys(pool).forEach(function (key) {
    ret.push(pool[key])
  })
  ret.sort(function (lhs, rhs) {
    if (lhs.name < rhs.name) return -1
    if (lhs.name > rhs.name) return 1
    return 0
  })
  return ret
}
