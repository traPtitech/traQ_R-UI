import store from '@/store'
import stampAltNameTable from '@/bin/emoji_altname_table.json'

const match = (word, key) => {
  return word.substr(0, key.length).toLowerCase() === key
}

export default function(key, limit) {
  if (key.type === '#') {
    return store.state.channelData
      .filter(channel => !channel.member)
      .filter(
        channel =>
          channel.name !== '' &&
          (match(
            store.getters.getChannelPathById(channel.channelId),
            key.keyword
          ) ||
            match(channel.name, key.keyword))
      )
      .slice(0, limit)
      .map(channel => {
        return {
          replace: store.getters.getChannelPathById(channel.channelId),
          start: '#',
          suffix: ' ',
          html: `#${store.getters.getChannelPathById(channel.channelId)} `
        }
      })
  } else if (key.type === '@') {
    return store.getters.memberData
      .filter(user => !/#/.test(user.name))
      .filter(user => match(user.name, key.keyword))
      .slice(0, limit)
      .map(user => {
        return {
          replace: user.name,
          start: '@',
          suffix: ' ',
          html: `@${user.name} `
        }
      })
  } else if (key.type === ':') {
    let unicodeMatchName = []
    // Array.fromならサロゲートペアが考慮される
    if (Array.from(key.keyword).length === 1) {
      unicodeMatchName = stampAltNameTable
        .filter(stamp => stamp.code === key.keyword.codePointAt(0).toString(16))
        .map(stamp => stamp.name)
    }

    const stampAltNames = stampAltNameTable
      .filter(stamp => stamp.altName && match(stamp.altName, key.keyword))
      .map(stamp => stamp.name)

    return store.state.stampData
      .filter(
        stamp =>
          match(stamp.name, key.keyword) ||
          stampAltNames.includes(key.keyword) ||
          unicodeMatchName.includes(stamp.name)
      )
      .slice(0, limit)
      .map(stamp => {
        return {
          replace: stamp.name,
          start: ':',
          suffix: ': ',
          html: `<i class="emoji s16" title=":${
            stamp.name
          }:" style="background-image: url(${
            store.state.baseURL
          }/api/1.0/files/${stamp.fileId});">:${stamp.name}:</i>:${
            stamp.name
          }: `
        }
      })
  }
  return []
}
