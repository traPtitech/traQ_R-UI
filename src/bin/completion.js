
/*
 * @param {string} key - search key
 * @param {[string]} suggests - completion words
 * @param {number} num - completion limit
 */
export default function suggest (key, suggests, num) {
  return suggests.filter((e) => {
    if (num === 0) return false
    if (e.substr(0, key.length) === key) {
      num--
      return true
    }
    return false
  })
}
