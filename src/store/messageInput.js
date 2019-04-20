import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    inputTextMap: {}, // channelId => textString´
    inputFilesMap: {} // channelId => filesArray
  },
  getters: {
    inputText: state => channelId => {
      return state.inputTextMap[channelId] || ''
    },
    inputFiles: state => channelId => {
      return state.inputFilesMap[channelId] || []
    }
  },
  mutations: {
    setInputText(state, { channelId, inputText }) {
      Vue.set(state.inputTextMap, channelId, inputText)
    },
    setInputFiles(state, { channelId, files }) {
      Vue.set(state.inputFilesMap, channelId, files)
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
