import Vue from 'vue'
import Vuex from 'vuex'
import client from '@/bin/client'
import indexedDB from '@/bin/indexeddb'
import stampCategorizer from '@/bin/stampCategorizer'
import { detectMentions, caseIntensiveEquals, Trie } from '@/bin/utils'
import modal from './modal'
import pickerModal from './pickerModal'
import messageInput from './messageInput'
import messageEdit from './messageEdit'
const db = indexedDB.db

Vue.use(Vuex)

const loadGeneralData = (dataName, webLoad, commit) => {
  let loaded = false
  const fetch = webLoad().then(res => {
    loaded = true
    commit(`set${dataName}Data`, res.data)
    db.write('generalData', { type: dataName, data: res.data })
  })
  const getFromDB = db
    .read('generalData', dataName)
    .then(data => {
      if (!loaded && data) {
        commit(`set${dataName}Data`, data)
      } else {
        throw new Error('No data exists')
      }
    })
    .catch(async () => {
      await fetch
    })
  if (
    'navigator' in window &&
    'onLine' in window.navigator &&
    !window.navigator.onLine
  ) {
    return Promise.race([getFromDB])
  } else {
    return Promise.race([getFromDB, fetch])
  }
}

const stringSortGen = key => (lhs, rhs) => {
  const ls = lhs[key].toLowerCase()
  const rs = rhs[key].toLowerCase()
  if (ls < rs) {
    return -1
  } else if (ls > rs) {
    return 1
  } else {
    return 0
  }
}

const store = new Vuex.Store({
  modules: {
    modal,
    pickerModal,
    messageInput,
    messageEdit
  },
  state: {
    loaded: false,
    loadedComponent: false,
    channelData: [],
    channelMap: {},
    channelTrie: null,
    activityMessages: [],
    activityChannelIdSet: new Set(),
    openChannels: {},
    openUserLists: {},
    sidebarOpened: false,
    titlebarExpanded: false,
    memberData: [],
    memberMap: {},
    memberTrie: null,
    groupData: [],
    groupMap: {},
    stampData: [],
    stampMap: {},
    stampCategolized: {},
    stampNameMap: [],
    stampHistory: [],
    currentChannel: {},
    currentChannelUpdateDate: new Date(0),
    clipedMessages: {},
    unreadChannelMap: {},
    staredChannels: [],
    staredChannelMap: {},
    mutedChannels: [],
    mutedChannelMap: {},
    messages: [],
    channelTopicMap: {},
    currentChannelPinnedMessages: [],
    currentChannelNotifications: [],
    myNotifiedChannels: [],
    myNotifiedChannelSet: new Set(),
    me: null,
    menuContent: 'Channels',
    channelView: 'tree',
    heartbeatStatus: { userStatuses: [] },
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'https://traq-dev.tokyotech.org'
        : '',
    files: [],
    userModal: null,
    tagModal: null,
    directMessageId: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    editing: false,
    isActivePinnedModal: false,
    openMode: 'particular',
    openChannelId: '',
    lastChannelId: '',
    theme: 'light',
    windowWidth: 0,
    windowHeight: 0,
    filterSubscribedActivity: true,
    activeMessageContextMenu: '',
    isOnline: true,
    filterText: '',
    isUnreadFiltered: false,
    webhooks: [],
    messageSendKey: '',
    ecoMode: false
  },
  mutations: {
    openSidebar(state) {
      state.sidebarOpened = true
    },
    closeSidebar(state) {
      state.sidebarOpened = false
    },
    expandTitlebar(state) {
      state.titlebarExpanded = true
    },
    contractTitlebar(state) {
      state.titlebarExpanded = false
    },
    setMe(state, me) {
      state.me = me
      db.write('generalData', { type: 'me', data: me })
    },
    setChannelData(state, newChannelData) {
      newChannelData.sort(stringSortGen('name'))
      state.channelData = newChannelData
      const map = {}
      state.channelData.forEach(channel => {
        map[channel.channelId] = channel
      })
      state.channelMap = map
      state.channelData.forEach(channel => {
        if (channel.children) {
          channel.children.sort((lhs, rhs) =>
            stringSortGen('name')(state.channelMap[lhs], state.channelMap[rhs])
          )
        }
      })
      const root = state.channelData.find(channel => channel.channelId === '')
      const trie = new Trie()
      const buildTrie = (channel, acc) => {
        const path = (acc === '' ? '' : acc + '/') + channel.name
        trie.update(path, 0)
        if (channel.children) {
          channel.children.forEach(childId => {
            buildTrie(map[childId], path)
          })
        }
      }
      buildTrie(root, '')
      state.channelTrie = trie
    },
    setMemberData(state, newMemberData) {
      state.memberData = newMemberData
      let trie = new Trie()
      state.memberData.forEach(member => {
        if (!member.suspended) {
          trie.update(member.name, 0)
        }
        state.memberMap[member.userId] = member
      })
      state.memberTrie = trie
    },
    setGroupData(state, newGroupData) {
      newGroupData.forEach(group => {
        group.members = group.members.filter(
          userId => state.memberMap[userId].accountStatus !== 0
        )
      })
      state.groupData = newGroupData
      const map = {}
      state.groupData.forEach(group => {
        map[group.groupId] = group
      })
      state.groupMap = map
    },
    setStampData(state, newStampData) {
      state.stampData = newStampData
      state.stampCategolized = stampCategorizer(newStampData)
      state.stampData.sort(stringSortGen('name'))
      const stampMap = {}
      const stampNameMap = {}
      state.stampData.forEach(stamp => {
        stampMap[stamp.id] = stamp
        stampNameMap[stamp.name] = stamp
      })
      state.stampMap = stampMap
      state.stampNameMap = stampNameMap
    },
    setStampHistory(state, stampHistory) {
      state.stampHistory = stampHistory.map(
        stamp => state.stampMap[stamp.stampId]
      )
    },
    addMessages(state, message) {
      if (Array.isArray(message)) {
        state.messages.push(...message)
      } else {
        state.messages.push(message)
      }
      db.write('channelMessages', {
        channelId: state.currentChannel.channelId,
        data: state.messages.slice(-50)
      })
    },
    unshiftMessages(state, message) {
      if (Array.isArray(message)) {
        state.messages.unshift(...message)
      } else {
        state.messages.unshift(message)
      }
    },
    setMessages(state, messages) {
      state.messages = messages
    },
    updateMessage(state, message) {
      const index = state.messages.findIndex(
        mes => mes.messageId === message.messageId
      )
      if (index === -1) {
        return false
      }
      Vue.set(state.messages, index, message)
      db.write('channelMessages', {
        channelId: state.currentChannel.channelId,
        data: state.messages.slice(-50)
      })
      return true
    },
    deleteMessage(state, messageId) {
      state.messages = state.messages.filter(
        message => message.messageId !== messageId
      )
      db.write('channelMessages', {
        channelId: state.currentChannel.channelId,
        data: state.messages.slice(-50)
      })
    },
    changeChannel(state, channel) {
      state.currentChannel = channel
      const unread = state.unreadChannelMap[channel.channelId]
      if (unread) {
        state.currentChannelUpdateDate = new Date(unread.since)
      } else {
        state.currentChannelUpdateDate = new Date(0)
      }
      state.messages = []
    },
    loadStart(state) {
      state.loaded = false
    },
    loadEnd(state) {
      state.loaded = true
    },
    loadEndComponent(state) {
      state.loadedComponent = true
    },
    changeMenuContent(state, contentName) {
      state.menuContent = contentName
    },
    setClipedMessagesData(state, data) {
      data.forEach(message => {
        Vue.set(state.clipedMessages, message.messageId, message)
      })
    },
    setUnreadMessagesData(state, data) {
      const channelMap = {}
      data.forEach(channel => {
        channelMap[channel.channelId] = channel
      })
      state.unreadChannelMap = channelMap
    },
    addUnreadMessage(state, message) {
      if (message.userId === state.me.userId) {
        return
      }
      let channel = state.unreadChannelMap[message.parentChannelId]
      if (channel) {
        channel.count += 1
        channel.updatedAt = message.createdAt
        if (!channel.noticeable) {
          channel.noticeable = detectMentions(message.content).some(
            data => data.id === state.me.userId
          )
        }
      } else {
        channel = {
          channelId: message.parentChannelId,
          count: 1,
          since: message.createdAt,
          updatedAt: message.createdAt,
          noticeable: detectMentions(message.content).some(
            data => data.id === state.me.userId
          )
        }
      }
      Vue.set(state.unreadChannelMap, message.parentChannelId, channel)
    },
    readChannel(state, channelId) {
      if (state.unreadChannelMap[channelId]) {
        Vue.delete(state.unreadChannelMap, channelId)
      }
    },
    setStaredChannelsData(state, data) {
      state.staredChannels = data
      const map = {}
      state.staredChannels.forEach(channelId => {
        map[channelId] = true
      })
      state.staredChannelMap = map
    },
    setMutedChannelsData(state, data) {
      state.mutedChannels = data || []
      const map = {}
      data.forEach(channelId => {
        map[channelId] = true
      })
      state.mutedChannelMap = map
    },
    updateHeartbeatStatus(state, data) {
      state.heartbeatStatus = data
    },
    setChannelTopic(state, { data, channelId }) {
      Vue.set(state.channelTopicMap, channelId, data)
    },
    setCurrentChannelPinnedMessages(state, data) {
      state.currentChannelPinnedMessages = data
    },
    setCurrentChannelNotifications(state, data) {
      state.currentChannelNotifications = data
    },
    updateMessageStamp(state, data) {
      const index = state.messages.findIndex(
        e => e.messageId === data.message_id
      )
      if (index >= 0) {
        const message = state.messages[index]
        if (message.stampList) {
          const userData = message.stampList.find(
            e => e.userId === data.user_id && e.stampId === data.stamp_id
          )
          if (userData) {
            userData.count = data.count
          } else {
            message.stampList.push({
              userId: data.user_id,
              stampId: data.stamp_id,
              count: data.count,
              createdAt: data.created_at
            })
          }
        } else {
          message.stampList = [
            {
              userId: data.user_id,
              stampId: data.stamp_id,
              count: data.count,
              createdAt: data.created_at
            }
          ]
        }
        Vue.set(state.messages, index, message)
      }
      const pinnedIndex = state.currentChannelPinnedMessages.findIndex(
        e => e.message.messageId === data.message_id
      )
      if (pinnedIndex >= 0) {
        const message = state.currentChannelPinnedMessages[pinnedIndex].message
        if (message.stampList) {
          const userData = message.stampList.find(
            e => e.userId === data.user_id && e.stampId === data.stamp_id
          )
          if (userData) {
            userData.count = data.count
          } else {
            message.stampList.push({
              userId: data.user_id,
              stampId: data.stamp_id,
              count: data.count
            })
          }
        } else {
          message.stampList = [
            {
              userId: data.user_id,
              stampId: data.stamp_id,
              count: data.count
            }
          ]
        }
        Vue.set(
          state.currentChannelPinnedMessages,
          pinnedIndex,
          state.currentChannelPinnedMessages[pinnedIndex]
        )
      }
    },
    deleteMessageStamp(state, data) {
      const index = state.messages.findIndex(
        e => e.messageId === data.message_id
      )
      if (index >= 0) {
        const message = state.messages[index]
        if (message.stampList) {
          const userDataIndex = message.stampList.findIndex(
            e => e.userId === data.user_id && e.stampId === data.stamp_id
          )
          if (userDataIndex >= 0) {
            message.stampList = message.stampList.filter(
              (_, i) => i !== userDataIndex
            )
            Vue.set(state.messages, index, message)
          }
        }
      }
      const pinnedIndex = state.currentChannelPinnedMessages.findIndex(
        e => e.message.messageId === data.message_id
      )
      if (pinnedIndex >= 0) {
        const message = state.currentChannelPinnedMessages[pinnedIndex].message
        if (message.stampList) {
          const userDataIndex = message.stampList.findIndex(
            e => e.userId === data.user_id && e.stampId === data.stamp_id
          )
          if (userDataIndex >= 0) {
            message.stampList = message.stampList.filter(
              (_, i) => i !== userDataIndex
            )
            Vue.set(
              state.currentChannelPinnedMessages,
              pinnedIndex,
              state.currentChannelPinnedMessages[pinnedIndex]
            )
          }
        }
      }
    },
    setFiles(state, files) {
      state.files = files
    },
    clearFiles(state) {
      state.files = []
    },
    setEditing(state, isEditing) {
      state.editing = isEditing
    },
    removeMessage(state, messageId) {
      state.messages = state.messages.filter(
        message => message.messageId !== messageId
      )
    },
    setPinnedModal(state, isActive) {
      state.isActivePinnedModal = isActive
    },
    setUserOnline(state, { userId, isOnline }) {
      const user = state.memberMap[userId]
      user.isOnline = isOnline
      Vue.set(state.memberMap, userId, user)
    },
    setOpenChannels(state, data) {
      state.openChannels = data
    },
    setOpenUserLists(state, data) {
      state.openUserLists = data
    },
    setOpenUserList(state, { groupId, isOpen }) {
      Vue.set(state.openUserLists, groupId, isOpen)
    },
    setOpenChannel(state, { channelId, isOpen }) {
      Vue.set(state.openChannels, channelId, isOpen)
    },
    setOpenMode(state, mode) {
      state.openMode = mode
    },
    setOpenChannelId(state, channelId) {
      state.openChannelId = channelId
    },
    setLastChannelId(state, channelId) {
      state.lastChannelId = channelId
    },
    setTheme(state, themeName) {
      state.theme = themeName
    },
    setWindowSize(state, { windowWidth, windowHeight }) {
      state.windowWidth = windowWidth
      state.windowHeight = windowHeight
    },
    setMyNotifiedChannels(state, channels) {
      state.myNotifiedChannels = channels
      const set = new Set()
      channels.forEach(channelId => {
        set.add(channelId)
      })
      state.myNotifiedChannelSet = set
    },
    setActivityMessages(state, data) {
      state.activityMessages = data
      state.activityChannelIdSet = new Set(data.map(m => m.parentChannelId))
    },
    addActivityMessages(state, data) {
      if (state.activityChannelIdSet.has(data.parentChannelId)) {
        const index = state.activityMessages.findIndex(
          m => m.parentChannelId === data.parentChannelId
        )
        state.activityMessages.splice(index, 1)
        state.activityMessages = [data, ...state.activityMessages]
      } else {
        state.activityMessages = [data, ...state.activityMessages]
        state.activityChannelIdSet.add(data.parentChannelId)
      }
    },
    setFilterSubscribedActivity(state, data) {
      state.filterSubscribedActivity = data
    },
    setChannelView(state, mode) {
      state.channelView = mode
    },
    setActiveMessageContextMenu(state, messageId) {
      state.activeMessageContextMenu = messageId
    },
    changeNetwork(state, condition) {
      state.isOnline = condition
    },
    setFilterText(state, filterText) {
      state.filterText = filterText
    },
    setIsUnreadFiltered(state, isUnreadFiltered) {
      state.isUnreadFiltered = isUnreadFiltered
    },
    setWebhooks(state, webhooks) {
      state.webhooks = webhooks
    },
    setMessageSendKey(state, key) {
      state.messageSendKey = key
    },
    setEcoMode(state, ecoModeEnabled) {
      state.ecoMode = ecoModeEnabled
    }
  },
  getters: {
    channelTopic(state) {
      return channelId => state.channelTopicMap[channelId] || ''
    },
    activeMessageContextMenu(state) {
      return state.activeMessageContextMenu
    },
    channelView(state) {
      return state.channelView
    },
    theme(state) {
      return typeof state.theme === 'string' ? state.theme : 'light'
    },
    windowWidth(state) {
      return state.windowWidth
    },
    windowHeight(state) {
      return state.windowHeight
    },
    childrenChannels(state) {
      return parentId =>
        state.channelData.filter(
          channel => channel.parent === parentId && channel.name !== ''
        )
    },
    allChannels(state) {
      return state.channelData.filter(
        channel =>
          channel.parent !== 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa' &&
          channel.name !== ''
      )
    },
    getChannelByName(state, getters) {
      return channelName => {
        const channelLevels = channelName.split('/')
        let channel = null
        let channelId = ''
        channelLevels.forEach(name => {
          const levelChannels = getters.childrenChannels(channelId)
          channel = levelChannels.find(ch => caseIntensiveEquals(ch.name, name))
          if (channel === undefined) return null
          channelId = channel.channelId
        })
        return channel
      }
    },
    getDirectMessageChannels(state) {
      return state.channelData.filter(channel => channel.dm)
    },
    getUserByName(state, getters) {
      return userName => {
        const user = getters.memberData.find(user =>
          caseIntensiveEquals(user.name, userName)
        )
        if (user) {
          return user
        } else {
          return null
        }
      }
    },
    getChannelPathById(state) {
      return channelId => {
        let current = state.channelMap[channelId]
        let path = current.name
        let next = state.channelMap[current.parent]
        while (next.name) {
          path = next.name + '/' + path
          current = next
          next = state.channelMap[current.parent]
        }
        return path
      }
    },
    getShortChannelPathById(state) {
      return channelId => {
        let current = state.channelMap[channelId]
        let path = current.name
        let next = state.channelMap[current.parent]
        while (next.name) {
          path = next.name[0] + '/' + path
          current = next
          next = state.channelMap[current.parent]
        }
        return path
      }
    },
    getFileDataById() {
      return fileId => {
        return client.getFileMeta(fileId)
      }
    },
    isPinned(state) {
      return messageId => {
        return state.currentChannelPinnedMessages.find(
          pin => pin.message.messageId === messageId
        )
      }
    },
    getMyId(state) {
      return state.me ? state.me.userId : ''
    },
    getMyName(state) {
      return state.me ? state.me.name : ''
    },
    notificationsOnMembers(state) {
      return state.currentChannelNotifications.map(id => state.memberMap[id])
    },
    notificationsOffMembers(state, getters) {
      return getters.memberData.filter(
        user =>
          !state.currentChannelNotifications.find(id => id === user.userId)
      )
    },
    getCurrentChannelUpdateDate(state) {
      return state.currentChannelUpdateDate
    },
    getChannelUnreadMessageNum(state) {
      return channelId => {
        if (!state.unreadChannelMap[channelId]) {
          return 0
        }
        return state.unreadChannelMap[channelId].count
      }
    },
    getChannelUnreadMessageSum(state, getters) {
      return channelId => {
        let sum = getters.getChannelUnreadMessageNum(channelId)
        if (
          !state.channelMap[channelId] ||
          !state.channelMap[channelId].children ||
          !Array.isArray(state.channelMap[channelId].children)
        ) {
          return sum
        }
        return state.channelMap[channelId].children
          .filter(child => child.channelId !== state.directMessageId)
          .map(child => getters.getChannelUnreadMessageSum(child))
          .reduce((a, b) => a + b, sum)
      }
    },
    getUnreadMessageNum(state, getters) {
      return Object.keys(state.unreadChannelMap).reduce((pre, channelId) => {
        return pre + getters.getChannelUnreadMessageNum(channelId)
      }, 0)
    },
    getUnreadDirectMessagesSum(state, getters) {
      return getters.getDirectMessageChannels.reduce((pre, channel) => {
        return pre + getters.getChannelUnreadMessageNum(channel.channelId)
      }, 0)
    },
    getStaredChannels(state) {
      const channels = state.staredChannels.map(
        channelId => state.channelMap[channelId]
      )
      channels.sort(stringSortGen('name'))
      return channels
    },
    getUserIdByDirectMessageChannel(state) {
      return channel => {
        if (!channel.dm) {
          return ''
        }
        if (channel.member.length === 1) {
          return channel.member[0]
        } else {
          return channel.member.find(userId => userId !== state.me.userId)
        }
      }
    },
    deviceType(state) {
      return state.windowWidth < 680 ? 'sp' : 'pc'
    },
    isSidebarOpened(state) {
      return state.sidebarOpened
    },
    isTitlebarExpanded(state) {
      return state.titlebarExpanded
    },
    fileUrl(state) {
      return fileId => {
        return `${state.baseURL}/api/1.0/files/${fileId}`
      }
    },
    grades(state) {
      return state.groupData.filter(
        group => group.type === 'grade' && group.members.length > 0
      )
    },
    sortedGrades(state, getters) {
      const map = {
        B: 3,
        M: 2,
        D: 1,
        R: 0
      }
      const f = s => {
        return map[s[2]] * 100 + parseInt(s.substr(0, 2), 10)
      }
      const gradeReg = /^\d\d[BMDR]$/
      return getters.grades.sort((lhs, rhs) => {
        if (gradeReg.test(lhs.name) && gradeReg.test(rhs.name)) {
          return f(rhs.name) - f(lhs.name)
        } else if (gradeReg.test(lhs.name)) {
          return -1
        } else if (gradeReg.test(rhs.name)) {
          return 1
        } else {
          if (lhs.name < rhs.name) {
            return -1
          } else {
            return 1
          }
        }
      })
    },
    memberData(state) {
      return state.memberData.filter(user => user.accountStatus !== 0)
    },
    nonBotUsers(state, getters) {
      return getters.memberData.filter(user => !user.bot)
    },
    gradeByUserMap(state, getters) {
      const map = {}
      getters.nonBotUsers.forEach(u => {
        let gradeObj = getters.grades.find(g =>
          g.members.some(userId => userId === u.userId)
        )
        map[u.userId] = gradeObj || undefined
      })
      return map
    },
    getGroupByContent(state) {
      return groupName =>
        state.groupData.find(group =>
          caseIntensiveEquals(group.name, groupName)
        )
    },
    userDisplayName(state) {
      return userId => state.memberMap[userId].displayName
    },
    stampHistory(state) {
      return state.stampHistory
    },
    filteringUser(state) {
      return users =>
        users.filter(userId => state.memberData[userId].accountStatus !== 0)
    },
    sortByUserId(state) {
      return userIds =>
        userIds
          .map(userId => state.memberMap[userId])
          .sort(stringSortGen('name'))
          .map(user => user.userId)
    },
    filterText(state) {
      return state.filterText
    },
    isUnreadFiltered(state) {
      return state.isUnreadFiltered
    },
    getWebhookUserIds(state) {
      return state.webhooks.map(w => w.botUserId)
    },
    getChannelPrefix(state) {
      return s => state.channelTrie.query(s, 0, '')
    },
    getMemberPrefix(state) {
      return s => state.memberTrie.query(s, 0, '')
    }
  },
  actions: {
    whoAmI({ commit }) {
      return client
        .whoAmI()
        .then(res => {
          commit('setMe', res.data)
        })
        .catch(() => {
          commit('setMe', null)
        })
    },
    getMessages({ state, commit, getters, dispatch }, update) {
      const nowChannel = state.currentChannel
      let loaded = false
      const latest = state.messages.length === 0 || update
      if (latest) {
        db.read('channelMessages', nowChannel.channelId)
          .then(data => {
            if (!loaded && data) {
              commit('setMessages', data)
            }
          })
          .catch(() => {})
      }
      const loadedMessages = !nowChannel.dm
        ? client.loadMessages(
            nowChannel.channelId,
            20,
            latest ? 0 : state.messages.length
          )
        : client.loadDirectMessages(
            getters.getUserIdByDirectMessageChannel(nowChannel),
            20,
            latest ? 0 : state.messages.length
          )
      return loadedMessages.then(res => {
        loaded = true
        const messages = res.data.reverse()
        dispatch('readMessages', nowChannel.channelId)
        if (latest) {
          db.write('channelMessages', {
            channelId: nowChannel.channelId,
            data: messages
          })
        }
        if (nowChannel === state.currentChannel) {
          if (latest) {
            commit('setMessages', messages)
            return messages.length > 0
          } else {
            commit('unshiftMessages', messages)
            return messages.length > 0
          }
        }
        return false
      })
    },
    async updateChannels({ commit }) {
      return loadGeneralData('Channel', client.getChannels, commit)
    },
    updateMembers({ commit }) {
      return loadGeneralData('Member', client.getMembers, commit)
    },
    updateGroups({ commit }) {
      return loadGeneralData('Group', client.getAllGroups, commit)
    },
    updateStamps({ commit }) {
      return loadGeneralData('Stamp', client.getStamps, commit)
    },
    getStampHistory({ commit }) {
      client.getStampHistory().then(res => {
        commit('setStampHistory', res.data)
      })
    },
    updateWebhooks({ commit }) {
      client.getWebhooks().then(res => commit('setWebhooks', res.data))
    },
    addStamp({ commit, state }, stampId) {
      return client.getStampDetail(stampId).then(res => {
        commit('setStampData', state.stampData.concat([res.data]))
      })
    },
    updateClipedMessages({ commit }) {
      return loadGeneralData(
        'ClipedMessages',
        client.getAllClipMessages,
        commit
      )
    },
    updateUnreadMessages({ commit }) {
      return loadGeneralData('UnreadMessages', client.getUnreadChannels, commit)
    },
    updateStaredChannels({ commit }) {
      return loadGeneralData('StaredChannels', client.getStaredChannels, commit)
    },
    updateMutedChannels({ commit }) {
      return loadGeneralData('MutedChannels', client.getMutedChannels, commit)
    },
    getChannelTopic({ commit }, channelId) {
      return client.getChannelTopic(channelId).then(res => {
        commit('setChannelTopic', { data: res.data.text, channelId })
      })
    },
    getCurrentChannelPinnedMessages({ commit }, channelId) {
      return client.getPinnedMessages(channelId).then(res => {
        commit('setCurrentChannelPinnedMessages', res.data)
      })
    },
    getCurrentChannelNotifications({ commit }, channelId) {
      return client.getNotifications(channelId).then(res => {
        commit('setCurrentChannelNotifications', res.data)
      })
    },
    addChannel({ state, commit }, channelId) {
      return client.getChannelInfo(channelId).then(res => {
        const parent = state.channelData.find(
          channel => channel.channelId === res.data.parent
        )
        if (parent) {
          if (parent.children) {
            parent.children.push(channelId)
          } else {
            parent.children = [channelId]
          }
        }
        commit('setChannelData', [res.data].concat(state.channelData))
      })
    },
    deleteChannel({ state, commit }, channelId) {
      const parent = state.channel.find(
        channel => channel.channelId === state.channelMap[channelId].parent
      )
      if (parent) {
        parent.children = parent.children.filter(c => c !== channelId)
      }
      commit(
        'setChannelData',
        state.channelData.filter(channel => channel.channelId !== channelId)
      )
    },
    updateChannel({ state, commit }, channelId) {
      return client.getChannelInfo(channelId).then(res => {
        commit(
          'setChannelData',
          [res.data].concat(
            state.channelData.filter(channel => channel.channelId !== channelId)
          )
        )
      })
    },
    checkPinnedMessage({ state, dispatch }, messageId) {
      if (
        state.currentChannelPinnedMessages.find(
          pin => pin.message.messageId === messageId
        )
      ) {
        dispatch(
          'getCurrentChannelPinnedMessages',
          state.currentChannel.channelId
        )
      }
    },
    updateUserOnline({ state, commit }, { userId, isOnline }) {
      commit('setUserOnline', { userId, isOnline })
      if (state.modal.data && state.modal.data.userId === userId) {
        commit('modal/setModalData', state.memberMap[userId])
      }
    },
    updateChannelOpen({ state, commit }, { channelId, isOpen }) {
      commit('setOpenChannel', { channelId, isOpen })
      return db.write('generalData', {
        type: 'openChannels',
        data: state.openChannels
      })
    },
    updateUserListOpen({ state, commit }, { groupId, isOpen }) {
      commit('setOpenUserList', { groupId, isOpen })
      return db.write('generalData', {
        type: 'openUserLists',
        data: state.openUserLists
      })
    },
    loadSetting({ dispatch }) {
      return Promise.all([
        dispatch('loadOpenMode'),
        dispatch('loadOpenChannelId'),
        dispatch('loadLastChannelId'),
        dispatch('loadTheme'),
        dispatch('loadOpenChannels'),
        dispatch('loadFilterSubscribedActivity'),
        dispatch('loadOpenUserLists'),
        dispatch('loadChannelView'),
        dispatch('loadMessageSendKey'),
        dispatch('loadEcoMode')
      ])
    },
    loadOpenMode({ commit, dispatch }) {
      return db
        .read('browserSetting', 'openMode')
        .then(data => {
          commit('setOpenMode', data)
        })
        .catch(async () => {
          await dispatch('updateOpenMode', 'particular')
        })
    },
    loadOpenChannelId({ commit, dispatch, getters }) {
      return db
        .read('browserSetting', 'openChannelId')
        .then(data => {
          commit('setOpenChannelId', data)
        })
        .catch(async () => {
          await dispatch(
            'updateOpenChannelId',
            getters.getChannelByName('general').channelId
          )
        })
    },
    loadLastChannelId({ commit, dispatch, getters }) {
      return db
        .read('browserSetting', 'lastChannelId')
        .then(data => {
          commit('setLastChannelId', data)
        })
        .catch(async () => {
          await dispatch(
            'updateLastChannelId',
            getters.getChannelByName('general').channelId
          )
        })
    },
    loadTheme({ commit, dispatch }) {
      return db
        .read('browserSetting', 'theme')
        .then(data => {
          commit('setTheme', data)
        })
        .catch(async () => {
          await dispatch('updateTheme', 'light')
        })
    },
    loadOpenChannels({ commit }) {
      return db
        .read('generalData', 'openChannels')
        .then(data => {
          commit('setOpenChannels', data || {})
        })
        .catch(() => {
          commit('setOpenChannels', {})
        })
    },
    loadOpenUserLists({ commit }) {
      return db
        .read('generalData', 'openUserLists')
        .then(data => {
          commit('setOpenUserLists', data || {})
        })
        .catch(() => {
          commit('setOpenUserLists', {})
        })
    },
    loadMessageSendKey({ commit, dispatch }) {
      return db
        .read('browserSetting', 'messageSendKey')
        .then(data => {
          commit('setMessageSendKey', data)
        })
        .catch(async () => {
          await dispatch('updateMessageSendKey', 'modifier')
        })
    },
    loadEcoMode({ commit, dispatch }) {
      return db
        .read('browserSetting', 'ecoMode')
        .then(data => {
          commit('setEcoMode', data)
        })
        .catch(async () => {
          await dispatch('updateEcoMode', false)
        })
    },
    updateOpenMode({ commit }, mode) {
      commit('setOpenMode', mode)
      return db.write('browserSetting', { type: 'openMode', data: mode })
    },
    updateOpenChannelId({ commit }, channelId) {
      commit('setOpenChannelId', channelId)
      return db.write('browserSetting', {
        type: 'openChannelId',
        data: channelId
      })
    },
    updateLastChannelId({ commit }, channelId) {
      commit('setLastChannelId', channelId)
      return db.write('browserSetting', {
        type: 'lastChannelId',
        data: channelId
      })
    },
    updateTheme({ commit }, themeName) {
      commit('setTheme', themeName)
      return db.write('browserSetting', { type: 'theme', data: themeName })
    },
    async updateChannelActivity({ state, commit }) {
      const filter = state.filterSubscribedActivity || false
      const res = await client.getLatestMessages(50, filter)
      commit('setActivityMessages', res.data)
    },
    async updateMyNotifiedChannels({ commit }) {
      const res = await client.getMyNotifiedChannels()
      const data = res.data
      if (!data) return
      commit('setMyNotifiedChannels', data)
    },
    async updateCurrentChannelNotifications({ state, dispatch }, { on, off }) {
      await client.changeNotifications(state.currentChannel.channelId, {
        on: on || [],
        off: off || []
      })
      await dispatch(
        'getCurrentChannelNotifications',
        state.currentChannel.channelId
      )
    },
    async updateCurrentChannelTopic({ state, dispatch }, text) {
      const channelId = state.currentChannel.channelId
      await client.changeChannelTopic(channelId, text)
      await dispatch('getChannelTopic', channelId)
    },
    updateFilterSubscribedActivity({ commit }, filter) {
      commit('setFilterSubscribedActivity', filter)
      return db.write('browserSetting', {
        type: 'filterSubscribedActivity',
        data: filter
      })
    },
    loadFilterSubscribedActivity({ commit, dispatch }) {
      return db
        .read('browserSetting', 'filterSubscribedActivity')
        .then(data => {
          commit('setFilterSubscribedActivity', data)
        })
        .catch(async () => {
          await dispatch('updateFilterSubscribedActivity', true)
        })
    },
    readMessages({ dispatch }, channelId) {
      return client.readMessages(channelId).then(() => {
        dispatch('updateUnreadMessages')
      })
    },
    updateChannelView({ commit }, mode) {
      commit('setChannelView', mode)
      return db.write('browserSetting', { type: 'channelView', data: mode })
    },
    loadChannelView({ commit, dispatch }) {
      return db
        .read('browserSetting', 'channelView')
        .then(data => {
          commit('setChannelView', data)
        })
        .catch(async () => {
          await dispatch('updateChannelView', 'tree')
        })
    },
    updateMessageSendKey({ commit }, key) {
      commit('setMessageSendKey', key)
      return db.write('browserSetting', { type: 'messageSendKey', data: key })
    },
    updateEcoMode({ commit }, ecoModeEnabled) {
      commit('setEcoMode', ecoModeEnabled)
      return db.write('browserSetting', {
        type: 'ecoMode',
        data: ecoModeEnabled
      })
    }
  }
})

window.openUserModal = userId => {
  store.dispatch('openUserModal', userId)
}

window.openGroupModal = groupId => {
  store.dispatch('openGroupModal', groupId)
}

export default store
