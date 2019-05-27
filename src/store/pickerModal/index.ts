import client from '@/bin/client'
import { S, G, M, A } from './type'
import { Getters, Mutations, Actions } from 'vuex'

const state = (): S => ({
  stampPickerActive: false,
  stampPickerMode: 'message',
  stampPickerModel: null
})
const getters: Getters<S, G> = {
  stampPickerActive(state) {
    return state.stampPickerActive
  },
  stampPickerModel(state) {
    return state.stampPickerModel
  }
}
const mutations: Mutations<S, M> = {
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
}

const actions: Actions<S, A, G, M> = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
