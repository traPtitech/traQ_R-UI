import axios from '@/bin/axios'

const client = {
  // Tag: authorization
  login(name, pass) {
    return axios.post(`/api/1.0/login`, { name, pass })
  },
  logout() {
    return axios.post(`/api/1.0/logout`)
  },

  // Tag: Session
  getSessions() {
    return axios.get('/api/1.0/users/me/sessions')
  },
  deleteSessions() {
    return axios.delete('/api/1.0/users/me/sessions')
  },
  deleteSession(sessionId) {
    return axios.delete(`/api/1.0/users/me/sessions/${sessionId}`)
  },

  // Tag: channel
  makeChannel(type, member, name, parent) {
    return axios.post(`/api/1.0/channels`, { type, member, name, parent })
  },
  getChannels() {
    return axios.get(`/api/1.0/channels`)
  },
  getChannelInfo(channelId) {
    return axios.get(`/api/1.0/channels/${channelId}`)
  },
  changeChannelInfo(channelId, name, visibility, force) {
    return axios.patch(`/api/1.0/channels/${channelId}`, {
      name,
      visibility,
      force
    })
  },
  changeChannelParent(channelId, parent) {
    return axios.put(`/api/1.0/channels/${channelId}/parent`, { parent })
  },
  deleteChannel(channelId) {
    return axios.delete(`/api/1.0/channels/${channelId}`)
  },

  // Tag: topic
  getChannelTopic(channelId) {
    return axios.get(`/api/1.0/channels/${channelId}/topic`)
  },
  changeChannelTopic(channelId, text) {
    return axios.put(`/api/1.0/channels/${channelId}/topic`, { text })
  },

  // Tag: message
  loadMessages(channelId, limit, offset) {
    return axios.get(`/api/1.0/channels/${channelId}/messages`, {
      params: {
        limit: limit,
        offset: offset
      }
    })
  },
  postMessage(channelId, text) {
    return axios.post(`/api/1.0/channels/${channelId}/messages`, { text })
  },
  postDirectMessage(userId, text) {
    return axios.post(`/api/1.0/users/${userId}/messages`, { text })
  },
  editMessage(messageId, text) {
    return axios.put(`/api/1.0/messages/${messageId}`, { text })
  },
  getMessage(messageId) {
    return axios.get(`/api/1.0/messages/${messageId}`)
  },
  deleteMessage(messageId) {
    return axios.delete(`/api/1.0/messages/${messageId}`)
  },
  reportMessage(messageId, reason) {
    return axios.post(`/api/1.0/messages/${messageId}/report`, { reason })
  },
  getReports(page) {
    return axios.get('/api/1.0/reports', {
      params: {
        p: page
      }
    })
  },

  // Tag: pin
  getPinnedMessages(channelId) {
    return axios.get(`/api/1.0/channels/${channelId}/pins`)
  },
  pinMessage(messageId) {
    return axios.post(`/api/1.0/pins`, { messageId })
  },
  getPinnedMessage(pinId) {
    return axios.get(`/api/1.0/pins/${pinId}`)
  },
  unpinMessage(pinId) {
    return axios.delete(`/api/1.0/pins/${pinId}`)
  },

  // Tag: notification
  getNotifications(channelId) {
    return axios.get(`/api/1.0/channels/${channelId}/notification`)
  },
  changeNotifications(channelId, state) {
    return axios.put(`/api/1.0/channels/${channelId}/notification`, state)
  },
  getNotifiedChannels(userId) {
    return axios.get(`/api/1.0/users/${userId}/notification`)
  },
  registerDevice(token) {
    return axios.post(`/api/1.0/notification/device`, { token })
  },
  getMyNotifiedChannels() {
    return axios.get('/api/1.0/users/me/notification')
  },

  // Tag: user
  registerUser(name, password) {
    return axios.post(`/api/1.0/users`, { name, password })
  },
  getMembers() {
    return axios.get(`/api/1.0/users`)
  },
  whoAmI() {
    return axios.get(`/api/1.0/users/me`)
  },
  // deprecated
  getUserIconUrl(userId) {
    return (axios.defaults.baseURL || '/') + 'api/1.0/users/' + userId + '/icon'
  },
  changeIcon(file) {
    const form = new FormData()
    form.append('file', file)
    return axios.put('/api/1.0/users/me/icon', form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  changeDisplayName(name) {
    return axios.patch('/api/1.0/users/me', {
      displayName: name
    })
  },
  changeTwitterId(twitterId) {
    return axios.patch('/api/1.0/users/me', {
      twitterId
    })
  },
  changePassword(pass, newPass) {
    return axios.put('api/1.0/users/me/password', {
      password: pass,
      newPassword: newPass
    })
  },
  getUserDetail(userId) {
    return axios.get(`/api/1.0/users/${userId}`)
  },
  loadDirectMessages(userId, limit, offset) {
    return axios.get(`/api/1.0/users/${userId}/messages`, {
      params: {
        limit: limit,
        offset: offset
      }
    })
  },
  getQRCodeUrl() {
    return (axios.defaults.baseURL || '/') + 'api/1.0/users/me/qr-code'
  },

  // Tag: clip
  getAllClipMessages() {
    return axios.get(`/api/1.0/users/me/clips`)
  },
  getClipMessages(folderId) {
    return axios.get(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  clipMessage(folderId, messageId) {
    return axios.post(`/api/1.0/users/me/clips`, { folderId, messageId })
  },
  unclipMessage(clipId) {
    return axios.delete(`/api/1.0/users/me/clips/${clipId}`)
  },
  getClipFolders() {
    return axios.get(`/api/1.0/users/me/clips/folders`)
  },
  getClipFolderInfo(folderId) {
    return axios.get(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  renameClipFolder(folderId, name) {
    return axios.patch(`/api/1.0/users/me/clips/folders/${folderId}`, {
      name
    })
  },
  deleteClipFolder(folderId) {
    return axios.delete(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  makeClipFolder(name) {
    return axios.post(`/api/1.0/users/me/clips/folders`, { name })
  },

  // Tag: star
  getStaredChannels() {
    return axios.get(`/api/1.0/users/me/stars`)
  },
  starChannel(channelId) {
    return axios.put(`/api/1.0/users/me/stars/${channelId}`)
  },
  unstarChannel(channelId) {
    return axios.delete(`/api/1.0/users/me/stars/${channelId}`)
  },

  // Tag: unread
  getUnreadChannels() {
    return axios.get('/api/1.0/users/me/unread/channels')
  },
  readMessages(channelId) {
    return axios.delete(`/api/1.0/users/me/unread/channels/${channelId}`)
  },

  // Tag: mute
  getMutedChannels() {
    return axios.get(`/api/1.0/users/me/mute`)
  },
  muteChannel(channelId) {
    return axios.post(`/api/1.0/users/me/mute/${channelId}`)
  },
  unmuteChannel(channelId) {
    return axios.delete(`/api/1.0/users/me/mute/${channelId}`)
  },

  // Tag: stamp
  getStampHistory() {
    return axios.get('/api/1.0/users/me/stamp-history')
  },
  getStamps() {
    return axios.get(`/api/1.0/stamps`)
  },
  addStamp(name, file) {
    const form = new FormData()
    form.append('name', name)
    form.append('file', file)
    return axios.post(`/api/1.0/stamps`, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  getStampDetail(stampId) {
    return axios.get(`/api/1.0/stamps/${stampId}`)
  },
  fixStamp(stampId, name, file) {
    const form = new FormData()
    form.append('name', name)
    form.append('file', file)
    return axios.patch(`/api/1.0/stamps/${stampId}`, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  deleteStamp(stampId) {
    return axios.delete(`/api/1.0/stamps/${stampId}`)
  },
  getMessageStamp(messageId) {
    return axios.get(`/api/1.0/messages/${messageId}/stamps`)
  },
  stampMessage(messageId, stampId) {
    return axios.post(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
  },
  unstampMessage(messageId, stampId) {
    return axios.delete(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
  },

  // Tag: userTag
  getUserTags(userId) {
    return axios.get(`/api/1.0/users/${userId}/tags`)
  },
  addUserTag(userId, tag) {
    return axios.post(`/api/1.0/users/${userId}/tags`, { tag })
  },
  changeLockUserTag(userId, tagId, isLocked) {
    return axios.patch(`/api/1.0/users/${userId}/tags/${tagId}`, { isLocked })
  },
  deleteUserTag(userId, tagId) {
    return axios.delete(`/api/1.0/users/${userId}/tags/${tagId}`)
  },
  getTag(tagId) {
    return axios.get(`/api/1.0/tags/${tagId}`)
  },

  // Tag: file
  uploadFile(file, readableUsers, onUploadProgress) {
    const form = new FormData()
    form.append('file', file)
    form.append('acl_readable', readableUsers.join(','))
    return axios.post(
      '/api/1.0/files',
      form,
      onUploadProgress
        ? {
            onUploadProgress,
            headers: {
              'content-type': 'multipart/form-data'
            }
          }
        : {
            headers: {
              'content-type': 'multipart/'
            }
          }
    )
  },
  deleteFile(fileId) {
    return axios.delete(`/api/1.0/files/${fileId}`)
  },
  getFileMeta(fileId) {
    return axios.get(`/api/1.0/files/${fileId}/meta`)
  },
  getFileThumbnail(fileId) {
    return axios.get(`/api/1.0/files/${fileId}/thumbnail`)
  },

  // Tag: search
  searchMessage() {
    Promise.reject(console.error(`not implement`))
  },

  // Tag: heartbeat
  getHeartbeat() {
    return axios.get(`/api/1.0/heartbeat`)
  },
  postHeartbeat(status, channelId) {
    return axios.post(`/api/1.0/heartbeat`, { status, channelId })
  },

  // Tag: activity
  getLatestMessages(limit, subscribe) {
    return axios.get(
      `/api/1.0/activity/latest-messages?limit=${limit}&subscribe=${subscribe}`
    )
  },

  // Tag: group
  getAllGroups() {
    return axios.get('/api/1.0/groups')
  },
  postGroup(name, description) {
    return axios.post('/api/1.0/groups', { name, description })
  },
  getGroup(groupId) {
    return axios.get(`/api/1.0/groups/${groupId}`)
  },
  changeGroup(groupId, name, description, adminUserId) {
    return axios.patch(`/api/1.0/groups/${groupId}`, {
      name,
      description,
      adminUserId
    })
  },
  deleteGroup(groupId) {
    return axios.delete(`/api/1.0/groups/${groupId}`)
  },
  getGroupMember(groupId) {
    return axios.get(`/api/1.0/groups/${groupId}/members`)
  },
  addGroupMember(groupId, userId) {
    return axios.post(`/api/1.0/groups/${groupId}/members`, { userId })
  },
  deleteGroupMember(groupId, userId) {
    return axios.delete(`/api/1.0/groups/${groupId}/members/${userId}`)
  },
  getMyGroups() {
    return axios.get('/api/1.0/users/me/groups')
  },
  getUserGroups(userId) {
    return axios.get(`/api/1.0/users/${userId}/groups`)
  },

  // Tag: client
  getClient(clientId) {
    return axios.get(`/api/1.0/clients/${clientId}`)
  },

  // Tag: Webhook
  getWebhooks() {
    return axios.get(`/api/1.0/webhooks`)
  }
}

interface Window {
  client: any
}
declare var window: Window

if (process.env.NODE_ENV === 'development') {
  window.client = client
}
export default client
