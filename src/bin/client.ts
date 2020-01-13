import {
  Apis,
  NotificationUsers,
  HeartbeatStatus,
  PutWebRTCState
} from 'traq-api'

const BASE_PATH = '/api/1.0'

interface Window {
  debug: boolean
  client: Client
}
declare const window: Window

const api = new Apis({
  basePath: BASE_PATH
})

function log(target: any, prop: string, descriptor: PropertyDescriptor) {
  const orig = descriptor.value
  if (typeof orig !== 'function') return orig
  descriptor.value = async function(...args: any[]) {
    try {
      const res = await Reflect.apply(orig, this, args)
      if (process.env.NODE_ENV === 'development' || window.debug) {
        console.info(prop, res)
      }
      return res
    } catch (err) {
      console.error(prop, err)
      throw err
    }
  }
}

class Client {
  // Tag: authorization
  @log
  login(name: string, pass: string) {
    return api.login({ name, pass })
  }
  @log
  logout() {
    return api.logout()
  }
  // Tag: Session
  @log
  getSessions() {
    return api.getSessions()
  }
  @log
  deleteSessions() {
    return api.deleteSessions()
  }
  @log
  deleteSession(sessionId: string) {
    return api.deleteSession(sessionId)
  }

  // Tag: channel
  @log
  makeChannel(name: string, parent: string) {
    return api.createChannel({ name, parent })
  }
  @log
  getChannels() {
    return api.getChannels()
  }
  @log
  getChannelInfo(channelId: string) {
    return api.getChannel(channelId)
  }
  @log
  changeChannelInfo(
    channelId: string,
    name: string,
    visibility: boolean,
    force: boolean
  ) {
    return api.editChannel(channelId, {
      name,
      visibility,
      force
    })
  }
  @log
  changeChannelParent(channelId: string, parent: string) {
    return api.changeChannelParent(channelId, { parent })
  }
  @log
  deleteChannel(channelId: string) {
    return api.deleteChannel(channelId)
  }

  // Tag: topic
  @log
  getChannelTopic(channelId: string) {
    return api.getChannelTopic(channelId)
  }
  @log
  changeChannelTopic(channelId: string, text: string) {
    return api.changeChannelTopic(channelId, { text })
  }

  // Tag: message
  @log
  loadMessages(channelId: string, limit: number, offset: number) {
    return api.getMessages(channelId, limit, offset)
  }
  @log
  postMessage(channelId: string, text: string) {
    return api.postMessage(channelId, { text })
  }
  @log
  postDirectMessage(userId: string, text: string) {
    return api.postDirectMessage(userId, { text })
  }
  @log
  editMessage(messageId: string, text: string) {
    return api.editMessage(messageId, { text })
  }
  @log
  getMessage(messageId: string) {
    return api.getMessage(messageId)
  }
  @log
  deleteMessage(messageId: string) {
    return api.deleteMessage(messageId)
  }
  @log
  reportMessage(messageId: string, reason: string) {
    return api.reportMessage(messageId, { reason })
  }
  @log
  getReports(page: number) {
    return api.getReports(page)
  }

  // Tag: pin
  @log
  getPinnedMessages(channelId: string) {
    return api.getPinnedMessages(channelId)
  }
  @log
  pinMessage(messageId: string) {
    return api.pinMessage({ messageId })
  }
  @log
  getPinnedMessage(pinId: string) {
    return api.getPinnedMessage(pinId)
  }
  @log
  unpinMessage(pinId: string) {
    return api.unpinMessage(pinId)
  }

  // Tag: notification
  @log
  getNotifications(channelId: string) {
    return api.getSubscribers(channelId)
  }
  @log
  changeNotifications(channelId: string, state: NotificationUsers) {
    return api.changeSubscribers(channelId, state)
  }
  @log
  getNotifiedChannels(userId: string) {
    return api.getUserSubscribeChannels(userId)
  }
  @log
  registerDevice(token: string) {
    return api.registerNotificationDevice({
      token
    })
  }
  @log
  getMyNotifiedChannels() {
    return api.getMySubscribeChannels()
  }

  // Tag: user
  @log
  registerUser(name: string, password: string) {
    return api.registerUser({ name, password })
  }
  @log
  getMembers() {
    return api.getUsers()
  }
  @log
  whoAmI() {
    return api.getMe()
  }
  @log
  changeIcon(file: any) {
    return api.changeMyIcon(file)
  }
  @log
  changeDisplayName(name: string) {
    return api.changeMe({ displayName: name })
  }
  @log
  changeTwitterId(twitterId: string) {
    return api.changeMe({ twitterId })
  }
  @log
  changePassword(pass: string, newPass: string) {
    return api.changePassword({
      password: pass,
      newPassword: newPass
    })
  }
  @log
  getUserDetail(userId: string) {
    return api.getUser(userId)
  }
  @log
  loadDirectMessages(userId: string, limit: number, offset: number) {
    return api.getDirectMessages(userId, limit, offset)
  }
  getQRCodeUrl() {
    return `${BASE_PATH}/users/me/qr-code`
  }

  // Tag: star
  @log
  getStaredChannels() {
    return api.getStaredChannels()
  }
  @log
  starChannel(channelId: string) {
    return api.starChannel(channelId)
  }
  @log
  unstarChannel(channelId: string) {
    return api.unstarChannel(channelId)
  }

  // Tag: unread
  @log
  getUnreadChannels() {
    return api.getUnreadChannels()
  }
  @log
  readMessages(channelId: string) {
    return api.readMessages(channelId)
  }

  // Tag: stamp
  @log
  getStampHistory() {
    return api.getStampHistory()
  }
  @log
  getStamps() {
    return api.getStamps()
  }
  @log
  addStamp(name: string, file: any) {
    return api.createStamp(name, file)
  }
  @log
  getStampDetail(stampId: string) {
    return api.getStamp(stampId)
  }
  @log
  fixStamp(stampId: string, name: string, file: any) {
    return api.editStamp(stampId, name, file)
  }
  @log
  deleteStamp(stampId: string) {
    return api.deleteStamp(stampId)
  }
  @log
  getMessageStamp(messageId: string) {
    return api.getMessageStamps(messageId)
  }
  @log
  stampMessage(messageId: string, stampId: string, count: number = 1) {
    return api.stampMessage(messageId, stampId, {
      count
    })
  }
  @log
  unstampMessage(messageId: string, stampId: string) {
    return api.unstampMessage(messageId, stampId)
  }

  // Tag: userTag
  @log
  getUserTags(userId: string) {
    return api.getUserTags(userId)
  }
  @log
  addUserTag(userId: string, tag: string) {
    return api.addUserTag(userId, { tag })
  }
  @log
  changeLockUserTag(userId: string, tagId: string, isLocked: boolean) {
    return api.changeLockUserTag(userId, tagId, { isLocked })
  }
  @log
  deleteUserTag(userId: string, tagId: string) {
    return api.deleteUserTag(userId, tagId)
  }
  @log
  getTag(tagId: string) {
    return api.getTag(tagId)
  }

  // Tag: file
  @log
  uploadFile(file: any, readableUsers: string[], onUploadProgress: Function) {
    return api.uploadFile(
      file,
      readableUsers.join(','),
      onUploadProgress
        ? {
            onUploadProgress
          }
        : {}
    )
  }
  @log
  deleteFile(fileId: string) {
    return api.deleteFile(fileId)
  }
  @log
  getFileMeta(fileId: string) {
    return api.getFileMeta(fileId)
  }
  @log
  getFileThumbnail(fileId: string) {
    return api.getFileThumbnail(fileId)
  }

  // Tag: heartbeat
  postHeartbeat(status: HeartbeatStatus, channelId: string) {
    return api.postHeartbeat({ status, channelId })
  }

  // Tag: activity
  getLatestMessages(limit: number, subscribe: boolean) {
    return api.getActivities(limit, subscribe)
  }

  // Tag: group
  getAllGroups() {
    return api.getGroups()
  }
  postGroup(name: string, description: string) {
    return api.createGroup({ name, description })
  }
  getGroup(groupId: string) {
    return api.getGroup(groupId)
  }
  changeGroup(
    groupId: string,
    name: string,
    description: string,
    adminUserId: string
  ) {
    return api.editGroup(groupId, {
      name,
      description,
      adminUserId
    })
  }
  deleteGroup(groupId: string) {
    return api.deleteGroup(groupId)
  }
  getGroupMember(groupId: string) {
    return api.getGroupMembers(groupId)
  }
  addGroupMember(groupId: string, userId: string) {
    return api.addGroupMember(groupId, { userId })
  }
  deleteGroupMember(groupId: string, userId: string) {
    return api.deleteGroupMember(groupId, userId)
  }
  getMyGroups() {
    return api.getMyGroups()
  }
  getUserGroups(userId: string) {
    return api.getUserGroups(userId)
  }

  // Tag: client
  getClient(clientId: string) {
    return api.getClient(clientId)
  }

  // Tag: Webhook
  getWebhooks() {
    return api.getWebhooks()
  }

  // Tag: WebRTC
  getChannelWebRtcState(channelId: string) {
    return api.getChannelWebRTCState(channelId)
  }
  getWebRtcState() {
    return api.getWebRTCState()
  }
  putWebRtcState(state: PutWebRTCState) {
    return api.putWebRTCState(state)
  }
}

const client = new Client()

if (process.env.NODE_ENV === 'development') {
  window.client = client
}

export default client
