
/*
 * @param {string} key - search key
 * @param {{string: [string]}} suggests - completion words
 * @param {Object} option - suggest option
 * option.limit = (3)
 * option.ignoreCaptal = (false)
 * option.multiKey = (false)
 * : use array in suggests
 */

function toLower (str) {
  if ('i'.toLowerCase() === 'i') {
    return str.toLowerCase()
  } else {
    return str.replace(/[A-Z]/g, function (char) {
      return String.fromCharCode(char.charCodeAt(0) | 32)
    })
  }
}

function isMatchWord (key, word, forceLower) {
  if (forceLower) {
    return toLower(key) === toLower(word.substr(0, key.length))
  } else {
    return key === word.substr(0, key.length)
  }
}

function isMatchWords (key, words, forceLower) {
  let ret = false
  words.forEach(function (e) {
    if (isMatchWord(key, e, forceLower)) {
      ret = true
    }
  })
  return ret
}

const LIMIT = 10
const IGNORE_CAPITAL = false
const MULTI_KEY = false

export default function suggest (key, suggests, option) {
  if (!option) {
    option = {
      limit: LIMIT,
      ignoreCaptal: IGNORE_CAPITAL,
      multiKey: MULTI_KEY
    }
  }
  if (option.limit === undefined) {
    option.limit = LIMIT
  }
  if (option.ignoreCaptal === undefined) {
    option.ignoreCaptal = IGNORE_CAPITAL
  }
  if (option.multiKey === undefined) {
    option.multiKey = MULTI_KEY
  }
  return Object.keys(suggests).filter(function (e) {
    if (option.limit === 0) return false
    if (option.multiKey) {
      let ret = isMatchWords(key, suggests[e], option.ignoreCaptal)
      ret |= isMatchWord(key, e, option.ignoreCaptal)
      if (ret) option.limit--
      return ret
    } else {
      let ret = isMatchWord(key, e, option.ignoreCaptal)
      if (ret) option.limit--
      return ret
    }
  })
}
