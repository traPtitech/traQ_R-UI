import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    inputTextMap: {} // channelId => textString
  },
  getters: {
    inputText: state => channelId => {
      return state.inputTextMap[channelId] || ''
    }
  },
  mutations: {
    setInputText(state, { channelId, inputText }) {
      Vue.set(state.inputTextMap, channelId, inputText)
    },
    addStampToInputText(state, { stampName, channelId }) {
      if (state.inputTextMap[channelId]) {
        state.inputTextMap[channelId] += `:${stampName}:`
      } else {
        Vue.set(state.inputTextMap, channelId, `:${stampName}:`)
      }
    }
  }
}
