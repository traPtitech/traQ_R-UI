import store from '@/store/index'

const newTag = (type, tag, content, attr, nesting, meta) => {
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
    meta: meta || null,
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
    } else if (data['type'] === 'group' && store.state.groupMap[data['id']]) {
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
  const attributes = []
  const meta = {type: data['type'], data: ''}
  if (data['type'] === 'user' && store.state.memberMap[data['id']]) {
    attributes.push(['href', `javascript:openUserModal('${data['id']}')`])
    meta.data = data['id']
    if (data['id'] === store.state.me.userId) {
      attributes.push(['class', 'message-user-link-highlight message-user-link'])
    } else {
      attributes.push(['class', 'message-user-link'])
    }
    return [
      newTag('traq_extends_link_open', 'a', '', attributes, 1, meta),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'a', '', null, -1)
    ]
  } else if (data['type'] === 'channel' && store.state.channelMap[data['id']]) {
    attributes.push(['href', `javascript:changeChannel('${store.getters.getChannelPathById(store.state.channelMap[data['id']].channelId)}')`])
    attributes.push(['class', 'message-channel-link'])
    meta.data = data['raw']
    return [
      newTag('traq_extends_link_open', 'a', '', attributes, 1),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_link_close', 'a', '', null, -1)
    ]
  } else if (data['type'] === 'group' && store.state.groupMap[data['id']]) {
    attributes.push(['href', `javascript:openGroupModal('${data['id']}')`])
    if (store.state.groupMap[data['id']].members.filter(userId => userId === store.state.me.userId).length > 0) {
      attributes.push(['class', 'message-group-link-highlight message-group-link'])
    } else {
      attributes.push(['class', 'message-group-link'])
    }
    meta.data = data['id']
    return [
      newTag('traq_extends_group_open', 'a', '', attributes, 1, meta),
      newTag('text', '', data['raw'], null, 0),
      newTag('traq_extends_group_close', 'a', '', null, -1)
    ]
  } else if (data['type'] === 'file') {
    meta.data = data['id']
    return [
      newTag('traq_extends_link_open', 'a', '', [['href', `${store.state.baseURL}/api/1.0/files/${data['id']}`], ['download', data['id']]], 1, meta),
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
  const jsonreg = /!({(?:[ \t\n]*"(?:[^\\"]|\\.)*"[ \t\n]*:[ \t\n]*"(?:[^\\"]|\\.)*",)*(?:[ \t\n]*"(?:[^\\"]|\\.)*"[ \t\n]*:[ \t\n]*"(?:[^\\"]|\\.)*")})/mg
  let parsed = 0
  const replaced = []
  for (let match = jsonreg.exec(text); match; match = jsonreg.exec(text)) {
    const matchStr = match['1']
    if (isJson(matchStr)) {
      if (parsed !== match.index) {
        replaced.push(newTag('text', '', text.substr(parsed, match.index - parsed), null, 0))
      }
      jsonParse(matchStr).forEach(e => {
        replaced.push(e)
      })
      parsed = match.index + matchStr.length + 1
    }
  }
  if (parsed !== text.length) {
    replaced.push(newTag('text', '', text.substr(parsed), null, 0))
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
