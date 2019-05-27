import Schemas = Components.Schemas
import { AxiosPromise } from 'axios'

export interface S {
  loaded: boolean
  loadedComponent: boolean
  channelData: Schemas.ChannelList
  channelMap: { [channelId: string]: Schemas.Channel }
  activityMessages: Schemas.MessageList
  activityChannelIdSet: Set<string>
  openChannels: { [channelId: string]: boolean }
  openUserLists: { [grade: string]: boolean }
  sidebarOpened: boolean
  titlebarExpanded: boolean
  memberData: Schemas.UserList
  memberMap: { [userId: string]: Schemas.User }
  groupData: (Schemas.UserGroup & { type: string })[] //TODO
  groupMap: { [groupId: string]: Schemas.UserGroup & { type: string } }
  stampData: Schemas.Stamp[]
  stampMap: { [stampId: string]: Schemas.Stamp }
  stampCategolized: { [order: number]: any } // TODO
  stampNameMap: { [stampId: string]: Schemas.Stamp }
  stampHistory: Schemas.Stamp[]
  currentChannel: Schemas.Channel
  currentChannelUpdateDate: Date
  clipedMessages: { [messageId: string]: Schemas.Message }
  unreadChannelMap: {
    [channelId: string]: {
      channelId: string
      count: number
      noticeable: boolean
      since: string
      updatedAt: string
    }
  }
  staredChannels: string[]
  staredChannelMap: { [channelId: string]: Schemas.Channel }
  mutedChannels: string[]
  mutedChannelMap: { [channelId: string]: Schemas.Channel }
  messages: Schemas.MessageList
  channelTopicMap: { [channelId: string]: string }
  currentChannelPinnedMessages: Schemas.Pin[]
  currentChannelNotifications: string[]
  myNotifiedChannels: string[]
  myNotifiedChannelSet: Set<Schemas.Channel>
  me: null | Schemas.UserDetail
  menuContent: string
  channelView: string
  heartbeatStatus: {
    channelId: string
    userStatuses: Schemas.UserHeartbeatStatus[]
  }
  baseURL: string
  files: any[]
  directMessageId: string
  editing: boolean
  isActivePinnedModal: boolean
  openMode: string
  openChannelId: string
  lastChannelId: string
  theme: string
  windowWidth: number
  windowHeight: number
  filterSubscribedActivity: boolean
  activeMessageContextMenu: string
  isOnline: boolean
  filterText: string
  isUnreadFiltered: boolean
  webhooks: Schemas.Webhook[]
  messageSendKey: string
}

export interface G {
  channelTopic: (channelId: string) => string
  activeMessageContextMenu: string
  channelView: string
  theme: string
  windowWidth: number
  windowHeight: number
  childrenChannels: (channelId: string) => Schemas.ChannelList
  allChannels: Schemas.ChannelList
  getChannelByName: (channelName: string) => Schemas.Channel | undefined
  getDirectMessageChannels: Schemas.ChannelList
  getUserByName: (userName: string) => Schemas.User | null
  getChannelPathById: (channelId: string) => string | undefined
  getShortChannelPathById: (channelId: string) => string | undefined
  getFileDataById: (fileId: string) => AxiosPromise<Schemas.FileInfo>
  isPinned: (messageId: string) => Schemas.Pin | undefined
  getMyId: string
  getMyName: string
  notificationsOnMembers: Schemas.UserList
  notificationsOffMembers: Schemas.UserList
  getCurrentChannelUpdateDate: Date
  getChannelUnreadMessageNum: (channelId: string) => number
  getChannelUnreadMessageSum: (channelId: string) => number
  getUnreadMessageNum: number
  getUnreadDirectMessagesSum: number
  getStaredChannels: Schemas.ChannelList
  getUserIdByDirectMessageChannel: (
    channel: Schemas.Channel
  ) => string | undefined
  deviceType: string
  isSidebarOpened: boolean
  isTitlebarExpanded: boolean
  fileUrl: (fileId: string) => string
  grades: Schemas.UserGroup[]
  sortedGrades: Schemas.UserGroup[]
  memberData: Schemas.UserList
  nonBotUsers: Schemas.UserList
  gradeByUserMap: { [userId: string]: string | undefined }
  getGroupByContent: (
    group: string
  ) => Schemas.UserGroup & { type: string } | undefined // TODO
  userDisplayName: (userId: string) => string | undefined
  stampHistory: Schemas.Stamp[]
  filteringUser: (users: string[]) => string[]
  sortByUserId: (userIds: string[]) => string[]
  filterText: string
  isUnreadFiltered: boolean
  getWebhookUserIds: string[]
}

export interface RG {
  channelTopic: G['channelTopic']
  activeMessageContextMenu: G['activeMessageContextMenu']
  channelView: G['channelView']
  theme: G['theme']
  windowWidth: G['windowWidth']
  windowHeight: G['windowHeight']
  childrenChannels: G['childrenChannels']
  allChannels: G['allChannels']
  getChannelByName: G['getChannelByName']
  getDirectMessageChannels: G['getDirectMessageChannels']
  getUserByName: G['getUserByName']
  getChannelPathById: G['getChannelPathById']
  getShortChannelPathById: G['getShortChannelPathById']
  getFileDataById: G['getFileDataById']
  isPinned: G['isPinned']
  getMyId: G['getMyId']
  getMyName: G['getMyName']
  notificationsOnMembers: G['notificationsOnMembers']
  notificationsOffMembers: G['notificationsOffMembers']
  getCurrentChannelUpdateDate: G['getCurrentChannelUpdateDate']
  getChannelUnreadMessageNum: G['getChannelUnreadMessageNum']
  getChannelUnreadMessageSum: G['getChannelUnreadMessageSum']
  getUnreadMessageNum: G['getUnreadMessageNum']
  getUnreadDirectMessagesSum: G['getUnreadDirectMessagesSum']
  getStaredChannels: G['getStaredChannels']
  getUserIdByDirectMessageChannel: G['getUserIdByDirectMessageChannel']
  deviceType: G['deviceType']
  isSidebarOpened: G['isSidebarOpened']
  isTitlebarExpanded: G['isTitlebarExpanded']
  fileUrl: G['fileUrl']
  grades: G['grades']
  sortedGrades: G['sortedGrades']
  memberData: G['memberData']
  nonBodUsers: G['nonBotUsers']
  gradeByUserMap: G['gradeByUserMap']
  getGroupByContent: G['getGroupByContent']
  userDisplayName: G['userDisplayName']
  stampHistory: G['stampHistory']
  filteringUser: G['filteringUser']
  sortByUserId: G['sortByUserId']
  filterText: G['filterText']
  isUnreadFiltered: G['isUnreadFiltered']
  getWebhookUserIds: G['getWebhookUserIds']
}

export interface M {
  openSidebar: void
  closeSidebar: void
  expandTitlebar: void
  contractTitlebar: void
  setMe: Schemas.UserDetail | null
  setChannelData: Schemas.ChannelList
  setMemberData: Schemas.UserList
  setGroupData: (Schemas.UserGroup & { type: string })[]
  setStampData: Schemas.Stamp[]
  setStampHistory: {
    stampId?: string | undefined
    datetime?: string | undefined
  }[]
  addMessages: Schemas.MessageList
  unshiftMessages: Schemas.MessageList
  setMessages: Schemas.MessageList
  updateMessage: Schemas.Message
  deleteMessage: string
  changeChannel: Schemas.Channel
  loadStart: void
  loadEnd: void
  loadEndComponent: void
  changeMenuContent: string
  setClipedMessagesData: Schemas.MessageList
  setUnreadMessagesData: Schemas.ChannelList
  addUnreadMessage: Schemas.Message
  readChannel: string
  setStaredChannelsData: string[]
  setMutedChannelsData: string[]
  updateHeartbeatStatus: {
    channelId: string
    userStatuses: Schemas.UserHeartbeatStatus[]
  }
  setChannelTopic: { channelId: string; data: string }
  setCurrentChannelPinnedMessages: Schemas.MessageList
  setCurrentChannelNotifications: string[]
  updateMessageStamp: {
    message_id: string
    user_id: string
    stamp_id: string
    count: number
    created_at: string
  }
  deleteMessageStamp: { message_id: string; user_id: string; stamp_id: string }
  setFiles: any[]
  clearFiles: void
  setEditing: boolean
  removeMessage: string
  setPinnedModal: boolean
  setUserOnline: { userId: string; isOnline: boolean }
  setOpenChannels: { [channelId: string]: boolean }
  setOpenUserLists: { [groupId: string]: boolean }
  setOpenUserList: { groupId: string; isOpen: boolean }
  setOpenChannel: { channelId: string; isOpen: boolean }
  setOpenMode: string
  setOpenChannelId: string
  setLastChannelId: string
  setTheme: string
  setWindowSize: { windowWidth: number; windowHeight: number }
  setMyNotifiedChannels: string[]
  setActivityMessages: Schemas.MessageList
  addActivityMessages: Schemas.Message
  setFilterSubscribedActivity: boolean
  setChannelView: string
  setActiveMessageContextMenu: string
  changeNetwork: boolean
  setFilterText: string
  setIsUnreadFiltered: boolean
  setWebhooks: Schemas.Webhook[]
  setMessageSendKey: string
}

export interface RM {
  openSidebar: M['openSidebar']
  closeSidebar: M['closeSidebar']
  expandTitlebar: M['expandTitlebar']
  contractTitlebar: M['contractTitlebar']
  setMe: M['setMe']
  setChannelData: M['setChannelData']
  setMemberData: M['setMemberData']
  setStampData: M['setStampData']
  setStampHistory: M['setStampHistory']
  addMessages: M['addMessages']
  unshiftMessages: M['unshiftMessages']
  setMessages: M['setMessages']
  updateMessage: M['updateMessage']
  deleteMessage: M['deleteMessage']
  changeChannel: M['changeChannel']
  loadStart: M['loadStart']
  loadEnd: M['loadEnd']
  loadEndComponent: M['loadEndComponent']
  changeMenuContent: M['changeMenuContent']
  setClipedMessagesData: M['setClipedMessagesData']
  setUnreadMessagesData: M['setUnreadMessagesData']
  addUnreadMessage: M['addUnreadMessage']
  readChannel: M['readChannel']
  setStaredChannelsData: M['setStaredChannelsData']
  setMutedChannelsData: M['setMutedChannelsData']
  updateHeartbeatStatus: M['updateHeartbeatStatus']
  setChannelTopic: M['setChannelTopic']
  setCurrentChannelPinnedMessages: M['setCurrentChannelPinnedMessages']
  setCurrentChannelNotifications: M['setCurrentChannelNotifications']
  updateMessageStamp: M['updateMessageStamp']
  deleteMessageStamp: M['deleteMessageStamp']
  setFiles: M['setFiles']
  clearFiles: M['clearFiles']
  setEditing: M['setEditing']
  removeMessage: M['removeMessage']
  setPinnedModal: M['setPinnedModal']
  setUserOnline: M['setUserOnline']
  setOpenMode: M['setOpenMode']
  setOpenChannels: M['setOpenChannels']
  setOpenUserList: M['setOpenUserList']
  setOpenChannelId: M['setOpenChannelId']
  setLastChannelId: M['setLastChannelId']
  setTheme: M['setTheme']
  setWindowSize: M['setWindowSize']
  setMyNotifiedChannels: M['setMyNotifiedChannels']
  setActivityMessages: M['setActivityMessages']
  addActivityMessages: M['addActivityMessages']
  setFilterSubscribedActivity: M['setFilterSubscribedActivity']
  setChannelView: M['setChannelView']
  setActiveMessageContextMenu: M['setActiveMessageContextMenu']
  changeNetwork: M['changeNetwork']
  setFilterText: M['setFilterText']
  setIsUnreadFiltered: M['setIsUnreadFiltered']
  setWebhooks: M['setWebhooks']
  setMessageSendKey: M['setMessageSendKey']
}

export interface A {
  whoAmI: void
  getMessages: boolean
  updateChannels: void
  updateMembers: void
  updateGroups: void
  updateStamps: void
  getStampHistory: void
  updateWebhooks: void
  addStamp: string
  updateClipedMessages: void
  updateUnreadMessages: void
  updateStaredChannels: void
  updateMutedChannels: void
  getChannelTopic: string
  getCurrentChannelPinnedMessages: string
  getCurrentChannelNotifications: string
  addChannel: string
  deleteChannel: string
  updateChannel: string
  checkPinnedMessage: string
  updateUserOnline: { userId: string; isOnline: boolean }
  updateChannelOpen: { channelId: string; isOpen: boolean }
  updateUserListOpen: { groupId: string; isOpen: boolean }
  loadSetting: void
  loadOpenMode: void
  loadOpenChannelId: void
  loadLastChannelId: void
  loadTheme: void
  loadOpenChannels: void
  loadOpenUserLists: void
  loadMessageSendKey: void
  updateOpenMode: string
  updateOpenChannelId: string
  updateLastChannelId: string
  updateTheme: string
  updateChannelActivity: void
  updateMyNotifiedChannels: void
  updateCurrentChannelNotifications: { on: string[]; off: string[] }
  updateCurrentChannelTopic: string
  updateFilterSubscribedActivity: boolean
  loadFilterSubscribedActivity: void
  readMessages: string
  updateChannelView: string
  loadChannelView: void
  updateMessageSendKey: string
}

export interface RA {
  whoAmI: A['whoAmI']
  getMessages: A['getMessages']
  updateChannels: A['updateChannels']
  updateMembers: A['updateMembers']
  updateGroups: A['updateGroups']
  updateStamps: A['updateStamps']
  getStampHistory: A['getStampHistory']
  updateWebhooks: A['updateWebhooks']
  addStamp: A['addStamp']
  updateClipedMessages: A['updateClipedMessages']
  updateUnreadMessages: A['updateUnreadMessages']
  updateStaredChannels: A['updateStaredChannels']
  updateMutedChannels: A['updateMutedChannels']
  getChannelTopic: A['getChannelTopic']
  getCurrentChannelPinnedMessages: A['getCurrentChannelPinnedMessages']
  getCurrentChannelNotifications: A['getCurrentChannelNotifications']
  addChannel: A['addChannel']
  deleteChannel: A['deleteChannel']
  updateChannel: A['updateChannel']
  checkPinnedMessage: A['checkPinnedMessage']
  updateUserOnline: A['updateUserOnline']
  updateChannelOpen: A['updateChannelOpen']
  updateUserListOpen: A['updateUserListOpen']
  loadSetting: A['loadSetting']
  loadOpenMode: A['loadOpenMode']
  loadOpenChannelId: A['loadOpenChannelId']
  loadLastChannelId: A['loadLastChannelId']
  loadTheme: A['loadTheme']
  loadOpenChannels: A['loadOpenChannels']
  loadOpenUserLists: A['loadOpenUserLists']
  loadMessageSendKey: A['loadMessageSendKey']
  updateOpenMode: A['updateOpenMode']
  updateOpenChannelId: A['updateOpenChannelId']
  updateLastChannelId: A['updateLastChannelId']
  updateTheme: A['updateTheme']
  updateChannelActivity: A['updateChannelActivity']
  updateMyNotifiedChannels: A['updateMyNotifiedChannels']
  updateCurrentChannelNotifications: A['updateCurrentChannelNotifications']
  updateCurrentChannelTopic: A['updateCurrentChannelTopic']
  updateFilterSubscribedActivity: A['updateFilterSubscribedActivity']
  loadFilterSubscribedActivity: A['loadFilterSubscribedActivity']
  readMessages: A['readMessages']
  updateChannelView: A['updateChannelView']
  loadChannelView: A['loadChannelView']
  updateMessageSendKey: A['updateMessageSendKey']
}
