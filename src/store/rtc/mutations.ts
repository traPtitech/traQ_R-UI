import Vue from 'vue'
import traQRTClient from '@/bin/rtc'
import { MutationTree } from 'vuex'
import { S } from './types'

const mutations: MutationTree<S> = {
  setIsJoined(state, isJoined: boolean) {
    state.isJoined = isJoined
  },
  setClient(state, instance: traQRTClient) {
    state.client = instance
  },
  addRemoteAudioStream(state, stream: MediaStreamWithPeerId) {
    Vue.set(state.remoteAudioStreamMap, stream.peerId, stream)
  },
  addRemoteVideoStream(state, stream: MediaStreamWithPeerId) {
    Vue.set(state.remoteVideoStreamMap, stream.peerId, stream)
  },
  removeRemoteAudioStream(state, peerId) {
    Vue.delete(state.remoteAudioStreamMap, peerId)
  },
  removeRemoteVideoStream(state, peerId) {
    Vue.delete(state.remoteVideoStreamMap, peerId)
  }
}

export default mutations
