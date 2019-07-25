import { Apis } from 'traq-api'

const BASE_PATH = '/api/1.0'

const api = new Apis({
  basePath: BASE_PATH
})

const middleWare =
  process.env.NODE_ENV === 'development' || window.debug
    ? (name, fn) => {
        return fn()
          .then(res => {
            console.info(name, res)
            return Promise.resolve(res)
          })
          .catch(err => {
            console.error(name, err)
            return Promise.reject(err)
          })
      }
    : (name, fn) => {
        return fn().catch(err => {
          console.error(name, err)
          return Promise.reject(err)
        })
      }

const client = {
  // Tag: authorization
  login(name, pass) {
    return middleWare('login', () => api.login(undefined, { name, pass }))
  },
  logout() {
    return middleWare('logout', () => api.logout())
  },

  // Tag: Session
  getSessions() {
    return middleWare('getSessions', () => api.getSessions())
  },
  deleteSessions() {
    return middleWare('deleteSessions', () => api.deleteSessions())
  },
  deleteSession(sessionId) {
    return middleWare('deleteSession', () => api.deleteSession(sessionId))
  },

  // Tag: channel
  makeChannel(type, member, name, parent) {
    return middleWare('makeChannel', () => {
      return api.createChannel({
        _private: type === 'private',
        member,
        name,
        parent
      })
    })
  },
  getChannels() {
    return middleWare('getChannels', () => api.getChannels())
  },
  getChannelInfo(channelId) {
    return middleWare('getChannelInfo', () => api.getChannel(channelId))
  },
  changeChannelInfo(channelId, name, visibility, force) {
    return middleWare('changeChannelName', () => {
      return api.editChannel(channelId, {
        name,
        visibility,
        force
      })
    })
  },
  changeChannelParent(channelId, parent) {
    return middleWare('changeChannelParent', () =>
      api.changeChannelParent(channelId, { parent })
    )
  },
  deleteChannel(channelId) {
    return middleWare('changeChannelName', () => api.deleteChannel(channelId))
  },

  // Tag: topic
  getChannelTopic(channelId) {
    return middleWare('getChannelTopic', () => api.getChannelTopic(channelId))
  },
  changeChannelTopic(channelId, text) {
    return middleWare('changeChannelTopic', () =>
      api.changeChannelTopic(channelId, { text })
    )
  },

  // Tag: message
  loadMessages(channelId, limit, offset) {
    return middleWare('loadMessages', () =>
      api.getMessages(channelId, limit, offset)
    )
  },
  postMessage(channelId, text) {
    return middleWare('postMessage', () => api.postMessage(channelId, { text }))
  },
  postDirectMessage(userId, text) {
    return middleWare('postDirectMessage', () =>
      api.postDirectMessage(userId, { text })
    )
  },
  editMessage(messageId, text) {
    return middleWare('editMessage', () => api.editMessage(messageId, { text }))
  },
  getMessage(messageId) {
    return middleWare('getMessage', () => api.getMessage(messageId))
  },
  deleteMessage(messageId) {
    return middleWare('deleteMessage', () => api.deleteMessage(messageId))
  },
  reportMessage(messageId, reason) {
    return middleWare('reportMessage', () =>
      api.reportMessage(messageId, { reason })
    )
  },
  getReports(page) {
    return middleWare('getReports', () => api.getReports(page))
  },

  // Tag: pin
  getPinnedMessages(channelId) {
    return middleWare('getPinnedMessages', () =>
      api.getPinnedMessages(channelId)
    )
  },
  pinMessage(messageId) {
    return middleWare('pinMessage', () => api.pinMessage({ messageId }))
  },
  getPinnedMessage(pinId) {
    return middleWare('getPinnedMessage', () => api.getPinnedMessage(pinId))
  },
  unpinMessage(pinId) {
    return middleWare('unpinMessage', () => api.unpinMessage(pinId))
  },

  // Tag: notification
  getNotifications(channelId) {
    return middleWare('getNotifications', () => api.getNotifications(channelId))
  },
  changeNotifications(channelId, state) {
    return middleWare('changeNotifications', () =>
      api.changeNotifications(channelId, state)
    )
  },
  getNotifiedChannels(userId) {
    return middleWare('getNotifiedChannels', () =>
      api.getUserNotifiedChannels(userId)
    )
  },
  registerDevice(token) {
    return middleWare('registerDevice', () =>
      api.registerNotificationDevice(token)
    )
  },
  getMyNotifiedChannels() {
    return middleWare('getMyNotifiedChannels', () => api.getNotifiedChannels())
  },

  // Tag: user
  registerUser(name, password) {
    return middleWare('registerUser', () =>
      api.registerUser({ name, password })
    )
  },
  getMembers() {
    return middleWare('getMembers', () => api.getUsers())
  },
  whoAmI() {
    return middleWare('whoAmI', () => api.getMe())
  },
  // deprecated
  getUserIconUrl(userId) {
    return `${BASE_PATH}/users/${userId}/icon`
  },
  changeIcon(file) {
    return middleWare('changeIcon', () => api.changeMyIcon(file))
  },
  changeDisplayName(name) {
    return middleWare('changeDisplayName', () =>
      api.changeMe({ displayName: name })
    )
  },
  changeTwitterId(twitterId) {
    return middleWare('changeTwitterId', () => api.changeMe({ twitterId }))
  },
  changePassword(pass, newPass) {
    return middleWare('changePassword', () => {
      return api.changePassword({
        password: pass,
        newPassword: newPass
      })
    })
  },
  getUserDetail(userId) {
    return middleWare('getUserDetail', () => api.getUser(userId))
  },
  loadDirectMessages(userId, limit, offset) {
    return middleWare('loadDirectMessages', () =>
      api.getDirectMessages(userId, limit, offset)
    )
  },
  getQRCodeUrl() {
    return `${BASE_PATH}/users/me/qr-code`
  },

  // Tag: clip
  getAllClipMessages() {
    return middleWare('getAllClipMessages', () => api.getClips())
  },
  getClipMessages(folderId) {
    return middleWare('getClipMessages', () => api.getClipFolder(folderId))
  },
  clipMessage(folderId, messageId) {
    return middleWare('clipMessage', () =>
      api.clipMessage({ folderId, messageId })
    )
  },
  unclipMessage(clipId) {
    return middleWare('unclipMessage', () => api.unclipMessage(clipId))
  },
  getClipFolders() {
    return middleWare('getClipFolders', () => api.getClipFolders())
  },
  getClipFolderInfo(folderId) {
    return middleWare('getClipFolder', () => api.getClipFolder(folderId))
  },
  renameClipFolder(folderId, name) {
    return middleWare('renameClipFolder', () =>
      api.editClipFolder(folderId, { name })
    )
  },
  deleteClipFolder(folderId) {
    return middleWare('deleteClipFolder', () => api.deleteClipFolder(folderId))
  },
  makeClipFolder(name) {
    return middleWare('makeClipFolder', () => api.createClipFolders({ name }))
  },

  // Tag: star
  getStaredChannels() {
    return middleWare('getStaredChannels', () => api.getStaredChannels())
  },
  starChannel(channelId) {
    return middleWare('starChannel', () => api.starChannel(channelId))
  },
  unstarChannel(channelId) {
    return middleWare('unstarChannel', () => api.unstarChannel(channelId))
  },

  // Tag: unread
  getUnreadChannels() {
    return middleWare('getUnreadChannels', () => api.getUnreadChannels())
  },
  readMessages(channelId) {
    return middleWare('readMessages', () => api.readMessages(channelId))
  },

  // Tag: mute
  getMutedChannels() {
    return middleWare('getMutedChannels', () => api.getMutedChannels())
  },
  muteChannel(channelId) {
    return middleWare('muteChannel', () => api.muteChannel(channelId))
  },
  unmuteChannel(channelId) {
    return middleWare('unmuteChannel', () => api.unmuteChannel(channelId))
  },

  // Tag: stamp
  getStampHistory() {
    return middleWare('getStampHistory', () => api.getStampHistory())
  },
  getStamps() {
    return middleWare('getStamps', () => api.getStamps())
  },
  addStamp(name, file) {
    return middleWare('addStamp', () => api.createStamp(name, file))
  },
  getStampDetail(stampId) {
    return middleWare('getStampDetail', () => api.getStamp(stampId))
  },
  fixStamp(stampId, name, file) {
    return middleWare('fixStamp', () => api.editStamp(stampId, name, file))
  },
  deleteStamp(stampId) {
    return middleWare('deleteStamp', () => api.deleteStamp(stampId))
  },
  getMessageStamp(messageId) {
    return middleWare('getMessageStamp', () => api.getMessageStamps(messageId))
  },
  stampMessage(messageId, stampId) {
    return middleWare('stampMessage', () =>
      api.stampMessage(messageId, stampId)
    )
  },
  unstampMessage(messageId, stampId) {
    return middleWare('unstampMessage', () =>
      api.unstampMessage(messageId, stampId)
    )
  },

  // Tag: userTag
  getUserTags(userId) {
    return middleWare('getUserTag', () => api.getUserTags(userId))
  },
  addUserTag(userId, tag) {
    return middleWare('addUserTag', () => api.addUserTags(userId, { tag }))
  },
  changeLockUserTag(userId, tagId, isLocked) {
    return middleWare('changeLockUserTag', () =>
      api.changeLockUserTag(userId, tagId, { isLocked })
    )
  },
  deleteUserTag(userId, tagId) {
    return middleWare('deleteUserTag', () => api.deleteUserTag(userId, tagId))
  },
  getTag(tagId) {
    return middleWare('getTag', () => api.getTag(tagId))
  },

  // Tag: file
  uploadFile(file, readableUsers, onUploadProgress) {
    return middleWare('uploadFile', () => {
      return api.uploadFile(
        file,
        readableUsers.join(','),
        onUploadProgress
          ? {
              onUploadProgress
            }
          : {}
      )
    })
  },
  deleteFile(fileId) {
    return middleWare('deleteFile', () => api.deleteFile(fileId))
  },
  getFileMeta(fileId) {
    return middleWare('getFileMeta', () => api.getFileMeta(fileId))
  },
  getFileThumbnail(fileId) {
    return middleWare('getFileThumbnail', () => api.getFileThumbnail(fileId))
  },

  // Tag: search
  searchMessage() {
    Promise.reject(console.error(`not implement`))
  },

  // Tag: heartbeat
  getHeartbeat() {
    return middleWare('getHeartbeat', () => api.getHeartbeat())
  },
  postHeartbeat(status, channelId) {
    return api.postHeartbeat({ status, channelId })
  },

  // Tag: activity
  getLatestMessages(limit, subscribe) {
    return api.getActivities(limit, subscribe)
  },

  // Tag: group
  getAllGroups() {
    return api.getGroups()
  },
  postGroup(name, description) {
    return api.createGroups({ name, description })
  },
  getGroup(groupId) {
    return api.getGroup(groupId)
  },
  changeGroup(groupId, name, description, adminUserId) {
    return api.editGroup(groupId, {
      name,
      description,
      adminUserId
    })
  },
  deleteGroup(groupId) {
    return api.deleteGroup(groupId)
  },
  getGroupMember(groupId) {
    return api.getGroupMembers(groupId)
  },
  addGroupMember(groupId, userId) {
    return api.addGroupMember(groupId, { userId })
  },
  deleteGroupMember(groupId, userId) {
    return api.deleteGroupMember(groupId, userId)
  },
  getMyGroups() {
    return api.getMyGroups()
  },
  getUserGroups(userId) {
    return api.getUserGroups(userId)
  },

  // Tag: client
  getClient(clientId) {
    return api.getClient(clientId)
  },

  // Tag: Webhook
  getWebhooks() {
    return api.getWebhooks()
  }
}

if (process.env.NODE_ENV === 'development') {
  window.client = client
}

export default client
