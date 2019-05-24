import traQRTCClient from '@/bin/rtc'
import { ActionTree } from 'vuex'
import { S, TempRS } from './types'

const actions: ActionTree<S, TempRS> = {
  async establishConnection({ state, commit, rootState }) {
    if (state.client) {
      return
    }
    const client = new traQRTCClient(rootState.me.name)
    await client.establishConnection()
    commit('setClient', client)
  },

  async joinRoom({ state }, room) {
    if (!state.client) {
      return
    }
    await state.client.joinRoom(room)
  },

  async setStream({ state }, stream: MediaStream) {
    if (!state.client) {
      return
    }
    state.client.setStream(stream)
  },
  async sendData() {}
}

export default actions
