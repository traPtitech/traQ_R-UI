import axios from '@/bin/axios'
// import store from '@/store/index'

const middleWare = process.env.NODE_ENV === 'development'
  ? (name, fn) => {
    return fn().then(res => { console.info(name, res); return Promise.resolve(res) }).catch(err => { console.error(name, err); return Promise.reject(err) })
  }
  : (name, fn) => {
    return fn().catch(err => { console.error(name, err); return Promise.resolve(err) })
  }
const client = {
  // Tag: authorization
  login (name, pass) {
    return middleWare('login', () => {
      return axios.post(`/login`, {name, pass})
    })
  },
  logout () {
    return middleWare('logout', () => {
      return axios.post(`/logout`)
    })
  },

  // Tag: channel
  makeChannel (type, member, name, parent) {
    return middleWare('makeChannel', () => {
      return axios.post(`/api/1.0/channels`,
        {type, member, name, parent}
      )
    })
  },
  getChannels () {
    return middleWare('getChannels', () => {
      return axios.get(`/api/1.0/channels`)
    })
  },
  getChannelInfo (channelId) {
    return middleWare('getChannelInfo', () => {
      return axios.get(`/api/1.0/channels/${channelId}`)
    })
  },
  changeChannelName (channelId, name) {
    return middleWare('changeChannelName', () => {
      return axios.put(`/api/1.0/channels/${channelId}`, {name})
    })
  },
  deleteChannel (channelId) {
    return middleWare('changeChannelName', () => {
      return axios.delete(`/api/1.0/channels/${channelId}`)
    })
  },

  // Tag: topic
  getChannelTopic (channelId) {
    return middleWare('getChannelTopic', () => {
      return axios.get(`/api/1.0/channels/${channelId}`)
    })
  },
  channgeChannelTopic (channelId, text) {
    return middleWare('changeChannelTopic', () => {
      return axios.put(`/api/1.0/channels/${channelId}`, {text})
    })
  },

  // Tag: message
  loadMessages (channelId, limit, offset) {
    return middleWare('loadMessages', () => {
      return axios.get(`/api/1.0/channels/${channelId}/messages`,
        {
          params: {
            limit: limit,
            offset: offset
          }
        }
      )
    })
  },
  postMessage (channelId, text) {
    return middleWare('postMessage', () => {
      return axios.post(`/api/1.0/channels/${channelId}/messages`, {text})
    })
  },
  editMessage (messageId, text) {
    return middleWare('editMessage', () => {
      return axios.put(`/api/1.0/messages/${messageId}`, {text})
    })
  },
  getMessage (messageId) {
    return middleWare('getMessage', () => {
      return axios.get(`/api/1.0/messages/${messageId}`)
    })
  },
  deleteMessage (messageId) {
    return middleWare('deleteMessage', () => {
      return axios.delete(`/api/1.0/messages/${messageId}`)
    })
  },

  // Tag: pin
  getPinnedMessages (channelId) {
    return middleWare('getPinnedMessages', () => {
      return axios.get(`/api/1.0/channels/${channelId}/pin`)
    })
  },
  pinMessage (channelId, messageId) {
    return middleWare('pinMessage', () => {
      return axios.post(`/api/1.0/channels/${channelId}/pin`, {messageId})
    })
  },
  getPinnedMessage (pinId) {
    return middleWare('getPinnedMessage', () => {
      return axios.get(`/api/1.0/pin/${pinId}`)
    })
  },
  unpinMessage (pinId) {
    return middleWare('unpinMessage', () => {
      return axios.delete(`/api/1.0/pin/${pinId}`)
    })
  },

  // Tag: notification
  getNotifications (channelId) {
    return middleWare('getNotifications', () => {
      return axios.get(`/api/1.0/channels/${channelId}/notifications`)
    })
  },
  changeNotifications (channelId, state) {
    return middleWare('changeNotifications', () => {
      return axios.put(`/api/1.0/channels/${channelId}/notifications`, state)
    })
  },
  registerDevice (token) {
    return middleWare('registerDevice', () => {
      return axios.post(`/api/1.0/notification/device`, {token})
    })
  },

  // Tag: user
  getMembers () {
    return middleWare('getMembers', () => {
      return axios.get(`/api/1.0/users`)
    })
  },
  whoAmI () {
    return middleWare('whoAmI', () => {
      return axios.get(`/api/1.0/users/me`)
    })
  },
  getUserDetail (userId) {
    return middleWare('getUserDetail', () => {
      return axios.get(`/api/1.0/users/${userId}`)
    })
  },

  // Tag: clip
  getClipedMessages () {
    return middleWare('getClipMessages', () => {
      return axios.get(`/api/1.0/users/me/clips`)
    })
  },
  clipMessage (messageId) {
    return middleWare('clipMessage', () => {
      return axios.post(`/api/1.0/users/me/clips`, {messageId})
    })
  },
  unclipMessage (messageId) {
    return middleWare('unclipMessage', () => {
      return axios.delete(`/api/1.0/users/me/clips`, {data: {messageId}})
    })
  },

  // Tag: star
  getStaredChannels () {
    return middleWare('getStaredChannels', () => {
      return axios.get(`/api/1.0/users/me/stars`)
    })
  },
  starChannel (channelId) {
    return middleWare('starChannel', () => {
      return axios.post(`/api/1.0/users/me/stars`, {channelId})
    })
  },
  unstarChannel (channelId) {
    return middleWare('unstarChannel', () => {
      return axios.delete(`/api/1.0/users/me/stars`, {channelId})
    })
  },

  // Tag: visibility
  getChannelVisibility () {
    return middleWare('getChannelVisibility', () => {
      return axios.get(`/api/1.0/users/me/channels/visibiliy`)
    })
  },
  changeChannelVisibility (state) {
    return middleWare('changeChannelVisibility', () => {
      return axios.put(`/api/1.0/users/me/channels/visibiliy`, state)
    })
  },

  // Tag: unread
  getUnreadMessages () {
    return middleWare('getUnreadMessages', () => {
      return axios.get(`/api/1.0/users/me/unread`)
    })
  },
  readMessages (messageIds) {
    return middleWare('readMessages', () => {
      return axios.delete(`/api/1.0/users/me/unread`, messageIds)
    })
  },

  // Tag: userTag
  getUserTags (userId) {
    return middleWare('getUserTag', () => {
      return axios.get(`/api/1.0/users/${userId}/tags`)
    })
  },
  addUserTag (userId, tag) {
    return middleWare('addUserTag', () => {
      return axios.post(`/api/1.0/users/${userId}/tags`, {tag})
    })
  },
  changeLockUserTag (userId, tagId, isLocked) {
    return middleWare('changeLockUserTag', () => {
      return axios.put(`/api/1.0/users/${userId}/tags/${tagId}`, {isLocked})
    })
  },
  deleteUserTag (userId, tagId) {
    return middleWare('changeLockUserTag', () => {
      return axios.delete(`/api/1.0/users/${userId}/tags/${tagId}`)
    })
  },

  // Tag: stamp
  getStamps () {
    return middleWare('getStamps', () => {
      return axios.get(`/api/1.0/stamps`)
    })
  },
  addStamp () {
    Promise.reject(console.error(`not implement`))
  },
  deleteStamp (stampId) {
    return middleWare('deleteStamp', () => {
      return axios.delete(`/api/1.0/stamps/${stampId}`)
    })
  },
  getMessageStamp (messageId, stampId) {
    return middleWare('getMessageStamp', () => {
      return axios.get(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
    })
  },
  stampMessage (messageId, stampId) {
    return middleWare('unstampMessage', () => {
      return axios.delete(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
    })
  },
  unstampMessage (messageId, stampId) {
    return middleWare('stampMessage', () => {
      return axios.post(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
    })
  },

  // Tag: file
  uploadFile (file) {
    return middleWare('uploadFile', () => {
      const form = new FormData()
      form.enctype = 'multipart/form-data'
      form.append('file', file)
      return axios.post('/api/1.0/files', form)
    })
  },
  deleteFile (fileId) {
    return middleWare('deleteFile', () => {
      return axios.delete(`/api/1.0/files/${fileId}`)
    })
  },
  getFileMeta (fileId) {
    return middleWare('getFileMeta', () => {
      return axios.get(`/api/1.0/files/${fileId}/meta`)
    })
  },
  getFileThumbnail (fileId) {
    return middleWare('getFileThumbnail', () => {
      return axios.get(`/api/1.0/files/${fileId}/thumbnail`)
    })
  },

  // Tag: search
  searchMessage () {
    Promise.reject(console.error(`not implement`))
  },

  // Tag: heartbeat
  getHeartbeat () {
    return middleWare('getHeartbeat', () => {
      return axios.get(`/api/1.0/heartbeat`)
    })
  },
  postHeartbeat (status, channelId) {
    return middleWare('postHeartbeat', () => {
      return axios.post(`/api/1.0/heartbeat`, {status, channelId})
    })
  }
}

export default client
