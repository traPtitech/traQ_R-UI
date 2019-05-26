import client from '@/bin/client'

export default {
  namespaced: false,
  state: {
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
    }
  },
  actions: {
    execStamp({ state, commit, dispatch, rootState }, stamp) {
      if (state.stampPickerMode === 'message') {
        dispatch('addStampToMessage', stamp.id)
      } else {
        commit('messageInput/addStampToInputText', {
          stampName: stamp.name,
          channelId: rootState.currentChannel.channelId
        })
      }
    },
    addStampToMessage({ state }, stampId) {
      client.stampMessage(state.stampPickerModel.messageId, stampId)
    }
  }
}
