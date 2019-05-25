import { Module } from 'vuex'
import { S, TempRS } from './types'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const namespaced = true

const state: S = {
  isJoined: false,
  activeVoiceChannelId: '',
  remoteAudioStreamMap: {},
  remoteVideoStreamMap: {}
}

const rtc: Module<S, TempRS> = {
  namespaced,
  state,
  mutations,
  actions,
  getters
}

export default rtc
