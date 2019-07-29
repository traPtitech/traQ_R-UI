import traQRTCClient from '@/lib/rtc/traQRTCClient'
import AudioStreamMixer from '@/lib/rtc/AudioStreamMixer'
import { getUserAudio, getUserDisplay } from '@/lib/rtc/utils'
import { ActionTree } from 'vuex'
import { S, TempRS } from './types'

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

    const localStream = await getUserAudio()
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
    const mixer = new AudioStreamMixer()
    Object.keys(state.remoteAudioStreamMap).forEach(userId => {
      const stream = state.remoteAudioStreamMap[userId]
      mixer.addStream(userId, stream)
    })
    commit('setMixer', mixer)
  },

  async setStream({ state }, stream: MediaStream) {
    if (!state.client) {
      return
    }
    state.client.setStream(stream)
  },
  async setUserAudio({ state }) {
    if (!state.client) {
      return
    }
    state.client.setStream(await getUserAudio())
  },
  async setUserDisplay({ state }) {
    if (!state.client) {
      return
    }
    state.client.setStream(await getUserDisplay())
  },
  async sendData() {},

  muteLocalStream({ state, commit }) {
    if (!state.localStream) {
      return
    }
    state.localStream.getAudioTracks().forEach(track => {
      track.enabled = false
    })
    commit('setIsMicMuted', true)
  },
  unmuteLocalStream({ state, commit }) {
    if (!state.localStream) {
      return
    }
    state.localStream.getAudioTracks().forEach(track => {
      track.enabled = true
    })
    commit('setIsMicMuted', false)
  }
}

export default actions
