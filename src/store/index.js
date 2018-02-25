import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/bin/axios'

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
    menuContent: 'channels'
  },
  mutations: {
    setUrl (state, newUrl) { state.url = newUrl },
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
    setMessages (state, messages) {
      state.messages = messages
    },
    setChannel (state, channelName) {
      if (!state.channelMap[channelName]) return
      state.channelName = channelName
      state.channelId = state.channelMap[channelName].channelId
      state.currentChannel = state.channelMap[channelName]
      this.dispatch('getMessages')
    },
    changeChannel (state, channel) {
      state.currentChannel = channel
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
    }
  },
  actions: {
    getMessages ({state, commit}) {
      return axios.get('/api/1.0/channels/' + state.currentChannel.channelId + '/messages')
      .then(res => {
        commit('setMessages', res.data.reverse())
      })
      .catch(err => {
        console.error(err)
      })
    },
    updateChannels ({state, commit}) {
      return axios.get('/api/1.0/channels')
      .then(res => {
        commit('setChannelData', res.data)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
    },
    updateMembers ({state, commit}) {
      return axios.get('/api/1.0/users')
      .then(res => {
        commit('setMemberData', res.data)
      })
      .catch(err => {
        console.error(err)
      })
    }
  }
})
