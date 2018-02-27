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
    channelTopic: '',
    messages: [],
    messagesNum: 0,
    myId: '',
    myName: '',
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
    addMessages (state, message) {
      state.messages.push(message)
    },
    setMessages (state, messages) {
      state.messages = messages
    },
    changeChannel (state, channel) {
      state.currentChannel = channel
      this.commit('setMessages', [])
      this.dispatch('loadMessages')
      this.dispatch('loadChannelTopic')
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
      if (state.myId !== '') {
        return state.myId
      }
      axios.get('/api/1.0/users/me')
      .then(res => {
        state.myId = res.data.userId
        state.myName = res.data.name
      })
    },
    getMyName (state) {
      if (state.myName !== '') {
        return state.myName
      }
      axios.get('/api/1.0/users/me')
      .then(res => {
        state.myId = res.data.userId
        state.myName = res.data.name
      })
    }
  },
  actions: {
    loadMessages ({state, commit}) {
      let nowChannel = state.currentChannel
      return axios.get(
        '/api/1.0/channels/' + state.currentChannel.channelId + '/messages',
        {
          params: {
            limit: 50,
            offset: state.messages.length
          }
        }
      )
      .then(res => {
        if (nowChannel === state.currentChannel) {
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
    },
    loadChannelTopic ({state, commit}) {
      return axios.get('/api/1.0/channels/' + state.currentChannel.channelId + '/topic')
      .then(res => {
        commit('setChannelTopic', res.data)
      })
    }
  }
})
