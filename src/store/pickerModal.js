import client from '@/bin/client'
import { changeHash } from '@/bin/utils'

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
      if (isActive) {
        changeHash('PickerModal')
      } else if (location.hash === '#PickerModal') {
        changeHash('')
      }
    },
    setStampPickerModeAsMessage(state) {
      state.stampPickerMode = 'message'
    },
    setStampPickerModeAsInput(state) {
      state.stampPickerMode = 'input'
    },
    setStampPickerModeAsEdit(state) {
      state.stampPickerMode = 'edit'
    }
  },
  actions: {
    execStamp({ state, commit, dispatch, rootState }, stamp) {
      switch (state.stampPickerMode) {
        case 'message':
          dispatch('addStampToMessage', stamp.id)
          break
        case 'input':
          commit('messageInput/addStampToInputText', {
            stampName: stamp.name,
            channelId: rootState.currentChannel.channelId
          })
          break
        case 'edit':
          commit('messageEdit/addStampToEdited', {
            stampName: stamp.name,
            messageId: state.stampPickerModel.messageId
          })
          break
        default:
      }
    },
    addStampToMessage({ state }, stampId) {
      client.stampMessage(state.stampPickerModel.messageId, stampId)
    }
  }
}
