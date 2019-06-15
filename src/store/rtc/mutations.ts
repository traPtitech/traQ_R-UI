import Vue from 'vue'
import traQRTClient from '@/lib/rtc/traQRTCClient'
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
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop())
    }
    state.localStream = undefined
  },
  setIsActive(state, isActive: boolean) {
    state.isActive = isActive
  },
  setIsCalling(state, isCalling: boolean) {
    state.isCalling = isCalling
  },
  setIsMicMuted(state, isMicMuted: boolean) {
    state.isMicMuted = isMicMuted
  },
  setActiveMediaChannelId(state, channelID: string) {
    state.activeMediaChannelId = channelID
  },
  setUserVolume(state, { userId, volume }: { userId: string; volume: number }) {
    state.userVolumeMap[userId] = volume
  },
  addRemoteStream(state, stream: MediaStreamWithPeerId) {
    const peerId = stream.peerId
    if (peerId in state.remoteAudioStreamMap) {
      Vue.delete(state.remoteAudioStreamMap, peerId)
    } else if (peerId in state.remoteVideoStreamMap) {
      Vue.delete(state.remoteVideoStreamMap, peerId)
    }
    if (stream.getVideoTracks().length === 0) {
      Vue.set(state.remoteAudioStreamMap, stream.peerId, stream)
    } else {
      Vue.set(state.remoteVideoStreamMap, stream.peerId, stream)
    }
  },
  removeRemoteStream(state, peerId) {
    if (peerId in state.remoteAudioStreamMap) {
      Vue.delete(state.remoteAudioStreamMap, peerId)
    } else if (peerId in state.remoteVideoStreamMap) {
      Vue.delete(state.remoteVideoStreamMap, peerId)
    }
  },
  resetRemoteStreamsMap(state) {
    state.remoteAudioStreamMap = {}
    state.remoteVideoStreamMap = {}
  }
}

export default mutations
