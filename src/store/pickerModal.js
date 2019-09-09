import client from '@/bin/client'
import { changeHash } from '@/bin/utils'
import { throttle } from 'lodash'

export default {
  namespaced: false,
  state: {
    stampPickerActive: false,
    stampPickerMode: 'message',
    stampPickerModel: null,
    stampPickerTemp: {
      messageId: '',
      stampId: '',
      count: 0
    }
  },
  getters: {
    stampPickerActive(state) {
      return state.stampPickerActive
    },
    stampPickerMode(state) {
      return state.stampPickerMode
    },
    stampPickerModel(state) {
      return state.stampPickerModel
    },
    stampPickerTemp(state) {
      return state.stampPickerTemp
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
    },
    setStampPickerTemp(state, temp) {
      state.stampPickerTemp = temp
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
    async addStampToMessage({ state, commit, dispatch }, stampId) {
      const { messageId } = state.stampPickerModel
      commit('updateMessageStampTemporary', { messageId, stampId })

      const temp = state.stampPickerTemp
      if (temp.messageId === messageId && temp.stampId === stampId) {
        commit('setStampPickerTemp', { ...temp, count: temp.count + 1 })
      } else {
        if (temp.messageId !== '') await dispatch('syncMessageStamp')
        commit('setStampPickerTemp', {
          messageId,
          stampId,
          count: 1
        })
      }

      dispatch('throttledSyncMessageStamp')
    },
    async syncMessageStamp({
      state: {
        stampPickerTemp: { messageId, stampId, count }
      },
      commit
    }) {
      await client.stampMessage(messageId, stampId, count)
      commit('setStampPickerTemp', {
        messageId: '',
        stampId: '',
        count: 1
      })
    },
    throttledSyncMessageStamp: throttle(
      ({ dispatch }) => {
        dispatch('syncMessageStamp')
      },
      1000,
      { leading: false }
    )
  }
}
