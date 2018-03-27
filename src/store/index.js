import Vue from 'vue'
import Vuex from 'vuex'
import client from '@/bin/client'
import indexedDB from '@/bin/indexeddb'
import stampCategorizer from '@/bin/stampCategorizer'
const db = indexedDB.db

Vue.use(Vuex)

const loadGeneralData = (dataName, webLoad, commit) => {
  let loaded = false
  return Promise.race([
    db.read('generalData', dataName)
      .then(data => {
        if (!loaded && data) {
          commit(`set${dataName}Data`, data)
        }
      }),
    webLoad()
      .then(res => {
        loaded = true
        commit(`set${dataName}Data`, res.data)
        db.write('generalData', {type: dataName, data: res.data})
      })
  ])
}

export default new Vuex.Store({
  state: {
    loaded: false,
    loadedComponent: false,
    channelData: [],
    channelMap: {},
    memberData: [],
    memberMap: {},
    tagData: [],
    tagMap: {},
    stampData: [],
    stampMap: {},
    stampCategolized: {},
    stampNameMap: [],
    currentChannel: {},
    clipedMessages: {},
    unreadMessages: {},
    staredChannels: [],
    messages: [],
    messagesNum: 0,
    currentChannelTopic: {},
    currentChannelPinnedMessages: [],
    currentChannelNotifications: [],
    me: null,
    menuContent: 'channels',
    heartbeatStatus: {userStatuses: []},
    baseURL: process.env.NODE_ENV === 'development' ? 'https://traq-dev.tokyotech.org' : '',
    files: []
  },
  mutations: {
    setMe (state, me) {
      state.me = me
    },
    setChannelData (state, newChannelData) {
      newChannelData.sort((lhs, rhs) => {
        let ls = lhs.name.toLowerCase()
        let rs = rhs.name.toLowerCase()
        if (ls < rs) {
          return -1
        } else if (ls > rs) {
          return 1
        } else {
          return 0
        }
      })
      state.channelData = newChannelData
      function dfs (channel) {
        state.channelMap[channel.channelId] = channel
      }
      state.channelData.forEach(dfs)
    },
    setMemberData (state, newMemberData) {
      state.memberData = newMemberData
      state.memberData.forEach(member => {
        state.memberMap[member.userId] = member
      })
    },
    setTagData (state, newTagData) {
      state.tagData = newTagData
      state.tagData.forEach(tag => {
        state.tagMap[tag.tagId] = tag
      })
    },
    setStampData (state, newStampData) {
      state.stampData = newStampData
      state.stampCategolized = stampCategorizer(newStampData)
      state.stampData.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        } else if (a.name > b.name) {
          return 1
        } else {
          return 0
        }
      })
      state.stampData.forEach(stamp => {
        state.stampMap[stamp.id] = stamp
        state.stampNameMap[stamp.name] = stamp
      })
    },
    addMessages (state, message) {
      if (Array.isArray(message)) {
        state.messages.push(...message)
      } else {
        state.messages.push(message)
      }
      state.messagesNum = state.messages.length
      db.write('channelMessages', {channelId: state.currentChannel.channelId, data: state.messages.slice(-50)})
    },
    unshiftMessages (state, message) {
      if (Array.isArray(message)) {
        state.messages.unshift(...message)
      } else {
        state.messages.unshift(message)
      }
      state.messagesNum = state.messages.length
    },
    setMessages (state, messages) {
      state.messages = messages
      state.messagesNum = state.messages.length
    },
    updateMessage (state, message) {
      const index = state.messages.findIndex(mes => mes.messageId === message.messageId)
      if (index === -1) {
        return false
      }
      Vue.set(state.messages, index, message)
      db.write('channelMessages', {channelId: state.currentChannel.channelId, data: state.messages.slice(-50)})
      return true
    },
    deleteMessage (state, messageId) {
      state.messages = state.messages.filter(message => message.messageId !== messageId)
      db.write('channelMessages', {channelId: state.currentChannel.channelId, data: state.messages.slice(-50)})
    },
    changeChannel (state, channel) {
      state.currentChannel = channel
      state.messagesNum = 0
      state.messages = []
    },
    loadStart (state) {
      state.loaded = false
    },
    loadEnd (state) {
      state.loaded = true
    },
    loadEndComponent (state) {
      state.loadedComponent = true
    },
    changeMenuContent (state, contentName) {
      state.menuContent = contentName
    },
    setClipedMessagesData (state, data) {
      data.forEach(message => {
        Vue.set(state.clipedMessages, message.messageId, message)
      })
    },
    setUnreadMessagesData (state, data) {
      const mp = {}
      data.forEach(message => {
        if (mp[message.parentChannelId]) {
          mp[message.parentChannelId][message.messageId] = message
        } else {
          mp[message.parentChannelId] = {}
          mp[message.parentChannelId][message.messageId] = message
        }
      })
      state.unreadMessages = mp
    },
    setStaredChannelsData (state, data) {
      state.staredChannels = data
    },
    updateHeartbeatStatus (state, data) {
      state.heartbeatStatus = data
    },
    setCurrentChannelTopic (state, data) {
      state.currentChannelTopic = data
    },
    setCurrentChannelPinnedMessages (state, data) {
      state.currentChannelPinnedMessages = data
    },
    setCurrentChannelNotifications (state, data) {
      state.currentChannelNotifications = data
    },
    updateMessageStamp (state, data) {
      const index = state.messages.findIndex(e => e.messageId === data.message_id)
      if (index >= 0) {
        const message = state.messages[index]
        if (message.stampList) {
          const userData = message.stampList.find(e => e.userId === data.user_id && e.stampId === data.stamp_id)
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
          message.stampList = [{
            userId: data.user_id,
            stampId: data.stamp_id,
            count: data.count
          }]
        }
        Vue.set(state.messages, index, message)
      }
    },
    deleteMessageStamp (state, data) {
      const index = state.messages.findIndex(e => e.messageId === data.message_id)
      if (index >= 0) {
        const message = state.messages[index]
        if (message.stampList) {
          const userDataIndex = message.stampList.findIndex(e => e.userId === data.user_id && e.stampId === data.stamp_id)
          if (userDataIndex >= 0) {
            message.stampList = message.stampList.filter((_, i) => i !== userDataIndex)
            Vue.set(state.messages, index, message)
          }
        }
      }
    },
    setFiles (state, files) {
      state.files = files
    },
    clearFiles (state) {
      state.files = []
    }
  },
  getters: {
    childrenChannels (state) { return parentId => state.channelData.filter(channel => channel.parent === parentId && channel.name !== '') },
    getChannelByName (state, getters) {
      return channelName => {
        const channelLevels = channelName.split('/')
        let channel = null
        let channelId = ''
        channelLevels.forEach(name => {
          const levelChannels = getters.childrenChannels(channelId)
          channel = levelChannels.find(ch => ch.name === name)
          if (channel === undefined) return null
          channelId = channel.channelId
        })
        return channel
      }
    },
    getUserByName (state, getters) {
      return userName => {
        const user = state.memberData.find(user => user.name === userName)
        if (user) {
          return user
        } else {
          return null
        }
      }
    },
    getChannelPathById (state) {
      return channelId => {
        let current = state.channelMap[channelId]
        let path = current.name
        while (true) {
          const next = state.channelMap[current.parent]
          if (!next.name) {
            return path
          }
          path = next.name + '/' + path
          current = next
        }
      }
    },
    getTagByContent (state) {
      return tagContent => {
        const tag = state.tagData.find(tag => tag.tag === tagContent)
        if (tag) {
          return tag
        } else {
          return null
        }
      }
    },
    getFileDataById (state) {
      return fileId => {
        return client.getFileMeta(fileId)
      }
    },
    isPinned (state) {
      return messageId => {
        return state.currentChannelPinnedMessages.find(pin => pin.message.messageId === messageId)
      }
    },
    getMyId (state) {
      return state.me ? state.me.userId : ''
    },
    getMyName (state) {
      return state.me ? state.me.name : ''
    },
    notificationsOnMembers (state) {
      return state.currentChannelNotifications.map(id => state.memberMap[id])
    },
    notificationsOffMembers (state) {
      return state.memberData.filter(member => !state.currentChannelNotifications.find(id => id === member.userId))
    },
    getChannelUnreadMessageNum (state) {
      return channelId => {
        if (!state.unreadMessages[channelId]) {
          return 0
        }
        return Object.keys(state.unreadMessages[channelId]).length
      }
    }
  },
  actions: {
    whoAmI ({state, commit}) {
      return client.whoAmI()
      .then(res => {
        commit('setMe', res.data)
      })
      .catch(() => {
        commit('setMe', null)
      })
    },
    getMessages ({state, commit, dispatch}) {
      let nowChannel = state.currentChannel
      let loaded = false
      const latest = state.messagesNum === 0
      if (latest) {
        db.read('channelMessages', nowChannel.channelId)
          .then(data => {
            if (!loaded && data) {
              commit('setMessages', data)
            }
          })
      }
      return client.loadMessages(nowChannel.channelId, 50, state.messagesNum)
        .then(res => {
          loaded = true
          const messages = res.data.reverse()
          if (state.unreadMessages[nowChannel.channelId] && Object.keys(state.unreadMessages[nowChannel.channelId]).length > 0) {
            client.readMessages(
              Object.keys(state.unreadMessages[nowChannel.channelId])
            ).then(() => dispatch('updateUnreadMessages'))
          }
          if (latest) {
            db.write('channelMessages', {channelId: nowChannel.channelId, data: messages})
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
    updateChannels ({state, commit}) {
      return loadGeneralData('Channel', client.getChannels, commit)
    },
    updateMembers ({state, commit}) {
      return loadGeneralData('Member', client.getMembers, commit)
    },
    updateTags ({state, commit}) {
      return loadGeneralData('Tag', client.getAllTags, commit)
    },
    updateStamps ({state, commit}) {
      return loadGeneralData('Stamp', client.getStamps, commit)
    },
    updateClipedMessages ({state, commit}) {
      return loadGeneralData('ClipedMessages', client.getClipedMessages, commit)
    },
    updateUnreadMessages ({state, commit}) {
      return loadGeneralData('UnreadMessages', client.getUnreadMessages, commit)
    },
    updateStaredChannels ({state, commit}) {
      return loadGeneralData('StaredChannels', client.getStaredChannels, commit)
    },
    getCurrentChannelTopic ({state, commit}, channelId) {
      return client.getChannelTopic(channelId)
        .then(res => {
          commit('setCurrentChannelTopic', res.data)
        })
    },
    getCurrentChannelPinnedMessages ({state, commit}, channelId) {
      return client.getPinnedMessages(channelId)
        .then(res => {
          commit('setCurrentChannelPinnedMessages', res.data)
        })
    },
    getCurrentChannelNotifications ({state, commit}, channelId) {
      return client.getNotifications(channelId)
        .then(res => {
          commit('setCurrentChannelNotifications', res.data)
        })
    }
  }
})
