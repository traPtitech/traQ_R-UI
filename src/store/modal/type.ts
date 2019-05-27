import Schemas = Components.Schemas

export interface S {
  name: null | string
  data: any
  currentUserTags: Schemas.Tag[]
  currentTagUserIds: string[]
  currentUserGroupIds: string[]
  lastUser: Schemas.User | null
  qrLastLoad: number | null
}

export interface G {
  isActive: boolean
  currentUserTagsSorted: Schemas.Tag[]
  currentTagUsersSorted: string[]
  currentUserGroupsSorted: (Schemas.UserGroup & { type: string })[]
}

export interface RG {
  'modal/isActive': G['isActive']
  'modal/currentUserTagsSorted': G['currentUserTagsSorted']
  'modal/currentTagUsersSorted': G['currentTagUsersSorted']
  'modal/currentUserGroupsSorted': G['currentUserGroupsSorted']
}

export interface M {
  setQRCodeImage: void
  setModalName: null | string
  setModalData: any
  setLastUser: null | Schemas.User
  setCurrentUserTags: null | Schemas.Tag[]
  setCurrentTagUserIds: null | string[]
  setCurrentUserGroupIds: null | string[]
}

export interface RM {
  'modal/setQRCodeImage': M['setQRCodeImage']
  'modal/setModalName': M['setModalName']
  'modal/setModalData': M['setModalData']
  'modal/setLastUser': M['setLastUser']
  'modal/setCurrentUserTags': M['setCurrentUserTags']
  'modal/setCurrentTagUserIds': M['setCurrentTagUserIds']
  'modal/setCurrentUserGroupIds': M['setCurrentUserGroupIds']
}

export interface A {
  updateCurrentUserTags: void
  updateCurrentUserGroupIds: void
  updateCurrentTagUserIds: void
  openUserModal: string
  openGroupModal: string
  openTagModal: Schemas.Tag
  openFileModal: any
  openTourModal: any
  openCodeModal: any
  openChannelCreateModal: void
  openChannelNotificationModal: void
  openPinnedModal: Schemas.Message
  open: { name: string; data?: any }
  close: void
}

export interface RA {
  'modal/updateCurrentUserTags': A['updateCurrentUserTags']
  'modal/updateCurrentUserGroupIds': A['updateCurrentUserGroupIds']
  'modal/updateCurrentTagUserIds': A['updateCurrentTagUserIds']
  'modal/openUserModal': A['openUserModal']
  'modal/openGroupModal': A['openGroupModal']
  'modal/openTagModal': A['openTagModal']
  'modal/openTourModal': A['openTourModal']
  'modal/openCodeModal': A['openCodeModal']
  'modal/openChannelCreateModal': A['openChannelCreateModal']
  'modal/openChannelNotificationModal': A['openChannelNotificationModal']
  'modal/openPinnedModal': A['openPinnedModal']
  'modal/open': A['open']
  'modal/close': A['close']
}
