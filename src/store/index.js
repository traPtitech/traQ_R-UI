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
    messagesNum: 0
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
      let nowChannel = state.currentChannel
      return axios.get(
        '/api/1.0/channels/' + state.currentChannel.channelId + '/messages',
        {
          params: {
            limit: 50,
            offset: state.messagesNum
          }
        }
      )
      .then(res => {
        if (nowChannel === state.currentChannel) {
          state.messagesNum += res.data.length
          commit('setMessages', res.data.reverse().concat(state.messages))
        }
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
