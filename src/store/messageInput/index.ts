import Vue from 'vue'
import { S, G, M, A } from './type'
import { Getters, Mutations, Actions } from 'vuex'
import client from '@/bin/client'

const state = (): S => ({
  inputTextMap: {}, // channelId => textString´
  inputFilesMap: {} // channelId => filesArray
})

const getters: Getters<S, G> = {
  inputText: state => channelId => {
    return state.inputTextMap[channelId] || ''
  },
  inputFiles: state => channelId => {
    return state.inputFilesMap[channelId] || []
  }
}
const mutations: Mutations<S, M> = {
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

const acions: Actions<S, A, G, M> = {
  addStampToMessage({ rootState }, stampId) {
    client.stampMessage(
      rootState.pickerModal.stampPickerModel.messageId,
      stampId
    )
  },
  execStamp({ state, commit, dispatch, rootState }, stamp) {
    if (rootState.pickerModal.stampPickerMode === 'message') {
      dispatch('addStampToMessage', stamp.id)
    } else {
      commit('addStampToInputText', {
        stampName: stamp.name || '',
        channelId: rootState.currentChannel.channelId || ''
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  acions
}
