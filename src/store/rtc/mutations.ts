import Vue from 'vue'
import traQRTClient from '@/bin/rtc'
import { MutationTree } from 'vuex'
import { S } from './types'

const mutations: MutationTree<S> = {
  setClient(state, instance: traQRTClient) {
    state.client = instance
  },
  destroyClient(state) {
    state.client = undefined
  },
  setLocalStream(state, stream: MediaStream) {
    state.localStream = stream
  },
  destroyLocalStream(state) {
    state.localStream = undefined
  },
  setIsActive(state, isActive: boolean) {
    state.isActive = isActive
  },
  setActiveMediaChannelId(state, channelID: string) {
    state.activeMediaChannelId = channelID
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
