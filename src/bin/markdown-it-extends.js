import store from '@/store/index'

const newTag = (type, tag, content, attr, nesting) => {
  return {
    attrs: attr,
    block: false,
    children: null,
    content: content,
    hidden: false,
    info: '',
    level: 0,
    map: null,
    markup: '',
    meta: null,
    nesting: nesting,
    tag: tag,
    type: type
  }
}

const isJson = (text) => {
  try {
    const data = JSON.parse(text)
    if (typeof data['type'] !== 'string' || typeof data['raw'] !== 'string' || typeof data['id'] !== 'string') {
      return false
    }
    if (data['type'] === 'user' && store.state.memberMap[data['id']]) {
      return true
    } else if (data['type'] === 'channel' && store.state.channelMap[data['id']]) {
      return true
    } else if (data['type'] === 'tag' && store.state.tagMap[data['id']]) {
      return true
    } else if (data['type'] === 'file' || data['type'] === 'message') {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

const jsonParse = (text) => {
//  console.log('json parse: ' + text)
  const data = JSON.parse(text)
  if (data['type'] === 'user' && store.state.memberMap[data['id']]) {
    return [
      newTag('traq_extends_link_open', 'router-link', '', [['to', `/users/${store.state.memberMap[data['id']].name}`]], 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'router-link', '', null, -1)
    ]
  } else if (data['type'] === 'channel' && store.state.channelMap[data['id']]) {
    return [
      newTag('traq_extends_link_open', 'router-link', '', [['to', `/channels/${store.getters.getChannelPathById(store.state.channelMap[data['id']].channelId)}`]], 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'router-link', '', null, -1)
    ]
  } else if (data['type'] === 'tag' && store.state.tagMap[data['id']]) {
    return [
      newTag('traq_extends_link_open', 'router-link', '', [['to', `/tags/${data['id']}`]], 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'router-link', '', null, -1)
    ]
  } else if (data['type'] === 'file') {
    return [
      newTag('traq_extends_link_open', 'a', '', [['href', `${store.state.baseURL}/api/1.0/files/${data['id']}`], ['download', data['id']]], 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'a', '', null, -1)
    ]
  } else {
    return [
      newTag('traq_extends_plain_text', 'p', '', [], 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_plain_text', 'p', '', null, -1)
    ]
  }
}

const replacer = (token) => {
  const text = token.content
  let replaced = []
  let isInside = false
  let startIndex = -1
  let isString = false
  let parsed = 0
  for (let i = 0; i < text.length; i++) {
    if (isInside) {
      if (text[i] === '"') {
        isString ^= true
      } else if (!isString && text[i] === '}') {
        isInside = false
        if (isJson(text.substr(startIndex + 1, i - startIndex))) {
          if (parsed !== startIndex) {
            replaced.push(newTag('text', '', text.substr(parsed, startIndex - parsed), null, 0))
          }
          replaced = replaced.concat(jsonParse(text.substr(startIndex + 1, i - startIndex)))
          parsed = i + 1
        } else {
          i = startIndex + 1
        }
      }
    } else {
      if (i < text.length - 1 && text[i] === '!' && text[i + 1] === '{') {
        startIndex = i
        i++
        isInside = true
        isString = false
      }
    }
  }
  if (parsed < text.length) {
    replaced.push(newTag('text', '', text.substr(parsed), [], 0))
  }
  return replaced
}

export default function messageExtendsPlugin (md) {
  md.core.ruler.push('messageExtends', (state) => {
    state.tokens.forEach(token => {
      if (token.type === 'inline') {
        for (let i = 0; i < token.children.length; i++) {
          if (token.children[i].type === 'text') {
            const objects = replacer(token.children[i])
            if (objects.length > 1) {
              token.children = token.children.slice(0, i).concat(objects).concat(token.children.slice(i + 1))
              i += objects.length - 1
            }
          }
        }
      }
    })
  })
}
