import { Module } from 'vuex'
import { S, TempRS } from './types'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

const state: S = {
  activeVoiceChannelId: ''
}

const rtc: Module<S, TempRS> = {
  namespaced,
  state,
  mutations,
  actions
}

export default rtc
