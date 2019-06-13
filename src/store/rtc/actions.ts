import traQRTCClient from '@/lib/rtc/traQRTCClient'
import { getUserAudio, getUserDisplay } from '@/lib/rtc/utils'
import { ActionTree } from 'vuex'
import { S, TempRS } from './types'

const actions: ActionTree<S, TempRS> = {
  async establishConnection({ state, commit, rootState }) {
    if (state.client) {
      state.client.closeConnection()
    }
    const client = new traQRTCClient(rootState.me.userId)
    await client.establishConnection()
    commit('setClient', client)
    commit('setIsActive', true)
  },

  async joinVoiceChannel({ state, commit, dispatch }, room) {
    while (!state.client) {
      await dispatch('establishConnection')
    }

    state.client.addEventListener('userjoin', e => {
      const userId = e.detail.userId
      console.log(`[RTC] User joined, ID: ${userId}`)
    })

    state.client.addEventListener('userleave', e => {
      const userId = e.detail.userId
      console.log(`[RTC] User left, ID: ${userId}`)
      commit('removeRemoteStream', e.detail.userId)
    })

    state.client.addEventListener('streamchange', e => {
      const stream = e.detail.stream
      console.log(`[RTC] Recieved stream from ${stream.peerId}`)

      commit('addRemoteStream', stream)
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
    state.client.closeConnection()
    commit('destroyClient')
    commit('destroyLocalStream')
    commit('resetRemoteStreamsMap')
    commit('setIsActive', false)
    commit('setIsCalling', false)
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