import client from '@/bin/client'

export default {
  namespaced: false,
  state: {
    inputText: '',
    stampPickerActive: false,
    stampPickerMode: 'message',
    stampPickerModel: null
  },
  getters: {
    stampPickerActive(state) {
      return state.stampPickerActive
    },
    stampPickerModel(state) {
      return state.stampPickerModel
    }
  },
  mutations: {
    setInputText(state, text) {
      state.inputText = text
    },
    setStampPickerModel(state, model) {
      state.stampPickerModel = model
    },
    setStampPickerActive(state, isActive) {
      state.stampPickerActive = isActive
    },
    setStampPickerModeAsMessage(state) {
      state.stampPickerMode = 'message'
    },
    setStampPickerModeAsInput(state) {
      state.stampPickerMode = 'input'
    },
    addStampToInputText(state, stampName) {
      state.inputText += `:${stampName}:`
    }
  },
  actions: {
    addStamp({ state, commit, dispatch }, stamp) {
      if (state.stampPickerMode === 'message') {
        dispatch('addStampToMessage', stamp.id)
      } else {
        commit('addStampToInputText', stamp.name)
      }
    },
    addStampToMessage({ state }, stampId) {
      client.stampMessage(state.stampPickerModel.messageId, stampId)
    }
  }
}
