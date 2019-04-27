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

function isFile(data) {
  if (
    data['type'] === 'file' &&
    typeof data['id'] === 'string' &&
    typeof data['raw'] === 'string'
  ) {
    return true
  } else {
    return false
  }
}
function isMessage(data) {
  if (
    data['type'] === 'message' &&
    typeof data['id'] === 'string' &&
    typeof data['raw'] === 'string'
  ) {
    return true
  } else {
    return false
  }
}
function isStamp(data) {
  if (typeof data['id'] === 'string' && typeof data['raw'] === 'string') {
    return true
  }
  return false
}
function isVote(data) {
  if (
    data['type'] === 'vote' &&
    typeof data['raw'] === 'string' &&
    typeof data['title'] === 'string' &&
    Array.isArray(data['stamps']) &&
    data['stamps'].every(isStamp)
  ) {
    return true
  }
  return false
}

function isContent(text) {
  try {
    const data = JSON.parse(text)
    return isFile(data) || isMessage(data) || isVote(data)
  } catch (e) {
    return false
  }
}

export const detectFiles = text => {
  let startIndex = -1
  let isString = false
  let stack = []
  const ret = []
  for (let i = 0; i < text.length; i++) {
    if (stack.length > 0) {
      if (isString) {
        if (text[i] === '\\') {
          i++
        } else if (text[i] === '"') {
          isString = false
        }
      } else {
        if (text[i] === '"') {
          isString = true
        } else if (text[i] === '{' || text[i] === '[') {
          stack.push(text[i])
        } else if (text[i] === '}') {
          if (stack.pop() !== '{') {
            stack = []
            i = startIndex + 1
          }
          if (stack.length === 0) {
            if (isContent(text.substr(startIndex + 1, i - startIndex))) {
              ret.push(JSON.parse(text.substr(startIndex + 1, i - startIndex)))
            } else {
              i = startIndex + 1
            }
          }
        } else if (text[i] === ']') {
          if (stack.pop() !== '[') {
            stack = []
            i = startIndex + 1
          }
        }
      }
    } else {
      if (i < text.length - 1 && text[i] === '!' && text[i + 1] === '{') {
        startIndex = i
        i++
        stack.push('{')
        isString = false
      }
    }
  }
  return ret
}
