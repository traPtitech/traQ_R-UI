import Vue from 'vue'
import { valueOrDefault } from '../bin/utils'

export default {
  namespaced: true,
  state: {
    editedMap: {}, // messageId => textString
    selectMap: {} // messageId => selectionEnd
  },
  getters: {
    edited: state => messageId => {
      return state.editedMap[messageId] || ''
    }
  },
  mutations: {
    setEdited(state, { edited, messageId }) {
      Vue.set(state.editedMap, messageId, edited)
    },
    setSelect(state, { selectionEnd, messageId }) {
      Vue.set(state.selectMap, messageId, selectionEnd)
    },
    addStampToEdited(state, { stampName, messageId }) {
      const editedText = state.editedMap[messageId]
      if (editedText) {
        const insertPos = valueOrDefault(
          state.selectMap[messageId],
          editedText.length
        )
        state.editedMap[messageId] = `${editedText.slice(
          0,
          insertPos
        )}:${stampName}:${editedText.slice(insertPos)}`
        state.selectMap[messageId] = insertPos + stampName.length + 2
      } else {
        Vue.set(state.editedMap, messageId, `:${stampName}:`)
      }
    }
  }
}
