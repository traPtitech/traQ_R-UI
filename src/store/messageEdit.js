import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    editedMap: {} // messageId => textString
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
    addStampToEdited(state, { stampName, messageId }) {
      if (state.editedMap[messageId]) {
        state.editedMap[messageId] += `:${stampName}:`
      } else {
        Vue.set(state.editedMap, messageId, `:${stampName}:`)
      }
    }
  }
}
