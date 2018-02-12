import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: 'https://traq-dev.herokuapp.com',
    channelData: [],
    channelName: '',
    channelId: '',
    channelMap: {}
  },
  mutations: {
    setUrl (state, newUrl) { state.url = newUrl },
    setChannelData (state, newChannelData) {
      state.channelData = newChannelData
      function dfs (channel) {
        state.channelMap[channel.channelName] = channel
        channel.children.forEach(dfs)
      }
      state.channelData.forEach(dfs)
    },
    setChannel (state, channelName) {
      state.channelName = channelName
      state.channelId = state.channelMap[channelName].channelId
    },
    changeChannel (state, channelName) {
      if (!state.channelMap[channelName]) return
      state.channelName = channelName
      state.channelId = state.channelMap[channelName].channelId
    }
  },
  getters: {
    url (state) { return state.url },
    channelData (state) { return state.channelData },
    channelName (state) { return state.channelName },
    channelId (state) { return state.channelId }
  }
})
