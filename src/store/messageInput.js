import Vue from 'vue'
import { valueOrDefault } from '../bin/utils'

export default {
  namespaced: true,
  state: {
    inputTextMap: {}, // channelId => textString
    inputFilesMap: {}, // channelId => filesArray
    inputSelectMap: {} // channelId => SelectionEnd
  },
  getters: {
    inputText: state => channelId => {
      return state.inputTextMap[channelId] || ''
    },
    inputFiles: state => channelId => {
      return state.inputFilesMap[channelId] || []
    },
    inputSelect: state => channelId => {
      const textSize = (state.inputText[channelId] || '').length
      return valueOrDefault(state.inputSelectMap[channelId], textSize)
    }
  },
  mutations: {
    setInputText(state, { channelId, inputText }) {
      Vue.set(state.inputTextMap, channelId, inputText)
    },
    setInputFiles(state, { channelId, files }) {
      Vue.set(state.inputFilesMap, channelId, files)
    },
    setInputSelect(state, { channelId, selectionEnd }) {
      Vue.set(state.inputSelectMap, channelId, selectionEnd)
    },
    addStampToInputText(state, { stampName, channelId }) {
      const inputText = state.inputTextMap[channelId]
      if (inputText) {
        const insertPos = valueOrDefault(
          state.inputSelectMap[channelId],
          inputText.length
        )
        Vue.set(
          state.inputTextMap,
          channelId,
          `${inputText.slice(0, insertPos)}:${stampName}:${inputText.slice(
            insertPos
          )}`
        )
        Vue.set(
          state.inputSelectMap,
          channelId,
          insertPos + stampName.length + 2
        )
      } else {
        Vue.set(state.inputTextMap, channelId, `:${stampName}:`)
        Vue.set(state.inputSelectMap, channelId, stampName.length + 2)
      }
    }
  }
}
