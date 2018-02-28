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
    messages: [],
    messagesNum: 0,
    me: null,
    myId: '',
    myName: '',
    menuContent: 'channels'
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
      this.dispatch('getMessages')
    },
    loadStart (state) {
      state.loaded = false
    },
    loadEnd (state) {
      state.loaded = true
    },
    changeMenuContent (state, contentName) {
      state.menuContent = contentName
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
    }
  }
})
