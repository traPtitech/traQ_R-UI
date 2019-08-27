import Vue from 'vue'
import traQRTClient from '@/lib/rtc/traQRTCClient'
import AudioStreamMixer from '@/lib/rtc/AudioStreamMixer'
import { MutationTree } from 'vuex'
import { S } from './types'
import { WebRTCUserState } from 'traq-api'

const mutations: MutationTree<S> = {
  setClient(state, instance: traQRTClient) {
    state.client = instance
  },
  destroyClient(state) {
    state.client = undefined
  },

  setMixer(state, instance: AudioStreamMixer) {
    state.mixer = instance
  },
  destroyMixer(state) {
    state.mixer = undefined
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

  setIsRtcEnabled(state, enabed: boolean) {
    state.isRtcEnabled = enabed
  },

  addRtcState({ rtcState }, state) {
    if (rtcState.includes(state)) {
      return
    }
    rtcState.push(state)
  },
  removeRtcState({ rtcState }, state) {
    const index = rtcState.findIndex(state)
    if (index !== -1) {
      rtcState.splice(index, 1)
    }
  },
  clearRtcState({ rtcState }) {
    rtcState.splice(0, rtcState.length)
  },

  setIsMicMuted(state, isMicMuted: boolean) {
    state.isMicMuted = isMicMuted
  },

  setActiveMediaChannelId(state, channelID: string) {
    state.activeMediaChannelId = channelID
  },

  setUserState(state, payload: WebRTCUserState) {
    if (!payload.userId) {
      return
    }
    Vue.set(state.userStateMap, payload.userId, payload)
  },

  setUserVolume(state, { userId, volume }: { userId: string; volume: number }) {
    state.userVolumeMap = { ...state.userVolumeMap, [userId]: volume }
    if (state.mixer) {
      state.mixer.setVolumeOf(userId, volume)
    }
  },

  addRemoteStreamToMap(state, stream: MediaStreamWithPeerId) {
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
  removeRemoteStreamFromMap(state, peerId) {
    if (peerId in state.remoteAudioStreamMap) {
      Vue.delete(state.remoteAudioStreamMap, peerId)
    } else if (peerId in state.remoteVideoStreamMap) {
      Vue.delete(state.remoteVideoStreamMap, peerId)
    }
  },
  resetRemoteStreamsMap(state) {
    state.remoteAudioStreamMap = {}
    state.remoteVideoStreamMap = {}
  },
  setAudioInputDeviceId(state, deviceId) {
    state.audioInputDeviceId = deviceId
  },
  setAudioOutputDeviceId(state, deviceId) {
    state.audioOutputDeviceId = deviceId
  }
}

export default mutations
