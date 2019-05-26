import axios from '@/bin/axios'
import { AxiosResponse, AxiosError, AxiosPromise } from 'axios'
import Schemas = Components.Schemas
import Parameters = Components.Parameters

const client = {
  // Tag: authorization
  login(name: string, pass: string) {
    return axios.post(`/api/1.0/login`, { name, pass })
  },
  logout() {
    return axios.post(`/api/1.0/logout`)
  },

  // Tag: Session
  getSessions(): AxiosPromise<Paths.UsersMeSessions.Get.Responses.$200> {
    return axios.get('/api/1.0/users/me/sessions')
  },
  deleteSessions(): AxiosPromise {
    return axios.delete('/api/1.0/users/me/sessions')
  },
  deleteSession(
    sessionId: Paths.UsersMeSessions$ReferenceID.Parameters.ReferenceID
  ): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/sessions/${sessionId}`)
  },

  // Tag: channel
  makeChannel(
    reqBody: Paths.Channels.Post.RequestBody
  ): AxiosPromise<Paths.Channels.Post.Responses.$201> {
    return axios.post(`/api/1.0/channels`, reqBody)
  },
  getChannels(): AxiosPromise<Paths.Channels.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels`)
  },
  getChannelInfo(
    channelId: Parameters.ChannelIdInPath.ChannelID
  ): AxiosPromise<Paths.Channels$ChannelID.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels/${channelId}`)
  },
  changeChannelInfo(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    reqBody: Paths.Channels$ChannelID.Patch.RequestBody
  ): AxiosPromise {
    return axios.patch(`/api/1.0/channels/${channelId}`, reqBody)
  },
  changeChannelParent(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    reqBody: Paths.Channels$ChannelIDParent.Put.RequestBody
  ): AxiosPromise {
    return axios.put(`/api/1.0/channels/${channelId}/parent`, reqBody)
  },
  deleteChannel(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.delete(`/api/1.0/channels/${channelId}`)
  },

  // Tag: topic
  getChannelTopic(
    channelId: Parameters.ChannelIdInPath.ChannelID
  ): AxiosPromise<Paths.Channels$ChannelIDTopic.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels/${channelId}/topic`)
  },
  changeChannelTopic(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    reqBody: Paths.Channels$ChannelIDTopic.Put.RequestBody
  ): AxiosPromise {
    return axios.put(`/api/1.0/channels/${channelId}/topic`, reqBody)
  },

  // Tag: message
  loadMessages(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    params: Paths.Channels$ChannelIDMessages.Get.QueryParameters
  ): AxiosPromise<Paths.Channels$ChannelIDMessages.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels/${channelId}/messages`, {
      params
    })
  },
  postMessage(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    reqBody: Paths.Channels$ChannelIDMessages.Post.RequestBody
  ): AxiosPromise<Paths.Channels$ChannelIDMessages.Post.Responses.$201> {
    return axios.post(`/api/1.0/channels/${channelId}/messages`, reqBody)
  },
  postDirectMessage(
    userId: Parameters.UserIdInPath.UserID,
    reqBody: Paths.Users$UserIDMessages.Post.RequestBody
  ): AxiosPromise<Paths.Users$UserIDMessages.Post.Responses.$201> {
    return axios.post(`/api/1.0/users/${userId}/messages`, reqBody)
  },
  editMessage(
    messageId: Parameters.MessageIdInPath.MessageID,
    reqBody: Paths.Users$UserIDMessages.Post.RequestBody
  ): AxiosPromise {
    return axios.put(`/api/1.0/messages/${messageId}`, reqBody)
  },
  getMessage(
    messageId: Parameters.MessageIdInPath.MessageID
  ): AxiosPromise<Paths.GetMessageById.Responses.$200> {
    return axios.get(`/api/1.0/messages/${messageId}`)
  },
  deleteMessage(messageId: Parameters.MessageIdInPath.MessageID): AxiosPromise {
    return axios.delete(`/api/1.0/messages/${messageId}`)
  },
  reportMessage(
    messageId: Parameters.MessageIdInPath.MessageID,
    reqBody: Paths.Messages$MessageIDReport.Post.RequestBody
  ) {
    return axios.post(`/api/1.0/messages/${messageId}/report`, reqBody)
  },
  getReports(
    params: Paths.MessagesReports.Get.QueryParameters
  ): AxiosPromise<Paths.MessagesReports.Get.Responses.$200> {
    return axios.get('/api/1.0/reports', {
      params
    })
  },

  // Tag: pin
  getPinnedMessages(
    channelId: Parameters.ChannelIdInPath.ChannelID
  ): AxiosPromise<Paths.Channels$ChannelIDPins.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels/${channelId}/pins`)
  },
  pinMessage(
    reqBody: Paths.Pins.Post.RequestBody
  ): AxiosPromise<Paths.Pins.Post.Responses.$201> {
    return axios.post(`/api/1.0/pins`, reqBody)
  },
  getPinnedMessage(
    pinId: Parameters.PinIdInPath.PinID
  ): AxiosPromise<Paths.Pins$PinID.Get.Responses.$200> {
    return axios.get(`/api/1.0/pins/${pinId}`)
  },
  unpinMessage(pinId: Parameters.PinIdInPath.PinID): AxiosPromise {
    return axios.delete(`/api/1.0/pins/${pinId}`)
  },

  // Tag: notification
  getNotifications(
    channelId: Parameters.ChannelIdInPath.ChannelID
  ): AxiosPromise<Paths.Channels$ChannelIDNotification.Get.Responses.$200> {
    return axios.get(`/api/1.0/channels/${channelId}/notification`)
  },
  changeNotifications(
    channelId: Parameters.ChannelIdInPath.ChannelID,
    reqBody: Paths.Channels$ChannelIDNotification.Put.RequestBody
  ): AxiosPromise {
    return axios.put(`/api/1.0/channels/${channelId}/notification`, reqBody)
  },
  getNotifiedChannels(
    userId: Parameters.UserIdInPath.UserID
  ): AxiosPromise<
    Paths.Users$UserIDNotification.Get.Responses.$200 | AxiosError
  > {
    return axios.get(`/api/1.0/users/${userId}/notification`)
  },
  registerDevice(
    reqBody: Paths.NotificationDevice.Post.RequestBody
  ): AxiosPromise {
    return axios.post(`/api/1.0/notification/device`, reqBody)
  },
  getMyNotifiedChannels(): AxiosPromise<
    Paths.UsersMeNotification.Get.Responses.$200 | AxiosError
  > {
    return axios.get('/api/1.0/users/me/notification')
  },

  // Tag: user
  registerUser(reqBody: Paths.Users.Post.RequestBody): AxiosPromise {
    return axios.post(`/api/1.0/users`, reqBody)
  },
  getMembers(): AxiosPromise<Paths.Users.Get.Responses.$200 | AxiosError> {
    return axios.get(`/api/1.0/users`)
  },
  whoAmI(): AxiosPromise<Paths.UsersMe.Get.Responses.$200 | AxiosError> {
    return axios.get(`/api/1.0/users/me`)
  },
  // deprecated
  getUserIconUrl(userId: Parameters.UserIdInPath.UserID): string {
    return (axios.defaults.baseURL || '/') + 'api/1.0/users/' + userId + '/icon'
  },
  changeIcon(file: any): AxiosPromise {
    const form = new FormData()
    form.append('file', file)
    return axios.put('/api/1.0/users/me/icon', form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  changeDisplayName(reqBody: Paths.UsersMe.Patch.RequestBody): AxiosPromise {
    return axios.patch('/api/1.0/users/me', reqBody)
  },
  changeTwitterId(reqBody: Paths.UsersMe.Patch.RequestBody): AxiosPromise {
    return axios.patch('/api/1.0/users/me', reqBody)
  },
  changePassword(reqBody: Paths.UsersMePassword.Put.RequestBody): AxiosPromise {
    return axios.put('api/1.0/users/me/password', reqBody)
  },
  getUserDetail(
    userId: Parameters.UserIdInPath.UserID
  ): AxiosPromise<Paths.Users$UserID.Get.Responses.$200 | AxiosError> {
    return axios.get(`/api/1.0/users/${userId}`)
  },
  loadDirectMessages(
    userId: Parameters.UserIdInPath.UserID,
    params: Paths.Users$UserIDMessages.Get.QueryParameters
  ): AxiosPromise<Paths.Users$UserIDMessages.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/${userId}/messages`, {
      params
    })
  },
  getQRCodeUrl(): string {
    return (axios.defaults.baseURL || '/') + 'api/1.0/users/me/qr-code'
  },

  // Tag: clip
  getAllClipMessages(): AxiosPromise<Paths.UsersMeClips.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/clips`)
  },
  getClipMessages(
    folderId: string
  ): AxiosPromise<Paths.UsersMeClipsFolders$FolderID.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  clipMessage(
    reqBody: Paths.UsersMeClips.Post.RequestBody
  ): AxiosPromise<Paths.UsersMeClips.Post.Responses.$201> {
    return axios.post(`/api/1.0/users/me/clips`, reqBody)
  },
  unclipMessage(clipId: Parameters.ClientIdInPath.ClientID): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/clips/${clipId}`)
  },
  getClipFolders(): AxiosPromise<Paths.UsersMeClipsFolders.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/clips/folders`)
  },
  getClipFolderInfo(
    folderId: Parameters.ClipIdInPath.ClipID
  ): AxiosPromise<Paths.UsersMeClipsFolders$FolderID.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  renameClipFolder(
    folderId: Parameters.ClipIdInPath.ClipID,
    reqBody: Paths.UsersMeClipsFolders$FolderID.Patch.RequestBody
  ): AxiosPromise {
    return axios.patch(`/api/1.0/users/me/clips/folders/${folderId}`, reqBody)
  },
  deleteClipFolder(folderId: Parameters.ClipIdInPath.ClipID): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/clips/folders/${folderId}`)
  },
  makeClipFolder(
    reqBody: Paths.UsersMeClipsFolders.Post.RequestBody
  ): AxiosPromise<Paths.UsersMeClipsFolders.Post.Responses.$201> {
    return axios.post(`/api/1.0/users/me/clips/folders`, reqBody)
  },

  // Tag: star
  getStaredChannels(): AxiosPromise<Paths.UsersMeStars.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/stars`)
  },
  starChannel(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.put(`/api/1.0/users/me/stars/${channelId}`)
  },
  unstarChannel(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/stars/${channelId}`)
  },

  // Tag: unread
  getUnreadChannels(): AxiosPromise<
    Paths.UsersMeUnreadChannels.Get.Responses.$200
  > {
    return axios.get('/api/1.0/users/me/unread/channels')
  },
  readMessages(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/unread/channels/${channelId}`)
  },

  // Tag: mute
  getMutedChannels(): AxiosPromise<Paths.UsersMeMute.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/me/mute`)
  },
  muteChannel(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.post(`/api/1.0/users/me/mute/${channelId}`)
  },
  unmuteChannel(channelId: Parameters.ChannelIdInPath.ChannelID): AxiosPromise {
    return axios.delete(`/api/1.0/users/me/mute/${channelId}`)
  },

  // Tag: stamp
  getStampHistory(): AxiosPromise<
    Paths.UsersMeStampHistory.Get.Responses.$200
  > {
    return axios.get('/api/1.0/users/me/stamp-history')
  },
  getStamps(): AxiosPromise<Paths.Stamps.Get.Responses.$200> {
    return axios.get(`/api/1.0/stamps`)
  },
  addStamp(name: string, file: any): AxiosPromise {
    const form = new FormData()
    form.append('name', name)
    form.append('file', file)
    return axios.post(`/api/1.0/stamps`, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  getStampDetail(
    stampId: Parameters.StampIdInPath.StampID
  ): AxiosPromise<Paths.Stamps$StampID.Get.Responses.$200> {
    return axios.get(`/api/1.0/stamps/${stampId}`)
  },
  fixStamp(
    stampId: Parameters.StampIdInPath.StampID,
    name: string,
    file: any
  ): AxiosPromise {
    const form = new FormData()
    form.append('name', name)
    form.append('file', file)
    return axios.patch(`/api/1.0/stamps/${stampId}`, form, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  deleteStamp(stampId: Parameters.StampIdInPath.StampID): AxiosPromise {
    return axios.delete(`/api/1.0/stamps/${stampId}`)
  },
  getMessageStamp(
    messageId: Parameters.MessageIdInPath.MessageID
  ): AxiosPromise<Paths.Messages$MessageIDStamps.Get.Responses.$200> {
    return axios.get(`/api/1.0/messages/${messageId}/stamps`)
  },
  stampMessage(
    messageId: Parameters.MessageIdInPath.MessageID,
    stampId: Parameters.StampIdInPath.StampID
  ): AxiosPromise {
    return axios.post(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
  },
  unstampMessage(
    messageId: Parameters.MessageIdInPath.MessageID,
    stampId: Parameters.StampIdInPath.StampID
  ): AxiosPromise {
    return axios.delete(`/api/1.0/messages/${messageId}/stamps/${stampId}`)
  },

  // Tag: userTag
  getUserTags(
    userId: Parameters.UserIdInPath.UserID
  ): AxiosPromise<Paths.Users$UserIDTags.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/${userId}/tags`)
  },
  addUserTag(
    userId: Parameters.UserIdInPath.UserID,
    reqBody: Paths.Users$UserIDTags.Post.RequestBody
  ): AxiosPromise {
    return axios.post(`/api/1.0/users/${userId}/tags`, reqBody)
  },
  changeLockUserTag(
    userId: Parameters.UserIdInPath.UserID,
    tagId: Parameters.TagIdInPath.TagID,
    reqBody: Paths.Users$UserIDTagsTagID.Patch.RequestBody
  ) {
    return axios.patch(`/api/1.0/users/${userId}/tags/${tagId}`, reqBody)
  },
  deleteUserTag(
    userId: Parameters.UserIdInPath.UserID,
    tagId: Parameters.TagIdInPath.TagID
  ): AxiosPromise {
    return axios.delete(`/api/1.0/users/${userId}/tags/${tagId}`)
  },
  getTag(
    tagId: Parameters.TagIdInPath.TagID
  ): AxiosPromise<Paths.Tags$TagID.Get.Responses.$200> {
    return axios.get(`/api/1.0/tags/${tagId}`)
  },

  // Tag: file
  uploadFile(
    file: any,
    readableUsers: string[],
    onUploadProgress?: any
  ): AxiosPromise {
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
              'content-type': 'multipart/form-data'
            }
          }
    )
  },
  deleteFile(fileId: Parameters.FileIdInPath.FileID): AxiosPromise {
    return axios.delete(`/api/1.0/files/${fileId}`)
  },
  getFileMeta(
    fileId: Parameters.FileIdInPath.FileID
  ): AxiosPromise<Paths.Files$FileIDMeta.Get.Responses.$200> {
    return axios.get(`/api/1.0/files/${fileId}/meta`)
  },
  getFileThumbnail(fileId: Parameters.FileIdInPath.FileID): AxiosPromise {
    return axios.get(`/api/1.0/files/${fileId}/thumbnail`)
  },

  // Tag: search
  searchMessage(): Promise<any> {
    return Promise.reject(console.error(`not implement`))
  },

  // Tag: heartbeat
  getHeartbeat(): AxiosPromise<Paths.Heartbeat.Get.Responses.$200> {
    return axios.get(`/api/1.0/heartbeat`)
  },
  postHeartbeat(reqBody: Paths.Heartbeat.Post.QueryParameters): AxiosPromise {
    return axios.post(`/api/1.0/heartbeat`, reqBody)
  },

  // Tag: activity
  getLatestMessages(
    params: Paths.ActivityLatestMessages.Get.QueryParameters
  ): AxiosPromise<Paths.ActivityLatestMessages.Get.Responses.$200> {
    return axios.get(`/api/1.0/activity/latest-messages`, {
      params
    })
  },

  // Tag: group
  getAllGroups(): AxiosPromise<Paths.Groups.Get.Responses.$200> {
    return axios.get('/api/1.0/groups')
  },
  postGroup(
    reqBody: Paths.Groups.Post.RequestBody
  ): AxiosPromise<Paths.Groups.Post.Responses.$201> {
    return axios.post('/api/1.0/groups', reqBody)
  },
  getGroup(
    groupId: Parameters.GroupIdInPath.GroupID
  ): AxiosPromise<Paths.Groups$GroupID.Get.Responses.$200> {
    return axios.get(`/api/1.0/groups/${groupId}`)
  },
  changeGroup(
    groupId: Parameters.GroupIdInPath.GroupID,
    reqBody: Paths.Groups$GroupID.Patch.RequestBody
  ): AxiosPromise {
    return axios.patch(`/api/1.0/groups/${groupId}`, reqBody)
  },
  deleteGroup(groupId: Parameters.GroupIdInPath.GroupID): AxiosPromise {
    return axios.delete(`/api/1.0/groups/${groupId}`)
  },
  getGroupMember(
    groupId: Parameters.GroupIdInPath.GroupID
  ): AxiosPromise<Paths.Groups$GroupIDMembers.Get.Responses.$200> {
    return axios.get(`/api/1.0/groups/${groupId}/members`)
  },
  addGroupMember(
    groupId: Parameters.GroupIdInPath.GroupID,
    reqBody: Paths.Groups$GroupIDMembers.Post.RequestBody
  ): AxiosPromise {
    return axios.post(`/api/1.0/groups/${groupId}/members`, reqBody)
  },
  deleteGroupMember(
    groupId: Parameters.GroupIdInPath.GroupID,
    userId: Parameters.UserIdInPath.UserID
  ): AxiosPromise {
    return axios.delete(`/api/1.0/groups/${groupId}/members/${userId}`)
  },
  getMyGroups(): AxiosPromise<Paths.UsersMeGroups.Get.Responses.$200> {
    return axios.get('/api/1.0/users/me/groups')
  },
  getUserGroups(
    userId: Parameters.UserIdInPath.UserID
  ): AxiosPromise<Paths.Users$UserIDGroups.Get.Responses.$200> {
    return axios.get(`/api/1.0/users/${userId}/groups`)
  },

  // Tag: client
  getClient(
    clientId: Parameters.ClientIdInPath.ClientID
  ): AxiosPromise<Paths.Clients.Get.Responses.$200> {
    return axios.get(`/api/1.0/clients/${clientId}`)
  },

  // Tag: Webhook
  getWebhooks(): AxiosPromise<Paths.Webhooks.Get.Responses.$200> {
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
