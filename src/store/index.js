import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: 'https://traq-dev.herokuapp.com',
    channelData: [],
    channelName: '',
    channelId: '',
    channelMap: {},
    messages: []
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
      let requestName = channelName
      console.log(state.url + '/api/1.0/channels/' + state.channelId + '/messages')
      axios.get(state.url + '/api/1.0/channels/' + state.channelId + '/messages', {
        withCredentials: true
      })
      .then(function (res) {
        console.log(res.data)
        if (state.channelName === requestName) {
          state.messages = res.data
        }
      })
      .catch(function (err) {
        console.log(err)
      })
    }
  },
  getters: {
    url (state) { return state.url },
    channelData (state) { return state.channelData },
    channelName (state) { return state.channelName },
    channelId (state) { return state.channelId },
    messages (state) { return state.messages }
  }
})
