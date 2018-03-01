import Vue from 'vue'
import Vuex from 'vuex'
import client from '@/bin/client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaded: false,
    channelData: [],
    channelMap: {},
    memberData: [],
    memberMap: {},
    currentChannel: {},
    clipedMessages: {},
    messages: [],
    messagesNum: 0,
    currentChannelTopic: {},
    currentChannelPinnedMessages: [],
    me: null,
    menuContent: 'channels',
    heartbeatStatus: {userStatuses: []}
  },
  mutations: {
    setMe (state, me) {
      state.me = me
    },
    setChannelData (state, newChannelData) {
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
    addMessages (state, message) {
      state.messages.push(message)
      state.messagesNum++
    },
    setMessages (state, messages) {
      state.messages = messages
    },
    setChannel (state, channelName) {
      if (!state.channelMap[channelName]) return
      state.channelName = channelName
      state.channelId = state.channelMap[channelName].channelId
      state.currentChannel = state.channelMap[channelName]
      state.messagesNum = 0
      state.messages = []
      this.dispatch('getMessages')
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
    changeMenuContent (state, contentName) {
      state.menuContent = contentName
    },
    setClipedMessages (state, data) {
      data.forEach(message => {
        Vue.set(state.clipedMessages, message.messageId, message)
      })
    },
    updateHeartbeatStatus (state, data) {
      state.heartbeatStatus = data
    },
    setCurrentChannelTopic (state, data) {
      state.currentChannelTopic = data
    },
    setCurrentChannelPinnedMessages (state, data) {
      state.currentChannelPinnedMessages = data
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
          channelId = channel.channelId
        })
        return channel
      }
    },
    getChannelPathById (state) {
      return channelId => {
        console.log(channelId)
        let current = state.channelMap[channelId]
        let path = current.name
        while (true) {
          const next = state.channelMap[current.parent]
          console.log(next)
          if (!next.name) {
            return path
          }
          path = next.name + '/' + path
          current = next
        }
      }
    },
    isPinned (state) {
      return messageId => {
        return state.currentChannelPinnedMessages.find(pin => pin.message.messageId === messageId)
      }
    },
    getMyId (state) {
      return state.me.userId
    },
    getMyName (state) {
      return state.me.name
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
    getMessages ({state, commit}) {
      let nowChannel = state.currentChannel
      return client.loadMessages(state.currentChannel.channelId, 50, state.messagesNum)
      .then(res => {
        if (nowChannel === state.currentChannel) {
          state.messagesNum += res.data.length
          commit('setMessages', res.data.reverse().concat(state.messages))
        }
      })
    },
    updateChannels ({state, commit}) {
      return client.getChannels()
      .then(res => {
        commit('setChannelData', res.data)
      })
    },
    updateMembers ({state, commit}) {
      return client.getMembers()
      .then(res => {
        commit('setMemberData', res.data)
      })
    },
    updateClipedMessages ({state, commit}) {
      return client.getClipedMessages()
      .then(res => {
        commit('setClipedMessages', res.data)
      })
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
    }
  }
})
