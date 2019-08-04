export const encodeByte = byte => {
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let rank = 0
  while (byte >= 1000) {
    byte /= 1000
    rank++
  }
  const nums = byte.toPrecision(4).split('.')
  if (nums.length > 1) {
    return nums[0] + '.' + nums[1][0] + suffixes[rank]
  } else {
    return nums[0] + suffixes[rank]
  }
}

export const displayDateTime = (createdAt, updatedAt) => {
  const d = new Date(createdAt)
  if (createdAt === updatedAt) {
    return (
      d
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      d
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      d
        .getSeconds()
        .toString()
        .padStart(2, '0')
    )
  } else {
    const u = new Date(updatedAt)
    let result =
      u
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      u
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      u
        .getSeconds()
        .toString()
        .padStart(2, '0')
    if (d.getDate() !== u.getDate() || d.getMonth() !== u.getMonth()) {
      result =
        (u.getMonth() + 1).toString().padStart(2, '0') +
        '/' +
        u
          .getDate()
          .toString()
          .padStart(2, '0') +
        ' ' +
        result
    }
    if (d.getFullYear() !== u.getFullYear()) {
      result = u.getFullYear().toString() + '/' + result
    }
    return result
  }
}

export const isGif = mime => {
  return mime.split('/')[0] === 'image' && mime.split('/')[1] === 'gif'
}

export const isSvg = mime => {
  return mime.split('/')[0] === 'image' && mime.split('/')[1] === 'svg+xml'
}

export const isImage = mime => {
  return mime.split('/')[0] === 'image'
}

export const isVideo = mime => {
  return mime.split('/')[0] === 'video'
}

export const isAudio = mime => {
  return mime.split('/')[0] === 'audio'
}

function isFile(text) {
  try {
    const data = JSON.parse(text)
    if (
      data['type'] === 'file' &&
      typeof data['id'] === 'string' &&
      typeof data['raw'] === 'string'
    ) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function isMessage(text) {
  try {
    const data = JSON.parse(text)
    if (
      data['type'] === 'message' &&
      typeof data['id'] === 'string' &&
      typeof data['raw'] === 'string'
    ) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function isMention(text) {
  try {
    const data = JSON.parse(text)
    if (
      data['type'] === 'user' &&
      typeof data['id'] === 'string' &&
      typeof data['raw'] === 'string'
    ) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function makeDetecter(f) {
  return text => {
    let isInside = false
    let startIndex = -1
    let isString = false
    const ret = []
    for (let i = 0; i < text.length; i++) {
      if (isInside) {
        if (text[i] === '"') {
          isString ^= true
        } else if (!isString && text[i] === '}') {
          isInside = false
          if (f(text.substr(startIndex + 1, i - startIndex))) {
            ret.push(JSON.parse(text.substr(startIndex + 1, i - startIndex)))
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
    return ret
  }
}

export const detectFiles = makeDetecter(text => isFile(text) || isMessage(text))

export const detectMentions = makeDetecter(text => isMention(text))

export const isMac = () => {
  return window.navigator.platform.includes('Mac')
}

export const withModifierKey = keyEvent => {
  return (
    keyEvent.shiftKey || keyEvent.altKey || keyEvent.ctrlKey || keyEvent.metaKey
  )
}
export const isModifierKey = keyEvent => {
  return ['Shift', 'Alt', 'Control', 'Meta'].includes(keyEvent.key)
}
export const isSendKeyInput = (inputEvent, messageSendKey) => {
  // modifierが押されているときはisBRKey()を利用してpreventされる
  return (
    messageSendKey === 'none' &&
    inputEvent.inputType === 'insertLineBreak' &&
    !isTouchDevice()
  )
}
export const isBRKey = (keyEvent, messageSendKey) => {
  return (
    messageSendKey === 'none' &&
    keyEvent.key === 'Enter' &&
    withModifierKey(keyEvent)
  )
}

// https://github.com/ianstormtaylor/slate/blob/7377266b43451c4be44a1442aa1076ef3d13227e/packages/slate-dev-environment/src/index.js#L74-L79
export const checkLevel2InputEventsSupport = () => {
  const element = document.createElement('div')
  element.contentEditable = true
  return 'onbeforeinput' in element
}

export const isTouchDevice = () => {
  const userAgent = navigator.userAgent
  return (
    userAgent.includes('traQ-Android') ||
    userAgent.includes('traQ-iOS') ||
    userAgent.includes('iPhone') ||
    userAgent.includes('iPod') ||
    userAgent.includes('iPad') ||
    userAgent.includes('Android')
  )
}

export const changeHash = hash => {
  let path = window.location.pathname
  if (hash !== '') {
    path += `#${hash}`
  }
  history.pushState('', document.title, path)
}

export const caseIntensiveIncludes = (a, b) => {
  return a.toLowerCase().includes(b.toLowerCase())
}

export const caseIntensiveEquals = (a, b) => {
  return a.toLowerCase() === b.toLowerCase()
}

export class Trie {
  constructor() {
    this.children = {}
    this.base = ''
    this.size = 0
    this.fork = 0
    this.next = ''
  }
  update(s, i) {
    this.size++
    if (s.length === i) {
      this.fork++
      this.base = s
      return
    }
    let c = s[i].toLowerCase()
    this.next = c
    if (!this.children[c]) {
      this.fork++
      this.children[c] = new Trie()
    }
    this.children[c].update(s, i + 1)
  }
  // query(s, 0, '')
  // sを接頭辞に持つ文字列が存在しない -> s
  // sを接頭辞に持つ文字列が一意に定まる -> 一意に定まる元の文字列
  // _ -> sを接頭辞に持つ文字列の最大共通接頭辞
  query(s, i, acc) {
    if (!acc) {
      acc = ''
    }
    if (s.length === i) {
      if (this.size === 1) {
        if (this.base !== '') {
          return this.base + ' '
        } else {
          return this.children[this.next].query(s, i, acc)
        }
      }
      if (this.fork > 1) {
        return acc
      } else {
        return this.children[this.next].query(s, i, acc + this.next)
      }
    }
    let c = s[i].toLowerCase()
    if (!this.children[c]) {
      return s
    }
    return this.children[c].query(s, i + 1, acc + c)
  }
}
