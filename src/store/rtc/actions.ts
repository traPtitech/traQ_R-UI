import traQRTCClient, { getUserAudio, getUserDisplay } from '@/bin/rtc'
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
  },

  async joinRoom({ state, commit }, room) {
    if (!state.client) {
      return
    }
    state.client.addEventListener('userjoin', e => {
      const userId = e.detail.userId
      console.log(`[RTC] User joined, ID: ${userId}`)
      commit('removeRemoteAudioStream', e.detail.userId)
    })
    state.client.addEventListener('userleave', e => {
      const userId = e.detail.userId
      console.log(`[RTC] User left, ID: ${userId}`)
    })
    state.client.addEventListener('streamchange', e => {
      const stream = e.detail.stream
      console.log(`[RTC] Recieved stream from ${stream.peerId}`)

      if (stream.getVideoTracks().length === 0) {
        commit('addRemoteAudioStream', stream)
      } else {
        commit('addRemoteVideoStream', stream)
      }
    })
    await state.client.joinRoom(room, await getUserAudio())
    commit('setIsJoined', true)
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
  async sendData() {}
}

export default actions
