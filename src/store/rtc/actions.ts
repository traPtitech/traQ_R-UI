import traQRTCClient from '@/lib/rtc/traQRTCClient'
import AudioStreamMixer from '@/lib/rtc/AudioStreamMixer'
import { getUserAudio, getUserDisplay } from '@/lib/rtc/utils'
import { ActionTree } from 'vuex'
import { S, TempRS } from './types'

import indexedDB from '@/bin/indexeddb.js'
const db = indexedDB.db

const actions: ActionTree<S, TempRS> = {
  async establishConnection({ state, commit, rootState, dispatch }) {
    if (state.client) {
      state.client.closeConnection()
    }
    const client = new traQRTCClient(rootState.me.userId)
    client.addEventListener('connectionerror', e => {
      if (e.detail.error.startsWith('Error: PeerId')) {
        console.error(`[RTC] Peer Id already in use!`)
      }
      console.log(
        `[RTC] Failed to establish connection, trying to reconnect...`
      )
      dispatch('closeConnection')
      dispatch('establishConnection')
    })
    await client.establishConnection()
    commit('setClient', client)
    commit('setIsActive', true)
  },

  async joinVoiceChannel({ state, commit, dispatch }, room) {
    while (!state.client) {
      await dispatch('establishConnection')
    }
    dispatch('initializeMixer')
    if (!state.mixer) {
      return
    }
    ;(window as any).mixer = state.mixer

    state.client.addEventListener('userjoin', e => {
      const userId = e.detail.userId
      console.log(`[RTC] User joined, ID: ${userId}`)
      // commit('setUserVolume', { userId, volume: 1 })
    })

    state.client.addEventListener('userleave', async e => {
      const userId = e.detail.userId
      console.log(`[RTC] User left, ID: ${userId}`)
      commit('removeRemoteStreamFromMap', userId)

      if (state.mixer) {
        await state.mixer.removeStream(userId)
      }
    })

    state.client.addEventListener('streamchange', async e => {
      const stream = e.detail.stream
      const userId = stream.peerId
      console.log(`[RTC] Recieved stream from ${stream.peerId}`)
      commit('addRemoteStreamToMap', stream)

      if (state.mixer) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await state.mixer.addStream(stream.peerId, stream)
      }
      commit('setUserVolume', { userId, volume: 1 })
    })

    const localStream = await getUserAudio(state.audioInputDeviceId)
    commit('setLocalStream', localStream)

    await state.client.joinRoom(room, localStream)
    commit('setIsCalling', true)
    commit('setActiveMediaChannelId', state.client.roomName)
  },

  closeConnection({ state, commit }) {
    if (!state.client) {
      return
    }
    if (state.mixer) {
      state.mixer.muteAll()
    }
    state.client.closeConnection()
    commit('destroyClient')
    commit('destroyMixer')
    commit('destroyLocalStream')
    commit('resetRemoteStreamsMap')
    commit('setIsActive', false)
    commit('setIsCalling', false)
  },

  initializeMixer({ state, commit }) {
    const mixer = new AudioStreamMixer(state.audioOutputDeviceId)
    Object.keys(state.remoteAudioStreamMap).forEach(userId => {
      const stream = state.remoteAudioStreamMap[userId]
      mixer.addStream(userId, stream)
    })
    commit('setMixer', mixer)
  },

  setMixerSinkId({ state }) {
    if (!state.mixer) {
      return
    }
    state.mixer.setSinkId(state.audioOutputDeviceId)
  },

  async setStream({ state, commit }, stream: MediaStream) {
    if (!state.client) {
      return
    }
    state.client.setStream(stream)
    commit('setLocalStream', stream)
  },
  async setUserAudio({ state, dispatch }) {
    dispatch('setStream', await getUserAudio(state.audioInputDeviceId))
  },
  async setUserDisplay({ dispatch }) {
    dispatch('setStream', await getUserDisplay())
  },
  async sendData() {},

  muteLocalStream({ state, dispatch }) {
    if (!state.localStream) {
      return
    }
    ;(state.localStream as any).userMuted = true
    state.localStream.getAudioTracks().forEach(track => {
      track.enabled = false
    })
    dispatch('updateIsMicMuted', true)
  },
  unmuteLocalStream({ state, dispatch }) {
    if (!state.localStream) {
      return
    }
    ;(state.localStream as any).userMuted = false
    state.localStream.getAudioTracks().forEach(track => {
      track.enabled = true
    })
    dispatch('updateIsMicMuted', false)
  },

  loadSetting({ dispatch }) {
    return Promise.all([
      dispatch('loadIsRtcEnabled'),
      dispatch('loadIsMicMuted'),
      dispatch('loadAudioInputDeviceId'),
      dispatch('loadAudioOutputDeviceId')
    ])
  },

  loadIsRtcEnabled({ commit, dispatch }) {
    return db
      .read('browserSetting', 'rtc/isRtcEnabled')
      .then((data: any) => {
        commit('setIsRtcEnabled', data)
      })
      .catch(async () => {
        await dispatch('updateIsRtcEnabled', false)
      })
  },
  loadIsMicMuted({ commit, dispatch }) {
    return db
      .read('browserSetting', 'rtc/isMicMuted')
      .then((data: any) => {
        commit('setIsMicMuted', data)
      })
      .catch(async () => {
        await dispatch('updateIsMicMuted', false)
      })
  },
  loadAudioInputDeviceId({ commit, dispatch }) {
    return db
      .read('browserSetting', 'rtc/audioInputDeviceId')
      .then((data: any) => {
        commit('setAudioInputDeviceId', data)
      })
      .catch(async () => {
        await dispatch('updateAudioInputDeviceId', 'default')
      })
  },
  loadAudioOutputDeviceId({ commit, dispatch }) {
    return db
      .read('browserSetting', 'rtc/audioOutputDeviceId')
      .then((data: any) => {
        commit('setAudioOutputDeviceId', data)
      })
      .catch(async () => {
        await dispatch('updateAudioOutputDeviceId', 'default')
      })
  },

  updateIsRtcEnabled({ commit }, enabled) {
    commit('setIsRtcEnabled', enabled)
    return db.write('browserSetting', {
      type: 'rtc/isRtcEnabled',
      data: enabled
    })
  },
  updateIsMicMuted({ commit }, muted) {
    commit('setIsMicMuted', muted)
    return db.write('browserSetting', { type: 'rtc/isMicMuted', data: muted })
  },
  updateAudioInputDeviceId({ commit, dispatch }, deviceId) {
    commit('setAudioInputDeviceId', deviceId)

    // 入力を切り替える
    dispatch('setUserAudio')

    return db.write('browserSetting', {
      type: 'rtc/audioInputDeviceId',
      data: deviceId
    })
  },
  updateAudioOutputDeviceId({ commit, dispatch }, deviceId) {
    commit('setAudioOutputDeviceId', deviceId)

    // 出力を切り替える
    dispatch('setUserAudio')

    return db.write('browserSetting', {
      type: 'rtc/audioOutputDeviceId',
      data: deviceId
    })
  }
}

export default actions
